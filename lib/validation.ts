import { z } from 'zod';

export const normalizeEmail = (email: string): string => {
  const [localPart, domain] = email.toLowerCase().trim().split('@');
  const normalizedLocal = localPart.split('+')[0];
  return `${normalizedLocal}@${domain}`;
};

export const emailSchema = z
  .string()
  .email('Invalid email address')
  .transform(normalizeEmail)
  .refine(
    (email) => email.length <= 255,
    'Email must not exceed 255 characters'
  );

export const otpSchema = z
  .string()
  .length(6)
  .regex(/^\d+$/, 'OTP must contain only numbers');

export const verifyEmailSchema = z.object({
  email: emailSchema,
});

export const verifyOTPSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
});
