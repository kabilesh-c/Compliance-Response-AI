"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain, Zap, MessageSquare, ShieldAlert } from "lucide-react";

const aiFeatures = [
  {
    icon: Brain,
    title: "Demand Forecasting",
    description: "AI predicts future sales trends to optimize stock levels.",
  },
  {
    icon: ShieldAlert,
    title: "FEFO Protection",
    description: "Smart algorithms prioritize near-expiry stock to minimize loss.",
  },
  {
    icon: Zap,
    title: "Agentic Automation",
    description: "Autonomous agents handle routine tasks and alerts.",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Alerts",
    description: "Instant notifications for low stock and daily reports.",
  },
];

export default function AIHighlights() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-teal-dark to-teal-900 text-white overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-teal/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-aqua/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-primary-aqua-light font-semibold text-sm mb-6 backdrop-blur-sm border border-white/10">
            <Sparkles size={16} />
            <span>Powered by Advanced AI</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Built with Intelligence, <br />
            <span className="text-primary-aqua-light">Designed for Scale</span>
          </h2>
          <p className="text-teal-100 max-w-2xl mx-auto text-lg">
            Harness the power of artificial intelligence to make smarter decisions and automate complex workflows.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aiFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary-teal to-primary-aqua rounded-xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                {feature.title}
                {index === 2 && (
                  <span className="px-2 py-0.5 bg-primary-aqua text-xs rounded-full text-white">New</span>
                )}
              </h3>
              <p className="text-teal-100 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
