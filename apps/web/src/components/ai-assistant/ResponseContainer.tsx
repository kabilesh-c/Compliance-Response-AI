"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, FileText, Quote } from "lucide-react";

interface ResponseContainerProps {
  isVisible: boolean;
}

export default function ResponseContainer({ isVisible }: ResponseContainerProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-4xl mx-auto mt-8"
        >
          <div className="space-y-6">
            {/* Answer Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-6 overflow-hidden"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Answer Generated</h3>
                </div>
                
                <p className="text-white/80 leading-relaxed mb-4">
                  Your AI-generated compliance response will appear here. The system analyzes your uploaded documents and questionnaires to provide accurate, cited answers.
                </p>
                
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Processing with AI...</span>
                </div>
              </div>
            </motion.div>

            {/* Citation Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative rounded-2xl bg-white/8 backdrop-blur-xl border border-white/10 p-6 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Citation Sources</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-400 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Security Policy Document</p>
                      <p className="text-white/60 text-xs mt-1">Reference section will be shown here</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-400 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Privacy Guidelines</p>
                      <p className="text-white/60 text-xs mt-1">Reference section will be shown here</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Evidence Snippets */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative rounded-2xl bg-white/8 backdrop-blur-xl border border-white/10 p-6 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                    <Quote className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Evidence Snippets</h3>
                </div>
                
                <div className="p-4 rounded-lg bg-white/5 border-l-4 border-purple-400">
                  <p className="text-white/70 text-sm italic leading-relaxed">
                    "Relevant excerpts from your internal documentation that support the generated answer will be displayed here with exact quotes and page references."
                  </p>
                  <p className="text-white/50 text-xs mt-2">— Source Document, Page XX</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
