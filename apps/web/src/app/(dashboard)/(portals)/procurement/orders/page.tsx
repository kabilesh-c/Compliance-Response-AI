"use client";

import { Search, Filter, Plus, FileText, MoreHorizontal, Brain } from "lucide-react";

export default function PurchaseOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Purchase Orders</h1>
          <p className="text-neutral-500">Manage procurement requests and vendor orders</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue-dark transition-colors">
          <Plus size={20} />
          <span>Create New PO</span>
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input 
            type="text" 
            placeholder="Search POs, vendors, or items..." 
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 focus:border-primary-blue outline-none"
          />
        </div>
        <button className="px-4 py-2 bg-white border border-neutral-200 rounded-xl text-neutral-600 font-medium flex items-center gap-2">
          <Filter size={18} /> Filter
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-100">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase">PO Number</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase">Vendor</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase">Created Date</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase">Items</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase">Total Amount</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase">Status</th>
              <th className="text-right py-4 px-6 text-xs font-bold text-neutral-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {[
              { id: "PO-2024-001", vendor: "PharmaCorp Global", date: "Dec 20, 2025", items: 12, amount: "$12,450", status: "Draft", ai: true },
              { id: "PO-2024-002", vendor: "MediSupply Ltd", date: "Dec 19, 2025", items: 5, amount: "$3,200", status: "Sent", ai: false },
              { id: "PO-2024-003", vendor: "BioTech Solutions", date: "Dec 18, 2025", items: 8, amount: "$8,900", status: "Confirmed", ai: false },
              { id: "PO-2024-004", vendor: "Generic Meds Inc", date: "Dec 18, 2025", items: 3, amount: "$1,500", status: "Delivered", ai: false },
              { id: "PO-2024-005", vendor: "Surgical Supplies Co", date: "Dec 17, 2025", items: 15, amount: "$5,600", status: "Partial", ai: false },
            ].map((po) => (
              <tr key={po.id} className="hover:bg-neutral-50/50">
                <td className="py-4 px-6 font-mono text-sm font-medium text-primary-blue">{po.id}</td>
                <td className="py-4 px-6 text-neutral-900 font-medium">
                  {po.vendor}
                  {po.ai && (
                    <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                      <Brain size={10} /> AI Draft
                    </span>
                  )}
                </td>
                <td className="py-4 px-6 text-neutral-600 text-sm">{po.date}</td>
                <td className="py-4 px-6 text-neutral-900">{po.items}</td>
                <td className="py-4 px-6 font-bold text-neutral-900">{po.amount}</td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    po.status === "Draft" ? "bg-neutral-100 text-neutral-600" :
                    po.status === "Sent" ? "bg-blue-100 text-blue-700" :
                    po.status === "Confirmed" ? "bg-purple-100 text-purple-700" :
                    po.status === "Delivered" ? "bg-green-100 text-green-700" :
                    "bg-orange-100 text-orange-700"
                  }`}>
                    {po.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  {po.status === "Draft" ? (
                    <button className="px-3 py-1.5 bg-primary-yellow text-neutral-900 text-xs font-bold rounded-lg hover:bg-primary-yellow-dark transition-colors shadow-sm">
                      Review & Send
                    </button>
                  ) : po.status === "Sent" || po.status === "Confirmed" ? (
                    <button className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-600 text-xs font-bold rounded-lg hover:bg-neutral-50 transition-colors">
                      Track Order
                    </button>
                  ) : (
                    <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-600 transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
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
