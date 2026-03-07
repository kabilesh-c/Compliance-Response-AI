"use client";

import { Check } from "lucide-react";
import Link from "next/link";

export default function PricingSection() {
  return (
    <section className="py-20 bg-white" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-teal-dark mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Start small and scale as you grow. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Retail Plan */}
          <div className="p-8 rounded-3xl border border-neutral-200 bg-white hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Retail Pharmacy</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-primary-teal-dark">₹999</span>
              <span className="text-neutral-500">/month</span>
            </div>
            <p className="text-neutral-600 mb-8 text-sm">
              Everything a modern retail pharmacy needs to operate efficiently.
            </p>
            <Link
              href="/onboarding"
              className="block w-full py-3 px-6 bg-primary-teal text-white font-semibold rounded-xl text-center hover:bg-primary-teal-dark transition-colors mb-8"
            >
              Try for Free
            </Link>
            <ul className="space-y-4">
              {[
                "Unlimited SKUs",
                "Smart POS & Billing",
                "Inventory Management",
                "Basic AI Analytics",
                "WhatsApp Support"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-neutral-700">
                  <Check className="w-5 h-5 text-primary-teal flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Hospital Plan */}
          <div className="p-8 rounded-3xl border border-primary-teal bg-primary-mint/30 relative overflow-hidden">
            <div className="absolute top-4 right-4 px-3 py-1 bg-primary-teal text-white text-xs font-bold rounded-full">
              ENTERPRISE
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Hospital & Chains</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-primary-teal-dark">Custom</span>
            </div>
            <p className="text-neutral-600 mb-8 text-sm">
              Advanced features for multi-department hospitals and pharmacy chains.
            </p>
            <Link
              href="/contact"
              className="block w-full py-3 px-6 bg-white border border-primary-teal text-primary-teal font-semibold rounded-xl text-center hover:bg-primary-teal hover:text-white transition-colors mb-8"
            >
              Contact Sales
            </Link>
            <ul className="space-y-4">
              {[
                "Multi-location Support",
                "Department-wise Indents",
                "Advanced AI Forecasting",
                "API Access",
                "Dedicated Account Manager",
                "On-premise Deployment Option"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-neutral-700">
                  <Check className="w-5 h-5 text-primary-teal flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="text-center mt-8 text-neutral-500 text-sm">
          No credit card required for 14-day trial.
        </div>
      </div>
    </section>
  );
}
