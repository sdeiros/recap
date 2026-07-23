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
  text = String(text ?? "");
  maxW = Math.max(8, Number(maxW) || 8);
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


/* ---------- fechamento comum e área segura ---------- */
const FOOTER_BASE = 92;

function alturaRodape(W, H) {
  const s = W / 1080;
  /* Mais presença visual e respiro, no clima dos references enviados. */
  const base = H >= W * 1.6 ? 152 : H > W * 1.08 ? 136 : 122;
  return base * s;
}

function malhaClaraArea(ctx, x, y, w, h) {
  ctx.fillStyle = "#E9E5DD";
  ctx.fillRect(x, y, w, h);
  [
    [x + w * 0.88, y + h * 0.12, w * 0.74, "rgba(255,126,61,.62)"],
    [x + w * 0.14, y + h * 0.88, w * 0.68, "rgba(63,205,197,.42)"],
    [x + w * 0.66, y + h * 0.54, w * 0.58, "rgba(152,108,255,.16)"],
  ].forEach(([gx, gy, r, c]) => {
    const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, r);
    g.addColorStop(0, c);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, h);
  });
}

function malhaEscuraArea(ctx, x, y, w, h, quente = false) {
  ctx.fillStyle = quente ? "#0E0908" : "#07070A";
  ctx.fillRect(x, y, w, h);
  const manchas = quente
    ? [
        [x + w * 0.16, y + h * 0.18, w * 0.62, "rgba(255,120,35,.46)"],
        [x + w * 0.94, y + h * 0.56, w * 0.7, "rgba(118,45,255,.22)"],
      ]
    : [
        [x + w * 0.12, y + h * 0.18, w * 0.58, "rgba(255,196,0,.34)"],
        [x + w * 0.92, y + h * 0.42, w * 0.72, "rgba(0,178,255,.22)"],
        [x + w * 0.12, y + h * 0.92, w * 0.52, "rgba(255,37,98,.16)"],
      ];
  manchas.forEach(([gx, gy, r, c]) => {
    const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, r);
    g.addColorStop(0, c);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, h);
  });
}

function fillFooterBackground(ctx, W, y, h, layoutId, pal) {
  switch (layoutId) {
    case "replay":
      malhaClaraArea(ctx, 0, y, W, h);
      return { claro: "#111115", fraco: "rgba(17,17,21,.55)", linha: PINK };
    case "ondas": {
      const g = ctx.createLinearGradient(0, y, 0, y + h);
      g.addColorStop(0, "#8F6FA1");
      g.addColorStop(1, "#6A427C");
      ctx.fillStyle = g;
      ctx.fillRect(0, y, W, h);
      return { claro: "#FFFFFF", fraco: "rgba(255,255,255,.76)", linha: PINK };
    }
    case "cupom":
    case "xerox":
    case "lambe":
      ctx.fillStyle = "#ECE7DE";
      ctx.fillRect(0, y, W, h);
      return { claro: "#111113", fraco: "rgba(17,17,19,.56)", linha: PINK };
    case "faixas":
    case "parada":
      ctx.fillStyle = "#EEE8DE";
      ctx.fillRect(0, y, W, h);
      return { claro: "#121216", fraco: "rgba(18,18,22,.56)", linha: PINK };
    case "estrela":
    case "comparativo":
    case "editorial":
    case "mixtape":
    case "vidro":
    case "mosaico":
    case "capa":
      malhaEscuraArea(ctx, 0, y, W, h, true);
      return { claro: "#F7F4EE", fraco: "rgba(247,244,238,.62)", linha: PINK };
    default: {
      const fundo = pal && !pal.original ? mistura(pal.bg, pal.surface || pal.bg, 0.45) : "#121216";
      const g = ctx.createLinearGradient(0, y, W, y + h);
      g.addColorStop(0, fundo);
      g.addColorStop(1, mistura(fundo, pal?.accent || PINK, 0.12));
      ctx.fillStyle = g;
      ctx.fillRect(0, y, W, h);
      const claro = pal && !pal.original ? textoSeguro(fundo, pal.text) : "#F5F2EC";
      const fraco = claro.includes('#111') ? "rgba(17,17,21,.58)" : "rgba(255,255,255,.7)";
      return { claro, fraco, linha: pal?.accent || PINK };
    }
  }
}

function drawFaixaFooter(ctx, W, H, data, pal, layoutId = "") {
  const s = W / 1080;
  const h = alturaRodape(W, H);
  const y = H - h;
  const st = strings(data);
  const pad = 52 * s;
  const brandPad = 56 * s;
  const assinatura = st.handle || (data?.user?.name ? `@${data.user.name}` : "sua escuta em cartaz");

  ctx.save();
  const { claro, fraco, linha } = fillFooterBackground(ctx, W, y, h, layoutId, pal);
  ctx.fillStyle = rgbaDe(linha, 0.96);
  ctx.fillRect(0, y, W, Math.max(4, 5 * s));

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillStyle = claro;
  ctx.font = `700 ${30 * s}px Archivo`;
  ctx.fillText(truncate(ctx, st.range, W * 0.5), pad, y + 58 * s);
  ctx.fillStyle = fraco;
  ctx.font = `500 ${21 * s}px Archivo`;
  ctx.fillText(truncate(ctx, assinatura, W * 0.56), pad, y + 103 * s);

  ctx.textAlign = "right";
  ctx.fillStyle = fraco;
  tracking(ctx, 0.5 * s);
  ctx.font = `600 ${18 * s}px Archivo`;
  ctx.fillText("SUA ESCUTA EM", W - brandPad, y + 55 * s);
  tracking(ctx, 0);
  ctx.fillStyle = claro;
  ctx.font = `800 ${35 * s}px Syne`;
  ctx.fillText("FAIXA", W - brandPad, y + 105 * s);
  ctx.restore();
}

function limiteConteudo(H, s, reserva = 24) {
  return H - reserva * s;
}

function caberEntre(inicio, fim, quantidade, desejado, minimo) {
  if (!quantidade) return desejado;
  return Math.max(minimo, Math.min(desejado, (fim - inicio) / quantidade));
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
      return `${a.playcount} REPROD. · ${formatTempo(seg, true).toUpperCase()}`;
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
  const alturaBanda = tall ? H * 0.255 : square ? H * 0.235 : H * 0.245;
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
  y += (tall ? 136 : 116) * s;
  ctx.fillStyle = CLARO;
  const numSize = fitText(ctx, st.count, W * 0.42, (tall ? 132 : 108) * s, "Anton");
  ctx.font = `${numSize}px Anton`;
  ctx.fillText(st.count, pad, y);
  const wNum = ctx.measureText(st.count).width;

  ctx.fillStyle = accent;
  writeFit(ctx, "REPRODUÇÕES", pad + wNum + 20 * s, y, W - pad * 2 - wNum - 20 * s, (tall ? 34 : 29) * s, 20 * s, "Archivo", "700");

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
    ctx.fillText(`Nenhuma reprodução em ${st.curto}.`, pad, my + (tall ? 56 : 46) * s);

    grain(ctx, W, H, 0.04, Math.round(W * H * 0.00024));
    return;
  }

  /* ---------- duas colunas ---------- */
  const colTop = y + (tall ? 70 : 58) * s;
  const rowH = tall ? 94 * s : square ? 78 * s : 86 * s;
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

  /* ---------- fechamento editorial ---------- */
  const fimListas = Math.max(fimL, fimR);
  const album = (data.topAlbums || [])[0];
  const blocoH = tall ? 116 * s : 94 * s;
  const resumoY = H - (tall ? 42 : 34) * s;
  const maxBlocoY = resumoY - blocoH - (tall ? 44 : 34) * s;
  const blocoY = Math.min(maxBlocoY, fimListas + (tall ? 30 : 22) * s);

  if (album && blocoY > fimListas - 2 * s) {
    ctx.fillStyle = RULE;
    ctx.fillRect(pad, blocoY - 18 * s, W - pad * 2, 2 * s);
    ctx.fillStyle = "#17171A";
    ctx.fillRect(pad, blocoY, W - pad * 2, blocoH);
    ctx.fillStyle = accent;
    ctx.font = `700 ${(tall ? 18 : 16) * s}px Archivo`;
    ctx.fillText(data.period === "ano" ? "ÁLBUM DO ANO" : data.period === "mes" ? "ÁLBUM DO MÊS" : "ÁLBUM MAIS OUVIDO", pad + 24 * s, blocoY + 34 * s);
    ctx.fillStyle = CLARO;
    writeFit(ctx, album.name.toUpperCase(), pad + 24 * s, blocoY + (tall ? 80 : 68) * s, W * 0.57, (tall ? 36 : 31) * s, 20 * s, "Anton");
    ctx.textAlign = "right";
    ctx.fillStyle = MEIO;
    ctx.font = `600 ${(tall ? 19 : 17) * s}px Archivo`;
    ctx.fillText(truncate(ctx, album.artist || "", W * 0.27), W - pad - 24 * s, blocoY + (tall ? 78 : 67) * s);
    ctx.textAlign = "left";
  }

  ctx.fillStyle = MEIO;
  ctx.font = `600 ${(tall ? 18 : 16) * s}px Archivo`;
  const resumo = `${st.tempo.toUpperCase()} OUVINDO · ${st.unique} ARTISTAS`;
  ctx.fillText(resumo, pad, resumoY);

  grain(ctx, W, H, 0.04, Math.round(W * H * 0.00024));
}

