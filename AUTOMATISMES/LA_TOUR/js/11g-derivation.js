/* ============================================================
   11g. DÉRIVÉES, SIGNES, VARIATIONS & TANGENTES SUR UN
        INTERVALLE — intégration du document « Exercices –
        Dérivées, signes, variations et tangentes »
   ------------------------------------------------------------
   Le document source fait étudier une fonction polynôme f de
   degré 1 à 3 sur un intervalle I = [A ; B] : forme factorisée
   de f', résolution de f'(x) = 0 SUR I (avec analyse des racines
   hors intervalle), tableau de signes, images des valeurs
   remarquables, variations et extremums locaux, tangente en un
   point. La dérivation de base et la tangente à x² existent déjà
   dans la tour (deriveePoly, t-tangente…) : seules les parties
   absentes sont intégrées ici, au format QCM / raisonnements à
   clés de la tour, avec valeurs exactes.
   → 2 notions en sommet de tour (155 étages), 7 générateurs,
     fiche « Étude sur un intervalle ».
   ============================================================ */

/* ---------- Helpers (préfixe et-, aucune collision) ---------- */
function etSgn(v){ return v > 0 ? '+' : (v < 0 ? '-' : '0'); }
function etPar(n){ return n < 0 ? '(' + n + ')' : String(n); }
/* Coefficients [a0, a1, …] → LaTeX, exposants corrects. */
function etPoly(c){
  let out = '';
  for(let i = c.length - 1; i >= 0; i--){
    const k = c[i]; if(k === 0) continue;
    const ab = Math.abs(k);
    const t = i === 0 ? String(ab) : (i === 1 ? (ab === 1 ? '' : ab) + 'x' : (ab === 1 ? '' : ab) + 'x^{' + i + '}');
    if(out === '') out = (k < 0 ? '-' : '') + t;
    else out += (k < 0 ? ' - ' : ' + ') + t;
  }
  return out === '' ? '0' : out;
}
function etEval(c, x){ let s = 0, p = 1; for(let i = 0; i < c.length; i++){ s += c[i] * p; p *= x; } return s; }
function etFac(r){ return r === 0 ? 'x' : (r > 0 ? '(x - ' + r + ')' : '(x + ' + (-r) + ')'); }
/* Intervalle LaTeX [A ; B] */
function etIv(a, b){ return '[' + a + ' ; ' + b + ']'; }

