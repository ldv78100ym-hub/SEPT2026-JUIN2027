/* ============================================================
   20. GRAPHE DES NOTIONS — explorateur « tout est lié »
   ------------------------------------------------------------
   Principe : la carte n'affiche JAMAIS les 172 notions d'un
   coup (illisible), mais un SOUS-GRAPHE CENTRÉ — une notion,
   une sous-catégorie ou une catégorie au centre, ses liens
   directs autour, clairement étiquetés. Cliquer sur un nœud
   le fait devenir le nouveau centre et déploie ses propres
   liens : l'élève « saute » de proche en proche et découvre
   que TOUT est relié, directement ou indirectement.
     • départ au choix : écran d'accueil (16 zones) ou
       « 🎯 ma position actuelle » dans la tour ;
     • fil du chemin (breadcrumb) + compteur de sauts ;
     • barre de portée : combien de notions sont atteignables
       en 1, 2 ou 3 sauts depuis le centre ;
     • 3 types de liens étiquetés : 🔗 même sous-catégorie,
       ⚙ même élément d'entraînement, 📘 fiches partagées ;
     • panneau de détail élèves / enseignant (rappels MathJax,
       fiches de rappel, identifiants).
   Implémentation : DOM + SVG, transitions CSS. Aucune boucle
   d'animation, aucune simulation physique : très léger.
   API : tdmOuvreGraphe, tdmFermeGraphe, tdmGrapheCentre(id),
   tdmGrapheDepart(cat), tdmGrapheMode(m), tdmGrapheVoisins(id),
   tdmGrapheEtat().
   ============================================================ */
