/* ============================================================
   11v. NIVEAUX DE CLASSE & TABLEAU CROISÉ
   Chaque notion de la tour est rattachée à un niveau scolaire
   (cycle 3 → post-bac). Ces données alimentent :
   • la vue « 🎓 Par niveau (tableau croisé) » de la progression,
   • les filtres par niveau de la révision personnalisée,
   • le tableau croisé du dossier de présentation.
   La correspondance suit les programmes officiels (notation et
   Python dès la 2de, second degré & dérivation en 1re, lois
   binomiales & probabilités conditionnelles en Terminale,
   arithmétique & graphes en maths expertes, etc.).
   ============================================================ */

const NIVEAUX = [
  { code: 'c3',   icon: '🌱', nom: 'Cycle 3 (CM1 · CM2 · 6e)',                    court: 'Cycle 3' },
  { code: 'c4',   icon: '🌿', nom: 'Cycle 4 (5e · 4e · 3e)',                        court: 'Cycle 4' },
  { code: '2de',  icon: '🎓', nom: 'Seconde',                                       court: '2de' },
  { code: '1re',  icon: '🎓', nom: 'Première (générale & technologique)',           court: '1re' },
  { code: 'tle',  icon: '🎓', nom: 'Terminale (générale & technologique)',          court: 'Tle' },
  { code: 'exp',  icon: '🌟', nom: 'Terminale — maths expertes & complémentaires',  court: 'Expertes' },
  { code: 'cpge', icon: '🏛', nom: 'Post-bac (CPGE & prépa)',                       court: 'CPGE' }
];

/* id de notion → code de niveau (les 228 notions de la tour). */
const NOTION_LEVELS = {};
(function(){
  const put = function(code, ids){ ids.forEach(function(id){ NOTION_LEVELS[id] = code; }); };
  put('c3', ['p-addsub','p-multdiv','p-compare','p-fraction','p-decimaux','p-conversion',
    'p-geo','p-prop','p-heure','p-suite','p-probleme','p-romain','p-symetrie',
    'u-conversions','fractions-egalite']);
  put('c4', ['c-relatifs','c-fracops','c-puissances','c-racines','c-litteral','c-eq1','c-ineq1',
    'c-pourc','c-pythagore','c-thales','c-trigo','c-angles','c-affine','c-fonction','c-stat',
    'c-proba','c-reperage','c-volumes','c-pgcd','c-transfo',
    'pourcentages','u-mesures','polygones-reg','proportions','triangle-droites',
    'fractions-signes','fractions-priorites','fractions-operations',
    'puissances-dix','puissances-regles','den-multiplicatif','frac-pieges']);
  put('2de', ['droites','trigonometrie','tab-signes','tab-variations','stats','notation-f',
    'espace','sets-logic','algo-prog',
    's-ensembles','s-facto','s-facto2','s-facto3','s-facto4','s-facto5','s-facto6','s-eqproduit',
    's-signe','s-fonction2','s-variations','s-ref','s-vecteurs','s-droites','s-systeme',
    's-grapheq','s-graphineq','s-stat2','s-proba2','s-taux','s-algo','s-courbeequation','s-transfo',
    'py-trous','py-analyse','py-whilefor','py-forwhile',
    'droites-fractions','droites-axes','droites-positions','droites-cartesiennes',
    'trigo-conversion','log-deduction','log-verdicts','fn-inverse']);
  put('1re', ['sd-formes','sd-eq','nbre-derive','fn-derivees','suites-arith','suites-geo',
    'prod-scalaire','degre3','bernoulli','bernoulli-rep','sommes-suites','stats-2var',
    'auto-evolutions','auto-droites','auto-graphiques','auto-probas',
    'lit-identifier','lit-mecanique','lit-electro-thermo','lit-chimie','lit-ondes',
    'lit-geometrie','lit-suites-stats','lit-economie','lit-algebre','lit-numeric',
    't-canonique','t-discriminant','t-solve2deg','t-trinomesigne','t-derivee','t-deriveept',
    't-tangente','t-tangentegraph','t-fprimevariation','t-courbederivee','t-polynome3',
    't-suitearith','t-suitegeo','t-suitegraph','t-evolutions','t-graphtaux','t-trigo2',
    't-scalaire','t-graphineq2','t-comparaison','t-rotation','t-angles-orientes','t-associes',
    't-courbetrigo','x-trinome','x-derivee','x-phare',
    'prop-de-prop','evol-cm','evol-global','evol-moyen','droites-pro',
    'derivee-racines-I','derivee-variations-I',
    'trigo-modulo','trigo-mesure-principale','trigo-symetries','trigo-cossin',
    'sd-sommet','sd-taux-variation','sd-conditions','sd-metamorphoses',
    'su-generalites','su-arithmetiques','su-geometriques','su-variation',
    'facto-sommeproduit','frac-rationnelles','stats-dispersion']);
  put('tle', ['cplx-alg','cplx-trigo','proba-cond','proba-totales','primitives','euler',
    't-euler','t-proba3','t-eqtrigo','t-ineqtrigo',
    'su-limites','su-fi','su-comparaison','su-arithmetico',
    'facto-cachees','facto-substitution',
    'den-permutations','den-arrangement','den-combinaisons','den-inclusion',
    'expo-basea','log-decimal','log-outils',
    'binomiale','binom-parametres','estim-intervalles','incertitudes',
    'edo-lineaire','edo-cauchy']);
  put('exp', ['mx-div','mx-premiers','mx-congruence','mx-congruence-ops',
    'cplx-ops','cplx-eq','gr-vocab','gr-structure','gr-euler',
    'facto-complexes','frac-pro','ln-exp','lim-fonctions','continuite-tvi']);
  put('cpge', ['den-expertes','al-vp','loi-normale','approx-poisson','loi-exponentielle','loi-uniforme','densite-proba','tcl-echantillon','estim-moyenne','tests-hyp','carte-controle','integrale-aire','integrale-lineaire','integrale-substitution','volume-revolution','ajustement-logistique','indice-100','systemes-positionnels','freq-cumulees']);
})();

