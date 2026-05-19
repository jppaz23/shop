"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    redirect("/login?callbackUrl=/admin");
  }
}

type ProductInput = {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  featured: boolean;
};

function parseForm(formData: FormData): ProductInput {
  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price: Number(formData.get("price") ?? 0),
    category: String(formData.get("category") ?? "Electronics"),
    image: String(formData.get("image") ?? "").trim(),
    rating: Number(formData.get("rating") ?? 0),
    reviews: Number(formData.get("reviews") ?? 0),
    stock: Number(formData.get("stock") ?? 0),
    featured: formData.get("featured") === "on",
  };
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const data = parseForm(formData);
  if (!data.name) throw new Error("Name required");
  await prisma.product.create({ data });
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const data = parseForm(formData);
  await prisma.product.update({ where: { id }, data });
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  revalidatePath("/");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/");
}

export async function updateOrderStatus(orderId: string, status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED") {
  await requireAdmin();
  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");
}
