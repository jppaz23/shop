"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { CreditCard, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Step = "info" | "shipping" | "payment" | "review";

const STEPS: { id: Step; label: string }[] = [
  { id: "info", label: "Info" },
  { id: "shipping", label: "Shipping" },
  { id: "payment", label: "Payment" },
  { id: "review", label: "Review" },
];

export default function CheckoutPage() {
  const { items, hasHydrated, total, clearCart } = useCartStore();
  const router = useRouter();
  const [step, setStep] = useState<Step>("info");
  const [placing, setPlacing] = useState(false);

  const [form, setForm] = useState({
    email: "", firstName: "", lastName: "", address: "", city: "", state: "", zip: "", country: "US",
    shippingMethod: "standard",
    cardNumber: "", cardName: "", cardExpiry: "", cardCvv: "",
  });

  const subtotal = total();
  const shipping = form.shippingMethod === "express" ? 14.99 : subtotal >= 50 ? 0 : 7.99;
  const tax = subtotal * 0.08;
  const orderTotal = subtotal + shipping + tax;

  const field = (name: keyof typeof form, label: string, placeholder?: string, type = "text") => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder ?? label}
        value={form[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
    </div>
  );

  const placeOrder = async () => {
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 1800));
    clearCart();
    router.push("/checkout/success");
  };

  if (!hasHydrated) {
    return (
      <div className="max-w-lg mx-auto px-4 py-32 text-center">
        <p className="text-gray-500">Loading checkout...</p>
      </div>
    );
  }

  if (items.length === 0 && !placing) {
    return (
      <div className="max-w-lg mx-auto px-4 py-32 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link href="/products" className="text-indigo-600 font-semibold hover:underline">Browse products</Link>
      </div>
    );
  }

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>

      {/* Progress */}
      <div className="flex items-center mb-10">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
              i < stepIndex ? "bg-indigo-600 text-white" : i === stepIndex ? "bg-indigo-600 text-white ring-4 ring-indigo-100" : "bg-gray-200 text-gray-500"
            }`}>{i + 1}</div>
            <span className={`ml-2 text-sm font-medium hidden sm:inline ${i === stepIndex ? "text-indigo-600" : "text-gray-400"}`}>{s.label}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-3 ${i < stepIndex ? "bg-indigo-600" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {step === "info" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {field("email", "Email", "you@example.com", "email")}
                <div className="col-span-full sm:col-span-1 hidden" />
                {field("firstName", "First Name")}
                {field("lastName", "Last Name")}
                {field("address", "Address", "123 Main St")}
                {field("city", "City")}
                {field("state", "State / Province")}
                {field("zip", "ZIP / Postal Code")}
              </div>
              <button
                onClick={() => setStep("shipping")}
                className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Continue to Shipping
              </button>
            </div>
          )}

          {step === "shipping" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold mb-6">Shipping Method</h2>
              <div className="space-y-3">
                {[
                  { id: "standard", label: "Standard Shipping", sub: "5–7 business days", price: subtotal >= 50 ? "Free" : "$7.99" },
                  { id: "express", label: "Express Shipping", sub: "2–3 business days", price: "$14.99" },
                  { id: "overnight", label: "Overnight", sub: "Next business day", price: "$29.99" },
                ].map((opt) => (
                  <label key={opt.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${form.shippingMethod === opt.id ? "border-indigo-600 bg-indigo-50" : "border-gray-200 hover:border-indigo-200"}`}>
                    <input type="radio" name="shipping" value={opt.id} checked={form.shippingMethod === opt.id} onChange={() => setForm({ ...form, shippingMethod: opt.id })} className="accent-indigo-600" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm">{opt.label}</div>
                      <div className="text-xs text-gray-500">{opt.sub}</div>
                    </div>
                    <span className="font-bold text-gray-900 text-sm">{opt.price}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep("info")} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">Back</button>
                <button onClick={() => setStep("payment")} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors">Continue to Payment</button>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold mb-2">Payment</h2>
              <p className="text-xs text-gray-400 mb-6 flex items-center gap-1"><Lock className="w-3 h-3" /> Secured with 256-bit SSL encryption. This is a demo — no real charge.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-full">{field("cardNumber", "Card Number", "1234 5678 9012 3456")}</div>
                <div className="col-span-full">{field("cardName", "Name on Card")}</div>
                {field("cardExpiry", "Expiry Date", "MM/YY")}
                {field("cardCvv", "CVV", "123")}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep("shipping")} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">Back</button>
                <button onClick={() => setStep("review")} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors">Review Order</button>
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold mb-6">Review Your Order</h2>
              <div className="space-y-4 mb-6">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-3 items-center">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <Image src={product.image} alt={product.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-400">Qty: {quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-900">${(product.price * quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100"><span>Total</span><span>${orderTotal.toFixed(2)}</span></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep("payment")} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">Back</button>
                <button
                  onClick={placeOrder}
                  disabled={placing}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  {placing ? "Placing Order…" : `Place Order — $${orderTotal.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mini summary */}
        <div className="bg-gray-50 rounded-2xl p-5 h-fit border border-gray-100 text-sm">
          <h3 className="font-bold text-gray-900 mb-4">Order ({items.length} items)</h3>
          <div className="space-y-3 mb-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-gray-600">
                <span className="truncate max-w-[160px]">{product.name} × {quantity}</span>
                <span className="font-medium text-gray-900 shrink-0 ml-2">${(product.price * quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900">
            <span>Total</span><span>${orderTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
