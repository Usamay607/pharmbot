-- Create a function to search for similar documents
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  title text,
  category text,
  content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    sop_documents.id,
    sop_documents.title,
    sop_documents.category,
    sop_documents.content,
    1 - (sop_documents.embedding <=> query_embedding) AS similarity
  FROM sop_documents
  WHERE 1 - (sop_documents.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$; 