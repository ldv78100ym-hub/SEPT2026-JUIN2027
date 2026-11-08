/* ============================================================
   11n. DÉNOMBREMENT — K-UPLETS, PERMUTATIONS, ARRANGEMENTS,
   COMBINAISONS & INCLUSION-EXCLUSION
   ============================================================
   Contenu tiré du document joint « Dénombrement CPGE — Module
   Interactif Pro (Passerelle STMG) » (cours complet en 10
   sections + 100 situations toutes uniques) : les quatre
   questions concrètes (ordre ? répétition ? tout l'univers ?
   « au moins un » ?), principe multiplicatif et additif,
   k-uplets, permutations et anagrammes, arrangements, combinaisons
   et triangle de Pascal, inclusion-exclusion et complémentaire,
   principe des tiroirs, étoiles et barres.

   AJOUTE : 12 générateurs (GEN), 1 fiche (FICHES « denombrement »),
   12 éléments simples (GEN_INFO), 6 notions (NOTIONS.splice avant
   « su-limites ») et 1 catégorie de progression — la tour compte
   donc 191 étages (185 + 6).
   ============================================================ */

/* ------------------------------------------------------------
   GÉNÉRATEURS — dénombrement & combinatoire
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
  const fact = (n) => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };
  /* Nombre en groupes de milliers, séparés par un espace fine en LaTeX. */
  const texN = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');

  /* ---------- 1. Principe multiplicatif & k-uplets : n^k ---------- */
  GEN.denKuplet = () => {
    const k = R(3, 5);
    const n = Math.pow(10, k);
    return QCM(
      `Un code PIN est composé de ${k} chiffres (0 à 9), les répétitions sont autorisées.<br>Combien de codes différents existe-t-il ?`,
      M(texN(n)),
      uniq3(texN(n), [texN(Math.round(n * 1.1)), texN(10 * k), texN(n / 10), texN(Math.pow(9, k))]),
      1,
      EXPL(`Une suite ordonnée de ${k} éléments choisis AVEC répétition parmi \\(n\\) est un k-uplet : chaque position est indépendante des autres.`,
        `On dessine ${k} cases : chacune offre 10 choix (0 à 9), répétitions permises. Principe multiplicatif : \\(10 \\times 10 \\times \\cdots \\times 10 = 10^{${k}}\\).`,
        `Le piège : vouloir « interdire les doublons » alors que l'énoncé les AUTORISE, ou oublier une case. Un k-uplet compte \\(n^k\\) possibilités — ni plus, ni moins.`));
  };

  /* ---------- 2. Position imposée : la case fixe n'apporte qu'1 choix ---------- */
  GEN.denContrainte = () => {
    const k = R(4, 6);
    const n = Math.pow(10, k - 1);
    return QCM(
      `Un digicode à ${k} chiffres (0 à 9, répétitions autorisées) doit obligatoirement COMMENCER par le chiffre 9.<br>Combien de codes différents existe-t-il ?`,
      M(texN(n)),
      uniq3(texN(n), [texN(n * 10), texN(Math.pow(9, k - 1)), texN(n / 10)]),
      1,
      EXPL(`Une position IMPOSÉE ne contribue qu'un seul choix : elle ne multiplie plus par 10.`,
        `Case 1 : fixée sur 9, elle n'offre que 1 possibilité. Cases 2 à ${k} : 10 choix libres chacune. Total : \\(1 \\times 10^{${k - 1}} = ${texN(n)}\\).`,
        `\\(10^{${k}} = ${texN(Math.pow(10, k))}\\) compte TOUS les codes ; le code commençant par 9 n'en représente qu'un dixième. Une contrainte RÉDUIT toujours l'univers — jamais l'inverse.`));
  };

  /* ---------- 3. Principe additif : cas disjoints ---------- */
  GEN.denAdditif = () => {
    const a = R(3, 6), b = R(2, 5);
    return QCM(
      `Au lycée, une LV1 peut être choisie parmi ${a} langues vivantes ou ${b} langues anciennes (les deux listes n'ont aucun élément commun).<br>Combien de choix possibles ?`,
      M(`${a + b}`),
      uniq3(`${a + b}`, [`${a * b}`, `${a + b + 1}`, `${Math.max(a, b)}`]),
      1,
      EXPL(`Quand une situation se découpe en cas DISJOINTS (qui ne se chevauchent jamais), on ADDITIONNE les effectifs.`,
        `Choisir une LV1 vivante OU une langue ancienne : les deux listes n'ont aucun élément commun, donc \\(${a} + ${b} = ${a + b}\\) choix.`,
        `Si les cas se chevauchaient, l'addition compterait DEUX FOIS les éléments communs : c'est exactement ce que corrige l'inclusion-exclusion. Ne jamais additionner sans s'être assuré que les cas sont disjoints.`));
  };

  /* ---------- 4. Permutations : n! ---------- */
  GEN.denPermutation = () => {
    const n = R(5, 7);
    const v = fact(n);
    return QCM(
      `De combien de façons différentes peut-on ranger ${n} livres DISTINCTS sur une étagère (tous les livres sont utilisés) ?`,
      M(texN(v)),
      uniq3(texN(v), [texN(v * n), texN(fact(n) * 2), texN(Math.pow(n, n))]),
      1,
      EXPL(`Ranger complètement \\(n\\) objets distincts sur \\(n\\) places est une PERMUTATION : il y en a \\(n!\\).`,
        `Première place : ${n} choix ; deuxième : \\(${n - 1}\\) ; … dernière : 1 seul. Total \\(${n}! = ${n} \\times ${n - 1} \\times \\cdots \\times 1 = ${texN(v)}\\).`,
        `Ranger TOUT l'univers n'est pas choisir : un rangement complet compte \\(n!\\) issues, pas \\(n^n\\) (qui autoriserait de poser deux fois le même livre). L'ordre compte ici, sans remise.`));
  };

  /* ---------- 5. Anagrammes : permutations avec répétitions ---------- */
  GEN.denAnagramme = () => {
    const mots = [['RADAR', 2, 2], ['BALLE', 2, 1], ['ELEVE', 2, 1], ['COCO', 2, 2], ['NONON', 3, 2], ['LEVEL', 2, 2]];
    const [mot, n1, n2] = pick(mots);
    const L = mot.length;
    const v = fact(L) / (fact(n1) * fact(n2));
    return QCM(
      `Combien d'anagrammes distinctes (mots ayant un sens ou non) peut-on former avec toutes les lettres de « ${mot} » ?`,
      M(texN(v)),
      uniq3(texN(v), [texN(fact(L)), texN(fact(L) / (fact(n1) * fact(n2) * 2)), texN(fact(L - 1))]),
      1,
      EXPL(`Quand certaines lettres sont IDENTIQUES, échanger deux jumelles ne crée pas de nouveau mot : on divise \\(n!\\) par les factorielles des effectifs.`,
        `« ${mot} » compte \\(${L}\\) lettres dont \\(${n1}\\) identiques d'un type et \\(${n2}\\) d'un autre : \\(\\dfrac{${L}!}{${n1}! \\times ${n2}!} = ${texN(v)}\\).`,
        `\\(${L}! = ${texN(fact(L))}\\) surcompte : les mots obtenus en échangeant seulement les lettres jumelles sont INDISCERNABLES. Une anagramme de plus n'apparaît pas parce qu'on permute des lettres identiques.`));
  };

  /* ---------- 6. Arrangements : ordre sans remise ---------- */
  GEN.denArrangement = () => {
    const n = R(8, 12);
    const v = n * (n - 1) * (n - 2);
    return QCM(
      `Une course réunit ${n} coureurs. De combien de façons peut-on composer le podium (or, argent, bronze) ?`,
      M(texN(v)),
      uniq3(texN(v), [texN(n * (n - 1) * (n - 2) / 6), texN(n * n * n), texN(v * 2)]),
      1,
      EXPL(`Un podium est une suite ordonnée de 3 coureurs DISTINCTS : c'est un ARRANGEMENT \\(A_n^3 = n(n-1)(n-2)\\).`,
        `Or : ${n} choix ; argent : \\(${n - 1}\\) restants ; bronze : \\(${n - 2}\\) restants. Principe multiplicatif : \\(${n} \\times ${n - 1} \\times ${n - 2} = ${texN(v)}\\).`,
        `Le même trio dans un ordre différent donne un podium DIFFÉRENT : l'ordre compte. Diviser par \\(3!\\) (réponse \\(${texN(v / 6)}\\)) compterait les COMBINAISONS — les groupes sans ordre. Piège classique podium / comité.`));
  };

  /* ---------- 7. Combinaisons : sans ordre ---------- */
  GEN.denCombinaison = () => {
    const n = R(6, 12);
    const v = n * (n - 1) / 2;
    return QCM(
      `Dans un groupe de ${n} personnes, combien de paires (poignées de main) différentes peut-on former ?`,
      M(`${v}`),
      uniq3(`${v}`, [`${n * (n - 1)}`, `${n * n}`, `${v + n}`]),
      1,
      EXPL(`Une poignée de main est un groupe de 2 personnes SANS ordre : c'est une COMBINAISON \\(\\binom{n}{2} = \\dfrac{n(n-1)}{2}\\).`,
        `Chaque personne serre \\(${n - 1}\\) mains : \\(${n} \\times ${n - 1}\\) poignées… mais chacune est comptée DEUX fois (une fois par extrémité). D'où \\(\\dfrac{${n} \\times ${n - 1}}{2} = ${v}\\).`,
        `« Alice serre Bob » et « Bob serre Alice » sont la MÊME paire : ne pas diviser par 2 compte chaque paire deux fois. La division par \\(k!\\) est ce qui distingue la combinaison de l'arrangement.`));
  };

  /* ---------- 8. Triangle de Pascal : ligne & sous-ensembles ---------- */
  GEN.denPascal = () => {
    const n = R(4, 7);
    const v = Math.pow(2, n);
    return QCM(
      `Un ensemble compte ${n} éléments. Combien de sous-ensembles (de toute taille, y compris vide et complet) possède-t-il ?`,
      M(`${v}`),
      uniq3(`${v}`, [`${v * 2 - 2}`, `${n * (n - 1) / 2}`, `${Math.pow(2, n - 1)}`]),
      1,
      EXPL(`Chaque élément est « dedans » ou « dehors » : 2 choix par élément, d'où \\(2^n\\) sous-ensembles — c'est la SOMME d'une ligne du triangle de Pascal.`,
        `\\(\\binom{${n}}{0} + \\binom{${n}}{1} + \\cdots + \\binom{${n}}{${n}} = 2^{${n}} = ${v}\\) : les coefficients de la ligne \\(${n}\\) comptent les sous-ensembles de chaque taille.`,
        `Retirer l'ensemble vide et l'ensemble complet donnerait \\(${v - 2}\\), pas \\(${v}\\) : l'énoncé les INCLUT. La ligne de Pascal compte TOUTES les tailles, de 0 à \\(${n}\\).`));
  };

  /* ---------- 9. Inclusion-exclusion (2 ensembles) ---------- */
  GEN.denInclusion = () => {
    const both = R(4, 10);
    const a = both + R(8, 18);
    const b = both + R(6, 14);
    const v = a + b - both;
    return QCM(
      `Dans une entreprise, ${a} salariés maîtrisent Python, ${b} maîtrisent SQL et ${both} maîtrisent les DEUX outils.<br>Combien de salariés maîtrisent au moins un de ces deux langages ?`,
      M(`${v}`),
      uniq3(`${v}`, [`${a + b}`, `${a + b - 2 * both}`, `${Math.max(a, b)}`]),
      1,
      EXPL(`Pour compter « A ou B », on additionne puis on RETIRE l'intersection comptée deux fois : \\(\\text{card}(A \\cup B) = \\text{card}(A) + \\text{card}(B) - \\text{card}(A \\cap B)\\).`,
        `Les ${both} bilingues sont comptés deux fois dans \\(${a} + ${b} = ${a + b}\\) : on les retranche une fois, d'où \\(${a} + ${b} - ${both} = ${v}\\).`,
        `\\(${a + b}\\) surcompte les ${both} bilingues ; \\(${a + b - 2 * both}\\) les soustrait deux fois et les perd complètement. Le crible retranche l'intersection UNE SEULE fois.`));
  };

  /* ---------- 10. Complémentaire : « au moins un » ---------- */
  GEN.denComplementaire = () => {
    const none = R(3, 9);
    const auMoins = R(25, 40);
    const total = auMoins + none;
    return QCM(
      `Dans une classe de ${total} élèves, ${auMoins} ont voté pour au moins un des deux candidats.<br>Combien d'élèves n'ont voté pour AUCUN des deux ?`,
      M(`${none}`),
      uniq3(`${none}`, [`${total - auMoins + 1}`, `${auMoins}`, `${none + total}`]),
      1,
      EXPL(`Face à un « au moins un », on calcule le COMPLÉMENTAIRE : ce qui reste de l'univers une fois la réunion retirée.`,
        `Zone « au moins un » = \\(${auMoins}\\) élèves ; le reste de la classe n'a voté pour personne : \\(${total} - ${auMoins} = ${none}\\). C'est la zone blanche, hors des deux cercles du diagramme.`,
        `Le piège est d'additionner au lieu de soustraire : les électeurs des deux candidats ne se recrutent pas dans les non-votants. « Aucun » = total − « au moins un », TOUJOURS plus simple que d'énumérer.`));
  };

  /* ---------- 11. Principe des tiroirs ---------- */
  GEN.denTiroirs = () => {
    const c = R(3, 6);
    return QCM(
      `Un tiroir contient des chaussettes de ${c} couleurs différentes (en très grande quantité de chaque couleur). En PLEIN NOIR, quel nombre MINIMAL de chaussettes suffit-il de prendre pour être sûr d'avoir une paire de la même couleur ?`,
      M(`${c + 1}`),
      uniq3(`${c + 1}`, [`${c}`, `${2 * c}`, `${c + 2}`]),
      1,
      EXPL(`Principe des tiroirs : \\(n+1\\) objets dans \\(n\\) tiroirs forcent un tiroir à contenir au moins 2 objets.`,
        `Pire cas : prendre \\(${c}\\) chaussettes, toutes de couleurs différentes (une par tiroir). La \\(${c + 1}\\)ᵉ chaussette ne peut plus éviter une couleur déjà prise : une paire est garantie.`,
        `\\(${c}\\) ne suffit PAS : on peut alors avoir exactement une chaussette de chaque couleur. Et \\(2 \\times ${c}\\) suffit mais n'est pas MINIMAL : le pire cas est atteint dès \\(${c + 1}\\). Le principe des tiroirs raisonne toujours sur le pire cas.`));
  };

  /* ---------- 12. Étoiles et barres ---------- */
  GEN.denEtoilesBarres = () => {
    const k = pick([4, 5, 6]);
    const p = pick([3, 4]);
    const v = binom(k + p - 1, p - 1);
    return QCM(
      `On répartit ${k} bonbons IDENTIQUES entre ${p} enfants (un enfant peut n'en recevoir aucun).<br>Combien de répartitions différentes ?`,
      M(`${v}`),
      uniq3(`${v}`, [`${binom(k + p, p)}`, `${binom(k, p)}`, `${k * p}`]),
      1,
      EXPL(`Répartir \\(k\\) objets identiques entre \\(p\\) destinataires se modèle par \\(k\\) étoiles séparées par \\(p-1\\) barres : \\(\\binom{k+p-1}{p-1}\\) placements.`,
        `${k} étoiles + ${p - 1} barres = \\(${k + p - 1}\\) symboles ; on choisit les places des barres : \\(\\binom{${k + p - 1}}{${p - 1}} = ${v}\\). Chaque séquence d'étoiles entre deux barres = le tas d'un enfant.`,
        `Les bonbons étant IDENTIQUES, l'ordre dans un tas ne compte pas : on ne multiplie PAS par \\(${k}!\\). Et un enfant peut recevoir 0 bonbon : deux barres peuvent être adjacentes — c'est toute la force du modèle étoiles et barres.`));
  };
})();

