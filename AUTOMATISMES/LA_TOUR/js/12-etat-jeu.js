/* ============================================================
   4. ÉTAT & LOGIQUE DU JEU
   ============================================================ */
const N_TOT = NOTIONS.length;

const state = {
  floor: 0,
  maxBuiltFloor: 0,
  visualFloor: 0,
  errors: 0,
  elapsed: 0,
  playing: false,
  validated: new Set(),
  passed: new Set(),
  currentNotion: null,
  lastGen: null,
  camY: 0,
  angle: 0.85,
  autoRotate: true,
  lessonActive: false,
  doorFloor: -1,
  doorProgress: 0,
  pendingError: null,
  falling: false,
  finalAscent: false,
  particles: [],
  notionStreak: {},
  genStreak: {},
  /* Révision personnalisée (menu 🎯) : null = jeu normal ;
     sinon Set des ids de notions sélectionnées pour LA SESSION en cours.
     Le tirage des questions (pickNotion) se limite alors à cette sélection. */
  customPool: null
};

const $ = id => document.getElementById(id);
const vNotions = $('vNotions'), vFloor = $('vFloor'), vErr = $('vErr'), vTime = $('vTime'), vPassed = $('vPassed');
const barFill = $('barFill'), themeLbl = $('theme');
const qText = $('qText'), opts = $('opts'), feedback = $('feedback');

