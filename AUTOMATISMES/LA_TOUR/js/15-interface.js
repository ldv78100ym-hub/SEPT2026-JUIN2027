/* ============================================================
   6. MATHJAX & LOGIQUE UI
   ============================================================ */
function typeset(els){
  if(window.MathJax && MathJax.typesetPromise){
    MathJax.typesetPromise(els).catch(()=>{});
  } else {
    setTimeout(()=>typeset(els), 160);
  }
}
function typesetAll(){
  if(window.MathJax && MathJax.typesetPromise){
    MathJax.typesetPromise().catch(()=>{});
  } else {
    setTimeout(typesetAll, 120);
  }
}

function updateHUD(){
  vNotions.textContent = `${state.validated.size} / ${N_TOT}`;
  vFloor.textContent = `${Math.min(state.floor+1, N_TOT)} / ${N_TOT}`;
  vErr.textContent = state.errors;
  vPassed.textContent = state.passed ? state.passed.size : 0;
  barFill.style.width = (state.validated.size / N_TOT * 100) + '%';
  if(state.finalAscent){
    themeLbl.textContent = '🎉 Ascension finale !';
  } else if(state.currentNotion){
    themeLbl.textContent = state.currentNotion.name;
  } else {
    themeLbl.textContent = '—';
  }
}

function updateTimeDisplay(){
  const m = Math.floor(state.elapsed/60), s = state.elapsed%60;
  vTime.textContent = `${m}:${String(s).padStart(2,'0')}`;
}
setInterval(() => {
  if(state.playing && !state.lessonActive && !state.finalAscent){
    state.elapsed++;
    updateTimeDisplay();
  }
}, 1000);

function pickNotion(){
  /* Les notions VALIDÉES restent dans le tirage (révision espacée) : elles
     reviennent moins souvent — au minimum 5 %, plancher atteignable seulement
     après 8 apparitions systématiquement justes. Seules les notions
     « passées » (mises de côté) sont exclues du tirage.
     RÉVISION PERSONNALISÉE : quand une sélection de notions est active
     (state.customPool), le tirage s'y RESTREINT — mêmes règles de
     probabilités et de notions passées, mais uniquement dans le menu
     choisi pour la session. */
  const pool = NOTIONS.filter(n => !state.passed.has(n.id)
    && (!state.customPool || state.customPool.has(n.id)));
  if(pool.length === 0) return null;

  let totalWeight = 0;
  pool.forEach(n => { totalWeight += n.prob; });

  let r = Math.random() * totalWeight;
  for(const n of pool){
    r -= n.prob;
    if(r <= 0) return n;
  }
  return pool[0];
}

function newQuestion(){
  if(state.finalAscent) return;
  const notion = pickNotion();
  if(!notion){
    // Plus aucune notion disponible : celles qui restent sont « passées ».
    qText.innerHTML = state.passed.size
      ? 'Toutes les notions restantes ont été mises de côté.'
      : 'Prêt à démarrer ?';
    opts.innerHTML = '';
    feedback.className = 'fb-bad';
    feedback.textContent = state.passed.size
      ? '⏭ Active une notion passée dans la modale pour continuer l’ascension.'
      : '';
    state.currentNotion = null;
    if(state.passed.size) openPassedPanel();
    updateHUD();
    return;
  }
  state.currentNotion = notion;
  let genName, guard = 0;
  do {
    genName = pick(notion.g);
    guard++;
  } while(genName === state.lastGen && notion.g.length > 1 && guard < 20);
  state.lastGen = genName;
  const q = GEN[genName]();
  q._notionId = notion.id;
  renderQuestion(q);
  updateHUD();
}

function renderQuestion(q){
  document.getElementById('card').scrollTop = 0;   // chaque question repart du haut de la carte
  feedback.textContent = '';
  feedback.className = '';
  if(q.trou){ renderTrou(q); return; }
  opts.className = '';
  qText.innerHTML = q.prompt;
  opts.innerHTML = '';
  q.options.forEach((o, idx) => {
    const b = document.createElement('button');
    b.className = 'opt' + (q.multi ? ' multi' : '');
    b.innerHTML = q.multi ? '<span class="chk"></span><span class="lbl">' + o.t + '</span>' : o.t;
    b.addEventListener('click', () => q.multi ? toggleMultiSel(b) : handleAnswer(idx, q));
    opts.appendChild(b);
  });
  if (q.multi) {
    const v = document.createElement('button');
    v.className = 'opt validate';
    v.id = 'validerBtn';
    v.innerHTML = 'Valider ✓';
    v.addEventListener('click', () => submitMulti(q));
    opts.appendChild(v);
  }
  typeset([qText, opts]);
}

/* ---- Raisonnements à trous : mots-clés à glisser-coller ---- */
let trouSelected = null;

