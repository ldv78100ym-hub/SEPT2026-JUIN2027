/* ============================================================
   11j. SUITES NUMÉRIQUES : définitions, termes & rangs,
        reconnaissance et modélisation arithmétique/géométrique
        et sens de variation — intégration des documents
        « Modes de définition d'une suite numérique » (liste,
        graphique, explicite, récurrence), « Généralités sur les
        suites numériques » ((u_n) vs u_n, rang/indice, variation),
        « Suites arithmétiques/géométriques : cours & méthodes »,
        les simulateurs V2, les cahiers d'exercices (économies de
        Paul, contre-exemples, dépréciation, dette, altitude,
        entraînement, photocopieuse, cubes) et les exercices
        dynamiques (bactéries, CM et pourcentages, intérêts
        composés, pliage, échiquier, rebonds, rumeur, salaire).
   ------------------------------------------------------------
   Déjà présents dans la tour (non dupliqués ici) : calculs de
   termes et de raison arithmétique/géométrique (suiteArith,
   suiteArith2, suiteGeo, suiteGeo2, t-suitearith, t-suitegeo),
   lectures graphiques de suites (t-suitegraph), sommes de termes
   (somme-suite), évolutions successives et taux global
   (t-evolutions, evol-cm, evol-global), suites du primaire
   (p-suite), isolation d'un terme (lit-suites-stats).
   Sont intégrés ici, au format QCM / raisonnements à clés de la
   tour : modes de définition (liste, explicite, récurrence y
   compris d'ordre 2), distinction (u_n)/u_n, rang et indice,
   reconnaissance par différence/quotient constants et
   contre-exemples (n², n³, kⁿ, (-1)ⁿ), sens de variation selon
   le signe de r ou la position de q (q < 0 : signes alternés),
   coefficients multiplicateurs 1 ± t/100, problèmes concrets
   (économies, dette, altitude, seuil de panne, cubes, intérêts
   composés, pliage, échiquier, rebonds, rumeur, voiture) et
   étude du signe de u_{n+1} − u_n (affine, quadratique,
   rationnelle, racine).
   → 4 notions en sommet de tour (168 étages), 20 générateurs,
     fiches « Définitions, rangs & récurrence », « Arithmétique
     ou géométrique : reconnaître & modéliser » et « Sens de
     variation d'une suite ».
   ============================================================ */

/* ---------- Helpers (préfixe su2-, aucune collision) ---------- */
/* Coefficient de variable : 1 → '', −1 → '-', 2 → '2'. */
function su2Co(a, v){
  if(a === 0) return '';
  return (a === 1 ? '' : (a === -1 ? '-' : String(a))) + v;
}
/* Constante signée pour coller à une expression LaTeX : 3 → '+3', −3 → '-3'. */
function su2Sg(n){ return n >= 0 ? '+' + n : String(n); }
/* Terme signé : 1 → '+n', −1 → '-n', 0 → '', sinon '+3n' / '-3n'. */
function su2T(c, v){
  if(c === 0) return '';
  if(c === 1) return '+' + v;
  if(c === -1) return '-' + v;
  return su2Sg(c) + v;
}

/* ============================================================
   NOTION 1 — DÉFINITIONS, TERMES & RANGS
   ============================================================ */
GEN.suListe = function(){
  if(pick([true,false])){
    return QCM(
      `Dans l\u2019écriture \\((u_n)\\), que désigne \\(u_n\\) sans parenthèses ?`,
      `Un nombre réel : le terme de la suite dont l\u2019indice est \\(n\\)`,
      [`La suite entière, liste de tous les termes`, `Le premier terme de la suite`, `Le rang du terme`, `La raison de la suite`],
      1,
      EXPL(
        `\\((u_n)\\) avec parenthèses désigne la SUITE : la liste ordonnée de tous les termes. \\(u_n\\) sans parenthèses désigne un seul terme : un nombre réel, celui dont l\u2019indice est \\(n\\).`,
        `L\u2019indice \\(n\\) est l\u2019étiquette du terme : \\(u_2\\) vaut un nombre précis, alors que \\((u_n)\\) désigne tout l\u2019objet « suite ».`,
        `Confondre la suite et l\u2019un de ses termes est l\u2019erreur de notation la plus fréquente : les parenthèses changent complètement l\u2019objet désigné. Attention aussi à la graphie : \\(u_n\\) n\u2019est ni \\(u\\times n\\) ni \\(u^n\\).`
      )
    );
  }
  const start = pick([0,1]);
  const terms = [];
  let v = R(-5,8);
  for(let i = 0; i < 6; i++){ terms.push(v); v += R(1,4) * pick([1,1,-1]); }
  const k = start + R(0,5);
  const val = terms[k - start];
  const listTex = terms.map(t => String(t)).join('\\,;\\,');
  const voisins = terms.filter((t,i) => i !== (k - start) && t !== val).slice(0,3);
  return QCM(
    `Une suite est donnée par la liste \\(u = (${listTex})\\), définie pour tout \\(n \\ge ${start}\\). Que vaut \\(u_{${k}}\\) ?`,
    M(String(val)),
    voisins.map(t => M(String(t))).concat([M(String(val + 1)), M(String(val - 1))]),
    1,
    EXPL(
      `Une liste exhaustive définit la suite valeur par valeur : chaque valeur porte un indice, à commencer par \\(n=${start}\\) ici.`,
      `Le terme d\u2019indice \\(n=${k}\\) occupe la position ${k - start + 1} de la liste : \\(u_{${k}}=${val}\\).`,
      `Le premier indice n\u2019est pas toujours 0 : ici la liste commence à \\(n=${start}\\) et \\(u_{${start}}=${terms[0]}\\) — repérer l\u2019indice de départ avant de lire.`
    )
  );
};

GEN.suExplicite = function(){
  const type = pick(['affine','carree','racine','expo']);
  let idx = R(2,6);
  let expr = '', val = 0, wrongs = [], meth = '', piege = '';
  if(type === 'affine'){
    const a = nz(-6,6), b = nz(-9,9);
    const n = idx;
    expr = su2Co(a,'n') + su2Sg(b);
    val = a*n + b;
    wrongs = [M(String(a*n)), M(String(a*(n+1) + b)), M(String(val + 1)), M(String(val - 2)), M(String(a*n*n + b))];
    meth = `En remplaçant \\(n\\) par ${n} : \\(u_{${n}} = ${a}\\times ${n} ${su2Sg(b)} = ${val}\\).`;
    piege = `Remplacer \\(n\\) par sa valeur PARTOUT, et pas seulement dans le premier terme : l\u2019erreur classique est d\u2019oublier la constante.`;
  } else if(type === 'carree'){
    const a = pick([1,2]), b = nz(-5,5), c = nz(-5,5);
    const n = idx;
    expr = (a === 1 ? '' : String(a)) + 'n^2' + su2T(b, 'n') + su2Sg(c);
    val = a*n*n + b*n + c;
    wrongs = [M(String(a*n*n + c)), M(String(val + b)), M(String(val + 1)), M(String(val - 1)), M(String(a*n + b*n + c))];
    meth = `\\(u_{${n}} = ${a}\\times ${n}^2 ${b === 1 ? '+' : (b === -1 ? '-' : su2Sg(b))}\\times ${n} ${su2Sg(c)} = ${a*n*n} ${su2Sg(b*n)} ${su2Sg(c)} = ${val}\\).`;
    piege = `Le carré porte sur \\(n\\), pas sur le coefficient : \\(${a}\\times ${n}^2 = ${a*n*n}\\), et les priorités opératoires font le reste.`;
  } else if(type === 'racine'){
    const s = pick([9,16,25]);
    const nn = R(2, s - 2);
    idx = nn;
    const b = s - nn;
    expr = '\\sqrt{n' + su2Sg(b) + '}';
    val = Math.sqrt(s);
    wrongs = [M(String(val + 1)), M(String(val - 1)), M(String(s)), M(String(nn + b + 1)), M(String(nn))];
    meth = `\\(u_{${nn}} = \\sqrt{${nn} ${su2Sg(b)}} = \\sqrt{${s}} = ${val}\\).`;
    piege = `La racine porte sur TOUT le radicande : calculer \\(${nn} ${su2Sg(b)}\\) d\u2019abord, la racine en dernier.`;
  } else {
    const a = R(2,5), b = pick([2,3]);
    const nn = R(2,4);
    idx = nn;
    expr = `${a}\\times ${b}^n`;
    val = a * Math.pow(b, nn);
    wrongs = [M(String(a*b*nn)), M(String(a*Math.pow(b, nn - 1))), M(String(val + 1)), M(String(a*nn*b)), M(String(Math.pow(a*b, nn)))];
    meth = `\\(u_{${nn}} = ${a}\\times ${b}^{${nn}} = ${a}\\times ${Math.pow(b,nn)} = ${val}\\).`;
    piege = `L\u2019exposant porte sur la base \\(${b}\\) uniquement : \\(u_n\\) n\u2019est PAS \\(${a}\\times ${b}\\times n\\).`;
  }
  return QCM(
    `La suite est définie pour tout \\(n \\ge 0\\) par \\(u_n = ${expr}\\). Calculez \\(u_{${idx}}\\).`,
    M(String(val)),
    wrongs,
    1,
    EXPL(
      `Une formule explicite donne \\(u_n\\) directement en fonction de \\(n\\) : on calcule N\u2019IMPORTE quel terme sans connaître les précédents.`,
      meth,
      piege
    )
  );
};

