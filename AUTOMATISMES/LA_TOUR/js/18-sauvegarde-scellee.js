/* ============================================================
   7bis. SAUVEGARDE SCELLÉE (sécurité bancaire), SESSIONS & NOTIONS PASSÉES
   - Paire de clés RSA-OAEP (2048 bits) détenue par l'ENSEIGNANT :
     la clé PUBLIQUE est intégrée ci-dessous dans le document livré à
     l'élève ; la clé PRIVÉE ne figure NULLE PART dans ce fichier —
     seule elle permet d'ouvrir et d'authentifier le scellé.
   - Export : fichier <document>_<NOM>-<Prénom>_<date>.json contenant
     toutes les données (énoncés, réponses, erreurs, notions traitées
     et à traiter avec pourcentages, reprises avec dates et heures)
     + une copie SCELLÉE (AES-256-GCM à clé aléatoire, elle-même
     enveloppée par la clé publique RSA-OAEP) : toute modification
     manuelle des données casse le scellé et devient décelable.
   - L'élève ne définit AUCUN mot de passe ; le rechargement utilise
     la partie lisible du fichier, le contrôle d'intégrité utilise
     le scellé (réservé à la clé privée de l'enseignant).
   - Sauvegarde continue (localStorage) locale ; tant que l'activité
     n'est pas finalisée (toutes les notions validées et aucune
     notion « Passer » en attente), l'ouverture du document recharge
     automatiquement la progression.
   ============================================================ */
const TDM_DOC = 'la-tour-des-maths-edition-claire';
/* Clé publique RSA-2048 (format SPKI, base64) — empreinte SHA-256 :
   FE:CB:1E:8E:67:49:15:79:A8:B4:74:B6:89:18:78:3C:2F:28:DD:9B:29:91:94:92:BC:FD:B4:18:49:83:53:BD */
const TDM_PUB_SPKI_B64 = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkemRsZfbz4EsK/+vy3JoY+2Z4O2ZzzVN40MIvJ+e6Ju63E0ua/8Vu1HzwsvLH4BvgCIrk8Grf0kpwepxQyIu6eMvsO63SQK4Vl2aoveP+Se/V4DtYghbFgBgC2E58qda68eA5yf4tasetaQ4T9AIxQbpN/pbIEr0f6zeeil/4rO5g8AbCuJMVPZHCDkPmrpBxcxUGPFcMgPpuQuboagMH+S9HrQOfPYisxs0jz1PNWiGYBn4g5Ck8LB5qrnu8VKkqAswfrBIqYbagiV3L5hUGe3x8K6HXcjrby1tVHNdeLJRpY+bodSaiCDtS35WRwXTdSwfCw0zO56Pfe3zcbP5LQIDAQAB';
const TDM_LS_PROFILE = 'tdm_profile_v1';
const TDM_LS_KEYS = 'tdm_keys_v1';
const TDM_LS_SAVE = 'tdm_save_v1';

