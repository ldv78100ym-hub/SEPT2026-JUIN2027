/* ============================================================
   11y. AUTOMATISMES STS : INDICES, SYSTÈMES POSITIONNELS & SÉRIES
   ============================================================ */
   /* ------------------------------------------------------------
   Contenu issu de l'AUDIT DU DÉPÔT (racine GitHub) : notions
   abordées dans le dépôt mais absentes de la tour, désormais
   couvertes.
   Sources :
   • STS_BIO_AC/ANNALES (BTS groupement D, 2000-2026) : indices
     base 100, systèmes de numération positionnels (binaire,
     hexadécimal), effectifs et fréquences cumulées (lecture de
     tableaux statistiques, classes) ;
   • PROGRESSIONS_CLASSES/PROGRESSION_STS_BIO-AC_2 (tableau des
     contenus : automatismes de calcul, représentations de séries
     statistiques) ;
   • STS_BIO_AC/STATISTIQUES (regroupements en classes, cumuls,
     médiane par le polygone des effectifs cumulés).

   AJOUTE : 3 générateurs (GEN), 3 notions (NOTIONS.splice avant
   « su-limites »), 3 sous-catégories et un ENRICHISSEMENT de la
   fiche « statistiques ». Niveaux (11v) : CPGE.
   ============================================================ */

/* ------------------------------------------------------------
   GÉNÉRATEURS
   ------------------------------------------------------------ */
