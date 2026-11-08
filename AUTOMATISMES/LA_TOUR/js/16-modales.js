/* ============================================================
   7. MODALES
   ============================================================ */
const copyModal = $('copyrightModal');
const copyrightBtn = $('copyrightBtn');
const copyrightClose = $('copyrightClose');
const notionsModal = $('notionsModal');
const notionsBtn = $('notionsBtn');
const notionsClose = $('notionsClose');
let lastFocus = null;
/* Vue active de la progression : 'cat' (catégories) ou 'niveau' (tableau croisé). */
let PROG_VIEW = 'cat';

function openCopyright(){
  lastFocus = document.activeElement;
  copyModal.classList.add('open');
  copyModal.setAttribute('aria-hidden','false');
  copyrightClose.focus();
}
function closeCopyright(){
  copyModal.classList.remove('open');
  copyModal.setAttribute('aria-hidden','true');
  if(lastFocus && lastFocus.focus) lastFocus.focus();
}

/* Carte d'une notion dans la progression (statut, barre, éléments). */
function tdmNotionCard(n){
  const isValidated = state.validated.has(n.id);
  const isPassed = !isValidated && state.passed.has(n.id);
  const progress = isValidated ? 100 : tdmScoreNotion(n.id);
  const div = document.createElement('div');
  div.className = 'notion-item';
  div.setAttribute('data-notion', n.id);
  div.innerHTML = `
    <div class="notion-header">
      <span>${n.name}</span>
      <span class="notion-status ${isValidated ? '' : 'pending'}">${isValidated ? '✔ Validée' : (isPassed ? '⏭ Passée' : '⏳ À valider')}</span>
    </div>
    <div class="progress-track">
      <div class="progress-fill" style="width:${progress}%"></div>
    </div>
    <div class="prob-indicator">Probabilité d'apparition : ${Math.round(Math.min(1, Math.max(0.05, n.prob)) * 100)}%</div>
    ${tdmElemsHTML(n.id, { stats: true })}
  `;
  return div;
}

/* Plier / déplier une catégorie de la progression. */
function tdmToggleCat(head){
  const box = head.parentElement;
  if(!box) return;
  box.classList.toggle('folded');
  head.classList.toggle('folded');
}

function openNotions(){
  lastFocus = document.activeElement;
  const list = $('notionsList');
  list.innerHTML = '';
  if(PROG_VIEW === 'niveau' && typeof NIVEAUX !== 'undefined' && typeof NOTION_LEVELS !== 'undefined'){
    tdmRenderProgNiveau(list);
  } else {
    tdmRenderProgCat(list);
  }
  tdmProgSyncViews();
  notionsModal.classList.add('open');
  notionsModal.setAttribute('aria-hidden', 'false');
  notionsClose.focus();
}

/* Souligne le bouton de vue actif (basculer ne recharge pas la page). */
function tdmProgSyncViews(){
  const bCat = $('progViewCat'), bNiv = $('progViewNiveau');
  if(!bCat || !bNiv) return;
  bCat.classList.toggle('active', PROG_VIEW === 'cat');
  bNiv.classList.toggle('active', PROG_VIEW === 'niveau');
}

/* ---------- Vue « Par catégorie » (rendu historique) ---------- */
function tdmRenderProgCat(list){
  const byId = {};
  NOTIONS.forEach(n => { byId[n.id] = n; });
  const shown = {};
  const cats = (typeof PROG_CATS !== 'undefined') ? PROG_CATS : [];
  cats.forEach(function(c){
    /* Toutes les notions de la catégorie (sous-catégories comprises) */
    let ids = [];
    (c.subs || []).forEach(s => { ids = ids.concat(s.ids); });
    (c.ids || []).forEach(id => { ids.push(id); });
    ids.forEach(id => { shown[id] = true; });
    const valid = ids.filter(id => byId[id] && state.validated.has(id)).length;
    const box = document.createElement('div');
    box.className = 'prog-cat';
    const head = document.createElement('button');
    head.type = 'button';
    head.className = 'prog-cat-head';
    head.innerHTML = `<span class="prog-cat-chev">▾</span>` +
      `<span class="prog-cat-title">${c.icon || '📚'} ${esc(c.nom)}</span>` +
      `<span class="prog-cat-count">${valid}/${ids.length} validée${valid > 1 ? 's' : ''}</span>`;
    head.addEventListener('click', function(){ tdmToggleCat(head); });
    box.appendChild(head);
    (c.subs || []).forEach(function(s){
      if(s.ids.some(id => byId[id])){
        const sh = document.createElement('div');
        sh.className = 'prog-sub-head';
        sh.textContent = s.nom;
        box.appendChild(sh);
        s.ids.forEach(id => { if(byId[id]) box.appendChild(tdmNotionCard(byId[id])); });
      }
    });
    (c.ids || []).forEach(id => { if(byId[id]) box.appendChild(tdmNotionCard(byId[id])); });
    list.appendChild(box);
  });
  /* Secours : notions non classées (ne devrait jamais arriver) */
  const rest = NOTIONS.filter(n => !shown[n.id]);
  if(rest.length){
    const box = document.createElement('div');
    box.className = 'prog-cat';
    const head = document.createElement('div');
    head.className = 'prog-cat-head';
    head.innerHTML = `<span class="prog-cat-chev">▾</span><span class="prog-cat-title">📚 Autres</span>` +
      `<span class="prog-cat-count">${rest.length} notion${rest.length > 1 ? 's' : ''}</span>`;
    box.appendChild(head);
    rest.forEach(n => box.appendChild(tdmNotionCard(n)));
    list.appendChild(box);
  }
}

