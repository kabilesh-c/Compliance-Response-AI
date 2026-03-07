"use client";

import { useState } from "react";
import { Search, Filter, AlertTriangle, Package, ArrowUpRight, MoreVertical } from "lucide-react";

export default function DepartmentInventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const inventory = [
    { id: "INV-001", name: "Paracetamol 500mg", category: "Analgesics", stock: 450, minLevel: 200, unit: "Tablets", status: "Good", lastRestock: "2 days ago" },
    { id: "INV-002", name: "Amoxicillin 500mg", category: "Antibiotics", stock: 120, minLevel: 100, unit: "Capsules", status: "Low", lastRestock: "1 week ago" },
    { id: "INV-003", name: "Ceftriaxone Inj 1g", category: "Antibiotics", stock: 12, minLevel: 50, unit: "Vials", status: "Critical", lastRestock: "3 days ago" },
    { id: "INV-004", name: "Normal Saline 500ml", category: "IV Fluids", stock: 85, minLevel: 100, unit: "Bottles", status: "Low", lastRestock: "Yesterday" },
    { id: "INV-005", name: "Metformin 500mg", category: "Antidiabetic", stock: 300, minLevel: 150, unit: "Tablets", status: "Good", lastRestock: "5 days ago" },
    { id: "INV-006", name: "Surgical Gloves (M)", category: "Consumables", stock: 500, minLevel: 200, unit: "Pairs", status: "Good", lastRestock: "1 week ago" },
    { id: "INV-007", name: "Insulin Regular", category: "Antidiabetic", stock: 45, minLevel: 30, unit: "Vials", status: "Good", lastRestock: "2 weeks ago" },
    { id: "INV-008", name: "Omeprazole 20mg", category: "Gastrointestinal", stock: 180, minLevel: 100, unit: "Capsules", status: "Good", lastRestock: "3 days ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Department Inventory</h1>
          <p className="text-neutral-500 text-sm">Manage stock levels for OPD Department</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-neutral-200 rounded-xl text-neutral-600 font-medium hover:bg-neutral-50 shadow-sm flex items-center gap-2">
            <ArrowUpRight size={18} />
            <span>Stock Return</span>
          </button>
          <button className="px-4 py-2 bg-primary-blue text-white rounded-xl font-medium shadow-lg shadow-primary-blue/20 hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Package size={18} />
            <span>Request Stock</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm">
          <div className="text-neutral-500 text-sm font-medium mb-1">Total Items</div>
          <div className="text-3xl font-bold text-neutral-900">1,240</div>
          <div className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
            <ArrowUpRight size={12} /> +12 new items added
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm">
          <div className="text-neutral-500 text-sm font-medium mb-1">Low Stock Alerts</div>
          <div className="text-3xl font-bold text-orange-600">5</div>
          <div className="text-xs text-orange-600 mt-2 font-medium">Needs attention</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm">
          <div className="text-neutral-500 text-sm font-medium mb-1">Critical Items</div>
          <div className="text-3xl font-bold text-red-600">2</div>
          <div className="text-xs text-red-600 mt-2 font-medium">Immediate action required</div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="p-4 border-b border-neutral-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input 
              type="text" 
              placeholder="Search medicine name, category..." 
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="px-4 py-2 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-50 flex items-center gap-2">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Item Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Stock Level</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Last Restock</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-neutral-900">{item.name}</div>
                    <div className="text-xs text-neutral-500">{item.unit}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600">{item.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-neutral-900">{item.stock}</span>
                      <span className="text-xs text-neutral-400">/ {item.minLevel} min</span>
                    </div>
                    <div className="w-24 h-1.5 bg-neutral-100 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          item.status === "Critical" ? "bg-red-500" :
                          item.status === "Low" ? "bg-orange-500" :
                          "bg-green-500"
                        }`}
                        style={{ width: `${Math.min((item.stock / (item.minLevel * 2)) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.status === "Critical" ? "bg-red-100 text-red-700" :
                      item.status === "Low" ? "bg-orange-100 text-orange-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-500">{item.lastRestock}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-600 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
