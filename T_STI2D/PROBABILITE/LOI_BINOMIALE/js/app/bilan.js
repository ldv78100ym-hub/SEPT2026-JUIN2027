/* ============================================================
   8. BILAN ENRICHI (version ajustée)
   ============================================================ */
function levelLabel(ratio){ if(ratio >= 0.85) return 'excellent'; if(ratio >= 0.7) return 'très bon'; if(ratio >= 0.55) return 'correct'; if(ratio >= 0.4) return 'fragile'; if(ratio >= 0.2) return 'faible'; return 'très faible'; }

function buildStepRow(a){
  const ratio = a.ok / a.nQ;
  const cls = a.ok === a.nQ ? 'ok' : (ratio >= 0.5 ? '' : 'ko');
  const timeIcon  = a.timeZone === 'fast' ? '⏩' : (a.timeZone === 'slow' ? '🐢' : '⏱');
  const randIcon  = a.pRandom >= 0.80 ? '🎲'
                  : a.pRandom >= 0.50 ? '❓'
                  : a.pRandom >= 0.20 ? '🎯' : '🧠';
  const adjCls = a.adjustedScore / a.nQ >= 0.5 ? 'color:var(--green);' : 'color:var(--red);';
  return `<tr class="${cls}">
    <td class="num">${a.n}</td>
    <td>${a.notion}</td>
    <td class="score-cell">${a.ok} / ${a.nQ}</td>
    <td style="text-align:center;font-size:.8rem;">${fr(a.perQ,1)}s
      <br><span style="color:var(--muted);font-size:.72rem;">[${a.tMin}–${a.tMax}s]</span></td>
    <td style="text-align:center;">${timeIcon} −${fr(a.timePenalty*100,0)}%</td>
    <td style="text-align:center;" title="${a.randomLabel}">${randIcon} ${fr(a.pRandom*100,0)}%</td>
    <td style="text-align:center;">${a.incoherences}/${a.nPairs}</td>
    <td style="text-align:center;font-weight:700;${adjCls}">${fr(a.adjustedScore,1)} / ${a.nQ}</td>
  </tr>`;
}

