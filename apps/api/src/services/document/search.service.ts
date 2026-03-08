import { supabase } from '../../config/supabase';
import { DOCUMENT_CONSTANTS } from '../../config/constants';
import { embeddingService } from './embedding.service';
import { createLogger } from '../../utils/logger';

const log = createLogger('SearchService');

export interface SearchResult {
  id: string;
  documentId: string;
  chunkText: string;
  chunkIndex: number;
  pageNumber: number | null;
  metadata: Record<string, unknown>;
  documentName: string;
  documentType: string;
  sourceType: string;
  similarity: number;
}

/**
 * Performs semantic similarity search over document chunks using pgvector.
 */
export class SearchService {

  /**
   * Searches for the most relevant document chunks matching a query.
   */
  async search(params: {
    query: string;
    userId?: string;
    organizationId?: string;
    topK?: number;
    similarityThreshold?: number;
  }): Promise<SearchResult[]> {
    const topK = Math.min(
      params.topK || DOCUMENT_CONSTANTS.DEFAULT_TOP_K,
      DOCUMENT_CONSTANTS.MAX_TOP_K
    );
    const threshold = params.similarityThreshold ?? DOCUMENT_CONSTANTS.DEFAULT_SIMILARITY_THRESHOLD;

    log.info('Performing semantic search', {
      queryLength: params.query.length,
      topK,
      threshold,
      userId: params.userId,
    });

    // 1. Generate query embedding
    const queryEmbedding = await embeddingService.embedText(params.query);

    // 2. Call the pgvector search function
    const { data, error } = await supabase.rpc('match_document_chunks', {
      query_embedding: queryEmbedding,
      match_count: topK,
      filter_user_id: params.userId || null,
      filter_org_id: params.organizationId || null,
      similarity_threshold: threshold,
    });

    if (error) {
      log.error('Vector search failed', { error: error.message });
      throw new Error(`Search failed: ${error.message}`);
    }

    const results: SearchResult[] = (data || []).map((row: any) => ({
      id: row.id,
      documentId: row.document_id,
      chunkText: row.chunk_text,
      chunkIndex: row.chunk_index,
      pageNumber: row.page_number,
      metadata: row.metadata || {},
      documentName: row.document_name,
      documentType: row.document_type,
      sourceType: row.source_type,
      similarity: row.similarity,
    }));

    log.info('Search complete', { resultsCount: results.length });
    return results;
  }
}

export const searchService = new SearchService();
