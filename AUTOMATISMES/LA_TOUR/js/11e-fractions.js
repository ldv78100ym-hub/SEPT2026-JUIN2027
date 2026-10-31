/* ============================================================
   11e. NOTIONS FRACTIONS & PUISSANCES
   Intégration des onze documents « Fractions » et « Puissances
   entières » (cours sur fractions, règles de calcul, règles des
   signes, priorités opératoires, QCM 62 questions, QCM progressif,
   réduction de fractions, simplification des signes, fusion &
   révisions, bilan « L'Odyssée des Fractions », 40 exercices sur
   les puissances) : chaque type d'exercice ABSENT de la tour y est
   adapté à son format (QCM à choix + raisonnements à trous, valeurs
   EXACTES en fractions irréductibles, leçon cours/méthode/piège à
   chaque erreur).
   Ce module :
   - enregistre 24 nouveaux générateurs dans GEN ;
   - enrichit GEN_INFO et FICHES (nouvelle fiche
     « fractions-puissances ») ;
   - ajoute 6 notions en sommet de tour (NOTIONS.push) AVANT que
     12-etat-jeu.js ne calcule N_TOT : la tour compte donc
     153 étages.
   Réutilise les fractions exactes de 11d (tdmFR, frAdd, frSub,
   frMul, frDiv, frNeg, frEq, frTex, frTexP, frTexPar, ONE, INTk)
   et tdmFN (11c) pour les décimales françaises.
   ============================================================ */

/* ============================================================
   UTILITAIRES SPÉCIFIQUES (préfixe fp : aucune collision)
   ============================================================ */

/* PPCM de deux entiers positifs. */
function fpLCM(a, b){ return (a / tdmDGcd(a, b)) * b; }

/* Étape intermédiaire « brute → réduite » : n'affiche la forme
   réduite que si elle diffère de la forme brute. */
function fpStep(n, d){
  const raw = `\\dfrac{${n}}{${d}}`;
  const red = frTex(tdmFR(n, d));
  return raw === red ? raw : raw + ' = ' + red;
}

/* Décomposition en facteurs premiers → LaTeX « 2 \times 2 \times 3 ». */
function fpDecomp(n){
  n = Math.abs(n);
  if(n === 1) return '1';
  const f = [];
  let p = 2;
  while(p * p <= n){
    while(n % p === 0){ f.push(p); n /= p; }
    p++;
  }
  if(n > 1) f.push(n);
  return f.join(' \\times ');
}

/* Fraction irréductible aléatoire (d ≥ 2, |n| ≠ d, n ≠ 0) ;
   pos = true → numérateur strictement positif. */
function fpIrrFrac(nmax, dmax, pos){
  let f;
  do {
    f = tdmFR(pos ? R(1, nmax) : nz(-nmax, nmax), R(2, dmax));
  } while(f.d === 1 || Math.abs(f.n) === f.d);
  return f;
}

/* 4 « mauvaises » fractions distinctes de la correcte F (≠ 0),
   les extras (fractions) d'abord — pièges les plus plausibles. */
function fpWrongFracs(F, extras){
  const out = [], seen = new Set([frTex(F)]);
  const cand = (extras || []).concat(
    [frNeg(F), frDiv(ONE, F), frAdd(F, ONE), frSub(F, ONE),
     tdmFR(F.n + 1, F.d), tdmFR(F.n, F.d + 1), frMul(F, INTk(2))]);
  for(const w of cand){
    if(!w) continue;
    const t = frTex(w);
    if(!seen.has(t)){ seen.add(t); out.push(t); if(out.length === 4) break; }
  }
  return out;
}

/* 4 mauvaises réponses ENTIÈRES distinctes de k (exposants…) :
   les extras d'abord, puis k±1, k±2… */
function fpIntWrongs(k, extras){
  const out = [], seen = new Set([String(k)]);
  const cand = (extras || []).concat([k + 1, k - 1, k + 2, k - 2, k + 3, -k, k * 2]);
  for(const w of cand){
    const t = String(w);
    if(!seen.has(t)){ seen.add(t); out.push(t); if(out.length === 4) break; }
  }
  return out;
}

/* ============================================================
   NOTION « FRACTIONS ÉGALES, SIMPLIFICATION & COMPARAISON »
   (documents FRACTION_IRREDUCTIBLE, FRACTION_BILAN §1-3,
   FRACTIONS_REGLES_DE_CALCUL ch. 1-2, FRACTIONS.html)
   ============================================================ */

/* Réduction d'une fraction (décomposition en facteurs premiers,
   PGCD, division haut et bas). */
GEN.frSimplifie = () => {
  let ap, bp, k;
  do {
    ap = nz(-9, 9);
    bp = R(2, 9);
    k  = R(2, 9);
  } while(tdmDGcd(Math.abs(ap), bp) !== 1);
  const A = ap * k, B = bp * k;
  const F = tdmFR(A, B);                       /* = ap/bp par construction */
  return QCM(
    `Rendez irréductible la fraction suivante :\n    \\(\\dfrac{${A}}{${B}}\\)`,
    M(frTex(F)),
    fpWrongFracs(F, [tdmFR(A, B + k), tdmFR(A - k, B), tdmFR(bp, ap)]),
    1,
    EXPL(`On ne change pas une fraction en divisant son numérateur ET son dénominateur par un même nombre non nul : on cherche leur PGCD.`,
      `\\(${A} = ${fpDecomp(A)}\\) et \\(${B} = ${fpDecomp(B)}\\) : le facteur commun est \\(${k}\\), donc \\(\\operatorname{PGCD}(${Math.abs(A)}\\,;\\\\,${B}) = ${k}\\).\\n    \\(\\dfrac{${A}}{${B}} = \\dfrac{${ap < 0 ? '(' + ap + ')' : ap} \\times ${k}}{${bp} \\times ${k}} = \\dfrac{${ap}}{${bp}}\\) — et \\(\\operatorname{PGCD}(${Math.abs(ap)}\\,;\\\\,${bp}) = 1\\) : la fraction est irréductible.`,
      `On ne simplifie jamais en RETIRANT un même nombre haut et bas : \\(\\dfrac{${A - k}}{${B - k}}\\) n'a rien à voir avec \\(\\dfrac{${A}}{${B}}\\). Seule la division par un facteur commun conserve la valeur.`));
};

/* Fractions égales : multiplier haut et bas par un même nombre. */
GEN.frFracEgales = () => {
  const f = fpIrrFrac(7, 9, false);
  const k = R(2, 5);
  const num = f.n * k, den = f.d * k;
  const tex = (n, d) => `\\(\\dfrac{${n}}{${d}}\\)`;
  return QCM(
    `Laquelle de ces fractions est ÉGALE à \\(\\dfrac{${f.n}}{${f.d}}\\) ?`,
    tex(num, den),
    [tex(num, den + k), tex(f.n * (k + 1), f.d * k), tex(f.n + k, f.d + k), tex(num + 1, den)],
    1,
    EXPL(`Deux fractions sont égales si l'on passe de l'une à l'autre en multipliant (ou divisant) haut et bas par un MÊME nombre non nul.`,
      `\\(\\dfrac{${f.n}}{${f.d}} = \\dfrac{${f.n} \\times ${k}}{${f.d} \\times ${k}} = \\dfrac{${num}}{${den}}\\) : numérateur et dénominateur sont multipliés par \\(${k}\\).`,
      `Ajouter un même nombre haut et bas ne conserve PAS la valeur : \\(\\dfrac{${f.n + k}}{${f.d + k}}\\) est différent de \\(\\dfrac{${f.n}}{${f.d}}\\).`));
};

/* Comparaison de deux fractions (produits en croix). */
GEN.frCompare = () => {
  let f1, f2, cross;
  do {
    f1 = fpIrrFrac(9, 9, true);
    f2 = fpIrrFrac(9, 9, true);
    cross = f1.n * f2.d - f2.n * f1.d;
  } while(cross === 0);
  const sym = cross > 0 ? '\\gt' : '\\lt';
  const good = `\\(\\dfrac{${f1.n}}{${f1.d}} ${sym} \\dfrac{${f2.n}}{${f2.d}}\\)`;
  const inv = cross > 0 ? '\\lt' : '\\gt';
  const L = fpLCM(f1.d, f2.d);
  const a1 = f1.n * L / f1.d, a2 = f2.n * L / f2.d;
  return QCM(
    `Comparez \\(\\dfrac{${f1.n}}{${f1.d}}\\) et \\(\\dfrac{${f2.n}}{${f2.d}}\\) : quelle écriture est correcte ?`,
    good,
    [`\\(\\dfrac{${f1.n}}{${f1.d}} ${inv} \\dfrac{${f2.n}}{${f2.d}}\\)`,
     `\\(\\dfrac{${f1.n}}{${f1.d}} = \\dfrac{${f2.n}}{${f2.d}}\\)`,
     `\\(\\dfrac{${f1.n}}{${f1.d}} = \\dfrac{${f1.d}}{${f2.d}}\\)`],
    1,
    EXPL(`Dénominateurs différents : on réduit au même dénominateur ou on compare les PRODUITS EN CROIX \\(a \\times d\\) et \\(b \\times c\\).`,
      `\\(\\dfrac{${f1.n}}{${f1.d}}\\) et \\(\\dfrac{${f2.n}}{${f2.d}}\\) : au dénominateur commun \\(${L}\\), elles valent \\(\\dfrac{${a1}}{${L}}\\) et \\(\\dfrac{${a2}}{${L}}\\) ; ou par produits en croix : \\(${f1.n} \\times ${f2.d} = ${f1.n * f2.d}\\) et \\(${f2.n} \\times ${f1.d} = ${f2.n * f1.d}\\).`,
      `Même numérateur ≠ même valeur : on compare au même dénominateur, jamais « à l'œil » — et \\(\\dfrac{a}{b} = \\dfrac{c}{d}\\) seulement si \\(a \\times d = c \\times b\\).`));
};

