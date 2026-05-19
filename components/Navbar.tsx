"use client";

import Link from "next/link";
import { ShoppingCart, Store, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useState } from "react";

export default function Navbar() {
  const count = useCartStore((s) => s.count());
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-indigo-600"
          >
            <Store className="w-6 h-6" />
            Shoply
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link href="/products" className="hover:text-indigo-600 transition-colors">
              Shop
            </Link>
            <Link
              href="/products?category=Electronics"
              className="hover:text-indigo-600 transition-colors"
            >
              Electronics
            </Link>
            <Link
              href="/products?category=Clothing"
              className="hover:text-indigo-600 transition-colors"
            >
              Clothing
            </Link>
            <Link
              href="/products?category=Home"
              className="hover:text-indigo-600 transition-colors"
            >
              Home
            </Link>
            <Link href="/admin" className="hover:text-indigo-600 transition-colors">
              Admin
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {hasHydrated && count > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setOpen(!open)}
              type="button"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4 text-sm font-medium text-gray-700">
          <Link href="/products" onClick={() => setOpen(false)}>
            Shop All
          </Link>
          <Link href="/products?category=Electronics" onClick={() => setOpen(false)}>
            Electronics
          </Link>
          <Link href="/products?category=Clothing" onClick={() => setOpen(false)}>
            Clothing
          </Link>
          <Link href="/products?category=Home" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link href="/admin" onClick={() => setOpen(false)}>
            Admin
          </Link>
        </div>
      )}
    </header>
  );
}
