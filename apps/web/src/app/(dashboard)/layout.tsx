"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, ShoppingCart, Package, BarChart3, Settings, Zap, Building2, Users, FileText, ClipboardList, Truck, History, PlusCircle, Receipt, Undo2 } from "lucide-react";
import Sidebar, { NavItem } from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { useAuthStore, UserRole } from "@/stores/authStore";

// Define page access by role
const PAGE_ACCESS: Record<string, UserRole[]> = {
  "/dashboard": ["ADMIN", "MANAGER", "PHARMACIST", "PROCUREMENT"],
  "/pos": ["ADMIN", "MANAGER", "PHARMACIST"],
  "/inventory": ["ADMIN", "MANAGER", "PHARMACIST"],
  "/analytics": ["ADMIN", "MANAGER"],
  "/automation": ["ADMIN", "MANAGER"],
  "/settings": ["ADMIN", "MANAGER"],
};

const retailNavItems: NavItem[] = [
  { icon: Home, href: "/dashboard", label: "Dashboard" },
  { icon: ShoppingCart, href: "/pos", label: "POS" },
  { icon: Package, href: "/inventory", label: "Inventory" },
  { icon: BarChart3, href: "/analytics", label: "Analytics" },
  { icon: Zap, href: "/automation", label: "Automation" },
  { icon: Settings, href: "/settings", label: "Settings" },
];

const retailAdminNavItems: NavItem[] = [
  { icon: Home, href: "/admin", label: "Dashboard" },
  { icon: ShoppingCart, href: "/pos", label: "POS" },
  { icon: Package, href: "/inventory", label: "Inventory" },
  { icon: BarChart3, href: "/analytics", label: "Analytics" },
  { icon: Zap, href: "/automation", label: "Automation" },
  { icon: Settings, href: "/settings", label: "Settings" },
];

const retailManagerNavItems: NavItem[] = [
  { icon: Home, href: "/manager", label: "Dashboard" },
  { icon: ShoppingCart, href: "/pos", label: "POS" },
  { icon: Package, href: "/inventory", label: "Inventory" },
  { icon: BarChart3, href: "/analytics", label: "Analytics" },
  { icon: Zap, href: "/automation", label: "Automation" },
  { icon: Settings, href: "/settings", label: "Settings" },
];

const hospitalAdminNavItems: NavItem[] = [
  { icon: Home, href: "/admin", label: "Dashboard" },
  { icon: Building2, href: "/admin/departments", label: "Departments" },
  { icon: Users, href: "/admin/users", label: "Users" },
  { icon: BarChart3, href: "/admin/analytics", label: "Analytics" },
  { icon: FileText, href: "/admin/audit", label: "Audit Logs" },
  { icon: Settings, href: "/admin/settings", label: "Settings" },
];

const hospitalManagerNavItems: NavItem[] = [
  { icon: Home, href: "/manager", label: "Dashboard" },
  { icon: ClipboardList, href: "/manager/requests", label: "Requests" },
  { icon: Package, href: "/manager/inventory", label: "Inventory" },
  { icon: Truck, href: "/manager/bulk-orders", label: "Bulk Orders" },
  { icon: Users, href: "/manager/suppliers", label: "Suppliers" },
  { icon: BarChart3, href: "/manager/analytics", label: "Analytics" },
  { icon: Settings, href: "/manager/settings", label: "Settings" },
];

const hospitalStaffNavItems: NavItem[] = [
  { icon: Home, href: "/hospital/staff", label: "Dashboard" },
  { icon: PlusCircle, href: "/hospital/staff/request/new", label: "New Request" },
  { icon: History, href: "/hospital/staff/requests", label: "History" },
  { icon: Package, href: "/hospital/staff/inventory", label: "Inventory" },
];

const procurementNavItems: NavItem[] = [
  { icon: Home, href: "/procurement", label: "Dashboard" },
  { icon: FileText, href: "/procurement/orders", label: "Purchase Orders" },
  { icon: Users, href: "/procurement/vendors", label: "Vendors" },
  { icon: Truck, href: "/procurement/deliveries", label: "Deliveries" },
  { icon: Receipt, href: "/procurement/invoices", label: "Invoices" },
  { icon: Undo2, href: "/procurement/returns", label: "Returns" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, mode } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [currentNavItems, setCurrentNavItems] = useState<NavItem[]>(retailNavItems);

  // Wait for hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const checkAuth = async () => {
      // Give zustand time to hydrate from localStorage
      await new Promise(resolve => setTimeout(resolve, 150));

      if (!isAuthenticated || !user) {
        router.replace("/login");
        return;
      }
      
      setIsChecking(false);
    };

    checkAuth();
  }, [mounted, isAuthenticated, user, router, pathname]);

  useEffect(() => {
    if (user) {
      if (mode === "HOSPITAL") {
        switch (user.role) {
          case "ADMIN":
            setCurrentNavItems(hospitalAdminNavItems);
            break;
          case "MANAGER":
            setCurrentNavItems(hospitalManagerNavItems);
            break;
          case "PHARMACIST":
            setCurrentNavItems(hospitalStaffNavItems);
            break;
          case "PROCUREMENT":
            setCurrentNavItems(procurementNavItems);
            break;
          default:
            setCurrentNavItems(retailNavItems);
        }
      } else {
        switch (user.role) {
          case "ADMIN":
            setCurrentNavItems(retailAdminNavItems);
            break;
          case "MANAGER":
            setCurrentNavItems(retailManagerNavItems);
            break;
          default:
            setCurrentNavItems(retailNavItems);
        }
      }
    }
  }, [user, mode]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-yellow"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar navItems={currentNavItems} role={user?.role || "PHARMACIST"} />
      <div className="flex-1 flex flex-col min-w-0 ml-24">
        <TopBar />
        <main className="flex-1 p-8 overflow-auto pt-24">
          {children}
        </main>
      </div>
    </div>
  );
}
