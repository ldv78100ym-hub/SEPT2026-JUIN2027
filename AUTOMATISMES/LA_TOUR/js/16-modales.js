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

/* ---------- Vue « 🎓 Par niveau » : tableau croisé + sections par niveau ----------
   Le tableau croisé est INTERACTIF : chaque numéro actif porte une
   bulle d'information (survol, data-tip → liste des notions exactes
   de l'intersection niveau × catégorie) et se coche d'un clic pour
   composer un menu de révision ciblé (« 🎯 Réviser la sélection »). */
let CROISE_CELLS = {};        /* clé "niveau|catégorie" → notions de la cellule */
let CROISE_SEL = new Set();   /* cellules cochées */
let CROISE_BAR = null;        /* { txt, launch } de la barre de sélection courante */

function tdmCroiseSelIds(){
  const ids = [];
  CROISE_SEL.forEach(function(key){
    (CROISE_CELLS[key] || []).forEach(function(n){ ids.push(n.id); });
  });
  return ids;
}

function tdmCroiseSelBarRefresh(){
  if(!CROISE_BAR) return;
  const n = tdmCroiseSelIds().length;
  CROISE_BAR.txt.innerHTML = n
    ? '✅ <b>' + n + '</b> notion' + (n > 1 ? 's' : '') + ' cochée' + (n > 1 ? 's' : '') +
      ' dans le tableau — lance la révision ou continue de cocher des numéros.'
    : 'Coche les numéros du tableau (clic) pour composer un menu de révision ciblé : seules ces notions seront posées.';
  CROISE_BAR.launch.disabled = (n === 0);
  CROISE_BAR.launch.textContent = '🎯 Réviser la sélection (' + n + ' notion' + (n > 1 ? 's' : '') + ')';
}

function tdmToggleCroiseCell(td, key, k){
  if(CROISE_SEL.has(key)){
    CROISE_SEL.delete(key);
    td.classList.remove('checked');
    td.textContent = String(k);
  } else {
    CROISE_SEL.add(key);
    td.classList.add('checked');
    td.textContent = '✓ ' + k;
  }
  tdmCroiseSelBarRefresh();
}

