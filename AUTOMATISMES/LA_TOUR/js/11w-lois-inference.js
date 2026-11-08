/* ============================================================
   11w. LOIS DE PROBABILITY CONTINUES & STATISTIQUE INFÉRENTIELLE
   ============================================================ */
   /* ------------------------------------------------------------
   Contenu issu de l'AUDIT DU DÉPÔT (racine GitHub) : notions
   abordées dans le dépôt mais absentes de la tour, désormais
   couvertes.
   Sources :
   • STS_BIO_AC/STATISTIQUES_INFERENTIELLES (cours & exercices) :
     échantillonnage, estimation, tests d'hypothèses, cartes de
     contrôle ;
   • STS_BIO_AC/ANNALES (BTS groupement D, 2000-2026) : loi
     normale, approximations de Poisson et normale, loi
     exponentielle, loi uniforme, densités, intervalles de
     confiance, tests unilatéraux/bilatéraux ;
   • PROGRESSIONS_CLASSES/PROGRESSION_STS_BIO-AC_2 (tableau des
     contenus : approximation par Poisson / par la normale,
     densité de probabilité, loi normale centrée réduite, TCL,
     distribution d'échantillonnage, estimation, tests, cartes
     de contrôle) ;
   • STS_BIO_AC/STATISTIQUES (carte de contrôle, ISO 7870-2 et
     règles de Nelson, ISO 5725).

   AJOUTE : 11 générateurs (GEN), 2 fiches (FICHES), 11 éléments
   simples (GEN_INFO), 9 notions (NOTIONS.splice avant
   « su-limites ») et 1 sous-catégorie dans « Probabilités &
   statistiques ». Niveaux (11v) : post-bac.
   ============================================================ */

