import { env } from './env';

type Level = 'debug' | 'info' | 'warn' | 'error';
const order: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const threshold = env.isTest ? 100 : env.isProduction ? order.info : order.debug;

function log(level: Level, msg: string, meta?: Record<string, unknown>) {
  if (order[level] < threshold) return;
  const line = JSON.stringify({ time: new Date().toISOString(), level, msg, ...meta });
  (level === 'error' ? console.error : console.log)(line);
}

/**
 * Minimal structured logger. Never pass personal data (names, emails, phones,
 * message bodies) in `meta`; log lead IDs only.
 */
export const logger = {
  debug: (msg: string, meta?: Record<string, unknown>) => log('debug', msg, meta),
  info: (msg: string, meta?: Record<string, unknown>) => log('info', msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => log('warn', msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => log('error', msg, meta),
};
