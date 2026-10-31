/* ============================================================
   11c. NOTIONS ÉVOLUTIONS & PROPORTIONS
   Intégration des trois documents « Le Grand Défi des Évolutions »,
   « Récapitulatif : Proportions, Pourcentages, Évolutions & Taux
   consécutifs » et « Proportions — exercices auto-corrigés » :
   chaque type d'exercice ABSENT de la tour y est adapté à son
   format (QCM à choix + raisonnements à trous, contexte
   professionnel, leçon cours/méthode/piège à chaque erreur).
   Ce module :
   - enregistre 18 nouveaux générateurs dans GEN ;
   - enrichit GEN_INFO (libellé + rappel + fiches de chaque
     élément simple) et FICHES (nouvelle fiche « évolutions ») ;
   - ajoute 5 notions en sommet de tour (NOTIONS.push) AVANT que
     12-etat-jeu.js ne calcule N_TOT : la tour compte donc
     141 étages.
   ============================================================ */

/* ---------- Format français pour LaTeX : 12,5 → 12{,}5 ---------- */
function tdmFN(x, dec){
  dec = (dec === undefined) ? 2 : dec;
  if(typeof x !== 'number' || !isFinite(x)) return String(x);
  const f = Math.pow(10, dec);
  const r = Math.round(x * f) / f;
  if(Number.isInteger(r)) return String(r);
  let s = r.toFixed(dec).replace(/0+$/, '').replace(/\.$/, '');
  return s.replace('.', '{,}');
}

/* Élision : « de » → « d' » devant voyelle ou h muet. */
function tdmDE(w){
  return /^[aeiouyéh]/i.test(w) ? ("d'" + w) : ("de " + w);
}

/* ---------- Scénarios professionnels (exercices auto-corrigés) ---------- */
const TDM_PROP_SCEN = [
  { dom: "Biologie",       ctx: "une culture cellulaire",        tot: "cellules",           part: "cellules en phase de division" },
  { dom: "Biologie",       ctx: "une population de bactéries",   tot: "bactéries",          part: "bactéries résistantes à un antibiotique" },
  { dom: "Biochimie",      ctx: "un échantillon de protéines",    tot: "protéines",          part: "protéines enzymatiquement actives" },
  { dom: "Biotechnologie", ctx: "un fermenteur",                  tot: "micro-organismes",   part: "micro-organismes recombinants" },
  { dom: "Qualité",        ctx: "une ligne de production",        tot: "pièces",             part: "pièces défectueuses" },
  { dom: "Qualité",        ctx: "un contrôle qualité",            tot: "échantillons",       part: "échantillons non conformes" },
  { dom: "Élections",      ctx: "un bureau de vote",              tot: "inscrits",           part: "votants" },
  { dom: "Santé",          ctx: "une campagne de dépistage",      tot: "personnes dépistées", part: "cas positifs" },
  { dom: "Environnement",  ctx: "un échantillon d'eau",           tot: "litres d'eau",       part: "litres pollués" },
  { dom: "Production",     ctx: "un atelier de fabrication",      tot: "articles",           part: "articles de première qualité" },
  { dom: "Éducation",      ctx: "un lycée",                       tot: "élèves",             part: "élèves de terminale" },
  { dom: "Logistique",     ctx: "un entrepôt",                    tot: "colis",              part: "colis expédiés en 24 h" },
  { dom: "Agronomie",      ctx: "un verger",                      tot: "arbres fruitiers",   part: "arbres en production" },
  { dom: "Démographie",   ctx: "une commune",                    tot: "habitants",          part: "habitants de plus de 65 ans" },
  { dom: "Économie",       ctx: "une entreprise",                 tot: "salariés",           part: "salariés en télétravail" },
  { dom: "Nutrition",      ctx: "un aliment transformé",          tot: "grammes de produit", part: "grammes de sucres ajoutés" }
];

/* ============================================================
   NOTION « PROPORTIONS & POURCENTAGES »
   (partie / total, partie = total × p %, retrouver le total,
   conversions fraction-décimal-pourcentage)
   ============================================================ */

/* Proportion d'une partie dans un total (en %), contexte pro. */
GEN.propTrouve = () => {
  const s = pick(TDM_PROP_SCEN);
  const p = pick([5, 10, 12.5, 20, 25, 40, 50, 60, 75, 80]);
  const total = pick([80, 120, 160, 200, 240, 320, 400, 480]);
  const part = Math.round(total * p / 100);
  if(Math.random() < 0.25){
    /* Conversion fraction → pourcentage (récapitulatif, § Pourcentages) */
    const f = pick([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 8], [3, 8], [5, 8], [7, 8], [1, 10], [7, 10]]);
    const pf = Math.round(f[0] / f[1] * 1000) / 10;
    return QCM(`Un rapport vaut \\(\\dfrac{${f[0]}}{${f[1]}}\\). Quel pourcentage cela représente-t-il ?`,
      M(tdmFN(pf, 1) + '\\,\\%'),
      [M(tdmFN(pf * 10, 1) + '\\,\\%'), M(tdmFN(Math.round(f[1] / f[0] * 100) / 10, 1) + '\\,\\%'), M(tdmFN(f[0] * f[1] * 10, 0) + '\\,\\%')],
      1,
      EXPL(`\\(p\\,\\% = \\dfrac{p}{100}\\) : la fraction se convertit en multipliant par 100.`,
        `\\(\\dfrac{${f[0]}}{${f[1]}} = ${tdmFN(f[0] / f[1], 4)} = ${tdmFN(pf, 1)}\\,\\%\\).`,
        `Diviser par le dénominateur AVANT de multiplier par 100.`));
  }
  return QCM(`Dans ${s.ctx} (${s.dom.toLowerCase()}), on compte ${tdmFN(total, 0)} ${s.tot}, dont ${tdmFN(part, 0)} ${s.part}.
    Quelle est la proportion ${tdmDE(s.part)} (en %) ?`,
    M(tdmFN(p, 1) + '\\,\\%'),
    [M(tdmFN(Math.min(100, p + 5), 1) + '\\,\\%'), M(tdmFN(Math.max(0, p - 5), 1) + '\\,\\%'), M(tdmFN(100 - p, 1) + '\\,\\%'), M(tdmFN(p * 10, 0) + '\\,\\%')],
    1,
    EXPL(`\\(\\text{Proportion} = \\dfrac{\\text{partie}}{\\text{total}}\\times100\\).`,
      `\\(\\dfrac{${tdmFN(part, 0)}}{${tdmFN(total, 0)}}\\times100 = ${tdmFN(p, 1)}\\,\\%\\).`,
      `Toujours diviser par le TOTAL, jamais par la partie.`));
};

