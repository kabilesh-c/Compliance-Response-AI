# Troubleshooting Guide

Common issues and solutions for PharmaOS Compliance Response AI.

## Table of Contents

1. [Installation & Setup Issues](#installation--setup-issues)
2. [Document Upload Problems](#document-upload-problems)
3. [Answer Generation Issues](#answer-generation-issues)
4. [Authentication Errors](#authentication-errors)
5. [Database Connection Problems](#database-connection-problems)
6. [Export Problems](#export-problems)
7. [Performance Issues](#performance-issues)
8. [Production Deployment Issues](#production-deployment-issues)

---

## Installation & Setup Issues

### Issue: npm install fails with dependency errors

**Symptoms:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE could not resolve
```

**Solutions:**

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Use correct Node version:**
   ```bash
   node --version  # Should be 18.x or later
   nvm use 18
   ```

3. **Install with legacy peer deps:**
   ```bash
   npm install --legacy-peer-deps
   ```

---

### Issue: TypeScript compilation errors

**Symptoms:**
```
error TS2304: Cannot find name 'X'
error TS2307: Cannot find module 'Y'
```

**Solutions:**

1. **Reinstall dependencies:**
   ```bash
   cd apps/web  # or apps/api
   npm install
   ```

2. **Check tsconfig.json:**
   - Ensure `"moduleResolution": "node"` is set
   - Verify path mappings are correct

3. **Restart TypeScript server:**
   - In VS Code: `Cmd/Ctrl + Shift + P` → "Restart TypeScript Server"

---

## Document Upload Problems

### Issue: Document upload returns 500 error

**Symptoms:**
- Upload spinner never completes
- Console shows 500 Internal Server Error
- Error message: "Failed to upload documents"

**Solutions:**

1. **Check file size limits:**
   - PDF: Max 100MB
   - DOCX: Max 50MB
   - TXT/MD: Max 10MB
   - XLSX: Max 10MB

2. **Verify file format:**
   - Ensure files have correct extensions
   - Check files aren't corrupted

3. **Check Supabase storage:**
   ```bash
   # Verify storage bucket exists
   # Check service role key is correct
   # Verify CORS settings allow your domain
   ```

4. **Check backend logs:**
   ```bash
   # Local development
   # Check terminal running backend server

   # Production
   # Check Render logs
   ```

---

### Issue: Demo mode upload fails with 403 error

**Symptoms:**
```
Error: User not found or unauthorized
Status: 403
```

**Solutions:**

1. **Verify demo token:**
   - Token should be: `demo-token-12345`
   - Check Authorization header format

2. **Check demo user creation:**
   ```sql
   -- In Supabase SQL editor
   SELECT * FROM organizations WHERE id = '550e8400-e29b-41d4-a716-446655440000';
   SELECT * FROM users WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
   ```

3. **Verify auth middleware:**
   - Ensure `ensureDemoUserExists()` is called
   - Check UUID conversion is working

---

### Issue: Questionnaire parsing fails

**Symptoms:**
- Upload succeeds but shows 0 questions
- Error: "Failed to parse questionnaire"

**Solutions:**

1. **Check XLSX format:**
   - Must have "Question" column
   - Questions must be in one column
   - First row should be headers

2. **Example correct format:**
   ```
   | Section  | Question                           | Answer |
   |----------|-----------------------------------|--------|
   | Security | What encryption do you use?       |        |
   | Privacy  | How do you handle PII?            |        |
   ```

3. **Avoid common issues:**
   - Don't merge cells
   - Don't use complex formulas
   - Keep question text simple

---

## Answer Generation Issues

### Issue: Answer generation takes too long

**Symptoms:**
- Loading spinner runs for minutes
- Eventually times out

**Solutions:**

1. **Check document count:**
   - Limit to 5-10 documents per session
   - Very large PDFs may slow processing

2. **Check Gemini API quota:**
   - Verify API key is valid
   - Check quota limits in Google Cloud Console

3. **Check network connection:**
   - Ensure stable internet connection
   - Verify no firewall blocking API calls

---

### Issue: Answers are always "Information not available"

**Symptoms:**
- Every answer says information not found
- Confidence scores are 0%

**Solutions:**

1. **Check document relevance:**
   - Ensure uploaded documents actually contain relevant information
   - Questions and documents must be related

2. **Check embedding service:**
   ```typescript
   // In backend logs, look for:
   // "Embedded X chunks for document Y"
   ```

3. **Verify vector search:**
   ```sql
   -- In Supabase, check embeddings exist:
   SELECT COUNT(*) FROM document_chunks;
   SELECT COUNT(*) FROM document_chunks WHERE embedding IS NOT NULL;
   ```

4. **Check retrieval threshold:**
   - Current threshold: 0.3 similarity
   - May need to adjust for your use case

---

### Issue: Citations missing page numbers

**Symptoms:**
- Citations show document name but no page
- Page number shows "Page unknown"

**Solutions:**

1. **This is expected for some formats:**
   - TXT files don't have page numbers
   - MD files don't have page numbers
   - DOCX may not preserve page info

2. **For PDFs:**
   - Ensure PDF has actual pages (not images)
   - Some PDFs may not extract page metadata

3. **Workaround:**
   - Edit citation to add page number manually
   - Reference specific section names instead

---

## Authentication Errors

### Issue: Firebase authentication not working

**Symptoms:**
```
Error: Failed to sign in
Firebase: Error (auth/invalid-api-key)
```

**Solutions:**

1. **Check Firebase config:**
   ```bash
   # In apps/web/.env.local
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   # ... other Firebase variables
   ```

2. **Verify Firebase project:**
   - Check project exists in Firebase Console
   - Verify Authentication is enabled
   - Check Google sign-in is enabled

3. **Check API key restrictions:**
   - In Google Cloud Console
   - Ensure key allows Firebase Authentication API

---

## Database Connection Problems

### Issue: Backend can't connect to database

**Symptoms:**
```
Error: connect ECONNREFUSED
Error: Connection terminated unexpectedly
```

**Solutions:**

1. **Check DATABASE_URL:**
   ```bash
   # Format: postgresql://user:password@host:5432/database
   # Verify credentials are correct
   # Check host is reachable
   ```

2. **Check Supabase status:**
   - Visit status.supabase.com
   - Check your project isn't paused

3. **Check pgvector extension:**
   ```sql
   -- In Supabase SQL editor:
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

4. **Verify connection pooling:**
   - Supabase has connection limits
   - Check you're not exceeding connections

---

## Export Problems

### Issue: Word export shows raw RTF codes

**Symptoms:**
- Downloaded file shows `\b`, `\b0`, `\par`
- Text not formatted properly

**Solutions:**

1. **Check you're opening in Word:**
   - File should be .rtf extension
   - Open with Microsoft Word or compatible app
   - Don't open in text editor

2. **Try different app:**
   - Try Google Docs "Open" feature
   - Try LibreOffice Writer
   - Try online RTF viewer

3. **Use PDF export instead:**
   - More reliable formatting
   - Better for sending to others

---

### Issue: PDF download gives .md file

**Symptoms:**
- Downloaded file is markdown not PDF
- File extension is .md

**Solutions:**

1. **This is expected behavior:**
   - "PDF" export actually opens print dialog
   - You must manually "Save as PDF" in the dialog

2. **Correct workflow:**
   - Click "Download PDF"
   - Print dialog opens
   - Select "Save as PDF" as printer
   - Click Save

3. **Why this approach:**
   - No server-side PDF generation needed
   - User controls page layout
   - Better browser compatibility

---

## Performance Issues

### Issue: Frontend loads very slowly

**Symptoms:**
- Initial page load takes 10+ seconds
- Slow navigation between pages

**Solutions:**

1. **Check Next.js build:**
   ```bash
   cd apps/web
   npm run build
   npm start  # Use production build locally
   ```

2. **Check bundle size:**
   ```bash
   npm run build  # Look for warnings about bundle size
   ```

3. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

### Issue: Answer generation times out

**Symptoms:**
- Request times out after 30 seconds
- Error: "Request timeout"

**Solutions:**

1. **Increase timeout:**
   ```typescript
   // In frontend API client
   fetch(url, {
     ...options,
     timeout: 60000  // 60 seconds
   });
   ```

2. **Reduce document count:**
   - Upload fewer documents
   - Split large documents

3. **Check Render cold start:**
   - Free tier has cold starts (10-30 seconds)
   - First request after inactivity is slower

---

## Production Deployment Issues

### Issue: Vercel build fails

**Symptoms:**
```
Error: Build failed
Type error: X is not defined
```

**Solutions:**

1. **Check environment variables:**
   - All `NEXT_PUBLIC_*` variables set in Vercel
   - Values match production configuration

2. **Check build locally:**
   ```bash
   cd apps/web
   npm run build  # Must succeed locally first
   ```

3. **Check logs:**
   - Vercel dashboard → Deployments → Click failed build
   - Read full error message

---

### Issue: Render deployment fails

**Symptoms:**
```
Error: Build failed
Module not found
```

**Solutions:**

1. **Check build command:**
   - Should be: `npm install && npm run build`
   - Verify start command: `npm start`

2. **Check environment variables:**
   - All required variables set in Render dashboard
   - No typos in variable names

3. **Check Node version:**
   - Render uses Node 18 by default
   - Specify version in package.json if needed:
     ```json
     {
       "engines": {
         "node": "18.x"
       }
     }
     ```

---

### Issue: CORS errors in production

**Symptoms:**
```
Access to fetch at 'X' from origin 'Y' has been blocked by CORS policy
```

**Solutions:**

1. **Check CORS_ORIGIN on backend:**
   ```bash
   # Must match frontend URL exactly:
   CORS_ORIGIN=https://pharmaos.vercel.app
   # No trailing slash!
   ```

2. **Verify frontend API URL:**
   ```javascript
   // In apps/web/src/lib/api.ts
   const API_URL = 'https://compliance-response-ai.onrender.com/api';
   ```

3. **Check credentials:**
   ```typescript
   // Ensure credentials are included:
   fetch(url, {
     ...options,
     credentials: 'include'
   });
   ```

---

## Getting More Help

If you're still experiencing issues:

1. **Check GitHub Issues:**
   - Search existing issues
   - Look for similar problems

2. **Enable Debug Logging:**
   ```bash
   # Backend
   LOG_LEVEL=debug

   # Frontend
   # Open browser console (F12)
   ```

3. **Create Report:**
   ```
   - Operating System:
   - Browser (+ version):
   - Node version:
   - Error message:
   - Steps to reproduce:
   - Expected behavior:
   - Actual behavior:
   - Screenshots:
   ```

4. **Contact Support:**
   - Create GitHub issue with details
   - Tag as "bug" or "help wanted"
   - Include report from step 3