/* ---------- Génération d'une étude (miroir du document) ---------- */
function etBuild(){
  const deg = R(1, 3);
  const ex = { deg: deg };
  if(deg === 3){
    let m, p, q;
    do {
      m = pick([-3, -2, -1, 1, 2, 3]);
      p = R(-4, 4); q = R(-4, 4);
      if(p === q) continue;
      if(p > q){ const t = p; p = q; q = t; }
      if(Math.abs(m) % 2 === 1 && (p + q) % 2 !== 0) continue;
      break;
    } while(true);
    ex.m = m; ex.p = p; ex.q = q;
    ex.k = 3 * m;
    const a0 = R(-6, 6), a2 = -3 * m * (p + q) / 2, a1 = 3 * m * p * q;
    ex.coeffs = [a0, a1, a2, m];
    ex.fp = [a1, 2 * a2, 3 * m];
    ex.roots = [p, q];
    ex.kStr = (ex.k === 1 ? '' : ex.k === -1 ? '-' : String(ex.k));
    ex.fpFact = ex.kStr + etFac(p) + etFac(q);
    let caseType = pick(['both', 'both', 'onlyP', 'onlyQ', 'none']);
    const span = q - p;
    let A, B;
    if(caseType === 'both'){ A = p - R(1, 3); B = q + R(1, 3); }
    else if(caseType === 'onlyP' && span >= 2){ A = p - R(1, 3); B = p + R(1, span - 1); }
    else if(caseType === 'onlyQ' && span >= 2){ B = q + R(1, 3); A = q - R(1, span - 1); }
    else if(caseType === 'none'){
      if(pick([true, false])){ B = p - R(1, 3); A = B - R(2, 4); }
      else { A = q + R(1, 3); B = A + R(2, 4); }
    }
    else { caseType = 'both'; A = p - R(1, 3); B = q + R(1, 3); }
    ex.caseType = caseType;
    ex.I = [A, B];
  } else if(deg === 2){
    const a = pick([-3, -2, -1, 1, 2, 3]);
    const r = R(-4, 4);
    ex.a = a; ex.r = r;
    ex.k = 2 * a;
    const b = -2 * a * r, c = R(-6, 6);
    ex.coeffs = [c, b, a];
    ex.fp = [b, 2 * a];
    ex.roots = [r];
    ex.kStr = String(ex.k);
    ex.fpFact = ex.kStr + etFac(r);
    const caseType = pick(['in', 'in', 'in', 'out-left', 'out-right']);
    ex.caseType = caseType;
    let A, B;
    if(caseType === 'in'){ A = r - R(1, 4); B = r + R(1, 4); }
    else if(caseType === 'out-left'){ B = r - R(1, 3); A = B - R(2, 4); }
    else { A = r + R(1, 3); B = A + R(2, 4); }
    ex.I = [A, B];
  } else {
    const a = pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
    const b = R(-6, 6);
    ex.a = a;
    ex.coeffs = [b, a];
    ex.fp = [a];
    ex.roots = [];
    ex.k = a;
    ex.kStr = String(a);
    ex.fpFact = null;
    ex.caseType = 'no-roots';
    ex.I = [R(-6, -3), R(3, 6)];
  }
  ex.fTex = etPoly(ex.coeffs);
  ex.fpTex = etPoly(ex.fp);
  const A = ex.I[0], B = ex.I[1];
  ex.rootsInI = ex.roots.filter(r => r >= A && r <= B);
  ex.fA = etEval(ex.coeffs, A);
  ex.fB = etEval(ex.coeffs, B);
  let x0;
  if(ex.rootsInI.length > 0 && Math.random() < 0.45) x0 = pick(ex.rootsInI);
  else x0 = R(A, B);
  ex.x0 = x0;
  ex.fx0 = etEval(ex.coeffs, x0);
  ex.fpx0 = etEval(ex.fp, x0);
  return ex;
}

/* Description textuelle du signe de f' sur I (mot + intervalles). */
function etSignPattern(ex){
  const A = ex.I[0], B = ex.I[1];
  const s = v => v > 0 ? 'positive' : 'négative';
  const seg = (v, a, b) => s(v) + ' sur \\([' + a + ' ; ' + b + ']\\)';
  const nul = ex.rootsInI.length
    ? (ex.rootsInI.length === 2 ? ' et s\u2019annule en ' + ex.rootsInI[0] + ' et ' + ex.rootsInI[1]
       : ' et s\u2019annule en ' + ex.rootsInI[0])
    : ' et ne s\u2019annule jamais sur I';
  let pos;
  if(ex.deg === 3){
    const k = ex.k, p = ex.p, q = ex.q;
    if(ex.caseType === 'both') pos = [seg(k, A, p), seg(-k, p, q), seg(k, q, B)];
    else if(ex.caseType === 'onlyP') pos = [seg(k, A, p), seg(-k, p, B)];
    else if(ex.caseType === 'onlyQ') pos = [seg(-k, A, q), seg(k, q, B)];
    else pos = [seg(k, A, B)];
  } else if(ex.deg === 2){
    const k = ex.k, r = ex.r;
    if(ex.caseType === 'in') pos = [seg(-k, A, r), seg(k, r, B)];
    else if(ex.caseType === 'out-left') pos = [seg(-k, A, B)];
    else pos = [seg(k, A, B)];
  } else pos = [seg(ex.a, A, B)];
  return { txt: pos.join(', ') + nul, pos: pos };
}

/* ============================================================
   NOTION « SIGNE DE LA DÉRIVÉE & RACINES SUR UN INTERVALLE »
   ============================================================ */