/* Raisonnement à trous : simplification, égalité, comparaison. */
GEN.trouSimplifie = () => TROU(
  `Fractions : simplification, égalité et comparaison — complète le raisonnement.`,
  `Simplifier une fraction, c'est diviser le numérateur et le {{0}} par un même nombre non nul : leur {{1}}.<br>
   La fraction obtenue est dite {{2}} quand numérateur et dénominateur n'ont plus aucun facteur {{3}}.<br>
   On ne change pas la valeur d'une fraction en multipliant haut et bas par le {{4}} nombre non nul.<br>
   Pour comparer deux fractions de dénominateurs positifs différents, on compare les {{5}} en croix : \\(a \\times d\\) et \\(b \\times c\\).<br>
   Si le numérateur est inférieur au dénominateur (positifs), la fraction est plus petite que {{6}}.`,
  ['dénominateur', 'PGCD', 'irréductible', 'commun', 'même', 'produits', '1'],
  ['numérateur', 'PPCM', 'décimale', 'premier', 'différent', 'sommes', 'zéro', 'inverse', 'quotients'],
  `On ne simplifie jamais en ajoutant ou en retirant un même nombre haut et bas : \\(\\dfrac{2+1}{3+1}\\) n'a rien à voir avec \\(\\dfrac{2}{3}\\). Seules la multiplication et la division par un même nombre non nul conservent la valeur.`
);

/* ============================================================
   NOTION « RÈGLES DES SIGNES »
   (documents REGLES_DES_SIGNES, FRACTION_SIMPLIFICATION_SIGNES,
   FRACTION_BILAN §4, FRACTIONS.html mode « signes »)
   ============================================================ */

/* Signe d'un produit ou d'un quotient de relatifs (parité). */
GEN.frSigneProduit = () => {
  const n = R(2, 4);
  const factors = [];
  for(let i = 0; i < n; i++) factors.push(nz(2, 9) * (Math.random() < 0.5 ? -1 : 1));
  const div = Math.random() < 0.35;
  const op = div ? ' \\div ' : ' \\times ';
  const expr = factors.map(v => `(${v})`).join(op);
  let minus = 0, prod = 1;
  factors.forEach(v => { if(v < 0) minus++; prod *= Math.abs(v); });
  const correct = minus % 2 === 0 ? 'Positif' : 'Négatif';
  return QCM(
    `Quel est le signe du résultat du calcul suivant ?\n    \\(${expr} = \\ldots\\)`,
    correct,
    [minus % 2 === 0 ? 'Négatif' : 'Positif', 'Nul', 'On ne peut pas savoir'],
    1,
    EXPL(`Le produit (ou le quotient) de deux nombres de même signe est POSITIF ; de signes contraires, NÉGATIF. La division suit la même règle que la multiplication.`,
      `On compte les signes « − » : il y en a \\(${minus}\\) (${minus % 2 === 0 ? 'nombre PAIR → résultat positif' : 'nombre IMPAIR → résultat négatif'}).\\n    ${div ? `Diviser par un relatif non nul revient à multiplier par son inverse : les règles des signes s'appliquent donc aussi aux quotients.` : `En valeur absolue, le produit vaut \\(${prod}\\), précédé du signe déterminé par la parité des « − ».`}`,
      `Un produit de facteurs non nuls n'est JAMAIS nul, et le signe ne dépend que de la PARITÉ du nombre de facteurs négatifs — pas de leur valeur.`));
};

/* Simplification des écritures a + (−b), a − (−b), avec entiers
   ou fractions. */
GEN.frEcritureSignes = () => {
  const minus = Math.random() < 0.5;               /* a − (−b) sinon a + (−b) */
  const frac = Math.random() < 0.5;
  const a = R(2, 15);
  let raw, good, w1, w2, w3, inner;
  if(frac){
    const f = fpIrrFrac(7, 9, true);
    inner = `\\dfrac{${f.n}}{${f.d}}`;
    const neg = `\\left(-\\dfrac{${f.n}}{${f.d}}\\right)`;
    raw = minus ? `${a} - ${neg}` : `${a} + ${neg}`;
    good = minus ? `${a} + ${inner}` : `${a} - ${inner}`;
    w1 = minus ? `${a} - ${inner}` : `${a} + ${inner}`;      /* erreur de signe */
    w2 = minus ? `${a} + ${neg}` : `${a} - ${neg}`;           /* non simplifié */
    w3 = minus ? `-${a} + ${inner}` : `-${a} - ${inner}`;    /* signe de a perdu */
  } else {
    const b = R(2, 15);
    inner = String(b);
    raw = minus ? `${a} - (-${b})` : `${a} + (-${b})`;
    good = minus ? `${a} + ${b}` : `${a} - ${b}`;
    w1 = minus ? `${a} - ${b}` : `${a} + ${b}`;
    w2 = minus ? `${a} + (-${b})` : `${a} - (-${b})`;
    w3 = minus ? `-${a} + ${b}` : `-${a} - ${b}`;
  }
  const rep = s => `\\(${s}\\)`;
  return QCM(
    `Simplifiez l'écriture (supprimez les parenthèses et les signes inutiles) :\n    \\(${raw}\\)`,
    rep(good),
    [rep(w1), rep(w2), rep(w3)],
    1,
    EXPL(`Ajouter un nombre négatif, c'est SOUSTRAIRE sa valeur absolue ; soustraire un nombre négatif, c'est ADDITIONNER sa valeur absolue : \\(+(-a) = -a\\) et \\(-(-a) = +a\\).`,
      `\\(${raw}\\) : le nombre entre parenthèses est négatif, donc ${minus ? `soustraire ce négatif revient à ajouter \\(${inner}\\)` : `ajouter ce négatif revient à soustraire \\(${inner}\\)`} : \\(${good}\\).`,
      `Ne pas écrire deux signes consécutifs sans les simplifier : \\(-(-${inner})\\) doit devenir \\(+${inner}\\), et JAMAIS \\(-${inner}\\).`));
};

/* Produit de fractions signées (signes devant, au numérateur ou
   au dénominateur) — résultat exact réduit. */
GEN.frFractionSignee = () => {
  const cnt = R(2, 3);
  const parts = [], disp = [];
  let minus = 0, num = 1, den = 1;
  for(let i = 0; i < cnt; i++){
    const f = fpIrrFrac(6, 6, true);
    const s = Math.random() < 0.5 ? -1 : 1;
    num *= f.n; den *= f.d;
    let tex;
    if(s === 1){
      const forms = [`\\dfrac{${f.n}}{${f.d}}`, `\\dfrac{-${f.n}}{-${f.d}}`, `-\\dfrac{-${f.n}}{${f.d}}`, `-\\dfrac{${f.n}}{-${f.d}}`];
      tex = pick(forms);
      minus += (tex.match(/-/g) || []).length;
    } else {
      const forms = [`-\\dfrac{${f.n}}{${f.d}}`, `\\dfrac{-${f.n}}{${f.d}}`, `\\dfrac{${f.n}}{-${f.d}}`, `-\\dfrac{-${f.n}}{-${f.d}}`];
      tex = pick(forms);
      minus += (tex.match(/-/g) || []).length;
    }
    parts.push(f);
    disp.push(`\\left(${tex}\\right)`);
  }
  const F = tdmFR((minus % 2 === 0 ? 1 : -1) * num, den);
  return QCM(
    `Calculez et donnez la forme irréductible :\n    ${disp.join(' \\times ')}`,
    M(frTex(F)),
    fpWrongFracs(F, [tdmFR(num, den), frNeg(F)]),
    1,
    EXPL(`Le signe d'une fraction peut se placer DEVANT, au NUMÉRATEUR ou au DÉNOMINATEUR : \\(\\dfrac{-a}{b} = \\dfrac{a}{-b} = -\\dfrac{a}{b}\\) et \\(\\dfrac{-a}{-b} = \\dfrac{a}{b}\\).`,
      `Signes « − » visibles : \\(${minus}\\) (${minus % 2 === 0 ? 'pair' : 'impair'}) → résultat ${minus % 2 === 0 ? 'positif' : 'négatif'}.\\n    En valeurs absolues : ${parts.map(f => `\\dfrac{${f.n}}{${f.d}}`).join(' \\times ')} = \\dfrac{${num}}{${den}} = ${frTexP(F)}, d'où \\(${frTex(F)}\\).`,
      `Compter les « − » visibles ne suffit que pour le SIGNE ; il faut aussi multiplier les valeurs absolues et RÉDUIIRE la fraction obtenue (PGCD du numérateur et du dénominateur).`));
};

