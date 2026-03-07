"use client";

import PharmacistMedicineInfoCard from "@/components/portals/pharmacist/dashboard/PharmacistMedicineInfoCard";
import DailyTaskChecklist from "@/components/portals/pharmacist/dashboard/DailyTaskChecklist";
import PharmacistPrescriptionsCard from "@/components/portals/pharmacist/dashboard/PharmacistPrescriptionsCard";
import PharmacistRecentOrdersCard from "@/components/portals/pharmacist/dashboard/PharmacistRecentOrdersCard";
import PharmacistStockAlertCard from "@/components/portals/pharmacist/dashboard/PharmacistStockAlertCard";
import PharmacistMetricCards from "@/components/portals/pharmacist/dashboard/PharmacistMetricCards";

export default function PharmacistDashboardPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-600 mt-1">Here's your shift overview for today</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary-green/10 text-primary-green rounded-full text-sm font-medium">
          <span className="w-2 h-2 bg-status-success rounded-full animate-pulse" />
          On Duty
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
        {/* Row 1: Medicine Info + Daily Tasks + Prescriptions */}
        <div className="col-span-1 md:col-span-3 lg:col-span-4">
          <PharmacistMedicineInfoCard />
        </div>
        <div className="col-span-1 md:col-span-3 lg:col-span-3">
          <DailyTaskChecklist />
        </div>
        <div className="col-span-1 md:col-span-6 lg:col-span-5">
          <PharmacistPrescriptionsCard />
        </div>

        {/* Row 2: Stock Alert + Recent Orders */}
        <div className="col-span-1 md:col-span-6 lg:col-span-7">
          <PharmacistStockAlertCard />
        </div>
        <div className="col-span-1 md:col-span-6 lg:col-span-5">
          <PharmacistRecentOrdersCard />
        </div>

        {/* Row 3: Metrics */}
        <div className="col-span-1 md:col-span-6 lg:col-span-12">
          <PharmacistMetricCards />
        </div>
      </div>
    </div>
  );
}

