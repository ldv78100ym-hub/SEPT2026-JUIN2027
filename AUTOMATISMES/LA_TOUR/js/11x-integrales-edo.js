/* ============================================================
   11x. INTÉGRATION, VOLUMES DE RÉVOLUTION & ÉQUATIONS DIFFÉRENTIELLES
   ============================================================ */
   /* ------------------------------------------------------------
   Contenu issu de l'AUDIT DU DÉPÔT (racine GitHub) : notions
   abordées dans le dépôt mais absentes de la tour, désormais
   couvertes.
   Sources :
   • STS_BIO_AC/ANNALES (BTS groupement D, 2000-2026) : intégrales
     et aires, propriété de linéarité, intégration par changement
     de variable, volumes de révolution, équations différentielles
     du 1er ordre (recherche de particulière, problème de Cauchy),
     ajustements linéaires par transformation (log, logistique) ;
   • PROGRESSIONS_CLASSES/PROGRESSION_STS_BIO-AC_2 (tableau des
     contenus : intégrale définie, valeur moyenne, primitive et
     résolution d'équations différentielles y' = a y + b).

   AJOUTE : 11 générateurs (GEN), 2 fiches (FICHES), 11 éléments
   simples (GEN_INFO), 7 notions (NOTIONS.splice avant
   « su-limites ») et 2 sous-catégories (« Dérivation, primitives
   & Euler » et « Exponentielles & logarithmes »). Niveaux (11v) :
   edo-lineaire & edo-cauchy en Tle, le reste en CPGE.
   ============================================================ */

