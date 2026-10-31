/* ============================================================
   7ter. RÉINITIALISATION COMPLÈTE (menu hamburger)
   ============================================================ */
/* TDM-RESET-START */
/* Écran d'accueil d'origine : win() REMPLACE le contenu de la boîte
   d'accueil (écran de victoire + REJOUER) ; la réinitialisation doit
   pouvoir restaurer l'écran de premier lancement, bouton inclus. */
const TDM_WELCOME_HTML = $('overlayBox').innerHTML;
let TDM_EPOCH = 0;
/* Animations différées liées à la partie en cours : après une
   réinitialisation, l'incrément d'époque annule tous les rappels encore
   en attente (fin de chute, nouvelle question, ascension finale,
   victoire, fin d'animation de porte). */
function tdmLater(fn, ms){
  const ep = TDM_EPOCH;
  setTimeout(() => { if(ep === TDM_EPOCH) fn(); }, ms);
}
const resetModal = $('resetModal');
function openResetModal(){
  lastFocus = document.activeElement;
  resetModal.classList.add('open');
  resetModal.setAttribute('aria-hidden', 'false');
  $('resetCancel').focus();
}
function closeResetModal(){
  resetModal.classList.remove('open');
  resetModal.setAttribute('aria-hidden', 'true');
  if(lastFocus && lastFocus.focus) lastFocus.focus();
}
function tdmResetAll(){
  /* 1. Sauvegarde locale et identité effacées de cet appareil. */
  [TDM_LS_SAVE, TDM_LS_PROFILE, TDM_LS_KEYS].forEach(k => {
    try { localStorage.removeItem(k); } catch(e) {}
  });
  SAV.keys = null; SAV.data = null; SAV.lastEnv = null;
  /* 2. Partie en cours annulée : les rappels différés ne s'exécutent plus. */
  TDM_EPOCH++;
  /* 3. État remis à zéro, comme au tout premier lancement. */
  state.floor = 0; state.maxBuiltFloor = 0; state.visualFloor = 0;
  state.errors = 0; state.elapsed = 0; state.playing = false;
  state.validated.clear(); state.passed.clear();
  NOTIONS.forEach(n => { n.prob = 0.5; n.okRun = 0; });
  state.currentNotion = null; state.lastGen = null;
  state.lessonActive = false; state.doorFloor = -1; state.doorProgress = 0;
  state.pendingError = null; state.falling = false; state.finalAscent = false;
  state.particles = []; state.notionStreak = {}; state.genStreak = {};
  state.autoRotate = true;
  state.camY = (0 + 1) * HH - 1.6;
  /* 4. Champs d'identité vidés : aucun préremplissage ne doit revenir. */
  $('inpNom').value = ''; $('inpPrenom').value = ''; $('inpClasse').value = '';
  $('idMsg').textContent = '';
  /* 5. Écran d'accueil d'origine restauré et affiché. */
  $('overlayBox').innerHTML = TDM_WELCOME_HTML;
  $('startBtn').addEventListener('click', tdmShowIdentity);
  $('overlay').classList.remove('hidden');
  lessonPanel.classList.remove('open'); resetLessonPos();
  $('idPanel').classList.add('hidden');
  $('passedPanel').classList.remove('open');
  closeNotions(); closeCopyright(); closeResetModal(); closeUtilMenu();
  qText.innerHTML = `Bienvenue dans la tour.<br><br>Prêt à valider les
    \\(${N_TOT}\\) notions du programme ?`;
  opts.innerHTML = '';
  feedback.className = ''; feedback.textContent = '';
  updateHUD(); updateTimeDisplay(); typesetAll();
}
$('resetBtn').addEventListener('click', openResetModal);
$('resetClose').addEventListener('click', closeResetModal);
$('resetCancel').addEventListener('click', closeResetModal);
$('resetGo').addEventListener('click', tdmResetAll);
resetModal.addEventListener('click', e => {
  if(e.target === resetModal) closeResetModal();
});
/* TDM-RESET-END */