function getBilan(){
  const analyses = analyzeAll();
  if(analyses.length === 0){
    return `<div class="bilan-volet volet3"><h3><span class="volet-num">3</span> Bilan global</h3><p>Aucune étape validée pour l'instant.</p></div>`;
  }
  const totalQ    = analyses.reduce((s,a)=>s+a.nQ,0);
  const totalOk   = analyses.reduce((s,a)=>s+a.ok,0);
  const totalKo   = totalQ - totalOk;
  const totalTime = analyses.reduce((s,a)=>s+a.timeMs,0);
  const adjTotal  = analyses.reduce((s,a)=>s+a.adjustedScore,0);
  const rawRatio  = totalQ ? totalOk/totalQ : 0;
  const adjRatio  = totalQ ? adjTotal/totalQ : 0;
  const gapTotal  = totalOk - adjTotal;
  const avgSpeed  = analyses.reduce((s,a)=>s+a.perQ,0)/analyses.length;

  const fastSteps  = analyses.filter(a=>a.timeZone==='fast');
  const slowSteps  = analyses.filter(a=>a.timeZone==='slow');
  const randSteps  = analyses.filter(a=>a.pRandom>=0.80);
  const randPlaus  = analyses.filter(a=>a.pRandom>=0.50 && a.pRandom<0.80);
  const structSteps= analyses.filter(a=>a.pRandom<0.20);
  const incohSteps = analyses.filter(a=>a.incoherences>0);
  const totalPairs = analyses.reduce((s,a)=>s+a.nPairs,0);
  const totalIncoh= analyses.reduce((s,a)=>s+a.incoherences,0);
  const strongAdj  = analyses.filter(a=>a.adjustedScore/a.nQ>=0.7);
  const weakAdj    = analyses.filter(a=>a.adjustedScore/a.nQ<0.4);
  const strongSteps= analyses.filter(a=>a.ok/a.nQ>=0.8);
  const coherentSteps = analyses.filter(a=>a.nPairs>0 && a.incoherences===0);

  const tableHeader = `<thead><tr>
    <th>N°</th><th>Notion</th><th>Brut</th><th>Temps/q</th>
    <th>⏱ Pénalité</th><th>🎲 Hasard</th><th>🔗 Incoh.</th><th>Ajusté</th>
  </tr></thead>`;

  /* ============ VOLET 1 ============ */
  let v1 = '<div class="bilan-volet volet1">';
  v1 += `<h3><span class="volet-num">1</span> Volet 1 — Lecture des bonnes réponses</h3>`;
  v1 += `<p>Cette première lecture porte sur les <strong>${totalOk}</strong> jugements corrects, sur un total de ${totalQ} : `
       + `un taux brut de <strong>${fr(rawRatio*100,1)} %</strong>, résultat ${levelLabel(rawRatio)} à l'échelle du parcours. `
       + `Le score ajusté tenant compte du temps, du pattern et des incohérences est de `
       + `<strong>${fr(adjTotal,1)} / ${totalQ}</strong>, soit <strong>${fr(adjRatio*100,1)} %</strong>.</p>`;
  if(strongSteps.length > 0){
    v1 += `<div class="analysis-box"><strong>Étapes solides (≥ 80 % de réussite).</strong> Vous avez particulièrement bien réussi : `
       + strongSteps.map(a=>`l'étape ${a.n} « ${a.notion} » (${a.ok}/${a.nQ}, ${fr(a.ok/a.nQ*100,0)} %)`).join(' ; ')
       + `. Ces étapes témoignent d'une <strong>compréhension solide</strong> des notions concernées. `;
    if(strongSteps.length >= 3){ v1 += `La constance sur plusieurs étapes est un indicateur fort : elle ne relève pas du hasard.`; }
    v1 += `</div>`;
  }

  v1 += `<div class="analysis-box"><strong>⏱ Contrôle du temps.</strong> `;
  if(fastSteps.length > 0){
    v1 += `Les étapes suivantes ont été traitées <em>sous</em> la borne basse de l'intervalle de confiance à 95 % : `
       + fastSteps.map(a=>`n°${a.n} (${fr(a.perQ,1)} s/q vs [${a.tMin}–${a.tMax}] — pénalité ${fr(a.timePenalty*100,0)} %)`).join(' ; ')
       + `. Un temps aussi court ne permet pas une lecture attentive des propositions : la part de hasard y est forte, même quand le score brut est élevé.`;
  } else { v1 += `Aucune étape sous la borne basse : le rythme d'ensemble est compatible avec une lecture réfléchie.`; }
  if(slowSteps.length > 0){
    v1 += ` À l'inverse, ${slowSteps.map(a=>'n°'+a.n).join(', ')} dépassent la borne haute : la pénalité appliquée reste modérée (plafond ${fr(MAX_PENALTY_SLOW*100,0)} %), car un temps long peut refléter une réflexion approfondie.`;
  }
  v1 += `</div>`;

  v1 += `<div class="analysis-box"><strong>🧠 Structure du pattern.</strong> `;
  if(structSteps.length > 0){
    v1 += `${structSteps.length} étape(s) présentent une structure incompatible avec un simple hasard (p < 20 %) : `
       + structSteps.map(a=>`n°${a.n} (${a.randomLabel})`).join(' ; ')
       + `. On peut faire crédit du score brut sur ces étapes.`;
  }
  if(randSteps.length > 0){
    v1 += ` ${randSteps.length} étape(s) au contraire sont statistiquement compatibles avec un tirage au hasard (p ≥ 80 %) : `
       + randSteps.map(a=>`n°${a.n}`).join(', ')
       + ` — le score y est peu informatif.`;
  }
  if(structSteps.length === 0 && randSteps.length === 0){
    v1 += `Vos réponses ne présentent ni structure extrême ni longues séries monotones : `
       + `cette diversité est un signal positif, typique d'une lecture attentive.`;
  }
  v1 += `</div>`;

  if(coherentSteps.length > 0){
    v1 += `<div class="analysis-box"><strong>Cohérence sur les questions croisées.</strong> Les étapes `
       + coherentSteps.map(a=>a.n).join(', ')
       + ` présentent des paires de propositions comparables : vous y avez répondu de façon logiquement cohérente. `
       + `Cette cohérence <em>renforce</em> la validité des bonnes réponses.</div>`;
  }

  if(incohSteps.length > 0){
    v1 += `<div class="analysis-box"><strong>🔗 Incohérences croisées.</strong> ${incohSteps.length} étape(s) `
       + `présentent au moins une incohérence sur des propositions comparables : `
       + incohSteps.map(a=>`n°${a.n} (${a.incoherences}/${a.nPairs})`).join(' ; ')
       + `. Chaque incohérence réduit le crédit accordé au score brut de cette étape.</div>`;
  }
  if(strongAdj.length > 0){
    v1 += `<div class="analysis-box"><strong>Étapes résistant à l'analyse critique.</strong> `
       + strongAdj.map(a=>`n°${a.n} « ${a.notion} »`).join(' ; ')
       + ` — score ajusté ≥ 70 %, temps dans l'intervalle, pattern structuré. Ces résultats sont <strong>fiables</strong>.</div>`;
  }
  v1 += `<h4>Détail par étape</h4>`;
  v1 += `<table class="bilan-table">${tableHeader}<tbody>`;
  analyses.forEach(a => v1 += buildStepRow(a));
  v1 += `</tbody></table>`;
  v1 += `<div class="analysis-box"><strong>Lecture d'ensemble des bonnes réponses.</strong> `;
  if(rawRatio >= 0.8){ v1 += `Le taux de réussite est très élevé et résiste aux contrôles croisés : il traduit une <strong>maîtrise réelle</strong> du contenu.`; }
  else if(rawRatio >= 0.6){ v1 += `Le taux de réussite est solide, avec des réussites bien réparties sur le parcours. Certaines étapes plus difficiles restent perfectibles, mais l'ensemble démontre une <strong>compréhension assurée</strong> des notions essentielles.`; }
  else if(rawRatio >= 0.4){ v1 += `Le taux de réussite est correct mais hétérogène : certaines étapes sont très bien réussies, d'autres moins. Le tableau traduit une <strong>compréhension en construction</strong>, avec des acquis réels.`; }
  else { v1 += `Les bonnes réponses existent mais restent minoritaires. Elles sont d'autant plus précieuses qu'elles prouvent que certaines notions sont comprises, même si l'ensemble reste à consolider.`; }
  v1 += `</div></div>`;

  /* ============ VOLET 2 ============ */
  let v2 = '<div class="bilan-volet volet2">';
  v2 += `<h3><span class="volet-num">2</span> Volet 2 — Lecture des erreurs</h3>`;
  v2 += `<p>Sur ${totalQ} jugements, <strong>${totalKo}</strong> sont erronés (${fr((1-rawRatio)*100,1)} %).</p>`;

  v2 += `<div class="analysis-box"><strong>Répartition par difficulté.</strong> `;
  [1,2,3].forEach(d=>{
    const q = analyses.filter(a=>a.difficulty===d).reduce((s,a)=>s+a.nQ,0);
    const k = analyses.filter(a=>a.difficulty===d).reduce((s,a)=>s+a.ko,0);
    if(q) v2 += `Niveau ${d}/3 : ${k} erreurs / ${q} jugements (${fr(k/q*100,1)} %). `;
  });
  v2 += `</div>`;

  if(fastSteps.length > 0){
    const fastErr = fastSteps.filter(a=>a.ko>0);
    if(fastErr.length) v2 += `<div class="analysis-box"><strong>⏱ Rapidité et erreurs.</strong> `
      + fastErr.map(a=>`n°${a.n} (${a.ko} erreurs en ${fr(a.perQ,1)} s/q)`).join(' ; ')
      + `. La vitesse rend ces erreurs plus probablement liées à une lecture incomplète qu'à une vraie méconnaissance.</div>`;
  }
  if(randSteps.length > 0){
    v2 += `<div class="analysis-box"><strong>🎲 Étapes compatibles avec le hasard (≥ 80 %).</strong> `
      + randSteps.map(a=>`n°${a.n} (${a.ko} erreurs sur ${a.nQ})`).join(' ; ')
      + `. Une erreur dans un tirage aléatoire n'est pas interprétable en termes de connaissances : elle peut être neutralisée.</div>`;
  }
  if(incohSteps.length > 0){
    v2 += `<div class="analysis-box"><strong>🔗 Incohérences et erreurs.</strong> `
      + incohSteps.map(a=>`n°${a.n} (${a.incoherences}/${a.nPairs})`).join(' ; ')
      + `. Une incohérence signale presque toujours qu'une proposition au moins a été lue trop vite.</div>`;
  } else {
    v2 += `<div class="analysis-box"><strong>🔗 Aucune incohérence détectée.</strong> `
      + `Vos réponses sont restées logiquement consistantes — même là où vous vous êtes trompé, `
      + `le raisonnement était structuré.</div>`;
  }
  const worst = [...analyses].sort((a,b)=>(b.ko/b.nQ)-(a.ko/a.nQ)).slice(0,3);
  if(worst.length){
    v2 += `<div class="analysis-box"><strong>Étapes à reprendre en priorité.</strong> `
      + worst.map(a=>`n°${a.n} « ${a.notion} » (${a.ko}/${a.nQ})`).join(' ; ')
      + `. Reprenez les définitions du Volet 1 avant de refaire ces étapes.</div>`;
  }
  v2 += `<h4>Détail par étape</h4><table class="bilan-table">${tableHeader}<tbody>`;
  analyses.forEach(a => v2 += buildStepRow(a));
  v2 += `</tbody></table>`;
  v2 += `<div class="analysis-box"><strong>Lecture d'ensemble des erreurs.</strong> `;
  if(totalKo === 0){ v2 += `Aucune erreur n'a été enregistrée : c'est un résultat remarquable.`; }
  else if(totalKo / totalQ <= 0.2){ v2 += `Les erreurs sont peu nombreuses et dispersées, ce qui est le signe d'une <strong>bonne maîtrise d'ensemble</strong>.`; }
  else if(totalKo / totalQ <= 0.5){ v2 += `Les erreurs sont réparties sur plusieurs étapes. Elles ne sont pas alarmantes : elles indiquent que certaines notions demandent à être retravaillées, mais les bases sont là.`; }
  else { v2 += `Les erreurs sont nombreuses. Il ne faut pas s'en alarmer : cela signifie simplement que l'enquête a été menée dans des conditions où les notions n'étaient pas encore toutes consolidées.`; }
  v2 += `</div></div>`;

  /* ============ VOLET 3 ============ */
  let v3 = '<div class="bilan-volet volet3">';
  v3 += `<h3><span class="volet-num">3</span> Volet 3 — Bilan global ajusté</h3>`;
  v3 += `<div class="analysis-box">`
      + `<span class="stat-line good">✓ ${totalOk} / ${totalQ} brutes</span>`
      + `<span class="stat-line warn">✗ ${totalKo} erreurs</span>`
      + `<span class="stat-line">⏱ ${fmtDuration(totalTime)}</span>`
      + `<span class="stat-line">⚡ ${fr(avgSpeed,1)} s/question</span>`
      + `<span class="stat-line bad">🎲 ${randSteps.length} étape(s) aléatoire(s)</span>`
      + `<span class="stat-line bad">🔗 ${totalIncoh} incohérence(s) / ${totalPairs} paire(s)</span>`
      + `</div>`;

  v3 += `<div class="score-final">
    <div>Score brut : <strong>${totalOk} / ${totalQ}</strong> (${fr(rawRatio*100,1)} %)</div>
    <div style="margin-top:10px;">Pénalités cumulées : <strong style="color:var(--red);">− ${fr(gapTotal,2)} points</strong></div>
    <span class="big">${fr(adjTotal,1)} / ${totalQ}</span>
    <div class="detail">Score ajusté (${fr(adjRatio*100,1)} %) — indicateur de fiabilité qui neutralise la part attribuable au hasard.</div>
  </div>`;

  v3 += `<div class="analysis-box"><strong>Lecture de l'écart brut/ajusté.</strong> `;
  if(gapTotal < 0.5)        v3 += `Écart <strong>négligeable</strong> (${fr(gapTotal,2)}). Le rythme et la structure des réponses confirment la validité du score brut.`;
  else if(gapTotal < 2)     v3 += `Écart <strong>modéré</strong> (${fr(gapTotal,2)}). Quelques pénalités ponctuelles, sans invalider l'ensemble.`;
  else if(gapTotal < 4)     v3 += `Écart <strong>notable</strong> (${fr(gapTotal,2)}). Une partie des réussites doit être relativisée (rapidité, incohérences, pattern aléatoire).`;
  else                       v3 += `Écart <strong>important</strong> (${fr(gapTotal,2)}). Le score brut surestime fortement la maîtrise réelle : la combinaison rapidité + hasard + incohérences retire beaucoup de crédit.`;
  v3 += `</div>`;

  v3 += `<div class="analysis-box"><strong>Diagnostic.</strong> `;
  if(adjRatio >= 0.80)      v3 += `Maîtrise <strong>excellente</strong> : les acquis résistent à tous les contrôles croisés.`;
  else if(adjRatio >= 0.60) v3 += `Maîtrise <strong>solide</strong> : les acquis sont confirmés par l'analyse.`;
  else if(adjRatio >= 0.40) v3 += `Maîtrise <strong>partielle</strong> : les bases sont là, mais le rythme et les incohérences tirent le score vers le bas.`;
  else if(adjRatio >= 0.20) v3 += `Maîtrise <strong>fragile</strong> : les réussites brutes sont en grande partie attribuables à des réponses rapides. Une relecture du cours est indispensable.`;
  else                       v3 += `Maîtrise <strong>insuffisante</strong> : la majorité des réussites brutes ne résiste pas à l'analyse (hasard, rapidité, incohérences). Reprendre les définitions du Volet 1 avant tout.`;
  v3 += `</div>`;

  v3 += `<div class="analysis-box"><strong>Rythme d'ensemble.</strong> Le temps moyen par question est de <strong>${fr(avgSpeed,1)} s</strong>. `;
  if(avgSpeed < TIME_CI[2].min){ v3 += `Ce rythme est rapide, sous la borne basse de l'intervalle attendu. Il peut refléter une excellente fluidité de lecture, mais aussi une tendance à répondre sans tout à fait vérifier.`; }
  else if(avgSpeed <= TIME_CI[2].max){ v3 += `Ce rythme est adapté à des questions de difficulté variable : il est compatible avec une lecture attentive sans excès de lenteur.`; }
  else { v3 += `Ce rythme est posé, ce qui est un bon signe : il indique une lecture attentive et une réflexion approfondie.`; }
  v3 += `</div>`;

  if(totalPairs > 0){
    v3 += `<div class="analysis-box"><strong>Cohérence croisée d'ensemble.</strong> Sur ${totalPairs} paires de propositions logiquement comparables, ${totalIncoh} incohérence(s) ont été détectées. `;
    if(totalIncoh === 0){ v3 += `Le raisonnement est resté cohérent d'un bout à l'autre : c'est un excellent indicateur de rigueur.`; }
    else if(totalIncoh / totalPairs < 0.2){ v3 += `Ce taux est faible, compatible avec quelques hésitations ponctuelles.`; }
    else { v3 += `Ce taux est non négligeable : certaines notions gagneraient à être revues, en relisant chaque proposition jusqu'au bout.`; }
    v3 += `</div>`;
  }

  v3 += `<div class="advice-box"><h4>💡 Recommandations</h4><ul>`;
  if(adjRatio >= 0.70){
    v3 += `<li>✅ Poursuivez : vos acquis sont confirmés.</li>
           <li>🔁 Rejouez une session pour consolider.</li>
           <li>✍️ Travaillez la rédaction type (Volet 5).</li>`;
  } else if(adjRatio >= 0.40){
    v3 += `<li>📚 Relisez le Volet 1 avant de refaire les étapes faibles.</li>
           <li>🐢 Prenez le temps de lire chaque proposition intégralement.</li>
           <li>🔍 Concentrez-vous sur les étapes à score ajusté < 0,4.</li>`;
  } else {
    v3 += `<li>📖 Commencez par relire posément les définitions (Volet 1).</li>
           <li>🧩 Faites une seule étape par session.</li>
           <li>⏱ Visez au moins ${TIME_CI[2].min} s par question de difficulté 2.</li>
           <li>🔁 Rejouez l'enquête dans quelques jours.</li>`;
  }
  v3 += `</ul></div>`;

  v3 += `<div class="finish-card"><div class="seal">${SC.lieu.substring(0,10).toUpperCase()}</div>
    <h3>Fin de l'enquête</h3>
    <p>Merci d'avoir traversé les dix-sept pièces de ${SC.lieu}.</p>
    <button class="btn-next" onclick="resetProgress()">Recommencer</button>
    <button class="btn-verif" style="margin-left:10px;" onclick="showStep(19)">📚 Cours complet</button></div></div>`;

  return v1 + v2 + v3;
}

