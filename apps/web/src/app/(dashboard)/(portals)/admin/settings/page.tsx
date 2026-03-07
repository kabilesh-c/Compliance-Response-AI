"use client";

import { useState } from "react";
import { Settings, Bell, Lock, Database, Globe, Save, Shield, Mail, Smartphone, Cloud, RefreshCw, ToggleLeft, ToggleRight, Check } from "lucide-react";

export default function HospitalSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    whatsapp: true,
    lowStock: true,
    expiry: true,
    security: true
  });

  const tabs = [
    { id: "general", icon: Globe, label: "General", desc: "Hospital details & localization" },
    { id: "notifications", icon: Bell, label: "Notifications", desc: "Alert preferences & channels" },
    { id: "security", icon: Lock, label: "Security", desc: "Access control & authentication" },
    { id: "data", icon: Database, label: "Data & Backup", desc: "Storage & retention policies" },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">System Settings</h1>
          <p className="text-neutral-600 mt-1">Configure hospital-wide parameters and preferences</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-primary-blue text-white rounded-button font-medium hover:bg-primary-blue-dark transition-colors shadow-lg shadow-primary-blue/20">
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Settings Navigation */}
        <div className="col-span-3 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-start gap-3 p-4 rounded-card text-left transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-white shadow-card border-l-4 border-primary-blue"
                  : "hover:bg-white/50 text-neutral-600"
              }`}
            >
              <div className={`p-2 rounded-lg ${activeTab === tab.id ? "bg-primary-blue/10 text-primary-blue" : "bg-neutral-100 text-neutral-500"}`}>
                <tab.icon size={20} />
              </div>
              <div>
                <div className={`font-semibold ${activeTab === tab.id ? "text-neutral-900" : "text-neutral-700"}`}>
                  {tab.label}
                </div>
                <div className="text-xs text-neutral-500 mt-0.5">{tab.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="col-span-9 space-y-6">
          {activeTab === "general" && (
            <div className="bg-white rounded-card shadow-card p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-100">
                <div className="w-10 h-10 rounded-full bg-primary-blue/10 flex items-center justify-center text-primary-blue">
                  <Globe size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">General Configuration</h2>
                  <p className="text-sm text-neutral-500">Manage basic hospital information</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Hospital Name</label>
                  <input type="text" defaultValue="City General Hospital" className="w-full px-4 py-2.5 rounded-button border border-neutral-200 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">License Number</label>
                  <input type="text" defaultValue="HOSP-2024-8892" className="w-full px-4 py-2.5 rounded-button border border-neutral-200 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Contact Email</label>
                  <input type="email" defaultValue="admin@citygeneral.com" className="w-full px-4 py-2.5 rounded-button border border-neutral-200 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Emergency Phone</label>
                  <input type="tel" defaultValue="+1 (555) 0123-4567" className="w-full px-4 py-2.5 rounded-button border border-neutral-200 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Timezone</label>
                  <select className="w-full px-4 py-2.5 rounded-button border border-neutral-200 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition-all">
                    <option>(GMT-05:00) Eastern Time</option>
                    <option>(GMT-08:00) Pacific Time</option>
                    <option>(GMT+00:00) UTC</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Currency</label>
                  <select className="w-full px-4 py-2.5 rounded-button border border-neutral-200 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition-all">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white rounded-card shadow-card p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-100">
                <div className="w-10 h-10 rounded-full bg-status-warning/10 flex items-center justify-center text-status-warning">
                  <Bell size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">Notification Preferences</h2>
                  <p className="text-sm text-neutral-500">Manage how and when you receive alerts</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Channels</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: "email", icon: Mail, label: "Email Alerts", desc: "Daily summaries & critical alerts" },
                      { id: "sms", icon: Smartphone, label: "SMS Notifications", desc: "Urgent security alerts only" },
                      { id: "whatsapp", icon: Smartphone, label: "WhatsApp", desc: "Real-time operational updates" },
                    ].map((channel) => (
                      <div key={channel.id} className="p-4 rounded-button border border-neutral-200 flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 text-neutral-500"><channel.icon size={18} /></div>
                          <div>
                            <div className="font-semibold text-neutral-900">{channel.label}</div>
                            <div className="text-xs text-neutral-500 mt-1">{channel.desc}</div>
                          </div>
                        </div>
                        <button 
                          onClick={() => setNotifications(prev => ({ ...prev, [channel.id]: !prev[channel.id as keyof typeof prev] }))}
                          className={`text-2xl transition-colors ${notifications[channel.id as keyof typeof notifications] ? "text-primary-blue" : "text-neutral-300"}`}
                        >
                          {notifications[channel.id as keyof typeof notifications] ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-neutral-100">
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Alert Triggers</h3>
                  <div className="space-y-3">
                    {[
                      { id: "lowStock", label: "Low Stock Alerts", desc: "Notify when inventory drops below reorder point" },
                      { id: "expiry", label: "Expiry Warnings", desc: "Notify 30 days before medicine expiration" },
                      { id: "security", label: "Security Alerts", desc: "Notify on suspicious login attempts" },
                    ].map((trigger) => (
                      <div key={trigger.id} className="flex items-center justify-between p-3 hover:bg-neutral-50 rounded-lg transition-colors">
                        <div>
                          <div className="font-medium text-neutral-900">{trigger.label}</div>
                          <div className="text-sm text-neutral-500">{trigger.desc}</div>
                        </div>
                        <button 
                          onClick={() => setNotifications(prev => ({ ...prev, [trigger.id]: !prev[trigger.id as keyof typeof prev] }))}
                          className={`text-2xl transition-colors ${notifications[trigger.id as keyof typeof notifications] ? "text-primary-blue" : "text-neutral-300"}`}
                        >
                          {notifications[trigger.id as keyof typeof notifications] ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white rounded-card shadow-card p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-100">
                <div className="w-10 h-10 rounded-full bg-status-danger/10 flex items-center justify-center text-status-danger">
                  <Shield size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">Security Settings</h2>
                  <p className="text-sm text-neutral-500">Manage access control and authentication</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-neutral-50 rounded-button border border-neutral-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-neutral-900">Two-Factor Authentication (2FA)</h3>
                      <p className="text-sm text-neutral-500">Require 2FA for all admin accounts</p>
                    </div>
                    <div className="px-3 py-1 bg-status-success/10 text-status-success text-xs font-bold rounded-full flex items-center gap-1">
                      <Check size={12} /> Enabled
                    </div>
                  </div>
                  <button className="text-sm text-primary-blue font-medium hover:underline">Configure 2FA Methods</button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700">Session Timeout</label>
                    <select className="w-full px-4 py-2.5 rounded-button border border-neutral-200 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition-all">
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>4 hours</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700">Password Expiry</label>
                    <select className="w-full px-4 py-2.5 rounded-button border border-neutral-200 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition-all">
                      <option>Every 30 days</option>
                      <option>Every 60 days</option>
                      <option>Every 90 days</option>
                      <option>Never</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100">
                  <h3 className="font-bold text-neutral-900 mb-4">Active Sessions</h3>
                  <div className="space-y-3">
                    {[
                      { device: "Windows PC - Chrome", location: "New York, USA", time: "Current Session", active: true },
                      { device: "MacBook Pro - Safari", location: "New York, USA", time: "2 hours ago", active: false },
                    ].map((session, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white border border-neutral-100 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${session.active ? "bg-status-success" : "bg-neutral-300"}`} />
                          <div>
                            <div className="font-medium text-neutral-900">{session.device}</div>
                            <div className="text-xs text-neutral-500">{session.location} • {session.time}</div>
                          </div>
                        </div>
                        {!session.active && (
                          <button className="text-xs text-status-danger hover:underline">Revoke</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "data" && (
            <div className="bg-white rounded-card shadow-card p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-100">
                <div className="w-10 h-10 rounded-full bg-primary-purple/10 flex items-center justify-center text-primary-purple">
                  <Database size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">Data Management</h2>
                  <p className="text-sm text-neutral-500">Backup, restore, and retention settings</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-neutral-50 rounded-button border border-neutral-200">
                    <div className="flex items-center gap-2 mb-2 text-neutral-900 font-semibold">
                      <Cloud size={18} />
                      Cloud Backup
                    </div>
                    <div className="text-2xl font-bold text-neutral-900 mb-1">Daily</div>
                    <div className="text-xs text-neutral-500">Last backup: 2 hours ago</div>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-button border border-neutral-200">
                    <div className="flex items-center gap-2 mb-2 text-neutral-900 font-semibold">
                      <Database size={18} />
                      Storage Used
                    </div>
                    <div className="text-2xl font-bold text-neutral-900 mb-1">45.2 GB</div>
                    <div className="text-xs text-neutral-500">of 1 TB allocated</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-neutral-900">Retention Policy</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                      <span className="text-neutral-700">Patient Records</span>
                      <select className="bg-transparent text-sm font-medium text-neutral-900 outline-none">
                        <option>10 Years</option>
                        <option>Indefinite</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                      <span className="text-neutral-700">Transaction Logs</span>
                      <select className="bg-transparent text-sm font-medium text-neutral-900 outline-none">
                        <option>5 Years</option>
                        <option>7 Years</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex gap-4">
                  <button className="flex-1 py-2.5 border border-neutral-300 rounded-button text-neutral-700 font-medium hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2">
                    <RefreshCw size={16} />
                    Backup Now
                  </button>
                  <button className="flex-1 py-2.5 border border-status-danger/30 text-status-danger rounded-button font-medium hover:bg-status-danger/5 transition-colors">
                    Purge Old Data
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
