/* ============================================================
   2. BANQUE D'EXERCICES
   ============================================================ */
const GEN = {};

// --- Original Tower Generators ---
GEN.canonique = () => {
  const k = nz(-4,4), c = nz(-6,6);
  const b = 2*k, cc = c - k*k;
  const f = polyStr([[1,'x^2'],[b,'x'],[c,'']]);
  return QCM(
    `Soit \\(f(x)=${f}\\). Quelle est la forme canonique de \\(f(x)\\) ?`,
    `\\((x${sg(k)})^2${sg(cc)}\\)`,
    [`\\((x${sg(-k)})^2${sg(cc)}\\)`,
     `\\((x${sg(k)})^2${sg(-cc)}\\)`,
     `\\((x${sg(-k)})^2${sg(-cc)}\\)`],
    1,
    EXPL(
      `Tout trinôme \\(x^2+bx+c\\) s'écrit <b>forme canonique</b> \\((x-\\alpha)^2+\\beta\\) avec \\(\\alpha=-\\dfrac{b}{2}\\), \\(\\beta=c-\\dfrac{b^2}{4}\\).`,
      `\\(b=${b}\\Rightarrow\\alpha=${-k}\\). \\(\\beta=${c}-${k*k}=${cc}\\).<br>\\(f(x)=(x${sg(k)})^2${sg(cc)}\\).`,
      `Attention au signe : \\((x-\\alpha)^2\\) avec \\(\\alpha=${-k}\\). <b>Vérifiez en développant.</b>`
    )
  );
};

GEN.devRed = () => {
  let a,b;
  do { a=nz(-5,5); b=nz(-5,5); } while(a+b===0);
  if(Math.random()<0.5){
    const f = `(x${sg(a)})(x${sg(b)})`;
    const d = polyStr([[1,'x^2'],[a+b,'x'],[a*b,'']]);
    return QCM(`Développer et réduire \\(${f}\\).`, `\\(${d}\\)`, [
      `\\(${polyStr([[1,'x^2'],[-(a+b),'x'],[a*b,'']])}\\)`,
      `\\(${polyStr([[1,'x^2'],[a+b,'x'],[-a*b,'']])}\\)`,
      `\\(${polyStr([[1,'x^2'],[a*b,'x'],[a+b,'']])}\\)`
    ], 1, EXPL(
      `<b>Double distributivité</b> : \\((x+a)(x+b)=x^2+(a+b)x+ab\\).`,
      `\\((${f})=${d}\\).`,
      `Ne pas oublier les deux produits croisés.`
    ));
  } else {
    const m=R(2,4), n=R(2,4);
    const A=m*n, B=m*b+n*a, C=a*b;
    const f = `(${m}x${sg(a)})(${n}x${sg(b)})`;
    return QCM(`Développer et réduire \\(${f}\\).`,
      `\\(${polyStr([[A,'x^2'],[B,'x'],[C,'']])}\\)`,
      [`\\(${polyStr([[A,'x^2'],[B,'x'],[-C,'']])}\\)`,
       `\\(${polyStr([[m+n,'x^2'],[B,'x'],[C,'']])}\\)`,
       `\\(${polyStr([[A,'x^2'],[C,'x'],[B,'']])}\\)`],
      1,
      EXPL(`Distribution des deux facteurs.`,
        `\\(=${polyStr([[A,'x^2'],[B,'x'],[C,'']])}\\).`,
        `Attention aux produits croisés.`));
  }
};

GEN.factorisation = () => {
  let p,q;
  do { p=nz(-5,5); q=nz(-5,5); } while(p===q);
  const b=-(p+q), c=p*q;
  const f = polyStr([[1,'x^2'],[b,'x'],[c,'']]);
  return QCM(`Factoriser \\(${f}\\).`,
    `\\((x${sg(-p)})(x${sg(-q)})\\)`,
    [`\\((x${sg(p)})(x${sg(q)})\\)`,
     `\\((x${sg(-p)})(x${sg(q)})\\)`,
     `\\((x${sg(p)})(x${sg(-q)})\\)`],
    1,
    EXPL(`Chercher deux nombres dont la <b>somme</b> vaut \\(-b\\) et le <b>produit</b> \\(c\\).`,
      `\\(p+q=${p+q}\\), \\(pq=${c}\\) : \\(p=${p}\\), \\(q=${q}\\).<br>\\(f(x)=(x${sg(-p)})(x${sg(-q)})\\).`,
      `Signes : \\((x-p)(x-q)\\), pas \\((x+p)(x+q)\\).`));
};

GEN.eqSecond = () => {
  let p,q;
  do { p=nz(-5,5); q=nz(-5,5); } while(p===q);
  const b=-(p+q), c=p*q;
  const f = polyStr([[1,'x^2'],[b,'x'],[c,'']]);
  const S = [p,q].sort((x,y)=>x-y);
  return QCM(`Résoudre dans \\(\\mathbb{R}\\) : \\(${f}=0\\).`,
    `\\(S=\\{${S[0]}\\,;\\,${S[1]}\\}\\)`,
    [`\\(S=\\{${-S[0]}\\,;\\,${-S[1]}\\}\\)`,
     `\\(S=\\{${S[0]}\\,;\\,${-S[1]}\\}\\)`,
     `\\(S=\\{${S[0]+1}\\,;\\,${S[1]+1}\\}\\)`],
    1,
    EXPL(`Un produit est nul ssi un facteur est nul.`,
      `\\(${f}=(x${sg(-p)})(x${sg(-q)})=0\\Rightarrow x=${p}\\) ou \\(x=${q}\\).`,
      `Les solutions sont les racines, pas leurs opposées.`));
};