/* ============================================================
   NOTION « PRIORITÉS OPÉRATOIRES (PEMDAS) »
   (documents PRIORITES_OPERATOIRES, FRACTION_BILAN §5)
   ============================================================ */

/* Expression à 3-4 opérations avec parenthèses et carré :
   résultat EXACT (le « calcul de gauche à droite » est le
   distracteur principal). */
GEN.frPriorites = () => {
  const p = R(1, 4);
  let tex, F, naive, cours, meth, piege;
  if(p === 1){
    let c, d, e;
    do { c = R(2, 9); d = R(2, 9); e = R(2, 9); } while(c === d);
    const a = R(2, 9), b = R(2, 9);
    const sq = (c - d) * (c - d);
    tex = `${a} + ${b} \\times (${c}-${d})^{2} \\div ${e}`;
    F = frAdd(INTk(a), tdmFR(b * sq, e));
    naive = tdmFR((a + b) * sq, e);
    cours = `Parenthèses d'abord, puis exposants, puis multiplications et divisions (de gauche à droite), enfin additions et soustractions.`;
    meth = `\\((${c}-${d}) = ${c - d}\\), puis \\((${c - d})^{2} = ${sq}\\), puis \\(${b} \\times ${sq} \\div ${e} = ${frTex(tdmFR(b * sq, e))}\\), enfin \\(${a} + ${frTex(tdmFR(b * sq, e))} = ${frTex(F)}\\).`;
    piege = `Ne pas commencer par \\(${a} + ${b}\\) : l'addition est la DERNIÈRE opération à effectuer, même écrite en premier.`;
  } else if(p === 2){
    const a = R(2, 6), b = R(2, 6), c = R(2, 6), d = R(2, 6), e = R(2, 6);
    tex = `${a} \\times (${b}+${c}) - ${d} \\times ${e}`;
    F = INTk(a * (b + c) - d * e);
    naive = INTk((a * (b + c) - d) * e);
    cours = `Les parenthèses et les multiplications sont prioritaires sur la soustraction finale.`;
    meth = `\\((${b}+${c}) = ${b + c}\\), puis \\(${a} \\times ${b + c} = ${a * (b + c)}\\) et \\(${d} \\times ${e} = ${d * e}\\), enfin \\(${a * (b + c)} - ${d * e} = ${frTex(F)}\\).`;
    piege = `Le dernier « \\(\\times ${e}\\) » ne multiplie que \\(${d}\\) : ne pas propager la soustraction sur tout l'ensemble.`;
  } else if(p === 3){
    const a = R(2, 9), b = R(2, 6), c = R(2, 6), d = R(2, 9);
    tex = `${a} + ${b}^{2} \\times ${c} - ${d}`;
    F = INTk(a + b * b * c - d);
    naive = INTk((a + b * b) * c - d);
    cours = `L'exposant est prioritaire, puis la multiplication \\(${b}^{2} \\times ${c}\\), puis les additions et soustractions de gauche à droite.`;
    meth = `\\(${b}^{2} = ${b * b}\\), puis \\(${b * b} \\times ${c} = ${b * b * c}\\), puis \\(${a} + ${b * b * c} - ${d} = ${frTex(F)}\\).`;
    piege = `Le carré ne porte que sur \\(${b}\\) : \\(${a} + ${b}^{2}\\) n'est PAS \\((${a} + ${b})^{2}\\).`;
  } else {
    let c, d;
    do { c = R(2, 9); d = R(2, 9); } while(c === d);
    const a = R(2, 9), b = R(2, 9), e = R(2, 6);
    tex = `(${a}+${b}) \\div (${c}-${d}) \\times ${e}`;
    F = frMul(tdmFR(a + b, c - d), INTk(e));
    naive = frDiv(tdmFR(a + b, 1), INTk((c - d) * e));
    cours = `À priorité égale (÷ puis ×), on calcule DE GAUCHE À DROITE : la division ne « saute » pas par-dessus la multiplication.`;
    meth = `\\((${a}+${b}) = ${a + b}\\), \\((${c}-${d}) = ${c - d}\\), puis de gauche à droite : \\(\\dfrac{${a + b}}{${c - d}} \\times ${e} = ${frTex(F)}\\).`;
    piege = `\\(\\div (${c}-${d}) \\times ${e}\\) se calcule dans l'ordre : ne pas regrouper \\((${c}-${d}) \\times ${e}\\) au dénominateur — ce serait l'erreur \\(${frTex(naive)}\\).`;
  }
  return QCM(
    `Calculez (valeur EXACTE, fraction irréductible) :\n    \\(${tex}\\)`,
    M(frTex(F)),
    fpWrongFracs(F, [naive]),
    1,
    EXPL(cours, meth, piege));
};

/* Le piège classique : a + b × c sans parenthèses. */
GEN.frPemdasPiege = () => {
  const p = R(1, 4);
  let tex, F, naive, meth;
  if(p === 1){
    const a = R(2, 9), b = R(2, 9), c = R(2, 9);
    tex = `${a} + ${b} \\times ${c}`;
    F = INTk(a + b * c);
    naive = INTk((a + b) * c);
    meth = `La multiplication est prioritaire : \\(${b} \\times ${c} = ${b * c}\\), puis \\(${a} + ${b * c} = ${a + b * c}\\).`;
  } else if(p === 2){
    const a = R(2, 6), b = R(2, 6), c = R(2, 9);
    tex = `${a} \\times ${b} - ${c}`;
    F = INTk(a * b - c);
    naive = INTk(a * (b - c));
    meth = `\\(${a} \\times ${b} = ${a * b}\\) d'abord, puis \\(${a * b} - ${c} = ${a * b - c}\\).`;
  } else if(p === 3){
    const f = fpIrrFrac(7, 9, true), c = R(2, 9), d = R(2, 9);
    tex = `\\dfrac{${f.n}}{${f.d}} + ${c} \\times ${d}`;
    F = frAdd(f, INTk(c * d));
    naive = frMul(frAdd(f, INTk(c)), INTk(d));
    meth = `\\(${c} \\times ${d} = ${c * d}\\) d'abord, puis mise au même dénominateur : \\(\\dfrac{${f.n}}{${f.d}} + \\dfrac{${c * d * f.d}}{${f.d}} = ${frTex(F)}\\).`;
  } else {
    const a = R(2, 9), b = R(2, 9), f = fpIrrFrac(5, 7, true);
    tex = `${a} - ${b} \\div \\dfrac{${f.n}}{${f.d}}`;
    F = frSub(INTk(a), frDiv(INTk(b), f));
    naive = frDiv(frSub(INTk(a), INTk(b)), f);
    meth = `La division est prioritaire : \\(${b} \\div \\dfrac{${f.n}}{${f.d}} = ${b} \\times \\dfrac{${f.d}}{${f.n}} = ${frTex(frDiv(INTk(b), f))}\\), puis \\(${a} - ${frTex(frDiv(INTk(b), f))} = ${frTex(F)}\\).`;
  }
  return QCM(
    `Calculez (valeur exacte) :\n    \\(${tex}\\)`,
    M(frTex(F)),
    fpWrongFracs(F, [naive]),
    1,
    EXPL(`SANS parenthèses, les multiplications et divisions sont prioritaires sur les additions et soustractions — même si elles sont écrites après.`,
      meth,
      `L'expression \\(${tex}\\) ne se lit pas « dans l'ordre d'écriture » : dès qu'un \\(\\times\\) ou un \\(\\div\\) apparaît, il est prioritaire sur les additions et soustractions — le calcul de gauche à droite ne s'applique qu'À priorité ÉGALE.`));
};

/* Raisonnement à trous : l'ordre des priorités. */
GEN.trouPriorites = () => TROU(
  `Priorités opératoires : complète le raisonnement.`,
  `L'ordre des priorités : d'abord les {{0}}, puis les puissances ({{1}}), puis les multiplications et les {{2}} de gauche à droite, et enfin les additions et les {{3}}.<br>
   Dans \\(2 + 3 \\times 4\\), on effectue d'abord la {{4}} : \\(2 + 12 = 14\\), et jamais \\((2 + 3) \\times 4 = 20\\).<br>
   À priorité égale, on calcule de la {{5}} vers la droite.<br>
   Un enchaînement d'opérations sur des fractions se termine par une fraction {{6}} (valeur exacte simplifiée).`,
  ['parenthèses', 'exposants', 'divisions', 'soustractions', 'multiplication', 'gauche', 'irréductible'],
  ['additions', 'multiplications', 'parenthèses', 'divisions', 'somme', 'droite', 'décimale', 'exposants', 'produits'],
  `Dans \\(2 + 3 \\times 4\\), le piège classique est de calculer \\(2+3\\) d'abord : la multiplication est prioritaire, et ce n'est pas parce qu'elle est écrite à droite qu'elle se fait en dernier.`
);

/* ============================================================
   NOTION « QUATRE OPÉRATIONS : VALEURS EXACTES »
   (documents CALCULS_FRACTIONS_ (62 motifs), COURS_SUR_FRACTIONS
   (10 règles), FRACTIONS_CALCULS (4 niveaux), FRACTION_BILAN §6-8,
   FRACTIONS_REGLES_DE_CALCUL (exercices progressifs))
   ============================================================ */

