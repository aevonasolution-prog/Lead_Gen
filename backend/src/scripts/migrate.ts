import { closePool } from '../config/database';
import { runMigrations } from '../models/migrate';

runMigrations()
  .then((ran) => console.log(ran.length ? `Applied: ${ran.join(', ')}` : 'Database is up to date.'))
  .catch((e) => {
    console.error('Migration failed:', e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(closePool);