GEN.ineqSecond = () => {
  let a=R(-4,2), b;
  do { b=R(-2,5); } while(b<=a);
  const f = `(x${sg(-a)})(x${sg(-b)})`;
  if(Math.random()<0.5){
    return QCM(`Résoudre dans \\(\\mathbb{R}\\) : \\(${f}\\leqslant 0\\).`,
      `\\(S=[${a}\\,;\\,${b}]\\)`,
      [`\\(S=]${a}\\,;\\,${b}[\\)`,
       `\\(S=]-\\infty\\,;\\,${a}]\\cup[${b}\\,;\\,+\\infty[\\)`,
       `\\(S=[${b}\\,;\\,${a}]\\)`],
      2,
      EXPL(`Coefficient dominant positif \\(\\Rightarrow\\) négatif <b>entre</b> les racines.`,
        `Racines ${a}, ${b}. \\(S=[${a}\\,;\\,${b}]\\).`,
        `Attention aux crochets : \\(\\leqslant\\) = bornes fermées.`));
  }
  return QCM(`Résoudre dans \\(\\mathbb{R}\\) : \\(${f}\\geqslant 0\\).`,
    `\\(S=]-\\infty\\,;\\,${a}]\\cup[${b}\\,;\\,+\\infty[\\)`,
    [`\\(S=[${a}\\,;\\,${b}]\\)`,
     `\\(S=]${a}\\,;\\,${b}[\\)`,
     `\\(S=]-\\infty\\,;\\,${b}]\\cup[${a}\\,;\\,+\\infty[\\)`],
    2,
    EXPL(`Coefficient dominant positif \\(\\Rightarrow\\) positif <b>à l'extérieur</b>.`,
      `\\(S=]-\\infty\\,;\\,${a}]\\cup[${b}\\,;\\,+\\infty[\\).`,
      `Attention à l'ordre des racines.`));
};

GEN.eqDroite = () => {
  const m = nz(-4,4), d = pick([-3,-2,-1,1,2,3]);
  const x1 = R(-3,3), y1 = R(-4,4);
  const x2 = x1+d, y2 = y1+m*d;
  const p  = y1 - m*x1;
  return QCM(
    `On donne \\(A(${x1}\\,;\\,${y1})\\) et \\(B(${x2}\\,;\\,${y2})\\). Équation réduite de \\((AB)\\) ?`,
    `\\(${lineq(m,p)}\\)`,
    [`\\(${lineq(-m,p)}\\)`, `\\(${lineq(m,-p)}\\)`, `\\(${lineq(m,p+1)}\\)`, `\\(${lineq(m+1,p)}\\)`],
    1,
    EXPL(`\\(m=\\dfrac{y_B-y_A}{x_B-x_A}\\), \\(p=y_A-m x_A\\).`,
      `\\(m=${m}\\), \\(p=${p}\\), \\(${lineq(m,p)}\\).`,
      `Ne pas inverser numérateur/dénominateur.`));
};

GEN.nombreDerive = () => {
  const a=nz(-4,4), b=nz(-6,6), x0=nz(-3,3);
  const f = polyStr([[1,'x^2'],[a,'x'],[b,'']]);
  const d = 2*x0 + a;
  return QCM(
    `Soit \\(f(x)=${f}\\). Nombre dérivé en \\(x_0=${x0}\\) ?`,
    `\\(${d}\\)`, [`\\(${-d}\\)`, `\\(${2*x0-a}\\)`, `\\(${x0*x0+a*x0+b}\\)`],
    1,
    EXPL(`\\(f'(x_0)\\) = coefficient directeur de la tangente en \\(x_0\\).`,
      `\\(f'(x)=2x${sg(a)}\\Rightarrow f'(${x0})=${d}\\).`,
      `Ne pas confondre \\(f(x_0)\\) et \\(f'(x_0)\\).`));
};

GEN.nombreDeriveLimite = () => {
  const type = R(1,4);
  if(type === 1){
    const a = nz(-3,3);
    const result = 2*a;
    return QCM(
      `\\(f(x)=x^2\\), \\(a=${a}\\). \\(f'(${a})=\\lim\\limits_{h\\to 0}\\dfrac{f(${a}+h)-f(${a})}{h}\\). Valeur ?`,
      `\\(${result}\\)`, [`\\(${-result}\\)`, `\\(${2*a-2}\\)`, `\\(${2*a+1}\\)`],
      3,
      EXPL(
        `<b>Nombre dérivé = limite du taux d'accroissement.</b> Méthode : calculer \\(f(a+h)\\), soustraire \\(f(a)\\), factoriser par \\(h\\), simplifier, puis limite quand \\(h\\to 0\\).`,
        `\\(f(${a}+h)=${a*a}${sg(2*a)}h+h^2\\), \\(f(${a})=${a*a}\\).<br>Différence : \\(${2*a}h+h^2\\). Quotient : \\(${2*a}+h\\).<br>Limite : \\(${result}\\).`,
        `Ne pas remplacer \\(h\\) par 0 trop tôt (forme 0/0). Factoriser et simplifier d'abord.`
      ));
  }
  if(type === 2){
    const a = nz(-3,3), b = nz(-4,4), c = nz(-3,3);
    const result = 2*a + b;
    const f = polyStr([[1,'x^2'],[b,'x'],[c,'']]);
    const fa = a*a + b*a + c;
    return QCM(
      `\\(f(x)=${f}\\), \\(a=${a}\\). \\(f'(${a})=\\lim\\limits_{h\\to 0}\\dfrac{f(${a}+h)-f(${a})}{h}\\). Valeur ?`,
      `\\(${result}\\)`, [`\\(${2*a-b}\\)`, `\\(${2*a}\\)`, `\\(${fa}\\)`],
      3,
      EXPL(`Taux d'accroissement puis limite.`,
        `\\(f(${a}+h)=${a*a}${sg(2*a)}h+h^2${sg(b*a)}${sg(b)}h${sg(c)}\\).<br>Différence : \\(h(${2*a}+h${sg(b)})\\). Quotient : \\(${2*a}+h${sg(b)}\\). Limite : \\(${result}\\).`,
        `Attention aux produits croisés en développant \\(f(a+h)\\).`));
  }
  if(type === 3){
    const a = pick([2,3,-2,-3]);
    const correctStr = frac(-1, a*a);
    return QCM(
      `\\(f(x)=\\dfrac{1}{x}\\), \\(a=${a}\\). \\(f'(${a})=\\lim\\limits_{h\\to 0}\\dfrac{f(${a}+h)-f(${a})}{h}\\). Valeur ?`,
      `\\(${correctStr}\\)`,
      [`\\(${frac(1, a*a)}\\)`, `\\(${frac(-1, a)}\\)`, `\\(${a*a}\\)`],
      3,
      EXPL(`Réduire au même dénominateur, factoriser \\(h\\).`,
        `\\(\\dfrac{1}{${a}+h}-\\dfrac{1}{${a}}=\\dfrac{-h}{${a}(${a}+h)}\\), divisé par \\(h\\) : \\(\\dfrac{-1}{${a}(${a}+h)}\\to\\dfrac{-1}{${a*a}}\\).`,
        `Ne pas oublier le signe : la différence est négative.`));
  }
  const a = pick([4,9,16,25]);
  const sqrta = Math.sqrt(a);
  const correctStr = frac(1, 2*sqrta);
  return QCM(
    `\\(f(x)=\\sqrt{x}\\), \\(a=${a}\\). \\(f'(${a})=\\lim\\limits_{h\\to 0}\\dfrac{f(${a}+h)-f(${a})}{h}\\). Valeur ?`,
    `\\(${correctStr}\\)`,
    [`\\(${frac(1, sqrta)}\\)`, `\\(${frac(-1, 2*sqrta)}\\)`, `\\(${sqrta}\\)`],
    3,
    EXPL(`Multiplier par l'expression conjuguée.`,
      `\\(\\sqrt{${a}+h}-\\sqrt{${a}}=\\dfrac{h}{\\sqrt{${a}+h}+\\sqrt{${a}}}\\). Quotient : \\(\\dfrac{1}{\\sqrt{${a}+h}+\\sqrt{${a}}}\\to\\dfrac{1}{2\\sqrt{${a}}}\\).`,
      `Ne pas oublier le facteur 2 au dénominateur.`));
};

