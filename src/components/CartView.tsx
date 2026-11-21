"use client";
/**
 * PANTALLA DEL CARRITO
 * Muestra los productos, calcula subtotal + envío + total en la moneda del mercado.
 */
import Link from "next/link";
import { useCart } from "./CartProvider";
import { ProductImage } from "./ProductImage";
import { getProduct } from "@/data/products";
import { formatMoney, localPrice, shippingCost } from "@/lib/price";
import { fill, type Messages } from "@/i18n/messages";
import type { Language, Market } from "@/config/markets";

export function CartView({ market, lang, t }: { market: Market; lang: Language; t: Messages }) {
  const { items, setQty, remove } = useCart();
  const money = (n: number) => formatMoney(n, market.id);

  // Juntamos cada item del carrito con los datos del producto
  const lines = items
    .map((item) => ({ item, product: getProduct(item.slug) }))
    .filter((l) => l.product !== undefined);

  if (lines.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="mb-6 text-lg">{t.cart.empty}</p>
        <Link href="/" className="underline">{t.products.back}</Link>
      </div>
    );
  }

  const subtotal = lines.reduce((sum, l) => sum + localPrice(l.product!.priceUsd, market.id) * l.item.qty, 0);
  const shipping = shippingCost(subtotal, market.id);
  const total = subtotal + shipping;

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_320px]">
      <ul className="space-y-4">
        {lines.map(({ item, product }) => (
          <li key={item.slug} className="flex items-center gap-4 rounded-2xl bg-white p-3 shadow-sm">
            <div className="w-20 shrink-0"><ProductImage product={product!} /></div>
            <div className="flex-1">
              <p className="font-semibold">{product!.name[lang]}</p>
              <p className="text-sm opacity-70">{money(localPrice(product!.priceUsd, market.id))}</p>
            </div>
            <input
              type="number"
              min={1}
              max={10}
              value={item.qty}
              onChange={(e) => setQty(item.slug, Number(e.target.value))}
              className="w-16 rounded-lg border px-2 py-1"
              aria-label="Cantidad"
            />
            <button onClick={() => remove(item.slug)} className="text-sm text-red-600 underline">
              {t.cart.remove}
            </button>
          </li>
        ))}
      </ul>

      <aside className="h-fit space-y-3 rounded-2xl bg-white p-5 shadow-sm">
        <Row label={t.cart.subtotal} value={money(subtotal)} />
        <Row label={t.cart.shipping} value={shipping === 0 ? t.cart.free : money(shipping)} />
        {market.shipping.freeFrom !== null && shipping > 0 && (
          <p className="text-xs opacity-70">
            {fill(t.cart.freeShippingFrom, { amount: money(market.shipping.freeFrom) })}
          </p>
        )}
        <hr />
        <Row label={t.cart.total} value={money(total)} bold />
        <p className="text-xs opacity-70">{market.taxIncluded ? t.price.taxIncluded : t.price.plusTax}</p>

        {/* El pago real se conecta en la etapa 3 */}
        <button
          disabled
          className="w-full cursor-not-allowed rounded-full bg-black/30 px-6 py-3 font-bold text-white"
        >
          {market.checkoutEnabled ? t.cart.checkout : t.cart.comingSoon}
        </button>
        {market.checkoutEnabled && <p className="text-center text-xs opacity-70">{t.cart.checkoutSoon}</p>}
      </aside>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "text-lg font-bold" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
