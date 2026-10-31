/* ============================================================
   11k. LIMITES DE SUITES : définitions, références & opérations,
        formes indéterminées, gendarmes & convergence monotone,
        suites arithmético-géométriques — intégration des
        documents « Le cours illustré des limites » (définition,
        références, opérations, 4 formes indéterminées, gendarmes,
        comparaison, convergence monotone, trigonométrie),
        « L'Odyssée des Limites » (bilan complet), « 48 énigmes
        suites et limites », « Définition ε–N pas à pas » (bande
        2ε, rang N, plafond ⌈⌉), « Exercices limites & PBL »
        (nombre d'or/Fibonacci, café qui refroidit, racine carrée
        imbriquée, paradoxe de Zénon), « La Chasse au Trésor des
        Suites » (limite de q^n, somme cumulée u_0/(1−q), potion
        arithmético-géométrique, toile d'araignée, sirènes de
        l'oscillation, valeurs d'adhérence, point fixe
        attractif/répulsif), « Cours & exemples suites
        géométriques » (théorème limite de q^n), et l'application
        d'évaluation « Suites et limites » (polynômes, quotients,
        √n/n, oscillations, trigonométrie, quantité conjuguée,
        gros problème de la forêt de montagne).
   ------------------------------------------------------------
   Déjà présents dans la tour (non dupliqués ici) : calculs de
   termes, reconnaissance et modélisation arithmétique/géométrique
   et sens de variation (11j), nombre dérivé comme limite du taux
   d'accroissement (11/11b), sommes de termes adjacents
   (sommes-suites), logarithmes pour isoler n (08).
   Sont intégrés ici, au format QCM / raisonnements à clés de la
   tour : définition ε–N (marge ε, rang N, plafond), convergence,
   divergence, oscillation et valeurs d'adhérence, limites de
   référence (n^k, 1/n^k, q^n selon |q| et le signe de q),
   opérations et levée des quatre formes indéterminées
   (factorisation du terme dominant, quantité conjuguée,
   comparaison des degrés, sinus/cosinus bornés), théorème des
   gendarmes, minorations vers +∞, convergence monotone (racine
   carrée imbriquée), point fixe et suite auxiliaire des
   arithmético-géométriques, limite et seuil de stabilisation,
   somme géométrique cumulée u_0/(1−q) et problèmes concrets
   (forêt replantée, café qui refroidit, médicament, paradoxe de
   Zénon, quotients de Fibonacci et nombre d'or).
   → 4 notions en sommet de tour (172 étages), 20 générateurs,
     fiches « Limites de suites : définitions, références & FI »,
     « Gendarmes, comparaison & convergence monotone » et
     « Arithmético-géométriques : point fixe & limite ».
   ============================================================ */

/* ---------- Helpers (préfixe lk-, aucune collision) ---------- */
/* Coefficient de variable : 1 → '', −1 → '-', 2 → '2'. */
function lkCo(a, v){
  if(a === 0) return '';
  return (a === 1 ? '' : (a === -1 ? '-' : String(a))) + v;
}
/* Constante signée : 3 → '+3', −3 → '-3'. */
function lkSg(n){ return n >= 0 ? '+' + n : String(n); }
/* Terme signé : 1 → '+n', −1 → '-n', 0 → '', sinon '+3n'. */
function lkT(c, v){
  if(c === 0) return '';
  if(c === 1) return '+' + v;
  if(c === -1) return '-' + v;
  return lkSg(c) + v;
}

/* ============================================================
   NOTION 1 — LIMITES DE SUITES : DÉFINITIONS, RÉFÉRENCES & OPÉRATIONS
   ============================================================ */
GEN.suLimRef = function(){
  const type = pick(['inverse','geoConv','geoDiv','racine']);
  if(type === 'inverse'){
    const L = nz(-5,5), k = pick([1,2,3]);
    return QCM(
      `La suite est définie pour tout \\(n \\ge 1\\) par \\(u_n = ${L} ${lkT(1, '')}\\dfrac{1}{n^{${k}}}\\). Déterminez \\(\\lim\\limits_{n\\to+\\infty} u_n\\).`,
      M(String(L)),
      [M('0'), M(String(L + 1)), M(String(L - 1)), M('+\\infty'), M(String(k))],
      1,
      EXPL(
        `Limites de référence : \\(n^k \\to +\\infty\\), donc \\(\\dfrac{1}{n^k} \\to 0\\) pour tout entier \\(k \\ge 1\\). La suite s\u2019écrase contre sa constante.`,
        `\\(\\dfrac{1}{n^{${k}}} \\to 0\\), donc \\(u_n = ${L} ${lkT(1, '')}\\dfrac{1}{n^{${k}}} \\to ${L} + 0 = ${L}\\).`,
        `Ne pas additionner la constante à la fraction : c\u2019est la partie \\(\\dfrac{1}{n^k}\\) qui disparaît, le ${L} reste intact.`
      )
    );
  }
  if(type === 'geoConv'){
    const a = R(2,5);
    const q = pick([[1,2],[1,3],[2,3]]);
    const qTex = frac(q[0], q[1]);
    return QCM(
      `La suite est définie pour tout \\(n \\ge 0\\) par \\(u_n = ${a}\\times\\left(${qTex}\\right)^{n}\\). Déterminez \\(\\lim\\limits_{n\\to+\\infty} u_n\\).`,
      M('0'),
      [M(String(a)), M('+\\infty'), M('1'), `N\u2019admet pas de limite`],
      1,
      EXPL(
        `Règle d\u2019or des suites géométriques : si \\(0 \\lt q \\lt 1\\), alors \\(q^n \\to 0\\) — les vagues s\u2019apaisent.`,
        `Ici \\(q = ${qTex}\\) est compris entre 0 et 1 : \\(q^n \\to 0\\), donc \\(u_n = ${a}\\times q^n \\to 0\\).`,
        `Le premier terme \\(u_0 = ${a}\\) ne sauve rien : multiplier un nombre qui tend vers 0 par ${a} donne encore 0.`
      )
    );
  }
  if(type === 'geoDiv'){
    const a = R(2,9), q = pick([2,3,4]);
    return QCM(
      `La suite est définie pour tout \\(n \\ge 0\\) par \\(u_n = ${a}\\times ${q}^{n}\\). Déterminez \\(\\lim\\limits_{n\\to+\\infty} u_n\\).`,
      M('+\\infty'),
      [M('0'), M(String(a)), M('1'), M('-\\infty')],
      1,
      EXPL(
        `Règle d\u2019or : si \\(q \\gt 1\\), alors \\(q^n \\to +\\infty\\) — c\u2019est le tsunami.`,
        `Ici \\(q = ${q} \\gt 1\\) : \\(q^n \\to +\\infty\\), donc \\(u_n \\to +\\infty\\) (elle diverge).`,
        `Diverger vers \\(+\\infty\\) N\u2019EST PAS converger : une limite infinie n\u2019est pas une limite finie, la suite ne converge pas.`
      )
    );
  }
  const k = R(2,5);
  return QCM(
    `Déterminez \\(\\lim\\limits_{n\\to+\\infty} \\left(n^{${k}} - \\sqrt{n}\\right)\\).`,
    M('+\\infty'),
    [M('0'), M('1'), M('-\\infty'), `N\u2019admet pas de limite`],
    1,
    EXPL(
      `Deux références : \\(n^{${k}} \\to +\\infty\\) et \\(\\sqrt{n} \\to +\\infty\\) — la forme \\(\\infty - \\infty\\) demande de comparer les puissances.`,
      `Factorisons par le terme dominant \\(n^{${k}}\\) : \\(n^{${k}}\\left(1 - \\dfrac{\\sqrt{n}}{n^{${k}}}\\right)\\). Or \\(\\dfrac{\\sqrt{n}}{n^{${k}}} = \\dfrac{1}{n^{${k - 1}}}\\times\\dfrac{1}{\\sqrt{n}} \\to 0\\), donc le facteur tend vers 1 et le produit vers \\(+\\infty\\).`,
      `« Racine ralentit, puissance emporte » : contre \\(n^{${k}}\\), la racine carrée est négligeable — c\u2019est le terme de plus haut degré qui décide.`
    )
  );
};

GEN.suLimOps = function(){
  const type = pick(['somme','produit','quotient','sommeGeo']);
  if(type === 'somme'){
    const a = nz(-4,4), b = nz(-9,9), c = nz(-9,9);
    const correct = a > 0 ? M('+\\infty') : M('-\\infty');
    return QCM(
      `La suite est définie pour tout \\(n \\ge 1\\) par \\(u_n = ${lkCo(a, 'n^2')} ${lkSg(b)} ${lkT(c, '')}\\dfrac{1}{n}\\). Déterminez \\(\\lim\\limits_{n\\to+\\infty} u_n\\).`,
      correct,
      [a > 0 ? M('-\\infty') : M('+\\infty'), M(String(b)), M('0'), `Forme indéterminée : impossible de conclure`],
      1,
      EXPL(
        `Opérations : la limite d\u2019une somme est la somme des limites, SANS forme indéterminée ici (aucun \\(\\infty - \\infty\\)).`,
        `\\(n^2 \\to ${a > 0 ? '+' : ''}\\infty\\) domine, \\(\\dfrac{1}{n} \\to 0\\) disparaît : \\(u_n \\to ${a > 0 ? '+\\infty' : '-\\infty'}\\).`,
        `La constante \\(b\\) et la fraction \\(\\dfrac{c}{n}\\) sont emportées par \\(n^2\\) : ce n\u2019est PAS parce que \\(1/n \\to 0\\) que la somme tend vers ${b}.`
      )
    );
  }
  if(type === 'produit'){
    const L1 = nz(-5,5), L2 = nz(-5,5);
    return QCM(
      `La suite est définie pour tout \\(n \\ge 1\\) par \\(u_n = \\left(${L1} ${lkT(1, '')}\\dfrac{1}{n}\\right)\\left(${L2} ${lkT(1, '')}\\dfrac{1}{n^2}\\right)\\). Déterminez \\(\\lim\\limits_{n\\to+\\infty} u_n\\).`,
      M(String(L1 * L2)),
      [M(String(L1 + L2)), M('0'), M(String(L1 * L2 + 1)), `Forme indéterminée : impossible de conclure`],
      1,
      EXPL(
        `La limite d\u2019un produit est le produit des limites quand chaque facteur a une limite FINIE : aucune forme indéterminée ici.`,
        `Le premier facteur tend vers \\(${L1}\\), le second vers \\(${L2}\\) : \\(u_n \\to ${L1} \\times ${L2} = ${L1 * L2}\\).`,
        `Les petits \\(\\dfrac{1}{n}\\) et \\(\\dfrac{1}{n^2}\\) disparaissent AVANT de multiplier — ne pas distribuer les fractions sur les constantes.`
      )
    );
  }
  if(type === 'quotient'){
    const L1 = nz(-5,5), L2 = nz(-5,5);
    return QCM(
      `La suite est définie pour tout \\(n \\ge 1\\) par \\(u_n = \\dfrac{${L1} ${lkT(1, '')}\\dfrac{1}{n}}{${L2} ${lkT(1, '')}\\dfrac{1}{n^2}}\\). Déterminez \\(\\lim\\limits_{n\\to+\\infty} u_n\\).`,
      M(frac(L1, L2)),
      [M('0'), M(String(L1 + L2)), M(frac(L2, L1)), `Forme indéterminée : impossible de conclure`],
      1,
      EXPL(
        `La limite d\u2019un quotient est le quotient des limites SI le dénominateur a une limite non nulle : c\u2019est le cas ici.`,
        `Numérateur \\(${L1}\\), dénominateur \\(${L2}\\) : \\(u_n \\to ${frac(L1, L2)}\\).`,
        `Le dénominateur ne tend surtout pas vers 0 : \\(L2 = ${L2}\\) pilote, la petite fraction \\(1/n^2\\) s\u2019évanouit.`
      )
    );
  }
  const L = nz(-5,5), a = R(2,9);
  return QCM(
    `La suite est définie pour tout \\(n \\ge 0\\) par \\(u_n = ${L} ${lkT(1, '')} ${a}\\times\\left(${frac(1, 2)}\\right)^{n}\\). Déterminez \\(\\lim\\limits_{n\\to+\\infty} u_n\\).`,
    M(String(L)),
    [M('0'), M(String(a)), M(String(L + a)), M('+\\infty')],
    1,
    EXPL(
      `Somme de deux limites connues : \\(\\left(${frac(1, 2)}\\right)^n \\to 0\\) car la raison est entre 0 et 1.`,
      `\\(${a}\\times\\left(${frac(1, 2)}\\right)^n \\to 0\\), donc \\(u_n \\to ${L} + 0 = ${L}\\).`,
      `La suite s\u2019approche de \\(${L}\\) sans jamais forcément l\u2019atteindre : \\(u_n\\) est la constante ${L} corrigée par un terme qui s\u2019éteint.`
    )
  );
};

