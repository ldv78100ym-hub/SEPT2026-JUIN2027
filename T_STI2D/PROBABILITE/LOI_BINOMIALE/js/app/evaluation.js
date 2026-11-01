/* ============================================================
   5. DIFFICULTÉ ET NOUVEAUX PARAMÈTRES D'ÉVALUATION
   ============================================================ */
const DIFFICULTY = {1:1, 2:2, 3:2, 4:3, 5:2, 6:2, 7:3, 8:2, 9:2, 10:2, 11:2, 12:3, 13:3, 14:3, 15:3, 16:3, 17:3};

/* Intervalles de confiance à 95 % du temps moyen par question (en s),
   par niveau de difficulté. min = borne basse (trop rapide),
   max = borne haute (trop lent), mean = moyenne attendue. */
const TIME_CI = {
  1: { min:  7, max:  38, mean: 18 },
  2: { min: 12, max:  62, mean: 30 },
  3: { min: 20, max: 100, mean: 48 }
};

/* Plafonds de pénalité (fractions du score) */
const MAX_PENALTY_FAST   = 0.50;  // côté gauche (trop rapide) — lourd
const MAX_PENALTY_SLOW   = 0.15;  // côté droit  (trop lent)   — léger
const MAX_PENALTY_COH    = 0.30;  // incohérences croisées
const MAX_PENALTY_RANDOM = 0.35;  // pattern compatible avec le hasard
const MAX_TOTAL_PENALTY  = 0.85;  // plafond global

function pickPropositions(gens, sc){
  const all = gens.map(function(g){ return g(sc); });
  const trues = shuffleArr(all.filter(function(p){ return p.correct; }));
  const falses = shuffleArr(all.filter(function(p){ return !p.correct; }));
  const k = randInt(10, Math.min(20, all.length));
  let nTrue = Math.floor(k / 2);
  let nFalse = k - nTrue;
  nTrue = Math.min(nTrue, trues.length);
  nFalse = Math.min(nFalse, falses.length);
  while(nTrue + nFalse < k && nTrue < trues.length){ nTrue++; }
  while(nTrue + nFalse < k && nFalse < falses.length){ nFalse++; }
  return shuffleArr(trues.slice(0, nTrue).concat(falses.slice(0, nFalse)));
}

let SC = null;
let STEPS = [];

function buildSTEPS(fromSnapshot){
  STEPS = [];
  for(let n = 1; n <= 17; n++){
    const meta = STEP_META[n];
    const gens = STEP_GEN[n];
    let propositions;
    if(fromSnapshot){
      const ss = fromSnapshot.steps.find(function(s){ return s.n === n; });
      propositions = (ss && ss.propositions) ? ss.propositions : pickPropositions(gens, SC);
    } else {
      propositions = pickPropositions(gens, SC);
    }
    STEPS.push({ n: n, notion: meta.notion, intro: meta.intro(SC), synthese: meta.synthese, propositions: propositions });
  }
}

function tokenizeText(t){ return (t || '').toLowerCase().replace(/<[^>]+>/g, ' ').replace(/[^\wàâäéèêëïîôöùûüÿçœæ\s]/g, ' ').split(/\s+/).filter(function(w){ return w.length >= 3; }); }
function findSimilarPairs(rows){ const pairs = []; const sets = rows.map(function(r){ return new Set(tokenizeText(r.texte)); }); for(let i = 0; i < rows.length; i++){ for(let j = i + 1; j < rows.length; j++){ const ti = sets[i], tj = sets[j]; let inter = 0; ti.forEach(function(x){ if(tj.has(x)) inter++; }); const union = ti.size + tj.size - inter; if(union > 0 && inter / union >= 0.35){ pairs.push({i: i, j: j, jaccard: inter / union}); } } } return pairs; }

/* ============================================================
   NOUVELLE analyzeStep — Combine temps (IC 95 %), incohérences
   croisées et test de pattern (Wald–Wolfowitz) pour estimer la
   part de hasard.
   ============================================================ */
