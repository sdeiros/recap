# RUÍDO

Estatísticas do Last.fm viram cartaz pronto pra Stories e Status.
Astro + JavaScript puro. Sem framework no cliente, sem dependência além do Astro.

## Rodar

```bash
npm install
npm run dev
```

Abre em `localhost:4321`. Clica em **VER DEMO** pra ver tudo funcionando sem configurar nada.

## Pra usar com sua conta

Pega uma chave gratuita em **last.fm/api/account/create** (só o nome do aplicativo é
obrigatório). O app pede a chave uma vez, guarda no navegador, e daí em diante a entrada
é só o `@`.

## Publicar

### Modo simples — site estático

Funciona como está. `npm run build` gera a pasta `dist/`, que sobe em qualquer lugar:
GitHub Pages, Netlify, Cloudflare Pages ou o seu próprio domínio.

Nesse modo cada pessoa usa a própria chave, guardada no navegador dela. Bom pra testar
com amigos, ruim pra divulgar amplamente.

### Modo público — chave escondida no servidor

Pra que o usuário só digite o `@` e nunca veja uma chave:

```bash
npx astro add cloudflare   # ou vercel, netlify, node
```

1. Em `astro.config.mjs`, troca `output: "static"` por `output: "server"`.
2. Define a variável de ambiente `LASTFM_API_KEY` no painel do provedor.
3. Em `src/pages/api/lastfm.js`, troca a URL e o e-mail da constante `UA`
   pelos seus (o Last.fm pede um User-Agent identificável).

A tela que pede a chave desaparece sozinha: o app dá um ping em `/api/lastfm`
e só usa o backend se receber `{"ok":true}`.

**Cloudflare em vez de Vercel se você pretende monetizar:** o plano gratuito da
Vercel proíbe uso comercial. O da Cloudflare permite.

A rota já vem com cache de 10 minutos, que protege o limite de requisições da sua chave
se o link circular bastante.

## Instalar como app no celular

O `manifest.webmanifest` e o `sw.js` já estão prontos. Depois de publicado com HTTPS,
o Android oferece "Adicionar à tela inicial" — ganha ícone e abre em tela cheia, sem
barra de navegador.

## Estrutura

```
src/
  pages/
    index.astro        markup + lógica de interface
    api/lastfm.js      rota opcional que esconde a chave
  scripts/
    cartaz.js          motor de canvas: os 4 layouts e o export
    lastfm.js          camada de dados + modo demo
  styles/global.css
public/
  manifest.webmanifest, sw.js, ícones
```

Pra criar um layout novo, escreve uma função `draw*` em `cartaz.js`, registra em
`DRAWERS` e adiciona uma entrada em `LAYOUTS`. O resto da interface se monta sozinha.

## Sobre senha

O app pede só o `@`, nunca senha. As estatísticas do Last.fm são públicas via API — a
senha só serviria pra escrever na conta, e app de terceiro pedindo senha é indistinguível
de phishing.
