/* ============================================================
   2bis. TEXIFICATION AUTOMATIQUE (banque Unicode → LaTeX)
   Les générateurs du fichier fusionné écrivent les maths en
   caractères Unicode (× ÷ − ² √ π …) au milieu du français.
   On convertit tout cela à la volée en LaTeX \( ... \) pour
   MathJax 3, et on canonise les écritures de signes :
   — a + b avec b négatif s'écrit a − |b| (jamais « + − ») ;
   — a − b avec b négatif s'écrit a + |b| (jamais « − − »).
   ============================================================ */
var TXU = '(?:m²|cm²|dm²|km²|mm²|m³|cm³|dm³|km³|km|hm|kg|hg|dg|mg|g|cm|mm|min|mL|cL|dL|hL|L|m|s|t|h)';
var TXN = '\\d+(?: \\d{3})*(?:,\\d+)?(?:[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+)?';
var TXA = [
  '\\d+\\s*h\\s+\\d{1,2}',                                                     // « 3 h 40 »
  '(?:[+−-]\\s*)?' + TXN + '(?:\\s+' + TXU + '(?![a-zA-Zà-öø-ÿ²³⁴⁻]))?(?:\\s?[%€])?', // nombre ± unité / % / €
  '(?:[+−-]\\s*)?(?<![A-Za-zÀ-öø-ÿ])[a-z]{1,2}(?![A-Za-zÀ-öø-ÿ])(?:[²³⁴])?',  // variable x, ax, −b, x²…
  '(?<![A-Za-zÀ-öø-ÿ])[A-Z]{1,3}(?![a-zà-öø-ÿ])',                             // points AB, AM, BC…
  '(?:cos|sin|tan)(?=\\s*\\()',                                               // fonctions avec parenthèse
  '(?:cos|sin|tan)\\s*[a-z](?![a-zA-ZÀ-öø-ÿ])',                                // « sin x », « cos t »
  '(?:cos|sin|tan)\\s*[αβγθΔπ]',                                               // « cos θ »
  '(?:[+−-]\\s*)?[αβγθΔπ]',                                                    // lettres grecques
  '√\\s*(?:\\([^()]+\\)|\\d+(?:,\\d+)?|[a-z]|[αβγθΔπ])',                       // racines
  '\\.\\.\\.|…|\\?',                                                           // suspension, ?
  '\\(|\\[|\\{',
  '[\\)\\]}](?:[²³⁴])?'
].join('|');
var TXOP = '(?:[+−\\-×÷=≤≥≠<>·/^±∩∪])';
/* chaîne d'atomes : opérateur entre atomes, adjacence directe (2x, 6(4x+8)),
   ou simple espace vers un grec / une variable exponentiée (π r² h) */
