/* ============================================================
   1. OUTILS
   ============================================================ */
function fr(x, d){ d = (d === undefined) ? 4 : d; return Number(x).toFixed(d).replace('.', ','); }
function randInt(a, b){ return a + Math.floor(Math.random() * (b - a + 1)); }
function shuffleArr(a){ a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function comb(n, k){ if(k < 0 || k > n) return 0; k = Math.min(k, n - k); let r = 1; for(let i = 0; i < k; i++) r = r * (n - i) / (i + 1); return Math.round(r); }
function sg(sc, masc, fem){ return sc.seigneurGenre === 'F' ? fem : masc; }
function pickP(){ const o = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7]; return o[randInt(0, o.length - 1)]; }
function pickOrientation(){ const o = ['top-down', 'bottom-up', 'left-right', 'right-left', 'diagonal']; return o[randInt(0, o.length - 1)]; }
function orientLabel(o){ return { 'top-down': 'de haut en bas', 'bottom-up': 'de bas en haut', 'left-right': 'de gauche à droite', 'right-left': 'de droite à gauche', 'diagonal': 'en diagonale' }[o]; }
function fmtDuration(ms){ if(ms < 1000) return Math.round(ms) + ' ms'; const s = ms / 1000; if(s < 60) return fr(s, 1) + ' s'; const m = Math.floor(s / 60); const sec = Math.round(s - m * 60); return m + ' min ' + sec + ' s'; }
function fmtSec(s){ return fr(s, 1) + ' s'; }
/* Mini-moteur de rendu TeX intégré (substitut autonome de MathJax) :
   couvre le sous-ensemble utilisé par ce document — \binom, \frac/\tfrac/\dfrac,
   exposants, indices, \overline, \sqrt, symboles, \text/\mathrm, \mathbb/\mathcal. */
/* Lecture d'un groupe {...} avec imbrication ; s[i] doit être '{'. */
function texReadGroup(s, i){
  if(s[i] !== '{') return null;
  var depth = 0, j = i;
  for(; j < s.length; j++){
    if(s[j] === '{') depth++;
    else if(s[j] === '}'){ depth--; if(depth === 0) break; }
  }
  if(depth !== 0) return null;
  return { content: s.slice(i + 1, j), next: j + 1 };
}
/* Remplacement de \frac/\tfrac/\dfrac et \binom en tolérant l'imbrication. */
function texExpandTwoArgs(s){
  var names = ['tfrac', 'dfrac', 'frac', 'binom'];
  while(true){
    var idx = -1, name = '';
    for(var t = 0; t < names.length; t++){
      var p = s.indexOf('\\' + names[t] + '{');
      if(p >= 0){ idx = p; name = names[t]; break; }
    }
    if(idx < 0) return s;
    var g1 = texReadGroup(s, idx + name.length + 1);
    if(!g1){ s = s.slice(0, idx) + s.slice(idx + name.length); continue; }
    var g2 = texReadGroup(s, g1.next);
    if(!g2){ s = s.slice(0, idx) + g1.content + s.slice(g1.next); continue; }
    var html;
    if(name === 'binom'){
      html = '<span class="binom"><span class="par">(</span><span class="stack"><span>' + g1.content + '</span><span>' + g2.content + '</span></span><span class="par">)</span></span>';
    } else {
      html = '<span class="frac"><span class="num">' + g1.content + '</span><span class="den">' + g2.content + '</span></span>';
    }
    s = s.slice(0, idx) + html + s.slice(g2.next);
  }
}
function texToHtml(tex){
  var s = String(tex);
  s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  var reps = [
    ['\\left', ''], ['\\right', ''],
    ['\\leq', '≤'], ['\\le', '≤'], ['\\geq', '≥'], ['\\ge', '≥'],
    ['\\approx', '≈'], ['\\times', '×'], ['\\cdot', '·'], ['\\sim', '∼'],
    ['\\Rightarrow', '⇒'], ['\\rightarrow', '→'], ['\\Leftrightarrow', '⇔'],
    ['\\ldots', '…'], ['\\dots', '…'], ['\\infty', '∞'],
    ['\\pi', 'π'], ['\\sigma', 'σ'], ['\\mu', 'μ'], ['\\lambda', 'λ'],
    ['\\alpha', 'α'], ['\\beta', 'β'], ['\\varepsilon', 'ε'], ['\\epsilon', 'ε'],
    ['\\mathbb{P}', 'ℙ'], ['\\mathbb{N}', 'ℕ'], ['\\mathbb{E}', '𝔼'],
    ['\\mathbb{R}', 'ℝ'], ['\\mathbb{Z}', 'ℤ'], ['\\mathbb{Q}', 'ℚ'],
    ['\\mathcal{B}', '𝓑'], ['\\mathcal{N}', '𝓝'], ['\\mathcal{E}', '𝓔'], ['\\mathcal{P}', '𝓟'],
    ['\\{', '&#123;'], ['\\}', '&#125;'],
    ['\\,', ' '], ['\\;', ' '], ['\\!', ''], ['\\ ', ' '],
    ['\\quad', '\u00a0\u00a0'], ['\\qquad', '\u00a0\u00a0\u00a0\u00a0'],
    ['{,}', ','], ['\\%', '%'], ['\\neq', '≠'], ['\\in', '∈']
  ];
  reps.forEach(function(r){ s = s.split(r[0]).join(r[1]); });
  s = s.replace(/\\(?:text|mathrm|mathbf|mathit)\{([^{}]*)\}/g, function(m, t){ return '<span class="up">' + t + '</span>'; });
  s = s.replace(/\\overline\{([^{}]*)\}/g, function(m, t){ return '<span class="ol">' + t + '</span>'; });
  s = s.replace(/\\sqrt\{([^{}]*)\}/g, function(m, t){ return '<span class="sqrt-rad">√</span><span class="ol">' + t + '</span>'; });
  s = texExpandTwoArgs(s);
  s = s.replace(/\^\{([^{}]*)\}/g, '<sup>$1</sup>');
  s = s.replace(/_\{([^{}]*)\}/g, '<sub>$1</sub>');
  s = s.replace(/\^([A-Za-z0-9])/g, '<sup>$1</sup>');
  s = s.replace(/_([A-Za-z0-9])/g, '<sub>$1</sub>');
  s = s.replace(/[{}]/g, '');
  return s;
}
function renderMathInTextNode(node){
  var txt = node.nodeValue;
  var re = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\$([^$\n]+?)\$|\\\(([\s\S]+?)\\\)/g;
  var m = re.exec(txt);
  if(!m) return;
  var frag = document.createDocumentFragment();
  var last = 0;
  while(m !== null){
    if(m.index > last) frag.appendChild(document.createTextNode(txt.slice(last, m.index)));
    var tex = m[1] !== undefined ? m[1] : (m[2] !== undefined ? m[2] : (m[3] !== undefined ? m[3] : m[4]));
    var isBlock = (m[1] !== undefined || m[2] !== undefined);
    var holder = document.createElement(isBlock ? 'div' : 'span');
    holder.className = 'mth';
    if(isBlock){ holder.style.textAlign = 'center'; holder.style.margin = '10px 0'; }
    holder.innerHTML = texToHtml(tex);
    frag.appendChild(holder);
    last = m.index + m[0].length;
    m = re.exec(txt);
  }
  if(last < txt.length) frag.appendChild(document.createTextNode(txt.slice(last)));
  node.parentNode.replaceChild(frag, node);
}
function typeset(el){
  if(!el) return;
  try {
    var skip = { SCRIPT: 1, STYLE: 1, PRE: 1, CODE: 1, TEXTAREA: 1, NOSCRIPT: 1 };
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node){
        var p = node.parentNode;
        while(p && p !== el){ if(skip[p.nodeName]) return NodeFilter.FILTER_REJECT; p = p.parentNode; }
        if(p && skip[p.nodeName]) return NodeFilter.FILTER_REJECT;
        return /[$\\]/.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var nodes = [];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(renderMathInTextNode);
  } catch(e) { /* rendu best-effort */ }
}
function setTextWithBreaks(text){ return text.replace(/([.:])\s/g, '$1<br>'); }

