import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { withAccelerate } from '@prisma/extension-accelerate';

import { PrismaClient } from '@/generated/client';

import baseSeed from './seed/seed';
import drugSeed from './seed/seed-drugs';
import wfaSeed from './seed/seed-wfa';

/**
 * Validate env early (fail fast)
 */
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    throw new Error('❌ DATABASE_URL is not set');
}

/**
 * Single Prisma instance for all seeds
 */
const adapter = new PrismaPg({
    connectionString: DATABASE_URL
});

const prisma = new PrismaClient({ adapter }).$extends(withAccelerate());
export type PrismaSeedClient = typeof prisma;
/**
 * Master seed runner
 */
async function runAllSeeds(prisma: PrismaSeedClient) {
    console.log('🚀 Starting Master Seeding Orchestration...\n');

    await baseSeed(prisma);
    console.log('✅ Base Data (Clinic / Faker) Seeded');
    console.log('--------------------------------------------------');

    await drugSeed(prisma);
    console.log('✅ NICU Drug Database Seeded');
    console.log('--------------------------------------------------');

    await wfaSeed(prisma);
    console.log('✅ WHO WFA (JSON) Seeded');
    console.log('--------------------------------------------------');

    console.log('🎉 All seeds completed successfully!');
}

/**
 * Top-level execution (Node / Bun / pnpm safe)
 */
(async () => {
    try {
        await runAllSeeds(prisma);
    } catch (error) {
        console.error('❌ Master Seeding failed:', error);
        process.exitCode = 1;
    } finally {
        await prisma.$disconnect();
    }
})();
