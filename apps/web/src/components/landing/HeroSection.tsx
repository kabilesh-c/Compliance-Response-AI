"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import DashboardMockup from "./DashboardMockup";

export default function HeroSection() {
  const { scrollY } = useScroll();
  
  // Main wave: Starts deep (convex hero), flattens on scroll
  const wavePath = useTransform(
    scrollY,
    [0, 400],
    [
      "M0,120 C480,280 960,280 1440,120 L1440,320 L0,320 Z", // Deep curve
      "M0,120 C480,120 960,120 1440,120 L1440,320 L0,320 Z"  // Flat
    ]
  );

  // Secondary wave: Slightly different phase for depth
  const wavePathSecondary = useTransform(
    scrollY,
    [0, 400],
    [
      "M0,140 C480,260 960,260 1440,140 L1440,320 L0,320 Z",
      "M0,140 C480,140 960,140 1440,140 L1440,320 L0,320 Z"
    ]
  );

  return (
    <section className="relative pt-32 pb-32 lg:pt-48 lg:pb-48 overflow-hidden bg-gradient-to-br from-primary-hero-start to-primary-hero-end">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FF6154] rounded-full text-white font-medium text-sm shadow-sm hover:bg-[#ff4f40] transition-colors cursor-pointer">
                <span>We're live on Product Hunt</span>
                <ArrowRight size={14} className="-rotate-45" />
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full text-primary-dashboard-sidebar font-medium text-sm shadow-sm">
                <span className="w-2 h-2 rounded-full bg-primary-dashboard-sidebar"></span>
                Trusted by 1000+ pharmacies
              </div>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-neutral-900 leading-[1.15] tracking-tight">
              India’s First <span className="font-extrabold">Advanced</span> <br />
              Pharmacy Software <br />
              that is <span className="text-white">Truly Affordable</span>
            </h1>

            <div className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-lg">
              <p className="text-lg text-neutral-900 font-medium">
                The only thing we cut was the nonsense.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/onboarding"
                className="group px-8 py-4 bg-white text-primary-dashboard-sidebar font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2">
                <PlayCircle className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
          </motion.div>

          {/* Right Image - Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative lg:ml-10"
          >
             <DashboardMockup />
          </motion.div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
        <svg
          className="relative block w-full h-[100px] md:h-[160px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          {/* Background Wave Layer */}
          <motion.path
            fill="rgba(255,255,255,0.3)"
            d={wavePathSecondary}
          />

          {/* Foreground Wave Layer */}
          <motion.path
            fill="#ffffff"
            d={wavePath}
          />
        </svg>
      </div>
    </section>
  );
}
