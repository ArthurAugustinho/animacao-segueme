import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL não definida");
  process.exit(1);
}

const httpClient = neon(process.env.DATABASE_URL);
const db = drizzle(httpClient);

/**
 * Se o banco foi criado via db:push (sem migration history), registra as
 * migrations existentes como já aplicadas para que migrate() as ignore.
 */
async function bootstrapIfNeeded() {
  await httpClient`CREATE SCHEMA IF NOT EXISTS drizzle`;
  await httpClient`
    CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )
  `;

  const [row] = await httpClient`
    SELECT id FROM drizzle.__drizzle_migrations LIMIT 1
  `;
  if (row) return; // histórico já existe — nada a fazer

  const [check] = await httpClient`
    SELECT to_regclass('public.teatros') AS tbl
  `;
  if (!check?.tbl) return; // banco vazio: migrate() vai criar tudo normalmente

  console.log("⚡ Bootstrapping migration history (db:push detectado)...");

  const journal = JSON.parse(
    readFileSync("./drizzle/meta/_journal.json", "utf8")
  ) as { entries: Array<{ tag: string; when: number }> };

  for (const entry of journal.entries) {
    const content = readFileSync(`./drizzle/${entry.tag}.sql`, "utf8");
    const hash = createHash("sha256").update(content).digest("hex");
    await httpClient`
      INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
      VALUES (${hash}, ${entry.when})
    `;
  }

  console.log("✅ Migration history inicializado.");
}

async function run() {
  await bootstrapIfNeeded();
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✅ Migrations aplicadas com sucesso.");
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Erro ao aplicar migrations:", err);
  process.exit(1);
});
