# La Tour des Maths — Édition claire (version modulaire)

Optimisation du document monolithique `la-tour-des-maths-eleve.html` (≈ 459 Ko,
6 249 lignes) en une **série de sous-documents interconnectés** : 1 point
d'entrée, 1 dossier de présentation, 5 feuilles de style et 30 modules
JavaScript.

**Le comportement du jeu est identique** à l'original pour tout ce qui
existait — vérifié par exécution côte à côte (machines virtuelles Node, PRNG
déterministe). Cette version ajoute : la **décomposition en éléments
simples**, l'**horodatage de la dernière mise à jour**, la **révision
personnalisée** et l'**intégration des documents « Évolutions » et
« Proportions »** (voir plus bas).

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
│   └── 05-revision-maj.css          ← menu utilitaire (date MAJ), modale de
│                                      révision personnalisée, badge, rev-list
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
    │                                  progression (16 catégories, ex. équations
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
    └── 19b-revision-personnalisee.js← modale 🎯 révision personnalisée
                                       (sélection de notions pour la session)
```

## Interconnexions

- `index.html` charge les 5 feuilles CSS **dans l'ordre 01 → 05** puis les
  23 scripts **dans l'ordre 01 → 19b** (l'ordre de chargement est l'ordre
  d'exécution).
- L'objet `GEN` (générateurs de questions, **295 clés**) est déclaré dans
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
  - `GEN_INFO` : pour chacun des 295 générateurs, un **libellé** clair, un
    **rappel** court (infobulle au survol) et ses **fiches** associées.
  - Helpers : `tdmGenLabel`, `tdmGenRappel`, `tdmGenFiches`,
    `tdmElemsDeNotion`, `tdmFichesDeNotion`.
- **`js/16b-solution-pedagogique.js`** : modale `#tdmFicheModal`,
  infobulle globale `#tdmTip` (`[data-tip]`, y compris LaTeX),
  `tdmElemsHTML` (lignes d'éléments, badge ✓n/✗n, ouverture de fiche),
  `tdmRepAttendue`, `tdmDecompoHTML` (élément raté mis en évidence),
  `tdmRappelsHTML`.
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
  les **168 notions**, un filtre de recherche, « Tout cocher /
  Tout décocher » et le décompte en direct ;
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

## Dossier de présentation « rapport-publication.html »

Document autonome lié à la tour (bouton « 📄 Dossier de présentation »
du menu utilitaire, ouvert dans un onglet séparé) : dossier type
publication en revue pédagogique ou journalistique présentant l'ensemble
du projet — résumé, problématique et objectifs, dispositif (tour,
probabilités adaptatives, leçons d'erreur, éléments simples, fiches),
contenus (16 catégories, 168 notions, 295 générateurs, du cycle 3 au
lycée général et technologique), principes didactiques, architecture
technique (30 modules, banc d'essai 18 sections, chiffrement
RSA-2048 + AES-256 de l'export), publics et usages, limites et
perspectives, fiche projet. Même style visuel que les documents
d'exercices, même notice de licence (Yann Merdy, usage non commercial).

## Progression des notions par catégories

La modale « 📚 Progression des notions » ne liste plus les 168 notions
dans l'ordre de construction de la tour : le nouveau module
`11f-progression.js` les regroupe en **16 catégories thématiques**,
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
| 🔷 Nombres complexes | forme algébrique ; forme trigonométrique |
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
les 168 notions sont classées, vérifié par le banc d'essai).

## Banc d'essai

`.tests/test-tdm.mjs` (machine virtuelle Node, DOM stubbé, PRNG
déterministe) — 18 sections : identité et démarrage, erreur QCM → solution
pédagogique, erreur à trous → raisonnement complet, fiches de rappel,
sommaire décomposé en catégories thématiques (16 catégories,
168 notions, plier/déplier, aucun titre ne mentionne « automatisme »),
notions passées, couverture des 295 générateurs, segments LaTeX
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
nouvelle sous-catégorie « Sommet, taux de variation & conditions »).
`node .tests/test-tdm.mjs` → **TOUT PASSE**.

## Choix techniques

- **Scripts classiques** (pas de modules ES) : la page reste utilisable en
  ouverture directe `file://` hors ligne, sans serveur ni outil de build.
  Les liaisons se font par l'ordre de chargement.
- Les enrichissements (`11c`, `19b`) respectent le même contrat : pas
  d'intrusion dans les modules existants, tout passe par `Object.assign`,
  `NOTIONS.push` avant le calcul de `N_TOT` et des listeners différés.
- Syntaxe vérifiée par `node --check` sur les 30 modules ; comportement
  vérifié par le banc d'essai VM.

## Utilisation

Double-clic sur `index.html` (ou ouverture dans un navigateur). Garder
`index.html`, `css/` et `js/` dans le même dossier. La sauvegarde `.json`
scellée, l'identité et la progression fonctionnent comme dans l'original.

© Yann Merdy — octobre 2026. Usage privé et éducatif autorisé ;
toute reproduction doit conserver la mention de l'auteur.
