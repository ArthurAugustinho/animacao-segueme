import { criarTeatro } from "@/lib/actions";
import { FormularioTeatro } from "../formulario";

export default function NovoTeatroPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-display text-3xl font-semibold text-segueme-ink">
        Novo teatro
      </h1>
      <FormularioTeatro action={criarTeatro} />
    </div>
  );
}
