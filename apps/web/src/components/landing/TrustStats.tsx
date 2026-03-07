"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Users, Building2, Pill, Phone } from "lucide-react";

const stats = [
  { 
    label: "Pharmacies", 
    value: 1000, 
    suffix: "+", 
    growth: "+185%",
    icon: Users,
    chartPath: "M0,25 C20,25 20,10 40,15 C60,20 60,5 80,0 L80,30 L0,30 Z"
  },
  { 
    label: "Distributors", 
    value: 250, 
    suffix: "+", 
    growth: "+400%",
    icon: Building2,
    chartPath: "M0,25 C30,25 30,15 50,10 C70,5 70,10 80,0 L80,30 L0,30 Z"
  },
  { 
    label: "Drugs", 
    value: 6, 
    suffix: " Lakh+", 
    growth: "+200%",
    icon: Pill,
    chartPath: "M0,28 C20,25 40,20 50,15 C60,10 70,5 80,0 L80,30 L0,30 Z"
  },
  { 
    label: "Support Hours", 
    value: 4200, 
    suffix: "+", 
    growth: "+400%",
    icon: Phone,
    chartPath: "M0,25 C20,25 30,20 50,15 C60,10 70,5 80,0 L80,30 L0,30 Z"
  },
];

const CountUp = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const stepTime = duration / steps;
      let current = 0;
      const increment = value / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export default function TrustStats() {
  return (
    <section className="py-16 bg-white relative z-20 -mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              {/* Top Row */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-neutral-50 rounded-lg text-neutral-700 group-hover:text-primary-teal transition-colors">
                    <stat.icon size={20} />
                  </div>
                  <span className="font-semibold text-neutral-600">{stat.label}</span>
                </div>
                <div className="px-2 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">
                  {stat.growth}
                </div>
              </div>

              {/* Bottom Row */}
              <div className="flex justify-between items-end">
                <div className="text-3xl font-bold text-neutral-900">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </div>
                
                {/* Mini Chart */}
                <div className="w-24 h-12 relative">
                  <svg 
                    viewBox="0 0 80 30" 
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0D9488" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#0D9488" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d={stat.chartPath}
                      fill={`url(#gradient-${index})`}
                      stroke="#0D9488"
                      strokeWidth="2"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
