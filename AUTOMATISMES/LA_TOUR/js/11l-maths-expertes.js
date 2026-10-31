/* ============================================================
   11l. MATHS EXPERTES — ARITHMÉTIQUE, CONGRUENCES & GRAPHES
   ============================================================
   Contenu tiré des ressources pédagogiques 2026-2027 (portail
   Maths Expertes) : « L'Affaire des Congruences », « Découvrir
   la congruence modulo d », « Les Congruences du Grimoire »
   (congruences + récurrence), « Règles de divisibilité »,
   « Nombres complexes — cours & équations » et « LEGERE »
   (théorie des graphes).

   AJOUTE : 17 générateurs (GEN), 3 fiches (FICHES) + un
   complément de la fiche « complexes », 17 éléments simples
   (GEN_INFO), 9 notions (NOTIONS.push) et 2 catégories de
   progression (PROG_CATS) AVANT que 12-etat-jeu.js ne calcule
   N_TOT : la tour compte donc 181 étages (172 + 9).
   ============================================================ */

/* ------------------------------------------------------------
   GÉNÉRATEURS — arithmétique, congruences, complexes, graphes
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

  /* ---------- 1. Division euclidienne & divisibilité ---------- */
  GEN.euclide = () => {
    const b = R(7, 19), q = R(5, 40), r = R(1, b - 1);
    const a = b * q + r;
    if (Math.random() < 0.5) {
      return QCM(
        `Dans la division euclidienne de \\(${a}\\) par \\(${b}\\), quel est le quotient ?`,
        M(q), uniq3(q, [q + 1, q - 1, q + 2, q - 2, q + 3]),
        1,
        EXPL(`La division euclidienne s'écrit \\(a=b\\times q+r\\) avec \\(0\\le r\\lt b\\).`,
          `\\(${a}=${b}\\times${q}+${r}\\) : le quotient vaut \\(${q}\\).`,
          `Le quotient est le plus grand multiple de \\(${b}\\) qui ne dépasse pas \\(${a}\\).`));
    }
    return QCM(
      `Dans la division euclidienne de \\(${a}\\) par \\(${b}\\), quel est le reste ?`,
      M(r), uniq3(r, [r + 1, r + 2, r - 1, b - r, r + 3]),
      1,
      EXPL(`La division euclidienne s'écrit \\(a=b\\times q+r\\) avec \\(0\\le r\\lt b\\).`,
        `\\(${a}=${b}\\times${q}+${r}\\) : le reste vaut \\(${r}\\).`,
        `Le reste est toujours strictement inférieur au diviseur.`));
  };

  GEN.divCrit = () => {
    const pool = [3, 4, 5, 7, 9, 11, 13];
    const d = pick(pool);
    const N = d * R(13, 89);
    const others = pool.filter(x => x !== d && N % x !== 0).slice(0, 3);
    if (others.length < 3) return GEN.divCrit();
    return QCM(
      `Lequel de ces nombres divise \\(${N}\\) ?`, M(d),
      others.map(x => M(x)), 2,
      EXPL(`Un nombre \\(d\\) divise \\(N\\) quand la division euclidienne de \\(N\\) par \\(d\\) laisse un reste NUL.`,
        `\\(${N}=${d}\\times${N / d}+0\\).`,
        `Critères utiles : divisible par 3 si la somme des chiffres l'est ; par 4 si les deux derniers chiffres forment un multiple de 4 ; par 9 si la somme des chiffres est multiple de 9 ; par 11 si la somme alternée l'est.`));
  };

  GEN.decomposePremiers = () => {
    const a = R(2, 3), b = R(1, 2), c = Math.random() < 0.5 ? 0 : 1;
    const N = Math.pow(2, a) * Math.pow(3, b) * Math.pow(5, c);
    const pr = (f, e) => e === 0 ? '' : (e === 1 ? `${f}` : `${f}^${e}`);
    const dec = (A, B, C) => [pr(2, A), pr(3, B), pr(5, C)].filter(Boolean).join(' \\times ');
    return QCM(
      `Quelle est la décomposition en facteurs premiers de \\(${N}\\) ?`,
      `\\(${dec(a, b, c)}\\)`,
      [`\\(${dec(a + 1, b, c)}\\)`, `\\(${dec(a, b + 1, c)}\\)`, `\\(${dec(a, b, c + 1)}\\)`],
      2,
      EXPL(`Tout entier \\(\\gt 1\\) se décompose de façon UNIQUE en produit de facteurs premiers.`,
        `\\(${N}=${dec(a, b, c)}\\).`,
        `On divise successivement par 2, puis 3, puis 5… jusqu'à obtenir 1 (divisions euclidiennes successives).`));
  };

  GEN.pgcdEuclide = () => {
    const g0 = pick([4, 6, 7, 8, 9, 10, 12, 14, 15]);
    let m = R(3, 12), n = R(3, 12);
    while (n === m) n = R(3, 12);
    const a = Math.max(g0 * m, g0 * n), b = Math.min(g0 * m, g0 * n);
    const ans = gcd(a, b);
    return QCM(
      `Quel est le PGCD de \\(${a}\\) et \\(${b}\\) ?`, M(ans),
      uniq3(ans, [ans * 2, ans + 1, ans - 1, Math.floor(ans / 2), ans + 2]),
      2,
      EXPL(`Algorithme d'Euclide : \\(\\text{PGCD}(a\\,;b)=\\text{PGCD}(b\\,;r)\\) où \\(r\\) est le reste de la division de \\(a\\) par \\(b\\).`,
        `\\(${a}=${b}\\times${Math.floor(a / b)}+${a % b}\\), on recommence avec \\(${b}\\) et \\(${a % b}\\)… jusqu'au dernier reste non nul : \\(${ans}\\).`,
        `Le PGCD est le dernier reste NON NUL ; une fraction devient irréductible quand on divise par le PGCD.`));
  };

  /* ---------- 2. Congruences ---------- */
  GEN.congruenceReste = () => {
    const n = pick([4, 5, 6, 7, 9, 11, 13]), a = R(21, 199);
    const r = a % n;
    return QCM(
      `Quel est le reste de la division euclidienne de \\(${a}\\) par \\(${n}\\) ?`,
      M(r), uniq3(r, [r + 1, r - 1, r + 2, n - r, r + 3].map(x => ((x % n) + n) % n)),
      1,
      EXPL(`\\(a\\equiv r\\;[${n}]\\) signifie que \\(r\\) est le reste de la division euclidienne de \\(a\\) par \\(${n}\\).`,
        `\\(${a}=${n}\\times${Math.floor(a / n)}+${r}\\).`,
        `Deux entiers sont congrus modulo \\(${n}\\) quand leur différence est un multiple de \\(${n}\\).`));
  };

  GEN.congruenceJour = () => {
    const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
    const i0 = R(0, 6), k = pick([17, 23, 30, 45, 52, 100, 365, 1000, 2027]);
    const i1 = (i0 + k) % 7;
    return QCM(
      `Aujourd'hui nous sommes ${jours[i0]}. Quel jour serons-nous dans \\(${k}\\) jours ?`,
      jours[i1],
      uniq3(jours[i1], [(i1 + 1) % 7, (i1 + 6) % 7, (i1 + 2) % 7, (i1 + 5) % 7, (i1 + 3) % 7].map(x => jours[x])),
      2,
      EXPL(`Les jours de la semaine se répètent avec un cycle de 7 : on raisonne modulo 7.`,
        `\\(${k}=7\\times${Math.floor(k / 7)}+${k % 7}\\) : on avance de \\(${k % 7}\\) jour(s) à partir de ${jours[i0]}.`,
        `Seul le RESTE de la division par 7 compte — inutile de compter sur un calendrier.`));
  };

  GEN.congruenceOps = () => {
    const n = pick([5, 6, 7, 9]);
    const r = R(1, n - 1), s = R(1, n - 1);
    const a = r + n * R(2, 5), b = s + n * R(2, 5);
    const mult = Math.random() < 0.5;
    const ans = mult ? (r * s) % n : (r + s) % n;
    const op = mult ? '\\times' : '+';
    return QCM(
      `Sachant que \\(${a}\\equiv ${r}\\;[${n}]\\) et \\(${b}\\equiv ${s}\\;[${n}]\\), à quoi \\(${a}${op}${b}\\) est-il congru modulo \\(${n}\\) ?`,
      M(ans), uniq3(ans, [(ans + 1) % n, (ans + 2) % n, (ans + n - 1) % n, (ans + 3) % n, (ans + 4) % n]),
      2,
      EXPL(mult
        ? `Les congruences se MULTIPLIENT membre à membre : \\(a\\times b\\equiv r\\times s\\;[n]\\).`
        : `Les congruences s'ADDITIONNENT membre à membre : \\(a+b\\equiv r+s\\;[n]\\).`,
        mult ? `\\(${r}\\times${s}=${r * s}\\), et \\(${r * s}\\equiv ${ans}\\;[${n}]\\).`
             : `\\(${r}+${s}=${r + s}\\), et \\(${r + s}\\equiv ${ans}\\;[${n}]\\).`,
        `On remplace chaque nombre par son reste, puis on réduit à nouveau modulo \\(${n}\\).`));
  };

  GEN.congruencePuiss = () => {
    const cases = [[2, 7], [3, 10], [2, 10], [3, 7], [5, 7], [4, 9], [7, 10], [2, 9]];
    const [a, n] = pick(cases);
    const k = R(5, 28);
    let ans = 1;
    for (let i = 0; i < k; i++) ans = (ans * a) % n;
    return QCM(
      `Quel est le reste de la division euclidienne de \\(${a}^{${k}}\\) par \\(${n}\\) ?`,
      M(ans), uniq3(ans, [ans + 1, ans + 2, ans + 3, ans + n - 1, ans + n - 2].map(x => x % n)),
      3,
      EXPL(`Les restes des puissances successives se répètent en CYCLE modulo \\(${n}\\).`,
        `\\(${a}^1\\equiv${a}\\), \\(${a}^2\\equiv${(a * a) % n}\\), \\(${a}^3\\equiv${(a * a * a) % n}\\)… le cycle se referme sur 1, et l'exposant se réduit modulo la longueur du cycle.`,
        `Jamais de développement géant : on réduit le reste à CHAQUE étape, les nombres restent petits.`));
  };

  /* ---------- 3. Nombres complexes ---------- */
  GEN.cplxConjugue = () => {
    const a = nz(-6, 6), b = nz(-4, 4);
    const z = cz(a, b);
    return QCM(
      `Quel est le conjugué de \\(${z}\\) ?`, `\\(${cz(a, -b)}\\)`,
      [`\\(${cz(-a, b)}\\)`, `\\(${cz(-a, -b)}\\)`, `\\(${cz(b, a)}\\)`],
      1,
      EXPL(`Le conjugué change le signe de la partie IMAGINAIRE : \\(\\overline{a+bi}=a-bi\\).`,
        `\\(\\overline{${z}}=${cz(a, -b)}\\).`,
        `La partie réelle ne bouge pas ; et \\(z\\bar z=a^2+b^2=|z|^2\\).`));
  };

  GEN.cplxModule = () => {
    const entiers = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]];
    const racines = [[1, 1], [1, 2], [2, 3], [1, 3], [2, 5], [3, 5], [4, 5], [1, 4]];
    if (Math.random() < 0.5) {
      const [a, b, mo] = pick(entiers);
      const sa = Math.random() < 0.5 ? 1 : -1, sb = Math.random() < 0.5 ? 1 : -1;
      return QCM(
        `Quel est le module de \\(${cz(sa * a, sb * b)}\\) ?`, M(mo),
        uniq3(mo, [mo + 1, mo - 1, a + b, mo + 2]),
        2,
        EXPL(`\\(|z|=\\sqrt{a^2+b^2}\\) — le module ne dépend pas des SIGNES.`,
          `\\(|${cz(sa * a, sb * b)}|=\\sqrt{${a * a}+${b * b}}=${mo}\\).`,
          `Le module est toujours positif ou nul, comme une LONGUEUR (distance à l'origine).`));
    }
    const [a, b] = pick(racines);
    const sa = Math.random() < 0.5 ? 1 : -1, sb = Math.random() < 0.5 ? 1 : -1;
    const d = a * a + b * b;
    return QCM(
      `Quel est le module de \\(${cz(sa * a, sb * b)}\\) ?`, `\\(\\sqrt{${d}}\\)`,
      uniq3(`\\sqrt{${d}}`, [`\\sqrt{${d + 1}}`, `\\sqrt{${d - 1}}`, `${a + b}`, `\\sqrt{${a * a}}`]),
      2,
      EXPL(`\\(|z|=\\sqrt{a^2+b^2}\\).`,
        `\\(|${cz(sa * a, sb * b)}|=\\sqrt{${a * a}+${b * b}}=\\sqrt{${d}}\\).`,
        `On ne « sort » jamais la racine : \\(\\sqrt{a^2+b^2}\\ne a+b\\).`));
  };

  GEN.cplxInverse = () => {
    let a = nz(1, 4), b = nz(1, 4);
    while (b === a) b = nz(1, 4);
    const sa = Math.random() < 0.5 ? 1 : -1, sb = Math.random() < 0.5 ? 1 : -1;
    const A = sa * a, B = sb * b;
    const D = a * a + b * b;
    const z = cz(A, B);
    const sRe = frac(A, D);
    const im = `\\dfrac{${b}}{${D}}`;
    const inv = (signe) => `${sRe} ${signe} ${im}i`;
    const ok = inv(sb > 0 ? '-' : '+');
    const ko = [inv(sb > 0 ? '+' : '-'),
                `${sRe} ${sb > 0 ? '-' : '+'} \\dfrac{${a}}{${D}}i`,
                `${sRe} ${sb > 0 ? '-' : '+'} \\dfrac{${b}}{${a + b}}i`];
    return QCM(
      `Quel est l'inverse de \\(${z}\\) ?`, `\\(${ok}\\)`, ko, 3,
      EXPL(`On multiplie numérateur et dénominateur par le CONJUGUÉ : \\(\\dfrac1z=\\dfrac{\\bar z}{|z|^2}\\).`,
        `\\(\\dfrac{1}{${z}}=\\dfrac{${cz(A, -B)}}{${D}}=${ok}\\).`,
        `Le dénominateur \\(|z|^2=${a * a}+${b * b}=${D}\\) est un entier : la partie imaginaire change de signe, jamais le dénominateur.`));
  };

  GEN.cplxEq1 = () => {
    const m = nz(-4, 4), n = nz(-4, 4);
    const A1 = pick([1, -1, 2, -2, 3, -3]), A2 = nz(-3, 3);
    const c = A1 * m - A2 * n, d = A1 * n + A2 * m;
    return QCM(
      `Résoudre dans \\(\\mathbb{C}\\) : \\((${cz(A1, A2)})z=${cz(c, d)}\\).`,
      `\\(z=${cz(m, n)}\\)`,
      [`\\(z=${cz(m, -n)}\\)`, `\\(z=${cz(-m, n)}\\)`, `\\(z=${cz(-m, -n)}\\)`],
      3,
      EXPL(`On multiplie les deux membres par l'inverse du coefficient : \\(z=\\dfrac{c+di}{a+bi}\\).`,
        `Ici \\(z=${cz(m, n)}\\) — vérification : \\((${cz(A1, A2)})(${cz(m, n)})=${cz(c, d)}\\).`,
        `L'équation \\(az=b\\) avec \\(a\\ne0\\) a une UNIQUE solution dans \\(\\mathbb{C}\\) : multiplier par le conjugué du dénominateur pour retomber sur la forme algébrique.`));
  };

  GEN.cplxEq2 = () => {
    const b = pick([-4, -2, 2, 4, 6]);
    const s = pick([2, 4, 6]);
    const c = (b * b + s * s) / 4;
    const u = -b / 2, v = s / 2;
    return QCM(
      `Racines dans \\(\\mathbb{C}\\) de \\(x^2${sg(b)}x+${c}=0\\) ?`,
      `\\(x_1=${cz(u, v)}\\) et \\(x_2=${cz(u, -v)}\\)`,
      [`\\(x_1=${cz(u, s)}\\) et \\(x_2=${cz(u, -s)}\\)`,
       `\\(x_1=${cz(-u, v)}\\) et \\(x_2=${cz(-u, -v)}\\)`,
       `\\(\\text{Pas de solution}\\)`],
      3,
      EXPL(`\\(\\Delta=b^2-4ac=${b * b}-4\\times${c}=${-s * s}\\lt0\\) : pas de racine RÉELLE, mais deux racines COMPLEXES.`,
        `\\(x=\\dfrac{-b\\pm i\\sqrt{-\\Delta}}{2a}=\\dfrac{${-b}}{2}\\pm\\dfrac{${s}}{2}i\\), soit \\(${cz(u, v)}\\) et \\(${cz(u, -v)}\\).`,
        `Les deux racines sont CONJUGUÉES ; ne pas oublier la division par \\(2a\\) — piège classique : écrire \\(\\pm ${s}i\\) au lieu de \\(\\pm ${v}i\\).`));
  };

  /* ---------- 4. Théorie des graphes ---------- */
  GEN.grVocab = () => {
    const bank = [
      { q: `Deux sommets reliés par une arête sont dits…`,
        ok: 'adjacents', ko: ['incidents', 'connexes', 'eulériens'],
        c: `Deux SOMMETS sont ADJACENTS quand une arête les relie ; un sommet et une arête sont INCIDENTS.`,
        m: `Vocabulaire de base des graphes non orientés.`,
        p: `Adjacents = deux sommets ; incidents = un sommet et une arête. Ne pas mélanger.` },
      { q: `Le DEGRÉ d'un sommet compte…`,
        ok: `le nombre d'arêtes qui le relient aux autres sommets (une boucle compte double)`,
        ko: [`le nombre de sommets du graphe`, `le nombre de chemins qui y aboutissent`, `le nombre d'arêtes du graphe`],
        c: `Le degré d'un sommet est le nombre d'arêtes incidentes à ce sommet.`,
        m: `Dans un graphe simple à \\(n\\) sommets, un degré vaut au plus \\(n-1\\).`,
        p: `Isolé = degré 0 ; le degré ne compte PAS les sommets, mais les ARÊTES.` },
      { q: `Un graphe est CONNEXE quand…`,
        ok: `tout sommet est joignable depuis n'importe quel autre par une chaîne`,
        ko: [`toutes ses arêtes se coupent`, `tous ses sommets ont le même degré`, `il n'a pas de boucle`],
        c: `CONNEXE = d'un seul bloc : il existe un chemin entre n'importe quelle paire de sommets.`,
        m: `Un graphe non connexe se décompose en plusieurs composantes connexes.`,
        p: `La connexité concerne la JOIGNABILITÉ, pas le dessin (un même graphe se dessine de mille façons).` },
      { q: `Une CHAÎNE est…`,
        ok: `une suite d'arêtes consécutives reliant deux sommets (éventuellement en passant plusieurs fois par le même sommet)`,
        ko: [`un cycle fermé obligatoirement`, `un ensemble d'arêtes qui ne se touchent pas`, `un chemin qui passe une seule fois par chaque sommet`],
        c: `Une chaîne relie deux sommets par des arités consécutives ; elle est FERMÉE quand ses extrémités coïncident (c'est alors un cycle).`,
        m: `La LONGUEUR d'une chaîne est son nombre d'arêtes.`,
        p: `Chaîne = chaque ARÊTE au plus une fois ; ne pas confondre avec un chemin hamiltonien (chaque SOMMET une fois).` },
      { q: `Le nombre maximal d'arêtes d'un graphe simple à \\(n\\) sommets est…`,
        ok: `\\(\\dfrac{n(n-1)}{2}\\)`,
        ko: [`\\(n^2\\)`, `\\(n(n-1)\\)`, `\\(\\dfrac{n(n+1)}{2}\\)`],
        c: `C'est le graphe COMPLET \\(K_n\\) : chaque paire de sommets forme exactement une arête.`,
        m: `\\(\\dbinom{n}{2}=\\dfrac{n(n-1)}{2}\\) paires de sommets, donc autant d'arêtes au maximum.`,
        p: `Sans le facteur \\(\\tfrac12\\) on compte chaque arête deux fois.` }
    ];
    const it = pick(bank);
    return QCM(it.q, it.ok, it.ko, 1, EXPL(it.c, it.m, it.p));
  };

  GEN.grDegre = () => {
    const V = ['A', 'B', 'C', 'D', 'E', 'F'];
    const m = R(5, 9);
    const pairs = [];
    while (pairs.length < m) {
      const i = R(0, 5), j = R(0, 5);
      const key = Math.min(i, j) * 10 + Math.max(i, j);
      if (i !== j && !pairs.some(p => p === key)) pairs.push(key);
    }
    const x = R(0, 5);
    const deg = pairs.filter(p => Math.floor(p / 10) === x || p % 10 === x).length;
    if (deg === 0) return GEN.grDegre();
    const edges = pairs.map(p => V[Math.floor(p / 10)] + V[p % 10]).join(', ');
    return QCM(
      `Un graphe non orienté a pour arêtes : ${edges}. Quel est le degré du sommet ${V[x]} ?`,
      M(deg), uniq3(deg, [deg + 1, Math.max(deg - 1, 0), deg + 2, Math.max(deg - 2, 0), 5]),
      2,
      EXPL(`Le degré d'un sommet est le nombre d'arêtes incidentes à ce sommet.`,
        `On compte les arêtes qui contiennent ${V[x]} : il y en a ${deg}.`,
        `La somme de tous les degrés vaut deux fois le nombre d'arêtes (lemme des poignées de main) — un bon moyen de VÉRIFIER.`));
  };

  GEN.grPoignees = () => {
    if (Math.random() < 0.5) {
      const nS = R(4, 6);
      const m = R(4, 8);
      const deg = Array(nS).fill(0);
      for (let e = 0; e < 2 * m; e++) {
        let i = R(0, nS - 1), guard = 0;
        while (deg[i] >= nS - 1 && guard++ < 60) i = R(0, nS - 1);
        deg[i]++;
      }
      return QCM(
        `Un graphe non orienté a ${nS} sommets dont les degrés valent ${deg.join(', ')}. Combien a-t-il d'arêtes ?`,
        M(m), uniq3(m, [m + 1, m - 1, 2 * m, m + 2]),
        2,
        EXPL(`Lemme des poignées de main : la somme des degrés vaut DEUX FOIS le nombre d'arêtes.`,
          `Somme \\(=${deg.reduce((s, d) => s + d, 0)}\\), donc arêtes \\(=\\dfrac{${deg.reduce((s, d) => s + d, 0)}}{2}=${m}\\).`,
          `Chaque arête contribue pour 1 au degré de CHACUNE de ses deux extrémités.`));
    }
    const m = R(4, 12);
    return QCM(
      `Un graphe non orienté compte \\(${m}\\) arêtes. Que vaut la somme des degrés de ses sommets ?`,
      M(2 * m), uniq3(2 * m, [m, 2 * m - 1, 2 * m + 1, m + 1]),
      2,
      EXPL(`Chaque arête apporte 1 au degré de chacune de ses deux extrémités.`,
        `Somme des degrés \\(=2\\times${m}=${2 * m}\\).`,
        `Conséquence : la somme des degrés est toujours PAIRE — un graphe a toujours un nombre PAIR de sommets de degré impair.`));
  };

  GEN.grEuler = () => {
    const type = pick([0, 2, 4]);
    const nS = R(5, 7);
    const deg = shuffle(Array.from({ length: nS }, (_, i) => i < type ? 3 : 2));
    const rep = type === 0
      ? `un cycle eulérien (tous les degrés sont pairs)`
      : type === 2
        ? `une chaîne eulérienne (exactement deux sommets de degré impair)`
        : `ni chaîne ni cycle eulérien (quatre sommets de degré impair)`;
    const autres = [
      `un cycle eulérien (tous les degrés sont pairs)`,
      `une chaîne eulérienne (exactement deux sommets de degré impair)`,
      `ni chaîne ni cycle eulérien (quatre sommets de degré impair)`
    ].filter(x => x !== rep);
    return QCM(
      `Un graphe CONNEXE a ${nS} sommets de degrés ${deg.join(', ')}. Que peut-on affirmer ?`,
      rep, autres, 3,
      EXPL(`Théorème d'Euler : un graphe connexe admet un CYCLE eulérien si TOUS ses sommets sont de degré pair ; une CHAÎNE eulérienne (non fermée) si EXACTEMENT DEUX sommets sont de degré impair.`,
        type === 0 ? `Tous les degrés sont pairs : on parcourt chaque arête une seule fois et on revient au départ.`
          : type === 2 ? `Deux sommets impairs : la chaîne part de l'un et aboutit à l'autre.`
            : `Quatre sommets impairs : impossible de parcourir chaque arête exactement une fois.`,
        `EULÉRIEN = passer par chaque ARÊTE une fois ; HAMILTONIEN = par chaque SOMMET une fois.`));
  };
})();

