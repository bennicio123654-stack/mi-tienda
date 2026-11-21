/**
 * Imagen provisoria del producto: un degradé con un emoji.
 * Cuando tengamos las fotos reales del proveedor, se reemplaza por <Image>.
 */
import type { Product } from "@/data/products";

export function ProductImage({ product, size = "md" }: { product: Product; size?: "md" | "lg" }) {
  const { emoji, from, to } = product.placeholder;
  return (
    <div
      className="flex aspect-square w-full items-center justify-center rounded-2xl"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <span className={size === "lg" ? "text-9xl" : "text-7xl"} aria-hidden>
        {emoji}
      </span>
    </div>
  );
}
