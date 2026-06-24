# ---- Stage 1: Install dependencies ----
FROM node:22-slim AS deps

RUN corepack enable && corepack prepare pnpm@10.28.2 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# ---- Stage 2: Build ----
FROM node:22-slim AS build

RUN corepack enable && corepack prepare pnpm@10.28.2 --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js (standalone output)
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ---- Stage 3: Runtime ----
FROM node:22-slim AS runtime

RUN corepack enable && corepack prepare pnpm@10.28.2 --activate

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy standalone output
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

# Copy Prisma config, migrations and node_modules (needed for migrate deploy at startup)
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules ./node_modules

# Copy scripts
COPY scripts/ ./scripts/
RUN chmod +x ./scripts/docker-entrypoint.sh

# Create volume mount points
RUN mkdir -p /app/database /app/public/file /app/public/template /app/public/tmp

EXPOSE 3000

ENTRYPOINT ["./scripts/docker-entrypoint.sh"]
