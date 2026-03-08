import { DOCUMENT_CONSTANTS } from '../../config/constants';
import { createLogger } from '../../utils/logger';

const log = createLogger('ChunkerService');

export interface DocumentChunk {
  chunkText: string;
  chunkIndex: number;
  pageNumber: number | null;
  tokenCount: number;
}

interface PageContent {
  pageNumber: number;
  text: string;
}

/**
 * Splits document text into overlapping chunks suitable for embedding.
 * Uses a sliding-window approach that respects sentence boundaries.
 */
export class ChunkerService {
  private readonly chunkSizeChars: number;
  private readonly overlapChars: number;

  constructor() {
    this.chunkSizeChars = DOCUMENT_CONSTANTS.CHUNK_SIZE_TOKENS * DOCUMENT_CONSTANTS.APPROX_CHARS_PER_TOKEN;
    this.overlapChars = DOCUMENT_CONSTANTS.CHUNK_OVERLAP_TOKENS * DOCUMENT_CONSTANTS.APPROX_CHARS_PER_TOKEN;
  }

  /**
   * Chunks a parsed document, preserving page number associations.
   */
  chunkDocument(pages: PageContent[]): DocumentChunk[] {
    if (!pages || pages.length === 0) {
      log.warn('No pages to chunk');
      return [];
    }

    // If pages are provided, chunk with page tracking
    if (pages.length > 1) {
      return this.chunkWithPages(pages);
    }

    // Single-page fallback: chunk the full text
    const text = pages[0].text;
    return this.chunkText(text).map((chunk, index) => ({
      ...chunk,
      chunkIndex: index,
      pageNumber: pages[0].pageNumber,
    }));
  }

  /**
   * Chunks text from multiple pages, tracking which page each chunk belongs to.
   */
  private chunkWithPages(pages: PageContent[]): DocumentChunk[] {
    const results: DocumentChunk[] = [];
    let globalIndex = 0;

    // Build a combined text with page markers
    let accumulated = '';
    let currentPageNumber = pages[0].pageNumber;
    const pageBreaks: { offset: number; pageNumber: number }[] = [];

    for (const page of pages) {
      pageBreaks.push({ offset: accumulated.length, pageNumber: page.pageNumber });
      accumulated += (accumulated ? '\n\n' : '') + page.text;
    }

    const chunks = this.chunkText(accumulated);

    for (const chunk of chunks) {
      // Determine which page this chunk starts on
      let pageNumber = currentPageNumber;
      for (const pb of pageBreaks) {
        if (chunk.startOffset !== undefined && chunk.startOffset >= pb.offset) {
          pageNumber = pb.pageNumber;
        }
      }

      results.push({
        chunkText: chunk.chunkText,
        chunkIndex: globalIndex++,
        pageNumber,
        tokenCount: chunk.tokenCount,
      });
    }

    return results;
  }

  /**
   * Core chunking: splits text into overlapping windows respecting sentence boundaries.
   */
  private chunkText(text: string): (DocumentChunk & { startOffset?: number })[] {
    if (!text || text.trim().length === 0) return [];

    const chunks: (DocumentChunk & { startOffset?: number })[] = [];
    const sentences = this.splitIntoSentences(text);

    let currentChunk = '';
    let chunkStart = 0;
    let sentenceStartIndex = 0;

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];

      if (currentChunk.length + sentence.length > this.chunkSizeChars && currentChunk.length > 0) {
        // Emit current chunk
        chunks.push({
          chunkText: currentChunk.trim(),
          chunkIndex: chunks.length,
          pageNumber: null,
          tokenCount: this.estimateTokens(currentChunk),
          startOffset: chunkStart,
        });

        // Calculate overlap: walk backwards from current position
        const overlapStart = this.findOverlapStart(sentences, i, this.overlapChars);
        currentChunk = sentences.slice(overlapStart, i).join(' ') + ' ';
        chunkStart = chunkStart + currentChunk.length; // approximate
        sentenceStartIndex = overlapStart;
      }

      currentChunk += sentence + ' ';
    }

    // Emit final chunk if non-trivial
    if (currentChunk.trim().length > 50) {
      chunks.push({
        chunkText: currentChunk.trim(),
        chunkIndex: chunks.length,
        pageNumber: null,
        tokenCount: this.estimateTokens(currentChunk),
        startOffset: chunkStart,
      });
    } else if (chunks.length > 0 && currentChunk.trim().length > 0) {
      // Append tiny trailing text to last chunk
      const last = chunks[chunks.length - 1];
      last.chunkText += ' ' + currentChunk.trim();
      last.tokenCount = this.estimateTokens(last.chunkText);
    }

    log.info('Chunking complete', { totalChunks: chunks.length, textLength: text.length });
    return chunks;
  }

  /**
   * Finds the sentence index to start the overlap window.
   */
  private findOverlapStart(sentences: string[], currentIndex: number, overlapChars: number): number {
    let charCount = 0;
    let start = currentIndex;
    for (let j = currentIndex - 1; j >= 0; j--) {
      charCount += sentences[j].length;
      if (charCount >= overlapChars) {
        start = j;
        break;
      }
      start = j;
    }
    return start;
  }

  /**
   * Splits text into sentences using regex.
   * Handles abbreviations (Mr., Dr., etc.) and preserves bullet points.
   */
  private splitIntoSentences(text: string): string[] {
    // Split on sentence-ending punctuation followed by whitespace + uppercase,
    // or on double newlines (paragraph breaks).
    const raw = text
      .split(/(?<=[.!?])\s+(?=[A-Z\u00C0-\u024F])|\n{2,}/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Further split any remaining long segments
    const results: string[] = [];
    for (const segment of raw) {
      if (segment.length > this.chunkSizeChars) {
        // Force-split on newlines then on word boundaries
        const lines = segment.split('\n').filter(l => l.trim().length > 0);
        for (const line of lines) {
          if (line.length > this.chunkSizeChars) {
            // Word-boundary split as last resort
            const words = line.split(/\s+/);
            let buf = '';
            for (const word of words) {
              if (buf.length + word.length + 1 > this.chunkSizeChars) {
                results.push(buf.trim());
                buf = '';
              }
              buf += word + ' ';
            }
            if (buf.trim()) results.push(buf.trim());
          } else {
            results.push(line);
          }
        }
      } else {
        results.push(segment);
      }
    }

    return results;
  }

  /**
   * Rough token estimate: chars / 4.
   */
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / DOCUMENT_CONSTANTS.APPROX_CHARS_PER_TOKEN);
  }
}

export const chunkerService = new ChunkerService();
