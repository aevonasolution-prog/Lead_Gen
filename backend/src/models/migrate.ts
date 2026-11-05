import { getPool } from '../config/database';
import { logger } from '../config/logger';
import { migrations } from './migrations';

/** Applies any migrations not yet recorded in schema_migrations. Idempotent. */
export async function runMigrations(): Promise<string[]> {
  const pool = getPool();
  await pool.query(
    `CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`
  );
  const done = await pool.query<{ name: string }>('SELECT name FROM schema_migrations');
  const applied = new Set(done.rows.map((r) => r.name));
  const ran: string[] = [];

  for (const m of migrations) {
    if (applied.has(m.name)) continue;
    await pool.query(m.sql);
    await pool.query('INSERT INTO schema_migrations (name) VALUES ($1)', [m.name]);
    ran.push(m.name);
    logger.info('Applied migration', { migration: m.name });
  }
  return ran;
}
