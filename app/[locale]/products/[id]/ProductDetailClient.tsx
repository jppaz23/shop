"use client";

import Image from "next/image";
import { ShoppingCart, ArrowLeft, Check } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/lib/store";
import type { Product } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import StarRating from "@/components/StarRating";

export default function ProductDetailClient({ product, related }: { product: Product; related: Product[] }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const t = useTranslations("product");

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/products" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t("backToProducts")}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 ring-1 ring-stone-200">
          <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-lime-600 font-semibold uppercase tracking-widest">{product.category}</span>
          <h1 className="text-4xl font-black text-stone-950 mt-2 mb-4 tracking-tight leading-tight">{product.name}</h1>

          <div className="flex items-center gap-3 mb-6">
            <StarRating rating={product.rating} />
            <span className="text-sm font-semibold text-stone-700">{product.rating}</span>
            <span className="text-sm text-stone-400">({t("reviews", { count: product.reviews })})</span>
          </div>

          <p className="text-stone-600 leading-relaxed mb-8">{product.description}</p>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-5xl font-black text-stone-950 tracking-tight">${product.price.toFixed(2)}</span>
          </div>

          {product.stock > 0 ? (
            <p className="text-sm text-emerald-600 font-medium mb-6 flex items-center gap-1">
              <Check className="w-4 h-4" />
              {t("inStock")}{product.stock <= 10 ? ` — ${t("onlyLeft", { n: product.stock })}` : ""}
            </p>
          ) : (
            <p className="text-sm text-red-500 font-medium mb-6">{t("outOfStock")}</p>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center bg-stone-100 rounded-full overflow-hidden">
              <button
                className="px-4 py-2.5 text-stone-700 hover:bg-stone-200 transition-colors"
                onClick={() => setQty(Math.max(1, qty - 1))}
              >−</button>
              <span className="px-4 py-2 font-semibold text-stone-900 min-w-[3rem] text-center">{qty}</span>
              <button
                className="px-4 py-2.5 text-stone-700 hover:bg-stone-200 transition-colors"
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
              >+</button>
            </div>
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className={`flex-1 flex items-center justify-center gap-2 font-bold py-3.5 rounded-full transition-all ${
                added
                  ? "bg-lime-400 text-black"
                  : "bg-black hover:bg-stone-800 text-white disabled:bg-stone-200 disabled:text-stone-400"
              }`}
            >
              {added ? <><Check className="w-5 h-5" /> {t("added")}</> : <><ShoppingCart className="w-5 h-5" /> {t("addToCart")}</>}
            </button>
          </div>

          <Link
            href="/cart"
            className="text-center bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold py-3 rounded-full transition-colors"
          >
            {t("viewCart")}
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-lime-600">{t("relatedKicker")}</span>
          <h2 className="text-3xl font-black text-stone-950 mb-8 mt-2 tracking-tight">{t("relatedTitle", { category: product.category })}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
