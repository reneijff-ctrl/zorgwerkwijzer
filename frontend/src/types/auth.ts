// ─── Auth Request & Response Types ───────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface AuthUser {
  id: number;
  email: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_EMPLOYER';
  employerId: number | null;
  createdAt: string;
  twoFactorEnabled?: boolean;
}

export interface AuthResponse {
  accessToken: string | null;
  tokenType: string;
  expiresIn: number;
  user: AuthUser | null;
  requiresTwoFactor?: boolean;
  tempToken?: string;
}

export interface TwoFactorLoginRequest {
  tempToken: string;
  code: string;
}

// ─── Result wrappers (consistent met lib/api/applications.ts patroon) ─────────

export type LoginResult =
  | { success: true; data: AuthResponse }
  | { success: false; error: string };

export type RegisterResult =
  | { success: true; data: AuthResponse }
  | { success: false; error: string; fieldErrors?: Record<string, string> };
