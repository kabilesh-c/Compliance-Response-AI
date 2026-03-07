"use client";

import { useState } from "react";
import { Search, Package, AlertTriangle, Calendar, Eye, Filter, Grid, List } from "lucide-react";

interface Medicine {
  id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  minStock: number;
  rack: string;
  expiryDate: string;
  status: "available" | "low" | "critical" | "expired";
}

export default function PharmacistInventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const medicines: Medicine[] = [
    { id: "1", name: "Paracetamol 500mg", brand: "Calpol", price: 45, stock: 150, minStock: 50, rack: "A12", expiryDate: "2025-06-15", status: "available" },
    { id: "2", name: "Amoxicillin 250mg", brand: "Novamox", price: 120, stock: 8, minStock: 30, rack: "B8", expiryDate: "2025-03-20", status: "critical" },
    { id: "3", name: "Ibuprofen 400mg", brand: "Brufen", price: 65, stock: 25, minStock: 40, rack: "C5", expiryDate: "2025-08-10", status: "low" },
    { id: "4", name: "Cetirizine 10mg", brand: "Zyrtec", price: 35, stock: 200, minStock: 25, rack: "A3", expiryDate: "2025-12-25", status: "available" },
    { id: "5", name: "Omeprazole 20mg", brand: "Prilosec", price: 85, stock: 120, minStock: 40, rack: "D2", expiryDate: "2025-04-30", status: "available" },
    { id: "6", name: "Metformin 500mg", brand: "Glucophage", price: 55, stock: 0, minStock: 50, rack: "E1", expiryDate: "2025-09-15", status: "critical" },
    { id: "7", name: "Azithromycin 500mg", brand: "Zithromax", price: 150, stock: 60, minStock: 20, rack: "B3", expiryDate: "2024-12-01", status: "expired" },
    { id: "8", name: "Aspirin 75mg", brand: "Disprin", price: 25, stock: 250, minStock: 100, rack: "A1", expiryDate: "2026-01-20", status: "available" },
  ];

  const filteredMedicines = medicines.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || m.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "available": return { bg: "bg-status-success/10", text: "text-status-success", label: "Available" };
      case "low": return { bg: "bg-status-warning/10", text: "text-status-warning", label: "Low Stock" };
      case "critical": return { bg: "bg-status-danger/10", text: "text-status-danger", label: "Critical" };
      case "expired": return { bg: "bg-neutral-200", text: "text-neutral-600", label: "Expired" };
      default: return { bg: "bg-neutral-100", text: "text-neutral-600", label: "Unknown" };
    }
  };

  const stats = {
    total: medicines.length,
    available: medicines.filter(m => m.status === "available").length,
    lowStock: medicines.filter(m => m.status === "low" || m.status === "critical").length,
    expired: medicines.filter(m => m.status === "expired").length,
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Inventory</h1>
          <p className="text-neutral-600 mt-1">View-only access to medicine inventory</p>
        </div>
        <div className="px-4 py-2 bg-status-warning/10 text-status-warning rounded-full text-sm font-medium flex items-center gap-2">
          <Eye size={16} />
          Read-Only Mode
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Items", value: stats.total, color: "bg-primary-green" },
          { label: "Available", value: stats.available, color: "bg-status-success" },
          { label: "Low Stock", value: stats.lowStock, color: "bg-status-warning" },
          { label: "Expired", value: stats.expired, color: "bg-status-danger" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-card shadow-card p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center`}>
              <Package size={20} className="text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
              <div className="text-sm text-neutral-600">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-card shadow-card p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              type="text"
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green"
            />
          </div>
          <div className="flex items-center gap-2">
            {[
              { value: "all", label: "All" },
              { value: "available", label: "Available" },
              { value: "low", label: "Low Stock" },
              { value: "critical", label: "Critical" },
              { value: "expired", label: "Expired" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`px-3 py-1.5 text-sm rounded-button transition-colors ${
                  filterStatus === filter.value
                    ? "bg-primary-green text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 border-l border-neutral-200 pl-4">
            <button
              onClick={() => setViewMode("list")}
              className={`w-9 h-9 rounded-button flex items-center justify-center transition-colors ${
                viewMode === "list" ? "bg-primary-green text-white" : "text-neutral-500 hover:bg-neutral-100"
              }`}
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`w-9 h-9 rounded-button flex items-center justify-center transition-colors ${
                viewMode === "grid" ? "bg-primary-green text-white" : "text-neutral-500 hover:bg-neutral-100"
              }`}
            >
              <Grid size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Medicine List */}
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        {viewMode === "list" ? (
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Medicine</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Price</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Stock</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Rack</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Expiry</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredMedicines.map((medicine) => {
                const statusStyle = getStatusStyle(medicine.status);
                const expiryDate = new Date(medicine.expiryDate);
                const isExpiringSoon = expiryDate <= new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
                
                return (
                  <tr key={medicine.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-neutral-900">{medicine.name}</div>
                        <div className="text-sm text-neutral-500">{medicine.brand}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-neutral-900">₹{medicine.price}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${
                          medicine.stock <= 0 ? "text-status-danger" :
                          medicine.stock < medicine.minStock ? "text-status-warning" : "text-neutral-900"
                        }`}>
                          {medicine.stock}
                        </span>
                        <span className="text-xs text-neutral-400">/ {medicine.minStock} min</span>
                      </div>
                      <div className="h-1.5 w-24 bg-neutral-200 rounded-full mt-1 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            medicine.stock <= 0 ? "bg-status-danger" :
                            medicine.stock < medicine.minStock ? "bg-status-warning" : "bg-status-success"
                          }`}
                          style={{ width: `${Math.min(100, (medicine.stock / medicine.minStock) * 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{medicine.rack}</td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-1.5 text-sm ${
                        isExpiringSoon ? "text-status-danger" : "text-neutral-600"
                      }`}>
                        <Calendar size={14} />
                        {expiryDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                        {statusStyle.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-6 grid grid-cols-4 gap-4">
            {filteredMedicines.map((medicine) => {
              const statusStyle = getStatusStyle(medicine.status);
              return (
                <div key={medicine.id} className="p-4 bg-neutral-50 rounded-button border border-neutral-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary-green/20 flex items-center justify-center">
                      <Package size={18} className="text-primary-green" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                      {statusStyle.label}
                    </span>
                  </div>
                  <h4 className="font-medium text-neutral-900 text-sm truncate">{medicine.name}</h4>
                  <p className="text-xs text-neutral-500 mb-3">{medicine.brand}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-primary-green">₹{medicine.price}</span>
                    <span className="text-neutral-500">{medicine.stock} units</span>
                  </div>
                  <div className="mt-2 text-xs text-neutral-400">Rack: {medicine.rack}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
