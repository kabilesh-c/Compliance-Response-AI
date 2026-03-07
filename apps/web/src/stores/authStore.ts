"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "ADMIN" | "MANAGER" | "PHARMACIST" | "PROCUREMENT";
export type SystemMode = "RETAIL" | "HOSPITAL";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  mode: SystemMode;
  isAuthenticated: boolean;
  
  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  setMode: (mode: SystemMode) => void;
  
  // Role checks
  isAdmin: () => boolean;
  isManager: () => boolean;
  isPharmacist: () => boolean;
  isProcurement: () => boolean;
  canAccessPage: (page: string) => boolean;
  canPerformAction: (action: string) => boolean;
}

// Page access by role
const PAGE_ACCESS: Record<string, UserRole[]> = {
  dashboard: ["ADMIN", "MANAGER", "PHARMACIST"],
  pos: ["ADMIN", "MANAGER", "PHARMACIST"],
  inventory: ["ADMIN", "MANAGER", "PHARMACIST"],
  analytics: ["ADMIN", "MANAGER"],
  automation: ["ADMIN", "MANAGER"],
  settings: ["ADMIN", "MANAGER"],
};

// Action permissions by role
const ACTION_PERMISSIONS: Record<string, UserRole[]> = {
  "sale.create": ["ADMIN", "MANAGER", "PHARMACIST"],
  "sale.complete": ["ADMIN", "MANAGER"],
  "inventory.edit": ["ADMIN", "MANAGER"],
  "inventory.delete": ["ADMIN"],
  "order.create": ["ADMIN", "MANAGER"],
  "settings.edit": ["ADMIN", "MANAGER"],
  "settings.roles": ["ADMIN"],
  "analytics.view": ["ADMIN", "MANAGER"],
  "automation.edit": ["ADMIN", "MANAGER"],
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      mode: "RETAIL",
      isAuthenticated: false,

      login: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      setMode: (mode) => {
        set({ mode });
      },

      isAdmin: () => get().user?.role === "ADMIN",
      isManager: () => get().user?.role === "MANAGER",
      isPharmacist: () => get().user?.role === "PHARMACIST",
      isProcurement: () => get().user?.role === "PROCUREMENT",

      canAccessPage: (page) => {
        const user = get().user;
        if (!user) return false;
        const allowedRoles = PAGE_ACCESS[page] || [];
        return allowedRoles.includes(user.role);
      },

      canPerformAction: (action) => {
        const user = get().user;
        if (!user) return false;
        const allowedRoles = ACTION_PERMISSIONS[action] || [];
        return allowedRoles.includes(user.role);
      },
    }),
    {
      name: "pharmacy-auth",
    }
  )
);