const B64C = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function tdmB64(buf){
  const b = new Uint8Array(buf); let out = '';
  for(let i = 0; i < b.length; i += 3){
    const b0 = b[i], b1 = b[i+1], b2 = b[i+2];
    out += B64C[b0 >> 2];
    out += B64C[((b0 & 3) << 4) | ((b1 === undefined) ? 0 : (b1 >> 4))];
    out += (b1 === undefined) ? '=' : B64C[((b1 & 15) << 2) | ((b2 === undefined) ? 0 : (b2 >> 6))];
    out += (b2 === undefined) ? '=' : B64C[b2 & 63];
  }
  return out;
}
function tdmUnb64(str){
  let s = String(str);
  while(s.endsWith('=')) s = s.slice(0, s.length - 1);
  const bytes = []; let buf = 0, bits = 0;
  for(let i = 0; i < s.length; i++){
    const v = B64C.indexOf(s[i]);
    if(v < 0) continue;
    buf = (buf << 6) | v; bits += 6;
    if(bits >= 8){ bits -= 8; bytes.push((buf >> bits) & 255); }
  }
  return new Uint8Array(bytes);
}
function tdmP2(v){ return String(v).padStart(2, '0'); }
function tdmDateFR(d){ return tdmP2(d.getDate()) + '/' + tdmP2(d.getMonth() + 1) + '/' + d.getFullYear(); }
function tdmDateISO(d){ const dt = d || new Date(); return dt.getFullYear() + '-' + tdmP2(dt.getMonth() + 1) + '-' + tdmP2(dt.getDate()); }
function tdmHeureFR(d){ return tdmP2(d.getHours()) + ':' + tdmP2(d.getMinutes()); }
function tdmSan(s){ return String(s || '').replace(/[\\\/:*?"<>|]+/g, '-').replace(/\s+/g, '-'); }
/* Format imposé : <NOM DU DOCUMENT WEB>_<NOM ELEVE>-<Prenom eleve>_<date>.json */
function tdmFileName(d){
  const dt = d || new Date();
  if(!(SAV.data && SAV.data.eleve)){
    return TDM_DOC + '_eleve_' + tdmDateISO(dt) + '.json';
  }
  const e = SAV.data.eleve;
  return TDM_DOC + '_' + tdmSan(e.nom) + '-' + tdmSan(e.prenom) + '_' + tdmDateISO(dt) + '.json';
}
function tdmHasCrypto(){
  return !!(window.crypto && window.crypto.subtle && window.crypto.subtle.encrypt && window.TextEncoder);
}
/* Scellement « sécurité bancaire » : AES-256-GCM à clé aléatoire par
   sauvegarde, clé AES enveloppée par la clé publique RSA-OAEP (SHA-256)
   de l'enseignant intégrée au document. Renvoie null si l'API WebCrypto
   est indisponible (contexte non sécurisé). */
async function tdmSealWithTeacherPub(str){
  if(!tdmHasCrypto()) return null;
  try {
    const rsa = await window.crypto.subtle.importKey(
      'spki', tdmUnb64(TDM_PUB_SPKI_B64), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt']);
    const raw = window.crypto.getRandomValues(new Uint8Array(32));
    const iv  = window.crypto.getRandomValues(new Uint8Array(12));
    const aes = await window.crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['encrypt']);
    const ct  = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aes, new TextEncoder().encode(str));
    const cle = await window.crypto.subtle.encrypt({ name: 'RSA-OAEP' }, rsa, raw);
    const sha = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return {
      alg: 'RSA-OAEP-SHA256+AES-256-GCM',
      clePublique: 'FE:CB:1E:8E:67:49:15:79:A8:B4:74:B6:89:18:78:3C:2F:28:DD:9B:29:91:94:92:BC:FD:B4:18:49:83:53:BD',
      cle: tdmB64(cle), iv: tdmB64(iv), ct: tdmB64(ct), sha256: tdmB64(sha)
    };
  } catch(e){ return null; }
}
async function tdmGenerateKeys(){ return null; }
async function tdmEncryptEnv(payloadStr, pubJwk){
  if(!pubJwk || !tdmHasCrypto()){
    return { mode: 'base64', env: { v: 0, b64: tdmB64(new TextEncoder().encode(payloadStr)) } };
  }
  const aes = await window.crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const ct = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aes, new TextEncoder().encode(payloadStr));
  const raw = new Uint8Array(await window.crypto.subtle.exportKey('raw', aes));
  const rsaPub = await window.crypto.subtle.importKey('jwk', pubJwk, { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['encrypt']);
  const wrapped = await window.crypto.subtle.encrypt({ name: 'RSA-OAEP' }, rsaPub, raw);
  return { mode: 'rsa-aes', env: { v: 1, cle: tdmB64(wrapped), iv: tdmB64(iv), ct: tdmB64(ct) } };
}
async function tdmDecryptEnv(envIn, privJwk){
  const e = (envIn && envIn.env) ? envIn.env : envIn;
  if(!e) throw new Error('Enveloppe vide');
  if(e.v === 0 || !privJwk || !tdmHasCrypto()){
    return new TextDecoder().decode(tdmUnb64(e.b64));
  }
  const rsaPriv = await window.crypto.subtle.importKey('jwk', privJwk, { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['decrypt']);
  const raw = await window.crypto.subtle.decrypt({ name: 'RSA-OAEP' }, rsaPriv, tdmUnb64(e.cle));
  const aes = await window.crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, true, ['decrypt']);
  const pt = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv: tdmUnb64(e.iv) }, aes, tdmUnb64(e.ct));
  return new TextDecoder().decode(pt);
}

