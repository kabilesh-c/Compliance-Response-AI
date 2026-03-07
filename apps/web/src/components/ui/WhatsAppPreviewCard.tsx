import React from "react";
import { MessageCircle, Check, Clock, AlertCircle } from "lucide-react";

interface WhatsAppPreviewCardProps {
  recipient: string;
  message: string;
  status: "PENDING" | "SENT" | "FAILED";
  type: "SUPPLIER" | "STAFF" | "DELIVERY";
  onSend?: () => void;
}

export default function WhatsAppPreviewCard({
  recipient,
  message,
  status,
  type,
  onSend,
}: WhatsAppPreviewCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "SENT":
        return "text-green-600 bg-green-50";
      case "FAILED":
        return "text-red-600 bg-red-50";
      default:
        return "text-yellow-600 bg-yellow-50";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "SENT":
        return <Check className="w-4 h-4" />;
      case "FAILED":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-100 rounded-full">
            <MessageCircle className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">
              {type === "SUPPLIER" ? "Supplier Alert" : type === "STAFF" ? "Staff Notification" : "Delivery Update"}
            </h4>
            <p className="text-xs text-gray-500">To: {recipient}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {getStatusIcon()}
          <span>{status}</span>
        </div>
      </div>

      <div className="bg-green-50 p-3 rounded-lg mb-3 relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-green-500 rounded-l-lg opacity-50"></div>
        <p className="text-sm text-gray-800 whitespace-pre-wrap font-mono text-xs">{message}</p>
      </div>

      {status === "PENDING" && onSend && (
        <button
          onClick={onSend}
          className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Send WhatsApp Message
        </button>
      )}
    </div>
  );
}
