"use client";

import { motion } from "framer-motion";
import { 
  Home, Package, Users, ShoppingCart, FileText, Settings, 
  Search, Bell, ChevronDown, TrendingUp, MoreHorizontal, Check
} from "lucide-react";

export default function DashboardMockup() {
  return (
    <div className="relative">
      {/* Main Dashboard Container */}
      <div className="bg-neutral-100 rounded-xl overflow-hidden shadow-2xl border border-white/20 w-full aspect-[16/12] flex text-[10px] md:text-xs font-sans select-none">
        
        {/* Sidebar */}
        <div className="w-16 md:w-48 bg-primary-dashboard-sidebar flex-shrink-0 flex flex-col text-white/80">
          <div className="h-12 flex items-center px-4 border-b border-white/10">
            <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center text-primary-dashboard-sidebar font-bold mr-2">
              P
            </div>
            <span className="font-bold text-white hidden md:block">PharmaOS</span>
          </div>
          
          <div className="p-2 space-y-1">
            {[
              { icon: Home, label: "Home", active: true },
              { icon: Package, label: "Inventory" },
              { icon: Users, label: "Customers" },
              { icon: ShoppingCart, label: "Sales" },
              { icon: FileText, label: "Reports" },
              { icon: Settings, label: "Settings" },
            ].map((item, i) => (
              <div 
                key={i}
                className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  item.active ? "bg-white/10 text-white" : "hover:bg-white/5"
                }`}
              >
                <item.icon size={14} className="mr-0 md:mr-3" />
                <span className="hidden md:block">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-neutral-50">
          {/* Top Bar */}
          <div className="h-12 bg-white border-b border-neutral-200 flex items-center justify-between px-4">
            <div className="flex items-center bg-neutral-100 rounded-md px-2 py-1 w-48">
              <Search size={12} className="text-neutral-400 mr-2" />
              <span className="text-neutral-400">Search...</span>
            </div>
            <div className="flex items-center gap-3">
              <Bell size={14} className="text-neutral-400" />
              <div className="w-6 h-6 bg-primary-teal rounded-full text-white flex items-center justify-center font-bold">
                A
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-4 space-y-4 overflow-hidden">
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Total Sales", value: "₹1,24,500", color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Orders", value: "142", color: "text-purple-600", bg: "bg-purple-50" },
                { label: "Low Stock", value: "12", color: "text-orange-600", bg: "bg-orange-50" },
                { label: "Expiring", value: "5", color: "text-red-600", bg: "bg-red-50" },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-3 rounded-lg shadow-sm border border-neutral-100">
                  <div className="text-neutral-400 mb-1 text-[10px]">{stat.label}</div>
                  <div className={`font-bold ${stat.color}`}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-3">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-neutral-700">Recent Transactions</h4>
                <MoreHorizontal size={12} className="text-neutral-400" />
              </div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-neutral-100" />
                      <div>
                        <div className="font-medium text-neutral-700">Order #{2045 + i}</div>
                        <div className="text-neutral-400 text-[9px]">Just now</div>
                      </div>
                    </div>
                    <div className="text-green-600 font-medium">+₹450.00</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart Section Placeholder */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-3 h-32 flex items-end justify-between px-2 pb-2 gap-1">
               {[40, 60, 45, 70, 50, 80, 65, 85, 75, 90, 60, 95, 80, 70, 85].map((h, i) => (
                 <div key={i} className="w-full bg-primary-teal/20 rounded-t-sm" style={{ height: `${h}%` }} />
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Card: Today's Sales */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-neutral-100 flex items-center gap-4 z-20"
      >
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
          <Check size={20} />
        </div>
        <div>
          <div className="text-xs text-neutral-500 font-medium">Today's Sales</div>
          <div className="text-xl font-bold text-neutral-900">₹24,500</div>
        </div>
      </motion.div>

      {/* Floating Card: Monthly Growth */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-neutral-100 flex items-center gap-4 z-20"
      >
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <TrendingUp size={20} />
        </div>
        <div>
          <div className="text-xs text-neutral-500 font-medium">Monthly Growth</div>
          <div className="text-xl font-bold text-neutral-900">+18.2%</div>
        </div>
      </motion.div>
    </div>
  );
}
