process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET = 'test_secret_that_is_definitely_longer_than_32_chars';
process.env.JWT_EXPIRES_IN = '1h';
process.env.NOTIFICATION_RECIPIENT_EMAIL = 'owner@example.com';
process.env.ALLOWED_ORIGINS = 'http://localhost:3000';
process.env.NOTIFICATION_RETRY_INTERVAL_MS = '0';
process.env.RATE_LIMIT_MAX_REQUESTS_PER_IP = '100000';