/* ------------------------------------------------------------
   GÉNÉRATEURS — intégration, volumes & EDO
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

  /* ---------- 1. Intégrale : approche & aire (Riemann) ---------- */
  GEN.riemannAire = () => {
    const cas = pick([
      { f: 'x', a: '0', b: '3', aire: `\\dfrac{9}{2}` },
      { f: 'x^2', a: '0', b: '2', aire: `\\dfrac{8}{3}` },
      { f: '2x + 1', a: '0', b: '3', aire: `12` }
    ]);
    const good = M(cas.aire);
    const wrongs = [M(cas.b), M(cas.a), M('0')];
    return QCM(
      `Que représente géométriquement \\(\\int_{${cas.a}}^{${cas.b}} f(x)\\,\\mathrm{d}x\\) pour \\(f(x) = ${cas.f}\\) (positive) ?`,
      good, uniq3(good, wrongs), 1,
      EXPL(`L'intégrale définie de \\(f\\) sur \\([a~;~b]\\) est l'AIRE algébrique entre la courbe et l'axe des abscisses. On l'approche par des rectangles de plus en plus fins (sommes de Riemann) : quand le pas tend vers 0, la somme converge vers l'aire exacte.`,
        `Ici \\(\\int_{${cas.a}}^{${cas.b}} (${cas.f})\\,\\mathrm{d}x = ${cas.aire}\\) (calcul avec la primitive, ou aire de la zone sous la courbe).`,
        `Le piège : oublier que l'aire est ALGÉBRIQUE — sous l'axe, l'intégrale est NÉGATIVE ; ou confondre l'intégrale avec la valeur \\(f(b)\\).`));
  };

  /* ---------- 2. Linéarité & Chasles ---------- */
  GEN.integChasles = () => {
    const cas = pick([
      { q: `Que vaut \\(\\int_0^4 f(x)\\,\\mathrm{d}x\\) sachant \\(\\int_0^2 f = 3\\) et \\(\\int_2^4 f = 5\\) ?`, good: '8', wr: ['2', '15', '6'],
        exp: `la relation de CHASLES « colle » les deux tranches : 3 + 5 = 8` },
      { q: `Sachant \\(\\int_a^b f = 7\\), que vaut \\(\\int_b^a f\\) ?`, good: '-7', wr: ['7', '0', '14'],
        exp: `ÉCHANGER les bornes CHANGE le signe : parcourir l'intervalle « à l'envers » oppose l'intégrale` },
      { q: `Que vaut \\(\\int_0^3 2f(x)\\,\\mathrm{d}x\\) si \\(\\int_0^3 f = 4\\) ?`, good: '8', wr: ['4', '2', '12'],
        exp: `la linéarité SORT la constante : 2 × 4 = 8` },
      { q: `Que vaut \\(\\int_1^2 (f + g)\\) si \\(\\int_1^2 f = 2\\) et \\(\\int_1^2 g = 5\\) ?`, good: '7', wr: ['10', '3', '2{,}5'],
        exp: `linéarité pour la SOMME : l'intégrale d'une somme est la somme des intégrales` }
    ]);
    const good = M(cas.good);
    const wrongs = cas.wr.map(w => M(w));
    return QCM(cas.q, good, uniq3(good, wrongs), 1,
      EXPL(`Deux propriétés clés : LINÉARITÉ — \\(\\int (\\alpha f + \\beta g) = \\alpha\\int f + \\beta\\int g\\) ; et RELATION DE CHASLES — \\(\\int_a^b f + \\int_b^c f = \\int_a^c f\\) (on découpe l'intervalle). Attention aussi : \\(\\int_b^a f = -\\int_a^b f\\) et \\(\\int_a^a f = 0\\).`,
        `Ici, ${cas.exp}.`,
        `Le piège : additionner des aires de signes opposés sans regarder la position des bornes, ou « coller » des intégrales dont les bornes ne se raccordent pas.`));
  };

  /* ---------- 3. Valeur moyenne ---------- */
  GEN.integTfaVm = () => {
    const cas = pick([
      { f: 'x', a: '0', b: '4', vm: '2', wr: ['8', '4', '1'] },
      { f: 'x^2', a: '0', b: '3', vm: '3', wr: ['9', '27', '1'] },
      { f: '3', a: '1', b: '5', vm: '3', wr: ['12', '15', '1'] }
    ]);
    const good = M(cas.vm);
    const wrongs = cas.wr.map(w => M(w));
    return QCM(
      `Quelle est la valeur moyenne de \\(f(x) = ${cas.f}\\) sur \\([${cas.a}~;~${cas.b}]\\) ?`,
      good, uniq3(good, wrongs), 1,
      EXPL(`Valeur moyenne : \\(\\mu = \\dfrac{1}{b - a}\\int_a^b f(x)\\,\\mathrm{d}x\\) — la hauteur du rectangle qui a la MÊME aire que la zone sous la courbe. Le théorème de la moyenne garantit qu'un point \\(c\\) réalise \\(f(c) = \\mu\\) si \\(f\\) est continue.`,
        `Ici : \\(\\mu = \\dfrac{1}{${cas.b} - ${cas.a}}\\int_{${cas.a}}^{${cas.b}} (${cas.f})\\,\\mathrm{d}x = ${cas.vm}\\).`,
        `Le piège : oublier la division par \\(b - a\\) (on donne l'aire au lieu de la moyenne) ; ou « moyenner » \\(f(a)\\) et \\(f(b)\\) — la moyenne se calcule sur TOUT l'intervalle, pas aux seules bornes.`));
  };

  /* ---------- 4. Changement de variable ---------- */
  GEN.integSubstitution = () => {
    const cas2 = pick([
      { q: `Pour calculer \\(\\int (2x + 1)^5\\,\\mathrm{d}x\\), le changement de variable adapté est…`, good: `u = 2x + 1`, wr: [`u = x^5`, `u = 2x`, `u = (2x+1)^4`],
        exp: `poser \\(u = 2x+1\\) rend l'intégrale immédiate : \\(\\int u^5\\,\\frac{\\mathrm{d}u}{2} = \\frac{u^6}{12}\\)` },
      { q: `En posant \\(u = 2x + 1\\), \\(\\mathrm{d}x\\) devient…`, good: `\\dfrac{\\mathrm{d}u}{2}`, wr: [`\\mathrm{d}u`, `2\\,\\mathrm{d}u`, `\\mathrm{d}u^2`],
        exp: `\\(u = 2x + 1 \\Rightarrow \\mathrm{d}u = 2\\,\\mathrm{d}x \\Rightarrow \\mathrm{d}x = \\mathrm{d}u/2\\)` },
      { q: `Quelle primitive de \\(x e^{x^2}\\) obtient-on avec \\(u = x^2\\) ?`, good: `\\dfrac{1}{2}e^{x^2}`, wr: [`e^{x^2}`, `2x e^{x^2}`, `\\dfrac{x^3}{3}e^{x^2}`],
        exp: `\\(\\mathrm{d}u = 2x\\,\\mathrm{d}x\\) fournit le \\(x\\) manquant : \\(\\int x e^{x^2}\\mathrm{d}x = \\frac{1}{2}\\int e^u\\mathrm{d}u = \\frac{1}{2}e^{x^2}\\)` }
    ]);
    const good = M(cas2.good);
    const wrongs = cas2.wr.map(w => M(w));
    return QCM(cas2.q, good, uniq3(good, wrongs), 1,
      EXPL(`Changement de variable : poser \\(u = \\varphi(x)\\), remplacer \\(\\mathrm{d}x\\) par \\(\\mathrm{d}u/\\varphi'(x)\\), intégrer en \\(u\\), puis REVENIR en \\(x\\). Il sert à FAIRE APPARAÎTRE la dérivée de l'expression intérieure — c'est la « dérivée composée » à l'envers.`,
        `Ici, ${cas2.exp}.`,
        `Le piège : remplacer \\(\\mathrm{d}x\\) par \\(\\mathrm{d}u\\) sans le facteur \\(\\varphi'(x)\\) ; ou oublier de revenir à la variable \\(x\\) en fin de calcul (une primitive se donne à constante près : l'intégrale de \\(u'(x)e^{u(x)}\\) donne \\(e^{u(x)}\\), et celle de \\(1/(2x+1)\\) donne \\(\\ln(2x+1)\\) à constante près).`));
  };

  /* ---------- 5. Volume de révolution ---------- */
  GEN.volumeRevolution = () => {
    const cas = pick([
      { f: 'x', a: '0', b: '3', good: `9\\pi`, wr: [`27\\pi`, `3\\pi`, `\\dfrac{81\\pi}{2}`] },
      { f: '2', a: '0', b: '5', good: `20\\pi`, wr: [`50\\pi`, `10\\pi`, `25\\pi`] },
      { f: '\\sqrt{x}', a: '0', b: '4', good: `8\\pi`, wr: [`16\\pi`, `4\\pi`, `32\\pi`] }
    ]);
    const good = M(cas.good);
    const wrongs = cas.wr.map(w => M(w));
    return QCM(
      `Quel est le volume du solide de révolution engendré par la rotation de la courbe \\(y = ${cas.f}\\) autour de l'axe des abscisses, entre \\(x = ${cas.a}\\) et \\(x = ${cas.b}\\) ?`,
      good, uniq3(good, wrongs), 1,
      EXPL(`On empile des disques perpendiculaires à l'axe : au point \\(x\\), le disque a pour rayon \\(f(x)\\) et volume élémentaire \\(\\pi f(x)^2\\,\\mathrm{d}x\\). D'où \\(V = \\pi\\int_a^b f(x)^2\\,\\mathrm{d}x\\).`,
        `Ici : \\(V = \\pi\\int_{${cas.a}}^{${cas.b}} (${cas.f})^2\\,\\mathrm{d}x = ${cas.good}\\).`,
        `Le piège : intégrer \\(f\\) au lieu de \\(f^2\\) (on obtiendrait une aire, pas un volume) ; ou oublier le facteur \\(\\pi\\) qui vient de l'aire du disque.`));
  };

  /* ---------- 6. Ajustement par transformation ---------- */
  GEN.ajustLinLog = () => {
    const cas = pick([
      { q: `Pour linéariser \\(y = A e^{Bt}\\), on pose…`, good: `\\(Y = \\ln y\\), d'où \\(Y = \\ln A + Bt\\)`, wr: [`\\(Y = y^2\\), d'où \\(Y = A + Bt\\)`, `\\(Y = 1/y\\), d'où \\(Y = A + B/t\\)`, `\\(Y = \\sqrt{y}\\), d'où \\(Y = A\\sqrt{B}\\,t\\)`],
        exp: `le logarithme transforme l'exponentielle en droite : \\(\\ln y = \\ln A + Bt\\)` },
      { q: `Pour linéariser \\(y = a t^n\\) (loi de puissance), on pose…`, good: `\\(Y = \\ln y\\) et \\(T = \\ln t\\), d'où \\(Y = \\ln a + nT\\)`, wr: [`\\(Y = y/t\\) et \\(T = t\\)`, `\\(Y = e^y\\) et \\(T = nt\\)`, `\\(Y = ny\\) et \\(T = t^n\\)`],
        exp: `en logs, \\(\\ln y = \\ln a + n\\ln t\\) : droite de pente \\(n\\) dans le repère (ln t, ln y)` },
      { q: `Un ajustement exponentiel sur \\((t~;~\\ln y)\\) donne \\(\\ln y = 0{,}3t + 2\\). Quel modèle pour \\(y\\) ?`, good: `y = e^{2} e^{0{,}3t} \\approx 7{,}4 \\times (1{,}35)^t`, wr: [`y = 2 + 0{,}3t`, `y = 0{,}3 \\times 2^t`, `y = 2t + 0{,}3`],
        exp: `on « dé-linéarise » : \\(y = e^{2}e^{0{,}3t}\\), soit un modèle exponentiel de coefficient \\(e^{0{,}3} \\approx 1{,}35\\)` }
    ]);
    const good = M(cas.good);
    const wrongs = cas.wr.map(w => M(w));
    return QCM(cas.q, good, uniq3(good, wrongs), 1,
      EXPL(`Quand le nuage est incurvé, on TRANSFORME les données pour retomber sur une droite : exponentielle \\(y = Ae^{Bt} \\to \\ln y = \\ln A + Bt\\) ; loi de puissance \\(y = at^n \\to \\ln y = \\ln a + n\\ln t\\). On ajuste la droite par moindres carrés, puis on REVIENT au modèle d'origine (d'où la croissance exponentielle des populations ou des valeurs).`,
        `Ici, ${cas.exp}.`,
        `Le piège : ajuster directement une droite sur des données exponentielles (le modèle sous-estime les extrêmes), ou oublier de dé-transformer les coefficients après l'ajustement.`));
  };

  /* ---------- 7. Modèle logistique ---------- */
  GEN.modeleLogistique = () => {
    const cas = pick([
      { K: '1000', r: `0{,}5`, q: `Quelle est la capacité maximale du modèle logistique \\(y' = r y (1 - y/K)\\) avec \\(K = 1000\\) et \\(r = 0{,}5\\) ?`, good: `1000`, wr: [`0{,}5`, `500`, `\\infty`], exp: `\\(y\\) plafonne à \\(K = 1000\\) : la croissance ralentit près de la capacité` },
      { q: `Au DÉBUT d'une croissance logistique (\\(y\\) petit), le modèle se comporte comme…`, good: `une exponentielle \\(y' \\approx r y\\)`, wr: [`une droite \\(y' \\approx r\\)`, `une décroissance \\(y' \\approx -ry\\)`, `une constante \\(y' = 0\\)`], exp: `si \\(y \\ll K\\), le facteur \\(1 - y/K \\approx 1\\) disparaît : \\(y' \\approx ry\\)` },
      { q: `Pour \\(y = K/2\\) ( milieu de la courbe logistique), la vitesse \\(y'\\) est…`, good: `maximale`, wr: [`nulle`, `négative`, `divisée par 4`], exp: `le produit \\(y(1 - y/K)\\) est maximal en \\(K/2\\) : c'est le point d'inflexion` }
    ]);
    const good = M(cas.good);
    const wrongs = cas.wr.map(w => M(w));
    return QCM(cas.q, good, uniq3(good, wrongs), 1,
      EXPL(`Le modèle logistique \\(y' = r y\\left(1 - \\dfrac{y}{K}\\right)\\) corrige l'exponentielle : tant que \\(y\\) est petit, \\(y' \\approx ry\\) (explosion) ; quand \\(y\\) approche \\(K\\), le frein \\((1 - y/K)\\) annule la croissance. La courbe en S plafonne à \\(K\\) (capacité d'accueil), avec un point d'inflexion en \\(K/2\\) où la vitesse est maximale.`,
        `Ici, ${cas.exp}.`,
        `Le piège : extrapoler un ajustement EXPONENTIEL au-delà de la zone observée (population limitée par les ressources) ; ou chercher la vitesse maximale à \\(y = K\\) — elle y est NULLE.`));
  };

  /* ---------- 8. EDO linéaire 1er ordre : solution générale ---------- */
  GEN.edoLineaire = () => {
    const cas = pick([
      { eq: `y' = 2y`, good: `y = C e^{2x}`, wr: [`y = 2x + C`, `y = e^{2x} + C`, `y = C e^{-2x}`], exp: `\\(y'/y = 2\\) donc \\(\\ln y = 2x + c\\), soit \\(y = Ce^{2x}\\)` },
      { eq: `y' + 3y = 0`, good: `y = C e^{-3x}`, wr: [`y = C e^{3x}`, `y = -3x + C`, `y = 3 + Ce^{-x}`], exp: `\\(y' = -3y\\) : décroissance exponentielle de taux 3` },
      { eq: `y' = -0{,}5y`, good: `y = C e^{-0{,}5x}`, wr: [`y = C e^{0{,}5x}`, `y = -0{,}5x + C`, `y = Ce^{2x}`], exp: `taux \\(-0{,}5\\) : \\(y = Ce^{-0{,}5x}\\), solution exponentiellement décroissante` }
    ]);
    const good = M(cas.good);
    const wrongs = cas.wr.map(w => M(w));
    return QCM(
      `Quelle est la solution générale de l'équation différentielle ${cas.eq} ?`,
      good, uniq3(good, wrongs), 1,
      EXPL(`Pour \\(y' = ay\\) (homogène, 1er ordre) : les solutions sont \\(y = Ce^{ax}\\), une EXPONENTIELLE de taux \\(a\\). Si \\(a \\lt 0\\), décroissance (refroidissement, décharge) ; si \\(a \\gt 0\\), explosion. La constante \\(C\\) est fixée par la condition initiale.`,
        `Ici, ${cas.exp}.`,
        `Le piège : écrire \\(e^{ax} + C\\) (l'exponentielle ne supporte pas de constante ADDITIONNÉE — seule la multiplicative \\(C\\) convient), ou donner une solution AFFINE pour une équation exponentielle.`));
  };

  /* ---------- 9. EDO avec second membre : recherche d'une particulière ---------- */
  GEN.edoParticuliere = () => {
    const cas = pick([
      { eq: `y' = 2y + 6`, good: `y = -3`, wr: [`y = 3`, `y = 6x`, `y = 2x + 3`], exp: `une solution constante \\(y = k\\) doit vérifier \\(0 = 2k + 6\\), donc \\(k = -3\\)` },
      { eq: `y' + y = 4`, good: `y = 4`, wr: [`y = -4`, `y = 4x`, `y = e^{4x}`], exp: `\\(y\\) constante : \\(0 + k = 4\\) donne \\(k = 4\\)` },
      { eq: `y' - y = 2`, good: `y = -2`, wr: [`y = 2`, `y = 2x`, `y = e^{2x}`], exp: `\\(0 - k = 2\\) donc \\(k = -2\\)` }
    ]);
    const good = M(cas.good);
    const wrongs = cas.wr.map(w => M(w));
    return QCM(
      `Quelle est une solution particulière de l'équation ${cas.eq} ?`,
      good, uniq3(good, wrongs), 1,
      EXPL(`Pour \\(y' = ay + b\\) : la solution générale est \\(y = Ce^{ax} + y_p\\), somme de la solution de l'équation SANS second membre et d'une solution PARTICULIÈRE. Quand \\(b\\) est constant, on cherche \\(y_p\\) constante : \\(y' = 0\\), il reste \\(0 = ay_p + b\\), soit \\(y_p = -b/a\\) — le point d'équilibre.`,
        `Ici, ${cas.exp}.`,
        `Le piège : additionner la particulière à la générale sous forme \\(y = Ce^{ax} + y_p\\) mais donner \\(y_p\\) avec le MAUVAIS signe ; ou chercher \\(y_p\\) dans les exponentielles alors qu'une constante suffit.`));
  };

  /* ---------- 10. Problème de Cauchy (condition initiale) ---------- */
  GEN.edoCauchy = () => {
    const cas = pick([
      { eq: `y' = 2y`, x0: `0`, y0: `3`, good: `y = 3e^{2x}`, wr: [`y = 2e^{3x}`, `y = 3 + 2x`, `y = e^{2x}`], exp: `\\(y = Ce^{2x}\\) et \\(y(0) = C = 3\\)` },
      { eq: `y' = -y`, x0: `0`, y0: `5`, good: `y = 5e^{-x}`, wr: [`y = -5e^{x}`, `y = 5 - x`, `y = e^{-5x}`], exp: `\\(y = Ce^{-x}\\) avec \\(C = y(0) = 5\\)` },
      { eq: `y' = y`, x0: `1`, y0: `e`, good: `y = e^{x}`, wr: [`y = e^{-x}`, `y = 1 + e(x-1)`, `y = e\\,x`], exp: `\\(y = Ce^{x}\\) et \\(y(1) = Ce = e\\), donc \\(C = 1\\)` }
    ]);
    const good = M(cas.good);
    const wrongs = cas.wr.map(w => M(w));
    return QCM(
      `Solution du problème de Cauchy : ${cas.eq} avec \\(y(${cas.x0}) = ${cas.y0}\\) ?`,
      good, uniq3(good, wrongs), 1,
      EXPL(`Le problème de Cauchy = équation différentielle + CONDITION INITIALE. La solution générale \\(y = Ce^{ax}\\) contient une constante : c'est la condition initiale qui la détermine, donnant LA solution unique (théorème de Cauchy-Lipschitz).`,
        `Ici, ${cas.exp}.`,
        `Le piège : donner la solution générale (avec \\(C\\)) alors qu'on demande la solution du problème : \\(C\\) doit être CALCULÉ ; ou évaluer \\(y(x_0)\\) après avoir déjà fixé \\(C\\) au hasard.`));
  };

  /* ---------- 11. EDO à variables séparables ---------- */
  GEN.edoSeparables = () => {
    const cas = pick([
      { eq: `y' = 2xy`, good: `\\ln|y| = x^2 + c`, wr: [`y = x^2 + c`, `y' = x^2 y`, `y = e^{-x^2}`], exp: `\\(\\frac{\\mathrm{d}y}{y} = 2x\\,\\mathrm{d}x\\) s'intègre en \\(\\ln|y| = x^2 + c\\)` },
      { eq: `y' = \\dfrac{x}{y}`, good: `\\dfrac{y^2}{2} = \\dfrac{x^2}{2} + c`, wr: [`y = x + c`, `y^2 = x^2`, `y = \\ln x + c`], exp: `\\(y\\,\\mathrm{d}y = x\\,\\mathrm{d}x\\) : chaque côté s'intègre séparément` },
      { eq: `y' = e^{-x}y^2`, good: `-\\dfrac{1}{y} = -e^{-x} + c`, wr: [`y = e^{-x} + c`, `y = \\frac{e^{-x}}{2}`, `y = -x e^{-x}`], exp: `\\(\\frac{\\mathrm{d}y}{y^2} = e^{-x}\\mathrm{d}x\\) donne \\(-1/y = -e^{-x} + c\\)` }
    ]);
    const good = M(cas.good);
    const wrongs = cas.wr.map(w => M(w));
    return QCM(
      `Quelle relation obtient-on en séparant les variables de ${cas.eq} ?`,
      good, uniq3(good, wrongs), 1,
      EXPL(`Une EDO est à variables SÉPARABLES si elle s'écrit \\(\\frac{\\mathrm{d}y}{\\mathrm{d}x} = g(x)h(y)\\) : on « range » les \\(y\\) d'un côté, les \\(x\\) de l'autre, puis on intègre chaque côté séparément : \\(\\int\\frac{\\mathrm{d}y}{h(y)} = \\int g(x)\\,\\mathrm{d}x\\).`,
        `Ici, ${cas.exp}.`,
        `Le piège : « diviser par \\(h(y)\\) » sans vérifier que \\(h(y) \\ne 0\\) (des solutions constantes disparaissent alors du calcul) ; ou oublier la CONSTANTE d'intégration, qui sera fixée par la condition initiale.`));
  };
})();

