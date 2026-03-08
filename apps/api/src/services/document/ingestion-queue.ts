import { createLogger } from '../../utils/logger';

const log = createLogger('IngestionQueue');

interface QueueJob {
  id: string;
  execute: () => Promise<void>;
  retries: number;
  maxRetries: number;
}

/**
 * In-memory async job queue for document processing.
 * Processes jobs sequentially to avoid overwhelming the embedding API.
 * For production at scale, replace with BullMQ + Redis.
 */
class IngestionQueue {
  private queue: QueueJob[] = [];
  private processing = false;

  /**
   * Adds a job to the queue and starts processing if idle.
   */
  enqueue(jobId: string, execute: () => Promise<void>, maxRetries = 2): void {
    this.queue.push({ id: jobId, execute, retries: 0, maxRetries });
    log.info('Job enqueued', { jobId, queueLength: this.queue.length });

    if (!this.processing) {
      this.processNext();
    }
  }

  /**
   * Returns the current queue depth.
   */
  get length(): number {
    return this.queue.length;
  }

  /**
   * Processes jobs one at a time.
   */
  private async processNext(): Promise<void> {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const job = this.queue.shift()!;

    try {
      log.info('Processing job', { jobId: job.id, remaining: this.queue.length });
      await job.execute();
      log.info('Job completed', { jobId: job.id });
    } catch (err: any) {
      job.retries++;
      if (job.retries <= job.maxRetries) {
        log.warn('Job failed, re-queuing', { jobId: job.id, attempt: job.retries, error: err.message });
        this.queue.push(job); // Re-add to end of queue
      } else {
        log.error('Job permanently failed', { jobId: job.id, attempts: job.retries, error: err.message });
      }
    }

    // Continue to next job (defer to allow event loop)
    setImmediate(() => this.processNext());
  }
}

export const ingestionQueue = new IngestionQueue();