var TXSEG = new RegExp('(?:(?:' + TXOP + '\\s*)*(?:' + TXA + '))(?:(?:\\s*(?:' + TXOP + '\\s*)+(?:' + TXA + '))|(?:\\s*(?:[αβγθΔπ]|(?<![A-Za-zÀ-öø-ÿ])[a-z][²³⁴]))|(?:' + TXA + '))*', 'g');
var TXSTOP = /(?:^|[^0-9a-zA-ZÀ-öø-ÿ])(?:de|du|le|la|et|ou|en|un|si|ce|il|on|ne|se|sa|ma|ta|au|or|ni)(?![a-zA-ZÀ-öø-ÿ])/;
var TXSUP = { '⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-' };
function txConv(m){
  /* Règles de signes : a + (−b) → a − b  ;  a − (−b) → a + b */
  m = m.replace(/\+\s*\(\s*[−-]\s*(\d+(?:,\d+)?)\s*\)/g, '−$1');
  m = m.replace(/\+\s*[−-]\s*(?=\d)/g, '−');
  m = m.replace(/[−-]\s*\(\s*[−-]\s*(\d+(?:,\d+)?)\s*\)/g, '+$1');
  m = m.replace(/[−-]\s*[−-]\s*(?=\d)/g, '+');
  m = m.replace(/−/g, '-');
  /* racines carrées */
  m = m.replace(/√\s*\(([^()]*)\)/g, '\\sqrt{$1}');
  m = m.replace(/√\s*(\d+(?:,\d+)?)/g, '\\sqrt{$1}');
  /* opérateurs et symboles */
  m = m.replace(/×/g, '\\times ').replace(/÷/g, '\\div ')
       .replace(/≤/g, '\\leq ').replace(/≥/g, '\\geq ').replace(/≠/g, '\\neq ')
       .replace(/·/g, '\\cdot ').replace(/</g, '\\lt ').replace(/>/g, '\\gt ')
       .replace(/±/g, '\\pm ').replace(/∩/g, '\\cap ').replace(/∪/g, '\\cup ')
       .replace(/\b(cos|sin|tan)\s*\(/g, '\\$1(')
       .replace(/\b(cos|sin|tan)(\s*)([a-zαβγθΔπ])(?![a-zA-ZÀ-öø-ÿ])/g, '\\$1$2$3')
       .replace(/π/g, '\\pi ').replace(/α/g, '\\alpha ').replace(/β/g, '\\beta ')
       .replace(/γ/g, '\\gamma ').replace(/Δ/g, '\\Delta ').replace(/θ/g, '\\theta ')
       .replace(/∞/g, '\\infty ')
       .replace(/°/g, '\\circ ').replace(/…/g, '\\ldots ').replace(/\.\.\./g, '\\ldots ');
  /* heures « 3 h 40 », puis unités → \text{…} */
  m = m.replace(/(\d+)\s*h\s+(\d{1,2})/g, '$1\\text{ h }$2');
  m = m.replace(new RegExp('(\\d)\\s+(' + TXU + ')(?![a-zA-Zà-öø-ÿ²³⁴⁻])', 'g'), function(_, d, u){
    var sp = '';
    if (u.indexOf('²') >= 0) { u = u.replace(/²/g, ''); sp = '^2'; }
    if (u.indexOf('³') >= 0) { u = u.replace(/³/g, ''); sp = '^3'; }
    return d + '\\text{ ' + u + '}' + sp;
  });
  m = m.replace(/(\d)\s?%/g, '$1\\,\\%').replace(/(\d)\s?€/g, '$1\\text{ €}');
  /* exposants Unicode → ^{…} */
  m = m.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, function(r){
    return '^{' + r.split('').map(function(c){ return TXSUP[c]; }).join('') + '}';
  });
  /* fractions n/d → \dfrac, puis virgule décimale française */
  m = m.replace(/(\d+)\s*\/\s*(\d+)/g, '\\dfrac{$1}{$2}');
  m = m.replace(/(\d),(\d)/g, '$1{,}$2');
  return m;
}
function texifyText(t){
  if (!t) return t;
  /* paires de coordonnées « A(−1 ; −1) », « u(6 ; 8) » → \(A(-1\,;\,-1)\) */
  t = t.replace(/(^|[^A-Za-zÀ-öø-ÿ])([A-Za-z]{1,3})\(\s*([−-]?\s*\d+(?:,\d+)?)\s*;\s*([−-]?\s*\d+(?:,\d+)?)\s*\)/g,
    function(_, pre, a, x, y){
      x = x.replace(/\s+/g, '').replace(/−/g, '-');
      y = y.replace(/\s+/g, '').replace(/−/g, '-');
      return pre + '\\(' + a + '(' + x + '\\,;\\,' + y + ')\\)';
    });
  /* intervalles « [0 ; 2π[ », « ]π/4 ; 3π/4[ » */
  t = t.replace(/([\[\]])([^\[\]()]{1,40}?)([\[\]])/g, function(mm, o, mid, c){
    if (!/^[\d\s;,+−.\-\/π√αβ∞²³⁴]*$/.test(mid) || !/[\dπ]/.test(mid)) return mm;
    return '\\(' + o + txConv(mid).replace(/;/g, '\\,;\\,') + c + '\\)';
  });
  return texifyTail(t);
}

/* segmentation : boucle manuelle — si un candidat est rejeté, on relance la
   recherche juste après son premier caractère pour ne rien rater */
