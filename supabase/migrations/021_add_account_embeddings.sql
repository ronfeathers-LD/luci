-- Add pgvector extension and account embeddings table for RAG chatbot
-- This enables vector similarity search for account-specific data

-- Enable pgvector extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS vector;

-- Account embeddings table
-- Stores chunked account data as embeddings for RAG retrieval
CREATE TABLE IF NOT EXISTS account_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  salesforce_account_id TEXT, -- For quick filtering
  data_type TEXT NOT NULL, -- 'account', 'contact', 'case', 'transcription', 'sentiment'
  source_id TEXT, -- ID of the source record (case number, contact ID, etc.)
  content TEXT NOT NULL, -- The text content that was embedded
  embedding vector(768), -- Gemini embedding-001 uses 768 dimensions
  metadata JSONB, -- Flexible metadata (dates, status, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_account_embeddings_account_id ON account_embeddings(account_id);
CREATE INDEX IF NOT EXISTS idx_account_embeddings_salesforce_account_id ON account_embeddings(salesforce_account_id);
CREATE INDEX IF NOT EXISTS idx_account_embeddings_data_type ON account_embeddings(data_type);
CREATE INDEX IF NOT EXISTS idx_account_embeddings_source_id ON account_embeddings(source_id);

-- Vector similarity search index using HNSW (Hierarchical Navigable Small World)
-- This enables fast approximate nearest neighbor search
CREATE INDEX IF NOT EXISTS idx_account_embeddings_embedding_hnsw 
ON account_embeddings 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- GIN index for metadata JSONB queries
CREATE INDEX IF NOT EXISTS idx_account_embeddings_metadata_gin ON account_embeddings USING GIN(metadata);

-- Composite index for common query patterns (account + data_type)
CREATE INDEX IF NOT EXISTS idx_account_embeddings_account_data_type ON account_embeddings(account_id, data_type);

-- Function for vector similarity search
CREATE OR REPLACE FUNCTION match_account_embeddings(
  query_embedding vector(768),
  match_account_id UUID,
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  data_type TEXT,
  metadata JSONB,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    account_embeddings.id,
    account_embeddings.content,
    account_embeddings.data_type,
    account_embeddings.metadata,
    1 - (account_embeddings.embedding <=> query_embedding) as similarity
  FROM account_embeddings
  WHERE account_embeddings.account_id = match_account_id
    AND 1 - (account_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY account_embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Add comments for documentation
COMMENT ON TABLE account_embeddings IS 'Stores vector embeddings of account data for RAG chatbot retrieval';
COMMENT ON COLUMN account_embeddings.data_type IS 'Type of data: account, contact, case, transcription, sentiment';
COMMENT ON COLUMN account_embeddings.embedding IS 'Vector embedding (768 dimensions for Gemini embedding-001)';
COMMENT ON COLUMN account_embeddings.metadata IS 'JSONB metadata including dates, status, priority, etc.';
COMMENT ON FUNCTION match_account_embeddings IS 'Performs vector similarity search for account embeddings using cosine distance';

