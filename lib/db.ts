import { PrismaClient } from '@prisma/client'
import { PrismaAdapter } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

// With Prisma 7, we often need to be explicit about the adapter if using new features, 
// OR simply ensure the url is passed if not using the new config loading in client.
// However, standard usage should just work.
// The error says "PrismaClient needs to be constructed with a non-empty, valid PrismaClientOptions"
// It seems in Prisma 7, we might need to pass the adapter or url explicitly if the config isn't auto-loaded 
// or if the empty constructor is no longer valid without environment variables set in a specific way.

// Let's try reverting to standard construction with explicit datasource URL from env 
// to ensure it works in this environment.

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
})

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma || prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
