import ms, { type StringValue } from 'ms';
import { z } from 'zod';

const portSchema = z.coerce.number().int().min(1).max(65535);
const msFormatSchema = (defaultTime: StringValue) =>
  z
    .string()
    .default(defaultTime)
    .transform((val) => {
      const milliseconds = ms(val as StringValue);
      if (!milliseconds) throw new Error('Invalid time format');
      return milliseconds;
    });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('production'),
  APP_URL: z.url().default('http://localhost:3000'),
  APP_PORT: portSchema.default(3000),
  ENABLE_SWAGGER: z
    .enum(['0', '1'])
    .default('1')
    .transform((v) => v === '1'),
  CORS_ORIGINS: z
    .string()
    .optional()
    .transform((value) => {
      if (value === '*') return '*';
      return value?.split(',').map((origin) => origin.trim());
    }),

  DB_NAME: z.string().default('nextron.db'),

  OTP_EXPIRE: msFormatSchema('3m'),
  OTP_CACHE: msFormatSchema('1d'),
  SESSION_EXPIRE: msFormatSchema('15d'),

  THROTTLE_TTL: msFormatSchema('60m'),
  THROTTLE_LIMIT: z.coerce.number().default(100),
});

type EnvConfig = z.infer<typeof envSchema>;

export type { EnvConfig };
export default envSchema;
