import Link from "next/link";
import { listarTeatros } from "@/lib/db/queries";
import { Header } from "@/components/header";
import { db } from "@/lib/db";
import { roteiros } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";
import {
  AnimatedList,
  AnimatedCard,
  FadeIn,
} from "@/components/animated-list";

export const dynamic = "force-dynamic";

async function contarRoteirosPorTeatro(teatroId: number) {
  const [resultado] = await db
    .select({ total: count() })
    .from(roteiros)
    .where(eq(roteiros.teatroId, teatroId));
  return resultado?.total ?? 0;
}

export default async function HomePage() {
  const teatros = await listarTeatros();
  const teatrosComContagem = await Promise.all(
    teatros.map(async (t) => ({
      ...t,
      totalRoteiros: await contarRoteirosPorTeatro(t.id),
    }))
  );

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 pb-20 pt-10 sm:px-6 sm:pt-16">
        {/* Hero */}
        <section className="mb-12 sm:mb-16">
          <FadeIn>
            <p className="mb-3 font-sans text-sm uppercase tracking-[0.2em] text-segueme-brown">
              Paróquia São Francisco de Assis
            </p>
          </FadeIn>
          {/* h1 é o LCP — sem animação */}
          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-segueme-ink sm:text-5xl">
            Roteiros da Equipe
            <br />
            <span className="text-segueme-gold">da Animação</span>
          </h1>
          <FadeIn delay={0.15}>
            <p className="mt-5 max-w-prose text-base text-segueme-muted sm:text-lg">
              Acervo dos teatros do encontro Segue-Me. Selecione um teatro para
              consultar os roteiros, falas e marcações de cena.
            </p>
          </FadeIn>
        </section>

        {/* Divisor decorativo */}
        <div className="mb-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-segueme-line" />
          <span className="font-display text-xs uppercase tracking-[0.3em] text-segueme-brown">
            Teatros
          </span>
          <div className="h-px flex-1 bg-segueme-line" />
        </div>

        {/* Lista de teatros */}
        {teatrosComContagem.length === 0 ? (
          <EstadoVazio />
        ) : (
          <AnimatedList className="grid gap-4 sm:grid-cols-2">
            {teatrosComContagem.map((teatro, i) => (
              <AnimatedCard key={teatro.id}>
                <Link
                  href={`/${teatro.slug}`}
                  className="group flex h-full flex-col rounded-lg border border-segueme-line bg-white p-6 transition-all hover:border-segueme-yellow hover:shadow-[0_4px_20px_-8px_rgba(244,196,48,0.4)]"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <span className="numero-roteiro font-display text-3xl font-semibold text-segueme-yellow">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="rounded-full bg-segueme-cream px-3 py-1 text-xs font-medium text-segueme-brown">
                      {teatro.totalRoteiros}{" "}
                      {teatro.totalRoteiros === 1 ? "roteiro" : "roteiros"}
                    </span>
                  </div>
                  <h2 className="mb-2 font-display text-xl font-semibold text-segueme-ink group-hover:text-segueme-gold">
                    {teatro.nome}
                  </h2>
                  {teatro.descricao && (
                    <p className="text-sm text-segueme-muted">
                      {teatro.descricao}
                    </p>
                  )}
                </Link>
              </AnimatedCard>
            ))}
          </AnimatedList>
        )}
      </main>
      <footer className="border-t border-segueme-line py-8 text-center text-xs text-segueme-muted">
        Animação Segue-Me · Diocese de Anápolis
      </footer>
    </>
  );
}

function EstadoVazio() {
  return (
    <div className="rounded-lg border border-dashed border-segueme-line bg-white p-12 text-center">
      <p className="font-display text-xl text-segueme-ink">
        Nenhum teatro cadastrado ainda
      </p>
      <p className="mt-2 text-sm text-segueme-muted">
        Acesse{" "}
        <Link
          href="/admin"
          className="underline decoration-segueme-yellow underline-offset-4"
        >
          /admin
        </Link>{" "}
        para começar.
      </p>
    </div>
  );
}
