import { PrismaClient } from '@prisma/client'

// Ensure DATABASE_URL is set, fallback to a default if not
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:/tmp/app.db'
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma