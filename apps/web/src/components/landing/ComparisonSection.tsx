"use client";

import { motion } from "framer-motion";
import { Store, Building2, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ComparisonSection() {
  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-teal-dark mb-4">
            Tailored for Your Needs
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Whether you run a single pharmacy or a multi-specialty hospital, we have the right mode for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Retail Mode */}
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-neutral-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-teal/5 rounded-bl-full -mr-8 -mt-8" />
            
            <div className="w-14 h-14 bg-primary-mint rounded-2xl flex items-center justify-center text-primary-teal mb-6">
              <Store size={32} />
            </div>
            
            <h3 className="text-2xl font-bold text-primary-teal-dark mb-2">Retail Mode</h3>
            <p className="text-neutral-600 mb-8">Perfect for standalone pharmacies and retail chains.</p>
            
            <ul className="space-y-4 mb-8">
              {[
                "POS-centric workflow",
                "Fast-moving SKU management",
                "Daily reorder suggestions",
                "Staff-friendly simple UI",
                "Customer loyalty program"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-neutral-700">
                  <CheckCircle2 className="text-primary-teal w-5 h-5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/onboarding?mode=retail"
              className="w-full py-4 rounded-xl border-2 border-primary-teal text-primary-teal font-bold hover:bg-primary-teal hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              Start Retail Trial
              <ArrowRight size={18} />
            </Link>
          </motion.div>

          {/* Hospital Mode */}
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-gradient-to-br from-primary-teal-dark to-teal-900 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-8 -mt-8" />
            
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-primary-aqua-light mb-6 backdrop-blur-sm">
              <Building2 size={32} />
            </div>
            
            <h3 className="text-2xl font-bold mb-2">Hospital Mode</h3>
            <p className="text-teal-100 mb-8">Designed for hospitals, clinics, and medical colleges.</p>
            
            <ul className="space-y-4 mb-8">
              {[
                "OPD / ICU / Ward requests",
                "Bulk weekly ordering",
                "Central pharmacy control",
                "Approval workflows",
                "Department-wise consumption"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-teal-50">
                  <CheckCircle2 className="text-primary-aqua w-5 h-5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/onboarding?mode=hospital"
              className="w-full py-4 rounded-xl bg-primary-aqua text-white font-bold hover:bg-primary-aqua-light hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
            >
              Explore Hospital Solution
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