/* ------------------------------------------------------------
   GÉNÉRATEURS — lois continues & inférence
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

  /* ---------- 1. Loi normale : centrer & réduire ---------- */
  GEN.normaleStd = () => {
    const cas = pick([
      { mu: '10', sig: '2',  x: '14', z: '2',  exp: `\\(z = \\dfrac{14 - 10}{2} = 2\\)` },
      { mu: '50', sig: '5',  x: '40', z: '-2', exp: `\\(z = \\dfrac{40 - 50}{5} = -2\\)` },
      { mu: '100', sig: '25', x: '125', z: '1', exp: `\\(z = \\dfrac{125 - 100}{25} = 1\\)` },
      { mu: '8',  sig: '0{,}5', x: '9', z: '2', exp: `\\(z = \\dfrac{9 - 8}{0{,}5} = 2\\)` }
    ]);
    const good = M(cas.z);
    const wrongs = [M(`${cas.x} - ${cas.mu}`), M(`0`), M(`1`)];
    return QCM(
      `\\(X \\sim \\mathcal{N}(${cas.mu}~;~${cas.sig})\\).<br>Quelle est la valeur centrée réduite de \\(x = ${cas.x}\\) ?`,
      good, uniq3(good, wrongs), 1,
      EXPL(`Centrer et réduire, c'est mesurer un écart en « nombres d'écarts-types » : \\(Z = \\dfrac{X - \\mu}{\\sigma}\\). La loi normale \\(\\mathcal{N}(\\mu~;~\\sigma)\\) devient la loi \\(\\mathcal{N}(0~;~1)\\), celle qui est TABLE (lecture directe des probabilités usuelles).`,
        `Ici ${cas.exp}. Convention BTS : \\(\\mathcal{N}(\\mu~;~\\sigma)\\) donne l'ESPÉRANCE puis l'ÉCART-TYPE (pas la variance).`,
        `Le piège : diviser par la VARIANCE \\(\\sigma^2\\) au lieu de \\(\\sigma\\), ou croire que le second paramètre est déjà la variance — dans ce cas \\(\\sigma = \\sqrt{v}\\).`));
  };

  /* ---------- 2. Loi normale : probabilités usuelles & symétrie ---------- */
  GEN.normaleProb = () => {
    const cas = pick([
      { q: `Si \\(X \\sim \\mathcal{N}(\\mu~;~\\sigma)\\), que vaut \\(P(X \\lt \\mu)\\) ?`, good: `0{,}5`, wr: [`1`, `0{,}68`, `0{,}95`],
        exp: `la courbe est SYMÉTRIQUE par rapport à \\(\\mu\\) : la moitié des valeurs est sous la moyenne` },
      { q: `Que vaut environ \\(P(\\mu - \\sigma \\lt X \\lt \\mu + \\sigma)\\) (règle des 68-95-99,7) ?`, good: `68 \\%`, wr: [`95 \\%`, `99{,}7 \\%`, `34 \\%`],
        exp: `à \\(\\pm 1\\sigma\\) se trouve environ 68 % de la masse` },
      { q: `Que vaut environ \\(P(\\mu - 2\\sigma \\lt X \\lt \\mu + 2\\sigma)\\) ?`, good: `95 \\%`, wr: [`68 \\%`, `99{,}7 \\%`, `50 \\%`],
        exp: `à \\(\\pm 2\\sigma\\) : environ 95 % (fondement des intervalles « \\(\\pm 2\\sigma\\) » des cartes de contrôle et des IC)` },
      { q: `Si \\(P(X \\lt 12) = 0{,}3\\) et \\(X \\sim \\mathcal{N}(\\mu~;~\\sigma)\\), que vaut \\(P(X \\ge 12)\\) ?`, good: `0{,}7`, wr: [`0{,}3`, `0{,}5`, `1{,}3`],
        exp: `événement CONTRAIRE : \\(P = 1 - 0{,}3 = 0{,}7\\)` }
    ]);
    const good = M(cas.good);
    const wrongs = cas.wr.map(w => M(w));
    return QCM(cas.q, good, uniq3(good, wrongs), 1,
      EXPL(`La loi normale est symétrique : \\(P(X \\lt \\mu) = P(X \\gt \\mu) = 0{,}5\\). Règle des 68-95-99,7 : \\(\\pm 1\\sigma \\to 68\\%\\), \\(\\pm 2\\sigma \\to 95\\%\\), \\(\\pm 3\\sigma \\to 99{,}7\\%\\). Tout événement a un contraire : \\(P = 1 - P(\\text{contraire})\\).`,
        `Ici, ${cas.exp}.`,
        `Le piège : chercher une table quand la SYMÉTRIE ou le CONTRAIRE suffit ; ou additionner des pourcentages qui s'excluent (0,3 + 0,5 n'a aucun sens).`));
  };

  /* ---------- 3. Approximation normale de la binomiale ---------- */
  GEN.approxNormale = () => {
    const cas = pick([
      { n: '100', p: `0{,}5`, mu: '50', sig: '5' },
      { n: '400', p: `0{,}5`, mu: '200', sig: '10' },
      { n: '900', p: `0{,}5`, mu: '450', sig: '15' }
    ]);
    const good = M(`\\mathcal{N}(${cas.mu}~;~${cas.sig})`);
    const wrongs = [M(`\\mathcal{N}(${cas.n}~;~${cas.p})`), M(`\\mathcal{N}(${cas.mu}~;~${cas.sig}^2)`), M(`\\mathcal{N}(0~;~1)`)];
    return QCM(
      `\\(X \\sim \\mathcal{B}(${cas.n}~;~${cas.p})\\).<br>Quelle loi normale l'approxime ?`,
      good, uniq3(good, wrongs), 1,
      EXPL(`Si \\(n\\) est grand, \\(np\\) et \\(n(1-p)\\) dépassent 5 (souvent 18 en BTS selon les cours), la binomiale ressemble à une normale de MÊME espérance et MÊME écart-type : \\(\\mu = np\\), \\(\\sigma = \\sqrt{np(1-p)}\\).`,
        `Ici : \\(\\mu = ${cas.n} \\times ${cas.p} = ${cas.mu}\\) et \\(\\sigma = \\sqrt{${cas.n} \\times ${cas.p} \\times (1 - ${cas.p})} = ${cas.sig}\\) — soit \\(\\mathcal{N}(${cas.mu}~;~${cas.sig})\\).`,
        `Le piège : donner la VARIANCE \\(np(1-p)\\) comme second paramètre au lieu de l'écart-type ; ou oublier de vérifier les conditions d'approximation avant de s'en servir.`));
  };

  /* ---------- 4. Approximation de Poisson ---------- */
  GEN.poissonApprox = () => {
    const cas = pick([
      { n: '100', p: `0{,}02`, lam: '2' },
      { n: '200', p: `0{,}01`, lam: '2' },
      { n: '50',  p: `0{,}04`, lam: '2' }
    ]);
    const good = M(`${cas.lam}`);
    const wrongs = [M(`${cas.p}`), M(`${cas.n}`), M(`0`)];
    return QCM(
      `\\(X \\sim \\mathcal{B}(${cas.n}~;~${cas.p})\\) (\\(n\\) grand, \\(p\\) petit).<br>Quel paramètre \\(\\lambda\\) pour l'approximation de Poisson ?`,
      good, uniq3(good, wrongs), 1,
      EXPL(`Quand \\(n \\ge 50\\) et \\(p \\le 0{,}1\\) (grand \\(n\\), petit \\(p\\)), la binomiale se rapproche de la loi de Poisson \\(\\mathcal{P}(\\lambda)\\) avec \\(\\lambda = np\\) — l'espérance est CONSERVÉE. Formule : \\(P(X = k) = \\dfrac{e^{-\\lambda}\\lambda^k}{k!}\\).`,
        `Ici \\(\\lambda = ${cas.n} \\times ${cas.p} = ${cas.lam}\\). Espérance ET variance valent \\(\\lambda\\) : c'est la signature de Poisson.`,
        `Le piège : prendre \\(p\\) ou \\(n\\) pour \\(\\lambda\\), ou oublier que Poisson exige un \\(p\\) PETIT — pour \\(p\\) proche de 0,5 c'est la normale qui approxime, pas Poisson.`));
  };

  /* ---------- 5. Loi exponentielle ---------- */
  GEN.expoLoi = () => {
    const cas = pick([
      { lam: `0{,}05`, q: `E(X)`, good: `20`, wr: [`0{,}05`, `50`, `200`],
        exp: `\\(E(X) = \\dfrac{1}{\\lambda} = \\dfrac{1}{0{,}05} = 20\\) (durée de vie moyenne en heures)` },
      { lam: `0{,}1`, q: `E(X)`, good: `10`, wr: [`0{,}1`, `100`, `1`],
        exp: `\\(E(X) = \\dfrac{1}{0{,}1} = 10\\)` },
      { lam: `0{,}25`, q: `P(X \\gt 4)`, good: `e^{-1} \\approx 0{,}37`, wr: [`1 - e^{-1}`, `0{,}25`, `0{,}37 \\times 4`],
        exp: `\\(P(X \\gt t) = e^{-\\lambda t} = e^{-0{,}25 \\times 4} = e^{-1} \\approx 0{,}37\\)` },
      { lam: `0{,}2`, q: `P(X \\gt 5)`, good: `e^{-1} \\approx 0{,}37`, wr: [`e^{-5}`, `0{,}2`, `1 - e^{-1}`],
        exp: `\\(P(X \\gt 5) = e^{-0{,}2 \\times 5} = e^{-1} \\approx 0{,}37\\)` }
    ]);
    const good = M(cas.good);
    const wrongs = cas.wr.map(w => M(w));
    return QCM(
      `\\(X\\) suit la loi exponentielle de paramètre \\(\\lambda = ${cas.lam}\\) (durées de vie, taux de défaillance).<br>Que vaut ${cas.q} ?`,
      good, uniq3(good, wrongs), 1,
      EXPL(`Loi exponentielle : densité \\(f(t) = \\lambda e^{-\\lambda t}\\) sur \\([0~;~+\\infty[\\). Espérance \\(E(X) = \\dfrac{1}{\\lambda}\\), et surtout \\(P(X \\gt t) = e^{-\\lambda t}\\) (survie). Elle est SANS MÉMOIRE : \\(P(X \\gt s + t \\mid X \\gt s) = P(X \\gt t)\\) — usée ou neuve, la pièce a la même espérance de vie résiduelle.`,
        `Ici, ${cas.exp}.`,
        `Le piège : confondre \\(P(X \\lt t) = 1 - e^{-\\lambda t}\\) avec \\(P(X \\gt t) = e^{-\\lambda t}\\) ; ou « multiplier par \\(\\lambda\\) » au lieu de prendre l'INVERSE pour l'espérance.`));
  };

  /* ---------- 6. Loi uniforme ---------- */
  GEN.uniformeLoi = () => {
    const cas = pick([
      { a: '2', b: '12', c: '4', d: '9', good: `\\dfrac{1}{2}`, wr: [`\\dfrac{1}{10}`, `\\dfrac{9}{12}`, `1`] },
      { a: '0', b: '20', c: '5', d: '15', good: `\\dfrac{1}{2}`, wr: [`\\dfrac{1}{20}`, `\\dfrac{3}{4}`, `0{,}2`] },
      { a: '1', b: '9', c: '3', d: '7', good: `\\dfrac{1}{2}`, wr: [`\\dfrac{1}{8}`, `\\dfrac{7}{9}`, `0{,}4`] }
    ]);
    const good = M(cas.good);
    const wrongs = cas.wr.map(w => M(w));
    return QCM(
      `\\(X\\) suit la loi uniforme sur \\([${cas.a}~;~${cas.b}]\\).<br>Que vaut \\(P(${cas.c} \\le X \\le ${cas.d})\\) ?`,
      good, uniq3(good, wrongs), 1,
      EXPL(`Loi uniforme : la probabilité est PROPORTIONNELLE à la longueur. \\(P(c \\le X \\le d) = \\dfrac{d - c}{b - a}\\) et \\(E(X) = \\dfrac{a + b}{2}\\) (le milieu de l'intervalle).`,
        `Ici : \\(\\dfrac{${cas.d} - ${cas.c}}{${cas.b} - ${cas.a}} = ${cas.good}\\) — la longueur « gagnante » rapportée à la longueur totale.`,
        `Le piège : raisonner sur les VALEURS (\\(d\\) sur \\(b\\)) au lieu des LONGUEURS ; ou oublier de soustraire \\(a\\) au dénominateur quand l'intervalle ne démarre pas à 0.`));
  };

  /* ---------- 7. Densité & fonction de répartition ---------- */
  GEN.densiteRep = () => {
    const cas = pick([
      { q: `Pour qu'une fonction \\(f\\) soit une densité de probabilité, il faut…`, good: `\\(f \\ge 0\\) et aire totale sous \\(f\\) égale à 1`, wr: [`\\(f \\le 1\\) partout et \\(f(0) = 1\\)`, `\\(f\\) paire et continue partout`, `\\(f(x) \\le x\\) et aire totale égale à 2`],
        exp: `une densité est POSITIVE et « pèse » exactement 1 : \\(\\int_{-\\infty}^{+\\infty} f = 1\\)` },
      { q: `Par définition, que vaut \\(P(a \\le X \\le b)\\) pour une variable à densité \\(f\\) ?`, good: `\\(\\int_a^b f(x)\\,\\mathrm{d}x\\)`, wr: [`\\(f(b) - f(a)\\)`, `\\(f\\left(\\dfrac{a+b}{2}\\right)\\)`, `\\(F(b) + F(a)\\)`],
        exp: `la probabilité est l'AIRE sous la densité entre \\(a\\) et \\(b\\)` },
      { q: `Si \\(F\\) est la fonction de répartition de \\(X\\), alors \\(P(a \\lt X \\le b)\\) vaut…`, good: `\\(F(b) - F(a)\\)`, wr: [`\\(F(a) - F(b)\\)`, `\\(F(b) + F(a)\\)`, `\\(\\dfrac{F(a)}{F(b)}\\)`],
        exp: `\\(F\\) CUMULE les probabilités : la probabilité de \\((a~;~b]\\) est ce qui a été cumulé en \\(b\\) moins ce qui l'était déjà en \\(a\\)` },
      { q: `La fonction de répartition \\(F\\) d'une variable continue vérifie…`, good: `\\(F\\) croissante, de 0 à 1`, wr: [`\\(F\\) décroissante, de 1 à 0`, `\\(F\\) paire, de 0 à 2`, `\\(F\\) constante égale à 1`],
        exp: `\\(F(x) = P(X \\le x)\\) part de 0, ne diminue jamais et tend vers 1` }
    ]);
    const good = M(cas.good);
    const wrongs = cas.wr.map(w => M(w));
    return QCM(cas.q, good, uniq3(good, wrongs), 1,
      EXPL(`Une densité \\(f\\) est positive, d'aire totale 1 ; les probabilités sont des AIRES : \\(P(a \\le X \\le b) = \\int_a^b f\\). La fonction de répartition \\(F(x) = P(X \\le x)\\) cumule : elle est croissante, va de 0 à 1, et \\(P(a \\lt X \\le b) = F(b) - F(a)\\).`,
        `Ici, ${cas.exp}.`,
        `Le piège : traiter \\(f\\) comme une fonction de répartition (alors que \\(P(X = c) = 0\\) pour une valeur isolée, seule l'AIRE compte) ; ou « soustraire dans le mauvais sens » avec \\(F\\).`));
  };

  /* ---------- 8. TCL & distribution d'échantillonnage ---------- */
  GEN.tclEchant = () => {
    const cas = pick([
      { sig: '10', n: '25', good: `2`, wr: [`10`, `0{,}4`, `5`] },
      { sig: '12', n: '36', good: `2`, wr: [`12`, `3`, `0{,}33`] },
      { sig: '30', n: '225', good: `2`, wr: [`30`, `15`, `0{,}1`] }
    ]);
    const good = M(cas.good);
    const wrongs = cas.wr.map(w => M(w));
    return QCM(
      `Une population d'écart-type \\(\\sigma = ${cas.sig}\\). On prélève des échantillons de taille \\(n = ${cas.n}\\).<br>Quel est l'écart-type de la moyenne \\(\\bar{X}\\) des échantillons ?`,
      good, uniq3(good, wrongs), 1,
      EXPL(`Théorème central limite : pour \\(n\\) assez grand, la moyenne d'échantillon \\(\\bar{X}\\) suit approximativement \\(\\mathcal{N}\\left(\\mu~;~\\dfrac{\\sigma}{\\sqrt{n}}\\right)\\). MOYENNER DIVISE LA DISPERSION par \\(\\sqrt{n}\\) : les moyennes d'échantillons sont plus resserrées que les individus.`,
        `Ici : \\(\\dfrac{${cas.sig}}{\\sqrt{${cas.n}}} = ${cas.good}\\) (et l'espérance reste \\(\\mu\\), celle de la population).`,
        `Le piège : diviser par \\(n\\) au lieu de \\(\\sqrt{n}\\) — c'est la VARIANCE de \\(\\bar{X}\\) qui vaut \\(\\sigma^2/n\\), pas son écart-type ; ou croire que la moyenne change l'espérance.`));
  };

  /* ---------- 9. Estimation & intervalle de confiance (moyenne) ---------- */
  GEN.icMoyenne = () => {
    const cas = pick([
      { xb: '100', sig: '15', n: '225', half: '2', good: `\\left[98~;~102\\right]`, wr: [`\\left[85~;~115\\right]`, `\\left[99{,}5~;~100{,}5\\right]`, `\\left[92{,}5~;~107{,}5\\right]`] },
      { xb: '50', sig: '10', n: '100', half: '2', good: `\\left[48~;~52\\right]`, wr: [`\\left[40~;~60\\right]`, `\\left[49{,}5~;~50{,}5\\right]`, `\\left[45~;~55\\right]`] },
      { xb: '200', sig: '20', n: '100', half: '4', good: `\\left[196~;~204\\right]`, wr: [`\\left[180~;~220\\right]`, `\\left[199{,}8~;~200{,}2\\right]`, `\\left[198~;~202\\right]`] }
    ]);
    const good = M(cas.good);
    const wrongs = cas.wr.map(w => M(w));
    return QCM(
      `Sur un échantillon de \\(n = ${cas.n}\\), la moyenne vaut \\(\\bar{x} = ${cas.xb}\\) et l'écart-type (connu) vaut \\(\\sigma = ${cas.sig}\\).<br>Quel est l'intervalle de confiance à 95 % de la moyenne ?`,
      good, uniq3(good, wrongs), 1,
      EXPL(`Estimation ponctuelle : \\(\\bar{x}\\) estime \\(\\mu\\) ; l'intervalle de confiance à 95 % (\\(\\sigma\\) connu) est \\(\\bar{x} \\pm 2\\dfrac{\\sigma}{\\sqrt{n}}\\) — le « \\(\\pm 2\\sigma\\) » de la règle 68-95-99,7 appliqué à la distribution d'échantillonnage.`,
        `Ici : \\(2 \\times \\dfrac{${cas.sig}}{\\sqrt{${cas.n}}} = ${cas.half}\\), d'où l'intervalle ${cas.good}. Plus \\(n\\) grandit, plus l'intervalle RÉTRÉCIT (précision en \\(1/\\sqrt{n}\\)).`,
        `Le piège : construire l'intervalle avec \\(\\sigma\\) au lieu de \\(\\sigma/\\sqrt{n}\\) (on obtient un intervalle démesurément large) ; ou croire qu'un plus grand échantillon DÉPLACE la moyenne — il ne fait que resserrer l'intervalle.`));
  };

  /* ---------- 10. Tests d'hypothèses ---------- */
  GEN.testHyp = () => {
    const cas = pick([
      { q: `Un test bilatéral au risque \\(\\alpha = 5\\%\\) aboutit à \\(p\\text{-valeur} = 0{,}02\\). Que décide-t-on ?`, good: `on rejette \\(H_0\\)`, wr: [`on conserve \\(H_0\\)`, `on augmente \\(\\alpha\\)`, `le test est invalide`],
        exp: `la p-valeur 0,02 est INFÉRIEURE au risque 0,05 : un écart aussi grand serait trop improbable sous \\(H_0\\)` },
      { q: `Dans un test d'hypothèse, que dit l'hypothèse nulle \\(H_0\\) ?`, good: `l'effet soupçonné est ABSENT (situation de référence)`, wr: [`l'effet soupçonné est présent`, `le risque \\(\\alpha\\) est nul`, `l'échantillon est biaisé`],
        exp: `\\(H_0\\) est l'hypothèse « par défaut » ; le test cherche à montrer qu'elle devient INVRAISEMBLABLE face aux données` },
      { q: `Conclure « on rejette \\(H_0\\) à 5 % » alors que \\(H_0\\) est vraie, c'est…`, good: `une erreur de première espèce (risque \\(\\alpha\\))`, wr: [`une erreur de seconde espèce (risque \\(\\beta\\))`, `une p-valeur négative`, `impossible par construction`],
        exp: `l'erreur de 1re espèce, dont la probabilité est le risque \\(\\alpha\\) CHOISI à l'avance` },
      { q: `Test unilatéral ou bilatéral : \\(H_1 : \\mu \\gt \\mu_0\\) correspond à…`, good: `un test unilatéral (à droite)`, wr: [`un test bilatéral`, `un test sans hypothèse alternative`, `un test sur la variance`],
        exp: `\\(H_1\\) oriente la zone de rejet d'un SEUL côté : c'est un test UNILATÉRAL` }
    ]);
    const good = M(cas.good);
    const wrongs = cas.wr.map(w => M(w));
    return QCM(cas.q, good, uniq3(good, wrongs), 1,
      EXPL(`Un test d'hypothèse oppose \\(H_0\\) (référence : « rien ne change ») à \\(H_1\\) (effet soupçonné). DÉCISION : si la p-valeur (probabilité d'observer au moins un tel écart sous \\(H_0\\)) est INFÉRIEURE au seuil \\(\\alpha\\), on REJETTE \\(H_0\\) au risque \\(\\alpha\\) ; sinon on le conserve (jamais « on accepte \\(H_0\\) »). Rejeter à tort \\(H_0\\) vraie = erreur de 1re espèce (risque \\(\\alpha\\)) ; ne pas rejeter un \\(H_0\\) fausse = erreur de 2de espèce (risque \\(\\beta\\)).`,
        `Ici, ${cas.exp}.`,
        `Le piège : confondre « p-valeur » avec la probabilité que \\(H_0\\) soit vraie ; ou formuler la conclusion comme une CERTITUDE (« le produit est conforme ») au lieu d'une décision au risque \\(\\alpha\\).`));
  };

  /* ---------- 11. Cartes de contrôle & règles de Nelson ---------- */
  GEN.carteNelson = () => {
    const cas = pick([
      { mu: '100', sig: '5', good: `\\left[85~;~115\\right]`, wr: [`\\left[95~;~105\\right]`, `\\left[90~;~110\\right]`, `\\left[80~;~120\\right]`] },
      { mu: '50', sig: '2', good: `\\left[44~;~56\\right]`, wr: [`\\left[48~;~52\\right]`, `\\left[46~;~54\\right]`, `\\left[40~;~60\\right]`] }
    ]);
    const cas2 = pick([
      { q: `Quand dit-on qu'un procédé est « hors contrôle » sur une carte aux mesures ?`, good: `un point sort des limites \\(\\mu \\pm 3\\sigma\\)`, wr: [`deux points consécutifs différents`, `la moyenne bouge de \\(\\sigma\\)`, `un point est exactement sur la ligne médiane`],
        exp: `règle de Nelson nᵒ 1 : un point HORS des limites \\(\\mu \\pm 3\\sigma\\) signale une cause spéciale (dérive, panne, réglage)` },
      { q: `Neuf points consécutifs du MÊME côté de la ligne centrale : que conclut la règle de Nelson ?`, good: `le procédé est hors contrôle (dérive lente)`, wr: [`tout est normal`, `il faut agrandir les limites`, `la carte est mal construite`],
        exp: `règle de Nelson nᵒ 2 : une trop longue série d'un même côté révèle une DÉRIVE même si chaque point reste dans les limites` },
      { q: `Sur une carte de contrôle, la ligne centrale et les limites sont fixées AVANT les observations. Pourquoi ?`, good: `pour détecter les dérives par rapport à une référence choisie`, wr: [`par tradition statistique`, `parce que les données sont secrètes`, `pour éviter les calculs`],
        exp: `la carte compare chaque observation à une référence CAPITALE (procédé sous contrôle) ; c'est l'ÉCART qui devient l'information` }
    ]);
    if (Math.random() < 0.5) {
      const good = M(cas.good);
      const wrongs = cas.wr.map(w => M(w));
      return QCM(
        `Carte de contrôle aux mesures avec \\(\\mu = ${cas.mu}\\) et \\(\\sigma = ${cas.sig}\\).<br>Quelles limites de contrôle (\\(\\mu \\pm 3\\sigma\\)) ?`,
        good, uniq3(good, wrongs), 1,
        EXPL(`Carte de contrôle (ISO 7870-2, maîtrise statistique des procédés) : ligne centrale \\(\\mu\\), limites de contrôle à \\(\\mu \\pm 3\\sigma\\) — on y retrouve les 99,7 % de la loi normale. Entre elles, le procédé est « sous contrôle » : les variations sont dues au HASARD seul.`,
          `Ici : \\(${cas.mu} \\pm 3 \\times ${cas.sig}\\), soit ${cas.good}.`,
          `Le piège : confondre limites de CONTRÔLE (\\(\\pm 3\\sigma\\), décision) et limites de SURVEILLANCE (\\(\\pm 2\\sigma\\), alerte anticipée) ; ou recalculer les limites à chaque point — on détecterait alors... rien.`));
    }
    const good2 = M(cas2.good);
    const wrongs2 = cas2.wr.map(w => M(w));
    return QCM(cas2.q, good2, uniq3(good2, wrongs2), 1,
      EXPL(`Les règles de Nelson (ISO 7870-2) traquent les causes SPÉCIALES : nᵒ 1 un point hors \\(\\mu \\pm 3\\sigma\\) ; nᵒ 2 neuf points du même côté de la ligne centrale ; nᵒ 3 six points qui montent (ou descendent) consécutivement ; nᵒ 5 deux points sur trois au-delà de \\(2\\sigma\\)… Une carte n'est PAS une simple collection de points : les MOTIFS comptent autant que les valeurs.`,
        `Ici, ${cas2.exp}.`,
        `Le piège : ne réagir qu'aux points hors limites — les dérives LENTES (même côté, tendance monotone) détruisent la qualité sans jamais sortir de l'intervalle.`));
  };
})();