GEN.suConvergence = function(){
  const type = pick(['osc','oscN','oscPlus','geoNegConv','geoNegDiv']);
  if(type === 'osc'){
    return QCM(
      `La suite est définie par \\(u_n = (-1)^{n}\\). Que peut-on dire de sa limite ?`,
      `Elle n\u2019admet pas de limite : elle oscille entre \\(-1\\) et \\(1\\) (deux valeurs d\u2019adhérence)`,
      [`Elle converge vers \\(1\\)`, `Elle converge vers \\(0\\)`, `Elle converge vers \\(-1\\)`, `Elle tend vers \\(+\\infty\\)`],
      2,
      EXPL(
        `Une suite converge si ses termes se rapprochent D\u2019UN SEUL réel. Ici les termes pairs valent \\(1\\), les impairs \\(-1\\).`,
        `La suite revient indéfiniment autour de \\(-1\\) et de \\(1\\) : ce sont deux valeurs d\u2019adhérence. Aucune bande autour d\u2019un seul réel ne finit par contenir tous les termes.`,
        `Comme la limite d\u2019une suite convergente est UNIQUE, deux valeurs d\u2019adhérence interdisent la convergence : ne pas confondre « bornée » et « convergente ».`
      )
    );
  }
  if(type === 'oscN'){
    return QCM(
      `La suite est définie par \\(u_n = \\dfrac{(-1)^{n}}{n}\\) pour \\(n \\ge 1\\). Que peut-on dire de sa limite ?`,
      `Elle converge vers \\(0\\) : l\u2019amplitude \\(\\dfrac{1}{n}\\) écrase l\u2019alternance`,
      [`Elle n\u2019admet pas de limite car elle est alternée`, `Elle converge vers \\(1\\)`, `Elle converge vers \\(-1\\)`, `Elle tend vers \\(+\\infty\\)`],
      2,
      EXPL(
        `Une suite alternée PEUT converger : ce qui compte, c\u2019est l\u2019amplitude des sauts, pas leur signe.`,
        `\\(-\\dfrac{1}{n} \\le u_n \\le \\dfrac{1}{n}\\) et les deux gendarmes tendent vers 0, donc \\(u_n \\to 0\\). Les termes alternent au-dessus et en-dessous de 0, de plus en plus près.`,
        `« Alternée » ne veut pas dire « sans limite » : \\((-1)^n\\) seule diverge, mais \\((-1)^n/n\\) converge — c\u2019est l\u2019écrasement par \\(1/n\\) qui décide.`
      )
    );
  }
  if(type === 'oscPlus'){
    return QCM(
      `La suite est définie par \\(u_n = (-1)^{n} ${lkT(1, '')}\\dfrac{1}{n}\\) pour \\(n \\ge 1\\). Que peut-on dire de sa limite ?`,
      `Elle n\u2019admet pas de limite : les termes pairs tendent vers \\(1\\), les impairs vers \\(-1\\)`,
      [`Elle converge vers \\(0\\)`, `Elle converge vers \\(1\\)`, `Elle converge vers \\(-1\\)`, `Elle tend vers \\(+\\infty\\)`],
      2,
      EXPL(
        `Regarder séparément les deux familles : termes pairs \\(1 ${lkT(1, '')}\\dfrac{1}{n} \\to 1\\), termes impairs \\(-1 ${lkT(1, '')}\\dfrac{1}{n} \\to -1\\).`,
        `Deux sous-suites avec deux limites différentes (1 et −1) : la suite a deux valeurs d\u2019adhérence, elle ne peut pas converger — l\u2019alternance persiste même si \\(1/n \\to 0\\).`,
        `L\u2019amplitude entre pairs et impairs reste voisine de 2 : la suite ne se resserre PAS autour d\u2019un point unique. Ne pas confondre avec \\((-1)^n/n\\), qui converge vers 0.`
      )
    );
  }
  if(type === 'geoNegConv'){
    const a = R(2,5);
    return QCM(
      `La suite est définie par \\(u_n = ${a}\\times\\left(-${frac(1, 2)}\\right)^{n}\\). Que peut-on dire de sa limite ?`,
      `Elle converge vers \\(0\\) : raison négative de module inférieur à 1, l\u2019alternance s\u2019éteint`,
      [`Elle n\u2019admet pas de limite car la raison est négative`, `Elle converge vers \\(1\\)`, `Elle tend vers \\(+\\infty\\)`, `Elle converge vers \\(${-a}\\)`],
      2,
      EXPL(
        `Pour \\(q \\lt 0\\), les signes alternent, mais ce qui décide de la convergence, c\u2019est le MODULE : \\(|q| \\lt 1 \\Rightarrow |q^n| = |q|^n \\to 0\\).`,
        `\\(\\left|u_n\\right| = ${a}\\times\\left(${frac(1, 2)}\\right)^{n} \\to 0\\) : les termes alternent au-dessus et en-dessous de 0 en s\u2019écrasant. Convergence alternée vers 0.`,
        `Raison négative ne signifie pas divergence : seul \\(q \\le -1\\) fait osciller sans limite, \\(-\\dfrac{1}{2}\\) fait converger.`
      )
    );
  }
  const a = R(2,5);
  return QCM(
    `La suite est définie par \\(u_n = ${a}\\times\\left(-${frac(3, 2)}\\right)^{n}\\). Que peut-on dire de sa limite ?`,
    `Elle n\u2019admet pas de limite : le module grandit en changeant de signe (divergence oscillante)`,
    [`Elle converge vers \\(0\\)`, `Elle tend vers \\(+\\infty\\)`, `Elle tend vers \\(-\\infty\\)`, `Elle converge vers \\(1\\)`],
    2,
    EXPL(
      `Raison négative de module supérieur à 1 : \\(|q| = ${frac(3, 2)} \\gt 1\\), l\u2019amplitude EXPLOSE.`,
      `\\(|u_n| = ${a}\\times\\left(${frac(3, 2)}\\right)^{n} \\to +\\infty\\) et les signes alternent : tantôt très grand positif, tantôt très grand négatif — aucune limite, ni finie ni infinie.`,
      `Divergence oscillante : la suite ne tend ni vers \\(+\\infty\\) ni vers \\(-\\infty\\), elle bascule sans cesse d\u2019un monde à l\u2019autre.`
    )
  );
};

GEN.suEpsilon = function(){
  const type = pick(['rang','rangs','roles']);
  if(type === 'rang'){
    const L = nz(-5,5);
    const eps = pick([
      { tex: '0{,}4', inv: '2{,}5', N: 3 },
      { tex: '0{,}3', inv: '3{,}33', N: 4 },
      { tex: '0{,}15', inv: '6{,}67', N: 7 },
      { tex: '0{,}12', inv: '8{,}33', N: 9 }
    ]);
    return QCM(
      `La suite est définie pour \\(n \\ge 1\\) par \\(u_n = ${L} ${lkT(1, '')}\\dfrac{1}{n}\\). On se donne \\(\\varepsilon = ${eps.tex}\\). Quel est le plus petit rang \\(N\\) tel que \\(\\left|u_n - ${L}\\right| \\lt \\varepsilon\\) pour tout \\(n \\ge N\\) ?`,
      M(String(eps.N)),
      [M(String(eps.N - 1)), M(String(eps.N + 1)), M(String(eps.N + 2)), M(String(L))],
      1,
      EXPL(
        `Définition ε–N : \\(\\left|u_n - ${L}\\right| = \\dfrac{1}{n}\\) ; la condition \\(\\dfrac{1}{n} \\lt \\varepsilon\\) équivaut à \\(n \\gt \\dfrac{1}{\\varepsilon}\\).`,
        `\\(\\dfrac{1}{\\varepsilon} \\approx ${eps.inv}\\) : le plus petit entier qui convient est \\(N = ${eps.N}\\), le plafond \\(\\left\\lceil \\dfrac{1}{\\varepsilon} \\right\\rceil\\) (plus petit entier supérieur ou égal).`,
        `Vérifier toujours \\(N - 1\\) : pour \\(n = ${eps.N - 1}\\) l\u2019inégalité ÉCHOUE encore — c\u2019est bien \\(${eps.N}\\) le premier rang de confiance, et pas \\(${eps.N - 1}\\).`
      )
    );
  }
  if(type === 'rangs'){
    const L = nz(-5,5);
    const eps = pick([
      { tex: '0{,}09', inv: '3{,}33', N: 4 }
    ]);
    return QCM(
      `La suite est définie pour \\(n \\ge 1\\) par \\(u_n = ${L} ${lkT(1, '')}\\dfrac{1}{n^{2}}\\). On se donne \\(\\varepsilon = ${eps.tex}\\). Quel est le plus petit rang \\(N\\) tel que \\(\\left|u_n - ${L}\\right| \\lt \\varepsilon\\) pour tout \\(n \\ge N\\) ?`,
      M(String(eps.N)),
      [M(String(eps.N - 1)), M(String(eps.N + 1)), M('10'), M('100')],
      1,
      EXPL(
        `Ici \\(\\left|u_n - ${L}\\right| = \\dfrac{1}{n^2}\\) : la condition \\(\\dfrac{1}{n^2} \\lt \\varepsilon\\) équivaut à \\(n \\gt \\dfrac{1}{\\sqrt{\\varepsilon}}\\).`,
        `\\(\\dfrac{1}{\\sqrt{\\varepsilon}} = \\dfrac{1}{\\sqrt{${eps.tex}}} \\approx ${eps.inv}\\), donc \\(N = ${eps.N}\\) : dès le rang \\(${eps.N}\\), tous les termes sont dans la bande de largeur \\(2\\varepsilon\\) autour de \\(${L}\\).`,
        `La convergence en \\(1/n^2\\) est plus rapide qu\u2019en \\(1/n\\) : pour la même précision, le rang de confiance est plus petit. Plus \\(\\varepsilon\\) est petit, plus \\(N\\) est grand.`
      )
    );
  }
  return QCM(
    `Dans la définition « pour tout \\(\\varepsilon \\gt 0\\), il existe \\(N\\) tel que \\(\\left|u_n - \\ell\\right| \\lt \\varepsilon\\) pour tout \\(n \\ge N\\) », que représente le nombre \\(N\\) ?`,
    `Le rang de confiance : à partir de \\(N\\), tous les termes entrent dans la bande autour de \\(\\ell\\) et n\u2019en sortent plus`,
    [`La marge d\u2019erreur choisie autour de \\(\\ell\\)`, `La limite de la suite`, `Le nombre de termes de la suite`, `Une précision supplémentaire, plus fine que \\(\\varepsilon\\)`],
    1,
    EXPL(
      `Deux acteurs : \\(\\varepsilon\\) est la précision IMPOSÉE (la marge d\u2019erreur), \\(N\\) est la RÉPONSE de la suite (le rang où la précision est atteinte).`,
      `Graphiquement : on trace une bande de largeur \\(2\\varepsilon\\) autour de \\(\\ell\\) ; \\(N\\) est le moment où la suite entre dans la bande pour n\u2019en plus jamais sortir.`,
      `Ne pas inverser les rôles : \\(N\\) dépend de \\(\\varepsilon\\) — plus on exige de précision (ε petit), plus il faut attendre loin (N grand).`
    )
  );
};

GEN.trouLimitesRef = function(){
  return TROU(
    `Limites de suites : complète la définition et les références.`,
    `Une suite \\((u_n)\\) {{0}} vers un réel \\(\\ell\\) si, pour tout \\(\\varepsilon \\gt 0\\), il existe un rang \\(N\\) tel que \\(\\left|u_n - \\ell\\right| \\lt \\varepsilon\\) dès que \\(n \\ge N\\).<br>
     Références : \\(n^k\\) tend vers \\(+\\infty\\) ; \\(\\dfrac{1}{n^k}\\) tend vers {{1}} pour tout \\(k \\ge 1\\) ; \\(q^n\\) tend vers 0 si \\(\\left|q\\right| \\lt 1\\), vers \\(+\\infty\\) si \\(q \\gt 1\\).<br>
     Le rang \\(N\\) doit être un entier : on prend le {{2}} \\(\\left\\lceil \\cdot \\right\\rceil\\) de la valeur calculée — le plus petit entier supérieur ou égal.<br>
     Une limite, si elle existe, est {{3}} : une suite ne peut pas converger vers deux réels différents.<br>
     Une suite sans limite finie {{4}} : soit vers \\(\\pm\\infty\\), soit en oscillant sans se stabiliser.<br>
     Les valeurs vers lesquelles une suite revient régulièrement s\u2019appellent des valeurs d\u2019{{5}} : si une suite en possède plusieurs, elle ne peut pas converger.<br>
     Interprétation graphique : une {{6}} de largeur \\(2\\varepsilon\\) autour de \\(\\ell\\) finit par contenir tous les termes à partir du rang \\(N\\), et ne les relâche plus.`,
    ['converge','zéro','plafond','unique','diverge','adhérence','bande'],
    ['sommet','raison','infini','double','oscille','mesure','courbe','hippogriffe','ornithorynque'],
    `Toute la définition tient dans l\u2019ordre des quantificateurs : POUR TOUT ε (la précision est imposée), IL EXISTE N (la suite répond) tel que POUR TOUT n ≥ N (tous les termes suivants restent dans la bande). Inverser « pour tout » et « il existe » détruit le sens.`
  );
};

/* ============================================================
   NOTION 2 — FORMES INDÉTERMINÉES : LES LEVER
   ============================================================ */
GEN.suFISomme = function(){
  const type = pick(['carre','cube','produit']);
  if(type === 'carre'){
    const a = nz(-5,5);
    const correct = a > 0 ? M('+\\infty') : M('-\\infty');
    return QCM(
      `Déterminez \\(\\lim\\limits_{n\\to+\\infty} \\left((n ${lkSg(a)})^{2} - n^{2}\\right)\\).`,
      correct,
      [M('0'), M(String(2 * a)), a > 0 ? M('-\\infty') : M('+\\infty'), `On ne peut pas conclure : la forme \\(\\infty - \\infty\\) reste indéterminée`],
      1,
      EXPL(
        `La forme \\(\\infty - \\infty\\) est indéterminée TANT qu\u2019on n\u2019a pas développé : ici le développement la lève complètement.`,
        `\\((n ${lkSg(a)})^2 = n^2 ${lkT(2 * a, 'n')} ${lkSg(a * a)}\\), donc \\((n ${lkSg(a)})^2 - n^2 = ${2 * a}\\,n ${lkSg(a * a)}\\), expression affine dont le signe du coefficient \\(${2 * a}\\) décide : la limite est \\(${a > 0 ? '+' : ''}\\infty\\).`,
        `« Les \\(n^2\\) s\u2019annulent donc la limite est 0 » : NON — ce qui reste après simplification \\((${2 * a}n ${lkSg(a * a)})\\) emporte la suite vers \\(${a > 0 ? '+' : ''}\\infty\\).`
      )
    );
  }
  if(type === 'cube'){
    const a = nz(-4,4);
    const correct = a > 0 ? M('-\\infty') : M('+\\infty');
    return QCM(
      `Déterminez \\(\\lim\\limits_{n\\to+\\infty} \\left(n^{3} - (n ${lkSg(a)})^{3}\\right)\\).`,
      correct,
      [M('0'), M(String(-3 * a)), a > 0 ? M('+\\infty') : M('-\\infty'), `On ne peut pas conclure : la forme \\(\\infty - \\infty\\) reste indéterminée`],
      1,
      EXPL(
        `Développer \\((n ${lkSg(a)})^3 = n^3 ${lkT(3 * a, 'n^2')} ${lkT(3 * a * a, 'n')} ${lkSg(a * a * a)}\\) : les \\(n^3\\) disparaissent.`,
        `\\(n^3 - (n ${lkSg(a)})^3 = ${-3 * a}\\,n^2 ${lkT(-3 * a * a, 'n')} ${lkSg(-a * a * a)}\\) : le terme dominant \\(${-3 * a}n^2\\) est ${a > 0 ? 'négatif' : 'positif'}, donc la limite est \\(${a > 0 ? '-\\infty' : '+\\infty'}\\).`,
        `Après développement, regarder le TERME DE PLUS HAUT DEGRÉ restant : ici \\(${-3 * a}n^2\\) — et non le terme constant, qui ne décide jamais de ce type de limite.`
      )
    );
  }
  const a = nz(-4,4), b = nz(-9,9);
  const k = a * b + 1;
  const correct = k > 0 ? M('+\\infty') : (k < 0 ? M('-\\infty') : M(String(b)));
  return QCM(
    `Déterminez \\(\\lim\\limits_{n\\to+\\infty} \\left((${lkCo(a, 'n')} ${lkSg(1)})(n ${lkSg(b)}) - ${lkCo(a, 'n^2')}\\right)\\).`,
    correct,
    [M('0'), M(String(b)), M(String(k)), `On ne peut pas conclure : la forme \\(\\infty - \\infty\\) reste indéterminée`],
    1,
    EXPL(
      `Forme \\(\\infty - \\infty\\) apparente : développer le produit avant toute conclusion.`,
      `\\((${lkCo(a, 'n')} ${lkSg(1)})(n ${lkSg(b)}) = ${lkCo(a, 'n^2')} ${lkT(a * b, 'n')} ${lkT(1, 'n')} ${lkSg(b)}\\), donc en retranchant \\(${lkCo(a, 'n^2')}\\) il reste \\((${a * b} ${lkSg(1)})\\,n ${lkSg(b)} = ${k}\\,n ${lkSg(b)}\\) : la limite est ${k > 0 ? '\\(+\\infty\\)' : (k < 0 ? '\\(-\\infty\\)' : `\\(${b}\\)`)}.`,
      `Une forme indéterminée n\u2019est pas une impasse : c\u2019est un signal « transforme l\u2019expression ». Ici le développement suffit — la limite existe bel et bien.`
    )
  );
};