/* Partie = total × p % (effectif d'une catégorie). */
GEN.propPartie = () => {
  const s = pick(TDM_PROP_SCEN);
  const p = pick([5, 10, 15, 20, 25, 30, 40, 50, 60, 75]);
  const total = pick([60, 80, 120, 160, 200, 240, 300, 400, 500]);
  const part = Math.round(total * p / 100);
  return QCM(`Sur ${tdmFN(total, 0)} ${s.tot} (${s.ctx}), ${tdmFN(p, 0)} % sont ${s.part}.
    Combien y a-t-il ${tdmDE(s.part)} ?`,
    M(tdmFN(part, 0)),
    [M(tdmFN(Math.round(total * p / 1000), 0)), M(tdmFN(total - part, 0)), M(tdmFN(Math.round(total * (100 - p) / 100), 0)), M(tdmFN(part + 1, 0))],
    1,
    EXPL(`Prendre \\(p\\,\\%\\) d'une quantité, c'est multiplier par \\(\\dfrac{p}{100}\\).`,
      `\\(${tdmFN(total, 0)}\\times\\dfrac{${tdmFN(p, 0)}}{100} = ${tdmFN(part, 0)}\\) ${s.tot}.`,
      `Multiplier par p puis diviser par 100 — ne pas retrancher p au total.`));
};

/* Retrouver le total connaissant une partie et sa proportion. */
GEN.propTotal = () => {
  const s = pick(TDM_PROP_SCEN);
  const p = pick([5, 10, 20, 25, 40, 50, 75]);
  const total = pick([60, 80, 120, 160, 200, 240, 320, 400, 480]);
  const part = Math.round(total * p / 100);
  return QCM(`${tdmFN(part, 0)} ${s.part} représentent ${tdmFN(p, 0)} % de l'ensemble des ${s.tot} (${s.ctx}).
    Quel est le nombre total ${tdmDE(s.tot)} ?`,
    M(tdmFN(total, 0)),
    [M(tdmFN(Math.round(total * 0.9), 0)), M(tdmFN(Math.round(part * 100 / (100 - p)), 0)), M(tdmFN(Math.round(part + total / 10), 0)), M(tdmFN(Math.round(part * p / 100), 0))],
    1,
    EXPL(`\\(\\text{Total} = \\dfrac{\\text{partie}}{\\text{proportion}}\\).`,
      `\\(\\dfrac{${tdmFN(part, 0)}}{\\dfrac{${tdmFN(p, 0)}}{100}} = ${tdmFN(total, 0)}\\) ${s.tot}.`,
      `DIVISER par la proportion, ne pas multiplier.`));
};

/* Raisonnement à trous : proportion, conversions, pièges. */
GEN.trouProp = () => TROU(
  `Proportions et pourcentages : complète le raisonnement.`,
  `La proportion d'une partie dans un total est le {{0}} de la partie par le total.<br>
   Exemple : 40 élèves de terminale sur 200 élèves au total donnent une proportion de \\(40\\div200={{1}}\\), soit {{2}} \\(\\%\\).<br>
   Pour obtenir un effectif à partir d'un pourcentage : \\(25\\,\\%\\) de 360 pièces défectueuses possibles sur une ligne de 1440 pièces, c'est \\(1440\\times{{3}}\\div100=360\\).<br>
   Attention : la proportion est toujours comprise entre {{4}} et 1 ; un pourcentage d'une partie ne dépasse jamais {{5}} \\(\\%\\).`,
  ['quotient', '0,2', '20', '25', '0', '100'],
  ['produit', 'somme', '2', '0,02', '200', '125', 'pamplemousse', '1000'],
  `Une proportion est un quotient : partie ÷ total, jamais l'inverse ; multipliée par 100, elle devient un pourcentage.`
);

/* ============================================================
   NOTION « PROPORTIONS DE PROPORTIONS »
   (p1 × p2, effectifs en cascade, remonter une sous-population)
   ============================================================ */

/* Proportion globale p1 × p2, en %. */
GEN.propDeProp = () => {
  const s = pick(TDM_PROP_SCEN);
  const p1 = pick([10, 20, 25, 40, 50]);
  const p2 = pick([10, 20, 25, 50]);
  const pg = p1 * p2 / 100;
  return QCM(`Dans ${s.ctx}, ${tdmFN(p1, 0)} % des ${s.tot} sont ${s.part}.
    Parmi ces ${s.part}, ${tdmFN(p2, 0)} % possèdent une caractéristique particulière.
    Quelle proportion des ${s.tot} possède cette caractéristique (en %) ?`,
    M(tdmFN(pg, 2) + '\\,\\%'),
    [M(tdmFN(p1 + p2, 0) + '\\,\\%'), M(tdmFN(pg / 10, 2) + '\\,\\%'), M(tdmFN(Math.abs(p1 - p2), 0) + '\\,\\%'), M(tdmFN(pg * 10, 1) + '\\,\\%')],
    1,
    EXPL(`Une proportion de proportion s'obtient en MULTIPLIANT les deux rapports : \\(p = p_1\\times p_2\\).`,
      `\\(\\dfrac{${tdmFN(p1, 0)}}{100}\\times\\dfrac{${tdmFN(p2, 0)}}{100} = ${tdmFN(pg, 2)}\\,\\%\\).`,
      `On n'ADDITIONNE jamais les deux pourcentages : 20 % de 25 % font 5 %, pas 45 %.`));
};