/* ------------------------------------------------------------
   FICHES
   ------------------------------------------------------------ */
Object.assign(FICHES, {
  'lois-continues': { titre: '🎲 Lois continues : normale, Poisson, exponentielle & uniforme', html: `
    <p><b>Loi normale \\(\\mathcal{N}(\\mu~;~\\sigma)\\) :</b> courbe « en cloche » symétrique. Centrer-réduire : \\(Z = \\dfrac{X - \\mu}{\\sigma} \\sim \\mathcal{N}(0~;~1)\\). Règle 68-95-99,7 : \\(\\pm 1\\sigma \\to 68\\%\\), \\(\\pm 2\\sigma \\to 95\\%\\), \\(\\pm 3\\sigma \\to 99{,}7\\%\\).</p>
    <p><b>Approximations de la binomiale \\(\\mathcal{B}(n~;~p)\\) :</b> si \\(n\\) grand et \\(p\\) petit, \\(\\mathcal{P}(\\lambda)\\) avec \\(\\lambda = np\\) et \\(P(X=k) = \\dfrac{e^{-\\lambda}\\lambda^k}{k!}\\) (espérance = variance = \\(\\lambda\\)) ; si \\(np\\) et \\(n(1-p)\\) assez grands, \\(\\mathcal{N}(np~;~\\sqrt{np(1-p)})\\).</p>
    <p><b>Loi exponentielle de paramètre \\(\\lambda\\) :</b> durées de vie. \\(E(X) = \\dfrac{1}{\\lambda}\\), \\(P(X \\gt t) = e^{-\\lambda t}\\) (fiabilité, taux de défaillance). Sans mémoire : \\(P(X \\gt s+t \\mid X \\gt s) = P(X \\gt t)\\).</p>
    <p><b>Loi uniforme sur \\([a~;~b]\\) :</b> \\(P(c \\le X \\le d) = \\dfrac{d - c}{b - a}\\) et \\(E(X) = \\dfrac{a+b}{2}\\).</p>
    <p><b>Densité & répartition :</b> \\(f \\ge 0\\), aire totale 1 ; \\(P(a \\le X \\le b) = \\int_a^b f\\) ; \\(F(x) = P(X \\le x)\\) croissante de 0 à 1, \\(P(a \\lt X \\le b) = F(b) - F(a)\\).</p>` },
  'inference-stats': { titre: '🧪 Échantillonnage, estimation & tests d\u2019hypothèses', html: `
    <p><b>Théorème central limite :</b> pour \\(n\\) assez grand, \\(\\bar{X} \\approx \\mathcal{N}\\left(\\mu~;~\\dfrac{\\sigma}{\\sqrt{n}}\\right)\\) — la dispersion des moyennes se réduit en \\(1/\\sqrt{n}\\). Pour une proportion : \\(P \\approx \\mathcal{N}\\left(p~;~\\sqrt{\\dfrac{p(1-p)}{n}}\\right)\\).</p>
    <p><b>Estimation :</b> ponctuelle (\\(\\bar{x}\\) estime \\(\\mu\\)) ou par intervalle : à 95 %, \\(\\bar{x} \\pm 2\\dfrac{\\sigma}{\\sqrt{n}}\\) (\\(\\sigma\\) connu) ; \\(p \\pm 2\\sqrt{\\dfrac{p(1-p)}{n}}\\) pour une proportion. Précision en \\(1/\\sqrt{n}\\) : multiplier la précision par 2 demande 4 fois plus de données.</p>
    <p><b>Test d'hypothèse :</b> \\(H_0\\) (référence) contre \\(H_1\\) (effet, éventuellement unilatéral \\(\\lt\\) ou \\(\\gt\\)). Si p-valeur \\(\\lt \\alpha\\) (souvent 5 %), on rejette \\(H_0\\). Erreur de 1re espèce \\(\\alpha\\) (rejeter \\(H_0\\) vraie), de 2de espèce \\(\\beta\\) (conserver \\(H_0\\) fausse). Conclusion : décision AU RISQUE \\(\\alpha\\), jamais une certitude.</p>
    <p><b>Cartes de contrôle (ISO 7870-2, règles de Nelson) :</b> ligne centrale \\(\\mu\\), limites \\(\\mu \\pm 3\\sigma\\), surveillance à \\(\\pm 2\\sigma\\). Hors contrôle : point hors limites (nᵒ 1), 9 points du même côté (nᵒ 2), 6 points monotones (nᵒ 3), 2 sur 3 au-delà de \\(2\\sigma\\) (nᵒ 5)… La conformité (ISO 5725) : justesse (pas d'erreur systématique) ≠ fidélité (dispersion faible).</p>` }
});