GEN.suFIQuotient = function(){
  const type = pick(['memeDegre','petitDegre','grandDegre','racine','zerozero']);
  if(type === 'memeDegre'){
    const a = nz(-6,6), d = nz(-6,6), b = nz(-9,9), c = nz(-9,9), e = nz(-9,9), f = nz(-9,9);
    return QCM(
      `Déterminez \\(\\lim\\limits_{n\\to+\\infty} \\dfrac{${lkCo(a, 'n^2')} ${lkT(b, 'n')} ${lkSg(c)}}{${lkCo(d, 'n^2')} ${lkT(e, 'n')} ${lkSg(f)}}\\).`,
      M(frac(a, d)),
      [M('0'), M('+\\infty'), M(frac(d, a)), `On ne peut pas conclure : la forme \\(\\dfrac{\\infty}{\\infty}\\) reste indéterminée`],
      1,
      EXPL(
        `Forme \\(\\dfrac{\\infty}{\\infty}\\) : factoriser numérateur et dénominateur par le terme dominant \\(n^2\\).`,
        `\\(\\dfrac{n^2\\left(${a} ${lkT(b, '')}\\dfrac{1}{n} ${lkSg(c)}\\dfrac{1}{n^2}\\right)}{n^2\\left(${d} ${lkT(e, '')}\\dfrac{1}{n} ${lkSg(f)}\\dfrac{1}{n^2}\\right)} \\to \\dfrac{${a}}{${d}} = ${frac(a, d)}\\) : tout ce qui est en \\(\\dfrac{1}{n}\\) ou \\(\\dfrac{1}{n^2}\\) tend vers 0.`,
        `Même degré au numérateur et au dénominateur ⟹ limite = rapport des coefficients dominants \\(\\dfrac{a}{d}\\) — pas \\(\\dfrac{b}{e}\\) (coefficients du milieu), ni 0.`
      )
    );
  }
  if(type === 'petitDegre'){
    const a = nz(-6,6), c = nz(-6,6), b = nz(-9,9), d = nz(-9,9);
    return QCM(
      `Déterminez \\(\\lim\\limits_{n\\to+\\infty} \\dfrac{${lkCo(a, 'n^2')} ${lkSg(b)}}{${lkCo(c, 'n^3')} ${lkT(d, 'n')}}\\).`,
      M('0'),
      [M('+\\infty'), M(frac(a, c)), M('-\\infty'), `On ne peut pas conclure : la forme \\(\\dfrac{\\infty}{\\infty}\\) reste indéterminée`],
      1,
      EXPL(
        `Forme \\(\\dfrac{\\infty}{\\infty}\\) : factoriser par la PLUS GRANDE puissance, \\(n^3\\), celle du dénominateur.`,
        `\\(\\dfrac{n^3\\left(${a}\\dfrac{1}{n} ${lkSg(b)}\\dfrac{1}{n^3}\\right)}{n^3\\left(${c} ${lkT(d, '')}\\dfrac{1}{n^2}\\right)} \\to \\dfrac{0}{${c}} = 0\\) : le numérateur s\u2019écrase plus vite que le dénominateur.`,
        `Degré du numérateur STRICTEMENT inférieur ⟹ limite 0 : c\u2019est le dénominateur le plus « costaud » qui gagne. Ne pas répondre \\(${frac(a, c)}\\), qui ne vaut que pour des degrés ÉGAUX.`
      )
    );
  }
  if(type === 'grandDegre'){
    const a = nz(-4,4), c = nz(-4,4), b = nz(-9,9), d = nz(-9,9);
    const correct = (a > 0) ? M('+\\infty') : M('-\\infty');
    return QCM(
      `Déterminez \\(\\lim\\limits_{n\\to+\\infty} \\dfrac{${lkCo(a, 'n^3')} ${lkT(b, 'n')}}{${lkCo(c, 'n^2')} ${lkSg(d)}}\\).`,
      correct,
      [M('0'), a > 0 ? M('-\\infty') : M('+\\infty'), M(frac(a, c)), `On ne peut pas conclure : la forme \\(\\dfrac{\\infty}{\\infty}\\) reste indéterminée`],
      1,
      EXPL(
        `Forme \\(\\dfrac{\\infty}{\\infty}\\) : factoriser par la plus grande puissance, \\(n^3\\), celle du numérateur.`,
        `\\(\\dfrac{n^3\\left(${a} ${lkT(b, '')}\\dfrac{1}{n^2}\\right)}{n^3\\left(${c}\\dfrac{1}{n} ${lkSg(d)}\\dfrac{1}{n^3}\\right)} \\to \\dfrac{${a}}{0^{+}}\\) : le numérateur l\u2019emporte, la limite est \\(${a > 0 ? '+' : ''}\\infty\\).`,
        `Degré du numérateur STRICTEMENT supérieur ⟹ limite infinie, du signe du coefficient dominant du numérateur : c\u2019est lui qui gagne la course de croissance.`
      )
    );
  }
  if(type === 'racine'){
    const a = nz(-5,5);
    return QCM(
      `Déterminez \\(\\lim\\limits_{n\\to+\\infty} \\dfrac{\\sqrt{n} ${lkSg(a)}}{n}\\).`,
      M('0'),
      [M('1'), M(String(a)), M('+\\infty'), `On ne peut pas conclure : la forme \\(\\dfrac{\\infty}{\\infty}\\) reste indéterminée`],
      1,
      EXPL(
        `Factoriser le numérateur et le dénominateur par \\(\\sqrt{n}\\) : c\u2019est le terme dominant.`,
        `\\(\\dfrac{\\sqrt{n}\\left(1 ${lkSg(a)}\\dfrac{1}{\\sqrt{n}}\\right)}{\\sqrt{n}\\times\\sqrt{n}} = \\dfrac{1 ${lkSg(a)}\\dfrac{1}{\\sqrt{n}}}{\\sqrt{n}} \\to \\dfrac{1}{+\\infty} = 0\\).`,
        `La racine croît bien vers \\(+\\infty\\), mais BEAUCOUP plus lentement que \\(n\\) : le quotient s\u2019écrase — \\(\\dfrac{\\sqrt{n}}{n} = \\dfrac{1}{\\sqrt{n}} \\to 0\\).`
      )
    );
  }
  const q = R(1,5), r = R(1,5);
  return QCM(
    `Déterminez \\(\\lim\\limits_{n\\to+\\infty} \\dfrac{\\dfrac{1}{n} ${lkT(q, '')}\\dfrac{1}{n^2}}{\\dfrac{${r}}{n}}\\).`,
    M(frac(1, r)),
    [M('0'), M(String(r)), M('+\\infty'), `On ne peut pas conclure : la forme \\(\\dfrac{0}{0}\\) reste indéterminée`],
    1,
    EXPL(
      `Forme \\(\\dfrac{0}{0}\\) : factoriser HAUT ET BAS par \\(\\dfrac{1}{n}\\), le plus « gros » des petits termes.`,
      `\\(\\dfrac{\\dfrac{1}{n}\\left(1 ${lkT(q, '')}\\dfrac{1}{n}\\right)}{\\dfrac{1}{n}\\times ${r}} = \\dfrac{1 ${lkT(q, '')}\\dfrac{1}{n}}{${r}} \\to \\dfrac{1}{${r}} = ${frac(1, r)}\\).`,
      `Répondre 0 parce que « les deux tendent vers 0 » est l\u2019erreur type du \\(\\dfrac{0}{0}\\) : après factorisation, il reste un vrai rapport de limites, ici \\(${frac(1, r)}\\).`
    )
  );
};

GEN.suFIConjuguee = function(){
  const type = pick(['standard','inverse','decalee','unite']);
  if(type === 'standard'){
    const a = R(1,9);
    return QCM(
      `La suite est définie pour \\(n \\ge 1\\) par \\(u_n = \\sqrt{n^{2} ${lkT(a, 'n')}} - n\\). Déterminez \\(\\lim\\limits_{n\\to+\\infty} u_n\\) <em>(indice : quantité conjuguée)</em>.`,
      M(frac(a, 2)),
      [M('0'), M(String(a)), M('+\\infty'), `On ne peut pas conclure : la forme \\(\\infty - \\infty\\) reste indéterminée`],
      1,
      EXPL(
        `Forme \\(\\infty - \\infty\\) avec racines : multiplier haut et bas par la quantité conjuguée \\(\\dfrac{\\sqrt{n^2 ${lkT(a, 'n')}} ${lkSg(1)}n}{\\sqrt{n^2 ${lkT(a, 'n')}} ${lkSg(1)}n}\\) fait apparaître l\u2019identité \\(a^2 - b^2\\).`,
        `\\(u_n = \\dfrac{\\left(\\sqrt{n^2 ${lkT(a, 'n')}} - n\\right)\\left(\\sqrt{n^2 ${lkT(a, 'n')}} ${lkSg(1)}n\\right)}{\\sqrt{n^2 ${lkT(a, 'n')}} ${lkSg(1)}n} = \\dfrac{${a}n}{\\sqrt{n^2 ${lkT(a, 'n')}} ${lkSg(1)}n}\\). En factorisant le bas par \\(n\\) : \\(\\dfrac{${a}}{\\sqrt{1 ${lkT(a, '')}\\dfrac{1}{n}} ${lkSg(1)}1} \\to \\dfrac{${a}}{2}\\).`,
        `Après conjuguée, ne pas répondre \\(+\\infty\\) « parce qu\u2019il reste du \\(n\\) » : le \\(n\\) du haut est compensé par le facteur \\(n\\) sorti en bas — la limite est le fini \\(${frac(a, 2)}\\).`
      )
    );
  }
  if(type === 'inverse'){
    const a = R(1,9);
    return QCM(
      `La suite est définie pour \\(n \\ge 1\\) par \\(u_n = n - \\sqrt{n^{2} - ${a}n}\\). Déterminez \\(\\lim\\limits_{n\\to+\\infty} u_n\\).`,
      M(frac(a, 2)),
      [M('0'), M(String(a)), M('+\\infty'), `On ne peut pas conclure : la forme \\(\\infty - \\infty\\) reste indéterminée`],
      1,
      EXPL(
        `Même réflexe : la quantité conjuguée de \\(n - \\sqrt{n^2 - ${a}n}\\) est \\(n ${lkSg(1)}\\sqrt{n^2 - ${a}n}\\).`,
        `\\(u_n = \\dfrac{n^2 - \\left(n^2 - ${a}n\\right)}{n ${lkSg(1)}\\sqrt{n^2 - ${a}n}} = \\dfrac{${a}n}{n\\left(1 ${lkSg(1)}\\sqrt{1 - ${a}\\dfrac{1}{n}}\\right)} \\to \\dfrac{${a}}{2}\\).`,
        `Le sens de la soustraction change la formule, pas la méthode : \\(\\sqrt{n^2 ${lkT(a, 'n')}} - n\\) et \\(n - \\sqrt{n^2 - ${a}n}\\) donnent la MÊME limite \\(${frac(a, 2)}\\).`
      )
    );
  }
  if(type === 'decalee'){
    const a = R(1,9);
    return QCM(
      `La suite est définie pour \\(n \\ge 1\\) par \\(u_n = \\sqrt{n ${lkSg(a)}} - \\sqrt{n}\\). Déterminez \\(\\lim\\limits_{n\\to+\\infty} u_n\\).`,
      M('0'),
      [M(String(a)), M(frac(a, 2)), M('+\\infty'), `On ne peut pas conclure : la forme \\(\\infty - \\infty\\) reste indéterminée`],
      1,
      EXPL(
        `Quantité conjuguée : multiplier par \\(\\dfrac{\\sqrt{n ${lkSg(a)}} ${lkSg(1)}\\sqrt{n}}{\\sqrt{n ${lkSg(a)}} ${lkSg(1)}\\sqrt{n}}\\).`,
        `\\(u_n = \\dfrac{\\left(n ${lkSg(a)}\\right) - n}{\\sqrt{n ${lkSg(a)}} ${lkSg(1)}\\sqrt{n}} = \\dfrac{${a}}{\\sqrt{n ${lkSg(a)}} ${lkSg(1)}\\sqrt{n}} \\to \\dfrac{${a}}{+\\infty} = 0\\).`,
        `Ici le décalage \\(${a}\\) est CONSTANT : après conjuguée, le numérateur est un nombre fixe et le dénominateur file vers \\(+\\infty\\) — la limite est 0, pas \\(${frac(a, 2)}\\) (qui exige un décalage proportionnel à \\(n\\)).`
      )
    );
  }
  return QCM(
    `La suite est définie pour \\(n \\ge 1\\) par \\(u_n = \\sqrt{n ${lkSg(1)}} - \\sqrt{n}\\). Déterminez \\(\\lim\\limits_{n\\to+\\infty} u_n\\) <em>(indice : \\(a^2 - b^2\\))</em>.`,
    M('0'),
    [M('1'), M(frac(1, 2)), M('+\\infty'), `On ne peut pas conclure : la forme \\(\\infty - \\infty\\) reste indéterminée`],
    1,
    EXPL(
      `L\u2019identité remarquable \\(a^2 - b^2 = (a - b)(a ${lkSg(1)}b)\\) s\u2019applique aux racines : \\(a = \\sqrt{n ${lkSg(1)}}\\), \\(b = \\sqrt{n}\\).`,
      `\\(u_n = \\dfrac{\\left(\\sqrt{n ${lkSg(1)}} - \\sqrt{n}\\right)\\left(\\sqrt{n ${lkSg(1)}} ${lkSg(1)}\\sqrt{n}\\right)}{\\sqrt{n ${lkSg(1)}} ${lkSg(1)}\\sqrt{n}} = \\dfrac{1}{\\sqrt{n ${lkSg(1)}} ${lkSg(1)}\\sqrt{n}} \\to 0\\).`,
      `Chaque terme \\(u_n\\) est positif mais écrasé par le dénominateur : la suite tend vers 0, illustration parfaite du \\(\\infty - \\infty\\) qui se résout en une fraction qui s\u2019éteint.`
    )
  );
};

