declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      APP_URL: string;
      APP_PORT: string;
      ENABLE_SWAGGER: string;
    }
  }
}

export {};
