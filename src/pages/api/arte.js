/* ============================================================
   Busca arte em alta resolução no Deezer a partir de nomes.
   O Last.fm diz o que a pessoa ouviu; o Deezer devolve a imagem
   grande (1000×1000) de capa de álbum e de foto de artista.

   Passa pela mesma origem (seu domínio) por dois motivos:
   - a resposta de busca do Deezer não manda cabeçalho CORS;
   - imagem de outro domínio no canvas quebra o download do PNG.

   Modo servidor apenas. Em estático, o app cai no que o Last.fm der.
   ============================================================ */

const UA = "FaixaApp/1.0 (+https://faixa.exemplo.com.br)";
const DEEZER = "https://api.deezer.com";

const json = (b, s = 200) =>
  new Response(JSON.stringify(b), {
    status: s,
    headers: { "content-type": "application/json", "cache-control": "public, max-age=86400" },
  });

async function buscar(tipo, termos) {
  const q = encodeURIComponent(termos);
  const r = await fetch(`${DEEZER}/search/${tipo}?q=${q}&limit=1`, {
    headers: { "User-Agent": UA },
  });
  if (!r.ok) return null;
  const d = await r.json();
  return d?.data?.[0] || null;
}

export async function GET({ url }) {
  const tipo = url.searchParams.get("tipo"); // "album" | "artist" | "ping"
  const artista = (url.searchParams.get("artista") || "").trim();
  const album = (url.searchParams.get("album") || "").trim();

  if (tipo === "ping") return json({ ok: true });

  try {
    if (tipo === "artist" && artista) {
      const a = await buscar("artist", artista);
      const img = a?.picture_xl || a?.picture_big || "";
      return json({ url: img });
    }

    if (tipo === "album" && album) {
      /* nome do álbum + artista aumenta muito a precisão */
      const alvo = await buscar("album", artista ? `${album} ${artista}` : album);
      const img = alvo?.cover_xl || alvo?.cover_big || "";
      return json({ url: img });
    }

    return json({ url: "" }, 400);
  } catch (_) {
    return json({ url: "" }, 502);
  }
}