GEN.suFITrigo = function(){
  const type = pick(['carrecos','quotient','somme','petitquotient']);
  if(type === 'carrecos'){
    const k = R(2,4);
    return QCM(
      `La suite est définie pour \\(n \\ge 1\\) par \\(u_n = n^{2}\\left(${k} ${lkSg(1)}\\cos n\\right)\\). Déterminez \\(\\lim\\limits_{n\\to+\\infty} u_n\\) <em>(justifier par un encadrement)</em>.`,
      M('+\\infty'),
      [M('0'), M(String(k)), `Elle n\u2019admet pas de limite à cause des oscillations de \\(\\cos n\\)`, M(String(k + 1))],
      1,
      EXPL(
        `Pour tout réel \\(n\\) : \\(-1 \\le \\cos n \\le 1\\), donc \\(${k - 1} \\le ${k} ${lkSg(1)}\\cos n \\le ${k + 1}\\).`,
        `En multipliant par \\(n^2 \\gt 0\\) : \\(n^2\\left(${k - 1}\\right) \\le u_n \\le n^2\\left(${k + 1}\\right)\\). Or \\((${k - 1})n^2 \\to +\\infty\\) car \\(k - 1 = ${k - 1} \\gt 0\\) : par comparaison, \\(u_n \\to +\\infty\\).`,
        `« \\(\\cos n\\) oscille donc pas de limite » : FAUX ici — l\u2019oscillation est CONFINÉE entre ${k - 1} et ${k + 1}, et multiplier par \\(n^2\\) propulse le tout vers \\(+\\infty\\).`
      )
    );
  }
  if(type === 'quotient'){
    const k = R(2,5);
    return QCM(
      `La suite est définie pour \\(n \\ge 1\\) par \\(u_n = \\dfrac{${k}n^{2} ${lkT(1, '')}n\\cos n}{n^{2} ${lkSg(1)}}\\). Déterminez \\(\\lim\\limits_{n\\to+\\infty} u_n\\).`,
      M(String(k)),
      [M('0'), M('+\\infty'), M(String(k + 1)), `Elle n\u2019admet pas de limite à cause des oscillations de \\(\\cos n\\)`],
      1,
      EXPL(
        `Diviser haut et bas par \\(n^2\\) : \\(u_n = \\dfrac{${k} ${lkT(1, '')}\\dfrac{\\cos n}{n}}{1 ${lkSg(1)}\\dfrac{1}{n^2}}\\).`,
        `Or \\(-\\dfrac{1}{n} \\le \\dfrac{\\cos n}{n} \\le \\dfrac{1}{n}\\), donc \\(\\dfrac{\\cos n}{n} \\to 0\\) (gendarmes) : \\(u_n \\to \\dfrac{${k} ${lkSg(0)}0}{1} = ${k}\\).`,
        `Le cosinus parasite est écrasé par la division par \\(n\\) : sa contribution disparaît, et la limite reste le rapport des coefficients dominants \\(${k}\\).`
      )
    );
  }
  if(type === 'somme'){
    return QCM(
      `La suite est définie pour \\(n \\ge 1\\) par \\(u_n = n ${lkT(1, '')}\\sin n\\). Déterminez \\(\\lim\\limits_{n\\to+\\infty} u_n\\) <em>(justifier par un encadrement)</em>.`,
      M('+\\infty'),
      [M('0'), M('1'), `Elle n\u2019admet pas de limite à cause des oscillations de \\(\\sin n\\)`, M('-\\infty')],
      1,
      EXPL(
        `Pour tout \\(n\\) : \\(-1 \\le \\sin n \\le 1\\), donc \\(n - 1 \\le n ${lkT(1, '')}\\sin n \\le n ${lkSg(1)}\\).`,
        `Les deux bornes \\(n - 1\\) et \\(n ${lkSg(1)}\\) tendent vers \\(+\\infty\\) : par comparaison, \\(u_n \\to +\\infty\\) — le sinus ne fait que griffer un \\(n\\) qui défile.`,
        `Une suite « \\(n\\) plus un truc borné » file toujours vers \\(+\\infty\\) : l\u2019oscillation du sinus est inoffensive car elle reste confinée à \\([-1\\,;\\,1]\\).`
      )
    );
  }
  const k = R(2,5);
  return QCM(
    `La suite est définie pour \\(n \\ge 1\\) par \\(u_n = \\dfrac{2n ${lkT(1, '')}\\cos n}{${k}n^{2} ${lkT(1, '')}\\sin n}\\). Déterminez \\(\\lim\\limits_{n\\to+\\infty} u_n\\).`,
    M('0'),
    [M(frac(2, k)), M('+\\infty'), M('1'), `Elle n\u2019admet pas de limite à cause des oscillations`],
    1,
    EXPL(
      `Diviser haut et bas par \\(n^2\\) : \\(u_n = \\dfrac{\\dfrac{2}{n} ${lkT(1, '')}\\dfrac{\\cos n}{n^2}}{${k} ${lkT(1, '')}\\dfrac{\\sin n}{n^2}}\\).`,
      `Tout ce qui est en \\(\\dfrac{\\cos n}{n^2}\\) ou \\(\\dfrac{\\sin n}{n^2}\\) est coincé entre \\(-\\dfrac{1}{n^2}\\) et \\(\\dfrac{1}{n^2}\\), donc tend vers 0 : \\(u_n \\to \\dfrac{0}{${k}} = 0\\).`,
      `Le degré du dénominateur (2) dépasse celui du numérateur (1) : la limite est 0 — ne pas répondre \\(${frac(2, k)}\\), valable seulement pour des degrés égaux.`
    )
  );
};

GEN.trouSuitesFI = function(){
  return TROU(
    `Formes indéterminées : complète l'arsenal des techniques.`,
    `Quatre situations bloquent le calcul direct : \\(\\infty - \\infty\\), \\(0 \\times \\infty\\), \\(\\dfrac{\\infty}{\\infty}\\) et \\(\\dfrac{0}{0}\\) — ce sont les formes {{0}}.<br>
     Technique 1 — factoriser par le terme {{1}} : \\(3n^2 ${lkT(1, '')}n ${lkSg(-5)} = n^2\\left(3 ${lkT(1, '')}\\dfrac{1}{n} ${lkSg(-5)}\\dfrac{1}{n^2}\\right)\\), et tout ce qui est en \\(\\dfrac{1}{n}\\) ou \\(\\dfrac{1}{n^2}\\) tend vers 0.<br>
     Technique 2 — la quantité {{2}} : multiplier \\(\\sqrt{n^2 ${lkT(3, '')}n} - n\\) haut et bas par \\(\\sqrt{n^2 ${lkT(3, '')}n} ${lkSg(1)}n\\) fait apparaître \\(a^2 - b^2\\) et lève la forme \\(\\infty - \\infty\\).<br>
     Technique 3 — quotient de polynômes : comparer les {{3}} du numérateur et du dénominateur ; même degré ⟹ limite égale au rapport des coefficients dominants, degré plus petit ⟹ limite nulle.<br>
     Technique 4 — sinus et cosinus sont {{4}} entre \\(-1\\) et \\(1\\) : encadrer la suite puis conclure, par exemple \\(\\dfrac{\\sin n}{n}\\) coincée entre \\(-\\dfrac{1}{n}\\) et \\(\\dfrac{1}{n}\\).<br>
     Technique 5 — forme \\(\\dfrac{0}{0}\\) : factoriser numérateur et dénominateur par le même petit terme, puis {{5}} la fraction AVANT de faire tendre \\(n\\).<br>
     Une forme indéterminée n\u2019est pas un verdict : c\u2019est un signal — {{6}} l\u2019expression pour la faire parler.`,
    ['indéterminée','dominant','conjuguée','degrés','bornés','simplifier','transformer'],
    ['remarquable','facteur','carrée','exposants','libres','développer','garantir','hippogriffe','ornithorynque'],
    `Le réflexe professionnel : identifier la forme d\u2019abord (∞−∞ ? ∞/∞ ? 0/0 ?), choisir la technique ensuite (conjuguée pour les racines, factorisation pour les puissances, encadrement pour sinus et cosinus), et vérifier la limite sur quelques valeurs de n.`
  );
};

/* ============================================================
   NOTION 3 — GENDARMES, COMPARAISON & CONVERGENCE MONOTONE
   ============================================================ */
GEN.suGendarmes = function(){
  const type = pick(['sin','cosrac','alt','somme2']);
  if(type === 'sin'){
    return QCM(
      `La suite est définie pour \\(n \\ge 1\\) par \\(u_n = \\dfrac{\\sin n}{n}\\). Déterminez \\(\\lim\\limits_{n\\to+\\infty} u_n\\) <em>(théorème des gendarmes)</em>.`,
      M('0'),
      [M('1'), M('+\\infty'), `Elle n\u2019admet pas de limite car \\(\\sin n\\) oscille`, M(frac(1, 2))],
      1,
      EXPL(
        `Pour tout \\(n\\) : \\(-1 \\le \\sin n \\le 1\\). En divisant par \\(n \\gt 0\\) : \\(-\\dfrac{1}{n} \\le \\dfrac{\\sin n}{n} \\le \\dfrac{1}{n}\\).`,
        `Les deux gendarmes \\(-\\dfrac{1}{n}\\) et \\(\\dfrac{1}{n}\\) tendent vers la même limite 0 : le théorème des gendarmes donne \\(u_n \\to 0\\).`,
        `« Sinus oscille donc pas de limite » : FAUX — l\u2019oscillation est écrasée par \\(n\\). Le théorème des gendarmes est fait exactement pour ces cas.`
      )
    );
  }
  if(type === 'cosrac'){
    return QCM(
      `La suite est définie pour \\(n \\ge 1\\) par \\(u_n = \\dfrac{\\cos n}{\\sqrt{n}}\\). Déterminez \\(\\lim\\limits_{n\\to+\\infty} u_n\\).`,
      M('0'),
      [M('1'), M('+\\infty'), `Elle n\u2019admet pas de limite car \\(\\cos n\\) oscille`, M(frac(1, 2))],
      1,
      EXPL(
        `Encadrement : \\(-1 \\le \\cos n \\le 1\\), donc \\(-\\dfrac{1}{\\sqrt{n}} \\le \\dfrac{\\cos n}{\\sqrt{n}} \\le \\dfrac{1}{\\sqrt{n}}\\).`,
        `Les deux encadrements tendent vers 0 (référence : \\(\\dfrac{1}{n^k} \\to 0\\), et la racine n\u2019y change rien) : par gendarmes, \\(u_n \\to 0\\).`,
        `Peu importe que \\(\\cos n\\) ne converge pas : coincé entre deux suites qui tendent vers 0, \\(u_n\\) est FORCÉ de converger vers 0.`
      )
    );
  }
  if(type === 'alt'){
    return QCM(
      `La suite est définie pour \\(n \\ge 1\\) par \\(u_n = (-1)^{n}\\times\\dfrac{n}{n^{2} ${lkSg(1)}}\\). Déterminez \\(\\lim\\limits_{n\\to+\\infty} u_n\\).`,
      M('0'),
      [M('+\\infty'), M('-\\infty'), `Elle n\u2019admet pas de limite (alternée)`, M('1')],
      1,
      EXPL(
        `L\u2019alternance \\((-1)^n\\) prend les valeurs \\(-1\\) et \\(1\\) : \\(\\left|u_n\\right| \\le \\dfrac{n}{n^2 ${lkSg(1)}} = \\dfrac{1}{n ${lkSg(1)}\\dfrac{1}{n}}\\).`,
        `Donc \\(-\\dfrac{1}{n} \\le u_n \\le \\dfrac{1}{n}\\) : les deux bornes tendent vers 0, et par gendarmes \\(u_n \\to 0\\).`,
        `Alternée ne veut pas dire divergente : si le MODULE est écrasé vers 0, la suite converge — c\u2019est exactement \\((-1)^n/n\\) déguisé avec un dénominateur \\((n^2 ${lkSg(1)})\\).`
      )
    );
  }
  return QCM(
    `La suite est définie pour \\(n \\ge 1\\) par \\(u_n = \\dfrac{2 ${lkT(1, '')}\\sin n}{n}\\). Déterminez \\(\\lim\\limits_{n\\to+\\infty} u_n\\).`,
    M('0'),
    [M('2'), M('+\\infty'), `Elle n\u2019admet pas de limite car \\(\\sin n\\) oscille`, M('3')],
    1,
    EXPL(
      `Encadrement : \\(-1 \\le \\sin n \\le 1\\), donc \\(1 \\le 2 ${lkT(1, '')}\\sin n \\le 3\\). En divisant par \\(n \\gt 0\\) : \\(\\dfrac{1}{n} \\le u_n \\le \\dfrac{3}{n}\\).`,
      `Les deux gendarmes \\(\\dfrac{1}{n}\\) et \\(\\dfrac{3}{n}\\) tendent vers 0 : par le théorème des gendarmes, \\(u_n \\to 0\\).`,
      `Un encadrement valable « à partir d\u2019un certain rang » suffit : ici il vaut dès le rang 1. L\u2019essentiel est que les deux bornes aient la MÊME limite.`
    )
  );
};