GEN.tangente = () => {
  const a=nz(-4,4), b=nz(-6,6), x0=nz(-3,3);
  const f = polyStr([[1,'x^2'],[a,'x'],[b,'']]);
  const m = 2*x0 + a;
  const p = -x0*x0 + b;
  return QCM(
    `\\(f(x)=${f}\\). Tangente au point d'abscisse \\(${x0}\\) ?`,
    `\\(${lineq(m,p)}\\)`,
    [`\\(${lineq(m,-p)}\\)`, `\\(${lineq(-m,p)}\\)`, `\\(${lineq(m,p+x0)}\\)`, `\\(${lineq(m+1,p)}\\)`],
    2,
    EXPL(`\\(y=f'(x_0)(x-x_0)+f(x_0)\\).`,
      `\\(f'(${x0})=${m}\\), \\(f(${x0})=${x0*x0+a*x0+b}\\), \\(y=${lineq(m,p)}\\).`,
      `Ne pas oublier l'ordonnée à l'origine.`));
};

GEN.deriveePoly = () => {
  const a=nz(-4,4), b=nz(-4,4), c=nz(-5,5), d=nz(-6,6);
  const f  = polyStr([[a,'x^3'],[b,'x^2'],[c,'x'],[d,'']]);
  const df = polyStr([[3*a,'x^2'],[2*b,'x'],[c,'']]);
  return QCM(`Dériver \\(f(x)=${f}\\).`, `\\(f'(x)=${df}\\)`,
    [`\\(f'(x)=${polyStr([[3*a,'x^2'],[b,'x'],[c,'']])}\\)`,
     `\\(f'(x)=${polyStr([[3*a,'x^3'],[2*b,'x^2'],[c,'x']])}\\)`,
     `\\(f'(x)=${polyStr([[a,'x^2'],[b,'x'],[c,'']])}\\)`],
    2,
    EXPL(`\\((x^n)'=nx^{n-1}\\) ; constante \\(\\to 0\\).`,
      `\\(f'(x)=${3*a}x^2${sg(2*b)}x${sg(c)}\\).`,
      `Multiplier par l'exposant, baisser l'exposant.`));
};

GEN.deriveeUsuelle = () => {
  const k = R(1,7);
  const a = nz(-4,4), b = nz(-5,5);
  const lin = polyStr([[a,'x'],[b,'']]);
  if(k===1){
    return QCM(`Dériver \\(f(x)=\\sqrt{${lin}}\\).`,
      `\\(f'(x)=\\dfrac{${a}}{2\\sqrt{${lin}}}\\)`,
      [`\\(f'(x)=\\dfrac{${a}}{\\sqrt{${lin}}}\\)`,
       `\\(f'(x)=\\dfrac{${-a}}{2\\sqrt{${lin}}}\\)`,
       `\\(f'(x)=\\dfrac{${2*a}}{\\sqrt{${lin}}}\\)`],
      3,
      EXPL(`\\((\\sqrt u)'=\\dfrac{u'}{2\\sqrt u}\\).`,
        `\\(u=${lin}\\), \\(u'=${a}\\), \\(f'(x)=\\dfrac{${a}}{2\\sqrt{${lin}}}\\).`,
        `Facteur 2 au dénominateur.`));
  }
  if(k===2){
    return QCM(`Dériver \\(f(x)=\\sin(${lin})\\).`,
      `\\(f'(x)=${cf(a)}\\cos(${lin})\\)`,
      [`\\(f'(x)=${cf(-a)}\\cos(${lin})\\)`,
       `\\(f'(x)=${cf(a)}\\sin(${lin})\\)`,
       `\\(f'(x)=${cf(-a)}\\sin(${lin})\\)`],
      2,
      EXPL(`\\((\\sin u)'=u'\\cos u\\).`,
        `\\(f'(x)=${cf(a)}\\cos(${lin})\\).`,
        `Ne pas oublier \\(u'\\).`));
  }
  if(k===3){
    return QCM(`Dériver \\(f(x)=\\cos(${lin})\\).`,
      `\\(f'(x)=${cf(-a)}\\sin(${lin})\\)`,
      [`\\(f'(x)=${cf(a)}\\sin(${lin})\\)`,
       `\\(f'(x)=${cf(-a)}\\cos(${lin})\\)`,
       `\\(f'(x)=${cf(a)}\\cos(${lin})\\)`],
      2,
      EXPL(`\\((\\cos u)'=-u'\\sin u\\).`,
        `\\(f'(x)=${cf(-a)}\\sin(${lin})\\).`,
        `Signe moins obligatoire.`));
  }
  if(k===4){
    return QCM(`Dériver \\(f(x)=\\dfrac{1}{${lin}}\\).`,
      `\\(f'(x)=\\dfrac{${-a}}{(${lin})^2}\\)`,
      [`\\(f'(x)=\\dfrac{${a}}{(${lin})^2}\\)`,
       `\\(f'(x)=\\dfrac{${-a}}{${lin}}\\)`,
       `\\(f'(x)=\\dfrac{1}{${lin}}\\)`],
      3,
      EXPL(`\\((1/u)'=-u'/u^2\\).`,
        `\\(f'(x)=\\dfrac{${-a}}{(${lin})^2}\\).`,
        `Signe moins + carré.`));
  }
  if(k===5){
    const n = R(2,4);
    return QCM(`Dériver \\(f(x)=(${lin})^{${n}}\\).`,
      `\\(f'(x)=${n*a}(${lin})^{${n-1}}\\)`,
      [`\\(f'(x)=${n*a}(${lin})^{${n}}\\)`,
       `\\(f'(x)=${a}(${lin})^{${n-1}}\\)`,
       `\\(f'(x)=${n*a}(${lin})^{${n-2}}\\)`],
      3,
      EXPL(`\\((u^n)'=nu'u^{n-1}\\).`,
        `\\(f'(x)=${n*a}(${lin})^{${n-1}}\\).`,
        `Ne pas oublier \\(u'\\).`));
  }
  if(k===6){
    return QCM(`Dériver \\(f(x)=x\\sin(x)\\).`,
      `\\(f'(x)=\\sin(x)+x\\cos(x)\\)`,
      [`\\(f'(x)=x\\cos(x)\\)`,
       `\\(f'(x)=\\sin(x)-x\\cos(x)\\)`,
       `\\(f'(x)=\\cos(x)\\)`],
      3,
      EXPL(`\\((uv)'=u'v+uv'\\).`,
        `\\(f'(x)=\\sin x+x\\cos x\\).`,
        `Deux termes obligatoires.`));
  }
  const c = nz(-4,4);
  return QCM(`Dériver \\(f(x)=\\dfrac{x}{x${sg(c)}}\\).`,
    `\\(f'(x)=\\dfrac{${c}}{(x${sg(c)})^2}\\)`,
    [`\\(f'(x)=\\dfrac{${-c}}{(x${sg(c)})^2}\\)`,
     `\\(f'(x)=\\dfrac{${c}}{(x${sg(c)})^3}\\)`,
     `\\(f'(x)=\\dfrac{${c}}{x${sg(c)}}\\)`],
    3,
    EXPL(`\\((u/v)'=(u'v-uv')/v^2\\).`,
      `\\(f'(x)=\\dfrac{${c}}{(x${sg(c)})^2}\\).`,
      `Signe et carré au dénominateur.`));
};

