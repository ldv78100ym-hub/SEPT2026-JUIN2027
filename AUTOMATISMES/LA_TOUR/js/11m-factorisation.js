/* ============================================================
   11m. FACTORISATION — FACTEURS CACHÉS, SOMME-PRODUIT,
   COMPLEXES & CHANGEMENT DE VARIABLE
   ============================================================
   Contenu tiré du document joint « Le Dossier de la Factorisation
   du Primaire à la Terminale » (150+ situations dynamiques) :
   facteurs cachés (le 1 implicite, le signe opposé), méthode
   Somme-Produit, racines évidentes, factorisation dans ℂ
   (x² + a² = (x − ia)(x + ia)) et changement de variable
   (bicarrée, exponentielle, trigonométrique).

   AJOUTE : 8 générateurs (GEN), 1 fiche (FICHES « factorisation »),
   8 éléments simples (GEN_INFO), 4 notions (NOTIONS.splice avant
   « su-limites ») et 1 sous-catégorie de progression — la tour
   compte donc 185 étages (181 + 4).
   ============================================================ */

/* ------------------------------------------------------------
   GÉNÉRATEURS — factorisation avancée
   ------------------------------------------------------------ */
(() => {
  /* Trois distracteurs distincts, différents de la réponse. */
  const uniq3 = (ans, cands) => {
    const out = [];
    for (let i = 0; i < cands.length && out.length < 3; i++) {
      const c = cands[i];
      if (c !== ans && c !== undefined && String(c) !== '' && out.indexOf(c) < 0) out.push(c);
    }
    return out;
  };
  const par = (s) => `\\left(${s}\\right)`;

  /* ---------- 1. Le facteur caché « 1 » ---------- */
  GEN.factoCacheUn = () => {
    const a = R(2, 7), b = R(1, 6);
    const good = par(`x - ${a}`) + par(`x + ${b + 1}`);
    return QCM(
      `Factorise l'expression :<br>\\(A = \\left(x-${a}\\right)\\left(x+${b}\\right) + \\left(x-${a}\\right)\\)`,
      M(good),
      uniq3(good, [
        par(`x - ${a}`) + par(`x + ${b}`),
        par(`x + ${b}`) + par(`x - ${a} + 1`),
        par(`x - ${a} + 1`) + par(`x + ${b}`)
      ]),
      1,
      EXPL(`Le facteur commun est parfois caché : le second terme \\(\\left(x-${a}\\right)\\) est en réalité \\(\\left(x-${a}\\right) \\times 1\\).`,
        `On force le « 1 » : \\(A = \\left(x-${a}\\right)\\left(x+${b}\\right) + \\left(x-${a}\\right) \\times 1 = \\left(x-${a}\\right)\\left[\\left(x+${b}\\right) + 1\\right]\\). Il ne reste qu'à réduire : \\(\\left(x+${b}\\right) + 1 = x + ${b + 1}\\).`,
        `Le piège classique : oublier le « 1 » et écrire \\(\\left(x-${a}\\right)\\left(x+${b}\\right)\\), ce qui ne redonne pas l'expression de départ lorsqu'on développe. Toujours vérifier en développant : \\(\\left(x-${a}\\right)\\left(x+${b+1}\\right)\\) doit redonner exactement \\(A\\).`));
  };

  /* ---------- 2. Le signe opposé : (a − x) = −(x − a) ---------- */
  GEN.factoSigneOppose = () => {
    const a = R(2, 8);
    let b = R(2, 6), c = R(1, b - 1);          /* force b > c */
    const d = b - c;
    const good = par(`x - ${a}`) + par(`${b} - ${c}`);
    return QCM(
      `Factorise l'expression :<br>\\(B = \\left(x-${a}\\right)\\left(x+${b}\\right) + \\left(${a}-x\\right)\\left(x+${c}\\right)\\)`,
      M(good),
      uniq3(good, [
        par(`x - ${a}`) + par(`x + ${b} - ${c}`),
        par(`x + ${a}`) + par(`${b} - ${c}`),
        par(`x - ${a}`) + par(`x - ${b} + ${c}`)
      ]),
      1,
      EXPL(`Deux blocs « opposés » \\(\\left(x-${a}\\right)\\) et \\(\\left(${a}-x\\right)\\) sont liés par \\(\\left(${a}-x\\right) = -\\left(x-${a}\\right)\\) : échanger les termes d'une différence change son signe.`,
        `\\(B = \\left(x-${a}\\right)\\left(x+${b}\\right) - \\left(x-${a}\\right)\\left(x+${c}\\right) = \\left(x-${a}\\right)\\left[\\left(x+${b}\\right)-\\left(x+${c}\\right)\\right]\\). La réduction donne \\(\\left(x+${b}\\right)-\\left(x+${c}\\right) = ${d}\\).`,
        `Ne JAMAIS écrire \\(\\left(${a}-x\\right) = \\left(x-${a}\\right)\\) : ces deux blocs sont OPPOSÉS, pas égaux. Le signe « − » sorti de la parenthèse doit changer TOUS les signes intérieurs, et la réduction se fait sur les CONSTANTES : \\(${b} - ${c} = ${d}\\), pas sur les \\(x\\).`));
  };

  /* ---------- 3. Méthode Somme-Produit ---------- */
  GEN.factoSommeProduit = () => {
    const r1 = R(1, 9), r2 = R(1, 9);
    const S = r1 + r2, P = r1 * r2;
    const good = par(`x + ${r1}`) + par(`x + ${r2}`);
    return QCM(
      `Factorise (méthode somme-produit) :<br>\\(C = x^2 + ${S}x + ${P}\\)`,
      M(good),
      uniq3(good, [
        par(`x - ${r1}`) + par(`x - ${r2}`),
        par(`x + ${r1}`) + par(`x - ${r2}`),
        par(`x + ${S}`) + par(`x + ${r1}`)
      ]),
      1,
      EXPL(`Pour factoriser \\(x^2 + Sx + P\\), on cherche deux entiers dont le PRODUIT vaut \\(P\\) et la SOMME vaut \\(S\\).`,
        `Ici \\(S = ${S}\\) et \\(P = ${P}\\) : les deux entiers sont \\(${r1}\\) et \\(${r2}\\), car \\(${r1} \\times ${r2} = ${P}\\) et \\(${r1} + ${r2} = ${S}\\). Donc \\(C = \\left(x+${r1}\\right)\\left(x+${r2}\\right)\\).`,
        `Vérifie toujours en développant : \\(\\left(x+${r1}\\right)\\left(x+${r2}\\right) = x^2 + ${S}x + ${P}\\). Une somme \\(S\\) positive impose deux racines de MÊME signe ; un produit \\(P\\) positif les veut toutes deux positives ou toutes deux négatives.`));
  };

  /* ---------- 4. Racines évidentes ---------- */
  GEN.factoRacinesEvidentes = () => {
    const r1 = R(1, 5), r2 = R(6, 9);
    const S = r1 + r2, P = r1 * r2;
    return QCM(
      `\\(${r1}\\) est une racine évidente de \\(D(x) = x^2 - ${S}x + ${P}\\).<br>Quelle est la seconde racine ?`,
      M(`${r2}`),
      uniq3(`${r2}`, [`${S}`, `${P}`, `${r2 - r1}`, `${r2 + 1}`]),
      1,
      EXPL(`Quand une racine \\(x_1\\) est évidente, le produit des racines \\(x_1 x_2 = \\dfrac{c}{a}\\) donne la seconde sans aucun discriminant.`,
        `On vérifie \\(D(${r1}) = ${r1 * r1} - ${S} \\times ${r1} + ${P} = 0\\) : \\(${r1}\\) est bien racine. Puis \\(x_2 = \\dfrac{${P}}{${r1}} = ${r2}\\) — et la somme confirme : \\(${r1} + ${r2} = ${S}\\). Donc \\(D(x) = \\left(x-${r1}\\right)\\left(x-${r2}\\right)\\).`,
        `Le piège : confondre SOMME et PRODUIT des racines. Les deux relations sont vraies EN MÊME TEMPS : \\(x_1 x_2 = ${P}\\) et \\(x_1 + x_2 = ${S}\\). Utiliser l'une puis vérifier avec l'autre évite toute erreur de calcul.`));
  };

  /* ---------- 5. Factorisation dans ℂ ---------- */
  GEN.factoComplexeC = () => {
    const a = R(2, 9);
    const good = `\\left(x - ${a}i\\right)\\left(x + ${a}i\\right)`;
    return QCM(
      `Factorise dans \\(\\\\mathbb{C}\\) :<br>\\(E = x^2 + ${a * a}\\)`,
      M(good),
      uniq3(good, [
        `\\left(x - ${a}\\right)\\left(x + ${a}\\right)`,
        `\\left(x - ${a * a} i\\right)\\left(x + ${a * a} i\\right)`,
        `\\left(x + ${a}i\\right)^2`
      ]),
      1,
      EXPL(`Dans \\(\\mathbb{C}\\), une somme de deux carrés se factorise grâce à \\(i^2 = -1\\) : \\(x^2 + a^2 = x^2 - \\left(ia\\right)^2\\).`,
        `\\(E = x^2 - \\left(${a}i\\right)^2 = \\left(x - ${a}i\\right)\\left(x + ${a}i\\right)\\), car \\(\\left(${a}i\\right)^2 = ${a * a}\\,i^2 = -${a * a}\\). Le produit redonne bien \\(x^2 + ${a * a}\\).`,
        `Dans \\(\\mathbb{R}\\), \\(x^2 + ${a * a}\\) est IRRÉDUCTIBLE : \\(\\left(x-${a}\\right)\\left(x+${a}\\right)\\) vaut \\(x^2 - ${a * a}\\), pas \\(x^2 + ${a * a}\\). C'est précisément \\(i\\) qui change le signe du carré.`));
  };

  /* ---------- 6. Bicarrée : X = x² ---------- */
  GEN.factoBicarree = () => {
    const u = R(1, 3), v = R(4, 6);           /* racines de X² − S X + P */
    const S = u + v, P = u * v;
    const good = `\\left(x^2 - ${u}\\right)\\left(x^2 - ${v}\\right)`;
    return QCM(
      `Factorise d'abord en posant \\(X = x^2\\) :<br>\\(F = x^4 - ${S}x^2 + ${P}\\)`,
      M(good),
      uniq3(good, [
        `\\left(x - ${u}\\right)\\left(x + ${u}\\right)\\left(x - ${v}\\right)\\left(x + ${v}\\right)`,
        `\\left(x^2 + ${u}\\right)\\left(x^2 - ${v}\\right)`,
        `\\left(x - ${S}\\right)\\left(x + ${P}\\right)`
      ]),
      1,
      EXPL(`Une expression « bicarrée » ne contient que \\(x^4\\), \\(x^2\\) et une constante : poser \\(X = x^2\\) la ramène au second degré.`,
        `\\(X^2 - ${S}X + ${P}\\) se factorise (somme-produit, car \\(${u} + ${v} = ${S}\\) et \\(${u} \\times ${v} = ${P}\\)) : \\(\\left(X - ${u}\\right)\\left(X - ${v}\\right)\\). On remplace \\(X\\) par \\(x^2\\) : \\(F = \\left(x^2 - ${u}\\right)\\left(x^2 - ${v}\\right)\\).`,
        `Le changement de variable ne donne pas toujours la factorisation FINALE dans \\(\\mathbb{R}\\) : \\(x^2 - ${u}\\) et \\(x^2 - ${v}\\) se scindent encore à condition d'accepter les radicaux. Ici, l'écriture en deux blocs bicarrés est la forme attendue.`));
  };

  /* ---------- 7. Substitution exponentielle ---------- */
  GEN.factoExpSubst = () => {
    const r1 = R(2, 6), r2 = R(7, 12);
    const S = r1 + r2, P = r1 * r2;
    const good = `\\left(e^x - ${r1}\\right)\\left(e^x - ${r2}\\right)`;
    return QCM(
      `Factorise en posant \\(X = e^x\\) :<br>\\(G = e^{2x} - ${S}e^x + ${P}\\)`,
      M(good),
      uniq3(good, [
        `\\left(e^x - ${S}\\right)\\left(e^x - ${P}\\right)`,
        `\\left(e^x + ${r1}\\right)\\left(e^x - ${r2}\\right)`,
        `\\left(e^x - ${r1}\\right)\\left(e^x + ${r2}\\right)`
      ]),
      1,
      EXPL(`L'expression \\(e^{2x} - S e^x + P\\) est un trinôme déguisé : poser \\(X = e^x\\) (donc \\(e^{2x} = X^2\\)).`,
        `\\(X^2 - ${S}X + ${P}\\) se factorise en \\(\\left(X - ${r1}\\right)\\left(X - ${r2}\\right)\\) car \\(${r1} \\times ${r2} = ${P}\\) et \\(${r1} + ${r2} = ${S}\\). En revenant à \\(x\\) : \\(G = \\left(e^x - ${r1}\\right)\\left(e^x - ${r2}\\right)\\).`,
        `Attention : \\(e^{2x} = \\left(e^x\\right)^2\\), PAS \\(2 e^x\\). Et pour RÉSOUDRE \\(G = 0\\), seules \\(x = \\ln ${r1}\\) et \\(x = \\ln ${r2}\\) comptent — car \\(e^x\\) est toujours strictement positif, \\(e^x = ${-r1}\\) n'a aucune solution.`));
  };

  /* ---------- 8. Substitution trigonométrique ---------- */
  GEN.factoTrigoSubst = () => {
    const a = pick([1, 3]);
    const good = `\\left(2\\cos x - ${a}\\right)\\left(2\\cos x + ${a}\\right)`;
    return QCM(
      `Factorise avec l'identité \\(A^2 - B^2\\) où \\(A = 2\\cos x\\) :<br>\\(H = 4\\cos^2 x - ${a * a}\\)`,
      M(good),
      uniq3(good, [
        `\\left(2\\cos x - ${a}\\right)^2`,
        `\\left(4\\cos x - ${a}\\right)\\left(4\\cos x + ${a}\\right)`,
        `\\left(2\\cos x - ${a}\\right)\\left(2\\sin x + ${a}\\right)`
      ]),
      1,
      EXPL(`Repérer un « carré moins carré » : \\(4\\cos^2 x = \\left(2\\cos x\\right)^2\\) et \\(${a * a} = \\left(${a}\\right)^2\\).`,
        `\\(H = \\left(2\\cos x\\right)^2 - \\left(${a}\\right)^2 = \\left(2\\cos x - ${a}\\right)\\left(2\\cos x + ${a}\\right)\\), par l'identité \\(A^2 - B^2 = \\left(A - B\\right)\\left(A + B\\right)\\).`,
        `Le piège du coefficient : c'est \\(2\\cos x\\) qui est élevé au carré, pas \\(4\\cos x\\) — \\(\\left(4\\cos x - ${a}\\right)\\left(4\\cos x + ${a}\\right)\\) donnerait \\(16\\cos^2 x - ${a * a}\\), quatre fois trop grand.`));
  };
})();

