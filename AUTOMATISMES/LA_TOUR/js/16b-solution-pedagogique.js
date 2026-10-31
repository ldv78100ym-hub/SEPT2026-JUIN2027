/* ============================================================
   16b. SOLUTION PÉDAGOGIQUE COMPLÈTE, INFOBULLES & FICHES
   - Infobulles (survol de tout élément [data-tip]) : rappel de
     cours instantané, mise en forme LaTeX comprise.
   - Modale « fiche de rappel » : cours complet, détaillé et
     rigoureux, ouverte par les boutons 📚.
   - tdmRepAttendue / tdmDecompoHTML / tdmRappelsHTML : la leçon
     d'erreur présente la réponse attendue EXPLICITE, la notion
     DÉCOMPOSÉE en éléments simples (avec l'élément raté mis en
     évidence et les statistiques par élément) et TOUS les
     rappels utiles (fiches).
   Utilise : GEN_INFO / FICHES / tdmElemsDeNotion / tdmFichesDeNotion
   (11b-elements-notions.js), esc / typeset (01-outils, 15-interface).
   ============================================================ */

/* ---------- Modale « fiche de rappel » (injectée dynamiquement) ---------- */
(function(){
  const wrap = document.createElement('div');
  wrap.id = 'tdmFicheModal';
  wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML =
    '<div class="tdm-fbox" role="dialog" aria-modal="true" aria-labelledby="tdmFicheTitle">' +
    '<button class="close" id="tdmFicheClose" aria-label="Fermer">×</button>' +
    '<h2 id="tdmFicheTitle"></h2>' +
    '<div class="tdm-fsub">Rappel de cours — fiche complète</div>' +
    '<div class="tdm-fbody" id="tdmFicheBody"></div>' +
    '</div>';
  document.body.appendChild(wrap);
})();

function tdmOuvreFiche(key){
  const f = FICHES[key];
  if(!f) return;
  const modal = document.getElementById('tdmFicheModal');
  document.getElementById('tdmFicheTitle').innerHTML = f.titre;
  const body = document.getElementById('tdmFicheBody');
  body.innerHTML = f.html;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  body.scrollTop = 0;
  typeset([body, document.getElementById('tdmFicheTitle')]);
}
function tdmFermeFiche(){
  const modal = document.getElementById('tdmFicheModal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}
document.getElementById('tdmFicheClose').addEventListener('click', tdmFermeFiche);
document.getElementById('tdmFicheModal').addEventListener('click', function(e){
  if(e.target === this) tdmFermeFiche();
});
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape') tdmFermeFiche();
});
/* Un clic sur n'importe quel bouton [data-fiche] ouvre la fiche. */
document.addEventListener('click', function(e){
  const b = e.target.closest('[data-fiche]');
  if(!b || !b.getAttribute('data-fiche')) return;
  tdmOuvreFiche(b.getAttribute('data-fiche'));
});

/* ---------- Infobulles au survol (délégation globale) ----------
   Tout élément portant un attribut data-tip (HTML, LaTeX permis)
   affiche une infobulle riche à la position du curseur. */
(function(){
  const tip = document.createElement('div');
  tip.id = 'tdmTip';
  tip.setAttribute('role', 'tooltip');
  document.body.appendChild(tip);
  let current = null;

  function showFor(el, ev){
    if(el === current && tip.classList.contains('on')) { place(ev); return; }
    current = el;
    tip.innerHTML = el.getAttribute('data-tip') || '';
    tip.classList.add('on');
    typeset([tip]);
    place(ev);
  }
  function place(ev){
    const pad = 14;
    let x = (ev && ev.clientX !== undefined ? ev.clientX : 40) + 14;
    let y = (ev && ev.clientY !== undefined ? ev.clientY : 40) + 16;
    const r = tip.getBoundingClientRect();
    if (x + r.width > window.innerWidth - pad)  x = Math.max(pad, window.innerWidth - r.width - pad);
    if (y + r.height > window.innerHeight - pad) y = Math.max(pad, ev.clientY - r.height - 14);
    tip.style.left = x + 'px';
    tip.style.top  = y + 'px';
  }
  function hide(){
    tip.classList.remove('on');
    current = null;
  }
  document.addEventListener('mouseover', function(e){
    const el = e.target.closest ? e.target.closest('[data-tip]') : null;
    if(el){ showFor(el, e); } else if(current){ hide(); }
  });
  document.addEventListener('mousemove', function(e){
    if(tip.classList.contains('on')) place(e);
  });
  document.addEventListener('mouseout', function(e){
    const el = e.target.closest ? e.target.closest('[data-tip]') : null;
    if(el && el !== (e.relatedTarget && e.relatedTarget.closest ? e.relatedTarget.closest('[data-tip]') : null)){
      const to = e.relatedTarget;
      if(!el.contains(to)) hide();
    }
  });
  document.addEventListener('focusin', function(e){
    const el = e.target.closest ? e.target.closest('[data-tip]') : null;
    if(el) showFor(el, null);
  });
  document.addEventListener('focusout', hide);
  window.addEventListener('scroll', hide, true);
})();

/* ---------- Statistiques par élément (petites pastilles) ---------- */
function tdmElemStatsHTML(st){
  if(!st || (!st.ok && !st.ko)) return '<span class="tdm-elt-stats tdm-elt-none">jamais posé</span>';
  return '<span class="tdm-elt-stats">' +
    '<b class="tdm-elt-ok">✓' + st.ok + '</b> <b class="tdm-elt-ko">✗' + st.ko + '</b></span>';
}

