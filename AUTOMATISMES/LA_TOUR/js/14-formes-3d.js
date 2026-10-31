/* ============================================================
   UNE FORME 3D PAR NOTION
   Chaque étage adopte la silhouette de la notion qu'il abrite :
   le π extrudé pour le calcul, la sphère pour le cercle
   trigonométrique, l'arche parabolique pour le second degré,
   la part de gâteau pour les fractions, la flèche pour les
   vecteurs, l'escalier pour les suites, l'arbre pour les
   probabilités, le damier pour les tableaux de signes, etc.
   ============================================================ */

const FLOOR_SHAPES = {
  // — Primaire : les calculs sous le signe π —
  'p-addsub':'pi', 'p-multdiv':'pi', 'p-probleme':'pi',
  'p-compare':'twin',
  'p-fraction':'cake', 'p-decimaux':'cake',
  'p-conversion':'colonnade', 'u-conversions':'lighthouse', 'u-mesures':'colonnade', 'p-geo':'cyl', 'p-prop':'ramp',
  'p-heure':'clock', 'p-suite':'stairs', 'p-romain':'colonnade',
  'p-symetrie':'dome',
  // — Collège —
  'c-relatifs':'plus', 'c-fracops':'cake', 'c-puissances':'xgate',
  'c-racines':'root', 'c-litteral':'nest', 'c-eq1':'equalsign',
  'c-ineq1':'equalsign', 'c-pourc':'cake', 'c-pythagore':'wedge',
  'c-thales':'wedge', 'c-trigo':'wedge', 'c-angles':'arc',
  'c-affine':'ramp', 'c-fonction':'wave', 'c-stat':'bars',
  'c-proba':'tree', 'c-reperage':'grid', 'c-volumes':'cyl',
  'c-pgcd':'nest', 'c-transfo':'dome',
  // — Seconde : l'emboîtement pour la factorisation —
  's-ensembles':'nest',
  's-facto':'nest', 's-facto2':'nest', 's-facto3':'nest',
  's-facto4':'nest', 's-facto5':'nest', 's-facto6':'nest',
  's-eqproduit':'xgate', 's-signe':'checker', 's-fonction2':'wave',
  's-variations':'hourglass', 's-ref':'wave', 's-vecteurs':'arrow',
  's-droites':'wedge', 's-systeme':'grid', 's-grapheq':'wave',
  's-graphineq':'wave', 's-stat2':'bars', 's-proba2':'tree',
  's-taux':'ramp', 's-algo':'stairs', 's-courbeequation':'wedge',
  'py-trous':'stairs', 'py-analyse':'stairs', 'py-whilefor':'stairs',
  'py-forwhile':'stairs',
  'lit-identifier':'grid', 'lit-mecanique':'wedge', 'lit-electro-thermo':'arrow', 'lit-chimie':'cake',
  'lit-ondes':'sphere', 'lit-geometrie':'dome', 'lit-suites-stats':'stairs', 'lit-economie':'ramp',
  'lit-algebre':'xgate', 'lit-numeric':'pi', 'notation-f':'twin',
  's-transfo':'dome',
  // — Première : l'arche parabolique du second degré —
  't-canonique':'arch', 't-discriminant':'arch', 't-solve2deg':'arch',
  't-trinomesigne':'checker', 't-derivee':'dometangent',
  't-deriveept':'dometangent', 't-tangente':'wedge',
  't-tangentegraph':'wedge', 't-fprimevariation':'hourglass',
  't-courbederivee':'wave', 't-polynome3':'wave',
  't-suitearith':'stairs', 't-suitegeo':'stack', 't-suitegraph':'stairs',
  't-evolutions':'cake', 't-trigo2':'sphere', 't-scalaire':'arrow',
  't-proba3':'tree', 't-graphtaux':'ramp', 't-graphineq2':'arch',
  't-comparaison':'twin', 't-rotation':'dome',
  't-angles-orientes':'arc', 't-associes':'arc', 't-eqtrigo':'sphere',
  't-ineqtrigo':'sphere', 't-courbetrigo':'wave', 't-euler':'stairs',
  // — Terminale & spécialités —
  'sd-formes':'arch', 'sd-eq':'arch', 'droites':'wedge',
  'nbre-derive':'dometangent', 'fn-derivees':'dometangent',
  'tab-signes':'checker', 'tab-variations':'hourglass',
  'suites-arith':'stairs', 'suites-geo':'stack', 'pourcentages':'cake',
  'trigonometrie':'sphere', 'prod-scalaire':'arrow',
  'cplx-alg':'hexa', 'cplx-trigo':'spiral', 'stats':'bars',
  'proba-cond':'tree', 'bernoulli':'checker', 'primitives':'stairs',
  'euler':'stairs', 'degre3':'wave',
  'x-trinome':'arch', 'x-derivee':'funnel', 'x-phare':'lighthouse'
};