/* ------------------------------------------------------------
   FICHES THÉMATIQUES
   ------------------------------------------------------------ */
Object.assign(FICHES, {
  'divisibilite': { titre: '🔑 Divisibilité, nombres premiers & PGCD', html: `
    <p><b>Division euclidienne :</b> \\\\(a=b\\\\times q+r\\\\) avec \\\\(0\\\\le r\\\\lt b\\\\). Le couple \\\\(q,r\\\\) est unique. Le reste est la « signature » de \\\\(a\\\\) modulo \\\\(b\\\\).</p>
    <p><b>Critères de divisibilité :</b> par <b>2</b> (chiffre des unités pair), <b>3</b> (somme des chiffres divisible par 3), <b>4</b> (deux derniers chiffres forment un multiple de 4), <b>5</b> (unité 0 ou 5), <b>9</b> (somme des chiffres divisible par 9), <b>10</b> (unité 0), <b>11</b> (somme alternée des chiffres divisible par 11 : \\\\(a_0-a_1+a_2-\\\\cdots\\\\)). Pour <b>7</b> et <b>13</b> : découper le nombre par tranches de trois chiffres et alterner ( \\\\(10^3\\\\equiv-1\\\\) [7] et [13] ).</p>
    <p><b>Nombres premiers :</b> un entier \\\\(\\\\gt1\\\\) dont seuls diviseurs sont 1 et lui-même. Tout entier \\\\(\\\\gt1\\\\) se décompose de façon UNIQUE en produit de facteurs premiers (théorème fondamental de l'arithmétique) : \\\\(360=2^3\\\\times3^2\\\\times5\\\\).</p>
    <p><b>PGCD :</b> algorithme d'Euclide — \\\\(\\\\text{PGCD}(a\\\\,;b)=\\\\text{PGCD}(b\\\\,;r)\\\\) où \\\\(r\\\\) est le reste de la division euclidienne de \\\\(a\\\\) par \\\\(b\\\\) ; le PGCD est le DERNIER RESTE NON NUL. Exemple : \\\\(\\\\text{PGCD}(270\\\\,;192)\\\\) : \\\\(270=192\\\\times1+78\\\\), \\\\(192=78\\\\times2+36\\\\), \\\\(78=36\\\\times2+6\\\\), \\\\(36=6\\\\times6+0\\\\) → PGCD 6.</p>
    <p><b>Nombres premiers entre eux :</b> PGCD égal à 1 ; la fraction \\\\(\\\\dfrac ab\\\\) est irréductible après division par le PGCD.</p>` },

  'congruences': { titre: '🔐 Congruences modulo n', html: `
    <p><b>Définition :</b> \\\\(a\\\\equiv b\\\\;[n]\\\\) ( « \\\\(a\\\\) est congru à \\\\(b\\\\) modulo \\\\(n\\\\) » ) lorsque \\\\(n\\\\) divise \\\\(a-b\\\\) — autrement dit lorsque \\\\(a\\\\) et \\\\(b\\\\) ont le MÊME RESTE dans la division euclidienne par \\\\(n\\\\). Tout entier est congru, modulo \\\\(n\\\\), à son reste (et un seul, entre 0 et \\\\(n-1\\\\)).</p>
    <p><b>Règles de calcul :</b> si \\\\(a\\\\equiv b\\\\;[n]\\\\) et \\\\(a'\\\\equiv b'\\\\;[n]\\\\) alors \\\\(a+a'\\\\equiv b+b'\\\\;[n]\\\\), \\\\(a-a'\\\\equiv b-b'\\\\;[n]\\\\), \\\\(a\\\\times a'\\\\equiv b\\\\times b'\\\\;[n]\\\\) et \\\\(a^k\\\\equiv b^k\\\\;[n]\\\\). On peut donc REMPLACER chaque nombre par son reste pour additionner, multiplier… mais JAMAIS diviser.</p>
    <p><b>Puissances et cycles :</b> les restes de \\\\(a^1,a^2,a^3\\\\ldots\\\\) modulo \\\\(n\\\\) se répètent en cycle dès qu'un reste déjà vu réapparaît. Exemple : \\\\(2^1\\\\equiv2\\\\), \\\\(2^2\\\\equiv4\\\\), \\\\(2^3\\\\equiv1\\\\;[7]\\\\) puis le cycle repart — donc \\\\(2^{2027}\\\\equiv2^{2027\\\\bmod3}\\\\;[7]\\\\).</p>
    <p><b>Petit théorème de Fermat :</b> si \\\\(p\\\\) est premier et \\\\(p\\\\) ne divise pas \\\\(a\\\\), alors \\\\(a^{p-1}\\\\equiv1\\\\;[p]\\\\).</p>
    <p><b>Applications :</b> jours de la semaine (modulo 7), reste d'une grande puissance, chiffre des unités (modulo 10), parité d'une somme de puissances, cryptographie.</p>
    <p><b>Le piège des modules composés :</b> \\\\(a\\\\equiv b\\\\;[6]\\\\) et \\\\(a\\\\equiv b\\\\;[10]\\\\) n'impliquent PAS \\\\(a\\\\equiv b\\\\;[60]\\\\) ! La bonne conclusion est \\\\(a\\\\equiv b\\\\;[\\\\text{ppcm}(6\\\\,;10)]=[30]\\\\) — les modules se combinent par PPCM, pas par produit, sauf s'ils sont premiers entre eux.</p>
    <p><b>Récurrence et congruence :</b> pour prouver \\\\(u_n\\\\equiv r\\\\;[n]\\\\) pour tout \\\\(n\\\\), on vérifie l'initialisation puis on montre que la propriété se TRANSMET : si \\\\(u_n\\\\equiv r\\\\), la relation de récurrence permet de conclure \\\\(u_{n+1}\\\\equiv r\\\\;[n]\\\\).</p>` },

  'graphes': { titre: '🕸️ Théorie des graphes', html: `
    <p><b>Vocabulaire :</b> un graphe est formé de SOMMETS reliés par des ARÊTES. Deux sommets reliés par une arête sont ADJACENTS ; une arête et son sommet extrémité sont INCIDENTS. Le DEGRÉ d'un sommet est son nombre d'arêtes incidentes (une boucle compte double) ; un sommet isolé a un degré 0.</p>
    <p><b>Chaîne, cycle, connexité :</b> une CHAÎNE est une suite d'arêtes consécutives (sa longueur = nombre d'arêtes) ; elle est FERMÉE si ses extrémités coïncident (cycle). Un graphe est CONNEXE quand tout sommet est joignable depuis tout autre par une chaîne ; sinon il se décompose en composantes connexes.</p>
    <p><b>Lemme des poignées de main :</b> la somme des degrés de tous les sommets vaut DEUX FOIS le nombre d'arêtes — chaque arête compte pour 1 à chaque extrémité. Conséquences : un graphe a toujours un nombre PAIR de sommets de degré impair ; un graphe simple à \\\\(n\\\\) sommets a au plus \\\\(\\\\dfrac{n(n-1)}{2}\\\\) arêtes (graphe complet).</p>
    <p><b>Chaînes et cycles eulériens (théorème d'Euler) :</b> un graphe CONNEXE admet un cycle eulérien (parcourir chaque arête exactement une fois en revenant au départ) si et seulement si TOUS ses sommets sont de degré PAIR ; il admet une chaîne eulérienne (non fermée) si et seulement si EXACTEMENT DEUX sommets sont de degré impair.</p>
    <p><b>Distance et plus court chemin :</b> la distance entre deux sommets est la longueur d'une plus courte chaîne les reliant ; le diamètre est la plus grande des distances.</p>
    <p><b>Matrice d'adjacence :</b> matrice \\\\(M\\\\) où \\\\(m_{ij}=1\\\\) si les sommets \\\\(i\\\\) et \\\\(j\\\\) sont adjacents (nombre d'arêtes les reliant dans un graphe multiple). Elle est symétrique dans un graphe non orienté ; la somme de la ligne \\\\(i\\\\) donne le degré du sommet \\\\(i\\\\), et le coefficient \\\\(i,j\\\\) de \\\\(M^k\\\\) compte les chaînes de longueur \\\\(k\\\\) de \\\\(i\\\\) à \\\\(j\\\\).</p>
    <p><b>Retrouver le sens de « choisir, lire, recueillir » :</b> comme le verbe latin <i>legere</i>, un graphe est une affaire de CHOIX de chemin — un itinéraire optimal, un réseau à parcourir : lire la structure, recueillir l'information, élire le bon chemin.</p>` }
});

