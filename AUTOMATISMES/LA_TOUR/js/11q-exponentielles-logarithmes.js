/* ============================================================
   11q. EXPONENTIELLES & LOGARITHMES — BASE a, LOG DÉCIMAL,
   SEUILS EXPONENTIELS, REPÈRES LOG, LN & EXP
   ============================================================
   Contenu tiré des documents du dépôt :
   • T_STI2D/EXPONENTIELLES (cours & exercices « Fonctions
     exponentielles de base a », L'Odyssée de l'exponentielle,
     Le Levain Sacré, La Quête de l'Exponentielle) ;
   • T_STI2D/LOG-DECIMAL/eleve (7 leçons : découverte, définition
     & variations, propriétés, équations, seuils exponentiels
     2ⁿ > 10⁶, repères logarithmiques, quiz & formulaire) ;
   • TG_MATHS_COMP/FONCTIONS (MATHS_COMP_S1-A-S3, section 4 :
     logarithme népérien & exponentielle, croissances comparées).

   AJOUTE : 11 générateurs (GEN), 1 fiche (FICHES
   « exponentielles-logarithmes »), 11 éléments simples (GEN_INFO),
   4 notions (NOTIONS.splice avant « su-limites ») et 1 catégorie
   de progression « 🔋 Exponentielles & logarithmes » — la tour
   compte donc 200 étages (196 + 4).
   ============================================================ */