const _TAU = Math.PI*2;
function _bq(x0,y0,z0,x1,y1,z1){
  return [
    {v:[[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]]},
    {v:[[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0]]},
    {v:[[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]]},
    {v:[[x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0]]},
    {v:[[x1,y0,z0],[x1,y0,z1],[x1,y1,z1],[x1,y1,z0]]}
  ];
}
function _ringSeg(cx,cz,r,a0,a1,y0,y1){
  return {v:[[cx+r*Math.cos(a0),y0,cz+r*Math.sin(a0)],
             [cx+r*Math.cos(a1),y0,cz+r*Math.sin(a1)],
             [cx+r*Math.cos(a1),y1,cz+r*Math.sin(a1)],
             [cx+r*Math.cos(a0),y1,cz+r*Math.sin(a0)]]};
}
function _diskSeg(cx,cz,r,a0,a1,y){
  return {v:[[cx,y,cz],
             [cx+r*Math.cos(a0),y,cz+r*Math.sin(a0)],
             [cx+r*Math.cos(a1),y,cz+r*Math.sin(a1)],
             [cx,y,cz]]};
}
const _shDome = (w,yb,yt)=>{
  const R = w*0.85, D = (yt-yb)*0.95, N = 10, M = 6, q = [];
  for(let m=0;m<M;m++){
    const p0 = Math.PI*0.5*m/M, p1 = Math.PI*0.5*(m+1)/M;
    const r0 = R*Math.cos(p0), r1 = R*Math.cos(p1);
    const y0 = yb+D*Math.sin(p0), y1 = yb+D*Math.sin(p1);
    for(let k=0;k<N;k++){
      const a0 = k*_TAU/N, a1 = (k+1)*_TAU/N;
      q.push({v:[[r0*Math.cos(a0),y0,r0*Math.sin(a0)],
                  [r1*Math.cos(a0),y1,r1*Math.sin(a0)],
                  [r1*Math.cos(a1),y1,r1*Math.sin(a1)],
                  [r0*Math.cos(a1),y0,r0*Math.sin(a1)]]});
    }
  }
  return q;
};
const _shSphere = (w,yb,yt)=>{
  const R = w*0.8, cy = yb+(yt-yb)/2, N = 10, M = 8, q = [];
  for(let m=0;m<M;m++){
    const p0 = -Math.PI/2+Math.PI*m/M, p1 = -Math.PI/2+Math.PI*(m+1)/M;
    const r0 = R*Math.cos(p0), r1 = R*Math.cos(p1);
    const y0 = cy+R*Math.sin(p0), y1 = cy+R*Math.sin(p1);
    for(let k=0;k<N;k++){
      const a0 = k*_TAU/N, a1 = (k+1)*_TAU/N;
      q.push({v:[[r0*Math.cos(a0),y0,r0*Math.sin(a0)],
                  [r1*Math.cos(a0),y1,r1*Math.sin(a0)],
                  [r1*Math.cos(a1),y1,r1*Math.sin(a1)],
                  [r0*Math.cos(a1),y0,r0*Math.sin(a1)]]});
    }
  }
  return q;
};
const SHAPE_BUILDERS = {
  box: (w,yb,yt)=> _bq(-w,yb,-w,w,yt,w),
  pi: (w,yb,yt)=>{
    const m = w*0.86, t = w*0.34, leg = w*0.3, bar = 0.24*(yt-yb);
    return [].concat(
      _bq(-m, yt-bar, -t/2, m, yt, t/2),
      _bq(-m, yb, -t/2, -m+leg, yt-bar-0.1, t/2),
      _bq(m-leg, yb, -t/2, m, yt-bar-0.1, t/2));
  },
  plus: (w,yb,yt)=>{
    const t = w*0.3, h = yt-yb, a = w*0.8, b = h*0.3;
    return [].concat(
      _bq(-a, yt-h/2-b/2, -t/2, a, yt-h/2+b/2, t/2),
      _bq(-b/2, yb+h*0.15, -t/2, b/2, yt, t/2));
  },
  equalsign: (w,yb,yt)=>{
    const h = yt-yb, a = w*0.85, t = h*0.22;
    return [].concat(
      _bq(-a, yb+h*0.3, -w*0.3, a, yb+h*0.3+t, w*0.3),
      _bq(-a, yt-h*0.3-t, -w*0.3, a, yt-h*0.3, w*0.3));
  },
  xgate: (w,yb,yt)=>{
    const h = yt-yb;
    return [].concat(
      _bq(-w*0.9, yb+h*0.35, -w*0.14, w*0.9, yt, w*0.14),
      _bq(-w*0.14, yb, -w*0.9, w*0.14, yt, w*0.9));
  },
  root: (w,yb,yt)=>{
    const h = yt-yb, t = w*0.3, q = [];
    q.push(_bq(-w*0.8, yt-h*0.3, -t/2, w*0.8, yt-h*0.18, t/2));
    const yT = yt-h*0.32;
    q.push({v:[[-w*0.55,yb,-t/2],[-w*0.2,yb,-t/2],[-w*0.05,yT,t/2],[-w*0.4,yT,t/2]]});
    q.push({v:[[-w*0.55,yb,t/2],[-w*0.2,yb,t/2],[-w*0.05,yT,-t/2],[-w*0.4,yT,-t/2]]});
    q.push({v:[[-w*0.4,yT,-t/2],[-w*0.05,yT,-t/2],[-w*0.05,yT,t/2],[-w*0.4,yT,t/2]]});
    q.push({v:[[-w*0.55,yb,-t/2],[-w*0.55,yb,t/2],[-w*0.4,yT,t/2],[-w*0.4,yT,-t/2]]});
    q.push({v:[[-w*0.2,yb,-t/2],[-w*0.2,yb,t/2],[-w*0.05,yT,t/2],[-w*0.05,yT,-t/2]]});
    q.push({v:[[-w*0.55,yb,-t/2],[-w*0.2,yb,-t/2],[-w*0.2,yb,t/2],[-w*0.55,yb,t/2]]});
    return q;
  },
  twin: (w,yb,yt)=>{
    return [].concat(
      _bq(-w*0.92, yb, -w*0.55, -w*0.08, yt-0.22*(yt-yb), w*0.55),
      _bq(w*0.08, yb, -w*0.55, w*0.92, yt, w*0.55));
  },
  cake: (w,yb,yt)=>{
    const r = w*0.88, h = yt-yb, g0 = 0.35, g1 = _TAU-0.35, N = 12, q = [];
    for(let k=0;k<N;k++){
      const a0 = g0+(g1-g0)*k/N, a1 = g0+(g1-g0)*(k+1)/N;
      q.push(_ringSeg(0,0,r,a0,a1,yb,yb+h*0.8));
    }
    q.push(_diskSeg(0,0,r,g0,g1,yb+h*0.8));
    q.push({v:[[0,yb,0],[0,yb+h*0.8,0],[r*Math.cos(g0),yb+h*0.8,0],[r*Math.cos(g0),yb,0]]});
    q.push({v:[[0,yb,0],[0,yb+h*0.8,0],[r*Math.cos(g1),yb+h*0.8,0],[r*Math.cos(g1),yb,0]]});
    q.push({v:[[0,yb,0],[r*Math.cos(g0),yb,0],[r*Math.cos(g1),yb,0],[0,yb,0]]});
    return q;
  },
  colonnade: (w,yb,yt)=>{
    const h = yt-yb, r = w*0.2, y1 = yb+h*0.8, N = 8, q = [];
    for(let c=-1;c<=1;c++){
      const cx = c*w*0.55;
      for(let k=0;k<N;k++) q.push(_ringSeg(cx,0,r,(k*_TAU/N),((k+1)*_TAU/N),yb,y1));
      q.push(_diskSeg(cx,0,r,0,_TAU,y1));
    }
    return q.concat(_bq(-w*0.92,y1,-w*0.62,w*0.92,yt,w*0.62));
  },
  cyl: (w,yb,yt)=>{
    const r = w*0.8, N = 12, y1 = yt-0.08*(yt-yb), q = [];
    for(let k=0;k<N;k++) q.push(_ringSeg(0,0,r,(k*_TAU/N),((k+1)*_TAU/N),yb,y1));
    q.push(_diskSeg(0,0,r,0,_TAU,y1));
    return q;
  },
  ramp: (w,yb,yt)=>{
    const h = yt-yb, y0 = yb+h*0.12, y1 = yt-h*0.1, z = w*0.45;
    return [
      {v:[[-w*0.9,y0,z],[w*0.9,y1,z],[w*0.9,y1,-z],[-w*0.9,y0,-z]]},
      {v:[[-w*0.9,y0,z],[-w*0.9,y0,-z],[-w*0.9,yb,-z],[-w*0.9,yb,z]]},
      {v:[[w*0.9,y1,z],[w*0.9,y1,-z],[w*0.9,yb,-z],[w*0.9,yb,z]]},
      {v:[[-w*0.9,y0,z],[w*0.9,y1,z],[w*0.9,yb,z],[-w*0.9,yb,z]]},
      {v:[[-w*0.9,y0,-z],[w*0.9,y1,-z],[w*0.9,yb,-z],[-w*0.9,yb,-z]]}
    ];
  },
  clock: (w,yb,yt)=>{
    const h = yt-yb, r = w*0.85, N = 12, yc = yb+h*0.32, q = [];
    for(let k=0;k<N;k++) q.push(_ringSeg(0,0,r,(k*_TAU/N),((k+1)*_TAU/N),yb,yc));
    q.push(_diskSeg(0,0,r,0,_TAU,yc));
    return q.concat(_bq(0,yc,-w*0.08,w*0.72,yc+h*0.08,w*0.08));
  },
  stairs: (w,yb,yt)=>{
    const h = yt-yb;
    return [].concat(
      _bq(-w*0.9, yb, -w*0.6, -w*0.28, yb+h*0.34, w*0.6),
      _bq(-w*0.28, yb, -w*0.6, w*0.32, yb+h*0.67, w*0.6),
      _bq(w*0.32, yb, -w*0.6, w*0.9, yt, w*0.6));
  },
  stack: (w,yb,yt)=>{
    const h = yt-yb;
    return [].concat(
      _bq(-w*0.92, yb, -w*0.92, w*0.92, yb+h*0.4, w*0.92),
      _bq(-w*0.6, yb+h*0.4, -w*0.6, w*0.6, yb+h*0.72, w*0.6),
      _bq(-w*0.34, yb+h*0.72, -w*0.34, w*0.34, yt, w*0.34));
  },
  dome: _shDome,
  sphere: _shSphere,
  dometangent: (w,yb,yt)=>{
    return _shDome(w, yb, yt-0.16*(yt-yb)).concat(
      _bq(-w*0.72, yt-0.14*(yt-yb), -w*0.45, w*0.72, yt-0.03*(yt-yb), w*0.45));
  },
  arc: (w,yb,yt)=>{
    const h = yt-yb, R = w*0.82, r = w*0.42, y = yt-h*0.22, N = 10, q = [];
    for(let k=0;k<N;k++){
      const a0 = 0.5+k*(Math.PI-1)/N, a1 = 0.5+(k+1)*(Math.PI-1)/N;
      q.push({v:[[R*Math.cos(a0),y,R*Math.sin(a0)],[R*Math.cos(a1),y,R*Math.sin(a1)],
                 [r*Math.cos(a1),y,r*Math.sin(a1)],[r*Math.cos(a0),y,r*Math.sin(a0)]]});
      q.push({v:[[R*Math.cos(a0),y-h*0.12,R*Math.sin(a0)],[R*Math.cos(a1),y-h*0.12,R*Math.sin(a1)],
                 [R*Math.cos(a1),y,R*Math.sin(a1)],[R*Math.cos(a0),y,R*Math.sin(a0)]]});
      q.push({v:[[r*Math.cos(a0),y-h*0.12,r*Math.sin(a0)],[r*Math.cos(a1),y-h*0.12,r*Math.sin(a1)],
                 [r*Math.cos(a1),y,r*Math.sin(a1)],[r*Math.cos(a0),y,r*Math.sin(a0)]]});
    }
    return q.concat(_bq(R*Math.cos(0.5)-w*0.09, y-h*0.16, R*Math.sin(0.5)-w*0.09,
                        R*Math.cos(0.5)+w*0.09, y+h*0.06, R*Math.sin(0.5)+w*0.09));
  },
  wave: (w,yb,yt)=>{
    const h = yt-yb, N = 10, z = w*0.4, q = [];
    for(let k=0;k<N;k++){
      const x0 = -w*0.9+1.8*w*k/N, x1 = -w*0.9+1.8*w*(k+1)/N;
      const yA = yb+h*(0.45+0.32*Math.sin(4.2*x0/w));
      const yB = yb+h*(0.45+0.32*Math.sin(4.2*x1/w));
      q.push({v:[[x0,yA,z],[x1,yB,z],[x1,yB,-z],[x0,yA,-z]]});
      q.push({v:[[x0,yb,z],[x1,yb,z],[x1,yB,z],[x0,yA,z]]});
      q.push({v:[[x1,yb,-z],[x0,yb,-z],[x0,yA,-z],[x1,yB,-z]]});
    }
    return q;
  },
  wedge: (w,yb,yt)=>{
    const h = yt-yb, z = w*0.55, y0 = yb+h*0.15, y1 = yt-h*0.12, x0 = -w*0.9, x1 = w*0.9;
    return [
      {v:[[x0,y0,z],[x1,y1,z],[x1,y1,-z],[x0,y0,-z]]},
      {v:[[x0,yb,z],[x1,yb,z],[x1,y1,z],[x0,y0,z]]},
      {v:[[x1,yb,-z],[x0,yb,-z],[x0,y0,-z],[x1,y1,-z]]},
      {v:[[x0,yb,z],[x0,yb,-z],[x0,y0,-z],[x0,y0,z]]},
      {v:[[x1,yb,z],[x1,yb,-z],[x1,y1,-z],[x1,y1,z]]}
    ];
  },
  hourglass: (w,yb,yt)=>{
    const h = yt-yb, cy = yb+h/2, a = w*0.8, q = [];
    const b4 = [[-a,yb,-a],[a,yb,-a],[a,yb,a],[-a,yb,a]];
    const t4 = [[-a,yt,-a],[a,yt,-a],[a,yt,a],[-a,yt,a]];
    for(let k=0;k<4;k++){
      const p0 = b4[k], p1 = b4[(k+1)%4];
      const u0 = t4[k], u1 = t4[(k+1)%4];
      q.push({v:[[p0[0],p0[1],p0[2]],[p1[0],p1[1],p1[2]],[0,cy,0],[0,cy,0]]});
      q.push({v:[[u0[0],u0[1],u0[2]],[u1[0],u1[1],u1[2]],[0,cy,0],[0,cy,0]]});
    }
    return q;
  },
  arch: (w,yb,yt)=>{
    const h = yt-yb, x0 = -w*0.9, x1 = w*0.9, z = w*0.42, N = 10, q = [];
    const yTop = x=>{ const u = (x-x0)/(x1-x0); return yb+h*(0.56+0.4*4*u*(1-u)); };
    const th = h*0.34;
    for(let k=0;k<N;k++){
      const xa = x0+(x1-x0)*k/N, xb = x0+(x1-x0)*(k+1)/N;
      const yaA = yTop(xa), yaB = yTop(xb);
      q.push({v:[[xa,yaA,z],[xb,yaB,z],[xb,yaB,-z],[xa,yaA,-z]]});
      q.push({v:[[xa,yaA-th,z],[xb,yaB-th,z],[xb,yaB,z],[xa,yaA,z]]});
      q.push({v:[[xb,yaB-th,-z],[xa,yaA-th,-z],[xa,yaA,-z],[xb,yaB,-z]]});
    }
    const yA0 = yTop(x0), yA1 = yTop(x1);
    q.push({v:[[x0,yb,z],[x0,yb,-z],[x0,yA0,-z],[x0,yA0,z]]});
    q.push({v:[[x1,yb,z],[x1,yb,-z],[x1,yA1,-z],[x1,yA1,z]]});
    return q;
  },
  funnel: (w,yb,yt)=>{
    const R = w*0.85, h = yt-yb, D = h*0.8, N = 10, M = 4, q = [];
    for(let m=0;m<M;m++){
      const r0 = R*(1-m/M), r1 = R*(1-(m+1)/M);
      const y0 = yb+D*(m/M)*(m/M), y1 = yb+D*((m+1)/M)*((m+1)/M);
      for(let k=0;k<N;k++){
        const a0 = k*_TAU/N, a1 = (k+1)*_TAU/N;
        q.push({v:[[r0*Math.cos(a0),y0,r0*Math.sin(a0)],
                    [r1*Math.cos(a0),y1,r1*Math.sin(a0)],
                    [r1*Math.cos(a1),y1,r1*Math.sin(a1)],
                    [r0*Math.cos(a1),y0,r0*Math.sin(a1)]]});
      }
    }
    for(let k=0;k<N;k++) q.push(_ringSeg(0,0,R,(k*_TAU/N),((k+1)*_TAU/N),yb,yb+0.08*h));
    return q;
  },
  arrow: (w,yb,yt)=>{
    const h = yt-yb, zc = w*0.2, q = _bq(-w*0.85, yb+h*0.34, -zc, w*0.12, yt-0.28*h, zc);
    const xh = w*0.9, xm = w*0.12, yb2 = yb+h*0.2, yt2 = yt-0.12*h;
    const tip = [xh, yb+h*0.5, 0];
    const base = [[xm,yb2,-zc*1.9],[xm,yb2,zc*1.9],[xm,yt2,zc*1.9],[xm,yt2,-zc*1.9]];
    for(let k=0;k<4;k++){
      const p = base[k], p2 = base[(k+1)%4];
      q.push({v:[[p[0],p[1],p[2]],[p2[0],p2[1],p2[2]],[tip[0],tip[1],tip[2]],[tip[0],tip[1],tip[2]]]});
    }
    return q;
  },
  grid: (w,yb,yt)=>{
    const h = yt-yb;
    return [].concat(
      _bq(-w*0.9, yb, -w*0.9, w*0.9, yb+h*0.28, w*0.9),
      _bq(-w*0.9, yb+h*0.28, -w*0.07, w*0.9, yt, w*0.07),
      _bq(-w*0.07, yb+h*0.28, -w*0.9, w*0.07, yt, w*0.9));
  },
  bars: (w,yb,yt)=>{
    const h = yt-yb, u = w*0.26;
    return [].concat(
      _bq(-w*0.85, yb, -w*0.5, -w*0.85+u, yb+h*0.55, w*0.5),
      _bq(-w*0.85+u*1.2, yb, -w*0.5, -w*0.85+u*2.2, yb+h*0.95, w*0.5),
      _bq(-w*0.85+u*2.4, yb, -w*0.5, w*0.85, yb+h*0.7, w*0.5));
  },
  tree: (w,yb,yt)=>{
    const h = yt-yb;
    return [].concat(
      _bq(-w*0.12, yb, -w*0.12, w*0.12, yb+h*0.55, w*0.12),
      _bq(-w*0.55, yb+h*0.55, -w*0.1, -w*0.3, yt-h*0.08, w*0.1),
      _bq(w*0.3, yb+h*0.55, -w*0.1, w*0.55, yt-h*0.08, w*0.1),
      _bq(-w*0.85, yt-h*0.08, -w*0.09, -w*0.6, yt, w*0.09),
      _bq(-w*0.5, yt-h*0.08, -w*0.09, -w*0.25, yt, w*0.09),
      _bq(w*0.25, yt-h*0.08, -w*0.09, w*0.5, yt, w*0.09),
      _bq(w*0.6, yt-h*0.08, -w*0.09, w*0.85, yt, w*0.09));
  },
  checker: (w,yb,yt)=>{
    const h = yt-yb;
    return [].concat(
      _bq(-w*0.9, yb, -w*0.9, 0, yb+h*0.62, 0),
      _bq(0, yb, -w*0.9, w*0.9, yb+h*0.28, 0),
      _bq(-w*0.9, yb, 0, 0, yb+h*0.28, w*0.9),
      _bq(0, yb, 0, w*0.9, yb+h*0.62, w*0.9));
  },
  nest: (w,yb,yt)=>{
    const h = yt-yb, t = w*0.16;
    const q = [].concat(
      _bq(-w*0.9, yb, -w*0.9, -w*0.9+t, yt, w*0.9),
      _bq(w*0.9-t, yb, -w*0.9, w*0.9, yt, w*0.9),
      _bq(-w*0.9+t, yb, -w*0.9, w*0.9-t, yt, -w*0.9+t),
      _bq(-w*0.9+t, yb, w*0.9-t, w*0.9-t, yt, w*0.9));
    return q.concat(_bq(-w*0.4, yb, -w*0.4, w*0.4, yb+h*0.4, w*0.4));
  },
  spiral: (w,yb,yt)=>{
    const h = yt-yb, q = [], N = 9;
    for(let k=0;k<N;k++){
      const a0 = k*0.75, a1 = (k+1)*0.75;
      const r0 = w*0.15+(w*0.72)*k/N, r1 = w*0.15+(w*0.72)*(k+1)/N;
      const am = (a0+a1)/2, rm = (r0+r1)/2;
      const cx = rm*Math.cos(am), cz = rm*Math.sin(am);
      const dx = Math.cos(am), dz = Math.sin(am);
      const len = (r1-r0)+w*0.14;
      q.push.apply(q, _bq(cx-dx*len/2, yb+h*0.2, cz-dz*len/2,
                           cx+dx*len/2, yb+h*0.65, cz+dz*len/2));
    }
    return q;
  },
  hexa: (w,yb,yt)=>{
    const h = yt-yb, r = w*0.8, N = 6, y1 = yt-h*0.06, q = [];
    for(let k=0;k<N;k++){
      const a0 = k*_TAU/N+Math.PI/6, a1 = (k+1)*_TAU/N+Math.PI/6;
      q.push(_ringSeg(0,0,r,a0,a1,yb,y1));
      q.push(_diskSeg(0,0,r,a0,a1,y1));
    }
    return q;
  },
  lighthouse: (w,yb,yt)=>{
    const h = yt-yb, r = w*0.58, N = 10, y1 = yb+h*0.6, q = [];
    for(let k=0;k<N;k++) q.push(_ringSeg(0,0,r,(k*_TAU/N),((k+1)*_TAU/N),yb,y1));
    for(let k=0;k<N;k++){
      const a0 = k*_TAU/N, a1 = (k+1)*_TAU/N;
      const p0 = [r*Math.cos(a0),y1,r*Math.sin(a0)], p1 = [r*Math.cos(a1),y1,r*Math.sin(a1)];
      q.push({v:[[p0[0],p0[1],p0[2]],[p1[0],p1[1],p1[2]],[0,yt,0],[0,yt,0]]});
    }
    return q.concat(_bq(-w*0.16, yt-h*0.06, -w*0.16, w*0.16, yt+h*0.06, w*0.16));
  }
};