function renderTrou(q){
  opts.className = 'bank-mode';
  const slots = q.corps.replace(/\{\{(\d+)\}\}/g, (m,i) =>
    `<span class="blank" data-slot="${i}" title="Clique pour placer ou retirer un mot-clé"></span>`);
  qText.innerHTML =
    `<div class="trou-note">🧩 <b>Raisonnement à trous</b> — clique un mot-clé puis un trou
     (ou glisse-le). Un même mot peut combler plusieurs trous ; certains mots ne servent
     à rien, veulent te piéger… ou sont totalement LOUFOQUES — une clé sans aucun
     sens dans le contexte vaut la chute MAXIMALE !</div>` + q.prompt +
    `<div class="raisonnement">${slots}</div>`;
  opts.innerHTML = '';
  trouSelected = null;
  q.bank.forEach(w => {
    const c = document.createElement('button');
    c.className = 'chip';
    c.type = 'button';
    c.textContent = w;
    c.draggable = true;
    c.addEventListener('click', () => selectChip(c));
    c.addEventListener('dragstart', e => {
      try { e.dataTransfer.setData('text/plain', w); } catch(err) {}
    });
    opts.appendChild(c);
  });
  const v = document.createElement('button');
  v.className = 'opt validate trou-validate';
  v.type = 'button';
  v.innerHTML = 'Valider ✓';
  v.addEventListener('click', () => submitTrou(q));
  opts.appendChild(v);
  qText.querySelectorAll('.blank').forEach(b => {
    b.addEventListener('click', () => {
      if(b.classList.contains('locked')) return;
      if(trouSelected){
        b.textContent = trouSelected.textContent;
        b.classList.add('filled');
        selectChip(null);
      } else if(b.classList.contains('filled')){
        b.textContent = '';
        b.classList.remove('filled');
      }
    });
    b.addEventListener('dragover', e => { e.preventDefault(); b.classList.add('over'); });
    b.addEventListener('dragleave', () => b.classList.remove('over'));
    b.addEventListener('drop', e => {
      e.preventDefault();
      b.classList.remove('over');
      if(b.classList.contains('locked')) return;
      const w = e.dataTransfer.getData('text/plain');
      if(w){ b.textContent = w; b.classList.add('filled'); }
    });
  });
  typeset([qText, opts]);
}

function selectChip(c){
  if(trouSelected) trouSelected.classList.remove('sel');
  trouSelected = (c && trouSelected !== c) ? c : null;
  if(trouSelected) trouSelected.classList.add('sel');
}

/* Analyse numérique d'une clé : entiers, décimaux (virgule ou point),
   fractions « a/b ». Renvoie null si la clé n'est pas un nombre. */
function tdmParseNumCle(s){
  let t = String(s || '').trim().replace(/\s+/g, '');
  if(!t) return null;
  if(t.indexOf(',') >= 0 && t.indexOf('.') >= 0) t = t.replace(',', '');
  t = t.replace(',', '.');
  const frac = t.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
  if(frac){
    const d = parseFloat(frac[2]);
    return d === 0 ? null : parseFloat(frac[1]) / d;
  }
  if(/^-?\d+(?:\.\d+)?$/.test(t)) return parseFloat(t);
  return null;
}
/* Une clé placée dans un trou est LOUFOQUE si c'est :
   1. un mot globalement absurde (LOUFOQUES : pamplemousse, hippogriffe…) ;
   2. un mot déclaré loufoque dans le contexte de CET exercice (q.loufoques),
      car il n'y a clairement aucun sens ici (ex. « hypoténuse » dans un
      raisonnement sur le cercle trigonométrique) ;
   3. dans un exercice de probabilités (q.probaNums), une valeur numérique
      négative ou strictement supérieure à 1 : une probabilité vit dans [0;1].
   Une confusion plausible (« médiatrice » pour « bissectrice ») n'est PAS
   loufoque : c'est une erreur ordinaire. */
function tdmCleLoufoque(q, blanks){
  return blanks.some(b => {
    const w = b.textContent.trim();
    if(LOUFOQUES.indexOf(w) >= 0) return true;
    if(q.loufoques && q.loufoques.indexOf(w) >= 0) return true;
    if(q.probaNums){
      const v = tdmParseNumCle(w);
      if(v !== null && (v < 0 || v > 1)) return true;
    }
    return false;
  });
}
function submitTrou(q){
  const blanks = [...qText.querySelectorAll('.blank')];
  if(blanks.some(b => !b.classList.contains('filled'))){
    feedback.className = 'fb-bad';
    feedback.textContent = '✛ Place un mot-clé dans chaque trou avant de valider.';
    return;
  }
  const ok = blanks.every(b => b.textContent.trim() === q.answers[+b.dataset.slot]);
  blanks.forEach(b => {
    b.classList.add('locked');
    b.classList.add(b.textContent.trim() === q.answers[+b.dataset.slot] ? 'good' : 'bad');
  });
  opts.querySelectorAll('button').forEach(c => c.disabled = true);
  /* Clé LOUFOQUE placée dans un trou — trois cas : mot totalement décalé
     (pamplemousse, hippogriffe…), mot clairement hors-sujet dans CE contexte
     (« hypoténuse » sur le cercle trigonométrique), ou valeur impossible
     (probabilité négative ou > 1) : dans tous les cas, chute maximale,
     expliquée dans la leçon par un grand émoticône outré. */
  q._absurd = !ok && tdmCleLoufoque(q, blanks);
  SAV.logQuestion(q, blanks.map(b => b.textContent), ok);
  resolveAnswer(ok, q);
}