/* Addition / soustraction de fractions (dénominateurs différents). */
GEN.frAddSous = () => {
  const plus = Math.random() < 0.5;
  let f1, f2, F, trap;
  do {
    f1 = fpIrrFrac(7, 9, true);
    do { f2 = fpIrrFrac(7, 9, true); } while(f2.d === f1.d);
    F = plus ? frAdd(f1, f2) : frSub(f1, f2);
    trap = tdmFR(plus ? f1.n + f2.n : f1.n - f2.n, f1.d + f2.d);
  } while(F.n === 0 || frEq(trap, F));
  const L = fpLCM(f1.d, f2.d);
  const a1 = f1.n * L / f1.d, a2 = f2.n * L / f2.d;
  return QCM(
    `Calculez et donnez la forme irréductible :\n    \\(\\dfrac{${f1.n}}{${f1.d}} ${plus ? '+' : '-'} \\dfrac{${f2.n}}{${f2.d}}\\)`,
    M(frTex(F)),
    fpWrongFracs(F, [trap, frAdd(F, ONE)]),
    1,
    EXPL(`Dénominateurs différents : on réduit d'abord au MÊME dénominateur (PPCM), puis on additionne ou soustrait les numérateurs.`,
      `PPCM de \\(${f1.d}\\) et \\(${f2.d}\\) : \\(${L}\\).\\n    \\(\\dfrac{${f1.n}}{${f1.d}} = \\dfrac{${a1}}{${L}}\\) et \\(\\dfrac{${f2.n}}{${f2.d}} = \\dfrac{${a2}}{${L}}\\), donc \\(\\dfrac{${a1}}{${L}} ${plus ? '+' : '-'} \\dfrac{${a2}}{${L}} = ${fpStep(a1 + (plus ? a2 : -a2), L)}\\).`,
      `On n'additionne JAMAIS les dénominateurs : \\(\\dfrac{${f1.n}}{${f1.d}} ${plus ? '+' : '-'} \\dfrac{${f2.n}}{${f2.d}} \\neq \\dfrac{${plus ? f1.n + f2.n : f1.n - f2.n}}{${f1.d + f2.d}}\\). Les dénominateurs indiquent la taille des parts : ils ne s'additionnent pas.`));
};

/* Multiplication de fractions (produit, valeurs exactes). */
GEN.frMul = () => {
  let f1, f2, F, cross;
  do {
    f1 = fpIrrFrac(7, 9, false);
    f2 = fpIrrFrac(7, 9, false);
    F = frMul(f1, f2);
    cross = tdmFR(f1.n * f2.d, f1.d * f2.n);
  } while(F.n === 0 || frEq(cross, F));
  return QCM(
    `Calculez et donnez la forme irréductible :\n    \\(\\dfrac{${f1.n}}{${f1.d}} \\times \\dfrac{${f2.n}}{${f2.d}}\\)`,
    M(frTex(F)),
    fpWrongFracs(F, [tdmFR(f1.n + f2.n, f1.d + f2.d), cross]),
    1,
    EXPL(`On multiplie les numérateurs entre eux et les dénominateurs entre eux : \\(\\dfrac{a}{b} \\times \\dfrac{c}{d} = \\dfrac{a \\times c}{b \\times d}\\).`,
      `\\(\\dfrac{${f1.n}}{${f1.d}} \\times \\dfrac{${f2.n}}{${f2.d}} = \\dfrac{${f1.n < 0 ? '(' + f1.n + ')' : f1.n} \\times ${f2.n < 0 ? '(' + f2.n + ')' : f2.n}}{${f1.d} \\times ${f2.d}} = ${fpStep(f1.n * f2.n, f1.d * f2.d)}\\).`,
      `Deux pièges : ne pas « croiser » (\\(\\dfrac{${f1.n * f2.d}}{${f1.d * f2.n}}\\) est faux) et ne pas additionner haut et bas (\\(\\dfrac{${f1.n + f2.n}}{${f1.d + f2.d}}\\) aussi).`));
};

/* Division de fractions (multiplier par l'inverse). */
GEN.frDiv = () => {
  let f1, f2, F, trap;
  do {
    f1 = fpIrrFrac(7, 9, false);
    f2 = fpIrrFrac(7, 9, false);
    F = frDiv(f1, f2);
    trap = frMul(f1, f2);
  } while(F.n === 0 || frEq(trap, F));
  return QCM(
    `Calculez et donnez la forme irréductible :\n    \\(\\dfrac{${f1.n}}{${f1.d}} \\div \\dfrac{${f2.n}}{${f2.d}}\\)`,
    M(frTex(F)),
    fpWrongFracs(F, [trap, frDiv(f2, f1)]),
    1,
    EXPL(`Diviser par une fraction non nulle, c'est MULTIPLIER par son inverse : \\(\\dfrac{a}{b} \\div \\dfrac{c}{d} = \\dfrac{a}{b} \\times \\dfrac{d}{c}\\).`,
      `L'inverse de \\(\\dfrac{${f2.n}}{${f2.d}}\\) est \\(\\dfrac{${f2.d}}{${f2.n}}\\), donc \\(\\dfrac{${f1.n}}{${f1.d}} \\times \\dfrac{${f2.d}}{${f2.n}} = \\dfrac{${f1.n < 0 ? '(' + f1.n + ')' : f1.n} \\times ${f2.d}}{${f1.d} \\times ${f2.n < 0 ? '(' + f2.n + ')' : f2.n}} = ${frTex(F)}\\).`,
      `L'inverse échange numérateur et dénominateur, mais GARDE le signe au bon endroit : multiplier « tout droit » (\\(${frTex(trap)}\\)) sans inverser est l'erreur classique.`));
};

/* Opérations entre un entier et une fraction (4 règles du cours). */
GEN.frEntierFrac = () => {
  const op = pick(['+', '-', 'x', ':']);
  const a = nz(2, 9);
  let f, F, trap, tex, meth;
  if(op === '+'){
    f = fpIrrFrac(7, 9, true);
    F = frAdd(INTk(a), f);
    trap = tdmFR(a + f.n, f.d);
    tex = `${a} + \\dfrac{${f.n}}{${f.d}}`;
    meth = `\\(${a} = \\dfrac{${a * f.d}}{${f.d}}\\), donc \\(\\dfrac{${a * f.d}}{${f.d}} + \\dfrac{${f.n}}{${f.d}} = ${fpStep(a * f.d + f.n, f.d)}\\).`;
  } else if(op === '-'){
    f = fpIrrFrac(7, 9, true);
    do { F = frSub(INTk(a), f); } while(F.n === 0);
    trap = tdmFR(a - f.n, f.d);
    tex = `${a} - \\dfrac{${f.n}}{${f.d}}`;
    meth = `\\(${a} = \\dfrac{${a * f.d}}{${f.d}}\\), donc \\(\\dfrac{${a * f.d}}{${f.d}} - \\dfrac{${f.n}}{${f.d}} = ${fpStep(a * f.d - f.n, f.d)}\\).`;
  } else if(op === 'x'){
    f = fpIrrFrac(7, 9, false);
    F = frMul(INTk(a), f);
    trap = frAdd(INTk(a), f);
    tex = `${a} \\times \\dfrac{${f.n}}{${f.d}}`;
    meth = `\\(${a} \\times \\dfrac{${f.n}}{${f.d}} = \\dfrac{${a} \\times ${f.n < 0 ? '(' + f.n + ')' : f.n}}{${f.d}} = ${fpStep(a * f.n, f.d)}\\) : l'entier multiplie le NUMÉRATEUR.`;
  } else {
    f = fpIrrFrac(5, 7, true);
    F = frDiv(INTk(a), f);
    trap = frMul(INTk(a), f);
    tex = `${a} \\div \\dfrac{${f.n}}{${f.d}}`;
    meth = `Diviser par \\(\\dfrac{${f.n}}{${f.d}}\\), c'est multiplier par son inverse \\(\\dfrac{${f.d}}{${f.n}}\\) : \\(\\dfrac{${a} \\times ${f.d}}{${f.n}} = ${fpStep(a * f.d, f.n)}\\).`;
  }
  const rule = op === '+' ? `a + \\dfrac{b}{c} = \\dfrac{a \\cdot c + b}{c}` :
               op === '-' ? `a - \\dfrac{b}{c} = \\dfrac{a \\cdot c - b}{c}` :
               op === 'x' ? `a \\times \\dfrac{b}{c} = \\dfrac{a \\cdot b}{c}` :
                            `a \\div \\dfrac{c}{d} = a \\times \\dfrac{d}{c} = \\dfrac{a \\cdot d}{c}`;
  return QCM(
    `Calculez (valeur exacte irréductible) :\n    \\(${tex}\\)`,
    M(frTex(F)),
    fpWrongFracs(F, [trap]),
    1,
    EXPL(`Tout entier peut s'écrire sous forme de fraction : \\(${rule}\\).`,
      meth,
      op === ':' ? `Ne pas oublier d'INVERSER la fraction : multiplier sans inverser donne \\(${frTex(trap)}\\), qui est faux.`
                 : `L'entier ne s'ajoute (ou ne se soustrait) jamais directement au numérateur : il faut d'abord l'écrire avec le MÊME dénominateur.`));
};

