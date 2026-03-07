import MedicineInfoCard from "@/components/dashboard/MedicineInfoCard";
import ActiveSalesmanCard from "@/components/dashboard/ActiveSalesmanCard";
import PrescriptionsCard from "@/components/dashboard/PrescriptionsCard";
import RecentOrdersCard from "@/components/dashboard/RecentOrdersCard";
import StockAlertCard from "@/components/dashboard/StockAlertCard";
import ExpiredCard from "@/components/dashboard/ExpiredCard";
import ExpiringSoonCard from "@/components/dashboard/ExpiringSoonCard";
import MetricCards from "@/components/dashboard/MetricCards";

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
        {/* Row 1: Medicine Info + Active Salesman + Prescriptions */}
        <div className="col-span-1 md:col-span-3 lg:col-span-4">
          <MedicineInfoCard />
        </div>
        <div className="col-span-1 md:col-span-3 lg:col-span-3">
          <ActiveSalesmanCard />
        </div>
        <div className="col-span-1 md:col-span-6 lg:col-span-5">
          <PrescriptionsCard />
        </div>

        {/* Row 2: Stock Alert + Recent Orders */}
        <div className="col-span-1 md:col-span-6 lg:col-span-7">
          <StockAlertCard />
        </div>
        <div className="col-span-1 md:col-span-6 lg:col-span-5 row-span-2">
          <RecentOrdersCard />
        </div>

        {/* Row 3: Expired + Expiring Soon */}
        <div className="col-span-1 md:col-span-3 lg:col-span-3">
          <ExpiredCard />
        </div>
        <div className="col-span-1 md:col-span-3 lg:col-span-4">
          <ExpiringSoonCard />
        </div>

        {/* Row 4: Metrics */}
        <div className="col-span-1 md:col-span-6 lg:col-span-12">
          <MetricCards />
        </div>
      </div>
    </div>
  );
}
