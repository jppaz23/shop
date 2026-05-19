import Image from "next/image";
import { ArrowUpRight, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getFeaturedProducts } from "@/lib/queries";
import ProductCard from "@/components/ProductCard";

const categories = [
  { name: "Electronics", image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&q=80" },
  { name: "Clothing", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80" },
  { name: "Home", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80" },
  { name: "Sports", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80" },
];

export const dynamic = "force-dynamic";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const featured = await getFeaturedProducts(4);

  return (
    <div className="flex flex-col">
      <section className="relative bg-stone-50 overflow-hidden border-b border-stone-200">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-lime-300/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-stone-900/5 blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-black text-lime-400 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
              {t("badge")}
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight text-stone-950 mb-8">
              {t("title1")}<br />
              <span className="italic font-serif text-stone-700">{t("titleHighlight")}</span> {t("title2")}
            </h1>
            <p className="text-lg text-stone-600 mb-10 max-w-xl leading-relaxed">
              {t("subtitle")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 bg-black text-white font-semibold px-7 py-3.5 rounded-full hover:bg-stone-800 transition-colors"
              >
                {t("ctaShop")}
                <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              </Link>
              <Link
                href={{ pathname: "/products", query: { category: "Electronics" } }}
                className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-900 font-semibold px-7 py-3.5 rounded-full transition-colors"
              >
                {t("ctaElectronics")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black text-stone-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs font-medium uppercase tracking-widest">
          <div className="flex items-center justify-center gap-2">
            <Truck className="w-4 h-4 text-lime-400" /> {t("trustShipping")}
          </div>
          <div className="flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4 text-lime-400" /> {t("trustReturns")}
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-lime-400" /> {t("trustSecure")}
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-lime-600">{t("featuredKicker")}</span>
              <h2 className="text-4xl font-black text-stone-950 mt-2 tracking-tight">{t("featuredTitle")}</h2>
            </div>
            <Link href="/products" className="group text-stone-900 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              {t("viewAll")}
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-white border-y border-stone-200 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-lime-600">{t("categoryKicker")}</span>
            <h2 className="text-4xl font-black text-stone-950 mt-2 tracking-tight">{t("categoryTitle")}</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={{ pathname: "/products", query: { category: cat.name } }}
                className="group relative rounded-2xl overflow-hidden aspect-square ring-1 ring-stone-200 hover:ring-black transition-all"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <span className="text-white font-bold text-lg tracking-tight">{cat.name}</span>
                  <ArrowUpRight className="w-5 h-5 text-lime-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative bg-black rounded-3xl p-10 lg:p-16 text-white overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-lime-500/20 blur-3xl" />
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-lime-400">{t("ctaBannerKicker")}</span>
              <h2 className="text-3xl lg:text-4xl font-black mt-2 tracking-tight">{t("ctaBannerTitle")}</h2>
              <p className="text-stone-400 mt-2">{t("ctaBannerSub")}</p>
            </div>
            <Link
              href="/products"
              className="shrink-0 inline-flex items-center gap-2 bg-lime-400 hover:bg-lime-300 text-black font-bold px-7 py-3.5 rounded-full transition-colors"
            >
              {t("ctaBannerButton")} <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
