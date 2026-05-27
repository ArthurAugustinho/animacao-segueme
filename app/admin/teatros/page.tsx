import Link from "next/link";
import { listarTeatros } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function AdminTeatrosPage() {
  const teatros = await listarTeatros();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-segueme-ink">
          Teatros
        </h1>
        <Link
          href="/admin/teatros/novo"
          className="rounded-lg bg-segueme-ink px-4 py-2 text-sm font-medium text-segueme-cream hover:bg-black"
        >
          + Novo teatro
        </Link>
      </div>

      {teatros.length === 0 ? (
        <p className="rounded-lg border border-dashed border-segueme-line bg-white p-8 text-center text-sm text-segueme-muted">
          Nenhum teatro cadastrado.
        </p>
      ) : (
        <ul className="divide-y divide-segueme-line rounded-lg border border-segueme-line bg-white">
          {teatros.map((t) => (
            <li key={t.id}>
              <Link
                href={`/admin/teatros/${t.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-segueme-cream"
              >
                <div>
                  <p className="font-display font-semibold text-segueme-ink">
                    {t.nome}
                  </p>
                  <p className="text-xs text-segueme-muted">/{t.slug}</p>
                </div>
                <span className="text-xs text-segueme-muted">Editar →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
