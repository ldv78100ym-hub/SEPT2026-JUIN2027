/* ============================================================
   11r. FONCTION INVERSE — DÉFINITION, VARIATIONS, ÉQUATIONS,
   ASYMPTOTES & APPLICATIONS PROFESSIONNELLES
   ============================================================
   Contenu tiré du document du dépôt :
   • T_STI2D/FONCTION-INVERSE/FONCTION-INVERSE.html (« La fonction
     inverse — Cours interactif » : rappels collège/seconde,
     définition, dérivée, tableau de variations, limites &
     asymptotes, application économique coût moyen / prix unitaire,
     combinaison avec les polynômes).

   AJOUTE : 4 générateurs (GEN), un complément de la fiche
   FICHES « fonctions », 4 éléments simples (GEN_INFO), 1 notion
   (NOTIONS.splice avant « su-limites ») et 1 sous-catégorie dans
   « Fonctions & lectures graphiques » — la tour compte donc
   201 étages (200 + 1).
   ============================================================ */

/* ------------------------------------------------------------
   GÉNÉRATEURS — fonction inverse
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

  /* ---------- 1. Image & antécédent par 1/x ---------- */
  GEN.fnInvImage = () => {
    const a = pick([2, 3, 4, 5, 10, 12]);
    const good = `\\dfrac{1}{${a}}`;
    const wrongs = [`${a}`, `-${good}`, `\\dfrac{1}{${a * a}}`];
    return QCM(
      `Soit \\(f(x) = \\dfrac{1}{x}\\).<br>Quelle est l'image de \\(${a}\\) par \\(f\\) ?`,
      M(good), uniq3(M(good), wrongs.map(w => M(w))), 1,
      EXPL(`La fonction inverse est définie sur \\(\\mathbb{R}^{*}\\) par \\(f(x) = \\dfrac{1}{x}\\) : l'image de \\(a\\) s'obtient en prenant son inverse (pas son opposé !).`,
        `On remplace : \\(f(${a}) = \\dfrac{1}{${a}}\\). L'antécédent de \\(${a}\\), lui, serait \\(\\dfrac{1}{${a}}\\) — prendre l'inverse est une involution : l'inverse de l'inverse redonne le nombre de départ.`,
        `Le piège : confondre inverse \\(\\left(\\dfrac{1}{a}\\right)\\) et opposé \\((-a)\\). Autre piège : \\(x = 0\\) n'a AUCUNE image — la fonction inverse n'y est pas définie (division par zéro interdite).`));
  };

  /* ---------- 2. Le piège des variations sur ℝ* ---------- */
  GEN.fnInvVariations = () => {
    const good = `FAUX : \\(f\\) est décroissante sur \\(-\\infty~;~0\\) et sur \\([0~;~+\\infty[\\), mais PAS sur \\(\\mathbb{R}^{*}\\) : \\(f(-1) = -1 \\lt f(1) = 1\\) alors que \\(-1 \\lt 1\\)`;
    const wrongs = [
      `VRAI : décroissante sur \\(\\mathbb{R}^{*}\\) comme sur chaque intervalle`,
      `FAUX : \\(f\\) est croissante sur \\(\\mathbb{R}^{*}\\)`,
      `VRAI : car \\(\\dfrac{1}{x}\\) diminue quand \\(x\\) augmente, partout sans exception`
    ];
    return QCM(
      `Un élève affirme : « \\(f(x) = \\dfrac{1}{x}\\) est décroissante sur son domaine \\(\\mathbb{R}^{*}\\) ». Vrai ou faux ?`,
      good, uniq3(good, wrongs), 1,
      EXPL(`La fonction inverse est décroissante sur \\(-\\infty~;~0\\) et sur \\([0~;~+\\infty[\\), MAIS on ne peut pas fusionner les deux intervalles : la stricte décroissance exige de comparer deux points quelconques de l'INTERVALLE ENTIER.`,
        `Contre-exemple : \\(-1 \\lt 1\\) mais \\(f(-1) = -1\\) et \\(f(1) = 1\\), donc \\(f(-1) \\lt f(1)\\) : l'ordre n'est pas inversé ici, la décroissance échoue sur l'ensemble réuni. Elle ne se vérifie qu'au sein de chaque intervalle séparé.`,
        `L'erreur classique : écrire « décroissante sur \\(\\mathbb{R}^{*}\\) » dans le tableau de variations. Le tableau doit présenter DEUX branches séparées par une double barre en 0 (valeur interdite), jamais un seul intervalle fusionné.`));
  };

  /* ---------- 3. Équations 1/x = a et coût moyen ---------- */
  GEN.fnInvEquation = () => {
    const variant = R(1, 2);
    if (variant === 1) {
      const p = R(2, 5), q = p + R(1, 3);
      const good = frac(q, p);
      const wrongs = [frac(p, q), `${p * q}`, `-${frac(q, p)}`];
      return QCM(
        `Résous dans \\(\\mathbb{R}^{*}\\) :<br>\\(\\dfrac{1}{x} = \\dfrac{${p}}{${q}}\\)`,
        M(good), uniq3(M(good), wrongs.map(w => M(w))), 1,
        EXPL(`Prendre l'inverse des deux membres : \\(\\dfrac{1}{x} = \\dfrac{${p}}{${q}} \\iff x = \\dfrac{${q}}{${p}}\\) — on ÉCHANGE numérateur et dénominateur.`,
          `Ici \\(x = \\dfrac{${q}}{${p}}\\). Vérification : \\(\\dfrac{1}{x} = \\dfrac{${p}}{${q}}\\) par construction de l'inverse.`,
          `Le piège : répondre \\(\\dfrac{${p}}{${q}}\\) en recopiant la fraction au lieu de l'inverser. L'équation \\(1/x = a\\) a TOUJOURS pour solution \\(x = 1/a\\) : l'inverse de l'inverse.`));
    }
    const c = pick([[12, 3], [24, 4], [36, 6], [60, 5]]);
    const good = `${c[1]}`;
    const wrongs = [`${c[0]}`, `${c[0] - c[1]}`, `${Math.round(c[0] / c[1] * 10) / 10}`];
    return QCM(
      `Une entreprise a des coûts fixes de ${c[0]} €.<br>Le coût moyen par pièce est \\(CM(q) = \\dfrac{${c[0]}}{q}\\) €.<br>À partir de combien de pièces le coût moyen passe-t-il sous ${c[1]} € ?`,
      M(good), uniq3(M(good), wrongs.map(w => M(w))), 1,
      EXPL(`Le coût moyen est une fonction inverse de la quantité : plus on produit, plus les coûts fixes se répartissent — c'est le phénomène des « économies d'échelle ».`,
        `On résout \\(\\dfrac{${c[0]}}{q} = ${c[1]}\\), soit \\(q = \\dfrac{${c[0]}}{${c[1]}} = ${c[1]}\\) : au-delà de ${c[1]} pièces, le coût moyen est SOUS ${c[1]} € (la fonction est décroissante sur son domaine).`,
        `Le piège : multiplier au lieu d'inverser, ou oublier le sens de variation : la question n'est pas « quand atteint-on ${c[1]} € » mais « quand passe-t-on SOUS ${c[1]} € » — la décroissance inverse le sens de l'inégalité.`));
  };

  /* ---------- 4. Courbe, asymptotes & allure ---------- */
  GEN.fnInvAsymptote = () => {
    const good = `l'axe des ordonnées \\(x = 0\\) (asymptote verticale) et l'axe des abscisses \\(y = 0\\) (asymptote horizontale)`;
    const wrongs = [
      `l'axe des ordonnées seul : pas d'asymptote horizontale`,
      `les droites \\(y = x\\) et \\(y = -x\\) (bissectrices)`,
      `aucune asymptote : la courbe traverse les deux axes`
    ];
    return QCM(
      `Quelles sont les asymptotes de l'hyperbole d'équation \\(y = \\dfrac{1}{x}\\) ?`,
      good, uniq3(good, wrongs), 1,
      EXPL(`En \\(|x| \\to +\\infty\\), \\(1/x \\to 0\\) : l'axe des abscisses est asymptote HORIZONTALE. En \\(x \\to 0^{\\pm}\\), \\(|1/x| \\to +\\infty\\) : l'axe des ordonnées est asymptote VERTICALE.`,
        `La courbe s'écrase donc vers les deux axes sans jamais les toucher : deux branches, une dans chaque quadrant où le signe de \\(y\\) suit le signe de \\(x\\) (quadrants I et III).`,
        `Le piège : croire que la courbe « traverse » l'origine ou qu'il y a un trou comblé. La double barre en 0 du tableau de variations correspond à l'asymptote verticale : la valeur interdite n'est jamais rattrapée, même pas « un petit peu ».`));
  };
})();

