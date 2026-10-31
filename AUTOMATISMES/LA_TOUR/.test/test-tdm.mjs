/* Banc d'essai VM : charge les scripts de la tour dans un DOM stubbé,
   simule une session élève, déclenche des erreurs QCM et à trous, et
   vérifie la décomposition en éléments simples + solution pédagogique. */
import fs from 'node:fs';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';

const ROOT = '/home/user/la-tour-des-maths';
const scripts = fs.readdirSync(ROOT + '/js').filter(f => f.endsWith('.js')).sort();

let seed = 987654321;
function srand(){ seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }

/* ---------- DOM ---------- */
function makeClassList(){
  const s = new Set();
  return {
    add(...cs){ cs.forEach(c => s.add(c)); },
    remove(...cs){ cs.forEach(c => s.delete(c)); },
    toggle(c, force){ if(force === undefined){ s.has(c) ? s.delete(c) : s.add(c); } else { force ? s.add(c) : s.delete(c); } return s.has(c); },
    contains(c){ return s.has(c); }
  };
}
function matches(el, sel){
  if(!sel) return false;
  if(sel.startsWith('.')) return el.classList.contains(sel.slice(1));
  return el.tagName === sel.toLowerCase();
}
function makeEl(tag){
  const el = {
    tagName: (tag || 'div').toLowerCase(),
    children: [], parentElement: null, style: {}, dataset: {},
    _attrs: {}, listeners: {},
    innerHTML: '', textContent: '', value: '', disabled: false, scrollTop: 0, className: ''
  };
  el.classList = makeClassList();
  el.appendChild = c => { if(!c.parentElement) c.parentElement = el; el.children.push(c); return c; };
  el.removeChild = c => { const i = el.children.indexOf(c); if(i >= 0) el.children.splice(i, 1); return c; };
  el.addEventListener = (t, fn) => { (el.listeners[t] = el.listeners[t] || []).push(fn); };
  el.setAttribute = (k, v) => { el._attrs[k] = String(v); if(k === 'class') String(v).split(/\s+/).forEach(c => c && el.classList.add(c)); };
  el.getAttribute = k => (k in el._attrs ? el._attrs[k] : null);
  el.hasAttribute = k => k in el._attrs;
  el.getBoundingClientRect = () => ({ left: 0, top: 0, right: 1280, bottom: 800, width: 1280, height: 800 });
  el.querySelector = sel => { for(const c of el.children){ if(matches(c, sel)) return c; const d = c.querySelector(sel); if(d && d.tagName !== 'div') return d; } return makeEl('div'); };
  el.querySelectorAll = sel => { const out = []; for(const c of el.children){ if(matches(c, sel)) out.push(c); out.push(...c.querySelectorAll(sel)); } return out; };
  el.closest = sel => { let n = el; while(n){ if(matches(n, sel)) return n; n = n.parentElement; } return null; };
  el.contains = n => { let x = n; while(x){ if(x === el) return true; x = x.parentElement; } return false; };
  el.focus = () => {}; el.click = () => {};
  return el;
}
const ctxProxy = new Proxy(function(){}, {
  get(t, k){ if(k === Symbol.toPrimitive) return () => 0; if(k === 'canvas') return null; return ctxProxy; },
  set(){ return true; },
  apply(){ return ctxProxy; }
});
function makeCanvas(){
  const c = makeEl('canvas');
  c.width = 1280; c.height = 800;
  c.getContext = () => ctxProxy;
  return c;
}
const byId = new Map();
const document = {
  getElementById(id){
    if(!byId.has(id)) byId.set(id, id === 'tower' ? makeCanvas() : makeEl('div'));
    return byId.get(id);
  },
  createElement: tag => makeEl(tag),
  body: makeEl('body'),
  addEventListener(){},
  activeElement: null
};
document.body.appendChild(makeEl('div'));

