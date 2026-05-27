import type { Teatro } from "@/lib/db/schema";

interface Props {
  teatro?: Teatro;
  action: (formData: FormData) => Promise<void> | void;
}

export function FormularioTeatro({ teatro, action }: Props) {
  return (
    <form action={action} className="space-y-5">
      <Campo label="Nome" id="nome">
        <input
          id="nome"
          name="nome"
          required
          defaultValue={teatro?.nome}
          className="input"
          placeholder="Ex: Abertura - Pai Misericordioso"
        />
      </Campo>

      <Campo label="Descrição (opcional)" id="descricao">
        <textarea
          id="descricao"
          name="descricao"
          rows={3}
          defaultValue={teatro?.descricao ?? ""}
          className="input"
          placeholder="Breve resumo do tema deste teatro"
        />
      </Campo>

      <Campo label="Ordem de exibição" id="ordem">
        <input
          id="ordem"
          name="ordem"
          type="number"
          defaultValue={teatro?.ordem ?? 0}
          className="input"
        />
      </Campo>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="rounded-lg bg-segueme-ink px-5 py-2.5 text-sm font-medium text-segueme-cream hover:bg-black"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}

function Campo({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-segueme-ink"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
