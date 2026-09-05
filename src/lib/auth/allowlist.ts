/**
 * InfraGenie access policy.
 *
 * By default, any signed-in Supabase user can use the app. Set ALLOWED_EMAILS
 * to comma-separated regex patterns when you want to restrict access again.
 *
 * Examples:
 *   ALLOWED_EMAILS=.*@example\.com,admin@gmail\.com
 *   ALLOWED_EMAILS=alice@example\.com,bob@example\.com
 */

const DEFAULT_ALLOWED_EMAIL_PATTERNS = ['.*'];

export function allowedEmailPatterns(): string[] {
  const raw = process.env.ALLOWED_EMAILS;
  if (!raw) return DEFAULT_ALLOWED_EMAIL_PATTERNS;
  const patterns = raw
    .split(',')
    .map((pattern) => pattern.trim())
    .filter(Boolean);
  return patterns.length > 0 ? patterns : DEFAULT_ALLOWED_EMAIL_PATTERNS;
}

function matchesPattern(email: string, pattern: string): boolean {
  try {
    return new RegExp(`^(?:${pattern})$`, 'i').test(email);
  } catch {
    return email.toLowerCase() === pattern.toLowerCase();
  }
}

export function isAllowedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim();
  if (!normalized) return false;
  return allowedEmailPatterns().some((pattern) => matchesPattern(normalized, pattern));
}
