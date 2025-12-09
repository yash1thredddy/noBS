// tRPC client configuration
// 
// NOTE: tRPC is configured but NOT currently used.
// The app uses REST endpoints (/api/auth/login, /api/auth/logout) instead.
// 
// To use tRPC in the future:
// 1. Import AppRouter type: import type { AppRouter } from '../../../backend/app/trpc/routers/index'
// 2. Replace the placeholder type below
// 3. Use trpc hooks in components: trpc.auth.login.useMutation()
//
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import { getAccessToken } from './auth';

// Placeholder type - replace with actual AppRouter from backend when switching to tRPC
// import type { AppRouter } from '../../../backend/app/trpc/routers/index'
export type AppRouter = any;

// Create tRPC React hooks
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




