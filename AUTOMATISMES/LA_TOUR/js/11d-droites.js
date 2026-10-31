/* ============================================================
   11d. NOTIONS DROITES DANS LE PLAN
   Intégration des sept documents « Droites dans le plan »
   (cours, exercices fractions, exercices 1–10, automatismes,
   problèmes de synthèse, PBL, bilan « L'Odyssée de la Droite ») :
   chaque type d'exercice ABSENT de la tour y est adapté à son
   format (QCM à choix + raisonnements à trous, contexte
   professionnel, leçon cours/méthode/piège à chaque erreur).
   Ce module :
   - enregistre 20 nouveaux générateurs dans GEN ;
   - enrichit GEN_INFO (libellé + rappel + fiches de chaque
     élément simple) et FICHES (nouvelle fiche « droites-plan ») ;
   - ajoute 6 notions en sommet de tour (NOTIONS.push) AVANT que
     12-etat-jeu.js ne calcule N_TOT : la tour compte donc
     147 étages.
   ============================================================ */

/* ============================================================
   UTILITAIRES — FRACTIONS EXACTES {n, d} (d > 0, irréductibles)
   ============================================================ */
function tdmDGcd(a, b){
  a = Math.abs(a); b = Math.abs(b);
  while(b){ var t = a % b; a = b; b = t; }
  return a || 1;
}
function tdmFR(n, d){
  if(d === undefined) d = 1;
  if(d === 0) d = 1;
  if(d < 0){ n = -n; d = -d; }
  const g = tdmDGcd(n, d);
  return { n: n / g, d: d / g };
}
const ONE  = tdmFR(1, 1);
const INTk = k => tdmFR(k, 1);

function frAdd(a, b){ return tdmFR(a.n * b.d + b.n * a.d, a.d * b.d); }
function frSub(a, b){ return tdmFR(a.n * b.d - b.n * a.d, a.d * b.d); }
function frMul(a, b){ return tdmFR(a.n * b.n, a.d * b.d); }
function frDiv(a, b){ return tdmFR(a.n * b.d, a.d * b.n); }
function frNeg(a){ return { n: -a.n, d: a.d }; }
function frVal(a){ return a.n / a.d; }
function frEq(a, b){ return a.n === b.n && a.d === b.d; }

/* Fraction → LaTeX (valeur exacte, jamais de décimal). */
function frTex(r){
  if(r.n === 0) return '0';
  if(r.d === 1) return String(r.n);
  return (r.n < 0 ? '-' : '') + '\\dfrac{' + Math.abs(r.n) + '}{' + r.d + '}';
}
/* Valeur absolue de fraction → LaTeX. */
function frTexP(r){ return frTex({ n: Math.abs(r.n), d: r.d }); }
/* Fraction négative entre parenthèses (pour « a − (b) » lisible). */
function frTexPar(r){ return (r.n < 0 && r.d === 1) || (r.n < 0) ? '\\left(' + frTex(r) + '\\right)' : frTex(r); }

/* Pentes fractionnaires « lisibles » (|m| < 3). */
const TDM_PENTES = [
  [1, 2], [-1, 2], [3, 2], [-3, 2], [5, 2], [-5, 2],
  [1, 3], [-1, 3], [2, 3], [-2, 3], [4, 3], [-4, 3],
  [1, 4], [-1, 4], [3, 4], [-3, 4], [5, 4], [-5, 4]
].map(v => tdmFR(v[0], v[1]));
/* Pentes entières (pour croiser les types d'énoncés). */
const TDM_PENTES_INT = [-4, -3, -2, 2, 3, 4].map(v => tdmFR(v, 1));

/* Membre « mx + p » (sans « y = »), fractions exactes. */
function tdmEqMembre(m, p){
  let s = '';
  if(m.n !== 0){
    if(m.n === 1 && m.d === 1) s = 'x';
    else if(m.n === -1 && m.d === 1) s = '-x';
    else if(m.d === 1) s = m.n + 'x';
    else s = (m.n < 0 ? '-' : '') + '\\dfrac{' + Math.abs(m.n) + '}{' + m.d + '}\\,x';
  }
  if(p.n !== 0){
    const abs = (p.d === 1) ? String(Math.abs(p.n)) : '\\dfrac{' + Math.abs(p.n) + '}{' + p.d + '}';
    s += (s === '' ? (p.n < 0 ? '-' : '') : (p.n > 0 ? ' + ' : ' - ')) + abs;
  }
  return (s === '' ? '0' : s);
}
/* Équation réduite complète : « lhs = mx + p ». */
function tdmEqTex(m, p, lhs){
  lhs = lhs || 'y';
  if(m.n === 0) return '\\(' + lhs + ' = ' + frTex(p) + '\\)';
  return '\\(' + lhs + ' = ' + tdmEqMembre(m, p) + '\\)';
}
/* Équation cartésienne « ax + by + c = 0 » (a, b, c entiers). */
function tdmCartTex(a, b, c){
  let s = '';
  const term = (k, v) => {
    if(k === 0) return;
    const coef = (Math.abs(k) === 1 ? '' : String(Math.abs(k)));
    s += (s === '' ? (k < 0 ? '-' : '') : (k < 0 ? ' - ' : ' + ')) + coef + v;
  };
  term(a, 'x'); term(b, 'y');
  if(c !== 0) s += (s === '' ? (c < 0 ? '-' : '') : (c < 0 ? ' - ' : ' + ')) + Math.abs(c);
  if(s === '') s = '0';
  return '\\(' + s + ' = 0\\)';
}
/* Coordonnées d'un point « (x ; y) », fractions exactes. */
function tdmPtTex(x, y){ return '\\(' + frTex(x) + '\\,;\\,' + frTex(y) + '\\)'; }

/* Signe d'un entier pour un affichage « +3 » / « -3 ». */
function tdmSgn(k){ return k >= 0 ? '+' + k : '' + k; }

/* ============================================================
   NOTION « DROITES & FRACTIONS »
   (équation réduite avec coefficients fractionnaires : deux
   points, point + pente, point + ordonnée à l'origine, deux
   images, lecture graphique — documents EXERCICES_DROITES)
   ============================================================ */

/* Exercice 1 du document : équation réduite par DEUX POINTS (pente
   fractionnaire). Le générateur eqDroite (banque) ne traite que des
   coefficients ENTIERS : ici tout est exact en fractions. */
GEN.dEqFrac2pts = () => {
  const m = pick(TDM_PENTES);
  const d = pick([-4, -3, -2, 2, 3, 4]);             /* Δx entier ≠ 0 */
  const x1 = R(-4, 4), y1 = R(-4, 4);
  const x2 = x1 + d;
  const y2 = frAdd(INTk(y1), frMul(m, INTk(d)));    /* y2 = y1 + m·d  */
  const p = frSub(INTk(y1), frMul(m, INTk(x1)));    /* p = y1 − m·x1  */
  return QCM(
    `On donne \\(A(${x1}\\,;\\,${y1})\\) et \\(B(${frTex(INTk(x2))}\\,;\\,${frTex(y2)})\\).\n    Équation réduite de la droite \\((AB)\\) ?`,
    tdmEqTex(m, p),
    [tdmEqTex(frNeg(m), p), tdmEqTex(frDiv(ONE, m), p),
     tdmEqTex(m, frAdd(INTk(y1), frMul(m, INTk(x1)))),
     tdmEqTex(m, frAdd(p, ONE))],
    1,
    EXPL(`\\(m=\\dfrac{y_B-y_A}{x_B-x_A}\\) puis \\(p=y_A-m\\,x_A\\) : la pente se calcule TOUJOURS en premier.`,
      `\\(m=\\dfrac{${frTex(y2)}-(${y1})}{${x2}-(${x1})}=\\dfrac{${frTex(frMul(m, INTk(d)))}}{${d}}=${frTex(m)}\\), puis \\(p=${y1}-${frTexPar(m)}\\times(${x1})=${frTex(p)}\\), d'où \\(${tdmEqMembre(m, p)}\\) avec \\(y=\\).`,
      `Ne pas inverser numérateur et dénominateur : c'est la variation VERTICALE sur la variation horizontale.`));
};

