import SessionEntity from '@/modules/session/session.entity';

import type { EnvConfig } from '../schemas/env.schema';

type Session = Omit<SessionEntity, 'user'>;
declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends EnvConfig {}
  }

  namespace Express {
    interface Request {
      userId?: number;
      isAdmin?: boolean;
      currentSession?: Session;
      uploadedFileKey?: string | string[];
    }
  }
}

export type { Session };
