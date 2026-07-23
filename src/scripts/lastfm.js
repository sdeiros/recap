/* ============================================================
   RUÍDO — camada de dados
   Tenta primeiro a rota /api/lastfm (chave escondida no servidor).
   Se ela não existir (site estático), cai para a chamada direta
   usando uma chave guardada no navegador.
   ============================================================ */

import * as C from "./cartaz.js";

const DIRECT = "https://ws.audioscrobbler.com/2.0/";
const KEY_SLOT = "faixa:apikey";
const USER_SLOT = "faixa:lastuser";

let serverMode = null; // null = ainda não sabemos

export const storedKey = () => localStorage.getItem(KEY_SLOT) || "";
export const saveKey = (k) => localStorage.setItem(KEY_SLOT, k);
export const storedUser = () => localStorage.getItem(USER_SLOT) || "";
export const saveUser = (u) => localStorage.setItem(USER_SLOT, u);

/* Descobre uma vez se existe backend de verdade.
   Precisa responder 200 com {ok:true}. Qualquer outra coisa — 404, erro,
   ou a rota existindo mas sem receber os parâmetros (o que acontece em
   modo estático) — conta como "sem servidor", e o app usa a chave local. */
async function hasServer() {
  if (serverMode !== null) return serverMode;
  try {
    const r = await fetch("/api/lastfm?method=ping");
    if (!r.ok) {
      serverMode = false;
      return false;
    }
    const j = await r.json().catch(() => null);
    serverMode = j?.ok === true;
  } catch (_) {
    serverMode = false;
  }
  return serverMode;
}

export async function needsBrowserKey() {
  return (await hasServer()) ? false : !storedKey();
}

async function call(params) {
  if (await hasServer()) {
    const qs = new URLSearchParams(params);
    const res = await fetch(`/api/lastfm?${qs}`);
    const json = await res.json();
    if (json.error) throw new Error(json.message || "Erro na API do Last.fm");
    return json;
  }
  const key = storedKey();
  if (!key) throw new Error("Falta a chave da API.");
  const qs = new URLSearchParams({ ...params, api_key: key, format: "json" });
  const res = await fetch(`${DIRECT}?${qs}`);
  const json = await res.json();
  if (json.error) throw new Error(json.message || "Erro na API do Last.fm");
  return json;
}

/* o Last.fm devolve uma estrela cinza quando não tem imagem; esse é o hash dela */
const SEM_IMAGEM = "2a96cbd8b46e442fc41c2b86b821562f";

function capaDe(img) {
  if (!Array.isArray(img)) return "";
  const ordem = ["extralarge", "large", "medium"];
  for (const tam of ordem) {
    const achou = img.find((i) => i.size === tam && i["#text"]);
    if (achou && !achou["#text"].includes(SEM_IMAGEM)) return achou["#text"];
  }
  return "";
}

/* ============================================================
   CARREGAMENTO
   Períodos de calendário não existem na API (ela só tem janelas
   deslizantes: 7day, 1month...). Para mês e ano usamos os charts
   por intervalo, que aceitam from/to arbitrários.
   ============================================================ */

const num = (v) => Number(v || 0);

async function contar(user, from, to) {
  const r = await call({ method: "user.getrecenttracks", user, limit: 1, from, to });
  return num(r?.recenttracks?.["@attr"]?.total);
}

/* Arte em alta pelo Deezer (via nossa rota). Só funciona no modo
   servidor; em estático a rota não existe e caímos no Last.fm. */
let temArte = null;
async function arteDisponivel() {
  if (temArte !== null) return temArte;
  try {
    const r = await fetch("/api/arte?tipo=ping");
    const j = r.ok ? await r.json().catch(() => null) : null;
    temArte = j?.ok === true;
  } catch (_) {
    temArte = false;
  }
  return temArte;
}

async function arteDeezer(tipo, artista, album, faixa = "") {
  if (!(await arteDisponivel())) return "";
  try {
    const qs = new URLSearchParams({
      tipo,
      artista: artista || "",
      album: album || "",
      faixa: faixa || "",
    });
    const r = await fetch(`/api/arte?${qs}`);
    const j = await r.json();
    return j?.url || "";
  } catch (_) {
    return "";
  }
}

