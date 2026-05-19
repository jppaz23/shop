"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store";

export default function CartPage() {
  const { items, hasHydrated, removeItem, updateQuantity, total } = useCartStore();

  if (!hasHydrated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading your cart</h1>
        <p className="text-gray-500">Checking saved items...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/products" className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
          Start Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const subtotal = total();
  const shipping = subtotal >= 50 ? 0 : 7.99;
  const tax = subtotal * 0.08;
  const orderTotal = subtotal + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-10">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <Link href={`/products/${product.id}`} className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                <Image src={product.image} alt={product.name} fill className="object-cover" sizes="96px" />
              </Link>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <Link href={`/products/${product.id}`} className="font-semibold text-gray-900 text-sm leading-snug hover:text-indigo-600 line-clamp-2">
                    {product.name}
                  </Link>
                  <button onClick={() => removeItem(product.id)} className="text-gray-300 hover:text-red-500 transition-colors shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-indigo-600 mt-1">{product.category}</span>
                <div className="flex items-center justify-between mt-auto pt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button className="px-2.5 py-1 text-gray-500 hover:bg-gray-50" onClick={() => updateQuantity(product.id, quantity - 1)}>−</button>
                    <span className="px-3 py-1 text-sm font-semibold">{quantity}</span>
                    <button className="px-2.5 py-1 text-gray-500 hover:bg-gray-50" onClick={() => updateQuantity(product.id, quantity + 1)}>+</button>
                  </div>
                  <span className="font-bold text-gray-900">${(product.price * quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-2xl p-6 h-fit shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (8%)</span><span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900 text-base">
              <span>Total</span><span>${orderTotal.toFixed(2)}</span>
            </div>
          </div>
          {shipping > 0 && (
            <p className="text-xs text-gray-400 mt-3">Add ${(50 - subtotal).toFixed(2)} more for free shipping.</p>
          )}
          <Link
            href="/checkout"
            className="mt-6 flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/products" className="mt-3 flex items-center justify-center text-sm text-gray-500 hover:text-indigo-600 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