/* ------------------------------------------------------------
   FICHE — complément « fonctions » pour la fonction inverse
   ------------------------------------------------------------ */
(function () {
  const plus = `
    <hr>
    <p><b>La fonction inverse :</b> \\(f(x) = \\dfrac{1}{x}\\), définie sur \\(\\mathbb{R}^{*}\\) (jamais en 0). Elle est décroissante sur \\(-\\infty~;~0\\) ET séparément sur \\([0~;~+\\infty[\\) — jamais sur \\(\\mathbb{R}^{*}\\) entier (contre-exemple : \\(f(-1) = -1 \\lt f(1) = 1\\)).</p>
    <p><b>Asymptotes :</b> \\(y = 0\\) en \\(\\pm\\infty\\) (horizontale) et \\(x = 0\\) (verticale, valeur interdite). La courbe est une hyperbole à deux branches (quadrants I et III).</p>
    <p><b>Équations :</b> \\(\\dfrac{1}{x} = a \\iff x = \\dfrac{1}{a}\\) (pour \\(a \\neq 0\\)). Applications professionnelles : coût moyen \\(CM(q) = \\dfrac{C_{fixes}}{q}\\), vitesse moyenne, productivité — toute grandeur « divisée par » est une fonction inverse.</p>`;
  if (FICHES['fonctions'] && FICHES['fonctions'].html) FICHES['fonctions'].html += plus;
})();