/* ------------------------------------------------------------
   FICHE THÉMATIQUE « FACTORISATION »
   ------------------------------------------------------------ */
Object.assign(FICHES, {
  'factorisation': { titre: '🔓 Factoriser : du facteur commun au changement de variable', html: `
    <p><b>Facteur commun :</b> \\(ka + kb = k\\left(a + b\\right)\\). Repérer ce qui est RÉPÉTÉ dans chaque terme — un nombre, un monôme \\(\\left(3x^2 + 6x = 3x\\left(x + 2\\right)\\right)\\), ou un bloc entier \\(\\left(x + 1\\right)\\).</p>
    <p><b>Le facteur caché « 1 » :</b> \\(\\left(x-3\\right)\\left(x+5\\right) + \\left(x-3\\right) = \\left(x-3\\right)\\left(x+5+1\\right) = \\left(x-3\\right)\\left(x+6\\right)\\). Un terme tout seul multiplie « 1 ».</p>
    <p><b>Le signe opposé :</b> \\(\\left(a - x\\right) = -\\left(x - a\\right)\\). Échanger les termes d'une différence change son signe : les deux blocs sont opposés, pas égaux.</p>
    <p><b>Identités remarquables :</b> \\(a^2 + 2ab + b^2 = \\left(a+b\\right)^2\\) ; \\(a^2 - 2ab + b^2 = \\left(a-b\\right)^2\\) ; \\(a^2 - b^2 = \\left(a-b\\right)\\left(a+b\\right)\\).</p>
    <p><b>Méthode Somme-Produit :</b> pour \\(x^2 + Sx + P\\), chercher deux entiers de produit \\(P\\) et de somme \\(S\\) : \\(x^2 + 5x + 6 = \\left(x+2\\right)\\left(x+3\\right)\\).</p>
    <p><b>Racines évidentes :</b> si \\(x_1\\) annule le trinôme, la seconde racine vient du produit \\(x_1 x_2 = \\dfrac{c}{a}\\) (et de la somme \\(x_1 + x_2 = -\\dfrac{b}{a}\\)) — sans discriminant.</p>
    <p><b>Dans \\(\\mathbb{C}\\) :</b> \\(x^2 + a^2 = x^2 - \\left(ia\\right)^2 = \\left(x - ia\\right)\\left(x + ia\\right)\\) grâce à \\(i^2 = -1\\). Une somme de carrés EST factorisable dans \\(\\mathbb{C}\\).</p>
    <p><b>Changement de variable :</b> poser \\(X = x^2\\) (bicarrée), \\(X = e^x\\), \\(X = \\ln x\\) ou \\(X = \\cos x\\) pour transformer une expression complexe en trinôme \\(X^2 - SX + P\\), le factoriser, puis REVENIR à la variable d'origine.</p>
    <p><b>Règle d'or :</b> une factorisation se VÉRIFIE en développant — le produit doit redonner l'expression de départ, terme à terme.</p>` }
});

