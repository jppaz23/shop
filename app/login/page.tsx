import { signIn, auth } from "@/auth";
import { redirect } from "next/navigation";
import { LogIn } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const { callbackUrl } = await searchParams;
  if (session?.user) {
    redirect(callbackUrl ?? "/");
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Sign in to Shoply</h1>
        <p className="text-sm text-gray-500 mb-8">
          Use your Google account to track orders and access admin tools.
        </p>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: callbackUrl ?? "/" });
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            <LogIn className="w-4 h-4" /> Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
}