/* ---------- Autres APIs ---------- */
const store = new Map();
const localStorage = {
  getItem: k => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: k => store.delete(k)
};
const sandbox = {
  console, localStorage, document,
  setTimeout, clearTimeout, setInterval, clearInterval,
  addEventListener(){}, removeEventListener(){},
  performance: { now: () => Date.now() },
  requestAnimationFrame: cb => setTimeout(() => cb(Date.now()), 5),
  requestIdleCallback: cb => setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 50 }), 5),
  crypto: webcrypto, TextEncoder, TextDecoder,
  navigator: { userAgent: 'node-test' },
  innerWidth: 1280, innerHeight: 800, devicePixelRatio: 1,
  Blob: class Blob{ constructor(parts, opts){ this.parts = parts; this.type = (opts && opts.type) || ''; } },
  URL: { createObjectURL: () => 'blob:test', revokeObjectURL: () => {} },
  FileReader: class FileReader{ readAsText(){} },
  MathJax: undefined
};
sandbox.window = sandbox;
sandbox.self = sandbox;
sandbox.Math = Object.create(Math);
sandbox.Math.random = srand;
vm.createContext(sandbox);

/* ---------- Chargement des scripts ---------- */
for(const f of scripts){
  const code = fs.readFileSync(ROOT + '/js/' + f, 'utf8');
  try {
    new vm.Script(code, { filename: f }).runInContext(sandbox);
  } catch(e){
    console.error('ÉCHEC au chargement de ' + f + ' : ' + e.message);
    process.exit(1);
  }
}
const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const call = (expr) => vm.runInContext(expr, sandbox);
const ST = () => vm.runInContext('state', sandbox);
const NOT = () => vm.runInContext('NOTIONS', sandbox);

let fail = 0;
const ok = (cond, msg) => { if(cond){ console.log('  ✔ ' + msg); } else { fail++; console.log('  ✘ ' + msg); } };

