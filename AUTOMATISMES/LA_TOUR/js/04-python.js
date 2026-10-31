/* ============================================================
   PYTHON : COMPLÉTER, ANALYSER, TRANSFORMER
   Mini-programmes à trous (sans break ni print). Les clés
   contiennent aussi les INDENTATIONS du script : un symbole
   ␣ représente un espace (␣␣␣␣ = un niveau, ␣×8 = deux).
   ============================================================ */
var SP4 = "␣␣␣␣", SP8 = "␣␣␣␣␣␣␣␣", SP2 = "␣␣";
var PY = function (lines) { return '<pre class="pycode">' + lines.join("\n") + '</pre>'; };
var PYHINT = '<span class="pyhint">␣ = un espace : ' + SP4 + ' = un niveau d\'indentation, ' + SP8 +
             ' = deux niveaux. Seule la BONNE indentation est proposée comme clé.</span>';

GEN.pyTrous = () => {
  const v = Math.floor(Math.random() * 3);
  if (v === 0) {
    const n = pick([10, 12, 15]);
    return TROU(
      `Le programme doit calculer la somme des entiers pairs de 1 à n = ${n} : complète le script.` + PYHINT,
      PY(["n = " + n, "s = 0", "for i in range(1, {{0}}):", "{{1}}if i % 2 == {{2}}:", "{{3}}{{4}}"]),
      ["n + 1", SP4, "0", SP8, "s = s + i"],
      ["n", "n - 1", "1", "s = i", "s = s + 1"],
      `range(1, n + 1) s'arrête à n : écrire range(1, n) oublierait la valeur n. Et le test i % 2 == 0 garde les nombres PAIRS : écrire == 1 garderait les impairs.`
    );
  }
  if (v === 1) {
    const u0 = pick([3, 5, 7]), k = pick([2, 3]), lim = pick([100, 200]);
    return TROU(
      `Le programme compte combien de fois il faut multiplier u par ${k} pour atteindre ${lim} : complète le script.` + PYHINT,
      PY(["u = " + u0, "n = 0", "while u &lt; " + lim + ":", "{{0}}u = {{1}}", "{{2}}n = {{3}}"]),
      [SP4, "u * " + k, SP4, "n + 1"],
      ["u + " + k, "u ** " + k, "u / " + k, "n * 1", "1"],
      `Tant que u &lt; ${lim}, le corps s'exécute : u est multiplié par ${k} à chaque tour. Attention : u ** ${k} élèverait u à la puissance ${k} — une étoile change tout ! Et les deux lignes du corps doivent avoir la MÊME indentation.`
    );
  }
  const seuil = pick([200, 250, 300]);
  return TROU(
    `Le programme fabrique la liste des carrés supérieurs à ${seuil} : complète le script.` + PYHINT,
    PY(["L = {{0}}", "for i in range({{1}}):", "{{2}}if i * i &gt; " + seuil + ":", "{{3}}L.{{4}}(i * i)"]),
    ["[]", "1, 20", SP4, SP8, "append"],
    ["{}", "0", "1, 19", "2, 21", "add", "insert"],
    `En Python, la méthode s'appelle append (et non add). Et range(1, 20) parcourt les entiers de 1 à 19 : le modifier changerait les valeurs étudiées.`
  );
};

