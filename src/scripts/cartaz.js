/* ============================================================
   RUÍDO — motor de cartaz
   Canvas puro. Desenha cada layout na resolução final, então
   a prévia na tela É o arquivo que sai no download.
   ============================================================ */

/* ---------- paleta FAIXA ---------- */
export const INK = "#0D0D0F";      /* preto de tinta */
export const PAPER = "#EFEAE1";    /* osso */
export const PINK = "#FF4A1C";     /* sinal — laranja de impressão */
export const COBALT = "#1E2BFF";   /* contraponto elétrico */
export const GOLD = "#F5C518";     /* recap do ano */

export const PERIODS = [
  { id: "semana", label: "Semana", prev: "semana anterior", recap: false, maxOffset: 0 },
  { id: "mes", label: "Mês", prev: "mês anterior", recap: false, maxOffset: 11 },
  { id: "ano", label: "Ano", prev: "ano anterior", recap: true, maxOffset: 1 },
];

const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

const seg = (d) => Math.floor(d.getTime() / 1000);

/* Janela de tempo de um período.
   Semana é deslizante; mês e ano são de calendário, e o deslocamento
   anda para trás (0 = atual, 1 = anterior, e assim por diante). */
export function janela(periodoId, offset = 0) {
  const agora = new Date();

  if (periodoId === "mes") {
    const ini = new Date(agora.getFullYear(), agora.getMonth() - offset, 1, 0, 0, 0);
    const fimMes = new Date(ini.getFullYear(), ini.getMonth() + 1, 1, 0, 0, 0);
    const fim = offset === 0 ? agora : fimMes;
    const antIni = new Date(ini.getFullYear(), ini.getMonth() - 1, 1, 0, 0, 0);
    const nome = MESES[ini.getMonth()];
    return {
      from: seg(ini),
      to: seg(fim),
      antFrom: seg(antIni),
      antTo: seg(ini),
      poster: nome.toUpperCase(),
      rotulo: `${nome.toUpperCase()} ${ini.getFullYear()}`,
      curto: `${nome} de ${ini.getFullYear()}`,
      emAndamento: offset === 0,
    };
  }

  if (periodoId === "ano") {
    const ano = agora.getFullYear() - offset;
    const ini = new Date(ano, 0, 1, 0, 0, 0);
    const fim = offset === 0 ? agora : new Date(ano + 1, 0, 1, 0, 0, 0);
    return {
      from: seg(ini),
      to: seg(fim),
      antFrom: seg(new Date(ano - 1, 0, 1, 0, 0, 0)),
      antTo: seg(ini),
      poster: String(ano),
      rotulo: String(ano),
      curto: String(ano),
      emAndamento: offset === 0,
    };
  }

  /* semana: últimos 7 dias */
  const fim = agora;
  const ini = new Date(agora.getTime() - 7 * 864e5);
  const f = (d) =>
    d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).toUpperCase().replace(".", "");
  return {
    from: seg(ini),
    to: seg(fim),
    antFrom: seg(new Date(agora.getTime() - 14 * 864e5)),
    antTo: seg(ini),
    poster: "SEMANA",
    rotulo: `${f(ini)} – ${f(fim)}`,
    curto: "últimos 7 dias",
    emAndamento: true,
  };
}

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
  { id: "mosaico", label: "Mosaico", note: "grade de capas" },
  { id: "capa", label: "Capa", note: "pôster de disco" },
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

