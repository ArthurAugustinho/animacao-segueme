import type { Roteiro, Teatro } from "@/lib/db/schema";
import { TiptapEditor } from "@/components/editor/tiptap-editor";

interface Props {
  roteiro?: Roteiro;
  teatros: Teatro[];
  action: (formData: FormData) => Promise<void> | void;
}

export function FormularioRoteiro({ roteiro, teatros, action }: Props) {
  const dataIso = roteiro?.dataApresentacao
    ? new Date(roteiro.dataApresentacao).toISOString().slice(0, 10)
    : "";

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Campo label="Teatro" id="teatroId">
          <select
            id="teatroId"
            name="teatroId"
            required
            defaultValue={roteiro?.teatroId}
            className="input"
          >
            <option value="">Selecione...</option>
            {teatros.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome}
              </option>
            ))}
          </select>
        </Campo>

        <Campo label="Título do roteiro" id="titulo">
          <input
            id="titulo"
            name="titulo"
            required
            defaultValue={roteiro?.titulo}
            className="input"
            placeholder="Ex: Cena 1 - O Chamado"
          />
        </Campo>
      </div>

      <Campo label="Descrição (opcional)" id="descricao">
        <input
          id="descricao"
          name="descricao"
          defaultValue={roteiro?.descricao ?? ""}
          className="input"
          placeholder="Resumo curto que aparece nos cards"
        />
      </Campo>

      <div className="grid gap-5 sm:grid-cols-3">
        <Campo label="Data da apresentação" id="dataApresentacao">
          <input
            id="dataApresentacao"
            name="dataApresentacao"
            type="date"
            defaultValue={dataIso}
            className="input"
          />
        </Campo>
        <Campo label="Duração (min)" id="duracaoMinutos">
          <input
            id="duracaoMinutos"
            name="duracaoMinutos"
            type="number"
            min="1"
            defaultValue={roteiro?.duracaoMinutos ?? ""}
            className="input"
          />
        </Campo>
        <Campo label="Tags (separadas por vírgula)" id="tags">
          <input
            id="tags"
            name="tags"
            defaultValue={roteiro?.tags.join(", ") ?? ""}
            className="input"
            placeholder="abertura, reflexão"
          />
        </Campo>
      </div>

      <Campo label="Conteúdo do roteiro" id="conteudo">
        <TiptapEditor name="conteudo" defaultValue={roteiro?.conteudo ?? ""} />
      </Campo>

      <label className="flex items-center gap-2 text-sm text-segueme-ink">
        <input
          type="checkbox"
          name="publicado"
          defaultChecked={roteiro?.publicado ?? true}
          className="h-4 w-4 accent-segueme-yellow"
        />
        Publicar (visível no site)
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="rounded-lg bg-segueme-ink px-5 py-2.5 text-sm font-medium text-segueme-cream hover:bg-black"
        >
          Salvar roteiro
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
