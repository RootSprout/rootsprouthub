const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export type ApiError = {
  error: string;
};

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  withAuth = false
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (withAuth) {
    const token = localStorage.getItem('rs_token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('unauthorized');
    }
    const data = (await response.json().catch(() => ({ error: 'Request failed' }))) as ApiError;
    throw new Error(data.error || 'Request failed');
  }

  return (await response.json()) as T;
}
