"use client";

import { Users, Search, Filter, MoreVertical, Shield, UserPlus, Mail, Phone, Calendar } from "lucide-react";

export default function HospitalUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">User Management</h1>
          <p className="text-neutral-500">Manage staff access, roles, and permissions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-xl hover:bg-primary-blue-dark transition-colors shadow-sm shadow-blue-200">
          <UserPlus size={20} />
          <span>Add New User</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, email, or role..." 
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 border-none rounded-xl focus:ring-2 focus:ring-primary-blue/20 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select className="px-4 py-2 bg-neutral-50 border-none rounded-xl text-sm text-neutral-600 focus:ring-2 focus:ring-primary-blue/20 outline-none cursor-pointer">
            <option>All Roles</option>
            <option>Admin</option>
            <option>Manager</option>
            <option>Pharmacist</option>
            <option>Nurse</option>
          </select>
          <select className="px-4 py-2 bg-neutral-50 border-none rounded-xl text-sm text-neutral-600 focus:ring-2 focus:ring-primary-blue/20 outline-none cursor-pointer">
            <option>All Departments</option>
            <option>ICU</option>
            <option>OPD</option>
            <option>Pharmacy</option>
            <option>Emergency</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 text-neutral-600 hover:bg-neutral-50 rounded-xl border border-transparent hover:border-neutral-200 transition-all">
            <Filter size={20} />
            <span className="hidden md:inline">More Filters</span>
          </button>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">User Details</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Role & Dept</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Contact</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Joined Date</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {[
                { name: "Dr. Sarah Jenkins", email: "sarah.j@hospital.com", role: "Manager", dept: "ICU", status: "Active", phone: "+1 234 567 890", joined: "Jan 12, 2023", avatar: "SJ" },
                { name: "John Doe", email: "john.d@hospital.com", role: "Pharmacist", dept: "Pharmacy", status: "Active", phone: "+1 234 567 891", joined: "Mar 05, 2023", avatar: "JD" },
                { name: "Emily Wilson", email: "emily.w@hospital.com", role: "Nurse", dept: "Pediatrics", status: "On Leave", phone: "+1 234 567 892", joined: "Jun 20, 2023", avatar: "EW" },
                { name: "Michael Brown", email: "michael.b@hospital.com", role: "Admin", dept: "IT", status: "Active", phone: "+1 234 567 893", joined: "Nov 15, 2022", avatar: "MB" },
                { name: "Jessica Taylor", email: "jessica.t@hospital.com", role: "Nurse", dept: "Emergency", status: "Inactive", phone: "+1 234 567 894", joined: "Feb 28, 2023", avatar: "JT" },
              ].map((user, i) => (
                <tr key={i} className="hover:bg-neutral-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-blue/10 text-primary-blue flex items-center justify-center font-bold text-sm">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-neutral-900">{user.name}</div>
                        <div className="text-xs text-neutral-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-neutral-900">{user.role}</span>
                      <span className="text-xs text-neutral-500">{user.dept}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Phone size={14} className="text-neutral-400" />
                      <span>{user.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Calendar size={14} className="text-neutral-400" />
                      <span>{user.joined}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      user.status === "Active" ? "bg-green-50 text-green-700 border-green-100" :
                      user.status === "On Leave" ? "bg-orange-50 text-orange-700 border-orange-100" :
                      "bg-neutral-100 text-neutral-600 border-neutral-200"
                    }`}>
                      {user.status}
                    </span>
                  </td>
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
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <p className="text-sm text-neutral-500">Showing <span className="font-medium text-neutral-900">1-5</span> of <span className="font-medium text-neutral-900">142</span> users</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-600 hover:bg-neutral-50 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-600 hover:bg-neutral-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
