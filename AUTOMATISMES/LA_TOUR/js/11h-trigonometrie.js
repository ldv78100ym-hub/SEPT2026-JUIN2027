/* ============================================================
   11h. TRIGONOMÉTRIE : degrés & radians, modulo 2π, mesure
        principale, symétries, rotations & point du cercle —
        intégration des documents « Trigonométrie — Les Arcanes
        du Cercle » (cours + quête), « Symétries, coordonnées &
        angles en degrés », « Bilan de trigonométrie » et du
        sujet type d'évaluation du 05/11/2026.
   ------------------------------------------------------------
   Déjà présents dans la tour (non dupliqués ici) : angles
   associés (trigoAssoc, t-associes), valeurs remarquables
   isolées (t-trigo2), mesure principale de cas fixes
   (t-angles-orientes), équations et inéquations (t-eqtrigo,
   t-ineqtrigo), courbes (t-courbetrigo), trigo du triangle
   rectangle (c-trigo).
   Sont intégrés ici, au format QCM / raisonnements à clés de
   la tour : conversions degrés ↔ radians exactes, congruence
   modulo 2π (même point du cercle), mesure principale par
   division euclidienne (cas quelconques), symétries et
   rotations sur les coordonnées ET sur les angles, identifica-
   tion de la transformation, compositions, lecture du point du
   cercle (cos θ ; sin θ) et signes par quadrant.
   → 5 notions en sommet de tour (160 étages), 14 générateurs,
     fiches « Degrés, radians & mesure principale » et
     « Symétries, rotations & coordonnées ».
   ============================================================ */

/* ---------- Helpers (préfixe tg-, aucune collision) ---------- */
function tgGcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ const t=a%b; a=b; b=t; } return a||1; }
function tgSimp(n,d){ if(d<0){ n=-n; d=-d; } const g=tgGcd(n,d); return { n:n/g, d:d/g }; }
function tgPi(n,d){
  const s = tgSimp(n,d);
  if(s.n === 0) return '0';
  let sign = ''; if(s.n < 0){ sign = '-'; s.n = -s.n; }
  if(s.d === 1) return sign + (s.n === 1 ? '\\pi' : s.n + '\\pi');
  if(s.n === 1) return sign + '\\dfrac{\\pi}{' + s.d + '}';
  return sign + '\\dfrac{' + s.n + '\\pi}{' + s.d + '}';
}
function tgRed(n,d){ let x=n; while(x < 0) x += 2*d; while(x >= 2*d) x -= 2*d; return tgSimp(x,d); }
function tgSame(n1,d1,n2,d2){ const a=tgRed(n1,d1), b=tgRed(n2,d2); return a.n===b.n && a.d===b.d; }
function tgPrinc(n,d){ let r = tgRed(n,d); if(r.n > r.d) r.n -= 2*r.d; return tgSimp(r.n, r.d); }
/* Négation d'une coordonnée écrite en LaTeX ('-x' → 'x', 'x' → '-x'). */
function tgNeg(t){ return t.charAt(0) === '-' ? t.slice(1) : '-' + t; }
/* Paire (q ; r) de la division euclidienne de n par m (0 ≤ r < m). */
function tgDiv(n,m){ const q = Math.floor(n/m); return { q:q, r:n - q*m }; }
function tgPar(n){ return n < 0 ? '(' + n + ')' : String(n); }

/* Angles remarquables en position principale réduite (quadrants ouverts). */
const TG_REM = [
  { n:1,  d:6, c:'\\dfrac{\\sqrt{3}}{2}',  s:'\\dfrac{1}{2}' },
  { n:1,  d:4, c:'\\dfrac{\\sqrt{2}}{2}',  s:'\\dfrac{\\sqrt{2}}{2}' },
  { n:1,  d:3, c:'\\dfrac{1}{2}',         s:'\\dfrac{\\sqrt{3}}{2}' },
  { n:2,  d:3, c:'-\\dfrac{1}{2}',        s:'\\dfrac{\\sqrt{3}}{2}' },
  { n:3,  d:4, c:'-\\dfrac{\\sqrt{2}}{2}', s:'\\dfrac{\\sqrt{2}}{2}' },
  { n:5,  d:6, c:'-\\dfrac{\\sqrt{3}}{2}', s:'\\dfrac{1}{2}' },
  { n:7,  d:6, c:'-\\dfrac{\\sqrt{3}}{2}', s:'-\\dfrac{1}{2}' },
  { n:5,  d:4, c:'-\\dfrac{\\sqrt{2}}{2}', s:'-\\dfrac{\\sqrt{2}}{2}' },
  { n:4,  d:3, c:'-\\dfrac{1}{2}',        s:'-\\dfrac{\\sqrt{3}}{2}' },
  { n:5,  d:3, c:'\\dfrac{1}{2}',         s:'-\\dfrac{\\sqrt{3}}{2}' },
  { n:7,  d:4, c:'\\dfrac{\\sqrt{2}}{2}',  s:'-\\dfrac{\\sqrt{2}}{2}' },
  { n:11, d:6, c:'\\dfrac{\\sqrt{3}}{2}',  s:'-\\dfrac{1}{2}' }
];
/* Mesures principales particulières (pour le raisonnement modulo). */
const TG_PRINC_POOL = [
  { n:1, d:6 }, { n:1, d:4 }, { n:1, d:3 }, { n:2, d:3 }, { n:3, d:4 },
  { n:5, d:6 }, { n:1, d:2 }, { n:1, d:1 },
  { n:-1, d:6 }, { n:-1, d:4 }, { n:-3, d:4 }, { n:-1, d:3 },
  { n:-2, d:3 }, { n:-5, d:6 }, { n:-1, d:2 }
];
/* Noms canoniques des cinq transformations du cercle. */
const TG_NOMS = {
  axeOi: 'la symétrie d\u2019axe (O, i)',
  axeOj: 'la symétrie d\u2019axe (O, j)',
  centre: 'la symétrie de centre O',
  r90:   'la rotation de centre O et d\u2019angle +90°',
  rm90:  'la rotation de centre O et d\u2019angle −90°'
};
/* Image d'un angle {n,d} par chaque transformation. */
function tgAngleOf(t, v){
  if(t === 'axeOi')  return { n:-v.n,       d:v.d };
  if(t === 'axeOj')  return { n:v.d - v.n,  d:v.d };
  if(t === 'centre') return { n:v.d + v.n,  d:v.d };
  if(t === 'r90')    return { n:2*v.n + v.d, d:2*v.d };
  return { n:2*v.n - v.d, d:2*v.d };
}

/* ============================================================
   EXERCICE 1 — CONVERSIONS DEGRÉS ↔ RADIANS (sujet type, ex. 1)
   ============================================================ */
