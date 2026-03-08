-- =====================================================
-- PharmaOS Database Schema for Supabase
-- =====================================================
-- Run this in Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste & Run
-- =====================================================

-- 1. Enable required extensions
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- UUID generation
CREATE EXTENSION IF NOT EXISTS "vector";         -- pgvector for RAG embeddings

-- 2. Create user_profiles table
-- =====================================================
-- Stores user data linked to Firebase Auth
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firebase_uid TEXT UNIQUE NOT NULL,           -- Link to Firebase Auth UID
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('ADMIN', 'MANAGER', 'PHARMACIST')),
    mode TEXT NOT NULL CHECK (mode IN ('RETAIL', 'HOSPITAL')),
    organization_id TEXT,
    organization_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_firebase_uid ON public.user_profiles(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_org ON public.user_profiles(organization_id);

-- 3. Create organizations table (future use)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,                   -- e.g., "PH-1234"
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('RETAIL', 'HOSPITAL')),
    location TEXT,
    admin_user_id UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create chat conversations table (for future chat feature)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.chat_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_conversations_user ON public.chat_conversations(user_id);

-- 5. Create chat messages table (for future chat feature)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON public.chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON public.chat_messages(created_at DESC);

-- 6. Create documents table for RAG (vector embeddings)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536),                      -- OpenAI ada-002 = 1536 dimensions
    metadata JSONB DEFAULT '{}',
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for vector similarity search
CREATE INDEX IF NOT EXISTS idx_documents_user ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_embedding ON public.documents 
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- 7. Enable Row Level Security (RLS)
-- =====================================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS Policies
-- =====================================================

-- User profiles: Users can read all, but only update their own
CREATE POLICY "Users can view all profiles" 
    ON public.user_profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can update own profile" 
    ON public.user_profiles FOR UPDATE 
    USING (firebase_uid = auth.uid()::text);

CREATE POLICY "Users can insert own profile" 
    ON public.user_profiles FOR INSERT 
    WITH CHECK (true);

-- Chat conversations: Users can only see their own
CREATE POLICY "Users can view own conversations" 
    ON public.chat_conversations FOR SELECT 
    USING (user_id IN (SELECT id FROM public.user_profiles WHERE firebase_uid = auth.uid()::text));

CREATE POLICY "Users can create own conversations" 
    ON public.chat_conversations FOR INSERT 
    WITH CHECK (user_id IN (SELECT id FROM public.user_profiles WHERE firebase_uid = auth.uid()::text));

-- Chat messages: Users can only see messages in their conversations
CREATE POLICY "Users can view own messages" 
    ON public.chat_messages FOR SELECT 
    USING (conversation_id IN (
        SELECT id FROM public.chat_conversations 
        WHERE user_id IN (SELECT id FROM public.user_profiles WHERE firebase_uid = auth.uid()::text)
    ));

CREATE POLICY "Users can create messages in own conversations" 
    ON public.chat_messages FOR INSERT 
    WITH CHECK (conversation_id IN (
        SELECT id FROM public.chat_conversations 
        WHERE user_id IN (SELECT id FROM public.user_profiles WHERE firebase_uid = auth.uid()::text)
    ));

-- Documents: Users can only access their own documents
CREATE POLICY "Users can view own documents" 
    ON public.documents FOR SELECT 
    USING (user_id IN (SELECT id FROM public.user_profiles WHERE firebase_uid = auth.uid()::text));

CREATE POLICY "Users can create own documents" 
    ON public.documents FOR INSERT 
    WITH CHECK (user_id IN (SELECT id FROM public.user_profiles WHERE firebase_uid = auth.uid()::text));

-- 9. Create updated_at trigger function
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON public.organizations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_chat_conversations_updated_at
    BEFORE UPDATE ON public.chat_conversations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 10. Create storage buckets
-- =====================================================
-- Note: Run this in Supabase dashboard > Storage > Create bucket
-- Or use the following SQL (may require admin privileges):

-- Bucket for user avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket for chat attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-attachments', 'chat-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Bucket for RAG documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- 11. Create storage policies
-- =====================================================
-- Users can upload their own avatars
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Users can upload documents
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- Setup Complete! 
-- =====================================================
-- Next steps:
-- 1. Verify all tables created: Check "Table Editor" in Supabase
-- 2. Check storage buckets: Go to "Storage" tab
-- 3. Test with your application
-- =====================================================
