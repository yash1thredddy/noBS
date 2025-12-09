# noBS Consortium - Frontend

Modern React + Vite frontend application with ORCID authentication and tRPC integration.

## Tech Stack

- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **Vite 6.3.5** - Build tool & dev server
- **Tailwind CSS v4** - Styling
- **Framer Motion** - Animations
- **Preact Signals** - Reactive state management
- **tRPC** - End-to-end type-safe API calls
- **React Query** - Data fetching & caching
- **React Router** - Client-side routing
- **Radix UI + shadcn/ui** - Accessible component primitives

## Project Structure

```
frontend/
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components (40+)
│   │   ├── LoginPage.tsx  # Animated ORCID login
│   │   ├── Dashboard.tsx  # User dashboard
│   │   └── ProtectedRoute.tsx # Route guard
│   │
│   ├── pages/             # Page components
│   │   └── CallbackPage.tsx # OAuth callback handler
│   │
│   ├── stores/            # Signal-based state stores
│   │   └── authStore.ts   # Authentication state
│   │
│   ├── utils/             # Utility functions
│   │   ├── auth.ts        # Auth helpers (tokens, storage)
│   │   ├── api.ts         # API client & ORCID integration
│   │   └── trpc.ts        # tRPC client setup
│   │
│   ├── styles/            # Global styles
│   │   └── globals.css    # Tailwind + CSS variables
│   │
│   ├── assets/            # Static assets
│   ├── App.tsx            # Root component with routing
│   ├── main.tsx           # App entry point
│   └── index.css          # Compiled Tailwind
│
├── .env                   # Environment variables (create from ENV_TEMPLATE.txt)
├── ENV_TEMPLATE.txt       # Environment template
├── vite.config.ts         # Vite configuration
└── package.json           # Dependencies
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the environment template and fill in your ORCID credentials:

```bash
cp ENV_TEMPLATE.txt .env
```

Edit `.env` and add your ORCID Client ID and Client Secret.

**Get ORCID Credentials:**
1. Go to https://sandbox.orcid.org (development)
2. Sign in or create an account
3. Navigate to Developer Tools
4. Register a new application
5. Set redirect URI to `http://localhost:3001/callback`
6. Copy your Client ID and Client Secret to `.env`

### 3. Run Development Server

```bash
npm run dev
```

The app will run on http://localhost:3001

### 4. Build for Production

```bash
npm run build
```

Build output will be in the `build/` directory.

## Features

### Authentication
- ✅ ORCID OAuth2 integration
- ✅ Secure token storage (localStorage)
- ✅ Protected routes with automatic redirect
- ✅ User profile fetching from ORCID
- ✅ Logout functionality

### State Management
- Uses **Preact Signals** for reactive state
- No Provider boilerplate needed
- Automatic re-renders only for affected components
- Global auth store: `authStore.ts`

### API Communication
- **tRPC** client configured and ready
- End-to-end type safety (once backend is connected)
- Automatic auth token injection
- React Query for caching & optimistic updates

### UI Components
- **Login Page**: Animated molecular structures, glass morphism design
- **Dashboard**: Clean research platform UI with stats and quick actions
- **Protected Routes**: Automatic authentication checks
- **OAuth Callback**: Handles ORCID redirect and token exchange

## Routes

| Path | Component | Protected | Description |
|------|-----------|-----------|-------------|
| `/` | LoginPage | No | Landing & login |
| `/login` | LoginPage | No | Login page |
| `/callback` | CallbackPage | No | OAuth callback handler |
| `/dashboard` | Dashboard | Yes | User dashboard |

## State Management with Signals

```typescript
// Import signals from auth store
import { user, isAuthenticated, login, logout } from './stores/authStore';

// Access signal value
const currentUser = user.value;

// Check auth status
if (isAuthenticated.value) {
  // User is authenticated
}

// Login (called after OAuth)
await login(tokens, profile);

// Logout
logout();
```

**Benefits:**
- Components automatically re-render when signals change
- No `useState` or `useContext` boilerplate
- Better performance (fine-grained reactivity)
- Simple API

## tRPC Integration

The frontend is configured to communicate with the AdonisJS backend via tRPC.

```typescript
// tRPC client is set up in utils/trpc.ts
import { trpc } from './utils/trpc';

// Use tRPC hooks in components (after backend is ready)
const { data, isLoading } = trpc.user.getProfile.useQuery();
const mutation = trpc.post.create.useMutation();
```

**Current Status:**
- ✅ tRPC client configured
- ✅ React Query provider set up
- ✅ Auth token injection enabled
- ⏳ Waiting for backend router types

## Next Steps

1. **Backend Setup** (in `../backend/`):
   - Initialize AdonisJS
   - Install `@pyxlab/adonis-trpc`
   - Create tRPC procedures
   - Export AppRouter type

2. **Connect Frontend to Backend**:
   - Replace `AppRouter` type in `utils/trpc.ts`
   - Import types from backend
   - Full type-safety across stack

3. **Add Features**:
   - Compound search
   - Molecular docking
   - Project management
   - Data visualization

## Troubleshooting

**Port already in use:**
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Environment variables not loading:**
- Make sure `.env` is in `frontend/` directory
- Variables must start with `VITE_`
- Restart dev server after changing `.env`

**ORCID authentication failing:**
- Check Client ID and Secret are correct
- Verify redirect URI matches ORCID app settings
- Use sandbox ORCID for development

**tRPC types not working:**
- Ensure backend is running and exporting AppRouter
- Import AppRouter from backend into `utils/trpc.ts`

## Documentation

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Preact Signals](https://preactjs.com/guide/v10/signals/)
- [tRPC](https://trpc.io/)
- [React Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [ORCID API](https://info.orcid.org/documentation/api-tutorials/)

## License

MIT License © noBS Consortium