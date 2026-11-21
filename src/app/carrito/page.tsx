/**
 * CARRITO: /carrito
 */
import { CartView } from "@/components/CartView";
import { getMessages } from "@/i18n/messages";
import { getVisitor } from "@/lib/visitor";

export default async function CartPage() {
  const { market, lang } = await getVisitor();
  const t = getMessages(lang);
  return (
    <>
      <h1 className="mb-6 text-3xl font-black">{t.cart.title}</h1>
      <CartView market={market} lang={lang} t={t} />
    </>
  );
}
