import { env } from '../config/env';
import { logger } from '../config/logger';

export const isHoneypotTripped = (value: unknown) => typeof value === 'string' && value.trim() !== '';

/** Verifies a Cloudflare Turnstile token. Returns true when Turnstile is not configured. */
export async function verifyTurnstile(token: string | undefined, ip?: string): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY) return true;
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token });
    if (ip) body.set('remoteip', ip);
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(5000),
    });
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch (err) {
    logger.error('Turnstile verification error', { error: err instanceof Error ? err.message : String(err) });
    return false;
  }
}
