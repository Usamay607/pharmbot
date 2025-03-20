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

// Helper function to extract text from PDF or plain text file
async function extractTextFromFile(file: File): Promise<string> {
  // For simplicity, we're handling only plain text files for now
  // In a production app, you'd want to implement PDF text extraction as well
  const text = await file.text()
  return text
}

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
    const formData = await req.formData()
    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const file = formData.get('file') as File
    
    if (!title || !category || !file) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Check file size
    const maxSize = parseInt(process.env.MAX_FILE_SIZE || '10485760')
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds the limit' },
        { status: 400 }
      )
    }
    
    // Check file type
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'application/pdf,text/plain').split(',')
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not supported' },
        { status: 400 }
      )
    }
    
    // Extract text from file
    const content = await extractTextFromFile(file)
    
    // Generate embedding
    const embedding = await generateEmbedding(content)
    
    // Store document in Supabase
    const { data, error } = await supabase.from('sop_documents').insert({
      title,
      category,
      content,
      file_type: file.type,
      user_id: session.user.id,
      embedding
    }).select()
    
    if (error) {
      console.error('Error saving document:', error)
      return NextResponse.json(
        { error: 'Failed to save document' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ data: data[0] }, { status: 201 })
  } catch (error) {
    console.error('Error processing document upload:', error)
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore
  })
  
  const session = await auth({ cookieStore })
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { data, error } = await supabase
      .from('sop_documents')
      .select('id, title, category, created_at, updated_at, file_type')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching documents:', error)
      return NextResponse.json(
        { error: 'Failed to fetch documents' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
} 