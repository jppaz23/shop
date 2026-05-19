import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import ProductsClient from "./ProductsClient";
import { getAllProducts } from "@/lib/queries";

export const metadata = { title: "All Products — Shoply" };
export const dynamic = "force-dynamic";

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const products = await getAllProducts();
  return (
    <Suspense fallback={<div className="p-20 text-center text-stone-400">Loading…</div>}>
      <ProductsClient products={products} />
    </Suspense>
  );
}
