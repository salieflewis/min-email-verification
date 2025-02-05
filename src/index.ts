import { db } from '@/db/drizzle';
import { users, verificationTokens } from '@/db/schema';
import { sendVerificationEmail } from '@/lib/email';
import { generateOTP, verifyOTP } from '@/lib/otp';
import { verifyEmailSchema, verifyOTPSchema } from '@/lib/validation';
import { rateLimitVerification } from '@/middleware/rateLimit';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';

const app = new Hono();

app.post('/verify-email', rateLimitVerification, async (c) => {
  const result = verifyEmailSchema.safeParse(await c.req.json());

  if (!result.success) {
    return c.json({ error: result.error.issues }, 400);
  }

  const { email } = result.data;

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    return c.json({ message: 'Verification email sent' }, 200);
  }

  const otp = generateOTP(email);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await db.transaction(async (tx) => {
    const [user] = await tx.insert(users).values({ email }).returning();

    await tx.insert(verificationTokens).values({
      userId: user.id,
      token: otp,
      expiresAt,
    });
  });

  await sendVerificationEmail(email, otp);

  return c.json({ message: 'Verification email sent' });
});

app.post('/verify-otp', rateLimitVerification, async (c) => {
  const result = verifyOTPSchema.safeParse(await c.req.json());

  if (!result.success) {
    return c.json({ error: result.error.issues }, 400);
  }

  const { email, otp } = result.data;

  if (!verifyOTP(email, otp)) {
    return c.json({ error: 'Invalid or expired token' }, 400);
  }

  await db
    .update(users)
    .set({ emailVerified: true })
    .where(eq(users.email, email));

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (user) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.userId, user.id));
  }

  return c.json({ message: 'Email verified successfully' });
});

export default app;