/* ------------------------------------------------------------
   GÉNÉRATEURS — exponentielles, logarithme décimal, ln & exp
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
  const sp = (s) => `\\left(${s}\\right)`;

  /* ---------- 1. Propriétés algébriques de a^x ---------- */
  GEN.expoProps = () => {
    const a = pick([2, 3, 5, 10]), u = R(2, 5), v = R(2, 4);
    const variant = R(1, 3);
    let good, wrongs, prompt, cours;
    if (variant === 1) {
      good = `${a}^{${u + v}}`;
      wrongs = [`${a}^{${u * v}}`, `${a * a}^{${u + v}}`, `${a}^{${u}} + ${a}^{${v}}`];
      prompt = `Simplifie l'expression :<br>\\(A = ${a}^{${u}} \\times ${a}^{${v}}\\)`;
      cours = `Pour une base \\(a \\gt 0\\) fixée : \\(a^u \\times a^v = a^{u+v}\\). On ADDITIONNE les exposants, jamais les bases.`;
    } else if (variant === 2) {
      good = `${a}^{${u - v}}`;
      wrongs = [`${a}^{${u * v}}`, `${a}^{${v - u}}`, `${a}^{${u}} - ${a}^{${v}}`];
      prompt = `Simplifie l'expression :<br>\\(B = \\dfrac{${a}^{${u}}}{${a}^{${v}}}\\)`;
      cours = `Pour une base \\(a \\gt 0\\) fixée : \\(\\dfrac{a^u}{a^v} = a^{u-v}\\). On SOUSTRAIT les exposants.`;
    } else {
      good = `${a}^{${u * v}}`;
      wrongs = [`${a}^{${u + v}}`, sp(`${a}^{${u}}`) + `^{${v}}`, `${a * a}^{${u * v}}`];
      prompt = `Simplifie l'expression :<br>\\(C = ${u === 0 ? '' : ''}\\left(${a}^{${u}}\\right)^{${v}}\\)`;
      cours = `Pour une base \\(a \\gt 0\\) fixée : \\(\\left(a^u\\right)^v = a^{uv}\\). On MULTIPLIE les exposants.`;
    }
    return QCM(prompt, M(good), uniq3(M(good), wrongs.map(w => M(w))), 1,
      EXPL(cours,
        `Ici chaque facteur porte la MÊME base \\(${a}\\) : la règle s'applique directement et donne \\(${good}\\).`,
        `Le piège classique : multiplier les bases (écrire \\(${a * a}^{...}\\)) ou additionner les exposants au lieu de les multiplier dans le cas \\(\\left(a^u\\right)^v\\). Les bases ne se combinent JAMAIS : seule la base \\(${a}\\) reste.`));
  };

  /* ---------- 2. Équations a^x = b (via le logarithme) ---------- */
  GEN.expoEquation = () => {
    const a = pick([2, 3, 5]);
    const variant = R(1, 2);
    if (variant === 1) {
      const k = R(2, 5);
      const good = `${k}`;
      const wrongs = [`${k + 1}`, `${a * k}`, `\\dfrac{1}{${k}}`];
      return QCM(
        `Résous l'équation :<br>\\(${a}^x = ${a}^{${k}}\\)`,
        M(good), uniq3(M(good), wrongs.map(w => M(w))), 1,
        EXPL(`La fonction \\(x \\mapsto ${a}^x\\) est strictement monotone (et donc bijective sur \\(\\mathbb{R}\\)) : l'équation \\(${a}^x = ${a}^k\\) a pour unique solution \\(x = k\\).`,
          `Même base des deux côtés : les exposants doivent être ÉGAUX, donc \\(x = ${k}\\).`,
          `L'erreur à éviter : diviser les deux membres par \\(${a}\\) comme si c'était une équation linéaire, ou additionner les exposants. Ici rien à calculer : l'égalité des bases impose l'égalité des exposants.`));
    }
    const good = `\\dfrac{1}{\\log ${a}}${a === 2 ? ' \\approx 3{,}32' : (a === 3 ? ' \\approx 2{,}10' : ' \\approx 1{,}43')}`;
    const wrongs = [`\\dfrac{\\log ${a}}{1}`, `\\log ${a}`, `${a}`];
    return QCM(
      `Résous l'équation (arrondie au centième) :<br>\\(${a}^x = 10\\)`,
      M(good), uniq3(M(good), wrongs.map(w => M(w))), 1,
      EXPL(`Prendre le logarithme décimal des deux membres : \\(\\log\\left(${a}^x\\right) = \\log 10\\), soit \\(x \\log ${a} = 1\\).`,
        `On isole : \\(x = \\dfrac{\\log 10}{\\log ${a}} = \\dfrac{1}{\\log ${a}}\\). Vérification : \\(\\left(${a}\\right)^{${a === 2 ? '3{,}32' : (a === 3 ? '2{,}10' : '1{,}43')}} \\approx 10\\).`,
        `Le piège : écrire \\(x = \\log ${a}\\) (la fraction est inversée). Toujours vérifier l'ordre : \\(\\log ${a} < 1\\), donc la solution doit être PLUS GRANDE que 1.`));
  };

  /* ---------- 3. Variations & limites de a^x ---------- */
  GEN.expoVariations = () => {
    const grand = pick([
      { a: '2', croiss: true },
      { a: '3', croiss: true },
      { a: '10', croiss: true },
      { a: '\\dfrac{1}{2}', croiss: false },
      { a: '\\dfrac{1}{3}', croiss: false }
    ]);
    const limInf = grand.croiss ? '+\\infty' : '0';
    const limMoins = grand.croiss ? '0' : '+\\infty';
    const sens = grand.croiss ? 'croissante' : 'décroissante';
    const good = `strictement ${sens} sur \\(\\mathbb{R}\\), de limite \\(${limInf}\\) en \\(+\\infty\\) et \\(${limMoins}\\) en \\(-\\infty\\)`;
    const wrongs = [
      `constante égale à \\(${grand.a}\\) sur \\(\\mathbb{R}\\)`,
      `${grand.croiss ? 'croissante' : 'décroissante'} seulement sur \\([0~;~+\\infty[\\)`,
      `strictement ${grand.croiss ? 'décroissante' : 'croissante'} sur \\(\\mathbb{R}\\), de limite \\(+\\infty\\) en \\(+\\infty\\)`
    ];
    return QCM(
      `Décris la fonction \\(f(x) = ${grand.a}^{x}\\) :`,
      good, uniq3(good, wrongs), 1,
      EXPL(`Si \\(a \\gt 1\\) : \\(a^x\\) est strictement CROISSANTE ; si \\(0 \\lt a \\lt 1\\) : strictement DÉCROISSANTE. La valeur de \\(a\\) décide de tout.`,
        `Ici \\(a = ${grand.a}\\) : la fonction est strictement ${sens}. En \\(+\\infty\\) la limite vaut \\(${limInf}\\) ; en \\(-\\infty\\) c'est l'inverse : \\(${limMoins}\\).`,
        `Le piège : croire qu'une exponentielle peut s'annuler ou devenir négative. \\(a^x \\gt 0\\) POUR TOUT \\(x\\) : l'axe des abscisses est une asymptote horizontale, jamais traversée. Autre piège : une exponentielle de base \\(a \\gt 1\\) croît de plus en plus VITE, ce n'est PAS une droite.`));
  };

  /* ---------- 4. log : définition 10^y = x ⇔ y = log x ---------- */
  GEN.logDef = () => {
    const k = nz(-4, 4);
    const x = `10^{${k}}`;
    const good = `${k}`;
    const wrongs = [`${-k}`, `10 \\times ${Math.abs(k)}`, `${k + 1}`];
    return QCM(
      `Calcule (sans calculatrice) :<br>\\(\\log ${x}\\)`,
      M(good), uniq3(M(good), wrongs.map(w => M(w))), 1,
      EXPL(`Le logarithme décimal est défini par : \\(\\log x = y \\iff x = 10^{y}\\). Il répond à la question « quelle puissance de 10 donne x ? »`,
        `Ici \\(${x}${k < 0 ? ' = \\dfrac{1}{10^{' + Math.abs(k) + '}}' : ''}\\) : c'est \\(10\\) élevé à la puissance \\(${k}\\), donc \\(\\log ${x} = ${k}\\).`,
        `Le piège des exposants NÉGATIFS : \\(\\log 10^{-3} = -3\\), pas \\(+3\\). De même \\(\\log 0{,}001 = -3\\) car \\(0{,}001 = 10^{-3}\\). Le log des petits nombres est négatif : un logarithme peut l'être, jamais son intérieur (log d'un nombre négatif n'existe pas).`));
  };

  /* ---------- 5. log : propriétés algébriques ---------- */
  GEN.logProps = () => {
    const variant = pick([
      { q: `\\log 2 + \\log 5`, good: `1`, exp: `2 \\times 5 = 10`, wr: [`\\log 7`, `0`, `\\log 10 + \\log 1`] },
      { q: `\\log 4 + \\log 25`, good: `2`, exp: `4 \\times 25 = 100 = 10^2`, wr: [`\\log 29`, `100`, `1`] },
      { q: `\\log 50 - \\log 5`, good: `1`, exp: `\\dfrac{50}{5} = 10`, wr: [`\\log 45`, `10`, `0`] },
      { q: `2 \\log 5`, good: `\\log 25`, exp: `k \\log a = \\log a^k`, wr: [`\\log 10`, `\\log 7`, `25`] },
      { q: `\\log\\left(10^{7}\\right)`, good: `7`, exp: `\\log 10^k = k`, wr: [`10`, `\\log 7`, `70`] }
    ]);
    return QCM(
      `Simplifie (sans calculatrice) :<br>\\(${variant.q}\\)`,
      M(variant.good), uniq3(M(variant.good), variant.wr.map(w => M(w))), 1,
      EXPL(`Trois propriétés clés : \\(\\log(A B) = \\log A + \\log B\\) ; \\(\\log\\dfrac{A}{B} = \\log A - \\log B\\) ; \\(\\log A^k = k \\log A\\).`,
        `Ici : \\(${variant.q} = ${variant.good}\\) — étape par étape : \\(${variant.exp}\\).`,
        `Le piège classique : \\(\\log(A + B) \\neq \\log A + \\log B\\) ! Le logarithme transforme les PRODUITS en sommes, pas les sommes. \\(\\log 2 + \\log 5 = \\log 10 = 1\\) mais \\(\\log 7 \\approx 0{,}85\\).`));
  };

  /* ---------- 6. Équations avec log ---------- */
  GEN.logEquation = () => {
    const c = nz(-3, 4);
    const good = `10^{${c}}`;
    const wrongs = [`${c}`, `\\dfrac{1}{${c === 0 ? 1 : c}}`, `10 ${c >= 0 ? c : `\\times ${c}`}`];
    return QCM(
      `Résous dans \\(\\mathbb{R}\\) :<br>\\(\\log x = ${c}\\)`,
      M(good), uniq3(M(good), wrongs.map(w => M(w))), 1,
      EXPL(`Par définition : \\(\\log x = y \\iff x = 10^{y}\\). Le logarithme est la réciproque de la puissance de 10.`,
        `Ici \\(\\log x = ${c}\\) signifie directement \\(x = 10^{${c}}\\)${c < 0 ? ` (soit un nombre plus petit que 1)` : ''}.`,
        `Le piège : répondre \\(x = ${c}\\) en confondant le log et son argument. TOUJOURS se demander « 10 puissance quoi donne x ? ». Autre garde-fou : la solution doit être POSITIVE (le log n'existe que pour x > 0).`));
  };

  /* ---------- 7. Seuils exponentiels : 2ⁿ > 10⁶ ---------- */
  GEN.logSeuil = () => {
    const cas = pick([
      { base: 2, but: 'un million (10^6)', e: 6, n: 20 },
      { base: 2, but: 'mille (10^3)', e: 3, n: 10 },
      { base: 2, but: 'un milliard (10^9)', e: 9, n: 30 },
      { base: 3, but: 'un million (10^6)', e: 6, n: 13 }
    ]);
    const good = `${cas.n}`;
    const wrongs = [`${cas.n - 1}`, `${cas.e * 3}`, `${cas.n + 5}`];
    return QCM(
      `Une somme double à chaque étape (facteur ${cas.base}).<br>À partir de combien d'étapes dépasse-t-elle ${cas.but} ?`,
      M(good), uniq3(M(good), wrongs.map(w => M(w))), 1,
      EXPL(`Le seuil \\( ${cas.base}^n > 10^{${cas.e}}\\) devient LINÉAIRE en passant au logarithme : \\(n \\log ${cas.base} > ${cas.e}\\).`,
        `Donc \\(n > \\dfrac{${cas.e}}{\\log ${cas.base}}\\) : le logarithme décimal de ${cas.base} vaut ${cas.base === 2 ? '0{,}301' : '0{,}477'}, d'où \\(n > ${cas.e}/${cas.base === 2 ? '0{,}301' : '0{,}477'} \\approx ${(cas.n - 1)}.${cas.base === 2 ? '93' : '48'}\\). Le premier ENTIER qui convient est \\(n = ${cas.n}\\).`,
        `Le piège : répondre \\(n = ${cas.e * 3}\\) en comptant « 3 doublements par ordre de grandeur » trop grossièrement, ou oublier que n doit être un ENTIER : la borne est ${cas.n - 1},9…, donc on prend ${cas.n}. Les seuils exponentiels sont LA raison d'être du logarithme : il transforme la multiplication en addition.`));
  };

  /* ---------- 8. Repères logarithmiques : décades ---------- */
  GEN.logRepere = () => {
    const k = R(1, 4);
    const good = `10^{${k}} = ${Math.pow(10, k)}`;
    const wrongs = [`\\dfrac{10 + 10^{${k + 2}}}{2} : le milieu arithmétique`, `10^{${k + 1}} = ${Math.pow(10, k + 1)}`, `10 \\times ${k}`];
    return QCM(
      `Sur une échelle LOGARITHMIQUE graduée en puissances de 10,<br>quel nombre occupe le milieu entre \\(10^{${k}}\\) et \\(10^{${k + 2}}\\) ?`,
      M(good), uniq3(M(good), wrongs.map(w => M(w))), 1,
      EXPL(`Sur un axe logarithmique, les graduations correspondent aux LOGARITHMES : le milieu de \\([\\log a~;~\\log b]\\) porte le nombre dont le log est la moyenne.`,
        `Milieu des logs : \\(\\dfrac{${k} + ${k + 2}}{2} = ${k + 1}\\), donc le nombre est \\(10^{${k + 1}} = ${Math.pow(10, k + 1)}\\)${Math.pow(10,k) === 10 ? ' — le milieu de 10 et 1000 est 100, pas 505 !' : ''}.`,
        `Le piège : prendre le milieu ARITHMÉTIQUE \\((10 + 10^{${k + 2}})/2\\) : l'échelle log COMPRESSE les grandes valeurs — c'est exactement son utilité (les ordres de grandeur s'y espacent régulièrement, pas les nombres).`));
  };

  /* ---------- 9. ln & exp : fonctions réciproques ---------- */
  GEN.lnExpDef = () => {
    const variant = pick([
      { q: `e^{\\ln 5}`, good: `5`, wr: [`\\ln 5`, `e^5`, `5e`] },
      { q: `\\ln\\left(e^{3}\\right)`, good: `3`, wr: [`e^3`, `3e`, `\\ln 3`] },
      { q: `\\ln 1`, good: `0`, wr: [`1`, `e`, `\\ln e`] },
      { q: `e^{0}`, good: `1`, wr: [`0`, `e`, `\\ln 1 + e`] },
      { q: `\\ln e`, good: `1`, wr: [`e`, `0`, `\\ln 0`] }
    ]);
    return QCM(
      `Calcule :<br>\\(${variant.q}\\)`,
      M(variant.good), uniq3(M(variant.good), variant.wr.map(w => M(w))), 1,
      EXPL(`Le logarithme népérien \\(\\ln\\) et l'exponentielle \\(e^x\\) sont RÉCIPROQUES : \\(\\ln\\left(e^{a}\\right) = a\\) et \\(e^{\\ln b} = b\\) pour \\(b \\gt 0\\).`,
        `Ici l'un défait l'autre : \\(${variant.q} = ${variant.good}\\). Repères : \\(\\ln 1 = 0\\) (car \\(e^0 = 1\\)) et \\(\\ln e = 1\\) (car \\(e^1 = e\\)).`,
        `Le piège : composer dans le MAUVAIS sens, \\(e^{\\ln 5} = e^5\\) ou \\(\\ln e^3 = 3e\\). La fonction va de x vers « e puissance x » et la réciproque revient : un aller-retour « ln puis exp » restitue le nombre de départ — comme plier puis déplier.`));
  };

  /* ---------- 10. ln : propriétés & dérivées ---------- */
  GEN.lnProps = () => {
    const variant = pick([
      { q: `simplifier \\(\\ln 8\\) avec \\(\\ln 2\\)`, good: `3 \\ln 2`, wr: [`2 \\ln 3`, `\\ln 2 + \\ln 6`, `8 \\ln 2`], expl: `8 = 2^3 donc \\(\\ln 8 = \\ln 2^3 = 3 \\ln 2\\)` },
      { q: `la dérivée de \\(\\ln x\\) (x > 0)`, good: `\\dfrac{1}{x}`, wr: [`\\ln x`, `x`, `\\dfrac{1}{\\ln x}`], expl: `\\((\\ln x)' = \\dfrac{1}{x}\\)` },
      { q: `la dérivée de \\(e^{x}\\)`, good: `e^{x}`, wr: [`x e^{x-1}`, `\\ln x`, `\\dfrac{1}{e^x}`], expl: `L'exponentielle est sa PROPRE dérivée : \\((e^x)' = e^x\\)` },
      { q: `simplifier \\(\\ln 2 + \\ln 3\\)`, good: `\\ln 6`, wr: [`\\ln 5`, `6`, `\\ln 2 \\times \\ln 3`], expl: `\\(\\ln 2 + \\ln 3 = \\ln(2 \\times 3) = \\ln 6\\)` }
    ]);
    return QCM(
      `Quelle écriture est correcte pour ${variant.q} ?`,
      M(variant.good), uniq3(M(variant.good), variant.wr.map(w => M(w))), 1,
      EXPL(`Comme le log décimal : \\(\\ln(AB) = \\ln A + \\ln B\\), \\(\\ln A^k = k \\ln A\\). Et les dérivées fondamentales : \\((\\ln x)' = \\dfrac{1}{x}\\), \\((e^x)' = e^x\\).`,
        `Ici : \\(${variant.expl}\\).`,
        `Le piège : \\(\\ln(A + B) \\neq \\ln A + \\ln B\\) — c'est le PRODUIT qui devient une somme. Et pour les puissances : \\(\\ln 2^3 = 3\\ln 2\\) (l'exposant SORT), pas \\(3 \\ln 8\\).`));
  };

  /* ---------- 11. Croissances comparées ---------- */
  GEN.expCroissance = () => {
    const good = `\\ln x \\lt x \\lt x^2 \\lt e^{x}`;
    const wrongs = [`x \\lt \\ln x \\lt x^2 \\lt e^{x}`, `\\ln x \\lt x^2 \\lt x \\lt e^{x}`, `x^2 \\lt x \\lt \\ln x \\lt e^{x}`];
    return QCM(
      `Au voisinage de \\(+\\infty\\), classe ces quatre expressions<br>de la CROISSANCE la plus lente à la plus rapide :`,
      M(good), uniq3(M(good), wrongs.map(w => M(w))), 1,
      EXPL(`À l'infini, la hiérarchie classique des croissances : \\(\\ln x \\ll x \\ll x^n \\ll e^{x}\\). Chaque étage « écrase » le précédent.`,
        `Concrètement : \\(\\dfrac{\\ln x}{x} \\to 0\\) (le log grandit très lentement), \\(\\dfrac{x^2}{e^x} \\to 0\\) (l'exponentielle dépasse TOUT polynôme). C'est ce qui donne \\(\\lim_{x \\to +\\infty} \\dfrac{e^x}{x} = +\\infty\\).`,
        `Le piège : croire que \\(x^2\\) finit par dépasser \\(e^x\\) parce que « 2 contre 1 ». FAUX : à x = 20, \\(x^2 = 400\\) mais \\(e^{20} \\approx 485\\) millions. L'exponentielle gagne TOUJOURS à l'infini ; le logarithme, lui, est le plus lent de tous : à \\(x = e^{100}\\), \\(\\ln x = 100\\) seulement.`));
  };

  /* ---------- Enregistrement ---------- */
  Object.assign(GEN, {});
})();

