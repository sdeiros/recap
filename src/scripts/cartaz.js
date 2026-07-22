/* ============================================================
   RUÍDO — motor de cartaz
   Canvas puro. Desenha cada layout na resolução final, então
   a prévia na tela É o arquivo que sai no download.
   ============================================================ */

export const INK = "#171418";
export const PAPER = "#F3EDE2";
export const PINK = "#FF4D6D";
export const COBALT = "#2F51FF";
export const GOLD = "#FFC531";

export const PERIODS = [
  { id: "7day", label: "Semana", days: 7, poster: "SEMANA", prev: "semana passada", recap: false },
  { id: "1month", label: "Mês", days: 30, poster: "MÊS", prev: "mês passado", recap: false },
  { id: "12month", label: "Ano", days: 365, poster: "ANO", prev: "ano passado", recap: true },
];

export const RESOLUTIONS = [
  { id: "story", label: "Stories / Status", w: 1080, h: 1920 },
  { id: "retrato", label: "Feed retrato", w: 1080, h: 1350 },
  { id: "feed", label: "Feed quadrado", w: 1080, h: 1080 },
];

export const LAYOUTS = [
  { id: "mixtape", label: "Mixtape", note: "grid + tipo condensado" },
  { id: "vidro", label: "Vidro", note: "gradiente e respiro" },
  { id: "lambe", label: "Lambe", note: "cartaz de rua" },
  { id: "xerox", label: "Xerox", note: "zine fotocopiado" },
  { id: "cupom", label: "Cupom", note: "papel amassado + mono" },
];

/* ---------- utilidades de texto ---------- */

function truncate(ctx, text, maxW) {
  if (ctx.measureText(text).width <= maxW) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + "…").width > maxW) t = t.slice(0, -1);
  return t + "…";
}

function fitText(ctx, text, maxW, startPx, family, weight = "") {
  let size = startPx;
  while (size > 14) {
    ctx.font = `${weight} ${size}px ${family}`.trim();
    if (ctx.measureText(text).width <= maxW) break;
    size -= 2;
  }
  return size;
}

/* encolhe até um piso; abaixo disso, corta */
function writeFit(ctx, text, x, y, maxW, startPx, minPx, family, weight = "") {
  let size = startPx;
  ctx.font = `${weight} ${size}px ${family}`.trim();
  while (size > minPx && ctx.measureText(text).width > maxW) {
    size -= 2;
    ctx.font = `${weight} ${size}px ${family}`.trim();
  }
  ctx.fillText(truncate(ctx, text, maxW), x, y);
  return size;
}

/* ---------- utilidades de forma ---------- */

function grain(ctx, W, H, alpha, density) {
  ctx.save();
  ctx.globalAlpha = alpha;
  for (let i = 0; i < density; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? "#fff" : "#000";
    ctx.fillRect(Math.random() * W, Math.random() * H, 2, 2);
  }
  ctx.restore();
}

