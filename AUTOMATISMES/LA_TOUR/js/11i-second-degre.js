/* ============================================================
   11i. SECOND DEGRÉ : sommet & axe de symétrie, extremum,
        taux de variation, détermination d'un trinôme par ses
        conditions et métamorphoses de la parabole — intégration
        des documents « À la découverte des fonctions du second
        degré » (machine à paraboles, taux de variation, jeu du
        panier), « L'Odyssée du second degré — réordonnancement
        du raisonnement » (cours en huit chapitres, carnet de
        terrain, réflexes, affaires à résoudre) et « L'Odyssée
        du second degré — Parties 1 & 2 » (sommet, extremum,
        symétrie, système 3×3, métamorphoses).
   ------------------------------------------------------------
   Déjà présents dans la tour (non dupliqués ici) : mise sous
   forme canonique, développement et factorisation génériques
   (canonique, devRed, factorisation, trouCanonique), équations
   et inéquations (eqSecond, ineqSecond, signExpr, t-solve2deg,
   t-graphineq2), discriminant et signe du trinôme (t-canonique,
   t-discriminant, t-trinomesigne), polynômes de degré 3
   (x-trinome, degre3), taux d'accroissement lu graphiquement
   sur x² ou 1/x (t-graphtaux).
   Sont intégrés ici, au format QCM / raisonnements à clés de
   la tour : lecture des coefficients a, b, c, axe de symétrie,
   sommet et extremum selon le signe de a, taux de variation
   T = a(x₁+x₂)+b affine en le milieu, détermination d'un
   trinôme par ses conditions (f(0) = c, système 3×3, points de
   même ordonnée, sommet + point sans discriminant, trajectoire
   du ballon et sens d'une inégalité, choix contre déduction)
   et métamorphoses de la parabole (étirement, translations,
   lecture canonique, liens b = −2aα et c = aα²+β).
   → 4 notions en sommet de tour (164 étages), 19 générateurs,
     fiches « Sommet, axe & métamorphoses » et « Déterminer un
     trinôme par ses conditions ».
   ============================================================ */

/* ---------- Helpers (préfixe sd2-, aucune collision) ---------- */
function sd2CoefA(a){ return a === 1 ? '' : (a === -1 ? '-' : String(a)); }
function sd2Poly(a,b,c){
  let s = sd2CoefA(a) + 'x^2';
  if(b !== 0) s += (b > 0 ? '+' : '') + (b === 1 ? '' : (b === -1 ? '-' : String(b))) + 'x';
  if(c !== 0) s += (c > 0 ? '+' : '') + String(c);
  return s;
}
/* Moitié d'entier affichée en fraction LaTeX, entier affiché tel quel. */
function sd2F(v){ return Number.isInteger(v) ? String(v) : frac(Math.round(v * 2), 2); }
/* Point-sommet LaTeX « S(α ; β) ». */
function sd2P(x,y){ return 'S(' + x + '\\,;\\,' + y + ')'; }
/* Somme a + b affichée proprement (parenthèses si b négatif). */
function sd2Sum(a,b){ return b >= 0 ? a + '+' + b : a + '+(' + b + ')'; }
/* Forme canonique a(x−α)²+β sans « +0 » disgracieux, coefficients en fractions. */
function sd2CanonStr(a, alpha, beta){
  let s = (a === 1 ? '' : (a === -1 ? '-' : sd2F(a))) + '(x' + (alpha > 0 ? '-' : '+') + Math.abs(alpha) + ')^2';
  if(beta !== 0) s += (beta > 0 ? '+' : '') + beta;
  return s;
}

/* ============================================================
   NOTION 1 — SOMMET, AXE & EXTREMUM
   ============================================================ */
GEN.sd2Coeffs = function(){
  const a = pick([1,2,3,-1,-2,-3]);
  const b = nz(-6,6);
  const c = nz(-6,6);
  const which = pick(['a','b','c']);
  const val = which === 'a' ? a : (which === 'b' ? b : c);
  const seen = new Set([String(val)]);
  const wrongs = [];
  [a,b,c,-a,-b,-c,val+1,val-1].forEach(v => {
    const s = String(v);
    if(!seen.has(s)){ seen.add(s); wrongs.push(M(s)); }
  });
  const lettre = which === 'a' ? '<i>a</i>' : (which === 'b' ? '<i>b</i>' : '<i>c</i>');
  return QCM(
    `Dans le trinôme \\(f(x)=${sd2Poly(a,b,c)}\\), que vaut le coefficient ${lettre} ?`,
    M(String(val)),
    wrongs,
    1,
    EXPL(
      `Un trinôme s\u2019écrit \\(f(x)=ax^2+bx+c\\) avec \\(a \\ne 0\\) : <i>a</i> est le coefficient de \\(x^2\\), <i>b</i> celui de \\(x\\), et <i>c</i> est la constante (l\u2019ordonnée à l\u2019origine, car \\(f(0)=c\\)).`,
      `Dans \\(f(x)=${sd2Poly(a,b,c)}\\), le terme en \\(x^2\\) a pour coefficient ${a}, le terme en \\(x\\) a pour coefficient ${b} et la constante vaut ${c} : ${which} = ${val}.`,
      `Le signe fait partie du coefficient : dans \\(f(x)=${sd2Poly(a,b,c)}\\), le coefficient du terme en \\(x\\) est ${b} — signe compris, pas ${Math.abs(b)}. Et si \\(a=0\\), il n\u2019y a plus de terme en \\(x^2\\) : ce n\u2019est plus du second degré.`
    )
  );
};

GEN.sd2Axe = function(){
  const a = pick([1,2,-1,-2]);
  const b = nz(-6,6);
  const c = R(-5,5);
  const correct = 'x = ' + frac(-b, 2*a);
  const wrongs = ['x = ' + frac(b, 2*a), 'x = ' + frac(-b, a), 'x = ' + frac(b, a),
                  'y = ' + frac(-b, 2*a), 'x = ' + frac(-c, b)];
  return QCM(
    `Quelle est l\u2019équation de l\u2019axe de symétrie de la parabole \\(f(x)=${sd2Poly(a,b,c)}\\) ?`,
    M(correct),
    wrongs.map(w => M(w)),
    1,
    EXPL(
      `Toute parabole possède un axe de symétrie vertical qui passe par son sommet : \\(x=\\alpha\\) avec \\(\\alpha=-\\dfrac{b}{2a}\\). Deux points de la courbe de même ordonnée sont symétriques par rapport à cet axe.`,
      `Ici \\(a=${a}\\) et \\(b=${b}\\) : \\(\\alpha=-\\dfrac{${b}}{2 \\times ${a}}=${frac(-b,2*a)}\\), donc l\u2019axe de symétrie a pour équation \\(x = ${frac(-b,2*a)}\\).`,
      `Ne pas oublier le signe « − » de la formule, et ne pas confondre l\u2019axe vertical \\(x=\\alpha\\) avec une droite horizontale \\(y=\\dots\\) : l\u2019axe de symétrie est TOUJOURS parallèle à l\u2019axe des ordonnées.`
    )
  );
};

