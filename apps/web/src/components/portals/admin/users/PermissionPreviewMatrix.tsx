"use client";

import { Fragment } from "react";
import { Shield, Check, X, AlertCircle } from "lucide-react";

export default function PermissionPreviewMatrix() {
  const permissions = [
    { category: "Dashboard", items: [
      { name: "View Financials", admin: true, manager: false, pharmacist: false },
      { name: "View AI Insights", admin: true, manager: true, pharmacist: false },
      { name: "View Operational Metrics", admin: true, manager: true, pharmacist: true },
    ]},
    { category: "Inventory", items: [
      { name: "Manage Stock", admin: true, manager: true, pharmacist: false },
      { name: "Approve Reorders", admin: true, manager: true, pharmacist: false },
      { name: "View Stock Levels", admin: true, manager: true, pharmacist: true },
    ]},
    { category: "User Management", items: [
      { name: "Create Users", admin: true, manager: false, pharmacist: false },
      { name: "Assign Roles", admin: true, manager: false, pharmacist: false },
      { name: "View Staff List", admin: true, manager: true, pharmacist: false },
    ]},
  ];

  return (
    <div className="bg-white rounded-card shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <Shield size={20} className="text-primary-blue" />
            Role Permission Matrix
          </h3>
          <p className="text-sm text-neutral-500 mt-1">Read-only view of role capabilities</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-500 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200">
          <AlertCircle size={14} />
          Permissions are defined in system config
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="text-left py-3 font-medium text-neutral-500 w-1/3">Permission</th>
              <th className="text-center py-3 font-medium text-primary-blue w-1/5">Admin</th>
              <th className="text-center py-3 font-medium text-status-warning w-1/5">Manager</th>
              <th className="text-center py-3 font-medium text-status-success w-1/5">Pharmacist</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {permissions.map((category, i) => (
              <Fragment key={i}>
                <tr className="bg-neutral-50/50">
                  <td colSpan={4} className="py-2 px-2 font-semibold text-xs text-neutral-500 uppercase tracking-wider">
                    {category.category}
                  </td>
                </tr>
                {category.items.map((item, j) => (
                  <tr key={`item-${i}-${j}`} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3 pl-4 text-neutral-700">{item.name}</td>
                    <td className="py-3 text-center">
                      {item.admin ? <Check size={16} className="mx-auto text-status-success" /> : <X size={16} className="mx-auto text-neutral-300" />}
                    </td>
                    <td className="py-3 text-center">
                      {item.manager ? <Check size={16} className="mx-auto text-status-success" /> : <X size={16} className="mx-auto text-neutral-300" />}
                    </td>
                    <td className="py-3 text-center">
                      {item.pharmacist ? <Check size={16} className="mx-auto text-status-success" /> : <X size={16} className="mx-auto text-neutral-300" />}
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
