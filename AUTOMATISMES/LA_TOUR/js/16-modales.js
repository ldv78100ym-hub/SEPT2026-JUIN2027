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
  notionsModal.classList.add('open');
  notionsModal.setAttribute('aria-hidden', 'false');
  notionsClose.focus();
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

