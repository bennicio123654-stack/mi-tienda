/**
 * TEXTOS DE LA TIENDA EN CADA IDIOMA
 * Para cambiar un texto, buscalo acá y editalo en los dos idiomas.
 */
import type { Language } from "@/config/markets";

const en = {
  nav: { shop: "Shop", cart: "Cart" },
  hero: {
    title: "Back to 2000s",
    subtitle: "Butterfly clips, baby tees, low-rise everything.",
    cta: "Shop now",
  },
  products: {
    title: "New drops",
    addToCart: "Add to cart",
    added: "Added! ✓",
    shipsIn: "Ships in {days} business days",
    sampleNotice: "Sample products — the real catalog will come from our supplier.",
    back: "← Back to shop",
    notFound: "Product not found",
  },
  price: { taxIncluded: "VAT included", plusTax: "Sales tax calculated at checkout" },
  cart: {
    title: "Your cart",
    empty: "Your cart is empty.",
    subtotal: "Subtotal",
    shipping: "Shipping",
    free: "Free",
    total: "Total",
    freeShippingFrom: "Free shipping on orders over {amount}",
    remove: "Remove",
    checkout: "Checkout",
    comingSoon: "Checkout coming soon in your region",
    checkoutSoon: "Payments are enabled in the next stage (test mode).",
  },
  footer: { rights: "All rights reserved.", testMode: "TEST MODE — no real payments" },
  market: { label: "Region" },
};

// El tipo de "es" tiene que ser igual al de "en": si falta un texto, avisa el editor.
const es: typeof en = {
  nav: { shop: "Tienda", cart: "Carrito" },
  hero: {
    title: "De vuelta a los 2000s",
    subtitle: "Broches de mariposa, baby tees y todo tiro bajo.",
    cta: "Ver productos",
  },
  products: {
    title: "Lo nuevo",
    addToCart: "Agregar al carrito",
    added: "¡Agregado! ✓",
    shipsIn: "Llega en {days} días hábiles",
    sampleNotice: "Productos de ejemplo — el catálogo real vendrá del proveedor.",
    back: "← Volver a la tienda",
    notFound: "Producto no encontrado",
  },
  price: { taxIncluded: "IVA incluido", plusTax: "Impuestos calculados al pagar" },
  cart: {
    title: "Tu carrito",
    empty: "Tu carrito está vacío.",
    subtotal: "Subtotal",
    shipping: "Envío",
    free: "Gratis",
    total: "Total",
    freeShippingFrom: "Envío gratis en compras desde {amount}",
    remove: "Quitar",
    checkout: "Ir a pagar",
    comingSoon: "Muy pronto vas a poder comprar desde tu país",
    checkoutSoon: "Los pagos se habilitan en la próxima etapa (modo prueba).",
  },
  footer: { rights: "Todos los derechos reservados.", testMode: "MODO PRUEBA — no se cobra nada real" },
  market: { label: "Región" },
};

export const MESSAGES = { en, es };
export type Messages = typeof en;

export function getMessages(lang: Language): Messages {
  return MESSAGES[lang];
}

/** Reemplaza {variables} dentro de un texto. Ej: fill("Llega en {days}", { days: "3-7" }) */
export function fill(text: string, vars: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");
}
