"use client";

import { FileText, Truck, AlertCircle, CheckCircle2, Clock, DollarSign } from "lucide-react";

export default function ProcurementDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Procurement Overview</h1>
        <p className="text-neutral-500">Manage purchase orders, deliveries, and vendor relationships</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <FileText size={24} />
            </div>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg">
              12 Pending
            </span>
          </div>
          <div className="text-3xl font-bold text-neutral-900 mb-1">28</div>
          <div className="text-sm text-neutral-500">Active Purchase Orders</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Truck size={24} />
            </div>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-lg">
              Today
            </span>
          </div>
          <div className="text-3xl font-bold text-neutral-900 mb-1">5</div>
          <div className="text-sm text-neutral-500">Incoming Deliveries</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <AlertCircle size={24} />
            </div>
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-lg">
              Action Req
            </span>
          </div>
          <div className="text-3xl font-bold text-neutral-900 mb-1">3</div>
          <div className="text-sm text-neutral-500">Delayed Shipments</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <DollarSign size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-neutral-900 mb-1">$45.2k</div>
          <div className="text-sm text-neutral-500">Monthly Spend</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent POs */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
            <h3 className="font-bold text-neutral-900">Recent Purchase Orders</h3>
            <button className="text-sm text-primary-blue font-medium hover:underline">View All</button>
          </div>
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left py-3 px-6 text-xs font-semibold text-neutral-500 uppercase">PO ID</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-neutral-500 uppercase">Vendor</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-neutral-500 uppercase">Date</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-neutral-500 uppercase">Amount</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-neutral-500 uppercase">Status</th>
                <th className="text-right py-3 px-6 text-xs font-semibold text-neutral-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {[
                { id: "PO-2024-001", vendor: "PharmaCorp Global", date: "Dec 20, 2025", amount: "$12,450", status: "Draft" },
                { id: "PO-2024-002", vendor: "MediSupply Ltd", date: "Dec 19, 2025", amount: "$3,200", status: "Sent" },
                { id: "PO-2024-003", vendor: "BioTech Solutions", date: "Dec 18, 2025", amount: "$8,900", status: "Confirmed" },
                { id: "PO-2024-004", vendor: "Generic Meds Inc", date: "Dec 18, 2025", amount: "$1,500", status: "Delivered" },
              ].map((po, i) => (
                <tr key={i} className="hover:bg-neutral-50/50">
                  <td className="py-4 px-6 font-mono text-sm text-neutral-600">{po.id}</td>
                  <td className="py-4 px-6 font-medium text-neutral-900">{po.vendor}</td>
                  <td className="py-4 px-6 text-neutral-600 text-sm">{po.date}</td>
                  <td className="py-4 px-6 text-neutral-900 font-medium">{po.amount}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      po.status === "Draft" ? "bg-neutral-100 text-neutral-600" :
                      po.status === "Sent" ? "bg-blue-100 text-blue-700" :
                      po.status === "Confirmed" ? "bg-purple-100 text-purple-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {po.status === "Draft" && (
                      <button className="text-xs font-bold text-primary-blue hover:underline">Review</button>
                    )}
                    {(po.status === "Sent" || po.status === "Confirmed") && (
                      <button className="text-xs font-bold text-neutral-500 hover:text-neutral-900">Track</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Urgent Tasks */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
          <h3 className="font-bold text-neutral-900 mb-4">Urgent Tasks</h3>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-600 mt-0.5" size={18} />
                <div>
                  <h4 className="font-bold text-red-900 text-sm">Delay Alert: PO-2024-005</h4>
                  <p className="text-red-700 text-xs mt-1">MediSupply Ltd reported a 2-day delay for Amoxicillin batch.</p>
                  <button className="mt-2 text-xs font-bold text-red-800 hover:underline">Contact Vendor</button>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
              <div className="flex items-start gap-3">
                <Clock className="text-yellow-600 mt-0.5" size={18} />
                <div>
                  <h4 className="font-bold text-yellow-900 text-sm">Review Draft: PO-2024-001</h4>
                  <p className="text-yellow-700 text-xs mt-1">Bulk order for Paracetamol needs approval before sending.</p>
                  <button className="mt-2 text-xs font-bold text-yellow-800 hover:underline">Review Order</button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-start gap-3">
                <Truck className="text-blue-600 mt-0.5" size={18} />
                <div>
                  <h4 className="font-bold text-blue-900 text-sm">Delivery Expected: 2:00 PM</h4>
                  <p className="text-blue-700 text-xs mt-1">BioTech Solutions delivery arriving at Dock B.</p>
                  <button className="mt-2 text-xs font-bold text-blue-800 hover:underline">View Details</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