/* ------------------------------------------------------------
   FICHE — Exponentielles & logarithmes
   ------------------------------------------------------------ */
Object.assign(FICHES, {
  'exponentielles-logarithmes': { titre: '🔋 Exponentielles & logarithmes', html: `
    <p><b>Fonction exponentielle de base \\(a\\) (\\(a \\gt 0\\)) :</b> \\(f(x) = a^x\\) prolonge les suites géométriques \\((a^n)\\). Propriétés : \\(a^u \\times a^v = a^{u+v}\\), \\(\\dfrac{a^u}{a^v} = a^{u-v}\\), \\(\\left(a^u\\right)^v = a^{uv}\\). Si \\(a \\gt 1\\) : croissante, \\(+\\infty\\) en \\(+\\infty\\), 0 en \\(-\\infty\\) ; si \\(0 \\lt a \\lt 1\\) : décroissante, limites inversées. Toujours STRICTEMENT POSITIVE.</p>
    <p><b>Logarithme décimal :</b> \\(\\log x = y \\iff x = 10^y\\). Références : \\(\\log 1 = 0\\), \\(\\log 10 = 1\\), \\(\\log 10^k = k\\). Propriétés : \\(\\log(AB) = \\log A + \\log B\\), \\(\\log\\dfrac{A}{B} = \\log A - \\log B\\), \\(\\log A^k = k \\log A\\). Équation \\(a^x = b \\Rightarrow x = \\dfrac{\\log b}{\\log a}\\).</p>
    <p><b>Seuils exponentiels :</b> \\(2^n \\gt 10^6 \\iff n \\log 2 \\gt 6 \\iff n \\gt 19{,}93\\) : le premier entier qui convient est \\(n = 20\\). Le logarithme transforme un seuil EXPONENTIEL (croissance doublement rapide) en inéquation LINÉAIRE.</p>
    <p><b>Repères logarithmiques :</b> sur un axe gradué en décades \\((10^1, 10^2, 10^3\\ldots)\\), le milieu entre \\(10^k\\) et \\(10^{k+2}\\) est \\(10^{k+1}\\) (et non le milieu arithmétique). Les ordres de grandeur y sont ESPACÉS RÉGULIÈREMENT.</p>
    <p><b>ln & exp :</b> réciproques l'un de l'autre : \\(\\ln(e^a) = a\\), \\(e^{\\ln b} = b\\) (\\(b \\gt 0\\)). \\(\\ln 1 = 0\\), \\(\\ln e = 1\\). Dérivées : \\((\\ln x)' = \\dfrac{1}{x}\\), \\((e^x)' = e^x\\). Croissances comparées en \\(+\\infty\\) : \\(\\ln x \\ll x \\ll x^n \\ll e^x\\).</p>` }
});

