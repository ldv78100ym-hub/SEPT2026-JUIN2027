/* ============================================================
   4. BANQUES DE PROPOSITIONS
   ============================================================ */
function P(texte, correct, justif){ return { texte: texte, correct: correct, justif: justif }; }

const PYTHON_QUESTIONS = [
  () => { const n = randInt(5, 10), k = randInt(1, n - 1);
    const code = ["def f(n, k):","    fact = 1","    for i in range(2, n + 1):","        fact *= i","    fact_k = 1","    for i in range(2, k + 1):","        fact_k *= i","    fact_nk = 1","    for i in range(2, n - k + 1):","        fact_nk *= i","    return fact // (fact_k * fact_nk)"].join('\n');
    let fn=1;for(let i=2;i<=n;i++)fn*=i;let fk=1;for(let i=2;i<=k;i++)fk*=i;let fnk=1;for(let i=2;i<=n-k;i++)fnk*=i;const res=fn/(fk*fnk);
    const isTrue=Math.random()>0.5;
    return P(`<p>🫖 <em>${pyFlavor()}</em></p><pre><code>${code}</code></pre><p>${isTrue?`$f(${n}, ${k})$ renvoie $${res}$`:`$f(${n}, ${k})$ renvoie $${res+randInt(1,5)}$`}</p>`,isTrue,`Coefficient binomial $\\binom{${n}}{${k}} = ${res}$. Baxter a vérifié trois fois, ce qui est déjà beaucoup.`); },
  () => { const n = randInt(6, 12), k = randInt(1, n - 1);
    const code = ["def f(n, k):","    if k > n - k:","        k = n - k","    res = 1","    for i in range(k):","        res = res * (n - i) // (i + 1)","    return res"].join('\n');
    let kk=Math.min(k,n-k);let res=1;for(let i=0;i<kk;i++)res=res*(n-i)/(i+1);res=Math.round(res);
    const isTrue=Math.random()>0.5;
    return P(`<p>🫖 <em>${pyFlavor()}</em></p><pre><code>${code}</code></pre><p>${isTrue?`$f(${n}, ${k})$ renvoie $${res}$`:`$f(${n}, ${k})$ renvoie $${res-randInt(1,5)}$`}</p>`,isTrue,`Baxter, pour une fois, a utilisé la symétrie : $\\binom{${n}}{${k}} = ${res}$.`); },
  () => { const n = randInt(4, 7);
    const code = ["def f(n):","    L = [1]","    for i in range(1, n + 1):","        L.append(L[-1] * (n - i + 1) // i)","    return L"].join('\n');
    const res=[1];let curr=1;for(let i=1;i<=n;i++){curr=curr*(n-i+1)/i;res.push(Math.round(curr));}
    const isTrue=Math.random()>0.5;
    if(isTrue) return P(`<p>🫖 <em>${pyFlavor()} Cette liste, paraît-il, ressemble à un triangle de Pascal que le majordome aurait trébuché dessus.</em></p><pre><code>${code}</code></pre><p>$f(${n})$ renvoie $[${res.join(', ')}]$</p>`,true,`Ligne $${n}$ du triangle de Pascal. Baxter soupçonne une conspiration de chiffres.`);
    const resF=res.slice();resF[randInt(1,n-1)]+=randInt(1,3);
    return P(`<p>🫖 <em>${pyFlavor()}</em></p><pre><code>${code}</code></pre><p>$f(${n})$ renvoie $[${resF.join(', ')}]$</p>`,false,`Ligne $${n}$ du triangle de Pascal : $[${res.join(', ')}]$. Il y a du laisser-aller.`); },
  () => { const n = randInt(3, 6), k = randInt(1, n - 1); const p = [0.2,0.3,0.4,0.5,0.6,0.7][randInt(0,5)];
    const code = ["def f(n, k, p):","    q = 1 - p","    c = 1","    for i in range(k):","        c = c * (n - i) // (i + 1)","    return c * (p ** k) * (q ** (n - k))"].join('\n');
    const isTrue=Math.random()>0.5;
    return P(`<p>🫖 <em>${pyFlavor()}</em></p><pre><code>${code}</code></pre><p>${isTrue?`$f(${n}, ${k}, ${p})$ calcule $P(X=${k})$ pour $n=${n}$ et $p=${p}$`:`$f(${n}, ${k}, ${p})$ calcule $P(X=${k})$ pour $n=${n}$ et $p=${1-p}$`}</p>`,isTrue,`Formule de $P(X=k)$ : $\\binom{n}{k} p^k (1-p)^{n-k}$. Pas de biscuits dedans.`); },
  () => { const n = randInt(3, 5); const p = 0.5;
    const code = ["def f(n, p):","    q = 1 - p","    L = []","    c = 1","    for k in range(n + 1):","        L.append(c * (p ** k) * (q ** (n - k)))","        c = c * (n - k) // (k + 1)","    return L"].join('\n');
    const isTrue=Math.random()>0.5;
    return P(`<p>🫖 <em>${pyFlavor()}</em></p><pre><code>${code}</code></pre><p>${isTrue?`$f(${n}, ${p})$ renvoie la liste $P(X=0), \\ldots, P(X=${n})$`:`$f(${n}, ${p})$ renvoie la liste $P(X=1), \\ldots, P(X=${n})$`}</p>`,isTrue,`Parcourt $k$ de $0$ à $n$. Le majordome a compté deux fois pour être sûr.`); },
  () => { const n = randInt(4, 8); const p = 0.3;
    const code = ["def f(n, p):","    q = 1 - p","    s = 0","    c = 1","    for k in range(n + 1):","        s += c * (p ** k) * (q ** (n - k))","        c = c * (n - k) // (k + 1)","    return round(s, 5)"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()} Le majordome soupçonne que la somme fera 1, mais il a été élevé dans le doute.</em></p><pre><code>${code}</code></pre><p>$f(${n}, ${p})$ renvoie $1$</p>`,true,`Somme des probabilités $= 1$. Une loi est une loi, même au manoir.`); },
  () => { const n = randInt(4, 8); const p = [0.1,0.2,0.3][randInt(0,2)];
    const code = ["def f(n, p):","    q = 1 - p","    res = 1","    for i in range(n):","        res *= q","    return res"].join('\n');
    const isTrue=Math.random()>0.5;
    return P(`<p>🫖 <em>${pyFlavor()}</em></p><pre><code>${code}</code></pre><p>${isTrue?`$f(${n}, ${p})$ renvoie $(1-p)^n = P(X=0)$`:`$f(${n}, ${p})$ renvoie $p^n = P(X=n)$`}</p>`,isTrue,`Multiplie $(1-p)$ $n$ fois. Baxter appelle ça « la philosophie du jamais-deux-fois ».`); },
  () => { const n = randInt(10, 20); const p = 0.4;
    const code = ["def f(n, p):","    return n * p"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()} Un seul calcul, et pourtant Baxter a mis dix minutes à taper ces deux lignes.</em></p><pre><code>${code}</code></pre><p>$f(${n}, ${p})$ renvoie $E(X)$ de $\\mathcal{B}(n,p)$</p>`,true,`$E(X) = np$. Le majordome appelle ça « la moyenne des choses qui tombent ».`); },
  () => { const n = randInt(10, 20); const p = 0.4;
    const code = ["def f(n, p):","    return n * p * (1 - p)"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()}</em></p><pre><code>${code}</code></pre><p>$f(${n}, ${p})$ renvoie $V(X)$ de $\\mathcal{B}(n,p)$</p>`,true,`$V(X) = np(1-p)$. La variance, c'est le désordre des biscuits, selon Baxter.`); },
  () => { const n = randInt(5, 9); const p = 0.3;
    const code = ["def f(n, p):","    max_p = -1","    best_k = -1","    q = 1 - p","    c = 1","    for k in range(n + 1):","        prob = c * (p ** k) * (q ** (n - k))","        if prob > max_p:","            max_p = prob","            best_k = k","        c = c * (n - k) // (k + 1)","    return best_k"].join('\n');
    const trueMode = Math.floor((n + 1) * p);
    const isTrue=Math.random()>0.5;
    return P(`<p>🫖 <em>${pyFlavor()} Il paraît que ce programme a été écrit pour trouver le biscuit le plus fréquent sur la table.</em></p><pre><code>${code}</code></pre><p>${isTrue?`$f(${n}, ${p})$ renvoie $${trueMode}$`:`$f(${n}, ${p})$ renvoie $${trueMode + 1}$`}</p>`,isTrue,`Cherche le mode. Baxter l'appelle « le biscuit le plus populaire ».`); },
  () => { const n = randInt(4, 7), k = randInt(1, n - 1);
    const code = ["def f(n, k, p):","    q = 1 - p","    s = 0","    c = 1","    for i in range(k + 1):","        s += c * (p ** i) * (q ** (n - i))","        c = c * (n - i) // (i + 1)","    return s"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()} (Le majordome, cette fois, n'a pas renversé son thé dessus.)</em></p><pre><code>${code}</code></pre><p>$f(${n}, ${k}, ${0.5})$ calcule $P(X \\leq ${k})$</p>`,true,`Somme cumulée. C'est la version « additionnée » de la loi.`); },
  () => { const code = ["def f(L):","    s = 0","    for x in L:","        if x < 0 or x > 1:","            return False","        s += x","    return abs(s - 1) < 1e-6"].join('\n');
    const isTrue=Math.random()>0.5;
    return P(`<p>🫖 <em>${pyFlavor()} Ce script vérifie si une liste est bien élevée.</em></p><pre><code>${code}</code></pre><p>${isTrue?`$f(\\text{valeurs})$ vérifie si la liste est une distribution`:`$f()$ calcule la somme des éléments`}</p>`,isTrue,`Vérifie conditions loi de probabilité. Le majordome appelle ça « la bienséance probabiliste ».`); },
  () => { const L = Array.from({length: 10}, () => Math.random() > 0.5 ? 1 : 0);
    const k = L.filter(x => x === 1).length;
    const code = ["def f(L):","    c = 0","    for x in L:","        if x == 1:","            c += 1","    return c"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()}</em></p><pre><code>${code}</code></pre><p>$f([${L.join(', ')}])$ renvoie $${k}$</p>`,true,`Compte les succès. Baxter appelle ça « la chasse aux 1 ».`); },
  () => { const n = randInt(5, 10);
    const code = ["def f(n, prob_1):","    return prob_1 / n"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()}</em></p><pre><code>${code}</code></pre><p>$f(${n}, 0{,}4)$ renvoie $p$ sachant $P(X=1) = 0{,}4$</p>`,true,`$p = P(X=1)/n$. Une division, et beaucoup de dignité.`); },
  () => { const code = ["def f(p, prob_0):","    n = 0","    curr = 1","    while curr > prob_0:","        curr *= (1 - p)","        n += 1","    return n"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()}</em></p><pre><code>${code}</code></pre><p>$f(0{,}5, 0{,}125)$ renvoie $3$</p>`,true,`Cherche $n$ tel que $(1-p)^n = 0{,}125$. C'est presque un conte de fées probabiliste.`); },
  () => { const n = 3, p = 0.5;
    const code = ["def f(n, p):","    q = 1 - p","    L = []","    c = 1","    for k in range(n + 1):","        L.append((k, c * (p ** k) * (q ** (n - k))))","        c = c * (n - k) // (k + 1)","    return L"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()}</em></p><pre><code>${code}</code></pre><p>$f(${n}, ${p})$ renvoie une liste de tuples $(k, P(X=k))$</p>`,true,`Table de distribution. Le majordome appelle ça « le menu des probabilités ».`); },
  () => { const code = ["import math","def f(n, p, k):","    mu = n * p","    sigma = math.sqrt(n * p * (1 - p))","    return (1 / (sigma * math.sqrt(2 * math.pi))) * math.exp(-0.5 * ((k - mu) / sigma) ** 2)"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()} Ce script frôle la science-fiction selon le majordome.</em></p><pre><code>${code}</code></pre><p>$f(${randInt(10,30)}, 0{,}3, ${randInt(5,15)})$ calcule une approximation de $P(X=k)$</p>`,true,`Densité normale. Attention : c'est de la culture, pas du programme.`); },
  () => { const n = randInt(4, 7);
    const code = ["def f(n):","    s = 0","    c = 1","    for k in range(n + 1):","        s += c","        c = c * (n - k) // (k + 1)","    return s"].join('\n');
    const res = Math.pow(2, n);
    return P(`<p>🫖 <em>${pyFlavor()} (Le majordome trouve ce résultat « déraisonnablement rond ».)</em></p><pre><code>${code}</code></pre><p>$f(${n})$ renvoie $${res}$</p>`,true,`Somme $= 2^n$. Une coïncidence ? Non, une identité.`); },
  () => { const n = randInt(4, 7);
    const code = ["def f(n):","    s = 0","    c = 1","    signe = 1","    for k in range(n + 1):","        s += signe * c","        c = c * (n - k) // (k + 1)","        signe = -signe","    return s"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()}</em></p><pre><code>${code}</code></pre><p>$f(${n})$ renvoie $0$</p>`,true,`Somme alternée $= 0$. Le majordome appelle ça « l'annulation élégante ».`); },
  () => { const n = randInt(4, 8); const p = 0.2;
    const code = ["def f(n, p):","    q = 1 - p","    prob_0 = 1","    for i in range(n):","        prob_0 *= q","    return 1 - prob_0"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()}</em></p><pre><code>${code}</code></pre><p>$f(${n}, ${p})$ calcule $P(X \\geq 1)$</p>`,true,`$1 - P(X=0)$. Le complémentaire, c'est l'élégance des probabilités.`); },
  () => { const code = ["def f(p, prob):","    n = 1","    q = 1 - p","    curr = q","    while curr > prob:","        curr *= q","        n += 1","    return n"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()} Un programme qui compte jusqu'à ce que le doute disparaisse.</em></p><pre><code>${code}</code></pre><p>$f(0{,}5, 0{,}1)$ renvoie le plus petit $n$ tel que $P(X=0) \\leq 0{,}1$</p>`,true,`Cherche $n$ tel que $(1-p)^n \\leq$ prob. Une boucle patiente.`); },
  () => { const code = ["def f(L):","    n = len(L)","    k = 0","    for x in L:","        if x == 1:","            k += 1","    return k, n - k"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()}</em></p><pre><code>${code}</code></pre><p>$f([1, 0, 1, 1, 0])$ renvoie $(3, 2)$</p>`,true,`Compte succès et échecs. Le majordome appelle ça « la comptabilité des petits riens ».`); },
  () => { const n = randInt(5, 9), k = randInt(1, n - 1);
    const code = ["def f(n, k):","    res = 1","    i = 0","    while i < k:","        res = res * (n - i) // (i + 1)","        i += 1","    return res"].join('\n');
    let res = 1; for(let i=0; i<k; i++) res = res * (n - i) / (i + 1); res = Math.round(res);
    return P(`<p>🫖 <em>${pyFlavor()}</em></p><pre><code>${code}</code></pre><p>$f(${n}, ${k})$ renvoie $${res}$</p>`,true,`Coefficient binomial. Encore. Baxter a fini par le retenir.`); },
  () => { const code = ["def f(probs):","    res = []","    for p in probs:","        if p > 0.5:","            res.append(1)","        else:","            res.append(0)","    return res"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()} Ce script transforme des probabilités en une suite de « oui » et de « non ».</em></p><pre><code>${code}</code></pre><p>$f([0{,}2;\\, 0{,}8;\\, 0{,}1;\\, 0{,}9])$ renvoie $[0, 1, 0, 1]$</p>`,true,`Transforme probabilités en succès/échecs. On appelle ça « la démocratie probabiliste ».`); },
  () => { const code = ["def f(L):","    for x in L:","        if x != 0 and x != 1:","            return False","    return True"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()}</em></p><pre><code>${code}</code></pre><p>$f([1, 0, 1, 2])$ renvoie <code>False</code></p>`,true,`Tous éléments $0$ ou $1$ ? Le 2 a trahi la cause.`); },
  () => { const code = ["def f(n, p):","    res = 0","    for i in range(n):","        res += p","    return res"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()} Ce script additionne $p$ un nombre déraisonnable de fois.</em></p><pre><code>${code}</code></pre><p>$f(${randInt(5,10)}, 0{,}3)$ renvoie l'espérance de $\\mathcal{B}(n,p)$</p>`,true,`Somme $= np$. Le majordome appelle ça « la patience arithmétique ».`); },
  () => { const code = ["def f(n, p):","    q = 1 - p","    res = 0","    for i in range(n):","        res += p * q","    return res"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()}</em></p><pre><code>${code}</code></pre><p>$f(${randInt(5,10)}, 0{,}3)$ renvoie la variance de $\\mathcal{B}(n,p)$</p>`,true,`Somme $= np(1-p)$. La variance, c'est le désordre contrôlé.`); },
  () => { const n = randInt(5, 9); const p = 0.4; const target = 0.2;
    const code = ["def f(n, p, target):","    q = 1 - p","    c = 1","    best_k = 0","    best_diff = 1","    for k in range(n + 1):","        prob = c * (p ** k) * (q ** (n - k))","        diff = abs(prob - target)","        if diff < best_diff:","            best_diff = diff","            best_k = k","        c = c * (n - k) // (k + 1)","    return best_k"].join('\n');
    let best_k = 0, best_diff = 2, c = 1;
    for(let k=0; k<=n; k++){ let prob = c*Math.pow(p,k)*Math.pow(1-p,n-k); let diff = Math.abs(prob-target); if(diff<best_diff){best_diff=diff;best_k=k;} c = c*(n-k)/(k+1); }
    return P(`<p>🫖 <em>${pyFlavor()} Ce programme cherche la probabilité la plus proche d'une cible, comme un majordome cherche le plateau le plus proche de la porte.</em></p><pre><code>${code}</code></pre><p>$f(${n}, ${p}, ${target})$ renvoie $${best_k}$</p>`,true,`Cherche $k$ tel que $P(X=k)$ proche de $${target}$. Précision toute britannique.`); },
  () => { const n = randInt(4, 8);
    const code = ["def f(n, p):","    q = 1 - p","    res = 1","    for i in range(n):","        res = res * q","    return res"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()}</em></p><pre><code>${code}</code></pre><p>$f(${n}, 0{,}2)$ calcule $(1-p)^n = P(X=0)$</p>`,true,`Multiplie $(1-p)$ $n$ fois. Aucun biscuit n'est tombé du bon côté.`); },
  () => { const k = randInt(2, 5);
    const code = ["def f(k, p):","    res = 1","    for i in range(k):","        res = res * p","    return res"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()}</em></p><pre><code>${code}</code></pre><p>$f(${k}, 0{,}3)$ calcule $p^k$</p>`,true,`Multiplie $p$ $k$ fois. Le majordome appelle ça « la constance du succès ».`); },
  () => { const n = randInt(5, 9), k = randInt(1, n - 2);
    const code = ["def f(n, k, p):","    q = 1 - p","    return ((n - k) / (k + 1)) * (p / q)"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()} Un rapport de probabilités, comme un rapport de biscuits d'un jour à l'autre.</em></p><pre><code>${code}</code></pre><p>$f(${n}, ${k}, 0{,}4)$ calcule $P(X=${k+1}) / P(X=${k})$</p>`,true,`Rapport des probabilités successives. Élégant, presque britannique.`); },
  () => { const n = randInt(10, 20);
    const code = ["def f(n, esperance):","    return esperance / n"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()}</em></p><pre><code>${code}</code></pre><p>$f(${n}, 6)$ renvoie $p$ sachant $E(X) = 6$</p>`,true,`$p = E(X)/n$. Division, dignité, et un soupçon de thé.`); },
  () => { const p = 0.2;
    const code = ["def f(p, variance):","    return variance / (p * (1 - p))"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()}</em></p><pre><code>${code}</code></pre><p>$f(${p}, 4{,}8)$ renvoie $n$ sachant $V(X) = 4{,}8$</p>`,true,`$n = V(X)/(p(1-p))$. Baxter a vérifié : la division tombe juste.`); },
  () => { const code = ["def f(L):","    for x in L:","        if x < 0 or x > 1:","            return False","    s = sum(L)","    return abs(s - 1) < 1e-6"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()} Une liste qui somme à $0{,}9$ : l'angoisse du majordome.</em></p><pre><code>${code}</code></pre><p>$f([0{,}1;\\, 0{,}3;\\, 0{,}4;\\, 0{,}1])$ renvoie <code>False</code></p>`,true,`La liste ne somme pas à $1$. Une distribution, ça se respecte.`); },
  () => { const n = randInt(4, 7), k = randInt(1, n - 1);
    const code = ["def f(n, k, p):","    q = 1 - p","    s = 0","    c = 1","    i = 0","    while i <= k:","        s += c * (p ** i) * (q ** (n - i))","        c = c * (n - i) // (i + 1)","        i += 1","    return s"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()}</em></p><pre><code>${code}</code></pre><p>$f(${n}, ${k}, ${0.5})$ calcule $P(X \\leq ${k})$</p>`,true,`Somme cumulée. Le majordome appelle ça « la réunion des petits événements ».`); },
  () => { const n = randInt(4, 7), k = randInt(1, n - 1);
    const code = ["def f(n, k):","    L = [1]","    for i in range(1, n + 1):","        L.append(L[-1] * (n - i + 1) // i)","    return L[k]"].join('\n');
    let L = [1];
    for(let i=1; i<=n; i++) L.push(Math.round(L[L.length-1] * (n - i + 1) / i));
    return P(`<p>🫖 <em>${pyFlavor()}</em></p><pre><code>${code}</code></pre><p>$f(${n}, ${k})$ renvoie $${L[k]}$</p>`,true,`$\\binom{${n}}{${k}}$ via Pascal. Une ligne à la fois, comme les biscuits.`); },
  () => { const n = randInt(3, 6), k = randInt(1, n - 1);
    const code = ["def f(n, k, p):","    q = 1 - p","    c = 1","    i = 0","    while i < k:","        c = c * (n - i) // (i + 1)","        i += 1","    return c * (p ** k) * (q ** (n - k))"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()}</em></p><pre><code>${code}</code></pre><p>$f(${n}, ${k}, 0{,}5)$ calcule $P(X=${k})$</p>`,true,`Formule binomiale. Le majordome l'a récitée au moins douze fois.`); },
  () => { const code = ["def f(L):","    p = 0","    f = 0","    for x in L:","        if x == 1:","            p += 1","        elif x == 0:","            f += 1","    return p, f"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()}</em></p><pre><code>${code}</code></pre><p>$f([1, 1, 0, 1, 0])$ renvoie $(3, 2)$</p>`,true,`Compte succès et échecs. Le majordome appelle ça « la tenue des comptes ».`); },
  () => { const n = randInt(6, 10), k = randInt(1, n - 2);
    const code = ["def f(n, k):","    return (n - k) / (k + 1)"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()}</em></p><pre><code>${code}</code></pre><p>$f(${n}, ${k})$ renvoie le rapport $\\dfrac{\\binom{n}{${k+1}}}{\\binom{n}{${k}}}$</p>`,true,`$(n-k)/(k+1)$. Une identité qui ne prend pas de place.`); },
  () => { const code = ["def f(L):","    max_v = L[0]","    max_i = 0","    for i in range(1, len(L)):","        if L[i] > max_v:","            max_v = L[i]","            max_i = i","    return max_i"].join('\n');
    return P(`<p>🫖 <em>${pyFlavor()} Ce programme cherche l'indice du maximum, comme un majordome cherche le plus haut des plateaux.</em></p><pre><code>${code}</code></pre><p>$f([0{,}1;\\, 0{,}4;\\, 0{,}3;\\, 0{,}2])$ renvoie $1$</p>`,true,`Indice du maximum = mode. Le biscuit le plus fréquent, encore.`); }
];

