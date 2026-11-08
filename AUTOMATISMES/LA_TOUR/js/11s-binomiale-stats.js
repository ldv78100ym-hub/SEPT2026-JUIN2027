/* ============================================================
   11s. LOI BINOMIALE, DISPERSION, FLUCTUATION, CONFIANCE &
   INCERTITUDES
   ============================================================
   Contenu tiré des documents du dépôt :
   • T_STI2D/PROBABILITE/LOI_BINOMIALE/LOI_BINOMIALE.html
     (« Crumble Hall — La loi binomiale, enquête en dix-sept
     pièces » : épreuve & schéma de Bernoulli, arbre, coefficients
     binomiaux, P(X=k), espérance/variance/écart-type) ;
   • STS_BIO_AC/STATISTIQUES (dispersion : étendue, variance,
     écart-type, « trois séries même moyenne », mesures de pH) ;
   • STS_BIO_AC/STATISTIQUES_INFERENTIELLES (échantillonnage,
     estimation, intervalles de fluctuation et de confiance) ;
   • STS_BIO_AC/ERREURS (calcul d'erreur : erreurs systématiques /
     aléatoires / grossières, justesse & fidélité, propagation des
     incertitudes, incertitudes relative et absolue).

   AJOUTE : 12 générateurs (GEN), 1 fiche (FICHES « inferentielles »)
   + compléments des fiches « probabilites » et « statistiques »,
   12 éléments simples (GEN_INFO), 5 notions (NOTIONS.splice avant
   « su-limites ») et 2 sous-catégories dans « Probabilités &
   statistiques » — la tour compte donc 206 étages (201 + 5).
   ============================================================ */

