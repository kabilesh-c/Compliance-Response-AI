import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, MessageSquare, Trash2, Clock, Settings, Loader2 } from "lucide-react";
import { listChatSessions, deleteChatSession, type ChatSessionSummary } from "@/services/aiAssistantApi";

interface ChatSidebarProps {
  activeSessionId?: string;
  onNewChat?: () => void;
  onSelectSession?: (sessionId: string) => void;
}

export default function ChatSidebar({ activeSessionId, onNewChat, onSelectSession }: ChatSidebarProps) {
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    try {
      const list = await listChatSessions();
      setSessions(list);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions, activeSessionId]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteChatSession(id);
      setSessions(prev => prev.filter(s => s.id !== id));
    } catch {
      // silently fail
    }
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="hidden md:flex flex-col w-64 h-full border-r border-white/10 bg-black/20 backdrop-blur-xl"
    >
      <div className="p-4 space-y-4">
        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/15 
          border border-white/10 hover:border-white/20 rounded-xl transition-all 
          text-white font-medium shadow-lg backdrop-blur-md group"
        >
          <Plus className="w-5 h-5 text-emerald-400 group-hover:rotate-90 transition-transform" />
          <span>New Chat</span>
        </button>

        <div className="flex flex-col space-y-2 mt-6">
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider px-2">
            History
          </span>
          <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-250px)] scrollbar-thin scrollbar-thumb-white/10">
            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 size={16} className="text-gray-500 animate-spin" />
              </div>
            ) : sessions.length === 0 ? (
              <p className="text-xs text-gray-500 px-3 py-2">No conversations yet</p>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectSession?.(session.id)}
                  onKeyDown={(e) => e.key === 'Enter' && onSelectSession?.(session.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors group cursor-pointer ${
                    activeSessionId === session.id
                      ? "bg-emerald-500/10 text-white border border-emerald-500/20"
                      : "text-gray-200 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <MessageSquare className={`w-4 h-4 flex-shrink-0 ${
                    activeSessionId === session.id ? "text-emerald-400" : "text-gray-400 group-hover:text-emerald-400"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm">{session.title}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all"
                    title="Delete"
                  >
                    <Trash2 size={12} className="text-gray-400 hover:text-red-400" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-white/10 space-y-2">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>
    </motion.aside>
  );
}
