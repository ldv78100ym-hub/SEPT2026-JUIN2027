# La Tour des Maths — Édition claire (version modulaire)

Optimisation du document monolithique `la-tour-des-maths-eleve.html` (≈ 459 Ko,
6 249 lignes) en une **série de sous-documents interconnectés** : 1 point
d'entrée, 1 dossier de présentation, 6 feuilles de style et 44 modules
JavaScript.

**Le comportement du jeu est identique** à l'original pour tout ce qui
existait — vérifié par exécution côte à côte (machines virtuelles Node, PRNG
déterministe). Cette version ajoute : la **décomposition en éléments
simples**, l'**horodatage de la dernière mise à jour**, la **révision
personnalisée**, l'**intégration des documents « Évolutions » et
« Proportions »** et l'**explorateur de liens du programme**, les **niveaux de classe et le
tableau croisé** (vue « 🎓 Par niveau » de la progression, filtres par
niveau de la révision) — une
succession de sous-graphes centrés sur une notion ou une zone, où
l'élève voit que les 209 notions sont toutes reliées, directement
ou indirectement (voir plus bas).

## Structure

```
la-tour-des-maths/
├── index.html                       ← point d'entrée : structure HTML + MathJax
│                                      + interconnexions <link> / <script>
├── rapport-publication.html         ← dossier de présentation type revue
│                                      pédagogique/journalistique (lié au menu)
├── css/
│   ├── 01-fondations.css            ← variables, mise en page, HUD, carte, QCM
│   ├── 02-surimpressions.css        ← menu hamburger, modales, leçon, overlay
│   ├── 03-questions-identite.css    ← raisonnements à trous, Python, identité,
│                                      notions passées, media queries
│   ├── 04-elements-solutions.css    ← éléments simples, fiches, infobulles,
│                                      réponse attendue, décomposition
│   ├── 05-revision-maj.css          ← menu utilitaire (date MAJ), modale de
│   │                                  révision personnalisée, badge, rev-list
│   └── 06-graphe-notions.css        ← modale 🕸️ « Graphe des notions » :
│                                      sous-graphes centrés, étiquettes,
│                                      panneau de détail, fil du chemin
└── js/
    ├── 01-outils.js                 ← helpers, formatage, QCM, leçons, SVG
    ├── 02-banque-qcm.js             ← générateurs QCM « GEN » (2nd degré, dérivées…)
    ├── 03-raisonnements-a-trous.js  ← clés à glisser + distracteurs loufoques
    ├── 04-python.js                 ← mini-programmes à trous + bâtisseurs SVG/NZ/pts
    ├── 05-banque-primaire-college.js← déclare G + volet primaire/collège
    ├── 06-automatismes-1re-techno.js← enrichit G (Object.assign)
    ├── 07-complements-1re-techno.js ← enrichit G (Object.assign)
    ├── 08-equations-litterales.js   ← enrichit G (Object.assign)
    ├── 09-texification.js           ← Unicode → LaTeX (txConv, texify, adaptQ)
    ├── 10-adaptateurs-banque.js      ← mkMC/mkN… + inscription G → GEN
    ├── 11-notions.js                ← les étages + familles de couleurs
    ├── 11b-elements-notions.js      ← 22 FICHES de rappel + GEN_INFO (libellé,
    │                                  rappel, fiches des générateurs) + helpers
    ├── 11c-evolutions-proportions.js← proportions, évolutions, taux
    │                                  (18 générateurs, fiche « Évolutions & taux »,
    │                                  5 notions → 141 étages au total)
    ├── 11d-droites.js              ← droites dans le plan (fractions,
    │                                  axes & signe, positions relatives, cartésiennes
    │                                  & distance, situations pro, triangle —
    │                                  20 générateurs, fiche « Droites dans le plan »,
    │                                  6 notions → 147 étages au total)
    ├── 11e-fractions.js            ← fractions & puissances
    │                                  (simplification/égalité/comparaison,
    │                                  règles des signes, priorités PEMDAS,
    │                                  4 opérations, puissances de 10,
    │                                  scientifique, ordre de grandeur, règles
    │                                  des puissances — 24 générateurs, fiche
    │                                  « Fractions & puissances », 6 notions →
    │                                  153 étages au total)
    ├── 11f-progression.js          ← catégories thématiques de la
    │                                  progression (20 catégories, ex. équations
    │                                  en 4 sous-catégories : 1er degré, 2nd
    │                                  degré, produit, lecture graphique)
    ├── 11g-derivation.js           ← étude d'une fonction polynôme sur un
    │                                  intervalle (forme factorisée de f',
    │                                  racines de f' dans I, tableau de
    │                                  signes, variations & extremums,
    │                                  images, tangente — 7 générateurs,
    │                                  fiche « Étude sur un intervalle »,
    │                                  2 notions → 155 étages)
    ├── 11h-trigonometrie.js        ← trigonométrie enrichie (degrés ↔ radians
    │                                  exactes, même point & modulo 2π, mesure
    │                                  principale par division euclidienne,
    │                                  symétries & rotations sur coordonnées
    │                                  et angles, compositions, point du
    │                                  cercle (cos ; sin) & quadrants —
    │                                  14 générateurs, fiches « Degrés,
    │                                  radians & mesure principale » et
    │                                  « Symétries, rotations & coordonnées »,
    │                                  5 notions → 160 étages au total)
    ├── 11i-second-degre.js          ← second degré enrichi (lecture des
    │                                  coefficients, axe de symétrie, sommet,
    │                                  extremum selon le signe de a, taux de
    │                                  variation a(x₁+x₂)+b affine en le
    │                                  milieu, détermination par conditions :
    │                                  f(0)=c, système 3×3, points de même
    │                                  ordonnée, sommet+point sans
    │                                  discriminant, trajectoire & sens d'une
    │                                  inégalité, choix contre déduction,
    │                                  métamorphoses : étirement, translations,
    │                                  lecture canonique, liens b=−2aα et
    │                                  c=aα²+β — 19 générateurs, fiches
    │                                  « Sommet, axe & métamorphoses » et
    │                                  « Déterminer un trinôme par ses
    │                                  conditions », 4 notions → 164 étages)
    ├── 11j-suites.js             ← suites numériques enrichies
    │                                  (définitions : liste de valeurs,
    │                                  explicite, récurrence, rang d'un
    │                                  terme ; arithmétiques :
    │                                  reconnaissance par différence
    │                                  constante, contre-exemples n², n³,
    │                                  2ⁿ, (−1)ⁿ, variation selon r,
    │                                  problèmes concrets — économies de
    │                                  Paul, dépréciation linéaire, dette,
    │                                  altitude, entraînement ; géométriques
    │                                  : reconnaissance par quotient,
    │                                  variation selon q (y compris 0 < q < 1
    │                                  et q < 0 → alternés), coefficients
    │                                  multiplicateurs 1±t/100, problèmes
    │                                  concrets — intérêts composés, CM
    │                                  économiques ; sens de variation :
    │                                  étude de u_{n+1}−u_n affine,
    │                                  quadratique (parfois non monotone),
    │                                  rationnelle (réduction au même
    │                                  dénominateur), racine carrée
    │                                  (croissance de x↦√x) — 20
    │                                  générateurs, fiches « Suites :
    │                                  définitions, rangs & récurrence »,
    │                                  « Arithmétique ou géométrique :
    │                                  reconnaître & modéliser » et « Sens
    │                                  de variation : étudier u_{n+1}−u_n »,
    │                                  4 notions → 168 étages)
    ├── 11k-limites.js             ← limites de suites : définition ε–N,
    │                                  références (n^k, 1/n^k, q^n),
    │                                  opérations et formes indéterminées
    │                                  (∞−∞, ∞/∞, 0×∞ : terme dominant,
    │                                  quantité conjuguée, degrés), bornés
    │                                  sin/cos ; convergence : gendarmes,
    │                                  comparaison, monotone bornée ;
    │                                  arithmético-géométriques (point fixe,
    │                                  suite auxiliaire v_n = u_n − c),
    │                                  sommes géométriques, problèmes
    │                                  concrets — forêt qui pousse, café
    │                                  qui refroidit, paradoxe de Zénon,
    │                                  Fibonacci lapins — 20 générateurs,
    │                                  fiches « Limites de suites :
    │                                  définition & formes indéterminées »,
    │                                  « Convergence : théorèmes de
    │                                  comparaison » et
    │                                  « Arithmético-géométriques &
    │                                  sommes géométriques », 4 notions →
    │                                  172 étages)
    ├── 11l-maths-expertes.js       ← maths expertes (portail 2026-2027) :
    │                                  division euclidienne, critères de
    │                                  divisibilité, facteurs premiers,
    │                                  PGCD (Euclide), congruences (restes,
    │                                  opérations, puissances & cycles,
    │                                  jours de la semaine), complexes
    │                                  (conjugué, module, inverse,
    │                                  équations du 1ᵉʳ et 2ᵈ degré dans ℂ),
    │                                  théorie des graphes (vocabulaire,
    │                                  degrés, poignées de main, chaînes
    │                                  eulériennes) — 17 générateurs,
    │                                  fiches « Divisibilité, nombres
    │                                  premiers & PGCD », « Congruences
    │                                  modulo n », « Théorie des graphes »
    │                                  + complément « Complexes », 2
    │                                  catégories nouvelles → 181 étages)
    ├── 11m-factorisation.js        ← factorisation (document « La
    │                                  Factorisation du Primaire à la
    │                                  Terminale ») : facteur caché « 1 »,
    │                                  signe opposé (a−x) = −(x−a),
    │                                  somme-produit, racines évidentes,
    │                                  x²+a² dans ℂ, bicarrée,
    │                                  substitution X = e^x et cos x — 8
    │                                  générateurs, fiche « Factorisation »,
    │                                  4 notions, 1 sous-catégorie → 185
    │                                  étages)
    ├── 11n-denombrement.js        ← dénombrement (document « Le
    │                                  Dénombrement du Primaire à la
    │                                  Terminale ») : k-uplets, case fixe,
    │                                  principe additif, permutations,
    │                                  anagrammes, arrangements,
    │                                  combinaisons, triangle de Pascal,
    │                                  inclusion-exclusion, complémentaire,
    │                                  tiroirs, étoiles et barres — 12
    │                                  générateurs, fiche « Dénombrement »,
    │                                  6 notions, 1 catégorie → 191 étages)
    ├── 11o-logique.js              ← logique (document « La Logique
    │                                  du Primaire à la Terminale ») :
    │                                  modus ponens, chaînage avant,
    │                                  négation forcée (verdict FAUX),
    │                                  verdict indéterminé, équivalence —
    │                                  5 générateurs, complément de la
    │                                  fiche « Logique », 2 notions,
    │                                  1 catégorie (accueille
    │                                  « sets-logic ») → 193 étages)
    ├── 11p-fractions-pro.js        ← fractions avancées (document « Le
    │                                  Calcul avec des Fractions du
    │                                  Primaire à la Terminale ») : faux
    │                                  théorème, simplification abusive,
    │                                  signes cachés, division inversée,
    │                                  rationnalisation, équation
    │                                  fractionnaire, télescopique,
    │                                  couples, comparaison croisée — 9
    │                                  générateurs, fiche « Fractions
    │                                  avancées » + avertissement dans
    │                                  « Fractions & puissances », 3
    │                                  notions, 2 sous-catégories → 196
    │                                  étages)
    ├── 11q-exponentielles-logarithmes.js
    │                                  ← exponentielles & logarithmes
    │                                  (documents « Exponentielles »,
    │                                  « Logarithme décimal » & sections
    │                                  fonctions des maths
    │                                  complémentaires) : a^u·a^v,
    │                                  équation a^x = b, variations,
    │                                  log & puissances de 10,
    │                                  log(AB) = log A + log B, seuils
    │                                  exponentiels, repères
    │                                  logarithmiques, ln & exp
    │                                  réciproques, croissances
    │                                  comparées — 11 générateurs,
    │                                  fiche « Exponentielles &
    │                                  logarithmes », 4 notions,
    │                                  1 catégorie → 200 étages)
    ├── 11r-fonction-inverse.js     ← fonction inverse (document
    │                                  T_STI2D « Fonction inverse ») :
    │                                  image & antécédent, décroissance
    │                                  par intervalles, équation 1/x = a
    │                                  & coût moyen, hyperbole &
    │                                  asymptotes — 4 générateurs,
    │                                  complément de la fiche
    │                                  « Fonctions », 1 notion,
    │                                  1 sous-catégorie → 201 étages)
    ├── 11s-binomiale-stats.js      ← loi binomiale & statistiques
    │                                  (documents « Crumble Hall », STS
    │                                  « Statistiques » & « Statistiques
    │                                  inférentielles », « Erreurs ») :
    │                                  schéma de Bernoulli, P(X = k),
    │                                  événement contraire, espérance np,
    │                                  variance & écart-type, dispersion,
    │                                  fluctuation, confiance,
    │                                  incertitudes, propagation,
    │                                  justesse & fidélité — 12
    │                                  générateurs, fiche « Fluctuation,
    │                                  confiance & incertitudes » +
    │                                  compléments « Probabilités » /
    │                                  « Statistiques », 5 notions,
    │                                  2 sous-catégories → 206 étages)
    ├── 11t-valeurs-propres.js      ← valeurs & vecteurs propres
    │                                  (document CPGE « L'Affaire des
    │                                  Trois Colonnes ») : invariant
    │                                  « somme des lignes », matrice
    │                                  triangulaire, trace &
    │                                  déterminant, sous-espace propre
    │                                  (A−λI)v = 0 — 4 générateurs,
    │                                  fiche « Algèbre linéaire », 1
    │                                  notion, 1 catégorie (CPGE) → 207
    │                                  étages)
    ├── 11u-limites-fonctions.js    ← limites de fonctions & continuité
    │                                  (document maths complémentaires,
    │                                  sections 1-2) : termes
    │                                  dominants, croissances comparées,
    │                                  formes indéterminées, asymptotes,
    │                                  TVI & corollaire d'unicité — 6
    │                                  générateurs, fiche « Limites,
    │                                  continuité & TVI », 2 notions,
    │                                  1 sous-catégorie → 209 étages)
    ├── 11v-niveaux.js              ← niveaux de classe & tableau croisé :
    │                                  NIVEAUX (7 niveaux : cycle 3, cycle 4,
    │                                  2de, 1re, terminale, maths expertes,
    │                                  CPGE), NOTION_LEVELS (rattachement des
    │                                  209 notions), tdmCroise() — alimente la
    │                                  vue « 🎓 Par niveau » de la progression,
    │                                  les filtres de la révision et le
    │                                  dossier (aucun nouvel étage, 44ᵉ module)
    ├── 12-etat-jeu.js                ← état global (customPool), références DOM, $
    ├── 13-tour-3d.js                 ← moteur canvas, caméra, rendu
    ├── 14-formes-3d.js               ← une forme 3D par notion
    ├── 15-interface.js               ← MathJax, questions, réponses, chutes,
    │                                  pickNotion (filtre par révision en cours)
    ├── 16-modales.js                 ← progression (catégories pliables),
    │                                  droits d'auteur
    ├── 16b-solution-pedagogique.js  ← modale fiche, infobulles data-tip,
    │                                  réponse attendue, décomposition, rappels
    ├── 17-reinitialisation.js        ← remise à zéro confirmée
    ├── 18-sauvegarde-scellee.js       ← RSA-2048 + AES-256, sessions, passées,
    │                                  horodatage derniereMaj + export enseignant
    ├── 19-demarrage.js                ← init, menu hamburger, typesetAll, tdmBoot
    ├── 19b-revision-personnalisee.js← modale 🎯 révision personnalisée
    │                                  (sélection de notions pour la session)
    ├── 20-graphe-notions.js          ← modale 🕸️ « Graphe des notions » :
    │                                  sous-graphes centrés, élèves & enseignants
    └── 21-monde-balle.js             ← 2ᵉ animation « balle rebondissante » :
                                       deux murs, paliers, traînée, écrasement,
                                       plancher coulissant, gerbes & larmes
```

