"use client";

import { FileText, Search, Filter, Clock, AlertCircle, CheckCircle, Download, Shield, Database, Server, User } from "lucide-react";

export default function HospitalAuditPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Audit Logs</h1>
          <p className="text-neutral-500">Track system activities, security events, and data access</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-medium hover:bg-neutral-50 flex items-center gap-2 transition-colors">
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <button className="px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-medium hover:bg-neutral-50 flex items-center gap-2 transition-colors">
            <Download size={16} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
          <input 
            type="text" 
            placeholder="Search logs by user, action, or IP..." 
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 border-none rounded-xl focus:ring-2 focus:ring-primary-blue/20 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select className="px-4 py-2 bg-neutral-50 border-none rounded-xl text-sm text-neutral-600 focus:ring-2 focus:ring-primary-blue/20 outline-none cursor-pointer">
            <option>All Events</option>
            <option>Security</option>
            <option>Data Access</option>
            <option>System</option>
            <option>Inventory</option>
          </select>
          <select className="px-4 py-2 bg-neutral-50 border-none rounded-xl text-sm text-neutral-600 focus:ring-2 focus:ring-primary-blue/20 outline-none cursor-pointer">
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Custom Range</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 text-neutral-600 hover:bg-neutral-50 rounded-xl border border-transparent hover:border-neutral-200 transition-all">
            <Filter size={20} />
            <span className="hidden md:inline">Filter</span>
          </button>
        </div>
      </div>

      {/* Logs List */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="divide-y divide-neutral-100">
          {[
            { action: "User Login", user: "Dr. Sarah Jenkins", time: "2 mins ago", status: "Success", type: "Security", details: "Logged in from 192.168.1.105", icon: Shield },
            { action: "Stock Adjustment", user: "John Doe", time: "15 mins ago", status: "Success", type: "Inventory", details: "Updated Paracetamol stock (+500)", icon: Database },
            { action: "Failed Login Attempt", user: "Unknown IP", time: "1 hour ago", status: "Failed", type: "Security", details: "3 failed attempts from 10.0.0.5", icon: Shield },
            { action: "System Backup", user: "System", time: "2 hours ago", status: "Success", type: "System", details: "Daily database backup completed", icon: Server },
            { action: "Patient Record Access", user: "Nurse Mary", time: "3 hours ago", status: "Success", type: "Data", details: "Viewed record #PT-4592", icon: User },
            { action: "Role Modified", user: "Admin", time: "5 hours ago", status: "Success", type: "Security", details: "Changed role for user 'j.smith' to Manager", icon: Shield },
            { action: "API Error", user: "System", time: "6 hours ago", status: "Failed", type: "System", details: "Connection timeout to external billing service", icon: Server },
          ].map((log, i) => (
            <div key={i} className="p-4 hover:bg-neutral-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  log.status === "Success" ? 
                    (log.type === "Security" ? "bg-blue-100 text-blue-600" : 
                     log.type === "System" ? "bg-purple-100 text-purple-600" : 
                     "bg-green-100 text-green-600") 
                    : "bg-red-100 text-red-600"
                }`}>
                  <log.icon size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-neutral-900">{log.action}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      log.status === "Success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 mt-0.5">{log.details}</p>
                  <div className="text-xs text-neutral-500 flex items-center gap-2 mt-1">
                    <span className="font-medium text-neutral-700 flex items-center gap-1">
                      <User size={10} />
                      {log.user}
                    </span>
                    <span>•</span>
                    <span className="bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600">{log.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-neutral-400 text-sm pl-14 md:pl-0">
                <Clock size={14} />
                <span>{log.time}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <p className="text-sm text-neutral-500">Showing <span className="font-medium text-neutral-900">1-7</span> of <span className="font-medium text-neutral-900">842</span> logs</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-600 hover:bg-neutral-50 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-600 hover:bg-neutral-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
