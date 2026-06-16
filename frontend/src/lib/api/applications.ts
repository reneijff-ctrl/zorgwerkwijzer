import type {
  ApplicationRequestDto,
  ApplicationResponseDto,
  SavedJobDto,
  SavedJobRequest,
  ProfileDto,
  ProfileCreateRequest,
  ProfileUpdateRequest,
  PageResponse,
} from '@/types/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('zww_access_token');
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

// ─── Sollicitaties ────────────────────────────────────────────────────────────

export async function submitApplication(
  data: ApplicationRequestDto,
): Promise<{ success: true; data: ApplicationResponseDto } | { success: false; error: string }> {
  try {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (res.status === 409) {
      return { success: false, error: 'Je hebt al eerder op deze vacature gesolliciteerd.' };
    }
    if (res.status === 400) {
      const body = await res.json();
      return { success: false, error: body.message ?? 'Ongeldige gegevens.' };
    }
    if (!res.ok) {
      return { success: false, error: 'Er is een fout opgetreden. Probeer het later opnieuw.' };
    }

    const application: ApplicationResponseDto = await res.json();
    return { success: true, data: application };
  } catch {
    return { success: false, error: 'Kan geen verbinding maken met de server.' };
  }
}

export async function getApplicationsByProfile(
  profileId: number,
  page = 0,
  size = 20,
): Promise<PageResponse<ApplicationResponseDto> | null> {
  try {
    const res = await fetch(
      `${API_BASE}/applications?profileId=${profileId}&page=${page}&size=${size}`,
      { cache: 'no-store', headers: getAuthHeaders() },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ─── Opgeslagen vacatures ─────────────────────────────────────────────────────

export async function saveJob(
  data: SavedJobRequest,
): Promise<{ success: true; data: SavedJobDto } | { success: false; error: string }> {
  try {
    const res = await fetch(`${API_BASE}/saved-jobs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (res.status === 409) {
      return { success: false, error: 'Vacature is al opgeslagen.' };
    }
    if (!res.ok) {
      return { success: false, error: 'Kon vacature niet opslaan.' };
    }

    const saved: SavedJobDto = await res.json();
    return { success: true, data: saved };
  } catch {
    return { success: false, error: 'Kan geen verbinding maken met de server.' };
  }
}

export async function removeSavedJob(
  vacancyId: number,
  profileId: number,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const res = await fetch(`${API_BASE}/saved-jobs/${vacancyId}?profileId=${profileId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (res.status === 404) {
      return { success: false, error: 'Opgeslagen vacature niet gevonden.' };
    }
    if (!res.ok) {
      return { success: false, error: 'Kon vacature niet verwijderen.' };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Kan geen verbinding maken met de server.' };
  }
}

export async function getSavedJobsByProfile(
  profileId: number,
  page = 0,
  size = 20,
): Promise<PageResponse<SavedJobDto> | null> {
  try {
    const res = await fetch(
      `${API_BASE}/saved-jobs?profileId=${profileId}&page=${page}&size=${size}`,
      { cache: 'no-store', headers: getAuthHeaders() },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ─── Profielen ────────────────────────────────────────────────────────────────

export async function createProfile(
  data: ProfileCreateRequest,
): Promise<{ success: true; data: ProfileDto } | { success: false; error: string; fieldErrors?: Record<string, string> }> {
  try {
    const res = await fetch(`${API_BASE}/profiles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.status === 409) {
      return { success: false, error: 'Dit e-mailadres is al in gebruik.' };
    }
    if (res.status === 400) {
      const body = await res.json();
      return {
        success: false,
        error: body.message ?? 'Ongeldige gegevens.',
        fieldErrors: body.validationErrors,
      };
    }
    if (!res.ok) {
      return { success: false, error: 'Er is een fout opgetreden. Probeer het later opnieuw.' };
    }

    const profile: ProfileDto = await res.json();
    return { success: true, data: profile };
  } catch {
    return { success: false, error: 'Kan geen verbinding maken met de server.' };
  }
}

export async function getProfileByEmail(email: string): Promise<ProfileDto | null> {
  try {
    const res = await fetch(
      `${API_BASE}/profiles/by-email?email=${encodeURIComponent(email)}`,
      { cache: 'no-store', headers: getAuthHeaders() },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getProfileById(id: number): Promise<ProfileDto | null> {
  try {
    const res = await fetch(`${API_BASE}/profiles/${id}`, {
      cache: 'no-store',
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function updateProfile(
  id: number,
  data: ProfileUpdateRequest,
): Promise<{ success: true; data: ProfileDto } | { success: false; error: string; fieldErrors?: Record<string, string> }> {
  try {
    const res = await fetch(`${API_BASE}/profiles/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (res.status === 400) {
      const body = await res.json();
      return {
        success: false,
        error: body.message ?? 'Ongeldige gegevens.',
        fieldErrors: body.validationErrors,
      };
    }
    if (!res.ok) {
      return { success: false, error: 'Kon profiel niet opslaan. Probeer het later opnieuw.' };
    }
    const profile: ProfileDto = await res.json();
    return { success: true, data: profile };
  } catch {
    return { success: false, error: 'Kan geen verbinding maken met de server.' };
  }
}

export async function uploadCv(
  file: File,
): Promise<{ success: true; cvUrl: string } | { success: false; error: string }> {
  try {
    if (typeof window === 'undefined') return { success: false, error: 'Niet beschikbaar op server.' };
    const token = localStorage.getItem('zww_access_token');
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/profiles/upload-cv`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (res.status === 413) {
      return { success: false, error: 'Bestand is te groot. Maximum is 5 MB.' };
    }
    if (res.status === 415) {
      return { success: false, error: 'Bestandstype niet toegestaan. Gebruik PDF of DOCX.' };
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: (body as { message?: string }).message ?? 'Upload mislukt.' };
    }
    const body: { cvUrl: string } = await res.json();
    return { success: true, cvUrl: body.cvUrl };
  } catch {
    return { success: false, error: 'Kan geen verbinding maken met de server.' };
  }
}
