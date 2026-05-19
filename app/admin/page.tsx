import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { serializeProduct } from "@/lib/products";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (!session.user.isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Access denied</h1>
        <p className="text-gray-500 text-sm">
          You are signed in as <span className="font-semibold">{session.user.email}</span>, but this account does not have admin privileges.
        </p>
      </div>
    );
  }

  const rows = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  const products = rows.map(serializeProduct);
  return <AdminClient products={products} />;
}