function toggleMultiSel(btn){
  if (btn.disabled) return;
  btn.classList.toggle('sel');
}

function submitMulti(q){
  const btns = [...opts.querySelectorAll('button')];
  const optBtns = btns.slice(0, q.options.length);
  const sel = optBtns.map((b, i) => b.classList.contains('sel') ? i : -1).filter(i => i >= 0);
  if (sel.length === 0) {
    feedback.className = 'fb-bad';
    feedback.textContent = '✛ Cochez au moins une proposition avant de valider.';
    return;
  }
  handleAnswerMulti(sel, q);
}

const lessonPanel = $('lessonPanel');
const lessonTag   = $('lessonTag');
const lessonTitle = $('lessonTitle');
const lessonSub   = $('lessonSub');
const lessonBody  = $('lessonBody');
const lessonCont  = $('lessonContinue');

/* La leçon est DÉPLAÇABLE à la souris : attraper sa barre de titre (⠿) pour
   l'écarter de l'écran et relire l'énoncé de départ en parallèle. */
function resetLessonPos(){
  lessonPanel.classList.remove('moved');
  lessonPanel.style.left = ''; lessonPanel.style.top = ''; lessonPanel.style.bottom = '';
}
(function(){
  let drag = false, dx = 0, dy = 0;
  const top = lessonPanel.querySelector('.lesson-top');
  top.addEventListener('mousedown', function(e){
    const r = lessonPanel.getBoundingClientRect();
    lessonPanel.style.left = r.left + 'px';
    lessonPanel.style.top  = r.top + 'px';
    lessonPanel.style.bottom = 'auto';
    lessonPanel.classList.add('moved');
    dx = e.clientX - r.left; dy = e.clientY - r.top;
    drag = true; document.body.style.cursor = 'grabbing';
    e.preventDefault();
  });
  window.addEventListener('mousemove', function(e){
    if(!drag) return;
    const r = lessonPanel.getBoundingClientRect();
    let nx = Math.max(6, Math.min(e.clientX - dx, window.innerWidth  - r.width  - 6));
    let ny = Math.max(6, Math.min(e.clientY - dy, window.innerHeight - 64));
    lessonPanel.style.left = nx + 'px';
    lessonPanel.style.top  = ny + 'px';
  });
  window.addEventListener('mouseup', function(){
    if(!drag) return;
    drag = false; document.body.style.cursor = '';
  });
})();

/* ——— Animation : construction sur le cercle trigonométrique ———
   sp.fn = 'cos' | 'sin' : résoudre cos x = b ou sin x = b (a est l'inconnue) —
     droite rouge x=b (ou y=b), rayons vers les points d'intersection, arcs solutions.
   sp.fn = 'read' : lire b = cos a et b = sin a sur les axes (b est l'inconnue). */
