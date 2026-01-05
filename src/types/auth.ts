import type { auth } from '@/lib/auth';
import type { UserRole } from '@/types/database';

// Infer session type from Better Auth
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user & { role: UserRole };

// Role type for guards
export type Role = UserRole;
