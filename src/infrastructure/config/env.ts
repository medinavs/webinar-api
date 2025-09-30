import 'dotenv/config'
import { z } from 'zod'

const schema = z.object({
    ENV: z.enum(['dev', 'prod']).default('dev'),
    PORT: z.coerce.number().default(8080),
    DATABASE_URL: z.string(),
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
    console.error('❌ Invalid Environment Variables', z.treeifyError(parsed.error))

    throw new Error('Invalid Environment Variables.')
}

export const env = {
    ...parsed.data,
    IS_DEVELOP_MODE: parsed.data.ENV === 'dev'
}