function TG_ANIM(sp){
  var cx=168, cy=132, r=80, D2R=Math.PI/180, bv=sp.b||0;
  var f1=function(v){ return Math.round(v*10)/10; };
  var PX=function(a){ return f1(cx + r*Math.cos(a*D2R)); };
  var PY=function(a){ return f1(cy - r*Math.sin(a*D2R)); };
  var read = sp.fn === 'read', sinA = sp.fn === 'sin';
  var a1 = sp.a1, a2 = sp.a2 || 0;
  var p1x=PX(a1), p1y=PY(a1), p2x=PX(a2), p2y=PY(a2);
  var m1x=f1(cx+0.58*r*Math.cos(a1/2*D2R)), m1y=f1(cy-0.58*r*Math.sin(a1/2*D2R));
  var m2x=f1(cx+0.58*r*Math.cos(a2/2*D2R)), m2y=f1(cy-0.58*r*Math.sin(a2/2*D2R));
  var bX=f1(cx + r*bv), bY=f1(cy - r*bv);
  var GOLD='#d99a26', RED='#c0392b', GRY='#a08c5a', INK='#4a3f28', AX='#9a8a66';
  var arc=function(a){ return 'M '+cx+' '+cy+' L '+(cx+r)+' '+cy+' A '+r+' '+r+' 0 '+(a>180?1:0)+' 0 '+PX(a)+' '+PY(a); };
  var kf=function(n,p){ return '@keyframes tgaK'+n+'{0%,'+p+'%{opacity:0}'+(p+5)+'%,93%{opacity:1}98%,100%{opacity:0}}'; };
  var S='';
  S += '<div class="ex-section"><h4>🎥 Construction animée sur le cercle trigonométrique</h4>';
  S += '<style>';
  S += kf(1,4)+kf(2,13)+kf(3,23)+kf(4,33)+kf(5,43)+kf(6,53)+kf(7,63);
  S += '@keyframes tgaK8{0%,73%{opacity:0}78%,95%{opacity:1}100%{opacity:0}}';
  S += '.tgaK1{animation:tgaK1 10s linear infinite}.tgaK2{animation:tgaK2 10s linear infinite}';
  S += '.tgaK3{animation:tgaK3 10s linear infinite}.tgaK4{animation:tgaK4 10s linear infinite}';
  S += '.tgaK5{animation:tgaK5 10s linear infinite}.tgaK6{animation:tgaK6 10s linear infinite}';
  S += '.tgaK7{animation:tgaK7 10s linear infinite}.tgaK8{animation:tgaK8 10s linear infinite}';
  S += '</style>';
  S += '<svg viewBox="0 0 336 252" style="width:100%;max-width:336px;background:#faf6ea;border:1px solid #e6dcc3;border-radius:8px">';
  S += '<line x1="'+f1(cx-r-14)+'" y1="'+cy+'" x2="'+f1(cx+r+14)+'" y2="'+cy+'" stroke="'+AX+'" stroke-width="1.5"/>';
  S += '<line x1="'+cx+'" y1="'+f1(cy-r-14)+'" x2="'+cx+'" y2="'+f1(cy+r+14)+'" stroke="'+AX+'" stroke-width="1.5"/>';
  S += '<text x="'+f1(cx+r+8)+'" y="'+(cy-6)+'" font-size="11" fill="'+AX+'">x</text>';
  S += '<text x="'+(cx+6)+'" y="'+f1(cy-r-4)+'" font-size="11" fill="'+AX+'">y</text>';
  S += '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+AX+'" stroke-width="2"/>';
  S += '<text x="'+(cx-11)+'" y="'+(cy+13)+'" font-size="11" fill="'+INK+'">O</text>';
  S += '<text x="'+(cx+r-3)+'" y="'+(cy+14)+'" font-size="11" fill="'+INK+'">I</text>';
  if (read) {
    S += '<g class="tgaK1"><line x1="'+cx+'" y1="'+cy+'" x2="'+p1x+'" y2="'+p1y+'" stroke="'+GOLD+'" stroke-width="3"/><circle cx="'+p1x+'" cy="'+p1y+'" r="4" fill="'+GOLD+'"/></g>';
    S += '<g class="tgaK2"><path d="'+arc(a1)+'" fill="none" stroke="'+GOLD+'" stroke-width="2"/><text x="'+m1x+'" y="'+m1y+'" font-size="12" font-weight="bold" fill="'+GOLD+'" text-anchor="middle">a</text></g>';
    S += '<g class="tgaK3"><line x1="'+p1x+'" y1="'+p1y+'" x2="'+p1x+'" y2="'+cy+'" stroke="'+GRY+'" stroke-width="1.5" stroke-dasharray="4 3"/><line x1="'+cx+'" y1="'+cy+'" x2="'+p1x+'" y2="'+cy+'" stroke="'+RED+'" stroke-width="3"/><text x="'+p1x+'" y="'+(cy+26)+'" font-size="12" font-weight="bold" fill="'+RED+'" text-anchor="middle">b = cos a</text></g>';
    S += '<g class="tgaK4"><line x1="'+p1x+'" y1="'+p1y+'" x2="'+cx+'" y2="'+p1y+'" stroke="'+GRY+'" stroke-width="1.5" stroke-dasharray="4 3"/><line x1="'+cx+'" y1="'+cy+'" x2="'+cx+'" y2="'+p1y+'" stroke="'+RED+'" stroke-width="3"/><text x="'+(cx-7)+'" y="'+(p1y-6)+'" font-size="12" font-weight="bold" fill="'+RED+'" text-anchor="end">b = sin a</text></g>';
  } else {
    if (sinA) S += '<g class="tgaK1"><line x1="'+f1(cx-r)+'" y1="'+bY+'" x2="'+f1(cx+r)+'" y2="'+bY+'" stroke="'+RED+'" stroke-width="2" stroke-dasharray="6 4"/><text x="'+f1(cx+r-4)+'" y="'+(bY-6)+'" font-size="11" font-weight="bold" fill="'+RED+'" text-anchor="end">'+sp.bTxt+'</text></g>';
    else S += '<g class="tgaK1"><line x1="'+bX+'" y1="'+f1(cy-r)+'" x2="'+bX+'" y2="'+f1(cy+r)+'" stroke="'+RED+'" stroke-width="2" stroke-dasharray="6 4"/><text x="'+(bX+5)+'" y="'+f1(cy-r+14)+'" font-size="11" font-weight="bold" fill="'+RED+'">'+sp.bTxt+'</text></g>';
    S += '<g class="tgaK2"><line x1="'+cx+'" y1="'+cy+'" x2="'+p1x+'" y2="'+p1y+'" stroke="'+GOLD+'" stroke-width="3"/><circle cx="'+p1x+'" cy="'+p1y+'" r="4" fill="'+GOLD+'"/></g>';
    S += '<g class="tgaK3"><path d="'+arc(a1)+'" fill="none" stroke="'+GOLD+'" stroke-width="2"/><text x="'+m1x+'" y="'+m1y+'" font-size="12" font-weight="bold" fill="'+GOLD+'" text-anchor="middle">'+sp.a1Txt+'</text></g>';
    S += '<g class="tgaK4">'+(sinA
      ? '<line x1="'+p1x+'" y1="'+p1y+'" x2="'+cx+'" y2="'+p1y+'" stroke="'+GRY+'" stroke-width="1.5" stroke-dasharray="4 3"/><line x1="'+cx+'" y1="'+cy+'" x2="'+cx+'" y2="'+p1y+'" stroke="'+RED+'" stroke-width="3"/>'
      : '<line x1="'+p1x+'" y1="'+p1y+'" x2="'+p1x+'" y2="'+cy+'" stroke="'+GRY+'" stroke-width="1.5" stroke-dasharray="4 3"/><line x1="'+cx+'" y1="'+cy+'" x2="'+p1x+'" y2="'+cy+'" stroke="'+RED+'" stroke-width="3"/>')+'</g>';
    if (a2) {
      S += '<g class="tgaK5"><line x1="'+cx+'" y1="'+cy+'" x2="'+p2x+'" y2="'+p2y+'" stroke="'+GOLD+'" stroke-width="3"/><circle cx="'+p2x+'" cy="'+p2y+'" r="4" fill="'+GOLD+'"/></g>';
      S += '<g class="tgaK6"><path d="'+arc(a2)+'" fill="none" stroke="'+GOLD+'" stroke-width="2"/><text x="'+m2x+'" y="'+m2y+'" font-size="12" font-weight="bold" fill="'+GOLD+'" text-anchor="middle">'+sp.a2Txt+'</text></g>';
      S += '<g class="tgaK7">'+(sinA
        ? '<line x1="'+p2x+'" y1="'+p2y+'" x2="'+cx+'" y2="'+p2y+'" stroke="'+GRY+'" stroke-width="1.5" stroke-dasharray="4 3"/><line x1="'+cx+'" y1="'+cy+'" x2="'+cx+'" y2="'+p2y+'" stroke="'+RED+'" stroke-width="3"/>'
        : '<line x1="'+p2x+'" y1="'+p2y+'" x2="'+p2x+'" y2="'+cy+'" stroke="'+GRY+'" stroke-width="1.5" stroke-dasharray="4 3"/><line x1="'+cx+'" y1="'+cy+'" x2="'+p2x+'" y2="'+cy+'" stroke="'+RED+'" stroke-width="3"/>')+'</g>';
    }
  }
  S += '<text class="tgaK8" x="'+cx+'" y="244" font-size="11" fill="'+INK+'" text-anchor="middle">'+sp.sum+'</text>';
  S += '</svg></div>';
  return S;
}

