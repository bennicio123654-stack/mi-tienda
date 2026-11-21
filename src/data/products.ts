/**
 * PRODUCTOS DE EJEMPLO
 * --------------------
 * Por ahora son productos inventados para ver cómo queda la tienda.
 * En la etapa 2 el comparador de proveedores trae los productos reales de CJ
 * y vos elegís cuáles publicar.
 *
 * Los precios se cargan en DÓLARES (priceUsd) y la tienda los convierte
 * a pesos o euros según el mercado (ver src/config/markets.ts).
 */

export type Product = {
  slug: string; // nombre corto que va en la dirección web: /producto/<slug>
  name: { en: string; es: string };
  description: { en: string; es: string };
  priceUsd: number;
  category: "clothing" | "accessories";
  // Mientras no tengamos fotos reales, cada producto muestra un degradé con un emoji.
  placeholder: { emoji: string; from: string; to: string };
};

export const PRODUCTS: Product[] = [
  {
    slug: "butterfly-clips-set",
    name: { en: "Butterfly Clips Set (12 pcs)", es: "Set de broches mariposa (12 u.)" },
    description: {
      en: "Glittery butterfly hair clips in pastel colors. The ultimate 2002 look.",
      es: "Broches de mariposa con brillos en colores pastel. El look 2002 definitivo.",
    },
    priceUsd: 12.99,
    category: "accessories",
    placeholder: { emoji: "🦋", from: "#f9a8d4", to: "#a5b4fc" },
  },
  {
    slug: "angel-baby-tee",
    name: { en: "“Angel” Baby Tee", es: "Baby tee “Angel”" },
    description: {
      en: "Cropped fitted tee with rhinestone lettering.",
      es: "Top corto y ajustado con letras de strass.",
    },
    priceUsd: 19.99,
    category: "clothing",
    placeholder: { emoji: "👼", from: "#fbcfe8", to: "#fde68a" },
  },
  {
    slug: "low-rise-cargo-pants",
    name: { en: "Low-Rise Cargo Pants", es: "Pantalón cargo tiro bajo" },
    description: {
      en: "Baggy low-rise cargos with oversized pockets.",
      es: "Cargo holgado tiro bajo con bolsillos grandes.",
    },
    priceUsd: 39.99,
    category: "clothing",
    placeholder: { emoji: "👖", from: "#93c5fd", to: "#c4b5fd" },
  },
  {
    slug: "rhinestone-baguette-bag",
    name: { en: "Rhinestone Baguette Bag", es: "Cartera baguette con strass" },
    description: {
      en: "Mini shoulder bag covered in sparkle. Fits your flip phone.",
      es: "Mini cartera de hombro llena de brillo. Entra tu celular con tapita.",
    },
    priceUsd: 29.99,
    category: "accessories",
    placeholder: { emoji: "👛", from: "#e9d5ff", to: "#f0abfc" },
  },
  {
    slug: "tinted-rimless-sunglasses",
    name: { en: "Tinted Rimless Sunglasses", es: "Anteojos de sol sin marco" },
    description: {
      en: "Colorful tinted lenses, rimless frame, pure Y2K energy.",
      es: "Lentes de colores, sin marco, pura energía Y2K.",
    },
    priceUsd: 16.99,
    category: "accessories",
    placeholder: { emoji: "🕶️", from: "#fdba74", to: "#f9a8d4" },
  },
  {
    slug: "velour-tracksuit",
    name: { en: "Velour Tracksuit Set", es: "Conjunto deportivo de plush" },
    description: {
      en: "Zip hoodie + flared pants in soft velour.",
      es: "Campera con cierre + pantalón oxford en plush suave.",
    },
    priceUsd: 54.99,
    category: "clothing",
    placeholder: { emoji: "💗", from: "#f472b6", to: "#c084fc" },
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
