/* Busca imagens de alta qualidade no AudioDB */

const AUDIODB_BASE = "https://www.theaudiodb.com/api/v1/json/2";

async function buscarNoAudioDB(artista, album) {
  try {
    // Tenta buscar pelo album
    const res = await fetch(`${AUDIODB_BASE}/album-search.php?s=${encodeURIComponent(artista)}&a=${encodeURIComponent(album)}`);
    const data = await res.json();

    if (data?.album?.[0]) {
      const img = data.album[0].strAlbumThumb;
      if (img) return img;
    }
  } catch (_) {
    // continua
  }

  try {
    // Tenta buscar apenas pelo artista (capa do artista)
    const res = await fetch(`${AUDIODB_BASE}/search.php?s=${encodeURIComponent(artista)}`);
    const data = await res.json();

    if (data?.artists?.[0]) {
      const img = data.artists[0].strArtistThumb;
      if (img) return img;
    }
  } catch (_) {
    // continua
  }

  return null;
}

export async function GET({ url }) {
  const artista = url.searchParams.get("artist");
  const album = url.searchParams.get("album");

  if (!artista) {
    return new Response(JSON.stringify({ error: "Falta artista" }), { status: 400 });
  }

  try {
    const imagem = await buscarNoAudioDB(artista, album);
    return new Response(JSON.stringify({ url: imagem || "" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
