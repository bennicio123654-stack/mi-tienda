/**
 * FICHA DE PRODUCTO: /producto/<nombre-del-producto>
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/ClientBits";
import { ProductImage } from "@/components/ProductImage";
import { getProduct } from "@/data/products";
import { fill, getMessages } from "@/i18n/messages";
import { formatMoney, localPrice } from "@/lib/price";
import { getVisitor } from "@/lib/visitor";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const { market, lang } = await getVisitor();
  const t = getMessages(lang);

  return (
    <>
      <Link href="/" className="mb-6 inline-block text-sm underline">{t.products.back}</Link>
      <div className="grid gap-8 md:grid-cols-2">
        <ProductImage product={product} size="lg" />
        <div className="space-y-4">
          <h1 className="text-3xl font-black">{product.name[lang]}</h1>
          <p className="text-3xl font-bold text-pink-600">
            {formatMoney(localPrice(product.priceUsd, market.id), market.id)}
          </p>
          <p className="text-xs opacity-70">{market.taxIncluded ? t.price.taxIncluded : t.price.plusTax}</p>
          <p>{product.description[lang]}</p>
          <p className="text-sm">🚚 {fill(t.products.shipsIn, { days: market.shipping.estimatedDays })}</p>
          <AddToCartButton slug={product.slug} label={t.products.addToCart} addedLabel={t.products.added} />
        </div>
      </div>
    </>
  );
}