function showLesson(q, errorFloor, penalty){
  /* L'intitulé de la leçon correspond à la NOTION DE LA QUESTION ratée,
     pas à l'étage d'arrivée après la chute. */
  const qIdx = NOTIONS.findIndex(n => n.id === q._notionId);
  const def = NOTIONS[qIdx >= 0 ? qIdx : Math.min(errorFloor, N_TOT-1)];
  lessonTag.textContent   = `Étage ${qIdx >= 0 ? qIdx + 1 : errorFloor + 1}`;
  lessonTitle.textContent = def.name;
  lessonSub.innerHTML = q._absurd
    ? `😡 CLÉ LOUFOQUE — chute maximale : <b>${penalty} étage${penalty > 1 ? 's' : ''}</b> !`
    : (penalty === 0
      ? `❌ Erreur légère — pas de chute. Voici la leçon.`
      : (penalty === 1
        ? `❌ Erreur — tu chutes d'<b>1 étage</b>.`
        : `❌ Erreur grave — tu chutes de <b>${penalty} étages</b>.`));

  /* SOLUTION PÉDAGOGIQUE COMPLÈTE, dans cet ordre :
     1. (le cas échéant) l'avertissement clé loufoque ;
     2. ✅ la réponse attendue, explicite et démontrée ;
     3. le cours, la méthode et le piège (q.explain) ;
     4. 🧩 la notion DÉCOMPOSÉE en éléments simples, l'élément raté
        en évidence, rappel de chaque élément au SURVOL de la souris ;
     5. 📚 TOUS les rappels utiles : fiches complètes ouvertes d'un clic ;
     6. l'animation éventuelle du cercle trigonométrique. */
  let body = '';
  if (q._absurd) {
    body += '<div class="ex-section warn" style="text-align:center">' +
      '<div style="font-size:64px;line-height:1">😡</div>' +
      '<h4>Clé LOUFOQUE — chute maximale !</h4>' +
      '<div style="text-align:left">Une clé <b>loufoque</b> est soit un mot totalement décalé (« pamplemousse », « hippogriffe », « ornithorynque »…), soit une clé qui n\'a <b>clairement aucun sens dans le contexte</b> de ce raisonnement — par exemple « hypoténuse » dans un raisonnement sur le cercle, ou une probabilité négative ou strictement supérieure à 1. Attention : une simple confusion de vocabulaire ou de raisonnement (« médiatrice » à la place de « bissectrice ») n\'est <b>pas</b> une clé loufoque, c\'est une erreur ordinaire. Mais ici, tu as placé un mot ou une valeur visiblement absurde pour ce contexte : sanction, chute du maximum d\'étages possible. Rélis le raisonnement ci-dessous et replace les VRAIES clés.</div>' +
      '</div>';
  }
  body += tdmRepAttendue(q);
  body += (q.explain || '<p>Aucune leçon disponible pour cet exercice.</p>');
  body += tdmDecompoHTML(q, def);
  body += tdmRappelsHTML(def.id);

  lessonBody.innerHTML = body + (q.trigAnim ? TG_ANIM(q.trigAnim) : '');

  lessonPanel.classList.add('open');
  typeset([lessonBody, lessonSub, lessonTitle]);
  setTimeout(()=>lessonCont.focus(), 200);
}

