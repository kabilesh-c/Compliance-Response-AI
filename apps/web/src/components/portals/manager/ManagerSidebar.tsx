"use client";

import { Home, ShoppingCart, Package, BarChart3, Settings, Zap } from "lucide-react";
import Sidebar, { NavItem } from "@/components/layout/Sidebar";

const navItems: NavItem[] = [
  { icon: Home, href: "/manager", label: "Dashboard" },
  { icon: ShoppingCart, href: "/manager/pos", label: "POS" },
  { icon: Package, href: "/manager/inventory", label: "Inventory" },
  { icon: BarChart3, href: "/manager/analytics", label: "Analytics" },
  { icon: Zap, href: "/manager/automation", label: "Automation / AI" },
  { icon: Settings, href: "/manager/settings", label: "Settings" },
];

export default function ManagerSidebar() {
  return <Sidebar navItems={navItems} role="MANAGER" />;
}
