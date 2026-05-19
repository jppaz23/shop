import { Suspense } from "react";
import ProductsClient from "./ProductsClient";

export const metadata = { title: "All Products — Shoply" };

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-gray-400">Loading products…</div>}>
      <ProductsClient />
    </Suspense>
  );
}
