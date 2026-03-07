"use client";

import { motion } from "framer-motion";
import { 
  PackageCheck, 
  AlertTriangle, 
  Truck, 
  Receipt, 
  LineChart, 
  ShieldCheck, 
  FileText,
  Users
} from "lucide-react";

const features = [
  {
    icon: PackageCheck,
    title: "Inventory & Stock",
    description: "Real-time tracking across multiple locations with batch-wise management.",
  },
  {
    icon: AlertTriangle,
    title: "Expiry Alerts",
    description: "FEFO-based tracking prevents expired stock and reduces wastage.",
  },
  {
    icon: Truck,
    title: "Supplier Management",
    description: "Automated purchase orders and supplier performance tracking.",
  },
  {
    icon: Receipt,
    title: "Smart POS",
    description: "Fast billing with barcode scanning and integrated digital payments.",
  },
  {
    icon: LineChart,
    title: "AI Sales Analytics",
    description: "Predictive insights to optimize stock levels and increase profitability.",
  },
  {
    icon: Users,
    title: "Role-Based Access",
    description: "Secure access controls for Admins, Managers, and Pharmacists.",
  },
  {
    icon: FileText,
    title: "GST Invoicing",
    description: "Compliant tax reports and automated GST filing assistance.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with daily backups and data encryption.",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-teal-dark mb-4">
            Everything You Need to Scale
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Powerful features designed to streamline operations and boost efficiency.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-6 bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-primary-mint rounded-xl flex items-center justify-center text-primary-teal mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-primary-teal-dark mb-2">
                {feature.title}
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
