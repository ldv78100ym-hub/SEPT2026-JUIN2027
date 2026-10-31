/* ============================================================
   2bis. RAISONNEMENTS À TROUS (mots-clés à glisser-coller)
   Un mot-clé n'apparaît qu'une seule fois dans la liste mais
   peut combler plusieurs trous. La liste mélange de vrais
   mots-clés et des distracteurs : certains plausibles,
   d'autres délibérément loufoques.
   ============================================================ */
/* Clés volontairement LOUFOQUES : si l'élève ose en placer une dans un trou,
   la chute est MAXIMALE (détection dans submitTrou, sanction dans resolveAnswer).
   Une clé loufoque est :
   - soit un mot totalement décalé (pamplemousse, hippogriffe, ornithorynque…),
     absurde dans n'importe quel raisonnement mathématique ;
   - soit un mot clairement hors-sujet dans le contexte de CET exercice
     (ex. « hypoténuse » dans un raisonnement sur le cercle trigonométrique),
     déclaré via le paramètre ctxLoufoques de TROU (donc q.loufoques) ;
   - soit une valeur impossible dans le contexte : par exemple, dans un
     exercice de probabilités (TROU appelée avec probaNums), toute valeur
     numérique négative ou strictement supérieure à 1 est loufoque,
     puisqu'une probabilité vit toujours dans [0 ; 1].
   Une simple confusion de vocabulaire ou de raisonnement (« médiatrice » à
   la place de « bissectrice », ou une mauvaise initialisation de variable
   dans un script Python) n'est PAS une clé loufoque : c'est une erreur
   ordinaire, sanctionnée comme telle. */
var LOUFOQUES = ['pamplemousse', 'hippogriffe', 'grenouille', 'choucroute', 'trampoline',
                 'ornithorynque', 'pétanque', 'chaussette', 'marmotte', 'courgette',
                 'flibuste', 'berlingot'];

function TROU(contexte, corps, reponses, distracteurs, piege, ctxLoufoques, probaNums){
  const bank = [];
  reponses.concat(distracteurs).forEach(w => { if(w && bank.indexOf(w) < 0) bank.push(w); });
  const complet = corps.replace(/\{\{(\d+)\}\}/g, (m,i) => `<b>${reponses[i]}</b>`);
  let expl = `<div class="ex-section good"><h4>📘 Le raisonnement complet</h4><div>${complet}</div></div>`;
  if(piege) expl += `<div class="ex-section warn"><h4>⚠️ L'erreur à éviter</h4><div>${piege}</div></div>`;
  return {
    trou: true,
    prompt: contexte,
    corps: corps,
    answers: reponses,
    bank: shuffle(bank),
    /* Clés loufoques propres au contexte de CET exercice (en plus de
       LOUFOQUES) : mots sans aucun sens ici, mais pas partout ailleurs. */
    loufoques: ctxLoufoques || [],
    /* true = les clés numériques de cet exercice sont des PROBABILITÉS :
       toute valeur négative ou strictement supérieure à 1 est loufoque. */
    probaNums: !!probaNums,
    penalty: 2,
    explain: expl
  };
}

GEN.trouCanonique = () => TROU(
  `Forme canonique d'un trinôme : complète le raisonnement.`,
  `Toute fonction \\(f(x)=x^2+bx+c\\) s'écrit sous forme canonique \\(f(x)=(x-\\alpha)^2+\\beta\\).<br>
   Étape 1 : \\(\\alpha=-\\dfrac{b}{2}\\). C'est l'{{0}} du sommet de la parabole.<br>
   Étape 2 : \\(\\beta=f(\\alpha)\\). C'est l'{{1}} du sommet.<br>
   Étape 3 : l'axe de {{2}} de la parabole a pour équation \\(x=\\alpha\\).<br>
   Vérification : on {{3}} \\((x-\\alpha)^2+\\beta\\) et on doit retrouver exactement \\(x^2+bx+c\\).`,
  ['abscisse','ordonnée','symétrie','développe'],
  ['pente','base','hippogriffe','ornithorynque','dérive'],
  `Le sommet a pour coordonnées \\((\\alpha\\,;\\,\\beta)\\) : ne pas échanger les deux valeurs, et attention au signe : \\((x\\underline{\\,-\\,}\\alpha)^2\\).`
);

