"use client";

import { Building2, Users, Activity, MoreVertical, Plus, HeartPulse, Stethoscope, Baby, Syringe } from "lucide-react";

export default function DepartmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Departments</h1>
          <p className="text-neutral-500">Manage hospital wards, units, and specialized centers</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-xl hover:bg-primary-blue-dark transition-colors shadow-sm shadow-blue-200">
          <Plus size={20} />
          <span>Add Department</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* ICU */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-100 transition-colors">
              <HeartPulse size={24} />
            </div>
            <button className="text-neutral-400 hover:text-neutral-600 p-1 hover:bg-neutral-50 rounded-lg transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
          <h3 className="text-lg font-bold text-neutral-900 mb-1">Intensive Care Unit</h3>
          <p className="text-sm text-neutral-500 mb-4">Critical care and emergency response</p>
          
          <div className="space-y-3 pt-3 border-t border-neutral-50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Head Nurse</span>
              <span className="font-medium text-neutral-900">Sarah Jenkins</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Staff Count</span>
              <span className="font-medium text-neutral-900">12 Active</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Stock Status</span>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Optimal</span>
            </div>
          </div>
        </div>

        {/* OPD */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors">
              <Stethoscope size={24} />
            </div>
            <button className="text-neutral-400 hover:text-neutral-600 p-1 hover:bg-neutral-50 rounded-lg transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
          <h3 className="text-lg font-bold text-neutral-900 mb-1">Outpatient Department</h3>
          <p className="text-sm text-neutral-500 mb-4">General consultation and checkups</p>
          
          <div className="space-y-3 pt-3 border-t border-neutral-50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Head Doctor</span>
              <span className="font-medium text-neutral-900">Dr. A. Kumar</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Staff Count</span>
              <span className="font-medium text-neutral-900">24 Active</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Stock Status</span>
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">Low Supply</span>
            </div>
          </div>
        </div>

        {/* General Ward */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl group-hover:bg-green-100 transition-colors">
              <Building2 size={24} />
            </div>
            <button className="text-neutral-400 hover:text-neutral-600 p-1 hover:bg-neutral-50 rounded-lg transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
          <h3 className="text-lg font-bold text-neutral-900 mb-1">General Ward</h3>
          <p className="text-sm text-neutral-500 mb-4">In-patient care and recovery</p>
          
          <div className="space-y-3 pt-3 border-t border-neutral-50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Supervisor</span>
              <span className="font-medium text-neutral-900">Mary Smith</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Staff Count</span>
              <span className="font-medium text-neutral-900">18 Active</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Stock Status</span>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Optimal</span>
            </div>
          </div>
        </div>

        {/* Pediatrics */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-100 transition-colors">
              <Baby size={24} />
            </div>
            <button className="text-neutral-400 hover:text-neutral-600 p-1 hover:bg-neutral-50 rounded-lg transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
          <h3 className="text-lg font-bold text-neutral-900 mb-1">Pediatrics</h3>
          <p className="text-sm text-neutral-500 mb-4">Infant and child medical care</p>
          
          <div className="space-y-3 pt-3 border-t border-neutral-50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Head Doctor</span>
              <span className="font-medium text-neutral-900">Dr. Emily R.</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Staff Count</span>
              <span className="font-medium text-neutral-900">10 Active</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Stock Status</span>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Optimal</span>
            </div>
          </div>
        </div>

        {/* Emergency */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-100 transition-colors">
              <Activity size={24} />
            </div>
            <button className="text-neutral-400 hover:text-neutral-600 p-1 hover:bg-neutral-50 rounded-lg transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
          <h3 className="text-lg font-bold text-neutral-900 mb-1">Emergency</h3>
          <p className="text-sm text-neutral-500 mb-4">24/7 Urgent care services</p>
          
          <div className="space-y-3 pt-3 border-t border-neutral-50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Head Doctor</span>
              <span className="font-medium text-neutral-900">Dr. James B.</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Staff Count</span>
              <span className="font-medium text-neutral-900">32 Active</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Stock Status</span>
              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">Critical</span>
            </div>
          </div>
        </div>

        {/* Pharmacy */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:bg-teal-100 transition-colors">
              <Syringe size={24} />
            </div>
            <button className="text-neutral-400 hover:text-neutral-600 p-1 hover:bg-neutral-50 rounded-lg transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
          <h3 className="text-lg font-bold text-neutral-900 mb-1">Central Pharmacy</h3>
          <p className="text-sm text-neutral-500 mb-4">Medicine dispensing and storage</p>
          
          <div className="space-y-3 pt-3 border-t border-neutral-50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Manager</span>
              <span className="font-medium text-neutral-900">John Doe</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Staff Count</span>
              <span className="font-medium text-neutral-900">8 Active</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Stock Status</span>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Optimal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
