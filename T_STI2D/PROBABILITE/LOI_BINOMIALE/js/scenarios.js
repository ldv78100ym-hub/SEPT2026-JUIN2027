/* ============================================================
   3. SCÉNARIOS
   ============================================================ */
const SCENARIOS = [
  { lieu: 'Crumble Hall', seigneur: 'Sir Reginald Crumblebottom', seigneurGenre: 'M', majordome: 'Baxter',
    objet: 'biscuit', objetPl: 'biscuits', succes: 'beurre dessus', echec: 'beurre dessous',
    action: 'lancer de biscuit', troisieme: 'beurre dans le thé',
    story: `<p>Il était une fois, dans le Sussex, un manoir nommé <strong>Crumble Hall</strong>, où il pleuvait. Beaucoup. Tout le temps. Sur les biscuits aussi.</p>
      <div class="dialogue">
        <p><span class="who">Sir Reginald.</span> — Baxter. Le biscuit est tombé beurre vers le haut. Encore.</p>
        <p><span class="who">Baxter.</span> — En effet, Monsieur.</p>
        <p><span class="who">Sir Reginald.</span> — Il faudrait définir la chose.</p>
        <p><span class="who">Baxter.</span> — Je crains, Monsieur, que ce ne soit à vos élèves de la définir.</p>
        <p><span class="who">Sir Reginald.</span> — Et pendant ce temps, le thé refroidit. Comme la science.</p>
      </div>` },
  { lieu: 'Château Moule-Frite', seigneur: 'la Baronne Pétronille de la Friteuse', seigneurGenre: 'F', majordome: 'Gédéon',
    objet: 'frite', objetPl: 'frites', succes: 'pointe en haut', echec: 'pointe en bas',
    action: 'lâcher de frite', troisieme: 'frite dans la mayonnaise',
    story: `<p>Au <strong>Château Moule-Frite</strong>, la Baronne Pétronille de la Friteuse avait une passion : la chute contrôlée de frites. Elle la pratiquait au petit-déjeuner, entre la confiture de groseille et le Times.</p>
      <div class="dialogue">
        <p><span class="who">Baronne Pétronille.</span> — Gédéon ! La frite est tombée pointe en bas. Encore. Trois fois de suite, c'est une insulte à la patate.</p>
        <p><span class="who">Gédéon.</span> — En effet, Madame.</p>
        <p><span class="who">Baronne Pétronille.</span> — Définissez-moi cette chose.</p>
        <p><span class="who">Gédéon.</span> — Madame, je crains que ce ne soit à la jeunesse de le faire.</p>
      </div>` },
  { lieu: 'Manoir Clapotis', seigneur: 'l\'Amiral Balthazar Brisefer', seigneurGenre: 'M', majordome: 'Barnabé',
    objet: 'mouette', objetPl: 'mouettes', succes: 'passe à tribord', echec: 'passe à bâbord',
    action: 'envol de mouette', troisieme: 'mouette sur le chapeau',
    story: `<p>Au <strong>Manoir Clapotis</strong>, l'Amiral Balthazar Brisefer notait avec obsession le passage des mouettes. Il les comptait à tribord, à bâbord, et même une fois en diagonale, ce qui l'avait beaucoup troublé.</p>
      <div class="dialogue">
        <p><span class="who">Amiral Brisefer.</span> — Barnabé ! La mouette a filé à tribord. Encore.</p>
        <p><span class="who">Barnabé.</span> — En effet, Amiral.</p>
        <p><span class="who">Amiral Brisefer.</span> — Il faut définir ce phénomène.</p>
        <p><span class="who">Barnabé.</span> — Amiral, c'est une tâche pour vos élèves. Moi, je ne sais que saler les noix.</p>
      </div>` },
  { lieu: 'Château Pamplemousse', seigneur: 'la Duchesse Cunégonde', seigneurGenre: 'F', majordome: 'Firmin',
    objet: 'pamplemousse', objetPl: 'pamplemousses', succes: 'juteux', echec: 'pourri',
    action: 'cueillette de pamplemousse', troisieme: 'pamplemousse dans la fontaine',
    story: `<p>Au <strong>Château Pamplemousse</strong>, la Duchesse Cunégonde surveillait son verger d'un œil féroce. Elle jugeait chaque pamplemousse à la fois coupable et juteux, selon l'humeur du jour.</p>
      <div class="dialogue">
        <p><span class="who">Duchesse Cunégonde.</span> — Firmin ! Ce pamplemousse est juteux. Encore.</p>
        <p><span class="who">Firmin.</span> — En effet, Madame.</p>
        <p><span class="who">Duchesse Cunégonde.</span> — Firmin, il faut définir la chose.</p>
        <p><span class="who">Firmin.</span> — Madame, je ne suis que jardinier. C'est aux élèves de le faire. Et accessoirement, le pamplemousse est tombé dans la fontaine.</p>
      </div>` },
  { lieu: 'Tour de Guingois', seigneur: 'le Magicien Alambic', seigneurGenre: 'M', majordome: 'Potiron',
    objet: 'chapeau', objetPl: 'chapeaux', succes: 'lapin', echec: 'fleur',
    action: 'sortie de chapeau', troisieme: 'chapeau dans la cheminée',
    story: `<p>Dans la <strong>Tour de Guingois</strong>, le Magicien Alambic tentait de faire sortir un lapin d'un chapeau plutôt qu'une fleur. Il y parvenait une fois sur deux, mais seulement après 18 h et en présence d'un chat noir.</p>
      <div class="dialogue">
        <p><span class="who">Alambic.</span> — Potiron ! Le chapeau a produit un lapin. Encore. Une fleur aurait été inconvenante.</p>
        <p><span class="who">Potiron.</span> — En effet, Maître.</p>
        <p><span class="who">Alambic.</span> — Il faut définir cette chose.</p>
        <p><span class="who">Potiron.</span> — Maître, je crains que ce ne soit à vos élèves.</p>
      </div>` },
  { lieu: 'Manoir Théière', seigneur: 'Lady Agathe de la Tasse', seigneurGenre: 'F', majordome: 'Octave',
    objet: 'sachet de thé', objetPl: 'sachets', succes: 'infuse fort', echec: 'infuse faible',
    action: 'infusion de sachet', troisieme: 'sachet dans la théière',
    story: `<p>Au <strong>Manoir Théière</strong>, Lady Agathe de la Tasse exigeait que chaque sachet infuse exactement comme il faut. On ne badine pas avec l'infusion, surtout à 16 h 03 précises.</p>
      <div class="dialogue">
        <p><span class="who">Lady Agathe.</span> — Octave ! Ce sachet infuse fort. Encore.</p>
        <p><span class="who">Octave.</span> — En effet, Milady.</p>
        <p><span class="who">Lady Agathe.</span> — Il faudrait définir ce phénomène.</p>
        <p><span class="who">Octave.</span> — Milady, c'est aux élèves de le faire. Et, à tout hasard, le sachet est retombé dans la théière.</p>
      </div>` },
  { lieu: 'Château Bric-à-Brac', seigneur: 'le Comte Archibald de la Vis', seigneurGenre: 'M', majordome: 'Rouillé',
    objet: 'boulon', objetPl: 'boulons', succes: 'se visse à droite', echec: 'se visse à gauche',
    action: 'vissage de boulon', troisieme: 'boulon dans la soupe',
    story: `<p>Au <strong>Château Bric-à-Brac</strong>, le Comte Archibald de la Vis collectionnait les boulons qui se vissent du bon côté. Sa devise : « À droite, toute ! », ce qui posait parfois problème aux dîners mondains.</p>
      <div class="dialogue">
        <p><span class="who">Comte Archibald.</span> — Rouillé ! Ce boulon s'est vissé à droite. Encore.</p>
        <p><span class="who">Rouillé.</span> — En effet, Monsieur le Comte.</p>
        <p><span class="who">Comte Archibald.</span> — Il faudrait définir cette mécanique.</p>
        <p><span class="who">Rouillé.</span> — Monsieur, c'est l'affaire de vos élèves. Un boulon vient de tomber dans la soupe, au passage.</p>
      </div>` },
  { lieu: 'Manoir Moustache', seigneur: 'le Baron Firmin Barbuchet', seigneurGenre: 'M', majordome: 'Alphonse',
    objet: 'moustache', objetPl: 'moustaches', succes: 'se boucle à gauche', echec: 'se boucle à droite',
    action: 'bouclage de moustache', troisieme: 'moustache dans le potage',
    story: `<p>Au <strong>Manoir Moustache</strong>, le Baron Firmin Barbuchet exigeait que ses moustaches se bouclent du bon côté. Le mauvais côté était, paraît-il, « la porte ouverte à tous les désordres du continent ».</p>
      <div class="dialogue">
        <p><span class="who">Baron Firmin.</span> — Alphonse ! Cette moustache se boucle à gauche. Encore.</p>
        <p><span class="who">Alphonse.</span> — En effet, Monsieur.</p>
        <p><span class="who">Baron Firmin.</span> — Il faut définir cela.</p>
        <p><span class="who">Alphonse.</span> — Monsieur, c'est aux élèves de le définir. La moustache, elle, est déjà dans le potage.</p>
      </div>` },
  { lieu: 'Château Rocambole', seigneur: 'le Chevalier Gontran', seigneurGenre: 'M', majordome: 'Perceval',
    objet: 'flèche', objetPl: 'flèches', succes: 'atteint la cible', echec: 'rate la cible',
    action: 'tir de flèche', troisieme: 'flèche dans le chapeau du roi',
    story: `<p>Au <strong>Château Rocambole</strong>, le Chevalier Gontran tirait des flèches dans le hall. On avait déjà perdu trois tableaux, un évêque et un chapeau melon particulièrement regretté.</p>
      <div class="dialogue">
        <p><span class="who">Chevalier Gontran.</span> — Perceval ! Cette flèche a atteint la cible. Encore.</p>
        <p><span class="who">Perceval.</span> — En effet, Messire.</p>
        <p><span class="who">Chevalier Gontran.</span> — Définis-moi cela.</p>
        <p><span class="who">Perceval.</span> — Messire, c'est aux élèves de le faire. Le roi, lui, ne veut plus prêter son chapeau.</p>
      </div>` },
  { lieu: 'Manoir Chaussette', seigneur: 'Tante Berthe', seigneurGenre: 'F', majordome: 'Firmin',
    objet: 'chaussette', objetPl: 'chaussettes', succes: 'est rayée', echec: 'est à pois',
    action: 'tri de chaussette', troisieme: 'chaussette dans la confiture',
    story: `<p>Au <strong>Manoir Chaussette</strong>, Tante Berthe triait ses chaussettes selon un protocole qu'elle seule comprenait. Il impliquait, semblait-il, la position de la lune et un reste de confiture d'abricot.</p>
      <div class="dialogue">
        <p><span class="who">Tante Berthe.</span> — Firmin ! Cette chaussette est rayée. Encore.</p>
        <p><span class="who">Firmin.</span> — En effet, Tante Berthe.</p>
        <p><span class="who">Tante Berthe.</span> — Il faut définir cette affaire.</p>
        <p><span class="who">Firmin.</span> — Tante Berthe, c'est aux élèves de le faire. La chaussette, elle, a encore trouvé la confiture.</p>
      </div>` },
  { lieu: 'Château Cornichon', seigneur: 'le Roi Cornichon IV', seigneurGenre: 'M', majordome: 'Gribouille',
    objet: 'cornichon', objetPl: 'cornichons', succes: 'flotte', echec: 'coule',
    action: 'immersion de cornichon', troisieme: 'cornichon dans la couronne',
    story: `<p>Au <strong>Château Cornichon</strong>, le Roi Cornichon IV testait la flottabilité de ses cornichons. Certains flottaient, d'autres coulaient, et l'un d'eux, plus audacieux, avait élu domicile dans la couronne royale.</p>
      <div class="dialogue">
        <p><span class="who">Roi Cornichon IV.</span> — Gribouille ! Ce cornichon flotte. Encore.</p>
        <p><span class="who">Gribouille.</span> — En effet, Majesté.</p>
        <p><span class="who">Roi Cornichon IV.</span> — Définis-moi cela, fou.</p>
        <p><span class="who">Gribouille.</span> — Majesté, c'est aux élèves de le faire. Et il y a un cornichon dans votre couronne.</p>
      </div>` },
  { lieu: 'Manoir Parapluie', seigneur: 'le Colonel Tempête', seigneurGenre: 'M', majordome: 'Goutte',
    objet: 'parapluie', objetPl: 'parapluies', succes: 's\'ouvre correctement', echec: 's\'envole',
    action: 'ouverture de parapluie', troisieme: 'parapluie dans le puits',
    story: `<p>Au <strong>Manoir Parapluie</strong>, le Colonel Tempête faisait l'inventaire de ses 312 parapluies. Trois étaient partis en voyage, deux refusaient de s'ouvrir, et l'un d'eux avait élu domicile au fond du puits.</p>
      <div class="dialogue">
        <p><span class="who">Colonel Tempête.</span> — Goutte ! Ce parapluie s'est ouvert correctement. Encore.</p>
        <p><span class="who">Goutte.</span> — En effet, mon Colonel.</p>
        <p><span class="who">Colonel Tempête.</span> — Il faut définir ce phénomène.</p>
        <p><span class="who">Goutte.</span> — Mon Colonel, c'est aux élèves de le faire. Celui du puits, en revanche, refuse de revenir.</p>
      </div>` },
  { lieu: 'Château Papillon', seigneur: 'la Comtesse Aurore', seigneurGenre: 'F', majordome: 'Hector',
    objet: 'papillon', objetPl: 'papillons', succes: 'se pose sur le nez', echec: 'se pose sur la main',
    action: 'atterrissage de papillon', troisieme: 'papillon dans les cheveux',
    story: `<p>Au <strong>Château Papillon</strong>, la Comtesse Aurore collectionnait les papillons qui se posaient sur son nez. C'était une collection vivante, volante, et passablement contrariante pour le personnel.</p>
      <div class="dialogue">
        <p><span class="who">Comtesse Aurore.</span> — Hector ! Ce papillon s'est posé sur mon nez. Encore.</p>
        <p><span class="who">Hector.</span> — En effet, Madame.</p>
        <p><span class="who">Comtesse Aurore.</span> — Il faudrait définir cette chose.</p>
        <p><span class="who">Hector.</span> — Madame, c'est aux élèves de le faire. Le papillon, lui, a filé dans les cheveux de la cuisinière.</p>
      </div>` },
  { lieu: 'Manoir Cafetière', seigneur: 'l\'Oncle Gustave', seigneurGenre: 'M', majordome: 'Madeleine',
    objet: 'café', objetPl: 'cafés', succes: 'déborde', echec: 'dégouline',
    action: 'service de café', troisieme: 'café dans la soupière',
    story: `<p>Au <strong>Manoir Cafetière</strong>, l'Oncle Gustave versait son café avec une précision militaire. Le problème, c'est que la cafetière, elle, n'avait pas signé la convention.</p>
      <div class="dialogue">
        <p><span class="who">Oncle Gustave.</span> — Madeleine ! Ce café a débordé. Encore.</p>
        <p><span class="who">Madeleine.</span> — En effet, Oncle Gustave.</p>
        <p><span class="who">Oncle Gustave.</span> — Il faut définir cela.</p>
        <p><span class="who">Madeleine.</span> — Oncle Gustave, c'est aux élèves de le faire. Et il y a du café dans la soupière.</p>
      </div>` },
  { lieu: 'Château Escargot', seigneur: 'le Duc Limbour', seigneurGenre: 'M', majordome: 'Anselme',
    objet: 'escargot', objetPl: 'escargots', succes: 'atteint la salade', echec: 's\'endort avant',
    action: 'course d\'escargot', troisieme: 'escargot dans le chapeau',
    story: `<p>Au <strong>Château Escargot</strong>, le Duc Limbour organisait des courses d'escargots tous les jeudis. Le gagnant recevait une feuille de salade ; le perdant, une conférence sur la persévérance.</p>
      <div class="dialogue">
        <p><span class="who">Duc Limbour.</span> — Anselme ! Cet escargot a atteint la salade. Encore.</p>
        <p><span class="who">Anselme.</span> — En effet, Monseigneur.</p>
        <p><span class="who">Duc Limbour.</span> — Il faut définir cette chose.</p>
        <p><span class="who">Anselme.</span> — Monseigneur, c'est aux élèves de le faire. Un escargot s'est endormi dans votre chapeau.</p>
      </div>` }
];