/* ------------------------------------------------------------
   FICHES
   ------------------------------------------------------------ */
Object.assign(FICHES, {
  'integration': { titre: '∫ Intégration : aires, moyennes & volumes', html: `
    <p><b>Définition :</b> \\(\\int_a^b f(x)\\,\\mathrm{d}x\\) = aire algébrique entre la courbe et l'axe des abscisses (négative sous l'axe). Approche : sommes de Riemann (rectangles de plus en plus fins).</p>
    <p><b>Propriétés :</b> linéarité \\(\\int(\\alpha f + \\beta g) = \\alpha\\int f + \\beta\\int g\\) ; relation de Chasles \\(\\int_a^b + \\int_b^c = \\int_a^c\\) ; \\(\\int_b^a = -\\int_a^b\\) ; \\(\\int_a^a = 0\\).</p>
    <p><b>Valeur moyenne :</b> \\(\\mu = \\dfrac{1}{b-a}\\int_a^b f\\) — hauteur du rectangle équivalent ; le théorème de la moyenne assure \\(f(c) = \\mu\\) pour un \\(c\\) si \\(f\\) est continue.</p>
    <p><b>Changement de variable :</b> poser \\(u = \\varphi(x)\\), remplacer \\(\\mathrm{d}x = \\mathrm{d}u/\\varphi'(x)\\), intégrer puis revenir à \\(x\\). Objectif : faire apparaître \\(\\varphi'\\) (la dérivée composée à l'envers).</p>
    <p><b>Volume de révolution :</b> autour de l'axe des abscisses, \\(V = \\pi\\int_a^b f(x)^2\\,\\mathrm{d}x\\) (empilement de disques de rayon \\(f(x)\\)).</p>` },
  'equations-differentielles': { titre: '⚙ Équations différentielles & modèles', html: `
    <p><b>\\(y' = ay\\) :</b> solutions \\(y = Ce^{ax}\\). \\(a \\lt 0\\) : décroissance (refroidissement \\(T' = -k(T - T_{ext})\\), décharge) ; \\(a \\gt 0\\) : croissance explosive.</p>
    <p><b>\\(y' = ay + b\\) :</b> solution générale \\(y = Ce^{ax} - b/a\\) : constante particulière (équilibre) + exponentielle. La condition initiale fixe \\(C\\) (problème de Cauchy, solution unique).</p>
    <p><b>Variables séparables :</b> \\(y' = g(x)h(y) \\Rightarrow \\int\\dfrac{\\mathrm{d}y}{h(y)} = \\int g(x)\\,\\mathrm{d}x\\). Attention aux solutions \\(h(y) = 0\\) perdues en divisant.</p>
    <p><b>Modèles :</b> exponentiel \\(y = Ae^{Bt}\\) (linéarisé par \\(\\ln y = \\ln A + Bt\\)) ; logistique \\(y' = ry(1 - y/K)\\) — croissance en S, plafond \\(K\\), inflexion à \\(K/2\\). Choisir le modèle selon l'ALLURE du nuage, pas seulement \\(R^2\\) local.</p>` }
});

