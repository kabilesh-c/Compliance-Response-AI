"use client";

import { useState, useEffect } from "react";
import { Brain } from "lucide-react";

interface AIActivityIndicatorProps {
  message?: string;
  isVisible?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
}

export default function AIActivityIndicator({ 
  message = "AI analyzing", 
  isVisible = true,
  autoHide = true,
  autoHideDelay = 3000
}: AIActivityIndicatorProps) {
  const [visible, setVisible] = useState(isVisible);
  const [dots, setDots] = useState("");

  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  // Animate dots
  useEffect(() => {
    if (!visible) return;
    
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 400);

    return () => clearInterval(interval);
  }, [visible]);

  // Auto hide after delay
  useEffect(() => {
    if (!autoHide || !visible) return;

    const timeout = setTimeout(() => {
      setVisible(false);
    }, autoHideDelay);

    return () => clearTimeout(timeout);
  }, [autoHide, autoHideDelay, visible]);

  if (!visible) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-yellow/10 rounded-full animate-pulse">
      <Brain size={14} className="text-primary-yellow-dark" />
      <span className="text-xs font-medium text-primary-yellow-dark min-w-[100px]">
        {message}{dots}
      </span>
    </div>
  );
}