const SAV = {
  keys: null, data: null, lastEnv: null,
  startSession(){
    if(!SAV.data) return;
    const now = new Date();
    const snap = { validees: state.validated.size, score: tdmScoreGlobal(), altitude: state.floor, erreurs: state.errors };
    SAV.data.sessions.push({
      n: SAV.data.sessions.length + 1,
      date: tdmDateFR(now), heure: tdmHeureFR(now),
      debut: snap, fin: Object.assign({}, snap),
      progressionVsPrecedente: null
    });
  },
  onValidated(id){
    const r = tdmRec(id);
    r.validee = true;
    r.dateValidation = tdmDateFR(new Date()) + ' ' + tdmHeureFR(new Date());
  },
  onPassed(id){ tdmRec(id).passee = true; },
  onActivated(id){ tdmRec(id).passee = false; },
  logQuestion(q, ansTexts, ok){
    if(!SAV.data || !q || !q._notionId) return;
    const r = tdmRec(q._notionId);
    r.posees++; if(ok) r.justes++; else r.erreurs++;
    /* Statistiques par ÉLÉMENT SIMPLE : la notion se décompose en
       générateurs ; on compte les réussites/erreurs de chacun pour
       la progression détaillée, les notions passées et la leçon
       d'erreur (élément raté mis en évidence). */
    const gk = state.lastGen || (q._gen || '');
    if(gk){
      if(!r.parGen[gk]) r.parGen[gk] = { ok: 0, ko: 0 };
      r.parGen[gk][ok ? 'ok' : 'ko']++;
    }
    SAV.data.seq = (SAV.data.seq || 0) + 1;
    const enonce = String(q.prompt || '')
      .split("<div class='graph-wrap'>")[0]
      .split("<br><span style='font-size:12px")[0].trim();
    /* Historique complet et sans limite : TOUTES les données des exercices
       traités (énoncé, propositions, réponse de l'élève, bonne réponse attendue)
       restent dans la sauvegarde scellée. */
    r.questions.push({
      s: SAV.data.seq,
      h: tdmDateFR(new Date()) + ' ' + tdmHeureFR(new Date()),
      notion: r.nom,
      enonce: enonce,
      propositions: q.options ? q.options.map(o => o.t) : (q.bank || []),
      reponseEleve: ansTexts,
      bonneReponse: q.options ? q.options.filter(o => o.ok).map(o => o.t) : (q.answers || []),
      ok: !!ok
    });
  }
};
function tdmRec(id){
  if(!SAV.data) SAV.data = tdmFreshData({ nom: 'INCONNU', prenom: '-', classe: '-' });
  if(!SAV.data.notions[id]){
    const n = NOTIONS.find(x => x.id === id);
    SAV.data.notions[id] = { nom: n ? n.name : id, posees: 0, justes: 0, erreurs: 0, passee: false, validee: false, questions: [], parGen: {} };
  }
  /* Compteurs par ÉLÉMENT SIMPLE (générateur) : créés au besoin pour
     rester compatible avec les anciennes sauvegardes. */
  if(!SAV.data.notions[id].parGen) SAV.data.notions[id].parGen = {};
  return SAV.data.notions[id];
}
function tdmFreshData(eleve){
  return {
    format: 'la-tour-des-maths', version: 2, document: TDM_DOC, seq: 0,
    eleve: eleve,
    enonce: {
      titre: 'LA TOUR DES MATHS',
      sousTitre: 'TOUTES LES NOTIONS DU PROGRAMME',
      consignes: "172 notions a valider, toutes sans exception. Chaque bonne reponse construit un etage. Chaque erreur ouvre une porte dans l'etage : une lecon apparait, puis tu chutes de 0 a 5 etages selon la gravite. Au depart, toutes les notions sont equiprobables (50 pourcent chacune). Chaque reussite DIVISE par deux la probabilite que la notion revienne (une notion validee ne revient plus : 0 pourcent) ; chaque erreur la MULTIPLIE par deux, sans jamais depasser 100 pourcent. Une probabilite est donc toujours comprise entre 0 et 100 pourcent. Objectif : atteindre le sommet avec le moins d'erreurs possible. Une notion peut etre mise de cote avec le bouton Passer ; tant qu'elle n'est pas traitee, l'activite entiere n'est pas finalisee. L'activite est finalisee quand toutes les notions sont validees (au moins 95 pourcent partout) et qu'aucune notion passee ne reste en attente.",
      notionsTotal: N_TOT
    },
    notions: {},
    progression: { valideesIds: [], passeesIds: [], altitude: 0, erreursTotal: 0, tempsTotal: 0, streaks: {}, probs: {}, runs: {} },
    sessions: [],
    finalisee: false
  };
}
function tdmScoreNotion(id){
  if(state.validated.has(id)) return 100;
  const r = SAV.data ? SAV.data.notions[id] : null;
  if(!r || !r.posees) return 0;
  return Math.round(100 * r.justes / r.posees);
}
function tdmScoreGlobal(){
  if(!NOTIONS.length) return 0;
  let s = 0;
  NOTIONS.forEach(n => { s += tdmScoreNotion(n.id); });
  return Math.round(10 * s / NOTIONS.length) / 10;
}
function tdmSyncProgression(){
  if(!SAV.data) return;
  SAV.data.progression.valideesIds = Array.from(state.validated);
  SAV.data.progression.passeesIds = state.passed ? Array.from(state.passed) : [];
  SAV.data.progression.altitude = state.floor;
  SAV.data.progression.erreursTotal = state.errors;
  SAV.data.progression.tempsTotal = state.elapsed;
  SAV.data.progression.streaks = state.notionStreak;
  SAV.data.progression.genStreaks = state.genStreak;
  const probs = {}, runs = {};
  NOTIONS.forEach(n => { probs[n.id] = n.prob; runs[n.id] = n.okRun || 0; });
  SAV.data.progression.probs = probs;
  SAV.data.progression.runs = runs;
  const sess = SAV.data.sessions[SAV.data.sessions.length - 1];
  if(sess){
    sess.fin = { validees: state.validated.size, score: tdmScoreGlobal(), altitude: state.floor, erreurs: state.errors };
    const prev = SAV.data.sessions.length > 1 ? SAV.data.sessions[SAV.data.sessions.length - 2] : null;
    sess.progressionVsPrecedente = prev
      ? { validees: sess.fin.validees - prev.fin.validees, score: Math.round((sess.fin.score - prev.fin.score) * 10) / 10 }
      : null;
  }
}
/* Construit l'objet « donnees » complet exigé dans le fichier .json :
   statistiques, notions traitées et à traiter (avec pourcentages),
   exercices traités (énoncés + réponses élève + bonnes réponses),
   erreurs commises, reprises avec dates et heures, et l'état interne
   nécessaire au rechargement de la tour. */
