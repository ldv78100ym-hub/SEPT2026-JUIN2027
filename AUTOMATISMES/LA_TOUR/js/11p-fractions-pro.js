/* ============================================================
   11p. FRACTIONS AVANCÉES — PIÈGES, FRACTIONS RATIONNELLES
   & TECHNIQUES DE PRO
   ============================================================
   Contenu tiré du document joint « Le Calcul avec des Fractions
   du Primaire à la Terminale » (150+ situations dynamiques) :
   volet « Fractions Piégées » (le faux théorème de l'addition
   croisée, la simplification abusive des termes d'une somme, les
   signes cachés, la division mal inversée), volet « Lycée »
   (conditions d'existence, rationnalisation des radicaux,
   équations fractionnaires) et volet « Techniques de Pro »
   (sommes et produits télescopiques, astuce des couples,
   comparaison croisée).

   AJOUTE : 9 générateurs (GEN), 1 fiche (FICHES
   « fractions-avancees ») + avertissement dans « fractions-
   puissances », 9 éléments simples (GEN_INFO), 3 notions
   (NOTIONS.splice avant « su-limites ») et 2 sous-catégories de
   progression — la tour compte donc 196 étages (193 + 3).
   ============================================================ */

/* ------------------------------------------------------------
   GÉNÉRATEURS — fractions piégées, rationnelles & techniques pro
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
  /* Fraction réduite sous forme « \\dfrac » (le helper global frac()
   gère déjà signe et réduction). */
  const red = (n, d) => {
    const g = gcd(n, d) || 1;
    return { n: n / g, d: d / g };
  };

  /* ---------- 1. Le « faux théorème » de l'addition ---------- */
  GEN.fracFauxTheoreme = () => {
    const b = R(2, 6), d = R(2, 6);
    const a = R(1, b - 1), c = R(1, d - 1);
    const A = a * d + c * b, B = b * d;
    const good = frac(A, B);
    const piege = frac(a + c, b + d);
    return QCM(
      `Calcule :\\n    \\\\(\\dfrac{${a}}{${b}} + \\dfrac{${c}}{${d}}\\\\)`,
      M(good),
      uniq3(good, [piege, frac(a + c, Math.max(b, d)), frac(A, b + d), frac(a * c, b * d)]),
      1,
      EXPL(`On n'additionne JAMAIS les numérateurs entre eux ET les dénominateurs entre eux : il faut d'abord réduire au même dénominateur.`,
        `Dénominateur commun \\(\\text{ppcm}\\) simple : \\(${b} \\times ${d} = ${B}\\\\). Puis \\(\\dfrac{${a}}{${b}} + \\dfrac{${c}}{${d}} = \\dfrac{${a} \\times ${d} + ${c} \\times ${b}}{${B}} = \\dfrac{${a * d} + ${c * b}}{${B}} = ${good}\\\\).`,
        `\\(\\dfrac{${a + c}}{${b + d}}\\) est le fameux « faux théorème » : ici il donnerait \\(${piege}\\), différent de \\(${good}\\\\). La barre de fraction n'est pas un trait d'union : on réduit, on ne croise pas.`));
  };

  /* ---------- 2. Simplification abusive : facteurs vs termes ---------- */
  GEN.fracSimplTermes = () => {
    const a = R(2, 5), b = a + R(1, 3), k = R(2, 5);
    const good = `\\dfrac{${a * k}}{${b * k}} = \\dfrac{${a}}{${b}}`;
    return QCM(
      `Quelle égalité est TOUJOURS vraie ?`,
      M(good),
      uniq3(good, [
        `\\dfrac{${a + k}}{${b + k}} = \\dfrac{${a}}{${b}}`,
        `\\dfrac{${a * k}}{${b}} = \\dfrac{${a}}{${b * k}}`,
        `\\dfrac{${a} \\times ${k}}{${b} + ${k}} = \\dfrac{${a}}{${b}}`
      ]),
      1,
      EXPL(`On ne simplifie que des FACTEURS COMMUNS multipliés : haut et bas doivent être des PRODUITS contenant le même facteur.`,
        `\\(\\dfrac{${a * k}}{${b * k}}\\) : le facteur \\(${k}\\) est MULTIPLIÉ en haut et en bas — on peut le retirer : \\(\\dfrac{${a}}{${b}}\\\\).`,
        `\\(\\dfrac{${a + k}}{${b + k}}\\) ne se simplifie PAS : \\(${a + k}\\) et \\(${b + k}\\) sont des SOMMES, pas des produits — retirer « le même nombre » d'une somme change tout : \\(\\dfrac{${a + k}}{${b + k}} = ${frac(a + k, b + k)} \\neq ${frac(a, b)}\\\\).`));
  };

  /* ---------- 3. Signes cachés ---------- */
  GEN.fracSignesCaches = () => {
    const a = R(2, 9), b = R(2, 9);
    const good = frac(a, b);
    return QCM(
      `Que vaut :\\n    \\\\(\\dfrac{-${a}}{-${b}}\\\\)`,
      M(good),
      uniq3(good, [frac(-a, b), frac(-b, a), frac(b, a)]),
      1,
      EXPL(`\\(\\dfrac{-a}{-b} = \\dfrac{a}{b}\\) : deux signes « − » (un en haut, un en bas) s'annulent — la fraction reste POSITIVE.`,
        `\\(\\dfrac{-${a}}{-${b}} = \\dfrac{${a}}{${b}} = ${good}\\\\) : le quotient de deux nombres de MÊME signe est positif. Un seul signe peut se placer indifféremment devant, au numérateur ou au dénominateur.`,
        `\\(\\dfrac{-${a}}{${b}}\\) et \\(\\dfrac{${a}}{-${b}}\\) sont toutes deux ÉGALES à \\(-\\dfrac{${a}}{${b}}\\) : UN seul signe négatif, où qu'il soit. En revanche \\(\\dfrac{-${a}}{-${b}}\\) (DEUX signes) est POSITIVE — ne pas confondre les deux situations.`));
  };

  /* ---------- 4. Division : inverser la SECONDE fraction seulement ---------- */
  GEN.fracDivInversion = () => {
    const a = R(2, 7), b = R(2, 7), c = R(2, 7), d = R(2, 7);
    const good = frac(a * d, b * c);
    return QCM(
      `Calcule :\\n    \\\\(\\dfrac{${a}}{${b}} \\div \\dfrac{${c}}{${d}}\\\\)`,
      M(good),
      uniq3(good, [frac(a * c, b * d), frac(b * c, a * d), frac(a * d, b * c) === good ? frac(a * d, b * c) + ' ' : frac(a, d)]),
      1,
      EXPL(`Diviser par \\(\\dfrac{c}{d}\\), c'est multiplier par son INVERSE \\(\\dfrac{d}{c}\\) — on n'inverse que la SECONDE fraction.`,
        `\\(\\dfrac{${a}}{${b}} \\div \\dfrac{${c}}{${d}} = \\dfrac{${a}}{${b}} \\times \\dfrac{${d}}{${c}} = \\dfrac{${a} \\times ${d}}{${b} \\times ${c}} = ${good}\\\\).`,
        `\\(\\dfrac{${a} \\times ${c}}{${b} \\times ${d}}\\) correspond à une MULTIPLICATION directe (le « mauvais sens » du piège), et \\(\\dfrac{${b} \\times ${c}}{${a} \\times ${d}}\\) inverse les DEUX fractions. Seule la seconde fraction s'inverse — jamais la première.`));
  };

  /* ---------- 5. Rationnaliser un dénominateur ---------- */
  GEN.fracRationnaliser = () => {
    if (Math.random() < 0.5) {
      const a = pick([2, 3, 5, 6, 7, 8]);
      const good = `\\dfrac{\\sqrt{${a}}}{${a}}`;
      return QCM(
        `Rationnalise le dénominateur :\\n    \\\\(\\dfrac{1}{\\sqrt{${a}}}\\\\)`,
        M(good),
        uniq3(good, [
          `\\dfrac{\\sqrt{${a}}}{${a * a}}`,
          `\\dfrac{-\\sqrt{${a}}}{${a}}`,
          `\\sqrt{\\dfrac{1}{${a}}}`
        ]),
        1,
        EXPL(`Chasser le radical du dénominateur : multiplier haut et bas par \\(\\sqrt{a}\\).`,
          `\\(\\dfrac{1}{\\sqrt{${a}}} = \\dfrac{1}{\\sqrt{${a}}} \\times \\dfrac{\\sqrt{${a}}}{\\sqrt{${a}}} = \\dfrac{\\sqrt{${a}}}{\\sqrt{${a}} \\times \\sqrt{${a}}} = \\dfrac{\\sqrt{${a}}}{${a}}\\\\), car \\(\\sqrt{${a}} \\times \\sqrt{${a}} = ${a}\\\\).`,
          `Le radical ne disparaît PAS : il monte au numérateur. Et \\(\\sqrt{${a}} \\times \\sqrt{${a}} = ${a}\\), pas \\(${a * a}\\) — d'où le piège \\(\\dfrac{\\sqrt{${a}}}{${a * a}}\\).`));
    }
    const m = R(5, 9), n = m - R(1, 3);
    const good = `\\dfrac{\\sqrt{${m}} + \\sqrt{${n}}}{${m - n}}`;
    return QCM(
      `Rationnalise le dénominateur :\\n    \\\\(\\dfrac{1}{\\sqrt{${m}} - \\sqrt{${n}}}\\\\)`,
      M(good),
      uniq3(good, [
        `\\dfrac{\\sqrt{${m}} + \\sqrt{${n}}}{${m + n}}`,
        `\\dfrac{\\sqrt{${m}} - \\sqrt{${n}}}{${m - n}}`,
        `\\dfrac{1}{${m - n}}`
      ]),
      1,
      EXPL(`Le conjugué de \\(\\sqrt{m} - \\sqrt{n}\\) est \\(\\sqrt{m} + \\sqrt{n}\\) : leur produit vaut \\(m - n\\), sans radical.`,
        `\\(\\dfrac{1}{\\sqrt{${m}} - \\sqrt{${n}}} = \\dfrac{\\sqrt{${m}} + \\sqrt{${n}}}{\\left(\\sqrt{${m}} - \\sqrt{${n}}\\right)\\left(\\sqrt{${m}} + \\sqrt{${n}}\\right)} = \\dfrac{\\sqrt{${m}} + \\sqrt{${n}}}{${m} - ${n}}\\\\), par l'identité \\(\\left(A-B\\right)\\left(A+B\\right) = A^2 - B^2\\).`,
        `Le dénominateur devient \\(m - n\\) (DIFFÉRENCE des carrés), pas \\(m + n\\). Et ne pas oublier de CHANGER le signe du conjugué : reprendre \\(\\sqrt{${m}} - \\sqrt{${n}}\\) au numérateur ne fait pas disparaître le radical du bas.`));
  };

  /* ---------- 6. Équation fractionnaire & condition d'existence ---------- */
  GEN.fracEqFractionnaire = () => {
    const a = R(2, 5);
    let c = R(1, 5), b = R(1, 12);
    if (b === a * c) b = b + 1;                 /* éviter x = −c */
    const d = pick([1, 2, 3, 4].filter(x => x !== a));
    const num = d * c - b, den = a - d;
    const sol = red(num, den);
    const good = sol.d === 1 ? `${sol.n}` : frac(sol.n, sol.d);
    return QCM(
      `Résous dans \\(\\\\mathbb{R}\\) (attention à la condition d'existence) :\\n    \\\\(\\dfrac{${a}x + ${b}}{x + ${c}} = ${d}\\\\)`,
      M(good),
      uniq3(good, [
        `${-c}`,
        frac(num + 2 * den, den),
        frac(den, num) === good ? `${sol.n + 1}` : frac(den, num || 1)
      ]),
      1,
      EXPL(`Une fraction n'existe que si son dénominateur est NON NUL : \\(x \\ne ${-c}\\). Puis on multiplie les deux membres par ce dénominateur non nul.`,
        `Condition : \\(x \\ne ${-c}\\\\). Ensuite \\(${a}x + ${b} = ${d}\\left(x + ${c}\\right) = ${d}x + ${d * c}\\\\), donc \\(${a - d}x = ${d * c} - ${b}\\\\), soit \\(x = \\dfrac{${d * c} - ${b}}{${a - d}} = ${sol.d === 1 ? sol.n : `\\dfrac{${sol.n}}{${sol.d}}`}\\\\). La valeur \\(${-c}\\) (interdite) n'est pas solution : la condition est respectée.`,
        `Ne JAMAIS « simplifier par \\(x + ${c}\\) » avant d'avoir posé la condition : la valeur \\(x = ${-c}\\) serait perdue… ou introduite illégitimement. Et \\(x = ${-c}\\) proposé comme solution est le piège classique : elle rend le dénominateur NUL, l'équation n'y existe pas.`));
  };

  /* ---------- 7. Somme télescopique ---------- */
  GEN.fracTelescopique = () => {
    const N = R(4, 9);
    const g = red(N, N + 1);
    const good = g.d === 1 ? `${g.n}` : frac(g.n, g.d);
    return QCM(
      `Calcule la somme télescopique :\\n    \\\\(S = \\dfrac{1}{1 \\times 2} + \\dfrac{1}{2 \\times 3} + \\dfrac{1}{3 \\times 4} + \\cdots + \\dfrac{1}{${N} \\times ${N + 1}}\\\\)`,
      M(good),
      uniq3(good, [frac(N, N + 2), frac(N + 1, N + 2), g.d === 1 ? `${g.n + 1}` : frac(g.n + 1, g.d)]),
      1,
      EXPL(`L'arme secrète : \\(\\dfrac{1}{n\\left(n+1\\right)} = \\dfrac{1}{n} - \\dfrac{1}{n+1}\\). Chaque terme se scinde en deux morceaux qui s'annulent avec les voisins.`,
        `\\(S = \\left(1 - \\dfrac{1}{2}\\right) + \\left(\\dfrac{1}{2} - \\dfrac{1}{3}\\right) + \\cdots + \\left(\\dfrac{1}{${N}} - \\dfrac{1}{${N + 1}}\\right)\\\\). Tout le milieu s'annule : \\(S = 1 - \\dfrac{1}{${N + 1}} = ${good}\\\\).`,
        `Le télescopique n'énumère JAMAIS tous les termes : seules les extrémités survivent. Vérification rapide : chaque \\(\\dfrac{1}{n}\\) intermédiaire apparaît une fois avec « + » et une fois avec « − » — tout ce qui naît et meurt dans la chaîne disparaît.`));
  };

  /* ---------- 8. Astuce des couples : x + 1/x ---------- */
  GEN.fracCouples = () => {
    const s = R(3, 6);
    const v = s * s - 2;
    return QCM(
      `Sachant que \\(x + \\dfrac{1}{x} = ${s}\\) (avec \\(x \\ne 0\\)), que vaut \\(x^2 + \\dfrac{1}{x^2}\\) ?`,
      M(`${v}`),
      uniq3(`${v}`, [`${s * s}`, `${s * s + 2}`, `${2 * s}`]),
      1,
      EXPL(`Élever au carré un couple : \\(\\left(x + \\dfrac{1}{x}\\right)^2 = x^2 + 2 + \\dfrac{1}{x^2}\\\\).`,
        `\\(\\left(${s}\\right)^2 = ${s * s} = x^2 + 2 \\times x \\times \\dfrac{1}{x} + \\dfrac{1}{x^2} = x^2 + 2 + \\dfrac{1}{x^2}\\\\). Donc \\(x^2 + \\dfrac{1}{x^2} = ${s * s} - 2 = ${v}\\\\).`,
        `Ne pas oublier le DOUBLE PRODUIT : \\(\\left(x + \\dfrac{1}{x}\\right)^2 \\ne x^2 + \\dfrac{1}{x^2}\\\\). Le « −2 » (et pour \\(x^3 + \\dfrac{1}{x^3}\\), le « −3s ») vient toujours de l'identité remarquable — le couple se décale d'un cran, jamais gratuitement.`));
  };

  /* ---------- 9. Comparaison croisée sans dénominateur commun ---------- */
  GEN.fracCroisee = () => {
    let a, b, c, d;
    do {
      a = R(2, 9); b = R(2, 9); c = R(2, 9); d = R(2, 9);
    } while (a * d === b * c);
    const plusGrand = a * d > b * c;
    const f1 = frac(a, b), f2 = frac(c, d);
    const good = plusGrand ? `\\dfrac{${a}}{${b}}` : `\\dfrac{${c}}{${d}}`;
    return QCM(
      `Laquelle de ces deux fractions est la PLUS GRANDE ?\\n    \\\\(A = \\dfrac{${a}}{${b}} \\quad ; \\quad B = \\dfrac{${c}}{${d}}\\\\)`,
      M(good),
      uniq3(good, [
        plusGrand ? `\\dfrac{${c}}{${d}}` : `\\dfrac{${a}}{${b}}`,
        `\\dfrac{${a + c}}{${b + d}}`,
        `${frac(a, b)}`
      ]),
      1,
      EXPL(`Comparer en croisant : \\(\\dfrac{a}{b}\\) et \\(\\dfrac{c}{d}\\) se comparent via \\(ad\\) et \\(bc\\) — aucun dénominateur commun à calculer.`,
        `\\(A \\times ${b * d} = ${a * d}\\) et \\(B \\times ${b * d} = ${b * c}\\\\). Comme \\(${a * d} ${plusGrand ? '\\gt' : '\\lt'} ${b * c}\\\\), ${plusGrand ? `\\(A\\) est la plus grande : \\(${good}\\)` : `\\(B\\) est la plus grande : \\(${good}\\)`}.`,
        `La méthode fausse « à l'œil » compare numérateurs ou dénominateurs séparément — mais \\(${f1}\\) et \\(${f2}\\) n'ont pas la même « échelle ». Et \\(\\dfrac{${a + c}}{${b + d}}\\) (l'addition croisée) n'est PAS une moyenne honnête : elle est toujours COMPRISE entre les deux, sans jamais être l'une d'elles.`));
  };
})();