function pyFlavor(){ const h = [
  "Baxter a codé ceci entre deux révérences, tout en surveillant du coin de l'œil un biscuit qui menaçait de tomber du mauvais côté.",
  "Ce programme a été rédigé sur un coin de nappe en lin, pendant qu'un orage de novembre tentait de faire déborder la théière.",
  "Le majordome a codé ceci en soupirant, après la énième chute de cornichon dans la fontaine aux pamplemousses.",
  "On raconte que ce script fut d'abord griffonné au dos d'une facture de parapluies, entre deux coups de tonnerre.",
  "Baxter affirme avoir écrit ces lignes en équilibre sur un tabouret, sous la supervision sévère d'un chat qui n'appréciait pas les boucles.",
  "Ce code a résisté à trois ouragans, deux invasions de mites et un dîner chez la Duchesse Cunégonde.",
  "Le neveu Babbage l'a tapé à toute vitesse sur sa machine, entre deux parties de colin-maillard avec les escargots du Duc.",
  "Baxter a relu ceci trois fois en retenant son souffle, puis a décidé que la quatrième relecture serait pour le thé.",
  "Ce programme a été validé par un comité de moustaches qui n'y comprenaient rien mais tenaient à donner leur avis.",
  "On dit que ce bout de code sent encore la fougère et le thé refroidi, ce qui est plutôt bon signe."
]; return h[randInt(0, h.length - 1)]; }
function treeFlavor(){ const h = [
  "Le majordome a dessiné cet arbre en équilibre sur un tabouret, pendant qu'un blaireau perplexe le regardait faire.",
  "Voici un arbre que Baxter dit avoir croqué à main levée, dans un train de nuit, entre deux hoquets de la locomotive.",
  "Ce schéma a été tracé sur le dos d'une vieille partition de cornemuse ; personne ne saura jamais pourquoi.",
  "Baxter jure avoir été guidé par un chat qui fixait les nœuds d'un air entendu.",
  "On raconte que cet arbre fut dessiné pendant une panne d'électricité, à la lueur d'une bouilloire en furie.",
  "L'arbre a été construit méthodiquement, entre deux services de thé et un incident impliquant une chaussette.",
  "Baxter, muni d'un crayon mordillé, affirme avoir hésité entre un arbre et une betterave, puis avoir choisi la raison.",
  "Ce schéma provient d'un carnet retrouvé dans une théière ; les circonstances exactes restent floues.",
  "Le majordome a tracé ceci sous le regard critique d'une mouette qui passait à tribord.",
  "L'arbre a été validé par le Collège des Moustaches, section statistique appliquée, à l'unanimité des sourcils."
]; return h[randInt(0, h.length - 1)]; }