## Interconnexions

- `index.html` charge les 6 feuilles CSS **dans l'ordre 01 → 06** puis les
  34 scripts **dans l'ordre 01 → 21** (l'ordre de chargement est l'ordre
  d'exécution).
- L'objet `GEN` (générateurs de questions, **315 clés**) est déclaré dans
  `01-outils.js`, alimenté par `02`, `03`, `04`, complété par l'inscription
  de la banque `G` dans `10-adaptateurs-banque.js` puis par les **18
  générateurs d'évolutions/proportions** de `11c` ; `11-notions.js` et
  `11c` associent chaque étage à ses générateurs.
- L'objet `G` (banque « fichier fusionné » en Unicode) est découpé en 4
  volets thématiques reliés par `Object.assign(G, { … })` : le volet 05 le
  déclare, les volets 06-08 l'enrichissent.
- `FICHES` et `GEN_INFO` (const dans `11b`) sont enrichis par `11c` via
  `Object.assign` / concaténation ; `11c` pousse ses 5 notions dans
  `NOTIONS` **avant** le chargement de `12-etat-jeu.js` (qui fige `N_TOT`),
  et les formes 3D des nouveaux étages sont assignées à `DOMContentLoaded`
  (`FLOOR_SHAPES` est déclaré dans `14`).
- `19b` s'auto-câble sur le bouton `#revisionBtn` du menu utilitaire et
  filtre `pickNotion()` (15) via `state.customPool`.

## Décomposition en éléments simples & solution pédagogique

- **`js/11b-elements-notions.js`** :
  - `FICHES` : 22 fiches thématiques complètes (calcul, nombres, unités,
    géométrie, Pythagore-Thalès, trigonométrie, algèbre, second degré,
    fonctions, dérivées, tableaux, suites, proportionnalité, probabilités,
    statistiques, vecteurs, espace, complexes, Python, littéral, logique) —
    ouvertes d'un clic, LaTeX compris.
  - `GEN_INFO` : pour chacun des 402 générateurs, un **libellé** clair, un
    **rappel** court (infobulle au survol) et ses **fiches** associées.
  - Helpers : `tdmGenLabel`, `tdmGenRappel`, `tdmGenFiches`,
    `tdmElemsDeNotion`, `tdmFichesDeNotion`.
