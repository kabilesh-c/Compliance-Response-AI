'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, RefreshCw, ChevronLeft, ChevronRight, Download, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { regenerateSingleQuestion } from '@/services/aiAssistantApi';

interface Citation {
  document: string;
  page: number | null;
}

interface Answer {
  questionNumber: number;
  questionText: string;
  answerText: string;
  citations: Citation[];
  evidenceSnippet: string;
  confidence: number;
  status: 'answered' | 'not_found';
}

interface StructuredResponse {
  summary: string;
  totalQuestions: number;
  answeredQuestions: number;
  overallConfidence: number;
  totalCitations: number;
  answers: Answer[];
}

interface VersionedAnswer {
  versions: Answer[];
  currentVersionIndex: number;
}

interface QuestionnaireResultProps {
  data: StructuredResponse;
  sessionId?: string;
  questionnaireDocumentType?: 'pdf' | 'docx' | 'md';
  questionnaireFileName?: string;
}

export const QuestionnaireResult: React.FC<QuestionnaireResultProps> = ({
  data,
  sessionId,
  questionnaireDocumentType = 'pdf',
  questionnaireFileName = 'questionnaire-response',
}) => {
  // Version management: Store all versions for each question
  const [versionedAnswers, setVersionedAnswers] = useState<Map<number, VersionedAnswer>>(new Map());
  
  // Editing state
  const [editingQuestionNumber, setEditingQuestionNumber] = useState<number | null>(null);
  const editableRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());
  
  // Loading state for regenerations
  const [regenerating, setRegenerating] = useState<Set<number>>(new Set());
  
  // Download dropdown state
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  // Initialize versions on mount
  useEffect(() => {
    const initialVersions = new Map<number, VersionedAnswer>();
    data.answers.forEach((answer) => {
      initialVersions.set(answer.questionNumber, {
        versions: [answer],
        currentVersionIndex: 0,
      });
    });
    setVersionedAnswers(initialVersions);
  }, [data.answers]);

  // Get current answer for a question (with version support)
  const getCurrentAnswer = (questionNumber: number): Answer | undefined => {
    const versioned = versionedAnswers.get(questionNumber);
    if (!versioned) return undefined;
    return versioned.versions[versioned.currentVersionIndex];
  };

  // Handle copy to clipboard
  const handleCopy = (text: string, questionNumber: number) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  // Handle regenerate
  const handleRegenerate = async (questionNumber: number) => {
    const currentAnswer = getCurrentAnswer(questionNumber);
    if (!currentAnswer) return;

    setRegenerating((prev) => new Set(prev).add(questionNumber));

    try {
      const newAnswer = await regenerateSingleQuestion(currentAnswer.questionText, sessionId);
      
      // Add as new version
      setVersionedAnswers((prev) => {
        const updated = new Map(prev);
        const versioned = updated.get(questionNumber);
        if (versioned) {
          versioned.versions.push(newAnswer as Answer);
          versioned.currentVersionIndex = versioned.versions.length - 1;
        }
        return updated;
      });
    } catch (error) {
      console.error('Regeneration failed:', error);
      // Could add error toast here
    } finally {
      setRegenerating((prev) => {
        const updated = new Set(prev);
        updated.delete(questionNumber);
        return updated;
      });
    }
  };

  // Handle version navigation
  const handleVersionChange = (questionNumber: number, direction: 'prev' | 'next') => {
    setVersionedAnswers((prev) => {
      const updated = new Map(prev);
      const versioned = updated.get(questionNumber);
      if (!versioned) return prev;

      if (direction === 'prev' && versioned.currentVersionIndex > 0) {
        versioned.currentVersionIndex--;
      } else if (direction === 'next' && versioned.currentVersionIndex < versioned.versions.length - 1) {
        versioned.currentVersionIndex++;
      }
      return updated;
    });
  };

  // Handle edit mode (contentEditable approach like ChatGPT)
  const handleEditStart = (questionNumber: number) => {
    setEditingQuestionNumber(questionNumber);
    // Focus the contentEditable div
    setTimeout(() => {
      const el = editableRefs.current.get(questionNumber);
      if (el) {
        el.focus();
        // Place cursor at end
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(el);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }, 0);
  };

  // Handle content change in contentEditable
  const handleContentEdit = (questionNumber: number) => {
    const el = editableRefs.current.get(questionNumber);
    if (!el) return;
    
    const newContent = el.innerText; // Use innerText to get plain text
    
    // Update version with new content
    setVersionedAnswers((prev) => {
      const updated = new Map(prev);
      const versioned = updated.get(questionNumber);
      if (versioned) {
        const currentVersion = versioned.versions[versioned.currentVersionIndex];
        currentVersion.answerText = newContent;
      }
      return updated;
    });
  };

  // Handle blur (exit edit mode)
  const handleEditBlur = (questionNumber: number) => {
    handleContentEdit(questionNumber); // Save on blur
    setEditingQuestionNumber(null);
  };

  // Download functionality
  const handleDownload = async (format: 'markdown' | 'pdf' | 'docx') => {
    // Generate formatted content using current versions
    let content = `# Questionnaire Response\n\n`;
    content += `## Summary\n${data.summary}\n\n`;
    content += `---\n\n`;
    content += `**Statistics:**\n`;
    content += `- Total Questions: ${data.totalQuestions}\n`;
    content += `- Answered: ${data.answeredQuestions}\n`;
    content += `- Citations: ${data.totalCitations}\n`;
    content += `- Overall Confidence: ${(data.overallConfidence * 100).toFixed(1)}%\n\n`;
    content += `---\n\n`;

    // Use versioned answers (current versions)
    Array.from(versionedAnswers.entries())
      .sort(([aNum], [bNum]) => aNum - bNum)
      .forEach(([questionNumber, versioned]) => {
        const currentAnswer = versioned.versions[versioned.currentVersionIndex];
        content += `## ${currentAnswer.questionNumber}. ${currentAnswer.questionText}\n\n`;
        content += `${currentAnswer.answerText}\n\n`;
        content += `**Confidence:** ${(currentAnswer.confidence * 100).toFixed(1)}%\n\n`;
        if (currentAnswer.citations.length > 0) {
          content += `**References:**\n`;
          currentAnswer.citations.forEach((cite, idx) => {
            content += `${idx + 1}. ${cite.document}${cite.page ? ` (Page ${cite.page})` : ''}\n`;
          });
          content += `\n`;
        }
        content += `---\n\n`;
      });

    // Generate filename from uploaded file name
    const baseFileName = questionnaireFileName.replace(/\.(pdf|docx|md)$/, '');
    
    if (format === 'markdown') {
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseFileName}-response.md`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      // For PDF, download as markdown for now (proper PDF would need jsPDF)
      const blob = new Blob([content], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseFileName}-response.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'docx') {
      // Create properly formatted plain text for Word
      const plainText = content.replace(/[#*`]/g, '').replace(/---/g, '\n');
      const blob = new Blob([plainText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseFileName}-response.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
    
    setShowDownloadMenu(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Summary Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="prose prose-sm max-w-none dark:prose-invert"
      >
        <p className="text-gray-800 dark:text-gray-100 leading-relaxed text-base font-medium">{data.summary}</p>
      </motion.div>

      {/* Stats Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.totalQuestions}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total Questions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{data.answeredQuestions}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Answered</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{data.totalCitations}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Citations</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {(data.overallConfidence * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Confidence</div>
        </div>
      </motion.div>

      {/* Individual Q&A Cards */}
      <div className="space-y-4">
        <AnimatePresence>
          {Array.from(versionedAnswers.entries()).map(([questionNumber, versioned], index) => {
            const answer = versioned.versions[versioned.currentVersionIndex];
            const isRegenerating = regenerating.has(questionNumber);
            const isEditing = editingQuestionNumber === questionNumber;

            return (
              <motion.div
                key={answer.questionNumber}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className={`group relative p-6 rounded-lg border transition-all duration-200 ${
                  answer.status === 'not_found'
                    ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                    : 'bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                } ${isEditing ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}
              >
                {/* Serial Number Badge */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                  {answer.questionNumber}
                </div>

                {/* Question */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {answer.questionText}
                  </h3>
                </div>

                {/* Answer (ContentEditable - ChatGPT style) */}
                <div
                  ref={(el) => {
                    if (el) editableRefs.current.set(answer.questionNumber, el);
                  }}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onInput={() => isEditing && handleContentEdit(answer.questionNumber)}
                  onBlur={() => handleEditBlur(answer.questionNumber)}
                  onClick={(e) => {
                    if (!isEditing) {
                      e.stopPropagation();
                      handleEditStart(answer.questionNumber);
                    }
                  }}
                  className={`mb-4 p-3 rounded-lg transition-all cursor-pointer ${
                    isEditing 
                      ? 'bg-gray-100 dark:bg-gray-700/50 ring-2 ring-blue-500 dark:ring-blue-400'
                      : 'bg-gray-100/50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/40'
                  }`}
                  title={isEditing ? 'Editing...' : 'Click to edit'}
                  style={{
                    minHeight: '80px',
                    outline: 'none',
                  }}
                >
                  {!isEditing && (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{answer.answerText}</ReactMarkdown>
                    </div>
                  )}
                </div>

                {/* Confidence Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <span>Confidence</span>
                    <span className="font-semibold">{(answer.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${answer.confidence * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + index * 0.05 }}
                      className={`h-full ${
                        answer.confidence > 0.75
                          ? 'bg-green-500'
                          : answer.confidence > 0.5
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Citations */}
                {answer.citations.length > 0 && (
                  <div className="mb-4 p-3 bg-gray-100/70 dark:bg-gray-700/40 rounded border border-gray-200 dark:border-gray-600">
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      References:
                    </div>
                    <div className="space-y-1">
                      {answer.citations.map((cite, idx) => (
                        <div key={idx} className="text-xs text-gray-600 dark:text-gray-400">
                          {idx + 1}. {cite.document}
                          {cite.page && <span className="text-gray-500 dark:text-gray-500"> (Page {cite.page})</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(answer.answerText, answer.questionNumber)}
                      className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                      title="Copy answer"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* Regenerate Button */}
                    <button
                      onClick={() => handleRegenerate(answer.questionNumber)}
                      disabled={isRegenerating}
                      className={`p-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition-colors ${
                        isRegenerating ? 'animate-spin' : ''
                      }`}
                      title="Regenerate answer"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Version Toggle */}
                  {versioned.versions.length > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVersionChange(answer.questionNumber, 'prev')}
                        disabled={versioned.currentVersionIndex === 0}
                        className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors"
                        title="Previous version"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium px-2">
                        Version {versioned.currentVersionIndex + 1}/{versioned.versions.length}
                      </span>
                      <button
                        onClick={() => handleVersionChange(answer.questionNumber, 'next')}
                        disabled={versioned.currentVersionIndex === versioned.versions.length - 1}
                        className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors"
                        title="Next version"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Download Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center pt-6 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="relative">
          <button
            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
          >
            <Download className="w-5 h-5" />
            <ChevronDown className={`w-4 h-4 transition-transform ${showDownloadMenu ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {showDownloadMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute bottom-full mb-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden min-w-[200px]"
              >
                <button
                  onClick={() => handleDownload('markdown')}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 text-sm"
                >
                  <div className="font-medium">Default ({questionnaireFileName})</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Markdown format</div>
                </button>
                <button
                  onClick={() => handleDownload('pdf')}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 text-sm border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="font-medium">PDF</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Portable Document Format</div>
                </button>
                <button
                  onClick={() => handleDownload('docx')}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 text-sm border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="font-medium">Word</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Plain text format</div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
