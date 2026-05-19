import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, RotateCcw, Shield } from "lucide-react";
import { getFeaturedProducts } from "@/lib/queries";
import ProductCard from "@/components/ProductCard";

const categories = [
  { name: "Electronics", image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&q=80" },
  { name: "Clothing", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80" },
  { name: "Home", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80" },
  { name: "Sports", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80" },
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await getFeaturedProducts(4);

  return (
    <div className="flex flex-col">
      <section className="relative bg-gradient-to-br from-indigo-950 via-indigo-800 to-violet-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=60')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-40">
          <div className="max-w-2xl">
            <span className="inline-block bg-white/20 backdrop-blur text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              New arrivals every week
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              Discover Products<br />You&apos;ll Actually Love
            </h1>
            <p className="text-lg text-indigo-200 mb-10 max-w-lg">
              Curated selection of electronics, fashion, home goods, and more — with transparent pricing and fast shipping.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-full hover:bg-indigo-50 transition-colors"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products?category=Electronics"
                className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors"
              >
                Electronics
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm font-medium">
          <div className="flex items-center justify-center gap-2">
            <Truck className="w-4 h-4" /> Free shipping over $50
          </div>
          <div className="flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> 30-day free returns
          </div>
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" /> Secure checkout
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Featured Products</h2>
              <p className="text-gray-500 mt-1">Handpicked by our team</p>
            </div>
            <Link href="/products" className="text-indigo-600 font-semibold text-sm flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-10 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/products?category=${cat.name}`}
                className="group relative rounded-2xl overflow-hidden aspect-square shadow-sm hover:shadow-lg transition-shadow"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white font-bold text-lg">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-10 lg:p-16 text-white flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-extrabold mb-2">Get 15% off your first order</h2>
            <p className="text-indigo-200">Use code WELCOME15 at checkout. No minimum order required.</p>
          </div>
          <Link
            href="/products"
            className="shrink-0 bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-full hover:bg-indigo-50 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </section>
    </div>
  );
}
