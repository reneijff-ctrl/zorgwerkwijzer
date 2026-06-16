import type { PageResponse } from '@/types/api';
import type {
  AdminAuditLog,
  AdminStats,
  AdminUser,
  AdminEmployer,
  AdminEmployerDetail,
  AdminVacancy,
  AdminVacancyDetail,
  AdminSubscription,
} from '@/types/admin';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('zww_access_token');
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

// ── Statistieken ──────────────────────────────────────────────────────────────

export async function getAdminStats(): Promise<AdminStats | null> {
  try {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      cache: 'no-store',
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ── Gebruikers ────────────────────────────────────────────────────────────────

export async function getAdminUsers(
  q?: string,
  role?: string,
  page = 0,
  size = 20,
): Promise<PageResponse<AdminUser> | null> {
  try {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (q) params.set('q', q);
    if (role) params.set('role', role);
    const res = await fetch(`${API_BASE}/admin/users?${params}`, {
      cache: 'no-store',
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getAdminUserById(id: number): Promise<AdminUser | null> {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      cache: 'no-store',
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function updateAdminUserRole(
  id: number,
  role: string,
): Promise<{ success: boolean; data?: AdminUser; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${id}/role`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body.message ?? 'Rol bijwerken mislukt.' };
    }
    const data = await res.json();
    return { success: true, data };
  } catch {
    return { success: false, error: 'Netwerkfout.' };
  }
}

export async function deleteAdminUser(
  id: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body.message ?? 'Verwijderen mislukt.' };
    }
    return { success: true };
  } catch {
    return { success: false, error: 'Netwerkfout.' };
  }
}

// ── Werkgevers ────────────────────────────────────────────────────────────────

export async function getAdminEmployers(
  q?: string,
  subscriptionStatus?: string,
  page = 0,
  size = 20,
): Promise<PageResponse<AdminEmployer> | null> {
  try {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (q) params.set('q', q);
    if (subscriptionStatus) params.set('subscriptionStatus', subscriptionStatus);
    const res = await fetch(`${API_BASE}/admin/employers?${params}`, {
      cache: 'no-store',
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getAdminEmployerById(id: number): Promise<AdminEmployerDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/admin/employers/${id}`, {
      cache: 'no-store',
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ── Vacatures ─────────────────────────────────────────────────────────────────

export async function getAdminVacancyById(id: number): Promise<AdminVacancyDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/admin/vacancies/${id}`, {
      cache: 'no-store',
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getAdminVacancies(
  q?: string,
  isActive?: boolean,
  isFeatured?: boolean,
  page = 0,
  size = 25,
): Promise<PageResponse<AdminVacancy> | null> {
  try {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (q) params.set('q', q);
    if (isActive !== undefined) params.set('isActive', String(isActive));
    if (isFeatured !== undefined) params.set('isFeatured', String(isFeatured));
    const res = await fetch(`${API_BASE}/admin/vacancies?${params}`, {
      cache: 'no-store',
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function toggleAdminVacancyFeatured(
  id: number,
): Promise<{ success: boolean; data?: AdminVacancy; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/admin/vacancies/${id}/featured`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body.message ?? 'Bijwerken mislukt.' };
    }
    const data = await res.json();
    return { success: true, data };
  } catch {
    return { success: false, error: 'Netwerkfout.' };
  }
}

export async function toggleAdminVacancyActive(
  id: number,
): Promise<{ success: boolean; data?: AdminVacancy; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/admin/vacancies/${id}/active`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body.message ?? 'Bijwerken mislukt.' };
    }
    const data = await res.json();
    return { success: true, data };
  } catch {
    return { success: false, error: 'Netwerkfout.' };
  }
}

export async function deleteAdminVacancy(
  id: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/admin/vacancies/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body.message ?? 'Verwijderen mislukt.' };
    }
    return { success: true };
  } catch {
    return { success: false, error: 'Netwerkfout.' };
  }
}

// ── Subscriptions ─────────────────────────────────────────────────────────────

export async function getAdminSubscriptions(
  status?: string,
  packageId?: number,
  canceledLast30Days?: boolean,
  page = 0,
  size = 20,
): Promise<PageResponse<AdminSubscription> | null> {
  try {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (status) params.set('status', status);
    if (packageId !== undefined) params.set('packageId', String(packageId));
    if (canceledLast30Days !== undefined)
      params.set('canceledLast30Days', String(canceledLast30Days));
    const res = await fetch(`${API_BASE}/admin/subscriptions?${params}`, {
      cache: 'no-store',
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ── Audit Log ─────────────────────────────────────────────────────────────

export async function getAdminAuditLog(
  adminUserId?: number,
  action?: string,
  entityType?: string,
  from?: string,
  to?: string,
  page = 0,
  size = 20,
): Promise<PageResponse<AdminAuditLog> | null> {
  try {
    const params = new URLSearchParams();
    if (adminUserId !== undefined) params.set('adminUserId', String(adminUserId));
    if (action) params.set('action', action);
    if (entityType) params.set('entityType', entityType);
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    params.set('page', String(page));
    params.set('size', String(size));
    const res = await fetch(`${API_BASE}/admin/audit-log?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function updateAdminSubscriptionStatus(
  id: number,
  status: string,
): Promise<{ success: boolean; data?: AdminSubscription; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/admin/subscriptions/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body.message ?? 'Status bijwerken mislukt.' };
    }
    const data = await res.json();
    return { success: true, data };
  } catch {
    return { success: false, error: 'Netwerkfout.' };
  }
}
