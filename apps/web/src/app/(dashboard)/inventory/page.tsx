"use client";

import { useState } from "react";
import { Package, Calendar, AlertTriangle, Plus, Download, Upload, TrendingUp, X } from "lucide-react";
import StockListTable from "@/components/inventory/StockListTable";
import ExpiryManagement from "@/components/inventory/ExpiryManagement";
import StockAlertsTable from "@/components/inventory/StockAlertsTable";
import ReorderSuggestions from "@/components/inventory/ReorderSuggestions";
import { useAuthStore } from "@/stores/authStore";
import { addMockMedicine, medicines as mockMedicines, Medicine } from "@/lib/mockData";

type TabType = "stock-list" | "expiry" | "alerts" | "reorder";

const tabs: { id: TabType; label: string; icon: typeof Package; isAI?: boolean }[] = [
  { id: "stock-list", label: "Stock List", icon: Package },
  { id: "expiry", label: "Expiry Management", icon: Calendar },
  { id: "alerts", label: "Stock Alerts", icon: AlertTriangle },
  { id: "reorder", label: "Reorder Suggestions", icon: TrendingUp, isAI: true },
];

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<TabType>("stock-list");
  const [globalSearch, setGlobalSearch] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { user } = useAuthStore();

  const canAddStock = user?.role === "ADMIN" || user?.role === "MANAGER";

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Simulate import
        const newMed: Medicine = {
          id: Math.random().toString(36).substr(2, 9),
          name: "Imported Med " + Math.floor(Math.random() * 100),
          genericName: "Generic Import",
          category: "Imported",
          manufacturer: "Imported Pharma",
          batchNumber: "IMP" + Math.floor(Math.random() * 1000),
          quantity: 100,
          unit: "tablets",
          costPrice: 10,
          sellingPrice: 20,
          expiryDate: "2025-12-31",
          minStockLevel: 10,
          stockStatus: "in-stock",
          rack: "Z1"
        };
        addMockMedicine(newMed);
        setRefreshTrigger(prev => prev + 1);
        alert("Successfully imported data from " + file.name);
      }
    };
    input.click();
  };

  const handleExport = () => {
    const headers = ["Name", "Generic Name", "Category", "Batch", "Quantity", "Price", "Expiry"];
    const rows = mockMedicines.map(m => [
      `"${m.name}"`, `"${m.genericName}"`, `"${m.category}"`, `"${m.batchNumber}"`, m.quantity, m.sellingPrice, m.expiryDate
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "inventory_export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-4 relative">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Inventory Management</h1>
          <p className="text-neutral-500">Manage your medicine stock, track expiry dates, and handle alerts</p>
        </div>
        
        {canAddStock && (
          <div className="flex gap-3">
            <button 
              onClick={handleImport}
              className="flex items-center gap-2 px-4 py-2.5 border border-neutral-200 rounded-xl text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <Upload size={18} />
              Import
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 border border-neutral-200 rounded-xl text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <Download size={18} />
              Export
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary-yellow text-neutral-900 rounded-xl font-medium hover:bg-primary-yellow-dark transition-colors"
            >
              <Plus size={18} />
              Add Medicine
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors relative
                ${isActive 
                  ? "text-neutral-900" 
                  : "text-neutral-500 hover:text-neutral-700"
                }
              `}
            >
              <Icon size={18} />
              {tab.label}
              {tab.isAI && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary-yellow text-neutral-900 rounded-full">
                  AI
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-yellow rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[calc(100vh-280px)]">
        {activeTab === "stock-list" && <StockListTable searchQuery={globalSearch} refreshTrigger={refreshTrigger} />}
        {activeTab === "expiry" && <ExpiryManagement />}
        {activeTab === "alerts" && <StockAlertsTable />}
        {activeTab === "reorder" && <ReorderSuggestions />}
      </div>

      {/* Add Medicine Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl m-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Add New Medicine</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X size={20} className="text-neutral-500" />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newMed: Medicine = {
                id: Math.random().toString(36).substr(2, 9),
                name: formData.get('name') as string,
                genericName: formData.get('genericName') as string,
                category: formData.get('category') as string,
                manufacturer: formData.get('manufacturer') as string,
                batchNumber: formData.get('batchNumber') as string,
                quantity: Number(formData.get('quantity')),
                unit: formData.get('unit') as string,
                costPrice: Number(formData.get('costPrice')),
                sellingPrice: Number(formData.get('sellingPrice')),
                expiryDate: formData.get('expiryDate') as string,
                minStockLevel: Number(formData.get('minStockLevel')),
                stockStatus: "in-stock",
                rack: formData.get('rack') as string
              };
              
              addMockMedicine(newMed);
              setRefreshTrigger(prev => prev + 1);
              setIsAddModalOpen(false);
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-neutral-700">Medicine Name</label>
                  <input required name="name" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-yellow focus:outline-none" placeholder="e.g. Paracetamol" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-neutral-700">Generic Name</label>
                  <input required name="genericName" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-yellow focus:outline-none" placeholder="e.g. Acetaminophen" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-neutral-700">Category</label>
                  <select name="category" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-yellow focus:outline-none">
                    <option value="Painkillers">Painkillers</option>
                    <option value="Antibiotics">Antibiotics</option>
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Supplements">Supplements</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-neutral-700">Manufacturer</label>
                  <input required name="manufacturer" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-yellow focus:outline-none" placeholder="e.g. GSK" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-neutral-700">Batch No.</label>
                  <input required name="batchNumber" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-yellow focus:outline-none" placeholder="BATCH001" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-neutral-700">Quantity</label>
                  <input required type="number" name="quantity" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-yellow focus:outline-none" placeholder="100" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-neutral-700">Unit</label>
                  <select name="unit" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-yellow focus:outline-none">
                    <option value="tablets">Tablets</option>
                    <option value="capsules">Capsules</option>
                    <option value="bottles">Bottles</option>
                    <option value="strips">Strips</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-neutral-700">Cost Price</label>
                  <input required type="number" name="costPrice" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-yellow focus:outline-none" placeholder="0.00" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-neutral-700">Selling Price</label>
                  <input required type="number" name="sellingPrice" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-yellow focus:outline-none" placeholder="0.00" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-neutral-700">Expiry Date</label>
                  <input required type="date" name="expiryDate" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-yellow focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-neutral-700">Rack Location</label>
                  <input required name="rack" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-yellow focus:outline-none" placeholder="e.g. A1" />
                </div>
              </div>
              
              <input type="hidden" name="minStockLevel" value="10" />

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-xl text-neutral-700 hover:bg-neutral-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-primary-yellow text-neutral-900 rounded-xl font-medium hover:bg-primary-yellow-dark transition-colors"
                >
                  Add Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
