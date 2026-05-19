"use client";

import Image from "next/image";
import { ShoppingCart, Menu, X, LogIn, LogOut, ShieldCheck, LayoutDashboard, Globe, Check } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";

type Labels = {
  shop: string;
  electronics: string;
  clothing: string;
  home: string;
  dashboard: string;
  admin: string;
  signIn: string;
  signOut: string;
  langs: Record<string, string>;
};

type Props = {
  labels: Labels;
  user: { name: string | null; email: string | null; image: string | null; isAdmin: boolean } | null;
  signOutAction: () => Promise<void>;
};

export default function NavbarClient({ labels, user, signOutAction }: Props) {
  const count = useCartStore((s) => s.count());
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [langMenu, setLangMenu] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (next: string) => {
    setLangMenu(false);
    router.replace(pathname, { locale: next as "es" | "en" | "pt" });
  };

  return (
    <>
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
        <Link href="/products" className="hover:text-black transition-colors">{labels.shop}</Link>
        <Link href={{ pathname: "/products", query: { category: "Electronics" } }} className="hover:text-black transition-colors">{labels.electronics}</Link>
        <Link href={{ pathname: "/products", query: { category: "Clothing" } }} className="hover:text-black transition-colors">{labels.clothing}</Link>
        <Link href={{ pathname: "/products", query: { category: "Home" } }} className="hover:text-black transition-colors">{labels.home}</Link>
        {user?.isAdmin && (
          <Link href="/admin/dashboard" className="hover:text-black transition-colors flex items-center gap-1">
            <LayoutDashboard className="w-4 h-4" /> {labels.dashboard}
          </Link>
        )}
      </nav>

      <div className="flex items-center gap-2">
        {/* Language switcher */}
        <div className="relative">
          <button
            onClick={() => setLangMenu((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold uppercase text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Language"
          >
            <Globe className="w-4 h-4" />
            <span>{locale}</span>
          </button>
          {langMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-stone-200 rounded-xl shadow-lg py-2 z-50">
              {routing.locales.map((l) => (
                <button
                  key={l}
                  onClick={() => switchLocale(l)}
                  className="w-full flex items-center justify-between px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                >
                  <span>{labels.langs[l]}</span>
                  {l === locale && <Check className="w-4 h-4 text-lime-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <Link href="/cart" className="relative p-2 text-stone-700 hover:text-black transition-colors">
          <ShoppingCart className="w-5 h-5" />
          {hasHydrated && count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-lime-400 text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-stone-50">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </Link>

        {user ? (
          <div className="relative">
            <button
              onClick={() => setUserMenu((v) => !v)}
              className="flex items-center gap-2 p-0.5 rounded-full ring-2 ring-transparent hover:ring-lime-300 transition"
            >
              {user.image ? (
                <Image src={user.image} alt={user.name ?? "user"} width={32} height={32} className="rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-black text-lime-400 font-bold text-sm flex items-center justify-center">
                  {(user.name ?? user.email ?? "?").charAt(0).toUpperCase()}
                </div>
              )}
            </button>
            {userMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 rounded-xl shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-stone-100">
                  <p className="text-sm font-semibold text-stone-900 truncate">{user.name ?? "Account"}</p>
                  <p className="text-xs text-stone-500 truncate">{user.email}</p>
                </div>
                {user.isAdmin && (
                  <>
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                    >
                      <LayoutDashboard className="w-4 h-4" /> {labels.dashboard}
                    </Link>
                    <Link
                      href="/admin"
                      onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                    >
                      <ShieldCheck className="w-4 h-4" /> {labels.admin}
                    </Link>
                  </>
                )}
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                  >
                    <LogOut className="w-4 h-4" /> {labels.signOut}
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-stone-900 bg-stone-100 hover:bg-black hover:text-lime-400 px-4 py-2 rounded-full transition-colors"
          >
            <LogIn className="w-4 h-4" /> {labels.signIn}
          </Link>
        )}

        <button className="md:hidden p-2 text-stone-700" onClick={() => setOpen(!open)} type="button">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden absolute left-0 right-0 top-16 border-t border-stone-200 bg-stone-50 px-4 py-4 flex flex-col gap-4 text-sm font-medium text-stone-700">
          <Link href="/products" onClick={() => setOpen(false)}>{labels.shop}</Link>
          <Link href={{ pathname: "/products", query: { category: "Electronics" } }} onClick={() => setOpen(false)}>{labels.electronics}</Link>
          <Link href={{ pathname: "/products", query: { category: "Clothing" } }} onClick={() => setOpen(false)}>{labels.clothing}</Link>
          <Link href={{ pathname: "/products", query: { category: "Home" } }} onClick={() => setOpen(false)}>{labels.home}</Link>
          {user?.isAdmin && <Link href="/admin/dashboard" onClick={() => setOpen(false)}>{labels.dashboard}</Link>}
          {!user && <Link href="/login" onClick={() => setOpen(false)}>{labels.signIn}</Link>}
        </div>
      )}
    </>
  );
}
