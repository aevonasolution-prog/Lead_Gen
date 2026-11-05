/**
 * Usage: npm run create-admin -- admin@yourbusiness.com 'a-long-passphrase'
 * Creates the admin account, or resets the password if the email already exists.
 */
import { closePool } from '../config/database';
import { adminUserModel } from '../models/adminUserModel';
import { runMigrations } from '../models/migrate';
import { hashPassword } from '../services/authService';

async function main() {
  const [email, password] = process.argv.slice(2);
  if (!email || !password) throw new Error("Usage: npm run create-admin -- <email> '<password>'");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('Invalid email address');
  if (password.length < 12) throw new Error('Password must be at least 12 characters');
  await runMigrations();
  await adminUserModel.upsert(email, await hashPassword(password));
  console.log(`Admin account ready: ${email.toLowerCase()}`);
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(closePool);
