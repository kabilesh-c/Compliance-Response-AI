"use client";

import { useMemo } from "react";
import { AlertTriangle, Clock, XCircle, ArrowRight, Calendar } from "lucide-react";
import { medicines, getExpiredMedicines, getExpiringSoonMedicines } from "@/lib/mockData";

export default function ExpiryManagement() {
  const expiredMeds = useMemo(() => getExpiredMedicines(), []);
  const expiringSoonMeds = useMemo(() => getExpiringSoonMedicines(90), []);

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryBadge = (days: number) => {
    if (days <= 0) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-status-danger/10 text-status-danger">Expired</span>;
    } else if (days <= 30) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-status-danger/10 text-status-danger">{days} days left</span>;
    } else if (days <= 60) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-status-warning/10 text-status-warning">{days} days left</span>;
    } else {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-status-info/10 text-status-info">{days} days left</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-status-danger/5 border border-status-danger/20 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-status-danger/10 flex items-center justify-center">
              <XCircle size={20} className="text-status-danger" />
            </div>
            <div>
              <p className="text-2xl font-bold text-status-danger">{expiredMeds.length}</p>
              <p className="text-sm text-neutral-600">Expired Items</p>
            </div>
          </div>
          <p className="text-xs text-neutral-500">Requires immediate attention</p>
        </div>

        <div className="bg-status-warning/5 border border-status-warning/20 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-status-warning/10 flex items-center justify-center">
              <AlertTriangle size={20} className="text-status-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-status-warning">
                {expiringSoonMeds.filter(m => getDaysUntilExpiry(m.expiryDate) <= 30).length}
              </p>
              <p className="text-sm text-neutral-600">Expiring in 30 days</p>
            </div>
          </div>
          <p className="text-xs text-neutral-500">Consider discount sale</p>
        </div>

        <div className="bg-status-info/5 border border-status-info/20 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-status-info/10 flex items-center justify-center">
              <Clock size={20} className="text-status-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-status-info">
                {expiringSoonMeds.filter(m => getDaysUntilExpiry(m.expiryDate) > 30 && getDaysUntilExpiry(m.expiryDate) <= 90).length}
              </p>
              <p className="text-sm text-neutral-600">Expiring in 90 days</p>
            </div>
          </div>
          <p className="text-xs text-neutral-500">Plan inventory rotation</p>
        </div>
      </div>

      {/* Expired Items Section */}
      {expiredMeds.length > 0 && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-200 bg-status-danger/5">
            <div className="flex items-center gap-2">
              <XCircle size={18} className="text-status-danger" />
              <h3 className="font-semibold text-neutral-900">Expired Medicines</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-status-danger text-white">
                {expiredMeds.length}
              </span>
            </div>
          </div>
          <div className="divide-y divide-neutral-100">
            {expiredMeds.map((medicine) => (
              <div key={medicine.id} className="px-5 py-4 flex items-center justify-between hover:bg-neutral-50">
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">{medicine.name}</p>
                  <p className="text-sm text-neutral-500">{medicine.genericName} • Batch: {medicine.batchNumber}</p>
                </div>
                <div className="text-right mr-4">
                  <p className="text-sm font-medium text-neutral-900">{medicine.quantity} {medicine.unit}</p>
                  <p className="text-xs text-neutral-500">Loss: ₹{(medicine.costPrice * medicine.quantity).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getExpiryBadge(getDaysUntilExpiry(medicine.expiryDate))}
                  <button className="px-3 py-1.5 text-xs font-medium text-status-danger hover:bg-status-danger/10 rounded-lg transition-colors">
                    Mark Disposed
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expiring Soon Section */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-status-warning" />
            <h3 className="font-semibold text-neutral-900">Expiring Soon</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-status-warning text-neutral-900">
              {expiringSoonMeds.length}
            </span>
          </div>
        </div>
        
        {expiringSoonMeds.length === 0 ? (
          <div className="py-12 text-center text-neutral-500">
            <Clock size={40} className="mx-auto mb-3 opacity-50" />
            <p className="font-medium">No items expiring soon</p>
            <p className="text-sm">All inventory is fresh</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {expiringSoonMeds.sort((a, b) => 
              new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
            ).map((medicine) => {
              const daysLeft = getDaysUntilExpiry(medicine.expiryDate);
              return (
                <div key={medicine.id} className="px-5 py-4 flex items-center justify-between hover:bg-neutral-50">
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">{medicine.name}</p>
                    <p className="text-sm text-neutral-500">{medicine.genericName} • Batch: {medicine.batchNumber}</p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="text-sm font-medium text-neutral-900">{medicine.quantity} {medicine.unit}</p>
                    <p className="text-xs text-neutral-500">Value: ₹{(medicine.sellingPrice * medicine.quantity).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getExpiryBadge(daysLeft)}
                    {daysLeft <= 30 && (
                      <button className="px-3 py-1.5 text-xs font-medium bg-primary-yellow text-neutral-900 rounded-lg hover:bg-primary-yellow-dark transition-colors flex items-center gap-1">
                        Apply Discount <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
