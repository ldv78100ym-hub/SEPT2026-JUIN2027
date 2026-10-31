/* Probe runtime : charge la tour en VM, appelle un générateur N fois, affiche le JSON. */
import fs from 'node:fs';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';

const [file, gen, nDraws] = process.argv.slice(2);
const ROOT = '/home/user/la-tour-des-maths';

let seed = 987654321;
function srand(){ seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }

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
    children: [], parentElement: null, style: {}, dataset: {}, _attrs: {}, listeners: {},
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
  const c = makeEl('canvas'); c.width = 1280; c.height = 800;
  c.getContext = () => ctxProxy;
  return c;
}
const byId = new Map();
const document = {
  getElementById(id){ if(!byId.has(id)) byId.set(id, id === 'tower' ? makeCanvas() : makeEl('div')); return byId.get(id); },
  createElement: tag => makeEl(tag),
  body: makeEl('body'),
  addEventListener(){},
  activeElement: null
};
document.body.appendChild(makeEl('div'));
const store = new Map();
const localStorage = { getItem: k => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k) };
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
sandbox.window = sandbox; sandbox.self = sandbox;
sandbox.Math = Object.create(Math); sandbox.Math.random = srand;
vm.createContext(sandbox);

const scripts = fs.readdirSync(ROOT + '/js').filter(f => f.endsWith('.js')).sort();
for(const f of scripts){
  const code = fs.readFileSync(ROOT + '/js/' + f, 'utf8');
  try { new vm.Script(code, { filename: f }).runInContext(sandbox); }
  catch(e){ console.error('ÉCHEC au chargement de ' + f + ' : ' + e.message); process.exit(1); }
}

const N = parseInt(nDraws || '3', 10);
for(let i = 0; i < N; i++){
  const q = vm.runInContext(`GEN['${gen}']()`, sandbox);
  console.log('--- tirage ' + (i + 1) + ' ---');
  if(q.trou){
    console.log(JSON.stringify({ prompt: q.prompt, corps: q.corps, answers: q.answers, bank: q.bank, explain: q.explain }, null, 1));
  } else {
    console.log(JSON.stringify({ prompt: q.prompt, options: q.options, explain: q.explain }, null, 1));
  }
}
process.exit(0);
