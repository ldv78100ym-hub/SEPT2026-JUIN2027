/* ============================================================
   11t. VALEURS PROPRES & VECTEURS PROPRES
   ============================================================
   Contenu tiré du document du dépôt :
   • CPGE/MATRICE_VALEURS_ET_VECTEURS_PROPRES/
     MATRICE_VALEURS_ET_VECTEURS_PROPRES.html
     (« L'Affaire des Trois Colonnes — une enquête sur les
     vecteurs propres ») : définition Av = λv, l'invariant
     « somme des lignes », le polynôme caractéristique, valeurs
     propres d'une matrice triangulaire, trace = somme des valeurs
     propres, déterminant = produit, technique de recherche des
     vecteurs propres.

   AJOUTE : 4 générateurs (GEN), 1 fiche (FICHES
   « algebre-lineaire »), 4 éléments simples (GEN_INFO),
   1 notion (NOTIONS.splice avant « su-limites ») et 1 catégorie
   « 🔬 Algèbre linéaire (CPGE) » avant « Missions de synthèse ».
   ============================================================ */

/* ------------------------------------------------------------
   GÉNÉRATEURS — valeurs & vecteurs propres
   ------------------------------------------------------------ */
(() => {
  const uniq3 = (ans, cands) => {
    const out = [];
    for (let i = 0; i < cands.length && out.length < 3; i++) {
      const c = cands[i];
      if (c !== ans && c !== undefined && String(c) !== '' && out.indexOf(c) < 0) out.push(c);
    }
    return out;
  };
  const mat = (m) => `\\begin{pmatrix} ${m.map(r => r.join(' & ')).join(' \\\\ ')} \\end{pmatrix}`;

  /* ---------- 1. L'invariant « somme des lignes » ---------- */
  GEN.vpDefinition = () => {
    const s = R(2, 9);
    const rows = [];
    for (let i = 0; i < 3; i++) {
      const a = R(0, s), b = R(0, s - a);
      rows.push([a, b, s - a - b]);
    }
    const good = `${s}`;
    const wrongs = [`${s + 1}`, `${rows[0][0] + rows[1][1] + rows[2][2]}`, `${0}`];
    return QCM(
      `Soit \\(A = ${mat(rows)}\\) et \\(v = (1~;~1~;~1)\\).<br>On calcule \\(Av = (${rows[0][0] + rows[0][1] + rows[0][2]}~;~${rows[1][0] + rows[1][1] + rows[1][2]}~;~${rows[2][0] + rows[2][1] + rows[2][2]})\\).<br>Que vaut \\(\\lambda\\) tel que \\(Av = \\lambda v\\) ?`,
      M(good), uniq3(M(good), wrongs.map(w => M(w))), 1,
      EXPL(`\\(\\lambda\\) est une VALEUR PROPRE de \\(A\\) s'il existe un vecteur non nul \\(v\\) (VECTEUR PROPRE) tel que \\(Av = \\lambda v\\) : l'action de \\(A\\) sur \\(v\\) se réduit à une DILATATION de rapport \\(\\lambda\\).`,
        `Chaque ligne de \\(A\\) a pour somme \\(${s}\\) : multiplier par \\(v = (1~;~1~;~1)\\), c'est sommer chaque ligne. Donc \\(Av = (${s}~;~${s}~;~${s}) = ${s} \\cdot v\\) : \\(v\\) est vecteur propre associé à la valeur propre \\(\\lambda = ${s}\\).`,
        `Le piège : répondre la somme des coefficients DIAGONAUX (${rows[0][0] + rows[1][1] + rows[2][2]}, c'est la trace, un autre objet) ou croire que \\(\\lambda\\) doit être non nul (\\(\\lambda = 0\\) est une valeur propre parfaitement légitime quand \\(A\\) n'est pas inversible). Test réflexe : si toutes les lignes ont la même somme \\(s\\), alors \\(s\\) est valeur propre, de vecteur propre \\((1~;~1~;~1)\\).`));
  };

  /* ---------- 2. Matrice triangulaire : lire les valeurs propres ---------- */
  GEN.vpCaracteristique = () => {
    const a = R(1, 5), b = R(6, 9), c = R(-4, -1);
    const rows = [[a, R(1, 4), R(1, 4)], [0, b, R(1, 4)], [0, 0, c]];
    const good = `\\(\\{${a}~;~${b}~;~${c}\\}\\)`;
    const wrongs = [
      `\\(\\{${a + b + c}\\}\\)`,
      `\\(\\{${a}~;~${b}\\}\\)`,
      `\\(\\{${a + rows[0][1] + rows[0][2]}~;~${b}~;~${c}\\}\\)`
    ];
    return QCM(
      `Quelles sont les valeurs propres de la matrice triangulaire<br>\\(M = ${mat(rows)}\\) ?`,
      good, uniq3(good, wrongs), 1,
      EXPL(`Le polynôme caractéristique d'une matrice triangulaire se factorise immédiatement : \\(\\det(M - \\lambda I) = (d_1 - \\lambda)(d_2 - \\lambda)(d_3 - \\lambda)\\) où les \\(d_i\\) sont les coefficients DIAGONAUX. Ses racines sont les valeurs propres.`,
        `Ici \\(M\\) est triangulaire supérieure de diagonale \\((${a}~;~${b}~;~${c})\\) : les valeurs propres sont exactement \\(${a}\\), \\(${b}\\) et \\(${c}\\) — les coefficients hors-diagonale ne comptent PAS.`,
        `Le piège : inclure les coefficients au-dessus de la diagonale ou réduire la liste aux valeurs positives. Une valeur propre peut être NÉGATIVE, NULLE, voire complexe : sur \\(\\mathbb R\\), certaines matrices n'ont pas de valeurs propres réelles — c'est l'occasion de rappeler que le polynôme caractéristique peut ne pas se factoriser en racines réelles (il faudra passer par \\(\\mathbb C\\)).`));
  };

  /* ---------- 3. Trace & déterminant : somme et produit ---------- */
  GEN.vpTraceDet = () => {
    const l1 = R(1, 5);
    let l2 = R(2, 6);
    if (l2 === l1) l2++;
    const tr = l1 + l2, det = l1 * l2;
    const good = `somme \\(= ${tr}\\), produit \\(= ${det}\\)`;
    const wrongs = [
      `somme \\(= ${det}\\), produit \\(= ${tr}\\)`,
      `somme \\(= ${l1 * l2 + l1 + l2}\\), produit \\(= ${det}\\)`,
      `somme \\(= ${tr}\\), produit \\(= ${tr * det}\\)`
    ];
    return QCM(
      `Une matrice \\(2 \\times 2\\) admet les valeurs propres \\(\\lambda_1 = ${l1}\\) et \\(\\lambda_2 = ${l2}\\).<br>Que valent sa TRACE et son DÉTERMINANT ?`,
      good, uniq3(good, wrongs), 1,
      EXPL(`Deux invariants relient valeurs propres et coefficients : \\(\\text{tr}(A) = \\lambda_1 + \\lambda_2 + \\cdots + \\lambda_n\\) (la trace EST la somme des valeurs propres, avec multiplicité) et \\(\\det(A) = \\lambda_1 \\lambda_2 \\cdots \\lambda_n\\) (le déterminant est leur produit).`,
        `Ici : \\(\\text{tr} = ${l1} + ${l2} = ${tr}\\) et \\(\\det = ${l1} \\times ${l2} = ${det}\\). Vérification express : pour une \\(2 \\times 2\\), \\(\\lambda^2 - \\text{tr}(A)\\lambda + \\det(A) = 0\\) a pour racines \\(${l1}\\) et \\(${l2}\\).`,
        `Le piège : permuter les rôles (répondre somme = produit et inversement) ou additionner les produits. Conséquence utile : si une valeur propre est nulle, le déterminant est nul (matrice non inversible) — et la trace, elle, se lit sur la diagonale sans calcul de déterminant.`));
  };

  /* ---------- 4. Chercher un vecteur propre : (A − λI)v = 0 ---------- */
  GEN.vpVecteurs = () => {
    const l = R(2, 5);
    /* A = [[l+1, 1], [2, l]] : lignes de somme l+2 ... prenons A avec vp l et l+2 ? Simple : A = [[l,1],[0,l+2]] triangulaire, vecteur propre pour l : (1,0). */
    const good = `(1~;~0)`;
    const wrongs = [`(0~;~1)`, `(1~;~1)`, `(${l}~;~${l})`];
    const A = [[l, 1], [0, l + 2]];
    return QCM(
      `Soit \\(A = ${mat(A)}\\), de valeur propre \\(\\lambda = ${l}\\).<br>Un vecteur propre associé à \\(\\lambda = ${l}\\) est :`,
      M(good), uniq3(M(good), wrongs.map(w => M(w))), 1,
      EXPL(`Pour trouver les vecteurs propres associés à \\(\\lambda\\), on résout \\((A - \\lambda I)v = 0\\) : c'est un système LINÉAIRE HOMOGÈNE dont les solutions forment un sous-espace (le sous-espace propre).`,
        `Ici \\(A - ${l} I = ${mat([[0, 1], [0, 2]])}\\) : la première ligne impose \\(y = 0\\), la seconde confirme. Donc \\(v = (x~;~0)\\) pour tout \\(x \\neq 0\\) : le vecteur \\((1~;~0)\\) convient (et tous ses multiples non nuls).`,
        `Le piège : donner le vecteur NUL (par convention, un vecteur propre est NON NUL sinon \\(Av = \\lambda v\\) serait trivial), ou croire le vecteur propre unique : toute combinaison \\(t \\cdot v\\), \\(t \\neq 0\\), reste vecteur propre pour la même valeur — l'essentiel est la DIRECTION.`));
  };
})();

