"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Owner",
    org: "Apollo Pharmacy Franchise",
    content: "The AI expiry alerts saved us over ₹50,000 in the first month alone. Highly recommended!",
    rating: 5,
  },
  {
    name: "Dr. Sarah Thomas",
    role: "Chief Pharmacist",
    org: "City General Hospital",
    content: "Managing ward requests used to be a nightmare. PharmaOS streamlined our entire hospital workflow.",
    rating: 5,
  },
  {
    name: "Amit Patel",
    role: "Manager",
    org: "Wellness Chemist",
    content: "The POS is incredibly fast. We can handle peak hour rush without any lag. Best investment.",
    rating: 5,
  },
  {
    name: "Priya Singh",
    role: "Admin",
    org: "MedPlus Store",
    content: "Inventory tracking is precise. I know exactly what's in stock across all my 3 branches.",
    rating: 4,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-neutral-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary-teal-dark">
          Trusted by Industry Leaders
        </h2>
      </div>

      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee whitespace-nowrap flex gap-8 py-4">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div
              key={i}
              className="w-[350px] md:w-[400px] p-6 bg-white rounded-2xl shadow-sm border border-neutral-100 flex-shrink-0 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${
                      i < t.rating ? "text-yellow-400 fill-yellow-400" : "text-neutral-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-neutral-600 mb-6 whitespace-normal italic">"{t.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-teal/10 flex items-center justify-center text-primary-teal font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 text-sm">{t.name}</h4>
                  <p className="text-xs text-neutral-500">
                    {t.role}, {t.org}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
