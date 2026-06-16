import type {
  SubscriptionPackage,
  EmployerSubscription,
  CheckoutResponse,
  PortalResponse,
  ChangeSubscriptionRequest,
} from '@/types/subscription';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('zww_access_token');
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

export async function getSubscriptionPackages(): Promise<SubscriptionPackage[]> {
  try {
    const res = await fetch(`${API_BASE}/subscriptions/packages`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getCurrentSubscription(): Promise<EmployerSubscription | null> {
  try {
    const res = await fetch(`${API_BASE}/subscriptions/current`, {
      cache: 'no-store',
      headers: getAuthHeaders(),
    });
    if (res.status === 204) return null;
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function createCheckoutSession(
  packageId: number,
  billingInterval: 'MONTHLY' | 'YEARLY',
  successUrl: string,
  cancelUrl: string,
): Promise<{ success: true; data: CheckoutResponse } | { success: false; error: string }> {
  try {
    const res = await fetch(`${API_BASE}/subscriptions/checkout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ packageId, billingInterval, successUrl, cancelUrl }),
    });
    if (res.status === 409) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body.message ?? 'Je hebt al een actief abonnement.' };
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body.message ?? 'Kan geen betaalsessie aanmaken.' };
    }
    const data: CheckoutResponse = await res.json();
    return { success: true, data };
  } catch {
    return { success: false, error: 'Kan geen verbinding maken met de server.' };
  }
}

export async function createCustomerPortalSession(
  returnUrl: string,
): Promise<{ success: true; data: PortalResponse } | { success: false; error: string }> {
  try {
    const res = await fetch(`${API_BASE}/subscriptions/portal`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ returnUrl }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body.message ?? 'Kan het facturatieportaal niet openen.' };
    }
    const data: PortalResponse = await res.json();
    return { success: true, data };
  } catch {
    return { success: false, error: 'Kan geen verbinding maken met de server.' };
  }
}

export async function syncSubscriptionWithStripe(): Promise<
  { success: true; data: EmployerSubscription } | { success: false; error: string }
> {
  try {
    const res = await fetch(`${API_BASE}/subscriptions/sync`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body.message ?? 'Synchronisatie mislukt.' };
    }
    const data: EmployerSubscription = await res.json();
    return { success: true, data };
  } catch {
    return { success: false, error: 'Kan geen verbinding maken met de server.' };
  }
}

export async function changeSubscriptionPackage(
  request: ChangeSubscriptionRequest,
): Promise<{ success: true; data: EmployerSubscription } | { success: false; error: string }> {
  try {
    const res = await fetch(`${API_BASE}/subscriptions/change`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });
    if (res.status === 409) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body.message ?? 'Abonnement kan niet gewijzigd worden.' };
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body.message ?? 'Abonnementswijziging mislukt.' };
    }
    const data: EmployerSubscription = await res.json();
    return { success: true, data };
  } catch {
    return { success: false, error: 'Kan geen verbinding maken met de server.' };
  }
}
