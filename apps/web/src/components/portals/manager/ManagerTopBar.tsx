"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Bell, ChevronDown, Crown, Brain, Clock, X, Package, ShoppingCart, FileText } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import OfflineIndicator from "@/components/ui/OfflineIndicator";

interface SearchResult {
  id: string;
  type: "medicine" | "order" | "page";
  title: string;
  subtitle: string;
  href: string;
}

export default function ManagerTopBar() {
  const { user, mode } = useAuthStore();
  const router = useRouter();
  const [notificationCount] = useState(5);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock Search Logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    // Mock results
    setSearchResults([
      { id: "1", type: "medicine", title: "Paracetamol", subtitle: "Stock: 500", href: "/manager/inventory" },
      { id: "2", type: "order", title: "Order #1234", subtitle: "Pending Approval", href: "/manager" },
    ]);
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

  return (
    <header className="fixed top-0 left-24 right-0 h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 z-40">
      <OfflineIndicator />
      
      {/* Left Section - Portal Badge */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-yellow/20 text-primary-yellow-dark rounded-full">
          <Crown size={16} />
          <span className="text-sm font-semibold">Manager Portal</span>
        </div>
        <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full">
          {mode} Mode
        </span>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-xl mx-8 relative" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search inventory, orders, analytics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-yellow/30 focus:border-primary-yellow transition-all"
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
                  {result.type === "medicine" ? <Package size={16} /> : <ShoppingCart size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-900 truncate">{result.title}</p>
                  <p className="text-sm text-neutral-500 truncate">{result.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* AI Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-status-success/10 rounded-full">
          <Brain size={14} className="text-status-success" />
          <span className="text-xs font-medium text-status-success">AI Active</span>
        </div>

        {/* Pending Approvals */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-status-warning/10 rounded-full">
          <Clock size={14} className="text-status-warning" />
          <span className="text-xs font-medium text-status-warning">3 Pending</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center hover:bg-neutral-100 transition-colors"
          >
            <Bell size={18} className="text-neutral-600" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-status-danger text-white text-xs font-bold rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
                <h3 className="font-semibold text-neutral-900">Notifications</h3>
                <button className="text-xs text-primary-yellow-dark font-medium">Mark all read</button>
              </div>
              <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                <div className="p-3 hover:bg-neutral-50 rounded-lg cursor-pointer">
                  <p className="text-sm font-medium text-neutral-900">Low Stock Alert</p>
                  <p className="text-xs text-neutral-500">Paracetamol is below threshold</p>
                </div>
                <div className="p-3 hover:bg-neutral-50 rounded-lg cursor-pointer">
                  <p className="text-sm font-medium text-neutral-900">New Order Request</p>
                  <p className="text-xs text-neutral-500">Order #1234 needs approval</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <button className="flex items-center gap-3 px-3 py-1.5 hover:bg-neutral-50 rounded-full transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary-yellow flex items-center justify-center text-neutral-900 font-semibold text-sm">
            {user?.name?.charAt(0).toUpperCase() || "M"}
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-neutral-900">{user?.name || "Manager"}</div>
            <div className="text-xs text-neutral-500">Manager</div>
          </div>
          <ChevronDown size={16} className="text-neutral-400" />
        </button>
      </div>
    </header>
  );
}