GEN.suRecurrence = function(){
  const type = pick(['affine','carre','racine','fibo']);
  if(type === 'affine'){
    const a = R(2,4), b = nz(-5,5), u0 = R(1,5);
    const u1 = a*u0 + b, u2 = a*u1 + b;
    return QCM(
      `Une suite est définie par \\(u_0 = ${u0}\\) et \\(u_{n+1} = ${a}\\,u_n ${su2Sg(b)}\\). Calculez \\(u_2\\).`,
      M(String(u2)),
      [M(String(u1)), M(String(a*u0*u0 + b)), M(String(u2 + a)), M(String(u2 - 1)), M(String(2*a + b))],
      1,
      EXPL(
        `Une relation de récurrence calcule chaque terme à partir du précédent : impossible d\u2019obtenir \\(u_2\\) sans avoir calculé \\(u_1\\) d\u2019abord. Le premier terme est indispensable.`,
        `\\(u_1 = ${a}\\times ${u0} ${su2Sg(b)} = ${u1}\\), puis \\(u_2 = ${a}\\times ${u1} ${su2Sg(b)} = ${u2}\\).`,
        `Le piège classique : remplacer \\(n\\) par 2 dans la formule au lieu d\u2019appliquer la récurrence deux fois de suite, de proche en proche.`
      )
    );
  }
  if(type === 'carre'){
    const u0 = pick([0,1]), c = nz(-3,3);
    const u1 = u0*u0 + c, u2 = u1*u1 + c;
    return QCM(
      `Une suite est définie par \\(u_0 = ${u0}\\) et \\(u_{n+1} = u_n^2 ${su2Sg(c)}\\). Calculez \\(u_2\\).`,
      M(String(u2)),
      [M(String(u1)), M(String(u1 + c)), M(String(u2 + 1)), M(String(c*c)), M(String(u0*u0 + 2*c))],
      1,
      EXPL(
        `Ici la récurrence n\u2019est pas linéaire : chaque terme est le carré du précédent, décalé d\u2019une constante.`,
        `\\(u_1 = ${u0}^2 ${su2Sg(c)} = ${u1}\\), puis \\(u_2 = (${u1})^2 ${su2Sg(c)} = ${u2}\\).`,
        `Mettre des parenthèses autour de \\(u_1\\) avant d\u2019élever au carré : si \\(u_1\\) est négatif, son carré reste positif.`
      )
    );
  }
  if(type === 'racine'){
    let u0, a, s, b;
    do { u0 = pick([2,3,6]); a = R(1,3); s = pick([3,4,5,6]); b = s*s - a*u0; } while(b < 0 || b > 9);
    return QCM(
      `Une suite est définie par \\(u_0 = ${u0}\\) et \\(u_{n+1} = \\sqrt{${a}\\,u_n + ${b}}\\). Calculez \\(u_1\\).`,
      M(String(s)),
      [M(String(u0 + 1)), M(String(s*s)), M(String(s + 1)), M(String(s - 1)), M(String(a*u0))],
      1,
      EXPL(
        `La récurrence peut méliger racine carrée et coefficient : on calcule le radicande d\u2019abord, la racine ensuite.`,
        `\\(u_1 = \\sqrt{${a}\\times ${u0} + ${b}} = \\sqrt{${a*u0 + b}} = ${s}\\).`,
        `Ne pas oublier le coefficient \\(${a}\\) devant \\(u_n\\) : le radicande est \\(${a}\\,u_n ${su2Sg(b)}\\), pas \\(u_n ${su2Sg(b)}\\).`
      )
    );
  }
  const u0 = R(1,4), u1 = R(1,4), u2 = u0 + u1, u3 = u1 + u2;
  return QCM(
    `Une suite est définie par \\(u_0 = ${u0}\\), \\(u_1 = ${u1}\\) et \\(u_{n+2} = u_{n+1} + u_n\\). Calculez \\(u_3\\).`,
    M(String(u3)),
    [M(String(u2)), M(String(u0 + 2*u1)), M(String(u3 + 1)), M(String(u3 - 1)), M(String(u0*u1))],
    1,
    EXPL(
      `Une récurrence d\u2019ordre 2 relie chaque terme aux DEUX précédents : il faut deux termes initiaux pour démarrer (comme la suite de Fibonacci).`,
      `\\(u_2 = u_1 + u_0 = ${u1} + ${u0} = ${u2}\\), puis \\(u_3 = u_2 + u_1 = ${u2} + ${u1} = ${u3}\\).`,
      `Respecter l\u2019ordre des indices : \\(u_{n+2}\\) utilise \\(u_{n+1}\\) ET \\(u_n\\) — ne pas inverser ni n\u2019en sauter un.`
    )
  );
};

GEN.suRang = function(){
  const n0 = R(0,3), n = n0 + R(4,12);
  const rang = n - n0 + 1;
  if(pick([true,false])){
    return QCM(
      `Une suite est définie pour tout \\(n \\ge ${n0}\\) : son premier terme est \\(u_{${n0}}\\). Quel est le RANG (la position dans la liste) du terme \\(u_{${n}}\\) ?`,
      M(String(rang)),
      [M(String(n)), M(String(rang + 1)), M(String(rang - 1)), M(String(n - n0))],
      1,
      EXPL(
        `L\u2019indice est le numéro mathématique écrit en petit ; le rang est la position physique dans la liste (1er, 2e, …). Pour un départ en \\(n_0\\) : rang \\(= n - n_0 + 1\\).`,
        `Ici \\(n_0 = ${n0}\\) et \\(n = ${n}\\) : rang \\(= ${n} - ${n0} + 1 = ${rang}\\). Le terme \\(u_{${n}}\\) est le ${rang}e de la liste.`,
        `Si la suite ne commence pas à 0, indice et rang diffèrent : \\(u_{${n0}}\\) est déjà le 1er terme — le rang compte, l\u2019indice étiquette.`
      )
    );
  }
  return QCM(
    `Une suite commence au terme \\(u_{${n0}}\\). Quel indice \\(n\\) possède le terme de rang ${rang} ?`,
    M(String(n)),
    [M(String(rang)), M(String(n + 1)), M(String(n - 1)), M(String(n0 + rang))],
    1,
    EXPL(
      `Du rang à l\u2019indice, on renverse la formule : \\(n = rang + n_0 - 1\\).`,
      `\\(n = ${rang} + ${n0} - 1 = ${n}\\) : le terme de rang ${rang} est \\(u_{${n}}\\).`,
      `Le rang compte les termes à partir de 1, l\u2019indice à partir de \\(n_0\\) : on ne les additionne jamais directement.`
    )
  );
};

GEN.trouSuitesGen = function(){
  return TROU(
    `Définir une suite numérique : complète le raisonnement.`,
    `\\((u_n)\\) avec parenthèses désigne la suite entière ; \\(u_n\\) sans parenthèses désigne un seul {{0}} : un nombre réel, pas la suite.<br>
     Mode 1 — la {{1}} exhaustive : les valeurs sont données une à une, avec le premier indice (souvent 0 ou 1).<br>
     Mode 2 — la formule {{2}} : \\(u_n\\) s\u2019écrit directement en fonction de \\(n\\), sans calculer les termes précédents.<br>
     Mode 3 — la relation de {{3}} : \\(u_{n+1}\\) se calcule à partir de \\(u_n\\) ; elle exige obligatoirement le {{4}} terme, sinon la suite n\u2019est pas définie.<br>
     Ne pas confondre : l\u2019indice est le numéro écrit en bas, le {{5}} est la position dans la liste — pour un départ en \\(n_0\\), le terme d\u2019indice \\(n\\) occupe la position \\(n - n_0 + 1\\).<br>
     Sur un graphique, une suite est un nuage de points isolés : on ne les {{6}} relie jamais, car \\(n\\) est un entier.`,
    ['terme','liste','explicite','récurrence','premier','rang','jamais'],
    ['sommet','quotient','raison','dernier','somme','toujours','pente','hippogriffe','ornithorynque'],
    `La récurrence sans premier terme ne définit RIEN : \\(u_{n+1} = 2\\,u_n\\) seule ne dit pas d\u2019où l\u2019on part. Et sur un graphique, les points restent isolés : les reindre en ferait une fonction continue, plus une suite.`
  );
};

