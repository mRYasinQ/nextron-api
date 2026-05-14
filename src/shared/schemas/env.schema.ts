import { z } from 'zod';

const portSchema = z.coerce.number().int().min(1).max(65535);

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('production'),
  APP_URL: z.url().default('http://localhost:3000'),
  APP_PORT: portSchema.default(3000),
  ENABLE_SWAGGER: z
    .enum(['0', '1'])
    .default('1')
    .transform((v) => v === '1'),
});

type EnvConfig = z.infer<typeof envSchema>;

export type { EnvConfig };
export default envSchema;
