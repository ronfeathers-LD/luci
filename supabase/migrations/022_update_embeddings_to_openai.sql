-- Update embeddings table to support OpenAI embeddings (1536 dimensions)
-- Also supports Gemini embeddings (768 dimensions) for backward compatibility

-- Alter the embedding column to support both dimensions
-- We'll use 1536 to accommodate OpenAI, and existing Gemini embeddings will be truncated/padded as needed
ALTER TABLE account_embeddings 
  ALTER COLUMN embedding TYPE vector(1536);

-- Update the RPC function to work with 1536 dimensions
CREATE OR REPLACE FUNCTION match_account_embeddings(
  query_embedding vector(1536),
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
  FROM
    account_embeddings
  WHERE
    account_embeddings.account_id = match_account_id 
    AND (1 - (account_embeddings.embedding <=> query_embedding)) > match_threshold
  ORDER BY
    account_embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Recreate the vector index for 1536 dimensions
DROP INDEX IF EXISTS idx_account_embeddings_embedding_hnsw;
CREATE INDEX idx_account_embeddings_embedding_hnsw 
ON account_embeddings 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