GEN.tgConv = function(){
  const D = pick([15,20,30,40,45,60,75,120,135,150,210,225,240,300,315,330]);
  const correct = tgPi(D,180);
  const wrongs = [
    tgPi(D*180,180),  /* π collé sans division par 180 */
    tgPi(D,360),      /* facteur divisé par 2 */
    tgPi(D*2,180),    /* facteur doublé */
    tgPi(D,90),       /* même erreur, autre écriture */
    M(String(D))      /* mesure inchangée : rien converti */
  ];
  return QCM(
    `Quelle est la mesure en <b>radians</b> de l\u2019angle de ${M(D + '^\\circ')} ? <i>(résultat exact)</i>`,
    M(correct),
    wrongs.map(w => M(w)),
    1,
    EXPL(
      `Correspondance fondamentale : \\(180^\\circ = \\pi\\) rad (un demi-tour), donc \\(360^\\circ = 2\\pi\\) (un tour complet). La formule de conversion est \\(\\theta_{\\text{rad}} = \\theta_{\\text{deg}} \\times \\dfrac{\\pi}{180}\\).`,
      `Ici : \\(${D} \\times \\dfrac{\\pi}{180} = \\dfrac{${D}\\pi}{180}\\). Je simplifie par \\(\\gcd(${D},180) = ${tgGcd(D,180)}\\) et j\u2019obtiens la mesure exacte \\(${correct}\\).`,
      `Inverser le facteur (\\(\\dfrac{180}{\\pi}\\)) repasserait en degrés ; 360 est le tour complet en degrés, pas un facteur de conversion. Et on garde le symbole \\(\\pi\\) : remplacer \\(\\pi\\) par 3,14 détruirait l\u2019exactitude.`
    )
  );
};

GEN.tgConvInv = function(){
  const v = pick(TG_REM);
  const deg = v.n * 180 / v.d;
  const cands = [2*deg, deg + 180, 360 - deg, deg - 180, 180 - deg, deg/2];
  const wrongs = [];
  cands.forEach(c => {
    if(Number.isInteger(c) && c > 0 && c !== deg && wrongs.indexOf(c) < 0) wrongs.push(c);
  });
  return QCM(
    `Quelle est la mesure en <b>degrés</b> de l\u2019angle de ${M(tgPi(v.n,v.d))} radians ?`,
    M(deg + '^\\circ'),
    wrongs.slice(0,5).map(c => M(c + '^\\circ')),
    1,
    EXPL(
      `Correspondance fondamentale : \\(\\pi\\) rad \\(= 180^\\circ\\). La formule de conversion est \\(\\theta_{\\text{deg}} = \\theta_{\\text{rad}} \\times \\dfrac{180}{\\pi}\\).`,
      `Ici : \\(${tgPi(v.n,v.d)} = \\dfrac{${v.n}\\pi}{${v.d}}\\), donc \\(\\dfrac{${v.n}\\pi}{${v.d}} \\times \\dfrac{180}{\\pi} = \\dfrac{${v.n} \\times 180}{${v.d}} = ${deg}^\\circ\\).`,
      `Le facteur \\(\\dfrac{\\pi}{180}\\) convertirait dans l\u2019autre sens (vers les radians). Attention aussi au double ou à la moitié : \\(\\pi\\) correspond à 180°, pas à 360°.`
    )
  );
};

/* ============================================================
   EXERCICE 2 — MÊME POINT DU CERCLE & MODULO 2π (sujet, ex. 2)
   ============================================================ */
GEN.tgMemePoint = function(){
  const v = pick(TG_REM);
  const k = pick([1,2,3,-1,-2]);
  const correct = tgPi(v.n + 2*k*v.d, v.d);
  const raw = [
    { n:v.n + v.d, d:v.d },  /* θ + π : point opposé */
    { n:v.n - v.d, d:v.d },  /* θ − π */
    { n:-v.n,       d:v.d }, /* −θ : symétrie d'axe (O, i) */
    { n:2*v.d - v.n, d:v.d },/* 2π − θ */
    { n:2*v.n,      d:v.d }, /* 2θ */
    { n:v.n,        d:2*v.d }/* θ⁄2 */
  ];
  /* filtrage : jamais le même point que θ, jamais deux candidats congruents */
  const kept = [];
  raw.forEach(c => {
    if(tgSame(c.n, c.d, v.n, v.d)) return;
    const isDup = kept.some(kp => tgSame(kp.n, kp.d, c.n, c.d));
    if(!isDup) kept.push(c);
  });
  const wrongs2 = kept.map(c => tgPi(c.n, c.d));
  return QCM(
    `Sur le cercle trigonométrique, le point M est repéré par le réel ${M('\\theta = ' + tgPi(v.n,v.d))}.<br>Quel autre réel repère <b>le même point</b> M ?`,
    M(correct),
    wrongs2.map(w => M(w)),
    1,
    EXPL(
      `Deux réels repèrent le même point du cercle si et seulement s\u2019ils diffèrent d\u2019un multiple de \\(2\\pi\\) (congruence <b>modulo \\(2\\pi\\)</b>) : \\(\\theta' = \\theta + 2k\\pi\\), avec \\(k\\) entier relatif.`,
      `Ici \\(${tgPi(v.n + 2*k*v.d, v.d)} = ${tgPi(v.n,v.d)} ${k < 0 ? '-' : '+'} ${Math.abs(k)} \\times 2\\pi\\) : on a ${k > 0 ? 'ajouté' : 'retranché'} ${Math.abs(k)} tour(s) complet(s) — le point M ne bouge pas d\u2019un millimètre.`,
      `Ajouter \\(\\pi\\) (un demi-tour) donne le point <b>opposé</b>, pas le même point ; \\(-\\theta\\) donne le symétrique par rapport à l\u2019axe (O, i). Seuls les tours complets (\\(2\\pi\\)) laissent M invariant.`
    )
  );
};

/* ============================================================
   EXERCICE 3 — MESURE PRINCIPALE PAR DIVISION EUCLIDIENNE
   (sujet type, ex. 3 ; cas quelconques, au-delà des cas fixes)
   ============================================================ */
GEN.tgPrincipale = function(){
  const d = pick([2,3,4,6]);
  let s;
  let tries = 0;
  do {
    const n = pick([d+1, d+2, 2*d+1, 2*d+3, 3*d+1, 3*d+2, 3*d+5, 4*d+1,
                    -(d+1), -(d+2), -(2*d+1), -(3*d+2), -(3*d+5), -(4*d+1), 5*d+2]);
    s = tgSimp(n, d);
    tries++;
  } while((Math.abs(s.n) <= s.d || s.n % (2*s.d) === 0) && tries < 30);
  const D2 = 2*s.d;
  const dv = tgDiv(s.n, D2);
  let pn, pd;
  if(dv.r <= s.d){ pn = dv.r; pd = s.d; }
  else { pn = dv.r - D2; pd = s.d; }
  const p = tgSimp(pn, pd);
  const correct = tgPi(p.n, p.d);
  const rr = tgRed(s.n, s.d);
  const cands = [
    { n:-p.n,      d:p.d },   /* opposé de la principale */
    { n:p.n + p.d, d:p.d },   /* principale + π */
    { n:p.n - p.d, d:p.d },   /* principale − π */
    { n:rr.n,      d:rr.d },  /* mesure dans [0 ; 2π[ */
    { n:s.n,       d:s.d },   /* l'angle initial */
    { n:s.n,       d:2*s.d },/* moitié de l'angle */
    { n:2*s.n,     d:s.d }    /* double de l'angle */
  ];
  const kept = [];
  cands.forEach(c => {
    if(tgSame(c.n, c.d, p.n, p.d)) return;
    const isDup = kept.some(kp => tgSame(kp.n, kp.d, c.n, c.d));
    if(!isDup) kept.push(c);
  });
  return QCM(
    `Quelle est la <b>mesure principale</b> de l\u2019angle de mesure ${M(tgPi(s.n, s.d))} ?`,
    M(correct),
    kept.map(c => M(tgPi(c.n, c.d))),
    1,
    EXPL(
      `La mesure principale d\u2019un angle est son unique mesure dans l\u2019intervalle \\(\\left]-\\pi\\,;\\,\\pi\\right]\\). Pour \\(\\theta = \\dfrac{n\\pi}{d}\\), on fait la division euclidienne de \\(n\\) par \\(2d\\) : \\(n = 2d \\times q + r\\).`,
      `Ici \\(2d = ${D2}\\) : \\(${s.n} = ${D2} \\times ${tgPar(dv.q)} + ${dv.r}\\). Le reste \\(r = ${dv.r}\\) ${dv.r <= s.d ? 'est inférieur ou égal à' : 'dépasse'} \\(d = ${s.d}\\)${dv.r <= s.d ? '' : ', on retranche un tour complet'}. Mesure principale : \\(${correct}\\).`,
      `Ne pas confondre avec la mesure dans \\(\\left[0\\,;\\,2\\pi\\right[\\) : la mesure principale peut être négative. Et si le reste dépasse \\(d\\), il faut retrancher un tour — l\u2019oublier est l\u2019erreur classique.`
    )
  );
};

