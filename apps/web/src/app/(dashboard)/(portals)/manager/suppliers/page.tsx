"use client";

import { Users, Star, Clock, Phone, Mail, MapPin, AlertTriangle, ShieldCheck, Brain } from "lucide-react";

export default function SuppliersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Suppliers</h1>
          <p className="text-neutral-500">Manage supplier relationships and performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: "PharmaCorp Global", reliability: "High", score: 98, leadTime: "2 days", contact: "+1 555-0123", risk: { level: "LOW", msg: "Stable supply chain" } },
          { name: "MediSupply Ltd", reliability: "Medium", score: 85, leadTime: "4 days", contact: "+1 555-0124", risk: { level: "MEDIUM", msg: "Occasional delays reported" } },
          { name: "BioTech Solutions", reliability: "High", score: 95, leadTime: "3 days", contact: "+1 555-0125", risk: { level: "LOW", msg: "Consistent performance" } },
          { name: "Generic Meds Inc", reliability: "Low", score: 72, leadTime: "7 days", contact: "+1 555-0126", risk: { level: "HIGH", msg: "Frequent stockouts detected" } },
          { name: "Surgical Supplies Co", reliability: "Medium", score: 88, leadTime: "3 days", contact: "+1 555-0127", risk: { level: "MEDIUM", msg: "Price volatility alert" } },
        ].map((supplier, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Users size={24} />
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                supplier.reliability === "High" ? "bg-green-100 text-green-700" :
                supplier.reliability === "Medium" ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"
              }`}>
                {supplier.score}% Score
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-neutral-900 mb-1">{supplier.name}</h3>
            <div className="flex items-center gap-1 text-yellow-500 mb-4">
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} className="text-neutral-300" />
              <span className="text-xs text-neutral-500 ml-1">({supplier.reliability})</span>
            </div>

            {/* AI Risk Assessment */}
            <div className={`mb-4 p-3 rounded-xl border text-xs ${
              supplier.risk.level === "LOW" ? "bg-green-50 border-green-100 text-green-800" :
              supplier.risk.level === "MEDIUM" ? "bg-yellow-50 border-yellow-100 text-yellow-800" :
              "bg-red-50 border-red-100 text-red-800"
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                {supplier.risk.level === "LOW" ? <ShieldCheck size={14} /> : <AlertTriangle size={14} />}
                AI Risk Assessment: {supplier.risk.level}
              </div>
              <div className="pl-6 opacity-90">
                {supplier.risk.msg}
              </div>
            </div>

            <div className="space-y-3 text-sm flex-1">
              <div className="flex items-center gap-3 text-neutral-600">
                <Clock size={16} />
                <span>Avg Lead Time: <span className="font-medium text-neutral-900">{supplier.leadTime}</span></span>
              </div>
              <div className="flex items-center gap-3 text-neutral-600">
                <Phone size={16} />
                <span>{supplier.contact}</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-600">
                <Mail size={16} />
                <span>orders@{supplier.name.toLowerCase().replace(/\s/g, '')}.com</span>
              </div>
            </div>

            <button className="w-full mt-6 py-2 border border-neutral-200 rounded-lg text-neutral-600 font-medium hover:bg-neutral-50 transition-colors">
              View Catalog
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
