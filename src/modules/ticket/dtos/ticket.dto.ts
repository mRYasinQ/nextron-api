import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import baseQuerySchema from '@/shared/schemas/base-query.schema';
import fileSchema from '@/shared/schemas/file.schema';

import { TicketPriority, TicketStatus } from '../ticket.constant';

const messageSchema = z.string('متن پیام نمی‌تواند خالی باشد.').trim().min(1, 'متن پیام نمی‌تواند خالی باشد.');

const baseMessageSchema = z.object({
  message: messageSchema,
  resource: fileSchema.optional(),
});

const baseTicketSchema = baseMessageSchema.extend({
  title: z
    .string('عنوان تیکت الزامی است.')
    .trim()
    .min(3, 'عنوان تیکت باید حداقل ۳ کاراکتر باشد.')
    .max(60, 'عنوان تیکت نمی‌تواند بیشتر از ۶۰ کاراکتر باشد.'),
  status: z.enum(TicketStatus, 'وضعیت تیکت نامعتبر می‌باشد.').optional(),
  priority: z.enum(TicketPriority, 'اولویت تیکت نامعتبر می‌باشد.').optional(),
  user_id: z.coerce.number('شناسه کاربر نامعتبر است.'),
});

const getTicketsQuerySchema = baseQuerySchema.extend({
  search: z.string('فیلتر جستجو باید رشته باشد.').optional(),
  status: z.enum(TicketStatus, 'وضعیت تیکت نامعتبر می‌باشد.').optional(),
  priority: z.enum(TicketPriority, 'اولویت تیکت نامعتبر می‌باشد.').optional(),
});
class GetTicketsQueryDto extends createZodDto(getTicketsQuerySchema) {}
type GetTicketsQuery = z.infer<typeof getTicketsQuerySchema>;

const createTicketSchema = baseTicketSchema.omit({ user_id: true, status: true });
const createAdminTicketSchema = baseTicketSchema;
class CreateTicketDto extends createZodDto(createTicketSchema) {}
class CreateAdminTicketDto extends createZodDto(createAdminTicketSchema) {}
type CreateTicket = z.infer<typeof createAdminTicketSchema>;

const updateTicketSchema = baseTicketSchema
  .omit({
    user_id: true,
    message: true,
    resource: true,
  })
  .partial();
class UpdateTicketDto extends createZodDto(updateTicketSchema) {}
type UpdateTicket = z.infer<typeof updateTicketSchema>;

const getTicketMessagesQuerySchema = baseQuerySchema;
class GetTicketMessagesQueryDto extends createZodDto(getTicketMessagesQuerySchema) {}
type GetTicketMessagesQuery = z.infer<typeof getTicketMessagesQuerySchema>;

const createTicketMessageSchema = baseMessageSchema;
class CreateTicketMessageDto extends createZodDto(createTicketMessageSchema) {}
type CreateTicketMessage = z.infer<typeof createTicketMessageSchema>;

export type { GetTicketsQuery, CreateTicket, UpdateTicket, GetTicketMessagesQuery, CreateTicketMessage };
export { GetTicketsQueryDto, CreateTicketDto, CreateAdminTicketDto, UpdateTicketDto, GetTicketMessagesQueryDto, CreateTicketMessageDto };