/* ------------------------------------------------------------
   ÉLÉMENTS SIMPLES
   ------------------------------------------------------------ */
Object.assign(GEN_INFO, {
  'riemannAire':     { label: 'Intégrale & aire (Riemann)', fiches: ['integration', 'fonctions'],
    rappel: `\\(\\int_a^b f\\) = aire algébrique sous la courbe ; négative sous l'axe.` },
  'integChasles':    { label: 'Linéarité & relation de Chasles', fiches: ['integration', 'fonctions'],
    rappel: `\\(\\int_a^b + \\int_b^c = \\int_a^c\\) ; \\(\\int_b^a = -\\int_a^b\\) ; linéarité.` },
  'integTfaVm':      { label: 'Valeur moyenne d\u2019une fonction', fiches: ['integration', 'statistiques'],
    rappel: `\\(\\mu = \\dfrac{1}{b-a}\\int_a^b f\\) ; théorème de la moyenne : \\(f(c) = \\mu\\).` },
  'integSubstitution': { label: 'Changement de variable', fiches: ['integration', 'derivees'],
    rappel: `\\(u = \\varphi(x)\\), \\(\\mathrm{d}x = \\mathrm{d}u/\\varphi'(x)\\), intégrer en \\(u\\), revenir en \\(x\\).` },
  'volumeRevolution': { label: 'Volumes de révolution', fiches: ['integration', 'espace'],
    rappel: `\\(V = \\pi\\int_a^b f(x)^2\\,\\mathrm{d}x\\) (disques perpendiculaires à l'axe).` },
  'ajustLinLog':     { label: 'Ajustement par transformation (linéarisation)', fiches: ['equations-differentielles', 'suites'],
    rappel: `\\(y = Ae^{Bt} \\to \\ln y = \\ln A + Bt\\) ; \\(y = at^n \\to \\ln y = \\ln a + n\\ln t\\).` },
  'modeleLogistique': { label: 'Modèle logistique', fiches: ['equations-differentielles', 'suites'],
    rappel: `\\(y' = ry(1 - y/K)\\) : plafond \\(K\\), inflexion à \\(K/2\\).` },
  'edoLineaire':     { label: 'EDO \\(y\u2019 = ay\\) : solution générale', fiches: ['equations-differentielles', 'derivees'],
    rappel: `\\(y = Ce^{ax}\\) ; condition initiale ⇒ \\(C\\).` },
  'edoParticuliere': { label: 'EDO \\(y\u2019 = ay + b\\) : solution particulière', fiches: ['equations-differentielles', 'derivees'],
    rappel: `\\(y_p = -b/a\\) (constante) ; générale = \\(Ce^{ax} + y_p\\).` },
  'edoCauchy':       { label: 'Problème de Cauchy', fiches: ['equations-differentielles', 'derivees'],
    rappel: `EDO + \\(y(x_0) = y_0\\) ⇒ constante \\(C\\) fixée, solution unique.` },
  'edoSeparables':   { label: 'EDO à variables séparables', fiches: ['equations-differentielles', 'fonctions'],
    rappel: `\\(y' = g(x)h(y) \\Rightarrow \\int\\mathrm{d}y/h(y) = \\int g(x)\\mathrm{d}x\\).` }
});

