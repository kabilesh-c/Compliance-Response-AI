const pdfParse = require('pdf-parse');
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { createLogger } from '../../utils/logger';

const log = createLogger('ParserService');

export interface ParsedDocument {
  text: string;
  pages: { pageNumber: number; text: string }[];
  metadata: Record<string, unknown>;
}

export interface ParsedQuestion {
  questionText: string;
  questionIndex: number;
  section?: string;
}

/**
 * Parses different document formats into structured text.
 */
export class ParserService {

  /**
   * Dispatches to the correct parser based on MIME type.
   */
  async parse(buffer: Buffer, mimeType: string, fileName: string): Promise<ParsedDocument> {
    log.info('Parsing document', { fileName, mimeType, size: buffer.length });

    // Validate non-empty buffer
    if (!buffer || buffer.length === 0) {
      throw new Error('Cannot parse an empty document');
    }

    switch (mimeType) {
      case 'application/pdf':
        return this.parsePdf(buffer);

      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return this.parseDocx(buffer);

      case 'text/plain':
      case 'text/markdown':
        return this.parseText(buffer);

      default:
        throw new Error(`Unsupported MIME type for parsing: ${mimeType}`);
    }
  }

  /**
   * Parses a PDF file, preserving page structure.
   */
  private async parsePdf(buffer: Buffer): Promise<ParsedDocument> {
    try {
      const data = await pdfParse(buffer);

      if (!data.text || data.text.trim().length === 0) {
        throw new Error('PDF appears to be empty or contains only images (no extractable text)');
      }

      // pdf-parse doesn't provide per-page text easily in all cases,
      // but it gives us numpages and the full text.
      // We split by form-feed characters which pdf-parse inserts between pages.
      const rawPages: string[] = data.text.split('\f');
      const pages = rawPages
        .map((pageText: string, i: number) => ({
          pageNumber: i + 1,
          text: this.normalizeText(pageText),
        }))
        .filter((p: { pageNumber: number; text: string }) => p.text.length > 0);

      return {
        text: this.normalizeText(data.text),
        pages: pages.length > 0 ? pages : [{ pageNumber: 1, text: this.normalizeText(data.text) }],
        metadata: {
          numPages: data.numpages,
          info: data.info,
        },
      };
    } catch (err: any) {
      if (err.message?.includes('empty')) throw err;
      log.error('PDF parsing failed', { error: err.message });
      throw new Error(`Failed to parse PDF: ${err.message}`);
    }
  }

