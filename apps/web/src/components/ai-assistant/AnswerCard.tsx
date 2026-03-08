"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  RotateCcw,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertTriangle,
  Loader2,
  Edit3,
  Save,
} from "lucide-react";
import { QuestionAnswer } from "@/services/aiAssistantApi";

interface AnswerCardProps {
  question: QuestionAnswer;
  onRegenerate: (questionId: string) => void;
  onApprove: (questionId: string) => void;
  isRegenerating?: boolean;
}

function confidenceColor(confidence: number) {
  if (confidence > 0.75) return { bg: "bg-emerald-500", text: "text-emerald-400", label: "High" };
  if (confidence >= 0.4) return { bg: "bg-amber-500", text: "text-amber-400", label: "Medium" };
  return { bg: "bg-red-500", text: "text-red-400", label: "Low" };
}

export default function AnswerCard({ question, onRegenerate, onApprove, isRegenerating }: AnswerCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(question.answer_text || "");

  const isNotFound = question.answer_text?.toLowerCase().includes("not found in references");
  const conf = confidenceColor(question.confidence);
  const gapAnalysis = question.answer_metadata?.gap_analysis;
  const source = question.answer_metadata?.source;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/20 transition-all"
    >
      {/* Header */}
      <div className="p-5">
        {/* Question Index + Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
              Q{question.question_index + 1}
            </span>
            {source === "memory" && (
              <span className="text-[10px] font-medium text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-full">
                From Memory
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {question.answer_status === "approved" && (
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <CheckCircle size={12} /> Approved
              </span>
            )}
            {question.answer_status === "draft" && (
              <span className="text-xs text-amber-400">Draft</span>
            )}
            {question.answer_status === "unanswered" && (
              <span className="text-xs text-gray-500">Unanswered</span>
            )}
          </div>
        </div>

        {/* Question Text */}
        <p className="text-sm text-gray-200 font-medium mb-4 leading-relaxed">
          {question.question_text}
        </p>

        {/* Answer */}
        {question.answer_text && !editing && (
          <div className={`p-4 rounded-xl mb-3 ${isNotFound ? "bg-red-500/10 border border-red-500/20" : "bg-white/5 border border-white/5"}`}>
            <p className={`text-sm leading-relaxed ${isNotFound ? "text-red-300 italic" : "text-gray-300"}`}>
              {question.answer_text}
            </p>
          </div>
        )}

        {/* Edit Mode */}
        {editing && (
          <div className="mb-3">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-4 bg-white/5 border border-emerald-500/30 rounded-xl text-sm text-gray-200 outline-none focus:border-emerald-500/60 resize-y min-h-[100px]"
              rows={4}
            />
          </div>
        )}

        {/* Confidence Bar */}
        {!isNotFound && question.confidence > 0 && (
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs text-gray-500 w-20">Confidence</span>
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.round(question.confidence * 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${conf.bg}`}
              />
            </div>
            <span className={`text-xs font-medium ${conf.text}`}>
              {Math.round(question.confidence * 100)}% {conf.label}
            </span>
          </div>
        )}

        {/* Gap Analysis */}
        {isNotFound && gapAnalysis && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={14} className="text-amber-400" />
              <span className="text-xs font-semibold text-amber-400">Missing Documentation</span>
            </div>
            <p className="text-xs text-amber-200">
              <strong>{gapAnalysis.missingDocumentName}</strong> — {gapAnalysis.reason}
            </p>
          </div>
        )}

        {/* Expandable: Citations + Evidence */}
        {question.citations?.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors mb-2"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {question.citations.length} Source{question.citations.length > 1 ? "s" : ""} • {question.evidence_snippets?.length || 0} Evidence Snippet{(question.evidence_snippets?.length || 0) > 1 ? "s" : ""}
          </button>
        )}

        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="space-y-2 mb-3"
          >
            {/* Citations */}
            {question.citations?.map((c, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 bg-black/20 rounded-lg border border-white/5">
                <FileText size={12} className="text-emerald-400 shrink-0" />
                <span className="text-xs text-gray-300">
                  {c.document}{c.page ? `, Page ${c.page}` : ""}
                </span>
              </div>
            ))}

            {/* Evidence Snippets */}
            {question.evidence_snippets?.map((e, i) => (
              <div key={`ev-${i}`} className="px-3 py-2 bg-black/20 rounded-lg border border-white/5">
                <p className="text-[11px] text-gray-400 italic line-clamp-3">"{e.chunkText}"</p>
                <p className="text-[10px] text-emerald-400 mt-1 font-medium">
                  {e.documentName}{e.pageNumber ? `, p.${e.pageNumber}` : ""}
                </p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Action Bar */}
        <div className="flex items-center gap-2 pt-3 border-t border-white/5">
          {/* Regenerate */}
          <button
            onClick={() => onRegenerate(question.id)}
            disabled={isRegenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-emerald-400 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
          >
            {isRegenerating ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <RotateCcw size={12} />
            )}
            Regenerate
          </button>

          {/* Edit */}
          {question.answer_status === "draft" && !editing && (
            <button
              onClick={() => { setEditing(true); setEditText(question.answer_text || ""); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-blue-400 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Edit3 size={12} />
              Edit
            </button>
          )}

          {editing && (
            <button
              onClick={() => setEditing(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <Save size={12} />
              Save
            </button>
          )}

          <div className="flex-1" />

          {/* Approve */}
          {question.answer_status === "draft" && (
            <button
              onClick={() => onApprove(question.id)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-emerald-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
            >
              <CheckCircle size={12} />
              Approve
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
