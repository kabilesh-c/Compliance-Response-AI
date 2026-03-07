"use client";

import { useState } from "react";
import { Search, Filter, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight, Eye } from "lucide-react";

export default function RequestHistoryPage() {
  const [statusFilter, setStatusFilter] = useState("All");

  const requests = [
    { id: "REQ-2024-001", items: "Paracetamol, Amoxicillin", date: "2024-12-19", status: "Pending", priority: "High", requestedBy: "Dr. Sarah" },
    { id: "REQ-2024-002", items: "IV Fluids (NS)", date: "2024-12-18", status: "Approved", priority: "Critical", requestedBy: "Nurse John" },
    { id: "REQ-2024-003", items: "Surgical Gloves, Masks", date: "2024-12-18", status: "Delivered", priority: "Normal", requestedBy: "Dr. Sarah" },
    { id: "REQ-2024-004", items: "Insulin R", date: "2024-12-17", status: "Rejected", priority: "High", requestedBy: "Dr. Mike" },
    { id: "REQ-2024-005", items: "Ceftriaxone Inj", date: "2024-12-16", status: "Delivered", priority: "Critical", requestedBy: "Nurse Jane" },
  ];

  const filteredRequests = statusFilter === "All" 
    ? requests 
    : requests.filter(r => r.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Request History</h1>
          <p className="text-neutral-500 text-sm">Track and manage your department's medicine requests</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input 
              type="text" 
              placeholder="Search requests..." 
              className="pl-10 pr-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue/20 w-64"
            />
          </div>
          <button className="p-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 text-neutral-600">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["All", "Pending", "Approved", "Delivered", "Rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              statusFilter === status 
                ? "bg-primary-blue text-white shadow-md shadow-primary-blue/20" 
                : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Request List */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Request ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-neutral-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-medium text-neutral-900">{req.id}</span>
                    <div className="text-xs text-neutral-500">{req.requestedBy}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600 max-w-xs truncate" title={req.items}>
                    {req.items}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-500">
                    {req.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      req.priority === "Critical" ? "bg-red-100 text-red-700" :
                      req.priority === "High" ? "bg-orange-100 text-orange-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {req.status === "Pending" && <Clock size={16} className="text-orange-500" />}
                      {req.status === "Approved" && <CheckCircle size={16} className="text-blue-500" />}
                      {req.status === "Delivered" && <CheckCircle size={16} className="text-green-500" />}
                      {req.status === "Rejected" && <XCircle size={16} className="text-red-500" />}
                      <span className={`text-sm font-medium ${
                        req.status === "Pending" ? "text-orange-700" :
                        req.status === "Approved" ? "text-blue-700" :
                        req.status === "Delivered" ? "text-green-700" :
                        "text-red-700"
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-primary-blue transition-colors">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRequests.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-neutral-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-neutral-900">No requests found</h3>
            <p className="text-neutral-500 mt-1">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
