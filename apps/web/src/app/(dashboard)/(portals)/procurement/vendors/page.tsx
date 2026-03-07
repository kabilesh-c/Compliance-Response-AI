"use client";

import { Search, Filter, Star, TrendingUp, AlertTriangle, MoreHorizontal } from "lucide-react";

export default function VendorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Vendor Management</h1>
          <p className="text-neutral-500">Monitor vendor performance and relationships</p>
        </div>
        <button className="px-4 py-2 bg-primary-blue text-white rounded-lg font-bold hover:bg-primary-blue-dark transition-colors">
          Add New Vendor
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input 
            type="text" 
            placeholder="Search vendors..." 
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 focus:border-primary-blue outline-none"
          />
        </div>
        <button className="px-4 py-2 bg-white border border-neutral-200 rounded-xl text-neutral-600 font-medium flex items-center gap-2">
          <Filter size={18} /> Filter
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-100">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase">Vendor Name</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase">Category</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase">Performance</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase">On-Time Rate</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase">Status</th>
              <th className="text-right py-4 px-6 text-xs font-bold text-neutral-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {[
              { name: "PharmaCorp Global", category: "Pharmaceuticals", rating: 4.8, onTime: "98%", status: "Active" },
              { name: "MediSupply Ltd", category: "Consumables", rating: 3.2, onTime: "75%", status: "Warning" },
              { name: "BioTech Solutions", category: "Cold Chain", rating: 4.5, onTime: "92%", status: "Active" },
              { name: "Generic Meds Inc", category: "Generics", rating: 4.0, onTime: "88%", status: "Active" },
            ].map((vendor, i) => (
              <tr key={i} className="hover:bg-neutral-50/50">
                <td className="py-4 px-6 font-medium text-neutral-900">{vendor.name}</td>
                <td className="py-4 px-6 text-neutral-600 text-sm">{vendor.category}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                    <Star size={14} fill="currentColor" />
                    {vendor.rating}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          parseInt(vendor.onTime) > 90 ? "bg-green-500" : 
                          parseInt(vendor.onTime) > 80 ? "bg-yellow-500" : "bg-red-500"
                        }`} 
                        style={{ width: vendor.onTime }}
                      />
                    </div>
                    <span className="text-xs font-medium text-neutral-600">{vendor.onTime}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    vendor.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {vendor.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-600 transition-colors">
                    <MoreHorizontal size={18} />
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
