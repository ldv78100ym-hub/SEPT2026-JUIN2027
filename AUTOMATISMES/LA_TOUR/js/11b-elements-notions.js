/* ============================================================
   11b. ÉLÉMENTS SIMPLES & FICHES DE RAPPEL
   Chaque notion se DÉCOMPOSE en éléments simples : un élément =
   un type d'exercice (générateur) identifié par un LIBELLÉ clair,
   un RAPPEL de cours (infobulle au survol) et des FICHES
   thématiques (modales détaillées ouvertes d'un clic).
   Utilisé par : la modale « Progression des notions », la modale
   « Notions passées » et la SOLUTION PÉDAGOGIQUE de la leçon
   affichée après chaque erreur (16b-solution-pedagogique.js).
   ============================================================ */

/* ------------------------------------------------------------
   FICHES THÉMATIQUES — rappels de cours complets, détaillés,
   rigoureux, ouverts via les boutons « 📚 » de la leçon,
   des éléments et des notions passées.
   ------------------------------------------------------------ */
const FICHES = {
  'calcul': { titre: '🧮 Calcul mental et opérations posées', html: `
    <p><b>Priorités opératoires :</b> 1) parenthèses — 2) multiplications et divisions — 3) additions et soustractions, de gauche à droite.
    Exemple : \\(3+4\\times2=3+8=11\\), mais \\((3+4)\\times2=14\\).</p>
    <p><b>Addition posée :</b> aligner unités, dizaines, centièmes… colonne par colonne de droite à gauche ; reporter la retenue.</p>
    <p><b>Soustraction posée :</b> si un chiffre du haut est trop petit, emprunter une dizaine à la colonne de gauche (méthode par emprunt/casse).</p>
    <p><b>Multiplication posée :</b> distribuer chaque chiffre du multiplicateur, décaler d'un rang à chaque ligne, puis additionner.</p>
    <p><b>Division euclidienne :</b> \\(\\text{dividende}=\\text{diviseur}\\times\\text{quotient}+\\text{reste}\\), avec \\(0\\le\\text{reste} \\lt \\text{diviseur}\\).
    Exemple : \\(47=5\\times9+2\\) : quotient 9, reste 2.</p>
    <p><b>Vérification :</b> toujours estimer l'ordre de grandeur (arrondir) pour repérer une erreur de position.</p>` },

  'nombres': { titre: '🔢 Nombres : décimaux, relatifs, fractions, puissances, racines', html: `
    <p><b>Ensembles emboîtés :</b> \\(\\mathbb{N}\\subset\\mathbb{Z}\\subset\\mathbb{Q}\\subset\\mathbb{R}\\) — entiers naturels, relatifs, rationnels, réels.</p>
    <p><b>Décimaux :</b> \\(3{,}45=3+\\dfrac4{10}+\\dfrac5{100}\\). Comparer : partie entière d'abord, puis les décimales de gauche à droite.</p>
    <p><b>Relatifs — règle des signes :</b> \\((-)(-)=+\\), \\((+)(-)=-\\). Soustraire un négatif, c'est additionner : \\(a-(-b)=a+b\\).</p>
    <p><b>Fractions :</b> pour additionner/soustraire, même dénominateur : \\(\\dfrac ab\\pm\\dfrac cb=\\dfrac{a\\pm c}b\\).
    Produit : \\(\\dfrac ab\\times\\dfrac cd=\\dfrac{ac}{bd}\\). Division : multiplier par l'inverse : \\(\\dfrac ab\\div\\dfrac cd=\\dfrac ab\\times\\dfrac dc\\).
    Comparer : même dénominateur ou produit en croix. Simplifier par le PGCD.</p>
    <p><b>Puissances :</b> \\(a^m\\times a^n=a^{m+n}\\), \\(\\dfrac{a^m}{a^n}=a^{m-n}\\), \\((a^m)^n=a^{mn}\\), \\(a^{-n}=\\dfrac1{a^n}\\), \\(a^0=1\\), \\((ab)^n=a^n b^n\\).</p>
    <p><b>Racines carrées :</b> \\(\\sqrt{a}\\ge0\\), \\(\\sqrt{a^2}=|a|\\), \\(\\sqrt{ab}=\\sqrt a\\,\\sqrt b\\) (a, b ≥ 0), \\(\\sqrt{\\dfrac ab}=\\dfrac{\\sqrt a}{\\sqrt b}\\).
    Attention : \\(\\sqrt{a+b}\\ne\\sqrt a+\\sqrt b\\).</p>
    <p><b>PGCD :</b> algorithme d'Euclide : \\(\\text{PGCD}(a,b)=\\text{PGCD}(b,\\text{reste})\\). Une fraction irréductible a numérateur et dénominateur premiers entre eux.</p>` },

  'unites': { titre: '📏 Unités, conversions & mesures', html: `
    <p><b>Préfixes SI :</b> \\(k=10^3\\), \\(h=10^2\\), \\(\\text{da}=10\\), \\(d=10^{-1}\\), \\(c=10^{-2}\\), \\(m=10^{-3}\\),
    \\(\\mu=10^{-6}\\), \\(n=10^{-9}\\), \\(p=10^{-12}\\), \\(f=10^{-15}\\). Chaque échelon vaut ×10 (ou ×10² pour les aires, ×10³ pour les volumes).</p>
    <p><b>Conversion :</b> on multiplie en descendant vers l'unité plus petite, on divise en remontant : \\(1\\,\\text{m}=100\\,\\text{cm}\\), \\(1\\,\\text{kg}=1000\\,\\text{g}\\).</p>
    <p><b>Volumes et capacités :</b> \\(1\\,\\text{L}=1\\,\\text{dm}^3\\), \\(1\\,\\text{mL}=1\\,\\text{cm}^3\\).</p>
    <p><b>Temps :</b> \\(1\\,\\text{h}=60\\,\\text{min}=3600\\,\\text{s}\\) ; « 3 h 40 » = \\(3\\times60+40=220\\) min. Attention : 1 h 30 = 1,5 h, pas 1,30 h.</p>
    <p><b>Notation scientifique :</b> \\(a\\times10^n\\) avec \\(1\\le|a| \\lt 10\\). Exemple : \\(0{,}00052=5{,}2\\times10^{-4}\\).</p>
    <p><b>Chiffres significatifs :</b> le résultat d'un calcul garde l'ordre de précision de la donnée la moins précise. On arrondit au dernier chiffre significatif pertinent.</p>
    <p><b>Astronomie :</b> \\(1\\,\\text{ua}\\approx1{,}496\\times10^8\\) km ; \\(1\\,\\text{a.l.}\\approx9{,}46\\times10^{12}\\) km (distance parcourue par la lumière en 1 an à \\(3\\times10^8\\) m/s).</p>` },

  'geometrie': { titre: '📐 Périmètres, aires, volumes & polygones', html: `
    <p><b>Périmètres :</b> rectangle \\(2(L+l)\\) ; cercle \\(2\\pi r\\) ; triangle \\(a+b+c\\).</p>
    <p><b>Aires :</b> rectangle \\(L\\times l\\) ; triangle \\(\\dfrac{\\text{base}\\times\\text{hauteur}}2\\) ;
    parallélogramme \\(\\text{base}\\times\\text{hauteur}\\) ; trapèze \\(\\dfrac{(B+b)\\times h}2\\) ; disque \\(\\pi r^2\\).</p>
    <p><b>Volumes :</b> cube \\(a^3\\) ; pavé \\(abc\\) ; prisme/cylindre \\(B\\times h\\) (donc cylindre \\(\\pi r^2 h\\)) ;
    pyramide/cône \\(\\dfrac13 B h\\) (donc cône \\(\\dfrac13\\pi r^2 h\\)) ; sphère \\(\\dfrac43\\pi r^3\\), aire \\(4\\pi r^2\\).</p>
    <p><b>Polygone régulier à n côtés :</b> angle au centre \\(\\dfrac{360\\degree}{n}\\) ; angle intérieur \\(\\dfrac{(n-2)\\times180\\degree}{n}\\) ;
    aire \\(\\dfrac{\\text{périmètre}\\times\\text{apothème}}2\\). Il possède n axes de symétrie.</p>
    <p><b>Symétries usuelles :</b> cercle : infinité d'axes ; carré : 4 ; rectangle : 2 ; segment : sa médiatrice ; angle : sa bissectrice.</p>
    <p><b>Transformations :</b> symétrie axiale (pliage : perpendiculaire à l'axe, à distance égale), symétrie centrale (demi-tour autour du centre),
    translation (glissement d'un vecteur), rotation (autour d'un centre, d'un angle et d'un sens donnés). Chaque point a une image unique.</p>` },

  'pythagore-thales': { titre: '📐 Pythagore & Thalès', html: `
    <p><b>Pythagore :</b> si le triangle est <u>rectangle en A</u>, alors \\(BC^2=AB^2+AC^2\\).
    L'hypoténuse \\(BC\\) est le côté OPPOSÉ à l'angle droit — c'est le plus long côté. Pour trouver \\(BC\\) : \\(BC=\\sqrt{AB^2+AC^2}\\).</p>
    <p><b>Réciproque :</b> si \\(BC^2=AB^2+AC^2\\), alors le triangle est rectangle en A.</p>
    <p><b>Thalès :</b> si \\(M\\in[AB]\\), \\(N\\in[AC]\\) et \\((MN)\\parallel(BC)\\), alors
    \\(\\dfrac{AM}{AB}=\\dfrac{AN}{AC}=\\dfrac{MN}{BC}\\). On compare TOUJOURS les rapports dans le même « fût » (AM/AB et non AM/AC).</p>
    <p><b>Réciproque :</b> si les rapports sont égaux (et les points bien placés), alors les droites sont parallèles.</p>
    <p><b>Agrandissement-réduction :</b> rapport k sur les longueurs ⇒ \\(k^2\\) sur les aires, \\(k^3\\) sur les volumes.</p>` },

  'trigo-triangle': { titre: '📐 Trigonométrie dans le triangle rectangle', html: `
    <p><b>Somme des angles :</b> \\(\\alpha+\\beta+\\gamma=180\\degree\\) dans tout triangle. Triangle isocèle : angles à la base égaux.</p>
    <p><b>Dans un triangle rectangle</b> (hypoténuse = côté opposé à l'angle droit) :</p>
    <p style="text-align:center"><b>SOH — CAH — TOA</b><br>
    \\(\\sin\\theta=\\dfrac{\\text{opposé}}{\\text{hypoténuse}}\\quad
    \\cos\\theta=\\dfrac{\\text{adjacent}}{\\text{hypoténuse}}\\quad
    \\tan\\theta=\\dfrac{\\text{opposé}}{\\text{adjacent}}\\)</p>
    <p><b>Angles complémentaires :</b> \\(\\cos(90\\degree-\\theta)=\\sin\\theta\\) et \\(\\sin(90\\degree-\\theta)=\\cos\\theta\\).</p>
    <p><b>Retrouver un angle :</b> \\(\\theta=\\arcsin(x)\\), \\(\\arccos(x)\\) ou \\(\\arctan(x)\\) (touche sin⁻¹, cos⁻¹, tan⁻¹ de la calculatrice, en degrés).</p>` },

  'trigo-cercle': { titre: '🟠 Cercle trigonométrique, valeurs & équations', html: `
    <p><b>Cercle trigonométrique :</b> rayon 1, sens direct (anti-horaire). Le point \\(M(x)\\) a pour coordonnées \\((\\cos x\\,;\\,\\sin x)\\) :
    le cosinus se lit sur l'axe des abscisses, le sinus sur l'axe des ordonnées. Un tour complet = \\(2\\pi\\) radians = 360°.</p>
    <p><b>Valeurs remarquables :</b></p>
    <table class="tt"><thead><tr><th>\\(x\\)</th><th>\\(0\\)</th><th>\\(\\dfrac\\pi6\\)</th><th>\\(\\dfrac\\pi4\\)</th><th>\\(\\dfrac\\pi3\\)</th><th>\\(\\dfrac\\pi2\\)</th><th>\\(\\pi\\)</th></tr></thead>
    <tbody><tr><td class="lab">\\(\\cos x\\)</td><td>1</td><td>\\(\\dfrac{\\sqrt3}2\\)</td><td>\\(\\dfrac{\\sqrt2}2\\)</td><td>\\(\\dfrac12\\)</td><td>0</td><td>−1</td></tr>
    <tr><td class="lab">\\(\\sin x\\)</td><td>0</td><td>\\(\\dfrac12\\)</td><td>\\(\\dfrac{\\sqrt2}2\\)</td><td>\\(\\dfrac{\\sqrt3}2\\)</td><td>1</td><td>0</td></tr></tbody></table>
    <p><b>Propriétés :</b> périodicité \\(\\cos(x+2k\\pi)=\\cos x\\) ; parité \\(\\cos(-x)=\\cos x\\) (pair), \\(\\sin(-x)=-\\sin x\\) (impair).</p>
    <p><b>Angles associés :</b> \\(\\cos(\\pi-x)=-\\cos x\\), \\(\\sin(\\pi-x)=\\sin x\\) ;
    \\(\\cos(\\pi+x)=-\\cos x\\), \\(\\sin(\\pi+x)=-\\sin x\\) ;
    \\(\\cos\\left(\\dfrac\\pi2-x\\right)=\\sin x\\), \\(\\sin\\left(\\dfrac\\pi2-x\\right)=\\cos x\\).</p>
    <p><b>Équations :</b> \\(\\cos x=a\\) a des solutions si \\(|a|\\le1\\) : \\(x=\\pm\\arccos a+2k\\pi\\).
    \\(\\sin x=a\\) : \\(x=\\arcsin a+2k\\pi\\) ou \\(x=\\pi-\\arcsin a+2k\\pi\\).
    Sur \\([0\\,;\\,2\\pi[\\), lire les points d'intersection du cercle avec la droite \\(x=a\\) (ou \\(y=a\\)).</p>
    <p><b>Courbes :</b> sinus et cosinus sont des sinusoïdes de période \\(2\\pi\\), valeurs dans \\([-1\\,;\\,1]\\) ;
    la courbe du cosinus passe par (0 ; 1), celle du sinus par (0 ; 0).</p>
    <p><b>Angles orientés :</b> définis modulo \\(2\\pi\\) avec un sens (direct +, indirect −).
    <b>Rotation</b> de centre O, d'angle \\(\\theta\\) : \\(M(x\\,;\\,y)\\mapsto M'(x\\cos\\theta-y\\sin\\theta\\,;\\,x\\sin\\theta+y\\cos\\theta)\\).
    Cas particulier \\(+\\dfrac\\pi2\\) : \\((x\\,;\\,y)\\mapsto(-y\\,;\\,x)\\).</p>` },

  'algebre': { titre: '❎ Calcul littéral, équations & factorisations', html: `
    <p><b>Développer :</b> simple distributivité \\(a(b+c)=ab+ac\\) ; double distributivité \\((a+b)(c+d)=ac+ad+bc+bd\\). Réduire = regrouper les termes de même puissance.</p>
    <p><b>Équation du 1ᵉʳ degré :</b> la même opération des deux côtés ; transposer en changeant le signe ; diviser par le coefficient de \\(x\\).
    Exemple : \\(3x-5=7 \\Rightarrow 3x=12 \\Rightarrow x=4\\).</p>
    <p><b>Inéquation :</b> comme une équation, MAIS multiplier/diviser par un négatif INVERSE le sens.
    \\(-2x \\lt 6 \\Rightarrow x \\gt -3\\).</p>
    <p><b>Identités remarquables :</b> \\(a^2-b^2=(a-b)(a+b)\\) ; \\(a^2+2ab+b^2=(a+b)^2\\) ; \\(a^2-2ab+b^2=(a-b)^2\\).</p>
    <p><b>Factoriser :</b> ① facteur commun \\(ka+kb=k(a+b)\\) ; ② identité remarquable ; ③ groupement ;
    ④ double factorisation (d'abord un facteur commun, puis une identité).</p>
    <p><b>Équation produit-nul :</b> \\(A\\times B=0 \\iff A=0\\) <u>ou</u> \\(B=0\\). On factorise AVANT de résoudre —
    diviser par \\(x\\) ferait perdre la solution \\(x=0\\).</p>
    <p><b>Signe d'un produit/quotient :</b> tableau de signes, règle \\((+)\\times(-)=-\\), \\((-)\\times(-)=+\\) ;
    valeurs interdites du dénominateur barrées.</p>` },

  'second-degre': { titre: '🟨 Second degré : formes, discriminant, signe', html: `
    <p><b>Trois formes d'un trinôme \\(f(x)=ax^2+bx+c\\) (a ≠ 0) :</b><br>
    • développée : \\(ax^2+bx+c\\) ;<br>
    • canonique : \\(a(x-\\alpha)^2+\\beta\\) avec \\(\\alpha=-\\dfrac{b}{2a}\\) et \\(\\beta=f(\\alpha)=-\\dfrac\\Delta{4a}\\) —
    le sommet de la parabole est \\(S(\\alpha\\,;\\,\\beta)\\), son axe de symétrie \\(x=\\alpha\\) ;<br>
    • factorisée : \\(a(x-x_1)(x-x_2)\\) quand les racines existent.</p>
    <p><b>Discriminant :</b> \\(\\Delta=b^2-4ac\\). Si \\(\\Delta \\gt 0\\) : deux racines distinctes
    \\(x_{1,2}=\\dfrac{-b\\pm\\sqrt\\Delta}{2a}\\) ; si \\(\\Delta=0\\) : racine double \\(x_0=-\\dfrac b{2a}\\) ;
    si \\(\\Delta \\lt 0\\) : aucune racine réelle.</p>
    <p><b>Somme et produit des racines :</b> \\(x_1+x_2=-\\dfrac ba\\), \\(x_1 x_2=\\dfrac ca\\) — précieux pour trouver des racines « évidentes ».</p>
    <p><b>Signe (a &gt; 0) :</b> \\(f(x) \\gt 0\\) à l'extérieur des racines, \\(f(x) \\lt 0\\) entre les racines ; pour a &lt; 0, c'est l'inverse.
    On dresse un tableau de signes : ligne du trinôme = « + 0 − 0 + ».</p>
    <p><b>Inéquations :</b> résoudre \\(ax^2+bx+c\\ge0\\), c'est lire dans le tableau les intervalles où le signe convient ;
    crochets fermés aux racines (valeur qui annule), attention aux valeurs interdites d'un quotient.</p>
    <p><b>Degré 3 :</b> chercher une racine évidente \\(r\\) (diviseurs de la constante), puis factoriser \\(P(x)=(x-r)(ax^2+bx+c)\\)
    en identifiant les coefficients ; on retombe sur le second degré.</p>` },

  'fonctions': { titre: '𝑓 Fonctions : images, antécédents, lectures graphiques', html: `
    <p><b>Vocabulaire :</b> \\(f\\) est la fonction (une règle), \\(f(x)\\) est l'IMAGE du nombre \\(x\\) — un nombre.
    On écrit « \\(f\\) est définie par \\(f(x)=x^2-1\\) », jamais « \\(f=x^2-1\\) ».
    \\(C_f\\) est la courbe (ensemble des points \\(M(x\\,;\\,f(x))\\)) ; \\(G_f\\) est le graphe (ensemble des couples \\((x\\,;\\,f(x))\\)).</p>
    <p><b>Image / antécédent :</b> l'image de \\(a\\) est UNIQUE : \\(f(a)\\) se calcule en remplaçant \\(x\\) par \\(a\\).
    Les antécédents de \\(y\\) sont les \\(x\\) tels que \\(f(x)=y\\) : il peut y en avoir plusieurs, un seul ou aucun.</p>
    <p><b>Fonction affine :</b> \\(f(x)=ax+b\\) : a = coefficient directeur (pente), b = ordonnée à l'origine (\\(f(0)\\)).
    Croissante si a &gt; 0, décroissante si a &lt; 0. Linéaire : \\(f(x)=ax\\), droite passant par O (situation de proportionnalité).</p>
    <p><b>Fonctions de référence :</b> \\(x\\mapsto x^2\\) (parabole, paire) ; \\(x\\mapsto x^3\\) ;
    \\(x\\mapsto\\dfrac1x\\) (hyperbole, définie sur \\(\\mathbb{R}^*\\), impaire) ; \\(x\\mapsto\\sqrt x\\) (définie sur \\([0\\,;\\,+\\infty[\\)).</p>
    <p><b>Lecture graphique :</b> image de \\(a\\) = ordonnée du point de \\(C_f\\) d'abscisse \\(a\\) ;
    antécédents de \\(k\\) = abscisses des points d'intersection avec la droite \\(y=k\\).</p>
    <p><b>Résolution graphique de \\(f(x)=g(x)\\) :</b> lire les abscisses des points d'intersection des deux courbes.
    \\(f(x) \\lt g(x)\\) : intervalles où \\(C_f\\) est EN DESSOUS de \\(C_g\\).</p>
    <p><b>Variations :</b> croissante sur I si pour tous \\(a \\lt b\\) de I, \\(f(a)\\le f(b)\\) ; tableau de variations :
    flèche montante/descendante, valeurs aux bornes, extremum là où la flèche change de sens.</p>` },

  'derivees': { titre: '📈 Dérivées, tangentes, Euler & optimisation', html: `
    <p><b>Taux d'accroissement :</b> \\(\\dfrac{f(a+h)-f(a)}{h}\\). Sa limite quand \\(h\\to0\\) est le nombre dérivé \\(f'(a)\\) :
    c'est la PENTE de la tangente à \\(C_f\\) au point d'abscisse \\(a\\). Ne jamais remplacer \\(h\\) par 0 avant d'avoir simplifié.</p>
    <p><b>Calcul type :</b> développer \\(f(a+h)\\), soustraire \\(f(a)\\), factoriser par \\(h\\), simplifier le quotient, puis \\(h\\to0\\).
    Pour \\(\\sqrt{a+h}\\), multiplier par la quantité conjuguée \\(\\sqrt{a+h}+\\sqrt a\\).</p>
    <p><b>Dérivées usuelles :</b> \\((x^n)'=nx^{n-1}\\) ; \\((\\sqrt u)'=\\dfrac{u'}{2\\sqrt u}\\) ;
    \\(\\left(\\dfrac1u\\right)'=-\\dfrac{u'}{u^2}\\) ; \\((u^n)'=n\\,u'\\,u^{n-1}\\) ; \\((e^x)'=e^x\\) ; \\((\\ln x)'=\\dfrac1x\\) ;
    constante → 0.</p>
    <p><b>Tangente en \\(a\\) :</b> \\(y=f'(a)(x-a)+f(a)\\). Graphiquement : sa pente se lit \\(\\dfrac{\\Delta y}{\\Delta x}\\)
    entre deux points de la droite ; elle coupe la courbe au point \\((a\\,;\\,f(a))\\).</p>
    <p><b>Lien f′ / variations :</b> \\(f' \\gt 0\\) sur un intervalle ⇒ \\(f\\) croissante ; \\(f' \\lt 0\\) ⇒ décroissante ;
    \\(f'(a)=0\\) avec changement de signe ⇒ extremum local. Lire \\(C_{f'}\\) : au-dessus de l'axe ⇔ \\(f\\) croissante.</p>
    <p><b>Méthode d'Euler :</b> approximer la courbe en suivant les tangentes :
    \\(x_{n+1}=x_n+h\\), \\(y_{n+1}=y_n+h\\,f'(x_n)\\). Plus le pas h est petit, plus l'approximation est fidèle.</p>
    <p><b>Optimisation :</b> dériver, chercher \\(f'(x)=0\\), dresser le tableau de signes de \\(f'\\) pour prouver un maximum/minimum.</p>` },

  'tableaux': { titre: '📊 Tableaux de signes & de variations', html: `
    <p><b>Tableau de signes :</b> une ligne par facteur ; chaque facteur change de signe en ses racines ;
    on combine avec la règle des signes : \\((+)\\times(+)=+\\), \\((+)\\times(-)=-\\), \\((-)\\times(-)=+\\).
    Pour un quotient, barrer la valeur interdite (dénominateur nul).</p>
    <p><b>Tableau de variations :</b> flèches ↗ (croissante) et ↘ (décroissante) ; on reporte les valeurs aux bornes de chaque intervalle ;
    un extremum apparaît là où la flèche change de sens. Double barre en une valeur interdite.</p>
    <p><b>Lecture d'une courbe :</b> \\(f(x) \\gt 0\\) là où la courbe est au-dessus de l'axe des abscisses ;
    croissante là où elle « monte » quand on lit de gauche à droite.</p>` },

  'suites': { titre: '🪜 Suites arithmétiques & géométriques', html: `
    <p><b>Suite arithmétique :</b> \\(u_{n+1}=u_n+r\\) (r = raison). Forme explicite : \\(u_n=u_0+n\\,r\\).
    Sens : croissante si \\(r \\gt 0\\), décroissante si \\(r \\lt 0\\).
    Somme des \\((n+1)\\) premiers termes : \\(\\dfrac{(\\text{nombre de termes})\\times(\\text{premier}+\\text{dernier})}{2}\\).</p>
    <p><b>Suite géométrique :</b> \\(u_{n+1}=q\\,u_n\\) (q = raison). Forme explicite : \\(u_n=u_0\\,q^n\\).
    Sens : croissante si \\(q \\gt 1\\) (avec \\(u_0 \\gt 0\\)), constante si \\(q=1\\), décroissante si \\(0 \\lt q \\lt 1\\).
    Somme : \\(u_0\\dfrac{1-q^{n+1}}{1-q}\\) (n+1 termes, q ≠ 1).</p>
    <p><b>Sur un graphique :</b> arithmétique = points alignés ; géométrique = points sur une courbe exponentielle.</p>
    <p><b>Isoler un terme dans une somme :</b> la somme des termes dépend du NOMBRE de termes : de \\(u_0\\) à \\(u_n\\) il y a \\(n+1\\) termes.</p>` },

  'proportionnalite': { titre: '％ Proportionnalité, pourcentages & évolutions', html: `
    <p><b>Proportionnalité :</b> tableau : le coefficient \\(k=\\dfrac{y}{x}\\) est constant ; produit en croix :
    \\(\\dfrac ab=\\dfrac cd \\iff ad=bc\\).</p>
    <p><b>Pourcentage :</b> t % de V = \\(\\dfrac t{100}\\times V\\). Prendre t %, c'est multiplier par \\(\\dfrac t{100}\\).</p>
    <p><b>Évolution :</b> augmenter de t % ⇔ multiplier par \\(1+\\dfrac t{100}\\) (coefficient multiplicateur) ;
    diminuer de t % ⇔ multiplier par \\(1-\\dfrac t{100}\\).</p>
    <p><b>Valeur finale :</b> \\(V_f=V_i\\times\\text{CM}\\). <b>Valeur initiale :</b> \\(V_i=\\dfrac{V_f}{\\text{CM}}\\) (on DIVISE, jamais on ne retranche t %).</p>
    <p><b>Évolutions successives :</b> les coefficients multiplicateurs se MULTIPLIENT
    (\\(+20\\%\\) puis \\(+10\\%\\) ⇔ ×1,2 ×1,1 = ×1,32, soit +32 %, et non +30 %).</p>
    <p><b>Taux réciproque :</b> le coefficient qui « annule » une évolution est l'inverse du coefficient :
    après \\(+25\\%\\) (×1,25), il faut ×0,8, soit \\(-20\\%\\). Taux global de deux évolutions : \\(\\text{CM}_1\\times\\text{CM}_2-1\\).</p>` },

  'probabilites': { titre: '🎲 Probabilités : bases, conditionnement, arbres', html: `
    <p><b>Équiprobabilité :</b> \\(P(A)=\\dfrac{\\text{nombre de cas favorables}}{\\text{nombre de cas possibles}}\\) ;
    toute probabilité vérifie \\(0\\le P(A)\\le1\\) ; la somme des probabilités des issues vaut 1.</p>
    <p><b>Complémentaire :</b> \\(P(\\bar A)=1-P(A)\\). <b>Réunion :</b> \\(P(A\\cup B)=P(A)+P(B)-P(A\\cap B)\\).</p>
    <p><b>Probabilité conditionnelle :</b> \\(P_A(B)=\\dfrac{P(A\\cap B)}{P(A)}\\) — on se RESTREINT aux cas où A est réalisé.</p>
    <p><b>Arbre pondéré :</b> le long d'une branche on MULTIPLIE, à un nœud la somme des branches vaut 1 ;
    \\(P(A\\cap B)=P(A)\\times P_A(B)\\).</p>
    <p><b>Formule des probabilités totales :</b> si \\(A_1, A_2,\\dots\\) partitionnent l'univers,
    \\(P(B)=P(A_1\\cap B)+P(A_2\\cap B)+\\dots\\) — additionner toutes les branches menant à B.</p>
    <p><b>Indépendance :</b> \\(P(A\\cap B)=P(A)\\times P(B)\\) (équivalent à \\(P_A(B)=P(B)\\)).</p>
    <p><b>Variable aléatoire :</b> loi = valeurs \\(x_i\\) et probabilités \\(p_i\\) (somme 1) ;
    espérance \\(E(X)=\\sum p_i x_i\\).</p>
    <p><b>Répétition de n épreuves identiques et indépendantes (schéma de Bernoulli) :</b>
    \\(P(X=k)=\\binom nk p^k(1-p)^{n-k}\\). Intervalle de fluctuation : la fréquence observée fluctue autour de p.</p>` },

  'statistiques': { titre: '📊 Statistiques & séries statistiques', html: `
    <p><b>Effectifs et fréquences :</b> fréquence \\(=\\dfrac{\\text{effectif}}{\\text{effectif total}}\\) (souvent en %). La somme vaut 1 (100 %).</p>
    <p><b>Moyenne :</b> \\(\\bar x=\\dfrac{\\sum n_i x_i}{N}\\) ; moyenne pondérée = somme des (valeur × effectif) ÷ effectif total.</p>
    <p><b>Médiane :</b> valeur qui partage la série ordonnée en deux effectifs égaux.
    <b>Quartiles :</b> Q1 (25 % des valeurs en dessous), Q3 (75 %). <b>Étendue :</b> max − min.</p>
    <p><b>Boîte à moustaches :</b> min, Q1, médiane, Q3, max : lecture immédiate de la dispersion.</p>
    <p><b>Séries croisées (tableau double entrée) :</b> totaux lignes et colonnes ; une fréquence se calcule par rapport au total qui correspond à la question (ligne OU colonne OU ensemble).</p>
    <p><b>Nuage de points & ajustement :</b> point moyen \\(G(\\bar x\\,;\\,\\bar y)\\) ; droite d'ajustement (tendance) passant près de G ;
    elle permet d'ESTIMER (interpolation, prudence pour l'extrapolation).</p>
    <p><b>Lecture de graphiques :</b> barres (comparer des hauteurs), circulaire (parts d'un total, angles proportionnels), courbe (évolution).</p>` },

  'vecteurs': { titre: '→ Vecteurs, droites, systèmes & produit scalaire', html: `
    <p><b>Vecteur :</b> défini par direction, sens, norme. \\(\\overrightarrow{AB}\\) va de A vers B ;
    coordonnées : \\(\\overrightarrow{AB}(x_B-x_A\\,;\\,y_B-y_A)\\) ; norme \\(\\|\\overrightarrow{AB}\\|=\\sqrt{(x_B-x_A)^2+(y_B-y_A)^2}\\).</p>
    <p><b>Milieu :</b> \\(M\\left(\\dfrac{x_A+x_B}2\\,;\\,\\dfrac{y_A+y_B}2\\right)\\). <b>Relation de Chasles :</b> \\(\\overrightarrow{AB}+\\overrightarrow{BC}=\\overrightarrow{AC}\\).</p>
    <p><b>Droite :</b> équation réduite \\(y=mx+p\\) ; \\(m=\\dfrac{y_B-y_A}{x_B-x_A}\\) (pente), \\(p=y\\) à \\(x=0\\).
    Parallèles ⇔ même pente ; sécantes ⇔ résoudre l'égalité des y.</p>
    <p><b>Système 2×2 :</b> substitution (isoler une inconnue) ou combinaison (éliminer une inconnue en additionnant des lignes bien choisies).
    Couple solution = point d'intersection des deux droites.</p>
    <p><b>Produit scalaire :</b> \\(\\vec u\\cdot\\vec v=xx'+yy'=\\|\\vec u\\|\\,\\|\\vec v\\|\\cos\\theta\\).
    Orthogonaux \\(\\iff\\vec u\\cdot\\vec v=0\\).</p>
    <p><b>Repérage :</b> abscisse (x), ordonnée (y) ; quadrants ; symétrie par rapport aux axes : \\((x\\,;\\,y)\\mapsto(-x\\,;\\,y)\\), etc.</p>` },

  'espace': { titre: '📦 Espace : repérage & solides', html: `
    <p><b>Coordonnées dans l'espace :</b> \\(M(x\\,;\\,y\\,;\\,z)\\) — abscisse, ordonnée, cote.
    Distance : \\(AB=\\sqrt{(x_B-x_A)^2+(y_B-y_A)^2+(z_B-z_A)^2}\\) ; milieu : moyenne des coordonnées.</p>
    <p><b>Solides usuels :</b> cube, pavé droit, prisme, cylindre, pyramide, cône, sphère — volumes usuels (fiche 📐 Géométrie).</p>
    <p><b>Patron et vue :</b> un solide peut être « déplié » ; les vues de face/dessus/profil donnent les vraies dimensions sur chaque axe.</p>` },

  'complexes': { titre: '🧿 Nombres complexes', html: `
    <p><b>Forme algébrique :</b> \\(z=a+\\mathrm ib\\) avec \\(\\mathrm i^2=-1\\) ; a = partie réelle, b = partie imaginaire.</p>
    <p><b>Opérations :</b> sommer terme à terme ; multiplier en développant puis \\(\\mathrm i^2=-1\\) ;
    conjugué \\(\\bar z=a-\\mathrm ib\\) et \\(z\\bar z=a^2+b^2\\).</p>
    <p><b>Module :</b> \\(|z|=\\sqrt{a^2+b^2}\\) — distance à l'origine du point \\(M(a\\,;\\,b)\\).</p>
    <p><b>Forme trigonométrique :</b> \\(z=r(\\cos\\theta+\\mathrm i\\sin\\theta)\\) avec \\(r=|z|\\) et \\(\\theta\\) l'argument ;
    \\(a=r\\cos\\theta\\), \\(b=r\\sin\\theta\\). Valeurs remarquables usuelles (fiche 🟠 Trigonométrie).</p>` },

  'python': { titre: '🐍 Python : variables, boucles & indentations', html: `
    <p><b>Affectation :</b> \\(\\texttt{s = 0}\\) crée/écrase s. Un accumulateur s'initialise AVANT la boucle (\\(\\texttt{s = 0}\\) pour une somme,
    \\(\\texttt{n = 0}\\) pour un compteur) puis se met à jour dans la boucle (\\(\\texttt{s = s + i}\\), \\(\\texttt{n = n + 1}\\)).</p>
    <p><b>Indentation :</b> le CORPS d'une boucle ou d'un test est décalé du même nombre d'espaces ; deux niveaux = une boucle imbriquée.</p>
    <p><b>for :</b> \\(\\texttt{for i in range(a, b):}\\) fait prendre à i les valeurs a, a+1, …, b−1 — b est EXCLU ;
    \\(\\texttt{range(n)}\\) = de 0 à n−1 ; \\(\\texttt{range(1, n+1)}\\) = de 1 à n inclus.</p>
    <p><b>while :</b> répète tant que la condition est vraie ; le corps doit faire ÉVOLUER la condition, sinon boucle infinie.</p>
    <p><b>for ↔ while :</b> initialiser le compteur avant le while, l'incrémenter à la fin du corps.</p>
    <p><b>Tests :</b> \\(\\texttt{==}\\) (égalité), \\(\\texttt{!=}\\), \\(\\texttt{<=}\\), \\(\\texttt{>=}\\) ; \\(\\texttt{\\%}\\) = reste (parité : \\(\\texttt{i \\% 2 == 0}\\) ⇔ pair) ;
    \\(\\texttt{//}\\) = quotient entier.</p>
    <p><b>Listes :</b> indices de 0 à len(L)−1 ; \\(\\texttt{L.append(x)}\\) ajoute en fin ; \\(\\texttt{len(L)}\\) = longueur.</p>
    <p><b>Analyser un script :</b> tracer un tableau des variables ligne par ligne, colonne par colonne.</p>` },

  'litteral': { titre: '⚗️ Équations littérales & formules (physique, chimie…)', html: `
    <p><b>Isoler une grandeur :</b> appliquer l'opération INVERSE des deux côtés, étape par étape :
    \\(E=\\dfrac12 m v^2 \\Rightarrow v^2=\\dfrac{2E}{m} \\Rightarrow v=\\sqrt{\\dfrac{2E}{m}}\\) (v ≥ 0).</p>
    <p><b>Produit en croix :</b> \\(\\dfrac ab=\\dfrac cd \\iff ad=bc\\) — au cœur des formules du type \\(v=\\dfrac dt\\).</p>
    <p><b>Racine et ln :</b> \\(x^2=a \\Rightarrow x=\\pm\\sqrt a\\) ; \\(\\ln x=y \\Rightarrow x=e^y\\) (x &gt; 0).</p>
    <p><b>Formules usuelles :</b> \\(v=d/t\\) ; \\(P=UI\\) ; \\(U=RI\\) ; \\(E_c=\\frac12mv^2\\) ; \\(P=m\\,g\\,h\\) ;
    \\(F=G\\dfrac{m m'}{d^2}\\) ; \\(PV=nRT\\) ; \\(c=\\dfrac nV\\) ; \\(\\lambda=vT=v/f\\) ; aires et volumes (fiche 📐).</p>
    <p><b>Identifier une formule :</b> contrôler les UNITÉS de chaque grandeur ; une équation est homogène : les deux membres ont la même dimension.</p>
    <p><b>Application numérique :</b> convertir d'abord dans les unités SI, remplacer, calculer, arrondir aux chiffres significatifs.</p>` },

  'logique': { titre: '∈ Ensembles, intervalles & logique', html: `
    <p><b>Ensembles de nombres :</b> \\(\\mathbb{N}\\) (entiers ≥ 0), \\(\\mathbb{Z}\\) (relatifs), \\(\\mathbb{Q}\\) (fractions), \\(\\mathbb{R}\\) ;
    \\(\\in\\) = appartient, \\(\\subset\\) = inclus.</p>
    <p><b>Intervalles :</b> \\([a\\,;\\,b]\\) fermé (bornes comprises), \\(]a\\,;\\,b[\\) ouvert ;
    \\(]-\\infty\\,;\\,a]\\), \\([a\\,;\\,+\\infty[\\) ; intersection \\(\\cap\\) = éléments des DEUX, réunion \\(\\cup\\) = éléments de l'un au moins ;
    complémentaire = le reste de l'univers.</p>
    <p><b>Cardinal :</b> Card(A) = nombre d'éléments. Card(A∪B) = Card(A)+Card(B)−Card(A∩B).</p>
    <p><b>Logique :</b> « et » (∧) vrai si les deux ; « ou » (∨) vrai si au moins un ;
    négation ¬ échange quantificateurs et relie ; implication \\(A\\Rightarrow B\\) ; contraposée \\(\\lnot B\\Rightarrow\\lnot A\\).</p>` }
};

