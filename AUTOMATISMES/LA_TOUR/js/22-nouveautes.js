/* ============================================================
   22. NOUVEAUTÉS — modale d'alerte à l'ouverture de la page
   Au chargement, une modale « 🆕 Quoi de neuf » présente les
   dernières mises à jour de la tour (niveaux de classe, vue
   « Par niveau », révision filtrée) et met EN PARTICULIER en
   avant la possibilité de cocher directement dans le tableau
   croisé les notions à réviser selon son niveau de classe.
   • Affichage automatique à chaque ouverture, sauf si l'élève
     coche « Ne plus afficher au démarrage » (localStorage) ;
   • Bouton « 🆕 Nouveautés » du menu utilitaire pour la rouvrir ;
   • Bouton « 🎓 Découvrir le tableau croisé » : bascule la
     progression en vue « Par niveau » et l'ouvre.
   ============================================================ */

(function(){
  function $(id){ return document.getElementById(id); }

  /* ---------- Modale injectée (même gabarit que les modales existantes) ---------- */
  const wrap = document.createElement('div');
  wrap.id = 'newsModal';
  wrap.setAttribute('role', 'dialog');
  wrap.setAttribute('aria-modal', 'true');
  wrap.setAttribute('aria-labelledby', 'newsTitle');
  wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML =
    '<div class="newsbox">' +
    '<button type="button" class="close" id="newsClose" aria-label="Fermer">×</button>' +
    '<h2 id="newsTitle">🆕 Quoi de neuf — novembre 2026</h2>' +
    '<div class="news-sub">La Tour des Maths vient d’être enrichie. Voici les mises à jour les plus utiles — et surtout une nouvelle façon de réviser exactement ce qui correspond à ton niveau de classe.</div>' +
    '<div class="news-list">' +
    '<div class="news-item news-star"><b>⭐ Coche directement dans le tableau croisé ce que tu veux réviser selon ton niveau de classe.</b><br>' +
    'Ouvre <b>📚 Progression des notions → « 🎓 Par niveau »</b> : dans le tableau croisé, <b>survole un numéro</b> pour voir la liste des notions qu’il recouvre (avec leur statut), puis <b>clique pour le cocher</b> (✓) — autant de cases que tu veux, celles de ton niveau d’abord ! Clique enfin <b>« 🎯 Réviser la sélection »</b> : la tour ne posera que ces notions-là. Encore plus rapide : le bouton <b>« 🎯 Réviser ce niveau »</b> de chaque section de niveau pré-coche tout le niveau.</div>' +
    '<div class="news-item"><b>🎓 Niveaux de classe.</b> Les 228 notions de la tour sont désormais rattachées à un niveau scolaire : 🌱 Cycle 3 (15 notions), 🌿 Cycle 4 (32), 🎓 Seconde (44), 🎓 Première (75), 🎓 Terminale (29), 🌟 Maths expertes &amp; complémentaires (14), 🏛 Post-bac/CPGE (19).</div>' +
    '<div class="news-item"><b>📊 Vue « 🎓 Par niveau ».</b> La progression affiche le tableau croisé des niveaux × 22 catégories (effectifs par case, totaux contrôlés), puis une section dépliable par niveau avec son compteur « X/Y validées ».</div>' +
    '<div class="news-item"><b>🎯 Révision personnalisée.</b> Puces de filtrage par niveau (avec effectifs), badge de niveau sur chaque ligne de notion, et « Réviser ce niveau » depuis la progression.</div>' +
    '<div class="news-item"><b>🔍 Audit du dépôt GitHub.</b> Tout le programme présent dans le dépôt est désormais couvert : lois continues &amp; inférence (normale, Poisson, échantillonnage, tests, cartes de contrôle), intégration &amp; équations différentielles, indices base 100, binaire/hexadécimal et effectifs cumulés — 19 notions nouvelles, surtout en Terminale et CPGE.</div>' +
    '<div class="news-item"><b>📄 Dossier de présentation à jour.</b> Chiffres actualisés (228 notions, 427 générateurs, 48 modules) et tableau croisé complet « niveaux de classe × notions à traiter ».</div>' +
    '</div>' +
    '<label class="news-hide"><input type="checkbox" id="newsHide"> Ne plus afficher au démarrage</label>' +
    '<div class="news-actions">' +
    '<button type="button" class="news-ok" id="newsOk">🆗 J’ai compris</button>' +
    '<button type="button" class="news-discover" id="newsDiscover">🎓 Découvrir le tableau croisé</button>' +
    '</div>' +
    '</div>';
  document.body.appendChild(wrap);

  /* ---------- Ouverture / fermeture ---------- */
  function tdmNewsOpen(){
    $('newsModal').classList.add('open');
    $('newsModal').setAttribute('aria-hidden', 'false');
  }
  function tdmNewsClose(){
    $('newsModal').classList.remove('open');
    $('newsModal').setAttribute('aria-hidden', 'true');
  }
  /* Affichage automatique : forcé depuis le menu, respectueux
     de l’option « Ne plus afficher au démarrage » sinon. */
  function tdmNewsShow(force){
    if(!force && localStorage.getItem('tdm-news-hide') === '1') return;
    tdmNewsOpen();
  }

  /* ---------- Câblage ---------- */
  $('newsClose').addEventListener('click', tdmNewsClose);
  $('newsOk').addEventListener('click', tdmNewsClose);
  $('newsDiscover').addEventListener('click', function(){
    tdmNewsClose();
    if(typeof PROG_VIEW !== 'undefined') PROG_VIEW = 'niveau';
    if(typeof openNotions === 'function') openNotions();
  });
  $('newsHide').addEventListener('change', function(){
    if($('newsHide').checked) localStorage.setItem('tdm-news-hide', '1');
    else localStorage.removeItem('tdm-news-hide');
  });
  $('newsModal').addEventListener('click', function(e){ if(e.target === this) tdmNewsClose(); });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') tdmNewsClose();
  });
  $('newsBtn').addEventListener('click', function(){ tdmNewsShow(true); });
  if(localStorage.getItem('tdm-news-hide') === '1') $('newsHide').checked = true;

  /* ---------- Affichage à l’ouverture de la page ---------- */
  tdmNewsShow();

  /* API exposée (banc d’essai). */
  window.tdmNewsShow = tdmNewsShow;
  window.tdmNewsClose = tdmNewsClose;
  window.tdmNewsBox = function(){ return wrap; };
})();
