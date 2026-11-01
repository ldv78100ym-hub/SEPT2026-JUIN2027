/* ============================================================
   13. FEEDBACK TABLE
   ============================================================ */
function buildFeedbackTable(step, rows){
  let tbody = '';
  rows.forEach(function(r){
    const rowClass = r.ok ? 'row-ok' : 'row-no';
    const resBadge = r.ok ? '<span class="badge-ok">✓ Succès</span><br><span style="font-size:.72rem; color:#065f46;">$X_{' + r.i + '}=1$</span>' : '<span class="badge-no">✗ Échec</span><br><span style="font-size:.72rem; color:#991b1b;">$X_{' + r.i + '}=0$</span>';
    const attClass = r.correct ? 'att-vrai' : 'att-faux';
    const attLabel = r.correct ? 'VRAI' : 'FAUX';
    const givLabel = r.given === 'vrai' ? 'VRAI' : 'FAUX';
    tbody += '<tr class="' + rowClass + '"><td class="col-n">' + r.i + '</td><td class="col-prop">' + r.texte + '</td><td class="col-att ' + attClass + '">' + attLabel + '</td><td class="col-giv">' + givLabel + '</td><td class="col-res">' + resBadge + '</td><td class="col-just">' + r.justif + '</td></tr>';
  });
  const n = rows.length;
  const successes = rows.filter(function(r){ return r.ok; }).length;
  const failures = n - successes;
  return '<div class="feedback-wrap"><h4>📋 Tableau récapitulatif</h4><table class="feedback-table"><thead><tr><th class="col-n">N°</th><th class="col-prop">Proposition</th><th class="col-att">Attendu</th><th class="col-giv">Votre réponse</th><th class="col-res">Résultat</th><th class="col-just">Justification</th></tr></thead><tbody>' + tbody + '</tbody><tfoot><tr><td colspan="4">Bilan</td><td colspan="2"><span class="big">✓ ' + successes + '</span> succès · <span class="big">✗ ' + failures + '</span> échec' + (failures > 1 ? 's' : '') + ' — ' + fr(successes / n * 100, 1) + ' % de réussite</td></tr></tfoot></table></div>';
}

