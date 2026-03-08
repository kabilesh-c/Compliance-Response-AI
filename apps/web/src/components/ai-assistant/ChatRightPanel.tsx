import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle, Clock, Loader2, AlertCircle } from "lucide-react";
import { getDocuments, type DocumentInfo } from "@/services/aiAssistantApi";

interface ChatRightPanelProps {
  refreshKey?: number;
}

export default function ChatRightPanel({ refreshKey }: ChatRightPanelProps) {
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    try {
      const docs = await getDocuments();
      setDocuments(docs);
    } catch {
      // silently fail — panel is supplementary
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
    const interval = setInterval(fetchDocuments, 15000); // poll every 15s
    return () => clearInterval(interval);
  }, [fetchDocuments, refreshKey]);

  const statusIcon = (status: string) => {
    if (status === "processed") return <CheckCircle size={12} className="text-emerald-400" />;
    if (status === "processing") return <Loader2 size={12} className="text-amber-400 animate-spin" />;
    if (status === "error" || status === "failed") return <AlertCircle size={12} className="text-red-400" />;
    return <Clock size={12} className="text-amber-400" />;
  };

  const statusColor = (status: string) => {
    if (status === "processed") return "text-emerald-400";
    if (status === "error" || status === "failed") return "text-red-400";
    return "text-amber-400";
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="hidden lg:flex flex-col w-80 h-full border-l border-white/5 bg-black/10 backdrop-blur-lg"
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
            Context Documents
          </h3>
          <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
            {documents.length} Files
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={20} className="text-gray-400 animate-spin" />
          </div>
        ) : documents.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-4">No documents uploaded yet</p>
        ) : (
          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-thin scrollbar-thumb-white/10">
            {documents.map((doc, index) => (
              <div
                key={doc.id}
                className="group p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-emerald-500/20 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                    <FileText size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate" title={doc.document_name}>
                      {doc.document_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{doc.document_type}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    {statusIcon(doc.upload_status)}
                    <span className={`text-xs capitalize ${statusColor(doc.upload_status)}`}>
                      {doc.upload_status}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-600 uppercase tracking-wider">
                    {doc.document_type === "questionnaire" ? "Questionnaire" : "Reference"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats summary */}
        {documents.length > 0 && (
          <div className="mt-8 p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-xl border border-emerald-500/20">
            <h4 className="text-sm font-semibold text-emerald-400 mb-2">
              Processing Status
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-300">
                <span>Processed</span>
                <span className="text-emerald-400">
                  {documents.filter(d => d.upload_status === "processed").length}/{documents.length}
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{
                    width: `${documents.length > 0 ? (documents.filter(d => d.upload_status === "processed").length / documents.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
