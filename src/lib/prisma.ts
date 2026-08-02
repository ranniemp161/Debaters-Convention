import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createFallbackPrismaClient() {
    const fallbackModel = {
        findMany: async () => [],
        findFirst: async () => null,
        findUnique: async () => null,
        findUniqueOrThrow: async () => null,
        count: async () => 0,
        aggregate: async () => null,
        groupBy: async () => [],
        create: async () => null,
        createMany: async () => ({ count: 0 }),
        update: async () => null,
        updateMany: async () => ({ count: 0 }),
        delete: async () => null,
        deleteMany: async () => ({ count: 0 }),
        upsert: async () => null,
    }

    return {
        article: fallbackModel,
        category: fallbackModel,
        user: fallbackModel,
        comment: fallbackModel,
        debate: fallbackModel,
        $connect: async () => undefined,
        $disconnect: async () => undefined,
        $transaction: async (_args: unknown, fn?: unknown) => {
            if (typeof fn === 'function') {
                return await fn()
            }
            return undefined
        },
    } as unknown as PrismaClient
}

const prismaClient = process.env.DATABASE_URL
    ? new PrismaClient()
    : createFallbackPrismaClient()

export const prisma = globalForPrisma.prisma || prismaClient

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