/* Exercice 2 du document : POINT + COEFFICIENT DIRECTEUR → p. */
GEN.dPointCoeff = () => {
  const m = Math.random() < 0.7 ? pick(TDM_PENTES) : pick(TDM_PENTES_INT);
  const x1 = R(-5, 5), y1 = R(-5, 5);
  const p = frSub(INTk(y1), frMul(m, INTk(x1)));
  return QCM(
    `La droite \\((D)\\) passe par \\(A(${x1}\\,;\\,${y1})\\) et a pour coefficient directeur \\(m=${frTex(m)}\\).\n    Quelle est son ordonnée à l'origine \\(p\\) ?`,
    M('p = ' + frTex(p)),
    [M('p = ' + frTex(frAdd(INTk(y1), frMul(m, INTk(x1))))),
     M('p = ' + frTex(frSub(INTk(y1), m))),
     M('p = ' + frTex(frNeg(p))),
     M('p = ' + frTex(frAdd(p, ONE)))],
    1,
    EXPL(`Le point \\(A\\) est SUR la droite : \\(y_A=m\\,x_A+p\\), donc \\(p=y_A-m\\,x_A\\).`,
      `\\(p=${y1}-${frTexPar(m)}\\times(${x1})=${y1}-${frTexPar(frMul(m, INTk(x1)))}=${frTex(p)}\\).`,
      `Ne pas écrire \\(p=y_A-m\\) : la pente multiplie l'ABSCISSE du point, pas seulement son ordonnée.`));
};

/* Exercice 3 du document : POINT + ORDONNÉE À L'ORIGINE → m. */
GEN.dPointOrdo = () => {
  const p = R(-6, 6);
  const x1 = nz(-5, 5);
  let y1;
  do { y1 = R(-5, 5); } while(y1 === p);      /* exclure la droite horizontale */
  const m = frDiv(frSub(INTk(y1), INTk(p)), INTk(x1));
  return QCM(
    `La droite \\((D)\\) coupe l'axe des ordonnées au point \\((0\\,;\\,${p})\\) et passe par \\(A(${x1}\\,;\\,${y1})\\).\n    Quel est son coefficient directeur \\(m\\) ?`,
    M('m = ' + frTex(m)),
    [M('m = ' + frTex(frNeg(m))),
     M('m = ' + frTex(frDiv(INTk(x1), frSub(INTk(y1), INTk(p))))),
     M('m = ' + frTex(frSub(INTk(y1), INTk(p)))),
     M('m = ' + frTex(frAdd(m, ONE)))],
    1,
    EXPL(`\\(p\\) est l'ordonnée du point d'intersection avec l'axe \\((Oy)\\) : \\(A\\) et ce point donnent la pente.`,
      `\\(m=\\dfrac{y_A-p}{x_A-0}=\\dfrac{${y1}-(${p})}{${x1}}=${frTex(m)}\\).`,
      `Diviser la variation d'ordonnées par la variation d'abscisses — pas l'inverse, et le dénominateur est \\(x_A-0\\), pas \\(x_A-1\\).`));
};

/* Exercice 4 du document : DEUX IMAGES d'une fonction affine. */
GEN.dDeuxImages = () => {
  const m = pick(TDM_PENTES);
  const a1 = R(-5, 5);
  const d = pick([-3, -2, -1, 1, 2, 3]);
  const a2 = a1 + d;
  const b1 = R(-4, 4);
  const b2 = frAdd(INTk(b1), frMul(m, INTk(d)));
  const p = frSub(INTk(b1), frMul(m, INTk(a1)));
  return QCM(
    `\\(f\\) est une fonction affine telle que \\(f(${a1})=${b1}\\) et \\(f(${frTex(INTk(a2))})=${frTex(b2)}\\).\n    Expression de \\(f(x)\\) ?`,
    tdmEqTex(m, p, 'f(x)'),
    [tdmEqTex(frNeg(m), p, 'f(x)'),
     tdmEqTex(frDiv(ONE, m), p, 'f(x)'),
     tdmEqTex(m, frAdd(INTk(b1), frMul(m, INTk(a1))), 'f(x)'),
     tdmEqTex(m, INTk(b1), 'f(x)')],
    1,
    EXPL(`Le taux d'accroissement d'une fonction affine est CONSTANT : \\(m=\\dfrac{f(a_2)-f(a_1)}{a_2-a_1}\\).`,
      `\\(m=\\dfrac{${frTex(b2)}-(${b1})}{${a2}-(${a1})}=\\dfrac{${frTex(frMul(m, INTk(d)))}}{${d}}=${frTex(m)}\\), puis \\(p=f(a_1)-m\\,a_1=${b1}-${frTexPar(m)}\\times(${a1})=${frTex(p)}\\), d'où \\(f(x)=${tdmEqMembre(m, p)}\\).`,
      `Les deux images définissent la droite : utiliser les DEUX, l'une pour la pente, l'autre (ou la même) pour \\(p\\) — un seul point ne suffit jamais.`));
};

/* Exercices 5 & 6 du document : LECTURE GRAPHIQUE d'une droite tracée
   (p entier puis p fractionnaire) — adaptée en lecture textuelle de
   deux points de la grille. */
GEN.dLectureGraph = () => {
  const p = R(-6, 6);
  let x1, y1, m;
  do {
    x1 = nz(-6, 6);
    y1 = R(-6, 6);
    m = tdmFR(y1 - p, x1);                     /* m = (y1 − p)/x1 */
  } while(frEq(m, ONE) || m.n === 0 || Math.abs(frVal(m)) > 4);
  return QCM(
    `Dans un repère orthonormé, la droite \\((\\Delta)\\) coupe l'axe des ordonnées au point de coordonnées \\((0\\,;\\,${p})\\) et passe par le point \\((${x1}\\,;\\,${y1})\\) de la grille.\n    Équation réduite de \\((\\Delta)\\) ?`,
    tdmEqTex(m, INTk(p)),
    [tdmEqTex(frNeg(m), INTk(p)),
     tdmEqTex(frDiv(ONE, m), INTk(p)),
     tdmEqTex(m, INTk(-p)),
     tdmEqTex(frSub(m, ONE), INTk(p))],
    1,
    EXPL(`Sur un graphique, on LIT l'ordonnée à l'origine sur l'axe vertical, puis la pente entre deux points de la grille.`,
      `Ici \\(p=${p}\\) (lecture à l'axe) et \\(m=\\dfrac{${y1}-(${p})}{${x1}-0}=${frTex(m)}\\) (pente entre les deux points lus), d'où \\(y=${tdmEqMembre(m, INTk(p))}\\).`,
      `Ne pas confondre les axes : l'ordonnée à l'origine se lit en \\(x=0\\) (axe VERTICAL), jamais sur l'axe horizontal.`));
};

