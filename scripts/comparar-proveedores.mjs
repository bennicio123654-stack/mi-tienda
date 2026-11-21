/**
 * COMPARADOR DE PROVEEDORES (CJ Dropshipping)
 * ===========================================
 * Uso (en la terminal, dentro de la carpeta del proyecto):
 *
 *   npm run comparar -- "butterfly clip"
 *   npm run comparar -- "baby tee" --mercado EU
 *   npm run comparar -- "cargo pants" --mercado US --cantidad 5 --precio-max 25
 *
 * Qué hace:
 *   1. Busca productos en CJ con esa palabra (en inglés funciona mejor).
 *   2. Para cada uno mira en qué depósitos hay stock (EE.UU., Europa, China...).
 *   3. Calcula el envío desde cada depósito hasta el mercado elegido.
 *   4. Arma un ranking por: precio del producto + envío + días de demora.
 *      Los depósitos del mismo mercado (ej: EE.UU. para clientes de EE.UU.) salen
 *      favorecidos porque llegan mucho más rápido.
 *   5. Te muestra la tabla, te sugiere el mejor y guarda un informe en la carpeta "informes".
 *
 * ⚠️ SOLO CONSULTA. No compra, no cambia nada de la tienda y no elige por vos:
 *    vos mirás el ranking y me decís cuál querés publicar.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { conectarCJ, leerEnv } from "./lib/cj.mjs";

// ---------------------------------------------------------------------------
// CONFIGURACIÓN (se puede ajustar)
// ---------------------------------------------------------------------------

/**
 * Cuánto "castigamos" cada día de demora, en dólares.
 * Con 0,40: una opción que tarda 10 días más tiene que ser USD 4 más barata para ganar.
 */
const VALOR_DIA_USD = 0.4;

/** Precio de venta sugerido = costo total × este número (2,5 = el costo es el 40% del precio). */
const MULTIPLICADOR_PRECIO = 2.5;

/** Comisión aproximada de PayPal / Mercado Pago por venta (para estimar ganancia). */
const COMISION_PAGO = { porcentaje: 0.054, fijo: 0.49 };

/** Datos de cada mercado: a qué país se calcula el envío y qué depósitos cuentan como "locales". */
const MERCADOS = {
  US: { nombre: "EE.UU.", destino: "US", locales: ["US"] },
  EU: {
    nombre: "Europa",
    destino: "DE", // usamos Alemania como referencia para Europa
    locales: ["DE", "FR", "IT", "ES", "PL", "CZ", "NL", "BE", "PT", "AT", "HU", "SE"],
  },
  AR: { nombre: "Argentina", destino: "AR", locales: ["AR"] },
};

// ---------------------------------------------------------------------------
// 1. Leer lo que escribiste en la terminal
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const opcion = (nombre, porDefecto) => {
  const i = args.indexOf(`--${nombre}`);
  return i >= 0 ? args[i + 1] : porDefecto;
};
const palabra = args.find((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));
const mercadoId = String(opcion("mercado", "US")).toUpperCase();
const cantidad = Math.min(Number(opcion("cantidad", 8)) || 8, 20);
const precioMax = opcion("precio-max", "20");
const mercado = MERCADOS[mercadoId];

if (!palabra || !mercado) {
  console.log('\nUso: npm run comparar -- "palabra en inglés" [--mercado US|EU|AR] [--cantidad 8] [--precio-max 20]\n');
  console.log('Ejemplo: npm run comparar -- "butterfly hair clip" --mercado US\n');
  process.exit(1);
}

