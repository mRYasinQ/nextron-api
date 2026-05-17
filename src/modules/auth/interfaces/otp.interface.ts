interface OtpPayload {
  otp: string;
  verified: boolean;
  expiresAt: number;
}

export type { OtpPayload };
