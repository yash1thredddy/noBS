import { router } from '#trpc/trpc'
import { authRouter } from '#trpc/routers/auth'

// Main app router - combine all routers here
// 
// NOTE: tRPC is available but NOT currently used by the frontend.
// The app uses REST endpoints (/api/auth/login, /api/auth/logout) instead.
// 
// tRPC endpoints are accessible at: /trpc
// Example procedures:
//   - auth.login (mutation)
//   - auth.logout (mutation)
//   - auth.me (query)
//   - auth.check (query)
//
export const appRouter = router({
  auth: authRouter,
})

// Export type for frontend
export type AppRouter = typeof appRouter