/* capa de álbum: Deezer primeiro, Last.fm como reserva */
async function buscarCapa(artista, album) {
  const alta = await arteDeezer("album", artista, album);
  if (alta) return alta;
  try {
    const r = await call({ method: "album.getinfo", artist: artista, album });
    return capaDe(r?.album?.image);
  } catch (_) {
    return "";
  }
}

async function buscarFotoArtista(artista) {
  return artista ? arteDeezer("artist", artista, "") : "";
}

async function buscarCapaFaixa(artista, faixa) {
  return faixa ? arteDeezer("track", artista, "", faixa) : "";
}

export async function load(user, periodId, offset = 0) {
  const j = C.janela(periodId, offset);

  const info = await call({ method: "user.getinfo", user });
  const recent = await call({ method: "user.getrecenttracks", user, limit: 200 });
  const tracks = [].concat(recent?.recenttracks?.track || []);
  const nowRaw = tracks.find((t) => t["@attr"]?.nowplaying === "true");

  const clock = new Array(24).fill(0);
  tracks.forEach((t) => {
    const uts = t.date?.uts;
    if (uts) clock[new Date(uts * 1000).getHours()]++;
  });

  const [count, prevCount, artChart, prevArtChart, trkChart, albChart, topGeral] = await Promise.all([
    contar(user, j.from, j.to),
    contar(user, j.antFrom, j.antTo),
    call({ method: "user.getweeklyartistchart", user, from: j.from, to: j.to }),
    call({ method: "user.getweeklyartistchart", user, from: j.antFrom, to: j.antTo }),
    call({ method: "user.getweeklytrackchart", user, from: j.from, to: j.to }),
    call({ method: "user.getweeklyalbumchart", user, from: j.from, to: j.to }),
    /* uma chamada só para estimar a duração média das faixas */
    call({ method: "user.gettoptracks", user, period: "1month", limit: 50 }),
  ]);

  const ordenar = (arr) =>
    [].concat(arr || []).sort((a, b) => num(b.playcount) - num(a.playcount));

  const artistas = ordenar(artChart?.weeklyartistchart?.artist);
  const artistasAnteriores = ordenar(prevArtChart?.weeklyartistchart?.artist);
  const faixas = ordenar(trkChart?.weeklytrackchart?.track);
  const albuns = ordenar(albChart?.weeklyalbumchart?.album);

  /* duração média: base para estimar tempo de escuta */
  const duracoes = (topGeral?.toptracks?.track || [])
    .map((t) => num(t.duration))
    .filter((d) => d > 0);
  const temDuracao = duracoes.length > 0;
  const mediaDur = temDuracao ? duracoes.reduce((a, b) => a + b, 0) / duracoes.length : 210;

  const topArtistas = artistas.slice(0, 8).map((a) => ({
    name: a.name,
    playcount: num(a.playcount),
    image: "",
  }));

  const topFaixas = faixas.slice(0, 8).map((t) => ({
    name: t.name,
    artist: t.artist?.["#text"] || t.artist?.name || "",
    playcount: num(t.playcount),
    duration: 0,
    capa: "",
  }));

  /* até dez capas: os layouts editoriais e de parada usam mais itens */
  const topAlbuns = albuns.slice(0, 10).map((a) => ({
    name: a.name,
    artist: a.artist?.["#text"] || a.artist?.name || "",
    playcount: num(a.playcount),
    capa: "",
  }));

  const anteriorRaw = artistasAnteriores[0];
  const topAnterior = anteriorRaw
    ? { name: anteriorRaw.name, playcount: num(anteriorRaw.playcount), image: "" }
    : null;

  /* Todas as artes são buscadas em paralelo. A rota tem cache de um dia. */
  await Promise.all([
    ...topArtistas.slice(0, 5).map(async (a) => {
      a.image = await buscarFotoArtista(a.name);
    }),
    ...topFaixas.slice(0, 5).map(async (t) => {
      t.capa = await buscarCapaFaixa(t.artist, t.name);
    }),
    ...topAlbuns.map(async (a) => {
      if (a.artist && a.name) a.capa = await buscarCapa(a.artist, a.name);
    }),
    topAnterior
      ? (async () => {
          topAnterior.image = await buscarFotoArtista(topAnterior.name);
        })()
      : Promise.resolve(),
  ]);

  const fotoArtista = topArtistas[0]?.image || "";

  return {
    period: periodId,
    offset,
    janela: j,
    user: { name: info?.user?.name || user, playcount: num(info?.user?.playcount) },
    nowPlaying: nowRaw ? { name: nowRaw.name, artist: nowRaw.artist?.["#text"] || "" } : null,
    count,
    prevCount,
    uniqueArtists: artistas.length,
    artistImage: fotoArtista,
    prevTopArtist: topAnterior,
    clock,
    segundos: Math.round(count * mediaDur),
    mediaDur,
    duracaoEstimada: !temDuracao,
    topArtists: topArtistas,
    topTracks: topFaixas,
    topAlbums: topAlbuns,
  };
}