/* ============================================================
   NOTION 2 — SUITES ARITHMÉTIQUES : RECONNAÎTRE & MODÉLISER
   ============================================================ */
GEN.suArithRecon = function(){
  const start = pick([0,1]);
  if(Math.random() < 0.7){
    const u = R(1,9), r = nz(-6,6);
    const t = [u, u + r, u + 2*r, u + 3*r, u + 4*r];
    const listTex = t.map(x => String(x)).join('\\,;\\,');
    return QCM(
      `On relève les premiers termes d\u2019une suite : \\((${listTex})\\), en commençant à \\(n = ${start}\\). Quelle est la nature de cette suite ?`,
      `Arithmétique de raison \\(r = ${r}\\)`,
      [`Géométrique de raison \\(q = ${r}\\)`, `Arithmétique de raison \\(r = ${-r}\\)`, `Ni arithmétique ni géométrique`, `Arithmétique de raison \\(r = ${t[1]}\\)`],
      2,
      EXPL(
        `Pour identifier une suite, on calcule la différence \\(u_{n+1} - u_n\\) entre termes consécutifs : constante ⟹ arithmétique.`,
        `Les différences valent toutes \\(${r}\\) : on passe d\u2019un terme au suivant en AJOUTANT toujours la même quantité. Suite arithmétique de raison \\(r = ${r}\\).`,
        `Ne pas confondre ajouter (arithmétique) et multiplier (géométrique) : ici les rapports ne sont pas constants, seule la différence l\u2019est.`
      )
    );
  }
  const u = pick([2,3,4,5]), q = pick([2,3]);
  const t = [u, u*q, u*q*q, u*q*q*q];
  const listTex = t.map(x => String(x)).join('\\,;\\,');
  return QCM(
    `On relève les premiers termes d\u2019une suite : \\((${listTex})\\), en commençant à \\(n = ${start}\\). Quelle est la nature de cette suite ?`,
    `Géométrique de raison \\(q = ${q}\\)`,
    [`Arithmétique de raison \\(r = ${u*q - u}\\)`, `Arithmétique de raison \\(r = ${q}\\)`, `Ni arithmétique ni géométrique`, `Géométrique de raison \\(q = ${u*q}\\)`],
    2,
    EXPL(
      `On calcule la différence \\(u_{n+1} - u_n\\) : elle donne \\(${u*q - u}\\) puis \\(${u*q*q - u*q}\\) — pas constante. On calcule alors le quotient \\(\\dfrac{u_{n+1}}{u_n}\\).`,
      `Chaque quotient vaut \\(${q}\\) : on passe d\u2019un terme au suivant en MULTIPLIANT toujours par la même quantité. Suite géométrique de raison \\(q = ${q}\\).`,
      `Une suite qui « augmente de plus en plus vite » n\u2019est pas arithmétique : quand la différence change, tester le quotient.`
    )
  );
};

GEN.suNonArith = function(){
  const type = pick(['quadratique','cubique','geometrique','alternee']);
  let expr, d1, d2, nature;
  if(type === 'quadratique'){
    const c = nz(-5,5);
    expr = 'n^2' + su2Sg(c);
    d1 = 1; d2 = 3;
    nature = `C\u2019est une suite quadratique : ses points suivent une parabole, pas une droite.`;
  } else if(type === 'cubique'){
    const c = nz(-5,5);
    expr = 'n^3' + su2Sg(c);
    d1 = 1; d2 = 7;
    nature = `C\u2019est une suite cubique : la croissance s\u2019accélère de plus en plus.`;
  } else if(type === 'geometrique'){
    const k = pick([2,3]);
    expr = `${k}^n`;
    d1 = k - 1; d2 = k*k - k;
    nature = `C\u2019est en réalité une suite GÉOMÉTRIQUE de raison \\(q = ${k}\\).`;
  } else {
    const k = R(2,5);
    expr = `(-1)^n \\times ${k}`;
    d1 = -2*k; d2 = 2*k;
    nature = `C\u2019est une suite alternée : elle oscille entre \\(${k}\\) et \\(${-k}\\).`;
  }
  return QCM(
    `La suite est définie par \\(u_n = ${expr}\\). Est-elle arithmétique ?`,
    `Non : les différences valent ${d1} puis ${d2} — elles ne sont pas constantes`,
    [`Oui, de raison \\(r = ${d1}\\)`, `Oui, de raison \\(r = ${d2}\\)`, `Oui, car les termes augmentent`, `On ne peut pas conclure sans le premier terme`],
    2,
    EXPL(
      `Pour prouver qu\u2019une suite est arithmétique, il faut des différences \\(u_{n+1} - u_n\\) CONSTANTES. Pour prouver qu\u2019elle ne l\u2019est PAS, deux contre-exemples suffisent.`,
      `\\(u_1 - u_0 = ${d1}\\) mais \\(u_2 - u_1 = ${d2}\\) : deux différences différentes, donc PAS arithmétique. ${nature}`,
      `Voir les termes augmenter ne prouve rien : une suite peut croître sans être arithmétique. Seule la constance de la différence décide.`
    )
  );
};

GEN.suArithVariation = function(){
  const r = pick([2,3,5,7,-2,-4,-6,-9,0]);
  const pool = ['Strictement croissante','Strictement décroissante','Constante'];
  const correct = r > 0 ? pool[0] : (r < 0 ? pool[1] : pool[2]);
  const ctx = r > 0 ? `Chaque mois, un livret reçoit ${r} € de plus que le mois précédent.` :
    (r < 0 ? `Chaque année, une machine perd ${-r} € de valeur par rapport à l\u2019année précédente.` :
    `Chaque semaine, le stock reste au même niveau.`);
  return QCM(
    `${ctx} On modélise par une suite arithmétique de raison \\(r = ${r}\\). Quel est le sens de variation de \\((u_n)\\) ?`,
    correct,
    pool.filter(p => p !== correct).concat([`Elle dépend du premier terme`, `Croissante puis décroissante`]),
    1,
    EXPL(
      `Le sens de variation d\u2019une suite arithmétique ne dépend QUE du signe de sa raison : \\(r \\gt 0\\) croissante, \\(r \\lt 0\\) décroissante, \\(r = 0\\) constante.`,
      `Ici \\(r = ${r}\\) : chaque terme s\u2019obtient en ajoutant \\(${r}\\) au précédent, donc la suite est ${correct.toLowerCase()}.`,
      `Le premier terme ne change RIEN au sens de variation : seule la raison commande. Une raison négative modélise une perte régulière (dette, dépréciation).`
    )
  );
};

