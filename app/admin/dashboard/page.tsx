import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import {
  LayoutDashboard,
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Package,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

export const dynamic = "force-dynamic";

type Kpi = {
  label: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
  accent: string;
};

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin/dashboard");
  if (!session.user.isAdmin) redirect("/admin");

  const since30 = new Date();
  since30.setDate(since30.getDate() - 30);

  const [
    totalOrders,
    paidAgg,
    orders30,
    recentOrders,
    productsCount,
    usersCount,
    lowStock,
    topItems,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      _avg: { total: true },
      where: { status: { not: "CANCELLED" } },
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: since30 }, status: { not: "CANCELLED" } },
      select: { total: true, createdAt: true },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { items: true },
    }),
    prisma.product.count(),
    prisma.user.count(),
    prisma.product.findMany({
      where: { stock: { lte: 5 } },
      orderBy: { stock: "asc" },
      take: 6,
    }),
    prisma.orderItem.groupBy({
      by: ["productId", "name"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  const totalRevenue = Number(paidAgg._sum.total ?? 0);
  const avgOrder = Number(paidAgg._avg.total ?? 0);

  const byDay = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    byDay.set(d.toISOString().slice(0, 10), 0);
  }
  for (const o of orders30) {
    const key = o.createdAt.toISOString().slice(0, 10);
    byDay.set(key, (byDay.get(key) ?? 0) + Number(o.total));
  }
  const series = Array.from(byDay.entries());
  const maxSeries = Math.max(1, ...series.map(([, v]) => v));

  const kpis: Kpi[] = [
    {
      label: "Total Revenue",
      value: `$${fmt(totalRevenue)}`,
      hint: `${totalOrders} orders all time`,
      icon: <DollarSign className="w-5 h-5" />,
      accent: "from-emerald-500 to-teal-600",
    },
    {
      label: "Avg Order Value",
      value: `$${fmt(avgOrder)}`,
      hint: "Across non-cancelled orders",
      icon: <TrendingUp className="w-5 h-5" />,
      accent: "from-indigo-500 to-violet-600",
    },
    {
      label: "Products",
      value: String(productsCount),
      hint: `${lowStock.length} low stock`,
      icon: <Package className="w-5 h-5" />,
      accent: "from-amber-500 to-orange-600",
    },
    {
      label: "Customers",
      value: String(usersCount),
      hint: "Registered accounts",
      icon: <Users className="w-5 h-5" />,
      accent: "from-pink-500 to-rose-600",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <LayoutDashboard className="w-6 h-6 text-indigo-600" />
        <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm bg-white border border-gray-200 hover:border-indigo-300 px-4 py-2 rounded-xl text-gray-700 transition-colors">
          <Package className="w-4 h-4" /> Products
        </Link>
        <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm bg-white border border-gray-200 hover:border-indigo-300 px-4 py-2 rounded-xl text-gray-700 transition-colors">
          <ShoppingBag className="w-4 h-4" /> Orders
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${k.accent} text-white flex items-center justify-center shadow-sm`}>
                {k.icon}
              </div>
              <span className="text-xs uppercase tracking-wide text-gray-400 font-semibold">{k.label}</span>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-extrabold text-gray-900">{k.value}</div>
              <div className="text-xs text-gray-500 mt-1">{k.hint}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Revenue — last 30 days</h2>
              <p className="text-xs text-gray-500">Sum of completed orders per day</p>
            </div>
            <div className="text-sm text-gray-500">Peak: ${fmt(maxSeries)}</div>
          </div>
          <div className="relative h-48">
            <svg viewBox="0 0 600 200" preserveAspectRatio="none" className="w-full h-full">
              <defs>
                <linearGradient id="rev-grad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>
              {series.length > 1 && (() => {
                const stepX = 600 / (series.length - 1);
                const points = series.map(([, v], i) => `${i * stepX},${200 - (v / maxSeries) * 180 - 10}`);
                const path = `M ${points.join(" L ")}`;
                const area = `${path} L 600,200 L 0,200 Z`;
                return (
                  <>
                    <path d={area} fill="url(#rev-grad)" />
                    <path d={path} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                  </>
                );
              })()}
            </svg>
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mt-2">
            <span>{series[0]?.[0].slice(5)}</span>
            <span>{series[Math.floor(series.length / 2)]?.[0].slice(5)}</span>
            <span>{series[series.length - 1]?.[0].slice(5)}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Top Products</h2>
          <p className="text-xs text-gray-500 mb-4">By units sold</p>
          {topItems.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No sales yet.</p>
          ) : (
            <ul className="space-y-3">
              {topItems.map((t, i) => (
                <li key={t.productId} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="flex-1 text-sm text-gray-700 truncate">{t.name}</span>
                  <span className="text-sm font-bold text-gray-900">{t._sum.quantity ?? 0}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-indigo-600 font-semibold inline-flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400 py-12 text-center">No orders yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="text-left px-6 py-3 font-semibold">Order</th>
                  <th className="text-left px-6 py-3 font-semibold">Customer</th>
                  <th className="text-left px-6 py-3 font-semibold">Status</th>
                  <th className="text-right px-6 py-3 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-mono text-xs text-gray-500">#{o.id.slice(-8)}</td>
                    <td className="px-6 py-3 text-gray-900">{o.name}<div className="text-xs text-gray-400">{o.email}</div></td>
                    <td className="px-6 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-6 py-3 text-right font-semibold">${fmt(Number(o.total))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <h2 className="text-lg font-bold text-gray-900">Low Stock</h2>
          </div>
          <p className="text-xs text-gray-500 mb-4">5 units or fewer</p>
          {lowStock.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">All products well-stocked.</p>
          ) : (
            <ul className="space-y-3">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 truncate max-w-[180px]">{p.name}</span>
                  <span className={`text-xs font-bold ${p.stock === 0 ? "text-red-500" : "text-orange-500"}`}>
                    {p.stock} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    PAID: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-indigo-100 text-indigo-700",
    DELIVERED: "bg-emerald-100 text-emerald-700",
    CANCELLED: "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${colors[status] ?? colors.PENDING}`}>
      {status}
    </span>
  );
}