GEN.sd2Sommet = function(){
  const a = pick([2,3,-2,-3]);
  const alpha = nz(-3,3);
  let beta = nz(-6,6);
  while(beta === alpha || beta === -alpha) beta = nz(-6,6);
  const b = -2*a*alpha, c = a*alpha*alpha + beta;
  const correct = sd2P(alpha, beta);
  const wrongs = [sd2P(beta, alpha), sd2P(-alpha, beta), sd2P(alpha, -beta), sd2P(alpha+1, beta)];
  return QCM(
    `Quel est le sommet de la parabole \\(f(x)=${sd2Poly(a,b,c)}\\) ?`,
    M(correct),
    wrongs.map(w => M(w)),
    1,
    EXPL(
      `Le sommet \\(S(\\alpha\\,;\\,\\beta)\\) d\u2019une parabole se calcule par \\(\\alpha=-\\dfrac{b}{2a}\\) puis \\(\\beta=f(\\alpha)\\) : c\u2019est le seul point où la pente s\u2019annule, et il commande l\u2019axe de symétrie \\(x=\\alpha\\).`,
      `Ici \\(a=${a}\\) et \\(b=${b}\\) : \\(\\alpha=-\\dfrac{${b}}{2 \\times ${a}}=${alpha}\\), puis \\(\\beta=f(${alpha})=${beta}\\). Le sommet est \\(${correct}\\).`,
      `Ne pas échanger abscisse et ordonnée : \\(\\alpha\\) est l\u2019abscisse, \\(\\beta=f(\\alpha)\\) l\u2019ordonnée. Et le sommet est bien SUR la courbe : toujours vérifier que \\(f(\\alpha)=\\beta\\).`
    )
  );
};

GEN.sd2Extremum = function(){
  const a = pick([1,2,3,-1,-2,-3]);
  const alpha = R(-3,3);
  const beta = nz(-5,5);
  const b = -2*a*alpha, c = a*alpha*alpha + beta;
  const nature = a > 0 ? 'minimum' : 'maximum';
  const autre = a > 0 ? 'maximum' : 'minimum';
  const correct = `Un ${nature} de valeur ${beta}, atteint en x = ${alpha}`;
  const wrongs = [
    `Un ${autre} de valeur ${beta}, atteint en x = ${alpha}`,
    `Un ${nature} de valeur ${beta}, atteint en x = ${alpha+1}`,
    `Un ${nature} de valeur ${alpha}, atteint en x = ${beta}`,
    `Un ${nature} de valeur ${beta+1}, atteint en x = ${alpha}`
  ];
  return QCM(
    `Quel est l\u2019extremum du trinôme \\(f(x)=${sd2Poly(a,b,c)}\\) ?`,
    correct,
    wrongs,
    1,
    EXPL(
      `Le sens d\u2019ouverture est donné par le signe de <i>a</i> : si \\(a \\gt 0\\) la parabole est ouverte vers le haut et le sommet est un <b>minimum</b> ; si \\(a \\lt 0\\) elle est ouverte vers le bas et le sommet est un <b>maximum</b>. La valeur de l\u2019extremum est \\(\\beta=f(\\alpha)\\).`,
      `Ici \\(a=${a}\\) : parabole ouverte vers le ${a > 0 ? 'haut, donc minimum' : 'bas, donc maximum'}. \\(\\alpha=-\\dfrac{b}{2a}=${alpha}\\) et \\(\\beta=f(${alpha})=${beta}\\) : ${nature} de valeur ${beta} atteint en \\(x=${alpha}\\).`,
      `La VALEUR de l\u2019extremum est l\u2019ordonnée \\(\\beta\\), pas l\u2019abscisse \\(\\alpha\\) ; et la nature (minimum ou maximum) ne dépend QUE du signe de <i>a</i>, jamais de la position du sommet.`
    )
  );
};

GEN.trouSommet = function(){
  return TROU(
    `Sommet, axe et extremum d\u2019un trinôme : complète le raisonnement.`,
    `Tout trinôme \\(f(x)=ax^2+bx+c\\) avec \\(a \\ne 0\\) possède un sommet qui commande toute la parabole.<br>
     Étape 1 : \\(\\alpha=-\\dfrac{b}{2a}\\) : c\u2019est {{0}} du sommet.<br>
     Étape 2 : \\(\\beta=f(\\alpha)\\) : c\u2019est {{1}} du sommet.<br>
     Étape 3 : l\u2019axe de {{2}} de la parabole a pour équation \\(x=\\alpha\\).<br>
     Étape 4 : si \\(a \\gt 0\\) la parabole est ouverte vers le haut : le sommet est un {{3}} ; si \\(a \\lt 0\\), c\u2019est un maximum.<br>
     Étape 5 : la forme {{4}} s\u2019écrit \\(f(x)=a(x-\\alpha)^2+\\beta\\).<br>
     Étape 6 : deux points de la courbe de même ordonnée sont {{5}} par rapport à l\u2019axe de symétrie.<br>
     Vérification : \\(f(\\alpha)=\\beta\\) — le sommet \\(S(\\alpha\\,;\\,\\beta)\\) est bien sur la {{6}}.`,
    ['l\u2019abscisse','l\u2019ordonnée','symétrie','minimum','canonique','symétriques','parabole'],
    ['pente','maximum','dérivée','milieu','hypoténuse','pamplemousse','sommet','développée','racine'],
    `Le sommet a pour coordonnées \\(S(\\alpha\\,;\\,\\beta)\\) : \\(\\alpha\\) est une ABSCISSE, \\(\\beta\\) une ORDONNÉE — ne pas les échanger. Le signe de <i>a</i> décide minimum ou maximum, la formule \\(\\alpha=-\\dfrac{b}{2a}\\) décide de la position.`
  );
};

/* ============================================================
   NOTION 2 — TAUX DE VARIATION
   ============================================================ */
GEN.sd2Taux = function(){
  const a = pick([1,2,-1,-2]);
  const b = nz(-5,5);
  const c = R(-5,5);
  const x1 = R(-4,4);
  let x2 = R(-4,4);
  while(x2 === x1) x2 = R(-4,4);
  const T = a*(x1+x2) + b;
  const wrongs = [a*(x1+x2), a*(x1+x2)-b, a*(x2-x1)+b, a*x1*x2+b, T+1];
  return QCM(
    `\\(f(x)=${sd2Poly(a,b,c)}\\). A et B sont les points de la courbe d\u2019abscisses \\(x_A=${x1}\\) et \\(x_B=${x2}\\) : quel est le taux de variation de f entre A et B ?`,
    M(String(T)),
    wrongs.map(w => M(String(w))),
    1,
    EXPL(
      `Le taux de variation entre deux points est la « vitesse moyenne » de la courbe : \\(T=\\dfrac{f(x_B)-f(x_A)}{x_B-x_A}=\\dfrac{\\Delta y}{\\Delta x}\\). Sur le graphique, c\u2019est la pente de la droite (AB).`,
      `Pour un trinôme, le calcul se simplifie toujours : \\(T=a(x_A+x_B)+b\\). Ici : \\(T=${a} \\times (${x1}+${x2})+(${b})=${T}\\).`,
      `Ne pas oublier le « \\(+b\\) » de la formule, et ne pas écrire \\(a(x_B-x_A)+b\\) : c\u2019est la SOMME des abscisses qui apparaît, pas leur différence.`
    )
  );
};

