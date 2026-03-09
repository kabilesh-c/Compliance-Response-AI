'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, RefreshCw, ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { regenerateSingleQuestion } from '@/services/aiAssistantApi';

interface Citation {
  document: string;
  page: number | null;
  snippet?: string;
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
  questionnaireFileName,
}) => {
  // Version management: Store all versions for each question
  const [versionedAnswers, setVersionedAnswers] = useState<Map<number, VersionedAnswer>>(new Map());
  
  // Editing state
  const [editingQuestionNumber, setEditingQuestionNumber] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<{ [key: number]: string }>({});
  
  // Loading state for regenerations
  const [regenerating, setRegenerating] = useState<Set<number>>(new Set());
  
  // Download dropdown state
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  // Close download menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
        setShowDownloadMenu(false);
      }
    };
    
    if (showDownloadMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDownloadMenu]);

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

  // Sanitize markdown from answer text
  const sanitizeAnswerText = (text: string): string => {
    return text
      // Remove markdown headings
      .replace(/^#{1,6}\s+/gm, '')
      // Remove bold/italic markers
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      // Remove code backticks
      .replace(/`(.+?)`/g, '$1')
      // Remove bullet markers and convert to clean list
      .replace(/^\*\s+/gm, '')
      .replace(/^-\s+/gm, '')
      // Clean up extra whitespace
      .trim();
  };

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
      
      // Add as new version (properly clone to trigger React re-render)
      setVersionedAnswers((prev) => {
        const updated = new Map(prev);
        const versioned = updated.get(questionNumber);
        if (versioned) {
          // Create new object instead of mutating existing one
          updated.set(questionNumber, {
            versions: [...versioned.versions, newAnswer as Answer],
            currentVersionIndex: versioned.versions.length, // Point to new version
          });
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

      let newIndex = versioned.currentVersionIndex;
      if (direction === 'prev' && newIndex > 0) {
        newIndex--;
      } else if (direction === 'next' && newIndex < versioned.versions.length - 1) {
        newIndex++;
      }
      
      // Only update if index actually changed (create new object to trigger re-render)
      if (newIndex !== versioned.currentVersionIndex) {
        updated.set(questionNumber, {
          ...versioned,
          currentVersionIndex: newIndex,
        });
      }
      
      return updated;
    });
  };

  // Handle auto-save with debounce
  const handleAutoSave = (questionNumber: number, newText: string) => {
    // Update the versioned answers immediately for UI (properly clone)
    setVersionedAnswers((prev) => {
      const updated = new Map(prev);
      const versioned = updated.get(questionNumber);
      if (versioned) {
        const updatedVersions = [...versioned.versions];
        updatedVersions[versioned.currentVersionIndex] = {
          ...updatedVersions[versioned.currentVersionIndex],
          answerText: newText
        };
        updated.set(questionNumber, {
          ...versioned,
          versions: updatedVersions
        });
      }
      return updated;
    });

    // TODO: Call backend API to persist changes
    // debounced call to: PATCH /api/questions/:id with { answerText: newText }
  };

  // Debounce helper
  const useDebounce = (callback: Function, delay: number) => {
    const timeoutRef = useRef<NodeJS.Timeout>();
    
    return (...args: any[]) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    };
  };

  const debouncedSave = useDebounce(handleAutoSave, 1000);

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

    // Generate filename from questionnaire name or use default
    const baseFileName = questionnaireFileName 
      ? questionnaireFileName.replace(/\.[^/.]+$/, '') // Remove extension
      : 'questionnaire-response';

    if (format === 'docx') {
      // Convert markdown to RTF-like format for better Word compatibility
      const rtfContent = convertMarkdownToRTF(content);
      const blob = new Blob([rtfContent], { type: 'application/rtf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseFileName}.rtf`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      // Generate clean HTML for PDF printing
      const htmlContent = generatePrintableHTML(content, baseFileName);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
    } else {
      // Markdown format
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseFileName}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
    
    setShowDownloadMenu(false);
  };

  // Helper function to convert markdown to RTF for Word compatibility
  const convertMarkdownToRTF = (markdown: string): string => {
    let rtf = '{\\rtf1\\ansi\\deff0\n';
    rtf += '{\\fonttbl{\\f0 Arial;}}{\\colortbl;\\red0\\green0\\blue0;}\n';
    rtf += '\\viewkind4\\uc1\\pard\\f0\\fs24\n';
    
    // First, clean the markdown content
    const cleanedMarkdown = markdown
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1')      // Remove italic
      .replace(/`(.*?)`/g, '$1')        // Remove code
      .replace(/#{1,6}\s+/g, '');       // Remove # from headers
    
    const lines = cleanedMarkdown.split('\n');
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) {
        rtf += '\\par\n';
      } else if (trimmed.startsWith('---')) {
        rtf += '\\par\\pard\\brdrb\\brdrs\\brdrw10\\brsp20\\par\\pard\n';
      } else if (trimmed.match(/^\d+\./)) {
        // Numbered list
        rtf += `${trimmed}\\par\n`;
      } else if (trimmed.startsWith('- ')) {
        // Bullet point
        rtf += `\\bullet ${trimmed.substring(2)}\\par\n`;
      } else {
        rtf += `${trimmed}\\par\n`;
      }
    });
    
    rtf += '}';
    return rtf;
  };

  // Helper function to generate clean HTML for PDF printing
  const generatePrintableHTML = (markdown: string, title: string): string => {
    // Clean markdown and convert to HTML
    const cleanText = markdown
      .replace(/#{1,6}\s+/g, '')         // Remove # headers
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>')              // Italic
      .replace(/`(.*?)`/g, '<code>$1</code>')            // Code
      .replace(/^---$/gm, '<hr />')                       // Horizontal rule
      .replace(/^- (.+)$/gm, '<li>$1</li>')              // List items
      .replace(/\n\n/g, '</p><p>')                        // Paragraphs
      .replace(/<li>/g, '<ul><li>')                       // Start ul
      .replace(/<\/li>\n(?!<li>)/g, '</li></ul>');       // End ul
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          @media print {
            body { margin: 0; }
            @page { margin: 2cm; }
          }
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            color: #333;
          }
          h1 { font-size: 24px; margin-bottom: 20px; }
          h2 { font-size: 20px; margin-top: 20px; margin-bottom: 10px; }
          p { margin: 10px 0; }
          ul { margin: 5px 0; padding-left: 20px; }
          li { margin: 5px 0; }
          hr { border: 1px solid #ccc; margin: 20px 0; }
          strong { font-weight: bold; }
          code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <p>${cleanText}</p>
      </body>
      </html>
    `;
  };

  return (
    <div className="w-full space-y-6">
      {/* Summary Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ backgroundColor: 'rgba(19, 78, 74, 0.3)' }}
        className="p-4 backdrop-blur-sm rounded-lg border border-teal-600/30"
      >
        <div className="text-xs font-semibold text-emerald-400 mb-2 uppercase tracking-wide">SUMMARY</div>
        <p className="text-white leading-relaxed text-sm">{data.summary}</p>
      </motion.div>

      {/* Stats Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ 
          backgroundColor: 'rgba(19, 78, 74, 0.3)',
          backgroundImage: 'linear-gradient(to right, rgba(6, 78, 59, 0.4), rgba(19, 78, 74, 0.4))'
        }}
        className="grid grid-cols-4 gap-4 p-4 backdrop-blur-md rounded-lg border border-emerald-600/30"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{data.totalQuestions}</div>
          <div className="text-xs text-gray-300 mt-1">Total Questions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{data.answeredQuestions}</div>
          <div className="text-xs text-gray-300 mt-1">Answered</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{data.totalCitations}</div>
          <div className="text-xs text-gray-300 mt-1">Citations</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400">
            {(data.overallConfidence * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-gray-300 mt-1">Confidence</div>
        </div>
      </motion.div>

      {/* Individual Q&A Cards */}
      <div className="space-y-4">
        <AnimatePresence>
          {Array.from(versionedAnswers.entries()).map(([questionNumber, versioned], index) => {
            const answer = versioned.versions[versioned.currentVersionIndex];
            const isRegenerating = regenerating.has(questionNumber);
            const sanitizedAnswer = sanitizeAnswerText(answer.answerText);

            return (
              <motion.div
                key={answer.questionNumber}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                style={{ backgroundColor: 'rgba(19, 78, 74, 0.3)' }}
                className={`group relative p-6 rounded-lg border transition-all duration-200 backdrop-blur-md ${
                  answer.status === 'not_found'
                    ? 'border-red-600/30'
                    : 'border-teal-600/30 hover:border-emerald-500/50'
                }`}
              >
                {/* Serial Number Badge */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                  {answer.questionNumber}
                </div>

                {/* Question (Editable) */}
                <div
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => {
                    const newText = e.currentTarget.textContent || '';
                    if (newText !== answer.questionText) {
                      debouncedSave(answer.questionNumber, newText);
                    }
                  }}
                  className="mb-4 text-lg font-semibold text-white focus:outline-none cursor-text"
                >
                  {answer.questionText}
                </div>

                {/* Answer (Seamless Editable) */}
                <div
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onInput={(e) => {
                    const newText = e.currentTarget.textContent || '';
                    debouncedSave(answer.questionNumber, newText);
                  }}
                  className="mb-4 text-gray-100 text-sm leading-relaxed min-h-[100px] focus:outline-none cursor-text whitespace-pre-wrap"
                >
                  {sanitizedAnswer}
                </div>

                {/* Confidence Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-300 mb-1">
                    <span>Confidence</span>
                    <span className="font-semibold">{(answer.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
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

                {/* References with Evidence Snippets (Editable) */}
                {answer.citations.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-emerald-400 mb-3">
                      References:
                    </div>
                    <div
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      className="space-y-2 focus:outline-none cursor-text"
                    >
                      {answer.citations.map((cite, idx) => (
                        <div 
                          key={idx} 
                          className="bg-emerald-900/30 border-l-2 border-emerald-400 rounded-lg p-3"
                        >
                          {/* Document Name and Page */}
                          <div className="text-xs font-medium text-emerald-300 mb-1">
                            {idx + 1}. {cite.document}
                            {cite.page && <span className="text-gray-400"> (Page {cite.page})</span>}
                          </div>
                          {/* Supporting Text Snippet (Clean format without markdown) */}
                          {cite.snippet && (
                            <div className="text-xs text-gray-400 leading-relaxed">
                              {sanitizeAnswerText(cite.snippet)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-teal-700/30">
                  <div className="flex items-center gap-2">
                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(answer.answerText, answer.questionNumber)}
                      className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-900/30 rounded transition-colors"
                      title="Copy answer"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* Regenerate Button */}
                    <button
                      onClick={() => handleRegenerate(answer.questionNumber)}
                      disabled={isRegenerating}
                      className={`p-2 text-gray-400 hover:text-green-400 hover:bg-green-900/30 rounded transition-colors ${
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
                        className="p-1 text-gray-400 hover:text-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors"
                        title="Previous version"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-gray-300 font-medium px-2">
                        Version {versioned.currentVersionIndex + 1}/{versioned.versions.length}
                      </span>
                      <button
                        onClick={() => handleVersionChange(answer.questionNumber, 'next')}
                        disabled={versioned.currentVersionIndex === versioned.versions.length - 1}
                        className="p-1 text-gray-400 hover:text-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors"
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
        className="flex justify-center pt-6 border-t border-teal-700/30 relative"
      >
        <div className="relative" ref={downloadMenuRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
          >
            <Download className="w-5 h-5" />
            <span>Download</span>
          </motion.button>
          
          {/* Dropdown Menu */}
          <AnimatePresence>
            {showDownloadMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-gray-900 border border-teal-600/30 rounded-lg shadow-xl overflow-hidden backdrop-blur-md"
              >
                <button
                  onClick={() => handleDownload('markdown')}
                  className="w-full px-4 py-3 text-left text-white hover:bg-emerald-600/20 transition-colors flex items-center gap-3 border-b border-teal-700/30"
                >
                  <FileText className="w-4 h-4" />
                  <div>
                    <div className="font-medium text-sm">Default (Markdown)</div>
                    <div className="text-xs text-gray-400">{questionnaireFileName || 'questionnaire-response'}.md</div>
                  </div>
                </button>
                <button
                  onClick={() => handleDownload('pdf')}
                  className="w-full px-4 py-3 text-left text-white hover:bg-red-600/20 transition-colors flex items-center gap-3 border-b border-teal-700/30"
                >
                  <FileText className="w-4 h-4 text-red-400" />
                  <div>
                    <div className="font-medium text-sm">PDF</div>
                    <div className="text-xs text-gray-400">{questionnaireFileName?.replace(/\.[^/.]+$/, '') || 'questionnaire-response'}.pdf</div>
                  </div>
                </button>
                <button
                  onClick={() => handleDownload('docx')}
                  className="w-full px-4 py-3 text-left text-white hover:bg-blue-600/20 transition-colors flex items-center gap-3"
                >
                  <Download className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="font-medium text-sm">Word Document</div>
                    <div className="text-xs text-gray-400">{questionnaireFileName?.replace(/\.[^/.]+$/, '') || 'questionnaire-response'}.rtf</div>
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
