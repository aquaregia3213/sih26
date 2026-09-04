import { PrismaClient } from '@prisma/client';
import { env } from './env';

// Singleton instance pattern for PrismaClient
let prisma: PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var __db__: PrismaClient | undefined;
}

if (env.isProduction) {
  prisma = new PrismaClient({
    log: ['error', 'warn'],
  });
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = global.__db__;
}

/**
  Checks connectivity to the PostgreSQL database by running a lightweight query ($queryRaw).
  Returns true if reachable, false otherwise.
 */
export async function checkDatabaseConnection(): Promise<{ connected: boolean; latencyMs: number; error?: string }> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - start;
    return { connected: true, latencyMs };
  } catch (err: any) {
    const latencyMs = Date.now() - start;
    return {
      connected: false,
      latencyMs,
      error: err?.message || 'Database connection error',
    };
  }
}

/**
  Gracefully disconnects Prisma client on application shutdown.
 */
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}

export { prisma };