GEN.pyAnalyse = () => {
  const v = Math.floor(Math.random() * 3);
  if (v === 0) {
    return TROU(
      `Analyse ce programme : que calcule-t-il exactement ? Complète le raisonnement rigoureux.` +
      PY(["s = 0", "for i in range(1, 101):", "    s = s + i"]),
      `Au départ, <code>s</code> vaut 0 : c'est un {{0}} qui conserve le total partiel.<br>
       {{1}} tour de boucle, la valeur courante de <code>i</code> est {{2}} au contenu de <code>s</code>.<br>
       La boucle effectue exactement 100 tours, {{3}} <code>range(1, 101)</code> s'arrête à 100.<br>
       {{4}} la boucle est terminée, <code>s</code> vaut la somme des entiers de 1 à 100, c'est-à-dire {{5}}.`,
      ["accumulateur", "À chaque", "additionnée", "car", "Une fois que", "5050"],
      ["compteur", "Avant chaque", "multipliée", "bien que", "Tant que", "5049", "5150"],
      `La formule n(n+1)/2 redonne le résultat : 100 × 101 ÷ 2 = 5050. Ne pas confondre l'accumulateur <code>s</code> (qui stocke un total) avec le compteur de boucle <code>i</code> (qui énumère les valeurs).`
    );
  }
  if (v === 1) {
    return TROU(
      `Analyse ce programme : que valent <code>u</code> et <code>n</code> à la fin ? Complète le raisonnement rigoureux.` +
      PY(["u = 3", "n = 0", "while u &lt; 100:", "    u = u * 2", "    n = n + 1"]),
      `Au départ <code>u</code> vaut 3. {{0}} la condition <code>u &lt; 100</code> est vraie, le corps de la boucle s'exécute :
       <code>u</code> est {{1}} par 2, {{2}} <code>n</code> est augmenté de 1.<br>
       Les valeurs successives de <code>u</code> sont 3, 6, 12, 24, 48, 96, 192 : la condition devient fausse
       {{3}} le sixième passage, {{4}} 192 dépasse 100.<br>
       La boucle s'est donc exécutée {{5}} fois : à la fin, <code>n</code> vaut 6 et <code>u</code> vaut 192.`,
      ["Tant que", "multiplié", "puis", "après", "car", "six"],
      ["Pour que", "divisé", "ou", "avant", "bien que", "cinq", "sept"],
      `On sort d'une boucle while quand la condition devient FAUSSE : le dernier doublement (96 → 192) a donc bien été compté dans n.`
    );
  }
  return TROU(
    `Analyse ce programme : que contient la liste <code>L</code> à la fin ? Complète le raisonnement rigoureux.` +
    PY(["L = []", "for i in range(1, 20):", "    if i * i &gt; 250:", "        L.append(i * i)"]),
    `La liste <code>L</code> est vide au départ. La boucle parcourt les entiers de 1 à {{0}},
     car <code>range(1, 20)</code> s'arrête juste avant 20.<br>
     {{1}} chaque entier, on teste si son carré dépasse 250 : {{2}} le test réussit, le carré est ajouté à la liste.<br>
     Le test devient vrai à partir de i = 16, {{3}} 16² = 256 dépasse 250 alors que 15² = 225 ne le dépasse pas.<br>
     {{4}} la boucle se termine, la liste contient exactement les quatre carrés 256, 289, 324 et 361,
     rangés dans l'ordre {{5}}.`,
    ["19", "Pour", "si", "car", "Une fois que", "croissant"],
    ["20", "Avant", "toujours", "bien que", "Dès que", "décroissant", "aléatoire"],
    `Python conserve l'ordre d'insertion : comme i croît, les carrés sont rangés du plus petit au plus grand. D'où l'importance du connecteur « si » : le carré n'est ajouté QUE lorsque le test réussit.`
  );
};

GEN.pyWhileFor = () => {
  const v = Math.floor(Math.random() * 3);
  if (v === 0) {
    const n = pick([8, 10, 12]);
    return TROU(
      `Remplace la boucle <code>while</code> par une boucle <code>for</code> : rédige l'intégralité du nouveau programme,
       qui doit parcourir les mêmes valeurs dans le même ordre.` + PYHINT +
      PY(["s = 0", "i = 1", "while i &lt;= " + n + ":", "    s = s + i", "    i = i + 1"]) +
      `Voici le squelette à compléter :`,
      PY(["s = 0", "for i in {{0}}({{1}}):", "{{2}}{{3}}"]),
      ["range", "1, " + (n + 1), SP4, "s = s + i"],
      ["while", "1, " + n, (n + 1) + ", 1", "i = i + 1", "s = s * i"],
      `Avec for, l'incrémentation est AUTOMATIQUE : garder « i = i + 1 » est inutile. Et range(a, b) s'arrête à b − 1 : pour atteindre ${n}, il faut écrire range(1, ${n + 1}).`
    );
  }
  if (v === 1) {
    const m = pick([5, 6, 7]);
    return TROU(
      `Remplace la boucle <code>while</code> par une boucle <code>for</code> : rédige l'intégralité du nouveau programme,
       qui doit parcourir les mêmes valeurs dans le même ordre.` + PYHINT +
      PY(["p = 1", "k = 1", "while k &lt;= " + m + ":", "    p = p * 2", "    k = k + 1"]) +
      `Voici le squelette à compléter :`,
      PY(["p = 1", "for k in {{0}}({{1}}):", "{{2}}{{3}}"]),
      ["range", "1, " + (m + 1), SP4, "p = p * 2"],
      ["while", "1, " + m, "0, " + m, "k = k + 1", "p = p + 2"],
      `La boucle for réinitialise k à chaque tour avec la valeur suivante de range : l'initialisation « k = 1 » et l'incrément « k = k + 1 » disparaissent. Et p = p + 2 additionnerait au lieu de doubler.`
    );
  }
  const n = pick([4, 5, 6]);
  return TROU(
    `Cette boucle <code>while</code> compte à rebours. Remplace-la par une boucle <code>for</code> : rédige l'intégralité
       du nouveau programme, qui doit parcourir les mêmes valeurs dans le même ordre.` + PYHINT +
    PY(["p = 1", "n = " + n, "while n &gt; 0:", "    p = p * n", "    n = n - 1"]) +
    `Voici le squelette à compléter :`,
    PY(["p = 1", "for k in {{0}}({{1}}, {{2}}, {{3}}):", "{{4}}p = p * k"]),
    ["range", String(n), "0", "-1", SP4],
    ["while", String(n + 1), "1", "k = k - 1", "p = p * n"],
    `Pour compter à rebours : range(${n}, 0, -1) part de ${n} et s'arrête juste avant 0 — le pas -1 fait décroître la variable de boucle. Dans le corps, on multiplie par k, la variable de la boucle for, et non par n.`
  );
};