GEN.sd2TauxMilieu = function(){
  const variante = pick(['calcul','concept']);
  const a = pick([1,2,-1]);
  const b = nz(-5,5);
  if(variante === 'calcul'){
    const m = R(-3,3);
    const T = 2*a*m + b;
    const wrongs = [2*a*m, a*m+b, 2*a*m-b, 2*a*m+b+1];
    return QCM(
      `\\(f(x)=${sd2Poly(a,b,0)}\\). Quel est le taux de variation de f entre \\(x_1=${m-1}\\) et \\(x_2=${m+1}\\) ?`,
      M(String(T)),
      wrongs.map(w => M(String(w))),
      1,
      EXPL(
        `La grande propriété du second degré : \\(T=a(x_1+x_2)+b\\). Or \\(x_1+x_2=2m\\) où \\(m\\) est le milieu de l\u2019intervalle : le taux ne dépend QUE du milieu, jamais de l\u2019écartement des deux points.`,
        `Ici le milieu est \\(m=${m}\\) : \\(T=a(x_1+x_2)+b=2am+b=2 \\times ${a} \\times ${m}+(${b})=${T}\\).`,
        `Un raccourci fausseur serait de calculer \\(f(x_2)-f(x_1)\\) en oubliant de diviser par \\(x_2-x_1\\) ; et à milieu FIXÉ, écarter les deux points ne change PAS le taux — c\u2019est tout l\u2019intérêt de la formule.`
      )
    );
  }
  return QCM(
    `\\(f(x)=${sd2Poly(a,b,0)}\\). Le taux de variation entre \\(x_1\\) et \\(x_2\\) vaut \\(T\\). On remplace l\u2019intervalle par un autre intervalle de MÊME milieu (extrémités plus écartées). Que devient le taux ?`,
    `Le même : \\(T=a(x_1+x_2)+b=2am+b\\) ne dépend que du milieu m`,
    [`Le double : les extrémités sont deux fois plus écartées`,
     `La moitié : la pente de la sécante s\u2019adoucit`,
     `Il change de signe : la courbe « tourne » entre les deux points`,
     `Cela dépend de la longueur du nouvel intervalle`],
    1,
    EXPL(
      `Pour un trinôme, \\(T=a(x_1+x_2)+b\\) : seuls \\(a\\), \\(b\\) et la SOMME des abscisses comptent. Or la somme, c\u2019est deux fois le milieu : \\(T=2am+b\\).`,
      `Milieu fixé ⟹ somme fixée ⟹ taux identique. Le taux de variation est une fonction AFFINE du milieu : c\u2019est ce qui rend la parabole « de plus en plus pentue » quand on s\u2019éloigne du sommet.`,
      `L\u2019erreur classique : croire que « plus écarté = plus pentu ». C\u2019est faux pour la sécante d\u2019un trinôme : seule la position du milieu compte.`
    )
  );
};

GEN.trouTaux = function(){
  return TROU(
    `Taux de variation d\u2019un trinôme : complète le raisonnement.`,
    `Le taux de variation de \\(f\\) entre A et B vaut \\(T=\\dfrac{f(x_2)-f(x_1)}{x_2-x_1}\\).<br>
     Étape 1 : sur le graphique, T est la {{0}} de la droite (AB) — la « vitesse moyenne » de la courbe entre A et B.<br>
     Étape 2 : T est le {{1}} de la variation verticale \\(\\Delta y\\) par la variation horizontale \\(\\Delta x\\).<br>
     Étape 3 : pour un trinôme, \\(T=a(x_1+x_2)+b\\) : T ne dépend que de \\(a\\), \\(b\\) et du {{2}} de l\u2019intervalle.<br>
     Étape 4 : en posant \\(x_2=x_1+h\\) : \\(T=2ax_1+ah+b\\) — le taux est une fonction {{3}} de la position de l\u2019intervalle.<br>
     Étape 5 : à milieu fixé, si on écarte symétriquement les deux points, T ne {{4}} pas.<br>
     Étape 6 : plus le milieu s\u2019éloigne du {{5}} de la parabole, plus la valeur absolue de T augmente.<br>
     Vérification : la droite (AB) qui coupe la parabole en A et B est la {{6}} de la courbe entre ces deux points.`,
    ['pente','quotient','milieu','affine','change','sommet','sécante'],
    ['produit','constante','quadratique','hypoténuse','pamplemousse','tangente','dérivée','écart'],
    `Le taux de variation est la PENTE de la sécante, pas de la courbe ; il dépend du MILIEU de l\u2019intervalle, jamais de sa longueur. Ne pas confondre sécante (elle coupe en deux points) et tangente (elle touche en un point).`
  );
};

/* ============================================================
   NOTION 3 — DÉTERMINER UN TRINÔME PAR SES CONDITIONS
   ============================================================ */
GEN.sd2Systeme3 = function(){
  const a = nz(-3,3);
  const b = nz(-5,5);
  const c = nz(-5,5);
  const f0 = c, f1 = a+b+c, f2 = 4*a+2*b+c;
  const which = pick(['a','b','c']);
  const val = which === 'a' ? a : (which === 'b' ? b : c);
  let wrongs;
  if(which === 'a')       wrongs = [f1-f0, f2-f1, -a, a+1];
  else if(which === 'b')  wrongs = [a, c, f1-f0, -b];
  else                    wrongs = [f1, f2, c+1, -c];
  return QCM(
    `Un trinôme \\(f(x)=ax^2+bx+c\\) vérifie \\(f(0)=${f0}\\), \\(f(1)=${f1}\\) et \\(f(2)=${f2}\\). Que vaut le coefficient <i>${which}</i> ?`,
    M(String(val)),
    wrongs.map(w => M(String(w))),
    1,
    EXPL(
      `Trois inconnues (\\(a\\), \\(b\\), \\(c\\)), trois conditions : chacune devient une équation. Le raccourci d\u2019abord : \\(f(0)=c\\) donne <i>c</i> directement.`,
      `Puis les soustractions membre à membre : \\(f(1)-f(0)=${f1-f0}\\) donne \\(a+b=${f1-f0}\\) ; \\(f(2)-f(1)=${f2-f1}\\) donne \\(3a+b=${f2-f1}\\) ; leur différence donne \\(2a=${f2-f1-(f1-f0)}\\), donc \\(a=${a}\\), puis \\(b=${b}\\) et \\(c=${c}\\).`,
      `Ne pas se lancer dans trois équations d\u2019un coup sans soustraire : la soustraction membre à membre élimine les inconnues gênantes. Et toujours vérifier en recalculant \\(f(0)\\), \\(f(1)\\), \\(f(2)\\).`
    )
  );
};

