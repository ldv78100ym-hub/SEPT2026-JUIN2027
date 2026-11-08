/* ============================================================
   11o. LOGIQUE PURE — MODUS PONENS, CHAÎNAGE & VERDICTS
   ============================================================
   Contenu tiré du document joint « Logique Pure — Exercices de
   logique déductive » (moteur propositionnel sur affirmations,
   implications et équivalences, verdicts sémantiques VRAI / FAUX /
   INDÉTERMINÉ, chaînage avant par modus ponens et biconditionnel,
   enquêtes concrètes) : déduire par chaînage, prouver une négation,
   reconnaître ce que les énoncés ne tranchent pas, utiliser
   l'équivalence dans les deux sens.

   AJOUTE : 5 générateurs (GEN), un complément de la fiche
   « logique », 5 éléments simples (GEN_INFO), 2 notions
   (NOTIONS.splice avant « su-limites »), 1 catégorie de
   progression « Logique & raisonnement » (avec transfert de
   « sets-logic ») — la tour compte donc 193 étages (191 + 2).
   ============================================================ */

/* ------------------------------------------------------------
   GÉNÉRATEURS — logique déductive
   ------------------------------------------------------------ */
(() => {
  /* Trois distracteurs distincts, différents de la réponse. */
  const uniq3 = (ans, cands) => {
    const out = [];
    for (let i = 0; i < cands.length && out.length < 3; i++) {
      const c = cands[i];
      if (c !== ans && c !== undefined && String(c) !== '' && out.indexOf(c) < 0) out.push(c);
    }
    return out;
  };

  const VRAI = 'VRAI : c\'est forcé par les énoncés';
  const FAUX = 'FAUX : sa négation est forcée';
  const INDET = 'INDÉTERMINÉ : les énoncés ne tranchent pas';

  /* ---------- 1. Modus ponens : la prémisse établie déclenche ---------- */
  GEN.logModusPonens = () => {
    const sc = pick([
      { pre: 'Minet est un chat.', imp: 'Si Minet est un chat, alors Minet est un mammifère.',
        ccl: 'Minet est un mammifère',
        exp1: '« Minet est un chat » est établi : la prémisse de l\'implication est VRAIE.',
        exp2: 'Modus ponens : la prémisse et l\'implication ensemble forcent la conclusion.',
        piege: 'Une implication dont la prémisse est FAUSSE n\'attend rien : elle ne donne aucune conclusion. Ici, la prémisse est établie — l\'implication s\'applique.' },
      { pre: 'Le café du matin est servi.', imp: 'Si le café du matin est servi, alors Arlette s\'installe au comptoir.',
        ccl: 'Arlette s\'installe au comptoir',
        exp1: '« Le café du matin est servi » est un fait : la prémisse est VRAIE.',
        exp2: 'Le modus ponens transforme fait + règle en nouveau fait.',
        piege: 'Un énoncé inapplicable n\'est pas faux : il attend sa prémisse. Ici elle est là — la conclusion est FORCÉE.' },
      { pre: 'Il pleut.', imp: 'S\'il pleut, alors le chemin est boueux.',
        ccl: 'Le chemin est boueux',
        exp1: '« Il pleut » est établi : l\'antécédent de l\'implication est VRAI.',
        exp2: 'De la règle et du fait, la conclusion suit nécessairement.',
        piege: 'Confondre « si P alors Q » avec « si Q alors P » : la règle va du fait ÉTABLI vers la conclusion, jamais l\'inverse.' }
    ]);
    return QCM(
      `Énoncés :<br>① ${sc.pre}<br>② ${sc.imp}<br><b>Que peut-on conclure sur « ${sc.ccl} » ?</b>`,
      M(VRAI),
      uniq3(VRAI, [FAUX, INDET]),
      1,
      EXPL(`Le MODUS PONENS est le seul pas de déduction : si \\(P\\) est vrai et si \\(P \\Rightarrow Q\\), alors \\(Q\\) est forcé par les énoncés.`,
        `${sc.exp1} Avec l'implication, ${sc.exp2} Donc « ${sc.ccl} » est VRAI.`,
        `${sc.piege}`));
  };

  /* ---------- 2. Chaînage : plusieurs pas jusqu'à la cible ---------- */
  GEN.logChainage = () => {
    const sc = pick([
      { fait: 'Il pleut.',
        imps: ['S\'il pleut, alors le chemin est boueux.', 'Si le chemin est boueux, alors les chaussures sont sales.'],
        ccl: 'les chaussures sont sales',
        chain: '« Il pleut » → le chemin est boueux → les chaussures sont sales : deux pas de modus ponens.' },
      { fait: 'Le tramway passe à huit heures pile.',
        imps: ['Si le tramway passe à huit heures pile, alors les portes s\'ouvrent.',
               'Si les portes s\'ouvrent, alors la grand-mère monte avec son panier.',
               'Si la grand-mère monte, alors le panier de cerises embaume la rame.'],
        ccl: 'le panier de cerises embaume la rame',
        chain: '« Le tramway passe » → portes ouvertes → grand-mère à bord → panier embaumant : trois pas enchaînés.' },
      { fait: 'C\'est mardi matin.',
        imps: ['Si c\'est mardi matin, alors les poubelles sortent au trottoir.',
               'Si les poubelles sortent au trottoir, alors le camion s\'arrête au coin de la rue.'],
        ccl: 'le camion s\'arrête au coin de la rue',
        chain: '« C\'est mardi matin » → poubelles dehors → camion au coin : la chaîne se parcourt dans l\'ordre des prémisses établies.' }
    ]);
    return QCM(
      `Énoncés :<br>① ${sc.fait}<br>${sc.imps.map((s, i) => `${'①②③④'[i + 1]} ${s}`).join('<br>')}<br><b>Peut-on conclure que « ${sc.ccl} » ?</b>`,
      M(VRAI),
      uniq3(VRAI, [FAUX, INDET]),
      1,
      EXPL(`Une chaîne d'implications se parcourt pas à pas : chaque conclusion devient la prémisse de l'implication suivante (chaînage avant).`,
        `${sc.chain} À chaque pas, la conclusion intermédiaire est ÉTABLIE avant d'être réutilisée : « ${sc.ccl} » est donc VRAI.`,
        `L'ordre des pas, c'est la preuve : sauter un maillon revient à appliquer une implication dont la prémisse n'est pas encore établie. Aucun maillon ne se saute — aucun ne se remplace par l'implication réciproque.`));
  };

  /* ---------- 3. Négation forcée : prouver qu'une chose est FAUSSE ---------- */
  GEN.logNegationForcee = () => {
    const sc = pick([
      { fait: 'Il pleut des cordes.',
        imp: 'S\'il pleut des cordes, alors la sortie au parc est annulée.',
        cible: 'La sortie au parc est maintenue.',
        chain: '« Il pleut des cordes » est établi ; l\'implication force la NÉGATION de « la sortie est maintenue ».' },
      { fait: 'Le match est diffusé en clair ce soir.',
        imps: ['Si le match est diffusé en clair, alors toute la famille s\'installe devant l\'écran.',
               'Si toute la famille s\'installe devant l\'écran, alors Paul ne regarde pas son dessin animé.'],
        cible: 'Paul regarde son dessin animé.',
        chain: 'Match en clair → famille devant l\'écran → « Paul ne regarde pas son dessin animé » : la NÉGATION de la cible est forcée.' },
      { fait: 'La confiture de figues est finie.',
        imp: 'Si la confiture de figues est finie, alors les tartines du matin ne seront pas confiturées.',
        cible: 'Les tartines du matin seront confiturées.',
        chain: 'Le pot vide est établi ; l\'implication force « ne seront PAS confiturées », la négation exacte de la cible.' }
    ]);
    return QCM(
      `Énoncés :<br>① ${sc.fait}<br>${sc.imp ? '② ' + sc.imp + '<br>' : ''}${(sc.imps || []).map((s, i) => `${'②③'[i]} ${s}`).join('<br>')}<br><b>Que peut-on conclure sur « ${sc.cible} » ?</b>`,
      M(FAUX),
      uniq3(FAUX, [VRAI, INDET]),
      1,
      EXPL(`Pour prouver qu'une chose est FAUSSE, on n'exhibe pas de contre-exemple : on établit sa NÉGATION par déduction.`,
        `${sc.chain} Une négation déduite vaut preuve de fausseté : la cible est FAUSSE.`,
        `« Je ne peux pas le prouver » n'est pas « c'est faux » : ici, la négation est FORCÉE par les énoncés — c'est plus fort qu'une absence de preuve, c'est une preuve du contraire.`));
  };

  /* ---------- 4. Verdict indéterminé : l'effet a d'autres causes ---------- */
  GEN.logVerdictIndetermine = () => {
    const sc = pick([
      { fait: 'C\'est l\'anniversaire de Gaston demain.', autre: 'Si les parents préparent une surprise, alors les voisins entendent aussi les rires.',
        chainA: 'Si c\'est l\'anniversaire, alors les ballons gonflent dans le salon.',
        chainB: 'Si les ballons gonflent, alors les voisins entendent les rires.',
        cible: 'les parents préparent une surprise',
        exp: 'Les rires s\'entendent SANS surprise : l\'effet a d\'autres causes, il ne prouve pas la sienne.' },
      { fait: 'Le bus de dix-sept heures est en panne.',
        autre: 'Si le van du centre de loisirs passe, alors les chaussures se couvrent aussi de boue.',
        chainA: 'Si le bus est en panne, alors les écoliers rentrent à pied.',
        chainB: 'S\'ils rentrent à pied, alors les chaussures se couvrent de boue.',
        cible: 'le van du centre de loisirs est passé',
        exp: 'La boue ne désigne pas le van : elle a au moins une autre cause (la panne du bus).' },
      { fait: 'Le café est passé.',
        autre: 'Si la sieste est prise, alors l\'après-midi s\'annonce tranquille aussi.',
        chainA: 'Si le café est passé, alors l\'après-midi s\'annonce tranquille.',
        cible: 'la sieste est prise',
        exp: 'Un après-midi tranquille ne prouve pas la sieste : l\'effet a d\'autres causes.' }
    ]);
    return QCM(
      `Énoncés :<br>① ${sc.fait}<br>② ${sc.chainA}<br>${sc.chainB ? '③ ' + sc.chainB + '<br>' : ''}${sc.autre}<br>Les voisins constatent l\'effet annoncé par la chaîne.<br><b>Que peut-on conclure sur « ${sc.cible} » ?</b>`,
      M(INDET),
      uniq3(INDET, [VRAI, FAUX]),
      1,
      EXPL(`Un verdict sémantique énumère les mondes compatibles avec les énoncés : si certains rendent la cible vraie et d'autres fausse, le verdict est INDÉTERMINÉ.`,
        `La chaîne ① → ② ${sc.chainB ? '→ ③ ' : ''}établit l'EFFET. Mais l'énoncé « ${sc.autre} » offre une AUTRE cause au même effet. ${sc.exp} Les mondes compatibles se partagent : rien ne tranche.`,
        `L'effet ne prouve pas la cause : de « si cause alors effet » et « effet observé », on ne peut PAS remonter à la cause. C'est le confondre avec le modus ponens (dans l'autre sens) qui fabrique des certitudes illégitimes.`));
  };

  /* ---------- 5. Équivalence : la porte à double sens ---------- */
  GEN.logEquivalence = () => {
    const sc = pick([
      { fait: 'La boulangerie du coin est ouverte.',
        eq: 'La boulangerie est ouverte SI ET SEULEMENT SI l\'odeur de pain traverse la rue.',
        cible: 'l\'odeur de pain traverse la rue',
        sens: 'le sens « ouverte ⇒ odeur »' },
      { fait: 'Tante Berthe arrive demain.',
        eq: 'Tante Berthe arrive SI ET SEULEMENT SI le lit du grenier est préparé.',
        cible: 'le lit du grenier est préparé',
        sens: 'le sens « arrivée ⇒ lit préparé »' },
      { fait: 'Les vitres de l\'abribus givent.',
        eq: 'Il gèle à pierre fendre SI ET SEULEMENT SI les vitres de l\'abribus givent.',
        cible: 'il gèle à pierre fendre',
        sens: 'le sens « givre ⇒ gel », le sens retour de l\'équivalence' }
    ]);
    return QCM(
      `Énoncés :<br>① ${sc.fait}<br>② ${sc.eq}<br><b>Que peut-on conclure sur « ${sc.cible} » ?</b>`,
      M(VRAI),
      uniq3(VRAI, [FAUX, INDET]),
      1,
      EXPL(`Une ÉQUIVALENCE \\(P \\Leftrightarrow Q\\) est une implication à double sens : \\(P \\Rightarrow Q\\) ET \\(Q \\Rightarrow P\\).`,
        `« ${sc.fait} » est établi, et l'équivalence s'utilise ici par ${sc.sens} : « ${sc.cible} » est VRAI.`,
        `L'équivalence donne dans les DEUX sens, contrairement à l'implication simple : ici le sens retour est LÉGITIME. Mais attention : une simple implication n'autoriserait PAS ce retour — équivalence ≠ implication.`));
  };
})();

