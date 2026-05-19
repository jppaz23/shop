import { Link } from "@/i18n/navigation";
import Logo from "./Logo";
import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="bg-stone-950 text-stone-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 text-white font-extrabold text-lg mb-3 tracking-tight">
              <Logo className="w-7 h-7 text-white" />
              <span>Shop<span className="text-lime-400">.</span>ly</span>
            </Link>
            <p className="text-sm text-stone-500">{t("tagline")}</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">{t("shop")}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-lime-400 transition-colors">{t("allProducts")}</Link></li>
              <li><Link href={{ pathname: "/products", query: { category: "Electronics" } }} className="hover:text-lime-400 transition-colors">Electronics</Link></li>
              <li><Link href={{ pathname: "/products", query: { category: "Clothing" } }} className="hover:text-lime-400 transition-colors">Clothing</Link></li>
              <li><Link href={{ pathname: "/products", query: { category: "Home" } }} className="hover:text-lime-400 transition-colors">Home & Kitchen</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">{t("support")}</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="cursor-default">{t("shippingPolicy")}</span></li>
              <li><span className="cursor-default">{t("returns")}</span></li>
              <li><span className="cursor-default">{t("trackOrder")}</span></li>
              <li><span className="cursor-default">{t("faq")}</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">{t("company")}</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="cursor-default">{t("about")}</span></li>
              <li><span className="cursor-default">{t("blog")}</span></li>
              <li><Link href="/admin" className="hover:text-lime-400 transition-colors">Admin</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-stone-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <span>© {new Date().getFullYear()} Shoply. {t("rights")}</span>
          <span>{t("builtWith")}</span>
        </div>
      </div>
    </footer>
  );
}
