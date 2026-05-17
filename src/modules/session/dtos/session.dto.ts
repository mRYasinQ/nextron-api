import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import baseQuerySchema from '@/shared/schemas/base-query.schema';
import booleanStringSchema from '@/shared/schemas/boolean-string.schema';

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

const getSessionsQuerySchema = baseQuerySchema;
class GetSessionsQueryDto extends createZodDto(getSessionsQuerySchema) {}
type GetSessionsQuery = z.infer<typeof getSessionsQuerySchema>;

const clearSessionsSchema = z.object({
  include_current: booleanStringSchema('مقدار وارد شده برای نشست فعلی باید یک مقدار صحیح یا غلط ( بولین ) باشد.').default(false),
});
class ClearSessionsDto extends createZodDto(clearSessionsSchema) {}
type ClearSessions = z.infer<typeof clearSessionsSchema>;

export type { CreateSession, GetSessionsQuery, ClearSessions };
export { CreateSessionDto, GetSessionsQueryDto, ClearSessionsDto };
