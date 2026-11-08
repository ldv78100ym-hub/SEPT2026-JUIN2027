/* ============================================================
   20. GRAPHE DES NOTIONS — constellation 3D + sous-graphes
   ------------------------------------------------------------
   Deux étages de lecture du programme :

   1. VUE GÉNÉRALE 3D « constellation » (par défaut) : les 228
      notions placées dans l'espace — 22 secteurs de zones
      colorées autour d'un axe vertical, la hauteur = le niveau
      de classe (🌱 cycle 3 en bas → 🏛 CPGE au sommet). Les
      liaisons 🔗 (même sous-catégorie), ⚙ (même élément
      d'entraînement) et ponts 📘 (fiches partagées)
      traversent la constellation : on VOIT le
      programme entier et ses ponts. Glisser fait tourner,
      la molette zoome, un clic sélectionne une notion (ses
      liens 📘 par fiches partagées apparaissent alors), et un
      bouton bascule vers le sous-graphe 2D centré.
      • filtres : niveau de classe, zone, types de liaisons ;
      • panneau : guide, notions les plus connectées, zones,
        niveaux — tout cliquable ;
      • rotation automatique douce, arrêtée dès qu'on prend la
        main ; moteur canvas 2D avec projection perspective,
        très léger, aucun bundler.

   2. SOUS-GRAPHES 2D CENTRÉS (exploration de détail) : une
      notion, une sous-catégorie ou une zone au centre, ses
      satellites directs autour (anneaux), liaisons étiquetées,
      nœuds déplaçables, étiquette explicative au survol, fil
      du chemin + sauts, barre de portée (« tout est lié »).

   API : tdmOuvreGraphe, tdmFermeGraphe, tdmGrapheMonde,
   tdmGrapheCentre(id), tdmGrapheDepart(cat), tdmGrapheMode(m),
   tdmGrapheVoisins(id), tdmGrapheEtat(), tdmGrapheSelect(id),
   tdmGrapheProjeter(id), tdmGrapheNoeuds3D(), tdmGrapheLiens3D(),
   tdmGrapheCamera(yaw,pitch,zoom), tdmGrapheAuto(on),
   tdmGrapheFiltreNiveau(code), tdmGrapheFiltreCat(ci),
   tdmGrapheToggles({sub,gen,fiche}).
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
/* caméra de la constellation */
const G3D_CAM = { d: 11.6, fl: 620 };

/* ---------- index des liens + layout 3D (1re ouverture) ---------- */
let IDX = null;
let POS3 = null;    /* id → {x, y, z, li, ci, si, theta, r} */
let E3 = [];        /* liaisons générales : {a, b, type} */
let E3SUB = 0, E3GEN = 0, E3FIC = 0;

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
  /* adjacency complète (portée, API voisins) */
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
  IDX = { cls: cls, subIds: subIds, byId: byId, adj: adj, ficheRank: ficheRank,
          fichesOf: fichesOf, byGen: byGen };

  /* ---- layout 3D « couronne des niveaux » (déterministe) ---- */
  const nCat = PROG_CATS.length;
  const sect = 2 * Math.PI / nCat;
  const lvlIdx = {};
  NIVEAUX.forEach(function(v, i){ lvlIdx[v.code] = i; });
  const hash = function(s){
    let h = 0;
    for(let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9973;
    return h / 9973;
  };
  POS3 = {};
  NOTIONS.forEach(function(n){
    const cc = cls[n.id] || { c: -1, s: -1 };
    const li = lvlIdx[NOTION_LEVELS[n.id]];
    const lix = (li == null) ? 3 : li;
    const subs = (PROG_CATS[cc.c] || { subs: [] }).subs || [];
    const nSub = Math.max(1, subs.length);
    const si = cc.s >= 0 ? cc.s : 0;
    const ids = (subs[si] && subs[si].ids) || [n.id];
    const k = Math.max(0, ids.indexOf(n.id));
    const nIds = Math.max(1, ids.length);
    const theta = cc.c * sect + ((si + 0.5) / nSub) * sect * 0.84 +
      ((k - (nIds - 1) / 2) / Math.max(3, nIds)) * sect * 0.55;
    const r = 2.75 + ((si * 5 + k * 3 + 1) % 7) * 0.34;
    const y = (lix - 3) * 1.12 + (hash(n.id) - 0.5) * 0.24;
    POS3[n.id] = { x: r * Math.cos(theta), y: y, z: r * Math.sin(theta),
                   li: lix, ci: cc.c, si: si, theta: theta, r: r };
  });

  /* ---- liaisons générales (🔗 + ⚙, sans doublon) ---- */
  E3 = []; E3SUB = 0; E3GEN = 0;
  const vus = {};
  const paire = function(a, b, type){
    if(a === b) return;
    const k = (a < b) ? a + '|' + b : b + '|' + a;
    if(vus[k]) return;
    vus[k] = true;
    E3.push({ a: a, b: b, type: type });
  };
  PROG_CATS.forEach(function(c){
    (c.subs || []).forEach(function(s){
      const ids = s.ids || [];
      for(let i = 0; i < ids.length; i++)
        for(let j = i + 1; j < ids.length; j++) paire(ids[i], ids[j], 'sub');
    });
  });
  E3SUB = E3.length;
  Object.keys(byGen).forEach(function(g){
    const lst = byGen[g];
    if(lst.length < 2) return;
    if(lst.length > 6){
      /* étoile autour du premier : pas de fouillis */
      for(let i = 1; i < lst.length; i++) paire(lst[0], lst[i], 'gen');
    } else {
      for(let i = 0; i < lst.length; i++)
        for(let j = i + 1; j < lst.length; j++) paire(lst[i], lst[j], 'gen');
    }
  });
  E3GEN = E3.length - E3SUB;
  /* ponts 📘 : les 2 liaisons « fiches partagées » les plus fortes de
     chaque notion (au moins 2 fiches communes). Ce sont elles qui
     relient les zones et les niveaux entre eux : sans elles, la
     constellation ne montrerait que des îlots. */
  NOTIONS.forEach(function(n){
    (ficheRank[n.id] || []).filter(function(p){ return p[1] >= 2; })
      .slice(0, 2).forEach(function(p){
        paire(n.id, p[0], 'fiche');
      });
  });
  E3FIC = E3.length - E3SUB - E3GEN;
  IDX.e3 = E3;
  IDX.e3sub = E3SUB;
  IDX.e3gen = E3GEN;
  IDX.e3fiche = E3FIC;
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
const S = { centre: { type: 'monde' }, trail: [], hops: 0, mode: 'eleve',
            ficheOff: 0, lastRel: null, ouvert: false, dernierFocus: null,
            pos: {}, cleVue: null, panelOuvert: true, sel: null,
            g3d: { yaw: -0.65, pitch: 0.42, zoom: 1, auto: true, niv: '*', cat: '*',
                   tsub: true, tgen: true, tfiche: true } };
let gEls = null;
let gLiens = [];   /* liaisons 2D de la vue courante : suivi du drag + survol */
let gProj = {};    /* projections écran de la constellation (id → {x,y,d,s}) */
let g3dArcs = [];  /* liaisons visibles de la constellation */
let g3dArcsF = []; /* liaisons « fiches » de la notion sélectionnée */
let g3dW = 1280, g3dH = 800, g3dCx = 640, g3dCy = 400;
let g3dCtx = null, g3dRaf = 0, g3dDrag = null, g3dSurvol = null;
let gNoeudsVue = [];   /* nœuds 2D de la vue courante */
let gLabGroupe = null; /* étiquette de groupe (anneau 1) */

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
        '<button class="gbtn" id="gPos" title="Sélectionner la notion en cours dans la tour">🎯 Ma position</button>' +
      '</div>' +
      '<div class="gbody" id="gBody">' +
        '<div id="gStage"></div>' +
        '<svg id="gLinks"></svg>' +
        '<div class="gtypes" id="gTypes"></div>' +
        '<div class="greach" id="gReach"></div>' +
        '<button class="gbtn gpmax" id="gpMax" style="display:none">ℹ️ Détails & liens</button>' +
        '<div class="gpop" id="gPop" style="display:none"></div>' +
        '<div class="gpanel" id="gPanel">' +
          '<div class="gphead">' +
            '<div class="gpfil" id="gpFil"></div>' +
            '<div style="display:flex;align-items:flex-start">' +
              '<h3 id="gpTitre" style="flex:1"></h3>' +
              '<div class="gpmodes">' +
                '<button id="gModeEleve">🎓</button>' +
                '<button id="gModeProf">👩‍🏫</button>' +
                '<button class="gpmin" id="gpMin" title="Réduire le panneau : agrandit le graphe">⤡</button>' +
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
    gbody: document.getElementById('gBody'),
    stage: document.getElementById('gStage'),
    links: document.getElementById('gLinks'),
    pop: document.getElementById('gPop'),
    gpMax: document.getElementById('gpMax'),
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
    if(!id) return;
    if(S.centre.type === 'monde') tdmGrapheSelect(id);
    else gAller({ type: 'notion', id: id }, null);
  });
  document.getElementById('gModeEleve').addEventListener('click', function(){ gSetMode('eleve'); });
  document.getElementById('gModeProf').addEventListener('click', function(){ gSetMode('prof'); });
  document.getElementById('gpMin').addEventListener('click', function(){
    S.panelOuvert = false; S.pos = {}; gRendre();
  });
  document.getElementById('gpMax').addEventListener('click', function(){
    S.panelOuvert = true; S.pos = {}; gRendre();
  });
  gEls.panel.addEventListener('click', function(e){
    const b = e.target.closest('[data-gnotion],[data-gsub],[data-gcat],[data-gniv]');
    if(!b) return;
    if(b.getAttribute('data-gnotion')) gAller({ type: 'notion', id: b.getAttribute('data-gnotion') }, null);
    else if(b.getAttribute('data-gsub')){
      const p = b.getAttribute('data-gsub').split(':');
      gAller({ type: 'sub', c: +p[0], s: +p[1] }, null);
    } else if(b.getAttribute('data-gcat')) gAller({ type: 'cat', c: +b.getAttribute('data-gcat') }, null);
    else if(b.getAttribute('data-gniv')){
      const v = NIVEAUX[+b.getAttribute('data-gniv')];
      if(v) tdmGrapheFiltreNiveau(v.code);
    }
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && S.ouvert) tdmFermeGraphe();
  });
  window.addEventListener('resize', function(){ if(S.ouvert) gRendre(); });
}