/* La fiche « complexes » gagne conjugué, module, inverse et équations. */
FICHES['complexes'].html += `
    <p><b>Conjugué :</b> \\\\(\\\\bar z=a-bi\\\\). Propriétés : \\\\(z+\\\\bar z=2a\\\\), \\\\(z-\\\\bar z=2bi\\\\), \\\\(z\\\\bar z=a^2+b^2=|z|^2\\\\), \\\\(\\\\overline{z+z'}=\\\\bar z+\\\\bar{z'}\\\\), \\\\(\\\\overline{z\\\\times z'}=\\\\bar z\\\\times\\\\bar{z'}\\\\), \\\\(\\\\overline{\\\\left(\\\\dfrac{z}{z'}\\\\right)}=\\\\dfrac{\\\\bar z}{\\\\bar{z'}}\\\\).</p>
    <p><b>Module :</b> \\\\(|z|=\\\\sqrt{a^2+b^2}\\\\) — distance à l'origine (toujours positif ou nul). \\\\(z\\\\bar z=|z|^2\\\\) ; \\\\(|z\\\\times z'|=|z|\\\\times|z'|\\\\) ; \\\\(\\\\left|\\\\dfrac{z}{z'}\\\\right|=\\\\dfrac{|z|}{|z'|}\\\\).</p>
    <p><b>Inverse :</b> pour \\\\(z\\\\ne0\\\\), \\\\(\\\\dfrac1z=\\\\dfrac{\\\\bar z}{|z|^2}\\\\) — multiplier numérateur et dénominateur par le conjugué. Exemple : \\\\(\\\\dfrac{1}{1+2i}=\\\\dfrac{1-2i}{5}\\\\).</p>
    <p><b>Équations du premier degré dans \\\\(\\\\mathbb{C}\\\\) :</b> \\\\(az+b=0\\\\) avec \\\\(a\\\\ne0\\\\) a une UNIQUE solution \\\\(z=-\\\\dfrac ba\\\\), calculée avec l'inverse de \\\\(a\\\\).</p>
    <p><b>Équations du second degré :</b> pour \\\\(ax^2+bx+c=0\\\\), si \\\\(\\\\Delta\\\\lt0\\\\) les racines RÉELLES n'existent pas, mais deux racines COMPLEXES CONJUGUÉES existent :
    \\\\(x=\\\\dfrac{-b\\\\pm i\\\\sqrt{-\\\\Delta}}{2a}\\\\). Exemple : \\\\(x^2+2x+5=0\\\\), \\\\(\\\\Delta=-16\\\\), racines \\\\(x=-1\\\\pm2i\\\\).</p>`;