const TREE_QUESTIONS = [
  (sc) => { const p = pickP(); const d = randInt(1, 3); const o = pickOrientation();
    return P(`<p>🌳 <em>${treeFlavor()}</em></p><div class="graph-wrap">${svgTree({orientation:o, depth:d, p, variant:'valid'})}</div>` +
      `${sc.majordome} a dressé cet arbre (${orientLabel(o)}) pour ${sc.seigneur} afin de représenter ${sc.action} répété. C'est un arbre de schéma de Bernoulli.`,
      true,
      `À chaque nœud, deux branches $S$ et $\\overline{S}$ avec $p$ constant et des probabilités sommant à $1$. Le majordome est très fier.`); },
  (sc) => { const o = pickOrientation();
    return P(`<p>🌳 <em>${treeFlavor()}</em></p><div class="graph-wrap">${svgTree({orientation:o, depth:1, variant:'three'})}</div>` +
      `Dans le bureau de ${sc.lieu}, ${sc.seigneur} affirme que cet arbre représente un schéma de Bernoulli.`,
      false,
      `Trois branches au nœud racine : ce n'est pas une épreuve de Bernoulli. ${sc.majordome} hoche la tête avec résignation.`); },
  (sc) => { const p = pickP(); const o = pickOrientation();
    return P(`<p>🌳 <em>${treeFlavor()}</em></p><div class="graph-wrap">${svgTree({orientation:o, depth:2, p, variant:'valid'})}</div>` +
      `Sur cet arbre, la probabilité de succès est la même à chaque niveau.`,
      true,
      `Les labels sur les branches sont identiques : $p$ constant. ${sc.majordome} appelle ça « la cohérence des biscuits ».`); },
  (sc) => { const o = pickOrientation();
    return P(`<p>🌳 <em>${treeFlavor()}</em></p><div class="graph-wrap">${svgTree({orientation:o, depth:2, p:0.5, variant:'changing'})}</div>` +
      `${sc.majordome} affirme que cet arbre peut représenter un schéma de Bernoulli.`,
      false,
      `Les probabilités changent entre les niveaux : $p$ doit rester constant. ${sc.majordome} aurait dû relire son propre carnet.`); },
  (sc) => { const o = pickOrientation();
    return P(`<p>🌳 <em>${treeFlavor()}</em></p><div class="graph-wrap">${svgTree({orientation:o, depth:2, variant:'wrong-sum'})}</div>` +
      `Sur cet arbre, les probabilités de chaque embranchement somment à $1$.`,
      false,
      `Labels $0{,}3$ et $0{,}3$ : somme $0{,}6 \\neq 1$. ${sc.majordome} a visiblement oublié un morceau.`); },
  (sc) => { const d = randInt(2, 3); const k = randInt(1, d - 1); const o = pickOrientation();
    return P(`<p>🌳 <em>${treeFlavor()}</em></p><div class="graph-wrap">${svgTree({orientation:o, depth:d, p:0.5, variant:'valid'})}</div>` +
      `Dans cet arbre à $${d}$ niveaux, il y a $\\binom{${d}}{${k}} = ${comb(d,k)}$ chemins qui réalisent exactement $${k}$ succès.`,
      true,
      `$\\binom{${d}}{${k}} = ${comb(d,k)}$. Le majordome appelle ça « la combinatoire des chemins de traverse ».`); },
  (sc) => { const p = pickP(); const o = pickOrientation();
    return P(`<p>🌳 <em>${treeFlavor()}</em></p><div class="graph-wrap">${svgTree({orientation:o, depth:1, p, variant:'valid'})}</div>` +
      `Cet arbre à un seul niveau représente une épreuve de Bernoulli.`,
      true,
      `Un niveau, deux branches = épreuve de Bernoulli. ${sc.majordome} appelle ça « la version courte de l'histoire ».`); },
  (sc) => { const o = pickOrientation();
    return P(`<p>🌳 <em>${treeFlavor()}</em></p><div class="graph-wrap">${svgTree({orientation:o, depth:2, p:0.4, variant:'valid'})}</div>` +
      `${sc.seigneur} affirme que l'orientation de l'arbre (${orientLabel(o)}) modifie la loi de probabilité.`,
      false,
      `L'orientation est une convention de dessin. ${sc.seigneur} a toujours eu un rapport compliqué avec la géographie.`); },
  (sc) => { const o = pickOrientation();
    return P(`<p>🌳 <em>${treeFlavor()}</em></p><div class="graph-wrap">${svgTree({orientation:o, depth:2, p:0.5, variant:'valid'})}</div>` +
      `La probabilité d'un chemin particulier (par exemple $SS$) vaut $0{,}25$.`,
      true,
      `$0{,}5 \\times 0{,}5 = 0{,}25$. ${sc.majordome} appelle ça « la multiplication des petits bonheurs ».`); },
  (sc) => { const o = pickOrientation();
    return P(`<p>🌳 <em>${treeFlavor()}</em></p><div class="graph-wrap">${svgTree({orientation:o, depth:2, p:0.5, variant:'changing'})}</div>` +
      `Sur cet arbre, la probabilité de succès est constante : c'est un schéma de Bernoulli.`,
      false,
      `$p$ change : pas un schéma de Bernoulli. Le majordome soupçonne une intervention du neveu facétieux.`); },
  (sc) => { const o = pickOrientation();
    return P(`<p>🌳 <em>${treeFlavor()}</em></p><div class="graph-wrap">${svgTree({orientation:o, depth:1, variant:'three'})}</div>` +
      `Cet arbre a trois branches dont les probabilités somment à $1$, et pourtant ce n'est pas un schéma de Bernoulli.`,
      true,
      `Trois issues $\\neq$ schéma de Bernoulli. Le majordome appelle ça « le triangle des Bermudes probabiliste ».`); },
  (sc) => { const o = pickOrientation();
    return P(`<p>🌳 <em>${treeFlavor()}</em></p><div class="graph-wrap">${svgTree({orientation:o, depth:3, p:0.3, variant:'valid'})}</div>` +
      `La probabilité du chemin « S, S, S » vaut $0{,}3^3$.`,
      true,
      `Chaque branche $S$ a probabilité $p = 0{,}3$ : $0{,}3^3$. ${sc.majordome} appelle ça « le festival du succès ».`); },
  (sc) => { const o = pickOrientation();
    return P(`<p>🌳 <em>${treeFlavor()}</em></p><div class="graph-wrap">${svgTree({orientation:o, depth:3, p:0.5, variant:'valid'})}</div>` +
      `Pour cet arbre ($p = 0{,}5$), le nombre de chemins est maximal pour $\\lfloor n/2 \\rfloor$ succès.`,
      true,
      `Pour $p = 0{,}5$, mode à $\\lfloor n/2 \\rfloor$. Le majordome appelle ça « la juste mesure ».`); },
  (sc) => { const o = pickOrientation();
    return P(`<p>🌳 <em>${treeFlavor()}</em></p><div class="graph-wrap">${svgTree({orientation:o, depth:2, variant:'wrong-sum'})}</div>` +
      `${sc.majordome} affirme que les probabilités somment à $1$ sur cet arbre.`,
      false,
      `Labels $0{,}3 + 0{,}3 = 0{,}6$. ${sc.majordome} aurait besoin de lunettes, ou d'un rappel de cours.`); },
  (sc) => {
    return P(`<p>🌳 <em>${treeFlavor()}</em></p><div class="graph-wrap">${svgTree({orientation:'left-right', depth:2, p:0.5, variant:'valid'})}</div>` +
      `Cet arbre orienté de gauche à droite représente un schéma de Bernoulli à deux épreuves.`,
      true,
      `Orientation sans importance. Le majordome préfère le dessin de gauche à droite, c'est plus lisible pour ses vieux yeux.`); },
  (sc) => { const o = pickOrientation();
    return P(`<p>🌳 <em>${treeFlavor()}</em></p><div class="graph-wrap">${svgTree({orientation:o, depth:2, p:0.5, variant:'valid'})}</div>` +
      `Cet arbre a exactement $4$ issues finales (feuilles).`,
      true,
      `Profondeur $2$ : $2^2 = 4$ feuilles. Le majordome appelle ça « les quatre coins du jardin ».`); },
  (sc) => {
    return P(`<p>🌳 <em>${treeFlavor()}</em></p><div class="graph-wrap">${svgTree({orientation:'bottom-up', depth:2, p:0.4, variant:'valid'})}</div>` +
      `${sc.seigneur} affirme que cet arbre, dessiné de bas en haut, est invalide à cause de son orientation.`,
      false,
      `L'orientation n'a aucune incidence. ${sc.seigneur} confond parfois une carte de géographie et une loi de probabilité.`); },
  (sc) => { const o = pickOrientation();
    return P(`<p>🌳 <em>${treeFlavor()}</em></p><div class="graph-wrap">${svgTree({orientation:o, depth:2, p:0.4, variant:'changing'})}</div>` +
      `${sc.seigneur} affirme que les probabilités qui changent entre niveaux ne gênent pas pour appliquer la loi binomiale.`,
      false,
      `Si $p$ change, pas de loi binomiale. Le majordome appelle ça « la valse des probabilités ».`); },
  (sc) => { const o = pickOrientation();
    return P(`<p>🌳 <em>${treeFlavor()}</em></p><div class="graph-wrap">${svgTree({orientation:o, depth:3, p:0.5, variant:'valid'})}</div>` +
      `Cet arbre illustre la loi binomiale : les issues finales se répartissent selon $\\mathcal{B}(3\\,;\\,0{,}5)$.`,
      true,
      `Arbre de $3$ épreuves ($p = 0{,}5$). Le majordome appelle ça « la distribution du hasard équilibré ».`); },
  (sc) => { const o = pickOrientation();
    return P(`<p>🌳 <em>${treeFlavor()}</em></p><div class="graph-wrap">${svgTree({orientation:o, depth:2, p:0.4, variant:'valid'})}</div>` +
      `Les branches issues de la racine portent les labels $p = 0{,}4$ et $1-p = 0{,}6$.`,
      true,
      `$0{,}4 + 0{,}6 = 1$. Le majordome appelle ça « l'harmonie des contraires ».`); },
  (sc) => { const o = pickOrientation();
    return P(`<p>🌳 <em>${treeFlavor()}</em></p><div class="graph-wrap">${svgTree({orientation:o, depth:3, p:0.5, variant:'valid'})}</div>` +
      `Dans cet arbre à trois niveaux, il y a $3$ chemins qui réalisent exactement $1$ succès.`,
      true,
      `$\\binom{3}{1} = 3$. Le majordome appelle ça « les trois grâces probabilistes ».`); },
  (sc) => { const o = pickOrientation();
    return P(`<p>🌳 <em>${treeFlavor()}</em></p><div class="graph-wrap">${svgTree({orientation:o, depth:1, variant:'three'})}</div>` +
      `Cet arbre peut représenter $n$ épreuves de Bernoulli.`,
      false,
      `Un nœud à trois branches ne peut représenter une épreuve à deux issues. Le majordome reste perplexe.`); },
  (sc) => { const o = pickOrientation();
    return P(`<p>🌳 <em>${treeFlavor()}</em></p><div class="graph-wrap">${svgTree({orientation:o, depth:2, variant:'wrong-sum'})}</div>` +
      `Cet arbre représente un schéma de Bernoulli à deux épreuves.`,
      false,
      `Somme $\\neq 1$ : ce n'est pas un arbre de probabilité valide. ${sc.majordome} propose de refaire le dessin.`); },
  (sc) => { const o = pickOrientation();
    return P(`<p>🌳 <em>${treeFlavor()}</em></p><div class="graph-wrap">${svgTree({orientation:o, depth:3, p:0.5, variant:'valid'})}</div>` +
      `Il y a exactement $1$ chemin qui réalise $3$ succès (toutes les branches $S$).`,
      true,
      `$\\binom{3}{3} = 1$. Le majordome appelle ça « le chemin de la perfection ».`); },
  (sc) => { const o = pickOrientation();
    return P(`<p>🌳 <em>${treeFlavor()}</em></p><div class="graph-wrap">${svgTree({orientation:o, depth:3, p:0.3, variant:'valid'})}</div>` +
      `La probabilité « exactement 2 succès » sur cet arbre vaut $\\binom{3}{2} p^2 (1-p)$ avec $p = 0{,}3$.`,
      true,
      `$\\binom{3}{2} \\times 0{,}3^2 \\times 0{,}7$. Le majordome appelle ça « la recette du succès modéré ».`); }
];

