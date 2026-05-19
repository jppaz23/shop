"use client";

import Image from "next/image";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/lib/store";

export default function CartPage() {
  const { items, hasHydrated, removeItem, updateQuantity, total } = useCartStore();
  const t = useTranslations("cart");
  const tCommon = useTranslations("common");

  if (!hasHydrated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-6" />
        <h1 className="text-2xl font-black text-stone-900 mb-2">{t("title")}</h1>
        <p className="text-stone-500">{tCommon("loading")}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-6" />
        <h1 className="text-2xl font-black text-stone-900 mb-2">{t("empty")}</h1>
        <p className="text-stone-500 mb-8">{t("emptyDesc")}</p>
        <Link href="/products" className="inline-flex items-center gap-2 bg-black hover:bg-stone-800 text-white font-bold px-8 py-3.5 rounded-full transition-colors">
          {t("startShopping")} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const subtotal = total();
  const shipping = subtotal >= 50 ? 0 : 7.99;
  const tax = subtotal * 0.08;
  const orderTotal = subtotal + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <span className="text-xs font-semibold uppercase tracking-widest text-lime-600">{t("kicker")}</span>
      <h1 className="text-4xl font-black text-stone-950 tracking-tight mb-10 mt-2">{t("title")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 bg-white ring-1 ring-stone-200 rounded-2xl p-4 hover:ring-black transition-colors">
              <Link href={`/products/${product.id}`} className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-stone-100">
                <Image src={product.image} alt={product.name} fill className="object-cover" sizes="96px" />
              </Link>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <Link href={`/products/${product.id}`} className="font-semibold text-stone-900 text-sm leading-snug hover:text-black line-clamp-2">
                    {product.name}
                  </Link>
                  <button onClick={() => removeItem(product.id)} className="text-stone-300 hover:text-red-500 transition-colors shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[10px] text-stone-500 mt-1 uppercase tracking-widest font-semibold">{product.category}</span>
                <div className="flex items-center justify-between mt-auto pt-3">
                  <div className="flex items-center bg-stone-100 rounded-full overflow-hidden">
                    <button className="px-3 py-1 text-stone-600 hover:bg-stone-200 transition-colors" onClick={() => updateQuantity(product.id, quantity - 1)}>−</button>
                    <span className="px-3 py-1 text-sm font-semibold">{quantity}</span>
                    <button className="px-3 py-1 text-stone-600 hover:bg-stone-200 transition-colors" onClick={() => updateQuantity(product.id, quantity + 1)}>+</button>
                  </div>
                  <span className="font-bold text-stone-900">${(product.price * quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white ring-1 ring-stone-200 rounded-2xl p-6 h-fit">
          <h2 className="text-lg font-black text-stone-950 mb-6 tracking-tight">{t("summary")}</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-stone-600">
              <span>{t("subtotal")}</span><span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>{t("shipping")}</span>
              <span>{shipping === 0 ? <span className="text-lime-600 font-bold uppercase text-xs tracking-wider">{tCommon("free")}</span> : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>{t("tax")}</span><span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-stone-200 pt-3 flex justify-between font-bold text-stone-950 text-base">
              <span>{t("total")}</span><span>${orderTotal.toFixed(2)}</span>
            </div>
          </div>
          {shipping > 0 && (
            <p className="text-xs text-stone-500 mt-3">{t("freeShippingHint", { amount: (50 - subtotal).toFixed(2) })}</p>
          )}
          <Link
            href="/checkout"
            className="mt-6 flex items-center justify-center gap-2 w-full bg-black hover:bg-stone-800 text-white font-bold py-3.5 rounded-full transition-colors"
          >
            {t("checkout")} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/products" className="mt-3 flex items-center justify-center text-sm text-stone-500 hover:text-black transition-colors">
            {t("continueShopping")}
          </Link>
        </div>
      </div>
    </div>
  );
}
