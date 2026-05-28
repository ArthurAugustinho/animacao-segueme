import { cache } from "react";
import { db } from "./index";
import { teatros, roteiros, configuracoes } from "./schema";
import type { Configuracao } from "./schema";
import { asc, eq, and } from "drizzle-orm";

export async function listarTeatros() {
  return db
    .select()
    .from(teatros)
    .orderBy(asc(teatros.ordem), asc(teatros.nome));
}

export async function buscarTeatroPorSlug(slug: string) {
  const [teatro] = await db
    .select()
    .from(teatros)
    .where(eq(teatros.slug, slug))
    .limit(1);
  return teatro ?? null;
}

export async function listarRoteirosDoTeatro(teatroId: number) {
  return db
    .select()
    .from(roteiros)
    .where(
      and(eq(roteiros.teatroId, teatroId), eq(roteiros.publicado, true))
    )
    .orderBy(asc(roteiros.dataApresentacao), asc(roteiros.titulo));
}

export async function buscarRoteiroPorSlug(teatroId: number, slug: string) {
  const [roteiro] = await db
    .select()
    .from(roteiros)
    .where(and(eq(roteiros.teatroId, teatroId), eq(roteiros.slug, slug)))
    .limit(1);
  return roteiro ?? null;
}

export async function listarTodosRoteiros() {
  return db
    .select({
      id: roteiros.id,
      slug: roteiros.slug,
      titulo: roteiros.titulo,
      descricao: roteiros.descricao,
      publicado: roteiros.publicado,
      atualizadoEm: roteiros.atualizadoEm,
      teatroNome: teatros.nome,
      teatroSlug: teatros.slug,
      teatroId: teatros.id,
    })
    .from(roteiros)
    .leftJoin(teatros, eq(roteiros.teatroId, teatros.id))
    .orderBy(asc(teatros.nome), asc(roteiros.titulo));
}

export async function buscarRoteiroPorId(id: number) {
  const [roteiro] = await db
    .select()
    .from(roteiros)
    .where(eq(roteiros.id, id))
    .limit(1);
  return roteiro ?? null;
}

export async function buscarTeatroPorId(id: number) {
  const [teatro] = await db
    .select()
    .from(teatros)
    .where(eq(teatros.id, id))
    .limit(1);
  return teatro ?? null;
}

const configPadrao: Configuracao = {
  id: 1,
  logoDataUri: null,
  logoMimeType: null,
  logoTamanhoBytes: null,
  atualizadoEm: new Date(0),
};

export const buscarConfiguracao = cache(async (): Promise<Configuracao> => {
  try {
    const rows = await db.select().from(configuracoes).limit(1);
    if (rows.length > 0) return rows[0];

    // Primeira execução: cria a linha singleton
    const [criada] = await db
      .insert(configuracoes)
      .values({ id: 1 })
      .onConflictDoNothing()
      .returning();

    if (criada) return criada;

    // Corrida com outra requisição simultânea — busca novamente
    const [existente] = await db.select().from(configuracoes).limit(1);
    return existente ?? configPadrao;
  } catch (err) {
    console.error("[buscarConfiguracao] Erro ao acessar tabela configuracoes:", err);
    return configPadrao;
  }
});
