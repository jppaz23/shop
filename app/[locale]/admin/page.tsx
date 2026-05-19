import { redirect } from "@/i18n/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { serializeProduct } from "@/lib/products";
import { setRequestLocale, getTranslations } from "next-intl/server";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const session = await auth();
  if (!session?.user) {
    redirect({ href: "/login?callbackUrl=/admin", locale });
    return null;
  }
  if (!session.user.isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-black text-stone-950 mb-2 tracking-tight">{t("accessDenied")}</h1>
        <p className="text-stone-500 text-sm">
          {t("accessDeniedDesc", { email: session.user.email ?? "" })}
        </p>
      </div>
    );
  }

  const rows = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  const products = rows.map(serializeProduct);
  return <AdminClient products={products} />;
}