/* ------------------------------------------------------------
   FICHE — Algèbre linéaire
   ------------------------------------------------------------ */
Object.assign(FICHES, {
  'algebre-lineaire': { titre: '🔬 Valeurs & vecteurs propres', html: `
    <p><b>Définition :</b> \\(\\lambda\\) est valeur propre de \\(A\\) s'il existe \\(v \\neq 0\\) tel que \\(Av = \\lambda v\\) ; \\(v\\) est un vecteur propre : \\(A\\) agit sur lui par simple dilatation.</p>
    <p><b>Chercher les valeurs propres :</b> racines du polynôme caractéristique \\(\\det(A - \\lambda I)\\). Matrice triangulaire → valeurs propres = coefficients diagonaux. Réflexe : si toutes les lignes de \\(A\\) ont la même somme \\(s\\), alors \\(s\\) est valeur propre, de vecteur propre \\((1~;~1~;~\\dots)\\).</p>
    <p><b>Invariants :</b> la trace \\(\\text{tr}(A) = \\sum \\lambda_i\\) est la SOMME des valeurs propres, et le déterminant \\(\\det(A) = \\prod \\lambda_i\\) leur PRODUIT (avec multiplicité). Pour une \\(2 \\times 2\\) : \\(\\lambda^2 - \\text{tr}(A)\\lambda + \\det(A) = 0\\).</p>
    <p><b>Chercher les vecteurs propres :</b> résoudre \\((A - \\lambda I)v = 0\\) (système homogène, solutions = sous-espace propre). Le vecteur nul est exclu par convention ; les multiples non nuls d'un vecteur propre restent vecteurs propres.</p>` }
});