/* Puissance d'une fraction — exposant positif ou négatif. */
GEN.frPuissanceFrac = () => {
  let p, q;
  do { p = R(2, 5); q = pick([2, 3, 4, 5, 6, 7, 8, 9]); } while(q === p || tdmDGcd(p, q) !== 1);
  const neg = Math.random() < 0.4;
  const e = neg ? -R(2, 3) : R(2, 3);
  const ae = Math.abs(e);
  const F = neg ? tdmFR(Math.pow(q, ae), Math.pow(p, ae))
                : tdmFR(Math.pow(p, ae), Math.pow(q, ae));
  const trap = neg ? tdmFR(Math.pow(p, ae), Math.pow(q, ae))
                   : tdmFR(p * e, q * e);
  return QCM(
    `Calculez (valeur exacte) :\n    \\(\\left(\\dfrac{${p}}{${q}}\\right)^{${e}}\\)`,
    M(frTex(F)),
    fpWrongFracs(F, [trap, tdmFR(Math.pow(q, ae), Math.pow(p, ae))]),
    1,
    EXPL(`\\(\\left(\\dfrac{a}{b}\\right)^{n} = \\dfrac{a^{n}}{b^{n}}\\), et un exposant NÉGATIF inverse la base : \\(\\left(\\dfrac{a}{b}\\right)^{-n} = \\left(\\dfrac{b}{a}\\right)^{n}\\).`,
      `\\(\\left(\\dfrac{${p}}{${q}}\\right)^{${e}} = ${neg ? `\\left(\\dfrac{${q}}{${p}}\\right)^{${ae}} = ` : ''}\\dfrac{${neg ? q : p}^{${ae}}}{${neg ? p : q}^{${ae}}} = \\dfrac{${Math.pow(neg ? q : p, ae)}}{${Math.pow(neg ? p : q, ae)}}\\).`,
      neg ? `L'exposant négatif INVERSE la fraction, il ne rend pas le résultat négatif : le signe du résultat ne dépend que du signe de la base.`
        : `L'exposant ne multiplie PAS la base : \\(\\dfrac{${p * e}}{${q * e}}\\) est faux, seul \\(${p}^{${ae}}\\) sur \\(${q}^{${ae}}\\) est exact.`));
};

/* Expressions composées (parenthèses + produit ou quotient). */
GEN.frCompose = () => {
  const sub = R(1, 3);
  let f1, f2, f3;
  do {
    f1 = fpIrrFrac(5, 8, true);
    do { f2 = fpIrrFrac(5, 8, true); } while(f2.d === f1.d);
    f3 = tdmFR(nz(1, 3), R(2, 5));
  } while(tdmDGcd(f3.n, f3.d) !== 1 || f3.d === 1 || Math.abs(f3.n) === f3.d);
  let tex, F, naive, meth, piege;
  if(sub === 1){
    F = frMul(frAdd(f1, f2), f3);
    tex = `\\left(\\dfrac{${f1.n}}{${f1.d}} + \\dfrac{${f2.n}}{${f2.d}}\\right) \\times \\dfrac{${f3.n}}{${f3.d}}`;
    naive = frMul(frAdd(f1, f2), tdmFR(f3.d, f3.n));
    meth = `D'abord la parenthèse (dénominateur commun), puis la multiplication par \\(\\dfrac{${f3.n}}{${f3.d}}\\) : \\(\\dfrac{${f1.n}}{${f1.d}} + \\dfrac{${f2.n}}{${f2.d}} = ${frTex(frAdd(f1, f2))}\\), puis \\(${frTex(frAdd(f1, f2))} \\times \\dfrac{${f3.n}}{${f3.d}} = ${frTex(F)}\\).`;
    piege = `Le \\(\\times\\) multiplie TOUTE la parenthèse — et il ne se transforme pas en division : inverser \\(\\dfrac{${f3.n}}{${f3.d}}\\) ici donnerait \\(${frTex(naive)}\\).`;
  } else if(sub === 2){
    F = frAdd(f1, frMul(f2, f3));
    tex = `\\dfrac{${f1.n}}{${f1.d}} + \\dfrac{${f2.n}}{${f2.d}} \\times \\dfrac{${f3.n}}{${f3.d}}`;
    naive = frMul(frAdd(f1, f2), f3);
    meth = `La multiplication est PRIORITAIRE : \\(\\dfrac{${f2.n}}{${f2.d}} \\times \\dfrac{${f3.n}}{${f3.d}} = ${frTexPar(frMul(f2, f3))}\\), puis on réduit au même dénominateur : \\(\\dfrac{${f1.n}}{${f1.d}} + ${frTexPar(frMul(f2, f3))} = ${frTex(F)}\\).`;
    piege = `Sans parenthèses, on ne peut PAS additionner d'abord : \\(\\left(\\dfrac{${f1.n}}{${f1.d}} + \\dfrac{${f2.n}}{${f2.d}}\\right) \\times \\dfrac{${f3.n}}{${f3.d}} = ${frTex(naive)}\\) est le résultat du mauvais ordre.`;
  } else {
    F = frMul(frSub(f1, f2), tdmFR(f3.d, f3.n));
    tex = `\\left(\\dfrac{${f1.n}}{${f1.d}} - \\dfrac{${f2.n}}{${f2.d}}\\right) \\div \\dfrac{${f3.n}}{${f3.d}}`;
    naive = frSub(f1, frMul(f2, tdmFR(f3.d, f3.n)));
    meth = `Parenthèse d'abord : \\(\\dfrac{${f1.n}}{${f1.d}} - \\dfrac{${f2.n}}{${f2.d}} = ${frTexPar(frSub(f1, f2))}\\). Puis diviser par \\(\\dfrac{${f3.n}}{${f3.d}}\\), c'est multiplier par \\(\\dfrac{${f3.d}}{${f3.n}}\\) : \\(${frTexPar(frSub(f1, f2))} \\times \\dfrac{${f3.d}}{${f3.n}} = ${frTex(F)}\\).`;
    piege = `La division par \\(\\dfrac{${f3.n}}{${f3.d}}\\) ne porte que sur la parenthèse TOUTE ENTIÈRE — la distribuer terme à terme (\\(${frTex(naive)}\\)) est une erreur.`;
  }
  return QCM(
    `Calculez (valeur exacte irréductible) :\n    \\(${tex}\\)`,
    M(frTex(F)),
    fpWrongFracs(F, [naive]),
    1,
    EXPL(`Ordre des opérations : parenthèses, puis multiplication et division (en inversant la fraction par laquelle on divise), puis addition et soustraction.`,
      meth, piege));
};

/* ============================================================
   NOTION « PUISSANCES DE 10, ÉCRITURE SCIENTIFIQUE & ORDRES DE
   GRANDEUR » (document PUISSANCES_ENTIERES_EXERCICES, parties A-B)
   ============================================================ */

/* Produit, quotient et puissance de puissances de 10, exposants
   relatifs : donner l'exposant k de 10^k. */
GEN.p10Ops = () => {
  const sub = R(1, 3);
  let tex, k, meth, wrongs;
  if(sub === 1){
    const m = R(-9, 9), n = R(-9, 9);
    k = m + n;
    tex = `10^{${m}} \\times 10^{${n}}`;
    meth = `\\(10^{${m}} \\times 10^{${n}} = 10^{${m} + ${n < 0 ? '(' + n + ')' : n}} = 10^{${k}}\\) : on ADDITIONNE les exposants, mêmes négatifs.`;
    wrongs = fpIntWrongs(k, [m * n, m - n, m, n]);
  } else if(sub === 2){
    const m = R(-9, 9), n = R(-9, 9);
    k = m - n;
    tex = `\\dfrac{10^{${m}}}{10^{${n}}}`;
    meth = `\\(\\dfrac{10^{${m}}}{10^{${n}}} = 10^{${m} - ${n < 0 ? '(' + n + ')' : n}} = 10^{${k}}\\) : on SOUSTRAIT les exposants — soustraire un négatif, c'est additionner.`;
    wrongs = fpIntWrongs(k, [m + n, m * n, m, n]);
  } else {
    const m = R(-6, 6), n = R(2, 5);
    k = m * n;
    tex = `\\left(10^{${m}}\\right)^{${n}}`;
    meth = `\\(\\left(10^{${m}}\\right)^{${n}} = 10^{${m} \\times ${n}} = 10^{${k}}\\) : on MULTIPLIE les exposants.`;
    wrongs = fpIntWrongs(k, [m + n, m - n, m, n]);
  }
  return QCM(
    `Simplifiez \\(${tex}\\) sous la forme \\(10^{k}\\). Quel est l'exposant \\(k\\) ?`,
    String(k),
    wrongs,
    1,
    EXPL(`\\(10^{m} \\times 10^{n} = 10^{m+n}\\), \\(\\dfrac{10^{m}}{10^{n}} = 10^{m-n}\\), \\(\\left(10^{m}\\right)^{n} = 10^{m \\times n}\\) — valables aussi avec des exposants négatifs.`,
      meth,
      `Ne pas confondre les trois lois : le produit ADDITIONNE les exposants, le quotient les SOUSTRAIT, la puissance de puissance les MULTIPLIE.`));
};

