import { notFound } from "next/navigation";
import { buscarTeatroPorId } from "@/lib/db/queries";
import { atualizarTeatro, excluirTeatro } from "@/lib/actions";
import { FormularioTeatro } from "../formulario";
import { redirect } from "next/navigation";

export default async function EditarTeatroPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  const teatro = await buscarTeatroPorId(id);
  if (!teatro) notFound();

  const handleAtualizar = async (formData: FormData) => {
    "use server";
    await atualizarTeatro(id, formData);
  };

  const handleExcluir = async () => {
    "use server";
    await excluirTeatro(id);
    redirect("/admin/teatros");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-display text-3xl font-semibold text-segueme-ink">
        Editar teatro
      </h1>
      <FormularioTeatro teatro={teatro} action={handleAtualizar} />

      <hr className="my-10 border-segueme-line" />

      <form action={handleExcluir}>
        <button
          type="submit"
          className="text-sm text-red-700 hover:underline"
        >
          Excluir teatro (e todos os seus roteiros)
        </button>
      </form>
    </div>
  );
}
