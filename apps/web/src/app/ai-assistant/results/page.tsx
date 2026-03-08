"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Download, Loader2, RefreshCw, ChevronDown } from "lucide-react";
import AnswerCard from "@/components/ai-assistant/AnswerCard";
import CoverageDashboard from "@/components/ai-assistant/CoverageDashboard";
import {
  getQuestions,
  getCoverage,
  regenerateAnswer,
  approveAnswer,
  generateAnswers,
  exportQuestionnaire,
  type QuestionAnswer,
  type CoverageSummary,
} from "@/services/aiAssistantApi";

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const questionnaireId = searchParams.get("id");

  const [questions, setQuestions] = useState<QuestionAnswer[]>([]);
  const [coverage, setCoverage] = useState<CoverageSummary | null>(null);
  const [questionnaireType, setQuestionnaireType] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchData = useCallback(async () => {
    if (!questionnaireId) return;
    try {
      const [questionsRes, coverageRes] = await Promise.all([
        getQuestions(questionnaireId),
        getCoverage(questionnaireId),
      ]);
      setQuestions(questionsRes.questions);
      setCoverage(coverageRes);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load results");
    } finally {
      setLoading(false);
    }
  }, [questionnaireId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGenerate = async () => {
    if (!questionnaireId) return;
    setGenerating(true);
    try {
      await generateAnswers(questionnaireId);
      // Poll until processing completes
      const poll = setInterval(async () => {
        try {
          const cov = await getCoverage(questionnaireId);
          if (cov.answeredQuestions > 0 || cov.notFoundCount > 0) {
            clearInterval(poll);
            await fetchData();
            setGenerating(false);
          }
        } catch {
          // continue polling
        }
      }, 3000);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to generate answers");
      setGenerating(false);
    }
  };

  const handleRegenerate = async (questionId: string) => {
    setRegeneratingId(questionId);
    try {
      const result = await regenerateAnswer(questionId);
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? {
                ...q,
                answer_text: result.answer_text ?? result.answerText ?? q.answer_text,
                confidence: result.confidence ?? q.confidence,
                citations: result.citations ?? q.citations,
                answer_status: "draft" as const,
              }
            : q
        )
      );
      // Refresh coverage
      if (questionnaireId) {
        const cov = await getCoverage(questionnaireId);
        setCoverage(cov);
      }
    } catch {
      // silently fail
    } finally {
      setRegeneratingId(null);
    }
  };

  const handleApprove = async (questionId: string) => {
    try {
      await approveAnswer(questionId);
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId ? { ...q, answer_status: "approved" as const } : q
        )
      );
    } catch {
      // silently fail
    }
  };

  const handleExport = async (format: 'xlsx' | 'pdf' | 'docx' | 'md') => {
    if (!questionnaireId) return;
    setExporting(true);
    setShowExportMenu(false);
    try {
      await exportQuestionnaire(questionnaireId, format);
    } catch {
      setError("Failed to export questionnaire");
    } finally {
      setExporting(false);
    }
  };

  if (!questionnaireId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">No questionnaire ID provided.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 -z-20"
        style={{
          background:
            "linear-gradient(180deg, #0a0a0a 0%, #0d1f0d 30%, #0a1a1a 60%, #0a0a0a 100%)",
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-black/40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/ai-assistant")}
              className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all"
            >
              <ArrowLeft size={16} />
              <span className="text-sm">Back</span>
            </motion.button>
            <div>
              <h1 className="text-lg font-semibold text-white">
                Questionnaire Results
              </h1>
              <p className="text-xs text-gray-500">
                {questions.length > 0
                  ? `${questions.length} questions`
                  : "Loading..."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Export dropdown */}
            {questions.length > 0 && questions.some(q => q.answer_text) && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  disabled={exporting}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-gray-300 text-sm font-medium rounded-xl hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
                >
                  {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                  Export
                  <ChevronDown size={12} />
                </motion.button>
                <AnimatePresence>
                  {showExportMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute right-0 top-full mt-2 w-44 bg-gray-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
                    >
                      {([
                        { format: 'xlsx' as const, label: 'Excel (.xlsx)' },
                        { format: 'pdf' as const, label: 'PDF (.pdf)' },
                        { format: 'docx' as const, label: 'Word (.docx)' },
                        { format: 'md' as const, label: 'Markdown (.md)' },
                      ]).map(({ format, label }) => (
                        <button
                          key={format}
                          onClick={() => handleExport(format)}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                        >
                          {label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            {!generating && questions.length > 0 && questions.every(q => q.answer_status === "unanswered") && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleGenerate}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-xl hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
              >
                <RefreshCw size={14} />
                Generate Answers
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={32} className="text-emerald-400 animate-spin" />
            <p className="text-gray-400 text-sm">Loading results...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={fetchData}
              className="px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:text-white transition-colors"
            >
              Retry
            </button>
          </div>
        ) : generating ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={32} className="text-emerald-400 animate-spin" />
            <p className="text-gray-400 text-sm">
              Generating answers... This may take a few minutes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left - Answers */}
            <div className="lg:col-span-3 space-y-4">
              <AnimatePresence>
                {questions.map((q) => (
                  <AnswerCard
                    key={q.id}
                    question={q}
                    onRegenerate={handleRegenerate}
                    onApprove={handleApprove}
                    isRegenerating={regeneratingId === q.id}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Right - Dashboard */}
            <div className="lg:col-span-1 space-y-4">
              <div className="sticky top-24">
                <CoverageDashboard
                  coverage={coverage}
                  questionnaireType={questionnaireType}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 size={32} className="text-emerald-400 animate-spin" />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
