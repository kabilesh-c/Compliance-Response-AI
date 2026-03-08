"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, BarChart3, FileQuestion } from "lucide-react";
import { CoverageSummary } from "@/services/aiAssistantApi";

interface CoverageDashboardProps {
  coverage: CoverageSummary | null;
  questionnaireType?: string;
}

export default function CoverageDashboard({ coverage, questionnaireType }: CoverageDashboardProps) {
  if (!coverage) return null;

  const { totalQuestions, answeredQuestions, notFoundCount, averageConfidence } = coverage;
  const answeredPct = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
  const confPct = Math.round(averageConfidence * 100);

  const confClasses = averageConfidence > 0.75
    ? { text: "text-emerald-400", bg: "bg-emerald-500" }
    : averageConfidence >= 0.4
    ? { text: "text-amber-400", bg: "bg-amber-500" }
    : { text: "text-red-400", bg: "bg-red-500" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-5"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
          Coverage Summary
        </h3>
        {questionnaireType && questionnaireType !== "Unknown" && (
          <span className="text-[10px] font-medium text-purple-400 bg-purple-500/20 px-2.5 py-1 rounded-full">
            {questionnaireType}
          </span>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Questions */}
        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <FileQuestion size={14} className="text-blue-400" />
            <span className="text-[11px] text-gray-400">Total</span>
          </div>
          <p className="text-xl font-bold text-white">{totalQuestions}</p>
        </div>

        {/* Answered */}
        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={14} className="text-emerald-400" />
            <span className="text-[11px] text-gray-400">Answered</span>
          </div>
          <p className="text-xl font-bold text-emerald-400">{answeredQuestions}</p>
        </div>

        {/* Not Found */}
        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-red-400" />
            <span className="text-[11px] text-gray-400">Not Found</span>
          </div>
          <p className="text-xl font-bold text-red-400">{notFoundCount}</p>
        </div>

        {/* Avg Confidence */}
        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={14} className={confClasses.text} />
            <span className="text-[11px] text-gray-400">Confidence</span>
          </div>
          <p className={`text-xl font-bold ${confClasses.text}`}>{confPct}%</p>
        </div>
      </div>

      {/* Answered Progress */}
      <div>
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
          <span>Completion</span>
          <span className="text-emerald-400">{answeredPct}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${answeredPct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-emerald-500 rounded-full"
          />
        </div>
      </div>

      {/* Confidence Progress */}
      <div>
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
          <span>Average Confidence</span>
          <span className={confClasses.text}>{confPct}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confPct}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className={`h-full ${confClasses.bg} rounded-full`}
          />
        </div>
      </div>
    </motion.div>
  );
}
