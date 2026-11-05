import nodemailer, { Transporter } from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../config/logger';

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) return transporter;
  if (!env.SMTP_HOST) {
    // No SMTP configured (local dev): mails are rendered but not delivered.
    logger.warn('SMTP_HOST not set: emails will be logged, not delivered');
    transporter = nodemailer.createTransport({ jsonTransport: true });
  } else {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: env.SMTP_USER && env.SMTP_PASS ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
    });
  }
  return transporter;
}

export interface MailInput {
  to: string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

export function fromAddress() {
  const address = env.NOTIFICATION_FROM_EMAIL ?? env.SMTP_USER ?? 'no-reply@localhost';
  return { name: env.NOTIFICATION_FROM_NAME, address };
}

export async function sendMail(input: MailInput): Promise<void> {
  await getTransporter().sendMail({ from: fromAddress(), ...input });
}

/** Used by the health/diagnostic script to confirm SMTP credentials work. */
export async function verifySmtp(): Promise<void> {
  await getTransporter().verify();
}