/* ============================================================
   NOTION « DROITES & AXES »
   (intersections avec les axes, signe de l'ordonnée —
   document DROITES_EXERCICES, exercices 4 et 5)
   ============================================================ */

/* Exercice 4 : intersections d'une droite avec les deux axes. */
GEN.dInterAxes = () => {
  const m = pick(TDM_PENTES);
  let p, x0;
  do {
    p = pick(TDM_PENTES.concat(TDM_PENTES_INT));
    x0 = frDiv(frNeg(p), m);                  /* abscisse du point sur (Ox) */
  } while(p.n === 0 || Math.abs(frVal(x0)) > 8);
  return QCM(
    `La droite \\((D)\\) a pour équation ${tdmEqTex(m, p)}.\n    Coordonnées de son point d'intersection avec l'axe des abscisses ?`,
    tdmPtTex(x0, INTk(0)),
    [tdmPtTex(frDiv(p, m), INTk(0)),
     tdmPtTex(frDiv(frNeg(m), p), INTk(0)),
     tdmPtTex(INTk(0), p),
     tdmPtTex(frAdd(x0, ONE), INTk(0))],
    1,
    EXPL(`Sur l'axe des abscisses, l'ordonnée est NULLE : on résout \\(y=0\\), soit \\(mx+p=0\\).`,
      `\\(${frTex(m)}\\,x+${frTex(p)}=0\\Rightarrow x=\\dfrac{${frTex(frNeg(p))}}{${frTex(m)}}=${frTex(x0)}\\) : le point est \\((${frTex(x0)}\\,;\\,0)\\) ; sur \\((Oy)\\), ce serait \\((0\\,;\\,${frTex(p)})\\).`,
      `Ne pas écrire \\(x=-\\dfrac{m}{p}\\) : on divise par la PENTE, et l'ordonnée à l'origine change de signe au passage.`));
};

/* Exercice 5 : signe de l'ordonnée y = mx + p. */
GEN.dSigne = () => {
  const m = pick(TDM_PENTES.concat(TDM_PENTES_INT));
  let p;
  do { p = pick(TDM_PENTES.concat(TDM_PENTES_INT)); } while(p.n === 0);
  const x0 = frDiv(frNeg(p), m);
  const strict = Math.random() < 0.5;
  /* Opérateurs : celui de l'énoncé et son « opposé ». */
  const opPos = strict ? '\\gt' : '\\geqslant';
  const opNeg = strict ? '\\lt' : '\\leqslant';
  /* m > 0 : mx+p > 0 ⇔ x > x0 ; m < 0 : mx+p > 0 ⇔ x < x0. */
  const opSol = (m.n > 0) ? opPos : opNeg;
  const opFaux = (m.n > 0) ? opNeg : opPos;
  return QCM(
    `La droite \\((D)\\) a pour équation ${tdmEqTex(m, p)}. Résoudre dans \\(\\mathbb{R}\\) l'inéquation \\(${tdmEqMembre(m, p)} ${opPos} 0\\) ?`,
    M('x ' + opSol + ' ' + frTex(x0)),
    [M('x ' + opFaux + ' ' + frTex(x0)),
     M('x ' + opSol + ' ' + frTex(frNeg(x0))),
     M('x ' + opSol + ' ' + frTex(frDiv(p, m))),
     M('x ' + opSol + ' ' + frTex(frAdd(x0, ONE)))],
    1,
    EXPL(`\\(y=mx+p\\) change de signe en \\(x_0=-\\dfrac{p}{m}\\) ; le signe de \\(m\\) dit de quel côté l'expression est positive.`,
      `Ici \\(x_0=\\dfrac{${frTex(frNeg(p))}}{${frTex(m)}}=${frTex(x0)}\\) et \\(m${m.n > 0 ? '\\gt' : '\\lt'}0\\) : \\(mx+p\\) est positif pour \\(x ${opSol} ${frTex(x0)}\\) (si \\(m\\lt0\\), l'inégalité se retourne en divisant).`,
      `Si \\(m\\lt0\\), la droite DESCEND : la solution est \\(x ${opNeg} x_0\\) — garder le sens de l'énoncé est l'erreur classique.`));
};
/* Exercice 6 : position relative de deux droites. */
GEN.dPosition2 = () => {
  const cas = R(1, 3);
  const m1 = pick(TDM_PENTES.concat(TDM_PENTES_INT));
  const p1 = pick(TDM_PENTES.concat(TDM_PENTES_INT));
  let m2 = m1, p2 = p1;
  if(cas === 1){                                /* parallèles strictes */
    do { p2 = pick(TDM_PENTES.concat(TDM_PENTES_INT)); } while(frEq(p2, p1));
  } else if(cas === 3){                         /* sécantes */
    do { m2 = pick(TDM_PENTES.concat(TDM_PENTES_INT)); } while(frEq(m2, m1));
    p2 = pick(TDM_PENTES.concat(TDM_PENTES_INT));
  }
  const TEXTE = ['Parallèles strictes (aucun point commun)',
                 'Confondues (exactement la même droite)',
                 'Sécantes (un unique point commun)'];
  const autres = TEXTE.filter((t, i) => i !== cas - 1)
    .concat(['Perpendiculaires (elles se coupent à angle droit)']);
  return QCM(
    `Soient \\((d_1)\\) : ${tdmEqTex(m1, p1)} et \\((d_2)\\) : ${tdmEqTex(m2, p2)}.\n    Quelle est la position relative de \\((d_1)\\) et \\((d_2)\\) ?`,
    TEXTE[cas - 1],
    autres,
    1,
    EXPL(`On compare d'abord les PENTES : \\(m_1=m_2\\) → parallèles (confondues si \\(p_1=p_2\\)) ; \\(m_1\\ne m_2\\) → sécantes.`,
      `Ici ${frEq(m1, m2) ? '\\(m_1=m_2=' + frTex(m1) + '\\)' : '\\(m_1=' + frTex(m1) + '\\ne m_2=' + frTex(m2) + '\\)'}` +
      (frEq(m1, m2) ? (frEq(p1, p2) ? ` et \\(p_1=p_2=${frTex(p1)}\\) : mêmes pente ET ordonnée → droites CONFONDUES.` : ` mais \\(p_1=${frTex(p1)}\\ne p_2=${frTex(p2)}\\) : parallèles STRICTES.`) : ` : les pentes diffèrent → droites SÉCANTES en un unique point.`),
      `Ne pas se fier à un dessin : deux droites « presque » parallèles sur le graphique sont sécantes dès que \\(m_1\\ne m_2\\).`));
};