/* ------------------------------------------------------------
   FICHE THÉMATIQUE « DÉNOMBREMENT »
   ------------------------------------------------------------ */
Object.assign(FICHES, {
  'denombrement': { titre: '🔢 Dénombrement : compter sans dessiner', html: `
    <p><b>Les quatre questions concrètes (avant tout calcul) :</b> ① l'ordre compte-t-il ? ② les éléments peuvent-ils se répéter ? ③ tout l'univers est-il utilisé ? ④ l'énoncé contient-il « au moins un » ? → passer par le contraire (« aucun »).</p>
    <p><b>Principe multiplicatif :</b> étapes indépendantes → on MULTIPLIE les choix : \\(n_1 \\times n_2 \\times \\cdots \\times n_k\\). Principe additif : cas DISJOINTS → on additionne (attention aux chevauchements !).</p>
    <p><b>k-uplets (répétition libre) :</b> \\(n^k\\) — codes PIN, plaques. Une position IMPOSÉE n'apporte qu'1 choix, pas \\(n\\).</p>
    <p><b>Permutations :</b> ranger \\(n\\) objets distincts sur \\(n\\) places : \\(n!\\). Avec jumeaux (anagrammes) : \\(\\dfrac{n!}{n_1! \\times n_2! \\times \\cdots}\\) (RADAR : \\(\\dfrac{5!}{3!\\,2!} = 10\\)).</p>
    <p><b>Arrangements (ordre, sans remise) :</b> \\(A_n^k = n(n-1)\\cdots(n-k+1) = \\dfrac{n!}{(n-k)!}\\) — un podium or-argent-bronze.</p>
    <p><b>Combinaisons (sans ordre) :</b> \\(\\binom{n}{k} = \\dfrac{n!}{k!\\,(n-k)!}\\) — une poignée de billes, un comité. Symétrie : \\(\\binom{n}{k} = \\binom{n}{n-k}\\) ; chaque combinaison engendre \\(k!\\) arrangements.</p>
    <p><b>Triangle de Pascal :</b> \\(\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}\\) (les comités qui contiennent Léa + ceux qui ne la contiennent pas). Somme d'une ligne : \\(2^n\\) = nombre de sous-ensembles.</p>
    <p><b>Inclusion-exclusion :</b> \\(\\text{card}(A \\cup B) = \\text{card}(A) + \\text{card}(B) - \\text{card}(A \\cap B)\\) ; à 3 ensembles : somme des cartes − somme des paires + le cœur. Complémentaire : « au moins un » = Total − « aucun ».</p>
    <p><b>Principe des tiroirs :</b> \\(n+1\\) objets dans \\(n\\) tiroirs → un tiroir contient au moins 2 objets. On raisonne sur le PIRE CAS.</p>
    <p><b>Étoiles et barres :</b> répartir \\(k\\) objets identiques entre \\(p\\) destinataires : \\(\\binom{k+p-1}{p-1}\\) façons (les barres peuvent être adjacentes : un destinataire peut recevoir 0 objet).</p>
    <p><b>Arbre de décision :</b> suite ordonnée avec répétition → \\(n^k\\) ; sans répétition → arrangement ; rangement complet → \\(n!\\) ; groupe sans ordre → combinaison ; « au moins un » → complémentaire ; objets identiques → étoiles et barres.</p>` }
});

