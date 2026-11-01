/* ============================================================
   14. VALIDATION
   ============================================================ */
function applyValidationVisuals(step, card, rows, successes){
  card.querySelectorAll('.prop-choices input').forEach(function(el){ el.disabled = true; });
  rows.forEach(function(r, idx){
    const id = propId(step.n, idx);
    const input = card.querySelector('input[name="' + id + '"][value="' + r.given + '"]');
    if(input) input.checked = true;
    const itemEl = card.querySelector('#item-' + id);
    if(itemEl) itemEl.classList.add(r.ok ? 'correct-reveal' : 'incorrect-reveal');
    const resEl = card.querySelector('#res-' + id);
    if(resEl){
      resEl.classList.add('show', r.ok ? 'ok' : 'no');
      const expectedLabel = r.correct ? 'VRAI' : 'FAUX';
      const givenLabel = r.given === 'vrai' ? 'VRAI' : 'FAUX';
      const lawLine = r.ok
        ? 'Loi de Bernoulli du jugement ' + r.i + ' : $X_{' + r.i + '} \\sim \\mathcal{B}(1\\,;\\,\\tfrac{1}{2})$ — favorable : $X_{' + r.i + '} = 1$ (succès)'
        : 'Loi de Bernoulli du jugement ' + r.i + ' : $X_{' + r.i + '} \\sim \\mathcal{B}(1\\,;\\,\\tfrac{1}{2})$ — défavorable : $X_{' + r.i + '} = 0$ (échec)';
      resEl.innerHTML = '<div><strong>Attendu :</strong> ' + expectedLabel + ' · <strong>Votre réponse :</strong> ' + givenLabel + ' · ' + (r.ok ? '✓ Succès' : '✗ Échec') + '</div><div class="law-line">' + lawLine + '</div>';
    }
  });
  const btn = card.querySelector('.btn-verif');
  if(btn){ btn.disabled = true; btn.textContent = 'Jugements enregistrés ✔'; }
  const reveal = card.querySelector('.reveal');
  if(reveal){
    reveal.classList.add('show');
    reveal.innerHTML = buildRevealContent(step, rows, successes);
    typeset(reveal);
    const nextBtn = reveal.querySelector('.btn-next:not([onclick])');
    if(nextBtn && step.n < 17){
      nextBtn.addEventListener('click', function(){ if(step.n + 1 <= STEPS.length) showStep(step.n + 1); });
    }
  }
  card.classList.add('done');
  const badge = card.querySelector('.badge');
  if(badge) badge.textContent = '✔ Validée';
}

function buildRevealContent(step, rows, successes){
  const n = rows.length;
  const scoreHTML = '<div class="summary"><p class="score">Score : ' + successes + ' succès sur ' + n + ' jugements</p><p class="calc">Chaque jugement est une <strong>épreuve de Bernoulli</strong> à deux issues. Le nombre total de succès $S = \\sum_{i=1}^{' + n + '} X_i$ suit une loi binomiale si les jugements sont supposés indépendants.</p></div>';
  const diag = analyzeStep(step.n);
  const diagHTML = diag ? `
    <div class="box" style="background:#f4f9fd;border-left:5px solid var(--blue);">
      <span class="lbl" style="color:var(--blue);">🔍 Diagnostic de l'étape</span>
      <ul style="margin:6px 0;padding-left:20px;">
        <li><strong>Temps :</strong> ${fr(diag.perQ,1)} s/q vs [${diag.tMin}–${diag.tMax}] →
            ${diag.timeZone==='fast'?'⏩ trop rapide':diag.timeZone==='slow'?'🐢 trop lent':'⏱ dans l\'intervalle'}
            ${diag.timePenalty>0?` (pénalité −${fr(diag.timePenalty*100,0)} %)`:''}</li>
        <li><strong>Pattern :</strong> ${diag.runs} runs (attendu ≈ ${fr(diag.expectedRuns,1)}), z = ${fr(diag.zRuns,2)} →
            P(hasard) ≈ ${fr(diag.pRandom*100,0)} % (${diag.randomLabel})</li>
        <li><strong>Incohérences croisées :</strong> ${diag.incoherences}/${diag.nPairs}${diag.incoherences>0?` (pénalité −${fr(diag.cohPenalty*100,0)} %)`:''}</li>
        <li><strong>Pénalité totale :</strong> −${fr(diag.stepPenalty,1)} points → score ajusté ${fr(diag.adjustedScore,1)}/${diag.nQ}</li>
      </ul>
    </div>` : '';
  const tableHTML = buildFeedbackTable(step, rows);
  const pTotal = Math.pow(0.5, n);
  const conclusionHTML = '<div class="conclusion-box"><h4>Application</h4><p>La probabilité que toutes les réponses soient justes par hasard vaut $\\left(\\tfrac{1}{2}\\right)^{' + n + '} = \\dfrac{1}{' + Math.pow(2, n) + '}$ :</p><div class="final-param">$p_{\\text{tout juste}} = \\left(\\tfrac{1}{2}\\right)^{' + n + '}$<span class="big">≈ ' + fr(pTotal, 6) + '</span></div><div class="n-variation-note">💡 Le nombre de propositions varie d\'une étape à l\'autre ($10$ à $20$). Plus il y a de propositions, plus il est difficile d\'avoir tout juste par hasard.</div></div>';
  return '<div class="reveal-title">Ce que vous venez d\'établir</div>' + scoreHTML + diagHTML + tableHTML + (step.synthese || '') + conclusionHTML + (step.n < STEPS.length ? '<button class="btn-next" type="button">Étape suivante →</button>' : '') + (step.n === 17 ? '<button class="btn-next" type="button" onclick="showStep(18)">📊 Bilan complet →</button><button class="btn-next" type="button" onclick="showStep(23)" style="background:var(--blue); box-shadow:0 3px 0 #16294a;">✍️ Rédaction type →</button>' : '');
}

function validateStep(step, card){
  const n = step.propositions.length;
  const answers = [];
  let missing = false;
  for(let i = 0; i < n; i++){
    const id = propId(step.n, i);
    const sel = card.querySelector('input[name="' + id + '"]:checked');
    if(!sel) missing = true;
    answers.push(sel ? sel.value : null);
  }
  const fbEl = card.querySelector('.step-fb');
  if(missing){ fbEl.className = 'fb step-fb no'; fbEl.innerHTML = 'Il reste des propositions sans jugement.'; return; }
  let successes = 0;
  const rows = [];
  step.propositions.forEach(function(p, i){
    const given = answers[i];
    const ok = (given === (p.correct ? 'vrai' : 'faux'));
    if(ok) successes++;
    rows.push({ i: i+1, texte: p.texte, correct: p.correct, justif: p.justif, given: given, ok: ok });
  });
  const startTime = state.stepStartTime[step.n] || Date.now();
  const timeMs = Math.max(1000, Date.now() - startTime);
  state.allAnswers[step.n] = { notion: step.notion, rows: rows, score: successes, total: n, timeMs: timeMs };
  state.completed.add(step.n);
  if(step.n + 1 <= STEPS.length){ state.maxUnlocked = Math.max(state.maxUnlocked, step.n + 1); }
  if(step.n === 17){ state.maxUnlocked = 24; }
  if(state.partialSelections[step.n]) delete state.partialSelections[step.n];
  applyValidationVisuals(step, card, rows, successes);
  renderMenu();
  updateProgress();
  saveSnapshot();
  const summary = card.querySelector('.summary');
  if(summary){ setTimeout(function(){ summary.scrollIntoView({ behavior:'smooth', block:'start' }); }, 300); }
}