function txSegPass(t){
  var out = '', last = 0, m;
  TXSEG.lastIndex = 0;
  while ((m = TXSEG.exec(t)) !== null) {
    var mm = m[0];
    var s0 = 0, s1 = mm.length, core = '', ok = true;
    while (true) {
      core = mm.slice(s0, s1);
      if (core.length < 2 && !/[αβγθΔπ]/.test(core)) { ok = false; break; }   // grec isolé accepté
      if (!/[+−\-×÷=≤≥≠<>·\/^±∩∪√π°%€²³⁴⁵⁶⁷⁸⁹⁰¹⁻αβγθΔ]/.test(core)) { ok = false; break; }
      if (TXSTOP.test(core)) { ok = false; break; }                 // un mot français s'est glissé : texte
      var depth = 0, orphan = -1, i, ch;
      for (i = 0; i < core.length; i++) {
        ch = core.charAt(i);
        if (ch === '(' || ch === '[' || ch === '{') depth++;
        else if (ch === ')' || ch === ']' || ch === '}') { depth--; if (depth < 0) { orphan = i; break; } }
      }
      if (orphan >= 0) {                                            // fermante orpheline : on rétrécit avant elle
        s1 = s0 + orphan;
        while (s1 > s0 && mm.charAt(s1 - 1) === ' ') s1--;
        continue;
      }
      if (depth > 0) {                                              // ouvrante excédentaire : on avance après elle
        var s0n = s0 + 1;
        while (s0n < s1 && mm.charAt(s0n) === ' ') s0n++;
        if (s0n >= s1) { ok = false; break; }
        s0 = s0n;
        continue;
      }
      if (/[+×÷=≤≥≠<>·\/^]\s*$/.test(core) || /^\s*[+×÷=≤≥≠<>·\/^]/.test(core)) ok = false; // opérateur orphelin
      break;
    }
    if (ok) {
      out += t.slice(last, m.index) + mm.slice(0, s0) + '\\(' + txConv(core) + '\\)' + mm.slice(s1);
      last = m.index + mm.length;
    } else {
      TXSEG.lastIndex = m.index + 1;
    }
  }
  out += t.slice(last);
  return out;
}

/* La segmentation ne doit JAMAIS re-scanner le LaTeX déjà produit par les
   règles précédentes (coordonnées, intervalles) : on découpe le texte sur
   les segments \( ... \) et on ne traite que les morceaux hors math. */
function txApplySegments(t){
  var pp = t.split(/(\\\(.*?\\\))/), rr = '';
  for (var pj = 0; pj < pp.length; pj++) rr += (pj % 2) ? pp[pj] : txSegPass(pp[pj]);
  return rr;
}
function texifyTail(t){
  t = txApplySegments(t);
  /* mots français portant un exposant : « hypoténuse² » → hypoténuse\(^{2}\) */
  t = t.replace(/([A-Za-zÀ-öø-ÿ])([²³⁴])/g, function(_, w, sp){
    return w + '\\(^{' + TXSUP[sp] + '}\\)';
  });
  return t;
}
function texify(s){
  if (typeof s !== 'string') return s;
  if (s.indexOf('\\(') >= 0 || s.indexOf('\\[') >= 0) return s;   // déjà du LaTeX : intact
  var parts = s.split(/(<[^>]*>)/);                                 // ne jamais toucher aux balises HTML
  for (var i = 0; i < parts.length; i++) {
    if (parts[i].length && parts[i].charAt(0) === '<') continue;
    parts[i] = texifyText(parts[i]);
  }
  return parts.join('');
}