function tracking(ctx, px) {
  try {
    ctx.letterSpacing = `${px}px`;
  } catch (_) {
    /* navegador antigo: segue sem tracking */
  }
}

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
  const base = PERIODS.find((x) => x.id === data.period) || PERIODS[0];
  /* a janela vem pronta da camada de dados; o fallback é só defesa */
  const j = data.janela || janela(base.id, data.offset || 0);
  const p = { ...base, poster: j.poster };
  const range = j.rotulo;
  const delta = data.prevCount > 0 ? Math.round(((data.count - data.prevCount) / data.prevCount) * 100) : null;
  return {
    p,
    range,
    count: (data.count || 0).toLocaleString("pt-BR"),
    delta,
    deltaTxt: delta === null ? "" : `${delta >= 0 ? "↑" : "↓"} ${Math.abs(delta)}% vs. ${p.prev}`,
    unique: (data.uniqueArtists || 0).toLocaleString("pt-BR"),
    album: (data.topAlbums || [])[0] || null,
    emAndamento: j.emAndamento,
    curto: j.curto,
    vazio: (data.count || 0) === 0 && (data.topArtists || []).length === 0,
    handle: (data.assinatura ?? "").trim()
      ? data.assinatura.trim()
      : data.mostrarHandle
        ? `@${data.user.name}`
        : "",
    tempo: formatTempo(data.segundos, true),
    tempoLongo: formatTempo(data.segundos, false),
    temTempo: (data.segundos || 0) > 0,
    artists: (data.topArtists || []).slice(0, 5),
    tracks: (data.topTracks || []).slice(0, 5),
    /* linha de apoio de cada item: resolve "de quem e" e "quanto tempo" */
    metaArtista: (a) => {
      const seg = (a.playcount || 0) * (data.mediaDur || 210);
      return `${a.playcount} ${a.playcount === 1 ? "PLAY" : "PLAYS"} · ${formatTempo(seg, true).toUpperCase()}`;
    },
    metaFaixa: (t) => {
      const dur = t.duration > 0 ? t.duration : data.mediaDur || 210;
      const seg = (t.playcount || 0) * dur;
      const nome = (t.artist || "").toUpperCase();
      return nome ? `${nome} · ${formatTempo(seg, true).toUpperCase()}` : formatTempo(seg, true).toUpperCase();
    },
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

  const FUNDO = "#0E0E10";
  const CLARO = "#FFFFFF";
  const MEIO = "#8C8C93";
  const FRACO = "#4A4A52";
  const RULE = "#24242A";

  ctx.fillStyle = FUNDO;
  ctx.fillRect(0, 0, W, H);

  const pad = 78 * s;
  const gap = 44 * s;
  const colW = (W - pad * 2 - gap) / 2;

  /* ---------- topo: capa, ou bloco de cor como plano B ---------- */
  const alturaBanda = tall ? H * 0.3 : square ? H * 0.26 : H * 0.28;
  const capa = (data.topAlbums || [])[0];
  let y = bandaTopo(ctx, W, H, data, alturaBanda, FUNDO);

  /* no recap o ano toma a banda: é o assunto do cartaz */
  if (y && st.p.recap) {
    ctx.fillStyle = "rgba(14,14,16,0.5)";
    ctx.fillRect(0, 0, W, alturaBanda);
    ctx.save();
    ctx.textAlign = "center";
    const tam = fitText(ctx, st.range, W - pad * 2, alturaBanda * 0.86, "Anton");
    ctx.font = `${tam}px Anton`;
    ctx.lineWidth = 6 * s;
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.strokeText(st.range, W / 2, alturaBanda * 0.74);
    ctx.fillStyle = accent;
    ctx.fillText(st.range, W / 2, alturaBanda * 0.74);
    ctx.restore();
    ctx.textAlign = "left";
  }

  if (!y) {
    /* sem capa: bloco de cor chapada, com o período como título */
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, W, alturaBanda);

    ctx.fillStyle = FUNDO;
    tracking(ctx, 5 * s);
    ctx.font = `700 ${24 * s}px Archivo`;
    ctx.fillText("FAIXA", pad, 92 * s);
    tracking(ctx, 0);

    const titulo = st.p.recap ? `RECAP ${st.range}` : st.p.poster;
    writeFit(ctx, titulo, pad, alturaBanda - 62 * s, W - pad * 2, alturaBanda * 0.4, 40 * s, "Anton");
    y = alturaBanda;
  }

  /* ---------- cabeçalho ---------- */
  y += (tall ? 62 : 50) * s;
  ctx.fillStyle = MEIO;
  tracking(ctx, 3 * s);
  ctx.font = `700 ${22 * s}px Archivo`;
  ctx.fillText("FAIXA", pad, y);
  const dir = st.range;
  ctx.fillText(dir, W - pad - ctx.measureText(dir).width, y);
  tracking(ctx, 0);

  /* ---------- título: o número é o título ---------- */
  y += (tall ? 166 : 130) * s;
  ctx.fillStyle = CLARO;
  const numSize = fitText(ctx, st.count, W * 0.42, (tall ? 150 : 118) * s, "Anton");
  ctx.font = `${numSize}px Anton`;
  ctx.fillText(st.count, pad, y);
  const wNum = ctx.measureText(st.count).width;

  ctx.fillStyle = accent;
  ctx.font = `700 ${(tall ? 40 : 32) * s}px Archivo`;
  ctx.fillText("SCROBBLES", pad + wNum + 20 * s, y);

  if (st.deltaTxt) {
    ctx.fillStyle = MEIO;
    ctx.font = `500 ${23 * s}px Archivo`;
    ctx.fillText(st.deltaTxt.toUpperCase(), pad + wNum + 20 * s, y - (tall ? 46 : 38) * s);
  }

  /* ---------- período sem escuta ---------- */
  if (st.vazio) {
    const my = y + (tall ? 150 : 110) * s;
    ctx.fillStyle = CLARO;
    writeFit(ctx, "NADA TOCADO", pad, my, W - pad * 2, (tall ? 92 : 72) * s, 34 * s, "Anton");
    ctx.fillStyle = MEIO;
    ctx.font = `500 ${(tall ? 28 : 24) * s}px Archivo`;
    ctx.fillText(`Nenhum scrobble em ${st.curto}.`, pad, my + (tall ? 56 : 46) * s);

    ctx.fillStyle = MEIO;
    tracking(ctx, 2 * s);
    ctx.font = `600 ${21 * s}px Archivo`;
    if (st.handle) ctx.fillText(truncate(ctx, st.handle, W * 0.6), pad, H - 52 * s);
    const m0 = st.p.recap ? `RECAP ${st.range}` : st.p.poster;
    ctx.fillText(m0, W - pad - ctx.measureText(m0).width, H - 52 * s);
    tracking(ctx, 0);
    grain(ctx, W, H, 0.04, Math.round(W * H * 0.00024));
    return;
  }

  /* ---------- duas colunas ---------- */
  const colTop = y + (tall ? 86 : 68) * s;
  const rowH = tall ? 108 * s : square ? 84 * s : 96 * s;
  const nomeMax = tall ? 42 * s : 35 * s;
  const nomeMin = tall ? 24 * s : 20 * s;
  const metaPx = tall ? 20 * s : 17 * s;
  const recuo = 36 * s;

  const coluna = (x, titulo, itens, nome, meta) => {
    ctx.fillStyle = CLARO;
    ctx.font = `700 ${(tall ? 26 : 22) * s}px Archivo`;
    ctx.fillText(titulo, x, colTop);
    ctx.fillStyle = RULE;
    ctx.fillRect(x, colTop + 18 * s, colW, 2 * s);

    let yy = colTop + (tall ? 84 : 68) * s;
    itens.forEach((it, i) => {
      ctx.fillStyle = i === 0 ? accent : FRACO;
      ctx.font = `700 ${20 * s}px Archivo`;
      ctx.fillText(String(i + 1), x, yy);
      ctx.fillStyle = i === 0 ? accent : CLARO;
      writeFit(ctx, nome(it).toUpperCase(), x + recuo, yy, colW - recuo, nomeMax, nomeMin, "Anton");
      ctx.fillStyle = MEIO;
      ctx.font = `500 ${metaPx}px Archivo`;
      ctx.fillText(truncate(ctx, meta(it), colW - recuo), x + recuo, yy + (tall ? 34 : 28) * s);
      yy += rowH;
    });
    return yy;
  };

  const fimL = coluna(pad, "ARTISTAS FAVORITOS", st.artists, (a) => a.name, st.metaArtista);
  const fimR = coluna(pad + colW + gap, "MÚSICAS FAVORITAS", st.tracks, (t) => t.name, st.metaFaixa);

  ctx.fillStyle = RULE;
  ctx.fillRect(pad + colW + gap / 2 - s, colTop + 36 * s, 2 * s, Math.max(fimL, fimR) - colTop - 94 * s);

  /* ---------- destaque final ---------- */
  const fy = H - 52 * s;
  let dy = Math.max(fimL, fimR) + (tall ? 34 : 22) * s;
  const limite = fy - (tall ? 150 : 120) * s;
  if (dy < limite) dy = limite;

  ctx.fillStyle = RULE;
  ctx.fillRect(pad, dy - (tall ? 52 : 42) * s, W - pad * 2, 2 * s);

  if (st.p.recap && st.temTempo) {
    /* recap fecha com dois números, não um */
    const meia = (W - pad * 2) / 2;
    [
      ["TEMPO OUVINDO", st.tempoLongo],
      ["ARTISTAS DIFERENTES", st.unique],
    ].forEach(([rot, val], i) => {
      const x = pad + meia * i;
      ctx.fillStyle = CLARO;
      ctx.font = `700 ${(tall ? 26 : 22) * s}px Archivo`;
      ctx.fillText(rot, x, dy);
      ctx.fillStyle = accent;
      writeFit(ctx, val, x, dy + (tall ? 68 : 56) * s, meia - 20 * s, (tall ? 62 : 50) * s, 26 * s, "Anton");
    });
  } else {
    ctx.fillStyle = CLARO;
    ctx.font = `700 ${(tall ? 30 : 25) * s}px Archivo`;
    ctx.fillText(st.temTempo ? "TEMPO OUVINDO" : "ÁLBUM DO PERÍODO", pad, dy);

    dy += (tall ? 74 : 60) * s;
    ctx.fillStyle = accent;
    if (st.temTempo) {
      writeFit(ctx, st.tempoLongo, pad, dy, W - pad * 2, (tall ? 76 : 60) * s, 30 * s, "Anton");
    } else if (capa) {
      writeFit(ctx, capa.name.toUpperCase(), pad, dy, W - pad * 2, (tall ? 66 : 54) * s, 28 * s, "Anton");
    }
  }

  /* ---------- rodapé ---------- */
  ctx.fillStyle = MEIO;
  tracking(ctx, 2 * s);
  ctx.font = `600 ${21 * s}px Archivo`;
  if (st.handle) ctx.fillText(truncate(ctx, st.handle, (W - pad * 2) * 0.6), pad, fy);
  const marca = st.p.recap ? `RECAP ${st.range}` : st.p.poster;
  ctx.fillText(marca, W - pad - ctx.measureText(marca).width, fy);
  tracking(ctx, 0);

  grain(ctx, W, H, 0.04, Math.round(W * H * 0.00024));
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

  /* banda de capa no topo, dissolvendo no gradiente */
  const banda = bandaTopo(ctx, W, H, data, (tall ? 0.28 : 0.24) * H, "rgba(11,11,15,1)");

  let topo = banda ? banda + (tall ? 56 : 44) * s : 130 * s;

  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.font = `500 ${28 * s}px ${F}`;
  ctx.fillText(recap ? `Seu ${st.range}` : st.p.id === "1month" ? "Seu mês" : "Sua semana", pad, topo);

  ctx.fillStyle = "#FFFFFF";
  const numSize = fitText(ctx, st.count, W - pad * 2, tall ? 210 * s : 170 * s, F, "700");
  ctx.font = `700 ${numSize}px ${F}`;
  const numY = topo + (tall ? 180 : 140) * s;
  ctx.fillText(st.count, pad, numY);

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = `400 ${34 * s}px ${F}`;
  ctx.fillText("músicas ouvidas", pad, numY + 50 * s);
  if (st.deltaTxt) {
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = `400 ${26 * s}px ${F}`;
    ctx.fillText(st.deltaTxt, pad, numY + 90 * s);
  }
  if (st.temTempo) {
    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.font = `500 ${30 * s}px ${F}`;
    ctx.fillText(`≈ ${st.tempoLongo} de música`, pad, numY + (st.deltaTxt ? 142 : 98) * s);
  }

  const cardTop = numY + (tall ? 140 : 120) * s;
  const cardBottom = H - (tall ? 250 : 170) * s;
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
  const rowH = tall ? 88 * s : 74 * s;
  const cy = cardTop + (tall ? 60 : 52) * s;

  const column = (x, title, items, get, meta) => {
    ctx.fillStyle = "rgba(255,255,255,0.58)";
    ctx.font = `500 ${23 * s}px ${F}`;
    ctx.fillText(title, x, cy);
    let y = cy + (tall ? 62 : 52) * s;
    items.forEach((it, i) => {
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = `500 ${24 * s}px ${F}`;
      ctx.fillText(`${i + 1}`, x, y);
      ctx.fillStyle = "#FFFFFF";
      writeFit(ctx, get(it), x + 32 * s, y, colW - 32 * s, (tall ? 30 : 26) * s, 18 * s, F, i === 0 ? "600" : "500");
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = `400 ${(tall ? 20 : 18) * s}px ${F}`;
      ctx.fillText(truncate(ctx, meta(it), colW - 32 * s), x + 32 * s, y + (tall ? 30 : 26) * s);
      y += rowH;
    });
    return y;
  };

  const endL = column(cpad, "ARTISTAS", st.artists, (a) => a.name, st.metaArtista);
  const endR = column(cpad + colW + gap, "MÚSICAS", st.tracks, (t) => t.name, st.metaFaixa);
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

  /* banda de capa colada no alto, como recorte de revista */
  let banda = 0;
  const capL = capaDe(data.artistImage) || capaDe((data.topAlbums || [])[0]?.capa);
  if (capL) {
    const aB = (tall ? 0.24 : 0.2) * H;
    ctx.save();
    ctx.beginPath();
    ctx.rect(pad, hz + 26 * s, W - pad * 2, aB);
    ctx.clip();
    ctx.filter = "grayscale(0.35) contrast(1.15)";
    const e = Math.max((W - pad * 2) / capL.width, aB / capL.height);
    ctx.drawImage(
      capL,
      pad + (W - pad * 2 - capL.width * e) / 2,
      hz + 26 * s + (aB - capL.height * e) * 0.36,
      capL.width * e,
      capL.height * e
    );
    ctx.filter = "none";
    ctx.restore();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 5 * s;
    ctx.strokeRect(pad, hz + 26 * s, W - pad * 2, aB);
    banda = hz + 26 * s + aB;
  }

  let y = (banda || hz) + (banda ? 76 : 108) * s;
  ctx.fillStyle = INK;
  ctx.font = `700 ${32 * s}px 'Space Grotesk'`;
  ctx.fillText(st.p.recap ? `FAIXA · RECAP ${st.range}` : `FAIXA · ${st.p.poster}`, pad, y);
  y += 34 * s;
  ctx.fillStyle = accent;
  ctx.fillRect(pad, y, 160 * s, 9 * s);

  y += banda ? (tall ? 170 : 130) * s : (tall ? 250 : 190) * s;
  ctx.fillStyle = INK;
  const nSize = fitText(ctx, st.count, W - pad * 2, (tall ? (banda ? 230 : 300) : 220) * s, "Anton");
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
  const rowH = tall ? 100 * s : 82 * s;

  const column = (x, title, items, get, meta) => {
    ctx.fillStyle = INK;
    ctx.font = `700 ${24 * s}px 'Space Grotesk'`;
    ctx.fillText(title, x, colTop);
    let yy = colTop + (tall ? 66 : 54) * s;
    items.forEach((it, i) => {
      ctx.fillStyle = "rgba(23,20,24,0.45)";
      ctx.font = `${26 * s}px Anton`;
      ctx.fillText(String(i + 1), x, yy);
      ctx.fillStyle = i === 0 ? accent : INK;
      writeFit(ctx, get(it).toUpperCase(), x + 36 * s, yy, colW - 36 * s, (tall ? 38 : 32) * s, 19 * s, "Anton");
      ctx.fillStyle = "rgba(23,20,24,0.55)";
      ctx.font = `500 ${(tall ? 19 : 17) * s}px 'Space Grotesk'`;
      ctx.fillText(truncate(ctx, meta(it), colW - 36 * s), x + 36 * s, yy + (tall ? 28 : 24) * s);
      yy += rowH;
    });
    return yy;
  };

  const endL = column(pad, "ARTISTAS", st.artists, (a) => a.name, st.metaArtista);
  const endR = column(pad + colW + gap, "MÚSICAS", st.tracks, (t) => t.name, st.metaFaixa);
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

  const pad = 84 * s;
  const gap = 40 * s;
  const colW = (W - pad * 2 - gap) / 2;

  /* banda de capa dessaturada, como foto de fotocópia */
  const alturaB = (tall ? 0.26 : 0.22) * H;
  let banda = 0;
  const cap = capaDe(data.artistImage) || capaDe((data.topAlbums || [])[0]?.capa);
  if (cap) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, W, alturaB);
    ctx.clip();
    ctx.filter = "grayscale(1) contrast(1.7) brightness(0.85)";
    const e = Math.max(W / cap.width, alturaB / cap.height);
    ctx.drawImage(cap, (W - cap.width * e) / 2, (alturaB - cap.height * e) * 0.38, cap.width * e, cap.height * e);
    ctx.filter = "none";
    dots(ctx, 0, 0, W, alturaB, "rgba(13,13,15,0.5)", 9 * s, 2.4 * s);
    const g = ctx.createLinearGradient(0, alturaB * 0.5, 0, alturaB);
    g.addColorStop(0, "rgba(13,13,15,0)");
    g.addColorStop(1, INK);
    ctx.fillStyle = g;
    ctx.fillRect(0, alturaB * 0.5, W, alturaB * 0.5);
    ctx.restore();
    banda = alturaB;
  }

  dots(ctx, 0, banda, W, H * 0.2, "rgba(239,234,225,0.12)", 26 * s, 4 * s);
  dots(ctx, 0, H * 0.76, W, H * 0.24, st.p.recap ? "rgba(245,197,24,0.18)" : "rgba(255,74,28,0.2)", 26 * s, 4 * s);

  let y = banda ? banda + 78 * s : 140 * s;
  ctx.fillStyle = PAPER;
  ctx.font = `700 ${30 * s}px 'Space Grotesk'`;
  ctx.fillText(st.p.recap ? `FAIXA ///// RECAP ${st.range}` : `FAIXA ///// ${st.p.poster}`, pad, y);

  y += banda ? (tall ? 200 : 150) * s : (tall ? 300 : 230) * s;
  const nS = fitText(ctx, st.count, W - pad * 2, (tall ? (banda ? 260 : 340) : 240) * s, "Anton");
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
  const rowH = tall ? 98 * s : 80 * s;

  const column = (x, title, items, get, meta) => {
    ctx.fillStyle = "rgba(243,237,226,0.6)";
    ctx.font = `700 ${24 * s}px 'Space Grotesk'`;
    ctx.fillText(title, x, colTop);
    let yy = colTop + (tall ? 66 : 54) * s;
    items.forEach((it, i) => {
      ctx.fillStyle = "rgba(243,237,226,0.4)";
      ctx.font = `${26 * s}px Anton`;
      ctx.fillText(String(i + 1), x, yy);
      ctx.fillStyle = i === 0 ? accent : PAPER;
      writeFit(ctx, get(it).toUpperCase(), x + 36 * s, yy, colW - 36 * s, (tall ? 38 : 32) * s, 19 * s, "Anton");
      ctx.fillStyle = "rgba(243,237,226,0.55)";
      ctx.font = `500 ${(tall ? 19 : 17) * s}px 'Space Grotesk'`;
      ctx.fillText(truncate(ctx, meta(it), colW - 36 * s), x + 36 * s, yy + (tall ? 28 : 24) * s);
      yy += rowH;
    });
    return yy;
  };

  const endL = column(pad, "ARTISTAS", st.artists, (a) => a.name, st.metaArtista);
  const endR = column(pad + colW + gap, "MÚSICAS", st.tracks, (t) => t.name, st.metaFaixa);
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
   Papel de verdade: textura fotográfica recortada no formato
   do cupom, com serrilha de impressora térmica.
   ============================================================ */