/* ============================================================
   LAYOUT 2 — VIDRO (gradiente de malha, muito respiro)
   ============================================================ */
function drawVidro(ctx, W, H, data) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.6;
  const square = H <= W * 1.05;
  const recap = st.p.recap;
  const pad = (tall ? 64 : 54) * s;
  const F = "Inter, sans-serif";

  ctx.fillStyle = "#090A0F";
  ctx.fillRect(0, 0, W, H);

  const blobs = recap
    ? [
        [W * 0.12, H * 0.18, W * 0.82, "#FFC531"],
        [W * 0.92, H * 0.38, W * 0.78, "#FF6A00"],
        [W * 0.08, H * 0.72, W * 0.86, "#B71F62"],
        [W * 0.85, H * 0.94, W * 0.66, "#5B2BFF"],
      ]
    : [
        [W * 0.14, H * 0.18, W * 0.82, "#FF3B6B"],
        [W * 0.92, H * 0.34, W * 0.80, "#7B2BFF"],
        [W * 0.08, H * 0.72, W * 0.88, "#0A84FF"],
        [W * 0.86, H * 0.94, W * 0.68, "#FF9F0A"],
      ];
  blobs.forEach(([x, y, r, c]) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, c);
    g.addColorStop(1, "rgba(9,10,15,0)");
    ctx.globalAlpha = 0.62;
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  });
  ctx.globalAlpha = 1;

  const veil = ctx.createLinearGradient(0, 0, 0, H);
  veil.addColorStop(0, "rgba(0,0,0,.38)");
  veil.addColorStop(0.42, "rgba(0,0,0,.18)");
  veil.addColorStop(1, "rgba(0,0,0,.62)");
  ctx.fillStyle = veil;
  ctx.fillRect(0, 0, W, H);

  const bandaH = tall ? H * 0.225 : H * 0.20;
  const banda = bandaTopo(ctx, W, H, data, bandaH, "rgba(9,10,15,1)");
  const topY = banda ? banda + (tall ? 38 : 30) * s : 80 * s;

  ctx.fillStyle = "rgba(255,255,255,.72)";
  ctx.font = `600 ${(tall ? 26 : 22) * s}px ${F}`;
  const abertura = data.period === "ano" ? `Arquivo ${st.range}` : data.period === "mes" ? "Mapa do mês" : "Recorte da semana";
  ctx.fillText(abertura, pad, topY);

  const numY = topY + (tall ? 152 : 122) * s;
  ctx.fillStyle = "#FFFFFF";
  const numSize = fitText(ctx, st.count, W * 0.50, tall ? 162 * s : 126 * s, F, "700");
  ctx.font = `700 ${numSize}px ${F}`;
  ctx.fillText(st.count, pad, numY);

  ctx.fillStyle = "rgba(255,255,255,.82)";
  ctx.font = `500 ${(tall ? 33 : 27) * s}px ${F}`;
  ctx.fillText("reproduções registradas", pad, numY + (tall ? 48 : 40) * s);
  ctx.fillStyle = "rgba(255,255,255,.66)";
  ctx.font = `500 ${(tall ? 27 : 22) * s}px ${F}`;
  const apoio = st.temTempo ? `${st.tempoLongo} de música${st.deltaTxt ? ` · ${st.deltaTxt}` : ""}` : st.deltaTxt;
  if (apoio) ctx.fillText(apoio, pad, numY + (tall ? 92 : 76) * s);

  const cardTop = numY + (tall ? 132 : 108) * s;
  const cardBottom = H - (tall ? 38 : 30) * s;
  const cardH = Math.max(300 * s, cardBottom - cardTop);
  ctx.save();
  roundRect(ctx, pad, cardTop, W - pad * 2, cardH, 28 * s);
  ctx.fillStyle = "rgba(255,255,255,.145)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.28)";
  ctx.lineWidth = 2 * s;
  ctx.stroke();
  ctx.restore();
  ctx.fillStyle = recap ? GOLD : PINK;
  ctx.fillRect(pad, cardTop, 12 * s, cardH);

  const inner = pad + (tall ? 54 : 44) * s;
  const gap = (tall ? 40 : 30) * s;
  const colW = (W - inner * 2 - gap) / 2;
  const titleY = cardTop + (tall ? 64 : 52) * s;
  const maxItens = square ? 3 : 5;
  const artists = st.artists.slice(0, maxItens);
  const tracks = st.tracks.slice(0, maxItens);
  const maxRows = Math.max(artists.length, tracks.length, 1);
  const albumReserve = st.album ? (tall ? 178 : 138) * s : 0;
  const metricsReserve = (tall ? 118 : 96) * s;
  const rowAreaTop = titleY + (tall ? 58 : 48) * s;
  const rowAreaBottom = cardBottom - albumReserve - metricsReserve - (tall ? 32 : 24) * s;
  const rowH = Math.max((tall ? 72 : 58) * s, Math.min((tall ? 94 : 74) * s, (rowAreaBottom - rowAreaTop) / maxRows));

  const column = (x, title, items, get, meta) => {
    ctx.fillStyle = "rgba(255,255,255,.64)";
    ctx.font = `700 ${(tall ? 24 : 20) * s}px ${F}`;
    ctx.fillText(title, x, titleY);
    let y = rowAreaTop;
    items.forEach((it, i) => {
      ctx.fillStyle = i === 0 ? (recap ? GOLD : PINK) : "rgba(255,255,255,.46)";
      ctx.font = `700 ${(tall ? 23 : 19) * s}px ${F}`;
      ctx.fillText(String(i + 1), x, y);
      ctx.fillStyle = "#FFFFFF";
      writeFit(ctx, get(it), x + 34 * s, y, colW - 34 * s, (tall ? 31 : 25) * s, 17 * s, F, i === 0 ? "700" : "600");
      ctx.fillStyle = "rgba(255,255,255,.58)";
      writeFit(ctx, meta(it), x + 34 * s, y + (tall ? 30 : 25) * s, colW - 34 * s, (tall ? 20 : 17) * s, 13 * s, F, "500");
      y += rowH;
    });
  };

  column(inner, "ARTISTAS", artists, (a) => a.name, st.metaArtista);
  column(inner + colW + gap, "MÚSICAS", tracks, (t) => t.name, st.metaFaixa);

  let albumY = cardBottom - metricsReserve - albumReserve;
  if (st.album) {
    ctx.strokeStyle = "rgba(255,255,255,.22)";
    ctx.lineWidth = 2 * s;
    ctx.beginPath();
    ctx.moveTo(inner, albumY);
    ctx.lineTo(W - inner, albumY);
    ctx.stroke();
    albumY += (tall ? 30 : 24) * s;
    const cover = tall ? 104 * s : 82 * s;
    imagemRecortada(ctx, st.album.capa, inner, albumY, cover, cover, 10 * s, st.album.name, true, "rgba(255,255,255,.2)");
    const tx = inner + cover + 24 * s;
    ctx.fillStyle = "rgba(255,255,255,.58)";
    ctx.font = `700 ${(tall ? 19 : 16) * s}px ${F}`;
    ctx.fillText(data.period === "ano" ? "ÁLBUM DO ANO" : data.period === "mes" ? "ÁLBUM DO MÊS" : "ÁLBUM MAIS OUVIDO", tx, albumY + 24 * s);
    ctx.fillStyle = "#FFFFFF";
    writeFit(ctx, st.album.name, tx, albumY + (tall ? 62 : 50) * s, W - inner - tx, (tall ? 34 : 27) * s, 19 * s, F, "700");
    ctx.fillStyle = "rgba(255,255,255,.62)";
    ctx.font = `500 ${(tall ? 21 : 17) * s}px ${F}`;
    ctx.fillText(truncate(ctx, st.album.artist || "", W - inner - tx), tx, albumY + (tall ? 91 : 74) * s);
  }

  const metricsY = cardBottom - metricsReserve + (tall ? 32 : 26) * s;
  ctx.strokeStyle = "rgba(255,255,255,.22)";
  ctx.beginPath();
  ctx.moveTo(inner, metricsY - 22 * s);
  ctx.lineTo(W - inner, metricsY - 22 * s);
  ctx.stroke();
  const metrics = [["REPRODUÇÕES", st.count], ["TEMPO", st.tempo.toUpperCase()], ["ARTISTAS", st.unique]];
  const mw = (W - inner * 2) / metrics.length;
  metrics.forEach(([label, value], i) => {
    const x = inner + mw * i;
    ctx.fillStyle = "rgba(255,255,255,.54)";
    ctx.font = `700 ${(tall ? 16 : 14) * s}px ${F}`;
    ctx.fillText(label, x, metricsY);
    ctx.fillStyle = "#FFFFFF";
    writeFit(ctx, value, x, metricsY + (tall ? 42 : 35) * s, mw - 18 * s, (tall ? 32 : 26) * s, 18 * s, F, "700");
  });
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
  ctx.fillText("REPRODUÇÕES", pad, y);

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

  const headerY = banda ? banda + 58 * s : 116 * s;
  ctx.fillStyle = PAPER;
  ctx.font = `700 ${27 * s}px 'Space Grotesk'`;
  ctx.fillText(st.p.recap ? `FAIXA ///// RECAP ${st.range}` : `FAIXA ///// ${st.p.poster}`, pad, headerY);

  const nS = fitText(ctx, st.count, W * 0.54, (tall ? 188 : 166) * s, "Anton");
  const numberTop = headerY + 38 * s;
  let y = numberTop + nS * 0.82;
  ctx.font = `${nS}px Anton`;
  ctx.fillStyle = PAPER;
  ctx.fillText(st.count, pad, y);
  y += (tall ? 58 : 48) * s;
  ctx.fillStyle = accent;
  const rotuloRepro = data.period === "ano" ? "REPRODUÇÕES NO ANO" : data.period === "mes" ? "REPRODUÇÕES NO MÊS" : "REPRODUÇÕES NA SEMANA";
  writeFit(ctx, rotuloRepro, pad, y, W - pad * 2, (tall ? 47 : 40) * s, 25 * s, "Anton");

  if (st.deltaTxt) {
    y += 50 * s;
    ctx.fillStyle = PAPER;
    ctx.font = `700 ${24 * s}px 'Space Grotesk'`;
    ctx.fillText(st.deltaTxt.toUpperCase(), pad, y);
  }

  y += (tall ? 64 : 54) * s;
  ctx.strokeStyle = PAPER;
  ctx.lineWidth = 4 * s;
  ctx.setLineDash([24 * s, 16 * s]);
  ctx.beginPath();
  ctx.moveTo(pad, y);
  ctx.lineTo(W - pad, y);
  ctx.stroke();
  ctx.setLineDash([]);

  const colTop = y + (tall ? 74 : 60) * s;
  const rowH = tall ? 84 * s : 74 * s;

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

  if (st.album && y < H - (tall ? 150 : 122) * s) {
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

  ctx.fillStyle = "rgba(243,237,226,0.64)";
  ctx.font = `600 ${17 * s}px 'Space Grotesk'`;
  ctx.fillText(`${st.tempo.toUpperCase()} OUVINDO · ${st.unique} ARTISTAS`, pad, H - 32 * s);
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
  const hero = (data.topArtists || [])[0] || {};

  ctx.fillStyle = "#141210";
  ctx.fillRect(0, 0, W, H);
  const halo = ctx.createRadialGradient(W * 0.46, H * 0.38, 0, W * 0.46, H * 0.38, W * 0.95);
  halo.addColorStop(0, "rgba(255,255,255,.10)");
  halo.addColorStop(1, "rgba(0,0,0,.58)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, W, H);

  const px = 96 * s;
  const py = tall ? 86 * s : 64 * s;
  const pw = W - px * 2;
  const ph = H - py * 2;

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,.48)";
  ctx.shadowBlur = 42 * s;
  ctx.shadowOffsetY = 18 * s;
  ctx.fillStyle = "#F4F1EB";
  ctx.fillRect(px, py, pw, ph);
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.rect(px, py, pw, ph);
  ctx.clip();
  if (papelImg) cobrir(ctx, papelImg, px, py, pw, ph);
  else {
    ctx.fillStyle = "#F4F1EB";
    ctx.fillRect(px, py, pw, ph);
  }
  poeira(ctx, px, py, pw, ph, s);
  const vinheta = ctx.createRadialGradient(px + pw / 2, py + ph / 2, 0, px + pw / 2, py + ph / 2, pw * 0.75);
  vinheta.addColorStop(0, "rgba(255,255,255,0)");
  vinheta.addColorStop(1, "rgba(0,0,0,.06)");
  ctx.fillStyle = vinheta;
  ctx.fillRect(px, py, pw, ph);
  ctx.restore();

  const pad = px + 46 * s;
  const inner = pw - 92 * s;
  const right = pad + inner;
  const tinta = "#12100E";
  const fraco = "rgba(18,16,14,.66)";
  let y = py + 72 * s;

  ctx.fillStyle = tinta;
  ctx.textAlign = "center";
  ctx.font = `700 ${(tall ? 84 : 68) * s}px Archivo`;
  ctx.fillText(st.p.recap ? "RECAP" : st.p.poster, px + pw / 2, y);
  y += (tall ? 34 : 28) * s;
  ctx.font = `600 ${(tall ? 22 : 19) * s}px Archivo`;
  ctx.fillText((hero.name || st.handle || "FAIXA").toUpperCase(), px + pw / 2, y);
  ctx.textAlign = "left";

  y += (tall ? 56 : 46) * s;
  ctx.font = `400 ${(tall ? 17 : 15) * s}px ${M}`;
  ctx.fillStyle = tinta;
  ctx.fillText(`ORDER #${String(data.count || 0).padStart(4, "0")} FOR LAST.FM`, pad, y);
  y += (tall ? 30 : 26) * s;
  ctx.fillText(st.range.toUpperCase(), pad, y);

  const regra = () => {
    ctx.strokeStyle = "rgba(18,16,14,.45)";
    ctx.lineWidth = 2 * s;
    ctx.setLineDash([8 * s, 8 * s]);
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(right, y);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  y += (tall ? 28 : 24) * s;
  regra();
  y += (tall ? 36 : 30) * s;
  ctx.fillStyle = fraco;
  ctx.font = `400 ${(tall ? 17 : 15) * s}px ${M}`;
  ctx.fillText("QTY   ITEM", pad, y);
  const amt = "AMT";
  ctx.fillText(amt, right - ctx.measureText(amt).width, y);
  y += (tall ? 12 : 10) * s;
  regra();

  const drawRow = (qtd, name, amtText, sub = "") => {
    y += (tall ? 32 : 28) * s;
    ctx.fillStyle = tinta;
    ctx.font = `400 ${(tall ? 18 : 16) * s}px ${M}`;
    const q = String(qtd).padStart(2, "0");
    const amtW = ctx.measureText(amtText).width;
    ctx.fillText(q, pad, y);
    ctx.fillText(amtText, right - amtW, y);
    writeFit(ctx, name.toUpperCase(), pad + 60 * s, y, inner - 60 * s - amtW - 16 * s, (tall ? 18 : 16) * s, 12 * s, M, "400");
    if (sub) {
      y += (tall ? 22 : 19) * s;
      ctx.fillStyle = fraco;
      ctx.font = `400 ${(tall ? 14 : 13) * s}px ${M}`;
      writeFit(ctx, sub.toUpperCase(), pad + 60 * s, y, inner - 60 * s, (tall ? 14 : 13) * s, 11 * s, M, "400");
    }
  };

  const tracks = (data.topTracks || []).slice(0, tall ? 7 : 6);
  tracks.forEach((t) => {
    const dur = formatTempo((t.playcount || 0) * (t.duration > 0 ? t.duration : (data.mediaDur || 210)), true).toUpperCase();
    drawRow(t.playcount || 0, t.name || "—", dur, t.artist || "");
  });

  y += (tall ? 24 : 20) * s;
  regra();
  y += (tall ? 36 : 30) * s;
  ctx.fillStyle = tinta;
  ctx.font = `700 ${(tall ? 18 : 16) * s}px ${M}`;
  ctx.fillText("ARTISTAS", pad, y);
  y += (tall ? 18 : 16) * s;

  (data.topArtists || []).slice(0, 4).forEach((a, i) => {
    drawRow(a.playcount || 0, a.name || "—", formatTempo((a.playcount || 0) * (data.mediaDur || 210), true).toUpperCase(), i === 0 && st.album ? `TOP ALBUM: ${st.album.name}` : "");
  });

  y += (tall ? 24 : 20) * s;
  regra();
  y += (tall ? 34 : 28) * s;
  ctx.fillStyle = tinta;
  ctx.font = `700 ${(tall ? 18 : 16) * s}px ${M}`;
  ctx.fillText("ITEM COUNT:", pad, y);
  const totalTracks = String(tracks.length);
  ctx.fillText(totalTracks, right - ctx.measureText(totalTracks).width, y);
  y += (tall ? 28 : 24) * s;
  ctx.fillText("TOTAL:", pad, y);
  ctx.font = `700 ${(tall ? 34 : 28) * s}px ${M}`;
  ctx.fillText(st.count, right - ctx.measureText(st.count).width, y);

  y += (tall ? 44 : 36) * s;
  ctx.font = `400 ${(tall ? 17 : 15) * s}px ${M}`;
  ctx.fillStyle = tinta;
  ctx.fillText(`CARD #: **** **** **** ${new Date().getFullYear()}`, pad, y);
  y += (tall ? 26 : 22) * s;
  ctx.fillText(`AUTH CODE: ${String((data.count || 0) * 123421 % 999999).padStart(6, "0")}`, pad, y);
  y += (tall ? 26 : 22) * s;
  ctx.fillText(`CARDHOLDER: ${(hero.name || "FAIXA").toUpperCase()}`, pad, y);

  y += (tall ? 36 : 28) * s;
  regra();

  const barcodeY = ph + py - (tall ? 210 : 186) * s;
  let bx = pad;
  let seed = (data.count || 7) * 31 + 17;
  ctx.fillStyle = tinta;
  while (bx < right - 4 * s) {
    seed = (seed * 9301 + 49297) % 233280;
    const bw = 2.3 * s + (seed / 233280) * 5.5 * s;
    ctx.fillRect(bx, barcodeY, bw, (tall ? 88 : 72) * s);
    bx += bw + (2 + (seed % 4)) * s;
  }

  ctx.textAlign = "center";
  ctx.fillStyle = fraco;
  ctx.font = `400 ${(tall ? 15 : 14) * s}px ${M}`;
  ctx.fillText("OBRIGADO PELA PREFERÊNCIA", px + pw / 2, barcodeY + (tall ? 124 : 104) * s);
  ctx.fillText("VOLTE SEMPRE", px + pw / 2, barcodeY + (tall ? 150 : 128) * s);
  ctx.textAlign = "left";
}

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
  writeFit(ctx, "REPRODUÇÕES", xMet, y - 8 * s, W - pad - xMet, 28 * s, 18 * s, "Archivo", "700");
  if (st.temTempo) {
    ctx.fillStyle = "#8C8C8C";
    ctx.font = `500 ${26 * s}px Archivo`;
    ctx.fillText(st.tempo.toUpperCase(), xMet, y + 26 * s);
  }

  /* listas em duas colunas */
  y += (tall ? 74 : 58) * s;
  const gap = 44 * s;
  const colW = (W - pad * 2 - gap) / 2;
  const rowH = tall ? Math.min(112 * s, Math.max(78 * s, (H - y - 250 * s) / 5)) : 62 * s;

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
    const by = Math.min(H - 150 * s, Math.max(fimA, fimM) + 34 * s);
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
  const square = H <= W * 1.05;
  const accent = st.p.recap ? GOLD : PINK;
  const artists = data.topArtists || [];
  const tracks = data.topTracks || [];
  const albums = data.topAlbums || [];
  const artista = artists[0] || {};
  const album = albums[0] || {};
  const faixa = tracks[0] || {};
  const heroUrl = data.artistImage || artista.image || album.capa || faixa.capa || "";
  const heroImg = capaDe(heroUrl);
  const titulo = artista.name || album.name || faixa.name || "Sem dados";
  const subtitulo = artista.name
    ? `${artista.playcount || 0} reproduções · ${formatTempo((artista.playcount || 0) * (data.mediaDur || 210), true)}`
    : album.artist || faixa.artist || "";
  const pad = (tall ? 60 : 48) * s;
  const footerGap = tall ? 212 * s : 170 * s;

  ctx.fillStyle = "#09090C";
  ctx.fillRect(0, 0, W, H);
  if (heroImg) {
    ctx.save();
    ctx.filter = `blur(${62 * s}px) saturate(1.28)`;
    ctx.globalAlpha = 0.66;
    cobrir(ctx, heroImg, -W * 0.10, -H * 0.08, W * 1.22, H * 1.16);
    ctx.restore();
  }
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "rgba(15,11,14,.24)");
  bg.addColorStop(0.36, "rgba(8,8,11,.45)");
  bg.addColorStop(1, "rgba(8,8,11,.92)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#FFFFFF";
  tracking(ctx, 3 * s);
  ctx.font = `700 ${(tall ? 24 : 20) * s}px Archivo`;
  ctx.fillText(st.p.recap ? `FAIXA — RECAP ${st.range}` : `FAIXA — ${st.p.poster}`, pad, pad + 28 * s);
  tracking(ctx, 0);

  const heroX = pad;
  const heroY = pad + (tall ? 70 : 56) * s;
  const heroW = W - pad * 2;
  const heroH = tall ? Math.min(610 * s, H * 0.33) : Math.min(440 * s, H * 0.30);

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,.48)";
  ctx.shadowBlur = 42 * s;
  ctx.shadowOffsetY = 18 * s;
  if (heroImg) {
    imagemRecortada(ctx, heroUrl, heroX, heroY, heroW, heroH, 14 * s, titulo, false, "rgba(255,255,255,.16)");
  } else {
    roundRect(ctx, heroX, heroY, heroW, heroH, 14 * s);
    const g = ctx.createLinearGradient(heroX, heroY, heroX + heroW, heroY + heroH);
    g.addColorStop(0, "#7B228A");
    g.addColorStop(1, "#9C3A1C");
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.20)";
    ctx.lineWidth = 3 * s;
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.92)";
    ctx.textAlign = "center";
    ctx.font = `${Math.min(heroW, heroH) * 0.34}px Anton`;
    ctx.fillText((titulo || "?").charAt(0).toUpperCase(), heroX + heroW / 2, heroY + heroH * 0.60);
    ctx.font = `600 ${22 * s}px Inter`;
    ctx.fillText("SEM IMAGEM DISPONÍVEL", heroX + heroW / 2, heroY + heroH * 0.80);
    ctx.textAlign = "left";
  }
  ctx.restore();

  let y = heroY + heroH + (tall ? 52 : 40) * s;
  ctx.fillStyle = accent;
  writeFit(ctx, titulo.toUpperCase(), pad, y, W - pad * 2, (tall ? 74 : 56) * s, 28 * s, "Anton");
  y += (tall ? 42 : 34) * s;
  ctx.fillStyle = "rgba(255,255,255,.74)";
  ctx.font = `500 ${(tall ? 28 : 22) * s}px Archivo`;
  ctx.fillText(truncate(ctx, subtitulo || (data.period === "semana" ? "artista em foco" : "destaque do período"), W - pad * 2), pad, y);

  const panelY = y + (tall ? 34 : 28) * s;
  const panelH = H - panelY - footerGap;
  ctx.save();
  roundRect(ctx, pad, panelY, W - pad * 2, panelH, 24 * s);
  ctx.fillStyle = "rgba(255,255,255,.10)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.18)";
  ctx.lineWidth = 2 * s;
  ctx.stroke();
  ctx.restore();

  const inner = pad + 28 * s;
  const gap = 30 * s;
  const colW = (W - inner * 2 - gap) / 2;
  const cardTop = panelY + 34 * s;
  const card = (x0, label, image, title, meta) => {
    ctx.fillStyle = "rgba(255,255,255,.52)";
    ctx.font = `700 ${(tall ? 16 : 14) * s}px Archivo`;
    ctx.fillText(label, x0, cardTop);
    const cover = tall ? 92 * s : 74 * s;
    imagemRecortada(ctx, image, x0, cardTop + 20 * s, cover, cover, 10 * s, title, true, "rgba(255,255,255,.14)");
    const tx = x0 + cover + 18 * s;
    ctx.fillStyle = "#FFFFFF";
    writeFit(ctx, title || "—", tx, cardTop + (tall ? 52 : 42) * s, colW - cover - 18 * s, (tall ? 30 : 24) * s, 15 * s, "Inter", "700");
    ctx.fillStyle = "rgba(255,255,255,.60)";
    writeFit(ctx, meta || "", tx, cardTop + (tall ? 84 : 67) * s, colW - cover - 18 * s, (tall ? 18 : 15) * s, 11 * s, "Inter", "500");
  };
  card(inner, data.period === "ano" ? "FAIXA DO ANO" : data.period === "mes" ? "FAIXA DO MÊS" : "FAIXA MAIS OUVIDA", faixa.capa, faixa.name, faixa.artist || "");
  card(inner + colW + gap, data.period === "ano" ? "ÁLBUM DO ANO" : data.period === "mes" ? "ÁLBUM DO MÊS" : "ÁLBUM MAIS OUVIDO", album.capa, album.name, album.artist || "");

  const line1 = cardTop + (tall ? 136 : 110) * s;
  ctx.strokeStyle = "rgba(255,255,255,.14)";
  ctx.beginPath();
  ctx.moveTo(inner, line1);
  ctx.lineTo(W - inner, line1);
  ctx.stroke();

  const listTitleY = line1 + (tall ? 34 : 28) * s;
  const leftItems = artists.slice(0, tall ? 4 : 3);
  const rightItems = tracks.slice(0, tall ? 4 : 3);
  const rowH = tall ? 56 * s : 48 * s;
  const drawMiniList = (x0, title, items, getName, getMeta) => {
    ctx.fillStyle = "rgba(255,255,255,.52)";
    ctx.font = `700 ${(tall ? 16 : 14) * s}px Archivo`;
    ctx.fillText(title, x0, listTitleY);
    let yy = listTitleY + (tall ? 34 : 28) * s;
    items.forEach((it, i) => {
      ctx.fillStyle = i === 0 ? accent : "rgba(255,255,255,.44)";
      ctx.font = `700 ${(tall ? 18 : 16) * s}px Inter`;
      ctx.fillText(String(i + 1), x0, yy);
      ctx.fillStyle = "#FFFFFF";
      writeFit(ctx, getName(it), x0 + 28 * s, yy, colW - 28 * s, (tall ? 24 : 20) * s, 14 * s, "Inter", "700");
      ctx.fillStyle = "rgba(255,255,255,.56)";
      writeFit(ctx, getMeta(it), x0 + 28 * s, yy + (tall ? 22 : 18) * s, colW - 28 * s, (tall ? 15 : 13) * s, 10 * s, "Inter", "500");
      yy += rowH;
    });
    return yy;
  };
  const endL = drawMiniList(inner, "ARTISTAS EM DESTAQUE", leftItems, (a) => a.name || "—", (a) => `${a.playcount || 0} reproduções`);
  const endR = drawMiniList(inner + colW + gap, "OUTRAS FAIXAS", rightItems, (t) => t.name || "—", (t) => t.artist || "");

  const metricsY = Math.max(endL, endR) + (tall ? 10 : 8) * s;
  ctx.strokeStyle = "rgba(255,255,255,.14)";
  ctx.beginPath();
  ctx.moveTo(inner, metricsY);
  ctx.lineTo(W - inner, metricsY);
  ctx.stroke();
  const metrics = [
    ["REPRODUÇÕES", st.count],
    ["TEMPO", st.tempo.toUpperCase()],
    ["ARTISTAS", st.unique],
  ];
  const mw = (W - inner * 2) / metrics.length;
  metrics.forEach(([label, value], i) => {
    const xx = inner + mw * i;
    ctx.fillStyle = "rgba(255,255,255,.48)";
    ctx.font = `700 ${(tall ? 15 : 13) * s}px Archivo`;
    ctx.fillText(label, xx, metricsY + 30 * s);
    ctx.fillStyle = "#FFFFFF";
    writeFit(ctx, value, xx, metricsY + (tall ? 72 : 58) * s, mw - 16 * s, (tall ? 34 : 28) * s, 16 * s, "Inter", "700");
  });
}

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
  ctx.font = `700 ${28 * s}px Inter`;
  ctx.fillText(esquerda, 52 * s, 76 * s);
  ctx.textAlign = "right";
  ctx.fillText(direita, W - 52 * s, 76 * s);
  ctx.textAlign = "left";
}

function drawReplay(ctx, W, H, data) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.6;
  const square = H <= W * 1.05;
  malhaClara(ctx, W, H);

  const pad = 52 * s;
  cabecalhoReplay(ctx, W, s, `FAIXA’${String(new Date().getFullYear()).slice(-2)}`, "SUA ESCUTA", false);

  ctx.fillStyle = "#111115";
  ctx.font = `700 ${(tall ? 72 : 56) * s}px Inter`;
  ctx.fillText("Artistas mais ouvidos", pad, (tall ? 190 : 158) * s);
  ctx.fillStyle = "rgba(17,17,21,.52)";
  ctx.font = `600 ${(tall ? 54 : 42) * s}px Inter`;
  ctx.fillText(st.range, pad, (tall ? 246 : 204) * s);

  const itens = (data.topArtists || []).slice(0, square ? 4 : 5);
  const baseInicio = (tall ? 332 : 266) * s;
  const limite = H - (tall ? 54 : 42) * s;
  const disponivel = Math.max(1, limite - baseInicio);
  const desejado = (tall ? (data.period === "ano" ? 252 : 264) : 172) * s;
  const rowH = Math.min(desejado, disponivel / Math.max(1, itens.length));
  const inicio = baseInicio + Math.max(0, (disponivel - rowH * itens.length) * 0.12);
  const d = Math.min(rowH * 0.74, (tall ? 176 : 126) * s);

  itens.forEach((a, i) => {
    const cy = inicio + rowH * i + rowH * 0.48;
    ctx.fillStyle = "#111115";
    ctx.textAlign = "center";
    ctx.font = `600 ${(tall ? 76 : 58) * s}px Inter`;
    ctx.fillText(String(i + 1), pad + 24 * s, cy + 20 * s);
    ctx.textAlign = "left";

    const ix = pad + (tall ? 94 : 78) * s;
    imagemRecortada(ctx, a.image, ix, cy - d / 2, d, d, d / 2, a.name, true, "rgba(17,17,21,.12)");
    const tx = ix + d + (tall ? 42 : 30) * s;
    ctx.fillStyle = "#111115";
    writeFit(ctx, a.name, tx, cy - 5 * s, W - tx - pad, (tall ? 52 : 40) * s, 24 * s, "Inter", "700");
    ctx.fillStyle = "rgba(17,17,21,.56)";
    const tempo = formatTempo((a.playcount || 0) * (data.mediaDur || 210), true);
    writeFit(ctx, `${tempo} · ${a.playcount || 0} reproduções`, tx, cy + (tall ? 43 : 35) * s, W - tx - pad, (tall ? 34 : 26) * s, 18 * s, "Inter", "500");
  });
}


function drawEstrela(ctx, W, H, data) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.6;
  const a = (data.topArtists || [])[0] || { name: "—", playcount: 0, image: "" };
  const im = capaDe(a.image || data.artistImage);
  const faixa = (data.topTracks || [])[0] || {};
  const album = (data.topAlbums || [])[0] || {};
  const pad = (tall ? 48 : 42) * s;
  const accent = st.p.recap ? GOLD : PINK;

  ctx.fillStyle = "#160C08";
  ctx.fillRect(0, 0, W, H);
  if (im) {
    ctx.save();
    ctx.filter = `blur(${68 * s}px) saturate(1.4)`;
    ctx.globalAlpha = 0.74;
    cobrir(ctx, im, -W * 0.12, -H * 0.1, W * 1.24, H * 1.2);
    ctx.restore();
  }
  const veil = ctx.createLinearGradient(0, 0, 0, H);
  veil.addColorStop(0, "rgba(50,18,7,.32)");
  veil.addColorStop(0.50, "rgba(12,8,8,.23)");
  veil.addColorStop(1, "rgba(5,5,7,.90)");
  ctx.fillStyle = veil;
  ctx.fillRect(0, 0, W, H);

  cabecalhoReplay(ctx, W, s, `FAIXA’${String(new Date().getFullYear()).slice(-2)}`, st.range, true);
  ctx.fillStyle = "rgba(255,255,255,.76)";
  ctx.font = `600 ${(tall ? 31 : 26) * s}px Inter`;
  ctx.fillText("Artista do período", pad, (tall ? 140 : 122) * s);
  ctx.fillStyle = "#FFFFFF";
  writeFit(ctx, a.name, pad, (tall ? 230 : 200) * s, W - pad * 2, (tall ? 88 : 72) * s, 36 * s, "Inter", "700");
  ctx.font = `700 ${(tall ? 34 : 28) * s}px Inter`;
  ctx.fillText(`${a.playcount || 0} reproduções`, pad, (tall ? 284 : 246) * s);

  const d = Math.min(W * (tall ? 0.60 : 0.54), H * (tall ? 0.31 : 0.39));
  const x = (W - d) / 2;
  const y = tall ? H * 0.22 : H * 0.28;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,.55)";
  ctx.shadowBlur = 68 * s;
  ctx.shadowOffsetY = 22 * s;
  imagemRecortada(ctx, a.image || data.artistImage || album.capa, x, y, d, d, d / 2, a.name, false, "rgba(255,255,255,.18)");
  ctx.restore();

  const panelY = Math.min(y + d + (tall ? 42 : 34) * s, H - (tall ? 620 : 430) * s);
  const panelH = H - panelY - (tall ? 210 : 150) * s;
  ctx.save();
  roundRect(ctx, pad, panelY, W - pad * 2, panelH, 24 * s);
  ctx.fillStyle = "rgba(255,255,255,.10)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.20)";
  ctx.lineWidth = 2 * s;
  ctx.stroke();
  ctx.restore();

  const inner = pad + 30 * s;
  const gap = 34 * s;
  const colW = (W - inner * 2 - gap) / 2;
  const blockY = panelY + 44 * s;
  const card = (x0, label, image, title, meta) => {
    ctx.fillStyle = "rgba(255,255,255,.52)";
    ctx.font = `700 ${(tall ? 17 : 15) * s}px Inter`;
    ctx.fillText(label, x0, blockY);
    const cover = tall ? 106 * s : 82 * s;
    imagemRecortada(ctx, image, x0, blockY + 24 * s, cover, cover, 12 * s, title, true, "rgba(255,255,255,.18)");
    const tx = x0 + cover + 20 * s;
    ctx.fillStyle = "#FFFFFF";
    writeFit(ctx, title || "—", tx, blockY + (tall ? 63 : 51) * s, colW - cover - 20 * s, (tall ? 28 : 23) * s, 16 * s, "Inter", "700");
    ctx.fillStyle = "rgba(255,255,255,.60)";
    writeFit(ctx, meta || "", tx, blockY + (tall ? 94 : 76) * s, colW - cover - 20 * s, (tall ? 18 : 15) * s, 12 * s, "Inter", "500");
  };
  card(inner, "MÚSICA MAIS OUVIDA", faixa.capa, faixa.name, faixa.artist || "");
  card(inner + colW + gap, "ÁLBUM MAIS OUVIDO", album.capa, album.name, album.artist || "");

  const dividerY = blockY + (tall ? 164 : 130) * s;
  ctx.strokeStyle = "rgba(255,255,255,.18)";
  ctx.beginPath();
  ctx.moveTo(inner, dividerY);
  ctx.lineTo(W - inner, dividerY);
  ctx.stroke();

  const listTitleY = dividerY + (tall ? 34 : 28) * s;
  const listRowH = tall ? 58 * s : 48 * s;
  const drawList = (x0, title, items, getName, getMeta) => {
    ctx.fillStyle = "rgba(255,255,255,.48)";
    ctx.font = `700 ${(tall ? 16 : 14) * s}px Archivo`;
    ctx.fillText(title, x0, listTitleY);
    let yy = listTitleY + (tall ? 36 : 30) * s;
    items.slice(0, tall ? 4 : 3).forEach((it, i) => {
      ctx.fillStyle = i === 0 ? accent : "rgba(255,255,255,.42)";
      ctx.font = `700 ${(tall ? 18 : 16) * s}px Inter`;
      ctx.fillText(String(i + 1), x0, yy);
      ctx.fillStyle = "#FFFFFF";
      writeFit(ctx, getName(it), x0 + 28 * s, yy, colW - 28 * s, (tall ? 25 : 21) * s, 14 * s, "Inter", "700");
      ctx.fillStyle = "rgba(255,255,255,.56)";
      writeFit(ctx, getMeta(it), x0 + 28 * s, yy + (tall ? 22 : 18) * s, colW - 28 * s, (tall ? 15 : 13) * s, 10 * s, "Inter", "500");
      yy += listRowH;
    });
    return yy;
  };
  const endL = drawList(inner, "ARTISTAS EM ALTA", data.topArtists || [], (it) => it.name || "—", (it) => `${it.playcount || 0} reproduções`);
  const endR = drawList(inner + colW + gap, "FAIXAS EM ALTA", data.topTracks || [], (it) => it.name || "—", (it) => it.artist || "");

  const metricsY = Math.max(endL, endR) + (tall ? 16 : 12) * s;
  ctx.strokeStyle = "rgba(255,255,255,.18)";
  ctx.beginPath();
  ctx.moveTo(inner, metricsY);
  ctx.lineTo(W - inner, metricsY);
  ctx.stroke();

  const metrics = [
    ["TEMPO COM O ARTISTA", formatTempo((a.playcount || 0) * (data.mediaDur || 210), true).toUpperCase()],
    ["TOTAL", st.count],
    ["ARTISTAS", st.unique],
  ];
  const mw = (W - inner * 2) / metrics.length;
  metrics.forEach(([label, value], i) => {
    const xx = inner + mw * i;
    ctx.fillStyle = "rgba(255,255,255,.50)";
    ctx.font = `700 ${(tall ? 15 : 13) * s}px Inter`;
    ctx.fillText(label, xx, metricsY + 32 * s);
    ctx.fillStyle = "#FFFFFF";
    writeFit(ctx, value, xx, metricsY + (tall ? 76 : 60) * s, mw - 18 * s, (tall ? 34 : 27) * s, 17 * s, "Inter", "700");
  });
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
    ctx.fillText(semDados ? "O período anterior ainda não tem registros." : `${item.playcount || 0} reproduções`, textX, y + h * 0.5 + 44 * s);
    if (semDados) {
      ctx.fillStyle = "rgba(255,255,255,.12)";
      roundRect(ctx, textX, y + h * 0.5 + 82 * s, Math.min(maxW, 390 * s), 82 * s, 14 * s);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.78)";
      ctx.font = `700 ${20 * s}px Inter`;
      ctx.fillText(`${st.count} REPRODUÇÕES AGORA`, textX + 20 * s, y + h * 0.5 + 116 * s);
      ctx.fillStyle = "rgba(255,255,255,.5)";
      ctx.font = `500 ${17 * s}px Inter`;
      ctx.fillText(`${st.tempo.toUpperCase()} · ${st.unique} ARTISTAS`, textX + 20 * s, y + h * 0.5 + 145 * s);
    }
    ctx.restore();
  };

  painel(topo, ph, atual, st.range, false, true);
  painel(topo + ph + gap, ph, anterior, st.prevRange, true, false);

}

