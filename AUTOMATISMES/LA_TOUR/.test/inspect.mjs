/* Inspection : charge la tour en VM et affiche les générateurs demandés. */
import fs from 'node:fs';
import vm from 'node:vm';

const ROOT = '/home/user/la-tour-des-maths';
const scripts = fs.readdirSync(ROOT + '/js').filter(f => f.endsWith('.js')).sort();

function makeClassList(){
  const s = new Set();
  return { add(...cs){ cs.forEach(c => s.add(c)); }, remove(...cs){ cs.forEach(c => s.delete(c)); },
    toggle(c, f){ if(f === undefined){ s.has(c) ? s.delete(c) : s.add(c); } else { f ? s.add(c) : s.delete(c); } return s.has(c); },
    contains(c){ return s.has(c); } };
}
function matches(el, sel){ if(!sel) return false; if(sel.startsWith('.')) return el.classList.contains(sel.slice(1)); return el.tagName === sel.toLowerCase(); }
function makeEl(tag){
  const el = { tagName: (tag || 'div').toLowerCase(), children: [], parentElement: null, style: {}, dataset: {}, _attrs: {}, listeners: {}, innerHTML: '', textContent: '', value: '', disabled: false, scrollTop: 0, className: '' };
  el.classList = makeClassList();
  el.appendChild = c => { if(!c.parentElement) c.parentElement = el; el.children.push(c); return c; };
  el.addEventListener = (t, fn) => { (el.listeners[t] = el.listeners[t] || []).push(fn); };
  el.setAttribute = (k, v) => { el._attrs[k] = String(v); };
  el.getAttribute = k => (k in el._attrs ? el._attrs[k] : null);
  el.hasAttribute = k => k in el._attrs;
  el.getBoundingClientRect = () => ({ left: 0, top: 0, right: 1280, bottom: 800, width: 1280, height: 800 });
  el.querySelector = sel => makeEl('div');
  el.querySelectorAll = sel => { const out = []; for(const c of el.children){ if(matches(c, sel)) out.push(c); } return out; };
  el.closest = sel => null; el.contains = () => false; el.focus = () => {}; el.click = () => {};
  return el;
}
const ctxProxy = new Proxy(function(){}, { get(t,k){ if(k===Symbol.toPrimitive) return ()=>0; return ctxProxy; }, set(){ return true; }, apply(){ return ctxProxy; } });
const byId = new Map();
const document = {
  getElementById(id){ if(!byId.has(id)) byId.set(id, id === 'tower' ? (() => { const c = makeEl('canvas'); c.getContext = () => ctxProxy; return c; })() : makeEl('div')); return byId.get(id); },
  createElement: t => makeEl(t), body: makeEl('body'), addEventListener(){}, activeElement: null
};
const store = new Map();
const sandbox = {
  console, document, addEventListener(){}, removeEventListener(){},
  setTimeout, clearTimeout, setInterval, clearInterval,
  performance: { now: () => Date.now() },
  requestAnimationFrame: cb => setTimeout(() => cb(Date.now()), 5),
  localStorage: { getItem: k => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k) },
  navigator: { userAgent: 'x' }, innerWidth: 1280, innerHeight: 800, devicePixelRatio: 1,
  Blob: class {}, URL: { createObjectURL: () => 'blob:', revokeObjectURL: () => {} }, FileReader: class { readAsText(){} },
  MathJax: undefined
};
sandbox.window = sandbox;
vm.createContext(sandbox);
for(const f of scripts){ new vm.Script(fs.readFileSync(ROOT + '/js/' + f, 'utf8'), { filename: f }).runInContext(sandbox); }

const keys = process.argv.slice(2);
for(const k of keys){
  const exists = vm.runInContext(`typeof GEN['${k}'] === 'function'`, sandbox);
  if(!exists){ console.log('=== ' + k + ' → ABSENT de GEN'); continue; }
  for(let i = 0; i < 3; i++){
    try {
      const q = vm.runInContext(`GEN['${k}']()`, sandbox);
      console.log('=== ' + k + ' (tirage ' + (i + 1) + ') ===');
      console.log('PROMPT: ' + String(q.prompt || q.contexte || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 400));
      if(q.options) console.log('OPTIONS: ' + q.options.map(o => o.t + (o.ok ? ' [OK]' : '')).join(' | '));
      if(q.trou) console.log('TROU answers: ' + JSON.stringify(q.answers) + ' bank: ' + JSON.stringify(q.bank && q.bank.slice(0, 8)));
      if(q.multi) console.log('MULTI');
      if(i === 0) console.log('EXPLAIN: ' + String(q.explain || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 300));
    } catch(e){ console.log(k + ' ERREUR: ' + e.message); break; }
  }
}
process.exit(0);
