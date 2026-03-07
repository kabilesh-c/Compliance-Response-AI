"use client";

import { Search, Filter, AlertCircle, Package, AlertTriangle, Brain } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export default function ManagerInventoryPage() {
  const { mode } = useAuthStore();

  if (mode === "HOSPITAL") {
    return <HospitalInventory />;
  }

  return <RetailInventory />;
}

function HospitalInventory() {
  const inventory = [
    { id: 1, name: "Paracetamol 500mg", batch: "BATCH-001", expiry: "2025-12-31", stock: 5000, status: "GOOD", ai: null },
    { id: 2, name: "Amoxicillin 250mg", batch: "BATCH-002", expiry: "2024-02-15", stock: 1200, status: "EXPIRING_SOON", ai: { type: "risk", msg: "Likely to expire in 18 days", reason: "Based on OPD usage + lead time" } },
    { id: 3, name: "Ceftriaxone Inj.", batch: "BATCH-003", expiry: "2024-01-20", stock: 50, status: "CRITICAL", ai: { type: "demand", msg: "Critical demand expected", reason: "Flu season spike predicted" } },
    { id: 4, name: "Insulin Glargine", batch: "BATCH-004", expiry: "2025-06-30", stock: 300, status: "GOOD", ai: { type: "slow", msg: "Low movement batch", reason: "Stock stagnant for 45 days" } },
    { id: 5, name: "Saline IV 500ml", batch: "BATCH-005", expiry: "2024-03-01", stock: 800, status: "GOOD", ai: null },
    { id: 6, name: "Metformin 500mg", batch: "PO-2024-001", expiry: "-", stock: 0, status: "PENDING_DELIVERY", ai: { type: "demand", msg: "Arriving Tomorrow", reason: "Procurement fulfilled, in transit" } },
    { id: 7, name: "Azithromycin 500mg", batch: "PO-2024-002", expiry: "2026-01-01", stock: 200, status: "PARTIALLY_FULFILLED", ai: { type: "risk", msg: "Partial Stock Received", reason: "Vendor shortage, remaining 300 units pending" } },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Central Inventory</h1>
          <p className="text-neutral-500">Hospital-wide stock management (Batch-wise)</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input 
              type="text" 
              placeholder="Search medicines..." 
              className="pl-10 pr-4 py-2 rounded-xl border border-neutral-200 focus:border-primary-yellow outline-none"
            />
          </div>
          <button className="px-4 py-2 bg-white border border-neutral-200 rounded-xl text-neutral-600 font-medium flex items-center gap-2">
            <Filter size={18} /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-100">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase">Medicine Name</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase">Batch No.</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase">Expiry Date</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase">Stock Level</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase">AI Prediction</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-neutral-50/50">
                <td className="py-4 px-6 font-medium text-neutral-900">{item.name}</td>
                <td className="py-4 px-6 text-neutral-600 font-mono text-sm">{item.batch}</td>
                <td className="py-4 px-6 text-neutral-600">{item.expiry}</td>
                <td className="py-4 px-6 font-bold text-neutral-900">{item.stock}</td>
                <td className="py-4 px-6">
                  {item.ai ? (
                    <div className="group relative w-fit">
                      <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full cursor-help ${
                        item.ai.type === "risk" ? "bg-red-50 text-red-700 border border-red-100" :
                        item.ai.type === "demand" ? "bg-purple-50 text-purple-700 border border-purple-100" :
                        "bg-yellow-50 text-yellow-700 border border-yellow-100"
                      }`}>
                        <Brain size={12} />
                        {item.ai.msg}
                      </span>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-neutral-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {item.ai.reason}
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-neutral-400">-</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  {item.status === "CRITICAL" && (
                    <span className="flex items-center gap-1 text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded-full w-fit">
                      <AlertCircle size={14} /> Critical Low
                    </span>
                  )}
                  {item.status === "EXPIRING_SOON" && (
                    <span className="flex items-center gap-1 text-orange-600 text-xs font-bold bg-orange-50 px-2 py-1 rounded-full w-fit">
                      <AlertTriangle size={14} /> Expiring Soon
                    </span>
                  )}
                  {item.status === "GOOD" && (
                    <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full w-fit">
                      <Package size={14} /> Optimal
                    </span>
                  )}
                  {item.status === "PENDING_DELIVERY" && (
                    <span className="flex items-center gap-1 text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded-full w-fit">
                      <Package size={14} /> Pending Delivery
                    </span>
                  )}
                  {item.status === "PARTIALLY_FULFILLED" && (
                    <span className="flex items-center gap-1 text-purple-600 text-xs font-bold bg-purple-50 px-2 py-1 rounded-full w-fit">
                      <Package size={14} /> Partially Fulfilled
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function RetailInventory() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Retail Inventory</h1>
        <button className="px-4 py-2 bg-primary-yellow text-neutral-900 rounded-lg font-bold">
          Add New Item
        </button>
      </div>
      <div className="bg-white p-8 rounded-2xl text-center text-neutral-500">
        Retail Inventory Content Placeholder
      </div>
    </div>
  );
}