/* ------------------------------------------------------------
   ÉLÉMENTS SIMPLES : libellé + rappel + fiches des 12 générateurs
   ------------------------------------------------------------ */
Object.assign(GEN_INFO, {
  'denKuplet':       { label: 'k-uplets : n^k (répétitions libres)', fiches: ['denombrement', 'proportionnalite'],
    rappel: "Chaque position indépendante : \\(n \\times n \\times \\cdots = n^k\\). Un code PIN de 4 chiffres : \\(10^4 = 10\\\\,000\\)." },
  'denContrainte':   { label: 'Position imposée : la case fixe ne multiplie plus', fiches: ['denombrement'],
    rappel: "Une position imposée n'apporte qu'1 choix : code à k chiffres commençant par 9 → \\(10^{k-1}\\)." },
  'denAdditif':      { label: 'Principe additif : cas disjoints', fiches: ['denombrement'],
    rappel: "Cas DISJOINTS (aucun chevauchement) → on additionne. S'ils se chevauchent : inclusion-exclusion." },
  'denPermutation':  { label: 'Permutations : n!', fiches: ['denombrement'],
    rappel: "Ranger \\(n\\) objets distincts sur \\(n\\) places : \\(n!\\) rangements — l'ordre compte, tout est utilisé." },
  'denAnagramme':    { label: 'Anagrammes : permutations avec répétitions', fiches: ['denombrement'],
    rappel: "\\(\\dfrac{n!}{n_1! \\times n_2! \\times \\cdots}\\) : échanger des lettres jumelles ne crée pas de nouveau mot." },
  'denArrangement':  { label: 'Arrangements : ordre sans remise', fiches: ['denombrement'],
    rappel: "\\(A_n^k = n(n-1)\\cdots(n-k+1)\\) : un podium ≠ un comité — l'ordre compte, pas de répétition." },
  'denCombinaison':  { label: 'Combinaisons : choisir sans ordre', fiches: ['denombrement'],
    rappel: "\\(\\binom{n}{k} = \\dfrac{n!}{k!(n-k)!}\\) : chaque combinaison engendre \\(k!\\) arrangements, d'où la division par \\(k!\\)." },
  'denPascal':       { label: 'Triangle de Pascal & sous-ensembles', fiches: ['denombrement'],
    rappel: "Somme d'une ligne : \\(2^n\\) sous-ensembles ; \\(\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}\\) (avec ou sans Léa)." },
  'denInclusion':    { label: 'Inclusion-exclusion (2 ensembles)', fiches: ['denombrement', 'logique'],
    rappel: "\\(\\text{card}(A \\cup B) = \\text{card}(A) + \\text{card}(B) - \\text{card}(A \\cap B)\\) : l'intersection a été comptée deux fois." },
  'denComplementaire': { label: '« Au moins un » : passer par le contraire', fiches: ['denombrement', 'probabilites'],
    rappel: "« Au moins un » = Total − « aucun » : énumérer les cas complexes est toujours plus long que compter le complémentaire." },
  'denTiroirs':      { label: 'Principe des tiroirs (pire cas)', fiches: ['denombrement'],
    rappel: "\\(n+1\\) objets dans \\(n\\) tiroirs : un tiroir contient au moins 2 objets. Chaussettes de \\(n\\) couleurs : \\(n+1\\) prises suffisent." },
  'denEtoilesBarres': { label: 'Étoiles et barres : objets identiques', fiches: ['denombrement'],
    rappel: "\\(k\\) étoiles + \\(p-1\\) barres : \\(\\binom{k+p-1}{p-1}\\) répartitions — un destinataire peut recevoir 0 objet." }
});