GEN.suGendarmesQuot = function(){
  const type = pick(['general','simple','racine']);
  if(type === 'general'){
    const a = nz(-5,5), c = nz(-5,5), b = nz(-6,6), d = nz(-6,6);
    return QCM(
      `La suite est définie pour \\(n \\ge 1\\) par \\(u_n = \\dfrac{${lkCo(a, 'n')} ${lkT(b, '')}\\sin n}{${lkCo(c, 'n')} ${lkT(d, '')}\\cos n}\\). Déterminez \\(\\lim\\limits_{n\\to+\\infty} u_n\\).`,
      M(frac(a, c)),
      [M('0'), M('+\\infty'), M(frac(c, a)), `Elle n\u2019admet pas de limite`],
      1,
      EXPL(
        `Diviser haut et bas par \\(n\\) : \\(u_n = \\dfrac{${a} ${lkT(b, '')}\\dfrac{\\sin n}{n}}{${c} ${lkT(d, '')}\\dfrac{\\cos n}{n}}\\).`,
        `Or \\(-\\dfrac{1}{n} \\le \\dfrac{\\sin n}{n} \\le \\dfrac{1}{n}\\) et de même pour \\(\\dfrac{\\cos n}{n}\\) : ces deux parasites tendent vers 0, donc \\(u_n \\to \\dfrac{${a}}{${c}} = ${frac(a, c)}\\).`,
        `Les coefficients parasités par sinus et cosinus disparaissent : seuls comptent les coefficients dominants \\(${a}\\) et \\(${c}\\).`
      )
    );
  }
  if(type === 'simple'){
    const k = R(2,5);
    return QCM(
      `La suite est définie pour \\(n \\ge 1\\) par \\(u_n = \\dfrac{${k}n ${lkT(1, '')}\\sin n}{n}\\). Déterminez \\(\\lim\\limits_{n\\to+\\infty} u_n\\).`,
      M(String(k)),
      [M('0'), M('+\\infty'), M(String(k + 1)), `Elle n\u2019admet pas de limite`],
      1,
      EXPL(
        `Diviser par \\(n\\) : \\(u_n = ${k} ${lkT(1, '')}\\dfrac{\\sin n}{n}\\).`,
        `Coincée entre \\(-\\dfrac{1}{n}\\) et \\(\\dfrac{1}{n}\\), la quantité \\(\\dfrac{\\sin n}{n}\\) tend vers 0 : \\(u_n \\to ${k}\\).`,
        `Ne pas répondre \\(${k + 1}\\) en prenant le maximum du sinus : le sinus n\u2019atteint jamais 1 en même temps pour tous les rangs, et son effet s\u2019évanouit après division par \\(n\\).`
      )
    );
  }
  return QCM(
    `La suite est définie pour \\(n \\ge 1\\) par \\(u_n = \\dfrac{n ${lkT(1, '')}\\sin n}{\\sqrt{n^{2} ${lkSg(1)}}}\\). Déterminez \\(\\lim\\limits_{n\\to+\\infty} u_n\\).`,
    M('1'),
    [M('0'), M('+\\infty'), M(frac(1, 2)), `Elle n\u2019admet pas de limite`],
    1,
    EXPL(
      `Encadrement du numérateur : \\(n - 1 \\le n ${lkT(1, '')}\\sin n \\le n ${lkSg(1)}\\).`,
      `Le dénominateur vérifie \\(\\sqrt{n^2 ${lkSg(1)}} \\approx n\\) : les deux bornes divisées par \\(\\sqrt{n^2 ${lkSg(1)}}\\) tendent vers 1, donc par gendarmes \\(u_n \\to 1\\).`,
      `Le sinus borné ne déplace pas la limite d\u2019un quotient dont haut et bas croissent pareil : ici \\(\\sqrt{n^2 ${lkSg(1)}}\\) joue exactement le rôle de \\(n\\).`
    )
  );
};

GEN.suComparaison = function(){
  const type = pick(['carre','alt','cube','theoreme']);
  if(type === 'carre'){
    return QCM(
      `La suite est définie pour \\(n \\ge 1\\) par \\(u_n = n^{2} ${lkT(1, '')}\\cos n\\). Déterminez \\(\\lim\\limits_{n\\to+\\infty} u_n\\) <em>(par comparaison)</em>.`,
      M('+\\infty'),
      [M('0'), M(String(1)), `Elle n\u2019admet pas de limite car \\(\\cos n\\) oscille`, M('-\\infty')],
      1,
      EXPL(
        `Minorons : \\(-1 \\le \\cos n \\le 1\\) donne \\(u_n \\ge n^2 - 1\\).`,
        `Or \\(n^2 - 1 \\to +\\infty\\) : une suite minorée par une suite qui tend vers \\(+\\infty\\) tend elle-même vers \\(+\\infty\\). Donc \\(u_n \\to +\\infty\\).`,
        `L\u2019oscillation du cosinus est heureusement confinée : elle ne peut pas faire dévier un \\(n^2\\) qui déborde de toute part. Comparaison ≠ gendarmes : une seule borne suffit ici.`
      )
    );
  }
  if(type === 'alt'){
    return QCM(
      `La suite est définie pour \\(n \\ge 1\\) par \\(u_n = n - (-1)^{n}\\). Déterminez \\(\\lim\\limits_{n\\to+\\infty} u_n\\) <em>(par comparaison)</em>.`,
      M('+\\infty'),
      [M('0'), M(String(1)), `Elle n\u2019admet pas de limite (alternée)`, M('-\\infty')],
      1,
      EXPL(
        `\\((-1)^n\\) vaut \\(1\\) ou \\(-1\\) : dans les deux cas \\((-1)^n \\le 1\\), donc \\(u_n \\ge n - 1\\).`,
        `Or \\(n - 1 \\to +\\infty\\) : par comparaison (minoration), \\(u_n \\to +\\infty\\). L\u2019alternance ne fait que décaler la suite de \\(1\\) au pire.`,
        `« Alternée donc pas de limite » ne s\u2019applique qu\u2019aux alternances qui ne s\u2019écrasent pas : ici l\u2019amplitude de la perturbation est constante, devant un \\(n\\) qui file vers l\u2019infini.`
      )
    );
  }
  if(type === 'cube'){
    return QCM(
      `La suite est définie pour \\(n \\ge 1\\) par \\(u_n = n^{3} - n\\sin n\\). Déterminez \\(\\lim\\limits_{n\\to+\\infty} u_n\\) <em>(par comparaison)</em>.`,
      M('+\\infty'),
      [M('0'), M('-\\infty'), `Elle n\u2019admet pas de limite car \\(\\sin n\\) oscille`, M('1')],
      1,
      EXPL(
        `Minoration : \\(n \\sin n \\le n\\) (car \\(\\sin n \\le 1\\)), donc \\(u_n \\ge n^3 - n\\).`,
        `Or \\(n^3 - n \\to +\\infty\\) : par comparaison, \\(u_n \\to +\\infty\\). Le terme dominant \\(n^3\\) noie la perturbation \\(n\\sin n\\).`,
        `Comparer les poids : \\(n\\sin n\\) est au pire de l\u2019ordre de \\(n\\), négligeable devant \\(n^3\\). La minoration par \\(n^3 - n\\) tranche.`
      )
    );
  }
  return QCM(
    `Si \\(u_n \\ge v_n\\) à partir d\u2019un certain rang et \\(v_n \\to +\\infty\\), que peut-on conclure sur \\((u_n)\\) ?`,
    `\\((u_n) \\to +\\infty\\) : une suite minorée par une suite qui tend vers \\(+\\infty\\) tend vers \\(+\\infty\\)`,
    [`\\((u_n)\\) converge car elle est minorée`, `\\((u_n) \\to -\\infty\\)`, `On ne peut rien conclure sans connaître \\(u_0\\)`, `\\((u_n)\\) est bornée`],
    1,
    EXPL(
      `Le théorème de comparaison : si \\(u_n \\ge v_n\\) au-delà d\u2019un rang et \\(v_n \\to +\\infty\\), alors \\(u_n \\to +\\infty\\) — l\u2019infini est contagieux vers le haut.`,
      `Formellement : pour tout \\(A\\), dès que \\(v_n \\gt A\\) on a aussi \\(u_n \\gt A\\). La suite \\((v_n)\\) pousse \\((u_n)\\) au-dessus de n\u2019importe quel seuil.`,
      `Être minorée ne suffit pas à converger (exemple : \\(u_n = n\\) est minorée par 0 mais diverge) : c\u2019est la NATURE de la borne qui décide — finie ⟹ hypothèse de convergence monotone, infinie ⟹ divergence vers \\(+\\infty\\).`
    )
  );
};

GEN.suMonotone = function(){
  const type = pick(['racine','theo1','theo2','theo3']);
  if(type === 'racine'){
    return QCM(
      `La suite est définie par \\(u_1 = \\sqrt{2}\\) et \\(u_{n+1} = \\sqrt{2 ${lkT(1, '')}u_n}\\) — la racine carrée imbriquée. On admet que \\((u_n)\\) est croissante et que \\(u_n \\le 2\\) pour tout \\(n\\). Que peut-on affirmer ?`,
      `Elle converge (croissante et majorée), et sa limite \\(L\\) vérifie \\(L = \\sqrt{2 ${lkT(1, '')}L}\\), donc \\(L = 2\\)`,
      [`Elle diverge vers \\(+\\infty\\) : on empile des racines sans fin`, `Elle converge car elle est décroissante et minorée`, `On ne peut rien affirmer sans formule explicite`, `Elle est constante`],
      2,
      EXPL(
        `Théorème de la convergence monotone : toute suite croissante et MAJORÉE converge. Ici \\((u_n)\\) est croissante et majorée par 2.`,
        `Sa limite \\(L\\) vérifie la relation de récurrence passée à la limite : \\(L = \\sqrt{2 ${lkT(1, '')}L}\\), soit \\(L^2 = 2 ${lkT(1, '')}L\\) : \\(L^2 - L - 2 = 0\\), racines \\(-1\\) et \\(2\\). La suite étant positive, \\(L = 2\\) : la racine imbriquée infinie vaut 2.`,
        `Une suite peut converger SANS formule explicite : la monotonie + la majoration suffisent, et l\u2019équation du point fixe donne la valeur. Le nombre \\(-1\\) est écarté car \\(u_n \\ge 0\\).`
      )
    );
  }
  if(type === 'theo1'){
    return QCM(
      `Que dit le théorème de la convergence monotone pour une suite croissante et majorée ?`,
      `Elle converge : croissante et majorée ⟹ il existe un réel \\(\\ell\\) tel que \\(u_n \\to \\ell\\)`,
      [`Elle tend vers \\(+\\infty\\)`, `Elle oscille entre deux valeurs`, `Elle converge exactement vers sa borne`, `Elle converge si et seulement si elle est bornée`],
      1,
      EXPL(
        `Croissante et majorée : les termes montent sans jamais dépasser la barrière — ils s\u2019accumulent contre un plafond.`,
        `Le théorème garantit l\u2019EXISTENCE d\u2019une limite finie \\(\\ell\\), avec \\(\\ell \\le M\\) (la borne). Sa valeur exacte demande un calcul supplémentaire (point fixe, conjuguée…).`,
        `La limite n\u2019est PAS forcément la borne : \\(u_n = 2 - \\dfrac{1}{n}\\) est croissante, majorée par 100, et converge vers 2. Majorée suffit — peu importe par quel nombre.`
      )
    );
  }
  if(type === 'theo2'){
    return QCM(
      `Que peut-on affirmer d\u2019une suite décroissante et minorée ?`,
      `Elle converge (théorème de la convergence monotone, version symétrique)`,
      [`Elle tend vers \\(-\\infty\\)`, `Elle oscille`, `Elle diverge car elle baisse sans cesse`, `Rien sans connaître son premier terme`],
      1,
      EXPL(
        `Version symétrique du théorème : décroissante et minorée ⟹ convergence. Les termes descendent contre un plancher.`,
        `La limite vérifie \\(\\ell \\ge m\\) où \\(m\\) est le minorant : la suite s\u2019arrête contre le plancher sans le traverser.`,
        `« Décroissante donc divergente » est le piège : baisser n\u2019est pas diverger, si la chute est amortie par un plancher, la suite converge.`
      )
    );
  }
  return QCM(
    `Que peut-on affirmer d\u2019une suite croissante NON majorée ?`,
    `Elle tend vers \\(+\\infty\\)`,
    [`Elle converge`, `Elle oscille entre deux valeurs`, `Elle peut converger ou diverger selon le cas`],
    1,
    EXPL(
      `Croissante et non majorée : pour tout réel \\(A\\), un terme dépasse \\(A\\), et la croissance fait que TOUS les suivants le dépassent aussi.`,
      `C\u2019est le théorème de la limite monotone : croissante non majorée ⟹ \\(u_n \\to +\\infty\\) ; de façon symétrique, décroissante non minorée ⟹ \\(u_n \\to -\\infty\\).`,
      `L\u2019absence de plafond est une information forte : une suite croissante n\u2019a que deux destins — plafonnée (converge) ou sans plafond (file vers \\(+\\infty\\)). Jamais d\u2019oscillation.`
    )
  );
};

GEN.trouGendarmes = function(){
  return TROU(
    `Gendarmes, comparaison et monotonie : complète les théorèmes.`,
    `Encadrement (théorème des {{0}}) : si \\(v_n \\le u_n \\le w_n\\) à partir d\u2019un certain rang et si \\(v_n\\) et \\(w_n\\) tendent toutes deux vers le même réel \\(\\ell\\), alors \\(u_n\\) converge vers \\(\\ell\\).<br>
     Exemple : \\(-\\dfrac{1}{n} \\le \\dfrac{\\sin n}{n} \\le \\dfrac{1}{n}\\) et \\(\\dfrac{1}{n}\\) tend vers {{1}} : donc \\(\\dfrac{\\sin n}{n}\\) converge vers 0.<br>
     Comparaison : si \\(u_n \\ge v_n\\) au-delà d\u2019un rang et \\(v_n \\to +\\infty\\), alors \\(u_n \\to +\\infty\\) — une suite {{2}} par une suite qui tend vers \\(+\\infty\\) file vers \\(+\\infty\\) elle aussi.<br>
     Convergence monotone : toute suite croissante et {{3}} converge ; toute suite décroissante et minorée {{4}} ; toute suite croissante non majorée tend vers \\(+\\infty\\).<br>
     Le qualificatif {{5}} désigne une suite toujours croissante ou toujours décroissante : c\u2019est lui qui donne accès au théorème précédent.<br>
     Contre-exemple utile : \\((-1)^n\\) oscille entre deux valeurs — elle n\u2019est pas monotone et ne converge pas ; et la limite d\u2019une suite convergente reste {{6}}, même vue sur deux sous-suites.`,
    ['gendarmes','zéro','minorée','majorée','converge','monotone','unique'],
    ['sommet','un','bornée','diverge','croissante','constante','double','raison','hippogriffe','ornithorynque'],
    `Gendarmes = encadrement par DEUX suites de même limite ; comparaison = une seule borne qui fuit vers l\u2019infini ; monotonie = existence d\u2019une limite dès qu\u2019il y a un plafond ou un plancher. Trois théorèmes, une même idée : emprisonner la suite pour connaître son destin.`
  );
};

/* ============================================================
   NOTION 4 — ARITHMÉTICO-GÉOMÉTRIQUES : POINT FIXE & LIMITE
   ============================================================ */
