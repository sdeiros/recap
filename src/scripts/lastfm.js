/* ============================================================
   RUÍDO — camada de dados
   Tenta primeiro a rota /api/lastfm (chave escondida no servidor).
   Se ela não existir (site estático), cai para a chamada direta
   usando uma chave guardada no navegador.
   ============================================================ */

import { PERIODS } from "./cartaz.js";

const DIRECT = "https://ws.audioscrobbler.com/2.0/";
const KEY_SLOT = "ruido:apikey";
const USER_SLOT = "ruido:lastuser";

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

function bounds(days, back = 0) {
  const now = Math.floor(Date.now() / 1000);
  const span = days * 24 * 3600;
  return { from: now - span * (back + 1), to: now - span * back };
}

export async function load(user, periodId) {
  const p = PERIODS.find((x) => x.id === periodId) || PERIODS[0];

  const info = await call({ method: "user.getinfo", user });
  const recent = await call({ method: "user.getrecenttracks", user, limit: 200 });
  const tracks = [].concat(recent?.recenttracks?.track || []);
  const nowRaw = tracks.find((t) => t["@attr"]?.nowplaying === "true");

  const cur = bounds(p.days, 0);
  const prv = bounds(p.days, 1);
  const [cCur, cPrev, ta, tt, alb] = await Promise.all([
    call({ method: "user.getrecenttracks", user, limit: 1, from: cur.from, to: cur.to }),
    call({ method: "user.getrecenttracks", user, limit: 1, from: prv.from, to: prv.to }),
    call({ method: "user.gettopartists", user, period: p.id, limit: 50 }),
    call({ method: "user.gettoptracks", user, period: p.id, limit: 50 }),
    call({ method: "user.gettopalbums", user, period: p.id, limit: 5 }),
  ]);

  const clock = new Array(24).fill(0);
  tracks.forEach((t) => {
    const uts = t.date?.uts;
    if (uts) clock[new Date(uts * 1000).getHours()]++;
  });

  const artistsAll = ta?.topartists?.artist || [];
  const faixas = tt?.toptracks?.track || [];

  /* Tempo de escuta.
     O Receiptify soma playcount x duracao só das faixas exibidas, o que
     mede aquelas faixas e não o período. Aqui a gente tira a duração média
     das faixas que têm esse dado e multiplica pelo total de scrobbles —
     é uma estimativa, mas do período inteiro. */
  const duracoes = faixas.map((t) => Number(t.duration || 0)).filter((d) => d > 0);
  const temDuracao = duracoes.length > 0;
  const mediaDur = temDuracao ? duracoes.reduce((a, b) => a + b, 0) / duracoes.length : 210;
  const totalScrobbles = Number(cCur?.recenttracks?.["@attr"]?.total || 0);
  const segundos = Math.round(totalScrobbles * mediaDur);

  return {
    period: p.id,
    user: {
      name: info?.user?.name || user,
      playcount: Number(info?.user?.playcount || 0),
    },
    nowPlaying: nowRaw ? { name: nowRaw.name, artist: nowRaw.artist?.["#text"] || "" } : null,
    count: Number(cCur?.recenttracks?.["@attr"]?.total || 0),
    prevCount: Number(cPrev?.recenttracks?.["@attr"]?.total || 0),
    uniqueArtists: Number(ta?.topartists?.["@attr"]?.total || artistsAll.length),
    segundos,
    duracaoEstimada: !temDuracao,
    clock,
    topArtists: artistsAll.slice(0, 8).map((a) => ({ name: a.name, playcount: Number(a.playcount) })),
    topTracks: faixas.slice(0, 8).map((t) => ({
      name: t.name,
      artist: t.artist?.name || "",
      playcount: Number(t.playcount),
    })),
    topAlbums: (alb?.topalbums?.album || []).map((a) => ({
      name: a.name,
      artist: a.artist?.name || "",
      playcount: Number(a.playcount),
    })),
  };
}

/* ---------- dados de demonstração ---------- */
const BASE = {
  user: { name: "davi.demo", playcount: 14382 },
  nowPlaying: { name: "Nova Iorque", artist: "BK'" },
  clock: [4, 2, 1, 0, 0, 1, 3, 9, 18, 22, 25, 31, 44, 38, 29, 26, 30, 35, 41, 48, 39, 27, 15, 8],
  topArtists: [
    { name: "Racionais MC's", playcount: 87 },
    { name: "BK'", playcount: 74 },
    { name: "Little Simz", playcount: 61 },
    { name: "Djonga", playcount: 55 },
    { name: "Fontaines D.C.", playcount: 43 },
    { name: "Elza Soares", playcount: 38 },
    { name: "Baco Exu do Blues", playcount: 31 },
    { name: "Turnstile", playcount: 24 },
  ],
  topTracks: [
    { name: "Negro Drama", artist: "Racionais MC's", playcount: 21 },
    { name: "Gorgeous", artist: "Little Simz", playcount: 18 },
    { name: "Julieta", artist: "BK'", playcount: 17 },
    { name: "Hat-trick", artist: "Djonga", playcount: 14 },
    { name: "Starburster", artist: "Fontaines D.C.", playcount: 12 },
    { name: "A Carne", artist: "Elza Soares", playcount: 11 },
    { name: "Flamingos", artist: "Baco Exu do Blues", playcount: 9 },
    { name: "MYSTERY", artist: "Turnstile", playcount: 8 },
  ],
  topAlbums: [
    { name: "Sobrevivendo no Inferno", artist: "Racionais MC's", playcount: 64 },
    { name: "Gigantes", artist: "BK'", playcount: 51 },
    { name: "NO THANK YOU", artist: "Little Simz", playcount: 44 },
    { name: "Romances Sangrentos", artist: "Djonga", playcount: 33 },
    { name: "Skinty Fia", artist: "Fontaines D.C.", playcount: 28 },
  ],
};

export function demo(periodId) {
  const m = periodId === "7day" ? 1 : periodId === "1month" ? 4.3 : 52;
  const pm = periodId === "7day" ? 1 : periodId === "1month" ? 3.6 : 44;
  const r = (n) => Math.round(n * m);
  return {
    ...BASE,
    period: periodId,
    count: Math.round(512 * m),
    prevCount: Math.round(391 * pm),
    uniqueArtists: periodId === "7day" ? 48 : periodId === "1month" ? 173 : 812,
    segundos: Math.round(512 * m * 214),
    duracaoEstimada: false,
    topArtists: BASE.topArtists.map((a) => ({ ...a, playcount: r(a.playcount) })),
    topTracks: BASE.topTracks.map((t) => ({ ...t, playcount: r(t.playcount) })),
    topAlbums: BASE.topAlbums.map((a) => ({ ...a, playcount: r(a.playcount) })),
  };
}