GEN.sd2MemeOrdonnee = function(){
  const a = pick([1,2,-1,-2]);
  const x1 = R(-4,4);
  let x2 = R(-4,4);
  while(x2 === x1) x2 = R(-4,4);
  const b = -a*(x1+x2);
  const y = R(-4,4);
  const c = y - (a*x1*x1 + b*x1);
  const which = pick(['sommet','b']);
  if(which === 'sommet'){
    const correct = frac(x1+x2, 2);
    const wrongs = [frac(x2-x1,2), frac(x1+x2,4), String(x1), frac(x1*x2,2)];
    return QCM(
      `La parabole de \\(f(x)=ax^2+bx+c\\) passe par \\(A(${x1}\\,;\\,${y})\\) et \\(B(${x2}\\,;\\,${y})\\) — deux points de MÊME ordonnée. Que vaut l\u2019abscisse du sommet ?`,
      M(correct),
      wrongs.map(w => M(w)),
      1,
      EXPL(
        `Deux points de la courbe de même ordonnée sont symétriques par rapport à l\u2019axe de la parabole : l\u2019axe passe exactement au MILIEU de \\([x_1\\,;\\,x_2]\\), et le sommet est sur l\u2019axe.`,
        `Ici \\(\\alpha=\\dfrac{x_1+x_2}{2}=\\dfrac{${sd2Sum(x1,x2)}}{2}=${correct}\\). Le sommet est au milieu des jumeaux — pas besoin du discriminant.`,
        `L\u2019erreur classique : chercher les racines ou le discriminant. La symétrie suffit : même ordonnée ⟹ milieu ⟹ axe de symétrie. Attention, l\u2019ordonnée \\(y\\) ne sert à rien pour \\(\\alpha\\).`
      )
    );
  }
  return QCM(
    `La parabole de \\(f(x)=ax^2+bx+c\\) (avec \\(a=${a}\\)) passe par \\(A(${x1}\\,;\\,${y})\\) et \\(B(${x2}\\,;\\,${y})\\) — deux points de MÊME ordonnée. Que vaut le coefficient <i>b</i> ?`,
    M(String(b)),
    [M(String(a*(x1+x2))), M(String(-b)), M(String(y)), M(String(a))],
    1,
    EXPL(
      `Deux points de même ordonnée : le sommet est au milieu, \\(\\alpha=\\dfrac{x_1+x_2}{2}\\), et l\u2019axe \\(x=\\alpha\\) impose le lien \\(b=-2a\\alpha\\).`,
      `Ici \\(\\alpha=\\dfrac{${sd2Sum(x1,x2)}}{2}=${frac(x1+x2,2)}\\), donc \\(b=-2 \\times ${a} \\times ${frac(x1+x2,2)}=${b}\\). Le « pont des jumeaux » : même ordonnée ⟹ milieu ⟹ \\(b\\) sans discriminant.`,
      `Le signe compte : \\(b=-2a\\alpha=-a(x_1+x_2)\\), pas \\(a(x_1+x_2)\\). Et il restera à trouver \\(c\\) avec l\u2019ordonnée commune — ne pas croire que \\(b\\) termine l\u2019affaire.`
    )
  );
};

GEN.sd2Ax2 = function(){
  const x0 = pick([2,3,4]);
  const a = x0 === 2 || x0 === 4
    ? pick([1,-1,2,-2,0.5,-0.5,1.5,-1.5])
    : pick([1,-1,3,-3]);
  const y0 = a*x0*x0;
  const correct = sd2F(a);
  const wrongs = [frac(y0, x0), String(y0), frac(-y0, x0*x0), frac(2*y0, x0*x0)];
  return QCM(
    `\\(f(x)=ax^2\\) (le sommet est en O) et sa parabole passe par \\(P(${x0}\\,;\\,${y0})\\). Que vaut <i>a</i> ?`,
    M(correct),
    wrongs.map(w => M(w)),
    1,
    EXPL(
      `Quand la parabole a son sommet à l\u2019origine, \\(f(x)=ax^2\\) : une seule inconnue. En \\(P(x_0\\,;\\,y_0)\\) : \\(y_0=a x_0^2\\), donc \\(a=\\dfrac{y_0}{x_0^2}\\).`,
      `Ici \\(a=\\dfrac{${y0}}{${x0}^2}=\\dfrac{${y0}}{${x0*x0}}=${correct}\\). Le signe est imposé par la position de P : au-dessus de l\u2019axe ⟹ \\(a \\gt 0\\), en dessous ⟹ \\(a \\lt 0\\).`,
      `Diviser par \\(x_0\\) au lieu de \\(x_0^2\\) est LE piège ; et le signe de <i>a</i> n\u2019est pas un choix : P en dessous de l\u2019axe impose \\(a \\lt 0\\) (le « sourire empoisonné » de la parabole retournée).`
    )
  );
};

GEN.sd2SommetPoint = function(){
  const a = pick([1,-1,2,-2,0.5,-0.5]);
  const alpha = R(-3,3);
  const beta = nz(-5,5);
  let x0 = R(-5,5);
  while(x0 === alpha || (!Number.isInteger(a) && (x0 - alpha) % 2 !== 0)) x0 = R(-5,5);
  const y0 = a*(x0-alpha)*(x0-alpha) + beta;
  const b = -2*a*alpha;
  const cc = a*alpha*alpha + beta;
  const which = pick(['a','b','c']);
  let correct, wrongs;
  if(which === 'a'){
    correct = sd2F(a);
    wrongs = [sd2F((y0-beta)/(x0-alpha)), sd2F(-a), sd2F(a*2), sd2F(a+1)];
  } else if(which === 'b'){
    correct = String(b);
    wrongs = [String(2*a*alpha), String(-a*alpha), String(beta), String(b+1)];
  } else {
    correct = sd2F(cc);
    wrongs = [sd2F(a*alpha*alpha-beta), sd2F(a*alpha*alpha), sd2F(beta), sd2F(cc+1)];
  }
  const canon = sd2CanonStr(a, alpha, beta);
  return QCM(
    `La parabole de f a pour sommet \\(S(${alpha}\\,;\\,${beta})\\) et passe par \\(P(${x0}\\,;\\,${y0})\\) — forme canonique \\(f(x)=${canon}\\). Sans discriminant, que vaut le coefficient <i>${which}</i> de la forme développée ?`,
    M(correct),
    wrongs.map(w => M(w)),
    1,
    EXPL(
      `Sommet connu ⟹ forme canonique \\(f(x)=a(x-\\alpha)^2+\\beta\\) : il ne reste qu\u2019UNE inconnue, \\(a\\). En \\(P(x_0\\,;\\,y_0)\\) : \\(y_0=a(x_0-\\alpha)^2+\\beta\\), donc \\(a=\\dfrac{y_0-\\beta}{(x_0-\\alpha)^2}\\).`,
      `Ici \\(a=\\dfrac{${y0}-(${beta})}{(${x0}-${alpha})^2}=${sd2F(a)}\\) ; puis \\(b=-2a\\alpha=${b}\\) et \\(c=a\\alpha^2+\\beta=${sd2F(cc)}\\) — le « pic du dragon » : jamais besoin du discriminant.`,
      `Le carré de \\((x_0-\\alpha)\\) au dénominateur est obligatoire : \\(\\dfrac{y_0-\\beta}{x_0-\\alpha}\\) (sans carré) donne une valeur fausse. Et le sommet \\((\\alpha\\,;\\,\\beta)\\) signifie bien \\((x-\\alpha)^2\\) : signe compris.`
    )
  );
};

