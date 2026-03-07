"use client";

import { useState } from "react";
import { Store, MapPin, User, MoreVertical, Plus, CheckCircle, XCircle, Building2 } from "lucide-react";

interface StoreData {
  id: string;
  name: string;
  location: string;
  manager: string;
  status: "active" | "suspended";
  type: "retail" | "hospital";
}

export default function OrganizationManagement() {
  const [stores] = useState<StoreData[]>([
    { id: "1", name: "Main Branch", location: "Downtown, New York", manager: "John Smith", status: "active", type: "retail" },
    { id: "2", name: "City Center", location: "Midtown, New York", manager: "Emily Davis", status: "active", type: "retail" },
    { id: "3", name: "Hospital Wing", location: "General Hospital, NY", manager: "Unassigned", status: "suspended", type: "hospital" },
  ]);

  return (
    <div className="bg-white rounded-card shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
          <Building2 size={20} className="text-primary-blue" />
          Organization Management
        </h3>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-primary-blue text-white rounded-button text-sm font-medium hover:bg-primary-blue-dark transition-colors">
          <Plus size={16} />
          Add Store
        </button>
      </div>

      <div className="space-y-4">
        {stores.map((store) => (
          <div key={store.id} className="border border-neutral-200 rounded-xl p-4 hover:border-primary-blue/30 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  store.type === "retail" ? "bg-primary-blue/10 text-primary-blue" : "bg-purple-100 text-purple-600"
                }`}>
                  <Store size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900">{store.name}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-neutral-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {store.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      {store.manager}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                  store.status === "active" 
                    ? "bg-status-success/10 text-status-success" 
                    : "bg-status-danger/10 text-status-danger"
                }`}>
                  {store.status === "active" ? <CheckCircle size={12} /> : <XCircle size={12} />}
                  {store.status.charAt(0).toUpperCase() + store.status.slice(1)}
                </span>
                <button className="p-1 hover:bg-neutral-100 rounded text-neutral-400 hover:text-neutral-600">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
            
            {/* Store Configuration Preview */}
            <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center gap-6 text-xs text-neutral-500">
              <span><strong>ID:</strong> {store.id}</span>
              <span><strong>Type:</strong> {store.type === "retail" ? "Retail Pharmacy" : "Hospital Pharmacy"}</span>
              <span><strong>Config:</strong> Standard Retail v2.1</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