/* ---------- capas de álbum ---------- */
const capasCache = new Map();
let usarProxy = null;

async function temProxy() {
  if (usarProxy !== null) return usarProxy;
  try {
    const r = await fetch("/api/capa?u=ping");
    const j = r.ok ? await r.json().catch(() => null) : null;
    usarProxy = j?.ok === true;
  } catch (_) {
    usarProxy = false;
  }
  return usarProxy;
}

function carregarImagem(src, comCors) {
  return new Promise((resolve) => {
    const im = new Image();
    if (comCors) im.crossOrigin = "anonymous";
    im.onload = () => resolve(im);
    im.onerror = () => resolve(null);
    im.src = src;
  });
}

/* Baixa as capas antes de desenhar. Pelo proxy quando existe (garante
   que o download do PNG continue funcionando); senão tenta CORS direto. */
export async function precarregarCapas(dados) {
  const urls = [
    ...(dados?.topAlbums || []).map((a) => a.capa),
    dados?.artistImage,
  ].filter(Boolean);
  if (!urls.length) return;
  const proxy = await temProxy();
  await Promise.all(
    urls.map(async (u) => {
      if (capasCache.has(u)) return;
      const im = proxy
        ? await carregarImagem(`/api/capa?u=${encodeURIComponent(u)}`, false)
        : await carregarImagem(u, true);
      capasCache.set(u, im);
    })
  );
}

