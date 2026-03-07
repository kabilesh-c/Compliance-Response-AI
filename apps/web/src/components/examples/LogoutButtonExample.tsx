/**
 * Logout Button Example
 * 
 * This file demonstrates how to implement a logout button in any component
 * using Firebase Authentication integrated with the PharmaOS auth system.
 */

"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { logout as firebaseLogout } from "@/lib/auth";
import { LogOut } from "lucide-react";

/**
 * Example 1: Simple Logout Button
 */
export function SimpleLogoutButton() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      // Step 1: Logout from Firebase
      await firebaseLogout();
      
      // Step 2: Clear local auth state
      logout();
      
      // Step 3: Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if Firebase logout fails, clear local state and redirect
      logout();
      router.push("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
    >
      Logout
    </button>
  );
}

/**
 * Example 2: Logout Button with Icon
 */
export function IconLogoutButton() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await firebaseLogout();
      logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      logout();
      router.push("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-neutral-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all"
    >
      <LogOut size={18} />
      <span>Sign Out</span>
    </button>
  );
}

/**
 * Example 3: Dropdown Menu Item (for navbar dropdowns)
 */
export function LogoutMenuItem() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await firebaseLogout();
      logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      logout();
      router.push("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
    >
      Sign Out
    </button>
  );
}

/**
 * Example 4: Logout with Confirmation
 */
export function LogoutButtonWithConfirmation() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm("Are you sure you want to logout?");
    
    if (!confirmed) return;

    try {
      await firebaseLogout();
      logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      logout();
      router.push("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all"
    >
      Logout
    </button>
  );
}

/**
 * Usage Examples:
 * 
 * 1. In a NavBar:
 * ```tsx
 * import { IconLogoutButton } from '@/components/examples/LogoutButtonExample';
 * 
 * function NavBar() {
 *   return (
 *     <nav>
 *       <IconLogoutButton />
 *     </nav>
 *   );
 * }
 * ```
 * 
 * 2. In a Settings Page:
 * ```tsx
 * import { LogoutButtonWithConfirmation } from '@/components/examples/LogoutButtonExample';
 * 
 * function SettingsPage() {
 *   return (
 *     <div>
 *       <h2>Account Settings</h2>
 *       <LogoutButtonWithConfirmation />
 *     </div>
 *   );
 * }
 * ```
 * 
 * 3. In a User Menu Dropdown:
 * ```tsx
 * import { LogoutMenuItem } from '@/components/examples/LogoutButtonExample';
 * 
 * function UserMenu() {
 *   return (
 *     <div className="dropdown">
 *       <LogoutMenuItem />
 *     </div>
 *   );
 * }
 * ```
 */