/* ------------------------------------------------------------
   ÉLÉMENTS SIMPLES
   ------------------------------------------------------------ */
Object.assign(GEN_INFO, {
  'normaleStd':      { label: 'Normale : centrer & réduire', fiches: ['lois-continues', 'statistiques'],
    rappel: `\\(Z = \\dfrac{X - \\mu}{\\sigma} \\sim \\mathcal{N}(0~;~1)\\) ; le second paramètre de \\(\\mathcal{N}\\) est l'ÉCART-TYPE.` },
  'normaleProb':     { label: 'Normale : 68-95-99,7 & symétrie', fiches: ['lois-continues', 'statistiques'],
    rappel: `\\(P(X \\lt \\mu) = 0{,}5\\) ; \\(\\pm 1\\sigma \\to 68\\%\\), \\(\\pm 2\\sigma \\to 95\\%\\), \\(\\pm 3\\sigma \\to 99{,}7\\%\\).` },
  'approxNormale':   { label: 'Approximation normale de la binomiale', fiches: ['lois-continues', 'probabilites'],
    rappel: `\\(\\mathcal{B}(n~;~p) \\approx \\mathcal{N}\\left(np~;~\\sqrt{np(1-p)}\\right)\\) si \\(np\\) et \\(n(1-p)\\) assez grands.` },
  'poissonApprox':   { label: 'Approximation de Poisson', fiches: ['lois-continues', 'probabilites'],
    rappel: `Grand \\(n\\), petit \\(p\\) : \\(\\lambda = np\\), \\(P(X = k) = \\dfrac{e^{-\\lambda}\\lambda^k}{k!}\\), espérance = variance = \\(\\lambda\\).` },
  'expoLoi':         { label: 'Loi exponentielle : durées de vie', fiches: ['lois-continues', 'probabilites'],
    rappel: `\\(E(X) = 1/\\lambda\\), \\(P(X \\gt t) = e^{-\\lambda t}\\), sans mémoire.` },
  'uniformeLoi':     { label: 'Loi uniforme sur [a;b]', fiches: ['lois-continues', 'probabilites'],
    rappel: `\\(P(c \\le X \\le d) = \\dfrac{d-c}{b-a}\\), \\(E(X) = \\dfrac{a+b}{2}\\).` },
  'densiteRep':      { label: 'Densité & fonction de répartition', fiches: ['lois-continues', 'probabilites'],
    rappel: `\\(f \\ge 0\\) d'aire 1 ; \\(P = \\int f\\) ; \\(F(b) - F(a)\\) pour \\((a~;~b]\\).` },
  'tclEchant':       { label: 'TCL & distribution d\u2019échantillonnage', fiches: ['inference-stats', 'statistiques'],
    rappel: `\\(\\bar{X} \\approx \\mathcal{N}\\left(\\mu~;~\\dfrac{\\sigma}{\\sqrt{n}}\\right)\\) : l'écart-type des moyennes est \\(\\sigma/\\sqrt{n}\\).` },
  'icMoyenne':       { label: 'IC à 95 % de la moyenne', fiches: ['inference-stats', 'statistiques'],
    rappel: `\\(\\bar{x} \\pm 2\\dfrac{\\sigma}{\\sqrt{n}}\\) ; précision en \\(1/\\sqrt{n}\\).` },
  'testHyp':         { label: 'Tests d\u2019hypothèses : p-valeur & risques', fiches: ['inference-stats', 'probabilites'],
    rappel: `p-valeur \\(\\lt \\alpha\\) → rejeter \\(H_0\\) ; 1re espèce \\(\\alpha\\), 2de espèce \\(\\beta\\).` },
  'carteNelson':     { label: 'Cartes de contrôle & règles de Nelson', fiches: ['inference-stats', 'statistiques'],
    rappel: `Limites \\(\\mu \\pm 3\\sigma\\) ; hors limites, 9 points d\u2019un côté, 6 points monotones… = hors contrôle.` }
});