/* ============================================================
   RAISONNEMENTS À CLÉS — conversion (d'après « Les Arcanes »)
   ============================================================ */
GEN.trouConv = function(){
  const D = pick([30,45,60,75,120,135,150,225,240,300,315,330]);
  const rad = tgPi(D,180);
  return TROU(
    `Conversion degrés → radians : complète le raisonnement.`,
    `Je cherche la mesure en radians de l\u2019angle de ${D}°.
     Étape 1 : la correspondance fondamentale est \\(180^\\circ = \\pi\\) rad.
     Étape 2 : je multiplie donc ${D} par \\(\\dfrac{\\pi}{180}\\) — le facteur {{0}} \\(\\dfrac{180}{\\pi}\\) convertirait dans l\u2019autre sens.
     Étape 3 : j\u2019obtiens \\(\\dfrac{${D}\\pi}{180}\\), une fraction avec \\(\\pi\\) au {{1}}.
     Étape 4 : je simplifie par le {{2}} de ${D} et de 180 : \\(\\gcd(${D},180) = ${tgGcd(D,180)}\\).
     Étape 5 : j\u2019obtiens \\(${rad}\\) — c\u2019est la mesure {{3}} attendue : remplacer \\(\\pi\\) par 3,14 ne donnerait qu\u2019une {{4}}.
     Conclusion : la mesure de l\u2019angle en {{5}} est \\(${rad}\\).
     Rappel : une conversion d\u2019unité ne change jamais l\u2019angle, contrairement à l\u2019ajout d\u2019un {{6}} comme \\(\\pi\\).`,
    ['inverse','numérateur','PGCD','exacte','valeur approchée','radians','demi-tour'],
    ['dénominateur','2π','degrés','tiers de tour','PPCM','pente','hippogriffe','ornithorynque'],
    `Ne pas confondre les deux facteurs : \\(\\dfrac{\\pi}{180}\\) passe des degrés aux radians, \\(\\dfrac{180}{\\pi}\\) l\u2019inverse. Toujours garder le symbole \\(\\pi\\) : la valeur exacte n\u2019est pas un nombre décimal.`
  );
};

GEN.trouModulo = function(){
  const v = pick(TG_PRINC_POOL);
  const k = pick([1,2,-1,-2,3]);
  const n1 = v.n + 2*k*v.d, d1 = v.d;
  const D2 = 2*d1;
  const dv = tgDiv(n1, D2);
  let pn = dv.r <= d1 ? dv.r : dv.r - D2;
  const p = tgSimp(pn, d1);
  const kAbs = Math.abs(k);
  return TROU(
    `Même point du cercle & mesure principale : complète le raisonnement.`,
    `Sur le cercle trigonométrique, le point M est repéré par le réel \\(${tgPi(n1,d1)}\\).
     Étape 1 : deux réels repèrent le même point du cercle s\u2019ils diffèrent d\u2019un multiple de {{0}}.
     Étape 2 : ici \\(${tgPi(n1,d1)} = ${tgPi(v.n,v.d)} ${k < 0 ? '-' : '+'} ${kAbs} \\times 2\\pi\\) — on a ${k > 0 ? 'ajouté' : 'retranché'} ${kAbs} tour(s) complet(s).
     Étape 3 : pour ranger l\u2019angle, on cherche sa mesure {{1}}, l\u2019unique mesure dans \\(\\left]-\\pi\\,;\\,\\pi\\right]\\).
     Étape 4 : division euclidienne du numérateur par \\(2d = ${D2}\\) : \\(${n1} = ${D2} \\times ${tgPar(dv.q)} + ${dv.r}\\).
     Étape 5 : le reste \\(r = ${dv.r}\\) ${dv.r <= d1 ? 'donne directement' : 'dépasse d, je retranche un tour et j\u2019obtiens'} la mesure principale \\(${tgPi(p.n,p.d)}\\).
     Étape 6 : tout réel repérant M s\u2019écrit \\(${tgPi(v.n,v.d)} + 2k\\pi\\), avec \\(k\\) entier {{2}} — la mesure principale d\u2019un angle est {{3}}.
     Étape 7 : attention, \\(${tgPi(v.n + v.d, v.d)}\\) (un demi-tour de plus) repère le point {{4}} : seul le tour {{5}} laisse M invariant.`,
    ['2π','principale','relatif','unique','opposé','complet'],
    ['π','secondaire','positif','double','symétrique','incomplet','PPCM','hippogriffe','marmotte'],
    `Le critère est la différence de multiples de \\(2\\pi\\) — jamais de \\(\\pi\\). Ajouter \\(\\pi\\) conduit au point diamétralement opposé ; la mesure principale est l\u2019unique représentante dans \\(\\left]-\\pi\\,;\\,\\pi\\right]\\).`
  );
};

/* ============================================================
   EXERCICE 4 — SYMÉTRIES & ROTATIONS : COORDONNÉES DE L'IMAGE
   (document « Symétries, coordonnées & angles »)
   ============================================================ */
function tgCoordPair(){
  const uints = ['2','3','4','5'];
  const ufrac = ['\\dfrac{1}{2}','\\dfrac{3}{4}','\\dfrac{2}{3}','\\dfrac{5}{2}'];
  const urac  = ['\\dfrac{\\sqrt{2}}{2}','\\dfrac{\\sqrt{3}}{2}','\\dfrac{\\sqrt{3}}{3}','\\dfrac{\\sqrt{5}}{2}'];
  const mode = pick(['int','frac','rac','mixte']);
  let poolA, poolB;
  if(mode === 'mixte'){
    poolA = pick([uints, ufrac, urac]);
    do { poolB = pick([uints, ufrac, urac]); } while(poolB === poolA);
  } else {
    poolA = poolB = (mode === 'int' ? uints : mode === 'frac' ? ufrac : urac);
  }
  const a = pick(poolA);
  let b; do { b = pick(poolB); } while(b === a);
  return {
    x: (pick([1,-1]) < 0 ? '-' : '') + a,
    y: (pick([1,-1]) < 0 ? '-' : '') + b
  };
}
function tgCoordStr(cx, cy){ return '\\left(' + cx + '\\,;\\,' + cy + '\\right)'; }

