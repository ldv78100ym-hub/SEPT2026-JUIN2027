/* ============================================================
   18. INIT
   ============================================================ */
(function init(){
  const snap = loadSnapshot();
  let restored = false;
  if(snap){
    SC = SCENARIOS[snap.scenarioIndex];
    buildSTEPS(snap);
    restoreState(snap.state);
    restored = true;
  } else {
    SC = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
    buildSTEPS(null);
  }

  document.title = SC.lieu + ' — La loi binomiale, enquête en dix-sept pièces';
  document.querySelectorAll('header.hero h1').forEach(function(el){ el.textContent = SC.lieu; });
  document.querySelectorAll('header.hero .kicker').forEach(function(el){ el.textContent = 'Une enquête statistique à ' + SC.lieu; });

  document.getElementById('pageFooter').innerHTML =
    '« À ' + SC.lieu + ', on ne croit pas aux statistiques. On croit au thé. Mais les deux se trompent rarement. »<br>— ' + SC.majordome + ', majordome de ' + SC.seigneur + '.';

  setupPersistenceButtons();
  setupCopyrightModal();
  setupTermPanel();

  for(let n = 1; n <= 24; n++){
    const card = document.createElement('section');
    card.className = 'step';
    card.id = 'step-' + n;
    storyEl.appendChild(card);
  }

  ensureStepBuilt(state.current);
  document.getElementById('step-' + state.current).classList.add('active');
  state.stepStartTime[state.current] = Date.now();
  renderMenu();
  updateProgress();
  typeset(document.getElementById('step-' + state.current));

  saveSnapshot();
  if(restored){
    flashSaveIndicator('💾 Progression restaurée');
  } else if(hasLegacySnapshot()){
    flashSaveIndicator('🔧 Document mis à jour (graphiques gradués) : nouvelle enquête !');
  } else {
    flashSaveIndicator('💾 Nouvelle partie — sauvegarde initiale');
  }

  setupPedagoModal();
})();
