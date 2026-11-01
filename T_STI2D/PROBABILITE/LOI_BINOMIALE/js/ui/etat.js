/* ============================================================
   9. ÉTAT / UI
   ============================================================ */
const state = { current: 1, maxUnlocked: 1, completed: new Set(), built: new Set(), allAnswers: {}, stepStartTime: {}, partialSelections: {} };
const storyEl = document.getElementById('story');
const menuEl = document.getElementById('stepMenu');
const progLabel = document.getElementById('progLabel');
const progBar = document.getElementById('progBar');
function propId(stepN, i){ return 'p' + stepN + '_' + i; }

