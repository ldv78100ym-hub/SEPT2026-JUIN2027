/* ============================================================
   1. HELPERS & MATHJAX
   ============================================================ */
const R    = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const nz   = (a,b) => { let v=0; while(v===0) v=R(a,b); return v; };
const pick = a => a[Math.floor(Math.random()*a.length)];
const shuffle = a => { for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
const clamp = (x,a,b) => Math.max(a, Math.min(b, x));

const NEG = "\u2212", UP = "\u2197", DOWN = "\u2198", FLAT = "\u2192", PI = "\u03c0", SQ = "\u221a";
const attM = n => String(n).replace(/-/g, NEG);
const fr = function (n) { var s = (Math.round(n * 100) / 100).toString(); if (s.indexOf(".") >= 0) s = s.replace(/0+$/, "").replace(/\.$/, ""); return s.replace(".", ","); };
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); }

const sg = n => n>0 ? `+${n}` : (n<0 ? `${n}` : '');
const cf = n => n===1 ? '' : (n===-1 ? '-' : `${n}`);
const xMinus = v => v === 0 ? 'x' : (v > 0 ? `x-${v}` : `x+${-v}`);

function polyStr(terms){
  let out='';
  for(const [c,s] of terms){
    if(c===0) continue;
    const a=Math.abs(c);
    const body = (s==='') ? `${a}` : ((a===1?'':`${a}`)+s);
    out += (out==='' ? (c<0?'-':'') : (c<0?'-':'+')) + body;
  }
  return out==='' ? '0' : out;
}
function lineq(m,p){
  if(m===0) return `y=${p}`;
  let s='y=';
  if(m===1) s+='x'; else if(m===-1) s+='-x'; else s+=`${m}x`;
  if(p!==0) s += (p>0?`+${p}`:`${p}`);
  return s;
}
function cz(re,im){
  if(im===0) return `${re}`;
  let s='';
  if(re!==0) s+=`${re}`;
  if(im===1) s += (re!==0?'+':'')+'i';
  else if(im===-1) s += (re!==0?'-':'')+'i';
  else s += (im>0 && re!==0 ? '+':'') + `${im}i`;
  return s;
}
function binom(n,k){ let r=1; for(let i=0;i<k;i++) r=r*(n-i)/(i+1); return Math.round(r); }
function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ [a,b]=[b,a%b]; } return a; }
function frac(n,d){
  if(d===0) return '\\infty';
  const sign = (n*d < 0) ? '-' : '';
  let an = Math.abs(n), ad = Math.abs(d);
  const g = gcd(an,ad) || 1;
  an /= g; ad /= g;
  if(ad === 1) return `${sign}${an}`;
  return `${sign}\\dfrac{${an}}{${ad}}`;
}

function M(s) {
  if (typeof s !== 'string') return s;
  if (s.startsWith('\\(') || s.startsWith('$')) return s;
  return `\\(${s}\\)`;
}

function QCM(prompt, correct, wrongs, penalty=1, explain=null){
  const seen = new Set([correct]);
  const opts = [{t:correct, ok:true}];
  for(const w of wrongs){
    if(seen.has(w)) continue;
    seen.add(w);
    opts.push({t:w, ok:false});
  }
  // Proposition « Autre » : simple distracteur en plus des propositions existantes.
  // La vraie bonne réponse reste TOUJOURS dans la liste : une réponse juste ne
  // doit jamais être pénalisée (l'ancien tirage 1/6 qui la retirait est supprimé).
  if(!seen.has('Autre')){
    opts.push({t:'Autre', ok:false});
  }
  return {prompt, options: shuffle(opts), penalty, explain};
}

function EXPL(cours, methode, piege){
  return `
    <div class="ex-section good">
      <h4>📘 Le cours</h4>
      <div>${cours}</div>
    </div>
    <div class="ex-section">
      <h4>🔍 La méthode sur cet exemple</h4>
      <div>${methode}</div>
    </div>
    <div class="ex-section warn">
      <h4>⚠️ L'erreur à éviter</h4>
      <div>${piege}</div>
    </div>`;
}

function tableHTML(header, rows){
  let h='<table class="tt"><thead><tr>';
  header.forEach(c=>{ h+=`<th>${c}</th>`; });
  h+='</tr></thead><tbody>';
  rows.forEach(r=>{
    h+='<tr>';
    r.forEach((c,i)=>{ h+=`<td${i===0?' class="lab"':''}>${c}</td>`; });
    h+='</tr>';
  });
  return h+'</tbody></table>';
}

function curveSVG(fn, xmin, xmax, ymin, ymax, W=320, H=210){
  const sx = x => (x-xmin)/(xmax-xmin)*W;
  const sy = y => H - (y-ymin)/(ymax-ymin)*H;
  let d='';
  const N=260;
  for(let i=0;i<=N;i++){
    const x = xmin + (xmax-xmin)*i/N;
    const y = fn(x);
    if(!isFinite(y)) continue;
    d += (d===''?'M':'L') + sx(x).toFixed(1) + ' ' + sy(y).toFixed(1) + ' ';
  }
  let s = `<svg class="curve" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  s += `<rect width="${W}" height="${H}" fill="#fbf6e8"/>`;
  for(let x=Math.ceil(xmin); x<=xmax; x++)
    s += `<line x1="${sx(x)}" y1="0" x2="${sx(x)}" y2="${H}" stroke="#e4d8ba" stroke-width="1"/>`;
  for(let y=Math.ceil(ymin); y<=ymax; y++)
    s += `<line x1="0" y1="${sy(y)}" x2="${W}" y2="${sy(y)}" stroke="#e4d8ba" stroke-width="1"/>`;
  s += `<line x1="0" y1="${sy(0)}" x2="${W}" y2="${sy(0)}" stroke="#9b8a5e" stroke-width="1.4"/>`;
  s += `<line x1="${sx(0)}" y1="0" x2="${sx(0)}" y2="${H}" stroke="#9b8a5e" stroke-width="1.4"/>`;
  s += `<path d="${d}" fill="none" stroke="#0e8f82" stroke-width="2.6" stroke-linejoin="round"/>`;
  s += `</svg>`;
  return s;
}

