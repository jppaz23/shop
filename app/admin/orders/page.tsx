import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ShoppingBag, LayoutDashboard, Package } from "lucide-react";
import OrderStatusSelect from "./OrderStatusSelect";

export const dynamic = "force-dynamic";

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin/orders");
  if (!session.user.isAdmin) redirect("/admin");

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
    take: 100,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingBag className="w-6 h-6 text-indigo-600" />
        <h1 className="text-3xl font-extrabold text-gray-900">Orders</h1>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm bg-white border border-gray-200 hover:border-indigo-300 px-4 py-2 rounded-xl text-gray-700 transition-colors">
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </Link>
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm bg-white border border-gray-200 hover:border-indigo-300 px-4 py-2 rounded-xl text-gray-700 transition-colors">
          <Package className="w-4 h-4" /> Products
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
          No orders yet.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="text-left px-4 py-3 font-semibold">Order</th>
                <th className="text-left px-4 py-3 font-semibold">Date</th>
                <th className="text-left px-4 py-3 font-semibold">Customer</th>
                <th className="text-left px-4 py-3 font-semibold">Items</th>
                <th className="text-right px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">#{o.id.slice(-8)}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {o.createdAt.toLocaleDateString()}
                    <div className="text-[10px] text-gray-400">{o.createdAt.toLocaleTimeString()}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-900 font-medium">{o.name}</div>
                    <div className="text-xs text-gray-400">{o.email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{o.items.reduce((s, i) => s + i.quantity, 0)} units</td>
                  <td className="px-4 py-3 text-right font-semibold">${fmt(Number(o.total))}</td>
                  <td className="px-4 py-3">
                    <OrderStatusSelect orderId={o.id} status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
