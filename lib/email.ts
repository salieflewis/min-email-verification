import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, otp: string) {
  return resend.emails.send({
    from: 'verification@yourdomain.com',
    to: email,
    subject: 'Verify your email',
    html: `Your verification code is: ${otp}. This code will expire in 15 minutes.`,
  });
}
