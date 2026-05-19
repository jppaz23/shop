import Image from "next/image";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/db";

export const metadata = { title: "Order Confirmed — Shoply" };
export const dynamic = "force-dynamic";

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { orderId } = await searchParams;
  const t = await getTranslations("success");
  const tCommon = await getTranslations("common");

  const order = orderId
    ? await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { product: true } } },
      })
    : null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-lime-600" />
        </div>
        <h1 className="text-4xl font-black text-stone-950 mb-2 tracking-tight">{t("title")}</h1>
        <p className="text-stone-500 mb-2">{t("subtitle")}</p>
        {order && (
          <p className="text-sm text-black font-semibold">
            {t("orderNumber", { id: order.id.slice(-8).toUpperCase() })}
          </p>
        )}
      </div>

      {order && (
        <div className="bg-white rounded-2xl ring-1 ring-stone-200 p-6 mb-6">
          <h2 className="font-black text-stone-950 mb-4 tracking-tight">{t("orderSummary")}</h2>
          <div className="space-y-4">
            {order.items.map((it) => (
              <div key={it.id} className="flex gap-3 items-center">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                  <Image src={it.product.image} alt={it.name} fill className="object-cover" sizes="48px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-900 truncate">{it.name}</p>
                  <p className="text-xs text-stone-400">Qty: {it.quantity}</p>
                </div>
                <span className="text-sm font-bold text-stone-900">${fmt(Number(it.price) * it.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-stone-200 mt-6 pt-4 space-y-2 text-sm text-stone-600">
            <div className="flex justify-between"><span>Subtotal</span><span>${fmt(Number(order.subtotal))}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{Number(order.shipping) === 0 ? tCommon("free") : `$${fmt(Number(order.shipping))}`}</span></div>
            <div className="flex justify-between font-bold text-stone-950 text-base pt-2 border-t border-stone-200"><span>Total</span><span>${fmt(Number(order.total))}</span></div>
          </div>
          <div className="mt-6 pt-6 border-t border-stone-200 text-sm text-stone-600">
            <p className="font-semibold text-stone-900 mb-1">{t("shippingTo")}</p>
            <p>{order.name}</p>
            <p>{order.address}</p>
            <p>{order.city}, {order.postalCode}, {order.country}</p>
          </div>
        </div>
      )}

      <div className="bg-stone-100 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3 text-stone-700">
          <Package className="w-5 h-5 text-lime-600 shrink-0" />
          <div>
            <p className="font-semibold text-stone-900 text-sm">{t("estDelivery")}</p>
            <p className="text-sm text-stone-500">{t("deliveryWindow")}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/products"
          className="inline-flex items-center justify-center gap-2 bg-black hover:bg-stone-800 text-white font-bold px-8 py-3 rounded-full transition-colors"
        >
          {t("continueShopping")} <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center text-stone-700 font-semibold px-8 py-3 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors"
        >
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}
