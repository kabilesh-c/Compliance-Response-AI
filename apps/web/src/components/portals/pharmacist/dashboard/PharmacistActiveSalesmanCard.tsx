"use client";

import { User } from "lucide-react";

export default function PharmacistActiveSalesmanCard() {
  const activeCount = 5;
  const displayCount = 4;

  return (
    <div className="bg-white rounded-card shadow-card p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Active Salesman</h3>
      <div className="flex items-center gap-2">
        {[...Array(displayCount)].map((_, i) => (
          <div
            key={i}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-green to-primary-green-dark flex items-center justify-center text-white -ml-2 first:ml-0 border-2 border-white"
          >
            <User size={20} />
          </div>
        ))}
        {activeCount > displayCount && (
          <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700 font-semibold text-sm -ml-2 border-2 border-white">
            +{activeCount - displayCount}
          </div>
        )}
      </div>
    </div>
  );
}
