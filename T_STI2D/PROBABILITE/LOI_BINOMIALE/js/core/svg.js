/* ============================================================
   2. GÉNÉRATEURS SVG
   ============================================================ */
/* Formatage décimal court : « 0,30 » → « 0,3 », « 0,00 » → « 0 » (d décimales max). */
function frTrim(x, d){ d = (d === undefined) ? 2 : d; let s = fr(x, d); if(s.indexOf(',') >= 0){ s = s.replace(/0+$/, '').replace(/,$/, ''); } return s; }
function R1(x){ return Math.round(x * 10) / 10; } /* arrondi des coordonnées SVG */
function svgBarChart(vals, labels, title) {
    /* Échelle fixe de 0 à 1 : ce sont des probabilités, la somme doit pouvoir se vérifier.
       Axe des ordonnées finement gradué : ligne (et étiquette) tous les 0,1, subdivision
       secondaire tous les 0,05 — chaque rectangle se lit avec une bonne précision. */
    const h = 210, xL = 46, yBase = 180, plotH = 140;
    const axisMax = 1, NB_SUB = 20; /* 20 subdivisions de 0,05 */
    /* Largeur adaptative : ~36 px par bâton, pour que chaque valeur soit étiquetée
       à l'horizontale et que la somme des bâtons se vérifie d'un coup d'œil. */
    const plotW = Math.max(234, Math.min(600, vals.length * 36));
    const xR = xL + plotW, w = xR + 20;
    let grid = '', rects = '';
    const bw = plotW / vals.length;
    for(let k = 0; k <= NB_SUB; k++){
        const g = k * 0.05;
        const gy = yBase - (g / axisMax) * plotH;
        const major = (k % 2 === 0);
        if(major){
            grid += `<line x1="${xL}" y1="${R1(gy)}" x2="${xR}" y2="${R1(gy)}" stroke="${k === NB_SUB ? '#c9d4ca' : '#e3e9e2'}" stroke-width="1"/>`;
            grid += `<text x="${xL - 6}" y="${R1(gy + 2.8)}" text-anchor="end" font-size="8" fill="#5f6f66">${frTrim(g)}</text>`;
        } else {
            /* subdivision secondaire : grille très claire + petit tick sur l'axe */
            grid += `<line x1="${xL}" y1="${R1(gy)}" x2="${xR}" y2="${R1(gy)}" stroke="#f2f6f1" stroke-width="1"/>`;
            grid += `<line x1="${xL - 3}" y1="${R1(gy)}" x2="${xL}" y2="${R1(gy)}" stroke="#94a3a0" stroke-width="1"/>`;
        }
    }
    vals.forEach((v, i) => {
        const bh = (v / axisMax) * plotH;
        const x = xL + i*bw + bw*0.15;
        const y = yBase - bh;
        rects += `<rect x="${R1(x)}" y="${R1(y)}" width="${R1(bw*0.7)}" height="${R1(bh)}" fill="#1e3a5f" rx="2"/>`;
        rects += `<text x="${xL + i*bw + bw/2}" y="${R1(yBase + 15)}" text-anchor="middle" font-size="11" fill="#5f6f66">${labels[i]}</text>`;
        /* Valeur numérique au-dessus de chaque bâton — toujours affichée :
           à l'horizontale si la place le permet, pivotée à 90° sinon (bâtons étroits). */
        const cx = xL + i*bw + bw/2, vTxt = frTrim(v, 3);
        if(bw >= 30){
            rects += `<text x="${cx}" y="${R1(y - 4)}" text-anchor="middle" font-size="9" font-weight="bold" fill="#1b2a24">${vTxt}</text>`;
        } else {
            rects += `<text x="${R1(cx)}" y="${R1(y - 4)}" text-anchor="start" font-size="8.5" font-weight="bold" fill="#1b2a24" transform="rotate(-90 ${R1(cx)} ${R1(y - 4)})">${vTxt}</text>`;
        }
    });
    return `<svg viewBox="0 0 ${w} ${h}" style="width:100%; max-width:${w}px; background:#fff; border:1px solid #d5ded5; border-radius:6px; margin:10px 0;">
        <text x="${w/2}" y="18" text-anchor="middle" font-weight="bold" font-size="12" fill="#1b2a24">${title}</text>
        ${grid}
        ${rects}
        <line x1="${xL}" y1="${yBase}" x2="${xR}" y2="${yBase}" stroke="#999" stroke-width="1.5"/>
        <line x1="${xL}" y1="${yBase}" x2="${xL}" y2="${yBase - plotH - 6}" stroke="#999" stroke-width="1.5"/>
        <text x="14" y="${(yBase + yBase - plotH) / 2}" transform="rotate(-90 14 ${(yBase + yBase - plotH) / 2})" font-size="10" fill="#5f6f66">Probabilité</text>
    </svg>`;
}
function svgCurveChart(type, title) {
    const w = 280, h = 160, pad = 30;
    let path = '';
    if (type === 'normal') { path = `M ${pad} ${h-pad} C ${w/2 - 40} ${h-pad}, ${w/2 - 40} ${pad}, ${w/2} ${pad} C ${w/2 + 40} ${pad}, ${w/2 + 40} ${h-pad}, ${w-pad} ${h-pad}`; }
    else if (type === 'normal_broad') { path = `M ${pad} ${h-pad} C ${pad + 20} ${h-pad}, ${pad + 20} ${pad+10}, ${w/2} ${pad+10} C ${w-pad - 20} ${pad+10}, ${w-pad - 20} ${h-pad}, ${w-pad} ${h-pad}`; }
    else if (type === 'uniform') { path = `M ${pad} ${h-pad} L ${pad} ${pad+20} L ${w-pad} ${pad+20} L ${w-pad} ${h-pad}`; }
    else if (type === 'skew') { path = `M ${pad} ${h-pad} C ${pad+20} ${h-pad}, ${pad+20} ${pad}, ${pad+70} ${pad} C ${pad+100} ${pad}, ${w-pad-10} ${h-pad-15}, ${w-pad} ${h-pad}`; }
    /* Grille fine et discrète : lignes verticales et horizontales tous les 20 px */
    let grid = '';
    for(let gx = pad + 20; gx < w - pad; gx += 20){ grid += `<line x1="${gx}" y1="${pad}" x2="${gx}" y2="${h-pad}" stroke="#eef2ed" stroke-width="1"/>`; }
    for(let gy = pad + 20; gy < h - pad; gy += 20){ grid += `<line x1="${pad}" y1="${gy}" x2="${w-pad}" y2="${gy}" stroke="#eef2ed" stroke-width="1"/>`; }
    return `<svg viewBox="0 0 ${w} ${h}" style="width:100%; background:#fff; border:1px solid #d5ded5; border-radius:6px; margin:10px 0;">
        <text x="${w/2}" y="20" text-anchor="middle" font-weight="bold" font-size="12" fill="#1b2a24">${title}</text>
        ${grid}
        <path d="${path}" fill="rgba(30, 58, 95, 0.15)" stroke="#1e3a5f" stroke-width="2"/>
        <line x1="${pad}" y1="${h-pad}" x2="${w-pad}" y2="${h-pad}" stroke="#999" stroke-width="1.5"/>
        <line x1="${pad}" y1="${h-pad}" x2="${pad}" y2="${pad}" stroke="#999" stroke-width="1.5"/>
    </svg>`;
}
function buildTreeStructure(depth, variant) {
  const nodes = [], edges = []; let nid = 0;
  function addNode(path, level, label){ const id = 'n' + (nid++); nodes.push({id, path, level, label}); return id; }
  if (variant === 'three') {
    const rootId = addNode('', 0, '');
    ['A', 'B', 'C'].forEach(function(lab, i){ const cid = addNode(lab, 1, lab); edges.push({from: rootId, to: cid, branch: lab, level: 0, probIdx: i}); });
    return {nodes, edges, variant, depth: 1};
  }
  function buildSubtree(parentId, parentPath, level){
    if (level >= depth) return;
    const sId = addNode(parentPath + 'S', level + 1, 'S');
    const eId = addNode(parentPath + 'E', level + 1, 'E');
    edges.push({from: parentId, to: sId, branch: 'S', level});
    edges.push({from: parentId, to: eId, branch: 'E', level});
    buildSubtree(sId, parentPath + 'S', level + 1);
    buildSubtree(eId, parentPath + 'E', level + 1);
  }
  const rootId = addNode('', 0, '');
  buildSubtree(rootId, '', 0);
  return {nodes, edges, variant, depth};
}
function getNodeLayout(node, allNodes, depth, orientation, W, H){
  const padL = 40, padR = 40, padT = 45, padB = 40;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  const levelNodes = allNodes.filter(function(n){ return n.level === node.level; });
  const idx = levelNodes.findIndex(function(n){ return n.id === node.id; });
  const count = levelNodes.length;
  const frac = (idx + 0.5) / count;
  const levelFrac = node.level / depth;
  let x, y;
  if (orientation === 'top-down') { x = padL + frac * innerW; y = padT + levelFrac * innerH; }
  else if (orientation === 'bottom-up') { x = padL + frac * innerW; y = padT + (1 - levelFrac) * innerH; }
  else if (orientation === 'left-right') { y = padT + frac * innerH; x = padL + levelFrac * innerW; }
  else if (orientation === 'right-left') { y = padT + frac * innerH; x = padL + (1 - levelFrac) * innerW; }
  else { x = padL + (levelFrac * 0.35 + frac * 0.65) * innerW; y = padT + levelFrac * innerH; }
  return {x, y};
}
function edgeLabel(edge, p, variant){
  if (variant === 'three') return [0.3, 0.3, 0.4][edge.probIdx];
  if (variant === 'changing') { const pL = edge.level === 0 ? p : (p > 0.5 ? p - 0.2 : p + 0.2); return edge.branch === 'S' ? pL : 1 - pL; }
  if (variant === 'wrong-sum') return 0.3;
  return edge.branch === 'S' ? p : 1 - p;
}
function svgTree(opts){
  const W = 420, H = 340;
  const orientation = opts.orientation || 'top-down';
  const variant = opts.variant || 'valid';
  const p = opts.p !== undefined ? opts.p : 0.5;
  const reqDepth = opts.depth || 2;
  const struct = buildTreeStructure(reqDepth, variant);
  const actualDepth = struct.depth;
  const nodes = struct.nodes, edges = struct.edges;
  const positions = {};
  nodes.forEach(function(n){ positions[n.id] = getNodeLayout(n, nodes, actualDepth, orientation, W, H); });
  let svg = `<svg viewBox="0 0 ${W} ${H}" class="wide" style="width:100%; max-width:420px; height:auto; display:block; margin:10px auto; background:#fff; border:1px solid #d5ded5; border-radius:8px;">`;
  edges.forEach(function(e){
    const from = positions[e.from], to = positions[e.to];
    const label = edgeLabel(e, p, variant);
    svg += `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="#7a8a7f" stroke-width="1.6"/>`;
    const mx = (from.x + to.x) / 2, my = (from.y + to.y) / 2;
    svg += `<text x="${mx}" y="${my + 3}" text-anchor="middle" font-size="10" font-weight="800" fill="#1e3a5f" stroke="#fff" stroke-width="3" paint-order="stroke">${fr(label, 1)}</text>`;
  });
  nodes.forEach(function(n){
    const pos = positions[n.id];
    if (n.level === 0) {
      svg += `<circle cx="${pos.x}" cy="${pos.y}" r="12" fill="#a16207" stroke="#7a4a05" stroke-width="2"/>`;
      svg += `<text x="${pos.x}" y="${pos.y + 4}" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">R</text>`;
    } else {
      const color = n.label === 'S' ? '#15803d' : (n.label === 'E' ? '#b91c1c' : '#3b2a5e');
      svg += `<circle cx="${pos.x}" cy="${pos.y}" r="10" fill="${color}" stroke="#333" stroke-width="1.3"/>`;
      svg += `<text x="${pos.x}" y="${pos.y + 3.5}" text-anchor="middle" font-size="9" font-weight="800" fill="#fff">${n.label}</text>`;
    }
  });
  svg += `</svg>`;
  return svg;
}

