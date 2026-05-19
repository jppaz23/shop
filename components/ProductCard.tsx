"use client";

import Image from "next/image";
import { Star, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/lib/store";
import type { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const t = useTranslations("product");

  return (
    <div className="group bg-white rounded-2xl overflow-hidden ring-1 ring-stone-200 hover:ring-black transition-all flex flex-col">
      <Link href={`/products/${product.id}`} className="block overflow-hidden relative aspect-square bg-stone-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 left-3 bg-black text-lime-400 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
            {t("onlyLeft", { n: product.stock })}
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 left-3 bg-stone-900 text-stone-300 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
            {t("soldOut")}
          </span>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-widest">{product.category}</span>
        <Link href={`/products/${product.id}`}>
          <h3 className="mt-1.5 font-semibold text-stone-900 text-sm leading-snug line-clamp-2 group-hover:text-black transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-2">
          <Star className="w-3.5 h-3.5 fill-lime-500 text-lime-500" />
          <span className="text-xs font-semibold text-stone-700">{product.rating}</span>
          <span className="text-xs text-stone-400">({product.reviews.toLocaleString()})</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4">
          <span className="font-extrabold text-stone-900 text-lg tracking-tight">${product.price.toFixed(2)}</span>
          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            aria-label={t("addToCart")}
            className="flex items-center justify-center w-9 h-9 bg-black hover:bg-lime-400 hover:text-black disabled:bg-stone-200 disabled:text-stone-400 text-white rounded-full transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
