/* ============================================================
   19b. RÉVISION PERSONNALISÉE (menu 🎯)
   L'élève choisit, pour la session en cours, un MENU DE NOTIONS
   sur mesure : la tour ne pose ensuite que des questions issues
   de cette sélection (mêmes règles de probabilités, de notions
   passées et de leçons d'erreur — seule la SOURCE du tirage
   change, via state.customPool filtré dans pickNotion).
   La sélection est ÉPHÉMÈRE : elle ne survit ni à la réactivation
   d'une autre session ni au rechargement de la page, et ne figure
   pas dans la sauvegarde scellée (elle décrit la session, pas la
   progression).
   ============================================================ */

(function(){
  /* ---------- Modale injectée (même gabarit que les modales existantes) ---------- */
  const wrap = document.createElement('div');
  wrap.id = 'revisionModal';
  wrap.setAttribute('role', 'dialog');
  wrap.setAttribute('aria-modal', 'true');
  wrap.setAttribute('aria-labelledby', 'revTitle');
  wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML =
    '<div class="revbox">' +
    '<button class="close" id="revClose" aria-label="Fermer">×</button>' +
    '<h2 id="revTitle">🎯 Révision personnalisée</h2>' +
    '<div class="rev-sub">Compose <b>le menu de notions de cette session</b> : cochez les notions à réviser — la tour ne posera ensuite que des questions de votre sélection, jusqu\u2019à la fin de la révision. La sélection ne modifie ni la progression, ni la sauvegarde scellée.</div>' +
    '<div class="rev-tools">' +
    '<input type="text" id="revSearch" placeholder="🔍 Filtrer les notions…" autocomplete="off">' +
    '<button type="button" class="rev-mini" id="revAll">Tout cocher</button>' +
    '<button type="button" class="rev-mini" id="revNone">Tout décocher</button>' +
    '</div>' +
    '<div class="rev-list" id="revList"></div>' +
    '<div class="rev-status" id="revStatus"></div>' +
    '<div class="rev-actions">' +
    '<button type="button" class="rev-launch" id="revLaunch">▶ Lancer la révision</button>' +
    '<button type="button" class="rev-end" id="revEnd">■ Terminer la révision en cours</button>' +
    '</div>' +
    '</div>';
  document.body.appendChild(wrap);

  /* ---------- Badge flottant « révision active » ---------- */
  const badge = document.createElement('div');
  badge.id = 'revBadge';
  badge.style.display = 'none';
  document.body.appendChild(badge);

  /* ---------- Sélection en cours d'édition (avant lancement) ---------- */
  let revSel = new Set();

  function $(id){ return document.getElementById(id); }
  function esc(s){ return window.esc ? window.esc(s) : String(s); }

  /* ---------- Construction de la liste des notions ---------- */
  function tdmRevRender(){
    const list = $('revList');
    list.innerHTML = '';
    const q = ($('revSearch').value || '').trim().toLowerCase();
    NOTIONS.forEach(function(n, i){
      const visible = !q || (n.name + ' ' + n.id).toLowerCase().indexOf(q) >= 0;
      if(!visible) return;
      const isValidated = state.validated.has(n.id);
      const isPassed = !isValidated && state.passed.has(n.id);
      const el = document.createElement('label');
      el.className = 'rev-item' + (isValidated ? ' done' : '') + (isPassed ? ' passed' : '');
      el.innerHTML =
        '<input type="checkbox" data-id="' + esc(n.id) + '"' + (revSel.has(n.id) ? ' checked' : '') + '>' +
        '<span class="rev-num">' + (i + 1) + '</span>' +
        '<span class="rev-name">' + esc(n.name) + '</span>' +
        '<span class="rev-st">' + (isValidated ? '✔ Validée' : (isPassed ? '⏭ Passée' : '⏳ À valider')) + '</span>';
      list.appendChild(el);
    });
    tdmRevStatus();
  }

  function tdmRevStatus(){
    const n = revSel.size;
    $('revStatus').textContent = n === 0
      ? 'Aucune notion cochée.'
      : n + ' notion' + (n > 1 ? 's' : '') + ' cochée' + (n > 1 ? 's' : '') + '.';
    $('revLaunch').disabled = (n === 0);
    $('revLaunch').textContent = '▶ Lancer la révision (' + n + ' notion' + (n > 1 ? 's' : '') + ')';
  }

  /* ---------- Ouverture / fermeture ---------- */
  function tdmOpenRevision(){
    /* La sélection en édition repart de la sélection active, s'il y en a une. */
    revSel = state.customPool ? new Set(state.customPool) : new Set();
    $('revSearch').value = '';
    tdmRevRender();
    $('revEnd').style.display = state.customPool ? '' : 'none';
    $('revisionModal').classList.add('open');
    $('revisionModal').setAttribute('aria-hidden', 'false');
    $('revSearch').focus();
  }
  function tdmCloseRevision(){
    $('revisionModal').classList.remove('open');
    $('revisionModal').setAttribute('aria-hidden', 'true');
  }

  /* ---------- Lancement / fin de la révision ---------- */
  function tdmLaunchRevision(ids){
    /* ids : liste explicite (tests / appel programmatique) ; sinon
       on relit les cases cochées de la modale. */
    if(Array.isArray(ids) && ids.length){
      revSel = new Set(ids.filter(function(id){ return NOTIONS.some(function(n){ return n.id === id; }); }));
    } else {
      revSel = new Set();
      $('revList').querySelectorAll('input[type="checkbox"]:checked').forEach(function(c){
        if(c.checked) revSel.add(c.getAttribute('data-id'));
      });
    }
    if(revSel.size === 0) return;
    state.customPool = new Set(revSel);
    tdmCloseRevision();
    tdmRevRefreshUI();
    feedback.className = 'fb-good';
    feedback.textContent = '🎯 Révision personnalisée lancée : ' + revSel.size +
      ' notion' + (revSel.size > 1 ? 's' : '') + ' au menu. Seules ces notions seront posées jusqu\u2019à la fin de la révision.';
    if(state.playing) newQuestion();
    try { tdmSaveNow(); } catch(e) {}
  }

  function tdmEndRevision(){
    state.customPool = null;
    tdmRevRefreshUI();
    feedback.className = 'fb-good';
    feedback.textContent = '🎯 Révision personnalisée terminée : retour au programme complet des ' + N_TOT + ' notions.';
    if(state.playing) newQuestion();
    try { tdmSaveNow(); } catch(e) {}
  }

  /* ---------- Bouton du menu + badge ---------- */
  function tdmRevRefreshUI(){
    const btn = $('revisionBtn');
    if(btn){
      btn.textContent = state.customPool
        ? '🎯 Révision en cours (' + state.customPool.size + ' notion' + (state.customPool.size > 1 ? 's' : '') + ')'
        : '🎯 Révision personnalisée…';
      btn.classList.toggle('active-revision', !!state.customPool);
    }
    badge.style.display = state.customPool ? '' : 'none';
    if(state.customPool){
      badge.textContent = '🎯 Révision : ' + state.customPool.size + ' notion' + (state.customPool.size > 1 ? 's' : '');
    }
  }

  /* ---------- Câblage ---------- */
  $('revisionBtn').addEventListener('click', tdmOpenRevision);
  $('revClose').addEventListener('click', tdmCloseRevision);
  $('revisionModal').addEventListener('click', function(e){
    if(e.target === this) tdmCloseRevision();
  });
  $('revSearch').addEventListener('input', tdmRevRender);
  $('revList').addEventListener('change', function(e){
    const c = e.target;
    if(c && c.getAttribute && c.getAttribute('data-id')){
      if(c.checked) revSel.add(c.getAttribute('data-id'));
      else revSel.delete(c.getAttribute('data-id'));
      tdmRevStatus();
    }
  });
  $('revAll').addEventListener('click', function(){
    $('revList').querySelectorAll('input[type="checkbox"]').forEach(function(c){
      c.checked = true; revSel.add(c.getAttribute('data-id'));
    });
    tdmRevStatus();
  });
  $('revNone').addEventListener('click', function(){
    $('revList').querySelectorAll('input[type="checkbox"]').forEach(function(c){
      c.checked = false;
    });
    revSel = new Set();
    tdmRevStatus();
  });
  $('revLaunch').addEventListener('click', function(){ tdmLaunchRevision(); });
  $('revEnd').addEventListener('click', tdmEndRevision);
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') tdmCloseRevision();
  });

  /* API exposée (autres modules, bouton du menu, banc d'essai). */
  window.tdmOpenRevision = tdmOpenRevision;
  window.tdmCloseRevision = tdmCloseRevision;
  window.tdmLaunchRevision = tdmLaunchRevision;
  window.tdmEndRevision = tdmEndRevision;
  window.tdmRevRefreshUI = tdmRevRefreshUI;
  tdmRevRefreshUI();
})();
