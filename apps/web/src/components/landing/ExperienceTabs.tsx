"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, BarChart3, Bot, Package } from "lucide-react";
import { InventoryMockup, POSMockup, AIMockup, AnalyticsMockup } from "./FeatureMockups";

const tabs = [
  {
    id: "inventory",
    label: "Inventory",
    icon: Package,
    title: "Smart Inventory Management",
    description: "Real-time tracking, expiry alerts, and automated reordering based on predictive demand.",
    color: "bg-blue-500",
    component: InventoryMockup,
  },
  {
    id: "pos",
    label: "POS",
    icon: ShoppingCart,
    title: "Lightning Fast Billing",
    description: "Process sales in seconds with our AI-assisted POS. Integrated with GST and digital payments.",
    color: "bg-green-500",
    component: POSMockup,
  },
  {
    id: "ai",
    label: "AI Automation",
    icon: Bot,
    title: "Intelligent Automation",
    description: "Let AI handle routine tasks like purchase orders, stock transfers, and customer notifications.",
    color: "bg-purple-500",
    component: AIMockup,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    title: "Deep Business Insights",
    description: "Visualize your growth with actionable insights on sales, margins, and staff performance.",
    color: "bg-orange-500",
    component: AnalyticsMockup,
  },
];

export default function ExperienceTabs() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <section className="py-20 bg-neutral-50" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-teal-dark mb-4">
            Experience the Future of Pharmacy
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Everything you need to run a modern pharmacy, integrated into one seamless platform.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Tabs Navigation */}
          <div className="lg:w-1/3 space-y-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onMouseEnter={() => setActiveTab(tab.id)}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left p-6 rounded-xl transition-all duration-300 flex items-center gap-4 group ${
                  activeTab === tab.id
                    ? "bg-white shadow-lg border-l-4 border-primary-teal"
                    : "hover:bg-white/50"
                }`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    activeTab === tab.id
                      ? "bg-primary-teal text-white"
                      : "bg-neutral-100 text-neutral-500 group-hover:bg-primary-teal/10 group-hover:text-primary-teal"
                  }`}
                >
                  <tab.icon size={24} />
                </div>
                <div>
                  <h3
                    className={`font-semibold text-lg ${
                      activeTab === tab.id ? "text-primary-teal-dark" : "text-neutral-600"
                    }`}
                  >
                    {tab.label}
                  </h3>
                  {activeTab === tab.id && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-sm text-neutral-500 mt-1"
                    >
                      {tab.title}
                    </motion.p>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="lg:w-2/3 relative min-h-[500px]">
            <AnimatePresence mode="wait">
              {tabs.map((tab) =>
                tab.id === activeTab ? (
                  <motion.div
                    key={tab.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <div className="h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-100 flex flex-col">
                      <div className="p-6 border-b border-neutral-100 bg-gradient-to-r from-neutral-50 to-white">
                        <h3 className="text-xl font-bold text-primary-teal-dark mb-1">
                          {tab.title}
                        </h3>
                        <p className="text-sm text-neutral-600">{tab.description}</p>
                      </div>
                      <div className="flex-1 bg-neutral-100 relative group overflow-hidden">
                        <tab.component />
                      </div>
                    </div>
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