/* ============================================================
   9 NOTIONS NOUVELLES (splice avant « su-limites »)
   ============================================================ */
const NOUVELLES_LOISINF = [
  { id: 'loi-normale',      name: 'Loi normale : paramètres & centrée réduite',   g: ['normaleStd', 'normaleProb', 'approxNormale'], family: 'blue', prob: 0.5 },
  { id: 'approx-poisson',  name: 'Approximation de Poisson',                     g: ['poissonApprox'],                             family: 'blue', prob: 0.5 },
  { id: 'loi-exponentielle', name: 'Loi exponentielle : durées de vie',           g: ['expoLoi'],                                   family: 'blue', prob: 0.5 },
  { id: 'loi-uniforme',     name: 'Loi uniforme sur [a ; b]',                    g: ['uniformeLoi'],                                family: 'blue', prob: 0.5 },
  { id: 'densite-proba',    name: 'Densité & fonction de répartition',            g: ['densiteRep'],                                family: 'blue', prob: 0.5 },
  { id: 'tcl-echantillon',  name: 'TCL & distribution d\u2019échantillonnage',    g: ['tclEchant'],                                 family: 'violet', prob: 0.5 },
  { id: 'estim-moyenne',   name: 'Estimation & intervalles de confiance',         g: ['icMoyenne'],                                 family: 'violet', prob: 0.5 },
  { id: 'tests-hyp',       name: 'Tests d\u2019hypothèses : seuil & p-valeur',   g: ['testHyp'],                                   family: 'violet', prob: 0.5 },
  { id: 'carte-controle',  name: 'Cartes de contrôle & règles de Nelson',         g: ['carteNelson'],                               family: 'violet', prob: 0.5 }
];
(function () {
  const iLim = NOTIONS.findIndex(n => n.id === 'su-limites');
  if (iLim < 0) NOTIONS.push.apply(NOTIONS, NOUVELLES_LOISINF);
  else NOTIONS.splice.apply(NOTIONS, [iLim, 0].concat(NOUVELLES_LOISINF));
})();

