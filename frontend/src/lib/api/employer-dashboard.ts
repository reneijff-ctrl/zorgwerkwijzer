import type { PageResponse } from '@/types/api';
import type {
  DashboardVacancyDto,
  DashboardVacancyCreateRequest,
  DashboardApplicationDto,
  VacancyDeleteResult,
} from '@/types/dashboard';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('zww_access_token');
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp < Math.floor(Date.now() / 1000);
  } catch {
    return true;
  }
}

function getValidToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('zww_access_token');
  if (isTokenExpired(token)) {
    localStorage.removeItem('zww_access_token');
    localStorage.removeItem('zww_user');
    return null;
  }
  return token;
}

// ─── Vacatures ────────────────────────────────────────────────────────────────

export async function getDashboardVacancies(
  page = 0,
  size = 20,
): Promise<PageResponse<DashboardVacancyDto> | null> {
  try {
    const res = await fetch(
      `${API_BASE}/employer-dashboard/vacancies?page=${page}&size=${size}`,
      { cache: 'no-store', headers: getAuthHeaders() },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function createDashboardVacancy(
  data: DashboardVacancyCreateRequest,
): Promise<
  | { success: true; data: DashboardVacancyDto }
  | { success: false; error: string; subscriptionError?: boolean; fieldErrors?: Record<string, string>; sessionExpired?: boolean }
> {
  try {
    const token = getValidToken();
    if (!token) {
      return {
        success: false,
        sessionExpired: true,
        error: 'Je sessie is verlopen. Log opnieuw in om door te gaan.',
      };
    }

    const res = await fetch(`${API_BASE}/employer-dashboard/vacancies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });

    if (res.status === 401) {
      localStorage.removeItem('zww_access_token');
      localStorage.removeItem('zww_user');
      return {
        success: false,
        sessionExpired: true,
        error: 'Je sessie is verlopen. Log opnieuw in om door te gaan.',
      };
    }
    if (res.status === 400) {
      const body = await res.json();
      return { success: false, error: body.message ?? 'Ongeldige gegevens.', fieldErrors: body.validationErrors };
    }
    if (res.status === 402) {
      const body = await res.json().catch(() => null);
      return {
        success: false,
        subscriptionError: true,
        error: body?.message ?? 'Je abonnement is niet actief. Activeer eerst een abonnement.',
      };
    }
    if (res.status === 409) {
      return { success: false, error: 'Slug is al in gebruik. Kies een andere titel of slug.' };
    }
    if (!res.ok) {
      return { success: false, error: 'Er is een fout opgetreden. Probeer het later opnieuw.' };
    }

    const vacancy: DashboardVacancyDto = await res.json();
    fetch('/api/revalidate', { method: 'POST' }).catch(() => null);
    return { success: true, data: vacancy };
  } catch {
    return { success: false, error: 'Kan geen verbinding maken met de server.' };
  }
}

export async function updateDashboardVacancy(
  id: number,
  data: DashboardVacancyCreateRequest,
): Promise<{ success: true; data: DashboardVacancyDto } | { success: false; error: string; fieldErrors?: Record<string, string>; sessionExpired?: boolean }> {
  try {
    const token = getValidToken();
    if (!token) {
      return {
        success: false,
        sessionExpired: true,
        error: 'Je sessie is verlopen. Log opnieuw in om door te gaan.',
      };
    }

    const res = await fetch(`${API_BASE}/employer-dashboard/vacancies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });

    if (res.status === 400) {
      const body = await res.json();
      return { success: false, error: body.message ?? 'Ongeldige gegevens.', fieldErrors: body.validationErrors };
    }
    if (res.status === 401) {
      localStorage.removeItem('zww_access_token');
      localStorage.removeItem('zww_user');
      return {
        success: false,
        sessionExpired: true,
        error: 'Je sessie is verlopen. Log opnieuw in om door te gaan.',
      };
    }
    if (res.status === 403) {
      return { success: false, error: 'Je hebt geen toegang tot deze vacature.' };
    }
    if (res.status === 404) {
      return { success: false, error: 'Vacature niet gevonden.' };
    }
    if (!res.ok) {
      return { success: false, error: 'Er is een fout opgetreden. Probeer het later opnieuw.' };
    }

    const vacancy: DashboardVacancyDto = await res.json();
    fetch('/api/revalidate', { method: 'POST' }).catch(() => null);
    return { success: true, data: vacancy };
  } catch {
    return { success: false, error: 'Kan geen verbinding maken met de server.' };
  }
}

export async function deleteDashboardVacancy(
  id: number,
): Promise<{ success: true; data: VacancyDeleteResult } | { success: false; error: string }> {
  try {
    const res = await fetch(`${API_BASE}/employer-dashboard/vacancies/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (res.status === 403) {
      return { success: false, error: 'Je hebt geen toegang tot deze vacature.' };
    }
    if (res.status === 404) {
      return { success: false, error: 'Vacature niet gevonden.' };
    }
    if (!res.ok) {
      return { success: false, error: 'Er is een fout opgetreden. Probeer het later opnieuw.' };
    }

    const data: VacancyDeleteResult = await res.json();
    fetch('/api/revalidate', { method: 'POST' }).catch(() => null);
    return { success: true, data };
  } catch {
    return { success: false, error: 'Kan geen verbinding maken met de server.' };
  }
}

// ─── Sollicitaties ────────────────────────────────────────────────────────────

export async function getDashboardApplications(
  page = 0,
  size = 20,
): Promise<PageResponse<DashboardApplicationDto> | null> {
  try {
    const res = await fetch(
      `${API_BASE}/employer-dashboard/applications?page=${page}&size=${size}`,
      { cache: 'no-store', headers: getAuthHeaders() },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getDashboardApplicationById(
  id: number,
): Promise<DashboardApplicationDto | null> {
  try {
    const res = await fetch(`${API_BASE}/employer-dashboard/applications/${id}`, {
      cache: 'no-store',
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function updateApplicationStatus(
  id: number,
  status: string,
): Promise<{ success: true; data: DashboardApplicationDto } | { success: false; error: string }> {
  try {
    const res = await fetch(`${API_BASE}/employer-dashboard/applications/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (res.status === 403) {
      return { success: false, error: 'Je hebt geen toegang tot deze sollicitatie.' };
    }
    if (res.status === 404) {
      return { success: false, error: 'Sollicitatie niet gevonden.' };
    }
    if (!res.ok) {
      return { success: false, error: 'Status kon niet worden bijgewerkt.' };
    }
    const data: DashboardApplicationDto = await res.json();
    return { success: true, data };
  } catch {
    return { success: false, error: 'Kan geen verbinding maken met de server.' };
  }
}