function hazard(ctx, x, y, w, h, c1, c2) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.fillStyle = c1;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = c2;
  const step = h * 1.6;
  for (let i = -h * 2; i < w + h * 2; i += step * 2) {
    ctx.beginPath();
    ctx.moveTo(x + i, y + h);
    ctx.lineTo(x + i + h, y);
    ctx.lineTo(x + i + h + step, y);
    ctx.lineTo(x + i + step, y + h);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function dots(ctx, x, y, w, h, color, gap, r) {
  ctx.save();
  ctx.fillStyle = color;
  for (let py = y; py < y + h; py += gap) {
    for (let px = x + ((py / gap) % 2) * (gap / 2); px < x + w; px += gap) {
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* ---------- textos derivados dos dados ---------- */


/* tempo de escuta em formato legivel */
export function formatTempo(seg, curto) {
  seg = Math.max(0, Math.round(seg || 0));
  const d = Math.floor(seg / 86400);
  const h = Math.floor((seg % 86400) / 3600);
  const m = Math.floor((seg % 3600) / 60);
  if (d > 0) return curto ? `${d}d ${h}h` : `${d} ${d === 1 ? "dia" : "dias"} e ${h} ${h === 1 ? "hora" : "horas"}`;
  if (h > 0) return curto ? `${h}h ${m}min` : `${h} ${h === 1 ? "hora" : "horas"} e ${m} ${m === 1 ? "minuto" : "minutos"}`;
  return curto ? `${m}min` : `${m} minutos`;
}

function strings(data) {
  const p = PERIODS.find((x) => x.id === data.period) || PERIODS[0];
  const to = new Date();
  const from = new Date(Date.now() - (p.days - 1) * 24 * 3600 * 1000);
  const fd = (d) =>
    d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).toUpperCase().replace(".", "");
  const range = p.recap
    ? `${from.getFullYear()}${to.getFullYear() !== from.getFullYear() ? "–" + to.getFullYear() : ""}`
    : `${fd(from)} – ${fd(to)}`;
  const delta = data.prevCount > 0 ? Math.round(((data.count - data.prevCount) / data.prevCount) * 100) : null;
  return {
    p,
    range,
    count: (data.count || 0).toLocaleString("pt-BR"),
    delta,
    deltaTxt: delta === null ? "" : `${delta >= 0 ? "↑" : "↓"} ${Math.abs(delta)}% vs. ${p.prev}`,
    unique: (data.uniqueArtists || 0).toLocaleString("pt-BR"),
    album: (data.topAlbums || [])[0] || null,
    handle: `@${data.user.name}`,
    tempo: formatTempo(data.segundos, true),
    tempoLongo: formatTempo(data.segundos, false),
    temTempo: (data.segundos || 0) > 0,
    artists: (data.topArtists || []).slice(0, 5),
    tracks: (data.topTracks || []).slice(0, 5),
  };
}

/* ============================================================
   LAYOUT 1 — MIXTAPE (cor chapada, tipo condensado, grid)
   ============================================================ */
function drawMixtape(ctx, W, H, data) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.6;
  const square = H <= W * 1.05;
  const accent = st.p.recap ? GOLD : PINK;

  ctx.fillStyle = "#111111";
  ctx.fillRect(0, 0, W, H);

  const blockH = tall ? H * 0.38 : square ? H * 0.36 : H * 0.34;
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, W, blockH);

  const pad = 80 * s;
  const gap = 44 * s;
  const colW = (W - pad * 2 - gap) / 2;

  ctx.fillStyle = "#111111";
  ctx.font = `700 ${28 * s}px Archivo`;
  ctx.fillText(st.p.recap ? `RUÍDO / RECAP ${st.range}` : `RUÍDO / ${st.p.poster}`, pad, 110 * s);

  const numSize = fitText(ctx, st.count, W - pad * 2, tall ? 400 * s : 300 * s, "Anton");
  ctx.font = `${numSize}px Anton`;
  const numY = blockH - (tall ? 150 : 130) * s;
  ctx.fillText(st.count, pad, numY);

  ctx.font = `700 ${36 * s}px Archivo`;
  ctx.fillText("SCROBBLES", pad, numY + 58 * s);
  if (st.deltaTxt) {
    ctx.font = `600 ${28 * s}px Archivo`;
    ctx.fillText(st.deltaTxt.toUpperCase(), pad, numY + 100 * s);
  }
  if (st.temTempo) {
    ctx.font = `700 ${30 * s}px Archivo`;
    const t = `≈ ${st.tempo.toUpperCase()} DE MUSICA`;
    ctx.fillText(t, pad, numY + (st.deltaTxt ? 142 : 100) * s);
  }

  const colTop = blockH + (tall ? 96 : 76) * s;
  const rowH = tall ? 92 * s : square ? 74 * s : 82 * s;

  const column = (x, title, items, get) => {
    ctx.fillStyle = "#8A8A8A";
    ctx.font = `700 ${24 * s}px Archivo`;
    ctx.fillText(title, x, colTop);
    let y = colTop + (tall ? 76 : 62) * s;
    items.forEach((it, i) => {
      ctx.fillStyle = "#3A3A3A";
      ctx.font = `${30 * s}px Anton`;
      ctx.fillText(String(i + 1), x, y);
      ctx.fillStyle = i === 0 ? accent : "#FFFFFF";
      writeFit(ctx, get(it).toUpperCase(), x + 40 * s, y, colW - 40 * s, (tall ? 46 : 38) * s, 22 * s, "Anton");
      y += rowH;
    });
    return y;
  };

  const endL = column(pad, "TOP ARTISTAS", st.artists, (a) => a.name);
  const endR = column(pad + colW + gap, "TOP MÚSICAS", st.tracks, (t) => t.name);
  let y = Math.max(endL, endR);

  if (st.album) {
    y += (tall ? 26 : 14) * s;
    ctx.strokeStyle = "#2A2A2A";
    ctx.lineWidth = 2 * s;
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(W - pad, y);
    ctx.stroke();

    y += (tall ? 58 : 48) * s;
    ctx.fillStyle = "#8A8A8A";
    ctx.font = `700 ${24 * s}px Archivo`;
    ctx.fillText("ÁLBUM MAIS OUVIDO", pad, y);

    y += (tall ? 62 : 54) * s;
    ctx.fillStyle = accent;
    writeFit(ctx, st.album.name.toUpperCase(), pad, y, W - pad * 2, (tall ? 62 : 52) * s, 28 * s, "Anton");

    y += (tall ? 44 : 38) * s;
    ctx.fillStyle = "#8A8A8A";
    ctx.font = `600 ${26 * s}px Archivo`;
    ctx.fillText(truncate(ctx, st.album.artist, W - pad * 2), pad, y);
  }

  ctx.fillStyle = "#8A8A8A";
  ctx.font = `600 ${26 * s}px Archivo`;
  ctx.fillText(st.handle, pad, H - 60 * s);
  ctx.fillText(st.range, W - pad - ctx.measureText(st.range).width, H - 60 * s);

  grain(ctx, W, H, 0.05, Math.round(W * H * 0.0003));
}

/* ============================================================
   LAYOUT 2 — VIDRO (gradiente de malha, muito respiro)
   ============================================================ */
function drawVidro(ctx, W, H, data) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.6;
  const recap = st.p.recap;

  ctx.fillStyle = "#0B0B0F";
  ctx.fillRect(0, 0, W, H);

  const warm = [
    { x: W * 0.2, y: H * 0.16, r: W * 0.75, c: "#FF3B6B" },
    { x: W * 0.9, y: H * 0.3, r: W * 0.8, c: "#7B2BFF" },
    { x: W * 0.15, y: H * 0.7, r: W * 0.85, c: "#0A84FF" },
    { x: W * 0.85, y: H * 0.92, r: W * 0.6, c: "#FF9F0A" },
  ];
  const gold = [
    { x: W * 0.25, y: H * 0.14, r: W * 0.8, c: "#FFC531" },
    { x: W * 0.9, y: H * 0.36, r: W * 0.75, c: "#FF6A00" },
    { x: W * 0.1, y: H * 0.74, r: W * 0.85, c: "#C21E56" },
    { x: W * 0.8, y: H * 0.94, r: W * 0.6, c: "#5B2BFF" },
  ];
  (recap ? gold : warm).forEach((b) => {
    const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
    g.addColorStop(0, b.c);
    g.addColorStop(1, "rgba(11,11,15,0)");
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  });
  ctx.globalAlpha = 1;

  const veil = ctx.createLinearGradient(0, 0, 0, H);
  veil.addColorStop(0, "rgba(0,0,0,0.5)");
  veil.addColorStop(0.45, "rgba(0,0,0,0.28)");
  veil.addColorStop(1, "rgba(0,0,0,0.7)");
  ctx.fillStyle = veil;
  ctx.fillRect(0, 0, W, H);

  const pad = 88 * s;
  const F = "Inter, sans-serif";

  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.font = `500 ${28 * s}px ${F}`;
  ctx.fillText(recap ? `Seu ${st.range}` : st.p.id === "1month" ? "Seu mês" : "Sua semana", pad, 130 * s);

  ctx.fillStyle = "#FFFFFF";
  const numSize = fitText(ctx, st.count, W - pad * 2, tall ? 250 * s : 190 * s, F, "700");
  ctx.font = `700 ${numSize}px ${F}`;
  const numY = tall ? 330 * s : 290 * s;
  ctx.fillText(st.count, pad, numY);

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = `400 ${34 * s}px ${F}`;
  ctx.fillText("músicas ouvidas", pad, numY + 54 * s);
  if (st.deltaTxt) {
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = `400 ${28 * s}px ${F}`;
    ctx.fillText(st.deltaTxt, pad, numY + 98 * s);
  }
  if (st.temTempo) {
    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.font = `500 ${30 * s}px ${F}`;
    ctx.fillText(`≈ ${st.tempoLongo} de música`, pad, numY + (st.deltaTxt ? 142 : 98) * s);
  }

  const cardTop = numY + (tall ? 150 : 130) * s;
  const cardBottom = H - (tall ? 190 : 130) * s;
  ctx.save();
  roundRect(ctx, pad, cardTop, W - pad * 2, cardBottom - cardTop, 44 * s);
  ctx.fillStyle = "rgba(255,255,255,0.13)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 2 * s;
  ctx.stroke();
  ctx.restore();

  const cpad = pad + 44 * s;
  const gap = 36 * s;
  const colW = (W - cpad * 2 - gap) / 2;
  const rowH = tall ? 62 * s : 52 * s;
  const cy = cardTop + (tall ? 66 : 56) * s;

  const column = (x, title, items, get) => {
    ctx.fillStyle = "rgba(255,255,255,0.58)";
    ctx.font = `500 ${23 * s}px ${F}`;
    ctx.fillText(title, x, cy);
    let y = cy + (tall ? 56 : 48) * s;
    items.forEach((it, i) => {
      ctx.fillStyle = "rgba(255,255,255,0.42)";
      ctx.font = `500 ${26 * s}px ${F}`;
      ctx.fillText(`${i + 1}`, x, y);
      ctx.fillStyle = "#FFFFFF";
      writeFit(ctx, get(it), x + 34 * s, y, colW - 34 * s, (tall ? 32 : 28) * s, 19 * s, F, i === 0 ? "600" : "500");
      y += rowH;
    });
    return y;
  };

  const endL = column(cpad, "ARTISTAS", st.artists, (a) => a.name);
  const endR = column(cpad + colW + gap, "MÚSICAS", st.tracks, (t) => t.name);
  let y = Math.max(endL, endR) + (tall ? 22 : 14) * s;

  if (st.album) {
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 2 * s;
    ctx.beginPath();
    ctx.moveTo(cpad, y);
    ctx.lineTo(W - cpad, y);
    ctx.stroke();

    y += (tall ? 52 : 44) * s;
    ctx.fillStyle = "rgba(255,255,255,0.58)";
    ctx.font = `500 ${23 * s}px ${F}`;
    ctx.fillText("ÁLBUM", cpad, y);
    y += (tall ? 48 : 42) * s;
    ctx.fillStyle = "#FFFFFF";
    writeFit(ctx, st.album.name, cpad, y, W - cpad * 2, (tall ? 38 : 32) * s, 22 * s, F, "600");
    y += (tall ? 40 : 34) * s;
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = `400 ${27 * s}px ${F}`;
    ctx.fillText(truncate(ctx, st.album.artist, W - cpad * 2), cpad, y);
  }

  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = `400 ${26 * s}px ${F}`;
  ctx.fillText(st.handle, pad, H - 66 * s);
  ctx.fillText(st.range, W - pad - ctx.measureText(st.range).width, H - 66 * s);
}

