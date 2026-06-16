import type { LoginRequest, RegisterRequest, LoginResult, RegisterResult, TwoFactorLoginRequest, AuthResponse, AuthUser } from '@/types/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

export async function login(data: LoginRequest): Promise<LoginResult> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.status === 401 || res.status === 403) {
      return { success: false, error: 'Ongeldig e-mailadres of wachtwoord.' };
    }
    if (res.status === 423) {
      return { success: false, error: 'Account tijdelijk geblokkeerd. Probeer het later opnieuw.' };
    }
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { success: false, error: body?.message ?? 'Er is een fout opgetreden. Probeer het later opnieuw.' };
    }

    const authResponse = await res.json();
    return { success: true, data: authResponse };
  } catch {
    return { success: false, error: 'Kan geen verbinding maken met de server.' };
  }
}

export async function verifyTwoFactorLogin(
  data: TwoFactorLoginRequest
): Promise<{ success: true; data: AuthResponse } | { success: false; error: string }> {
  try {
    const res = await fetch(`${API_BASE}/auth/2fa/verify-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.status === 401 || res.status === 400) {
      const body = await res.json().catch(() => null);
      return { success: false, error: body?.message ?? 'Ongeldige of verlopen 2FA-code.' };
    }
    if (res.status === 423) {
      return { success: false, error: 'Account tijdelijk geblokkeerd vanwege te veel mislukte pogingen.' };
    }
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { success: false, error: body?.message ?? 'Er is een fout opgetreden. Probeer het later opnieuw.' };
    }
    const authResponse = await res.json();
    return { success: true, data: authResponse };
  } catch {
    return { success: false, error: 'Kan geen verbinding maken met de server.' };
  }
}

export async function getCurrentUser(token: string): Promise<AuthUser | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function register(data: RegisterRequest): Promise<RegisterResult> {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.status === 409) {
      return { success: false, error: 'Dit e-mailadres is al in gebruik.' };
    }
    if (res.status === 400) {
      const body = await res.json().catch(() => null);
      return {
        success: false,
        error: body?.message ?? 'Ongeldige gegevens. Controleer je invoer.',
        fieldErrors: body?.validationErrors,
      };
    }
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { success: false, error: body?.message ?? 'Er is een fout opgetreden. Probeer het later opnieuw.' };
    }

    const authResponse = await res.json();
    return { success: true, data: authResponse };
  } catch {
    return { success: false, error: 'Kan geen verbinding maken met de server.' };
  }
}