GEN.tgSymCoord = function(){
  const t = pick(['axeOi','axeOj','centre']);
  const c = tgCoordPair();
  let cx = c.x, cy = c.y;
  if(t === 'axeOi')  cy = tgNeg(c.y);
  if(t === 'axeOj')  cx = tgNeg(c.x);
  if(t === 'centre'){ cx = tgNeg(c.x); cy = tgNeg(c.y); }
  const correct = tgCoordStr(cx, cy);
  const wrongs = [
    tgCoordStr(c.y, c.x),                       /* permutation */
    tgCoordStr(c.x, c.y),                       /* identité */
    tgCoordStr(tgNeg(c.x), c.y),               /* autre symétrie */
    tgCoordStr(c.x, tgNeg(c.y)),                /* autre symétrie */
    tgCoordStr(tgNeg(c.x), tgNeg(c.y)),         /* symétrie centrale */
    tgCoordStr(tgNeg(c.y), c.x),                /* rotation +90° */
    tgCoordStr(c.y, tgNeg(c.x))                 /* rotation −90° */
  ];
  return QCM(
    `Le point \\(M\\) a pour coordonnées \\(${tgCoordStr(c.x, c.y)}\\).<br>Quelles sont les coordonnées de \\(M'\\), image de \\(M\\) par <b>${TG_NOMS[t]}</b> ?`,
    M(correct),
    wrongs.map(w => M(w)),
    1,
    EXPL(
      `Les trois symétries usuelles : d\u2019axe (O, i) : \\(M'(x\\,;\\,-y)\\) ; d\u2019axe (O, j) : \\(M'(-x\\,;\\,y)\\) ; de centre O : \\(M'(-x\\,;\\,-y)\\).`,
      `Ici ${t === 'axeOi' ? 'l\u2019abscisse est conservée et l\u2019ordonnée change de signe' : t === 'axeOj' ? 'l\u2019ordonnée est conservée et l\u2019abscisse change de signe' : 'les deux coordonnées changent de signe'} : \\(M'${correct}\\).`,
      `Un seul signe changé = symétrie axiale (ordonnée changée : axe (O, i) ; abscisse changée : axe (O, j)) ; deux signes changés = symétrie centrale. Permuter \\(x\\) et \\(y\\) n\u2019est aucune de ces symétries.`
    )
  );
};

GEN.tgRotCoord = function(){
  const t = pick(['r90','rm90']);
  const c = tgCoordPair();
  const cx = (t === 'r90') ? tgNeg(c.y) : c.y;
  const cy = (t === 'r90') ? c.x : tgNeg(c.x);
  const correct = tgCoordStr(cx, cy);
  const wrongs = [
    tgCoordStr(c.y, c.x),
    tgCoordStr(tgNeg(c.y), tgNeg(c.x)),
    tgCoordStr(c.x, tgNeg(c.y)),
    tgCoordStr(tgNeg(c.x), c.y),
    tgCoordStr(tgNeg(c.x), tgNeg(c.y)),
    tgCoordStr(c.x, c.y)
  ];
  return QCM(
    `Le point \\(M\\) a pour coordonnées \\(${tgCoordStr(c.x, c.y)}\\).<br>Quelles sont les coordonnées de \\(M'\\), image de \\(M\\) par <b>${TG_NOMS[t]}</b> ?`,
    M(correct),
    wrongs.map(w => M(w)),
    1,
    EXPL(
      `Rotations de centre O : un quart de tour direct (+90°) envoie \\(M(x\\,;\\,y)\\) sur \\(M'(-y\\,;\\,x)\\) ; un quart de tour indirect (−90°) sur \\(M'(y\\,;\\,-x)\\).`,
      `Ici ${t === 'r90' ? 'la nouvelle abscisse est l\u2019opposée de l\u2019ancienne ordonnée, la nouvelle ordonnée est l\u2019ancienne abscisse' : 'la nouvelle abscisse est l\u2019ancienne ordonnée, la nouvelle ordonnée est l\u2019opposée de l\u2019ancienne abscisse'} : \\(M'${correct}\\).`,
      `Oublier le changement de signe donne l\u2019image de la rotation inverse ; garder \\((x\\,;\\,y)\\) n\u2019est possible que pour le centre O. Une rotation de 90° déplace tout point autre que O.`
    )
  );
};

/* ============================================================
   EXERCICE 5 — ANGLE IMAGE (sujet type, ex. 4)
   ============================================================ */
GEN.tgAngleImage = function(){
  const v = pick(TG_REM);
  const t = pick(['axeOi','axeOj','centre','r90','rm90']);
  const a = tgAngleOf(t, v);
  const correct = tgPi(a.n, a.d);
  const others = ['axeOi','axeOj','centre','r90','rm90'].filter(x => x !== t)
    .map(x => tgAngleOf(x, v));
  others.push({ n:v.n + v.d, d:v.d }, { n:v.n - v.d, d:v.d });
  const kept = [];
  others.forEach(c => {
    if(tgSame(c.n, c.d, a.n, a.d)) return;
    const isDup = kept.some(kp => tgSame(kp.n, kp.d, c.n, c.d));
    if(!isDup) kept.push(c);
  });
  return QCM(
    `Sur le cercle trigonométrique, M est repéré par ${M('\\theta = ' + tgPi(v.n,v.d))}.<br>Quelle est la mesure de l\u2019<b>angle image</b> de \\(\\theta\\) par <b>${TG_NOMS[t]}</b> ?`,
    M(correct),
    kept.map(c => M(tgPi(c.n, c.d))),
    1,
    EXPL(
      `Sur les angles : symétrie d\u2019axe (O, i) : \\(-\\theta\\) ; symétrie d\u2019axe (O, j) : \\(\\pi - \\theta\\) ; symétrie de centre O : \\(\\pi + \\theta\\) ; rotation de +90° : \\(\\theta + \\dfrac{\\pi}{2}\\) ; rotation de −90° : \\(\\theta - \\dfrac{\\pi}{2}\\).`,
      `Ici \\(\\theta = ${tgPi(v.n,v.d)}\\), et la transformation envoie \\(\\theta\\) sur ${t === 'axeOi' ? '\\(-\\theta\\)' : t === 'axeOj' ? '\\(\\pi - \\theta\\)' : t === 'centre' ? '\\(\\pi + \\theta\\)' : (t === 'r90' ? '\\(\\theta + \\dfrac{\\pi}{2}\\)' : '\\(\\theta - \\dfrac{\\pi}{2}\\)')} : l\u2019angle image est \\(${correct}\\).`,
      `Confondre \\(\\pi - \\theta\\) (axe (O, j)) et \\(\\pi + \\theta\\) (centre O) est l\u2019erreur classique. Méthode sûre : appliquer la transformation au point \\(M\\), puis lire le nouvel angle sur le cercle — quitte à changer l\u2019écriture modulo \\(2\\pi\\).`
    )
  );
};

/* ============================================================
   EXERCICE 6 — IDENTIFIER LA TRANSFORMATION (2 modes)
   ============================================================ */
