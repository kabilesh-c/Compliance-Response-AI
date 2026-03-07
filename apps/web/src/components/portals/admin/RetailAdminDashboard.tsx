"use client";

import { DollarSign, ShoppingCart, TrendingUp, AlertCircle, Users, Package, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { medicines, orders } from "@/lib/mockData";

export default function RetailAdminDashboard() {
  const router = useRouter();

  // Calculate stats from mock data
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    
    // Calculate profit
    let totalProfit = 0;
    orders.forEach(order => {
      order.items.forEach(item => {
        const medicine = medicines.find(m => m.id === item.medicineId);
        if (medicine) {
          // Profit = Line Total - (Cost Price * Quantity)
          totalProfit += (item.price - (medicine.costPrice * item.quantity));
        }
      });
    });

    const lowStockCount = medicines.filter(m => m.stockStatus === "low-stock" || m.stockStatus === "out-of-stock").length;
    const totalProducts = medicines.length;

    return {
      totalRevenue,
      totalOrders,
      totalProfit,
      lowStockCount,
      totalProducts
    };
  }, []);

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Retail Admin Dashboard</h1>
        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          Store Open
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* SALES CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <DollarSign size={20} />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+12%</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">${stats.totalRevenue.toLocaleString()}</div>
          <div className="text-sm text-neutral-500">Total Revenue Today</div>
        </div>

        {/* ORDERS CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <ShoppingCart size={20} />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">+5%</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">{stats.totalOrders}</div>
          <div className="text-sm text-neutral-500">Total Orders</div>
        </div>

        {/* PROFIT CARD */}
        <div className="bg-primary-yellow p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 text-neutral-900 rounded-lg">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-neutral-900">${stats.totalProfit.toLocaleString()}</div>
          <div className="text-sm text-neutral-800">Net Profit Today</div>
        </div>

        {/* ALERTS CARD */}
        <div className="bg-[#2A2D3A] text-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/10 rounded-lg">
              <AlertCircle size={20} />
            </div>
            <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded">Action Needed</span>
          </div>
          <div className="text-3xl font-bold">{stats.lowStockCount}</div>
          <div className="text-sm text-neutral-400">Low Stock Items</div>
        </div>
      </div>

      {/* Recent Activity & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-neutral-900 text-lg">Recent Transactions</h3>
            <button 
              onClick={() => router.push('/pos')}
              className="text-sm text-primary-yellow-dark font-bold hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-neutral-400 border border-neutral-100">
                    <ShoppingCart size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900 text-sm">Order #{order.id}</p>
                    <p className="text-xs text-neutral-500">{order.customerName} • {order.items.length} items</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-green-600 block">+${order.total}</span>
                  <span className="text-xs text-neutral-400">{order.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
          <h3 className="font-bold text-neutral-900 text-lg mb-6">Store Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-neutral-600">
                <Users size={16} />
                <span className="text-sm">Active Staff</span>
              </div>
              <span className="font-bold text-neutral-900">3</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-neutral-600">
                <Package size={16} />
                <span className="text-sm">Total Products</span>
              </div>
              <span className="font-bold text-neutral-900">{stats.totalProducts}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-neutral-600">
                <Activity size={16} />
                <span className="text-sm">Conversion Rate</span>
              </div>
              <span className="font-bold text-neutral-900">64%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
