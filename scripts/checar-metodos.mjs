/* Confere se todo método chamado em src/scripts/lastfm.js está liberado
   na rota src/pages/api/lastfm.js. Um método fora da lista faz a rota
   responder "Método não permitido" e derruba o app inteiro.

   Uso:  node scripts/checar-metodos.mjs
*/
import { readFileSync } from "node:fs";

const dados = readFileSync("src/scripts/lastfm.js", "utf8");
const rota = readFileSync("src/pages/api/lastfm.js", "utf8");

const usados = new Set([...dados.matchAll(/method:\s*"([\w.]+)"/g)].map((m) => m[1]));

const bloco = rota.match(/const ALLOWED = new Set\(\[([\s\S]*?)\]\)/);
const liberados = new Set(
  bloco ? [...bloco[1].matchAll(/"([\w.]+)"/g)].map((m) => m[1]) : []
);

const faltando = [...usados].filter((m) => !liberados.has(m));
const sobrando = [...liberados].filter((m) => !usados.has(m));

console.log(`métodos usados:    ${[...usados].sort().join(", ") || "(nenhum)"}`);
console.log(`métodos liberados: ${[...liberados].sort().join(", ") || "(nenhum)"}`);

if (sobrando.length) {
  console.log(`\nliberados sem uso (ok, mas revise): ${sobrando.join(", ")}`);
}

if (faltando.length) {
  console.error(`\nFALTA LIBERAR na rota: ${faltando.join(", ")}`);
  process.exit(1);
}

console.log("\ntudo certo: nenhum método usado está bloqueado.");