function drawDoor(){
  const i = state.doorFloor;
  if(i < 0) return;
  const prog = state.doorProgress;
  if(prog <= 0.01) return;

  const w = floorHalfWidth(i);
  const yb = i*HH, yt = (i+1)*HH;
  const cy_world = (yb + yt) / 2;

  const c  = proj(0, cy_world, 0);
  const wL = proj(-w, cy_world, 0);
  const wR = proj(w, cy_world, 0);
  const wT = proj(0, yt - 0.08*HH, 0);
  const wB = proj(0, yb + 0.08*HH, 0);

  const floorScreenW = Math.abs(wR.x - wL.x);
  const doorH = Math.abs(wT.y - wB.y);
  const doorW = floorScreenW * 0.55;

  const cx = c.x;
  const cy = (wT.y + wB.y) / 2;
  const panelW = doorW / 2;

  const glowR = doorW * (0.9 + prog * 1.8);
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
  g.addColorStop(0, `rgba(255,248,200,${0.95 * prog})`);
  g.addColorStop(0.4, `rgba(255,220,120,${0.55 * prog})`);
  g.addColorStop(1, `rgba(255,200,100,0)`);
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(cx, cy, glowR, 0, Math.PI*2); ctx.fill();

  const slide = prog * panelW;
  const alpha = 1 - prog * 0.85;
  const top = cy - doorH/2;

  const lx = cx - panelW - slide;
  const gradL = ctx.createLinearGradient(lx, 0, lx + panelW, 0);
  gradL.addColorStop(0, `rgba(55,35,15,${alpha})`);
  gradL.addColorStop(1, `rgba(85,55,25,${alpha})`);
  ctx.fillStyle = gradL;
  ctx.strokeStyle = `rgba(255,215,120,${alpha})`;
  ctx.lineWidth = 2;
  ctx.fillRect(lx, top, panelW, doorH);
  ctx.strokeRect(lx, top, panelW, doorH);

  const rx = cx + slide;
  const gradR = ctx.createLinearGradient(rx, 0, rx + panelW, 0);
  gradR.addColorStop(0, `rgba(85,55,25,${alpha})`);
  gradR.addColorStop(1, `rgba(55,35,15,${alpha})`);
  ctx.fillStyle = gradR;
  ctx.strokeStyle = `rgba(255,215,120,${alpha})`;
  ctx.fillRect(rx, top, panelW, doorH);
  ctx.strokeRect(rx, top, panelW, doorH);

  if(prog < 0.5){
    ctx.fillStyle = `rgba(255,230,150,${1 - prog*2})`;
    ctx.beginPath(); ctx.arc(cx - 4, cy, 2.5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 4, cy, 2.5, 0, Math.PI*2); ctx.fill();
  }
}