GEN.signExpr = () => {
  const a = R(-3,1), b = a + R(1,4);
  const f = `(x${sg(-a)})(x${sg(-b)})`;
  return QCM(`Soit \\(f(x)=${f}\\). Strictement négative sur ?`,
    `\\(]${a}\\,;\\,${b}[\\)`,
    [`\\(]-\\infty\\,;\\,${a}[\\cup]${b}\\,;\\,+\\infty[\\)`,
     `\\([${a}\\,;\\,${b}]\\)`,
     `\\(]${a}\\,;\\,+\\infty[\\)`],
    1,
    EXPL(`Produit négatif \\(\\iff\\) signes contraires.`,
      `Entre ${a} et ${b} : négatif.`,
      `Strictement négatif \\(\\Rightarrow\\) crochets ouverts.`));
};

GEN.varExpr = () => {
  const b = nz(-4,4), c = nz(-6,6);
  const f = polyStr([[1,'x^2'],[-2*b,'x'],[c,'']]);
  const minv = c - b*b;
  if(Math.random()<0.5){
    return QCM(`\\(f(x)=${f}\\). Minimum de \\(f\\) ?`,
      `\\(${minv}\\)`, [`\\(${-minv}\\)`, `\\(${c+b*b}\\)`, `\\(${b}\\)`, `\\(${c}\\)`],
      2,
      EXPL(`Forme canonique : \\((x-b)^2+(c-b^2)\\).`,
        `Minimum \\(=${minv}\\) en \\(x=${b}\\).`,
        `\\(b\\) = abscisse ; \\(${minv}\\) = ordonnée.`));
  }
  return QCM(`\\(f(x)=${f}\\). Décroissante sur ?`,
    `\\(]-\\infty\\,;\\,${b}]\\)`,
    [`\\([${b}\\,;\\,+\\infty[\\)`, `\\(]-\\infty\\,;\\,${minv}]\\)`, `\\([${minv}\\,;\\,+\\infty[\\)`, `\\(\\mathbb{R}\\)`],
    2,
    EXPL(`\\(f'(x)=2(x-b)\\).`,
      `Décroissante sur \\(]-\\infty\\,;\\,${b}]\\).`,
      `C'est \\(b\\) qui sépare, pas \\(${minv}\\).`));
};

GEN.readSignTable = () => {
  const a = R(-4,1), b = a + R(1,4);
  const html = tableHTML(
    ['\\(x\\)','\\(-\\infty\\)','',`\\(${a}\\)`,'',`\\(${b}\\)`,'','\\(+\\infty\\)'],
    [
      [`\\(${xMinus(a)}\\)`,'','\\(-\\)','\\(0\\)','\\(+\\)','','\\(+\\)',''],
      [`\\(${xMinus(b)}\\)`,'','\\(-\\)','','\\(-\\)','\\(0\\)','\\(+\\)',''],
      ['\\(f(x)\\)','','\\(+\\)','\\(0\\)','\\(-\\)','\\(0\\)','\\(+\\)','']
    ]
  );
  return QCM(
    `Tableau de signes :<br>${html} \\(f(x)\\) strictement négative sur ?`,
    `\\(]${a}\\,;\\,${b}[\\)`,
    [`\\(]-\\infty\\,;\\,${a}[\\cup]${b}\\,;\\,+\\infty[\\)`,
     `\\(]-\\infty\\,;\\,${b}[\\)`,
     `\\([${a}\\,;\\,${b}]\\)`],
    1,
    EXPL(`Lire la ligne \\(f(x)\\).`,
      `\\(-\\) entre ${a} et ${b}.`,
      `Crochets ouverts pour strictement négatif.`));
};