/* ------------------------------------------------------------
   GÉNÉRATEURS — loi binomiale & statistiques avancées
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
  /* Séparateur fin des milliers : \, */
  const texN = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');

  /* ---------- 1. Schéma de Bernoulli : dénombrer les chemins ---------- */
  GEN.binomSchema = () => {
    const n = R(3, 4), k = R(1, n - 1);
    const c = binom(n, k), tot = Math.pow(2, n);
    const good = frac(c, tot);
    const wrongs = [frac(n, tot), frac(k, tot), frac(c, n * k)];
    return QCM(
      `On lance ${n} fois une pièce équilibrée.<br>Quelle est la probabilité d'obtenir EXACTEMENT ${k} pile${k > 1 ? 's' : ''} ?`,
      M(good), uniq3(M(good), wrongs.map(w => M(w))), 1,
      EXPL(`Répéter ${n} fois une épreuve à deux issues (pile/probabilité \\(\\dfrac{1}{2}\\)) de façon IDENTIQUE et INDÉPENDANTE : c'est un schéma de Bernoulli. Le nombre de succès suit la loi binomiale \\(B\\left(${n}, \\dfrac{1}{2}\\right)\\).`,
        `Les chemins qui donnent ${k} piles se comptent par le coefficient binomial : \\(\\binom{${n}}{${k}} = ${c}\\) positions possibles pour les ${k} piles. Chaque chemin a la probabilité \\(\\left(\\dfrac{1}{2}\\right)^{${n}}\\) et il y a \\(${texN(tot)}\\) chemins au total : \\(P = \\binom{${n}}{${k}} \\times \\dfrac{1}{${texN(tot)}} = ${good}\\).`,
        `Le piège : croire que « ${k} piles » n'arrive que d'UNE seule façon (l'ordre compte !) ou oublier les autres chemins. Le coefficient binomial EST l'outil de comptage : \\(\\binom{${n}}{${k}} = ${c}\\) chemins, pas un seul.`));
  };

  /* ---------- 2. P(X = k) : la formule binomiale ---------- */
  GEN.binomPk = () => {
    const variant = R(1, 2);
    if (variant === 1) {
      const n = R(3, 6), p = pick([0.25, 0.5]);
      const k = R(1, n - 1);
      if (p === 0.5) {
        const good = frac(binom(n, k), Math.pow(2, n));
        const wrongs = [frac(k, n), frac(binom(n, k), Math.pow(2, k)), frac(binom(n, k), n * k)];
        return QCM(
          `Une pièce équilibrée est lancée ${n} fois.<br>Soit \\(X\\) le nombre de pile. \\(X\\) suit \\(B\\left(${n}, \\dfrac{1}{2}\\right)\\).<br>Que vaut \\(P(X = ${k})\\) ?`,
          M(good), uniq3(M(good), wrongs.map(w => M(w))), 1,
          EXPL(`Pour \\(X \\sim B(n, p)\\) : \\(P(X = k) = \\binom{n}{k} p^{k} (1-p)^{n-k}\\). Avec \\(p = \\dfrac{1}{2}\\), les deux puissances fusionnent : \\(P(X = k) = \\dfrac{1}{2^{n}}\\binom{n}{k}\\).`,
            `Ici : \\(P(X = ${k}) = \\binom{${n}}{${k}} \\times \\left(\\dfrac{1}{2}\\right)^{${k}} \\times \\left(\\dfrac{1}{2}\\right)^{${n - k}} = \\dfrac{${binom(n, k)}}{${Math.pow(2, n)}}\\).`,
            `Le piège : élever \\(p\\) à la puissance \\(k\\) et OUBLIER le facteur \\((1-p)^{n-k}\\) (les échecs comptent aussi), ou inverser (utiliser \\(p^{n-k}\\)). Les deux exposants doivent totaliser \\(n\\).`));
      }
      const n2 = 4, p2 = 0.25;
      const good = `\\binom{4}{k} \\times \\left(0{,}25\\right)^{k} \\times \\left(0{,}75\\right)^{4-k}`;
      const wrongs = [
        `\\binom{4}{k} \\times \\left(0{,}25\\right)^{k} \\times \\left(0{,}75\\right)^{k}`,
        `\\left(0{,}25\\right)^{k} \\times \\left(0{,}75\\right)^{4-k}`,
        `\\binom{4}{k} \\times \\left(0{,}25\\right)^{4-k} \\times \\left(0{,}75\\right)^{k}`
      ];
      return QCM(
        `Un QCM comporte 4 questions, chacune avec une bonne réponse parmi 4 (on répond au hasard).\\(X\\) = nombre de bonnes réponses suit \\(B\\left(4~;~0{,}25\\right)\\).<br>La formule générale de \\(P(X = k)\\) est :`,
        good, uniq3(good, wrongs), 1,
        EXPL(`Loi binomiale \\(B(n, p)\\) : \\(P(X = k) = \\binom{n}{k}\\, p^{k}\\, (1-p)^{n-k}\\). Trois ingrédients : le nombre de chemins, la probabilité des \\(k\\) succès, celle des \\(n-k\\) échecs.`,
        `Ici \\(n = 4\\), \\(p = 0{,}25\\) (une chance sur 4), \\(1 - p = 0{,}75\\) : \\(P(X = k) = \\binom{4}{k} \\times 0{,}25^{k} \\times 0{,}75^{4-k}\\). Exemple : \\(P(X = 2) = 6 \\times 0{,}0625 \\times 0{,}5625 = 0{,}2109\\).`,
        `Le piège : faire porter \\(p\\) à la puissance \\(k\\) mais coller \\((1-p)\\) à la même puissance (les échecs sont au nombre de \\(n - k\\), PAS \\(k\\)), ou permuter les exposants. Toujours contrôler : \\(k + (n - k) = n\\).`));
    }
    /* variante 2 : formule reconnue générique */
    const good = `\\binom{n}{k} \\, p^{k} \\, (1-p)^{n-k}`;
    const wrongs = [
      `\\binom{n}{k} \\, p^{k} \\, (1-p)^{k}`,
      `p^{k} \\, (1-p)^{n-k}`,
      `\\binom{n}{k} \\, p^{n-k} \\, (1-p)^{k}`
    ];
    return QCM(
      `\\(X\\) suit la loi binomiale \\(B(n~;~p)\\). Quelle est la formule de \\(P(X = k)\\) ?`,
      good, uniq3(good, wrongs), 1,
      EXPL(`Loi binomiale : \\(P(X = k) = \\binom{n}{k} p^{k} (1-p)^{n-k}\\). Le coefficient binomial compte les chemins, \\(p^k\\) pèse les succès, \\((1-p)^{n-k}\\) pèse les échecs.`,
        `Décomposition : choisir les \\(k\\) positions des succès parmi \\(n\\) \\(\\Rightarrow \\binom{n}{k}\\) ; chaque succès coûte \\(p\\), chaque échec \\((1-p)\\) ; on MULTIPLIE tout (indépendance).`,
        `Le piège classique : permuter les exposants ou remplacer \\(n-k\\) par \\(k\\). La somme des exposants fait TOUJOURS \\(n\\) : c'est le contrôle rapide avant de calculer.`));
  };

  /* ---------- 3. « Au moins un » : passer par le contraire ---------- */
  GEN.binomAuMoins = () => {
    const cas = pick([
      { n: 3, texte: `3 lancers d'une pièce équilibrée`, p: `\\dfrac{1}{2}`, q: `\\dfrac{1}{2}`, good: frac(7, 8) },
      { n: 4, texte: `4 lancers d'une pièce équilibrée`, p: `\\dfrac{1}{2}`, q: `\\dfrac{1}{2}`, good: frac(15, 16) },
      { n: 4, texte: `4 lancers d'un dé équilibré (au moins un six)`, p: `\\dfrac{1}{6}`, q: `\\dfrac{5}{6}`, good: `1 - \\left(\\dfrac{5}{6}\\right)^{4}` },
      { n: 5, texte: `5 lancers d'un dé équilibré (au moins un six)`, p: `\\dfrac{1}{6}`, q: `\\dfrac{5}{6}`, good: `1 - \\left(\\dfrac{5}{6}\\right)^{5}` }
    ]);
    const wrongs = [
      cas.n === 4 && cas.p === `\\dfrac{1}{6}` ? `\\left(\\dfrac{1}{6}\\right)^{4}` : `${cas.good === '\\dfrac{7}{8}' ? frac(1, 8) : frac(1, 16)}`,
      cas.p === `\\dfrac{1}{6}` ? `1 - \\left(\\dfrac{1}{6}\\right)^{${cas.n}}` : frac(3, 8),
      cas.p === `\\dfrac{1}{6}` ? `${cas.n} \\times \\dfrac{1}{6}` : `\\dfrac{${cas.n}}{2}`
    ];
    return QCM(
      `On effectue ${cas.texte}.<br>Quelle est la probabilité d'obtenir AU MOINS UN succès ?`,
      M(cas.good), uniq3(M(cas.good), wrongs.map(w => M(w))), 1,
      EXPL(`« Au moins un » = événement CONTRAIRE de « aucun ». Il est toujours plus rapide de calculer \\(P(\\text{aucun})\\) puis de compléter : \\(P(\\text{au moins un}) = 1 - P(\\text{aucun})\\).`,
        `Aucun succès en ${cas.n} essais indépendants : \\(\\left(${cas.q}\\right)^{${cas.n}}\\). Donc \\(P = 1 - \\left(${cas.q}\\right)^{${cas.n}}\\)${typeof cas.good === 'string' && cas.good.startsWith('1 -') ? '' : ` = ${cas.good}`}.`,
        `Le piège : additionner les probabilités (« ${cas.n} essais, donc ${cas.n} fois la probabilité ») — l'événement « au moins un » n'est pas disjoint, l'addition compte plusieurs fois le même chemin. Le contraire est le seul chemin propre.`));
  };

  /* ---------- 4. Espérance de la loi binomiale ---------- */
  GEN.binomEsperance = () => {
    const cas = pick([[10, 0.3], [20, 0.15], [50, 0.02], [100, 0.05], [4, 0.75], [40, 0.1]]);
    const n = cas[0], p = cas[1];
    const pt = String(p).replace('.', '{,}');
    const good = `${Math.round(n * p * 100) / 100}`.replace('.', '{,}');
    const wrongs = [`${(n * p * 10).toFixed(1)}`.replace('.', '{,}'), `${n}`.replace(/(\d)(?=(\d{3})+$)/g, '$1\\,'), pt];
    return QCM(
      `Un qcm comporte ${n} questions ; chaque réponse au hasard a une probabilité ${pt} d'être juste.<br>En moyenne, combien de bonnes réponses peut-on espérer ?`,
      M(good), uniq3(M(good), wrongs.map(w => M(w))), 1,
      EXPL(`Pour \\(X \\sim B(n~;~p)\\), l'espérance vaut \\(E(X) = n p\\) : le nombre d'épreuves multiplié par la probabilité de succès de chacune.`,
        `Ici \\(E(X) = ${n} \\times ${pt} = ${good}\\) bonne${Math.round(n * p) === 1 ? ' réponse' : 's réponse'} en moyenne.`,
        `Le piège : répondre \\(p\\) seul, ou \\(n\\) seul, ou pire \\(n + p\\). L'espérance est LINÉAIRE : elle additionne les \\(n\\) petits espoirs \\(p\\) de chaque épreuve. Si on répète l'expérience, la moyenne observée s'approche de \\(np\\) (loi des grands nombres).`));
  };

  /* ---------- 5. Variance & écart-type de la loi binomiale ---------- */
  GEN.binomEcartType = () => {
    const cas = pick([
      { n: 16, p: '0{,}5', pn: 0.5, V: 4, s: 2 },
      { n: 100, p: '0{,}1', pn: 0.1, V: 9, s: 3 },
      { n: 50, p: '0{,}2', pn: 0.2, V: 8, s: Math.sqrt(8) },
      { n: 4, p: '0{,}5', pn: 0.5, V: 1, s: 1 }
    ]);
    const demande = pick(['variance', 'ecarttype']);
    if (demande === 'variance') {
      const good = `${cas.V}`;
      const wrongs = [`${cas.V * 2}`, `${cas.V + 2}`, `${cas.n}`];
      return QCM(
        `\\(X\\) suit la loi binomiale \\(B\\left(${cas.n}~;~${cas.p}\\right)\\).<br>Que vaut \\(V(X)\\) ?`,
        M(good), uniq3(M(good), wrongs.map(w => M(w))), 1,
        EXPL(`Pour \\(X \\sim B(n~;~p)\\) : \\(V(X) = n p (1-p)\\). L'écart-type en est la racine : \\(\\sigma = \\sqrt{n p (1-p)}\\).`,
          `Ici : \\(V(X) = ${cas.n} \\times ${cas.p} \\times ${String(1 - cas.pn).replace('.', '{,}')} = ${cas.V}\\)${cas.s === Math.round(cas.s) ? ` (et \\(\\sigma = ${cas.s}\\))` : ` (et \\(\\sigma = \\sqrt{${cas.V}} \\approx 2{,}8\\))`}.`,
          `Le piège : oublier le facteur \\((1-p)\\) — la variance n'est PAS \\(np\\) (ça, c'est l'espérance !). Quand \\(p\\) s'éloigne de \\(\\dfrac{1}{2}\\), la variance DIMINUE : une pièce équilibrée est la situation la plus « dispersée ».`));
    }
    const good = cas.s === Math.round(cas.s) ? `${cas.s}` : `\\sqrt{${cas.V}}`;
    const wrongs = [`${cas.V}`, `${cas.n}`, `\\dfrac{${cas.V}}{2}`];
    return QCM(
      `\\(X\\) suit la loi binomiale \\(B\\left(${cas.n}~;~${cas.p}\\right)\\).<br>Que vaut l'écart-type \\(\\sigma(X)\\) ?`,
      M(good), uniq3(M(good), wrongs.map(w => M(w))), 1,
      EXPL(`Pour \\(X \\sim B(n~;~p)\\) : \\(\\sigma = \\sqrt{V(X)} = \\sqrt{n p (1-p)}\\). L'écart-type mesure l'écart typique à la moyenne \\(np\\).`,
        `Ici : \\(V(X) = ${cas.V}\\), donc \\(\\sigma = \\sqrt{${cas.V}}\\)${cas.s === Math.round(cas.s) ? ` = ${cas.s}` : ` \\approx 2{,}8`}.`,
        `Le piège : confondre variance et écart-type — l'écart-type est la RACINE de la variance. Les valeurs typiques de \\(X\\) se situent entre \\(np - 2\\sigma\\) et \\(np + 2\\sigma\\).`));
  };

  /* ---------- 6. Dispersion d'une série : variance & écart-type ---------- */
  GEN.statVariance = () => {
    const serie = pick([
      { vals: [4, 5, 6, 8, 9, 10], mean: 7, devs: '(-3~;~-2~;~-1~;~1~;~2~;~3)', sumsq: 28, V: '\\dfrac{14}{3}', Vnum: 14, Vden: 3, sigma: '\\sqrt{\\dfrac{14}{3}} \\approx 2{,}16' },
      { vals: [2, 4, 6, 8], mean: 5, devs: '(-3~;~-1~;~1~;~3)', sumsq: 20, V: '5', Vnum: 5, Vden: 1, sigma: '\\sqrt{5} \\approx 2{,}24' },
      { vals: [6, 6, 8, 10], mean: 7.5, devs: '(-1{,}5~;~-1{,}5~;~0{,}5~;~2{,}5)', sumsq: 11, V: '\\dfrac{11}{4}', Vnum: 11, Vden: 4, sigma: '\\sqrt{\\dfrac{11}{4}} \\approx 1{,}66' }
    ]);
    const good = serie.Vden === 1 ? serie.V : serie.V;
    const wrongs = [`${serie.sumsq}`, serie.Vden === 1 ? `${serie.vals.length}` : `\\dfrac{${serie.sumsq}}{${serie.vals.length + 2}}`, `${serie.vals[serie.vals.length - 1] - serie.vals[0]}`];
    return QCM(
      `Une série de mesures : ${serie.vals.join(' ; ')}.<br>La moyenne vaut ${String(serie.mean).replace('.', ',')}.<br>Que vaut la variance ?`,
      M(good), uniq3(M(good), wrongs.map(w => M(w))), 1,
      EXPL(`La variance est la moyenne des CARRÉS des écarts à la moyenne : \\(V = \\dfrac{1}{n}\\sum (x_i - \\bar x)^{2}\\). L'écart-type \\(\\sigma = \\sqrt{V}\\) en est la racine carrée.`,
        `Écarts à la moyenne : \\(${serie.devs}\\). Carrés sommés : \\(${serie.sumsq}\\). Divisé par \\(${serie.vals.length}\\) valeurs : \\(V = \\dfrac{${serie.sumsq}}{${serie.vals.length}}${serie.Vden === 1 ? ` = ${serie.V}` : ` = ${serie.V}`}\\)${serie.Vden !== 1 ? '' : ''} (\\(\\sigma = ${serie.sigma}\\)).`,
        `Le piège : sommer les écarts SANS les élever au carré (la somme des écarts fait toujours 0 !), ou diviser par \\(n-1\\) ici — les manuels BTS présentent la version \\(n-1\\) pour ESTIMER la variance d'une population à partir d'un échantillon ; pour DÉCRIRE une série complète, on divise par \\(n\\).`));
  };

  /* ---------- 7. Trois séries, même moyenne : comparer la dispersion ---------- */
  GEN.statCompare = () => {
    const cas = pick([
      { A: '6 ; 7 ; 8', B: '2 ; 7 ; 12', Bplus: 'B', ecart: 'immense', raison: `B va de 2 à 12 : ses valeurs s'éloignent beaucoup de 7` },
      { A: '9 ; 10 ; 11', B: '4 ; 10 ; 16', Bplus: 'B', ecart: 'immense', raison: `B va de 4 à 16 : ses valeurs s'éloignent beaucoup de 10` },
      { A: '19 ; 20 ; 21', B: '12 ; 20 ; 28', Bplus: 'B', ecart: 'immense', raison: `B va de 12 à 28 : ses valeurs s'éloignent beaucoup de 20` }
    ]);
    const good = `la série B est la plus dispersée : étendue et écart-type plus grands, alors que la moyenne est identique`;
    const wrongs = [
      `les deux séries sont identiques : même moyenne = même dispersion`,
      `la série A est la plus dispersée : ses valeurs sont plus proches de la moyenne`,
      `impossible à savoir sans calculer la médiane des deux séries`
    ];
    return QCM(
      `Deux séries de mesures de pH :<br> série A = ${cas.A} ; série B = ${cas.B}.<br>Elles ont la même moyenne. Laquelle est la plus dispersée ?`,
      good, uniq3(good, wrongs), 1,
      EXPL(`La moyenne ne dit RIEN de la dispersion : deux séries peuvent avoir la même moyenne et des écarts à la moyenne très différents. Étendue, variance et écart-type mesurent la dispersion.`,
        `Ici ${cas.raison} (étendue de B bien plus grande), tandis que A reste resserrée autour de la moyenne. L'écart-type de B sera donc plus grand — c'est le critère chiffré.`,
        `Le piège : croire « même moyenne ⇒ mêmes statistiques ». En contrôle qualité (pH, dosage), une série TRÈS dispersée révèle un procédé instable même si la moyenne est conforme : c'est pour ça qu'on surveille l'écart-type, pas seulement la moyenne.`));
  };

  /* ---------- 8. Intervalle de fluctuation : tester une annonce ---------- */
  GEN.fluctuation = () => {
    const cas = pick([
      { n: 100, p: '0{,}5', pf: 0.5, ifa: '[0{,}40~;~0{,}60]', fobs: '0{,}68', dehors: true, annonce: `un candidat annonce 50 % d'intentions de vote` },
      { n: 100, p: '0{,}45', pf: 0.45, ifa: '[0{,}35~;~0{,}55]', fobs: '0{,}52', dehors: false, annonce: `un candidat annonce 45 % d'intentions de vote` },
      { n: 100, p: '0{,}9', pf: 0.9, ifa: '[0{,}80~;~1{,}00]', fobs: '0{,}74', dehors: true, annonce: `un fabricant annonce 90 % de pièces conformes` }
    ]);
    const good = cas.dehors
      ? `la fréquence observée SORT de l'intervalle de fluctuation : au seuil de 95 %, l'annonce est mise en doute`
      : `la fréquence observée tombe DANS l'intervalle de fluctuation : au seuil de 95 %, l'annonce n'est pas remise en cause`;
    const wrongs = [
      `la fréquence observée sort de l'intervalle : l'annonce est donc prouvée fausse à 100 %`,
      `la fréquence observée est proche de la probabilité annoncée : les deux valeurs coïncident`,
      `l'échantillon est trop petit pour qu'on puisse conclure quoi que ce soit`
    ];
    return QCM(
      `Sur ${cas.n} tirages, ${cas.annonce}. La fréquence observée vaut ${cas.fobs}.<br>L'intervalle de fluctuation à 95 % (pour \\(n = ${cas.n}\\), \\(p = ${cas.p}\\)) est ${cas.ifa}.<br>Quelle conclusion ?`,
      good, uniq3(good, wrongs), 1,
      EXPL(`Si la proportion annoncée \\(p\\) est vraie, la fréquence observée sur \\(n \\geq 25\\) tirages tombe dans l'intervalle de fluctuation \\(\\left[p - \\dfrac{1}{\\sqrt{n}}~;~p + \\dfrac{1}{\\sqrt{n}}\\right]\\) avec une probabilité d'environ 95 %.`,
        `Ici \\(\\dfrac{1}{\\sqrt{${cas.n}}} = 0{,}10\\) : l'IF est ${cas.ifa}. La fréquence observée ${cas.fobs} est ${cas.dehors ? 'EN DEHORS' : "à l'intérieur"} : ${cas.dehors ? `l'hypothèse \\(p = ${cas.p}\\) est REJETÉE au seuil de 5 % — le hasard seul l'expliquerait dans moins de 5 % des cas.` : `l'hypothèse \\(p = ${cas.p}\\) est CONSERVÉE : l'écart observé reste compatible avec le hasard.`}`,
        `Le piège : conclure à une « preuve à 100 % ». Un test statistique ne rejette JAMAIS avec certitude : au seuil de 5 %, il reste une chance de se tromper (rejeter une annonce pourtant vraie). Autre piège : comparer \\(p\\) et la fréquence à la main au lieu d'utiliser l'intervalle — le seuil \\(\\dfrac{1}{\\sqrt{n}}\\) matérialise le bruit du hasard.`));
  };

  /* ---------- 9. Intervalle de confiance : estimer une proportion ---------- */
  GEN.confiance = () => {
    const cas = pick([
      { n: 400, f: '0{,}52', fn: 0.52, m: '0{,}05', ic: '[0{,}47~;~0{,}57]' },
      { n: 100, f: '0{,}30', fn: 0.30, m: '0{,}10', ic: '[0{,}20~;~0{,}40]' },
      { n: 900, f: '0{,}62', fn: 0.62, m: '0{,}033', ic: '[0{,}587~;~0{,}653]' },
      { n: 2500, f: '0{,}41', fn: 0.41, m: '0{,}02', ic: '[0{,}39~;~0{,}43]' }
    ]);
    const good = cas.ic;
    const wrongs = [
      `[${(cas.fn - 2 * (1 / Math.sqrt(cas.n))).toFixed(3).replace('.', '{,}')}~;~${(cas.fn + 2 * (1 / Math.sqrt(cas.n))).toFixed(3).replace('.', '{,}')}]`,
      `[${(cas.fn - 0.005).toFixed(3).replace('.', '{,}')}~;~${(cas.fn + 0.005).toFixed(3).replace('.', '{,}')}]`,
      `[${(cas.fn / 2).toFixed(2).replace('.', '{,}')}~;~${Math.min(1, cas.fn + 0.3).toFixed(2).replace('.', '{,}')}]`
    ];
    return QCM(
      `Un sondage auprès de ${cas.n} personnes donne une fréquence de ${cas.f}.<br>Quel est l'intervalle de confiance à 95 % de la proportion ?`,
      M(good), uniq3(M(good), wrongs.map(w => M(w))), 1,
      EXPL(`On ne connaît pas la vraie proportion \\(p\\) : on l'ESTIME à partir de la fréquence observée \\(f\\). Au niveau de 95 % : \\(IC = \\left[f - \\dfrac{1}{\\sqrt{n}}~;~f + \\dfrac{1}{\\sqrt{n}}\\right]\\).`,
        `Ici \\(\\dfrac{1}{\\sqrt{${cas.n}}} = ${cas.m}\\) : \\(IC = [${cas.f} - ${cas.m}~;~${cas.f} + ${cas.m}] = ${cas.ic}\\). On a 95 chances sur 100 que la vraie proportion y soit.`,
        `Le piège : confondre intervalle de FLUCTUATION (\\(p\\) connue, on teste une observation) et intervalle de CONFIANCE (\\(p\\) inconnue, on estime à partir de \\(f\\)). Autre piège : croire que \\(n = ${cas.n}\\) suffit à cerner \\(p\\) précisément — la marge \\(\\dfrac{1}{\\sqrt{n}}\\) ne se RéDUIT qu'en quadruplant l'échantillon !`));
  };

  /* ---------- 10. Incertitude relative ---------- */
  GEN.incertRelative = () => {
    const cas = pick([
      { x: '25', u: '0{,}5', xn: 25, un: 0.5, pct: '2' },
      { x: '100', u: '1', xn: 100, un: 1, pct: '1' },
      { x: '80', u: '4', xn: 80, un: 4, pct: '5' },
      { x: '400', u: '2', xn: 400, un: 2, pct: '0{,}5' }
    ]);
    const good = `${cas.pct} \\%`;
    const wrongs = [`${cas.u} \\%`, `${(parseFloat(cas.pct.replace('{,}', '.')) * 10).toString().replace('.', '{,}')} \\%`, `${parseFloat(cas.x.replace('{,}', '.'))} \\%`];
    return QCM(
      `Une longueur mesurée : \\(L = ${cas.x} \\pm ${cas.u}\\) cm.<br>Quelle est l'incertitude RELATIVE de cette mesure ?`,
      M(good), uniq3(M(good), wrongs.map(w => M(w))), 1,
      EXPL(`L'incertitude relative compare l'incertitude ABSOLUE \\(u\\) à la valeur mesurée : \\(\\dfrac{u}{x} \\times 100\\,\\%\\). Elle dit « à quel point la mesure est fiable », indépendamment de l'ordre de grandeur.`,
        `Ici : \\(\\dfrac{${cas.u}}{${cas.x}} \\times 100\\,\\% = ${cas.pct}\\,\\%\\).`,
        `Le piège : donner l'incertitude ABSOLUE (${cas.u} cm) au lieu de la relative, ou diviser en sens inverse (\\(x/u\\)). En laboratoire, une incertitude relative est souvent exigée sous la forme « résultat ± X % » : c'est elle qui permet de comparer la qualité de deux mesures d'ordres de grandeur différents.`));
  };

  /* ---------- 11. Propagation des incertitudes ---------- */
  GEN.incertPropagation = () => {
    const cas = pick([
      { type: 'somme', texte: `Le périmètre vaut \\(P = L + l\\) : \\(L = 12 \\pm 0{,}1\\) cm et \\(l = 7 \\pm 0{,}1\\) cm.<br>Incertitude absolue sur \\(P\\) ?`, good: `0{,}2\\ \\text{cm}`, wr: [`0{,}1\\ \\text{cm}`, `0{,}01\\ \\text{cm}`, `1{,}9\\ \\text{cm}`], exp: `Pour une somme (ou différence), les incertitudes absolues S'ADDITIONNENT : \\(u(L + l) = u(L) + u(l)\\)` },
      { type: 'produit', texte: `Une surface \\(S = L \\times l\\) avec \\(\\dfrac{u(L)}{L} = 2\\,\\%\\) et \\(\\dfrac{u(l)}{l} = 3\\,\\%\\).<br>Incertitude relative sur \\(S\\) ?`, good: `5\\ \\%`, wr: [`6\\ \\%`, `1\\ \\%`, `1{,}5\\ \\%`], exp: `Pour un produit, les incertitudes RELATIVES s'additionnent : \\(\\dfrac{u(S)}{S} = \\dfrac{u(L)}{L} + \\dfrac{u(l)}{l}\\)` }
    ]);
    return QCM(
      cas.texte,
      M(cas.good), uniq3(M(cas.good), cas.wr.map(w => M(w))), 1,
      EXPL(`Les incertitudes se propagent selon l'opération : SOMME ou DIFFÉRENCE → on additionne les incertitudes ABSOLUES ; PRODUIT ou QUOTIENT → on additionne les incertitudes RELATIVES.`,
        `Ici : ${cas.exp}. ${cas.type === 'somme' ? `\\(u(P) = 0{,}1 + 0{,}1 = 0{,}2\\) cm (le périmètre vaut \\(19 \\pm 0{,}2\\) cm).` : `\\(\\dfrac{u(S)}{S} = 2\\,\\% + 3\\,\\% = 5\\,\\%\\).`}`,
        `Le piège : additionner des incertitudes relatives pour une somme (ça n'a pas de sens : 2 % de 12 cm et 1 % de 7 cm ne « pèsent » pas pareil), ou multiplier les incertitudes. Les PHYSICIENS majorisent : l'addition donne la PIRE hypothèse cohérente — certains cours utilisent la quadrature \\(\\sqrt{u_1^2 + u_2^2}\\) pour des incertitudes indépendantes, mais l'addition reste le majorant sûr.`));
  };

  /* ---------- 12. Justesse & fidélité ---------- */
  GEN.justesseFidelite = () => {
    const cas = pick([
      { texte: `donne toujours 12{,}03 g, avec une dispersion quasi nulle, pour un objet étalon de 12{,}00 g`, good: `fidèle mais pas juste : erreur systématique (toujours dans le même sens)`,
        wr: [`juste mais pas fidèle : les valeurs varient autour de la vraie`, `juste et fidèle : rien à signaler`, `ni juste ni fidèle : tout est faux`] },
      { texte: `donne tour à tour 11{,}8, 12{,}2, 11{,}9, 12{,}3 g pour un étalon de 12{,}00 g`, good: `juste en moyenne mais pas fidèle : la moyenne tombe juste, les valeurs s'écartent (erreurs aléatoires)`,
        wr: [`fidèle mais pas juste : elle répète toujours la même valeur fausse`, `ni juste ni fidèle : tout est faux`, `juste et fidèle : la moyenne suffit`] }
    ]);
    return QCM(
      `Une balance ${cas.texte}.<br>Comment qualifier ce résultat de mesure ?`,
      cas.good, uniq3(cas.good, cas.wr), 1,
      EXPL(`Deux qualités distinctes : la JUSTESSE (accuracy — la moyenne est proche de la valeur vraie : pas d'erreur systématique) et la FIDÉLITÉ (precision — les mesures sont resserrées : peu d'erreurs aléatoires).`,
        `Ici : ${cas.good.includes('fidèle mais pas juste') ? `les mesures sont regroupées (fidèle) mais décalées de +0,03 g en moyenne (pas juste) : un étalonnage corrigerait l'erreur systématique.` : `la moyenne tombe sur la valeur vraie (juste) mais la dispersion est grande (pas fidèle) : le protocole ou l'appareil introduit du bruit.`}`,
        `Le piège : croire qu'une mesure répétée et stable est forcément exacte. Une balance FIDÈLE peut être FAUSSE systématiquement — la répétition ne corrige JAMAIS une erreur systématique, seul l'étalonnage (ou un autre instrument) le peut. Idem en statistiques : un estimateur peut être précis et biaisé.`));
  };
})();

