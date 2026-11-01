/* ============================================================
   12. NAVIGATION
   ============================================================ */
function showStep(n){
  if(n < 1 || n > 24) return;
  if(n > state.maxUnlocked) return;
  ensureStepBuilt(n);
  document.querySelectorAll('.step').forEach(function(c){ c.classList.remove('active'); });
  document.getElementById('step-' + n).classList.add('active');
  state.current = n;
  if(!state.stepStartTime[n]) state.stepStartTime[n] = Date.now();
  renderMenu(); updateProgress();
  typeset(document.getElementById('step-' + n));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  saveSnapshot();
}
function updateProgress(){ const total = 17; progLabel.textContent = 'Étape ' + Math.min(state.current, 17) + ' / ' + total + ' — ' + Math.min(state.completed.size, 17) + ' validée' + (state.completed.size > 1 ? 's' : ''); progBar.style.width = ((Math.min(state.completed.size, 17) / total) * 100) + '%'; }