GEN.sd2Trajectoire = function(){
  const d = pick([4,5,6,8]);
  const xw = R(1, d-1);
  const hw = pick([1,2,3]);
  const denom = xw*(xw-d);                       /* négatif : xw < d */
  const amax = frac(hw, denom);
  const which = pick(['cond','b']);
  if(which === 'b'){
    return QCM(
      `Un ballon part de \\(O(0\\,;\\,0)\\) sur une trajectoire \\(h(t)=at^2+bt\\) et retombe au sol en \\(x=${d}\\) (donc \\(h(${d})=0\\) et \\(h(0)=0\\)). Que vaut <i>b</i> en fonction de <i>a</i> ?`,
      M(`b=-${d}a`),
      [M(`b=${d}a`), M('b=-a'), M(`b=-\\dfrac{a}{${d}}`), M('b=-2a')],
      1,
      EXPL(
        `\\(h(0)=0\\) est déjà dans la forme \\(at^2+bt\\) (pas de constante). La seconde condition \\(h(${d})=0\\) se factorise : \\(h(${d})=a \\times ${d}^2+b \\times ${d}=${d}(a \\times ${d}+b)=0\\).`,
        `\\(${d} \\ne 0\\), donc \\(a \\times ${d}+b=0\\) : \\(b=-${d}a\\). L\u2019« élan » \\(b\\) est entièrement imposé par le point de chute.`,
        `Ne pas écrire \\(b=-\\dfrac{a}{${d}}\\) : on divise par \\(${d}\\), pas par \\(${d}^2\\). Et \\(b=-${d}a\\) est une DÉDUCTION de l\u2019énoncé, pas un choix.`
      )
    );
  }
  return QCM(
    `Un ballon part de \\(O(0\\,;\\,0)\\) sur une trajectoire \\(h(t)=at^2+bt\\) avec \\(a \\lt 0\\), retombe au sol en \\(x=${d}\\). Un mur de hauteur \\(${hw}\\) se dresse en \\(x=${xw}\\). Quelle condition sur <i>a</i> garantit que le ballon passe AU-DESSUS du mur ?`,
    M(`a \\le ${amax}`),
    [M(`a \\ge ${amax}`), M(`a = ${amax}`), M(`a \\ge ${frac(hw,-denom)}`), M('a \\gt 0')],
    1,
    EXPL(
      `Deux conditions : la chute \\(h(${d})=0\\) donne \\(b=-${d}a\\), puis le mur exige \\(h(${xw}) \\ge ${hw}\\). Or \\(h(${xw})=a \\times ${xw}^2-(${d}a) \\times ${xw}=a \\times ${xw}(${xw}-${d})\\).`,
      `\\(${xw}-${d}=${xw-d} \\lt 0\\) : en divisant \\(a \\times ${xw}(${xw}-${d}) \\ge ${hw}\\) par ce nombre NÉGATIF, l\u2019inégalité se RETOURNE : \\(a \\le \\dfrac{${hw}}{${xw}(${xw}-${d})}=${amax}\\).`,
      `Diviser par un négatif sans retourner l\u2019inégalité donne le piège \\(a \\ge ${amax}\\) — faux. Et une fois l\u2019encadrement trouvé, toute valeur qui convient est un CHOIX (le problème laisse une liberté) : \\(a\\) n\u2019est pas déduit jusqu\u2019au bout.`
    )
  );
};

GEN.trouConditions = function(){
  return TROU(
    `Déterminer un trinôme par ses conditions : complète le raisonnement.`,
    `Déterminer \\(f(x)=ax^2+bx+c\\) : trois inconnues, donc trois informations, chacune traduite en {{0}}.<br>
     Étape 1 : \\(f(0)=c\\) — l\u2019ordonnée à l\u2019origine donne directement {{1}} : un raccourci précieux.<br>
     Étape 2 : \\(f(x_1)=f(x_2)\\) avec \\(x_1 \\ne x_2\\) : deux points de même ordonnée, le sommet est au {{2}} — \\(\\alpha=\\dfrac{x_1+x_2}{2}\\), puis \\(b=-2a\\alpha\\), puis \\(c\\).<br>
     Étape 3 : sommet \\(S(\\alpha\\,;\\,\\beta)\\) et point \\(P(x_0\\,;\\,y_0)\\) : \\(a=\\dfrac{y_0-\\beta}{(x_0-\\alpha)^2}\\) puis \\(b=-2a\\alpha\\) : chaque coefficient se {{3}} du précédent.<br>
     Étape 4 : quand l\u2019énoncé impose tout, le coefficient se calcule ; quand il reste une liberté, on fait un {{4}} parmi les valeurs possibles.<br>
     Étape 5 : diviser une inégalité par un nombre négatif change {{5}} de l\u2019inégalité.<br>
     Vérification : reporter \\(a\\), \\(b\\) et \\(c\\) dans chaque condition de l\u2019énoncé — l\u2019étape de {{6}} n\u2019est jamais facultative.`,
    ['équation','c','milieu','déduit','choix','le sens','vérification'],
    ['discriminant','hypoténuse','pamplemousse','sommet','racine','aléatoire','tangente','signe'],
    `Trois inconnues, trois équations : toujours traduire les conditions AVANT de calculer. Distinguer ce qui est déduit (imposé par l\u2019énoncé) de ce qui est choisi (liberté laissée par le problème), et diviser une inégalité par un négatif en retournant le sens.`
  );
};

/* ============================================================
   NOTION 4 — MÉTAMORPHOSES DE LA PARABOLE
   ============================================================ */
GEN.sd2Etirement = function(){
  const a = pick([2,3,-2,-3,0.5,-0.5]);
  const aF = sd2F(a);
  const bonne = a > 0
    ? `Un étirement vertical d\u2019un facteur ${M(aF)} : toutes les ordonnées sont multipliées par ${M(aF)}, le sommet reste en O(0 ; 0)`
    : `Un étirement vertical d\u2019un facteur ${M(aF.replace('-',''))} combiné à un retournement : la parabole s\u2019ouvre vers le bas, le sommet reste en O(0 ; 0)`;
  const wrongs = [
    `Une translation de vecteur (0 ; ${M(aF)}) : la courbe glisse verticalement`,
    `Un étirement horizontal : les abscisses sont multipliées par ${M(aF)}`,
    `Le sommet part en (0 ; ${M(aF)}) et la parabole garde la même ouverture`,
    `La parabole est déformée et son sommet suit l\u2019axe des ordonnées`
  ];
  return QCM(
    `De la parabole de référence \\(y=x^2\\) à \\(y=${aF}x^2\\) : quelle métamorphose la courbe a-t-elle subie ?`,
    bonne,
    wrongs,
    1,
    EXPL(
      `L\u2019étirement \\(y=ax^2\\) multiplie toutes les ORDONNÉES par \\(a\\) : le sommet \\(O(0\\,;\\,0)\\) ne bouge pas (car \\(a \\times 0=0\\)). Si \\(a \\lt 0\\) la parabole est retournée (ouverte vers le bas) ; si \\(0 \\lt a \\lt 1\\) elle s\u2019écrase vers l\u2019axe.`,
      `Ici \\(a=${aF}\\) : ${a > 0 ? 'facteur d\u2019étirement ' + M(aF) + ', la courbe se resserre autour de l\u2019axe' : 'étirement combiné à un retournement, la courbe s\u2019ouvre vers le bas'}, et \\(O(0\\,;\\,0)\\) reste le sommet.`,
      `Ne pas confondre étirement (les ordonnées changent, le sommet reste) et translation (toute la courbe glisse, le sommet suit). L\u2019étirement ne touche JAMAIS aux abscisses.`
    )
  );
};

