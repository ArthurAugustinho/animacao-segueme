# Animação Segue-Me

Site dos roteiros de teatro da Equipe da Animação do encontro Segue-Me — Paróquia São Francisco de Assis (São Francisco de Goiás).

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind · Drizzle ORM · Neon Postgres · Auth.js v5 (GitHub) · TipTap · Vercel.

---

## Estrutura

```
animacao-segueme/
├── app/
│   ├── (público)
│   │   ├── page.tsx                        → home: lista de teatros
│   │   ├── [teatroSlug]/page.tsx           → lista de roteiros do teatro
│   │   └── [teatroSlug]/[roteiroSlug]      → roteiro completo
│   ├── admin/                              → painel protegido (middleware)
│   │   ├── page.tsx                        → dashboard
│   │   ├── teatros/                        → CRUD teatros
│   │   └── roteiros/                       → CRUD roteiros
│   ├── login/page.tsx                      → login GitHub
│   └── api/auth/[...nextauth]/route.ts     → handler Auth.js
├── components/
│   ├── header.tsx                          → logo + título
│   └── editor/tiptap-editor.tsx            → editor rich-text
├── lib/
│   ├── db/                                 → Drizzle: schema, conexão, queries
│   ├── actions.ts                          → Server Actions (CRUD)
│   └── utils.ts                            → cn, slugify, formatadores
├── scripts/seed.ts                         → popula dados de exemplo
├── auth.ts                                 → config Auth.js
└── middleware.ts                           → protege /admin
```

---

## Setup local — passo a passo

### 1. Pré-requisitos

- Node.js 20+
- Conta no [Neon](https://neon.tech), [GitHub](https://github.com) e [Vercel](https://vercel.com)

### 2. Instalar dependências

```bash
npm install
```

### 3. Banco no Neon (3 minutos)

1. Crie projeto em https://console.neon.tech → região mais próxima
2. Em **Connection Details**, copie a connection string com **"Pooled connection"** marcado
3. Cole em `.env` (crie a partir de `.env.example`)

### 4. GitHub OAuth (5 minutos)

1. Vá em https://github.com/settings/developers → **New OAuth App**
2. Preencha:
   - **Application name:** Animação Segue-Me (dev)
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
3. Copie **Client ID** → cole em `AUTH_GITHUB_ID`
4. Gere **Client Secret** → cole em `AUTH_GITHUB_SECRET`

### 5. Gerar secret do Auth.js

```bash
npx auth secret
```

Isso já preenche `AUTH_SECRET` no `.env`.

### 6. Definir o admin

No `.env`, coloque seu username do GitHub em `ADMIN_GITHUB_USERNAME`. Apenas esse user terá acesso ao `/admin`.

### 7. Aplicar schema ao banco

```bash
npm run db:push
```

(Para fluxo de migrations rastreado em git, use `npm run db:generate` + `npm run db:migrate`.)

### 8. (Opcional) Popular com dados de exemplo

```bash
npm run db:seed
```

### 9. Rodar

```bash
npm run dev
```

Abra http://localhost:3000.
- Site público: `/`
- Painel: `/admin` (será redirecionado pro login)

---

## Deploy na Vercel

### 1. Subir pro GitHub

```bash
git init
git add .
git commit -m "feat: scaffold inicial"
gh repo create animacao-segueme --private --source=. --push
```

### 2. Importar na Vercel

1. https://vercel.com/new → importe o repositório
2. **Environment Variables:** copie tudo do seu `.env` local
3. Em `AUTH_GITHUB_ID/SECRET`, crie um **novo** OAuth App no GitHub apontando pra URL da Vercel:
   - **Callback URL:** `https://seu-projeto.vercel.app/api/auth/callback/github`
4. Deploy

### 3. Após deploy

- Acesse `https://seu-projeto.vercel.app`
- Faça login em `/admin` com sua conta GitHub
- Cadastre teatros → cadastre roteiros

---

## Comandos úteis

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor local |
| `npm run build` | Build de produção |
| `npm run db:push` | Sincroniza schema com o banco (sem migrations) |
| `npm run db:generate` | Gera migrations a partir do schema |
| `npm run db:migrate` | Aplica migrations |
| `npm run db:studio` | Drizzle Studio (GUI do banco em http://localhost:4983) |
| `npm run db:seed` | Popula dados de exemplo |

---

## Paleta de cores

| Token | Hex |
|---|---|
| `segueme-yellow` | `#F4C430` |
| `segueme-gold` | `#E0A800` |
| `segueme-brown` | `#8B6F47` |
| `segueme-cream` | `#FFFBF0` |
| `segueme-ink` | `#1A1A1A` |
| `segueme-muted` | `#6B6B6B` |
| `segueme-line` | `#EFE6CC` |

Tipografia: **Fraunces** (display) + **DM Sans** (body), ambas via `next/font`.

---

## Próximos passos (fora do MVP)

- [ ] Múltiplos admins (tabela `admins` com lista de usernames permitidos)
- [ ] Versionamento de roteiros (histórico de edições)
- [ ] Upload de imagens nos roteiros (Vercel Blob ou Cloudinary)
- [ ] Modo apresentação fullscreen para usar no celular durante o teatro
- [ ] PWA para uso offline
- [ ] Exportar roteiro como PDF

---

## Stack — custo

| Serviço | Plano | Custo previsto |
|---|---|---|
| Vercel | Hobby | R$ 0 |
| Neon | Free | R$ 0 |
| GitHub | Free | R$ 0 |

20 roteiros × ~50KB = 1MB no banco (0,2% do limite de 500MB do Neon). Tráfego de leitura cabe folgado nos 100GB/mês da Vercel.

---

**Equipe da Animação · Paróquia São Francisco de Assis · Diocese de Anápolis**
