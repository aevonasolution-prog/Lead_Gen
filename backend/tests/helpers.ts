import { newDb } from 'pg-mem';
import { setPool } from '../src/config/database';
import { runMigrations } from '../src/models/migrate';
import { adminUserModel } from '../src/models/adminUserModel';
import { hashPassword } from '../src/services/authService';

export const ADMIN = { email: 'admin@example.com', password: 'correct-horse-battery' };

export async function freshDb() {
  const mem = newDb();
  const { Pool } = mem.adapters.createPg();
  setPool(new Pool());
  await runMigrations();
  await adminUserModel.upsert(ADMIN.email, await hashPassword(ADMIN.password));
}

export const validLead = (over: Record<string, unknown> = {}) => ({
  fullName: 'Eleanor Vance',
  email: 'e.vance@apexlogistics.example.co.uk',
  phone: '+44 20 7946 0192',
  location: 'Manchester, M1 4ET',
  serviceRequired: 'enterprise_solutions',
  message: 'We require technical infrastructure scoping.',
  ...over,
});