/* ---------- légende : statique (2D) ou pilotable (constellation) ---------- */
function gLegende(vue){
  if(vue !== 'monde'){
    gEls.types.innerHTML =
      '<span><i style="background:' + G_TYPE_LIEN.sub.coul + '"></i>🔗 même sous-catégorie</span>' +
      '<span><i style="background:' + G_TYPE_LIEN.gen.coul + '"></i>⚙ même élément d’entraînement</span>' +
      '<span><i style="background:' + G_TYPE_LIEN.fiche.coul + '"></i>📘 fiches de rappel partagées</span>';
    gEls.tsubEl = gEls.tgenEl = gEls.tficheEl = null;
    return;
  }
  /* en mode constellation, la légende devient pilotable :
     on choisit les familles de liaisons affichées */
  gEls.types.innerHTML = '';
  const mkTgl = function(id, cle, coul, txt){
    const lab = document.createElement('label');
    lab.className = 'gtgl';
    const inp = document.createElement('input');
    inp.type = 'checkbox';
    inp.id = id;
    inp.checked = S.g3d[cle];
    const dot = document.createElement('i');
    dot.style.background = coul;
    const t = document.createElement('span');
    t.textContent = txt;
    lab.appendChild(inp); lab.appendChild(dot); lab.appendChild(t);
    inp.addEventListener('change', function(){
      S.g3d[cle] = !!inp.checked;
      g3dRendre();
    });
    gEls[cle + 'El'] = inp;
    gEls.types.appendChild(lab);
  };
  mkTgl('g3dTSub', 'tsub', G_TYPE_LIEN.sub.coul, '🔗 sous-catégories');
  mkTgl('g3dTGen', 'tgen', G_TYPE_LIEN.gen.coul, '⚙ exercices partagés');
  mkTgl('g3dTFiche', 'tfiche', G_TYPE_LIEN.fiche.coul, '📘 fiches partagées');
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

/* ============================================================
   VUE GÉNÉRALE 3D — la constellation du programme
   ============================================================ */

/* un nœud est-il visible selon les filtres ? */
function g3dNoeudVisible(id){
  if(S.g3d.niv !== '*' && NOTION_LEVELS[id] !== S.g3d.niv) return false;
  if(S.g3d.cat !== '*'){
    const c = IDX.cls[id] || { c: -1 };
    if(c.c !== S.g3d.cat) return false;
  }
  return true;
}

/* projection perspective : monde → écran */
function g3dProject(p){
  const g = S.g3d;
  const cy = Math.cos(g.yaw), sy = Math.sin(g.yaw);
  const cp = Math.cos(g.pitch), sp = Math.sin(g.pitch);
  const x1 = p.x * cy - p.z * sy;
  const z1 = p.x * sy + p.z * cy;
  const y2 = p.y * cp - z1 * sp;
  const z2 = p.y * sp + z1 * cp;
  const d = G3D_CAM.d + z2;
  const s = (G3D_CAM.fl * g.zoom) / Math.max(2.2, d);
  return { x: g3dCx + x1 * s, y: g3dCy - y2 * s, d: d, s: s, z: z2 };
}

/* le point le plus proche d'une position écran (seuil en px) */
function g3dPick(px, py, seuil){
  let best = null, bd = (seuil || 15) * (seuil || 15);
  for(const id in gProj){
    const q = gProj[id];
    const dx = q.x - px, dy = q.y - py;
    const dd = dx * dx + dy * dy;
    if(dd < bd){ bd = dd; best = id; }
  }
  return best;
}

/* rotation automatique douce (uniquement avec un vrai canvas) */
function g3dTick(){
  if(!S.ouvert || S.centre.type !== 'monde' || !S.g3d.auto || !g3dCtx){ g3dRaf = 0; return; }
  S.g3d.yaw += 0.0016;
  g3dDessine();
  g3dRaf = requestAnimationFrame(g3dTick);
}
function g3dStart(){ if(!g3dRaf && g3dCtx){ g3dRaf = requestAnimationFrame(g3dTick); } }
function g3dStop(){
  if(g3dRaf && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(g3dRaf);
  g3dRaf = 0;
}

/* recalcul complet : projections + liaisons visibles + dessin + HUD */
function g3dRendre(){
  const geo = gGeometrie();
  g3dW = geo.w; g3dH = geo.h; g3dCx = geo.cx; g3dCy = geo.h / 2;
  /* projections */
  gProj = {};
  NOTIONS.forEach(function(n){
    if(POS3[n.id] && g3dNoeudVisible(n.id)) gProj[n.id] = g3dProject(POS3[n.id]);
  });
  /* liaisons générales actives */
  g3dArcs = [];
  E3.forEach(function(e){
    if(e.type === 'sub' && !S.g3d.tsub) return;
    if(e.type === 'gen' && !S.g3d.tgen) return;
    if(e.type === 'fiche' && !S.g3d.tfiche) return;
    if(gProj[e.a] && gProj[e.b]) g3dArcs.push(e);
  });
  /* liaisons « fiches » de la notion sélectionnée (top 12) */
  g3dArcsF = [];
  if(S.sel && S.g3d.tfiche && gProj[S.sel]){
    (IDX.ficheRank[S.sel] || []).slice(0, 12).forEach(function(p){
      if(gProj[p[0]]) g3dArcsF.push({ a: S.sel, b: p[0], type: 'fiche', nf: p[1] });
    });
  }
  g3dDessine();
  g3dHud();
}

/* le dessin lui-même (sans effet si pas de contexte canvas) */
function g3dDessine(){
  if(!g3dCtx) return;
  const ctx = g3dCtx;
  const dpr = (typeof devicePixelRatio === 'number' && devicePixelRatio > 1) ? devicePixelRatio : 1;
  const cv = gEls.cv3d;
  if(cv.width !== Math.round(g3dW * dpr) || cv.height !== Math.round(g3dH * dpr)){
    cv.width = Math.round(g3dW * dpr); cv.height = Math.round(g3dH * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, g3dW, g3dH);
  const idPos = gPositionActuelle();
  /* anneaux de niveau + étiquettes de niveau (repères d'altitude) */
  for(let li = 0; li < NIVEAUX.length; li++){
    ctx.beginPath();
    let premier = true;
    for(let k = 0; k <= 40; k++){
      const a = (k / 40) * 2 * Math.PI;
      const q = g3dProject({ x: 5.05 * Math.cos(a), y: (li - 3) * 1.12, z: 5.05 * Math.sin(a) });
      if(premier){ ctx.moveTo(q.x, q.y); premier = false; } else ctx.lineTo(q.x, q.y);
    }
    ctx.strokeStyle = 'rgba(122,102,60,0.13)';
    ctx.lineWidth = 1;
    ctx.stroke();
    const aLab = S.g3d.yaw - Math.PI / 2;
    const qL = g3dProject({ x: 5.05 * Math.cos(aLab), y: (li - 3) * 1.12, z: 5.05 * Math.sin(aLab) });
    ctx.fillStyle = (S.g3d.niv === NIVEAUX[li].code) ? '#8a6d1d' : 'rgba(122,102,60,0.78)';
    ctx.font = '600 11px inherit, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(NIVEAUX[li].icon + ' ' + NIVEAUX[li].court, qL.x - 6, qL.y + 3);
  }
  /* noms des zones au sommet (face avant uniquement) */
  ctx.textAlign = 'center';
  ctx.font = '600 10.5px inherit, sans-serif';
  const sect = 2 * Math.PI / PROG_CATS.length;
  PROG_CATS.forEach(function(c, ci){
    const a = (ci + 0.5) * sect;
    const q = g3dProject({ x: 6.1 * Math.cos(a), y: 3.95, z: 6.1 * Math.sin(a) });
    const devant = q.d < G3D_CAM.d + 1.2;
    if(devant){
      const al = Math.max(0.12, 0.85 - (q.d - 7) * 0.16);
      ctx.globalAlpha = al;
      ctx.fillStyle = (S.g3d.cat === ci) ? '#3b3222' : gCatColor(ci, 32);
      ctx.fillText(c.icon + ' ' + (c.nom.length > 16 ? c.nom.slice(0, 15) + '…' : c.nom), q.x, q.y);
      ctx.globalAlpha = 1;
    }
  });
  /* liaisons générales, puis celles de la sélection */
  g3dArcs.forEach(function(e){
    const A = gProj[e.a], B = gProj[e.b];
    const dm = (A.d + B.d) / 2;
    ctx.strokeStyle = G_TYPE_LIEN[e.type].coul;
    ctx.globalAlpha = Math.max(0.07, 0.46 - (dm - 7) * 0.036);
    ctx.lineWidth = (e.type === 'sub') ? 1.15 : 0.8;
    ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
  });
  ctx.globalAlpha = 1;
  g3dArcsF.forEach(function(e){
    const A = gProj[e.a], B = gProj[e.b];
    ctx.strokeStyle = G_TYPE_LIEN.fiche.coul;
    ctx.globalAlpha = 0.62;
    ctx.lineWidth = 1.3;
    ctx.setLineDash([5, 3]);
    ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
  });
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
  /* nœuds : tri par profondeur (les lointains d'abord) */
  const ordre = Object.keys(gProj).sort(function(x, y){ return gProj[y].d - gProj[x].d; });
  ordre.forEach(function(id){
    const q = gProj[id];
    const nd = IDX.byId[id];
    const ci = (IDX.cls[id] || { c: -1 }).c;
    const rad = Math.max(2, 0.05 * q.s) * (id === S.sel ? 1.9 : 1);
    /* pastille */
    ctx.beginPath();
    ctx.arc(q.x, q.y, rad, 0, 2 * Math.PI);
    if(state.passed.has(id) && !state.validated.has(id)) ctx.fillStyle = '#9a8f76';
    else ctx.fillStyle = gCatColor(ci, 46);
    ctx.fill();
    if(state.validated.has(id)){
      ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(q.x, q.y, rad + 1.6, 0, 2 * Math.PI); ctx.stroke();
    }
    /* position actuelle dans la tour : halo discret */
    if(id === idPos){
      ctx.strokeStyle = 'rgba(20,140,160,0.8)'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(q.x, q.y, rad + 4.2, 0, 2 * Math.PI); ctx.stroke();
    }
    /* sélection : mise en avant + nom */
    if(id === S.sel){
      ctx.strokeStyle = '#3b3222'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(q.x, q.y, rad + 2.6, 0, 2 * Math.PI); ctx.stroke();
      ctx.font = '700 12px inherit, sans-serif';
      ctx.textAlign = 'left';
      ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(250,243,226,0.9)';
      ctx.strokeText(nd ? nd.name : id, q.x + rad + 6, q.y - 6);
      ctx.fillStyle = '#3b3222';
      ctx.fillText(nd ? nd.name : id, q.x + rad + 6, q.y - 6);
    } else if(id === g3dSurvol){
      ctx.font = '600 11px inherit, sans-serif';
      ctx.textAlign = 'left';
      ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(250,243,226,0.9)';
      ctx.strokeText(nd ? nd.name : id, q.x + rad + 5, q.y - 5);
      ctx.fillStyle = '#5b4e33';
      ctx.fillText(nd ? nd.name : id, q.x + rad + 5, q.y - 5);
    }
  });
}

/* bandeau de compteur + repères de pilotage */
function g3dHud(){
  if(!gEls || !gEls.hud) return;
  const nN = Object.keys(gProj).length;
  const nL = g3dArcs.length + g3dArcsF.length;
  let t = '<b>' + nN + '</b> notion' + (nN > 1 ? 's' : '') + ' · <b>' + nL + '</b> liaison' + (nL > 1 ? 's' : '');
  t += ' — 🖱️ glisser : pivoter · molette / ± : zoom · clic : sélectionner';
  gEls.hud.innerHTML = t;
}

/* infobulle de survol */
function g3dTip(e, id){
  const nd = IDX.byId[id];
  const lix = NIVEAUX.map(function(v){ return v.code; }).indexOf(NOTION_LEVELS[id]);
  const st = state.validated.has(id) ? '✔ validée' : (state.passed.has(id) ? '⏭ passée' : '⏳ à valider');
  const nb = (IDX.adj[id] || []).length;
  gEls.tip.innerHTML =
    '<b>' + (nd ? nd.name : id) + '</b><br>' +
    '<small>' + (lix >= 0 ? NIVEAUX[lix].icon + ' ' + NIVEAUX[lix].court : '') +
    ' · ' + nb + ' lien' + (nb > 1 ? 's' : '') + ' · ' + st + '<br>clic : sélectionner</small>';
  gEls.tip.style.display = '';
  const r = gEls.gbody.getBoundingClientRect ? gEls.gbody.getBoundingClientRect()
    : { left: 0, top: 0, width: 1280, height: 800 };
  let x = (e.clientX || 0) - (r.left || 0) + 14;
  let y = (e.clientY || 0) - (r.top || 0) + 14;
  if(x + 240 > (r.width || 1280)) x -= 260;
  if(y + 80 > (r.height || 800)) y -= 96;
  gEls.tip.style.left = Math.max(8, x) + 'px';
  gEls.tip.style.top = Math.max(8, y) + 'px';
}

/* construction de la vue « monde » : canvas +surpasses + panneau */
function gVueMonde(){
  gEls.panel.classList.remove('open');
  if(S.panelOuvert) gEls.panel.classList.add('open');
  else gEls.gpMax.style.display = '';
  gEls.pos.style.display = gPositionActuelle() ? '' : 'none';
  gEls.reach.innerHTML = '';
  gEls.reach.style.display = 'none';

  /* --- la scène : canvas plein cadre --- */
  const cv = document.createElement('canvas');
  cv.id = 'gCv3d';
  gEls.cv3d = cv;
  gEls.stage.appendChild(cv);
  g3dCtx = (typeof cv.getContext === 'function') ? cv.getContext('2d') : null;

  /* --- bandeau compteur --- */
  const hud = document.createElement('div');
  hud.className = 'g3dhud';
  hud.id = 'g3dHud';
  gEls.hud = hud;
  gEls.stage.appendChild(hud);

  /* --- infobulle de survol --- */
  const tip = document.createElement('div');
  tip.className = 'gtip';
  tip.id = 'gTip';
  tip.style.display = 'none';
  gEls.tip = tip;
  gEls.stage.appendChild(tip);

  /* --- commandes : zoom, rotation, filtres --- */
  const ctl = document.createElement('div');
  ctl.className = 'g3dctl';
  ctl.id = 'g3dCtl';
  const mkB = function(id, txt, title){
    const b = document.createElement('button');
    b.className = 'gbtn'; b.id = id; b.textContent = txt;
    if(title) b.title = title;
    return b;
  };
  const bZo = mkB('g3dZo', '➖', 'Zoom arrière');
  const bZi = mkB('g3dZi', '➕', 'Zoom avant');
  const bAu = mkB('g3dAuto', '🔄 Auto', 'Rotation automatique');
  gEls.bAuto = bAu;
  ctl.appendChild(bZo); ctl.appendChild(bZi); ctl.appendChild(bAu);
  const selN = document.createElement('select');
  selN.id = 'g3dNiv';
  selN.setAttribute('aria-label', 'Filtrer par niveau');
  const optTous = document.createElement('option');
  optTous.value = '*'; optTous.textContent = '🎓 Tous les niveaux';
  selN.appendChild(optTous);
  NIVEAUX.forEach(function(v){
    const n = NOTIONS.filter(function(n2){ return NOTION_LEVELS[n2.id] === v.code; }).length;
    const o = document.createElement('option');
    o.value = v.code;
    o.textContent = v.icon + ' ' + v.court + ' (' + n + ')';
    if(S.g3d.niv === v.code) o.selected = true;
    selN.appendChild(o);
  });
  selN.value = (S.g3d.niv === '*') ? '*' : S.g3d.niv;
  ctl.appendChild(selN);
  const selC = document.createElement('select');
  selC.id = 'g3dCat';
  selC.setAttribute('aria-label', 'Filtrer par zone');
  const optToutes = document.createElement('option');
  optToutes.value = '*'; optToutes.textContent = '🌍 Toutes les zones';
  selC.appendChild(optToutes);
  PROG_CATS.forEach(function(c, ci){
    let n = 0;
    (c.subs || []).forEach(function(s){ n += (s.ids || []).length; });
    const o = document.createElement('option');
    o.value = String(ci);
    o.textContent = c.icon + ' ' + c.nom + ' (' + n + ')';
    if(String(S.g3d.cat) === String(ci)) o.selected = true;
    selC.appendChild(o);
  });
  selC.value = String(S.g3d.cat);
  ctl.appendChild(selC);
  gEls.selN = selN; gEls.selC = selC;
  gEls.stage.appendChild(ctl);

  const zi = function(f){ S.g3d.zoom = Math.max(0.5, Math.min(2.8, S.g3d.zoom * f)); g3dRendre(); };
  bZo.addEventListener('click', function(){ zi(0.82); });
  bZi.addEventListener('click', function(){ zi(1.22); });
  bAu.addEventListener('click', function(){ tdmGrapheAuto(!S.g3d.auto); });
  selN.addEventListener('change', function(){ tdmGrapheFiltreNiveau(selN.value); });
  selC.addEventListener('change', function(){ tdmGrapheFiltreCat(selC.value === '*' ? '*' : +selC.value); });
  g3dSyncBoutonAuto();

  /* --- interactions directes sur le canvas --- */
  cv.addEventListener('pointerdown', function(e){
    if(!e || e.clientX == null) return;
    g3dDrag = { x: e.clientX, y: e.clientY, bouge: false };
    if(S.g3d.auto) tdmGrapheAuto(false);
    try{ if(cv.setPointerCapture && e.pointerId != null) cv.setPointerCapture(e.pointerId); }
    catch(err){}
  });
  cv.addEventListener('pointermove', function(e){
    if(!e || e.clientX == null) return;
    if(g3dDrag){
      const dx = e.clientX - g3dDrag.x, dy = e.clientY - g3dDrag.y;
      if(!g3dDrag.bouge && dx * dx + dy * dy < 25) return;
      g3dDrag.bouge = true;
      g3dDrag.x = e.clientX; g3dDrag.y = e.clientY;
      S.g3d.yaw += dx * 0.0052;
      S.g3d.pitch = Math.max(-0.2, Math.min(1.32, S.g3d.pitch + dy * 0.0042));
      g3dRendre();
      if(gEls.tip) gEls.tip.style.display = 'none';
    } else if(S.centre.type === 'monde'){
      /* survol : infobulle de la notion la plus proche */
      const r = gEls.gbody.getBoundingClientRect ? gEls.gbody.getBoundingClientRect()
        : { left: 0, top: 0 };
      const id = g3dPick((e.clientX || 0) - (r.left || 0), (e.clientY || 0) - (r.top || 0), 13);
      if(id !== g3dSurvol){ g3dSurvol = id; g3dDessine(); }
      if(id) g3dTip(e, id);
      else if(gEls.tip) gEls.tip.style.display = 'none';
    }
  });
  const g3dRelache = function(e){
    if(!g3dDrag) return;
    const bouge = g3dDrag.bouge;
    g3dDrag = null;
    if(bouge) return;
    /* un vrai clic (pas un glisser) : sélectionner la notion visée */
    const r = gEls.gbody.getBoundingClientRect ? gEls.gbody.getBoundingClientRect()
      : { left: 0, top: 0 };
    const id = g3dPick((e && e.clientX || 0) - (r.left || 0), (e && e.clientY || 0) - (r.top || 0), 15);
    if(id) tdmGrapheSelect(id);
    else if(S.sel){ S.sel = null; g3dSurvol = null; gPanneauMonde(); g3dRendre(); }
  };
  cv.addEventListener('pointerup', g3dRelache);
  cv.addEventListener('pointercancel', function(){ g3dDrag = null; });
  cv.addEventListener('wheel', function(e){
    if(!e) return;
    if(e.preventDefault) e.preventDefault();
    zi(e.deltaY < 0 ? 1.14 : 0.88);
  }, { passive: false });

  /* --- panneau : vue générale ou notion sélectionnée --- */
  gPanneauMonde();
  g3dRendre();
  g3dStart();
}

/* bouton « rotation auto » : état allumé / éteint */
function g3dSyncBoutonAuto(){
  const b = gEls && gEls.bAuto;
  if(b){
    if(S.g3d.auto){ b.classList.add('on'); b.className = 'gbtn on'; }
    else { b.classList.remove('on'); b.className = 'gbtn'; }
    b.textContent = S.g3d.auto ? '🔄 Auto' : '⏸ Auto';
  }
}

/* panneau de la vue générale : guide + statistiques cliquables,
   ou fiche de la notion sélectionnée */
function gPanneauMonde(){
  if(S.sel && IDX.byId[S.sel]){
    const id = S.sel;
    const cls = IDX.cls[id] || { c: 0, s: -1 };
    const cat = PROG_CATS[cls.c] || { icon: '❓', nom: '?', subs: [] };
    gPanneauNotion(id, IDX.byId[id], cls, cat);
    gEls.gpBody.innerHTML +=
      '<p class="gexpl"><button class="gbtn" data-gnotion="' + id + '">🧭 Ouvrir le sous-graphe 2D</button></p>';
    return;
  }
  gEls.gpFil.textContent = 'Vue générale du programme';
  gEls.gpTitre.textContent = '🌍 La constellation du programme';
  const nVal = NOTIONS.filter(function(n){ return state.validated.has(n.id); }).length;
  gEls.gpBadges.innerHTML =
    '<span class="gpbadge">' + NOTIONS.length + ' notions</span>' +
    '<span class="gpbadge">' + PROG_CATS.length + ' zones</span>' +
    '<span class="gpbadge">7 niveaux</span>' +
    '<span class="gpbadge ' + (nVal ? 'ok' : '') + '">✔ ' + nVal + ' validée' + (nVal > 1 ? 's' : '') + '</span>';
  const degs = NOTIONS.map(function(n){ return { id: n.id, d: (IDX.adj[n.id] || []).length }; })
    .sort(function(a, b){ return b.d - a.d; }).slice(0, 8);
  let h = '<h5 class="gold">🖱️ Piloter la constellation</h5><ul class="gguide">' +
    '<li><b>Glisser</b> : faire pivoter le programme</li>' +
    '<li><b>Molette ou ➕➖</b> : zoomer</li>' +
    '<li><b>Clic sur un point</b> : sélectionner la notion — ses liens 📘 les plus forts sont mis en avant, le panneau détaille</li>' +
    '<li><b>🧭 Sous-graphe 2D</b> : zoomer sur un quartier pour l’explorer de proche en proche</li></ul>';
  h += '<h5>💡 Les notions les plus connectées</h5><div class="gsib">';
  degs.forEach(function(o){
    h += '<button data-gnotion="' + o.id + '">' + (IDX.byId[o.id] ? IDX.byId[o.id].name : o.id) +
      ' <small>(' + o.d + ')</small></button>';
  });
  h += '</div>';
  h += '<h5>🧗 Explorer par niveau de classe</h5><div class="gsib">';
  NIVEAUX.forEach(function(v, li){
    const n = NOTIONS.filter(function(n2){ return NOTION_LEVELS[n2.id] === v.code; }).length;
    h += '<button data-gniv="' + li + '">' + v.icon + ' ' + v.court + ' <small>(' + n + ')</small></button>';
  });
  h += '</div>';
  h += '<h5>📦 Explorer par zone du programme</h5><div class="gsib">';
  PROG_CATS.forEach(function(c, ci){
    let n = 0;
    (c.subs || []).forEach(function(s){ n += (s.ids || []).length; });
    h += '<button data-gcat="' + ci + '">' + c.icon + ' ' + c.nom + ' <small>(' + n + ')</small></button>';
  });
  h += '</div>';
  h += '<p class="gpnote">Dans la constellation, la <b>hauteur</b> est le niveau de classe ' +
    '(🌱 cycle 3 en bas → 🏛 CPGE au sommet) et les <b>couleurs</b> distinguent les ' +
    PROG_CATS.length + ' zones. Les traits 🔗 relient les notions d’une même famille, ' +
    'les traits ⚙ les exercices partagés : les ponts entre zones se voient d’un coup d’œil. ' +
    'Liaisons générales : ' + IDX.e3sub + ' 🔗, ' + IDX.e3gen + ' ⚙ et ' + IDX.e3fiche +
    ' ponts 📘 entre zones — sans compter les liens détaillés de la notion sélectionnée.</p>';
  gEls.gpBody.innerHTML = h;
  gEls.gpBody.scrollTop = 0;
  if(typeof typeset === 'function') typeset([gEls.gpBody]);
}

/* ============================================================
   RENDU PRINCIPAL (aiguillage des vues)
   ============================================================ */
function gRendre(){
  if(!gEls || !IDX) return;
  const c0 = S.centre;
  const cle = c0.type + ':' + (c0.id != null ? c0.id : (c0.c || 0) + ':' + (c0.s || 0));
  if(cle !== S.cleVue){ S.cleVue = cle; S.pos = {}; }
  const etaitMonde = (S.centrePrec && S.centrePrec.type === 'monde');
  S.centrePrec = { type: c0.type, id: c0.id, c: c0.c, s: c0.s };
  gLiens = [];
  gNoeudsVue = [];
  gLabGroupe = null;
  g3dSurvol = null;
  gPopFerme();
  if(etaitMonde && c0.type !== 'monde'){
    g3dStop();
    g3dCtx = null;
  }
  gVider(gEls.stage);
  gVider(gEls.links);
  gEls.panel.classList.remove('open');
  gEls.gpMax.style.display = 'none';
  gEls.reach.innerHTML = '';
  gEls.reach.style.display = 'none';
  const idPos = gPositionActuelle();
  gEls.pos.style.display = (c0.type !== 'monde' && idPos) ? '' : 'none';
  gRendreTrail();
  gLegende(c0.type);
  const c = S.centre;
  if(c.type === 'monde'){
    gVueMonde();
  } else {
    if(c.type === 'cat') gVueCat(c.c);
    else if(c.type === 'sub') gVueSub(c.c, c.s);
    else gVueNotion(c.id);
    /* panneau repliable : le graphe occupe alors toute la largeur */
    if(S.panelOuvert) gEls.panel.classList.add('open');
    else gEls.gpMax.style.display = '';
    /* anti-chevauchement : on écarte les nœuds qui se touchent,
       puis les traits suivent et les étiquettes trouvent un creux */
    gEvite();
    gLiens.forEach(gMajLien);
    gPlacerEtiquettes();
  }
}

/* fil du chemin (breadcrumb) */
function gRendreTrail(){
  const t = gEls.trail;
  gVider(t);
  const home = document.createElement('button');
  home.className = 'gchip';
  home.innerHTML = '🌍 Vue générale';
  home.addEventListener('click', function(){ gAller({ type: 'monde' }, null); });
  t.appendChild(home);
  S.trail.forEach(function(tc, i){
    if(tc.type === 'monde') return;
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
  const panneauOuvert = (S.centre.type !== 'monde') && S.panelOuvert && (w > 760);
  const cx = panneauOuvert ? (w - 316) / 2 : w / 2;
  const cy = h / 2 - 6;
  const maxR = Math.max(90, Math.min(cx - 80, h / 2 - 64));
  return { w: w, h: h, cx: cx, cy: cy, maxR: maxR, panneauOuvert: panneauOuvert };
}
function gPosAnneau(g, R, i, n, decal){
  const a = -Math.PI / 2 + (i / Math.max(1, n)) * 2 * Math.PI + (decal || 0);
  return { x: g.cx + R * Math.cos(a), y: g.cy + R * 0.82 * Math.sin(a) };
}

/* création d'un nœud 2D (déplaçable au doigt / à la souris) */
function gNoeud(g, x, y, opt){
  const el = document.createElement('button');
  const k = opt.key || opt.label;
  if(S.pos[k]){ x = S.pos[k].x; y = S.pos[k].y; }
  x = Math.max(50, Math.min(g.w - 50, x));
  y = Math.max(30, Math.min(g.h - 30, y));
  el.className = 'gnode apparait' + (opt.centre ? ' centre' : '') + (opt.espece === 'sub' ? ' sub' : '');
  el.style.left = Math.round(x) + 'px';
  el.style.top = Math.round(y) + 'px';
  el.__key = k;
  el.__pos = { x: x, y: y };
  el.__bornes = { w: g.w, h: g.h };
  el.__drag = null;
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
  if(opt.onClick) el.addEventListener('click', function(e){
    if(el.__apresDrag){ el.__apresDrag = false; return; }  /* c'était un déplacement */
    opt.onClick(e);
  });
  el.addEventListener('pointerdown', function(e){ gDragDebut(e, el); });
  el.addEventListener('pointermove', function(e){ gDragBouge(e, el); });
  el.addEventListener('pointerup', function(e){ gDragFin(el); });
  el.addEventListener('pointercancel', function(){ gDragFin(el); });
  gNoeudsVue.push(el);
  gEls.stage.appendChild(el);
  return el;
}

/* ---------- glisser-déposer d'un nœud 2D : les liaisons suivent ---------- */
function gDragDebut(e, el){
  if(!e || e.clientX == null) return;
  el.__drag = { x0: e.clientX, y0: e.clientY, l: el.__pos.x, t: el.__pos.y, bouge: false };
  try{ if(el.setPointerCapture && e.pointerId != null) el.setPointerCapture(e.pointerId); }
  catch(err){}
}
function gDragBouge(e, el){
  const d = el.__drag;
  if(!d || e.clientX == null) return;
  const dx = e.clientX - d.x0, dy = e.clientY - d.y0;
  if(!d.bouge && dx * dx + dy * dy < 36) return;   /* seuil : un clic reste un clic */
  if(!d.bouge){ d.bouge = true; el.classList.add('dragging'); gPopFerme(); }
  const b = el.__bornes;
  const x = Math.max(50, Math.min(b.w - 50, d.l + dx));
  const y = Math.max(30, Math.min(b.h - 30, d.t + dy));
  el.__pos = { x: x, y: y };
  el.style.left = Math.round(x) + 'px';
  el.style.top = Math.round(y) + 'px';
  gLiens.forEach(function(L){ if(L.n1 === el || L.n2 === el) gMajLien(L); });
  gPlacerEtiquettes();
}
function gDragFin(el){
  const d = el.__drag;
  el.__drag = null;
  el.classList.remove('dragging');
  if(d && d.bouge){
    el.__apresDrag = true;
    gEvite();
    gLiens.forEach(gMajLien);
    gPlacerEtiquettes();
    S.pos[el.__key] = { x: el.__pos.x, y: el.__pos.y };
  }
}

/* ---------- trait étiqueté entre deux nœuds + survol explicatif ---------- */
function gLien(x1, y1, x2, y2, type, etiquette, dash, n1, n2, info){
  const NS = 'http://www.w3.org/2000/svg';
  const mk = document.createElementNS
    ? function(t){ return document.createElementNS(NS, t); }
    : function(t){ return document.createElement(t); };
  const coul = G_TYPE_LIEN[type] ? G_TYPE_LIEN[type].coul : '#b87900';
  const A = n1 ? n1.__pos : { x: x1, y: y1 };
  const B = n2 ? n2.__pos : { x: x2, y: y2 };
  const l = mk('line');
  l.setAttribute('x1', Math.round(A.x)); l.setAttribute('y1', Math.round(A.y));
  l.setAttribute('x2', Math.round(B.x)); l.setAttribute('y2', Math.round(B.y));
  l.setAttribute('stroke', coul);
  l.setAttribute('opacity', '0.55');
  if(dash) l.setAttribute('class', 'dash');
  gEls.links.appendChild(l);
  const hit = mk('line');
  hit.setAttribute('x1', Math.round(A.x)); hit.setAttribute('y1', Math.round(A.y));
  hit.setAttribute('x2', Math.round(B.x)); hit.setAttribute('y2', Math.round(B.y));
  hit.setAttribute('class', 'ghit');
  gEls.links.appendChild(hit);
  const L = { line: l, hit: hit, lab: null, type: type, info: info || null,
              p1: { x: A.x, y: A.y }, p2: { x: B.x, y: B.y },
              n1: n1 || null, n2: n2 || null };
  hit.addEventListener('mouseenter', function(e){
    l.setAttribute('opacity', '0.95');
    gPopOuvre(e, L);
  });
  hit.addEventListener('mouseleave', function(){
    l.setAttribute('opacity', '0.55');
    gPopFerme();
  });
  if(etiquette){
    const lab = document.createElement('div');
    lab.className = 'glab';
    lab.textContent = etiquette;
    lab.style.left = Math.round((A.x + B.x) / 2) + 'px';
    lab.style.top = Math.round((A.y + B.y) / 2) + 'px';
    lab.style.borderColor = coul;
    gEls.stage.appendChild(lab);
    L.lab = lab;
  }
  gLiens.push(L);
}
function gMajLien(L){
  const a = L.n1 ? L.n1.__pos : L.p1, b = L.n2 ? L.n2.__pos : L.p2;
  [L.line, L.hit].forEach(function(l){
    l.setAttribute('x1', Math.round(a.x)); l.setAttribute('y1', Math.round(a.y));
    l.setAttribute('x2', Math.round(b.x)); l.setAttribute('y2', Math.round(b.y));
  });
  if(L.lab){
    const boxes = gBoitesNoeuds(4);
    const labBoxes = [];
    gPlacerLab(L, boxes, labBoxes);
  }
}

/* ---------- étiquette explicative au survol d'une liaison 2D ---------- */
function gPopOuvre(e, L){
  const T = G_TYPE_LIEN[L.type] || {};
  const coul = T.coul || '#b87900';
  gEls.pop.innerHTML =
    '<div class="gpop-t" style="border-color:' + coul + ';color:' + coul + '">' +
      (T.icone || '🔗') + ' ' + (L.info && L.info.titre ? L.info.titre : (T.nom || 'liaison')) + '</div>' +
    '<div class="gpop-x">' + (L.info && L.info.texte ? L.info.texte : '') + '</div>';
  gEls.pop.style.display = '';
  const r = gEls.gbody.getBoundingClientRect ? gEls.gbody.getBoundingClientRect()
    : { left: 0, top: 0, width: 1280, height: 800 };
  const w = r.width || 1280, h = r.height || 800;
  let x = (e.clientX || 0) - (r.left || 0) + 16;
  let y = (e.clientY || 0) - (r.top || 0) + 16;
  if(x + 310 > w) x = (e.clientX || 0) - (r.left || 0) - 316;
  if(y + 140 > h) y = Math.max(8, (e.clientY || 0) - (r.top || 0) - 146);
  gEls.pop.style.left = Math.max(8, Math.round(x)) + 'px';
  gEls.pop.style.top = Math.max(8, Math.round(y)) + 'px';
}
function gPopFerme(){
  if(gEls && gEls.pop) gEls.pop.style.display = 'none';
}

/* ---------- anti-chevauchement (nœuds et étiquettes 2D) ---------- */
function gTailleNoeud(el){
  let w = el.offsetWidth || 0, h = el.offsetHeight || 0;
  if(w && h) return { w: w, h: h };
  let spans = 0, lab = '';
  (el.children || []).forEach(function(c){
    if(((c.className || '') + '').indexOf('gstat') < 0){
      spans++;
      if(!lab) lab = c.textContent || '';
    }
  });
  w = Math.min(176, Math.max(58, ((lab || '').length || 3) * 6.8 + 26));
  h = 22 + spans * 15;
  if(((el.className || '') + '').indexOf('centre') >= 0){ h += 8; w = Math.min(200, w + 14); }
  return { w: w, h: h };
}
function gTailleLab(lab){
  const s = (lab.textContent || '').length || 6;
  if(s <= 20) return { w: Math.min(200, Math.max(56, s * 6.4 + 18)), h: 22 };
  const w = 150;
  const lignes = Math.max(1, Math.ceil((s * 6.4) / (w - 18)));
  return { w: w, h: 14 + lignes * 15 };
}
function gTouche(c, t, boxes, marge){
  marge = marge || 0;
  for(let i = 0; i < boxes.length; i++){
    const b = boxes[i];
    if(Math.abs(c.x - b.x) < (t.w + b.w) / 2 + marge &&
       Math.abs(c.y - b.y) < (t.h + b.h) / 2 + marge) return true;
  }
  return false;
}
function gBoitesNoeuds(marge){
  marge = marge || 0;
  return gNoeudsVue.map(function(el){
    const t = gTailleNoeud(el);
    return { x: el.__pos.x, y: el.__pos.y, w: t.w + marge, h: t.h + marge };
  });
}
function gEvite(){
  if(gNoeudsVue.length < 2) return;
  const P = gNoeudsVue.map(function(el){
    const t = gTailleNoeud(el);
    return { el: el, x: el.__pos.x, y: el.__pos.y, w: t.w, h: t.h,
             centre: ((el.className || '') + '').indexOf('centre') >= 0 };
  });
  const bornes = P[0].el.__bornes || { w: 1280, h: 800 };
  const GX = 9, GY = 7;
  for(let it = 0; it < 90; it++){
    let contact = false;
    for(let i = 0; i < P.length; i++){
      for(let j = i + 1; j < P.length; j++){
        const a = P[i], b = P[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const ox = (a.w + b.w) / 2 + GX - Math.abs(dx);
        const oy = (a.h + b.h) / 2 + GY - Math.abs(dy);
        if(ox > 0 && oy > 0){
          contact = true;
          if(ox < oy){
            const s = dx === 0 ? (i % 2 ? 1 : -1) : (dx < 0 ? -1 : 1);
            const pa = a.centre ? 0 : (b.centre ? 1 : 0.5);
            a.x -= s * ox * pa; b.x += s * ox * (1 - pa);
          } else {
            const s = dy === 0 ? (j % 2 ? 1 : -1) : (dy < 0 ? -1 : 1);
            const pa = a.centre ? 0 : (b.centre ? 1 : 0.5);
            a.y -= s * oy * pa; b.y += s * oy * (1 - pa);
          }
        }
      }
    }
    if(!contact) break;
  }
  P.forEach(function(p){
    p.x = Math.max(52, Math.min(bornes.w - 52, p.x));
    p.y = Math.max(32, Math.min(bornes.h - 32, p.y));
    p.el.__pos = { x: p.x, y: p.y };
    p.el.style.left = Math.round(p.x) + 'px';
    p.el.style.top = Math.round(p.y) + 'px';
  });
}
function gChercheLibre(c0, t, boxes, labBoxes, rayonMax){
  rayonMax = rayonMax || 210;
  for(let r = 22; r <= rayonMax; r += 22){
    for(let k = 0; k < 10; k++){
      const ang = (k / 10) * 2 * Math.PI + (r / 22) * 0.31;
      const c = { x: c0.x + r * Math.cos(ang), y: c0.y + r * 0.72 * Math.sin(ang) };
      if(gScore(c, t, boxes) + gScore(c, t, labBoxes) === 0) return c;
    }
  }
  return null;
}
function gPlacerLab(L, boxes, labBoxes){
  const a = L.n1 ? L.n1.__pos : L.p1, b = L.n2 ? L.n2.__pos : L.p2;
  const lab = L.lab;
  const t = gTailleLab(lab);
  const dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const px = -dy / len, py = dx / len;
  const TS = [0.5, 0.6, 0.4, 0.68, 0.32, 0.76, 0.24, 0.84, 0.16, 0.9, 0.1];
  const OFFS = [0, 20, -20, 34, -34, 48, -48, 64, -64, 82, -82, 100, -100];
  let best = null, bestScore = Infinity;
  for(let i = 0; i < TS.length; i++){
    for(let j = 0; j < OFFS.length; j++){
      const c = { x: a.x + dx * TS[i] + px * OFFS[j], y: a.y + dy * TS[i] + py * OFFS[j] };
      const score = gScore(c, t, boxes) + gScore(c, t, labBoxes);
      if(score === 0){
        lab.style.left = Math.round(c.x) + 'px';
        lab.style.top = Math.round(c.y) + 'px';
        labBoxes.push({ x: c.x, y: c.y, w: t.w + 4, h: t.h + 4 });
        return;
      }
      if(score < bestScore){ bestScore = score; best = c; }
    }
  }
  const milieu = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const libre = gChercheLibre(milieu, t, boxes, labBoxes);
  if(libre){
    lab.style.left = Math.round(libre.x) + 'px';
    lab.style.top = Math.round(libre.y) + 'px';
    labBoxes.push({ x: libre.x, y: libre.y, w: t.w + 4, h: libre.h ? libre.h : (t.h + 4) });
    return;
  }
  const c = best || milieu;
  lab.style.left = Math.round(c.x) + 'px';
  lab.style.top = Math.round(c.y) + 'px';
  labBoxes.push({ x: c.x, y: c.y, w: t.w, h: t.h });
}
function gScore(c, t, boxes){
  let s = 0;
  for(let i = 0; i < boxes.length; i++){
    const b = boxes[i];
    const ox = (t.w + b.w) / 2 + 4 - Math.abs(c.x - b.x);
    const oy = (t.h + b.h) / 2 + 4 - Math.abs(c.y - b.y);
    if(ox > 0 && oy > 0) s += ox * oy;
  }
  return s;
}
function gPlacerGroupe(boxes, labBoxes){
  if(!gLabGroupe) return;
  const lab = gLabGroupe.el, t = gTailleLab(lab);
  const P0 = gLabGroupe;
  const OFFS = [[0, 0], [0, -30], [0, 30], [-48, 0], [48, 0], [0, -56], [0, 56],
                [-80, -22], [80, -22], [0, -82], [0, 82], [-110, 0], [110, 0]];
  let best = null, bestScore = Infinity;
  for(let i = 0; i < OFFS.length; i++){
    const c = { x: P0.x + OFFS[i][0], y: P0.y + OFFS[i][1] };
    const score = gScore(c, t, boxes) + gScore(c, t, labBoxes);
    if(score === 0){
      lab.style.left = Math.round(c.x) + 'px';
      lab.style.top = Math.round(c.y) + 'px';
      labBoxes.push({ x: c.x, y: c.y, w: t.w + 4, h: t.h + 4 });
      return;
    }
    if(score < bestScore){ bestScore = score; best = c; }
  }
  const libre = gChercheLibre({ x: P0.x, y: P0.y }, t, boxes, labBoxes);
  if(libre){
    lab.style.left = Math.round(libre.x) + 'px';
    lab.style.top = Math.round(libre.y) + 'px';
    labBoxes.push({ x: libre.x, y: libre.y, w: t.w + 4, h: t.h + 4 });
    return;
  }
  if(best){
    lab.style.left = Math.round(best.x) + 'px';
    lab.style.top = Math.round(best.y) + 'px';
    labBoxes.push({ x: best.x, y: best.y, w: t.w, h: t.h });
  }
}
function gPlacerEtiquettes(){
  if(S.centre.type === 'monde') return;
  const boxes = gBoitesNoeuds(4);
  const labBoxes = [];
  gPlacerGroupe(boxes, labBoxes);
  gLiens.forEach(function(L){ if(L.lab) gPlacerLab(L, boxes, labBoxes); });
  const plus = (gEls.stage.children || []).filter(function(c){
    return ((c.className || '') + '').indexOf('gplus') >= 0;
  })[0];
  if(plus){
    const t = { w: 220, h: 26 };
    let px = parseFloat(plus.style.left) || 0, py = parseFloat(plus.style.top) || 0;
    for(let k = 0; k < 5 && (gTouche({ x: px, y: py }, t, boxes, 2) ||
                             gTouche({ x: px, y: py }, t, labBoxes, 2)); k++){
      py -= 32;
    }
    plus.style.top = Math.max(44, Math.round(py)) + 'px';
  }
}

/* statut d'une notion pour badge nœud */
function gStatut(id){
  if(state.validated.has(id)) return 'ok';
  if(state.passed.has(id)) return 'skip';
  return null;
}

/* ---------- vue catégorie : ses sous-catégories ---------- */
function gVueCat(ci){
  const cat = PROG_CATS[ci];
  const g = gGeometrie();
  const subs = cat.subs || [];
  const R = g.maxR * (subs.length > 8 ? 0.94 : 0.72);
  const centre = gNoeud(g, g.cx, g.cy, {
    key: 'C', centre: true, label: cat.icon + ' ' + cat.nom, bord: gCatColor(ci),
    count: subs.length + ' sous-catégorie' + (subs.length > 1 ? 's' : ''),
    title: 'Glisser pour placer · cliquer sur un satellite pour explorer'
  });
  const sats = [];
  subs.forEach(function(s, si){
    const pos = gPosAnneau(g, R, si, subs.length);
    const noms = (s.ids || []).map(function(x){
      return '« ' + (IDX.byId[x] ? IDX.byId[x].name : x) + ' »';
    }).join(', ');
    const info = {
      titre: '📁 Sous-catégorie « ' + s.nom + ' »',
      texte: 'Elle regroupe ' + (s.ids || []).length + ' notion' + ((s.ids || []).length > 1 ? 's' : '') +
        ' de la zone « ' + cat.nom + ' »' + (noms ? ' : ' + noms : '') +
        '. Toutes ces notions sont directement reliées entre elles (lien 🔗).'
    };
    const n = gNoeud(g, pos.x, pos.y, {
      key: 's' + si, espece: 'sub', label: s.nom, bord: gCatColor(ci),
      count: (s.ids || []).length + ' notion' + ((s.ids || []).length > 1 ? 's' : ''),
      title: 'Cliquer pour voir les notions de « ' + s.nom + ' » · glisser pour déplacer',
      onClick: function(){ gAller({ type: 'sub', c: ci, s: si }, null); }
    });
    sats.push({ n: n, info: info });
  });
  sats.forEach(function(o){ gLien(g.cx, g.cy, 0, 0, 'sub', null, false, centre, o.n, o.info); });
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
  const g = gGeometrie();
  const ids = sub.ids || [];
  const deuxAnneaux = ids.length > 9;
  const R1 = g.maxR * 0.6, R2 = g.maxR * 0.95;
  const n1 = deuxAnneaux ? Math.ceil(ids.length / 2) : ids.length;
  const centre = gNoeud(g, g.cx, g.cy, {
    key: 'C', centre: true, label: sub.nom, bord: gCatColor(ci),
    count: ids.length + ' notion' + (ids.length > 1 ? 's' : ''),
    title: 'Glisser pour placer · cliquer sur une notion pour l’explorer'
  });
  const sats = [];
  ids.forEach(function(id, i){
    const ring = deuxAnneaux && i >= n1 ? 2 : 1;
    const idx = ring === 2 ? i - n1 : i;
    const n = ring === 2 ? ids.length - n1 : n1;
    const pos = gPosAnneau(g, ring === 2 ? R2 : R1, idx, n, ring === 2 ? Math.PI / n : 0);
    const nd = IDX.byId[id];
    const info = {
      titre: '🔗 Lien direct — même sous-catégorie',
      texte: '« ' + (nd ? nd.name : id) + ' » appartient à la sous-catégorie « ' + sub.nom +
        ' » (zone « ' + cat.nom + ' »). Toutes les notions de « ' + sub.nom +
        ' » sont reliées entre elles : c’est le lien 🔗 le plus fort du programme.'
    };
    const el = gNoeud(g, pos.x, pos.y, {
      key: id, label: nd ? nd.name : id, bord: gCatColor(ci),
      stat: gStatut(id),
      etage: nd ? NOTIONS.indexOf(nd) + 1 : null,
      title: 'Cliquer pour en faire le centre du graphe · glisser pour déplacer',
      onClick: function(){ gAller({ type: 'notion', id: id }, null); }
    });
    sats.push({ el: el, info: info });
  });
  sats.forEach(function(o){ gLien(g.cx, g.cy, 0, 0, 'sub', null, false, centre, o.el, o.info); });
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

/* ---------- vue notion : le sous-graphe 2D centré ---------- */
function gVueNotion(id){
  const nd = IDX.byId[id];
  if(!nd) return;
  const cls = IDX.cls[id] || { c: 0, s: -1 };
  const cat = PROG_CATS[cls.c] || { icon: '❓', nom: '?', subs: [] };
  const sub = (cat.subs || [])[cls.s] || null;
  const g = gGeometrie();
  const v = gVoisinsAffiche(id, S.ficheOff);
  const R1 = g.maxR * 0.58;
  const R2 = g.maxR * 0.95;

  const centre = gNoeud(g, g.cx, g.cy, {
    key: 'C', centre: true, label: nd.name, bord: gCatColor(cls.c),
    etage: NOTIONS.indexOf(nd) + 1,
    stat: gStatut(id),
    title: 'Glisser pour placer la notion au milieu de ses liens'
  });

  /* anneau 1 : mêmes sous-catégorie (lien fort 🔗) */
  const sats1 = [];
  v.ring1.forEach(function(e, i){
    const pos = gPosAnneau(g, R1, i, Math.max(1, v.ring1.length));
    const other = IDX.byId[e.id];
    const info = {
      titre: '🔗 Lien direct — même sous-catégorie',
      texte: '« ' + (other ? other.name : e.id) + ' » et « ' + nd.name +
        ' » sont apprises dans la même sous-catégorie' +
        (sub ? ' « ' + sub.nom + ' »' : '') + ' (zone « ' + cat.nom + ' »). ' +
        'Ce sont les liens les plus directs : ces notions s’éclairent mutuellement.'
    };
    const n = gNoeud(g, pos.x, pos.y, {
      key: e.id, label: other ? other.name : e.id, bord: gCatColor(cls.c),
      stat: gStatut(e.id),
      etage: other ? NOTIONS.indexOf(other) + 1 : null,
      title: 'Même sous-catégorie — cliquer pour en faire le centre · glisser pour déplacer',
      onClick: function(){ gAller({ type: 'notion', id: e.id }, undefined); }
    });
    sats1.push({ n: n, info: info });
  });
  sats1.forEach(function(o){ gLien(g.cx, g.cy, 0, 0, 'sub', null, false, centre, o.n, o.info); });
  if(v.ring1.length){
    const pos = gPosAnneau(g, R1 * 0.5, 0, Math.max(1, v.ring1.length));
    const lab = document.createElement('div');
    lab.className = 'glab';
    lab.textContent = '🔗 ' + (sub ? sub.nom : 'même sous-catégorie');
    lab.style.borderColor = G_TYPE_LIEN.sub.coul;
    gLabGroupe = { el: lab, x: g.cx + (pos.x - g.cx) * 0.9, y: g.cy - 14 + (pos.y - g.cy) * 0.25 };
    gEls.stage.appendChild(lab);
  }

  /* anneau 2 : élément partagé ⚙ puis fiches partagées 📘 */
  const sats2 = [];
  v.ring2.forEach(function(e, i){
    const pos = gPosAnneau(g, R2, i, Math.max(1, v.ring2.length), Math.PI / Math.max(1, v.ring2.length));
    const other = IDX.byId[e.id];
    let etiquette = null, info = null;
    if(e.type === 'gen'){
      etiquette = '⚙ même exercice : ' + tdmGenLabel(e.gen);
      info = {
        titre: '⚙ Même élément d’entraînement',
        texte: '« ' + (other ? other.name : e.id) + ' » et « ' + nd.name +
          ' » s’entraînent avec le même type d’exercice : « ' + tdmGenLabel(e.gen) +
          ' ». Un lien transversal : il relie deux endroits différents du programme.'
      };
    } else if(e.type === 'fiche'){
      etiquette = '📘 ' + e.nf + ' fiche' + (e.nf > 1 ? 's' : '') + ' commune' + (e.nf > 1 ? 's' : '');
      const communes = Object.keys(IDX.fichesOf[id] || {}).filter(function(f){
        return IDX.fichesOf[e.id] && IDX.fichesOf[e.id][f];
      });
      const titres = communes.map(function(f){ return FICHES[f] ? FICHES[f].titre : f; });
      info = {
        titre: '📘 Fiches de rappel partagées',
        texte: '« ' + (other ? other.name : e.id) + ' » et « ' + nd.name + ' » partagent ' +
          e.nf + ' fiche' + (e.nf > 1 ? 's' : '') + ' de rappel' +
          (titres.length ? ' : « ' + titres.slice(0, 4).join(' », « ') + ' »' +
            (titres.length > 4 ? '…' : '') : '') + '. ' +
          'Ces fiches révisent des réflexes communs aux deux notions.'
      };
    }
    const n = gNoeud(g, pos.x, pos.y, {
      key: e.id, label: other ? other.name : e.id, bord: gCatColor((IDX.cls[e.id] || { c: cls.c }).c),
      stat: gStatut(e.id),
      etage: other ? NOTIONS.indexOf(other) + 1 : null,
      title: (e.type === 'gen' ? 'Même élément d’entraînement' : 'Fiches de rappel partagées') +
             ' — cliquer pour en faire le centre · glisser pour déplacer',
      onClick: function(){ gAller({ type: 'notion', id: e.id }, undefined); }
    });
    sats2.push({ n: n, etiquette: etiquette, info: info, type: e.type });
  });
  sats2.forEach(function(o){ gLien(g.cx, g.cy, 0, 0, o.type, o.etiquette, true, centre, o.n, o.info); });

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
  } else if(S.centre.type === 'monde' && S.sel){
    gPanneauMonde();
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
  if(S.lastRel) h += '<div class="pourquoi">🔗 <b>Lien suivi :</b> ' + S.lastRel.txt + '</div>';
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
  S.centre = { type: 'monde' };
  S.sel = idPos || null;
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
  g3dStop();
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
window.tdmGrapheMonde = function(){ gAller({ type: 'monde' }, null); };
window.tdmGrapheMode = gSetMode;
window.tdmGrapheVoisins = function(id){
  if(!IDX) gBuildIndex();
  return IDX.adj[id] || [];
};
window.tdmGrapheSelect = function(id){
  if(!IDX) gBuildIndex();
  if(id && IDX.byId[id]) S.sel = id;
  else S.sel = null;
  if(S.centre.type === 'monde'){
    g3dSurvol = null;
    gPanneauMonde();
    g3dRendre();
  }
  return S.sel;
};
window.tdmGrapheSelection = function(){ return S.sel; };
window.tdmGrapheProjeter = function(id){
  if(!gProj || !gProj[id]) return null;
  return { x: Math.round(gProj[id].x), y: Math.round(gProj[id].y), visible: true };
};
window.tdmGrapheNoeuds3D = function(){
  return gProj ? Object.keys(gProj) : [];
};
window.tdmGrapheLiens3D = function(){
  return g3dArcs.concat(g3dArcsF).map(function(e){
    return { a: e.a, b: e.b, type: e.type };
  });
};
window.tdmGrapheCamera = function(yaw, pitch, zoom){
  if(yaw != null) S.g3d.yaw = yaw;
  if(pitch != null) S.g3d.pitch = Math.max(-0.2, Math.min(1.32, pitch));
  if(zoom != null) S.g3d.zoom = Math.max(0.5, Math.min(2.8, zoom));
  if(S.ouvert && S.centre.type === 'monde') g3dRendre();
};
window.tdmGrapheAuto = function(on){
  S.g3d.auto = !!on;
  g3dSyncBoutonAuto();
  if(S.g3d.auto) g3dStart();
  else g3dStop();
};
window.tdmGrapheFiltreNiveau = function(code){
  S.g3d.niv = (code === '*' || code === 'tous') ? '*' : code;
  if(gEls && gEls.selN) gEls.selN.value = (S.g3d.niv === '*') ? '*' : S.g3d.niv;
  if(S.ouvert && S.centre.type === 'monde') g3dRendre();
};
window.tdmGrapheFiltreCat = function(ci){
  S.g3d.cat = (ci === '*' || ci === 'toutes') ? '*' : ci;
  if(gEls && gEls.selC) gEls.selC.value = String(S.g3d.cat);
  if(S.ouvert && S.centre.type === 'monde') g3dRendre();
};
window.tdmGrapheToggles = function(o){
  if(o){
    if('sub' in o) S.g3d.tsub = !!o.sub;
    if('gen' in o) S.g3d.tgen = !!o.gen;
    if('fiche' in o) S.g3d.tfiche = !!o.fiche;
  }
  if(gEls){
    if(gEls.tsubEl) gEls.tsubEl.checked = S.g3d.tsub;
    if(gEls.tgenEl) gEls.tgenEl.checked = S.g3d.tgen;
    if(gEls.tficheEl) gEls.tficheEl.checked = S.g3d.tfiche;
  }
  if(S.ouvert && S.centre.type === 'monde') g3dRendre();
};
window.tdmGrapheEtat = function(){
  return {
    centre: S.centre, hops: S.hops, trail: S.trail.length,
    voisins: S.centre.type === 'notion' ? (IDX ? (IDX.adj[S.centre.id] || []).length : 0) : 0,
    portee: S.centre.type === 'notion' ? gPortee(S.centre.id) : null,
    vue: S.centre.type,
    selection: S.sel || null,
    g3d: { yaw: S.g3d.yaw, pitch: S.g3d.pitch, zoom: S.g3d.zoom, auto: S.g3d.auto,
           niv: S.g3d.niv, cat: S.g3d.cat,
           tsub: S.g3d.tsub, tgen: S.g3d.tgen, tfiche: S.g3d.tfiche },
    visibles: { noeuds: Object.keys(gProj).length,
                liens: g3dArcs.length + g3dArcsF.length }
  };
};

/* ---------- entrée de menu ---------- */
const grapheBtn = document.getElementById('grapheBtn');
if(grapheBtn) grapheBtn.addEventListener('click', function(){
  if(S.ouvert) tdmFermeGraphe(); else tdmOuvreGraphe();
});

})();
