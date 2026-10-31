/* ============================================================
   21. MONDE « BALLE REBONDISSANTE » — deuxième animation
   ============================================================
   Alternative à la tour 3D (choix dans le menu utilitaire,
   mémorisé dans localStorage « tdm-anim »). Deux murs face à
   face portent des PALIERS : la balle (sphère colorée 3D,
   bien GROSSE) rebondit de mur en mur, palier par palier,
   traînée visible.
   — Montée : elle est HEUREUSE et FÊTÉE — yeux rieurs, grand
     sourire, étincelles de joie pendant le vol, et gerbe de
     feu d'artifice à l'arrivée, plus forte quand le palier
     visé est haut.
   — Erreur : elle chute (entre les murs) d'autant de paliers
     que la pénalité, le visage TRÈS TRISTE et des larmes qui
     coulent vers le bas ; l'écrasement à l'arrivée est marqué
     en fonction du nombre de paliers perdus ; un plancher
     coulissant incliné vers le bon mur la guide vers son
     nouveau palier ; et dès qu'elle a rejoint son palier,
     les pans de murs au-dessus d'elle S'ÉCRASENT AU SOL.
   ============================================================ */

(() => {
  const PH  = 46;            /* hauteur d'un palier (px) */
  const KEY = 'tdm-anim';

  const BW = {
    active: false, init: false,
    lvl: 0, side: 0, x: 0, y: 0,
    tgt: 0, queue: 0, gainTot: 0,
    phase: 'idle', t: 0, dur: 0, clock: 0,
    from: null, to: null, arcH: 0,
    P: 0, vy: 0, midX: 0, land: null, slideT: 0, ext: 0,
    cryT: 0, tearT: 0,
    sq: 0, shake: 0,
    trail: [], sparks: [], tears: [], rings: [], debris: [],
    cam: 0, last: 0, needPos: true, joyT: 0
  };

  /* ---------- géométrie ---------- */
  const geo = W => ({
    LX: Math.max(56, W * 0.16),
    RX: Math.min(W - 56, W * 0.84),
    SL: Math.min(120, Math.max(60, W * 0.12)),
    R : Math.min(25, Math.max(16, W * 0.025))   /* une belle grosse balle */
  });
  const clampLvl = v => Math.max(0, Math.min(N_TOT, Math.round(v)));
  const sideOf = lvl => ((Math.round(lvl) % 2) + 2) % 2;
  const lerp = (a, b, u) => a + (b - a) * u;

  function shelfPos(W, lvl, side){
    const g = geo(W);
    return {
      x: side === 0 ? g.LX + g.SL * 0.55 : g.RX - g.SL * 0.55,
      y: lvl * PH + g.R
    };
  }
  function hueOf(lvl){
    const n = NOTIONS[Math.max(0, Math.min(N_TOT - 1, Math.round(lvl)))];
    return (FAMILY_HUES && FAMILY_HUES[n.family]) || 210;
  }
  function snap(W){
    BW.tgt = clampLvl(state.floor);
    BW.lvl = BW.tgt; BW.side = sideOf(BW.lvl);
    if (W){ const p = shelfPos(W, BW.lvl, BW.side); BW.x = p.x; BW.y = p.y; BW.needPos = false; }
    else BW.needPos = true;
    BW.phase = 'idle'; BW.queue = 0; BW.gainTot = 0; BW.P = 0;
    BW.trail = []; BW.sparks = []; BW.tears = []; BW.rings = []; BW.debris = [];
    BW.sq = 0; BW.vy = 0; BW.init = true; BW.joyT = 0;
  }

  /* ---------- effets ---------- */
  function ring(x, y, big){ BW.rings.push({ x, y, r: 6, life: 1, big: !!big }); }
  function gerbe(x, y, power, hue){
    const n = Math.round(14 * power);
    for (let k = 0; k < n; k++){
      const a = Math.random() * Math.PI * 2;
      const sp = (80 + 150 * power) * (0.45 + Math.random() * 0.75);
      BW.sparks.push({
        x, y,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60 * power,
        life: 1, hue: [hue, 45, 28][k % 3]
      });
    }
  }
  /* une larme naît à l'œil et COULE VERS LE BAS */
  function larme(W){
    const g = geo(W);
    const s = Math.random() < 0.5 ? -1 : 1;    /* l'œil gauche ou droit */
    BW.tears.push({
      x: BW.x + s * g.R * 0.38 + (Math.random() - 0.5) * 4,
      y: BW.y + g.R * 0.12,
      vx: (Math.random() - 0.5) * 8,
      vy: -12 - Math.random() * 20,           /* vers le bas dès la naissance */
      life: 1
    });
  }
  /* étincelle de joie pendant la montée */
  function joie(x, y, hue){
    BW.sparks.push({
      x: x + (Math.random() - 0.5) * 18,
      y: y - Math.random() * 8,
      vx: (Math.random() - 0.5) * 46,
      vy: 46 + Math.random() * 70,
      life: 0.8, hue: [hue, 48, 330][Math.floor(Math.random() * 3)]
    });
  }
  /* les pans de murs au-dessus d'elle se détachent et s'écrasent au sol */
  function debrisChute(W){
    const g = geo(W);
    const hi = BW.lvl + BW.P;                  /* les paliers perdus */
    for (let i = BW.lvl + 1; i <= hi && i <= N_TOT; i++){
      const side = sideOf(i);
      const x0 = side === 0 ? g.LX : g.RX - g.SL;
      const n = 2 + (i % 2);                   /* la dalle du palier en morceaux */
      for (let k = 0; k < n; k++){
        const wf = g.SL / n;
        BW.debris.push({
          x: x0 + wf * (k + 0.5), y: i * PH + 4,
          vx: (side === 0 ? 1 : -1) * (18 + Math.random() * 46),
          vy: 14 + Math.random() * 36,         /* petit saut, puis chute */
          w: wf, h: 8, rot: 0, vr: (Math.random() - 0.5) * 4,
          life: 1, landed: false, col: '#b9a788'
        });
      }
      for (let k = 0; k < 2; k++){             /* des briques des murs aussi */
        const s2 = k % 2;
        BW.debris.push({
          x: s2 === 0 ? g.LX - 7 : g.RX + 7,
          y: i * PH + 10 + Math.random() * PH * 0.6,
          vx: (s2 === 0 ? 1 : -1) * (26 + Math.random() * 56),
          vy: 22 + Math.random() * 44,
          w: 15, h: 10, rot: 0, vr: (Math.random() - 0.5) * 6,
          life: 1, landed: false, col: '#cdbb96'
        });
      }
    }
  }

  /* ---------- transitions ---------- */
  function startBounce(W){
    const nSide = 1 - BW.side;
    const p = shelfPos(W, BW.lvl + 1, nSide);
    BW.from = { x: BW.x, y: BW.y };
    BW.to = { x: p.x, y: p.y, lvl: BW.lvl + 1, side: nSide };
    BW.dur = BW.queue > 10 ? 0.13 : (BW.queue > 4 ? 0.22 : 0.5);
    BW.arcH = (BW.queue > 4 ? 15 : 30) + PH * 0.35;
    BW.t = 0; BW.phase = 'bounce';
  }
  function startFall(W, P){
    const g = geo(W);
    BW.P = P;
    BW.midX = (g.LX + g.RX) / 2;
    const rest = shelfPos(W, BW.tgt, sideOf(BW.tgt));
    BW.land = {
      x: BW.midX,
      y: BW.tgt * PH + PH * 0.45 + g.R,
      restX: rest.x, restY: rest.y, side: sideOf(BW.tgt)
    };
    BW.vy = 0; BW.ext = 0; BW.t = 0; BW.dur = 0.16;
    BW.from = { x: BW.x, y: BW.y };
    BW.phase = 'fallDrop';
  }
  function settleFall(W){
    BW.x = BW.land.restX; BW.y = BW.land.restY; BW.lvl = BW.tgt; BW.side = BW.land.side;
    /* écrasement d'arrivée marqué en fonction du nombre de paliers perdus */
    BW.sq = Math.max(BW.sq, Math.min(0.9, 0.28 + BW.P * 0.13));
    BW.cryT = 0.85 + BW.P * 0.55; BW.tearT = 0;
    BW.phase = 'cry';
    debrisChute(W);                            /* les pans de murs au-dessus s'écrasent */
  }

  /* ---------- mise à jour ---------- */
  function update(dt, W, H){
    const tgt = clampLvl(state.floor);

    /* l'élève a répondu : la cible a changé */
    if (tgt !== BW.tgt && BW.init){
      if (tgt > BW.tgt){
        const d = tgt - BW.tgt;
        BW.queue += d; BW.gainTot += d; BW.tgt = tgt;
        if (BW.phase === 'idle' || BW.phase === 'cry') startBounce(W);
      } else {
        const P = BW.tgt - tgt;
        BW.tgt = tgt; BW.gainTot = 0; BW.queue = 0;
        if (P > 9){                       /* remise à zéro : téléportation douce */
          snap(W);
        } else if (BW.phase === 'bounce' || BW.phase === 'idle' || BW.phase === 'cry'){
          startFall(W, P);
        } else {                          /* chute déjà en cours : nouvelle cible */
          const g = geo(W);
          const rest = shelfPos(W, BW.tgt, sideOf(BW.tgt));
          BW.land = { x: BW.midX, y: BW.tgt * PH + PH * 0.45 + g.R,
                      restX: rest.x, restY: rest.y, side: sideOf(BW.tgt) };
          BW.P = Math.max(1, P);
        }
      }
    }

    BW.clock += dt;
    BW.sq *= Math.pow(0.02, dt);          /* l'écrasement se résorbe (ressort) */
    if (BW.sq < 0.004) BW.sq = 0;

    switch (BW.phase){
      case 'bounce': {
        BW.t += dt;
        const u = Math.min(1, BW.t / BW.dur);
        BW.x = lerp(BW.from.x, BW.to.x, u);
        BW.y = lerp(BW.from.y, BW.to.y, u) + BW.arcH * Math.sin(Math.PI * u);
        BW.trail.push({ x: BW.x, y: BW.y, life: 1 });
        BW.joyT -= dt;                         /* elle est fêtée pendant la montée */
        if (BW.joyT <= 0){ joie(BW.x, BW.y, hueOf(BW.lvl + 1)); BW.joyT = 0.07; }
        if (u >= 1){
          BW.lvl = BW.to.lvl; BW.side = BW.to.side; BW.x = BW.to.x; BW.y = BW.to.y;
          BW.sq = Math.max(BW.sq, 0.26);            /* écrasement léger : elle bondit */
          ring(BW.x, BW.y, false);
          BW.queue--;
          if (BW.queue > 0){ startBounce(W); }
          else {
            const power = 0.55 + BW.lvl / 55 + BW.gainTot * 0.35;
            gerbe(BW.x, BW.y, power, hueOf(BW.lvl));
            BW.gainTot = 0; BW.phase = 'idle';
          }
        }
        break;
      }
      case 'fallDrop': {                   /* elle quitte son palier : entre les murs */
        BW.t += dt;
        const u = Math.min(1, BW.t / BW.dur);
        BW.x = lerp(BW.from.x, BW.midX, u);
        BW.y = BW.from.y + 9 * Math.sin(Math.PI * u);
        if (u >= 1){ BW.phase = 'fallFree'; BW.vy = 0; BW.t = 0; }
        break;
      }
      case 'fallFree': {                  /* chute libre, accélérée — elle est très triste */
        BW.vy += 2400 * dt;
        BW.y -= BW.vy * dt;
        BW.ext = Math.min(1, (BW.ext || 0) + dt / 0.22);   /* le plancher coulisse en place */
        BW.trail.push({ x: BW.x, y: BW.y, life: 1 });
        BW.tearT -= dt;
        if (BW.tearT <= 0){ larme(W); BW.tearT = Math.max(0.1, 0.3 - BW.P * 0.02); }
        if (BW.y <= BW.land.y){
          BW.y = BW.land.y;
          /* plus de paliers perdus = écrasement d'arrivée plus marqué */
          BW.sq = Math.min(0.92, 0.3 + BW.P * 0.14 + BW.vy / 9000);
          ring(BW.x, BW.y, true);
          BW.phase = 'slide'; BW.slideT = 0;
          BW.dur = 0.42 + BW.P * 0.03;
        }
        break;
      }
      case 'slide': {                     /* le plancher incliné la guide vers son palier */
        BW.slideT += dt;
        const u = Math.min(1, BW.slideT / BW.dur);
        const e = u * u * (3 - 2 * u);     /* accelération puis freinage */
        BW.x = lerp(BW.land.x, BW.land.restX, e);
        BW.y = lerp(BW.land.y, BW.land.restY, e);
        BW.sq = Math.max(BW.sq, 0.08);
        BW.tearT -= dt;
        if (BW.tearT <= 0){ larme(W); BW.tearT = Math.max(0.12, 0.34 - BW.P * 0.02); }
        if (u >= 1) settleFall(W);
        break;
      }
      case 'cry': {                       /* elle pleure : plus la chute, plus les larmes */
        BW.cryT -= dt;
        BW.tearT -= dt;
        if (BW.tearT <= 0){
          larme(W);
          BW.tearT = Math.max(0.06, 0.22 - BW.P * 0.028);
        }
        if (BW.cryT <= 0){ BW.P = 0; BW.phase = 'idle'; }
        break;
      }
      default: {                          /* idle : petite respiration */
        const g = geo(W);
        BW.sq = Math.max(BW.sq, 0.05 * Math.abs(Math.sin(BW.clock * 2.4)));
      }
    }

    /* trembleotte pendant que la porte s'ouvre (erreur en cours de leçon) */
    BW.shake = (state.doorFloor >= 0 && state.doorProgress > 0) ? 1.6 : 0;

    /* particules */
    for (let i = BW.trail.length - 1; i >= 0; i--){
      BW.trail[i].life -= dt * 2.6;
      if (BW.trail[i].life <= 0) BW.trail.splice(i, 1);
    }
    for (let i = BW.sparks.length - 1; i >= 0; i--){
      const s = BW.sparks[i];
      s.x += s.vx * dt; s.y += s.vy * dt; s.vy -= 320 * dt; s.life -= dt * 1.1;
      if (s.life <= 0) BW.sparks.splice(i, 1);
    }
    for (let i = BW.tears.length - 1; i >= 0; i--){
      const t = BW.tears[i];
      t.x += t.vx * dt; t.y += t.vy * dt;           /* vy < 0 : la larme COULE VERS LE BAS */
      t.vy = Math.max(-620, t.vy - 900 * dt);       /* gravité vers le bas */
      t.life -= dt * 1.15;
      if (t.life <= 0) BW.tears.splice(i, 1);
    }
    for (let i = BW.rings.length - 1; i >= 0; i--){
      const r = BW.rings[i];
      r.r += (r.big ? 190 : 110) * dt; r.life -= dt * 2.4;
      if (r.life <= 0) BW.rings.splice(i, 1);
    }
    /* les pans de murs arrachés tombent puis s'écrasent au sol */
    for (let i = BW.debris.length - 1; i >= 0; i--){
      const d = BW.debris[i];
      if (!d.landed){
        d.x += d.vx * dt; d.y += d.vy * dt;
        d.vy -= 2600 * dt;                          /* gravité */
        d.rot += d.vr * dt;
        if (d.y <= d.h / 2 + 4){                   /* le sol : ça s'écrase */
          d.y = d.h / 2 + 4; d.landed = true;
          if (Math.random() < 0.35) ring(d.x, d.h / 2 + 4, false);   /* poussière */
        }
      } else {
        d.rot *= Math.pow(0.001, dt);             /* le morceau se stabilise à plat */
        d.life -= dt * 1.3;                       /* puis s'estompe */
        if (d.life <= 0) BW.debris.splice(i, 1);
      }
    }

    /* caméra : suit la balle */
    BW.cam += ((BW.y + PH * 1.7) - BW.cam) * Math.min(1, dt * 5.2);
  }

  /* ---------- rendu ---------- */
  function draw(ctx, W, H){
    const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    let dt = BW.last ? (now - BW.last) / 1000 : 0.016;
    BW.last = now;
    dt = Math.max(0.001, Math.min(0.05, dt));

    if (!BW.init) snap(W);
    if (BW.needPos){ const p = shelfPos(W, BW.lvl, BW.side); BW.x = p.x; BW.y = p.y; BW.needPos = false; }

    update(dt, W, H);

    const g = geo(W);
    const hue = hueOf(BW.lvl);
    const camY = BW.cam;
    const sy = y => H * 0.58 - (y - camY);
    const shakeX = BW.shake ? Math.sin(BW.clock * 42) * BW.shake : 0;

    /* ciel (même atmosphère que la tour) */
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#b8d4ef'); sky.addColorStop(0.45, '#dceaf6');
    sky.addColorStop(0.8, '#f5ecd8'); sky.addColorStop(1, '#fbe9d0');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
    if (typeof stars !== 'undefined' && stars){
      for (const s of stars){
        ctx.globalAlpha = s.a * 0.16;
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(s.x * W, s.y * H * 0.55, s.r * 0.8, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    /* fenêtre visible */
    const lo = Math.max(0, Math.floor((camY - H * 0.75) / PH));
    const hi = Math.min(N_TOT, Math.ceil((camY + H * 0.75) / PH));

    /* sol tout en bas */
    const groundY = sy(0);
    if (groundY < H + 60){
      const gr = ctx.createLinearGradient(0, groundY, 0, H + 60);
      gr.addColorStop(0, '#c8b48a'); gr.addColorStop(1, '#8a744c');
      ctx.fillStyle = gr;
      ctx.fillRect(0, groundY, W, Math.max(0, H + 60 - groundY));
    }

    /* ---------- murs ---------- */
    const wallW = 15;
    const wallGrad = side => {
      const gr = ctx.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, '#b9a788'); gr.addColorStop(1, '#d8c9a8');
      return gr;
    };
    ctx.fillStyle = wallGrad();
    ctx.fillRect(g.LX - wallW, 0, wallW, H);
    ctx.fillRect(g.RX, 0, wallW, H);
    /* briques alignées sur les paliers */
    ctx.strokeStyle = 'rgba(90,70,40,.25)'; ctx.lineWidth = 1;
    for (let i = lo; i <= hi + 1; i++){
      const yy = sy(i * PH);
      if (yy < -10 || yy > H + 10) continue;
      ctx.beginPath(); ctx.moveTo(g.LX - wallW, yy); ctx.lineTo(g.LX, yy);
      ctx.moveTo(g.RX, yy); ctx.lineTo(g.RX + wallW, yy); ctx.stroke();
      const off = (i % 2) * (wallW / 2);
      ctx.beginPath(); ctx.moveTo(g.LX - wallW + off, yy); ctx.lineTo(g.LX - wallW + off, yy + 8); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(g.RX + off, yy + 12); ctx.lineTo(g.RX + off, yy + 20); ctx.stroke();
    }
    /* numéros de palier tous les 5 */
    ctx.fillStyle = 'rgba(255,252,240,.6)';
    ctx.font = '700 10px system-ui,sans-serif'; ctx.textAlign = 'center';
    for (let i = lo; i <= hi; i++){
      if (i % 5 !== 0 || i === 0) continue;
      const yy = sy(i * PH + 6);
      if (yy < -10 || yy > H + 10) continue;
      ctx.fillText(String(i), g.LX - wallW / 2, yy);
      ctx.fillText(String(i), g.RX + wallW / 2, yy);
    }

    /* ---------- paliers ---------- */
    for (let i = lo; i <= Math.min(hi, N_TOT); i++){
      const side = sideOf(i);
      const x0 = side === 0 ? g.LX : g.RX - g.SL;
      const x1 = side === 0 ? g.LX + g.SL : g.RX;
      const yy = sy(i * PH);
      if (yy < -30 || yy > H + 30) continue;
      const isCur = (i === BW.tgt);
      const isVal = state.validated.has(NOTIONS[Math.min(i, N_TOT - 1)].id);
      const built = i <= state.maxBuiltFloor;
      let col = isVal ? '#e6b84c' : '#b9a06b';
      let edge = 'rgba(90,70,40,.45)';
      if (isCur){ col = `hsl(${hueOf(i)},70%,60%)`; edge = `hsl(${hueOf(i)},90%,75%)`; }
      ctx.globalAlpha = built ? 1 : 0.32;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(x0, yy, x1 - x0, 8, 3) : ctx.rect(x0, yy, x1 - x0, 8);
      ctx.fill();
      ctx.strokeStyle = edge; ctx.lineWidth = isCur ? 2 : 1;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    /* ---------- pans de murs arrachés : ils tombent et s'écrasent au sol ---------- */
    for (const dd of BW.debris){
      ctx.save();
      ctx.globalAlpha = Math.max(0, dd.life) * 0.95;
      ctx.translate(dd.x + shakeX, sy(dd.y));
      ctx.rotate(dd.rot);
      ctx.fillStyle = dd.col;
      ctx.strokeStyle = 'rgba(90,70,40,.45)'; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(-dd.w / 2, -dd.h / 2, dd.w, dd.h, 2)
                     : ctx.rect(-dd.w / 2, -dd.h / 2, dd.w, dd.h);
      ctx.fill(); ctx.stroke();
      ctx.restore();
    }
    ctx.globalAlpha = 1;

    /* ---------- sommet : drapeau ---------- */
    if (N_TOT * PH - camY < H * 1.2 && N_TOT * PH - camY > -H){
      const topY = sy(N_TOT * PH);
      ctx.strokeStyle = '#7a5c2e'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(BW.midX || W / 2, topY); ctx.lineTo(BW.midX || W / 2, topY - 46); ctx.stroke();
      const wa = state.finalAscent ? 1 + 0.12 * Math.sin(BW.clock * 8) : 1;
      ctx.fillStyle = '#e6b84c';
      ctx.beginPath();
      ctx.moveTo(BW.midX || W / 2, topY - 46);
      ctx.lineTo((BW.midX || W / 2) + 30 * wa, topY - 38);
      ctx.lineTo(BW.midX || W / 2, topY - 30);
      ctx.closePath(); ctx.fill();
    }

    /* ---------- plancher coulissant incliné (pendant la chute) ---------- */
    if (BW.phase === 'fallFree' || BW.phase === 'slide' || (BW.phase === 'fallDrop' && BW.ext > 0)){
      const e = Math.min(1, BW.ext || 0);
      const farX = lerp(BW.land.restX, BW.land.x, e);
      const farY = lerp(BW.land.restY, BW.land.y, e);
      const y1 = sy(BW.land.restY), y2 = sy(farY);
      ctx.fillStyle = '#c9b68a';
      ctx.strokeStyle = 'rgba(90,70,40,.5)'; ctx.lineWidth = 1;
      ctx.save();
      ctx.translate(shakeX, 0);
      ctx.beginPath();
      ctx.moveTo(BW.land.restX, y1);
      ctx.lineTo(farX, y2);
      ctx.lineTo(farX, y2 + 7);
      ctx.lineTo(BW.land.restX, y1 + 7);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();
    }

    /* ---------- traînée ---------- */
    for (const t of BW.trail){
      ctx.globalAlpha = t.life * 0.30;
      ctx.fillStyle = `hsl(${hue},80%,62%)`;
      ctx.beginPath();
      ctx.arc(t.x + shakeX, sy(t.y), g.R * 0.8 * t.life, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    /* ---------- ombre ---------- */
    {
      const shLvl = Math.max(0, Math.min(N_TOT, Math.round((BW.y - g.R) / PH)));
      const shY = sy(shLvl * PH + 4);
      const hAbove = Math.max(0, (BW.y - g.R) - shLvl * PH);
      ctx.globalAlpha = Math.max(0.06, 0.3 - hAbove / (PH * 8));
      ctx.fillStyle = '#3a2b18';
      ctx.beginPath();
      ctx.ellipse(BW.x + shakeX, shY, g.R * (1 + hAbove / 90), 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    /* ---------- la balle (sphère 3D colorée) ---------- */
    {
      const sq = BW.sq;
      const rx = g.R * (1 + sq * 0.55);
      const ry = g.R * (1 - sq * 0.45);
      const bx = BW.x + shakeX, by = sy(BW.y);
      const grad = ctx.createRadialGradient(bx - rx * 0.35, by - ry * 0.4, rx * 0.15, bx, by, rx * 1.15);
      grad.addColorStop(0, `hsl(${hue},95%,86%)`);
      grad.addColorStop(0.55, `hsl(${hue},78%,58%)`);
      grad.addColorStop(1, `hsl(${hue},70%,34%)`);
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.ellipse(bx, by, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = `hsla(${hue},60%,25%,.55)`; ctx.lineWidth = 1; ctx.stroke();
      /* reflet */
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.ellipse(bx - rx * 0.38, by - ry * 0.42, rx * 0.2, ry * 0.16, -0.6, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;

      /* visage : HEUREUSE en montée / très triste en chute / pleure */
      const fw = 'rgba(46,30,16,.85)';
      const ex = rx * 0.36, ey = -ry * 0.18;
      const crying = BW.phase === 'cry';
      const scared = BW.phase === 'fallFree' || BW.phase === 'fallDrop' || BW.phase === 'slide';
      const happy = BW.phase === 'bounce';
      const d = Math.min(1, BW.P * 0.22);
      ctx.strokeStyle = fw; ctx.fillStyle = fw; ctx.lineWidth = Math.max(1.4, g.R * 0.11);
      if (happy){
        /* yeux rieurs (^ ^) */
        for (const s of [-1, 1]){
          ctx.beginPath();
          ctx.arc(bx + s * ex, by + ey + g.R * 0.05, g.R * 0.17, Math.PI * 1.12, Math.PI * 1.88);
          ctx.stroke();
        }
        /* grand sourire ouvert — elle est fêtée ! */
        ctx.beginPath();
        ctx.arc(bx, by + ry * 0.14, rx * 0.34, 0, Math.PI);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(255,120,120,.85)';
        ctx.beginPath();
        ctx.arc(bx, by + ry * 0.14 + rx * 0.24, rx * 0.15, Math.PI, Math.PI * 2);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = fw;
      } else {
        const eyeR = g.R * (scared ? 0.16 : 0.115) * (1 + (crying ? d * 0.35 : 0));
        for (const s of [-1, 1]){
          ctx.beginPath(); ctx.arc(bx + s * ex, by + ey, eyeR, 0, Math.PI * 2); ctx.fill();
        }
        ctx.beginPath();
        if (crying || scared){
          const mo = ry * 0.34 + d * ry * 0.22;
          ctx.moveTo(bx - rx * 0.3, by + mo);
          ctx.quadraticCurveTo(bx, by + mo + ry * (0.3 + d * 0.3), bx + rx * 0.3, by + mo);
        } else {
          ctx.moveTo(bx - rx * 0.3, by + ry * 0.22);
          ctx.quadraticCurveTo(bx, by + ry * 0.45, bx + rx * 0.3, by + ry * 0.22);
        }
        ctx.stroke();
      }
      /* sourcils tristes : pendant toute la chute et les larmes */
      if (crying || scared){
        for (const s of [-1, 1]){
          ctx.beginPath();
          ctx.moveTo(bx + s * ex * 1.6, by + ey - g.R * 0.32);
          ctx.lineTo(bx + s * ex * 0.55, by + ey - g.R * 0.16);
          ctx.stroke();
        }
      }
    }

    /* ---------- larmes ---------- */
    for (const t of BW.tears){
      ctx.globalAlpha = Math.max(0, t.life);
      ctx.fillStyle = '#7fd0ff';
      const tx = t.x + shakeX, ty = sy(t.y);
      ctx.beginPath();
      ctx.moveTo(tx, ty - 5);
      ctx.quadraticCurveTo(tx + 3, ty, tx, ty + 4);
      ctx.quadraticCurveTo(tx - 3, ty, tx, ty - 5);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    /* ---------- gerbe de feu d'artifice ---------- */
    for (const s of BW.sparks){
      ctx.globalAlpha = Math.max(0, s.life);
      ctx.fillStyle = `hsl(${s.hue},90%,${55 + 25 * s.life}%)`;
      ctx.beginPath();
      ctx.arc(s.x + shakeX, sy(s.y), Math.max(0.5, 3.2 * s.life), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    /* ---------- anneaux d'impact ---------- */
    for (const r of BW.rings){
      ctx.globalAlpha = Math.max(0, r.life * 0.6);
      ctx.strokeStyle = `hsl(${hue},80%,70%)`;
      ctx.lineWidth = r.big ? 3 : 2;
      ctx.beginPath();
      ctx.ellipse(r.x + shakeX, sy(r.y), r.r, r.r * 0.32, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- API & bascule ---------- */
  function refreshAnimBtn(){
    const b = $('animBtn');
    if (b){
      b.textContent = BW.active
        ? "🏗️ Revenir à l'animation « Tour 3D »"
        : "🏀 Animation « Balle rebondissante »";
    }
    const hint = $('hint');
    if (hint){
      hint.textContent = BW.active
        ? 'La balle rebondit de palier en palier entre les deux murs'
        : 'Glisse la souris pour faire tourner la tour';
    }
  }
  function toggle(){
    BW.active = !BW.active;
    try { localStorage.setItem(KEY, BW.active ? 'balle' : 'tour'); } catch (e) {}
    if (BW.active){
      BW.init = false; BW.last = 0;          /* la balle démarre au bon palier */
    } else {
      /* retour à la tour : on raccroche la caméra à l'étage réel */
      try {
        state.visualFloor = state.floor;
        state.camY = (state.floor + 1) * HH - 1.6;
      } catch (e) {}
    }
    refreshAnimBtn();
    return BW.active ? 'balle' : 'tour';
  }

  function humeur(){
    if (BW.phase === 'fallDrop' || BW.phase === 'fallFree' ||
        BW.phase === 'slide' || BW.phase === 'cry') return 'triste';
    if (BW.phase === 'bounce') return 'heureuse';
    return 'contente';
  }

  /* état mémorisé */
  try { BW.active = (localStorage.getItem(KEY) === 'balle'); } catch (e) {}

  const btn = $('animBtn');
  if (btn) btn.addEventListener('click', toggle);
  refreshAnimBtn();

  window.tdmBalle = {
    get active(){ return BW.active; },
    set active(v){ BW.active = !!v; if (BW.active) BW.init = false; },
    draw: draw,
    toggle: toggle,
    mode: () => (BW.active ? 'balle' : 'tour'),
    humeur: humeur,
    info: () => ({
      active: BW.active, phase: BW.phase, lvl: BW.lvl, side: BW.side,
      humeur: humeur(),
      queue: BW.queue, tgt: BW.tgt, chute: BW.P,
      ecrasement: Math.round(BW.sq * 100) / 100,
      larmes: BW.tears.length,
      larmesBas: BW.tears.filter(t => t.vy <= 0).length,
      gerbe: BW.sparks.length, trainee: BW.trail.length,
      debris: BW.debris.length,
      rayon: Math.round(Math.min(25, Math.max(16,
        (typeof innerWidth === 'number' ? innerWidth : 800) * 0.025)))
    })
  };
})();
