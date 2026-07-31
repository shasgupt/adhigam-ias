// Shared API Client for Adhigam IAS

const getAdminToken = () => localStorage.getItem('adhigam_token');
const getAspirantToken = () => localStorage.getItem('adhigam_aspirant_token');

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {},
  isAspirant = false
): Promise<T> {
  const token = isAspirant ? getAspirantToken() : getAdminToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  get: <T = any>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T = any>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T = any>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T = any>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};

export const aspirantApi = {
  get: <T = any>(endpoint: string) => request<T>(endpoint, { method: 'GET' }, true),
  post: <T = any>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }, true),
  put: <T = any>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }, true),
  delete: <T = any>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }, true),
};