GEN.suArithProbleme = function(){
  const type = pick(['economies','dette','temperature','photocopieuse','cubes']);
  if(type === 'economies'){
    const initial = R(4,20) * 5, saving = R(2,6) * 5, months = R(5,8);
    const val = initial + months * saving;
    return QCM(
      `Paul possède ${initial} € et économise ${saving} € chaque mois. On note \\(u_n\\) sa fortune après \\(n\\) mois, avec \\(u_0 = ${initial}\\). De combien dispose-t-il après ${months} mois ?`,
      M(String(val)),
      [M(String(initial + (months + 1) * saving)), M(String(initial + saving)), M(String(months * saving)), M(String(val - saving))],
      2,
      EXPL(
        `« Ajouter la même quantité à chaque étape » se modélise par une suite arithmétique : \\(u_{n+1} = u_n + r\\) avec \\(r = ${saving}\\).`,
        `\\(u_{${months}} = u_0 + ${months}\\times r = ${initial} + ${months}\\times ${saving} = ${val}\\) — soit ${months} sauts de ${saving} € depuis le départ.`,
        `Ne pas oublier le capital de départ : ${months} sauts, pas ${months + 1}. On compte les PAS, pas les poteaux.`
      )
    );
  }
  if(type === 'dette'){
    const mensualite = pick([100,150,200,250,300,500]);
    const mois = R(10,30);
    const dette0 = mensualite * mois;
    return QCM(
      `Une association doit ${dette0} € et rembourse ${mensualite} € chaque mois. On note \\(d_n\\) la dette restante après \\(n\\) mois, avec \\(d_0 = ${dette0}\\). Au bout de combien de mois la dette est-elle soldée ?`,
      M(String(mois)),
      [M(String(mois - 1)), M(String(mois + 1)), M(String(mensualite)), M(String(Math.round(dette0 / 100)))],
      2,
      EXPL(
        `« Retirer la même quantité à chaque étape » donne une suite arithmétique de raison NÉGATIVE : \\(d_{n+1} = d_n - ${mensualite}\\).`,
        `On résout \\(d_0 + n\\times(-${mensualite}) = 0\\), soit \\(n = \\dfrac{${dette0}}{${mensualite}} = ${mois}\\) mois.`,
        `La raison est négative (\\(r = ${-mensualite}\\)) : la suite est décroissante — bien mettre le signe dans l\u2019équation.`
      )
    );
  }
  if(type === 'temperature'){
    const t0 = R(15,25), g = pick([1,2,3]), k = R(3,8);
    const val = t0 - k * g;
    return QCM(
      `Au niveau de la mer, la température est de ${t0} °C ; elle diminue de ${g} °C chaque fois que l\u2019on monte de 100 m. On note \\(t_n\\) la température à l\u2019altitude \\(100\\,n\\) mètres. Quelle est la température à ${k * 100} m d\u2019altitude ?`,
      M(String(val)),
      [M(String(t0 + k * g)), M(String(t0 - g)), M(String(val - g)), M(String(t0 - k))],
      2,
      EXPL(
        `Une baisse régulière de ${g} °C par palier de 100 m se modélise par une suite arithmétique de raison \\(r = ${-g}\\), cohérente avec le gradient thermique.`,
        `\\(t_{${k}} = t_0 + ${k}\\times(${-g}) = ${t0} - ${k * g} = ${val}\\) °C à ${k * 100} m.`,
        `La raison est NÉGATIVE car la température diminue : monter de ${k} paliers retire ${k * g} °C, il ne faut pas les ajouter.`
      )
    );
  }
  if(type === 'photocopieuse'){
    const initial = R(6,15) * 50, incr = R(3,10) * 10, n = R(5,15);
    const seuil = initial + n * incr;
    return QCM(
      `Le compteur d\u2019une photocopieuse affiche ${initial} copies au jour 0, puis ${incr} copies de plus chaque jour. La machine tombe en panne le jour où le compteur atteint ${seuil}. Quel est ce jour \\(n\\) ?`,
      M(String(n)),
      [M(String(n - 1)), M(String(n + 1)), M(String(n + 2)), M(String(Math.round(seuil / initial)))],
      2,
      EXPL(
        `Le compteur cumulé suit une suite arithmétique : \\(u_n = u_0 + n\\times ${incr}\\). Chercher le jour de panne, c\u2019est résoudre \\(u_n = ${seuil}\\).`,
        `\\(${initial} + n\\times ${incr} = ${seuil}\\) donne \\(n\\times ${incr} = ${seuil - initial}\\), donc \\(n = ${n}\\) jours.`,
        `On résout une équation, pas une inéquation ici : la valeur ${seuil} est atteinte EXACTEMENT au jour ${n} — vérifier en reportant dans \\(u_n\\).`
      )
    );
  }
  const debut = R(12,20), raison = -R(1,3);
  const val = debut + 5 * raison;
  return QCM(
    `Un enfant empile ${debut} cubes sur la première rangée, puis ${-raison} cubes de moins à chaque rangée suivante. On note \\(u_n\\) le nombre de cubes de la rangée \\(n + 1\\). Combien de cubes compte la 6e rangée ?`,
    M(String(val)),
    [M(String(debut + 6 * raison)), M(String(debut - 5)), M(String(debut + 5)), M(String(val - raison))],
    2,
    EXPL(
      `« ${-raison} cubes de moins à chaque rangée » : une suite arithmétique de raison \\(r = ${raison}\\), donc décroissante.`,
      `La 6e rangée correspond à 5 sauts depuis la première : \\(u_5 = ${debut} + 5\\times(${raison}) = ${val}\\).`,
    `Compter les SAUTS : de la 1re à la 6e rangée, il y a 5 intervalles, pas 6 — même logique que les poteaux et les intervalles.`
    )
  );
};

GEN.trouSuitesArith2 = function(){
  return TROU(
    `Suites arithmétiques : reconnaître et modéliser, complète le raisonnement.`,
    `Prouver qu\u2019une suite est arithmétique : calculer la {{0}} \\(u_{n+1} - u_n\\) ; si elle est constante, la suite est arithmétique de {{1}} \\(r\\).<br>
     Formule explicite : \\(u_n = u_0 + n\\times r\\) — passer de \\(u_0\\) à \\(u_n\\) demande exactement {{2}} sauts, jamais \\(n+1\\).<br>
     Sens de variation : il ne dépend que du {{3}} de \\(r\\) — \\(r \\gt 0\\) croissante, \\(r \\lt 0\\) décroissante, \\(r = 0\\) {{4}}.<br>
     Modéliser : « ajouter la même quantité à chaque étape » donne \\(u_{n+1} = u_n + r\\) ; « retirer la même quantité » (dette, dépréciation) donne une raison {{5}}.<br>
     Contre-exemple : \\(u_n = n^2\\) donne des écarts 1 puis 3, non constants — PAS arithmétique, et ses points ne sont pas {{6}} sur une droite.`,
    ['différence','raison','n','signe','constante','négative','alignés'],
    ['quotient','exposant','somme','positif','croissante','positives','courbés','hippogriffe','marmotte'],
    `Les points d\u2019une suite arithmétique sont alignés comme sur une droite : si le nuage s\u2019incurve, la différence n\u2019est pas constante. Et pour deux termes \\(u_p\\), \\(u_q\\) : \\(r = \\dfrac{u_q - u_p}{q - p}\\), on divise par le nombre d\u2019intervalles.`
  );
};

/* ============================================================
   NOTION 3 — SUITES GÉOMÉTRIQUES : COEFFICIENTS MULTIPLICATEURS
   ============================================================ */
GEN.suGeoRecon = function(){
  const start = pick([0,1]);
  if(Math.random() < 0.7){
    const u = R(2,5), q = pick([2,3,4]);
    const t = [u, u*q, u*q*q, u*q*q*q];
    const listTex = t.map(x => String(x)).join('\\,;\\,');
    return QCM(
      `On relève les premiers termes d\u2019une suite : \\((${listTex})\\), en commençant à \\(n = ${start}\\). Quelle est la nature de cette suite ?`,
      `Géométrique de raison \\(q = ${q}\\)`,
      [`Arithmétique de raison \\(r = ${u*q - u}\\)`, `Géométrique de raison \\(q = ${u*q}\\)`, `Arithmétique de raison \\(r = ${q}\\)`, `Ni arithmétique ni géométrique`],
      2,
      EXPL(
        `Pour une suite à termes non nuls, on calcule le quotient \\(\\dfrac{u_{n+1}}{u_n}\\) : constant ⟹ géométrique.`,
        `Chaque quotient vaut \\(${q}\\) : on passe d\u2019un terme au suivant en MULTIPLIANT toujours par la même quantité. Suite géométrique de raison \\(q = ${q}\\).`,
        `La différence augmente aussi (\\(${u*q - u}\\), puis \\(${u*q*q - u*q}\\)) : c\u2019est le signe d\u2019une croissance exponentielle, pas linéaire.`
      )
    );
  }
  const u = R(2,9), r = R(2,6);
  const t = [u, u + r, u + 2*r, u + 3*r];
  const listTex = t.map(x => String(x)).join('\\,;\\,');
  return QCM(
    `On relève les premiers termes d\u2019une suite : \\((${listTex})\\), en commençant à \\(n = ${start}\\). Quelle est la nature de cette suite ?`,
    `Arithmétique de raison \\(r = ${r}\\)`,
    [`Géométrique de raison \\(q = ${r}\\)`, `Géométrique de raison \\(q = ${u + r}\\)`, `Ni arithmétique ni géométrique`, `Arithmétique de raison \\(r = ${u}\\)`],
    2,
    EXPL(
      `On teste la différence puis le quotient : ici la différence \\(u_{n+1} - u_n = ${r}\\) est constante, les quotients non.`,
      `On AJOUTE toujours ${r} : suite arithmétique de raison \\(r = ${r}\\), à croissance linéaire (points alignés).`,
      `Les quotients \\(\\dfrac{u_1}{u_0}\\) et \\(\\dfrac{u_2}{u_1}\\) diffèrent : ce n\u2019est pas en multipliant qu\u2019on avance ici.`
    )
  );
};