GEN.tgIdentifier = function(){
  const mode = pick(['coords','angles']);
  if(mode === 'coords'){
    const c = tgCoordPair();
    const imgs = {
      axeOi: [c.x, tgNeg(c.y)],
      axeOj: [tgNeg(c.x), c.y],
      centre:[tgNeg(c.x), tgNeg(c.y)],
      r90:   [tgNeg(c.y), c.x],
      rm90:  [c.y, tgNeg(c.x)]
    };
    const t = pick(Object.keys(imgs));
    const target = imgs[t];
    const ambiguous = Object.keys(imgs).some(k => k !== t && imgs[k][0] === target[0] && imgs[k][1] === target[1]);
    if(ambiguous) return GEN.tgIdentifier();
    return QCM(
      `Le point \\(M${tgCoordStr(c.x, c.y)}\\) a pour image \\(M'${tgCoordStr(target[0], target[1])}\\) par une transformation.<br>Quelle est cette transformation ?`,
      TG_NOMS[t],
      Object.keys(imgs).filter(k => k !== t).map(k => TG_NOMS[k]),
      1,
      EXPL(
        `Catalogue des effets : un seul signe changé → symétrie axiale ; deux signes changés → symétrie de centre O ; échange des coordonnées → rotation de ±90°.`,
        `Ici on passe de \\(${tgCoordStr(c.x, c.y)}\\) à \\(${tgCoordStr(target[0], target[1])}\\) : ${t === 'axeOi' ? 'seule l\u2019ordonnée a changé de signe, l\u2019axe (O, i) est un miroir horizontal' : t === 'axeOj' ? 'seule l\u2019abscisse a changé de signe, l\u2019axe (O, j) est un miroir vertical' : t === 'centre' ? 'les deux coordonnées ont changé de signe : c\u2019est la symétrie centrale (un demi-tour)' : (t === 'r90' ? 'la nouvelle abscisse vaut l\u2019opposé de l\u2019ancienne ordonnée : quart de tour direct' : 'la nouvelle ordonnée vaut l\u2019opposé de l\u2019ancienne abscisse : quart de tour indirect')}.`,
        `Comparer attentivement les signes AVANT de conclure : l\u2019axe (O, i) change l\u2019ordonnée (miroir horizontal), l\u2019axe (O, j) change l\u2019abscisse (miroir vertical). Permutation seule ne suffit pas : \\((y\\,;\\,x)\\) sans signe changé n\u2019est pas une rotation de +90°.`
      )
    );
  }
  /* mode angles : θ → θ' */
  let v, t, a, ok = false, guard = 0;
  while(!ok && guard < 40){
    v = pick(TG_REM); t = pick(['axeOi','axeOj','centre','r90','rm90']);
    a = tgAngleOf(t, v);
    const all = ['axeOi','axeOj','centre','r90','rm90'].map(x => tgAngleOf(x, v));
    const vals = all.map(u => tgRed(u.n, u.d));
    ok = vals.every((u, i) => vals.every((w, j) => i === j || !(u.n === w.n && u.d === w.d)));
    guard++;
  }
  return QCM(
    `Le point M du cercle trigonométrique est repéré par ${M('\\theta = ' + tgPi(v.n,v.d))} ; son image M' est repérée par ${M("\\theta' = " + tgPi(a.n,a.d))}.<br>Quelle transformation envoie M sur M' ?`,
    TG_NOMS[t],
    ['axeOi','axeOj','centre','r90','rm90'].filter(x => x !== t).map(x => TG_NOMS[x]),
    1,
    EXPL(
      `Sur les angles : \\(-\\theta\\) → symétrie d\u2019axe (O, i) ; \\(\\pi - \\theta\\) → axe (O, j) ; \\(\\pi + \\theta\\) → centre O ; \\(\\theta + \\dfrac{\\pi}{2}\\) → rotation de +90° ; \\(\\theta - \\dfrac{\\pi}{2}\\) → rotation de −90°.`,
      `Ici \\(\\theta = ${tgPi(v.n,v.d)}\\) et \\(\\theta' = ${tgPi(a.n,a.d)}\\). Je compare \\(\\theta'\\) aux cinq formes : c\u2019est ${t === 'axeOi' ? '\\(-\\theta\\)' : t === 'axeOj' ? '\\(\\pi - \\theta\\)' : t === 'centre' ? '\\(\\pi + \\theta\\)' : (t === 'r90' ? '\\(\\theta + \\dfrac{\\pi}{2}\\)' : '\\(\\theta - \\dfrac{\\pi}{2}\\)')} qui convient — quitte à changer l\u2019écriture modulo \\(2\\pi\\).`,
      `Toujours se ramener à la mesure principale avant de comparer : \\(\\pi + \\theta\\) et \\(\\theta - \\pi\\) repèrent le même point, ce qui peut déguiser une symétrie centrale en « différence de π ».`
    )
  );
};

/* ============================================================
   EXERCICE 7 — COMPOSÉES DE TRANSFORMATIONS (Bilan, partie 13)
   ============================================================ */
GEN.tgCompoSym = function(){
  const IDE = 'l\u2019identité (tout point revient à sa place)';
  const comps = [
    { t:'la symétrie d\u2019axe (O, i) puis la symétrie d\u2019axe (O, j)', a:'la symétrie de centre O',
      tr:'\\(\\theta \\to -\\theta \\to \\pi-(-\\theta) = \\pi+\\theta\\) : l\u2019effet d\u2019un demi-tour' },
    { t:'la symétrie d\u2019axe (O, j) puis la symétrie d\u2019axe (O, i)', a:'la symétrie de centre O',
      tr:'\\(\\theta \\to \\pi-\\theta \\to -(\\pi-\\theta) = \\theta-\\pi\\), soit \\(\\pi+\\theta\\) modulo \\(2\\pi\\)' },
    { t:'la symétrie d\u2019axe (O, i) puis la symétrie de centre O', a:'la symétrie d\u2019axe (O, j)',
      tr:'\\(\\theta \\to -\\theta \\to \\pi-\\theta\\) : l\u2019effet de l\u2019axe (O, j)' },
    { t:'la symétrie de centre O puis la symétrie d\u2019axe (O, i)', a:'la symétrie d\u2019axe (O, j)',
      tr:'\\(\\theta \\to \\pi+\\theta \\to -(\\pi+\\theta)\\), soit \\(\\pi-\\theta\\) modulo \\(2\\pi\\)' },
    { t:'la symétrie d\u2019axe (O, j) puis la symétrie de centre O', a:'la symétrie d\u2019axe (O, i)',
      tr:'\\(\\theta \\to \\pi-\\theta \\to \\pi+(\\pi-\\theta)\\), soit \\(-\\theta\\) modulo \\(2\\pi\\)' },
    { t:'la symétrie de centre O puis la symétrie d\u2019axe (O, j)', a:'la symétrie d\u2019axe (O, i)',
      tr:'\\(\\theta \\to \\pi+\\theta \\to \\pi-(\\pi+\\theta) = -\\theta\\)' },
    { t:'la symétrie d\u2019axe (O, i) puis à nouveau la symétrie d\u2019axe (O, i)', a:IDE,
      tr:'\\(\\theta \\to -\\theta \\to \\theta\\) : une symétrie est involutive' },
    { t:'la symétrie de centre O puis à nouveau la symétrie de centre O', a:IDE,
      tr:'\\(\\theta \\to \\pi+\\theta \\to 2\\pi+\\theta\\), soit \\(\\theta\\) modulo \\(2\\pi\\)' },
    { t:'la rotation de +90° puis la rotation de +90°', a:'la symétrie de centre O',
      tr:'\\(\\theta \\to \\theta+\\dfrac{\\pi}{2} \\to \\theta+\\pi\\) : un demi-tour' },
    { t:'la rotation de −90° puis la rotation de −90°', a:'la symétrie de centre O',
      tr:'\\(\\theta \\to \\theta-\\dfrac{\\pi}{2} \\to \\theta-\\pi\\), soit \\(\\theta+\\pi\\) modulo \\(2\\pi\\)' },
    { t:'la rotation de +90° puis la rotation de −90°', a:IDE,
      tr:'\\(\\theta \\to \\theta+\\dfrac{\\pi}{2} \\to \\theta\\) : les deux quarts de tour s\u2019annulent' },
    { t:'la symétrie d\u2019axe (O, i) puis la symétrie d\u2019axe (O, j) puis la symétrie d\u2019axe (O, i)', a:'la symétrie d\u2019axe (O, j)',
      tr:'\\(\\theta \\to -\\theta \\to \\pi+\\theta \\to -\\pi-\\theta\\), soit \\(\\pi-\\theta\\) modulo \\(2\\pi\\)' }
  ];
  const c = pick(comps);
  const pool = [
    'la symétrie d\u2019axe (O, i)', 'la symétrie d\u2019axe (O, j)', 'la symétrie de centre O',
    'la rotation de centre O et d\u2019angle +90°', 'la rotation de centre O et d\u2019angle −90°', IDE
  ];
  const wrongs = pool.filter(w => w !== c.a);
  return QCM(
    `On applique au point M successivement : <b>${c.t}</b>.<br>Quelle est la transformation globale (composée) ?`,
    c.a,
    wrongs,
    1,
    EXPL(
      `Composées remarquables : deux symétries d\u2019axes perpendiculaires donnent la symétrie centrale ; une symétrie suivie de la symétrie centrale donne l\u2019autre symétrie axiale ; chaque symétrie composée avec elle-même redonne l\u2019identité ; deux quarts de tour de même sens donnent un demi-tour (symétrie centrale), de sens opposés l\u2019identité.`,
      `Je suis l\u2019angle pas à pas : ${c.tr}. La composée agit donc comme ${c.a}.`,
      `Ne pas deviner : composer deux symétries axiales ne donne JAMAIS une symétrie axiale, et l\u2019ordre des transformations peut changer le résultat — ici il est sage de tout vérifier sur l\u2019angle.`
    )
  );
};

