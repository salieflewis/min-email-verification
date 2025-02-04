import { createHash } from 'node:crypto';
import { generateTOTP, verifyTOTP } from '@oslojs/otp';

const getKey = (email: string): Uint8Array => {
  return new TextEncoder().encode(
    createHash('sha256')
      .update(email + process.env.OTP_SECRET)
      .digest('hex')
  );
};

export const generateOTP = (email: string): string => {
  const key = getKey(email);
  return generateTOTP(key, 900, 6);
};

export const verifyOTP = (email: string, token: string): boolean => {
  const key = getKey(email);
  return verifyTOTP(key, 900, 6, token);
};
