"use client";

import { useState } from "react";
import Image from "next/image";
import { CreditCard, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useCartStore } from "@/lib/store";
import { placeOrder } from "./actions";

type Step = "info" | "shipping" | "payment" | "review";
const STEPS: Step[] = ["info", "shipping", "payment", "review"];

export default function CheckoutPage() {
  const { items, hasHydrated, total, clearCart } = useCartStore();
  const router = useRouter();
  const [step, setStep] = useState<Step>("info");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("checkout");
  const tCommon = useTranslations("common");
  const tCart = useTranslations("cart");

  const [form, setForm] = useState({
    email: "", firstName: "", lastName: "", address: "", city: "", state: "", zip: "", country: "US",
    shippingMethod: "standard" as "standard" | "express" | "overnight",
    cardNumber: "", cardName: "", cardExpiry: "", cardCvv: "",
  });

  const subtotal = total();
  const shipping = form.shippingMethod === "overnight" ? 29.99 : form.shippingMethod === "express" ? 14.99 : subtotal >= 50 ? 0 : 7.99;
  const tax = subtotal * 0.08;
  const orderTotal = subtotal + shipping + tax;

  const field = (name: keyof typeof form, label: string, placeholder?: string, type = "text") => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-stone-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder ?? label}
        value={form[name] as string}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        className="border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
      />
    </div>
  );

  const submit = async () => {
    setError(null);
    setPlacing(true);
    try {
      const cart = items.map((i) => ({ productId: i.product.id, quantity: i.quantity }));
      const res = await placeOrder(
        {
          email: form.email,
          name: `${form.firstName} ${form.lastName}`.trim(),
          address: form.address,
          city: form.city,
          country: form.country,
          postalCode: form.zip,
          shippingMethod: form.shippingMethod,
        },
        cart,
      );
      clearCart();
      router.push(`/checkout/success?orderId=${res.orderId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to place order");
      setPlacing(false);
    }
  };

  if (!hasHydrated) {
    return (
      <div className="max-w-lg mx-auto px-4 py-32 text-center">
        <p className="text-stone-500">{tCommon("loading")}</p>
      </div>
    );
  }

  if (items.length === 0 && !placing) {
    return (
      <div className="max-w-lg mx-auto px-4 py-32 text-center">
        <p className="text-stone-500 mb-4">{tCart("empty")}</p>
        <Link href="/products" className="text-black font-semibold hover:underline">{tCart("startShopping")}</Link>
      </div>
    );
  }

  const stepIndex = STEPS.indexOf(step);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <span className="text-xs font-semibold uppercase tracking-widest text-lime-600">{t("title")}</span>
      <h1 className="text-4xl font-black text-stone-950 tracking-tight mb-10 mt-2">{t("title")}</h1>

      <div className="flex items-center mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
              i < stepIndex ? "bg-black text-white" : i === stepIndex ? "bg-black text-white ring-4 ring-stone-300" : "bg-stone-200 text-stone-500"
            }`}>{i + 1}</div>
            <span className={`ml-2 text-sm font-medium hidden sm:inline ${i === stepIndex ? "text-black" : "text-stone-400"}`}>{t(`steps.${s}` as "steps.info")}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-3 ${i < stepIndex ? "bg-black" : "bg-stone-200"}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {step === "info" && (
            <div className="bg-white rounded-2xl ring-1 ring-stone-200 p-6">
              <h2 className="text-lg font-black mb-6 tracking-tight">{t("contact")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {field("email", t("email"), "you@example.com", "email")}
                <div className="hidden sm:block" />
                {field("firstName", t("firstName"))}
                {field("lastName", t("lastName"))}
                {field("address", t("address"), "123 Main St")}
                {field("city", t("city"))}
                {field("state", t("state"))}
                {field("zip", t("zip"))}
              </div>
              <button
                onClick={() => setStep("shipping")}
                className="mt-6 w-full bg-black hover:bg-stone-800 text-white font-bold py-3 rounded-full transition-colors"
              >
                {t("continueShipping")}
              </button>
            </div>
          )}

          {step === "shipping" && (
            <div className="bg-white rounded-2xl ring-1 ring-stone-200 p-6">
              <h2 className="text-lg font-black mb-6 tracking-tight">{t("shippingMethod")}</h2>
              <div className="space-y-3">
                {[
                  { id: "standard" as const, label: t("standard"), sub: t("standardSub"), price: subtotal >= 50 ? tCommon("free") : "$7.99" },
                  { id: "express" as const, label: t("express"), sub: t("expressSub"), price: "$14.99" },
                  { id: "overnight" as const, label: t("overnight"), sub: t("overnightSub"), price: "$29.99" },
                ].map((opt) => (
                  <label key={opt.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${form.shippingMethod === opt.id ? "border-black bg-stone-50" : "border-stone-200 hover:border-stone-400"}`}>
                    <input type="radio" name="shipping" value={opt.id} checked={form.shippingMethod === opt.id} onChange={() => setForm({ ...form, shippingMethod: opt.id })} className="accent-black" />
                    <div className="flex-1">
                      <div className="font-semibold text-stone-900 text-sm">{opt.label}</div>
                      <div className="text-xs text-stone-500">{opt.sub}</div>
                    </div>
                    <span className="font-bold text-stone-900 text-sm">{opt.price}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep("info")} className="flex-1 border border-stone-200 text-stone-600 font-semibold py-3 rounded-full hover:bg-stone-50 transition-colors">{t("back")}</button>
                <button onClick={() => setStep("payment")} className="flex-1 bg-black hover:bg-stone-800 text-white font-bold py-3 rounded-full transition-colors">{t("continuePayment")}</button>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="bg-white rounded-2xl ring-1 ring-stone-200 p-6">
              <h2 className="text-lg font-black mb-2 tracking-tight">{t("payment")}</h2>
              <p className="text-xs text-stone-400 mb-6 flex items-center gap-1"><Lock className="w-3 h-3" /> {t("paymentNote")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-full">{field("cardNumber", t("cardNumber"), "1234 5678 9012 3456")}</div>
                <div className="col-span-full">{field("cardName", t("cardName"))}</div>
                {field("cardExpiry", t("cardExpiry"), "MM/YY")}
                {field("cardCvv", t("cardCvv"), "123")}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep("shipping")} className="flex-1 border border-stone-200 text-stone-600 font-semibold py-3 rounded-full hover:bg-stone-50 transition-colors">{t("back")}</button>
                <button onClick={() => setStep("review")} className="flex-1 bg-black hover:bg-stone-800 text-white font-bold py-3 rounded-full transition-colors">{t("reviewOrder")}</button>
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="bg-white rounded-2xl ring-1 ring-stone-200 p-6">
              <h2 className="text-lg font-black mb-6 tracking-tight">{t("review")}</h2>
              <div className="space-y-4 mb-6">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-3 items-center">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                      <Image src={product.image} alt={product.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-stone-900 truncate">{product.name}</p>
                      <p className="text-xs text-stone-400">{t("qty")}: {quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-stone-900">${(product.price * quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-stone-200 pt-4 space-y-2 text-sm text-stone-600">
                <div className="flex justify-between"><span>{tCart("subtotal")}</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>{tCart("shipping")}</span><span>{shipping === 0 ? tCommon("free") : `$${shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between"><span>{tCart("tax")}</span><span>${tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-stone-950 text-base pt-2 border-t border-stone-200"><span>{tCart("total")}</span><span>${orderTotal.toFixed(2)}</span></div>
              </div>
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
              )}
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep("payment")} disabled={placing} className="flex-1 border border-stone-200 text-stone-600 font-semibold py-3 rounded-full hover:bg-stone-50 transition-colors disabled:opacity-50">{t("back")}</button>
                <button
                  onClick={submit}
                  disabled={placing}
                  className="flex-1 bg-black hover:bg-stone-800 disabled:bg-stone-400 text-white font-bold py-3 rounded-full transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  {placing ? t("placing") : t("placeOrder", { total: orderTotal.toFixed(2) })}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white ring-1 ring-stone-200 rounded-2xl p-5 h-fit text-sm">
          <h3 className="font-black text-stone-950 mb-4 tracking-tight">{t("orderSummary", { count: items.length })}</h3>
          <div className="space-y-3 mb-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-stone-600">
                <span className="truncate max-w-[160px]">{product.name} × {quantity}</span>
                <span className="font-medium text-stone-900 shrink-0 ml-2">${(product.price * quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-stone-200 pt-3 flex justify-between font-bold text-stone-950">
            <span>{tCart("total")}</span><span>${orderTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
