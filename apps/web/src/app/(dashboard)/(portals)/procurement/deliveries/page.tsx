"use client";

import { Search, Filter, Truck, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export default function DeliveriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Deliveries</h1>
          <p className="text-neutral-500">Track incoming shipments and manage receipts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { id: "DEL-001", vendor: "BioTech Solutions", eta: "Today, 2:00 PM", status: "On Time", items: "Insulin, Vaccines", po: "PO-2024-003" },
          { id: "DEL-002", vendor: "MediSupply Ltd", eta: "Tomorrow, 10:00 AM", status: "Delayed", items: "Amoxicillin", po: "PO-2024-002", delay: "2 Days" },
          { id: "DEL-003", vendor: "PharmaCorp Global", eta: "Dec 22, 2025", status: "Scheduled", items: "Paracetamol", po: "PO-2024-001" },
        ].map((del, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Truck size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900">{del.vendor}</h3>
                  <p className="text-xs text-neutral-500">PO: {del.po}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                del.status === "Delayed" ? "bg-red-100 text-red-700" :
                del.status === "On Time" ? "bg-green-100 text-green-700" :
                "bg-blue-100 text-blue-700"
              }`}>
                {del.status}
              </span>
            </div>

            {del.status === "Delayed" && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
                <AlertTriangle size={16} className="text-red-600 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-red-800">Shipment Delayed</p>
                  <p className="text-xs text-red-700">Expected delay of {del.delay}. Vendor notified.</p>
                </div>
              </div>
            )}

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-neutral-500">ETA</span>
                <span className="font-medium text-neutral-900">{del.eta}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Contents</span>
                <span className="font-medium text-neutral-900">{del.items}</span>
              </div>
            </div>

            {del.status === "On Time" && del.eta.includes("Today") ? (
              <button className="w-full py-2 bg-primary-blue text-white rounded-lg font-medium hover:bg-primary-blue-dark transition-colors shadow-lg shadow-blue-200/50">
                Confirm Receipt
              </button>
            ) : (
              <button className="w-full py-2 border border-neutral-200 rounded-lg text-neutral-600 font-medium hover:bg-neutral-50 transition-colors">
                Track Shipment
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