GEN.readVarTable = () => {
  const a = R(-3,0), b = a + R(2,4);
  const maxi = R(3,8), mini = -R(2,7);
  const html = tableHTML(
    ['\\(x\\)','\\(-\\infty\\)','',`\\(${a}\\)`,'',`\\(${b}\\)`,'','\\(+\\infty\\)'],
    [
      ['\\(f\'(x)\\)','','\\(+\\)','\\(0\\)','\\(-\\)','\\(0\\)','\\(+\\)',''],
      ['\\(f\\)','','\\(\\nearrow\\)',`\\(${maxi}\\)`,'\\(\\searrow\\)',`\\(${mini}\\)`,'\\(\\nearrow\\)','']
    ]
  );
  if(Math.random()<0.5){
    return QCM(`Tableau de variations :<br>${html} Maximum de \\(f\\) ?`,
      `\\(${maxi}\\)`, [`\\(${mini}\\)`, `\\(${a}\\)`, `\\(${b}\\)`],
      1,
      EXPL(`Maximum = plus grande valeur de \\(f\\).`,
        `Max = ${maxi}.`,
        `Ne pas répondre une abscisse.`));
  }
  return QCM(`Tableau de variations :<br>${html} \\(f\\) croissante sur ?`,
    `\\(]-\\infty\\,;\\,${a}]\\ \\text{et}\\ [${b}\\,;\\,+\\infty[\\)`,
    [`\\([${a}\\,;\\,${b}]\\)`, `\\(]-\\infty\\,;\\,${b}]\\)`, `\\([${a}\\,;\\,${b}]\\ \\text{et}\\ [${b}\\,;\\,+\\infty[\\)`, `\\(\\mathbb{R}\\)`],
    1,
    EXPL(`Croissante = flèche \\(\\nearrow\\).`,
      `Deux intervalles.`,
      `Pas \\(\\mathbb{R}\\) entier.`));
};

GEN.curveSign = () => {
  let a = R(-3,1), b;
  do { b = a + R(2,5); } while(b>4);
  const fn = x => (x-a)*(x-b);
  const svg = curveSVG(fn, -5, 5, -8, 10);
  return QCM(
    `Courbe de \\(f\\) :<br>${svg} \\(f(x)\\leqslant 0\\) sur ?`,
    `\\([${a}\\,;\\,${b}]\\)`,
    [`\\(]${a}\\,;\\,${b}[\\)`,
     `\\(]-\\infty\\,;\\,${a}]\\cup[${b}\\,;\\,+\\infty[\\)`,
     `\\([${b}\\,;\\,${a}]\\)`],
    1,
    EXPL(`\\(f\\leqslant 0\\) = sous l'axe des abscisses.`,
      `Entre ${a} et ${b}, bornes fermées.`,
      `Lire les abscisses.`));
};

GEN.suiteArith = () => {
  const u0 = nz(-8,8), r = nz(-5,5), n = R(3,12);
  return QCM(
    `\\((u_n)\\) arithmétique, \\(u_0=${u0}\\), \\(r=${r}\\). \\(u_{${n}}\\) ?`,
    `\\(${u0 + n*r}\\)`, [`\\(${n*r}\\)`, `\\(${u0 - n*r}\\)`, `\\(${u0 + n + r}\\)`],
    1,
    EXPL(`\\(u_n=u_0+n r\\).`,
      `\\(u_{${n}}=${u0+n*r}\\).`,
      `Ne pas oublier \\(u_0\\).`));
};

GEN.suiteArith2 = () => {
  const u0 = nz(-6,6), r = nz(-4,4);
  const p = R(1,4), q = p + R(2,5);
  const up = u0 + p*r, uq = u0 + q*r;
  return QCM(
    `\\((u_n)\\) arithmétique, \\(u_{${p}}=${up}\\), \\(u_{${q}}=${uq}\\). Raison ?`,
    `\\(${r}\\)`, [`\\(${-r}\\)`, `\\(${uq-up}\\)`, `\\(${r+1}\\)`],
    2,
    EXPL(`\\(r=(u_q-u_p)/(q-p)\\).`,
      `\\(r=${r}\\).`,
      `Diviser par \\(q-p\\).`));
};

GEN.suiteGeo = () => {
  const u0 = pick([1,2,3,4,5,-2,-3]);
  const q  = pick([2,3,-2]);
  const n  = R(2,4);
  return QCM(
    `\\((u_n)\\) géométrique, \\(u_0=${u0}\\), \\(q=${q}\\). \\(u_{${n}}\\) ?`,
    `\\(${u0*Math.pow(q,n)}\\)`, [`\\(${u0*n*q}\\)`, `\\(${u0*Math.pow(q,n-1)}\\)`, `\\(${u0*Math.pow(q,n+1)}\\)`],
    1,
    EXPL(`\\(u_n=u_0\\times q^n\\).`,
      `\\(u_{${n}}=${u0*Math.pow(q,n)}\\).`,
      `Rang = exposant.`));
};

GEN.suiteGeo2 = () => {
  const u1 = pick([2,3,4,5]), q = pick([2,3]);
  const u3 = u1*q*q;
  return QCM(
    `\\((u_n)\\) géométrique, \\(q>0\\), \\(u_1=${u1}\\), \\(u_3=${u3}\\). Raison ?`,
    `\\(${q}\\)`, [`\\(${-q}\\)`, `\\(${u3-u1}\\)`, `\\(${q*q}\\)`],
    2,
    EXPL(`\\(u_3=u_1\\times q^2\\).`,
      `\\(q^2=${q*q}\\Rightarrow q=${q}\\).`,
      `Prendre la racine, \\(q>0\\).`));
};

GEN.pourcentage = () => {
  const k = R(1,3);
  if(k===1){
    const Vi = pick([120,200,240,350,480,600,850]);
    const t  = pick([5,10,15,20,25,30]);
    const Vf = Vi*(1-t/100);
    return QCM(`Article \\(${Vi}\\) €, baisse \\(${t}\\,\\%\\). Nouveau prix ?`,
      `\\(${Vf}\\) €`, [`\\(${Vi*(1+t/100)}\\) €`, `\\(${Vi-t}\\) €`, `\\(${Vi*(1-t/1000)}\\) €`],
      1,
      EXPL(`\\(V_f=(1-\\dfrac{t}{100})V_i\\).`,
        `\\(V_f=${Vf}\\) €.`,
        `Multiplier, ne pas soustraire.`));
  }
  if(k===2){
    const Vi = pick([200,400,500,800,1000]);
    const t  = pick([5,10,20,25,50]);
    const Vf = Vi*(1-t/100);
    return QCM(`\\(${Vi}\\) €, devient \\(${Vf}\\) €. Taux de baisse ?`,
      `\\(${t}\\)`, [`\\(${100-t}\\)`, `\\(${t*2}\\)`, `\\(${t/2}\\)`],
      1,
      EXPL(`\\(t=100(1-V_f/V_i)\\).`,
        `\\(t=${t}\\,\\%\\).`,
        `Porte sur le prix initial.`));
  }
  const t  = pick([10,20,25,50]);
  const Vi = pick([200,400,500,800]);
  const Vf = Vi*(1-t/100);
  return QCM(`Baisse \\(${t}\\,\\%\\), vaut \\(${Vf}\\) €. Prix initial ?`,
    `\\(${Vi}\\) €`, [`\\(${Math.round(Vf*(1+t/100))}\\) €`, `\\(${Vf+t}\\) €`, `\\(${Math.round(Vf/(1+t/100))}\\) €`],
    1,
    EXPL(`\\(V_i=\\dfrac{V_f}{1-t/100}\\).`,
      `\\(V_i=${Vi}\\) €.`,
      `Diviser, ne pas remultiplier.`));
};

