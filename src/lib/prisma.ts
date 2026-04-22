import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const getDatabaseUrl = () => {
  return process.env.NEON_DATABASE_URL ||
         process.env.POSTGRES_PRISMA_URL ||
         process.env.DATABASE_URL ||
         '';
};

const adapter = new PrismaPg({ connectionString: getDatabaseUrl() });

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error'] : [],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