function drawEditorial(ctx, W, H, data) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.6;
  malhaEscura(ctx, W, H, false);
  const pad = 52 * s;

  cabecalhoReplay(ctx, W, s, "FAIXA", "RECAP VISUAL", true);
  ctx.textAlign = "center";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `700 ${(tall ? 66 : 50) * s}px Inter`;
  ctx.fillText(st.range, W / 2, (tall ? 166 : 140) * s);
  ctx.fillStyle = "rgba(255,255,255,.66)";
  ctx.font = `600 ${(tall ? 33 : 26) * s}px Inter`;
  ctx.fillText(`${st.count} reproduções · ${st.tempo}`, W / 2, (tall ? 212 : 178) * s);
  ctx.textAlign = "left";

  const split = tall ? W * 0.50 : W * 0.54;
  const listX = pad;
  const listW = split - pad - 28 * s;
  const colX = split + 16 * s;
  const colW = W - colX - pad;
  const qtdLista = data.period === "semana" ? 4 : densidadePeriodo(data);
  const fy = H - (tall ? 150 : 110) * s;
  const startY = tall ? 294 * s : 242 * s;
  const sectionGap = (tall ? 24 : 18) * s;
  const headerGap = (tall ? 58 : 46) * s;
  const available = Math.max(200 * s, fy - startY - sectionGap * 2 - headerGap * 3);
  const rowH = Math.min((tall ? 88 : 68) * s, available / Math.max(1, qtdLista * 3));

  const lista = (titulo, itens, getNome, getMeta, y) => {
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `700 ${(tall ? 34 : 26) * s}px Inter`;
    ctx.fillText(titulo, listX, y);
    let yy = y + headerGap;
    itens.slice(0, qtdLista).forEach((it, i) => {
      ctx.fillStyle = "rgba(255,255,255,.46)";
      ctx.font = `600 ${(tall ? 24 : 19) * s}px Inter`;
      ctx.fillText(String(i + 1), listX, yy);
      ctx.fillStyle = "#FFFFFF";
      writeFit(ctx, getNome(it), listX + 36 * s, yy, listW - 36 * s, (tall ? 31 : 24) * s, 18 * s, "Inter", "650");
      ctx.fillStyle = "rgba(255,255,255,.54)";
      writeFit(ctx, getMeta(it), listX + 36 * s, yy + (tall ? 31 : 25) * s, listW - 36 * s, (tall ? 20 : 16) * s, 14 * s, "Inter", "500");
      yy += rowH;
    });
    return yy;
  };

  let y = startY;
  y = lista("Artistas mais ouvidos", data.topArtists || [], (a) => a.name, (a) => `${a.playcount || 0} reproduções`, y) + sectionGap;
  y = lista("Faixas mais ouvidas", data.topTracks || [], (t) => t.name, (t) => t.artist || "", y) + sectionGap;
  lista("Álbuns mais ouvidos", data.topAlbums || [], (a) => a.name, (a) => a.artist || "", y);

  const artista = (data.topArtists || [])[0] || {};
  const faixa = (data.topTracks || [])[0] || {};
  const album = (data.topAlbums || [])[0] || {};
  const topY = tall ? 256 * s : 222 * s;
  const d = Math.min(colW * 1.10, tall ? 445 * s : 294 * s);
  imagemRecortada(ctx, artista.image, colX + (colW - d) / 2, topY, d, d, d / 2, artista.name, false);
  const cardW = colW * 0.92;
  const cardH = tall ? 425 * s : 270 * s;
  imagemRecortada(ctx, faixa.capa, colX - 4 * s, topY + d * 0.70, cardW, cardH, 30 * s, faixa.name, false);
  const alb = tall ? 472 * s : 318 * s;
  imagemRecortada(ctx, album.capa, colX + colW - alb + 8 * s, topY + d * 0.70 + cardH * 0.72, alb, alb, 24 * s, album.name, false);

  ctx.fillStyle = "rgba(255,255,255,.20)";
  ctx.fillRect(pad, fy - 36 * s, W - pad * 2, 2 * s);
  const metricas = [
    ["TOTAL", st.count],
    ["TEMPO", st.tempo.toUpperCase()],
    ["ARTISTAS", st.unique],
  ];
  const mw = (W - pad * 2) / metricas.length;
  metricas.forEach(([rot, val], i) => {
    const x = pad + mw * i;
    ctx.fillStyle = "rgba(255,255,255,.52)";
    ctx.font = `600 ${(tall ? 19 : 16) * s}px Inter`;
    ctx.fillText(rot, x, fy);
    ctx.fillStyle = "#FFFFFF";
    writeFit(ctx, val, x, fy + (tall ? 48 : 39) * s, mw - 20 * s, (tall ? 38 : 31) * s, 20 * s, "Inter", "700");
  });
}

