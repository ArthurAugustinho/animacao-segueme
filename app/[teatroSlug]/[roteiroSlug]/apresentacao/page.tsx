import { notFound } from "next/navigation";
import {
  buscarTeatroPorSlug,
  buscarRoteiroPorSlug,
} from "@/lib/db/queries";
import { ApresentacaoView } from "./view";

export const dynamic = "force-dynamic";

export default async function ApresentacaoPage({
  params,
}: {
  params: Promise<{ teatroSlug: string; roteiroSlug: string }>;
}) {
  const { teatroSlug, roteiroSlug } = await params;

  const teatro = await buscarTeatroPorSlug(teatroSlug);
  if (!teatro) notFound();

  const roteiro = await buscarRoteiroPorSlug(teatro.id, roteiroSlug);
  if (!roteiro || !roteiro.publicado) notFound();

  return (
    <ApresentacaoView
      titulo={roteiro.titulo}
      html={roteiro.conteudo || "<p>Sem conteúdo.</p>"}
      returnUrl={`/${teatroSlug}/${roteiroSlug}`}
    />
  );
}