/* Point d'intersection de deux droites sécantes (fractions exactes). */
GEN.dIntersectPt = () => {
  let m1, m2, p1, p2, xI;
  do {
    m1 = pick(TDM_PENTES.concat(TDM_PENTES_INT));
    m2 = pick(TDM_PENTES.concat(TDM_PENTES_INT));
    p1 = pick(TDM_PENTES.concat(TDM_PENTES_INT));
    p2 = pick(TDM_PENTES.concat(TDM_PENTES_INT));
    xI = frDiv(frSub(p2, p1), frSub(m1, m2));   /* (p2−p1)/(m1−m2) */
  } while(frEq(m1, m2) || Math.abs(frVal(xI)) > 8);
  const yI = frAdd(frMul(m1, xI), p1);
  return QCM(
    `\\((d_1)\\) : ${tdmEqTex(m1, p1)} et \\((d_2)\\) : ${tdmEqTex(m2, p2)} se coupent en \\(I\\).\n    Coordonnées de \\(I\\) ?`,
    tdmPtTex(xI, yI),
    [tdmPtTex(yI, xI),
     tdmPtTex(frNeg(xI), yI),
     tdmPtTex(frDiv(frSub(p2, p1), frSub(m2, m1)), yI),
     tdmPtTex(xI, frAdd(frMul(m2, xI), p2))],
    1,
    EXPL(`Au point d'intersection, les deux ordonnées sont égales : \\(m_1x+p_1=m_2x+p_2\\), d'où \\(x=\\dfrac{p_2-p_1}{m_1-m_2}\\).`,
      `\\(x_I=\\dfrac{${frTex(p2)}-\\left(${frTex(p1)}\\right)}{${frTex(m1)}-\\left(${frTex(m2)}\\right)}=${frTex(xI)}\\) puis \\(y_I=${frTex(m1)}\\times${frTexPar(xI)}${p1.n < 0 ? '-' : '+'}${frTexP(p1)}=${frTex(yI)}\\) : on vérifie avec \\((d_2)\\).`,
      `Ne pas permuter la soustraction des pentes : \\(m_1-m_2\\) au dénominateur, en cohérence avec \\(p_2-p_1\\) au numérateur.`));
};

/* Exercice 7 : parallèle à une droite passant par un point. */
GEN.dParallele = () => {
  const m = pick(TDM_PENTES.concat(TDM_PENTES_INT));
  let p;
  do { p = pick(TDM_PENTES.concat(TDM_PENTES_INT)); } while(p.n === 0);
  const x1 = R(-5, 5), y1 = R(-6, 6);
  const p2 = frSub(INTk(y1), frMul(m, INTk(x1)));
  return QCM(
    `La droite \\((D)\\) a pour équation ${tdmEqTex(m, p)}.\n    Équation réduite de la droite \\((D')\\) PARALLÈLE à \\((D)\\) passant par \\(A(${x1}\\,;\\,${y1})\\) ?`,
    tdmEqTex(m, p2),
    [tdmEqTex(m, p),
     tdmEqTex(frNeg(frDiv(ONE, m)), p2),
     tdmEqTex(frNeg(m), p2),
     tdmEqTex(m, frAdd(p2, ONE))],
    1,
    EXPL(`Deux droites parallèles ont la MÊME pente : \\((D')\\) garde \\(m=${frTex(m)}\\) et s'ajuste pour passer par \\(A\\).`,
      `\\(p'=y_A-m\\,x_A=${y1}-${frTexPar(m)}\\times(${x1})=${frTex(p2)}\\), d'où \\((D')\\) : \\(y=${tdmEqMembre(m, p2)}\\).`,
      `Garder la pente ne suffit pas : il faut RECALCULER l'ordonnée à l'origine avec \\(A\\) — celle de \\((D)\\) ne convient que si \\(A\\) est déjà sur \\((D)\\).`));
};

/* Exercice 8 : perpendiculaire à une droite passant par un point. */
GEN.dPerpendiculaire = () => {
  const m = pick(TDM_PENTES);
  const p = R(-5, 5);
  const x1 = R(-5, 5), y1 = R(-6, 6);
  const mP = frNeg(frDiv(ONE, m));               /* m' = −1/m (fraction) */
  const pP = frSub(INTk(y1), frMul(mP, INTk(x1)));
  return QCM(
    `La droite \\((D)\\) a pour équation ${tdmEqTex(m, INTk(p))}.\n    Équation réduite de la droite \\((D')\\) PERPENDICULAIRE à \\((D)\\) passant par \\(A(${x1}\\,;\\,${y1})\\) ?`,
    tdmEqTex(mP, pP),
    [tdmEqTex(m, pP),
     tdmEqTex(frDiv(ONE, m), pP),
     tdmEqTex(frNeg(m), pP),
     tdmEqTex(mP, INTk(p))],
    1,
    EXPL(`Deux droites non verticales sont perpendiculaires si le produit de leurs pentes vaut \\(-1\\) : \\(m'=-\\dfrac{1}{m}\\).`,
      `\\(m'=-\\dfrac{1}{${frTex(m)}}=${frTex(mP)}\\), puis \\(p'=y_A-m'\\,x_A=${y1}-(${frTex(mP)})\\times(${x1})=${frTex(pP)}\\), d'où \\((D')\\) : \\(y=${tdmEqMembre(mP, pP)}\\).`,
      `Ne pas prendre \\(m'=-m\\) (c'est une symétrie par rapport à l'horizontale, pas une perpendiculaire) ni oublier le signe : \\(m\\times m'=-1\\).`));
};

/* Raisonnement à trous : positions relatives & perpendicularité. */
GEN.trouPosition = () => TROU(
  `Positions relatives de deux droites : complète le raisonnement.`,
  `Deux droites d'équations \\(y=m_1x+p_1\\) et \\(y=m_2x+p_2\\) sont PARALLÈLES STRICTES si leurs coefficients directeurs sont {{0}} mais leurs ordonnées à l'origine {{1}}.<br>
   Elles sont CONFONDUES si leurs équations réduites sont {{2}}.<br>
   Elles sont SÉCANTES si \\(m_1\\) {{3}} \\(m_2\\), et leur point d'intersection s'obtient en résolvant un {{4}} de deux équations.<br>
   Elles sont PERPENDICULAIRES si le produit de leurs pentes vaut {{5}} : la perpendiculaire à \\(y=mx+p\\) a donc pour pente {{6}}.`,
  ['égales', 'sont différentes', 'identiques', '\\ne', 'système', '-1', '-\\dfrac{1}{m}'],
  ['différentes', 'opposées', 'sont égales', 'proportionnelles', '=', '\\lt', 'somme', 'équation', '0', '1', 'm', '\\dfrac{1}{m}', '-m', 'inéquation'],
  `Le test complet se fait sur les COUPLES (m ; p) : mêmes pentes → parallèles ; on ne tranche « confondues » qu'en vérifiant AUSSI les ordonnées à l'origine. Et pour la perpendicularité, c'est le PRODUIT des pentes qui vaut −1, pas leur somme ou leur opposé.`
);

/* ============================================================
   NOTION « ÉQUATIONS CARTÉSIENNES »
   (vecteur directeur, distance point-droite, faisceau —
   document DROITES_EXERCICES, exercices 9-10 et problème expert)
   ============================================================ */

/* Exercice 9 : équation cartésienne par un point et un vecteur
   directeur. (D) : (x − xM)·uy − (y − yM)·ux = 0. */