(async () => {
  console.log('== 1. Identité & démarrage ==');
  $('inpNom').value = 'dupont'; $('inpPrenom').value = 'léa-marie'; $('inpClasse').value = '2nde 3';
  call('tdmConfirmIdentity()');
  await sleep(1500);
  const st1 = ST();
  ok(st1.playing === true, 'partie lancée (state.playing)');
  ok(st1.currentNotion && st1.currentNotion.id, 'question affichée : ' + (st1.currentNotion && st1.currentNotion.id));
  ok($('idPanel').classList.contains('hidden'), 'panneau identité masqué');

  console.log('== 2. Erreur QCM → solution pédagogique ==');
  call(`
    (function(){
      const q = GEN['canonique']();
      q._notionId = 'sd-formes'; q._gen = 'canonique';
      state.lastGen = 'canonique';
      SAV.logQuestion(q, ['mauvaise réponse'], false);
      resolveAnswer(false, q);
    })()
  `);
  await sleep(1300);
  const body = $('lessonBody').innerHTML;
  ok($('lessonPanel').classList.contains('open'), 'modale leçon ouverte après la chute');
  ok(body.includes('La réponse attendue'), 'section ✅ réponse attendue présente');
  ok(body.includes('décomposée en éléments simples'), 'section 🧩 décomposition présente');
  ok(body.includes('tdm-elt-raté') && body.includes("raté à l'instant"), 'élément raté mis en évidence');
  ok(body.includes('data-tip='), 'rappels au survol (data-tip) présents');
  ok(body.includes('Rappels utiles'), 'section 📚 rappels utiles présente');
  ok(body.includes('data-fiche="second-degre"'), 'boutons fiches cliquables (data-fiche)');
  ok(body.includes('Le cours') && body.includes('La méthode') && body.includes('erreur à éviter'), 'cours/méthode/piège (q.explain) conservés');
  const rec = call('SAV.data.notions["sd-formes"]');
  ok(rec.parGen && rec.parGen['canonique'] && rec.parGen['canonique'].ko === 1, 'compteur parGen.canonique.ko = 1 (sauvegarde scellée)');
  ok(rec.questions[rec.questions.length - 1].pen !== undefined, 'chute tracée dans l\'historique scellé');
  call('tdmFermeFiche(); closeLesson()');
  await sleep(1200);

  console.log('== 3. Erreur RAISONNEMENT À TROUS → raisonnement complet ==');
  call(`
    (function(){
      const q = GEN['trouCanonique']();
      q._notionId = 'sd-formes'; q._gen = 'trouCanonique';
      state.lastGen = 'trouCanonique';
      SAV.logQuestion(q, ['pente'], false);
      resolveAnswer(false, q);
    })()
  `);
  await sleep(1300);
  const body2 = $('lessonBody').innerHTML;
  ok(body2.includes('raisonnement complet, clés en place'), 'section ✅ raisonnement complet présent');
  ok(body2.includes('tdm-sol-trou'), 'clés correctes affichées en vert (tdm-sol-trou)');
  ok(body2.includes('tdm-elt-raté'), 'élément « Raisonnement : forme canonique » mis en évidence');
  const rec2 = call('SAV.data.notions["sd-formes"]');
  ok(rec2.parGen['trouCanonique'] && rec2.parGen['trouCanonique'].ko === 1, 'compteur parGen.trouCanonique.ko = 1');
  call('closeLesson()');
  await sleep(1200);

  console.log('== 4. Fiche de rappel (modale dédiée) ==');
  call("tdmOuvreFiche('second-degre')");
  ok($('tdmFicheModal').classList.contains('open'), 'modale fiche ouverte');
  ok($('tdmFicheTitle').innerHTML.includes('Second degré'), 'titre de la fiche correct');
  ok($('tdmFicheBody').innerHTML.includes('Discriminant'), 'contenu complet (discriminant, formes, signe…)');
  call('tdmFermeFiche()');
  ok(!$('tdmFicheModal').classList.contains('open'), 'fermeture de la fiche');

  console.log('== 5. Sommaire « Progression des notions » : catégories & éléments ==');
  call('openNotions()');
  const cats5 = [...$('notionsList').children];
  ok(cats5.length === 16, '16 catégories thématiques (' + cats5.length + ')');
  ok(cats5.every(c => c.children.length && c.children[0].innerHTML.includes('prog-cat-title')), 'chaque catégorie a son en-tête cliquable');
  ok(cats5.every(c => /\d+\/\d+ validée/.test(c.children[0].innerHTML)), 'compteur « X/Y validées » par catégorie');
  const items = [];
  cats5.forEach(c => [...c.children].forEach(e => { if(e.innerHTML.includes('tdm-elems')) items.push(e); }));
  ok(items.length === 160, '160 notions listées (' + items.length + ')');
  ok([...items].every(i => i.innerHTML.includes('tdm-elt')), 'chaque notion est décomposée en éléments simples');
  ok([...items].every(i => i.innerHTML.includes('data-tip=')), 'chaque élément porte son rappel au survol');
  ok([...items].every(i => i.innerHTML.includes('tdm-elt-stats')), 'statistiques ✓/✗ par élément affichées');
  const ids5 = items.map(i => i.getAttribute('data-notion'));
  ok(ids5.every(Boolean) && new Set(ids5).size === 160 && NOT().every(n => ids5.indexOf(n.id) >= 0),
     'chaque notion apparaît exactement une fois, toutes catégories confondues');
  const catDeriv = call(`PROG_CATS.filter(c => c.nom.indexOf('Dérivation') === 0)[0]`);
  ok(catDeriv && catDeriv.subs.some(s => s.nom === 'Étude complète sur un intervalle' && s.ids.join() === 'derivee-racines-I,derivee-variations-I'),
     'sous-catégorie « Étude complète sur un intervalle » dans la catégorie Dérivation');
  const catTrigo5 = call(`PROG_CATS.filter(c => c.nom.indexOf('Trigonométrie') === 0)[0]`);
  ok(catTrigo5 && ['Degrés, radians & mesure principale', 'Symétries, rotations & coordonnées']
     .every(t => catTrigo5.subs.some(s => s.nom === t))
     && ['trigo-conversion', 'trigo-modulo', 'trigo-mesure-principale', 'trigo-symetries', 'trigo-cossin']
        .every(id => catTrigo5.subs.some(s => s.ids.indexOf(id) >= 0)),
     'catégorie « Trigonométrie » : 2 nouvelles sous-catégories (degrés/radians/mesure principale, symétries/rotations/coordonnées)');
  ok(NOT().every(n => !/automatisme/i.test(n.name)), 'aucun titre de notion ne mentionne « automatisme »');
  /* Catégorie « Équations & inéquations » : 4 sous-catégories */
  const eqCat = cats5.find(c => c.children[0].innerHTML.includes('📘 Équations &amp; inéquations'));
  const eqSubs = eqCat ? [...eqCat.children].filter(e => e.textContent).map(e => e.textContent) : [];
  ok(eqCat && ['Premier degré', 'Second degré & polynômes', "Produit d'une combinaison de 1ᵉʳ ou 2ᵈ degré", 'Lecture graphique']
     .every(t => eqSubs.indexOf(t) >= 0),
     'catégorie « Équations & inéquations » : premier degré, second degré & polynômes, produit d\'une combinaison, lecture graphique');
  const eqIds = eqCat ? [...eqCat.children].filter(e => e.innerHTML.includes('tdm-elems')).map(e => e.getAttribute('data-notion')) : [];
  ok(['c-eq1', 's-systeme', 'sd-eq', 's-eqproduit', 's-grapheq'].every(id => eqIds.indexOf(id) >= 0),
     'les notions d\'équations (1er degré, 2nd degré, produit, graphique) sont regroupées dans cette catégorie');
  /* Plier / déplier */
  const head5 = [...cats5[0].children].find(e => e.innerHTML.includes('prog-cat-chev'));
  head5.listeners.click.forEach(f => f());
  ok(cats5[0].classList.contains('folded') && head5.classList.contains('folded'), 'clic sur un titre : la catégorie se replie');
  head5.listeners.click.forEach(f => f());
  ok(!cats5[0].classList.contains('folded') && !head5.classList.contains('folded'), 'second clic : la catégorie se déplie');
  const sdItem = items.find(i => i.innerHTML.includes('Second degré — formes'));
  ok(sdItem && (sdItem.innerHTML.match(/class="tdm-elt[" ]/g) || []).length === 4, '« Second degré — formes » : 4 éléments simples (canonique, devRed, factorisation, trouCanonique)');
  ok(sdItem && sdItem.innerHTML.includes('✗1'), 'erreur commise visible dans le sommaire (✗1)');

  console.log('== 6. Notions passées décomposées ==');
  const st6 = ST();
  const cur = st6.currentNotion && st6.currentNotion.id;
  if(cur) call('passCurrentNotion()');
  await sleep(300);
  ok(ST().passed.size >= 1, 'notion mise de côté (' + cur + ')');
  call('openPassedPanel()');
  ok($('passedPanel').classList.contains('open'), 'modale notions passées ouverte');
  const pItem = $('passedList').children[0];
  ok(pItem && pItem.innerHTML.includes('passed-activate'), 'bouton « Activer » présent');
  ok(pItem && pItem.innerHTML.includes('tdm-elems mini'), 'décomposition mini des éléments simples');
  ok(pItem && pItem.innerHTML.includes('data-tip='), 'rappels au survol dans la modale passées');
  ok(pItem && pItem.innerHTML.includes('data-fiche='), 'ouverture de fiche possible depuis la modale');
  if(cur){ call(`activateNotion('${cur}')`); ok(ST().currentNotion && ST().currentNotion.id === cur, 'réactivation → nouvelle question rendue'); ok($('qText').innerHTML.length > 0, 'énoncé affiché après activation'); }

  console.log('== 7. Couverture : libellés & fiches de TOUS les éléments ==');
  const missing = [], badFiche = [], noFiche = [];
  for(const n of NOT()){
    let any = false;
    for(const g of n.g){
      const lbl = call(`tdmGenLabel('${g}')`);
      if(lbl === g) missing.push(g + ' (' + n.id + ')');
      const fiches = call(`tdmGenFiches('${g}')`);
      fiches.forEach(f => { if(!call(`FICHES['${f}'] ? true : false`)) badFiche.push(g + ' → ' + f); });
      if(fiches.length) any = true;
      try { call(`tdmGenRappel('${g}')`); } catch(e){ missing.push(g + ' (rappel: ' + e.message + ')'); }
    }
    if(!any) noFiche.push(n.id);
  }
  ok(missing.length === 0, 'libellés humains pour tous les générateurs' + (missing.length ? ' — MANQUANTS : ' + missing.slice(0, 8).join(', ') : ''));
  ok(badFiche.length === 0, 'toutes les fiches référencées existent' + (badFiche.length ? ' — ERREURS : ' + badFiche.slice(0, 8).join(', ') : ''));
  ok(noFiche.length === 0, 'chaque élément référence au moins une fiche' + (noFiche.length ? ' — NOTIONS SANS FICHE : ' + noFiche.join(', ') : ''));
  let errGen = 0;
  for(const k of Object.keys(vm.runInContext('GEN', sandbox))){
    try { const q = vm.runInContext(`GEN['${k}']()`, sandbox); if(!q || !(q.prompt || q.trou)) errGen++; } catch(e){ errGen++; console.log('    gén. en échec : ' + k + ' → ' + e.message); }
  }
  ok(errGen === 0, 'tous les générateurs produisent leurs exercices sans erreur (' + Object.keys(vm.runInContext('GEN', sandbox)).length + ' générateurs)');

  console.log('== 7bis. Segments LaTeX : trous et < > interdits ==');
  let texBad = [];
  for(const f of scripts){
    const src = fs.readFileSync(ROOT + '/js/' + f, 'utf8');
    const re = /\\\\\((?:(?!\\\\\)).)*?\\\\\)/g;
    let m;
    while((m = re.exec(src))){
      const seg = m[0];
      if(/\{\{/.test(seg)) texBad.push(f + ' : trou {{n}} dans \\( ... \\) : ' + seg.slice(0, 50));
      else if(!/\$\{/.test(seg) && !/texttt/.test(seg) && /[<>]/.test(seg))
        texBad.push(f + ' : < ou > nu dans \\( ... \\) : ' + seg.slice(0, 50));
    }
  }
  ok(texBad.length === 0, 'aucun segment LaTeX ne contient de trou ni de < > nus (MathJax)' + (texBad.length ? ' — FAUTIFS : ' + texBad.slice(0, 6).join(' | ') : ''));

  console.log('== 8. Export enseignant : éléments par notion ==');
  const data = call('tdmBuildDonnees()');
  const all = [...(data.notionsTraitees || []), ...(data.notionsATraiter || [])];
  const withElems = all.filter(n => Array.isArray(n.elements) && n.elements.length);
  ok(withElems.length === 160, 'les 160 notions exportent leurs éléments simples');
  const ex = withElems.find(n => n.nom && String(n.nom).includes('Second degré — formes'));
  ok(ex && ex.elements.length === 4 && ex.elements.every(e => e.libelle && e.posees !== undefined && e.reussies !== undefined && e.erreurs !== undefined), 'champs {generateur, libelle, posees, reussies, erreurs} présents');
  const exCanon = ex && ex.elements.find(e => e.generateur === 'canonique');
  ok(exCanon && exCanon.erreurs === 1 && exCanon.posees === 1, 'les stats de l\'erreur simulée sont dans l\'export');
  ok(data.derniereMiseAJour && /^\d{2}\/\d{2}\/\d{4} à \d{2}:\d{2}$/.test(data.derniereMiseAJour), 'export enseignant : date de dernière mise à jour présente');

  console.log('== 9. Date & heure de la dernière mise à jour (menu) ==');
  const majTxt = call('tdmMajTexte()');
  ok(majTxt && /^\d{2}\/\d{2}\/\d{4} à \d{2}:\d{2}$/.test(majTxt), 'horodatage lisible : ' + majTxt);
  ok(/^\d{4}-\d{2}-\d{2}T/.test(call('SAV.data.derniereMaj')), 'horodatage ISO conservé dans la sauvegarde scellée');
  call('tdmRefreshMaj()');
  ok($('lastSaveInfo').textContent.includes('Dernière mise à jour'), 'ligne « Dernière mise à jour » affichée dans le menu utilitaire');
  ok($('lastSaveInfo').textContent.includes(majTxt.split(' à ')[0]), 'la date du jour apparaît dans le menu');

  console.log('== 10. Nouvelles notions « évolutions & proportions » ==');
  ok(NOT().length === 160, 'la tour compte 160 notions (147 + 13 nouvelles)');
  ok(vm.runInContext('N_TOT', sandbox) === 160, 'N_TOT = 160 (HUD, altitude, finalisation)');
  const NEW_IDS = ['proportions', 'prop-de-prop', 'evol-cm', 'evol-global', 'evol-moyen'];
  const allIds = NOT().map(n => n.id);
  ok(NEW_IDS.every(id => allIds.includes(id)), 'les 5 nouvelles notions sont en sommet de tour');
  const NEW_GENS = ['propTrouve','propPartie','propTotal','trouProp','propDeProp','propDePropEff','propRemonte','cmDeTaux','tauxDeCM','cmRetour','trouCM','tauxGlobal2','vfSuccessives','tauxManquant','trouGlobal','tauxMoyen2','tauxEquivalentN','tauxAnnuelEq'];
  let genErr = 0;
  for(const g of NEW_GENS){
    for(let i = 0; i < 25; i++){
      try {
        const q = vm.runInContext(`GEN['${g}']()`, sandbox);
        if(q.options){
          const nOk = q.options.filter(o => o.ok).length;
          if(nOk !== 1) genErr++;
          if(!q.explain) genErr++;
        } else if(q.trou){
          if(!q.answers || !q.answers.length) genErr++;
        } else genErr++;
      } catch(e){ genErr++; console.log('    ' + g + ' → ' + e.message); }
    }
  }
  ok(genErr === 0, 'les 18 nouveaux générateurs : 25 tirages chacun, 1 seule bonne réponse, leçon présente');
  ok(call(`FICHES['evolutions-taux'] ? /taux (global|moyen|réciproque)/i.test(FICHES['evolutions-taux'].html) : false`), 'fiche « Évolutions & taux » créée (taux global, moyen, réciproque)');
  ok(call(`FICHES['proportionnalite'].html.includes('Proportion de proportion')`), 'fiche « Proportionnalité » enrichie (proportions de proportions)');
  /* Erreur sur un nouveau générateur → décomposition + fiche evolutions-taux */
  call(`
    (function(){
      const q = GEN['tauxGlobal2']();
      q._notionId = 'evol-global'; q._gen = 'tauxGlobal2';
      state.lastGen = 'tauxGlobal2';
      SAV.logQuestion(q, ['mauvaise'], false);
      resolveAnswer(false, q);
    })()
  `);
  await sleep(1300);
  const body3 = $('lessonBody').innerHTML;
  ok(body3.includes('décomposée en éléments simples') && body3.includes('taux global (2 évolutions)'), 'leçon d\'erreur : décomposition de la notion « Évolutions successives »');
  ok(body3.includes('data-fiche="evolutions-taux"'), 'boutons vers la fiche « Évolutions & taux » dans la leçon');
  call('closeLesson()');
  await sleep(1200);

  console.log('== 11. Révision personnalisée (menu 🎯) ==');
  call('tdmOpenRevision()');
  ok($('revisionModal').classList.contains('open'), 'modale de révision ouverte');
  ok($('revList').children.length === 160, 'les 160 notions sont proposées à la sélection');
  call(`tdmLaunchRevision(['sd-formes', 'evol-global', 'proportions'])`);
  const stR = ST();
  ok(stR.customPool && stR.customPool.size === 3, 'sélection active : 3 notions au menu de la session');
  ok($('revBadge').style.display !== 'none', 'badge « révision en cours » visible');
  ok($('revisionBtn').textContent.includes('3 notions'), 'bouton du menu mis à jour : ' + $('revisionBtn').textContent);
  const inPool = call(`
    (function(){
      for(var i = 0; i < 40; i++){
        var n = pickNotion();
        if(!n) return false;
        if(!state.customPool.has(n.id)) return false;
      }
      return true;
    })()
  `);
  ok(inPool, '40 tirages : les questions proviennent uniquement de la sélection');
  ok(ST().currentNotion && ST().customPool.has(ST().currentNotion.id), 'question affichée issue du menu choisi');
  call('tdmEndRevision()');
  ok(ST().customPool === null, 'fin de révision : retour au programme complet');
  const backToAll = call(`
    (function(){
      var seen = {};
      for(var i = 0; i < 120; i++){ var n = pickNotion(); if(n) seen[n.id] = 1; }
      return Object.keys(seen).length > 3;
    })()
  `);
  ok(backToAll, 'le tirage redevient global après la fin de la révision');

  console.log('== 12. Nouvelles notions « droites dans le plan » ==');
  const DR_IDS = ['droites-fractions', 'droites-axes', 'droites-positions', 'droites-cartesiennes', 'droites-pro', 'triangle-droites'];
  const allIds12 = NOT().map(n => n.id);
  ok(DR_IDS.every(id => allIds12.includes(id)), 'les 6 nouvelles notions sont en sommet de tour');
  ok(NOT().slice(-19,-13).every(n => DR_IDS.includes(n.id)), 'les 6 notions « droites » précèdent les sommets récents');
  const DR_GENS = ['dEqFrac2pts','dPointCoeff','dPointOrdo','dDeuxImages','dLectureGraph','dInterAxes','dSigne','dPosition2','dIntersectPt','dParallele','dPerpendiculaire','trouPosition','dVectDir','dDistance','dPointFixe','dSeuilRentabilite','dPointEquilibre','dTolerance','triGravite','triOrthocentre'];
  let drErr = 0;
  for(const g of DR_GENS){
    for(let i = 0; i < 25; i++){
      try {
        const q = vm.runInContext(`GEN['${g}']()`, sandbox);
        if(q.options){
          if(q.options.filter(o => o.ok).length !== 1) drErr++;
          if(!q.explain) drErr++;
        } else if(q.trou){
          if(!q.answers || q.answers.length !== 7) drErr++;
        } else drErr++;
      } catch(e){ drErr++; console.log('    ' + g + ' → ' + e.message); }
    }
  }
  ok(drErr === 0, 'les 20 nouveaux générateurs : 25 tirages chacun, 1 seule bonne réponse, leçon présente');
  ok(call(`FICHES['droites-plan'] ? /seuil de rentabilité/i.test(FICHES['droites-plan'].html) && /orthocentre/i.test(FICHES['droites-plan'].html) : false`), 'fiche « Droites dans le plan » créée (seuil de rentabilité, orthocentre)');
  /* Erreur sur un nouveau générateur → décomposition + fiche droites-plan */
  call(`
    (function(){
      const q = GEN['dPerpendiculaire']();
      q._notionId = 'droites-positions'; q._gen = 'dPerpendiculaire';
      state.lastGen = 'dPerpendiculaire';
      SAV.logQuestion(q, ['mauvaise'], false);
      resolveAnswer(false, q);
    })()
  `);
  await sleep(1300);
  const body4 = $('lessonBody').innerHTML;
  ok(body4.includes('décomposée en éléments simples') && body4.includes('Perpendiculaire par un point'), 'leçon d\'erreur : décomposition de la notion « Positions relatives »');
  ok(body4.includes('data-fiche="droites-plan"'), 'boutons vers la fiche « Droites dans le plan » dans la leçon');
  call('closeLesson()');
  await sleep(1200);

  console.log('== 13. Nouvelles notions « fractions & puissances » ==');
  const FP_IDS = ['fractions-egalite', 'fractions-signes', 'fractions-priorites', 'fractions-operations', 'puissances-dix', 'puissances-regles'];
  const allIds13 = NOT().map(n => n.id);
  ok(FP_IDS.every(id => allIds13.includes(id)), 'les 6 nouvelles notions sont en sommet de tour');
  ok(NOT().slice(-13,-7).every(n => FP_IDS.includes(n.id)), 'les 6 notions « fractions & puissances » précèdent le nouveau sommet');
  const FP_GENS = ['frSimplifie','frFracEgales','frCompare','trouSimplifie','frSigneProduit','frEcritureSignes','frFractionSignee','frPriorites','frPemdasPiege','trouPriorites','frAddSous','frMul','frDiv','frEntierFrac','frPuissanceFrac','frCompose','p10Ops','p10Inverse','pSciExposant','pOrdreGrandeur','puBaseRelative','puMemeExp','puLitteral','puComposee'];
  let fpErr = 0;
  for(const g of FP_GENS){
    for(let i = 0; i < 25; i++){
      try {
        const q = vm.runInContext(`GEN['${g}']()`, sandbox);
        if(q.options){
          if(q.options.filter(o => o.ok).length !== 1) fpErr++;
          if(!q.explain) fpErr++;
        } else if(q.trou){
          if(!q.answers || q.answers.length !== 7) fpErr++;
        } else fpErr++;
      } catch(e){ fpErr++; console.log('    ' + g + ' → ' + e.message); }
    }
  }
  ok(fpErr === 0, 'les 24 nouveaux générateurs : 25 tirages chacun, 1 seule bonne réponse, leçon présente');
  ok(call(`FICHES['fractions-puissances'] ? /irréductible/i.test(FICHES['fractions-puissances'].html) && /écriture scientifique/i.test(FICHES['fractions-puissances'].html) : false`), 'fiche « Fractions & puissances » créée (irréductible, écriture scientifique)');
  /* Erreur sur un nouveau générateur → décomposition + fiche fractions-puissances */
  call(`
    (function(){
      const q = GEN['frDiv']();
      q._notionId = 'fractions-operations'; q._gen = 'frDiv';
      state.lastGen = 'frDiv';
      SAV.logQuestion(q, ['mauvaise'], false);
      resolveAnswer(false, q);
    })()
  `);
  await sleep(1300);
  const body5 = $('lessonBody').innerHTML;
  ok(body5.includes('décomposée en éléments simples') && body5.includes('Division de fractions'), 'leçon d\'erreur : décomposition de la notion « Quatre opérations sur les fractions »');
  ok(body5.includes('data-fiche="fractions-puissances"'), 'boutons vers la fiche « Fractions & puissances » dans la leçon');
  call('closeLesson()');
  await sleep(1200);

  console.log('== 14. Nouvelles notions « dérivation sur un intervalle » ==');
  const ET_IDS = ['derivee-racines-I', 'derivee-variations-I'];
  const allIds14 = NOT().map(n => n.id);
  ok(ET_IDS.every(id => allIds14.includes(id)), 'les 2 nouvelles notions sont en sommet de tour');
  ok(NOT().slice(-7,-5).every(n => ET_IDS.includes(n.id)), 'elles précèdent les nouveaux sommets trigonométriques');
  const ET_GENS = ['etFacto','etRacinesI','etSigneI','etImages','etVariations','etTangente','trouEtudeDerivee'];
  let etErr = 0;
  for(const g of ET_GENS){
    for(let i = 0; i < 25; i++){
      try {
        const q = vm.runInContext(`GEN['${g}']()`, sandbox);
        if(q.options){
          if(q.options.filter(o => o.ok).length !== 1) etErr++;
          if(!q.explain) etErr++;
        } else if(q.trou){
          if(!q.answers || q.answers.length !== 7) etErr++;
        } else etErr++;
      } catch(e){ etErr++; console.log('    ' + g + ' → ' + e.message); }
    }
  }
  ok(etErr === 0, 'les 7 nouveaux générateurs : 25 tirages chacun, 1 seule bonne réponse, leçon présente');
  ok(call(`FICHES['etude-intervalle'] ? /extremum/i.test(FICHES['etude-intervalle'].html) && /tangente/i.test(FICHES['etude-intervalle'].html) : false`), 'fiche « Étude sur un intervalle » créée (extremum, tangente)');
  /* Erreur sur un nouveau générateur → décomposition + fiche etude-intervalle */
  call(`
    (function(){
      const q = GEN['etRacinesI']();
      q._notionId = 'derivee-racines-I'; q._gen = 'etRacinesI';
      state.lastGen = 'etRacinesI';
      SAV.logQuestion(q, ['mauvaise'], false);
      resolveAnswer(false, q);
    })()
  `);
  await sleep(1300);
  const body6 = $('lessonBody').innerHTML;
  ok(body6.includes('décomposée en éléments simples') && body6.includes('Racines de la dérivée sur un intervalle'), 'leçon d\'erreur : décomposition de la notion « Signe de la dérivée sur un intervalle »');
  ok(body6.includes('data-fiche="etude-intervalle"'), 'boutons vers la fiche « Étude sur un intervalle » dans la leçon');
  call('closeLesson()');
  await sleep(1200);

  console.log(fail === 0 ? '\n✅ BANC D\'ESSAI : TOUT PASSE' : '\n❌ ' + fail + ' test(s) en échec');
  process.exit(fail === 0 ? 0 : 1);
})().catch(e => { console.error('EXCEPTION : ' + e.stack); process.exit(1); });
