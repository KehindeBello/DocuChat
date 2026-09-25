import { treeifyError, z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string()
})

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.log(`Error parsing env variables`)
  console.log(`Error: ${JSON.stringify(treeifyError(parsed.error))}`)
  process.exit(1);
}

export const config = parsed.data;