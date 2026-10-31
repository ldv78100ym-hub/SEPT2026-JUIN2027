  /* ============================================================
     ÉQUATIONS LITTÉRALES (d'après le générateur d'équations
     littérales) : identifier les formules, isoler une grandeur
     par les opérations inverses, racines, ln, produit en croix,
     applications numériques. Pour chaque notion, 6 à 10
     questions croisées balayent la bibliothèque de formules.
     ============================================================ */
Object.assign(G, {
  "lit-identifier": { tag: "Équations littérales", label: "Identifier les formules : physique, chimie, géométrie, unités", make: function (d) {
    var v = Math.floor(Math.random() * 10);
    if (v === 0) return mkMC("La vitesse moyenne \\(v\\) d'un mobile qui parcourt une distance \\(d\\) pendant une durée \\(t\\) est donnée par :",
      "\\(v = \\dfrac{d}{t}\\)",
      ["\\(v = \\dfrac{t}{d}\\)", "\\(v = d \\times t\\)", "\\(v = d " + NEG + " t\\)"],
      "Une vitesse est une distance PAR unité de temps : la distance est au numérateur.",
      "v = d/t : on divise la distance par la durée, par exemple 300 m en 50 s donnent 6 m/s.");
    if (v === 1) return mkMC("La loi d'Ohm relie la tension \\(U\\), la résistance \\(R\\) et l'intensité \\(I\\). Elle s'écrit :",
      "\\(U = R \\times I\\)",
      ["\\(U = \\dfrac{R}{I}\\)", "\\(U = \\dfrac{I}{R}\\)", "\\(U = R + I\\)"],
      "La tension est le PRODUIT de la résistance par l'intensité.",
      "U = RI : par exemple R = 4 Ω et I = 3 A donnent U = 12 V.");
    if (v === 2) return mkMC("L'énergie cinétique d'un corps de masse \\(m\\) et de vitesse \\(v\\) vaut :",
      "\\(E_c = \\dfrac{1}{2} m v^2\\)",
      ["\\(E_c = \\dfrac{1}{2} m v\\)", "\\(E_c = m v^2\\)", "\\(E_c = m v^3\\)"],
      "Deux pièges classiques : oublier le facteur ½ ou oublier le carré de la vitesse.",
      "Ec = ½mv² : m = 2 kg et v = 3 m/s donnent Ec = ½ × 2 × 9 = 9 J.");
    if (v === 3) return mkMC("La concentration molaire \\(C\\) d'une solution contenant \\(n\\) moles dans un volume \\(V\\) vaut :",
      "\\(C = \\dfrac{n}{V}\\)",
      ["\\(C = n \\times V\\)", "\\(C = \\dfrac{V}{n}\\)", "\\(C = n " + NEG + " V\\)"],
      "Une concentration est une quantité de matière par litre de solution.",
      "C = n/V : 0,5 mol dans 250 mL (0,25 L) donnent C = 0,5/0,25 = 2 mol/L.");
    if (v === 4) return mkMC("L'aire d'un disque de rayon \\(r\\) vaut :",
      "\\(A = \\pi r^2\\)",
      ["\\(A = 2\\pi r\\)", "\\(A = \\pi r\\)", "\\(A = \\dfrac{4}{3}\\pi r^3\\)"],
      "Ne pas confondre : 2πr est le PÉRIMÈTRE et (4/3)πr³ le volume de la SPHÈRE.",
      "A = πr² : pour r = 2 cm, A = 4π ≈ 12,57 cm².");
    if (v === 5) return mkMC("La loi de Beer-Lambert relie l'absorbance \\(A\\), le coefficient \\(\\varepsilon\\), le trajet optique \\(\\ell\\) et la concentration \\(c\\) :",
      "\\(A = \\varepsilon \\, \\ell \\, c\\)",
      ["\\(A = \\dfrac{\\varepsilon}{\\ell c}\\)", "\\(A = \\dfrac{\\ell}{\\varepsilon c}\\)", "\\(A = \\varepsilon + \\ell + c\\)"],
      "L'absorbance est proportionnelle aux TROIS grandeurs multipliées.",
      "A = εℓc : c'est le fondement du dosage par spectrophotométrie.");
    if (v === 6) return mkMC("Dans la loi d'Ohm \\(U = RI\\), si \\(U\\) est en volts (V) et \\(I\\) en ampères (A), la résistance \\(R\\) s'exprime en :",
      "ohms (Ω)",
      ["ampères (A)", "watts (W)", "joules (J)"],
      "Analysez les unités : R = U/I, donc des volts divisés par des ampères.",
      "V/A = Ω : la résistance s'exprime en ohms.");
    if (v === 7) return mkMC("Dans la formule \\(P = UI\\), la puissance \\(P\\) s'exprime en watts si \\(U\\) est en volts et \\(I\\) en ampères. Le watt vaut :",
      "\\(1\\ \\text{W} = 1\\ \\text{V} \\times 1\\ \\text{A}\\)",
      ["\\(1\\ \\text{W} = 1\\ \\text{V} + 1\\ \\text{A}\\)", "\\(1\\ \\text{W} = \\dfrac{1\\ \\text{V}}{1\\ \\text{A}}\\)", "\\(1\\ \\text{W} = 1\\ \\text{J} \\times 1\\ \\text{s}\\)"],
      "La puissance électrique est le produit tension × intensité.",
      "P = UI : 230 V × 2 A = 460 W.");
    if (v === 8) return mkMC("Le périmètre \\(P\\) d'un rectangle de longueur \\(L\\) et de largeur \\(l\\) vaut :",
      "\\(P = 2(L + l)\\)",
      ["\\(P = L \\times l\\)", "\\(P = L + l\\)", "\\(P = 2 L l\\)"],
      "Le périmètre fait le tour : 2 fois la longueur PLUS 2 fois la largeur. L×l est l'AIRE.",
      "P = 2(L + l) : pour L = 8 m et l = 3 m, P = 22 m.");
    return mkMC("L'énergie potentielle de pesanteur d'un corps de masse \\(m\\) à la hauteur \\(h\\) dans un champ de pesanteur \\(g\\) vaut :",
      "\\(E_p = m \\, g \\, h\\)",
      ["\\(E_p = \\dfrac{m h}{g}\\)", "\\(E_p = m + g + h\\)", "\\(E_p = m g + h\\)"],
      "Les trois grandeurs se MULTIPLIENT.",
      "Ep = mgh : m = 2 kg, g ≈ 10 N/kg et h = 3 m donnent Ep = 60 J.");
  } },
  "lit-mecanique": { tag: "Équations littérales", label: "Isoler une grandeur en mécanique : v, t, a, h, d…", make: function (d) {
    var v = Math.floor(Math.random() * 10);
    if (v === 0) return mkMC("La vitesse moyenne est donnée par \\(v = \\dfrac{d}{t}\\). Exprimez la distance \\(d\\) en fonction de \\(v\\) et \\(t\\).",
      "\\(d = v \\times t\\)",
      ["\\(d = \\dfrac{v}{t}\\)", "\\(d = \\dfrac{t}{v}\\)", "\\(d = v " + NEG + " t\\)"],
      "Pour isoler le numérateur, on multiplie les deux membres par le dénominateur.",
      "\\(v = \\dfrac{d}{t}\\) donne \\(v \\times t = d\\), donc \\(d = v\\,t\\) : 6 m/s pendant 50 s donnent 300 m.");
    if (v === 1) return mkMC("Toujours avec \\(v = \\dfrac{d}{t}\\) : exprimez la durée \\(t\\) en fonction de \\(d\\) et \\(v\\).",
      "\\(t = \\dfrac{d}{v}\\)",
      ["\\(t = \\dfrac{v}{d}\\)", "\\(t = d \\times v\\)", "\\(t = v " + NEG + " d\\)"],
      "Pour isoler le dénominateur, on multiplie les deux membres par lui puis on divise.",
      "\\(v = \\dfrac{d}{t} \\Rightarrow d = v\\,t \\Rightarrow t = \\dfrac{d}{v}\\) : 300 m à 6 m/s prennent 50 s.");
    if (v === 2) return mkMC("La deuxième loi de Newton s'écrit \\(F = m \\, a\\). Exprimez l'accélération \\(a\\) en fonction de \\(F\\) et \\(m\\).",
      "\\(a = \\dfrac{F}{m}\\)",
      ["\\(a = F \\times m\\)", "\\(a = \\dfrac{m}{F}\\)", "\\(a = F " + NEG + " m\\)"],
      "On divise les deux membres par la masse \\(m\\) (avec \\(m \\neq 0\\)).",
      "\\(F = m\\,a \\Rightarrow a = \\dfrac{F}{m}\\) : une force de 12 N sur 3 kg donne a = 4 m/s².");
    if (v === 3) return mkMC("L'énergie cinétique vérifie \\(E_c = \\dfrac{1}{2} m v^2\\). Exprimez la masse \\(m\\) en fonction de \\(E_c\\) et \\(v\\).",
      "\\(m = \\dfrac{2 E_c}{v^2}\\)",
      ["\\(m = \\dfrac{E_c}{2 v^2}\\)", "\\(m = 2 E_c v^2\\)", "\\(m = \\dfrac{v^2}{2 E_c}\\)"],
      "Multipliez par 2, puis divisez par v² : le facteur 2 arrive au NUMÉRATEUR.",
      "\\(E_c = \\dfrac{1}{2}mv^2 \\Rightarrow 2E_c = mv^2 \\Rightarrow m = \\dfrac{2E_c}{v^2}\\) : Ec = 9 J et v = 3 m/s donnent m = 2 kg.");
    if (v === 4) return mkMC("L'énergie potentielle vérifie \\(E_p = m \\, g \\, h\\). Exprimez la hauteur \\(h\\) en fonction de \\(E_p\\), \\(m\\) et \\(g\\).",
      "\\(h = \\dfrac{E_p}{m \\, g}\\)",
      ["\\(h = E_p \\times m \\times g\\)", "\\(h = \\dfrac{m g}{E_p}\\)", "\\(h = \\dfrac{m}{E_p g}\\)"],
      "On divise les deux membres par le produit \\(m\\,g\\).",
      "\\(E_p = mgh \\Rightarrow h = \\dfrac{E_p}{mg}\\) : Ep = 60 J, m = 2 kg et g ≈ 10 N/kg donnent h = 3 m.");
    if (v === 5) return mkMC("Un mouvement uniformément accéléré vérifie \\(v = v_0 + a\\,t\\). Exprimez la durée \\(t\\) en fonction de \\(v\\), \\(v_0\\) et \\(a\\).",
      "\\(t = \\dfrac{v - v_0}{a}\\)",
      ["\\(t = \\dfrac{v_0 - v}{a}\\)", "\\(t = v " + NEG + " \\dfrac{v_0}{a}\\)", "\\(t = \\dfrac{a}{v - v_0}\\)"],
      "Retranchez d'abord v₀ aux deux membres, PUIS divisez par a : les parenthèses sont indispensables.",
      "\\(v = v_0 + at \\Rightarrow v " + NEG + " v_0 = at \\Rightarrow t = \\dfrac{v " + NEG + " v_0}{a}\\) : de 2 à 8 m/s avec a = 3 m/s², t = 2 s.");
    if (v === 6) return mkMC("En chute libre, \\(h = \\dfrac{1}{2} g\\,t^2\\). Exprimez la durée \\(t\\) en fonction de \\(h\\) et \\(g\\).",
      "\\(t = \\sqrt{\\dfrac{2h}{g}}\\)",
      ["\\(t = \\sqrt{\\dfrac{g}{2h}}\\)", "\\(t = \\dfrac{2h}{g}\\)", "\\(t = 2h \\times g\\)"],
      "Multipliez par 2, divisez par g, puis prenez la RACINE CARRÉE (t est au carré).",
      "\\(h = \\dfrac{1}{2}gt^2 \\Rightarrow t^2 = \\dfrac{2h}{g} \\Rightarrow t = \\sqrt{\\dfrac{2h}{g}}\\) : h = 20 m et g ≈ 10 m/s² donnent t = 2 s.");
    if (v === 7) return mkMC("La distance de freinage vérifie \\(d = \\dfrac{v^2}{2a}\\). Exprimez la vitesse \\(v\\) en fonction de \\(d\\) et \\(a\\).",
      "\\(v = \\sqrt{2 a d}\\)",
      ["\\(v = 2 a d\\)", "\\(v = \\sqrt{\\dfrac{a}{2d}}\\)", "\\(v = 2a + d\\)"],
      "Multipliez par 2a pour isoler v², puis prenez la racine carrée.",
      "\\(d = \\dfrac{v^2}{2a} \\Rightarrow v^2 = 2ad \\Rightarrow v = \\sqrt{2ad}\\) : d = 8 m et a = 4 m/s² donnent v = 8 m/s.");
    if (v === 8) return mkMC("La loi de Hooke s'écrit \\(F = k\\,x\\). Exprimez l'allongement \\(x\\) en fonction de \\(F\\) et \\(k\\).",
      "\\(x = \\dfrac{F}{k}\\)",
      ["\\(x = F \\times k\\)", "\\(x = \\dfrac{k}{F}\\)", "\\(x = F " + NEG + " k\\)"],
      "On divise les deux membres par la raideur \\(k\\) (avec \\(k \\neq 0\\)).",
      "\\(F = kx \\Rightarrow x = \\dfrac{F}{k}\\) : 15 N sur un ressort de raideur 50 N/m donnent x = 0,3 m.");
    return mkMC("La gravitation universelle s'écrit \\(F = \\dfrac{G\\,m_1\\,m_2}{d^2}\\). Exprimez la distance \\(d\\) en fonction de \\(F\\), \\(G\\), \\(m_1\\) et \\(m_2\\).",
      "\\(d = \\sqrt{\\dfrac{G\\,m_1\\,m_2}{F}}\\)",
      ["\\(d = \\sqrt{\\dfrac{F}{G\\,m_1\\,m_2}}\\)", "\\(d = \\dfrac{G\\,m_1\\,m_2}{F}\\)", "\\(d = \\sqrt{F\\,G\\,m_1\\,m_2}\\)"],
      "Multipliez par d², divisez par F, puis racine carrée : d est au carré au DÉNOMINATEUR.",
      "\\(F = \\dfrac{Gm_1m_2}{d^2} \\Rightarrow d^2 = \\dfrac{Gm_1m_2}{F} \\Rightarrow d = \\sqrt{\\dfrac{Gm_1m_2}{F}}\\).");
  } },
  "lit-electro-thermo": { tag: "Équations littérales", label: "Isoler une grandeur en électricité & thermodynamique", make: function (d) {
    var v = Math.floor(Math.random() * 9);
    if (v === 0) return mkMC("La loi d'Ohm s'écrit \\(U = R\\,I\\). Exprimez l'intensité \\(I\\) en fonction de \\(U\\) et \\(R\\).",
      "\\(I = \\dfrac{U}{R}\\)",
      ["\\(I = U \\times R\\)", "\\(I = \\dfrac{R}{U}\\)", "\\(I = U " + NEG + " R\\)"],
      "On divise les deux membres par la résistance \\(R\\) (avec \\(R \\neq 0\\)).",
      "\\(U = RI \\Rightarrow I = \\dfrac{U}{R}\\) : 12 V aux bornes de 4 Ω donnent I = 3 A.");
    if (v === 1) return mkMC("La puissance électrique vérifie \\(P = U\\,I\\). Exprimez la tension \\(U\\) en fonction de \\(P\\) et \\(I\\).",
      "\\(U = \\dfrac{P}{I}\\)",
      ["\\(U = P \\times I\\)", "\\(U = \\dfrac{I}{P}\\)", "\\(U = P " + NEG + " I\\)"],
      "On divise les deux membres par l'intensité \\(I\\) (avec \\(I \\neq 0\\)).",
      "\\(P = UI \\Rightarrow U = \\dfrac{P}{I}\\) : 460 W traversés par 2 A donnent U = 230 V.");
    if (v === 2) return mkMC("La résistance d'un fil vérifie \\(R = \\dfrac{\\rho\\,L}{S}\\). Exprimez la section \\(S\\) en fonction de \\(R\\), \\(\\rho\\) et \\(L\\).",
      "\\(S = \\dfrac{\\rho\\,L}{R}\\)",
      ["\\(S = R \\times \\rho \\times L\\)", "\\(S = \\dfrac{R}{\\rho\\,L}\\)", "\\(S = \\dfrac{\\rho\\,R}{L}\\)"],
      "Multipliez les deux membres par \\(S\\), puis divisez par \\(R\\).",
      "\\(R = \\dfrac{\\rho L}{S} \\Rightarrow RS = \\rho L \\Rightarrow S = \\dfrac{\\rho L}{R}\\) : plus la section est grande, plus la résistance est PETITE — cohérent.");
    if (v === 3) return mkMC("La charge électrique vérifie \\(Q = I\\,t\\). Exprimez la durée \\(t\\) en fonction de \\(Q\\) et \\(I\\).",
      "\\(t = \\dfrac{Q}{I}\\)",
      ["\\(t = Q \\times I\\)", "\\(t = \\dfrac{I}{Q}\\)", "\\(t = Q " + NEG + " I\\)"],
      "On divise les deux membres par l'intensité \\(I\\) (avec \\(I \\neq 0\\)).",
      "\\(Q = It \\Rightarrow t = \\dfrac{Q}{I}\\) : 30 C à 0,5 A demandent 60 s.");
    if (v === 4) return mkMC("L'équation d'état du gaz parfait s'écrit \\(P\\,V = n\\,R\\,T\\). Exprimez la température \\(T\\) en fonction de \\(P\\), \\(V\\), \\(n\\) et \\(R\\).",
      "\\(T = \\dfrac{P\\,V}{n\\,R}\\)",
      ["\\(T = \\dfrac{n\\,R}{P\\,V}\\)", "\\(T = P\\,V\\,n\\,R\\)", "\\(T = \\dfrac{P}{V\\,n\\,R}\\)"],
      "On divise les deux membres par le produit \\(n\\,R\\) (avec \\(n\\,R \\neq 0\\)).",
      "\\(PV = nRT \\Rightarrow T = \\dfrac{PV}{nR}\\) : la température est proportionnelle au produit PV.");
    if (v === 5) return mkMC("La chaleur sensible vérifie \\(Q = m\\,c\\,\\Delta T\\). Exprimez la capacité thermique massique \\(c\\) en fonction de \\(Q\\), \\(m\\) et \\(\\Delta T\\).",
      "\\(c = \\dfrac{Q}{m\\,\\Delta T}\\)",
      ["\\(c = Q \\times m \\times \\Delta T\\)", "\\(c = \\dfrac{m\\,\\Delta T}{Q}\\)", "\\(c = \\dfrac{Q}{m + \\Delta T}\\)"],
      "On divise les deux membres par le produit \\(m\\,\\Delta T\\).",
      "\\(Q = mc\\Delta T \\Rightarrow c = \\dfrac{Q}{m\\Delta T}\\) : 4180 J pour 1 kg et ΔT = 1 K donnent c = 4180 J/(kg·K) — l'eau !");
    if (v === 6) return mkMC("La loi de Boyle-Mariotte s'écrit \\(P_1 V_1 = P_2 V_2\\). Exprimez le volume final \\(V_2\\) en fonction de \\(P_1\\), \\(V_1\\) et \\(P_2\\).",
      "\\(V_2 = \\dfrac{P_1 V_1}{P_2}\\)",
      ["\\(V_2 = P_1 V_1 P_2\\)", "\\(V_2 = \\dfrac{P_2}{P_1 V_1}\\)", "\\(V_2 = \\dfrac{P_2 V_1}{P_1}\\)"],
      "On divise les deux membres par \\(P_2\\) : attention à garder les indices dans le bon ordre.",
      "\\(P_1V_1 = P_2V_2 \\Rightarrow V_2 = \\dfrac{P_1V_1}{P_2}\\) : si la pression double, le volume est divisé par 2.");
    if (v === 7) return mkMC("La constante de temps d'un circuit RC vérifie \\(\\tau = R\\,C\\). Exprimez la capacité \\(C\\) en fonction de \\(\\tau\\) et \\(R\\).",
      "\\(C = \\dfrac{\\tau}{R}\\)",
      ["\\(C = \\tau \\times R\\)", "\\(C = \\dfrac{R}{\\tau}\\)", "\\(C = \\tau + R\\)"],
      "On divise les deux membres par la résistance \\(R\\) (avec \\(R \\neq 0\\)).",
      "\\(\\tau = RC \\Rightarrow C = \\dfrac{\\tau}{R}\\) : τ = 0,2 s et R = 1 kΩ donnent C = 2 × 10⁻⁴ F.");
    return mkMC("L'énergie stockée dans un condensateur vérifie \\(E = \\dfrac{1}{2} C\\,U^2\\). Exprimez la tension \\(U\\) en fonction de \\(E\\) et \\(C\\).",
      "\\(U = \\sqrt{\\dfrac{2E}{C}}\\)",
      ["\\(U = \\dfrac{2E}{C}\\)", "\\(U = \\sqrt{\\dfrac{E}{2C}}\\)", "\\(U = 2\\,E\\,C\\)"],
      "Multipliez par 2, divisez par C, puis prenez la racine carrée : U est au carré.",
      "\\(E = \\dfrac{1}{2}CU^2 \\Rightarrow U^2 = \\dfrac{2E}{C} \\Rightarrow U = \\sqrt{\\dfrac{2E}{C}}\\) : le facteur 2 monte au numérateur AVANT la racine.");
  } },
  "lit-chimie": { tag: "Équations littérales", label: "Isoler une grandeur en chimie : quantités, concentrations, densités", make: function (d) {
    var v = Math.floor(Math.random() * 6);
    if (v === 0) return mkMC("La quantité de matière vérifie \\(n = \\dfrac{m}{M}\\). Exprimez la masse molaire \\(M\\) en fonction de \\(m\\) et \\(n\\).",
      "\\(M = \\dfrac{m}{n}\\)",
      ["\\(M = m \\times n\\)", "\\(M = \\dfrac{n}{m}\\)", "\\(M = m " + NEG + " n\\)"],
      "Multipliez les deux membres par \\(M\\), puis divisez par \\(n\\).",
      "\\(n = \\dfrac{m}{M} \\Rightarrow m = nM \\Rightarrow M = \\dfrac{m}{n}\\) : 9 g d'eau pour 0,5 mol donnent M = 18 g/mol.");
    if (v === 1) return mkMC("La concentration molaire vérifie \\(C = \\dfrac{n}{V}\\). Exprimez la quantité de matière \\(n\\) en fonction de \\(C\\) et \\(V\\).",
      "\\(n = C \\times V\\)",
      ["\\(n = \\dfrac{C}{V}\\)", "\\(n = \\dfrac{V}{C}\\)", "\\(n = C + V\\)"],
      "Pour isoler un NUMÉRATEUR, on multiplie les deux membres par le dénominateur.",
      "\\(C = \\dfrac{n}{V} \\Rightarrow n = C\\,V\\) : 2 mol/L dans 0,25 L donnent n = 0,5 mol.");
    if (v === 2) return mkMC("Lors d'une dilution, \\(C_1 V_1 = C_2 V_2\\). Exprimez le volume à prélever \\(V_1\\) en fonction de \\(C_1\\), \\(C_2\\) et \\(V_2\\).",
      "\\(V_1 = \\dfrac{C_2 V_2}{C_1}\\)",
      ["\\(V_1 = C_1 C_2 V_2\\)", "\\(V_1 = \\dfrac{C_1}{C_2 V_2}\\)", "\\(V_1 = \\dfrac{C_2}{C_1 V_2}\\)"],
      "On divise les deux membres par la concentration initiale \\(C_1\\) : les indices restent à leur place.",
      "\\(C_1V_1 = C_2V_2 \\Rightarrow V_1 = \\dfrac{C_2V_2}{C_1}\\) : pour 0,4 mol/L à partir de 2 mol/L, il faut diviser le volume par 5.");
    if (v === 3) return mkMC("La masse volumique vérifie \\(\\rho = \\dfrac{m}{V}\\). Exprimez le volume \\(V\\) en fonction de \\(m\\) et \\(\\rho\\).",
      "\\(V = \\dfrac{m}{\\rho}\\)",
      ["\\(V = m \\times \\rho\\)", "\\(V = \\dfrac{\\rho}{m}\\)", "\\(V = m + \\rho\\)"],
      "Pour isoler un DÉNOMINATEUR : multipliez par lui, puis divisez par la grandeur isolée.",
      "\\(\\rho = \\dfrac{m}{V} \\Rightarrow m = \\rho V \\Rightarrow V = \\dfrac{m}{\\rho}\\) : 54 g d'aluminium (ρ = 2,7 g/mL) occupent 20 mL.");
    if (v === 4) return mkMC("La loi de Beer-Lambert s'écrit \\(A = \\varepsilon\\,\\ell\\,c\\). Exprimez la concentration \\(c\\) en fonction de \\(A\\), \\(\\varepsilon\\) et \\(\\ell\\).",
      "\\(c = \\dfrac{A}{\\varepsilon\\,\\ell}\\)",
      ["\\(c = A \\times \\varepsilon \\times \\ell\\)", "\\(c = \\dfrac{\\varepsilon\\,\\ell}{A}\\)", "\\(c = \\dfrac{A}{\\varepsilon + \\ell}\\)"],
      "On divise les deux membres par le produit \\(\\varepsilon\\,\\ell\\) (non nul).",
      "\\(A = \\varepsilon\\ell c \\Rightarrow c = \\dfrac{A}{\\varepsilon\\ell}\\) : c'est ainsi qu'on détermine une concentration par spectrophotométrie.");
    return mkN("On dilue une solution : on prélève \\(V_1 = 10\\) mL d'une solution à \\(C_1 = 2\\) mol/L et on complète jusqu'à \\(V_2 = 50\\) mL. Quelle est la concentration finale \\(C_2\\) (en mol/L) ?",
      0.4, 0.005,
      "Conservation de la quantité de matière : \\(C_1 V_1 = C_2 V_2\\), donc \\(C_2 = \\dfrac{C_1 V_1}{V_2}\\).",
      "\\(C_2 = \\dfrac{2 \\times 10}{50} = 0{,}4\\) mol/L : le volume est multiplié par 5, la concentration est divisée par 5.");
  } },
  "lit-ondes": { tag: "Équations littérales", label: "Isoler une grandeur : ondes, optique & radioactivité", make: function (d) {
    var v = Math.floor(Math.random() * 7);
    if (v === 0) return mkMC("La longueur d'onde vérifie \\(\\lambda = \\dfrac{v}{f}\\). Exprimez la célérité \\(v\\) en fonction de \\(\\lambda\\) et \\(f\\).",
      "\\(v = \\lambda \\times f\\)",
      ["\\(v = \\dfrac{\\lambda}{f}\\)", "\\(v = \\dfrac{f}{\\lambda}\\)", "\\(v = \\lambda " + NEG + " f\\)"],
      "Pour isoler le numérateur \\(v\\), on multiplie les deux membres par \\(f\\).",
      "\\(\\lambda = \\dfrac{v}{f} \\Rightarrow v = \\lambda f\\) : λ = 2 m et f = 170 Hz donnent v = 340 m/s.");
    if (v === 1) return mkMC("Toujours avec \\(\\lambda = \\dfrac{v}{f}\\) : exprimez la fréquence \\(f\\) en fonction de \\(v\\) et \\(\\lambda\\).",
      "\\(f = \\dfrac{v}{\\lambda}\\)",
      ["\\(f = v \\times \\lambda\\)", "\\(f = \\dfrac{\\lambda}{v}\\)", "\\(f = v + \\lambda\\)"],
      "Pour isoler un dénominateur : multipliez par lui, puis divisez.",
      "\\(\\lambda = \\dfrac{v}{f} \\Rightarrow f = \\dfrac{v}{\\lambda}\\) : 340 m/s et λ = 2 m donnent f = 170 Hz.");
    if (v === 2) return mkMC("La période d'un pendule simple vérifie \\(T = 2\\pi\\sqrt{\\dfrac{l}{g}}\\). Exprimez la longueur \\(l\\) du fil en fonction de \\(T\\) et \\(g\\).",
      "\\(l = \\dfrac{g\\,T^2}{4\\pi^2}\\)",
      ["\\(l = \\dfrac{g\\,T^2}{2\\pi}\\)", "\\(l = \\dfrac{T^2}{g}\\)", "\\(l = g\\,T^2\\,4\\pi^2\\)"],
      "Élevez au carré : \\(T^2 = 4\\pi^2 l/g\\), puis multipliez par g et divisez par \\(4\\pi^2\\) — PAS par \\(2\\pi\\).",
      "\\(T^2 = \\dfrac{4\\pi^2 l}{g} \\Rightarrow l = \\dfrac{gT^2}{4\\pi^2}\\) : le facteur \\(4\\pi^2\\) vient du carré de \\(2\\pi\\).");
    if (v === 3) return mkMC("L'indice de réfraction vérifie \\(n = \\dfrac{c}{v}\\), où \\(c\\) est la célérité dans le vide. Exprimez \\(v\\) dans le milieu.",
      "\\(v = \\dfrac{c}{n}\\)",
      ["\\(v = c \\times n\\)", "\\(v = \\dfrac{n}{c}\\)", "\\(v = c " + NEG + " n\\)"],
      "Multipliez par \\(v\\), puis divisez par \\(n\\) : la lumière ralentit dans le milieu (n ≥ 1).",
      "\\(n = \\dfrac{c}{v} \\Rightarrow v = \\dfrac{c}{n}\\) : dans l'eau (n ≈ 1,33), la lumière va à environ 2,25 × 10⁸ m/s.");
    if (v === 4) return mkMC("La loi de Wien vérifie \\(\\lambda_{max} = \\dfrac{b}{T}\\). Exprimez la température \\(T\\) en fonction de \\(b\\) et \\(\\lambda_{max}\\).",
      "\\(T = \\dfrac{b}{\\lambda_{max}}\\)",
      ["\\(T = b \\times \\lambda_{max}\\)", "\\(T = \\dfrac{\\lambda_{max}}{b}\\)", "\\(T = b + \\lambda_{max}\\)"],
      "Pour isoler un dénominateur : multipliez par lui, puis divisez par la grandeur isolée.",
      "\\(\\lambda_{max} = \\dfrac{b}{T} \\Rightarrow T = \\dfrac{b}{\\lambda_{max}}\\) : plus le corps est chaud, plus la longueur d'onde du maximum est COURTE.");
    if (v === 5) return mkMC("L'activité d'un échantillon radioactif vérifie \\(A = \\lambda\\,N\\). Exprimez le nombre de noyaux \\(N\\) en fonction de \\(A\\) et \\(\\lambda\\).",
      "\\(N = \\dfrac{A}{\\lambda}\\)",
      ["\\(N = A \\times \\lambda\\)", "\\(N = \\dfrac{\\lambda}{A}\\)", "\\(N = A " + NEG + " \\lambda\\)"],
      "On divise les deux membres par la constante radioactive \\(\\lambda\\) (avec \\(\\lambda \\neq 0\\)).",
      "\\(A = \\lambda N \\Rightarrow N = \\dfrac{A}{\\lambda}\\) : activité en becquerels, λ en s⁻¹, donc N sans unité.");
    return mkMC("La décroissance radioactive s'écrit \\(N = N_0\\, e^{-\\lambda t}\\). Attention au SIGNE de l'exposant : après une durée \\(t\\), le nombre de noyaux restants vaut :",
      "\\(N = N_0\\, e^{-\\lambda t}\\) — l'exposant est NÉGATIF car N décroît",
      ["\\(N = N_0\\, e^{\\lambda t}\\) — l'exposant serait positif et N croîtrait",
       "\\(N = N_0 + \\lambda t\\)", "\\(N = \\lambda^t\\, N_0\\)"],
      "Une décroissance exponentielle s'écrit toujours avec un exposant NÉGATIF.",
      "\\(N = N_0 e^{-\\lambda t}\\) : au bout d'une durée \\(1/\\lambda\\), il reste \\(N_0/e\\) noyaux — c'est la vie moyenne.");
  } },
  "lit-geometrie": { tag: "Équations littérales", label: "Isoler une grandeur en géométrie : rayons, hauteurs, côtés", make: function (d) {
    var v = Math.floor(Math.random() * 10);
    if (v === 0) return mkMC("L'aire d'un disque vérifie \\(A = \\pi r^2\\). Exprimez le rayon \\(r\\) en fonction de \\(A\\).",
      "\\(r = \\sqrt{\\dfrac{A}{\\pi}}\\)",
      ["\\(r = \\dfrac{A}{\\pi}\\)", "\\(r = \\sqrt{A\\,\\pi}\\)", "\\(r = \\sqrt{\\dfrac{\\pi}{A}}\\)"],
      "Divisez par π puis prenez la racine carrée : r est AU CARRÉ, pas au dénominateur.",
      "\\(A = \\pi r^2 \\Rightarrow r^2 = \\dfrac{A}{\\pi} \\Rightarrow r = \\sqrt{\\dfrac{A}{\\pi}}\\) : pour A = 12,57 cm², r = 2 cm.");
    if (v === 1) return mkMC("Le volume d'une sphère vérifie \\(V = \\dfrac{4}{3}\\pi r^3\\). Exprimez le rayon \\(r\\) en fonction de \\(V\\).",
      "\\(r = \\sqrt[3]{\\dfrac{3V}{4\\pi}}\\)",
      ["\\(r = \\sqrt[3]{\\dfrac{4V}{3\\pi}}\\)", "\\(r = \\dfrac{3V}{4\\pi}\\)", "\\(r = 3\\sqrt{\\dfrac{V}{4\\pi}}\\)"],
      "r est au CUBE : multipliez par 3/4, divisez par π, puis racine CUBIQUE.",
      "\\(V = \\dfrac{4}{3}\\pi r^3 \\Rightarrow r^3 = \\dfrac{3V}{4\\pi} \\Rightarrow r = \\sqrt[3]{\\dfrac{3V}{4\\pi}}\\) : le 3 monte au numérateur, le 4 reste en bas.");
    if (v === 2) return mkMC("Le volume d'un cylindre vérifie \\(V = \\pi r^2 h\\). Exprimez la hauteur \\(h\\) en fonction de \\(V\\) et \\(r\\).",
      "\\(h = \\dfrac{V}{\\pi r^2}\\)",
      ["\\(h = V \\pi r^2\\)", "\\(h = \\dfrac{\\pi r^2}{V}\\)", "\\(h = \\dfrac{V}{\\pi + r^2}\\)"],
      "On divise les deux membres par le produit \\(\\pi r^2\\).",
      "\\(V = \\pi r^2 h \\Rightarrow h = \\dfrac{V}{\\pi r^2}\\) : le produit entier \\(\\pi r^2\\) passe au dénominateur.");
    if (v === 3) return mkMC("Le volume d'un cône vérifie \\(V = \\dfrac{1}{3}\\pi r^2 h\\). Exprimez la hauteur \\(h\\) en fonction de \\(V\\) et \\(r\\).",
      "\\(h = \\dfrac{3V}{\\pi r^2}\\)",
      ["\\(h = \\dfrac{V}{3\\pi r^2}\\)", "\\(h = \\dfrac{V}{\\pi r^2}\\)", "\\(h = 3\\,V\\,\\pi r^2\\)"],
      "Multipliez par 3 pour éliminer la fraction : le facteur 3 monte au NUMÉRATEUR.",
      "\\(V = \\dfrac{1}{3}\\pi r^2 h \\Rightarrow 3V = \\pi r^2 h \\Rightarrow h = \\dfrac{3V}{\\pi r^2}\\) : piège classique, laisser le 3 au dénominateur.");
    if (v === 4) return mkMC("L'aire d'un triangle vérifie \\(A = \\dfrac{b\\,h}{2}\\). Exprimez la hauteur \\(h\\) en fonction de \\(A\\) et \\(b\\).",
      "\\(h = \\dfrac{2A}{b}\\)",
      ["\\(h = \\dfrac{A}{2b}\\)", "\\(h = 2\\,A\\,b\\)", "\\(h = \\dfrac{b}{2A}\\)"],
      "Multipliez par 2 d'abord : le facteur 2 arrive au numérateur, b seul au dénominateur.",
      "\\(A = \\dfrac{bh}{2} \\Rightarrow 2A = bh \\Rightarrow h = \\dfrac{2A}{b}\\) : A = 12 cm² et b = 6 cm donnent h = 4 cm.");
    if (v === 5) return mkMC("Le théorème de Pythagore s'écrit \\(c^2 = a^2 + b^2\\) (c : hypoténuse). Exprimez le côté \\(b\\) en fonction de \\(a\\) et \\(c\\).",
      "\\(b = \\sqrt{c^2 - a^2}\\)",
      ["\\(b = \\sqrt{c^2 + a^2}\\)", "\\(b = c " + NEG + " a\\)", "\\(b = \\sqrt{a^2 - c^2}\\)"],
      "Retranchez a² aux deux membres : il y a un MOINS sous la racine, et la racine est indispensable.",
      "\\(c^2 = a^2 + b^2 \\Rightarrow b^2 = c^2 " + NEG + " a^2 \\Rightarrow b = \\sqrt{c^2 " + NEG + " a^2}\\) : si c = 5 et a = 3, alors b = 4.");
    if (v === 6) return mkMC("Le périmètre d'un rectangle vérifie \\(P = 2(l + L)\\). Exprimez la longueur \\(L\\) en fonction de \\(P\\) et \\(l\\).",
      "\\(L = \\dfrac{P}{2} " + NEG + " l\\)",
      ["\\(L = \\dfrac{P}{2} + l\\)", "\\(L = \\dfrac{P " + NEG + " l}{2}\\)", "\\(L = P " + NEG + " 2l\\)"],
      "Divisez d'abord PAR 2 (tout le membre droit), puis retranchez l.",
      "\\(P = 2(l+L) \\Rightarrow \\dfrac{P}{2} = l + L \\Rightarrow L = \\dfrac{P}{2} " + NEG + " l\\) : P = 22 m et l = 3 m donnent L = 8 m.");
    if (v === 7) return mkMC("L'aire d'un trapèze vérifie \\(A = \\dfrac{(B + b)\\,h}{2}\\). Exprimez la hauteur \\(h\\) en fonction de \\(A\\), \\(B\\) et \\(b\\).",
      "\\(h = \\dfrac{2A}{B + b}\\)",
      ["\\(h = \\dfrac{A}{2(B + b)}\\)", "\\(h = \\dfrac{B + b}{2A}\\)", "\\(h = 2A\\,(B + b)\\)"],
      "Multipliez par 2, puis divisez par la somme des deux bases \\(B + b\\).",
      "\\(A = \\dfrac{(B+b)h}{2} \\Rightarrow 2A = (B+b)h \\Rightarrow h = \\dfrac{2A}{B+b}\\) : les parenthèses gardent B et b ensemble.");
    if (v === 8) return mkN("Un triangle a une base de \\(b = 6\\) cm et une hauteur de \\(h = 4\\) cm. Quelle est son aire (en cm²) ?",
      12, 0.01,
      "Aire = base × hauteur ÷ 2.",
      "A = (6 × 4)/2 = 12 cm².");
    return mkN("Grâce à la formule \\(d = \\sqrt{(x_2 " + NEG + " x_1)^2 + (y_2 " + NEG + " y_1)^2}\\), quelle est la distance entre \\(A(0\\,;\\,0)\\) et \\(B(3\\,;\\,4)\\) ?",
      5, 0.01,
      "Différences des abscisses : 3 ; des ordonnées : 4 — puis Pythagore.",
      "\\(d = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5\\) : le triangle 3-4-5.");
  } },
  "lit-suites-stats": { tag: "Équations littérales", label: "Isoler un terme dans les suites & la moyenne pondérée", make: function (d) {
    var v = Math.floor(Math.random() * 6);
    if (v === 0) return mkMC("Le terme général d'une suite arithmétique vérifie \\(u_n = u_0 + n\\,r\\). Exprimez la raison \\(r\\) en fonction de \\(u_n\\), \\(u_0\\) et \\(n\\).",
      "\\(r = \\dfrac{u_n - u_0}{n}\\)",
      ["\\(r = \\dfrac{u_0 - u_n}{n}\\)", "\\(r = u_n - n\\,r\\)", "\\(r = \\dfrac{n}{u_n - u_0}\\)"],
      "Retranchez u₀ aux deux membres, puis divisez par n (avec \\(n \\neq 0\\)).",
      "\\(u_n = u_0 + nr \\Rightarrow u_n " + NEG + " u_0 = nr \\Rightarrow r = \\dfrac{u_n " + NEG + " u_0}{n}\\) : de 5 à 17 en 3 rangs, r = 4.");
    if (v === 1) return mkMC("Toujours pour une suite arithmétique \\(u_n = u_0 + n\\,r\\) : exprimez le premier terme \\(u_0\\) en fonction de \\(u_n\\), \\(n\\) et \\(r\\).",
      "\\(u_0 = u_n - n\\,r\\)",
      ["\\(u_0 = u_n + n\\,r\\)", "\\(u_0 = \\dfrac{u_n}{n\\,r}\\)", "\\(u_0 = n\\,r - u_n\\)"],
      "Retranchez \\(n\\,r\\) aux deux membres : le produit \\(nr\\) se retranche EN BLOC.",
      "\\(u_n = u_0 + nr \\Rightarrow u_0 = u_n " + NEG + " nr\\) : u₁₀ = 42 avec r = 4 donne u₀ = 42 − 40 = 2.");
    if (v === 2) return mkMC("Le terme général d'une suite géométrique vérifie \\(u_n = u_0\\,q^n\\) (avec \\(u_0 \\gt 0\\)). Exprimez la raison \\(q\\) en fonction de \\(u_n\\), \\(u_0\\) et \\(n\\).",
      "\\(q = \\sqrt[n]{\\dfrac{u_n}{u_0}}\\)",
      ["\\(q = \\dfrac{u_n}{u_0}\\)", "\\(q = \\left(\\dfrac{u_0}{u_n}\\right)^n\\)", "\\(q = \\dfrac{u_n}{u_0\\,n}\\)"],
      "Divisez par u₀, puis prenez la racine n-IÈME : q est à la puissance n.",
      "\\(u_n = u_0 q^n \\Rightarrow q^n = \\dfrac{u_n}{u_0} \\Rightarrow q = \\sqrt[n]{\\dfrac{u_n}{u_0}}\\) : oublier la racine est LE piège classique.");
    if (v === 3) return mkMC("Toujours pour \\(u_n = u_0\\,q^n\\) (avec \\(q \\gt 0\\), \\(q \\neq 1\\)) : exprimez le rang \\(n\\) en fonction de \\(u_n\\), \\(u_0\\) et \\(q\\).",
      "\\(n = \\dfrac{\\ln(u_n/u_0)}{\\ln q}\\)",
      ["\\(n = \\ln\\dfrac{u_n}{u_0}\\)", "\\(n = \\dfrac{\\ln u_n}{\\ln u_0}\\)", "\\(n = q \\ln\\dfrac{u_n}{u_0}\\)"],
      "L'inconnue est en EXPOSANT : on applique le logarithme des deux membres, puis \\(\\ln(q^n) = n \\ln q\\).",
      "\\(u_n = u_0 q^n \\Rightarrow \\ln\\dfrac{u_n}{u_0} = n\\ln q \\Rightarrow n = \\dfrac{\\ln(u_n/u_0)}{\\ln q}\\) : c'est la règle \\(a^X = b \\Rightarrow X = \\dfrac{\\ln b}{\\ln a}\\).");
    if (v === 4) return mkMC("La moyenne pondérée vérifie \\(\\bar{x} = \\dfrac{n_1 x_1 + n_2 x_2}{n_1 + n_2}\\). Exprimez la moyenne \\(x_2\\) du deuxième groupe.",
      "\\(x_2 = \\dfrac{\\bar{x}(n_1 + n_2) " + NEG + " n_1 x_1}{n_2}\\)",
      ["\\(x_2 = \\dfrac{\\bar{x} " + NEG + " n_1 x_1}{n_2}\\)", "\\(x_2 = \\dfrac{n_1 x_1 " + NEG + " \\bar{x}}{n_2}\\)", "\\(x_2 = \\dfrac{\\bar{x}}{n_1 + n_2}\\)"],
      "Multipliez par \\(n_1 + n_2\\), retranchez \\(n_1 x_1\\), puis divisez par \\(n_2\\).",
      "\\(\\bar{x}(n_1+n_2) = n_1x_1 + n_2x_2 \\Rightarrow n_2x_2 = \\bar{x}(n_1+n_2) " + NEG + " n_1x_1\\) : l'oubli du facteur \\((n_1+n_2)\\) est le piège.");
    return mkN("Une classe compte 12 élèves de moyenne 10 et 8 élèves de moyenne 15. Quelle est la moyenne pondérée globale ?",
      12, 0.01,
      "\\(\\bar{x} = \\dfrac{n_1 x_1 + n_2 x_2}{n_1 + n_2}\\) : somme des notes, divisée par l'effectif total.",
      "\\(\\bar{x} = \\dfrac{12 \\times 10 + 8 \\times 15}{12 + 8} = \\dfrac{240}{20} = 12\\).");
  } },
  "lit-economie": { tag: "Équations littérales", label: "Isoler une grandeur en économie & santé : taux, intérêts, IMC…", make: function (d) {
    var v = Math.floor(Math.random() * 8);
    if (v === 0) return mkMC("Les intérêts simples vérifient \\(I = C\\,t\\,i\\). Exprimez la durée \\(t\\) en fonction de \\(I\\), \\(C\\) et \\(i\\).",
      "\\(t = \\dfrac{I}{C\\,i}\\)",
      ["\\(t = I \\times C \\times i\\)", "\\(t = \\dfrac{C\\,i}{I}\\)", "\\(t = \\dfrac{I}{C + i}\\)"],
      "On divise les deux membres par le produit \\(C\\,i\\) (non nul).",
      "\\(I = Cti \\Rightarrow t = \\dfrac{I}{Ci}\\) : 90 € d'intérêts pour 600 € à 3 % (i = 0,03) donnent t = 5 ans.");
    if (v === 1) return mkMC("Les intérêts composés vérifient \\(C_n = C_0\\,(1 + i)^n\\) (avec \\(1 + i \\gt 0\\), \\(1 + i \\neq 1\\)). Exprimez le nombre de périodes \\(n\\).",
      "\\(n = \\dfrac{\\ln(C_n/C_0)}{\\ln(1 + i)}\\)",
      ["\\(n = \\ln\\dfrac{C_n}{C_0}\\)", "\\(n = \\dfrac{\\ln C_n}{\\ln C_0}\\)", "\\(n = (1 + i)\\ln\\dfrac{C_n}{C_0}\\)"],
      "L'inconnue est en exposant : logarithme des deux membres, puis \\(\\ln(a^n) = n\\ln a\\).",
      "\\(C_n = C_0(1+i)^n \\Rightarrow \\ln\\dfrac{C_n}{C_0} = n\\ln(1+i) \\Rightarrow n = \\dfrac{\\ln(C_n/C_0)}{\\ln(1+i)}\\) : combien d'années pour doubler un capital à 5 % ?");
    if (v === 2) return mkMC("Le taux de marge vérifie \\(t_m = \\dfrac{PV " + NEG + " PA}{PA}\\). Exprimez le prix d'achat \\(PA\\) en fonction de \\(PV\\) et \\(t_m\\).",
      "\\(PA = \\dfrac{PV}{1 + t_m}\\)",
      ["\\(PA = PV " + NEG + " t_m\\)", "\\(PA = PV\\,(1 + t_m)\\)", "\\(PA = \\dfrac{PV}{t_m}\\)"],
      "Multipliez par PA : \\(t_m\\,PA = PV " + NEG + " PA\\), puis FACTORISEZ : \\(PA(1 + t_m) = PV\\).",
      "\\(t_m = \\dfrac{PV-PA}{PA} \\Rightarrow t_m PA = PV " + NEG + " PA \\Rightarrow PA(1+t_m) = PV \\Rightarrow PA = \\dfrac{PV}{1+t_m}\\) : la factorisation est l'étape clé.");
    if (v === 3) return mkMC("Le multiplicateur keynésien vérifie \\(k = \\dfrac{1}{1 " + NEG + " c}\\). Exprimez la propension à consommer \\(c\\) en fonction de \\(k\\).",
      "\\(c = 1 " + NEG + " \\dfrac{1}{k}\\)",
      ["\\(c = 1 + \\dfrac{1}{k}\\)", "\\(c = \\dfrac{1}{k}\\)", "\\(c = k " + NEG + " 1\\)"],
      "Prenez l'inverse des deux membres : \\(1 " + NEG + " c = \\dfrac{1}{k}\\), puis isolez c.",
      "\\(k = \\dfrac{1}{1-c} \\Rightarrow 1 " + NEG + " c = \\dfrac{1}{k} \\Rightarrow c = 1 " + NEG + " \\dfrac{1}{k}\\) : pour k = 4, c = 0,75.");
    if (v === 4) return mkMC("L'indice de masse corporelle vérifie \\(IMC = \\dfrac{m}{h^2}\\). Exprimez la taille \\(h\\) en fonction de \\(m\\) et de l'IMC.",
      "\\(h = \\sqrt{\\dfrac{m}{IMC}}\\)",
      ["\\(h = \\dfrac{m}{IMC}\\)", "\\(h = \\sqrt{\\dfrac{IMC}{m}}\\)", "\\(h = \\dfrac{IMC}{m}\\)"],
      "h est au carré au dénominateur : multipliez par h², divisez par IMC, puis racine carrée.",
      "\\(IMC = \\dfrac{m}{h^2} \\Rightarrow h^2 = \\dfrac{m}{IMC} \\Rightarrow h = \\sqrt{\\dfrac{m}{IMC}}\\) : 72 kg avec IMC = 23,5 donnent h ≈ 1,75 m.");
    if (v === 5) return mkMC("La densité de population vérifie \\(D = \\dfrac{P}{S}\\). Exprimez la superficie \\(S\\) en fonction de \\(P\\) et \\(D\\).",
      "\\(S = \\dfrac{P}{D}\\)",
      ["\\(S = P \\times D\\)", "\\(S = \\dfrac{D}{P}\\)", "\\(S = P " + NEG + " D\\)"],
      "Multipliez par S, puis divisez par D.",
      "\\(D = \\dfrac{P}{S} \\Rightarrow S = \\dfrac{P}{D}\\) : 10 millions d'habitants à 400 hab/km² occupent 25 000 km².");
    if (v === 6) return mkMC("Le débit volumique vérifie \\(Q = \\dfrac{V}{t}\\). Exprimez le volume \\(V\\) en fonction de \\(Q\\) et \\(t\\).",
      "\\(V = Q \\times t\\)",
      ["\\(V = \\dfrac{Q}{t}\\)", "\\(V = \\dfrac{t}{Q}\\)", "\\(V = Q + t\\)"],
      "Pour isoler le numérateur, on multiplie les deux membres par le dénominateur.",
      "\\(Q = \\dfrac{V}{t} \\Rightarrow V = Q\\,t\\) : un robinet de 0,02 m³/s pendant 60 s remplit 1,2 m³.");
    return mkMC("La pression vérifie \\(P = \\dfrac{F}{S}\\). Exprimez la force pressante \\(F\\) en fonction de \\(P\\) et \\(S\\).",
      "\\(F = P \\times S\\)",
      ["\\(F = \\dfrac{P}{S}\\)", "\\(F = \\dfrac{S}{P}\\)", "\\(F = P + S\\)"],
      "Pour isoler le numérateur, on multiplie les deux membres par la surface.",
      "\\(P = \\dfrac{F}{S} \\Rightarrow F = P\\,S\\) : 100 000 Pa sur 0,02 m² donnent 2 000 N — le principe du piston.");
  } },
  "lit-algebre": { tag: "Équations littérales", label: "Relations implicites : produit en croix, équations du 1er degré", make: function (d) {
    var v = Math.floor(Math.random() * 6);
    if (v === 0) return mkMC("On donne \\(a = \\dfrac{b}{a + c}\\). Pour éliminer la fraction, on multiplie les deux membres par \\(a + c\\). Quelle égalité obtient-on ?",
      "\\(a\\,(a + c) = b\\)",
      ["\\(a = b\\,(a + c)\\)", "\\(\\dfrac{a}{a + c} = b\\)", "\\(a + c = \\dfrac{b}{a}\\)"],
      "On multiplie TOUT le membre de gauche par \\(a + c\\) : les parenthèses sont indispensables.",
      "\\(a = \\dfrac{b}{a+c} \\Rightarrow a(a+c) = b\\) : ne pas multiplier seulement une partie du membre — le produit en croix s'applique à chaque membre ENTIER.");
    if (v === 1) return mkMC("On donne \\(x = \\dfrac{a + x}{b}\\). En multipliant les deux membres par \\(b\\), puis en isolant \\(x\\) (avec \\(b \\neq 1\\)), on obtient :",
      "\\(x = \\dfrac{a}{b " + NEG + " 1}\\)",
      ["\\(x = \\dfrac{a}{b + 1}\\)", "\\(x = \\dfrac{a}{1 " + NEG + " b}\\)", "\\(x = a\\,(b " + NEG + " 1)\\)"],
      "\\(bx = a + x \\Rightarrow bx " + NEG + " x = a \\Rightarrow x(b " + NEG + " 1) = a\\) : on FACTORISE par x avant de diviser.",
      "Le facteur \\(b " + NEG + " 1\\) vient de la factorisation de \\(x(b-1)\\) : diviser par \\(1 - b\\) donnerait l'opposé — erreur de signe classique.");
    if (v === 2) return mkMC("On donne \\(y = \\dfrac{a\\,x}{x + b}\\). En multipliant les deux membres par \\(x + b\\), quelle égalité obtient-on ?",
      "\\(y\\,(x + b) = a\\,x\\)",
      ["\\(y = a\\,x\\,(x + b)\\)", "\\(y\\,x + b = a\\,x\\)", "\\(y\\,(x + b) = a\\)"],
      "On multiplie chaque membre ENTIER : \\(x + b\\) reste entre parenthèses, et le membre de droite garde son facteur a.",
      "\\(y = \\dfrac{ax}{x+b} \\Rightarrow y(x+b) = ax\\) : écrire \\(yx + b\\) reviendrait à distribuer seulement sur x — grave erreur de parenthèses.");
    if (v === 3) return mkMC("Partant de \\(y\\,(x + b) = a\\,x\\), on développe puis on regroupe les termes en \\(x\\) : \\(y\\,x + y\\,b = a\\,x\\). On en déduit (avec \\(y \\neq a\\)) :",
      "\\(x = \\dfrac{y\\,b}{a " + NEG + " y}\\)",
      ["\\(x = \\dfrac{y\\,b}{y " + NEG + " a}\\)", "\\(x = \\dfrac{a " + NEG + " y}{y\\,b}\\)", "\\(x = \\dfrac{y}{a " + NEG + " b}\\)"],
      "\\(yx " + NEG + " ax = " + NEG + "yb \\Rightarrow x(y " + NEG + " a) = " + NEG + "yb \\Rightarrow x = \\dfrac{yb}{a " + NEG + " y}\\) : attention au signe en factorisant.",
      "La factorisation donne \\(x(y " + NEG + " a) = " + NEG + " yb\\) ; en divisant par \\(y " + NEG + " a\\) puis en simplifiant les signes, \\(x = \\dfrac{yb}{a " + NEG + " y}\\) : c'est la fonction homographique inverse.");
    if (v === 4) return mkMC("Règle du produit en croix : si \\(\\dfrac{a}{X} = c\\) (avec \\(X \\neq 0\\) et \\(c \\neq 0\\)), alors \\(X =\\) ?",
      "\\(X = \\dfrac{a}{c}\\)",
      ["\\(X = \\dfrac{c}{a}\\)", "\\(X = a \\times c\\)", "\\(X = a " + NEG + " c\\)"],
      "Multiplier les deux membres par \\(X\\) : \\(a = c\\,X\\), puis diviser par \\(c\\).",
      "\\(\\dfrac{a}{X} = c \\Rightarrow a = cX \\Rightarrow X = \\dfrac{a}{c}\\) : l'inconnue au DÉNOMINATEUR monte par multiplication, jamais par inversion directe.");
    return mkMC("Règle des fractions : diviser par \\(\\dfrac{p}{q}\\) revient à :",
      "multiplier par son inverse \\(\\dfrac{q}{p}\\)",
      ["multiplier par \\(\\dfrac{p}{q}\\)", "diviser par \\(p\\) puis par \\(q\\)", "additionner son inverse"],
      "Diviser, c'est multiplier par l'inverse : \\(\\dfrac{1}{p/q} = \\dfrac{q}{p}\\).",
      "\\(\\dfrac{a}{\\dfrac{p}{q}} = a \\times \\dfrac{q}{p}\\) : par exemple \\(\\dfrac{1}{\\dfrac{1}{2}} = 2\\).");
  } },
  "lit-numeric": { tag: "Équations littérales", label: "Applications numériques croisées : calculer avec les formules", make: function (d) {
    var v = Math.floor(Math.random() * 10);
    if (v === 0) return mkN("Un mobile parcourt \\(d = 300\\) m en \\(t = 50\\) s. Quelle est sa vitesse moyenne (en m/s) ?",
      6, 0.01, "\\(v = \\dfrac{d}{t}\\).", "\\(v = \\dfrac{300}{50} = 6\\) m/s.");
    if (v === 1) return mkN("Aux bornes d'une résistance \\(R = 4\\) Ω, on mesure \\(U = 12\\) V. Quelle est l'intensité \\(I\\) (en A) ?",
      3, 0.01, "Loi d'Ohm : \\(I = \\dfrac{U}{R}\\).", "\\(I = \\dfrac{12}{4} = 3\\) A.");
    if (v === 2) return mkN("On dissout \\(m = 9\\) g de glucose (\\(M = 18\\) g/mol). Quelle quantité de matière \\(n\\) (en mol) obtient-on ?",
      0.5, 0.005, "\\(n = \\dfrac{m}{M}\\).", "\\(n = \\dfrac{9}{18} = 0{,}5\\) mol.");
    if (v === 3) return mkN("Un disque de rayon \\(r = 2\\) cm : quelle est son aire (en cm², arrondie au centième, π ≈ 3,1416) ?",
      12.57, 0.06, "\\(A = \\pi r^2 = 4\\pi\\).", "\\(A = 4\\pi \\approx 12{,}57\\) cm².");
    if (v === 4) return mkN("Un appareil absorbe \\(I = 2\\) A sous \\(U = 230\\) V. Quelle est sa puissance \\(P\\) (en W) ?",
      460, 0.5, "\\(P = U \\times I\\).", "\\(P = 230 \\times 2 = 460\\) W.");
    if (v === 5) return mkN("Une onde de fréquence \\(f = 170\\) Hz se propage à \\(v = 340\\) m/s. Quelle est sa longueur d'onde \\(\\lambda\\) (en m) ?",
      2, 0.01, "\\(\\lambda = \\dfrac{v}{f}\\).", "\\(\\lambda = \\dfrac{340}{170} = 2\\) m.");
    if (v === 6) return mkN("Un courant de \\(I = 0{,}5\\) A circule pendant \\(t = 60\\) s. Quelle charge \\(Q\\) (en C) a traversé la section ?",
      30, 0.01, "\\(Q = I \\times t\\).", "\\(Q = 0{,}5 \\times 60 = 30\\) C.");
    if (v === 7) return mkN("Un corps de masse \\(m = 2\\) kg se déplace à \\(v = 3\\) m/s. Quelle est son énergie cinétique \\(E_c\\) (en J) ?",
      9, 0.01, "\\(E_c = \\dfrac{1}{2} m v^2\\).", "\\(E_c = \\dfrac{1}{2} \\times 2 \\times 9 = 9\\) J.");
    if (v === 8) return mkN("Un objet de \\(m = 54\\) g occupe \\(V = 20\\) mL. Quelle est sa masse volumique (en g/mL) ?",
      2.7, 0.01, "\\(\\rho = \\dfrac{m}{V}\\).", "\\(\\rho = \\dfrac{54}{20} = 2{,}7\\) g/mL : c'est l'aluminium.");
    return mkN("Un pendule de longueur \\(l = 0{,}25\\) m oscille avec \\(g = 10\\) m/s². Quelle est sa période \\(T\\) (en secondes, arrondie au centième, π ≈ 3,14) ?",
      0.99, 0.06, "\\(T = 2\\pi\\sqrt{\\dfrac{l}{g}}\\).", "\\(T = 2\\pi\\sqrt{\\dfrac{0{,}25}{10}} = 2\\pi \\times 0{,}158 \\approx 0{,}99\\) s : environ une seconde.");
  } },
  "notation-f": { tag: "Seconde", label: "Notations f, f(x), C_f, G_f : relation, image, courbe, graphe", make: function (d) {
    const v = Math.floor(Math.random() * 10);
    if (v === 0) return mkMC("On considère la fonction \\(f\\) définie par \\(f(x) = 2x + 3\\). Que désigne la lettre \\(f\\) toute seule ?",
      "Une relation : le procédé qui à chaque nombre \\(x\\) associe son image \\(2x + 3\\)",
      ["Un nombre : l'image de \\(x\\) par la fonction", "L'ensemble des points de coordonnées \\((x\\,;\\,f(x))\\)", "L'ensemble des couples \\((x\\,;\\,f(x))\\)"],
      "\\(f\\) désigne la fonction elle-même : la « machine » qui transforme un nombre en un autre, pas un nombre.",
      "Trois objets différents se cachent derrière une même lettre : \\(f\\) est une relation (la fonction), \\(f(x)\\) est un nombre, \\(C_f\\) est un ensemble de points et \\(G_f\\) un ensemble de couples.");
    if (v === 1) return mkMC("Toujours pour \\(f(x) = 2x + 3\\) : que désigne l'écriture \\(f(5)\\) ?",
      "Un nombre : l'image de \\(5\\) par la fonction \\(f\\)",
      ["La fonction \\(f\\) elle-même", "Un point du plan", "L'ensemble des couples \\((x\\,;\\,f(x))\\)"],
      "\\(f(5)\\) est un NOMBRE : on remplace \\(x\\) par \\(5\\) dans la formule, ici \\(f(5) = 13\\).",
      "Dès qu'on met une parenthèse avec un nombre derrière \\(f\\), on obtient un nombre : \\(f(5) = 2 \\times 5 + 3 = 13\\). La fonction, elle, reste \\(f\\).");
    if (v === 2) return mkMC("Que désigne \\(C_f\\), la courbe représentative de la fonction \\(f\\) ?",
      "L'ensemble de tous les points \\(M\\) de coordonnées \\((x\\,;\\,f(x))\\) dans le plan",
      ["L'ensemble de tous les couples \\((x\\,;\\,f(x))\\)", "La formule \\(f(x)\\) elle-même", "L'image de \\(x\\) par \\(f\\)"],
      "\\(C_f\\) se DESSINE dans un repère : c'est un ensemble de points du plan.",
      "\\(C_f = \\{ M(x\\,;\\,y) \\;/\\; y = f(x) \\}\\) : chaque point de la courbe a pour ordonnée l'image de son abscisse. À ne pas confondre avec le graphe \\(G_f\\), qui est un ensemble de couples de nombres.");
    if (v === 3) return mkMC("Que désigne \\(G_f\\), le graphe de la fonction \\(f\\) ?",
      "L'ensemble de tous les couples \\((x\\,;\\,f(x))\\)",
      ["L'ensemble de tous les points \\(M(x\\,;\\,f(x))\\) du plan", "La courbe que l'on trace dans un repère", "Le procédé qui à \\(x\\) associe \\(f(x)\\)"],
      "Le graphe est un ensemble de COUPLES de nombres : \\((x\\,;\\,f(x))\\) — sans repère, sans dessin.",
      "\\(G_f = \\{ (x\\,;\\,y) \\;/\\; y = f(x) \\}\\) : on ne dit pas « le point (2 ; 3) appartient à \\(G_f\\) » mais « le COUPLE (2 ; 3) appartient à \\(G_f\\) ». Le point, lui, appartient à la courbe \\(C_f\\).");
    if (v === 4) return mkMC("Quelle est la différence essentielle entre \\(C_f\\) et \\(G_f\\) ?",
      "\\(C_f\\) est un ensemble de POINTS du plan, \\(G_f\\) est un ensemble de COUPLES de nombres",
      ["Aucune : ce sont deux noms du même ensemble de points", "\\(C_f\\) est un ensemble de couples, \\(G_f\\) est un ensemble de points", "\\(G_f\\) ne contient que les couples d'entiers, \\(C_f\\) tous les points"],
      "Mêmes nombres, objets de natures différentes : un point se place dans un repère, un couple s'écrit entre parenthèses.",
      "Le couple \\((2\\,;\\,3)\\) et le point \\(M(2\\,;\\,3)\\) contiennent les mêmes informations, mais le couple \\((2\\,;\\,3) \\in G_f\\) alors que le point \\(M \\in C_f\\).");
    if (v === 5) return mkMC("Le point \\(M\\left(2\\,;\\,f(2)\\right)\\) appartient à quel objet ?",
      "À la courbe représentative \\(C_f\\)",
      ["Au graphe \\(G_f\\)", "À la fonction \\(f\\)", "Au nombre \\(f(2)\\)"],
      "\\(M\\) est un POINT du plan : les points vivent sur la courbe \\(C_f\\).",
      "Piège subtil : c'est le COUPLE \\((2\\,;\\,f(2))\\) qui appartient à \\(G_f\\), tandis que le POINT \\(M(2\\,;\\,f(2))\\) appartient à \\(C_f\\).");
    if (v === 6) return mkMC("Le couple \\(\\left(3\\,;\\,f(3)\\right)\\) appartient à quel objet ?",
      "Au graphe \\(G_f\\)",
      ["À la courbe représentative \\(C_f\\)", "À la fonction \\(f\\)", "À l'image de \\(3\\)"],
      "Un COUPLE de nombres appartient au graphe \\(G_f\\), pas à la courbe.",
      "Piège inverse du précédent : le couple \\((3\\,;\\,f(3)) \\in G_f\\), alors que le point \\(M(3\\,;\\,f(3)) \\in C_f\\). Un couple n'est pas un point !");
    if (v === 7) return mkMC("La courbe \\(C_f\\) passe par le point \\(A(a\\,;\\,b)\\). Comment traduire cette information ?",
      "\\(f(a) = b\\)",
      ["\\(f(b) = a\\)", "\\(b = a\\)", "\\(f(a\\,;\\,b) = 0\\)"],
      "« Le point d'abscisse \\(a\\) est sur la courbe » signifie : son ordonnée \\(b\\) EST l'image de \\(a\\).",
      "\\(A(a\\,;\\,b) \\in C_f \\iff b = f(a) \\iff (a\\,;\\,b) \\in G_f\\) : les trois façons de dire la même chose — point sur la courbe, image, couple dans le graphe.");
    if (v === 8) return mkMC("Un élève écrit : « \\(f = 2x + 3\\) ». Quelle est la notation correcte ?",
      "\\(f(x) = 2x + 3\\)",
      ["\\(f = 2x + 3\\) est correct", "\\(C_f = 2x + 3\\)", "\\(f(2x + 3) = x\\)"],
      "\\(f\\) est une fonction, pas un nombre : on ne peut pas lui « égaler » une expression numérique. L'égalité porte sur l'image \\(f(x)\\).",
      "Rédiger « \\(f = 2x + 3\\) » compare une relation avec un nombre : impossible. On écrit « \\(f\\) est définie par \\(f(x) = 2x + 3\\) » : pour tout \\(x\\), l'image \\(f(x)\\) vaut \\(2x + 3\\).");
    const xf = R(2, 5);
    return mkN("Une fonction \\(f\\) est définie par \\(f(x) = x^2 " + NEG + " 1\\). Que vaut \\(f(" + xf + ")\\) ?",
      xf * xf - 1, 0.01,
      "\\(f(" + xf + ")\\) est l'image de " + xf + " : remplacer \\(x\\) par " + xf + " dans la formule.",
      "\\(f(" + xf + ") = " + xf + "^2 " + NEG + " 1 = " + (xf * xf) + " " + NEG + " 1 = " + (xf * xf - 1) + "\\) : un nombre, image de " + xf + " par \\(f\\). Le point \\(M(" + xf + "\\,;\\," + (xf * xf - 1) + ")\\) est sur \\(C_f\\), le couple \\((" + xf + "\\,;\\," + (xf * xf - 1) + ")\\) est dans \\(G_f\\).");
  } }
});
