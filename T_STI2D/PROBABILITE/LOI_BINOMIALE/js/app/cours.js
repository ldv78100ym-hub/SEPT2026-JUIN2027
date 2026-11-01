/* ============================================================
   7. VOLETS DU COURS
   ============================================================ */
function termLink(key, label){ return `<span class="term" data-term="${key}">${label}</span>`; }
function courseNav(){ return `<nav class="course-nav"><a href="#" data-course="19">Volet 1</a><a href="#" data-course="20">Volet 2</a><a href="#" data-course="21">Volet 3</a><a href="#" data-course="22">Volet 4</a><a href="#" data-course="23">Volet 5</a><a href="#" data-course="24">Volet 6</a></nav>`; }
function getVolet1(){
  return `<div class="course-section">
    <h3>Volet 1 — Cours classique sur la loi binomiale</h3>
    <p class="mm-hint">💡 Survolez ou cliquez un terme en couleur : la fiche complète s'ouvre dans une modale.</p>
    <div class="course-box rem"><span class="cb-lbl">Plan</span><ol><li>Épreuve de Bernoulli</li><li>Schéma de Bernoulli</li><li>Arbre de Bernoulli</li><li>Loi binomiale</li><li>Coefficients binomiaux</li><li>Espérance / variance</li><li>Graphiques</li><li>Méthode</li><li>Culture : Moivre–Laplace</li></ol></div>
    <h3>I. Épreuve de Bernoulli</h3>
    <div class="course-box def"><span class="cb-lbl">Définition</span><p>Une ${termLink('epreuve-bernoulli','épreuve de Bernoulli')} est une expérience aléatoire à <strong>deux issues</strong>.</p></div>
    <h3>II. Schéma de Bernoulli</h3>
    <div class="course-box def"><span class="cb-lbl">Définition</span><p>Un ${termLink('schema-bernoulli','schéma de Bernoulli')} est la répétition de $n$ épreuves identiques et indépendantes (${termLink('independance','indépendance')}).</p></div>
    <h3>III. ${termLink('arbre-bernoulli','Arbre de Bernoulli')}</h3>
    <div class="course-box def"><span class="cb-lbl">Définition</span><p>Deux branches $S$/$\\overline{S}$ à chaque nœud, $p$ constant. L'orientation est une convention sans effet sur la loi.</p></div>
    <h3>IV. ${termLink('loi-binomiale','Loi binomiale')}</h3>
    <div class="course-box def"><span class="cb-lbl">Définition</span><p>$P(X=k) = \\dbinom{n}{k} p^k (1-p)^{n-k}$.</p></div>
    <h3>V. ${termLink('coefficient-binomial','Coefficients binomiaux')}</h3>
    <div class="course-box def"><span class="cb-lbl">Définition</span><p>$\\dbinom{n}{k} = \\dfrac{n!}{k!\\,(n-k)!}$.</p></div>
    <h3>VI. ${termLink('esperance','Espérance')}, ${termLink('variance','variance')}, ${termLink('ecart-type','écart-type')}</h3>
    <div class="course-box thm"><span class="cb-lbl">Théorème</span><p>$E(X) = np$, $V(X) = npq$, $\\sigma(X) = \\sqrt{npq}$.</p></div>
    <h3>VII. Graphiques</h3>
    <ul><li>$p = 0{,}5$ : symétrique.</li><li>$p < 0{,}5$ : asymétrie positive.</li><li>$p > 0{,}5$ : asymétrie négative.</li><li>Mode $\\approx np$ (${termLink('mode','mode')}).</li></ul>
    <h3>VIII. Méthode</h3>
    <div class="course-box rem"><span class="cb-lbl">Les cinq conditions de la méthode du majordome</span><p>Avant d'écrire $X \\sim \\mathcal{B}(n,p)$, vérifier : (1) on répète $n$ fois une même expérience ; (2) deux issues utiles, succès ou échec ; (3) probabilité de succès $p$ constante ; (4) épreuves indépendantes ; (5) $X$ compte le nombre de succès.</p></div>
    <h3>IX. Culture : ${termLink('moivre-laplace','Moivre–Laplace')}</h3>
    <div class="culture-banner">🎓 Culture mathématique.</div>
    <div class="course-box thm"><span class="cb-lbl">Théorème</span><p>Pour $np \\geq 5$ et $n(1-p) \\geq 5$ : $X \\approx \\mathcal{N}(np, \\sqrt{np(1-p)})$.</p></div>
  </div>`;
}
function getVolet2(){
  return `<div class="course-section"><h3>Volet 2 — Tableaux synthétiques</h3>
    <p class="mm-hint">💡 Survolez ou cliquez un terme en couleur : la fiche complète s'ouvre dans une modale.</p>
    <table class="synth-table"><caption>Vocabulaire</caption><thead><tr><th>Terme</th><th>Définition</th><th>Notation</th></tr></thead><tbody>
      <tr><td class="k">${termLink('epreuve-bernoulli','Épreuve de Bernoulli')}</td><td>Expérience à deux issues</td><td>$p$, $q = 1-p$</td></tr>
      <tr><td class="k">${termLink('schema-bernoulli','Schéma de Bernoulli')}</td><td>$n$ épreuves identiques et indépendantes</td><td>$(n, p)$</td></tr>
      <tr><td class="k">${termLink('arbre-bernoulli','Arbre de Bernoulli')}</td><td>Représentation en arbre</td><td>—</td></tr>
      <tr><td class="k">${termLink('loi-binomiale','Loi binomiale')}</td><td>Loi du nombre de succès</td><td>$\\mathcal{B}(n,p)$</td></tr>
      <tr><td class="k">${termLink('esperance','Espérance')}</td><td>Valeur moyenne</td><td>$E(X)$</td></tr>
      <tr><td class="k">${termLink('variance','Variance')}</td><td>Dispersion</td><td>$V(X)$</td></tr>
      <tr><td class="k">${termLink('ecart-type','Écart-type')}</td><td>Racine de la variance</td><td>$\\sigma(X)$</td></tr>
    </tbody></table>
    <table class="synth-table"><caption>Formules</caption><thead><tr><th>Objet</th><th>Formule</th></tr></thead><tbody>
      <tr><td class="k">${termLink('loi-binomiale','Loi binomiale')}</td><td>$P(X=k) = \\dbinom{n}{k} p^k (1-p)^{n-k}$</td></tr>
      <tr><td class="k">${termLink('esperance','Espérance')}</td><td>$E(X) = np$</td></tr>
      <tr><td class="k">${termLink('variance','Variance')}</td><td>$V(X) = np(1-p)$</td></tr>
      <tr><td class="k">${termLink('ecart-type','Écart-type')}</td><td>$\\sigma(X) = \\sqrt{np(1-p)}$</td></tr>
      <tr><td class="k">${termLink('probabilite-cumulee','P(X=0)')}</td><td>$(1-p)^n$</td></tr>
      <tr><td class="k">${termLink('probabilite-cumulee','P(X ≥ 1)')}</td><td>$1 - (1-p)^n$</td></tr>
    </tbody></table>
    <table class="synth-table"><caption>Programme vs Culture</caption><thead><tr><th>Notion</th><th>Statut</th></tr></thead><tbody>
      <tr><td class="k">Bernoulli, schéma, arbre, binomiale</td><td><span class="bilan-tag essentiel">Programme</span></td></tr>
      <tr><td class="k">Coefficients, espérance, variance</td><td><span class="bilan-tag essentiel">Programme</span></td></tr>
      <tr><td class="k">${termLink('moivre-laplace','Moivre–Laplace')}</td><td><span class="bilan-tag culture">Culture</span></td></tr>
      <tr><td class="k">${termLink('loi-normale','Loi normale')}</td><td><span class="bilan-tag culture">Culture</span></td></tr>
    </tbody></table>
  </div>`;
}
function getVolet3(){
  return `<div class="course-section"><h3>Volet 3 — Carte mentale</h3>
    <p class="mm-hint">💡 Survolez ou cliquez chaque nœud.</p>
    <div class="mindmap">
      <div class="mm-col">
        <div class="mm-node branch" data-term="epreuve-bernoulli">📌 Épreuve de Bernoulli</div>
        <div class="mm-node leaf" data-term="succes-echec">Succès / échec</div>
        <div class="mm-node branch" data-term="schema-bernoulli">📌 Schéma de Bernoulli</div>
        <div class="mm-node leaf" data-term="arbre-bernoulli">🌳 Arbre de Bernoulli</div>
        <div class="mm-node leaf" data-term="independance">Indépendance</div>
      </div>
      <div class="mm-col">
        <div class="mm-node central" data-term="loi-binomiale">LOI BINOMIALE<br><span style="font-size:.8em;">$\\mathcal{B}(n,p)$</span></div>
        <div class="mm-node branch" data-term="parametre-n">🔢 Paramètre $n$</div>
        <div class="mm-node branch" data-term="parametre-p">🎯 Paramètre $p$</div>
      </div>
      <div class="mm-col">
        <div class="mm-node branch" data-term="coefficient-binomial">🧮 Coefficients</div>
        <div class="mm-node branch" data-term="esperance">📊 $E(X)=np$</div>
        <div class="mm-node branch" data-term="variance">📈 $V(X)=np(1-p)$</div>
        <div class="mm-node leaf" data-term="ecart-type">Écart-type</div>
        <div class="mm-node leaf" data-term="diagramme-batons">Diagramme en bâtons</div>
        <div class="mm-node leaf" data-term="mode">Mode</div>
      </div>
    </div>
    <div class="mindmap" style="margin-top:24px;">
      <div class="mm-col">
        <div class="mm-node branch" data-term="planche-galton">🎲 Planche de Galton</div>
        <div class="mm-node leaf" data-term="variable-aleatoire">Variable aléatoire</div>
        <div class="mm-node leaf" data-term="loi-probabilite">Loi de probabilité</div>
        <div class="mm-node leaf" data-term="probabilite-cumulee">Probabilité cumulée</div>
      </div>
      <div class="mm-col">
        <div class="mm-node central" data-term="moivre-laplace" style="background:linear-gradient(135deg,#a16207,#c0842c);">🎓 CULTURE<br>Approximation normale</div>
      </div>
      <div class="mm-col">
        <div class="mm-node branch" data-term="loi-normale">🔔 Loi normale</div>
        <div class="mm-node leaf" data-term="approximation-normale">$\\mathcal{B}(n,p) \\approx \\mathcal{N}(np, \\sqrt{np(1-p)})$</div>
      </div>
    </div>
  </div>`;
}
function getVolet4(){
  return `<div class="course-section"><h3>Volet 4 — Graphe des liens</h3>
    <p class="mm-hint">💡 Survolez ou cliquez un nœud.</p>
    <div class="graph-svg-wrap">
      <svg viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg">
        <line class="edge" x1="160" y1="80" x2="330" y2="150"/>
        <line class="edge" x1="160" y1="240" x2="330" y2="240"/>
        <line class="edge" x1="470" y1="240" x2="620" y2="150"/>
        <line class="edge" x1="470" y1="260" x2="620" y2="360"/>
        <g class="graph-node" data-term="epreuve-bernoulli"><rect class="node-rect" x="40" y="50" width="120" height="55" rx="10" fill="#1e3a5f"/><text class="node-label" x="100" y="73">Épreuve de</text><text class="node-label" x="100" y="90">Bernoulli</text></g>
        <g class="graph-node" data-term="schema-bernoulli"><rect class="node-rect" x="330" y="115" width="140" height="70" rx="10" fill="#14532d"/><text class="node-label" x="400" y="145">Schéma de</text><text class="node-label" x="400" y="165">Bernoulli</text></g>
        <g class="graph-node" data-term="arbre-bernoulli"><rect class="node-rect" x="40" y="215" width="120" height="50" rx="10" fill="#4e8a63"/><text class="node-label" x="100" y="245">🌳 Arbre</text></g>
        <g class="graph-node" data-term="loi-binomiale"><rect class="node-rect" x="330" y="205" width="140" height="70" rx="12" fill="#a16207" stroke="#7a4a05" stroke-width="3"/><text class="node-label" x="400" y="235">LOI</text><text class="node-label" x="400" y="255">BINOMIALE</text></g>
        <g class="graph-node" data-term="coefficient-binomial"><rect class="node-rect" x="620" y="115" width="130" height="55" rx="10" fill="#3b2a5e"/><text class="node-label" x="685" y="145">Coefficients</text></g>
        <g class="graph-node" data-term="esperance"><rect class="node-rect" x="620" y="335" width="130" height="50" rx="10" fill="#14532d"/><text class="node-label" x="685" y="365">Espérance</text></g>
      </svg>
    </div>
  </div>`;
}
function getVoletRedaction(){
  return `<div class="course-section">
    <h3>Volet 5 — Rédaction type des réponses</h3>
    <p class="mm-hint">💡 Survolez ou cliquez un terme en couleur.</p>
    <p>Pour chaque grande famille de questions rencontrées dans l'enquête, voici une <strong>rédaction modèle</strong>. Elle commence toujours par <strong>Finalement</strong> et reformule la conclusion à l'aide des éléments trouvés pendant la résolution ($n$, $p$, formules, valeurs numériques).</p>
    <div class="course-box rem"><span class="cb-lbl">Modèle général</span>
      <p><strong>Finalement</strong>, après avoir vérifié [conditions], on conclut que [variable] suit la loi [loi] de paramètres [...], ce qui permet de calculer [grandeur] : on obtient [résultat].</p>
    </div>
    <div class="course-box def"><span class="cb-lbl">Type 1 — Reconnaître une ${termLink('epreuve-bernoulli','épreuve de Bernoulli')}</span>
      <p><strong>Finalement</strong>, l'expérience consistant à [action] ne présente que deux issues possibles — le succès « [succès] » et l'échec « [échec] » — et son résultat est incertain avant l'essai : c'est donc une épreuve de Bernoulli, de paramètre $p = P(\\text{succès})$, avec $p + (1-p) = 1$.</p>
    </div>
    <div class="course-box def"><span class="cb-lbl">Type 2 — Lire un graphique de ${termLink('diagramme-batons','loi de Bernoulli')}</span>
      <p><strong>Finalement</strong>, le diagramme représenté comporte exactement deux bâtons (valeurs $0$ et $1$) dont les hauteurs somment à $1$ : il s'agit donc d'une loi de Bernoulli. Dans le cas contraire — trois bâtons, courbe continue, ou somme différente de $1$ — ce n'est pas une loi de Bernoulli.</p>
    </div>
    <div class="course-box def"><span class="cb-lbl">Type 3 — Reconnaître un ${termLink('schema-bernoulli','schéma de Bernoulli')}</span>
      <p><strong>Finalement</strong>, on répète $n$ fois la même épreuve de Bernoulli, dans des conditions identiques et de façon indépendante, et l'on s'intéresse au nombre de succès : c'est un schéma de Bernoulli de paramètres $n$ et $p$. Si les tirages sont sans remise ou si $p$ varie, ce n'est pas un schéma de Bernoulli.</p>
    </div>
    <div class="course-box def"><span class="cb-lbl">Type 4 — Lire un ${termLink('arbre-bernoulli','arbre de Bernoulli')}</span>
      <p><strong>Finalement</strong>, l'arbre comporte à chaque nœud deux branches $S$ et $\\overline{S}$, la probabilité $p$ est constante à tous les niveaux et les labels somment à $1$ à chaque nœud : c'est un arbre de schéma de Bernoulli. L'orientation de l'arbre n'a aucune incidence sur la loi.</p>
    </div>
    <div class="course-box def"><span class="cb-lbl">Type 5 — Compter les chemins sur un arbre</span>
      <p><strong>Finalement</strong>, dans un arbre de Bernoulli à $n$ niveaux, il y a $\\dbinom{n}{k}$ chemins qui réalisent exactement $k$ succès et $2^n$ feuilles en tout.</p>
    </div>
    <div class="course-box def"><span class="cb-lbl">Type 6 — Justifier l'usage de la ${termLink('loi-binomiale','loi binomiale')}</span>
      <p><strong>Finalement</strong>, $X$ compte le nombre de succès au cours de $n$ épreuves identiques et indépendantes de paramètre $p$ ; $X$ suit donc $\\mathcal{B}(n,p)$ et $P(X=k) = \\dbinom{n}{k} p^k (1-p)^{n-k}$.</p>
    </div>
    <div class="course-box def"><span class="cb-lbl">Type 7 — Lire un graphique de la loi binomiale</span>
      <p><strong>Finalement</strong>, le diagramme en bâtons comporte $n+1$ bâtons, est unimodal et ses hauteurs somment à $1$ : il est compatible avec une loi binomiale $\\mathcal{B}(n,p)$.</p>
    </div>
    <div class="course-box ex"><span class="cb-lbl">Type 8 — Lire un programme Python (calculs)</span>
      <p><strong>Finalement</strong>, après lecture pas à pas du programme, la valeur renvoyée par l'appel considéré est [valeur] ; ce résultat s'interprète comme [coefficient binomial / probabilité / espérance / variance].</p>
    </div>
    <div class="course-box def"><span class="cb-lbl">Type 9 — Manipuler les ${termLink('coefficient-binomial','coefficients binomiaux')}</span>
      <p><strong>Finalement</strong>, le nombre de façons de choisir $k$ succès parmi $n$ épreuves est $\\dbinom{n}{k} = \\dfrac{n!}{k!\\,(n-k)!}$.</p>
    </div>
    <div class="course-box def"><span class="cb-lbl">Type 10 — Calculer ${termLink('esperance','espérance')}, ${termLink('variance','variance')}, ${termLink('ecart-type','écart-type')}</span>
      <p><strong>Finalement</strong>, pour $X \\sim \\mathcal{B}(n,p)$, on a $E(X) = np$, $V(X) = np(1-p)$ et $\\sigma(X) = \\sqrt{np(1-p)}$.</p>
    </div>
    <div class="course-box ex"><span class="cb-lbl">Type 11 — Utiliser le théorème de ${termLink('moivre-laplace','Moivre–Laplace')}</span>
      <p><strong>Finalement</strong>, dès que $np \\geq 5$ et $n(1-p) \\geq 5$, on peut approcher $\\mathcal{B}(n,p)$ par $\\mathcal{N}(np, \\sqrt{np(1-p)})$.</p>
    </div>
    <div class="course-box ex"><span class="cb-lbl">Type 12 — Corriger un programme de loi binomiale</span>
      <p><strong>Finalement</strong>, la fonction corrigée initialise $P[0] = q^n$ puis calcule $P[k+1]$ à partir de $P[k]$ grâce au rapport $\\dfrac{n-k}{k+1} \\cdot \\dfrac{p}{q}$.</p>
    </div>
  </div>`;
}
function getVoletIndex(){
  const groups = {
    'A': [{ key: 'approximation-normale', label: 'Approximation normale', cat: 'culture' },{ key: 'arbre-bernoulli', label: 'Arbre de Bernoulli', cat: 'essentiel' }],
    'B': [{ key: 'epreuve-bernoulli', label: 'Épreuve de Bernoulli', cat: 'essentiel' },{ key: 'schema-bernoulli', label: 'Schéma de Bernoulli', cat: 'essentiel' }],
    'C': [{ key: 'coefficient-binomial', label: 'Coefficient binomial', cat: 'essentiel' }],
    'D': [{ key: 'diagramme-batons', label: 'Diagramme en bâtons', cat: 'essentiel' }],
    'E': [{ key: 'ecart-type', label: 'Écart-type', cat: 'essentiel' },{ key: 'esperance', label: 'Espérance', cat: 'essentiel' }],
    'F': [{ key: 'factorielle', label: 'Factorielle', cat: 'essentiel' }],
    'I': [{ key: 'independance', label: 'Indépendance', cat: 'essentiel' }],
    'L': [{ key: 'loi-binomiale', label: 'Loi binomiale', cat: 'essentiel' },{ key: 'loi-normale', label: 'Loi normale', cat: 'culture' },{ key: 'loi-probabilite', label: 'Loi de probabilité', cat: 'essentiel' }],
    'M': [{ key: 'mode', label: 'Mode', cat: 'essentiel' },{ key: 'moivre-laplace', label: 'Théorème de Moivre–Laplace', cat: 'culture' }],
    'P': [{ key: 'parametre-n', label: 'Paramètre n', cat: 'essentiel' },{ key: 'parametre-p', label: 'Paramètre p', cat: 'essentiel' },{ key: 'planche-galton', label: 'Planche de Galton', cat: 'essentiel' },{ key: 'probabilite-cumulee', label: 'Probabilité cumulée', cat: 'essentiel' }],
    'S': [{ key: 'succes-echec', label: 'Succès et échec', cat: 'essentiel' }],
    'T': [{ key: 'tirage-avec-remise', label: 'Tirage avec remise', cat: 'essentiel' },{ key: 'tirage-sans-remise', label: 'Tirage sans remise', cat: 'essentiel' }],
    'V': [{ key: 'variable-aleatoire', label: 'Variable aléatoire', cat: 'essentiel' },{ key: 'variance', label: 'Variance', cat: 'essentiel' }]
  };
  let html = `<div class="course-section"><h3>Volet 6 — Index complet</h3><p class="mm-hint">💡 Survolez ou cliquez un terme.</p>`;
  Object.keys(groups).sort().forEach(function(letter){
    html += `<div class="index-group"><h3><span class="index-letter">${letter}</span></h3><div class="index-list">`;
    groups[letter].forEach(function(item){
      html += `<span class="index-term term" data-term="${item.key}">${item.label}<span class="tag ${item.cat === 'essentiel' ? 'ess' : 'cul'}">${item.cat === 'essentiel' ? 'Programme' : 'Culture'}</span></span>`;
    });
    html += `</div></div>`;
  });
  html += `</div>`;
  return html;
}

