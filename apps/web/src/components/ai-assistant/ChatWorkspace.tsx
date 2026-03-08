import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import ChatSidebar from "./ChatSidebar";
import ChatMain from "./ChatMain";
import ChatRightPanel from "./ChatRightPanel";

interface ChatWorkspaceProps {
  initialMessage: string;
  uploadedFiles: { name: string; type: string; documentId?: string }[];
}

export default function ChatWorkspace({ initialMessage, uploadedFiles }: ChatWorkspaceProps) {
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>();
  const [chatKey, setChatKey] = useState(0); // force remount on new chat
  const [docRefreshKey, setDocRefreshKey] = useState(0);

  const handleNewChat = useCallback(() => {
    setActiveSessionId(undefined);
    setChatKey(prev => prev + 1);
    setDocRefreshKey(prev => prev + 1); // refresh doc list on new chat
  }, []);

  const handleSelectSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
    setChatKey(prev => prev + 1);
  }, []);

  const handleDocumentsChanged = useCallback(() => {
    setDocRefreshKey(prev => prev + 1);
  }, []);

  return (
    <motion.div
      key="workspace"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex overflow-hidden backdrop-blur-3xl bg-black/40"
    >
      <ChatSidebar
        activeSessionId={activeSessionId}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
      />
      <ChatMain
        key={chatKey}
        initialMessage={chatKey === 0 ? initialMessage : ""}
        uploadedFiles={chatKey === 0 ? uploadedFiles : []}
        sessionId={activeSessionId}
        onSessionCreated={setActiveSessionId}
      />
      <ChatRightPanel refreshKey={docRefreshKey} />
    </motion.div>
  );
}