/* ============================================================
   6 NOTIONS NOUVELLES (→ 191 étages, avant les « limites »)
   ============================================================ */
const NOUVELLES_DEN = [
  { id: 'den-multiplicatif', name: 'Principes multiplicatif & additif',       g: ['denKuplet', 'denContrainte', 'denAdditif'], family: 'blue', prob: 0.5 },
  { id: 'den-permutations',  name: 'Permutations & anagrammes',               g: ['denPermutation', 'denAnagramme'],           family: 'blue', prob: 0.5 },
  { id: 'den-arrangement',    name: 'Arrangements : ordre sans remise',        g: ['denArrangement'],                            family: 'blue', prob: 0.5 },
  { id: 'den-combinaisons',   name: 'Combinaisons & triangle de Pascal',       g: ['denCombinaison', 'denPascal'],               family: 'blue', prob: 0.5 },
  { id: 'den-inclusion',      name: 'Inclusion-exclusion & complémentaire',    g: ['denInclusion', 'denComplementaire'],        family: 'blue', prob: 0.5 },
  { id: 'den-expertes',       name: 'Tiroirs & étoiles-barres',                g: ['denTiroirs', 'denEtoilesBarres'],            family: 'blue', prob: 0.5 }
];
(function () {
  const iLim = NOTIONS.findIndex(n => n.id === 'su-limites');
  if (iLim < 0) NOTIONS.push.apply(NOTIONS, NOUVELLES_DEN);
  else NOTIONS.splice.apply(NOTIONS, [iLim, 0].concat(NOUVELLES_DEN));
})();