/* ---------- Décomposition d'une notion en éléments simples ----------
   opts : { mini: compact (notions passées), highlight: clé du
   générateur raté (leçon d'erreur), stats: afficher les ✓/✗ } */
function tdmElemsHTML(notionId, opts){
  opts = opts || {};
  const n = NOTIONS.find(x => x.id === notionId);
  if(!n) return '';
  const elems = tdmElemsDeNotion(n);
  if(!elems.length) return '';
  let h = '<div class="tdm-elems' + (opts.mini ? ' mini' : '') + '">';
  elems.forEach(function(e){
    const isKo = opts.highlight && opts.highlight === e.g;
    const fiches = e.fiches.length ? e.fiches[0] : '';
    h += '<div class="tdm-elt' + (isKo ? ' tdm-elt-raté' : '') + '" data-tip="' + esc(e.rappel) + '"' +
         (fiches ? ' data-fiche="' + fiches + '" role="button" tabindex="0" title="Cliquer : ouvrir la fiche de rappel"' : '') + '>' +
         '<span class="tdm-elt-lbl">' + esc(e.label) + '</span>' +
         tdmElemStatsHTML(e.stats) +
         (fiches ? '<span class="tdm-elt-fiche">📚</span>' : '') +
         (isKo ? '<span class="tdm-elt-tag">raté à l\'instant</span>' : '') +
         '</div>';
  });
  h += '</div>';
  return h;
}

/* ---------- Boutons « rappels utiles » (fiches de la notion) ---------- */
function tdmRappelsHTML(notionId){
  const n = NOTIONS.find(x => x.id === notionId);
  if(!n) return '';
  const fiches = tdmFichesDeNotion(n);
  if(!fiches.length) return '';
  let h = '<div class="ex-section good tdm-fiches-section">' +
          '<h4>📚 Rappels utiles — clique pour ouvrir la fiche complète</h4>' +
          '<div class="tdm-fiches-row">';
  fiches.forEach(function(k){
    h += '<button type="button" class="tdm-fiche-btn" data-fiche="' + k + '">' + FICHES[k].titre + '</button>';
  });
  h += '</div></div>';
  return h;
}

/* ---------- Réponse attendue, explicite et démontrée ---------- */
function tdmRepAttendue(q){
  let sol = '';
  if(q.options){
    const biens = q.options.filter(function(o){ return o.ok; }).map(function(o){ return o.t; });
    if(biens.length){
      sol += '<div class="ex-section good tdm-sol-section">' +
             '<h4>✅ La réponse attendue</h4><div>' +
             biens.map(function(t){ return '<div class="tdm-sol-item">➤ ' + t + '</div>'; }).join('') +
             (q.multi ? '<div style="font-size:12.5px;color:var(--dim)">Plusieurs réponses : la bonne réponse est l\'UNION exacte des propositions cochées.</div>' : '') +
             '</div></div>';
    }
  } else if(q.trou && q.corps && q.answers){
    const complet = q.corps.replace(/\{\{(\d+)\}\}/g, function(m, i){
      return '<b class="tdm-sol-trou">' + esc(q.answers[+i]) + '</b>';
    });
    sol += '<div class="ex-section good tdm-sol-section">' +
           '<h4>✅ Le raisonnement complet, clés en place</h4><div>' + complet + '</div>' +
           '<div style="font-size:12.5px;color:var(--dim)">Les clés correctes apparaissent <b>en vert</b> : chaque trou attend exactement ce mot-clé (un mot peut combler plusieurs trous).</div>' +
           '</div>';
  }
  return sol;
}

/* ---------- Décomposition pédagogique dans la leçon d'erreur ---------- */
function tdmDecompoHTML(q, def){
  if(!def) return '';
  const els = tdmElemsDeNotion(def);
  if(!els.length) return '';
  const fiches = tdmFichesDeNotion(def);
  let h = '<div class="ex-section tdm-decompo-section">' +
          '<h4>🧩 La notion « ' + esc(def.name) + ' » décomposée en éléments simples</h4>' +
          '<div class="tdm-decompo-intro">Cette notion se travaille par ' + els.length + ' élément' + (els.length > 1 ? 's' : '') + ' — ' +
          'celui que tu viens de rater apparaît en rouge. <b>Survole</b> un élément pour son rappel immédiat ; <b>clique</b> pour la fiche complète.</div>' +
          tdmElemsHTML(def.id, { highlight: state.lastGen || (q && q._gen) || '' });
  if(fiches.length){
    h += '<div class="tdm-decompo-suite">Rappels utiles : ' +
         fiches.map(function(k){ return '<button type="button" class="tdm-fiche-btn" data-fiche="' + k + '">📘 ' + FICHES[k].titre.replace(/^[^ ]+ /, '') + '</button>'; }).join(' ') +
         '</div>';
  }
  h += '</div>';
  return h;
}

/* ---------- Solution pédagogique complète (leçon d'erreur) ----------
   Réponse attendue explicite + décomposition en éléments simples
   + rappels utiles (fiches). Complète le q.explain existant
   (cours, méthode, piège), affiché par showLesson. */
function tdmSolutionComplete(q, def){
  return tdmRepAttendue(q) + tdmDecompoHTML(q, def) + tdmRappelsHTML(def ? def.id : '');
}
