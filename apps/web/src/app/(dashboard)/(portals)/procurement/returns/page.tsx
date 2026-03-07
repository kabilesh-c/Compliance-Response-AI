"use client";

import { Search, Filter, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Returns Management</h1>
          <p className="text-neutral-500">Process and track returned stock</p>
        </div>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center gap-2">
          <RotateCcw size={18} />
          Create Return
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-100">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase">Return ID</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase">Vendor</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase">Reason</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase">Date</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase">Status</th>
              <th className="text-right py-4 px-6 text-xs font-bold text-neutral-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {[
              { id: "RET-2024-001", vendor: "MediSupply Ltd", reason: "Damaged Goods", date: "Dec 18, 2025", status: "Pending Approval" },
              { id: "RET-2024-002", vendor: "BioTech Solutions", reason: "Near Expiry", date: "Dec 15, 2025", status: "Approved" },
              { id: "RET-2024-003", vendor: "PharmaCorp Global", reason: "Wrong Item", date: "Dec 10, 2025", status: "Completed" },
            ].map((ret, i) => (
              <tr key={i} className="hover:bg-neutral-50/50">
                <td className="py-4 px-6 font-mono text-sm text-neutral-600">{ret.id}</td>
                <td className="py-4 px-6 font-medium text-neutral-900">{ret.vendor}</td>
                <td className="py-4 px-6 text-neutral-600 text-sm">{ret.reason}</td>
                <td className="py-4 px-6 text-neutral-600 text-sm">{ret.date}</td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    ret.status === "Pending Approval" ? "bg-orange-100 text-orange-700" :
                    ret.status === "Approved" ? "bg-blue-100 text-blue-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {ret.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="text-sm font-medium text-neutral-600 hover:text-primary-blue transition-colors">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
