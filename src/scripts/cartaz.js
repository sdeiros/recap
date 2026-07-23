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
      antRotulo: `${MESES[antIni.getMonth()].toUpperCase()} ${antIni.getFullYear()}`,
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
      antRotulo: String(ano - 1),
      emAndamento: offset === 0,
    };
  }

  /* semana: últimos 7 dias */
  const fim = agora;
  const ini = new Date(agora.getTime() - 7 * 864e5);
  const antIni = new Date(agora.getTime() - 14 * 864e5);
  const f = (d) =>
    d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).toUpperCase().replace(".", "");
  return {
    from: seg(ini),
    to: seg(fim),
    antFrom: seg(antIni),
    antTo: seg(ini),
    poster: "SEMANA",
    rotulo: `${f(ini)} – ${f(fim)}`,
    curto: "últimos 7 dias",
    antRotulo: `${f(antIni)} – ${f(ini)}`,
    emAndamento: true,
  };
}

export const RESOLUTIONS = [
  { id: "story", label: "Stories / Status", w: 1080, h: 1920 },
  { id: "retrato", label: "Feed retrato", w: 1080, h: 1350 },
  { id: "feed", label: "Feed quadrado", w: 1080, h: 1080 },
];

export const THEMES = [
  {
    id: "original",
    label: "Original",
    note: "mantém as cores autorais de cada estilo",
    preview: ["#0D0D0F", "#EFEAE1", "#FF4A1C"],
    original: true,
  },
  {
    id: "classico",
    label: "FAIXA clássico",
    note: "preto, osso e laranja",
    preview: ["#0D0D0F", "#EFEAE1", "#FF4A1C"],
    bg: "#0D0D0F", surface: "#1B1B20", paper: "#EFEAE1", text: "#FFFFFF",
    muted: "#918E89", ink: "#0D0D0F", accent: "#FF4A1C", accent2: "#1E2BFF",
  },
  {
    id: "eletrico",
    label: "Noite elétrica",
    note: "azul, violeta e ciano",
    preview: ["#080A12", "#7357FF", "#20D7FF"],
    bg: "#080A12", surface: "#171A2A", paper: "#EDEBFF", text: "#F8F7FF",
    muted: "#9EA5C3", ink: "#10111B", accent: "#7357FF", accent2: "#20D7FF",
  },
  {
    id: "calor",
    label: "Calor pop",
    note: "creme, coral e vinho",
    preview: ["#FFF0DF", "#FF6247", "#681D3A"],
    bg: "#2B101A", surface: "#461828", paper: "#FFF0DF", text: "#FFF8F2",
    muted: "#C9A8A5", ink: "#271018", accent: "#FF6247", accent2: "#A83D68",
  },
  {
    id: "pastel",
    label: "Pastel sonho",
    note: "azul névoa, lilás e rosa",
    preview: ["#DDF5F3", "#A879C2", "#FF9DB3"],
    bg: "#5D3D6B", surface: "#745180", paper: "#F3EEE8", text: "#FFF9FF",
    muted: "#D5C5D8", ink: "#3C2850", accent: "#A879C2", accent2: "#66C9C9",
  },
  {
    id: "acido",
    label: "Verde ácido",
    note: "lima, roxo e osso",
    preview: ["#251731", "#C8FF54", "#F2ECDD"],
    bg: "#251731", surface: "#3B254B", paper: "#F2ECDD", text: "#FFF9EE",
    muted: "#BBAFC1", ink: "#251731", accent: "#C8FF54", accent2: "#FF8E62",
  },
  {
    id: "jornal",
    label: "Mono jornal",
    note: "papel, tinta e cinza",
    preview: ["#F0ECE4", "#111113", "#77746F"],
    bg: "#111113", surface: "#252528", paper: "#F0ECE4", text: "#FAF8F4",
    muted: "#8A8782", ink: "#111113", accent: "#111113", accent2: "#77746F",
  },
  {
    id: "custom",
    label: "Personalizada",
    note: "você escolhe as quatro cores",
    preview: ["#0D0D0F", "#FFFFFF", "#FF4A1C"],
    custom: true,
  },
];

export const PERIOD_DEFAULT_LAYOUT = {
  semana: "replay",
  mes: "mosaico",
  ano: "editorial",
};

/* Todos continuam disponíveis. “best” apenas organiza o painel e sugere o
   estilo que aproveita melhor a quantidade de dados de cada período. */
export const LAYOUTS = [
  { id: "replay", label: "Ranking", note: "retratos + lista compacta", best: ["semana", "mes", "ano"] },
  { id: "estrela", label: "Destaque", note: "artista nº 1 em escala máxima", best: ["semana", "mes", "ano"] },
  { id: "comparativo", label: "Comparativo", note: "período atual × anterior", best: ["mes", "ano"] },
  { id: "editorial", label: "Editorial", note: "listas + colagem de imagens", best: ["mes", "ano"] },
  { id: "parada", label: "Parada", note: "ranking visual de álbuns", best: ["mes", "ano"] },
  { id: "faixas", label: "Faixas", note: "músicas do período com capas", best: ["semana", "mes"] },
  { id: "ondas", label: "Ondas", note: "retrato central + frequência", best: ["mes", "ano"] },
  { id: "mixtape", label: "Mixtape", note: "grid + tipo condensado", best: ["semana", "mes", "ano"] },
  { id: "vidro", label: "Vidro", note: "gradiente + painel editorial", best: ["mes", "ano"] },
  { id: "lambe", label: "Lambe", note: "cartaz de rua", best: ["semana", "mes"] },
  { id: "xerox", label: "Xerox", note: "zine fotocopiado", best: ["semana", "mes"] },
  { id: "cupom", label: "Cupom", note: "recibo musical", best: ["semana", "mes"] },
  { id: "mosaico", label: "Mosaico", note: "capas + listas", best: ["mes", "ano"] },
  { id: "capa", label: "Capa", note: "pôster de artista ou álbum", best: ["semana", "mes"] },
];


/* ---------- tema de cor ---------- */
const THEME_BY_ID = new Map(THEMES.map((t) => [t.id, t]));

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

function hexRgb(hex) {
  const h = String(hex || "").trim().replace("#", "");
  if (![3, 4, 6, 8].includes(h.length)) return null;
  const full = h.length <= 4 ? [...h].map((x) => x + x).join("") : h;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
    a: full.length === 8 ? parseInt(full.slice(6, 8), 16) / 255 : 1,
  };
}

function hslRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = clamp(s);
  l = clamp(l);
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let q = [0, 0, 0];
  if (h < 60) q = [c, x, 0];
  else if (h < 120) q = [x, c, 0];
  else if (h < 180) q = [0, c, x];
  else if (h < 240) q = [0, x, c];
  else if (h < 300) q = [x, 0, c];
  else q = [c, 0, x];
  return { r: Math.round((q[0] + m) * 255), g: Math.round((q[1] + m) * 255), b: Math.round((q[2] + m) * 255), a: 1 };
}

function parseCor(valor) {
  if (typeof valor !== "string") return null;
  const v = valor.trim().toLowerCase();
  if (v === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
  if (v.startsWith("#")) return hexRgb(v);
  let m = v.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/);
  if (m) {
    const alpha = m[4] ? (m[4].endsWith("%") ? Number(m[4].slice(0, -1)) / 100 : Number(m[4])) : 1;
    return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]), a: clamp(alpha) };
  }
  m = v.match(/^hsla?\(\s*([-\d.]+)(?:deg)?[,\s]+([\d.]+)%[,\s]+([\d.]+)%(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/);
  if (m) {
    const rgb = hslRgb(Number(m[1]), Number(m[2]) / 100, Number(m[3]) / 100);
    rgb.a = m[4] ? (m[4].endsWith("%") ? Number(m[4].slice(0, -1)) / 100 : Number(m[4])) : 1;
    return rgb;
  }
  return null;
}

function rgbHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return { h: h * 60, s, l };
}

function rgbaDe(hex, a = 1) {
  const c = hexRgb(hex) || { r: 255, g: 255, b: 255 };
  return `rgba(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)},${clamp(a)})`;
}

function mistura(a, b, t) {
  const A = hexRgb(a) || { r: 0, g: 0, b: 0 };
  const B = hexRgb(b) || { r: 255, g: 255, b: 255 };
  const f = (x, y) => Math.round(x + (y - x) * t).toString(16).padStart(2, "0");
  return `#${f(A.r, B.r)}${f(A.g, B.g)}${f(A.b, B.b)}`;
}

function luminancia(hex) {
  const c = hexRgb(hex) || { r: 0, g: 0, b: 0 };
  const f = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
}