/* Inverse d'une puissance de 10 : 1/10^n = 10^(-n). */
GEN.p10Inverse = () => {
  const n = R(2, 9);
  const k = -n;
  return QCM(
    `Écrivez \\(\\dfrac{1}{10^{${n}}}\\) sous la forme \\(10^{k}\\). Quel est l'exposant \\(k\\) ?`,
    String(k),
    fpIntWrongs(k, [n, -n - 1, -n + 1, n + 1]),
    1,
    EXPL(`L'inverse d'une puissance correspond à un exposant NÉGATIF : \\(\\dfrac{1}{a^{n}} = a^{-n}\\), donc \\(\\dfrac{1}{10^{n}} = 10^{-n}\\).`,
      `\\(\\dfrac{1}{10^{${n}}} = 10^{-${n}}\\), donc \\(k = -${n}\\). On peut le vérifier : \\(10^{-${n}} = ${tdmFN(Math.pow(10, -n), n)}\\).`,
      `\\(10^{-${n}}\\) est un nombre POSITIF très petit, pas un nombre négatif : le signe « − » de l'exposant indique l'inverse, pas l'opposé.`));
};

/* Exposant de l'écriture scientifique d'un grand ou petit nombre. */
GEN.pSciExposant = () => {
  const petit = Math.random() < 0.5;
  const mant = R(11, 99) / 10;
  if(!petit){
    const exp = R(3, 8);
    const val = Math.round(mant * Math.pow(10, exp));
    return QCM(
      `Donnez l'exposant \\(n\\) dans l'écriture scientifique \\(a \\times 10^{n}\\) du nombre \\(${val}\\).`,
      String(exp),
      fpIntWrongs(exp, [exp + 1, exp - 1, exp + 2, String(val).length - 1]),
      1,
      EXPL(`L'écriture scientifique est \\(a \\times 10^{n}\\) avec \\(1 \\le a \\lt 10\\) : un seul chiffre (non nul) avant la virgule.`,
        `\\(${val} = ${tdmFN(mant)} \\times 10^{${exp}}\\), donc \\(n = ${exp}\\) : on décale la virgule de \\(${exp}\\) rangs vers la gauche.`,
        `\\(n\\) compte le DÉCALAGE de la virgule, pas le nombre de chiffres : si la mantisse était \\(1\\), l'exposant serait le même — et pour un nombre plus petit que 1, \\(n\\) est négatif.`));
  }
  const exp = R(2, 6);
  const val = mant * Math.pow(10, -exp);
  return QCM(
    `Donnez l'exposant \\(n\\) dans l'écriture scientifique \\(a \\times 10^{n}\\) du nombre \\(${tdmFN(val, exp + 1)}\\).`,
    String(-exp),
    fpIntWrongs(-exp, [-exp - 1, -exp + 1, exp]),
    1,
    EXPL(`L'écriture scientifique est \\(a \\times 10^{n}\\) avec \\(1 \\le a \\lt 10\\) ; un nombre compris entre 0 et 1 a un exposant NÉGATIF.`,
      `\\(${tdmFN(val, exp + 1)} = ${tdmFN(mant)} \\times 10^{-${exp}}\\), donc \\(n = -${exp}\\) : on décale la virgule de \\(${exp}\\) rangs vers la droite.`,
      `Le signe de \\(n\\) est négatif car le nombre est plus petit que 1 : un exposant positif donnerait un nombre plus grand que \\(${tdmFN(mant)}\\).`));
};

/* Ordre de grandeur (mantisse inférieure ou supérieure à 5),
   exposants positifs ou négatifs. */
GEN.pOrdreGrandeur = () => {
  const mant = R(11, 99) / 10;
  const exp = Math.random() < 0.5 ? R(2, 9) : -R(2, 8);
  const k = mant < 5 ? exp : exp + 1;
  return QCM(
    `L'ordre de grandeur de \\(N = ${tdmFN(mant)} \\times 10^{${exp}}\\) s'écrit \\(10^{k}\\). Quel est l'exposant \\(k\\) ?`,
    String(k),
    fpIntWrongs(k, [exp, exp + 1, exp + 2, k - 1]),
    1,
    EXPL(`L'ordre de grandeur est la puissance de 10 la plus proche : si la mantisse est inférieure à 5, on garde \\(10^{n}\\) ; si elle est supérieure ou égale à 5, on prend \\(10^{n+1}\\).`,
      `La mantisse vaut \\(${tdmFN(mant)}\\) : elle est ${mant < 5 ? `inférieure à 5, donc l'ordre de grandeur est \\(10^{${exp}}\\)` : `supérieure ou égale à 5, donc l'ordre de grandeur est \\(10^{${exp}+1}\\)`}, d'où \\(k = ${k}\\).`,
      `Attention à l'addition algébrique : ici \\(n = ${exp}\\) ${exp < 0 ? 'est négatif — ajouter 1 le RAPPROCHE de zéro' : ''}, et le seuil de décision est la mantisse (le nombre avant la puissance), pas l'exposant.`));
};

/* ============================================================
   NOTION « RÈGLES SUR LES PUISSANCES »
   (document PUISSANCES_ENTIERES_EXERCICES, parties C-F)
   ============================================================ */

/* (−a)^n contre −a^n : la priorité de la puissance sur le signe. */
GEN.puBaseRelative = () => {
  const paren = Math.random() < 0.5;
  const a = R(2, 6), n = R(2, 4);
  const pow = Math.pow(a, n);
  let tex, F;
  if(paren){
    F = INTk(n % 2 === 0 ? pow : -pow);
    tex = `(-${a})^{${n}}`;
  } else {
    F = INTk(-pow);
    tex = `-${a}^{${n}}`;
  }
  return QCM(
    `Calculez la valeur exacte :\n    \\(${tex}\\)`,
    M(String(F.n)),
    fpIntWrongs(F.n, [-F.n, pow, pow + a]),
    1,
    EXPL(paren ? `La base \\(-${a}\\) est entre parenthèses : le signe fait partie de la base, et \\((-${a})^{n}\\) vaut \\(+${a}^{n}\\) si \\(n\\) est pair, \\(-${a}^{n}\\) si \\(n\\) est impair.`
              : `Sans parenthèses, la puissance est prioritaire sur le signe : \\(-${a}^{${n}}\\) signifie \\(-\\left(${a}^{${n}}\\right)\\).`,
      paren ? `\\((-${a})^{${n}}\\) : \\(n = ${n}\\) est ${n % 2 === 0 ? 'pair' : 'impair'}, donc \\((-${a})^{${n}} = ${n % 2 === 0 ? '' : '-'}${pow}\\).`
            : `\\(-${a}^{${n}} = -\\left(${a}^{${n}}\\right) = -(${pow}) = -${pow}\\).`,
      paren ? `Le résultat n'est négatif que si l'exposant est IMPAIR : un exposant pair « efface » le signe moins.` 
            : `\\(-${a}^{${n}}\\) et \\((-${a})^{${n}}\\) ne sont égaux que si \\(n\\) est impair : les parenthèses changent tout.`));
};

/* Même exposant : a^n × b^n = (ab)^n et quotient. */
GEN.puMemeExp = () => {
  const prod = Math.random() < 0.5;
  const n = R(2, 4);
  if(prod){
    const a = R(2, 6), b = R(2, 6);
    const c = a * b;
    return QCM(
      `Écrivez \\(${a}^{${n}} \\times ${b}^{${n}}\\) sous la forme \\(c^{${n}}\\). Quelle est la base \\(c\\) ?`,
      String(c),
      fpIntWrongs(c, [a + b, a + n, b + n]),
      1,
      EXPL(`Même exposant, bases différentes : \\(a^{n} \\times b^{n} = (a \\times b)^{n}\\).`,
        `\\(${a}^{${n}} \\times ${b}^{${n}} = (${a} \\times ${b})^{${n}} = ${c}^{${n}}\\), donc \\(c = ${c}\\).`,
        `On multiplie les BASES, pas les exposants (ce n'est pas \\(${a}^{${n}} \\times ${b}^{${n}} = ${a * b}^{${n * n}}\\)) ni les bases entre elles avec l'exposant additionné.`));
  }
  const res = R(2, 5), den = R(2, 5);
  const num = res * den;
  return QCM(
    `Écrivez \\(\\dfrac{${num}^{${n}}}{${den}^{${n}}}\\) sous la forme \\(c^{${n}}\\). Quelle est la base \\(c\\) ?`,
    String(res),
    fpIntWrongs(res, [num - den, num, den]),
    1,
    EXPL(`Même exposant au numérateur et au dénominateur : \\(\\dfrac{a^{n}}{b^{n}} = \\left(\\dfrac{a}{b}\\right)^{n}\\).`,
      `\\(\\dfrac{${num}^{${n}}}{${den}^{${n}}} = \\left(\\dfrac{${num}}{${den}}\\right)^{${n}} = ${res}^{${n}}\\), donc \\(c = ${res}\\).`,
      `On simplifie d'abord le quotient des bases (\\(${num} \\div ${den} = ${res}\\)), on n'invente pas d'exposant négatif : ici haut et bas portent le MÊME exposant.`));
};

/* Calculs littéraux sur les puissances (produits, quotients,
   exposants négatifs). */
