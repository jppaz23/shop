import { signIn, auth } from "@/auth";
import { redirect } from "@/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("login");
  const session = await auth();
  const { callbackUrl } = await searchParams;
  if (session?.user) {
    redirect({ href: callbackUrl ?? "/", locale });
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white ring-1 ring-stone-200 rounded-2xl p-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-lime-600">{t("kicker")}</span>
        <h1 className="text-3xl font-black text-stone-950 mb-3 mt-2 tracking-tight">{t("title")}</h1>
        <p className="text-sm text-stone-500 mb-8 leading-relaxed">{t("subtitle")}</p>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: callbackUrl ?? `/${locale}` });
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 bg-black hover:bg-stone-800 text-white font-semibold py-3.5 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#FFFFFF" d="M21.35 11.1H12v3.2h5.35c-.23 1.4-1.65 4.1-5.35 4.1-3.22 0-5.85-2.66-5.85-5.95s2.63-5.95 5.85-5.95c1.83 0 3.06.78 3.76 1.45l2.57-2.47C16.81 4.05 14.6 3 12 3 6.98 3 3 6.98 3 12s3.98 9 9 9c5.18 0 8.6-3.64 8.6-8.77 0-.59-.07-1.05-.25-1.13z" />
            </svg>
            {t("continueGoogle")}
          </button>
        </form>
        <p className="text-xs text-stone-400 text-center mt-6">{t("terms")}</p>
      </div>
    </div>
  );
}