export const capaDe = (url) => (url ? capasCache.get(url) || null : null);

let papelImg = null;

export function carregarPapel(src = "/papel.jpg") {
  if (papelImg) return Promise.resolve(papelImg);
  return new Promise((resolve) => {
    const im = new Image();
    im.onload = () => {
      papelImg = im;
      resolve(im);
    };
    im.onerror = () => resolve(null);
    im.src = src;
  });
}

/* capa quadrada; sem imagem, cai num marcador com a inicial */
function desenharCapa(ctx, album, x, y, lado, corFundo, corTexto, fonte) {
  const im = capaDe(album?.capa);
  if (im) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, lado, lado);
    ctx.clip();
    const escala = Math.max(lado / im.width, lado / im.height);
    const dw = im.width * escala;
    const dh = im.height * escala;
    ctx.drawImage(im, x + (lado - dw) / 2, y + (lado - dh) / 2, dw, dh);
    ctx.restore();
  } else {
    ctx.fillStyle = corFundo;
    ctx.fillRect(x, y, lado, lado);
    ctx.fillStyle = corTexto;
    ctx.textAlign = "center";
    ctx.font = `${lado * 0.42}px ${fonte}`;
    ctx.fillText((album?.name || "?").charAt(0).toUpperCase(), x + lado / 2, y + lado * 0.66);
    ctx.textAlign = "left";
  }
  /* fio de contorno dá acabamento */
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = Math.max(1, lado * 0.006);
  ctx.strokeRect(x, y, lado, lado);
}

