"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Filter, ChevronDown, ChevronUp, Package, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";
import { Medicine, medicines as mockMedicines } from "@/lib/mockData";
import { inventoryApi, Product as ApiProduct } from "@/lib/api";

type SortField = "name" | "quantity" | "price" | "expiryDate";
type SortOrder = "asc" | "desc";

interface StockListTableProps {
  searchQuery?: string;
  refreshTrigger?: number;
}

// Helper to check if this is the earliest expiring batch for a medicine
const getEarliestExpiryBatches = (meds: Medicine[]) => {
  const earliestByName: Record<string, string> = {};
  meds.forEach(m => {
    const existing = earliestByName[m.name];
    if (!existing) {
      earliestByName[m.name] = m.id;
    } else {
      const existingMed = meds.find(med => med.id === existing);
      if (existingMed && new Date(m.expiryDate) < new Date(existingMed.expiryDate)) {
        earliestByName[m.name] = m.id;
      }
    }
  });
  return new Set(Object.values(earliestByName));
};

export default function StockListTable({ searchQuery = "", refreshTrigger = 0 }: StockListTableProps) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        // Try to fetch from API first
        const products = await inventoryApi.getAll();
        
        if (products && products.length > 0) {
          const flattenedMedicines: Medicine[] = products.flatMap(p => 
            p.inventories.map(inv => {
              const expiryDate = new Date(inv.expiryDate);
              const now = new Date();
              const daysToExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              
              let stockStatus: "in-stock" | "low-stock" | "out-of-stock" | "expired" = "in-stock";
              if (inv.quantity === 0) stockStatus = "out-of-stock";
              else if (daysToExpiry < 0) stockStatus = "expired";
              else if (inv.quantity < (inv.lowStockThreshold || 10)) stockStatus = "low-stock";

              return {
                id: inv.id,
                name: p.name,
                genericName: p.genericName || "",
                category: p.category || "Uncategorized",
                manufacturer: p.manufacturer || "Unknown",
                batchNumber: inv.batchNumber,
                quantity: inv.quantity,
                unit: p.unit,
                costPrice: inv.costPrice,
                sellingPrice: inv.sellingPrice,
                expiryDate: inv.expiryDate,
                minStockLevel: inv.lowStockThreshold || 10,
                stockStatus,
                rack: inv.location || "N/A"
              };
            })
          );
          setMedicines(flattenedMedicines);
        } else {
          // Fallback to mock data if API returns empty
          setMedicines([...mockMedicines]);
        }
      } catch (error: any) {
        // Silently fall back to mock data (demo mode)
        setMedicines([...mockMedicines]);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [refreshTrigger]);

  const effectiveSearch = searchQuery || localSearch;

  const categories = useMemo(() => {
    const cats = new Set(medicines.map(m => m.category));
    return ["all", ...Array.from(cats)];
  }, [medicines]);

  // Get earliest expiry batches for FEFO highlighting
  const earliestExpiryBatches = useMemo(() => getEarliestExpiryBatches(medicines), [medicines]);

  const filteredAndSortedMedicines = useMemo(() => {
    let filtered = [...medicines];

    // Apply search filter
    if (effectiveSearch) {
      const query = effectiveSearch.toLowerCase();
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(query) ||
        m.genericName.toLowerCase().includes(query) ||
        m.manufacturer.toLowerCase().includes(query) ||
        m.batchNumber.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(m => m.category === categoryFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(m => m.stockStatus === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "quantity":
          comparison = a.quantity - b.quantity;
          break;
        case "price":
          comparison = a.sellingPrice - b.sellingPrice;
          break;
        case "expiryDate":
          comparison = new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [medicines, effectiveSearch, categoryFilter, statusFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const getStatusBadge = (status: Medicine["stockStatus"]) => {
    const styles = {
      "in-stock": "bg-status-success/10 text-status-success",
      "low-stock": "bg-status-warning/10 text-status-warning",
      "out-of-stock": "bg-status-danger/10 text-status-danger",
      "expired": "bg-neutral-200 text-neutral-600"
    };
    const icons = {
      "in-stock": <CheckCircle size={12} />,
      "low-stock": <AlertTriangle size={12} />,
      "out-of-stock": <XCircle size={12} />,
      "expired": <XCircle size={12} />
    };
    const labels = {
      "in-stock": "In Stock",
      "low-stock": "Low Stock",
      "out-of-stock": "Out of Stock",
      "expired": "Expired"
    };
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {icons[status]}
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters Row */}
      <div className="flex flex-wrap gap-3">
        {!searchQuery && (
          <div className="relative flex-1 min-w-[200px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search medicines..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent"
            />
          </div>
        )}
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-yellow"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-yellow"
        >
          <option value="all">All Status</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        {filteredAndSortedMedicines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
            <Package size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">No medicines found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th 
                    className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider cursor-pointer hover:bg-neutral-100"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      Medicine <SortIcon field="name" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Batch
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider cursor-pointer hover:bg-neutral-100"
                    onClick={() => handleSort("quantity")}
                  >
                    <div className="flex items-center gap-1">
                      Quantity <SortIcon field="quantity" />
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider cursor-pointer hover:bg-neutral-100"
                    onClick={() => handleSort("price")}
                  >
                    <div className="flex items-center gap-1">
                      Price <SortIcon field="price" />
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider cursor-pointer hover:bg-neutral-100"
                    onClick={() => handleSort("expiryDate")}
                  >
                    <div className="flex items-center gap-1">
                      Expiry <SortIcon field="expiryDate" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredAndSortedMedicines.map((medicine) => {
                  const isFEFO = earliestExpiryBatches.has(medicine.id);
                  return (
                    <tr 
                      key={medicine.id} 
                      className={`hover:bg-neutral-50 transition-colors ${isFEFO ? "border-l-4 border-l-primary-yellow bg-primary-yellow/5" : ""}`}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="font-medium text-neutral-900">{medicine.name}</p>
                            <p className="text-sm text-neutral-500">{medicine.genericName}</p>
                          </div>
                          {isFEFO && (
                            <span className="group relative">
                              <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-primary-yellow text-neutral-900 rounded-full cursor-help">
                                <Clock size={10} />
                                FEFO
                              </span>
                              <span className="absolute left-0 top-full mt-1 px-2 py-1 text-xs bg-neutral-800 text-white rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                Sell this batch first (First Expiry, First Out)
                              </span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-600">{medicine.category}</td>
                      <td className="px-4 py-4 text-sm text-neutral-600 font-mono">{medicine.batchNumber}</td>
                      <td className="px-4 py-4">
                        <span className={`text-sm font-medium ${
                          medicine.quantity <= medicine.minStockLevel ? "text-status-warning" : "text-neutral-900"
                        }`}>
                          {medicine.quantity} {medicine.unit}
                        </span>
                        {medicine.quantity <= medicine.minStockLevel && (
                          <p className="text-xs text-neutral-500">Min: {medicine.minStockLevel}</p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-neutral-900">₹{medicine.sellingPrice}</p>
                        <p className="text-xs text-neutral-500">Cost: ₹{medicine.costPrice}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-600">
                        {new Date(medicine.expiryDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(medicine.stockStatus)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="flex items-center justify-between text-sm text-neutral-500">
        <p>Showing {filteredAndSortedMedicines.length} of {medicines.length} medicines</p>
        <p>Total Value: ₹{filteredAndSortedMedicines.reduce((sum, m) => sum + m.sellingPrice * m.quantity, 0).toLocaleString()}</p>
      </div>
    </div>
  );
}
