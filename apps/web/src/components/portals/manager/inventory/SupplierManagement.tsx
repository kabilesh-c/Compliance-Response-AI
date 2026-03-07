import { useState } from "react";
import { Search, Plus, Filter, MoreVertical, Phone, Mail, MapPin, Star, Truck, ExternalLink } from "lucide-react";

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  rating: number;
  status: "active" | "inactive";
  lastDelivery: string;
}

const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: "1",
    name: "MediCare Distributors",
    contactPerson: "Rajesh Kumar",
    email: "orders@medicare.com",
    phone: "+91 98765 43210",
    category: "Pharmaceuticals",
    rating: 4.8,
    status: "active",
    lastDelivery: "2 days ago"
  },
  {
    id: "2",
    name: "Global Health Supplies",
    contactPerson: "Sarah Wilson",
    email: "sarah@globalhealth.com",
    phone: "+91 98765 12345",
    category: "Surgical Equipment",
    rating: 4.5,
    status: "active",
    lastDelivery: "1 week ago"
  },
  {
    id: "3",
    name: "City Pharma Agency",
    contactPerson: "Amit Patel",
    email: "amit@citypharma.com",
    phone: "+91 98765 67890",
    category: "Generic Medicines",
    rating: 4.2,
    status: "inactive",
    lastDelivery: "1 month ago"
  }
];

export default function SupplierManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900">Supplier Directory</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-yellow text-neutral-900 rounded-button text-sm font-medium hover:bg-primary-yellow-dark transition-colors">
          <Plus size={16} />
          Add Supplier
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-neutral-50 p-4 rounded-card border border-neutral-200">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary-yellow/50 focus:border-primary-yellow"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-neutral-500" />
          <select 
            className="px-4 py-2 bg-white border border-neutral-200 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary-yellow/50"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_SUPPLIERS.map((supplier) => (
          <div key={supplier.id} className="bg-white rounded-card shadow-card border border-neutral-100 p-5 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-yellow/10 flex items-center justify-center text-primary-yellow-dark font-bold text-lg">
                  {supplier.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 line-clamp-1">{supplier.name}</h4>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    supplier.status === "active" 
                      ? "bg-status-success/10 text-status-success" 
                      : "bg-neutral-100 text-neutral-500"
                  }`}>
                    {supplier.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <button className="text-neutral-400 hover:text-neutral-600">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="space-y-3 text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-neutral-400" />
                <span>{supplier.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-neutral-400" />
                <span>{supplier.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-neutral-400" />
                <span className="truncate">{supplier.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="font-medium text-neutral-900">{supplier.rating}</span>
                <span className="text-neutral-400">• Last delivery {supplier.lastDelivery}</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <button className="text-sm font-medium text-neutral-600 hover:text-primary-yellow-dark transition-colors">
                View History
              </button>
              <button className="flex items-center gap-1 text-sm font-medium text-primary-yellow-dark hover:text-primary-yellow-darker transition-colors">
                Place Order <ExternalLink size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}