/* ============================================================
   EXERCICE 8 — POINT DU CERCLE : (cos θ ; sin θ) & QUADRANTS
   ============================================================ */
GEN.tgCoordCercle = function(){
  const v = pick(TG_REM);
  const correct = tgCoordStr(v.c, v.s);
  const wrongs = [
    tgCoordStr(v.s, v.c),
    tgCoordStr(tgNeg(v.c), v.s),
    tgCoordStr(v.c, tgNeg(v.s)),
    tgCoordStr(tgNeg(v.c), tgNeg(v.s)),
    tgCoordStr(v.s, tgNeg(v.c))
  ];
  return QCM(
    `Dans le repère orthonormé direct \\((O\\,;\\,\\vec{i},\\vec{j})\\), le point M du cercle trigonométrique est repéré par l\u2019angle ${M('\\theta = ' + tgPi(v.n,v.d))}.<br>Quelles sont les coordonnées de M ?`,
    M(correct),
    wrongs.map(w => M(w)),
    1,
    EXPL(
      `Par définition, le point du cercle trigonométrique repéré par \\(\\theta\\) a pour coordonnées \\(M(\\cos\\theta\\,;\\,\\sin\\theta)\\) : l\u2019abscisse est le cosinus (axe (O, i)), l\u2019ordonnée le sinus (axe (O, j)), et \\(\\cos^2\\theta + \\sin^2\\theta = 1\\).`,
      `Pour \\(\\theta = ${tgPi(v.n,v.d)}\\), le tableau des valeurs remarquables donne \\(\\cos\\theta = ${v.c}\\) et \\(\\sin\\theta = ${v.s}\\) — les signes se lisent sur le quadrant, la vérification par \\(\\cos^2\\theta + \\sin^2\\theta = 1\\) est possible.`,
      `Échanger cosinus et sinus (abscisse et ordonnée) est l\u2019erreur n°1 ; se tromper de signe la n°2. Contrôle rapide : le quadrant de \\(\\theta\\) impose les signes, et \\(\\tan\\theta\\) n\u2019est pas une coordonnée de M.`
    )
  );
};

GEN.tgQuadrant = function(){
  const v = pick(TG_REM);
  const val = v.n / v.d;
  const q = val < 0.5 ? 1 : val < 1 ? 2 : val < 1.5 ? 3 : 4;
  const quads = [
    'le 1er quadrant (en haut à droite)',
    'le 2ᵉ quadrant (en haut à gauche)',
    'le 3ᵉ quadrant (en bas à gauche)',
    'le 4ᵉ quadrant (en bas à droite)'
  ];
  const cosNeg = (q === 2 || q === 3), sinNeg = (q === 3 || q === 4);
  if(pick([0,1]) === 0){
    return QCM(
      `Le point M du cercle trigonométrique est repéré par ${M('\\theta = ' + tgPi(v.n,v.d))}.<br>Dans quel quadrant se trouve M ?`,
      quads[q-1],
      quads.filter((_, i) => i !== q-1),
      1,
      EXPL(
        `Un tour complet vaut \\(2\\pi\\) : le 1er quadrant couvre \\(\\left]0\\,;\\,\\dfrac{\\pi}{2}\\right[\\), le 2ᵉ \\(\\left]\\dfrac{\\pi}{2}\\,;\\,\\pi\\right[\\), le 3ᵉ \\(\\left]\\pi\\,;\\,\\dfrac{3\\pi}{2}\\right[\\), le 4ᵉ \\(\\left]\\dfrac{3\\pi}{2}\\,;\\,2\\pi\\right[\\).`,
      `Ici \\(\\theta = ${tgPi(v.n,v.d)}\\) et \\(\\dfrac{${v.n}}{${v.d}} = ${val}\\) : c\u2019est compris entre ${q === 1 ? '0 et 0,5' : q === 2 ? '0,5 et 1' : q === 3 ? '1 et 1,5' : '1,5 et 2'} tours, donc ${quads[q-1]}.`,
        `Compter les demi-tours et quarts de tour à partir de la fraction : \\(\\pi\\) est un demi-tour, \\(\\dfrac{\\pi}{2}\\) un quart. Une mesure supérieure à \\(2\\pi\\) se ramène d\u2019abord modulo \\(2\\pi\\).`
      )
    );
  }
  const sgn = b => b ? '\\lt' : '\\gt';
  const combo = (cn, sn) => `\\(\\cos\\theta ${sgn(cn)} 0\\) et \\(\\sin\\theta ${sgn(sn)} 0\\)`;
  return QCM(
    `Le point M du cercle trigonométrique est repéré par ${M('\\theta = ' + tgPi(v.n,v.d))}.<br>Quels sont les signes de \\(\\cos\\theta\\) et \\(\\sin\\theta\\) ?`,
    combo(cosNeg, sinNeg),
    [combo(false,false), combo(false,true), combo(true,false), combo(true,true)]
      .filter(c => c !== combo(cosNeg, sinNeg)),
    1,
    EXPL(
      `\\(\\cos\\theta\\) est l\u2019abscisse de M : positive à droite de l\u2019axe (O, j), négative à gauche. \\(\\sin\\theta\\) est l\u2019ordonnée : positive au-dessus de l\u2019axe (O, i), négative en dessous.`,
      `Ici \\(\\theta = ${tgPi(v.n,v.d)}\\) place M dans ${quads[q-1]} : ${cosNeg ? 'cosinus négatif' : 'cosinus positif'}, ${sinNeg ? 'sinus négatif' : 'sinus positif'}.`,
      `Ne pas se fier à la « taille » de la fraction : seul le quadrant décide des signes. L\u2019erreur classique est d\u2019inverser les axes — le cosinus se lit sur (O, i) horizontal, le sinus sur (O, j) vertical.`
    )
  );
};

