import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, FileUp, Copy, ThumbsUp, ThumbsDown, RotateCcw, MoreHorizontal, Loader2, FileText, Download, X, Eye, ChevronLeft, ChevronRight, Check, Edit3, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sendChatMessage, getChatSession, getQuestions, exportQuestionnaire, regenerateSingleQuestion, uploadQuestionnaire, uploadReferenceDocument, getDocumentStatus, StructuredAnswerItem, StructuredAnswersResponse } from "@/services/aiAssistantApi";
import { QuestionnaireResult } from "./QuestionnaireResult";

interface ChatMainProps {
  initialMessage: string;
  uploadedFiles: { name: string; type: string; documentId?: string }[];
  sessionId?: string;
  onSessionCreated?: (sessionId: string) => void;
}

interface AttachedFile {
  name: string;
  type: string;
  documentId?: string;
}

/** A single version of an answer for version tracking */
interface AnswerVersion {
  answerText: string;
  citations: { document: string; page: number | null }[];
  evidenceSnippet: string;
  confidence: number;
}

/** Per-question card state with version tracking */
interface QuestionCardState {
  questionNumber: number;
  questionText: string;
  versions: AnswerVersion[];
  currentVersion: number; // 0-indexed
  status: 'answered' | 'not_found';
  isRegenerating: boolean;
  isEditing: boolean;
  editText: string;
}

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  citations?: { document: string; page: number | null; chunkId: string }[];
  evidenceSnippets?: { chunkText: string; documentName: string; pageNumber: number | null }[];
  confidence?: number;
  isStreaming?: boolean;
  attachedFiles?: AttachedFile[];
  questionnaireId?: string | null;
  structuredAnswers?: StructuredAnswersResponse | null;
  questionCards?: QuestionCardState[];
}