/* ------------------------------------------------------------
   FICHE — Statistique inférentielle & incertitudes
   ------------------------------------------------------------ */
Object.assign(FICHES, {
  'inferentielles': { titre: '🧪 Fluctuation, confiance & incertitudes', html: `
    <p><b>Loi binomiale :</b> répéter \\(n\\) fois une épreuve de Bernoulli (deux issues, probabilité \\(p\\), indépendance) : \\(X \\sim B(n~;~p)\\). \\(P(X = k) = \\binom{n}{k} p^{k} (1-p)^{n-k}\\) ; « au moins un succès » \\(= 1 - (1-p)^{n}\\) ; \\(E(X) = np\\), \\(V(X) = np(1-p)\\), \\(\\sigma = \\sqrt{np(1-p)}\\).</p>
    <p><b>Dispersion d'une série :</b> variance \\(V = \\dfrac{1}{n}\\sum (x_i - \\bar x)^{2}\\), écart-type \\(\\sigma = \\sqrt{V}\\). Deux séries de même moyenne peuvent être très différemment dispersées : en contrôle qualité, l'écart-type révèle un procédé instable.</p>
    <p><b>Intervalle de fluctuation à 95 % (\\(p\\) connue, on teste une fréquence) :</b> \\(\\left[p - \\dfrac{1}{\\sqrt{n}}~;~p + \\dfrac{1}{\\sqrt{n}}\\right]\\). Si la fréquence observée sort de l'IF, l'hypothèse est rejetée au seuil de 5 %.</p>
    <p><b>Intervalle de confiance à 95 % (\\(p\\) inconnue, on estime) :</b> \\(\\left[f - \\dfrac{1}{\\sqrt{n}}~;~f + \\dfrac{1}{\\sqrt{n}}\\right]\\). Réduire la marge de moitié exige un échantillon 4 fois plus grand.</p>
    <p><b>Incertitudes (mesures) :</b> incertitude relative \\(= \\dfrac{u}{x} \\times 100\\,\\%\\). Propagation : somme/différence → on additionne les absolues ; produit/quotient → on additionne les RELATIVES. Justesse (moyenne proche de la vraie) ≠ fidélité (mesures resserrées) : la répétition ne corrige pas une erreur systématique.</p>` }
});

