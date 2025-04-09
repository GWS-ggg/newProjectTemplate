/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_REQ_URL: string
  readonly [key: string]: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
