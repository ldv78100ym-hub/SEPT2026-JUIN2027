/* ============================================================
   11u. LIMITES DE FONCTIONS, CONTINUITÉ & THÉORÈME DES
   VALEURS INTERMÉDIAIRES
   ============================================================
   Contenu tiré du document du dépôt :
   • TG_MATHS_COMP/FONCTIONS/MATHS_COMP_S1-A-S3.html
     (sections « Limites de fonctions » : limites en l'infini,
     limites en un point, formes indéterminées, asymptotes,
     limites des fonctions de référence, théorèmes de croissance
     comparée ; « Continuité » : définition, théorème des valeurs
     intermédiaires et son corollaire d'existence d'une solution
     à f(x) = k).

   AJOUTE : 6 générateurs (GEN), 1 fiche (FICHES
   « limites-fonctions »), 6 éléments simples (GEN_INFO),
   2 notions (NOTIONS.splice avant « su-limites ») et 1
   sous-catégorie dans « Fonctions & lectures graphiques ».
   ============================================================ */

/* ------------------------------------------------------------
   GÉNÉRATEURS — limites, continuité, TVI
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

  /* ---------- 1. Limite en l'infini d'une fraction rationnelle ---------- */
  GEN.limFInfini = () => {
    const cas = pick([
      { f: `\\dfrac{3x^2 + x - 1}{x^2 + 2}`, texte: `\\(\\displaystyle \\lim_{x \\to +\\infty} \\dfrac{3x^2 + x - 1}{x^2 + 2}\\)`, good: `3`, exp: `les termes de plus haut degré imposent leur loi : \\(\\dfrac{3x^2}{x^2} \\to 3\\)` },
      { f: `\\dfrac{2x - 1}{x + 3}`, texte: `\\(\\displaystyle \\lim_{x \\to +\\infty} \\dfrac{2x - 1}{x + 3}\\)`, good: `2`, exp: `termes dominants : \\(\\dfrac{2x}{x} \\to 2\\)` },
      { f: `\\dfrac{x}{x^2 + 1}`, texte: `\\(\\displaystyle \\lim_{x \\to +\\infty} \\dfrac{x}{x^2 + 1}\\)`, good: `0`, exp: `le dénominateur de degré supérieur écrase le numérateur : \\(\\dfrac{x}{x^2} = \\dfrac{1}{x} \\to 0\\)` },
      { f: `\\dfrac{x^3 - 2x}{5x^2 + 1}`, texte: `\\(\\displaystyle \\lim_{x \\to +\\infty} \\dfrac{x^3 - 2x}{5x^2 + 1}\\)`, good: `+\\infty`, exp: `le numérateur de degré supérieur domine : \\(\\dfrac{x^3}{x^2} = \\dfrac{x}{5} \\to +\\infty\\)` }
    ]);
    const good = M(cas.good);
    const wrongs = [M(`+\\infty`), M(`0`), M(`-\\infty`)];
    const opts = uniq3(good, wrongs);
    return QCM(
      `Que vaut ${cas.texte} ?`,
      good, opts, 1,
      EXPL(`En \\(+\\infty\\), une fraction rationnelle se comporte comme le rapport de ses TERMES DOMINANTS (plus haut degré du numérateur sur plus haut degré du dénominateur).`,
        `Ici ${cas.exp}. Règle complète : mêmes degrés → rapport des coefficients dominants ; degré du haut plus grand → \\(\\pm\\infty\\) ; degré du bas plus grand → \\(0\\).`,
        `Le piège : « évaluer » brutalement en remplaçant \\(x\\) par un grand nombre sans factoriser, ou céder à la forme indéterminée \\(\\dfrac{\\infty}{\\infty}\\) : la factorisation par le terme dominant LEVE l'indétermination.`));
  };

  /* ---------- 2. Limites des fonctions de référence ---------- */
  GEN.limFReference = () => {
    const cas = pick([
      { texte: `\\(\\displaystyle \\lim_{x \\to +\\infty} \\dfrac{\\ln x}{x}\\)`, good: `0`, exp: `croissante comparée : toute puissance de \\(x\\) finit par dépasser le logarithme — \\(\\ln x\\) est « négligeable » devant \\(x\\)` },
      { texte: `\\(\\displaystyle \\lim_{x \\to +\\infty} \\dfrac{e^x}{x}\\)`, good: `+\\infty`, exp: `croissance comparée : l'exponentielle domine toute puissance de \\(x\\)` },
      { texte: `\\(\\displaystyle \\lim_{x \\to +\\infty} e^{-x}\\)`, good: `0`, exp: `\\(e^{-x} = \\dfrac{1}{e^x}\\) et \\(e^x \\to +\\infty\\) : l'inverse tend vers 0` },
      { texte: `\\(\\displaystyle \\lim_{x \\to 0^+} x \\ln x\\)`, good: `0`, exp: `forme indéterminée \\(0 \\times \\infty\\) levée par croissances comparées : \\(x\\) écrase \\(\\ln x\\) près de 0` }
    ]);
    const good = M(cas.good);
    const wrongs = [M(`+\\infty`), M(`1`), M(`-\\infty`)];
    return QCM(
      `Que vaut ${cas.texte} ?`,
      good, uniq3(good, wrongs), 1,
      EXPL(`Hiérarchie des croissances comparées en \\(+\\infty\\) : \\(\\ln x \\ll x^{a} \\ll b^{x}\\) (avec \\(a \\gt 0\\), \\(b \\gt 1\\)). Le logarithme est le plus lent, l'exponentielle la plus rapide.`,
        `Ici, ${cas.exp}.`,
        `Le piège : croire que \\(\\ln x\\) et \\(x\\) tendent pareil « puisque les deux montent vers \\(+\\infty\\) » — oui, mais pas à la même VITESSE : c'est le rapport qui décide de la limite. Même logique pour \\(x \\ln x\\) en \\(0^+\\) : les ordres de grandeur se classent, ils ne s'additionnent pas.`));
  };

  /* ---------- 3. Reconnaître une forme indéterminée ---------- */
  GEN.limFFormeIndeterminee = () => {
    const cas = pick([
      { texte: `\\(\\displaystyle \\lim_{x \\to +\\infty} \\left(x^2 - x\\right)\\)`, fi: `\\(+\\infty - \\infty\\)`, reponse: `OUI, c'est une forme indéterminée`, methode: `factoriser par \\(x^2\\) : \\(x^2\\left(1 - \\dfrac{1}{x}\\right) \\to +\\infty\\)` },
      { texte: `\\(\\displaystyle \\lim_{x \\to +\\infty} \\dfrac{x + 1}{x}\\)`, fi: `\\(\\dfrac{\\infty}{\\infty}\\)`, reponse: `OUI, c'est une forme indéterminée`, methode: `factoriser par \\(x\\) : le rapport des termes dominants donne 1` },
      { texte: `\\(\\displaystyle \\lim_{x \\to 2} \\dfrac{x^2 - 4}{x - 2}\\)`, fi: `\\(\\dfrac{0}{0}\\)`, reponse: `OUI, c'est une forme indéterminée`, methode: `factoriser : \\(\\dfrac{(x-2)(x+2)}{x-2} = x + 2 \\to 4\\)` },
      { texte: `\\(\\displaystyle \\lim_{x \\to +\\infty} \\left(x + \\dfrac{1}{x}\\right)\\)`, fi: `\\(+\\infty + 0\\)`, reponse: `NON, ce n'est pas une forme indéterminée`, methode: `somme directe : \\(+\\infty + 0 = +\\infty\\)` }
    ]);
    const good = cas.reponse;
    const wrongs = [
      cas.reponse.startsWith('OUI') ? `NON, ce n'est pas une forme indéterminée` : `OUI, c'est une forme indéterminée`,
      `impossible à savoir : il faut d'abord calculer la limite`,
      `c'est une forme indéterminée seulement si le résultat est infini`
    ];
    return QCM(
      `La limite ${cas.texte} : est-ce une forme indéterminée ?`,
      good, uniq3(good, wrongs), 1,
      EXPL(`Les formes indéterminées classiques : \\(+\\infty - \\infty\\), \\(\\dfrac{\\infty}{\\infty}\\), \\(\\dfrac{0}{0}\\), \\(0 \\times \\infty\\). Aucune conclusion automatique n'en découle : il faut TRANSFORMER l'expression (factorisation, quantité conjuguée, croissances comparées).`,
        `Ici la limite est de type ${cas.fi} : ${cas.reponse}. Pour la calculer, ${cas.methode}.`,
        `Le piège : appliquer les règles opératoires hors de leur domaine (\\(+\\infty + 0\\) n'est PAS indéterminé, \\(+\\infty \\times 2\\) non plus) ou croire que toute limite d'infinis est indéterminée. Diagnostiquer la forme AVANT de calculer, puis la lever par transformation : c'est la méthode systématique.`));
  };

  /* ---------- 4. Asymptotes déduites des limites ---------- */
  GEN.limFAsymptote = () => {
    const cas = pick([
      { texte: `\\(\\displaystyle\\lim_{x \\to +\\infty} f(x) = 3\\)`, good: `la droite d'équation \\(y = 3\\) est asymptote HORIZONTALE de \\(f\\) en \\(+\\infty\\)`,
        wr: [`la droite d'équation \\(x = 3\\) est asymptote VERTICALE de \\(f\\)`, `la droite \\(y = 3\\) est asymptote OBLIQUE de \\(f\\)`, `la courbe coupe forcément la droite \\(y = 3\\)`] },
      { texte: `\\(\\displaystyle\\lim_{x \\to 2^+} f(x) = +\\infty\\)`, good: `la droite d'équation \\(x = 2\\) est asymptote VERTICALE de \\(f\\)`,
        wr: [`la droite \\(y = 2\\) est asymptote horizontale`, `la droite \\(x = 2\\) est asymptote OBLIQUE`, `la fonction n'est pas définie et il n'y a pas d'asymptote`] },
      { texte: `\\(f(x) = \\dfrac{2x + 1}{x - 3}\\) au voisinage de \\(3^+\\)`, good: `la droite \\(x = 3\\) est asymptote VERTICALE (dénominateur nul en 3)`,
        wr: [`la droite \\(y = 2\\) est asymptote verticale`, `la droite \\(x = 3\\) est asymptote horizontale`, `il n'y a pas d'asymptote car le numérateur ne s'annule pas`] }
    ]);
    return QCM(
      `On sait que ${cas.texte}.<br>Quelle conclusion graphique en tirer ?`,
      cas.good, uniq3(cas.good, cas.wr), 1,
      EXPL(`Les asymptotes se lisent sur les limites : \\(\\lim f = L\\) en \\(\\pm\\infty\\) → asymptote HORIZONTALE \\(y = L\\) ; \\(\\lim f = \\pm\\infty\\) quand \\(x \\to a\\) → asymptote VERTICALE \\(x = a\\) ; \\(f(x) - (ax+b) \\to 0\\) → asymptote OBLIQUE.`,
        `Ici : ${cas.good}.`,
        `Le piège : confondre les équations \\(x = a\\) (verticale) et \\(y = L\\) (horizontale) — une droite « x = ... » est TOUJOURS verticale, « y = ... » toujours horizontale. Autre piège : croire qu'une asymptote interdit le contact ; une courbe PEUT couper son asymptote horizontale, elle ne fait que s'en approcher à l'infini.`));
  };

  /* ---------- 5. Théorème des valeurs intermédiaires ---------- */
  GEN.tviContinuite = () => {
    const cas = pick([
      { a: 1, fa: -3, b: 3, fb: 5, c: `l'équation \\(f(x) = 0\\) admet AU MOINS une solution dans \\([1~;~3]\\)`,
        wr: [`l'équation \\(f(x) = 0\\) admet EXACTEMENT une solution dans \\([1~;~3]\\)`, `l'équation \\(f(x) = 0\\) n'a aucune solution (f ne s'annule jamais)`, `le maximum de f vaut 5`] }
    ]);
    return QCM(
      `\\(f\\) est CONTINUE sur \\([1~;~3]\\), avec \\(f(1) = -3\\) et \\(f(3) = 5\\).<br>Que garantit le théorème des valeurs intermédiaires ?`,
      cas.c, uniq3(cas.c, cas.wr), 1,
      EXPL(`TVI : si \\(f\\) est continue sur \\([a~;~b]\\), alors \\(f\\) atteint toute valeur comprise entre \\(f(a)\\) et \\(f(b)\\). En particulier, si \\(f(a)\\) et \\(f(b)\\) sont de SIGNES OPPOSÉS, \\(f\\) s'annule au moins une fois.`,
        `Ici \\(f(1) = -3 \\lt 0 \\lt 5 = f(3)\\) : la valeur 0 est « entre » les deux images, donc \\(f(x) = 0\\) a au moins une solution dans \\([1~;~3]\\). Attention au couteau suisse du théorème : il faut CONTINUITÉ (sinon une « marche » peut sauter par-dessus 0) et les bornes dans le BON ordre.`,
        `Le piège : conclure à l'UNICITÉ. Le TVI pur garantit l'EXISTENCE, pas le nombre de solutions : la courbe peut très bien traverser l'axe plusieurs fois entre 1 et 3. Pour l'unicité, il faut en plus la STRICTE MONOTONIE (f strictement croissante ou décroissante sur l'intervalle).`));
  };

  /* ---------- 6. Corollaire : f(x) = k ---------- */
  GEN.tviCorollaire = () => {
    const cas = pick([
      { texte: `\\(f\\) continue et strictement croissante sur \\([0~;~10]\\), \\(f(0) = -2\\), \\(f(10) = 6\\)`, good: `l'équation \\(f(x) = 3\\) admet UNE UNIQUE solution dans \\([0~;~10]\\)`,
        wr: [`l'équation \\(f(x) = 3\\) peut avoir plusieurs solutions`, `aucune conclusion : 3 n'est pas entre -2 et 6`, `l'équation \\(f(x) = 3\\) n'a pas de solution car 3 > 0`] },
      { texte: `\\(g\\) continue et strictement décroissante sur \\([2~;~8]\\), \\(g(2) = 7\\), \\(g(8) = 1\\)`, good: `l'équation \\(g(x) = 4\\) admet UNE UNIQUE solution dans \\([2~;~8]\\)`,
        wr: [`l'équation \\(g(x) = 4\\) n'a pas de solution : g décroît`, `l'équation \\(g(x) = 4\\) a exactement deux solutions`, `on ne peut rien dire sans la formule de g`] }
    ]);
    return QCM(
      `Soit ${cas.texte}.<br>Que peut-on affirmer ?`,
      cas.good, uniq3(cas.good, cas.wr), 1,
      EXPL(`Corollaire du TVI : \\(f\\) continue et STRICTEMENT MONOTONE sur \\([a~;~b]\\) ; pour tout \\(k\\) compris entre \\(f(a)\\) et \\(f(b)\\), l'équation \\(f(x) = k\\) admet une UNIQUE solution. C'est ce corollaire qui justifie les encadrements par balayage / dichotomie de la calculatrice.`,
        `Ici la valeur visée est bien comprise entre les images aux bornes et la stricte monotonie interdit tout retour en arrière : une seule traversée du niveau \\(k\\), donc une unique solution.`,
        `Le piège : invoquer le TVI simple pour conclure à l'unicité — c'est la STRICTE MONOTONIE qui fournit l'unicité, le TVI seul ne donne que l'existence. Autre piège : oublier de VÉRIFIER que \\(k\\) est entre \\(f(a)\\) et \\(f(b)\\) : si \\(k\\) est hors de cet encadrement, aucune conclusion.`));
  };
})();

