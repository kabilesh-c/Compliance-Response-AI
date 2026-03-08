import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { storageService } from './storage.service';
import { ingestionService } from './ingestion.service';
// constants available if needed in future
import { createLogger } from '../../utils/logger';

const log = createLogger('SystemIngestion');

/**
 * Auto-ingests markdown documents from the knowledge_base directory
 * on server startup. Skips documents that already exist (by checksum).
 */
export class SystemIngestionService {
  private readonly knowledgeBasePath: string;

  constructor() {
    // Resolve relative to the compiled output (dist/services/document/)
    // so we go up to project root and then into the ML knowledge_base
    this.knowledgeBasePath = path.resolve(__dirname, '..', '..', '..', '..', 'ml', 'knowledge_base');
  }

  /**
   * Scans the knowledge_base directory and ingests any new or changed files.
   * Called once on server startup.
   */
  async ingestSystemDocuments(): Promise<void> {
    log.info('Starting system document ingestion', { path: this.knowledgeBasePath });

    if (!fs.existsSync(this.knowledgeBasePath)) {
      log.warn('Knowledge base directory not found, skipping system ingestion', {
        expectedPath: this.knowledgeBasePath,
      });
      return;
    }

    const files = fs.readdirSync(this.knowledgeBasePath)
      .filter(f => f.endsWith('.md'));

    if (files.length === 0) {
      log.info('No markdown files found in knowledge base');
      return;
    }

    log.info(`Found ${files.length} knowledge base documents`);

    let ingested = 0;
    let skipped = 0;

    for (const fileName of files) {
      try {
        const filePath = path.join(this.knowledgeBasePath, fileName);
        const fileBuffer = fs.readFileSync(filePath);

        // Compute checksum for deduplication
        const checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');

        // Check if already ingested
        const exists = await storageService.documentExistsByChecksum(checksum, 'system');
        if (exists) {
          log.info('System document already ingested, skipping', { fileName });
          skipped++;
          continue;
        }

        // Create document record (no storage upload for system docs — read from disk)
        const documentId = await storageService.createDocumentRecord({
          userId: null,
          organizationId: null,
          documentName: fileName,
          documentType: 'reference',
          sourceType: 'system',
          fileUrl: `file://${filePath}`,
          fileSize: fileBuffer.length,
          mimeType: 'text/markdown',
          checksum,
          uploadStatus: 'uploading',
        });

        // Process synchronously during startup
        await ingestionService.processDocument(documentId, fileBuffer, 'text/markdown', fileName);
        ingested++;

        // Delay between documents to avoid hitting Gemini API rate limits
        await new Promise(resolve => setTimeout(resolve, 5000));

      } catch (err: any) {
        log.error('Failed to ingest system document', { fileName, error: err.message });
        // Continue with remaining files — don't let one failure block others
      }
    }

    log.info('System document ingestion complete', { ingested, skipped, total: files.length });
  }
}

export const systemIngestionService = new SystemIngestionService();
