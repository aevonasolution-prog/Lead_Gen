import { query } from '../config/database';

export interface AdminUserRow {
  id: number;
  email: string;
  password_hash: string;
  created_at: Date;
  last_login_at: Date | null;
}

export const adminUserModel = {
  async findByEmail(email: string): Promise<AdminUserRow | null> {
    const r = await query<AdminUserRow>('SELECT * FROM admin_users WHERE email = $1', [email.toLowerCase()]);
    return r.rows[0] ?? null;
  },
  async count(): Promise<number> {
    const r = await query<{ count: string }>('SELECT COUNT(*) AS count FROM admin_users');
    return Number(r.rows[0].count);
  },
  /** Creates the admin, or resets the password if the email already exists. */
  async upsert(email: string, passwordHash: string): Promise<void> {
    await query(
      `INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [email.toLowerCase(), passwordHash]
    );
  },
  async touchLogin(id: number): Promise<void> {
    await query('UPDATE admin_users SET last_login_at = $1 WHERE id = $2', [new Date(), id]);
  },
};
