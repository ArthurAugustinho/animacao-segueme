import Link from "next/link";
import { db } from "@/lib/db";
import { teatros, roteiros } from "@/lib/db/schema";
import { count } from "drizzle-orm";
import { buscarConfiguracao } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [[{ totalTeatros }], [{ totalRoteiros }], config] = await Promise.all([
    db.select({ totalTeatros: count() }).from(teatros),
    db.select({ totalRoteiros: count() }).from(roteiros),
    buscarConfiguracao(),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-segueme-ink">
        Visão geral
      </h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          titulo="Teatros"
          valor={totalTeatros}
          href="/admin/teatros"
          acao="Gerenciar teatros"
        />
        <Card
          titulo="Roteiros"
          valor={totalRoteiros}
          href="/admin/roteiros"
          acao="Gerenciar roteiros"
        />
        <LogoCard personalizada={config.logoDataUri !== null} />
      </div>
      <div className="mt-8 flex gap-3">
        <Link
          href="/admin/teatros/novo"
          className="rounded-lg bg-segueme-ink px-4 py-2 text-sm font-medium text-segueme-cream hover:bg-black"
        >
          + Novo teatro
        </Link>
        <Link
          href="/admin/roteiros/novo"
          className="rounded-lg border border-segueme-ink px-4 py-2 text-sm font-medium text-segueme-ink hover:bg-segueme-ink hover:text-segueme-cream"
        >
          + Novo roteiro
        </Link>
      </div>
    </div>
  );
}

function Card({
  titulo,
  valor,
  href,
  acao,
}: {
  titulo: string;
  valor: number;
  href: string;
  acao: string;
}) {
  return (
    <div className="rounded-xl border border-segueme-line bg-white p-6">
      <p className="text-sm uppercase tracking-wider text-segueme-brown">
        {titulo}
      </p>
      <p className="mt-2 font-display text-4xl font-semibold text-segueme-ink">
        {valor}
      </p>
      <Link
        href={href}
        className="mt-4 inline-block text-sm text-segueme-gold hover:underline"
      >
        {acao} →
      </Link>
    </div>
  );
}

function LogoCard({ personalizada }: { personalizada: boolean }) {
  return (
    <div className="rounded-xl border border-segueme-line bg-white p-6">
      <p className="text-sm uppercase tracking-wider text-segueme-brown">
        Logo customizada
      </p>
      <div className="mt-3">
        {personalizada ? (
          <span className="inline-block rounded-full bg-segueme-yellow px-3 py-1 text-xs font-semibold text-segueme-ink">
            Personalizada
          </span>
        ) : (
          <span className="inline-block rounded-full bg-segueme-line px-3 py-1 text-xs font-semibold text-segueme-ink">
            Padrão
          </span>
        )}
      </div>
      <Link
        href="/admin/configuracoes"
        className="mt-4 inline-block text-sm text-segueme-gold hover:underline"
      >
        Gerenciar logo →
      </Link>
    </div>
  );
}
