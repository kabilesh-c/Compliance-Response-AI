"use client";

import { useState } from "react";
import { 
  User, Building2, Shield, Bell, Palette, Database,
  Save, Eye, EyeOff, Mail, Phone, MapPin, Camera,
  Store, Hospital, Users, Lock, Key, ChevronRight, Brain, Sparkles,
  TrendingUp, Package, Calendar, Bot, AlertCircle, HelpCircle
} from "lucide-react";
import { useAuthStore, UserRole, SystemMode } from "@/stores/authStore";

type SettingsTab = "profile" | "organization" | "roles" | "notifications" | "appearance" | "ai" | "system";

const tabs: { id: SettingsTab; label: string; icon: typeof User; adminOnly?: boolean; isAI?: boolean }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "organization", label: "Organization", icon: Building2 },
  { id: "roles", label: "Roles & Access", icon: Shield, adminOnly: true },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "ai", label: "AI Settings", icon: Brain, isAI: true },
  { id: "system", label: "System", icon: Database, adminOnly: true },
];

const rolePermissions: { [key in UserRole]: { page: string; access: boolean }[] } = {
  ADMIN: [
    { page: "Dashboard", access: true },
    { page: "POS", access: true },
    { page: "Inventory", access: true },
    { page: "Analytics", access: true },
    { page: "Automation", access: true },
    { page: "Settings", access: true },
  ],
  MANAGER: [
    { page: "Dashboard", access: true },
    { page: "POS", access: true },
    { page: "Inventory", access: true },
    { page: "Analytics", access: true },
    { page: "Automation", access: true },
    { page: "Settings", access: true },
  ],
  PHARMACIST: [
    { page: "Dashboard", access: true },
    { page: "POS", access: true },
    { page: "Inventory", access: true },
    { page: "Analytics", access: false },
    { page: "Automation", access: false },
    { page: "Settings", access: false },
  ],
  PROCUREMENT: [
    { page: "Dashboard", access: true },
    { page: "POS", access: false },
    { page: "Inventory", access: true },
    { page: "Analytics", access: true },
    { page: "Automation", access: false },
    { page: "Settings", access: true },
  ],
};

