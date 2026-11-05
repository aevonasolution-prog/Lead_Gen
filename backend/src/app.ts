import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { corsOptions } from './config/cors';
import { env } from './config/env';
import { errorHandler, notFound } from './middleware/errorHandler';
import { globalLimiter } from './middleware/rateLimiter';
import { requestLogger } from './middleware/requestLogger';
import { apiRouter, RouteOptions } from './routes';

export function createApp(opts: RouteOptions = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', env.trustProxy);

  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(express.json({ limit: '20kb' }));
  if (!env.isTest) app.use(requestLogger);

  app.use(env.API_PREFIX, (_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });
  app.use(env.API_PREFIX, globalLimiter());
  app.use(env.API_PREFIX, apiRouter(opts));

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