/* Effectif d'une sous-sous-catégorie : total × p1 × p2. */
GEN.propDePropEff = () => {
  const s = pick(TDM_PROP_SCEN);
  const p1 = pick([10, 20, 25, 40, 50, 75]);
  const p2 = pick([10, 20, 25, 40, 50]);
  const total = pick([80, 120, 160, 200, 240, 400, 500, 600]);
  const part1 = Math.round(total * p1 / 100);
  const part2 = Math.round(part1 * p2 / 100);
  return QCM(`Sur ${tdmFN(total, 0)} ${s.tot} (${s.ctx}), ${tdmFN(p1, 0)} % sont ${s.part}.
    Parmi ces ${s.part}, ${tdmFN(p2, 0)} % possèdent une caractéristique particulière.
    Combien ${tdmDE(s.tot)} possèdent cette caractéristique ?`,
    M(tdmFN(part2, 0)),
    [M(tdmFN(Math.round(total * (p1 + p2) / 100), 0)), M(tdmFN(part1, 0)), M(tdmFN(Math.round(total * p2 / 100), 0)), M(tdmFN(Math.max(0, part2 - 1), 0))],
    1,
    EXPL(`Les proportions successives s'appliquent en cascade : \\(\\text{effectif} = \\text{total}\\times p_1\\times p_2\\).`,
      `\\(${tdmFN(total, 0)}\\times\\dfrac{${tdmFN(p1, 0)}}{100} = ${tdmFN(part1, 0)}\\), puis \\(${tdmFN(part1, 0)}\\times\\dfrac{${tdmFN(p2, 0)}}{100} = ${tdmFN(part2, 0)}\\).`,
    `Ne pas s'arrêter à la première étape : la deuxième proportion s'applique au SOUS-total.`));
};

/* Remonter une sous-population : p2 = part2/part1, ou part1 = part2/p2. */
GEN.propRemonte = () => {
  const s = pick(TDM_PROP_SCEN);
  if(Math.random() < 0.5){
    const p1 = pick([20, 25, 40, 50]);
    const total = pick([160, 200, 240, 320, 400]);
    const part1 = Math.round(total * p1 / 100);
    const p2 = pick([10, 20, 25, 50, 75]);
    const part2 = Math.round(part1 * p2 / 100);
    return QCM(`Dans ${s.ctx}, ${tdmFN(part1, 0)} ${s.tot} sont ${s.part}.
      Parmi ces ${s.part}, ${tdmFN(part2, 0)} possèdent une caractéristique particulière.
      Quelle proportion ${tdmDE(s.part)} possède cette caractéristique (en %) ?`,
      M(tdmFN(p2, 0) + '\\,\\%'),
      [M(tdmFN(Math.round(part2 / total * 1000) / 10, 1) + '\\,\\%'), M(tdmFN(100 - p2, 0) + '\\,\\%'), M(tdmFN(p2 * 2, 0) + '\\,\\%')],
      1,
      EXPL(`Ici le « total » de référence est la sous-population : \\(p_2 = \\dfrac{\\text{partie}}{\\text{sous-total}}\\times100\\).`,
        `\\(\\dfrac{${tdmFN(part2, 0)}}{${tdmFN(part1, 0)}}\\times100 = ${tdmFN(p2, 0)}\\,\\%\\).`,
        `Ne pas diviser par le total général : la proportion cherchée est RELATIVE aux ${s.part}.`));
  }
  const p2 = pick([10, 20, 25, 40, 50]);
  const part1 = pick([20, 40, 60, 80, 100, 120]);
  const part2 = Math.round(part1 * p2 / 100);
  return QCM(`Dans ${s.ctx}, parmi les ${s.part}, ${tdmFN(p2, 0)} % possèdent une caractéristique particulière,
    ce qui correspond à ${tdmFN(part2, 0)} ${s.tot}.
    Combien y a-t-il ${tdmDE(s.part)} ?`,
    M(tdmFN(part1, 0)),
    [M(tdmFN(Math.round(part2 * p2 / 100), 0)), M(tdmFN(part2 + part1 / 10, 0)), M(tdmFN(Math.round(part2 * 100 / (100 - p2)), 0))],
    1,
    EXPL(`Pour remonter d'une partie à son sous-total : \\(\\text{sous-total} = \\dfrac{\\text{partie}}{\\text{proportion}}\\).`,
      `\\(\\dfrac{${tdmFN(part2, 0)}}{\\dfrac{${tdmFN(p2, 0)}}{100}} = ${tdmFN(part1, 0)}\\) ${s.part}.`,
      `Diviser par la proportion (donc multiplier par son inverse), jamais par p.`));
};

/* ============================================================
   NOTION « COEFFICIENT MULTIPLICATEUR »
   (taux → CM, CM → taux, CM de retour, définitions)
   ============================================================ */

/* Taux → coefficient multiplicateur (Grand Défi, questions 1-2). */
GEN.cmDeTaux = () => {
  const t = pick([5, 10, 15, 20, 25, 30, 40]);
  if(Math.random() < 0.5){
    return QCM(`Un prix AUGMENTE de ${tdmFN(t, 0)} %. Quel est le coefficient multiplicateur ?`,
      M(tdmFN(1 + t / 100)),
      [M(tdmFN(1 - t / 100)), M(tdmFN(t / 100)), M(tdmFN(1 + t / 1000))],
      1,
      EXPL(`Augmenter de \\(t\\,\\%\\) revient à multiplier par \\(1+\\dfrac{t}{100}\\).`,
        `\\(CM = 1 + \\dfrac{${tdmFN(t, 0)}}{100} = ${tdmFN(1 + t / 100)}\\).`,
        `Le coefficient vaut 1,xx pour une hausse — pas 0,xx.`));
  }
  return QCM(`Un prix BAISSE de ${tdmFN(t, 0)} %. Quel est le coefficient multiplicateur ?`,
    M(tdmFN(1 - t / 100)),
    [M(tdmFN(1 + t / 100)), M(tdmFN(t / 100)), M(tdmFN(1 - t / 1000))],
    1,
    EXPL(`Diminuer de \\(t\\,\\%\\) revient à multiplier par \\(1-\\dfrac{t}{100}\\).`,
      `\\(CM = 1 - \\dfrac{${tdmFN(t, 0)}}{100} = ${tdmFN(1 - t / 100)}\\).`,
      `Une baisse de t % n'est PAS une multiplication par t %.`));
};

