"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import HospitalManagerDashboard from "@/components/portals/manager/HospitalManagerDashboard";
import RetailManagerDashboard from "@/components/portals/manager/RetailManagerDashboard";

export default function ManagerDashboardPage() {
  const { mode } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (mode === "HOSPITAL") {
    return <HospitalManagerDashboard />;
  }

  return <RetailManagerDashboard />;
}
