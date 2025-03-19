import { auth } from '@/auth'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Configuration, OpenAIApi } from 'openai-edge'

// Initialize OpenAI client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

// Helper function to generate embeddings
async function generateEmbedding(text: string) {
  const response = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input: text
  })
  
  const result = await response.json()
  return result.data[0].embedding
}

export async function POST(req: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore
  })
  
  const session = await auth({ cookieStore })
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { query, limit = 5 } = await req.json()
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }
    
    // Generate embedding for the search query
    const embedding = await generateEmbedding(query)
    
    // Perform vector similarity search
    const { data, error } = await supabase.rpc(
      'match_documents',
      {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: limit
      }
    )
    
    if (error) {
      console.error('Error searching documents:', error)
      return NextResponse.json(
        { error: 'Failed to search documents' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('Error searching documents:', error)
    return NextResponse.json(
      { error: 'Failed to search documents' },
      { status: 500 }
    )
  }
} 