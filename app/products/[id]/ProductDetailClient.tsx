"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, Check } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/store";
import type { Product } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import StarRating from "@/components/StarRating";

export default function ProductDetailClient({ product, related }: { product: Product; related: Product[] }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/products" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
          <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
        </div>

        <div className="flex flex-col">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wide">{product.category}</span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-2 mb-4">{product.name}</h1>

          <div className="flex items-center gap-3 mb-6">
            <StarRating rating={product.rating} />
            <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.reviews.toLocaleString()} reviews)</span>
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
          </div>

          {product.stock > 0 ? (
            <p className="text-sm text-green-600 font-medium mb-6 flex items-center gap-1">
              <Check className="w-4 h-4" />
              In stock{product.stock <= 10 ? ` — only ${product.stock} left` : ""}
            </p>
          ) : (
            <p className="text-sm text-red-500 font-medium mb-6">Out of stock</p>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={() => setQty(Math.max(1, qty - 1))}
              >−</button>
              <span className="px-4 py-2 font-semibold text-gray-900 min-w-[3rem] text-center">{qty}</span>
              <button
                className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
              >+</button>
            </div>
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition-all ${
                added
                  ? "bg-green-500 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-300"
              }`}
            >
              {added ? <><Check className="w-5 h-5" /> Added!</> : <><ShoppingCart className="w-5 h-5" /> Add to Cart</>}
            </button>
          </div>

          <Link
            href="/cart"
            className="text-center border-2 border-indigo-600 text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors"
          >
            View Cart
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">More in {product.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
