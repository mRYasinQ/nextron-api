import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const baseSessionSchema = z.object({
  browser: z.string().max(60),
  os: z.string().max(60),
  token: z.string().max(80),
  user_id: z.number(),
  expire_at: z.date(),
});

const createSessionSchema = baseSessionSchema;
class CreateSessionDto extends createZodDto(createSessionSchema) {}
type CreateSession = z.infer<typeof createSessionSchema>;

export type { CreateSession };
export { CreateSessionDto };
