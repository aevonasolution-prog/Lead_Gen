import { CorsOptions } from 'cors';
import { env } from './env';

export const corsOptions: CorsOptions = {
  origin(origin, cb) {
    // Non-browser clients (curl, health checks) send no Origin header.
    if (!origin) return cb(null, true);
    if (env.allowedOrigins.includes(origin.replace(/\/+$/, ''))) return cb(null, true);
    return cb(null, false);
  },
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Disposition'],
  maxAge: 600,
};