GEN.dVectDir = () => {
  const xM = R(-4, 4), yM = R(-4, 4);
  const ux = nz(-4, 4), uy = nz(-4, 4);
  const a = uy, b = -ux, c = -(uy * xM - ux * yM);
  return QCM(
    `La droite \\((D)\\) passe par \\(M(${xM}\\,;\\,${yM})\\) et admet le vecteur \\(\\vec{u}(${ux}\\,;\\,${uy})\\) comme vecteur directeur.\n    Quelle est son équation cartésienne ?`,
    tdmCartTex(a, b, c),
    [tdmCartTex(uy, ux, -(uy * xM + ux * yM)),
     tdmCartTex(a, b, -c),
     tdmCartTex(ux, uy, -(ux * xM - uy * yM)),
     tdmCartTex(a, b, c + (a * xM + b * yM > 0 ? 1 : -1))],
    1,
    EXPL(`\\(M(x\\,;\\,y)\\) est sur \\((D)\\) si \\(\\vec{MN}\\) est colinéaire à \\(\\vec{u}\\) : \\((x-x_M)\\times ${uy} - (y-y_M)\\times (${ux}) = 0\\).`,
      `\\(x\\times${uy}-y\\times(${ux})=${uy}\\times(${xM})-(${ux})\\times(${yM})\\) : en développant puis en réduisant, \\((D)\\) : ${tdmCartTex(a, b, c)} — un vecteur directeur de \\(ax+by+c=0\\) est \\((-b\\,;\\,a)=(${-b}\\,;\\,${a})\\).`,
      `Ne pas intervertir les coordonnées du vecteur : c'est \\(u_y\\) qui multiplie \\(x\\) et \\(-u_x\\) qui multiplie \\(y\\).`));
};

/* Exercice 10 : distance d'un point à une droite (valeur exacte). */
GEN.dDistance = () => {
  let a, b, c, xM, yM, N;
  do {
    a = nz(-5, 5); b = nz(-5, 5); c = R(-6, 6);
    xM = R(-5, 5); yM = R(-5, 5);
    N = Math.abs(a * xM + b * yM + c);
  } while(N === 0);
  const S = a * a + b * b;
  const rac = Math.sqrt(S);
  const exact = Number.isInteger(rac);
  const bonne = exact ? `\\(${frTex(tdmFR(N, rac))}\\)` : `\\(\\dfrac{${N}}{\\sqrt{${S}}}\\)`;
  const faux = [
    `\\(\\dfrac{${N}}{${S}}\\)`,
    `\\(\\dfrac{${Math.abs(a * xM) + Math.abs(b * yM)}}{\\sqrt{${S}}}\\)`,
    `\\(\\dfrac{${a * xM + b * yM + c}}{\\sqrt{${S}}}\\)`,
    `\\(\\dfrac{${N}}{\\sqrt{${S + 2 * Math.abs(a * b)}}}\\)`];
  return QCM(
    `Soit la droite \\((D)\\) : ${tdmCartTex(a, b, c)} et le point \\(M(${xM}\\,;\\,${yM})\\).\n    Distance exacte de \\(M\\) à \\((D)\\) ?`,
    bonne,
    faux,
    1,
    EXPL(`Pour \\(d : ax+by+c=0\\) et \\(M(x_M\\,;\\,y_M)\\) : \\(d(M\\,;\\,d)=\\dfrac{|ax_M+by_M+c|}{\\sqrt{a^2+b^2}}\\).`,
      `Numérateur : \\(|(${a})\\times(${xM})+(${b})\\times(${yM})+(${c})|=|${a * xM + b * yM + c}|=${N}\\). Dénominateur : \\(\\sqrt{(${a})^2+(${b})^2}=\\sqrt{${S}}\\). D'où ${bonne}${exact ? '' : ' (valeur exacte)'}.`,
      `Ne pas oublier la VALEUR ABSOLUE au numérateur (une distance est positive) ni la racine carrée au dénominateur.`));
};

/* Problème expert : POINT FIXE d'un faisceau de droites Δm. */
GEN.dPointFixe = () => {
  let p, r, t, q, s, det, xF = ONE, yF = ONE, ok = false, guard = 0;
  /* Faisceau : (m + p)x + (qm + r)y + (sm + t) = 0, affine en m. */
  while(!ok && guard++ < 500){
    p = R(-4, 4); r = R(-4, 4); t = R(-4, 4);
    do { q = R(-3, 3); s = R(-4, 4); } while(q === 0 || s === 0);
    det = p * (q + r) - (1 + p) * r;          /* déterminant des droites m=0 et m=1 */
    if(det === 0) continue;
    xF = tdmFR(-t * (q + r) + r * (s + t), det);
    yF = tdmFR(-p * (s + t) + t * (1 + p), det);
    ok = Math.abs(det) <= 6 && Math.abs(frVal(xF)) <= 6 && Math.abs(frVal(yF)) <= 6 &&
         !(xF.d === 1 && yF.d === 1);
  }
  const mono = v => (v > 0 ? ' + ' + v : v < 0 ? ' - ' + (-v) : '');
  const eq = `\\(\\left(m${mono(p)}\\right)x + \\left(${q === 1 ? '' : q === -1 ? '-' : q}m${mono(r)}\\right)y + \\left(${s === 1 ? '' : s === -1 ? '-' : s}m${mono(t)}\\right) = 0\\)`;
  const car = (a, b, c) => {                  /* ax + by + c = 0, sans « 0y » */
    let out = '';
    if(a) out += (a === 1 ? '' : a === -1 ? '-' : a) + 'x';
    if(b) out += (out ? (b > 0 ? '+' : '-') : (b < 0 ? '-' : '')) + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'y';
    if(c || !out) out += (out ? (c >= 0 ? '+' : '-') : (c < 0 ? '-' : '')) + Math.abs(c);
    return out;
  };
  return QCM(
    `Pour tout réel \\(m\\), la droite \\(\\Delta_m\\) a pour équation ${eq}.\n    Toutes les droites \\(\\Delta_m\\) passent par un même point \\(F\\), dont les coordonnées sont :`,
    tdmPtTex(xF, yF),
    [tdmPtTex(frNeg(xF), yF), tdmPtTex(yF, xF),
     tdmPtTex(frNeg(xF), frNeg(yF)), tdmPtTex(frAdd(xF, ONE), yF)],
    1,
    EXPL(`L'équation est AFFINE en \\(m\\) : si un point vérifie deux droites du faisceau (par ex. \\(m=0\\) et \\(m=1\\)), il les vérifie toutes.`,
      `\\(m=0\\) : \\(${car(p, r, t)}=0\\) ; \\(m=1\\) : \\(${car(1 + p, q + r, s + t)}=0\\). La résolution du système donne \\(F\\left(${frTex(xF)}\\,;\\,${frTex(yF)}\\right)\\), qui convient pour TOUT \\(m\\).`,
      `Le point fixe est l'INTERSECTION de deux droites bien choisies du faisceau — pas un point pris au hasard sur l'une d'elles.`));
};

/* ============================================================
   NOTION « DROITES EN SITUATION PROFESSIONNELLE »
   (modélisations économiques et qualité — documents PBL et
   problèmes de synthèse)
   ============================================================ */

