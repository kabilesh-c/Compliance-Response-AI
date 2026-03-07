"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LogOut, Pill, LucideIcon } from "lucide-react";
import { useAuthStore, UserRole } from "@/stores/authStore";

export interface NavItem {
  icon: LucideIcon;
  href: string;
  label: string;
}

interface SidebarProps {
  navItems: NavItem[];
  role: UserRole;
}

export default function Sidebar({ navItems, role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getThemeColor = (role: UserRole) => {
    switch (role) {
      case "ADMIN": return "bg-primary-blue text-white shadow-lg shadow-primary-blue/20";
      case "MANAGER": return "bg-primary-yellow text-neutral-900 shadow-lg shadow-primary-yellow/20";
      case "PHARMACIST": return "bg-primary-green text-white shadow-lg shadow-primary-green/20";
      default: return "bg-primary-yellow text-neutral-900";
    }
  };

  const getLogoColor = (role: UserRole) => {
    switch (role) {
      case "ADMIN": return "text-primary-blue";
      case "MANAGER": return "text-primary-yellow-dark";
      case "PHARMACIST": return "text-primary-green";
      default: return "text-primary-yellow-dark";
    }
  };

  const activeThemeClass = getThemeColor(role);
  const logoColorClass = getLogoColor(role);

  return (
    <aside className="fixed left-0 top-0 h-screen w-24 bg-cream-50 flex flex-col items-center py-8 z-50 border-r border-neutral-100/50">
      {/* Logo Section */}
      <div className="flex flex-col items-center gap-1 mb-10">
        <div className={`p-2 rounded-xl bg-white shadow-sm ${logoColorClass}`}>
          <Pill size={28} strokeWidth={2.5} />
        </div>
        <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase">PharmaOS</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-6 w-full px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          // Check if the current path starts with the item href (for nested routes)
          // But handle dashboard specifically to avoid matching everything
          const isActive = item.href.endsWith("/dashboard") 
            ? pathname === item.href || pathname?.endsWith("/dashboard")
            : pathname?.includes(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group
                ${isActive 
                  ? activeThemeClass
                  : "text-neutral-400 hover:bg-white hover:text-neutral-600 hover:shadow-md"
                }
              `}
              title={item.label}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              
              {/* Tooltip for non-active items */}
              {!isActive && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-neutral-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="flex flex-col gap-6 items-center w-full px-4 pb-4">
        <button
          onClick={handleLogout}
          className="w-12 h-12 rounded-full bg-white text-neutral-400 flex items-center justify-center hover:bg-status-danger hover:text-white hover:shadow-lg hover:shadow-status-danger/20 transition-all duration-300"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
        
        <div className="relative">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-md border-2 border-white ${
            user?.role === "ADMIN" ? "bg-primary-blue text-white" :
            user?.role === "MANAGER" ? "bg-primary-yellow text-neutral-900" :
            "bg-primary-green text-white"
          }`}>
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-status-success border-2 border-white rounded-full"></div>
        </div>
      </div>
    </aside>
  );
}
