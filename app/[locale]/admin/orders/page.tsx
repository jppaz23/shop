import { redirect, Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ShoppingBag, LayoutDashboard, Package } from "lucide-react";
import OrderStatusSelect from "./OrderStatusSelect";

export const dynamic = "force-dynamic";

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default async function OrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("orders");
  const tDash = await getTranslations("dashboard");
  const session = await auth();
  if (!session?.user) {
    redirect({ href: "/login?callbackUrl=/admin/orders", locale });
    return null;
  }
  if (!session.user.isAdmin) {
    redirect({ href: "/admin", locale });
    return null;
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
    take: 100,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingBag className="w-6 h-6 text-black" />
        <h1 className="text-3xl font-black text-stone-950 tracking-tight">{t("title")}</h1>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm bg-white border border-stone-200 hover:border-black px-4 py-2 rounded-xl text-stone-700 transition-colors">
          <LayoutDashboard className="w-4 h-4" /> {tDash("title")}
        </Link>
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm bg-white border border-stone-200 hover:border-black px-4 py-2 rounded-xl text-stone-700 transition-colors">
          <Package className="w-4 h-4" /> {tDash("products")}
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl ring-1 ring-stone-200 p-12 text-center text-stone-400">
          {t("noOrders")}
        </div>
      ) : (
        <div className="bg-white rounded-2xl ring-1 ring-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-stone-600">
                <th className="text-left px-4 py-3 font-semibold">{tDash("order")}</th>
                <th className="text-left px-4 py-3 font-semibold">{t("date")}</th>
                <th className="text-left px-4 py-3 font-semibold">{tDash("customer")}</th>
                <th className="text-left px-4 py-3 font-semibold">{tDash("products")}</th>
                <th className="text-right px-4 py-3 font-semibold">{tDash("total")}</th>
                <th className="px-4 py-3 font-semibold">{tDash("status")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-mono text-xs text-stone-500">#{o.id.slice(-8)}</td>
                  <td className="px-4 py-3 text-xs text-stone-500">
                    {o.createdAt.toLocaleDateString(locale)}
                    <div className="text-[10px] text-stone-400">{o.createdAt.toLocaleTimeString(locale)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-stone-900 font-medium">{o.name}</div>
                    <div className="text-xs text-stone-400">{o.email}</div>
                  </td>
                  <td className="px-4 py-3 text-stone-600">{t("items", { count: o.items.reduce((s, i) => s + i.quantity, 0) })}</td>
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
