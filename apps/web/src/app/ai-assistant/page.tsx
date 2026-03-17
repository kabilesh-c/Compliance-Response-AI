"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Upload, FileText, X, Mic, FileUp, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import ChatWorkspace from "@/components/ai-assistant/ChatWorkspace";
import { uploadQuestionnaire, uploadReferenceDocument, getDocumentStatus } from "@/services/aiAssistantApi";
import { useAuthStore } from "@/stores/authStore";

interface UploadedFile {
  name: string;
  type: "questionnaire" | "reference";
  status: "uploading" | "processing" | "processed" | "error";
  documentId?: string;
}

function AIAssistantContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, mode } = useAuthStore();
  const isChatActive = searchParams.get('mode') === 'chat';
  
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [chatMessage, setChatMessage] = useState("");
  const questionnaireInputRef = useRef<HTMLInputElement>(null);
  const referenceInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const hasProcessedFiles = uploadedFiles.some(f => f.status === "processed");
    if (message.trim() || hasProcessedFiles) {
      const effectiveMessage = message.trim() || (hasProcessedFiles ? "Answer all questions from the uploaded questionnaire" : "");
      setChatMessage(effectiveMessage);
      router.push('/ai-assistant?mode=chat');
    }
  };

  const handleViewResults = (documentId: string) => {
    router.push(`/ai-assistant/results?id=${documentId}`);
  };

  const handleFileSelect = async (file: File, type: "questionnaire" | "reference") => {
    const tempIndex = uploadedFiles.length;
    setUploadedFiles(prev => [...prev, { name: file.name, type, status: "uploading" }]);

    try {
      const uploadFn = type === "questionnaire" ? uploadQuestionnaire : uploadReferenceDocument;
      const result = await uploadFn(file);
      const docId = result.documentId || result.questionnaireId;

      setUploadedFiles(prev =>
        prev.map((f, i) => i === tempIndex ? { ...f, status: "processing", documentId: docId } : f)
      );

      // Poll for processing completion
      if (docId) {
        const poll = setInterval(async () => {
          try {
            const statusResult = await getDocumentStatus(docId);
            if (statusResult.status === "processed") {
              clearInterval(poll);
              setUploadedFiles(prev =>
                prev.map((f, i) => i === tempIndex ? { ...f, status: "processed" } : f)
              );
            } else if (statusResult.status === "failed" || statusResult.status === "error") {
              clearInterval(poll);
              setUploadedFiles(prev =>
                prev.map((f, i) => i === tempIndex ? { ...f, status: "error" } : f)
              );
            }
          } catch {
            clearInterval(poll);
          }
        }, 3000);
      }
    } catch {
      setUploadedFiles(prev =>
        prev.map((f, i) => i === tempIndex ? { ...f, status: "error" } : f)
      );
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleBackToDashboard = () => {
    if (mode === "HOSPITAL") {
      router.push("/hospital/admin");
      return;
    }

    switch (user?.role) {
      case "ADMIN":
        router.push("/admin/dashboard");
        return;
      case "MANAGER":
        router.push("/manager");
        return;
      case "PHARMACIST":
        router.push("/pharmacist/dashboard");
        return;
      case "PROCUREMENT":
        router.push("/procurement");
        return;
      default:
        router.push("/dashboard");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 -z-20"
        style={{
          background: "linear-gradient(180deg, #d4e157 0%, #aed581 15%, #66bb6a 30%, #26a69a 50%, #00897b 70%, #00695c 85%, #004d40 100%)",
        }}
      />

      {/* Animated mesh gradient overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 0.4,
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          opacity: { duration: 0.3 },
          backgroundPosition: {
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          },
        }}
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(102, 187, 106, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(38, 166, 154, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(174, 213, 129, 0.3) 0%, transparent 50%)
          `,
          backgroundSize: "200% 200%",
        }}
      />

      {/* Smoke-like blur effect */}
      <div className="fixed inset-0 -z-10">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.3, 0],
              scale: [0, 2, 3],
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
            }}
            transition={{
              duration: 5,
              delay: i * 0.2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-teal-400/25 rounded-full blur-3xl"
          />
        ))}
      </div>

      {/* Left panel slide in */}
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-0 left-0 w-1/3 h-full pointer-events-none -z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-transparent backdrop-blur-sm" />
      </motion.div>

      {/* Right panel slide in */}
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-0 right-0 w-1/3 h-full pointer-events-none -z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-l from-emerald-600/20 to-transparent backdrop-blur-sm" />
      </motion.div>

      {/* Back to Dashboard Button */}
      {!isChatActive && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="fixed top-6 left-6 z-20"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 px-4 py-2.5 bg-black/30 backdrop-blur-xl border-2 border-gray-700/50 hover:bg-black/40 hover:border-gray-600/60 rounded-full transition-all shadow-lg"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
            <span className="text-white font-medium text-sm">Dashboard</span>
          </motion.button>
        </motion.div>
      )}

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {!isChatActive ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.3 }}
            className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20"
          >
            {/* Hero Title Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-center mb-12 md:mb-16 max-w-4xl px-4"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6 tracking-tight leading-tight"
                style={{
                  background: "linear-gradient(180deg, #1a1a1a 0%, #2d5016 50%, #1e4620 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Compliance Response AI
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-800/80 font-light leading-relaxed px-4">
                Upload questionnaires and internal documents to automatically generate
                <br className="hidden sm:block" />
                accurate compliance responses powered by AI.
              </p>
            </motion.div>

            {/* Upload Actions + Input Container */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="w-full max-w-4xl space-y-6"
            >
              {/* Upload Pill Buttons */}
              <div className="flex items-center justify-center gap-3 md:gap-4 flex-wrap px-4">
                <input
                  ref={questionnaireInputRef}
                  type="file"
                  accept=".pdf,.docx,.xlsx,.doc,.xls,.md,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file, "questionnaire");
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => questionnaireInputRef.current?.click()}
                  className="px-4 md:px-6 py-2.5 md:py-3 bg-white/20 backdrop-blur-xl border-2 border-emerald-400/40 rounded-full text-gray-900 text-sm md:text-base font-medium flex items-center gap-2 hover:bg-white/30 hover:border-emerald-400/60 transition-all shadow-lg hover:shadow-emerald-500/30"
                >
                  <Upload size={16} className="md:w-[18px] md:h-[18px]" />
                  <span className="whitespace-nowrap">Upload Questionnaire</span>
                </motion.button>

                <input
                  ref={referenceInputRef}
                  type="file"
                  accept=".pdf,.docx,.xlsx,.doc,.xls,.md,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file, "reference");
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => referenceInputRef.current?.click()}
                  className="px-4 md:px-6 py-2.5 md:py-3 bg-white/20 backdrop-blur-xl border-2 border-emerald-400/40 rounded-full text-gray-900 text-sm md:text-base font-medium flex items-center gap-2 hover:bg-white/30 hover:border-emerald-400/60 transition-all shadow-lg hover:shadow-emerald-500/30"
                >
                  <FileText size={16} className="md:w-[18px] md:h-[18px]" />
                  <span className="whitespace-nowrap">Upload Reference Docs</span>
                </motion.button>
              </div>

              {/* Uploaded Files Chips */}
              <AnimatePresence>
                {uploadedFiles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-center gap-3 flex-wrap"
                  >
                    {uploadedFiles.map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`px-4 py-2 backdrop-blur-md border-2 rounded-full text-sm flex items-center gap-2 font-medium ${
                          file.status === "error"
                            ? "bg-red-500/30 border-red-500/50 text-red-200"
                            : file.status === "processed"
                            ? "bg-emerald-500/30 border-emerald-500/50 text-gray-900"
                            : "bg-amber-500/20 border-amber-500/40 text-gray-900"
                        }`}
                      >
                        {file.status === "uploading" || file.status === "processing" ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : file.status === "processed" ? (
                          <CheckCircle size={14} className="text-emerald-600" />
                        ) : (
                          <FileText size={14} />
                        )}
                        <span className="max-w-[200px] truncate">{file.name}</span>
                        <span className="text-[10px] uppercase opacity-70">
                          {file.status === "uploading" ? "Uploading…" :
                           file.status === "processing" ? "Processing…" :
                           file.status === "error" ? "Failed" : "Ready"}
                        </span>
                        {(file.status === "processed" || file.status === "error") && (
                          <button
                            onClick={() => removeFile(index)}
                            className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input Box with Circular Action Buttons */}
              <div className="flex items-center gap-2 md:gap-3 w-full">
                {/* Upload File Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => questionnaireInputRef.current?.click()}
                  className="flex-shrink-0 w-11 h-11 md:w-12 md:h-12 bg-black/30 backdrop-blur-xl border-2 border-gray-700/50 hover:bg-black/40 hover:border-gray-600/60 rounded-full flex items-center justify-center transition-all shadow-lg"
                  aria-label="Upload file"
                >
                  <FileUp className="w-5 h-5 md:w-5 md:h-5 text-white" />
                </motion.button>

                {/* Microphone Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex-shrink-0 w-11 h-11 md:w-12 md:h-12 bg-black/30 backdrop-blur-xl border-2 border-gray-700/50 hover:bg-black/40 hover:border-gray-600/60 rounded-full flex items-center justify-center transition-all shadow-lg"
                  aria-label="Voice input"
                >
                  <Mic className="w-5 h-5 md:w-5 md:h-5 text-white" />
                </motion.button>

                {/* Input Container */}
                <motion.div
                  animate={{
                    scale: isFocused ? 1.01 : 1,
                    boxShadow: isFocused
                      ? "0 0 40px rgba(16, 185, 129, 0.5), 0 0 80px rgba(38, 166, 154, 0.2)"
                      : "0 8px 32px rgba(0, 0, 0, 0.2)",
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 relative bg-white/15 backdrop-blur-2xl border-3 rounded-full overflow-hidden"
                  style={{
                    borderWidth: '3px',
                    borderColor: isFocused ? 'rgba(16, 185, 129, 0.6)' : 'rgba(38, 166, 154, 0.4)',
                    background: "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%)",
                  }}
                >
                  {/* Glow effect when focused */}
                  {isFocused && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 -z-10"
                    />
                  )}

                  <div className="flex items-center px-5 md:px-6 py-3 md:py-4">
                    {/* Input */}
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onKeyPress={handleKeyPress}
                      placeholder={uploadedFiles.some(f => f.status === "processed") ? "Ask about your documents or press Enter..." : "Start typing..."}
                      className="flex-1 bg-transparent text-gray-900 text-sm md:text-base placeholder:text-gray-700/60 outline-none font-medium"
                    />
                  </div>
                </motion.div>

                {/* Circular Send Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSubmit}
                  disabled={!message.trim() && !uploadedFiles.some(f => f.status === "processed")}
                  className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-black/30 backdrop-blur-xl border-2 border-gray-700/50 hover:bg-black/40 hover:border-gray-600/60 rounded-full flex items-center justify-center shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </motion.button>
              </div>

              {/* Helper Text */}
              <p className="text-center text-gray-800/60 text-xs md:text-sm px-4">
                Press Enter to send • AI-powered compliance assistance
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <ChatWorkspace key="workspace" initialMessage={chatMessage || message} uploadedFiles={uploadedFiles} />
        )}
      </AnimatePresence>
    </div>
  );
}


export default function AIAssistantPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AIAssistantContent />
    </Suspense>
  );
}