/* Q2 du document : forme factorisée de f'(x). */
GEN.etFacto = () => {
  let ex;
  do { ex = etBuild(); } while(ex.deg === 1);
  const ok = ex.fpFact;
  const wrongs = [];
  const push = t => { if(t && t !== ok && !/\s[+-] 0$/.test(t) && wrongs.indexOf(t) < 0) wrongs.push(t); };
  if(ex.deg === 3){
    const k = ex.k, p = ex.p, q = ex.q, ks = ex.kStr === '' ? '' : ex.kStr;
    push(ks + etFac(-p) + etFac(q));
    push(ks + etFac(p) + etFac(-q));
    push(etFac(p) + etFac(q));
    push(String(k > 0 ? k + 1 : k - 1) + etFac(p) + etFac(q));
    push(String(-k) + etFac(p) + etFac(q));
  } else {
    const k = ex.k, r = ex.r;
    push(ex.kStr + etFac(-r));
    push((k / 2 === 1 ? '' : k / 2 === -1 ? '-' : String(k / 2)) + etFac(r));
    push(ex.kStr + (r === 0 ? 'x' : r > 0 ? 'x - ' + r : 'x + ' + (-r)));
    push(String(k > 0 ? k + 1 : k - 1) + etFac(r));
    push(ex.kStr + etFac(r) + (ex.coeffs[1] >= 0 ? ' + ' + ex.coeffs[1] : ' - ' + (-ex.coeffs[1])));
  }
  return QCM(
    `f est définie sur \\(I = ${etIv(ex.I[0], ex.I[1])}\\) par \\(f(x) = ${ex.fTex}\\).\nQuelle est la forme FACTORISÉE de \\(f'(x)\\) ?`,
    `\\(${ex.fpFact}\\)`,
    wrongs.map(w => `\\(${w}\\)`),
    2,
    EXPL(`On dérive terme à terme, puis on factorise \\(f'(x)\\) par son coefficient dominant : \\(f'(x) = k\\,(x - r_1)(x - r_2)\\).`,
      `Ici \\(f'(x) = ${ex.fpTex}\\)${ex.deg === 3
        ? `, et \\(f'(x) = 0\\) pour \\(x = ${ex.p}\\) et \\(x = ${ex.q}\\), donc \\(f'(x) = ${ex.fpFact}\\)`
        : `, et \\(f'(x) = 0\\) pour \\(x = ${ex.r}\\), donc \\(f'(x) = ${ex.fpFact}\\)`}.`,
      `Chaque facteur s\u2019écrit \\((x - r)\\) : une erreur de signe déplace la racine de l\u2019autre côté de zéro. Et le facteur \\(k\\) se calcule sur la DÉRIVÉE (coefficient dominant), pas sur f.`));
};

