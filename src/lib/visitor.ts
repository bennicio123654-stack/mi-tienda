/**
 * ¿DE DÓNDE ES EL VISITANTE?
 * --------------------------
 * Decide el mercado y el idioma de cada visita, en este orden:
 *   1. Lo que el visitante eligió a mano en el selector (queda guardado en una cookie).
 *   2. El país que detecta Vercel automáticamente (encabezado "x-vercel-ip-country").
 *   3. En tu compu no hay detección: se usa DEV_COUNTRY del .env, o EE.UU.
 *
 * Solo se usa en el servidor.
 */
import { cookies, headers } from "next/headers";
import { MARKETS, countryToMarket, isMarketId, type Language, type Market } from "@/config/markets";

export const MARKET_COOKIE = "mercado";
export const LANG_COOKIE = "idioma";

export type Visitor = { market: Market; lang: Language; country: string | null };

export async function getVisitor(): Promise<Visitor> {
  const cookieStore = await cookies();
  const headerStore = await headers();

  // País detectado (Vercel lo agrega solo cuando la web está publicada)
  const country = headerStore.get("x-vercel-ip-country") || process.env.DEV_COUNTRY || null;

  // 1) Mercado
  const chosen = cookieStore.get(MARKET_COOKIE)?.value;
  const marketId = isMarketId(chosen) ? chosen : countryToMarket(country);
  const market = MARKETS[marketId];

  // 2) Idioma: el elegido a mano, o el del navegador si el mercado lo ofrece, o el del mercado
  const chosenLang = cookieStore.get(LANG_COOKIE)?.value as Language | undefined;
  const browserLang = (headerStore.get("accept-language") || "").slice(0, 2) as Language;
  let lang: Language = market.defaultLanguage;
  if (chosenLang && market.languages.includes(chosenLang)) lang = chosenLang;
  else if (market.languages.includes(browserLang)) lang = browserLang;

  return { market, lang, country };
}