/* Coefficient → taux (Grand Défi, questions 3-4). */
GEN.tauxDeCM = () => {
  const cms = [1.05, 1.10, 1.20, 1.25, 1.40, 1.50, 1.75, 2.00, 0.95, 0.90, 0.80, 0.75, 0.60, 0.50];
  const cm = pick(cms);
  const t = Math.round((cm - 1) * 1000) / 10;
  const signe = t >= 0 ? '+' : '';
  return QCM(`Le coefficient multiplicateur est \\(${tdmFN(cm)}\\). Quel est le taux d'évolution (en %, avec signe) ?`,
    M(signe + tdmFN(t, 1) + '\\,\\%'),
    [M((t >= 0 ? '-' : '+') + tdmFN(Math.abs(t), 1) + '\\,\\%'), M(tdmFN(Math.round((1 - cm) * 100), 0) + '\\,\\%'), M(tdmFN(Math.round(t) + 5, 0) + '\\,\\%')],
    1,
    EXPL(`\\(t = (CM - 1)\\times100\\).`,
      `\\((${tdmFN(cm)} - 1)\\times100 = ${signe}${tdmFN(t, 1)}\\,\\%\\).`,
      `CM > 1 → hausse ; CM < 1 → baisse. Ne pas inverser le signe.`));
};

/* Coefficient de retour (Grand Défi, question 8 & finale facile). */
GEN.cmRetour = () => {
  if(Math.random() < 0.5){
    const t = pick([10, 20, 25, 50, 100]);
    const cr = 1 / (1 + t / 100);
    return QCM(`Un prix a AUGMENTÉ de ${tdmFN(t, 0)} %. Par quel coefficient faut-il multiplier pour revenir au prix initial ?`,
      M(tdmFN(cr, 3)),
      [M(tdmFN(1 - t / 100)), M(tdmFN(1 + t / 100)), M(tdmFN(Math.max(0.01, 1 - t / 200)), 3)],
      1,
      EXPL(`Le coefficient de retour est l'INVERSE du coefficient d'évolution : \\(CM_{retour} = \\dfrac{1}{CM}\\).`,
        `\\(\\dfrac{1}{${tdmFN(1 + t / 100)}} = ${tdmFN(cr, 3)}\\).`,
        `On ne soustrait pas t % : +25 % puis −25 % ne ramène PAS au départ.`));
  }
  const t = pick([10, 20, 25, 50]);
  const cr = 1 / (1 - t / 100);
  return QCM(`Un prix a BAISSÉ de ${tdmFN(t, 0)} %. Par quel coefficient faut-il multiplier pour revenir au prix initial ?`,
    M(tdmFN(cr, 3)),
    [M(tdmFN(1 + t / 100)), M(tdmFN(1 - t / 100)), M(tdmFN(cr + 0.1, 3))],
    1,
    EXPL(`Après une baisse de coefficient \\(1-\\dfrac{t}{100}\\), on revient au départ en multipliant par son inverse.`,
      `\\(\\dfrac{1}{${tdmFN(1 - t / 100)}} = ${tdmFN(cr, 3)}\\) — une baisse de 50 % exige ×2, pas +50 %.`,
      `Baisser de t % puis remonter de t % laisse le prix SOUS sa valeur initiale.`));
};

/* Raisonnement à trous : coefficients multiplicateurs. */
GEN.trouCM = () => TROU(
  `Coefficient multiplicateur : complète le raisonnement.`,
  `Augmenter de 25 % revient à multiplier par le {{0}} \\(1{,}25\\).<br>
   Diminuer de 25 % revient à multiplier par {{1}}.<br>
   Après une hausse de 25 %, pour revenir au prix initial on multiplie par {{2}} : les évolutions inverses ne sont pas symétriques.<br>
   Après une baisse de 25 %, pour revenir au prix initial on multiplie par {{3}}.<br>
   Deux évolutions successives : ce sont les coefficients qui se {{4}}, jamais les taux.`,
  ['coefficient', '0,75', '0,8', '1,25', 'multiplient'],
  ['produit', 'soustraient', '1,25', '0,75', '0,8', 'divisent', 'pamplemousse', 'pétanque', 'additionnent', '1,2'],
  `Une hausse de t % et une baisse de t % ne se compensent pas : (1+t)(1−t) = 1−t² < 1. Le retour passe toujours par l'inverse 1/CM.`
);

/* ============================================================
   NOTION « ÉVOLUTIONS SUCCESSIVES & TAUX GLOBAL »
   (CM global, taux global, valeur finale, taux manquant)
   ============================================================ */