function contraste(a, b) {
  const x = luminancia(a), y = luminancia(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

function textoSeguro(bg, escolhido) {
  if (contraste(bg, escolhido) >= 4.3) return escolhido;
  return contraste(bg, "#FFFFFF") >= contraste(bg, "#0D0D0F") ? "#FFFFFF" : "#0D0D0F";
}

function temaCustom(c = {}) {
  const bg = c.bg || "#0D0D0F";
  const text = textoSeguro(bg, c.text || "#FFFFFF");
  return {
    id: "custom",
    bg,
    surface: mistura(bg, text, 0.12),
    paper: bg,
    text,
    muted: mistura(text, bg, 0.44),
    ink: text,
    accent: c.accent || "#FF4A1C",
    accent2: c.accent2 || "#1E2BFF",
  };
}

function temaDe(data) {
  if (data?.themeId === "custom") return temaCustom(data.customColors);
  return THEME_BY_ID.get(data?.themeId || "original") || THEME_BY_ID.get("original");
}

const PAPEIS = new Set(["#efeae1", "#f2efea", "#f1ece4", "#e9e5dd", "#f3eee8", "#f0ece4", "#f6f3ee"]);
const FUNDOS = new Set(["#0d0d0f", "#0e0e10", "#0b0b0d", "#0b0b0f", "#07070a", "#050507", "#111113", "#111115", "#160c08"]);
const SUPERFICIES = new Set(["#17171a", "#1a1a1f", "#242429", "#232328", "#1b1b20"]);
const CLAROS = new Set(["#ffffff", "#f8f2f3", "#faf8f4", "#fff9ff", "#fff8f2"]);

function mapearCor(valor, pal) {
  if (!pal || pal.original || typeof valor !== "string") return valor;
  const raw = valor.trim().toLowerCase();
  const cor = parseCor(raw);
  if (!cor || cor.a === 0) return valor;
  const alpha = cor.a;
  const semAlpha = raw.startsWith("#") ? raw.slice(0, 7) : "";
  let destino;

  if (PAPEIS.has(semAlpha)) destino = pal.paper;
  else if (FUNDOS.has(semAlpha)) destino = pal.bg;
  else if (SUPERFICIES.has(semAlpha)) destino = pal.surface;
  else if (CLAROS.has(semAlpha)) destino = pal.text;
  else {
    const hsl = rgbHsl(cor);
    if (hsl.s < 0.13) {
      if (hsl.l < 0.16) destino = pal.bg;
      else if (hsl.l < 0.34) destino = pal.surface;
      else if (hsl.l < 0.78) destino = pal.muted;
      else destino = pal.text;
    } else {
      /* quentes são o sinal principal; frios viram contraponto. */
      destino = hsl.h < 78 || hsl.h > 338 ? pal.accent : pal.accent2;
    }
  }
  return rgbaDe(destino, alpha);
}

function gradienteTematico(g, pal) {
  if (!pal || pal.original) return g;
  const adicionar = g.addColorStop.bind(g);
  try {
    g.addColorStop = (pos, cor) => adicionar(pos, mapearCor(cor, pal));
  } catch (_) {
    /* CanvasGradient costuma ser extensível; se não for, mantém as cores nativas. */
  }
  return g;
}

function contextoTematico(ctx, pal) {
  if (!pal || pal.original) return ctx;
  return new Proxy(ctx, {
    get(alvo, prop) {
      if (prop === "createLinearGradient" || prop === "createRadialGradient" || prop === "createConicGradient") {
        return (...args) => gradienteTematico(alvo[prop](...args), pal);
      }
      const v = Reflect.get(alvo, prop, alvo);
      return typeof v === "function" ? v.bind(alvo) : v;
    },
    set(alvo, prop, valor) {
      if (["fillStyle", "strokeStyle", "shadowColor"].includes(prop) && typeof valor === "string") {
        valor = mapearCor(valor, pal);
      }
      Reflect.set(alvo, prop, valor, alvo);
      return true;
    },
  });
}

function densidadePeriodo(data) {
  return data?.period === "ano" ? 5 : data?.period === "mes" ? 4 : 3;
}

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
    prevRange: j.antRotulo || p.prev.toUpperCase(),
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
      writeFit(ctx, st.tempoLongo, pad, dy, W - pad * 2, (tall ? 64 : 54) * s, 28 * s, "Anton");
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
  ctx.font = `600 ${25 * s}px ${F}`;
  const abertura = data.period === "ano" ? `Arquivo ${st.range}` : data.period === "mes" ? "Mapa do mês" : "Recorte da semana";
  ctx.fillText(abertura, pad, topo);

  ctx.fillStyle = "#FFFFFF";
  const numSize = fitText(ctx, st.count, W - pad * 2, tall ? 210 * s : 170 * s, F, "700");
  ctx.font = `700 ${numSize}px ${F}`;
  const numY = topo + (tall ? 180 : 140) * s;
  ctx.fillText(st.count, pad, numY);

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = `400 ${34 * s}px ${F}`;
  ctx.fillText("scrobbles registrados", pad, numY + 50 * s);
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
  roundRect(ctx, pad, cardTop, W - pad * 2, cardBottom - cardTop, 18 * s);
  ctx.fillStyle = "rgba(255,255,255,0.13)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 2 * s;
  ctx.stroke();
  ctx.restore();
  ctx.fillStyle = recap ? GOLD : PINK;
  ctx.fillRect(pad, cardTop, 12 * s, cardBottom - cardTop);

  const cpad = pad + 52 * s;
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
  if (st.handle) ctx.fillText(st.handle, pad, H - 66 * s);
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
    const aB = (tall ? 0.27 : 0.22) * H;
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

  y += banda ? (tall ? 132 : 112) * s : (tall ? 220 : 175) * s;
  ctx.fillStyle = INK;
  const nSize = fitText(ctx, st.count, W - pad * 2, (tall ? (banda ? 194 : 250) : 190) * s, "Anton");
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
  const rowH = tall ? 94 * s : 80 * s;

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
    ctx.fillText(data.period === "ano" ? "DISCO DO ANO" : data.period === "mes" ? "DISCO DO MÊS" : "ÁLBUM MAIS OUVIDO", pad + 28 * s, y + 40 * s);
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
  const alturaB = (tall ? 0.28 : 0.23) * H;
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

  y += banda ? (tall ? 150 : 128) * s : (tall ? 250 : 210) * s;
  const nS = fitText(ctx, st.count, W - pad * 2, (tall ? (banda ? 210 : 280) : 205) * s, "Anton");
  ctx.font = `${nS}px Anton`;
  ctx.fillStyle = PAPER;
  ctx.fillText(st.count, pad, y);
  y += 72 * s;
  ctx.fillStyle = accent;
  ctx.font = `${54 * s}px Anton`;
  ctx.fillText(
    data.period === "ano" ? "SCROBBLES NO ANO" : data.period === "mes" ? "SCROBBLES NO MÊS" : "SCROBBLES NA SEMANA",
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
  const rowH = tall ? 91 * s : 78 * s;

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
  const urls = [...new Set([
    ...(dados?.topAlbums || []).map((a) => a.capa),
    ...(dados?.topArtists || []).map((a) => a.image),
    ...(dados?.topTracks || []).map((t) => t.capa),
    dados?.artistImage,
    dados?.prevTopArtist?.image,
  ].filter(Boolean))];
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
  const limiteCapas = tall ? (data.period === "semana" ? 3 : 6) : 3;
  const albuns = (data.topAlbums || []).slice(0, limiteCapas);

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
    return yy;
  };

  const fimA = coluna(pad, "ARTISTAS", st.artists, (a) => a.name, st.metaArtista);
  const fimM = coluna(pad + colW + gap, "MÚSICAS", st.tracks, (t) => t.name, st.metaFaixa);

  if (tall) {
    const album = (data.topAlbums || [])[0];
    const by = Math.min(H - 210 * s, Math.max(fimA, fimM) + 34 * s);
    ctx.fillStyle = "#17171A";
    ctx.fillRect(pad, by, W - pad * 2, 116 * s);
    ctx.fillStyle = accent;
    ctx.font = `700 ${18 * s}px Archivo`;
    ctx.fillText(data.period === "ano" ? "DISCO DO ANO" : data.period === "mes" ? "DISCO DO MÊS" : "ÁLBUM EM LOOP", pad + 28 * s, by + 36 * s);
    ctx.fillStyle = "#FFFFFF";
    writeFit(ctx, (album?.name || "—").toUpperCase(), pad + 28 * s, by + 84 * s, W * 0.58, 36 * s, 22 * s, "Anton");
    ctx.textAlign = "right";
    ctx.fillStyle = "#8C8C8C";
    ctx.font = `600 ${20 * s}px Archivo`;
    ctx.fillText(album?.artist || "", W - pad - 28 * s, by + 82 * s);
    ctx.textAlign = "left";
  }

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

  if (tall) {
    const faixa = (data.topTracks || [])[0];
    const iy = y + 104 * s;
    ctx.fillStyle = "rgba(255,255,255,.14)";
    ctx.fillRect(pad, iy - 34 * s, W - pad * 2, 2 * s);
    ctx.fillStyle = "#7B7B84";
    ctx.font = `600 ${18 * s}px Archivo`;
    const rot = data.period === "ano" ? "FAIXA DO ANO" : data.period === "mes" ? "FAIXA DO MÊS" : "FAIXA MAIS OUVIDA";
    ctx.fillText(rot, pad, iy);
    ctx.fillStyle = "#FFFFFF";
    writeFit(ctx, (faixa?.name || "—").toUpperCase(), pad, iy + 50 * s, W * 0.62, 42 * s, 24 * s, "Anton");
    ctx.textAlign = "right";
    ctx.fillStyle = "#B9B9C0";
    ctx.font = `500 ${22 * s}px Archivo`;
    ctx.fillText(faixa?.artist || "", W - pad, iy + 48 * s);
    ctx.textAlign = "left";
  }

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


/* ============================================================
   LAYOUTS 8–14 — FOTO / REPLAY
   Leituras autorais de rankings, destaques, comparativos e editoriais.
   ============================================================ */

function tomDeNome(nome = "", salto = 0) {
  let h = 0;
  for (let i = 0; i < nome.length; i++) h = (h * 31 + nome.charCodeAt(i)) % 360;
  return (h + salto) % 360;
}

function fundoRetrato(ctx, x, y, w, h, nome = "", claro = false) {
  const hue = tomDeNome(nome, claro ? 36 : 0);
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, `hsl(${hue} 72% ${claro ? 76 : 30}%)`);
  g.addColorStop(1, `hsl(${(hue + 74) % 360} 68% ${claro ? 62 : 16}%)`);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
}

function imagemRecortada(ctx, url, x, y, w, h, raio, nome = "", claro = false, stroke = "rgba(255,255,255,.2)") {
  const im = capaDe(url);
  ctx.save();
  if (raio >= Math.min(w, h) / 2) {
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
  } else {
    roundRect(ctx, x, y, w, h, raio);
  }
  ctx.clip();
  if (im) cobrir(ctx, im, x, y, w, h);
  else {
    fundoRetrato(ctx, x, y, w, h, nome, claro);
    ctx.fillStyle = claro ? "rgba(13,13,15,.82)" : "rgba(255,255,255,.88)";
    ctx.textAlign = "center";
    ctx.font = `${Math.min(w, h) * 0.42}px Anton`;
    ctx.fillText((nome || "?").trim().charAt(0).toUpperCase(), x + w / 2, y + h * 0.68);
    ctx.textAlign = "left";
  }
  ctx.restore();
  ctx.save();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = Math.max(1, w * 0.009);
  if (raio >= Math.min(w, h) / 2) {
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    roundRect(ctx, x, y, w, h, raio);
    ctx.stroke();
  }
  ctx.restore();
}

function malhaClara(ctx, W, H) {
  ctx.fillStyle = "#E9E5DD";
  ctx.fillRect(0, 0, W, H);
  [
    [W * 0.85, H * 0.12, W * 0.72, "rgba(255,126,61,.72)"],
    [W * 0.2, H * 0.86, W * 0.78, "rgba(63,205,197,.55)"],
    [W * 0.7, H * 0.72, W * 0.62, "rgba(152,108,255,.22)"],
  ].forEach(([x, y, r, c]) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, c);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  });
}