/* Compléments des fiches existantes */
(function () {
  if (FICHES['probabilites'] && FICHES['probabilites'].html) {
    FICHES['probabilites'].html += `
    <hr>
    <p><b>Loi binomiale \\(B(n~;~p)\\) :</b> répétition indépendante de \\(n\\) épreuves de Bernoulli. \\(P(X = k) = \\binom{n}{k} p^{k}(1-p)^{n-k}\\) ; « au moins un » par l'événement contraire \\(1 - (1-p)^{n}\\) ; \\(E = np\\), \\(\\sigma = \\sqrt{np(1-p)}\\).</p>`;
  }
  if (FICHES['statistiques'] && FICHES['statistiques'].html) {
    FICHES['statistiques'].html += `
    <hr>
    <p><b>Dispersion :</b> variance \\(V = \\dfrac{\\sum (x_i - \\bar x)^{2}}{n}\\) et écart-type \\(\\sigma = \\sqrt{V}\\) complètent la moyenne : deux séries de même moyenne peuvent être plus ou moins dispersées (contrôle qualité, pH, dosages).</p>
    <p><b>Inférence :</b> intervalle de fluctuation \\(\\left[p - \\dfrac{1}{\\sqrt{n}}~;~p + \\dfrac{1}{\\sqrt{n}}\\right]\\) quand \\(p\\) est annoncée ; intervalle de confiance \\(\\left[f - \\dfrac{1}{\\sqrt{n}}~;~f + \\dfrac{1}{\\sqrt{n}}\\right]\\) quand on estime \\(p\\) par la fréquence \\(f\\).</p>`;
  }
})();

