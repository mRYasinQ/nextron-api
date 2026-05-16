import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import baseUserSchema from '@/shared/schemas/user.schema';

const createUserSchema = baseUserSchema;
class CreateUserDto extends createZodDto(createUserSchema) {}
type CreateUser = z.infer<typeof createUserSchema>;

const updateUserSchema = baseUserSchema.partial();
class UpdateUserDto extends createZodDto(updateUserSchema) {}
type UpdateUser = z.infer<typeof updateUserSchema>;

export type { CreateUser, UpdateUser };
export { CreateUserDto, UpdateUserDto };