/* Banda de imagem no topo, dissolvendo na cor de fundo do layout.
   Recebe dados e escolhe a imagem: foto do artista nº1 primeiro,
   capa do álbum nº1 como reserva. Devolve a altura ocupada, 0 se
   não houver imagem nenhuma. */
function bandaTopo(ctx, W, H, data, altura, corFundo) {
  const im = capaDe(data?.artistImage) || capaDe((data?.topAlbums || [])[0]?.capa);
  if (!im) return 0;

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, W, altura);
  ctx.clip();
  const escala = Math.max(W / im.width, altura / im.height);
  const dw = im.width * escala;
  const dh = im.height * escala;
  /* enquadra um pouco acima do centro: capas costumam ter o assunto em cima */
  ctx.drawImage(im, (W - dw) / 2, (altura - dh) * 0.38, dw, dh);
  ctx.restore();

  /* dissolvência para o fundo */
  const g = ctx.createLinearGradient(0, altura * 0.55, 0, altura);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, corFundo);
  ctx.fillStyle = g;
  ctx.fillRect(0, altura * 0.55, W, altura * 0.45);

  return altura;
}

/* desenha a imagem cobrindo a área, sem distorcer */
function cobrir(ctx, img, x, y, w, h) {
  const escala = Math.max(w / img.width, h / img.height);
  const dw = img.width * escala;
  const dh = img.height * escala;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

/* borda serrilhada: só acrescenta segmentos ao caminho atual.
   NÃO chama beginPath — quem monta o caminho é a função de fora. */
function serrilha(ctx, x, y, w, dente, paraCima) {
  const passo = w > 0 ? dente : -dente;
  const altura = paraCima ? -Math.abs(dente) : Math.abs(dente);
  let sobe = true;
  const fim = x + w;
  let px = x;
  while ((w > 0 && px < fim) || (w < 0 && px > fim)) {
    ctx.lineTo(px + passo / 2, y + (sobe ? altura : 0));
    px += passo;
    sobe = !sobe;
  }
  ctx.lineTo(fim, y);
}

/* monta o contorno do papel (retângulo com topo e base serrilhados) */
function contornoPapel(ctx, x, y, w, h, dente) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  serrilha(ctx, x, y, w, dente, true);
  ctx.lineTo(x + w, y + h);
  serrilha(ctx, x + w, y + h, -w, dente, false);
  ctx.closePath();
}

/* granulado leve, só pra tirar o aspecto liso demais do JPEG */
function poeira(ctx, x, y, w, h, s) {
  ctx.save();
  ctx.globalAlpha = 0.06;
  const n = Math.round((w * h) / (2600 / (s * s)));
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? "#000" : "#fff";
    ctx.fillRect(x + Math.random() * w, y + Math.random() * h, 1.6 * s, 1.6 * s);
  }
  ctx.restore();
}

