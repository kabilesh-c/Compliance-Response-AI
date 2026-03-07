"use client";

import { useState } from "react";

type OrderType = "ALL" | "OPD" | "IPD" | "OT";

export default function PharmacistRecentOrdersCard() {
  const [activeTab, setActiveTab] = useState<OrderType>("ALL");

  const orders = [
    { patient: "John Doe", doctor: "Dr. Smith", type: "OPD", id: 1 },
    { patient: "Jane Smith", doctor: "Dr. Johnson", type: "IPD", id: 2 },
    { patient: "Bob Wilson", doctor: "Dr. Williams", type: "OT", id: 3 },
  ];

  return (
    <div className="bg-white rounded-card shadow-card p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Orders</h3>
      
      <div className="flex gap-2 mb-4">
        {(["ALL", "OPD", "IPD", "OT"] as OrderType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-pill text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-primary-green text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="border-b border-neutral-200">
            <tr className="text-left text-sm text-neutral-600">
              <th className="pb-3 font-medium">Patient</th>
              <th className="pb-3 font-medium">Ordered by</th>
              <th className="pb-3 font-medium">Type</th>
              <th className="pb-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-neutral-100">
                <td className="py-3 text-neutral-900">{order.patient}</td>
                <td className="py-3 text-neutral-600 text-sm">{order.doctor}</td>
                <td className="py-3">
                  <span className="px-3 py-1 bg-primary-green/20 text-primary-green-dark text-xs font-medium rounded-pill">
                    {order.type}
                  </span>
                </td>
                <td className="py-3">
                  <button className="px-4 py-1.5 bg-neutral-100 hover:bg-primary-green hover:text-white text-neutral-900 text-sm font-medium rounded-button transition-colors">
                    Sale Now
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
