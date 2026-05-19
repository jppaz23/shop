"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, LogIn, LogOut, ShieldCheck, LayoutDashboard } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useState } from "react";

type Props = {
  user: { name: string | null; email: string | null; image: string | null; isAdmin: boolean } | null;
  signOutAction: () => Promise<void>;
};

export default function NavbarClient({ user, signOutAction }: Props) {
  const count = useCartStore((s) => s.count());
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  return (
    <>
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <Link href="/products" className="hover:text-indigo-600 transition-colors">Shop</Link>
        <Link href="/products?category=Electronics" className="hover:text-indigo-600 transition-colors">Electronics</Link>
        <Link href="/products?category=Clothing" className="hover:text-indigo-600 transition-colors">Clothing</Link>
        <Link href="/products?category=Home" className="hover:text-indigo-600 transition-colors">Home</Link>
        {user?.isAdmin && (
          <Link href="/admin/dashboard" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
        )}
      </nav>

      <div className="flex items-center gap-3">
        <Link href="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
          <ShoppingCart className="w-6 h-6" />
          {hasHydrated && count > 0 && (
            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </Link>

        {user ? (
          <div className="relative">
            <button
              onClick={() => setUserMenu((v) => !v)}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-indigo-200 transition"
            >
              {user.image ? (
                <Image src={user.image} alt={user.name ?? "user"} width={32} height={32} className="rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center">
                  {(user.name ?? user.email ?? "?").charAt(0).toUpperCase()}
                </div>
              )}
            </button>
            {userMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.name ?? "Account"}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                {user.isAdmin && (
                  <>
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link
                      href="/admin"
                      onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <ShieldCheck className="w-4 h-4" /> Admin
                    </Link>
                  </>
                )}
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-indigo-600"
          >
            <LogIn className="w-4 h-4" /> Sign in
          </Link>
        )}

        <button className="md:hidden p-2 text-gray-600" onClick={() => setOpen(!open)} type="button">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden absolute left-0 right-0 top-16 border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4 text-sm font-medium text-gray-700">
          <Link href="/products" onClick={() => setOpen(false)}>Shop All</Link>
          <Link href="/products?category=Electronics" onClick={() => setOpen(false)}>Electronics</Link>
          <Link href="/products?category=Clothing" onClick={() => setOpen(false)}>Clothing</Link>
          <Link href="/products?category=Home" onClick={() => setOpen(false)}>Home</Link>
          {user?.isAdmin && <Link href="/admin/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>}
          {!user && <Link href="/login" onClick={() => setOpen(false)}>Sign in</Link>}
        </div>
      )}
    </>
  );
}