/* ------------------------------------------------------------
   COMPLÉMENT DE LA FICHE « LOGIQUE »
   ------------------------------------------------------------ */
FICHES['logique'].html += `
    <p><b>Modus ponens :</b> de \\(P\\) vrai et \\(P \\Rightarrow Q\\), conclure \\(Q\\). C'est LE pas de déduction ; toute preuve est une chaîne de tels pas.</p>
    <p><b>Chaînage avant :</b> chaque conclusion déduite devient la prémisse de l'implication suivante — l'ordre des pas fait la preuve.</p>
    <p><b>Prouver une négation :</b> pour établir qu'une affirmation est FAUSSE, déduire sa NÉGATION des énoncés (une négation déduite vaut preuve de fausseté).</p>
    <p><b>Verdicts sémantiques :</b> énumérer les mondes compatibles avec les énoncés. Si TOUS rendent la cible vraie → VRAI ; si TOUS la rendent fausse → FAUX ; si les mondes se partagent → INDÉTERMINÉ.</p>
    <p><b>L'effet ne prouve pas la cause :</b> de « si cause alors effet » et « effet constaté », on ne peut PAS conclure « cause » — l'effet a souvent d'autres causes.</p>
    <p><b>Équivalence \\(P \\Leftrightarrow Q\\) :</b> implication à DOUBLE sens : de \\(P\\) conclure \\(Q\\), et de \\(Q\\) conclure \\(P\\). Le sens retour, illégitime pour une implication simple, est LÉGITIME pour une équivalence.</p>`;