/* ------------------------------------------------------------
   FICHE — Limites de fonctions & continuité
   ------------------------------------------------------------ */
Object.assign(FICHES, {
  'limites-fonctions': { titre: '📏 Limites, continuité & TVI', html: `
    <p><b>Limites en l'infini d'une fraction rationnelle :</b> factoriser par le terme dominant. Mêmes degrés → rapport des coefficients ; degré du numérateur supérieur → \\(\\pm\\infty\\) ; degré du dénominateur supérieur → \\(0\\).</p>
    <p><b>Croissances comparées :</b> \\(\\ln x \\ll x^{a} \\ll e^{x}\\) en \\(+\\infty\\). Donc \\(\\dfrac{\\ln x}{x} \\to 0\\), \\(\\dfrac{e^{x}}{x} \\to +\\infty\\), \\(x \\ln x \\to 0\\) en \\(0^+\\).</p>
    <p><b>Formes indéterminées :</b> \\(+\\infty - \\infty\\), \\(\\dfrac{\\infty}{\\infty}\\), \\(\\dfrac{0}{0}\\), \\(0 \\times \\infty\\). Les lever par factorisation, quantité conjuguée ou croissances comparées.</p>
    <p><b>Asymptotes :</b> \\(\\lim_{x \\to \\pm\\infty} f(x) = L \\Rightarrow y = L\\) horizontale ; \\(\\lim_{x \\to a} f(x) = \\pm\\infty \\Rightarrow x = a\\) verticale ; \\(f(x) - (ax+b) \\to 0 \\Rightarrow y = ax + b\\) oblique.</p>
    <p><b>Continuité & théorème des valeurs intermédiaires (TVI) :</b> \\(f\\) continue sur \\([a~;~b]\\) atteint toute valeur entre \\(f(a)\\) et \\(f(b)\\) (existence d'une solution de \\(f(x) = k\\)). Corollaire avec stricte monotonie : existence ET unicité — fondement de la dichotomie.</p>` }
});

