import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getProduct, getRelatedProducts } from "@/lib/queries";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return {};
  return { title: `${product.name} — Shoply` };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = await params;
  setRequestLocale(locale);
  const product = await getProduct(id);
  if (!product) notFound();
  const related = await getRelatedProducts(product.category, product.id);
  return <ProductDetailClient product={product} related={related} />;
}
