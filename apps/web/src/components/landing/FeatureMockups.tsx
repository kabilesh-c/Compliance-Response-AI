"use client";

import { 
  AlertTriangle, Clock, TrendingDown, Check, X, 
  ShoppingCart, Search, Plus, Minus, Trash2, 
  BarChart3, TrendingUp, DollarSign, Users,
  AlertCircle, ArrowRight, RefreshCw, ArrowLeftRight
} from "lucide-react";
import { motion } from "framer-motion";

// --- Inventory Mockup ---
export function InventoryMockup() {
  return (
    <div className="w-full h-full bg-neutral-50 p-6 flex flex-col gap-6 overflow-hidden">
      {/* Inventory Health Card (Dark Theme from Reference) */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Inventory Health</h3>
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/30 flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            AI Monitored
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Health Score Circle */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="351.86" strokeDashoffset="49.26" className="text-emerald-500" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">86%</span>
              <span className="text-xs text-slate-400">Health</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="flex-1 grid gap-3 w-full">
            <div className="bg-slate-800/50 p-3 rounded-xl flex items-center gap-4 border border-slate-700">
              <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
                <AlertTriangle size={18} />
              </div>
              <div>
                <div className="font-bold text-lg leading-none">12</div>
                <div className="text-xs text-slate-400">Stockout Risk Items</div>
              </div>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl flex items-center gap-4 border border-slate-700">
              <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
                <Clock size={18} />
              </div>
              <div>
                <div className="font-bold text-lg leading-none">8</div>
                <div className="text-xs text-slate-400">FEFO Warnings</div>
              </div>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl flex items-center gap-4 border border-slate-700">
              <div className="p-2 bg-slate-500/20 rounded-lg text-slate-400">
                <TrendingDown size={18} />
              </div>
              <div>
                <div className="font-bold text-lg leading-none">5</div>
                <div className="text-xs text-slate-400">Critical Items</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
          <div className="w-4 h-4 text-yellow-400"><AlertCircle size={16} /></div>
          AI predicts 3 items at risk of stockout within 48 hours
        </div>
      </div>

      {/* Recent Activity List (Visual Filler) */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 flex-1">
        <h4 className="font-semibold text-neutral-700 mb-3 text-sm">Recent Movements</h4>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-500">
                  <RefreshCw size={14} />
                </div>
                <div>
                  <div className="font-medium text-neutral-800">Stock Update #{1020 + i}</div>
                  <div className="text-xs text-neutral-400">2 mins ago</div>
                </div>
              </div>
              <span className="text-emerald-600 font-medium">+50 Units</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- POS Mockup ---
export function POSMockup() {
  return (
    <div className="w-full h-full bg-neutral-100 flex overflow-hidden text-xs md:text-sm">
      {/* Left: Product Grid */}
      <div className="flex-1 p-4 flex flex-col gap-4">
        <div className="bg-white p-2 rounded-lg shadow-sm flex gap-2">
          <div className="flex-1 bg-neutral-100 rounded-md flex items-center px-3 py-2 text-neutral-500 gap-2">
            <Search size={16} />
            <span>Search medicines...</span>
          </div>
          <div className="px-4 py-2 bg-primary-teal text-white rounded-md font-medium">Scan</div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 overflow-y-auto">
          {[
            { name: "Dolo 650", type: "Tablet", price: "₹30", stock: "High", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80" },
            { name: "Azithral 500", type: "Tablet", price: "₹120", stock: "Med", img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=300&q=80" },
            { name: "Pan D", type: "Capsule", price: "₹190", stock: "High", img: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=300&q=80" },
            { name: "Crocine", type: "Syrup", price: "₹45", stock: "Low", img: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=300&q=80" },
            { name: "Allegra 120", type: "Tablet", price: "₹180", stock: "High", img: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=300&q=80" },
            { name: "Shelcal 500", type: "Tablet", price: "₹110", stock: "Med", img: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=300&q=80" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-3 rounded-xl shadow-sm border border-neutral-200 hover:border-primary-teal cursor-pointer transition-colors group">
              <div className="h-20 bg-neutral-50 rounded-lg mb-2 overflow-hidden relative">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="font-bold text-neutral-800">{item.name}</div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-neutral-500 text-xs">{item.type}</span>
                <span className="font-bold text-primary-teal">{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="w-1/3 bg-white border-l border-neutral-200 flex flex-col">
        <div className="p-4 border-b border-neutral-100 font-bold text-neutral-800 flex justify-between items-center">
          <span>Current Bill</span>
          <span className="bg-neutral-100 text-neutral-600 px-2 py-1 rounded text-xs">#1042</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {[
            { name: "Dolo 650", qty: 2, price: "₹60" },
            { name: "Pan D", qty: 1, price: "₹190" },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-start">
              <div>
                <div className="font-medium text-neutral-800">{item.name}</div>
                <div className="text-xs text-neutral-400">Strip of 15</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="font-bold text-neutral-800">{item.price}</div>
                <div className="flex items-center gap-2 bg-neutral-100 rounded px-1">
                  <button className="p-1 hover:text-red-500"><Minus size={10} /></button>
                  <span className="text-xs font-medium w-3 text-center">{item.qty}</span>
                  <button className="p-1 hover:text-green-500"><Plus size={10} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-neutral-50 border-t border-neutral-200 space-y-3">
          <div className="flex justify-between text-neutral-600 text-xs">
            <span>Subtotal</span>
            <span>₹250.00</span>
          </div>
          <div className="flex justify-between text-neutral-600 text-xs">
            <span>GST (18%)</span>
            <span>₹45.00</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-neutral-900 pt-2 border-t border-neutral-200">
            <span>Total</span>
            <span>₹295.00</span>
          </div>
          <button className="w-full py-3 bg-primary-teal text-white rounded-xl font-bold shadow-lg shadow-primary-teal/20 hover:bg-primary-teal-dark transition-colors">
            Print Bill
          </button>
        </div>
      </div>
    </div>
  );
}

// --- AI Automation Mockup ---
export function AIMockup() {
  return (
    <div className="w-full h-full bg-yellow-50/50 p-6 flex flex-col gap-4 overflow-hidden">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg text-neutral-800">AI Recommendations</h3>
          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-md border border-yellow-200">3 New</span>
        </div>
        <span className="text-xs font-medium text-neutral-500 flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          AI Active
        </span>
      </div>

      {/* Recommendation Cards */}
      <div className="space-y-3">
        {/* Card 1: High Priority */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500 flex gap-4">
          <div className="p-3 bg-yellow-50 rounded-full h-fit text-yellow-600">
            <ShoppingCart size={20} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-neutral-800">Reorder Paracetamol 500mg</h4>
              <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">HIGH</span>
            </div>
            <p className="text-xs text-neutral-600 mb-3">Stock will deplete in 3 days based on current sales velocity.</p>
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-neutral-900">₹15,000 <span className="text-[10px] font-normal text-yellow-600 ml-1">✨ 94% confidence</span></div>
              <div className="flex gap-2">
                <button className="p-1.5 rounded-full bg-neutral-100 text-neutral-400 hover:bg-neutral-200"><Users size={14} /></button>
                <button className="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200"><Check size={14} /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Medium Priority */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-500 flex gap-4">
          <div className="p-3 bg-purple-50 rounded-full h-fit text-purple-600">
            <RefreshCw size={20} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-neutral-800">Return Expiring Antibiotics</h4>
              <span className="text-[10px] font-bold bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full">MEDIUM</span>
            </div>
            <p className="text-xs text-neutral-600 mb-3">12 units of Amoxicillin 250mg expiring in 7 days.</p>
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-neutral-900">₹3,200 <span className="text-[10px] font-normal text-yellow-600 ml-1">✨ 88% confidence</span></div>
              <div className="flex gap-2">
                <button className="p-1.5 rounded-full bg-neutral-100 text-neutral-400 hover:bg-neutral-200"><Users size={14} /></button>
                <button className="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200"><Check size={14} /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Low Priority */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500 flex gap-4 opacity-80">
          <div className="p-3 bg-blue-50 rounded-full h-fit text-blue-600">
            <ArrowLeftRight size={20} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-neutral-800">Transfer Ibuprofen to Branch B</h4>
              <span className="text-[10px] font-bold bg-green-100 text-green-600 px-2 py-0.5 rounded-full">LOW</span>
            </div>
            <p className="text-xs text-neutral-600 mb-3">Excess stock detected, Branch B has shortage.</p>
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-neutral-900">₹2,800 <span className="text-[10px] font-normal text-yellow-600 ml-1">✨ 82% confidence</span></div>
              <div className="flex gap-2">
                <button className="p-1.5 rounded-full bg-neutral-100 text-neutral-400 hover:bg-neutral-200"><Users size={14} /></button>
                <button className="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200"><Check size={14} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Analytics Mockup ---
export function AnalyticsMockup() {
  return (
    <div className="w-full h-full bg-neutral-50 p-6 flex flex-col gap-6 overflow-hidden">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-neutral-800">Business Overview</h3>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-white border border-neutral-200 rounded-md text-xs font-medium text-neutral-600">This Month</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100">
          <div className="flex items-center gap-2 text-neutral-500 text-xs mb-2">
            <DollarSign size={14} /> Total Revenue
          </div>
          <div className="text-xl font-bold text-neutral-900">₹4.2L</div>
          <div className="text-xs text-green-600 flex items-center mt-1">
            <TrendingUp size={12} className="mr-1" /> +12.5%
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100">
          <div className="flex items-center gap-2 text-neutral-500 text-xs mb-2">
            <ShoppingCart size={14} /> Orders
          </div>
          <div className="text-xl font-bold text-neutral-900">1,240</div>
          <div className="text-xs text-green-600 flex items-center mt-1">
            <TrendingUp size={12} className="mr-1" /> +8.2%
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100">
          <div className="flex items-center gap-2 text-neutral-500 text-xs mb-2">
            <Users size={14} /> New Customers
          </div>
          <div className="text-xl font-bold text-neutral-900">328</div>
          <div className="text-xs text-red-500 flex items-center mt-1">
            <TrendingDown size={12} className="mr-1" /> -2.1%
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100 flex-1 flex flex-col">
        <h4 className="font-semibold text-neutral-700 text-sm mb-4">Sales Performance</h4>
        <div className="flex-1 flex items-end justify-between gap-2 px-2">
          {[35, 45, 30, 60, 75, 50, 65, 80, 70, 90, 85, 95].map((h, i) => (
            <div key={i} className="w-full bg-primary-teal/10 rounded-t-md relative group hover:bg-primary-teal/20 transition-colors" style={{ height: `${h}%` }}>
              <div className="absolute bottom-0 w-full bg-primary-teal rounded-t-md" style={{ height: `${h * 0.6}%` }} />
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                ₹{(h * 1200).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-neutral-400 px-2">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
        </div>
      </div>
    </div>
  );
}