/* ------------------------------------------------------------
   ÉLÉMENTS SIMPLES
   ------------------------------------------------------------ */
Object.assign(GEN_INFO, {
  'limFInfini':          { label: "Limite en l'infini : termes dominants", fiches: ['limites-fonctions', 'suites'],
    rappel: `Factoriser par le plus haut degré : mêmes degrés → rapport des coefficients, sinon \\(\\pm\\infty\\) ou \\(0\\).` },
  'limFReference':       { label: 'Croissances comparées', fiches: ['limites-fonctions', 'fonctions'],
    rappel: `\\(\\ln x \\ll x^a \\ll e^x\\) : le rapport d'une couche à la suivante tend vers 0 (ou son inverse vers \\(+\\infty\\)).` },
  'limFFormeIndeterminee': { label: 'Diagnostiquer une forme indéterminée', fiches: ['limites-fonctions'],
    rappel: `\\(\\infty - \\infty\\), \\(\\dfrac{\\infty}{\\infty}\\), \\(\\dfrac{0}{0}\\), \\(0 \\times \\infty\\) : à lever par factorisation ou quantité conjuguée.` },
  'limFAsymptote':       { label: 'Asymptotes : lire les limites', fiches: ['limites-fonctions', 'fonctions'],
    rappel: `Limite finie en \\(\\pm\\infty\\) → horizontale ; infinie en \\(a\\) → verticale \\(x = a\\).` },
  'tviContinuite':       { label: "TVI : existence d'une solution", fiches: ['limites-fonctions', 'fonctions'],
    rappel: `Continue + valeurs de signes opposés → \\(f\\) s'annule au moins une fois (existence, PAS unicité).` },
  'tviCorollaire':       { label: 'TVI & monotonie : unicité', fiches: ['limites-fonctions', 'fonctions'],
    rappel: `Continue + STRICTEMENT monotone + \\(k\\) entre \\(f(a)\\) et \\(f(b)\\) → \\(f(x) = k\\) a une unique solution.` }
});