/* Problème 2 : seuil de rentabilité d'une production. */
GEN.dSeuilRentabilite = () => {
  let cf, cu, pv;
  do { cf = 10 * R(5, 20); cu = R(2, 9); pv = R(cu + 1, 15); }
  while(cf % (pv - cu) === 0);
  const seuil = tdmFR(cf, pv - cu);
  return QCM(
    `Une entreprise supporte ${cf} € de coûts fixes et ${cu} € de coût variable par unité produite ; chaque unité est vendue ${pv} €.\n    Le seuil de rentabilité (quantité \\(q\\) pour laquelle recette et coût total s'équilibrent) vaut :`,
    M(frTex(seuil) + ' unités'),
    [M(frTex(tdmFR(cf, pv + cu)) + ' unités'),
     M(frTex(tdmFR(cf + cu, pv)) + ' unités'),
     M(cf + ' unités'),
     M((pv - cu) + ' unités')],
    1,
    EXPL(`Coût total : \\(C(q)=C_f+C_u\\,q\\) ; recette : \\(R(q)=P_v\\,q\\). Seuil : \\(R(q)=C(q)\\).`,
      `\\(${pv}q=${cf}+${cu}q\\Rightarrow(${pv}-${cu})q=${cf}\\Rightarrow q=\\dfrac{${cf}}{${pv - cu}}=${frTex(seuil)}\\) unités.`,
      `Diviser par la MARGE unitaire \\((P_v-C_u)\\) — retrancher les coûts fixes du numérateur est faux.`));
};

/* PBL cas 1 : point d'équilibre de deux offres tarifaires. */
GEN.dPointEquilibre = () => {
  let m1, m2, p1, p2, xE;
  do {
    m1 = R(2, 9); m2 = R(1, 8);
    p1 = R(5, 40); p2 = R(10, 60);
    xE = tdmFR(p2 - p1, m1 - m2);
  } while(m1 <= m2 || p2 <= p1 || xE.d === 1 || frVal(xE) < 1 || frVal(xE) > 12);
  const yE = frAdd(frMul(INTk(m1), xE), INTk(p1));
  return QCM(
    `Deux fournisseurs proposent leurs tarifs : offre A : ${tdmEqTex(INTk(m1), INTk(p1))} et offre B : ${tdmEqTex(INTk(m2), INTk(p2))} (\\(x\\) = quantité, \\(y\\) = coût en €).\n    Pour quelle quantité les deux offres ont-elles le MÊME coût ?`,
    M(frTex(xE) + ' unités'),
    [M(frTex(tdmFR(p2 - p1, m1 + m2)) + ' unités'),
     M(frTex(tdmFR(p2 + p1, m1 - m2)) + ' unités'),
     M((p2 - p1) + ' unités'),
     M(frTex(frAdd(xE, ONE)) + ' unités')],
    1,
    EXPL(`Le point d'équilibre est l'INTERSECTION des deux droites de coût : \\(m_1x+p_1=m_2x+p_2\\).`,
      `\\(${m1 - m2}x=${p2 - p1}\\Rightarrow x=${frTex(xE)}\\) unités, pour un coût commun \\(y=${frTex(yE)}\\) € : en dessous, l'offre au coût fixe le plus bas (A) est moins chère ; au-delà, c'est B (prix unitaire plus faible).`,
      `Comparer les PENTES (prix unitaires) pour savoir qui devient moins cher après l'équilibre — l'ordre ne s'inverse pas au hasard.`));
};

/* PBL cas 2 : contrôle qualité à ± tolérance (droites parallèles). */
GEN.dTolerance = () => {
  const m = R(1, 3), p = R(0, 5);
  const tol = pick([0.5, 1, 1.5, 2]);
  const xT = R(1, 10);
  const yTh = m * xT + p;
  let ec;
  do { ec = R(-6, 6) / 2; } while(Math.abs(ec) === tol);
  const yMes = yTh + ec;
  const conforme = Math.abs(ec) < tol;
  const droiteIdeale = tdmEqTex(INTk(m), INTk(p));
  const limite = v => `\\(y = ${m}x ${v >= 0 ? '+' : '-'} ${tdmFN(Math.abs(v), 1)}\\)`;
  return QCM(
    `Sur une ligne de production, la caractéristique idéale d'une pièce suit ${droiteIdeale} (\\(y\\) en mm).\n    La tolérance est \\(\\pm ${tdmFN(tol, 1)}\\) mm. Pour \\(x=${xT}\\), la valeur mesurée est \\(y=${tdmFN(yMes, 1)}\\) mm.\n    La pièce est-elle conforme ?`,
    conforme ? 'Oui — l\u2019écart à l\u2019idéal reste sous la tolérance'
              : 'Non — l\u2019écart à l\u2019idéal dépasse la tolérance',
    [conforme ? 'Non — l\u2019écart à l\u2019idéal dépasse la tolérance'
              : 'Oui — l\u2019écart à l\u2019idéal reste sous la tolérance',
     'On ne peut pas conclure sans tracer les droites de tolérance',
     'La conformité ne dépend pas de la droite idéale',
     'Conforme seulement si la mesure vaut exactement la valeur idéale'],
    1,
    EXPL(`La tolérance définit deux droites PARALLÈLES à la droite idéale : \\(y=mx+p\\pm t\\). Conforme si l'écart \\(\\leqslant\\) tolérance.`,
      `Valeur idéale : \\(y=${m}\\times${xT}${p === 0 ? '' : tdmSgn(p)}=${tdmFN(yTh, 1)}\\) mm. Écart : \\(|${tdmFN(yMes, 1)}-${tdmFN(yTh, 1)}|=${tdmFN(Math.abs(ec), 1)}\\) mm ${conforme ? '\\lt' : '\\gt'} ${tdmFN(tol, 1)} mm : la pièce est ${conforme ? 'CONFORME' : 'NON CONFORME'}. Les droites de tolérance sont ${limite(p + tol)} et ${limite(p - tol)}, parallèles à la droite idéale.`,
      `Ne pas comparer la mesure à la droite SANS calculer l'écart, ni confondre tolérance verticale (en mm) et distance géométrique à la droite.`));
};

/* ============================================================
   NOTION « TRIANGLE & DROITES REMARQUABLES »
   (centre de gravité, orthocentre — problème 3 du document
   problèmes de synthèse)
   ============================================================ */

