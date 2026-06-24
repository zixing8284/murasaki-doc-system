<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Guide

## Project Overview

MURASAKI Docs — a simple document management dashboard. Internal web application for managing documents, posts with rich-text editing, announcements, templates, user accounts, and an organization/department hierarchy.

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start dev server (port 3000) |
| `pnpm build` | Production build |
| `pnpm start` | Production server |
| `pnpm lint` | ESLint |
| `pnpm prettier` | Format all files |
| `pnpm prettier:check` | Check formatting |
| `pnpm seed` | Seed demo data (requires `SEED_DEVELOPMENT=true` in .env) |
| `pnpm doctor` | React component diagnostics |
| `npx prisma migrate dev` | Run Prisma migrations |
| `npx prisma generate` | Regenerate Prisma client |
| `npx prisma studio` | Open database browser |

No test framework is configured.

## Tech Stack

- **Next.js 16 App Router** with React 19, TypeScript 6 (strict)
- **SQLite** via Prisma 7 (`@prisma/adapter-better-sqlite3` JS adapter)
- **Tailwind CSS v4** + **shadcn/ui** (new-york style) + Radix UI + Lucide icons
- **Plate.js v53** rich-text editor for posts and announcements
- **JWT sessions** (jose library, HS256, 7-day expiry, HTTP-only cookies)
- **bcrypt** + **bcrypt-ts** for password hashing
- **Zod 4** for form validation schemas
- **Uploadthing** for file uploads
- **AI SDK** (`ai`, `@ai-sdk/react`) for AI features
- **Excalidraw** for whiteboard/diagram embedding
- **MDX** for documentation pages

## Architecture

### Route Structure (App Router)

- `app/` — root layout, landing page
- `app/login/` — login page
- `app/test-editor/` — standalone editor test page
- `app/dashboard/` — authenticated area with shared header/footer/nav layout
- `app/dashboard/(overview)/` — dashboard home, docs (MDX pages with changelog)
- `app/dashboard/(super)/admin/` — super-admin-only pages (overview, account, files, templates)
- `app/dashboard/(custom-layout)/admin/templates/[id]/` — template editor with custom layout
- `app/dashboard/manage/` — post management, announcements (`org_public`), individual posts (`post/[id]`)
- `app/dashboard/filecenter/` — file browsing (read-only)
- `app/dashboard/setting/` — personal settings
- `app/dashboard/reject/` — access denied page

### Component Structure

- `components/ui/` — ~129 shadcn/ui + Plate.js editor UI components
- `components/editor/` — ~61 editor plugin configs (Plate.js plugins)
- `components/table/` — reusable data table components (TanStack Table)
- `components/ann-editor/` — announcement rich-text editor (Plate.js)
- `app/ui/` — app-level UI: login form, theme/style/font/mode switches, brand logo, icons

### Key Patterns

- **Server Actions** (`'use server'`) for all mutations — no REST API endpoints for CRUD
- **Data Access Layer** (`lib/dal.ts`) — `verifySession()`, `getUser()`, `checkSuperAdmin()` with `react` `cache()` for request-level deduplication
- **Route Groups** for layout segmentation: `(overview)`, `(super)`, `(custom-layout)`
- **Middleware** (`middleware.ts`) handles auth redirects and super_admin guard for `/dashboard/admin/*`
- **Zod schemas** (`lib/schemas.ts`) for both form validation and server-side validation

### Auth Flow

1. Login via server action in `lib/actions/auth.ts` → bcrypt verify → JWT cookie
2. Middleware redirects unauthenticated users to `/login`, authenticated users away from `/login`
3. Non-super_admin users hitting `/dashboard/admin/*` get redirected to `/dashboard/reject`
4. Server actions call `verifySession()` or `checkSuperAdmin()` for per-action authorization

### Database

Prisma schema in `prisma/schema.prisma` with SQLite (JS adapter via `@prisma/adapter-better-sqlite3`).

Key models: User (with type: super_admin/depart_admin/developer), Department (self-referencing hierarchy), Post (Plate.js JSON stored as string), PostCategory, Template, File, FileCategory, Announcement, Permission.

Prisma client singleton: `prisma/client.ts`

### Server Actions

- `lib/actions/auth.ts` — login/logout
- `lib/actions/post.action.ts` — post CRUD
- `lib/actions/template.action.ts` — template CRUD
- `lib/actions/file.action.ts` — file upload/delete
- `lib/actions/account.action.ts` — account/department management
- `lib/actions/ann.action.ts` — announcement CRUD

### Path Alias

`@/*` maps to project root (e.g., `@/lib/utils`, `@/components/ui/button`).

## Environment Variables

See `.env.example`. Required: `DATABASE_URL`, `SESSION_SECRET`, `BCRYPT_SALT_ROUNDS`, `SEED_DEVELOPMENT`, `FILE_PATH`.

## Config Files

- `config/site.ts` — site name, navigation structure, sidebar definitions
- `next.config.mjs` — MDX support (remark-gfm, remark-toc, rehype-pretty-code, rehype-slug), 3MB server action body limit, standalone output for Docker
- `components.json` — shadcn/ui config (new-york, RSC mode, slate base, CSS variables)
- `app/globals.css` — Tailwind CSS v4 configuration (theme, plugins, custom utilities)