/* ============================================================
   2 NOTIONS NOUVELLES (→ 209 étages, avant les « limites »)
   ============================================================ */
const NOUVELLES_LIMF = [
  { id: 'lim-fonctions',  name: 'Limites de fonctions & asymptotes', g: ['limFInfini', 'limFReference', 'limFFormeIndeterminee', 'limFAsymptote'], family: 'green', prob: 0.5 },
  { id: 'continuite-tvi', name: 'Continuité & théorème des valeurs intermédiaires', g: ['tviContinuite', 'tviCorollaire'], family: 'green', prob: 0.5 }
];
(function () {
  const iLim = NOTIONS.findIndex(n => n.id === 'su-limites');
  if (iLim < 0) NOTIONS.push.apply(NOTIONS, NOUVELLES_LIMF);
  else NOTIONS.splice.apply(NOTIONS, [iLim, 0].concat(NOUVELLES_LIMF));
})();

/* ============================================================
   PROGRESSION : sous-catégorie dans « Fonctions & lectures
   graphiques ».
   ============================================================ */
(function () {
  const sub = { nom: 'Limites, continuité & TVI', ids: ['lim-fonctions', 'continuite-tvi'] };
  const cat = PROG_CATS.find(c => c.nom === 'Fonctions & lectures graphiques');
  if (cat) cat.subs.push(sub);
  else PROG_CATS.push({ icon: '📈', nom: 'Fonctions & lectures graphiques', subs: [sub] });
})();

/* Formes 3D des nouveaux étages. */
document.addEventListener('DOMContentLoaded', function () {
  try {
    FLOOR_SHAPES['lim-fonctions'] = 'arch';
    FLOOR_SHAPES['continuite-tvi'] = 'root';
  } catch (e) { /* 'stairs' */ }
});