GEN.suPointFixe = function(){
  const type = pick(['solve','fixes','attractif','repulsif']);
  if(type === 'solve'){
    const cfg = pick([
      { a: frac(1, 2), b: 3, c: 6 },
      { a: frac(1, 2), b: 4, c: 8 },
      { a: frac(1, 3), b: 4, c: 6 },
      { a: frac(2, 3), b: 2, c: 6 },
      { a: frac(3, 4), b: 2, c: 8 },
      { a: '0{,}9', b: 2, c: 20 },
      { a: '0{,}8', b: 3, c: 15 }
    ]);
    return QCM(
      `Une suite vérifie \\(u_{n+1} = ${cfg.a}\\,u_n ${lkSg(cfg.b)}\\). Son point d\u2019équilibre (point fixe) est le réel \\(c\\) tel que \\(c = ${cfg.a}\\,c ${lkSg(cfg.b)}\\). Calculer \\(c\\).`,
      M(String(cfg.c)),
      [M(String(cfg.b)), M(String(cfg.c + 1)), M(String(cfg.c - 1)), M(String(Math.round(cfg.c / 2)))],
      1,
      EXPL(
        `Le point fixe est la valeur qui se reproduit elle-même : si \\(u_n = c\\), alors \\(u_{n+1} = c\\) aussi — la suite devient constante.`,
        `\\(c = ${cfg.a}\\,c ${lkSg(cfg.b)} \\Rightarrow c - ${cfg.a}c = ${cfg.b} \\Rightarrow c\\left(1 - ${cfg.a}\\right) = ${cfg.b} \\Rightarrow c = ${cfg.c}\\).`,
        `Le point fixe est la clé de TOUTE la suite arithmético-géométrique : c\u2019est vers lui qu\u2019elle converge (si \\(|a| \\lt 1\\)), et c\u2019est autour de lui qu\u2019on construit la suite auxiliaire.`
      )
    );
  }
  if(type === 'fixes'){
    return QCM(
      `On considère \\(f(x) = x^{2}\\) et la suite \\(u_{n+1} = f(u_n) = u_n^{2}\\). Quels sont les points fixes de \\(f\\) ?`,
      `\\(0\\) et \\(1\\)`,
      [`\\(0\\) seulement`, `\\(1\\) seulement`, `\\(0\\) et \\(-1\\)`, `Il n\u2019y en a pas`],
      1,
      EXPL(
        `Un point fixe de \\(f\\) est un réel \\(x\\) tel que \\(f(x) = x\\) : partir de là, la suite reste immobile.`,
        `\\(x^2 = x \\Leftrightarrow x^2 - x = 0 \\Leftrightarrow x(x - 1) = 0\\) : deux points fixes, \\(0\\) et \\(1\\). Si \\(u_0 = 0\\) ou \\(u_0 = 1\\), la suite est constante.`,
        `Un point fixe n\u2019est pas forcément attractif : \\(0\\) et \\(1\\) sont fixes pour \\(x^2\\), mais un départ entre les deux file vers \\(0\\) et un départ au-delà de 1 s\u2019enfuit — chaque point fixe a son bassin d\u2019attraction.`
      )
    );
  }
  if(type === 'attractif'){
    return QCM(
      `Suite définie par \\(u_0 = 0{,}5\\) et \\(u_{n+1} = u_n^{2}\\). Quel est le comportement de la suite ?`,
      `Elle converge vers \\(0\\), le point fixe attractif`,
      [`Elle converge vers \\(1\\)`, `Elle converge vers \\(0{,}5\\)`, `Elle diverge vers \\(+\\infty\\)`, `Elle oscille`],
      1,
      EXPL(
        `Sur \\([-1\\,;\\,1]\\), élever au carré rapetisse : \\(|u_{n+1}| = |u_n|^2 \\lt |u_n|\\) dès que \\(|u_n| \\lt 1\\).`,
        `\\(0{,}5 \\to 0{,}25 \\to 0{,}0625 \\to \\dots \\to 0\\) : la suite décroît vers \\(0\\), point fixe attractif — tout départ dans \\(-1\\,;\\,1\\) aboutit à 0.`,
        `Le point fixe \\(1\\) est un piège ici : \\(1\\) est répulsif (un départ légèrement plus petit s\u2019en éloigne), alors que \\(0\\) attire tout le bassin \\((-1\\,;\\,1)\\).`
      )
    );
  }
  return QCM(
    `Suite définie par \\(u_0 = 2\\) et \\(u_{n+1} = u_n^{2}\\). Quel est le comportement de la suite ?`,
    `Elle diverge vers \\(+\\infty\\), en s\u2019éloignant du point fixe répulsif \\(1\\)`,
    [`Elle converge vers \\(1\\)`, `Elle converge vers \\(2\\)`, `Elle oscille entre \\(0\\) et \\(1\\)`, `Elle converge vers \\(0\\)`],
    1,
    EXPL(
      `Un départ au-delà de \\(1\\) s\u2019amplifie à chaque carré : \\(2 \\to 4 \\to 16 \\to 256 \\to \\dots\\)`,
      `La suite file vers \\(+\\infty\\) : le point fixe \\(1\\) est répulsif — la suite s\u2019en écarte de plus en plus vite. Le destin dépend du premier terme : \\(u_0 \\in (-1\\,;\\,1)\\) ⟶ 0, \\(u_0 \\gt 1\\) ⟶ \\(+\\infty\\), \\(u_0 = 0\\) ou \\(1\\) ⟶ constante.`,
      `« Point fixe » ne veut pas dire « convergence » : pour \\(x^2\\), seul \\(0\\) attire ; \\(1\\) repousse. Sur la toile d\u2019araignée, l\u2019escalier s\u2019éloigne de \\(1\\) dès qu\u2019on le dépasse.`
    )
  );
};

GEN.suAuxiliaire = function(){
  const cfg = pick([
    { a: frac(1, 2), b: 3, c: 6, u0: 1 },
    { a: frac(1, 2), b: 3, c: 6, u0: 2 },
    { a: '0{,}9', b: 60, c: 600, u0: 1500 },
    { a: frac(1, 3), b: 4, c: 6, u0: 3 },
    { a: frac(2, 3), b: 2, c: 6, u0: 0 },
    { a: '0{,}75', b: 9, c: 36, u0: 4 }
  ]);
  const type = pick(['nature','v0','formule']);
  const v0 = cfg.u0 - cfg.c;
  if(type === 'nature'){
    return QCM(
      `Une suite vérifie \\(u_0 = ${cfg.u0}\\) et \\(u_{n+1} = ${cfg.a}\\,u_n ${lkSg(cfg.b)}\\) ; le point fixe est \\(c = ${cfg.c}\\). On pose \\(v_n = u_n - ${cfg.c}\\). Quelle est la nature de \\((v_n)\\) ?`,
      `Géométrique de raison \\(${cfg.a}\\)`,
      [`Arithmétique de raison \\(${cfg.b}\\)`, `Géométrique de raison \\(${cfg.c}\\)`, `Ni arithmétique ni géométrique`, `Constante égale à \\(${cfg.c}\\)`],
      2,
      EXPL(
        `La suite auxiliaire recentre tout autour du point fixe : \\(v_n = u_n - c\\) mesure l\u2019écart au point d\u2019équilibre.`,
        `\\(v_{n+1} = u_{n+1} - ${cfg.c} = ${cfg.a}u_n ${lkSg(cfg.b)} - ${cfg.c} = ${cfg.a}\\left(v_n ${lkSg(cfg.c)}\\right) ${lkSg(cfg.b)} - ${cfg.c} = ${cfg.a}\\,v_n ${lkT(cfg.a * cfg.c, '')} ${lkSg(cfg.b)} - ${cfg.c}\\). Or \\(${cfg.a}\\times${cfg.c} ${lkSg(cfg.b)} = ${cfg.c}\\) (définition du point fixe) : il reste \\(v_{n+1} = ${cfg.a}\\,v_n\\). Suite géométrique de raison \\(${cfg.a}\\).`,
        `Le point fixe fait disparaître le terme constant : c\u2019est TOUT l\u2019intérêt de la suite auxiliaire. Ne pas oublier de vérifier que \\(ac ${lkSg(cfg.b)} = c\\) avant de conclure.`
      )
    );
  }
  if(type === 'v0'){
    return QCM(
      `Une suite vérifie \\(u_0 = ${cfg.u0}\\) et \\(u_{n+1} = ${cfg.a}\\,u_n ${lkSg(cfg.b)}\\) ; le point fixe est \\(c = ${cfg.c}\\). On pose \\(v_n = u_n - ${cfg.c}\\). Que vaut \\(v_0\\) ?`,
      M(String(v0)),
      [M(String(cfg.u0 + cfg.c)), M(String(cfg.c - cfg.u0)), M(String(cfg.u0)), M(String(cfg.c))],
      1,
      EXPL(
        `La suite auxiliaire démarre avec le même décalage que la suite d\u2019origine : \\(v_0 = u_0 - c\\).`,
        `\\(v_0 = ${cfg.u0} - ${cfg.c} = ${v0}\\). Le signe indique de quel côté du point fixe la suite démarre.`,
        `Erreur classique : calculer \\(c - u_0\\) ou \\(u_0 ${lkSg(cfg.c)}\\). C\u2019est bien \\(u_0 - c\\), dans cet ordre, qui mesure l\u2019écart au point d\u2019équilibre.`
      )
    );
  }
  const sgn = v0 < 0 ? '-' : '+';
  const av = Math.abs(v0);
  return QCM(
    `Une suite vérifie \\(u_0 = ${cfg.u0}\\) et \\(u_{n+1} = ${cfg.a}\\,u_n ${lkSg(cfg.b)}\\) ; le point fixe est \\(c = ${cfg.c}\\) et \\(v_n = u_n - ${cfg.c}\\) est géométrique de raison \\(${cfg.a}\\). Quelle est la forme explicite de \\(u_n\\) ?`,
    `\\(u_n = ${cfg.c} ${sgn} ${av}\\times\\left(${cfg.a}\\right)^{n}\\)`,
    [`\\(u_n = ${cfg.c} ${lkT(v0, '')}\\times ${cfg.a}\\,n\\)`, `\\(u_n = ${cfg.c} ${sgn} ${av}\\times\\left(${lkCo(1, '')}n\\right)\\)`, `\\(u_n = ${cfg.a}\\,n ${lkSg(cfg.c)}\\)`, `\\(u_n = ${cfg.c}\\)`],
      2,
      EXPL(
        `Suite géométrique : \\(v_n = v_0\\times a^n = ${v0}\\times\\left(${cfg.a}\\right)^{n}\\). Puis revenir à \\(u\\) : \\(u_n = v_n ${lkSg(cfg.c)}\\).`,
        `\\(u_n = ${cfg.c} ${sgn} ${av}\\times\\left(${cfg.a}\\right)^{n}\\) : la constante ${cfg.c} plus un correctif géométrique qui s\u2019éteint (car \\(|a| \\lt 1\\)).`,
        `L\u2019exposant porte sur \\(a\\), pas sur \\(n\\) : \\(a^n\\) et non \\(a\\,n\\). La forme \\(u_n = c + v_0\\,a^n\\) est la signature de toute suite arithmético-géométrique.`
      )
    );
};

GEN.suArithGeoLimite = function(){
  const type = pick(['potion','cafe','general','div']);
  if(type === 'potion'){
    return QCM(
      `Une potion vérifie \\(u_{n+1} = 0{,}5\\,u_n ${lkSg(3)}\\) avec \\(u_0 = 1\\) (l\u2019effet diminue de moitié chaque heure, puis on ajoute 3 gouttes). Vers quelle valeur se stabilise \\((u_n)\\) ?`,
      M('6'),
      [M('3'), M('0'), M('4'), `Elle ne se stabilise pas`],
      1,
      EXPL(
        `Suite arithmético-géométrique \\(u_{n+1} = a\\,u_n ${lkSg(3)}\\) avec \\(|a| = 0{,}5 \\lt 1\\) : elle converge vers le point fixe.`,
        `Point fixe : \\(c = 0{,}5c ${lkSg(3)}\\), donc \\(0{,}5c = 3\\) et \\(c = 6\\). En effet \\(u_n = 6 - 5\\times\\left(0{,}5\\right)^{n} \\to 6\\) : la potion se stabilise à 6 gouttes.`,
        `Ne pas répondre 3 (ce qu\u2019on ajoute) ni 1 (le départ) : l\u2019équilibre est la seule valeur qui se reproduit, \\(c = \\dfrac{b}{1 - a}\\).`
      )
    );
  }
  if(type === 'cafe'){
    return QCM(
      `Un café à \\(90\\) °C refroidit dans une pièce à \\(20\\) °C : \\(T_0 = 90\\) et \\(T_{n+1} = 20 ${lkSg(1)}0{,}9\\left(T_n - 20\\right)\\). Vers quelle température le café tend-il ?`,
      M('20'),
      [M('0'), M('90'), M('22'), `Il refroidit sans jamais se stabiliser`],
      1,
      EXPL(
        `Réécrivons : \\(T_{n+1} = 0{,}9\\,T_n ${lkSg(2)}\\) — suite arithmético-géométrique de point fixe \\(c = 20\\) (la température de la pièce).`,
        `\\(v_n = T_n - 20 = 70\\times\\left(0{,}9\\right)^{n} \\to 0\\) car \\(|0{,}9| \\lt 1\\) : donc \\(T_n \\to 20\\) °C. L\u2019écart à la pièce décroît de 10 % par minute et s\u2019éteint.`,
        `Le café N\u2019ATTEINT jamais exactement 20 °C à un rang fini, mais il s\u2019en approche autant qu\u2019on veut : la limite est 20, valeur d\u2019équilibre, pas un palier atteint.`
      )
    );
  }
  if(type === 'general'){
    return QCM(
      `Une suite arithmético-géométrique vérifie \\(u_{n+1} = a\\,u_n + b\\) avec \\(|a| \\lt 1\\) et \\(c = a\\,c + b\\) son point fixe. On a \\(u_n = c ${lkT(1, '')}\\left(u_0 - c\\right)a^{n}\\). Vers quoi tend \\((u_n)\\) ?`,
      `Vers \\(c\\) : le facteur \\(a^n \\to 0\\) emporte le correctif`,
      [`Vers \\(0\\)`, `Vers \\(u_0\\)`, `Vers \\(b\\)`, `Elle n\u2019admet pas de limite`],
      1,
      EXPL(
        `Tout se joue dans \\(a^n\\) : si \\(|a| \\lt 1\\), alors \\(a^n \\to 0\\) — le correctif s\u2019éteint.`,
        `\\(u_n = c ${lkT(1, '')}\\left(u_0 - c\\right)a^n \\to c ${lkSg(1)} 0 = c\\) : la suite converge vers son point fixe, quel que soit le départ.`,
        `Si \\(|a| \\gt 1\\), au contraire, \\(a^n\\) explose et la suite s\u2019éloigne du point fixe : c\u2019est le MODULE de la raison qui décide du destin, pas le premier terme.`
      )
    );
  }
  return QCM(
    `Une suite arithmético-géométrique vérifie \\(u_{n+1} = 1{,}5\\,u_n ${lkSg(2)}\\) et \\(u_0 = 0\\) ; son point fixe est \\(c = -4\\) et \\(u_n = -4 ${lkSg(1)}4\\times\\left(1{,}5\\right)^{n}\\). Que se passe-t-il ?`,
      `La suite n\u2019a pas de limite finie : \\(|1{,}5| \\gt 1\\), le correctif \\(1{,}5^n\\) explose vers \\(+\\infty\\)`,
      [`Elle converge vers \\(-4\\)`, `Elle converge vers \\(0\\)`, `Elle converge vers \\(2\\)`, `Elle oscille autour de \\(-4\\)`],
      2,
      EXPL(
        `Même structure \\(u_n = c ${lkT(1, '')}\\left(u_0 - c\\right)a^n\\), mais ici \\(|a| = 1{,}5 \\gt 1\\) : le facteur géométrique dérape.`,
        `\\(4\\times\\left(1{,}5\\right)^{n} \\to +\\infty\\), donc \\(u_n \\to +\\infty\\) : la suite s\u2019éloigne sans cesse du point fixe \\(-4\\), qu\u2019elle ne rejoindra jamais.`,
        `Un point fixe n\u2019attire que si \\(|a| \\lt 1\\) : ici \\(1{,}5\\) repousse, le départ \\(u_0 = 0\\) est hors du bassin d\u2019attraction. La méthode reste identique, seul le verdict change.`
      )
    );
};

