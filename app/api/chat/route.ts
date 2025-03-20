import 'server-only'
import { OpenAIStream, StreamingTextResponse, Message } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'

export const runtime = 'edge'

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
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore
  })
  const json = await req.json()
  const { messages, previewToken } = json
  const userId = (await auth({ cookieStore }))?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  if (previewToken) {
    configuration.apiKey = previewToken
  }

  // Get the last user message for context
  const lastUserMessage = messages
    .filter((message: Message) => message.role === 'user')
    .pop()

  // Get relevant SOP document content as context
  let sopContext = ''
  let sourceDocuments = []

  if (lastUserMessage) {
    try {
      // Generate embedding for the query
      const embedding = await generateEmbedding(lastUserMessage.content)
      
      // Perform similarity search
      const { data: documents } = await supabase.rpc('match_documents', {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: 3
      })
      
      if (documents && documents.length > 0) {
        sourceDocuments = documents
        
        // Build context from relevant documents
        sopContext = `Here is information from relevant SOP documents:\n\n${
          documents.map((doc, index) => 
            `Document ${index + 1} [${doc.category} - ${doc.title}]:\n${doc.content.substring(0, 1000)}${doc.content.length > 1000 ? '...' : ''}`
          ).join('\n\n')
        }\n\n`
      }
    } catch (error) {
      console.error('Error fetching SOP context:', error)
    }
  }

  // Prepare messages with SOP context
  const promptMessages = [...messages]
  
  if (sopContext) {
    // Insert SOP context before the last user message
    promptMessages.splice(promptMessages.length - 1, 0, {
      role: 'system',
      content: `${sopContext}Answer the user's question based on the information from these SOP documents. If the documents don't contain relevant information, say so and provide a general answer. Reference specific documents in your answer when possible (e.g., "According to Document 1...").`
    })
  }

  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: promptMessages,
    temperature: 0.7,
    stream: true
  })

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100)
      const id = json.id ?? nanoid()
      const createdAt = Date.now()
      const path = `/chat/${id}`
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: 'assistant',
            sourceDocuments: sourceDocuments.length > 0 ? sourceDocuments : undefined
          }
        ]
      }
      // Insert chat into database.
      await supabase.from('chats').upsert({ id, payload }).throwOnError()
    }
  })

  return new StreamingTextResponse(stream)
}