/* ============================================================
   LAYOUT 3 — LAMBE (papel, fita zebrada, tinta chapada)
   ============================================================ */
function drawLambe(ctx, W, H, data) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.6;
  const accent = st.p.recap ? COBALT : PINK;

  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);
  const hz = 52 * s;
  hazard(ctx, 0, 0, W, hz, INK, accent);
  hazard(ctx, 0, H - hz, W, hz, INK, accent);

  const pad = 84 * s;
  const gap = 40 * s;
  const colW = (W - pad * 2 - gap) / 2;

  let y = hz + 108 * s;
  ctx.fillStyle = INK;
  ctx.font = `700 ${32 * s}px 'Space Grotesk'`;
  ctx.fillText(st.p.recap ? `RUÍDO · RECAP ${st.range}` : `RUÍDO · ${st.p.poster}`, pad, y);
  y += 34 * s;
  ctx.fillStyle = accent;
  ctx.fillRect(pad, y, 160 * s, 9 * s);

  y += tall ? 250 * s : 190 * s;
  ctx.fillStyle = INK;
  const nSize = fitText(ctx, st.count, W - pad * 2, (tall ? 300 : 220) * s, "Anton");
  ctx.font = `${nSize}px Anton`;
  ctx.fillText(st.count, pad, y);
  y += 66 * s;
  ctx.font = `${54 * s}px Anton`;
  ctx.fillText("SCROBBLES", pad, y);

  if (st.deltaTxt) {
    y += 74 * s;
    ctx.font = `700 ${28 * s}px 'Space Grotesk'`;
    const t = st.deltaTxt.toUpperCase();
    const tw = ctx.measureText(t).width;
    ctx.fillStyle = st.delta >= 0 ? COBALT : INK;
    ctx.fillRect(pad, y - 38 * s, tw + 44 * s, 56 * s);
    ctx.fillStyle = PAPER;
    ctx.fillText(t, pad + 22 * s, y);
  }

  y += (tall ? 96 : 76) * s;
  ctx.fillStyle = INK;
  ctx.fillRect(pad, y, W - pad * 2, 5 * s);

  const colTop = y + (tall ? 70 : 58) * s;
  const rowH = tall ? 78 * s : 64 * s;

  const column = (x, title, items, get) => {
    ctx.fillStyle = INK;
    ctx.font = `700 ${24 * s}px 'Space Grotesk'`;
    ctx.fillText(title, x, colTop);
    let yy = colTop + (tall ? 62 : 52) * s;
    items.forEach((it, i) => {
      ctx.fillStyle = "rgba(23,20,24,0.45)";
      ctx.font = `${28 * s}px Anton`;
      ctx.fillText(String(i + 1), x, yy);
      ctx.fillStyle = i === 0 ? accent : INK;
      writeFit(ctx, get(it).toUpperCase(), x + 38 * s, yy, colW - 38 * s, (tall ? 40 : 34) * s, 20 * s, "Anton");
      yy += rowH;
    });
    return yy;
  };

  const endL = column(pad, "ARTISTAS", st.artists, (a) => a.name);
  const endR = column(pad + colW + gap, "MÚSICAS", st.tracks, (t) => t.name);
  y = Math.max(endL, endR);

  if (st.album) {
    y += (tall ? 18 : 8) * s;
    const barH = (tall ? 130 : 110) * s;
    ctx.fillStyle = INK;
    ctx.fillRect(pad, y, W - pad * 2, barH);
    ctx.fillStyle = accent;
    ctx.font = `700 ${22 * s}px 'Space Grotesk'`;
    ctx.fillText("ÁLBUM MAIS OUVIDO", pad + 28 * s, y + 40 * s);
    ctx.fillStyle = PAPER;
    writeFit(
      ctx,
      st.album.name.toUpperCase(),
      pad + 28 * s,
      y + (tall ? 92 : 82) * s,
      W - pad * 2 - 56 * s,
      (tall ? 48 : 40) * s,
      22 * s,
      "Anton"
    );
  }

  ctx.fillStyle = INK;
  ctx.font = `700 ${25 * s}px 'Space Grotesk'`;
  ctx.fillText(st.handle.toUpperCase(), pad, H - hz - 44 * s);
  ctx.fillText(st.range, W - pad - ctx.measureText(st.range).width, H - hz - 44 * s);
}

