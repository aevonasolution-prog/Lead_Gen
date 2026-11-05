import { createApp } from './app';
import { closePool } from './config/database';
import { env } from './config/env';
import { logger } from './config/logger';
import { runMigrations } from './models/migrate';
import { bootstrapAdminFromEnv } from './services/authService';
import { startNotificationRetryLoop, stopNotificationRetryLoop } from './services/notificationService';

async function main() {
  if (env.RUN_MIGRATIONS_ON_START) await runMigrations();
  await bootstrapAdminFromEnv();

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    logger.info(`API listening on port ${env.PORT}`, { prefix: env.API_PREFIX, env: env.NODE_ENV });
  });
  startNotificationRetryLoop();

  const shutdown = (signal: string) => {
    logger.info(`${signal} received, shutting down`);
    stopNotificationRetryLoop();
    server.close(async () => {
      await closePool();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((err) => {
  logger.error('Failed to start server', { error: err instanceof Error ? err.message : String(err) });
  process.exit(1);
});