(function(){

/* ---------- garde-fous d'environnement (banc d'essai Node) ---------- */
if(typeof document === 'undefined' || !document.createElement) return;

/* ---------- couleurs ---------- */
function gCatHue(i){ return Math.round((i * 137.508) % 360); }
function gCatColor(i, l){ return 'hsl(' + gCatHue(i) + ',55%,' + (l || 42) + '%)'; }
const G_FAM_NOM = { amber:'ambre', teal:'turquoise', green:'vert', violet:'violet',
  orange:'orange', blue:'bleu', pink:'rose', lime:'citron', rose:'rouge doux', cyan:'cyan' };
const G_TYPE_LIEN = {
  sub:  { coul:'#b87900', icone:'🔗', nom:'même sous-catégorie' },
  gen:  { coul:'#0e8f82', icone:'⚙', nom:'même élément d’entraînement' },
  fiche:{ coul:'#7b5fc0', icone:'📘', nom:'fiches de rappel partagées' }
};

/* ---------- index des liens (construit à la première ouverture) ---------- */
let IDX = null;
function gBuildIndex(){
  const cls = {}, subIds = {}, byId = {};
  PROG_CATS.forEach(function(c, ci){
    (c.subs || []).forEach(function(s, si){
      (s.ids || []).forEach(function(id){
        if(!(id in cls)) cls[id] = { c: ci, s: si };
      });
      subIds[ci + ':' + si] = s.ids || [];
    });
  });
  const byGen = {}, byFiche = {};
  const fichesOf = {};
  NOTIONS.forEach(function(n){
    byId[n.id] = n;
    const fset = fichesOf[n.id] = {};
    (n.g || []).forEach(function(g){
      (byGen[g] = byGen[g] || []).push(n.id);
      (tdmGenFiches(g) || []).forEach(function(f){
        (byFiche[f] = byFiche[f] || []).push(n.id);
        fset[f] = true;
      });
    });
  });
  /* voisins « fiches partagées », classés par nombre de fiches communes */
  const ficheRank = {};
  NOTIONS.forEach(function(n){
    const rank = {};
    Object.keys(fichesOf[n.id]).forEach(function(f){
      (byFiche[f] || []).forEach(function(x){
        if(x !== n.id) rank[x] = (rank[x] || 0) + 1;
      });
    });
    ficheRank[n.id] = Object.keys(rank)
      .map(function(x){ return [x, rank[x]]; })
      .sort(function(a, b){ return b[1] - a[1]; });
  });
  /* adjacency complète (pour la barre de portée) */
  const adj = {};
  NOTIONS.forEach(function(n){
    const edges = [];
    const c = cls[n.id] || { c: -1, s: -1 };
    (subIds[c.c + ':' + c.s] || []).forEach(function(x){
      if(x !== n.id) edges.push({ id: x, type: 'sub' });
    });
    (n.g || []).forEach(function(g){
      (byGen[g] || []).forEach(function(x){
        if(x !== n.id) edges.push({ id: x, type: 'gen', gen: g });
      });
    });
    ficheRank[n.id].forEach(function(p){ edges.push({ id: p[0], type: 'fiche', nf: p[1] }); });
    adj[n.id] = edges;
  });
  IDX = { cls: cls, subIds: subIds, byId: byId, adj: adj, ficheRank: ficheRank, fichesOf: fichesOf };
}

/* relation la plus forte entre deux notions (pour « pourquoi ce lien ») */
function gRelation(aId, bId){
  const A = IDX.byId[aId], B = IDX.byId[bId];
  if(!A || !B) return null;
  const ca = IDX.cls[aId] || { c: -1, s: -1 }, cb = IDX.cls[bId] || { c: -1, s: -1 };
  if(ca.c === cb.c && ca.s === cb.s && ca.s >= 0){
    const sub = (PROG_CATS[ca.c].subs || [])[ca.s];
    return { type: 'sub', txt: 'même sous-catégorie « ' + (sub ? sub.nom : '') + ' »' };
  }
  const gCommun = (A.g || []).filter(function(g){ return (B.g || []).indexOf(g) >= 0; });
  if(gCommun.length) return { type: 'gen', txt: 'même élément d’entraînement « ' + tdmGenLabel(gCommun[0]) + ' »' };
  const communes = Object.keys(IDX.fichesOf[aId]).filter(function(f){ return IDX.fichesOf[bId][f]; });
  if(communes.length){
    const t = FICHES[communes[0]] ? FICHES[communes[0]].titre : communes[0];
    return { type: 'fiche', txt: communes.length + ' fiche' + (communes.length > 1 ? 's' : '') +
      ' de rappel partagée' + (communes.length > 1 ? 's' : '') + ' (ex. « ' + t + ' »)' };
  }
  return null;
}

/* portée : nombre de notions atteignables en 1, 2, 3 sauts (et au-delà) */
function gPortee(id){
  const dist = {}; dist[id] = 0;
  let front = [id], d = 0;
  while(front.length && d < 3){
    const next = [];
    d++;
    front.forEach(function(x){
      (IDX.adj[x] || []).forEach(function(e){
        if(!(e.id in dist)){ dist[e.id] = d; next.push(e.id); }
      });
    });
    front = next;
  }
  const out = { d1: 0, d2: 0, d3: 0, reste: 0 };
  Object.keys(dist).forEach(function(x){
    if(dist[x] === 1) out.d1++;
    else if(dist[x] === 2) out.d2++;
    else if(dist[x] === 3) out.d3++;
  });
  out.reste = NOTIONS.length - 1 - out.d1 - out.d2 - out.d3;
  return out;
}

/* voisins d'affichage d'une notion : anneau 1 (sous-catégorie),
   anneau 2 (élément partagé + top fiches communes) */
function gVoisinsAffiche(id, offset){
  const nd = IDX.byId[id];
  const c = IDX.cls[id] || { c: -1, s: -1 };
  const ring1 = ((IDX.subIds[c.c + ':' + c.s] || []).filter(function(x){ return x !== id; }))
    .map(function(x){ return { id: x, type: 'sub' }; });
  const ring2 = [];
  const vus = {};
  ring1.forEach(function(e){ vus[e.id] = true; });
  (nd.g || []).forEach(function(g){
    (IDX.adj[id] || []).forEach(function(e){
      if(e.type === 'gen' && e.gen === g && !vus[e.id]){ vus[e.id] = true; ring2.push(e); }
    });
  });
  const plus = IDX.ficheRank[id] || [];
  plus.slice(offset, offset + 3).forEach(function(p){
    if(!vus[p[0]]){ vus[p[0]] = true; ring2.push({ id: p[0], type: 'fiche', nf: p[1] }); }
  });
  return { ring1: ring1, ring2: ring2, plusFiches: Math.max(0, plus.length - offset - 3) };
}

/* ---------- état ---------- */
const S = { centre: { type: 'accueil' }, trail: [], hops: 0, mode: 'eleve',
            ficheOff: 0, lastRel: null, ouvert: false, dernierFocus: null };
let gEls = null;

/* ---------- injection de la modale (cf. 16b) ---------- */
function gBind(){
  const wrap = document.createElement('div');
  wrap.id = 'graphModal';
  wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML =
    '<div class="gbox" role="dialog" aria-modal="true" aria-labelledby="gTitre">' +
      '<button class="gclose" id="gClose" aria-label="Fermer">×</button>' +
      '<div class="ghead">' +
        '<span class="gtitre" id="gTitre">🕸️ Graphe des notions — tout est lié</span>' +
        '<div class="gtrail" id="gTrail"></div>' +
        '<div class="gsearch">' +
          '<input id="gSearch" type="search" placeholder="Aller à une notion…" aria-label="Aller à une notion">' +
          '<div class="gdrop" id="gDrop"></div>' +
        '</div>' +
        '<button class="gbtn" id="gPos" title="Repartir de la notion en cours dans la tour">🎯 Ma position</button>' +
      '</div>' +
      '<div class="gbody">' +
        '<div id="gStage"></div>' +
        '<svg id="gLinks"></svg>' +
        '<div class="gtypes" id="gTypes"></div>' +
        '<div class="greach" id="gReach"></div>' +
        '<div class="gpanel" id="gPanel">' +
          '<div class="gphead">' +
            '<div class="gpfil" id="gpFil"></div>' +
            '<div style="display:flex;align-items:flex-start">' +
              '<h3 id="gpTitre" style="flex:1"></h3>' +
              '<div class="gpmodes">' +
                '<button id="gModeEleve">🎓</button>' +
                '<button id="gModeProf">👩‍🏫</button>' +
              '</div>' +
            '</div>' +
            '<div class="gpbadges" id="gpBadges"></div>' +
          '</div>' +
          '<div class="gpbody" id="gpBody"></div>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(wrap);

  gEls = {
    modal: wrap,
    stage: document.getElementById('gStage'),
    links: document.getElementById('gLinks'),
    trail: document.getElementById('gTrail'),
    search: document.getElementById('gSearch'),
    drop: document.getElementById('gDrop'),
    pos: document.getElementById('gPos'),
    types: document.getElementById('gTypes'),
    reach: document.getElementById('gReach'),
    panel: document.getElementById('gPanel'),
    gpFil: document.getElementById('gpFil'),
    gpTitre: document.getElementById('gpTitre'),
    gpBadges: document.getElementById('gpBadges'),
    gpBody: document.getElementById('gpBody')
  };

  document.getElementById('gClose').addEventListener('click', tdmFermeGraphe);
  gEls.search.addEventListener('input', gOnSearch);
  gEls.pos.addEventListener('click', function(){
    const id = gPositionActuelle();
    if(id) gAller({ type: 'notion', id: id }, null);
  });
  document.getElementById('gModeEleve').addEventListener('click', function(){ gSetMode('eleve'); });
  document.getElementById('gModeProf').addEventListener('click', function(){ gSetMode('prof'); });
  gEls.panel.addEventListener('click', function(e){
    const b = e.target.closest('[data-gnotion],[data-gsub],[data-gcat]');
    if(!b) return;
    if(b.getAttribute('data-gnotion')) gAller({ type: 'notion', id: b.getAttribute('data-gnotion') }, null);
    else if(b.getAttribute('data-gsub')){
      const p = b.getAttribute('data-gsub').split(':');
      gAller({ type: 'sub', c: +p[0], s: +p[1] }, null);
    } else if(b.getAttribute('data-gcat')) gAller({ type: 'cat', c: +b.getAttribute('data-gcat') }, null);
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && S.ouvert) tdmFermeGraphe();
  });
  window.addEventListener('resize', function(){ if(S.ouvert) gRendre(); });

  /* légende des types de liens (statique) */
  gEls.types.innerHTML =
    '<span><i style="background:' + G_TYPE_LIEN.sub.coul + '"></i>🔗 même sous-catégorie</span>' +
    '<span><i style="background:' + G_TYPE_LIEN.gen.coul + '"></i>⚙ même élément d’entraînement</span>' +
    '<span><i style="background:' + G_TYPE_LIEN.fiche.coul + '"></i>📘 fiches de rappel partagées</span>';
}

/* ---------- navigation ---------- */
function gAller(centre, rel){
  if(S.centre.type === 'notion' && centre.type === 'notion' && S.centre.id !== centre.id) S.hops++;
  if(rel === undefined){
    rel = (S.centre.type === 'notion' && centre.type === 'notion')
      ? gRelation(S.centre.id, centre.id) : null;
  }
  S.lastRel = rel;
  S.centre = centre;
  S.trail.push(centre);
  S.ficheOff = 0;
  gRendre();
}
function gVider(el){
  while(el.children && el.children.length) el.removeChild(el.children[0]);
}
function gPositionActuelle(){
  const cn = state.currentNotion;
  const id = cn && (cn.id || cn);
  if(id && IDX.byId[id]) return id;
  if(state.maxBuiltFloor > 0) return NOTIONS[Math.min(state.maxBuiltFloor, NOTIONS.length - 1)].id;
  return null;
}

/* ---------- recherche ---------- */
function gNorm(s){ return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
function gOnSearch(){
  const q = gNorm(gEls.search.value.trim());
  gEls.drop.innerHTML = '';
  if(!q){ gEls.drop.classList.remove('open'); return; }
  const res = NOTIONS.filter(function(n){ return gNorm(n.name).indexOf(q) >= 0; }).slice(0, 8);
  res.forEach(function(n){
    const cls = IDX.cls[n.id] || { c: 0 };
    const b = document.createElement('button');
    b.innerHTML = (PROG_CATS[cls.c] ? PROG_CATS[cls.c].icon + ' ' : '') + n.name;
    b.addEventListener('click', function(){
      gEls.search.value = '';
      gEls.drop.classList.remove('open');
      gAller({ type: 'notion', id: n.id }, null);
    });
    gEls.drop.appendChild(b);
  });
  gEls.drop.classList.toggle('open', res.length > 0);
}

/* ---------- rendu principal ---------- */
function gRendre(){
  if(!gEls || !IDX) return;
  gVider(gEls.stage);
  gVider(gEls.links);
  gEls.reach.innerHTML = '';
  gEls.reach.style.display = 'none';
  const idPos = gPositionActuelle();
  gEls.pos.style.display = (S.centre.type !== 'accueil' && idPos) ? '' : 'none';
  gRendreTrail();
  const c = S.centre;
  if(c.type === 'accueil') gVueAccueil();
  else if(c.type === 'cat') gVueCat(c.c);
  else if(c.type === 'sub') gVueSub(c.c, c.s);
  else gVueNotion(c.id);
}

/* fil du chemin (breadcrumb) */
function gRendreTrail(){
  const t = gEls.trail;
  gVider(t);
  const home = document.createElement('button');
  home.className = 'gchip';
  home.innerHTML = '🏠 Départ';
  home.addEventListener('click', function(){ gAller({ type: 'accueil' }, null); });
  t.appendChild(home);
  S.trail.forEach(function(tc, i){
    if(tc.type === 'accueil') return;
    const sep = document.createElement('span');
    sep.className = 'tsep'; sep.textContent = '›';
    t.appendChild(sep);
    const chip = document.createElement('button');
    chip.className = 'gchip' + (i === S.trail.length - 1 ? ' cur' : '');
    let lbl = '?';
    if(tc.type === 'cat') lbl = (PROG_CATS[tc.c] || {}).icon + ' ' + PROG_CATS[tc.c].nom;
    else if(tc.type === 'sub') lbl = '📁 ' + ((PROG_CATS[tc.c].subs || [])[tc.s] || {}).nom;
    else if(tc.type === 'notion') lbl = (IDX.byId[tc.id] || {}).name || tc.id;
    chip.innerHTML = lbl;
    if(i !== S.trail.length - 1){
      chip.addEventListener('click', function(){
        S.trail = S.trail.slice(0, i + 1);
        S.centre = tc;
        S.lastRel = null;
        S.ficheOff = 0;
        gRendre();
      });
    }
    t.appendChild(chip);
  });
  if(S.hops > 0){
    const sep = document.createElement('span');
    sep.className = 'tsep'; sep.textContent = '·';
    t.appendChild(sep);
    const h = document.createElement('span');
    h.className = 'gchip cur';
    h.innerHTML = '<span class="sauts">🔗 ' + S.hops + ' saut' + (S.hops > 1 ? 's' : '') + '</span>';
    t.appendChild(h);
  }
}

/* position d'un nœud satellite sur un anneau */
function gGeometrie(){
  const r = gEls.stage.getBoundingClientRect ? gEls.stage.getBoundingClientRect()
    : { left: 0, top: 0, width: 1280, height: 800 };
  const w = r.width || 1280, h = r.height || 800;
  const panneauOuvert = (S.centre.type !== 'accueil' && w > 760);
  const cx = panneauOuvert ? (w - 340) / 2 : w / 2;
  const cy = h / 2 - 6;
  const maxR = Math.max(90, Math.min(cx - 80, h / 2 - 64));
  return { w: w, h: h, cx: cx, cy: cy, maxR: maxR, panneauOuvert: panneauOuvert };
}
function gPosAnneau(g, R, i, n, decal){
  const a = -Math.PI / 2 + (i / Math.max(1, n)) * 2 * Math.PI + (decal || 0);
  return { x: g.cx + R * Math.cos(a), y: g.cy + R * 0.82 * Math.sin(a) };
}

/* création d'un nœud */
function gNoeud(g, x, y, opt){
  const el = document.createElement('button');
  el.className = 'gnode apparait' + (opt.centre ? ' centre' : '') + (opt.espece === 'sub' ? ' sub' : '');
  el.style.left = Math.round(x) + 'px';
  el.style.top = Math.round(y) + 'px';
  if(opt.bord) el.style.borderColor = opt.bord;
  const nom = document.createElement('span');
  nom.textContent = opt.label;
  el.appendChild(nom);
  if(opt.count != null){
    const c = document.createElement('span');
    c.className = 'gcount';
    c.textContent = opt.count;
    el.appendChild(c);
  }
  if(opt.etage){
    const e = document.createElement('span');
    e.className = 'etg';
    e.textContent = 'étage ' + opt.etage + ' / ' + NOTIONS.length;
    el.appendChild(e);
  }
  if(opt.stat){
    const st = document.createElement('span');
    st.className = 'gstat ' + (opt.stat === 'ok' ? 'ok' : 'skip');
    st.textContent = opt.stat === 'ok' ? '✔' : '⏭';
    el.appendChild(st);
  }
  if(opt.title) el.title = opt.title;
  if(opt.onClick) el.addEventListener('click', opt.onClick);
  gEls.stage.appendChild(el);
  return el;
}

/* trait étiqueté entre deux points */
function gLien(x1, y1, x2, y2, type, etiquette, dash){
  const NS = 'http://www.w3.org/2000/svg';
  const mk = document.createElementNS
    ? function(t){ return document.createElementNS(NS, t); }
    : function(t){ return document.createElement(t); };
  const l = mk('line');
  l.setAttribute('x1', x1); l.setAttribute('y1', y1);
  l.setAttribute('x2', x2); l.setAttribute('y2', y2);
  l.setAttribute('stroke', G_TYPE_LIEN[type] ? G_TYPE_LIEN[type].coul : '#b87900');
  l.setAttribute('opacity', '0.55');
  if(dash) l.setAttribute('class', 'dash');
  gEls.links.appendChild(l);
  if(etiquette){
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const lab = document.createElement('div');
    lab.className = 'glab';
    lab.textContent = etiquette;
    lab.style.left = Math.round(mx) + 'px';
    lab.style.top = Math.round(my) + 'px';
    lab.style.borderColor = G_TYPE_LIEN[type] ? G_TYPE_LIEN[type].coul : '#b87900';
    gEls.stage.appendChild(lab);
  }
}

/* statut d'une notion pour badge nœud */
function gStatut(id){
  if(state.validated.has(id)) return 'ok';
  if(state.passed.has(id)) return 'skip';
  return null;
}

/* ---------- vue d'accueil : choix du point de départ ---------- */
function gVueAccueil(){
  gEls.panel.classList.remove('open');
  gEls.pos.style.display = 'none';
  const card = document.createElement('div');
  card.className = 'gstart';
  const h = document.createElement('h3');
  h.textContent = '🌍 Tout est lié — choisis un point de départ';
  card.appendChild(h);
  const p = document.createElement('p');
  p.innerHTML = 'Les <b>' + NOTIONS.length + ' notions</b> du programme sont reliées <b>directement</b> ' +
    '(même sous-catégorie, même exercice, fiches partagées) ou <b>indirectement</b> ' +
    '(en quelques sauts). Choisis une zone, puis clique sur un nœud pour en faire ' +
    'le nouveau centre du graphe et suivre les ramifications…';
  card.appendChild(p);
  const idPos = gPositionActuelle();
  if(idPos){
    const bPos = document.createElement('button');
    bPos.className = 'gbtn';
    bPos.style.borderColor = 'var(--gold)';
    bPos.style.color = 'var(--gold)';
    bPos.innerHTML = '🎯 Repartir de ma position dans la tour (« ' + IDX.byId[idPos].name + ' »)';
    bPos.addEventListener('click', function(){ gAller({ type: 'notion', id: idPos }, null); });
    card.appendChild(bPos);
  }
  const grid = document.createElement('div');
  grid.className = 'gcats';
  PROG_CATS.forEach(function(cat, ci){
    const ids = [];
    (cat.subs || []).forEach(function(s){ ids.push.apply(ids, s.ids || []); });
    const v = ids.filter(function(x){ return state.validated.has(x); }).length;
    const b = document.createElement('button');
    b.className = 'gcat';
    b.innerHTML = '<span>' + cat.icon + '</span><span>' + cat.nom + '</span>' +
      '<span class="cnt">' + (v ? '✔' + v + '/' : '') + ids.length + '</span>';
    b.addEventListener('click', function(){ gAller({ type: 'cat', c: ci }, null); });
    grid.appendChild(b);
  });
  card.appendChild(grid);
  gEls.stage.appendChild(card);
}

/* ---------- vue catégorie : ses sous-catégories ---------- */
function gVueCat(ci){
  const cat = PROG_CATS[ci];
  gEls.panel.classList.add('open');
  const g = gGeometrie();
  const subs = cat.subs || [];
  const R = g.maxR * (subs.length > 8 ? 0.94 : 0.72);
  const noeuds = [];
  subs.forEach(function(s, si){
    const pos = gPosAnneau(g, R, si, subs.length);
    const n = gNoeud(g, pos.x, pos.y, {
      espece: 'sub', label: s.nom, bord: gCatColor(ci),
      count: (s.ids || []).length + ' notion' + ((s.ids || []).length > 1 ? 's' : ''),
      title: 'Cliquer pour voir les notions de « ' + s.nom + ' »',
      onClick: function(){ gAller({ type: 'sub', c: ci, s: si }, null); }
    });
    noeuds.push([pos.x, pos.y]);
  });
  /* nœud central = la catégorie */
  gNoeud(g, g.cx, g.cy, {
    centre: true, label: cat.icon + ' ' + cat.nom, bord: gCatColor(ci),
    count: subs.length + ' sous-catégorie' + (subs.length > 1 ? 's' : '')
  });
  noeuds.forEach(function(p){ gLien(g.cx, g.cy, p[0], p[1], 'sub', null, false); });
  /* panneau : liste des sous-catégories */
  const ids = [];
  subs.forEach(function(s){ ids.push.apply(ids, s.ids || []); });
  const v = ids.filter(function(x){ return state.validated.has(x); }).length;
  gEls.gpFil.textContent = 'Zone du programme';
  gEls.gpTitre.textContent = cat.icon + ' ' + cat.nom;
  gEls.gpBadges.innerHTML =
    '<span class="gpbadge">' + ids.length + ' notions</span>' +
    '<span class="gpbadge ' + (v ? 'ok' : '') + '">✔ ' + v + ' validée' + (v > 1 ? 's' : '') + '</span>';
  let h = '<h5>Sous-catégories (liens directs)</h5><div class="gsib">';
  subs.forEach(function(s, si){
    h += '<button data-gsub="' + ci + ':' + si + '">📁 ' + s.nom +
      ' <small>(' + (s.ids || []).length + ')</small></button>';
  });
  h += '</div><p class="gpnote">Clique sur une sous-catégorie pour l’ouvrir au centre, ' +
       'ou utilise la recherche pour aller directement à une notion.</p>';
  gEls.gpBody.innerHTML = h;
}

/* ---------- vue sous-catégorie : ses notions ---------- */
function gVueSub(ci, si){
  const cat = PROG_CATS[ci];
  const sub = (cat.subs || [])[si];
  if(!sub){ gAller({ type: 'cat', c: ci }, null); return; }
  gEls.panel.classList.add('open');
  const g = gGeometrie();
  const ids = sub.ids || [];
  const deuxAnneaux = ids.length > 9;
  const R1 = g.maxR * 0.6, R2 = g.maxR * 0.95;
  const n1 = deuxAnneaux ? Math.ceil(ids.length / 2) : ids.length;
  ids.forEach(function(id, i){
    const ring = deuxAnneaux && i >= n1 ? 2 : 1;
    const idx = ring === 2 ? i - n1 : i;
    const n = ring === 2 ? ids.length - n1 : n1;
    const pos = gPosAnneau(g, ring === 2 ? R2 : R1, idx, n, ring === 2 ? Math.PI / n : 0);
    const nd = IDX.byId[id];
    gNoeud(g, pos.x, pos.y, {
      label: nd ? nd.name : id, bord: gCatColor(ci),
      stat: gStatut(id),
      etage: nd ? NOTIONS.indexOf(nd) + 1 : null,
      title: 'Cliquer pour en faire le centre du graphe',
      onClick: function(){ gAller({ type: 'notion', id: id }, null); }
    });
    gLien(g.cx, g.cy, pos.x, pos.y, 'sub', null, false);
  });
  gNoeud(g, g.cx, g.cy, {
    centre: true, label: sub.nom, bord: gCatColor(ci),
    count: ids.length + ' notion' + (ids.length > 1 ? 's' : '')
  });
  /* panneau */
  gEls.gpFil.textContent = (cat.icon || '') + ' ' + cat.nom;
  gEls.gpTitre.textContent = sub.nom;
  const v = ids.filter(function(x){ return state.validated.has(x); }).length;
  gEls.gpBadges.innerHTML =
    '<span class="gpbadge">' + ids.length + ' notions liées</span>' +
    '<span class="gpbadge ' + (v ? 'ok' : '') + '">✔ ' + v + '</span>';
  let h = '<h5>Notions de cette sous-catégorie (cliquer pour explorer)</h5><div class="gsib">';
  ids.forEach(function(id){
    const nd = IDX.byId[id];
    h += '<button data-gnotion="' + id + '">' + (nd ? nd.name : id) + '</button>';
  });
  h += '</div><p class="gpnote">Ces notions sont directement reliées entre elles : ' +
       'c’est le lien 🔗. Depuis chacune, d’autres ramifications (⚙ exercices, 📘 fiches) ' +
       'conduisent au reste du programme.</p>';
  gEls.gpBody.innerHTML = h;
}

/* ---------- vue notion : le sous-graphe centré ---------- */
function gVueNotion(id){
  const nd = IDX.byId[id];
  if(!nd) return;
  const cls = IDX.cls[id] || { c: 0, s: -1 };
  const cat = PROG_CATS[cls.c] || { icon: '❓', nom: '?', subs: [] };
  gEls.panel.classList.add('open');
  const g = gGeometrie();
  const v = gVoisinsAffiche(id, S.ficheOff);
  const R1 = g.maxR * 0.58;
  const R2 = g.maxR * 0.95;

  /* anneau 1 : mêmes sous-catégorie (lien fort 🔗) */
  v.ring1.forEach(function(e, i){
    const pos = gPosAnneau(g, R1, i, Math.max(1, v.ring1.length));
    const other = IDX.byId[e.id];
    gNoeud(g, pos.x, pos.y, {
      label: other ? other.name : e.id, bord: gCatColor(cls.c),
      stat: gStatut(e.id),
      etage: other ? NOTIONS.indexOf(other) + 1 : null,
      title: 'Même sous-catégorie — cliquer pour en faire le centre',
      onClick: function(){ gAller({ type: 'notion', id: e.id }, undefined); }
    });
    gLien(g.cx, g.cy, pos.x, pos.y, 'sub', null, false);
  });
  /* étiquette de groupe pour l'anneau 1 */
  if(v.ring1.length){
    const sub = (cat.subs || [])[cls.s];
    const pos = gPosAnneau(g, R1 * 0.5, 0, Math.max(1, v.ring1.length));
    const lab = document.createElement('div');
    lab.className = 'glab';
    lab.textContent = '🔗 ' + (sub ? sub.nom : 'même sous-catégorie');
    lab.style.borderColor = G_TYPE_LIEN.sub.coul;
    lab.style.left = Math.round(g.cx + (pos.x - g.cx) * 0.9) + 'px';
    lab.style.top = Math.round(g.cy - 14 + (pos.y - g.cy) * 0.25) + 'px';
    gEls.stage.appendChild(lab);
  }

  /* anneau 2 : élément partagé ⚙ puis fiches partagées 📘 */
  v.ring2.forEach(function(e, i){
    const pos = gPosAnneau(g, R2, i, Math.max(1, v.ring2.length), Math.PI / Math.max(1, v.ring2.length));
    const other = IDX.byId[e.id];
    let etiquette = null;
    if(e.type === 'gen') etiquette = '⚙ même exercice : ' + tdmGenLabel(e.gen);
    else if(e.type === 'fiche') etiquette = '📘 ' + e.nf + ' fiche' + (e.nf > 1 ? 's' : '') + ' commune' + (e.nf > 1 ? 's' : '');
    gNoeud(g, pos.x, pos.y, {
      label: other ? other.name : e.id, bord: gCatColor((IDX.cls[e.id] || { c: cls.c }).c),
      stat: gStatut(e.id),
      etage: other ? NOTIONS.indexOf(other) + 1 : null,
      title: (e.type === 'gen' ? 'Même élément d’entraînement' : 'Fiches de rappel partagées') +
             ' — cliquer pour en faire le centre',
      onClick: function(){ gAller({ type: 'notion', id: e.id }, undefined); }
    });
    gLien(g.cx, g.cy, pos.x, pos.y, e.type, etiquette, true);
  });

  /* bouton « autres liens » */
  if(v.plusFiches > 0){
    const b = document.createElement('button');
    b.className = 'gplus';
    b.textContent = '📘 +' + v.plusFiches + ' autres liens par fiches partagées';
    b.style.top = Math.round(g.cy + R2 * 0.82 + 26) + 'px';
    b.addEventListener('click', function(){
      S.ficheOff += 3;
      gRendre();
    });
    gEls.stage.appendChild(b);
  }

  /* nœud central */
  gNoeud(g, g.cx, g.cy, {
    centre: true, label: nd.name, bord: gCatColor(cls.c),
    etage: NOTIONS.indexOf(nd) + 1,
    stat: gStatut(id)
  });

  /* barre de portée : la preuve que tout est lié */
  const p = gPortee(id);
  let phrase = '🌍 Depuis « ' + nd.name + ' » : <b>' + p.d1 + '</b> lien' + (p.d1 > 1 ? 's' : '') +
    ' direct' + (p.d1 > 1 ? 's' : '') + ' · <b>' + (p.d1 + p.d2) + '</b> notions en 2 sauts · <b>' +
    (p.d1 + p.d2 + p.d3) + '</b> en 3 sauts';
  if(p.reste === 0) phrase += ' · <span class="wow">tout le programme est atteint !</span>';
  else phrase += ' · ' + p.reste + ' plus loin';
  gEls.reach.innerHTML = phrase;
  gEls.reach.style.display = '';

  gPanneauNotion(id, nd, cls, cat);
}

/* ---------- panneau de détail d'une notion ---------- */
function gSetMode(m){
  S.mode = m;
  if(!gEls) return;
  const be = document.getElementById('gModeEleve'), bp = document.getElementById('gModeProf');
  if(be) be.classList.toggle('on', m === 'eleve');
  if(bp) bp.classList.toggle('on', m === 'prof');
  if(S.centre.type === 'notion'){
    const nd = IDX.byId[S.centre.id];
    if(nd) gPanneauNotion(S.centre.id, nd, IDX.cls[S.centre.id] || { c: 0, s: -1 },
      PROG_CATS[(IDX.cls[S.centre.id] || { c: 0 }).c] || { subs: [] });
  }
}
function gPanneauNotion(id, nd, cls, cat){
  const i = NOTIONS.indexOf(nd);
  const sub = (cat.subs || [])[cls.s] || null;
  const fam = G_FAM_NOM[nd.family] || nd.family;
  const hue = (FAMILY_HUES && FAMILY_HUES[nd.family]) || 200;
  const gens = nd.g || [];
  const isValidated = state.validated.has(id);
  const isPassed = !isValidated && state.passed.has(id);
  let statut, stCls;
  if(isValidated){ statut = '✔ Validée'; stCls = 'ok'; }
  else if(isPassed){ statut = '⏭ Passée'; stCls = 'skip'; }
  else { statut = '⏳ À valider'; stCls = 'todo'; }

  gEls.gpFil.innerHTML =
    '<button data-gcat="' + cls.c + '">' + (cat.icon || '') + ' ' + cat.nom + '</button>' +
    (sub ? ' › <button data-gsub="' + cls.c + ':' + cls.s + '">' + sub.nom + '</button>' : '');
  gEls.gpTitre.textContent = nd.name;
  gEls.gpBadges.innerHTML =
    '<span class="gpbadge">Étage ' + (i + 1) + ' / ' + NOTIONS.length + '</span>' +
    '<span class="gpbadge" style="border-color:hsl(' + hue + ',55%,45%);color:hsl(' + hue + ',55%,38%)">' + fam + '</span>' +
    '<span class="gpbadge ' + stCls + '">' + statut + '</span>';

  let h = '';
  /* pourquoi ce lien */
  if(S.lastRel) h += '<div class="pourquoi">🔗 <b>Lien suivi :</b> ' + S.lastRel.txt + '</div>';
  /* éléments */
  h += '<h5 class="' + (S.mode === 'eleve' ? 'gold' : '') + '">' +
    (S.mode === 'eleve' ? '🎯 Ce que tu vas t’entraîner à faire' : '🧩 Éléments simples (générateurs)') + '</h5><ul>';
  gens.forEach(function(gg){
    h += '<li><div>' + tdmGenLabel(gg) + '</div>';
    if(S.mode === 'prof'){
      h += '<div class="gid">' + gg + '</div><div class="grap">' + tdmGenRappel(gg) + '</div>';
    }
    h += '</li>';
  });
  h += '</ul>';
  /* fiches */
  const fiches = [];
  gens.forEach(function(gg){
    (tdmGenFiches(gg) || []).forEach(function(k){ if(fiches.indexOf(k) < 0) fiches.push(k); });
  });
  if(fiches.length){
    h += '<h5>📚 Fiches de rappel</h5><div class="gfiches">' +
      fiches.map(function(k){
        return '<button type="button" class="tdm-fiche-btn" data-fiche="' + k + '">📘 ' + FICHES[k].titre + '</button>';
      }).join('') + '</div>';
  }
  /* progression */
  if(!isValidated && !isPassed && typeof tdmScoreNotion === 'function'){
    const sc = Math.max(0, Math.min(100, Math.round(tdmScoreNotion(id))));
    h += '<h5>📈 Progression de l’étage</h5><div class="gptrack"><div class="gpfill" style="width:' + sc + '%"></div></div>';
  }
  h += '<p class="gpnote">' + (S.mode === 'prof'
    ? 'Identifiant : <b>' + id + '</b>. Statistiques ✓/✗ par élément dans l’export enseignant scellé.'
    : '💡 Chaque bonne réponse construit cet étage dans la tour ; chaque erreur ouvre une leçon. ' +
      'Les notions autour de ce nœud mènent à tout le programme : clique et vérifie !') + '</p>';
  gEls.gpBody.innerHTML = h;
  gEls.gpBody.scrollTop = 0;
  if(typeof typeset === 'function') typeset([gEls.gpBody]);
}

/* ---------- ouverture / fermeture ---------- */
function tdmOuvreGraphe(){
  if(!IDX) gBuildIndex();
  if(!gEls) gBind();
  S.dernierFocus = document.activeElement;
  S.ouvert = true;
  S.trail = [];
  S.hops = 0;
  S.ficheOff = 0;
  S.lastRel = null;
  const idPos = gPositionActuelle();
  S.centre = idPos ? { type: 'notion', id: idPos } : { type: 'accueil' };
  S.trail.push(S.centre);
  gEls.pos.style.display = idPos ? '' : 'none';
  gEls.modal.classList.add('open');
  gEls.modal.setAttribute('aria-hidden', 'false');
  gSetMode(S.mode);
  gRendre();
  const cl = document.getElementById('gClose');
  if(cl && cl.focus) cl.focus();
}
function tdmFermeGraphe(){
  S.ouvert = false;
  if(gEls){
    gEls.modal.classList.remove('open');
    gEls.modal.setAttribute('aria-hidden', 'true');
    gEls.drop.classList.remove('open');
  }
  if(S.dernierFocus && S.dernierFocus.focus) S.dernierFocus.focus();
}

/* ---------- API publiques ---------- */
window.tdmOuvreGraphe = tdmOuvreGraphe;
window.tdmFermeGraphe = tdmFermeGraphe;
window.tdmGrapheCentre = function(id){ if(IDX && IDX.byId[id]) gAller({ type: 'notion', id: id }, null); };
window.tdmGrapheDepart = function(ci){ if(PROG_CATS[ci]) gAller({ type: 'cat', c: ci }, null); };
window.tdmGrapheMode = gSetMode;
window.tdmGrapheVoisins = function(id){
  if(!IDX) gBuildIndex();
  return IDX.adj[id] || [];
};
window.tdmGrapheEtat = function(){
  return {
    centre: S.centre, hops: S.hops, trail: S.trail.length,
    voisins: S.centre.type === 'notion' ? (IDX.adj[S.centre.id] || []).length : 0,
    portee: S.centre.type === 'notion' ? gPortee(S.centre.id) : null
  };
};

/* ---------- entrée de menu ---------- */
const grapheBtn = document.getElementById('grapheBtn');
if(grapheBtn) grapheBtn.addEventListener('click', function(){
  if(S.ouvert) tdmFermeGraphe(); else tdmOuvreGraphe();
});

})();