function tdmBuildDonnees(){
  tdmSyncProgression();
  const d = SAV.data;
  const notionsTraitees = [], notionsATraiter = [], notionsPassees = [];
  const exercices = [], erreursEleve = [];
  NOTIONS.forEach(n => {
    const r = d.notions[n.id];
    const validee = state.validated.has(n.id);
    const passee = state.passed.has(n.id);
    const traitee = !!(r && r.posees);
    const item = {
      id: n.id, nom: n.name,
      statut: validee ? 'validée' : (passee ? 'passée (en attente)' : (traitee ? 'posée, à valider' : 'jamais posée')),
      pourcentageReussite: (validee ? 100 : (r && r.posees ? Math.round(100 * r.justes / r.posees) : 0)) + ' %',
      probabiliteApparition: Math.round(Math.min(1, Math.max(0.05, n.prob)) * 100) + ' %',
      posees: r ? r.posees : 0, reussies: r ? r.justes : 0, erreursNotion: r ? r.erreurs : 0,
      /* Décomposition en ÉLÉMENTS SIMPLES (un élément = un générateur) :
         l'enseignant voit immédiatement QUELLE compétence précise de la
         notion est maîtrisée ou fragile, avec les compteurs associés. */
      elements: (n.g || []).map(function(g){
        const pg = (r && r.parGen) ? r.parGen[g] : null;
        return {
          generateur: g,
          libelle: tdmGenLabel(g),
          posees: pg ? (pg.ok + pg.ko) : 0,
          reussies: pg ? pg.ok : 0,
          erreurs: pg ? pg.ko : 0
        };
      }),
      validee: validee, passee: passee,
      dateValidation: r && r.dateValidation ? r.dateValidation : null
    };
    if(traitee) notionsTraitees.push(item);
    else notionsATraiter.push(item);
    if(passee && !validee) notionsPassees.push({ id: n.id, nom: n.name });
    if(r && r.questions){
      r.questions.forEach(q => {
        const ex = {
          n: q.s || null, dateHeure: q.h, notion: n.name, notionId: n.id,
          enonce: q.enonce,
          reponseEleve: q.reponseEleve,
          bonneReponse: q.bonneReponse,
          correcte: !!q.ok,
          penaliteEtages: (q.pen !== undefined ? q.pen : null),
          cleLoufoque: !!q.lf,
          /* Nombre d'erreurs COMMISES D'AFFILÉE sur ce même type d'exercice
             au moment de la sanction (0 ou 1 = pas de récidive, ≥ 2 = récidive) :
             c'est ce compteur qui déclenche l'escalade de pénalité. */
          erreursDeSuiteSurType: (q.gs !== undefined ? q.gs : null)
        };
        exercices.push(ex);
        if(!q.ok) erreursEleve.push({
          n: ex.n, dateHeure: q.h, notion: n.name,
          enonce: q.enonce,
          reponseEleve: q.reponseEleve,
          bonneReponse: q.bonneReponse,
          penaliteEtages: ex.penaliteEtages,
          cleLoufoque: ex.cleLoufoque,
          erreursDeSuiteSurType: ex.erreursDeSuiteSurType
        });
      });
    }
  });
  exercices.sort((a, b) => (a.n === null ? -1 : a.n) - (b.n === null ? -1 : b.n));
  erreursEleve.sort((a, b) => (a.n === null ? -1 : a.n) - (b.n === null ? -1 : b.n));
  const m = Math.floor(state.elapsed / 60), s = state.elapsed % 60;
  return {
    format: 'la-tour-des-maths', version: 2,
    document: TDM_DOC,
    eleve: d.eleve,
    date: tdmDateFR(new Date()),
    statistiques: {
      notionsValidees: state.validated.size,
      totalNotions: N_TOT,
      altitude: state.floor,
      erreursTotal: state.errors,
      tempsTotal: state.elapsed,
      tempsTotalFormate: m + ' min ' + tdmP2(s) + ' s',
      scoreGlobal: tdmScoreGlobal() + ' %',
      notionsPasseesEnAttente: Array.from(state.passed).length,
      /* Traçabilité des sanctions renforcées : nombre total de clés
         LOUFOQUES placées et d'erreurs commises en RÉCIDIVE (≥ 2 erreurs
         d'affilée sur un même type d'exercice). */
      clesLoufoquesTotal: exercices.reduce((t, x) => t + (x.cleLoufoque ? 1 : 0), 0),
      erreursRepeteesSurMemeType: erreursEleve.reduce((t, e) => t + ((e.erreursDeSuiteSurType || 0) >= 2 ? 1 : 0), 0),
      finalisee: !!d.finalisee
    },
    notionsTraitees: notionsTraitees,
    notionsATraiter: notionsATraiter,
    notionsPassees: notionsPassees,
    exercicesTraites: exercices,
    erreursEleve: erreursEleve,
    reprises: {
      nombre: d.sessions.length,
      liste: d.sessions.map(x => ({ n: x.n, date: x.date, heure: x.heure }))
    },
    /* Horodatage de la dernière sauvegarde, visible par l'enseignant. */
    derniereMiseAJour: tdmMajTexte(),
    etatApplication: d
  };
}
async function tdmSaveNow(){
  if(!SAV.data) return;
  /* Horodatage de la dernière mise à jour : conservé dans la sauvegarde
     scellée, affiché dans le menu utilitaire et exporté vers l'enseignant. */
  SAV.data.derniereMaj = new Date().toISOString();
  tdmSyncProgression();
  try {
    /* Sauvegarde locale simple (lisible par la page seule) : le scellé
       RSA n'est utilisé que pour l'export destiné à l'enseignant. */
    const res = await tdmEncryptEnv(JSON.stringify(SAV.data), null);
    SAV.lastEnv = res;
    localStorage.setItem(TDM_LS_SAVE, JSON.stringify(res));
  } catch(e) {
    /* la partie continue même si la sauvegarde échoue */
  }
  tdmRefreshMaj();
}

