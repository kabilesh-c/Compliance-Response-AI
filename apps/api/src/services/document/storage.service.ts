import crypto from 'crypto';
import path from 'path';
import { supabase, STORAGE_BUCKET } from '../../config/supabase';
import { DOCUMENT_CONSTANTS } from '../../config/constants';
import { createLogger } from '../../utils/logger';

const log = createLogger('StorageService');

export interface StorageUploadResult {
  fileUrl: string;
  storagePath: string;
  fileSize: number;
  mimeType: string;
  checksum: string;
}

/**
 * Handles file storage in Supabase Storage and document record management.
 */
export class StorageService {

  /**
   * Uploads a file buffer to Supabase Storage.
   */
  async uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    userId: string
  ): Promise<StorageUploadResult> {

    // Validate file size
    if (fileBuffer.length > DOCUMENT_CONSTANTS.MAX_FILE_SIZE_BYTES) {
      throw new Error(`File exceeds maximum size of ${DOCUMENT_CONSTANTS.MAX_FILE_SIZE_MB}MB`);
    }

    // Validate MIME type
    if (!DOCUMENT_CONSTANTS.SUPPORTED_MIME_TYPES.has(mimeType)) {
      throw new Error(
        `Unsupported file type: ${mimeType}. Supported: ${Array.from(DOCUMENT_CONSTANTS.SUPPORTED_MIME_TYPES.keys()).join(', ')}`
      );
    }

    // Validate non-empty
    if (fileBuffer.length === 0) {
      throw new Error('Uploaded file is empty');
    }

    const checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Build a unique storage path:  documents/{userId}/{timestamp}_{sanitizedName}
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${DOCUMENT_CONSTANTS.STORAGE_PATH_PREFIX}/${userId}/${Date.now()}_${sanitizedName}`;

    log.info('Uploading file to storage', { storagePath, mimeType, size: fileBuffer.length });

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      log.error('Storage upload failed', { error: error.message, storagePath });
      throw new Error(`Failed to upload file to storage: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    return {
      fileUrl: urlData.publicUrl,
      storagePath,
      fileSize: fileBuffer.length,
      mimeType,
      checksum,
    };
  }

  /**
   * Downloads a file from Supabase Storage (used internally for processing).
   */
  async downloadFile(storagePath: string): Promise<Buffer> {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(storagePath);

    if (error || !data) {
      throw new Error(`Failed to download file: ${error?.message || 'No data returned'}`);
    }

    const arrayBuffer = await data.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * Deletes a file from Supabase Storage.
   */
  async deleteFile(storagePath: string): Promise<void> {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([storagePath]);

    if (error) {
      log.warn('Failed to delete file from storage', { error: error.message, storagePath });
    }
  }

  /**
   * Creates a document record in the database.
   */
  async createDocumentRecord(params: {
    userId: string | null;
    organizationId: string | null;
    documentName: string;
    documentType: 'questionnaire' | 'reference';
    sourceType: 'user' | 'system';
    fileUrl: string | null;
    fileSize: number | null;
    mimeType: string | null;
    checksum: string | null;
    uploadStatus?: string;
  }) {
    // Remove previous document with same checksum to allow re-uploads
    if (params.checksum) {
      await supabase
        .from('documents')
        .delete()
        .eq('checksum', params.checksum)
        .eq('source_type', params.sourceType);
    }

    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: params.userId,
        organization_id: params.organizationId,
        document_name: params.documentName,
        document_type: params.documentType,
        source_type: params.sourceType,
        file_url: params.fileUrl,
        file_size: params.fileSize,
        mime_type: params.mimeType,
        checksum: params.checksum,
        upload_status: params.uploadStatus || 'uploading',
      })
      .select('id')
      .single();

    if (error) {
      log.error('Failed to create document record', { error: error.message });
      throw new Error(`Database error: ${error.message}`);
    }

    return data.id as string;
  }

  /**
   * Updates document status.
   */
  async updateDocumentStatus(
    documentId: string,
    status: string,
    extra?: { error_message?: string; total_chunks?: number }
  ) {
    const { error } = await supabase
      .from('documents')
      .update({ upload_status: status, ...extra })
      .eq('id', documentId);

    if (error) {
      log.error('Failed to update document status', { documentId, status, error: error.message });
    }
  }

  /**
   * Checks if a document with the given checksum already exists.
   */
  async documentExistsByChecksum(checksum: string, sourceType: 'user' | 'system'): Promise<boolean> {
    const { data } = await supabase
      .from('documents')
      .select('id')
      .eq('checksum', checksum)
      .eq('source_type', sourceType)
      .limit(1);

    return (data?.length ?? 0) > 0;
  }

  /**
   * Gets documents for a user (includes system docs).
   */
  async getDocuments(userId: string, organizationId?: string) {
    let query = supabase
      .from('documents')
      .select('*')
      .or(`user_id.eq.${userId},source_type.eq.system`)
      .order('created_at', { ascending: false });

    if (organizationId) {
      query = supabase
        .from('documents')
        .select('*')
        .or(`and(user_id.eq.${userId},organization_id.eq.${organizationId}),source_type.eq.system`)
        .order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch documents: ${error.message}`);
    }

    return data;
  }

  /**
   * Gets a single document by ID, scoped to user.
   */
  async getDocumentById(documentId: string, userId: string) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .or(`user_id.eq.${userId},source_type.eq.system`)
      .single();

    if (error) {
      throw new Error(`Document not found: ${error.message}`);
    }

    return data;
  }
}

export const storageService = new StorageService();
