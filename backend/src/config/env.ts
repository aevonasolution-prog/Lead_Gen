import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

/** Treat empty strings in .env (e.g. `SMTP_PASS=`) as "not set". */
const optional = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === '' ? undefined : v), schema.optional());

const bool = (def: boolean) =>
  z.preprocess(
    (v) => (v === undefined || v === '' ? def : String(v).toLowerCase() === 'true'),
    z.boolean()
  );

const PLACEHOLDER_SECRET = 'replace_with_a_secure_random_jwt_secret_token_in_production';

const schema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(5000),
    API_PREFIX: z.string().default('/api'),
    ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),
    /** Number of reverse-proxy hops to trust for client IP (rate limiting). 1 on Render/Railway/Nginx. */
    TRUST_PROXY: z.coerce.number().int().min(0).default(0),

    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    DATABASE_SSL: bool(false),
    DATABASE_SSL_REJECT_UNAUTHORIZED: bool(true),
    DB_POOL_MIN: z.coerce.number().int().min(0).default(2),
    DB_POOL_MAX: z.coerce.number().int().min(1).default(10),
    RUN_MIGRATIONS_ON_START: bool(true),

    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    JWT_EXPIRES_IN: z.string().default('12h'),

    ADMIN_EMAIL: optional(z.string().email()),
    ADMIN_PASSWORD: optional(z.string().min(12, 'ADMIN_PASSWORD must be at least 12 characters')),

    SMTP_HOST: optional(z.string()),
    SMTP_PORT: z.coerce.number().int().positive().default(587),
    SMTP_SECURE: bool(false),
    SMTP_USER: optional(z.string()),
    SMTP_PASS: optional(z.string()),
    NOTIFICATION_RECIPIENT_EMAIL: optional(z.string()),
    NOTIFICATION_FROM_NAME: z.string().default('Lead Notification'),
    /** Must be an address on your authenticated domain (SPF/DKIM aligned). Defaults to SMTP_USER. */
    NOTIFICATION_FROM_EMAIL: optional(z.string().email()),
    NOTIFICATION_RETRY_INTERVAL_MS: z.coerce.number().int().min(0).default(300000),

    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
    RATE_LIMIT_MAX_REQUESTS_PER_IP: z.coerce.number().int().positive().default(100),
    LEAD_SUBMISSION_MAX_PER_HOUR: z.coerce.number().int().positive().default(10),
    LOGIN_MAX_ATTEMPTS_PER_15_MIN: z.coerce.number().int().positive().default(10),

    /** Cloudflare Turnstile secret. When set, POST /leads requires a valid `turnstileToken`. */
    TURNSTILE_SECRET_KEY: optional(z.string()),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV === 'production') {
      if (env.JWT_SECRET === PLACEHOLDER_SECRET) {
        ctx.addIssue({ code: 'custom', path: ['JWT_SECRET'], message: 'Replace the placeholder JWT_SECRET' });
      }
      if (!env.SMTP_HOST) {
        ctx.addIssue({ code: 'custom', path: ['SMTP_HOST'], message: 'SMTP_HOST is required in production' });
      }
      if (!env.NOTIFICATION_RECIPIENT_EMAIL) {
        ctx.addIssue({
          code: 'custom',
          path: ['NOTIFICATION_RECIPIENT_EMAIL'],
          message: 'NOTIFICATION_RECIPIENT_EMAIL is required in production',
        });
      }
    }
    if (env.NOTIFICATION_RECIPIENT_EMAIL) {
      const bad = env.NOTIFICATION_RECIPIENT_EMAIL.split(',')
        .map((s) => s.trim())
        .filter((s) => !z.string().email().safeParse(s).success);
      if (bad.length) {
        ctx.addIssue({
          code: 'custom',
          path: ['NOTIFICATION_RECIPIENT_EMAIL'],
          message: `Invalid recipient address(es): ${bad.join(', ')}`,
        });
      }
    }
  });

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const lines = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
  // eslint-disable-next-line no-console
  console.error(`\nInvalid environment configuration:\n${lines}\n`);
  process.exit(1);
}

const raw = parsed.data;

export const env = {
  ...raw,
  isProduction: raw.NODE_ENV === 'production',
  isTest: raw.NODE_ENV === 'test',
  allowedOrigins: raw.ALLOWED_ORIGINS.split(',')
    .map((o) => o.trim().replace(/\/+$/, ''))
    .filter(Boolean),
  notificationRecipients: (raw.NOTIFICATION_RECIPIENT_EMAIL ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  trustProxy: raw.TRUST_PROXY,
};

export type Env = typeof env;