/* CM / taux global de deux évolutions (Défi Q9-Q10, enveloppes A & F). */
GEN.tauxGlobal2 = () => {
  const mode = Math.random() < 0.34 ? 0 : (Math.random() < 0.5 ? 1 : 2);
  if(mode === 0){
    /* Deux évolutions, signes quelconques → CM global (Q9/Q10). */
    const a = pick([10, 15, 20, 25, 30]);
    const b = pick([10, 15, 20, 25]);
    const up1 = Math.random() < 0.5;
    const up2 = Math.random() < 0.6;
    const cm = (1 + (up1 ? a : -a) / 100) * (1 + (up2 ? b : -b) / 100);
    return QCM(`Un prix ${up1 ? 'augmente' : 'baisse'} de ${tdmFN(a, 0)} %, puis ${up2 ? 'augmente' : 'baisse'} de ${tdmFN(b, 0)} %.
      Quel est le coefficient multiplicateur GLOBAL ?`,
      M(tdmFN(cm, 4)),
      [M(tdmFN(1 + (up1 ? a : -a) / 100 + (up2 ? b : -b) / 100)), M(tdmFN(cm + 0.01, 4)), M(tdmFN(cm - 0.01, 4))],
      1,
      EXPL(`Évolutions successives : \\(CM_{global} = \\left(1+\\dfrac{t_1}{100}\\right)\\times\\left(1+\\dfrac{t_2}{100}\\right)\\).`,
        `\\(${tdmFN(1 + (up1 ? a : -a) / 100)}\\times${tdmFN(1 + (up2 ? b : -b) / 100)} = ${tdmFN(cm, 4)}\\).`,
        `Le taux global n'est PAS la somme des taux : les coefficients se multiplient.`));
  }
  if(mode === 1){
    /* Ordre inversé : le global est identique (enveloppe F). */
    const a = pick([20, 30, 40]);
    const b = pick([10, 15, 20]);
    const cm = (1 + a / 100) * (1 - b / 100);
    const T = (cm - 1) * 100;
    return QCM(`Un article subit +${tdmFN(a, 0)} % puis −${tdmFN(b, 0)} % ; un article identique subit −${tdmFN(b, 0)} % puis +${tdmFN(a, 0)} %.
      Quel taux UNIQUE (en %, avec signe) donne le même résultat que ces deux évolutions ?`,
      M((T >= 0 ? '+' : '') + tdmFN(T, 2) + '\\,\\%'),
      [M(tdmFN(a - b, 0) + '\\,\\%'), M((T >= 0 ? '-' : '+') + tdmFN(Math.abs(T), 2) + '\\,\\%'), M(tdmFN(a + b, 0) + '\\,\\%')],
      1,
      EXPL(`La multiplication est COMMUTATIVE : l'ordre des évolutions ne change pas le taux global.`,
        `\\(CM = ${tdmFN(1 + a / 100)}\\times${tdmFN(1 - b / 100)} = ${tdmFN(cm, 4)}\\), soit ${tdmFN(T, 2)} \\(\\%\\) — le même pour les deux articles.`,
        `+a % puis −b % n'est PAS équivalent à +(a−b) %.`));
  }
  /* Deux hausses → taux global (Q6). */
  const t = pick([10, 15, 20, 25]);
  const cm = Math.pow(1 + t / 100, 2);
  const T = (cm - 1) * 100;
  return QCM(`Une grandeur augmente de ${tdmFN(t, 0)} %, puis encore de ${tdmFN(t, 0)} %.
    Quel est le taux GLOBAL (en %, avec signe) ?`,
    M('+' + tdmFN(T, 2) + '\\,\\%'),
    [M('+' + tdmFN(2 * t, 0) + '\\,\\%'), M('+' + tdmFN(T - 1, 2) + '\\,\\%'), M('+' + tdmFN(t * t / 100, 2) + '\\,\\%')],
    1,
    EXPL(`Deux hausses successives de \\(t\\,\\%\\) : \\(CM = \\left(1+\\dfrac{t}{100}\\right)^2\\).`,
      `\\(\\left(${tdmFN(1 + t / 100)}\\right)^2 = ${tdmFN(cm, 4)}\\), soit +${tdmFN(T, 2)} \\(\\%\\).`,
      `+10 % puis +10 % ≠ +20 % : le taux global est +21 %.`));
};

/* Valeur finale après 2, 3 ou 4 évolutions (défis A & B, finale moyenne). */
GEN.vfSuccessives = () => {
  const k = R(1, 3);
  if(k === 1){
    /* Défi A : baisse puis hausse → prix final. */
    const p = pick([400, 500, 600, 800]);
    const t1 = pick([10, 15, 20, 25]);
    const t2 = pick([10, 15, 20, 25]);
    const vf = p * (1 - t1 / 100) * (1 + t2 / 100);
    return QCM(`Un smartphone coûte \\(${tdmFN(p, 0)}\\) €. Son prix baisse de ${tdmFN(t1, 0)} %, puis augmente de ${tdmFN(t2, 0)} %.
      Quel est son prix final (en €, arrondi au centime) ?`,
      M(tdmFN(vf, 2) + '\\text{ €}'),
      [M(tdmFN(p * (1 - t1 / 100) + t2, 2) + '\\text{ €}'), M(tdmFN(p * (1 + (t2 - t1) / 100), 2) + '\\text{ €}'), M(tdmFN(Math.round(vf) + 10, 0) + '\\text{ €}')],
      1,
      EXPL(`On multiplie la valeur initiale par les coefficients successifs.`,
        `\\(${tdmFN(p, 0)}\\times${tdmFN(1 - t1 / 100)}\\times${tdmFN(1 + t2 / 100)} = ${tdmFN(vf, 2)}\\) €.`,
        `La hausse s'applique au prix BAISSE, pas au prix initial.`));
  }
  if(k === 2){
    /* Défi B : population après trois évolutions, arrondi à l'unité. */
    const n = pick([20000, 25000, 30000, 40000]);
    const t1 = pick([3, 4, 5]);
    const t2 = pick([4, 5, 6]);
    const t3 = pick([2, 3, 4]);
    const vf = n * (1 - t1 / 100) * (1 + t2 / 100) * (1 - t3 / 100);
    return QCM(`Une ville comptait \\(${tdmFN(n, 0)}\\) habitants. Elle en a perdu ${tdmFN(t1, 0)} %, puis gagné ${tdmFN(t2, 0)} %, puis reperdu ${tdmFN(t3, 0)} %.
      Combien compte-t-elle d'habitants (arrondi à l'unité) ?`,
      M(tdmFN(Math.round(vf), 0)),
      [M(tdmFN(Math.round(n * (1 + (t2 - t1 - t3) / 100)), 0)), M(tdmFN(Math.round(vf * 1.01), 0)), M(tdmFN(Math.round(n - n * (t1 + t3 - t2) / 100), 0))],
      1,
      EXPL(`Trois évolutions successives : \\(V_f = V_i\\times CM_1\\times CM_2\\times CM_3\\).`,
        `\\(${tdmFN(n, 0)}\\times${tdmFN(1 - t1 / 100)}\\times${tdmFN(1 + t2 / 100)}\\times${tdmFN(1 - t3 / 100)}\\approx ${tdmFN(Math.round(vf), 0)}\\) habitants.`,
        `Chaque évolution s'applique au résultat de la précédente — on ne globalise JAMAIS par une somme.`));
  }
  /* Finale moyenne : quatre hausses successives. */
  const vi = pick([3000, 4000, 5000, 6000, 8000]);
  const ts = [pick([5, 8, 10]), pick([3, 5, 8]), pick([10, 12, 15]), pick([5, 8, 10])];
  const vf = vi * ts.reduce((a, t) => a * (1 + t / 100), 1);
  return QCM(`Un capital de \\(${tdmFN(vi, 0)}\\) € subit quatre évolutions successives :
    +${tdmFN(ts[0], 0)} %, +${tdmFN(ts[1], 0)} %, +${tdmFN(ts[2], 0)} % puis +${tdmFN(ts[3], 0)} %.
    Quelle est sa valeur finale (en €, arrondie au centime) ?`,
    M(tdmFN(vf, 2) + '\\text{ €}'),
    [M(tdmFN(vi * (1 + ts.reduce((a, t) => a + t, 0) / 100), 2) + '\\text{ €}'), M(tdmFN(vf * 1.02, 2) + '\\text{ €}'), M(tdmFN(vi + vi * ts[0] / 100 * 4, 2) + '\\text{ €}')],
    1,
    EXPL(`Quatre évolutions : on MULTIPLIE les quatre coefficients.`,
      `\\(CM = ${ts.map(t => tdmFN(1 + t / 100)).join('\\times')} = ${tdmFN(vf / vi, 4)}\\), donc \\(V_f\\approx ${tdmFN(vf, 2)}\\) €.`,
      `Le total des taux (${tdmFN(ts.reduce((a, t) => a + t, 0), 0)} %) n'est PAS le taux global.`));
};

