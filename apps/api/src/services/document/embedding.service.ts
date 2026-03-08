import { genAI } from '../../config/gemini';
import { DOCUMENT_CONSTANTS } from '../../config/constants';
import { createLogger } from '../../utils/logger';

const log = createLogger('EmbeddingService');

/**
 * Generates vector embeddings using the Gemini API.
 * Handles batching, rate limiting, and retries.
 */
export class EmbeddingService {
  private readonly model = 'gemini-embedding-001';

  /**
   * Generates an embedding for a single text string.
   */
  async embedText(text: string): Promise<number[]> {
    const result = await this.embedBatch([text]);
    return result[0];
  }

  /**
   * Generates embeddings for a batch of text strings.
   * Automatically splits into sub-batches to respect API limits.
   */
  async embedBatch(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return [];

    const allEmbeddings: number[][] = [];
    const batchSize = DOCUMENT_CONSTANTS.EMBEDDING_BATCH_SIZE;

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(texts.length / batchSize);

      log.info('Processing embedding batch', {
        batch: batchNum,
        total: totalBatches,
        size: batch.length,
      });

      const embeddings = await this.embedBatchWithRetry(batch);
      allEmbeddings.push(...embeddings);

      // Rate limit: pause between batches
      if (i + batchSize < texts.length) {
        await this.sleep(DOCUMENT_CONSTANTS.EMBEDDING_RATE_LIMIT_DELAY_MS);
      }
    }

    return allEmbeddings;
  }

  /**
   * Embeds a single batch with retry logic.
   */
  private async embedBatchWithRetry(texts: string[]): Promise<number[][]> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= DOCUMENT_CONSTANTS.EMBEDDING_RETRY_ATTEMPTS; attempt++) {
      try {
        const embeddingModel = genAI.getGenerativeModel(
          { model: this.model },
        );

        const result = await embeddingModel.batchEmbedContents({
          requests: texts.map(text => ({
            content: { role: 'user', parts: [{ text }] },
            outputDimensionality: 768,
          })),
        });

        if (!result.embeddings || result.embeddings.length !== texts.length) {
          throw new Error(
            `Embedding count mismatch: expected ${texts.length}, got ${result.embeddings?.length ?? 0}`
          );
        }

        return result.embeddings.map(e => e.values);

      } catch (err: any) {
        lastError = err;
        const isRateLimit = err.status === 429 || err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED');
        const delay = isRateLimit
          ? DOCUMENT_CONSTANTS.EMBEDDING_RETRY_DELAY_MS * attempt * 3  // Longer backoff for rate limits
          : DOCUMENT_CONSTANTS.EMBEDDING_RETRY_DELAY_MS * attempt;

        log.warn(`Embedding attempt ${attempt} failed`, {
          error: err.message,
          isRateLimit,
          retryIn: delay,
        });

        if (attempt < DOCUMENT_CONSTANTS.EMBEDDING_RETRY_ATTEMPTS) {
          await this.sleep(delay);
        }
      }
    }

    throw new Error(`Embedding generation failed after ${DOCUMENT_CONSTANTS.EMBEDDING_RETRY_ATTEMPTS} attempts: ${lastError?.message}`);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const embeddingService = new EmbeddingService();
