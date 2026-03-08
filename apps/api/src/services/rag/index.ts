// Barrel export for RAG answer engine services
export { ragService, RagService } from './rag.service';
export { answerService, AnswerService } from './answer.service';
export { memoryService, MemoryService } from './memory.service';
export { gapDetectorService, GapDetectorService } from './gap-detector.service';
export { classifierService, ClassifierService } from './classifier.service';
export { chatService, ChatService } from './chat.service';
export type { RagResult, Citation, EvidenceSnippet } from './rag.service';
export type { CoverageSummary } from './answer.service';
export type { MemoryMatch } from './memory.service';
export type { GapAnalysis } from './gap-detector.service';
export type { QuestionnaireType } from './classifier.service';
