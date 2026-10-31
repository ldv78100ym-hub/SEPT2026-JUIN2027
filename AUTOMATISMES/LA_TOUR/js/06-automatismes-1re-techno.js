  /* ============================================================
     AUTOMATISMES (programme de 1re technologique) : questions flash
     NB : le jeu appelle toujours make(2) — les variantes sont donc
     tirées en interne par pick/Math.random, pas via le paramètre d.
     ============================================================ */
Object.assign(G, {
  "a-evol": { tag: "Automatismes", label: "Évolutions : valeur finale, valeur initiale, coefficient, taux réciproque", make: function (d) {
    var v = Math.floor(Math.random() * 4);
    if (v === 0) { var vi = pick([40, 50, 80, 100, 200, 250, 400, 500]), k = pick([10, 20, 25, 50, -10, -20, -25]);
      var vf = vi * (1 + k / 100);
      return mkN("Une valeur vaut " + vi + " et évolue de " + (k > 0 ? "+" + k : NEG + " " + (0 - k)) + " %. Quelle est sa valeur FINALE ?", vf, 0.01,
        "Valeur finale = valeur initiale × (1 + k/100) : on multiplie par le coefficient multiplicateur.",
        vi + " × " + fr(1 + k / 100) + " = " + fr(vf) + "."); }
    if (v === 1) { var vi2 = pick([40, 50, 80, 100, 200]), k2 = pick([25, 50, 100, -20, -50]);
      var vf2 = vi2 * (1 + k2 / 100);
      return mkN("Après une évolution de " + (k2 > 0 ? "+" + k2 : NEG + " " + (0 - k2)) + " %, une valeur vaut " + fr(vf2) + ". Quelle était sa valeur INITIALE ?", vi2, 0.01,
        "Valeur initiale = valeur finale ÷ (1 + k/100) : on DIVISE par le coefficient multiplicateur.",
        fr(vf2) + " ÷ " + fr(1 + k2 / 100) + " = " + vi2 + "."); }
    if (v === 2) { var cm = pick([[1.25, 25], [1.5, 50], [1.2, 20], [0.8, -20], [0.75, -25], [0.5, -50], [0.9, -10], [2, 100]]);
      return mkN("Une valeur est multipliée par " + fr(cm[0]) + ". Quel est son taux d'évolution (en %, avec le signe) ?", cm[1], 0.01,
        "Taux = (coefficient − 1) × 100.",
        "t = (" + fr(cm[0]) + " " + NEG + " 1) × 100 = " + attM(cm[1]) + " %."); }
    var pr = pick([[25, -20], [100, -50], [-20, 25], [-50, 100]]);
    return mkN("Un prix subit une évolution de " + (pr[0] > 0 ? "+" + pr[0] : NEG + " " + (0 - pr[0])) + " %. Quel taux d'évolution RÉCIPROQUE le ramène à sa valeur de départ (en %, avec le signe) ?", pr[1], 0.01,
      "Coefficient réciproque = 1 ÷ coefficient, puis taux = (coefficient réciproque − 1) × 100.",
      "CM = " + fr(1 + pr[0] / 100) + " ; réciproque : 1 ÷ " + fr(1 + pr[0] / 100) + " = " + fr(1 + pr[1] / 100) + " : t = " + attM(pr[1]) + " %.");
  } },
  "a-droite": { tag: "Automatismes", label: "Droites : coefficient directeur par deux points, tracer par point et pente", make: function (d) {
    var v = Math.floor(Math.random() * 2);
    if (v === 0) { var m = NZ(-4, 4), dxx = pick([1, 2, 3, 4]), x1 = R(-3, 3), y1 = R(-5, 5);
      var x2 = x1 + dxx, y2 = y1 + m * dxx;
      var dyS = y2 + (y1 < 0 ? " + " + (0 - y1) : " " + NEG + " " + y1);
      var dxS = x2 + (x1 < 0 ? " + " + (0 - x1) : " " + NEG + " " + x1);
      return mkN("A" + pts(x1, y1) + " et B" + pts(x2, y2) + " sont deux points d'une même droite. Quel est son coefficient directeur ?", m, 0.01,
        "m = (yB − yA)/(xB − xA) : différence des ordonnées sur différence des abscisses.",
        "m = (" + dyS + ")/(" + dxS + ") = " + attM(m) + "."); }
    var m2 = pick([1, 2, -1, -2, 0.5]), x0 = R(-2, 2), y0 = R(-3, 3);
    var cols = [["#0e8f82", "verte"], ["#7b5fc0", "violette"], ["#d2811f", "orange"], ["#d2455f", "rouge"]];
    var pC = y0 - m2 * x0;
    var defs = shuffle([
      { m: m2, p: pC, ok: true },
      { m: -m2, p: pC, ok: false },
      { m: m2, p: pC + 2, ok: false },
      { m: m2 + 1, p: y0 - (m2 + 1) * x0, ok: false }
    ]);
    var curves = [], okName = "";
    for (var ci = 0; ci < 4; ci++) {
      (function (mm, pp, col, name, isOk) {
        curves.push({ fn: function (x) { return mm * x + pp; }, color: col });
        if (isOk) okName = name;
      })(defs[ci].m, defs[ci].p, cols[ci][0], cols[ci][1], defs[ci].ok);
    }
    var names = ["verte", "violette", "orange", "rouge"].filter(function (n) { return n !== okName; });
    return mkMC("Quelle droite passe par le point marqué A" + pts(x0, y0) + " avec un coefficient directeur égal à " + fr(m2) + " ?",
      "La droite " + okName,
      names.map(function (n) { return "La droite " + n; }),
      "Repère la droite qui passe par A, puis vérifie sa pente : un coefficient de 2 signifie « y monte de 2 quand x augmente de 1 ».",
      "La droite " + okName + " passe par A" + pts(x0, y0) + " : depuis A, quand x augmente de 1, y varie de " + attM(m2) + " — c'est bien le coefficient directeur demandé.",
      { graph: { curves: curves, xmin: -4, xmax: 4, ymin: -6, ymax: 6, points: [{ x: x0, y: y0, label: "A" }] } });
  } },
  "a-graph-stats": { tag: "Automatismes", label: "Lire un graphique : diagramme en barres, circulaire, aller-retour graphique-données", make: function (d) {
    var acts = pick([["Sport", "Lecture", "Musique", "Jeux"], ["Voiture", "Bus", "Vélo", "À pied"], ["Pains", "Viennoiseries", "Gâteaux", "Salades"]]);
    var barCols = ["#0e8f82", "#7b5fc0", "#b87900", "#d2811f"];
    var vals = [2 * R(2, 6), 2 * R(2, 6), 2 * R(2, 6), 2 * R(2, 6)];
    while (vals.filter(function (x) { return x === Math.max.apply(null, vals); }).length > 1) {
      vals = [2 * R(2, 6), 2 * R(2, 6), 2 * R(2, 6), 2 * R(2, 6)];
    }
    var graph = { bars: acts.map(function (a, i) { return { label: a, value: vals[i], color: barCols[i] }; }), xmin: -0.5, xmax: 3.5, ymin: 0, ymax: 16, grid: 2 };
    var tot = vals[0] + vals[1] + vals[2] + vals[3];
    var v = Math.floor(Math.random() * 5);
    if (v === 0) { var i0 = R(0, 3);
      return mkN("Le diagramme en barres ci-dessous donne le nombre d'élèves de la classe par activité favorite. Combien d'élèves ont choisi « " + acts[i0] + " » ?", vals[i0], 0.01,
        "Lis la hauteur de la barre sur l'axe des ordonnées (graduations tous les 2 élèves).",
        "La barre « " + acts[i0] + " » monte jusqu'à " + vals[i0] + " : " + vals[i0] + " élèves.", { graph: graph }); }
    if (v === 1) {
      return mkN("Le diagramme en barres ci-dessous donne le nombre d'élèves par activité favorite. Combien d'élèves la classe compte-t-elle AU TOTAL ?", tot, 0.01,
        "Additionne les hauteurs des quatre barres.",
        vals.join(" + ") + " = " + tot + " élèves au total.", { graph: graph }); }
    if (v === 2) { var imax = vals.indexOf(Math.max.apply(null, vals));
      return mkMC("Le diagramme en barres ci-dessous donne le nombre d'élèves par activité favorite. Quelle activité est la plus CHOISIE ?",
        acts[imax], acts.filter(function (a) { return a !== acts[imax]; }),
        "Cherche la barre la plus haute.",
        "La barre la plus haute est celle de « " + acts[imax] + " » (" + vals[imax] + " élèves).", { graph: graph }); }
    if (v === 3) { var ia = R(0, 3), ib = R(0, 3); while (ib === ia) ib = R(0, 3);
      return mkN("Le diagramme en barres ci-dessous donne le nombre d'élèves par activité favorite. Combien d'élèves ont choisi « " + acts[ia] + " OU « " + acts[ib] + " » ?", vals[ia] + vals[ib], 0.01,
        "Additionne les hauteurs des deux barres concernées.",
        vals[ia] + " + " + vals[ib] + " = " + (vals[ia] + vals[ib]) + " élèves.", { graph: graph }); }
    var pc = pick([[[200, 50], 90], [[100, 25], 90], [[300, 100], 120], [[150, 50], 120], [[200, 150], 270], [[100, 50], 180]]);
    var nn = pc[0][0], eff = pc[0][1], ang = pc[1];
    return mkN("Sur " + nn + " élèves interrogés, " + eff + " vont au club de mathématiques. Sur un diagramme circulaire (camembert), quel ANGLE (en degrés) occupe leur secteur ?", ang, 0.01,
      "Angle du secteur = 360 × (effectif de la partie)/(effectif total).",
      "360 × " + eff + "/" + nn + " = " + ang + "°.");
  } },
  "a-boite": { tag: "Automatismes", label: "Lire un diagramme en boîte : médiane, quartiles, écart interquartile, étendue", make: function (d) {
    var mn = 2 * R(1, 5), q1 = mn + 2 * R(1, 3), med = q1 + 2 * R(1, 3), q3 = med + 2 * R(1, 3), mx = q3 + 2 * R(1, 5);
    var graph = { box: { min: mn, q1: q1, med: med, q3: q3, max: mx }, xmin: 0, xmax: mx + 4, ymin: -2, ymax: 2, grid: 2 };
    var v = Math.floor(Math.random() * 5);
    if (v === 0) return mkN("Le diagramme en boîte ci-dessous résume une série statistique. Quelle est sa MÉDIANE ?", med, 0.01,
      "La médiane est la barre épaisse au milieu de la boîte.",
      "La barre centrale est en " + med + " : la moitié des valeurs est en dessous, l'autre moitié au-dessus.", { graph: graph });
    if (v === 1) return mkN("Le diagramme en boîte ci-dessous résume une série statistique. Quel est le PREMIER quartile Q1 ?", q1, 0.01,
      "Q1 est le bord GAUCHE de la boîte : 25 % des données sont en dessous.",
      "La boîte commence en " + q1 + " : un quart des valeurs sont inférieures à " + q1 + ".", { graph: graph });
    if (v === 2) return mkN("Le diagramme en boîte ci-dessous résume une série statistique. Quel est son écart interquartile Q3 − Q1 ?", q3 - q1, 0.01,
      "Écart interquartile = largeur de la boîte = Q3 − Q1.",
      "Q3 − Q1 = " + q3 + " " + NEG + " " + q1 + " = " + (q3 - q1) + " : c'est la largeur de la boîte.", { graph: graph });
    if (v === 3) return mkN("Le diagramme en boîte ci-dessous résume une série statistique. Quelle est l'ÉTENDUE de la série ?", mx - mn, 0.01,
      "Étendue = max − min : du bout gauche au bout droit des moustaches.",
      "max − min = " + mx + " " + NEG + " " + mn + " = " + (mx - mn) + ".", { graph: graph });
    return mkN("Le diagramme en boîte ci-dessous résume une série statistique. En dessous de quelle valeur trouve-t-on 25 % des données ?", q1, 0.01,
      "25 % des données : c'est la frontière gauche de la boîte, le premier quartile.",
      "Le bord gauche de la boîte est en " + q1 + " : 25 % des données sont en dessous.", { graph: graph });
  } },
  "a-proba-notation": { tag: "Automatismes", label: "Probabilités : distinguer P(A∩B), P_A(B), P_B(A) — tableaux croisés d'effectifs", make: function (d) {
    var v = Math.floor(Math.random() * 4);
    if (v === 3) {
      return mkMC("Dans un lycée, F désigne « l'élève est une fille » et A « l'élève est adhérent du club maths ». Comment noter « la probabilité que l'élève soit adhérent SACHANT que c'est une fille » ?",
        "\\(P_F(A)\\)",
        ["\\(P(A \\cap F)\\)", "\\(P_A(F)\\)", "\\(P(A \\cup F)\\)"],
        "« B sachant A » se note avec le sachant en indice : P_A(B). L'événement APRÈS la barre est ce qu'on cherche.",
        "On sait déjà que c'est une fille (F en indice), on cherche la probabilité d'adhérer (A) : \\(P_F(A)\\).");
    }
    var trip = pick([[40, 10, 15], [50, 20, 5], [50, 25, 25], [60, 30, 10], [40, 20, 20], [60, 15, 10], [40, 10, 30]]);
    var effF = trip[0], aF = trip[1], aG = trip[2], effG = 100 - effF, nA = aF + aG;
    var table = tableHTML(["", "\\(A\\)", "\\(\\overline{A}\\)", "Total"],
      [["Filles", "\\(" + aF + "\\)", "\\(" + (effF - aF) + "\\)", "\\(" + effF + "\\)"],
       ["Garçons", "\\(" + aG + "\\)", "\\(" + (effG - aG) + "\\)", "\\(" + effG + "\\)"],
       ["Total", "\\(" + nA + "\\)", "\\(" + (100 - nA) + "\\)", "\\(100\\)"]]);
    var intro = "Dans un lycée de 100 élèves, F désigne « l'élève est une fille » et A « l'élève adhère au club maths ». Tableau croisé des effectifs :<br>" + table + "<br>";
    if (v === 0) return mkN(intro + "Quelle est la probabilité \\(P(F \\cap A)\\) qu'un élève pris au hasard soit une fille adhérente ?", aF / 100, 0.005,
      "P(F ∩ A) = effectif de la case (Filles et A) ÷ effectif total (100).",
      "P(F ∩ A) = " + aF + "/100 = " + fr(aF / 100) + ".");
    if (v === 1) return mkN(intro + "Un élève est une FILLE. Quelle est la probabilité \\(P_F(A)\\) qu'elle soit adhérente au club maths ?", aF / effF, 0.005,
      "P_F(A) = effectif (Filles et A) ÷ effectif total de la ligne Filles : on se restreint aux filles.",
      "P_F(A) = " + aF + "/" + effF + " = " + fr(aF / effF) + ".");
    return mkN(intro + "Un élève est ADHÉRENT du club maths. Quelle est la probabilité \\(P_A(F)\\) que ce soit une fille ?", aF / nA, 0.005,
      "P_A(F) = effectif (Filles et A) ÷ effectif total de la colonne A : on se restreint aux adhérents.",
      "P_A(F) = " + aF + "/" + nA + " = " + fr(aF / nA) + ".");
  } },
});