/* ------------------------------------------------------------
   ÉLÉMENTS SIMPLES : libellé + rappel + fiches des 12 générateurs
   ------------------------------------------------------------ */
Object.assign(GEN_INFO, {
  'binomSchema':     { label: 'Schéma de Bernoulli : compter les chemins', fiches: ['probabilites', 'inferentielles'],
    rappel: `\\(n\\) épreuves identiques et indépendantes : les chemins à \\(k\\) succès se comptent avec \\(\\binom{n}{k}\\).` },
  'binomPk':         { label: 'P(X = k) : la formule binomiale', fiches: ['probabilites', 'inferentielles'],
    rappel: `\\(P(X = k) = \\binom{n}{k} p^{k} (1-p)^{n-k}\\) : chemins × succès × échecs, exposants totalisant \\(n\\).` },
  'binomAuMoins':    { label: "« Au moins un » : l'événement contraire", fiches: ['probabilites', 'inferentielles'],
    rappel: `\\(P(\\text{au moins un}) = 1 - P(\\text{aucun}) = 1 - (1-p)^{n}\\).` },
  'binomEsperance':  { label: "Espérance d'une binomiale : np", fiches: ['probabilites'],
    rappel: `\\(E(X) = np\\) : le nombre d'épreuves multiplié par la probabilité de chaque succès.` },
  'binomEcartType':  { label: 'Variance & écart-type : np(1−p)', fiches: ['probabilites', 'statistiques'],
    rappel: `\\(V(X) = np(1-p)\\) puis \\(\\sigma = \\sqrt{np(1-p)}\\) — pas \\(np\\) (c'est l'espérance).` },
  'statVariance':    { label: "Variance & écart-type d'une série", fiches: ['statistiques'],
    rappel: `\\(V = \\dfrac{1}{n}\\sum (x_i - \\bar x)^{2}\\), \\(\\sigma = \\sqrt{V}\\) : moyenne des carrés des écarts à la moyenne.` },
  'statCompare':     { label: 'Même moyenne, dispersions différentes', fiches: ['statistiques'],
    rappel: `La moyenne ignore la dispersion : étendue et écart-type disent si la série est stable ou erratique.` },
  'fluctuation':     { label: 'Intervalle de fluctuation à 95 %', fiches: ['inferentielles', 'statistiques'],
    rappel: `\\(p\\) connue : \\(\\left[p - \\dfrac{1}{\\sqrt{n}}~;~p + \\dfrac{1}{\\sqrt{n}}\\right]\\) — une fréquence qui sort remet \\(p\\) en cause (seuil 5 %).` },
  'confiance':       { label: 'Intervalle de confiance à 95 %', fiches: ['inferentielles', 'statistiques'],
    rappel: `\\(p\\) inconnue : \\(\\left[f - \\dfrac{1}{\\sqrt{n}}~;~f + \\dfrac{1}{\\sqrt{n}}\\right]\\) à partir de la fréquence observée.` },
  'incertRelative':  { label: 'Incertitude relative u/x × 100', fiches: ['inferentielles', 'unites'],
    rappel: `\\(\\dfrac{u}{x} \\times 100\\,\\%\\) : la qualité d'une mesure, indépendante de son ordre de grandeur.` },
  'incertPropagation': { label: 'Propagation : absolues vs relatives', fiches: ['inferentielles'],
    rappel: `Somme/différence → addition des ABSOLUES ; produit/quotient → addition des RELATIVES.` },
  'justesseFidelite': { label: "Justesse & fidélité d'une mesure", fiches: ['inferentielles', 'statistiques'],
    rappel: `Justesse : moyenne proche de la vraie (pas d'erreur systématique). Fidélité : mesures resserrées. La répétition ne corrige pas un biais.` }
});