/* ------------------------------------------------------------
   FICHE THÉMATIQUE « FRACTIONS AVANCÉES » + AVERTISSEMENT
   ------------------------------------------------------------ */
Object.assign(FICHES, {
  'fractions-avancees': { titre: '🧪 Fractions : pièges, rationnalisation & techniques de pro', html: `
    <p><b>Le « faux théorème » :</b> \\(\\dfrac{a}{b} + \\dfrac{c}{d} \\ne \\dfrac{a+c}{b+d}\\\\). On réduit d'abord au même dénominateur : \\(\\dfrac{a}{b} + \\dfrac{c}{d} = \\dfrac{ad+bc}{bd}\\\\). De même \\(\\dfrac{a+b}{c+b} \\ne \\dfrac{a}{c}\\) : on ne simplifie que des FACTEURS multipliés, jamais des termes d'une somme.</p>
    <p><b>Signes cachés :</b> \\(\\dfrac{-a}{b} = \\dfrac{a}{-b} = -\\dfrac{a}{b}\\) : un seul signe, placé où l'on veut. Mais \\(\\dfrac{-a}{-b} = \\dfrac{a}{b}\\) : deux signes s'annulent, la fraction reste POSITIVE.</p>
    <p><b>Division :</b> diviser par \\(\\dfrac{c}{d}\\), c'est multiplier par \\(\\dfrac{d}{c}\\) : on inverse la SECONDE fraction seulement.</p>
    <p><b>Conditions d'existence :</b> une fraction rationnelle n'existe que là où son dénominateur est NON NUL : on annonce les conditions AVANT de simplifier ou de résoudre.</p>
    <p><b>Rationnalisation :</b> \\(\\dfrac{1}{\\sqrt{a}} = \\dfrac{\\sqrt{a}}{a}\\) (multiplier haut et bas par \\(\\sqrt{a}\\)) ; \\(\\dfrac{1}{\\sqrt{m}-\\sqrt{n}} = \\dfrac{\\sqrt{m}+\\sqrt{n}}{m-n}\\) (multiplier par le CONJUGUÉ).</p>
    <p><b>Équation fractionnaire :</b> poser la condition, multiplier par le dénominateur commun non nul, résoudre, VÉRIFIER que la solution respecte la condition.</p>
    <p><b>Somme télescopique :</b> \\(\\dfrac{1}{n(n+1)} = \\dfrac{1}{n} - \\dfrac{1}{n+1}\\) : dans la somme, tout le milieu s'annule, il ne reste que les deux extrémités : \\(\\sum_{n=1}^{N} \\dfrac{1}{n(n+1)} = \\dfrac{N}{N+1}\\\\).</p>
    <p><b>Astuce des couples :</b> si \\(x + \\dfrac{1}{x} = s\\), alors \\(x^2 + \\dfrac{1}{x^2} = s^2 - 2\\) et \\(x^3 + \\dfrac{1}{x^3} = s^3 - 3s\\).</p>
    <p><b>Comparaison croisée :</b> \\(\\dfrac{a}{b}\\) et \\(\\dfrac{c}{d}\\) se comparent via \\(ad\\) et \\(bc\\) : aucun dénominateur commun à calculer, aucun œil à faire confiance.</p>` }
});