GEN.pyForWhile = () => {
  const v = Math.floor(Math.random() * 4);
  if (v === 0) {
    const n = pick([8, 10, 12]);
    return TROU(
      `Remplace la boucle <code>for</code> par une boucle <code>while</code> : rédige l'intégralité du nouveau programme,
       qui doit parcourir les mêmes valeurs dans le même ordre.` + PYHINT +
      PY(["s = 0", "for i in range(1, " + (n + 1) + "):", "    s = s + i"]) +
      `Voici le squelette à compléter :`,
      PY(["s = 0", "i = {{0}}", "while i &lt;= " + n + ":", "{{1}}s = s + i", "{{2}}i = i + 1"]),
      ["1", SP4, SP4],
      [String(n + 1), "0", "i = i + 2", "i = i - 1"],
      `Contrairement au for, le while n'incrémente RIEN tout seul : sans « i = i + 1 » la boucle tourne à l'infini. Et l'initialisation « i = 1 » doit se faire AVANT le while : avec i = ${n + 1}, la condition i &lt;= ${n} est fausse dès le départ et la somme reste 0. Attention aussi : i = i + 2 raterait un terme sur deux.`
    );
  }
  if (v === 1) {
    const m = pick([5, 6, 7]);
    return TROU(
      `Ce programme double une valeur à chaque tour. Remplace la boucle <code>for</code> par une boucle <code>while</code> :
       rédige l'intégralité du nouveau programme, qui doit parcourir les mêmes valeurs dans le même ordre.` + PYHINT +
      PY(["p = 1", "for k in range(1, " + (m + 1) + "):", "    p = p * 2"]) +
      `Voici le squelette à compléter :`,
      PY(["p = 1", "k = {{0}}", "while k &lt;= " + m + ":", "{{1}}p = p * 2", "{{2}}k = k + 1"]),
      ["1", SP4, SP4],
      ["0", String(m + 1), "k = k + 2", "p = p + 2"],
      `Avec while, tout est manuel : initialiser k AVANT la boucle, puis incrémenter DANS le corps. Avec k = 0, la boucle tournerait ${m + 1} fois au lieu de ${m} et p vaudrait le double. Et p = p + 2 additionnerait au lieu de doubler — confondre « doubler » et « ajouter 2 » est l'erreur classique.`
    );
  }
  if (v === 2) {
    const n = pick([4, 5, 6]);
    return TROU(
      `Cette boucle <code>for</code> compte à rebours. Remplace-la par une boucle <code>while</code> : rédige l'intégralité
       du nouveau programme, qui doit parcourir les mêmes valeurs dans le même ordre.` + PYHINT +
      PY(["p = 1", "for k in range(" + n + ", 0, -1):", "    p = p * k"]) +
      `Voici le squelette à compléter :`,
      PY(["p = 1", "k = {{0}}", "while k &gt; 0:", "{{1}}p = p * k", "{{2}}k = k - 1"]),
      [String(n), SP4, SP4],
      ["0", "1", String(n + 1), "k = k + 1"],
      `Le sens de variation doit être recopié à la main : ici on DÉCRÉMENTE avec k = k - 1. Écrire k = k + 1 rend la condition k &gt; 0 vraie pour toujours : boucle infinie. Initialiser k à 0 ne lance même pas la boucle (0 &gt; 0 est faux) ; l'initialiser à 1 donne p = 1 au lieu de ${n}!.`
    );
  }
  const lim = 20;
  return TROU(
    `Cette boucle <code>for</code> avance de 2 en 2. Remplace-la par une boucle <code>while</code> : rédige l'intégralité
     du nouveau programme, qui doit parcourir les mêmes valeurs dans le même ordre.` + PYHINT +
    PY(["s = 0", "for i in range(2, 21, 2):", "    s = s + i"]) +
    `Voici le squelette à compléter :`,
    PY(["s = 0", "i = {{0}}", "while i &lt;= " + lim + ":", "{{1}}s = s + i", "{{2}}i = i + 2"]),
    ["2", SP4, SP4],
    ["1", "0", "19", "22", "i = i + 1"],
    `Le PAS du for doit être réécrit à la main : i = i + 2, sinon la boucle parcourt aussi les impairs. La condition s'arrête à ${lim} : avec i &lt;= 19, le terme 20 serait perdu ; avec i &lt;= 22, le terme 22 serait ajouté en trop. Et démarrer à 1 additionnerait un impair dès le premier tour.`
  );
};