(() => {
  const uniq3 = (ans, cands) => {
    const out = [];
    for (let i = 0; i < cands.length && out.length < 3; i++) {
      const c = cands[i];
      if (c !== ans && c !== undefined && String(c) !== '' && out.indexOf(c) < 0) out.push(c);
    }
    return out;
  };

  /* ---------- 1. Indices base 100 ---------- */
  GEN.indice100 = () => {
    const cas = pick([
      { q: `Prix 2024 : 250 €. Prix 2025 : 275 €. Quel est l'indice base 100 en 2024 ?`, good: '110', wr: ['111', '125', '109'],
        exp: `l'indice vaut \\(100 \\times \\dfrac{275}{250} = 110\\) : +10 %` },
      { q: `Effectif 2024 : 80. Effectif 2025 : 76. Quel est l'indice base 100 en 2024 ?`, good: '95', wr: ['105', '94', '80'],
        exp: `\\(100 \\times \\dfrac{76}{80} = 95\\) : baisse de 5 %` },
      { q: `Indice base 100 (2020) d'un prix en 2026 : 120. L'année suivante, l'indice passe à 125. Quelle est la variation 2026 → 2027 ?`, good: `+4{,}17 \\%`, wr: [`+5 \\%`, `+25 \\%`, `+1 \\%`],
        exp: `on compare au DERNIER indice connu : \\(\\dfrac{125 - 120}{120} \\approx +4{,}17\\%\\), pas +5 %` },
      { q: `Quantité 2024 : 1200. Quantité 2025 : 1500. Quel est l'indice base 100 en 2024 ?`, good: '125', wr: ['130', '150', '115'],
        exp: `\\(100 \\times \\dfrac{1500}{1200} = 125\\) : +25 %` }
    ]);
    const good = M(cas.good);
    const wrongs = cas.wr.map(w => M(w));
    return QCM(cas.q, good, uniq3(good, wrongs), 1,
      EXPL(`Un indice base 100 à une date de référence mesure l'évolution RELATIVE : \\(\\text{indice} = 100 \\times \\dfrac{\\text{valeur}}{\\text{valeur de référence}}\\). L'indice 100 est la BASE ; lire un indice, c'est lire un pourcentage d'évolution (indice 110 = +10 %, indice 95 = −5 %).`,
        `Ici, ${cas.exp}.`,
        `Le piège : calculer une évolution entre deux indices en les SOUSTRAYANT (125 − 120 = « +5 ») alors qu'il faut DIVISER : \\(\\dfrac{125}{120}\\), soit +4,17 %. Entre deux années quelconques, on « chaîne » les indices par division.`));
  };

  /* ---------- 2. Binaire, hexadécimal & systèmes positionnels ---------- */
  GEN.binaireHexa = () => {
    const cas = pick([
      { q: `Que vaut \\(1011_2\\) en décimal ?`, good: '11', wr: ['13', '1011', '9'],
        exp: `\\(1\\times8 + 0\\times4 + 1\\times2 + 1\\times1 = 11\\) (poids 8-4-2-1)` },
      { q: `Comment s'écrit 13 en binaire ?`, good: `1101_2`, wr: [`1011_2`, `1110_2`, `1001_2`],
        exp: `13 = 8 + 4 + 1 = \\(1101_2\\) (divisions successives par 2)` },
      { q: `Que vaut \\(2F_{16}\\) en décimal ?`, good: '47', wr: ['32', '215', '51'],
        exp: `\\(2 \\times 16 + 15 = 47\\) : F vaut 15` },
      { q: `Un octet (8 bits) peut coder combien de valeurs différentes ?`, good: '256', wr: ['128', '255', '64'],
        exp: `\\(2^8 = 256\\) valeurs (de 0 à 255)` }
    ]);
    const good = M(cas.good);
    const wrongs = cas.wr.map(w => M(w));
    return QCM(cas.q, good, uniq3(good, wrongs), 1,
      EXPL(`Un système positionnel attribue à chaque chiffre un POIDS selon sa position : en base \\(b\\), le nombre \\(a_n \\ldots a_1 a_0\\) vaut \\(a_n b^n + \\ldots + a_1 b + a_0\\). Binaire (b = 2, poids 8-4-2-1), hexadécimal (b = 16, chiffres 0-9 puis A = 10 … F = 15) : \\(2F_{16} = 2\\times16 + 15 = 47\\).`,
        `Ici, ${cas.exp}.`,
        `Le piège : lire « 1011 » comme mille-onze au lieu de décomposer en poids ; ou compter 255 valeurs pour un octet en oubliant le ZÉRO (de 0 à 255, ce sont 256 valeurs).`));
  };

  /* ---------- 3. Effectifs & fréquences cumulés ---------- */
  GEN.freqCumulees = () => {
    const cas = pick([
      { q: `Effectifs cumulés croissants aux bornes de classes : 12, 30, 40. Quel est l'effectif de la 2ᵉ classe ?`, good: '18', wr: ['30', '42', '12'],
        exp: `l'effectif de la classe 2 est la DIFFÉRENCE des cumulés : 30 − 12 = 18` },
      { q: `Une fréquence cumulée croissante (FCC) à la dernière classe vaut forcément…`, good: `1\\ (100 \\%)`, wr: [`0{,}5`, `0`, `le plus grand effectif`],
        exp: `toutes les valeurs sont en dessous de la dernière borne : la FCC finit à 100 %` },
      { q: `La FCC vaut 0,25 à la fin d'une classe. Que sait-on ?`, good: `25 \\% des valeurs sont en dessous`, wr: [`25 \\% des valeurs sont dans cette classe`, `75 \\% des valeurs sont en dessous`, `la classe contient 25 valeurs`],
        exp: `la FCC CUMULE depuis le début : 25 % des valeurs sont inférieures à la borne` },
      { q: `Sur le polygone des effectifs cumulés croissants, la médiane se lit…`, good: `à l'intersection avec l'effectif cumulé 50 \\%`, wr: [`à la plus grande ordonnée`, `à l'abscisse du premier point`, `au milieu de la première classe`],
        exp: `la médiane coupe la population en deux moitiés : on lit l'antécédent du cumulé 50 %` }
    ]);
    const good = M(cas.good);
    const wrongs = cas.wr.map(w => M(w));
    return QCM(cas.q, good, uniq3(good, wrongs), 1,
      EXPL(`Les EFFECTIFS CUMULÉS CROISSANTS (ECC) additionnent au fur et à mesure : à la borne d'une classe, ils donnent le nombre de valeurs EN DESSOUS. L'effectif d'une classe = différence des ECC consécutifs. Les FRÉQUENCES CUMULÉES CROISSANTES (FCC) en sont la version pourcentage : elles démarrent à 0, finissent à 1 (100 %), et permettent de lire la MÉDIANE (antécédent de 50 %) et les QUARTILES (25 % et 75 %) sur le polygone.`,
        `Ici, ${cas.exp}.`,
        `Le piège : confondre l'effectif d'une classe avec son effectif CUMULÉ (il faut soustraire le cumulé précédent) ; ou croire que la FCC « à 0,25 » parle de la classe elle-même alors qu'elle cumule depuis la première classe.`));
  };
})();

/* ------------------------------------------------------------
   ÉLÉMENTS SIMPLES
   ------------------------------------------------------------ */