function drawCupom(ctx, W, H, data) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.6;
  const M = "'Courier Prime', 'Courier New', monospace";

  /* superfície atrás do papel */
  ctx.fillStyle = "#1A1714";
  ctx.fillRect(0, 0, W, H);
  const vig = ctx.createRadialGradient(W / 2, H * 0.42, 0, W / 2, H * 0.42, W * 1.05);
  vig.addColorStop(0, "rgba(255,255,255,0.10)");
  vig.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  /* geometria do papel */
  const px = 92 * s;
  const pw = W - px * 2;
  const py = tall ? 104 * s : 62 * s;
  const ph = H - py * 2;
  const dente = 24 * s;

  /* sombra projetada com o formato serrilhado */
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 48 * s;
  ctx.shadowOffsetY = 20 * s;
  ctx.fillStyle = "#F6F3EE";
  contornoPapel(ctx, px, py, pw, ph, dente);
  ctx.fill();
  ctx.restore();

  /* textura recortada no formato do papel */
  ctx.save();
  contornoPapel(ctx, px, py, pw, ph, dente);
  ctx.clip();
  if (papelImg) {
    cobrir(ctx, papelImg, px, py - dente, pw, ph + dente * 2);
  }
  poeira(ctx, px, py, pw, ph, s);
  /* leve escurecimento nas bordas, dá volume ao papel */
  const bordas = ctx.createLinearGradient(px, 0, px + pw, 0);
  bordas.addColorStop(0, "rgba(120,110,100,0.16)");
  bordas.addColorStop(0.12, "rgba(0,0,0,0)");
  bordas.addColorStop(0.88, "rgba(0,0,0,0)");
  bordas.addColorStop(1, "rgba(120,110,100,0.16)");
  ctx.fillStyle = bordas;
  ctx.fillRect(px, py, pw, ph);
  ctx.restore();

  /* ---------- conteúdo ---------- */
  const pad = px + 52 * s;
  const inner = pw - 104 * s;
  const meio = px + pw / 2;
  const tinta = "#171310";
  let y = py + (tall ? 112 : 92) * s;

  const tracejada = () => {
    ctx.strokeStyle = "rgba(23,19,16,0.5)";
    ctx.lineWidth = 2 * s;
    ctx.setLineDash([9 * s, 9 * s]);
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(pad + inner, y);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  ctx.textAlign = "center";
  ctx.fillStyle = tinta;
  ctx.font = `700 ${(tall ? 88 : 70) * s}px Archivo`;
  ctx.fillText(st.p.recap ? "RECAP" : st.p.poster, meio, y);

  y += (tall ? 40 : 34) * s;
  tracking(ctx, 5 * s);
  ctx.font = `400 ${25 * s}px ${M}`;
  ctx.fillText(st.handle ? st.handle.toUpperCase() : "FAIXA", meio, y);
  tracking(ctx, 0);

  y += (tall ? 52 : 44) * s;
  ctx.textAlign = "left";
  ctx.font = `400 ${22 * s}px ${M}`;
  ctx.fillText("FAIXA #" + String(data.count || 0).padStart(4, "0") + " - LAST.FM", pad, y);
  y += 30 * s;
  ctx.fillText(st.range.toUpperCase(), pad, y);

  y += (tall ? 34 : 28) * s;
  tracejada();

  /* cabeçalho de colunas, como num cupom de verdade */
  y += (tall ? 40 : 34) * s;
  ctx.font = `400 ${22 * s}px ${M}`;
  ctx.fillStyle = "rgba(23,19,16,0.7)";
  ctx.fillText("QTD  ITEM", pad, y);
  ctx.fillText("TEMPO", pad + inner - ctx.measureText("TEMPO").width, y);
  ctx.fillStyle = tinta;
  y += (tall ? 12 : 10) * s;
  tracejada();

  /* seção de itens: nome, contagem à direita, apoio embaixo */
  const secao = (titulo, itens, nome, apoio, tempoDe) => {
    y += (tall ? 46 : 38) * s;
    ctx.fillStyle = tinta;
    ctx.font = `700 ${24 * s}px ${M}`;
    ctx.fillText(titulo, pad, y);
    y += (tall ? 42 : 36) * s;

    itens.forEach((it) => {
      const qtd = String(it.playcount).padStart(2, "0");
      const tempo = tempoDe(it);
      ctx.font = `400 ${(tall ? 26 : 22) * s}px ${M}`;
      const wt = ctx.measureText(tempo).width;
      const wq = ctx.measureText(qtd + "  ").width;
      ctx.fillStyle = tinta;
      ctx.fillText(qtd, pad, y);
      ctx.fillText(tempo, pad + inner - wt, y);
      writeFit(ctx, nome(it), pad + wq, y, inner - wq - wt - 22 * s, (tall ? 26 : 22) * s, 15 * s, M, "400");

      const ap = apoio(it);
      if (ap) {
        y += (tall ? 27 : 23) * s;
        ctx.fillStyle = "rgba(23,19,16,0.55)";
        ctx.font = `400 ${(tall ? 19 : 17) * s}px ${M}`;
        ctx.fillText(truncate(ctx, "   " + ap, inner - wt), pad + wq, y);
      }
      y += (tall ? 36 : 30) * s;
    });
    y -= (tall ? 10 : 8) * s;
    tracejada();
  };

  const min = (it, dur) => formatTempo((it.playcount || 0) * dur, true).toUpperCase();
  const mediaDur = data.mediaDur || 210;

  secao("ARTISTAS", st.artists, (a) => a.name, () => "", (a) => min(a, mediaDur));
  secao(
    "MUSICAS",
    st.tracks,
    (t) => t.name,
    (t) => (t.artist || "").toUpperCase(),
    (t) => min(t, t.duration > 0 ? t.duration : mediaDur)
  );

  if (st.album) {
    y += (tall ? 46 : 38) * s;
    ctx.fillStyle = tinta;
    ctx.font = `700 ${25 * s}px ${M}`;
    ctx.fillText("ALBUM", pad, y);
    y += (tall ? 38 : 32) * s;
    ctx.font = `400 ${(tall ? 27 : 23) * s}px ${M}`;
    writeFit(ctx, st.album.name, pad, y, inner, (tall ? 27 : 23) * s, 16 * s, M, "400");
    y += (tall ? 28 : 24) * s;
    ctx.fillStyle = "rgba(23,19,16,0.55)";
    ctx.font = `400 ${(tall ? 20 : 18) * s}px ${M}`;
    ctx.fillText(truncate(ctx, st.album.artist.toUpperCase(), inner), pad, y);
    y += (tall ? 24 : 20) * s;
    tracejada();
  }

  /* total */
  y += (tall ? 58 : 48) * s;
  ctx.fillStyle = tinta;
  ctx.font = `700 ${(tall ? 33 : 28) * s}px ${M}`;
  ctx.fillText("TOTAL", pad, y);
  ctx.font = `700 ${(tall ? 44 : 36) * s}px ${M}`;
  ctx.fillText(st.count, pad + inner - ctx.measureText(st.count).width, y);

  y += (tall ? 34 : 29) * s;
  ctx.font = `400 ${22 * s}px ${M}`;
  ctx.fillStyle = "rgba(23,19,16,0.65)";
  ctx.fillText("SCROBBLES", pad, y);
  if (st.deltaTxt) {
    const d = st.deltaTxt.toUpperCase().replace("·", "-");
    ctx.fillText(d, pad + inner - ctx.measureText(d).width, y);
  }

  if (st.temTempo) {
    y += (tall ? 40 : 34) * s;
    ctx.fillStyle = tinta;
    ctx.font = `700 ${(tall ? 29 : 25) * s}px ${M}`;
    ctx.fillText("TEMPO TOTAL", pad, y);
    const tp = st.tempo.toUpperCase();
    ctx.fillText(tp, pad + inner - ctx.measureText(tp).width, y);
  }

  y += (tall ? 30 : 26) * s;
  tracejada();
  y += (tall ? 40 : 34) * s;
  ctx.fillStyle = "rgba(23,19,16,0.7)";
  ctx.font = `400 ${20 * s}px ${M}`;
  ctx.fillText(`ARTISTAS DISTINTOS: ${st.unique}`, pad, y);
  y += 28 * s;
  ctx.fillText(`COD: ${String((data.count || 0) * 7919 % 999983).padStart(6, "0")}`, pad, y);

  /* código de barras */
  y += (tall ? 62 : 50) * s;
  const hb = (tall ? 84 : 66) * s;
  let bx = pad;
  let seed = (data.count || 7) * 31 + 17;
  ctx.fillStyle = tinta;
  while (bx < pad + inner - 4 * s) {
    seed = (seed * 9301 + 49297) % 233280;
    const bw = 2.4 * s + (seed / 233280) * 7 * s;
    ctx.fillRect(bx, y, bw, hb);
    bx += bw + (3 + (seed % 5)) * s;
  }
  y += hb + 32 * s;
  ctx.textAlign = "center";
  ctx.font = `400 ${21 * s}px ${M}`;
  ctx.fillStyle = "rgba(23,19,16,0.7)";
  ctx.fillText("OBRIGADO PELA PREFERENCIA", meio, y);
  y += 28 * s;
  ctx.fillText("VOLTE SEMPRE", meio, y);
  ctx.textAlign = "left";
}