/* ============================================================
   LAYOUT 4 — XEROX (retícula de meio-tom, zine)
   ============================================================ */
function drawXerox(ctx, W, H, data) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.6;
  const accent = st.p.recap ? GOLD : PINK;

  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, W, H);
  dots(ctx, 0, 0, W, H * 0.26, "rgba(243,237,226,0.14)", 26 * s, 4 * s);
  dots(ctx, 0, H * 0.74, W, H * 0.26, st.p.recap ? "rgba(255,197,49,0.2)" : "rgba(255,77,109,0.22)", 26 * s, 4 * s);

  const pad = 84 * s;
  const gap = 40 * s;
  const colW = (W - pad * 2 - gap) / 2;

  let y = 140 * s;
  ctx.fillStyle = PAPER;
  ctx.font = `700 ${30 * s}px 'Space Grotesk'`;
  ctx.fillText(st.p.recap ? `RUÍDO ///// RECAP ${st.range}` : `RUÍDO ///// ${st.p.poster}`, pad, y);

  y += tall ? 300 * s : 230 * s;
  const nS = fitText(ctx, st.count, W - pad * 2, (tall ? 340 : 240) * s, "Anton");
  ctx.font = `${nS}px Anton`;
  ctx.fillStyle = PAPER;
  ctx.fillText(st.count, pad, y);
  y += 72 * s;
  ctx.fillStyle = accent;
  ctx.font = `${54 * s}px Anton`;
  ctx.fillText(
    st.p.recap ? "SCROBBLES NO ANO" : st.p.id === "1month" ? "SCROBBLES NO MÊS" : "SCROBBLES NA SEMANA",
    pad,
    y
  );

  if (st.deltaTxt) {
    y += 66 * s;
    ctx.fillStyle = PAPER;
    ctx.font = `700 ${28 * s}px 'Space Grotesk'`;
    ctx.fillText(st.deltaTxt.toUpperCase(), pad, y);
  }

  y += (tall ? 90 : 70) * s;
  ctx.strokeStyle = PAPER;
  ctx.lineWidth = 4 * s;
  ctx.setLineDash([24 * s, 16 * s]);
  ctx.beginPath();
  ctx.moveTo(pad, y);
  ctx.lineTo(W - pad, y);
  ctx.stroke();
  ctx.setLineDash([]);

  const colTop = y + (tall ? 74 : 60) * s;
  const rowH = tall ? 76 * s : 62 * s;

  const column = (x, title, items, get) => {
    ctx.fillStyle = "rgba(243,237,226,0.6)";
    ctx.font = `700 ${24 * s}px 'Space Grotesk'`;
    ctx.fillText(title, x, colTop);
    let yy = colTop + (tall ? 62 : 52) * s;
    items.forEach((it, i) => {
      ctx.fillStyle = "rgba(243,237,226,0.4)";
      ctx.font = `${28 * s}px Anton`;
      ctx.fillText(String(i + 1), x, yy);
      ctx.fillStyle = i === 0 ? accent : PAPER;
      writeFit(ctx, get(it).toUpperCase(), x + 38 * s, yy, colW - 38 * s, (tall ? 40 : 34) * s, 20 * s, "Anton");
      yy += rowH;
    });
    return yy;
  };

  const endL = column(pad, "ARTISTAS", st.artists, (a) => a.name);
  const endR = column(pad + colW + gap, "MÚSICAS", st.tracks, (t) => t.name);
  y = Math.max(endL, endR) + (tall ? 20 : 10) * s;

  if (st.album) {
    ctx.strokeStyle = PAPER;
    ctx.lineWidth = 4 * s;
    ctx.setLineDash([24 * s, 16 * s]);
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(W - pad, y);
    ctx.stroke();
    ctx.setLineDash([]);

    y += (tall ? 60 : 50) * s;
    ctx.fillStyle = "rgba(243,237,226,0.6)";
    ctx.font = `700 ${24 * s}px 'Space Grotesk'`;
    ctx.fillText("ÁLBUM EM LOOP:", pad, y);
    y += (tall ? 58 : 50) * s;
    ctx.fillStyle = accent;
    writeFit(ctx, st.album.name.toUpperCase(), pad, y, W - pad * 2, (tall ? 54 : 44) * s, 24 * s, "Anton");
    y += (tall ? 42 : 36) * s;
    ctx.fillStyle = "rgba(243,237,226,0.7)";
    ctx.font = `500 ${28 * s}px 'Space Grotesk'`;
    ctx.fillText(truncate(ctx, st.album.artist, W - pad * 2), pad, y);
  }

  ctx.fillStyle = accent;
  ctx.font = `700 ${25 * s}px 'Space Grotesk'`;
  ctx.fillText(st.handle.toUpperCase(), pad, H - 62 * s);
  ctx.fillStyle = PAPER;
  ctx.fillText(st.range, W - pad - ctx.measureText(st.range).width, H - 62 * s);
}


