const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ContactReplyDto {
  id: number;
  adminEmail: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface ContactMessageDto {
  id: number;
  name: string;
  email: string;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  updatedAt: string;
  replies: ContactReplyDto[];
}

export interface ContactMessageStatsDto {
  total: number;
  newCount: number;
  inProgressCount: number;
  resolvedCount: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export async function getContactMessages(
  token: string,
  page = 0,
  size = 20
): Promise<PageResponse<ContactMessageDto>> {
  const res = await fetch(`${API_URL}/admin/contact-messages?page=${page}&size=${size}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Ophalen contactberichten mislukt');
  return res.json();
}

export async function getContactMessageStats(token: string): Promise<ContactMessageStatsDto> {
  const res = await fetch(`${API_URL}/admin/contact-messages/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Ophalen statistieken mislukt');
  return res.json();
}

export async function getContactMessage(token: string, id: number): Promise<ContactMessageDto> {
  const res = await fetch(`${API_URL}/admin/contact-messages/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Ophalen contactbericht mislukt');
  return res.json();
}

export async function updateContactMessageStatus(
  token: string,
  id: number,
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED'
): Promise<ContactMessageDto> {
  const res = await fetch(`${API_URL}/admin/contact-messages/${id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Statuswijziging mislukt');
  return res.json();
}

export async function searchContactMessages(
  token: string,
  params: {
    q?: string;
    status?: string;
    dateRange?: string;
    sort?: string;
    page?: number;
    size?: number;
  }
): Promise<PageResponse<ContactMessageDto>> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/admin/contact-messages/search`);
  if (params.q) url.searchParams.set('q', params.q);
  if (params.status) url.searchParams.set('status', params.status);
  if (params.dateRange) url.searchParams.set('dateRange', params.dateRange);
  if (params.sort) url.searchParams.set('sort', params.sort);
  if (params.page !== undefined) url.searchParams.set('page', String(params.page));
  if (params.size !== undefined) url.searchParams.set('size', String(params.size));
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Zoeken mislukt');
  return res.json();
}

export async function getRecentContactMessages(token: string): Promise<ContactMessageDto[]> {
  const res = await fetch(`${API_URL}/admin/contact-messages/recent`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Ophalen recente berichten mislukt');
  return res.json();
}

export async function sendContactReply(
  token: string,
  id: number,
  subject: string,
  message: string
): Promise<ContactReplyDto> {
  const res = await fetch(`${API_URL}/admin/contact-messages/${id}/reply`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subject, message }),
  });
  if (!res.ok) throw new Error('Versturen antwoord mislukt');
  return res.json();
}
