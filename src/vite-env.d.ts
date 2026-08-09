/// <reference types="vite/client" />

// Typed as possibly undefined on purpose: nothing guarantees the .env file is
// present, so the service layer has to check before using these.
interface ImportMetaEnv {
  readonly VITE_API_TOKEN: string | undefined;
  readonly VITE_BASE_URL: string | undefined;
}