/* Renvoie le niveau d'une notion (objet NIVEAUX) ; repli neutre si inconnu. */
function tdmNiveauDe(id){
  const code = NOTION_LEVELS[id];
  for(let i = 0; i < NIVEAUX.length; i++){
    if(NIVEAUX[i].code === code) return NIVEAUX[i];
  }
  return { code: '?', icon: '❓', nom: 'Niveau non renseigné', court: '?' };
}

/* Données du tableau croisé niveaux × catégories.
   Renvoie { cats, cells, rowTot, colTot, total } :
   cells[niveau][categorie] = nombre de notions à l'intersection. */
function tdmCroise(){
  const cats = (typeof PROG_CATS !== 'undefined') ? PROG_CATS : [];
  const catOf = {};
  cats.forEach(function(c, ci){
    (c.ids || []).forEach(function(id){ if(catOf[id] === undefined) catOf[id] = ci; });
    (c.subs || []).forEach(function(s){ s.ids.forEach(function(id){ if(catOf[id] === undefined) catOf[id] = ci; }); });
  });
  const lvlIdx = {};
  NIVEAUX.forEach(function(v, i){ lvlIdx[v.code] = i; });
  const cells = NIVEAUX.map(function(){ return cats.map(function(){ return 0; }); });
  const rowTot = NIVEAUX.map(function(){ return 0; });
  const colTot = cats.map(function(){ return 0; });
  NOTIONS.forEach(function(n){
    const ci = catOf[n.id];
    const li = lvlIdx[NOTION_LEVELS[n.id]];
    if(ci === undefined || li === undefined) return;
    cells[li][ci]++; rowTot[li]++; colTot[ci]++;
  });
  return { cats: cats, cells: cells, rowTot: rowTot, colTot: colTot,
           total: rowTot.reduce(function(a, b){ return a + b; }, 0) };
}
