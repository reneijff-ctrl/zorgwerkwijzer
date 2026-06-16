import type { EmployerDetail, EmployerUpdateRequest, PageResponse, VacancyListItem } from '@/types/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

// ─── Public (server-side, ISR) ───────────────────────────────────────────────

export async function getEmployerBySlug(slug: string): Promise<EmployerDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/employers/slug/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getEmployerVacancies(
  slug: string,
  page = 0,
  size = 10,
): Promise<PageResponse<VacancyListItem> | null> {
  try {
    const res = await fetch(
      `${API_BASE}/employers/slug/${slug}/vacancies?page=${page}&size=${size}`,
      { next: { revalidate: 1800 } },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getAllEmployers(
  page = 0,
  size = 20,
): Promise<PageResponse<EmployerDetail> | null> {
  try {
    const res = await fetch(`${API_BASE}/employers?page=${page}&size=${size}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ─── Authenticated (client-side) ────────────────────────────────────────────

function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('zww_access_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export type UpdateEmployerResult =
  | { success: true; data: EmployerDetail }
  | { success: false; error: string };

export async function updateEmployer(
  id: number,
  data: EmployerUpdateRequest,
): Promise<UpdateEmployerResult> {
  try {
    const res = await fetch(`${API_BASE}/employers/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (res.ok) {
      return { success: true, data: await res.json() };
    }
    const body = await res.json().catch(() => ({}));
    return { success: false, error: body.message ?? `Fout ${res.status}` };
  } catch {
    return { success: false, error: 'Netwerkfout. Controleer de verbinding.' };
  }
}

export type UploadImageResult =
  | { success: true; url: string }
  | { success: false; error: string };

export async function uploadEmployerLogo(
  id: number,
  file: File,
): Promise<UploadImageResult> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('zww_access_token') : null;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/employers/${id}/upload-logo`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: (body as { error?: string }).error ?? `Fout ${res.status}` };
    }
    const body: { logoUrl: string } = await res.json();
    return { success: true, url: body.logoUrl };
  } catch {
    return { success: false, error: 'Kan geen verbinding maken met de server.' };
  }
}

export async function uploadEmployerHeader(
  id: number,
  file: File,
): Promise<UploadImageResult> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('zww_access_token') : null;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/employers/${id}/upload-header`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: (body as { error?: string }).error ?? `Fout ${res.status}` };
    }
    const body: { coverImageUrl: string } = await res.json();
    return { success: true, url: body.coverImageUrl };
  } catch {
    return { success: false, error: 'Kan geen verbinding maken met de server.' };
  }
}

export async function deleteEmployerLogo(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('zww_access_token') : null;
    const res = await fetch(`${API_BASE}/employers/${id}/logo`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return { success: res.ok };
  } catch {
    return { success: false, error: 'Netwerkfout.' };
  }
}

export async function deleteEmployerHeader(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('zww_access_token') : null;
    const res = await fetch(`${API_BASE}/employers/${id}/header`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return { success: res.ok };
  } catch {
    return { success: false, error: 'Netwerkfout.' };
  }
}

export async function getEmployerById(id: number): Promise<EmployerDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/employers/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