GEN.suGeoVariation = function(){
  const cas = pick([
    { tex: '3',        concl: 'Strictement croissante' },
    { tex: '5',        concl: 'Strictement croissante' },
    { tex: frac(1,2),  concl: 'Strictement décroissante' },
    { tex: frac(4,5),  concl: 'Strictement décroissante' },
    { tex: '1',        concl: 'Constante' },
    { tex: '-2',       concl: 'Ni croissante ni décroissante : les signes sont alternés' }
  ]);
  const pool = ['Strictement croissante','Strictement décroissante','Constante','Ni croissante ni décroissante : les signes sont alternés'];
  return QCM(
    `\\((v_n)\\) est une suite géométrique de premier terme \\(v_0 \\gt 0\\) et de raison \\(q = ${cas.tex}\\). Quel est son sens de variation ?`,
    cas.concl,
    pool.filter(p => p !== cas.concl),
    2,
    EXPL(
      `Pour un premier terme positif, le sens de variation d\u2019une suite géométrique se lit sur la position de \\(q\\) par rapport à 1 (si \\(q \\lt 0\\), les termes changent de signe à chaque étape).`,
      `Avec \\(q = ${cas.tex}\\) : ${cas.concl.toLowerCase()}.`,
      `Piège : \\(q\\) entre 0 et 1 fait certes « grandir l\u2019exposant », mais chaque multiplication par un nombre plus petit que 1 fait DÉCROÎTRE les termes. Et \\(q = 1\\) ne bouge jamais.`
    )
  );
};

GEN.suGeoCM = function(){
  const t = pick([5,10,15,20,25,50]);
  const hausse = pick([true,false]);
  const cm = hausse ? frac(100 + t, 100) : frac(100 - t, 100);
  return QCM(
    `Chaque année, un capital ${hausse ? `augmente` : `diminue`} de ${t} % par rapport à l\u2019année précédente. Par quel nombre la valeur est-elle multipliée à chaque étape (la raison de la suite géométrique) ?`,
    M(cm),
    [M(frac(t, 100)), M(hausse ? frac(100 - t, 100) : frac(100 + t, 100)), M(String(t)), M(frac(100, 100 + t)), M(String(100 + t))],
    2,
    EXPL(
      `Une évolution de \\(t\\,\\%\\) ne s\u2019additionne pas : elle se traduit par un coefficient multiplicateur, \\(1 + \\dfrac{t}{100}\\) pour une hausse, \\(1 - \\dfrac{t}{100}\\) pour une baisse.`,
      `${hausse ? 'Hausse' : 'Baisse'} de ${t} % : raison \\(q = ${cm}\\). Les valeurs successives forment une suite géométrique de raison \\(q\\) — c\u2019est le mécanisme des intérêts composés.`,
      `Ne JAMAIS écrire \\(100 - ${t} = ${100 - t}\\) : la raison est ${cm}, pas ${100 - t}. Le « % » cache une division par 100.`
    )
  );
};

GEN.suGeoProbleme = function(){
  const type = pick(['interets','pliage','echiquier','rebond','rumeur','voiture']);
  if(type === 'interets'){
    const cfg = pick([[25, 5, 4, [256, 512, 1024]], [20, 6, 5, [250, 625, 1250]], [50, 3, 2, [400, 800, 1600]]]);
    const t = cfg[0], num = cfg[1], den = cfg[2];
    const C0 = pick(cfg[3]);
    const val = C0 * num * num / (den * den);
    return QCM(
      `Un capital de ${C0} € est placé à intérêts composés au taux de ${t} % par an : les intérêts s\u2019ajoutent au capital chaque année. Quel est le capital au bout de 2 ans ?`,
      M(String(val) + ' €'),
      [M(String(Math.round(C0 * (1 + 2 * t / 100))) + ' €'), M(String(C0 * num / den) + ' €'), M(String(C0 + 2 * t) + ' €'), M(String(val + t) + ' €')],
      2,
      EXPL(
        `Chaque année, le capital est multiplié par \\(q = 1 + \\dfrac{${t}}{100} = ${frac(100 + t, 100)}\\) : le capital suit une suite géométrique de raison \\(q\\).`,
        `\\(C_2 = C_0\\times q^2 = ${C0}\\times ${frac(num * num, den * den)} = ${val}\\) € — deux multiplications successives.`,
        `Ne pas confondre intérêts composés (on multiplie : ${val} €) et intérêts simples (on ajoute ${t} % du capital de DÉPART chaque année : ${Math.round(C0 * (1 + 2 * t / 100))} €).`
      )
    );
  }
  if(type === 'pliage'){
    const plis = R(6,9);
    const val = Math.pow(2, plis);
    return QCM(
      `Une feuille de papier de 1 mm d\u2019épaisseur est pliée en deux ${plis} fois de suite : l\u2019épaisseur double à chaque pli. Quelle est l\u2019épaisseur finale (en mm) ?`,
      M(String(val)),
      [M(String(val * 2)), M(String(val / 2)), M(String(2 * plis)), M(String(plis * plis))],
      2,
      EXPL(
        `« Doubler à chaque pli » : suite géométrique de raison \\(q = 2\\), de premier terme \\(u_0 = 1\\) mm.`,
        `\\(u_{${plis}} = 1\\times 2^{${plis}} = ${val}\\) mm — la croissance exponentielle surprend toujours.`,
        `L\u2019épaisseur est \\(2^{${plis}}\\), pas \\(2\\times ${plis}\\) : doubler ${plis} fois de suite ne revient pas à ajouter ${plis} doublings.`
      )
    );
  }
  if(type === 'echiquier'){
    const c = R(5,12);
    const val = Math.pow(2, c - 1);
    return QCM(
      `Selon la légende, on pose 1 grain de riz sur la 1re case d\u2019un échiquier, 2 sur la 2e, 4 sur la 3e, en doublant à chaque case. Combien de grains sur la case n°${c} ?`,
      M(String(val)),
      [M(String(val * 2)), M(String(val / 2)), M(String(2 * c)), M(String(Math.pow(2, c)))],
      2,
      EXPL(
        `Les grains forment une suite géométrique de raison 2 : case 1 ⟶ \\(2^0\\), case 2 ⟶ \\(2^1\\), case \\(n\\) ⟶ \\(2^{n-1}\\).`,
        `Case ${c} : \\(2^{${c - 1}} = ${val}\\) grains — l\u2019exposant est le numéro de case MOINS 1.`,
        `Le décalage de 1 est le piège : la case 1 porte \\(2^0 = 1\\) grain, pas 2. Toujours vérifier sur la première case.`
      )
    );
  }
  if(type === 'rebond'){
    const h0 = pick([400,800,1600,3200]);
    const val = h0 / 8;
    return QCM(
      `Une balle est lâchée d\u2019une hauteur de ${h0} cm : à chaque rebond, elle remonte à la moitié de sa hauteur précédente. Quelle hauteur atteint-elle après le 3e rebond ?`,
      M(String(val) + ' cm'),
      [M(String(h0 / 4)) + ' cm', M(String(h0 / 2)) + ' cm', M(String(h0 / 16)) + ' cm', M(String(h0 - 300)) + ' cm'],
      2,
      EXPL(
        `« Remonter à la moitié » : suite géométrique de raison \\(q = ${frac(1,2)}\\), de premier terme \\(h_0 = ${h0}\\) cm.`,
        `\\(h_3 = h_0\\times q^3 = ${h0}\\times ${frac(1,8)} = ${val}\\) cm après le 3e rebond.`,
        `Trois rebonds = trois divisions par 2, soit diviser par 8 — pas par 3, ni par 6. L\u2019exposant compte les rebonds.`
      )
    );
  }
  if(type === 'rumeur'){
    const dep = R(5,20), q = pick([2,3]);
    const val = dep * Math.pow(q, 4);
    return QCM(
      `À 8 h, ${dep} personnes connaissent une rumeur ; leur nombre est multiplié par ${q} chaque heure. Combien de personnes la connaissent 4 heures plus tard ?`,
      M(String(val)),
      [M(String(dep * Math.pow(q, 3))), M(String(dep * 4 * q)), M(String(dep + 4 * q)), M(String(dep * Math.pow(q, 5)))],
      2,
      EXPL(
        `« Multiplié chaque heure » : suite géométrique de premier terme \\(u_0 = ${dep}\\) et de raison \\(q = ${q}\\).`,
        `\\(u_4 = ${dep}\\times ${q}^4 = ${dep}\\times ${Math.pow(q, 4)} = ${val}\\) personnes 4 heures après le départ.`,
        `4 heures ⟶ exposant 4, et on multiplie le nombre de DÉPART : ${dep} puis ${dep * q}, ${dep * q * q}… jamais ${dep} + ${4 * q}.`
      )
    );
  }
  const prix = pick([6250, 12500, 25000, 50000, 100000]);
  const val = prix * 16 / 25;
  return QCM(
    `Une voiture neuve vaut ${prix} € ; chaque année, elle perd 20 % de sa valeur par rapport à l\u2019année précédente. Que vaut-elle au bout de 2 ans ?`,
    M(String(val) + ' €'),
    [M(String(prix * 4 / 5)) + ' €', M(String(prix - 2 * 20)) + ' €', M(String(prix * 3 / 5)) + ' €', M(String(prix / 2)) + ' €'],
    2,
    EXPL(
      `Perdre 20 % par an = multiplier par \\(q = 1 - \\dfrac{20}{100} = ${frac(4,5)}\\) : la valeur suit une suite géométrique de raison \\(q\\).`,
      `\\(v_2 = ${prix}\\times ${frac(4,5)}^2 = ${prix}\\times ${frac(16,25)} = ${val}\\) € après 2 ans.`,
      `On ne retire pas 20 % du prix de départ deux fois (ce qui donnerait ${prix * 3 / 5} €) : chaque baisse porte sur la valeur de l\u2019année PRÉCÉDENTE.`
    )
  );
};

