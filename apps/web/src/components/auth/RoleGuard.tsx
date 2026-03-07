"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore, UserRole } from "@/stores/authStore";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  loadingColor?: string;
}

export default function RoleGuard({ children, allowedRoles, loadingColor = "border-primary-blue" }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Wait for hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Give zustand time to hydrate from localStorage
    const timer = setTimeout(() => {
      // 1. Check Authentication
      if (!isAuthenticated || !user) {
        router.push("/login");
        return;
      }

      // 2. Check Role Authorization
      if (allowedRoles.includes(user.role)) {
        setIsAuthorized(true);
      } else {
        // Redirect to appropriate portal based on role
        if (user.role === "ADMIN") {
          router.push("/admin");
        } else if (user.role === "MANAGER") {
          router.push("/manager");
        } else if (user.role === "PHARMACIST") {
          router.push("/pos");
        } else {
          router.push("/login"); // Fallback
        }
      }
    }, 150);
    
    return () => clearTimeout(timer);
  }, [mounted, isAuthenticated, user, allowedRoles, router, pathname]);

  // Show loading state while checking
  if (!mounted || !isAuthenticated || !user || !isAuthorized) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className={`w-12 h-12 border-4 ${loadingColor} border-t-transparent rounded-full animate-spin`} />
      </div>
    );
  }

  return <>{children}</>;
}