// Convert attached G functions to Tower QCM format
function adaptQ(attQ) {
  let options = [];
  // Les contenus du fichier fusionné arrivent en texte français + symboles Unicode :
  // texify() les convertit en LaTeX \( ... \) (MathJax) AVANT d'ajouter le graphe.
  let prompt = texify(attQ.prompt);
  
  if (attQ.graph) {
    prompt += "<div class='graph-wrap'>" + graphSVG(attQ.graph) + "</div>";
  }

  // Les nombres passent par fr() (virgule décimale) + attM (signe moins correct),
  // puis par texify() comme le reste.
  const fmtOpt = v => texify((typeof v === 'number') ? attM(fr(v)) : String(v));

  if (attQ.kind === 'mcq') {
    options = attQ.multi
      ? attQ.choices.map((c, i) => ({ t: fmtOpt(c), ok: attQ.corrects.indexOf(i) >= 0 }))
      : attQ.choices.map((c, i) => ({ t: fmtOpt(c), ok: i === attQ.correct }));
  } else if (attQ.kind === 'num') {
    const ans = attQ.ans;
    let rawWrongs = [ans + 1, ans - 1, ans * 2, ans + 10];
    if (ans % 1 !== 0) rawWrongs.push(ans + 0.5);
    const uniq = [];
    for (const w of rawWrongs) {
      const rounded = Math.round(w * 100) / 100;
      if (rounded !== ans && !uniq.includes(rounded)) uniq.push(rounded);
      if (uniq.length === 3) break;
    }
    options = [{ t: fmtOpt(ans), ok: true }, ...uniq.map(w => ({ t: fmtOpt(w), ok: false }))];
  } else if (attQ.kind === 'sign') {
    const target = attQ.sign.target;
    const correctStr = target.join(' ');
    const wrong1 = target.map(s => s === '+' ? NEG : '+').join(' ');
    const wrong2 = target.map(s => s === '+' ? '+' : NEG).join(' ');
    const wrong3 = target.map(s => s === '+' ? NEG : NEG).join(' ');
    options = [
      { t: correctStr, ok: true },
      { t: wrong1, ok: false },
      { t: wrong2, ok: false },
      { t: wrong3, ok: false }
    ];
    prompt += " <br><span style='font-size:12px;color:var(--dim)'>(Donnez la séquence de signes de gauche à droite, séparés par des espaces)</span>";
  } else if (attQ.kind === 'var') {
    const target = attQ.vart.target;
    const correctStr = target.join(' ');
    const wrong1 = target.map(s => s === UP ? DOWN : UP).join(' ');
    const wrong2 = target.map(s => s === UP ? UP : DOWN).join(' ');
    const wrong3 = target.map(s => s === UP ? FLAT : UP).join(' ');
    options = [
      { t: correctStr, ok: true },
      { t: wrong1, ok: false },
      { t: wrong2, ok: false },
      { t: wrong3, ok: false }
    ];
    prompt += " <br><span style='font-size:12px;color:var(--dim)'>(Donnez la séquence de flèches de gauche à droite, séparés par des espaces)</span>";
  }
  
  // Proposition « Autre » : simple distracteur ajouté en plus des propositions
  // existantes. La vraie bonne réponse reste TOUJOURS dans la liste : une réponse
  // juste ne doit jamais être pénalisée (l'ancien tirage 1/6 qui la retirait est supprimé).
  if (attQ.kind === 'mcq' || attQ.kind === 'num') {
    if (!options.some(o => o.t === 'Autre')) {
      options.push({ t: 'Autre', ok: false });
    }
  }
  if (attQ.multi) {
    prompt += " <br><span style='font-size:12px;color:var(--dim)'>(Plusieurs réponses possibles : cochez-les TOUTES puis validez)</span>";
  }

  // Dédoublonnage compatible multi-bonne-réponses : on garde chaque texte
  // une seule fois ; une proposition fausse qui porterait le même texte
  // qu'une proposition correcte est écartée.
  const finalOpts = [];
  const seenOk = new Set();
  const seenWrong = new Set();
  for (const o of options) {
    if (o.ok) {
      if (!seenOk.has(o.t)) { seenOk.add(o.t); finalOpts.push(o); }
    } else if (!seenOk.has(o.t) && !seenWrong.has(o.t)) {
      seenWrong.add(o.t);
      finalOpts.push(o);
    }
  }
  
  return {
    prompt,
    options: shuffle(finalOpts),
    multi: attQ.multi === true,
    penalty: 1,
    explain: EXPL(texify(attQ.ex || "Revoir le cours."), texify(attQ.hint || "Méthode à appliquer."), "Vérifiez votre calcul.")
  };
}