/* ============================================================
   LAYOUT 5 — CUPOM
   Papel gerado proceduralmente: fibras, vincos de amassado,
   borda serrilhada e sombra. Tipografia monoespaçada.
   ============================================================ */

/* ruído de fibra do papel */
function fibras(ctx, x, y, w, h, s) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  const n = Math.round((w * h) / (900 / (s * s)));
  for (let i = 0; i < n; i++) {
    const px = x + Math.random() * w;
    const py = y + Math.random() * h;
    const escuro = Math.random() > 0.55;
    ctx.fillStyle = escuro ? "rgba(90,84,78,0.10)" : "rgba(255,255,255,0.55)";
    ctx.fillRect(px, py, 1.6 * s, 1.6 * s);
  }
  ctx.restore();
}

/* vincos: faixas diagonais claras e escuras, como papel que foi
   dobrado e reaberto. Determinístico o bastante pra não piscar. */
function vincos(ctx, x, y, w, h, s, semente) {
  let seed = semente || 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  for (let i = 0; i < 16; i++) {
    const vertical = rnd() > 0.45;
    const pos = vertical ? y + rnd() * h : x + rnd() * w;
    const desvio = (rnd() - 0.5) * 90 * s;
    const largura = (16 + rnd() * 70) * s;

    const g = vertical
      ? ctx.createLinearGradient(0, pos - largura, 0, pos + largura)
      : ctx.createLinearGradient(pos - largura, 0, pos + largura, 0);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(0.45, "rgba(120,112,104,0.13)");
    g.addColorStop(0.5, "rgba(255,255,255,0.5)");
    g.addColorStop(0.55, "rgba(120,112,104,0.13)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;

    ctx.beginPath();
    if (vertical) {
      ctx.moveTo(x, pos - largura);
      ctx.lineTo(x + w, pos - largura + desvio);
      ctx.lineTo(x + w, pos + largura + desvio);
      ctx.lineTo(x, pos + largura);
    } else {
      ctx.moveTo(pos - largura, y);
      ctx.lineTo(pos - largura + desvio, y + h);
      ctx.lineTo(pos + largura + desvio, y + h);
      ctx.lineTo(pos + largura, y);
    }
    ctx.closePath();
    ctx.fill();
  }

  /* sombreado de relevo nos cantos, dá volume ao amassado */
  [
    [x, y],
    [x + w, y],
    [x, y + h],
    [x + w, y + h],
  ].forEach(([cx, cy]) => {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.5);
    g.addColorStop(0, "rgba(120,112,104,0.16)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, h);
  });

  ctx.restore();
}

/* borda serrilhada de impressora térmica */
function serrilha(ctx, x, y, w, dente, paraCima) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  let sobe = true;
  for (let px = x; px < x + w; px += dente) {
    ctx.lineTo(px + dente / 2, y + (sobe ? (paraCima ? -dente : dente) : 0));
    sobe = !sobe;
  }
  ctx.lineTo(x + w, y);
}