## Docker

Multi-stage Dockerfile (`node:22-slim`, pnpm) with standalone Next.js output. `docker-compose.yml` mounts `database/`, `data/files/`, and `data/template/` as volumes. Entrypoint script runs `prisma migrate deploy` before starting the server.

---

# Agent Guide

Practical guidance for AI agents working in this codebase. Covers patterns, conventions, and pitfalls discovered during development.

## CSS & Theming

### Tailwind CSS v4 + shadcn/ui

- **Single CSS file**: All theme config lives in `app/globals.css` — no `tailwind.config.ts`, no separate `theme.css`.
- **OKLCH color format**: CSS variables use `oklch()` values, not HSL. The `@theme inline` block references variables directly via `var(--xxx)`, not wrapped in `hsl()`.
- **Color namespaces matter**: Tailwind v4 maps CSS variable names to utility classes by namespace:
  - `--color-*` → `bg-*`, `text-*`, `border-*` (all three)
  - `--background-image-*` → `bg-*` (background image only)
  - `--border-color-*` → `border-*` (border color only)
  - If a name like `sunlight` needs to be both a background image (`bg-sunlight`) and a border color (`border-sunlight`), use separate namespaces: `--background-image-sunlight` and `--border-color-sunlight`.
- **Theme switching**: `.style-zinc` / `.style-midori` classes override CSS variables. Dark mode uses `.dark` ancestor selector with `@custom-variant dark (&:is(.dark *))`.

### Custom colors defined in `@theme inline`

| Color | Usage |
|-------|-------|
| `night` / `milk` | Near-black / near-white backgrounds |
| `midori` / `midori-asai` / `midori-fukai` | Green brand colors |
| `pencil` | Dark text color |
| `sunlight` | Grid background pattern (`bg-sunlight`) + light border (`border-sunlight`) |
| `hairo` | Dark border (`border-hairo`) |
| `next` / `next-foreground` | Secondary background (not a shadcn standard) |
| `highlight` | Yellow highlight for editor marks, comments, footnotes |

## Database (Prisma + SQLite)

- **Nullable fields**: Prisma `String?` maps to `string | null`. Always handle null when reading from DB — Zod's `.default()` only applies to `undefined`, not `null`.
- **Content field**: `Post.content` and `Announcement.content` are nullable (`String?`). Use fallback: `post.content ?? emptyValueStrct`.
- **Server action validation**: When data comes from Prisma + user input (not raw form data), prefer direct type checks over Zod validation. Zod `safeParse` can fail unexpectedly with serialized server action arguments.
- **Prisma client singleton**: Always import from `@/prisma/client`, never instantiate directly.
- **Date serialization**: Prisma `DateTime` fields become `Date` objects server-side but serialize to strings across server action boundaries.

## Server Actions

- **Authorization**: Always call `verifySession()` or `checkSuperAdmin()` at the start of every server action.
- **Owner checks**: Compare `resource.authorId !== userId` and redirect to `/dashboard/reject` on mismatch.
- **No REST API**: All CRUD is done via server actions (`'use server'`). There are no API route handlers for data mutations.
- **Revalidation**: Call `revalidateTag('post', {})` after mutations that affect list pages.

## Plate.js Editor

- **Content format**: Plate.js stores content as a JSON string (`JSON.stringify(Value)`). Parse with `JSON.parse(content)` before passing to editor.
- **Empty content**: Use this default structure for empty editors:
  ```json
  [{"children":[{"text":""}],"type":"p"}]
  ```
- **Preview mode**: Use `readOnly={true}` and `variant="viewer"` for read-only mode. The `onChange` handler may still fire on mount.
- **Debounced saves**: PostEditor uses `useDebouncedCallback` (2s) for auto-save. The callback compares `JSON.stringify(value)` against stored content to detect changes.

## Auth & Middleware

- **JWT sessions**: HS256, 7-day expiry, HTTP-only cookies. Session token is `session`.
- **Middleware guards**: `/login` redirects authenticated users away. `/dashboard/admin/*` requires `super_admin` type.
- **Route groups**: `(overview)`, `(super)`, `(custom-layout)` control layout nesting without affecting URL paths.

## Common Pitfalls

1. **Zod `.default()` vs null**: `.default('value')` only applies when input is `undefined`. For nullable DB fields, use `.nullable().transform((v) => v ?? default)`.
2. **Server action serialization**: Don't rely on TypeScript `Post` type at runtime in server actions — Dates become strings, extra fields may be present.
3. **CSS `bg-*` conflicts**: If `--color-sunlight` is defined, `bg-sunlight` becomes a solid color, not the intended background image. Use `--background-image-*` namespace for patterns.
4. **Editor onChange on mount**: Plate.js may fire `onChange` during initialization. Guard debounced saves with content comparison.
5. **`@theme inline` block**: Custom Tailwind values (container sizes, font families, shadows) go in `@theme inline`, not in a separate config file.
