import { prisma } from "@/lib/db";
import { serializeProduct, type Product } from "@/lib/products";

export async function getAllProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map(serializeProduct);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { featured: true },
    take: limit,
    orderBy: { createdAt: "asc" },
  });
  return rows.map(serializeProduct);
}

export async function getProduct(id: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({ where: { id } });
  return row ? serializeProduct(row) : null;
}

export async function getRelatedProducts(category: string, excludeId: string, limit = 4): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { category, id: { not: excludeId } },
    take: limit,
    orderBy: { createdAt: "asc" },
  });
  return rows.map(serializeProduct);
}
