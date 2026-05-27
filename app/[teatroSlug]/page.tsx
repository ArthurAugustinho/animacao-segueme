import Link from "next/link";
import { notFound } from "next/navigation";
import {
  buscarTeatroPorSlug,
  listarRoteirosDoTeatro,
} from "@/lib/db/queries";
import { Header } from "@/components/header";
import { formatarData, formatarDuracao } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TeatroPage({
  params,
}: {
  params: Promise<{ teatroSlug: string }>;
}) {
  const { teatroSlug } = await params;
  const teatro = await buscarTeatroPorSlug(teatroSlug);
  if (!teatro) notFound();

  const roteiros = await listarRoteirosDoTeatro(teatro.id);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-10 sm:px-6 sm:pt-16">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-segueme-muted hover:text-segueme-ink"
        >
          ← Todos os teatros
        </Link>

        <header className="mb-10 border-b border-segueme-line pb-8">
          <p className="mb-3 font-sans text-xs uppercase tracking-[0.2em] text-segueme-brown">
            Teatro
          </p>
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-segueme-ink sm:text-4xl">
            {teatro.nome}
          </h1>
          {teatro.descricao && (
            <p className="mt-4 max-w-prose text-segueme-muted">
              {teatro.descricao}
            </p>
          )}
        </header>

        {roteiros.length === 0 ? (
          <p className="rounded-lg border border-dashed border-segueme-line bg-white p-8 text-center text-sm text-segueme-muted">
            Nenhum roteiro cadastrado neste teatro ainda.
          </p>
        ) : (
          <ol className="space-y-3">
            {roteiros.map((r, i) => (
              <li key={r.id}>
                <Link
                  href={`/${teatro.slug}/${r.slug}`}
                  className="group flex items-start gap-5 rounded-lg border border-segueme-line bg-white p-5 transition-all hover:border-segueme-yellow"
                >
                  <span className="numero-roteiro mt-0.5 font-display text-2xl font-semibold text-segueme-yellow">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <h2 className="font-display text-lg font-semibold text-segueme-ink group-hover:text-segueme-gold">
                      {r.titulo}
                    </h2>
                    {r.descricao && (
                      <p className="mt-1 text-sm text-segueme-muted">
                        {r.descricao}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-segueme-muted">
                      {r.dataApresentacao && (
                        <span>{formatarData(r.dataApresentacao)}</span>
                      )}
                      {r.duracaoMinutos && (
                        <span>· {formatarDuracao(r.duracaoMinutos)}</span>
                      )}
                      {r.tags.length > 0 && (
                        <span className="flex flex-wrap gap-1">
                          {r.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-segueme-cream px-2 py-0.5 text-segueme-brown"
                            >
                              {tag}
                            </span>
                          ))}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </main>
    </>
  );
}
