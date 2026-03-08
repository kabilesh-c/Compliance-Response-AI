"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Sparkles, FileText, MessageSquare } from "lucide-react";
import { Orb, emeraldPreset } from "react-ai-orb";
import { motion, AnimatePresence } from "framer-motion";

interface AIFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIFeatureModal({ isOpen, onClose }: AIFeatureModalProps) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  if (!isOpen) return null;

  const handleTryAI = () => {
    setIsTransitioning(true);
    
    // Wait for animation to complete before navigation
    setTimeout(() => {
      router.push("/ai-assistant");
    }, 300);
  };

  return (
    <AnimatePresence>
      {!isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] max-w-2xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            }}
          >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all duration-300 z-50 border border-white/20 group"
          aria-label="Close modal"
        >
          <X size={20} className="text-white group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Content */}
        <div className="relative z-10 px-8 pt-2 pb-8 flex flex-col items-center text-center">
          {/* AI Orb Component */}
          <div className="relative w-80 h-80 -mb-8 flex items-center justify-center scale-[1.65]">
            <Orb {...emeraldPreset} />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight drop-shadow-lg">
            Compliance Response AI
          </h2>
          
          {/* Description */}
          <p className="text-base text-white/80 leading-relaxed mb-6 max-w-lg font-light">
            Automatically generate accurate responses to vendor and compliance questionnaires by analyzing your internal documentation, policies, and guidelines with AI-powered intelligence.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 w-full">
            <div className="flex items-start gap-3 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white mb-1">Document Analysis</h3>
                <p className="text-sm text-white/60">Parse and understand your internal docs</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white mb-1">Auto Responses</h3>
                <p className="text-sm text-white/60">Generate cited, accurate answers instantly</p>
              </div>
            </div>
          </div>

          {/* Glassy Buttons */}
          <div className="flex flex-col w-full gap-4">
            <button
              onClick={handleTryAI}
              className="w-full py-4 px-6 bg-white/15 backdrop-blur-md border border-white/30 text-white font-semibold rounded-2xl hover:bg-white/25 hover:border-white/40 hover:shadow-lg hover:shadow-white/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Sparkles size={20} className="animate-pulse" />
              Try Compliance Response AI
            </button>
            
            <button
              onClick={onClose}
              className="w-full py-4 px-6 bg-white/5 backdrop-blur-md border border-white/10 text-white/70 font-medium rounded-2xl hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300"
            >
              Maybe Later
            </button>
          </div>
        </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Transition smoke effect */}
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 3 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.7) 0%, rgba(20, 184, 166, 0.4) 50%, transparent 70%)',
            backdropFilter: 'blur(40px)',
          }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 2, opacity: [0, 1, 0] }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-96 h-96 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.5) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
