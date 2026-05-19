import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";

export const metadata = { title: "Order Confirmed — Shoply" };
export const dynamic = "force-dynamic";

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  const order = orderId
    ? await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { product: true } } },
      })
    : null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-2">
          Thank you for your purchase. You&apos;ll receive a confirmation email shortly.
        </p>
        {order && (
          <p className="text-sm text-indigo-600 font-semibold">
            Order #{order.id.slice(-8).toUpperCase()}
          </p>
        )}
      </div>

      {order && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-4">
            {order.items.map((it) => (
              <div key={it.id} className="flex gap-3 items-center">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <Image src={it.product.image} alt={it.name} fill className="object-cover" sizes="48px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{it.name}</p>
                  <p className="text-xs text-gray-400">Qty: {it.quantity}</p>
                </div>
                <span className="text-sm font-bold text-gray-900">${fmt(Number(it.price) * it.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-6 pt-4 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between"><span>Subtotal</span><span>${fmt(Number(order.subtotal))}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{Number(order.shipping) === 0 ? "Free" : `$${fmt(Number(order.shipping))}`}</span></div>
            <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100"><span>Total</span><span>${fmt(Number(order.total))}</span></div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-gray-600">
            <p className="font-semibold text-gray-900 mb-1">Shipping to</p>
            <p>{order.name}</p>
            <p>{order.address}</p>
            <p>{order.city}, {order.postalCode}, {order.country}</p>
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
        <div className="flex items-center gap-3 text-gray-700">
          <Package className="w-5 h-5 text-indigo-500 shrink-0" />
          <div>
            <p className="font-semibold text-gray-900 text-sm">Estimated Delivery</p>
            <p className="text-sm text-gray-500">5–7 business days</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/products"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition-colors"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center text-gray-600 font-semibold px-8 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
