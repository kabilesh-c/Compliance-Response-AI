"use client";

import { Megaphone, AlertTriangle, Info, X } from "lucide-react";
import { useState } from "react";

export default function SystemAnnouncementsCard() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-primary-blue/10 to-white border border-primary-blue/20 rounded-card p-4 relative">
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-600"
      >
        <X size={16} />
      </button>
      
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-primary-blue/20 flex items-center justify-center text-primary-blue shrink-0">
          <Megaphone size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
            System Announcement
            <span className="px-2 py-0.5 bg-primary-blue text-white text-[10px] rounded-full uppercase font-bold tracking-wide">New</span>
          </h3>
          <p className="text-sm text-neutral-600 mt-1">
            Scheduled maintenance for AI models is planned for <strong>Sunday, 2:00 AM - 4:00 AM EST</strong>. 
            Automated reordering will be paused during this window.
          </p>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-status-warning font-medium">
              <AlertTriangle size={14} />
              AI Downtime Expected
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Info size={14} />
              Policy Update v2.4
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