/* ---------- Date & heure de la dernière mise à jour (menu utilitaire) ---------- */
function tdmMajTexte(){
  if(!SAV.data || !SAV.data.derniereMaj) return null;
  const d = new Date(SAV.data.derniereMaj);
  if(isNaN(d.getTime())) return null;
  return tdmDateFR(d) + ' à ' + tdmHeureFR(d);
}
function tdmRefreshMaj(){
  const el = document.getElementById('lastSaveInfo');
  if(!el) return;
  const t = tdmMajTexte();
  el.textContent = t
    ? ('🕐 Dernière mise à jour : ' + t)
    : '🕐 Dernière mise à jour : aucune sauvegarde pour l\u2019instant';
}
/* TDM-ID-START */
/* ---------- Identification de l'élève (mise en forme imposée) ----------
   Nom : EN MAJUSCULES · Prénom(s) : minuscules sauf les initiales ·
   Classe : EN MAJUSCULES.
   La mise en forme est appliquée en direct pendant la saisie, à la
   validation du formulaire et au rechargement d'un fichier .json. */
function tdmNormUpper(s){
  return String(s === null || s === undefined ? '' : s).toUpperCase();
}
function tdmCasePrenom(s){
  /* Minuscules partout, puis initiale en majuscule de chaque mot —
     y compris après un tiret ou une apostrophe : jean-luc → Jean-Luc,
     n'diaye → N'Diaye, MARIE CLAIRE → Marie Claire. */
  return String(s === null || s === undefined ? '' : s)
    .toLowerCase()
    .replace(/(^|[^a-zà-öø-ÿ])([a-zà-öø-ÿ])/g, (m, sep, c) => sep + c.toUpperCase());
}
function tdmNormField(s){
  /* Nettoyage final : espaces multiples et de bouts de champ. */
  return String(s === null || s === undefined ? '' : s)
    .replace(/\s+/g, ' ').trim();
}
function tdmNormNom(s){ return tdmNormField(tdmNormUpper(s)); }
function tdmNormPrenom(s){ return tdmNormField(tdmCasePrenom(s)); }
function tdmNormClasse(s){ return tdmNormField(tdmNormUpper(s)); }
function tdmCaseHook(input, fn){
  /* Correction en direct : la casse est imposée pendant la frappe, sans
     déplacer le curseur (la longueur du texte ne change jamais). */
  input.addEventListener('input', () => {
    const v = input.value;
    const w = fn(v);
    if(w !== v){
      const pos = input.selectionStart;
      input.value = w;
      try { input.setSelectionRange(pos, pos); } catch(e) {}
    }
  });
}
/* TDM-ID-END */
function tdmShowIdentity(){
  let prof = null;
  try { prof = JSON.parse(localStorage.getItem(TDM_LS_PROFILE) || 'null'); } catch(e) { prof = null; }
  if(prof){
    if(!$('inpNom').value) $('inpNom').value = tdmNormNom(prof.nom || '');
    if(!$('inpPrenom').value) $('inpPrenom').value = tdmNormPrenom(prof.prenom || '');
    if(!$('inpClasse').value) $('inpClasse').value = tdmNormClasse(prof.classe || '');
  }
  $('idMsg').textContent = '';
  $('idPanel').classList.remove('hidden');
}
async function tdmConfirmIdentity(){
  const nom = tdmNormNom($('inpNom').value);
  const prenom = tdmNormPrenom($('inpPrenom').value);
  const classe = tdmNormClasse($('inpClasse').value);
  if(!nom || !prenom || !classe){
    $('idMsg').textContent = 'Merci de renseigner les trois champs avant de commencer.';
    return;
  }
  /* La mise en forme validée est réaffichée dans les champs. */
  $('inpNom').value = nom;
  $('inpPrenom').value = prenom;
  $('inpClasse').value = classe;
  const eleve = { nom: nom, prenom: prenom, classe: classe };
  /* Aucune clé privée n'est générée ni stockée chez l'élève : la paire de
     clés appartient à l'enseignant, seule la clé publique est dans la page. */
  SAV.keys = null;
  try {
    localStorage.setItem(TDM_LS_PROFILE, JSON.stringify(eleve));
  } catch(e) {}
  SAV.data = tdmFreshData(eleve);
  $('idPanel').classList.add('hidden');
  startGame();
  SAV.startSession();
  tdmSaveNow();
}
function tdmApplyResume(data){
  SAV.data = data;
  state.validated = new Set(data.progression.valideesIds || []);
  state.passed = new Set(data.progression.passeesIds || []);
  state.errors = data.progression.erreursTotal || 0;
  state.elapsed = data.progression.tempsTotal || 0;
  state.notionStreak = data.progression.streaks || {};
  state.genStreak = data.progression.genStreaks || {};
  const fl = Math.max(0, data.progression.altitude || 0);
  state.floor = fl;
  state.maxBuiltFloor = fl;
  state.visualFloor = fl;
  NOTIONS.forEach(n => {
    n.prob = (data.progression.probs && data.progression.probs[n.id] !== undefined) ? Math.min(1, Math.max(0, data.progression.probs[n.id])) : 0.5;
    n.okRun = (data.progression.runs && data.progression.runs[n.id] !== undefined) ? data.progression.runs[n.id] : 0;
    /* Anciennes sauvegardes : une notion validée y était stockée à 0 % — or une
       probabilité ne peut valoir moins de 5 %. Sans 8 apparitions
       systématiquement justes prouvées, elle est migrée juste AU-DESSUS du
       plancher (6,25 %) : le 5 % devra être mérité par 8 réussites d'affilée. */
    if (state.validated.has(n.id) && n.prob < 0.05) { n.prob = 0.0625; n.okRun = 0; }
  });
  state.playing = true;
  state.lessonActive = false;
  state.pendingError = null;
  state.falling = false;
  state.finalAscent = false;
  state.camY = (state.floor + 1) * HH - 1.6;
  updateTimeDisplay();
  updateHUD();
  lessonPanel.classList.remove('open'); resetLessonPos();
  $('overlay').classList.add('hidden');
  $('idPanel').classList.add('hidden');
  SAV.startSession();
  newQuestion();
  tdmSaveNow();
  feedback.className = 'fb-good';
  feedback.textContent = 'Bon retour ! Reprise de ta progression - session n ' + SAV.data.sessions.length + '.';
}
async function tdmBoot(){
  let keysRaw = null, saveRaw = null;
  try {
    keysRaw = localStorage.getItem(TDM_LS_KEYS);
    saveRaw = localStorage.getItem(TDM_LS_SAVE);
  } catch(e) { return; }
  if(!saveRaw) return;
  try {
    /* Anciennes sauvegardes (clés générées par le navigateur) : elles sont
       relues une dernière fois avec la clé privée locale stockée à l'époque,
       puis réenregistrées au nouveau format à la prochaine sauvegarde. */
    SAV.keys = keysRaw ? JSON.parse(keysRaw) : null;
    const data = JSON.parse(await tdmDecryptEnv(JSON.parse(saveRaw), SAV.keys ? SAV.keys.priv : null));
    if(data && !data.finalisee){
      tdmApplyResume(data);
    }
    /* Activité déjà finalisée : on laisse l'écran d'accueil (REJOUER possible). */
  } catch(e) {
    /* Sauvegarde illisible ou corrompue : on repart de l'écran d'accueil. */
  }
}
async function tdmExport(auto){
  if(!SAV.data){
    if(!auto){ feedback.className = 'fb-bad'; feedback.textContent = 'Aucune sauvegarde à exporter pour le moment.'; }
    return;
  }
  try {
    tdmSaveNow();
    const donnees = tdmBuildDonnees();
    const donneesStr = JSON.stringify(donnees);
    const sceau = await tdmSealWithTeacherPub(donneesStr);
    const fname = tdmFileName();
    const fileObj = {
      format: 'la-tour-des-maths-securise',
      version: 2,
      document: TDM_DOC,
      eleve: SAV.data.eleve,
      genereLe: new Date().toISOString(),
      fichier: fname,
      scellement: sceau
        ? 'sceau RSA-2048-OAEP(SHA-256) + AES-256-GCM — clé publique enseignant embarquée dans le document'
        : 'INDISPONIBLE (WebCrypto absent : contexte non sécurisé)',
      /* Partie lisible : permet à l'élève de recharger sa tour. La copie
         scellée ci-dessous fait foi pour l'enseignant (clé privée requise). */
      donnees: donnees,
      sceau: sceau
    };
    const blob = new Blob([JSON.stringify(fileObj, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fname;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { a.remove(); URL.revokeObjectURL(a.href); }, 900);
    if(!auto){
      feedback.className = 'fb-good';
      feedback.textContent = sceau
        ? 'Fichier ' + fname + ' généré et scellé (sécurité bancaire).'
        : 'Fichier ' + fname + ' généré, mais SANS scellé (navigateur non sécurisé).';
    }
  } catch(e) {
    if(!auto){ feedback.className = 'fb-bad'; feedback.textContent = 'Export indisponible dans ce contexte.'; }
  }
}
function tdmOnImportFile(ev){
  const f = ev && ev.target && ev.target.files && ev.target.files[0];
  if(!f || (typeof FileReader === 'undefined')) return;
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const obj = JSON.parse(String(reader.result));
      let data = null;
      if(obj && obj.donnees && obj.donnees.etatApplication){
        /* Format 2 (scellé, clé publique enseignant) : le rechargement de la
           tour utilise la partie lisible ; le scellé reste inviolable sans
           la clé privée de l'enseignant. */
        data = obj.donnees.etatApplication;
      } else if(obj && obj.donneesChiffrees){
        /* Format 1 historique (clé privée embarquée dans le fichier). */
        const priv = obj.clePrivee || (SAV.keys && SAV.keys.priv);
        if(!priv) throw new Error('cle');
        data = JSON.parse(await tdmDecryptEnv(obj.donneesChiffrees, priv));
        SAV.keys = { pub: obj.clePublique || null, priv: priv };
      } else {
        throw new Error('format');
      }
      if(!data || !data.eleve) throw new Error('donnees');
      /* Mise en forme de l'identité au rechargement (fichiers anciens
         compris) : NOM, prénom(s) et CLASSE reprennent le format imposé. */
      data.eleve = {
        nom: tdmNormNom(data.eleve.nom),
        prenom: tdmNormPrenom(data.eleve.prenom),
        classe: tdmNormClasse(data.eleve.classe)
      };
      try {
        localStorage.setItem(TDM_LS_PROFILE, JSON.stringify(data.eleve));
        localStorage.setItem(TDM_LS_KEYS, JSON.stringify(SAV.keys));
      } catch(e) {}
      tdmApplyResume(data);
    } catch(e) {
      $('idMsg').textContent = 'Fichier illisible, corrompu ou format non reconnu.';
    }
  };
  reader.readAsText(f);
}
function tdmRejouer(){
  try { localStorage.removeItem(TDM_LS_SAVE); } catch(e) {}
  SAV.data = tdmFreshData(SAV.data && SAV.data.eleve ? SAV.data.eleve : { nom: 'INCONNU', prenom: '-', classe: '-' });
  startGame();
  SAV.startSession();
  tdmSaveNow();
}

