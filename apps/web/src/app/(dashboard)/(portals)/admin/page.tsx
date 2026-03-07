"use client";

import { useAuthStore } from "@/stores/authStore";
import HospitalAdminDashboard from "@/components/portals/admin/HospitalAdminDashboard";
import RetailAdminDashboard from "@/components/portals/admin/RetailAdminDashboard";

export default function AdminPage() {
  const { mode } = useAuthStore();

  if (mode === "HOSPITAL") {
    return <HospitalAdminDashboard />;
  }

  return <RetailAdminDashboard />;
}