function drawCupom(ctx, W, H, data) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.6;
  const M = "'Courier Prime', 'Courier New', monospace";

  /* superfície de fundo */
  ctx.fillStyle = "#2A2622";
  ctx.fillRect(0, 0, W, H);
  const vig = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.9);
  vig.addColorStop(0, "rgba(255,255,255,0.06)");
  vig.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  /* geometria do papel */
  const px = 96 * s;
  const pw = W - px * 2;
  const py = tall ? 120 * s : 70 * s;
  const ph = H - py * 2;
  const dente = 26 * s;

  /* sombra projetada */
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = 44 * s;
  ctx.shadowOffsetY = 18 * s;
  ctx.fillStyle = "#F7F5F0";
  ctx.beginPath();
  ctx.moveTo(px, py);
  serrilha(ctx, px, py, pw, dente, true);
  ctx.lineTo(px + pw, py + ph);
  serrilha(ctx, px + pw, py + ph, -pw, -dente, false);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  /* textura dentro do papel */
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(px, py);
  serrilha(ctx, px, py, pw, dente, true);
  ctx.lineTo(px + pw, py + ph);
  serrilha(ctx, px + pw, py + ph, -pw, -dente, false);
  ctx.closePath();
  ctx.clip();
  vincos(ctx, px, py, pw, ph, s, data.count || 7);
  fibras(ctx, px, py, pw, ph, s);
  ctx.restore();

  /* ---------- conteúdo ---------- */
  const pad = px + 54 * s;
  const inner = pw - 108 * s;
  const meio = px + pw / 2;
  const tinta = "#1D1A17";
  let y = py + (tall ? 118 : 96) * s;

  const linhaTracejada = () => {
    ctx.strokeStyle = "rgba(29,26,23,0.55)";
    ctx.lineWidth = 2 * s;
    ctx.setLineDash([10 * s, 9 * s]);
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(pad + inner, y);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  ctx.textAlign = "center";
  ctx.fillStyle = tinta;
  ctx.font = `700 ${(tall ? 76 : 62) * s}px ${M}`;
  ctx.fillText("R U Í D O", meio, y);
  y += (tall ? 46 : 40) * s;
  ctx.font = `400 ${25 * s}px ${M}`;
  ctx.fillText("CUPOM NAO FISCAL", meio, y);
  y += 34 * s;
  ctx.fillText(`${st.p.poster} · ${st.range}`, meio, y);
  y += 30 * s;
  ctx.fillText(st.handle.toUpperCase(), meio, y);
  ctx.textAlign = "left";

  y += (tall ? 46 : 38) * s;
  linhaTracejada();

  /* seção genérica de itens */
  const secao = (titulo, itens, nome, sub) => {
    y += (tall ? 52 : 44) * s;
    ctx.fillStyle = tinta;
    ctx.font = `700 ${26 * s}px ${M}`;
    ctx.fillText(titulo, pad, y);
    y += (tall ? 44 : 38) * s;

    itens.forEach((it, i) => {
      const qtd = String(it.playcount);
      ctx.font = `400 ${(tall ? 28 : 24) * s}px ${M}`;
      const larguraQtd = ctx.measureText(qtd).width;
      ctx.fillStyle = tinta;
      const rotulo = `${i + 1} ${nome(it)}`;
      writeFit(ctx, rotulo, pad, y, inner - larguraQtd - 24 * s, (tall ? 28 : 24) * s, 17 * s, M, "400");
      ctx.font = `400 ${(tall ? 28 : 24) * s}px ${M}`;
      ctx.fillText(qtd, pad + inner - ctx.measureText(qtd).width, y);

      if (sub && sub(it)) {
        y += (tall ? 30 : 26) * s;
        ctx.fillStyle = "rgba(29,26,23,0.6)";
        ctx.font = `400 ${(tall ? 22 : 19) * s}px ${M}`;
        ctx.fillText(truncate(ctx, "  " + sub(it).toUpperCase(), inner), pad, y);
      }
      y += (tall ? 40 : 34) * s;
    });
    y -= (tall ? 12 : 10) * s;
    linhaTracejada();
  };

  secao("ARTISTAS", st.artists, (a) => a.name, null);
  secao("MUSICAS", st.tracks, (t) => t.name, (t) => t.artist);

  if (st.album) {
    y += (tall ? 48 : 40) * s;
    ctx.fillStyle = tinta;
    ctx.font = `700 ${26 * s}px ${M}`;
    ctx.fillText("ALBUM", pad, y);
    y += (tall ? 40 : 34) * s;
    ctx.font = `400 ${(tall ? 28 : 24) * s}px ${M}`;
    writeFit(ctx, st.album.name, pad, y, inner, (tall ? 28 : 24) * s, 17 * s, M, "400");
    y += (tall ? 30 : 26) * s;
    ctx.fillStyle = "rgba(29,26,23,0.6)";
    ctx.font = `400 ${(tall ? 22 : 19) * s}px ${M}`;
    ctx.fillText(truncate(ctx, st.album.artist.toUpperCase(), inner), pad, y);
    y += (tall ? 26 : 22) * s;
    linhaTracejada();
  }

  /* total */
  y += (tall ? 62 : 52) * s;
  ctx.fillStyle = tinta;
  ctx.font = `700 ${(tall ? 34 : 29) * s}px ${M}`;
  ctx.fillText("TOTAL", pad, y);
  const total = st.count;
  ctx.font = `700 ${(tall ? 46 : 38) * s}px ${M}`;
  ctx.fillText(total, pad + inner - ctx.measureText(total).width, y);

  y += (tall ? 38 : 32) * s;
  ctx.font = `400 ${23 * s}px ${M}`;
  ctx.fillStyle = "rgba(29,26,23,0.7)";
  ctx.fillText("SCROBBLES", pad, y);
  if (st.deltaTxt) {
    const d = st.deltaTxt.toUpperCase();
    ctx.fillText(d, pad + inner - ctx.measureText(d).width, y);
  }

  if (st.temTempo) {
    y += (tall ? 42 : 36) * s;
    ctx.fillStyle = tinta;
    ctx.font = `700 ${(tall ? 30 : 26) * s}px ${M}`;
    ctx.fillText("TEMPO", pad, y);
    const tp = st.tempo.toUpperCase();
    ctx.fillText(tp, pad + inner - ctx.measureText(tp).width, y);
  }

  /* código de barras */
  y += (tall ? 64 : 52) * s;
  const alturaBarra = (tall ? 88 : 70) * s;
  let bx = pad;
  let seed = (data.count || 7) * 31 + 17;
  ctx.fillStyle = tinta;
  while (bx < pad + inner - 4 * s) {
    seed = (seed * 9301 + 49297) % 233280;
    const bw = 2.5 * s + (seed / 233280) * 8 * s;
    ctx.fillRect(bx, y, bw, alturaBarra);
    bx += bw + (3 + (seed % 5)) * s;
  }
  y += alturaBarra + 34 * s;
  ctx.textAlign = "center";
  ctx.font = `400 ${22 * s}px ${M}`;
  ctx.fillStyle = "rgba(29,26,23,0.75)";
  ctx.fillText("OBRIGADO PELA PREFERENCIA", meio, y);
  y += 30 * s;
  ctx.fillText("VOLTE SEMPRE", meio, y);
  ctx.textAlign = "left";
}