/* ============================================================
   PROGRESSION : sous-catégorie dans « Probabilités & statistiques ».
   ============================================================ */
(function () {
  const sub = { nom: 'Lois continues & inférence statistique', ids: ['loi-normale', 'approx-poisson', 'loi-exponentielle', 'loi-uniforme', 'densite-proba', 'tcl-echantillon', 'estim-moyenne', 'tests-hyp', 'carte-controle'] };
  const cat = PROG_CATS.find(c => c.nom === 'Probabilités & statistiques');
  if (cat) cat.subs.push(sub);
  else PROG_CATS.push({ icon: '🎲', nom: 'Probabilités & statistiques', subs: [sub] });
})();

/* Formes 3D des nouveaux étages. */
document.addEventListener('DOMContentLoaded', function () {
  try {
    FLOOR_SHAPES['loi-normale']       = 'arch';
    FLOOR_SHAPES['approx-poisson']    = 'grid';
    FLOOR_SHAPES['loi-exponentielle'] = 'tree';
    FLOOR_SHAPES['loi-uniforme']      = 'checker';
    FLOOR_SHAPES['densite-proba']     = 'colonnade';
    FLOOR_SHAPES['tcl-echantillon']   = 'stairs';
    FLOOR_SHAPES['estim-moyenne']     = 'lighthouse';
    FLOOR_SHAPES['tests-hyp']         = 'arch';
    FLOOR_SHAPES['carte-controle']    = 'grid';
  } catch (e) { /* 'box' */ }
});
