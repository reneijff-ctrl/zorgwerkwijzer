import { AuthResponse } from '@/types/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

export interface EmployerRegistrationRequest {
  companyName: string;
  contactName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  website?: string;
  kvkNumber: string;
}

export type EmployerRegisterResult =
  | { success: true; data: AuthResponse }
  | { success: false; error: string; fieldErrors?: Record<string, string> };

export async function registerEmployer(
  data: EmployerRegistrationRequest
): Promise<EmployerRegisterResult> {
  try {
    const res = await fetch(
      `${API_BASE}/auth/register-employer`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    );

    if (res.ok) {
      const json: AuthResponse = await res.json();
      return { success: true, data: json };
    }

    // Parse field validation errors (400)
    if (res.status === 400) {
      const body = await res.json().catch(() => null);
      const fieldErrors: Record<string, string> = {};
      if (body?.fieldErrors) {
        Object.assign(fieldErrors, body.fieldErrors);
      }
      return {
        success: false,
        error: body?.message ?? 'Validatie mislukt. Controleer de ingevoerde gegevens.',
        fieldErrors,
      };
    }

    // 409 Conflict — email already registered
    if (res.status === 409) {
      return { success: false, error: 'Dit e-mailadres is al geregistreerd.' };
    }

    return { success: false, error: 'Er is een fout opgetreden. Probeer het opnieuw.' };
  } catch {
    return { success: false, error: 'Kan geen verbinding maken met de server. Probeer het later opnieuw.' };
  }
}