const STEP_GEN = {
  1: [
    sc => P(`${sc.majordome} observe ${sc.action} : deux issues, "${sc.succes}" ou "${sc.echec}". C'est une épreuve de Bernoulli.`, true, `Deux issues : c'est une épreuve de Bernoulli. Le majordome appelle ça « la simplicité majestueuse ».`),
    sc => P(`${sc.majordome} rappelle qu'une épreuve de Bernoulli est une expérience aléatoire dont l'issue est incertaine avant réalisation.`, true, `C'est la définition d'une expérience aléatoire. Pas d'improvisation.`),
    sc => P(`${sc.majordome} insiste : une épreuve de Bernoulli n'admet que deux issues possibles.`, true, `Exactement $2$ issues. Ni plus, ni moins. Le majordome est intraitable.`),
    sc => P(`${sc.seigneur} demande à ${sc.majordome} de nommer les deux issues : on les appelle "succès" et "échec".`, true, `Convention standard, même si "${sc.echec}" est parfois vexant pour ${sc.objet}.`),
    sc => P(`Dans une épreuve de Bernoulli, ${sc.majordome} note : succès de probabilité $p$, échec de probabilité $1-p$.`, true, `$p + (1-p) = 1$. Une égalité rassurante.`),
    sc => P(`Avant de ${sc.action} à ${sc.lieu}, on ne sait pas si ce sera "${sc.succes}" ou "${sc.echec}" : c'est une épreuve de Bernoulli.`, true, `Deux issues et incertitude. Le majordome appelle ça « le doute élégant ».`),
    sc => P(`${sc.seigneur} affirme qu'une épreuve de Bernoulli peut avoir trois issues : "${sc.succes}", "${sc.echec}", et "${sc.troisieme}".`, false, `Trois issues contredisent la définition. Le majordome lève les yeux au ciel (intérieurement).`),
    sc => P(`${sc.majordome} pense que les deux issues d'une épreuve de Bernoulli sont toujours équiprobables.`, false, `Probabilités $p$ et $1-p$ ; égales seulement si $p = \\tfrac{1}{2}$. Le majordome est un optimiste.`),
    sc => P(`${sc.seigneur} soutient que toute expérience aléatoire est une épreuve de Bernoulli, y compris le choix du pudding (soupe, rôti, tarte).`, false, `Trois issues $\\neq$ Bernoulli. Le majordome appelle ça « la confusion de l'après-dîner ».`),
    sc => P(`${sc.majordome} précise qu'une épreuve de Bernoulli doit être répétée un grand nombre de fois pour mériter son nom.`, false, `Une épreuve est unique ; la répétition donne un schéma. Une seule fois suffit, c'est la règle.`),
    sc => P(`Dans une épreuve de Bernoulli, ${sc.seigneur} affirme que $p$ désigne toujours la probabilité de l'échec.`, false, `$p$ est la probabilité du succès. ${sc.seigneur} inverse souvent les choses, y compris sa veste.`),
    sc => P(`${sc.seigneur} pense que "${sc.objet}" peut avoir un nombre infini d'issues dans une épreuve de Bernoulli.`, false, `Exactement $2$ issues. L'infini, c'est pour les théoriciens et les conversations de salon.`),
    sc => P(`${sc.majordome} note $p = 0$ pour "${sc.succes}" : le succès est impossible, mais c'est encore une épreuve de Bernoulli (cas limite).`, true, `$p = 0$ est autorisé (événement impossible). Le majordome appelle ça « le pessimisme mathématique ».`),
    sc => P(`${sc.seigneur} affirme qu'une probabilité peut valoir $1{,}5$ dans une épreuve de Bernoulli.`, false, `Une probabilité est toujours dans $[0, 1]$. Même en Angleterre, où il pleut souvent, on ne dépasse pas 1.`),
    sc => P(`Un dé à six faces lancé à ${sc.lieu} n'est pas une épreuve de Bernoulli.`, true, `Six issues $\\neq$ deux. Le majordome appelle ça « le désordre organisé ».`),
    sc => P(`Le choix du menu à ${sc.lieu} entre soupe, rôti et tarte est une épreuve de Bernoulli.`, false, `Trois issues : pas Bernoulli. ${sc.majordome} est formel.`),
    sc => P(`Si ${sc.majordome} regroupe les issues de ${sc.action} en "${sc.succes}" d'un côté et tout le reste de l'autre, il obtient une épreuve de Bernoulli.`, true, `Regrouper en deux catégories donne une épreuve de Bernoulli. C'est la grande astuce du majordome.`),
    sc => P(`${sc.seigneur} confond épreuve et schéma de Bernoulli : pour ${sg(sc, 'lui', 'elle')}, c'est pareil.`, false, `Épreuve $= 1$ essai ; schéma $= n$ essais répétés. Le majordome note dans son carnet, encore.`),
    sc => P(`Dans une même épreuve de Bernoulli à ${sc.lieu}, $p$ est fixe : il ne change pas entre deux observations.`, true, `$p$ est un paramètre fixe de l'épreuve. La constance est une vertu britannique.`),
    sc => P(`Pour toute épreuve de Bernoulli, la somme des probabilités de succès et d'échec vaut $1$.`, true, `$p + (1-p) = 1$. Une égalité aussi fiable que le thé de 17 h.`),
    sc => P(`${sc.majordome} appelle $S$ le succès et $\\overline{S}$ l'échec : ce sont les deux issues.`, true, `Notation standard. Le majordome a même une tasse marquée $S$ et une autre $\\overline{S}$.`),
    sc => P(`Une épreuve de Bernoulli peut avoir une troisième issue « neutre ».`, false, `Non : exactement deux issues. Le neutre, c'est pour la politique et les hivers anglais.`),
    sc => P(`Un seul lancer de ${sc.objet} à ${sc.lieu} est une épreuve de Bernoulli.`, true, `Un essai et deux issues $=$ Bernoulli. ${sc.majordome} appelle ça « l'élégance du geste unique ».`),
    sc => P(`${sc.majordome} observe $10$ ${sc.action}s à ${sc.lieu} : chaque essai pris isolément est une épreuve de Bernoulli.`, true, `Chaque essai individuel est Bernoulli. L'essai collectif, c'est une autre histoire.`),
    sc => P(`Si la probabilité de "${sc.succes}" change d'un essai à l'autre, on n'a plus affaire à une même épreuve de Bernoulli répétée.`, true, `$p$ doit rester constant dans un schéma. Le majordome appelle ça « la constance de la maison ».`)
  ],
  2: [
    sc => P(`<div class="graph-wrap">${svgBarChart([0.3, 0.7], ["0", "1"], "Graphique A")}</div> <em>${treeFlavor()}</em> Le graphique A représente une loi de Bernoulli.`, true, `Deux issues, somme $= 1$. Le majordome est très content.`),
    sc => P(`<div class="graph-wrap">${svgBarChart([0.2, 0.5, 0.3], ["0", "1", "2"], "Graphique B")}</div> <em>${treeFlavor()}</em> Le graphique B représente une loi de Bernoulli.`, false, `Trois issues : pas Bernoulli. Le majordome évoque un complot du neveu.`),
    sc => P(`<div class="graph-wrap">${svgBarChart([0.5, 0.5], ["0", "1"], "Graphique C")}</div> <em>${treeFlavor()}</em> Le graphique C représente une loi de Bernoulli.`, true, `Deux issues équiprobables : Bernoulli ($p = 0{,}5$). Le majordome appelle ça « l'équité des biscuits ».`),
    sc => P(`<div class="graph-wrap">${svgBarChart([0.6, 0.6], ["0", "1"], "Graphique D")}</div> <em>${treeFlavor()}</em> Le graphique D représente une loi de Bernoulli.`, false, `Somme $= 1{,}2 \\neq 1$. Le majordome n'en croit pas ses lunettes.`),
    sc => P(`<div class="graph-wrap">${svgCurveChart('normal', "Graphique E")}</div> <em>${treeFlavor()}</em> Le graphique E représente une loi de Bernoulli.`, false, `Courbe continue : Bernoulli est discrète. Le majordome aurait voulu, mais non.`),
    sc => P(`<div class="graph-wrap">${svgBarChart([0.3, 0.3], ["0", "1"], "Graphique F")}</div> <em>${treeFlavor()}</em> Le graphique F représente une loi de Bernoulli.`, false, `$0{,}3 + 0{,}3 = 0{,}6 \\neq 1$. Le majordome appelle ça « le trou béant de la distribution ».`),
    sc => P(`<div class="graph-wrap">${svgBarChart([0.1, 0.2, 0.3, 0.4], ["0","1","2","3"], "Graphique G")}</div> <em>${treeFlavor()}</em> Le graphique G représente une loi de Bernoulli.`, false, `Quatre issues : pas Bernoulli. Le majordome soupçonne un malentendu avec le poker.`),
    sc => P(`<div class="graph-wrap">${svgBarChart([1], ["0"], "Graphique H")}</div> <em>${treeFlavor()}</em> Le graphique H représente une loi de Bernoulli avec $p = 0$.`, false, `Un seul bâton visible. Il en manque un. Le majordome accuse le chat.`),
    sc => P(`<div class="graph-wrap">${svgBarChart([0, 1], ["0", "1"], "Graphique I")}</div> <em>${treeFlavor()}</em> Le graphique I représente une loi de Bernoulli avec $p = 1$.`, true, `Deux bâtons, $p = 1$. Le majordome appelle ça « le triomphe assuré ».`),
    sc => P(`<div class="graph-wrap">${svgBarChart([0.45, 0.55], ["0", "1"], "Graphique J")}</div> <em>${treeFlavor()}</em> Le graphique J représente une loi de Bernoulli.`, true, `Deux bâtons, somme $= 1$. Le majordome est ému, c'est presque équilibré.`),
    sc => P(`<div class="graph-wrap">${svgCurveChart('normal', "Graphique K")}</div> <em>${treeFlavor()}</em> Le graphique K représente une loi de Bernoulli.`, false, `Courbe continue : pas Bernoulli. C'est une cloche, pas une paire de bâtons.`),
    sc => P(`${sc.majordome} dessine un diagramme avec deux bâtons dont les hauteurs valent $0{,}4$ et $0{,}6$. C'est une loi de Bernoulli.`, true, `Deux bâtons sommant à $1$. Le majordome appelle ça « la juste répartition des choses ».`),
    sc => P(`Un diagramme en bâtons à trois barres peut représenter une loi de Bernoulli.`, false, `Non : exactement deux barres. Le majordome est catégorique, et il a raison.`),
    sc => P(`Toute loi de probabilité à deux bâtons sommant à $1$ est une loi de Bernoulli.`, true, `Deux bâtons, somme $1$ $\\Rightarrow$ Bernoulli. C'est la signature du majordome.`),
    sc => P(`${sc.seigneur} croit qu'un diagramme où les deux bâtons ont la même hauteur n'est pas une loi de Bernoulli.`, false, `C'est le cas $p = 0{,}5$. Le majordome soupire avec élégance.`)
  ],
  3: [
    sc => P(`${sc.majordome} répète ${randInt(5, 20)} fois ${sc.action} à ${sc.lieu} dans les mêmes conditions. C'est un schéma de Bernoulli.`, true, `Répétition identique et indépendante. Le majordome appelle ça « la constance des habitudes ».`),
    sc => P(`Dans un schéma de Bernoulli, ${sc.majordome} rappelle que les épreuves sont identiques et indépendantes.`, true, `Définition du schéma. L'indépendance, c'est comme les biscuits : chacun tombe pour soi.`),
    sc => P(`Chaque ${sc.action} d'un schéma de Bernoulli est lui-même une épreuve de Bernoulli.`, true, `Chaque étape $=$ épreuve de Bernoulli. Le majordome appelle ça « la brique élémentaire de la maison ».`),
    sc => P(`${sc.majordome} explique à ${sc.seigneur} qu'un schéma de Bernoulli est la répétition de $n$ épreuves identiques et indépendantes.`, true, `Définition exacte. ${sc.seigneur} note, puis perd la note.`),
    sc => P(`La probabilité de "${sc.succes}" doit rester constante à chaque ${sc.action} pour parler de schéma de Bernoulli.`, true, `Condition « épreuves identiques ». Le majordome appelle ça « la fidélité du paramètre ».`),
    sc => P(`Un schéma de Bernoulli à ${sc.lieu} compte le nombre de "${sc.succes}" sur $n$ ${sc.action}s.`, true, `Compter les succès. Le majordome appelle ça « l'inventaire des bonnes nouvelles ».`),
    sc => P(`Le neveu de la cuisinière tire trois ${sc.objetPl} d'une boîte sans les remettre. C'est un schéma de Bernoulli.`, false, `Sans remise : $p$ change. Le majordome appelle ça « la fuite du paramètre ».`),
    sc => P(`${sc.seigneur} affirme que les épreuves d'un schéma de Bernoulli peuvent être dépendantes, comme les ${sc.objetPl} qui se collent.`, false, `La dépendance contredit la définition. Le majordome note l'idée pour un vaudeville.`),
    sc => P(`Dans un schéma de Bernoulli, ${sc.seigneur} soutient que $p$ peut changer d'une épreuve à l'autre.`, false, `$p$ constant exigé. Le majordome appelle ça « la valse des paramètres ».`),
    sc => P(`${sc.seigneur} dit que les épreuves doivent être simultanées pour être un schéma de Bernoulli.`, false, `Identiques et indépendantes, pas simultanées. ${sc.majordome} propose de relire la définition.`),
    sc => P(`Un schéma de Bernoulli n'exige pas que les épreuves soient identiques.`, false, `Épreuves identiques ET indépendantes. Le majordome est intraitable sur ce point.`),
    sc => P(`Un schéma de Bernoulli à ${sc.lieu} est une seule épreuve de Bernoulli.`, false, `Un schéma $= n$ épreuves. Le majordome appelle ça « le malentendu du dimanche ».`),
    sc => P(`Si à ${sc.lieu} les ${sc.action}s sont faits avec remise, $p$ reste constante : c'est un schéma de Bernoulli.`, true, `Avec remise : $p$ constant. Le majordome appelle ça « la stabilité retrouvée ».`),
    sc => P(`Si le neveu tire un ${sc.objet} puis un autre sans le remettre, c'est un schéma de Bernoulli.`, false, `Sans remise : $p$ change. Le neveu est prié de remettre les objets en place.`),
    sc => P(`${sc.majordome} affirme qu'un schéma de Bernoulli de $n = 1$ est une simple épreuve de Bernoulli.`, true, `$n = 1$ se réduit à une épreuve. C'est le cas dégénéré, mais le majordome l'accepte.`),
    sc => P(`Un schéma de Bernoulli peut avoir un nombre infini d'épreuves.`, false, `Nombre fini $n$. L'infini, c'est pour les discussions de fin de dîner.`),
    sc => P(`Dans un schéma de Bernoulli, on note $n$ le nombre d'épreuves et $p$ la probabilité de succès à chaque épreuve.`, true, `Notation standard $(n, p)$. Le majordome a fait graver ces symboles sur une cuillère.`),
    sc => P(`${sc.seigneur} dit que dans un schéma de Bernoulli, les épreuves sont facultativement indépendantes.`, false, `Indépendance obligatoire. Le majordome appelle ça « le mariage forcé du hasard ».`),
    sc => P(`Un schéma de Bernoulli à ${sc.lieu} de $n = 10$ et $p = 0{,}5$ aura la même loi que $n = 10$ et $p = 0{,}5$ ailleurs.`, true, `Seuls $n$ et $p$ caractérisent la loi. Peu importe le manoir, le Sussex, ou la pluie.`),
    sc => P(`Si ${sc.majordome} répète ${sc.action} trois fois puis change d'objet, on n'a plus un schéma de Bernoulli.`, true, `Changer d'objet change $p$. Le majordome appelle ça « la rupture du protocole ».`),
    sc => P(`Une planche de Galton est une illustration physique d'un schéma de Bernoulli.`, true, `Chaque bille réalise un schéma. Le majordome appelle ça « le billard des probabilités ».`),
    sc => P(`${sc.majordome} dit que le nombre d'épreuves d'un schéma doit être pair.`, false, `Aucune contrainte de parité. Le majordome appelle ça « une superstition de majordome ».`),
    sc => P(`Deux schémas de Bernoulli de même $n$ et même $p$ donnent la même loi binomiale.`, true, `Loi déterminée par $(n, p)$. Le majordome appelle ça « l'égalité des destins probabilistes ».`),
    sc => P(`Un schéma de Bernoulli exige que toutes les épreuves aient la même durée.`, false, `Pas de contrainte de durée. Le temps du thé est sacré, mais pas dans le schéma.`),
    sc => P(`Un schéma de Bernoulli est un cas particulier de loi binomiale.`, false, `L'inverse. La loi binomiale est la loi du nombre de succès d'un schéma de Bernoulli.`)
  ],
  4: TREE_QUESTIONS,
  5: [
    sc => P(`Si $X \\sim \\mathcal{B}(n,p)$, alors $P(X=k) = \\binom{n}{k} \\cdot p^k \\cdot (1-p)^{n-k}$.`, true, `Formule de la loi binomiale. Le majordome l'appelle « la formule du bonheur retrouvé ».`),
    sc => P(`La loi binomiale donne la probabilité d'obtenir $k$ fois "${sc.succes}" en $n$ ${sc.action}s identiques et indépendants.`, true, `Exactement. Le majordome appelle ça « la comptabilité des bons moments ».`),
    sc => P(`$X$, le nombre de "${sc.succes}" sur $n$ ${sc.action}s, compte les succès d'un schéma de Bernoulli.`, true, `Définition de $X$ binomiale. Le majordome appelle ça « la statistique de la satisfaction ».`),
    sc => P(`La loi binomiale est la loi du nombre de succès dans un schéma de Bernoulli.`, true, `Définition. Le majordome l'a fait graver sur une plaque de cuivre, par précaution.`),
    sc => P(`Si $X$ suit $\\mathcal{B}(n,p)$, la somme des $P(X=k)$ pour $k$ de $0$ à $n$ vaut $1$.`, true, `Propriété fondamentale. Le majordome appelle ça « la fermeture du cercle probabiliste ».`),
    sc => P(`Si $X \\sim \\mathcal{B}(n,p)$, alors $P(X=0) = (1-p)^n$.`, true, `$\\binom{n}{0} = 1$, reste $(1-p)^n$. Le majordome appelle ça « le zéro victorieux ».`),
    sc => P(`${sc.seigneur} affirme que $P(X=k) = np$ pour tout $k$.`, false, `Dépend de $k$ ; pas constant. Le majordome appelle ça « la confusion de l'après-midi ».`),
    sc => P(`${sc.majordome} dit qu'on peut appliquer la loi binomiale à des tirages de ${sc.objetPl} sans remise.`, false, `Sans remise : dépendance. Le majordome appelle ça « la tentation de la facilité ».`),
    sc => P(`Dans la formule de la loi binomiale, ${sc.seigneur} pense que l'exposant de $p$ est $n-k$.`, false, `Exposant de $p$ $= k$. Le majordome appelle ça « l'inversion du baron ».`),
    sc => P(`La loi binomiale ne dépend que de $p$, pas de $n$.`, false, `Dépend de $n$ ET $p$. Le majordome appelle ça « l'oubli de la moitié du problème ».`),
    sc => P(`Un tirage avec remise ne peut pas suivre une loi binomiale.`, false, `Avec remise : binomiale s'applique. Le majordome appelle ça « l'exception qui confirme la règle ».`),
    sc => P(`Dans la loi binomiale, le nombre de succès $k$ peut dépasser $n$.`, false, `$k \\in \\{0, \\ldots, n\\}$. Le majordome appelle ça « la soif d'impossible ».`),
    sc => P(`Si $X \\sim \\mathcal{B}(n, p)$, alors $X$ est à valeurs dans $\\{0, 1, \\ldots, n\\}$.`, true, `$X$ compte les succès. Le majordome appelle ça « l'intervalle du possible ».`),
    sc => P(`${sc.majordome} affirme que la loi binomiale est une loi continue.`, false, `Discrète. Le majordome confond parfois les biscuits et la crème anglaise.`),
    sc => P(`La loi binomiale $\\mathcal{B}(0, p)$ est la loi certaine égale à $0$.`, true, `$n = 0$ : $X = 0$. Le majordome appelle ça « la loi du rien-du-tout ».`),
    sc => P(`Si $X \\sim \\mathcal{B}(n, p)$, alors $X$ peut prendre la valeur $n+1$.`, false, `$X \\leq n$. Le majordome appelle ça « l'optimisme déplacé ».`),
    sc => P(`La loi binomiale $\\mathcal{B}(1, p)$ est la loi de Bernoulli de paramètre $p$.`, true, `$\\mathcal{B}(1, p) = \\text{Bernoulli}(p)$. Le majordome appelle ça « le cas minimaliste ».`),
    sc => P(`${sc.seigneur} pense que $P(X=k)$ peut dépasser $1$ pour certaines valeurs de $k$.`, false, `Probabilité $\\leq 1$. Le majordome appelle ça « l'exagération du dimanche ».`),
    sc => P(`Si $X \\sim \\mathcal{B}(n, p)$, alors $P(X=k) = P(X=n-k)$ quand $p = 0{,}5$.`, true, `Symétrie pour $p = 0{,}5$. Le majordome appelle ça « la justice du paramètre ».`),
    sc => P(`La loi binomiale exige que $p$ reste constant sur les $n$ essais.`, true, `Condition du schéma. Le majordome appelle ça « la fidélité du protocole ».`),
    sc => P(`${sc.majordome} dit qu'on peut utiliser la loi binomiale pour une seule épreuve.`, true, `$\\mathcal{B}(1, p)$, cas particulier. Le majordome appelle ça « le minimalisme élégant ».`),
    sc => P(`Si $X \\sim \\mathcal{B}(n, p)$, la somme des $P(X=k)$ pour $k$ de $0$ à $n$ vaut $1$.`, true, `Propriété de toute loi. Le majordome appelle ça « l'unité retrouvée ».`),
    sc => P(`Deux lois binomiales $\\mathcal{B}(n, p)$ et $\\mathcal{B}(n, 1-p)$ sont identiques quand $p = 0{,}5$.`, true, `$p = 1-p = 0{,}5$. Le majordome appelle ça « la fusion des contraires ».`),
    sc => P(`Dans une loi binomiale $\\mathcal{B}(n, p)$, $p$ est obligatoirement plus grand que $0{,}5$.`, false, `Aucune contrainte. Le majordome appelle ça « la tyrannie de la majorité ».`)
  ],
  6: [
    sc => P(`<div class="graph-wrap">${svgBarChart([0.001, 0.01, 0.04, 0.12, 0.21, 0.25, 0.21, 0.12, 0.04, 0.01, 0.001], ["0","1","2","3","4","5","6","7","8","9","10"], "Graphique A")}</div> <em>${treeFlavor()}</em> Le graphique A représente une loi binomiale.`, true, `Symétrique ($n = 10$, $p = 0{,}5$). Le majordome appelle ça « la montagne du hasard ».`),
    sc => P(`<div class="graph-wrap">${svgBarChart([0.1, 0.3, 0.4, 0.2], ["0","1","2","3"], "Graphique B")}</div> <em>${treeFlavor()}</em> Le graphique B représente une loi binomiale.`, true, `Asymétrique ($n = 3$, $p = 0{,}2$). Le majordome appelle ça « la pente du succès modeste ».`),
    sc => P(`<div class="graph-wrap">${svgBarChart([0.2, 0.2, 0.2, 0.2, 0.2], ["0","1","2","3","4"], "Graphique C")}</div> <em>${treeFlavor()}</em> Le graphique C représente une loi binomiale.`, false, `Uniforme : pas binomiale. Le majordome appelle ça « le nivellement par le bas ».`),
    sc => P(`<div class="graph-wrap">${svgCurveChart('normal', "Graphique D")}</div> <em>${treeFlavor()}</em> Le graphique D représente une loi binomiale.`, false, `Courbe continue : binomiale est discrète. Le majordome appelle ça « la fausse piste de la cloche ».`),
    sc => P(`<div class="graph-wrap">${svgBarChart([0.4, 0.1, 0, 0.1, 0.4], ["0","1","2","3","4"], "Graphique E")}</div> <em>${treeFlavor()}</em> Le graphique E représente une loi binomiale.`, false, `En U : pas unimodale. Le majordome appelle ça « la forme en accent circonflexe ».`),
    sc => P(`<div class="graph-wrap">${svgBarChart([0.4, 0.3, 0.2, 0.1], ["0","1","2","3"], "Graphique F")}</div> <em>${treeFlavor()}</em> Le graphique F représente une loi binomiale.`, true, `Décroissant ($n = 3$, $p$ proche de $0$). Le majordome appelle ça « la descente du succès ».`),
    sc => P(`<div class="graph-wrap">${svgBarChart([0.25, 0.5, 0.25], ["0","1","2"], "Graphique G")}</div> <em>${treeFlavor()}</em> Le graphique G représente une loi binomiale.`, true, `Symétrique ($n = 2$, $p = 0{,}5$). Le majordome appelle ça « le triangle équilibré ».`),
    sc => P(`<div class="graph-wrap">${svgBarChart([0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], ["0","1","2","3","4","5","6","7","8","9"], "Graphique H")}</div> <em>${treeFlavor()}</em> Le graphique H représente une loi binomiale.`, false, `Uniforme : pas binomiale. Le majordome appelle ça « l'ennui statistique absolu ».`),
    sc => P(`Le diagramme d'une loi binomiale a toujours exactement $n+1$ bâtons.`, true, `De $0$ à $n$ : $n+1$ valeurs. Le majordome appelle ça « la comptabilité des bâtons ».`),
    sc => P(`${sc.majordome} affirme que le diagramme d'une loi binomiale est toujours symétrique.`, false, `Symétrique seulement si $p = 0{,}5$. Le majordome appelle ça « l'excès d'optimisme ».`),
    sc => P(`Une loi binomiale $\\mathcal{B}(2, 0{,}5)$ a un diagramme à $3$ bâtons.`, true, `$n = 2 \\to 3$ bâtons. Le majordome appelle ça « la trinité des probabilités ».`),
    sc => P(`${sc.seigneur} croit que le pic du diagramme binomial est au centre quand $p = 0{,}9$.`, false, `Pic proche de $np = 0{,}9n$, à droite. Le majordome appelle ça « la soif du sommet ».`),
    sc => P(`Un diagramme binomial en U (deux pics) est impossible.`, true, `Unimodale. Le majordome appelle ça « la monarchie du pic unique ».`),
    sc => P(`Le diagramme de la loi binomiale est toujours une courbe continue.`, false, `Discrète : diagramme en bâtons. Le majordome appelle ça « la confusion des genres ».`),
    sc => P(`Si $p = 0{,}5$, le diagramme de $\\mathcal{B}(n, p)$ est symétrique autour de $n/2$.`, true, `Symétrie pour $p = 0{,}5$. Le majordome appelle ça « la parfaite balance ».`),
    sc => P(`<div class="graph-wrap">${svgBarChart([0.09, 0.42, 0.49], ["0", "1", "2"], "Graphique I")}</div> <em>${treeFlavor()}</em> Le graphique I représente une loi binomiale.`, true, `$n = 2$, $p = 0{,}7$ (asymétrie). Le majordome appelle ça « la fuite vers la droite ».`),
    sc => P(`<div class="graph-wrap">${svgBarChart([0.25, 0.5, 0.25], ["0", "1", "2"], "Graphique J")}</div> <em>${treeFlavor()}</em> Le graphique J représente la loi binomiale $\\mathcal{B}(2, 0{,}5)$.`, true, `Symétrique. Le majordome appelle ça « le triangle d'or du hasard ».`),
    sc => P(`<div class="graph-wrap">${svgBarChart([0.5, 0.5], ["0", "1"], "Graphique K")}</div> <em>${treeFlavor()}</em> Le graphique K représente la loi binomiale $\\mathcal{B}(1, 0{,}5)$.`, true, `$n = 1$, $p = 0{,}5$. Le majordome appelle ça « le duo parfait ».`),
    sc => P(`<div class="graph-wrap">${svgBarChart([0.4, 0.1, 0, 0.1, 0.4], ["0","1","2","3","4"], "Graphique L")}</div> <em>${treeFlavor()}</em> Le graphique L représente une loi binomiale.`, false, `En U : impossible. Le majordome appelle ça « la forme en accent aigu ».`),
    sc => P(`<div class="graph-wrap">${svgBarChart([0.6, 0.3, 0.1], ["0","1","2"], "Graphique M")}</div> <em>${treeFlavor()}</em> Le graphique M représente une loi binomiale.`, true, `Décroissant ($n = 2$, $p < 0{,}5$). Le majordome appelle ça « la pente du succès contrarié ».`)
  ],
  7: PYTHON_QUESTIONS,
  8: [
    sc => P(`${sc.majordome} a noté : $\\binom{n}{k} = \\dfrac{n!}{k!\\,(n-k)!}$.`, true, `Formule du coefficient binomial. Le majordome appelle ça « la recette du nombre de choix ».`),
    sc => P(`$\\binom{n}{k} = \\binom{n}{n-k}$.`, true, `Symétrie. Le majordome appelle ça « l'égalité des destins ».`),
    sc => P(`$\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}$.`, true, `Relation de Pascal. Le majordome appelle ça « la récurrence élégante ».`),
    sc => P(`${sc.majordome} rappelle que $\\binom{n}{0} = 1$ pour tout $n \\geq 0$.`, true, `Une seule façon de ne rien choisir. Le majordome appelle ça « le choix du vide ».`),
    sc => P(`${sc.seigneur} affirme que $\\binom{n}{1} = n$ pour tout $n \\geq 1$.`, true, `$n$ façons de choisir $1$ objet. Le majordome appelle ça « l'évidence du un ».`),
    (sc) => { const n = randInt(5, 9), k = randInt(1, n-1), v = comb(n, k);
      return P(`${sc.majordome} calcule : $\\binom{${n}}{${k}} = ${v}$.`, true, `$\\binom{${n}}{${k}} = ${v}$. Le majordome appelle ça « un calcul de routine ».`); },
    sc => P(`$\\binom{n}{k} = \\dfrac{n!}{(n-k)!}$.`, false, `Manque $k!$ au dénominateur. Le majordome appelle ça « l'oubli fatal ».`),
    sc => P(`$\\binom{n}{k} = n^k$.`, false, `Faux. Le majordome appelle ça « l'invention du baron ».`),
    sc => P(`$\\binom{n}{k} = \\binom{n-1}{k-1} \\times \\binom{n-1}{k}$.`, false, `Pascal = SOMME. Le majordome appelle ça « la multiplication usurpatrice ».`),
    sc => P(`$\\binom{n}{0} = 0$ pour tout $n \\geq 0$.`, false, `$\\binom{n}{0} = 1$. Le majordome appelle ça « le zéro usurpateur ».`),
    (sc) => { const n = randInt(4, 8), k = randInt(1, n-1), v = comb(n, k) + randInt(1, 10);
      return P(`${sc.seigneur} affirme que $\\binom{${n}}{${k}} = ${v}$.`, false, `$\\binom{${n}}{${k}} = ${comb(n, k)}$. Le majordome appelle ça « la fantaisie du baron ».`); },
    sc => P(`$\\binom{n}{k} = \\binom{n-1}{k} - \\binom{n-1}{k-1}$.`, false, `Somme, pas différence. Le majordome appelle ça « la soustraction abusive ».`),
    sc => P(`$\\binom{n}{n} = 1$ pour tout $n \\geq 0$.`, true, `Une seule façon de choisir $n$ parmi $n$. Le majordome appelle ça « l'unanimité triomphante ».`),
    sc => P(`$\\binom{n}{n-1} = n$ pour tout $n \\geq 1$.`, true, `Choisir $n-1$ = exclure un objet. Le majordome appelle ça « l'exclusion stratégique ».`),
    sc => P(`$\\binom{n}{2} = \\dfrac{n(n-1)}{2}$.`, true, `Formule classique. Le majordome appelle ça « la poignée de main universelle ».`),
    sc => P(`$\\binom{5}{2} = 10$.`, true, `$5 \\times 4 / 2 = 10$. Le majordome appelle ça « la multiplication des occasions ».`),
    sc => P(`$\\binom{6}{3} = 20$.`, true, `$720 / 36 = 20$. Le majordome appelle ça « la juste mesure du choix ».`),
    sc => P(`$\\binom{n}{k}$ est toujours strictement positif pour $0 \\leq k \\leq n$.`, true, `Nombre de choix $\\geq 1$. Le majordome appelle ça « l'optimisme combinatoire ».`),
    sc => P(`${sc.majordome} affirme que $\\binom{4}{2} = \\binom{4}{3}$.`, false, `$6 \\neq 4$. Le majordome appelle ça « la confusion du jeudi ».`),
    sc => P(`$\\binom{5}{1} = 5$.`, true, `$5$ façons de choisir $1$ parmi $5$. Le majordome appelle ça « l'évidence du rang ».`),
    sc => P(`$\\binom{5}{0} + \\binom{5}{1} + \\binom{5}{2} + \\binom{5}{3} + \\binom{5}{4} + \\binom{5}{5} = 32$.`, true, `Somme $= 2^5 = 32$. Le majordome appelle ça « la somme triomphale ».`),
    sc => P(`$\\binom{n}{k}$ est toujours un entier.`, true, `C'est un nombre de choix. Le majordome appelle ça « l'évidence naturelle ».`),
    sc => P(`$\\binom{n}{k} = \\binom{n+1}{k} - \\binom{n}{k-1}$.`, false, `Pas Pascal. Le majordome appelle ça « l'invention du facteur ».`),
    sc => P(`$\\binom{n}{k} = 0$ quand $k > n$.`, true, `Impossible de choisir plus que disponible. Le majordome appelle ça « la dure réalité du possible ».`),
    sc => P(`$\\binom{n}{0} = n$.`, false, `$\\binom{n}{0} = 1$. Le majordome appelle ça « la confusion du zéro ».`),
    sc => P(`$\\binom{8}{4} = 70$.`, true, `$40320 / 576 = 70$. Le majordome appelle ça « la beauté du nombre 70 ».`)
  ],
  9: [
    sc => P(`Pour $X \\sim \\mathcal{B}(n,p)$, ${sc.majordome} affirme que $E(X) = np$.`, true, `$E(X) = np$. Le majordome appelle ça « la moyenne des jours heureux ».`),
    sc => P(`Pour $X \\sim \\mathcal{B}(n,p)$, la variance vaut $np(1-p)$.`, true, `$V(X) = np(1-p)$. Le majordome appelle ça « la dispersion des biscuits ».`),
    sc => P(`L'écart-type d'une loi $\\mathcal{B}(n,p)$ est $\\sqrt{np(1-p)}$.`, true, `$\\sigma = \\sqrt{V}$. Le majordome appelle ça « la racine de l'incertitude ».`),
    (sc) => { const n = randInt(8, 40), p = randInt(10, 80) / 100;
      return P(`Pour $X \\sim \\mathcal{B}(${n}, ${fr(p, 2)})$, $E(X) = ${fr(n*p, 2)}$.`, true, `$E(X) = ${n} \\times ${fr(p, 2)} = ${fr(n*p, 2)}$. Le majordome appelle ça « le calcul du dimanche ».`); },
    sc => P(`L'espérance d'une loi binomiale peut être non entière.`, true, `$np$ pas nécessairement entier. Le majordome appelle ça « le droit à l'à-peu-près ».`),
    sc => P(`L'espérance est la valeur moyenne à long terme.`, true, `Loi des grands nombres. Le majordome appelle ça « la sagesse des moyennes ».`),
    sc => P(`Pour $X \\sim \\mathcal{B}(n,p)$, ${sc.seigneur} affirme que $V(X) = np$.`, false, `$V(X) = np(1-p)$. Le majordome appelle ça « l'oubli du $q$ ».`),
    sc => P(`Pour $X \\sim \\mathcal{B}(n,p)$, $E(X) = p$.`, false, `$E(X) = np$. Le majordome appelle ça « l'oubli du $n$ ».`),
    sc => P(`La variance d'une loi binomiale peut être négative.`, false, `Toujours $\\geq 0$. Le majordome appelle ça « l'impossible pessimisme mathématique ».`),
    sc => P(`L'écart-type d'une loi $\\mathcal{B}(n,p)$ est $np$.`, false, `C'est $\\sqrt{np(1-p)}$. Le majordome appelle ça « la confusion de la moyenne et de la racine ».`),
    (sc) => { const n = randInt(8, 30), p = randInt(10, 70) / 100;
      return P(`Pour $X \\sim \\mathcal{B}(${n}, ${fr(p, 2)})$, $E(X) = ${fr(n*p + randInt(1, 3), 2)}$.`, false, `$E(X) = ${fr(n*p, 2)}$. Le majordome appelle ça « l'erreur du majordome pressé ».`); },
    sc => P(`Pour $X \\sim \\mathcal{B}(n,p)$, ${sc.majordome} pense que $E(X) = n + p$.`, false, `$E(X) = np$. Le majordome appelle ça « l'addition trompeuse ».`),
    sc => P(`Si $X \\sim \\mathcal{B}(10, 0{,}3)$, alors $E(X) = 3$.`, true, `$10 \\times 0{,}3 = 3$. Le majordome appelle ça « la multiplication heureuse ».`),
    sc => P(`Si $X \\sim \\mathcal{B}(10, 0{,}3)$, alors $V(X) = 2{,}1$.`, true, `$10 \\times 0{,}3 \\times 0{,}7 = 2{,}1$. Le majordome appelle ça « la variance du quotidien ».`),
    sc => P(`Si $X \\sim \\mathcal{B}(20, 0{,}5)$, alors $E(X) = 10$.`, true, `$20 \\times 0{,}5 = 10$. Le majordome appelle ça « l'équilibre parfait ».`),
    sc => P(`Si $X \\sim \\mathcal{B}(20, 0{,}5)$, alors $\\sigma(X) = \\sqrt{5}$.`, true, `$V=5$, $\\sigma = \\sqrt{5}$. Le majordome appelle ça « la racine de l'équilibre ».`),
    sc => P(`${sc.majordome} calcule $E(X) = 2$ pour $X \\sim \\mathcal{B}(10, 0{,}4)$.`, false, `$10 \\times 0{,}4 = 4$. Le majordome appelle ça « l'erreur du jeudi soir ».`),
    sc => P(`Si $E(X) = 12$ et $n = 30$, alors $p = 0{,}4$.`, true, `$12/30 = 0{,}4$. Le majordome appelle ça « la division élégante ».`),
    sc => P(`L'écart-type est le carré de la variance.`, false, `La variance est le carré de l'écart-type. Le majordome appelle ça « l'inversion du café ».`),
    sc => P(`La variance de $\\mathcal{B}(n, p)$ vaut toujours $np$.`, false, `$V = np(1-p)$. Le majordome appelle ça « l'oubli du dimanche ».`),
    sc => P(`$E(X)$ est nécessairement un entier.`, false, `$np$ peut être non entier. Le majordome appelle ça « le droit à la fraction ».`),
    sc => P(`Si $p = 0{,}5$, alors $V(X) = np/2$.`, true, `$V = np(1-0{,}5) = np/2$. Le majordome appelle ça « la réduction harmonieuse ».`),
    sc => P(`Pour $X \\sim \\mathcal{B}(n, p)$, on a $V(X) \\leq E(X)$.`, true, `$np(1-p) \\leq np$. Le majordome appelle ça « la modestie de la variance ».`),
    sc => P(`${sc.seigneur} pense que la variance peut dépasser $n$.`, false, `$V = np(1-p) \\leq n/4$. Le majordome appelle ça « l'exagération du baron ».`),
    sc => P(`Pour une loi binomiale, $E(X)$ et $V(X)$ sont liés : $V(X) = E(X) \\times (1-p)$.`, true, `$E = np$, $V = np(1-p)$. Le majordome appelle ça « la parenté des indicateurs ».`)
  ],
  10: [
    sc => P(`Pour $p = 0{,}5$, le diagramme en bâtons de la loi binomiale est symétrique.`, true, `Symétrie $p = 0{,}5$. Le majordome appelle ça « le juste milieu ».`),
    sc => P(`Pour $p < 0{,}5$, le diagramme s'étire vers la droite.`, true, `Asymétrie positive. Le majordome appelle ça « la queue du succès rare ».`),
    sc => P(`Pour $p > 0{,}5$, le diagramme s'étire vers la gauche.`, true, `Asymétrie négative. Le majordome appelle ça « la queue du succès fréquent ».`),
    sc => P(`Quand $n$ augmente à $p$ fixé, le diagramme se resserre autour de $np$.`, true, `Resserrement relatif. Le majordome appelle ça « la concentration du hasard ».`),
    sc => P(`Le pic du diagramme est situé au voisinage de $np$.`, true, `Mode $\\approx np$. Le majordome appelle ça « la colline du succès probable ».`),
    (sc) => { const n = randInt(8, 20);
      return P(`Pour $X \\sim \\mathcal{B}(${n}, 0{,}5)$, le pic est à $k = ${Math.round(n/2)}$.`, true, `Pour $p = 0{,}5$, pic à $n/2$. Le majordome appelle ça « le sommet de l'équilibre ».`); },
    sc => P(`Le maximum du diagramme est toujours à $k = n/2$, quelle que soit $p$.`, false, `Pic $\\approx np$. Le majordome appelle ça « l'illusion du centre ».`),
    sc => P(`Le diagramme de la loi binomiale est toujours symétrique.`, false, `Seulement si $p = 0{,}5$. Le majordome appelle ça « l'exception du milieu ».`),
    sc => P(`Quand $n$ augmente, le diagramme devient plat.`, false, `Resserrement autour de $np$. Le majordome appelle ça « le contraire de la soupe ».`),
    sc => P(`Pour $p < 0{,}5$, le diagramme s'étire vers la gauche.`, false, `Vers la droite. Le majordome appelle ça « l'inversion de la queue ».`),
    sc => P(`Le pic du diagramme est toujours à $k = 0$.`, false, `Pic $\\approx np$. Le majordome appelle ça « le fantasme du zéro roi ».`),
    (sc) => { const n = randInt(6, 15), p = 0.3;
      return P(`Pour $X \\sim \\mathcal{B}(${n}, 0{,}3)$, le pic est au voisinage de $k = ${Math.round(n*p) + 3}$.`, false, `$np = ${fr(n*p, 2)}$. Le majordome appelle ça « le décalage du facteur ».`); },
    sc => P(`Pour $n = 10$ et $p = 0{,}3$, le pic du diagramme est proche de $k = 3$.`, true, `$np = 3$. Le majordome appelle ça « la justesse du calcul ».`),
    sc => P(`Pour $n = 100$ et $p = 0{,}5$, le diagramme est très resserré autour de $k = 50$.`, true, `Grand $n$ : resserrement. Le majordome appelle ça « la précision du grand nombre ».`),
    sc => P(`${sc.majordome} affirme que pour $p = 0{,}1$, le diagramme a son pic à $k = n$.`, false, `Pic proche de $0{,}1n$. Le majordome appelle ça « l'optimisme exagéré ».`),
    sc => P(`Pour $n = 1$, le diagramme binomial a $2$ bâtons.`, true, `$k \\in \\{0, 1\\}$. Le majordome appelle ça « le duo de départ ».`),
    sc => P(`Quand $p$ augmente ($n$ fixe), le pic se déplace vers la droite.`, true, `Pic $\\approx np$. Le majordome appelle ça « la migration du sommet ».`),
    sc => P(`Pour $p = 0{,}5$ et $n = 6$, les bâtons de $k = 2$ et $k = 4$ ont la même hauteur.`, true, `Symétrie autour de $n/2 = 3$. Le majordome appelle ça « la parfaite symétrie ».`),
    sc => P(`${sc.seigneur} affirme que le diagramme binomial est plat quand $n$ augmente.`, false, `Il se resserre. Le majordome appelle ça « la confusion du baron ».`),
    sc => P(`Deux lois binomiales de même $n$ et même $p$ ont le même diagramme.`, true, `Même loi. Le majordome appelle ça « l'égalité des destins ».`),
    sc => P(`Pour $p = 0{,}5$ et $n$ grand, le diagramme ressemble à une courbe en cloche.`, true, `Moivre–Laplace. Le majordome appelle ça « la cloche de la sagesse ».`),
    sc => P(`Un diagramme en bâtons avec des hauteurs asymétriques peut représenter une loi binomiale.`, true, `Cas $p \\neq 0{,}5$. Le majordome appelle ça « la beauté de l'asymétrie ».`),
    sc => P(`Le diagramme binomial est toujours symétrique.`, false, `Symétrie $p = 0{,}5$ uniquement. Le majordome appelle ça « l'exception du milieu ».`),
    sc => P(`Plus $n$ est grand, plus le diagramme binomial a de bâtons.`, true, `$n+1$ bâtons. Le majordome appelle ça « la croissance du nombre de bâtons ».`),
    sc => P(`${sc.majordome} pense que la position du pic ne dépend que de $n$.`, false, `Dépend de $np$. Le majordome appelle ça « l'oubli du paramètre $p$ ».`)
  ],
  11: [
    sc => P(`Une planche de Galton à ${sc.lieu} illustre la loi binomiale : chaque bille rebondit à gauche ou à droite.`, true, `Chaque rebond $=$ Bernoulli. Le majordome appelle ça « le billard des probabilités ».`),
    sc => P(`Chaque bille suit un chemin indépendant des autres.`, true, `Indépendance des trajets. Le majordome appelle ça « l'individualisme des billes ».`),
    sc => P(`La probabilité qu'une bille arrive dans le bac $k$ est $\\binom{n}{k} \\cdot p^k \\cdot (1-p)^{n-k}$.`, true, `Application directe. Le majordome appelle ça « la formule du bac à sable ».`),
    sc => P(`Dans une planche équilibrée ($p = 0{,}5$), les bacs centraux sont les plus probables.`, true, `Loi symétrique $p = 0{,}5$. Le majordome appelle ça « la démocratie des bacs ».`),
    sc => P(`Il y a $n+1$ bacs pour $n$ rangées de clous.`, true, `De $0$ à $n$ : $n+1$ bacs. Le majordome appelle ça « la comptabilité des bacs ».`),
    sc => P(`Le trajet d'une bille est un chemin dans un arbre de Bernoulli.`, true, `Chaque embranchement $=$ Bernoulli. Le majordome appelle ça « l'arbre des chemins perdus ».`),
    sc => P(`Toutes les billes finissent dans le même bac.`, false, `Réparties selon la loi binomiale. Le majordome appelle ça « le fantasme du bac unique ».`),
    sc => P(`La planche de Galton n'a aucun lien avec la loi binomiale.`, false, `Illustration classique. Le majordome appelle ça « la calomnie de la planche ».`),
    sc => P(`Chaque bille ne passe que par un seul clou.`, false, `Suite de clous. Le majordome appelle ça « le raccourci impossible ».`),
    sc => P(`Il y a $n$ bacs pour $n$ rangées de clous.`, false, `$n+1$ bacs. Le majordome appelle ça « l'erreur du comptage ».`),
    sc => P(`Les bacs latéraux sont toujours les plus probables.`, false, `Pour $p = 0{,}5$, centraux. Le majordome appelle ça « l'inversion des pôles ».`),
    sc => P(`Les trajets des billes sont dépendants.`, false, `Indépendants. Le majordome appelle ça « la contagion improbable ».`),
    sc => P(`Une planche de Galton avec $5$ rangées produit $6$ bacs possibles.`, true, `$n+1 = 6$. Le majordome appelle ça « le compte juste ».`),
    sc => P(`Chaque rebond d'une bille est une épreuve de Bernoulli.`, true, `Deux issues : gauche/droite. Le majordome appelle ça « le rebond philosophique ».`),
    sc => P(`Dans une planche équilibrée, le bac central est le plus probable.`, true, `Pic à $n/2$. Le majordome appelle ça « le trône du centre ».`),
    sc => P(`${sc.majordome} affirme que toutes les billes font le même nombre de rebonds.`, true, `Chacune fait $n$ rebonds. Le majordome appelle ça « l'égalité des parcours ».`),
    sc => P(`Une planche de Galton à $1$ rangée est une simple épreuve de Bernoulli.`, true, `$n = 1$. Le majordome appelle ça « le minimalisme de la planche ».`),
    sc => P(`Plus il y a de rangées, plus la distribution ressemble à une courbe de Gauss.`, true, `Moivre–Laplace. Le majordome appelle ça « la cloche du grand nombre ».`),
    sc => P(`${sc.seigneur} affirme que les billes s'attirent entre elles.`, false, `Indépendantes. Le majordome appelle ça « la romance des billes ».`),
    sc => P(`La planche de Galton illustre uniquement la loi normale, pas la binomiale.`, false, `Elle illustre d'abord la binomiale. Le majordome appelle ça « l'oubli du point de départ ».`),
    sc => P(`Une planche de Galton a exactement un bac par rangée.`, false, `$n+1$ bacs. Le majordome appelle ça « l'erreur de l'arithmétique ».`),
    sc => P(`Pour $p = 0{,}5$, la répartition des billes est symétrique.`, true, `Loi symétrique. Le majordome appelle ça « l'équilibre des bacs ».`),
    sc => P(`Une planche de Galton avec $p = 0{,}7$ pousse les billes vers la droite.`, true, `Plus de rebonds à droite. Le majordome appelle ça « la dérive du hasard ».`),
    sc => P(`Une bille qui fait $k$ rebonds à droite finit dans le bac $k$.`, true, `Numérotation classique. Le majordome appelle ça « la correspondance des bacs ».`),
    sc => P(`${sc.majordome} affirme qu'une planche de Galton avec plus de rangées donne un diagramme plus pointu.`, true, `Resserrement quand $n$ augmente. Le majordome appelle ça « la pointe de la précision ».`)
  ],
  12: [
    sc => P(`Pour $n$ grand, la loi $\\mathcal{B}(n,p)$ peut être approchée par une loi normale.`, true, `Moivre–Laplace. Le majordome appelle ça « le mariage des lois ».`),
    sc => P(`En pratique, on utilise $np \\geq 5$ et $n(1-p) \\geq 5$.`, true, `Conditions usuelles. Le majordome appelle ça « la règle du majordome prudent ».`),
    sc => P(`L'approximation normale a pour moyenne $np$.`, true, `Même moyenne. Le majordome appelle ça « la conservation de l'équilibre ».`),
    sc => P(`L'approximation normale a pour écart-type $\\sqrt{np(1-p)}$.`, true, `Même écart-type. Le majordome appelle ça « la conservation de la dispersion ».`),
    sc => P(`Pour $n$ grand, $\\mathcal{B}(n,p) \\approx \\mathcal{N}(np, \\sqrt{np(1-p)})$.`, true, `Énoncé du théorème. Le majordome appelle ça « la cloche universelle ».`),
    sc => P(`L'approximation normale nécessite $n$ grand.`, true, `Asymptotique. Le majordome appelle ça « la sagesse du grand nombre ».`),
    sc => P(`L'écart-type de l'approximation normale est $np$.`, false, `C'est $\\sqrt{np(1-p)}$. Le majordome appelle ça « l'oubli de la racine ».`),
    sc => P(`L'approximation normale est valable pour tout $n$ et tout $p$.`, false, `Conditions requises. Le majordome appelle ça « l'illusion de l'universel ».`),
    sc => P(`L'approximation normale remplace la binomiale par une loi de Poisson.`, false, `Loi NORMALE, pas Poisson. Le majordome appelle ça « l'erreur du dimanche ».`),
    sc => P(`L'approximation normale est valable pour $n$ petit.`, false, `$n$ grand. Le majordome appelle ça « l'illusion du raccourci ».`),
    sc => P(`L'approximation normale a pour moyenne $n$.`, false, `Moyenne $= np$. Le majordome appelle ça « l'oubli du paramètre ».`),
    sc => P(`La loi normale d'approximation a pour écart-type $\\sqrt{np}$.`, false, `$\\sqrt{np(1-p)}$. Le majordome appelle ça « l'oubli du $1-p$ ».`),
    sc => P(`Moivre–Laplace relie la loi binomiale à la loi normale.`, true, `Théorème fondamental. Le majordome appelle ça « le pont entre les lois ».`),
    sc => P(`L'approximation normale est meilleure quand $p$ est proche de $0{,}5$.`, true, `Cas favorable. Le majordome appelle ça « la zone de confort ».`),
    sc => P(`Pour $X \\sim \\mathcal{B}(100, 0{,}3)$, on peut approcher par $\\mathcal{N}(30, \\sqrt{21})$.`, true, `$np = 30$, $\\sqrt{21}$. Le majordome appelle ça « le calcul du siècle ».`),
    sc => P(`L'approximation normale donne la même espérance que la binomiale.`, true, `Même moyenne $np$. Le majordome appelle ça « la conservation de l'essentiel ».`),
    sc => P(`${sc.majordome} affirme que l'approximation normale nécessite $n \\geq 30$.`, false, `Critère : $np \\geq 5$ et $n(1-p) \\geq 5$. Le majordome appelle ça « la règle du majordome prudent ».`),
    sc => P(`Pour $n = 10$ et $p = 0{,}1$, l'approximation normale est fiable.`, false, `$np = 1 < 5$. Le majordome appelle ça « l'optimisme déplacé ».`),
    sc => P(`Moivre–Laplace est dû à Laplace seul.`, false, `De Moivre et Laplace. Le majordome appelle ça « l'oubli du premier contributeur ».`),
    sc => P(`L'approximation normale s'applique aussi aux lois uniformes discrètes.`, false, `Spécifique à la binomiale. Le majordome appelle ça « la fausse généralité ».`),
    sc => P(`Pour $n = 500$ et $p = 0{,}4$, on peut approcher par $\\mathcal{N}(200, \\sqrt{120})$.`, true, `$np = 200$, $\\sqrt{120}$. Le majordome appelle ça « le triomphe du grand nombre ».`),
    sc => P(`Moivre–Laplace est indispensable en Première pour calculer $P(X=k)$.`, false, `Culture, pas exigible en Première. Le majordome appelle ça « la fausse exigence ».`),
    sc => P(`L'écart-type de l'approximation normale est $\\sqrt{np(1-p)}$.`, true, `Même écart-type. Le majordome appelle ça « la fidélité de la dispersion ».`),
    sc => P(`${sc.seigneur} croit que l'approximation normale est exacte.`, false, `Approximation. Le majordome appelle ça « l'illusion de la perfection ».`),
    sc => P(`La loi normale d'approximation est centrée en $np$.`, true, `Même moyenne. Le majordome appelle ça « le centre de gravité du hasard ».`)
  ],
  13: [
    sc => P(`<div class="graph-wrap">${svgCurveChart('normal', "Graphique A")}</div> <em>${treeFlavor()}</em> Le graphique A représente une loi normale.`, true, `Courbe en cloche. Le majordome appelle ça « la cloche du dimanche ».`),
    sc => P(`<div class="graph-wrap">${svgCurveChart('normal_broad', "Graphique B")}</div> <em>${treeFlavor()}</em> Le graphique B représente une loi normale.`, true, `Courbe évasée : $\\sigma$ grand. Le majordome appelle ça « la cloche épanouie ».`),
    sc => P(`<div class="graph-wrap">${svgCurveChart('uniform', "Graphique C")}</div> <em>${treeFlavor()}</em> Le graphique C représente une loi normale.`, false, `Loi uniforme, pas normale. Le majordome appelle ça « la fausse cloche ».`),
    sc => P(`<div class="graph-wrap">${svgCurveChart('skew', "Graphique D")}</div> <em>${treeFlavor()}</em> Le graphique D représente une loi normale.`, false, `Asymétrique : normale toujours symétrique. Le majordome appelle ça « la cloche de travers ».`),
    sc => P(`<div class="graph-wrap">${svgBarChart([0.01, 0.05, 0.15, 0.35, 0.35, 0.15, 0.05, 0.01], ["0","1","2","3","4","5","6","7"], "Graphique E")}</div> <em>${treeFlavor()}</em> Le graphique E représente une loi normale.`, false, `Diagramme en bâtons : discret. Le majordome appelle ça « la fausse piste du bâton ».`),
    sc => P(`<div class="graph-wrap">${svgCurveChart('normal', "Graphique F")}</div> <em>${treeFlavor()}</em> Le graphique F représente une loi normale (avec $\\mu < 0$).`, true, `Centrée n'importe où. Le majordome appelle ça « la cloche voyageuse ».`),
    sc => P(`<div class="graph-wrap">${svgBarChart([0.1, 0.2, 0.4, 0.2, 0.1], ["0","1","2","3","4"], "Graphique G")}</div> <em>${treeFlavor()}</em> Le graphique G représente une loi normale.`, false, `Diagramme en bâtons. Le majordome appelle ça « la confusion des genres ».`),
    sc => P(`${sc.majordome} affirme qu'une loi normale peut avoir une courbe en U.`, false, `Toujours en cloche. Le majordome appelle ça « l'invention de l'asymétrie ».`),
    sc => P(`Une loi normale est toujours symétrique.`, true, `Symétrie par rapport à $\\mu$. Le majordome appelle ça « la symétrie éternelle ».`),
    sc => P(`${sc.seigneur} croit que la loi normale a un support fini.`, false, `Support $= \\mathbb{R}$. Le majordome appelle ça « l'infini du baron ».`),
    sc => P(`Deux lois normales de même $\\mu$ et $\\sigma$ sont identiques.`, true, `Déterminée par $(\\mu, \\sigma)$. Le majordome appelle ça « l'égalité des cloches ».`),
    sc => P(`Une loi normale avec $\\sigma = 0$ est possible.`, false, `$\\sigma > 0$ strictement. Le majordome appelle ça « l'impossible platitude ».`),
    sc => P(`La loi normale est la seule loi en cloche.`, false, `D'autres lois aussi. Le majordome appelle ça « l'illusion de l'unicité ».`),
    sc => P(`Une loi normale $\\mathcal{N}(0, 1)$ est dite centrée réduite.`, true, `$\\mu = 0$, $\\sigma = 1$. Le majordome appelle ça « la cloche de référence ».`),
    sc => P(`La courbe de Gauss peut être asymétrique si $\\mu \\neq 0$.`, false, `Toujours symétrique. Le majordome appelle ça « l'illusion du déplacement ».`),
    sc => P(`<div class="graph-wrap">${svgCurveChart('normal', "Graphique H")}</div> <em>${treeFlavor()}</em> Le graphique H représente une loi normale centrée.`, true, `Courbe en cloche. Le majordome appelle ça « la cloche de la maison ».`),
    sc => P(`<div class="graph-wrap">${svgCurveChart('normal_broad', "Graphique I")}</div> <em>${treeFlavor()}</em> Le graphique I représente une loi normale de grand écart-type.`, true, `Courbe plus étalée. Le majordome appelle ça « la cloche épanouie ».`),
    sc => P(`${sc.majordome} affirme qu'une courbe en cloche peut être asymétrique pour la loi normale.`, false, `Toujours symétrique. Le majordome appelle ça « l'invention de l'asymétrie ».`),
    sc => P(`${sc.seigneur} croit que la loi normale est définie sur $[0, 1]$ seulement.`, false, `Support $= \\mathbb{R}$. Le majordome appelle ça « l'enfermement du baron ».`),
    sc => P(`La densité de la loi normale est toujours positive.`, true, `Densité strictement positive. Le majordome appelle ça « l'optimisme de la densité ».`)
  ],
  14: PYTHON_QUESTIONS,
  15: [
    sc => P(`Dans le code de la loi binomiale, on pose $q = 1 - p$.`, true, `$q = $ probabilité d'échec. Le majordome appelle ça « l'éternel second ».`),
    sc => P(`$P[0] = q^n$.`, true, `$P(X=0) = q^n$. Le majordome appelle ça « le zéro triomphant ».`),
    sc => P(`$\\dfrac{\\binom{n}{k+1}}{\\binom{n}{k}} = \\dfrac{n-k}{k+1}$.`, true, `Identité binomiale. Le majordome appelle ça « la récurrence dorée ».`),
    sc => P(`La ligne correcte dans la boucle est : <code>P.append(P[-1] * (n-k)/(k+1) * p/q)</code>.`, true, `Rapport $\\binom{n}{k+1}/\\binom{n}{k} \\times p/q$. Le majordome appelle ça « la formule du majordome averti ».`),
    sc => P(`La fonction retourne la liste des probabilités $P(X=k)$ pour $k$ de $0$ à $n$.`, true, `Construit $P[0], \\ldots, P[n]$. Le majordome appelle ça « la distribution du bonheur ».`),
    sc => P(`$P(X=0) = q^n$, ce qui explique l'initialisation <code>P = [q**n]</code>.`, true, `Initialisation cohérente. Le majordome appelle ça « le point de départ obligé ».`),
    sc => P(`La ligne correcte est : <code>P.append(P[-1] * (k+1)/(n-k) * p/q)</code>.`, false, `Rapport inversé. Le majordome appelle ça « l'inversion fatale ».`),
    sc => P(`La ligne correcte est : <code>P.append(P[-1] * p/q)</code> sans coefficient binomial.`, false, `Manque le coefficient. Le majordome appelle ça « l'oubli du coefficient ».`),
    sc => P(`La fonction retourne une seule probabilité.`, false, `Retourne une liste. Le majordome appelle ça « la confusion du retour ».`),
    sc => P(`La fonction retourne une chaîne de caractères.`, false, `Retourne une liste. Le majordome appelle ça « l'erreur du type ».`),
    sc => P(`On initialise <code>P = [p^n]</code>.`, false, `On initialise <code>P = [q^n]</code>. Le majordome appelle ça « l'inversion de l'initialisation ».`),
    sc => P(`$\\dfrac{\\binom{n}{k+1}}{\\binom{n}{k}} = \\dfrac{k+1}{n-k}$.`, false, `Inverse. Le majordome appelle ça « l'inversion du rapport ».`),
    sc => P(`On peut calculer $P(X \\geq k)$ par $1 - P(X < k)$.`, true, `Complémentarité. Le majordome appelle ça « le calcul du complémentaire ».`),
    sc => P(`${sc.majordome} dit que $P(X \\geq 1) = 1 - P(X = 0)$.`, true, `Complémentaire. Le majordome appelle ça « la logique de l'évidence ».`),
    sc => P(`Dans un programme qui calcule $P(X=k)$, on doit multiplier par $\\binom{n}{k}$.`, true, `Formule binomiale complète. Le majordome appelle ça « la formule complète ».`),
    sc => P(`$P(X \\leq k) = P(X = 0) + P(X = 1) + \\cdots + P(X = k)$.`, true, `Définition cumulative. Le majordome appelle ça « la somme des possibles ».`),
    sc => P(`Un programme qui retourne $1$ pour <code>sum(P)</code> vérifie qu'on a une distribution valide.`, true, `Somme $= 1$. Le majordome appelle ça « le contrôle de qualité ».`),
    sc => P(`La variable $q$ dans le code binomial vaut $q = 1 + p$.`, false, `$q = 1 - p$. Le majordome appelle ça « l'addition malencontreuse ».`),
    sc => P(`Si l'on multiplie $\\binom{n}{k}$ par $p^k$, on obtient $P(X=k)$.`, false, `Manque $(1-p)^{n-k}$. Le majordome appelle ça « l'oubli du dernier facteur ».`),
    sc => P(`On peut calculer $P(X=n) = p^n$.`, true, `$\\binom{n}{n} = 1$, $p^n$. Le majordome appelle ça « le succès intégral ».`),
    sc => P(`Un programme de simulation de $\\mathcal{B}(n, p)$ doit générer $n$ épreuves indépendantes.`, true, `Cohérent avec la définition. Le majordome appelle ça « la simulation du hasard ».`),
    sc => P(`${sc.seigneur} croit que $P(X=0) = p^n$.`, false, `$P(X=0) = (1-p)^n$. Le majordome appelle ça « l'inversion du zéro ».`),
    sc => P(`$P(X \\geq 1) + P(X = 0) = 1$.`, true, `Événements contraires. Le majordome appelle ça « la réunion des contraires ».`),
    sc => P(`Dans une boucle sur $k$ de $0$ à $n$, on additionne les $P(X=k)$ pour obtenir $1$.`, true, `Somme $= 1$. Le majordome appelle ça « la somme du bonheur ».`),
    sc => P(`Pour calculer $P(X < k)$, on somme $P(X=j)$ pour $j$ de $0$ à $k-1$.`, true, `Définition cumulative stricte. Le majordome appelle ça « la somme stricte ».`)
  ],
  16: [
    sc => P(`Pour $X \\sim \\mathcal{B}(20, 0{,}25)$, $E(X) = 5$.`, true, `$20 \\times 0{,}25 = 5$. Le majordome appelle ça « la juste espérance ».`),
    sc => P(`$P(X \\geq 1) = 1 - (1-p)^n$.`, true, `Complémentaire de $X = 0$. Le majordome appelle ça « l'évidence du complémentaire ».`),
    sc => P(`Avec remise, les tirages peuvent suivre une loi binomiale.`, true, `Avec remise : indépendants. Le majordome appelle ça « la remise salvifique ».`),
    sc => P(`L'événement contraire de $X \\geq 1$ est $X = 0$.`, true, `Le contraire de « au moins un » est « aucun ». Le majordome appelle ça « la logique du zéro ».`),
    sc => P(`Une loi binomiale compte le nombre de succès.`, true, `Définition. Le majordome appelle ça « la comptabilité des succès ».`),
    sc => P(`$P(X = 0) = (1-p)^n$.`, true, `$\\binom{n}{0} \\, p^0 \\, (1-p)^n$. Le majordome appelle ça « la formule du zéro ».`),
    sc => P(`$P(X \\geq 1) = (1-p)^n$.`, false, `C'est $P(X = 0)$. Le majordome appelle ça « la confusion du complémentaire ».`),
    sc => P(`Sans remise, les tirages suivent une loi binomiale.`, false, `Dépendance. Le majordome appelle ça « l'oubli de la dépendance ».`),
    sc => P(`Pour $\\mathcal{B}(n,p)$, $V(X) = np$.`, false, `$V(X) = np(1-p)$. Le majordome appelle ça « l'oubli du facteur $1-p$ ».`),
    sc => P(`$E(X) = p$ pour $\\mathcal{B}(n,p)$.`, false, `$E(X) = np$. Le majordome appelle ça « l'oubli du $n$ ».`),
    sc => P(`La variance de $\\mathcal{B}(n,p)$ peut être négative.`, false, `$V \\geq 0$. Le majordome appelle ça « l'impossible pessimisme ».`),
    sc => P(`$P(X = 0) = p^n$.`, false, `$(1-p)^n$. Le majordome appelle ça « l'inversion des facteurs ».`),
    sc => P(`Si $X \\sim \\mathcal{B}(50, 0{,}4)$, alors $E(X) = 20$.`, true, `$50 \\times 0{,}4 = 20$. Le majordome appelle ça « le calcul du bonheur ».`),
    sc => P(`Si $X \\sim \\mathcal{B}(50, 0{,}4)$, alors $V(X) = 12$.`, true, `$50 \\times 0{,}4 \\times 0{,}6 = 12$. Le majordome appelle ça « la variance de la vie ».`),
    sc => P(`Un tirage sans remise suit une loi binomiale si $n$ est grand.`, false, `L'indépendance est nécessaire. Le majordome appelle ça « l'illusion du grand nombre ».`),
    sc => P(`$P(X \\geq 1) = 1 - (1-p)^n$.`, true, `Complémentaire de $X = 0$. Le majordome appelle ça « la formule du presque-sûr ».`),
    sc => P(`Deux lois binomiales $\\mathcal{B}(10, 0{,}5)$ et $\\mathcal{B}(10, 0{,}5)$ sont la même loi.`, true, `Mêmes paramètres. Le majordome appelle ça « la parfaite égalité ».`),
    sc => P(`Si $p$ augmente ($n$ fixe), l'espérance augmente.`, true, `$E = np$. Le majordome appelle ça « la croissance de l'espérance ».`),
    sc => P(`$P(X = k) + P(X \\neq k) = 1$.`, true, `Événements complémentaires. Le majordome appelle ça « la partition de l'univers ».`),
    sc => P(`Si $X$ suit une loi binomiale, alors $0 \\leq X \\leq n$.`, true, `$X$ compte les succès. Le majordome appelle ça « l'intervalle du possible ».`),
    sc => P(`${sc.seigneur} pense que $p = 0$ implique $E(X) = 0$.`, true, `$E = n \\times 0 = 0$. Le majordome appelle ça « l'espérance du rien ».`),
    sc => P(`Si $p = 1$, alors $X = n$ avec probabilité $1$.`, true, `Tous les essais réussissent. Le majordome appelle ça « le triomphe absolu ».`),
    sc => P(`Une loi binomiale avec $p = 0{,}5$ a $E(X) = n/2$.`, true, `$E = n \\times 0{,}5$. Le majordome appelle ça « l'équilibre de l'espérance ».`),
    sc => P(`${sc.majordome} affirme que $E(X)$ et $V(X)$ peuvent être égales quand $p = 0{,}5$.`, false, `$E = np$, $V = np/2$. Le majordome appelle ça « l'impossible égalité ».`),
    sc => P(`Pour $X \\sim \\mathcal{B}(50, 0{,}4)$, $\\sigma(X) = \\sqrt{12}$.`, true, `$V = 12$, $\\sigma = \\sqrt{12}$. Le majordome appelle ça « la racine de la variance ».`)
  ],
  17: [
    sc => P(`Si les conditions du schéma de Bernoulli ne sont pas réunies, on ne peut pas appliquer la loi binomiale.`, true, `Conditions requises. Le majordome appelle ça « la prudence du statisticien ».`),
    sc => P(`Reconnaître une loi binomiale nécessite de vérifier : répétition, deux issues, $p$ constant, indépendance, comptage des succès.`, true, `Méthode du majordome. Le majordome appelle ça « les cinq commandements du schéma ».`),
    sc => P(`Un tirage sans remise de ${sc.objetPl} ne suit pas une loi binomiale.`, true, `Sans remise : dépendance. Le majordome appelle ça « l'exclusion de la dépendance ».`),
    sc => P(`Avec remise, un tirage de ${sc.objetPl} peut suivre une loi binomiale.`, true, `Indépendance. Le majordome appelle ça « la remise salvifique ».`),
    sc => P(`Un schéma de Bernoulli exige que les épreuves soient indépendantes.`, true, `Indépendance obligatoire. Le majordome appelle ça « le mariage obligatoire ».`),
    sc => P(`Si $X \\sim \\mathcal{B}(n,p)$, alors $X$ compte le nombre de succès sur $n$ épreuves.`, true, `Définition. Le majordome appelle ça « la comptabilité des succès ».`),
    sc => P(`« Il y a plus de deux issues, donc ce n'est pas binomial » est un bon argument.`, false, `On peut regrouper les issues en deux catégories. Le majordome appelle ça « la subtilité du regroupement ».`),
    sc => P(`« On tire $n$ cartes sans remise, donc c'est binomial » est un bon argument.`, false, `Sans remise : dépendance. Le majordome appelle ça « le sophisme de la remise ».`),
    sc => P(`Le fait que les épreuves soient identiques ne suffit pas pour avoir une loi binomiale.`, false, `Il faut aussi l'indépendance. Le majordome appelle ça « l'oubli de la moitié du contrat ».`),
    sc => P(`La loi binomiale s'applique à toutes les expériences aléatoires.`, false, `Conditions précises requises. Le majordome appelle ça « l'illusion de l'universel ».`),
    sc => P(`Si les épreuves sont dépendantes, la loi binomiale s'applique quand même.`, false, `Dépendance = pas binomiale. Le majordome appelle ça « le déni de la dépendance ».`),
    sc => P(`« C'est une expérience aléatoire, donc c'est une loi binomiale » est un bon argument.`, false, `Non, il faut un schéma de Bernoulli. Le majordome appelle ça « le raccourci fallacieux ».`),
    sc => P(`Pour justifier une loi binomiale, il faut vérifier les $5$ conditions du schéma.`, true, `Méthode complète. Le majordome appelle ça « les cinq piliers de la sagesse ».`),
    sc => P(`${sc.majordome} dit qu'il suffit que $X$ compte les succès pour appliquer la binomiale.`, false, `Il faut aussi les autres conditions. Le majordome appelle ça « l'oubli du contrat ».`),
    sc => P(`Rédiger « $X$ suit $\\mathcal{B}(n, p)$ car ... » exige de citer les conditions vérifiées.`, true, `Rigueur de rédaction. Le majordome appelle ça « la politesse de la rédaction ».`),
    sc => P(`Une erreur classique consiste à appliquer la binomiale sans remise.`, true, `Sans remise, $p$ change. Le majordome appelle ça « le piège du sans-remise ».`),
    sc => P(`Un tirage avec remise ne change pas la composition de l'urne.`, true, `Garantit $p$ constant. Le majordome appelle ça « la conservation de l'urne ».`),
    sc => P(`${sc.seigneur} pense que « on a deux issues » suffit pour la binomiale.`, false, `Il faut aussi les autres conditions. Le majordome appelle ça « l'oubli de quatre commandements ».`),
    sc => P(`La rédaction type cite : $n$, $p$, $X \\sim \\mathcal{B}(n, p)$, puis on calcule.`, true, `Méthode standard. Le majordome appelle ça « la rédaction du majordome ».`),
    sc => P(`Si $n = 5$ et on observe $X = 7$, les conditions du modèle ne sont pas respectées.`, true, `$X \\in \\{0, \\ldots, n\\}$. Le majordome appelle ça « l'impossible dépassement ».`),
    sc => P(`Un exercice sans remise peut parfois être approximé par une binomiale si l'urne est très grande.`, true, `Approximation acceptable. Le majordome appelle ça « la dérogation du grand nombre ».`),
    sc => P(`${sc.majordome} dit qu'un contre-exemple suffit à invalider une modélisation binomiale.`, true, `Un critère non vérifié $\\to$ pas binomiale. Le majordome appelle ça « la loi du contre-exemple ».`),
    sc => P(`La méthode du majordome compte $3$ conditions.`, false, `$5$ conditions. Le majordome appelle ça « l'erreur du décompte ».`),
    sc => P(`Il faut toujours vérifier les conditions AVANT de calculer $P(X=k)$.`, true, `Ordre logique. Le majordome appelle ça « la politesse de l'ordre ».`),
    sc => P(`Si $p$ est inconnu, on ne peut pas appliquer directement la binomiale.`, true, `Il faut connaître $p$. Le majordome appelle ça « l'absolue nécessité du paramètre ».`)
  ]
};

