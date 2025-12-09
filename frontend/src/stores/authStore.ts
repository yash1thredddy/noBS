// Auth store using Preact Signals
import { signal, computed } from '@preact/signals-react';
import { 
  storeTokens, 
  storeUserProfile, 
  getUserProfile, 
  clearAuthData,
  isAuthenticated as checkIsAuthenticated,
  getAccessToken,
  type AuthTokens,
  type UserProfile
} from '../utils/auth';

// Backend user type (from tRPC response)
export interface BackendUser {
  id: number;
  orcid: string;
  name: string | null;
  email: string | null;
  institution: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// Signals
export const user = signal<UserProfile | null>(getUserProfile());
export const isLoading = signal<boolean>(false);
export const error = signal<string | null>(null);

// Computed signals
export const isAuthenticated = computed(() => user.value !== null && checkIsAuthenticated());

/**
 * Login with backend API token and user data
 * This is the main login method when using the backend
 */
export function loginWithBackend(token: string, backendUser: BackendUser): void {
  try {
    isLoading.value = true;
    error.value = null;

    // Store the backend API token as access token
    localStorage.setItem('nobs_access_token', token);

    // Convert backend user to UserProfile
    const profile: UserProfile = {
      orcid: backendUser.orcid,
      name: backendUser.name || 'Unknown User',
      email: backendUser.email || undefined,
      institution: backendUser.institution || undefined,
    };

    // Store profile
    storeUserProfile(profile);

    // Update user signal
    user.value = profile;
    
    // Clear force reauth flag
    localStorage.removeItem('nobs_force_reauth');
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Login failed';
    throw err;
  } finally {
    isLoading.value = false;
  }
}

/**
 * Login with ORCID tokens and user profile (legacy/direct ORCID auth)
 */
export async function login(tokens: AuthTokens, profile: UserProfile): Promise<void> {
  try {
    isLoading.value = true;
    error.value = null;

    // Store tokens and profile
    storeTokens(tokens);
    storeUserProfile(profile);

    // Update user signal
    user.value = profile;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Login failed';
    throw err;
  } finally {
    isLoading.value = false;
  }
}

/**
 * Logout and clear all auth data
 */
export function logout(): void {
  clearAuthData();
  user.value = null;
  error.value = null;
  
  // Set flag to force re-authentication on next login
  localStorage.setItem('nobs_force_reauth', 'true');
}

/**
 * Check if we should force re-authentication
 */
export function shouldForceReauth(): boolean {
  return localStorage.getItem('nobs_force_reauth') === 'true';
}

/**
 * Clear force re-authentication flag (called after successful login)
 */
export function clearForceReauth(): void {
  localStorage.removeItem('nobs_force_reauth');
}

/**
 * Check authentication status on app load
 */
export function initAuth(): void {
  const profile = getUserProfile();
  if (profile && checkIsAuthenticated()) {
    user.value = profile;
  } else {
    // Clear stale data
    clearAuthData();
    user.value = null;
  }
}

/**
 * Update user profile
 */
export function updateUser(profile: Partial<UserProfile>): void {
  if (user.value) {
    const updatedProfile = { ...user.value, ...profile };
    user.value = updatedProfile;
    storeUserProfile(updatedProfile);
  }
}

/**
 * Clear error
 */
export function clearError(): void {
  error.value = null;
}

/**
 * Auth store object for convenient access
 */
export const authStore = {
  // Signals
  user,
  isLoading,
  error,
  isAuthenticated,
  
  // Actions
  login,
  loginWithBackend,
  logout,
  initAuth,
  updateUser,
  clearError,
  shouldForceReauth,
  clearForceReauth,
  
  // Token access
  getToken: getAccessToken,
};

