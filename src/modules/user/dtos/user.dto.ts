import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { UserTier } from '@/shared/constants/user-tier';
import baseQuerySchema from '@/shared/schemas/base-query.schema';
import booleanStringSchema from '@/shared/schemas/boolean-string.schema';
import baseUserSchema from '@/shared/schemas/user.schema';

const getUsersQuerySchema = baseQuerySchema.extend({
  search: z.string('مقدار جستجو باید یک رشته باشد.').optional(),
  is_active: booleanStringSchema('مقدار وارد شده برای وضعیت فعال بودن کاربر باید یک مقدار صحیح یا غلط ( بولین ) باشد.').optional(),
  is_admin: booleanStringSchema('مقدار وارد شده برای وضعیت مدیر بودن باید یک مقدار صحیح یا غلط ( بولین ) باشد.').optional(),
  is_email_verified: booleanStringSchema('مقدار وارد شده برای تائید ایمیل باید یک مقدار صحیح یا غلط ( بولین ) باشد.').optional(),
  is_phone_verified: booleanStringSchema('مقدار وارد شده برای تائید شماره تماس باید یک مقدار صحیح یا غلط ( بولین ) باشد.').optional(),
  tier: z.enum(UserTier, 'وضعیت اشتراک معتبر نمی‌باشد.').optional(),
});
class GetUsersQueryDto extends createZodDto(getUsersQuerySchema) {}
type GetUsersQuery = z.infer<typeof getUsersQuerySchema>;

const createUserSchema = baseUserSchema;
class CreateUserDto extends createZodDto(createUserSchema) {}
type CreateUser = z.infer<typeof createUserSchema>;

const updateUserSchema = baseUserSchema.partial();
class UpdateUserDto extends createZodDto(updateUserSchema) {}
type UpdateUser = z.infer<typeof updateUserSchema>;

export type { GetUsersQuery, CreateUser, UpdateUser };
export { GetUsersQueryDto, CreateUserDto, UpdateUserDto };
