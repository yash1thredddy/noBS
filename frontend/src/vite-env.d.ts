/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ORCID_CLIENT_ID: string
  readonly VITE_ORCID_REDIRECT_URI: string
  readonly VITE_ORCID_AUTH_URL: string
  readonly VITE_ORCID_TOKEN_URL: string
  readonly VITE_ORCID_API_URL: string
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}


