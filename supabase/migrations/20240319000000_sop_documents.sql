-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create table for SOP documents
CREATE TABLE "public"."sop_documents" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "file_path" TEXT,
    "file_type" TEXT,
    "embedding" vector(1536),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on the embedding column for similarity search
CREATE INDEX sop_documents_embedding_idx ON public.sop_documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Row Level Security
ALTER TABLE "public"."sop_documents" ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow users to read own SOP documents"
ON "public"."sop_documents"
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert own SOP documents"
ON "public"."sop_documents"
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update own SOP documents"
ON "public"."sop_documents"
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete own SOP documents"
ON "public"."sop_documents"
FOR DELETE
TO authenticated
USING (auth.uid() = user_id); 