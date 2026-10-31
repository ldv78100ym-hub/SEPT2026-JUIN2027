/* ============================================================
   11f. PROGRESSION PAR CATÉGORIES
   ------------------------------------------------------------
   Organisation thématique de la modale « 📚 Progression des
   notions » : les 155 notions (et leurs éléments simples) sont
   regroupées en catégories et sous-catégories pédagogiques.
   Exemple — « Équations & inéquations » réunit, en quatre sous-
   catégories (premier degré, second degré, produit d'une
   combinaison de 1er ou 2nd degré, lecture graphique), des
   notions jusque-là éparpillées dans la tour.
   Chaque notion apparaît dans UNE seule sous-catégorie (une
   notion non référencée tombe dans le groupe de secours
   « Autres » affiché en fin de modale).
   ============================================================ */
const PROG_CATS = [

  /* ---------- 1. Calcul mental & opérations (primaire) ---------- */
  { icon: '🧮', nom: 'Calcul mental & opérations',
    subs: [
      { nom: 'Opérations & comparaison', ids: ['p-addsub', 'p-multdiv', 'p-compare'] },
      { nom: 'Durées, suites & problèmes', ids: ['p-heure', 'p-suite', 'p-probleme', 'p-romain'] }
    ] },

  /* ---------- 2. Nombres, fractions & puissances ---------- */
  { icon: '🔢', nom: 'Nombres, fractions & puissances',
    subs: [
      { nom: 'Décimaux, relatifs & ensembles', ids: ['p-decimaux', 'c-relatifs', 's-ensembles', 'sets-logic'] },
      { nom: 'Fractions : valeur, égalité & comparaison', ids: ['p-fraction', 'c-pgcd', 'fractions-egalite'] },
      { nom: 'Fractions : signes & priorités', ids: ['fractions-signes', 'fractions-priorites'] },
      { nom: 'Fractions : les quatre opérations', ids: ['c-fracops', 'fractions-operations'] },
      { nom: 'Puissances & racines', ids: ['c-puissances', 'puissances-dix', 'puissances-regles', 'c-racines'] }
    ] },

  /* ---------- 3. Calcul littéral & factorisation ---------- */
  { icon: '✖️', nom: 'Calcul littéral & factorisation',
    subs: [
      { nom: 'Développer & réduire', ids: ['c-litteral'] },
      { nom: 'Factoriser', ids: ['s-facto', 's-facto2', 's-facto3', 's-facto4', 's-facto5'] }
    ] },

  /* ---------- 4. Équations & inéquations ---------- */
  { icon: '📘', nom: 'Équations & inéquations',
    subs: [
      { nom: 'Premier degré', ids: ['c-eq1', 'c-ineq1', 's-systeme', 'lit-algebre'] },
      { nom: 'Second degré & polynômes', ids: ['sd-eq', 'sd-formes', 't-canonique', 't-discriminant',
                                               't-solve2deg', 't-trinomesigne', 'degre3', 't-polynome3'] },
      { nom: "Produit d'une combinaison de 1ᵉʳ ou 2ᵈ degré", ids: ['s-eqproduit', 's-facto6'] },
      { nom: 'Lecture graphique', ids: ['s-grapheq', 's-graphineq', 't-graphineq2'] }
    ] },

  /* ---------- 5. Fonctions & lectures graphiques ---------- */
  { icon: '📈', nom: 'Fonctions & lectures graphiques',
    subs: [
      { nom: 'Notations, images & antécédents', ids: ['notation-f', 'c-fonction', 's-fonction2'] },
      { nom: 'Affines & fonctions de référence', ids: ['c-affine', 's-ref'] },
      { nom: 'Variations & signes', ids: ['s-variations', 'tab-variations', 'tab-signes', 's-signe'] }
    ] },

  /* ---------- 6. Droites & géométrie analytique ---------- */
  { icon: '📏', nom: 'Droites & géométrie analytique',
    subs: [
      { nom: 'Équations de droites', ids: ['droites', 's-droites', 's-courbeequation', 'droites-fractions',
                                           'auto-droites', 't-comparaison'] },
      { nom: 'Axes, positions & équations cartésiennes', ids: ['droites-axes', 'droites-positions', 'droites-cartesiennes'] },
      { nom: 'Situations professionnelles', ids: ['droites-pro'] },
      { nom: 'Triangle & droites remarquables', ids: ['triangle-droites'] }
    ] },

  /* ---------- 7. Géométrie ---------- */
  { icon: '📐', nom: 'Géométrie',
    subs: [
      { nom: 'Triangles, angles & théorèmes', ids: ['c-pythagore', 'c-thales', 'c-angles'] },
      { nom: 'Transformations & symétries', ids: ['c-transfo', 's-transfo', 't-rotation', 'p-symetrie'] },
      { nom: 'Vecteurs & produit scalaire', ids: ['s-vecteurs', 'prod-scalaire', 't-scalaire'] },
      { nom: 'Repérage, aires & volumes', ids: ['c-reperage', 'espace', 'polygones-reg', 'p-geo', 'c-volumes'] }
    ] },

  /* ---------- 8. Trigonométrie ---------- */
  { icon: '🌐', nom: 'Trigonométrie',
    subs: [
      { nom: 'Valeurs remarquables & angles', ids: ['c-trigo', 'trigonometrie', 't-trigo2',
                                                     't-angles-orientes', 't-associes'] },
      { nom: 'Équations & inéquations trigonométriques', ids: ['t-eqtrigo', 't-ineqtrigo'] },
      { nom: 'Courbes de sinus & cosinus', ids: ['t-courbetrigo'] }
    ] },

  /* ---------- 9. Dérivation, primitives & Euler ---------- */
  { icon: '📉', nom: 'Dérivation, primitives & Euler',
    subs: [
      { nom: "Nombre dérivé & tangentes", ids: ['nbre-derive', 't-deriveept', 't-tangente', 't-tangentegraph'] },
      { nom: "Fonctions dérivées & signe de f'", ids: ['fn-derivees', 't-derivee', 't-fprimevariation', 't-courbederivee'] },
      { nom: "Étude complète sur un intervalle", ids: ['derivee-racines-I', 'derivee-variations-I'] },
      { nom: "Primitives & méthode d'Euler", ids: ['primitives', 'euler', 't-euler'] }
    ] },

  /* ---------- 10. Suites ---------- */
  { icon: '🔁', nom: 'Suites',
    subs: [
      { nom: 'Arithmétiques & sommes', ids: ['suites-arith', 't-suitearith', 'sommes-suites'] },
      { nom: 'Géométriques', ids: ['suites-geo', 't-suitegeo'] },
      { nom: 'Lectures graphiques', ids: ['t-suitegraph'] }
    ] },

  /* ---------- 11. Pourcentages, proportions & évolutions ---------- */
  { icon: '💰', nom: 'Pourcentages, proportions & évolutions',
    subs: [
      { nom: 'Proportions & pourcentages', ids: ['p-prop', 'c-pourc', 'pourcentages', 'proportions', 'prop-de-prop'] },
      { nom: 'Évolutions & coefficients multiplicateurs', ids: ['s-taux', 't-evolutions', 't-graphtaux',
                                                                'evol-cm', 'evol-global', 'evol-moyen', 'auto-evolutions'] }
    ] },

  /* ---------- 12. Probabilités & statistiques ---------- */
  { icon: '🎲', nom: 'Probabilités & statistiques',
    subs: [
      { nom: 'Statistiques', ids: ['c-stat', 'stats', 's-stat2', 'stats-2var', 'auto-graphiques'] },
      { nom: 'Probabilités', ids: ['c-proba', 's-proba2', 't-proba3', 'proba-cond', 'proba-totales', 'auto-probas'] },
      { nom: 'Lois & variables aléatoires', ids: ['bernoulli', 'bernoulli-rep'] }
    ] },

  /* ---------- 13. Mesures & équations littérales ---------- */
  { icon: '⚛️', nom: 'Mesures & équations littérales',
    subs: [
      { nom: 'Conversions & mesures', ids: ['p-conversion', 'u-conversions', 'u-mesures'] },
      { nom: 'Identifier une formule', ids: ['lit-identifier', 'lit-numeric'] },
      { nom: 'Isoler une grandeur (sciences)', ids: ['lit-mecanique', 'lit-electro-thermo', 'lit-chimie',
                                                     'lit-ondes', 'lit-geometrie', 'lit-suites-stats', 'lit-economie'] }
    ] },

  /* ---------- 14. Nombres complexes ---------- */
  { icon: '🔷', nom: 'Nombres complexes',
    subs: [
      { nom: 'Forme algébrique', ids: ['cplx-alg'] },
      { nom: 'Forme trigonométrique', ids: ['cplx-trigo'] }
    ] },

  /* ---------- 15. Algorithmique & Python ---------- */
  { icon: '🖥️', nom: 'Algorithmique & Python',
    subs: [
      { nom: 'Algorithmique', ids: ['s-algo', 'algo-prog'] },
      { nom: 'Python', ids: ['py-trous', 'py-analyse', 'py-whilefor', 'py-forwhile'] }
    ] },

  /* ---------- 16. Missions de synthèse ---------- */
  { icon: '🎯', nom: 'Missions de synthèse',
    subs: [
      { nom: 'Enquêtes & missions', ids: ['x-trinome', 'x-derivee', 'x-phare'] }
    ] }
];