/* ------------------------------------------------------------
   ÉLÉMENTS SIMPLES : libellé + rappel + fiches des 11 générateurs
   ------------------------------------------------------------ */
Object.assign(GEN_INFO, {
  'expoProps':       { label: 'a^u × a^v : additionner les exposants', fiches: ['exponentielles-logarithmes', 'suites'],
    rappel: `\\(a^u \\times a^v = a^{u+v}\\), \\(\\dfrac{a^u}{a^v} = a^{u-v}\\), \\(\\left(a^u\\right)^v = a^{uv}\\) : les bases ne se combinent pas.` },
  'expoEquation':    { label: 'Équation a^x = b : passer au logarithme', fiches: ['exponentielles-logarithmes', 'suites'],
    rappel: `\\(a^x = a^k \\Rightarrow x = k\\) ; sinon \\(a^x = b \\Rightarrow x = \\dfrac{\\log b}{\\log a}\\).` },
  'expoVariations':  { label: 'Variations & limites de a^x', fiches: ['exponentielles-logarithmes', 'fonctions'],
    rappel: `\\(a \\gt 1\\) : croissante ; \\(0 \\lt a \\lt 1\\) : décroissante. Limite nulle d'un côté, infinie de l'autre. \\(a^x \\gt 0\\) toujours.` },
  'logDef':          { label: 'log : la puissance de 10 qui redonne x', fiches: ['exponentielles-logarithmes', 'nombres'],
    rappel: `\\(\\log x = y \\iff x = 10^y\\) ; \\(\\log 10^k = k\\), même négatif (\\(\\log 0{,}001 = -3\\)).` },
  'logProps':        { label: 'log(AB) = log A + log B', fiches: ['exponentielles-logarithmes', 'nombres'],
    rappel: `Produit → somme, quotient → différence, puissance → facteur : \\(\\log A^k = k \\log A\\). Jamais \\(\\log(A+B)\\).` },
  'logEquation':     { label: 'Équation log x = c : exponentier', fiches: ['exponentielles-logarithmes', 'algebre'],
    rappel: `\\(\\log x = c \\iff x = 10^c\\) : on « défait » le log avec une puissance de 10.` },
  'logSeuil':        { label: 'Seuils exponentiels : 2ⁿ > 10⁶', fiches: ['exponentielles-logarithmes', 'denombrement'],
    rappel: `Prendre le log : \\(n \\log 2 \\gt 6 \\iff n \\gt 19{,}93\\) → premier entier \\(n = 20\\).` },
  'logRepere':       { label: 'Repères logarithmiques & décades', fiches: ['exponentielles-logarithmes', 'unites'],
    rappel: `Échelle log : le milieu entre \\(10^k\\) et \\(10^{k+2}\\) est \\(10^{k+1}\\), pas le milieu arithmétique.` },
  'lnExpDef':        { label: 'ln & exp : réciproques', fiches: ['exponentielles-logarithmes', 'fonctions'],
    rappel: `\\(\\ln(e^a) = a\\), \\(e^{\\ln b} = b\\) ; \\(\\ln 1 = 0\\), \\(\\ln e = 1\\).` },
  'lnProps':         { label: 'ln : propriétés & dérivées', fiches: ['exponentielles-logarithmes', 'derivees'],
    rappel: `\\(\\ln(AB) = \\ln A + \\ln B\\), \\(\\ln A^k = k \\ln A\\) ; \\((\\ln x)' = \\dfrac{1}{x}\\), \\((e^x)' = e^x\\).` },
  'expCroissance':   { label: 'Croissances comparées : ln ≪ x ≪ x² ≪ e^x', fiches: ['exponentielles-logarithmes', 'suites'],
    rappel: `En \\(+\\infty\\) : \\(\\ln x \\ll x \\ll x^n \\ll e^x\\). L'exponentielle dépasse tout polynôme.` }
});