function analyzeStep(n){
  const ans = state.allAnswers[n];
  if(!ans) return null;
  const diff = DIFFICULTY[n] || 2;
  const nQ   = ans.rows.length;
  const perQ = ans.timeMs / nQ / 1000;
  const ci   = TIME_CI[diff] || TIME_CI[2];

  /* -------- (1) Pénalité de temps ASYMÉTRIQUE -------- */
  let timePenalty = 0, timeZone = 'ok', timeGap = 0;
  if(perQ < ci.min){
    const r = (ci.min - perQ) / ci.min;
    timePenalty = MAX_PENALTY_FAST * (1 - Math.exp(-3 * r));
    timeZone = 'fast'; timeGap = r;
  } else if(perQ > ci.max){
    const r = (perQ - ci.max) / ci.max;
    timePenalty = MAX_PENALTY_SLOW * (1 - Math.exp(-2 * r));
    timeZone = 'slow'; timeGap = r;
  }

  /* -------- (2) Analyse de séquence (runs test de Wald–Wolfowitz) -------- */
  const arr = ans.rows.map(r => r.given === 'vrai' ? 1 : 0);
  const n1  = arr.filter(a => a === 1).length;
  const n0  = nQ - n1;
  let runs = 1, maxRun = 1, cur = 1;
  for(let i = 1; i < arr.length; i++){
    if(arr[i] === arr[i-1]){ cur++; if(cur > maxRun) maxRun = cur; }
    else { runs++; cur = 1; }
  }
  const altRatio = nQ > 1 ? (runs - 1) / (nQ - 1) : 0;
  const balance  = Math.abs(n1 - n0) / nQ;
  let expectedRuns = 1, sdRuns = 0, zRuns = 0;
  if(n1 > 0 && n0 > 0){
    expectedRuns = (2 * n1 * n0) / nQ + 1;
    const varRuns = (2 * n1 * n0 * (2 * n1 * n0 - nQ)) / (nQ * nQ * (nQ - 1));
    sdRuns = Math.sqrt(Math.max(0, varRuns));
    zRuns  = sdRuns > 0 ? (runs - expectedRuns) / sdRuns : 0;
  } else { zRuns = 8; }

  /* -------- (3) Estimation du caractère aléatoire du pattern -------- */
  const scoreFromRandom = Math.abs(ans.score / nQ - 0.5); // écart du score à 50 %
  const runsDev         = Math.abs(zRuns);
  const altExcess       = Math.max(0, altRatio - 0.60);
  const longRunExcess   = Math.max(0, maxRun / nQ - 0.35);

  let logRandom = 0;
  logRandom -= Math.max(0, scoreFromRandom - 0.15) * 6.0;
  logRandom -= Math.max(0, runsDev - 1.0)         * 1.2;
  logRandom -= altExcess                          * 5.0;
  logRandom -= longRunExcess                      * 4.0;
  const pRandom = Math.exp(Math.max(-10, logRandom));  // ∈ [0,1]

  let randomLabel, randomColor;
  if(pRandom >= 0.80)      { randomLabel='hasard très probable'; randomColor='var(--red)'; }
  else if(pRandom >= 0.50) { randomLabel='hasard plausible';      randomColor='#c97f1a'; }
  else if(pRandom >= 0.20) { randomLabel='structure probable';    randomColor='#6b8e23'; }
  else                     { randomLabel='réflexion structurée';  randomColor='var(--green)'; }

  const randomPenalty = MAX_PENALTY_RANDOM * pRandom;

  /* -------- (4) Pénalité d'incohérence croisée -------- */
  const pairs = findSimilarPairs(ans.rows);
  let incoherences = 0;
  pairs.forEach(p => {
    const a = ans.rows[p.i], b = ans.rows[p.j];
    if(a.correct !== b.correct && a.given === b.given) incoherences++;
    if(a.correct === b.correct && a.given !== b.given) incoherences++;
  });
  const incohRatio = pairs.length > 0 ? incoherences / pairs.length : 0;
  const cohPenalty = MAX_PENALTY_COH * Math.pow(incohRatio, 1.5);

  /* -------- (5) Combinaison -------- */
  const diffMult = 0.5 + 0.25 * diff; // 0.75 / 1.00 / 1.25
  let totalPenalty = (timePenalty + randomPenalty + cohPenalty) * diffMult;
  totalPenalty = Math.min(totalPenalty, MAX_TOTAL_PENALTY);
  const stepPenalty    = totalPenalty * nQ;
  const adjustedScore  = Math.max(0, ans.score - stepPenalty);

  return {
    n, notion: ans.notion, difficulty: diff, nQ,
    ok: ans.score, ko: nQ - ans.score, timeMs: ans.timeMs,
    perQ, tMin: ci.min, tMax: ci.max, tMean: ci.mean,
    timeZone, timePenalty, timeGap,
    runs, expectedRuns, zRuns, maxRun, altRatio,
    n1, n0, balance,
    pRandom, randomLabel, randomColor, randomPenalty,
    nPairs: pairs.length, incoherences, incohRatio, cohPenalty,
    totalPenalty, stepPenalty, adjustedScore, diffMult
  };
}
function analyzeAll(){ const analyses = []; for(let n = 1; n <= 17; n++){ if(state.allAnswers[n]) analyses.push(analyzeStep(n)); } return analyses; }

