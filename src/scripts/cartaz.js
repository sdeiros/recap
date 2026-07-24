import { getPaletteSync, getSwatchesSync } from "colorthief";

/* Dependência: npm install colorthief
   A biblioteca extrai swatches semânticos em OKLCH e contraste WCAG. */

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
    note: "fundo, texto, destaque e linhas independentes",
    preview: ["#C8FF54", "#4B123D", "#6C1B52"],
    custom: true,
    colorKeys: ["bg", "text", "accent", "accent2"],
    fields: [
      { key: "bg", label: "Fundo" },
      { key: "text", label: "Texto principal" },
      { key: "accent", label: "Destaque" },
      { key: "accent2", label: "Linhas / segundo destaque" },
    ],
  },
];

export const PERIOD_DEFAULT_LAYOUT = {
  semana: "resumo-solar",
  mes: "panorama-solar",
  ano: "recibo-novo",
};

/* Coleção enxuta: os nove canvases novos + Mixtape e Xerox. */
export const LAYOUTS = [
  { id: "resumo-solar", label: "Resumo solar", note: "foto central + rankings + tempo", best: ["semana", "mes", "ano"] },
  { id: "artista-foco", label: "Artista em foco", note: "retrato principal em cartões", best: ["semana", "mes"] },
  { id: "panorama-solar", label: "Panorama solar", note: "imagem dissolvida + resumo completo", best: ["mes", "ano"] },
  { id: "musicas-solar", label: "Músicas solar", note: "top 5 com capas grandes", best: ["semana", "mes"] },
  { id: "artistas-solar", label: "Artistas solar", note: "top 5 com retratos grandes", best: ["semana", "mes"] },
  { id: "artista-aura", label: "Artista aura", note: "retrato circular sobre capa enevoada", best: ["semana", "mes", "ano"] },
  { id: "musicas-menta", label: "Top músicas névoa", note: "ranking claro com capas", best: ["semana", "mes"] },
  { id: "artistas-menta", label: "Top artistas névoa", note: "ranking claro com retratos", best: ["semana", "mes", "ano"] },
  { id: "recibo-novo", label: "Recibo", note: "extrato musical em papel amassado", best: ["mes", "ano"] },
  { id: "mixtape", label: "Mixtape", note: "grid + tipo condensado", best: ["semana", "mes", "ano"] },
  { id: "xerox", label: "Xerox", note: "zine fotocopiado", best: ["semana", "mes"] },
];


/* ---------- tema de cor ---------- */
const THEME_BY_ID = new Map(THEMES.map((t) => [t.id, t]));

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/* Botão da vibração do fundo derivado da foto do artista.
   1.0 = comportamento antigo; 1.3–1.6 = bem mais vibrante; >1.6 = neon. */
const VIBRANCIA = 1.35;
/* reforço específico para a saturação do fundo das páginas coloridas */
const SAT_FUNDO = 1.22;

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

/* Preto ou branco puro — o que tiver mais contraste com o fundo. Usado
   quando o fundo é uma cor e o texto precisa simplesmente ficar legível. */
function pretoOuBranco(bg) {
  return contraste(bg, "#FFFFFF") >= contraste(bg, "#0D0D0F") ? "#FFFFFF" : "#0D0D0F";
}

