/* ============================================================
   Proxy de capas.
   Imagem de outro domínio desenhada no canvas o contamina, e aí
   toDataURL() lança erro — ou seja, o download do PNG quebra.
   Servindo a imagem pelo mesmo domínio, o problema some.

   Só funciona no modo servidor (output: 'server' + adapter).
   Em modo estático o app tenta carregar direto com CORS.
   ============================================================ */

/* só o CDN de imagens do Last.fm: evita virar proxy aberto */
const PERMITIDOS = [
  /^https:\/\/lastfm\.freetls\.fastly\.net\//,
  /^https:\/\/([a-z0-9-]+\.)?last\.fm\//,
  /^https:\/\/([a-z0-9-]+\.)?dzcdn\.net\//,
  /^https:\/\/([a-z0-9-]+\.)?deezer\.com\//,
];

export async function GET({ url }) {
  const alvo = url.searchParams.get("u");

  if (alvo === "ping") {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "content-type": "application/json" },
    });
  }

  if (!alvo || !PERMITIDOS.some((re) => re.test(alvo))) {
    return new Response("Origem não permitida.", { status: 400 });
  }

  try {
    const res = await fetch(alvo, {
      headers: { "User-Agent": "FaixaApp/1.0 (+https://faixa.exemplo.com.br)" },
    });
    if (!res.ok) return new Response("Capa indisponível.", { status: 404 });

    const tipo = res.headers.get("content-type") || "image/jpeg";
    if (!tipo.startsWith("image/")) return new Response("Não é imagem.", { status: 400 });

    return new Response(res.body, {
      headers: {
        "content-type": tipo,
        /* capas não mudam: cache longo */
        "cache-control": "public, max-age=604800, s-maxage=604800, immutable",
      },
    });
  } catch (_) {
    return new Response("Falha ao buscar a capa.", { status: 502 });
  }
}
