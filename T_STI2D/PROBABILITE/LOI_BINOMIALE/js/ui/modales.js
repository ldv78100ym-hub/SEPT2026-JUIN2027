/* ============================================================
   15. MODALE EXPLICATIVE
   ============================================================ */
let hideTimer = null;
let pinnedKey = null;
let activeTriggerEl = null;
function fillTermPanel(key){ const term = GLOSSARY[key]; if(!term) return false; document.getElementById('tpTitle').textContent = term.title; const cat = document.getElementById('tpCat'); cat.className = 'tp-cat ' + (term.cat === 'essentiel' ? 'ess' : 'cul'); cat.textContent = term.cat === 'essentiel' ? 'Programme — à maîtriser' : 'Culture générale'; document.getElementById('tpBody').innerHTML = term.body; return true; }
function positionTermPanel(el){ const panel = document.getElementById('termPanel'); const vw = window.innerWidth, vh = window.innerHeight; const pw = Math.min(560, vw - 24); panel.style.width = pw + 'px'; const ph = panel.offsetHeight || 320; const r = el.getBoundingClientRect(); let left = r.right + 14; if(left + pw > vw - 12) left = r.left - pw - 14; if(left < 12) left = 12; let top = r.top; if(top + ph > vh - 12) top = Math.max(12, vh - ph - 12); if(top < 12) top = 12; panel.style.left = left + 'px'; panel.style.top = top + 'px'; }
function updatePinIndicator(){ const panel = document.getElementById('termPanel'); const pinBtn = panel.querySelector('.tp-pin'); const isPinned = !!(pinnedKey && panel.dataset.key === pinnedKey); if(pinBtn){ pinBtn.classList.toggle('active', isPinned); pinBtn.title = isPinned ? 'Désépingler' : 'Épingler'; } panel.classList.toggle('pinned', isPinned); }
function showTermPanel(key, el){ if(!GLOSSARY[key]) return; clearTimeout(hideTimer); const panel = document.getElementById('termPanel'); if(panel.classList.contains('show') && panel.dataset.key === key && activeTriggerEl === el) return; if(!fillTermPanel(key)) return; panel.dataset.key = key; activeTriggerEl = el; positionTermPanel(el); panel.classList.add('show'); panel.setAttribute('aria-hidden','false'); updatePinIndicator(); typeset(panel); }
function scheduleHideTermPanel(delay){ if(pinnedKey) return; clearTimeout(hideTimer); hideTimer = setTimeout(function(){ const panel = document.getElementById('termPanel'); panel.classList.remove('show'); panel.setAttribute('aria-hidden','true'); activeTriggerEl = null; }, delay === undefined ? 900 : delay); }
function cancelHideTermPanel(){ clearTimeout(hideTimer); }
function setupTermPanel(){
  const panel = document.getElementById('termPanel');
  panel.querySelector('.close-tp').addEventListener('click', function(){ pinnedKey = null; updatePinIndicator(); panel.classList.remove('show'); panel.setAttribute('aria-hidden','true'); activeTriggerEl = null; });
  const pinBtn = panel.querySelector('.tp-pin');
  if(pinBtn){ pinBtn.addEventListener('click', function(){ if(pinnedKey === panel.dataset.key){ pinnedKey = null; } else { pinnedKey = panel.dataset.key; } updatePinIndicator(); }); }
  panel.addEventListener('mouseenter', cancelHideTermPanel);
  panel.addEventListener('mouseleave', function(){ scheduleHideTermPanel(500); });
  document.addEventListener('mouseover', function(e){ const t = e.target.closest && e.target.closest('[data-term]'); if(!t || !GLOSSARY[t.dataset.term]) return; if(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('#termPanel')) return; showTermPanel(t.dataset.term, t); });
  document.addEventListener('mouseout', function(e){ const t = e.target.closest && e.target.closest('[data-term]'); if(!t) return; const to = e.relatedTarget; if(to && to.closest){ if(to.closest('[data-term]')) return; if(to.closest('#termPanel')) return; } scheduleHideTermPanel(900); });
  document.addEventListener('click', function(e){ const t = e.target.closest && e.target.closest('[data-term]'); if(t && GLOSSARY[t.dataset.term]){ if(pinnedKey === t.dataset.term){ pinnedKey = null; updatePinIndicator(); } else { pinnedKey = t.dataset.term; showTermPanel(t.dataset.term, t); } return; } if(!e.target.closest('#termPanel')){ if(pinnedKey){ pinnedKey = null; updatePinIndicator(); } } });
  function repositionIfShown(){ if(panel.classList.contains('show') && activeTriggerEl && activeTriggerEl.isConnected){ positionTermPanel(activeTriggerEl); } }
  window.addEventListener('scroll', repositionIfShown, {passive:true});
  window.addEventListener('resize', repositionIfShown);
}