GEN.trigoAssoc = () => {
  const cases = [
    ['\\cos(\\pi-x)','-\\cos x'],
    ['\\sin(\\pi-x)','\\sin x'],
    ['\\cos(\\pi+x)','-\\cos x'],
    ['\\sin(\\pi+x)','-\\sin x'],
    ['\\cos\\left(\\dfrac{\\pi}{2}-x\\right)','\\sin x'],
    ['\\sin\\left(\\dfrac{\\pi}{2}-x\\right)','\\cos x'],
    ['\\cos\\left(\\dfrac{\\pi}{2}+x\\right)','-\\sin x'],
    ['\\sin\\left(\\dfrac{\\pi}{2}+x\\right)','\\cos x'],
    ['\\cos(-x)','\\cos x'],
    ['\\sin(-x)','-\\sin x']
  ];
  const [e, rep] = pick(cases);
  const pool = ['\\cos x','-\\cos x','\\sin x','-\\sin x'].filter(s => s!==rep);
  return QCM(`Simplifier \\(${e}\\).`, M(rep), shuffle(pool).slice(0,3).map(x => M(x)),
    2,
    EXPL(`Angles associés sur le cercle.`,
      `\\(${e}=${rep}\\).`,
      `Dessiner le cercle.`));
};

GEN.eqTrigo = () => {
  const cases = [
    { q:'\\cos x=\\dfrac{1}{2}',
      s:'\\left\\{\\dfrac{\\pi}{3}\\,;\\,\\dfrac{5\\pi}{3}\\right\\}',
      w:['\\left\\{\\dfrac{\\pi}{6}\\,;\\,\\dfrac{5\\pi}{6}\\right\\}',
         '\\left\\{\\dfrac{\\pi}{3}\\,;\\,\\dfrac{2\\pi}{3}\\right\\}',
         '\\left\\{\\dfrac{2\\pi}{3}\\,;\\,\\dfrac{4\\pi}{3}\\right\\}'] },
    { q:'\\sin x=\\dfrac{\\sqrt{2}}{2}',
      s:'\\left\\{\\dfrac{\\pi}{4}\\,;\\,\\dfrac{3\\pi}{4}\\right\\}',
      w:['\\left\\{\\dfrac{\\pi}{4}\\,;\\,\\dfrac{7\\pi}{4}\\right\\}',
         '\\left\\{\\dfrac{\\pi}{6}\\,;\\,\\dfrac{5\\pi}{6}\\right\\}',
         '\\left\\{\\dfrac{\\pi}{3}\\,;\\,\\dfrac{2\\pi}{3}\\right\\}'] },
    { q:'\\cos x=-\\dfrac{1}{2}',
      s:'\\left\\{\\dfrac{2\\pi}{3}\\,;\\,\\dfrac{4\\pi}{3}\\right\\}',
      w:['\\left\\{\\dfrac{\\pi}{3}\\,;\\,\\dfrac{5\\pi}{3}\\right\\}',
         '\\left\\{\\dfrac{\\pi}{6}\\,;\\,\\dfrac{11\\pi}{6}\\right\\}',
         '\\left\\{\\dfrac{5\\pi}{6}\\,;\\,\\dfrac{7\\pi}{6}\\right\\}'] },
    { q:'\\sin x=\\dfrac{1}{2}',
      s:'\\left\\{\\dfrac{\\pi}{6}\\,;\\,\\dfrac{5\\pi}{6}\\right\\}',
      w:['\\left\\{\\dfrac{\\pi}{3}\\,;\\,\\dfrac{2\\pi}{3}\\right\\}',
         '\\left\\{\\dfrac{\\pi}{6}\\,;\\,\\dfrac{11\\pi}{6}\\right\\}',
         '\\left\\{\\dfrac{\\pi}{4}\\,;\\,\\dfrac{3\\pi}{4}\\right\\}'] }
  ];
  const c = pick(cases);
  const TA = {
    "\\cos x=\\dfrac{1}{2}":
      { fn:'cos', b:0.5, bTxt:'x = 0,5', a1:60, a1Txt:'π/3', a2:300, a2Txt:'5π/3', sum:'Solutions : x = π/3 ou x = 5π/3' },
    "\\sin x=\\dfrac{\\sqrt{2}}{2}":
      { fn:'sin', b:0.71, bTxt:'y ≈ 0,71', a1:45, a1Txt:'π/4', a2:135, a2Txt:'3π/4', sum:'Solutions : x = π/4 ou x = 3π/4' },
    "\\cos x=-\\dfrac{1}{2}":
      { fn:'cos', b:-0.5, bTxt:'x = −0,5', a1:120, a1Txt:'2π/3', a2:240, a2Txt:'4π/3', sum:'Solutions : x = 2π/3 ou x = 4π/3' },
    "\\sin x=\\dfrac{1}{2}":
      { fn:'sin', b:0.5, bTxt:'y = 0,5', a1:30, a1Txt:'π/6', a2:150, a2Txt:'5π/6', sum:'Solutions : x = π/6 ou x = 5π/6' }
  };
  const qc = QCM(`Résoudre sur \\([0\\,;\\,2\\pi]\\) : \\(${c.q}\\).`, M(c.s), c.w.map(x => M(x)),
    3,
    EXPL(`Deux solutions sur le cercle.`,
      `\\(${c.s}\\).`,
      `Ne pas oublier la 2ᵉ solution.`));
  if (TA[c.q]) qc.trigAnim = TA[c.q];
  return qc;
};