/* Nombre minimal d'apparitions systématiquement justes (réussies d'affilée,
   sous quelque forme que ce soit, dans quelque exercice que ce soit) pour
   qu'une notion puisse atteindre son plancher de probabilité : 5 %. */
const APPARITIONS_SYST_MIN = 8;

function adjustedPenalty(base, currentFloor, streak, genStreak){
  // Chute possible : de 0 (erreur bénigne) jusqu'à currentFloor étages (n).
  // - base = gravité intrinsèque de l'erreur (1 = normale, 2-4 = grave).
  // - streak = erreurs répétées d'affilée sur la MÊME notion : ça alourdit la chute.
  // - genStreak = erreurs répétées sur le MÊME TYPE d'exercice (même générateur) :
  //   la répétition des erreurs augmente la pénalité liée à cet exercice,
  //   d'un étage supplémentaire par récidive (2ᵉ erreur : +1, 3ᵉ : +2, etc.).
  if (currentFloor <= 0) return 0;          // au rez-de-chaussée, aucune chute possible
  let p = base;
  if (streak >= 2) p += Math.ceil(streak / 2);          // erreur répétitive → plus grave
  if ((genStreak || 0) >= 2) p += (genStreak - 1);      // récidive sur ce type d'exercice → encore plus grave
  if (base <= 1 && streak < 2 && (genStreak || 0) < 2 && Math.random() < 0.15) p = 0;  // étourderie pardonnée (jamais en cas de récidive)
  return clamp(p, 0, currentFloor);        // jamais plus de n étages : 0 ≤ chute ≤ n
}

function openDoor(floor, then){
  const ep = TDM_EPOCH;
  state.doorFloor = floor;
  state.doorProgress = 0;
  const start = performance.now();
  const DUR = 700;
  function anim(t){
    const el = t - start;
    state.doorProgress = Math.min(1, el / DUR);
    if(state.doorProgress < 1){
      requestAnimationFrame(anim);
    } else if(ep === TDM_EPOCH){
      then();
    }
  }
  requestAnimationFrame(anim);
}

function closeDoor(){
  const start = performance.now();
  const DUR = 500;
  function anim(t){
    const el = t - start;
    state.doorProgress = 1 - Math.min(1, el / DUR);
    if(state.doorProgress > 0.01){
      requestAnimationFrame(anim);
    } else {
      state.doorProgress = 0;
      state.doorFloor = -1;
    }
  }
  requestAnimationFrame(anim);
}

function handleAnswer(idx, q){
  const buttons = [...opts.querySelectorAll('button')];
  buttons.forEach(b => b.disabled = true);

  const correctIdx = q.options.findIndex(o => o.ok);
  const ok = (idx === correctIdx);

  buttons[idx].classList.add(ok ? 'good' : 'bad');
  if(!ok) buttons[correctIdx].classList.add('good');

  SAV.logQuestion(q, [q.options[idx].t], ok);
  resolveAnswer(ok, q);
}

function handleAnswerMulti(sel, q){
  const buttons = [...opts.querySelectorAll('button')];
  buttons.forEach(b => b.disabled = true);
  const optBtns = buttons.slice(0, q.options.length);

  // La bonne réponse est l'UNION exacte des propositions correctes :
  // il faut cocher toutes les bonnes et aucune mauvaise.
  const correctIdxs = q.options.map((o, i) => o.ok ? i : -1).filter(i => i >= 0);
  const ok = correctIdxs.length === sel.length && sel.every(i => correctIdxs.indexOf(i) >= 0);

  optBtns.forEach((b, i) => {
    if (correctIdxs.indexOf(i) >= 0) b.classList.add(sel.indexOf(i) >= 0 ? 'good' : 'missed');
    else if (sel.indexOf(i) >= 0) b.classList.add('bad');
  });

  SAV.logQuestion(q, sel.map(i => q.options[i].t), ok);
  resolveAnswer(ok, q);
}

