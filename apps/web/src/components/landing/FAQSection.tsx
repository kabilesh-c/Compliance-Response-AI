"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What is the difference between Retail and Hospital mode?",
    answer: "Retail mode focuses on POS, fast billing, and customer loyalty for pharmacies. Hospital mode includes features for ward requests, department-wise consumption, and multi-level approval workflows tailored for medical institutions.",
  },
  {
    question: "How accurate is the AI demand forecasting?",
    answer: "Our AI model learns from your historical sales data and local trends. Typically, it achieves 85-90% accuracy after 3 months of usage, helping you reduce stockouts and overstocking.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes, absolutely. We use enterprise-grade encryption for all data. Your data is backed up daily and stored on secure cloud servers compliant with healthcare data regulations.",
  },
  {
    question: "Can I integrate WhatsApp for notifications?",
    answer: "Yes! PharmaOS has built-in WhatsApp integration. You can send invoices to customers and receive low-stock alerts directly on your WhatsApp number.",
  },
  {
    question: "Do you support multi-store chains?",
    answer: "Yes, our platform is designed to scale. You can manage multiple branches from a single Admin dashboard, transfer stock between stores, and view consolidated reports.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary-teal-dark mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-neutral-200 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-neutral-50 transition-colors"
              >
                <span className="font-semibold text-neutral-900 text-lg">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <Minus className="text-primary-teal flex-shrink-0" />
                ) : (
                  <Plus className="text-neutral-400 flex-shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6 pt-0 text-neutral-600 leading-relaxed border-t border-neutral-100">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
