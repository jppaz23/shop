"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store";
import type { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
      <Link href={`/products/${product.id}`} className="block overflow-hidden relative aspect-square">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-2 left-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Out of stock
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-indigo-600 font-medium uppercase tracking-wide">{product.category}</span>
        <Link href={`/products/${product.id}`}>
          <h3 className="mt-1 font-semibold text-gray-900 text-sm leading-snug line-clamp-2 hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-2">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium text-gray-700">{product.rating}</span>
          <span className="text-xs text-gray-400">({product.reviews.toLocaleString()})</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4">
          <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