/* Q3 du document : résoudre f'(x) = 0 sur I (racines hors I exclues). */
GEN.etRacinesI = () => {
  const ex = etBuild();
  const A = ex.I[0], B = ex.I[1];
  let ok, cands, meth;
  const S = arr => '\\(S = \\{' + arr.join(' ; ') + '\\}\\)';
  const SVIDE = '\\(S = \\emptyset\\)';
  if(ex.deg === 3){
    const p = ex.p, q = ex.q;
    if(ex.caseType === 'both'){ ok = S([p, q]); cands = [S([p]), S([q]), SVIDE, S([-p, -q])]; }
    else if(ex.caseType === 'onlyP'){ ok = S([p]); cands = [S([p, q]), SVIDE, S([q]), S([p, B])]; }
    else if(ex.caseType === 'onlyQ'){ ok = S([q]); cands = [S([p, q]), SVIDE, S([p]), S([q, A])]; }
    else { ok = SVIDE; cands = [S([p]), S([q]), S([p, q]), S([A, B])]; }
    meth = `\\(f'(x) = ${ex.fpFact} = 0\\) : un produit est nul si l\u2019un au moins de ses facteurs est nul, donc \\(x = ${p}\\) ou \\(x = ${q}\\).` +
      (ex.caseType === 'both'
        ? ` Or \\(${A} \\leq ${p} \\lt ${q} \\leq ${B}\\) : les deux valeurs appartiennent à \\(I\\).`
        : ex.caseType === 'onlyP'
        ? ` Or \\(${p} \\in I\\) mais \\(${q} \\notin I\\) : on ne garde que \\(x = ${p}\\).`
        : ex.caseType === 'onlyQ'
        ? ` Or \\(${q} \\in I\\) mais \\(${p} \\notin I\\) : on ne garde que \\(x = ${q}\\).`
        : ` Or ni \\(${p}\\) ni \\(${q}\\) n\u2019appartient à \\(I = ${etIv(A, B)}\\).`);
  } else if(ex.deg === 2){
    const r = ex.r;
    if(ex.caseType === 'in'){ ok = S([r]); cands = [SVIDE, S([r, A]), S([-r]), S([0])]; }
    else { ok = SVIDE; cands = [S([r]), S([A, B]), S([A]), S([0])]; }
    meth = `\\(f'(x) = ${ex.fpFact} = 0\\) donne \\(x = ${r}\\)` +
      (ex.caseType === 'in'
        ? `, et \\(${A} \\leq ${r} \\leq ${B}\\) : cette valeur appartient à \\(I\\).`
        : `, mais ${ex.caseType === 'out-left' ? `\\(${r} \\gt ${B}\\)` : `\\(${r} \\lt ${A}\\)`} : cette valeur n\u2019appartient PAS à \\(I\\).`);
  } else {
    ok = SVIDE; cands = ['\\(S = \\{0\\}\\)', `\\(S = \\{${etPar(-Math.round(ex.coeffs[0] / ex.a))}\\}\\)`, S([A, B]), S([A])];
    meth = `\\(f'(x) = ${ex.a}\\) : la dérivée est constante NON NULLE, donc \\(f'(x) = 0\\) n\u2019a aucune solution — ni sur \\(\\mathbb{R}\\), ni sur \\(I\\).`;
  }
  const wrongs = [];
  cands.forEach(c => { if(c !== ok && wrongs.indexOf(c) < 0) wrongs.push(c); });
  return QCM(
    `f est définie sur \\(I = ${etIv(A, B)}\\) par \\(f(x) = ${ex.fTex}\\).\nRésolvez \\(f'(x) = 0\\) sur \\(I\\) (ensemble des solutions dans \\(I\\) uniquement).`,
    ok,
    wrongs,
    2,
    EXPL(`On résout \\(f'(x) = 0\\) sur \\(\\mathbb{R}\\) puis on ne garde QUE les solutions situées dans l\u2019intervalle \\(I\\) : une racine hors de \\(I\\) n\u2019est pas solution de l\u2019étude.`,
      meth,
      `Piège classique : donner toutes les racines de \\(f'\\) sans vérifier qu\u2019elles appartiennent à \\(I\\) — ou confondre \\(f'(x) = 0\\) avec \\(f(x) = 0\\).`));
};

/* Q4 du document : tableau de signes de f' sur I. */
GEN.etSigneI = () => {
  const ex = etBuild();
  const A = ex.I[0], B = ex.I[1];
  const pat = etSignPattern(ex);
  const flip = t => t.replace(/positive/g, '@').replace(/négative/g, 'positive').replace(/@/g, 'négative');
  const wrongs = [];
  const inv = t => { if(t !== pat.txt && wrongs.indexOf(t) < 0) wrongs.push(t); };
  inv(flip(pat.txt));
  if(pat.pos.length > 1){
    inv((ex.k > 0 ? 'positive' : 'négative') + ' sur tout \\(I\\)');
    inv((ex.k > 0 ? 'négative' : 'positive') + ' sur tout \\(I\\)');
  } else {
    let m = Math.floor((A + B) / 2);
    if(m <= A) m = A + 1;
    if(m >= B) m = B - 1;
    const posneg = 'positive sur \\([' + A + ' ; ' + m + ']\\), négative sur \\([' + m + ' ; ' + B + ']\\) et s\u2019annule en ' + m;
    inv(posneg);
    inv(flip(posneg));
  }
  return QCM(
    `f est définie sur \\(I = ${etIv(A, B)}\\) par \\(f(x) = ${ex.fTex}\\), de dérivée \\(f'(x) = ${ex.fpTex}\\).\nQuelle description du SIGNE de \\(f'\\) sur \\(I\\) est correcte ?`,
    pat.txt,
    wrongs,
    2,
    EXPL(`Après \\(f'(x) = 0\\), les racines situées dans \\(I\\) découpent l\u2019intervalle en sous-intervalles où \\(f'\\) garde un signe CONSTANT ; on teste une valeur par sous-intervalle.`,
      pat.pos.length > 1
        ? `Sur chacun des ${pat.pos.length} sous-intervalles, on remplace \\(x\\) par une valeur : le signe de \\(f'\\) y est constant, d\u2019où : ${pat.txt}.`
        : `Aucune racine de \\(f'\\) n\u2019est dans \\(I\\) : le signe de \\(f'\\) est le même sur tout l\u2019intervalle — ${pat.txt}.`,
      `Ne pas confondre le signe de \\(f\\) et celui de \\(f'\\) : c\u2019est le signe de la DÉRIVÉE qui commande les variations. Et une racine hors de \\(I\\) ne crée AUCUN changement de signe dans l\u2019intervalle.`));
};

