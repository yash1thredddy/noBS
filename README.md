# noBS Consortium - Authentication System

A secure authentication application for the noBS Consortium using ORCID OAuth2 integration with a modern React frontend and AdonisJS backend.

## 🚀 Features

- **ORCID OAuth2 Authentication**: Secure login using ORCID credentials
- **Modern UI**: Beautiful animated login page with molecular/scientific visualizations
- **Session Management**: Secure token-based authentication with 7-day expiry
- **Protected Routes**: Client-side route protection for authenticated users
- **RESTful API**: Clean REST endpoints for authentication operations
- **Database Persistence**: User data stored securely in SQLite database

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

## 🚀 Quick Start

### 1. Clone the Repository

```bash
cd "Login Page"
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp ENV_TEMPLATE.txt .env

# Edit .env with your ORCID credentials
# Get credentials from: https://sandbox.orcid.org/developer-tools

# Run database migrations
node ace migration:run

# Start the backend server (default: http://localhost:3333)
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment template
cp ENV_TEMPLATE.txt .env

# Edit .env with your ORCID credentials (same as backend)

# Start the frontend server (default: http://localhost:3001)
npm run dev
```

### 4. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3333

## 🔐 ORCID Configuration

### Sandbox (Development)

1. Go to [ORCID Sandbox](https://sandbox.orcid.org)
2. Register for a developer account
3. Create a new application in Developer Tools
4. Add redirect URI: `http://localhost:3001/callback`
5. Copy your Client ID and Client Secret to `.env` files

### Environment Variables

#### Backend `.env`
```env
PORT=3333
HOST=0.0.0.0
NODE_ENV=development

# ORCID OAuth
ORCID_CLIENT_ID=your-client-id
ORCID_CLIENT_SECRET=your-client-secret
ORCID_REDIRECT_URI=http://localhost:3001/callback
ORCID_AUTH_URL=https://sandbox.orcid.org/oauth/authorize
ORCID_TOKEN_URL=https://sandbox.orcid.org/oauth/token
ORCID_API_URL=https://pub.sandbox.orcid.org/v3.0
```

#### Frontend `.env`
```env
# ORCID OAuth Configuration
VITE_ORCID_CLIENT_ID=your-client-id
VITE_ORCID_CLIENT_SECRET=your-client-secret
VITE_ORCID_REDIRECT_URI=http://localhost:3001/callback
VITE_ORCID_AUTH_URL=https://sandbox.orcid.org/oauth/authorize
VITE_ORCID_TOKEN_URL=https://sandbox.orcid.org/oauth/token
VITE_ORCID_API_URL=https://pub.sandbox.orcid.org/v3.0

# Backend API
VITE_API_URL=http://localhost:3333
```

## 🏗️ Architecture

### Current Setup: REST API

The application currently uses **REST endpoints** for all operations. A **tRPC** setup is also configured and available for future use if you want end-to-end type safety.

**Active endpoints**: `/api/auth/*` (REST)  
**Available but unused**: `/trpc` (tRPC)

## 📖 API Endpoints

### Authentication (REST)

#### POST `/api/auth/login`
Login with ORCID authorization code
```json
{
  "code": "authorization-code-from-orcid"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "orcid": "0000-0001-2345-6789",
    "name": "John Doe",
    "email": "john@example.com",
    "institution": "Example University"
  },
  "token": "api-access-token"
}
```

#### POST `/api/auth/logout`
Logout and revoke access token (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

#### GET `/api/auth/check`
Check if token is valid (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

### Optional: tRPC Endpoints

tRPC is configured but not currently used. The same auth operations are available at `/trpc`:

- `auth.login` - Login mutation
- `auth.logout` - Logout mutation  
- `auth.me` - Get current user query
- `auth.check` - Check auth status query

To switch from REST to tRPC, see instructions in `frontend/src/utils/trpc.ts`.

## 🏗️ Development

### Running Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Database Migrations

```bash
cd backend

# Create a new migration
node ace make:migration migration_name

# Run migrations
node ace migration:run

# Rollback migrations
node ace migration:rollback
```

### Code Quality

```bash
# Lint frontend
cd frontend
npm run lint

# Lint backend
cd backend
npm run lint
```

## 🔒 Security Notes

- **Never commit `.env` files** to version control
- **Client secrets** are only stored in the backend
- **Tokens expire** after 7 days for security
- **HTTPS required** in production
- Use **production ORCID** for live deployments

## 📝 License

Copyright © 2024 noBS Consortium

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

For questions or issues, please contact the noBS Consortium development team.

---

**Built with ❤️ for natural products research**
