interface ImportMetaEnv {
  readonly VITE_SEASONED_API: string;
  readonly VITE_ELASTIC: string;
  readonly VITE_ELASTIC_INDEX: string;
  readonly VITE_SEASONED_DOMAIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