GEN.puLitteral = () => {
  const sub = R(1, 3);
  const base = pick(['a', 'x', 'y']);
  let prompt, k, meth, wrongs, rule;
  if(sub === 1){
    const n1 = R(-6, 6), n2 = R(-6, 6), n3 = R(-6, 6);
    k = n1 + n2 + n3;
    prompt = `Simplifiez \\(${base}^{${n1}} \\times ${base}^{${n2}} \\times ${base}^{${n3}}\\) sous la forme \\(${base}^{k}\\). Quel est \\(k\\) ?`;
    meth = `\\(${base}^{${n1}} \\times ${base}^{${n2}} \\times ${base}^{${n3}} = ${base}^{${n1} + (${n2}) + (${n3})} = ${base}^{${k}}\\).`;
    wrongs = fpIntWrongs(k, [n1 * n2 * n3, n1, n1 + n2]);
    rule = `\\(a^{n_1} \\times a^{n_2} \\times \\dots \\times a^{n_p} = a^{n_1 + n_2 + \\dots + n_p}\\) : un produit de puissances de même base ADDITIONNE les exposants, quel que soit leur nombre.`;
  } else if(sub === 2){
    const n1 = R(2, 6), n2 = R(2, 6), m1 = R(1, 4), m2 = R(2, 6);
    k = n1 - m1;
    prompt = `Réduisez \\(B = \\dfrac{${base}^{${n1}} \\times b^{${n2}}}{${base}^{${m1}} \\times b^{${m2}}}\\) sous la forme \\(${base}^{x} \\times b^{y}\\). Que vaut \\(x\\) ?`;
    meth = `Pour \\(${base}\\) : \\(x = ${n1} - ${m1} = ${k}\\). (Pour \\(b\\) : \\(y = ${n2} - ${m2} = ${n2 - m2}\\).)`;
    wrongs = fpIntWrongs(k, [n1 + m1, n1 - m2, n1]);
    rule = `Chaque base est traitée séparément : au numérateur on additionne les exposants de même base, puis on soustrait celui du dénominateur.`;
  } else {
    const n1 = R(2, 6), m1 = -R(1, 6);
    k = n1 - m1;
    prompt = `Réduisez \\(\\dfrac{${base}^{${n1}}}{${base}^{${m1}}}\\) sous la forme \\(${base}^{k}\\). Quel est \\(k\\) ?`;
    meth = `\\(\\dfrac{${base}^{${n1}}}{${base}^{${m1}}} = ${base}^{${n1} - (${m1})} = ${base}^{${k}}\\).`;
    wrongs = fpIntWrongs(k, [n1 + m1, n1, k + 1]);
    rule = `Diviser par \\(${base}^{${m1}}\\) (exposant négatif) revient à MULTIPLIER par \\(${base}^{${-m1}}\\) : soustraire un négatif additionne sa valeur absolue.`;
  }
  return QCM(prompt, String(k), wrongs, 1,
    EXPL(rule, meth,
      `Piège des exposants négatifs : \\(a^{-n}\\) n'est pas négatif, c'est l'INVERSE \\(\\dfrac{1}{a^{n}}\\) — et les lois (addition, soustraction, multiplication des exposants) restent valables avec ces exposants relatifs.`));
};

/* Formes combinées : puissance de puissance, produit par quotient. */
GEN.puComposee = () => {
  const sub = R(1, 3);
  let prompt, k, meth, wrongs;
  if(sub === 1){
    const p1 = R(2, 4), p2 = R(2, 4), m1 = R(1, 5);
    k = p1 * p2 - m1;
    prompt = `Simplifiez \\(\\dfrac{\\left(x^{${p1}}\\right)^{${p2}}}{x^{${m1}}}\\) sous la forme \\(x^{k}\\). Quel est \\(k\\) ?`;
    meth = `Puissance de puissance d'abord : \\(\\left(x^{${p1}}\\right)^{${p2}} = x^{${p1} \\times ${p2}} = x^{${p1 * p2}}\\), puis quotient : \\(x^{${p1 * p2} - ${m1}} = x^{${k}}\\).`;
    wrongs = fpIntWrongs(k, [p1 + p2 - m1, p1 * p2 + m1, p1 * p2]);
  } else if(sub === 2){
    const k1 = R(2, 5), n1 = R(1, 5), m1 = R(2, 6);
    k = k1 + n1 - m1;
    prompt = `Réduisez \\(x^{${k1}} \\times \\dfrac{x^{${n1}}}{x^{${m1}}}\\) sous la forme \\(x^{k}\\). Quel est \\(k\\) ?`;
    meth = `On regroupe tout au numérateur : \\(\\dfrac{x^{${k1}} \\times x^{${n1}}}{x^{${m1}}} = x^{${k1} + ${n1} - ${m1}} = x^{${k}}\\).`;
    wrongs = fpIntWrongs(k, [k1 * n1 - m1, k1 + n1 + m1, k1 - n1 - m1]);
  } else {
    const a1 = R(2, 4), ext = R(2, 4), a2 = R(1, 4), b1 = R(2, 6);
    k = a1 * ext + a2 - b1;
    prompt = `Réduisez \\(K = \\left(x^{${a1}}\\right)^{${ext}} \\times \\dfrac{x^{${a2}}}{x^{${b1}}}\\) sous la forme \\(x^{k}\\). Quel est \\(k\\) ?`;
    meth = `\\(K = x^{${a1} \\times ${ext}} \\times x^{${a2} - ${b1}} = x^{${a1 * ext}} \\times x^{${a2 - b1}} = x^{${a1 * ext} + (${a2 - b1})} = x^{${k}}\\).`;
    wrongs = fpIntWrongs(k, [a1 + ext + a2 - b1, a1 * ext - a2 + b1, a1 * ext * (a2 - b1)]);
  }
  return QCM(prompt, String(k), wrongs, 1,
    EXPL(`On combine les trois lois : \\(\\left(x^{p}\\right)^{q} = x^{pq}\\), \\(x^{m} \\times x^{n} = x^{m+n}\\), \\(\\dfrac{x^{m}}{x^{n}} = x^{m-n}\\) — en traitant d'abord les puissances de puissances.`,
      meth,
      `Étape par étape, dans le bon ordre : multiplier les exposants pour la puissance de puissance AVANT d'additionner ou soustraire les autres exposants.`));
};

/* ============================================================
   FICHE « FRACTIONS & PUISSANCES » (lue en fin de partie)
   ============================================================ */
FICHES['fractions-puissances'] = { titre: '🧮 Fractions & puissances', html: `
  <p><b>Fraction :</b> \\(\\dfrac{a}{b}\\) (\\(b \\neq 0\\)) est le quotient de \\(a\\) par \\(b\\). Elle est <b>irréductible</b> quand \\(a\\) et \\(b\\) n'ont aucun facteur commun (PGCD égal à 1).</p>
  <p><b>Égalité et simplification :</b> on ne change pas une fraction en multipliant ou divisant son numérateur ET son dénominateur par un même nombre non nul. Pour la rendre irréductible : décomposer en facteurs premiers et diviser haut et bas par le PGCD.</p>
  <p><b>Comparaison :</b> dénominateurs différents → réduire au même dénominateur (PPCM) ou comparer les produits en croix \\(a \\times d\\) et \\(b \\times c\\) — jamais « à l'œil ».</p>
  <p><b>Règles des signes :</b> le signe d'une fraction se place devant, au numérateur ou au dénominateur : \\(\\dfrac{-a}{b} = \\dfrac{a}{-b} = -\\dfrac{a}{b}\\) et \\(\\dfrac{-a}{-b} = \\dfrac{a}{b}\\). Un produit (ou quotient) de relatifs est positif si le nombre de facteurs négatifs est PAIR. Et toujours : \\(+(-a) = -a\\), \\(-(-a) = +a\\).</p>
  <p><b>Priorités (PEMDAS) :</b> Parenthèses, puis Exposants, puis Multiplications et Divisions (de gauche à droite), enfin Additions et Soustractions. À priorité égale, on avance de gauche à droite ; la valeur exacte attendue est une fraction irréductible.</p>
  <p><b>Addition, soustraction :</b> \\(\\dfrac{a}{b} \\pm \\dfrac{c}{d} = \\dfrac{a \\times d \\pm c \\times b}{b \\times d}\\) (ou avec le PPCM). On n'additionne JAMAIS les dénominateurs entre eux.</p>
  <p><b>Multiplication :</b> \\(\\dfrac{a}{b} \\times \\dfrac{c}{d} = \\dfrac{a \\times c}{b \\times d}\\) — numérateurs entre eux, dénominateurs entre eux, pas de « croisement ».</p>
  <p><b>Division :</b> diviser par une fraction non nulle, c'est multiplier par son INVERSE : \\(\\dfrac{a}{b} \\div \\dfrac{c}{d} = \\dfrac{a}{b} \\times \\dfrac{d}{c}\\).</p>
  <p><b>Entier et fraction :</b> \\(a \\pm \\dfrac{b}{c} = \\dfrac{a \\cdot c \\pm b}{c}\\), \\(a \\times \\dfrac{b}{c} = \\dfrac{a \\cdot b}{c}\\), \\(a \\div \\dfrac{c}{d} = a \\times \\dfrac{d}{c}\\).</p>
  <p><b>Puissance d'une fraction :</b> \\(\\left(\\dfrac{a}{b}\\right)^{n} = \\dfrac{a^{n}}{b^{n}}\\) et \\(\\left(\\dfrac{a}{b}\\right)^{-n} = \\left(\\dfrac{b}{a}\\right)^{n}\\) : l'exposant négatif inverse la base.</p>
  <p><b>Puissances de 10 :</b> \\(10^{m} \\times 10^{n} = 10^{m+n}\\), \\(\\dfrac{10^{m}}{10^{n}} = 10^{m-n}\\), \\(\\left(10^{m}\\right)^{n} = 10^{m \\times n}\\), \\(\\dfrac{1}{10^{n}} = 10^{-n}\\) et \\(10^{0} = 1\\) — valables aussi pour les exposants négatifs.</p>
  <p><b>Écriture scientifique :</b> \\(a \\times 10^{n}\\) avec \\(1 \\le a \\lt 10\\) : on décale la virgule après le premier chiffre non nul ; \\(n\\) compte les rangs de décalage (négatif pour un nombre plus petit que 1).</p>
  <p><b>Ordre de grandeur :</b> puissance de 10 la plus proche — si la mantisse est inférieure à 5, on garde \\(10^{n}\\) ; si elle est supérieure ou égale à 5, on prend \\(10^{n+1}\\) (même règle avec des exposants négatifs).</p>
  <p><b>Règles générales :</b> même base : \\(a^{m} \\times a^{n} = a^{m+n}\\), \\(\\dfrac{a^{m}}{a^{n}} = a^{m-n}\\), \\(\\left(a^{m}\\right)^{n} = a^{m \\times n}\\). Même exposant : \\(a^{n} \\times b^{n} = (ab)^{n}\\). Tout vaut aussi pour les exposants relatifs.</p>
  <p><b>Signe et priorité :</b> \\((-a)^{n}\\) : le signe fait partie de la base (négatif si \\(n\\) impair). \\(-a^{n}\\) : la puissance est prioritaire, le résultat est l'opposé de \\(a^{n}\\). Les parenthèses changent tout !</p>` };

