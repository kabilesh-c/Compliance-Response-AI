import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import inventoryRoutes from './routes/inventory.routes';
import documentRoutes from './routes/document.routes';
import questionnaireRoutes from './routes/questionnaire.routes';
import questionRoutes from './routes/question.routes';
import chatRoutes from './routes/chat.routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:3000',
  'https://localhost:3000',
  process.env.FRONTEND_URL, // Your Vercel URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin.startsWith(allowed!) || allowed === origin)) {
      return callback(null, true);
    }
    // In production, also allow any vercel.app subdomain
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(morgan('dev'));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'pharmacy-api', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/questionnaires', questionnaireRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.send('Smart Pharmacy API is running');
});

// Start Server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  // Auto-ingest system knowledge base documents on startup (non-blocking)
  try {
    const { systemIngestionService } = await import('./services/document');
    systemIngestionService.ingestSystemDocuments().catch(err => {
      console.error('System document ingestion failed:', err.message);
    });
  } catch (err: any) {
    // Config missing (no Supabase/Gemini keys) — skip silently in dev
    console.warn('Document intelligence layer not initialized:', err.message);
  }
});