/* ============================================================
   NOTION « VARIATIONS, IMAGES & TANGENTE SUR UN INTERVALLE »
   ============================================================ */

/* Q5 du document : images des valeurs remarquables et des bornes. */
GEN.etImages = () => {
  const ex = etBuild();
  const A = ex.I[0], B = ex.I[1];
  let t, intro;
  if(ex.rootsInI.length && Math.random() < 0.5){
    t = pick(ex.rootsInI);
    intro = `La valeur \\(${t}\\) annule \\(f'\\) sur \\(I\\) : c\u2019est une valeur remarquable de l\u2019étude.`;
  } else {
    t = pick([A, B]);
    intro = `Aucun calcul de dérivée n\u2019est nécessaire ici : on évalue la fonction en la borne \\(${t}\\) de \\(I\\).`;
  }
  const val = etEval(ex.coeffs, t);
  const cands = [etEval(ex.fp, t), 0, val + ex.k, val - ex.k, val + 1, val - 1, t * etEval(ex.fp, t)];
  const wrongs = [];
  cands.forEach(c => { if(c !== val && wrongs.indexOf(c) < 0 && wrongs.length < 4) wrongs.push(c); });
  const vs = wrongs.map(String);
  return QCM(
    `f est définie par \\(f(x) = ${ex.fTex}\\).\nCalculez l\u2019image \\(f(${t})\\) (valeur exacte).`,
    String(val),
    vs,
    1,
    EXPL(`Une image s\u2019obtient par substitution directe : on remplace \\(x\\) par la valeur proposée dans l\u2019expression de \\(f\\).`,
      `On remplace \\(x\\) par \\(${t}\\) : \\(f(${t}) = ${val}\\)`,
      `Ne pas confondre \\(f(${t})\\) avec \\(f'(${t}) = ${etEval(ex.fp, t)}\\) : l\u2019image est dans \\(f\\), la dérivée ne sert qu\u2019aux variations.`));
};

