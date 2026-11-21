/**
 * CONEXIÓN CON CJ DROPSHIPPING
 * ----------------------------
 * Funciones chicas para hablar con la API de CJ (documentación oficial:
 * developers.cjdropshipping.com). Acá SOLO hay consultas: buscar productos,
 * ver stock y calcular envíos. Nada de esto compra ni gasta plata.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";

// Se puede cambiar solo para pruebas (ver scripts/probar-comparador.mjs)
const BASE = process.env.CJ_API_BASE || "https://developers.cjdropshipping.com/api2.0/v1";

// CJ permite como máximo 1 consulta por segundo: esperamos un poquito entre cada una.
const PAUSA_MS = Number(process.env.CJ_PAUSA_MS ?? 1100);
let ultimaConsulta = 0;
async function respetarLimite() {
  const espera = ultimaConsulta + PAUSA_MS - Date.now();
  if (espera > 0) await new Promise((r) => setTimeout(r, espera));
  ultimaConsulta = Date.now();
}

/** Lee el archivo .env y devuelve sus valores (sin mostrarlos nunca en pantalla). */
export function leerEnv() {
  const env = {};
  if (!existsSync(".env")) return env;
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

// El "pase" (token) que da CJ dura 180 días. Lo guardamos en un archivo
// (.cj-token.json, que NUNCA se sube a GitHub) para no pedirlo cada vez.
const TOKEN_FILE = ".cj-token.json";

async function obtenerToken(apiKey) {
  if (existsSync(TOKEN_FILE)) {
    try {
      const saved = JSON.parse(readFileSync(TOKEN_FILE, "utf8"));
      const vence = new Date(saved.accessTokenExpiryDate).getTime();
      // Lo reusamos si le queda más de un día de vida
      if (saved.accessToken && vence - Date.now() > 24 * 3600 * 1000) return saved.accessToken;
    } catch {}
  }
  await respetarLimite();
  const res = await fetch(`${BASE}/authentication/getAccessToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey }),
  });
  const json = await res.json().catch(() => ({}));
  if (!json.result || !json.data?.accessToken) {
    throw new Error(`CJ no aceptó la clave (CJ_API_KEY): ${json.message || res.status}`);
  }
  writeFileSync(TOKEN_FILE, JSON.stringify(json.data, null, 2));
  return json.data.accessToken;
}

/** Crea un "cliente" de CJ listo para hacer consultas. */
export async function conectarCJ(apiKey) {
  const token = await obtenerToken(apiKey);

  async function consultar(method, path, { query, body } = {}) {
    await respetarLimite();
    const url = new URL(BASE + path);
    for (const [k, v] of Object.entries(query || {})) if (v !== undefined) url.searchParams.set(k, v);
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", "CJ-Access-Token": token },
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json().catch(() => ({}));
    if (!json.result) throw new Error(json.message || `error ${res.status}`);
    return json.data;
  }

  return {
    /** Busca productos por palabra clave. Precios en dólares. */
    async buscar(palabra, { cantidad = 10, precioMax } = {}) {
      const data = await consultar("GET", "/product/listV2", {
        query: { keyWord: palabra, page: 1, size: cantidad, endSellPrice: precioMax, orderBy: 0 },
      });
      return (data?.content || []).flatMap((c) => c.productList || []);
    },
    /** Detalle de un producto con sus variantes (talles, colores) y su precio. */
    async detalle(pid) {
      return consultar("GET", "/product/query", { query: { pid } });
    },
    /** En qué depósitos (países) hay stock de una variante. */
    async stock(vid) {
      return (await consultar("GET", "/product/stock/queryByVid", { query: { vid } })) || [];
    },
    /** Opciones de envío desde un país hasta otro, con precio en USD y demora en días. */
    async envios(vid, desde, hasta) {
      return (
        (await consultar("POST", "/logistic/freightCalculate", {
          body: { startCountryCode: desde, endCountryCode: hasta, products: [{ quantity: 1, vid }] },
        })) || []
      );
    },
  };
}
