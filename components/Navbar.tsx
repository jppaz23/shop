import Link from "next/link";
import { Store } from "lucide-react";
import { auth, signOut } from "@/auth";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <Store className="w-6 h-6" />
            Shoply
          </Link>

          <NavbarClient
            user={
              session?.user
                ? {
                    name: session.user.name ?? null,
                    email: session.user.email ?? null,
                    image: session.user.image ?? null,
                    isAdmin: session.user.isAdmin,
                  }
                : null
            }
            signOutAction={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          />
        </div>
      </div>
    </header>
  );
}
