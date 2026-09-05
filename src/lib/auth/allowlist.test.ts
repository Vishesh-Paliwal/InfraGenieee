import { afterEach, describe, expect, it } from 'vitest';

import { allowedEmailPatterns, isAllowedEmail } from '@/lib/auth/allowlist';

const previous = process.env.ALLOWED_EMAILS;

afterEach(() => {
  if (previous === undefined) delete process.env.ALLOWED_EMAILS;
  else process.env.ALLOWED_EMAILS = previous;
});

describe('auth access policy', () => {
  it('allows every non-empty email by default', () => {
    delete process.env.ALLOWED_EMAILS;

    expect(allowedEmailPatterns()).toEqual(['.*']);
    expect(isAllowedEmail('anyone@example.com')).toBe(true);
    expect(isAllowedEmail('person+test@gmail.com')).toBe(true);
  });

  it('can restrict access with configured regex patterns', () => {
    process.env.ALLOWED_EMAILS = '.*@example\\.com, admin@gmail\\.com ';

    expect(allowedEmailPatterns()).toEqual(['.*@example\\.com', 'admin@gmail\\.com']);
    expect(isAllowedEmail('one@example.com')).toBe(true);
    expect(isAllowedEmail('admin@gmail.com')).toBe(true);
    expect(isAllowedEmail('outsider@gmail.com')).toBe(false);
  });

  it('denies empty emails', () => {
    expect(isAllowedEmail('')).toBe(false);
    expect(isAllowedEmail('   ')).toBe(false);
    expect(isAllowedEmail(null)).toBe(false);
  });
});