export default function ChatMain({ initialMessage, uploadedFiles, sessionId: externalSessionId, onSessionCreated }: ChatMainProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(externalSessionId);
  const [previewFile, setPreviewFile] = useState<{ name: string; documentId?: string; questions: string[] } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<Array<{file: File; status: 'uploading' | 'processing' | 'ready' | 'error'; documentId?: string; type: 'questionnaire' | 'reference'}>>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialMessageSent = useRef(false);
  const firstMessageFiles = useRef(uploadedFiles);
  // Track session IDs created within this component instance so we don't
  // reload from DB when onSessionCreated fires (which would wipe questionCards)
  const localSessionIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Load existing session messages when selecting from sidebar.
  // Skip reload when externalSessionId was just created by this component
  // instance (via sendUserMessage → onSessionCreated) to preserve questionCards.
  useEffect(() => {
    if (!externalSessionId) return;
    setSessionId(externalSessionId);
    if (localSessionIdsRef.current.has(externalSessionId)) {
      // We created this session locally — keep the in-memory messages intact
      return;
    }
    // Externally selected session (sidebar navigation) — reload from DB
    getChatSession(externalSessionId).then(data => {
      if (data?.messages) {
        setMessages(data.messages.map((m: any, i: number) => {
          const base: Message = {
            id: `hist-${i}`,
            role: m.role,
            content: m.content,
            citations: m.citations,
            confidence: m.confidence,
          };
          // Reconstruct per-question cards from persisted structuredData
          if (m.structuredData?.answers) {
            base.structuredAnswers = m.structuredData;
            base.questionCards = m.structuredData.answers.map((a: any) => ({
              questionNumber: a.questionNumber,
              questionText: a.questionText,
              versions: [{
                answerText: a.answerText,
                citations: a.citations || a.sources || [],
                evidenceSnippet: a.evidenceSnippet || a.referenceExcerpt || '',
                confidence: a.confidence ?? 0,
              }],
              currentVersion: 0,
              status: a.status ?? 'answered',
              isRegenerating: false,
              isEditing: false,
              editText: '',
            }));
          }
          return base;
        }));
      }
    }).catch(() => {});
  }, [externalSessionId]);

  useEffect(() => {
    if (initialMessage && !initialMessageSent.current) {
      initialMessageSent.current = true;
      sendUserMessage(initialMessage);
    }
  }, [initialMessage]);

  const sendUserMessage = async (text: string) => {
    // Attach files from first message OR from pending attachments
    const isFirstMessage = messages.filter(m => m.role === "user").length === 0;
    const firstMsgFiles = isFirstMessage && firstMessageFiles.current.length > 0
      ? firstMessageFiles.current.map(f => ({ name: f.name, type: f.type, documentId: f.documentId }))
      : [];
    const pendingFiles = pendingAttachments.filter(a => a.status === 'ready').map(a => ({ 
      name: a.file.name, 
      type: a.type, 
      documentId: a.documentId 
    }));
    const filesToAttach = [...firstMsgFiles, ...pendingFiles];

    // Pass the questionnaire documentId so the backend can find questions reliably
    const questionnaireFile = isFirstMessage
      ? firstMessageFiles.current.find(f => f.type === 'questionnaire' && f.documentId)
      : pendingAttachments.find(a => a.type === 'questionnaire' && a.documentId);

    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: "user", 
      content: text, 
      attachedFiles: filesToAttach.length > 0 ? filesToAttach : undefined 
    };
    const aiId = (Date.now() + 1).toString();

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setPendingAttachments([]); // Clear pending attachments after sending

    // Add a streaming AI placeholder
    setMessages(prev => [...prev, { id: aiId, role: "ai", content: "", isStreaming: true }]);

    try {
      const result = await sendChatMessage(text, sessionId, questionnaireFile?.documentId);
      if (result.sessionId) {
        // Mark as locally created BEFORE calling onSessionCreated so the
        // externalSessionId useEffect skips the DB reload and preserves cards.
        localSessionIdsRef.current.add(result.sessionId);
        setSessionId(result.sessionId);
        onSessionCreated?.(result.sessionId);
      }

      // Build per-question cards if structured response is available
      let questionCards: QuestionCardState[] | undefined;
      if (result.structuredAnswers?.answers) {
        questionCards = result.structuredAnswers.answers.map(a => ({
          questionNumber: a.questionNumber,
          questionText: a.questionText,
          versions: [{
            answerText: a.answerText,
            citations: a.citations || a.sources || [],
            evidenceSnippet: a.evidenceSnippet || a.referenceExcerpt || '',
            confidence: a.confidence,
          }],
          currentVersion: 0,
          status: a.status,
          isRegenerating: false,
          isEditing: false,
          editText: '',
        }));
      }

      setMessages(prev =>
        prev.map(m =>
          m.id === aiId
            ? {
                ...m,
                content: result.answer,
                citations: result.citations,
                evidenceSnippets: result.evidenceSnippets,
                confidence: result.confidence,
                isStreaming: false,
                questionnaireId: result.questionnaireId,
                structuredAnswers: result.structuredAnswers,
                questionCards,
              }
            : m
        )
      );
    } catch (error: any) {
      console.error('Chat message failed:', error);
      const errorMessage = error?.response?.data?.error 
        || error?.message 
        || "Sorry, I couldn't generate a response. Please try again.";
      setMessages(prev =>
        prev.map(m =>
          m.id === aiId
            ? { ...m, content: `Error: ${errorMessage}`, isStreaming: false }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    const hasReadyAttachments = pendingAttachments.some(a => a.status === 'ready');
    if ((!inputValue.trim() && !hasReadyAttachments) || isLoading) return;
    const text = inputValue.trim() || (hasReadyAttachments ? "Analyze the uploaded documents" : "");
    setInputValue("");
    sendUserMessage(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleRegenerate = (messageId: string) => {
    // Find the user message preceding this AI message
    const idx = messages.findIndex((m) => m.id === messageId);
    if (idx < 1) return;
    const userMsg = messages
      .slice(0, idx)
      .reverse()
      .find((m) => m.role === "user");
    if (userMsg) sendUserMessage(userMsg.content);
  };

  /** Regenerate a single question card — adds a new version */
  const handleRegenerateCard = async (messageId: string, cardIndex: number) => {
    // Mark the card as regenerating
    setMessages(prev => prev.map(m => {
      if (m.id !== messageId || !m.questionCards) return m;
      const cards = [...m.questionCards];
      cards[cardIndex] = { ...cards[cardIndex], isRegenerating: true };
      return { ...m, questionCards: cards };
    }));

    const msg = messages.find(m => m.id === messageId);
    const card = msg?.questionCards?.[cardIndex];
    if (!card) return;

    try {
      const result = await regenerateSingleQuestion(card.questionText, sessionId);
      setMessages(prev => prev.map(m => {
        if (m.id !== messageId || !m.questionCards) return m;
        const cards = [...m.questionCards];
        const newVersion: AnswerVersion = {
          answerText: result.answerText,
          citations: result.citations || result.sources || [],
          evidenceSnippet: result.evidenceSnippet || result.referenceExcerpt || '',
          confidence: result.confidence,
        };
        cards[cardIndex] = {
          ...cards[cardIndex],
          versions: [...cards[cardIndex].versions, newVersion],
          currentVersion: cards[cardIndex].versions.length, // point to new version
          isRegenerating: false,
        };
        return { ...m, questionCards: cards };
      }));
    } catch {
      setMessages(prev => prev.map(m => {
        if (m.id !== messageId || !m.questionCards) return m;
        const cards = [...m.questionCards];
        cards[cardIndex] = { ...cards[cardIndex], isRegenerating: false };
        return { ...m, questionCards: cards };
      }));
    }
  };

  /** Navigate between versions of a card */
  const handleVersionNav = (messageId: string, cardIndex: number, direction: 'prev' | 'next') => {
    setMessages(prev => prev.map(m => {
      if (m.id !== messageId || !m.questionCards) return m;
      const cards = [...m.questionCards];
      const card = cards[cardIndex];
      const newVersion = direction === 'prev'
        ? Math.max(0, card.currentVersion - 1)
        : Math.min(card.versions.length - 1, card.currentVersion + 1);
      cards[cardIndex] = { ...card, currentVersion: newVersion };
      return { ...m, questionCards: cards };
    }));
  };

  /** Start inline editing for a card answer */
  const handleStartEdit = (messageId: string, cardIndex: number) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== messageId || !m.questionCards) return m;
      const cards = [...m.questionCards];
      const card = cards[cardIndex];
      const currentAnswer = card.versions[card.currentVersion].answerText;
      cards[cardIndex] = { ...card, isEditing: true, editText: currentAnswer };
      return { ...m, questionCards: cards };
    }));
  };

  /** Update edit text while typing */
  const handleEditChange = (messageId: string, cardIndex: number, newText: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== messageId || !m.questionCards) return m;
      const cards = [...m.questionCards];
      cards[cardIndex] = { ...cards[cardIndex], editText: newText };
      return { ...m, questionCards: cards };
    }));
  };

  /** Auto-save on blur — updates the current version's answer text */
  const handleEditBlur = (messageId: string, cardIndex: number) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== messageId || !m.questionCards) return m;
      const cards = [...m.questionCards];
      const card = cards[cardIndex];
      const updatedVersions = [...card.versions];
      updatedVersions[card.currentVersion] = {
        ...updatedVersions[card.currentVersion],
        answerText: card.editText,
      };
      cards[cardIndex] = { ...card, versions: updatedVersions, isEditing: false, editText: '' };
      return { ...m, questionCards: cards };
    }));
  };

  /** Copy a single card's answer */
  const handleCopyCard = (card: QuestionCardState) => {
    const version = card.versions[card.currentVersion];
    const text = `Q${card.questionNumber}: ${card.questionText}\n\n${version.answerText}`;
    navigator.clipboard.writeText(text);
  };

  const handlePreviewFile = async (file: AttachedFile) => {
    setPreviewLoading(true);
    setPreviewFile({ name: file.name, documentId: file.documentId, questions: [] });
    try {
      // Find the questionnaireId from AI messages (returned after answering)
      const qId = messages.find(m => m.questionnaireId)?.questionnaireId;
      if (qId) {
        const questionsResult = await getQuestions(qId);
        if (questionsResult?.questions) {
          setPreviewFile({ name: file.name, documentId: file.documentId, questions: questionsResult.questions.map((q: any) => q.question_text) });
        }
      }
    } catch {
      // Could not load questions — might not be a questionnaire or no questionnaire record
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleExport = async (questionnaireId: string, format: 'docx' | 'xlsx' | 'md') => {
    setExportLoading(true);
    try {
      await exportQuestionnaire(questionnaireId, format);
    } catch {
      // silently fail — export might not be ready
    } finally {
      setExportLoading(false);
    }
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const tempIndex = pendingAttachments.length;
    
    // Determine file type (questionnaire if contains "question" or specific format, otherwise reference)
    const type: 'questionnaire' | 'reference' = 
      file.name.toLowerCase().includes('question') || file.name.toLowerCase().includes('quest') 
        ? 'questionnaire' 
        : 'reference';
    
    setPendingAttachments(prev => [...prev, { file, status: 'uploading', type }]);

    try {
      const uploadFn = type === 'questionnaire' ? uploadQuestionnaire : uploadReferenceDocument;
      const result = await uploadFn(file);
      const docId = result.documentId || result.questionnaireId;

      setPendingAttachments(prev =>
        prev.map((att, i) => i === tempIndex ? { ...att, status: 'processing', documentId: docId } : att)
      );

      // Poll for processing completion
      if (docId) {
        const poll = setInterval(async () => {
          try {
            const statusResult = await getDocumentStatus(docId);
            if (statusResult.status === "processed") {
              clearInterval(poll);
              setPendingAttachments(prev =>
                prev.map((att, i) => i === tempIndex ? { ...att, status: 'ready' } : att)
              );
            } else if (statusResult.status === "failed" || statusResult.status === "error") {
              clearInterval(poll);
              setPendingAttachments(prev =>
                prev.map((att, i) => i === tempIndex ? { ...att, status: 'error' } : att)
              );
            }
          } catch {
            clearInterval(poll);
          }
        }, 3000);
      }
    } catch {
      setPendingAttachments(prev =>
        prev.map((att, i) => i === tempIndex ? { ...att, status: 'error' } : att)
      );
    }
  };

  const removeAttachment = (index: number) => {
    setPendingAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col flex-1 h-full relative overflow-hidden bg-black/20 backdrop-blur-xl border-x border-white/5">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/ai-assistant')}
            className="flex items-center gap-2 px-3 py-1.5 bg-black/30 backdrop-blur-xl border border-gray-700/50 hover:bg-black/40 hover:border-gray-600/60 rounded-full transition-all text-gray-200 hover:text-white"
          >
            <ArrowLeft size={14} />
            <span className="text-xs font-medium">Back</span>
          </button>
          <h2 className="text-lg font-semibold text-white">Assistant Chat</h2>
        </div>
        <div className="flex gap-2">
           <button className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
            <MoreHorizontal size={18} />
           </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10" ref={scrollRef}>
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, x: message.role === "user" ? 20 : -20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.4 }}
              className={`flex w-full ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "user" ? (
                /* User Bubble */
                <div className="max-w-[80%] space-y-2">
                  {/* Attached Files */}
                  {message.attachedFiles && message.attachedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-end">
                      {message.attachedFiles.map((file, fi) => (
                        <button
                          key={fi}
                          onClick={() => handlePreviewFile(file)}
                          className="flex items-center gap-2 px-3 py-2 bg-emerald-700/60 backdrop-blur-md border border-emerald-500/30 rounded-xl text-white text-xs hover:bg-emerald-600/70 transition-colors cursor-pointer group"
                        >
                          <FileText size={14} className="text-emerald-300 flex-shrink-0" />
                          <span className="max-w-[180px] truncate">{file.name}</span>
                          <span className="text-[9px] uppercase bg-emerald-500/30 px-1.5 py-0.5 rounded-full text-emerald-200">
                            {file.type}
                          </span>
                          <Eye size={12} className="text-emerald-300/60 group-hover:text-emerald-200 transition-colors" />
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="bg-emerald-600/80 backdrop-blur-md text-white px-5 py-3 rounded-2xl rounded-tr-sm shadow-lg border border-emerald-500/30">
                    <p className="text-sm md:text-base leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ) : (
                /* AI Response Card */
                <div className="max-w-[85%] w-full space-y-3">
                  {/* Loading Placeholder */}
                  {message.isStreaming && !message.content && !message.questionCards ? (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Loader2 size={16} className="animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  ) : message.structuredAnswers && message.structuredAnswers.answers && message.structuredAnswers.answers.length > 0 ? (
                    /* ── Use New QuestionnaireResult Component ── */
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                      <QuestionnaireResult 
                        data={{
                          summary: message.structuredAnswers.summary,
                          totalQuestions: message.structuredAnswers.totalQuestions,
                          answeredQuestions: message.structuredAnswers.answeredQuestions,
                          overallConfidence: message.structuredAnswers.overallConfidence || 0,
                          totalCitations: message.structuredAnswers.totalCitations || 0,
                          answers: message.structuredAnswers.answers.map(a => ({
                            questionNumber: a.questionNumber,
                            questionText: a.questionText,
                            answerText: a.answerText,
                            citations: a.citations || a.sources || [],
                            evidenceSnippet: a.evidenceSnippet || a.referenceExcerpt || '',
                            confidence: a.confidence ?? 0,
                            status: a.status || 'answered',
                          })),
                        }}
                        sessionId={sessionId}
                        questionnaireDocumentType="pdf"
                        questionnaireFileName={firstMessageFiles.current?.find(f => f.type === 'questionnaire')?.name}
                      />
                    </div>
                  ) : message.questionCards && message.questionCards.length > 0 ? (
                    /* ── Structured Per-Question Cards ── */
                    <div className="space-y-4">
                      {/* Summary Banner */}
                      {message.structuredAnswers && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-5 shadow-xl"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Summary</h3>
                            <div className="flex items-center gap-3 text-xs">
                              <span className="text-gray-400">
                                <span className="text-emerald-400 font-bold">{message.structuredAnswers.answeredQuestions}</span>
                                /{message.structuredAnswers.totalQuestions} answered
                              </span>
                              {message.questionnaireId && (
                                <div className="relative group/export">
                                  <button
                                    disabled={exportLoading}
                                    className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg text-emerald-400 transition-colors disabled:opacity-50"
                                    onClick={() => handleExport(message.questionnaireId!, 'docx')}
                                  >
                                    {exportLoading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                                    Export
                                  </button>
                                  <div className="absolute bottom-full right-0 mb-1 hidden group-hover/export:flex flex-col bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden shadow-xl z-20 min-w-[120px]">
                                    <button onClick={() => handleExport(message.questionnaireId!, 'docx')} className="px-3 py-2 text-xs text-gray-300 hover:bg-emerald-500/20 hover:text-white text-left transition-colors">
                                      Word (.docx)
                                    </button>
                                    <button onClick={() => handleExport(message.questionnaireId!, 'xlsx')} className="px-3 py-2 text-xs text-gray-300 hover:bg-emerald-500/20 hover:text-white text-left transition-colors">
                                      Excel (.xlsx)
                                    </button>
                                    <button onClick={() => handleExport(message.questionnaireId!, 'md')} className="px-3 py-2 text-xs text-gray-300 hover:bg-emerald-500/20 hover:text-white text-left transition-colors">
                                      Markdown (.md)
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          {message.structuredAnswers.summary && (
                            <p className="text-gray-300 text-sm leading-relaxed">{message.structuredAnswers.summary}</p>
                          )}
                        </motion.div>
                      )}

                      {/* Individual Question Cards */}
                      {message.questionCards.map((card, cardIdx) => {
                        const currentVer = card.versions[card.currentVersion];
                        const totalVersions = card.versions.length;
                        return (
                          <motion.div
                            key={`q-${card.questionNumber}`}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: cardIdx * 0.05 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl relative overflow-hidden group/card"
                          >
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />

                            <div className="relative z-10 p-5">
                              {/* Question Header */}
                              <div className="flex items-start gap-3 mb-4">
                                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-emerald-500/20 text-emerald-400 text-sm font-bold rounded-lg">
                                  {card.questionNumber}
                                </span>
                                <p className="text-white font-medium text-sm leading-relaxed pt-1">{card.questionText}</p>
                              </div>

                              {/* Answer Section — click to edit */}
                              <div className="ml-11 mb-3">
                                {card.isEditing ? (
                                  <textarea
                                    autoFocus
                                    value={card.editText}
                                    onChange={(e) => handleEditChange(message.id, cardIdx, e.target.value)}
                                    onBlur={() => handleEditBlur(message.id, cardIdx)}
                                    className="w-full bg-white/5 border border-emerald-500/30 rounded-lg p-3 text-gray-200 text-sm leading-relaxed outline-none focus:border-emerald-500/60 resize-y min-h-[80px]"
                                    rows={4}
                                  />
                                ) : (
                                  <div
                                    onClick={() => handleStartEdit(message.id, cardIdx)}
                                    className="cursor-text rounded-lg p-3 hover:bg-white/5 transition-colors group/edit relative"
                                    title="Click to edit"
                                  >
                                    <Edit3 size={12} className="absolute top-2 right-2 text-gray-600 opacity-0 group-hover/edit:opacity-100 transition-opacity" />
                                    <div className="prose prose-invert prose-sm max-w-none prose-headings:text-emerald-400 prose-strong:text-white prose-a:text-emerald-400 prose-blockquote:border-emerald-500/50 prose-blockquote:text-gray-300 prose-li:text-gray-200 prose-code:text-emerald-300 prose-code:bg-white/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
                                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {currentVer.answerText}
                                      </ReactMarkdown>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Evidence Snippet */}
                              {currentVer.evidenceSnippet && (
                                <div className="ml-11 mb-3">
                                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">Evidence</p>
                                  <blockquote className="border-l-2 border-emerald-500/40 pl-3 py-1 text-gray-400 text-xs leading-relaxed italic bg-white/[0.02] rounded-r-lg">
                                    {currentVer.evidenceSnippet}
                                  </blockquote>
                                </div>
                              )}

                              {/* Citations */}
                              {currentVer.citations && currentVer.citations.length > 0 && (
                                <div className="ml-11 mb-3 flex flex-wrap gap-1.5">
                                  {currentVer.citations.map((src, si) => (
                                    <span key={si} className="inline-flex items-center gap-1 px-2 py-1 bg-black/20 border border-white/5 rounded-md text-[10px] text-emerald-400">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                      {src.document}{src.page ? ` p.${src.page}` : ''}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Confidence Bar */}
                              {currentVer.confidence > 0 && (
                                <div className="ml-11 mb-3 flex items-center gap-2">
                                  <span className="text-[10px] text-gray-500">Confidence:</span>
                                  <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all ${
                                        currentVer.confidence > 0.75 ? "bg-emerald-500" :
                                        currentVer.confidence >= 0.4 ? "bg-amber-500" : "bg-red-500"
                                      }`}
                                      style={{ width: `${Math.round(currentVer.confidence * 100)}%` }}
                                    />
                                  </div>
                                  <span className="text-[10px] text-gray-500">
                                    {Math.round(currentVer.confidence * 100)}%
                                  </span>
                                </div>
                              )}

                              {/* Card Action Bar */}
                              <div className="ml-11 flex items-center gap-2 pt-3 border-t border-white/5">
                                <button onClick={() => handleCopyCard(card)} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="Copy answer">
                                  <Copy size={13} />
                                </button>

                                {/* Regenerate + Version Navigation */}
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleRegenerateCard(message.id, cardIdx)}
                                    disabled={card.isRegenerating || isLoading}
                                    className="flex items-center gap-1 px-2 py-1 hover:bg-white/10 rounded-lg text-xs text-gray-400 hover:text-emerald-400 transition-colors disabled:opacity-50"
                                    title="Regenerate this answer"
                                  >
                                    {card.isRegenerating ? (
                                      <Loader2 size={12} className="animate-spin" />
                                    ) : (
                                      <RotateCcw size={12} />
                                    )}
                                    Regenerate
                                  </button>

                                  {/* Version Navigator — only show if there are multiple versions */}
                                  {totalVersions > 1 && (
                                    <div className="flex items-center gap-0.5 ml-2 bg-white/5 rounded-lg px-1 py-0.5">
                                      <button
                                        onClick={() => handleVersionNav(message.id, cardIdx, 'prev')}
                                        disabled={card.currentVersion === 0}
                                        className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                      >
                                        <ChevronLeft size={12} />
                                      </button>
                                      <span className="text-[10px] text-gray-400 px-1 select-none">
                                        Version {card.currentVersion + 1}/{totalVersions}
                                      </span>
                                      <button
                                        onClick={() => handleVersionNav(message.id, cardIdx, 'next')}
                                        disabled={card.currentVersion === totalVersions - 1}
                                        className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                      >
                                        <ChevronRight size={12} />
                                      </button>
                                    </div>
                                  )}
                                </div>

                                <div className="flex-1" />

                                {/* Status Tag */}
                                {card.status === 'not_found' && (
                                  <span className="text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                                    No match found
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    /* ── Regular AI Response (markdown blob fallback) ── */
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl relative overflow-hidden group">
                      {/* Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />

                      <div className="relative z-10 prose prose-invert max-w-none">
                        <div className="text-gray-200 text-sm md:text-base leading-relaxed mb-4 prose prose-invert prose-sm md:prose-base max-w-none prose-headings:text-emerald-400 prose-headings:font-semibold prose-h2:text-lg prose-h3:text-base prose-strong:text-white prose-a:text-emerald-400 prose-blockquote:border-emerald-500/50 prose-blockquote:text-gray-300 prose-li:text-gray-200 prose-code:text-emerald-300 prose-code:bg-white/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10 prose-hr:border-white/10 prose-th:text-emerald-400 prose-td:text-gray-300">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                          </ReactMarkdown>
                        </div>

                        {/* Confidence */}
                        {message.confidence != null && message.confidence > 0 && (
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] text-gray-500">Confidence:</span>
                            <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  message.confidence > 0.75 ? "bg-emerald-500" :
                                  message.confidence >= 0.4 ? "bg-amber-500" : "bg-red-500"
                                }`}
                                style={{ width: `${Math.round(message.confidence * 100)}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-gray-500">
                              {Math.round(message.confidence * 100)}%
                            </span>
                          </div>
                        )}
                        
                        {/* Citations */}
                        {message.citations && message.citations.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Sources</h4>
                            <div className="grid gap-2">
                              {message.citations.map((citation, ci) => {
                                const evidence = message.evidenceSnippets?.find(
                                  e => e.documentName === citation.document && (e.pageNumber === citation.page)
                                );
                                return (
                                  <div key={ci} className="bg-black/20 rounded-lg p-3 border border-white/5 hover:border-emerald-500/30 transition-colors group/citation">
                                    <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium mb-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                      {citation.document}{citation.page ? `, Page ${citation.page}` : ""}
                                    </div>
                                    {evidence && (
                                      <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                                        {evidence.chunkText.substring(0, 200)}{evidence.chunkText.length > 200 ? "..." : ""}
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Bar (regular messages) */}
                      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
                        <button onClick={() => handleCopy(message.content)} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="Copy">
                          <Copy size={14} />
                        </button>
                        <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="Helpful">
                          <ThumbsUp size={14} />
                        </button>
                        <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="Not Helpful">
                          <ThumbsDown size={14} />
                        </button>
                        <div className="flex-1" />
                        {message.questionnaireId && (
                          <div className="relative group/export">
                            <button
                              disabled={exportLoading}
                              className="flex items-center gap-1.5 px-2 py-1 hover:bg-white/10 rounded-lg text-xs text-gray-400 hover:text-emerald-400 transition-colors disabled:opacity-50"
                              title="Export answers"
                              onClick={() => handleExport(message.questionnaireId!, 'docx')}
                            >
                              {exportLoading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                              Export
                            </button>
                            <div className="absolute bottom-full right-0 mb-1 hidden group-hover/export:flex flex-col bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden shadow-xl z-20 min-w-[120px]">
                              <button onClick={() => handleExport(message.questionnaireId!, 'docx')} className="px-3 py-2 text-xs text-gray-300 hover:bg-emerald-500/20 hover:text-white text-left transition-colors">
                                Word (.docx)
                              </button>
                              <button onClick={() => handleExport(message.questionnaireId!, 'xlsx')} className="px-3 py-2 text-xs text-gray-300 hover:bg-emerald-500/20 hover:text-white text-left transition-colors">
                                Excel (.xlsx)
                              </button>
                              <button onClick={() => handleExport(message.questionnaireId!, 'md')} className="px-3 py-2 text-xs text-gray-300 hover:bg-emerald-500/20 hover:text-white text-left transition-colors">
                                Markdown (.md)
                              </button>
                            </div>
                          </div>
                        )}
                        <button onClick={() => handleRegenerate(message.id)} disabled={isLoading} className="flex items-center gap-1.5 px-2 py-1 hover:bg-white/10 rounded-lg text-xs text-gray-400 hover:text-emerald-400 transition-colors disabled:opacity-50">
                          <RotateCcw size={12} />
                          Regenerate
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-6 pb-8 bg-gradient-to-t from-black/40 to-transparent">
        {/* Attached Files (ChatGPT-style) */}
        {pendingAttachments.length > 0 && (
          <AnimatePresence>
            <div className="flex flex-wrap gap-2 max-w-5xl mx-auto mb-3">
              {pendingAttachments.map((attachment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md border ${
                    attachment.status === 'error'
                      ? 'bg-red-500/20 border-red-500/40'
                      : attachment.status === 'ready'
                      ? 'bg-emerald-500/20 border-emerald-500/40'
                      : 'bg-amber-500/20 border-amber-500/40'
                  }`}
                >
                  {attachment.status === 'uploading' || attachment.status === 'processing' ? (
                    <Loader2 size={14} className="animate-spin text-amber-400" />
                  ) : attachment.status === 'ready' ? (
                    <Check size={14} className="text-emerald-400" />
                  ) : (
                    <FileText size={14} className="text-red-400" />
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs text-white font-medium max-w-[150px] truncate">
                      {attachment.file.name}
                    </span>
                    <span className="text-[9px] text-gray-400 uppercase">
                      {attachment.status === 'uploading' ? 'Uploading...' :
                       attachment.status === 'processing' ? 'Processing...' :
                       attachment.status === 'error' ? 'Failed' : 'Ready'}
                    </span>
                  </div>
                  {(attachment.status === 'ready' || attachment.status === 'error') && (
                    <button
                      onClick={() => removeAttachment(index)}
                      className="p-0.5 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <X size={12} className="text-white" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

        <div className="flex items-end gap-3 max-w-5xl mx-auto">
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.xlsx,.doc,.xls,.md,.txt"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mb-2">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-full hover:bg-emerald-500/20 text-emerald-500/70 hover:text-emerald-400 transition-colors border border-emerald-500/20 bg-[rgba(16,185,129,0.05)] backdrop-blur-md group">
              <FileUp size={20} className="group-hover:scale-110 transition-transform" />
            </button>
            <button className="p-3 rounded-full hover:bg-emerald-500/20 text-emerald-500/70 hover:text-emerald-400 transition-colors border border-emerald-500/20 bg-[rgba(16,185,129,0.05)] backdrop-blur-md group">
              <Mic size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Input Field */}
          <motion.div 
            className="flex-1"
            animate={{ scale: isFocused ? 1.01 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <textarea
              ref={textareaRef}
             rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyPress}
              placeholder="Start typing..."
              className="w-full px-6 py-3.5 rounded-3xl text-sm md:text-base text-white placeholder:text-gray-400/70 outline-none transition-all backdrop-blur-2xl resize-none overflow-hidden"
              style={{
                background: "rgba(16, 185, 129, 0.05)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                boxShadow: isFocused ? "0 0 20px rgba(16, 185, 129, 0.15)" : "none",
                minHeight: "52px",
                maxHeight: "200px"
              }}
            />
          </motion.div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() && !pendingAttachments.some(a => a.status === 'ready')}
            className={`p-3 rounded-full mb-2 transition-all duration-300 ${
              inputValue.trim() || pendingAttachments.some(a => a.status === 'ready')
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 scale-100" 
                : "bg-white/5 text-gray-500 border border-white/5 scale-95 opacity-50 cursor-not-allowed"
            }`}
          >
            <Send size={20} />
          </button>
        </div>
        
        <div className="text-center mt-3">
          <p className="text-[10px] text-gray-500/60">
            Compliance Response AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>

      {/* Document Preview Modal */}
      <AnimatePresence>
        {previewFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setPreviewFile(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-[90%] max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <FileText size={18} className="text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{previewFile.name}</h3>
                    <p className="text-gray-400 text-xs">Uploaded Document</p>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {previewLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 size={24} className="animate-spin text-emerald-400" />
                    <span className="ml-3 text-gray-400 text-sm">Loading content...</span>
                  </div>
                ) : previewFile.questions.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
                      Questions ({previewFile.questions.length})
                    </h4>
                    {previewFile.questions.map((q, i) => (
                      <div
                        key={i}
                        className="flex gap-3 p-3 bg-white/5 rounded-lg border border-white/5"
                      >
                        <span className="text-emerald-400 font-mono text-sm flex-shrink-0 mt-0.5">
                          {i + 1}.
                        </span>
                        <p className="text-gray-300 text-sm leading-relaxed">{q}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText size={40} className="mx-auto text-gray-600 mb-3" />
                    <p className="text-gray-400 text-sm">Document content preview is not available.</p>
                    <p className="text-gray-500 text-xs mt-1">The document has been processed and embedded for AI analysis.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
