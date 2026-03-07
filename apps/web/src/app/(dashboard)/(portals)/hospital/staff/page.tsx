"use client";

import { 
  Plus, Clock, AlertTriangle, PackageCheck, Search, Filter, 
  MoreVertical, FileText, Pill, ArrowUpRight, ArrowDownRight,
  Syringe, Thermometer, Activity, Calendar, Brain
} from "lucide-react";
import Link from "next/link";

export default function DepartmentStaffDashboard() {
  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Department Dashboard</h1>
          <p className="text-neutral-500 text-sm">Welcome back, Dr. Sarah (OPD - Morning Shift)</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-neutral-200 rounded-xl flex items-center gap-2 text-sm font-medium text-neutral-600 shadow-sm">
            <Calendar size={16} />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <Link 
            href="/hospital/staff/request/new" 
            className="px-4 py-2 bg-primary-blue text-white rounded-xl font-medium shadow-lg shadow-primary-blue/20 hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            <span>New Request</span>
          </Link>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Pending Requests */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <Clock size={24} />
            </div>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Waiting</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900 mb-1">8</div>
          <p className="text-neutral-500 text-sm">Pending Approvals</p>
        </div>

        {/* Critical Stock */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <AlertTriangle size={24} />
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">Action Needed</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900 mb-1">3</div>
          <p className="text-neutral-500 text-sm">Critical Low Stock</p>
        </div>

        {/* Received Today */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <PackageCheck size={24} />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900 mb-1">24</div>
          <p className="text-neutral-500 text-sm">Items Received Today</p>
        </div>

        {/* Active Patients */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Activity size={24} />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">OPD</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900 mb-1">142</div>
          <p className="text-neutral-500 text-sm">Active Patients</p>
        </div>
      </div>

      {/* AI REQUEST SUGGESTIONS */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 text-primary-blue rounded-lg">
            <Brain size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">AI Request Suggestions</h2>
            <p className="text-sm text-neutral-600">Recommended restocks based on usage patterns</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Paracetamol 500mg", qty: 500, reason: "Low stock predicted in 2 days" },
            { name: "Amoxicillin 250mg", qty: 200, reason: "Seasonal demand spike expected" },
            { name: "Ibuprofen 400mg", qty: 300, reason: "Below safety stock level" }
          ].map((item, i) => (
            <div key={i} className="p-4 border border-neutral-100 rounded-xl hover:border-primary-blue/30 transition-colors group relative">
              <div className="flex justify-between items-start mb-2">
                <div className="font-bold text-neutral-900">{item.name}</div>
                <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-bold rounded-full">Low Risk</span>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-2xl font-bold text-primary-blue">{item.qty}</span>
                <span className="text-sm text-neutral-500 mb-1">units</span>
              </div>
              <p className="text-xs text-neutral-500">{item.reason}</p>
              
              <button className="mt-3 w-full py-2 bg-neutral-50 text-neutral-600 text-sm font-medium rounded-lg hover:bg-primary-blue hover:text-white transition-colors">
                Add to Request
              </button>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-neutral-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Based on last 30 days consumption
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INCOMING DELIVERIES */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <PackageCheck size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Incoming Deliveries</h2>
              <p className="text-sm text-neutral-600">Stock arriving from Central Inventory</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { id: "DEL-2024-001", items: "Metformin 500mg (500 units)", status: "Arriving Today", time: "2:00 PM" },
            { id: "DEL-2024-002", items: "Surgical Gloves (100 boxes)", status: "Dispatched", time: "Tomorrow" }
          ].map((delivery, i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-neutral-100 rounded-xl bg-neutral-50/50">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-500 font-bold text-xs">
                  {delivery.id.split('-')[2]}
                </div>
                <div>
                  <div className="font-bold text-neutral-900">{delivery.items}</div>
                  <div className="text-xs text-neutral-500 flex items-center gap-2">
                    <span>ID: {delivery.id}</span>
                    <span>•</span>
                    <span className={delivery.status === "Arriving Today" ? "text-green-600 font-medium" : "text-blue-600 font-medium"}>
                      {delivery.status} ({delivery.time})
                    </span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-900 text-sm font-medium rounded-lg hover:bg-neutral-50 hover:border-neutral-300 transition-colors shadow-sm">
                Receive Stock
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN - RECENT REQUESTS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900">Recent Requests</h2>
              <button className="text-sm text-primary-blue font-medium hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Request ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {[
                    { id: "REQ-001", items: "Paracetamol, Amoxicillin", priority: "High", status: "Pending", date: "Today, 10:30 AM" },
                    { id: "REQ-002", items: "IV Fluids (NS)", priority: "Critical", status: "Approved", date: "Today, 09:15 AM" },
                    { id: "REQ-003", items: "Surgical Gloves", priority: "Normal", status: "Delivered", date: "Yesterday" },
                    { id: "REQ-004", items: "Insulin R", priority: "High", status: "Processing", date: "Yesterday" },
                  ].map((req, i) => (
                    <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-neutral-900">{req.id}</td>
                      <td className="px-6 py-4 text-sm text-neutral-600">{req.items}</td>
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
                        <span className={`flex items-center gap-1.5 text-sm ${
                          req.status === "Delivered" ? "text-green-600" :
                          req.status === "Pending" ? "text-orange-600" :
                          req.status === "Approved" ? "text-blue-600" :
                          "text-neutral-600"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            req.status === "Delivered" ? "bg-green-600" :
                            req.status === "Pending" ? "bg-orange-600" :
                            req.status === "Approved" ? "bg-blue-600" :
                            "bg-neutral-600"
                          }`}></span>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-500">{req.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* DEPARTMENT INVENTORY SNAPSHOT */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-neutral-900">Ward Inventory Status</h2>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500"><Search size={18} /></button>
                <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500"><Filter size={18} /></button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Paracetamol 500mg", stock: 450, min: 200, status: "Good" },
                { name: "Ceftriaxone Inj", stock: 12, min: 50, status: "Critical" },
                { name: "Normal Saline 500ml", stock: 85, min: 100, status: "Low" },
                { name: "Metformin 500mg", stock: 300, min: 150, status: "Good" },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl border border-neutral-100 flex items-center justify-between hover:border-primary-blue/30 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      item.status === "Critical" ? "bg-red-50 text-red-600" :
                      item.status === "Low" ? "bg-orange-50 text-orange-600" :
                      "bg-green-50 text-green-600"
                    }`}>
                      <Pill size={20} />
                    </div>
                    <div>
                      <div className="font-medium text-neutral-900">{item.name}</div>
                      <div className="text-xs text-neutral-500">Min: {item.min} units</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${
                      item.status === "Critical" ? "text-red-600" :
                      item.status === "Low" ? "text-orange-600" :
                      "text-neutral-900"
                    }`}>{item.stock}</div>
                    <div className="text-xs text-neutral-400">In Stock</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - ALERTS & QUICK ACTIONS */}
        <div className="space-y-6">
          
          {/* ALERTS PANEL */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex gap-3 items-start p-3 bg-red-50 rounded-xl border border-red-100">
                <AlertTriangle size={18} className="text-red-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-900">Emergency Stock Alert</p>
                  <p className="text-xs text-red-700 mt-1">Ceftriaxone is below critical level (12 units). Immediate request recommended.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start p-3 bg-blue-50 rounded-xl border border-blue-100">
                <PackageCheck size={18} className="text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Order Delivered</p>
                  <p className="text-xs text-blue-700 mt-1">Request #REQ-003 has been delivered to the ward station.</p>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK REQUEST */}
          <div className="bg-gradient-to-br from-primary-blue to-blue-700 rounded-2xl shadow-lg shadow-blue-900/20 p-6 text-white">
            <h2 className="text-lg font-bold mb-2">Quick Request</h2>
            <p className="text-blue-100 text-sm mb-6">Fast track request for common ward essentials.</p>
            
            <div className="space-y-3">
              <button className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-medium flex items-center justify-between transition-colors">
                <span>IV Fluids Bundle</span>
                <ArrowUpRight size={16} />
              </button>
              <button className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-medium flex items-center justify-between transition-colors">
                <span>Emergency Kit Refill</span>
                <ArrowUpRight size={16} />
              </button>
              <button className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-medium flex items-center justify-between transition-colors">
                <span>General Antibiotics</span>
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>

          {/* SHIFT INFO */}
          <div className="bg-neutral-900 rounded-2xl shadow-sm p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <Clock size={20} className="text-primary-yellow" />
              </div>
              <div>
                <div className="font-medium">Shift Status</div>
                <div className="text-xs text-neutral-400">Morning Shift</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Start Time</span>
                <span>08:00 AM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">End Time</span>
                <span>04:00 PM</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-primary-yellow h-full w-[65%]"></div>
              </div>
              <div className="text-xs text-center text-neutral-500 mt-1">4h 30m remaining</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}