GEN.suArithGeoProbleme = function(){
  const type = pick(['foret','zenon','fibonacci','medicament']);
  if(type === 'foret'){
    const cfg = pick([
      { p: 10, B: 60, A: 1500, L: 600 },
      { p: 8, B: 40, A: 1200, L: 500 },
      { p: 5, B: 25, A: 900, L: 500 },
      { p: 15, B: 45, A: 1000, L: 300 },
      { p: 12, B: 66, A: 1450, L: 550 },
      { p: 6, B: 30, A: 1100, L: 500 }
    ]);
    return QCM(
      `Une forêt de montagne couvrait \\(${cfg.A}\\) hectares au 1er janvier 2020. Chaque année, \\(${cfg.p}\\) % de la surface boisée disparaît, puis on replante \\(${cfg.B}\\) hectares. La surface \\(u_n\\) de l\u2019année \\(2020 ${lkT(1, '')}n\\) vérifie \\(u_{n+1} = ${fr(1 - cfg.p / 100)}\\,u_n ${lkSg(cfg.B)}\\). Vers quelle surface la forêt se stabilise-t-elle ?`,
      M(String(cfg.L) + ' ha'),
      [M(String(cfg.B) + ' ha'), M(String(cfg.L - cfg.B) + ' ha'), M(String(cfg.L + cfg.B) + ' ha'), `Elle disparaît totalement`],
      2,
      EXPL(
        `Suite arithmético-géométrique de raison \\(q = 1 - \\dfrac{${cfg.p}}{100} = ${fr(1 - cfg.p / 100)}\\) (compris entre 0 et 1) : la forêt converge vers son point fixe.`,
        `Point d\u2019équilibre : \\(L = qL ${lkSg(cfg.B)} \\Rightarrow L\\left(1 - q\\right) = ${cfg.B} \\Rightarrow L = \\dfrac{${cfg.B}}{\\dfrac{${cfg.p}}{100}} = ${cfg.L}\\) hectares. La surface se stabilise à \\(${cfg.L}\\) ha.`,
        `Le point fixe n\u2019est NI la surface replantée (${cfg.B} ha) NI un dixième de la forêt : c\u2019est l\u2019équilibre entre ce qui disparaît (${cfg.p} % de la surface) et ce qu\u2019on replante (${cfg.B} ha).`
      )
    );
  }
  if(type === 'zenon'){
    return QCM(
      `Zénon raconte : Achille court dix fois plus vite que la tortue, qui a 100 m d\u2019avance. À chaque étape du raisonnement, l\u2019écart \\(d_{n+1} = \\dfrac{d_n}{10}\\) avec \\(d_0 = 100\\). Que vaut \\(\\lim\\limits_{n\\to+\\infty} d_n\\), et où est l\u2019erreur de Zénon ?`,
      `\\(d_n \\to 0\\) : la somme \\(100 ${lkSg(1)}10 ${lkSg(1)}1 ${lkSg(1)}\\dots\\) converge (vers \\(${frac(1000, 9)}\\) m), donc Achille rattrape la tortue en un temps fini`,
      [`\\(d_n \\to 10\\) : Achille s\u2019arrête à 10 m de la tortue`, `\\(d_n\\) n\u2019admet pas de limite`, `\\(d_n \\to +\\infty\\)`, `La somme des distances parcourues est infinie`],
      2,
      EXPL(
        `\\((d_n)\\) est géométrique de raison \\(\\dfrac{1}{10}\\) : \\(d_n = 100\\times\\left(\\dfrac{1}{10}\\right)^{n} \\to 0\\) — l\u2019écart s\u2019éteint.`,
        `La somme des étapes est une série géométrique : \\(100 ${lkSg(1)}10 ${lkSg(1)}1 ${lkSg(1)}\\dots = \\dfrac{100}{1 - \\dfrac{1}{10}} = ${frac(1000, 9)} \\approx 111\\) m — une distance FINIE, donc un temps fini : Achille rattrape la tortue.`,
        `L\u2019erreur de Zénon : croire qu\u2019une infinité d\u2019étapes implique un temps ou une distance infinie. Une infinité de termes de plus en plus petits peut donner un total fini — c\u2019est toute l\u2019idée de la convergence.`
      )
    );
  }
  if(type === 'fibonacci'){
    return QCM(
      `La suite de Fibonacci \\(1\\,;\\,1\\,;\\,2\\,;\\,3\\,;\\,5\\,;\\,8\\,;\\,13\\,;\\,21\\,;\\,\\dots\\) cachée dans les spirales du tournesol. Les quotients de termes consécutifs \\(r_n = \\dfrac{F_{n+1}}{F_n}\\) valent \\(2\\), \\(${frac(3, 2)}\\), \\(${frac(5, 3)}\\), \\(${frac(8, 5)}\\)… Vers quel nombre tendent-ils ?`,
      `Le nombre d\u2019or \\(\\varphi = \\dfrac{1 ${lkSg(1)}\\sqrt{5}}{2} \\approx 1{,}618\\), qui vérifie \\(\\varphi = 1 ${lkSg(1)}\\dfrac{1}{\\varphi}\\)`,
      [`\\(2\\)`, `\\(\\sqrt{2} \\approx 1{,}414\\)`, `\\(1{,}5\\)`, `Ils n\u2019ont pas de limite`],
      2,
      EXPL(
        `Si \\(r_n \\to \\varphi\\), alors \\(\\varphi\\) doit être compatible avec la relation \\(F_{n+2} = F_{n+1} ${lkT(1, '')}F_n\\) : en divisant par \\(F_{n+1}\\), \\(r_{n+1} = 1 ${lkSg(1)}\\dfrac{1}{r_n}\\).`,
        `Passée à la limite : \\(\\varphi = 1 ${lkSg(1)}\\dfrac{1}{\\varphi}\\), soit \\(\\varphi^2 - \\varphi - 1 = 0\\), dont la racine positive est \\(\\varphi = \\dfrac{1 ${lkSg(1)}\\sqrt{5}}{2} \\approx 1{,}618\\) : les quotients oscillent autour du nombre d\u2019or en s\u2019en rapprochant.`,
        `Ne pas confondre : ce ne sont pas les TERMES de Fibonacci qui convergent (ils explosent), mais leurs QUOTIENTS successifs. Le nombre d\u2019or est le point fixe de la transformation \\(x \\mapsto 1 ${lkSg(1)}\\dfrac{1}{x}\\).`
      )
    );
  }
  const cfg = pick([
    { elim: 50, a: '0{,}5', b: 5, c: 10 },
    { elim: 20, a: '0{,}8', b: 4, c: 20 },
    { elim: 75, a: '0{,}25', b: 6, c: 8 }
  ]);
  return QCM(
    `Chaque jour, l\u2019organisme élimine \\(${cfg.elim}\\) % du médicament présent, puis on absorbe \\(${cfg.b}\\) mg. La quantité \\(u_n\\) vérifie \\(u_{n+1} = ${cfg.a}\\,u_n ${lkSg(cfg.b)}\\). Vers quelle quantité la concentration se stabilise-t-elle ?`,
    M(String(cfg.c) + ' mg'),
    [M(String(cfg.b) + ' mg'), M(String(cfg.c - cfg.b) + ' mg'), M(String(cfg.c + cfg.b) + ' mg'), `Elle s\u2019élimine totalement`],
    2,
    EXPL(
      `Suite arithmético-géométrique : éliminer \\(${cfg.elim}\\) % revient à multiplier par \\(1 - \\dfrac{${cfg.elim}}{100} = ${cfg.a}\\), puis on ajoute \\(b = ${cfg.b}\\) mg.`,
      `Point d\u2019équilibre : \\(c = ${cfg.a}c ${lkSg(cfg.b)} \\Rightarrow c\\left(1 - ${cfg.a}\\right) = ${cfg.b} \\Rightarrow c = ${cfg.c}\\) mg. La concentration oscille vers ${cfg.c} mg et s\u2019y stabilise.`,
      `L\u2019équilibre n\u2019est pas « ce qu\u2019on absorbe » (${cfg.b} mg) : c\u2019est la quantité pour laquelle l\u2019élimination (${cfg.elim} % de c) compense exactement l\u2019apport quotidien.`
    )
  );
};

GEN.suSommeGeo = function(){
  const type = pick(['formule','tresor','calcul','limite']);
  if(type === 'formule'){
    return QCM(
      `Pour une suite géométrique de raison \\(q \\neq 1\\), que vaut la somme \\(S_n = u_0 ${lkT(1, '')}u_1 ${lkT(1, '')}\\dots ${lkT(1, '')}u_n\\) des \\(n ${lkSg(1)}\\) premiers termes ?`,
      `\\(S_n = u_0\\times\\dfrac{1 - q^{n+1}}{1 - q}\\)`,
      [`\\(S_n = u_0\\times\\dfrac{1 - q^{n}}{1 - q}\\)`, `\\(S_n = u_0\\times q^{n+1}\\)`, `\\(S_n = \\dfrac{u_0 ${lkSg(1)}u_n}{2}\\times n\\)`, `\\(S_n = u_0\\times\\dfrac{1 ${lkSg(1)}q^{n+1}}{1 - q}\\)`],
      1,
      EXPL(
        `Formule de la somme géométrique : \\(S_n = u_0\\left(1 ${lkT(1, '')}q ${lkT(1, '')}\\dots ${lkT(1, '')}q^{n}\\right) = u_0\\times\\dfrac{1 - q^{n+1}}{1 - q}\\).`,
        `L\u2019exposant est \\(n ${lkSg(1)}1\\) car la somme compte \\(n ${lkSg(1)}1\\) termes, de \\(u_0\\) à \\(u_n\\) : les puissances vont de 0 à n.`,
        `Vérifier sur un exemple : \\(1 ${lkSg(1)}2 ${lkSg(1)}4 = 1\\times\\dfrac{1 - 2^3}{1 - 2} = 7\\) ✓. L\u2019erreur d\u2019exposant (n au lieu de n+1) fausse tout calcul de seuil.`
      )
    );
  }
  if(type === 'tresor'){
    return QCM(
      `Un pirate reçoit 1 pièce d\u2019or le premier jour, puis chaque jour la moitié de la veille : \\(u_0 = 1\\), \\(q = ${frac(1, 2)}\\). Le trésor cumulé \\(S_n = 1 ${lkSg(1)}\\dfrac{1}{2} ${lkSg(1)}\\dfrac{1}{4} ${lkSg(1)}\\dots ${lkSg(1)}\\dfrac{1}{2^n}\\) ne dépassera jamais…`,
      M('2'),
      [M(frac(3, 2)), M('+\\infty'), M('1'), M(String(3))],
      1,
      EXPL(
        `Somme géométrique : \\(S_n = 1\\times\\dfrac{1 - \\left(${frac(1, 2)}\\right)^{n+1}}{1 - ${frac(1, 2)}} = 2\\left(1 - \\left(${frac(1, 2)}\\right)^{n+1}\\right)\\).`,
        `Comme \\($\\left(${frac(1, 2)}\\right)^{n+1} \\to 0\\) : \\(S_n \\to 2\\). Le cumul croît vers 2 pièces mais ne les atteint jamais à un rang fini — le trésor est plafonné.`,
        `Une infinité de paiements positifs peut donner un total FINI : c\u2019est le principe de la somme géométrique pour \\(0 \\lt q \\lt 1\\), \\(S = \\dfrac{u_0}{1 - q}\\).`
      )
    );
  }
  if(type === 'calcul'){
    const cfg = pick([
      { u0: 8, q: frac(1, 2), S2: 14, texS: '8 ${lkSg(1)}4 ${lkSg(1)}2' },
      { u0: 16, q: frac(1, 2), S2: 28, texS: '16 ${lkSg(1)}8 ${lkSg(1)}4' },
      { u0: 9, q: frac(2, 3), S2: 19, texS: '9 ${lkSg(1)}6 ${lkSg(1)}4' },
      { u0: 27, q: frac(2, 3), S2: 57, texS: '27 ${lkSg(1)}18 ${lkSg(1)}12' }
    ]);
    return QCM(
      `Une suite géométrique a pour premier terme \\(u_0 = ${cfg.u0}\\) et pour raison \\(q = ${cfg.q}\\). Que vaut \\(S_2 = u_0 ${lkSg(1)}u_1 ${lkSg(1)}u_2\\) ?`,
      M(String(cfg.S2)),
      [M(String(cfg.u0 * 3)), M(String(cfg.u0)), M(String(cfg.S2 + cfg.u0)), M(String(cfg.S2 - 2))],
      1,
      EXPL(
        `Trois termes : \\(u_1 = u_0\\times q\\) et \\(u_2 = u_0\\times q^2\\), ou directement la formule \\(S_2 = u_0\\times\\dfrac{1 - q^3}{1 - q}\\).`,
        `\\(S_2 = ${cfg.u0} ${lkSg(1)} ${cfg.u0}\\times${cfg.q} ${lkSg(1)} ${cfg.u0}\\times\\left(${cfg.q}\\right)^2 = ${cfg.texS} = ${cfg.S2}\\).`,
        `Compter les termes : \\(S_2\\) va de \\(u_0\\) à \\(u_2\\), soit \\(3\\) termes — l\u2019exposant dans la formule est bien \\(2 ${lkSg(1)}1 = 3\\).`
      )
    );
  }
  const cfg = pick([
    { u0: 1, q: frac(1, 2), S: 2 },
    { u0: 8, q: frac(1, 2), S: 16 },
    { u0: 9, q: frac(2, 3), S: 27 },
    { u0: 7, q: frac(3, 4), S: 28 },
    { u0: 5, q: frac(4, 5), S: 25 }
  ]);
  return QCM(
    `La somme \\(S_n = u_0\\times\\dfrac{1 - q^{n+1}}{1 - q}\\) d\u2019une suite géométrique de raison \\(q = ${cfg.q}\\) et de premier terme \\(u_0 = ${cfg.u0}\\). Que vaut \\(\\lim\\limits_{n\\to+\\infty} S_n\\) ?`,
      M(String(cfg.S)),
      [M('+\\infty'), M(String(cfg.u0)), M(String(cfg.S + 1)), M('0')],
      1,
      EXPL(
        `Comme \\(0 \\lt q \\lt 1\\), la puissance \\(q^{n+1} \\to 0\\) : dans la formule, seul le 1 du numérateur survit.`,
        `\\(S_n \\to u_0\\times\\dfrac{1 - 0}{1 - q} = \\dfrac{${cfg.u0}}{1 - ${cfg.q}} = ${cfg.S}\\). La limite d\u2019une somme géométrique (0 < q < 1) est \\(\\dfrac{u_0}{1 - q}\\).`,
        `La somme CROÎT (chaque terme est positif) mais reste MAJORÉE par \\(${cfg.S}\\) : croissance et majoration, la convergence monotone en action — pour \\(q \\gt 1\\), au contraire, \\(S_n \\to +\\infty\\).`
      )
    );
};

