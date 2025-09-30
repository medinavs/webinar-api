import { env } from "../config/env";
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

export const prisma = new PrismaClient({
    log: env.IS_DEVELOP_MODE ? ['error', 'warn'] : []
}).$extends(withAccelerate())