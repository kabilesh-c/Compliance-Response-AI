# Production Deployment Guide

## Overview

PharmaOS Compliance Response AI is deployed across two cloud platforms:

- **Frontend**: Vercel (Next.js application)
- **Backend**: Render (Express API)
- **Database**: Supabase (PostgreSQL with pgvector)
- **Storage**: Supabase Storage (Document files)

## Production URLs

- Frontend: `https://pharmaos.vercel.app`
- Backend API: `https://compliance-response-ai.onrender.com/api`
- Database: Supabase project (configured via environment variables)

## Environment Configuration

### Frontend (.env.local for development)

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Frontend (.env.production on Vercel)

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://compliance-response-ai.onrender.com/api

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id  
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Backend (.env on Render)

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key

# AI Services
GEMINI_API_KEY=your_gemini_api_key
AI_MODEL=gemini-1.5-pro-002

# CORS
CORS_ORIGIN=https://pharmaos.vercel.app

# Server
PORT=10000
NODE_ENV=production
```

## Deployment Steps

### Frontend (Vercel)

1. **Connect Repository**
   ```bash
   # Vercel auto-deploys from GitHub main branch
   git push origin main
   ```

2. **Configure Build Settings**
   - Framework: Next.js
   - Root Directory: `apps/web`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Node Version: 18.x

3. **Environment Variables**
   - Add all `NEXT_PUBLIC_*` variables in Vercel dashboard
   - Ensure production API URL is set correctly

### Backend (Render)

1. **Service Configuration**
   - Type: Web Service
   - Region: Oregon (US West)
   - Branch: main
   - Root Directory: `apps/api`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

2. **Environment Variables**
   - Add all required variables in Render dashboard
   - Ensure `CORS_ORIGIN` matches frontend URL

3. **Health Check**
   - Path: `/api/health`
   - Expected response: `{"status": "ok"}`

### Database (Supabase)

1. **Schema Setup**
   ```sql
   -- Enable pgvector extension
   CREATE EXTENSION IF NOT EXISTS vector;

   -- Run database_schema.sql
   -- Import from apps/api/database_schema.sql
   ```

2. **Storage Configuration**
   - Create `documents` bucket
   - Set public access policies for demo mode
   - Configure CORS for frontend domain

## Demo Mode

Demo mode allows testing without authentication:

- Demo Token: `demo-token-12345`
- Demo User ID: Auto-created UUID
- Demo Organization: `demo-retail-org`

The system automatically creates demo user records on first document upload.

## Monitoring

### Backend Health Check

```bash
curl https://compliance-response-ai.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-03-09T12:34:56.789Z",
  "database": "connected",
  "supabase": "connected"
}
```

### Frontend Health Check

```bash
curl https://pharmaos.vercel.app
```

Should return Next.js application HTML.

## Troubleshooting

### Frontend not connecting to backend

1. Check `NEXT_PUBLIC_API_URL` in Vercel environment variables
2. Verify backend is running at the specified URL
3. Check browser console for CORS errors

### Backend CORS errors

1. Verify `CORS_ORIGIN` matches frontend URL exactly
2. Ensure no trailing slashes in URL configuration
3. Check Render logs for CORS-related errors

### Database connection issues

1. Verify `DATABASE_URL` and `SUPABASE_URL` are correct
2. Check Supabase project is not paused
3. Verify pgvector extension is enabled

### Demo mode uploads failing

1. Check auth middleware UUID conversion
2. Verify demo user exists in database
3. Check Supabase storage bucket permissions

## Rollback Procedure

If deployment fails:

1. **Frontend**: Revert to previous deployment in Vercel dashboard
2. **Backend**: Redeploy previous commit from Render dashboard  
3. **Database**: Restore from Supabase backup if schema changed

## Performance Optimization

- **Frontend**: Vercel Edge Network (CDN)
- **Backend**: Render auto-scaling (disabled on free tier)
- **Database**: Supabase connection pooling
- **Storage**: Supabase CDN for document files

## Security Considerations

- All environment variables stored securely in platform dashboards
- No secrets committed to repository
- CORS restricted to production frontend domain
- Demo mode has limited permissions
- Firebase authentication for production users