function drawPlayer(){
  const y = (state.visualFloor + 1) * HH;
  const p = proj(0, y, 0);
  const rad = Math.max(11, 20 * (p.s/55));

  if(state.falling){
    for(let k = 1; k <= 6; k++){
      const ty = y + k * 0.5;
      const tp = proj(0, ty, 0);
      const trad = rad * (1 - k * 0.14);
      const a = 0.30 * (1 - k * 0.14);
      ctx.fillStyle = `rgba(79,209,197,${a})`;
      ctx.beginPath(); ctx.arc(tp.x, tp.y, trad, 0, Math.PI*2); ctx.fill();
    }
  }

  const g = ctx.createRadialGradient(p.x, p.y, 1, p.x, p.y, rad*2.6);
  g.addColorStop(0,   'rgba(230,255,250,1)');
  g.addColorStop(0.35,'rgba(79,209,197,0.92)');
  g.addColorStop(1,   'rgba(79,209,197,0)');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(p.x, p.y, rad*2.6, 0, Math.PI*2); ctx.fill();

  ctx.strokeStyle = 'rgba(20,40,50,0.55)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(p.x, p.y, rad*0.55, 0, Math.PI*2); ctx.stroke();

  ctx.fillStyle = '#eafffb';
  ctx.beginPath(); ctx.arc(p.x, p.y, rad*0.42, 0, Math.PI*2); ctx.fill();
}

