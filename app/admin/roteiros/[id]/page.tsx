import { notFound, redirect } from "next/navigation";
import { buscarRoteiroPorId, listarTeatros } from "@/lib/db/queries";
import { atualizarRoteiro, excluirRoteiro } from "@/lib/actions";
import { FormularioRoteiro } from "../formulario";

export const dynamic = "force-dynamic";

export default async function EditarRoteiroPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  const roteiro = await buscarRoteiroPorId(id);
  if (!roteiro) notFound();

  const teatros = await listarTeatros();

  const handleAtualizar = async (formData: FormData) => {
    "use server";
    await atualizarRoteiro(id, formData);
  };

  const handleExcluir = async () => {
    "use server";
    await excluirRoteiro(id);
    redirect("/admin/roteiros");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-display text-3xl font-semibold text-segueme-ink">
        Editar roteiro
      </h1>
      <FormularioRoteiro
        roteiro={roteiro}
        teatros={teatros}
        action={handleAtualizar}
      />

      <hr className="my-10 border-segueme-line" />

      <form action={handleExcluir}>
        <button
          type="submit"
          className="text-sm text-red-700 hover:underline"
        >
          Excluir este roteiro
        </button>
      </form>
    </div>
  );
}
