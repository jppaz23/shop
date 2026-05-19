import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoreHydrator from "@/components/StoreHydrator";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shoply — Modern Commerce",
  description: "Curated products across electronics, fashion, home, and more.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body className={`${geist.className} bg-stone-50 text-stone-900 flex flex-col min-h-screen antialiased`}>
        <NextIntlClientProvider>
          <StoreHydrator />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
