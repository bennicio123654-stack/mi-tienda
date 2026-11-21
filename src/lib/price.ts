/**
 * CÁLCULO Y FORMATO DE PRECIOS
 * Funciona igual en el servidor y en el navegador.
 */
import { MARKETS, type MarketId } from "@/config/markets";

/**
 * Convierte un precio en dólares a la moneda del mercado y lo redondea "lindo":
 * - Dólares y euros: termina en ,99 (ej: 13,99)
 * - Pesos: redondeado a la centena (ej: 18.900)
 */
export function localPrice(priceUsd: number, marketId: MarketId): number {
  const market = MARKETS[marketId];
  const raw = priceUsd * market.usdRate;
  if (market.currency === "ARS") return Math.round(raw / 100) * 100;
  if (market.currency === "USD") return priceUsd; // ya está en dólares
  return Math.max(Math.ceil(raw) - 0.01, 0.99);
}

/** Muestra un número como precio: $19.99 / $ 18.900 / 19,99 € */
export function formatMoney(amount: number, marketId: MarketId): string {
  const market = MARKETS[marketId];
  return new Intl.NumberFormat(market.locale, {
    style: "currency",
    currency: market.currency,
    maximumFractionDigits: market.currency === "ARS" ? 0 : 2,
  }).format(amount);
}

/** Calcula el envío según el subtotal (en moneda local). */
export function shippingCost(subtotal: number, marketId: MarketId): number {
  const { flatRate, freeFrom } = MARKETS[marketId].shipping;
  if (subtotal === 0) return 0;
  if (freeFrom !== null && subtotal >= freeFrom) return 0;
  return flatRate;
}