GEN.trouEqProduit = () => {
  const p = nz(-4,4), q = nz(-4,4);
  return TROU(
    `Résous l'équation \\((x${sg(-p)})(x${sg(q)})=0\\) en complétant le raisonnement.`,
    `Pour résoudre \\((x${sg(-p)})(x${sg(q)})=0\\), j'utilise l'équation {{0}} : un produit de facteurs est nul si et seulement si l'un au moins des facteurs est {{1}}.<br>
     Donc \\(x${sg(-p)}=0\\) ou \\(x${sg(q)}=0\\), c'est-à-dire \\(x=${p}\\) ou \\(x=${-q}\\).<br>
     Ces deux valeurs sont les {{2}} de l'équation.<br>
     Attention : on ne {{3}} jamais par \\(x\\), on factorise.`,
    ['produit-nul','nul','racines','divise'],
    ['somme','pamplemousse','pétanque','additionne','discriminant'],
    `Diviser par \\(x\\) ferait perdre la solution \\(x=0\\) : on factorise toujours avant de résoudre.`
  );
};

GEN.trouDroite = () => TROU(
  `Équation de droite : complète le raisonnement.`,
  `Par deux points \\(A\\) et \\(B\\) passe une seule {{0}}. Son coefficient directeur est \\(m=\\dfrac{y_B-y_A}{x_B-x_A}\\) : c'est la {{1}} de la droite.<br>
   Son ordonnée à l'origine \\(p\\) est l'{{2}} de \\(0\\) : on la lit là où la droite coupe l'axe des ordonnées.<br>
   Si \\(m>0\\) la droite « monte », si \\(m=0\\) elle est {{3}} ; si elle est {{4}}, elle n'a pas de coefficient directeur.`,
  ['droite','pente','image','horizontale','verticale'],
  ['diagonale','parabole','trampoline','chaussette','oblique'],
  `Attention au calcul de la pente : toujours \\(\\dfrac{y_B-y_A}{x_B-x_A}\\) dans cet ordre, sinon le signe de \\(m\\) est faux.`
);

GEN.trouTaux = () => {
  const a = nz(-3,3);
  return TROU(
    `Nombre dérivé : complète le raisonnement autour de \\(f'(${a})\\).`,
    `Le nombre dérivé \\(f'(${a})\\) est la {{0}} du taux d'accroissement \\(\\dfrac{f(${a}+h)-f(${a})}{h}\\) quand \\(h\\) tend vers {{1}}.<br>
     Géométriquement, \\(f'(${a})\\) est le coefficient {{2}} de la {{3}} à la courbe au point d'abscisse \\(${a}\\).<br>
     Plus \\(h\\) est {{4}}, plus la droite sécante s'approche de cette droite particulière.`,
    ['limite','0','directeur','tangente','petit'],
    ['somme','∞','dérivée','grand','pamplemousse','marmotte'],
    `Le taux d'accroissement donne une valeur approchée : seule la limite, quand \\(h\\to 0\\), donne le vrai nombre dérivé.`
  );
};

GEN.trouDerivee = () => TROU(
  `Formules de dérivation : complète le raisonnement.`,
  `Pour dériver \\(u^n\\) : \\((u^n)'=n\\,u^{n-1}\\,u'\\) — on multiplie par l'{{0}}, on le {{1}} d'une unité et on n'oublie pas {{2}}.<br>
   Pour \\(\\sqrt{u}\\) : la dérivée fait apparaître un facteur {{3}} au dénominateur : \\((\\sqrt u)'=\\dfrac{u'}{2\\sqrt u}\\).<br>
   La dérivée d'une {{4}} est nulle, et \\((u+v)'=u'+{{5}}\\).`,
  ["exposant","diminue","u'","2","constante","v'"],
  ['augmente','racine','3','choucroute','courgette','variable'],
  `Les pièges classiques : oublier \\(u'\\) dans \\((u^n)'\\), oublier le \\(2\\) de \\((\\sqrt u)'\\), ou croire que \\((u+v)'=u'v'\\).`
);