function resolveAnswer(ok, q){
  if(ok){
    state.notionStreak[q._notionId] = 0;   // série d'erreurs brisée : remise à zéro
    if(state.lastGen) state.genStreak[state.lastGen] = 0;   // récidive sur ce type d'exercice : pardonnée
    const recOk = SAV.data && SAV.data.notions[q._notionId];
    const lastQOk = recOk ? recOk.questions[recOk.questions.length - 1] : null;
    if(lastQOk){ lastQOk.pen = 0; lastQOk.lf = false; lastQOk.gs = 0; }   // bonne réponse : aucune sanction, récidive pardonnée
    const wasNew = !state.validated.has(q._notionId);
    if(wasNew){
      state.validated.add(q._notionId);
      SAV.onValidated(q._notionId);
      feedback.className = 'fb-good';
      feedback.textContent = '✔ Bonne réponse — notion validée !';
    } else {
      feedback.className = 'fb-good';
      feedback.textContent = '✔ Bonne réponse — tu montes !';
    }

    const notion = NOTIONS.find(n => n.id === q._notionId);
    /* Probabilités bornées entre 5 % et 100 % : une notion validée peut
       TOUJOURS revenir (révision espacée). Chaque réussite DIVISE par 2 sa
       probabilité de revenir, mais le plancher de 5 % n'est atteignable qu'après
       au moins APPARITIONS_SYST_MIN (8) apparitions systématiquement justes —
       avant ce seuil, la probabilité reste bloquée juste au-dessus de 5 %. */
    if (notion) {
      notion.okRun = (notion.okRun || 0) + 1;   // apparition systématiquement juste
      const half = notion.prob * 0.5;
      if (half > 0.05 || notion.okRun >= APPARITIONS_SYST_MIN) {
        notion.prob = Math.max(0.05, half);
      }
    }

    if(state.floor < N_TOT) {
      state.floor++;
      state.maxBuiltFloor = Math.max(state.maxBuiltFloor, state.floor);
    }
    updateHUD();

    if(state.validated.size === N_TOT){
      tdmLater(startFinalAscent, 900);
    } else {
      tdmLater(newQuestion, 900);
    }
  } else {
    const basePenalty = q.penalty || 1;
    state.notionStreak[q._notionId] = (state.notionStreak[q._notionId] || 0) + 1;  // même notion ratée d'affilée
    /* La répétition d'erreurs sur un même TYPE d'exercice (même générateur)
       augmente la pénalité liée à cet exercice : compteur propre, remis à
       zéro dès qu'un exercice de ce type est réussi. */
    const genName = state.lastGen || '';
    if(genName) state.genStreak[genName] = (state.genStreak[genName] || 0) + 1;
    const genErr = genName ? (state.genStreak[genName] || 0) : 0;
    /* Clé LOUFOQUE placée dans un trou : chute du MAXIMUM d'étages possibles. */
    const penalty = q._absurd ? state.floor : adjustedPenalty(basePenalty, state.floor, state.notionStreak[q._notionId], genErr);
    /* Trace de la sanction dans l'historique scellé (visible par l'enseignant) :
       chute appliquée et nature loufoque de la clé éventuellement placée. */
    const rec = SAV.data && SAV.data.notions[q._notionId];
    const lastQ = rec ? rec.questions[rec.questions.length - 1] : null;
    if(lastQ){ lastQ.pen = penalty; lastQ.lf = !!q._absurd; lastQ.gs = genErr; }
    state.errors += 1;
    state.lessonActive = true;

    const notion = NOTIONS.find(n => n.id === q._notionId);
    /* Chaque erreur MULTIPLIE par 2 la probabilité de revoir la notion :
       plafonnée à 100 % — une probabilité ne dépasse jamais 100 %. L'erreur
       casse aussi la série d'apparitions systématiquement justes : le plancher
       de 5 % redevient inatteignable jusqu'à 8 nouvelles réussites d'affilée. */
    if (notion) { notion.prob = Math.min(1.0, notion.prob * 2.0); notion.okRun = 0; }

    feedback.className = 'fb-bad';
    const repeteTxt = genErr >= 2 ? ` Récidive : ${genErr}ᵉ erreur de suite sur ce type d'exercice — la chute s'alourdit !` : '';
    if (q._absurd) {
      feedback.innerHTML = `<span style="font-size:46px;line-height:1;vertical-align:middle">😡</span> <b>CLÉ LOUFOQUE !</b> Une clé sans aucun sens dans ce contexte ? Chute du MAXIMUM — <b>${penalty} étage${penalty > 1 ? 's' : ''}</b> ! L'étage s'ouvre.`;
    } else {
      feedback.textContent = penalty === 0
        ? `✘ Erreur légère — pas de chute. L'étage s'ouvre pour t'expliquer.${repeteTxt}`
        : (penalty === 1
          ? `✘ Erreur — tu chutes d'1 étage. L'étage s'ouvre.${repeteTxt}`
          : `✘ Erreur grave — tu chutes de ${penalty} étages ! L'étage s'ouvre.${repeteTxt}`);
    }

    state.pendingError = { floor: state.floor, penalty, q };

    openDoor(state.floor, () => {
      if (!state.pendingError) return;   // partie relancée entre-temps : pas de leçon à afficher
      showLesson(q, state.pendingError.floor, penalty);
    });
  }
  tdmSaveNow();
}

