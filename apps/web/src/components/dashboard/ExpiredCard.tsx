"use client";

import { ShieldAlert, AlertCircle } from "lucide-react";

export default function ExpiredCard() {
  const expired = [
    { medicine: "Aspirin 75mg", expiry: "2024-10-15", preventable: true, reason: "Low sales velocity detected" },
    { medicine: "Metformin 500mg", expiry: "2024-09-20", preventable: true, reason: "Over-ordered by 30%" },
    { medicine: "Losartan 50mg", expiry: "2024-11-01", preventable: false },
  ];

  const preventableCount = expired.filter(e => e.preventable).length;

  return (
    <div className="bg-gradient-to-br from-status-danger to-status-danger-light rounded-card shadow-card p-6 text-white h-full min-h-[350px] max-h-[450px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Expired</h3>
          {preventableCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] mt-1 opacity-80">
              <ShieldAlert size={10} />
              {preventableCount} were preventable
            </span>
          )}
        </div>
        <span className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center text-sm font-bold">
          {expired.length}
        </span>
      </div>
      
      <div className="space-y-3 flex-1 overflow-auto">
        {expired.map((item, i) => (
          <div key={i} className="flex items-center justify-between bg-white/10 rounded-button px-4 py-3 relative">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{item.medicine}</span>
              {item.preventable && (
                <span className="group relative">
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold bg-white/20 rounded cursor-help">
                    <AlertCircle size={8} />
                    PREVENTABLE
                  </span>
                  <span className="absolute left-0 top-full mt-1 px-2 py-1.5 text-xs bg-neutral-800 text-white rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg">
                    {item.reason}
                  </span>
                </span>
              )}
            </div>
            <span className="text-xs opacity-90">{item.expiry}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