GEN.trouSigne = () => TROU(
  `Signe d'un trinôme : complète le raisonnement.`,
  `Pour un trinôme \\(ax^2+bx+c\\) avec \\(a>0\\) et deux racines \\(x_1<x_2\\) : le trinôme est positif {{0}} des racines et négatif {{1}} elles.<br>
   Si le discriminant \\(\\Delta<0\\), il n'y a pas de racine : le trinôme garde alors le {{2}} de \\(a\\) sur \\(\\mathbb{R}\\).<br>
   Le {{3}} du coefficient \\(a\\) décide de l'allure de la parabole : « sourire » si \\(a>0\\), « grimace » si \\(a<0\\).`,
  ["à l'extérieur",'entre','signe','signe'],
  ["à l'intérieur",'au sommet','pamplemousse','flibuste','dérivée'],
  `Avec \\(a>0\\), la parabole « sourit » : elle est donc positive dehors et négative dedans. Le tableau suit l'allure, pas l'envie.`
);

GEN.trouVariations = () => TROU(
  `Variations d'une fonction : complète le raisonnement.`,
  `Sur un intervalle où \\(f'>0\\), la fonction \\(f\\) est {{0}} ; là où \\(f'<0\\), elle est {{1}}.<br>
   Lorsque \\(f'\\) s'annule en changeant de signe, la courbe admet un extremum : un maximum si \\(f'\\) passe de \\(+\\) à \\(-\\), un {{2}} dans le cas contraire.<br>
   Le tableau de variations se construit donc à partir du {{3}} de la dérivée, pas à partir de ses valeurs.`,
  ['croissante','décroissante','minimum','signe'],
  ['constante','grenouille','ornithorynque','contraire','coefficient'],
  `Un extremum n'apparaît que si \\(f'\\) change de signe : \\(f'\\) peut s'annuler sans extremum (exemple : \\(x^3\\) en \\(0\\)).`
);

GEN.trouSuiteArith = () => {
  const u0 = nz(-5,5), r = nz(-4,4), n = R(3,9);
  return TROU(
    `Suite arithmétique avec \\(u_0=${u0}\\) et \\(r=${r}\\) : complète le raisonnement.`,
    `Une suite \\((u_n)\\) est arithmétique lorsque la {{0}} \\(u_{n+1}-u_n\\) est constante : cette constante s'appelle la {{1}} \\(r\\).<br>
     On en déduit la formule explicite \\(u_n=u_0+n\\times r\\), d'où \\(u_{${n}}=${r < 0 ? `${u0}-${n}\\times ${-r}` : `${u0}+${n}\\times ${r}`}=${u0+n*r}\\).<br>
     Pour retrouver \\(r\\) à partir de deux termes \\(u_p\\) et \\(u_q\\), on calcule \\(\\dfrac{u_q-u_p}{q-p}\\).<br>
     Les points \\((n\\,;\\,u_n)\\) sont tous alignés : la suite est modélisée par une {{2}}.`,
    ['différence','raison','droite'],
    ['somme','produit','quotient','hippogriffe','berlingot'],
    `On multiplie la raison par le rang \\(n\\), pas par \\(n+1\\) : bien compter les pas depuis \\(u_0\\).`
  );
};

GEN.trouSuiteGeo = () => {
  const u0 = pick([1,2,4,5]), q = pick([2,3]);
  return TROU(
    `Suite géométrique avec \\(u_0=${u0}\\) et \\(q=${q}\\) : complète le raisonnement.`,
    `Une suite \\((u_n)\\) est géométrique lorsque le {{0}} \\(\\dfrac{u_{n+1}}{u_n}\\) est constant : cette constante est la {{1}} \\(q\\).<br>
     On en déduit \\(u_n=u_0\\times q^n\\) : le rang \\(n\\) devient l'{{2}} de \\(q\\).<br>
     Pour passer d'un terme au suivant, on ne multiplie jamais par la {{3}} mais par \\(q\\) — sinon c'est une suite arithmétique !`,
    ['quotient','raison','exposant','différence'],
    ['somme','pente','pamplemousse','marmotte','coefficient'],
    `Rang \\(n\\) = exposant : \\(u_2=u_0\\times q^2\\), pas \\(u_0\\times q\\times 2\\).`
  );
};