/* ------------------------------------------------------------
   ÉLÉMENTS SIMPLES : libellé + rappel + fiches des 8 générateurs
   ------------------------------------------------------------ */
Object.assign(GEN_INFO, {
  'factoCacheUn':        { label: 'Le facteur caché « 1 »', fiches: ['factorisation', 'litteral'],
    rappel: "Un terme seul multiplie 1 : \\(\\left(x-a\\right)\\left(x+b\\right) + \\left(x-a\\right) = \\left(x-a\\right)\\left(x+b+1\\right)\\)." },
  'factoSigneOppose':    { label: 'Le signe opposé (a − x) = −(x − a)', fiches: ['factorisation', 'litteral'],
    rappel: "\\(\\left(a-x\\right) = -\\left(x-a\\right)\\) : échanger les termes d'une différence change son signe." },
  'factoSommeProduit':   { label: 'Méthode somme-produit', fiches: ['factorisation', 'second-degre'],
    rappel: "Deux entiers de produit \\(P\\) et de somme \\(S\\) : \\(x^2 + Sx + P = \\left(x+r_1\\right)\\left(x+r_2\\right)\\)." },
  'factoRacinesEvidentes': { label: 'Racines évidentes & produit des racines', fiches: ['factorisation', 'second-degre'],
    rappel: "Si \\(x_1\\) est racine évidente, \\(x_2 = \\dfrac{c}{a} \\div x_1\\) : le produit \\(x_1x_2 = \\dfrac{c}{a}\\) donne la seconde sans discriminant." },
  'factoComplexeC':      { label: 'Factoriser x² + a² dans ℂ', fiches: ['factorisation', 'complexes'],
    rappel: "\\(x^2 + a^2 = \\left(x-ia\\right)\\left(x+ia\\right)\\) car \\(\\left(ia\\right)^2 = -a^2\\)." },
  'factoBicarree':       { label: 'Bicarrée : poser X = x²', fiches: ['factorisation', 'second-degre'],
    rappel: "Bicarrée : poser \\(X = x^2\\), factoriser le trinôme en \\(X\\), puis remplacer \\(X\\) par \\(x^2\\)." },
  'factoExpSubst':       { label: 'Substitution X = e^x', fiches: ['factorisation', 'suites'],
    rappel: "\\(e^{2x} = \\left(e^x\\right)^2\\) : poser \\(X = e^x\\) ramène l'expression à un trinôme en \\(X\\)." },
  'factoTrigoSubst':    { label: 'Carré moins carré avec cos x', fiches: ['factorisation', 'trigo-cercle'],
    rappel: "\\(4\\cos^2 x - a^2 = \\left(2\\cos x - a\\right)\\left(2\\cos x + a\\right)\\) : c'est \\(\\left(2\\cos x\\right)^2\\)." }
});