/* ============================================================
   RAISONNEMENT À CLÉS — SYMÉTRIES & ROTATIONS (d'après « Les Arcanes »)
   ============================================================ */
GEN.trouSymetrie = function(){
  const t = pick(['axeOi','axeOj','centre','r90','rm90']);
  const v = pick(TG_REM);
  const a = tgAngleOf(t, v);
  const cfg = {
    axeOi: { nom:'la symétrie d\u2019axe (O, i)',
      eff:'l\u2019abscisse x est conservée et l\u2019ordonnée y change de signe',
      co:'(x ; −y)', ang:'−θ',
      prop:'elle laisse la droite (O, i) fixe point par point' },
    axeOj: { nom:'la symétrie d\u2019axe (O, j)',
      eff:'l\u2019ordonnée y est conservée et l\u2019abscisse x change de signe',
      co:'(−x ; y)', ang:'π−θ',
      prop:'elle laisse la droite (O, j) fixe point par point' },
    centre: { nom:'la symétrie de centre O',
      eff:'les deux coordonnées changent de signe',
      co:'(−x ; −y)', ang:'π+θ',
      prop:'c\u2019est aussi une rotation de 180°' },
    r90: { nom:'la rotation de centre O et d\u2019angle +90° (sens direct)',
      eff:'la nouvelle abscisse est −y et la nouvelle ordonnée est x',
      co:'(−y ; x)', ang:'θ+π/2',
      prop:'elle envoie l\u2019axe (O, i) sur l\u2019axe (O, j)' },
    rm90: { nom:'la rotation de centre O et d\u2019angle −90° (sens indirect)',
      eff:'la nouvelle abscisse est y et la nouvelle ordonnée est −x',
      co:'(y ; −x)', ang:'θ−π/2',
      prop:'elle envoie l\u2019axe (O, j) sur l\u2019axe (O, i)' }
  }[t];
  const nomsAll = ['la symétrie d\u2019axe (O, i)','la symétrie d\u2019axe (O, j)','la symétrie de centre O',
                   'la rotation de centre O et d\u2019angle +90° (sens direct)','la rotation de centre O et d\u2019angle −90° (sens indirect)'];
  const effsAll = [
    'l\u2019abscisse x est conservée et l\u2019ordonnée y change de signe',
    'l\u2019ordonnée y est conservée et l\u2019abscisse x change de signe',
    'les deux coordonnées changent de signe',
    'la nouvelle abscisse est −y et la nouvelle ordonnée est x',
    'la nouvelle abscisse est y et la nouvelle ordonnée est −x'
  ];
  const cosAll = ['(x ; −y)','(−x ; y)','(−x ; −y)','(−y ; x)','(y ; −x)'];
  const angsAll = ['−θ','π−θ','π+θ','θ+π/2','θ−π/2'];
  const distract = []
    .concat(nomsAll.filter(x => x !== cfg.nom))
    .concat(effsAll.filter(x => x !== cfg.eff))
    .concat(cosAll.filter(x => x !== cfg.co))
    .concat(angsAll.filter(x => x !== cfg.ang))
    .concat(['les angles','remarquable','hippogriffe','pamplemousse','un demi-tour']);
  return TROU(
    `Symétrie, rotation et image : complète le raisonnement.`,
    `Sur le cercle trigonométrique, M est le point repéré par \\(\\theta = ${tgPi(v.n,v.d)}\\), de coordonnées \\(M(x\\,;\\,y)\\).
     Étape 1 : j\u2019identifie la transformation : {{0}}.
     Étape 2 : effet sur les coordonnées : {{1}} — les coordonnées de l\u2019image sont donc \\(M'\\) de coordonnées {{2}}.
     Étape 3 : sur l\u2019angle, la transformation envoie \\(\\theta\\) sur {{3}}, donc l\u2019angle image est \\(${tgPi(a.n,a.d)}\\).
     Étape 4 : propriété clé : {{4}}.
     Étape 5 : comme toute isométrie, elle conserve {{5}} — le point image reste sur le cercle.
     Vérification : \\(x'^2 + y'^2 = 1\\) — c\u2019est l\u2019identité {{6}}, vraie pour tout point du cercle.`,
    [cfg.nom, cfg.eff, cfg.co, cfg.ang, cfg.prop, 'les distances', 'fondamentale'],
    distract,
    `Identifier d\u2019abord la transformation, puis son double effet : sur les coordonnées ET sur l\u2019angle. Un seul signe changé = symétrie axiale, deux = symétrie centrale, échange des coordonnées = quart de tour.`
  );
};

/* ============================================================
   FICHES DE COURS
   ============================================================ */
FICHES['trigo-conversion-rad'] = { titre: '🌐 Degrés, radians & mesure principale', html: `
  <p><b>Correspondance fondamentale :</b> \\(180^\\circ = \\pi\\) rad, donc \\(360^\\circ = 2\\pi\\). Conversions : \\(\\theta_{\\text{rad}} = \\theta_{\\text{deg}} \\times \\dfrac{\\pi}{180}\\) et \\(\\theta_{\\text{deg}} = \\theta_{\\text{rad}} \\times \\dfrac{180}{\\pi}\\).</p>
  <p><b>Conversions exactes :</b> simplifier la fraction \\(\\dfrac{a\\pi}{180}\\) par le PGCD et garder le symbole \\(\\pi\\) : \\(30^\\circ = \\dfrac{\\pi}{6}\\), \\(45^\\circ = \\dfrac{\\pi}{4}\\), \\(60^\\circ = \\dfrac{\\pi}{3}\\), \\(90^\\circ = \\dfrac{\\pi}{2}\\). Une conversion d\u2019unité ne change pas l\u2019angle.</p>
  <p><b>Même point du cercle (modulo \\(2\\pi\\)) :</b> deux réels repèrent le même point si et seulement s\u2019ils diffèrent d\u2019un multiple de \\(2\\pi\\) : \\(\\theta' = \\theta + 2k\\pi\\), \\(k\\) entier relatif. Ajouter un tour complet ne déplace pas le point ; ajouter \\(\\pi\\) donne le point diamétralement opposé.</p>
  <p><b>Mesure principale :</b> l\u2019unique mesure de l\u2019angle dans \\(\\left]-\\pi\\,;\\,\\pi\\right]\\). Pour \\(\\theta = \\dfrac{n\\pi}{d}\\), division euclidienne de \\(n\\) par \\(2d\\) : \\(n = 2d \\times q + r\\). Si \\(r \\leq d\\), la mesure principale est \\(\\dfrac{r\\pi}{d}\\) ; sinon on retranche un tour : \\(\\dfrac{(r-2d)\\pi}{d}\\).</p>
  <p><b>Exemple :</b> \\(\\dfrac{13\\pi}{6}\\) : \\(13 = 12 \\times 1 + 1\\), et \\(1 \\leq 6\\), donc la mesure principale est \\(\\dfrac{\\pi}{6}\\). Pour \\(\\dfrac{22\\pi}{6}\\) : \\(22 = 12 \\times 1 + 10\\), or \\(10 \\gt 6\\) : on retranche un tour, \\(\\dfrac{-2\\pi}{6} = -\\dfrac{\\pi}{3}\\).</p>` };

