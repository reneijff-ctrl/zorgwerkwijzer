import type {
  BundleType,
  VacancyCreditStatusDto,
} from '@/types/subscription';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('zww_access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Maakt een Stripe Checkout sessie aan voor vacaturecredits (eenmalige betaling).
 */
export async function createVacancyCreditCheckout(
  bundleType: BundleType,
): Promise<{ success: true; checkoutUrl: string } | { success: false; error: string }> {
  try {
    const res = await fetch(`${API_BASE}/payments/vacancy-credit-checkout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ bundleType }),
    });

    if (res.status === 401) {
      return { success: false, error: 'Sessie verlopen. Log opnieuw in.' };
    }
    if (res.status === 403) {
      return { success: false, error: 'Geen toegang. Alleen voor werkgevers.' };
    }
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { success: false, error: body?.message ?? 'Checkout aanmaken mislukt.' };
    }

    const data = await res.json();
    return { success: true, checkoutUrl: data.checkoutUrl };
  } catch {
    return { success: false, error: 'Kan geen verbinding maken met de server.' };
  }
}

/**
 * Geeft de huidige vacaturecredit-status terug voor de ingelogde werkgever.
 */
export async function getVacancyCreditStatus(): Promise<VacancyCreditStatusDto | null> {
  try {
    const res = await fetch(`${API_BASE}/payments/vacancy-credits`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