function drawSummit(){
  const y = N_TOT * HH;
  const p = proj(0, y+0.55, 0);
  const allValid = state.validated.size === N_TOT;

  const g = ctx.createRadialGradient(p.x,p.y,1,p.x,p.y, allValid ? 70 : 50);
  g.addColorStop(0, allValid ? 'rgba(255,245,160,1)' : 'rgba(255,209,102,0.9)');
  g.addColorStop(1, 'rgba(255,209,102,0)');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(p.x,p.y, allValid ? 70 : 50, 0, Math.PI*2); ctx.fill();

  ctx.fillStyle = allValid ? '#fff2a0' : '#c97900';
  ctx.beginPath();
  ctx.moveTo(p.x, p.y-16);
  ctx.lineTo(p.x+12, p.y+9);
  ctx.lineTo(p.x-12, p.y+9);
  ctx.closePath(); ctx.fill();

  if(allValid){
    const t = performance.now() / 400;
    for(let k=0; k<6; k++){
      const ang = t + k * Math.PI/3;
      const r = 22 + 6 * Math.sin(t*2 + k);
      const sx = p.x + Math.cos(ang) * r;
      const sy = p.y + Math.sin(ang) * r;
      ctx.fillStyle = `rgba(255,240,150,${0.6 + 0.3*Math.sin(t*3+k)})`;
      ctx.beginPath(); ctx.arc(sx, sy, 2.5, 0, Math.PI*2); ctx.fill();
    }
  }
}