// --- Attached File Generators (Adapted) ---

var NZ = function (a, b) { var v = R(a, b); while (v === 0) v = R(a, b); return v; };
var gcdF = function (a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; };
var fracS = function (n, d) { if (d < 0) { n = -n; d = -d; } var g = gcdF(n, d); n = n / g; d = d / g; if (d === 1) return String(n); return attM(n) + "/" + d; };
var SUPD = { "0": "\u2070", "1": "\u00b9", "2": "\u00b2", "3": "\u00b3", "4": "\u2074", "5": "\u2075", "6": "\u2076", "7": "\u2077", "8": "\u2078", "9": "\u2079", "-": "\u207b" };
var sup = function (n) { var s = String(n).split(""); return s.map(function (c) { return SUPD[c] || c; }).join(""); };
var term = function (c, p) { var a = Math.abs(c); var s = (a === 1 && p > 0) ? "" : String(a); if (p === 1) s += "x"; else if (p === 2) s += "x\u00b2"; else if (p === 3) s += "x\u00b3"; else if (p === 4) s += "x\u2074"; return s; };
var polyS = function (cs) { var deg = cs.length - 1, out = "", first = true; for (var i = 0; i <= deg; i++) { var c = cs[i], p = deg - i; if (c === 0) continue; var sign = first ? (c < 0 ? NEG + " " : "") : (c < 0 ? NEG + " " : "+ "); out += sign + term(c, p); first = false; } return out === "" ? "0" : out; };
var binF = function (a, c) { var s = (a === 1 ? "" : String(a)) + "x"; if (c !== 0) s += c > 0 ? " + " + c : " " + NEG + " " + (0 - c); return "(" + s + ")"; };
var pts = function (x, y) { return "(" + attM(x) + " ; " + attM(y) + ")"; };
var parabFn = function (r1, r2) { return function (x) { return (x - r1) * (x - r2); }; };
var parabGraph = function (r1, r2, extra) { var g = { curves: [{ fn: parabFn(r1, r2), color: "#0e8f82", label: "f" }], xmin: Math.min(r1, r2) - 3, xmax: Math.max(r1, r2) + 3, ymin: Math.min(-Math.abs(r1 - r2) - 2, -((r1 - r2) * (r1 - r2)) / 4 - 1), ymax: Math.max(Math.abs(r1 * r2), Math.abs(r1 - r2)) + 3, points: [] }; if (extra) extra.points.forEach(function (p) { g.points.push(p); }); return g; };
var trin2 = function (r1, r2, a) { a = a || 1; return [a, -a * (r1 + r2), a * r1 * r2]; };