/* ============================================================
   FICHES DE COURS
   ============================================================ */
FICHES['suites-limites'] = { titre: '🟣 Limites de suites : définitions, références & FI', html: `
  <p><b>Convergence (définition ε–N) :</b> \\((u_n)\\) converge vers \\(\\ell\\) si pour tout \\(\\varepsilon \\gt 0\\) il existe un rang \\(N\\) tel que \\(\\left|u_n - \\ell\\right| \\lt \\varepsilon\\) dès que \\(n \\ge N\\). Le nombre \\(\\varepsilon\\) est la marge d\u2019erreur imposée, \\(N\\) le rang de confiance (on prend le plafond \\(\\left\\lceil \\cdot \\right\\rceil\\), plus petit entier supérieur ou égal). Graphiquement : une bande de largeur \\(2\\varepsilon\\) autour de \\(\\ell\\) finit par contenir tous les termes. La limite est <b>unique</b>.</p>
  ${tableHTML(['Référence','Limite quand \\(n \\to +\\infty\\)','Commentaire'],[
    ['\\(n^k\\)','\\(+\\infty\\)','les polynômes explosent'],
    ['\\(\\sqrt{n}\\), \\(n^{k}\\)','\\(+\\infty\\)','la racine aussi, mais moins vite'],
    ['\\(\\dfrac{1}{n^k}\\)','\\(0\\)','pour tout \\(k \\ge 1\\)'],
    ['\\(q^n\\), \\(0 \\lt q \\lt 1\\)','\\(0\\)','la vague s\u2019apaise'],
    ['\\(q^n\\), \\(q = 1\\)','\\(1\\)','suite constante'],
    ['\\(q^n\\), \\(q \\gt 1\\)','\\(+\\infty\\)','le tsunami'],
    ['\\(q^n\\), \\(q \\le -1\\)','pas de limite','divergence oscillante'],
    ['\\((-1)^n\\)','pas de limite','valeurs d\u2019adhérence \\(-1\\) et \\(1\\)']
  ])}
  <p><b>Opérations :</b> somme, produit et quotient des limites — sauf formes indéterminées \\(\\infty - \\infty\\), \\(0 \\times \\infty\\), \\(\\dfrac{\\infty}{\\infty}\\), \\(\\dfrac{0}{0}\\). Les lever : <b>factoriser par le terme dominant</b> ; <b>quantité conjuguée</b> \\((a - b)\\times\\dfrac{a + b}{a + b} = a^2 - b^2\\) pour les racines ; <b>comparer les degrés</b> d\u2019un quotient (même degré ⟹ rapport des coefficients dominants, degré plus petit ⟹ 0) ; <b>sinus et cosinus bornés</b> entre \\(-1\\) et \\(1\\) ⟹ encadrer.</p>
  <p><b>Oscillations :</b> \\((-1)^n\\) et \\((-1)^n + \\dfrac{1}{n}\\) n\u2019ont pas de limite (deux valeurs d\u2019adhérence), mais \\((-1)^n\\times\\dfrac{1}{n}\\) converge vers 0 : ce qui décide, c\u2019est le module de la raison \\((|q| \\lt 1\\) ⟹ convergence, même alternée) et l\u2019écrasement des amplitudes.</p>` };

FICHES['suites-convergence'] = { titre: '🟣 Gendarmes, comparaison & convergence monotone', html: `
  <p><b>Théorème des gendarmes :</b> si \\(v_n \\le u_n \\le w_n\\) à partir d\u2019un certain rang et si \\(v_n\\) et \\(w_n\\) tendent vers la même limite \\(\\ell\\), alors \\(u_n \\to \\ell\\). Exemple type : \\(-\\dfrac{1}{n} \\le \\dfrac{\\sin n}{n} \\le \\dfrac{1}{n}\\) donc \\(\\dfrac{\\sin n}{n} \\to 0\\).</p>
  <p><b>Comparaison :</b> si \\(u_n \\ge v_n\\) au-delà d\u2019un rang et \\(v_n \\to + \\infty\\), alors \\(u_n \\to + \\infty\\) (minoration contagieuse). De même \\(u_n \\le v_n\\) et \\(v_n \\to -\\infty\\) ⟹ \\(u_n \\to -\\infty\\). Et si \\(\\left|u_n - \\ell\\right| \\le v_n\\) avec \\(v_n \\to 0\\), alors \\(u_n \\to \\ell\\).</p>
  ${tableHTML(['Hypothèses','Conclusion','Exemple'],[
    ['croissante et majorée','converge (limite \\(\\le\\) à la borne)','racine imbriquée \\(u_{n+1} = \\sqrt{2 + u_n} \\to 2\\)'],
    ['décroissante et minorée','converge','\\(2 + \\dfrac{1}{n} \\to 2\\)'],
    ['croissante non majorée','\\(\\to + \\infty\\)','\\(u_n = n^2\\)'],
    ['décroissante non minorée','\\(\\to -\\infty\\)','\\(u_n = -n\\)'],
    ['monotone et bornée','converge','le théorème de la limite monotone']
  ])}
  <p><b>Application (racine carrée imbriquée) :</b> \\(u_1 = \\sqrt{2}\\), \\(u_{n+1} = \\sqrt{2 + u_n}\\) : croissante et majorée par 2, donc convergente ; sa limite vérifie \\(L = \\sqrt{2 + L}\\), soit \\(L^2 - L - 2 = 0\\) : \\(L = 2\\). Une suite peut converger sans formule explicite — monotonie et encadrement suffisent, puis le point fixe donne la valeur.</p>` };

FICHES['suites-arithmetico'] = { titre: '🟣 Arithmético-géométriques : point fixe & limite', html: `
  <p><b>Définition :</b> \\(u_{n+1} = a\\,u_n + b\\) avec \\(a \\neq 1\\) et \\(b \\neq 0\\) — un pied arithmétique, un pied géométrique. Méthode en trois temps :</p>
  <ol>
    <li><b>Point fixe :</b> résoudre \\(c = a\\,c + b\\), soit \\(c = \\dfrac{b}{1 - a}\\) — la valeur d\u2019équilibre (la potion qui se stabilise, la forêt qui se replante).</li>
    <li><b>Suite auxiliaire :</b> poser \\(v_n = u_n - c\\) ; alors \\(v_{n+1} = a\\,v_n\\) : suite géométrique de raison \\(a\\) et de premier terme \\(v_0 = u_0 - c\\). Le point fixe a fait disparaître la constante.</li>
    <li><b>Forme explicite et limite :</b> \\(u_n = c + \\left(u_0 - c\\right)a^n\\) ; si \\(\\left|a\\right| \\lt 1\\), alors \\(a^n \\to 0\\) et \\(u_n \\to c\\) ; si \\(\\left|a\\right| \\gt 1\\), la suite s\u2019éloigne du point fixe.</li>
  </ol>
  <p><b>Toile d\u2019araignée :</b> pour \\(u_{n+1} = f(u_n)\\), tracer la courbe de \\(f\\) et la droite \\(y = x\\) ; partir de \\(u_0\\) et rebondir de l\u2019une à l\u2019autre. Un point fixe peut être <b>attractif</b> (l\u2019escalier s\u2019enroule vers lui, ex. 0 pour \\(x^2\\)) ou <b>répulsif</b> (on s\u2019en écarte, ex. 1 pour \\(x^2\\) au-delà de 1) : le premier terme décide du destin.</p>
  <p><b>Somme géométrique :</b> \\(S_n = u_0 + u_1 + \\dots + u_n = u_0\\times\\dfrac{1 - q^{n+1}}{1 - q}\\) ; si \\(0 \\lt q \\lt 1\\), \\(S_n \\to \\dfrac{u_0}{1 - q}\\) sans jamais dépasser ce plafond. Problèmes types : forêt replantée \\(L = \\dfrac{B}{1 - q}\\), café qui refroidit \\(T_n \\to 20\\) °C, paradoxe de Zénon (distances en \\(\\dfrac{1}{10}\\) : somme finie \\(\\approx\\) 111 m), quotients de Fibonacci \\(\\to\\) nombre d\u2019or \\(\\varphi = \\dfrac{1 + \\sqrt{5}}{2}\\).</p>` };

/* ============================================================
   GEN_INFO DES 20 GÉNÉRATEURS
   ============================================================ */
(function(){
  const LI = 'suites-limites', CO = 'suites-convergence', AR = 'suites-arithmetico';
  const defs = [
    ['suLimRef',           'Limites de référence : n^k, 1/n^k, q^n',      [LI]],
    ['suLimOps',           'Opérations sur les limites',                  [LI]],
    ['suConvergence',      'Convergence, divergence, oscillation',       [LI]],
    ['suEpsilon',          'Définition ε–N : choisir le rang N',          [LI]],
    ['trouLimitesRef',     'Raisonnement : définition & références',    [LI]],
    ['suFISomme',          'FI ∞−∞ : factoriser le terme dominant',      [LI]],
    ['suFIQuotient',       'FI ∞/∞ et 0/0 : comparer les degrés',       [LI]],
    ['suFIConjuguee',      'Quantité conjuguée : lever une FI racine',   [LI]],
    ['suFITrigo',          'Limites avec sinus ou cosinus',              [LI]],
    ['trouSuitesFI',       'Raisonnement : lever une indétermination',  [LI]],
    ['suGendarmes',        'Théorème des gendarmes (encadrement)',       [CO]],
    ['suGendarmesQuot',    'Gendarmes : quotients avec sin ou cos',      [CO]],
    ['suComparaison',      'Minorations et divergences vers +∞',         [CO]],
    ['suMonotone',         'Convergence monotone (majorée/minorée)',     [CO]],
    ['trouGendarmes',      'Raisonnement : gendarmes & monotonie',     [CO]],
    ['suPointFixe',        'Point fixe : c = ac + b',                    [AR]],
    ['suAuxiliaire',       'Suite auxiliaire v_n = u_n − c',             [AR]],
    ['suArithGeoLimite',   'Limite d\u2019une arithmético-géométrique',  [AR]],
    ['suArithGeoProbleme', 'Forêt, Zénon, Fibonacci, médicament',        [AR]],
    ['suSommeGeo',         'Somme géométrique et sa limite',             [AR]]
  ];
  const rappels = {
    suLimRef: "1/n^k → 0 ; q^n → 0 si |q| < 1, → +∞ si q > 1, sans limite si q ≤ −1.",
    suLimOps: "Somme, produit, quotient des limites — sauf les quatre formes indéterminées.",
    suConvergence: "Deux valeurs d'adhérence ⟹ pas de limite ; |q| < 1 fait converger même les suites alternées.",
    suEpsilon: "ε = précision imposée ; N = rang de confiance = plafond ⌈1/ε⌉ pour u_n = L + 1/n.",
    trouLimitesRef: "Chaîne : converge, zéro, plafond, unique, diverge, adhérence, bande.",
    suFISomme: "∞−∞ : développer ou factoriser — le terme de plus haut degré restant décide.",
    suFIQuotient: "∞/∞ : factoriser par la plus grande puissance ; degré plus petit ⟹ 0, égal ⟹ coefficients.",
    suFIConjuguee: "Multiplier par (√A + √B)/(√A + √B) fait apparaître a² − b² et lève ∞−∞.",
    suFITrigo: "−1 ≤ sin n ≤ 1 : encadrer avant de conclure, ou diviser par le terme dominant.",
    trouSuitesFI: "Chaîne : indéterminée, dominant, conjuguée, degrés, bornés, simplifier, transformer.",
    suGendarmes: "v_n ≤ u_n ≤ w_n et mêmes limites ⟹ u_n converge : sin n/n → 0.",
    suGendarmesQuot: "Diviser par n : les parasites (sin n)/n disparaissent, restent les coefficients dominants.",
    suComparaison: "Minorée par une suite qui tend vers +∞ ⟹ +∞ : n² + cos n → +∞.",
    suMonotone: "Croissante majorée ⟹ converge ; croissante non majorée ⟹ +∞ ; le point fixe donne la valeur.",
    trouGendarmes: "Chaîne : gendarmes, zéro, minorée, majorée, converge, monotone, unique.",
    suPointFixe: "c = ac + b ⟺ c(1 − a) = b : la valeur qui se reproduit elle-même.",
    suAuxiliaire: "v_n = u_n − c est géométrique de raison a : u_n = c + (u₀ − c)aⁿ.",
    suArithGeoLimite: "|a| < 1 ⟹ u_n → c ; |a| > 1 ⟹ le correctif aⁿ explose.",
    suArithGeoProbleme: "Point fixe = équilibre : forêt L = B/(1−q), café → 20 °C, Zénon : somme finie.",
    suSommeGeo: "S_n = u₀(1 − q^(n+1))/(1 − q) → u₀/(1 − q) si 0 < q < 1 : plafond jamais dépassé."
  };
  defs.forEach(function(d){ GEN_INFO[d[0]] = { label: d[1], fiches: d[2], rappel: rappels[d[0]] }; });
})();

/* ============================================================
   4 NOTIONS EN SOMMET DE TOUR (→ 172 étages)
   ============================================================ */
NOTIONS.push(
  { id: 'su-limites', name: 'Limites de suites : définitions & références',
    g: ['suLimRef','suLimOps','suConvergence','suEpsilon','trouLimitesRef'], family: 'violet', prob: 0.5 },
  { id: 'su-fi', name: 'Formes indéterminées : les lever',
    g: ['suFISomme','suFIQuotient','suFIConjuguee','suFITrigo','trouSuitesFI'], family: 'violet', prob: 0.5 },
  { id: 'su-comparaison', name: 'Gendarmes, comparaison & convergence monotone',
    g: ['suGendarmes','suGendarmesQuot','suComparaison','suMonotone','trouGendarmes'], family: 'violet', prob: 0.5 },
  { id: 'su-arithmetico', name: 'Suites arithmético-géométriques : point fixe & limite',
    g: ['suPointFixe','suAuxiliaire','suArithGeoLimite','suArithGeoProbleme','suSommeGeo'], family: 'violet', prob: 0.5 }
);

/* Formes 3D des nouveaux étages (constantes de 14-formes-3d.js). */
document.addEventListener('DOMContentLoaded', function(){
  FLOOR_SHAPES['su-limites']     = 'funnel';
  FLOOR_SHAPES['su-fi']          = 'root';
  FLOOR_SHAPES['su-comparaison'] = 'hourglass';
  FLOOR_SHAPES['su-arithmetico'] = 'spiral';
});
