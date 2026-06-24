import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const prismaClientSingleton = () => {
  const adapter = new PrismaBetterSqlite3(
    { url: process.env.DATABASE_URL ?? 'file:./prisma/dev.db' },
    // Keep DateTime values stored as unix epoch (ms) for backward
    // compatibility with data written by Prisma's legacy native driver.
    { timestampFormat: 'unixepoch-ms' },
  );
  return new PrismaClient({ adapter });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