/* ============================================================
   7 NOTIONS NOUVELLES (splice avant « su-limites »)
   ============================================================ */
const NOUVELLES_INTEDO = [
  { id: 'integrale-aire',       name: 'Intégrale & aire sous la courbe',             g: ['riemannAire'],             family: 'blue', prob: 0.5 },
  { id: 'integrale-lineaire',   name: 'Linéarité, Chasles & valeur moyenne',        g: ['integChasles', 'integTfaVm'], family: 'blue', prob: 0.5 },
  { id: 'integrale-substitution', name: 'Changement de variable',                    g: ['integSubstitution'],       family: 'blue', prob: 0.5 },
  { id: 'volume-revolution',    name: 'Volumes de révolution',                      g: ['volumeRevolution'],        family: 'blue', prob: 0.5 },
  { id: 'edo-lineaire',         name: 'Équation différentielle y\u2019 = ay',        g: ['edoLineaire', 'edoParticuliere'], family: 'green', prob: 0.5 },
  { id: 'edo-cauchy',           name: 'Problème de Cauchy & variables séparables',  g: ['edoCauchy', 'edoSeparables'], family: 'green', prob: 0.5 },
  { id: 'ajustement-logistique', name: 'Ajustements linéarisés & modèle logistique', g: ['ajustLinLog', 'modeleLogistique'], family: 'violet', prob: 0.5 }
];
(function () {
  const iLim = NOTIONS.findIndex(n => n.id === 'su-limites');
  if (iLim < 0) NOTIONS.push.apply(NOTIONS, NOUVELLES_INTEDO);
  else NOTIONS.splice.apply(NOTIONS, [iLim, 0].concat(NOUVELLES_INTEDO));
})();

