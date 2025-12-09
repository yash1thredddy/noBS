# Quick Setup Guide

This is a streamlined guide to get the noBS Authentication System running quickly.

## Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- ORCID Sandbox account (for development)

## 🚀 Quick Start (5 minutes)

### Step 1: Get ORCID Credentials

1. Visit https://sandbox.orcid.org
2. Sign in or create an account
3. Go to **Developer Tools**
4. Click **Register for the free ORCID public API**
5. Fill in the form:
   - **Name**: noBS Consortium Dev
   - **Website**: http://localhost:3001
   - **Description**: Development authentication
   - **Redirect URIs**: `http://localhost:3001/callback`
6. Save your **Client ID** and **Client Secret**

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp ENV_TEMPLATE.txt .env

# Edit .env and add your ORCID credentials
# Required fields:
#   ORCID_CLIENT_ID=your-client-id
#   ORCID_CLIENT_SECRET=your-client-secret

# Run database migrations
node ace migration:run

# Start backend (runs on http://localhost:3333)
npm run dev
```

### Step 3: Frontend Setup

Open a **new terminal window**:

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp ENV_TEMPLATE.txt .env

# Edit .env and add the SAME ORCID credentials as backend
# Required fields:
#   VITE_ORCID_CLIENT_ID=your-client-id
#   VITE_ORCID_CLIENT_SECRET=your-client-secret

# Start frontend (runs on http://localhost:3001)
npm run dev
```

### Step 4: Test the Application

1. Open browser to http://localhost:3001
2. Click **"Sign in with ORCID"**
3. Login with your ORCID Sandbox account
4. You should be redirected to the Dashboard

## ✅ Verification Checklist

- [ ] Backend running on port 3333
- [ ] Frontend running on port 3001
- [ ] Both `.env` files created with ORCID credentials
- [ ] Database migrations completed
- [ ] Can access login page
- [ ] Can successfully login with ORCID
- [ ] Redirected to dashboard after login
- [ ] Can logout successfully

## 🐛 Common Issues

### "ORCID configuration missing"
- Check that `.env` file exists in frontend directory
- Verify all VITE_ORCID_* variables are set
- Restart frontend dev server

### "Failed to exchange code for tokens"
- Check that ORCID_CLIENT_SECRET is set in backend `.env`
- Verify credentials match your ORCID app
- Check that redirect URI matches exactly: `http://localhost:3001/callback`

### "Port already in use"
- Backend: Change PORT in `backend/.env`
- Frontend: Change port in `frontend/vite.config.ts`

### Database errors
- Delete `backend/tmp/db.sqlite3`
- Run `node ace migration:run` again

## 📁 Project Structure

```
Login Page/
├── backend/           # AdonisJS API (port 3333)
│   ├── .env          # Backend environment variables
│   └── tmp/          # SQLite database
│
├── frontend/         # React app (port 3001)
│   └── .env          # Frontend environment variables
│
└── README.md         # Full documentation
```

## 🔐 Security Notes

- **Never commit `.env` files** to git
- Use **Sandbox ORCID** for development
- Use **Production ORCID** only for live deployment
- Client secrets are stored in backend only (frontend is temporary for dev)

## 📚 Next Steps

After successful setup:

1. Read the full [README.md](README.md) for detailed documentation
2. Explore the codebase structure
3. Review authentication flow in `backend/start/routes.ts`
4. Check frontend components in `frontend/src/components/`

## 💡 Development Tips

- Backend logs show detailed authentication flow
- Frontend uses Preact Signals for state management
- Database is SQLite (file at `backend/tmp/db.sqlite3`)
- Tokens expire after 7 days
- Logout clears frontend data and revokes backend token

## 🆘 Need Help?

If you encounter issues:

1. Check that both servers are running
2. Verify `.env` files are configured correctly
3. Check browser console for errors
4. Check backend terminal for error logs
5. Try clearing browser localStorage and logging in again

---

**Ready to code!** 🎉

