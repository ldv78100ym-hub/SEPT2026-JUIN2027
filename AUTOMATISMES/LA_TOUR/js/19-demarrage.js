/* ============================================================
   8. INIT
   ============================================================ */
makeStars();
resizeCanvas();
updateHUD();
draw();

qText.innerHTML = `Bienvenue dans la tour.<br><br>Prêt à valider les
  \\(${N_TOT}\\) notions du programme ?`;

$('startBtn').addEventListener('click', tdmShowIdentity);
$('idGo').addEventListener('click', tdmConfirmIdentity);
/* Mise en forme imposée pendant la frappe :
   NOM → majuscules, prénom(s) → minuscules sauf initiales, CLASSE → majuscules. */
tdmCaseHook($('inpNom'), tdmNormUpper);
tdmCaseHook($('inpPrenom'), tdmCasePrenom);
tdmCaseHook($('inpClasse'), tdmNormUpper);
$('importInput').addEventListener('change', tdmOnImportFile);
$('passBtn').addEventListener('click', passCurrentNotion);
$('passedBtn').addEventListener('click', openPassedPanel);
$('passedClose').addEventListener('click', closePassedPanel);
$('saveBtn').addEventListener('click', () => tdmExport(false));

/* ---- Menu utilitaire (hamburger en haut à droite) ---- */
const utilToggle = $('utilToggle'), utilMenu = $('utilMenu');
function closeUtilMenu(){
  utilMenu.classList.remove('open');
  utilToggle.classList.remove('open');
  utilToggle.setAttribute('aria-expanded', 'false');
}
function toggleUtilMenu(){
  const open = utilMenu.classList.toggle('open');
  utilToggle.classList.toggle('open', open);
  utilToggle.setAttribute('aria-expanded', String(open));
  /* Date & heure de la dernière mise à jour : rafraîchies à chaque
     ouverture du menu (et après chaque sauvegarde, via tdmSaveNow). */
  if(open && typeof tdmRefreshMaj === 'function') tdmRefreshMaj();
}
utilToggle.addEventListener('click', e => { e.stopPropagation(); toggleUtilMenu(); });
utilMenu.addEventListener('click', e => { if (e.target.closest('.copyright-btn')) closeUtilMenu(); });
document.addEventListener('click', e => {
  if (utilMenu.classList.contains('open') &&
      !utilMenu.contains(e.target) && !utilToggle.contains(e.target)) closeUtilMenu();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeUtilMenu(); });
typesetAll();
tdmBoot();
/* Date & heure de la dernière mise à jour (menu utilitaire), dès le
   démarrage : reprise de sauvegarde éventuelle. */
if(typeof tdmRefreshMaj === 'function') tdmRefreshMaj();
