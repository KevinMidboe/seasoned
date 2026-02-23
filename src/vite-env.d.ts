interface ImportMetaEnv {
  readonly VITE_SEASONED_API: string;
  readonly VITE_ELASTIC_URL: string;
  readonly VITE_ELASTIC_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
