import { describe, expect, it } from 'bun:test';
import { emailSchema, normalizeEmail } from '@/lib/validation';

describe('email normalization', () => {
  it('normalizes basic emails', () => {
    expect(normalizeEmail('USER@EXAMPLE.COM')).toBe('user@example.com');
    expect(normalizeEmail(' user@example.com ')).toBe('user@example.com');
  });

  it('handles sub-addressing', () => {
    const testCases = [
      'user+test@example.com',
      'user+github@example.com',
      'user+anything@example.com',
    ];

    for (const email of testCases) {
      expect(normalizeEmail(email)).toBe('user@example.com');
    }
  });

  it('preserves emails without sub-addressing', () => {
    expect(normalizeEmail('user@example.com')).toBe('user@example.com');
  });
});

describe('email schema validation', () => {
  it('validates and normalizes valid emails', () => {
    const result = emailSchema.safeParse('User+Test@Example.com');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('user@example.com');
    }
  });

  it('rejects invalid emails', () => {
    const result = emailSchema.safeParse('not-an-email');
    expect(result.success).toBe(false);
  });

  it('rejects emails exceeding max length', () => {
    const longLocal = 'a'.repeat(200);
    const longEmail = `${longLocal}@example.com`;
    const result = emailSchema.safeParse(longEmail);
    expect(result.success).toBe(false);
  });
});
