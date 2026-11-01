/* ============================================================
   11. RENDU ÉTAPE
   ============================================================ */
function renderStepHTML(step){
  const n = step.propositions.length;
  let propsHTML = '';
  step.propositions.forEach(function(p, i){
    const id = propId(step.n, i);
    propsHTML += '<div class="prop-item" id="item-' + id + '"><div class="prop-question"><span class="prop-num">' + (i+1) + '</span><span class="prop-text">' + p.texte + '</span></div><div class="prop-choices"><label class="opt-vf vrai"><input type="radio" name="' + id + '" value="vrai"><span>VRAI</span></label><label class="opt-vf faux"><input type="radio" name="' + id + '" value="faux"><span>FAUX</span></label></div><div class="prop-result" id="res-' + id + '"></div></div>';
  });
  return '<div class="step-head"><span class="step-num">' + step.n + '</span><div><h2>' + step.notion + '</h2><p class="notion">Étape ' + step.n + ' · ' + SC.lieu + ' · ' + n + ' jugements</p></div><span class="badge">' + (step.n === STEPS.length ? 'Fin' : 'À juger') + '</span></div><div class="step-body">' + step.intro + '<div class="prop-list">' + propsHTML + '</div><div class="counter-note" id="counter-' + step.n + '">0 / ' + n + ' propositions jugées</div><button class="btn-verif" type="button">Valider mes jugements</button><div class="fb step-fb"></div></div><div class="reveal"></div>';
}

function updateCounter(step, card){ const n = step.propositions.length; let count = 0; for(let i = 0; i < n; i++){ if(card.querySelector('input[name="' + propId(step.n, i) + '"]:checked')) count++; } const el = card.querySelector('#counter-' + step.n); if(el) el.textContent = count + ' / ' + n + ' propositions jugées'; }

function ensureStepBuilt(n){
  if(state.built.has(n)) return;
  if(n === 18){
    const card = document.getElementById('step-18'); if(!card) return;
    card.innerHTML = '<div class="step-head"><span class="step-num">📊</span><div><h2>Bilan complet de l\'enquête</h2><p class="notion">Synthèse · ' + SC.lieu + '</p></div><span class="badge">3 volets</span></div>' + getBilan();
    typeset(card); state.built.add(n); return;
  }
  if(n >= 19 && n <= 24){
    const card = document.getElementById('step-' + n); if(!card) return;
    const titles = { 19:['Volet 1 — Cours classique','Cours complet · Loi binomiale'], 20:['Volet 2 — Tableaux synthétiques','Cours · Tableaux'], 21:['Volet 3 — Carte mentale','Cours · Carte mentale'], 22:['Volet 4 — Graphe des liens','Cours · Graphe interactif'], 23:['Volet 5 — Rédaction type des réponses','Cours · Rédaction type'], 24:['Volet 6 — Index alphabétique','Cours · Index'] };
    const content = n === 19 ? getVolet1() : n === 20 ? getVolet2() : n === 21 ? getVolet3() : n === 22 ? getVolet4() : n === 23 ? getVoletRedaction() : getVoletIndex();
    card.innerHTML = '<div class="step-head"><span class="step-num">📚</span><div><h2>' + titles[n][0] + '</h2><p class="notion">' + titles[n][1] + '</p></div><span class="badge">Cours</span></div>' + courseNav() + content;
    typeset(card); state.built.add(n); bindCourseLinks(card); return;
  }
  const step = STEPS.find(function(s){ return s.n === n; }); if(!step) return;
  const card = document.getElementById('step-' + n); if(!card) return;
  card.innerHTML = renderStepHTML(step);
  if(state.partialSelections && state.partialSelections[n]){
    const sel = state.partialSelections[n];
    Object.keys(sel).forEach(function(name){
      const value = sel[name];
      const inp = card.querySelector('input[name="' + name + '"][value="' + value + '"]');
      if(inp) inp.checked = true;
    });
    updateCounter(step, card);
  }
  if(state.allAnswers[n]){
    applyValidationVisuals(step, card, state.allAnswers[n].rows, state.allAnswers[n].score);
  } else {
    const btn = card.querySelector('.btn-verif');
    btn.addEventListener('click', function(){ validateStep(step, card); });
    card.querySelectorAll('.prop-choices input').forEach(function(inp){
      inp.addEventListener('change', function(){
        updateCounter(step, card);
        if(!state.partialSelections[step.n]) state.partialSelections[step.n] = {};
        state.partialSelections[step.n][inp.name] = inp.value;
        saveSnapshot();
      });
    });
  }
  typeset(card); state.built.add(n);
}

function bindCourseLinks(card){ card.querySelectorAll('.course-nav a').forEach(function(a){ a.addEventListener('click', function(e){ e.preventDefault(); showStep(parseInt(a.getAttribute('data-course'), 10)); }); }); }

