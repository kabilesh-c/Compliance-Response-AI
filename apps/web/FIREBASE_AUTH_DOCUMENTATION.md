# Firebase Authentication Integration - PharmaOS

## Overview

This document describes the complete Firebase Authentication setup for the PharmaOS pharmacy management platform. The implementation includes **Email/Password** and **Google OAuth** authentication methods while maintaining the existing 6-portal structure (Retail/Hospital modes with Admin, Manager, and Pharmacist/Staff roles).

---

## 🔥 Firebase Configuration

### Project Details
- **Project ID**: pharmaos-5fc57
- **Auth Domain**: pharmaos-5fc57.firebaseapp.com
- **Enabled Methods**: 
  - ✅ Email/Password Authentication
  - ✅ Google OAuth Sign-In

---

## 📁 File Structure

```
apps/web/src/
├── lib/
│   ├── firebase.ts           # Firebase initialization
│   └── auth.ts               # Authentication functions
├── context/
│   └── AuthContext.tsx       # Auth state management context
├── app/
│   ├── layout.tsx            # Root layout with AuthProvider
│   └── (auth)/
│       ├── login/
│       │   └── page.tsx      # Login page with Firebase
│       └── signup/
│           └── page.tsx      # Signup page with Firebase
└── components/
    ├── layout/
    │   └── Sidebar.tsx       # Updated with Firebase logout
    └── examples/
        └── LogoutButtonExample.tsx  # Logout examples
```

---

## 🚀 Implementation Details

### 1. Firebase Initialization (`lib/firebase.ts`)

**Purpose**: Initialize Firebase app and export auth instance.

**Key Features**:
- Singleton pattern (prevents multiple initializations)
- Exports `auth` instance for authentication
- Exports `googleProvider` for OAuth

```typescript
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Initialize only if not already initialized
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
```

---

### 2. Authentication Functions (`lib/auth.ts`)

**Purpose**: Centralized authentication methods with error handling.

**Exported Functions**:

| Function | Description | Returns |
|----------|-------------|---------|
| `signUpWithEmail(email, password)` | Create new Firebase account | `User` object |
| `signInWithEmail(email, password)` | Sign in with credentials | `User` object |
| `signInWithGoogle()` | Sign in with Google popup | `User` object |
| `logout()` | Sign out current user | `void` |

**Error Handling**: All functions convert Firebase error codes to user-friendly messages.

---

### 3. Auth Context (`context/AuthContext.tsx`)

**Purpose**: React Context for managing authentication state across the app.

**Features**:
- ✅ Listens to Firebase auth state changes (`onAuthStateChanged`)
- ✅ Syncs with existing `authStore` (Zustand)
- ✅ Provides loading state during auth checks
- ✅ Automatically updates user data

**Usage**:
```typescript
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const { currentUser, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!currentUser) return <div>Not logged in</div>;
  
  return <div>Welcome, {currentUser.email}</div>;
}
```

---

### 4. Root Layout Update (`app/layout.tsx`)

**Purpose**: Wrap entire app with `AuthProvider` to enable auth state across all pages.