  /**
   * Parses a DOCX file.
   */
  private async parseDocx(buffer: Buffer): Promise<ParsedDocument> {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const text = this.normalizeText(result.value);

      if (!text || text.length === 0) {
        throw new Error('DOCX document is empty');
      }

      // DOCX doesn't have page numbers natively; treat as single page
      return {
        text,
        pages: [{ pageNumber: 1, text }],
        metadata: {
          warnings: result.messages,
        },
      };
    } catch (err: any) {
      if (err.message?.includes('empty')) throw err;
      log.error('DOCX parsing failed', { error: err.message });
      throw new Error(`Failed to parse DOCX: ${err.message}`);
    }
  }

  /**
   * Parses plain text / markdown files.
   */
  private parseText(buffer: Buffer): ParsedDocument {
    const text = this.normalizeText(buffer.toString('utf-8'));

    if (!text || text.length === 0) {
      throw new Error('Text document is empty');
    }

    return {
      text,
      pages: [{ pageNumber: 1, text }],
      metadata: {},
    };
  }

  /**
   * Dispatches questionnaire parsing to the correct method based on MIME type.
   * Supports XLSX, PDF, DOCX, MD, and TXT.
   */
  async parseQuestionnaireAny(buffer: Buffer, mimeType: string, fileName: string): Promise<ParsedQuestion[]> {
    switch (mimeType) {
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return this.parseQuestionnaire(buffer);

      case 'application/pdf':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'text/plain':
      case 'text/markdown': {
        const parsed = await this.parse(buffer, mimeType, fileName);
        return this.extractQuestionsFromText(parsed.text);
      }

      default:
        throw new Error(`Unsupported questionnaire format: ${mimeType}`);
    }
  }

  /**
   * Extracts questions from unstructured text (PDF, DOCX, MD, TXT).
   * Recognizes numbered lists, bullet points, and lines ending with '?'.
   */
  private extractQuestionsFromText(text: string): ParsedQuestion[] {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const questions: ParsedQuestion[] = [];
    let currentSection: string | undefined;
    let index = 0;

    for (const line of lines) {
      // Detect section headers: lines starting with # or all-caps short lines
      const headerMatch = line.match(/^#{1,4}\s+(.+)/);
      if (headerMatch) {
        currentSection = headerMatch[1].trim();
        continue;
      }

      // Detect numbered questions: "1.", "1)", "Q1.", "Q1)", "1 -", etc.
      const numberedMatch = line.match(/^(?:Q\.?\s*)?(\d+)[.):\-]\s+(.+)/i);
      if (numberedMatch) {
        const questionText = numberedMatch[2].trim();
        if (questionText.length > 5) {
          questions.push({ questionText, questionIndex: index++, section: currentSection });
          continue;
        }
      }

      // Detect bullet points with question-like content
      const bulletMatch = line.match(/^[-•*]\s+(.+)/);
      if (bulletMatch) {
        const questionText = bulletMatch[1].trim();
        if (questionText.length > 10 && (questionText.includes('?') || /^(what|how|does|is|are|do|can|will|should|describe|explain|provide|list|identify)/i.test(questionText))) {
          questions.push({ questionText, questionIndex: index++, section: currentSection });
          continue;
        }
      }

      // Detect lines ending with '?' as questions
      if (line.endsWith('?') && line.length > 10) {
        // Strip leading numbering/bullets if any
        const cleaned = line.replace(/^[-•*\d.)Q:\s]+/, '').trim();
        if (cleaned.length > 5 && !questions.some(q => q.questionText === cleaned)) {
          questions.push({ questionText: cleaned, questionIndex: index++, section: currentSection });
        }
      }
    }

    if (questions.length === 0) {
      throw new Error('No questions could be extracted from the document. Ensure questions are numbered, bulleted, or end with "?"');
    }

    log.info('Extracted questions from text', { totalQuestions: questions.length });
    return questions;
  }

  /**
   * Parses an XLSX spreadsheet into individual questions.
   * Expects rows where the first column (or a "Question" column) contains question text.
   * Optionally recognizes a "Section" column.
   */
  parseQuestionnaire(buffer: Buffer): ParsedQuestion[] {
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });

      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error('Spreadsheet has no sheets');
      }

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: '' });

      if (rows.length === 0) {
        throw new Error('Spreadsheet has no data rows');
      }

      // Try to find "Question" and "Section" columns (case-insensitive)
      const headers = Object.keys(rows[0]);
      const questionCol = headers.find(h => /^question/i.test(h)) || headers[0];
      const sectionCol = headers.find(h => /^section/i.test(h));

      const questions: ParsedQuestion[] = [];
      let index = 0;

      for (const row of rows) {
        const questionText = String(row[questionCol] || '').trim();
        if (!questionText) continue;

        questions.push({
          questionText,
          questionIndex: index++,
          section: sectionCol ? String(row[sectionCol] || '').trim() || undefined : undefined,
        });
      }

      if (questions.length === 0) {
        throw new Error('No questions found in spreadsheet');
      }

      log.info('Parsed questionnaire', { totalQuestions: questions.length });
      return questions;

    } catch (err: any) {
      if (err.message?.includes('No questions') || err.message?.includes('no data') || err.message?.includes('no sheets')) {
        throw err;
      }
      log.error('XLSX parsing failed', { error: err.message });
      throw new Error(`Failed to parse spreadsheet: ${err.message}`);
    }
  }

  /**
   * Normalizes extracted text:
   * - Collapses excessive whitespace
   * - Removes null bytes
   * - Trims leading/trailing whitespace
   * - Preserves paragraph boundaries (double newlines)
   */
  private normalizeText(text: string): string {
    return text
      .replace(/\0/g, '')                    // Remove null bytes
      .replace(/\r\n/g, '\n')               // Normalize line endings
      .replace(/[ \t]+/g, ' ')              // Collapse horizontal whitespace
      .replace(/\n{3,}/g, '\n\n')           // Max two consecutive newlines
      .replace(/^\s+|\s+$/gm, '')           // Trim each line
      .trim();
  }
}

export const parserService = new ParserService();
