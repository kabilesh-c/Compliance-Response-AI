"use client";

import { User } from "lucide-react";

export default function ActiveOrdersBar() {
  const orders = [
    { id: 1, patient: "John Doe", type: "OPD", active: true },
    { id: 2, patient: "Jane Smith", type: "IPD", active: false },
    { id: 3, patient: "Bob Wilson", type: "OT", active: false },
  ];

  return (
    <div className="flex items-center gap-4 pb-4 border-b border-neutral-200">
      {orders.map((order) => (
        <div
          key={order.id}
          className={`relative flex items-center justify-center w-14 h-14 rounded-full cursor-pointer transition-all ${
            order.active
              ? "ring-4 ring-primary-yellow bg-gradient-to-br from-primary-yellow to-primary-yellow-dark"
              : "bg-gradient-to-br from-neutral-300 to-neutral-400 hover:from-neutral-400 hover:to-neutral-500"
          }`}
        >
          <User size={24} className="text-white" />
          <span
            className={`absolute -top-1 -right-1 px-2 py-0.5 rounded-pill text-xs font-bold ${
              order.type === "OPD"
                ? "bg-blue-500 text-white"
                : order.type === "IPD"
                ? "bg-green-500 text-white"
                : "bg-purple-500 text-white"
            }`}
          >
            {order.type}
          </span>
        </div>
      ))}
    </div>
  );
}