function malhaEscura(ctx, W, H, quente = false) {
  ctx.fillStyle = "#07070A";
  ctx.fillRect(0, 0, W, H);
  const manchas = quente
    ? [
        [W * 0.16, H * 0.14, W * 0.8, "rgba(255,120,35,.72)"],
        [W * 0.9, H * 0.72, W * 0.9, "rgba(118,45,255,.48)"],
        [W * 0.18, H * 0.96, W * 0.65, "rgba(255,45,99,.35)"],
      ]
    : [
        [W * 0.15, H * 0.12, W * 0.75, "rgba(255,196,0,.62)"],
        [W * 0.95, H * 0.42, W * 0.88, "rgba(0,178,255,.5)"],
        [W * 0.08, H * 0.9, W * 0.76, "rgba(255,37,98,.4)"],
      ];
  manchas.forEach(([x, y, r, c]) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, c);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  });
  ctx.fillStyle = "rgba(0,0,0,.36)";
  ctx.fillRect(0, 0, W, H);
}

function cabecalhoReplay(ctx, W, s, esquerda, direita, escuro = false) {
  ctx.fillStyle = escuro ? "rgba(255,255,255,.92)" : "#101014";
  ctx.font = `700 ${24 * s}px Inter`;
  ctx.fillText(esquerda, 48 * s, 68 * s);
  ctx.textAlign = "right";
  ctx.fillText(direita, W - 48 * s, 68 * s);
  ctx.textAlign = "left";
}

function drawReplay(ctx, W, H, data) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.6;
  const square = H <= W * 1.05;
  malhaClara(ctx, W, H);

  const pad = 48 * s;
  cabecalhoReplay(ctx, W, s, `FAIXA’${String(new Date().getFullYear()).slice(-2)}`, "SUA ESCUTA", false);

  ctx.fillStyle = "#111115";
  ctx.font = `700 ${(tall ? 58 : 48) * s}px Inter`;
  ctx.fillText("Top artistas", pad, (tall ? 178 : 150) * s);
  ctx.fillStyle = "rgba(17,17,21,.5)";
  ctx.font = `600 ${(tall ? 46 : 36) * s}px Inter`;
  ctx.fillText(st.range, pad, (tall ? 228 : 194) * s);

  const itens = (data.topArtists || []).slice(0, square ? 4 : 5);
  const baseInicio = (tall ? 310 : 248) * s;
  const limite = H - (tall ? 150 : 96) * s;
  const disponivel = limite - baseInicio;
  const desejado = (tall ? (data.period === "ano" ? 236 : 248) : 158) * s;
  const rowH = Math.min(desejado, disponivel / Math.max(1, itens.length));
  const inicio = baseInicio + Math.max(0, (disponivel - rowH * itens.length) * 0.16);
  const d = Math.min(rowH * 0.7, (tall ? 146 : 112) * s);

  itens.forEach((a, i) => {
    const cy = inicio + rowH * i + rowH * 0.48;
    ctx.fillStyle = "#111115";
    ctx.textAlign = "center";
    ctx.font = `600 ${(tall ? 66 : 50) * s}px Inter`;
    ctx.fillText(String(i + 1), pad + 22 * s, cy + 18 * s);
    ctx.textAlign = "left";

    const ix = pad + (tall ? 88 : 74) * s;
    imagemRecortada(ctx, a.image, ix, cy - d / 2, d, d, d / 2, a.name, true, "rgba(17,17,21,.12)");
    const tx = ix + d + (tall ? 38 : 28) * s;
    ctx.fillStyle = "#111115";
    writeFit(ctx, a.name, tx, cy - 2 * s, W - tx - pad, (tall ? 42 : 34) * s, 22 * s, "Inter", "700");
    ctx.fillStyle = "rgba(17,17,21,.52)";
    ctx.font = `500 ${(tall ? 27 : 22) * s}px Inter`;
    const tempo = formatTempo((a.playcount || 0) * (data.mediaDur || 210), true);
    ctx.fillText(`${tempo} · ${a.playcount || 0} plays`, tx, cy + (tall ? 36 : 30) * s);
  });

  ctx.fillStyle = "rgba(17,17,21,.55)";
  ctx.font = `600 ${20 * s}px Inter`;
  if (st.handle) ctx.fillText(truncate(ctx, st.handle, W * 0.55), pad, H - 42 * s);
  ctx.textAlign = "right";
  ctx.fillText(`${st.count} SCROBBLES`, W - pad, H - 42 * s);
  ctx.textAlign = "left";
}