GEN.sd2Transl = function(){
  const type = pick(['v','h']);
  if(type === 'v'){
    const beta = nz(-4,4);
    const correct = `Une translation verticale de ${Math.abs(beta)} vers le ${beta > 0 ? 'haut' : 'bas'} : le sommet passe de O(0 ; 0) à (0 ; ${beta})`;
    const wrongs = [
      `Une translation horizontale de ${Math.abs(beta)} vers la ${beta > 0 ? 'droite' : 'gauche'} : le sommet passe en (${beta} ; 0)`,
      `Une translation verticale de ${Math.abs(beta)} vers le ${beta > 0 ? 'bas' : 'haut'} : le sommet passe en (0 ; ${-beta})`,
      `Un étirement vertical d\u2019un facteur ${Math.abs(beta)}`,
      `Le sommet passe en (${beta} ; 0) sans autre changement`
    ];
    return QCM(
      `De la parabole de référence \\(y=x^2\\) à \\(y=x^2${beta > 0 ? '+' : ''}${beta}\\) : quelle métamorphose ?`,
      correct,
      wrongs,
      1,
      EXPL(
        `\\(y=x^2+\\beta\\) ajoute \\(\\beta\\) à CHAQUE ordonnée : toute la courbe glisse parallèlement à l\u2019axe des ordonnées, sans se déformer.`,
        `Ici \\(\\beta=${beta}\\) : glissement de ${Math.abs(beta)} vers le ${beta > 0 ? 'haut' : 'bas'}, le sommet passe de \\(O(0\\,;\\,0)\\) à \\((0\\,;\\,${beta})\\).`,
        `La translation verticale ne change NI l\u2019ouverture NI la forme : seul le sommet « monte » ou « descend ». Ne pas la confondre avec \\(y=(x-\\alpha)^2\\), qui glisse horizontalement.`
      )
    );
  }
  const alpha = nz(-4,4);
  const correct = `Une translation horizontale de ${Math.abs(alpha)} vers la ${alpha > 0 ? 'droite' : 'gauche'} : le sommet passe de O(0 ; 0) à (${alpha} ; 0)`;
  const wrongs = [
    `Une translation horizontale de ${Math.abs(alpha)} vers la ${alpha > 0 ? 'gauche' : 'droite'} : le sommet passe en (${-alpha} ; 0)`,
    `Une translation verticale de ${Math.abs(alpha)} : le sommet passe en (0 ; ${alpha})`,
    `Un étirement horizontal d\u2019un facteur ${Math.abs(alpha)}`,
    `La courbe se retourne car le signe dans la parenthèse a changé`
  ];
  return QCM(
    `De la parabole de référence \\(y=x^2\\) à \\(y=(x${alpha > 0 ? '-' : '+'}${Math.abs(alpha)})^2\\) : quelle métamorphose ?`,
    correct,
    wrongs,
    1,
    EXPL(
      `\\(y=(x-\\alpha)^2\\) glisse la courbe parallèlement à l\u2019axe des ABSCISSES : le sommet part de \\(O\\) vers \\((\\alpha\\,;\\,0)\\). Le signe est piégeux : c\u2019est \\((x-\\alpha)\\) qui envoie le sommet en \\(\\alpha\\).`,
      `Ici \\(y=(x${alpha > 0 ? '-' : '+'}${Math.abs(alpha)})^2=(x-(${alpha}))^2\\) : sommet en \\((${alpha}\\,;\\,0)\\), donc glissement de ${Math.abs(alpha)} vers la ${alpha > 0 ? 'droite' : 'gauche'}.`,
      `\\((x+${Math.abs(alpha)})^2\\) correspond à \\(\\alpha=-${Math.abs(alpha)}\\) : la courbe va vers la GAUCHE. Le « + » dans la parenthèse signifie un glissement vers les abscisses négatives.`
    )
  );
};

GEN.sd2CanoniqueLecture = function(){
  const a = pick([1,-1,2,-2,3,-3]);
  const alpha = nz(-4,4);
  const beta = R(-5,5);
  const canon = sd2CanonStr(a, alpha, beta);
  const which = pick(['sommet','alpha','beta']);
  let correct, wrongs;
  if(which === 'sommet'){
    correct = sd2P(alpha, beta);
    wrongs = [sd2P(-alpha, beta), sd2P(beta, alpha), sd2P(alpha, -beta)];
  } else if(which === 'alpha'){
    correct = String(alpha);
    wrongs = [String(-alpha), String(beta), String(a)];
  } else {
    correct = String(beta);
    wrongs = [String(-beta), String(alpha), String(a)];
  }
  const question = which === 'sommet' ? 'Quel est son sommet ?'
    : (which === 'alpha' ? 'Que vaut l\u2019abscisse \\(\\alpha\\) du sommet ?' : 'Que vaut l\u2019ordonnée \\(\\beta\\) du sommet ?');
  return QCM(
    `La forme canonique de f est \\(f(x)=${canon}\\). ${question}`,
    M(correct),
    wrongs.map(w => M(w)),
    1,
    EXPL(
      `La forme canonique \\(f(x)=a(x-\\alpha)^2+\\beta\\) expose le sommet : \\(S(\\alpha\\,;\\,\\beta)\\) et l\u2019axe \\(x=\\alpha\\). Le coefficient <i>a</i> donne l\u2019ouverture.`,
      `Ici \\(f(x)=${canon}\\) : le sommet est \\(${sd2P(alpha,beta)}\\), l\u2019axe de symétrie est \\(x=${alpha}\\), et \\(a=${a}\\) (parabole ouverte vers le ${a > 0 ? 'haut' : 'bas'}).`,
      `ATTENTION au signe dans la parenthèse : \\((x${alpha > 0 ? '-' : '+'}${Math.abs(alpha)})^2=(x-(${alpha}))^2\\) — ici \\(\\alpha=${alpha}\\), pas ${-alpha} ! C\u2019est le piège numéro un de la lecture canonique.`
    )
  );
};

GEN.sd2DevCanon = function(){
  const a = pick([1,-1,2,-2]);
  const alpha = nz(-3,3);
  const beta = R(-5,5);
  const b = -2*a*alpha;
  const c = a*alpha*alpha + beta;
  const canon = sd2CanonStr(a, alpha, beta);
  const which = pick(['b','c']);
  const correct = String(which === 'b' ? b : c);
  const wrongs = which === 'b'
    ? [String(2*a*alpha), String(-a*alpha), String(beta), String(b+1)]
    : [String(a*alpha*alpha-beta), String(a*alpha*alpha), String(beta), String(c+1)];
  return QCM(
    `\\(f(x)=${canon}\\) (forme canonique). Sans redévelopper tout le calcul : que vaut le coefficient <i>${which}</i> de la forme développée \\(ax^2+bx+c\\) ?`,
    M(correct),
    wrongs.map(w => M(w)),
    1,
    EXPL(
      `Les liens entre forme canonique et forme développée : \\(f(x)=a(x-\\alpha)^2+\\beta=ax^2-2a\\alpha x+a\\alpha^2+\\beta\\), donc \\(b=-2a\\alpha\\) et \\(c=a\\alpha^2+\\beta\\).`,
      `Ici \\(a=${a}\\), \\(\\alpha=${alpha}\\), \\(\\beta=${beta}\\) : \\(b=-2 \\times ${a} \\times ${alpha}=${b}\\) et \\(c=${a} \\times ${alpha}^2+(${beta})=${c}\\).`,
      `Le signe de \\(b\\) est le piège : \\(b=-2a\\alpha\\), pas \\(2a\\alpha\\). Et \\(c\\) combine le carré ET \\(\\beta\\) : oublier \\(\\beta\\) dans \\(c\\) est l\u2019erreur classique.`
    )
  );
};

