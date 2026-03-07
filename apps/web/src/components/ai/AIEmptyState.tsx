"use client";

import { Brain, AlertCircle, Clock, ToggleLeft } from "lucide-react";

type AIEmptyStateType = "no-data" | "learning" | "disabled" | "error";

interface AIEmptyStateProps {
  type: AIEmptyStateType;
  title?: string;
  description?: string;
  onAction?: () => void;
  actionLabel?: string;
}

const stateConfig: Record<AIEmptyStateType, { 
  icon: typeof Brain; 
  defaultTitle: string; 
  defaultDescription: string;
  iconColor: string;
  bgColor: string;
}> = {
  "no-data": {
    icon: Brain,
    defaultTitle: "Not enough data",
    defaultDescription: "AI needs more historical data to generate insights. Keep using the system and check back later.",
    iconColor: "text-neutral-400",
    bgColor: "bg-neutral-100"
  },
  "learning": {
    icon: Clock,
    defaultTitle: "AI learning in progress",
    defaultDescription: "Our AI is analyzing patterns in your data. This may take a few moments.",
    iconColor: "text-primary-yellow-dark",
    bgColor: "bg-primary-yellow/10"
  },
  "disabled": {
    icon: ToggleLeft,
    defaultTitle: "AI features disabled",
    defaultDescription: "AI-assisted features are currently turned off. Enable them in Settings to see smart insights.",
    iconColor: "text-neutral-400",
    bgColor: "bg-neutral-100"
  },
  "error": {
    icon: AlertCircle,
    defaultTitle: "Unable to load AI insights",
    defaultDescription: "Something went wrong while fetching AI recommendations. Please try again.",
    iconColor: "text-status-danger",
    bgColor: "bg-status-danger/10"
  }
};

export default function AIEmptyState({ 
  type, 
  title, 
  description,
  onAction,
  actionLabel
}: AIEmptyStateProps) {
  const config = stateConfig[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className={`w-16 h-16 rounded-2xl ${config.bgColor} flex items-center justify-center mb-4`}>
        <Icon size={28} className={config.iconColor} />
      </div>
      <h3 className="text-base font-semibold text-neutral-900 mb-2">
        {title || config.defaultTitle}
      </h3>
      <p className="text-sm text-neutral-500 max-w-sm mb-4">
        {description || config.defaultDescription}
      </p>
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-sm font-medium text-primary-yellow-dark bg-primary-yellow/10 hover:bg-primary-yellow/20 rounded-lg transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
