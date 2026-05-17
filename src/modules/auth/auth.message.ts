const AuthMessage = {
  LOGIN_SUCCESS: 'ورود با موفقیت انجام شد.',
  REGISTER_SUCCESS: 'ثبت‌نام با موفقیت انجام شد.',
  RECOVER_SUCCESS: 'بازنشانی گذرواژه با موفقیت انجام شد.',
  LOGOUT_SUCCESS: 'خروج از حساب کاربری با موفقیت انجام شد.',
  PHONE_VERIFIED_SUCCESS: 'شماره تماس تایید شد.',
  EMAIL_VERIFIED_SUCCESS: 'ایمیل تایید شد.',
  SENT_OTP: 'کد تایید ارسال شد.',
  VERIFIED_OTP: 'کد تایید شد.',
  OTP_ALREADY_VERIFIED: 'این کد قبلا تایید شده است.',
  PHONE_VERIFIED: 'شماره تماس تایید شده است.',
  EMAIL_VERIFIED: 'ایمیل تایید شده است.',
  PHONE_ALREADY_ASSOCIATED: 'حسابی با این شماره تماس ثبت شده است.',
  PHONE_INCORRECT: 'شماره تماس نادرست است.',
  CREDENTIALS_INCORRECT: 'شماره تماس یا گذرواژه نادرست است.',
  INVALID_OTP: 'کد تایید معتبر نمی‌باشد.',
  WAIT_BEFORE_NEW_OTP: 'لطفا :time ثانیه دیگر دوباره تلاش کنید.',
} as const;

export default AuthMessage;
