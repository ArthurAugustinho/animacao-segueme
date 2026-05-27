import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  integer,
  primaryKey,
  boolean,
  check,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";

// ============================================================
// Tabelas do domínio Segue-Me
// ============================================================

export const teatros = pgTable("teatros", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  nome: varchar("nome", { length: 200 }).notNull(),
  descricao: text("descricao"),
  ordem: integer("ordem").notNull().default(0),
  criadoEm: timestamp("criado_em", { withTimezone: true })
    .notNull()
    .defaultNow(),
  atualizadoEm: timestamp("atualizado_em", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const roteiros = pgTable("roteiros", {
  id: serial("id").primaryKey(),
  teatroId: integer("teatro_id")
    .notNull()
    .references(() => teatros.id, { onDelete: "cascade" }),
  slug: varchar("slug", { length: 120 }).notNull(),
  titulo: varchar("titulo", { length: 200 }).notNull(),
  descricao: text("descricao"),
  conteudo: text("conteudo").notNull().default(""),
  dataApresentacao: timestamp("data_apresentacao", { mode: "date" }),
  duracaoMinutos: integer("duracao_minutos"),
  tags: text("tags").array().notNull().default([]),
  publicado: boolean("publicado").notNull().default(true),
  criadoEm: timestamp("criado_em", { withTimezone: true })
    .notNull()
    .defaultNow(),
  atualizadoEm: timestamp("atualizado_em", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const teatrosRelations = relations(teatros, ({ many }) => ({
  roteiros: many(roteiros),
}));

export const roteirosRelations = relations(roteiros, ({ one }) => ({
  teatro: one(teatros, {
    fields: [roteiros.teatroId],
    references: [teatros.id],
  }),
}));

// ============================================================
// Tabelas do Auth.js (Drizzle Adapter)
// ============================================================

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export type Teatro = typeof teatros.$inferSelect;
export type NovoTeatro = typeof teatros.$inferInsert;
export type Roteiro = typeof roteiros.$inferSelect;
export type NovoRoteiro = typeof roteiros.$inferInsert;

// ============================================================
// Configurações da aplicação (singleton — sempre id = 1)
// ============================================================

export const configuracoes = pgTable(
  "configuracoes",
  {
    id: integer("id").primaryKey().default(1),
    logoDataUri: text("logo_data_uri"),
    logoMimeType: varchar("logo_mime_type", { length: 50 }),
    logoTamanhoBytes: integer("logo_tamanho_bytes"),
    atualizadoEm: timestamp("atualizado_em", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [check("configuracoes_singleton", sql`${t.id} = 1`)]
);

export type Configuracao = typeof configuracoes.$inferSelect;
