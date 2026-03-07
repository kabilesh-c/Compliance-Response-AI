"use client";

import { Home, BarChart3, Settings, Zap, Users, FileText } from "lucide-react";
import Sidebar, { NavItem } from "@/components/layout/Sidebar";

const navItems: NavItem[] = [
  { icon: Home, href: "/admin/dashboard", label: "Dashboard" },
  { icon: BarChart3, href: "/admin/analytics", label: "Analytics" },
  { icon: Zap, href: "/admin/automation", label: "Automation / AI" },
  { icon: FileText, href: "/admin/audit", label: "Audit Logs" },
  { icon: Users, href: "/admin/users", label: "User Management" },
  { icon: Settings, href: "/admin/settings", label: "Settings" },
];

export default function AdminSidebar() {
  return <Sidebar navItems={navItems} role="ADMIN" />;
}
