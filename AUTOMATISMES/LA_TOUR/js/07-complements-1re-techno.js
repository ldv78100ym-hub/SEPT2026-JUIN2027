  /* ============================================================
     COMPLÉMENTS DU PROGRAMME DE 1re TECHNOLOGIQUE
     Vocabulaire ensembliste & logique ; algorithmique (Python) ;
     repérage dans l'espace ; polygones réguliers ; séries à deux
     variables (nuage, point moyen, ajustement) ; probabilités
     totales ; répétition d'épreuves & fluctuation ; sommes de
     suites. Comme pour les automatismes : le jeu appelle make(2),
     les variantes sont donc tirées en interne.
     ============================================================ */
Object.assign(G, {
  "log-ensembles": { tag: "Première techno", label: "Vocabulaire ensembliste : intervalles, ∩, ∪, complémentaire, Card", make: function (d) {
    var v = Math.floor(Math.random() * 4);
    if (v === 0) { var p0 = pick([[2, 5], [1, 4], [3, 7], [0, 6]]);
      return mkMC("L'intervalle [" + p0[0] + " ; " + p0[1] + "[ correspond à quelle inégalité ?",
        p0[0] + " ≤ x < " + p0[1],
        [p0[0] + " < x < " + p0[1], p0[0] + " ≤ x ≤ " + p0[1], p0[0] + " < x ≤ " + p0[1]],
        "Crochet FERMÉ = inégalité LARGE (≤) ; crochet OUVERT = inégalité STRICTE (<).",
        "[" + p0[0] + " ; " + p0[1] + "[ contient " + p0[0] + " (crochet fermé) mais pas " + p0[1] + " : " + p0[0] + " ≤ x < " + p0[1] + "."); }
    if (v === 1) { var pp = pick([[[0, 4], [2, 6], [2, 4]], [[1, 3], [2, 5], [2, 3]], [[0, 5], [3, 8], [3, 5]], [[2, 7], [4, 6], [4, 6]]]);
      return mkMC("[" + pp[0][0] + " ; " + pp[0][1] + "] ∩ [" + pp[1][0] + " ; " + pp[1][1] + "] = ?",
        "[" + pp[2][0] + " ; " + pp[2][1] + "]",
        ["[" + pp[0][0] + " ; " + pp[1][1] + "]", "[" + pp[0][0] + " ; " + pp[0][1] + "]", "∅"],
        "L'intersection garde les nombres présents dans les DEUX intervalles.",
        "On prend le max des bornes gauches et le min des bornes droites : [" + pp[2][0] + " ; " + pp[2][1] + "]."); }
    if (v === 2) { var ca = 10 * R(2, 9), cb = 10 * R(2, 8), cab = 10 * R(1, Math.min(ca, cb) / 10 - 1);
      return mkN("Card(A) = " + ca + ", Card(B) = " + cb + " et Card(A ∩ B) = " + cab + ". Quel est Card(A ∪ B) ?",
        ca + cb - cab, 0.01,
        "Card(A ∪ B) = Card(A) + Card(B) − Card(A ∩ B) : on retire les éléments comptés deux fois.",
        ca + " + " + cb + " " + NEG + " " + cab + " = " + (ca + cb - cab) + "."); }
    var va = 10 * R(2, 9);
    return mkN("Dans une classe de 100 élèves, l'événement A est « porter des lunettes » : " + va + " élèves portent des lunettes. Combien d'élèves sont dans le complémentaire \\(\\overline{A}\\) ?",
      100 - va, 0.01,
      "\\(\\overline{A}\\) (ou « non A ») regroupe tous les éléments hors de A : effectif total − Card(A).",
      "\\(\\overline{A}\\) : 100 " + NEG + " " + va + " = " + (100 - va) + " élèves.");
  } },
  "log-logique": { tag: "Première techno", label: "Logique : réciproque, contraposée, contre-exemple, condition suffisante", make: function (d) {
    var v = Math.floor(Math.random() * 5);
    if (v === 0) { return mkMC("« Si un quadrilatère est un losange, alors ses diagonales sont perpendiculaires. » Quelle est la proposition RÉCIPROQUE ?",
      "Si les diagonales d'un quadrilatère sont perpendiculaires, alors c'est un losange.",
      ["Si les diagonales d'un quadrilatère ne sont pas perpendiculaires, alors ce n'est pas un losange.",
       "Un quadrilatère est un losange ou ses diagonales sont perpendiculaires.",
       "Si un quadrilatère est un losange, alors ses diagonales sont perpendiculaires."],
      "La réciproque échange hypothèse et conclusion.",
      "Réciproque : on part de « diagonales perpendiculaires » pour conclure « losange »."); }
    if (v === 1) { return mkMC("« Si n est pair, alors n² est pair. » Quelle est sa CONTRAPOSÉE ?",
      "Si n² est impair, alors n est impair.",
      ["Si n est impair, alors n² est impair.",
       "Si n² est pair, alors n est pair.",
       "n est pair si et seulement si n² est pair."],
      "La contraposée nie les deux parties puis échange hypothèse et conclusion.",
      "« n pair ⇒ n² pair » devient « n² impair ⇒ n impair » : la contraposée est toujours équivalente à l'implication de départ."); }
    if (v === 2) { return mkMC("« Si x = 3, alors x² = 9. » Cette implication est vraie. Et sa réciproque ?",
      "Elle est FAUSSE : x = −3 donne aussi x² = 9.",
      ["Elle est vraie aussi : les deux propriétés vont toujours ensemble.",
       "Elle n'a aucun sens mathématique.",
       "Elle est vraie uniquement pour les nombres positifs."],
      "La réciproque « Si x² = 9 alors x = 3 » oublie qu'il y a DEUX nombres dont le carré vaut 9.",
      "Un contre-exemple suffit : x = −3 vérifie x² = 9 mais pas x = 3. La réciproque est fausse."); }
    if (v === 3) { return mkMC("Un élève affirme : « pour tout entier n, n² + n + 41 est un nombre premier. » Quel n fournit un CONTRE-EXEMPLE ?",
      "n = 40, car 40² + 40 + 41 = 1681 = 41 × 41.",
      ["n = 1, car 43 n'est pas premier.",
       "n = 41, car le nombre obtenu est trop grand.",
       "Aucun : le résultat est toujours premier."],
      "Pour infirmer « pour tout n », UN seul contre-exemple suffit : testez n = 40.",
      "40² + 40 + 41 = 1681 = 41² : 1681 n'est pas premier, l'affirmation est infirmée."); }
    return mkMC("Sachant que « x > 2 » implique « x > 1 » : la condition x > 2 est ... pour avoir x > 1 ?",
      "SUFFISANTE (mais pas nécessaire)",
      ["NÉCESSAIRE (mais pas suffisante)", "nécessaire ET suffisante", "ni nécessaire ni suffisante"],
      "« A implique B » signifie : A est suffisant pour B, et B est nécessaire pour A.",
      "Tout x > 2 est aussi > 1, donc x > 2 suffit ; mais x = 1,5 est > 1 sans être > 2 : ce n'est pas nécessaire.");
  } },
  "algo-flash": { tag: "Première techno", label: "Algorithmique Python : compteur, accumulateur, listes, simulation, balayage", make: function (d) {
    var v = Math.floor(Math.random() * 8), IND = "&nbsp;&nbsp;&nbsp;&nbsp;";
    if (v === 0) { var a0 = R(2, 5), a1 = a0 + R(2, 6);
      return mkN("Python — que vaut \\(c\\) à la fin ?<br><code>c = 0<br>for i in range(" + a0 + ", " + a1 + "):<br>" + IND + "c = c + 1</code>",
        a1 - a0, 0.01,
        "range(a, b) parcourt les entiers de a à b−1 : il y a b − a tours de boucle, et c est un COMPTEUR.",
        "De " + a0 + " à " + (a1 - 1) + " : " + (a1 - a0) + " tours, donc c = " + (a1 - a0) + "."); }
    if (v === 1) { var b1 = R(4, 7), s1 = b1 * (b1 - 1) / 2;
      return mkN("Python — que vaut \\(s\\) à la fin ?<br><code>s = 0<br>for i in range(1, " + (b1 + 1) + "):<br>" + IND + "s = s + i</code>",
        s1, 0.01,
        "s est un ACCUMULATEUR : il additionne 1 + 2 + … + n.",
        "s = 1 + 2 + … + " + b1 + " = " + s1 + "."); }
    if (v === 2) { var c1 = R(3, 5), p1 = 1;
      for (var f2 = 2; f2 <= c1; f2++) p1 *= f2;
      return mkN("Python — que vaut \\(p\\) à la fin ?<br><code>p = 1<br>for i in range(1, " + (c1 + 1) + "):<br>" + IND + "p = p * i</code>",
        p1, 0.01,
        "p accumule le PRODUIT des valeurs : 1 × 2 × … × n.",
        "p = 1 × 2 × … × " + c1 + " = " + p1 + "."); }
    if (v === 3) { var u3 = pick([5, 7, 10]), k3 = pick([2, 3]), lim3 = pick([100, 200]);
      var uu = u3, n3 = 0, seq3 = [u3];
      while (uu < lim3) { uu *= k3; n3++; seq3.push(uu); }
      return mkN("Python — que vaut \\(n\\) à la fin ?<br><code>u = " + u3 + "<br>n = 0<br>while u < " + lim3 + ":<br>" + IND + "u = u * " + k3 + "<br>" + IND + "n = n + 1</code>",
        n3, 0.01,
        "La boucle while tourne TANT QUE la condition est vraie : comptez les multiplications nécessaires pour atteindre le seuil.",
        "u prend successivement " + seq3.join(", ") + " : " + n3 + " tours de boucle, donc n = " + n3 + "."); }
    if (v === 4) { var m4 = pick([2, 3, 4]), list4 = [];
      for (var q4 = 1; q4 <= 4; q4++) list4.push(m4 * q4);
      var w4a = [1, 2, 3, 4].map(function (x) { return m4 + x; });
      return mkMC("Python — que vaut \\(L\\) ?<br><code>L = [" + m4 + "*i for i in range(1, 5)]</code>",
        "[" + list4.join(", ") + "]",
        ["[" + w4a.join(", ") + "]", "[" + list4.slice(0, 3).join(", ") + "]", "[" + [m4, m4 * 2, m4 * 4, m4 * 8].join(", ") + "]"],
        "range(1, 5) donne 1, 2, 3, 4 : la liste en compréhension applique l'expression à chaque i.",
        "L = [" + list4.join(", ") + "] : chaque élément vaut " + m4 + " × i."); }
    if (v === 5) { var pool = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4).map(function (x) { return x * 10; }), idx = R(0, 3);
      return mkN("Python — que vaut \\(L[" + idx + "]\\) ?<br><code>L = [" + pool.join(", ") + "]</code>",
        pool[idx], 0.01,
        "Les indices d'une liste de 4 éléments vont de 0 à 3 : L[0] est le PREMIER élément.",
        "L[" + idx + "] désigne le " + (idx + 1) + "e élément : " + pool[idx] + "."); }
    if (v === 6) { var p6 = pick([0.2, 0.25, 0.3, 0.5, 0.75]);
      return mkN("Python — <code>random()</code> renvoie un nombre au hasard entre 0 et 1. La probabilité que le test <code>random() &lt; " + fr(p6) + "</code> soit VRAI vaut \\(p\\) ?",
        p6, 0.005,
        "La probabilité que random() < p vaut p : c'est une simulation d'une épreuve de Bernoulli de paramètre p.",
        "Chaque valeur entre 0 et 1 est équiprobable : la proportion de tirages donnant random() < " + fr(p6) + " est " + fr(p6) + "."); }
    var b7 = pick([[2, 1.4, 1.5], [3, 1.7, 1.8], [5, 2.2, 2.3], [6, 2.4, 2.5]]);
    return mkN("On BALAYE les valeurs x = 0 ; 0,1 ; 0,2 ; 0,3 ; … Pour quelle valeur de x a-t-on pour la PREMIÈRE fois x² > " + b7[0] + " ?",
      b7[2], 0.001,
      "Testez les valeurs successives : la première qui rend x² > " + b7[0] + " donne la solution approchée par balayage.",
      "(" + fr(b7[1]) + ")² = " + fr(b7[1] * b7[1]) + " < " + b7[0] + " mais (" + fr(b7[2]) + ")² = " + fr(b7[2] * b7[2]) + " > " + b7[0] + " : la solution approchée est x = " + fr(b7[2]) + ".");
  } },
  "espace-3d": { tag: "Première techno", label: "Repérage dans l'espace : coordonnées d'un point, distance entre deux points", make: function (d) {
    var v = Math.floor(Math.random() * 2);
    if (v === 0) { var trip = pick([[2, 3, 6, 7], [1, 2, 2, 3], [4, 4, 7, 9], [6, 6, 7, 11], [2, 6, 9, 11], [3, 4, 12, 13]]);
      var ax = R(-3, 3), ay = R(-3, 3), az = R(-3, 3);
      var bx = ax + trip[0], by = ay + trip[1], bz = az + trip[2];
      return mkN("Dans un repère orthonormal de l'espace : \\(A(" + ax + "\\,;\\," + ay + "\\,;\\," + az + ")\\) et \\(B(" + bx + "\\,;\\," + by + "\\,;\\," + bz + ")\\). Quelle est la distance AB ?",
        trip[3], 0.01,
        "AB = √((xB − xA)² + (yB − yA)² + (zB − zA)²).",
        "AB = √(" + trip[0] + "² + " + trip[1] + "² + " + trip[2] + "²) = √" + (trip[0] * trip[0] + trip[1] * trip[1] + trip[2] * trip[2]) + " = " + trip[3] + "."); }
    var comp = pick([[2, 6, 11, 9], [6, 6, 11, 7], [4, 4, 9, 7], [3, 4, 13, 12], [6, 18, 21, 9], [8, 4, 9, 1]]);
    return mkN("Dans un repère orthonormal de l'espace, \\(M(x\\,;\\," + comp[0] + "\\,;\\," + comp[1] + ")\\) avec \\(x \\gt 0\\) et \\(OM = " + comp[2] + "\\). Que vaut l'abscisse x ?",
      comp[3], 0.01,
      "OM = √(x² + y² + z²) : isole x² = OM² − y² − z².",
      "x² = " + (comp[2] * comp[2]) + " " + NEG + " " + (comp[0] * comp[0]) + " " + NEG + " " + (comp[1] * comp[1]) + " = " + (comp[3] * comp[3]) + " : x = " + comp[3] + ".");
  } },
  "polygones": { tag: "Première techno", label: "Polygones réguliers : angle au centre, angle interne, périmètre, axes de symétrie", make: function (d) {
    var v = Math.floor(Math.random() * 4);
    if (v === 0) { var n0 = pick([5, 6, 8, 9, 10, 12]);
      return mkN("Un polygone régulier à " + n0 + " côtés est inscrit dans un cercle. Quel est l'angle AU CENTRE sous-tendu par un côté (en degrés) ?",
        360 / n0, 0.5,
        "Les " + n0 + " angles au centre se partagent les 360° du tour complet.",
        "360 ÷ " + n0 + " = " + fr(360 / n0) + "°."); }
    if (v === 1) { var n1 = pick([5, 6, 8, 10]);
      return mkN("Quel est l'angle INTERNE (en degrés) d'un polygone régulier à " + n1 + " côtés ?",
        (n1 - 2) * 180 / n1, 0.5,
        "La somme des angles internes d'un polygone à n côtés vaut (n − 2) × 180°, répartie à parts égales.",
        "(" + n1 + " " + NEG + " 2) × 180 ÷ " + n1 + " = " + fr((n1 - 2) * 180 / n1) + "°."); }
    if (v === 2) { var n2 = pick([5, 6, 8]), c2 = pick([3, 4, 5, 6]);
      return mkN("Un polygone régulier à " + n2 + " côtés a des côtés de " + c2 + " cm. Quel est son PÉRIMÈTRE (en cm) ?",
        n2 * c2, 0.01,
        "Régulier = tous les côtés ont la même longueur : périmètre = n × côté.",
        n2 + " × " + c2 + " = " + (n2 * c2) + " cm."); }
    var n3 = pick([5, 6, 8, 10]);
    return mkN("Combien d'AXES DE SYMÉTRIE possède un polygone régulier à " + n3 + " côtés ?",
      n3, 0.01,
      "Un polygone régulier à n côtés a n axes de symétrie : un par sommet et un par côté.",
      "Il en a " + n3 + " : autant que de côtés.");
  } },
  "nuage": { tag: "Première techno", label: "Séries à deux variables : nuage de points, point moyen, ajustement affine, interpolation", make: function (d) {
    var v = Math.floor(Math.random() * 4);
    if (v === 0) { var data = pick([[[1, 3, 5, 7], [2, 4, 5, 9]], [[0, 2, 5, 9], [3, 5, 7, 9]], [[1, 2, 6, 7], [4, 6, 8, 10]], [[2, 3, 4, 7], [1, 5, 7, 9]]]);
      var sx = 0, sy = 0, pl = [];
      for (var i = 0; i < 4; i++) { sx += data[0][i]; sy += data[1][i]; pl.push("(" + data[0][i] + " ; " + data[1][i] + ")"); }
      var mx = sx / 4, my = sy / 4;
      return mkMC("Une série statistique à deux variables donne le nuage de points : " + pl.join(", ") + ". Quelles sont les coordonnées du POINT MOYEN ?",
        "(" + fr(mx) + " ; " + fr(my) + ")",
        ["(" + fr(mx + 1) + " ; " + fr(my) + ")", "(" + fr(mx) + " ; " + fr(my + 1) + ")", "(" + fr(sx) + " ; " + fr(sy) + ")"],
        "Point moyen = (moyenne des abscisses ; moyenne des ordonnées).",
        "Moyenne des x = (" + data[0].join(" + ") + ") ÷ 4 = " + fr(mx) + " ; moyenne des y = (" + data[1].join(" + ") + ") ÷ 4 = " + fr(my) + "."); }
    var a1 = pick([1.5, 2, 2.5, 3]), b1 = pick([1, 2, 3]);
    if (v === 1) { var x1 = R(4, 9);
      return mkN("Un ajustement affine du nuage donne y = " + fr(a1) + "x " + (b1 > 0 ? "+ " + b1 : NEG + " " + (0 - b1)) + ". Estimez y pour x = " + x1 + " (interpolation).",
        a1 * x1 + b1, 0.01,
        "Remplacez x par sa valeur dans l'équation de la droite d'ajustement.",
        "y = " + fr(a1) + " × " + x1 + " " + (b1 > 0 ? "+ " + b1 : NEG + " " + (0 - b1)) + " = " + fr(a1 * x1 + b1) + "."); }
    if (v === 2) { var x2 = pick([12, 15, 20]);
      return mkN("Un ajustement affine donne y = " + fr(a1) + "x " + (b1 > 0 ? "+ " + b1 : NEG + " " + (0 - b1)) + ". Estimez y pour x = " + x2 + " (extrapolation, hors du nuage).",
        a1 * x2 + b1, 0.01,
        "On remplace x, mais attention : l'extrapolation au-delà des données observées est hasardeuse.",
        "y = " + fr(a1) + " × " + x2 + " " + (b1 > 0 ? "+ " + b1 : NEG + " " + (0 - b1)) + " = " + fr(a1 * x2 + b1) + "."); }
    var gg = pick([[4, 6, 2], [3, 5, 2], [5, 7, 1.5], [4, 5, 1], [6, 8, 2]]);
    return mkN("La droite d'ajustement d'un nuage passe par le point moyen G(" + gg[0] + " ; " + gg[1] + ") et a un coefficient directeur de " + fr(gg[2]) + ". Quelle est son ordonnée à l'origine ?",
      gg[1] - gg[2] * gg[0], 0.01,
      "G est sur la droite : yG = a × xG + p, donc p = yG − a × xG.",
      "p = " + gg[1] + " " + NEG + " " + fr(gg[2]) + " × " + gg[0] + " = " + fr(gg[1] - gg[2] * gg[0]) + ".");
  } },
  "proba-totales": { tag: "Première techno", label: "Formule des probabilités totales", make: function (d) {
    function tx(n) { return String(Math.round(n * 100) / 100).replace(".", "{,}"); }
    var v = Math.floor(Math.random() * 3);
    if (v === 0) { var tt = pick([[0.4, 0.5, 0.2], [0.5, 0.6, 0.2], [0.2, 0.5, 0.25], [0.6, 0.3, 0.5], [0.3, 0.4, 0.2], [0.25, 0.4, 0.6]]);
      var pB = Math.round((tt[0] * tt[1] + (1 - tt[0]) * tt[2]) * 100) / 100;
      return mkN("Un arbre pondéré donne \\(P(A)=" + tx(tt[0]) + "\\), \\(P_A(B)=" + tx(tt[1]) + "\\) et \\(P_{\\bar A}(B)=" + tx(tt[2]) + "\\). D'après la formule des probabilités totales, \\(P(B)=\\) ?",
        pB, 0.005,
        "\\(P(B)=P(A)\\times P_A(B)+P(\\bar A)\\times P_{\\bar A}(B)\\) : on additionne les chemins qui mènent à B.",
        "\\(P(B)=" + tx(tt[0]) + "\\times" + tx(tt[1]) + "+" + tx(1 - tt[0]) + "\\times" + tx(tt[2]) + "=" + tx(pB) + "\\)."); }
    if (v === 1) { var ti = pick([[0.4, 0.32, 0.5], [0.5, 0.4, 0.6], [0.2, 0.3, 0.5]]);
      var pAb = Math.round(((ti[1] - ti[0] * ti[2]) / (1 - ti[0])) * 100) / 100;
      return mkN("On sait que \\(P(A)=" + tx(ti[0]) + "\\), \\(P(B)=" + tx(ti[1]) + "\\) et \\(P_A(B)=" + tx(ti[2]) + "\\). Que vaut \\(P_{\\bar A}(B)\\) ?",
        pAb, 0.005,
        "Des probabilités totales : \\(P(B)=P(A)P_A(B)+P(\\bar A)P_{\\bar A}(B)\\), puis on isole l'inconnue.",
        "\\(P(A)P_A(B)=" + tx(ti[0] * ti[2]) + "\\) ; il reste \\(" + tx(ti[1] - ti[0] * ti[2]) + "\\) pour \\(P(\\bar A)=" + tx(1 - ti[0]) + "\\) : \\(P_{\\bar A}(B)=" + tx(pAb) + "\\)."); }
    var ctx = pick([["l'espagnol", 0.6, 0.3, 0.5, 0.38], ["le latin", 0.2, 0.5, 0.25, 0.3], ["l'option musique", 0.4, 0.5, 0.2, 0.32]]);
    return mkN("Dans un lycée, " + Math.round(ctx[1] * 100) + " % des élèves choisissent " + ctx[0] + " (événement A). Parmi eux, " + Math.round(ctx[2] * 100) + " % partent en voyage ; parmi les autres, " + Math.round(ctx[3] * 100) + " % partent en voyage (événement V). Quelle est la probabilité \\(P(V)\\) qu'un élève pris au hasard parte en voyage ?",
      ctx[4], 0.005,
      "Probabilités totales en langage courant : les voyageurs viennent des DEUX branches de l'arbre.",
      "\\(P(V)=" + tx(ctx[1]) + "\\times" + tx(ctx[2]) + "+" + tx(1 - ctx[1]) + "\\times" + tx(ctx[3]) + "=" + tx(ctx[4]) + "\\).");
  } },
  "repetition": { tag: "Première techno", label: "Répétition d'épreuves indépendantes (n ≤ 4) et fluctuation d'échantillonnage", make: function (d) {
    var v = Math.floor(Math.random() * 5);
    if (v === 0) { return mkMC("On lance 3 fois une pièce équilibrée. Quelle est la probabilité d'obtenir exactement PILE, puis FACE, puis PILE dans cet ordre ?",
      "1/8", ["1/6", "3/8", "1/4"],
      "Trois épreuves indépendantes : on MULTIPLIE les probabilités le long du chemin de l'arbre.",
      "1/2 × 1/2 × 1/2 = 1/8."); }
    if (v === 1) { return mkMC("On lance 2 fois un dé équilibré. Quelle est la probabilité d'obtenir AU MOINS UN 6 ?",
      "11/36", ["1/36", "1/6", "2/36"],
      "Passez par l'événement CONTRAIRE : « aucun 6 » sur les deux lancers.",
      "Aucun 6 : 5/6 × 5/6 = 25/36 ; donc au moins un 6 : 1 − 25/36 = 11/36."); }
    if (v === 2) { return mkMC("On lance 4 fois une pièce équilibrée. Quelle est la probabilité d'obtenir EXACTEMENT 3 piles ?",
      "1/4", ["3/4", "1/16", "1/2"],
      "Comptez les chemins de l'arbre : il y en a 4 qui donnent exactement 3 piles.",
      "4 chemins de probabilité 1/16 chacun : 4/16 = 1/4."); }
    if (v === 3) { var n4 = pick([25, 100, 400]);
      return mkN("On simule de nombreux échantillons de taille n = " + n4 + " d'une loi de Bernoulli. L'écart-type des fréquences observées est de l'ordre de 1/√n. De quel ordre est-il ici ?",
        1 / Math.sqrt(n4), 0.005,
        "Écart-type des fréquences ≈ 1/√n.",
        "1/√" + n4 + " = " + fr(1 / Math.sqrt(n4)) + "."); }
    return mkN("Pour DIVISER par 2 la dispersion des fréquences d'échantillonnage, par combien faut-il multiplier la taille n des échantillons ?",
      4, 0.01,
      "La dispersion varie comme 1/√n : diviser par 2 exige de multiplier n par 2².",
      "√(n × 4) = 2√n : multiplier la taille par 4 divise la dispersion par 2.");
  } },
  "somme-suite": { tag: "Première techno", label: "Sommes de termes : entiers, suites arithmétiques et géométriques", make: function (d) {
    var v = Math.floor(Math.random() * 3);
    if (v === 0) { var n0 = pick([10, 20, 50]);
      return mkN("Combien vaut 1 + 2 + 3 + … + " + n0 + " ?",
        n0 * (n0 + 1) / 2, 0.01,
        "Somme des n premiers entiers : n(n + 1)/2.",
        n0 + " × " + (n0 + 1) + " ÷ 2 = " + (n0 * (n0 + 1) / 2) + "."); }
    if (v === 1) { var u0 = pick([2, 5, 10]), r1 = pick([2, 3, 4, 5]);
      var last = u0 + 10 * r1, s1 = 11 * (u0 + last) / 2;
      return mkN("Une suite arithmétique commence à \\(u_{0}\\) = " + u0 + " avec une raison de " + r1 + ". Combien vaut \\(u_{0}\\) + \\(u_{1}\\) + … + \\(u_{10}\\) ?",
        s1, 0.01,
        "Somme d'une suite arithmétique = (nombre de termes) × (premier terme + dernier terme)/2.",
        "11 × (" + u0 + " + " + last + ") ÷ 2 = 11 × " + ((u0 + last) / 2) + " = " + s1 + "."); }
    var g0 = pick([[3, 2, 5], [2, 3, 4], [1, 2, 10]]);
    var sum2 = g0[0] * (Math.pow(g0[1], g0[2] + 1) - 1) / (g0[1] - 1);
    return mkN("Une suite géométrique commence à \\(u_{0}\\) = " + g0[0] + " et chaque terme vaut le précédent × " + g0[1] + ". Combien vaut \\(u_{0}\\) + \\(u_{1}\\) + … + \\(u_{" + g0[2] + "}\\) ?",
      sum2, 0.01,
      "Somme d'une suite géométrique : premier terme × (q^(nombre de termes) − 1)/(q − 1).",
      "\\(u_{" + g0[2] + "}\\) = " + g0[0] + " × " + g0[1] + "^" + g0[2] + " = " + (g0[0] * Math.pow(g0[1], g0[2])) + " ; la somme vaut " + sum2 + ".");
  } },
});
