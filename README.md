# MURASAKI Docs

A Simple Document management system — Next.js + Prisma + SQLite + Tailwind CSS + shadcn/ui

## Quick Start

```bash
pnpm install                           # install dependencies
pnpm prisma generate                   # generate Prisma client
pnpm prisma migrate dev                # run database migrations in development
SEED_DEVELOPMENT=true pnpm seed        # seed demo data
pnpm dev                               # start development server
```

Visit http://localhost:3000

Default login: `super_admin` / `super_admin`

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Production server |
| `pnpm lint` | Run ESLint |
| `pnpm seed` | Seed demo data |

## Docker Deployment

### 1. Prepare Environment Variables

Create a `.env` file from the template:

```bash
cp .env.example .env
```

Edit `.env` and update at least the following:

```env
DATABASE_URL=file:./dev.db
SESSION_SECRET=<generate a random secret with: openssl rand -base64 32>
BCRYPT_SALT_ROUNDS=12
SEED_DEVELOPMENT=true        # set to true on first run to seed demo data, then change to false
FILE_PATH=/file
```

> docker-compose injects `.env` into the container via `env_file`, so no duplicate configuration is needed.

### 2. Build and Start

```bash
docker compose up -d --build
```

The first build takes longer as it installs dependencies, generates the Prisma client, and compiles Next.js. Subsequent builds benefit from Docker layer caching.

### 3. Startup Process

When the container starts, the entrypoint script [docker-entrypoint.sh](scripts/docker-entrypoint.sh) runs automatically:

1. `npx prisma migrate deploy` — runs database migrations to create/update table schemas
2. If `SEED_DEVELOPMENT=true`, runs the seed script to populate demo data
3. `node server.js` — starts the Next.js production server

Once started, visit http://localhost:3000.

Default login: `super_admin` / `super_admin`

### 4. Common Operations

```bash
# View logs
docker compose logs -f

# Stop the service
docker compose down

# Rebuild and restart (after code changes)
docker compose up -d --build

# Enter the container shell
docker compose exec app sh
```

### 5. Data Persistence

The following host directories are mounted as volumes into the container. Data survives container rebuilds:

| Host Path | Container Path | Purpose |
|---|---|---|
| `./database` | `/app/database` | SQLite database files |
| `./data/files` | `/app/public/file` | User-uploaded files |
| `./data/template` | `/app/public/template` | Template files |

### 6. Production Recommendations

- Set `SEED_DEVELOPMENT` to `false` to avoid re-seeding data on every startup
- Use a strong random value for `SESSION_SECRET` (`openssl rand -base64 32`)
- For HTTPS, place an Nginx reverse proxy in front of the container
- Back up the `./database` directory regularly