/* Q6 + Q7 du document : variations de f sur I et extremums locaux. */
GEN.etVariations = () => {
  const ex = etBuild();
  const A = ex.I[0], B = ex.I[1];
  const cro = 'croissante', dec = 'décroissante';
  const seg = (s, a, b) => (s > 0 ? cro : dec) + ' sur \\([' + a + ' ; ' + b + ']\\)';
  let pos, ext, mono = false;
  if(ex.deg === 3){
    const k = ex.k, p = ex.p, q = ex.q;
    if(ex.caseType === 'both'){
      pos = [seg(k, A, p), seg(-k, p, q), seg(k, q, B)];
      ext = k > 0 ? `maximum local en \\(${p}\\), minimum local en \\(${q}\\)` : `minimum local en \\(${p}\\), maximum local en \\(${q}\\)`;
    } else if(ex.caseType === 'onlyP'){
      pos = [seg(k, A, p), seg(-k, p, B)];
      ext = k > 0 ? `maximum local en \\(${p}\\)` : `minimum local en \\(${p}\\)`;
    } else if(ex.caseType === 'onlyQ'){
      pos = [seg(-k, A, q), seg(k, q, B)];
      ext = k > 0 ? `minimum local en \\(${q}\\)` : `maximum local en \\(${q}\\)`;
    } else { pos = [seg(k, A, B)]; ext = 'aucun extremum sur I : f est monotone'; mono = true; }
  } else if(ex.deg === 2){
    const k = ex.k, r = ex.r;
    if(ex.caseType === 'in'){ pos = [seg(-k, A, r), seg(k, r, B)]; ext = k > 0 ? `minimum local en \\(${r}\\)` : `maximum local en \\(${r}\\)`; }
    else { pos = [seg(ex.caseType === 'out-left' ? -k : k, A, B)]; ext = 'aucun extremum sur I : f est monotone'; mono = true; }
  } else { pos = [seg(ex.a, A, B)]; ext = 'aucun extremum : f est monotone'; mono = true; }
  const ok = pos.join(', ') + ' ; ' + ext;
  const flip = t => t.replace(/décroissante/g, '@').replace(/croissante/g, 'décroissante').replace(/@/g, 'croissante');
  const inv2 = t => t.replace(/maximum local/g, '@').replace(/minimum local/g, 'maximum local').replace(/@/g, 'minimum local');
  const wrongs = [];
  const pw = t => { if(t !== ok && wrongs.indexOf(t) < 0) wrongs.push(t); };
  pw(flip(ok));
  if(!mono) pw(inv2(ok));
  if(mono){
    const firstWord = pos[0].indexOf(cro) === 0 ? cro : dec;
    pw((firstWord === cro ? dec : cro) + ' sur tout I, sans extremum');
  } else {
    pw(cro + ' sur tout I, sans extremum');
    pw(dec + ' sur tout I, sans extremum');
  }
  pw(`extremum local atteint aux bornes \\(${A}\\) et \\(${B}\\)`);
  pw('extremum local au milieu de I');
  return QCM(
    `f est définie sur \\(I = ${etIv(A, B)}\\) par \\(f(x) = ${ex.fTex}\\), de dérivée \\(f'(x) = ${ex.fpTex}\\).\nQuelles sont les variations de \\(f\\) sur \\(I\\) ?`,
    ok,
    wrongs,
    2,
    EXPL(`\\(f' \\gt 0\\) sur un intervalle ⟹ \\(f\\) y est croissante ; \\(f' \\lt 0\\) ⟹ décroissante ; là où \\(f'\\) s\u2019annule EN CHANGEANT de signe, \\(f\\) présente un extremum local.`,
      pos.length > 1
        ? `Le tableau de signes de \\(f'\\) découpe \\(I\\) : ${pos.join(' ; ')}. Au point de changement de signe, \\(f\\) change de sens : ${ext}.`
        : `\\(f'\\) garde un signe constant sur \\(I\\) : ${pos[0]}, donc ${ext}.`,
      `Un extremum local n\u2019apparaît qu\u2019à un CHANGEMENT de signe de \\(f'\\) — une racine de \\(f'\\) hors de \\(I\\), ou sans changement de signe, ne donne jamais d\u2019extremum sur l\u2019intervalle.`));
};

/* Q8 du document : équation réduite de la tangente en x0. */
GEN.etTangente = () => {
  let ex;
  do { ex = etBuild(); } while(ex.deg === 1);
  const x0 = ex.x0, fx0 = ex.fx0, fpx0 = ex.fpx0;
  const ord = fx0 - x0 * fpx0;
  const lin = (p, o) => {
    const pp = p === 1 ? '' : p === -1 ? '-' : String(p);
    if(p === 0) return 'y = ' + o;
    if(o === 0) return 'y = ' + pp + 'x';
    return 'y = ' + pp + 'x' + (o > 0 ? ' + ' + o : ' - ' + (-o));
  };
  const ok = lin(fpx0, ord);
  const cands = [lin(fpx0, fx0), lin(fx0, fpx0), lin(fpx0, -ord), lin(fpx0, ord + 2 * x0), lin(fpx0 + 1, ord), lin(-fpx0, ord)];
  const wrongs = [];
  cands.forEach(c => { if(c !== ok && wrongs.indexOf(c) < 0 && wrongs.length < 4) wrongs.push(c); });
  return QCM(
    `f est définie par \\(f(x) = ${ex.fTex}\\) et \\(C_f\\) sa courbe.\nQuelle est l\u2019équation réduite de la tangente à \\(C_f\\) au point d\u2019abscisse \\(x_0 = ${x0}\\) ?`,
    `\\(${ok}\\)`,
    wrongs.map(w => `\\(${w}\\)`),
    2,
    EXPL(`La tangente en \\(x_0\\) a pour équation \\(y = f'(x_0)(x - x_0) + f(x_0)\\) ; la forme réduite s\u2019obtient en développant.`,
      `\\(f(${x0}) = ${fx0}\\) et \\(f'(${x0}) = ${fpx0}\\) ; en développant \\(y = ${fpx0}${x0 === 0 ? 'x' : '(' + (x0 > 0 ? 'x - ' + x0 : 'x + ' + (-x0)) + ')'}${fx0 >= 0 ? ' + ' + fx0 : ' - ' + (-fx0)}\\), on obtient \\(${ok}\\).`,
      `L\u2019ordonnée à l\u2019origine de la tangente n\u2019est PAS \\(f(x_0)\\) mais \\(f(x_0) - x_0\\,f'(x_0)\\) : c\u2019est la valeur de \\(y\\) en \\(x = 0\\), pas au point de contact.`));
};

