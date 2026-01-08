// API client utilities

import { getAccessToken } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Make an API request with automatic auth header injection
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requiresAuth = false, headers = {}, ...fetchOptions } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  // Add authorization header if required
  if (requiresAuth) {
    const token = getAccessToken();
    if (!token) {
      throw new Error('Authentication required but no access token found');
    }

    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers: requestHeaders,
  });

  if (!response.ok) {
    // For server errors (5xx), use generic message to avoid leaking internal details
    if (response.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }

    // For client errors (4xx), parse the error but sanitize
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));

    // Only use known safe error messages, fallback to generic
    const safeMessages = [
      'Authentication required',
      'Invalid credentials',
      'Session expired',
      'Not found',
      'Validation failed',
    ];

    const message = error.message || 'Request failed';
    const isSafeMessage = safeMessages.some(safe => message.toLowerCase().includes(safe.toLowerCase()));

    throw new Error(isSafeMessage ? message : `Request failed (${response.status})`);
  }

  return response.json();
}

/**
 * Exchange ORCID authorization code for tokens
 */
export async function exchangeOrcidCode(code: string) {
  // Delegate token exchange to backend to avoid exposing client secret
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
}


