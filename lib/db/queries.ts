import { db } from "./index";
import { teatros, roteiros } from "./schema";
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