function drawParada(ctx, W, H, data) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.6;
  const square = H <= W * 1.05;
  const paper = "#F2EFEA";
  const roxo = "#7337A5";
  const ink = "#241A2B";
  const pad = (tall ? 48 : 42) * s;

  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(70,38,114,.15)";
  ctx.lineWidth = 2 * s;
  for (let y = 86 * s; y < H; y += 92 * s) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  cabecalhoReplay(ctx, W, s, "FAIXA · PARADA", st.range, false);
  ctx.fillStyle = roxo;
  ctx.font = `700 ${(tall ? 72 : 58) * s}px Inter`;
  ctx.fillText("Em rotação", pad, (tall ? 158 : 136) * s);
  ctx.font = `700 ${(tall ? 50 : 40) * s}px Inter`;
  const recorte = data.period === "ano" ? "no ano" : data.period === "mes" ? "no mês" : "na semana";
  ctx.fillText(recorte, pad, (tall ? 214 : 184) * s);

  const art = (data.topArtists || [])[0] || {};
  const rd = tall ? 166 * s : 126 * s;
  imagemRecortada(ctx, art.image, W - pad - rd, (tall ? 78 : 70) * s, rd, rd, rd / 2, art.name, true, "rgba(70,38,114,.2)");

  const maxItens = square ? 6 : tall ? 10 : 8;
  const itens = (data.topAlbums || []).slice(0, maxItens);
  const cols = square ? 2 : 2;
  const rows = Math.ceil(itens.length / cols);
  const startY = tall ? 278 * s : 232 * s;
  const endY = H - (tall ? 40 : 32) * s;
  const colGap = (tall ? 44 : 32) * s;
  const colW = (W - pad * 2 - colGap) / cols;
  const rowH = Math.max((tall ? 170 : 122) * s, (endY - startY) / Math.max(1, rows));

  itens.forEach((a, i) => {
    const col = i >= rows ? 1 : 0;
    const row = i % rows;
    const x = pad + col * (colW + colGap);
    const y = startY + row * rowH;
    const isFirst = i === 0;
    if (isFirst) {
      ctx.save();
      roundRect(ctx, x - 12 * s, y - 10 * s, colW + 12 * s, Math.min(rowH - 12 * s, tall ? 178 * s : 128 * s), 14 * s);
      ctx.fillStyle = "rgba(115,55,165,.10)";
      ctx.fill();
      ctx.restore();
    }
    const lado = Math.min(rowH * 0.62, tall ? 142 * s : 94 * s);
    ctx.fillStyle = isFirst ? roxo : "rgba(70,38,114,.62)";
    ctx.font = `700 ${(tall ? 25 : 20) * s}px Inter`;
    ctx.fillText(String(i + 1), x, y + lado * 0.60);
    imagemRecortada(ctx, a.capa, x + 36 * s, y, lado, lado, 5 * s, a.name, true, "rgba(70,38,114,.18)");
    const tx = x + 36 * s + lado + 20 * s;
    const maxW = colW - (tx - x) - 4 * s;
    ctx.fillStyle = isFirst ? ink : roxo;
    writeFit(ctx, a.name, tx, y + lado * 0.42, maxW, (tall ? 28 : 22) * s, 15 * s, "Inter", "700");
    ctx.fillStyle = "rgba(70,38,114,.70)";
    writeFit(ctx, `${a.artist || ""} · ${a.playcount || 0} reproduções`, tx, y + lado * 0.72, maxW, (tall ? 18 : 15) * s, 12 * s, "Inter", "500");
  });

  if (!itens.length) {
    ctx.fillStyle = "rgba(70,38,114,.62)";
    ctx.font = `600 ${30 * s}px Inter`;
    ctx.fillText("Ainda não há álbuns suficientes neste período.", pad, startY + 80 * s);
  }
}


