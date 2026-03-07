"use client";

import { FileText, CheckCircle, XCircle, Clock, Filter, Search, AlertTriangle, Brain } from "lucide-react";

export default function DepartmentRequestsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Department Requests</h1>
          <p className="text-neutral-500">Approve, modify, or reject medicine requests</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-bold flex items-center gap-2">
            <AlertTriangle size={16} />
            3 Critical Pending
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by department or medicine..." 
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 border-none rounded-lg focus:ring-2 focus:ring-primary-blue/20"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-neutral-600 hover:bg-neutral-50 rounded-lg">
          <Filter size={20} />
          <span>Filter Status</span>
        </button>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-100">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-600">Department</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-600">Medicine</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-600">Quantity</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-600">AI Analysis</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-600">Priority</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-600">Status</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-neutral-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {[
              { dept: "ICU", med: "Epinephrine Inj.", qty: "50 Amps", priority: "Critical", status: "Pending", time: "2h ago", ai: { suggest: "50", risk: "Critical Shortage", confidence: "High" } },
              { dept: "OPD", med: "Paracetamol 500mg", qty: "1000 Tabs", priority: "Normal", status: "Sent to Procurement", time: "4h ago", ai: { suggest: "800", risk: "Overstock Risk", confidence: "Medium" } },
              { dept: "Ward A", med: "Saline IV 500ml", qty: "200 Bags", priority: "Normal", status: "Fulfilled", time: "1d ago", ai: null },
              { dept: "Emergency", med: "Morphine Inj.", qty: "20 Amps", priority: "Critical", status: "Delayed", time: "3h ago", ai: null },
            ].map((req, i) => (
              <tr key={i} className={`hover:bg-neutral-50/50 ${req.priority === "Critical" ? "bg-red-50/30" : ""}`}>
                <td className="py-4 px-6">
                  <div className="font-medium text-neutral-900">{req.dept}</div>
                  <div className="text-xs text-neutral-500">{req.time}</div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-neutral-900">{req.med}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="font-medium text-neutral-900">{req.qty}</span>
                  {req.ai && req.ai.suggest !== req.qty.split(' ')[0] && (
                     <div className="mt-1 text-xs flex items-center gap-1 text-yellow-700 bg-yellow-50 px-2 py-1 rounded border border-yellow-200 w-fit" title="AI Suggested Quantity">
                        <Brain size={10} />
                        Suggest: {req.ai.suggest}
                     </div>
                  )}
                </td>
                <td className="py-4 px-6">
                   {req.ai ? (
                     <div className="space-y-1">
                        {req.ai.risk === "Overstock Risk" && (
                           <span className="flex items-center gap-1 text-xs font-bold text-orange-600">
                              <AlertTriangle size={12} /> Overstock Risk
                           </span>
                        )}
                        {req.ai.risk === "Critical Shortage" && (
                           <span className="flex items-center gap-1 text-xs font-bold text-red-600">
                              <AlertTriangle size={12} /> Shortage Risk
                           </span>
                        )}
                        <div className="text-[10px] text-neutral-500 flex items-center gap-1">
                           <div className={`w-1.5 h-1.5 rounded-full ${req.ai.confidence === "High" ? "bg-green-500" : "bg-yellow-500"}`}></div>
                           {req.ai.confidence} Confidence
                        </div>
                     </div>
                   ) : (
                     <span className="text-xs text-neutral-400">-</span>
                   )}
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    req.priority === "Critical" ? "bg-red-100 text-red-700" : "bg-blue-50 text-blue-700"
                  }`}>
                    {req.priority}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    req.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                    req.status === "Sent to Procurement" ? "bg-purple-100 text-purple-700" :
                    req.status === "Fulfilled" ? "bg-green-100 text-green-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  {req.status === "Pending" && (
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve & Send">
                        <CheckCircle size={20} />
                      </button>
                      <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                        <XCircle size={20} />
                      </button>
                      <button className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Escalate">
                        <AlertTriangle size={20} />
                      </button>
                    </div>
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

