/**
 * PORTADA: banner + grilla de productos con precios en la moneda del visitante.
 */
import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { PRODUCTS } from "@/data/products";
import { STORE } from "@/config/store";
import { getMessages } from "@/i18n/messages";
import { formatMoney, localPrice } from "@/lib/price";
import { getVisitor } from "@/lib/visitor";

export default async function Home() {
  const { market, lang } = await getVisitor();
  const t = getMessages(lang);

  return (
    <>
      <section className="mb-12 rounded-3xl bg-gradient-to-br from-pink-300 via-violet-300 to-sky-200 px-6 py-14 text-center shadow-inner">
        <p className="mb-2 text-sm font-bold uppercase tracking-widest">✨ {STORE.tagline[lang]} ✨</p>
        <h1 className="mb-3 text-4xl font-black italic md:text-6xl">{t.hero.title}</h1>
        <p className="mb-6 text-lg">{t.hero.subtitle}</p>
        <a href="#productos" className="inline-block rounded-full bg-black px-6 py-3 font-bold text-white">
          {t.hero.cta}
        </a>
      </section>

      <h2 id="productos" className="mb-1 text-2xl font-black">{t.products.title}</h2>
      <p className="mb-6 text-xs opacity-60">{t.products.sampleNotice}</p>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {PRODUCTS.map((p) => (
          <Link key={p.slug} href={`/producto/${p.slug}`} className="group rounded-2xl bg-white p-3 shadow-sm transition hover:shadow-lg">
            <ProductImage product={p} />
            <p className="mt-3 font-semibold group-hover:underline">{p.name[lang]}</p>
            <p className="font-bold text-pink-600">{formatMoney(localPrice(p.priceUsd, market.id), market.id)}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