/* Taux manquant connaissant le CM global (enveloppe B). */
GEN.tauxManquant = () => {
  const vi = pick([200, 400, 600, 800]);
  const t1 = pick([10, 15, 20, 25]);
  const t2 = pick([10, 20, 25]);
  const vf = vi * (1 + t1 / 100) * (1 + t2 / 100);
  return QCM(`Un article passe de \\(${tdmFN(vi, 0)}\\) € à \\(${tdmFN(vf, 2)}\\) € après deux hausses successives.
    La première hausse est de ${tdmFN(t1, 0)} %. Quel est le taux \\(t\\) de la deuxième hausse (en %) ?`,
    M('+' + tdmFN(t2, 0) + '\\,\\%'),
    [M('+' + tdmFN(t1 + t2, 0) + '\\,\\%'), M('+' + tdmFN(Math.round((vf / vi - 1) * 100), 0) + '\\,\\%'), M('+' + tdmFN(Math.abs(t2 - t1), 0) + '\\,\\%')],
    1,
    EXPL(`\\(CM_{global} = \\dfrac{V_f}{V_i}\\), puis on DIVISE par le premier coefficient.`,
      `\\(\\dfrac{${tdmFN(vf, 2)}}{${tdmFN(vi, 0)}} = ${tdmFN(vf / vi, 4)}\\), puis \\(\\dfrac{${tdmFN(vf / vi, 4)}}{${tdmFN(1 + t1 / 100)}} = ${tdmFN(1 + t2 / 100)}\\), soit +${tdmFN(t2, 0)} \\(\\%\\).`,
      `Le taux global (${tdmFN(Math.round((vf / vi - 1) * 100), 0)} %) n'est PAS le deuxième taux.`));
};

/* Raisonnement à trous : taux global. */
GEN.trouGlobal = () => TROU(
  `Évolutions successives : complète le raisonnement.`,
  `Après une hausse de 10 % puis une baisse de 10 %, le coefficient global est \\(1{,}1\\times0{,}9={{0}}\\), soit un taux global de {{1}} \\(\\%\\).<br>
   Une hausse de 20 % puis une hausse de 20 % donnent un CM de {{2}}, soit +44 % — et non +40 %.<br>
   Le taux global de deux évolutions ne s'obtient jamais en {{3}} les taux : ce sont les {{4}} qui se multiplient.<br>
   Vérification : une hausse de \\(t\\,\\%\\) puis la même baisse laissent une valeur {{5}} à la valeur de départ.`,
  ['0,99', '-1', '1,44', 'additionnant', 'coefficients multiplicateurs', 'inférieure'],
  ['1', '1,4', '+1', '1,21', 'soustrayant', 'divisant', 'taux globaux', 'égale', 'supérieure', 'pamplemousse', '-11', '0,81'],
  `Une hausse puis une baisse de même taux ne se compensent jamais : (1+t)(1−t) = 1−t² < 1. Seul le produit des coefficients donne le global.`
);

/* ============================================================
   NOTION « TAUX MOYEN & TAUX ÉQUIVALENT »
   (moyenne géométrique, (1+t)^n, taux annuel équivalent)
   ============================================================ */

/* Taux moyen sur 2 périodes (enveloppe D). */
GEN.tauxMoyen2 = () => {
  const t1 = pick([5, 8, 10]);
  const t2 = pick([10, 12, 15]);
  const cm = (1 + t1 / 100) * (1 + t2 / 100);
  const tm = (Math.sqrt(cm) - 1) * 100;
  const tAr = (t1 + t2) / 2;
  return QCM(`Une population augmente de ${tdmFN(t1, 0)} % la première année, puis de ${tdmFN(t2, 0)} % la deuxième.
    Quel est le taux annuel MOYEN \\(t_m\\) (en %, arrondi à 0,01) ?`,
    M('+' + tdmFN(tm, 2) + '\\,\\%'),
    [M('+' + tdmFN(tAr, 2) + '\\,\\%'), M('+' + tdmFN(tm + 0.5, 2) + '\\,\\%'), M('+' + tdmFN(tm - 0.5, 2) + '\\,\\%')],
    1,
    EXPL(`Le taux moyen est une moyenne GÉOMÉTRIQUE : \\(1+t_m = \\sqrt{CM_{global}}\\).`,
      `\\(CM = ${tdmFN(1 + t1 / 100)}\\times${tdmFN(1 + t2 / 100)} = ${tdmFN(cm, 4)}\\), puis \\(t_m = \\left(\\sqrt{${tdmFN(cm, 4)}}-1\\right)\\times100\\approx ${tdmFN(tm, 2)}\\,\\%\\).`,
      `Le taux moyen N'EST PAS la moyenne arithmétique (${tdmFN(tAr, 2)} %) des deux taux.`));
};