- **`js/16b-solution-pedagogique.js`** : modale `#tdmFicheModal`,
  infobulle globale `#tdmTip` (`[data-tip]`, y compris LaTeX),
  `tdmElemsHTML` (lignes d'éléments, badge ✓n/✗n, ouverture de fiche),
  `tdmRepAttendue`, `tdmDecompoHTML` (élément raté mis en évidence),
  `tdmRappelsHTML`.
- **`js/20-graphe-notions.js`** : modale 🕸️ « Graphe des notions »
  (menu utilitaire, entrée `#grapheBtn`) — un explorateur de
  **sous-graphes centrés** (DOM + SVG, sans physique, très léger) :
  écran de départ (16 zones cliquables, ou reprise de la position en
  cours), puis chaque clic fait du nœud choisi le **centre** d'un
  sous-graphe : ses satellites directs (même sous-catégorie 🔗,
  même élément d'entraînement ⚙, fiches partagées 📘) sont disposés
  en anneaux, les liaisons sont **étiquetées** et cliquer un satellite
  relance l'exploration. **Chaque nœud est déplaçable** à la souris
  ou au doigt (glisser-déposer : les liaisons suivent, un clic reste
  un clic), et **chaque liaison ouvre au survol une étiquette
  explicative** (modale flottante : sous-catégorie commune, exercice
  partagé ou titres des fiches communes). **Aucun cadre ne se
  chevauche jamais** : les nœuds qui se touchent s'écartent
  automatiquement (même relâchés l'un sur l'autre après un
  glisser-déposer), et les étiquettes des liaisons — repliées sur
  plusieurs lignes quand elles sont longues — se placent dans un
  creux libre entre les nœuds. Interface compacte qui
  laisse toute la place au graphe : barres et légendes réduites,
  panneau de détail **repliable** (bouton ⤡) pour un graphe plein
  cadre. Un **fil du chemin** + compteur de sauts
  permet de revenir en arrière, et une **barre de portée** prouve
  que tout le programme est atteint en quelques sauts (« tout est
  lié »). Recherche par nom, panneau de détail à deux visages :
  mode 🎓 élèves (« Ce que tu vas t'entraîner à faire », fiches)
  et mode 👩‍🏫 enseignant (identifiants, rappels LaTeX via
  `tdmGenRappel` + MathJax, notions liées), intitulé du lien suivi,
  statuts ✔/⏭ synchronisés sur l'état du jeu.
  API : `tdmOuvreGraphe`, `tdmFermeGraphe`, `tdmGrapheCentre`,
  `tdmGrapheDepart`, `tdmGrapheMode`, `tdmGrapheVoisins`,
  `tdmGrapheEtat`.
- **Trois lieux décomposés** : sommaire « 📚 Progression des notions »,
  modale « ⏭ Notions passées » (mode mini), leçon d'erreur
  (✅ réponse attendue → cours/méthode/piège → 🧩 décomposition →
  📚 rappels utiles).
- **Sauvegarde scellée** : `SAV.logQuestion` comptabilise réussites et
  erreurs **par élément simple** (`parGen`) ; l'export enseignant
  (`tdmBuildDonnees`) joint à chaque notion ses éléments
  `{generateur, libelle, posees, reussies, erreurs}`.

## Horodatage de la dernière mise à jour

Le menu utilitaire (sandwich → « Sauvegarde… ») affiche en permanence la
ligne « 🕐 Dernière mise à jour : JJ/MM/AAAA à HH:MM » :

- chaque sauvegarde (`tdmSaveNow`, déclenchée à chaque réponse et à chaque
  événement de progression) horodate `SAV.data.derniereMaj` en ISO 8601 ;
- `tdmMajTexte()` formate la date/heure en français, `tdmRefreshMaj()`
  rafraîchit la ligne à l'ouverture du menu et après chaque sauvegarde ;
- l'horodatage **persiste** dans la sauvegarde scellée et figure dans
  l'export enseignant (`derniereMiseAJour`).

## Révision personnalisée (menu 🎯)

L'élève compose, **pour la session en cours**, un menu de notions à
réviser :

- bouton « 🎯 Révision personnalisée… » du menu utilitaire → modale avec
  les **209 notions**, un filtre de recherche, « Tout cocher /
  Tout décocher » et le décompte en direct ;
- **des puces de filtrage par niveau de classe** (🌐 Tous, 🌱 Cycle 3 ·
  15, 🌿 Cycle 4 · 32, 2de · 44, 1re · 75, Tle · 27, 🌟 Expertes · 14,
  🏛 CPGE · 2) affinent la liste — combinées au filtre de recherche —
  et chaque ligne porte son badge de niveau ;
- une fois lancée, la tour ne pose **que** des questions de la sélection
  (`state.customPool` filtré dans `pickNotion`) — mêmes règles de
  probabilités, de notions passées et de leçons d'erreur ; seule la source
  du tirage change ;
- badge flottant « 🎯 Révision : n notions », bouton du menu mis à jour
  (« 🎯 Révision en cours (n notions) »), bouton « ■ Terminer la
  révision » pour revenir au programme complet ;
- la sélection est **éphémère et sans impact sur la progression** : elle ne
  survit ni au rechargement de la page, ni au changement de session, et ne
  figure pas dans la sauvegarde scellée.

## Intégration des documents « Évolutions » et « Proportions »

Les trois documents fournis (jeu d'évaluation « Le Grand Défi des
Évolutions », récapitulatif « Évolutions », exercices auto-corrigés
« Proportions » avec 36 scénarios professionnels) sont intégrés au format
de la tour : **5 nouvelles notions en sommet de tour (141 étages au
total)**, **18 nouveaux générateurs**, **23ᵉ fiche « Évolutions & taux »**,
fiche « Proportionnalité » enrichie — chacun décomposé en éléments simples
avec libellé, rappel au survol et fiche(s) associée(s).

| Notion (étage) | Éléments simples (générateurs) |
|---|---|
| 🟠 Proportions & pourcentages | proportion d'une partie (en %) ; partie = total × p % ; retrouver le total ; raisonnement : proportion |
| 🟠 Proportions de proportions | proportion × proportion (en %) ; effectif d'une sous-catégorie ; remonter une sous-population |
| 🟦 Coefficient multiplicateur | taux → coefficient ; coefficient → taux ; coefficient de retour ; raisonnement : coefficient |
| 🟣 Évolutions successives & taux global | CM / taux global (2 évolutions) ; valeur finale après évolution(s) ; taux manquant ; raisonnement : taux global |
| 🟣 Taux moyen & taux équivalent | taux moyen (2 périodes) ; taux équivalent sur n périodes ; taux annuel équivalent |

Contenu couvert : proportion partie/total, proportion de proportion et
effectifs en cascade, remontée de sous-population ; CM ↔ taux dans les
deux sens ; coefficient de retour (évolution réciproque) ; taux global de
2 à 4 évolutions (dont le cas symétrique +t % puis −t % < 0) ; valeur
finale après évolutions successives ; taux manquant ; taux moyen
(moyenne géométrique) ; taux équivalent (1+t)ⁿ. Les questions à trous
reprennent le gabarit « raisonnement à clés » de la tour (trouProp,
trouCM, trouGlobal) et les exercices de proportions s'appuient sur 16
scénarios professionnels inspirés du document auto-corrigé (biologie,
qualité, élections, santé, environnement, production…).

## Intégration des documents « Droites dans le plan »

Les sept documents fournis (cours en 12 sections « L'Odyssée de la Droite »,
exercices interactifs à coefficients **fractionnaires**, exercices 1 à 10,
automatismes, problèmes de synthèse, PBL et bilan) sont intégrés au format
de la tour : **6 nouvelles notions en sommet de tour** (la tour passe
alors de 141 à 147 étages), **20 nouveaux générateurs**, **fiche « 📐
Droites dans le plan »** — chacun décomposé en éléments simples avec libellé, rappel au
survol et fiche(s) associée(s). Tous les calculs sont **exacts** (fractions
irréductibles), jamais décimaux arrondis.

| Notion (étage) | Éléments simples (générateurs) |
|---|---|
| 🟠 Droites & fractions (équations exactes) | équation réduite par 2 points (fractions) ; point + pente → ordonnée à l'origine ; point + ordonnée à l'origine → pente ; fonction affine par deux images ; lecture graphique |
| 🟦 Droites, axes & signe | intersections avec les axes ; signe de mx + p (inéquation) |
| 🟣 Positions relatives de deux droites | position relative ; point d'intersection (fractions) ; parallèle par un point ; perpendiculaire par un point ; raisonnement : positions relatives (à trous) |
| 🟦 Équations cartésiennes & distance | cartésienne par point + vecteur directeur ; distance d'un point à une droite (valeur exacte) ; point fixe d'un faisceau Δm |
| 🟠 Droites en situation professionnelle | seuil de rentabilité ; point d'équilibre de deux offres ; contrôle qualité (± tolérance) |
| 🟣 Triangle & droites remarquables | centre de gravité ; orthocentre |

Contenu couvert : équation réduite avec pentes fractionnaires (les
exercices graphiques « droite tracée » des documents sont adaptés en
lecture textuelle de deux points de la grille), intersections avec les
axes et tableau de signe de \\(mx+p\\), positions relatives
(parallèles / confondues / sécantes), parallèle et perpendiculaire passant
par un point (pente \\(m'=-1/m\\)), équation cartésienne par point et
vecteur directeur, distance point-droite (valeur exacte avec racine), point
fixe d'un faisceau de droites (résolution m = 0 / m = 1), modélisations
professionnelles des documents PBL (seuil de rentabilité
\\(q=C_f/(P_v-C_u)\\), point d'équilibre tarifaire, conformité à ±
tolérance par droites parallèles) et géométrie du triangle (centre de
gravité, orthocentre). Le raisonnement à trous trouPosition reprend le
gabarit « raisonnement à clés » de la tour.

## Intégration des documents « Fractions et puissances »

Les onze documents fournis (cours sur fractions en 10 règles animées,
règles de calcul récit + exercices 3 niveaux, règles des signes,
priorités opératoires pas-à-pas, QCM 62 questions, QCM progressif 4
niveaux, réduction de fractions, QCM d'écriture correcte des signes,
fusion calculs/signes/révisions, bilan « L'Odyssée des Fractions » en
12 sections et les 40 exercices sur les puissances entières) sont
intégrés au format de la tour : **6 nouvelles notions en sommet de tour**
(la tour passe de 147 à **153 étages**), **24 nouveaux générateurs**,
**fiche « 🧮 Fractions & puissances »** — chacun décomposé en éléments
simples avec libellé, rappel au survol et fiche(s) associée(s). Tous les
résultats sont des **valeurs exactes en fractions irréductibles** (jamais
de décimaux arrondis ; les décimales françaises n'apparaissent que pour
lire des nombres de l'énoncé : écriture scientifique, ordre de grandeur).

| Notion (étage) | Éléments simples (générateurs) |
|---|---|
| 🟠 Fractions : simplification, égalité, comparaison | réduire une fraction (facteurs premiers + PGCD) ; fraction égale (× haut et bas) ; comparaison (produits en croix) ; raisonnement : simplification (à trous) |
| 🟣 Règles des signes | signe d'un produit/quotient de relatifs (parité) ; simplification a + (−b) / a − (−b) ; produit de fractions signées (signe devant, au numérateur ou au dénominateur) |
| 🟦 Priorités opératoires | PEMDAS avec parenthèses et carré (valeurs exactes) ; piège a + b × c ; raisonnement : ordre des priorités (à trous) |
| 🟠 Quatre opérations sur les fractions | addition/soustraction (PPCM, piège (n₁±n₂)/(d₁+d₂)) ; multiplication (pièges croisés) ; division (inverse) ; entier & fraction (4 règles du cours) ; puissance d'une fraction ((p/q)^±n) ; expressions composées ((a/b ± c/d) × ou ÷ e/f) |
| 🟦 Puissances de 10, scientifique, ordre de grandeur | 10^m × 10^n, 10^m/10^n, (10^m)^n (exposants relatifs) ; inverse 1/10^n = 10^(−n) ; exposant de l'écriture scientifique (grands et petits nombres) ; ordre de grandeur (mantisse inférieure ou supérieure à 5, exposants négatifs inclus) |
| 🟣 Règles sur les puissances | (−a)^n contre −a^n ; même exposant (a^n × b^n, quotient) ; calcul littéral (a^n × a^m × a^p, quotients a^x·b^y, exposants négatifs) ; formes combinées ((x^p)^q × x^n/x^m) |

Contenu couvert : définition et irréductibilité (décomposition en
facteurs premiers, PGCD), égalité de fractions, comparaison par produits
en croix ou PPCM, règles des signes (parité des facteurs négatifs,
signe d'une fraction devant/au numérateur/au dénominateur,
simplification des écritures \(+(-a)\) et \(-(-a)\)), priorités
opératoires PEMDAS avec valeur exacte attendue, les quatre opérations sur
des fractions (y compris entier ±/×/÷ fraction et les pièges classiques :
addition des dénominateurs, croisement, oubli de l'inverse), puissances
d'une fraction (exposant positif ou négatif), puissances de 10 et
exposants relatifs, écriture scientifique (un seul chiffre non nul avant
la virgule) et ordre de grandeur (mantisse inférieure ou supérieure à 5),
(−a)^n contre −a^n, a^n × b^n = (ab)^n, calcul littéral sur les
exposants et formes combinées des 40 exercices du document. Les deux
raisonnements à clés trouSimplifie et trouPriorites reprennent le
gabarit « raisonnement à clés » de la tour.

## Intégration du document « Dérivées, signes, variations et tangentes »

Le document (exercices générés sur une fonction polynôme de degré 1 à 3
étudiée sur un intervalle I = [A ; B], avec raisonnements à reconstituer
et constructeurs interactifs de tableaux) est intégré au format de la
tour, en évitant toute duplication avec l'existant : la dérivation
polynomiale de base (`deriveePoly`) et la tangente à x² (`t-tangente`)
étaient déjà implantées — seules les parties **absentes** de la tour ont
été ajoutées : **2 nouvelles notions en sommet de tour** (la tour passe
de 153 à **155 étages**), **7 nouveaux générateurs**, **fiche « 📉 Étude
d'une fonction sur un intervalle »**, nouvelle sous-catégorie « Étude
complète sur un intervalle » dans la catégorie Dérivation de la
progression. Les exercices conservent la logique du document : les
racines de f' hors de l'intervalle ne comptent pas, le signe de f' se
lit sous-intervalle par sous-intervalle, les extremums n'apparaissent
qu'aux changements de signe, et la tangente est demandée en forme
réduite.

| Notion (étage) | Éléments simples (générateurs) |
|---|---|
| 🟦 Signe de la dérivée & racines sur un intervalle | forme factorisée k(x−r) ou k(x−r₁)(x−r₂) de f' ; résolution de f'(x) = 0 sur I (racines hors intervalle exclues, cas « aucune »/« une seule »/« deux ») ; tableau de signes de f' sur I |
| 🟩 Variations, images & tangente sur un intervalle | images des valeurs remarquables et des bornes (f(r) contre f'(r)) ; variations et extremums locaux (y compris cas monotone) ; équation réduite de la tangente en x₀ (ordonnée à l'origine f(x₀) − x₀·f'(x₀)) ; raisonnement : chaîne complète d'une étude (à trous) |

Les pièges du document sont conservés en distracteurs : confondre
« produit nul ⟹ tous les facteurs nuls », garder une racine hors de I,
chercher le signe de f au lieu de f', annoncer un extremum sans
changement de signe, prendre f(x₀) pour l'ordonnée à l'origine de la
tangente.

**Renommage « automatisme »** : les titres des quatre notions de la
famille ne mentionnent plus le mot « automatisme » (le dispositif tout
entier vise les automatismes — aucun étage ne doit se distinguer) :
« Évolutions & taux réciproque », « Droites, pentes & tracés », « Lire
un graphique (barres, boîte, circulaire) », « Probabilités & notations ».
Le banc d'essai vérifie désormais qu'aucun titre de notion ne contient
ce mot.

## Intégration des documents de trigonométrie

Les documents fournis — « Trigonométrie — Les Arcanes du Cercle » (cours
LaTeX + quête interactive en neuf épreuves), « Trigonométrie — Symétries,
coordonnées & angles en degrés » (24 exercices interactifs en cinq
parties), « Bilan de trigonométrie » (cours complet + quiz + une
centaine d'exercices) et le sujet type d'évaluation du 05/11/2026
(QCM de formules, congruence, mesure principale, tableau symétries →
angle image) — sont intégrés au format de la tour, **sans dupliquer**
ce qui y existait déjà : angles associés (`trigoAssoc`, `t-associes`),
valeurs remarquables isolées (`t-trigo2`), mesure principale de cas
fixes (`t-angles-orientes`), équations et inéquations
(`t-eqtrigo`, `t-ineqtrigo`), courbes (`t-courbetrigo`) et trigo du
triangle rectangle (`c-trigo`) sont conservés tels quels.

**5 nouvelles notions en sommet de tour** (la tour passe de 155 à
**160 étages**), **14 nouveaux générateurs**, **2 fiches** (« 🌐 Degrés,
radians & mesure principale », « 🌐 Symétries, rotations &
coordonnées »), **2 nouvelles sous-catégories** dans la catégorie
🌐 Trigonométrie de la progression (« Degrés, radians & mesure
principale », « Symétries, rotations & coordonnées »).

| Notion (étage) | Éléments simples (générateurs) |
|---|---|
| 🟪 Degrés & radians : conversions exactes | conversion degrés → radians (facteur π/180, simplification par le PGCD, valeur exacte) ; conversion radians → degrés ; raisonnement complet à clés (correspondance 180° = π, facteur inverse, numérateur, PGCD, valeur exacte) |
| 🟪 Même point du cercle & modulo 2π | réel repérant le même point (θ + 2kπ, distracteurs θ + π, −θ, 2π − θ, 2θ, θ/2) ; raisonnement complet à clés (multiple de 2π, tours complets, division euclidienne, unicité) |
| 🟪 Mesure principale d'un angle | cas quelconques (13π/6, −5π/4, 7π/2…) par division euclidienne du numérateur par 2d, retrait d'un tour si le reste dépasse d — au-delà des cas fixes déjà présents |
| 🟪 Symétries, rotations & coordonnées de l'image | image de M(x ; y) par symétrie d'axe (O, i), (O, j) ou de centre O (entiers, fractions, racines, mixtes) ; image par rotation de ±90° ; angle image (−θ, π−θ, π+θ, θ±π/2) ; identifier la transformation (depuis les coordonnées ou depuis les angles) ; composée de deux transformations (Sj∘Si = SO, involutivité, 3 symétries) ; raisonnement complet à clés |
| 🟪 Point du cercle : cosinus, sinus & quadrants | coordonnées (cos θ ; sin θ) d'un angle remarquable (les deux à la fois, avec vérification cos²+sin²=1) ; quadrant et signes de cos θ et sin θ |

Les pièges des documents sont conservés en distracteurs : facteur de
conversion inversé, π remplacé par 3,14 (perte d'exactitude), confondre
π−θ (axe (O, j)) et π+θ (centre O), mesurer sur [0 ; 2π[ au lieu de
l'intervalle principal ]−π ; π], échanger abscisse et ordonnée,
composer deux symétries axiales en une symétrie axiale.

## Intégration des documents du second degré

Les documents fournis — « À la découverte des fonctions du second
degré » (machine à paraboles : rôle de a, b, c ; taux de variation
T = a(x₁+x₂)+b affine en le milieu, T = 2ax+ah+b ; jeu du panier
h(t) = at²+bt), « L'Odyssée du second degré — réordonnancement du
raisonnement » (cours LaTeX en huit chapitres, carnet de terrain,
huit réflexes, cinq affaires : sommet α=−b/2a, axe, canonique,
f(0)=c, trajectoire du ballon h(d)=0 et h(x_w) ≥ h_w → sens d'une
inégalité, système 3×3 par f(0)/f(1)/f(2), points de même
ordonnée → α au milieu, f(x)=ax² par un point, reconstitution
canonique sans discriminant, **choix contre déduction**) et
« L'Odyssée du second degré — Parties 1 & 2 » (niveaux coefficients,
axe, sommet, canonique, extremum, symétrie ; métamorphoses :
étirement ax², translations x²+β et (x−α)², lecture canonique,
liens b=−2aα et c=aα²+β, fractions irréductibles) — sont intégrés
au format de la tour, **sans dupliquer** ce qui y existait déjà :
formes canonique/développée/factorisée (`canonique`, `devRed`,
`factorisation`, `trouCanonique`), équations et inéquations
(`eqSecond`, `ineqSecond`, `signExpr`), discriminant, signe et
racines (`t-canonique`, `t-discriminant`, `t-solve2deg`,
`t-trinomesigne`, `t-graphineq2`, `x-trinome`), taux d'accroissement
lu graphiquement (`t-graphtaux`) sont conservés tels quels. Le
« Déchiffreur » fourni est un outil enseignant autonome (chiffré
AES-GCM), sans contenu d'exercice : il n'est pas intégré.

**4 nouvelles notions en sommet de tour** (la tour passe de 160 à
**164 étages**), **19 nouveaux générateurs**, **2 fiches** (« 🟨
Sommet, axe & métamorphoses », « 🟨 Déterminer un trinôme par ses
conditions »), **1 nouvelle sous-catégorie** dans la catégorie
📘 Équations & inéquations de la progression (« Sommet, taux de
variation & conditions »).

| Notion (étage) | Éléments simples (générateurs) |
|---|---|
| 🟨 Second degré : sommet, axe & extremum | lecture des coefficients a, b, c ; axe de symétrie x = α = −b/(2a) (distracteurs b/2a, −b/a, ordonnée) ; sommet S(α ; β) ; minimum ou maximum selon le signe de a ; raisonnement complet à clés (α, β, axe, ouverture, forme canonique, symétrie, parabole) |
| 🟨 Taux de variation d'un trinôme | calcul T = a(x₁+x₂)+b (distracteurs : sans +b, différence au lieu de somme) ; à milieu fixé, T = 2am+b constant — jamais la longueur de l'intervalle ; raisonnement complet à clés (pente de la sécante, quotient Δy/Δx, milieu, affine en la position, sécante) |
| 🟨 Déterminer un trinôme par ses conditions | système 3×3 par f(0), f(1), f(2) (soustractions membre à membre) ; deux points de même ordonnée → sommet au milieu puis b = −2aα puis c ; f(x) = ax² par un point (a = y₀/x₀², signe imposé) ; sommet + point sans discriminant (a = (y₀−β)/(x₀−α)², b = −2aα, c = aα²+β) ; trajectoire h(t) = at²+bt : b = −ad, mur → inégalité divisée par un négatif (sens retourné), puis choix de a ; raisonnement complet à clés (équation, c = f(0), milieu, déduit, choix, sens, vérification) |
| 🟨 Métamorphoses de la parabole | étirement y = ax² (sommet O invariant, retournement si a < 0) ; translations x²+β et (x−α)² (piège du signe) ; lecture de la forme canonique a(x−α)²+β ; liens b = −2aα et c = aα²+β sans développer ; raisonnement complet à clés (étirement, retournée, verticale, droite, canonique, axe, développer) |

## Intégration des documents sur les suites numériques

Les documents fournis — « Définitions des suites numériques » (modes de
définition : liste de valeurs, courbe, formule explicite, relation de
récurrence), « Leçons sur les suites numériques » (suite (u_n) vs terme
u_n, rang/indice, sens de variation), simulateurs « Suite arithmétique »
et « Suite géométrique » (pas à pas, récurrence, formule explicite,
projection, variation selon r/q), « Cours & méthodes arithmétiques /
géométriques », « Exercices suites arithmétiques » (reconnaissance,
contre-exemples n², n³, 2ⁿ, (−1)ⁿ, économies de Paul),
« Exercices conceptualisés » arithmétiques (bactéries, dépréciation
linéaire, dette, altitude, entraînement, photocopieuse, empilement de
cubes) et géométriques (CM/pourcentages, intérêts composés, rumeur,
voiture, salaire), et « Variation d'une suite » (étude de
u_{n+1}−u_n : affine, quadratique, rationnelle, racine carrée) — sont
intégrés au format de la tour, **sans dupliquer** ce qui y existait
déjà : générateurs historiques des suites arithmétiques et
géométriques (`suiteArith`, `suiteArith2`, `trouSuiteArith`,
`suiteGeo`, `suiteGeo2`, `trouSuiteGeo`), notions de la banque
(`t-suitearith`, `t-suitegeo`, `t-suitegraph`), sommes de suites
(`sommes-suites`), problèmes (`p-suite`), lectures statistiques
(`lit-suites-stats`) et évolutions en pourcentages (`t-evolutions`,
`evol-cm`, `evol-global` — coefficients multiplicateurs déjà couverts
par la famille évolutions) sont conservés tels quels. Le « Sommaire
suites numériques 2025-2026 » est une page de liens sans contenu
propre : il n'est pas intégré.

**4 nouvelles notions en sommet de tour** (la tour passe de 164 à
**168 étages**), **20 nouveaux générateurs**, **3 fiches** (« 🟪
Suites : définitions, rangs & récurrence », « 🟪 Arithmétique ou
géométrique : reconnaître & modéliser », « 🟪 Sens de variation :
étudier u_{n+1} − u_n »), **1 nouvelle sous-catégorie** dans la
catégorie 🔁 Suites de la progression (« Définitions, variation &
modélisation »).

| Notion (étage) | Éléments simples (générateurs) |
|---|---|
| 🟪 Suites : définitions, termes & rangs | lecture d'une liste de valeurs (terme lu, rang, nombre de termes) ; formule explicite u_n = f(n) (calcul direct) ; relation de récurrence u_{n+1} = g(u_n) (itération) ; rang du premier terme dépassant un seuil (inéquation ou balayage) ; raisonnement complet à clés (liste, explicite, récurrence, rang, indice, seuil) |
| 🟪 Suites arithmétiques : reconnaître & modéliser | reconnaissance par différence constante (tableau de valeurs) ; contre-exemples n², n³, 2ⁿ, (−1)ⁿ (pas arithmétiques) ; sens de variation selon le signe de r ; problèmes concrets (économies, dépréciation linéaire, dette, altitude, empilement de cubes) ; raisonnement complet à clés (différence, constante, raison, récurrence, explicite) |
| 🟪 Suites géométriques : coefficients multiplicateurs | reconnaissance par quotient constant ; sens de variation selon q (croissante si q > 1, décroissante si 0 < q < 1, alternée si q < 0) ; coefficient multiplicateur 1+t/100, 1−t/100 ; problèmes concrets (intérêts composés, CM économiques) ; raisonnement complet à clés (quotient, raison, multiplicateur, récurrence, explicite) |
| 🟪 Sens de variation d'une suite | étude de u_{n+1}−u_n : cas affine (différence constante) ; cas quadratique (développement de (n+1)², différence affine en n — parfois non monotone) ; cas rationnelle (réduction au même dénominateur, signe du déterminant) ; cas racine (croissance de x↦√x) ; raisonnement complet à clés (différence, développer, dénominateur, signe, monotone) |

## Intégration des documents sur les limites de suites

Les documents fournis sur les **limites de suites numériques** (cours
illustré des limites de suites, cours « Suites et limites », exercices
corrigés de suites numériques et limites, bilan récapitulatif des
limites, énigmes sur les limites — paradoxe de Zénon, spirale de
Fibonacci…) sont intégrés au format de la tour : **4 nouvelles notions
en sommet de tour** (la tour passe de 168 à **172 étages**), **20
nouveaux générateurs**, **3 fiches** (« 🟪 Limites de suites :
définition & formes indéterminées », « 🟪 Convergence : théorèmes de
comparaison », « 🟪 Arithmético-géométriques & sommes géométriques »),
**1 nouvelle sous-catégorie** dans la catégorie 🔁 Suites de la
progression (« Limites & convergence »).

Les ressources du portail **Maths Expertes 2026-2027** (« L'Affaire
des Congruences », « À la découverte de la congruence : voyage au pays
des restes », « Les Congruences du Grimoire » — congruences et
récurrence —, « Règles de divisibilité — démonstrations », « Nombres
complexes — cours & équations du premier degré », « LEGERE » — théorie
des graphes) sont intégrées au format de la tour : **9 nouvelles
notions** insérées juste sous le sommet (la tour passe de 172 à
**181 étages**), **17 générateurs**, **3 fiches** (« 🔑 Divisibilité,
nombres premiers & PGCD », « 🔐 Congruences modulo n », « 🕸️ Théorie
des graphes ») plus un complément de la fiche « Complexes » (conjugué,
module, inverse, équations dans ℂ), **2 catégories nouvelles** dans la
progression (« 🔐 Arithmétique & congruences », « 🕸 Théorie des
graphes ») et 2 sous-catégories nouvelles dans « 🔷 Nombres
complexes ». Des fiches-ponts (nombres, logique) relient ces nouveaux
contenus au reste du programme : tout reste lié dans le graphe.

| Notion (étage) | Éléments simples (générateurs) |
|---|---|
| 🟪 Limites de suites : définition, références & opérations | références (n^k → +∞, 1/n^k → 0, q^n selon \|q\|, croissances comparées) ; opérations sur les limites (somme, produit, quotient — et leurs exceptions) ; convergence/divergence (limite finie, ±∞, oscillation) ; définition ε–N (bande de largeur 2ε, rang N, plafond ⌈·⌉) ; raisonnement complet à clés (converge, zéro, plafond, unique, diverge, adhérence, bande) |
| 🟪 Formes indéterminées & techniques de levée | ∞−∞ par factorisation du terme dominant ; ∞/∞ par comparaison des degrés (quotient des coefficients dominants) ; quantité conjuguée (racines, (√A−√B)(√A+√B) = A−B) ; 0×∞ et 0/0 ; sinus/cosinus bornés (encadrement entre −1 et 1) ; raisonnement complet à clés (dominant, conjuguée, degrés, bornés) |
| 🟪 Convergence : théorèmes de comparaison | théorème des gendarmes (encadrement v_n ≤ u_n ≤ w_n de même limite) ; gendarmes sur un quotient encadré ; comparaison (minorante tendant vers +∞, majorante vers −∞) ; limite monotone (croissante et majorée → converge, décroissante minorée) ; raisonnement complet à clés (gendarmes, encadrement, minorante, majorée, monotone) |
| 🟪 Arithmético-géométriques & sommes géométriques | point fixe (c = b/(1−a), équilibre) ; suite auxiliaire v_n = u_n − c (géométrique de raison a) ; limite selon \|a\| < 1 ou > 1 ; problèmes concrets (potion, café qui refroidit, forêt qui pousse) ; sommes géométriques 1 + q + … + q^n (paradoxe de Zénon, lapins de Fibonacci) |

Contenu couvert : définition formelle de la convergence (ε–N, rang,
bande de largeur 2ε autour de ℓ), unicité de la limite, valeurs
d'adhérence, divergence (vers ±∞ ou par oscillation), les références
usuelles (n^k, 1/n^k, q^n, √n) et les croissances comparées, les
opérations sur les limites et les formes indéterminées (∞−∞, ∞/∞, 0×∞,
0/0) avec leurs techniques de levée (terme dominant, quantité conjuguée,
comparaison des degrés, encadrement des fonctions bornées), le théorème
des gendarmes, la comparaison, le théorème de la limite monotone
(croissante et majorée), les suites arithmético-géométriques (point
fixe, suite auxiliaire) et les sommes géométriques finies, à travers
des problèmes concrets (refroidissement du café, potion, forêt,
paradoxe de Zénon, lapins de Fibonacci).

Documents non intégrés (volontairement) : les deux applications
d'évaluation « SUITES-ET-LIMITES — version élèves » et « traitement des
réponses par lot » (chiffrement AES, copies notées sur 20) et leur
mode d'emploi (`.tex`/`.pdf`) sont des outils de passation externes,
sans lien avec le jeu ; les documents sur les suites générales,
arithmétiques et géométriques (SUITES_MATHS_CO, SUITES_GÉOMÉTRIQUES
C-FACILE, cours-exemples géométriques) étaient déjà couverts par le
module 11j ; « MATHS_COMP_S1-A-S3 » (limites de **fonctions**,
continuité, TVI, ln/exp) et « MATHS_COMP_STATS-PROBA — projet
élections » (intervalles de fluctuation/confiance, loi binomiale)
relèvent d'une tour suivante.

## Intégration des documents « Factorisation, Dénombrement, Logique & Fractions »

Quatre documents interactifs fournis (« La Factorisation du Primaire
à la Terminale », « Le Dénombrement du Primaire à la Terminale »,
« La Logique du Primaire à la Terminale » et « Le Calcul avec des
Fractions du Primaire à la Terminale » — chacun 150+ situations
dynamiques avec corrections pas à pas colorées et quizz de synthèse)
sont intégrés au format de la tour : **15 nouvelles notions** insérées
sous le sommet (la tour passe de 181 à **196 étages**), **34
générateurs**, **2 fiches** (« ✖️ Factorisation : du facteur commun
aux identités remarquables », « 🎱 Dénombrement & combinatoire »), la
fiche « 🧠 Logique » enrichie (modus ponens, chaînage, verdicts,
équivalence), la fiche « 🧪 Fractions avancées » (pièges,
rationnalisation, techniques de pro) plus un avertissement du « faux
théorème » dans « Fractions & puissances », **2 catégories
nouvelles** dans la progression (« 🎱 Dénombrement & combinatoire »,
« 🧠 Logique & raisonnement » — cette dernière accueille aussi
« sets-logic », retirée de sa sous-catégorie d'origine pour éviter
tout doublon) et 3 sous-catégories enrichies (« Calcul littéral &
factorisation », « Nombres, fractions & puissances »). Des
fiches-ponts relient les nouveaux contenus au reste du programme :
factorisation ↔ complexes, second degré, suites et trigonométrie ;
dénombrement ↔ probabilités et logique ; fractions ↔ suites et
algèbre. Tout reste lié dans le graphe.

| Notion (étage) | Éléments simples (générateurs) |
|---|---|
| 🟦 Facteurs cachés : 1 implicite & signes | facteur caché « 1 » ((x−a)(x+b) + (x−a) = (x−a)(x+b+1)) ; signe opposé (a−x) = −(x−a) |
| 🟦 Somme-produit & racines évidentes | deux entiers de produit P et somme S ; racine évidente + produit des racines (x₂ = c/a ÷ x₁, sans discriminant) |
| 🩷 Factoriser dans ℂ : x² + a² | x² + a² = (x−ia)(x+ia) car (ia)² = −a² |
| 🟪 Changement de variable pour factoriser | bicarrée (X = x²) ; substitution X = e^x (e^(2x) = (e^x)²) ; A² − B² avec A = 2cos x |
| 🟦 Principes multiplicatif & additif | k-uplets n^k (code PIN) ; case fixe (10^(k−1)) ; principe additif (cas disjoints) |
| 🟦 Permutations & anagrammes | n! rangements ; anagrammes à lettres répétées (n!/(n₁!n₂!)) |
| 🟦 Arrangements : ordre sans remise | A_n^k = n(n−1)…(n−k+1) (podium ≠ comité) |
| 🟦 Combinaisons & triangle de Pascal | C(n,k) = n!/(k!(n−k)!) ; somme d'une ligne = 2^n ; relation de Pascal |
| 🟦 Inclusion-exclusion & complémentaire | card(A∪B) = card(A)+card(B)−card(A∩B) ; « au moins un » = total − « aucun » |
| 🟦 Tiroirs & étoiles-barres | principe des tiroirs (n+1 objets, n tiroirs) ; étoiles et barres C(k+p−1, p−1) |
| 🟪 Modus ponens & chaînage | fait + règle = nouveau fait ; chaînage avant (chaîne de déductions) ; négation forcée (verdict FAUX) |
| 🟪 VRAI, FAUX ou indéterminé | effet constaté ≠ cause prouvée (verdict INDÉTERMINÉ) ; équivalence P ⇔ Q (sens retour légitime) |
| 🟧 Fractions piégées | faux théorème de l'addition croisée ; simplification abusive (facteurs oui, termes non) ; signes cachés (−a)/(−b) = a/b ; division (inverser la seconde fraction seulement) |
| 🟩 Fractions rationnelles & radicaux | rationnalisation (1/√a = √a/a ; conjugué 1/(√m−√n)) ; équation fractionnaire & condition d'existence |
| 🟪 Techniques de pro : télescopique & couples | somme télescopique 1/(n(n+1)) = 1/n − 1/(n+1) ; astuce des couples (x + 1/x = s ⇒ x² + 1/x² = s² − 2) ; comparaison croisée (ad contre bc) |

Contenu couvert : la factorisation du facteur commun au changement
de variable (facteur caché « 1 », signe opposé, somme-produit,
racines évidentes, factorisation dans ℂ, bicarrée, substitution
exponentielle et trigonométrique), le dénombrement complet du
principe multiplicatif aux techniques expertes (k-uplets,
permutations, anagrammes, arrangements, combinaisons, triangle de
Pascal, inclusion-exclusion, complémentaire, principe des tiroirs,
étoiles et barres — avec les pièges des doubles comptages), la
logique formelle du primaire au lycée (modus ponens, chaînage avant,
négation forcée, verdicts VRAI/FAUX/INDÉTERMINÉ sur des scénarios
concrets, équivalences) et le calcul fractionnaire avancé (le « faux
théorème » de l'addition croisée, la simplification abusive, les
signes cachés, la division mal inversée, la rationnalisation des
radicaux, les équations fractionnaires avec conditions d'existence,
les sommes télescopiques, l'astuce des couples et la comparaison
croisée).

Documents non intégrés (volontairement) : les onglets « Primaire »,
« Collège » et « Quizz » des quatre documents, dont les situations
dynamiques (30 par onglet, corrections colorées pas à pas) couvrent
des mécanismes déjà présents dans la tour (fractions simples :
module 11e ; calcul mental et équations : modules existants), et les
visualisations interactives propres au format document (curseurs,
aires rectangulaires, disques partagés) qui n'ont pas d'équivalent
dans le jeu. Seuls les volets inédits — « Facteurs cachés »,
« Changement de variable », « Dénombrement » (tous volets), « Logique
déductive », « Fractions piégées » et « Techniques de pro » — sont
devenus des étages.

## Intégration des documents « Exponentielles, Fonction inverse, Statistiques & Valeurs propres »

Deuxième vague d'intégration du dépôt : les notions mathématiques
restées sans étage sont comblées à partir des documents «
Exponentielles » (T_STI2D), « Logarithme décimal », des sections
fonctions et limites des maths complémentaires (TG), « Fonction
inverse » (T_STI2D), « Crumble Hall — la loi binomiale » (T_STI2D)
accompagné des documents STS « Statistiques », « Statistiques
inférentielles » et « Erreurs », et « L'Affaire des Trois Colonnes »
(valeurs et vecteurs propres, CPGE). **13 nouvelles notions** insérées
sous le sommet (la tour passe de 196 à **209 étages**), **37
générateurs**, **4 fiches** (« 🔋 Exponentielles & logarithmes », « 🧪
Fluctuation, confiance & incertitudes », « 🔬 Valeurs & vecteurs
propres », « 📏 Limites, continuité & TVI »), 3 fiches enrichies («
Probabilités », « Statistiques », « Fonctions »), **2 catégories
nouvelles** dans la progression (« 🔋 Exponentielles & logarithmes »,
« 🔬 Algèbre linéaire (CPGE) ») et 3 sous-catégories enrichies ( «
Probabilités & statistiques » : loi binomiale & paramètres, dispersion/
estimation/incertitudes ; « Fonctions & lectures graphiques » :
fonction inverse et limites/continuité/TVI). Des fiches-ponts relient
les nouveaux contenus au reste du programme : binomiale ↔
probabilités, seuils exponentiels ↔ dénombrement, valeurs propres ↔
calcul littéral, limites ↔ suites, incertitudes ↔ unités. Tout reste
lié dans le graphe.

| Notion (étage) | Éléments simples (générateurs) |
|---|---|
| 🟩 Fonctions exponentielles de base a | a^u·a^v = a^(u+v) ; (a^u)^v = a^(uv) ; équation a^x = b ⇒ x = log_a b ; variations selon a ≶ 1 |
| 🟩 Logarithme décimal : définition & propriétés | log x = y ⇔ x = 10^y (log des petits nombres négatif) ; log(AB) = log A + log B, log(A/B) = log A − log B, log A^k = k log A |
| 🟪 Seuils exponentiels & repères logarithmiques | 2^n > 10^6 ⇔ n log 2 > 6 (premier entier qui convient) ; sur un axe en décades, le milieu de [10^k ; 10^(k+2)] est 10^(k+1) |
| 🩷 ln & exp : réciproques & croissances | ln(e^a) = a et e^(ln b) = b (aller-retour) ; hiérarchie ln x ≪ x^n ≪ e^x ; x·ln x → 0 en 0⁺ |
| 🟦 Fonction inverse : variations & asymptotes | image 1/a ≠ opposé ; décroissante sur ]−∞;0[ ET sur [0;+∞[ mais pas sur ℝ* ; 1/x = a ⇔ x = 1/a, coût moyen CM(q) = C/q ; hyperbole, asymptotes x = 0 et y = 0 |
| 🟦 Loi binomiale : schéma & P(X=k) | épreuve de Bernoulli répétée n fois, chemins comptés par C(n,k) ; P(X=k) = C(n,k)·p^k·(1−p)^(n−k) ; « au moins un » = 1 − (1−p)^n |
| 🟦 Binomiale : espérance, variance, écart-type | E = np ; V = np(1−p) (pas np !) ; σ = √(np(1−p)), valeurs typiques entre np−2σ et np+2σ |
| 🟧 Dispersion : variance & écart-type | V = Σ(xᵢ−x̄)²/n puis σ = √V ; même moyenne ≠ même dispersion (séries de pH, contrôle qualité) |
| 🟩 Fluctuation & confiance : estimer | IF [p − 1/√n ; p + 1/√n] quand p est annoncée (rejet au seuil 5 %) ; IC [f − 1/√n ; f + 1/√n] quand on estime p par la fréquence |
| 🟪 Incertitudes & calcul d'erreur | incertitude relative u/x × 100 % ; propagation : somme → absolues, produit → relatives ; justesse (moyenne) ≠ fidélité (dispersion), la répétition ne corrige pas un biais |
| 🟥 Valeurs propres & vecteurs propres | Av = λv (v ≠ 0) ; lignes de somme constante s ⇒ (1,1,1) propre pour s ; triangulaire ⇒ valeurs propres sur la diagonale ; trace = Σλ et det = Πλ ; vecteurs = solutions non nulles de (A−λI)v = 0 |
| 🟩 Limites de fonctions & asymptotes | termes dominants des fractions rationnelles ; croissances comparées ; formes indéterminées (∞−∞, ∞/∞, 0/0, 0×∞) à lever par factorisation ; lim = L ⇒ y = L, limite infinie en a ⇒ x = a |
| 🟩 Continuité & théorème des valeurs intermédiaires | TVI : continue + valeurs de signes opposés ⇒ f s'annule (existence, pas unicité) ; corollaire : stricte monotonie + k entre f(a) et f(b) ⇒ solution unique (dichotomie) |

Contenu couvert : la famille exponentielle et le logarithme décimal
des T_STI2D aux maths complémentaires (propriétés, équations, seuils,
repères logarithmiques, ln/exp réciproques et hiérarchie des
croissances comparées), la fonction inverse et ses pièges (décroissance
par intervalles, valeurs interdite et asymptotes, coût moyen), la loi
binomiale complète et son triptyque espérance/variance/écart-type, la
statistique au-delà de la moyenne (dispersion, intervalles de
fluctuation et de confiance, incertitudes de mesure, propagation,
justesse et fidélité), l'algèbre linéaire CPGE (valeurs et vecteurs
propres, invariants trace/déterminant, sous-espaces propres) et
l'analyse de Terminale (limites de fonctions, formes indéterminées,
asymptotes, continuité et TVI avec son corollaire d'unicité).

Correctif d'échappement LaTeX : les modules 11m-11p livrés
précédemment contenaient des séquences à quatre backslashes (rendu
parasite « \dfrac », « \log »…) et des résidus « <br>e » là où « \neq »
était attendu. L'ensemble a été normalisé (2 backslashes dans le
source pour 1 à l'exécution, `<br>` pour les sauts de ligne des
prompts, `\neq`/`\ne` restaurés), un audit statique
(`.test/audit-escapes.py`) veille sur la convention et le banc
d'essai vérifie désormais AUSSI au runtime (section 17quater) qu'aucun
texte généré ne contient de double backslash parasite ni de « <br>e ».

Documents non intégrés (volontairement) : les enseignements
scientifiques (cristaux, physique du son), la cinématique des
véhicules, les documents « politique » et « passation », les
évaluations et lecteurs externes, les portails d'index et le jeu
séparé « Opération Zéro Absolu » — soit hors périmètre mathématique
du jeu, soit déjà couverts par des mécanismes existants. Après cette
vague, tout le contenu mathématique du dépôt a désormais son étage
dans la tour.

## Niveaux de classe, vues « Par niveau » & tableau croisé

Le nouveau module `11v-niveaux.js` rattache chacune des **209 notions**
à un **niveau de classe** conforme aux programmes officiels —
7 niveaux : 🌱 Cycle 3 (CM1 · CM2 · 6e, 15 notions), 🌿 Cycle 4
(5e · 4e · 3e, 32), 🎓 Seconde (44), 🎓 Première générale &
technologique (75), 🎓 Terminale générale & technologique (27),
🌟 Terminale maths expertes & complémentaires (14) et 🏛 Post-bac/CPGE
(2). Le banc d'essai vérifie que la correspondance couvre exactement
les 209 notions (aucune oubliée, aucune inconnue) et que les effectifs
par niveau sont 15 + 32 + 44 + 75 + 27 + 14 + 2 = 209.

Trois usages :

- **Progression, vue « 🎓 Par niveau (tableau croisé) »** : deux boutons
  (« 📋 Par catégorie » / « 🎓 Par niveau ») en tête de la modale. La vue
  par niveau affiche d'abord le **tableau croisé interactif** (lignes =
  niveaux, colonnes = 22 catégories, cellules = effectifs, totaux
  contrôlés) : le survol d'un numéro ouvre une **bulle d'information**
  (data-tip) listant les notions exactes de l'intersection et leur
  statut, et **chaque numéro se coche d'un clic** pour composer un menu
  ciblé — la barre « 🎯 Réviser la sélection (n notions) » / « ↺ Vider »
  lance la révision personnalisée pré-remplie avec ces notions
  uniquement. Suivent une section dépliable par niveau (compteur
  « X/Y validées », cartes de notions inchangées) avec un bouton
  **« 🎯 Réviser ce niveau »** ;
- **Révision personnalisée** : puces de filtrage par niveau (avec
  effectifs) combinées à la recherche, badge de niveau par ligne, et
  `tdmOpenRevision(code)` pré-coche tout un niveau — `tdmOpenRevision(ids)`
  accepte aussi une liste d'ids (cellules cochées du tableau croisé) ;
- **Dossier de présentation** : nouvelle section « 📊 Tableau croisé :
  niveaux de classe × notions à traiter » (22 lignes × 7 colonnes,
  calculée depuis les données du jeu, totaux 209) et tous les
  compteurs actualisés (209 notions, 402 générateurs, 22 catégories,
  7 niveaux, 44 modules, banc d'essai 24 sections, novembre 2026).

Le rattachement suit les programmes : calcul et fractions au cycle 3-4,
factorisations, systèmes, fonctions de référence et Python en 2de,
second degré, dérivation, suites et littéral STI2D en 1re, complexes,
probabilités conditionnelles, lois binomiales et estimation en
Terminale, arithmétique, graphes et ln/exp en maths expertes,
dénombrement expert et valeurs propres au-delà. Aucune notion n'a
changé d'étage, de catégorie, de fiche ou de générateur : le module
n'est que **données de classement**, vérifiées par la section 20 du
banc d'essai.

## Dossier de présentation « rapport-publication.html »

Document autonome lié à la tour (bouton « 📄 Dossier de présentation »
du menu utilitaire, ouvert dans un onglet séparé) : dossier type
publication en revue pédagogique ou journalistique présentant l'ensemble
du projet — résumé, problématique et objectifs, dispositif (tour,
probabilités adaptatives, leçons d'erreur, éléments simples, fiches),
contenus (22 catégories, 209 notions, 402 générateurs, 7 niveaux de
classe, du cycle 3 au post-bac), **tableau croisé niveaux × notions**
(22 catégories en lignes, 7 niveaux en colonnes, effectifs calculés
depuis les données du jeu), principes didactiques, architecture
technique (44 modules, banc d'essai 24 sections, chiffrement
RSA-2048 + AES-256 de l'export), publics et usages, limites et
perspectives, fiche projet. Même style visuel que les documents
d'exercices, même notice de licence (Yann Merdy, usage non commercial).

## Progression des notions par catégories

La modale « 📚 Progression des notions » offre **deux vues au choix**
(boutons « 📋 Par catégorie » / « 🎓 Par niveau (tableau croisé) »). La
vue par catégorie ne liste plus les 209 notions dans l'ordre de
construction de la tour : le module `11f-progression.js` les regroupe
en **22 catégories thématiques**,
chacune **repliable d'un clic** (le titre affiche son compteur
« X/Y validées »). Les éléments simples de chaque notion restent
inchangés (libellé, rappel au survol, statistiques ✓/✗, fiches) ;
seule la présentation est réorganisée.

| Catégorie | Sous-catégories (exemples) |
|---|---|
| 🧮 Calcul mental & opérations | opérations & comparaison ; durées, suites & problèmes |
| 🔢 Nombres, fractions & puissances | décimaux/relatifs/ensembles ; fractions : valeur, signes, opérations ; puissances & racines |
| ✖️ Calcul littéral & factorisation | développer & réduire ; factoriser |
| 📘 Équations & inéquations | **premier degré** ; **second degré & polynômes** ; **sommet, taux de variation & conditions** ; **produit d'une combinaison de 1ᵉʳ ou 2ᵈ degré** ; **lecture graphique** |
| 📈 Fonctions & lectures graphiques | notations, images & antécédents ; affines & références ; variations & signes |
| 📏 Droites & géométrie analytique | équations de droites ; axes, positions & cartésiennes ; situations pro ; triangle & droites remarquables |
| 📐 Géométrie | triangles & théorèmes ; transformations ; vecteurs & scalaire ; repérage, aires & volumes |
| 🌐 Trigonométrie | valeurs & angles ; **degrés, radians & mesure principale** ; **symétries, rotations & coordonnées** ; équations trigonométriques ; courbes sinus/cosinus |
| 📉 Dérivation, primitives & Euler | nombre dérivé & tangentes ; fonctions dérivées ; primitives & Euler |
| 🔁 Suites | arithmétiques & sommes ; géométriques ; lectures graphiques |
| 💰 Pourcentages, proportions & évolutions | proportions & pourcentages ; évolutions & coefficients |
| 🎲 Probabilités & statistiques | statistiques ; probabilités ; lois & variables |
| ⚛️ Mesures & équations littérales | conversions & mesures ; identifier une formule ; isoler une grandeur |
| 🔷 Nombres complexes | forme algébrique ; **conjugué, module & inverse** ; **équations dans ℂ** ; forme trigonométrique |
| 🔐 Arithmétique & congruences | **division, divisibilité & PGCD** ; **congruences modulo n** (restes, opérations, puissances & cycles) |
| 🕸 Théorie des graphes | **vocabulaire, degrés & arêtes** (poignées de main) ; **chaînes eulériennes** |
| 🖥️ Algorithmique & Python | algorithmique ; Python |
| 🎯 Missions de synthèse | enquêtes & missions |

L'exemple demandé : la catégorie « Équations & inéquations » réunit en
un seul endroit des notions jusque-là éparpillées dans la tour —
équations et inéquations du 1ᵉʳ degré et systèmes (collège/littéral),
équations du 2ᵈ degré, discriminant, forme canonique et signe d'un
trinôme, polynômes de degré 3 (lycée), équations produit-nul et
« factoriser pour résoudre » (produit d'une combinaison de facteurs de
1ᵉʳ ou 2ᵈ degré), et résolutions graphiques d'équations et
d'inéquations. Chaque notion apparaît dans **une seule**
sous-catégorie ; une éventuelle notion non référencée tomberait dans
un groupe de secours « Autres » en fin de modale (aucune à ce jour :
les 209 notions sont classées, vérifié par le banc d'essai).

## Deux animations au choix : tour 3D & balle rebondissante

Le menu propose un bouton de bascule 🏀 : l'élève (ou l'enseignant)
choisit l'animation de progression, mémorisée d'une session à l'autre
(`localStorage`, clé `tdm-anim`) :

- **Tour 3D** (par défaut) : la construction progressive de la tour,
  une forme 3D par notion.
- **Balle rebondissante** : deux murs face à face, une balle 3D colorée
  **bien plus grosse**, qui bondit de mur en mur de palier en palier
  (un palier = un étage). Chaque bonne réponse la fait bondir vers le
  haut : **elle est heureuse et fêtée** — yeux rieurs, grand sourire
  ouvert, étincelles de joie pendant tout le vol, **traînée visible** et
  **gerbe de feu d'artifice à l'arrivée, plus forte quand le palier
  atteint est haut**. Chaque erreur la fait **chuter du nombre de
  paliers de la pénalité** : le visage devient **très triste** (sourcils
  baissés, grande bouche), des **larmes coulent vers le bas** dès la
  chute libre ; elle **s'écrase à l'arrivée d'autant plus que le nombre
  de paliers perdus est grand**, un **plancher coulissant incliné vers
  le bon mur** la guide vers son nouveau palier, et **dès qu'elle l'a
  rejoint, les pans de murs au-dessus d'elle se détachent et
  s'écrasent au sol** (dalles des paliers perdus + briques des murs,
  avec poussière à l'impact) ; elle **pleure ensuite — plus longtemps
  et plus fort que la chute était importante**. Les anneaux d'impact,
  l'ombre et la caméra qui la suit complètent la scène ; un drapeau
  marque le sommet, les paliers prennent la couleur de la famille de
  la notion (paliers déjà validés en or).

La balle est une alternative **au rendu, pas au modèle de jeu** : mêmes
étages, mêmes pénalités, mêmes leçons. Au retour à la tour 3D, la
caméra reprend l'étage courant sans saut.

L'écran d'accueil (et les modales d'identité et de bilan) est désormais
**responsive** : hauteur plafonnée à celle de l'écran
(`max-height: calc(100dvh - 36px)` + repli `100vh`), défilement interne,
version compacte sous 640 px de haut — le bouton COMMENCER L'ASCENSION
reste toujours visible, et les compteurs de notions (« 209 notions »)
sont remplis dynamiquement.

## Banc d'essai

`.tests/test-tdm.mjs` (machine virtuelle Node, DOM stubbé, PRNG
déterministe) — 24 sections : identité et démarrage, erreur QCM → solution
pédagogique, erreur à trous → raisonnement complet, fiches de rappel,
sommaire décomposé en catégories thématiques (22 catégories,
209 notions, plier/déplier, aucun titre ne mentionne « automatisme »),
notions passées, couverture des 402 générateurs, segments LaTeX
propres (aucun trou ni `<`/`>` nu dans `\( ... \)` : tout doit être
interprétable par MathJax 3), export enseignant
(avec date de dernière mise à jour), horodatage du menu, nouvelles
notions évolutions/proportions (18 générateurs × 25 tirages), révision
personnalisée (sélection, tirage restreint, fin de révision), nouvelles
notions droites dans le plan (20 générateurs × 25 tirages, leçon
d'erreur → fiche « Droites dans le plan »), nouvelles notions fractions
& puissances (24 générateurs × 25 tirages, leçon d'erreur → fiche
« Fractions & puissances »), nouvelles notions dérivation sur un
intervalle (7 générateurs × 25 tirages, leçon d'erreur → fiche « Étude
sur un intervalle »), nouvelles notions trigonométrie (14 générateurs ×
25 tirages, leçon d'erreur → fiche « Degrés, radians & mesure
principale », vérification des 2 nouvelles sous-catégories), nouvelles
notions second degré (19 générateurs × 25 tirages, leçon d'erreur →
fiche « Déterminer un trinôme par ses conditions », vérification de la
nouvelle sous-catégorie « Sommet, taux de variation & conditions »),
nouvelles notions maths expertes, factorisation/dénombrement/logique
& fractions pro puis exponentielles/fonction inverse/binomiale/valeurs
propres/limites (25 tirages par générateur, options distinctes,
propreté LaTeX vérifiée au runtime, leçon d'erreur → fiche liée),
graphe des notions (sous-graphes, drag & drop, survol des liaisons,
anti-chevauchement), 2ᵉ animation « balle rebondissante » (bascule du
menu, balle plus grosse, montée heureuse et fêtée — bond, traînée,
étincelles de joie, gerbe, chute ∝ pénalité avec écrasement d'arrivée
croissant, plancher coulissant, larmes qui coulent vers le bas, pans de
murs qui s'écrasent au sol, retour tour 3D), modale d'accueil
responsive (hauteur plafonnée, compteurs dynamiques) et **niveaux de
classe & tableau croisé** (7 niveaux, 209 notions couvertes une à une,
effectifs 15/32/44/75/27/14/2, cellules du tableau croisé = effectifs
des catégories, bascule des vues de la progression, « Réviser ce
niveau » pré-coche les notions du niveau, puces de filtrage de la
révision, chiffres du dossier de présentation, **bulle d'information et
cases cochables du tableau croisé** — chaque numéro actif porte son
data-tip, se coche/décoche au clic, « 🎯 Réviser la sélection » ouvre
la révision pré-remplie, « ↺ Vider » efface).
`node .tests/test-tdm.mjs` → **TOUT PASSE**.

## Choix techniques

- **Scripts classiques** (pas de modules ES) : la page reste utilisable en
  ouverture directe `file://` hors ligne, sans serveur ni outil de build.
  Les liaisons se font par l'ordre de chargement.
- Les enrichissements (`11c`, `19b`) respectent le même contrat : pas
  d'intrusion dans les modules existants, tout passe par `Object.assign`,
  `NOTIONS.push` avant le calcul de `N_TOT` et des listeners différés.
- Syntaxe vérifiée par `node --check` sur les 44 modules ; comportement
  vérifié par le banc d'essai VM.

## Utilisation

Double-clic sur `index.html` (ou ouverture dans un navigateur). Garder
`index.html`, `css/` et `js/` dans le même dossier. La sauvegarde `.json`
scellée, l'identité et la progression fonctionnent comme dans l'original.

© Yann Merdy — octobre 2026. Usage privé et éducatif autorisé ;
toute reproduction doit conserver la mention de l'auteur.