/* ------------------------------------------------------------
   ÉLÉMENTS SIMPLES — pour chaque générateur : libellé (celui de
   la banque G s'il existe, sinon celui ci-dessous), rappel court
   (infobulle au survol) et fiches associées.
   ------------------------------------------------------------ */
const GEN_INFO = {
  /* — Second degré, dérivées, fonctions (banque QCM) — */
  'canonique':            { label: 'Forme canonique', fiches: ['second-degre'],
    rappel: "Tout trinôme s'écrit \\(x^2+bx+c=(x-\\alpha)^2+\\beta\\) avec \\(\\alpha=-\\dfrac{b}{2}\\) et \\(\\beta=c-\\dfrac{b^2}{4}=f(\\alpha)\\). Le sommet de la parabole est \\(S(\\alpha\\,;\\,\\beta)\\)." },
  'devRed':               { label: 'Développer & réduire', fiches: ['algebre'],
    rappel: "Double distributivité : \\((x+a)(x+b)=x^2+(a+b)x+ab\\) ; \\((ax+b)(cx+d)=ac\\,x^2+(ad+bc)x+bd\\). On réduit en regroupant les termes de même degré." },
  'factorisation':        { label: 'Factoriser un trinôme', fiches: ['second-degre', 'algebre'],
    rappel: "Chercher deux nombres p et q tels que \\(p+q=-b\\) et \\(pq=c\\) : \\(x^2+bx+c=(x-p)(x-q)\\). Vérifier en développant." },
  'trouCanonique':        { label: 'Raisonnement : forme canonique', fiches: ['second-degre'],
    rappel: "Vocabulaire de la forme canonique : \\(\\alpha\\) est l'abscisse du sommet, \\(\\beta\\) son ordonnée, l'axe de symétrie a pour équation \\(x=\\alpha\\) ; on VÉRIFIE en développant." },
  'eqSecond':             { label: 'Équations du 2ᵈ degré', fiches: ['second-degre'],
    rappel: "Factoriser, puis produit-nul : \\(A\\times B=0 \\iff A=0\\) ou \\(B=0\\). Ou bien \\(\\Delta=b^2-4ac\\) et \\(x=\\dfrac{-b\\pm\\sqrt\\Delta}{2a}\\)." },
  'ineqSecond':           { label: 'Inéquations du 2ᵈ degré', fiches: ['second-degre', 'tableaux'],
    rappel: "Si a &gt; 0 : le trinôme est POSITIF à l'extérieur des racines, NÉGATIF entre. \\(\\leqslant\\) = crochets fermés aux bornes." },
  'signExpr':             { label: "Signe d'une expression", fiches: ['tableaux', 'algebre'],
    rappel: "Une ligne par facteur dans le tableau de signes, puis règle des signes ; les zéros du dénominateur (valeurs interdites) sont barrés." },
  'trouEqProduit':        { label: 'Raisonnement : produit-nul', fiches: ['algebre'],
    rappel: "\\(A\\times B=0 \\iff A=0\\) ou \\(B=0\\). On ne DIVISE JAMAIS par \\(x\\) : la solution \\(x=0\\) serait perdue — on factorise d'abord." },
  'eqDroite':            { label: 'Équation de droite', fiches: ['vecteurs'],
    rappel: "Pente \\(m=\\dfrac{y_B-y_A}{x_B-x_A}\\), puis \\(p=y_A-mx_A\\) : la droite a pour équation \\(y=mx+p\\)." },
  'tangente':             { label: 'Tangente à une courbe', fiches: ['derivees'],
    rappel: "Tangente en \\(a\\) : \\(y=f\\'(a)(x-a)+f(a)\\) — sa pente est le nombre dérivé, son ordonnée à l'origine se calcule." },
  'trouDroite':           { label: 'Raisonnement : droite', fiches: ['vecteurs'],
    rappel: "Vocabulaire : coefficient directeur = pente ; ordonnée à l'origine = image de 0, lue sur l'axe des ordonnées." },
  'nombreDerive':         { label: 'Nombre dérivé', fiches: ['derivees'],
    rappel: "\\(f\\'(a)\\) est la pente de la tangente en \\(a\\) : limite du taux d'accroissement. Ne pas confondre \\(f(a)\\) (image) et \\(f\\'(a)\\) (pente)." },
  'nombreDeriveLimite':   { label: 'Limite du taux d\'accroissement', fiches: ['derivees'],
    rappel: "Calculer \\(f(a+h)\\), soustraire \\(f(a)\\), FACTORISER par h, simplifier, puis \\(h\\to0\\) : jamais de \\(0/0\\) direct. Pour \\(\\sqrt{a+h}\\) : multiplier par le conjugué." },
  'trouTaux':             { label: 'Raisonnement : taux d\'accroissement', fiches: ['derivees'],
    rappel: "Taux d'accroissement : \\(\\dfrac{f(a+h)-f(a)}{h}\\) ; sa limite quand \\(h\\to0\\) est le nombre dérivé \\(f\\'(a)\\)." },
  'deriveePoly':          { label: 'Dérivée d\'un polynôme', fiches: ['derivees'],
    rappel: "\\((x^n)\\'=n x^{n-1}\\) ; la dérivée d'une constante est NULLE ; \\((ax^3+bx^2+cx+d)\\'=3ax^2+2bx+c\\)." },
  'deriveeUsuelle':       { label: 'Dérivées usuelles', fiches: ['derivees'],
    rappel: "\\((\\sqrt u)\\'=\\dfrac{u\\'}{2\\sqrt u}\\), \\(\\left(\\dfrac1u\\right)\\'=-\\dfrac{u\\'}{u^2}\\), \\((u^n)\\'=n\\,u\\'\\,u^{n-1}\\) — ne pas oublier le facteur 2 au dénominateur de la racine." },
  'trouDerivee':          { label: 'Raisonnement : dérivation', fiches: ['derivees'],
    rappel: "Formulaire des dérivées usuelles + vocabulaire : limite, tangente, pente, primitive (\\(F\\'=f\\))." },
  'readSignTable':        { label: 'Lire un tableau de signes', fiches: ['tableaux'],
    rappel: "Chaque facteur change de signe en ses racines ; le produit/quotient suit la règle des signes : \\((+)\\times(-)=-\\), \\((-)\\times(-)=+\\)." },
  'trouSigne':            { label: 'Raisonnement : règle des signes', fiches: ['tableaux', 'algebre'],
    rappel: "\\((+)\\times(+)=+\\) ; \\((+)\\times(-)=-\\) ; \\((-)\\times(-)=+\\). Un quotient suit la même règle, sauf valeur interdite." },
  'varExpr':              { label: 'Variations d\'une expression', fiches: ['tableaux', 'derivees'],
    rappel: "Signe de la dérivée ⇒ sens de variation : \\(f\\' \\gt 0\\) croissante, \\(f\\' \\lt 0\\) décroissante, \\(f\\'=0\\) extremum possible." },
  'readVarTable':         { label: 'Lire un tableau de variations', fiches: ['tableaux'],
    rappel: "Flèche montante = croissante, descendante = décroissante ; valeurs aux bornes ; extremum là où la flèche tourne." },
  'curveSign':            { label: 'Courbe & signes', fiches: ['tableaux', 'fonctions'],
    rappel: "La courbe de \\(f\\) est au-dessus de l'axe (Ox) là où \\(f(x) \\gt 0\\), en dessous là où \\(f(x) \\lt 0\\) ; elle coupe l'axe aux racines." },
  'trouVariations':       { label: 'Raisonnement : variations', fiches: ['tableaux'],
    rappel: "Vocabulaire : croissante, décroissante, maximum, minimum, extremum — le tableau de variations les résume." },
  'suiteArith':           { label: 'Suites arithmétiques (calculs)', fiches: ['suites'],
    rappel: "\\(u_{n+1}=u_n+r\\), \\(u_n=u_0+n\\,r\\) ; somme = \\(\\dfrac{(\\text{nb de termes})(\\text{premier}+\\text{dernier})}{2}\\)." },
  'suiteArith2':          { label: 'Suites arithmétiques (problèmes)', fiches: ['suites'],
    rappel: "Identifier la raison r (différence constante), puis \\(u_n=u_0+n\\,r\\) ; croissante si \\(r \\gt 0\\)." },
  'trouSuiteArith':       { label: 'Raisonnement : suite arithmétique', fiches: ['suites'],
    rappel: "Vocabulaire : raison, terme initial, forme explicite \\(u_n=u_0+nr\\), sens de variation selon le signe de r." },
  'suiteGeo':             { label: 'Suites géométriques (calculs)', fiches: ['suites'],
    rappel: "\\(u_{n+1}=q\\,u_n\\), \\(u_n=u_0\\,q^n\\) ; somme \\(u_0\\dfrac{1-q^{n+1}}{1-q}\\) pour q ≠ 1." },
  'suiteGeo2':            { label: 'Suites géométriques (problèmes)', fiches: ['suites'],
    rappel: "Le rapport entre deux termes consécutifs est constant (= q) ; croissante si \\(q \\gt 1\\) (u₀ &gt; 0), décroissante si \\(0 \\lt q \\lt 1\\)." },
  'trouSuiteGeo':         { label: 'Raisonnement : suite géométrique', fiches: ['suites'],
    rappel: "Vocabulaire : raison q, terme initial, forme explicite \\(u_n=u_0 q^n\\) ; on multiplie par q à chaque terme." },
  'pourcentage':          { label: 'Pourcentages', fiches: ['proportionnalite'],
    rappel: "t % de V = \\(\\dfrac t{100}\\times V\\) ; augmenter de t % ⇔ ×\\(\\left(1+\\dfrac t{100}\\right)\\), diminuer ⇔ ×\\(\\left(1-\\dfrac t{100}\\right)\\)." },
  'trouPourcentage':      { label: 'Raisonnement : pourcentages', fiches: ['proportionnalite'],
    rappel: "Augmentation, réduction, coefficient multiplicateur, arrondi : toujours multiplier par le COEFFICIENT, pas additionner les taux." },
  'trigoAssoc':           { label: 'Angles associés', fiches: ['trigo-cercle'],
    rappel: "\\(\\cos(-x)=\\cos x\\), \\(\\sin(-x)=-\\sin x\\), \\(\\cos(\\pi-x)=-\\cos x\\), \\(\\sin(\\pi-x)=\\sin x\\), \\(\\cos\\left(\\tfrac\\pi2-x\\right)=\\sin x\\)." },
  'eqTrigo':              { label: 'Équations trigonométriques', fiches: ['trigo-cercle'],
    rappel: "\\(\\cos x=a\\) (si \\(|a|\\le1\\)) : \\(x=\\pm\\arccos a+2k\\pi\\) ; \\(\\sin x=a\\) : \\(x=\\arcsin a+2k\\pi\\) ou \\(\\pi-\\arcsin a+2k\\pi\\)." },
  'trouTrigo':            { label: 'Raisonnement : cercle trigonométrique', fiches: ['trigo-cercle'],
    rappel: "Sur le cercle : l'abscisse de \\(M(x)\\) est \\(\\cos x\\), son ordonnée est \\(\\sin x\\) ; un tour = \\(2\\pi\\) radians." },
  'produitScalaire':      { label: 'Produit scalaire', fiches: ['vecteurs'],
    rappel: "\\(\\vec u\\cdot\\vec v=xx'+yy'=\\|\\vec u\\|\\,\\|\\vec v\\|\\cos\\theta\\) ; orthogonaux \\(\\iff\\vec u\\cdot\\vec v=0\\)." },
  'trouScalaire':         { label: 'Raisonnement : produit scalaire', fiches: ['vecteurs'],
    rappel: "Définition par les coordonnées OU par les normes et l'angle ; le produit scalaire est NUL pour un angle droit." },
  'complexeAlg':          { label: 'Complexes : forme algébrique', fiches: ['complexes'],
    rappel: "\\(\\mathrm i^2=-1\\) ; somme terme à terme ; produit : développer puis remplacer \\(\\mathrm i^2\\) par −1 ; \\(|z|=\\sqrt{a^2+b^2}\\)." },
  'complexeTrigo':        { label: 'Complexes : forme trigonométrique', fiches: ['complexes', 'trigo-cercle'],
    rappel: "\\(z=r(\\cos\\theta+\\mathrm i\\sin\\theta)\\) avec \\(r=|z|\\) ; \\(a=r\\cos\\theta\\), \\(b=r\\sin\\theta\\)." },
  'statTable':            { label: 'Tableaux statistiques', fiches: ['statistiques'],
    rappel: "Lire les totaux lignes/colonnes d'un tableau double entrée ; fréquence = effectif ÷ total (ligne, colonne ou ensemble selon la question)." },
  'probaCond':           { label: 'Probabilités conditionnelles', fiches: ['probabilites'],
    rappel: "\\(P_A(B)=\\dfrac{P(A\\cap B)}{P(A)}\\) : on se restreint aux cas où A est réalisé." },
  'arbreIndep':          { label: 'Arbres & indépendance', fiches: ['probabilites'],
    rappel: "Le long d'un arbre, on MULTIPLIE ; indépendance : \\(P(A\\cap B)=P(A)\\,P(B)\\)." },
  'trouProba':            { label: 'Raisonnement : probabilités', fiches: ['probabilites'],
    rappel: "Une probabilité vit toujours dans \\([0\\,;\\,1]\\) ; événement contraire : \\(P(\\bar A)=1-P(A)\\) ; réunion/intersection." },
  'bernoulli':            { label: 'Schéma de Bernoulli', fiches: ['probabilites'],
    rappel: "n épreuves identiques et indépendantes : \\(P(X=k)=\\binom nk p^k(1-p)^{n-k}\\)." },
  'varAleat':             { label: 'Variables aléatoires', fiches: ['probabilites'],
    rappel: "Loi : valeurs \\(x_i\\) et probabilités \\(p_i\\) (somme 1) ; espérance \\(E(X)=\\sum p_i x_i\\)." },
  'primitivePoly':        { label: 'Primitives', fiches: ['derivees'],
    rappel: "\\(F\\'=f\\) ; \\(\\left(\\dfrac{x^{n+1}}{n+1}\\right)\\'=x^n\\) (n ≠ −1) ; une constante s'ajoute librement." },
  'trouPrimitive':        { label: 'Raisonnement : primitives', fiches: ['derivees'],
    rappel: "Vocabulaire : primitive, dérivée, constante d'intégration ; on VÉRIFIE en dérivant la primitive proposée." },
  'euler':                { label: "Méthode d'Euler", fiches: ['derivees'],
    rappel: "On suit les tangentes par pas h : \\(y_{n+1}=y_n+h\\,f\\'(x_n)\\) ; plus h est petit, plus la courbe approchée est fidèle." },
  'degre3':               { label: 'Polynômes de degré 3', fiches: ['second-degre'],
    rappel: "Trouver une racine évidente r, factoriser \\(P(x)=(x-r)(ax^2+bx+c)\\) par identification, puis résoudre le second degré." },
  'trouPythagore':        { label: 'Raisonnement : Pythagore', fiches: ['pythagore-thales'],
    rappel: "Rectangle en A : \\(BC^2=AB^2+AC^2\\) ; l'hypoténuse est TOUJOURS opposée à l'angle droit ; réciproque pour prouver qu'un triangle est rectangle." },
  'trouThales':           { label: 'Raisonnement : Thalès', fiches: ['pythagore-thales'],
    rappel: "\\((MN)\\parallel(BC)\\Rightarrow\\dfrac{AM}{AB}=\\dfrac{AN}{AC}=\\dfrac{MN}{BC}\\) ; VÉRIFIER le parallélisme avant d'écrire les rapports." },
  'pyTrous':              { label: 'Python : compléter un script', fiches: ['python'],
    rappel: "range(a, b) va de a à b−1 ; le corps de boucle est INDENTÉ ; un accumulateur s'initialise avant la boucle (s = 0)." },
  'pyAnalyse':            { label: 'Python : analyser un script', fiches: ['python'],
    rappel: "Tracer un tableau des variables ligne par ligne pour prévoir les valeurs finales et le nombre de tours." },
  'pyWhileFor':           { label: 'Python : while → for', fiches: ['python'],
    rappel: "for = nombre de tours CONNU ; while = condition d'arrêt ; deux niveaux d'indentation = imbrication." },
  'pyForWhile':           { label: 'Python : for → while', fiches: ['python'],
    rappel: "Initialiser le compteur AVANT le while, l'incrémenter dans le corps ; la condition de boucle reprend les bornes de range." },

  /* — Banque primaire / collège (les libellés viennent de G) — */
  'p-addsub':     { fiches: ['calcul'],   rappel: "Addition en colonnes avec retenue ; soustraction avec emprunt ; × et ÷ avant + et −." },
  'p-multdiv':    { fiches: ['calcul'],   rappel: "Division euclidienne : dividende = diviseur × quotient + reste, avec reste &lt; diviseur." },
  'p-compare':    { fiches: ['nombres'],  rappel: "Comparer les parties entières, puis les décimales de gauche à droite : 3,45 &gt; 3,4 car 5 centièmes &gt; 0." },
  'p-fraction':   { fiches: ['nombres'],  rappel: "Numérateur = parts prises, dénominateur = parts égales du tout ; \\(\\dfrac ab=\\dfrac{2a}{2b}\\)." },
  'p-decimaux':   { fiches: ['nombres'],  rappel: "\\(3{,}45=3+\\dfrac4{10}+\\dfrac5{100}\\) : dixièmes puis centièmes ; virgule alignée dans les opérations." },
  'p-conversion': { fiches: ['unites'],   rappel: "Tableau de conversion : ×10 à chaque échelon vers la droite ; \\(1\\,\\text{m}=100\\,\\text{cm}\\), \\(1\\,\\text{L}=1000\\,\\text{mL}\\)." },
  'u-si':         { fiches: ['unites'],   rappel: "Préfixes : \\(k=10^3\\), \\(h=10^2\\), \\(\\text{da}=10\\), \\(d=10^{-1}\\), \\(c=10^{-2}\\), \\(m=10^{-3}\\), \\(\\mu=10^{-6}\\), \\(n=10^{-9}\\)." },
  'u-masse':      { fiches: ['unites'],   rappel: "Masse : t, kg, g, mg — \\(1\\,\\text{kg}=1000\\,\\text{g}\\), \\(1\\,\\text{t}=1000\\,\\text{kg}\\)." },
  'u-volume':     { fiches: ['unites'],   rappel: "Capacités : \\(1\\,\\text{L}=1\\,\\text{dm}^3\\), \\(1\\,\\text{mL}=1\\,\\text{cm}^3\\)." },
  'u-astronomie': { fiches: ['unites'],   rappel: "ua = distance Terre-Soleil (\\(1{,}496\\times10^8\\) km) ; a.l. = \\(9{,}46\\times10^{12}\\) km (lumière en 1 an)." },
  'u-sci':        { fiches: ['unites'],   rappel: "Notation scientifique \\(a\\times10^n\\) avec \\(1\\le|a| \\lt 10\\) : \\(0{,}00052=5{,}2\\times10^{-4}\\)." },
  'u-cs':         { fiches: ['unites'],   rappel: "Chiffres significatifs : un zéro de position ne compte pas ; le résultat garde la précision de la donnée la moins précise." },
  'u-dim':        { fiches: ['unites', 'litteral'], rappel: "Analyse dimensionnelle : les deux membres d'une égalité doivent avoir la MÊME dimension ; [v] = longueur/temps." },
  'p-geo':        { fiches: ['geometrie'], rappel: "Aires : \\(L\\times l\\) (rectangle), \\(\\dfrac{b\\times h}2\\) (triangle), \\(\\pi r^2\\) (disque) ; volumes : \\(\\text{base}\\times\\text{hauteur}\\), \\(\\frac13\\text{Bh}\\) (pyramide/cône)." },
  'p-prop':       { fiches: ['proportionnalite'], rappel: "Coefficient de proportionnalité constant ; produit en croix : \\(\\dfrac ab=\\dfrac cd \\iff ad=bc\\)." },
  'p-heure':      { fiches: ['unites'],   rappel: "\\(1\\,\\text{h}=60\\,\\text{min}\\), \\(1\\,\\text{min}=60\\,\\text{s}\\) ; « 3 h 40 » = 220 min ; 1 h 30 = 1,5 h (base 60 ≠ base 10 !)." },
  'p-suite':      { fiches: ['suites'],   rappel: "Repérer la règle : +k (arithmétique) ou ×q (géométrique) ; appliquer la règle au dernier terme connu." },
  'p-probleme':   { fiches: ['calcul'],   rappel: "Méthode : lire, lister les données, choisir l'opération, calculer, VÉRIFIER l'ordre de grandeur." },
  'p-romain':     { fiches: ['nombres'],  rappel: "I=1, V=5, X=10, L=50, C=100, D=500, M=1000 ; une lettre plus petite DEVANT se soustrait (IV=4, XL=40)." },
  'p-symetrie':   { fiches: ['geometrie'], rappel: "Axe de symétrie = pli qui superpose la figure ; cercle : infinité ; carré : 4 ; rectangle : 2 ; segment : médiatrice." },
  'c-relatifs':   { fiches: ['nombres'],  rappel: "Règle des signes : \\((-)(-)=+\\) ; soustraire un négatif = additionner son opposé : \\(a-(-b)=a+b\\)." },
  'c-fracops':    { fiches: ['nombres'],  rappel: "Somme : même dénominateur ; produit : numérateurs × numérateurs ; division : × l'inverse." },
  'c-puissances': { fiches: ['nombres'],  rappel: "\\(a^m a^n=a^{m+n}\\), \\(\\dfrac{a^m}{a^n}=a^{m-n}\\), \\((a^m)^n=a^{mn}\\), \\(a^{-n}=\\dfrac1{a^n}\\)." },
  'c-racines':    { fiches: ['nombres'],  rappel: "\\(\\sqrt{a^2}=|a|\\), \\(\\sqrt{ab}=\\sqrt a\\sqrt b\\) ; MAIS \\(\\sqrt{a+b}\\ne\\sqrt a+\\sqrt b\\)." },
  'c-litteral':   { fiches: ['algebre'],  rappel: "Développer par distributivité, réduire en regroupant les mêmes puissances de x." },
  'c-eq1':        { fiches: ['algebre'],  rappel: "Transposer terme à terme (signe changé), puis diviser par le coefficient de x." },
  'c-ineq1':      { fiches: ['algebre'],  rappel: "Comme une équation, MAIS multiplier/diviser par un négatif INVERSE le sens de l'inégalité." },
  'c-pourc':      { fiches: ['proportionnalite'], rappel: "t % de V = \\(\\dfrac t{100}\\times V\\) ; part, total, taux : deux données donnent la troisième par produit en croix." },
  'c-pythagore':  { fiches: ['pythagore-thales'], rappel: "Rectangle en A : \\(BC^2=AB^2+AC^2\\) ; hypoténuse face à l'angle droit ; \\(BC=\\sqrt{AB^2+AC^2}\\)." },
  'c-thales':     { fiches: ['pythagore-thales'], rappel: "Avec (MN)//(BC) : \\(\\dfrac{AM}{AB}=\\dfrac{AN}{AC}=\\dfrac{MN}{BC}\\) ; mêmes « fûts » de chaque côté." },
  'c-trigo':      { fiches: ['trigo-triangle'], rappel: "SOH-CAH-TOA : \\(\\sin=\\dfrac{\\text{opp}}{\\text{hyp}}\\), \\(\\cos=\\dfrac{\\text{adj}}{\\text{hyp}}\\), \\(\\tan=\\dfrac{\\text{opp}}{\\text{adj}}\\)." },
  'c-angles':     { fiches: ['trigo-triangle', 'geometrie'], rappel: "La somme des angles d'un triangle vaut 180° ; angles à la base égaux dans un triangle isocèle." },
  'c-affine':     { fiches: ['fonctions'], rappel: "\\(f(x)=ax+b\\) : a = pente (sens de variation), b = ordonnée à l'origine \\(=f(0)\\)." },
  'c-fonction':   { fiches: ['fonctions'], rappel: "Image de x = ordonnée du point de la courbe ; antécédents de y = abscisses des points à la hauteur y." },
  'c-stat':       { fiches: ['statistiques'], rappel: "Moyenne = somme ÷ effectif total ; fréquence = effectif ÷ total (en % : ×100)." },
  'c-proba':      { fiches: ['probabilites'], rappel: "Équiprobabilité : \\(P=\\dfrac{\\text{favorables}}{\\text{possibles}}\\), toujours entre 0 et 1." },
  'c-reperage':   { fiches: ['vecteurs'],  rappel: "Un point = (abscisse ; ordonnée) ; abscisse lue sur l'axe horizontal, ordonnée sur le vertical." },
  'c-volumes':    { fiches: ['geometrie'], rappel: "Cylindre \\(\\pi r^2 h\\), cône \\(\\dfrac13\\pi r^2 h\\), pyramide \\(\\dfrac13\\text{Bh}\\), sphère \\(\\dfrac43\\pi r^3\\)." },
  'c-pgcd':       { fiches: ['nombres'],  rappel: "Euclide : PGCD(a, b) = PGCD(b, reste) ; une fraction irréductible se simplifie par le PGCD." },
  'c-transfo':    { fiches: ['geometrie'], rappel: "Symétrie axiale/centrale, translation, rotation : chaque point a UNE image ; conserver distances et angles." },
  's-ensembles':  { fiches: ['logique', 'nombres'], rappel: "\\(\\mathbb{N}\\subset\\mathbb{Z}\\subset\\mathbb{Q}\\subset\\mathbb{R}\\) ; un nombre appartient (∈) à un seul ensemble « minimal »." },
  's-facto':      { fiches: ['algebre'],  rappel: "Facteur commun : \\(ka+kb=k(a+b)\\) — le k peut être une lettre OU une parenthèse." },
  's-facto2':     { fiches: ['algebre'],  rappel: "Identité remarquable : \\(a^2-b^2=(a-b)(a+b)\\) — repérer les deux carrés." },
  's-facto3':     { fiches: ['algebre'],  rappel: "Carré parfait : \\(a^2\\pm2ab+b^2=(a\\pm b)^2\\) — vérifier le DOUBLE produit." },
  's-facto4':     { fiches: ['algebre'],  rappel: "Groupement : regrouper les termes deux par deux pour faire apparaître un facteur commun." },
  's-facto5':     { fiches: ['algebre'],  rappel: "Double factorisation : d'abord un facteur commun, puis une identité remarquable sur le résultat." },
  's-facto6':     { fiches: ['algebre'],  rappel: "Avant de résoudre \\(=0\\) : FACTORISER ; produit-nul ensuite." },
  's-eqproduit':  { fiches: ['algebre'],  rappel: "\\(A\\times B=0 \\iff A=0\\) ou \\(B=0\\) ; chaque facteur donne une racine." },
  's-signe':      { fiches: ['tableaux'], rappel: "Tableau : une ligne par facteur, signe « + 0 − 0 + » pour un facteur du 1ᵉʳ degré à coefficient positif." },
  's-fonction2':  { fiches: ['fonctions'], rappel: "Image unique \\(f(a)\\) ; antécédents : résoudre \\(f(x)=y\\) — plusieurs solutions possibles." },
  's-variations': { fiches: ['tableaux', 'fonctions'], rappel: "Flèches + valeurs aux bornes ; croissante = conserve l'ordre, décroissante = l'inverse." },
  's-ref':        { fiches: ['fonctions'], rappel: "Référence : carré (parabole), inverse (hyperbole, \\(x\\ne0\\)), racine (\\(x\\ge0\\)), cube — reconnaître leur courbe." },
  's-vecteurs':   { fiches: ['vecteurs'], rappel: "\\(\\overrightarrow{AB}(x_B-x_A\\,;\\,y_B-y_A)\\) ; norme, milieu, translation, égalité de vecteurs." },
  's-droites':    { fiches: ['vecteurs'], rappel: "\\(y=mx+p\\) : lire m (pente) sur deux points, p sur l'axe des ordonnées." },
  's-systeme':    { fiches: ['vecteurs', 'algebre'], rappel: "Substitution ou combinaison ; la solution = point d'intersection des deux droites." },
  's-grapheq':    { fiches: ['fonctions'], rappel: "\\(f(x)=k\\) : abscisses des points d'intersection de \\(C_f\\) avec la droite \\(y=k\\)." },
  's-graphineq':  { fiches: ['fonctions'], rappel: "\\(f(x)\\le g(x)\\) : intervalles où \\(C_f\\) est en dessous de \\(C_g\\) ; crochets aux intersections pour ≤." },
  's-stat2':      { fiches: ['statistiques'], rappel: "Médiane partage la série ordonnée en deux ; quartiles Q1/Q3 coupent en 4 ; étendue = max − min." },
  's-proba2':     { fiches: ['probabilites'], rappel: "\\(P(A\\cup B)=P(A)+P(B)-P(A\\cap B)\\) ; \\(P(\\bar A)=1-P(A)\\) ; indépendance : \\(P(A\\cap B)=P(A)P(B)\\)." },
  's-taux':       { fiches: ['proportionnalite'], rappel: "Taux d'évolution = \\(\\dfrac{V_f-V_i}{V_i}\\) ; CM = 1 + t/100 ; taux réciproque = 1/CM − 1." },
  's-algo':       { fiches: ['python'],   rappel: "Boucles, compteurs, accumulateurs : initialiser AVANT, mettre à jour DANS la boucle." },
  's-courbeequation': { fiches: ['vecteurs'], rappel: "Sur un graphique : p = ordonnée à x = 0 ; m = \\(\\dfrac{\\Delta y}{\\Delta x}\\) entre deux points de la droite." },
  's-transfo':    { fiches: ['geometrie'], rappel: "Image par symétrie axiale (perpendiculaire à l'axe, même distance), centrale (demi-tour), rotation (centre, angle, sens)." },

  /* — Automatismes & compléments 1ʳᵉ technologique — */
  'a-evol':           { fiches: ['proportionnalite'], rappel: "Valeur finale = valeur initiale × (1 + t/100) ; taux réciproque = inverse du CM − 1 ; évolutions successives : les CM se multiplient." },
  'a-droite':         { fiches: ['vecteurs'], rappel: "Pente entre deux points : \\(m=\\dfrac{y_B-y_A}{x_B-x_A}\\) ; tracer en partant de p avec la pente." },
  'a-graph-stats':    { fiches: ['statistiques'], rappel: "Barres : comparer les hauteurs ; circulaire : parts d'un total ; courbe : évolution et lecture point par point." },
  'a-boite':          { fiches: ['statistiques'], rappel: "Boîte à moustaches : min, Q1, médiane, Q3, max — la boîte contient 50 % des valeurs centrales." },
  'a-proba-notation': { fiches: ['probabilites'], rappel: "Notations : \\(P(A)\\), \\(P(A\\cap B)\\) (et), \\(P(A\\cup B)\\) (ou) ; la somme des probabilités d'une partition vaut 1." },
  'log-ensembles':    { fiches: ['logique'], rappel: "Intervalles et crochets ; \\(\\cap\\) = éléments des DEUX ensembles, \\(\\cup\\) = l'un au moins ; complémentaire." },
  'log-logique':       { fiches: ['logique'], rappel: "Négation d'« et » = « ou » ; contraposée de \\(A\\Rightarrow B\\) : \\(\\lnot B\\Rightarrow\\lnot A\\) ; un contre-exemple suffit pour infirmer." },
  'algo-flash':       { fiches: ['python'], rappel: "Compteurs (n = n + 1), listes (indices dès 0), simulation : traduire l'énoncé en boucle." },
  'lit-identifier':    { fiches: ['litteral'], rappel: "Identifier une formule par ses UNITÉS et ses grandeurs : une égalité doit être homogène (mêmes dimensions)." },
  'lit-mecanique':    { fiches: ['litteral'], rappel: "Isoler : opérations inverses des deux côtés ; \\(F=G\\dfrac{mm'}{d^2} \\Rightarrow d=\\sqrt{\\dfrac{Gmm'}{F}}\\)." },
  'lit-electro-thermo': { fiches: ['litteral'], rappel: "\\(U=RI\\), \\(P=UI\\), \\(Q=mc\\Delta T\\) : isoler la grandeur cherchée avant l'application numérique." },
  'lit-chimie':       { fiches: ['litteral'], rappel: "\\(PV=nRT\\), \\(c=\\dfrac nV\\), \\(n=\\dfrac mM\\) : produit en croix et conversion d'unités d'abord." },
  'lit-ondes':        { fiches: ['litteral'], rappel: "\\(\\lambda=vT=\\dfrac vf\\), \\(E=h\\nu\\) : vérifier les unités (s, Hz, m) avant d'isoler." },
  'lit-geometrie':    { fiches: ['litteral', 'geometrie'], rappel: "Aires/volumes : \\(S=\\pi r^2\\Rightarrow r=\\sqrt{S/\\pi}\\) ; isoler avant de remplacer." },
  'lit-suites-stats': { fiches: ['litteral', 'suites'], rappel: "Sommes et moyenne pondérée : isoler le terme manquant (produit en croix ou soustraction)." },
  'lit-economie':     { fiches: ['litteral', 'proportionnalite'], rappel: "Formules économiques et sanitaires : \\(t=\\dfrac{V_f-V_i}{V_i}\\times100\\) — isoler avant de calculer." },
  'lit-algebre':      { fiches: ['litteral', 'algebre'], rappel: "Relation implicite \\(ax+by=c\\) : isoler y (ou x) ; produit en croix pour les formes fractionnaires." },
  'lit-numeric':      { fiches: ['litteral'], rappel: "Application numérique : unités SI, substitution, calcul, arrondi aux chiffres significatifs." },
  'notation-f':       { fiches: ['fonctions'], rappel: "\\(f\\) est la fonction (objet), \\(f(x)\\) un NOMBRE ; \\(C_f\\) la courbe, \\(G_f\\) le graphe ; jamais « f = 2x + 3 »." },
  'espace-3d':        { fiches: ['espace'], rappel: "Coordonnées \\((x\\,;\\,y\\,;\\,z)\\) ; distance \\(\\sqrt{\\Delta x^2+\\Delta y^2+\\Delta z^2}\\) ; milieu = moyennes des coordonnées." },
  'polygones':        { fiches: ['geometrie'], rappel: "Régulier : angle au centre \\(\\dfrac{360\\degree}n\\), angle intérieur \\(\\dfrac{(n-2)\\times180\\degree}n\\), n axes de symétrie." },
  'nuage':            { fiches: ['statistiques'], rappel: "Point moyen \\(G(\\bar x\\,;\\,\\bar y)\\) ; droite d'ajustement pour ESTIMER (avec prudence hors nuage)." },
  'proba-totales':    { fiches: ['probabilites'], rappel: "Partition de l'univers : \\(P(B)=\\sum P(A_i\\cap B)\\) — additionner toutes les branches qui mènent à B." },
  'repetition':       { fiches: ['probabilites'], rappel: "n épreuves identiques indépendantes : \\(P(X=k)=\\binom nk p^k(1-p)^{n-k}\\) ; fluctuation autour de p." },
  'somme-suite':      { fiches: ['suites'], rappel: "Arithmétique : (nb de termes) × (1ᵉʳ + dernier) ÷ 2 ; géométrique : \\(u_0\\dfrac{1-q^{n+1}}{1-q}\\)." },

  /* — Fiches transversales « t- » (1ʳᵉ) — */
  't-canonique':        { fiches: ['second-degre'], rappel: "Canonique : \\(a(x-\\alpha)^2+\\beta\\), \\(\\alpha=-\\dfrac b{2a}\\), \\(\\beta=f(\\alpha)\\) ; sommet \\(S(\\alpha\\,;\\,\\beta)\\)." },
  't-discriminant':     { fiches: ['second-degre'], rappel: "\\(\\Delta=b^2-4ac\\) : &gt;0 deux racines, =0 une racine double, &lt;0 aucune racine réelle." },
  't-solve2deg':        { fiches: ['second-degre'], rappel: "Racines : \\(x=\\dfrac{-b\\pm\\sqrt\\Delta}{2a}\\) ; toujours donner l'ensemble des solutions." },
  't-trinomesigne':     { fiches: ['second-degre', 'tableaux'], rappel: "a &gt; 0 : « + 0 − 0 + » ; a &lt; 0 : « − 0 + 0 − » ; les racines bornent les intervalles." },
  't-derivee':          { fiches: ['derivees'], rappel: "Usuelles : \\((x^n)\\'=nx^{n-1}\\), \\((\\sqrt u)\\'=\\dfrac{u\\'}{2\\sqrt u}\\), \\(\\left(\\frac1u\\right)\\'=-\\dfrac{u\\'}{u^2}\\)." },
  't-deriveept':        { fiches: ['derivees'], rappel: "\\(f\\'(a)\\) = pente de la tangente en a = limite du taux d'accroissement." },
  't-tangente':         { fiches: ['derivees'], rappel: "\\(y=f\\'(a)(x-a)+f(a)\\) — développer pour la forme réduite." },
  't-tangentegraph':    { fiches: ['derivees'], rappel: "Pente de la tangente lue graphiquement : \\(\\dfrac{\\Delta y}{\\Delta x}\\) entre deux points de la droite." },
  't-fprimevariation':  { fiches: ['derivees', 'tableaux'], rappel: "\\(f\\' \\gt 0\\) : \\(f\\) croît ; \\(f\\' \\lt 0\\) : \\(f\\) décroît ; \\(f\\'=0\\) : extremum candidat." },
  't-courbederivee':    { fiches: ['derivees'], rappel: "\\(C_{f\\'}\\) au-dessus de (Ox) ⇔ \\(f\\) croissante ; l'image de a sur \\(C_{f\\'}\\) vaut \\(f\\'(a)\\)." },
  't-polynome3':        { fiches: ['second-degre'], rappel: "Racine évidente + factorisation \\((x-r)\\times\\)(trinôme) par identification des coefficients." },
  't-suitearith':       { fiches: ['suites'], rappel: "\\(u_n=u_0+nr\\) ; somme = (nb de termes)(1ᵉʳ+dernier)/2 ; de \\(u_0\\) à \\(u_n\\) : n+1 termes." },
  't-suitegeo':         { fiches: ['suites'], rappel: "\\(u_n=u_0 q^n\\) ; somme \\(u_0\\dfrac{1-q^{n+1}}{1-q}\\) ; croissance selon q." },
  't-suitegraph':       { fiches: ['suites'], rappel: "Escalier/courbe des \\((n\\,;\\,u_n)\\) ; arithmétique = alignés, géométrique = exponentiels." },
  't-evolutions':       { fiches: ['proportionnalite'], rappel: "Évolutions successives : les CM se MULTIPLIENT ; taux global = produit − 1 ; réciproque = 1/CM." },
  't-trigo2':           { fiches: ['trigo-cercle'], rappel: "Valeurs remarquables : \\(\\cos\\dfrac\\pi3=\\dfrac12\\), \\(\\sin\\dfrac\\pi6=\\dfrac12\\), \\(\\cos\\dfrac\\pi4=\\dfrac{\\sqrt2}2\\)…" },
  't-scalaire':         { fiches: ['vecteurs'], rappel: "\\(\\vec u\\cdot\\vec v=xx'+yy'=\\|\\vec u\\|\\|\\vec v\\|\\cos\\theta\\) ; nul si angle droit." },
  't-proba3':           { fiches: ['probabilites'], rappel: "\\(P(\\bar A)=1-P(A)\\) ; indépendance ⇔ \\(P(A\\cap B)=P(A)P(B)\\) ⇔ \\(P_A(B)=P(B)\\)." },
  't-graphtaux':        { fiches: ['derivees'], rappel: "Taux d'accroissement lu sur un graphique = pente de la sécante entre deux points." },
  't-graphineq2':       { fiches: ['second-degre', 'fonctions'], rappel: "Résoudre graphiquement \\(f(x)\\ge0\\) : parties de la courbe au-dessus de (Ox), racines en crochets fermés." },
  't-comparaison':      { fiches: ['vecteurs'], rappel: "Comparer deux droites : pentes égales ⇔ parallèles ; pente plus grande = droite « plus pentue »." },
  't-rotation':         { fiches: ['trigo-cercle', 'geometrie'], rappel: "Rotation de +π/2 (sens direct) : \\((x\\,;\\,y)\\mapsto(-y\\,;\\,x)\\) ; de θ : formule avec \\(\\cos\\theta\\), \\(\\sin\\theta\\)." },
  't-angles-orientes':  { fiches: ['trigo-cercle'], rappel: "Angles orientés modulo \\(2\\pi\\), signe selon le sens : direct +, indirect −." },
  't-associes':         { fiches: ['trigo-cercle'], rappel: "Angles associés : \\(\\pi-x\\), \\(\\pi+x\\), \\(-x\\), \\(\\dfrac\\pi2\\pm x\\) — mémoriser avec le cercle." },
  't-eqtrigo':          { fiches: ['trigo-cercle'], rappel: "\\(\\cos x=a\\) : \\(x=\\pm\\arccos a+2k\\pi\\) ; \\(\\sin x=a\\) : \\(x=\\arcsin a\\) ou \\(\\pi-\\arcsin a\\), \\(+2k\\pi\\)." },
  't-ineqtrigo':       { fiches: ['trigo-cercle'], rappel: "Lire sur le cercle les arcs où \\(\\cos x\\ge a\\) (à droite de la droite \\(x=a\\)) ou \\(\\sin x\\le a\\)." },
  't-courbetrigo':      { fiches: ['trigo-cercle'], rappel: "Sinusoïdes de période \\(2\\pi\\), valeurs dans \\([-1\\,;\\,1]\\) ; cosinus « cloche » part de 1, sinus part de 0." },
  't-euler':            { fiches: ['derivees'], rappel: "Pas h : \\(y_{n+1}=y_n+h\\,f\\'(x_n)\\) — on suit les tangentes, à la précision de h près." },

  /* — Missions narratives « x- » — */
  'x-trinome': { fiches: ['second-degre'], rappel: "Enquête : choisir la BONNE forme (développée, canonique, factorisée) selon la question : racines → factorisée, sommet → canonique, valeur → développée." },
  'x-derivee':  { fiches: ['derivees'], rappel: "Optimisation : dériver, résoudre \\(f\\'(x)=0\\), contrôler le tableau de signes de f′ pour prouver l'extremum." },
  'x-phare':    { fiches: ['trigo-cercle', 'vecteurs'], rappel: "Rotations sur le cercle, produit scalaire et vitesses angulaires (π/6 rad/min) : convertir l'angle en minutes par division." }
};

