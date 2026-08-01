// Shared API Client for Adhigam IAS
import {
  fallbackAnnouncements,
  fallbackCourses,
  fallbackTestSeries,
  fallbackArticles,
  fallbackQuizzes,
  fallbackPrompts,
} from '../data/fallbackData';

const getAdminToken = () => localStorage.getItem('adhigam_token');
const getAspirantToken = () => localStorage.getItem('adhigam_aspirant_token');

// Static hosting fallback map for GET endpoints when backend is static (e.g. Bluehost public_html)
const getFallbackData = (endpoint: string): any => {
  if (endpoint.includes('/api/courses')) return fallbackCourses;
  if (endpoint.includes('/api/test-series')) return fallbackTestSeries;
  if (endpoint.includes('/api/articles')) return fallbackArticles;
  if (endpoint.includes('/api/quizzes')) return fallbackQuizzes;
  if (endpoint.includes('/api/prompts')) return fallbackPrompts;
  if (endpoint.includes('/api/announcements')) return fallbackAnnouncements;
  if (endpoint.includes('/api/auth/me') || endpoint.includes('/api/aspirants/me')) return { user: null };
  return [];
};

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

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type') || '';

    // If server returned HTML (e.g. Bluehost SPA rewrite of unknown route or static file fallback)
    if (contentType.includes('text/html')) {
      return getFallbackData(endpoint) as T;
    }

    const text = await response.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return getFallbackData(endpoint) as T;
    }

    if (!response.ok) {
      // If error status and GET endpoint, provide graceful fallback
      if (options.method === 'GET' || !options.method) {
        return getFallbackData(endpoint) as T;
      }
      throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
    }

    // Safety check: if GET expects array or data, ensure valid object returned
    if ((options.method === 'GET' || !options.method) && data && typeof data === 'object' && !Array.isArray(data)) {
      const fallback = getFallbackData(endpoint);
      if (Array.isArray(fallback) && !Array.isArray(data)) {
        return fallback as T;
      }
    }

    return data as T;
  } catch (err) {
    // Network or server unreachable (e.g. static hosting on Bluehost)
    if (options.method === 'GET' || !options.method) {
      return getFallbackData(endpoint) as T;
    }
    throw err;
  }
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

