import Link from "next/link";
import { buscarConfiguracao } from "@/lib/db/queries";
import { LogoSegueMe } from "@/components/logo-segueme";

export async function Header() {
  const config = await buscarConfiguracao();

  return (
    <header className="border-b border-segueme-line bg-segueme-cream">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          {config.logoDataUri ? (
            <img
              src={config.logoDataUri}
              className="h-10 w-10 object-contain"
              alt="Animação Segue-Me"
            />
          ) : (
            <LogoSegueMe className="h-10 w-10" />
          )}
          <div className="leading-tight">
            <p className="font-display text-lg font-semibold text-segueme-ink">
              Segue-Me
            </p>
            <p className="text-xs text-segueme-muted">Equipe da Animação</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
