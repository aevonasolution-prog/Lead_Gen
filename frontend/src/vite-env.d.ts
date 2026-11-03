/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_API_TIMEOUT_MS?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_SITE_NAME?: string;
  readonly VITE_APP_ENV?: string;
  readonly VITE_ENABLE_DEV_MOCK_SUBMISSION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