/* ------------------------------------------------------------
   HELPERS — libellés, éléments d'une notion, fiches d'une notion
   ------------------------------------------------------------ */
/* Libellé d'un générateur : GEN_INFO d'abord, puis le libellé de la
   banque G (fichier fusionné), sinon la clé brute. */
function tdmGenLabel(g){
  if (GEN_INFO[g] && GEN_INFO[g].label) return GEN_INFO[g].label;
  if (typeof G !== 'undefined' && G[g] && G[g].label) return G[g].label;
  return g;
}
/* Rappel court (infobulle) : GEN_INFO, sinon libellé + rappel générique. */
function tdmGenRappel(g){
  if (GEN_INFO[g] && GEN_INFO[g].rappel) return GEN_INFO[g].rappel;
  const lbl = tdmGenLabel(g);
  return '<b>' + lbl + '</b> — révise cette notion à l\'aide de ses fiches de rappel.';
}
/* Fiches associées à un générateur. */
function tdmGenFiches(g){
  return (GEN_INFO[g] && GEN_INFO[g].fiches) ? GEN_INFO[g].fiches.slice() : [];
}
/* Décomposition d'une notion en éléments simples :
   [{ g, label, rappel, fiches, stats:{ok,ko} }] — stats depuis la
   sauvegarde scellée (compteur par générateur, voir logQuestion). */
function tdmElemsDeNotion(n){
  if (!n || !n.g) return [];
  const rec = (typeof SAV !== 'undefined' && SAV.data && SAV.data.notions) ? SAV.data.notions[n.id] : null;
  return n.g.map(g => {
    const pg = rec && rec.parGen ? rec.parGen[g] : null;
    return {
      g: g,
      label: tdmGenLabel(g),
      rappel: tdmGenRappel(g),
      fiches: tdmGenFiches(g),
      stats: { ok: pg ? pg.ok : 0, ko: pg ? pg.ko : 0 }
    };
  });
}
/* Fiches thématiques couvrant toute la notion (union ordonnée). */
function tdmFichesDeNotion(n){
  const seen = [], out = [];
  tdmElemsDeNotion(n).forEach(e => {
    e.fiches.forEach(f => { if (seen.indexOf(f) < 0 && FICHES[f]) { seen.push(f); out.push(f); } });
  });
  return out;
}