/* Centre de gravité : intersection des médianes. */
GEN.triGravite = () => {
  let a1, a2, b1, b2, c1, c2, sx, sy;
  do {
    a1 = R(-5, 5); a2 = R(-5, 5);
    b1 = R(-6, 6); b2 = R(-6, 6);
    c1 = R(-6, 6); c2 = R(-6, 6);
    sx = a1 + b1 + c1; sy = a2 + b2 + c2;
  } while((b1 - a1) * (c2 - a2) === (b2 - a2) * (c1 - a1) ||   /* non alignés */
          (sx % 3 === 0 && sy % 3 === 0));                       /* au moins une fraction */
  const G = { x: tdmFR(sx, 3), y: tdmFR(sy, 3) };
  return QCM(
    `Un triangle \\(ABC\\) a pour sommets \\(A(${a1}\\,;\\,${a2})\\), \\(B(${b1}\\,;\\,${b2})\\) et \\(C(${c1}\\,;\\,${c2})\\).\n    Coordonnées du centre de gravité \\(G\\) (intersection des médianes) ?`,
    tdmPtTex(G.x, G.y),
    [tdmPtTex(tdmFR(a1 + b1, 2), tdmFR(a2 + b2, 2)),
     tdmPtTex(frNeg(G.x), G.y),
     tdmPtTex(G.y, G.x),
     tdmPtTex(tdmFR(sx + 3, 3), tdmFR(sy, 3))],
    1,
    EXPL(`Le centre de gravité vérifie \\(G\\left(\\dfrac{x_A+x_B+x_C}{3}\\,;\\,\\dfrac{y_A+y_B+y_C}{3}\\right)\\) : il est aux \\(\\tfrac{2}{3}\\) de chaque médiane.`,
      `\\(x_G=\\dfrac{${a1}+(${b1})+(${c1})}{3}=${frTex(G.x)}\\) et \\(y_G=\\dfrac{${a2}+(${b2})+(${c2})}{3}=${frTex(G.y)}\\).`,
      `Diviser par 3 (trois sommets), pas par 2 : \\(\\left(\\dfrac{x_A+x_B}{2}\\,;\\,...\\right)\\) serait le MILIEU d'un côté, pas le centre de gravité.`));
};
/* Orthocentre : intersection des hauteurs (base horizontale). */
GEN.triOrthocentre = () => {
  let a1, a2, b, c1, c2;
  /* A(a1;a2), B(a1+b;a2) : base (AB) horizontale. C(a1+c1 ; a2+c2). */
  do {
    a1 = R(-5, 5); a2 = R(-5, 5);
    b = nz(-6, 6);                 /* B ≠ A */
    c1 = nz(-4, 4);                /* C pas à la verticale de A ni de B : */
    const P = c1 * (b - c1);       /* pente de la hauteur issue de A : (b−c1)/c2 */
    c2 = pick([1, -1, 2, -2, 3, -3, 4, -4, 6, -6].filter(v => P % v === 0));
  } while(c1 === b);
  const xH = a1 + c1;                        /* hauteur issue de C : x = x_C */
  const yH = a2 + (c1 * (b - c1)) / c2;      /* entier par construction */
  return QCM(
    `Un triangle \\(ABC\\) a pour sommets \\(A(${a1}\\,;\\,${a2})\\), \\(B(${a1 + b}\\,;\\,${a2})\\) et \\(C(${a1 + c1}\\,;\\,${a2 + c2})\\).\n    Coordonnées de l'orthocentre \\(H\\) (intersection des hauteurs) ?`,
    tdmPtTex(INTk(xH), INTk(yH)),
    [tdmPtTex(INTk(xH), INTk(2 * a2 - yH)),
     tdmPtTex(INTk(xH), INTk(a2)),
     tdmPtTex(INTk(a1), INTk(yH)),
     tdmPtTex(INTk(a1 + b), INTk(yH))],
    1,
    EXPL(`Chaque hauteur passe par un sommet et est PERPENDICULAIRE au côté opposé ; l'orthocentre est leur intersection.`,
      `\\((AB)\\) est horizontale (ordonnées égales à \\(${a2}\\)) : la hauteur issue de \\(C\\) est la droite VERTICALE \\(x=${xH}\\). La pente de \\((BC)\\) vaut \\(\\dfrac{${c2}}{${c1 - b}}\\) ; la hauteur issue de \\(A\\), perpendiculaire à \\((BC)\\), a donc pour pente \\(${frTex(tdmFR(b - c1, c2))}\\) et coupe \\(x=${xH}\\) en \\(H${tdmPtTex(INTk(xH), INTk(yH))}\\).`,
      `Ne pas confondre hauteur et MÉDIANE : la hauteur issue de \\(C\\) est perpendiculaire à \\((AB)\\) mais ne passe PAS par son milieu.`));
};

/* ============================================================
   FICHE « DROITES DANS LE PLAN » (cours + bilan « L'Odyssée de
   la Droite » : tableau récapitulatif et fiche de synthèse)
   ============================================================ */
Object.assign(FICHES, {
  'droites-plan': { titre: '📐 Droites dans le plan', html: `
    <p><b>Équation réduite :</b> \\(y=mx+p\\) (droite non verticale) ; droite verticale : \\(x=k\\).
    \\(m\\) = coefficient directeur (pente), \\(p\\) = ordonnée à l'origine (valeur de \\(y\\) en \\(x=0\\)).</p>
    <p><b>Pente :</b> \\(m=\\dfrac{y_B-y_A}{x_B-x_A}=\\dfrac{\\Delta y}{\\Delta x}=\\tan(\\theta)\\).
    \\(m\\gt0\\) : la droite monte ; \\(m\\lt0\\) : elle descend ; \\(m=0\\) : elle est horizontale.
    Avec un point : \\(p=y_A-m\\,x_A\\). Fractions : réduire \\(m\\) avant d'écrire l'équation.</p>
    <p><b>Intersections avec les axes :</b> \\((Oy)\\) en \\((0\\,;\\,p)\\) ; \\((Ox)\\) en \\(\\left(-\\dfrac{p}{m}\\,;\\,0\\right)\\) si \\(m\\ne0\\).
    Signe de \\(y\\) : \\(y\\) change de signe en \\(x_0=-\\dfrac{p}{m}\\) ; si \\(m\\gt0\\), \\(y\\gt0\\) pour \\(x\\gt x_0\\) (sinon c'est l'inverse).</p>
    <p><b>Positions relatives :</b> \\(m_1=m_2\\) → parallèles (confondues si de plus \\(p_1=p_2\\)) ; \\(m_1\\ne m_2\\) → sécantes en un unique point \\(I\\left(\\dfrac{p_2-p_1}{m_1-m_2}\\,;\\,\\ldots\\right)\\).
    Perpendiculaires (non verticales) : \\(m_1\\times m_2=-1\\), donc la perpendiculaire à \\(y=mx+p\\) a pour pente \\(-\\dfrac{1}{m}\\).
    Parallèle par \\(A\\) : même \\(m\\), \\(p'=y_A-m\\,x_A\\) ; perpendiculaire par \\(A\\) : pente \\(-\\dfrac{1}{m}\\) puis même ajustement.</p>
    <p><b>Équation cartésienne :</b> \\(ax+by+c=0\\) ; vecteur directeur \\(\\vec{u}(-b\\,;\\,a)\\).
    Par \\(M(x_M\\,;\\,y_M)\\) et \\(\\vec{u}(u_x\\,;\\,u_y)\\) : \\((x-x_M)\\,u_y-(y-y_M)\\,u_x=0\\).
    Distance d'un point à la droite : \\(d(M\\,;\\,d)=\\dfrac{|ax_M+by_M+c|}{\\sqrt{a^2+b^2}}\\).</p>
    <p><b>Faisceau de droites :</b> \\(\\Delta_m\\) d'équation affine en \\(m\\) passe par un POINT FIXE \\(F\\), intersection de deux droites du faisceau (prendre \\(m=0\\) et \\(m=1\\), puis résoudre le système).</p>
    <p><b>Modélisations professionnelles :</b> Seuil de rentabilité \\(q=\\dfrac{C_f}{P_v-C_u}\\) (recette = coût total) ;
    point d'équilibre de deux offres = intersection des droites de coût ; contrôle qualité : la tolérance \\(\\pm t\\) définit les droites PARALLÈLES \\(y=mx+p\\pm t\\), la pièce est conforme si l'écart vertical à la droite idéale reste \\(\\leqslant t\\).</p>
    <p><b>Triangle :</b> centre de gravité \\(G\\left(\\dfrac{x_A+x_B+x_C}{3}\\,;\\,\\dfrac{y_A+y_B+y_C}{3}\\right)\\) (intersection des médianes) ;
    orthocentre = intersection des HAUTEURS (si \\((AB)\\) est horizontale, la hauteur issue de \\(C\\) est la verticale \\(x=x_C\\)).</p>` }
});