/* ============================================================
   LAYOUT 6 — MOSAICO
   Grade de capas ocupando o topo, listas embaixo.
   ============================================================ */
function drawMosaico(ctx, W, H, data) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.6;
  const accent = st.p.recap ? GOLD : PINK;
  const albuns = (data.topAlbums || []).slice(0, tall ? 6 : 3);

  ctx.fillStyle = "#0B0B0D";
  ctx.fillRect(0, 0, W, H);

  const pad = 76 * s;
  const cols = tall ? 3 : 3;
  const gapC = 12 * s;
  const lado = (W - pad * 2 - gapC * (cols - 1)) / cols;
  const linhas = Math.ceil(albuns.length / cols);

  /* grade de capas */
  let gy = pad + 46 * s;
  albuns.forEach((a, i) => {
    const cx = pad + (i % cols) * (lado + gapC);
    const cy = gy + Math.floor(i / cols) * (lado + gapC);
    desenharCapa(ctx, a, cx, cy, lado, "#1A1A1F", "#3E3E46", "Anton");
  });

  ctx.fillStyle = "#8C8C8C";
  tracking(ctx, 4 * s);
  ctx.font = `700 ${24 * s}px Archivo`;
  ctx.fillText(st.p.recap ? `FAIXA — RECAP ${st.range}` : `FAIXA — ${st.p.poster}`, pad, pad + 6 * s);
  tracking(ctx, 0);

  let y = gy + linhas * (lado + gapC) + (tall ? 66 : 52) * s;

  /* número grande + métricas */
  ctx.fillStyle = accent;
  const numSize = fitText(ctx, st.count, W * 0.5, (tall ? 190 : 150) * s, "Anton");
  ctx.font = `${numSize}px Anton`;
  ctx.fillText(st.count, pad, y);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = `700 ${30 * s}px Archivo`;
  const xMet = pad + measureAnton(ctx, st.count, numSize) + 24 * s;
  ctx.fillText("SCROBBLES", xMet, y - 8 * s);
  if (st.temTempo) {
    ctx.fillStyle = "#8C8C8C";
    ctx.font = `500 ${26 * s}px Archivo`;
    ctx.fillText(st.tempo.toUpperCase(), xMet, y + 26 * s);
  }

  /* listas em duas colunas */
  y += (tall ? 74 : 58) * s;
  const gap = 44 * s;
  const colW = (W - pad * 2 - gap) / 2;
  const rowH = tall ? 76 * s : 62 * s;

  const coluna = (x, titulo, itens, nome, meta) => {
    ctx.fillStyle = "#8C8C8C";
    tracking(ctx, 3 * s);
    ctx.font = `700 ${20 * s}px Archivo`;
    ctx.fillText(titulo, x, y);
    tracking(ctx, 0);
    ctx.fillStyle = "#242429";
    ctx.fillRect(x, y + 16 * s, colW, 2 * s);
    let yy = y + (tall ? 66 : 54) * s;
    itens.slice(0, 5).forEach((it, i) => {
      ctx.fillStyle = i === 0 ? accent : "#FFFFFF";
      writeFit(ctx, nome(it).toUpperCase(), x, yy, colW, (tall ? 36 : 30) * s, 19 * s, "Anton");
      ctx.fillStyle = "#7B7B84";
      ctx.font = `500 ${18 * s}px Archivo`;
      ctx.fillText(truncate(ctx, meta(it), colW), x, yy + (tall ? 26 : 22) * s);
      yy += rowH;
    });
  };

  coluna(pad, "ARTISTAS", st.artists, (a) => a.name, st.metaArtista);
  coluna(pad + colW + gap, "MÚSICAS", st.tracks, (t) => t.name, st.metaFaixa);

  /* rodapé */
  ctx.fillStyle = "#7B7B84";
  tracking(ctx, 2 * s);
  ctx.font = `600 ${22 * s}px Archivo`;
  if (st.handle) ctx.fillText(truncate(ctx, st.handle, W * 0.5), pad, H - 54 * s);
  ctx.fillText(st.range, W - pad - ctx.measureText(st.range).width, H - 54 * s);
  tracking(ctx, 0);

  grain(ctx, W, H, 0.04, Math.round(W * H * 0.00022));
}

