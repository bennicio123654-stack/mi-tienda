"use client";
/**
 * Piecitas interactivas chicas (corren en el navegador):
 * - CartLink: el ícono del carrito con la cantidad
 * - AddToCartButton: el botón "Agregar al carrito"
 * - MarketSwitcher: el selector de región e idioma
 */
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartProvider";
import type { Language, MarketId } from "@/config/markets";

export function CartLink({ label }: { label: string }) {
  const { count } = useCart();
  return (
    <Link href="/carrito" className="rounded-full bg-black px-4 py-2 text-sm font-bold text-white">
      🛒 {label} {count > 0 && <span className="ml-1 rounded-full bg-pink-400 px-2">{count}</span>}
    </Link>
  );
}

export function AddToCartButton({ slug, label, addedLabel }: { slug: string; label: string; addedLabel: string }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <button
      onClick={() => {
        add(slug);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      className="w-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-6 py-3 font-bold text-white shadow-md transition hover:scale-[1.02]"
    >
      {added ? addedLabel : label}
    </button>
  );
}

type SwitcherProps = {
  current: MarketId;
  lang: Language;
  label: string;
  markets: { id: MarketId; flag: string; name: string; languages: Language[] }[];
};

export function MarketSwitcher({ current, lang, label, markets }: SwitcherProps) {
  const currentMarket = markets.find((m) => m.id === current)!;
  // Cambiar de región o idioma = ir a la misma página con ?mercado= o ?idioma=
  // (el middleware lo guarda en una cookie)
  const go = (param: string, value: string) => {
    window.location.href = `${window.location.pathname}?${param}=${value}`;
  };
  return (
    <div className="flex items-center gap-2 text-sm">
      <label className="sr-only" htmlFor="market">{label}</label>
      <select
        id="market"
        value={current}
        onChange={(e) => go("mercado", e.target.value)}
        className="rounded-full border border-black/20 bg-white px-3 py-1.5"
      >
        {markets.map((m) => (
          <option key={m.id} value={m.id}>
            {m.flag} {m.name}
          </option>
        ))}
      </select>
      {currentMarket.languages.length > 1 && (
        <button
          onClick={() => go("idioma", lang === "en" ? "es" : "en")}
          className="rounded-full border border-black/20 bg-white px-3 py-1.5 font-semibold"
          aria-label="Change language / Cambiar idioma"
        >
          {lang === "en" ? "ES" : "EN"}
        </button>
      )}
    </div>
  );
}
