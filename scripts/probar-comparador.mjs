/**
 * PRUEBA DEL COMPARADOR SIN CONECTARSE A CJ
 * -----------------------------------------
 * Uso:  npm run probar-comparador
 *
 * Levanta un "CJ de mentira" en tu compu, con 3 productos inventados, y corre el
 * comparador contra él. Sirve para comprobar que el comparador funciona sin
 * necesitar la clave real ni internet.
 */
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

// Productos inventados: uno con stock en EE.UU., uno solo en China, uno en Europa y China
const PRODUCTOS = {
  p1: { nameEn: "Butterfly Clips Set A", vid: "v1", precio: 3.2, stock: ["US", "CN"] },
  p2: { nameEn: "Butterfly Clips Set B", vid: "v2", precio: 1.9, stock: ["CN"] },
  p3: { nameEn: "Butterfly Clips Set C", vid: "v3", precio: 2.5, stock: ["DE", "CN"] },
};
const ENVIOS = {
  US: [{ logisticName: "USPS", logisticPrice: 3.1, logisticAging: "2-5" }],
  DE: [{ logisticName: "DHL DE", logisticPrice: 2.9, logisticAging: "3-6" }],
  CN: [
    { logisticName: "CJPacket", logisticPrice: 4.5, logisticAging: "8-15" },
    { logisticName: "YunExpress", logisticPrice: 3.6, logisticAging: "12-20" },
  ],
};

const ok = (data) => JSON.stringify({ code: 200, result: true, message: "Success", data });

const server = createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    const url = new URL(req.url, "http://x");
    const path = url.pathname;
    res.setHeader("Content-Type", "application/json");
    if (path.endsWith("/authentication/getAccessToken")) {
      return res.end(ok({ accessToken: "tok", accessTokenExpiryDate: "2099-01-01T00:00:00+08:00" }));
    }
    if (req.headers["cj-access-token"] !== "tok") return res.end(JSON.stringify({ result: false, message: "sin token" }));
    if (path.endsWith("/product/listV2")) {
      const list = Object.entries(PRODUCTOS).map(([id, p]) => ({ id, nameEn: p.nameEn, sku: id.toUpperCase() }));
      return res.end(ok({ content: [{ productList: list }] }));
    }
    if (path.endsWith("/product/query")) {
      const p = PRODUCTOS[url.searchParams.get("pid")];
      return res.end(ok({ variants: [{ vid: p.vid, variantSellPrice: p.precio, variantKey: "Pink" }] }));
    }
    if (path.endsWith("/product/stock/queryByVid")) {
      const p = Object.values(PRODUCTOS).find((x) => x.vid === url.searchParams.get("vid"));
      return res.end(ok(p.stock.map((c) => ({ countryCode: c, totalInventoryNum: 100 }))));
    }
    if (path.endsWith("/logistic/freightCalculate")) {
      const { startCountryCode } = JSON.parse(body);
      return res.end(ok(ENVIOS[startCountryCode] || []));
    }
    res.end(JSON.stringify({ result: false, message: "no existe" }));
  });
});

server.listen(0, async () => {
  const port = server.address().port;
  // Carpeta temporal con un .env falso, para no tocar tus archivos reales
  const carpeta = mkdtempSync(join(tmpdir(), "comparador-"));
  writeFileSync(join(carpeta, ".env"), "CJ_API_KEY=clave-de-mentira\n");
  const script = resolve("scripts/comparar-proveedores.mjs");

  let fallas = 0;
  for (const mercado of ["US", "EU"]) {
    // (se corre "en paralelo" para que el CJ de mentira pueda ir respondiendo)
    const r = await correr("node", [script, "butterfly clip", "--mercado", mercado], {
      cwd: carpeta,
      env: { ...process.env, CJ_API_BASE: `http://localhost:${port}`, CJ_PAUSA_MS: "0" },
    });
    console.log(r.stdout, r.stderr);
    // Lo que esperamos: en EE.UU. gana el que está en el depósito de EE.UU.; en Europa, el de Alemania
    const esperado = mercado === "US" ? "Set A" : "Set C";
    const paso = r.stdout.includes(`SUGERENCIA: #1 "Butterfly Clips ${esperado}"`);
    console.log(paso ? `✅ ${mercado}: sugiere el depósito local, como corresponde\n` : `❌ ${mercado}: resultado inesperado\n`);
    if (!paso) fallas++;
  }
  rmSync(carpeta, { recursive: true, force: true });
  server.close();
  process.exit(fallas ? 1 : 0);
});

/** Corre un comando y devuelve lo que imprimió. */
function correr(cmd, args, opts) {
  return new Promise((resolver) => {
    const hijo = spawn(cmd, args, opts);
    let stdout = "", stderr = "";
    hijo.stdout.on("data", (d) => (stdout += d));
    hijo.stderr.on("data", (d) => (stderr += d));
    hijo.on("close", () => resolver({ stdout, stderr }));
  });
}