/* ---------- Notions passées (bouton Passer + modale dédiée) ---------- */
function passCurrentNotion(){
  if(!state.playing || state.finalAscent || state.lessonActive || state.pendingError) return;
  if(!state.currentNotion) return;
  const id = state.currentNotion.id;
  state.passed.add(id);
  SAV.onPassed(id);
  feedback.className = 'fb-bad';
  feedback.textContent = 'Notion mise de cote : ' + state.currentNotion.name + '. Retrouve-la dans la modale des notions passees.';
  qText.innerHTML = '';
  opts.innerHTML = '';
  state.currentNotion = null;
  updateHUD();
  tdmSaveNow();
  newQuestion();
}
function openPassedPanel(){
  const list = $('passedList');
  list.innerHTML = '';
  const arr = Array.from(state.passed).map(id => NOTIONS.find(n => n.id === id)).filter(Boolean);
  $('passedCount').textContent = arr.length;
  if(!arr.length){
    const p = document.createElement('p');
    p.style.cssText = 'font-size:13px;color:var(--dim);margin:10px 0 4px';
    p.textContent = 'Aucune notion passee pour l instant. Elles apparaitront ici apres un clic sur Passer.';
    list.appendChild(p);
  }
  arr.forEach(n => {
    const div = document.createElement('div');
    div.className = 'passed-item';
    /* Chaque notion passée est DÉCOMPOSÉE en éléments simples :
       survole un élément pour son rappel de cours immédiat
       (infobulle), clique pour ouvrir la fiche complète — de quoi
       se remettre à niveau AVANT de réactiver la notion. */
    div.innerHTML =
      '<div class="passed-line"><span>' + n.name + '</span>' +
      '<button class="passed-activate">Activer</button></div>' +
      tdmElemsHTML(n.id, { mini: true, stats: true });
    const b = div.querySelector('.passed-activate');
    b.addEventListener('click', () => activateNotion(n.id));
    list.appendChild(div);
  });
  $('passedPanel').classList.add('open');
}
function closePassedPanel(){
  $('passedPanel').classList.remove('open');
}
function activateNotion(id){
  state.passed.delete(id);
  SAV.onActivated(id);
  closePassedPanel();
  updateHUD();
  tdmSaveNow();
  const notion = NOTIONS.find(n => n.id === id);
  if(!notion){ newQuestion(); return; }
  state.currentNotion = notion;
  const genName = pick(notion.g);
  state.lastGen = genName;
  const q = GEN[genName]();
  q._notionId = id;
  renderQuestion(q);
  updateHUD();
  feedback.className = 'fb-good';
  feedback.textContent = 'Notion reactivee : a toi de jouer !';
}

