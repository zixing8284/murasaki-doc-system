import type { User as PrimsaUser } from '@prisma/client';

export type SafeUser = Omit<PrimsaUser, 'password' | 'email'>;

export type SessionPayload = SafeUser & {
  expiresAt: Date;
};

export type ReturnState = {
  success: boolean;
} | null;
