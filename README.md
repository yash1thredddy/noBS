# noBS Consortium - Authentication System

A secure authentication application for the noBS Consortium using ORCID OAuth2 integration with a modern React frontend and AdonisJS backend.


## 📁 Project Structure

```
Login Page/
├── frontend/              # React + Vite frontend application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── stores/       # State management (Preact Signals)
│   │   ├── utils/        # Utility functions
│   │   └── styles/       # Global styles
│   ├── package.json
│   └── vite.config.ts
│
└── backend/              # AdonisJS backend API
    ├── app/
    │   ├── models/       # Database models
    │   ├── middleware/   # Auth middleware
    │   └── trpc/         # tRPC routers (optional)
    ├── database/
    │   └── migrations/   # Database migrations
    ├── start/
    │   └── routes.ts     # API routes
    ├── package.json
    └── adonisrc.ts
```

## 🛠️ Technology Stack

### Frontend
- **React** 18.3.1 - UI library
- **TypeScript** - Type safety
- **Vite** 6.3.5 - Build tool
- **Tailwind CSS** v4 - Styling
- **Framer Motion** - Animations
- **Preact Signals** - State management
- **React Router** - Routing
- **shadcn/ui** - UI components

### Backend
- **AdonisJS** 6 - Node.js framework
- **TypeScript** - Type safety
- **Lucid ORM** - Database ORM
- **SQLite** - Database
- **ORCID OAuth2** - Authentication provider

## 📋 Prerequisites

- **Node.js** 20.x or higher
- **npm** 10.x or higher
- **ORCID Account** (Sandbox or Production)