```tsx
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

---

## 🔐 Authentication Flows

### **Signup Flow**

1. User navigates to `/signup`
2. Chooses between:
   - **Register New Pharmacy** → Goes to onboarding
   - **Join Existing Team** → Signup form
3. Fills in:
   - Organization Code
   - Operating Mode (Retail/Hospital)
   - Name, Role, Email, Password
4. Clicks "Create Account" or "Continue with Google"
5. Firebase creates account
6. Backend API stores additional user data (optional)
7. User logged in and redirected based on role + mode

**Code Example** (Signup):
```typescript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Step 1: Create Firebase account
  const firebaseUser = await signUpWithEmail(email, password);
  
  // Step 2: Get ID token
  const token = await firebaseUser.getIdToken();
  
  // Step 3: Store user data
  login(userData, token);
  setMode(formData.mode);
  
  // Step 4: Redirect
  router.push(redirectPath);
};
```

---

### **Login Flow**

1. User navigates to `/login`
2. Options:
   - **Email/Password** login
   - **Continue with Google**
   - **Demo Mode** (one-click for 6 portals)
3. Firebase authenticates user
4. Backend API fetches user data (optional)
5. User logged in and redirected based on role + mode

**Priority Order**:
1. ✅ Check if demo user → Use demo mode
2. ✅ Try Firebase authentication
3. ✅ Fetch user data from backend
4. ✅ Redirect to appropriate portal

**Code Example** (Login):
```typescript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Check demo users first
  if (isDemoUser(email)) {
    // ... demo login
    return;
  }
  
  // Firebase authentication
  const firebaseUser = await signInWithEmail(email, password);
  const token = await firebaseUser.getIdToken();
  
  // Fetch backend data (optional)
  try {
    const { user: apiUser } = await authApi.login(email, password);
    login(apiUser, token);
  } catch {
    // Fall back to Firebase user data
    login(firebaseUserData, token);
  }
  
  router.push(redirectPath);
};
```

---

### **Logout Flow**

1. User clicks logout button (in Sidebar)
2. Firebase signs out user
3. Local auth state cleared
4. User redirected to `/login`

**Code Example** (Logout):
```typescript
const handleLogout = async () => {
  try {
    await firebaseLogout();  // Firebase signOut
    logout();                // Clear authStore
    router.push("/login");
  } catch (error) {
    console.error(error);
    logout();  // Clear local state anyway
    router.push("/login");
  }
};
```

---

## 🎯 6-Portal System Integration

### Portal Structure

| Mode | Role | Portal Path | Access |
|------|------|-------------|--------|
| **RETAIL** | Admin | `/admin` | Full system access |
| **RETAIL** | Manager | `/manager` | Inventory, analytics, staff |
| **RETAIL** | Pharmacist | `/pos` | Point of Sale |
| **HOSPITAL** | Admin | `/hospital/admin` | Full system access |
| **HOSPITAL** | Manager | `/manager` | Inventory, analytics, staff |
| **HOSPITAL** | Staff (Pharmacist) | `/hospital/staff` | Ward operations |

### How It Works

1. **Mode Selection**: During signup, user selects RETAIL or HOSPITAL
2. **Role Assignment**: User assigned Admin/Manager/Pharmacist role
3. **Redirect Logic**: After authentication, user redirected based on mode + role
4. **Persistent State**: Mode and role stored in `authStore` (Zustand with persist)

**Redirect Logic**:
```typescript
const getRedirectPath = (role, mode) => {
  if (mode === "HOSPITAL") {
    switch (role) {
      case "ADMIN": return "/hospital/admin";
      case "MANAGER": return "/manager";
      case "PHARMACIST": return "/hospital/staff";
    }
  } else {
    switch (role) {
      case "ADMIN": return "/admin";
      case "MANAGER": return "/manager";
      case "PHARMACIST": return "/pos";
    }
  }
};
```

---

## 🛡️ Security Features

### ✅ What's Implemented

1. **Firebase Authentication**
   - Secure email/password with bcrypt
   - OAuth with Google (popup flow)
   - Auto token refresh

2. **ID Token Management**
   - Firebase ID tokens for API calls
   - Automatic token refresh by Firebase
   - Token stored in authStore

3. **Error Handling**
   - User-friendly error messages
   - Graceful fallbacks
   - Demo mode for testing

4. **State Management**
   - Firebase auth state listeners
   - Sync with Zustand store
   - Persistent sessions

---

## 🧪 Testing

### Demo Accounts (No Backend Required)

**Retail Mode**:
- `admin@pharmacy.com` (any password) → Admin Portal
- `manager@pharmacy.com` (any password) → Manager Portal
- `pharmacist@pharmacy.com` (any password) → Pharmacist POS

**Hospital Mode**:
- `admin@hospital.com` (any password) → Admin Portal
- `manager@hospital.com` (any password) → Manager Portal
- `staff@hospital.com` (any password) → Staff Portal

### Testing Firebase Auth

1. **Sign Up**: Create new account with any email/password
2. **Google Sign-In**: Click "Continue with Google" button
3. **Logout**: Click logout button in sidebar
4. **Sign In**: Login with created credentials

---

## 📋 Dependencies Installed

```json
{
  "firebase": "^latest"
}
```

**Installed in**: `apps/web/package.json`

---

## 🔧 Configuration

### Environment Variables (Optional)

While Firebase config is currently hardcoded, you can move it to environment variables:

```env
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAR87EfPJcH_1C3dG0Nzi2jj68tukpYqUw
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pharmaos-5fc57.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pharmaos-5fc57
...
```

Update `lib/firebase.ts`:
```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // ...
};
```

---

## 🚀 Usage Examples

### Get Current User

```typescript
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const { currentUser, loading } = useAuth();
  
  return (
    <div>
      {loading ? "Loading..." : currentUser?.email}
    </div>
  );
}
```

### Check Authentication Status

```typescript
import { useAuthStore } from "@/stores/authStore";

function MyComponent() {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return <div>Welcome, {user.name}</div>;
}
```

### Protect Routes

```typescript
// middleware.ts or route guard
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);
  
  return isAuthenticated ? children : null;
}
```

---

## ✅ Complete Checklist

- ✅ Firebase SDK installed
- ✅ Firebase app initialized
- ✅ Auth functions created (signup, login, Google, logout)
- ✅ AuthContext for state management
- ✅ AuthProvider wrapped in root layout
- ✅ Signup page updated with Firebase
- ✅ Login page updated with Firebase
- ✅ Logout functionality in Sidebar
- ✅ Error handling implemented
- ✅ 6-portal system integrated
- ✅ Demo mode preserved
- ✅ Google sign-in button added
- ✅ Loading states added
- ✅ Proper redirects based on role + mode

---

## 🎉 What's Working

1. ✅ **Email/Password Signup**: Create account with Firebase
2. ✅ **Email/Password Login**: Authenticate with Firebase
3. ✅ **Google OAuth**: Sign in with Google popup
4. ✅ **Logout**: Firebase + local state cleared
5. ✅ **6 Portals**: Retail/Hospital modes with 3 roles each
6. ✅ **Demo Mode**: One-click testing without backend
7. ✅ **Role-Based Redirects**: Correct portal based on role + mode
8. ✅ **Persistent Sessions**: Auth state survives page refresh
9. ✅ **Error Messages**: User-friendly Firebase error handling

---

## 📞 Support

For issues or questions:
- Check Firebase Console for auth logs
- Review browser console for errors
- Verify Firebase config in `lib/firebase.ts`
- Ensure Firebase Authentication is enabled in console

---

**Implementation Date**: March 7, 2026  
**Developer**: Kabilesh C  
**Project**: PharmaOS - Intelligent Pharmacy Management Platform