function drawEstrela(ctx, W, H, data) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.6;
  const a = (data.topArtists || [])[0] || { name: "—", playcount: 0, image: "" };
  const im = capaDe(a.image || data.artistImage);

  ctx.fillStyle = "#160C08";
  ctx.fillRect(0, 0, W, H);
  if (im) {
    ctx.save();
    ctx.filter = `blur(${65 * s}px) saturate(1.35)`;
    ctx.globalAlpha = 0.72;
    cobrir(ctx, im, -W * 0.12, -H * 0.1, W * 1.24, H * 1.2);
    ctx.restore();
  }
  const veil = ctx.createLinearGradient(0, 0, 0, H);
  veil.addColorStop(0, "rgba(53,22,7,.34)");
  veil.addColorStop(0.52, "rgba(12,8,8,.22)");
  veil.addColorStop(1, "rgba(5,5,7,.86)");
  ctx.fillStyle = veil;
  ctx.fillRect(0, 0, W, H);

  cabecalhoReplay(ctx, W, s, `FAIXA’${String(new Date().getFullYear()).slice(-2)}`, st.range, true);
  const pad = 48 * s;
  ctx.fillStyle = "rgba(255,255,255,.8)";
  ctx.font = `600 ${(tall ? 34 : 28) * s}px Inter`;
  ctx.fillText("Artista do período", pad, (tall ? 148 : 128) * s);

  ctx.fillStyle = "#FFFFFF";
  writeFit(ctx, a.name, pad, (tall ? 250 : 216) * s, W - pad * 2, (tall ? 96 : 78) * s, 38 * s, "Inter", "700");
  ctx.font = `700 ${(tall ? 38 : 31) * s}px Inter`;
  ctx.fillText(`${a.playcount || 0} plays`, pad, (tall ? 308 : 266) * s);

  const d = Math.min(W * (tall ? 0.78 : 0.62), H * (tall ? 0.46 : 0.52));
  const x = (W - d) / 2;
  const y = tall ? H * 0.31 : H * 0.35;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,.55)";
  ctx.shadowBlur = 70 * s;
  ctx.shadowOffsetY = 24 * s;
  imagemRecortada(ctx, a.image || data.artistImage, x, y, d, d, d / 2, a.name, false, "rgba(255,255,255,.18)");
  ctx.restore();

  const fy = H - (tall ? 172 : 128) * s;
  const faixa = (data.topTracks || [])[0];
  if (tall && faixa) {
    const infoY = Math.min(fy - 74 * s, y + d + 86 * s);
    ctx.fillStyle = "rgba(255,255,255,.22)";
    ctx.fillRect(pad, infoY - 36 * s, W - pad * 2, 1.5 * s);
    ctx.fillStyle = "rgba(255,255,255,.54)";
    ctx.font = `600 ${18 * s}px Inter`;
    ctx.fillText("MÚSICA MAIS OUVIDA", pad, infoY);
    ctx.fillStyle = "#FFFFFF";
    writeFit(ctx, faixa.name, pad, infoY + 43 * s, W * 0.58, 32 * s, 20 * s, "Inter", "700");
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(255,255,255,.58)";
    ctx.font = `500 ${20 * s}px Inter`;
    ctx.fillText(faixa.artist || "", W - pad, infoY + 43 * s);
    ctx.textAlign = "left";
  }

  const métricas = [
    ["TEMPO", formatTempo((a.playcount || 0) * (data.mediaDur || 210), true).toUpperCase()],
    ["TOTAL", st.count],
    ["ARTISTAS", st.unique],
  ];
  const cw = (W - pad * 2) / métricas.length;
  métricas.forEach(([rot, val], i) => {
    const xx = pad + cw * i;
    ctx.fillStyle = "rgba(255,255,255,.55)";
    ctx.font = `600 ${18 * s}px Inter`;
    ctx.fillText(rot, xx, fy);
    ctx.fillStyle = "#FFFFFF";
    writeFit(ctx, val, xx, fy + 48 * s, cw - 16 * s, 38 * s, 20 * s, "Inter", "700");
  });
  ctx.fillStyle = "rgba(255,255,255,.58)";
  ctx.font = `600 ${19 * s}px Inter`;
  if (st.handle) ctx.fillText(truncate(ctx, st.handle, W * 0.5), pad, H - 38 * s);
}

function drawComparativo(ctx, W, H, data) {
  const s = W / 1080;
  const st = strings(data);
  const atual = (data.topArtists || [])[0] || { name: "—", playcount: 0, image: "" };
  const anterior = data.prevTopArtist || { name: "Sem dados", playcount: 0, image: "" };
  ctx.fillStyle = "#050507";
  ctx.fillRect(0, 0, W, H);
  cabecalhoReplay(ctx, W, s, "FAIXA · COMPARATIVO", "SUA ESCUTA", true);

  const topo = 104 * s;
  const gap = 10 * s;
  const ph = (H - topo - gap) / 2;
  const painel = (y, h, item, label, invert, atualPainel) => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, y, W, h);
    ctx.clip();
    const g = ctx.createLinearGradient(0, y, W, y + h);
    if (atualPainel) {
      g.addColorStop(0, "#0A0A0D");
      g.addColorStop(0.55, "#17100B");
      g.addColorStop(1, "#8A451B");
    } else {
      g.addColorStop(0, "#0A2941");
      g.addColorStop(0.48, "#090A0E");
      g.addColorStop(1, "#150A2B");
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, y, W, h);

    const d = Math.min(W * 0.41, h * 0.68);
    const ix = invert ? 48 * s : W - d - 48 * s;
    const iy = y + (h - d) / 2 + 8 * s;
    const semDados = !item || !item.name || (item.playcount || 0) === 0;
    if (semDados) {
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,.25)";
      ctx.lineWidth = 3 * s;
      ctx.setLineDash([14 * s, 14 * s]);
      ctx.beginPath();
      ctx.arc(ix + d / 2, iy + d / 2, d * 0.42, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(255,255,255,.48)";
      ctx.textAlign = "center";
      ctx.font = `600 ${22 * s}px Inter`;
      ctx.fillText("SEM HISTÓRICO", ix + d / 2, iy + d / 2 + 7 * s);
      ctx.textAlign = "left";
      ctx.restore();
    } else {
      imagemRecortada(ctx, item.image, ix, iy, d, d, d / 2, item.name, false, "rgba(255,255,255,.22)");
    }

    const pad = 48 * s;
    const textX = invert ? ix + d + 38 * s : pad;
    const maxW = invert ? W - textX - pad : ix - textX - 34 * s;
    ctx.fillStyle = "rgba(255,255,255,.55)";
    ctx.font = `600 ${24 * s}px Inter`;
    ctx.fillText(label, textX, y + 74 * s);
    ctx.fillStyle = "#FFFFFF";
    writeFit(ctx, semDados ? "Sem dados suficientes" : item.name, textX, y + h * 0.5, maxW, semDados ? 44 * s : 64 * s, 25 * s, "Inter", "700");
    ctx.fillStyle = "rgba(255,255,255,.62)";
    ctx.font = `500 ${23 * s}px Inter`;
    ctx.fillText(semDados ? "O período anterior ainda não tem registros." : `${item.playcount || 0} plays`, textX, y + h * 0.5 + 44 * s);
    ctx.restore();
  };

  painel(topo, ph, atual, st.range, false, true);
  painel(topo + ph + gap, ph, anterior, st.prevRange, true, false);

  ctx.fillStyle = "rgba(255,255,255,.58)";
  ctx.font = `600 ${18 * s}px Inter`;
  if (st.handle) ctx.fillText(truncate(ctx, st.handle, W * 0.5), 48 * s, H - 24 * s);
}