FICHES['trigo-symetries'] = { titre: '🌐 Symétries, rotations & coordonnées', html: `
  <p><b>Point du cercle :</b> \\(M(\\cos\\theta\\,;\\,\\sin\\theta)\\) — l\u2019abscisse est le cosinus (axe (O, i)), l\u2019ordonnée le sinus (axe (O, j)), et \\(\\cos^2\\theta + \\sin^2\\theta = 1\\).</p>
  ${tableHTML(['Transformation','Coordonnées de M′','Angle image'],[
    ['Symétrie d\u2019axe (O, i)','(x ; −y)','−θ'],
    ['Symétrie d\u2019axe (O, j)','(−x ; y)','π−θ'],
    ['Symétrie de centre O','(−x ; −y)','π+θ'],
    ['Rotation de +90° (sens direct)','(−y ; x)','θ+π/2'],
    ['Rotation de −90° (sens indirect)','(y ; −x)','θ−π/2']
  ])}
  <p><b>Identifier la transformation :</b> un seul signe changé → symétrie axiale (ordonnée changée : axe (O, i) ; abscisse changée : axe (O, j)) ; deux signes changés → symétrie de centre O ; échange des coordonnées → rotation de ±90°. Sur les angles, comparer \\(\\theta'\\) à \\(-\\theta\\), \\(\\pi-\\theta\\), \\(\\pi+\\theta\\), \\(\\theta+\\dfrac{\\pi}{2}\\), \\(\\theta-\\dfrac{\\pi}{2}\\) (quitte à changer l\u2019écriture modulo \\(2\\pi\\)).</p>
  <p><b>Composées remarquables :</b> symétrie d\u2019axe (O, j) après symétrie d\u2019axe (O, i) = symétrie de centre O ; symétrie centrale après symétrie axiale = l\u2019autre symétrie axiale ; chaque symétrie composée avec elle-même = identité ; deux quarts de tour de même sens = symétrie centrale (180°) ; +90° puis −90° = identité.</p>
  <p><b>Quadrants :</b> \\(\\cos\\theta \\gt 0\\) à droite de l\u2019axe (O, j), \\(\\sin\\theta \\gt 0\\) au-dessus de l\u2019axe (O, i). Les valeurs absolues viennent du tableau des angles remarquables, les signes du quadrant.</p>` };

/* ============================================================
   GEN_INFO DES 14 GÉNÉRATEURS
   ============================================================ */
(function(){
  const CV = 'trigo-conversion-rad', SY = 'trigo-symetries';
  const defs = [
    ['tgConv',        'Conversion degrés → radians',              [CV, 'trigo-cercle']],
    ['tgConvInv',     'Conversion radians → degrés',              [CV, 'trigo-cercle']],
    ['tgMemePoint',   'Même point du cercle (modulo 2π)',         [CV]],
    ['tgPrincipale',  'Mesure principale par division euclidienne', [CV]],
    ['trouConv',      'Raisonnement : conversion complète',       [CV]],
    ['trouModulo',    'Raisonnement : modulo & mesure principale', [CV]],
    ['tgSymCoord',    'Image par symétrie (coordonnées)',         [SY]],
    ['tgRotCoord',    'Image par rotation de ±90° (coordonnées)', [SY]],
    ['tgAngleImage',  'Angle image d\u2019une symétrie ou rotation', [SY]],
    ['tgIdentifier',  'Identifier la transformation',             [SY]],
    ['tgCompoSym',    'Composée de deux transformations',         [SY]],
    ['trouSymetrie',  'Raisonnement : symétrie complète',         [SY]],
    ['tgCoordCercle', 'Coordonnées (cos θ ; sin θ) du point',     ['trigo-cercle', SY]],
    ['tgQuadrant',    'Quadrants & signes de cos et sin',         ['trigo-cercle', SY]]
  ];
  const rappels = {
    tgConv: "180° = π : multiplier par π⁄180 puis simplifier la fraction.",
    tgConvInv: "π rad = 180° : multiplier par 180⁄π.",
    tgMemePoint: "Même point ⟺ différence d\u2019un multiple de 2π : θ + 2kπ.",
    tgPrincipale: "Division euclidienne du numérateur par 2d, puis retrait des tours complets pour revenir dans ]−π ; π].",
    trouConv: "Chaîne : correspondance 180° = π, facteur π⁄180, simplification par le PGCD, valeur exacte.",
    trouModulo: "Chaîne : multiple de 2π, tours complets, division euclidienne, mesure principale unique.",
    tgSymCoord: "Axe (O, i) : (x ; −y) ; axe (O, j) : (−x ; y) ; centre O : (−x ; −y).",
    tgRotCoord: "+90° : (−y ; x) ; −90° : (y ; −x).",
    tgAngleImage: "−θ, π−θ, π+θ ou θ±π⁄2 selon la transformation.",
    tgIdentifier: "Comparer les changements de signes et les échanges de coordonnées (ou d\u2019angles).",
    tgCompoSym: "Suivre l\u2019angle étape par étape : deux symétries d\u2019axes perpendiculaires donnent la symétrie centrale.",
    trouSymetrie: "Chaîne : identifier, coordonnées de l\u2019image, angle image, propriété, conservation des distances.",
    tgCoordCercle: "M = (cos θ ; sin θ) : abscisse = cosinus, ordonnée = sinus.",
    tgQuadrant: "cos θ lit l\u2019abscisse, sin θ l\u2019ordonnée : les signes viennent du quadrant."
  };
  defs.forEach(function(d){ GEN_INFO[d[0]] = { label: d[1], fiches: d[2], rappel: rappels[d[0]] }; });
})();

/* ============================================================
   5 NOTIONS EN SOMMET DE TOUR (→ 160 étages)
   ============================================================ */
NOTIONS.push(
  { id: 'trigo-conversion', name: 'Degrés & radians : conversions exactes',
    g: ['tgConv', 'tgConvInv', 'trouConv'], family: 'violet', prob: 0.5 },
  { id: 'trigo-modulo', name: 'Même point du cercle & modulo 2π',
    g: ['tgMemePoint', 'trouModulo'], family: 'violet', prob: 0.5 },
  { id: 'trigo-mesure-principale', name: 'Mesure principale d\u2019un angle',
    g: ['tgPrincipale'], family: 'violet', prob: 0.5 },
  { id: 'trigo-symetries', name: 'Symétries, rotations & coordonnées de l\u2019image',
    g: ['tgSymCoord', 'tgRotCoord', 'tgAngleImage', 'tgIdentifier', 'tgCompoSym', 'trouSymetrie'], family: 'violet', prob: 0.5 },
  { id: 'trigo-cossin', name: 'Point du cercle : cosinus, sinus & quadrants',
    g: ['tgCoordCercle', 'tgQuadrant'], family: 'violet', prob: 0.5 }
);

/* Formes 3D des nouveaux étages (constantes de 14-formes-3d.js). */
document.addEventListener('DOMContentLoaded', function(){
  FLOOR_SHAPES['trigo-conversion']        = 'arc';
  FLOOR_SHAPES['trigo-modulo']             = 'clock';
  FLOOR_SHAPES['trigo-mesure-principale']  = 'colonnade';
  FLOOR_SHAPES['trigo-symetries']          = 'dome';
  FLOOR_SHAPES['trigo-cossin']            = 'sphere';
});
