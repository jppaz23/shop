"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CATEGORIES, type Product } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Highest Rated", value: "rating" },
  { label: "Most Reviews", value: "reviews" },
];

export default function ProductsClient({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get("category") ?? "All";
  const [sort, setSort] = useState("featured");

  const setCategory = (c: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (c === "All") params.delete("category");
    else params.set("category", c);
    router.push(`/products?${params.toString()}`);
  };

  let filtered = category === "All" ? products : products.filter((p) => p.category === category);

  if (sort === "price_asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sort === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  else if (sort === "reviews") filtered = [...filtered].sort((a, b) => b.reviews - a.reviews);
  else if (sort === "featured") filtered = [...filtered].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          {category === "All" ? "All Products" : category}
        </h1>
        <p className="text-gray-500 mt-1">{filtered.length} products</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                category === c
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-400"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="sm:ml-auto flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-400">No products found in this category.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
