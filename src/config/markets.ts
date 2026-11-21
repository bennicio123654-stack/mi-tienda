/**
 * MERCADOS DE LA TIENDA
 * ---------------------
 * Acá se define todo lo que cambia según de dónde sea el visitante:
 * idioma, moneda, cómo se cobra, cuánto sale el envío y si ya está habilitado.
 *
 * Para cambiar un costo de envío o una cotización, se toca SOLO este archivo.
 */

export type MarketId = "US" | "AR" | "EU";
export type Language = "en" | "es";
export type PaymentProvider = "paypal" | "mercadopago" | "stripe";

export type Market = {
  id: MarketId;
  name: string; // nombre para mostrar en el selector
  flag: string;
  currency: "USD" | "ARS" | "EUR";
  locale: string; // formato de números y fechas (ej: "es-AR" muestra $ 1.234,56)
  defaultLanguage: Language;
  languages: Language[]; // idiomas que el visitante puede elegir
  /**
   * Cuántas unidades de la moneda local vale 1 dólar.
   * Los precios de los productos se cargan en dólares y se convierten con esto.
   * ⚠️ Son valores provisorios: actualizalos antes de vender (más adelante
   * podemos traer la cotización automáticamente).
   */
  usdRate: number;
  /** Si es true, el precio mostrado ya incluye impuestos (obligatorio en Europa). */
  taxIncluded: boolean;
  /** Si hay que mostrar el cartel de cookies (obligatorio en Europa por RGPD). */
  cookieBanner: boolean;
  shipping: {
    flatRate: number; // costo de envío en moneda local
    freeFrom: number | null; // compra mínima para envío gratis (null = nunca)
    estimatedDays: string; // texto con la demora estimada
  };
  payments: PaymentProvider[]; // medios de pago, en orden de preferencia
  /**
   * ¿Se puede comprar en este mercado? Arrancamos solo con EE.UU.
   * En los otros se ven precios pero el botón de pagar dice "Próximamente".
   */
  checkoutEnabled: boolean;
};

export const MARKETS: Record<MarketId, Market> = {
  US: {
    id: "US",
    name: "United States",
    flag: "🇺🇸",
    currency: "USD",
    locale: "en-US",
    defaultLanguage: "en",
    languages: ["en", "es"],
    usdRate: 1,
    taxIncluded: false, // en EE.UU. el impuesto se suma aparte (sales tax)
    cookieBanner: false,
    shipping: { flatRate: 4.99, freeFrom: 50, estimatedDays: "3-7" },
    payments: ["paypal"], // Stripe se suma más adelante
    checkoutEnabled: true,
  },
  AR: {
    id: "AR",
    name: "Argentina",
    flag: "🇦🇷",
    currency: "ARS",
    locale: "es-AR",
    defaultLanguage: "es",
    languages: ["es"],
    usdRate: 1450, // ⚠️ provisorio: actualizar con la cotización real
    taxIncluded: true,
    cookieBanner: false,
    shipping: { flatRate: 9900, freeFrom: null, estimatedDays: "20-40" },
    payments: ["mercadopago"],
    checkoutEnabled: false, // se habilita en la etapa 7/8
  },
  EU: {
    id: "EU",
    name: "Europe",
    flag: "🇪🇺",
    currency: "EUR",
    locale: "es-ES",
    defaultLanguage: "en",
    languages: ["en", "es"],
    usdRate: 0.92, // ⚠️ provisorio
    taxIncluded: true, // en Europa es obligatorio mostrar precios con IVA
    cookieBanner: true,
    shipping: { flatRate: 4.99, freeFrom: 60, estimatedDays: "4-8" },
    payments: ["paypal"],
    checkoutEnabled: false, // se habilita en la etapa 7/8
  },
};

/** Mercado que se usa si no sabemos de dónde es el visitante. */
export const DEFAULT_MARKET: MarketId = "US";

/** Países de la Unión Europea + algunos vecinos que atendemos como "Europa". */
const EUROPE_COUNTRIES = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
];

/**
 * Traduce el código de país del visitante (ej: "ES", "AR") a uno de nuestros mercados.
 * Cualquier país que no sea Argentina ni Europa ve la versión de EE.UU. (inglés, dólares).
 */
export function countryToMarket(country: string | null | undefined): MarketId {
  const c = (country || "").toUpperCase();
  if (c === "AR") return "AR";
  if (EUROPE_COUNTRIES.includes(c)) return "EU";
  if (c === "US") return "US";
  return DEFAULT_MARKET;
}

export function isMarketId(value: unknown): value is MarketId {
  return value === "US" || value === "AR" || value === "EU";
}
