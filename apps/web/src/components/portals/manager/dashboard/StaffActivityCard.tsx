"use client";

import { Users, ShoppingCart, Activity, Clock, CheckCircle } from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  status: "active" | "busy" | "break" | "offline";
  ordersHandled: number;
  lastActivity: string;
}

export default function StaffActivityCard() {
  const staff: StaffMember[] = [
    { id: "1", name: "John Doe", role: "Pharmacist", status: "active", ordersHandled: 12, lastActivity: "Just now" },
    { id: "2", name: "Sarah Smith", role: "Pharmacist", status: "busy", ordersHandled: 8, lastActivity: "2 min ago" },
    { id: "3", name: "Mike Brown", role: "Pharmacist", status: "break", ordersHandled: 15, lastActivity: "15 min ago" },
    { id: "4", name: "Emily Davis", role: "Pharmacist", status: "active", ordersHandled: 10, lastActivity: "1 min ago" },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "active": return { bg: "bg-status-success", text: "text-status-success", label: "Active" };
      case "busy": return { bg: "bg-status-warning", text: "text-status-warning", label: "Busy" };
      case "break": return { bg: "bg-neutral-400", text: "text-neutral-500", label: "On Break" };
      case "offline": return { bg: "bg-neutral-300", text: "text-neutral-400", label: "Offline" };
      default: return { bg: "bg-neutral-400", text: "text-neutral-500", label: "Unknown" };
    }
  };

  const activeCount = staff.filter(s => s.status === "active" || s.status === "busy").length;
  const totalOrders = staff.reduce((sum, s) => sum + s.ordersHandled, 0);

  return (
    <div className="bg-white rounded-card shadow-card p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900">Staff Activity</h3>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-status-success/10 text-status-success rounded-full text-xs font-bold">
            <Users size={12} />
            {activeCount} Active
          </span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-neutral-50 rounded-button text-center">
          <div className="text-2xl font-bold text-neutral-900">{totalOrders}</div>
          <div className="text-xs text-neutral-500">Orders Today</div>
        </div>
        <div className="p-3 bg-neutral-50 rounded-button text-center">
          <div className="text-2xl font-bold text-neutral-900">{staff.length}</div>
          <div className="text-xs text-neutral-500">Total Staff</div>
        </div>
      </div>

      {/* Staff List */}
      <div className="space-y-2">
        {staff.map((member) => {
          const statusStyle = getStatusStyle(member.status);
          return (
            <div 
              key={member.id}
              className="flex items-center gap-3 p-3 bg-neutral-50 rounded-button hover:bg-neutral-100 transition-colors"
            >
              {/* Avatar with Status */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary-yellow flex items-center justify-center text-neutral-900 font-semibold text-sm">
                  {member.name.charAt(0)}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${statusStyle.bg}`} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-neutral-900 text-sm truncate">{member.name}</h4>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${statusStyle.bg}/10 ${statusStyle.text}`}>
                    {statusStyle.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span>{member.role}</span>
                  <span>•</span>
                  <span>{member.lastActivity}</span>
                </div>
              </div>

              {/* Orders */}
              <div className="text-right">
                <div className="flex items-center gap-1 text-primary-yellow-dark font-semibold">
                  <ShoppingCart size={12} />
                  {member.ordersHandled}
                </div>
                <div className="text-[10px] text-neutral-400">orders</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* POS Load */}
      <div className="mt-4 pt-4 border-t border-neutral-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-neutral-600">POS Load</span>
          <span className="text-sm font-medium text-neutral-900">68%</span>
        </div>
        <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div className="h-full bg-primary-yellow rounded-full" style={{ width: "68%" }} />
        </div>
      </div>
    </div>
  );
}