/* ============================================================
   PROGRESSION : 1 catégorie nouvelle « Dénombrement &
   combinatoire » (avant « Missions de synthèse »).
   ============================================================ */
(function () {
  const cat = {
    icon: '🎱', nom: 'Dénombrement & combinatoire',
    subs: [
      { nom: 'Principes multiplicatif & additif',  ids: ['den-multiplicatif'] },
      { nom: 'Permutations, arrangements & combinaisons', ids: ['den-permutations', 'den-arrangement', 'den-combinaisons'] },
      { nom: 'Inclusion-exclusion & techniques expertes', ids: ['den-inclusion', 'den-expertes'] }
    ]
  };
  const iM = PROG_CATS.findIndex(c => c.nom === 'Missions de synthèse');
  if (iM < 0) PROG_CATS.push(cat);
  else PROG_CATS.splice(iM, 0, cat);
})();

/* Formes 3D des nouveaux étages (FLOOR_SHAPES est déclaré dans
   14-formes-3d.js, chargé plus tard : l'affectation attend la fin
   du chargement de la page.) */
document.addEventListener('DOMContentLoaded', function () {
  try {
    FLOOR_SHAPES['den-multiplicatif'] = 'tree';
    FLOOR_SHAPES['den-permutations']  = 'colonnade';
    FLOOR_SHAPES['den-arrangement']   = 'wedge';
    FLOOR_SHAPES['den-combinaisons']  = 'grid';
    FLOOR_SHAPES['den-inclusion']     = 'hourglass';
    FLOOR_SHAPES['den-expertes']      = 'lighthouse';
  } catch (e) { /* formes de secours : 'box' */ }
});