/* ============================================================
   ÉLÉMENTS SIMPLES : libellé + rappel + fiches des 20 générateurs
   ============================================================ */
Object.assign(GEN_INFO, {
  'dEqFrac2pts':       { label: 'Équation réduite (2 points, fractions)', fiches: ['droites-plan'],
    rappel: "m = (yB−yA)/(xB−xA) puis p = yA − m·xA. Réduire la fraction AVANT d'écrire l'équation." },
  'dPointCoeff':       { label: 'Point + pente → ordonnée à l\u2019origine', fiches: ['droites-plan'],
    rappel: "p = y_A − m·x_A : le point est sur la droite, sa pente multiplie son abscisse." },
  'dPointOrdo':        { label: 'Point + ordonnée à l\u2019origine → pente', fiches: ['droites-plan'],
    rappel: "m = (y_A − p)/(x_A − 0) : pente entre A et le point (0 ; p) de l'axe des ordonnées." },
  'dDeuxImages':       { label: 'Fonction affine par deux images', fiches: ['droites-plan', 'fonctions'],
    rappel: "m = (f(a₂)−f(a₁))/(a₂−a₁) : taux d'accroissement constant, puis p = f(a₁) − m·a₁." },
  'dLectureGraph':     { label: 'Lecture graphique d\u2019une droite', fiches: ['droites-plan'],
    rappel: "Lire p sur l'axe des ordonnées (x = 0), puis la pente entre deux points de la grille." },
  'dInterAxes':        { label: 'Intersections avec les axes', fiches: ['droites-plan'],
    rappel: "(Oy) : x = 0 → y = p ; (Ox) : y = 0 → x = −p/m. Ces deux points suffisent au tracé." },
  'dSigne':            { label: 'Signe de mx + p (inéquation)', fiches: ['droites-plan', 'tableaux'],
    rappel: "y s'annule en x₀ = −p/m ; si m < 0 l'inégalité se RETOURNE quand on divise — attention au sens." },
  'dPosition2':        { label: 'Position relative de deux droites', fiches: ['droites-plan'],
    rappel: "m₁ = m₂ : parallèles (confondues si p₁ = p₂) ; m₁ ≠ m₂ : sécantes. Le dessin ne décide pas." },
  'dIntersectPt':      { label: 'Point d\u2019intersection (fractions)', fiches: ['droites-plan'],
    rappel: "x_I = (p₂−p₁)/(m₁−m₂), puis y_I = m₁x_I + p₁ : égaliser les deux ordonnées." },
  'dParallele':        { label: 'Parallèle par un point', fiches: ['droites-plan'],
    rappel: "Même pente m ; nouvelle ordonnée à l'origine p' = y_A − m·x_A." },
  'dPerpendiculaire':  { label: 'Perpendiculaire par un point', fiches: ['droites-plan'],
    rappel: "Pente m' = −1/m (produit m·m' = −1), puis p' = y_A − m'·x_A." },
  'trouPosition':      { label: 'Raisonnement : positions relatives', fiches: ['droites-plan'],
    rappel: "Critères sur les couples (m ; p) : parallèles, confondues, sécantes, perpendiculaires (m₁m₂ = −1)." },
  'dVectDir':          { label: 'Cartésienne par point + vecteur', fiches: ['droites-plan', 'vecteurs'],
    rappel: "(x−x_M)·u_y − (y−y_M)·u_x = 0 ; en retour, un vecteur directeur de ax+by+c=0 est (−b ; a)." },
  'dDistance':         { label: 'Distance d\u2019un point à une droite', fiches: ['droites-plan'],
    rappel: "d = |ax_M + by_M + c| / √(a²+b²) : valeur absolue en haut, racine carrée en bas." },
  'dPointFixe':        { label: 'Point fixe d\u2019un faisceau', fiches: ['droites-plan'],
    rappel: "Équation affine en m : prendre m = 0 et m = 1, résoudre le système — le point convient pour tout m." },
  'dSeuilRentabilite': { label: 'Seuil de rentabilité', fiches: ['droites-plan'],
    rappel: "q = C_f/(P_v − C_u) : recette R(q) = P_v·q, coût C(q) = C_f + C_u·q, seuil quand R = C." },
  'dPointEquilibre':   { label: 'Point d\u2019équilibre de deux offres', fiches: ['droites-plan'],
    rappel: "Intersection des droites de coût : m₁x+p₁ = m₂x+p₂. Sous l'équilibre, l'offre au coût fixe minimal gagne." },
  'dTolerance':        { label: 'Contrôle qualité (± tolérance)', fiches: ['droites-plan'],
    rappel: "Tolérance = deux droites PARALLÈLES y = mx+p±t ; conforme si |mesure − idéal| ≤ t." },
  'triGravite':        { label: 'Centre de gravité d\u2019un triangle', fiches: ['droites-plan', 'geometrie'],
    rappel: "G = ((x_A+x_B+x_C)/3 ; (y_A+y_B+y_C)/3) : isobarycentre, aux 2/3 de chaque médiane." },
  'triOrthocentre':    { label: 'Orthocentre d\u2019un triangle', fiches: ['droites-plan', 'geometrie'],
    rappel: "Intersection des hauteurs ; base horizontale → hauteur verticale x = x_C, puis perpendiculaire à (BC)." }
});

/* ============================================================
   6 NOTIONS NOUVELLES — sommet de la tour (147 étages)
   ============================================================ */
NOTIONS.push(
  { id: 'droites-fractions',  name: 'Droites & fractions (équations exactes)',   g: ['dEqFrac2pts', 'dPointCoeff', 'dPointOrdo', 'dDeuxImages', 'dLectureGraph'],  family: 'orange', prob: 0.5 },
  { id: 'droites-axes',       name: 'Droites, axes & signe',                       g: ['dInterAxes', 'dSigne'],                                                            family: 'teal',   prob: 0.5 },
  { id: 'droites-positions',  name: 'Positions relatives de deux droites',        g: ['dPosition2', 'dIntersectPt', 'dParallele', 'dPerpendiculaire', 'trouPosition'],  family: 'violet', prob: 0.5 },
  { id: 'droites-cartesiennes', name: 'Équations cartésiennes & distance',        g: ['dVectDir', 'dDistance', 'dPointFixe'],                                            family: 'teal',   prob: 0.5 },
  { id: 'droites-pro',        name: 'Droites en situation professionnelle',       g: ['dSeuilRentabilite', 'dPointEquilibre', 'dTolerance'],                              family: 'orange', prob: 0.5 },
  { id: 'triangle-droites',   name: 'Triangle & droites remarquables',            g: ['triGravite', 'triOrthocentre'],                                                    family: 'violet', prob: 0.5 }
);

/* Formes 3D des nouveaux étages (FLOOR_SHAPES est déclaré dans
   14-formes-3d.js, chargé plus tard : l'affectation attend la fin
   du chargement de la page). */
document.addEventListener('DOMContentLoaded', function(){
  try {
    FLOOR_SHAPES['droites-fractions']    = 'arrow';
    FLOOR_SHAPES['droites-axes']         = 'grid';
    FLOOR_SHAPES['droites-positions']    = 'checker';
    FLOOR_SHAPES['droites-cartesiennes'] = 'arch';
    FLOOR_SHAPES['droites-pro']          = 'stack';
    FLOOR_SHAPES['triangle-droites']     = 'wedge';
  } catch(e) { /* formes de secours : 'box' */ }
});