/* Raisonnement à clés : la chaîne complète d'une étude sur I. */
GEN.trouEtudeDerivee = () => TROU(
  `Étude d'une fonction sur un intervalle — complète le raisonnement.`,
  `Toute étude de fonction sur un intervalle \\(I\\) suit la même chaîne.<br>
   Étape 1 : \\(f\\) est un polynôme, donc dérivable ; la dérivée d'une {{0}} est la somme des dérivées, on dérive donc chaque terme séparément.<br>
   Étape 2 : on résout \\(f'(x) = 0\\) et on ne garde que les racines situées dans l'{{1}} de l'étude.<br>
   Étape 3 : les {{2}} de \\(f'\\) retenues découpent \\(I\\) en sous-intervalles où \\(f'\\) garde un {{3}} constant.<br>
   Étape 4 : là où \\(f'\\) est positive, \\(f\\) est {{4}} ; là où \\(f'\\) est négative, \\(f\\) est décroissante.<br>
   Étape 5 : là où \\(f'\\) s'annule en changeant de signe, \\(f\\) présente un {{5}} local.<br>
   Étape 6 : la tangente en \\(x_0\\) a pour équation \\(y = f'(x_0)(x - x_0) + f(x_0)\\) : on remplace {{6}} par \\(x_0\\) dans \\(f\\) puis dans \\(f'\\).`,
  ['somme', 'intervalle', 'racines', 'signe', 'croissante', 'extremum', 'x'],
  ['produit', 'domaine', 'bornes', 'valeur absolue', 'décroissante', 'maximum', 'zéro',
   'fonction', 'nulle', 'minimum', 'double', 'pente'],
  `Piège classique : garder une racine de \\(f'\\) située HORS de l'intervalle (elle ne change rien à l'étude), ou chercher le signe de \\(f\\) au lieu de celui de \\(f'\\).`);

/* ============================================================
   FICHE « ÉTUDE SUR UN INTERVALLE »
   ============================================================ */