/* ============================================================
   PROGRESSION : 2 sous-catégories.
   ============================================================ */
(function () {
  const subInt = { nom: 'Intégration : aires, moyennes & volumes', ids: ['integrale-aire', 'integrale-lineaire', 'integrale-substitution', 'volume-revolution'] };
  const catInt = PROG_CATS.find(c => c.nom === 'Dérivation, primitives & Euler');
  if (catInt) catInt.subs.push(subInt);

  const subEdo = { nom: 'Équations différentielles & modèles', ids: ['edo-lineaire', 'edo-cauchy', 'ajustement-logistique'] };
  const catEdo = PROG_CATS.find(c => c.nom === 'Exponentielles & logarithmes');
  if (catEdo) catEdo.subs.push(subEdo);
})();

/* Formes 3D des nouveaux étages. */
document.addEventListener('DOMContentLoaded', function () {
  try {
    FLOOR_SHAPES['integrale-aire']        = 'dome';
    FLOOR_SHAPES['integrale-lineaire']    = 'colonnade';
    FLOOR_SHAPES['integrale-substitution'] = 'root';
    FLOOR_SHAPES['volume-revolution']     = 'cyl';
    FLOOR_SHAPES['edo-lineaire']          = 'arch';
    FLOOR_SHAPES['edo-cauchy']            = 'stairs';
    FLOOR_SHAPES['ajustement-logistique'] = 'bars';
  } catch (e) { /* 'box' */ }
});