function drawEditorial(ctx, W, H, data) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.6;
  malhaEscura(ctx, W, H, false);
  const pad = 48 * s;

  cabecalhoReplay(ctx, W, s, "FAIXA", "RECAP VISUAL", true);
  ctx.textAlign = "center";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `700 ${(tall ? 58 : 46) * s}px Inter`;
  ctx.fillText(st.range, W / 2, (tall ? 155 : 135) * s);
  ctx.fillStyle = "rgba(255,255,255,.62)";
  ctx.font = `600 ${(tall ? 30 : 24) * s}px Inter`;
  ctx.fillText(`${st.count} scrobbles · ${st.tempo}`, W / 2, (tall ? 198 : 172) * s);
  ctx.textAlign = "left";

  const split = tall ? W * 0.49 : W * 0.54;
  const listX = pad;
  const listW = split - pad - 24 * s;
  const colX = split + 14 * s;
  const colW = W - colX - pad;
  const qtdLista = densidadePeriodo(data);
  const lista = (titulo, itens, getNome, getMeta, y) => {
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `700 ${(tall ? 29 : 23) * s}px Inter`;
    ctx.fillText(titulo, listX, y);
    let yy = y + (tall ? 54 : 44) * s;
    itens.slice(0, qtdLista).forEach((it, i) => {
      ctx.fillStyle = "rgba(255,255,255,.42)";
      ctx.font = `600 ${(tall ? 22 : 18) * s}px Inter`;
      ctx.fillText(String(i + 1), listX, yy);
      ctx.fillStyle = "#FFFFFF";
      writeFit(ctx, getNome(it), listX + 32 * s, yy, listW - 32 * s, (tall ? 27 : 22) * s, 16 * s, "Inter", "600");
      ctx.fillStyle = "rgba(255,255,255,.5)";
      ctx.font = `500 ${(tall ? 17 : 14) * s}px Inter`;
      ctx.fillText(truncate(ctx, getMeta(it), listW - 32 * s), listX + 32 * s, yy + (tall ? 27 : 22) * s);
      yy += tall ? (qtdLista >= 5 ? 67 : 74) * s : 63 * s;
    });
    return yy;
  };

  let y = tall ? 300 * s : 250 * s;
  y = lista("Top artistas", data.topArtists || [], (a) => a.name, (a) => `${a.playcount || 0} plays`, y) + 22 * s;
  y = lista("Top músicas", data.topTracks || [], (t) => t.name, (t) => t.artist || "", y) + 22 * s;
  lista("Top álbuns", data.topAlbums || [], (a) => a.name, (a) => a.artist || "", y);

  const artista = (data.topArtists || [])[0] || {};
  const faixa = (data.topTracks || [])[0] || {};
  const album = (data.topAlbums || [])[0] || {};
  const topY = tall ? 270 * s : 230 * s;
  const d = Math.min(colW * 0.98, tall ? 370 * s : 265 * s);
  imagemRecortada(ctx, artista.image, colX + (colW - d) / 2, topY, d, d, d / 2, artista.name, false);
  const cardW = colW * 0.86;
  const cardH = tall ? 350 * s : 235 * s;
  imagemRecortada(ctx, faixa.capa, colX, topY + d * 0.72, cardW, cardH, 28 * s, faixa.name, false);
  const alb = tall ? 400 * s : 280 * s;
  imagemRecortada(ctx, album.capa, colX + colW - alb, topY + d * 0.72 + cardH * 0.74, alb, alb, 22 * s, album.name, false);

  const fy = H - (tall ? 170 : 115) * s;
  ctx.fillStyle = "rgba(255,255,255,.18)";
  ctx.fillRect(pad, fy - 34 * s, W - pad * 2, 2 * s);
  const metricas = [
    ["TOTAL", st.count],
    ["TEMPO", st.tempo.toUpperCase()],
    ["ARTISTAS", st.unique],
  ];
  const mw = (W - pad * 2) / metricas.length;
  metricas.forEach(([rot, val], i) => {
    const x = pad + mw * i;
    ctx.fillStyle = "rgba(255,255,255,.48)";
    ctx.font = `600 ${16 * s}px Inter`;
    ctx.fillText(rot, x, fy);
    ctx.fillStyle = "#FFFFFF";
    writeFit(ctx, val, x, fy + 40 * s, mw - 20 * s, 31 * s, 18 * s, "Inter", "700");
  });
  ctx.fillStyle = "rgba(255,255,255,.55)";
  ctx.font = `600 ${18 * s}px Inter`;
  if (st.handle) ctx.fillText(truncate(ctx, st.handle, W * 0.5), pad, H - 28 * s);
}