/* ------------------------------------------------------------
   ÉLÉMENTS SIMPLES
   ------------------------------------------------------------ */
Object.assign(GEN_INFO, {
  'vpDefinition':      { label: 'Av = λv : reconnaître un couple propre', fiches: ['algebre-lineaire'],
    rappel: `\\(Av = \\lambda v\\) avec \\(v \\neq 0\\) : \\(\\lambda\\) valeur propre, \\(v\\) vecteur propre. Somme des lignes constante \\(s \\Rightarrow (1\\dots 1)\\) est propre pour \\(s\\).` },
  'vpCaracteristique': { label: 'Matrice triangulaire : vp sur la diagonale', fiches: ['algebre-lineaire'],
    rappel: `Matrice triangulaire : le polynôme caractéristique se factorise sur la diagonale — valeurs propres = coefficients diagonaux.` },
  'vpTraceDet':        { label: 'Trace & déterminant : somme & produit', fiches: ['algebre-lineaire', 'calcul'],
    rappel: `\\(\\text{tr}(A) = \\sum \\lambda_i\\), \\(\\det(A) = \\prod \\lambda_i\\) : contrôle rapide sans recalculer le polynôme.` },
  'vpVecteurs':        { label: '(A − λI)v = 0 : sous-espace propre', fiches: ['algebre-lineaire'],
    rappel: `Vecteurs propres = solutions non nulles de \\((A - \\lambda I)v = 0\\) : un sous-espace de directions, pas un vecteur unique.` }
});

/* ============================================================
   1 NOTION NOUVELLE (→ 207 étages, avant les « limites »)
   ============================================================ */
const NOUVELLES_AL = [
  { id: 'al-vp', name: 'Valeurs propres & vecteurs propres', g: ['vpDefinition', 'vpCaracteristique', 'vpTraceDet', 'vpVecteurs'], family: 'red', prob: 0.4 }
];
(function () {
  const iLim = NOTIONS.findIndex(n => n.id === 'su-limites');
  if (iLim < 0) NOTIONS.push.apply(NOTIONS, NOUVELLES_AL);
  else NOTIONS.splice.apply(NOTIONS, [iLim, 0].concat(NOUVELLES_AL));
})();

/* ============================================================
   PROGRESSION : nouvelle catégorie « 🔬 Algèbre linéaire (CPGE) »
   insérée avant « Missions de synthèse ».
   ============================================================ */
(function () {
  const cat = {
    icon: '🔬',
    nom: 'Algèbre linéaire (CPGE)',
    subs: [{ nom: 'Valeurs & vecteurs propres', ids: ['al-vp'] }]
  };
  const iMis = PROG_CATS.findIndex(c => /Missions de synth/.test(c.nom || ''));
  if (iMis >= 0) PROG_CATS.splice(iMis, 0, cat);
  else PROG_CATS.push(cat);
})();

/* Formes 3D du nouvel étage. */
document.addEventListener('DOMContentLoaded', function () {
  try {
    FLOOR_SHAPES['al-vp'] = 'xgate';
  } catch (e) { /* 'root' */ }
});
