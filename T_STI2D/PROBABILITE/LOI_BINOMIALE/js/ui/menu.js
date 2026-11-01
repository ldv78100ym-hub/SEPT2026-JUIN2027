/* ============================================================
   10. MENU
   ============================================================ */
function renderMenu(){
  let html = '<div class="menu-title">' + SC.lieu + '</div><div class="menu-list">';
  STEPS.forEach(function(s){
    const isDone = state.completed.has(s.n);
    const isViewing = state.current === s.n;
    const isUnlocked = s.n <= state.maxUnlocked;
    let cls = 'menu-item';
    if(isViewing) cls += ' viewing';
    if(isDone) cls += ' done';
    if(!isUnlocked) cls += ' locked';
    let icon;
    if(isViewing) icon = '▶'; else if(isDone) icon = '✔'; else if(!isUnlocked) icon = '🔒'; else icon = '○';
    const dis = !isUnlocked ? 'disabled' : '';
    html += '<button type="button" class="' + cls + '" data-step="' + s.n + '" ' + dis + '><span class="menu-icon">' + icon + '</span><span class="menu-body"><span class="menu-num">Étape ' + s.n + '</span><span class="menu-label">' + s.notion + '</span></span></button>';
  });
  if(state.completed.has(17)){
    html += '<div class="menu-sep">— Enquête terminée —</div>';
    const isViewingBilan = state.current === 18;
    html += `<button class="menu-item${isViewingBilan ? ' viewing' : ''}" data-step="18"><span class="menu-icon">${isViewingBilan ? '▶' : '📊'}</span><span class="menu-body"><span class="menu-num">Synthèse</span><span class="menu-label">Bilan complet (3 volets)</span></span></button>`;
    const isCourseViewing = state.current >= 19 && state.current <= 24;
    html += `<button class="menu-item menu-toggle${isCourseViewing ? ' viewing' : ''}" id="courseToggle"><span class="menu-icon">📚</span><span class="menu-body"><span class="menu-num">Ressource</span><span class="menu-label">Cours loi binomiale</span></span><span class="menu-caret">${isCourseViewing ? '▾' : '▸'}</span></button>`;
    html += `<div class="menu-children" id="courseChildren" style="display:${isCourseViewing ? 'block' : 'none'}">`;
    const COURSE_LABELS = { 19: 'Volet 1 — Cours classique', 20: 'Volet 2 — Tableaux', 21: 'Volet 3 — Carte mentale', 22: 'Volet 4 — Graphe', 23: 'Volet 5 — Rédaction type', 24: 'Volet 6 — Index' };
    for(let n = 19; n <= 24; n++){
      const isV = state.current === n;
      html += `<button class="menu-item menu-child${isV ? ' viewing' : ''}" data-step="${n}"><span class="menu-icon">${isV ? '▶' : '📄'}</span><span class="menu-body"><span class="menu-num">Cours</span><span class="menu-label">${COURSE_LABELS[n]}</span></span></button>`;
    }
    html += '</div>';
  }
  html += '</div>';
  menuEl.innerHTML = html;
  menuEl.querySelectorAll('.menu-item[data-step]:not([disabled])').forEach(function(btn){ btn.addEventListener('click', function(){ showStep(parseInt(btn.getAttribute('data-step'), 10)); }); });
  const toggle = document.getElementById('courseToggle');
  if(toggle){ toggle.addEventListener('click', function(){ const children = document.getElementById('courseChildren'); const caret = toggle.querySelector('.menu-caret'); const isOpen = children.style.display !== 'none'; children.style.display = isOpen ? 'none' : 'block'; caret.textContent = isOpen ? '▸' : '▾'; }); }
}