/* ============================================================
   GEN_INFO DES 24 GÉNÉRATEURS
   ============================================================ */
(function(){
  const FP = 'fractions-puissances';
  const defs = [
    ['frSimplifie',     "Fractions : réduction",                [FP, 'nombres']],
    ['frFracEgales',    "Fractions égales",                     [FP, 'nombres']],
    ['frCompare',       "Comparaison de fractions",             [FP, 'nombres']],
    ['trouSimplifie',   "Raisonnement : simplification",        [FP, 'nombres']],
    ['frSigneProduit',  "Signe d'un produit de relatifs",       [FP, 'calcul']],
    ['frEcritureSignes',"Simplification des écritures signées", [FP, 'calcul']],
    ['frFractionSignee',"Fractions signées",                    [FP, 'calcul']],
    ['frPriorites',     "Priorités opératoires",                [FP, 'calcul']],
    ['frPemdasPiege',   "Piège de priorité",                    [FP, 'calcul']],
    ['trouPriorites',   "Raisonnement : priorités",            [FP, 'calcul']],
    ['frAddSous',       "Addition-soustraction de fractions",   [FP, 'calcul']],
    ['frMul',           "Multiplication de fractions",         [FP, 'calcul']],
    ['frDiv',           "Division de fractions",                [FP, 'calcul']],
    ['frEntierFrac',    "Entier et fraction",                   [FP, 'calcul']],
    ['frPuissanceFrac', "Puissance d'une fraction",             [FP]],
    ['frCompose',       "Expressions composées",                [FP, 'calcul']],
    ['p10Ops',          "Opérations sur puissances de 10",      [FP, 'nombres']],
    ['p10Inverse',      "Inverse d'une puissance de 10",       [FP, 'nombres']],
    ['pSciExposant',    "Écriture scientifique",                [FP, 'nombres']],
    ['pOrdreGrandeur',  "Ordre de grandeur",                    [FP, 'nombres']],
    ['puBaseRelative',  "Base relative : (-a)^n et -a^n",       [FP]],
    ['puMemeExp',       "Même exposant",                        [FP, 'litteral']],
    ['puLitteral',      "Puissances et littéral",               [FP, 'litteral']],
    ['puComposee',      "Formes combinées",                     [FP, 'litteral']]
  ];
  const rappels = {
    frSimplifie:     "On divise haut et bas par le PGCD après décomposition en facteurs premiers.",
    frFracEgales:    "Égales = même valeur : multiplier haut et bas par un même nombre non nul.",
    frCompare:       "Produits en croix ou même dénominateur (PPCM) : jamais « à l'œil ».",
    trouSimplifie:   "Simplifier = diviser ; comparer = croiser ; irréductible = PGCD 1.",
    frSigneProduit:  "Parité des signes « − » : pair → positif, impair → négatif.",
    frEcritureSignes:"+(-a) = -a et -(-a) = +a : jamais deux signes consécutifs sans simplifier.",
    frFractionSignee:"Le signe va devant, au numérateur ou au dénominateur — le résultat est réduit.",
    frPriorites:     "PEMDAS : parenthèses, exposants, ×÷ de gauche à droite, puis ±.",
    frPemdasPiege:   "Sans parenthèses, × et ÷ passent avant + et −.",
    trouPriorites:   "Priorités : PEMDAS ; à égalité, de gauche à droite.",
    frAddSous:       "Même dénominateur (PPCM), puis numérateurs — jamais (n1±n2)/(d1+d2).",
    frMul:           "Haut × haut, bas × bas : ni croisement, ni addition.",
    frDiv:           "Diviser = multiplier par l'inverse : on échange numérateur et dénominateur.",
    frEntierFrac:    "L'entier devient une fraction : même dénominateur pour ±, numérateur pour ×, inverse pour ÷.",
    frPuissanceFrac: "(a/b)^n = a^n/b^n ; un exposant négatif inverse la fraction.",
    frCompose:       "Parenthèses d'abord, inverse pour diviser, puis réduire au même dénominateur.",
    p10Ops:          "Produit → addition ; quotient → soustraction ; puissance → multiplication des exposants.",
    p10Inverse:      "1/10^n = 10^(-n) : l'exposant négatif est un inverse, pas un opposé.",
    pSciExposant:    "Un seul chiffre avant la virgule ; n compte le décalage (négatif si le nombre est plus petit que 1).",
    pOrdreGrandeur:  "Mantisse inférieure à 5 → 10^n ; supérieure ou égale → 10^(n+1).",
    puBaseRelative:  "(-a)^n tient compte du signe (pair → +) ; -a^n = -(a^n) toujours.",
    puMemeExp:       "Même exposant : les bases se multiplient (ou se divisent).",
    puLitteral:      "Même base → on opère sur les exposants, même négatifs.",
    puComposee:      "Puissance de puissance d'abord (produit), puis additions-soustractions d'exposants."
  };
  for(const [id, label, fiches] of defs){
    GEN_INFO[id] = { label, fiches, rappel: rappels[id] };
  }
})();

/* ============================================================
   6 NOTIONS EN SOMMET DE TOUR (→ 153 étages)
   ============================================================ */
NOTIONS.push(
  { id: 'fractions-egalite',     name: 'Fractions : simplification, égalité, comparaison',  g: ['frSimplifie', 'frFracEgales', 'frCompare', 'trouSimplifie'],  family: 'orange', prob: 0.5 },
  { id: 'fractions-signes',      name: 'Règles des signes',                                  g: ['frSigneProduit', 'frEcritureSignes', 'frFractionSignee'],        family: 'violet', prob: 0.5 },
  { id: 'fractions-priorites',   name: 'Priorités opératoires',                              g: ['frPriorites', 'frPemdasPiege', 'trouPriorites'],                family: 'teal',   prob: 0.5 },
  { id: 'fractions-operations',  name: 'Quatre opérations sur les fractions',               g: ['frAddSous', 'frMul', 'frDiv', 'frEntierFrac', 'frPuissanceFrac', 'frCompose'],  family: 'orange', prob: 0.5 },
  { id: 'puissances-dix',        name: 'Puissances de 10, écriture scientifique, ordre de grandeur',  g: ['p10Ops', 'p10Inverse', 'pSciExposant', 'pOrdreGrandeur'],  family: 'teal', prob: 0.5 },
  { id: 'puissances-regles',     name: 'Règles sur les puissances',                          g: ['puBaseRelative', 'puMemeExp', 'puLitteral', 'puComposee'],      family: 'violet', prob: 0.5 }
);

/* ============================================================
   FORMES DES NOUVEAUX ÉTAGES (assignation différée : les formes
   sont des constantes de 14-formes-3d.js)
   ============================================================ */
document.addEventListener('DOMContentLoaded', function(){
  const FP_SHAPES = {
    'fractions-egalite':    'cake',
    'fractions-signes':     'plus',
    'fractions-priorites':  'xgate',
    'fractions-operations':'colonnade',
    'puissances-dix':       'stack',
    'puissances-regles':    'spiral'
  };
  for(const nid in FP_SHAPES){
    if(typeof FLOOR_SHAPES !== 'undefined' && FLOOR_SHAPES[nid] === undefined){
      FLOOR_SHAPES[nid] = FP_SHAPES[nid];
    }
  }
});