/* Taux équivalent sur n périodes : (1+t)^n − 1 (finale difficile). */
GEN.tauxEquivalentN = () => {
  const t = pick([5, 10, 20, 25]);
  const n = pick([2, 3]);
  const cm = Math.pow(1 + t / 100, n);
  const T = (cm - 1) * 100;
  return QCM(`Un placement rapporte ${tdmFN(t, 0)} % par an, pendant ${n} ans consécutifs.
    Quel est le taux GLOBAL sur ces ${n} ans (en %, arrondi à 0,01) ?`,
    M('+' + tdmFN(T, 2) + '\\,\\%'),
    [M('+' + tdmFN(n * t, 0) + '\\,\\%'), M('+' + tdmFN(T + 1, 2) + '\\,\\%'), M('+' + tdmFN(Math.round(T / n * 100) / 100, 2) + '\\,\\%')],
    1,
    EXPL(`\\(n\\) évolutions identiques de \\(t\\,\\%\\) : \\(CM = \\left(1+\\dfrac{t}{100}\\right)^{${n}}\\).`,
      `\\(\\left(${tdmFN(1 + t / 100)}\\right)^{${n}} = ${tdmFN(cm, 4)}\\), soit +${tdmFN(T, 2)} \\(\\%\\).`,
      `${n} × ${tdmFN(t, 0)} % = ${tdmFN(n * t, 0)} % est FAUX : les intérêts portent intérêt.`));
};

/* Taux annuel équivalent connaissant le global (enveloppe C). */
GEN.tauxAnnuelEq = () => {
  const couples = [[21, 2, 10], [44, 2, 20], [10.25, 2, 5], [56.25, 2, 25], [33.1, 3, 10], [72.8, 3, 20], [15.76, 3, 5]];
  const c = pick(couples);
  const T = c[0], n = c[1], t = c[2];
  return QCM(`Un placement a rapporté +${tdmFN(T, 2)} % en ${n} ans, avec le même taux annuel \\(t\\).
    Déterminer \\(t\\) (en %, arrondi à 0,01).`,
    M('+' + tdmFN(t, 2) + '\\,\\%'),
    [M('+' + tdmFN(Math.round(T / n * 100) / 100, 2) + '\\,\\%'), M('+' + tdmFN(t + 1, 0) + '\\,\\%'), M('+' + tdmFN(Math.round(T * n) / (n * 10), 2) + '\\,\\%')],
    1,
    EXPL(`On cherche le taux constant qui, élevé à la puissance \\(n\\), redonne le global : \\(\\left(1+\\dfrac{t}{100}\\right)^{${n}} = 1+\\dfrac{T}{100}\\).`,
      `\\(1+\\dfrac{t}{100} = \\left(${tdmFN(1 + T / 100)}\\right)^{1/${n}} = ${tdmFN(1 + t / 100, 4)}\\), soit \\(t\\approx ${tdmFN(t, 2)}\\,\\%\\).`,
      `Diviser le global par ${n} (${tdmFN(Math.round(T / n * 100) / 100, 2)} %) donne la moyenne arithmétique, pas le taux équivalent.`));
};

/* ============================================================
   FICHE « ÉVOLUTIONS & TAUX » (récapitulatif EVOLUTIONS.html)
   ============================================================ */
Object.assign(FICHES, {
  'evolutions-taux': { titre: '📈 Évolutions, taux global & taux moyen', html: `
    <p><b>Taux de variation :</b> \\(t = \\dfrac{V_f - V_i}{V_i}\\times100\\) — toujours RELATIF à la valeur de DÉPART.
    Augmenter de \\(t\\,\\%\\) ⇔ multiplier par \\(1+\\dfrac{t}{100}\\) (coefficient multiplicateur, CM) ; diminuer ⇔ \\(1-\\dfrac{t}{100}\\).</p>
    <p><b>Valeurs :</b> \\(V_f = V_i\\times CM\\) ; pour REPARTIR en arrière, \\(V_i = \\dfrac{V_f}{CM}\\) (on divise, on ne retranche pas).</p>
    <p><b>Évolutions successives :</b> \\(CM_{global} = (1+t_1)(1+t_2)\\cdots(1+t_n)\\) — les coefficients se MULTIPLIENT, les taux ne s'additionnent pas.
    \\(+10\\,\\%\\) puis \\(+20\\,\\%\\) : \\(1{,}1\\times1{,}2 = 1{,}32\\), soit <b>+32 %</b> (et non +30 %). L'ordre ne change rien (commutativité).</p>
    <p><b>Taux global :</b> \\(T = CM_{global} - 1\\). Cas symétrique : \\(\\left(1+\\dfrac{t}{100}\\right)\\left(1-\\dfrac{t}{100}\\right) = 1-\\dfrac{t^2}{10000} < 1\\) :
    une hausse puis une baisse de même ampleur laissent la valeur SOUS son point de départ.</p>
    <p><b>Taux moyen (par période) :</b> \\(1+\\bar{t} = CM_{global}^{1/n}\\) — moyenne GÉOMÉTRIQUE des coefficients, pas moyenne arithmétique des taux.
    Exemple : de 100 à 121 en 2 ans → global +21 %, moyen \\(\\sqrt{1{,}21} = 1{,}1\\), soit <b>+10 % par an</b>.</p>
    <p><b>Taux équivalent sur n périodes :</b> \\(\\left(1+\\dfrac{t}{100}\\right)^n = 1+\\dfrac{T}{100}\\) ; réciproquement \\(t = \\left(1+\\dfrac{T}{100}\\right)^{1/n}-1\\).</p>
    <p><b>Évolution réciproque :</b> pour annuler une évolution, multiplier par \\(\\dfrac{1}{CM}\\) ;
    \\(+25\\,\\%\\) se compense par \\(\\times0{,}8\\) (soit −20 %), \\(-50\\,\\%\\) par \\(\\times2\\) (soit +100 %).</p>` }
});

/* La fiche « proportionnalité » gagne le paragraphe des proportions de proportions. */
FICHES['proportionnalite'].html += `
    <p><b>Proportion de proportion :</b> si \\(p_1\\) est la proportion d'une partie A dans le total, et \\(p_2\\) la proportion d'une sous-partie B dans A,
    alors \\(p = p_1\\times p_2\\) est la proportion de B dans le total (\\(\\dfrac{B}{Total} = \\dfrac{A}{Total}\\times\\dfrac{B}{A}\\)).
    Exemple : 80 femmes sur 200 personnes (0,4), 40 à lunettes parmi elles (0,5) → 0,4 × 0,5 = 0,2, soit 20 % du groupe.</p>
    <p><b>Retrouver un effectif :</b> partie = total × p ; total = partie ÷ p ; sous-total = partie ÷ p₂ — on remonte toujours en DIVISANT par la proportion.</p>`;

/* ============================================================
   ÉLÉMENTS SIMPLES : libellé + rappel + fiches des 18 générateurs
   ============================================================ */