/* ------------------------------------------------------------
   ÉLÉMENTS SIMPLES : libellé + rappel + fiches des 5 générateurs
   ------------------------------------------------------------ */
Object.assign(GEN_INFO, {
  'logModusPonens':      { label: 'Modus ponens : la prémisse établie déclenche', fiches: ['logique'],
    rappel: "Si \\(P\\) est vrai et \\(P \\Rightarrow Q\\), alors \\(Q\\) est forcé : fait + règle = nouveau fait." },
  'logChainage':          { label: 'Chaînage avant : plusieurs pas de déduction', fiches: ['logique'],
    rappel: "Chaque conclusion devient la prémisse suivante : la chaîne se parcourt dans l'ordre, sans sauter de maillon." },
  'logNegationForcee':   { label: 'Prouver une négation (verdict FAUX)', fiches: ['logique'],
    rappel: "Pour prouver qu'une chose est fausse : déduire sa négation des énoncés. Une négation déduite vaut preuve." },
  'logVerdictIndetermine': { label: 'Verdict indéterminé : l\'effet a d\'autres causes', fiches: ['logique', 'proportionnalite'],
    rappel: "De « si cause alors effet » et « effet constaté », rien ne suit sur la cause : le verdict est INDÉTERMINÉ." },
  'logEquivalence':      { label: 'Équivalence : la porte à double sens', fiches: ['logique'],
    rappel: "\\(P \\Leftrightarrow Q\\) donne \\(P \\Rightarrow Q\\) ET \\(Q \\Rightarrow P\\) : le sens retour est légitime." }
});