function measureAnton(ctx, txt, size) {
  const antes = ctx.font;
  ctx.font = `${size}px Anton`;
  const w = ctx.measureText(txt).width;
  ctx.font = antes;
  return w;
}

/* ============================================================
   LAYOUT 7 — CAPA
   Uma capa dominando a composição, no espírito de pôster de disco.
   ============================================================ */
function drawCapa(ctx, W, H, data) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.6;
  const accent = st.p.recap ? GOLD : PINK;
  const alvo = (data.topAlbums || [])[0];
  const artista = (data.topArtists || [])[0];
  /* prefere a foto do artista nº1; sem ela, a capa do álbum */
  const imArtista = capaDe(data.artistImage);
  const im = imArtista || capaDe(alvo?.capa);
  const legendaTitulo = imArtista ? (artista?.name || "") : (alvo?.name || "—");
  const legendaSub = imArtista
    ? st.metaArtista(artista || { playcount: 0 })
    : (alvo?.artist || "");

  ctx.fillStyle = "#0B0B0D";
  ctx.fillRect(0, 0, W, H);

  /* fundo: a própria imagem desfocada, quando existe */
  if (im) {
    ctx.save();
    ctx.filter = "blur(60px) saturate(1.5)";
    const esc = Math.max(W / im.width, H / im.height) * 1.3;
    ctx.drawImage(im, (W - im.width * esc) / 2, (H - im.height * esc) / 2, im.width * esc, im.height * esc);
    ctx.restore();
    ctx.fillStyle = "rgba(11,11,13,0.72)";
    ctx.fillRect(0, 0, W, H);
  }

  const pad = 84 * s;

  ctx.fillStyle = "#FFFFFF";
  tracking(ctx, 4 * s);
  ctx.font = `700 ${24 * s}px Archivo`;
  ctx.fillText(st.p.recap ? `FAIXA — RECAP ${st.range}` : `FAIXA — ${st.p.poster}`, pad, pad + 30 * s);
  tracking(ctx, 0);

  /* capa grande centralizada */
  const lado = Math.min(W - pad * 2, tall ? H * 0.42 : H * 0.5);
  const cx = (W - lado) / 2;
  const cy = pad + (tall ? 96 : 72) * s;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 60 * s;
  ctx.shadowOffsetY = 24 * s;
  if (im) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(cx, cy, lado, lado);
    ctx.clip();
    const e = Math.max(lado / im.width, lado / im.height);
    ctx.drawImage(im, cx + (lado - im.width * e) / 2, cy + (lado - im.height * e) / 2, im.width * e, im.height * e);
    ctx.restore();
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = Math.max(1, lado * 0.006);
    ctx.strokeRect(cx, cy, lado, lado);
  } else {
    desenharCapa(ctx, alvo, cx, cy, lado, "#1A1A1F", "#3E3E46", "Anton");
  }
  ctx.restore();

  let y = cy + lado + (tall ? 86 : 62) * s;

  ctx.textAlign = "center";
  ctx.fillStyle = accent;
  writeFit(ctx, (legendaTitulo || "—").toUpperCase(), W / 2, y, W - pad * 2, (tall ? 74 : 58) * s, 28 * s, "Anton");
  y += (tall ? 48 : 40) * s;
  ctx.fillStyle = "#B9B9C0";
  ctx.font = `500 ${(tall ? 30 : 26) * s}px Archivo`;
  ctx.fillText(truncate(ctx, legendaSub || "", W - pad * 2), W / 2, y);
  ctx.textAlign = "left";

  /* faixa de métricas */
  const fy = H - (tall ? 210 : 160) * s;
  ctx.fillStyle = "#242429";
  ctx.fillRect(pad, fy, W - pad * 2, 2 * s);

  const metricas = [
    ["SCROBBLES", st.count],
    st.temTempo ? ["TEMPO", st.tempo.toUpperCase()] : null,
    ["ARTISTAS", st.unique],
  ].filter(Boolean);
  const cw = (W - pad * 2) / metricas.length;
  metricas.forEach(([rot, val], i) => {
    const x = pad + cw * i;
    ctx.fillStyle = "#7B7B84";
    tracking(ctx, 2 * s);
    ctx.font = `600 ${19 * s}px Archivo`;
    ctx.fillText(rot, x, fy + 40 * s);
    tracking(ctx, 0);
    ctx.fillStyle = "#FFFFFF";
    writeFit(ctx, val, x, fy + (tall ? 98 : 86) * s, cw - 18 * s, (tall ? 52 : 44) * s, 24 * s, "Anton");
  });

  ctx.fillStyle = "#7B7B84";
  tracking(ctx, 2 * s);
  ctx.font = `600 ${22 * s}px Archivo`;
  if (st.handle) ctx.fillText(truncate(ctx, st.handle, W * 0.5), pad, H - 50 * s);
  ctx.fillText(st.range, W - pad - ctx.measureText(st.range).width, H - 50 * s);
  tracking(ctx, 0);
}

const DRAWERS = { mixtape: drawMixtape, vidro: drawVidro, lambe: drawLambe, xerox: drawXerox, cupom: drawCupom, mosaico: drawMosaico, capa: drawCapa };

/* ---------- API pública do módulo ---------- */

export async function ensureAssets() {
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
  await carregarPapel();
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
  a.download = `faixa-${periodId}-${layoutId}-${res.w}x${res.h}.png`;
  a.click();
}
