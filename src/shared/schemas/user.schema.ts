import { z } from 'zod';

import booleanStringSchema from './boolean-string.schema';

const PHONE_NUMBER_REGEX = /^((98)|(\+98)|(0098)|(0))([\- ]?)(\d{3})([\- ]?)(\d{3})([\- ]?)(\d{4})$/i;

const phoneNumberSchema = z
  .string('شماره تماس الزامی می‌باشد.')
  .trim()
  .regex(PHONE_NUMBER_REGEX, 'فرمت شماره تماس نادرست می‌باشد.')
  .transform((val) => {
    const cleanVal = val.replace(/[\- ]/g, '');
    const mainPart = cleanVal.slice(-10);
    const phoneNumber = `0${mainPart}`;
    return phoneNumber;
  });
const emailSchema = z.email('ایمیل معتبر نمی‌باشد.').toLowerCase();
const passwordSchema = z
  .string('گذرواژه باید رشته باشد.')
  .min(8, 'گذرواژه باید حداقل ۸ کارکتر باشد.')
  .max(32, 'گذرواژه می‌تواند حداکثر ۳۲ کاراکتر باشد.');

const baseUserSchema = z.object({
  first_name: z
    .string('نام باید رشته باشد.')
    .min(2, 'نام باید حداقل ۲ کاراکتر باشد.')
    .max(30, 'نام می‌تواند حداکثر ۳۰ کاراکتر باشد.')
    .nullable()
    .optional(),
  last_name: z
    .string('نام خانوادگی باید رشته باشد.')
    .min(2, 'نام خانوادگی باید حداقل ۲ کاراکتر باشد.')
    .max(30, 'نام خانوادگی می‌تواند حداکثر ۳۰ کاراکتر باشد.')
    .nullable()
    .optional(),
  email: emailSchema,
  phone_number: phoneNumberSchema,
  password: passwordSchema,
  is_active: booleanStringSchema('مقدار وارد شده برای فعال بودن کاربر باید یک مقدار صحیح یا غلط ( بولین ) باشد.').optional(),
  is_admin: booleanStringSchema('مقدار وارد شده برای وضعیت مدیر بودن کاربر باید یک مقدار صحیح یا غلط ( بولین ) باشد.').optional(),
  is_email_verified: booleanStringSchema('مقدار وارد شده برای تائید ایمیل باید یک مقدار صحیح یا غلط ( بولین ) باشد.').optional(),
  is_phone_verfied: booleanStringSchema('مقدار وارد شده برای تائید شماره تماس باید یک مقدار صحیح یا غلط ( بولین ) باشد.').optional(),
});

export { emailSchema, phoneNumberSchema, passwordSchema };
export default baseUserSchema;