GEN.trouMetamorphe = function(){
  return TROU(
    `Métamorphoses de la parabole de référence : complète le raisonnement.`,
    `Toutes les paraboles sont des « métamorphoses » de la parabole de référence \\(y=x^2\\).<br>
     Étape 1 : étirement \\(y=ax^2\\) : les ordonnées sont multipliées par \\(a\\), le {{0}} reste en \\(O(0\\,;\\,0)\\) ; si \\(a \\lt 0\\), la parabole est {{1}} (ouverte vers le bas).<br>
     Étape 2 : translation {{2}} \\(y=x^2+\\beta\\) : la courbe glisse parallèlement à l\u2019axe des ordonnées, le sommet va en \\((0\\,;\\,\\beta)\\).<br>
     Étape 3 : translation horizontale \\(y=(x-\\alpha)^2\\) : le sommet va en \\((\\alpha\\,;\\,0)\\) — c\u2019est \\((x-\\alpha)\\) qui translate vers la {{3}} quand \\(\\alpha \\gt 0\\).<br>
     Étape 4 : en composant : \\(y=a(x-\\alpha)^2+\\beta\\) — c\u2019est la forme {{4}}, de sommet \\(S(\\alpha\\,;\\,\\beta)\\).<br>
     Étape 5 : l\u2019axe de symétrie de la forme canonique est {{5}}.<br>
     Étape 6 : liens directs : \\(b=-2a\\alpha\\) et \\(c=a\\alpha^2+\\beta\\) — on passe à la forme développée sans tout {{6}}.<br>
     Vérification : en développant \\(a(x-\\alpha)^2+\\beta\\) on retrouve exactement \\(ax^2+bx+c\\).`,
    ['sommet','retournée','verticale','droite','canonique','x = α','développer'],
    ['horizontale','gauche','développée','factoriser','pamplemousse','hypoténuse','y = β','milieu'],
    `L\u2019étirement ne déplace pas le sommet, les translations si. Le signe de la parenthèse decide du sens du glissement : \\((x-\\alpha)\\) avec \\(\\alpha \\gt 0\\) va vers la droite, \\((x+\\alpha)\\) vers la gauche.`
  );
};

/* ============================================================
   FICHES DE COURS
   ============================================================ */
FICHES['second-degre-sommet'] = { titre: '🟨 Sommet, axe & métamorphoses de la parabole', html: `
  <p><b>Sommet et axe :</b> pour \\(f(x)=ax^2+bx+c\\) avec \\(a \\ne 0\\), \\(\\alpha=-\\dfrac{b}{2a}\\), \\(\\beta=f(\\alpha)\\) : sommet \\(S(\\alpha\\,;\\,\\beta)\\) et axe de symétrie \\(x=\\alpha\\). Si \\(a \\gt 0\\) la parabole est ouverte vers le haut : le sommet est un <b>minimum</b> de valeur \\(\\beta\\) ; si \\(a \\lt 0\\), un <b>maximum</b>. Deux points de la courbe de même ordonnée sont symétriques par rapport à l\u2019axe.</p>
  <p><b>Forme canonique :</b> \\(f(x)=a(x-\\alpha)^2+\\beta\\) — le sommet se LIT directement. Piège de signe : \\((x+3)^2=(x-(-3))^2\\) donc \\(\\alpha=-3\\). Liens sans développer : \\(b=-2a\\alpha\\) et \\(c=a\\alpha^2+\\beta\\).</p>
  ${tableHTML(['Métamorphose','Formule','Effet sur le sommet'],[
    ['Étirement vertical','\\(y=ax^2\\)','reste en O(0 ; 0) ; retournement si a < 0'],
    ['Translation verticale','\\(y=x^2+\\beta\\)','passe en (0 ; β)'],
    ['Translation horizontale','\\(y=(x-\\alpha)^2\\)','passe en (α ; 0)'],
    ['Composition = canonique','\\(y=a(x-\\alpha)^2+\\beta\\)','\\(S(\\alpha\\,;\\,\\beta)\\), axe \\(x=\\alpha\\)']
  ])}
  <p><b>Métamorphoses depuis \\(y=x^2\\) :</b> l\u2019étirement multiplie les ordonnées (jamais les abscisses) et ne déplace pas le sommet ; les translations glissent toute la courbe, sommet compris. \\((x-\\alpha)\\) avec \\(\\alpha \\gt 0\\) translate vers la droite, \\((x+\\alpha)\\) vers la gauche.</p>
  <p><b>Taux de variation :</b> \\(T=\\dfrac{f(x_2)-f(x_1)}{x_2-x_1}\\) est la pente de la sécante (AB). Pour un trinôme : \\(T=a(x_1+x_2)+b=2am+b\\) où \\(m\\) est le MILIEU de l\u2019intervalle — T est affine en le milieu, donc constant à milieu fixé, et croît en s\u2019éloignant du sommet. En posant \\(x_2=x_1+h\\) : \\(T=2ax_1+ah+b\\), fonction affine de la position.</p>` };

FICHES['second-degre-conditions'] = { titre: '🟨 Déterminer un trinôme par ses conditions', html: `
  <p><b>Principe :</b> \\(f(x)=ax^2+bx+c\\) a trois inconnues : il faut trois conditions, chacune traduite en équation. Raccourci : \\(f(0)=c\\) donne la constante directement. Trois valeurs connues \\(f(0)\\), \\(f(1)\\), \\(f(2)\\) : soustraire membre à membre — \\(f(1)-f(0)=a+b\\), \\(f(2)-f(1)=3a+b\\), puis \\(2a\\) par différence, et on remonte vers \\(b\\) puis \\(c\\).</p>
  <p><b>Deux points de même ordonnée :</b> \\(f(x_1)=f(x_2)\\) avec \\(x_1 \\ne x_2\\) — le sommet est au MILIEU : \\(\\alpha=\\dfrac{x_1+x_2}{2}\\) ; puis \\(b=-2a\\alpha=-a(x_1+x_2)\\) ; puis \\(c\\) avec l\u2019ordonnée commune. Aucun discriminant nécessaire.</p>
  <p><b>Sommet + un point :</b> forme canonique \\(f(x)=a(x-\\alpha)^2+\\beta\\) ; en \\(P(x_0\\,;\\,y_0)\\) : \\(a=\\dfrac{y_0-\\beta}{(x_0-\\alpha)^2}\\) (carré obligatoire au dénominateur !), puis \\(b=-2a\\alpha\\) et \\(c=a\\alpha^2+\\beta\\) — le « pic du dragon » : sans discriminant. Cas \\(f(x)=ax^2\\) : \\(a=\\dfrac{y_0}{x_0^2}\\), le signe de \\(a\\) étant imposé par la position du point (au-dessus : \\(a \\gt 0\\)).</p>
  <p><b>Trajectoire & inégalité :</b> ballon \\(h(t)=at^2+bt\\) parti de O et tombé en \\(d\\) : \\(h(d)=0 \\Rightarrow b=-ad\\). Franchir un mur \\((x_w\\,;\\,h_w)\\) : \\(h(x_w) \\ge h_w\\) ; comme \\(x_w \\lt d\\), diviser par le facteur NÉGATIF \\(x_w(x_w-d)\\) RETOURNE l\u2019inégalité : \\(a \\le \\dfrac{h_w}{x_w(x_w-d)}\\). Une fois l\u2019encadrement posé, la valeur exacte de \\(a\\) est un <b>choix</b> (liberté de l\u2019énoncé), alors que \\(b\\), \\(c\\), \\(\\alpha\\) sont des <b>déductions</b> (imposés). Toujours vérifier en reportant \\(a\\), \\(b\\), \\(c\\) dans chaque condition.</p>` };