/* La fiche « fractions & puissances » gagne l'avertissement du faux théorème. */
FICHES['fractions-puissances'].html += `
    <p><b>⚠️ Le « faux théorème » à ne jamais appliquer :</b> \\(\\dfrac{a}{b} + \\dfrac{c}{d} \\ne \\dfrac{a+c}{b+d}\\\\) — et \\(\\dfrac{a+k}{b+k} \\ne \\dfrac{a}{b}\\\\) : additionner (ou « barrer ») le même nombre haut et bas dans une SOMME change la valeur. Seuls les FACTEURS multipliés se simplifient.</p>`;

/* ------------------------------------------------------------
   ÉLÉMENTS SIMPLES : libellé + rappel + fiches des 9 générateurs
   ------------------------------------------------------------ */
Object.assign(GEN_INFO, {
  'fracFauxTheoreme':   { label: 'Le faux théorème de l\'addition croisée', fiches: ['fractions-avancees', 'fractions-puissances'],
    rappel: "\\(\\dfrac{a}{b} + \\dfrac{c}{d} = \\dfrac{ad+bc}{bd}\\\\) : réduire au même dénominateur, jamais additionner haut avec haut et bas avec bas." },
  'fracSimplTermes':    { label: 'Simplifier : facteurs oui, termes non', fiches: ['fractions-avancees', 'fractions-puissances'],
    rappel: "\\(\\dfrac{ak}{bk} = \\dfrac{a}{b}\\) mais \\(\\dfrac{a+k}{b+k} \\ne \\dfrac{a}{b}\\) : seuls des facteurs MULTIPLIÉS se simplifient." },
  'fracSignesCaches':    { label: 'Signes cachés : (−a)/(−b) = a/b', fiches: ['fractions-avancees', 'fractions-puissances'],
    rappel: "Un seul signe se place où l'on veut ; deux signes « − » s'annulent : \\(\\dfrac{-a}{-b} = \\dfrac{a}{b} \\gt 0\\\\)." },
  'fracDivInversion':    { label: 'Division : inverser la seconde fraction seulement', fiches: ['fractions-avancees', 'fractions-puissances'],
    rappel: "\\(\\dfrac{a}{b} \\div \\dfrac{c}{d} = \\dfrac{a}{b} \\times \\dfrac{d}{c}\\\\) : seule la SECONDE fraction s'inverse." },
  'fracRationnaliser':   { label: 'Rationnaliser un dénominateur radical', fiches: ['fractions-avancees'],
    rappel: "Multiplier haut et bas par \\(\\sqrt{a}\\), ou par le conjugué \\(\\sqrt{m}+\\sqrt{n}\\) : le dénominateur devient \\(a\\) ou \\(m-n\\)." },
  'fracEqFractionnaire': { label: 'Équation fractionnaire & condition d\'existence', fiches: ['fractions-avancees', 'algebre'],
    rappel: "Poser la valeur interdite \\(x \\ne \\ldots\\) AVANT tout : multiplier par le dénominateur non nul, résoudre, puis vérifier la condition." },
  'fracTelescopique':   { label: 'Somme télescopique 1/(n(n+1))', fiches: ['fractions-avancees', 'suites'],
    rappel: "\\(\\dfrac{1}{n(n+1)} = \\dfrac{1}{n} - \\dfrac{1}{n+1}\\) : le milieu s'annule, restent les extrémités : \\(\\dfrac{N}{N+1}\\\\)." },
  'fracCouples':         { label: 'Astuce des couples : x + 1/x', fiches: ['fractions-avancees', 'second-degre'],
    rappel: "\\(x + \\dfrac{1}{x} = s \\Rightarrow x^2 + \\dfrac{1}{x^2} = s^2 - 2\\) : le double produit de l'identité remarquable." },
  'fracCroisee':         { label: 'Comparaison croisée : ad contre bc', fiches: ['fractions-avancees'],
    rappel: "Comparer \\(ad\\) et \\(bc\\) : aucun dénominateur commun à calculer, aucun « à l'œil » à croire." }
});