GEN.trouPourcentage = () => TROU(
  `Évolutions et pourcentages : complète le raisonnement.`,
  `Augmenter de \\(t\\,\\%\\) revient à multiplier par \\(1+\\dfrac{t}{100}\\) : ce nombre est le {{0}}.<br>
   Une baisse de \\(20\\,\\%\\) correspond donc au coefficient {{1}}.<br>
   Après deux évolutions successives, on multiplie les coefficients entre eux : les taux ne s'{{2}} jamais.<br>
   Une hausse de \\(10\\,\\%\\) suivie d'une baisse de \\(10\\,\\%\\) n'est donc {{3}} neutre : on retrouve \\(0{,}99\\) fois la valeur de départ.`,
  ['coefficient multiplicateur','0,8','additionnent','pas'],
  ['1,2','20','soustraient','pamplemousse','pétanque','0,08'],
  `\\(+10\\,\\%\\) puis \\(-10\\,\\%\\) : \\(1{,}10\\times 0{,}90=0{,}99\\). Le retour n'est jamais exact — c'est le piège favori des vendeurs.`
);

GEN.trouTrigo = () => { const q = TROU(
  `Cercle trigonométrique : complète le raisonnement.`,
  `Sur le cercle trigonométrique, le point associé à un angle \\(a\\) a pour coordonnées \\((\\cos a\\,;\\,\\sin a)\\).<br>
   Le {{0}} se lit sur l'axe des abscisses, le {{1}} sur l'axe des ordonnées.<br>
   Pour tout \\(a\\) : \\(\\cos^2 a+\\sin^2 a=1\\) — c'est le théorème de {{2}} appliqué au cercle.<br>
   Les fonctions sinus et cosinus sont {{3}} de période \\(2\\pi\\) : la courbe se répète à l'infini.`,
  ['cosinus','sinus','Pythagore','périodiques'],
  ['tangente','pamplemousse','Thalès','croissantes','hypoténuse'],
  `Ne pas échanger les axes : le cosinus est un \\(x\\) (horizontal), le sinus un \\(y\\) (vertical).`,
  /* « hypoténuse » n'a clairement AUCUN sens dans ce raisonnement sur le
     cercle trigonométrique : clé loufoque DE CONTEXTE (chute maximale), à la
     différence de « Thalès » ou « tangente » — confusions plausibles, erreurs
     ordinaires. */
  ['hypoténuse']
  );
  q.trigAnim = { fn:'read', a1:60, a1Txt:'a', sum:'b = cos a (axe des x) ; b = sin a (axe des y)' };
  return q;
};

GEN.trouScalaire = () => TROU(
  `Produit scalaire : complète le raisonnement.`,
  `Le produit scalaire se calcule avec les coordonnées : \\(\\vec{u}\\cdot\\vec{v}=xx'+yy'\\).<br>
   Il peut aussi s'écrire \\(\\vec{u}\\cdot\\vec{v}=\\|\\vec{u}\\|\\times\\|\\vec{v}\\|\\times\\cos(\\theta)\\), où \\(\\theta\\) est l'{{0}} entre les deux vecteurs.<br>
   Si le produit scalaire est {{1}} avec des vecteurs non nuls, alors les vecteurs sont {{2}}.<br>
   Le résultat est un nombre, pas un vecteur : c'est une grandeur {{3}}.`,
  ['angle','nul','orthogonaux','scalaire'],
  ['segment','positif','colinéaires','norme','choucroute','grenouille'],
  `Si \\(\\vec{u}\\cdot\\vec{v}=0\\), on ne conclut « orthogonaux » que si les deux vecteurs sont non nuls.`
);

