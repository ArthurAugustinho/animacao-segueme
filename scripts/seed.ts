import "dotenv/config";
import { db } from "../lib/db";
import { teatros, roteiros } from "../lib/db/schema";
import { slugify } from "../lib/utils";

async function seed() {
  console.log("🌱 Limpando dados existentes...");
  await db.delete(roteiros);
  await db.delete(teatros);

  console.log("🎭 Criando teatros de exemplo...");
  const [aberturaTeatro] = await db
    .insert(teatros)
    .values({
      nome: "Abertura - Pai Misericordioso",
      slug: slugify("Abertura - Pai Misericordioso"),
      descricao:
        "Teatro de abertura do encontro, tema da misericórdia do Pai.",
      ordem: 1,
    })
    .returning();

  const [reflexaoTeatro] = await db
    .insert(teatros)
    .values({
      nome: "Reflexão - O Filho Pródigo",
      slug: slugify("Reflexão - O Filho Pródigo"),
      descricao: "Encenação da parábola do filho pródigo.",
      ordem: 2,
    })
    .returning();

  console.log("📜 Criando roteiros de exemplo...");
  await db.insert(roteiros).values([
    {
      teatroId: aberturaTeatro.id,
      slug: "cena-1-o-chamado",
      titulo: "Cena 1 - O Chamado",
      descricao: "Cena inicial: o chamado de Cristo aos discípulos.",
      conteudo: `
        <h2>Personagens</h2>
        <ul>
          <li><strong>Cristo:</strong> postura serena, voz firme</li>
          <li><strong>Pedro:</strong> entusiasmado, jovem pescador</li>
          <li><strong>André:</strong> reflexivo, irmão de Pedro</li>
        </ul>
        <h2>Marcação de cena</h2>
        <p>Entram à direita, atravessam o palco em diagonal.</p>
        <blockquote>"Vinde após mim, e eu farei de vós pescadores de homens."</blockquote>
        <p><strong>Cristo:</strong> Pedro, deixa as redes. <em>(pausa)</em></p>
        <p><strong>Pedro:</strong> Mas, Senhor, é o meu sustento...</p>
        <hr>
        <p><em>Luzes baixam lentamente. Música suave.</em></p>
      `.trim(),
      dataApresentacao: new Date("2026-07-15"),
      duracaoMinutos: 12,
      tags: ["abertura", "vocação"],
      publicado: true,
    },
    {
      teatroId: reflexaoTeatro.id,
      slug: "cena-1-a-partida",
      titulo: "Cena 1 - A Partida",
      descricao: "Filho mais novo pede a herança e parte.",
      conteudo: `
        <h2>Cenário</h2>
        <p>Casa simples. Pai sentado à mesa. Filho mais novo entra apressado.</p>
        <h2>Diálogo</h2>
        <p><strong>Filho:</strong> Pai, dá-me a parte dos bens que me toca.</p>
        <p><strong>Pai:</strong> <em>(silêncio. Olha o filho. Suspira.)</em> Toma, meu filho.</p>
      `.trim(),
      dataApresentacao: new Date("2026-07-16"),
      duracaoMinutos: 8,
      tags: ["reflexão", "parábola"],
      publicado: true,
    },
  ]);

  console.log("✅ Seed concluído.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Erro no seed:", err);
  process.exit(1);
});
