# Crumble Hall — La loi binomiale, enquête en dix-sept pièces

Parcours pédagogique interactif (exploration → apprentissage → consolidation) sur la loi
binomiale. Aucune dépendance externe : la page fonctionne hors ligne, sans serveur.

## Démarrage

- **Version multi-fichiers** : ouvrir `index.html` dans un navigateur (double-clic suffit,
  aucun serveur requis).
- **Version monofichier** : `LOI_BINOMIALE-monofichier.html` est l'équivalent exact en un
  seul fichier autonome (même contenu, CSS et JS intégrés) — pratique pour l'envoyer par
  courriel ou le déposer sur une plateforme. Les deux versions partagent la même clé de
  sauvegarde.

## Structure du projet

```
LOI_BINOMIALE/
├── index.html                  Point d'entrée : structure HTML, modales, pied de page
├── css/
│   └── style.css               Feuille de style unique (thème, impression, responsive)
└── js/
    ├── core/                   Socle technique
    │   ├── outils.js           Utilitaires (aléatoire, formatage FR, mini-moteur TeX)
    │   └── svg.js              Générateurs SVG (bâtons, courbes, arbres de probabilité)
    ├── data/                   Contenus aléatoires
    │   ├── scenarios.js        Manoirs, personnages, situations (tirés au hasard)
    │   ├── propositions.js     Banques de propositions Vrai/Faux par étape
    │   └── glossaire.js        Glossaire interactif (fiches au survol)
    ├── app/                    Logique applicative
    │   ├── evaluation.js       Difficulté, temps de réponse (IC 95 %), incohérences, pattern
    │   ├── cours.js            Volets du cours (phase 2 : apprentissage)
    │   ├── bilan.js            Bilan enrichi en trois volets (score ajusté)
    │   ├── persistence.js      Sauvegarde/restauration automatique (localStorage)
    │   └── init.js             Démarrage : tirage du scénario, construction des étapes
    └── ui/                     Interface
        ├── etat.js             État global de la session
        ├── menu.js             Menu latéral des étapes
        ├── rendu-etape.js      Rendu d'une étape (propositions, boutons, révélations)
        ├── navigation.js       Navigation entre étapes
        ├── feedback.js         Tableau de correction détaillé
        ├── validation.js       Validation d'une étape et calcul du score
        └── modales.js          Modales : explication, droits d'auteur, pédagogique
```

Les scripts sont chargés par `index.html` **dans l'ordre ci-dessus** (core → data → app → ui,
puis `init.js`). Ils partagent la portée globale : si vous ajoutez un fichier, insérez la
balise `<script>` correspondante **avant** `js/app/init.js`.

## Notes de version

- **Sauvegarde v2** : la progression est désormais stockée sous une nouvelle clé
  (`crumble_hall_state_v2`). Les anciennes sauvegardes (document d'origine) contiennent des
  graphiques rendus avant l'ajout des graduations : elles ne sont plus restaurées — une
  nouvelle enquête démarre, avec un message « Document mis à jour ». L'ancienne sauvegarde
  du document d'origine reste intacte et n'est pas écrasée.
- **Grille fine et discrète sur tous les graphiques à axes** : les histogrammes
  (subdivisions tous les 0,05, lignes étiquetées tous les 0,1) et les graphiques en
  courbes (grille très claire tous les 20 px) possèdent désormais une grille de lecture.

- **Les cinq conditions du schéma de Bernoulli explicitées** : le dernier chapitre
  (étape 17, « Épilogue, méthode et rédaction type ») ouvre désormais sur un encadré
  « Voici les cinq conditions du schéma de Bernoulli — la méthode du majordome » qui
  les énumère une par une (répétition, deux issues utiles, $p$ constant, indépendance,
  comptage des succès). Les questions qui y font allusion (« les cinq commandements »,
  « les $5$ conditions », « la méthode compte 3 conditions »…) sont ainsi claires sans
  attendre la synthèse post-validation ni le volet de cours. L'entrée du glossaire
  « Schéma de Bernoulli » et la section VIII du Volet 1 (cours) les énumèrent aussi.

- **Diagrammes en bâtons gradués** : l'axe des ordonnées est fixe (échelle de
  probabilités de 0 à 1) et finement gradué — une ligne étiquetée tous les 0,1 (0 ; 0,1 ;
  0,2 … 1) et une subdivision secondaire tous les 0,05 (grille très claire + tick sur
  l'axe). **Chaque bâton porte en outre sa valeur numérique exacte au-dessus de lui** —
  à l'horizontale quand la place le permet (jusqu'à ~8 bâtons), pivotée à 90° pour les
  histogrammes à bâtons étroits (10-11 bâtons, ex. étape 6) — avec une précision
  adaptée au troisième décimal si nécessaire (ex. « 0,001 »). Les pièges du type « la
  somme des probabilités fait-elle 1 ? » sont donc vérifiables directement sur le
  graphique (ex. graphique D : 0,6 + 0,6 = 1,2 ≠ 1).
- **Alignement du signe « = » corrigé** : les fractions (`\\frac`, `\\dfrac`) et les
  coefficients binomiaux (`\\binom`) sont désormais centrés sur l'axe mathématique de la
  ligne (`vertical-align: middle`), quel que soit leur contenu. Dans une formule du type
  $\\dfrac{\\binom{n}{k+1}}{\\binom{n}{k}} = \\dfrac{k+1}{n-k}$, le signe « = » est
  ainsi aligné au centre vertical des deux fractions, au lieu d'être décalé vers le bas.
- **Histogrammes à largeur adaptative** : les diagrammes à nombreux bâtons (10-11)
  s'élargissent (~36 px par bâton) pour que chaque valeur reste étiquetée à
  l'horizontale ; la somme des bâtons se vérifie d'un coup d'œil sur l'axe gradué.
- **Réorganisation en sous-dossiers** : le fichier unique d'origine est découpé en
  `index.html` + `css/` + `js/` (core, data, app, ui), sans aucune modification de
  comportement. La sauvegarde de progression dans le navigateur est inchangée.

## Droits d'auteur

Voir la modale « Droits d'Auteur et Licence d'Utilisation » dans la page (bouton dans le
pied de page).
