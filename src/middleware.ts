/**
 * MIDDLEWARE: corre antes de cada página.
 * Si la dirección trae ?mercado=AR o ?idioma=es (lo usa el selector de región),
 * lo guarda en una cookie por 1 año y recarga la página sin ese agregado.
 */
import { NextResponse, type NextRequest } from "next/server";
import { isMarketId } from "@/config/markets";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const market = url.searchParams.get("mercado")?.toUpperCase();
  const lang = url.searchParams.get("idioma");

  if (!market && !lang) return NextResponse.next();

  url.searchParams.delete("mercado");
  url.searchParams.delete("idioma");
  const response = NextResponse.redirect(url);
  const oneYear = 60 * 60 * 24 * 365;

  if (market && isMarketId(market)) {
    response.cookies.set("mercado", market, { maxAge: oneYear, path: "/" });
    response.cookies.delete("idioma"); // al cambiar de región, vuelve al idioma de esa región
  }
  if (lang === "en" || lang === "es") {
    response.cookies.set("idioma", lang, { maxAge: oneYear, path: "/" });
  }
  return response;
}

// No hace falta correrlo para imágenes ni archivos internos de Next.js
export const config = { matcher: ["/((?!_next|api|favicon.ico).*)"] };
