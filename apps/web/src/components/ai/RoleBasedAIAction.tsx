"use client";

import { Lock, Check, X } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

interface RoleBasedAIActionProps {
  onApprove?: () => void;
  onReject?: () => void;
  approveLabel?: string;
  rejectLabel?: string;
  size?: "sm" | "md";
  requiresManager?: boolean;
}

export default function RoleBasedAIAction({
  onApprove,
  onReject,
  approveLabel = "Approve",
  rejectLabel = "Reject",
  size = "sm",
  requiresManager = true
}: RoleBasedAIActionProps) {
  const { user } = useAuthStore();
  const isPharmacist = user?.role === "PHARMACIST";
  const needsApproval = requiresManager && isPharmacist;

  const buttonSize = size === "sm" 
    ? "px-2.5 py-1 text-xs gap-1" 
    : "px-3 py-1.5 text-sm gap-1.5";

  if (needsApproval) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-lg">
        <Lock size={12} className="text-neutral-400" />
        <span className="text-xs text-neutral-500 font-medium">Manager approval required</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {onApprove && (
        <button
          onClick={onApprove}
          className={`flex items-center ${buttonSize} font-medium bg-status-success/10 text-status-success hover:bg-status-success/20 rounded-lg transition-colors`}
        >
          <Check size={size === "sm" ? 12 : 14} />
          {approveLabel}
        </button>
      )}
      {onReject && (
        <button
          onClick={onReject}
          className={`flex items-center ${buttonSize} font-medium bg-status-danger/10 text-status-danger hover:bg-status-danger/20 rounded-lg transition-colors`}
        >
          <X size={size === "sm" ? 12 : 14} />
          {rejectLabel}
        </button>
      )}
    </div>
  );
}