function drawFaixas(ctx, W, H, data) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.6;
  const square = H <= W * 1.05;
  const roxo = "#3F294F";
  const lima = "#C7FA61";
  const coral = "#F0A77F";
  const paper = "#F1ECE4";
  const album = (data.topAlbums || [])[0] || {};
  const artista = (data.topArtists || [])[0] || {};

  ctx.fillStyle = roxo;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = coral;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(W * 0.30, H * 0.10, W * 0.20, H * 0.34, 0, H * 0.29);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = lima;
  ctx.beginPath();
  ctx.moveTo(W, 0);
  ctx.bezierCurveTo(W * 0.63, H * 0.14, W * 0.91, H * 0.36, W, H * 0.44);
  ctx.closePath();
  ctx.fill();

  const outer = (tall ? 42 : 34) * s;
  const px = outer;
  const py = tall ? 78 * s : 62 * s;
  const pw = W - outer * 2;
  const ph = H - py - (tall ? 34 : 28) * s;
  ctx.fillStyle = paper;
  roundRect(ctx, px, py, pw, ph, 34 * s);
  ctx.fill();

  ctx.fillStyle = roxo;
  ctx.textAlign = "center";
  ctx.font = `700 ${(tall ? 60 : 47) * s}px Inter`;
  const titulo = data.period === "ano" ? "Faixas do ano" : data.period === "mes" ? "Faixas do mês" : "Faixas da semana";
  ctx.fillText(titulo, W / 2, py + (tall ? 98 : 78) * s);
  ctx.fillStyle = "rgba(63,41,79,.62)";
  ctx.font = `600 ${(tall ? 22 : 18) * s}px Inter`;
  ctx.fillText("as que mais voltaram para o começo", W / 2, py + (tall ? 136 : 108) * s);
  ctx.textAlign = "left";

  const maxItens = square ? 4 : tall ? 5 : 5;
  const itens = (data.topTracks || []).slice(0, maxItens);
  const startY = py + (tall ? 210 : 156) * s;
  const metricsH = (tall ? 214 : 156) * s;
  const bottom = py + ph - metricsH - (tall ? 24 : 18) * s;
  const rowH = Math.max((tall ? 154 : 112) * s, (bottom - startY) / Math.max(1, itens.length));
  const cover = Math.min(rowH * 0.66, tall ? 132 * s : 94 * s);

  itens.forEach((t, i) => {
    const cy = startY + rowH * i + rowH * 0.5;
    const lineY = startY + rowH * (i + 1);
    if (i < itens.length - 1) {
      ctx.fillStyle = "rgba(63,41,79,.10)";
      ctx.fillRect(px + 54 * s, lineY - 2 * s, pw - 108 * s, 2 * s);
    }
    ctx.fillStyle = roxo;
    ctx.textAlign = "right";
    ctx.font = `700 ${(tall ? 54 : 40) * s}px Inter`;
    ctx.fillText(`#${i + 1}`, px + (tall ? 156 : 124) * s, cy + 16 * s);
    ctx.textAlign = "left";
    const ix = px + (tall ? 188 : 150) * s;
    imagemRecortada(ctx, t.capa, ix, cy - cover / 2, cover, cover, 8 * s, t.name, true, "rgba(63,41,79,.18)");
    const tx = ix + cover + (tall ? 32 : 24) * s;
    const maxW = px + pw - tx - (tall ? 48 : 32) * s;
    ctx.fillStyle = roxo;
    writeFit(ctx, t.name, tx, cy - 4 * s, maxW, (tall ? 40 : 30) * s, 18 * s, "Inter", "700");
    ctx.fillStyle = "rgba(63,41,79,.72)";
    writeFit(ctx, `${t.artist || ""} · ${t.playcount || 0} reproduções`, tx, cy + (tall ? 36 : 28) * s, maxW, (tall ? 24 : 18) * s, 14 * s, "Inter", "500");
  });

  const infoY = py + ph - metricsH + (tall ? 22 : 18) * s;
  ctx.fillStyle = "rgba(63,41,79,.08)";
  roundRect(ctx, px + 42 * s, infoY, pw - 84 * s, tall ? 84 * s : 68 * s, 18 * s);
  ctx.fill();
  const colW = (pw - 84 * s) / 2;
  ctx.fillStyle = "rgba(63,41,79,.56)";
  ctx.font = `700 ${(tall ? 17 : 14) * s}px Inter`;
  ctx.fillText("ARTISTA EM LOOP", px + 64 * s, infoY + (tall ? 28 : 24) * s);
  ctx.fillText("ÁLBUM MAIS OUVIDO", px + 64 * s + colW, infoY + (tall ? 28 : 24) * s);
  ctx.fillStyle = roxo;
  writeFit(ctx, artista.name || "—", px + 64 * s, infoY + (tall ? 60 : 49) * s, colW - 22 * s, (tall ? 29 : 23) * s, 15 * s, "Inter", "700");
  writeFit(ctx, album.name || "—", px + 64 * s + colW, infoY + (tall ? 60 : 49) * s, colW - 24 * s, (tall ? 29 : 23) * s, 15 * s, "Inter", "700");

  const metricsY = infoY + (tall ? 116 : 92) * s;
  ctx.fillStyle = "rgba(63,41,79,.16)";
  ctx.fillRect(px + 44 * s, metricsY - 20 * s, pw - 88 * s, 2 * s);
  const metrics = [["REPRODUÇÕES", st.count], ["TEMPO", st.tempo.toUpperCase()], ["ARTISTAS", st.unique]];
  const innerX = px + 44 * s;
  const mw = (pw - 88 * s) / metrics.length;
  metrics.forEach(([label, value], i) => {
    const x = innerX + mw * i;
    ctx.fillStyle = "rgba(63,41,79,.60)";
    ctx.font = `700 ${(tall ? 18 : 15) * s}px Inter`;
    ctx.fillText(label, x, metricsY);
    ctx.fillStyle = roxo;
    writeFit(ctx, value, x, metricsY + (tall ? 48 : 38) * s, mw - 16 * s, (tall ? 38 : 30) * s, 17 * s, "Inter", "700");
  });
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
  ctx.fillStyle = "rgba(255,255,255,.96)";
  ctx.font = `700 ${(tall ? 62 : 46) * s}px Inter`;
  ctx.fillText("Frequência do período", pad, (tall ? 160 : 132) * s);
  ctx.fillStyle = "rgba(255,255,255,.72)";
  ctx.font = `500 ${(tall ? 27 : 22) * s}px Inter`;
  const subOndas = data.period === "ano" ? "um ano inteiro em movimento" : data.period === "mes" ? "o mês visto como ritmo" : "sete dias em repetição";
  ctx.fillText(subOndas, pad, (tall ? 202 : 166) * s);

  const mid = tall ? H * 0.305 : H * 0.32;
  for (let i = -3; i <= 3; i++) {
    linhaOnda(ctx, W, mid + i * 54 * s, 68 * s, 0, i % 2 ? "rgba(255,255,255,.88)" : "rgba(87,56,119,.9)", 36 * s);
  }

  const alvo = (data.topArtists || [])[0] || {};
  const album = (data.topAlbums || [])[0] || {};
  const size = Math.min(W * (square ? 0.38 : 0.48), tall ? 450 * s : 352 * s);
  const ix = (W - size) / 2;
  const iy = mid - size * 0.45;
  ctx.save();
  ctx.shadowColor = "rgba(32,12,42,.45)";
  ctx.shadowBlur = 46 * s;
  ctx.shadowOffsetY = 20 * s;
  imagemRecortada(ctx, alvo.image || album.capa, ix, iy, size, size, 12 * s, alvo.name || album.name, false);
  ctx.restore();

  const baseY = tall ? H * 0.57 : H * 0.62;
  const gap = 38 * s;
  const colW = (W - pad * 2 - gap) / 2;
  const lista = (x, titulo, itens, nome, meta) => {
    ctx.fillStyle = "#F8F2F3";
    ctx.font = `700 ${(tall ? 40 : 29) * s}px Inter`;
    ctx.fillText(titulo, x, baseY);
    let y = baseY + (tall ? 58 : 43) * s;
    itens.slice(0, square ? 3 : 5).forEach((it, i) => {
      ctx.fillStyle = "rgba(255,255,255,.76)";
      ctx.font = `600 ${(tall ? 22 : 18) * s}px Inter`;
      ctx.fillText(`#${i + 1}`, x, y);
      ctx.fillStyle = "#FFFFFF";
      writeFit(ctx, nome(it), x + 46 * s, y, colW - 46 * s, (tall ? 34 : 24) * s, 16 * s, "Inter", "700");
      ctx.fillStyle = "rgba(255,255,255,.68)";
      writeFit(ctx, meta(it), x + 46 * s, y + (tall ? 30 : 22) * s, colW - 46 * s, (tall ? 20 : 15) * s, 13 * s, "Inter", "500");
      y += tall ? 92 * s : 61 * s;
    });
  };
  lista(pad, "Artistas", data.topArtists || [], (a) => a.name, (a) => `${a.playcount || 0} reproduções`);
  lista(pad + colW + gap, "Faixas", data.topTracks || [], (t) => t.name, (t) => t.artist || "");

  if (tall) {
    const albumY = H - 126 * s;
    ctx.fillStyle = "rgba(255,255,255,.26)";
    ctx.fillRect(pad, albumY - 38 * s, W - pad * 2, 2 * s);
    ctx.fillStyle = "rgba(255,255,255,.72)";
    ctx.font = `600 ${19 * s}px Inter`;
    ctx.fillText(data.period === "ano" ? "ÁLBUM DO ANO" : data.period === "mes" ? "ÁLBUM DO MÊS" : "ÁLBUM MAIS OUVIDO", pad, albumY);
    ctx.fillStyle = "#FFFFFF";
    writeFit(ctx, album.name || "—", pad, albumY + 42 * s, W * 0.58, 32 * s, 20 * s, "Inter", "700");
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(255,255,255,.74)";
    ctx.font = `600 ${20 * s}px Inter`;
    ctx.fillText(`${st.count} REPRODUÇÕES · ${st.tempo.toUpperCase()}`, W - pad, albumY + 42 * s);
    ctx.textAlign = "left";
  }
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
  const pal = temaDe(data);
  const ctx = contextoTematico(bruto, pal);
  const footerH = alturaRodape(res.w, res.h);
  const contentH = res.h - footerH;

  /* O canvas reserva uma área exclusiva: conteúdo e rodapé nunca se sobrepõem. */
  bruto.save();
  bruto.beginPath();
  bruto.rect(0, 0, res.w, contentH);
  bruto.clip();
  (DRAWERS[layoutId] || drawMixtape)(ctx, res.w, contentH, data);
  bruto.restore();
  drawFaixaFooter(bruto, res.w, res.h, data, pal, layoutId);
  return res;
}

export function download(canvas, layoutId, resId, periodId) {
  const res = RESOLUTIONS.find((r) => r.id === resId) || RESOLUTIONS[0];
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = `faixa-${periodId}-${layoutId}-${res.w}x${res.h}.png`;
  a.click();
}