/* ============================================================
   5 NOTIONS NOUVELLES (→ 206 étages, avant les « limites »)
   ============================================================ */
const NOUVELLES_STATS = [
  { id: 'binomiale',          name: 'Loi binomiale : schéma & P(X=k)',        g: ['binomSchema', 'binomPk', 'binomAuMoins'],  family: 'blue', prob: 0.5 },
  { id: 'binom-parametres',   name: 'Binomiale : espérance, variance, écart-type', g: ['binomEsperance', 'binomEcartType'], family: 'blue', prob: 0.5 },
  { id: 'stats-dispersion',   name: 'Dispersion : variance & écart-type',     g: ['statVariance', 'statCompare'],          family: 'orange', prob: 0.5 },
  { id: 'estim-intervalles',  name: 'Fluctuation & confiance : estimer',      g: ['fluctuation', 'confiance'],             family: 'teal', prob: 0.5 },
  { id: 'incertitudes',       name: "Incertitudes & calcul d'erreur",         g: ['incertRelative', 'incertPropagation', 'justesseFidelite'], family: 'violet', prob: 0.5 }
];
(function () {
  const iLim = NOTIONS.findIndex(n => n.id === 'su-limites');
  if (iLim < 0) NOTIONS.push.apply(NOTIONS, NOUVELLES_STATS);
  else NOTIONS.splice.apply(NOTIONS, [iLim, 0].concat(NOUVELLES_STATS));
})();

/* ============================================================
   PROGRESSION : 2 sous-catégories dans « Probabilités &
   statistiques ».
   ============================================================ */
(function () {
  const cat = PROG_CATS.find(c => c.nom === 'Probabilités & statistiques');
  const s1 = { nom: 'Loi binomiale & paramètres', ids: ['binomiale', 'binom-parametres'] };
  const s2 = { nom: 'Dispersion, estimation & incertitudes', ids: ['stats-dispersion', 'estim-intervalles', 'incertitudes'] };
  if (cat) { cat.subs.push(s1); cat.subs.push(s2); }
  else PROG_CATS.push({ icon: '🎲', nom: 'Probabilités & statistiques', subs: [s1, s2] });
})();

/* Formes 3D des nouveaux étages. */
document.addEventListener('DOMContentLoaded', function () {
  try {
    FLOOR_SHAPES['binomiale']        = 'tree';
    FLOOR_SHAPES['binom-parametres'] = 'grid';
    FLOOR_SHAPES['stats-dispersion'] = 'checker';
    FLOOR_SHAPES['estim-intervalles'] = 'colonnade';
    FLOOR_SHAPES['incertitudes']     = 'lighthouse';
  } catch (e) { /* 'box' */ }
});
