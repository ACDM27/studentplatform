/// <reference types="vite/client" />

declare module 'vite/client' {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly DEV: boolean;
    readonly NODE_ENV: string;
    // 可以在此处添加更多环境变量
  }
}