/* ============================================================
   3 NOTIONS NOUVELLES (→ 196 étages, avant les « limites »)
   ============================================================ */
const NOUVELLES_FRACPRO = [
  { id: 'frac-pieges',       name: 'Fractions piégées',                        g: ['fracFauxTheoreme', 'fracSimplTermes', 'fracSignesCaches', 'fracDivInversion'], family: 'orange', prob: 0.5 },
  { id: 'frac-rationnelles', name: 'Fractions rationnelles & radicaux',        g: ['fracRationnaliser', 'fracEqFractionnaire'],             family: 'teal', prob: 0.5 },
  { id: 'frac-pro',          name: 'Techniques de pro : télescopique & couples', g: ['fracTelescopique', 'fracCouples', 'fracCroisee'],      family: 'violet', prob: 0.5 }
];
(function () {
  const iLim = NOTIONS.findIndex(n => n.id === 'su-limites');
  if (iLim < 0) NOTIONS.push.apply(NOTIONS, NOUVELLES_FRACPRO);
  else NOTIONS.splice.apply(NOTIONS, [iLim, 0].concat(NOUVELLES_FRACPRO));
})();

/* ============================================================
   PROGRESSION : 2 sous-catégories nouvelles dans
   « Nombres, fractions & puissances ».
   ============================================================ */
(function () {
  const cat = PROG_CATS.find(c => c.nom === 'Nombres, fractions & puissances');
  const subs = [
    { nom: 'Fractions piégées',                            ids: ['frac-pieges'] },
    { nom: 'Fractions rationnelles & techniques de pro',   ids: ['frac-rationnelles', 'frac-pro'] }
  ];
  if (cat) cat.subs.push.apply(cat.subs, subs);
  else PROG_CATS.push({ icon: '🔢', nom: 'Fractions avancées', subs: subs });
})();

/* Formes 3D des nouveaux étages (FLOOR_SHAPES est déclaré dans
   14-formes-3d.js, chargé plus tard : l'affectation attend la fin
   du chargement de la page.) */
document.addEventListener('DOMContentLoaded', function () {
  try {
    FLOOR_SHAPES['frac-pieges']       = 'arch';
    FLOOR_SHAPES['frac-rationnelles'] = 'root';
    FLOOR_SHAPES['frac-pro']          = 'stairs';
  } catch (e) { /* formes de secours : 'box' */ }
});
