import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Use DATABASE_URL env var if set (e.g. in Docker), otherwise default to local dev DB.
    url: process.env.DATABASE_URL ?? 'file:./prisma/dev.db',
  },
});
