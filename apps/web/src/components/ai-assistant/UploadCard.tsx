"use client";

import { motion } from "framer-motion";
import { Upload, LucideIcon } from "lucide-react";
import { useState } from "react";

interface UploadCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
  onFileSelect?: (file: File) => void;
}

export default function UploadCard({
  title,
  description,
  icon: Icon,
  gradientFrom,
  gradientTo,
  onFileSelect,
}: UploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && onFileSelect) {
      onFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && onFileSelect) {
      onFileSelect(files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative group"
    >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative overflow-hidden rounded-2xl p-6 cursor-pointer
          backdrop-blur-xl border transition-all duration-300
          ${isDragging 
            ? 'bg-white/20 border-white/40 shadow-xl' 
            : 'bg-white/8 border-white/10 hover:bg-white/12 hover:border-white/20'
          }
        `}
        style={{
          boxShadow: isDragging 
            ? `0 0 30px ${gradientFrom}40` 
            : '0 8px 32px rgba(0,0,0,0.1)',
        }}
      >
        {/* Gradient glow effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, ${gradientFrom}15, ${gradientTo}15)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          {/* Icon */}
          <motion.div
            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                boxShadow: `0 8px 20px ${gradientFrom}60`,
              }}
            >
              <Icon className="w-8 h-8 text-white" />
            </div>
            
            {/* Glowing ring */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                filter: 'blur(12px)',
              }}
            />
          </motion.div>

          {/* Text */}
          <div>
            <h3 className="text-lg font-bold text-white mb-2">
              {title}
            </h3>
            <p className="text-sm text-white/70 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Upload button */}
          <label className="w-full">
            <input
              type="file"
              className="hidden"
              onChange={handleFileInput}
              accept=".pdf,.docx,.xlsx,.doc,.xls"
            />
            <div 
              className="flex items-center justify-center gap-2 py-3 px-6 bg-white/15 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/25 transition-all cursor-pointer"
            >
              <Upload size={18} className="text-white" />
              <span className="text-white font-medium">Choose File</span>
            </div>
          </label>

          <p className="text-xs text-white/50">
            or drag and drop here
          </p>
        </div>

        {/* Animated border gradient */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div 
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${gradientFrom}40, ${gradientTo}40)`,
              filter: 'blur(20px)',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
