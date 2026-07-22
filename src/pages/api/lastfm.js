/* ============================================================
   Rota que esconde a chave da API.
   Só funciona com output: 'server' + um adapter instalado:
     npx astro add vercel
   E com a variável de ambiente LASTFM_API_KEY definida.

   Em modo estático essa rota não existe — o app percebe sozinho
   e passa a usar a chave guardada no navegador.
   ============================================================ */

/* Sem "prerender = false" de proposito:
   - em output:'static' a rota vira um arquivo inerte, a build passa, e o
     app percebe que nao ha servidor e usa a chave guardada no navegador;
   - em output:'server' (com adapter) toda rota ja e sob demanda, entao ela
     funciona de verdade e a chave nunca sai do servidor. */

const ALLOWED = new Set([
  "user.getinfo",
  "user.getrecenttracks",
  "user.gettopartists",
  "user.gettoptracks",
  "user.gettopalbums",
]);

const json = (body, status = 200, extra = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...extra },
  });

export async function GET({ url }) {
  const method = url.searchParams.get("method");

  // usado pelo front só pra descobrir se a rota existe
  if (method === "ping") return json({ ok: true });

  if (!method || !ALLOWED.has(method)) {
    return json({ error: 1, message: "Método não permitido." }, 400);
  }

  const key = import.meta.env.LASTFM_API_KEY;
  if (!key) return json({ error: 1, message: "Servidor sem chave configurada." }, 500);

  const params = new URLSearchParams(url.searchParams);
  params.set("api_key", key);
  params.set("format", "json");

  // A doc do Last.fm pede um User-Agent identificavel. So da pra definir aqui
  // no servidor: o navegador bloqueia esse header no fetch.
  // >>> Troque a URL e o e-mail pelos seus antes de publicar. <<<
  const UA = "RuidoApp/0.6 (+https://ruido.exemplo.com.br; contato@exemplo.com.br)";

  try {
    const res = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`, {
      headers: { "User-Agent": UA },
    });
    const data = await res.json();
    // cache de 10 min: protege o limite de requisições da sua chave
    return json(data, 200, { "cache-control": "public, max-age=600, s-maxage=600" });
  } catch (e) {
    return json({ error: 1, message: "Não consegui falar com o Last.fm." }, 502);
  }
}