/* ============================================================
   GEN_INFO DES 19 GÉNÉRATEURS
   ============================================================ */
(function(){
  const SO = 'second-degre-sommet', CO = 'second-degre-conditions';
  const defs = [
    ['sd2Coeffs',           'Lire les coefficients a, b, c',            [SO]],
    ['sd2Axe',              'Axe de symétrie x = α',                   [SO]],
    ['sd2Sommet',           'Sommet S(α ; β)',                         [SO]],
    ['sd2Extremum',         'Minimum ou maximum selon a',             [SO]],
    ['trouSommet',          'Raisonnement : sommet & axe',            [SO]],
    ['sd2Taux',             'Taux de variation a(x₁+x₂)+b',           [SO, CO]],
    ['sd2TauxMilieu',       'À milieu fixé, T est constant',          [SO, CO]],
    ['trouTaux',            'Raisonnement : taux de variation',       [SO, CO]],
    ['sd2Systeme3',         'Système 3 × 3 : f(0), f(1), f(2)',       [CO]],
    ['sd2MemeOrdonnee',     'Même ordonnée : sommet au milieu',       [CO]],
    ['sd2Ax2',              'f(x)=ax² : coefficient par un point',    [CO]],
    ['sd2SommetPoint',      'Sommet + point : a sans discriminant',   [CO]],
    ['sd2Trajectoire',      'Trajectoire : inégalité & sens',          [CO]],
    ['trouConditions',      'Raisonnement : choisir ou déduire',       [CO]],
    ['sd2Etirement',        'Étirement y = ax²',                       [SO]],
    ['sd2Transl',           'Translations de la parabole',             [SO]],
    ['sd2CanoniqueLecture', 'Lire la forme canonique',                 [SO]],
    ['sd2DevCanon',         'Canonique vers développée (b, c)',        [SO]],
    ['trouMetamorphe',      'Raisonnement : métamorphoses',            [SO]]
  ];
  const rappels = {
    sd2Coeffs: "a = coefficient de x², b = coefficient de x, c = constante ; f(0) = c.",
    sd2Axe: "Axe de symétrie : x = α = −b/(2a), vertical, passe par le sommet.",
    sd2Sommet: "S(α ; β) avec α = −b/(2a) et β = f(α).",
    sd2Extremum: "a > 0 : minimum β en x = α ; a < 0 : maximum β en x = α.",
    trouSommet: "Chaîne : α = −b/2a, β = f(α), axe x = α, minimum ou maximum selon le signe de a, symétrie.",
    sd2Taux: "T = a(x₁+x₂)+b : somme des abscisses, puis +b.",
    sd2TauxMilieu: "T = 2am+b : à milieu fixé, le taux ne change pas.",
    trouTaux: "Chaîne : pente de la sécante, quotient Δy/Δx, milieu, affine en la position, sécante.",
    sd2Systeme3: "f(0)=c, puis soustractions membre à membre : f(1)−f(0)=a+b, f(2)−f(1)=3a+b.",
    sd2MemeOrdonnee: "Même ordonnée : α = (x₁+x₂)/2, puis b = −2aα, puis c.",
    sd2Ax2: "a = y₀/x₀² : diviser par le carré, signe imposé par la position.",
    sd2SommetPoint: "a = (y₀−β)/(x₀−α)² puis b = −2aα et c = aα²+β : sans discriminant.",
    sd2Trajectoire: "h(d)=0 donne b=−ad ; diviser par un négatif retourne l'inégalité ; puis choix de a.",
    trouConditions: "Chaîne : équation, f(0)=c, milieu, déduire ou choisir, sens de l'inégalité, vérification.",
    sd2Etirement: "y=ax² : ordonnées ×a, sommet O invariant, retournement si a < 0.",
    sd2Transl: "x²+β : glissement vertical ; (x−α)² : glissement horizontal (attention au signe).",
    sd2CanoniqueLecture: "a(x−α)²+β : sommet S(α ; β) lu directement — piège du signe.",
    sd2DevCanon: "b = −2aα et c = aα²+β : liens directs sans développer.",
    trouMetamorphe: "Chaîne : étirement, retournement, translations, forme canonique, axe, liens b et c."
  };
  defs.forEach(function(d){ GEN_INFO[d[0]] = { label: d[1], fiches: d[2], rappel: rappels[d[0]] }; });
})();

/* ============================================================
   4 NOTIONS EN SOMMET DE TOUR (→ 164 étages)
   ============================================================ */
NOTIONS.push(
  { id: 'sd-sommet', name: 'Second degré : sommet, axe & extremum',
    g: ['sd2Coeffs','sd2Axe','sd2Sommet','sd2Extremum','trouSommet'], family: 'amber', prob: 0.5 },
  { id: 'sd-taux-variation', name: 'Taux de variation d\u2019un trinôme',
    g: ['sd2Taux','sd2TauxMilieu','trouTaux'], family: 'amber', prob: 0.5 },
  { id: 'sd-conditions', name: 'Déterminer un trinôme par ses conditions',
    g: ['sd2Systeme3','sd2MemeOrdonnee','sd2Ax2','sd2SommetPoint','sd2Trajectoire','trouConditions'], family: 'amber', prob: 0.5 },
  { id: 'sd-metamorphoses', name: 'Métamorphoses de la parabole : étirement & translations',
    g: ['sd2Etirement','sd2Transl','sd2CanoniqueLecture','sd2DevCanon','trouMetamorphe'], family: 'amber', prob: 0.5 }
);

/* Formes 3D des nouveaux étages (constantes de 14-formes-3d.js). */
document.addEventListener('DOMContentLoaded', function(){
  FLOOR_SHAPES['sd-sommet']           = 'dometangent';
  FLOOR_SHAPES['sd-taux-variation']   = 'ramp';
  FLOOR_SHAPES['sd-conditions']       = 'lighthouse';
  FLOOR_SHAPES['sd-metamorphoses']    = 'funnel';
});