function drawParticles(){
  for (let i = state.particles.length - 1; i >= 0; i--) {
    const pt = state.particles[i];
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.vy += 0.35;
    pt.life -= 0.02;
    if (pt.life <= 0) {
      state.particles.splice(i, 1);
      continue;
    }
    ctx.globalAlpha = pt.life;
    ctx.fillStyle = pt.color;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 5 * pt.life, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function spawnExplosion(floor) {
  const w = floorHalfWidth(floor);
  const cy = (floor + 0.5) * HH;
  const p = proj(0, cy, 0);
  const hue = FAMILY_HUES[NOTIONS[floor].family] || 200;
  for (let k = 0; k < 30; k++) {
    state.particles.push({
      x: p.x + (Math.random() - 0.5) * w * 60,
      y: p.y + (Math.random() - 0.5) * 40,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 2,
      life: 1.0,
      color: `hsl(${hue}, 80%, 60%)`
    });
  }
}

function draw(){
  requestAnimationFrame(draw);

  if(state.autoRotate) state.angle += 0.0028;

  const speed = state.falling ? 0.11 : 0.06;
  state.visualFloor += (state.floor - state.visualFloor) * speed;

  const targetCam = (state.visualFloor + 1) * HH - 1.6;
  state.camY += (targetCam - state.camY) * 0.10;

  const sky = ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,   '#b8d4ef');
  sky.addColorStop(0.45,'#dceaf6');
  sky.addColorStop(0.8, '#f5ecd8');
  sky.addColorStop(1,   '#fbe9d0');
  ctx.fillStyle = sky; ctx.fillRect(0,0,W,H);

  for(const s of stars){
    ctx.globalAlpha = s.a * 0.18;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(s.x*W, s.y*H*0.55, s.r*0.8, 0, Math.PI*2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  for(let i=0;i<N_TOT;i++) drawFloorShape(i);

  drawSummit();
  drawDoor();
  drawPlayer();
  drawParticles();
}

let dragging = false, lastX = 0;
canvas.addEventListener('pointerdown', e => {
  dragging = true; lastX = e.clientX; state.autoRotate = false;
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointerup', () => {
  dragging = false;
  setTimeout(()=>{ state.autoRotate = true; }, 2200);
});
canvas.addEventListener('pointermove', e => {
  if(!dragging) return;
  state.angle += (e.clientX - lastX) * 0.011;
  lastX = e.clientX;
});

