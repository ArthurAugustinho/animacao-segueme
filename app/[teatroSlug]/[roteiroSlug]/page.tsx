import Link from "next/link";
import { notFound } from "next/navigation";
import {
  buscarTeatroPorSlug,
  buscarRoteiroPorSlug,
} from "@/lib/db/queries";
import { Header } from "@/components/header";
import { formatarData, formatarDuracao } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function RoteiroPage({
  params,
}: {
  params: Promise<{ teatroSlug: string; roteiroSlug: string }>;
}) {
  const { teatroSlug, roteiroSlug } = await params;
  const teatro = await buscarTeatroPorSlug(teatroSlug);
  if (!teatro) notFound();

  const roteiro = await buscarRoteiroPorSlug(teatro.id, roteiroSlug);
  if (!roteiro || !roteiro.publicado) notFound();

  const conteudoHtml =
    roteiro.conteudo?.trim() ||
    "<p><em>Roteiro ainda em branco.</em></p>";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 pb-24 pt-8 sm:px-6 sm:pt-12">
        <nav className="mb-6 flex items-center gap-2 text-xs text-segueme-muted">
          <Link href="/" className="hover:text-segueme-ink">
            Início
          </Link>
          <span>/</span>
          <Link href={`/${teatro.slug}`} className="hover:text-segueme-ink">
            {teatro.nome}
          </Link>
        </nav>

        <article>
          <header className="mb-8 border-b border-segueme-line pb-6">
            <p className="mb-2 font-sans text-xs uppercase tracking-[0.2em] text-segueme-brown">
              Roteiro · {teatro.nome}
            </p>
            <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-segueme-ink sm:text-4xl">
              {roteiro.titulo}
            </h1>
            {roteiro.descricao && (
              <p className="mt-4 text-segueme-muted">{roteiro.descricao}</p>
            )}
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-segueme-muted">
              {roteiro.dataApresentacao && (
                <span>📅 {formatarData(roteiro.dataApresentacao)}</span>
              )}
              {roteiro.duracaoMinutos && (
                <span>⏱ {formatarDuracao(roteiro.duracaoMinutos)}</span>
              )}
              {roteiro.tags.length > 0 && (
                <span className="flex flex-wrap gap-1">
                  {roteiro.tags.map((tag) => (
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
          </header>

          {/* Conteúdo HTML produzido pelo TipTap, estilizado por .prose-roteiro */}
          <div
            className="prose-roteiro"
            dangerouslySetInnerHTML={{ __html: conteudoHtml }}
          />

          <div className="mt-12 flex justify-center">
            <div className="font-display text-2xl text-segueme-yellow">✦</div>
          </div>
        </article>
      </main>
    </>
  );
}
