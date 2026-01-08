// tRPC client configuration
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import { getAccessToken } from './auth';

// Import AppRouter type from backend for type-safe tRPC calls
import type { AppRouter } from '../../../backend/app/trpc/routers/index';

// Re-export for use elsewhere
export type { AppRouter };

// Create tRPC React hooks with proper typing
export const trpc = createTRPCReact<AppRouter>();

/**
 * Get tRPC client configuration
 */
export function getTRPCClientConfig() {
  const apiUrl = import.meta.env?.VITE_API_URL || 'http://localhost:3333';

  return {
    links: [
      httpBatchLink({
        url: `${apiUrl}/trpc`,
        // Send auth token with requests
        headers: () => {
          const token = getAccessToken();
          return token
            ? {
                authorization: `Bearer ${token}`,
              }
            : {};
        },
      }),
    ],
  };
}




