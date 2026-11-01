/* ============================================================
   6. GLOSSAIRE
   ============================================================ */
const GLOSSARY = {
  'epreuve-bernoulli': { title: 'Épreuve de Bernoulli', cat: 'essentiel', body: `<p>Une <strong>épreuve de Bernoulli</strong> est une expérience aléatoire à <strong>deux issues</strong> : succès $S$ de probabilité $p$, échec $\\overline{S}$ de probabilité $q = 1-p$.</p><div class="formula">$p + q = 1$</div>` },
  'succes-echec': { title: 'Succès et échec', cat: 'essentiel', body: `<p>Le <strong>succès</strong> est l'issue étudiée (probabilité $p$), l'<strong>échec</strong> l'autre (probabilité $1-p$).</p>` },
  'schema-bernoulli': { title: 'Schéma de Bernoulli', cat: 'essentiel', body: `<p>Un <strong>schéma de Bernoulli</strong> est la répétition de $n$ épreuves identiques et indépendantes. Les <strong>cinq conditions</strong> à vérifier : (1) répétition $n$ fois d'une même épreuve ; (2) deux issues utiles, succès ou échec ; (3) probabilité de succès $p$ constante ; (4) épreuves indépendantes ; (5) $X$ compte le nombre de succès.</p><p>Les cinq réunies $\\Rightarrow$ $X \\sim \\mathcal{B}(n,p)$.</p>` },
  'arbre-bernoulli': { title: 'Arbre de Bernoulli', cat: 'essentiel', body: `<p>Représentation d'un schéma : deux branches par nœud, $p$ constant. L'orientation n'a aucune incidence.</p>` },
  'independance': { title: 'Indépendance', cat: 'essentiel', body: `<p>$P(A \\cap B) = P(A) \\times P(B)$.</p>` },
  'loi-binomiale': { title: 'Loi binomiale', cat: 'essentiel', body: `<div class="formula">$P(X=k) = \\dbinom{n}{k} p^k (1-p)^{n-k}$</div>` },
  'coefficient-binomial': { title: 'Coefficient binomial', cat: 'essentiel', body: `<div class="formula">$\\dbinom{n}{k} = \\dfrac{n!}{k!\\,(n-k)!}$</div>` },
  'factorielle': { title: 'Factorielle', cat: 'essentiel', body: `<p>$n! = 1 \\times 2 \\times \\cdots \\times n$, $0! = 1$.</p>` },
  'esperance': { title: 'Espérance', cat: 'essentiel', body: `<div class="formula">$E(X) = np$</div>` },
  'variance': { title: 'Variance', cat: 'essentiel', body: `<div class="formula">$V(X) = np(1-p)$</div>` },
  'ecart-type': { title: 'Écart-type', cat: 'essentiel', body: `<div class="formula">$\\sigma(X) = \\sqrt{np(1-p)}$</div>` },
  'diagramme-batons': { title: 'Diagramme en bâtons', cat: 'essentiel', body: `<p>Représentation discrète : hauteur du bâton $k$ = $P(X=k)$.</p>` },
  'planche-galton': { title: 'Planche de Galton', cat: 'essentiel', body: `<p>Dispositif physique illustrant $\\mathcal{B}(n, 1/2)$.</p>` },
  'parametre-n': { title: 'Paramètre n', cat: 'essentiel', body: `<p>Nombre d'épreuves.</p>` },
  'parametre-p': { title: 'Paramètre p', cat: 'essentiel', body: `<p>Probabilité de succès, $0 \\leq p \\leq 1$.</p>` },
  'tirage-avec-remise': { title: 'Tirage avec remise', cat: 'essentiel', body: `<p>$p$ constant, indépendance : loi binomiale applicable.</p>` },
  'tirage-sans-remise': { title: 'Tirage sans remise', cat: 'essentiel', body: `<p>$p$ change, dépendance : pas de loi binomiale.</p>` },
  'loi-probabilite': { title: 'Loi de probabilité', cat: 'essentiel', body: `<p>Association $x_i \\mapsto p_i$ avec $0 \\leq p_i \\leq 1$ et $\\sum p_i = 1$.</p>` },
  'variable-aleatoire': { title: 'Variable aléatoire', cat: 'essentiel', body: `<p>Fonction qui associe un réel à chaque issue.</p>` },
  'probabilite-cumulee': { title: 'Probabilité cumulée', cat: 'essentiel', body: `<div class="formula">$P(X \\leq k) = \\sum_{i=0}^{k} P(X = i)$</div>` },
  'mode': { title: 'Mode', cat: 'essentiel', body: `<p>Valeur de $k$ maximisant $P(X=k)$ ; voisine de $np$.</p>` },
  'moivre-laplace': { title: 'Moivre–Laplace', cat: 'culture', body: `<div class="formula">$X \\approx \\mathcal{N}(np, \\sqrt{np(1-p)})$</div>` },
  'loi-normale': { title: 'Loi normale', cat: 'culture', body: `<p>Loi continue en cloche, déterminée par $(\\mu, \\sigma)$.</p>` },
  'approximation-normale': { title: 'Approximation normale', cat: 'culture', body: `<div class="formula">$\\mathcal{B}(n,p) \\approx \\mathcal{N}(np, \\sqrt{np(1-p)})$</div>` }
};

