# tRPC Migration Guide

This guide explains how to switch from REST endpoints to tRPC (optional).

## Current Architecture

The app currently uses:
- ✅ **REST endpoints** (`/api/auth/login`, `/api/auth/logout`) - **ACTIVE**
- 🔧 **tRPC endpoints** (`/trpc`) - **CONFIGURED BUT UNUSED**

Both are fully functional and available. tRPC provides end-to-end type safety.

## Why Consider tRPC?

**Benefits:**
- 🎯 End-to-end type safety (frontend ↔️ backend)
- 🚀 Auto-completion in your IDE
- 🛡️ Compile-time error checking
- 📦 No need to manually define API types

**Drawbacks:**
- 🔗 Tighter coupling between frontend and backend
- 📚 Additional learning curve for the team

## How to Switch to tRPC

### Step 1: Update Frontend tRPC Client

Edit `frontend/src/utils/trpc.ts`:

```typescript
// BEFORE (current - using placeholder type)
export type AppRouter = any;

// AFTER (with actual backend types)
import type { AppRouter } from '../../../backend/app/trpc/routers/index'
// Remove the placeholder export type
```

### Step 2: Update CallbackPage to Use tRPC

Edit `frontend/src/pages/CallbackPage.tsx`:

**Replace REST fetch:**
```typescript
// OLD: REST API call
const response = await fetch(`${apiUrl}/api/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ code }),
});
const data = await response.json();
```

**With tRPC mutation:**
```typescript
// NEW: tRPC mutation
import { trpc } from '../utils/trpc';

// Inside component:
const loginMutation = trpc.auth.login.useMutation();
const result = await loginMutation.mutateAsync({ code });
```

### Step 3: Update Dashboard Logout

Edit `frontend/src/components/Dashboard.tsx`:

**Replace REST fetch:**
```typescript
// OLD: REST API call
await fetch(`${apiUrl}/api/auth/logout`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

**With tRPC mutation:**
```typescript
// NEW: tRPC mutation
import { trpc } from '../utils/trpc';

// Inside component:
const logoutMutation = trpc.auth.logout.useMutation();
await logoutMutation.mutateAsync();
```

### Step 4: (Optional) Remove REST Endpoints

Once tRPC is working, you can optionally remove REST endpoints from `backend/start/routes.ts`:

```typescript
// These can be removed if using tRPC exclusively:
router.post('/api/auth/login', ...)
router.post('/api/auth/logout', ...)
```

## Testing

After migration:

1. ✅ Test login flow
2. ✅ Test logout flow
3. ✅ Test token validation
4. ✅ Check TypeScript errors (should have full type safety)
5. ✅ Test protected routes

## Rollback

To revert to REST:

1. Undo changes in `CallbackPage.tsx` and `Dashboard.tsx`
2. Change `AppRouter` back to `any` in `frontend/src/utils/trpc.ts`
3. Keep REST endpoints active in routes

## Need Both?

You can keep both REST and tRPC active simultaneously:
- Use REST for public/external API
- Use tRPC for internal frontend-backend communication

## Available tRPC Procedures

Current backend tRPC router (`backend/app/trpc/routers/auth.ts`):

### Mutations (write operations)
- `auth.login({ code: string })` - Login with ORCID code
- `auth.logout()` - Logout and revoke token

### Queries (read operations)
- `auth.me()` - Get current user profile
- `auth.check()` - Check authentication status

### Example Usage

```typescript
// In a React component
import { trpc } from './utils/trpc';

function MyComponent() {
  // Query
  const { data: user, isLoading } = trpc.auth.me.useQuery();
  
  // Mutation
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      console.log('Logged out!');
    }
  });
  
  return (
    <div>
      {isLoading ? 'Loading...' : user?.name}
      <button onClick={() => logoutMutation.mutate()}>
        Logout
      </button>
    </div>
  );
}
```

## Adding New tRPC Procedures

1. Edit `backend/app/trpc/routers/auth.ts` (or create new router)
2. Add your procedure:
   ```typescript
   myProcedure: publicProcedure
     .input(z.object({ ... }))
     .query(async ({ input }) => {
       // Your logic here
     })
   ```
3. Types automatically available in frontend!

## Recommendation

**For this project:** REST is fine for a simple auth system. Consider tRPC if:
- You add many more endpoints
- You want stronger type safety
- Your team is comfortable with the setup

---

**Current Status: REST endpoints work great. tRPC ready when you need it!** ✨

