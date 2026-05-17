import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import baseUserSchema from '@/shared/schemas/user.schema';

const updateProfileSchema = baseUserSchema
  .omit({ is_active: true, is_admin: true, is_email_verified: true, is_phone_verified: true })
  .partial();
class UpdateProfileDto extends createZodDto(updateProfileSchema) {}
type UpdateProfile = z.infer<typeof updateProfileSchema>;

export type { UpdateProfile };
export { UpdateProfileDto };
