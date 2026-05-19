import Link from "next/link";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";

export const metadata = { title: "Order Confirmed - Shoply" };

const DEMO_ORDER_NUMBER = "SPL-100001";

export default function SuccessPage() {
  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-32 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-500" />
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h1>
      <p className="text-gray-500 mb-2">
        Thank you for your purchase. You&apos;ll receive a confirmation email shortly.
      </p>
      <p className="text-sm text-indigo-600 font-semibold mb-8">
        Order #{DEMO_ORDER_NUMBER}
      </p>

      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8 text-left">
        <div className="flex items-center gap-3 text-gray-700">
          <Package className="w-5 h-5 text-indigo-500 shrink-0" />
          <div>
            <p className="font-semibold text-gray-900 text-sm">Estimated Delivery</p>
            <p className="text-sm text-gray-500">5-7 business days</p>
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