GEN.trouSuitesGeo2 = function(){
  return TROU(
    `Suites géométriques : quotients et pourcentages, complète le raisonnement.`,
    `Prouver qu\u2019une suite est géométrique (termes non nuls) : calculer le {{0}} \\(\\dfrac{u_{n+1}}{u_n}\\) ; s\u2019il est constant, la suite est géométrique de {{1}} \\(q\\).<br>
     Formule explicite : \\(u_n = u_0\\times q^n\\) — le rang devient l\u2019{{2}} de la raison.<br>
     Pourcentages : augmenter de \\(t\\,\\%\\) revient à multiplier par \\(1 + \\dfrac{t}{100}\\), le coefficient {{3}} ; baisser utilise \\(1 - \\dfrac{t}{100}\\) — les intérêts composés forment ainsi une suite géométrique.<br>
     Variations (premier terme positif) : \\(q \\gt 1\\) croissante, \\(0 \\lt q \\lt 1\\) {{4}}, \\(q = 1\\) constante ; si \\(q \\lt 0\\), les termes ont des signes {{5}} et la suite n\u2019est ni croissante ni décroissante.<br>
     Sur un graphique, les points d\u2019une suite géométrique suivent une courbe {{6}} : ils ne sont pas alignés comme ceux d\u2019une suite arithmétique.`,
    ['quotient','raison','exposant','multiplicateur','décroissante','alternés','exponentielle'],
    ['différence','somme','diviseur','croissante','constants','linéaire','pente','hippogriffe','ornithorynque'],
    `Le quotient constant caractérise la géométrique comme la différence constante caractérise l\u2019arithmétique. Et pour deux termes \\(u_p\\), \\(u_q\\) : \\(q^{q-p} = \\dfrac{u_q}{u_p}\\) — l\u2019écart d\u2019indices se retrouve en EXPOSANT.`
  );
};

/* ============================================================
   NOTION 4 — SENS DE VARIATION D'UNE SUITE
   ============================================================ */
GEN.suVarAffine = function(){
  const a = nz(-6,6), b = R(-9,9);
  const correct = a > 0 ? `Croissante : la différence vaut \\(${a}\\), positive` : `Décroissante : la différence vaut \\(${a}\\), négative`;
  return QCM(
    `La suite est définie par \\(u_n = ${su2Co(a,'n')}${b !== 0 ? su2Sg(b) : ''}\\) pour tout \\(n \\ge 0\\). Étudiez le signe de \\(u_{n+1} - u_n\\) puis déduisez le sens de variation.`,
    correct,
    [a > 0 ? `Décroissante : la différence vaut \\(${a}\\)` : `Croissante : la différence vaut \\(${a}\\)`, `Constante`, `Non monotone : la différence dépend de \\(n\\)`, `On ne peut pas savoir sans \\(u_0\\)`],
    2,
    EXPL(
      `Méthode générale : exprimer \\(u_{n+1}\\), calculer la différence \\(u_{n+1} - u_n\\), étudier son signe.`,
      `\\(u_{n+1} = ${a}(n+1)${b !== 0 ? su2Sg(b) : ''} = ${su2Co(a,'n')} ${su2Sg(a)}${b !== 0 ? su2Sg(b) : ''}\\), donc \\(u_{n+1} - u_n = ${a}\\), constant : la suite est ${a > 0 ? 'croissante' : 'décroissante'}.`,
      `La constante \\(b\\) s\u2019élimine dans la différence : elle décale les termes mais ne change pas le sens de variation.`
    )
  );
};

GEN.suVarQuad = function(){
  const cas = pick(['croissante','decroissante','nonmonotone']);
  let a, b, c, diffC, diffK, correct, wrongs;
  if(cas === 'croissante'){
    a = pick([1,2]); b = R(0,6); c = nz(-5,5);
    diffC = 2*a; diffK = a + b;
    correct = `Croissante : \\(u_{n+1} - u_n = ${2*a}n ${su2Sg(a + b)}\\), positif dès \\(n = 0\\)`;
    wrongs = [`Décroissante`, `Constante`, `Non monotone : le signe change en cours de route`];
  } else if(cas === 'decroissante'){
    a = pick([-1,-2]); b = R(-6,-1); c = nz(-5,5);
    diffC = 2*a; diffK = a + b;
    correct = `Décroissante : \\(u_{n+1} - u_n = ${2*a}n ${su2Sg(a + b)}\\), négatif pour tout \\(n \\ge 0\\)`;
    wrongs = [`Croissante`, `Constante`, `Non monotone : le signe change en cours de route`];
  } else {
    a = 1; b = -5; c = nz(-5,5);
    diffC = 2; diffK = -4;
    correct = `Non monotone : \\(u_{n+1} - u_n = 2n - 4\\) change de signe (décroissante puis croissante)`;
    wrongs = [`Croissante`, `Décroissante`, `Constante`];
  }
  const expr = su2Co(a, 'n^2') + su2T(b, 'n') + (c !== 0 ? su2Sg(c) : '');
  return QCM(
    `La suite est définie par \\(u_n = ${expr}\\) pour tout \\(n \\ge 0\\). Étudiez le signe de \\(u_{n+1} - u_n\\) puis déduisez le sens de variation.`,
    correct,
    wrongs,
    2,
    EXPL(
      `Pour un polynôme, développer \\((n+1)^2 = n^2 + 2n + 1\\) : les termes en \\(n^2\\) s\u2019annulent dans la différence, il reste une expression affine en \\(n\\).`,
      `\\(u_{n+1} - u_n = ${diffC}\\,n ${su2Sg(diffK)}\\). ${cas === 'nonmonotone' ? `En \\(n = 0\\) elle vaut ${diffK} (négative), en \\(n = 3\\) elle vaut ${diffC * 3 + diffK} (positive) : le signe change, la suite n\u2019est pas monotone.` : (cas === 'croissante' ? `Comme \\(${diffC} \\gt 0\\) et \\(${diffK} \\gt 0\\), la différence est positive pour tout \\(n \\ge 0\\).` : `Comme \\(${diffC} \\lt 0\\) et \\(${diffK} \\lt 0\\), la différence est négative pour tout \\(n \\ge 0\\).`)}`,
      `Une différence qui dépend de \\(n\\) interdit de conclure « croissante » ou « décroissante » dans l\u2019absolu : étudier son signe comme un binôme, et penser au changement de signe.`
    )
  );
};

