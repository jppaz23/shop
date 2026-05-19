import { Suspense } from "react";
import ProductsClient from "./ProductsClient";
import { getAllProducts } from "@/lib/queries";

export const metadata = { title: "All Products — Shoply" };
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getAllProducts();
  return (
    <Suspense fallback={<div className="p-20 text-center text-gray-400">Loading products…</div>}>
      <ProductsClient products={products} />
    </Suspense>
  );
}
