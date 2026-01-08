// Authentication utility functions

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: string;
}

export interface UserProfile {
  orcid: string;
  name: string;
  email?: string;
  institution?: string;
}

const ACCESS_TOKEN_KEY = 'nobs_access_token';
const REFRESH_TOKEN_KEY = 'nobs_refresh_token';
const USER_PROFILE_KEY = 'nobs_user_profile';

/**
 * Store authentication tokens in localStorage
 */
export function storeTokens(tokens: AuthTokens): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  if (tokens.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }
}

/**
 * Get access token from localStorage
 */
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Get refresh token from localStorage
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Store user profile in localStorage
 */
export function storeUserProfile(profile: UserProfile): void {
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
}

/**
 * Get user profile from localStorage
 */
export function getUserProfile(): UserProfile | null {
  const profile = localStorage.getItem(USER_PROFILE_KEY);
  if (!profile) return null;

  try {
    return JSON.parse(profile);
  } catch {
    // Corrupted data in localStorage, clear it
    localStorage.removeItem(USER_PROFILE_KEY);
    return null;
  }
}

/**
 * Clear all authentication data
 */
export function clearAuthData(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_PROFILE_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

/**
 * Generate ORCID authorization URL
 */
export function getOrcidAuthUrl(forcePrompt = false): string {
  const clientId = import.meta.env.VITE_ORCID_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_ORCID_REDIRECT_URI;
  const authUrl = import.meta.env.VITE_ORCID_AUTH_URL;

  if (!clientId || !redirectUri || !authUrl) {
    console.error('Missing ORCID configuration. Check your .env file.');
    return '#';
  }

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    scope: '/authenticate',
    redirect_uri: redirectUri,
  });

  // Add prompt parameter to force re-authorization (useful for testing)
  if (forcePrompt) {
    params.append('prompt', 'login');
  }

  return `${authUrl}?${params.toString()}`;
}