/* ------------------------------------------------------------
   ÉLÉMENTS SIMPLES : libellé + rappel + fiches des 17 générateurs
   ------------------------------------------------------------ */
Object.assign(GEN_INFO, {
  'euclide':            { label: 'Division euclidienne : quotient et reste', fiches: ['divisibilite', 'nombres'],
    rappel: "\\\\(a=b\\\\times q+r\\\\) avec \\\\(0\\\\le r\\\\lt b\\\\) : le reste est la signature de \\\\(a\\\\) modulo \\\\(b\\\\)." },
  'divCrit':            { label: 'Critères de divisibilité', fiches: ['divisibilite', 'nombres'],
    rappel: "Par 3 et 9 : somme des chiffres ; par 4 : deux derniers chiffres ; par 11 : somme alternée ; par 2, 5, 10 : chiffre des unités." },
  'decomposePremiers':  { label: 'Décomposition en facteurs premiers', fiches: ['divisibilite', 'nombres'],
    rappel: "Diviser successivement par 2, 3, 5… jusqu'à 1 : la décomposition est UNIQUE (théorème fondamental de l'arithmétique)." },
  'pgcdEuclide':        { label: 'PGCD par algorithme d\'Euclide', fiches: ['divisibilite', 'nombres'],
    rappel: "\\\\(\\\\text{PGCD}(a\\\\,;b)=\\\\text{PGCD}(b\\\\,;r)\\\\) : le PGCD est le dernier reste NON NUL des divisions successives." },
  'congruenceReste':    { label: 'Reste modulo n', fiches: ['congruences', 'nombres'],
    rappel: "\\\\(a\\\\equiv r\\\\;[n]\\\\) : \\\\(r\\\\) est le reste de la division euclidienne de \\\\(a\\\\) par \\\\(n\\\\), avec \\\\(0\\\\le r\\\\lt n\\\\)." },
  'congruenceJour':     { label: 'Application : jours de la semaine', fiches: ['congruences'],
    rappel: "Cycle de 7 jours : on avance du RESTE de la division par 7 — le calendrier entier est inutile." },
  'congruenceOps':      { label: 'Somme & produit modulo n', fiches: ['congruences'],
    rappel: "Les congruences s'additionnent et se multiplient membre à membre ; on réduit ensuite modulo \\\\(n\\\\)." },
  'congruencePuiss':    { label: 'Puissances modulo n', fiches: ['congruences', 'nombres'],
    rappel: "Les restes des puissances se répètent en CYCLE : réduire l'exposant modulo la longueur du cycle ; jamais diviser des congruences." },
  'cplxConjugue':       { label: 'Conjugué d\'un complexe', fiches: ['complexes'],
    rappel: "\\\\(\\\\overline{a+bi}=a-bi\\\\) : seule la partie imaginaire change de signe ; \\\\(z\\\\bar z=|z|^2\\\\)." },
  'cplxModule':         { label: 'Module d\'un complexe', fiches: ['complexes'],
    rappel: "\\\\(|z|=\\\\sqrt{a^2+b^2}\\\\) : distance à l'origine, indépendante des signes, jamais \\\\(a+b\\\\)." },
  'cplxInverse':        { label: 'Inverse d\'un complexe', fiches: ['complexes'],
    rappel: "\\\\(\\\\dfrac1z=\\\\dfrac{\\\\bar z}{|z|^2}\\\\) : multiplier haut et bas par le conjugué." },
  'cplxEq1':            { label: 'Équation du 1ᵉʳ degré dans ℂ', fiches: ['complexes'],
    rappel: "\\\\(az=b\\\\) avec \\\\(a\\\\ne0\\\\) : solution unique \\\\(z=\\\\dfrac ba\\\\) via le conjugué du dénominateur." },
  'cplxEq2':            { label: 'Équation du 2ᵈ degré dans ℂ', fiches: ['complexes', 'second-degre'],
    rappel: "\\\\(\\\\Delta\\\\lt0\\\\) : racines complexes conjuguées \\\\(\\\\dfrac{-b\\\\pm i\\\\sqrt{-\\\\Delta}}{2a}\\\\) — ne pas oublier la division par \\\\(2a\\\\)." },
  'grVocab':            { label: 'Vocabulaire des graphes', fiches: ['graphes', 'logique'],
    rappel: "Sommets adjacents, arête incidente, degré, chaîne, cycle, connexité — le vocabulaire précis évite tout contresens." },
  'grDegre':            { label: 'Degré d\'un sommet', fiches: ['graphes'],
    rappel: "Compter les arêtes incidentes au sommet ; une boucle compte double ; vérifier avec la somme des degrés = 2 × arêtes." },
  'grPoignees':         { label: 'Lemme des poignées de main', fiches: ['graphes', 'logique'],
    rappel: "Somme des degrés = 2 × nombre d'arêtes : toujours PAIRE, d'où un nombre pair de sommets de degré impair." },
  'grEuler':            { label: 'Chaînes & cycles eulériens', fiches: ['graphes'],
    rappel: "Connexe + tous degrés pairs → cycle eulérien ; exactement deux impairs → chaîne eulérienne ; quatre ou plus → aucun." }
});