GEN.produitScalaire = () => {
  const x1=nz(-5,5), y1=nz(-5,5), x2=nz(-5,5), y2=nz(-5,5);
  const ps = x1*x2 + y1*y2;
  return QCM(
    `\\(\\vec{u}(${x1}\\,;\\,${y1})\\), \\(\\vec{v}(${x2}\\,;\\,${y2})\\). \\(\\vec{u}\\cdot\\vec{v}\\) ?`,
    `\\(${ps}\\)`, [`\\(${x1*y2 + x2*y1}\\)`, `\\(${x1*x2 - y1*y2}\\)`, `\\(${-ps}\\)`],
    2,
    EXPL(`\\(\\vec{u}\\cdot\\vec{v}=xx'+yy'\\).`,
      `\\(=${ps}\\).`,
      `Ne pas croiser.`));
};

GEN.complexeAlg = () => {
  const a=nz(-4,4), b=nz(-4,4), c=nz(-4,4), d=nz(-4,4);
  const re = a*c - b*d, im = a*d + b*c;
  return QCM(
    `Forme algébrique de \\((${cz(a,b)})(${cz(c,d)})\\).`,
    `\\(${cz(re,im)}\\)`,
    [`\\(${cz(-re,im)}\\)`, `\\(${cz(re,-im)}\\)`, `\\(${cz(a*c + b*d, a*d + b*c)}\\)`],
    2,
    EXPL(`\\((a+bi)(c+di)=(ac-bd)+(ad+bc)i\\).`,
      `\\(=${cz(re,im)}\\).`,
      `\\(i^2=-1\\).`));
};

GEN.complexeTrigo = () => {
  const cases = [
    { z:'1+i',            m:'\\sqrt{2}', arg:'\\dfrac{\\pi}{4}' },
    { z:'1-i',            m:'\\sqrt{2}', arg:'-\\dfrac{\\pi}{4}' },
    { z:'-1+i',           m:'\\sqrt{2}', arg:'\\dfrac{3\\pi}{4}' },
    { z:'-1-i',           m:'\\sqrt{2}', arg:'-\\dfrac{3\\pi}{4}' },
    { z:'i',              m:'1',         arg:'\\dfrac{\\pi}{2}' },
    { z:'-2',             m:'2',         arg:'\\pi' },
    { z:'\\sqrt{3}+i',    m:'2',         arg:'\\dfrac{\\pi}{6}' },
    { z:'1+i\\sqrt{3}',   m:'2',         arg:'\\dfrac{\\pi}{3}' }
  ];
  const c = pick(cases);
  if(Math.random()<0.5){
    return QCM(`Module de \\(z=${c.z}\\) ?`, M(c.m),
      ['2','1','\\sqrt{3}','4','\\dfrac{1}{2}'].filter(x=>x!==c.m).map(x => M(x)),
      3,
      EXPL(`\\(|z|=\\sqrt{a^2+b^2}\\).`,
        `\\(|${c.z}|=${c.m}\\).`,
        `Toujours positif.`));
  }
  return QCM(`Argument de \\(z=${c.z}\\) ?`, M(c.arg),
    ['\\dfrac{\\pi}{6}','\\dfrac{\\pi}{4}','\\dfrac{\\pi}{3}',
     '\\dfrac{\\pi}{2}','\\dfrac{2\\pi}{3}','\\dfrac{3\\pi}{4}','\\pi'].filter(x=>x!==c.arg).map(x => M(x)),
    3,
    EXPL(`\\(\\cos\\theta=a/|z|\\), \\(\\sin\\theta=b/|z|\\).`,
      `\\(\\arg=${c.arg}\\).`,
      `Attention au quadrant.`));
};

GEN.statTable = () => {
  const totA = pick([40,50,60]);
  const pct  = pick([0.2,0.25,0.4,0.5,0.6,0.75]);
  const a = Math.round(totA*pct);
  const b = totA - a;
  const c = R(8,30), d = R(8,30);
  const tot = a+b+c+d;
  const html = tableHTML(
    ['','\\(B\\)','\\(\\overline{B}\\)','Total'],
    [
      ['\\(A\\)', `\\(${a}\\)`, `\\(${b}\\)`, `\\(${a+b}\\)`],
      ['\\(\\overline{A}\\)', `\\(${c}\\)`, `\\(${d}\\)`, `\\(${c+d}\\)`],
      ['Total', `\\(${a+c}\\)`, `\\(${b+d}\\)`, `\\(${tot}\\)`]
    ]
  );
  if(Math.random()<0.6){
    const val = (a/totA).toFixed(2);
    return QCM(
      `Tableau croisé :<br>${html} Fréquence \\(f_{B/A}\\) ?`,
      M(val),
      [M((a/tot).toFixed(2)), M((b/totA).toFixed(2)),
       M((a/(a+c)).toFixed(2)), M(((a+b)/tot).toFixed(2))],
      2,
      EXPL(`\\(f_{B/A}=\\text{effectif}(A\\cap B)/\\text{effectif}(A)\\).`,
        `\\(=${a}/${totA}=${val}\\).`,
        `Dénominateur = total de \\(A\\).`));
  }
  return QCM(
    `Tableau croisé :<br>${html} Fréquence marginale de \\(B\\) ?`,
    M(((a+c)/tot).toFixed(2)),
    [M((a/tot).toFixed(2)), M((a/totA).toFixed(2)),
     M((b/tot).toFixed(2)), M(((a+b)/tot).toFixed(2))],
    2,
    EXPL(`\\(f(B)=\\text{effectif}(B)/\\text{effectif total}\\).`,
      `\\(=${a+c}/${tot}=${((a+c)/tot).toFixed(2)}\\).`,
      `Marginal = toute la population.`));
};

GEN.probaCond = () => {
  const pA = pick([0.2,0.25,0.4,0.5]);
  const pBA = pick([0.3,0.5,0.6,0.75]);
  const pAB = Math.round(pA*pBA*1000)/1000;
  return QCM(
    `\\(P(A)=${pA}\\), \\(P(A\\cap B)=${pAB}\\). \\(P_A(B)\\) ?`,
    M(pBA),
    [M(pAB), M(Math.round(pA/pAB*1000)/1000), M(Math.round((1-pBA)*1000)/1000)],
    2,
    EXPL(`\\(P_A(B)=\\dfrac{P(A\\cap B)}{P(A)}\\).`,
      `\\(=${pBA}\\).`,
      `\\(P_A(B)\\neq P(A\\cap B)\\).`));
};

