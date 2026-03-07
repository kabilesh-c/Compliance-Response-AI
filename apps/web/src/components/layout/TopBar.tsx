"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Bell, Grid3x3, X, Package, ShoppingCart, FileText, Clock } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { medicines, orders } from "@/lib/mockData";
import { useAuthStore } from "@/stores/authStore";
import AIActivityIndicator from "@/components/ai/AIActivityIndicator";

interface SearchResult {
  id: string;
  type: "medicine" | "order" | "page";
  title: string;
  subtitle: string;
  href: string;
}

const pageResults: SearchResult[] = [
  { id: "dashboard", type: "page", title: "Dashboard", subtitle: "Overview and metrics", href: "/dashboard" },
  { id: "pos", type: "page", title: "Point of Sale", subtitle: "Create new orders", href: "/pos" },
  { id: "inventory", type: "page", title: "Inventory", subtitle: "Manage stock", href: "/inventory" },
  { id: "analytics", type: "page", title: "Analytics", subtitle: "Reports and insights", href: "/analytics" },
  { id: "settings", type: "page", title: "Settings", subtitle: "App configuration", href: "/settings" },
];

export default function TopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, mode } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAIIndicator, setShowAIIndicator] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Show AI indicator on route change (simulating AI analysis)
  useEffect(() => {
    setShowAIIndicator(true);
    const timer = setTimeout(() => setShowAIIndicator(false), 2500);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Search logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Search medicines
    medicines
      .filter(m => 
        m.name.toLowerCase().includes(query) ||
        m.genericName.toLowerCase().includes(query)
      )
      .slice(0, 3)
      .forEach(m => {
        results.push({
          id: m.id,
          type: "medicine",
          title: m.name,
          subtitle: `${m.genericName} • ₹${m.sellingPrice}`,
          href: `/inventory?search=${m.name}`,
        });
      });

    // Search orders
    orders
      .filter(o => 
        o.id.toLowerCase().includes(query) ||
        o.customerName.toLowerCase().includes(query)
      )
      .slice(0, 2)
      .forEach(o => {
        results.push({
          id: o.id,
          type: "order",
          title: `Order ${o.id}`,
          subtitle: `${o.customerName} • ₹${o.total}`,
          href: `/pos?order=${o.id}`,
        });
      });

    // Search pages
    pageResults
      .filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.subtitle.toLowerCase().includes(query)
      )
      .forEach(p => results.push(p));

    setSearchResults(results.slice(0, 6));
  }, [searchQuery]);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    router.push(result.href);
    setSearchQuery("");
    setIsSearchFocused(false);
  };

  const getResultIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "medicine": return <Package size={16} className="text-status-success" />;
      case "order": return <ShoppingCart size={16} className="text-status-info" />;
      case "page": return <FileText size={16} className="text-neutral-400" />;
    }
  };

  const notifications = [
    { id: "1", message: "Low stock: Paracetamol 500mg", time: "5 min ago", type: "warning" },
    { id: "2", message: "Order #ORD005 completed", time: "15 min ago", type: "success" },
    { id: "3", message: "Azithromycin expiring soon", time: "1 hour ago", type: "danger" },
  ];

  return (
    <header className="fixed top-0 left-24 right-0 h-16 bg-white border-b border-neutral-200 flex items-center px-8 gap-6 z-40">
      {/* Search */}
      <div className="flex-1 max-w-xl relative" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="search"
            placeholder="Search medicines, orders, pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="w-full pl-12 pr-10 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isSearchFocused && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden z-50">
            {searchResults.map((result) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => handleResultClick(result)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-neutral-50 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                  {getResultIcon(result.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-900 truncate">{result.title}</p>
                  <p className="text-sm text-neutral-500 truncate">{result.subtitle}</p>
                </div>
                <span className="text-xs text-neutral-400 capitalize">{result.type}</span>
              </button>
            ))}
          </div>
        )}

        {/* No Results */}
        {isSearchFocused && searchQuery && searchResults.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg p-6 text-center z-50">
            <Search size={24} className="mx-auto text-neutral-300 mb-2" />
            <p className="text-neutral-500">No results found for "{searchQuery}"</p>
          </div>
        )}
      </div>

      {/* AI Activity Indicator */}
      <AIActivityIndicator 
        message="AI analyzing" 
        isVisible={showAIIndicator}
        autoHide={true}
        autoHideDelay={2500}
      />

      {/* Mode Badge */}
      <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${
        mode === "HOSPITAL" 
          ? "bg-status-info/10 text-status-info border border-status-info/20"
          : "bg-primary-yellow/30 text-neutral-900 border border-primary-yellow/50"
      }`}>
        {mode} MODE
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-600 transition-colors relative"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-status-danger rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
                <h3 className="font-semibold text-neutral-900">Notifications</h3>
                <button className="text-xs text-primary-yellow-dark font-medium">Mark all read</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="px-4 py-3 hover:bg-neutral-50 border-b border-neutral-50 last:border-0">
                    <p className="text-sm text-neutral-900">{notif.message}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-neutral-500">
                      <Clock size={12} />
                      {notif.time}
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-neutral-100 text-center">
                <button className="text-sm text-primary-yellow-dark font-medium">View all</button>
              </div>
            </div>
          )}
        </div>

        <button className="w-10 h-10 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-600 transition-colors">
          <Grid3x3 size={20} />
        </button>

        {/* User Info */}
        <div className="flex items-center gap-2 pl-3 border-l border-neutral-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-neutral-900">{user?.name || "User"}</p>
            <p className="text-xs text-neutral-500">{user?.role || "Unknown"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