/* ============================================================
   9 NOTIONS NOUVELLES — sommet de la tour (181 étages)
   ============================================================ */
/* Les 4 notions « limites » (11k) ferment la tour : les 9 notions
   expertes s'insèrent JUSTE AVANT ce sommet, à 181 étages. */
const NOUVELLES_EXPERTES = [
  { id: 'mx-div',            name: 'Division euclidienne & divisibilité',       g: ['euclide', 'divCrit'],                       family: 'violet', prob: 0.5 },
  { id: 'mx-premiers',       name: 'Nombres premiers & PGCD',                   g: ['decomposePremiers', 'pgcdEuclide'],        family: 'violet', prob: 0.5 },
  { id: 'mx-congruence',     name: 'Congruences modulo n',                      g: ['congruenceReste', 'congruenceJour'],        family: 'violet', prob: 0.5 },
  { id: 'mx-congruence-ops', name: 'Congruences : opérations & puissances',      g: ['congruenceOps', 'congruencePuiss'],        family: 'violet', prob: 0.5 },
  { id: 'cplx-ops',          name: 'Complexes : conjugué, module & inverse',    g: ['cplxConjugue', 'cplxModule', 'cplxInverse'], family: 'pink',   prob: 0.5 },
  { id: 'cplx-eq',           name: 'Équations dans ℂ',                          g: ['cplxEq1', 'cplxEq2'],                       family: 'pink',   prob: 0.5 },
  { id: 'gr-vocab',          name: 'Graphes : vocabulaire & degrés',             g: ['grVocab', 'grDegre'],                       family: 'cyan',   prob: 0.5 },
  { id: 'gr-structure',      name: 'Graphes : arêtes & poignées de main',        g: ['grPoignees'],                               family: 'cyan',   prob: 0.5 },
  { id: 'gr-euler',          name: 'Graphes : chaînes eulériennes',              g: ['grEuler'],                                  family: 'cyan',   prob: 0.5 }
];
(function () {
  const iLim = NOTIONS.findIndex(n => n.id === 'su-limites');
  if (iLim < 0) NOTIONS.push.apply(NOTIONS, NOUVELLES_EXPERTES);
  else NOTIONS.splice.apply(NOTIONS, [iLim, 0].concat(NOUVELLES_EXPERTES));
})();