GEN.arbreIndep = () => {
  const pA = pick([0.2,0.3,0.4,0.5,0.6]);
  const pB = pick([0.2,0.3,0.5,0.7]);
  const pAB = Math.round(pA*pB*1000)/1000;
  return QCM(
    `\\(A\\), \\(B\\) indépendants, \\(P(A)=${pA}\\), \\(P(B)=${pB}\\). \\(P(A\\cap B)\\) ?`,
    M(pAB),
    [M(Math.round((pA+pB)*1000)/1000), M(Math.round(pA*pB*2000)/1000),
     M(Math.round(Math.abs(pA-pB)*1000)/1000)],
    2,
    EXPL(`Indépendants \\(\\iff P(A\\cap B)=P(A)P(B)\\).`,
      `\\(=${pAB}\\).`,
      `Multiplier, ne pas additionner.`));
};

GEN.bernoulli = () => {
  const n = pick([2,3]);
  const p = pick([0.2,0.4,0.5,0.6]);
  const k = R(1,n);
  const prob = binom(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k);
  return QCM(
    `\\(n=${n}\\) épreuves Bernoulli indép., \\(p=${p}\\). \\(P(X=${k})\\) ?`,
    M(Math.round(prob*10000)/10000),
    [M(Math.round(Math.pow(p,k)*10000)/10000),
     M(Math.round(binom(n,k)*Math.pow(p,k)*10000)/10000),
     M(Math.round(prob*2*10000)/10000)],
    3,
    EXPL(`\\(P(X=k)=\\binom{n}{k}p^k(1-p)^{n-k}\\).`,
      `\\(=${Math.round(prob*10000)/10000}\\).`,
      `Coefficient binomial + exposant \\(n-k\\).`));
};

GEN.varAleat = () => {
  const p1 = pick([0.1,0.2,0.3]);
  const p2 = pick([0.3,0.4,0.5]);
  const p3 = Math.round((1-p1-p2)*100)/100;
  if(p3<=0) return GEN.varAleat();
  const E = 1*p1 + 2*p2 + 5*p3;
  const html = tableHTML(
    ['\\(x_i\\)','\\(1\\)','\\(2\\)','\\(5\\)'],
    [['\\(P(X=x_i)\\)', `\\(${p1}\\)`, `\\(${p2}\\)`, `\\(${p3}\\)`]]
  );
  return QCM(`Loi de \\(X\\) :<br>${html} \\(E(X)\\) ?`,
    M(Math.round(E*100)/100),
    [M(Math.round((p1+p2+p3)*100)/100),
     M(Math.round((1*p1+2*p2+5*p3+p1)*100)/100),
     M(Math.round(((1+2+5)/3)*100)/100)],
    2,
    EXPL(`\\(E(X)=\\sum x_i P(X=x_i)\\).`,
      `\\(E(X)=${Math.round(E*100)/100}\\).`,
      `Pondérer par les probabilités.`));
};

GEN.primitivePoly = () => {
  const a=nz(-3,3), b=nz(-3,3), c=nz(-4,4);
  const f  = polyStr([[3*a,'x^2'],[2*b,'x'],[c,'']]);
  const F  = polyStr([[a,'x^3'],[b,'x^2'],[c,'x']]);
  return QCM(`Primitive de \\(f(x)=${f}\\) sur \\(\\mathbb{R}\\) ?`,
    `\\(F(x)=${F}+C\\)`,
    [`\\(F(x)=${polyStr([[3*a,'x^3'],[2*b,'x^2'],[c,'x']])}+C\\)`,
     `\\(F(x)=${polyStr([[a,'x^3'],[b,'x^2'],[c,'']])}+C\\)`,
     `\\(F(x)=${f}+C\\)`],
    2,
    EXPL(`\\(x^n\\to \\dfrac{x^{n+1}}{n+1}\\) ; constante \\(+C\\).`,
      `\\(F(x)=${F}+C\\).`,
      `Diviser par le nouvel exposant + \\(+C\\).`));
};

GEN.euler = () => {
  const a  = pick([2,3,4]);
  const b  = nz(-3,3);
  const h  = pick([0.5,0.25]);
  const x0 = pick([0,1]);
  const y0 = pick([0,1,2]);
  const n  = 2;
  let x = x0, y = y0;
  const steps = [];
  for(let i=0;i<n;i++){
    const slope = a*x + b;
    steps.push({x, y, slope, ynew: y + h*slope});
    y = y + h*slope;
    x = x + h;
  }
  const xf = x0 + n*h;
  return QCM(
    `\\(f'(x)=${polyStr([[a,'x'],[b,'']])}\\), \\(f(${x0})=${y0}\\). Euler \\(h=${h}\\). \\(f(${xf})\\approx ?\\)`,
    M(Math.round(y*1000)/1000),
    [M(Math.round((y0 + a*x0 + b)*1000)/1000),
     M(Math.round((y + h*(a*x + b))*1000)/1000),
     M(Math.round((y0 + xf*(a*x0+b))*1000)/1000)],
    4,
    EXPL(`\\(y_{n+1}=y_n+h f'(x_n)\\), \\(x_{n+1}=x_n+h\\).`,
      `Pas 1 : pente \\(=${steps[0].slope}\\), \\(y_1=${steps[0].ynew}\\).<br>Pas 2 : pente \\(=${steps[1].slope}\\), \\(y_2=${Math.round(y*1000)/1000}\\).`,
      `Mettre à jour \\(x\\) à chaque pas.`));
};

GEN.degre3 = () => {
  const r = nz(-3,3), p = nz(-3,3), q = nz(-4,4);
  const A = p - r, B = q - p*r, C = -r*q;
  const f = polyStr([[1,'x^3'],[A,'x^2'],[B,'x'],[C,'']]);
  return QCM(
    `\\(f(x)=${f}\\), \\(f(${r})=0\\). Factorisation ?`,
    `\\((x${sg(-r)})(x^2${sg(p)}x${sg(q)})\\)`,
    [`\\((x${sg(r)})(x^2${sg(p)}x${sg(q)})\\)`,
     `\\((x${sg(-r)})(x^2${sg(-p)}x${sg(q)})\\)`,
     `\\((x${sg(-r)})(x^2${sg(p)}x${sg(-q)})\\)`],
    4,
    EXPL(`\\(f(r)=0\\Rightarrow f(x)=(x-r)Q(x)\\).`,
      `Identification : \\(Q(x)=x^2${sg(p)}x${sg(q)}\\).`,
      `Facteur \\((x-r)\\), pas \\((x+r)\\).`));
};