/* ---------- dados de demonstração ---------- */
const BASE = {
  user: { name: "davi.demo", playcount: 14382 },
  nowPlaying: { name: "Nova Iorque", artist: "BK'" },
  clock: [4, 2, 1, 0, 0, 1, 3, 9, 18, 22, 25, 31, 44, 38, 29, 26, 30, 35, 41, 48, 39, 27, 15, 8],
  topArtists: [
    { name: "Racionais MC's", playcount: 87, image: "" },
    { name: "BK'", playcount: 74, image: "" },
    { name: "Little Simz", playcount: 61, image: "" },
    { name: "Djonga", playcount: 55, image: "" },
    { name: "Fontaines D.C.", playcount: 43, image: "" },
    { name: "Elza Soares", playcount: 38 },
    { name: "Baco Exu do Blues", playcount: 31 },
    { name: "Turnstile", playcount: 24 },
  ],
  topTracks: [
    { name: "Negro Drama", artist: "Racionais MC's", playcount: 21, duration: 305, capa: "" },
    { name: "Gorgeous", artist: "Little Simz", playcount: 18, duration: 198, capa: "" },
    { name: "Julieta", artist: "BK'", playcount: 17, duration: 244, capa: "" },
    { name: "Hat-trick", artist: "Djonga", playcount: 14, duration: 187, capa: "" },
    { name: "Starburster", artist: "Fontaines D.C.", playcount: 12, duration: 212, capa: "" },
    { name: "A Carne", artist: "Elza Soares", playcount: 11, duration: 226, capa: "" },
    { name: "Flamingos", artist: "Baco Exu do Blues", playcount: 9, duration: 259, capa: "" },
    { name: "MYSTERY", artist: "Turnstile", playcount: 8, duration: 143, capa: "" },
  ],
  prevTopArtist: { name: "Emicida", playcount: 69, image: "" },
  artistImage: "",
  topAlbums: [
    { name: "Sobrevivendo no Inferno", artist: "Racionais MC's", playcount: 64, capa: "" },
    { name: "Gigantes", artist: "BK'", playcount: 51 },
    { name: "NO THANK YOU", artist: "Little Simz", playcount: 44 },
    { name: "Romances Sangrentos", artist: "Djonga", playcount: 33 },
    { name: "Skinty Fia", artist: "Fontaines D.C.", playcount: 28 },
  ],
};

export function demo(periodId, offset = 0) {
  const m = periodId === "semana" ? 1 : periodId === "mes" ? 4.3 : 52;
  const pm = periodId === "semana" ? 1 : periodId === "mes" ? 3.6 : 44;
  const r = (n) => Math.round(n * m);
  const j = C.janela(periodId, offset);
  return {
    ...BASE,
    period: periodId,
    offset,
    janela: j,
    count: Math.round(512 * m),
    prevCount: Math.round(391 * pm),
    uniqueArtists: periodId === "semana" ? 48 : periodId === "mes" ? 173 : 812,
    segundos: Math.round(512 * m * 214),
    mediaDur: 214,
    duracaoEstimada: false,
    topArtists: BASE.topArtists.map((a) => ({ ...a, playcount: r(a.playcount) })),
    topTracks: BASE.topTracks.map((t) => ({ ...t, playcount: r(t.playcount) })),
    topAlbums: BASE.topAlbums.map((a) => ({ ...a, playcount: r(a.playcount) })),
  };
}