GEN.suVarRat = function(){
  let a, b, d, det;
  do { a = nz(-5,5); b = nz(-5,5); d = R(1,4); det = a*d - b; } while(det === 0);
  const correct = det > 0 ?
    `Croissante : le numérateur \\(${det}\\) est positif, le dénominateur aussi` :
    `Décroissante : le numérateur \\(${det}\\) est négatif, le dénominateur est positif`;
  return QCM(
    `La suite est définie par \\(u_n = \\dfrac{${su2Co(a,'n')}${su2Sg(b)}}{n ${su2Sg(d)}}\\) pour tout \\(n \\ge 0\\). Étudiez le signe de \\(u_{n+1} - u_n\\) puis déduisez le sens de variation.`,
    correct,
    [det > 0 ? `Décroissante : le numérateur \\(${det}\\) est positif` : `Croissante : le numérateur \\(${det}\\) est négatif`, `Constante : les \\(n\\) se simplifient`, `Non monotone : le signe dépend de \\(n\\)`],
    2,
    EXPL(
      `Pour une forme rationnelle, réduire \\(u_{n+1} - u_n\\) au même dénominateur : le signe de la différence est celui du numérateur SI le dénominateur est positif.`,
      `Après réduction : \\(u_{n+1} - u_n = \\dfrac{${det}}{(n ${su2Sg(d)})(n ${su2Sg(d + 1)})}\\). Pour \\(n \\ge 0\\), le dénominateur est positif, donc le signe est celui du numérateur \\(${det}\\) : la suite est ${det > 0 ? 'croissante' : 'décroissante'}.`,
      `Le numérateur \\(${a}\\times ${d} - ${b} = ${det}\\) ne dépend plus de \\(n\\) : c\u2019est lui qui tranche. Ne pas conclure avant d\u2019avoir vérifié le signe du dénominateur.`
    )
  );
};

GEN.suVarRacine = function(){
  const a = pick([1,2,3]), b = R(1,6), k = nz(-4,4);
  const correct = k > 0 ?
    `Croissante : la racine carrée est croissante et \\(k = ${k}\\) est positif` :
    `Décroissante : la racine carrée est croissante mais \\(k = ${k}\\) est négatif`;
  return QCM(
    `La suite est définie par \\(u_n = ${su2Co(k,'')}\\sqrt{${su2Co(a,'n')}${su2Sg(b)}}\\) pour tout \\(n \\ge 0\\). Déduisez le sens de variation de \\((u_n)\\) du sens de la différence \\(u_{n+1} - u_n\\).`,
    correct,
    [k > 0 ? `Décroissante : la racine carrée est croissante` : `Croissante : la racine carrée est croissante`, `Constante : la racine ne bouge pas`, `Non monotone : le signe change`],
    2,
    EXPL(
      `La fonction racine carrée est croissante sur les positifs : si \\(x \\gt y \\gt 0\\), alors \\(\\sqrt{x} \\gt \\sqrt{y}\\).`,
      `Comme \\(a = ${a} \\gt 0\\), le radicande grandit avec \\(n\\), donc la racine croît ; multiplier par \\(k = ${k}\\) ${k > 0 ? 'conserve' : 'inverse'} le sens : la suite est ${k > 0 ? 'croissante' : 'décroissante'}.`,
      `Ne pas oublier le coefficient \\(k\\) : une racine qui grandit, multipliée par un négatif, donne une suite qui DÉCROÎT. Le signe du coefficient décide.`
    )
  );
};

GEN.trouSuitesVar = function(){
  return TROU(
    `Sens de variation d'une suite : complète la méthode.`,
    `Méthode générale : calculer la {{0}} \\(u_{n+1} - u_n\\) puis étudier son {{1}}.<br>
     Si elle est toujours positive, la suite est {{2}} ; si toujours négative, elle est décroissante.<br>
     Si l\u2019expression dépend de \\(n\\) et change de signe, la suite n\u2019est pas {{3}} : elle peut décroître puis croître (exemple : \\(u_n = n^2 - 5n\\) donne \\(u_{n+1} - u_n = 2n - 4\\), négatif puis positif).<br>
     Cas affine \\(u_n = an + b\\) : la différence vaut simplement {{4}}.<br>
     Cas géométrique à termes positifs : comparer la raison à {{5}} revient à étudier le signe de \\(u_n(q - 1)\\).<br>
     Cas racine carrée : la fonction racine est croissante, donc \\(k\\sqrt{an + b}\\) varie selon le signe de {{6}}.`,
    ['différence','signe','croissante','monotone','a','1','k'],
    ['somme','quotient','décroissante','constante','alignée','exposant','q','parabole','hippogriffe'],
    `Étudier une suite, c\u2019est étudier une différence comme on étudierait un signe en classe de seconde : expression, tableau, conclusion — et toujours vérifier sur les premiers termes.`
  );
};

/* ============================================================
   FICHES DE COURS
   ============================================================ */
FICHES['suites-generalites'] = { titre: '🟣 Suites : définitions, rangs & récurrence', html: `
  <p><b>Notation :</b> \\((u_n)\\) avec parenthèses désigne la SUITE (la liste ordonnée entière) ; \\(u_n\\) sans parenthèses désigne UN terme — un nombre réel d\u2019indice \\(n\\). Attention à la graphie : \\(u_n\\) n\u2019est ni \\(u\\times n\\) ni \\(u^n\\).</p>
  ${tableHTML(['Mode de définition','Principe','Exemple'],[
    ['Liste exhaustive','les valeurs une à une, avec le premier indice','\\((2\\,;\\,5\\,;\\,8\\,;\\,11\\,;\\,\\dots)\\)'],
    ['Graphique','nuage de points isolés, JAMAIS reliés','points \\((n\\,;\\,u_n)\\)'],
    ['Formule explicite','\\(u_n = f(n)\\), tout terme directement','\\(u_n = 3n^2 - 5n + 1\\)'],
    ['Récurrence','\\(u_{n+1} = f(u_n)\\), de proche en proche','\\(u_0 = 2\\), \\(u_{n+1} = 2\\,u_n + 3\\)']
  ])}
  <p><b>Récurrence :</b> le premier terme est OBLIGATOIRE — sans lui, la suite n\u2019est pas définie. Une récurrence d\u2019ordre 2 (\\(u_{n+2} = f(u_{n+1}, u_n)\\), style Fibonacci) exige DEUX termes initiaux. On calcule alors \\(u_1\\), puis \\(u_2\\), de proche en proche.</p>
  <p><b>Rang et indice :</b> l\u2019indice est le numéro écrit en bas ; le rang est la position dans la liste (1er, 2e, …). Pour une suite débutant en \\(n_0\\) : rang \\(= n - n_0 + 1\\), et inversement \\(n = rang + n_0 - 1\\). Exemple : départ en \\(n_0 = 1\\), \\(u_4\\) est le 4e terme ; départ en \\(n_0 = 0\\), \\(u_4\\) est le 5e terme.</p>
  <p><b>Trouver l\u2019indice d\u2019une valeur :</b> résoudre \\(u_n = V\\) où l\u2019inconnue est l\u2019entier \\(n\\), puis convertir en rang. Toujours vérifier que la solution est un entier naturel dans le domaine de définition.</p>` };

FICHES['suites-modeles'] = { titre: '🟣 Arithmétique ou géométrique : reconnaître & modéliser', html: `
  ${tableHTML(['','Arithmétique','Géométrique'],[
    ['Caractérisation','différence \\(u_{n+1} - u_n = r\\) constante','quotient \\(\\dfrac{u_{n+1}}{u_n} = q\\) constant'],
    ['Récurrence','\\(u_{n+1} = u_n + r\\)','\\(u_{n+1} = q\\times u_n\\)'],
    ['Formule explicite','\\(u_n = u_0 + n\\times r\\)','\\(u_n = u_0\\times q^n\\)'],
    ['Graphique','points ALIGNÉS (droite)','courbe EXPONENTIELLE'],
    ['Variation','signe de \\(r\\)','position de \\(q\\) par rapport à 1']
  ])}
  <p><b>Variations :</b> arithmétique : \\(r \\gt 0\\) croissante, \\(r \\lt 0\\) décroissante, \\(r = 0\\) constante. Géométrique (premier terme positif) : \\(q \\gt 1\\) croissante, \\(0 \\lt q \\lt 1\\) décroissante, \\(q = 1\\) constante, \\(q \\lt 0\\) signes alternés (ni croissante ni décroissante).</p>
  <p><b>Coefficient multiplicateur :</b> augmenter de \\(t\\,\\%\\) = multiplier par \\(1 + \\dfrac{t}{100}\\) ; baisser = multiplier par \\(1 - \\dfrac{t}{100}\\). Intérêts composés, dépréciation en pourcentage, pliages, rebonds, rumeurs : autant de suites géométriques de raison ce coefficient multiplicateur — l\u2019exposant compte les étapes.</p>
  <p><b>Modéliser une situation :</b> « ajouter la même quantité » (économies, dette, gradient thermique, paliers) ⟶ arithmétique ; « multiplier par le même facteur » (pourcentages, doublements) ⟶ géométrique. Une perte régulière donne une raison négative ; on compte les SAUTS : de \\(u_p\\) à \\(u_q\\), il y a \\(q - p\\) intervalles.</p>
  <p><b>Contre-exemples (PAS arithmétiques) :</b> \\(n^2\\) (écarts 1, 3, 5…), \\(n^3\\), \\(k^n\\) (géométrique), \\((-1)^n\\) (alternée) : deux différences différentes suffisent pour réfuter.</p>` };