/* ============================================================
   4 NOTIONS NOUVELLES (→ 200 étages, avant les « limites »)
   ============================================================ */
const NOUVELLES_EXPOLOG = [
  { id: 'expo-basea',   name: 'Fonctions exponentielles de base a',            g: ['expoProps', 'expoEquation', 'expoVariations'], family: 'lime', prob: 0.5 },
  { id: 'log-decimal',  name: 'Logarithme décimal : définition & propriétés',  g: ['logDef', 'logProps', 'logEquation'],          family: 'lime', prob: 0.5 },
  { id: 'log-outils',   name: 'Seuils exponentiels & repères logarithmiques',   g: ['logSeuil', 'logRepere'],                       family: 'violet', prob: 0.5 },
  { id: 'ln-exp',       name: 'ln & exp : réciproques & croissances',           g: ['lnExpDef', 'lnProps', 'expCroissance'],        family: 'pink', prob: 0.5 }
];
(function () {
  const iLim = NOTIONS.findIndex(n => n.id === 'su-limites');
  if (iLim < 0) NOTIONS.push.apply(NOTIONS, NOUVELLES_EXPOLOG);
  else NOTIONS.splice.apply(NOTIONS, [iLim, 0].concat(NOUVELLES_EXPOLOG));
})();

/* ============================================================
   PROGRESSION : 1 catégorie nouvelle « Exponentielles &
   logarithmes », avant « Missions de synthèse ».
   ============================================================ */
(function () {
  const cat = {
    icon: '🔋', nom: 'Exponentielles & logarithmes',
    subs: [
      { nom: 'Fonctions exponentielles de base a',           ids: ['expo-basea'] },
      { nom: 'Logarithme décimal : calculs & seuils',        ids: ['log-decimal', 'log-outils'] },
      { nom: 'ln & exp : réciproques & croissances',         ids: ['ln-exp'] }
    ]
  };
  const iM = PROG_CATS.findIndex(c => c.nom === 'Missions de synthèse');
  if (iM < 0) PROG_CATS.push(cat);
  else PROG_CATS.splice(iM, 0, cat);
})();

/* Formes 3D des nouveaux étages. */
document.addEventListener('DOMContentLoaded', function () {
  try {
    FLOOR_SHAPES['expo-basea']  = 'spiral';
    FLOOR_SHAPES['log-decimal'] = 'stairs';
    FLOOR_SHAPES['log-outils']  = 'wave';
    FLOOR_SHAPES['ln-exp']      = 'arch';
  } catch (e) { /* formes de secours : 'box' */ }
});
