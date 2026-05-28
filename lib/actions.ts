"use server";

import { db } from "@/lib/db";
import { teatros, roteiros, configuracoes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { slugify } from "@/lib/utils";
import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Acesso negado");
  }
}

// ============================================================
// Teatros
// ============================================================

const teatroSchema = z.object({
  nome: z.string().min(2, "Nome muito curto").max(200),
  descricao: z.string().max(500).optional(),
  ordem: z.coerce.number().int().default(0),
});

export async function criarTeatro(formData: FormData) {
  await requireAdmin();
  const dados = teatroSchema.parse({
    nome: formData.get("nome"),
    descricao: formData.get("descricao") || undefined,
    ordem: formData.get("ordem") || 0,
  });

  const slug = slugify(dados.nome);
  const [teatro] = await db
    .insert(teatros)
    .values({ ...dados, slug })
    .returning();

  revalidatePath("/");
  revalidatePath("/admin/teatros");
  redirect(`/admin/teatros/${teatro.id}`);
}

export async function atualizarTeatro(id: number, formData: FormData) {
  await requireAdmin();
  const dados = teatroSchema.parse({
    nome: formData.get("nome"),
    descricao: formData.get("descricao") || undefined,
    ordem: formData.get("ordem") || 0,
  });

  await db
    .update(teatros)
    .set({ ...dados, slug: slugify(dados.nome), atualizadoEm: new Date() })
    .where(eq(teatros.id, id));

  revalidatePath("/");
  revalidatePath("/admin/teatros");
  redirect("/admin/teatros");
}

export async function excluirTeatro(id: number) {
  await requireAdmin();
  await db.delete(teatros).where(eq(teatros.id, id));
  revalidatePath("/");
  revalidatePath("/admin/teatros");
}

// ============================================================
// Roteiros
// ============================================================

const roteiroSchema = z.object({
  teatroId: z.coerce.number().int().positive(),
  titulo: z.string().min(2).max(200),
  descricao: z.string().max(500).optional(),
  conteudo: z.string().default(""),
  dataApresentacao: z.string().optional(),
  duracaoMinutos: z.coerce.number().int().positive().optional(),
  tags: z.string().optional(),
  publicado: z.coerce.boolean().default(true),
});

function parseTags(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export async function criarRoteiro(formData: FormData) {
  await requireAdmin();
  const dados = roteiroSchema.parse({
    teatroId: formData.get("teatroId"),
    titulo: formData.get("titulo"),
    descricao: formData.get("descricao") || undefined,
    conteudo: formData.get("conteudo") || "",
    dataApresentacao: formData.get("dataApresentacao") || undefined,
    duracaoMinutos: formData.get("duracaoMinutos") || undefined,
    tags: formData.get("tags") || undefined,
    publicado: formData.get("publicado") === "on",
  });

  const slug = slugify(dados.titulo);
  const [roteiro] = await db
    .insert(roteiros)
    .values({
      teatroId: dados.teatroId,
      titulo: dados.titulo,
      descricao: dados.descricao,
      conteudo: dados.conteudo,
      slug,
      dataApresentacao: dados.dataApresentacao
        ? new Date(dados.dataApresentacao)
        : null,
      duracaoMinutos: dados.duracaoMinutos,
      tags: parseTags(dados.tags),
      publicado: dados.publicado,
    })
    .returning();

  revalidatePath("/");
  revalidatePath("/admin/roteiros");
  redirect(`/admin/roteiros/${roteiro.id}`);
}

export async function atualizarRoteiro(id: number, formData: FormData) {
  await requireAdmin();
  const dados = roteiroSchema.parse({
    teatroId: formData.get("teatroId"),
    titulo: formData.get("titulo"),
    descricao: formData.get("descricao") || undefined,
    conteudo: formData.get("conteudo") || "",
    dataApresentacao: formData.get("dataApresentacao") || undefined,
    duracaoMinutos: formData.get("duracaoMinutos") || undefined,
    tags: formData.get("tags") || undefined,
    publicado: formData.get("publicado") === "on",
  });

  await db
    .update(roteiros)
    .set({
      teatroId: dados.teatroId,
      titulo: dados.titulo,
      descricao: dados.descricao,
      conteudo: dados.conteudo,
      slug: slugify(dados.titulo),
      dataApresentacao: dados.dataApresentacao
        ? new Date(dados.dataApresentacao)
        : null,
      duracaoMinutos: dados.duracaoMinutos,
      tags: parseTags(dados.tags),
      publicado: dados.publicado,
      atualizadoEm: new Date(),
    })
    .where(eq(roteiros.id, id));

  revalidatePath("/");
  revalidatePath("/admin/roteiros");
}

export async function excluirRoteiro(id: number) {
  await requireAdmin();
  await db.delete(roteiros).where(eq(roteiros.id, id));
  revalidatePath("/");
  revalidatePath("/admin/roteiros");
}

// ============================================================
// Logo
// ============================================================

const MIME_ACEITOS = [
  "image/png",
  "image/svg+xml",
  "image/jpeg",
  "image/webp",
] as const;

const logoSchema = z
  .instanceof(File)
  .refine((f) => f.size > 0, "Selecione um arquivo.")
  .refine(
    (f) => f.size <= 1000 * 1024,
    "O arquivo excede o limite de 1 MB."
  )
  .refine(
    (f) => (MIME_ACEITOS as readonly string[]).includes(f.type),
    "Formato não suportado. Use PNG, SVG, JPG ou WEBP."
  );

export type AtualizarLogoState = { erro: string } | null;

export async function atualizarLogo(
  _prevState: AtualizarLogoState,
  formData: FormData
): Promise<AtualizarLogoState> {
  await requireAdmin();

  const arquivo = formData.get("arquivo");
  const resultado = logoSchema.safeParse(arquivo);

  if (!resultado.success) {
    return { erro: resultado.error.errors[0].message };
  }

  const file = resultado.data;
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  await db
    .insert(configuracoes)
    .values({
      id: 1,
      logoDataUri: dataUri,
      logoMimeType: file.type,
      logoTamanhoBytes: file.size,
      atualizadoEm: new Date(),
    })
    .onConflictDoUpdate({
      target: configuracoes.id,
      set: {
        logoDataUri: dataUri,
        logoMimeType: file.type,
        logoTamanhoBytes: file.size,
        atualizadoEm: new Date(),
      },
    });

  revalidatePath("/");
  revalidatePath("/admin/configuracoes");
  redirect("/admin/configuracoes");
}

export async function restaurarLogoPadrao() {
  await requireAdmin();

  await db
    .insert(configuracoes)
    .values({ id: 1 })
    .onConflictDoUpdate({
      target: configuracoes.id,
      set: {
        logoDataUri: null,
        logoMimeType: null,
        logoTamanhoBytes: null,
        atualizadoEm: new Date(),
      },
    });

  revalidatePath("/");
  revalidatePath("/admin/configuracoes");
  redirect("/admin/configuracoes");
}
