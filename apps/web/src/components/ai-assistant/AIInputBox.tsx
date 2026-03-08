"use client";

import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { useState } from "react";

interface AIInputBoxProps {
  onSubmit?: (message: string) => void;
}

export default function AIInputBox({ onSubmit }: AIInputBoxProps) {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && onSubmit) {
      onSubmit(message);
      setMessage("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-4xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`
            relative rounded-3xl backdrop-blur-2xl border transition-all duration-300
            ${isFocused 
              ? 'bg-white/15 border-white/30 shadow-2xl' 
              : 'bg-white/10 border-white/15 shadow-xl'
            }
          `}
          style={{
            boxShadow: isFocused 
              ? '0 20px 60px rgba(16, 185, 129, 0.3), 0 0 0 1px rgba(255,255,255,0.1)' 
              : '0 12px 40px rgba(0,0,0,0.2)',
          }}
        >
          {/* Glowing effect when focused */}
          {isFocused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 blur-xl -z-10"
            />
          )}

          {/* Inner glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

          <div className="flex items-center gap-4 p-6">
            {/* Icon indicator */}
            <motion.div
              animate={{
                rotate: isFocused ? 360 : 0,
                scale: isFocused ? 1.1 : 1,
              }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </motion.div>

            {/* Input field */}
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="What compliance questionnaire would you like help answering?"
              className="flex-1 bg-transparent text-white placeholder-white/50 text-lg outline-none"
            />

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={!message.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                flex-shrink-0 p-4 rounded-xl transition-all duration-300
                ${message.trim()
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/50'
                  : 'bg-white/10 cursor-not-allowed opacity-50'
                }
              `}
            >
              <Send className="w-5 h-5 text-white" />
            </motion.button>
          </div>

          {/* Bottom gradient line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>

        {/* Helper text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-white/40 text-sm mt-4"
        >
          Press Enter to send • AI-powered compliance assistance
        </motion.p>
      </form>
    </motion.div>
  );
}