function graphSVG(spec) {
  var W = 400, H = 290, pad = 30;
  var ymin = spec.ymin, ymax = spec.ymax;
  if (ymin === undefined || ymax === undefined) {
    var mn = Infinity, mx = -Infinity;
    (spec.curves || []).forEach(function (c) { for (var i = 0; i <= 200; i++) { var x = spec.xmin + ((spec.xmax - spec.xmin) * i) / 200; var y = c.fn(x); if (isFinite(y)) { if (y < mn) mn = y; if (y > mx) mx = y; } } });
    (spec.points || []).forEach(function (p) { if (p.y < mn) mn = p.y; if (p.y > mx) mx = p.y; });
    if (!isFinite(mn)) { mn = -5; mx = 5; }
    if (mx - mn < 1) { mx += 1; mn -= 1; }
    var sp = (mx - mn) * 0.15; mn -= sp; mx += sp;
    if (ymin === undefined) ymin = mn;
    if (ymax === undefined) ymax = mx;
  }
  var X = function (x) { return pad + ((x - spec.xmin) / (spec.xmax - spec.xmin)) * (W - 2 * pad); };
  var Y = function (y) { return H - pad - ((y - ymin) / (ymax - ymin)) * (H - 2 * pad); };
  var gstep = spec.grid || Math.max(1, Math.round((spec.xmax - spec.xmin) / 10));
  var gridXs = [], gridYs = [], gx, gy;
  for (gx = Math.ceil(spec.xmin / gstep) * gstep; gx <= spec.xmax + 0.001; gx += gstep) gridXs.push(gx);
  for (gy = Math.ceil(ymin / gstep) * gstep; gy <= ymax + 0.001; gy += gstep) gridYs.push(gy);
  var ox = spec.xmin <= 0 && spec.xmax >= 0 ? X(0) : pad;
  var oy = ymin <= 0 && ymax >= 0 ? Y(0) : H - pad;
  var s = '<svg viewBox="0 0 ' + W + " " + H + '" class="curve" role="img">';
  if (!spec.bars) gridXs.forEach(function (g) { s += '<line x1="' + X(g).toFixed(1) + '" y1="' + (pad - 12) + '" x2="' + X(g).toFixed(1) + '" y2="' + (H - pad + 12) + '" stroke="#e4d8ba" stroke-width="1"/>'; });
  if (!spec.box) gridYs.forEach(function (g) { s += '<line x1="' + (pad - 12) + '" y1="' + Y(g).toFixed(1) + '" x2="' + (W - pad + 12) + '" y2="' + Y(g).toFixed(1) + '" stroke="#e4d8ba" stroke-width="1"/>'; });
  s += '<line x1="' + (pad - 12) + '" y1="' + oy.toFixed(1) + '" x2="' + (W - pad + 12) + '" y2="' + oy.toFixed(1) + '" stroke="#9b8a5e" stroke-width="1.5"/>';
  s += '<line x1="' + ox.toFixed(1) + '" y1="' + (pad - 12) + '" x2="' + ox.toFixed(1) + '" y2="' + (H - pad + 12) + '" stroke="#9b8a5e" stroke-width="1.5"/>';
  if (!spec.bars) gridXs.forEach(function (g) { if (Math.abs(g) >= 0.001) s += '<text x="' + (X(g) + 1).toFixed(1) + '" y="' + (oy + 11).toFixed(1) + '" font-size="9" fill="#8a7a52">' + esc(fr(g)) + "</text>"; });
  if (!spec.box) gridYs.forEach(function (g) { if (Math.abs(g) >= 0.001) s += '<text x="' + (ox + 4).toFixed(1) + '" y="' + (Y(g) + 3).toFixed(1) + '" font-size="9" fill="#8a7a52">' + esc(fr(g)) + "</text>"; });
  var CLIPID = "gclip" + Math.floor(Math.random() * 1e9);
  s += '<defs><clipPath id="' + CLIPID + '"><rect x="' + pad + '" y="' + pad + '" width="' + (W - 2 * pad) + '" height="' + (H - 2 * pad) + '"/></clipPath></defs>';
  (spec.curves || []).forEach(function (c) {
    var d = "", started = false;
    for (var i = 0; i <= 400; i++) { var x = spec.xmin + ((spec.xmax - spec.xmin) * i) / 400; var y = c.fn(x); if (!isFinite(y)) { started = false; continue; } d += (started ? "L" : "M") + X(x).toFixed(1) + "," + Y(y).toFixed(1) + " "; started = true; }
    s += '<g clip-path="url(#' + CLIPID + ')"><path d="' + d + '" fill="none" stroke="' + c.color + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/></g>';
  });
  if (spec.tangent) {
    var t = spec.tangent, dx = (spec.xmax - spec.xmin) / 7, x1 = t.x - dx, x2 = t.x + dx;
    s += '<g clip-path="url(#' + CLIPID + ')"><path d="M' + X(x1).toFixed(1) + "," + Y(t.slope * (x1 - t.x) + t.y).toFixed(1) + " L" + X(x2).toFixed(1) + "," + Y(t.slope * (x2 - t.x) + t.y).toFixed(1) + '" fill="none" stroke="' + (t.color || "#c97900") + '" stroke-width="2" stroke-dasharray="6 4"/></g>';
  }
  /* Diagramme en barres (automatismes : lire un histogramme / diagramme en barres) */
  if (spec.bars) {
    spec.bars.forEach(function (b, i) {
      var xa = X(i - 0.32), xb = X(i + 0.32), yv = Y(b.value), yz = Y(0);
      s += '<rect x="' + xa.toFixed(1) + '" y="' + yv.toFixed(1) + '" width="' + (xb - xa).toFixed(1) + '" height="' + Math.max(2, yz - yv).toFixed(1) + '" fill="' + (b.color || "#0e8f82") + '" stroke="#3a3121" stroke-width="1" rx="4" opacity="0.9"/>';
      s += '<text x="' + X(i).toFixed(1) + '" y="' + (H - pad + 22) + '" font-size="10.5" fill="#7d6f52" text-anchor="middle">' + esc(b.label) + '</text>';
    });
  }
  /* Diagramme en boîte (automatismes : lire un diagramme en boîte) */
  if (spec.box) {
    var bx = spec.box, yb = (pad + (H - pad)) / 2, wb = 16;
    s += '<line x1="' + X(bx.min).toFixed(1) + '" y1="' + yb + '" x2="' + X(bx.q1).toFixed(1) + '" y2="' + yb + '" stroke="#7b5fc0" stroke-width="2"/>';
    s += '<line x1="' + X(bx.q3).toFixed(1) + '" y1="' + yb + '" x2="' + X(bx.max).toFixed(1) + '" y2="' + yb + '" stroke="#7b5fc0" stroke-width="2"/>';
    s += '<line x1="' + X(bx.min).toFixed(1) + '" y1="' + (yb - wb) + '" x2="' + X(bx.min).toFixed(1) + '" y2="' + (yb + wb) + '" stroke="#7b5fc0" stroke-width="2"/>';
    s += '<line x1="' + X(bx.max).toFixed(1) + '" y1="' + (yb - wb) + '" x2="' + X(bx.max).toFixed(1) + '" y2="' + (yb + wb) + '" stroke="#7b5fc0" stroke-width="2"/>';
    s += '<rect x="' + X(bx.q1).toFixed(1) + '" y="' + (yb - wb) + '" width="' + (X(bx.q3) - X(bx.q1)).toFixed(1) + '" height="' + (2 * wb) + '" fill="rgba(123,95,192,.25)" stroke="#7b5fc0" stroke-width="2" rx="4"/>';
    s += '<line x1="' + X(bx.med).toFixed(1) + '" y1="' + (yb - wb) + '" x2="' + X(bx.med).toFixed(1) + '" y2="' + (yb + wb) + '" stroke="#b87900" stroke-width="3.5"/>';
  }
  (spec.points || []).forEach(function (p) {
    s += '<circle cx="' + X(p.x).toFixed(1) + '" cy="' + Y(p.y).toFixed(1) + '" r="4.5" fill="' + (p.color || "#c97900") + '" stroke="#ffffff" stroke-width="1.5"/>';
    if (p.label) s += '<text x="' + (X(p.x) + 7).toFixed(1) + '" y="' + (Y(p.y) - 7).toFixed(1) + '" font-size="11" font-weight="bold" fill="#c97900">' + esc(p.label) + "</text>";
  });
  s += '<text x="' + (W - pad + 4) + '" y="' + (oy - 5).toFixed(1) + '" font-size="11" fill="#8a7a52">x</text>';
  s += '<text x="' + (ox + 5).toFixed(1) + '" y="' + (pad - 14) + '" font-size="11" fill="#8a7a52">y</text>';
  s += '<text x="' + (ox - 4).toFixed(1) + '" y="' + (oy + 11).toFixed(1) + '" font-size="11" fill="#8a7a52">O</text>';
  s += "</svg>";
  return s;
}

