"use client";

import { 
  Activity, AlertTriangle, Users, Building2, FileText, 
  TrendingUp, ShieldCheck, Clock, ArrowUpRight, MoreVertical,
  Calendar, Search, Filter, CheckCircle, XCircle, Brain
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { orders } from "@/lib/mockData";

export default function HospitalAdminDashboard() {
  const pendingRequests = useMemo(() => orders.filter(o => o.status === "pending").length, []);

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Hospital Administration</h1>
          <p className="text-neutral-500 text-sm">System Overview & Governance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-neutral-200 rounded-xl flex items-center gap-2 text-sm font-medium text-neutral-600 shadow-sm">
            <Calendar size={16} />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="px-4 py-2 bg-green-100 text-green-700 rounded-xl flex items-center gap-2 text-sm font-medium shadow-sm">
            <Activity size={16} />
            <span>System Operational</span>
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users size={24} />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">+5 New</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900 mb-1">142</div>
          <p className="text-neutral-500 text-sm">Active Staff Members</p>
        </div>

        {/* Departments */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Building2 size={24} />
            </div>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">8 Active</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900 mb-1">12</div>
          <p className="text-neutral-500 text-sm">Total Departments</p>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <FileText size={24} />
            </div>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Action Req</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900 mb-1">{pendingRequests + 22}</div>
          <p className="text-neutral-500 text-sm">Pending Requests</p>
        </div>

        {/* System Health */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <ShieldCheck size={24} />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">99.9%</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900 mb-1">Good</div>
          <p className="text-neutral-500 text-sm">System Status</p>
        </div>
      </div>

      {/* AI SYSTEM INSIGHTS */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 text-yellow-700 rounded-lg">
              <Brain size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">AI System Insights</h2>
              <p className="text-sm text-neutral-600">Predictive analysis & risk assessment</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full uppercase tracking-wide">
            Beta Feature
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Risk Score */}
          <div className="bg-white/60 p-4 rounded-xl border border-yellow-100">
            <div className="text-sm text-neutral-500 mb-1">Hospital Risk Score</div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-neutral-900">Low</span>
              <span className="text-sm text-green-600 font-medium mb-1">-12% vs last week</span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[25%]"></div>
            </div>
          </div>

          {/* High Risk Departments */}
          <div className="bg-white/60 p-4 rounded-xl border border-yellow-100 group relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-neutral-500">High-Risk Departments</span>
              <AlertTriangle size={14} className="text-orange-500" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-neutral-900">ICU</span>
                <span className="text-red-600 text-xs font-bold">Critical Stock</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-neutral-900">Emergency</span>
                <span className="text-orange-600 text-xs font-bold">High Demand</span>
              </div>
            </div>
             {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-neutral-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              Based on last 90-day consumption patterns
            </div>
          </div>

          {/* Wastage Prediction */}
          <div className="bg-white/60 p-4 rounded-xl border border-yellow-100">
             <div className="text-sm text-neutral-500 mb-1">Predicted Wastage (30 Days)</div>
             <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-neutral-900">$1,240</span>
              <span className="text-sm text-red-600 font-medium mb-1">High Risk</span>
            </div>
            <p className="text-xs text-neutral-500 mt-2">
              Driven by slow-moving antibiotics in Pediatrics
            </p>
          </div>
        </div>
      </div>

      {/* EXECUTION STATUS CARD (PHASE-3) */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 text-green-700 rounded-lg">
              <Activity size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Execution Status</h2>
              <p className="text-sm text-neutral-600">Real-time tracking of approved actions</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full flex items-center gap-1">
              <CheckCircle size={12} /> 128 Executed
            </span>
            <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full flex items-center gap-1">
              <XCircle size={12} /> 3 Failed
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl border border-green-100 bg-green-50/50">
            <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
              <CheckCircle size={16} /> Procurement
            </h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex justify-between">
                <span>PO-2024-001</span>
                <span className="font-bold">Sent</span>
              </li>
              <li className="flex justify-between">
                <span>PO-2024-003</span>
                <span className="font-bold">Confirmed</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-red-100 bg-red-50/50">
            <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
              <AlertTriangle size={16} /> Delays & Failures
            </h3>
            <ul className="space-y-2 text-sm text-red-800">
              <li className="flex justify-between">
                <span>MediSupply Ltd</span>
                <span className="font-bold">2 Days Late</span>
              </li>
              <li className="flex justify-between">
                <span>Auto-Order #442</span>
                <span className="font-bold">Failed</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-neutral-100 bg-neutral-50">
            <h3 className="font-bold text-neutral-900 mb-2 flex items-center gap-2">
              <Clock size={16} /> Pending Execution
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li className="flex justify-between">
                <span>Bulk Order #99</span>
                <span className="font-bold">Awaiting Mgr</span>
              </li>
              <li className="flex justify-between">
                <span>Stock Transfer</span>
                <span className="font-bold">Processing</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN - DEPARTMENT STATUS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900">Department Status Overview</h2>
              <Link href="/admin/departments" className="text-sm text-primary-blue font-medium hover:underline">Manage All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Head</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Staff</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Requests</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {[
                    { name: "ICU", head: "Dr. Smith", staff: 12, status: "Critical", requests: 5 },
                    { name: "OPD", head: "Dr. Sarah", staff: 24, status: "Normal", requests: 12 },
                    { name: "Emergency", head: "Dr. James", staff: 18, status: "Busy", requests: 8 },
                    { name: "Pediatrics", head: "Dr. Emily", staff: 10, status: "Normal", requests: 3 },
                  ].map((dept, i) => (
                    <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-neutral-900">{dept.name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600">{dept.head}</td>
                      <td className="px-6 py-4 text-sm text-neutral-600">{dept.staff} Active</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          dept.status === "Critical" ? "bg-red-100 text-red-700" :
                          dept.status === "Busy" ? "bg-orange-100 text-orange-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {dept.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600">{dept.requests} Pending</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RECENT AUDIT LOGS */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-neutral-900">Recent System Activity</h2>
              <Link href="/admin/audit" className="text-sm text-primary-blue font-medium hover:underline">View Logs</Link>
            </div>
            <div className="space-y-4">
              {[
                { user: "Dr. Sarah (OPD)", action: "Created new medicine request", time: "10 mins ago", type: "info" },
                { user: "System Admin", action: "Updated user permissions for Nurse John", time: "1 hour ago", type: "warning" },
                { user: "Pharmacy Manager", action: "Approved bulk order #BLK-001", time: "2 hours ago", type: "success" },
                { user: "System", action: "Automated backup completed", time: "4 hours ago", type: "info" },
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors">
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                    log.type === "warning" ? "bg-orange-500" :
                    log.type === "success" ? "bg-green-500" :
                    "bg-blue-500"
                  }`}></div>
                  <div>
                    <p className="text-sm text-neutral-900"><span className="font-medium">{log.user}</span> {log.action}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - ALERTS & QUICK ACTIONS */}
        <div className="space-y-6">
          
          {/* CRITICAL ALERTS */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4 text-red-700">
              <AlertTriangle />
              <h3 className="font-bold text-lg">Critical Alerts</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-xl border border-red-100 shadow-sm">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-neutral-900">ICU Emergency</span>
                  <span className="text-red-600 text-xs font-bold">URGENT</span>
                </div>
                <p className="text-neutral-500 text-xs">Epinephrine Stockout Risk</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-red-100 shadow-sm">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-neutral-900">Ward A</span>
                  <span className="text-red-600 text-xs font-bold">HIGH</span>
                </div>
                <p className="text-neutral-500 text-xs">Antibiotics Request Delayed</p>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/admin/users" className="w-full py-3 px-4 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl text-sm font-medium flex items-center justify-between transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Users size={18} />
                  </div>
                  <span>Manage Users</span>
                </div>
                <ArrowUpRight size={16} className="text-neutral-400" />
              </Link>
              <Link href="/admin/departments" className="w-full py-3 px-4 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl text-sm font-medium flex items-center justify-between transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <Building2 size={18} />
                  </div>
                  <span>Add Department</span>
                </div>
                <ArrowUpRight size={16} className="text-neutral-400" />
              </Link>
              <Link href="/admin/audit" className="w-full py-3 px-4 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl text-sm font-medium flex items-center justify-between transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg group-hover:bg-orange-200 transition-colors">
                    <ShieldCheck size={18} />
                  </div>
                  <span>Security Audit</span>
                </div>
                <ArrowUpRight size={16} className="text-neutral-400" />
              </Link>
            </div>
          </div>

          {/* SYSTEM RESOURCES */}
          <div className="bg-[#1A1F37] rounded-2xl shadow-sm p-6 text-white">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="text-blue-400" />
              <h3 className="font-semibold text-lg">System Resources</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Server Load</span>
                  <span className="text-white font-medium">32%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[32%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Database Storage</span>
                  <span className="text-white font-medium">64%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full w-[64%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Memory Usage</span>
                  <span className="text-white font-medium">45%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[45%]"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