/* ------------------------------------------------------------
   ÉLÉMENTS SIMPLES : libellé + rappel + fiches des 4 générateurs
   ------------------------------------------------------------ */
Object.assign(GEN_INFO, {
  'fnInvImage':       { label: 'Fonction inverse : image & antécédent', fiches: ['fonctions'],
    rappel: `\\(f(x) = \\dfrac{1}{x}\\) : l'image de \\(a\\) est \\(\\dfrac{1}{a}\\) — l'inverse, pas l'opposé.` },
  'fnInvVariations':  { label: 'Décroissante sur… mais pas sur ℝ*', fiches: ['fonctions'],
    rappel: `Décroissante sur \\(-\\infty~;~0\\) et sur \\([0~;~+\\infty[\\), jamais sur \\(\\mathbb{R}^{*}\\) : \\(f(-1) \\lt f(1)\\) brise la décroissance globale.` },
  'fnInvEquation':   { label: 'Équation 1/x = a & coût moyen', fiches: ['fonctions', 'droites-plan'],
    rappel: `\\(\\dfrac{1}{x} = a \\iff x = \\dfrac{1}{a}\\) ; coût moyen \\(CM(q) = C/q\\) : économies d'échelle.` },
  'fnInvAsymptote':  { label: 'Hyperbole & asymptotes de 1/x', fiches: ['fonctions'],
    rappel: `Asymptotes \\(y = 0\\) (horizontale) et \\(x = 0\\) (verticale) : la courbe s'approche des axes sans les toucher.` }
});

/* ============================================================
   1 NOTION NOUVELLE (→ 201 étages, avant les « limites »)
   ============================================================ */
const NOUVELLES_INV = [
  { id: 'fn-inverse', name: 'Fonction inverse : variations & asymptotes', g: ['fnInvImage', 'fnInvVariations', 'fnInvEquation', 'fnInvAsymptote'], family: 'teal', prob: 0.5 }
];
(function () {
  const iLim = NOTIONS.findIndex(n => n.id === 'su-limites');
  if (iLim < 0) NOTIONS.push.apply(NOTIONS, NOUVELLES_INV);
  else NOTIONS.splice.apply(NOTIONS, [iLim, 0].concat(NOUVELLES_INV));
})();

/* ============================================================
   PROGRESSION : 1 sous-catégorie « La fonction inverse » dans
   « Fonctions & lectures graphiques » (volet références).
   ============================================================ */
(function () {
  const cat = PROG_CATS.find(c => c.nom === 'Fonctions & lectures graphiques');
  const sub = { nom: 'La fonction inverse', ids: ['fn-inverse'] };
  if (cat) {
    const iRef = cat.subs.findIndex(s => s.nom === 'Affines & fonctions de référence');
    if (iRef >= 0) cat.subs.splice(iRef + 1, 0, sub); else cat.subs.push(sub);
  } else PROG_CATS.push({ icon: '📈', nom: 'Fonctions & lectures graphiques', subs: [sub] });
})();

/* Formes 3D des nouveaux étages. */
document.addEventListener('DOMContentLoaded', function () {
  try { FLOOR_SHAPES['fn-inverse'] = 'hourglass'; } catch (e) { /* 'box' */ }
});