/* ============================================================
   4 NOTIONS NOUVELLES (→ 185 étages, avant les « limites »)
   ============================================================ */
const NOUVELLES_FACTO = [
  { id: 'facto-cachees',      name: 'Facteurs cachés : 1 implicite & signes',  g: ['factoCacheUn', 'factoSigneOppose'],  family: 'teal', prob: 0.5 },
  { id: 'facto-sommeproduit', name: 'Somme-produit & racines évidentes',      g: ['factoSommeProduit', 'factoRacinesEvidentes'], family: 'teal', prob: 0.5 },
  { id: 'facto-complexes',    name: 'Factoriser dans ℂ : x² + a²',             g: ['factoComplexeC'],                    family: 'pink', prob: 0.5 },
  { id: 'facto-substitution', name: 'Changement de variable pour factoriser', g: ['factoBicarree', 'factoExpSubst', 'factoTrigoSubst'], family: 'violet', prob: 0.5 }
];
(function () {
  const iLim = NOTIONS.findIndex(n => n.id === 'su-limites');
  if (iLim < 0) NOTIONS.push.apply(NOTIONS, NOUVELLES_FACTO);
  else NOTIONS.splice.apply(NOTIONS, [iLim, 0].concat(NOUVELLES_FACTO));
})();

/* ============================================================
   PROGRESSION : une sous-catégorie « avancée » dans
   « Calcul littéral & factorisation ».
   ============================================================ */
(function () {
  const cat = PROG_CATS.find(c => c.nom === 'Calcul littéral & factorisation');
  const sub = { nom: 'Facteurs cachés, somme-produit & substitution',
                ids: ['facto-cachees', 'facto-sommeproduit', 'facto-complexes', 'facto-substitution'] };
  if (cat) cat.subs.push(sub);
  else PROG_CATS.push({ icon: '✖️', nom: 'Factorisation avancée', subs: [sub] });
})();

/* Formes 3D des nouveaux étages (FLOOR_SHAPES est déclaré dans
   14-formes-3d.js, chargé plus tard : l'affectation attend la fin
   du chargement de la page.) */
document.addEventListener('DOMContentLoaded', function () {
  try {
    FLOOR_SHAPES['facto-cachees']      = 'nest';
    FLOOR_SHAPES['facto-sommeproduit'] = 'xgate';
    FLOOR_SHAPES['facto-complexes']    = 'spiral';
    FLOOR_SHAPES['facto-substitution'] = 'wave';
  } catch (e) { /* formes de secours : 'box' */ }
});
