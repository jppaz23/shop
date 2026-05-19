import Link from "next/link";
import { Store } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <Store className="w-5 h-5 text-indigo-400" />
              Shoply
            </Link>
            <p className="text-sm">Curated products, honest prices, fast shipping.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/products?category=Electronics" className="hover:text-white transition-colors">Electronics</Link></li>
              <li><Link href="/products?category=Clothing" className="hover:text-white transition-colors">Clothing</Link></li>
              <li><Link href="/products?category=Home" className="hover:text-white transition-colors">Home & Kitchen</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="cursor-default">Shipping Policy</span></li>
              <li><span className="cursor-default">Returns & Exchanges</span></li>
              <li><span className="cursor-default">Track Your Order</span></li>
              <li><span className="cursor-default">FAQ</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="cursor-default">About Us</span></li>
              <li><span className="cursor-default">Blog</span></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Admin</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-center">
          © {new Date().getFullYear()} Shoply. Built with Next.js + Tailwind CSS.
        </div>
      </div>
    </footer>
  );
}
