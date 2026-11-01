/* ============================================================
   17. SNAPSHOT / PERSISTANCE AUTOMATIQUE
   ============================================================ */
/* v2 : les graphiques (graduations, grilles, valeurs) sont refondus. Les snapshots v1
   contiennent d'anciens SVG devenues obsolètes ; on ne les restaure plus — une nouvelle
   enquête démarre, l'ancienne sauvegarde du document d'origine reste intacte. */
const STORAGE_KEY = 'crumble_hall_state_v2';
const LEGACY_STORAGE_KEYS = ['crumble_hall_state_v1'];
const SNAPSHOT_VERSION = 2;

function hasLegacySnapshot(){
  try{
    return LEGACY_STORAGE_KEYS.some(function(k){ return !!localStorage.getItem(k); });
  } catch(e){ return false; }
}

function buildSnapshot(){
  return {
    version: SNAPSHOT_VERSION,
    savedAt: Date.now(),
    scenarioIndex: SCENARIOS.indexOf(SC),
    steps: STEPS.map(function(s){ return { n: s.n, propositions: s.propositions }; }),
    state: {
      current: state.current,
      maxUnlocked: state.maxUnlocked,
      completed: Array.from(state.completed),
      allAnswers: state.allAnswers,
      partialSelections: state.partialSelections,
      stepStartTime: state.stepStartTime
    }
  };
}

function loadSnapshot(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return null;
    const obj = JSON.parse(raw);
    if(!obj || obj.version !== SNAPSHOT_VERSION) return null;
    return obj;
  } catch(e){ return null; }
}

function saveSnapshot(){
  try {
    const snap = buildSnapshot();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snap));
    flashSaveIndicator();
  } catch(e){
    console.warn('Sauvegarde impossible :', e);
  }
}

function restoreState(savedState){
  if(!savedState) return;
  state.current = savedState.current || 1;
  state.maxUnlocked = savedState.maxUnlocked || 1;
  state.completed = new Set(savedState.completed || []);
  state.allAnswers = savedState.allAnswers || {};
  state.partialSelections = savedState.partialSelections || {};
  state.stepStartTime = {};
  state.built = new Set();
  if(state.current > state.maxUnlocked) state.maxUnlocked = state.current;
  if(state.completed.has(17) && state.maxUnlocked < 24) state.maxUnlocked = 24;
}

let flashTimer = null;
function flashSaveIndicator(customMsg){
  const el = document.getElementById('saveIndicator');
  if(!el) return;
  el.textContent = customMsg || ('💾 Sauvegardé à ' + new Date().toLocaleTimeString('fr-FR'));
  el.classList.add('flash');
  clearTimeout(flashTimer);
  flashTimer = setTimeout(function(){
    el.classList.remove('flash');
    el.textContent = '💾 Sauvegarde automatique active';
  }, 2200);
}

function setupPersistenceButtons(){
  const topToolbar = document.getElementById('topToolbar');
  if(!topToolbar) return;
  const container = document.createElement('div');
  container.className = 'persistence-bar';
  container.innerHTML =
    '<button class="footer-btn" type="button" onclick="openPedagoModal()">📖 Mode d\'emploi</button>' +
    '<button class="footer-btn" id="btnExport" type="button">💾 Exporter en .json</button>' +
    '<button class="footer-btn" id="btnImport" type="button">📂 Charger un .json</button>' +
    '<button class="footer-btn" id="btnReset" type="button">🔄 Réinitialiser</button>' +
    '<button class="footer-btn" id="btnCopyright" type="button">⚖️ Droits d\'auteur</button>' +
    '<span class="save-indicator" id="saveIndicator">💾 Sauvegarde automatique active</span>' +
    '<input type="file" id="importFile" accept=".json,application/json" style="display:none">';
  topToolbar.appendChild(container);

  document.getElementById('btnExport').addEventListener('click', exportJSON);
  document.getElementById('btnImport').addEventListener('click', function(){ document.getElementById('importFile').click(); });
  document.getElementById('importFile').addEventListener('change', importJSON);
  document.getElementById('btnReset').addEventListener('click', resetProgress);
}

function exportJSON(){
  const snap = buildSnapshot();
  const blob = new Blob([JSON.stringify(snap, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  a.href = url;
  a.download = 'crumble-hall-progression-' + dateStr + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
  flashSaveIndicator('📤 Fichier .json exporté');
}

function importJSON(e){
  const file = e.target.files && e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(ev){
    try {
      const data = JSON.parse(ev.target.result);
      if(!data || data.version !== SNAPSHOT_VERSION || data.scenarioIndex == null || !SCENARIOS[data.scenarioIndex]){
        alert('Fichier invalide ou version incompatible.');
        return;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      location.reload();
    } catch(err){
      alert('Erreur de lecture du fichier : ' + err.message);
    }
  };
  reader.readAsText(file);
}

function resetProgress(){
  if(!confirm('Réinitialiser toute la progression ? Cette action est irréversible.')) return;
  try { localStorage.removeItem(STORAGE_KEY); } catch(e){}
  location.reload();
}