const STEP_META = {
  1: { notion: 'Épreuve de Bernoulli', intro: (sc) => sc.story + `<div class="exp-note">🧪 <strong>Expérience aléatoire à ${sc.lieu}.</strong> Chaque affirmation met en scène ${sc.seigneur} et ${sc.majordome}. Certaines sont des <strong>distracteurs</strong> : lisez bien, et souriez souvent.</div>`,
    synthese: `<div class="box def"><span class="lbl">Définition 1 — Épreuve de Bernoulli</span><p>Une <strong>épreuve de Bernoulli</strong> est une expérience aléatoire qui n'admet que <strong>deux issues</strong> : le succès $S$ de probabilité $p$ et l'échec $\\overline{S}$ de probabilité $q = 1-p$.</p></div>` },
  2: { notion: 'Graphiques de Bernoulli', intro: (sc) => `<div class="exp-note">🧪 <strong>L'œil du statisticien.</strong> ${sc.majordome} a dessiné ces graphiques pour ${sc.seigneur}. Tous ne sont pas des lois de Bernoulli. Certains sont même franchement suspects.</div>`,
    synthese: `<div class="box def"><span class="lbl">À retenir</span><p>Une loi de Bernoulli se représente par un <strong>diagramme à deux bâtons</strong> (deux issues possibles, $0$ et $1$) dont la somme des hauteurs vaut $1$.</p></div>` },
  3: { notion: 'Schéma de Bernoulli', intro: (sc) => `<div class="exp-note">🧪 <strong>Répéter l'expérience.</strong> ${sc.majordome} voudrait répéter ${sc.action} à ${sc.lieu}. Attention aux confusions avec la simple épreuve, et aux neveux farceurs.</div>`,
    synthese: `<div class="box def"><span class="lbl">Définition 2 — Schéma de Bernoulli</span><p>Un <strong>schéma de Bernoulli</strong> est la répétition de $n$ épreuves <strong>identiques</strong> et <strong>indépendantes</strong>.</p></div>` },
  4: { notion: 'Arbres orientés', intro: (sc) => `<div class="exp-note">🌳 <strong>Les arbres du majordome.</strong> ${sc.majordome} a dessiné plusieurs arbres de probabilités pour ${sc.seigneur}. Branches orientées dans tous les sens, mais le fond reste le même : compter succès et échecs. Et accessoirement, ne pas se faire manger par un blaireau.</div>`,
    synthese: `<div class="box def"><span class="lbl">Définition — Arbre de Bernoulli</span><p>Un <strong>arbre de Bernoulli</strong> représente un schéma de Bernoulli : à chaque nœud, exactement deux branches ($S$ de probabilité $p$, $\\overline{S}$ de probabilité $1-p$), et $p$ <strong>constant</strong> à tous les niveaux. L'orientation de l'arbre n'a <strong>aucune incidence</strong> sur la loi.</p></div><div class="box prop"><span class="lbl">À vérifier</span><ul><li>Deux branches à chaque nœud.</li><li>$p$ constant à tous les niveaux.</li><li>Labels $p$ et $1-p$ sommant à $1$.</li></ul></div>` },
  5: { notion: 'La loi binomiale', intro: (sc) => `<div class="exp-note">🧪 <strong>Compter les succès.</strong> ${sc.majordome} note dans son carnet le nombre de "${sc.succes}" sur $n$ ${sc.action}s. Distracteurs inclus, et thé renversé probable.</div>`,
    synthese: `<div class="box def"><span class="lbl">Définition 3 — Loi binomiale</span><p>$X \\sim \\mathcal{B}(n,p)$ : $P(X=k) = \\dbinom{n}{k} p^k (1-p)^{n-k}$.</p></div>` },
  6: { notion: 'Graphiques de la loi binomiale', intro: (sc) => `<div class="exp-note">🧪 <strong>Reconnaître la bête.</strong> Plusieurs graphiques affichés dans le bureau de ${sc.lieu}. Tous ne sont pas binomiaux. Certains sont des faux amis.</div>`,
    synthese: `<div class="box def"><span class="lbl">À retenir</span><p>Une loi binomiale se représente par un <strong>diagramme en bâtons</strong> dont la somme des hauteurs vaut $1$. Elle est toujours discrète et unimodale.</p></div>` },
  7: { notion: 'Atelier Python I', intro: (sc) => `<div class="exp-note">💻 <strong>Le laboratoire de ${sc.majordome}.</strong> De courts programmes Python traînent sur le bureau ($40$ scripts différents). Chacun a son histoire, souvent absurde.</div>`,
    synthese: `<div class="box def"><span class="lbl">À retenir</span><p>Savoir lire un programme Python (boucles, conditions, listes) permet de comprendre et de simuler des expériences aléatoires.</p></div>` },
  8: { notion: 'Coefficients binomiaux', intro: (sc) => `<div class="exp-note">🧪 <strong>Compter les chemins.</strong> Combien de façons d'obtenir exactement $k$ fois "${sc.succes}" en $n$ essais à ${sc.lieu} ?</div>`,
    synthese: `<div class="box def"><span class="lbl">Définition 4 — Coefficient binomial</span><p>$\\dbinom{n}{k} = \\dfrac{n!}{k!\\,(n-k)!}$.</p></div><div class="box prop"><span class="lbl">Propriétés</span><ol><li>Symétrie : $\\dbinom{n}{k} = \\dbinom{n}{n-k}$</li><li>Pascal : $\\dbinom{n}{k} = \\dbinom{n-1}{k-1} + \\dbinom{n-1}{k}$</li><li>$\\sum_{k=0}^{n} \\dbinom{n}{k} = 2^n$</li></ol></div>` },
  9: { notion: 'Espérance, variance, écart-type', intro: (sc) => `<div class="exp-note">🧪 <strong>Mesurer le hasard.</strong> Combien de "${sc.succes}" peut-on espérer à long terme ? Et combien de thé doit-on prévoir en conséquence ?</div>`,
    synthese: `<div class="box prop"><span class="lbl">Théorème 1</span><p>$\\mathbb{E}(X) = np$, $\\mathrm{V}(X) = npq$, $\\sigma(X) = \\sqrt{npq}$ avec $q = 1-p$.</p></div>` },
  10: { notion: 'Représentations graphiques', intro: (sc) => `<div class="exp-note">🧪 <strong>Voir le hasard.</strong> ${sc.majordome} dresse le diagramme en bâtons. Le chat supervise, impassible.</div>`,
    synthese: `<div class="box prop"><span class="lbl">Lire un diagramme</span><ul><li>$p = 0{,}5$ : symétrique.</li><li>$p < 0{,}5$ : asymétrie positive.</li><li>$p > 0{,}5$ : asymétrie négative.</li><li>$n$ grand : resserrement autour de $np$.</li></ul></div>` },
  11: { notion: 'La planche de Galton', intro: (sc) => `<div class="exp-note">🧪 <strong>Le hasard en cascade.</strong> Imaginez une planche de Galton dans la serre de ${sc.lieu}. Les billes dévalent, le majordome compte, le chat baille.</div>`,
    synthese: `<div class="box def"><span class="lbl">Planche de Galton</span><p>$P(\\text{bac } k) = \\dbinom{n}{k} p^k (1-p)^{n-k}$.</p></div>` },
  12: { notion: 'Moivre–Laplace', intro: (sc) => `<div class="exp-note">🧪 <strong>Le hasard devient prévisible.</strong> Quand on répète ${sc.action} un très grand nombre de fois, la loi binomiale ressemble à une cloche. Le majordome appelle ça « le miracle du grand nombre ».</div>`,
    synthese: `<div class="box prop"><span class="lbl">Théorème de Moivre–Laplace</span><p>Pour $np \\geq 5$ et $n(1-p) \\geq 5$ : $X \\approx \\mathcal{N}(np\\,;\\,\\sqrt{np(1-p)})$.</p></div>` },
  13: { notion: 'Graphiques de la loi normale', intro: (sc) => `<div class="exp-note">🧪 <strong>La cloche se précise.</strong> ${sc.majordome} compare la loi binomiale à la loi normale, avec un scepticisme tout britannique.</div>`,
    synthese: `<div class="box def"><span class="lbl">À retenir</span><p>Une loi normale se représente par une <strong>courbe continue</strong> symétrique en forme de cloche.</p></div>` },
  14: { notion: 'Atelier Python II', intro: (sc) => `<div class="exp-note">💻 <strong>Les archives de la bibliothèque.</strong> ${sc.majordome} a retrouvé d'autres scripts ($40$ différents), certains écrits au dos d'une facture de parapluies.</div>`,
    synthese: `<div class="box prop"><span class="lbl">Pour bien lire un programme</span><ul><li>Repérer la structure.</li><li>Suivre l'évolution des variables.</li><li>Vérifier le type de données.</li></ul></div>` },
  15: { notion: 'Programmes Python (Loi binomiale)', intro: (sc) => `<div class="exp-note">🧪 <strong>Simuler le hasard.</strong> Le neveu Babbage code sur sa machine, entre deux parties de colin-maillard avec les escargots du Duc.</div>`,
    synthese: `<div class="box def"><span class="lbl">La fonction réparée</span><pre><code>def loi_binomiale(n, p):
    q = 1 - p
    P = [q**n]
    for k in range(n):
        P.append(P[-1] * (n - k) / (k + 1) * p / q)
    return P</code></pre></div>` },
  16: { notion: 'Épreuve finale', intro: (sc) => `<div class="exp-note">🧪 <strong>Expérience aléatoire finale.</strong> Toutes les connaissances accumulées à ${sc.lieu} doivent être convoquées. Et un peu de loufoquerie ne nuit pas.</div>`,
    synthese: `<div class="box prop"><span class="lbl">Les trois réponses clés</span><ol><li>$\\mathbb{E}(X) = 5$ pour $\\mathcal{B}(20\\,;\\,0{,}25)$.</li><li>$P(X \\geq 1) = 1 - (1-p)^n$.</li><li>Sans remise : pas de loi binomiale.</li></ol></div>` },
  17: { notion: 'Épilogue, méthode et rédaction type', intro: (sc) => `<div class="exp-note">🧪 <strong>Dernière expérience aléatoire.</strong> ${sc.seigneur} fut ${sg(sc, 'élu', 'élue')} membre honoraire de la Royal Society of Biscuit Statistics. Le majordome, lui, prépare le thé.</div>
    <div class="box def"><span class="lbl">Voici les cinq conditions du schéma de Bernoulli — « la méthode du majordome »</span>
    <p>Avant de conclure qu'une variable $X$ suit la loi binomiale, le majordome vérifie <strong>cinq conditions</strong> :</p>
    <ol>
      <li>on <strong>répète</strong> une même expérience un nombre $n$ fixé de fois ;</li>
      <li>chaque épreuve a exactement <strong>deux issues utiles</strong> — succès ou échec ;</li>
      <li>la probabilité de succès $p$ est <strong>constante</strong> d'une épreuve à l'autre ;</li>
      <li>les épreuves sont <strong>indépendantes</strong> les unes des autres ;</li>
      <li>$X$ <strong>compte le nombre de succès</strong> obtenus sur les $n$ épreuves.</li>
    </ol>
    <p>Si l'une des cinq fait défaut (tirage sans remise, $p$ qui varie, plus de deux issues, épreuves liées…), ce n'est pas un schéma de Bernoulli : pas de loi binomiale, et le majordome refuse de servir le thé.</p></div>`,
    synthese: `<div class="box prop"><span class="lbl">La méthode du majordome — les cinq conditions</span><ol><li>Répète-t-on une même expérience un nombre $n$ de fois ?</li><li>Chaque épreuve a-t-elle deux issues utiles ?</li><li>La probabilité de succès est-elle constante ?</li><li>Les épreuves sont-elles indépendantes ?</li><li>$X$ compte-t-il le nombre de succès ?</li></ol></div>` },
};

