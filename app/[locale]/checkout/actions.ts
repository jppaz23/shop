"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export type CartLine = { productId: string; quantity: number };

export type CheckoutFormFields = {
  email: string;
  name: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  shippingMethod: "standard" | "express" | "overnight";
};

function shippingFor(method: string, subtotal: number) {
  if (method === "overnight") return 29.99;
  if (method === "express") return 14.99;
  return subtotal >= 50 ? 0 : 7.99;
}

export async function placeOrder(form: CheckoutFormFields, cart: CartLine[]) {
  if (cart.length === 0) throw new Error("Cart is empty");

  const session = await auth();

  const ids = cart.map((c) => c.productId);
  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  const byId = new Map(products.map((p) => [p.id, p]));

  let subtotal = 0;
  const lineItems = cart.map((c) => {
    const p = byId.get(c.productId);
    if (!p) throw new Error(`Product ${c.productId} not found`);
    if (p.stock < c.quantity) throw new Error(`Insufficient stock for ${p.name}`);
    const price = Number(p.price);
    subtotal += price * c.quantity;
    return { product: p, price, quantity: c.quantity };
  });

  const shipping = shippingFor(form.shippingMethod, subtotal);
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId: session?.user?.id ?? null,
        email: form.email,
        name: form.name,
        address: form.address,
        city: form.city,
        country: form.country,
        postalCode: form.postalCode,
        subtotal,
        shipping,
        total,
        status: "PAID",
        items: {
          create: lineItems.map((li) => ({
            productId: li.product.id,
            name: li.product.name,
            price: li.price,
            quantity: li.quantity,
          })),
        },
      },
    });

    for (const li of lineItems) {
      await tx.product.update({
        where: { id: li.product.id },
        data: { stock: { decrement: li.quantity } },
      });
    }

    return created;
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/orders");
  return { orderId: order.id };
}