function closeLesson(){
  if(!state.pendingError) return;
  lessonPanel.classList.remove('open'); resetLessonPos();

  const error = state.pendingError;
  const newFloor = Math.max(0, error.floor - error.penalty);

  if (error.penalty > 0) {
    for (let i = newFloor + 1; i <= error.floor; i++) {
      spawnExplosion(i);
    }
  }

  state.floor = newFloor;
  state.maxBuiltFloor = newFloor;
  state.falling = error.penalty > 0;
  state.lessonActive = false;
  updateHUD();

  closeDoor();

  tdmLater(() => {
    state.falling = false;
    state.pendingError = null;
    if(state.validated.size === N_TOT){
      startFinalAscent();
    } else {
      newQuestion();
    }
    tdmSaveNow();
  }, 700 + error.penalty * 100);
}
lessonCont.addEventListener('click', closeLesson);

function startFinalAscent(){
  state.finalAscent = true;
  state.playing = false;
  state.lessonActive = true;
  feedback.className = 'fb-good';
  feedback.textContent = '🎉 Toutes les notions sont validées ! Ascension finale…';
  updateHUD();

  state.floor = N_TOT;
  state.maxBuiltFloor = N_TOT;
  tdmLater(() => { win(); }, 1800);
}

function win(){
  const m = Math.floor(state.elapsed/60), s = state.elapsed%60;
  const box = $('overlayBox');
  const notionList = [...state.validated]
    .map(id => NOTIONS.find(n => n.id === id))
    .filter(Boolean)
    .map(n => `<li>${n.name}</li>`)
    .join('');
  box.innerHTML = `
    <h1>SOMMET ATTEINT !</h1>
    <h2>Toutes les notions validées 🏔️</h2>
    <div class="recap">
      <div><div class="k">Temps</div><div class="v" style="color:var(--gold)">${m}:${String(s).padStart(2,'0')}</div></div>
      <div><div class="k">Erreurs</div><div class="v" style="color:var(--bad)">${state.errors}</div></div>
      <div><div class="k">Notions</div><div class="v" style="color:var(--cyan)">${state.validated.size} / ${N_TOT}</div></div>
      <div><div class="k">Score</div><div class="v" style="color:var(--good)">${tdmScoreGlobal()} %</div></div>
      <div><div class="k">Sessions</div><div class="v" style="color:var(--violet)">${(SAV.data && SAV.data.sessions.length) || 1}</div></div>
    </div>
    <p>${state.errors === 0
        ? "Ascension parfaite, sans la moindre erreur. Chapeau !"
        : (state.errors <= 3
            ? "Très belle ascension, quelques petites glissades seulement."
            : "Le sommet est là : l'essentiel est d'y être arrivé. On refait une montée ?")}</p>
    <p style="font-size:12px;color:var(--dim);text-align:left;margin-top:16px"><b>Notions validées :</b></p>
    <ul style="text-align:left;font-size:12.5px;columns:2;column-gap:20px;padding-left:20px;margin:6px 0">${notionList}</ul>
    <button class="btn" id="againBtn">REJOUER</button>
  `;
  if(SAV.data){
    SAV.data.finalisee = true;
    tdmSyncProgression();
    tdmSaveNow();
  }
  try { tdmExport(true); } catch(e) {}
  $('overlay').classList.remove('hidden');
  $('againBtn').addEventListener('click', tdmRejouer);
}

function startGame(){
  state.floor = 0;
  state.maxBuiltFloor = 0;
  state.visualFloor = 0;
  state.errors = 0;
  state.elapsed = 0;
  state.playing = true;
  state.validated.clear();
  state.passed.clear();
  NOTIONS.forEach(n => { n.prob = 0.5; n.okRun = 0; });   // au départ, toutes équiprobables (50 %)
  state.currentNotion = null;
  state.lastGen = null;
  state.lessonActive = false;
  state.doorFloor = -1;
  state.doorProgress = 0;
  state.pendingError = null;
  state.falling = false;
  state.finalAscent = false;
  state.particles = [];
  state.notionStreak = {};
  state.genStreak = {};
  updateHUD();
  state.camY = (0 + 1) * HH - 1.6;
  updateTimeDisplay();
  lessonPanel.classList.remove('open'); resetLessonPos();
  $('overlay').classList.add('hidden');
  newQuestion();
}