GEN.trouProba = () => TROU(
  `Probabilités : complète le raisonnement.`,
  `Deux événements \\(A\\) et \\(B\\) sont {{0}} lorsque \\(A\\cap B=\\varnothing\\) : alors \\(P(A\\cup B)=P(A)+P(B)\\).<br>
   Sinon \\(P(A\\cup B)=P(A)+P(B)-P(A\\cap B)\\) : on {{1}} la probabilité de l'intersection pour ne pas la compter deux fois.<br>
   Toute probabilité est comprise entre {{2}} et {{3}} (bornes incluses).`,
  ['incompatibles','soustrait','0','1'],
  ['indépendants','additionne','2','grenouille','pamplemousse','contraires'],
  `« Incompatibles » (aucun cas commun) et « indépendants » (l'un ne change pas l'autre) sont deux idées différentes : ne pas confondre.`,
  /* Exercice de PROBABILITÉS : toute clé numérique négative ou strictement
     supérieure à 1 est loufoque (une probabilité vit toujours dans [0;1]) —
     ex. placer « 2 » dans « comprise entre 0 et … ». */
  null, true
);

GEN.trouPrimitive = () => TROU(
  `Primitives : complète le raisonnement.`,
  `\\(F\\) est une primitive de \\(f\\) lorsque \\(F'=f\\).<br>
   Deux primitives d'une même fonction diffèrent d'une {{0}} : si \\(F\\) convient, \\(F+7\\) aussi.<br>
   Pour primitiver \\(x^n\\), on {{1}} l'exposant d'une unité puis on divise par le nouvel {{2}} : \\(x^n\\) a pour primitive \\(\\dfrac{x^{n+1}}{n+1}\\).`,
  ['constante','augmente','exposant'],
  ['diminue','dérivée','pamplemousse','flibuste','racine','raison'],
  `Vérifier en dérivant : si \\(\\left(\\dfrac{x^{n+1}}{n+1}\\right)'=x^n\\), la primitive est correcte.`
);

GEN.trouPythagore = () => {
  const a = R(3,9), b = R(3,9), c2 = a*a+b*b;
  return TROU(
    `Triangle avec \\(AB=${a}\\) et \\(AC=${b}\\) : complète le raisonnement de Pythagore.`,
    `Dans un triangle {{0}} en \\(A\\) : \\(BC^2=AB^2+AC^2\\), donc ici \\(BC^2=${a}^2+${b}^2=${c2}\\).<br>
     L'hypoténuse \\(BC\\) est le côté opposé à l'angle {{1}} et c'est toujours le côté le plus {{2}} du triangle.<br>
     Réciproquement, si \\(BC^2=AB^2+AC^2\\), alors le triangle est {{3}} en \\(A\\).`,
    ['rectangle','droit','long','rectangle'],
    ['isocèle','aigu','équilateral','médiane','pamplemousse','berlingot'],
    `L'hypoténuse est TOUJOURS en face de l'angle droit : chercher \\(BC^2\\), pas la somme dans n'importe quel ordre.`
  );
};

GEN.trouThales = () => {
  const am = R(2,5), ab = am + R(2,5);
  return TROU(
    `Thalès avec \\(M\\) sur \\([AB]\\), \\(N\\) sur \\([AC]\\) : complète le raisonnement.`,
    `Le théorème de Thalès s'applique lorsque \\((MN)\\) et \\((BC)\\) sont {{0}} : sans cette condition, on ne peut rien conclure.<br>
     On obtient \\(\\dfrac{AM}{AB}=\\dfrac{AN}{AC}=\\dfrac{MN}{BC}\\) : ces rapports de longueurs sont {{1}}.<br>
     Par exemple, si \\(\\dfrac{AM}{AB}=${am}/${ab}\\), une longueur manquante se calcule avec le {{2}}.<br>
     Attention : si les droites ne sont pas {{3}}, les rapports ne sont plus égaux.`,
    ['parallèles','égaux','produit en croix','parallèles'],
    ['perpendiculaires','voisines','égales','pamplemousse','chaussette','moyenne'],
    `On compare des rapports dans le même « fût » : \\(\\dfrac{AM}{AB}\\) et non \\(\\dfrac{AM}{AC}\\). Et toujours vérifier le parallélisme avant d'écrire les rapports.`
  );
};

