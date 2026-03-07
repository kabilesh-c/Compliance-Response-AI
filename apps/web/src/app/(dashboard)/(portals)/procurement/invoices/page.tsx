"use client";

import { Search, Filter, Receipt, CheckCircle2, AlertCircle } from "lucide-react";

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Invoices & GRN</h1>
          <p className="text-neutral-500">Reconcile invoices with purchase orders and deliveries</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-100">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase">Invoice #</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase">Vendor</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase">PO Ref</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase">Amount</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase">Match Status</th>
              <th className="text-right py-4 px-6 text-xs font-bold text-neutral-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {[
              { id: "INV-9928", vendor: "Generic Meds Inc", po: "PO-2024-004", amount: "$1,500", match: "Matched" },
              { id: "INV-3321", vendor: "BioTech Solutions", po: "PO-2024-003", amount: "$8,900", match: "Pending GRN" },
              { id: "INV-1102", vendor: "MediSupply Ltd", po: "PO-2024-002", amount: "$3,200", match: "Mismatch" },
            ].map((inv, i) => (
              <tr key={i} className="hover:bg-neutral-50/50">
                <td className="py-4 px-6 font-mono text-sm text-neutral-600">{inv.id}</td>
                <td className="py-4 px-6 font-medium text-neutral-900">{inv.vendor}</td>
                <td className="py-4 px-6 text-primary-blue text-sm hover:underline cursor-pointer">{inv.po}</td>
                <td className="py-4 px-6 font-bold text-neutral-900">{inv.amount}</td>
                <td className="py-4 px-6">
                  <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold w-fit ${
                    inv.match === "Matched" ? "bg-green-100 text-green-700" :
                    inv.match === "Mismatch" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {inv.match === "Matched" && <CheckCircle2 size={14} />}
                    {inv.match === "Mismatch" && <AlertCircle size={14} />}
                    {inv.match}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  {inv.match === "Matched" ? (
                    <button className="px-3 py-1.5 bg-primary-blue text-white text-xs font-bold rounded-lg hover:bg-primary-blue-dark transition-colors shadow-sm">
                      Approve Payment
                    </button>
                  ) : inv.match === "Mismatch" ? (
                    <button className="px-3 py-1.5 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition-colors">
                      Resolve Issue
                    </button>
                  ) : (
                    <button className="text-sm font-medium text-neutral-600 hover:text-primary-blue transition-colors">
                      View Status
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
