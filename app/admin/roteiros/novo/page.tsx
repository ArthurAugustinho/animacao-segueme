import { criarRoteiro } from "@/lib/actions";
import { FormularioRoteiro } from "../formulario";
import { listarTeatros } from "@/lib/db/queries";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NovoRoteiroPage() {
  const teatros = await listarTeatros();

  if (teatros.length === 0) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 font-display text-3xl font-semibold text-segueme-ink">
          Novo roteiro
        </h1>
        <p className="rounded-lg border border-dashed border-segueme-line bg-white p-8 text-center">
          Antes de criar um roteiro, você precisa cadastrar pelo menos um{" "}
          <Link
            href="/admin/teatros/novo"
            className="text-segueme-gold underline"
          >
            teatro
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-display text-3xl font-semibold text-segueme-ink">
        Novo roteiro
      </h1>
      <FormularioRoteiro action={criarRoteiro} teatros={teatros} />
    </div>
  );
}