function drawParada(ctx, W, H, data) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.6;
  const square = H <= W * 1.05;
  ctx.fillStyle = "#F2EFEA";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(70,38,114,.17)";
  ctx.lineWidth = 2 * s;
  for (let y = 86 * s; y < H; y += 92 * s) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  const roxo = "#7337A5";
  const pad = 48 * s;
  cabecalhoReplay(ctx, W, s, "FAIXA · PARADA", st.range, false);
  ctx.fillStyle = roxo;
  ctx.font = `700 ${(tall ? 76 : 62) * s}px Inter`;
  ctx.fillText("Em rotação", pad, (tall ? 170 : 146) * s);
  ctx.font = `700 ${(tall ? 54 : 46) * s}px Inter`;
  const recorte = data.period === "ano" ? "no ano" : data.period === "mes" ? "no mês" : "na semana";
  ctx.fillText(recorte, pad, (tall ? 232 : 198) * s);

  const art = (data.topArtists || [])[0] || {};
  const rd = tall ? 190 * s : 145 * s;
  imagemRecortada(ctx, art.image, W - pad - rd, (tall ? 92 : 82) * s, rd, rd, rd / 2, art.name, true, "rgba(70,38,114,.2)");

  const maxItens = data.period === "semana" ? 6 : 10;
  const itens = (data.topAlbums || []).slice(0, square ? Math.min(6, maxItens) : maxItens);
  const cols = 2;
  const rows = Math.ceil(itens.length / cols);
  const startY = tall ? 316 * s : 260 * s;
  const colGap = 42 * s;
  const colW = (W - pad * 2 - colGap) / 2;
  const desejado = (tall ? (data.period === "semana" ? 250 : 224) : 150) * s;
  const rowH = Math.min(desejado, (H - startY - 115 * s) / Math.max(1, rows));
  itens.forEach((a, i) => {
    const col = i >= rows ? 1 : 0;
    const row = i % rows;
    const x = pad + col * (colW + colGap);
    const y = startY + row * rowH;
    const lado = Math.min(rowH * 0.62, tall ? 112 * s : 82 * s);
    ctx.fillStyle = "rgba(70,38,114,.7)";
    ctx.font = `700 ${(tall ? 22 : 18) * s}px Inter`;
    ctx.fillText(String(i + 1), x, y + lado * 0.62);
    imagemRecortada(ctx, a.capa, x + 34 * s, y, lado, lado, 2 * s, a.name, true, "rgba(70,38,114,.18)");
    const tx = x + 34 * s + lado + 22 * s;
    ctx.fillStyle = roxo;
    writeFit(ctx, a.name, tx, y + lado * 0.44, colW - (tx - x), (tall ? 25 : 20) * s, 14 * s, "Inter", "700");
    ctx.fillStyle = "rgba(70,38,114,.68)";
    ctx.font = `500 ${(tall ? 17 : 15) * s}px Inter`;
    ctx.fillText(truncate(ctx, `${a.artist || ""} · ${a.playcount || 0} plays`, colW - (tx - x)), tx, y + lado * 0.74);
  });

  ctx.fillStyle = roxo;
  ctx.font = `700 ${20 * s}px Inter`;
  if (st.handle) ctx.fillText(truncate(ctx, st.handle, W * 0.5), pad, H - 34 * s);
  ctx.textAlign = "right";
  ctx.fillText(`${st.count} SCROBBLES`, W - pad, H - 34 * s);
  ctx.textAlign = "left";
}

function drawFaixas(ctx, W, H, data) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.6;
  const square = H <= W * 1.05;
  const roxo = "#3F294F";
  const lima = "#C7FA61";
  ctx.fillStyle = roxo;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#F0A77F";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(W * 0.3, H * 0.12, W * 0.2, H * 0.35, 0, H * 0.29);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = lima;
  ctx.beginPath();
  ctx.moveTo(W, 0);
  ctx.bezierCurveTo(W * 0.62, H * 0.16, W * 0.92, H * 0.38, W, H * 0.45);
  ctx.closePath();
  ctx.fill();

  const pad = 42 * s;
  const px = pad;
  const py = tall ? 120 * s : 86 * s;
  const pw = W - pad * 2;
  const ph = H - py - (tall ? 90 : 65) * s;
  ctx.fillStyle = "#F1ECE4";
  roundRect(ctx, px, py, pw, ph, 30 * s);
  ctx.fill();

  ctx.fillStyle = roxo;
  ctx.textAlign = "center";
  ctx.font = `700 ${(tall ? 54 : 44) * s}px Inter`;
  const tituloFaixas = data.period === "ano" ? "Faixas do ano" : data.period === "mes" ? "Faixas do mês" : "Faixas da semana";
  ctx.fillText(tituloFaixas, W / 2, py + (tall ? 100 : 80) * s);
  ctx.fillStyle = "rgba(63,41,79,.62)";
  ctx.font = `600 ${(tall ? 20 : 17) * s}px Inter`;
  ctx.fillText("as que mais voltaram para o começo", W / 2, py + (tall ? 136 : 108) * s);
  ctx.textAlign = "left";

  const itens = (data.topTracks || []).slice(0, square ? 4 : 5);
  const startY = py + (tall ? 205 : 142) * s;
  const bottom = py + ph - (tall ? 138 : 96) * s;
  const desejado = (tall ? 218 : 142) * s;
  const rowH = Math.min(desejado, (bottom - startY) / Math.max(1, itens.length));
  const blocoH = rowH * itens.length;
  const inicio = startY + Math.max(0, (bottom - startY - blocoH) * 0.28);
  const lado = Math.min(rowH * 0.56, tall ? 112 * s : 80 * s);
  itens.forEach((t, i) => {
    const y = inicio + i * rowH + rowH * 0.5;
    ctx.fillStyle = roxo;
    ctx.textAlign = "right";
    ctx.font = `700 ${(tall ? 46 : 34) * s}px Inter`;
    ctx.fillText(`#${i + 1}`, px + (tall ? 150 : 120) * s, y + 14 * s);
    ctx.textAlign = "left";
    const ix = px + (tall ? 178 : 140) * s;
    imagemRecortada(ctx, t.capa, ix, y - lado / 2, lado, lado, 2 * s, t.name, true, "rgba(63,41,79,.18)");
    const tx = ix + lado + 28 * s;
    ctx.fillStyle = roxo;
    writeFit(ctx, t.name, tx, y - 2 * s, px + pw - tx - 34 * s, (tall ? 31 : 25) * s, 16 * s, "Inter", "700");
    ctx.fillStyle = "rgba(63,41,79,.7)";
    ctx.font = `500 ${(tall ? 20 : 17) * s}px Inter`;
    ctx.fillText(truncate(ctx, `${t.artist || ""} · ${t.playcount || 0} plays`, px + pw - tx - 34 * s), tx, y + (tall ? 30 : 24) * s);
  });

  const fy = py + ph - (tall ? 92 : 68) * s;
  ctx.fillStyle = roxo;
  ctx.font = `700 ${(tall ? 24 : 20) * s}px Inter`;
  ctx.fillText(`${st.count} scrobbles`, px + 44 * s, fy);
  ctx.textAlign = "right";
  ctx.fillText(st.tempo, px + pw - 44 * s, fy);
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,.72)";
  ctx.font = `600 ${18 * s}px Inter`;
  if (st.handle) ctx.fillText(truncate(ctx, st.handle, W * 0.6), pad, H - 30 * s);
}