function tdmRenderProgNiveau(list){
  const byId = {};
  NOTIONS.forEach(n => { byId[n.id] = n; });

  /* 1) Tableau croisé : lignes = niveaux, colonnes = catégories (icônes),
        cellule = nombre de notions à l'intersection. Construction élément
        par élément : chaque numéro actif porte sa bulle d'information
        (data-tip) et son propre écouteur de clic. */
  const crx = tdmCroise();
  const catOf = {};
  crx.cats.forEach(function(c, ci){
    (c.ids || []).forEach(id => { if(catOf[id] === undefined) catOf[id] = ci; });
    (c.subs || []).forEach(s => s.ids.forEach(id => { if(catOf[id] === undefined) catOf[id] = ci; }));
  });
  CROISE_CELLS = {};
  NOTIONS.forEach(function(n){
    const ci = catOf[n.id];
    const v = tdmNiveauDe(n.id);
    if(ci === undefined || !v || v.code === '?') return;
    const key = v.code + '|' + ci;
    (CROISE_CELLS[key] = CROISE_CELLS[key] || []).push(n);
  });

  const wrap = document.createElement('div');
  wrap.className = 'croise-wrap';
  const table = document.createElement('table');
  table.classList.add('croise-table');
  const thead = document.createElement('thead');
  const hrow = document.createElement('tr');
  const thCorner = document.createElement('th');
  thCorner.classList.add('croise-lvl');
  thCorner.textContent = 'Niveau';
  hrow.appendChild(thCorner);
  crx.cats.forEach(c => {
    const th = document.createElement('th');
    th.classList.add('croise-th');
    let tot = 0;
    (c.ids || []).forEach(() => tot++);
    (c.subs || []).forEach(s => s.ids.forEach(() => tot++));
    th.setAttribute('data-tip', esc(c.nom) + ' — ' + tot + ' notion' + (tot > 1 ? 's' : ''));
    th.textContent = c.icon || '📚';
    hrow.appendChild(th);
  });
  const thTot = document.createElement('th');
  thTot.classList.add('croise-tot');
  thTot.textContent = 'Σ';
  hrow.appendChild(thTot);
  thead.appendChild(hrow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  crx.cells.forEach(function(row, li){
    const v = NIVEAUX[li];
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.classList.add('croise-lvl');
    th.textContent = v.icon + ' ' + v.court;
    tr.appendChild(th);
    row.forEach(function(k, ci){
      const td = document.createElement('td');
      if(k){
        const c = crx.cats[ci];
        const key = v.code + '|' + ci;
        const names = CROISE_CELLS[key] || [];
        td.classList.add('on');
        td.setAttribute('data-k', k);
        td.setAttribute('data-cell', key);
        td.setAttribute('data-tip',
          '<b>' + v.icon + ' ' + esc(v.court) + ' × ' + (c.icon || '📚') + ' ' + esc(c.nom) + '</b><br>' +
          names.map(function(n){
            return '• ' + esc(n.name) + (state.validated.has(n.id) ? ' <b>✔ validée</b>' : '');
          }).join('<br>') +
          '<br><i>Clique pour cocher ou décocher ces ' + k + ' notion' + (k > 1 ? 's' : '') + '.</i>');
        td.textContent = CROISE_SEL.has(key) ? '✓ ' + k : String(k);
        if(CROISE_SEL.has(key)) td.classList.add('checked');
        td.addEventListener('click', function(){ tdmToggleCroiseCell(td, key, k); });
      } else {
        td.classList.add('off');
        td.textContent = '·';
      }
      tr.appendChild(td);
    });
    const tdTot = document.createElement('td');
    tdTot.classList.add('croise-tot');
    tdTot.textContent = crx.rowTot[li];
    tr.appendChild(tdTot);
    tbody.appendChild(tr);
  });
  const trSum = document.createElement('tr');
  trSum.classList.add('croise-sum');
  const thSum = document.createElement('th');
  thSum.classList.add('croise-lvl');
  thSum.textContent = 'Σ';
  trSum.appendChild(thSum);
  crx.colTot.forEach(function(k){
    const td = document.createElement('td');
    td.classList.add(k ? 'on' : 'off');
    td.textContent = k || '·';
    trSum.appendChild(td);
  });
  const tdTotSum = document.createElement('td');
  tdTotSum.classList.add('croise-tot');
  tdTotSum.textContent = crx.total;
  trSum.appendChild(tdTotSum);
  tbody.appendChild(trSum);
  table.appendChild(tbody);
  wrap.appendChild(table);

  const note = document.createElement('div');
  note.classList.add('croise-note');
  note.textContent = 'Chaque cellule compte les notions du niveau (ligne) dans la catégorie (colonne). ' +
    'Survole l’icône d’une colonne pour son nom, survole un numéro pour voir la liste exacte ' +
    'des notions qu’il recouvre (et leur statut), puis clique les numéros à traiter pour ' +
    'composer un menu de révision ciblé.';
  wrap.appendChild(note);

  const bar = document.createElement('div');
  bar.classList.add('croise-selbar');
  const barTxt = document.createElement('span');
  barTxt.classList.add('croise-sel-txt');
  const barLaunch = document.createElement('button');
  barLaunch.type = 'button';
  barLaunch.classList.add('croise-sel-launch');
  barLaunch.addEventListener('click', function(){
    const ids = tdmCroiseSelIds();
    if(!ids.length) return;
    closeNotions();
    if(window.tdmOpenRevision) window.tdmOpenRevision(ids);
  });
  const barClear = document.createElement('button');
  barClear.type = 'button';
  barClear.classList.add('croise-sel-clear');
  barClear.textContent = '↺ Vider';
  barClear.addEventListener('click', function(){
    CROISE_SEL = new Set();
    openNotions();
  });
  bar.appendChild(barTxt);
  bar.appendChild(barLaunch);
  bar.appendChild(barClear);
  wrap.appendChild(bar);
  CROISE_BAR = { txt: barTxt, launch: barLaunch };
  tdmCroiseSelBarRefresh();
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

