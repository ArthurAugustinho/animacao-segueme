import Link from "next/link";
import { listarTodosRoteiros } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function AdminRoteirosPage() {
  const roteiros = await listarTodosRoteiros();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-segueme-ink">
          Roteiros
        </h1>
        <Link
          href="/admin/roteiros/novo"
          className="rounded-lg bg-segueme-ink px-4 py-2 text-sm font-medium text-segueme-cream hover:bg-black"
        >
          + Novo roteiro
        </Link>
      </div>

      {roteiros.length === 0 ? (
        <p className="rounded-lg border border-dashed border-segueme-line bg-white p-8 text-center text-sm text-segueme-muted">
          Nenhum roteiro cadastrado.
        </p>
      ) : (
        <ul className="divide-y divide-segueme-line rounded-lg border border-segueme-line bg-white">
          {roteiros.map((r) => (
            <li key={r.id}>
              <Link
                href={`/admin/roteiros/${r.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-segueme-cream"
              >
                <div className="min-w-0">
                  <p className="font-display font-semibold text-segueme-ink">
                    {r.titulo}
                  </p>
                  <p className="truncate text-xs text-segueme-muted">
                    {r.teatroNome} · /{r.teatroSlug}/{r.slug}
                  </p>
                </div>
                <span className="ml-4 flex shrink-0 items-center gap-3">
                  {!r.publicado && (
                    <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-900">
                      rascunho
                    </span>
                  )}
                  <span className="text-xs text-segueme-muted">Editar →</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
