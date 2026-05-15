import type { EnvConfig } from '../schemas/env.schema';

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends EnvConfig {}
  }
}

export {};
