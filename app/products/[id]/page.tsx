import { notFound } from "next/navigation";
import { products } from "@/lib/products";
import ProductDetailClient from "./ProductDetailClient";

export async function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) return {};
  return { title: `${product.name} — Shoply` };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  return <ProductDetailClient product={product} related={related} />;
}
