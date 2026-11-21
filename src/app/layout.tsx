/**
 * MARCO GENERAL DE TODAS LAS PÁGINAS: encabezado, contenido y pie.
 */
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { CartLink, MarketSwitcher } from "@/components/ClientBits";
import { MARKETS } from "@/config/markets";
import { IS_PRODUCTION, STORE } from "@/config/store";
import { getMessages } from "@/i18n/messages";
import { getVisitor } from "@/lib/visitor";

export async function generateMetadata(): Promise<Metadata> {
  const { lang } = await getVisitor();
  return { title: STORE.name, description: STORE.tagline[lang] };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { market, lang } = await getVisitor();
  const t = getMessages(lang);
  // Solo mandamos al navegador los datos que necesita el selector
  const marketList = Object.values(MARKETS).map(({ id, flag, name, languages }) => ({ id, flag, name, languages }));

  return (
    <html lang={lang}>
      <body className="min-h-screen">
        <CartProvider>
          {!IS_PRODUCTION && (
            <div className="bg-yellow-300 py-1 text-center text-xs font-bold">⚠️ {t.footer.testMode}</div>
          )}
          <header className="sticky top-0 z-10 border-b border-black/10 bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
              <Link href="/" className="bg-gradient-to-r from-pink-500 via-violet-500 to-sky-400 bg-clip-text text-2xl font-black italic text-transparent">
                {STORE.name}
              </Link>
              <div className="flex flex-wrap items-center gap-3">
                <MarketSwitcher current={market.id} lang={lang} label={t.market.label} markets={marketList} />
                <CartLink label={t.nav.cart} />
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          <footer className="mt-16 border-t border-black/10 py-8 text-center text-sm opacity-70">
            © {new Date().getFullYear()} {STORE.name}. {t.footer.rights}
            {/* Acá van a ir los links a las páginas legales (etapa 5) */}
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