FICHES['suites-variation'] = { titre: '🟣 Sens de variation : étudier u_{n+1} − u_n', html: `
  <p><b>Méthode :</b> exprimer \\(u_{n+1}\\), calculer la différence \\(u_{n+1} - u_n\\), simplifier, étudier son SIGNE, conclure : positive ⟶ croissante, négative ⟶ décroissante, changeante ⟶ non monotone.</p>
  ${tableHTML(['Forme de \\(u_n\\)','Différence \\(u_{n+1} - u_n\\)','Ce qui décide'],[
    ['Affine \\(an + b\\)','\\(a\\)','le signe de \\(a\\)'],
    ['Quadratique \\(an^2 + bn + c\\)','\\(2an + (a + b)\\)','signe du binôme — peut CHANGER (non monotone)'],
    ['Rationnelle \\(\\dfrac{an + b}{n + d}\\)','\\(\\dfrac{ad - b}{(n+d)(n+d+1)}\\)','signe du numérateur (dénominateur positif)'],
    ['Racine \\(k\\sqrt{an + b}\\)','du signe de \\(k\\)','racine croissante, coefficient décide'],
    ['Géométrique (termes positifs)','\\(u_n(q - 1)\\)','position de \\(q\\) par rapport à 1']
  ])}
  <p><b>Non monotone :</b> si la différence dépend de \\(n\\) (ex. \\(u_n = n^2 - 5n\\), différence \\(2n - 4\\), négative puis positive), la suite change de sens : décroissante puis croissante. Ne jamais conclure « croissante » sans avoir vérifié le signe POUR TOUT \\(n\\) du domaine.</p>
  <p><b>Réflexe :</b> la constante disparaît dans la différence ; le premier terme ne joue jamais sur le sens de variation d\u2019une suite arithmétique ou géométrique explicite — seule la raison commande.</p>` };

/* ============================================================
   GEN_INFO DES 20 GÉNÉRATEURS
   ============================================================ */
(function(){
  const GE = 'suites-generalites', MO = 'suites-modeles', VA = 'suites-variation';
  const defs = [
    ['suListe',            'Lire un terme dans une liste',                     [GE]],
    ['suExplicite',        'Calculer u_n par une formule explicite',            [GE]],
    ['suRecurrence',       'Calculer de proche en proche (récurrence)',        [GE]],
    ['suRang',             'Indice et rang d\u2019un terme',                   [GE]],
    ['trouSuitesGen',      'Raisonnement : définitions & rangs',               [GE]],
    ['suArithRecon',       'Reconnaître une suite arithmétique',               [MO]],
    ['suNonArith',         'Contre-exemples : pas arithmétique',               [MO]],
    ['suArithVariation',   'Variation selon le signe de r',                    [MO]],
    ['suArithProbleme',    'Problèmes : économies, dette, seuils',             [MO]],
    ['trouSuitesArith2',   'Raisonnement : reconnaître & modéliser',          [MO]],
    ['suGeoRecon',         'Reconnaître une suite géométrique',               [MO]],
    ['suGeoVariation',     'Variation selon la raison q',                     [MO]],
    ['suGeoCM',            'Coefficient multiplicateur 1 ± t/100',            [MO]],
    ['suGeoProbleme',      'Intérêts composés, pliages, rebonds',             [MO]],
    ['trouSuitesGeo2',     'Raisonnement : quotients & pourcentages',          [MO]],
    ['suVarAffine',        'Variation : suite affine',                        [VA]],
    ['suVarQuad',          'Variation : suite quadratique',                   [VA]],
    ['suVarRat',           'Variation : suite rationnelle',                   [VA]],
    ['suVarRacine',        'Variation : suite avec racine',                   [VA]],
    ['trouSuitesVar',      'Raisonnement : étude de u_{n+1} − u_n',           [VA]]
  ];
  const rappels = {
    suListe: "Liste exhaustive : repérer le premier indice (0 ou 1), puis compter les positions.",
    suExplicite: "Formule explicite : remplacer n par sa valeur partout, priorités opératoires.",
    suRecurrence: "Récurrence : premier terme obligatoire, calculer u1 puis u2 de proche en proche.",
    suRang: "rang = n − n₀ + 1 ; indice = numéro, rang = position dans la liste.",
    trouSuitesGen: "Chaîne : suite vs terme, liste, explicite, récurrence, premier terme, rang, points isolés.",
    suArithRecon: "Différence u_{n+1} − u_n constante : arithmétique ; sinon tester le quotient.",
    suNonArith: "Deux différences différentes suffisent : n², n³, k^n, (−1)^n ne sont pas arithmétiques.",
    suArithVariation: "r > 0 croissante, r < 0 décroissante, r = 0 constante — le premier terme n'y change rien.",
    suArithProbleme: "Ajouter/retrirer la même quantité : raison r ; compter les sauts (q − p intervalles).",
    trouSuitesArith2: "Chaîne : différence, raison, sauts, signe, modélisation, contre-exemple, points alignés.",
    suGeoRecon: "Quotient u_{n+1}/u_n constant : géométrique ; la différence, elle, explose.",
    suGeoVariation: "q > 1 croissante ; 0 < q < 1 décroissante ; q = 1 constante ; q < 0 signes alternés.",
    suGeoCM: "Hausse de t% : ×(1 + t/100) ; baisse : ×(1 − t/100) — jamais 100 ± t.",
    suGeoProbleme: "Suite géométrique : l'exposant compte les étapes (plis, rebonds, cases, années).",
    trouSuitesGeo2: "Chaîne : quotient, raison, exposant, multiplicateur, décroissance, signes alternés, exponentielle.",
    suVarAffine: "u_n = an + b : la différence vaut a, la constante b disparaît.",
    suVarQuad: "Développer (n+1)² : différence 2an + (a + b), signe à étudier — parfois non monotone.",
    suVarRat: "Réduire au même dénominateur : signe du numérateur (ad − b) si dénominateur positif.",
    suVarRacine: "Racine carrée croissante : le signe du coefficient k décide du sens.",
    trouSuitesVar: "Chaîne : différence, signe, croissante, monotone, cas affine, raison 1, coefficient k."
  };
  defs.forEach(function(d){ GEN_INFO[d[0]] = { label: d[1], fiches: d[2], rappel: rappels[d[0]] }; });
})();

/* ============================================================
   4 NOTIONS EN SOMMET DE TOUR (→ 168 étages)
   ============================================================ */
NOTIONS.push(
  { id: 'su-generalites', name: 'Suites : définitions, termes & rangs',
    g: ['suListe','suExplicite','suRecurrence','suRang','trouSuitesGen'], family: 'violet', prob: 0.5 },
  { id: 'su-arithmetiques', name: 'Suites arithmétiques : reconnaître & modéliser',
    g: ['suArithRecon','suNonArith','suArithVariation','suArithProbleme','trouSuitesArith2'], family: 'violet', prob: 0.5 },
  { id: 'su-geometriques', name: 'Suites géométriques : coefficients multiplicateurs',
    g: ['suGeoRecon','suGeoVariation','suGeoCM','suGeoProbleme','trouSuitesGeo2'], family: 'violet', prob: 0.5 },
  { id: 'su-variation', name: 'Sens de variation d\u2019une suite',
    g: ['suVarAffine','suVarQuad','suVarRat','suVarRacine','trouSuitesVar'], family: 'violet', prob: 0.5 }
);

/* Formes 3D des nouveaux étages (constantes de 14-formes-3d.js). */
document.addEventListener('DOMContentLoaded', function(){
  FLOOR_SHAPES['su-generalites']  = 'colonnade';
  FLOOR_SHAPES['su-arithmetiques'] = 'stairs';
  FLOOR_SHAPES['su-geometriques']  = 'tree';
  FLOOR_SHAPES['su-variation']     = 'wave';
});