/* ============================================================
   PROGRESSION : 2 catégories nouvelles + 2 sous-catégories
   « complexes » — la tour compte 18 catégories.
   ============================================================ */
(function () {
  const arith = {
    icon: '🔐', nom: 'Arithmétique & congruences',
    subs: [
      { nom: 'Division, divisibilité & PGCD', ids: ['mx-div', 'mx-premiers'] },
      { nom: 'Congruences modulo n',          ids: ['mx-congruence', 'mx-congruence-ops'] }
    ]
  };
  const graphes = {
    icon: '🕸', nom: 'Théorie des graphes',
    subs: [
      { nom: 'Vocabulaire, degrés & arêtes', ids: ['gr-vocab', 'gr-structure'] },
      { nom: 'Chaînes eulériennes',          ids: ['gr-euler'] }
    ]
  };
  const iM = PROG_CATS.findIndex(c => c.nom === 'Missions de synthèse');
  if (iM < 0) { PROG_CATS.push(arith, graphes); }
  else { PROG_CATS.splice(iM, 0, arith, graphes); }
  const cpx = PROG_CATS.find(c => c.nom === 'Nombres complexes');
  if (cpx) {
    cpx.subs.push({ nom: 'Conjugué, module & inverse', ids: ['cplx-ops'] });
    cpx.subs.push({ nom: 'Équations dans ℂ',          ids: ['cplx-eq'] });
  }
})();

/* Formes 3D des nouveaux étages (FLOOR_SHAPES est déclaré dans
   14-formes-3d.js, chargé plus tard : l'affectation attend la fin
   du chargement de la page.) */
document.addEventListener('DOMContentLoaded', function () {
  try {
    FLOOR_SHAPES['mx-div']            = 'checker';
    FLOOR_SHAPES['mx-premiers']       = 'nest';
    FLOOR_SHAPES['mx-congruence']     = 'spiral';
    FLOOR_SHAPES['mx-congruence-ops'] = 'xgate';
    FLOOR_SHAPES['cplx-ops']          = 'sphere';
    FLOOR_SHAPES['cplx-eq']            = 'equalsign';
    FLOOR_SHAPES['gr-vocab']          = 'hexa';
    FLOOR_SHAPES['gr-structure']      = 'grid';
    FLOOR_SHAPES['gr-euler']          = 'euler';
  } catch (e) { /* formes de secours : 'box' */ }
});
