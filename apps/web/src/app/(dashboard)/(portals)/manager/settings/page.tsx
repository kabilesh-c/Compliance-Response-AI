"use client";

import { Settings, Bell, Shield, Save } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export default function ManagerSettingsPage() {
  const { mode } = useAuthStore();

  if (mode === "HOSPITAL") {
    return <HospitalSettings />;
  }

  return <RetailSettings />;
}

function HospitalSettings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Pharmacy Settings</h1>
          <p className="text-neutral-500">Configure operational rules and alerts</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue-dark transition-colors">
          <Save size={20} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4 space-y-2">
            {[
              { icon: Bell, label: "Notification Rules", active: true },
              { icon: Shield, label: "Approval Thresholds", active: false },
            ].map((item, i) => (
              <button
                key={i}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  item.active 
                    ? "bg-primary-blue/10 text-primary-blue" 
                    : "text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notification Rules */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Notification Rules</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                <div>
                  <div className="font-medium text-neutral-900">Critical Request Alerts</div>
                  <div className="text-xs text-neutral-500">Notify immediately for ICU/Emergency requests</div>
                </div>
                <div className="w-12 h-6 bg-primary-blue rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                <div>
                  <div className="font-medium text-neutral-900">Expiry Alerts</div>
                  <div className="text-xs text-neutral-500">Notify 30 days before batch expiry</div>
                </div>
                <div className="w-12 h-6 bg-primary-blue rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Approval Thresholds */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Approval Thresholds</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Auto-Flag Quantity</label>
                <input 
                  type="number" 
                  defaultValue="1000"
                  className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue"
                />
                <p className="text-xs text-neutral-500 mt-1">Requests above this quantity will be flagged for review</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RetailSettings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Retail Settings</h1>
      <div className="bg-white p-8 rounded-2xl text-center text-neutral-500">
        Retail Settings Content Placeholder
      </div>
    </div>
  );
}
