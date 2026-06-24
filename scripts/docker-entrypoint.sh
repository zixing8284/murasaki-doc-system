#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

if [ "$SEED_DEVELOPMENT" = "true" ]; then
  echo "Seeding demo data..."
  node ./scripts/seed-demo.cjs || echo "Seed skipped (may already exist)"
fi

echo "Starting Next.js server..."
exec node server.js