export default function SettingsPage() {
  const { user, mode, setMode, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [previewRole, setPreviewRole] = useState<UserRole | null>(null);

  const isAdmin = user?.role === "ADMIN";
  const isManagerOrAdmin = user?.role === "ADMIN" || user?.role === "MANAGER";

  const visibleTabs = tabs.filter(tab => !tab.adminOnly || isAdmin);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-500">Manage your account and application preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-neutral-200 p-2">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left
                    ${isActive 
                      ? "bg-primary-yellow text-neutral-900" 
                      : "text-neutral-600 hover:bg-neutral-50"
                    }
                  `}
                >
                  <Icon size={18} />
                  <span className="font-medium flex-1">{tab.label}</span>
                  {tab.isAI && (
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive ? "bg-neutral-900 text-primary-yellow" : "bg-primary-yellow text-neutral-900"
                    }`}>
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-6">
              <h2 className="text-lg font-semibold text-neutral-900">Profile Information</h2>
              
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary-yellow flex items-center justify-center text-3xl font-bold text-neutral-900">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                    <Camera size={16} />
                    Change Photo
                  </button>
                  <p className="text-xs text-neutral-500 mt-1">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name || ""}
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="email"
                      defaultValue={user?.email || ""}
                      className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="tel"
                      defaultValue="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Role</label>
                  <div className="px-4 py-2.5 border border-neutral-200 rounded-xl bg-neutral-50 text-neutral-600">
                    {user?.role || "Unknown"}
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="pt-4 border-t border-neutral-100">
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Current Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">New Password</label>
                    <div className="relative">
                      <Key size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-primary-yellow text-neutral-900 rounded-xl font-medium hover:bg-primary-yellow-dark transition-colors">
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Organization Tab */}
          {activeTab === "organization" && (
            <div className="space-y-6">
              {/* Mode Switch */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">System Mode</h2>
                <p className="text-sm text-neutral-500 mb-4">
                  Switch between Retail and Hospital modes to customize the interface
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => isManagerOrAdmin && setMode("RETAIL")}
                    disabled={!isManagerOrAdmin}
                    className={`
                      p-4 rounded-2xl border-2 transition-all text-left
                      ${mode === "RETAIL" 
                        ? "border-primary-yellow bg-primary-yellow/5" 
                        : "border-neutral-200 hover:border-neutral-300"
                      }
                      ${!isManagerOrAdmin ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        mode === "RETAIL" ? "bg-primary-yellow" : "bg-neutral-100"
                      }`}>
                        <Store size={20} className={mode === "RETAIL" ? "text-neutral-900" : "text-neutral-500"} />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900">Retail Mode</p>
                        <p className="text-xs text-neutral-500">For standalone pharmacies</p>
                      </div>
                    </div>
                    <ul className="text-sm text-neutral-600 space-y-1 ml-13">
                      <li>• Walk-in customer focus</li>
                      <li>• OTC medicines priority</li>
                      <li>• Simple billing</li>
                    </ul>
                  </button>

                  <button
                    onClick={() => isManagerOrAdmin && setMode("HOSPITAL")}
                    disabled={!isManagerOrAdmin}
                    className={`
                      p-4 rounded-2xl border-2 transition-all text-left
                      ${mode === "HOSPITAL" 
                        ? "border-primary-yellow bg-primary-yellow/5" 
                        : "border-neutral-200 hover:border-neutral-300"
                      }
                      ${!isManagerOrAdmin ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        mode === "HOSPITAL" ? "bg-primary-yellow" : "bg-neutral-100"
                      }`}>
                        <Hospital size={20} className={mode === "HOSPITAL" ? "text-neutral-900" : "text-neutral-500"} />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900">Hospital Mode</p>
                        <p className="text-xs text-neutral-500">For hospital pharmacies</p>
                      </div>
                    </div>
                    <ul className="text-sm text-neutral-600 space-y-1 ml-13">
                      <li>• Ward/Department support</li>
                      <li>• Prescription integration</li>
                      <li>• Patient records</li>
                    </ul>
                  </button>
                </div>
              </div>

              {/* Organization Details */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Organization Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Organization Name</label>
                    <input
                      type="text"
                      defaultValue="MedCare Pharmacy"
                      disabled={!isAdmin}
                      className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-yellow disabled:bg-neutral-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">License Number</label>
                    <input
                      type="text"
                      defaultValue="PH-2024-123456"
                      disabled={!isAdmin}
                      className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-yellow disabled:bg-neutral-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Address</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3 top-3 text-neutral-400" />
                      <textarea
                        rows={2}
                        defaultValue="123 Health Street, Medical District, Mumbai 400001"
                        disabled={!isAdmin}
                        className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-yellow disabled:bg-neutral-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Roles Tab (Admin Only) */}
          {activeTab === "roles" && isAdmin && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900">Role Permissions</h2>
                    <p className="text-sm text-neutral-500">View access levels for each role</p>
                  </div>
                  <select
                    value={previewRole || ""}
                    onChange={(e) => setPreviewRole(e.target.value as UserRole || null)}
                    className="px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                  >
                    <option value="">Select role to preview</option>
                    <option value="ADMIN">Admin</option>
                    <option value="MANAGER">Manager</option>
                    <option value="PHARMACIST">Pharmacist</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(["ADMIN", "MANAGER", "PHARMACIST"] as UserRole[]).map((role) => (
                    <div 
                      key={role} 
                      className={`rounded-xl border-2 p-4 ${
                        previewRole === role ? "border-primary-yellow bg-primary-yellow/5" : "border-neutral-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Users size={18} className="text-neutral-500" />
                        <span className="font-semibold text-neutral-900">{role}</span>
                      </div>
                      <div className="space-y-2">
                        {rolePermissions[role].map((perm) => (
                          <div key={perm.page} className="flex items-center justify-between text-sm">
                            <span className="text-neutral-600">{perm.page}</span>
                            {perm.access ? (
                              <span className="text-status-success">✓</span>
                            ) : (
                              <span className="text-status-danger">✕</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Members */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-neutral-900">Team Members</h2>
                  <button className="text-sm text-primary-yellow-dark font-medium hover:underline">
                    + Add Member
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Admin User", email: "admin@pharmacy.com", role: "ADMIN" },
                    { name: "Manager User", email: "manager@pharmacy.com", role: "MANAGER" },
                    { name: "Pharmacist User", email: "pharmacist@pharmacy.com", role: "PHARMACIST" },
                  ].map((member) => (
                    <div key={member.email} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-yellow flex items-center justify-center font-semibold text-neutral-900">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">{member.name}</p>
                          <p className="text-sm text-neutral-500">{member.email}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        member.role === "ADMIN" ? "bg-status-danger/10 text-status-danger" :
                        member.role === "MANAGER" ? "bg-status-warning/10 text-status-warning" :
                        "bg-status-info/10 text-status-info"
                      }`}>
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-6">Notification Preferences</h2>
              
              <div className="space-y-4">
                {[
                  { label: "Low Stock Alerts", description: "Get notified when stock falls below minimum", enabled: true },
                  { label: "Expiry Warnings", description: "Alerts for medicines expiring soon", enabled: true },
                  { label: "Order Updates", description: "Purchase order status changes", enabled: true },
                  { label: "Daily Summary", description: "End of day sales and inventory summary", enabled: false },
                  { label: "Weekly Reports", description: "Comprehensive weekly analytics", enabled: true },
                ].map((pref) => (
                  <div key={pref.label} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                    <div>
                      <p className="font-medium text-neutral-900">{pref.label}</p>
                      <p className="text-sm text-neutral-500">{pref.description}</p>
                    </div>
                    <button className={`w-12 h-6 rounded-full relative transition-colors ${
                      pref.enabled ? "bg-status-success" : "bg-neutral-300"
                    }`}>
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                        pref.enabled ? "right-0.5" : "left-0.5"
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === "appearance" && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-6">Appearance Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "light", label: "Light", active: true },
                      { id: "dark", label: "Dark", active: false },
                      { id: "system", label: "System", active: false },
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        className={`p-4 rounded-xl border-2 transition-colors ${
                          theme.active ? "border-primary-yellow bg-primary-yellow/5" : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <div className={`w-full h-16 rounded-lg mb-2 ${
                          theme.id === "dark" ? "bg-neutral-800" : "bg-neutral-100"
                        }`} />
                        <p className="text-sm font-medium text-neutral-900">{theme.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">Accent Color</label>
                  <div className="flex gap-3">
                    {["#FFDE4D", "#22C55E", "#3B82F6", "#8B5CF6", "#EF4444"].map((color) => (
                      <button
                        key={color}
                        className={`w-10 h-10 rounded-full border-2 ${
                          color === "#FFDE4D" ? "border-neutral-900" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Settings Tab */}
          {activeTab === "ai" && (
            <div className="space-y-6">
              {/* AI Overview */}
              <div className="bg-gradient-to-r from-primary-yellow/20 to-primary-yellow/10 rounded-2xl p-6 border border-primary-yellow/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-yellow flex items-center justify-center">
                    <Brain size={24} className="text-neutral-900" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-neutral-900">AI Intelligence Settings</h2>
                    <p className="text-sm text-neutral-600 mt-1">
                      Configure how AI assists with inventory management, demand forecasting, and automation. 
                      All AI features use on-device processing for your privacy.
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="flex items-center gap-1 text-status-success">
                        <span className="w-2 h-2 bg-status-success rounded-full animate-pulse" />
                        AI Active
                      </span>
                      <span className="text-neutral-500">94% accuracy this month</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Features Toggles */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-6">AI Features</h3>
                
                <div className="space-y-4">
                  {[
                    { 
                      id: "demand-forecasting",
                      label: "Demand Forecasting", 
                      description: "Predict future demand based on historical sales, seasonality, and trends",
                      icon: TrendingUp,
                      enabled: true,
                      impact: "Reduced stockouts by 87%"
                    },
                    { 
                      id: "auto-reorder",
                      label: "Auto Reorder Suggestions", 
                      description: "AI-generated purchase order recommendations based on predicted demand",
                      icon: Package,
                      enabled: true,
                      impact: "₹45,000 saved this month"
                    },
                    { 
                      id: "expiry-monitoring",
                      label: "Smart Expiry Monitoring", 
                      description: "Proactive alerts and discount suggestions for expiring inventory",
                      icon: Calendar,
                      enabled: true,
                      impact: "60% less wastage"
                    },
                    { 
                      id: "substitute-suggestions",
                      label: "Smart Substitute Suggestions", 
                      description: "Recommend alternatives during POS when items are low or out of stock",
                      icon: Sparkles,
                      enabled: true,
                      impact: "15% fewer lost sales"
                    },
                    { 
                      id: "autonomous-agents",
                      label: "Autonomous AI Agents", 
                      description: "Allow AI agents to take automated actions without manual approval",
                      icon: Bot,
                      enabled: false,
                      warning: "Requires Manager/Admin review for critical actions"
                    },
                  ].map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <div key={feature.id} className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          feature.enabled ? "bg-primary-yellow/20 text-primary-yellow-dark" : "bg-neutral-200 text-neutral-400"
                        }`}>
                          <Icon size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-neutral-900">{feature.label}</p>
                            {feature.warning && (
                              <span className="group relative">
                                <AlertCircle size={14} className="text-status-warning cursor-help" />
                                <span className="absolute left-0 top-full mt-1 px-2 py-1.5 text-xs bg-neutral-800 text-white rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                  {feature.warning}
                                </span>
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-neutral-500 mb-2">{feature.description}</p>
                          {feature.impact && feature.enabled && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-status-success/10 text-status-success rounded-full text-xs font-medium">
                              <Sparkles size={10} />
                              {feature.impact}
                            </span>
                          )}
                        </div>
                        <button className={`w-12 h-6 rounded-full relative transition-colors ${
                          feature.enabled ? "bg-status-success" : "bg-neutral-300"
                        }`}>
                          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                            feature.enabled ? "right-0.5" : "left-0.5"
                          }`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI Confidence Thresholds */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">Confidence Thresholds</h3>
                    <p className="text-sm text-neutral-500">Minimum AI confidence required for recommendations</p>
                  </div>
                  <span className="group relative">
                    <HelpCircle size={18} className="text-neutral-400 cursor-help" />
                    <span className="absolute right-0 top-full mt-1 px-3 py-2 text-xs bg-neutral-800 text-white rounded-lg w-64 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      Higher thresholds mean fewer but more accurate suggestions. Lower thresholds provide more suggestions but with less certainty.
                    </span>
                  </span>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-neutral-700">Reorder Suggestions</label>
                      <span className="text-sm font-bold text-neutral-900">80%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="95"
                      defaultValue="80"
                      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-yellow"
                    />
                    <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                      <span>More suggestions</span>
                      <span>Higher accuracy</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-neutral-700">Substitute Recommendations</label>
                      <span className="text-sm font-bold text-neutral-900">75%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="95"
                      defaultValue="75"
                      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-yellow"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-neutral-700">Demand Predictions</label>
                      <span className="text-sm font-bold text-neutral-900">85%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="95"
                      defaultValue="85"
                      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-yellow"
                    />
                  </div>
                </div>
              </div>

              {/* AI Learning */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">AI Learning</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-neutral-50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-neutral-900">2,340</p>
                    <p className="text-sm text-neutral-500">Decisions analyzed</p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-status-success">94%</p>
                    <p className="text-sm text-neutral-500">Prediction accuracy</p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-neutral-900">6 mo</p>
                    <p className="text-sm text-neutral-500">Training data</p>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 mt-4">
                  AI models are continuously learning from your inventory patterns. More data improves prediction accuracy.
                </p>
              </div>
            </div>
          )}

          {/* System Tab (Admin Only) */}
          {activeTab === "system" && isAdmin && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">System Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-neutral-50 rounded-xl">
                    <p className="text-sm text-neutral-500">Version</p>
                    <p className="font-semibold text-neutral-900">1.0.0</p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-xl">
                    <p className="text-sm text-neutral-500">Last Updated</p>
                    <p className="font-semibold text-neutral-900">Today</p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-xl">
                    <p className="text-sm text-neutral-500">Database</p>
                    <p className="font-semibold text-status-success">Connected</p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-xl">
                    <p className="text-sm text-neutral-500">API Status</p>
                    <p className="font-semibold text-status-success">Healthy</p>
                  </div>
                </div>
              </div>

              <div className="bg-status-danger/5 border border-status-danger/20 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-status-danger mb-2">Danger Zone</h2>
                <p className="text-sm text-neutral-600 mb-4">These actions are irreversible. Please proceed with caution.</p>
                <div className="flex gap-3">
                  <button className="px-4 py-2 border border-status-danger text-status-danger rounded-xl font-medium hover:bg-status-danger/10 transition-colors">
                    Clear Cache
                  </button>
                  <button className="px-4 py-2 bg-status-danger text-white rounded-xl font-medium hover:bg-status-danger/90 transition-colors">
                    Reset System
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
