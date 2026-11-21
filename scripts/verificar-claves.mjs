/**
 * VERIFICADOR DE CLAVES
 * ---------------------
 * Uso:  npm run verificar
 *
 * Lee tu archivo .env y prueba, una por una, que cada clave funcione.
 * Solo hace consultas de lectura: NO compra, NO cobra y NO publica nada.
 * Nunca muestra tus claves en pantalla.
 */
import { existsSync, readFileSync } from "node:fs";

// ---------- 1. Leer el archivo .env ----------
if (!existsSync(".env")) {
  console.log("❌ No encontré el archivo .env");
  console.log("   Copiá .env.example, renombrá la copia a .env y pegá tus claves ahí.");
  process.exit(1);
}
const env = {};
for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
  const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, "");
}

// ---------- 2. Pruebas de cada servicio ----------
// Cada prueba devuelve: "ok", "falta" (no cargaste la clave) o un texto con el error.
const checks = [
  {
    name: "CJ Dropshipping",
    stage: "etapa 2",
    async run() {
      if (!env.CJ_API_KEY) return "falta";
      const res = await fetch("https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: env.CJ_API_KEY }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.result === true || data.code === 200) return "ok";
      return `CJ respondió: ${data.message || res.status} (si dice "too many requests", esperá un minuto)`;
    },
  },
  {
    name: "PayPal (sandbox)",
    stage: "etapa 3",
    async run() {
      if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET) return "falta";
      const auth = Buffer.from(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`).toString("base64");
      const res = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
        method: "POST",
        headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
        body: "grant_type=client_credentials",
      });
      if (res.ok) return "ok";
      return `PayPal rechazó las claves (${res.status}). ¿Copiaste las de SANDBOX y no las de Live?`;
    },
  },
  {
    name: "Mercado Pago (prueba)",
    stage: "cuando sumemos Argentina",
    async run() {
      if (!env.MERCADOPAGO_ACCESS_TOKEN) return "falta";
      const res = await fetch("https://api.mercadopago.com/users/me", {
        headers: { Authorization: `Bearer ${env.MERCADOPAGO_ACCESS_TOKEN}` },
      });
      if (res.ok) return "ok";
      return `Mercado Pago rechazó el Access Token (${res.status})`;
    },
  },
  {
    name: "Resend (mails)",
    stage: "etapa 4",
    async run() {
      if (!env.RESEND_API_KEY) return "falta";
      const res = await fetch("https://api.resend.com/domains", {
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}` },
      });
      // Una clave de "solo envío" no puede listar dominios, pero igual es válida
      const data = await res.json().catch(() => ({}));
      if (res.ok || data.name === "restricted_api_key") return "ok";
      return `Resend rechazó la clave (${res.status})`;
    },
  },
];

// ---------- 3. Correr todo y mostrar el resultado ----------
console.log("\n🔑 Verificando claves de indumen2k...\n");

const mode = env.STORE_MODE === "production" ? "🔴 PRODUCCIÓN (cobros reales)" : "🟡 PRUEBA (no se cobra nada)";
console.log(`   Modo de la tienda: ${mode}\n`);

for (const check of checks) {
  let result;
  try {
    result = await check.run();
  } catch (error) {
    result = `no me pude conectar (${error.cause?.code || error.message}). ¿Tenés internet?`;
  }
  if (result === "ok") console.log(`   ✅ ${check.name}: conectado`);
  else if (result === "falta") console.log(`   ⏳ ${check.name}: todavía sin clave (se usa: ${check.stage})`);
  else console.log(`   ❌ ${check.name}: ${result}`);
}

if (!env.ADMIN_EMAIL) console.log("   ⏳ ADMIN_EMAIL: todavía vacío (tu mail para avisos, etapa 4)");
console.log("\nListo. Si algo dice ❌, revisá docs/CLAVES.md\n");