/* ============================================================
   16. MODALE DROITS D'AUTEUR
   ============================================================ */
function setupCopyrightModal() {
    const btn = document.getElementById('btnCopyright');
    if(!btn) return;
    const modal = document.getElementById('copyrightModal');
    const closeBtn = document.getElementById('modalCloseBtn');
    const bodyText = document.getElementById('modalBodyText');
    const title = document.title;
    const p1 = setTextWithBreaks("Auteur : Yann Merdy (yann.merdy@gmail.com) — octobre 2026");
    const p2 = setTextWithBreaks("Licence d'Utilisation Non Commerciale");
    const p3 = setTextWithBreaks(`Ce code HTML/CSS/JavaScript ainsi que le contenu généré par l'application (« ${title} ») sont la propriété intellectuelle exclusive de l'auteur, Yann Merdy.`);
    const p4 = setTextWithBreaks("Conditions :");
    const li1 = setTextWithBreaks("Utilisation Privée et Éducative (Autorisée) : usage personnel, éducatif et non lucratif autorisé.");
    const li2 = setTextWithBreaks("Utilisation Commerciale (Interdite) : toute utilisation commerciale est strictement interdite sans accord écrit préalable de l'auteur.");
    const li3 = setTextWithBreaks("Attribution : toute reproduction ou modification doit conserver la mention de l'auteur (Yann Merdy) et la présente notice.");
    const p5 = setTextWithBreaks("Pour toute demande commerciale, contacter l'auteur à l'adresse ci-dessus.");
    bodyText.innerHTML = `<p>${p1}</p><p><strong>${p2}</strong></p><p>${p3}</p><p><strong>${p4}</strong></p><ol><li>${li1}</li><li>${li2}</li><li>${li3}</li></ol><p>${p5}</p>`;
    let lastFocusedElement = null;
    function openModal(){ lastFocusedElement = document.activeElement; modal.style.display = 'flex'; modal.setAttribute('aria-hidden','false'); closeBtn.focus(); }
    function closeModal(){ modal.style.display = 'none'; modal.setAttribute('aria-hidden','true'); if(lastFocusedElement) lastFocusedElement.focus(); }
    btn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal(); });
}

/* ============================================================
   16bis. MODALE PÉDAGOGIQUE
   ============================================================ */
function openPedagoModal(){
  const overlay = document.getElementById('pedagoModal');
  if(!overlay) return;
  overlay.classList.add('show');
  overlay.setAttribute('aria-hidden','false');
}

function closePedagoModal(){
  const overlay = document.getElementById('pedagoModal');
  if(!overlay) return;
  overlay.classList.remove('show');
  overlay.setAttribute('aria-hidden','true');
}

function setupPedagoModal(){
  const overlay = document.getElementById('pedagoModal');
  const closeBtn = document.getElementById('pedagoCloseBtn');
  const startBtn = document.getElementById('pedagoStartBtn');
  if(!overlay) return;
  if(closeBtn) closeBtn.addEventListener('click', closePedagoModal);
  if(startBtn) startBtn.addEventListener('click', closePedagoModal);
  overlay.addEventListener('click', function(e){ if(e.target === overlay) closePedagoModal(); });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && overlay.classList.contains('show')) closePedagoModal();
  });
  overlay.classList.add('show');
  overlay.setAttribute('aria-hidden','false');
}