Object.assign(GEN_INFO, {
  'propTrouve':        { label: "Proportion d'une partie (en %)", fiches: ['proportionnalite'],
    rappel: "Proportion = partie ÷ total, multipliée par 100 pour un pourcentage. Toujours diviser par le TOTAL." },
  'propPartie':        { label: 'Partie = total × p %', fiches: ['proportionnalite'],
    rappel: "Prendre p % d'une quantité : total × p ÷ 100. Ne pas retrancher p au total." },
  'propTotal':         { label: 'Retrouver le total', fiches: ['proportionnalite'],
    rappel: "Total = partie ÷ proportion. On DIVISE par la proportion, jamais on ne la multiplie." },
  'trouProp':          { label: 'Raisonnement : proportion', fiches: ['proportionnalite'],
    rappel: "Vocabulaire des proportions : quotient partie/total, conversion en pourcentage, effectif = total × p %." },
  'propDeProp':        { label: 'Proportion × proportion (en %)', fiches: ['proportionnalite'],
    rappel: "Proportion globale = produit des deux proportions : p = p₁ × p₂. On n'additionne JAMAIS les pourcentages." },
  'propDePropEff':     { label: "Effectif d'une sous-catégorie", fiches: ['proportionnalite'],
    rappel: "En cascade : effectif = total × p₁ × p₂ — la 2ᵉ proportion s'applique au sous-total, pas au total." },
  'propRemonte':       { label: 'Remonter une sous-population', fiches: ['proportionnalite'],
    rappel: "p₂ = partie ÷ sous-total ; sous-total = partie ÷ p₂ : la proportion cherchée est relative au bon ensemble de référence." },
  'cmDeTaux':          { label: 'Taux → coefficient', fiches: ['evolutions-taux', 'proportionnalite'],
    rappel: "Augmenter de t % ⇔ ×(1 + t/100) ; diminuer de t % ⇔ ×(1 − t/100)." },
  'tauxDeCM':          { label: 'Coefficient → taux', fiches: ['evolutions-taux'],
    rappel: "t = (CM − 1) × 100. CM > 1 : hausse ; CM < 1 : baisse." },
  'cmRetour':          { label: 'Coefficient de retour', fiches: ['evolutions-taux'],
    rappel: "CM de retour = 1/CM. +25 % se compense par ×0,8 ; −50 % par ×2 — jamais par −t %." },
  'trouCM':            { label: 'Raisonnement : coefficient', fiches: ['evolutions-taux'],
    rappel: "Définitions : CM d'une hausse/baisse, coefficient de retour = inverse, coefficients qui se multiplient." },
  'tauxGlobal2':       { label: 'CM / taux global (2 évolutions)', fiches: ['evolutions-taux'],
    rappel: "CM global = (1+t₁/100) × (1+t₂/100) ; T = CM − 1. L'ordre des évolutions ne change rien." },
  'vfSuccessives':     { label: 'Valeur finale après évolution(s)', fiches: ['evolutions-taux'],
    rappel: "V_f = V_i × CM₁ × CM₂ × … : chaque évolution s'applique au résultat de la précédente." },
  'tauxManquant':      { label: 'Taux manquant', fiches: ['evolutions-taux'],
    rappel: "CM global = V_f/V_i, puis on DIVISE par le coefficient connu pour isoler le taux cherché." },
  'trouGlobal':        { label: 'Raisonnement : taux global', fiches: ['evolutions-taux'],
    rappel: "Produit des coefficients, +t % puis −t % < 0, jamais de somme de taux." },
  'tauxMoyen2':        { label: 'Taux moyen (2 périodes)', fiches: ['evolutions-taux'],
    rappel: "Moyenne GÉOMÉTRIQUE : 1 + t_m = √(CM global). Pas la moyenne arithmétique des taux." },
  'tauxEquivalentN':   { label: 'Taux équivalent sur n périodes', fiches: ['evolutions-taux'],
    rappel: "CM = (1 + t/100)ⁿ ; T = CM − 1. n × t % est faux : les intérêts portent intérêt." },
  'tauxAnnuelEq':      { label: 'Taux annuel équivalent', fiches: ['evolutions-taux'],
    rappel: "t = (1 + T/100)^(1/n) − 1 : le taux constant qui, n fois appliqué, redonne le global T." }
});

/* ============================================================
   5 NOTIONS NOUVELLES — sommet de la tour (141 étages)
   ============================================================ */
NOTIONS.push(
  { id: 'proportions',  name: 'Proportions & pourcentages',             g: ['propTrouve', 'propPartie', 'propTotal', 'trouProp'],        family: 'orange', prob: 0.5 },
  { id: 'prop-de-prop', name: 'Proportions de proportions',             g: ['propDeProp', 'propDePropEff', 'propRemonte'],               family: 'orange', prob: 0.5 },
  { id: 'evol-cm',      name: 'Coefficient multiplicateur',            g: ['cmDeTaux', 'tauxDeCM', 'cmRetour', 'trouCM'],               family: 'teal',   prob: 0.5 },
  { id: 'evol-global',  name: 'Évolutions successives & taux global',   g: ['tauxGlobal2', 'vfSuccessives', 'tauxManquant', 'trouGlobal'], family: 'violet', prob: 0.5 },
  { id: 'evol-moyen',   name: 'Taux moyen & taux équivalent',          g: ['tauxMoyen2', 'tauxEquivalentN', 'tauxAnnuelEq'],             family: 'violet', prob: 0.5 }
);

/* Formes 3D des nouveaux étages (FLOOR_SHAPES est déclaré dans
   14-formes-3d.js, chargé plus tard : l'affectation attend la fin
   du chargement de la page ; la tour n'étant pas encore
   construite à cet instant, chaque étage aura sa silhouette). */
document.addEventListener('DOMContentLoaded', function(){
  try {
    FLOOR_SHAPES['proportions']  = 'bars';
    FLOOR_SHAPES['prop-de-prop'] = 'tree';
    FLOOR_SHAPES['evol-cm']      = 'ramp';
    FLOOR_SHAPES['evol-global']  = 'stairs';
    FLOOR_SHAPES['evol-moyen']   = 'wave';
  } catch(e) { /* formes de secours : 'box' */ }
});
