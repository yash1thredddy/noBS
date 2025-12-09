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

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add authorization header if required
  if (requiresAuth) {
    const token = getAccessToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers: requestHeaders,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

/**
 * Exchange ORCID authorization code for tokens
 */
export async function exchangeOrcidCode(code: string) {
  const clientId = import.meta.env.VITE_ORCID_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_ORCID_CLIENT_SECRET;
  const redirectUri = import.meta.env.VITE_ORCID_REDIRECT_URI;
  const tokenUrl = import.meta.env.VITE_ORCID_TOKEN_URL;

  if (!clientId || !clientSecret || !redirectUri || !tokenUrl) {
    throw new Error('Missing ORCID configuration');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error_description: 'Token exchange failed',
    }));
    throw new Error(error.error_description || 'Failed to exchange code for token');
  }

  return response.json();
}

/**
 * Fetch ORCID user profile
 */
export async function fetchOrcidProfile(orcid: string, accessToken: string) {
  const apiUrl = import.meta.env.VITE_ORCID_API_URL;

  if (!apiUrl) {
    throw new Error('Missing ORCID API URL configuration');
  }

  const response = await fetch(`${apiUrl}/${orcid}/record`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch ORCID profile');
  }

  const data = await response.json();
  
  // Extract relevant information from ORCID response
  const person = data.person;
  const name = person?.name?.['given-names']?.value 
    ? `${person.name['given-names'].value} ${person.name['family-name']?.value || ''}`
    : 'Unknown User';

  const emails = person?.emails?.email || [];
  const email = emails.find((e: any) => e.primary)?.email || emails[0]?.email;

  const employments = data['activities-summary']?.employments?.['affiliation-group'] || [];
  const institution = employments[0]?.summaries?.[0]?.['employment-summary']?.organization?.name;

  return {
    orcid,
    name: name.trim(),
    email,
    institution,
  };
}

