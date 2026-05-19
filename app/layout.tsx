import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoreHydrator from "@/components/StoreHydrator";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shoply - Modern Commerce",
  description:
    "Discover curated products across electronics, fashion, home, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geist.className} bg-white text-gray-900 flex flex-col min-h-screen`}
      >
        <StoreHydrator />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
