"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/stores/authStore";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { login: storeLogin, logout: storeLogout } = useAuthStore();

  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // User is signed in
        // Get the Firebase ID token for API calls
        const token = await user.getIdToken();
        
        // Sync with authStore 
        // Note: You'll need to fetch additional user data (role, mode) from your backend
        // For now, we'll use default values
        const userData = {
          id: user.uid,
          email: user.email || "",
          name: user.displayName || user.email?.split("@")[0] || "User",
          role: "PHARMACIST" as const, // Default role - should be fetched from backend
          organizationId: undefined,
        };
        
        storeLogin(userData, token);
      } else {
        // User is signed out
        storeLogout();
      }
      
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [storeLogin, storeLogout]);

  const value = {
    currentUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