/* ============================================================
   2 NOTIONS NOUVELLES (→ 193 étages, avant les « limites »)
   ============================================================ */
const NOUVELLES_LOGIQUE = [
  { id: 'log-deduction', name: 'Modus ponens & chaînage',      g: ['logModusPonens', 'logChainage', 'logNegationForcee'], family: 'violet', prob: 0.5 },
  { id: 'log-verdicts',  name: 'VRAI, FAUX ou indéterminé',    g: ['logVerdictIndetermine', 'logEquivalence'],           family: 'violet', prob: 0.5 }
];
(function () {
  const iLim = NOTIONS.findIndex(n => n.id === 'su-limites');
  if (iLim < 0) NOTIONS.push.apply(NOTIONS, NOUVELLES_LOGIQUE);
  else NOTIONS.splice.apply(NOTIONS, [iLim, 0].concat(NOUVELLES_LOGIQUE));
})();

/* ============================================================
   PROGRESSION : 1 catégorie nouvelle « Logique & raisonnement »,
   qui accueille aussi « sets-logic » (retirée de sa sous-catégorie
   d'origine pour éviter tout doublon d'affichage).
   ============================================================ */
(function () {
  /* 1. Retirer 'sets-logic' de sa sous-catégorie actuelle. */
  PROG_CATS.forEach(function (cat) {
    (cat.subs || []).forEach(function (sub) {
      const i = (sub.ids || []).indexOf('sets-logic');
      if (i >= 0) sub.ids.splice(i, 1);
    });
  });
  /* 2. Créer la catégorie, avant « Missions de synthèse ». */
  const cat = {
    icon: '🧠', nom: 'Logique & raisonnement',
    subs: [
      { nom: 'Ensembles, intervalles & négations', ids: ['sets-logic'] },
      { nom: 'Modus ponens & chaînage',            ids: ['log-deduction'] },
      { nom: 'VRAI, FAUX ou indéterminé',          ids: ['log-verdicts'] }
    ]
  };
  const iM = PROG_CATS.findIndex(c => c.nom === 'Missions de synthèse');
  if (iM < 0) PROG_CATS.push(cat);
  else PROG_CATS.splice(iM, 0, cat);
})();

/* Formes 3D des nouveaux étages (FLOOR_SHAPES est déclaré dans
   14-formes-3d.js, chargé plus tard : l'affectation attend la fin
   du chargement de la page.) */
document.addEventListener('DOMContentLoaded', function () {
  try {
    FLOOR_SHAPES['log-deduction'] = 'arrow';
    FLOOR_SHAPES['log-verdicts']  = 'checker';
  } catch (e) { /* formes de secours : 'box' */ }
});