function linhaOnda(ctx, W, y, amp, esp, cor, grossura) {
  ctx.save();
  ctx.strokeStyle = cor;
  ctx.lineWidth = grossura;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-grossura, y);
  const partes = 4;
  for (let i = 0; i < partes; i++) {
    const x0 = (W / partes) * i;
    const x1 = (W / partes) * (i + 1);
    const sinal = i % 2 === 0 ? 1 : -1;
    ctx.bezierCurveTo(x0 + W / (partes * 3), y + amp * sinal, x1 - W / (partes * 3), y - amp * sinal, x1, y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawOndas(ctx, W, H, data) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.6;
  const square = H <= W * 1.05;
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#7BD0D0");
  bg.addColorStop(0.5, "#C9AFC6");
  bg.addColorStop(1, "#5F356D");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  cabecalhoReplay(ctx, W, s, "FAIXA · ONDAS", st.range, true);
  const pad = 52 * s;
  ctx.fillStyle = "rgba(255,255,255,.94)";
  ctx.font = `700 ${(tall ? 48 : 38) * s}px Inter`;
  ctx.fillText("Frequência do período", pad, (tall ? 150 : 126) * s);
  ctx.fillStyle = "rgba(255,255,255,.68)";
  ctx.font = `500 ${(tall ? 22 : 18) * s}px Inter`;
  const subOndas = data.period === "ano" ? "um ano inteiro em movimento" : data.period === "mes" ? "o mês visto como ritmo" : "sete dias em repetição";
  ctx.fillText(subOndas, pad, (tall ? 188 : 158) * s);
  const mid = tall ? H * 0.31 : H * 0.32;
  for (let i = -3; i <= 3; i++) {
    linhaOnda(ctx, W, mid + i * 52 * s, 65 * s, 0, i % 2 ? "rgba(255,255,255,.86)" : "rgba(87,56,119,.88)", 34 * s);
  }

  const alvo = (data.topArtists || [])[0] || {};
  const album = (data.topAlbums || [])[0] || {};
  const size = Math.min(W * (square ? 0.36 : 0.44), tall ? 410 * s : 340 * s);
  const ix = (W - size) / 2;
  const iy = mid - size * 0.45;
  ctx.save();
  ctx.shadowColor = "rgba(32,12,42,.45)";
  ctx.shadowBlur = 42 * s;
  ctx.shadowOffsetY = 20 * s;
  imagemRecortada(ctx, alvo.image || album.capa, ix, iy, size, size, 10 * s, alvo.name || album.name, false);
  ctx.restore();

  const baseY = tall ? H * 0.59 : H * 0.66;
  const gap = 34 * s;
  const colW = (W - pad * 2 - gap) / 2;
  const lista = (x, titulo, itens, nome, meta) => {
    ctx.fillStyle = "#F8F2F3";
    ctx.font = `700 ${(tall ? 31 : 23) * s}px Inter`;
    ctx.fillText(titulo, x, baseY);
    let y = baseY + (tall ? 48 : 38) * s;
    itens.slice(0, square ? 3 : 5).forEach((it, i) => {
      ctx.fillStyle = "rgba(255,255,255,.72)";
      ctx.font = `600 ${(tall ? 19 : 16) * s}px Inter`;
      ctx.fillText(`#${i + 1}`, x, y);
      ctx.fillStyle = "#FFFFFF";
      writeFit(ctx, nome(it), x + 42 * s, y, colW - 42 * s, (tall ? 27 : 20) * s, 14 * s, "Inter", "700");
      ctx.fillStyle = "rgba(255,255,255,.64)";
      ctx.font = `500 ${(tall ? 16 : 13) * s}px Inter`;
      ctx.fillText(truncate(ctx, meta(it), colW - 42 * s), x + 42 * s, y + (tall ? 23 : 19) * s);
      y += tall ? 74 * s : 52 * s;
    });
  };
  lista(pad, "Top artistas", data.topArtists || [], (a) => a.name, (a) => `${a.playcount || 0} plays`);
  lista(pad + colW + gap, "Top músicas", data.topTracks || [], (t) => t.name, (t) => t.artist || "");

  if (tall) {
    const fy = H - 118 * s;
    ctx.fillStyle = "rgba(255,255,255,.28)";
    ctx.fillRect(pad, fy - 38 * s, W - pad * 2, 2 * s);
    ctx.fillStyle = "rgba(255,255,255,.7)";
    ctx.font = `600 ${18 * s}px Inter`;
    ctx.fillText("ESCUTA", pad, fy);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `700 ${28 * s}px Inter`;
    ctx.fillText(`${st.count} scrobbles · ${st.tempo}`, pad, fy + 38 * s);
  }

  ctx.fillStyle = "rgba(255,255,255,.74)";
  ctx.font = `600 ${18 * s}px Inter`;
  if (st.handle) ctx.fillText(truncate(ctx, st.handle, W * 0.5), pad, H - 34 * s);
  ctx.textAlign = "right";
  ctx.fillText(`${st.count} · ${st.tempo}`, W - pad, H - 34 * s);
  ctx.textAlign = "left";
}

const DRAWERS = {
  replay: drawReplay,
  estrela: drawEstrela,
  comparativo: drawComparativo,
  editorial: drawEditorial,
  parada: drawParada,
  faixas: drawFaixas,
  ondas: drawOndas,
  mixtape: drawMixtape,
  vidro: drawVidro,
  lambe: drawLambe,
  xerox: drawXerox,
  cupom: drawCupom,
  mosaico: drawMosaico,
  capa: drawCapa,
};

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
  const bruto = canvas.getContext("2d");
  bruto.textBaseline = "alphabetic";
  const ctx = contextoTematico(bruto, temaDe(data));
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
