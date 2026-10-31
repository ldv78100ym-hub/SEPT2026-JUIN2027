/* ============================================================
   5. CANVAS 3D
   ============================================================ */
const canvas = $('tower');
const ctx = canvas.getContext('2d');
let W = 900, H = 700;

const HH = 1.0;
const CAMDIST = 8.5;
const FOV = 11;
const PIX = 52;
const TILT = 0.34;

function floorHalfWidth(i){
  const t = i / Math.max(1, N_TOT-1);
  const env = 0.85 + 0.5 * Math.sin(Math.PI * t);
  const alt = (i % 2 === 0) ? 0.12 : -0.12;
  const terrace = (i % 5 === 0) ? 0.28 : 0;
  return 1.5 * env + alt + terrace;
}

let stars = [];
function makeStars(){
  stars = [];
  for(let i=0;i<80;i++){
    stars.push({ x:Math.random(), y:Math.random(), r:Math.random()*1.4+0.5, a:Math.random()*0.5+0.15 });
  }
}

function resizeCanvas(){
  const dpr = window.devicePixelRatio || 1;
  const r = canvas.getBoundingClientRect();
  canvas.width  = Math.max(1, Math.round(r.width  * dpr));
  canvas.height = Math.max(1, Math.round(r.height * dpr));
  ctx.setTransform(dpr,0,0,dpr,0,0);
  W = r.width; H = r.height;
}
window.addEventListener('resize', resizeCanvas);

function proj(x,y,z){
  const ca = Math.cos(state.angle), sa = Math.sin(state.angle);
  const x1 = x*ca - z*sa;
  const z1 = x*sa + z*ca;
  const y1 = y - state.camY;
  const d  = Math.max(z1 + CAMDIST, 0.6);
  const s  = (FOV/d) * PIX;
  return { x: W/2 + x1*s, y: H/2 - (y1 + TILT*z1)*s, s };
}

function quad(a,b,c,d,fill,stroke){
  ctx.beginPath();
  ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
  ctx.lineTo(c.x,c.y); ctx.lineTo(d.x,d.y);
  ctx.closePath();
  if(fill){ ctx.fillStyle = fill; ctx.fill(); }
  if(stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = 1.2; ctx.stroke(); }
}

function drawFloorShape(i){
  if(i > state.maxBuiltFloor) return;
  const w = floorHalfWidth(i);
  const yb = i*HH, yt = (i+1)*HH;
  const b0 = proj(-w,yb,-w), b1 = proj(w,yb,-w), b2 = proj(w,yb,w), b3 = proj(-w,yb,w);
  const t0 = proj(-w,yt,-w), t1 = proj(w,yt,-w), t2 = proj(w,yt,w), t3 = proj(-w,yt,w);

  const maxY = Math.max(t0.y,t1.y,t2.y,t3.y);
  const minY = Math.min(b0.y,b1.y,b2.y,b3.y);
  if(maxY < -180 || minY > H+180) return;

  const ca = Math.cos(state.angle), sa = Math.sin(state.angle);
  const isCur = (Math.round(state.visualFloor) === i);
  const isOpened = (i === state.doorFloor);
  const isValidated = state.validated.has(NOTIONS[i].id);
  const hue = FAMILY_HUES[NOTIONS[i].family] || 200;

  const cZ   = `hsl(${hue},${isCur?60:45}%,${isCur?52:36}%)`;
  const cX   = `hsl(${hue},${isCur?60:45}%,${isCur?40:26}%)`;
  const cTop = `hsl(${hue},${isCur?70:55}%,${isCur?78:56}%)`;
  let edge = isCur ? `hsl(${hue},90%,68%)` : `hsl(${hue},50%,42}%)`;
  if(isOpened) edge = 'rgba(255,215,120,1)';

  const builder = SHAPE_BUILDERS[FLOOR_SHAPES[NOTIONS[i].id]] || SHAPE_BUILDERS.box;
  const raw = builder(w, yb, yt) || [];
  const faces = [];
  for(const qd of raw){
    if(!qd || !qd.v || qd.v.length < 3) continue;
    let sumd = 0; const pts = [];
    for(const p of qd.v){
      const pr = proj(p[0], p[1], p[2]);
      sumd += p[0]*sa + p[2]*ca;
      pts.push(pr);
    }
    const A = qd.v[0], B = qd.v[1], C = qd.v[2];
    const u = [B[0]-A[0], B[1]-A[1], B[2]-A[2]], vv = [C[0]-A[0], C[1]-A[1], C[2]-A[2]];
    const n = [u[1]*vv[2]-u[2]*vv[1], u[2]*vv[0]-u[0]*vv[2], u[0]*vv[1]-u[1]*vv[0]];
    const ay = Math.abs(n[1]), ax = Math.abs(n[0]*ca-n[2]*sa), az = Math.abs(n[0]*sa+n[2]*ca);
    const fill = (ay>=ax && ay>=az) ? cTop : (az>=ax ? cZ : cX);
    faces.push({ pts, d: sumd/qd.v.length, fill });
  }
  faces.sort((F,G) => G.d - F.d);
  for(const f of faces){
    if(f.pts.length >= 4){
      quad(f.pts[0], f.pts[1], f.pts[2], f.pts[3], f.fill, edge);
    } else {
      ctx.beginPath();
      ctx.moveTo(f.pts[0].x, f.pts[0].y);
      ctx.lineTo(f.pts[1].x, f.pts[1].y);
      ctx.lineTo(f.pts[2].x, f.pts[2].y);
      ctx.closePath();
      ctx.fillStyle = f.fill; ctx.fill();
      ctx.strokeStyle = edge; ctx.lineWidth = 1.2; ctx.stroke();
    }
  }

  if(isValidated && !isOpened){
    ctx.save();
    ctx.globalAlpha = 0.18;
    quad(t0,t1,t2,t3, 'rgba(255,225,130,0.9)', 'rgba(255,215,110,0.9)');
    ctx.restore();
  }

  if(isCur && !isOpened){
    ctx.save();
    ctx.globalAlpha = 0.42;
    quad(t0,t1,t2,t3, 'rgba(120,240,225,0.35)', 'rgba(140,255,245,1)');
    ctx.restore();
  }
}