Object.assign(GEN_INFO, {
  'indice100':     { label: 'Indices base 100 & évolutions enchaînées', fiches: ['statistiques', 'evolutions-taux'],
    rappel: `Indice = \\(100 \\times \\dfrac{\\text{valeur}}{\\text{valeur de référence}}\\) ; entre deux indices, évolution par DIVISION.` },
  'binaireHexa':   { label: 'Binaire, hexadécimal & systèmes positionnels', fiches: ['nombres', 'python'],
    rappel: `En base \\(b\\), chaque chiffre pèse \\(b^n\\) : \\(1011_2 = 11\\), \\(2F_{16} = 47\\), un octet code \\(2^8 = 256\\) valeurs.` },
  'freqCumulees':  { label: 'Effectifs & fréquences cumulés', fiches: ['statistiques', 'probabilites'],
    rappel: `ECC = effectif EN DESSOUS ; FCC de 0 à 100 % ; médiane = antécédent de 50 % sur le polygone des cumulés.` }
});

/* ------------------------------------------------------------
   FICHE « statistiques » ENRICHIE (indices, positionnels, cumuls)
   ------------------------------------------------------------ */
(function () {
  const f = FICHES['statistiques'];
  if (f && f.html.indexOf('Indices (base 100)') < 0) {
    f.html += `
    <p><b>Indices (base 100) :</b> \\(\\text{indice} = 100 \\times \\dfrac{\\text{valeur}}{\\text{valeur de référence}}\\). Entre deux indices, l'évolution se calcule par DIVISION : \\(t = \\dfrac{I_2 - I_1}{I_1}\\) (indice 110 = +10 %, 95 = −5 %).</p>
    <p><b>Systèmes positionnels :</b> en base \\(b\\), chaque chiffre a un poids \\(b^n\\) — binaire (8-4-2-1), hexadécimal (A = 10 … F = 15), \\(2F_{16} = 47\\) ; un octet code \\(2^8 = 256\\) valeurs (0 à 255).</p>
    <p><b>Classes & cumuls :</b> ECC à une borne = effectif EN DESSOUS (l'effectif d'une classe est la différence des ECC consécutifs) ; FCC de 0 à 100 % ; médiane = antécédent de 50 % sur le polygone des cumulés croissants, quartiles à 25 % et 75 %.</p>`;
  }
})();

/* ============================================================
   3 NOTIONS NOUVELLES (splice avant « su-limites »)
   ============================================================ */
const NOUVELLES_AUTOSTS = [
  { id: 'indice-100',          name: 'Indices base 100 & évolutions enchaînées', g: ['indice100'],       family: 'orange', prob: 0.5 },
  { id: 'systemes-positionnels', name: 'Binaire, hexadécimal & systèmes positionnels', g: ['binaireHexa'], family: 'amber', prob: 0.5 },
  { id: 'freq-cumulees',       name: 'Effectifs & fréquences cumulés',           g: ['freqCumulees'],   family: 'blue',   prob: 0.5 }
];
(function () {
  const iLim = NOTIONS.findIndex(n => n.id === 'su-limites');
  if (iLim < 0) NOTIONS.push.apply(NOTIONS, NOUVELLES_AUTOSTS);
  else NOTIONS.splice.apply(NOTIONS, [iLim, 0].concat(NOUVELLES_AUTOSTS));
})();

/* ============================================================
   PROGRESSION : 3 sous-catégories.
   ============================================================ */
(function () {
  const sub1 = { nom: 'Indices & bases', ids: ['indice-100'] };
  const cat1 = PROG_CATS.find(c => c.nom === 'Pourcentages, proportions & évolutions');
  if (cat1) cat1.subs.push(sub1);

  const sub2 = { nom: 'Binaire, hexadécimal & systèmes positionnels', ids: ['systemes-positionnels'] };
  const cat2 = PROG_CATS.find(c => c.nom === 'Nombres, fractions & puissances');
  if (cat2) cat2.subs.push(sub2);

  const sub3 = { nom: 'Séries statistiques : classes & cumuls', ids: ['freq-cumulees'] };
  const cat3 = PROG_CATS.find(c => c.nom === 'Probabilités & statistiques');
  if (cat3) cat3.subs.push(sub3);
})();

/* Formes 3D des nouveaux étages. */
document.addEventListener('DOMContentLoaded', function () {
  try {
    FLOOR_SHAPES['indice-100']          = 'arch';
    FLOOR_SHAPES['systemes-positionnels'] = 'grid';
    FLOOR_SHAPES['freq-cumulees']       = 'stairs';
  } catch (e) { /* 'box' */ }
});
