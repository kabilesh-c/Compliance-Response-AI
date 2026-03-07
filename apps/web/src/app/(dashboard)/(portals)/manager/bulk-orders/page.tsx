"use client";

import { Truck, Package, Calendar, ArrowRight, Download, Brain, Sparkles, TrendingUp, AlertCircle } from "lucide-react";

export default function BulkOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Bulk Orders</h1>
          <p className="text-neutral-500">Aggregate department requests into procurement batches</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue-dark transition-colors">
          <Truck size={20} />
          <span>Generate Bulk Order</span>
        </button>
      </div>

      {/* AI Insight Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 p-4 rounded-2xl flex items-start gap-4">
        <div className="p-2 bg-white rounded-lg shadow-sm text-purple-600">
          <Sparkles size={24} />
        </div>
        <div>
          <h3 className="font-bold text-neutral-900 flex items-center gap-2">
            AI Procurement Insights
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-bold">BETA</span>
          </h3>
          <p className="text-sm text-neutral-600 mt-1">
            Based on current consumption rates, we recommend increasing <strong>Paracetamol</strong> orders by 10% due to predicted seasonal demand. 
            <strong>Saline IV</strong> requests from Ward B seem excessive compared to bed occupancy.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Aggregated Demand View */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
            <h3 className="font-bold text-neutral-900">Aggregated Demand</h3>
            <button className="text-sm text-primary-blue font-medium hover:underline">View Details</button>
          </div>
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left py-3 px-6 text-xs font-semibold text-neutral-500 uppercase">Medicine</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-neutral-500 uppercase">Requested</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-neutral-500 uppercase">
                  <div className="flex items-center gap-1 text-purple-700">
                    <Brain size={14} />
                    AI Suggested
                  </div>
                </th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-neutral-500 uppercase">Departments</th>
                <th className="text-right py-3 px-6 text-xs font-semibold text-neutral-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {[
                { med: "Paracetamol 500mg", reqQty: 5000, aiQty: 5500, depts: ["OPD", "Ward A"], status: "Ready", aiReason: "Flu season trend +10%" },
                { med: "Ceftriaxone Inj.", reqQty: 200, aiQty: 200, depts: ["ICU"], status: "Pending", aiReason: "Matches historical usage" },
                { med: "Saline IV 500ml", reqQty: 1000, aiQty: 800, depts: ["Ward A", "Ward B", "ICU"], status: "Review", aiReason: "Current stock high in Ward B" },
              ].map((item, i) => (
                <tr key={i} className="hover:bg-neutral-50/50">
                  <td className="py-4 px-6 font-medium text-neutral-900">{item.med}</td>
                  <td className="py-4 px-6 text-neutral-700 font-mono">{item.reqQty.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <div className="group relative w-fit">
                      <span className={`font-bold font-mono flex items-center gap-1 cursor-help ${
                        item.aiQty > item.reqQty ? "text-purple-600" : 
                        item.aiQty < item.reqQty ? "text-orange-600" : "text-neutral-400"
                      }`}>
                        {item.aiQty.toLocaleString()}
                        {item.aiQty !== item.reqQty && <TrendingUp size={14} />}
                      </span>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-neutral-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {item.aiReason}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-1 flex-wrap">
                      {item.depts.map((d, j) => (
                        <span key={j} className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-xs">{d}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      item.status === "Ready" ? "bg-green-100 text-green-700" : 
                      item.status === "Review" ? "bg-orange-100 text-orange-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Simulation Panel */}
        <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 h-fit">
          <h3 className="font-bold text-neutral-900 mb-4">Order Simulation</h3>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-neutral-200">
              <div className="text-sm text-neutral-500 mb-1">Estimated Cost</div>
              <div className="text-2xl font-bold text-neutral-900">$12,450</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-neutral-200">
              <div className="text-sm text-neutral-500 mb-1">Total Items</div>
              <div className="text-2xl font-bold text-neutral-900">6,200</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-neutral-200">
              <div className="text-sm text-neutral-500 mb-1">Est. Delivery</div>
              <div className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <Calendar size={18} />
                3-5 Days
              </div>
            </div>
            <button className="w-full py-3 bg-primary-yellow text-neutral-900 rounded-xl font-bold hover:bg-primary-yellow-dark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-yellow-200/50">
              Approve & Send to Procurement
              <ArrowRight size={18} />
            </button>
            <p className="text-xs text-center text-neutral-500">
              Action will create PO drafts for Procurement Officer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