FICHES['etude-intervalle'] = { titre: '📉 Étude d\u2019une fonction sur un intervalle', html: `
  <p><b>Méthode complète :</b> 1) dériver \\(f\\) (somme des dérivées terme à terme) — 2) factoriser \\(f'\\) par son coefficient dominant — 3) résoudre \\(f'(x)=0\\) et ne garder QUE les racines dans \\(I\\) — 4) signe de \\(f'\\) sur chaque sous-intervalle — 5) sens de variation et extremums — 6) images des valeurs remarquables et des bornes — 7) tangente en un point.</p>
  <p><b>Formules :</b> \\((ax+b)' = a\\), \\((ax^{2}+bx+c)' = 2ax+b\\), \\((ax^{3}+bx^{2}+cx+d)' = 3ax^{2}+2bx+c\\) ; puis \\(f'(x) = k(x-r)\\) ou \\(k(x-r_1)(x-r_2)\\).</p>
  <p><b>Racines sur l'intervalle :</b> un produit est nul si l'un au moins des facteurs est nul, mais une racine HORS de \\(I\\) n'est pas solution de l'étude : toujours vérifier \\(A \\leq r \\leq B\\) avant de la garder (sinon \\(S = \\emptyset\\) ou une seule racine).</p>
  <p><b>Signe :</b> chaque racine de \\(f'\\) située dans \\(I\\) découpe l'intervalle ; le signe de \\(f'\\) y est constant — le tester en une valeur suffit. Sans racine dans \\(I\\) : signe constant, celui du coefficient dominant.</p>
  <p><b>Variations & extremums :</b> \\(f' > 0\\) sur un sous-intervalle ⟹ \\(f\\) croissante ; \\(f' < 0\\) ⟹ décroissante. Extremum local uniquement là où \\(f'\\) s'annule EN CHANGEANT de signe : \\(+\\) puis \\(-\\) = maximum, \\(-\\) puis \\(+\\) = minimum. Monotone sur \\(I\\) ⟹ aucun extremum à l'intérieur.</p>
  <p><b>Images :</b> remplacer \\(x\\) par la valeur (racine remarquable ou borne) : \\(f(r)\\) est la valeur de l'extremum, elle figure dans le tableau de variation.</p>
  <p><b>Tangente en \\(x_0\\) :</b> \\(y = f'(x_0)(x-x_0)+f(x_0)\\) ; forme réduite \\(y = f'(x_0)\\,x + \\bigl(f(x_0)-x_0\\,f'(x_0)\\bigr)\\) — l'ordonnée à l'origine n'est pas \\(f(x_0)\\).</p>` };

/* ============================================================
   GEN_INFO DES 7 GÉNÉRATEURS
   ============================================================ */
(function(){
  const EI = 'etude-intervalle';
  const defs = [
    ['etFacto',          'Forme factorisée de la dérivée',        [EI, 'derivees']],
    ['etRacinesI',       'Racines de la dérivée sur un intervalle', [EI, 'derivees', 'second-degre']],
    ['etSigneI',         'Tableau de signes de f\u2019 sur un intervalle', [EI, 'tableaux']],
    ['etImages',         'Images des valeurs remarquables',      [EI, 'derivees']],
    ['etVariations',     'Variations et extremums sur un intervalle', [EI, 'tableaux']],
    ['etTangente',       'Tangente en un point de l\u2019intervalle', [EI, 'derivees']],
    ['trouEtudeDerivee', 'Raisonnement : étude complète',        [EI, 'derivees', 'tableaux']]
  ];
  const rappels = {
    etFacto: "Factoriser f' par son coefficient dominant : k(x−r) ou k(x−r₁)(x−r₂).",
    etRacinesI: "Produit nul = un facteur nul ; ne garder que les racines DANS l'intervalle.",
    etSigneI: "Signe constant entre deux racines de f' situées dans I ; tester une valeur.",
    etImages: "f(r) : substitution directe — ne pas confondre avec f'(r).",
    etVariations: "f' > 0 : f croît ; extremum local seulement aux changements de signe de f'.",
    etTangente: "y = f'(x₀)(x − x₀) + f(x₀) ; ordonnée à l'origine : f(x₀) − x₀·f'(x₀).",
    trouEtudeDerivee: "Chaîne : dériver, factoriser, racines dans I, signe, variations, extremum, tangente."
  };
  defs.forEach(function(d){ GEN_INFO[d[0]] = { label: d[1], fiches: d[2], rappel: rappels[d[0]] }; });
})();

/* ============================================================
   2 NOTIONS EN SOMMET DE TOUR (→ 155 étages)
   ============================================================ */
NOTIONS.push(
  { id: 'derivee-racines-I',  name: 'Signe de la dérivée & racines sur un intervalle',
    g: ['etFacto', 'etRacinesI', 'etSigneI'],  family: 'teal', prob: 0.5 },
  { id: 'derivee-variations-I', name: 'Variations, images & tangente sur un intervalle',
    g: ['etImages', 'etVariations', 'etTangente', 'trouEtudeDerivee'],  family: 'lime', prob: 0.5 }
);

/* Formes 3D des nouveaux étages (constantes de 14-formes-3d.js). */
document.addEventListener('DOMContentLoaded', function(){
  try {
    FLOOR_SHAPES['derivee-racines-I']    = 'xgate';
    FLOOR_SHAPES['derivee-variations-I'] = 'wave';
  } catch(e) { /* formes de secours */ }
});
