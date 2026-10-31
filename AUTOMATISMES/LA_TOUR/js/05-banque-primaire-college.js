/* ============================================================
   BANQUE « FICHIER FUSIONNÉ » — 1/4 : PRIMAIRE & COLLÈGE
   G centralise les générateurs écrits en Unicode (mkN, mkMC…).
   Les volets 2/4 à 4/4 (automatismes, compléments techno,
   équations littérales) enrichissent le même objet G via
   Object.assign ; l'inscription finale dans GEN a lieu dans
   10-adaptateurs-banque.js.
   ============================================================ */
var G = {};
Object.assign(G, {
  "p-addsub": { tag: "Primaire", label: "Additions et soustractions", make: function (d) {
    if (d === 1) { var a = R(4, 20), b = R(3, 15); return mkN("Le verrou du coffre affiche : " + a + " + " + b + " = ?", a + b, 0.01, "Posez l'addition en colonnes si besoin.", a + " + " + b + " = " + (a + b) + "."); }
    if (d === 2) { var a2 = R(15, 95), b2 = R(10, 95); while (b2 === a2) b2 = R(10, 95); return mkN("Compteur du laboratoire : " + a2 + " + " + b2 + " = ?", a2 + b2, 0.01, "Additionnez unités puis dizaines.", "En posant l'opération : " + a2 + " + " + b2 + " = " + (a2 + b2) + "."); }
    var a3 = R(40, 100), b3 = R(10, 60), c3 = R(5, 40);
    return mkN("Code de la dernière porte : " + a3 + " " + NEG + " " + b3 + " + " + c3 + " = ?", a3 - b3 + c3, 0.01, "Calculez d'abord " + a3 + " " + NEG + " " + b3 + ", puis ajoutez " + c3 + ".", a3 + " " + NEG + " " + b3 + " = " + (a3 - b3) + ", puis " + (a3 - b3) + " + " + c3 + " = " + (a3 - b3 + c3) + "."); } },
  "p-multdiv": { tag: "Primaire", label: "Multiplication et division euclidienne", make: function (d) {
    if (d === 1) { var a = R(6, 9), b = R(6, 9); return mkN("Serrure à tables : " + a + " × " + b + " = ?", a * b, 0.01, "Récitez vos tables de multiplication !", a + " × " + b + " = " + a * b + "."); }
    if (d === 2) { var a2 = R(12, 49), b2 = R(3, 9); return mkN("Les dents du coffre comptent : " + a2 + " × " + b2 + " = ?", a2 * b2, 0.01, "Décomposez : " + a2 + " = " + Math.floor(a2 / 10) * 10 + " + " + (a2 % 10) + ".", a2 + " × " + b2 + " = " + a2 * b2 + " (par décomposition ou en posant l'opération)."); }
    var a3 = R(50, 98), b3 = R(3, 9); while (a3 % b3 === 0) a3 += 1;
    return mkN("Le coffre demande : dans la division euclidienne de " + a3 + " par " + b3 + ", quel est le RESTE ?", a3 % b3, 0.01, "Cherchez le plus grand multiple de " + b3 + " inférieur à " + a3 + ".", b3 + " × " + Math.floor(a3 / b3) + " = " + b3 * Math.floor(a3 / b3) + " et " + a3 + " " + NEG + " " + b3 * Math.floor(a3 / b3) + " = " + (a3 % b3) + " : le reste est " + (a3 % b3) + "."); } },
  "p-compare": { tag: "Primaire", label: "Comparer des nombres", make: function (d) {
    if (d === 1) { var a = R(10, 99), b = R(10, 99), c = R(10, 99); while (b === a) b = R(10, 99); while (c === a || c === b) c = R(10, 99); var big = Math.max(a, b, c); var rest = [a, b, c].filter(function (v) { return v !== big; }); return mkMC("Trois fragments de code : " + a + ", " + b + " et " + c + ". Quel est le nombre le plus grand ?", String(big), rest.map(String), "Comparez d'abord les dizaines, puis les unités.", "Le plus grand est " + big + "."); }
    if (d === 2) { var ip = R(2, 8), d1 = R(100, 999), d2 = R(100, 999), d3 = R(100, 999); while (d2 === d1 || d3 === d1 || d3 === d2) { d2 = R(100, 999); d3 = R(100, 999); } var v1 = ip + d1 / 1000, v2 = ip + d2 / 1000, v3 = ip + d3 / 1000; var vals = [[v1, d1], [v2, d2], [v3, d3]].sort(function (p, q) { return q[0] - p[0]; }); return mkMC("Quel nombre est le plus grand ?", ip + "," + vals[0][1], [ip + "," + vals[1][1], ip + "," + vals[2][1]], "Alignez les virgules et comparez chiffre par chiffre après la virgule.", ip + "," + vals[0][1] + " > " + ip + "," + vals[1][1] + " : le chiffre des millièmes le plus grand gagne."); }
    var den = R(7, 19), xs = [R(1, den - 1), R(1, den - 1), R(1, den - 1)];
    while (xs[0] === xs[1] || xs[0] === xs[2] || xs[1] === xs[2]) { xs = [R(1, den - 1), R(1, den - 1), R(1, den - 1)]; }
    xs.sort(function (p, q) { return q - p; });
    return mkMC("Quelle fraction est la plus grande ?", xs[0] + "/" + den, [xs[1] + "/" + den, xs[2] + "/" + den], "À dénominateur égal, comparez les numérateurs.", "À dénominateur égal (" + den + "), la plus grande est celle au plus grand numérateur : " + xs[0] + "/" + den + "."); } },
  "p-fraction": { tag: "Primaire", label: "Fractions simples et partages", make: function (d) {
    if (d === 1) { var den = pick([2, 3, 4, 5]), num = den - 1, T = den * R(4, Math.floor(100 / den)); return mkN("Les " + num + "/" + den + " de " + T + " graines pour Polynôme, ça fait combien de graines ?", num * T / den, 0.01, num + "/" + den + " de " + T + ", c'est (" + T + " ÷ " + den + ") × " + num + ".", T + " ÷ " + den + " = " + T / den + ", puis " + T / den + " × " + num + " = " + num * T / den + "."); }
    if (d === 2) { var p2 = R(5, 9), pool = []; for (var i2 = 1; i2 <= p2 - 1; i2++) pool.push(i2); var three = shuffle(pool).slice(0, 3); three.sort(function (x, y) { return x - y; }); var a2 = three[0], b2 = three[1], c2 = three[2]; return mkMC("Le gâteau spectral est coupé en " + p2 + " parts égales. Quelle part du gâteau est la plus grande ?", c2 + "/" + p2, [a2 + "/" + p2, b2 + "/" + p2], "À parts égales, comparez les parts prises : les numérateurs.", "Sur " + p2 + " parts égales, " + c2 + " parts battent " + b2 + " parts : " + c2 + "/" + p2 + " > " + b2 + "/" + p2 + "."); }
    var den3 = R(2, 6), m = R(2, 5), num3 = R(1, den3 - 1);
    return mkMC("Complétez : " + num3 + "/" + den3 + " = .../" + den3 * m, String(num3 * m), [String(num3 + m), String(num3 * m + 1), String(num3 * m - 1)], "Le dénominateur passe de " + den3 + " à " + den3 * m + " : par combien multiplie-t-on ?", den3 + " × " + m + " = " + den3 * m + ", donc " + num3 + " × " + m + " = " + num3 * m + " : " + num3 + "/" + den3 + " = " + num3 * m + "/" + den3 * m + "."); } },
  "p-decimaux": { tag: "Primaire", label: "Nombres décimaux", make: function (d) {
    if (d === 1) { var a = R(105, 195) / 10, b = R(15, 95) / 10; return mkN("Prix de deux ressorts : " + fr(a) + " € + " + fr(b) + " € = ? (en €)", Math.round((a + b) * 10) / 10, 0.05, "Alignez les virgules avant d'additionner.", fr(a) + " + " + fr(b) + " = " + fr(a + b) + " €."); }
    if (d === 2) { var a2 = R(15, 97) / 10, sens = pick([10, 100]); return mkN("Multiplication rapide : " + fr(a2) + " × " + sens + " = ?", a2 * sens, 0.05, "Multiplier par " + sens + " décale la virgule vers la droite.", fr(a2) + " × " + sens + " = " + fr(a2 * sens) + "."); }
    var pa = pick([[0.75, "3/4", ["1/2", "2/3", "7/10"]], [0.5, "1/2", ["1/3", "2/5", "5/10"]], [0.25, "1/4", ["1/2", "2/6", "1/3"]], [0.2, "1/5", ["1/4", "2/9", "1/10"]], [0.6, "3/5", ["1/2", "2/5", "6/10"]], [0.8, "4/5", ["3/4", "2/5", "8/9"]]]);
    return mkMC("Quelle fraction vaut " + fr(pa[0]) + " ?", pa[1], pa[2], "Écrivez " + fr(pa[0]) + " sur 100, puis simplifiez.", fr(pa[0]) + " = " + Math.round(pa[0] * 100) + "/100 = " + pa[1] + "."); } },
  "p-conversion": { tag: "Primaire", label: "Conversions d'unités", make: function (d) {
    if (d === 1) { var m = R(2, 9); return mkN("Le compteur du kart : " + m + " m = ... cm", m * 100, 0.01, "1 m = 100 cm.", m + " m = " + m * 100 + " cm."); }
    if (d === 2) { var k = R(2, 9) + 0.5; return mkN("Sac de lest : " + fr(k) + " kg = ... g", k * 1000, 0.1, "1 kg = 1000 g.", fr(k) + " kg = " + fr(k * 1000) + " g."); }
    var cv = pick([["1 m² = ... cm²", "10 000", ["100", "1 000", "100 000"]], ["1 km = ... m", "1 000", ["100", "10 000", "10"]], ["1 L = ... mL", "1 000", ["100", "10 000", "10"]], ["1 t = ... kg", "1 000", ["100", "10 000", "10"]], ["1 h = ... min", "60", ["100", "10", "24"]], ["1 m³ = ... L", "1 000", ["100", "10 000", "10"]], ["1 g = ... mg", "1 000", ["100", "10 000", "10"]], ["1 mm = ... m", "0,001", ["0,01", "0,0001", "0,1"]]]);
    return mkMC(cv[0], cv[1], cv[2], "Rappelez-vous les équivalences d'unités.", cv[0].replace("...", "") + cv[1] + "."); } },
  /* — Conversions TOUS TERRAINS : du femtomètre au parsec —
     Quatre générateurs : longueurs SI (préfixes de 10⁻¹⁵ à 10¹²),
     masses, volumes/contenances, unités du cosmos (parsec, al, UA). */
  "u-si": { tag: "Unités & mesures", label: "Longueurs : de femtomètre en téramètre", make: function (d) {
    var CH = [["fm","pm"],["pm","nm"],["nm","µm"],["µm","mm"],["mm","m"],["m","km"],["km","Mm"],["Mm","Gm"],["Gm","Tm"]];
    var p = pick(CH);
    if (pick([true, false])) {
      /* vers l'unité plus GRANDE : on divise par 1 000 (multiples de 10 pour
         garder un résultat à 2 décimales au plus : 250 µm = 0,25 mm) */
      var v = pick([10, 20, 30, 50, 100, 150, 200, 250, 400, 500, 750]);
      var a = v / 1000;
      return mkN("Du noyau de l'atome au cosmos : " + v + " " + p[0] + " = ... " + p[1] + " ?", a, 0.0001,
        "De " + p[0] + " vers " + p[1] + " : on DIVISE par 1 000 (préfixes voisins : fm, pm, nm, µm, mm, m, km, Mm, Gm, Tm).",
        v + " " + p[0] + " = " + fr(a) + " " + p[1] + " (÷ 1 000).");
    }
    var w = pick([2, 2.5, 3, 4, 5, 7.5, 12, 15, 25, 40, 60, 80, 250, 400, 750]);
    var b = w * 1000;
    return mkN("Du noyau de l'atome au cosmos : " + fr(w) + " " + p[1] + " = ... " + p[0] + " ?", b, 0.01,
      "De " + p[1] + " vers " + p[0] + " : on MULTIPLIE par 1 000 (chaque préfixe voisin vaut × 1 000).",
      fr(w) + " " + p[1] + " = " + fr(b) + " " + p[0] + " (× 1 000).");
  } },
  "u-masse": { tag: "Unités & mesures", label: "Masses : tonnes, kilogrammes, grammes, milligrammes", make: function (d) {
    var v = pick([0.05, 0.1, 0.25, 0.4, 0.5, 0.75, 1.2, 1.5, 2.5, 3.2, 4, 5, 7.5]);
    var mode = Math.floor(Math.random() * 4);
    if (mode === 0) return mkN("Le cartable bien chargé : " + fr(v) + " kg = ... g ?", v * 1000, 0.01,
      "1 kg = 1 000 g : on multiplie par 1 000.", fr(v) + " kg = " + fr(v * 1000) + " g (× 1 000).");
    if (mode === 1) return mkN("Le camion de livraison : " + fr(v * 1000) + " kg = ... t ?", v, 0.0001,
      "1 t = 1 000 kg : on divise par 1 000.", fr(v * 1000) + " kg = " + fr(v) + " t (÷ 1 000).");
    if (mode === 2) return mkN("La poussière sur la balance : " + fr(v * 1000) + " g = ... kg ?", v, 0.0001,
      "1 kg = 1 000 g : on divise par 1 000.", fr(v * 1000) + " g = " + fr(v) + " kg (÷ 1 000).");
    return mkN("Sous la loupe : " + fr(v * 1000) + " mg = ... g ?", v, 0.0001,
      "1 g = 1 000 mg : on divise par 1 000.", fr(v * 1000) + " mg = " + fr(v) + " g (÷ 1 000).");
  } },
  "u-volume": { tag: "Unités & mesures", label: "Volumes et contenances : m³, litres, décilitres, centilitres", make: function (d) {
    var v = pick([0.05, 0.1, 0.2, 0.25, 0.5, 0.8, 1.2, 1.5, 2.5, 3, 4.5, 6, 8]);
    var mode = Math.floor(Math.random() * 5);
    if (mode === 0) return mkN("La citerne d'eau : " + fr(v) + " m³ = ... L ?", v * 1000, 0.01,
      "1 m³ = 1 000 L : on multiplie par 1 000.", fr(v) + " m³ = " + fr(v * 1000) + " L (× 1 000).");
    if (mode === 1) return mkN("La citerne d'eau : " + fr(v) + " m³ = ... dL ?", v * 10000, 0.01,
      "1 m³ = 1 000 L et 1 L = 10 dL, donc 1 m³ = 10 000 dL.",
      fr(v) + " m³ = " + fr(v * 1000) + " L = " + fr(v * 10000) + " dL.");
    if (mode === 2) return mkN("L'aquarium du salon : " + fr(v) + " dm³ = ... L ?", v, 0.0001,
      "1 dm³ = 1 L exactement : même contenance, unités différentes.",
      fr(v) + " dm³ = " + fr(v) + " L (1 dm³ = 1 L).");
    if (mode === 3) return mkN("La bouteille de jus : " + fr(v) + " dm³ = ... cL ?", v * 100, 0.01,
      "1 dm³ = 1 L = 100 cL.", fr(v) + " dm³ = " + fr(v) + " L = " + fr(v * 100) + " cL.");
    var m = pick([120, 250, 450, 800, 1500]);
    return mkN("Le verre de soda : " + m + " mL = ... cL ?", m / 10, 0.0001,
      "1 cL = 10 mL : on divise par 10.", m + " mL = " + fr(m / 10) + " cL (÷ 10).");
  } },
  "u-astronomie": { tag: "Unités & mesures", label: "Unités du cosmos : parsec, année-lumière, unité astronomique", make: function (d) {
    var q = pick([
      ["1 parsec (pc) ≈ ... années-lumière ?", "≈ 3,26 al",
       ["≈ 0,326 al", "≈ 32,6 al", "≈ 3,26 × 10⁴ al"],
       "1 pc ≈ 3,26 al : le parsec est un peu plus grand que l'année-lumière.",
       "1 pc ≈ 3,26 années-lumière."],
      ["1 année-lumière ≈ ... km ?", "≈ 9 461 milliards de km",
       ["≈ 9 461 millions de km", "≈ 300 000 km", "≈ 9 461 mille milliards de km"],
       "La lumière parcourt environ 300 000 km par seconde : en un an, elle couvre ≈ 9,461 × 10¹² km.",
       "1 al ≈ 9 461 000 000 000 km, soit ≈ 9 461 milliards de km."],
      ["1 unité astronomique (UA) ≈ ... km ?", "≈ 149,6 millions de km",
       ["≈ 149,6 milliards de km", "≈ 1,496 million de km", "≈ 149,6 mille km"],
       "1 UA = distance moyenne Terre-Soleil ≈ 1,496 × 10⁸ km.",
       "1 UA ≈ 149 600 000 km."],
      ["1 parsec ≈ ... unités astronomiques ?", "≈ 206 265 UA",
       ["≈ 3,26 UA", "≈ 26 500 UA", "≈ 20,6 UA"],
       "1 pc = distance à laquelle 1 UA est vue sous un angle d'une seconde d'arc : ≈ 206 265 UA.",
       "1 pc ≈ 206 265 UA ≈ 3,26 al."],
      ["Le femtomètre, l'unité du noyau atomique : 1 fm = ... m ?", "10⁻¹⁵ m",
       ["10⁻¹² m", "10⁻⁹ m", "10⁻¹⁸ m"],
       "femto = 10⁻¹⁵ : un proton mesure environ 1 fm.",
       "1 fm = 10⁻¹⁵ m — un proton fait environ 1 fm de rayon."],
      ["Le téramètre, l'unité du système solaire : 1 Tm = ... km ?", "10⁹ km",
       ["10¹² km", "10⁶ km", "10³ km"],
       "téra = 10¹² : 1 Tm = 10¹² m = 10⁹ km.",
       "1 Tm = 10¹² m = 1 000 000 000 km."],
      ["Proxima du Centaure est à 4,24 al de la Terre : cela fait environ ... parsecs ?", "≈ 1,3 pc",
       ["≈ 4,24 pc", "≈ 0,13 pc", "≈ 13 pc"],
       "1 al ≈ 0,307 pc : on divise 4,24 par 3,26.",
       "4,24 al ÷ 3,26 ≈ 1,3 pc."]
    ]);
    return mkMC(q[0], q[1], q[2], q[3], q[4]);
  } },
  /* — MESURES : écriture scientifique, chiffres significatifs, dimensions —
     Trois générateurs complémentaires des conversions : passages en écriture
     scientifique (dans les deux sens, avec produits, quotients et carrés),
     décompte et arrondi en chiffres significatifs après calculs enchaînés,
     analyse dimensionnelle des grandeurs physiques. */
  "u-sci": { tag: "Unités & mesures", label: "Écriture scientifique : passages, produits, quotients, carrés", make: function (d) {
    var q = pick([
      ["Écriture scientifique : 25 000 = ... ?", "2,5 × 10⁴", ["25 × 10³", "2,5 × 10⁵", "2,5 × 10³"],
       "La mantisse est un nombre entre 1 et 10 ; l'exposant de 10 rétablit l'ordre de grandeur.",
       "25 000 = 2,5 × 10⁴ : mantisse 2,5 (entre 1 et 10), exposant 4."],
      ["Écriture scientifique : 4 070 = ... ?", "4,07 × 10³", ["4,07 × 10²", "40,7 × 10²", "4,7 × 10³"],
       "On garde tous les chiffres significatifs dans la mantisse.",
       "4 070 = 4,07 × 10³ : le zéro final n'est pas significatif, la mantisse garde 4,07."],
      ["Écriture scientifique : 725 000 = ... ?", "7,25 × 10⁵", ["7,25 × 10⁶", "72,5 × 10⁴", "7,25 × 10⁴"],
       "7,25 est entre 1 et 10 ; il reste un facteur 10⁵.",
       "725 000 = 7,25 × 10⁵."],
      ["Écriture scientifique : 630 000 000 = ... ?", "6,3 × 10⁸", ["6,3 × 10⁷", "63 × 10⁷", "6,3 × 10⁹"],
       "On décale la virgule jusqu'au premier chiffre non nul, puis on compte les rangs.",
       "630 000 000 = 6,3 × 10⁸."],
      ["Écriture scientifique : 0,00032 = ... ?", "3,2 × 10⁻⁴", ["3,2 × 10⁻³", "32 × 10⁻⁵", "3,2 × 10⁴"],
       "Nombre plus petit que 1 : l'exposant est NÉGATIF (virgule décalée de 4 rangs vers la gauche).",
       "0,00032 = 3,2 × 10⁻⁴."],
      ["Écriture scientifique : 0,00407 = ... ?", "4,07 × 10⁻³", ["4,07 × 10⁻⁴", "40,7 × 10⁻⁴", "4,07 × 10³"],
       "Exposant −3 : la virgule est décalée de 3 rangs vers la gauche.",
       "0,00407 = 4,07 × 10⁻³."],
      ["Écriture scientifique : 0,00000205 = ... ?", "2,05 × 10⁻⁶", ["2,05 × 10⁻⁵", "20,5 × 10⁻⁷", "2,5 × 10⁻⁶"],
       "2,05 entre 1 et 10, exposant −6.",
       "0,00000205 = 2,05 × 10⁻⁶ : tous les chiffres significatifs restent dans la mantisse."],
      ["Écriture scientifique : 149 600 000 km = ... km ?", "1,496 × 10⁸ km", ["1,496 × 10⁹ km", "14,96 × 10⁷ km", "1,496 × 10⁷ km"],
       "La distance Terre-Soleil : mantisse 1,496, exposant 8.",
       "149 600 000 km = 1,496 × 10⁸ km (c'est l'unité astronomique)."],
      ["3,8 × 10⁵ = ... ?", "380 000", ["38 000", "3 800 000", "3 800"],
       "Exposant positif : on décale la virgule de 5 rangs vers la droite.",
       "3,8 × 10⁵ = 380 000."],
      ["9,5 × 10⁷ = ... ?", "95 000 000", ["9 500 000", "950 000 000", "970 000"],
       "On décale la virgule de 7 rangs vers la droite.",
       "9,5 × 10⁷ = 95 000 000."],
      ["7,25 × 10² = ... ?", "725", ["72,5", "7 250", "70,25"],
       "On décale la virgule de 2 rangs vers la droite.",
       "7,25 × 10² = 725."],
      ["5,2 × 10⁻³ = ... ?", "0,0052", ["0,052", "0,00052", "520"],
       "Exposant négatif : on décale la virgule de 3 rangs vers la gauche.",
       "5,2 × 10⁻³ = 0,0052."],
      ["4,5 × 10⁻² = ... ?", "0,045", ["0,45", "0,0045", "450"],
       "On décale la virgule de 2 rangs vers la gauche.",
       "4,5 × 10⁻² = 0,045."],
      ["(2 × 10³) × (4 × 10⁵) = ... ? (résultat en écriture scientifique)", "8 × 10⁸", ["8 × 10¹⁵", "6 × 10⁸", "8 × 10²"],
       "On multiplie les mantisses et on ADDITIONNE les exposants.",
       "2 × 4 = 8 ; 10³ × 10⁵ = 10⁸ : résultat 8 × 10⁸."],
      ["(6 × 10⁷) ÷ (2 × 10²) = ... ? (résultat en écriture scientifique)", "3 × 10⁵", ["3 × 10⁹", "4 × 10⁵", "3 × 10³"],
       "On divise les mantisses et on SOUSTRAIT les exposants.",
       "6 ÷ 2 = 3 ; 10⁷ ÷ 10² = 10⁵ : résultat 3 × 10⁵."],
      ["(2,5 × 10⁻³) × (4 × 10⁶) = ... ? (résultat en écriture scientifique)", "1 × 10⁴", ["10 × 10³", "1 × 10⁻⁹", "1 × 10³"],
       "2,5 × 4 = 10 : la mantisse doit être ramenée entre 1 et 10 (1 × 10), on reporte la retenue sur l'exposant.",
       "2,5 × 4 = 10 et 10⁻³ × 10⁶ = 10³, donc 10 × 10³ = 1 × 10⁴ en écriture scientifique."],
      ["(9 × 10⁸) ÷ (3 × 10⁻²) = ... ? (résultat en écriture scientifique)", "3 × 10¹⁰", ["3 × 10⁶", "3 × 10¹⁶", "27 × 10⁶"],
       "9 ÷ 3 = 3 ; pour les exposants : 8 − (−2) = 10.",
       "9 ÷ 3 = 3 ; 10⁸ ÷ 10⁻² = 10¹⁰ : résultat 3 × 10¹⁰."],
      ["(5 × 10³)² = ... ? (résultat en écriture scientifique)", "2,5 × 10⁷", ["5 × 10⁶", "25 × 10⁶", "2,5 × 10⁶"],
       "On met mantisse et exposant AU CARRÉ, puis on ramène la mantisse entre 1 et 10.",
       "(5 × 10³)² = 25 × 10⁶ = 2,5 × 10⁷ : 25 × 10⁶ n'est PAS une écriture scientifique."]
    ]);
    return mkMC(q[0], q[1], q[2], q[3], q[4]);
  } },
  "u-cs": { tag: "Unités & mesures", label: "Chiffres significatifs : décompte et arrondi après calculs enchaînés", make: function (d) {
    var q = pick([
      ["Combien de CHIFFRES SIGNIFICATIFS compte 0,00450 ?", "3", ["2", "5", "6"],
       "Les zéros à GAUCHE ne comptent jamais ; le zéro final après la virgule, si.",
       "0,00450 : les trois zéros à gauche ne comptent pas ; 4, 5 et le 0 final, si : 3 chiffres significatifs."],
      ["Combien de CHIFFRES SIGNIFICATIFS compte 125,0 ?", "4", ["3", "5", "2"],
       "Un zéro final APRÈS la virgule est significatif : il indique la précision de la mesure.",
       "125,0 : 1, 2, 5 et le 0 final comptent : 4 chiffres significatifs."],
      ["Combien de CHIFFRES SIGNIFICATIFS compte 2,0 × 10³ ?", "2", ["1", "3", "4"],
       "En écriture scientifique, on ne compte que la mantisse (jamais l'exposant).",
       "Mantisse 2,0 : 2 chiffres significatifs."],
      ["Combien de CHIFFRES SIGNIFICATIFS compte 5,02 × 10⁻³ ?", "3", ["2", "4", "5"],
       "On compte les chiffres de la mantisse, zéros INTÉRIEURS compris.",
       "Mantisse 5,02 : 3 chiffres significatifs."],
      ["Combien de CHIFFRES SIGNIFICATIFS compte 0,10 ?", "2", ["1", "3", "4"],
       "Le 0 final après la virgule est significatif ; le 0 avant la virgule, non.",
       "0,10 : 2 chiffres significatifs (le 1 et le 0 final)."],
      ["Combien de CHIFFRES SIGNIFICATIFS compte 12,0 ?", "3", ["2", "4", "1"],
       "Le 0 final après la virgule est significatif.",
       "12,0 : 3 chiffres significatifs."],
      ["Calculs enchaînés : (5,0 × 3,00) ÷ 2,5. Avec combien de CHIFFRES SIGNIFICATIFS le résultat doit-il être donné ?", "2", ["3", "1", "4"],
       "Le résultat garde le nombre de chiffres significatifs du facteur le MOINS PRÉCIS.",
       "5,0 et 2,5 ont 2 chiffres significatifs, 3,00 en a 3 : le résultat se limite à 2 chiffres significatifs."],
      ["Calculs enchaînés : (1,50 × 2,25) ÷ 4,00. Avec combien de CHIFFRES SIGNIFICATIFS le résultat doit-il être donné ?", "3", ["2", "4", "1"],
       "On repère le facteur le moins précis.",
       "1,50, 2,25 et 4,00 ont chacun 3 chiffres significatifs : résultat à 3 chiffres."],
      ["Calculs enchaînés : (6,0 × 5,00) ÷ 12,5. Avec combien de CHIFFRES SIGNIFICATIFS le résultat doit-il être donné ?", "2", ["3", "4", "1"],
       "Le facteur le moins précis impose sa précision à tout le calcul.",
       "6,0 n'a que 2 chiffres significatifs : le résultat se donne avec 2 chiffres."],
      ["Calculs enchaînés : (1,200 × 30,0) ÷ 0,0400. Avec combien de CHIFFRES SIGNIFICATIFS le résultat doit-il être donné ?", "3", ["2", "4", "1"],
       "Attention aux zéros après la virgule : ils sont significatifs.",
       "1,200 → 4 chiffres ; 30,0 → 3 ; 0,0400 → 3 : le résultat se limite à 3 chiffres significatifs."],
      ["Calcul enchaîné : (5,0 × 3,00) ÷ 2,5 = ... ? (résultat ARRONDI correctement en chiffres significatifs)", "6,0", ["6", "6,00", "6,000"],
       "Le calcul ne peut pas être plus précis que 5,0 et 2,5 : 2 chiffres significatifs.",
       "(5,0 × 3,00) ÷ 2,5 = 6 : arrondi à 2 chiffres significatifs, on écrit 6,0."],
      ["Calcul enchaîné : (8,0 × 3,00) ÷ 4,0 = ... ? (résultat ARRONDI correctement en chiffres significatifs)", "6,0", ["6", "6,00", "6,4"],
       "8,0 et 4,0 imposent 2 chiffres significatifs au résultat.",
       "(8,0 × 3,00) ÷ 4,0 = 6 : arrondi à 2 chiffres significatifs, on écrit 6,0."],
      ["Calcul enchaîné : (2,0 × 3,00) ÷ 1,5 = ... ? (résultat ARRONDI correctement en chiffres significatifs)", "4,0", ["4", "4,00", "3,9"],
       "2,0 et 1,5 imposent 2 chiffres significatifs.",
       "(2,0 × 3,00) ÷ 1,5 = 4 : arrondi à 2 chiffres significatifs, on écrit 4,0."]
    ]);
    return mkMC(q[0], q[1], q[2], q[3], q[4]);
  } },
  "u-dim": { tag: "Unités & mesures", label: "Analyse dimensionnelle : dimensions et homogénéité des formules", make: function (d) {
    var q = pick([
      ["La vitesse est définie par v = d ÷ t (distance divisée par la durée). Quelle est la DIMENSION de v ?", "m·s⁻¹", ["m·s", "m·s⁻²", "s⁻¹"],
       "On divise la dimension de la distance ([m]) par celle de la durée ([s]).",
       "v = d ÷ t, donc [v] = [m] ÷ [s] = m·s⁻¹."],
      ["L'accélération est définie par a = v ÷ t (vitesse divisée par la durée). Quelle est la DIMENSION de a ?", "m·s⁻²", ["m·s⁻¹", "m·s²", "m²·s⁻¹"],
       "Une vitesse (m·s⁻¹) divisée par un temps (s).",
       "a = v ÷ t, donc [a] = m·s⁻¹ ÷ s = m·s⁻²."],
      ["La force est définie par F = m × a (masse × accélération). Quelle est l'UNITÉ SI de la force ?", "le newton (N)", ["le joule (J)", "le watt (W)", "le pascal (Pa)"],
       "On multiplie des kilogrammes par des m·s⁻².",
       "F = m × a : 1 N = 1 kg × 1 m·s⁻² = 1 kg·m·s⁻²."],
      ["La masse volumique est définie par ρ = m ÷ V (masse divisée par le volume). Quelle est la DIMENSION de ρ ?", "kg·m⁻³", ["kg·m³", "kg·m⁻²", "kg²·m⁻³"],
       "Une masse divisée par un volume en m³.",
       "ρ = m ÷ V, donc [ρ] = kg ÷ m³ = kg·m⁻³."],
      ["L'énergie cinétique est Ec = 0,5 × m × v². Quelle est la DIMENSION de Ec ?", "kg·m²·s⁻²", ["kg·m·s⁻²", "kg·m²·s⁻¹", "kg·m²·s⁻³"],
       "La vitesse est AU CARRÉ : (m·s⁻¹)² = m²·s⁻², multiplié par la masse.",
       "Ec = 0,5 × m × v², donc [Ec] = kg × (m·s⁻¹)² = kg·m²·s⁻² (c'est le joule)."],
      ["La puissance est définie par P = W ÷ t (énergie divisée par la durée). Quelle est la DIMENSION de P ?", "kg·m²·s⁻³", ["kg·m²·s⁻²", "kg·m·s⁻³", "kg·m³·s⁻²"],
       "Une énergie (kg·m²·s⁻²) divisée par un temps (s).",
       "P = W ÷ t, donc [P] = kg·m²·s⁻² ÷ s = kg·m²·s⁻³ (c'est le watt)."],
      ["La pression est définie par p = F ÷ S (force divisée par une surface). Quelle est la DIMENSION de p ?", "kg·m⁻¹·s⁻²", ["kg·m⁻²·s⁻²", "kg·m·s⁻²", "kg·m⁻¹·s⁻¹"],
       "Une force (kg·m·s⁻²) divisée par une surface (m²).",
       "p = F ÷ S, donc [p] = kg·m·s⁻² ÷ m² = kg·m⁻¹·s⁻² (c'est le pascal)."],
      ["Vérification d'homogénéité : l'équation v² = 2 × a × d est-elle correcte sur le plan dimensionnel ?", "Oui : v² et a × d donnent tous deux m²·s⁻²", ["Non : v² donne m·s⁻²", "Non : un facteur 2 rend l'équation non homogène", "Non : a × d donne m·s⁻²"],
       "On compare les dimensions des deux membres : (m·s⁻¹)² = m²·s⁻² et (m·s⁻²) × m = m²·s⁻². Le facteur 2 est un simple coefficient, sans dimension.",
       "v² = 2 × a × d : m²·s⁻² = (m·s⁻²) × m = m²·s⁻² : l'équation est bien homogène."],
      ["La fréquence est définie par f = 1 ÷ T (inverse d'une durée). Quelle est la DIMENSION de f ?", "s⁻¹", ["s", "s²", "m·s⁻¹"],
       "C'est l'inverse d'un temps.",
       "f = 1 ÷ T, donc [f] = s⁻¹ (l'unité est le hertz)."],
      ["La longueur d'onde est définie par λ = v ÷ f (vitesse divisée par la fréquence). Quelle est la DIMENSION de λ ?", "m", ["m·s⁻¹", "s⁻¹", "m·s"],
       "Une vitesse (m·s⁻¹) divisée par une fréquence (s⁻¹) : les secondes se simplifient.",
       "λ = v ÷ f, donc [λ] = m·s⁻¹ ÷ s⁻¹ = m : une longueur."]
    ]);
    return mkMC(q[0], q[1], q[2], q[3], q[4]);
  } },
  "p-geo": { tag: "Primaire", label: "Périmètres, aires, volumes", make: function (d) {
    var L = R(4, 12), l = R(2, 8);
    if (d === 1) return mkN("Raccourci rectangulaire de longueur " + L + " m et largeur " + l + " m : quel est son PÉRIMÈTRE (en m) ?", 2 * (L + l), 0.01, "Périmètre = 2 × (longueur + largeur).", "P = 2 × (" + L + " + " + l + ") = " + 2 * (L + l) + " m.");
    if (d === 2) return mkN("Le même raccourci rectangulaire : longueur " + L + " m et largeur " + l + " m. Quelle est son AIRE (en m²) ?", L * l, 0.01, "Aire = longueur × largeur.", "A = " + L + " × " + l + " = " + L * l + " m².");
    var b = 2 * R(2, 6), h = R(2, 9);
    return mkN("Un panneau triangulaire : base " + b + " m, hauteur " + h + " m. Quelle est son AIRE (en m²) ?", b * h / 2, 0.01, "Aire d'un triangle = (base × hauteur) ÷ 2.", "A = (" + b + " × " + h + ") ÷ 2 = " + b * h / 2 + " m²."); } },
  "p-prop": { tag: "Primaire", label: "Proportionnalité et pourcentages simples", make: function (d) {
    if (d === 1) { var a = 2 * R(6, 50); return mkN("La moitié de " + a + " litres de jus de volcan ?", a / 2, 0.01, "La moitié, c'est diviser par 2.", a + " ÷ 2 = " + a / 2 + "."); }
    if (d === 2) { var pool = [], ps = [5, 10, 20, 25, 50, 75]; for (var i = 0; i < ps.length; i++) for (var n = 40; n <= 400; n += 20) if ((ps[i] * n) % 100 === 0 && ps[i] !== 100) pool.push([ps[i], n]); var pp = pick(pool); return mkN(pp[0] + " % de " + pp[1] + " pièces détachées ?", pp[0] * pp[1] / 100, 0.01, pp[0] + " % de n, c'est (n × " + pp[0] + ") ÷ 100.", pp[0] + "% de " + pp[1] + " = " + pp[1] + " × " + pp[0] + " ÷ 100 = " + pp[0] * pp[1] / 100 + "."); }
    var per = R(2, 5), g = per * R(12, 20), k = R(2, 4);
    return mkN("Recette : " + g + " g de farine pour " + per + " personnes. Pour " + per * k + " personnes, il faut ... g de farine.", g * k, 1, "Combien de fois plus de personnes ? " + per * k + " = " + per + " × " + k + ".", g + " × " + k + " = " + g * k + " g."); } },
  "p-heure": { tag: "Primaire", label: "Lire l'heure et les durées", make: function (d) {
    if (d === 1) { var h = R(1, 12), g = R(1, 11), mins = 5 * g; return mkMC("L'horloge du hall : la petite aiguille est sur le " + h + ", la grande aiguille est sur le " + g + ". Quelle heure est-il ?", h + " h " + mins, [h + " h " + g, (h === 12 ? 11 : h + 1) + " h " + mins, h + " h " + (mins + 10)], "La grande aiguille sur le " + g + " indique " + g + " × 5 minutes.", "La grande aiguille sur le " + g + " → " + mins + " min : il est " + h + " h " + mins + "."); }
    if (d === 2) { var h1 = R(1, 3), m1 = 5 * R(1, 11), h2 = R(1, 3), m2 = 5 * R(1, 11); var H = h1 + h2 + (m1 + m2 >= 60 ? 1 : 0), MM = (m1 + m2) % 60; return mkMC("Trajet kart : " + h1 + " h " + m1 + " + " + h2 + " h " + m2 + " = ?", H + " h " + MM, [(h1 + h2) + " h " + (m1 + m2), H + " h " + (MM + 10), (H + 1) + " h " + MM], "Additionnez heures et minutes séparément ; 60 min = 1 h.", h1 + " h + " + h2 + " h = " + (h1 + h2) + " h ; " + m1 + " + " + m2 + " = " + (m1 + m2) + " min = " + Math.floor((m1 + m2) / 60) + " h " + MM + ". Total : " + H + " h " + MM + "."); }
    var hs = R(6, 20), ms = 5 * R(0, 11), hd = R(1, 2), md = 5 * R(1, 11); var HA = hs + hd + (ms + md >= 60 ? 1 : 0), MA = (ms + md) % 60;
    return mkMC("Le Baron part à " + hs + " h " + ms + " pour un trajet de " + hd + " h " + md + ". Heure d'arrivée ?", HA + " h " + MA, [(hs + hd) + " h " + (ms + md), HA + " h " + (MA + 10), (HA + 1) + " h " + MA], "Additionnez d'abord les heures, puis les minutes (60 min = 1 h).", hs + " h + " + hd + " h puis " + ms + " + " + md + " = " + (ms + md) + " min : arrivée à " + HA + " h " + MA + "."); } },
  "p-suite": { tag: "Primaire", label: "Suites de nombres (continuer une série)", make: function (d) {
    if (d === 1) { var u = R(1, 9), r = R(2, 5); return mkMC("Les dalles s'allument : " + u + ", " + (u + r) + ", " + (u + 2 * r) + ", " + (u + 3 * r) + ", ... Quel est le nombre suivant ?", String(u + 4 * r), [String(u + 4 * r + 1), String(u + 3 * r + 1), String(u + 5 * r)], "De combien avance-t-on à chaque étape ?", "On avance de " + r + " en " + r + " : " + (u + 3 * r) + " + " + r + " = " + (u + 4 * r) + "."); }
    if (d === 2) { var u2 = R(1, 4), q = pick([2, 3]); return mkMC("Suite magique : " + u2 + ", " + u2 * q + ", " + u2 * q * q + ", " + u2 * q * q * q + ", ... ?", String(u2 * Math.pow(q, 4)), [String(u2 * Math.pow(q, 4) + u2), String(u2 * Math.pow(q, 3) + q), String(u2 * q * q * q * q * q)], "Chaque nombre est obtenu en MULTIPLIANT le précédent.", "On multiplie par " + q + " : " + u2 * Math.pow(q, 3) + " × " + q + " = " + u2 * Math.pow(q, 4) + "."); }
    var u3 = R(10, 50) / 10, s = R(2, 9) / 10;
    return mkMC("Suite chronométrique : " + fr(u3) + " ; " + fr(u3 + s) + " ; " + fr(u3 + 2 * s) + " ; ... ?", fr(u3 + 3 * s), [fr(u3 + 3 * s + 0.1), fr(u3 + 2 * s), fr(u3 + 4 * s + 0.1)], "De combien augmente-t-on à chaque fois ?", "On ajoute " + fr(s) + " : " + fr(u3 + 2 * s) + " + " + fr(s) + " = " + fr(u3 + 3 * s) + "."); } },
  "p-probleme": { tag: "Primaire", label: "Problèmes à plusieurs étapes", make: function (d) {
    if (d === 1) { var tot = 3 * R(8, 30), eaten = R(1, 3); return mkN("Emma a " + tot + " bonbons. Elle donne un tiers de ses bonbons à Léo, puis en mange " + eaten + ". Combien lui reste-t-il de bonbons ?", tot - tot / 3 - eaten, 0.01, "Étape 1 : un tiers de " + tot + ". Étape 2 : enlever " + eaten + ".", tot + " ÷ 3 = " + tot / 3 + " bonbons donnés ; " + tot + " " + NEG + " " + tot / 3 + " = " + (tot - tot / 3) + " ; " + (tot - tot / 3) + " " + NEG + " " + eaten + " = " + (tot - tot / 3 - eaten) + "."); }
    if (d === 2) { var packs = R(5, 15), per = pick([6, 8, 12]), drunk = R(3, packs * per - 2); return mkN("Un convoi de " + packs + " packs de " + per + " bouteilles. On en boit " + drunk + ". Combien reste-t-il de bouteilles ?", packs * per - drunk, 0.01, "Trouvez d'abord le total des bouteilles.", packs + " × " + per + " = " + packs * per + " ; " + packs * per + " " + NEG + " " + drunk + " = " + (packs * per - drunk) + "."); }
    var money = 3 * R(10, 30), fee = R(2, 5);
    return mkN("Trois amis se partagent " + money + " €. Chacun doit ensuite payer " + fee + " € de péage. Combien reste-t-il à chacun ?", money / 3 - fee, 0.01, "Partagez d'abord les " + money + " €, puis retirez le péage.", money + " ÷ 3 = " + money / 3 + " € ; " + money / 3 + " " + NEG + " " + fee + " = " + (money / 3 - fee) + " €."); } },
  "p-romain": { tag: "Primaire", label: "Chiffres romains", make: function (d) {
    var pool = d === 1 ? pick([["XIV", 14], ["IX", 9], ["XIX", 19], ["XXIV", 24]]) : d === 2 ? pick([["XLII", 42], ["LXVIII", 68], ["XCIV", 94], ["XXXVII", 37]]) : pick([["MCD", 1400], ["MMXXVI", 2026], ["DCCC", 800], ["MCMXC", 1990]]);
    var v = pool[1], w = [v + 2, v - 2, v + 10].filter(function (x) { return x !== v && x > 0; });
    return mkMC("Le socle du laboratoire porte : " + pool[0] + ". Quel nombre ?", String(v), w.map(String), "X = 10, V = 5, I = 1 ; quand un petit symbole précède, on SOUSRAIT.", pool[0] + " = " + v + "."); } },
  "p-symetrie": { tag: "Primaire", label: "Axes de symétrie", make: function (d) {
    if (d === 1) return mkMC("Combien d'axes de symétrie possède un carré ?", "4", ["2", "1", "8"], "Tracez mentalement les pliages qui superposent la figure.", "Un carré a 4 axes de symétrie (2 médianes et 2 diagonales).");
    if (d === 2) return mkMC("Combien d'axes de symétrie possède un rectangle (non carré) ?", "2", ["4", "1", "0"], "Les diagonales d'un rectangle ne sont PAS des axes de symétrie.", "Un rectangle a seulement 2 axes : les médiatrices des côtés.");
    return mkMC("Combien d'axes de symétrie possède un cercle ?", "Une infinité", ["1", "2", "4"], "Tout diamètre plie le cercle sur lui-même.", "Chaque diamètre est un axe : une infinité d'axes de symétrie."); } },

  "c-relatifs": { tag: "Collège", label: "Nombres relatifs", make: function (d) {
    if (d === 1) { var a = -R(3, 20), b = R(3, 20); return mkN("Le thermomètre du manoir : (" + attM(a) + ") + (+" + b + ") = ?", a + b, 0.01, "Signes différents : on garde le signe du plus « fort » en distance.", "(" + attM(a) + ") + (+" + b + ") = " + attM(a + b) + "."); }
    if (d === 2) { var a2 = -R(3, 12), b2 = -R(3, 12); return mkN("Le fantôme multiplie : (" + attM(a2) + ") × (" + attM(b2) + ") = ?", a2 * b2, 0.01, "Négatif × négatif = positif !", "(" + attM(a2) + ") × (" + attM(b2) + ") = +" + a2 * b2 + " : le produit de deux négatifs est positif."); }
    var a3 = R(2, 6), b3 = R(2, 6), c3 = R(2, 9);
    return mkN("Calculez : (" + attM(-a3) + ")² + " + b3 + " × " + c3 + " = ?", a3 * a3 + b3 * c3, 0.01, "Le carré d'un négatif est toujours POSITIF. D'abord le carré, puis la multiplication, puis l'addition.", "(" + attM(-a3) + ")² = " + a3 * a3 + " et " + b3 + " × " + c3 + " = " + b3 * c3 + " ; donc " + a3 * a3 + " + " + b3 * c3 + " = " + (a3 * a3 + b3 * c3) + "."); } },
  "c-fracops": { tag: "Collège", label: "Opérations sur les fractions", make: function (d) {
    if (d === 1) { var den = R(4, 12), n1 = R(1, den - 2), n2 = R(1, den - n1); return mkMC("Le gâteau spectral : " + n1 + "/" + den + " + " + n2 + "/" + den + " = ?", (n1 + n2) + "/" + den, [(n1 + n2) + "/" + (2 * den), (n1 * n2) + "/" + den, Math.abs(n1 - n2) + "/" + den], "Même dénominateur : additionnez les numérateurs (pas les dénominateurs !).", n1 + "/" + den + " + " + n2 + "/" + den + " = (" + n1 + " + " + n2 + ")/" + den + " = " + (n1 + n2) + "/" + den + "."); }
    if (d === 2) { var a, bb, c, e, corr, uniq, tries = 0;
      do { a = R(1, 5); bb = R(2, 9); c = R(1, 5); e = R(2, 9); tries++;
        corr = fracS(a * c, bb * e); uniq = [];
        [fracS(a + c, bb + e), fracS(a * e, bb * c), fracS(a * c, bb + e), fracS(a * c + 1, bb * e)].forEach(function (w) { if (w !== corr && uniq.indexOf(w) < 0) uniq.push(w); });
      } while (uniq.length < 2 && tries < 25);
      return mkMC("Part de la dune : " + a + "/" + bb + " × " + c + "/" + e + " = ?", corr, uniq, "Multipliez numérateurs entre eux et dénominateurs entre eux.", "(" + a + " × " + c + ")/(" + bb + " × " + e + ") = " + corr + "."); }
    var a3, b3, c3, e3, corr3, uniq3, tries3 = 0;
    do { a3 = R(1, 5); b3 = R(2, 9); c3 = R(1, 5); e3 = R(2, 9); tries3++;
      corr3 = fracS(a3 * e3, b3 * c3); uniq3 = [];
      [fracS(a3 * c3, b3 * e3), fracS(b3 * c3, a3 * e3), fracS(a3 + e3, b3 + c3), fracS(a3 * e3 + 1, b3 * c3)].forEach(function (w) { if (w !== corr3 && uniq3.indexOf(w) < 0) uniq3.push(w); });
    } while (uniq3.length < 2 && tries3 < 25);
    return mkMC("Le partage du puits : " + a3 + "/" + b3 + " ÷ " + c3 + "/" + e3 + " = ?", corr3, uniq3, "Diviser, c'est multiplier par l'INVERSE.", a3 + "/" + b3 + " × " + e3 + "/" + c3 + " = " + corr3 + "."); } },
  "c-puissances": { tag: "Collège", label: "Puissances et écriture scientifique", make: function (d) {
    if (d === 1) { var b = pick([2, 3, 5]), e = R(3, 5); return mkN("Dune de sable : " + b + "^" + e + " = ?", Math.pow(b, e), 0.01, b + "^" + e + " = " + b + " × ... × " + b + " (" + e + " fois).", b + "^" + e + " = " + Math.pow(b, e) + "."); }
    if (d === 2) { var m = R(2, 6), n = R(2, 6), div = pick([true, false]); return div ? mkMC("Le vent compte : 10" + sup(m) + " ÷ 10" + sup(n) + " = ?", "10" + sup(m - n), ["10" + sup(m + n), "10" + sup(m * n), "10" + sup(Math.abs(m - n) + 1)], "a^m ÷ a^n = a^(m" + NEG + "n) : on SOUSTRAIT les exposants.", "10^" + m + " ÷ 10^" + n + " = 10^(" + m + NEG + n + ") = 10" + sup(m - n) + ".") : mkMC("Le vent compte : 10" + sup(m) + " × 10" + sup(n) + " = ?", "10" + sup(m + n), ["10" + sup(m * n), "10" + sup(m + n + 1), "10" + sup(Math.abs(m - n))], "a^m × a^n = a^(m+n) : on ADDITIONNE les exposants.", "10^" + m + " × 10^" + n + " = 10^(" + m + "+" + n + ") = 10" + sup(m + n) + "."); }
    var k = R(11, 99) / 10, e3 = -R(3, 5); var digits = String(k).replace(".", ""); var zstr = "0," + Array(Math.abs(e3)).join("0") + digits;
    return mkMC("Écriture scientifique de " + zstr + " ?", fr(k) + " × 10" + sup(e3), [fr(k) + " × 10" + sup(e3 - 1), fr(k) + " × 10" + sup(e3 + 1), digits + " × 10" + sup(e3)], "Comptez de combien de rangs la virgule doit avancer : c'est l'opposé de l'exposant.", zstr + " = " + fr(k) + " × 10" + sup(e3) + "."); } },
  "c-racines": { tag: "Collège", label: "Racines carrées", make: function (d) {
    if (d === 1) { var s = R(4, 15); return mkN("Le cactus carré : " + SQ + s * s + " = ?", s, 0.01, "Cherchez le nombre qui, au carré, donne " + s * s + ".", SQ + s * s + " = " + s + " car " + s + "² = " + s * s + "."); }
    if (d === 2) { var k = R(2, 3), m = pick([2, 3, 5, 6, 7]); var n = k * k * m; return mkMC("Simplifiez " + SQ + n, k + SQ + m, [k * k + SQ + m, m + SQ + k, SQ + (k * m)], "Cherchez un carré parfait qui divise " + n + " : " + k * k + ".", n + " = " + k * k + " × " + m + ", et " + SQ + k * k + " = " + k + " : donc " + SQ + n + " = " + k + SQ + m + "."); }
    var k3 = R(2, 4), m3 = pick([2, 3, 5]);
    return mkN("Épines croisées : " + SQ + (k3 * k3 * m3) + " × " + SQ + m3 + " = ?", k3 * m3, 0.01, SQ + "a × " + SQ + "b = " + SQ + "(a × b).", SQ + (k3 * k3 * m3) + " × " + SQ + m3 + " = " + SQ + (k3 * k3 * m3 * m3) + " = " + k3 * m3 + "."); } },
  "c-litteral": { tag: "Collège", label: "Calcul littéral (développer, réduire)", make: function (d) {
    if (d === 1) { var a = R(2, 9), b = R(2, 9); return mkMC("Réduisez l'ardoise : " + a + "x + " + b + "x = ?", (a + b) + "x", [(a * b) + "x", (a + b) + "x²", (a + b + 1) + "x"], "On additionne les coefficients des termes semblables : " + a + "x + " + b + "x = (" + a + " + " + b + ")x.", a + "x + " + b + "x = (" + a + " + " + b + ")x = " + (a + b) + "x."); }
    if (d === 2) { var a2 = R(2, 6), b2 = R(2, 6), c2 = R(2, 9); return mkMC("Développez : " + a2 + "(" + b2 + "x + " + c2 + ") = ?", polyS([a2 * b2, a2 * c2]), [polyS([a2 * b2, c2]), polyS([a2, a2 * c2]), polyS([a2 * b2, a2])], "Distribuez le " + a2 + " sur CHAQUE terme de la parenthèse.", a2 + " × " + b2 + "x + " + a2 + " × " + c2 + " = " + polyS([a2 * b2, a2 * c2]) + "."); }
    var b3 = R(2, 9);
    return mkMC("Développez l'identité : " + binF(1, b3) + "² = ?", polyS([1, 2 * b3, b3 * b3]), [polyS([1, b3, b3 * b3]), polyS([1, 2 * b3, b3]), polyS([1, 0, b3 * b3])], "(a + b)² = a² + 2ab + b² : ne zappez pas le double produit !", "(x + " + b3 + ")² = x² + 2 × x × " + b3 + " + " + b3 + "² = " + polyS([1, 2 * b3, b3 * b3]) + "."); } },
  "c-eq1": { tag: "Collège", label: "Équations du premier degré", make: function (d) {
    if (d === 1) { var a = R(2, 7), x0 = R(2, 9), b = R(1, 9); return mkN("Porte bleue : " + a + "x + " + b + " = " + (a * x0 + b) + ". Trouvez x.", x0, 0.01, "Retirez " + b + " puis divisez par " + a + ".", a + "x = " + a * x0 + ", donc x = " + x0 + "."); }
    if (d === 2) { var a2 = R(2, 5), c2 = R(1, a2 - 1), x1 = R(2, 9), b2 = R(1, 9); var d2 = a2 * x1 + b2 - c2 * x1; return mkN("Corridor piégé : " + a2 + "x + " + b2 + " = " + c2 + "x + " + d2 + ". Trouvez x.", x1, 0.01, "Regroupez les x d'un côté, les nombres de l'autre.", (a2 - c2) + "x = " + d2 + " " + NEG + " " + b2 + " = " + (a2 - c2) * x1 + ", donc x = " + x1 + "."); }
    var a3 = R(3, 6), k3 = R(1, 3), m3 = R(1, a3 - 2), x2 = R(2, 9); var n3 = a3 * x2 - a3 * k3 - m3 * x2;
    return mkN("Serrure multiple : " + a3 + "(" + binF(1, -k3).slice(1, -1) + ") = " + m3 + "x + " + n3 + ". Trouvez x.", x2, 0.01, "Développez d'abord la parenthèse : " + a3 + "x " + NEG + " " + a3 * k3 + ".", a3 + "x " + NEG + " " + a3 * k3 + " = " + m3 + "x + " + n3 + " → " + (a3 - m3) + "x = " + (a3 - m3) * x2 + " → x = " + x2 + "."); } },
  "c-ineq1": { tag: "Collège", label: "Inéquations du premier degré", make: function (d) {
    if (d === 1) { var a = R(2, 6), k = R(2, 9); return mkMC("Chemin sans pierres : résolvez " + a + "x " + NEG + " " + a * k + " < 0", "x < " + k, ["x > " + k, "x < " + attM(-k), "x > " + attM(-k)], a + "x < " + a * k + ", puis divisez par " + a + " (positif, le sens ne change pas).", a + "x < " + a * k + " donc x < " + k + "."); }
    if (d === 2) { var a2 = R(2, 5), k2 = R(2, 9); return mkMC("Résolvez : " + attM(-a2) + "x + " + a2 * k2 + " ≤ 0", "x ≥ " + k2, ["x ≤ " + k2, "x ≥ " + attM(-k2), "x ≤ " + attM(-k2)], "Diviser par un nombre NÉGATIF change le sens de l'inégalité !", attM(-a2) + "x ≤ " + attM(-a2 * k2) + " ; en divisant par " + attM(-a2) + " : x ≥ " + k2 + " (le sens change)."); }
    var a3 = R(2, 6), k3 = R(2, 9);
    return mkMC("Résolvez : " + a3 + "x " + NEG + " " + a3 * k3 + " > 0", "x > " + k3, ["x < " + k3, "x > " + attM(-k3), "x < " + attM(-k3)], "Isolez " + a3 + "x puis divisez par " + a3 + ".", a3 + "x > " + a3 * k3 + " donc x > " + k3 + "."); } },
  "c-pourc": { tag: "Collège", label: "Pourcentages et proportions", make: function (d) {
    if (d === 1) { var pool = [], ps = [12, 15, 25, 40, 60, 75]; for (var i = 0; i < ps.length; i++) for (var n = 60; n <= 450; n += 30) if ((ps[i] * n) % 100 === 0) pool.push([ps[i], n]); var pp = pick(pool); return mkN("Le marchand prend " + pp[0] + " % de " + pp[1] + " écus. Combien cela fait-il ?", pp[0] * pp[1] / 100, 0.01, "p % de n = (p × n) ÷ 100.", pp[0] + "% de " + pp[1] + " = " + pp[1] + " × " + pp[0] + " ÷ 100 = " + pp[0] * pp[1] / 100 + "."); }
    if (d === 2) { var n2 = pick([40, 60, 80, 120, 200]), p2 = pick([15, 20, 25, 50]); return mkN("Un objet à " + n2 + " € augmente de " + p2 + " %. Nouveau prix (en €) ?", n2 * (1 + p2 / 100), 0.01, "Augmenter de " + p2 + " % revient à multiplier par " + fr(1 + p2 / 100) + ".", n2 + " × " + fr(1 + p2 / 100) + " = " + fr(n2 * (1 + p2 / 100)) + " €."); }
    var pool3 = [], ps3 = [10, 20, 25, 40, 50]; for (var j = 0; j < ps3.length; j++) for (var ini = 40; ini <= 100; ini += 4) { var fin = ini * (1 - ps3[j] / 100); if (fin === Math.round(fin) && fin > 0) pool3.push([fin, ps3[j], ini]); }
    var q3 = pick(pool3);
    return mkMC("Après une baisse de " + q3[1] + " %, un artefact coûte " + fr(q3[0]) + " €. Quel était son prix initial ?", fr(q3[2]) + " €", [fr(q3[0] * (1 - q3[1] / 100)) + " €", fr(Math.round(q3[0] / (1 + q3[1] / 100))) + " €", fr(q3[0] - q3[1]) + " €"], fr(q3[0]) + " = prix initial × " + fr(1 - q3[1] / 100) + ".", fr(q3[0]) + " ÷ " + fr(1 - q3[1] / 100) + " = " + fr(q3[2]) + " €."); } },
  "c-pythagore": { tag: "Collège", label: "Théorème de Pythagore", make: function (d) {
    var tri = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [7, 24, 25], [12, 16, 20], [15, 20, 25], [10, 24, 26], [20, 21, 29]]);
    if (d === 1) return mkN("Raccourci diagonal ! Triangle rectangle de côtés " + tri[0] + " et " + tri[1] + " : quelle est l'hypoténuse ?", tri[2], 0.01, "hypoténuse² = " + tri[0] + "² + " + tri[1] + "².", SQ + "(" + tri[0] * tri[0] + " + " + tri[1] * tri[1] + ") = " + SQ + tri[2] * tri[2] + " = " + tri[2] + ".");
    if (d === 2) return mkN("Hypoténuse de " + tri[2] + ", un côté de " + tri[1] + " : quel est le troisième côté ?", tri[0], 0.01, "côté² = hypoténuse² " + NEG + " autre côté².", tri[2] + "² " + NEG + " " + tri[1] + "² = " + (tri[2] * tri[2] - tri[1] * tri[1]) + ", et " + SQ + (tri[2] * tri[2] - tri[1] * tri[1]) + " = " + tri[0] + ".");
    return mkMC("Un triangle a pour côtés " + tri[0] + ", " + tri[1] + " et " + tri[2] + ". Est-il rectangle ?", "Oui, car " + tri[0] + "² + " + tri[1] + "² = " + tri[2] + "²", ["Non, car " + tri[0] + " + " + tri[1] + " ≠ " + tri[2], "On ne peut pas savoir", "Oui, car " + tri[0] + " + " + tri[1] + " = " + tri[2]], "Vérifiez la réciproque de Pythagore avec les CARRÉS.", tri[0] * tri[0] + " + " + tri[1] * tri[1] + " = " + tri[2] * tri[2] + " : la réciproque du théorème de Pythagore s'applique, le triangle est rectangle."); } },
  "c-thales": { tag: "Collège", label: "Théorème de Thalès", make: function (d) {
    if (d === 1) { var k = R(2, 5), am = R(2, 6), an = R(2, 6); return mkN("A, M, B alignés et A, N, C alignés, (MN) // (BC). AM = " + am + ", AB = " + am * k + ", AN = " + an + ". Calculer AC.", an * k, 0.01, "AM/AB = AN/AC : le rapport de réduction vaut " + am + "/" + am * k + ".", am + "/" + am * k + " = " + an + "/AC donc AC = (" + am * k + " × " + an + ")/" + am + " = " + an * k + "."); }
    if (d === 2) { var k2 = R(2, 5), am2 = R(2, 5), mn = R(2, 6); return mkN("Toujours parallèles : AM = " + am2 + ", AB = " + am2 * k2 + ", MN = " + mn + ". Calculer BC.", mn * k2, 0.01, "MN/BC = AM/AB : mêmes rapports de Thalès.", mn + "/BC = " + am2 + "/" + am2 * k2 + " = 1/" + k2 + ", donc BC = " + mn + " × " + k2 + " = " + mn * k2 + "."); }
    var k3 = R(2, 4);
    return mkMC("On a AM/AB = AN/AC = 1/" + k3 + " et les points bien alignés dans cet ordre. Que permet la réciproque de Thalès ?", "D'affirmer que (MN) et (BC) sont parallèles", ["De calculer BC directement", "De rien du tout", "De prouver que les points ne sont pas alignés"], "La réciproque s'utilise quand les rapports de longueurs sont ÉGAUX.", "Si AM/AB = AN/AC et si les points sont bien alignés dans cet ordre, la réciproque de Thalès garantit le parallélisme."); } },
  "c-trigo": { tag: "Collège", label: "Trigonométrie dans le triangle rectangle", make: function (d) {
    if (d === 1) return mkMC("Dans un triangle rectangle, cosinus d'un angle aigu = ?", "côté adjacent ÷ hypoténuse", ["côté opposé ÷ hypoténuse", "côté opposé ÷ côté adjacent", "hypoténuse ÷ côté adjacent"], "SOH-CAH-TOA : CAH pour le cosinus.", "cos = Adjacent/Hypoténuse (CAH).");
    if (d === 2) { var p = pick([[3, 5, 10], [4, 5, 10], [3, 5, 15], [4, 5, 15], [3, 5, 20], [4, 5, 20], [3, 4, 8], [3, 4, 12], [3, 4, 20]]); return mkN("Triangle rectangle : hypoténuse " + p[2] + " cm, cos(α) = " + p[0] + "/" + p[1] + ". Quelle est la longueur du côté adjacent à α (en cm) ?", p[2] * p[0] / p[1], 0.05, "adjacent = hypoténuse × cos(α).", p[2] + " × " + p[0] + "/" + p[1] + " = " + p[2] * p[0] / p[1] + " cm."); }
    var tri = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]]);
    return mkMC("Triangle rectangle " + tri[0] + "-" + tri[1] + "-" + tri[2] + " : le côté opposé vaut " + tri[0] + ", l'adjacent vaut " + tri[1] + ". tan(α) = ?", fracS(tri[0], tri[1]), [fracS(tri[1], tri[0]), fracS(tri[0], tri[2]), fracS(tri[1], tri[2])], "TOA : tangente = opposé/adjacent.", "tan(α) = " + tri[0] + "/" + tri[1] + " = " + fracS(tri[0], tri[1]) + "."); } },
  "c-angles": { tag: "Collège", label: "Angles d'un triangle, angles et parallèles", make: function (d) {
    if (d === 1) { var a = R(40, 80), b = R(30, 60); return mkN("Un lustre triangulaire : deux angles mesurent " + a + "° et " + b + "°. Quel est le troisième (en degrés) ?", 180 - a - b, 0.01, "La somme des angles d'un triangle vaut 180°.", "180 " + NEG + " (" + a + " + " + b + ") = " + (180 - a - b) + "°."); }
    if (d === 2) return mkMC("Deux angles alternes-internes formés par deux droites coupées par une sécante sont ... ?", "égaux si les droites sont parallèles", ["supplémentaires si les droites sont parallèles", "complémentaires si les droites sont parallèles", "égaux si les droites sont perpendiculaires"], "Alternes-internes : égaux uniquement dans le cas de droites parallèles.", "Si (d₁) // (d₂), les angles alternes-internes sont égaux — et réciproquement.");
    var apex = 2 * R(15, 60);
    return mkN("Un triangle isocèle possède un angle au sommet de " + apex + "°. Combien vaut chacun des angles à la base (en degrés) ?", (180 - apex) / 2, 0.01, "Les deux angles à la base d'un triangle isocèle sont égaux.", "(180 " + NEG + " " + apex + ") ÷ 2 = " + (180 - apex) / 2 + "°."); } },
  "c-affine": { tag: "Collège", label: "Fonctions linéaires et affines", make: function (d) {
    if (d === 1) { var a = R(2, 9), x0 = R(2, 8), b = R(1, 9); return mkN("Serrure affine : f(x) = " + a + "x + " + b + ". Calculez f(" + x0 + ").", a * x0 + b, 0.01, "Remplacez x par " + x0 + ".", "f(" + x0 + ") = " + a + " × " + x0 + " + " + b + " = " + (a * x0 + b) + "."); }
    if (d === 2) { var a2 = R(2, 9), x1 = R(1, 9), b2 = R(1, 9); return mkN("Antécédent : f(x) = " + a2 + "x + " + b2 + " et f(x) = " + (a2 * x1 + b2) + ". Trouvez x.", x1, 0.01, "Résolvez l'équation " + a2 + "x + " + b2 + " = " + (a2 * x1 + b2) + ".", a2 + "x = " + a2 * x1 + " donc x = " + x1 + "."); }
    var a3 = R(2, 9), b3 = R(1, 9);
    return mkMC("Parmi ces fonctions, laquelle est LINÉAIRE ?", "f(x) = " + a3 + "x", ["f(x) = " + a3 + "x + " + b3, "f(x) = " + a3, "f(x) = x² + " + b3], "Linéaire : de la forme f(x) = ax (passe par l'origine).", "Seule f(x) = " + a3 + "x est de la forme ax : c'est une fonction linéaire."); } },
  "c-fonction": { tag: "Collège", label: "Fonctions : lecture graphique (image, antécédent)", make: function (d) {
    var r1 = R(1, 3), r2 = r1 + R(2, 4);
    if (d === 1) { var g = parabGraph(r1, r2, { points: [{ x: 0, y: r1 * r2, label: "A(0 ; " + r1 * r2 + ")" }] }); return mkN("La courbe représente f. Lire graphiquement f(0), l'ordonnée du point A.", r1 * r2, 0.5, "Repérez le point A d'abscisse 0 et lisez son ordonnée.", "A(0 ; " + r1 * r2 + ") est sur la courbe : f(0) = " + r1 * r2 + ".", { graph: g }); }
    if (d === 2) return mkMC("Lire graphiquement le(s) antécédent(s) de 0 par f (la parabole ci-dessous).", r1 + " et " + r2, ["0", r1 + " seulement", String(r1 + r2)], "Cherchez les points de la courbe sur l'axe des abscisses.", "La courbe coupe l'axe en x = " + r1 + " et x = " + r2 + " : ce sont les antécédents de 0.", { graph: parabGraph(r1, r2) });
    return mkMC("D'après le graphique, résolvez f(x) ≤ 0.", "x ∈ [" + r1 + " ; " + r2 + "]", ["x ∈ ]" + attM(-5) + " ; " + r1 + "]", "x ∈ ]" + r1 + " ; " + r2 + "[", "x ∈ [" + r2 + " ; +∞["], "La courbe est en dessous de l'axe des abscisses ENTRE les racines.", "f(x) ≤ 0 pour x ∈ [" + r1 + " ; " + r2 + "] : la parabole est sous l'axe entre ses racines.", { graph: parabGraph(r1, r2) }); } },
  "c-stat": { tag: "Collège", label: "Statistiques (moyenne, médiane, étendue)", make: function (d) {
    if (d === 1) { var m = R(8, 16), offs = [-2, -1, 0, 1, 2].sort(function () { return Math.random() - 0.5; }); var serie = offs.map(function (o) { return m + o; }); return mkN("Jetons de Monsieur Étendue : " + serie.join(", ") + ". Quelle est la moyenne ?", m, 0.01, "Moyenne = somme ÷ effectif total (5 valeurs).", "(" + serie.join(" + ") + ") ÷ 5 = " + 5 * m + " ÷ 5 = " + m + "."); }
    if (d === 2) { var b = R(2, 9), s = 2 * R(1, 3); var vals = [b - s, b, b + s, b + 2 * s].sort(function (x, y) { return x - y; }); return mkN("Série triée : " + vals.join(", ") + ". Quelle est la médiane ?", (b + b + s) / 2, 0.01, "Effectif pair : la médiane est la moyenne des 2 valeurs centrales.", "(" + vals[1] + " + " + vals[2] + ") ÷ 2 = " + (b + b + s) / 2 + "."); }
    var lo = R(1, 50), hi = lo + R(10, 49);
    return mkN("Série : " + lo + ", " + hi + ", " + (lo + 3) + ". Quelle est l'étendue ?", hi - lo, 0.01, "Étendue = plus grande valeur " + NEG + " plus petite valeur.", hi + " " + NEG + " " + lo + " = " + (hi - lo) + "."); } },
  "c-proba": { tag: "Collège", label: "Probabilités simples", make: function (d) {
    if (d === 1) return mkMC("On lance un dé à 6 faces. Probabilité d'obtenir un nombre PAIR ?", "1/2", ["1/6", "2/3", "1/3"], "Issues favorables : 2, 4, 6 — soit 3 issues sur 6.", "3/6 = 1/2.");
    if (d === 2) { var r = R(2, 6), b = R(1, 5); while (b === r) b = R(1, 5); return mkMC("Urne : " + r + " boules rouges et " + b + " boules bleues. Probabilité de tirer une ROUGE ?", fracS(r, r + b), [fracS(b, r + b), fracS(r, b), "1/2"], (r + b) + " boules au total, " + r + " favorables.", r + "/" + (r + b) + (gcdF(r, r + b) > 1 ? " = " + fracS(r, r + b) : "") + "."); }
    return mkMC("On lance deux dés. Probabilité que la somme fasse 7 ?", "6/36", ["7/36", "1/12", "5/36"], "Comptez les couples favorables : (1;6), (2;5), (3;4), (4;3), (5;2), (6;1).", "6 couples favorables sur 36 : 6/36 = 1/6."); } },
  "c-reperage": { tag: "Collège", label: "Repérage dans le plan", make: function (d) {
    if (d === 1) { var x = R(-4, 4), y = R(-2, 4); return mkN("Lire l'ABSCISSE du point A sur le graphique.", x, 0.1, "L'abscisse se lit sur l'axe horizontal.", "A a pour abscisse " + attM(x) + " : A" + pts(x, y) + ".", { graph: { curves: [], xmin: -5, xmax: 5, ymin: -3, ymax: 5, grid: 1, points: [{ x: x, y: y, label: "A", color: "#c97900" }] } }); }
    if (d === 2) { var y2 = R(1, 4), x1 = R(-2, 2), x2 = x1 + R(2, 4); return mkN("Quelle est la distance AB (A et B sur le graphique, même ordonnée) ?", x2 - x1, 0.1, "A et B ont la même ordonnée : comptez horizontalement.", "De x = " + attM(x1) + " à x = " + attM(x2) + " : AB = " + attM(x2 - x1) + ".", { graph: { curves: [], xmin: -4, xmax: 7, ymin: -1, ymax: 5, grid: 1, points: [{ x: x1, y: y2, label: "A", color: "#c97900" }, { x: x2, y: y2, label: "B", color: "#1e8e54" }] } }); }
    var xA = R(-6, 3), dx = 2 * R(1, 4), yA = R(-5, 3), dy = 2 * R(1, 4); var xB = xA + dx, yB = yA + dy;
    return mkMC("Quel est le milieu du segment [AB] avec A" + pts(xA, yA) + " et B" + pts(xB, yB) + " ?", pts((xA + xB) / 2, (yA + yB) / 2), [pts((xB - xA) / 2, (yB - yA) / 2), pts((xA + yA) / 2, (xB + yB) / 2), pts(xB, yA)], "Milieu = ((xA + xB)/2 ; (yA + yB)/2).", "((" + attM(xA) + " + " + attM(xB) + ")/2 ; (" + attM(yA) + " + " + attM(yB) + ")/2) = " + pts((xA + xB) / 2, (yA + yB) / 2) + "."); } },
  "c-volumes": { tag: "Collège", label: "Volumes usuels", make: function (d) {
    if (d === 1) { var r = R(2, 5), h = R(2, 6); return mkN("Cylindre : rayon " + r + ", hauteur " + h + ". Volume (π ≈ 3,14, arrondi à l'unité) ?", Math.round(3.14 * r * r * h), 1, "V = π × r² × h.", "V = 3,14 × " + r * r + " × " + h + " = " + fr(3.14 * r * r * h) + " ≈ " + Math.round(3.14 * r * r * h) + "."); }
    if (d === 2) return mkMC("Volume du cône de révolution ?", "(1/3) × π × r² × h", ["π × r² × h", "(1/2) × π × r² × h", "(4/3) × π × r³"], "Le cône occupe un tiers du cylindre de même base et hauteur.", "V = (1/3) π r² h.");
    return mkMC("Volume de la sphère de rayon r ?", "(4/3) × π × r³", ["(4/3) × π × r²", "π × r³", "(1/3) × π × r³"], "À retenir par cœur pour le cratère !", "V = (4/3) π r³."); } },
  "c-pgcd": { tag: "Collège", label: "PGCD et fractions irréductibles", make: function (d) {
    if (d === 1) { var pair = pick([[4, 6], [6, 8], [6, 9], [8, 12], [10, 15], [12, 18], [6, 10], [9, 12], [15, 20]]); var a = pair[0], b = pair[1]; var lcm = a * b / gcdF(a, b); return mkMC("Plus petit multiple commun (non nul) de " + a + " et " + b + " ?", String(lcm), [String(a * b), String(gcdF(a, b) === 1 ? 1 : a), String(a + b)], "Listez les multiples de " + a + " puis de " + b + ".", "Multiples de " + a + " et de " + b + " : le premier commun est " + lcm + "."); }
    if (d === 2) { var g = pick([4, 6, 8, 10, 12]), m = R(2, 6), n = m + R(1, 3); while (gcdF(m, n) !== 1) n += 1; var A = g * m, B = g * n; return mkN("PGCD de " + A + " et " + B + " (algorithme d'Euclide) ?", g, 0.01, "Divisez le plus grand par le plus petit, puis continuez avec le reste.", B + " = " + Math.floor(B / A) + " × " + A + " + " + B % A + " ; " + A + " = " + Math.floor(A / (B % A)) + " × " + B % A + " + " + A % (B % A) + " ; le dernier reste non nul est " + g + "."); }
    var g3 = pick([4, 6, 8, 10, 12]), m3 = R(2, 6), n3 = m3 + R(1, 3); while (gcdF(m3, n3) !== 1) n3 += 1;
    return mkMC("Simplifiez " + g3 * m3 + "/" + g3 * n3 + " en fraction irréductible.", m3 + "/" + n3, [m3 + "/" + (n3 + 1), (m3 + 1) + "/" + n3, g3 * m3 + "/" + n3], "Divisez numérateur et dénominateur par leur PGCD.", g3 * m3 + " ÷ " + g3 + " = " + m3 + " et " + g3 * n3 + " ÷ " + g3 + " = " + n3 + " : " + m3 + "/" + n3 + "."); } },
  "c-transfo": { tag: "Collège", label: "Transformations du plan (symétries, translation, rotation)", make: function (d) {
    if (d === 1) { var x = NZ(-9, 9), y = NZ(-9, 9); return mkMC("Image du point A" + pts(x, y) + " par la symétrie de CENTRE O ?", pts(-x, -y), [pts(x, -y), pts(-x, y), pts(y, x)], "Symétrie centrale : chaque coordonnée devient son opposée.", "M'(x ; y) = (" + attM(-x) + " ; " + attM(-y) + ") : " + pts(-x, -y) + "."); }
    if (d === 2) { var x2 = NZ(-9, 9), y2 = NZ(-9, 9); return mkMC("Image de A" + pts(x2, y2) + " par la symétrie AXIALE d'axe (Ox) (l'axe des abscisses) ?", pts(x2, -y2), [pts(-x2, y2), pts(-x2, -y2), pts(y2, x2)], "On plie selon (Ox) : l'abscisse ne bouge pas, l'ordonnée change de signe.", "La symétrie d'axe (Ox) laisse x inchangé et oppose y : " + pts(x2, -y2) + "."); }
    var x3 = NZ(-9, 9), y3 = NZ(-9, 9); while (x3 === y3 || x3 + y3 === 0) { x3 = NZ(-9, 9); y3 = NZ(-9, 9); }
    return mkMC("Image de A" + pts(x3, y3) + " par la ROTATION de centre O et d'angle 90° (π/2) dans le sens direct ?", pts(-y3, x3), [pts(-x3, y3), pts(y3, -x3), pts(x3, -y3)], "Rotation de π/2 : (x ; y) → (" + attM(-1) + "y ; x). Avec la trigonométrie : x' = x cos θ " + NEG + " y sin θ.", "Pour θ = π/2 : cos = 0, sin = 1, donc " + pts(x3, y3) + " → " + pts(-y3, x3) + ". La rotation fait tourner, la trigonométrie calcule !"); } },

  "s-ensembles": { tag: "Seconde", label: "Ensembles de nombres (ℕ, ℤ, ℚ, ℝ)", make: function (d) {
    if (d === 1) return mkMC(SQ + "2 appartient à quel ensemble (le plus précis) ?", "ℝ, mais pas à ℚ (irrationnel)", ["ℚ", "ℤ", "ℕ"], SQ + "2 ne s'écrit pas comme quotient d'entiers.", SQ + "2 est irrationnel : il est dans ℝ mais pas dans ℚ.");
    if (d === 2) { var n = pick([-7, -12, -3, -1, -25]); return mkMC("Le plus petit ensemble (au sens de l'inclusion) contenant " + attM(n) + " est ... ?", "ℤ", ["ℕ", "ℚ \ ℤ", "ℝ"], attM(n) + " est un entier relatif ni positif ni nul.", attM(n) + " ∈ ℤ, donc aussi ∈ ℚ et ∈ ℝ, mais le plus petit est ℤ."); }
    var dec = pick([["0,25", "1/4"], ["0,5", "1/2"], ["0,75", "3/4"], ["0,2", "1/5"], ["0,7", "7/10"]]);
    return mkMC("Le plus petit ensemble contenant " + dec[0] + " est ... ?", "ℚ", ["ℕ", "ℤ", "ℝ"], dec[0] + " = " + dec[1] + " : un quotient d'entiers.", dec[0] + " = " + dec[1] + " ∈ ℚ, mais " + dec[0] + " ∉ ℕ et ∉ ℤ."); } },
  "s-facto": { tag: "Seconde", label: "Factorisation : facteur commun", make: function (d) {
    if (d === 1) { var k = R(2, 9), m = R(2, 9); return mkMC("Factorisez : " + k + "x + " + k * m, k + binF(1, m), [k + binF(1, -m), "x(" + k + " + " + k * m + ")", k + "x(1 + " + m + ")"], "Cherchez le facteur commun " + k + " : " + k + "x = " + k + " × x et " + k * m + " = " + k + " × " + m + ".", k + "x + " + k * m + " = " + k + "(x + " + m + ")."); }
    if (d === 2) { var k2 = R(2, 6), m2 = R(2, 9); return mkMC("Factorisez : " + polyS([k2, k2 * m2, 0]), k2 + "x" + binF(1, m2), [k2 + "(" + binF(1, m2).slice(1, -1) + ")", "x(" + k2 + "x + " + k2 * m2 + ")", k2 + "x(x + " + k2 * m2 + ")"], "Le facteur commun est " + k2 + "x : " + k2 + "x × x + " + k2 + "x × " + m2 + ".", k2 + "x² + " + k2 * m2 + "x = " + k2 + "x(x + " + m2 + ")."); }
    var a3 = R(1, 5), b3 = R(2, 6), c3 = R(1, 6);
    var corr = binF(1, a3) + binF(3, b3 - c3);
    return mkMC("Factorisez : " + binF(1, a3) + binF(2, b3) + " + " + binF(1, a3) + binF(1, -c3), corr, [binF(1, a3) + binF(2, b3 - c3), binF(1, a3) + binF(3, b3 + c3), binF(1, -a3) + binF(3, b3 - c3)], "Le facteur commun est le BINÔME " + binF(1, a3) + " : mettez-le en évidence, puis réduisez ce qui reste.", binF(1, a3) + "[(" + polyS([2, b3]) + ") + (" + polyS([1, -c3]) + ")] = " + binF(1, a3) + binF(3, b3 - c3) + "."); } },
  "s-facto2": { tag: "Seconde", label: "Factorisation : identité a² − b²", make: function (d) {
    if (d === 1) { var k = R(2, 9); return mkMC("Factorisez : x² " + NEG + " " + k * k, binF(1, -k) + binF(1, k), [binF(1, -k) + binF(1, -k), binF(1, -k * k), "x(x " + NEG + " " + k + ")"], "a² " + NEG + " b² = (a " + NEG + " b)(a + b) avec a = x et b = " + k + ".", "x² " + NEG + " " + k * k + " = " + binF(1, -k) + binF(1, k) + "."); }
    if (d === 2) { var a = pick([2, 3, 4]), b = R(2, 6); return mkMC("Factorisez : " + a * a + "x² " + NEG + " " + b * b, binF(a, -b) + binF(a, b), [binF(a, -b) + binF(a, -b), binF(1, -b) + binF(1, b), binF(a, -b) + binF(1, b)], "Ici a = " + a + "x et b = " + b + " : a² " + NEG + " b² = (a " + NEG + " b)(a + b).", a * a + "x² " + NEG + " " + b * b + " = " + binF(a, -b) + binF(a, b) + "."); }
    var a3 = R(2, 5), k3 = R(2, 5);
    return mkMC("Factorisez : " + binF(1, a3) + "² " + NEG + " " + k3 * k3, binF(1, a3 - k3) + binF(1, a3 + k3), [binF(1, a3 - k3) + binF(1, a3 - k3), binF(1, a3) + binF(1, -k3) + binF(1, k3), binF(1, a3 + k3) + binF(1, a3 + k3)], "Posez A = " + binF(1, a3).slice(1, -1) + " : l'expression devient A² " + NEG + " " + k3 * k3 + " = (A " + NEG + " " + k3 + ")(A + " + k3 + ").", "(" + polyS([1, a3]) + ")² " + NEG + " " + k3 * k3 + " = " + binF(1, a3 - k3) + binF(1, a3 + k3) + "."); } },
  "s-facto3": { tag: "Seconde", label: "Factorisation : carrés parfaits et complétion", make: function (d) {
    if (d === 1) { var k = R(2, 9); return mkMC("Factorisez : x² + " + 2 * k + "x + " + k * k, binF(1, k) + "²", [binF(1, -k) + "²", binF(1, k) + binF(1, k) + "²", "x(x + " + k + ")"], "Reconnaissez (a + b)² = a² + 2ab + b² : ici 2ab = " + 2 * k + "x donc b = " + k + ".", "x² + " + 2 * k + "x + " + k * k + " = " + binF(1, k) + "²."); }
    if (d === 2) { var a = pick([2, 3]), k = R(2, 5); return mkMC("Factorisez : " + polyS([a * a, 2 * a * k, k * k]), binF(a, k) + "²", [binF(1, k) + "²", binF(a, -k) + "²", polyS([a * a, 2 * k, k * k]) + " irréductible"], "(a" + "x + b)² = " + a * a + "x² + 2 × " + a + " × b × x + b² : identifiez b = " + k + ".", a * a + "x² + " + 2 * a * k + "x + " + k * k + " = " + binF(a, k) + "²."); }
    var r1 = R(1, 6), r2 = r1 + 2 * R(1, 3);
    return mkMC("Factorisez en COMPLÉTANT le carré : x² " + polyS([0, -(r1 + r2), r1 * r2]).replace("0x ", ""), binF(1, -r1) + binF(1, -r2), [binF(1, r1) + binF(1, -r2), binF(1, -r1) + binF(1, r2), binF(1, r1) + binF(1, r2)], "x² " + NEG + " " + (r1 + r2) + "x = (x " + NEG + " " + (r1 + r2) / 2 + ")² " + NEG + " " + ((r1 + r2) / 2) * ((r1 + r2) / 2) + " : retirez ensuite le carré en trop.", "x² " + NEG + " " + (r1 + r2) + "x + " + r1 * r2 + " = (x " + NEG + " " + r1 + ")(x " + NEG + " " + r2 + ") : la complétion du carré révèle les deux facteurs."); } },
  "s-facto4": { tag: "Seconde", label: "Factorisation : facteur commun caché, groupement", make: function (d) {
    if (d === 1) { var a = R(2, 3), m = NZ(-5, 5), p = R(1, 5), q = R(1, 9); var corr = binF(1, m) + binF(a + 1, -(a * p + q)); return mkMC("Factorisez (un facteur est CACHÉ) : " + binF(a, a * m) + binF(1, -p) + " + " + binF(1, m) + binF(1, -q), corr, [binF(1, m) + binF(a, -(a * p + q)), binF(1, m) + binF(a + 1, -(a * p - q)), binF(1, -m) + binF(a + 1, -(a * p + q))], "Observez : " + a + "x + " + a * m + " = " + a + binF(1, m) + " — le facteur " + binF(1, m) + " est donc commun aux DEUX produits !", binF(1, m) + "[" + a + "(x " + NEG + " " + p + ") + (x " + NEG + " " + q + ")] = " + binF(1, m) + "(" + polyS([a + 1, -(a * p + q)]) + ") = " + corr + "."); }
    if (d === 2) { var p2 = NZ(-6, 6), q2 = NZ(-6, 6); while (q2 === p2) q2 = NZ(-6, 6); return mkMC("Factorisez en GROUPANT : x² " + (q2 >= 0 ? "+ " + q2 : NEG + " " + (0 - q2)) + "x " + (p2 >= 0 ? "+ " + p2 : NEG + " " + (0 - p2)) + "x " + (p2 * q2 >= 0 ? "+ " + p2 * q2 : NEG + " " + Math.abs(p2 * q2)), binF(1, q2) + binF(1, p2), [binF(1, -p2) + binF(1, -q2), binF(1, p2) + binF(1, -q2), binF(1, q2 + 1) + binF(1, p2)], "Groupez intelligemment : x² " + (q2 >= 0 ? "+ " + q2 : NEG + " " + (0 - q2)) + "x d'un côté, puis le reste : x sort du premier groupe, " + p2 + " du second.", "x" + binF(1, q2) + " " + (p2 >= 0 ? "+ " + p2 : NEG + " " + (0 - p2)) + binF(1, q2) + " = " + binF(1, q2) + binF(1, p2) + "."); }
    var a3 = R(2, 6), b3 = R(2, 6);
    return mkMC("Factorisez (puissance du facteur commun) : (x " + NEG + " " + a3 + ")² " + NEG + " " + b3 + "(x " + NEG + " " + a3 + ")", binF(1, -a3) + "(x " + NEG + " " + (a3 + b3) + ")", [binF(1, -a3) + binF(1, a3 + b3), binF(1, -a3) + "(" + polyS([1, -(a3 + b3)]) + ")", binF(1, -a3 - b3)], "Le facteur commun est " + binF(1, -a3) + " : A² " + NEG + " " + b3 + "A = A(A " + NEG + " " + b3 + ").", binF(1, -a3) + "(x " + NEG + " " + a3 + " " + NEG + " " + b3 + ") = " + binF(1, -a3) + "(x " + NEG + " " + (a3 + b3) + ")."); } },
  "s-facto5": { tag: "Seconde", label: "Factorisation : double factorisation et degré supérieur", make: function (d) {
    if (d === 1) { var k = R(2, 6), m = R(1, 5); return mkMC("Factorisez : x² " + NEG + " " + k * k + " + " + binF(1, k) + "(" + polyS([1, -m]) + ")", binF(1, k) + binF(2, -(k + m)), [binF(1, -k) + binF(2, -(k + m)), binF(1, k) + binF(1, -(k + m)), binF(1, k) + binF(2, k + m)], "x² " + NEG + " " + k * k + " = " + binF(1, -k) + binF(1, k) + " fait apparaître le facteur commun " + binF(1, k) + ".", binF(1, k) + "[" + polyS([1, -k]) + " + (" + polyS([1, -m]) + ")] = " + binF(1, k) + binF(2, -(k + m)) + "."); }
    if (d === 2) { var k2 = pick([2, 3]); return mkMC("Factorisez COMPLÈTEMENT : x⁴ " + NEG + " " + k2 * k2 * k2 * k2, binF(1, -k2) + binF(1, k2) + "(x² + " + k2 * k2 + ")", [binF(1, -k2) + binF(1, k2), "(x² " + NEG + " " + k2 * k2 + ")(x² + " + k2 * k2 + ")", binF(1, -k2 * k2) + "(x² + " + k2 * k2 + ")"], "Factorisez D'ABORD comme a² " + NEG + " b², puis regardez si un facteur se factorise ENCORE.", "x⁴ " + NEG + " " + Math.pow(k2, 4) + " = (x² " + NEG + " " + k2 * k2 + ")(x² + " + k2 * k2 + ") = " + binF(1, -k2) + binF(1, k2) + "(x² + " + k2 * k2 + ") : double factorisation !"); }
    var a3 = R(1, 4), b3 = R(1, 5);
    return mkMC("Factorisez : " + binF(1, a3) + binF(1, -b3) + "² " + NEG + " " + binF(1, a3) + "²" + binF(1, -b3), attM(-(a3 + b3)) + binF(1, a3) + binF(1, -b3), [String(a3 + b3) + binF(1, a3) + binF(1, -b3), attM(-(a3 + b3)) + binF(1, -a3) + binF(1, b3), binF(1, a3) + binF(1, -b3) + "(" + attM(-(a3 + b3)) + "x)"], "Le facteur commun est le PRODUIT " + binF(1, a3) + binF(1, -b3) + " : A × B² " + NEG + " A² × B = A × B × (B " + NEG + " A).", binF(1, a3) + binF(1, -b3) + "[(x " + NEG + " " + b3 + ") " + NEG + " (x + " + a3 + ")] = " + binF(1, a3) + binF(1, -b3) + "(" + attM(-(a3 + b3)) + ") = " + attM(-(a3 + b3)) + binF(1, a3) + binF(1, -b3) + "."); } },
  "s-facto6": { tag: "Seconde", label: "Factoriser pour résoudre (synthèse)", make: function (d) {
    if (d === 1) { var k = R(2, 6), m = R(2, 7); return mkMC("Résolvez en FACTORISANT d'abord : " + k + "x² + " + k * m + "x = 0", "x = 0 ou x = " + attM(-m), ["x = 0 seulement", "x = " + attM(-m) + " seulement", "x = 0 ou x = " + m], "Mettez " + k + "x en facteur : un produit est nul si l'un des facteurs est nul.", k + "x(x + " + m + ") = 0 → x = 0 ou x + " + m + " = 0 → x = " + attM(-m) + "."); }
    if (d === 2) { var a = R(2, 6), k2 = R(1, 4); return mkMC("Résolvez : " + binF(1, a) + "² " + NEG + " " + k2 * k2 + " = 0", "x = " + attM(-a - k2) + " ou x = " + attM(-a + k2), ["x = " + attM(a - k2) + " ou x = " + attM(a + k2), "x = " + attM(-a) + " seulement", "Aucune solution"], "a² " + NEG + " b² = (a " + NEG + " b)(a + b), puis produit nul.", binF(1, a - k2) + binF(1, a + k2) + " = 0 → x = " + attM(-a + k2) + " ou x = " + attM(-a - k2) + "."); }
    var k3 = R(2, 5);
    return mkMC("Résolvez (factorisez deux fois !) : x³ " + NEG + " " + k3 * k3 + "x = 0", "x = 0, x = " + k3 + " ou x = " + attM(-k3), ["x = 0 seulement", "x = " + k3 + " ou x = " + attM(-k3), "x = 0 ou x = " + k3 * k3], "x³ " + NEG + " " + k3 * k3 + "x = x(x² " + NEG + " " + k3 * k3 + ") : factorisez x, PUIS l'identité a² " + NEG + " b².", "x(x " + NEG + " " + k3 + ")(x + " + k3 + ") = 0 → trois solutions : 0, " + k3 + " et " + attM(-k3) + "."); } },
  "s-eqproduit": { tag: "Seconde", label: "Équations produit-nul", make: function (d) {
    if (d === 1) { var r1 = NZ(-9, 9), r2 = NZ(-9, 9); while (r2 === r1) r2 = NZ(-9, 9); return mkMC("Résolvez : " + binF(1, -r1) + binF(1, -r2) + " = 0", "x = " + attM(r1) + " ou x = " + attM(r2), ["x = " + attM(-r1) + " ou x = " + attM(-r2), "x = " + attM(r1) + " et x = " + attM(r2) + " en même temps", "Aucune solution"], "Un produit est nul si l'un des facteurs est nul.", "x " + (r1 >= 0 ? NEG + " " + r1 + " = 0 → x = " + r1 : "+ " + (0 - r1) + " = 0 → x = " + attM(r1)) + " ; l'autre facteur donne x = " + attM(r2) + "."); }
    if (d === 2) { var p = R(2, 5), q = NZ(-6, 6); return mkMC("Résolvez : x(" + p + "x " + (q >= 0 ? "+ " + q : NEG + " " + (0 - q)) + ") = 0", "x = 0 ou x = " + fracS(-q, p), ["x = 0 ou x = " + fracS(q, p), "x = " + fracS(-q, p) + " seulement", "x = 0 seulement"], "Deux facteurs : x et (" + p + "x " + (q >= 0 ? "+ " + q : NEG + " " + (0 - q)) + ").", "x = 0 ou " + p + "x " + (q >= 0 ? "+ " + q : NEG + " " + (0 - q)) + " = 0 → x = " + fracS(-q, p) + "."); }
    var a = R(2, 6), b = NZ(-6, 6);
    return mkMC("Résolvez : " + binF(a, b) + "² = 0", "Une seule solution : x = " + fracS(-b, a), ["Deux solutions : " + fracS(b, a) + " et " + fracS(-b, a), "Aucune solution", "x = " + fracS(b, a)], "Un carré s'annule uniquement quand sa racine s'annule.", a + "x " + (b >= 0 ? "+ " + b : NEG + " " + (0 - b)) + " = 0 → x = " + fracS(-b, a) + " : solution unique (racine double)."); } },
  "s-signe": { tag: "Seconde", label: "Tableaux de signes (création et lecture)", make: function (d) {
    if (d === 1) { var k = NZ(-6, 9); return mkSign("Construisez le tableau de signes de f(x) = x " + NEG + " " + k + " : cliquez sur chaque case pour la faire alterner entre + et " + NEG + ".", ["-∞", String(k), "+∞"], "f(x)", [NEG, "+"], "Une expression affine : négative avant sa racine " + k + ", positive après.", "f(x) = x " + NEG + " " + k + " s'annule en " + k + " : négative sur ]" + NEG + "∞ ; " + k + "[, positive sur ]" + k + " ; +∞[."); }
    if (d === 2) { var r1 = R(-4, 2), r2 = r1 + R(2, 5); return mkSign("Construisez le tableau de signes de g(x) = " + binF(1, -r1) + binF(1, -r2) + ".", ["-∞", String(r1), String(r2), "+∞"], "g(x)", ["+", NEG, "+"], "Signe d'un produit : + hors des racines, " + NEG + " entre.", "g est positive avant " + r1 + " et après " + r2 + ", négative entre les racines."); }
    var a = R(2, 5), m = R(2, 6);
    return mkMC("Le tableau de signes ci-dessous est celui de h(x) = " + attM(-a) + "x + " + a * m + ". Pour quels x a-t-on h(x) ≥ 0 ?", "x ≤ " + m, ["x ≥ " + m, "x = " + m, "Tous les réels"], "Lisez la zone où le signe affiché est +.", attM(-a) + "x + " + a * m + " ≥ 0 ⇔ x ≤ " + m + ".", { signShow: { xs: ["-∞", String(m), "+∞"], label: "h(x)", signs: ["+", NEG] } }); } },
  "s-fonction2": { tag: "Seconde", label: "Fonctions : définition, image, antécédent", make: function (d) {
    if (d === 1) { var k = NZ(-9, 9); return mkMC("Quel est l'ensemble de définition de f(x) = 1/(x " + (k >= 0 ? "+ " + k : NEG + " " + (0 - k)) + ") ?", "Tous les réels sauf " + attM(-k), ["Tous les réels", "Les réels positifs", "Les réels sauf 0"], "Le dénominateur ne doit jamais s'annuler.", "x " + (k >= 0 ? "+ " + k : NEG + " " + (0 - k)) + " ≠ 0 donc x ≠ " + attM(-k) + "."); }
    if (d === 2) { var a = R(1, 3), b = R(1, 9), c = R(1, 4); return mkN("f(x) = " + a + "x² " + NEG + " " + b + ". Calculez f(" + attM(-c) + ").", a * c * c - b, 0.01, "Remplacez x par " + attM(-c) + " : le carré d'un négatif est positif.", "f(" + attM(-c) + ") = " + a + " × " + c * c + " " + NEG + " " + b + " = " + attM(a * c * c - b) + "."); }
    var a2 = pick([1, 2]);
    return mkN("La courbe représente f. Lire graphiquement f(2), l'ordonnée du point A.", 4 * a2 + 1, 0.5, "Repérez le point A d'abscisse 2.", "A(2 ; " + (4 * a2 + 1) + ") : f(2) = " + (4 * a2 + 1) + ".", { graph: { curves: [{ fn: function (x) { return a2 * x * x + 1; }, color: "#7b5fc0", label: "f" }], xmin: -1, xmax: 3, ymin: 0, ymax: 10, points: [{ x: 2, y: 4 * a2 + 1, label: "A" }] } }); } },
  "s-variations": { tag: "Seconde", label: "Tableaux de variations (création et lecture)", make: function (d) {
    var al = -R(1, 4), be = al + R(3, 5), mx = R(2, 6), mn = -R(1, 4);
    var vs = { xs: ["-∞", String(al), String(be), "+∞"], fvals: [null, String(mx), String(mn), null], arrows: [UP, DOWN, UP] };
    if (d === 1) return mkMC("Le tableau de variations ci-dessous est celui d'une fonction f. Sur quel(s) intervalle(s) f est-elle CROISSANTE ?", "]" + NEG + "∞ ; " + al + "] et [" + be + " ; +∞[", ["[" + al + " ; " + be + "]", "]" + NEG + "∞ ; +∞[", "[" + be + " ; +∞["], "Les flèches montantes indiquent la croissance.", "f monte jusqu'à " + mx + " en x = " + al + ", descend jusqu'à " + mn + ", puis remonte : croissante sur ]" + NEG + "∞ ; " + al + "] et [" + be + " ; +∞[.", { varShow: vs });
    if (d === 2) { var r1 = R(-3, 1), k = R(1, 3), r2 = r1 + 2 * k, xm = (r1 + r2) / 2; return mkVar("f(x) = " + polyS(trin2(r1, r2)) + " et f'(x) = " + polyS([2, -(r1 + r2)]) + ". Complétez le tableau de variations de f (cliquez sur les cases pour alterner ↗ / ↘).", ["-∞", String(xm), "+∞"], [null, String(-k * k), null], [DOWN, UP], "f' est négative avant " + xm + ", positive après.", "f décroît jusqu'au minimum f(" + xm + ") = " + attM(-k * k) + " puis croît.", { xs: ["-∞", String(xm), "+∞"], label: "f'(x)", signs: [NEG, "+"] }); }
    return mkMC("D'après ce tableau de variations, quel est le MAXIMUM de f sur [" + (al - 2) + " ; " + (be - 1) + "] ?", String(mx), [String(mn), String(be), "On ne peut pas savoir"], "Sur cet intervalle, le plus haut sommet atteint est celui de x = " + al + ".", "f atteint " + mx + " en x = " + al + ", puis redescend : le maximum sur cet intervalle vaut " + mx + ".", { varShow: vs }); } },
  "s-ref": { tag: "Seconde", label: "Fonctions de référence (carré, inverse, racine, cube)", make: function (d) {
    if (d === 1) return mkMC("La fonction carré x ↦ x² est ... ?", "paire : (" + attM(-1) + "x)² = x²", ["impaire", "nulle en 0", "décroissante sur ℝ"], "Testez f(" + attM(-1) + "x) et comparez à f(x).", "Pour tout x, (" + attM(-1) + "x)² = x² : la fonction carré est paire.");
    if (d === 2) return mkMC("La fonction racine carrée est définie sur ... ?", "[0 ; +∞[", ["ℝ", "]-∞ ; 0]", "]0 ; +∞["], "On ne prend la racine que d'un nombre positif ou nul.", SQ + "x existe pour x ≥ 0 : ensemble de définition [0 ; +∞[.");
    return mkMC("La fonction inverse x ↦ 1/x est ... ?", "décroissante sur ]-∞ ; 0[ ET sur ]0 ; +∞[, mais jamais sur les deux réunis", ["décroissante sur ℝ*", "croissante sur ℝ*", "positive toujours"], "Attention au piège classique de la « décroissance globale ».", "1/x est décroissante sur chacun des deux intervalles, mais 1/(" + attM(-1) + ") < 1/1 : on ne peut pas lier les deux intervalles en une seule décroissance — c'est le piège !"); } },
  "s-vecteurs": { tag: "Seconde", label: "Vecteurs (coordonnées, norme, colinéarité)", make: function (d) {
    if (d === 1) { var x1 = R(-6, 6), y1 = R(-6, 6), dx = NZ(-7, 7), dy = NZ(-7, 7); return mkN("A" + pts(x1, y1) + " et B" + pts(x1 + dx, y1 + dy) + ". Quelle est l'ABSCISSE du vecteur AB ?", dx, 0.01, "AB a pour coordonnées (xB " + NEG + " xA ; yB " + NEG + " yA).", "xB " + NEG + " xA = " + attM(x1 + dx) + " " + NEG + " " + attM(x1) + " = " + attM(dx) + "."); }
    if (d === 2) { var pr = pick([[3, 4], [6, 8], [5, 12], [8, 6]]); return mkN("Le vecteur u(" + pr[0] + " ; " + pr[1] + "). Quelle est sa NORME ‖u‖ ?", Math.sqrt(pr[0] * pr[0] + pr[1] * pr[1]), 0.01, "‖u‖ = " + SQ + "(x² + y²).", SQ + "(" + pr[0] * pr[0] + " + " + pr[1] * pr[1] + ") = " + SQ + (pr[0] * pr[0] + pr[1] * pr[1]) + " = " + Math.sqrt(pr[0] * pr[0] + pr[1] * pr[1]) + "."); }
    var a = NZ(-5, 5), b = NZ(-5, 5), k = R(2, 3);
    return mkMC("Les vecteurs u(" + a + " ; " + b + ") et v(" + a * k + " ; " + b * k + ") sont ... ?", "colinéaires, car " + a + " × " + b * k + " " + NEG + " " + b + " × " + a * k + " = 0", ["orthogonaux", "égaux", "ni colinéaires ni orthogonaux"], "Testez xy′ " + NEG + " yx′.", a + " × " + b * k + " " + NEG + " " + b + " × " + a * k + " = " + a * b * k + " " + NEG + " " + a * b * k + " = 0 : colinéarité !"); } },
  "s-droites": { tag: "Seconde", label: "Équations de droites et coefficient directeur", make: function (d) {
    if (d === 1) { var m = NZ(-5, 5), p = R(-9, 9), x1 = R(-2, 2), x2 = x1 + R(1, 3); return mkN("Droite passant par A" + pts(x1, m * x1 + p) + " et B" + pts(x2, m * x2 + p) + ". Quel est son coefficient directeur ?", m, 0.01, "m = (yB " + NEG + " yA)/(xB " + NEG + " xA).", "(" + attM(m * x2 + p) + " " + NEG + " " + attM(m * x1 + p) + ")/(" + x2 + " " + NEG + " " + attM(x1) + ") = " + m * (x2 - x1) + "/" + (x2 - x1) + " = " + m + "."); }
    if (d === 2) { var m2 = NZ(-6, 6), p2 = R(-9, 9); return mkN("Droite d'équation y = " + polyS([m2, p2]) + ". Quel est son coefficient directeur ?", m2, 0.01, "Dans y = mx + p, m est le coefficient directeur.", "m = " + attM(m2) + "."); }
    var m3 = NZ(2, 5), p3 = R(-5, 5), p4 = R(-5, 5);
    return mkMC("La droite d'équation y = " + polyS([m3, p3]) + " est parallèle à ... ?", "y = " + polyS([m3, p4]), ["y = " + polyS([-m3, p4]), "y = " + polyS([m3 + 1, p4]), "y = " + polyS([p3, m3])], "Deux droites sont parallèles si elles ont le MÊME coefficient directeur.", "Même m = " + m3 + " : y = " + polyS([m3, p4]) + "."); } },
  "s-systeme": { tag: "Seconde", label: "Systèmes de deux équations", make: function (d) {
    if (d === 1) { var x0 = R(2, 9), y0 = R(2, 9); return mkN("Système : x + y = " + (x0 + y0) + " et x " + NEG + " y = " + (x0 - y0) + ". Quelle est la valeur de x ?", x0, 0.01, "Additionnez les deux équations pour éliminer y.", "2x = " + 2 * x0 + " donc x = " + x0 + " (et y = " + y0 + ")."); }
    if (d === 2) { var a = R(2, 4), b = R(2, 4), x1 = R(1, 6), y1 = R(1, 6); return mkN("Système : " + a + "x + " + b + "y = " + (a * x1 + b * y1) + " et x = " + x1 + ". Quelle est la valeur de y ?", y1, 0.01, "Remplacez x par " + x1 + " dans la première équation.", a * x1 + " + " + b + "y = " + (a * x1 + b * y1) + " → " + b + "y = " + b * y1 + " → y = " + y1 + "."); }
    var x2 = R(1, 6), y2 = R(1, 6);
    return mkMC("Quel couple est solution du système { x + y = " + (x2 + y2) + " ; 2x " + NEG + " y = " + (2 * x2 - y2) + " } ?", pts(x2, y2), [pts(y2, x2), pts(x2 + 1, y2 - 1), pts(x2 - 1, y2)], "Testez chaque couple dans les DEUX équations.", x2 + " + " + y2 + " = " + (x2 + y2) + " ✓ et 2 × " + x2 + " " + NEG + " " + y2 + " = " + (2 * x2 - y2) + " ✓ : " + pts(x2, y2) + " fonctionne."); } },
  "s-grapheq": { tag: "Seconde", label: "Résolution GRAPHIQUE d'équations f(x) = g(x)", make: function (d) {
    if (d <= 1) { var m1 = R(1, 3), m2 = -R(1, 3), xi = R(-1, 2), yi = R(1, 4); var p1 = yi - m1 * xi, p2 = yi - m2 * xi; var g1 = { curves: [{ fn: function (x) { return m1 * x + p1; }, color: "#0e8f82", label: "f" }, { fn: function (x) { return m2 * x + p2; }, color: "#1e8e54", label: "g" }], xmin: -2, xmax: 4, ymin: -5, ymax: 8, points: [{ x: xi, y: yi, label: "" }] }; return mkMC("Résolvez GRAPHIQUEMENT f(x) = g(x) d'après le graphique.", "x = " + attM(xi), ["x = " + attM(xi + 1), "y = " + attM(yi), "x = " + attM(-xi)], "Les solutions sont les abscisses des POINTS D'INTERSECTION des deux courbes.", "f et g se coupent au point " + pts(xi, yi) + " : f(x) = g(x) ⇔ x = " + attM(xi) + ".", { graph: g1 }); }
    if (d === 2) { var c = R(2, 4); var g2 = { curves: [{ fn: function (x) { return x * (x - c); }, color: "#d2455f", label: "f" }, { fn: function (x) { return x; }, color: "#1e8e54", label: "g" }], xmin: -1, xmax: c + 2, ymin: -(c * c) / 4 - 1, ymax: (c + 1) * (c + 1 - c) + 2, points: [{ x: 0, y: 0, label: "" }, { x: c + 1, y: c + 1, label: "" }] }; return mkMC("Résolvez graphiquement f(x) = g(x) (une parabole et une droite).", "x = 0 et x = " + (c + 1), ["x = 0 seulement", "x = " + (c + 1) + " seulement", "x = 1 et x = " + (c + 1)], "Comptez les intersections : il y en a deux ici.", "La parabole coupe la droite en (0 ; 0) et (" + (c + 1) + " ; " + (c + 1) + ") : deux solutions.", { graph: g2 }); }
    var m3 = R(1, 3), m4 = -R(1, 3), xi3 = R(0, 2), yi3 = R(1, 4); var p3 = yi3 - m3 * xi3, p4 = yi3 - m4 * xi3;
    return mkMC("Résolvez GRAPHIQUEMENT f(x) = g(x) : donnez le point d'intersection.", pts(xi3, yi3), [pts(yi3, xi3), pts(xi3, yi3 + 1), pts(xi3 + 1, yi3)], "Les droites se croisent : lisez ses coordonnées complètes.", "f et g se coupent en " + pts(xi3, yi3) + " : c'est l'unique solution du système.", { graph: { curves: [{ fn: function (x) { return m3 * x + p3; }, color: "#0e8f82", label: "f" }, { fn: function (x) { return m4 * x + p4; }, color: "#1e8e54", label: "g" }], xmin: -2, xmax: 4, ymin: -5, ymax: 8, points: [{ x: xi3, y: yi3, label: "I" }] } }); } },
  "s-graphineq": { tag: "Seconde", label: "Résolution GRAPHIQUE d'inéquations f(x) < g(x)", make: function (d) {
    if (d === 1) { var m1 = R(1, 3), m2 = -R(1, 3), xi = R(-1, 2), yi = R(1, 4); var p1 = yi - m1 * xi, p2 = yi - m2 * xi; return mkMC("Résolvez GRAPHIQUEMENT f(x) < g(x) d'après le graphique.", "x < " + attM(xi), ["x > " + attM(xi), "x = " + attM(xi), "Tous les réels"], "f(x) < g(x) là où la courbe de f est EN DESSOUS de celle de g.", "f est sous g avant l'intersection x = " + attM(xi) + " : l'ensemble des solutions est x < " + attM(xi) + ".", { graph: { curves: [{ fn: function (x) { return m1 * x + p1; }, color: "#0e8f82", label: "f" }, { fn: function (x) { return m2 * x + p2; }, color: "#1e8e54", label: "g" }], xmin: -2, xmax: 4, ymin: -5, ymax: 8, points: [{ x: xi, y: yi, label: "" }] } }); }
    if (d === 2) { var c = R(2, 4); var gg = { curves: [{ fn: function (x) { return x * (x - c); }, color: "#d2455f", label: "f" }, { fn: function (x) { return x; }, color: "#1e8e54", label: "g" }], xmin: -1, xmax: c + 2, ymin: -(c * c) / 4 - 1, ymax: (c + 1) * (c + 1 - c) + 2, points: [{ x: 0, y: 0, label: "" }, { x: c + 1, y: c + 1, label: "" }] };
      // f(x) − g(x) = x(x − (c+1)) > 0 ⟺ x < 0 OU x > c+1 : l'union de deux morceaux.
      // Variante A (50%) : cocher les DEUX morceaux (réponses multiples).
      if (Math.random() < 0.5) { return mkMulti("Résolvez graphiquement f(x) > g(x) : la parabole f contre la droite g.", ["x < 0", "x > " + (c + 1)], ["0 < x < " + (c + 1), "Tous les réels"], "La parabole f est au-dessus de la droite g HORS de l'intervalle entre les deux intersections.", "f(x) " + NEG + " g(x) = x(x " + NEG + " " + (c + 1) + ") > 0 : f > g pour x < 0 OU x > " + (c + 1) + ". Il faut cocher les deux morceaux !", { graph: gg }); }
      // Variante B (50%) : aucune proposition ne décrit l'ensemble complet → « Autre ».
      return mkMC("Résolvez graphiquement f(x) > g(x) : la parabole f contre la droite g.", "Autre", ["0 < x < " + (c + 1), "x < 0 seulement", "x > " + (c + 1) + " seulement", "Tous les réels"], "Aucune proposition ne décrit à elle seule l'ENSEMBLE complet des solutions.", "f(x) " + NEG + " g(x) = x(x " + NEG + " " + (c + 1) + ") > 0 : f > g pour x < 0 OU x > " + (c + 1) + ". La bonne réponse est donc « Autre ».", { graph: gg }); }
    var m3 = R(1, 3), m4 = -R(1, 3), xi3 = R(0, 2), yi3 = R(1, 4); var p3 = yi3 - m3 * xi3, p4 = yi3 - m4 * xi3;
    return mkMC("Résolvez graphiquement f(x) > g(x) (courbes ci-dessous).", "x > " + attM(xi3), ["x < " + attM(xi3), attM(xi3) + " < x < " + attM(xi3 + 2), "x = " + attM(xi3)], "Repérez où la droite bleue (f) dépasse la verte (g).", "f est au-dessus de g après l'intersection x = " + attM(xi3) + ".", { graph: { curves: [{ fn: function (x) { return m3 * x + p3; }, color: "#0e8f82", label: "f" }, { fn: function (x) { return m4 * x + p4; }, color: "#1e8e54", label: "g" }], xmin: -2, xmax: 4, ymin: -5, ymax: 8, points: [{ x: xi3, y: yi3, label: "" }] } }); } },
  "s-stat2": { tag: "Seconde", label: "Statistiques (moyenne pondérée, médiane, quartiles)", make: function (d) {
    if (d === 1) { var n1 = R(8, 16), n2 = R(8, 16), n3 = R(8, 16), co = pick([[1, 2, 1], [2, 1, 1]]); var tot = n1 * co[0] + n2 * co[1] + n3 * co[2], cw = co[0] + co[1] + co[2]; return mkN("Notes pondérées : " + n1 + " (coef " + co[0] + "), " + n2 + " (coef " + co[1] + "), " + n3 + " (coef " + co[2] + "). Quelle est la moyenne pondérée ?", tot / cw, 0.01, "Moyenne = Σ(note × coef) ÷ Σcoef.", "(" + n1 * co[0] + " + " + n2 * co[1] + " + " + n3 * co[2] + ") ÷ " + cw + " = " + tot + " ÷ " + cw + " = " + fr(tot / cw) + "."); }
    if (d === 2) { var a = R(1, 9), s = R(1, 4); var vals = [a, a + 2 * s, a + 5 * s, a + 7 * s, a + 9 * s]; return mkN("Série triée : " + vals.join(", ") + ". Quelle est la médiane ?", a + 5 * s, 0.01, "Effectif impair (5) : la médiane est la 3e valeur.", "La valeur centrale de la série triée est " + (a + 5 * s) + "."); }
    return mkMC("Le premier quartile Q1 sépare la série ... ?", "25 % des valeurs en dessous, 75 % au-dessus", ["50 % / 50 %", "75 % en dessous", "Toutes les valeurs"], "Q1 = 25 %, la médiane = 50 %, Q3 = 75 %.", "Q1 coupe au premier quart de l'effectif."); } },
  "s-proba2": { tag: "Seconde", label: "Probabilités (réunion, intersection, contraire)", make: function (d) {
    if (d === 1) { var p = R(5, 95) / 100; return mkN("P(A) = " + fr(p) + ". Quelle est P(Ā), la probabilité de l'événement contraire ?", 1 - p, 0.005, "P(Ā) = 1 " + NEG + " P(A).", "1 " + NEG + " " + fr(p) + " = " + fr(1 - p) + "."); }
    if (d === 2) { var pa = pick([0.4, 0.5, 0.6]), pb = pick([0.2, 0.3]), pi = pick([0.05, 0.1]); return mkN("P(A) = " + fr(pa) + " ; P(B) = " + fr(pb) + " ; P(A ∩ B) = " + fr(pi) + ". Quelle est P(A ∪ B) ?", pa + pb - pi, 0.005, "P(A ∪ B) = P(A) + P(B) " + NEG + " P(A ∩ B).", fr(pa) + " + " + fr(pb) + " " + NEG + " " + fr(pi) + " = " + fr(pa + pb - pi) + "."); }
    var card = pick([["un as", 4], ["un roi", 4], ["un cœur", 8], ["un pique", 8], ["une figure (valet, dame ou roi)", 12]]);
    return mkMC("On tire une carte d'un jeu de 32. Probabilité de " + card[0] + " ?", fracS(card[1], 32), [fracS(card[1], 16), "1/32", fracS(32 - card[1], 32)], "Comptez les cartes favorables sur les 32.", card[1] + "/32 = " + fracS(card[1], 32) + "."); } },
  "s-taux": { tag: "Seconde", label: "Taux d'évolution et coefficient multiplicateur", make: function (d) {
    if (d === 1) { var t = pick([5, 10, 12, 15, 20, 25, 40, 50, 60, 80]); return mkMC("Augmenter de " + t + " % revient à multiplier par ... ?", fr(1 + t / 100), [fr(t / 100), fr(1 - t / 100), String(t)], "Augmenter de t % = multiplier par (1 + t/100).", "1 + " + t + "/100 = " + fr(1 + t / 100) + "."); }
    if (d === 2) { var vi = pick([80, 100, 120, 150, 200, 250, 300, 400, 500]), k = pick([10, -10, 20, -20, 25, -25, 50, -50]); var vf = vi * (1 + k / 100); return mkN("Une valeur passe de " + vi + " à " + vf + ". Quel est le taux d'évolution (en %, avec signe) ?", k, 0.5, "Taux = ((valeur finale " + NEG + " valeur initiale)/initiale) × 100.", "(" + fr(vf) + " " + NEG + " " + vi + ")/" + vi + " × 100 = " + k + " %."); }
    var t3 = pick([10, 20, 25, 50]);
    return mkMC("Une quantité augmente de " + t3 + " %, puis diminue de " + t3 + " %. Au total ... ?", "elle a baissé (× " + fr(1 - (t3 / 100) * (t3 / 100) * 10000 / 10000) + ")", ["elle n'a pas changé", "elle a augmenté de " + t3 + " %", "elle a baissé de " + t3 + " %"], "Multipliez les coefficients : " + fr(1 + t3 / 100) + " × " + fr(1 - t3 / 100) + ".", fr(1 + t3 / 100) + " × " + fr(1 - t3 / 100) + " = " + fr((1 + t3 / 100) * (1 - t3 / 100)) + " : baisse au total."); } },
  "s-algo": { tag: "Seconde", label: "Algorithmique et boucles", make: function (d) {
    if (d === 1) { var n = R(4, 9); return mkN("Algorithme : S ← 0 ; Pour i de 1 à " + n + " : S ← S + i. Que vaut S à la fin ?", n * (n + 1) / 2, 0.01, "S additionne 1, puis 2, ... jusqu'à " + n + ".", "1 + 2 + ... + " + n + " = " + n + " × " + (n + 1) + " ÷ 2 = " + n * (n + 1) / 2 + "."); }
    if (d === 2) { var s0 = R(5, 20), k = R(2, 4), n2 = R(2, 4); return mkN("Algorithme : S ← " + s0 + " ; Pour i de 1 à " + n2 + " : S ← S " + NEG + " " + k + ". Que vaut S à la fin ?", s0 - k * n2, 0.01, "On retire " + k + " à chaque tour de boucle (" + n2 + " tours).", s0 + " " + NEG + " " + k + " × " + n2 + " = " + (s0 - k * n2) + "."); }
    var n0 = R(0, 3), st = R(2, 4), lim = R(5, 9); var fin = n0 + st * (Math.ceil((lim - n0) / st));
    return mkMC("Algorithme : n ← " + n0 + " ; Tant que n < " + lim + " : n ← n + " + st + ". Que vaut n à la fin ?", String(fin), [String(fin - st), String(lim), "La boucle est infinie"], "Suivez pas à pas : la boucle s'arrête dès que n atteint ou dépasse " + lim + ".", "n passe de " + n0 + " à " + fin + " par pas de " + st + " : " + fin + " ≥ " + lim + ", on s'arrête."); } },
  "s-courbeequation": { tag: "Seconde", label: "Déterminer GRAPHIQUEMENT une équation de droite", make: function (d) {
    var m = pick([1, 2, 3, -1, -2, -3]), p = pick([-2, -1, 0, 1, 2]);
    var lin = function (mm, pp) { var s = "y = "; if (mm === 1) s += "x"; else if (mm === -1) s += NEG + "x"; else s += attM(mm) + "x"; if (pp !== 0) s += pp > 0 ? " + " + pp : " " + NEG + " " + (0 - pp); return s; };
    return mkMC("Déterminez graphiquement l'équation de la droite tracée (le point marqué est son point d'intersection avec l'axe des ordonnées).", lin(m, p), [lin(m + 1, p), lin(m, p + 1), lin(-m, p)], "Le point marqué donne p (ordonnée à l'origine) ; la pente entre deux points de la grille donne m.", "La droite coupe l'axe des ordonnées en " + attM(p) + " et monte de " + attM(m) + " par pas de 1 : " + lin(m, p) + ".", { graph: { curves: [{ fn: function (x) { return m * x + p; }, color: "#0e8f82" }], xmin: -2, xmax: 4, ymin: -6, ymax: 6, points: [{ x: 0, y: p, label: "(0 ; " + attM(p) + ")" }] } }); } },
  "s-transfo": { tag: "Seconde", label: "Transformations du plan (translation, homothétie, rotation, symétries)", make: function (d) {
    if (d === 1) { var x = R(-8, 8), y = R(-8, 8), a = NZ(-5, 5), b = NZ(-5, 5); return mkMC("Image du point M" + pts(x, y) + " par la translation de vecteur u(" + a + " ; " + b + ") ?", pts(x + a, y + b), [pts(x - a, y - b), pts(x + b, y + a), pts(a, b)], "Translation : M' = M + u, coordonnée par coordonnée.", pts(x, y) + " + (" + a + " ; " + b + ") = " + pts(x + a, y + b) + "."); }
    if (d === 2) { var x2 = pick([1, 2, 3, -1, -2, -3]), y2 = pick([1, 2, 3, -1, -2, -3]), k = pick([2, 3, -2]); return mkMC("Image du point M" + pts(x2, y2) + " par l'homothétie de centre O et de rapport " + k + " ?", pts(k * x2, k * y2), [pts(x2 / k, y2 / k), pts(k * x2, y2), pts(x2, k * y2)], "Homothétie de rapport k : OM' = k × OM, donc on multiplie les coordonnées par k.", "(" + attM(x2) + " × " + k + " ; " + attM(y2) + " × " + k + ") = " + pts(k * x2, k * y2) + "."); }
    return mkMC("Une transformation envoie chaque point M sur un point M' tel que O soit le MILIEU de [MM']. Quelle est-elle ?", "La symétrie centrale de centre O", ["La translation de vecteur OM", "L'homothétie de centre O et de rapport 2", "La rotation de centre O et d'angle 180° ... c'est d'ailleurs la même !"], "O milieu de [MM'] signifie OM' = " + attM(-1) + "OM.", "C'est la symétrie centrale de centre O — qui coïncide avec la rotation d'angle π : les transformations du plan sont liées à la trigonométrie !"); } },

  "t-canonique": { tag: "Première STI2D", label: "Forme canonique et sommet d'une parabole", make: function (d) {
    if (d === 1) { var r1 = R(-6, 2), k = R(1, 3); while (r1 + k === 0) r1 = R(-6, 2); var r2 = r1 + 2 * k, mid = r1 + k, be = -k * k;
      return mkMC("La parabole du radar représente f(x) = " + polyS(trin2(r1, r2)) + " : quel est le sommet S(α ; β) ?", pts(mid, be), [pts(-mid, be), pts(mid, -be), pts(mid + 1, be + 1)], "Les racines " + r1 + " et " + r2 + " sont symétriques : le sommet est au milieu, α = (" + r1 + " + " + r2 + ")/2.", "α = (" + r1 + " + " + r2 + ")/2 = " + mid + " et β = f(α) = " + attM(be) + " : S" + pts(mid, be) + ".", { graph: parabGraph(r1, r2, { points: [{ x: mid, y: be, label: "S" }] }) }); }
    if (d === 2) { var a2 = pick([1, 2]), r3 = R(-4, 2), k2 = R(1, 3), r4 = r3 + 2 * k2, tr = trin2(r3, r4, a2), al = (r3 + r4) / 2;
      return mkN("f(x) = " + polyS(tr) + ". Calculez l'abscisse du sommet : α = " + NEG + "b/(2a) = ?", al, 0.01, "Repérez a = " + a2 + " et b = " + attM(tr[1]) + ", puis appliquez α = " + NEG + "b/(2a).", "α = (" + attM(tr[1]) + ")/(2 × " + a2 + ") = " + fr(al) + "."); }
    var r5 = R(-6, 1), k3 = R(1, 3); while (r5 + k3 === 0) r5 = R(-6, 1); var r6 = r5 + 2 * k3, m3 = r5 + k3, kk = k3 * k3;
    var cSq = "(x " + (m3 > 0 ? NEG + " " + m3 : "+ " + (0 - m3)) + ")²";
    var oSq = "(x " + (m3 > 0 ? "+ " + m3 : NEG + " " + (0 - m3)) + ")²";
    return mkMC("f(x) = " + polyS(trin2(r5, r6)) + " : quelle est sa forme canonique a(x " + NEG + " α)² + β ?", cSq + " " + NEG + " " + kk, [cSq + " + " + kk, oSq + " " + NEG + " " + kk, "(x " + NEG + " " + (m3 + 1) + ")² " + NEG + " " + kk], "Le sommet est S(α ; β) : la forme canonique s'écrit (x " + NEG + " α)² + β.", "α = " + m3 + " et β = " + attM(-kk) + " : f(x) = (x " + (m3 > 0 ? NEG + " " + m3 : "+ " + (0 - m3)) + ")² " + NEG + " " + kk + ". Développez pour retrouver la forme initiale !"); } },
  "t-discriminant": { tag: "Première STI2D", label: "La machine à racines : construire le discriminant", make: function (d) {
    var a = pick([1, 2]);
    if (d === 1) { var r1 = R(-4, 4), r2 = R(-4, 4); while (r2 === r1 || Math.abs(r2 - r1) > 5) r2 = R(-4, 4); var tr = trin2(r1, r2, a), D = a * a * (r1 - r2) * (r1 - r2);
      return mkN("La machine à racines s'amorce ! Pour f(x) = " + polyS(tr) + ", calculez le discriminant Δ = b² " + NEG + " 4ac.", D, 0.01, "Trois gestes : ① élevez b au carré ② calculez 4 × a × c ③ soustrayez : Δ = b² " + NEG + " 4ac.", "Ici b = " + attM(tr[1]) + ", a = " + a + ", c = " + attM(tr[2]) + " : Δ = " + tr[1] * tr[1] + " " + NEG + " 4 × " + a + " × " + attM(tr[2]) + " = " + D + "."); }
    if (d === 2) { var dbl = pick([false, false, true]), rb = R(-3, 3), rc = dbl ? rb : R(-3, 3); while (!dbl && (rc === rb || Math.abs(rc - rb) > 4)) rc = R(-3, 3); var tr2 = trin2(rb, rc, a), D2 = a * a * (rb - rc) * (rb - rc);
      var ok = D2 === 0 ? "Δ = 0 : une racine double" : "Δ = " + D2 + " > 0 : deux racines distinctes";
      var bad = D2 === 0 ? ["Δ > 0 : deux racines distinctes", "Δ < 0 : aucune racine réelle", "Δ = 2a : deux racines"] : ["Δ = 0 : une racine double", "Δ < 0 : aucune racine réelle", "On ne peut pas savoir sans résoudre"];
      return mkMC("Le viseur de la machine affiche f(x) = " + polyS(tr2) + ". Après le calcul de Δ = b² " + NEG + " 4ac, que révèle-t-il ?", ok, bad, "Calculez Δ d'abord (gestes ①②③), puis lisez son SIGNE.", "Δ = " + D2 + " : " + (D2 === 0 ? "une racine double" : "deux racines distinctes") + " — le signe de Δ tranche, sans résoudre !"); }
    var rd = R(-4, 4), re = R(-4, 4); while (re === rd || Math.abs(re - rd) > 5) re = R(-4, 4); var tr3 = trin2(rd, re, a), D3 = a * a * (rd - re) * (rd - re);
    return mkN("Plein régime ! f(x) = " + polyS(tr3) + " : on a calculé Δ = " + D3 + ". La formule (−b ± √Δ)/(2a) donne les racines : laquelle est la plus PETITE ?", Math.min(rd, re), 0.01, "√" + D3 + " = " + a + " × |différence des racines|... simplifiez : √Δ = " + (a * Math.abs(rd - re)) + ", puis calculez (−b " + NEG + " √Δ)/(2a).", "√Δ = " + (a * Math.abs(rd - re)) + " : les racines sont (" + attM(tr3[1]) + " " + NEG + " " + (a * Math.abs(rd - re)) + ")/" + (2 * a) + " = " + Math.min(rd, re) + " et (" + attM(tr3[1]) + " + " + (a * Math.abs(rd - re)) + ")/" + (2 * a) + " = " + Math.max(rd, re) + ". La plus petite : " + Math.min(rd, re) + "."); } },
  "t-solve2deg": { tag: "Première STI2D", label: "Équations du second degré", make: function (d) {
    if (d === 1) { var r1 = NZ(-9, 9), r2 = NZ(-9, 9); while (r2 === r1) r2 = NZ(-9, 9); var S = r1 + r2, P = r1 * r2;
      return mkN("Résolvez " + polyS([1, -S, P]) + " = 0 : donnez la plus PETITE racine (astuce : cherchez deux nombres de somme " + S + " et de produit " + P + ").", Math.min(r1, r2), 0.01, "Si deux nombres ont pour somme S et produit P, ce sont les racines de x² " + NEG + " Sx + P = 0.", "Somme " + S + ", produit " + P + " : les racines sont " + Math.min(r1, r2) + " et " + Math.max(r1, r2) + "."); }
    if (d === 2) { var u1 = NZ(-4, 4), u2 = NZ(-4, 4); while (u2 === u1 || u1 + u2 === 0) u2 = NZ(-4, 4); var tr = trin2(u1, u2, 2), mn = Math.min(u1, u2), mx = Math.max(u1, u2);
      return mkMC("Quelles sont les racines de f(x) = " + polyS(tr) + " ?", "x = " + attM(mn) + " et x = " + attM(mx), ["x = " + attM(mn + 1) + " et x = " + attM(mx + 1), "x = " + attM(0 - mn) + " et x = " + attM(0 - mx), "x = " + attM(mn) + ", x = " + attM(mx) + " et x = 0"], "Calculez Δ = b² " + NEG + " 4ac puis (−b ± √Δ)/(2a)... ou testez des valeurs simples.", "Δ = " + tr[1] * tr[1] + " " + NEG + " 4 × 2 × " + attM(tr[2]) + " = " + (tr[1] * tr[1] - 8 * tr[2]) + " : racines " + mn + " et " + mx + "."); }
    var n1 = 0 - R(1, 6), n2 = 0 - R(1, 6); while (n2 === n1) n2 = 0 - R(1, 6); var tr3 = trin2(n1, n2);
    return mkN("f(x) = " + polyS(tr3) + ". On sait que ses DEUX racines sont négatives : donnez la plus GRANDE (la plus proche de 0).", Math.max(n1, n2), 0.01, "Somme S = " + (n1 + n2) + " et produit P = " + (n1 * n2) + " : deux nombres négatifs.", "Deux négatifs de produit " + (n1 * n2) + " et de somme " + (n1 + n2) + " : " + Math.min(n1, n2) + " et " + Math.max(n1, n2) + " ; la plus grande est " + Math.max(n1, n2) + "."); } },
  "t-trinomesigne": { tag: "Première STI2D", label: "Signe d'un trinôme", make: function (d) {
    if (d === 1) { var r1 = R(-6, 0), k = R(1, 3), r2 = r1 + 2 * k, tr = trin2(r1, r2);
      return mkMC("Quel est le signe de f(x) = " + polyS(tr) + " ?", "Négatif sur ]" + r1 + " ; " + r2 + "[, positif ailleurs", ["Positif sur ]" + r1 + " ; " + r2 + "[, négatif ailleurs", "Toujours positif", "Toujours négatif"], "a = 1 > 0 : la parabole sourit — elle est SOUS l'axe entre ses racines.", "a > 0 : f(x) < 0 entre les racines " + r1 + " et " + r2 + ", f(x) > 0 ailleurs.", { graph: parabGraph(r1, r2) }); }
    if (d === 2) { var s1 = R(-6, 0), k2 = R(1, 3), s2 = s1 + 2 * k2, tr2 = trin2(s1, s2);
      return mkSign("f(x) = " + polyS(tr2) + " (a = 1 > 0). Construisez le tableau de signes : cliquez sur chaque case pour alterner + / −.", ["-∞", String(s1), String(s2), "+∞"], "f(x)", ["+", NEG, "+"], "Signe de a (> 0) à l'extérieur, signe contraire entre les racines.", "a > 0 : + de part et d'autre des racines " + s1 + " et " + s2 + ", " + NEG + " entre elles."); }
    var a3 = pick([1, 2]), r = NZ(1, 5), tr3 = [-a3, 0, a3 * r * r];
    return mkSign("f(x) = " + polyS(tr3) + " : le coefficient de x² est négatif. Construisez le tableau de signes.", ["-∞", attM(-r), String(r), "+∞"], "f(x)", [NEG, "+", NEG], "Signe de a (< 0) à l'extérieur : − partout sauf entre les racines " + attM(-r) + " et " + r + ".", "a < 0 : " + NEG + " à l'extérieur des racines " + attM(-r) + " et " + r + ", + entre elles (f(x) = " + attM(-a3) + "(x " + NEG + " " + r + ")(x + " + r + ") après factorisation)."); } },
  "t-derivee": { tag: "Première STI2D", label: "Dérivées des fonctions usuelles", make: function (d) {
    if (d === 1) { var c = NZ(-9, 9);
      return mkMC("f(x) = " + polyS([1, 0, c]) + " : que vaut f'(x) ?", "2x", ["x", "2x " + (c > 0 ? "+ " + c : NEG + " " + (0 - c)), "x²"], "Dérivée de x² = 2x ; la constante disparaît.", "f'(x) = 2x : la constante " + c + " s'efface (dérivée d'une constante = 0)."); }
    if (d === 2) { var a = pick([1, 2, 3]), b = NZ(-9, 9), c2 = NZ(-9, 9); while (c2 === b) c2 = NZ(-9, 9);
      return mkMC("f(x) = " + polyS([a, b, c2]) + " : que vaut f'(x) ?", polyS([2 * a, b]), [polyS([a, b]), polyS([2 * a, b, c2]), polyS([2 * a, c2])], "Chaque terme se dérive seul : (ax²)' = 2ax, (bx)' = b, constante → 0.", "f'(x) = " + polyS([2 * a, b]) + " : on double le coefficient de x², le coefficient de x reste, la constante disparaît."); }
    var p = R(1, 5), q = NZ(-5, 5);
    return mkN("f(x) = (3x + " + p + ")(x " + (q >= 0 ? "+ " + q : NEG + " " + (0 - q)) + "). En utilisant (uv)' = u'v + uv', on obtient f'(x) = 6x + k : que vaut k ?", 3 * q + p, 0.01, "Posez u = 3x + " + p + " (donc u' = 3) et v = x " + (q >= 0 ? "+ " + q : NEG + " " + (0 - q)) + " (donc v' = 1), puis u'v + uv'.", "u'v + uv' = 3(x " + (q >= 0 ? "+ " + q : NEG + " " + (0 - q)) + ") + (3x + " + p + ") = 6x + " + (3 * q + p) + " : k = " + (3 * q + p) + "."); } },
  "t-deriveept": { tag: "Première STI2D", label: "Nombre dérivé en un point", make: function (d) {
    if (d === 1) { var a = pick([2, 3, 4, 5]);
      return mkN("f(x) = x². Que vaut le nombre dérivé f'(" + a + ") (pente de la tangente en x = " + a + ") ?", 2 * a, 0.01, "f'(x) = 2x : remplacez x par " + a + ".", "f'(" + a + ") = 2 × " + a + " = " + 2 * a + "."); }
    if (d === 2) { var a2 = pick([3, 4, 5]);
      return mkN("f(x) = x² " + NEG + " 2x. Que vaut f'(" + a2 + ") ?", 2 * a2 - 2, 0.01, "f'(x) = 2x " + NEG + " 2 : remplacez x par " + a2 + ".", "f'(" + a2 + ") = 2 × " + a2 + " " + NEG + " 2 = " + (2 * a2 - 2) + "."); }
    var A = pick([2, 3]), b = NZ(-9, 9), c = NZ(-9, 9), x0 = NZ(-4, 4);
    return mkN("f(x) = " + polyS([A, b, c]) + ". Que vaut le nombre dérivé f'(" + x0 + ") ?", 2 * A * x0 + b, 0.01, "f'(x) = " + polyS([2 * A, b]) + " : remplacez x par " + attM(x0) + ".", "f'(" + x0 + ") = " + 2 * A + " × " + attM(x0) + " " + (b > 0 ? "+ " + b : NEG + " " + (0 - b)) + " = " + (2 * A * x0 + b) + "."); } },
  "t-tangente": { tag: "Première STI2D", label: "Équation de la tangente", make: function (d) {
    if (d === 1) { var a = pick([2, 3, 4, 5]);
      return mkN("La tangente à f(x) = x² en x = " + a + " a pour équation y = " + 2 * a + "x + p : que vaut p ?", 0 - a * a, 0.01, "La tangente passe par le point (" + a + " ; f(" + a + ")) : remplacez x par " + a + " et y par " + a * a + ".", "y = " + 2 * a + "x + p passe par (" + a + " ; " + a * a + ") : " + a * a + " = " + 2 * a * a + " + p, donc p = " + attM(0 - a * a) + "."); }
    if (d === 2) { var a2 = pick([2, 3]);
      return mkMC("Quelle est l'équation de la tangente à f(x) = x² en x = " + a2 + " ?", "y = " + 2 * a2 + "x " + NEG + " " + a2 * a2, ["y = " + 2 * a2 + "x + " + a2 * a2, "y = " + a2 + "x " + NEG + " " + a2 * a2, "y = " + a2 * a2 + "x " + NEG + " " + 2 * a2], "Pente f'(" + a2 + ") = " + 2 * a2 + " ; elle passe par (" + a2 + " ; " + a2 * a2 + ").", "y = f'(" + a2 + ")(x " + NEG + " " + a2 + ") + f(" + a2 + ") = " + 2 * a2 + "x " + NEG + " " + a2 * a2 + "."); }
    var x0 = pick([3, 4, 5]);
    return mkMC("Quelle est l'équation de la tangente à f(x) = x² " + NEG + " 2x en x = " + x0 + " ?", "y = " + (2 * x0 - 2) + "x " + NEG + " " + x0 * x0, ["y = " + (2 * x0 - 2) + "x " + NEG + " " + (x0 * x0 - 2 * x0), "y = " + 2 * x0 + "x " + NEG + " " + x0 * x0, "y = " + (2 * x0 - 2) + "x + " + x0 * x0], "f'(x) = 2x " + NEG + " 2 : pente en " + x0 + " ; puis la tangente passe par (" + x0 + " ; f(" + x0 + ")).", "Pente " + (2 * x0 - 2) + ", point (" + x0 + " ; " + (x0 * x0 - 2 * x0) + ") : y = " + (2 * x0 - 2) + "x " + NEG + " " + x0 * x0 + "."); } },
  "t-tangentegraph": { tag: "Première STI2D", label: "Lire une tangente sur le graphique", make: function (d) {
    if (d === 1) { var x0 = pick([1, 2, 3]);
      return mkN("Le graphique montre f(x) = x² et sa tangente au point A : quel est le coefficient directeur de cette tangente ?", 2 * x0, 0.01, "La tangente passe aussi par l'origine O : mesurez de combien elle monte par unité.", "f'(x) = 2x : en x = " + x0 + ", la pente vaut f'(" + x0 + ") = " + 2 * x0 + ".", { graph: { curves: [{ fn: function (x) { return x * x; }, color: "#0e8f82" }, { fn: function (x) { return 2 * x0 * x - x0 * x0; }, color: "#c97900" }], xmin: -1, xmax: x0 + 2, points: [{ x: x0, y: x0 * x0, label: "A" }] } }); }
    if (d === 2) { var v = NZ(-3, 3);
      return mkN("La droite tracée est la tangente à la parabole f(x) = (x " + (v > 0 ? NEG + " " + v : "+ " + (0 - v)) + ")², et elle est HORIZONTALE : en quelle abscisse touche-t-elle la parabole ?", v, 0.01, "Tangente horizontale ⟺ pente nulle ⟺ f'(x) = 0.", "f(x) = x² " + (v > 0 ? NEG + " " + 2 * v : "+ " + (0 - 2 * v)) + "x + " + v * v + " donne f'(x) = 2x " + (v > 0 ? NEG + " " + 2 * v : "+ " + (0 - 2 * v)) + " : nulle en x = " + v + " (le sommet).", { graph: { curves: [{ fn: function (x) { return (x - v) * (x - v); }, color: "#0e8f82" }, { fn: function (x) { return 0; }, color: "#c97900" }], xmin: v - 3, xmax: v + 3, ymin: -1, ymax: 9, points: [{ x: v, y: 0, label: "S" }] } }); }
    var v2 = NZ(-3, 3), p = R(1, 3), x1 = v2 + p;
    return mkN("La tangente tracée touche f(x) = x² " + NEG + " " + 2 * v2 + "x au point d'abscisse " + x1 + " : quel est son coefficient directeur ?", 2 * p, 0.01, "f'(x) = 2x " + NEG + " " + 2 * v2 + " : calculez f'(" + x1 + ").", "f'(" + x1 + ") = 2 × " + x1 + " " + NEG + " " + 2 * v2 + " = " + 2 * p + ".", { graph: { curves: [{ fn: function (x) { return x * x - 2 * v2 * x; }, color: "#0e8f82" }], xmin: v2 - 4, xmax: v2 + 4, tangent: { x: x1, y: x1 * x1 - 2 * v2 * x1, slope: 2 * p }, points: [{ x: x1, y: x1 * x1 - 2 * v2 * x1, label: "A" }] } }); } },
  "t-fprimevariation": { tag: "Première STI2D", label: "Du signe de f' aux variations de f", make: function (d) {
    if (d === 1) { var b = 2 * R(1, 5), al = b / 2;
      return mkMC("On connaît f'(x) = " + polyS([2, 0 - b]) + ". Quelles sont les variations de f ?", "Décroissante sur ]-∞ ; " + al + "] puis croissante (minimum en x = " + al + ")", ["Croissante sur ]-∞ ; " + al + "] puis décroissante (maximum en x = " + al + ")", "Croissante sur ℝ", "Décroissante sur ℝ"], "f' négative ⟹ f décroît ; f' positive ⟹ f croît ; f' s'annule en x = " + al + ".", "f'(x) < 0 avant " + al + " et > 0 après : f descend puis remonte — minimum en x = " + al + "."); }
    if (d === 2) { var b2 = 2 * R(1, 5), al2 = b2 / 2;
      return mkMC("On connaît f'(x) = " + polyS([-2, b2]) + ". Quelles sont les variations de f ?", "Croissante sur ]-∞ ; " + al2 + "] puis décroissante (maximum en x = " + al2 + ")", ["Décroissante sur ]-∞ ; " + al2 + "] puis croissante (minimum en x = " + al2 + ")", "Décroissante sur ℝ", "Constante"], "f'(x) = 0 en x = " + al2 + " ; regardez le signe de part et d'autre.", "f' > 0 avant " + al2 + " et < 0 après : f monte puis descend — maximum en x = " + al2 + "."); }
    var k = R(1, 3), k2 = k * k;
    return mkVar("f'(x) = " + polyS([3, 0, -3 * k2]) + ". Complétez le tableau de variations de f (cliquez sur les flèches pour alterner ↗ / ↘).", ["-∞", attM(-k), String(k), "+∞"], [null, 2 * k * k * k, 0 - 2 * k * k * k, null], [UP, DOWN, UP], "f' s'annule en x = " + attM(-k) + " et x = " + k + " : f monte, descend, remonte.", "f' > 0 puis < 0 puis > 0 : maximum f(" + attM(-k) + ") = " + 2 * k * k * k + ", minimum f(" + k + ") = " + attM(0 - 2 * k * k * k) + ".", { xs: ["-∞", attM(-k), String(k), "+∞"], label: "f'(x)", signs: ["+", NEG, "+"] }); } },
  "t-courbederivee": { tag: "Première STI2D", label: "Lire la courbe de f' pour deviner f", make: function (d) {
    if (d === 1) { var v = NZ(-4, 4);
      return mkMC("La droite tracée est la courbe de f' : elle coupe l'axe des abscisses en x = " + v + ". Que peut-on dire de f ?", "f admet un minimum en x = " + v, ["f admet un maximum en x = " + v, "f est constante", "f s'annule en x = " + v], "f' est négative avant " + v + " (la droite est sous l'axe) et positive après.", "f décroît puis croît : minimum en x = " + v + ". Attention : c'est f' qui s'annule, pas f !", { graph: { curves: [{ fn: function (x) { return 2 * (x - v); }, color: "#0e8f82" }], xmin: v - 4, xmax: v + 4, points: [{ x: v, y: 0, label: String(v) }] } }); }
    if (d === 2) { var b = 2 * R(1, 4), al = b / 2;
      return mkMC("La droite tracée est la courbe de f' : f'(x) = " + polyS([-2, b]) + ". Que peut-on dire de f ?", "f admet un maximum en x = " + al, ["f admet un minimum en x = " + al, "f est décroissante sur ℝ", "f est croissante sur ℝ"], "f' est positive avant " + al + " (au-dessus de l'axe) puis négative.", "f croît puis décroît : maximum en x = " + al + ".", { graph: { curves: [{ fn: function (x) { return -2 * x + b; }, color: "#0e8f82" }], xmin: al - 4, xmax: al + 4, points: [{ x: al, y: 0, label: String(al) }] } }); }
    var v3 = NZ(-3, 3);
    return mkN("La parabole représente f(x) = x² " + (v3 > 0 ? NEG + " " + 2 * v3 : "+ " + (0 - 2 * v3)) + "x. Sa tangente au sommet S est horizontale : en quelle abscisse f' s'annule-t-elle ?", v3, 0.01, "f'(x) = 2x " + (v3 > 0 ? NEG + " " + 2 * v3 : "+ " + (0 - 2 * v3)) + " : résolvez f'(x) = 0.", "f'(x) = 2x " + (v3 > 0 ? NEG + " " + 2 * v3 : "+ " + (0 - 2 * v3)) + " = 0 donne x = " + v3 + " : le sommet et la racine de f' coïncident.", { graph: parabGraph(0, 2 * v3, { points: [{ x: v3, y: -v3 * v3, label: "S" }] }) }); } },
  "t-polynome3": { tag: "Première STI2D", label: "Polynômes de degré 3", make: function (d) {
    if (d === 1) { var k = R(2, 4);
      return mkMC("Factorisez x³ " + NEG + " " + k * k * k + " (identité a³ " + NEG + " b³).", "(x " + NEG + " " + k + ")(x² + " + k + "x + " + k * k + ")", ["(x + " + k + ")(x² " + NEG + " " + k + "x + " + k * k + ")", "(x " + NEG + " " + k + ")(x² " + NEG + " " + k + "x " + NEG + " " + k * k + ")", "(x " + NEG + " " + k + ")(x² + " + k + "x " + NEG + " " + k * k + ")"], "a³ " + NEG + " b³ = (a " + NEG + " b)(a² + ab + b²) avec a = x et b = " + k + ".", "x³ " + NEG + " " + k * k * k + " = (x " + NEG + " " + k + ")(x² + " + k + "x + " + k * k + ")."); }
    if (d === 2) { var a = R(2, 5);
      return mkMC("Factorisez complètement P(x) = x³ " + NEG + " " + a * a + "x.", "x(x " + NEG + " " + a + ")(x + " + a + ")", ["x(x " + NEG + " " + a + ")²", "x(x² + " + a * a + ")", "(x " + NEG + " " + a + ")(x² " + NEG + " " + a * a + ")"], "Mettez d'abord x en facteur, puis reconnaissez x² " + NEG + " " + a * a + " = x² " + NEG + " a².", "P(x) = x(x² " + NEG + " " + a * a + ") = x(x " + NEG + " " + a + ")(x + " + a + ") : une factorisation peut en cacher une autre !"); }
    var k2 = R(1, 3);
    return mkMC("Combien de solutions réelles a l'équation x³ " + NEG + " " + 3 * k2 * k2 + "x = 0 ?", "3 : x = 0, puis x² = " + 3 * k2 * k2 + " donne x = ±" + k2 + SQ + "3", ["1 : seulement x = 0", "2 solutions", "0 solution"], "Mettez x en facteur : x(x² " + NEG + " " + 3 * k2 * k2 + ") = 0, puis résolvez la parenthèse.", "x = 0 OU x² = " + 3 * k2 * k2 + " : or x² = nombre positif a DEUX solutions. Total : 3 solutions."); } },
  "t-suitearith": { tag: "Première STI2D", label: "Suites arithmétiques", make: function (d) {
    if (d === 1) { var u0 = R(0, 20), r = NZ(-9, 9);
      return mkN("u est arithmétique de premier terme \\(u_{0}\\) = " + u0 + " et de raison r = " + r + ". Que vaut \\(u_{5}\\) ?", u0 + 5 * r, 0.01, "\\(u_{n}\\) = \\(u_{0}\\) + n × r : additionnez la raison 5 fois.", "\\(u_{5}\\) = " + u0 + " + 5 × " + attM(r) + " = " + (u0 + 5 * r) + "."); }
    if (d === 2) { var u1 = R(-20, 20), r2 = NZ(-5, 5), u4 = u1 + 3 * r2;
      return mkN("u est arithmétique : \\(u_{1}\\) = " + u1 + " et \\(u_{4}\\) = " + u4 + ". Quelle est la raison r ?", r2, 0.01, "De \\(u_{1}\\) à \\(u_{4}\\), il y a 3 sauts de raison : \\(u_{4}\\) = \\(u_{1}\\) + 3r.", "r = (" + u4 + " " + NEG + " " + u1 + ")/3 = " + r2 + "."); }
    var u0b = R(1, 10), r3 = pick([2, 3, 4, 5]), n = R(4, 9), V = u0b + n * r3;
    return mkN("u est arithmétique : \\(u_{0}\\) = " + u0b + " et r = " + r3 + ". Quel indice n vérifie \\(u_{n}\\) = " + V + " ?", n, 0.01, "\\(u_{n}\\) = \\(u_{0}\\) + n × r : résolvez " + u0b + " + " + r3 + "n = " + V + ".", V + " " + NEG + " " + u0b + " = " + (V - u0b) + " = " + r3 + " × n : n = " + n + "."); } },
  "t-suitegeo": { tag: "Première STI2D", label: "Suites géométriques", make: function (d) {
    if (d === 1) { var u0 = pick([1, 2, 5, 10]), q = pick([2, 3]);
      return mkN("u est géométrique de premier terme \\(u_{0}\\) = " + u0 + " et de raison q = " + q + ". Que vaut \\(u_{3}\\) ?", u0 * q * q * q, 0.01, "\\(u_{n}\\) = \\(u_{0}\\) × qⁿ : multipliez " + q + " trois fois.", "\\(u_{3}\\) = " + u0 + " × " + q + "³ = " + u0 * q * q * q + "."); }
    if (d === 2) { var q2 = pick([2, 3]), u1 = q2 === 3 ? R(1, 3) : R(1, 12);
      return mkN("u est géométrique : \\(u_{1}\\) = " + u1 + " et chaque terme est multiplié par " + q2 + ". Que vaut \\(u_{4}\\) ?", u1 * q2 * q2 * q2, 0.01, "\\(u_{4}\\) = \\(u_{1}\\) × q³.", "\\(u_{4}\\) = " + u1 + " × " + q2 + "³ = " + u1 * q2 * q2 * q2 + "."); }
    var q3 = pick([2, 3]), u1b = q3 === 3 ? R(1, 3) : R(1, 12), u4b = u1b * q3 * q3 * q3;
    return mkN("u est géométrique : \\(u_{1}\\) = " + u1b + " et \\(u_{4}\\) = " + u4b + ". Quelle est la raison q ?", q3, 0.01, "\\(u_{4}\\) = \\(u_{1}\\) × q³ : divisez \\(u_{4}\\) par \\(u_{1}\\) pour obtenir q³.", u4b + " ÷ " + u1b + " = " + (u4b / u1b) + " = " + q3 + "³ : q = " + q3 + "."); } },
  "t-suitegraph": { tag: "Première STI2D", label: "Suites sur un graphique", make: function (d) {
    if (d === 1) { var u0 = R(0, 10), r = NZ(-5, 5), ptsArr = []; for (var i = 0; i <= 4; i++) ptsArr.push({ x: i, y: u0 + i * r, label: i === 0 ? "u₀" : "" });
      return mkN("Le nuage de points représente les premiers termes d'une suite ARITHMÉTIQUE : quelle est sa raison ?", r, 0.01, "La raison est l'écart vertical entre deux points consécutifs.", "De \\(u_{0}\\) = " + u0 + " à \\(u_{1}\\) = " + (u0 + r) + " : la raison vaut " + r + ".", { graph: { curves: [], xmin: 0, xmax: 4, points: ptsArr } }); }
    if (d === 2) { var u0b = pick([1, 2]), q = pick([2, 3]), ptsArr2 = []; for (var j = 0; j <= 3; j++) ptsArr2.push({ x: j, y: u0b * Math.pow(q, j) });
      return mkN("Le nuage représente les premiers termes d'une suite GÉOMÉTRIQUE : quelle est sa raison ?", q, 0.01, "Divisez chaque terme par le précédent.", "\\(u_{1}\\)/\\(u_{0}\\) = " + (u0b * q) + "/" + u0b + " = " + q + " : raison q = " + q + ".", { graph: { curves: [], xmin: 0, xmax: 3, points: ptsArr2 } }); }
    var u0c = R(0, 10), r2 = NZ(-3, 3), ptsArr3 = []; for (var m = 0; m <= 4; m++) ptsArr3.push({ x: m, y: u0c + m * r2 });
    return mkN("Le nuage représente une suite arithmétique : lisez \\(u_{0}\\) et la raison, puis calculez \\(u_{10}\\).", u0c + 10 * r2, 0.01, "\\(u_{10}\\) = \\(u_{0}\\) + 10 × r.", "\\(u_{0}\\) = " + u0c + " et r = " + r2 + " : \\(u_{10}\\) = " + u0c + " + 10 × " + attM(r2) + " = " + (u0c + 10 * r2) + ".", { graph: { curves: [], xmin: 0, xmax: 4, points: ptsArr3 } }); } },
  "t-evolutions": { tag: "Première STI2D", label: "Évolutions successives et taux global", make: function (d) {
    if (d === 1) { var pp = pick([[25, -20, 0], [10, 10, 21], [20, 10, 32], [50, 50, 125], [25, 20, 50], [50, -20, 20], [20, -25, -10]]);
      return mkN("Le trésor du Baron évolue : " + (pp[0] >= 0 ? "hausse" : "baisse") + " de " + Math.abs(pp[0]) + " % puis " + (pp[1] >= 0 ? "hausse" : "baisse") + " de " + Math.abs(pp[1]) + " %. Quel est le taux d'évolution GLOBAL (en %, avec son signe) ?", pp[2], 0.01, "CM global = (1 + t1/100) × (1 + t2/100) ; taux = (CM " + NEG + " 1) × 100. Les taux ne s'additionnent PAS !", "CM = " + fr((1 + pp[0] / 100) * (1 + pp[1] / 100)) + " : taux global = " + pp[2] + " % (et non " + (pp[0] + pp[1]) + " % !)."); }
    if (d === 2) { var t = pick([10, 20, 50]);
      return mkN("Une hausse de " + t + " % suivie d'une baisse de " + t + " % : quel est le taux global (en %) ?", 0 - t * t / 100, 0.01, "CM = (1 + t/100)(1 " + NEG + " t/100) = 1 " + NEG + " t²/10000.", "CM = 1 " + NEG + " " + t * t + "/10000 : baisse globale de " + (t * t / 100) + " %. Une hausse puis la même baisse ne ramènent JAMAIS au point de départ : taux = " + attM(0 - t * t / 100) + " %."); }
    var pp3 = pick([[21, 10], [44, 20], [69, 30]]);
    return mkN("Sur l'année, un placement gagne " + pp3[0] + " % en DEUX semestres identiques : quel taux SEMESTRIEL t (en %) ?", pp3[1], 0.01, "(1 + t/100)² = 1 + " + pp3[0] + "/100 : quel nombre au carré donne " + fr(1 + pp3[0] / 100) + " ?", "1," + pp3[1] + "² = " + fr(1 + pp3[0] / 100) + " : chaque semestre gagne " + pp3[1] + " %."); } },
  "t-trigo2": { tag: "Première STI2D", label: "Valeurs remarquables des lignes trigonométriques", make: function (d) {
    if (d === 1) { var pp = pick([["cos(" + PI + "/3)", "1/2", [SQ + "3/2", SQ + "2/2", "1"]], ["sin(" + PI + "/6)", "1/2", [SQ + "3/2", "1", SQ + "2/2"]], ["cos(" + PI + "/4)", SQ + "2/2", ["1/2", SQ + "3/2", "1"]], ["sin(" + PI + "/3)", SQ + "3/2", [SQ + "2/2", "1/2", "1"]], ["cos(" + PI + "/6)", SQ + "3/2", ["1/2", SQ + "2/2", "1"]], ["tan(" + PI + "/4)", "1", ["0", SQ + "2/2", "1/2"]]]);
      return mkMC("Sans calculatrice : " + pp[0] + " = ?", pp[1], pp[2], "Mémorisez le tableau des valeurs remarquables sur le cercle.", pp[0] + " = " + pp[1] + "."); }
    if (d === 2) { var pp2 = pick([["sin(2" + PI + "/3)", SQ + "3/2", ["1/2", NEG + SQ + "3/2", SQ + "2/2"]], ["cos(2" + PI + "/3)", NEG + "1/2", ["1/2", NEG + SQ + "3/2", NEG + SQ + "2/2"]], ["sin(3" + PI + "/4)", SQ + "2/2", [NEG + SQ + "2/2", "1/2", "1"]], ["cos(3" + PI + "/4)", NEG + SQ + "2/2", [SQ + "2/2", "1/2", NEG + "1/2"]], ["sin(5" + PI + "/6)", "1/2", [NEG + "1/2", SQ + "3/2", SQ + "2/2"]]]);
      return mkMC("Deuxième quadrant ! " + pp2[0] + " = ?", pp2[1], pp2[2], "Utilisez les angles associés : sin(π " + NEG + " x) = sin x, cos(π " + NEG + " x) = " + NEG + "cos x.", pp2[0] + " = " + pp2[1] + " (par symétrie par rapport à l'axe des ordonnées)."); }
    var pp3 = pick([["cos(0) + sin(" + PI + "/2)", "2", ["1", "0", "1/2"]], ["sin(" + PI + "/2) " + NEG + " cos(0)", "0", ["1", "2", NEG + "1"]], ["cos(" + PI + "/3) + sin(" + PI + "/6)", "1", ["1/2", "2", "3/2"]], ["sin(" + PI + "/6) × cos(" + PI + "/3)", "1/4", ["1/2", "1/3", "1"]], ["cos(" + PI + ") + sin(" + PI + "/2)", "0", ["1", NEG + "1", "2"]], ["sin(" + PI + "/4) × sin(" + PI + "/4)", "1/2", [SQ + "2/2", "1", "1/4"]]]);
    return mkMC("Petit calcul trigonométrique : " + pp3[0] + " = ?", pp3[1], pp3[2], "Décomposez : chaque valeur séparément, puis l'opération.", pp3[0] + " = " + pp3[1] + "."); } },
  "t-scalaire": { tag: "Première STI2D", label: "Produit scalaire et orthogonalité", make: function (d) {
    if (d === 1) { var a = NZ(-6, 6), b = NZ(-6, 6), c = NZ(-6, 6), e = NZ(-6, 6);
      return mkN("u" + pts(a, b) + " et v" + pts(c, e) + " : calculez le produit scalaire u·v.", a * c + b * e, 0.01, "u·v = xU × xV + yU × yV (somme des produits coordonnée par coordonnée).", "u·v = " + attM(a) + " × " + attM(c) + " + " + attM(b) + " × " + attM(e) + " = " + (a * c + b * e) + "."); }
    if (d === 2) { var a2 = NZ(-5, 5), b2 = NZ(-5, 5), orth = pick([true, false]), c2, e2;
      if (orth) { c2 = 0 - b2; e2 = a2; } else { c2 = NZ(-5, 5); e2 = NZ(-5, 5); while (a2 * c2 + b2 * e2 === 0) { c2 = NZ(-5, 5); e2 = NZ(-5, 5); } }
      var dot = a2 * c2 + b2 * e2;
      return mkMC("u" + pts(a2, b2) + " et v" + pts(c2, e2) + " : ces deux vecteurs sont-ils orthogonaux ?", dot === 0 ? "Oui : u·v = 0" : "Non : u·v = " + dot, dot === 0 ? ["Non : u·v = " + (a2 * c2 - b2 * e2), "On ne peut pas savoir sans les normes", "Non : deux vecteurs de coordonnées entières ne sont jamais orthogonaux"] : ["Oui : u·v = 0", "Oui, car leurs normes sont égales", "Non : u·v = " + (a2 * c2 - b2 * e2)], "Calculez u·v : orthogonal ⟺ u·v = 0.", "u·v = " + attM(a2) + " × " + attM(c2) + " + " + attM(b2) + " × " + attM(e2) + " = " + dot + (dot === 0 ? " : orthogonaux !" : " ≠ 0 : pas orthogonaux.")); }
    var a3 = NZ(-6, 6), b3 = NZ(-6, 6); while (a3 === b3 || a3 + b3 === 0) { a3 = NZ(-6, 6); b3 = NZ(-6, 6); }
    return mkMC("Quel vecteur est orthogonal à u" + pts(a3, b3) + " ?", pts(0 - b3, a3), [pts(b3, a3), pts(a3, b3), pts(0 - a3, 0 - b3)], "Cherchez v(x ; y) tel que u·v = " + attM(a3) + "x + " + attM(b3) + "y = 0 : essayez d'échanger les coordonnées.", "u·(" + attM(0 - b3) + " ; " + attM(a3) + ") = " + attM(a3) + " × " + attM(0 - b3) + " + " + attM(b3) + " × " + attM(a3) + " = 0 : v" + pts(0 - b3, a3) + " convient (les deux autres sont colinéaires à u !)."); } },
  "t-proba3": { tag: "Première STI2D", label: "Probabilités : opposé et indépendance", make: function (d) {
    if (d === 1) { var r = R(2, 6), b = R(2, 6); while (b === r) b = R(2, 6); var n = r + b;
      return mkMC("Une urne contient " + r + " boules rouges et " + b + " boules bleues. Quelle est la probabilité de tirer une boule ROUGE ?", fracS(r, n), [fracS(b, n), fracS(r, b), "1"], "P = cas favorables / cas possibles.", "P(rouge) = " + r + "/" + n + " = " + fracS(r, n) + "."); }
    if (d === 2) { var pp = pick([["1/4", "3/4"], ["1/3", "2/3"], ["1/5", "4/5"], ["2/5", "3/5"], ["1/10", "9/10"]]);
      return mkMC("Un événement A a pour probabilité P(A) = " + pp[0] + ". Que vaut la probabilité de l'événement contraire Ā ?", pp[1], [pp[0], "1", "0"], "P(Ā) = 1 " + NEG + " P(A).", "P(Ā) = 1 " + NEG + " " + pp[0] + " = " + pp[1] + "."); }
    var pp3 = pick([["1/2", "1/3", "1/6", "5/6", "1/2", "2/3"], ["1/2", "1/4", "1/8", "3/4", "1/2", "1/6"], ["1/3", "1/3", "1/9", "2/3", "1/6", "1/3"], ["1/2", "1/2", "1/4", "1", "1/2", "1/8"], ["1/4", "1/3", "1/12", "7/12", "1/2", "1/7"]]);
    return mkMC("A et B sont INDÉPENDANTS, avec P(A) = " + pp3[0] + " et P(B) = " + pp3[1] + ". Que vaut P(A ∩ B) ?", pp3[2], [pp3[3], pp3[4], pp3[5]], "Indépendants ⟹ P(A ∩ B) = P(A) × P(B).", "P(A ∩ B) = " + pp3[0] + " × " + pp3[1] + " = " + pp3[2] + " (et non la somme " + pp3[3] + " !)."); } },
  "t-graphtaux": { tag: "Première STI2D", label: "Taux d'accroissement lu sur un graphique", make: function (d) {
    if (d === 1) { var a = pick([1, 2, 3]), sl = 2 * a + 1;
      return mkN("La corde tracée relie A et B sur la courbe de f(x) = x² : quel est son coefficient directeur (taux d'accroissement entre x = " + a + " et x = " + (a + 1) + ") ?", sl, 0.01, "Taux = (f(b) " + NEG + " f(a))/(b " + NEG + " a).", "(" + (a + 1) * (a + 1) + " " + NEG + " " + a * a + ")/" + 1 + " = " + sl + ".", { graph: { curves: [{ fn: function (x) { return x * x; }, color: "#0e8f82" }, { fn: function (x) { return sl * x + (a * a - sl * a); }, color: "#c97900" }], xmin: 0, xmax: a + 2, points: [{ x: a, y: a * a, label: "A" }, { x: a + 1, y: (a + 1) * (a + 1), label: "B" }] } }); }
    if (d === 2) { var x0 = R(0, 5), h = pick([1, 2]);
      return mkN("f(x) = x² : quel est le taux d'accroissement entre x = " + x0 + " et x = " + (x0 + h) + " ?", 2 * x0 + h, 0.01, "Taux = (f(x0 + h) " + NEG + " f(x0))/h.", "((" + (x0 + h) * (x0 + h) + " " + NEG + " " + x0 * x0 + ")/" + h + ") = " + (2 * x0 + h) + "."); }
    var k = pick([10, 20, 50, 100]);
    return mkN("f(x) = " + k + "/x : quel est le taux d'accroissement entre x = 1 et x = 2 ?", 0 - k / 2, 0.01, "Taux = (f(2) " + NEG + " f(1))/(2 " + NEG + " 1).", "f(1) = " + k + ", f(2) = " + fr(k / 2) + " : taux = " + fr(k / 2) + " " + NEG + " " + k + " = " + attM(0 - k / 2) + ".", { graph: { curves: [{ fn: function (x) { return k / x; }, color: "#0e8f82" }], xmin: 0.5, xmax: 4, points: [{ x: 1, y: k, label: "A" }, { x: 2, y: k / 2, label: "B" }] } }); } },
  "t-graphineq2": { tag: "Première STI2D", label: "Inéquations du second degré (résolution graphique)", make: function (d) {
    if (d === 1) { var k = pick([4, 9]), m = pick([1, 4]), sm = m === 1 ? 1 : 2;
      return mkMC("La courbe représente f(x) = " + k + " " + NEG + " x². Pour quels x a-t-on f(x) ≥ " + (k - m) + " ?", "[" + attM(0 - sm) + " ; " + sm + "]", ["[" + attM(0 - 2 * sm) + " ; " + 2 * sm + "]", "]" + NEG + "∞ ; " + attM(0 - sm) + "]", "[" + attM(0 - sm) + " ; 0]"], "Résolvez " + k + " " + NEG + " x² = " + (k - m) + " : la parabole est au-dessus du seuil entre les deux solutions.", k + " " + NEG + " x² ≥ " + (k - m) + " ⟺ x² ≤ " + m + " ⟺ x ∈ [" + attM(0 - sm) + " ; " + sm + "].", { graph: { curves: [{ fn: function (x) { return k - x * x; }, color: "#0e8f82" }], xmin: -3, xmax: 3, points: [{ x: sm, y: k - m, label: "(" + sm + " ; " + (k - m) + ")" }] } }); }
    if (d === 2) { var k2 = pick([4, 9]), rk = k2 === 4 ? 2 : 3;
      return mkMC("La courbe représente f(x) = " + k2 + " " + NEG + " x². Pour quels x a-t-on f(x) > 0 ?", "]" + attM(0 - rk) + " ; " + rk + "[", ["[" + attM(0 - rk) + " ; " + rk + "]", "]" + NEG + "∞ ; 0]", "[" + attM(0 - rk - 1) + " ; " + (rk + 1) + "["], "Cherchez où la parabole est AU-DESSUS de l'axe des abscisses : les racines sont ±" + SQ + k2 + " = ±" + rk + ".", k2 + " " + NEG + " x² > 0 ⟺ x² < " + k2 + " : strictement entre les racines " + attM(0 - rk) + " et " + rk + " (crochets OUVERTS : f ne doit pas s'annuler).", { graph: { curves: [{ fn: function (x) { return k2 - x * x; }, color: "#0e8f82" }], xmin: -rk - 2, xmax: rk + 2, points: [{ x: rk, y: 0, label: String(rk) }, { x: 0 - rk, y: 0, label: attM(0 - rk) }] } }); }
    var m2 = pick([4, 9]), rm = m2 === 4 ? 2 : 3;
    return mkMC("La courbe représente f(x) = x² " + NEG + " " + m2 + ". Pour quels x a-t-on f(x) ≤ 0 ?", "[" + attM(0 - rm) + " ; " + rm + "]", ["]" + attM(0 - rm) + " ; " + rm + "[", "]" + NEG + "∞ ; " + attM(0 - rm) + "] ∪ [" + rm + " ; +∞[", "[0 ; " + rm + "]"], "Cette parabole sourit à l'envers (a > 0) : elle est sous l'axe ENTRE ses racines.", "x² ≤ " + m2 + " ⟺ x ∈ [" + attM(0 - rm) + " ; " + rm + "] (crochets FERMÉS : f peut s'annuler).", { graph: { curves: [{ fn: function (x) { return x * x - m2; }, color: "#0e8f82" }], xmin: -rm - 2, xmax: rm + 2, points: [{ x: rm, y: 0, label: String(rm) }, { x: 0 - rm, y: 0, label: attM(0 - rm) }] } }); } },
  "t-comparaison": { tag: "Première STI2D", label: "Comparer deux droites (position relative)", make: function (d) {
    var xi = R(0, 2), yi = R(1, 4), m1 = R(1, 3), m2 = 0 - R(1, 3), p1 = yi - m1 * xi, p2 = yi - m2 * xi;
    var eq = function (mm, pp) { var s = "y = "; if (mm === 1) s += "x"; else if (mm === -1) s += NEG + "x"; else s += attM(mm) + "x"; if (pp !== 0) s += pp > 0 ? " + " + pp : " " + NEG + " " + (0 - pp); return s; };
    if (d === 1) return mkMC("Deux droites du plan de surveillance : d1 : " + eq(m1, p1) + " et d2 : " + eq(m2, p2) + ". Laquelle croît le plus vite ?", "d1 : son coefficient directeur " + m1 + " est supérieur à " + attM(m2), ["d2 : son coefficient directeur " + attM(m2) + " est supérieur", "Elles croissent à la même vitesse", "Impossible à dire sans les tracer"], "Le coefficient directeur donne la pente : comparez " + m1 + " et " + attM(m2) + ".", "Une droite monte d'autant plus vite que son coefficient directeur est grand : ici " + m1 + " > " + attM(m2) + ", donc d1."); 
    if (d === 2) return mkN("Les droites d1 : " + eq(m1, p1) + " et d2 : " + eq(m2, p2) + " se coupent : en quelle ABSCISSE xi ?", xi, 0.01, "Résolvez " + eq(m1, p1) + " = " + eq(m2, p2) + ", c'est-à-dire " + attM(m1) + "x " + (p1 > 0 ? "+ " + p1 : NEG + " " + (0 - p1)) + " = " + attM(m2) + "x " + (p2 > 0 ? "+ " + p2 : NEG + " " + (0 - p2)) + ".", m1 + "x " + (p1 > 0 ? "+ " + p1 : NEG + " " + (0 - p1)) + " = " + attM(m2) + "x " + (p2 > 0 ? "+ " + p2 : NEG + " " + (0 - p2)) + " ⟺ " + (m1 - m2) + "x = " + (p2 - p1) + " ⟺ x = " + xi + ".", { graph: { curves: [{ fn: function (x) { return m1 * x + p1; }, color: "#0e8f82" }, { fn: function (x) { return m2 * x + p2; }, color: "#d2455f" }], xmin: -1, xmax: 4, points: [{ x: xi, y: yi, label: "I" }] } });
    return mkMC("Toujours d1 : " + eq(m1, p1) + " et d2 : " + eq(m2, p2) + " : pour x > " + xi + ", quelle droite est AU-DESSUS de l'autre ?", "d1 : après l'intersection, la droite au coefficient directeur le plus grand repasse devant", ["d2", "Elles sont confondues", "Cela dépend de la valeur de x"], "Après le point d'intersection x = " + xi + ", la droite la plus pentue grimpe plus vite.", "d1 a la plus grande pente (" + m1 + " > " + attM(m2) + ") : pour x > " + xi + ", d1 est au-dessus de d2."); } },
  "t-rotation": { tag: "Première STI2D", label: "Rotations et coordonnées", make: function (d) {
    if (d === 1) { var x = NZ(-5, 5), y = NZ(-5, 5); while (x + y === 0 || x === y) { x = NZ(-5, 5); y = NZ(-5, 5); }
      return mkMC("M" + pts(x, y) + " subit la rotation de centre O et d'angle +π/2 (sens direct) : quelle est l'image M' ?", pts(0 - y, x), [pts(y, 0 - x), pts(x, 0 - y), pts(0 - x, 0 - y)], "Rotation de +π/2 : (x ; y) → (" + NEG + "y ; x).", "M' = " + pts(0 - y, x) + " : l'abscisse devient " + attM(0 - y) + " et l'ordonnée devient " + attM(x) + "."); }
    if (d === 2) { var x2 = NZ(-5, 5), y2 = NZ(-5, 5); while (x2 + y2 === 0) { x2 = NZ(-5, 5); y2 = NZ(-5, 5); }
      return mkMC("M" + pts(x2, y2) + " subit la rotation de centre O et d'angle π : quelle est l'image M' ?", pts(0 - x2, 0 - y2), [pts(x2, 0 - y2), pts(0 - x2, y2), pts(y2, x2)], "Une rotation d'angle π est la symétrie centrale.", "M' = " + pts(0 - x2, 0 - y2) + " : chaque coordonnée devient son opposée."); }
    var pr = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]]);
    return mkN("M" + pts(pr[0], pr[1]) + " subit une rotation de centre O et d'angle 3π/4 (sens direct). Que vaut la distance OM' ?", pr[2], 0.01, "Une rotation conserve les distances : OM' = OM.", "OM = " + SQ + "(" + pr[0] + "² + " + pr[1] + "²) = " + SQ + (pr[0] * pr[0] + pr[1] * pr[1]) + " = " + pr[2] + ", et la rotation ne change rien : OM' = " + pr[2] + "."); } },
  "t-angles-orientes": { tag: "Première STI2D", label: "Angles orientés de vecteurs", make: function (d) {
    if (d === 1) { var al = pick([30, 45, 60, 120]);
      return mkMC("L'angle orienté (OA ; OB) mesure +" + al + "° : que mesure l'angle orienté (OB ; OA) ?", NEG + al + "° (on échange les vecteurs : le sens de parcours s'inverse)", ["+" + al + "°", "+" + (al + 180) + "°", "+" + (360 - al) + "°"], "Échanger les vecteurs inverse le sens de parcours.", "(OB ; OA) = " + NEG + al + "° : même écartage, sens opposé."); }
    if (d === 2) { var a2 = pick([PI + "/6", PI + "/4", PI + "/3", PI + "/2"]);
      return mkMC("L'angle orienté (u ; v) mesure " + a2 + ". Que mesure (" + NEG + "u ; v) ?", a2 + " + " + PI, [a2, a2 + " + " + PI + "/2", PI + " " + NEG + " " + a2], "Remplacer un vecteur par son opposé tourne la flèche d'un demi-tour : +π.", "(" + NEG + "u ; v) = (u ; v) + " + PI + " = " + a2 + " + " + PI + "."); }
    var pp = pick([
      ["3" + PI + "/2", NEG + PI + "/2", PI + "/2"],
      ["5" + PI + "/3", NEG + PI + "/3", "2" + PI + "/3"],
      ["4" + PI + "/3", NEG + "2" + PI + "/3", PI + "/3"],
      ["7" + PI + "/6", NEG + "5" + PI + "/6", PI + "/6"],
      ["5" + PI + "/4", NEG + "3" + PI + "/4", PI + "/4"],
      ["11" + PI + "/6", NEG + PI + "/6", "5" + PI + "/6"]
    ]);
    return mkMC("Quelle est la mesure PRINCIPALE (dans ]" + NEG + "π ; π]) de l'angle orienté de mesure " + pp[0] + " ?", pp[1], [pp[2] + " (obtenu en retirant π)", pp[0] + " — c'est déjà la mesure principale", PI], "La mesure principale vit dans ]" + NEG + "π ; π] : retirez 2π si la mesure dépasse π.", pp[0] + " " + NEG + " 2" + PI + " = " + pp[1] + "."); } },
  "t-associes": { tag: "Première STI2D", label: "Angles et lignes trigonométriques associés", make: function (d) {
    if (d === 1) { var pp = pick([["cos(" + NEG + "x)", "cos(x) : le cosinus est PAIR", ["−cos(x)", "sin(x)", NEG + "sin(x)"]], ["sin(" + NEG + "x)", NEG + "sin(x) : le sinus est IMPAIR", ["sin(x)", "cos(x)", NEG + "cos(x)"]]]);
      return mkMC("Simplifiez : " + pp[0] + " = ?", pp[1], pp[2], "Testez avec x = " + PI + "/6 sur votre cercle : la symétrie par rapport à l'axe des abscisses ne change pas la projection horizontale.", pp[0] + " = " + pp[1] + "."); }
    if (d === 2) { var pp2 = pick([["sin(" + PI + " − x)", "sin(x)", [NEG + "sin(x)", "cos(x)", NEG + "cos(x)"]], ["cos(" + PI + " − x)", NEG + "cos(x)", ["cos(x)", "sin(x)", NEG + "sin(x)"]]]);
      return mkMC("Simplifiez : " + pp2[0] + " = ?", pp2[1], pp2[2], "π − x est le symétrique de x par rapport à l'axe des ordonnées.", pp2[0] + " = " + pp2[1] + " (symétrie par rapport à (Oy))."); }
    var pp3 = pick([["cos(" + PI + " + x)", NEG + "cos(x)", ["cos(x)", NEG + "sin(x)", "sin(x)"]], ["sin(" + PI + "/2 " + NEG + " x)", "cos(x)", [NEG + "cos(x)", "sin(x)", NEG + "sin(x)"]], ["cos(" + PI + "/2 + x)", NEG + "sin(x)", ["sin(x)", NEG + "cos(x)", "cos(x)"]], ["sin(" + PI + " + x)", NEG + "sin(x)", ["sin(x)", NEG + "cos(x)", "cos(x)"]]]);
    return mkMC("Simplifiez : " + pp3[0] + " = ?", pp3[1], pp3[2], "Sur le cercle : π + x est le point opposé à x ; π/2 ± x échange sinus et cosinus.", pp3[0] + " = " + pp3[1] + "."); } },
  "t-eqtrigo": { tag: "Première STI2D", label: "Équations trigonométriques", make: function (d) {
    if (d === 1) { var pp = pick([["1/2", PI + "/3", [PI + "/6", PI + "/4", "2" + PI + "/3"]], [SQ + "2/2", PI + "/4", [PI + "/3", PI + "/6", "3" + PI + "/4"]], [SQ + "3/2", PI + "/6", [PI + "/3", PI + "/4", "5" + PI + "/6"]], [NEG + "1/2", "2" + PI + "/3", [PI + "/3", "3" + PI + "/4", PI + "/6"]], [NEG + SQ + "2/2", "3" + PI + "/4", [PI + "/4", "2" + PI + "/3", PI + "/2"]]]);
      return mkMC("Résolvez cos x = " + pp[0] + " sur [0 ; " + PI + "] : quelle est la solution ?", pp[1], pp[2], "Sur [0 ; π], le cosinus décroît de 1 à " + NEG + "1 : chaque valeur n'est atteinte qu'UNE fois.", "cos x = " + pp[0] + " ⟺ x = " + pp[1] + " sur [0 ; π]."); }
    if (d === 2) { var pp2 = pick([["1/2", PI + "/6 et 5" + PI + "/6", [PI + "/6 et 7" + PI + "/6", PI + "/6 seulement", PI + "/6 et 3" + PI + "/4"]], [SQ + "2/2", PI + "/4 et 3" + PI + "/4", [PI + "/4 et 5" + PI + "/4", PI + "/4 seulement", PI + "/4 et 2" + PI + "/3"]], [SQ + "3/2", PI + "/3 et 2" + PI + "/3", [PI + "/3 et 4" + PI + "/3", PI + "/3 seulement", PI + "/3 et 3" + PI + "/4"]]]);
      return mkMC("Résolvez sin x = " + pp2[0] + " sur [0 ; 2" + PI + "[ : quelles sont les solutions ?", pp2[1], pp2[2], "Le sinus atteint une même valeur DEUX fois par tour (montée puis descente).", "sin x = " + pp2[0] + " ⟺ x = " + pp2[1] + " sur [0 ; 2π[ (symétrie par rapport à x = π/2)."); }
    var pp3 = pick([["−1/2", "2π/3 + 2kπ ou −2π/3 + 2kπ", "2π/3 + kπ", "±π/3 + 2kπ", "2π/3 seulement"], ["−√2/2", "3π/4 + 2kπ ou −3π/4 + 2kπ", "3π/4 + kπ", "±π/4 + 2kπ", "3π/4 seulement"], ["−√3/2", "5π/6 + 2kπ ou −5π/6 + 2kπ", "5π/6 + kπ", "±π/6 + 2kπ", "5π/6 seulement"]]);
    return mkMC("Résolvez dans ℝ : cos x = " + pp3[0] + ". Quelle famille de solutions est correcte ?", pp3[1], [pp3[2], pp3[3], pp3[4]], "Le cosinus est 2π-périodique et pair : deux solutions de base par tour, puis + 2kπ.", "cos x = " + pp3[0] + " ⟺ x = " + pp3[1] + " : le cosinus est PAIR (±) et 2π-PÉRIODIQUE (+2kπ), pas π-périodique !"); } },
  "t-ineqtrigo": { tag: "Première STI2D", label: "Inéquations trigonométriques", make: function (d) {
    if (d === 1) return mkMC("Résolvez cos x ≥ 1/2 sur [0 ; 2π[.", "[0 ; π/3] ∪ [5π/3 ; 2π[", ["[π/3 ; 5π/3]", "[0 ; π/3] seulement", "[π/3 ; 2π/3]"], "Le cosinus est grand (≥ 1/2) près de 0 et de 2π.", "cos x ≥ 1/2 entre 0 et π/3, puis de 5π/3 à 2π : le cosinus est maximal en 0.", { graph: { curves: [{ fn: function (x) { return Math.cos(x); }, color: "#0e8f82" }], xmin: 0, xmax: 2 * Math.PI, ymin: -1.5, ymax: 1.5 } });
    if (d === 2) return mkMC("Résolvez sin x ≤ √2/2 sur [0 ; 2π[.", "[0 ; π/4] ∪ [3π/4 ; 2π[", ["]π/4 ; 3π/4[", "[0 ; π/4] seulement", "[π/4 ; 3π/4]"], "Le sinus dépasse √2/2 seulement entre π/4 et 3π/4 (au sommet du cercle).", "sin x ≤ √2/2 partout SAUF sur ]π/4 ; 3π/4[ où le sinus grimpe trop haut.", { graph: { curves: [{ fn: function (x) { return Math.sin(x); }, color: "#0e8f82" }], xmin: 0, xmax: 2 * Math.PI, ymin: -1.5, ymax: 1.5 } });
    var pp = pick([["−√2/2", "3π/4", "5π/4", "7π/4"], ["−1/2", "2π/3", "4π/3", "5π/3"], ["−√3/2", "5π/6", "7π/6", "11π/6"]]);
    return mkMC("Résolvez cos x < " + pp[0] + " sur [0 ; 2π[.", "]" + pp[1] + " ; " + pp[2] + "[", ["[" + pp[1] + " ; " + pp[2] + "]", "]" + pp[2] + " ; " + pp[3] + "[", "]" + PI + " ; " + pp[1] + "["], "Le cosinus passe SOUS la valeur donnée autour de π.", "cos x < " + pp[0] + " strictement entre " + pp[1] + " et " + pp[2] + " (crochets OUVERTS : inégalité stricte).", { graph: { curves: [{ fn: function (x) { return Math.cos(x); }, color: "#0e8f82" }], xmin: 0, xmax: 2 * Math.PI, ymin: -1.5, ymax: 1.5 } }); } },
  "t-courbetrigo": { tag: "Première STI2D", label: "Courbes de sinus et cosinus", make: function (d) {
    if (d === 1) return mkMC("La courbe tracée est celle de la fonction sinus. Quelle est sa période ?", "2" + PI, [PI, PI + "/2", "4" + PI], "La courbe se répète identique à elle-même tous les 2π.", "La sinusoïde parcourt un tour complet du cercle en 2π : période 2π.", { graph: { curves: [{ fn: function (x) { return Math.sin(x); }, color: "#0e8f82" }], xmin: 0, xmax: 2 * Math.PI, ymin: -1.5, ymax: 1.5 } });
    if (d === 2) return mkMC("On sait que cos(" + NEG + "x) = cos(x). Que peut-on dire de la courbe du cosinus ?", "Elle est symétrique par rapport à l'axe des ordonnées (fonction paire)", ["Elle est symétrique par rapport à l'origine (fonction impaire)", "Elle est périodique de période π", "Elle est identique à la courbe du sinus"], "cos(" + NEG + "x) = cos(x) est la définition d'une fonction paire.", "Fonction paire ⟹ symétrie axiale autour de (Oy).", { graph: { curves: [{ fn: function (x) { return Math.cos(x); }, color: "#0e8f82" }], xmin: -2 * Math.PI, xmax: 2 * Math.PI, ymin: -1.5, ymax: 1.5 } });
    return mkMC("Que vaut sin(x + " + PI + "/2) ?", "cos(x) : la courbe du cosinus est celle du sinus décalée de π/2 vers la gauche", ["sin(x)", NEG + "cos(x)", NEG + "sin(x)"], "Faites le calcul en x = 0 : sin(π/2) = 1 = cos(0).", "sin(x + π/2) = cos(x) : un décalage de π/2 transforme le sinus en cosinus.", { graph: { curves: [{ fn: function (x) { return Math.sin(x); }, color: "#0e8f82" }, { fn: function (x) { return Math.cos(x); }, color: "#c97900" }], xmin: 0, xmax: 2 * Math.PI, ymin: -1.5, ymax: 1.5 } }); } },
  "t-euler": { tag: "Première STI2D", label: "Primitives et méthode d'Euler", make: function (d) {
    if (d === 1) { var pp = pick([["2x", "x²", ["x", "2x²", "2"]], ["3x²", "x³", ["3x³", "x²", "3x"]], ["x", "x²/2", ["x²", "2x", "x"]], ["2x + 1", "x² + x", ["x² + 1", "2x", "x² + 2x"]], ["4", "4x", ["4", "x⁴", "4x²"]]]);
      return mkMC("f(x) = " + pp[0] + " : laquelle de ces expressions est une primitive F de f (avec F' = f) ?", pp[1], pp[2], "Cherchez F telle que F' = f : dérivez chaque candidate pour vérifier.", "F(x) = " + pp[1] + " se dérive en " + pp[0] + " = f(x) : c'est une primitive de f."); }
    if (d === 2) { var c = pick([2, 4, 6, 8]), F0 = pick([1, 2, 3]);
      return mkN("f(x) = x + " + c + " et F est une primitive de f avec F(0) = " + F0 + ". La méthode d'Euler avec un pas h = 0,5 donne F(0,5) ≈ F(0) + h × f(0). Que vaut cette approximation ?", F0 + 0.5 * c, 0.01, "Calculez d'abord f(0) = 0 + " + c + " = " + c + ".", "F(0,5) ≈ " + F0 + " + 0,5 × " + c + " = " + fr(F0 + 0.5 * c) + " : on avance le long de la tangente de pente f(0)."); }
    var k = pick([2, 4, 6, 8]);
    return mkN("Méthode d'Euler en DEUX pas de h = 0,5 : on part de F(0) = 0 avec f(x) = " + k + "x. Quelle approximation obtient-on pour F(1) ? (La vraie primitive F(x) = " + k + "x²/2 est tracée en pointillés sur le graphique.)", 0.25 * k, 0.01, "Étape 1 : F(0,5) ≈ F(0) + 0,5 × f(0). Étape 2 : F(1) ≈ F(0,5) + 0,5 × f(0,5).", "f(0) = 0 donc F(0,5) ≈ 0 ; puis f(0,5) = " + fr(0.5 * k) + " donc F(1) ≈ 0 + 0,5 × " + fr(0.5 * k) + " = " + fr(0.25 * k) + ". La vraie valeur est " + fr(0.5 * k) + " : Euler approche par des petits segments de tangente.", { graph: { curves: [{ fn: function (x) { return 0.5 * k * x * x; }, color: "#8a7a52" }], xmin: 0, xmax: 1.5, points: [{ x: 0, y: 0, label: "F(0)" }, { x: 0.5, y: 0, label: "A1" }, { x: 1, y: 0.25 * k, label: "A2" }] } }); } },
  "x-trinome": { tag: "Première STI2D", label: "L'enquête du trinôme (du brut au factorisé)", make: function (d) {
    if (d === 1) { var r1 = NZ(-5, 5), r2 = NZ(-5, 5); while (r2 === r1) r2 = NZ(-5, 5);
      return mkMC("Enquête : f(x) = " + polyS(trin2(r1, r2)) + ". Le détective a repéré que f(" + r1 + ") = 0 et f(" + r2 + ") = 0. Quelle est la forme FACTORISÉE de f ?", binF(1, 0 - r1) + binF(1, 0 - r2), [binF(1, r1) + binF(1, r2), binF(1, 0 - r1) + binF(1, r2), binF(1, r1) + binF(1, 0 - r2)], "Si f(r) = 0, alors (x " + NEG + " r) est un facteur de f.", "f(x) = (x " + NEG + " " + r1 + ")(x " + NEG + " " + r2 + ") : les racines deviennent les facteurs."); }
    if (d === 2) { var r3 = R(-6, 1), k = R(1, 3); while (r3 + k === 0) r3 = R(-6, 1); var r4 = r3 + 2 * k, mid = r3 + k, tr = trin2(r3, r4);
      return mkN("L'enquête se corse : f(x) = " + polyS(tr) + ". Calculez α = " + NEG + "b/(2a), puis β = f(α) : quelle est l'ordonnée β du sommet S ?", -k * k, 0.01, "α = " + NEG + "b/(2a) avec b = " + attM(tr[1]) + " ; puis remplacez x par α dans f.", "α = " + mid + " et β = f(" + mid + ") = " + attM(-k * k) + " : le sommet est S" + pts(mid, -k * k) + ".", { graph: parabGraph(r3, r4, { points: [{ x: mid, y: -k * k, label: "S" }] }) }); }
    var u = R(2, 5);
    return mkN("Le projectile du Baron part du sol : h(t) = " + NEG + "5t² + " + 5 * u + "t (h en mètres, t en secondes). Au bout de combien de secondes retombe-t-il au SOL (h = 0, hors instant du départ) ?", u, 0.01, "Factorisez par t : h(t) = 5t(" + u + " " + NEG + " t), puis résolvez l'équation produit-nul.", "5t(" + u + " " + NEG + " t) = 0 ⟺ t = 0 (départ) ou t = " + u + " : le projectile retombe à t = " + u + " s. Factorisation + produit-nul : l'arme de tout enquêteur !"); } },
  "x-derivee": { tag: "Première STI2D", label: "Mission optimisation : l'enclos du Baron", make: function (d) {
    var L = 4 * R(8, 15);
    if (d === 1) { var xa = R(2, Math.floor(L / 4) - 1);
      return mkN("Le Baron dispose de " + L + " m de grillage pour un enclos adossé à un mur (seuls 3 côtés sont grillagés). Pour une largeur x = " + xa + " m, l'aire vaut A(x) = x(" + L + " " + NEG + " 2x) : quelle est-elle (en m²) ?", xa * (L - 2 * xa), 0.01, "Remplacez x par " + xa + " dans A(x) = x(" + L + " " + NEG + " 2x).", "A(" + xa + ") = " + xa + " × (" + L + " " + NEG + " " + 2 * xa + ") = " + xa * (L - 2 * xa) + " m²."); }
    if (d === 2) return mkMC("Toujours avec " + L + " m de grillage : A(x) = x(" + L + " " + NEG + " 2x). Quelle est sa forme DÉVELOPPÉE ?", polyS([-2, L, 0]), [polyS([-2, L]), polyS([2, 0 - L, 0]), polyS([-2, 0, L])], "Double distributivité : x × " + L + " " + NEG + " x × 2x.", "A(x) = " + L + "x " + NEG + " 2x² = " + polyS([-2, L, 0]) + ".");
    return mkN("Dernière étape : A(x) = " + polyS([-2, L, 0]) + ". La dérivée vaut A'(x) = " + L + " " + NEG + " 4x. Pour quelle largeur x (en m) l'aire est-elle MAXIMALE ?", L / 4, 0.01, "Cherchez où A' s'annule en changeant de signe : " + L + " " + NEG + " 4x = 0.", "A'(x) = 0 ⟺ x = " + L + "/4 = " + L / 4 + " : A passe par un maximum (A' > 0 avant, < 0 après). Amax = " + (L / 4) + " × " + (L / 2) + " = " + (L * L / 8) + " m². Modéliser, dériver, conclure !"); } },
  "x-phare": { tag: "Première STI2D", label: "Le faisceau du phare : rotation, vecteurs, angles", make: function (d) {
    if (d === 1) { var x = NZ(-5, 5), y = NZ(-5, 5); while (x + y === 0) { x = NZ(-5, 5); y = NZ(-5, 5); }
      return mkN("Le faisceau du phare tourne de +π/2 (sens direct) autour de la lampe O. Le point visé M" + pts(x, y) + " se retrouve en M' : quelle est l'ABSCISSE de M' ?", 0 - y, 0.01, "Rotation de +π/2 : (x ; y) → (" + NEG + "y ; x).", "M' = " + pts(0 - y, x) + " : abscisse " + attM(0 - y) + ".", { graph: { curves: [], xmin: -6, xmax: 6, ymin: -6, ymax: 6, points: [{ x: x, y: y, label: "M" }, { x: 0 - y, y: x, label: "M'", color: "#0e8f82" }] } }); }
    if (d === 2) { var pp = pick([[PI + "/3", 0.5], [PI + "/2", 0], [PI, -1]]);
      return mkN("Le faisceau pointe l'EST : u(1 ; 0). Le regard du gardien v fait un angle de " + pp[0] + " avec u, et ‖u‖ = ‖v‖ = 1. Que vaut le produit scalaire u·v = ‖u‖ × ‖v‖ × cos(" + pp[0] + ") ?", pp[1], 0.01, "u·v = ‖u‖ ‖v‖ cos θ avec θ l'angle entre les deux vecteurs.", "u·v = 1 × 1 × cos(" + pp[0] + ") = " + fr(pp[1]) + " : quand θ = π/2, le produit scalaire est nul — regard orthogonal !"); }
    var pp3 = pick([["de l'EST au NORD (un quart de tour)", 3], ["de l'EST à l'OUEST (un demi-tour)", 6], ["du NORD au SUD (un demi-tour)", 6], ["du NORD à l'OUEST (un quart de tour)", 3]]);
    return mkN("Le phare balaie π/6 rad chaque minute. Combien de minutes faut-il pour tourner " + pp3[0] + " ?", pp3[1], 0.01, "Un quart de tour = π/2, un demi-tour = π : divisez l'angle par la vitesse π/6.", "π ÷ (π/6) = 6 minutes par demi-tour, et π/2 ÷ (π/6) = 3 minutes par quart de tour. Ici : " + pp3[1] + " minutes."); } },
});