const env = leerEnv();
if (!env.CJ_API_KEY) {
  console.log("\n❌ Falta CJ_API_KEY en tu archivo .env (ver docs/CLAVES.md)\n");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 2. Consultar a CJ
// ---------------------------------------------------------------------------
const dinero = (n) => `USD ${n.toFixed(2)}`;
/** "7-12" → 12 (nos quedamos con el peor caso, para no prometer de más) */
const diasMax = (texto) => {
  const nums = String(texto || "").match(/\d+/g);
  return nums ? Math.max(...nums.map(Number)) : 60;
};

console.log(`\n🔎 Buscando "${palabra}" para ${mercado.nombre} (hasta ${cantidad} productos, precio máx. USD ${precioMax})...`);
console.log("   CJ permite 1 consulta por segundo, así que esto tarda 1 o 2 minutos.\n");

let cj;
try {
  cj = await conectarCJ(env.CJ_API_KEY);
} catch (e) {
  console.log(`❌ ${e.message}\n`);
  process.exit(1);
}

const productos = await cj.buscar(palabra, { cantidad, precioMax });
if (productos.length === 0) {
  console.log("No encontré productos. Probá con otra palabra en inglés o subí --precio-max.\n");
  process.exit(0);
}

const opciones = []; // cada fila = un producto enviado desde un depósito

for (const [n, prod] of productos.entries()) {
  const nombre = prod.nameEn || prod.productNameEn || prod.id;
  process.stdout.write(`   (${n + 1}/${productos.length}) ${nombre.slice(0, 60)}... `);
  try {
    // a) Variantes y precio: usamos la variante más barata como referencia
    const detalle = await cj.detalle(prod.id);
    const variantes = (detalle?.variants || []).filter((v) => v.vid);
    if (variantes.length === 0) throw new Error("sin variantes");
    const variante = variantes.reduce((a, b) => (Number(b.variantSellPrice) < Number(a.variantSellPrice) ? b : a));
    const precio = Number(variante.variantSellPrice);

    // b) ¿En qué países hay stock?
    const stock = await cj.stock(variante.vid);
    const paisesConStock = [...new Set(stock.filter((s) => (s.totalInventoryNum ?? s.storageNum) > 0).map((s) => s.countryCode))];
    // Probamos los depósitos locales con stock + China (que casi siempre tiene)
    const aProbar = [...new Set([...paisesConStock.filter((p) => mercado.locales.includes(p)), "CN"])];

    // c) Envío desde cada depósito
    let encontradas = 0;
    for (const desde of aProbar) {
      const envios = await cj.envios(variante.vid, desde, mercado.destino).catch(() => []);
      if (envios.length === 0) continue;
      // De todas las empresas de envío, nos quedamos con la de mejor puntaje
      const mejor = envios
        .map((e) => ({ ...e, dias: diasMax(e.logisticAging), precioEnvio: Number(e.logisticPrice) }))
        .sort((a, b) => a.precioEnvio + a.dias * VALOR_DIA_USD - (b.precioEnvio + b.dias * VALOR_DIA_USD))[0];

      const costoTotal = precio + mejor.precioEnvio;
      const precioVenta = Math.ceil(costoTotal * MULTIPLICADOR_PRECIO) - 0.01;
      const comision = precioVenta * COMISION_PAGO.porcentaje + COMISION_PAGO.fijo;
      opciones.push({
        nombre,
        pid: prod.id,
        vid: variante.vid,
        sku: variante.variantSku || prod.sku,
        variante: variante.variantKey || variante.variantNameEn || "",
        deposito: desde,
        local: mercado.locales.includes(desde),
        empresaEnvio: mejor.logisticName,
        precio,
        envio: mejor.precioEnvio,
        dias: mejor.dias,
        demora: mejor.logisticAging,
        costoTotal,
        precioVenta,
        ganancia: precioVenta - costoTotal - comision,
        puntaje: costoTotal + mejor.dias * VALOR_DIA_USD, // más bajo = mejor
        imagen: prod.bigImage || detalle.bigImage,
      });
      encontradas++;
    }
    console.log(encontradas ? "✓" : "sin envío disponible");
  } catch (e) {
    console.log(`salteado (${e.message})`);
  }
}

if (opciones.length === 0) {
  console.log("\nNinguno de los productos tiene envío disponible a ese mercado. Probá otra búsqueda.\n");
  process.exit(0);
}

// ---------------------------------------------------------------------------
// 3. Ranking: depósitos locales primero, después por puntaje
// ---------------------------------------------------------------------------
opciones.sort((a, b) => (a.local === b.local ? a.puntaje - b.puntaje : a.local ? -1 : 1));
const top = opciones.slice(0, 15);

console.log(`\n🏆 RANKING para ${mercado.nombre} — "${palabra}"\n`);
console.table(
  top.map((o, i) => ({
    "#": i + 1,
    Producto: o.nombre.slice(0, 38),
    Depósito: `${o.local ? "🏠 " : ""}${o.deposito}`,
    Precio: dinero(o.precio),
    Envío: dinero(o.envio),
    "Costo total": dinero(o.costoTotal),
    Días: o.demora,
    "Venta sugerida": dinero(o.precioVenta),
    "Ganancia aprox.": dinero(o.ganancia),
  })),
);

const mejor = top[0];
console.log(`\n💡 SUGERENCIA: #1 "${mejor.nombre}"`);
console.log(`   Sale del depósito ${mejor.deposito}${mejor.local ? " (local: llega rápido)" : ""} con ${mejor.empresaEnvio}, en ${mejor.demora} días.`);
console.log(`   Te cuesta ${dinero(mejor.costoTotal)} puesto en la casa del cliente. Vendiéndolo a ${dinero(mejor.precioVenta)} te quedan ~${dinero(mejor.ganancia)}.`);
if (!top.some((o) => o.local)) {
  console.log(`   ⚠️ Ninguno tiene stock en un depósito de ${mercado.nombre}: todos salen de China y tardan más.`);
}

// ---------------------------------------------------------------------------
// 4. Guardar informe (en la carpeta "informes", que no se sube a GitHub)
// ---------------------------------------------------------------------------
mkdirSync("informes", { recursive: true });
const fecha = new Date().toISOString().slice(0, 10);
const archivo = `informes/ranking-${mercadoId}-${palabra.replace(/[^a-z0-9]+/gi, "-")}-${fecha}.md`;
const filas = top
  .map(
    (o, i) =>
      `| ${i + 1} | ${o.nombre} | ${o.local ? "🏠 " : ""}${o.deposito} | ${dinero(o.precio)} | ${dinero(o.envio)} (${o.empresaEnvio}) | ${dinero(o.costoTotal)} | ${o.demora} | ${dinero(o.precioVenta)} | ${dinero(o.ganancia)} | \`${o.pid}\` / \`${o.vid}\` |`,
  )
  .join("\n");
writeFileSync(
  archivo,
  `# Ranking de proveedores — "${palabra}" para ${mercado.nombre} (${fecha})

| # | Producto | Depósito | Precio | Envío | Costo total | Días | Venta sugerida | Ganancia aprox. | IDs CJ (producto / variante) |
|---|---|---|---|---|---|---|---|---|---|
${filas}

**Sugerencia:** #1 ${mejor.nombre} (depósito ${mejor.deposito}).

> Precios en dólares según CJ al día de hoy. "Ganancia aprox." descuenta producto, envío y
> comisión de pago (~${(COMISION_PAGO.porcentaje * 100).toFixed(1)}% + USD ${COMISION_PAGO.fijo}). No incluye publicidad ni devoluciones.
`,
);
console.log(`\n📄 Informe guardado en: ${archivo}`);
console.log("   Mirá el ranking y decime cuál querés publicar. No se cambia nada sin tu OK.\n");
