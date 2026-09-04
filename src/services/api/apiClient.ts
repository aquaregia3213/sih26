/**
 * Centralized API Client for Vanika Frontend ↔ Backend communication.
 * 
 * - Stores JWT in localStorage
 * - Attaches Authorization: Bearer header automatically
 * - Unwraps the standard { success, message, data } response envelope
 * - Handles 401 auto-logout and network errors
 */

const TOKEN_KEY = 'vanika_auth_token';
const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '/api';

// ─── Token Management ───

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ─── Error Type ───

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// ─── Response Envelope ───

interface ApiEnvelope<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  meta?: any;
}

// ─── Core Request Function ───

async function request<T>(
  method: string,
  path: string,
  body?: any,
  options?: { skipAuth?: boolean }
): Promise<T> {
  const url = `${API_BASE}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (!options?.skipAuth) {
    const token = getStoredToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (networkError) {
    throw new ApiError('Network error — unable to reach server', 0);
  }

  // Handle non-JSON responses
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    if (!response.ok) {
      throw new ApiError(`Server error (${response.status})`, response.status);
    }
    return undefined as unknown as T;
  }

  const envelope: ApiEnvelope<T> = await response.json();

  // Auto-logout on 401 (expired/invalid token)
  if (response.status === 401) {
    clearStoredToken();
    // Dispatch a custom event so AuthContext can react
    window.dispatchEvent(new CustomEvent('vanika:auth:logout'));
    throw new ApiError(envelope.message || 'Session expired', 401, envelope.error);
  }

  if (!response.ok || !envelope.success) {
    throw new ApiError(
      envelope.message || `Request failed (${response.status})`,
      response.status,
      envelope.error
    );
  }

  return envelope.data as T;
}

// ─── Public API Methods ───

export const apiClient = {
  get: <T = any>(path: string, skipAuth = false) =>
    request<T>('GET', path, undefined, { skipAuth }),

  post: <T = any>(path: string, body?: any, skipAuth = false) =>
    request<T>('POST', path, body, { skipAuth }),

  patch: <T = any>(path: string, body?: any) =>
    request<T>('PATCH', path, body),

  put: <T = any>(path: string, body?: any) =>
    request<T>('PUT', path, body),

  delete: <T = any>(path: string) =>
    request<T>('DELETE', path),
};

export default apiClient;
