"use client";

import PharmacistSidebar from "@/components/portals/pharmacist/PharmacistSidebar";
import PharmacistTopBar from "@/components/portals/pharmacist/PharmacistTopBar";
import RoleGuard from "@/components/auth/RoleGuard";

export default function PharmacistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["PHARMACIST"]} loadingColor="border-primary-green">
      <div className="flex h-screen overflow-hidden bg-gradient-to-br from-green-50 to-white">
        <PharmacistSidebar />
        <PharmacistTopBar />
        <main className="flex-1 ml-24 pt-16 h-screen overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}