/* ---------- Vue « 🎓 Par niveau » : tableau croisé + sections par niveau ---------- */
function tdmRenderProgNiveau(list){
  const byId = {};
  NOTIONS.forEach(n => { byId[n.id] = n; });

  /* 1) Tableau croisé : lignes = niveaux, colonnes = catégories (icônes),
        cellule = nombre de notions à l'intersection. */
  const crx = tdmCroise();
  const wrap = document.createElement('div');
  wrap.className = 'croise-wrap';
  let h = '<table class="croise-table"><thead><tr><th class="croise-lvl">Niveau</th>';
  crx.cats.forEach(c => {
    h += '<th class="croise-th" title="' + esc(c.nom) + '">' + (c.icon || '📚') + '</th>';
  });
  h += '<th class="croise-tot">Σ</th></tr></thead><tbody>';
  crx.cells.forEach(function(row, li){
    const v = NIVEAUX[li];
    h += '<tr><th class="croise-lvl">' + v.icon + ' ' + esc(v.court) + '</th>';
    row.forEach(k => { h += '<td class="' + (k ? 'on' : 'off') + '">' + (k || '·') + '</td>'; });
    h += '<td class="croise-tot">' + crx.rowTot[li] + '</td></tr>';
  });
  h += '<tr class="croise-sum"><th class="croise-lvl">Σ</th>';
  crx.colTot.forEach(k => { h += '<td class="' + (k ? 'on' : 'off') + '">' + (k || '·') + '</td>'; });
  h += '<td class="croise-tot">' + crx.total + '</td></tr></tbody></table>';
  h += '<div class="croise-note">Chaque cellule compte les notions du niveau (ligne) dans la catégorie (colonne) — ' +
       'survole l’icône d’une colonne pour afficher son nom.</div>';
  wrap.innerHTML = h;
  list.appendChild(wrap);

  /* 2) Une section dépliable par niveau, avec raccourci « Réviser ce niveau ». */
  NIVEAUX.forEach(function(v){
    const ids = NOTIONS.filter(n => NOTION_LEVELS[n.id] === v.code).map(n => n.id);
    if(!ids.length) return;
    const valid = ids.filter(id => byId[id] && state.validated.has(id)).length;
    const box = document.createElement('div');
    box.className = 'prog-cat niveau-box';
    const head = document.createElement('button');
    head.type = 'button';
    head.className = 'prog-cat-head';
    head.innerHTML = `<span class="prog-cat-chev">▾</span>` +
      `<span class="prog-cat-title">${v.icon} ${esc(v.nom)}</span>` +
      `<span class="prog-cat-count">${valid}/${ids.length} validée${valid > 1 ? 's' : ''}</span>`;
    head.addEventListener('click', function(){ tdmToggleCat(head); });
    box.appendChild(head);
    const rev = document.createElement('button');
    rev.type = 'button';
    rev.className = 'rev-niveau-btn';
    rev.innerHTML = '🎯 Réviser ce niveau';
    rev.addEventListener('click', function(){
      closeNotions();
      if(window.tdmOpenRevision) window.tdmOpenRevision(v.code);
    });
    box.appendChild(rev);
    ids.forEach(id => { if(byId[id]) box.appendChild(tdmNotionCard(byId[id])); });
    list.appendChild(box);
  });
}
function closeNotions(){
  notionsModal.classList.remove('open');
  notionsModal.setAttribute('aria-hidden', 'true');
  if(lastFocus && lastFocus.focus) lastFocus.focus();
}

copyrightBtn.addEventListener('click', openCopyright);
const rapportBtn = $('rapportBtn');
rapportBtn.addEventListener('click', () => window.open('rapport-publication.html'));
copyrightClose.addEventListener('click', closeCopyright);
copyModal.addEventListener('click', e => {
  if(e.target === copyModal) closeCopyright();
});
notionsBtn.addEventListener('click', openNotions);
notionsClose.addEventListener('click', closeNotions);
/* Bascule des vues de la progression : catégories ↔ niveaux (tableau croisé). */
$('progViewCat').addEventListener('click', function(){ PROG_VIEW = 'cat'; openNotions(); });
$('progViewNiveau').addEventListener('click', function(){ PROG_VIEW = 'niveau'; openNotions(); });
notionsModal.addEventListener('click', e => {
  if(e.target === notionsModal) closeNotions();
});
document.addEventListener('keydown', e => {
  if(e.key === 'Escape') {
    if (copyModal.classList.contains('open')) closeCopyright();
    if (notionsModal.classList.contains('open')) closeNotions();
    if (resetModal.classList.contains('open')) closeResetModal();
  }
});

