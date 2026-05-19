import { auth, signOut } from "@/auth";
import { Link } from "@/i18n/navigation";
import NavbarClient from "./NavbarClient";
import Logo from "./Logo";
import { getTranslations } from "next-intl/server";

export default async function Navbar() {
  const session = await auth();
  const t = await getTranslations("nav");
  const tLang = await getTranslations("languages");

  return (
    <header className="sticky top-0 z-50 bg-stone-50/80 backdrop-blur border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-xl text-stone-900 tracking-tight">
            <Logo className="w-8 h-8 text-black" />
            <span>
              Shop<span className="text-lime-500">.</span>ly
            </span>
          </Link>

          <NavbarClient
            labels={{
              shop: t("shop"),
              electronics: t("electronics"),
              clothing: t("clothing"),
              home: t("home"),
              dashboard: t("dashboard"),
              admin: t("admin"),
              signIn: t("signIn"),
              signOut: t("signOut"),
              langs: { es: tLang("es"), en: tLang("en"), pt: tLang("pt") },
            }}
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