function rgbHex({ r, g, b }) {
  const h = (v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

/* ---------- cor perceptual (OKLab / OKLCH) ----------
   HSL é útil para leitura rápida, mas não mantém luminosidade e intensidade
   de forma visualmente uniforme. OKLCH permite criar complementares e
   análogas que parecem pertencer à mesma família, sem ficar neon ou lavadas. */
function srgbLinear(v) {
  v = clamp(v / 255, 0, 1);
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

function linearSrgb(v) {
  return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.max(0, v) ** (1 / 2.4) - 0.055;
}

function rgbOklab({ r, g, b }) {
  r = srgbLinear(r); g = srgbLinear(g); b = srgbLinear(b);
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const ss = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const ll = Math.cbrt(l), mm = Math.cbrt(m), s3 = Math.cbrt(ss);
  return {
    l: 0.2104542553 * ll + 0.793617785 * mm - 0.0040720468 * s3,
    a: 1.9779984951 * ll - 2.428592205 * mm + 0.4505937099 * s3,
    b: 0.0259040371 * ll + 0.7827717662 * mm - 0.808675766 * s3,
  };
}

function rgbOklch(rgb) {
  const lab = rgbOklab(rgb);
  const c = Math.hypot(lab.a, lab.b);
  const h = c < 1e-5 ? 0 : ((Math.atan2(lab.b, lab.a) * 180 / Math.PI) + 360) % 360;
  return { l: lab.l, c, h };
}

function oklabRgb({ l, a, b }) {
  const ll = l + 0.3963377774 * a + 0.2158037573 * b;
  const mm = l - 0.1055613458 * a - 0.0638541728 * b;
  const ss = l - 0.0894841775 * a - 1.291485548 * b;
  const L = ll ** 3, M = mm ** 3, S = ss ** 3;
  const r = 4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S;
  const g = -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S;
  const bl = -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S;
  return { r: linearSrgb(r), g: linearSrgb(g), b: linearSrgb(bl) };
}

function oklchRgb(l, c, h) {
  const rad = (((h % 360) + 360) % 360) * Math.PI / 180;
  return oklabRgb({ l, a: Math.cos(rad) * c, b: Math.sin(rad) * c });
}

/* Converte OKLCH para hexadecimal reduzindo o chroma só quando a cor sai do
   gamut sRGB. Assim o matiz e a luminosidade são preservados o máximo possível. */
function oklchHex(l, c, h) {
  l = clamp(l, 0, 1);
  c = Math.max(0, c);
  let rgb = null;
  for (let i = 0; i < 24; i++) {
    rgb = oklchRgb(l, c, h);
    if ([rgb.r, rgb.g, rgb.b].every((v) => Number.isFinite(v) && v >= 0 && v <= 1)) break;
    c *= 0.9;
  }
  rgb ||= { r: l, g: l, b: l };
  return rgbHex({ r: rgb.r * 255, g: rgb.g * 255, b: rgb.b * 255 });
}

function distanciaMatiz(a, b) {
  const d = Math.abs((((a - b) % 360) + 360) % 360);
  return Math.min(d, 360 - d);
}

function diferencaMatizAssinada(origem, destino) {
  return ((((destino - origem) % 360) + 540) % 360) - 180;
}

/* Procura uma versão da cor que mantenha matiz/croma, mas passe o contraste.
   A busca acontece em OKLCH e privilegia a luminosidade oposta ao fundo. */
function corOklchComContraste(bg, origem, minimo = 3.2, preferida = null) {
  const base = typeof origem === "string"
    ? rgbOklch(hexRgb(origem) || { r: 255, g: 74, b: 28 })
    : origem;
  const fundo = rgbOklch(hexRgb(bg) || { r: 13, g: 13, b: 15 });
  const alvoL = preferida ?? (fundo.l > 0.58 ? 0.24 : 0.82);
  const cromas = [Math.max(base.c || 0, 0.16), Math.max(base.c || 0, 0.12), 0.08, 0.035];
  let melhor = pretoOuBranco(bg), melhorScore = -Infinity;

  for (const c of cromas) {
    for (let l = 0.07; l <= 0.95; l += 0.02) {
      const cor = oklchHex(l, c, base.h || 0);
      const ct = contraste(bg, cor);
      const passou = ct >= minimo;
      /* Depois que o piso de contraste é atingido, não premiamos contraste
         infinito: isso empurraria todo acento para preto/branco. Priorizamos
         a cor mais próxima da luminosidade desejada e com chroma alto. */
      const score = passou
        ? 100 + c * 34 - Math.abs(l - alvoL) * 22 - Math.abs(ct - minimo) * 0.12
        : ct * 5 + c * 10 - Math.abs(l - alvoL) * 2;
      if (score > melhorScore) {
        melhorScore = score;
        melhor = cor;
      }
    }
    if (contraste(bg, melhor) >= minimo) return melhor;
  }
  return textoSeguro(bg, melhor);
}

const paletaFallbackCache = new WeakMap();

/* Paleta viva da imagem.
   Em vez de guardar só uma média, separamos os pixels por faixas de matiz,
   medimos presença + saturação e preservamos até cinco famílias cromáticas.
   Isso permite que fundo, acentos e marca nasçam da mesma foto. */
const MIN_SUPORTE = 0.055;

function paletaImagemFallback(im) {
  if (!im?.width || !im?.height) return null;
  if (paletaFallbackCache.has(im)) return paletaFallbackCache.get(im);
  try {
    const lado = 36;
    let canvas = null;
    if (typeof OffscreenCanvas !== "undefined") canvas = new OffscreenCanvas(lado, lado);
    else if (typeof document !== "undefined" && document.createElement) {
      canvas = document.createElement("canvas");
      canvas.width = lado;
      canvas.height = lado;
    }
    if (!canvas) return null;
    const cx = canvas.getContext("2d", { willReadFrequently: true });
    if (!cx) return null;

    /* Recorte levemente central: reduz bordas/vinhetas sem ignorar o cenário. */
    const sx = im.width * 0.06;
    const sy = im.height * 0.05;
    const sw = im.width * 0.88;
    const sh = im.height * 0.86;
    cx.drawImage(im, sx, sy, sw, sh, 0, 0, lado, lado);
    const img = cx.getImageData(0, 0, lado, lado).data;

    const BINS = 24; /* 15°: separa melhor paletas próximas sem criar ruído */
    const somaR = new Float64Array(BINS);
    const somaG = new Float64Array(BINS);
    const somaB = new Float64Array(BINS);
    const pesoBin = new Float64Array(BINS);
    const shareBin = new Float64Array(BINS);
    const scoreBin = new Float64Array(BINS);
    let visivel = 0;
    let tomSoma = 0, tomPeso = 0;

    for (let y = 0; y < lado; y++) {
      for (let x = 0; x < lado; x++) {
        const i = (y * lado + x) * 4;
        const a = img[i + 3] / 255;
        if (a < 0.55) continue;
        const r = img[i], g = img[i + 1], b = img[i + 2];
        const hsl = rgbHsl({ r, g, b });

        tomSoma += hsl.l * a;
        tomPeso += a;
        if (hsl.l < 0.035 || hsl.l > 0.97) continue;

        const dx = (x + 0.5) / lado - 0.5;
        const dy = (y + 0.5) / lado - 0.43;
        const centro = 1.18 - Math.min(0.55, Math.hypot(dx, dy)) * 0.55;
        const janelaL = Math.max(0.22, 1 - Math.abs(hsl.l - 0.55) * 1.45);
        const wBase = a * centro * janelaL;
        visivel += wBase;

        if (hsl.s < 0.12) continue;
        const bin = Math.min(BINS - 1, Math.floor((hsl.h / 360) * BINS));
        const w = wBase * (0.18 + hsl.s * hsl.s);
        somaR[bin] += r * w;
        somaG[bin] += g * w;
        somaB[bin] += b * w;
        pesoBin[bin] += w;
        shareBin[bin] += wBase;
        scoreBin[bin] += w * (0.45 + hsl.s) * (0.7 + janelaL * 0.3);
      }
    }

    const bins = [];
    for (let k = 0; k < BINS; k++) {
      if (!pesoBin[k]) continue;
      const apoio = visivel > 0 ? shareBin[k] / visivel : 0;
      const cor = rgbHex({
        r: somaR[k] / pesoBin[k],
        g: somaG[k] / pesoBin[k],
        b: somaB[k] / pesoBin[k],
      });
      const ok = rgbOklch(hexRgb(cor));
      bins.push({ cor, apoio, score: scoreBin[k], ...ok });
    }
    bins.sort((a, b) => b.score - a.score);

    /* Junta bins vizinhos e evita cinco tons quase idênticos da mesma cor. */
    const cores = [];
    for (const item of bins) {
      if (item.apoio < MIN_SUPORTE && cores.length) continue;
      const repetida = cores.some((c) =>
        distanciaMatiz(c.h, item.h) < 24 && Math.abs(c.l - item.l) < 0.16
      );
      if (!repetida) cores.push(item);
      if (cores.length === 5) break;
    }

    const tom = tomPeso ? clamp(tomSoma / tomPeso, 0.035, 0.97) : 0.5;
    const dominanteValida = cores[0] && cores[0].apoio >= MIN_SUPORTE;
    const dominante = dominanteValida ? cores[0].cor : rgbHex(hslRgb(0, 0, tom));
    const resultado = {
      dominant: dominante,
      colors: dominanteValida ? cores.map((c) => c.cor) : [dominante],
      tone: tom,
      achromatic: !dominanteValida || rgbOklch(hexRgb(dominante)).c < 0.035,
    };

    paletaFallbackCache.set(im, resultado);
    return resultado;
  } catch (_) {
    paletaFallbackCache.set(im, null);
    return null;
  }
}


const paletaBibliotecaCache = new WeakMap();

function hexCorBiblioteca(cor) {
  if (!cor) return null;
  try {
    if (typeof cor.hex === "function") return cor.hex();
    if (typeof cor.hex === "string") return cor.hex;
    if (typeof cor.rgb === "function") return rgbHex(cor.rgb());
    if (typeof cor.array === "function") {
      const [r, g, b] = cor.array();
      return rgbHex({ r, g, b });
    }
    if (Array.isArray(cor) && cor.length >= 3) {
      return rgbHex({ r: cor[0], g: cor[1], b: cor[2] });
    }
  } catch (_) {}
  return null;
}

function swatchHex(swatches, nome) {
  return hexCorBiblioteca(swatches?.[nome]?.color || swatches?.[nome]);
}

/* A biblioteca faz a quantização em OKLCH e devolve swatches semânticos.
   O algoritmo antigo continua como fallback para CORS, canvas bloqueado ou
   qualquer incompatibilidade inesperada no navegador. */
function paletaImagem(im) {
  if (!im?.width || !im?.height) return null;
  if (paletaBibliotecaCache.has(im)) return paletaBibliotecaCache.get(im);

  try {
    const opcoes = {
      colorCount: 10,
      quality: 4,
      colorSpace: "oklch",
      gamut: "srgb",
      ignoreWhite: true,
    };
    const coresObj = getPaletteSync(im, opcoes) || [];
    const swatches = getSwatchesSync(im, opcoes) || {};
    const cores = coresObj.map(hexCorBiblioteca).filter(Boolean);
    const semantic = {
      vibrant: swatchHex(swatches, "Vibrant"),
      muted: swatchHex(swatches, "Muted"),
      darkVibrant: swatchHex(swatches, "DarkVibrant"),
      darkMuted: swatchHex(swatches, "DarkMuted"),
      lightVibrant: swatchHex(swatches, "LightVibrant"),
      lightMuted: swatchHex(swatches, "LightMuted"),
    };
    const fallback = paletaImagemFallback(im);
    const todas = [...new Set([
      ...Object.values(semantic).filter(Boolean),
      ...cores,
      ...(fallback?.colors || []),
    ])];
    const dominant = cores[0] || semantic.vibrant || fallback?.dominant || null;
    const cromas = todas.map((cor) => rgbOklch(hexRgb(cor))).map((c) => c.c);
    const achromatic = !todas.length || Math.max(0, ...cromas) < 0.035;
    const resultado = {
      dominant,
      colors: todas,
      semantic,
      tone: fallback?.tone ?? (dominant ? rgbOklch(hexRgb(dominant)).l : 0.5),
      achromatic,
      source: "colorthief",
    };
    paletaBibliotecaCache.set(im, resultado);
    return resultado;
  } catch (_) {
    const fallback = paletaImagemFallback(im);
    paletaBibliotecaCache.set(im, fallback);
    return fallback;
  }
}

function corDominanteImagem(im) {
  return paletaImagem(im)?.dominant || null;
}

function corComContraste(bg, desejada, reserva = null, minimo = 3.1) {
  const seguro = textoSeguro(bg, reserva || desejada || "#FFFFFF");
  let cor = desejada || seguro;
  if (contraste(bg, cor) >= minimo) return cor;
  cor = mistura(cor, seguro, 0.42);
  if (contraste(bg, cor) >= minimo) return cor;
  cor = mistura(cor, seguro, 0.72);
  if (contraste(bg, cor) >= minimo) return cor;
  return seguro;
}

/* Cor de destaque do #1 do ranking: vívida, "chama atenção", DERIVADA do
   fundo. Fixa um matiz de atenção (complementar do fundo, ou o acento do tema
   se o fundo for neutro) e varre a luminância escolhendo a cor MAIS VÍVIDA que
   ainda passe de um piso alto de contraste. Se nenhuma passar (fundo de
   luminância intermediária), devolve a de maior contraste possível. */
function corDestaque(bg, pal = null, minimo = 4.6) {
  const c = hexRgb(bg) || { r: 13, g: 13, b: 15 };
  const hsl = rgbHsl(c);
  const temCor = hsl.s > 0.15;
  const hAcento = rgbHsl(hexRgb(pal?.accent || "#FF4A1C") || { r: 255, g: 74, b: 28 }).h;
  const h = temCor ? (hsl.h + 180) % 360 : hAcento;

  let melhorContraste = null, maxC = 0;
  const passam = [];
  for (let l = 0.06; l <= 0.94; l += 0.03) {
    /* saturação alta no miolo, cedendo nos extremos (onde cores muito
       saturadas não existem) — permite chegar a tons quase pretos/brancos
       levemente tingidos, que garantem contraste em qualquer fundo */
    const s = clamp(1 - Math.abs(l - 0.5) * 0.7, 0.42, 1);
    const cor = rgbHex(hslRgb(h, s, l));
    const ct = contraste(bg, cor);
    if (ct > maxC) { maxC = ct; melhorContraste = cor; }
    if (ct >= minimo) passam.push({ cor, s, l });
  }
  if (passam.length) {
    /* entre os que passam, o mais vívido (maior saturação; desempate pelo tom
       mais “cheio”, perto de l≈0.52) */
    passam.sort((a, b) => b.s - a.s || Math.abs(a.l - 0.52) - Math.abs(b.l - 0.52));
    return passam[0].cor;
  }
  return melhorContraste;
}

function corMutada(bg, text, alvo = 3.0) {
  for (const t of [0.52, 0.44, 0.36, 0.28, 0.2]) {
    const cor = mistura(text, bg, t);
    if (contraste(bg, cor) >= alvo) return cor;
  }
  return text;
}

function corDistinta(cores, referencia, minimo = 34) {
  const ref = rgbOklch(hexRgb(referencia) || { r: 255, g: 74, b: 28 });
  return (cores || []).find((cor) => {
    const atual = rgbOklch(hexRgb(cor));
    return atual.c >= 0.04 && distanciaMatiz(ref.h, atual.h) >= minimo;
  }) || null;
}

function matizEhQuente(h) {
  h = ((Number(h) % 360) + 360) % 360;
  return h <= 82 || h >= 326;
}

function matizEhEditorial(h) {
  h = ((Number(h) % 360) + 360) % 360;
  return h <= 68 || h >= 352;
}

function matizEhRosaMagenta(h) {
  h = ((Number(h) % 360) + 360) % 360;
  return h >= 316 && h < 352;
}

function matizNaFaixa(h, inicio, fim) {
  h = ((Number(h) % 360) + 360) % 360;
  if (inicio <= fim) return h >= inicio && h <= fim;
  return h >= inicio || h <= fim;
}

function faixaEditorial(h) {
  h = ((Number(h) % 360) + 360) % 360;
  if (h >= 12 && h <= 30) return 4;  /* coral / goiaba quente */
  if (h > 30 && h <= 44) return 3;   /* apricot / pêssego vivo */
  if (h >= 4 && h < 12) return 3;    /* vermelho-alaranjado */
  if (h >= 352 || h < 4) return 2;   /* vermelho quente */
  if (h > 44 && h <= 60) return 2;   /* laranja suave */
  if (h > 60 && h <= 74) return 1;   /* dourado, só como apoio */
  return 0;
}

function analisarCalorDaImagem(extraida) {
  const cores = extraida?.colors || [];
  let rosa = 0, coral = 0, dourado = 0, neutroQuente = 0, total = 0;
  for (const cor of cores) {
    const ok = rgbOklch(hexRgb(cor));
    if (ok.c < 0.035) continue;
    const peso = clamp(ok.c * 4.8 + 0.15, 0.18, 1.25);
    total += peso;
    if (matizNaFaixa(ok.h, 338, 12)) rosa += peso;
    else if (matizNaFaixa(ok.h, 12, 34)) coral += peso;
    else if (matizNaFaixa(ok.h, 34, 70)) dourado += peso;
    else if (matizNaFaixa(ok.h, 20, 92) && ok.c < 0.09) neutroQuente += peso;
  }
  return {
    rosa: total ? rosa / total : 0,
    coral: total ? coral / total : 0,
    dourado: total ? dourado / total : 0,
    neutroQuente: total ? neutroQuente / total : 0,
    temQuente: total > 0.12,
  };
}

function pontuarHarmoniaQuente(h, baseH, c = 0.14, extraida = false) {
  const d = distanciaMatiz(h, baseH);
  const faixa = faixaEditorial(h);
  let score = c * 145 + faixa * 18;

  if (d >= 16 && d <= 56) score += 36;
  else if (d >= 104 && d <= 136) score += 21;
  else if (d >= 140 && d <= 164) score += 16;
  else if (d < 12) score -= 7;

  if (matizEhRosaMagenta(h)) score -= 34;
  if (!matizEhEditorial(h)) score -= 14;
  if (extraida) score += 22;
  return score;
}

function ajustarMatizEditorial(h, calor) {
  h = ((Number(h) % 360) + 360) % 360;

  /* rosa/magenta abre para goiaba/coral, sem virar chiclete */
  if (matizEhRosaMagenta(h)) {
    return calor.rosa >= 0.16 ? 8 : 14;
  }

  /* amarelos/laranjas muito puros puxam para apricot/coral. */
  if (h > 44 && h <= 82) {
    return calor.rosa >= 0.1 ? 18 : 28;
  }
  if (h > 30 && h <= 44) {
    return calor.dourado >= 0.22 ? 28 : 22;
  }
  if (h >= 12 && h <= 30) {
    return calor.coral >= 0.1 ? h : clamp(h, 16, 24);
  }
  if (h >= 352 || h < 12) {
    return calor.rosa >= 0.12 ? 8 : 12;
  }
  return 22;
}

/* Escolhe uma família quente apenas quando ela é sustentada pela imagem ou
   por uma relação cromática plausível. Quando isso não acontece, em vez de
   forçar laranja/terracota, caímos para um pêssego quente mais neutro. */
function matizQuenteHarmonico(extraida, base) {
  const reais = [];
  const gerados = [];
  const adicionar = (lista, h, c = base.c, extraidaDaFoto = false) => {
    h = ((h % 360) + 360) % 360;
    if (!matizEhQuente(h)) return;
    lista.push({ h, c: Math.max(0, c || 0), extraidaDaFoto });
  };

  for (const cor of extraida?.colors || []) {
    const ok = rgbOklch(hexRgb(cor));
    if (ok.c >= 0.042 && matizEhEditorial(ok.h)) adicionar(reais, ok.h, ok.c, true);
  }

  for (const delta of [-150, -120, -42, -28, 22, 36, 120, 148]) {
    adicionar(gerados, (base.h || 0) + delta, Math.max(base.c || 0, 0.13), false);
  }
  [8, 12, 16, 22, 28, 34, 40, 356].forEach((h) => adicionar(gerados, h, 0.145, false));

  const ordenar = (lista) => lista.sort((a, b) =>
    pontuarHarmoniaQuente(b.h, base.h || 0, b.c, b.extraidaDaFoto)
    - pontuarHarmoniaQuente(a.h, base.h || 0, a.c, a.extraidaDaFoto)
  );
  ordenar(reais);
  ordenar(gerados);

  const melhorReal = reais[0];
  if (melhorReal && pontuarHarmoniaQuente(melhorReal.h, base.h || 0, melhorReal.c, true) >= 36) {
    return { h: melhorReal.h, confidence: 1, fromImage: true };
  }

  const melhorGerado = gerados[0];
  const scoreGerado = melhorGerado
    ? pontuarHarmoniaQuente(melhorGerado.h, base.h || 0, melhorGerado.c, false)
    : -Infinity;
  if (melhorGerado && scoreGerado >= 32) {
    return { h: melhorGerado.h, confidence: 0.7, fromImage: false };
  }

  return { h: 24, confidence: 0.22, fromImage: false };
}

function fundoPaletaAcessivel(extraida, origem, preferClaro = true, minimo = 4.5) {
  const sem = extraida?.semantic || {};
  const bruta = preferClaro
    ? (sem.lightMuted || sem.muted || extraida?.dominant)
    : (sem.darkMuted || sem.muted || extraida?.dominant);
  const base = rgbOklch(hexRgb(bruta) || hexRgb(origem) || { r: 239, g: 234, b: 225 });
  const alvoL = preferClaro ? 0.83 : 0.28;
  const c = clamp(base.c, 0.025, 0.12);
  let melhor = oklchHex(alvoL, c, base.h);
  let melhorScore = -Infinity;
  for (let l = 0.16; l <= 0.92; l += 0.02) {
    const cor = oklchHex(l, c, base.h);
    const ct = contraste(cor, pretoOuBranco(cor));
    if (ct < minimo) continue;
    const score = 100 - Math.abs(l - alvoL) * 28 + c * 18;
    if (score > melhorScore) { melhorScore = score; melhor = cor; }
  }
  return melhor;
}

function corQuenteRefinadaAcessivel(h, familia, preferClaro = true, minimo = 4.5) {
  const perfis = {
    coral: { alvoL: preferClaro ? 0.645 : 0.4, cromas: preferClaro ? [0.19, 0.175, 0.16, 0.145] : [0.16, 0.145, 0.125] },
    goiaba: { alvoL: preferClaro ? 0.63 : 0.39, cromas: preferClaro ? [0.185, 0.17, 0.155, 0.14] : [0.155, 0.14, 0.122] },
    peach: { alvoL: preferClaro ? 0.79 : 0.46, cromas: preferClaro ? [0.12, 0.105, 0.09, 0.078] : [0.1, 0.086, 0.072] },
    apricot: { alvoL: preferClaro ? 0.73 : 0.44, cromas: preferClaro ? [0.145, 0.13, 0.115, 0.1] : [0.12, 0.105, 0.09] },
    terracotta: { alvoL: preferClaro ? 0.57 : 0.37, cromas: preferClaro ? [0.145, 0.13, 0.115] : [0.125, 0.11, 0.095] },
  };
  const p = perfis[familia] || perfis.coral;
  const cromas = p.cromas.map((c) => clamp(c * SAT_FUNDO, 0.07, 0.28));
  let melhor = oklchHex(p.alvoL, cromas[0], h);
  let melhorScore = -Infinity;
  for (const c of cromas) {
    for (let l = 0.16; l <= 0.92; l += 0.015) {
      const cor = oklchHex(l, c, h);
      const txt = pretoOuBranco(cor);
      const ct = contraste(cor, txt);
      if (ct < minimo) continue;
      const score = 100 + c * 84 - Math.abs(l - p.alvoL) * 24 - Math.abs(ct - minimo) * 0.05;
      if (score > melhorScore) {
        melhorScore = score;
        melhor = cor;
      }
    }
    if (melhorScore > -Infinity) return melhor;
  }
  return melhor;
}

function suporteDeMatiz(cores, h) {
  let suporte = 0;
  for (const cor of cores || []) {
    const ok = typeof cor === "string" ? rgbOklch(hexRgb(cor)) : cor;
    if (!ok || ok.c < 0.025) continue;
    const d = distanciaMatiz(ok.h || 0, h);
    suporte += Math.max(0, 1 - d / 72) * (0.25 + ok.c * 5.5);
  }
  return suporte;
}


function fundoEditorialLeveAcessivel(extraida, origem, preferClaro = true, minimo = 4.5) {
  const base = typeof origem === "string"
    ? rgbOklch(hexRgb(origem) || { r: 255, g: 74, b: 28 })
    : origem;
  const vibranteHex = fundoVibranteHarmonicoAcessivel(extraida, origem, preferClaro, minimo);
  const vibrante = rgbOklch(hexRgb(vibranteHex) || { r: 198, g: 255, b: 84 });

  const sem = extraida?.semantic || {};
  const brutas = [...new Set([
    sem.vibrant, sem.lightVibrant, sem.muted, sem.darkVibrant,
    ...(extraida?.colors || []), extraida?.dominant,
  ].filter(Boolean))];
  const reais = brutas
    .map((cor) => ({ ...rgbOklch(hexRgb(cor)), cor }))
    .filter((ok) => Number.isFinite(ok.h) && ok.c >= 0.025);

  const suporteAcido = reais.reduce((s, ok) =>
    s + ((ok.h >= 58 && ok.h <= 170) ? (0.22 + ok.c * 5.2) : 0), 0);
  const suporteFrio = reais.reduce((s, ok) =>
    s + ((ok.h >= 190 && ok.h <= 285) ? (0.24 + ok.c * 5.4) : 0), 0);
  const suporteRosa = reais.reduce((s, ok) =>
    s + ((ok.h >= 320 || ok.h <= 18) ? (0.18 + ok.c * 4.8) : 0), 0);

  const candidatos = [];
  const adicionar = (h, cBase = 0.11, bonus = 0) => {
    h = ((h % 360) + 360) % 360;
    candidatos.push({ h, cBase: clamp(cBase, 0.055, 0.17), bonus });
  };

  adicionar(vibrante.h, Math.max(vibrante.c * 0.58, 0.09), 18);
  adicionar(vibrante.h - 18, Math.max(vibrante.c * 0.52, 0.085), 12);
  adicionar(vibrante.h + 18, Math.max(vibrante.c * 0.52, 0.085), 12);
  adicionar(base.h || vibrante.h, Math.max((base.c || vibrante.c) * 0.48, 0.08), 10);
  adicionar((base.h || vibrante.h) - 24, Math.max((base.c || vibrante.c) * 0.44, 0.075), 8);
  adicionar((base.h || vibrante.h) + 24, Math.max((base.c || vibrante.c) * 0.44, 0.075), 8);
  adicionar((base.h || vibrante.h) + 120, 0.095, 6);
  adicionar((base.h || vibrante.h) - 120, 0.095, 6);

  if (suporteFrio >= 0.55) {
    [228, 238, 248, 258].forEach((h, i) => adicionar(h, 0.085 + i * 0.008, 20));
  }
  if (suporteAcido >= 0.55) {
    [78, 90, 102, 114].forEach((h, i) => adicionar(h, 0.09 + i * 0.007, 18));
  }
  if (suporteRosa >= 0.45) {
    [332, 344, 356, 8].forEach((h, i) => adicionar(h, 0.082 + i * 0.006, 12));
  }

  let melhor = null;
  let melhorScore = -Infinity;
  const alvoL = preferClaro ? 0.82 : 0.37;
  const alvoC = preferClaro ? 0.11 : 0.14;

  for (const cand of candidatos) {
    const suporte = suporteDeMatiz(reais, cand.h);
    const distBase = distanciaMatiz(cand.h, base.h || vibrante.h || 0);
    const bonusRelacao = distBase >= 14 && distBase <= 146 ? 10 : distBase < 8 ? -12 : 0;
    const bonusFrio = suporteFrio >= 0.55 && cand.h >= 220 && cand.h <= 264 ? 16 : 0;
    const bonusAcido = suporteAcido >= 0.55 && cand.h >= 76 && cand.h <= 120 ? 16 : 0;
    const bonusRosa = suporteRosa >= 0.45 && (cand.h >= 336 || cand.h <= 10) ? 8 : 0;
    const cromas = [cand.cBase, cand.cBase * 0.86, cand.cBase * 1.14];
    for (const c of cromas) {
      for (let l = (preferClaro ? 0.74 : 0.24); l <= (preferClaro ? 0.9 : 0.56); l += 0.0125) {
        const cor = oklchHex(l, c, cand.h);
        const ct = contraste(cor, pretoOuBranco(cor));
        if (ct < minimo) continue;
        const score = suporte * 24
          + cand.bonus
          + bonusRelacao
          + bonusFrio
          + bonusAcido
          + bonusRosa
          - Math.abs(l - alvoL) * 42
          - Math.abs(c - alvoC) * 90
          - Math.abs(ct - (minimo + 1.6)) * 0.25;
        if (score > melhorScore) {
          melhorScore = score;
          melhor = cor;
        }
      }
    }
  }

  if (melhor) return melhor;
  return oklchHex(
    clamp(vibrante.l + (preferClaro ? 0.09 : 0.03), preferClaro ? 0.74 : 0.22, preferClaro ? 0.9 : 0.58),
    clamp(vibrante.c * (preferClaro ? 0.52 : 0.82), 0.06, 0.16),
    vibrante.h,
  );
}

function fundoVibranteHarmonicoAcessivel(extraida, origem, preferClaro = true, minimo = 4.5) {
  const base = typeof origem === "string"
    ? rgbOklch(hexRgb(origem) || { r: 255, g: 74, b: 28 })
    : origem;
  const sem = extraida?.semantic || {};
  const brutas = [...new Set([
    sem.vibrant, sem.lightVibrant, sem.muted, sem.darkVibrant,
    ...(extraida?.colors || []), extraida?.dominant,
  ].filter(Boolean))];
  const reais = brutas
    .map((cor) => ({ ...rgbOklch(hexRgb(cor)), cor }))
    .filter((ok) => Number.isFinite(ok.h) && ok.c >= 0.035);

  if (!reais.length) return fundoQuenteHarmonicoAcessivel(extraida, origem, preferClaro, minimo);

  const candidatos = [];
  const adicionar = (h, c, real = false, origemCor = null) => {
    h = ((h % 360) + 360) % 360;
    candidatos.push({ h, c: clamp(c, 0.09, 0.3), real, origemCor });
  };

  for (const ok of reais) {
    adicionar(ok.h, Math.max(ok.c * 1.28, 0.17), true, ok.cor);
    adicionar(ok.h - 26, Math.max(ok.c * 1.2, 0.16), false, ok.cor);
    adicionar(ok.h + 26, Math.max(ok.c * 1.2, 0.16), false, ok.cor);
  }

  /* Relações editoriais: análogas, split-complementary e triádicas.
     O verde-lima entra quando a própria imagem possui amarelos/verdes que o
     sustentem; não é um fallback universal. */
  for (const delta of [-150, -120, -62, -42, 42, 62, 120, 150]) {
    adicionar((base.h || 0) + delta, Math.max((base.c || 0) * 1.25, 0.17), false, null);
  }

  const suporteAcido = reais.reduce((s, ok) =>
    s + ((ok.h >= 58 && ok.h <= 168) ? (0.3 + ok.c * 6) : 0), 0);
  if (suporteAcido >= 0.75) {
    [82, 96, 108, 120, 134].forEach((h) => adicionar(h, 0.25, false, null));
  }

  let melhor = null;
  let melhorScore = -Infinity;
  const alvoL = preferClaro ? 0.79 : 0.34;
  for (const cand of candidatos) {
    const suporte = suporteDeMatiz(reais, cand.h);
    const distBase = distanciaMatiz(cand.h, base.h || 0);
    const bonusRelacao = distBase >= 28 && distBase <= 138 ? 22 : distBase < 12 ? -24 : 0;
    const bonusAcido = suporteAcido >= 0.75 && cand.h >= 72 && cand.h <= 145 ? 34 : 0;
    const bonusReal = cand.real ? 14 : 0;
    const penalVermelhoPuro = (cand.h >= 350 || cand.h <= 8) && suporte < 0.75 ? 14 : 0;

    for (const c of [cand.c, cand.c * 0.9, cand.c * 0.78]) {
      for (let l = preferClaro ? 0.63 : 0.18; l <= (preferClaro ? 0.9 : 0.54); l += 0.015) {
        const cor = oklchHex(l, c, cand.h);
        const ct = contraste(cor, pretoOuBranco(cor));
        if (ct < minimo) continue;
        const score = suporte * 31
          + c * 132
          + bonusRelacao
          + bonusAcido
          + bonusReal
          - penalVermelhoPuro
          - Math.abs(l - alvoL) * 46;
        if (score > melhorScore) {
          melhorScore = score;
          melhor = cor;
        }
      }
    }
  }

  return melhor || fundoQuenteHarmonicoAcessivel(extraida, origem, preferClaro, minimo);
}

function fundoQuenteHarmonicoAcessivel(extraida, origem, preferClaro = true, minimo = 4.5) {
  const base = typeof origem === "string"
    ? rgbOklch(hexRgb(origem) || { r: 255, g: 74, b: 28 })
    : origem;
  const escolha = matizQuenteHarmonico(extraida, base);
  const calor = analisarCalorDaImagem(extraida);

  if (escolha.confidence < 0.38) {
    if (preferClaro) return corQuenteRefinadaAcessivel(24, "apricot", true, minimo);
    return fundoPaletaAcessivel(extraida, origem, preferClaro, minimo);
  }

  const h = ajustarMatizEditorial(escolha.h, calor);

  let familia = "coral";
  if (preferClaro && (calor.neutroQuente > 0.22 || (calor.dourado > 0.26 && calor.rosa < 0.08))) {
    familia = escolha.confidence < 0.88 ? "apricot" : "coral";
  } else if (calor.rosa >= 0.12) {
    familia = "goiaba";
  } else if (calor.coral >= 0.1) {
    familia = "coral";
  } else if (calor.dourado >= 0.2) {
    familia = preferClaro ? "apricot" : "terracotta";
  } else if (preferClaro) {
    familia = escolha.confidence < 0.8 ? "apricot" : "coral";
  }

  return corQuenteRefinadaAcessivel(h, familia, preferClaro, minimo);
}

function analogicaAcessivel(bg, origem, deslocamento = 28, minimo = 3.6) {
  const base = typeof origem === "string"
    ? rgbOklch(hexRgb(origem) || { r: 255, g: 74, b: 28 })
    : origem;
  const candidatos = [
    { l: clamp(base.l, 0.28, 0.84), c: clamp(Math.max(base.c, 0.12), 0.08, 0.23), h: (base.h + deslocamento) % 360 },
    { l: clamp(base.l, 0.28, 0.84), c: clamp(Math.max(base.c, 0.11), 0.08, 0.22), h: (base.h - deslocamento + 360) % 360 },
    { l: clamp(base.l, 0.28, 0.84), c: clamp(Math.max(base.c * 0.92, 0.1), 0.08, 0.2), h: (base.h + 2 * deslocamento) % 360 },
  ];
  for (const cand of candidatos) {
    const cor = corOklchComContraste(bg, cand, minimo);
    if (contraste(bg, cor) >= minimo) return cor;
  }
  return corOklchComContraste(bg, base, minimo);
}

function temaOriginalDaPaleta(extraida) {
  if (!extraida?.dominant) {
    const bg = "#EFEAE1";
    const text = "#0D0D0F";
    return {
      id: "original", original: true,
      bg, surface: "#E3DED5", paper: "#F7F4EE", text,
      muted: "#68645F", ink: text,
      accent: "#C83218", accent2: "#2447CC", brand: "#C83218",
      softBg: bg, softText: text, softMuted: "#68645F", softAccent: "#C83218",
      strongBg: "#FF9E1B", strongText: text, strongAccent: "#2437C8",
    };
  }

  const sem = extraida.semantic || {};
  const dominante = extraida.dominant;
  const base = rgbOklch(hexRgb(sem.vibrant || dominante));

  if (extraida.achromatic || base.c < 0.035) {
    /* Em artes acromáticas, não inventamos uma nova cor: usamos a própria
       dominante da imagem como base do sistema. A partir dela, só abrimos
       ou fechamos um pouco o tom para criar hierarquia e manter contraste. */
    const tomDominante = clamp(extraida.tone ?? base.l, 0.08, 0.94);
    const bg = oklchHex(tomDominante, 0, 0);
    const text = pretoOuBranco(bg);
    const claro = luminancia(bg) > 0.42;
    const paper = oklchHex(clamp(tomDominante + (claro ? 0.045 : 0.075), 0.04, 0.98), 0, 0);
    const ink = pretoOuBranco(paper);
    const surface = mistura(bg, text, claro ? 0.05 : 0.08);
    const accent2 = corOklchComContraste(bg, {
      l: clamp(tomDominante + (claro ? -0.28 : 0.28), 0.04, 0.96),
      c: 0,
      h: 0,
    }, 4.0);
    const strongBg = oklchHex(clamp(tomDominante + (claro ? -0.52 : 0.52), 0.04, 0.96), 0, 0);
    return {
      id: "original", original: true,
      bg, surface, paper, text,
      muted: corMutada(bg, text, 5.2), ink,
      accent: text, accent2, brand: accent2,
      softBg: paper, softText: ink, softMuted: corMutada(paper, ink), softAccent: ink,
      strongBg,
      strongText: pretoOuBranco(strongBg),
      strongAccent: corMutada(strongBg, pretoOuBranco(strongBg), 4.0),
    };
  }

  /* Regra nova: quando a arte tem cor, escolhemos uma relação QUENTE E
     HARMÔNICA — análoga, triádica ou split-complementary — em vez da
     complementar pura. O fundo fica saturado, mas continua garantindo
     contraste mínimo para preto ou branco. Em arte acromática, mantemos
     cinza/preto/branco e não inventamos uma cor. */
  const modoClaro = (extraida.tone ?? base.l) >= 0.5;
  const bg = fundoEditorialLeveAcessivel(extraida, base, modoClaro, 4.5);

  const warmBase = rgbOklch(hexRgb(bg));
  const calor = analisarCalorDaImagem(extraida);
  const hSuave = ajustarMatizEditorial(warmBase.h, calor);
  const origemTexto = sem.darkVibrant || sem.muted || sem.vibrant || dominante;
  const baseTexto = analogicaAcessivel(bg, origemTexto, 22, 5.6);
  const text = corTipograficaHarmonica(bg, baseTexto, 7.4, { targetL: modoClaro ? 0.16 : 0.9 });

  /* Em vez do preto puro, a tipografia passa a buscar cores profundas,
     editoriais e mais leves visualmente — ameixa, vinho, índigo, petróleo
     ou castanho queimado — sempre respeitando contraste alto no fundo. */
  const accent = corTipograficaHarmonica(bg, sem.vibrant || sem.darkVibrant || dominante, 6.0, { targetL: modoClaro ? 0.24 : 0.88 });
  const accent2 = corTipograficaHarmonica(bg, oklchHex(
    clamp(warmBase.l - (modoClaro ? 0.28 : -0.05), 0.14, 0.82),
    clamp(Math.max(warmBase.c * 1.05, 0.08), 0.07, 0.18),
    (warmBase.h + (suporteDeMatiz([base], warmBase.h) > 0.4 ? 0 : 18)) % 360,
  ), 5.2, { targetL: modoClaro ? 0.18 : 0.9 });

  const softBase = { ...warmBase, h: hSuave };
  const softBg = oklchHex(
    clamp(modoClaro ? softBase.l + 0.11 : softBase.l + 0.08, 0.18, 0.95),
    clamp(modoClaro ? softBase.c * 0.52 : softBase.c * 0.58, 0.03, 0.105),
    softBase.h,
  );
  const softText = corTipograficaHarmonica(softBg, text, 7.2, { targetL: luminancia(softBg) > 0.45 ? 0.18 : 0.9 });
  const softAccent = corTipograficaHarmonica(softBg, accent, 5.6, { targetL: luminancia(softBg) > 0.45 ? 0.22 : 0.88 });

  /* A versão forte continua quente, mas evitando o marrom pesado. */
  const strongBg = oklchHex(
    clamp(modoClaro ? softBase.l - 0.015 : softBase.l + 0.07, 0.36, 0.72),
    clamp(Math.max(softBase.c * 0.98, 0.1), 0.09, 0.18),
    calor.dourado > 0.26 && calor.rosa < 0.08 ? 22 : hSuave,
  );
  const strongText = corTipograficaHarmonica(strongBg, text, 7.2, { targetL: luminancia(strongBg) > 0.45 ? 0.18 : 0.9 });
  const strongAccent = corTipograficaHarmonica(strongBg, accent2 || accent, 5.6, { targetL: luminancia(strongBg) > 0.45 ? 0.22 : 0.88 });

  const paper = modoClaro
    ? oklchHex(clamp(softBase.l + 0.21, 0.92, 0.985), clamp(softBase.c * 0.1, 0.003, 0.018), softBase.h)
    : oklchHex(clamp(softBase.l + 0.56, 0.86, 0.975), clamp(softBase.c * 0.08, 0.003, 0.018), softBase.h);
  const ink = pretoOuBranco(paper);

  return {
    id: "original", original: true,
    bg,
    surface: mistura(bg, text, 0.08),
    paper,
    text,
    muted: corMutada(bg, text, 5.2),
    ink,
    accent,
    accent2,
    brand: accent,
    softBg,
    softText,
    softMuted: corMutada(softBg, softText),
    softAccent,
    strongBg,
    strongText,
    strongAccent,
  };
}

function temaOriginalDaImagem(im) {
  return temaOriginalDaPaleta(paletaImagem(im));
}

function normalizarTemaRuntime(pal) {
  const bg = pal.bg || "#0D0D0F";
  const preservar = pal.preserveTextColors || pal.custom || pal.id === "custom";
  const text = preservar && contraste(bg, pal.text) >= 4.5
    ? pal.text
    : textoSeguro(bg, pal.text || "#FFFFFF");
  const paper = pal.paper || mistura(bg, text, 0.88);
  const ink = preservar && contraste(paper, pal.ink || text) >= 4.5
    ? (pal.ink || text)
    : textoSeguro(paper, pal.ink || text);
  const accent = preservar && contraste(bg, pal.accent) >= 4.5
    ? pal.accent
    : corComContraste(bg, pal.accent || "#FF4A1C", text, 4.5);
  const accent2 = preservar && contraste(bg, pal.accent2) >= 3.5
    ? pal.accent2
    : corComContraste(bg, pal.accent2 || accent, text, 3.5);
  const softBg = paper;
  const softText = ink;
  const softAccent = corComContraste(softBg, pal.accent || accent, softText, 4.5);
  const strongBg = pal.accent || bg;
  const strongText = pretoOuBranco(strongBg);
  const strongAccent = corComContraste(strongBg, pal.accent2 || text, strongText, 4.5);
  return {
    ...pal,
    bg, text, paper, ink, accent, accent2,
    muted: corMutada(bg, text, 5.2),
    brand: accent2,
    softBg, softText,
    softMuted: corMutada(softBg, softText),
    softAccent,
    strongBg, strongText, strongAccent,
  };
}

function paletaPanoramaDaImagem(im, pal, data) {
  const runtime = data?.__runtimeTheme
    || (pal?.original ? temaOriginalDaImagem(im) : normalizarTemaRuntime(pal));
  return {
    ...runtime,
    artist: runtime.accent,
    track: runtime.accent2,
    brand: runtime.brand || runtime.accent2,
  };
}

function temaCustom(c = {}) {
  const bg = c.bg || c.background || c.backgroundColor || "#0D0D0F";
  const escolhida = c.text || c.textPrimary || c.foreground || c.fontColor || "#FFFFFF";
  const text = contraste(bg, escolhida) >= 4.5
    ? escolhida
    : corTipograficaHarmonica(bg, escolhida, 4.5);
  const mutedEscolhida = c.muted || c.textSecondary || c.secondaryText;
  const accentEscolhida = c.accent || c.textAccent || c.highlight || "#FF4A1C";
  const accent2Escolhida = c.accent2 || c.line || c.divider || c.secondaryAccent || "#1E2BFF";
  return {
    id: "custom",
    custom: true,
    preserveTextColors: true,
    bg,
    surface: mistura(bg, text, 0.12),
    paper: bg,
    text,
    muted: mutedEscolhida && contraste(bg, mutedEscolhida) >= 3.5
      ? mutedEscolhida
      : corMutada(bg, text, 4.2),
    ink: text,
    accent: contraste(bg, accentEscolhida) >= 4.5
      ? accentEscolhida
      : corTipograficaHarmonica(bg, accentEscolhida, 4.5),
    accent2: contraste(bg, accent2Escolhida) >= 3.5
      ? accent2Escolhida
      : corTipograficaHarmonica(bg, accent2Escolhida, 3.5),
  };
}

function temaBaseDe(data) {
  if (data?.themeId === "custom") return temaCustom(data.customColors);
  return THEME_BY_ID.get(data?.themeId || "original") || THEME_BY_ID.get("original");
}

function temaDe(data) {
  return data?.__runtimeTheme || temaBaseDe(data);
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

/* Escala global de texto do corpo dos layouts (o rodapé é tratado à parte,
   com aumento próprio). writeFit/fitText continuam medindo a fonte já
   escalada, então o ajuste horizontal segue funcionando. */
const ESCALA_TEXTO = 1.12;
function escalarFonte(valor) {
  if (typeof valor !== "string") return valor;
  return valor.replace(/(\d*\.?\d+)px/, (_, n) => `${(parseFloat(n) * ESCALA_TEXTO).toFixed(2)}px`);
}

function contextoTematico(ctx, pal) {
  const original = !pal || pal.original;
  return new Proxy(ctx, {
    get(alvo, prop) {
      if (!original && (prop === "createLinearGradient" || prop === "createRadialGradient" || prop === "createConicGradient")) {
        return (...args) => gradienteTematico(alvo[prop](...args), pal);
      }
      const v = Reflect.get(alvo, prop, alvo);
      return typeof v === "function" ? v.bind(alvo) : v;
    },
    set(alvo, prop, valor) {
      if (prop === "font") {
        valor = escalarFonte(valor);
      } else if (!original && ["fillStyle", "strokeStyle", "shadowColor"].includes(prop) && typeof valor === "string") {
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
  /* Rodapé enxuto, mas com assinatura maior e legível (pedido do Davi). */
  const base = H >= W * 1.6 ? 150 : H > W * 1.08 ? 134 : 122;
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

/* Lê a cor de fundo que o layout deixou logo acima do rodapé e devolve
   uma cor "chapada" representativa. Assim o rodapé continua o fundo do
   próprio cartaz, sem virar uma faixa com fundo diferente. */
function corLimiteRodape(ctxBruto, W, yLimite) {
  const sy = Math.max(0, Math.round(yLimite - 8));
  const amostras = 13;
  const rs = [], gs = [], bs = [];
  try {
    for (let i = 0; i < amostras; i++) {
      const sx = Math.min(W - 1, Math.max(0, Math.round(((i + 0.5) / amostras) * W)));
      const d = ctxBruto.getImageData(sx, sy, 1, 1).data;
      rs.push(d[0]); gs.push(d[1]); bs.push(d[2]);
    }
  } catch (_) {
    return { r: 13, g: 13, b: 15 };
  }
  const mediana = (a) => a.slice().sort((p, q) => p - q)[a.length >> 1];
  return { r: mediana(rs), g: mediana(gs), b: mediana(bs) };
}

function drawFaixaFooter(ctxBruto, W, H, data, pal, layoutId = "") {
  const s = W / 1080;
  const h = alturaRodape(W, H);
  const y = H - h;
  const st = strings(data);
  const pad = 52 * s;
  const brandPad = 56 * s;
  const assinatura = st.handle || (data?.user?.name ? `@${data.user.name}` : "sua escuta em cartaz");

  /* fundo = continuação lisa do próprio layout (sem emenda visível) */
  const c = corLimiteRodape(ctxBruto, W, y);
  const lum = (0.2126 * c.r + 0.7152 * c.g + 0.0587 * c.b) / 255;
  const escuro = lum < 0.5;
  const base = `rgb(${c.r},${c.g},${c.b})`;
  const claro = escuro ? "rgba(255,255,255,.94)" : "rgba(17,17,20,.94)";
  const fraco = escuro ? "rgba(255,255,255,.52)" : "rgba(17,17,20,.5)";
  const fio = escuro ? "rgba(255,255,255,.14)" : "rgba(17,17,20,.12)";
  const marca = pal && !pal.original ? (pal.accent || PINK) : PINK;

  ctxBruto.save();
  ctxBruto.fillStyle = base;
  ctxBruto.fillRect(0, y, W, h + 2);
  /* fio fino em vez de barra colorida — só marca o pé, sem peso de UI */
  ctxBruto.fillStyle = fio;
  ctxBruto.fillRect(pad, y, W - pad * 2, Math.max(1, 1.5 * s));

  ctxBruto.textBaseline = "alphabetic";
  const meioY = y + h * 0.5;
  ctxBruto.textAlign = "left";
  ctxBruto.fillStyle = claro;
  ctxBruto.font = `700 ${34 * s}px Archivo`;
  ctxBruto.fillText(truncate(ctxBruto, st.range, W * 0.52), pad, meioY - 8 * s);
  ctxBruto.fillStyle = fraco;
  ctxBruto.font = `500 ${24 * s}px Archivo`;
  ctxBruto.fillText(truncate(ctxBruto, assinatura, W * 0.56), pad, meioY + 32 * s);

  ctxBruto.textAlign = "right";
  ctxBruto.fillStyle = fraco;
  tracking(ctxBruto, 1.4 * s);
  ctxBruto.font = `600 ${19 * s}px Archivo`;
  ctxBruto.fillText("SUA ESCUTA EM", W - brandPad, meioY - 14 * s);
  tracking(ctxBruto, 0);
  ctxBruto.fillStyle = marca;
  ctxBruto.font = `400 ${42 * s}px "Archivo Black"`;
  ctxBruto.fillText("FAIXA", W - brandPad, meioY + 30 * s);
  ctxBruto.restore();
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
  const totalMin = Math.floor(seg / 60);
  return curto ? `${totalMin}min` : `${totalMin} minutos`;
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
    metaArtista: (a) => metaArtistaTempoRepro(data, a),
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
  const destaque = corDestaque(FUNDO, { accent }); /* #1 pop sobre o fundo escuro */

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
      ctx.fillStyle = i === 0 ? destaque : FRACO;
      ctx.font = `700 ${20 * s}px Archivo`;
      ctx.fillText(String(i + 1), x, yy);
      ctx.fillStyle = i === 0 ? destaque : CLARO;
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

/* ============================================================
   LAYOUT 3 — LAMBE (papel, fita zebrada, tinta chapada)
   ============================================================ */

/* ============================================================
   LAYOUT 4 — XEROX (retícula de meio-tom, zine)
   ============================================================ */
function drawXerox(ctx, W, H, data) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.6;
  const accent = st.p.recap ? GOLD : PINK;
  const destaque = corDestaque(INK, { accent }); /* #1 pop sobre a tinta */

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
      ctx.fillStyle = i === 0 ? destaque : PAPER;
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
function cobrir(ctx, img, x, y, w, h, focusY = 0.5, focusX = 0.5) {
  const escala = Math.max(w / img.width, h / img.height);
  const dw = img.width * escala;
  const dh = img.height * escala;
  /* focusY/focusX em 0..1 escolhem o ponto que fica visível ao recortar.
     focusY menor mostra mais do TOPO (evita cortar cabeça em retratos). */
  ctx.drawImage(img, x + (w - dw) * focusX, y + (h - dh) * focusY, dw, dh);
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

function imagemRecortada(ctx, url, x, y, w, h, raio, nome = "", claro = false, stroke = "rgba(255,255,255,.2)", focusY = 0.42, focusX = 0.5) {
  const im = capaDe(url);
  ctx.save();
  if (raio >= Math.min(w, h) / 2) {
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
  } else {
    roundRect(ctx, x, y, w, h, raio);
  }
  ctx.clip();
  if (im) cobrir(ctx, im, x, y, w, h, focusY, focusX);
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


/* ============================================================
   NOVOS CANVASES — coleção criada a partir dos layouts enviados
   ============================================================ */

const SOLAR = "#FFA300";
const SOLAR_ESCURO = "#C65300";
const VIOLETA_URL = "#7A00FF";
const MENTA = "#D7EFE7";
const CINZA_TEXTO = "#353538";

function assinaturaDoLayout(data, st) {
  if (st.handle) return st.handle;
  return data?.user?.name ? `@${data.user.name}` : "";
}

function tempoArtista(data, artista) {
  return formatTempo((artista?.playcount || 0) * (data?.mediaDur || 210), true).toUpperCase();
}

function tempoFaixa(data, faixa) {
  const duracao = faixa?.duration > 0 ? faixa.duration : data?.mediaDur || 210;
  return formatTempo((faixa?.playcount || 0) * duracao, true).toUpperCase();
}

function metaArtistaTempoRepro(data, artista) {
  return `${tempoArtista(data, artista)} • ${artista?.playcount || 0} REPROD.`;
}

function corTipograficaHarmonica(bg, origem = null, minimo = 5.2, op = {}) {
  const fundoRgb = hexRgb(bg) || { r: 13, g: 13, b: 15 };
  const fundo = rgbOklch(fundoRgb);
  if (fundo.c < 0.03) return pretoOuBranco(bg);

  const srcRgb = typeof origem === "string" ? (hexRgb(origem) || fundoRgb) : fundoRgb;
  const src = rgbOklch(srcRgb);
  const claro = fundo.l >= 0.56;
  const alvoL = op.targetL ?? (claro ? 0.2 : 0.88);
  const srcH = Number.isFinite(src.h) ? src.h : fundo.h || 18;
  const comp = ((fundo.h || 0) + 180) % 360;
  const candidateHs = [...new Set([
    srcH,
    (srcH - 18 + 360) % 360,
    (srcH + 18) % 360,
    comp,
    (comp - 28 + 360) % 360,
    (comp + 28) % 360,
    ((fundo.h || 0) + 145) % 360,
    ((fundo.h || 0) + 215) % 360,
  ])];
  const candidateCs = claro
    ? [0.19, 0.16, 0.13, 0.1, 0.07, 0.04]
    : [0.13, 0.16, 0.1, 0.07, 0.04];

  let melhor = null;
  let melhorScore = -1e9;
  for (const h of candidateHs) {
    const separacao = distanciaMatiz(h, fundo.h || 0);
    const proximidadeImagem = distanciaMatiz(h, srcH);
    for (const c of candidateCs) {
      for (let l = claro ? 0.06 : 0.58; claro ? l <= 0.4 : l <= 0.97; l += 0.012) {
        const cor = oklchHex(l, c, h);
        const ct = contraste(bg, cor);
        const passou = ct >= minimo;
        const score = (passou ? 1000 : 0)
          + ct * 14
          + c * 175
          + Math.min(separacao, 180) * 0.2
          - Math.abs(l - alvoL) * 105
          - proximidadeImagem * 0.13;
        if (score > melhorScore) {
          melhor = cor;
          melhorScore = score;
        }
      }
    }
  }
  if (melhor && contraste(bg, melhor) >= minimo) return melhor;
  return corOklchComContraste(bg, {
    l: claro ? 0.19 : 0.88,
    c: claro ? 0.1 : 0.06,
    h: comp,
  }, minimo, claro ? 0.19 : 0.88);
}

function textoAltaContraste(bg, cor = null, fallback = null, minimo = 5.2) {
  const origem = cor || fallback || pretoOuBranco(bg);
  if (cor && contraste(bg, cor) >= minimo) return cor;
  const harmonica = corTipograficaHarmonica(bg, origem, minimo);
  if (contraste(bg, harmonica) >= minimo) return harmonica;
  const seguro = fallback || pretoOuBranco(bg);
  return corComContraste(bg, origem, seguro, minimo);
}

function destaqueAltaContraste(bg, cor = null, fallback = null, minimo = 4.5) {
  const origem = cor || fallback || pretoOuBranco(bg);
  if (cor && contraste(bg, cor) >= minimo) return cor;
  const harmonica = corTipograficaHarmonica(bg, origem, minimo, { targetL: luminancia(bg) > 0.45 ? 0.2 : 0.88 });
  if (contraste(bg, harmonica) >= minimo) return harmonica;
  const seguro = fallback || pretoOuBranco(bg);
  return corComContraste(bg, origem, seguro, minimo);
}

function duracaoFaixa(faixa, data) {
  const total = Math.max(0, Math.round(faixa?.duration || data?.mediaDur || 210));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function rodapeFaixaUrl(ctx, W, H, data, op = {}) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.55;
  const h = (tall ? 176 : 142) * s;
  const y = H - h;
  const pad = (op.pad || 54) * s;

  if (op.background) {
    ctx.fillStyle = op.background;
    ctx.fillRect(0, y - 2 * s, W, h + 3 * s);
  }

  const text = op.text || "#09090B";
  const muted = op.muted || text;
  const brand = op.brand || VIOLETA_URL;
  const assinatura = assinaturaDoLayout(data, st);

  ctx.textAlign = "left";
  ctx.fillStyle = text;
  ctx.font = `700 ${tall ? 38 : 31}px Archivo`;
  writeFit(ctx, st.range, pad, y + h * 0.45, W * 0.48, (tall ? 38 : 31) * s, 20 * s, "Archivo", "700");
  if (assinatura) {
    ctx.fillStyle = muted;
    ctx.font = `500 ${tall ? 31 : 25}px Archivo`;
    writeFit(ctx, assinatura, pad, y + h * 0.70, W * 0.48, (tall ? 31 : 25) * s, 17 * s, "Archivo", "500");
  }

  ctx.textAlign = "right";
  ctx.fillStyle = brand;
  ctx.font = `400 ${tall ? 58 : 46}px "Archivo Black"`;
  writeFit(ctx, "FAIXA.URL", W - pad, y + h * 0.66, W * 0.43, (tall ? 58 : 46) * s, 27 * s, "Archivo Black", "400");
  ctx.textAlign = "left";
  return y;
}

function fundoSolar(ctx, W, H, cor = SOLAR) {
  ctx.fillStyle = cor;
  ctx.fillRect(0, 0, W, H);
}

function fundoMenta(ctx, W, H, pal = null) {
  const base = pal?.softBg || "#C9E9DF";
  const claro = luminancia(base) >= 0.5;
  const meio = mistura(base, claro ? "#FFFFFF" : "#000000", claro ? 0.28 : 0.12);
  const fim = mistura(base, claro ? "#FFFFFF" : "#000000", claro ? 0.72 : 0.3);
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, base);
  g.addColorStop(0.5, meio);
  g.addColorStop(1, fim);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function tituloSolar(ctx, W, titulo, periodo, compact = false, cor = "#050507") {
  const s = W / 1080;
  const pad = 72 * s;
  ctx.fillStyle = cor;
  ctx.font = `400 ${compact ? 82 : 102}px "Archivo Black"`;
  writeFit(ctx, titulo, pad, 164 * s, W - pad * 2, (compact ? 82 : 102) * s, 46 * s, "Archivo Black", "400");
  ctx.font = `700 ${compact ? 37 : 43}px Archivo`;
  writeFit(ctx, periodo, pad, 216 * s, W - pad * 2, (compact ? 37 : 43) * s, 25 * s, "Archivo", "700");
}

function listaDuasColunas(ctx, W, data, y, limiteY, op = {}) {
  const s = W / 1080;
  const st = strings(data);
  const pad = (op.pad || 74) * s;
  const gap = (op.gap || 62) * s;
  const colW = (W - pad * 2 - gap) / 2;
  const qtd = op.qtd || 5;
  const linha = Math.min((limiteY - y) / (qtd + 0.15), (op.row || 102) * s);
  const tituloSize = (op.titleSize || 41) * s;
  const nomeSize = (op.nameSize || 34) * s;
  const metaSize = (op.metaSize || 21) * s;
  const cor = op.cor || "#050507";

  const coluna = (x, titulo, itens, nome, meta, destaque = null) => {
    ctx.fillStyle = cor;
    ctx.font = `700 ${tituloSize}px Archivo`;
    ctx.fillText(titulo, x, y);
    ctx.fillRect(x, y + 12 * s, colW, 2 * s);
    let yy = y + 68 * s;
    itens.slice(0, qtd).forEach((it, i) => {
      const corItem = i === 0 && destaque ? destaque : cor;
      ctx.fillStyle = corItem;
      ctx.font = `700 ${nomeSize}px Archivo`;
      ctx.fillText(`#${i + 1}`, x, yy);
      writeFit(ctx, nome(it), x + 72 * s, yy, colW - 72 * s, nomeSize, 17 * s, "Archivo", "700");
      ctx.fillStyle = corItem;
      ctx.font = `500 ${metaSize}px Archivo`;
      writeFit(ctx, meta(it), x + 72 * s, yy + 30 * s, colW - 72 * s, metaSize, 13 * s, "Archivo", "500");
      yy += linha;
    });
  };

  coluna(pad, "TOP ARTISTAS", st.artists, (a) => a.name || "—", (a) => metaArtistaTempoRepro(data, a), op.highlightLeft || null);
  ctx.fillStyle = cor;
  ctx.fillRect(W / 2 - 1 * s, y + 44 * s, 2 * s, Math.max(0, limiteY - y - 54 * s));
  coluna(pad + colW + gap, "TOP MÚSICAS", st.tracks, (t) => t.name || "—", (t) => `${t.artist || ""} · ${tempoFaixa(data, t)}`, op.highlightRight || null);
}

/* 01 — recibo tipográfico em papel amassado */
function drawReciboNovo(ctx, W, H, data) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.55;
  const qtd = tall ? 5 : H > W * 1.15 ? 4 : 3;
  const M = "'Courier Prime', 'Courier New', monospace";

  /* RECIBO FIXO: não herda tema, não muda na personalização.
     Fundo sempre branco; texto sempre preto. */
  const papel = "#FFFFFF";
  const tinta = "#000000";
  const destRecibo = tinta;

  ctx.fillStyle = papel;
  ctx.fillRect(0, 0, W, H);
  if (papelImg) {
    ctx.save();
    ctx.globalAlpha = 0.48;
    cobrir(ctx, papelImg, 0, 0, W, H, 0.48);
    ctx.restore();
    ctx.fillStyle = luminancia(papel) > 0.5 ? "rgba(255,255,255,.22)" : "rgba(0,0,0,.18)";
    ctx.fillRect(0, 0, W, H);
  } else {
    grain(ctx, W, H, 0.045, Math.round((W * H) / 1700));
  }

  const pad = 48 * s;
  const right = W - pad;
  const album = st.album || {};
  const hero = st.artists[0] || {};
  const assinatura = assinaturaDoLayout(data, st) || "@USUARIO";
  const line = (y) => {
    ctx.save();
    ctx.strokeStyle = tinta;
    ctx.lineWidth = 2 * s;
    ctx.setLineDash([7 * s, 7 * s]);
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(right, y);
    ctx.stroke();
    ctx.restore();
  };

  ctx.fillStyle = tinta;
  ctx.textAlign = "center";
  ctx.font = `700 ${72 * s}px ${M}`;
  writeFit(ctx, `${album.name || "ÁLBUM"}`.toUpperCase(), W / 2, 165 * s, W - pad * 2, 72 * s, 36 * s, M, "700");
  ctx.font = `700 ${43 * s}px ${M}`;
  writeFit(ctx, (album.artist || hero.name || "ARTISTA").toUpperCase(), W / 2, 232 * s, W - pad * 2, 43 * s, 25 * s, M, "700");
  ctx.textAlign = "left";

  ctx.font = `400 ${34 * s}px ${M}`;
  writeFit(ctx, `ORDER #${st.count} MINUTOS DE ${assinatura}`.toUpperCase(), pad, 428 * s, W - pad * 2, 34 * s, 20 * s, M, "400");
  writeFit(ctx, st.range.toUpperCase(), pad, 478 * s, W - pad * 2, 34 * s, 20 * s, M, "700");

  let y = 516 * s;
  const cab = (esq, dir) => {
    line(y);
    y += 44 * s;
    ctx.font = `700 ${29 * s}px ${M}`;
    ctx.fillText("IT.", pad, y);
    ctx.fillText(esq, pad + 116 * s, y);
    ctx.textAlign = "right";
    ctx.fillText(dir, right, y);
    ctx.textAlign = "left";
    y += 20 * s;
    line(y);
    y += 60 * s;
  };

  const linhaTabela = (i, nome, meta, sub = "") => {
    const cor = i === 0 ? destRecibo : tinta;
    ctx.fillStyle = cor;
    ctx.font = `400 ${29 * s}px ${M}`;
    ctx.fillText(String(i + 1).padStart(2, "0"), pad, y);
    ctx.font = `700 ${31 * s}px ${M}`;
    writeFit(ctx, String(nome || "—").toUpperCase(), pad + 116 * s, y, W * 0.51, 31 * s, 18 * s, M, "700");
    ctx.textAlign = "right";
    ctx.font = `700 ${28 * s}px ${M}`;
    writeFit(ctx, String(meta || ""), right, y, W * 0.31, 28 * s, 15 * s, M, "700");
    ctx.textAlign = "left";
    if (sub) {
      ctx.fillStyle = cor;
      ctx.font = `400 ${20 * s}px ${M}`;
      writeFit(ctx, String(sub).toUpperCase(), pad + 116 * s, y + 26 * s, W * 0.48, 20 * s, 12 * s, M, "400");
      y += 15 * s;
    }
    y += 55 * s;
  };

  cab("ARTISTA", "QTD.");
  st.artists.slice(0, qtd).forEach((a, i) => linhaTabela(i, a.name, `${a.playcount || 0} REPROD.`));
  y += 2 * s;
  cab("MÚSICA", "AMT");
  st.tracks.slice(0, qtd).forEach((t, i) => linhaTabela(i, t.name, tempoFaixa(data, t), t.artist));

  if (tall) {
    cab("ÁLBUNS", "AMT");
    linhaTabela(0, album.name || "—", `${album.playcount || 0} REPROD.`);
    ctx.fillStyle = tinta; /* volta pra tinta depois do #1 destacado */
    y += 8 * s;
    line(y);
    y += 48 * s;
    ctx.font = `700 ${28 * s}px ${M}`;
    ctx.fillText("ITENS:", pad, y);
    ctx.textAlign = "right";
    ctx.fillText(`${data.count || 0} FAIXAS`, right, y);
    ctx.textAlign = "left";
    y += 54 * s;
    ctx.fillText("TOTAL:", pad, y);
    ctx.textAlign = "right";
    ctx.fillText(st.tempoLongo.toUpperCase(), right, y);
    ctx.textAlign = "left";
    y += 28 * s;
    line(y);
    y += 56 * s;
    ctx.font = `400 ${27 * s}px ${M}`;
    ctx.fillText(`CARD #: **** **** **** ${new Date().getFullYear()}`, pad, y);
    y += 58 * s;
    ctx.fillText(`AUTH CODE: ${assinatura}`, pad, y);
    y += 58 * s;
    ctx.fillText("CARDHOLDER: FAIXA.URL", pad, y);
  }
}

/* 02 — painel solar completo */
function drawResumoSolar(ctx, W, H, data) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.55;

  /* fundo derivado da foto do artista (vibrante; neutro se a foto for p&b) */
  const pal = temaDe(data);
  const heroImg = capaDe((st.artists[0] || {}).image || data.artistImage);
  const cores = paletaPanoramaDaImagem(heroImg, pal, data);

  const texto = textoAltaContraste(cores.bg, cores.text);
  const textoMutado = corMutada(cores.bg, texto, 5.2);
  const destaqueA = destaqueAltaContraste(cores.bg, cores.accent, texto);
  const destaqueB = destaqueAltaContraste(cores.bg, cores.accent2 || cores.accent, texto);
  const marca = destaqueAltaContraste(cores.bg, cores.brand || cores.accent || texto, texto);

  ctx.fillStyle = cores.bg;
  ctx.fillRect(0, 0, W, H);
  const footerY = rodapeFaixaUrl(ctx, W, H, data, { background: cores.bg, text: texto, muted: textoMutado, brand: marca });
  const pad = 76 * s;

  ctx.fillStyle = texto;
  ctx.font = `700 ${39 * s}px Archivo`;
  writeFit(ctx, st.range, pad, 150 * s, W - pad * 2, 39 * s, 24 * s, "Archivo", "700");

  const hero = st.artists[0] || {};
  const lado = Math.min(570 * s, W * 0.57);
  imagemRecortada(ctx, hero.image || data.artistImage, (W - lado) / 2, 250 * s, lado, lado, 0, hero.name || "ARTISTA", true, "rgba(0,0,0,.08)", 0.34);

  const listY = tall ? 920 * s : 770 * s;
  const listBottom = Math.min(footerY - 370 * s, listY + 510 * s);
  const dest = destaqueA;
  listaDuasColunas(ctx, W, data, listY, listBottom, { qtd: tall ? 5 : 3, row: tall ? 96 : 82, nameSize: tall ? 32 : 28, cor: texto, highlightLeft: dest, highlightRight: destaqueB });

  const album = st.album || {};
  const base = Math.max(listBottom + 76 * s, footerY - (tall ? 330 : 250) * s);
  ctx.fillStyle = texto;
  ctx.font = `500 ${25 * s}px Archivo`;
  ctx.fillText("ÁLBUM MAIS OUVIDO", pad, base);
  ctx.font = `700 ${40 * s}px Archivo`;
  writeFit(ctx, album.name || "—", pad, base + 50 * s, W * 0.55, 40 * s, 22 * s, "Archivo", "700");
  ctx.textAlign = "right";
  ctx.font = `500 ${27 * s}px Archivo`;
  writeFit(ctx, album.artist || "", W - pad, base + 50 * s, W * 0.35, 27 * s, 17 * s, "Archivo", "500");
  ctx.textAlign = "left";
  ctx.font = `400 ${47 * s}px "Archivo Black"`;
  ctx.fillText("TEMPO OUVIDO", pad, base + 155 * s);
  ctx.font = `700 ${39 * s}px Archivo`;
  ctx.fillText(st.tempoLongo.toUpperCase(), pad, base + 204 * s);
}

/* 03 — artista em foco com cartões laterais */
function drawArtistaFoco(ctx, W, H, data) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.55;

  const artistas = st.artists;
  const topArtista = artistas[0] || {};
  const topImage = topArtista.image || data.artistImage;
  const topName = topArtista.name || "—";

  /* fundo derivado da foto do artista (vibrante; neutro se a foto for p&b) */
  const pal = temaDe(data);
  const cores = paletaPanoramaDaImagem(capaDe(topImage), pal, data);

  const texto = textoAltaContraste(cores.bg, cores.text);
  const textoMutado = corMutada(cores.bg, texto, 5.2);
  const marca = destaqueAltaContraste(cores.bg, cores.brand || cores.accent || texto, texto);

  ctx.fillStyle = cores.bg;
  ctx.fillRect(0, 0, W, H);
  const footerY = rodapeFaixaUrl(ctx, W, H, data, { background: cores.bg, text: texto, muted: textoMutado, brand: marca });
  tituloSolar(ctx, W, "TOP ARTISTA", st.range, true, texto);

  const pad = 72 * s;
  const cardY = tall ? 350 * s : 280 * s;
  const textReserve = tall ? 188 * s : 154 * s;
  const bottomGap = tall ? 118 * s : 96 * s;
  const cardH = Math.max(240 * s, Math.min(tall ? 650 * s : 470 * s, footerY - cardY - textReserve - bottomGap));
  const cardW = Math.min(620 * s, W * 0.62);
  const cx = (W - cardW) / 2;
  const sideW = Math.min(208 * s, W * 0.2);
  const raio = 16 * s;
  const sideInset = 74 * s;

  /* laterais = continuação da mesma foto do top #1, não recorte central repetido.
     cartão esquerdo mostra o lado DIREITO da imagem; cartão direito mostra o lado ESQUERDO. */
  imagemRecortada(ctx, topImage, -sideInset, cardY, sideW, cardH, raio, topName, true, "rgba(0,0,0,.06)", 0.34, 1);
  imagemRecortada(ctx, topImage, cx, cardY, cardW, cardH, raio, topName, true, "rgba(0,0,0,.06)", 0.34, 0.5);
  imagemRecortada(ctx, topImage, W - sideW + sideInset, cardY, sideW, cardH, raio, topName, true, "rgba(0,0,0,.06)", 0.34, 0);

  const nomeY = Math.min(cardY + cardH + (tall ? 112 : 94) * s, footerY - (tall ? 102 : 86) * s);
  const tempoY = Math.min(nomeY + 54 * s, footerY - 26 * s);
  ctx.fillStyle = texto;
  ctx.font = `400 ${82 * s}px "Archivo Black"`;
  writeFit(ctx, topName, pad, nomeY, W - pad * 2, 82 * s, 38 * s, "Archivo Black", "400");
  ctx.font = `500 ${39 * s}px Archivo`;
  writeFit(ctx, metaArtistaTempoRepro(data, topArtista), pad, tempoY, W - pad * 2, 39 * s, 18 * s, "Archivo", "500");
}

/* 04 — resumo com imagem dissolvendo no laranja */
function drawPanoramaSolar(ctx, W, H, data) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.55;
  const pal = temaDe(data);
  const bruto = ctx.canvas?.getContext?.("2d") || ctx;

  const heroUrl = data.artistImage || st.artists[0]?.image || st.tracks[0]?.capa;
  const hero = capaDe(heroUrl);
  const heroH = tall ? 840 * s : 640 * s;
  const cores = paletaPanoramaDaImagem(hero, pal, data);
  const baseBg = cores.bg;
  const corTexto = cores.text;

  bruto.fillStyle = baseBg;
  bruto.fillRect(0, 0, W, H);

  if (hero) {
    bruto.save();
    bruto.globalAlpha = 0.96;
    cobrir(bruto, hero, 0, 0, W, heroH, 0.24);
    bruto.restore();
  } else {
    fundoRetrato(bruto, 0, 0, W, heroH, st.artists[0]?.name || "FAIXA", true);
  }

  const branco = bruto.createLinearGradient(0, 0, 0, heroH * 0.48);
  branco.addColorStop(0, "rgba(255,255,255,.42)");
  branco.addColorStop(0.52, "rgba(255,255,255,.10)");
  branco.addColorStop(1, "rgba(255,255,255,0)");
  bruto.fillStyle = branco;
  bruto.fillRect(0, 0, W, heroH * 0.5);

  const pad = 76 * s;
  const rangeY = heroH + 74 * s;
  const listY = rangeY + 120 * s;

  const fadeStart = heroH * 0.64;
  const fadeEnd = listY + 38 * s;
  const fade = bruto.createLinearGradient(0, fadeStart, 0, fadeEnd);
  fade.addColorStop(0, rgbaDe(baseBg, 0));
  fade.addColorStop(0.32, rgbaDe(baseBg, 0.16));
  fade.addColorStop(0.68, rgbaDe(baseBg, 0.76));
  fade.addColorStop(1, rgbaDe(baseBg, 1));
  bruto.fillStyle = fade;
  bruto.fillRect(0, fadeStart, W, fadeEnd - fadeStart);

  const texto = textoAltaContraste(baseBg, corTexto);
  const textoMutado = corMutada(baseBg, texto, 5.2);
  const destaqueA = destaqueAltaContraste(baseBg, cores.accent, texto);
  const destaqueB = destaqueAltaContraste(baseBg, cores.accent2 || cores.accent, texto);
  const marca = destaqueAltaContraste(baseBg, cores.brand || cores.accent || texto, texto);

  const footerY = rodapeFaixaUrl(bruto, W, H, data, {
    background: baseBg,
    text: texto,
    muted: textoMutado,
    brand: marca,
  });
  const listBottom = Math.min(footerY - (tall ? 300 : 230) * s, listY + (tall ? 560 : 360) * s);

  bruto.fillStyle = texto;
  bruto.font = `700 ${39 * s * ESCALA_TEXTO}px Archivo`;
  writeFit(bruto, st.range, pad, rangeY, W - pad * 2, 39 * s * ESCALA_TEXTO, 24 * s, "Archivo", "700");

  listaDuasColunas(bruto, W, data, listY, listBottom, {
    qtd: tall ? 5 : 3,
    row: tall ? 96 : 80,
    cor: texto,
    titleSize: 41 * ESCALA_TEXTO,
    nameSize: 34 * ESCALA_TEXTO,
    metaSize: 21 * ESCALA_TEXTO,
    highlightLeft: destaqueA,
    highlightRight: destaqueB,
  });

  const tempoY = Math.min(footerY - 56 * s, listBottom + 154 * s);
  bruto.fillStyle = texto;
  bruto.font = `400 ${46 * s * ESCALA_TEXTO}px "Archivo Black"`;
  bruto.fillText("TEMPO OUVIDO", pad, tempoY - 44 * s);
  bruto.font = `700 ${38 * s * ESCALA_TEXTO}px Archivo`;
  bruto.fillText(st.tempoLongo.toUpperCase(), pad, tempoY);
}

function drawRankingSolar(ctx, W, H, data, modo) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.55;
  const pal = temaDe(data);
  const bg = pal.strongBg || pal.bg || SOLAR;
  const text = textoAltaContraste(bg, pal.strongText || pretoOuBranco(bg));
  const dest = destaqueAltaContraste(bg, pal.strongAccent || pal.accent2, text);
  fundoSolar(ctx, W, H, bg);
  const footerY = rodapeFaixaUrl(ctx, W, H, data, {
    background: bg,
    brand: dest,
    text,
    muted: corMutada(bg, text, 5.2),
  });
  tituloSolar(ctx, W, modo === "musicas" ? "MÚSICAS" : "ARTISTAS", st.range, false, text);

  const itens = modo === "musicas" ? st.tracks : st.artists;
  const qtd = tall ? 5 : H > W * 1.15 ? 4 : 3;
  const startY = 330 * s;
  const disponivel = footerY - startY - 36 * s;
  const rowH = disponivel / qtd;
  const img = Math.min(245 * s, rowH - 24 * s);
  const numX = 72 * s;
  const imgX = 176 * s;
  const textX = imgX + img + 26 * s;

  itens.slice(0, qtd).forEach((it, i) => {
    const cor = i === 0 ? dest : text;
    const cy = startY + rowH * i + rowH / 2;
    const iy = cy - img / 2;
    ctx.fillStyle = cor;
    ctx.font = `400 ${56 * s}px "Archivo Black"`;
    ctx.fillText(`#${i + 1}`, numX, cy + 17 * s);
    const url = modo === "musicas" ? it.capa : it.image;
    imagemRecortada(ctx, url, imgX, iy, img, img, 7 * s, it.name || String(i + 1), true, "rgba(0,0,0,.06)", modo === "artistas" ? 0.34 : 0.5);
    ctx.fillStyle = cor;
    ctx.font = `400 ${58 * s}px "Archivo Black"`;
    writeFit(ctx, it.name || "—", textX, cy - 4 * s, W - textX - 60 * s, 58 * s, 29 * s, "Archivo Black", "400");
    ctx.fillStyle = cor;
    ctx.font = `500 ${38 * s}px Archivo`;
    writeFit(ctx, modo === "musicas" ? it.artist || "" : metaArtistaTempoRepro(data, it), textX, cy + 46 * s, W - textX - 60 * s, 38 * s, 18 * s, "Archivo", "500");
  });
}

/* 05 — ranking de músicas solar */
function drawMusicasSolar(ctx, W, H, data) {
  drawRankingSolar(ctx, W, H, data, "musicas");
}

/* 06 — ranking de artistas solar */
function drawArtistasSolar(ctx, W, H, data) {
  drawRankingSolar(ctx, W, H, data, "artistas");
}

/* 07 — artista principal sobre capa enevoada */
function drawArtistaAura(ctx, W, H, data) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.55;
  const hero = st.artists[0] || {};

  /* cor da película derivada da foto do artista; neutra se a foto for p&b.
     misturada com bastante branco pra manter o layout claro e o texto legível. */
  const pal = temaDe(data);
  const cores = paletaPanoramaDaImagem(capaDe(hero.image || data.artistImage), pal, data);
  const veuTopo = rgbaDe(mistura(cores.bg, "#FFFFFF", 0.64), 0.72);
  const veuMeio = rgbaDe(mistura(cores.bg, "#FFFFFF", 0.80), 0.80);
  const veuBase = rgbaDe(mistura(cores.bg, "#FFFFFF", 0.93), 0.95);

  /* base clara já no tom da foto, no lugar do menta fixo */
  ctx.fillStyle = mistura(cores.bg, "#FFFFFF", 0.87);
  ctx.fillRect(0, 0, W, H);

  const bgUrl = st.tracks[0]?.capa || st.album?.capa || data.artistImage;
  const capaFundo = capaDe(bgUrl);
  if (capaFundo) {
    ctx.save();
    ctx.globalAlpha = 0.28;
    cobrir(ctx, capaFundo, 0, 0, W, H, 0.42);
    ctx.restore();
    const wash = ctx.createLinearGradient(0, 0, 0, H);
    wash.addColorStop(0, veuTopo);
    wash.addColorStop(0.5, veuMeio);
    wash.addColorStop(1, veuBase);
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, W, H);
  }
  const auraBg = mistura(cores.bg, "#FFFFFF", 0.87);
  const auraText = textoAltaContraste(auraBg, cores.softText || cores.text);
  const auraMuted = corMutada(auraBg, auraText, 5.2);
  const auraBrand = destaqueAltaContraste(auraBg, cores.brand || cores.accent || auraText, auraText);
  const footerY = rodapeFaixaUrl(ctx, W, H, data, {
    background: auraBg,
    brand: auraBrand,
    text: auraText,
    muted: auraMuted,
  });
  const pad = 72 * s;

  ctx.fillStyle = auraText;
  ctx.font = `500 ${48 * s}px Archivo`;
  ctx.fillText("Top Artista", pad, 162 * s);
  ctx.font = `400 ${84 * s}px "Archivo Black"`;
  writeFit(ctx, hero.name || "—", pad, 244 * s, W - pad * 2, 84 * s, 38 * s, "Archivo Black", "400");
  ctx.font = `500 ${45 * s}px Archivo`;
  ctx.fillText(metaArtistaTempoRepro(data, hero), pad, 302 * s);

  const d = Math.min(W * 0.79, tall ? 900 * s : 610 * s);
  const x = (W - d) / 2;
  const y = Math.min(tall ? 785 * s : 560 * s, footerY - d - 80 * s);
  imagemRecortada(ctx, hero.image || data.artistImage, x, y, d, d, d / 2, hero.name || "ARTISTA", true, "rgba(255,255,255,.2)", 0.34);
}

function drawRankingMenta(ctx, W, H, data, modo) {
  const s = W / 1080;
  const st = strings(data);
  const tall = H >= W * 1.55;
  const pal = temaDe(data);
  const softBg = pal.softBg || pal.paper;
  const text = textoAltaContraste(softBg, pal.softText || pal.ink || pal.text);
  const muted = corMutada(softBg, text, 5.2);
  const dest = destaqueAltaContraste(softBg, pal.softAccent || pal.accent, text);
  fundoMenta(ctx, W, H, pal);
  const footerY = rodapeFaixaUrl(ctx, W, H, data, {
    background: null,
    brand: destaqueAltaContraste(softBg, pal.brand || dest, text),
    text,
    muted,
  });
  const pad = 72 * s;

  ctx.fillStyle = text;
  ctx.font = `400 ${88 * s}px "Archivo Black"`;
  writeFit(ctx, modo === "musicas" ? "Top Músicas" : "Top Artistas", pad, 166 * s, W - pad * 2, 88 * s, 46 * s, "Archivo Black", "400");
  ctx.font = `700 ${39 * s}px Archivo`;
  const apoio = modo === "musicas" ? `TOTAL DE TEMPO OUVIDO NO PERÍODO` : `TOTAL DE ARTISTAS OUVIDOS NO PERÍODO`;
  writeFit(ctx, apoio, pad, 224 * s, W - pad * 2, 39 * s, 22 * s, "Archivo", "700");
  ctx.font = `700 ${38 * s}px Archivo`;
  ctx.fillText(st.range, pad, 278 * s);

  const itens = modo === "musicas" ? st.tracks : st.artists;
  const qtd = tall ? 5 : H > W * 1.15 ? 4 : 3;
  const startY = 350 * s;
  const rowH = (footerY - startY - 32 * s) / qtd;
  const size = Math.min(240 * s, rowH - 28 * s);
  const numX = 72 * s;
  const imgX = 176 * s;
  const textX = imgX + size + 32 * s;

  itens.slice(0, qtd).forEach((it, i) => {
    const cor = i === 0 ? dest : text;
    const cy = startY + rowH * i + rowH / 2;
    const iy = cy - size / 2;
    ctx.fillStyle = cor;
    ctx.font = `400 ${57 * s}px "Archivo Black"`;
    ctx.fillText(`#${i + 1}`, numX, cy + 18 * s);
    const redondo = modo === "artistas";
    imagemRecortada(ctx, redondo ? it.image : it.capa, imgX, iy, size, size, redondo ? size / 2 : 7 * s, it.name || String(i + 1), true, "rgba(0,0,0,.04)", redondo ? 0.34 : 0.5);
    ctx.fillStyle = cor;
    ctx.font = `400 ${57 * s}px "Archivo Black"`;
    writeFit(ctx, it.name || "—", textX, cy - 4 * s, W - textX - 52 * s, 57 * s, 29 * s, "Archivo Black", "400");
    ctx.fillStyle = cor;
    ctx.font = `500 ${39 * s}px Archivo`;
    writeFit(ctx, modo === "musicas" ? it.artist || "" : metaArtistaTempoRepro(data, it), textX, cy + 46 * s, W - textX - 52 * s, 39 * s, 18 * s, "Archivo", "500");
  });
}

/* 08 — top músicas em névoa */
function drawMusicasMenta(ctx, W, H, data) {
  drawRankingMenta(ctx, W, H, data, "musicas");
}

/* 09 — top artistas em névoa */
function drawArtistasMenta(ctx, W, H, data) {
  drawRankingMenta(ctx, W, H, data, "artistas");
}


const DRAWERS = {
  "resumo-solar": drawResumoSolar,
  "artista-foco": drawArtistaFoco,
  "panorama-solar": drawPanoramaSolar,
  "musicas-solar": drawMusicasSolar,
  "artistas-solar": drawArtistasSolar,
  "artista-aura": drawArtistaAura,
  "musicas-menta": drawMusicasMenta,
  "artistas-menta": drawArtistasMenta,
  "recibo-novo": drawReciboNovo,
  mixtape: drawMixtape,
  xerox: drawXerox,
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
      document.fonts.load("400 20px 'Archivo Black'"),
      document.fonts.load("700 20px Syne"),
      document.fonts.load("700 20px 'Archivo Black'"),
      document.fonts.load("400 20px 'Courier Prime'"),
      document.fonts.load("700 20px 'Courier Prime'"),
    ]);
  } catch (_) {
    /* segue mesmo se alguma fonte falhar */
  }
  await carregarPapel();
}

const LAYOUTS_SEM_PROXY = new Set([
  "resumo-solar", "artista-foco", "panorama-solar", "musicas-solar",
  "artistas-solar", "artista-aura", "musicas-menta", "artistas-menta",
  "recibo-novo",
]);

function imagemPrincipalDoData(data) {
  const url = data?.artistImage
    || data?.topArtists?.[0]?.image
    || data?.topTracks?.[0]?.capa
    || data?.topAlbums?.[0]?.capa;
  return capaDe(url);
}

function imagensValidas(urls = []) {
  const vistas = new Set();
  return urls
    .filter(Boolean)
    .map((url) => capaDe(url))
    .filter((im) => {
      if (!im?.width || !im?.height || vistas.has(im)) return false;
      vistas.add(im);
      return true;
    });
}

function fontesCromaticasDoLayout(layoutId, data) {
  const artistas = data?.topArtists || [];
  const faixas = data?.topTracks || [];
  const albuns = data?.topAlbums || [];
  const topArtista = artistas[0]?.image || data?.artistImage;
  const heroPanorama = data?.artistImage || artistas[0]?.image || faixas[0]?.capa;

  switch (layoutId) {
    /* Nesses layouts a própria imagem principal é o conceito visual. Se ela é
       p&b, o cartaz deve continuar p&b em vez de procurar cor em outro item. */
    case "artista-foco":
    case "artista-aura":
      return { imagens: imagensValidas([topArtista]), preservarPrimeiraAcromatica: true };

    /* O resumo e o panorama usam a fotografia que aparece como hero. */
    case "resumo-solar":
      return { imagens: imagensValidas([artistas[0]?.image || data?.artistImage]), preservarPrimeiraAcromatica: true };
    case "panorama-solar":
      return { imagens: imagensValidas([heroPanorama]), preservarPrimeiraAcromatica: true };

    /* Rankings de músicas nascem das capas que realmente aparecem na peça.
       Uma foto p&b do artista mais ouvido não pode tornar todas as músicas p&b. */
    case "musicas-solar":
    case "musicas-menta":
      return {
        imagens: imagensValidas([
          ...faixas.slice(0, 5).map((x) => x?.capa),
          ...albuns.slice(0, 3).map((x) => x?.capa),
          topArtista,
        ]),
        preservarPrimeiraAcromatica: false,
      };

    /* Rankings de artistas consideram o conjunto. Se o #1 for p&b, mas os
       demais tiverem cor, a paleta nasce das imagens coloridas do ranking. */
    case "artistas-solar":
    case "artistas-menta":
      return {
        imagens: imagensValidas([
          ...artistas.slice(0, 5).map((x) => x?.image),
          data?.artistImage,
        ]),
        preservarPrimeiraAcromatica: false,
      };

    default:
      return { imagens: imagensValidas([
        data?.artistImage,
        artistas[0]?.image,
        faixas[0]?.capa,
        albuns[0]?.capa,
      ]), preservarPrimeiraAcromatica: true };
  }
}

function melhorCorSemantica(paletas, chave) {
  let melhor = null;
  let melhorScore = -Infinity;
  paletas.forEach((item, i) => {
    const cor = item?.paleta?.semantic?.[chave];
    if (!cor) return;
    const ok = rgbOklch(hexRgb(cor));
    const score = ok.c * 5 + (1 / (i + 1)) * 0.18 + (chave.includes("Muted") || chave === "muted" ? 0.02 : 0);
    if (score > melhorScore) {
      melhorScore = score;
      melhor = cor;
    }
  });
  return melhor;
}

function paletaCombinadaDasImagens(imagens, preservarPrimeiraAcromatica = false) {
  const analisadas = (imagens || [])
    .map((im, i) => ({ im, i, paleta: paletaImagem(im) }))
    .filter((x) => x.paleta?.dominant);

  if (!analisadas.length) return null;
  if (preservarPrimeiraAcromatica && analisadas[0].paleta.achromatic) {
    return analisadas[0].paleta;
  }

  const coloridas = analisadas.filter((x) => !x.paleta.achromatic);
  if (!coloridas.length) return analisadas[0].paleta;

  const candidatas = [];
  coloridas.forEach((item, ordem) => {
    const p = item.paleta;
    const locais = [p.semantic?.vibrant, p.dominant, ...(p.colors || [])].filter(Boolean);
    locais.forEach((cor, j) => {
      const ok = rgbOklch(hexRgb(cor));
      if (ok.c < 0.035) return;
      /* A ordem ainda importa, mas o chroma real importa mais. Assim uma capa
         colorida secundária pode salvar uma primeira imagem acromática. */
      const score = ok.c * 5.5 + 0.28 / (ordem + 1) - j * 0.012;
      candidatas.push({ cor, score });
    });
  });
  candidatas.sort((a, b) => b.score - a.score);

  const cores = [];
  for (const item of candidatas) {
    const ok = rgbOklch(hexRgb(item.cor));
    const repetida = cores.some((cor) => {
      const atual = rgbOklch(hexRgb(cor));
      return distanciaMatiz(ok.h, atual.h) < 20 && Math.abs(ok.l - atual.l) < 0.14;
    });
    if (!repetida) cores.push(item.cor);
    if (cores.length >= 10) break;
  }

  const semantic = {
    vibrant: melhorCorSemantica(coloridas, "vibrant"),
    muted: melhorCorSemantica(coloridas, "muted"),
    darkVibrant: melhorCorSemantica(coloridas, "darkVibrant"),
    darkMuted: melhorCorSemantica(coloridas, "darkMuted"),
    lightVibrant: melhorCorSemantica(coloridas, "lightVibrant"),
    lightMuted: melhorCorSemantica(coloridas, "lightMuted"),
  };

  let somaTom = 0, somaPeso = 0;
  coloridas.forEach((item, i) => {
    const peso = 1 / (i + 1);
    somaTom += (item.paleta.tone ?? 0.5) * peso;
    somaPeso += peso;
  });

  return {
    dominant: candidatas[0]?.cor || coloridas[0].paleta.dominant,
    colors: [...new Set([
      ...Object.values(semantic).filter(Boolean),
      ...cores,
    ])],
    semantic,
    tone: somaPeso ? somaTom / somaPeso : coloridas[0].paleta.tone,
    achromatic: false,
    source: "layout-composite",
  };
}

function temaOriginalDoLayout(layoutId, data) {
  const fontes = fontesCromaticasDoLayout(layoutId, data);
  const extraida = paletaCombinadaDasImagens(fontes.imagens, fontes.preservarPrimeiraAcromatica);
  return temaOriginalDaPaleta(extraida);
}

export function render(canvas, layoutId, resId, data) {
  const res = RESOLUTIONS.find((r) => r.id === resId) || RESOLUTIONS[0];
  canvas.width = res.w;
  canvas.height = res.h;
  const bruto = canvas.getContext("2d");
  bruto.textBaseline = "alphabetic";

  const basePal = temaBaseDe(data);
  const runtimePal = basePal.original
    ? temaOriginalDoLayout(layoutId, data)
    : normalizarTemaRuntime(basePal);
  const dadosRender = { ...data, __runtimeTheme: runtimePal };
  const ctx = LAYOUTS_SEM_PROXY.has(layoutId)
    ? contextoTematico(bruto, { original: true })
    : contextoTematico(bruto, runtimePal);
  const usaRodapeComum = layoutId === "mixtape" || layoutId === "xerox";
  const footerH = usaRodapeComum ? alturaRodape(res.w, res.h) : 0;
  const contentH = res.h - footerH;

  bruto.save();
  bruto.beginPath();
  bruto.rect(0, 0, res.w, contentH);
  bruto.clip();
  (DRAWERS[layoutId] || drawResumoSolar)(ctx, res.w, contentH, dadosRender);
  bruto.restore();
  if (usaRodapeComum) drawFaixaFooter(bruto, res.w, res.h, dadosRender, runtimePal, layoutId);
  return res;
}

export function download(canvas, layoutId, resId, periodId) {
  const res = RESOLUTIONS.find((r) => r.id === resId) || RESOLUTIONS[0];
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = `faixa-${periodId}-${layoutId}-${res.w}x${res.h}.png`;
  a.click();
}
