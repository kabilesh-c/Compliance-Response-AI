"use client";

import { Home, ShoppingCart, Package } from "lucide-react";
import Sidebar, { NavItem } from "@/components/layout/Sidebar";

const navItems: NavItem[] = [
  { icon: Home, href: "/pharmacist/dashboard", label: "Dashboard" },
  { icon: ShoppingCart, href: "/pharmacist/pos", label: "POS" },
  { icon: Package, href: "/pharmacist/inventory", label: "Inventory" },
];

export default function PharmacistSidebar() {
  return <Sidebar navItems={navItems} role="PHARMACIST" />;
}
