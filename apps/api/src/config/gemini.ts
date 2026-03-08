import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error(
    'Missing GEMINI_API_KEY environment variable. ' +
    'Get one at https://aistudio.google.com/app/apikey'
  );
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// gemini-embedding-001 with outputDimensionality=768 to match our pgvector column
export const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

export const EMBEDDING_DIMENSION = 768;

export { genAI };
