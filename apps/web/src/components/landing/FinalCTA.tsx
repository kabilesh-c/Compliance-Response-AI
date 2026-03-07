"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary-teal-dark to-teal-900 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-teal/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary-aqua/30 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Ready to Transform Your <br /> Pharmacy Operations?
        </h2>
        <p className="text-teal-100 text-lg mb-10 max-w-2xl mx-auto">
          Join thousands of pharmacists who are saving time, reducing waste, and growing their business with PharmaOS.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto px-8 py-4 bg-white text-primary-teal-dark font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Start Free Trial
            <ArrowRight size={20} />
          </Link>
          <Link
            href="/demo"
            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300"
          >
            Book a Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
