/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_HEADER_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}