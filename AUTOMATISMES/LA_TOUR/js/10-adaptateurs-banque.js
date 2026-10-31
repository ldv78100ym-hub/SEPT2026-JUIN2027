// Helper wrappers for the attached file
function mkMC(prompt, correct, wrongs, hint, ex, extra) {
  const uniq = [];
  wrongs.forEach(function (w) { if (w !== correct && uniq.indexOf(w) < 0) uniq.push(w); });
  return { kind: 'mcq', prompt, choices: [correct].concat(uniq), correct: 0, hint, ex, ...extra };
}
function mkMulti(prompt, corrects, wrongs, hint, ex, extra) {
  // Question à réponses multiples : la bonne réponse est l'UNION des propositions cochées.
  const uniq = [];
  wrongs.forEach(function (w) { if (corrects.indexOf(w) < 0 && uniq.indexOf(w) < 0) uniq.push(w); });
  return { kind: 'mcq', prompt, choices: corrects.concat(uniq), corrects: corrects.map(function (_, i) { return i; }), multi: true, hint, ex, ...extra };
}
function mkN(prompt, ans, tol, hint, ex, extra) {
  return { kind: 'num', prompt, ans, tol, hint, ex, ...extra };
}
function mkSign(prompt, xs, label, target, hint, ex) {
  return { kind: 'sign', prompt, sign: { xs, label, target }, hint, ex };
}
function mkVar(prompt, xs, fvals, target, hint, ex, signShow) {
  return { kind: 'var', prompt, vart: { xs, fvals, target }, hint, ex, signShow };
}

// Add all attached generators to GEN
Object.keys(G).forEach(key => {
  GEN[key] = () => adaptQ(G[key].make(2));
});