const DRAWERS = { mixtape: drawMixtape, vidro: drawVidro, lambe: drawLambe, xerox: drawXerox, cupom: drawCupom };

/* ---------- API pública do módulo ---------- */

export async function ensureFonts() {
  try {
    await Promise.all([
      document.fonts.load("100px Anton"),
      document.fonts.load("700 20px Archivo"),
      document.fonts.load("600 20px Archivo"),
      document.fonts.load("700 20px Inter"),
      document.fonts.load("600 20px Inter"),
      document.fonts.load("500 20px Inter"),
      document.fonts.load("400 20px Inter"),
      document.fonts.load("700 20px 'Space Grotesk'"),
      document.fonts.load("500 20px 'Space Grotesk'"),
      document.fonts.load("400 20px 'Courier Prime'"),
      document.fonts.load("700 20px 'Courier Prime'"),
    ]);
  } catch (_) {
    /* segue mesmo se alguma fonte falhar */
  }
}

export function render(canvas, layoutId, resId, data) {
  const res = RESOLUTIONS.find((r) => r.id === resId) || RESOLUTIONS[0];
  canvas.width = res.w;
  canvas.height = res.h;
  const ctx = canvas.getContext("2d");
  ctx.textBaseline = "alphabetic";
  (DRAWERS[layoutId] || drawMixtape)(ctx, res.w, res.h, data);
  return res;
}

export function download(canvas, layoutId, resId, periodId) {
  const res = RESOLUTIONS.find((r) => r.id === resId) || RESOLUTIONS[0];
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = `ruido-${periodId}-${layoutId}-${res.w}x${res.h}.png`;
  a.click();
}
