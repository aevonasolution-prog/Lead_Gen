import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { adminUserModel } from '../models/adminUserModel';
import { UnauthorizedError } from '../utils/errors';

export interface TokenClaims {
  sub: string;
  email: string;
  role: 'admin';
}

// Compared against when the email is unknown so response time doesn't reveal valid accounts.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

export async function login(email: string, password: string) {
  const user = await adminUserModel.findByEmail(email);
  const ok = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH);
  if (!user || !ok) throw new UnauthorizedError('Invalid email or password');

  await adminUserModel.touchLogin(user.id);
  const claims: TokenClaims = { sub: String(user.id), email: user.email, role: 'admin' };
  const token = jwt.sign(claims, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
    algorithm: 'HS256',
  });
  return { token, expiresIn: env.JWT_EXPIRES_IN, user: { id: user.id, email: user.email, role: 'admin' as const } };
}

export function verifyToken(token: string): TokenClaims | null {
  try {
    return jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] }) as TokenClaims;
  } catch {
    return null;
  }
}

export const hashPassword = (password: string) => bcrypt.hash(password, 12);

/** Creates the first admin from ADMIN_EMAIL / ADMIN_PASSWORD when none exists (for hosts without a shell). */
export async function bootstrapAdminFromEnv(): Promise<void> {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) return;
  if ((await adminUserModel.count()) > 0) return;
  await adminUserModel.upsert(env.ADMIN_EMAIL, await hashPassword(env.ADMIN_PASSWORD));
  logger.info('Initial admin account created from environment. Remove ADMIN_PASSWORD from the environment now.');
}
