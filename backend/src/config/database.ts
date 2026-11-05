import { Pool, QueryResultRow } from 'pg';
import { env } from './env';

let pool: Pool | null = null;

function createPool(): Pool {
  return new Pool({
    connectionString: env.DATABASE_URL,
    min: env.DB_POOL_MIN,
    max: env.DB_POOL_MAX,
    ssl: env.DATABASE_SSL ? { rejectUnauthorized: env.DATABASE_SSL_REJECT_UNAUTHORIZED } : undefined,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
}

export function getPool(): Pool {
  if (!pool) pool = createPool();
  return pool;
}

/** Test hook: inject an in-memory pool. */
export function setPool(p: Pool | null) {
  pool = p;
}

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []) {
  return getPool().query<T>(text, params);
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
