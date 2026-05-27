import Link from "next/link";
import { signOut, auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-segueme-cream">
      <header className="border-b border-segueme-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="font-display text-lg font-semibold text-segueme-ink"
            >
              Painel · Segue-Me
            </Link>
            <nav className="hidden gap-5 text-sm text-segueme-muted sm:flex">
              <Link href="/admin/teatros" className="hover:text-segueme-ink">
                Teatros
              </Link>
              <Link href="/admin/roteiros" className="hover:text-segueme-ink">
                Roteiros
              </Link>
              <Link href="/" className="hover:text-segueme-ink">
                Ver site →
              </Link>
            </nav>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="text-xs text-segueme-muted hover:text-segueme-ink"
            >
              Sair
            </button>
          </form>
        </div>
        <nav className="flex gap-5 border-t border-segueme-line px-4 py-2 text-sm text-segueme-muted sm:hidden">
          <Link href="/admin/teatros">Teatros</Link>
          <Link href="/admin/roteiros">Roteiros</Link>
          <Link href="/">Ver site →</Link>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
