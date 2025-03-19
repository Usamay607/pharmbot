import { type Message } from 'ai'

// TODO refactor and remove unneccessary duplicate data.
export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string // Refactor to use RLS
}

export type ServerActionResult<Result> = Promise<
  | { error: string; data?: undefined }
  | { error?: undefined; data: Result }
>

export interface SopDocument {
  id: string
  userId: string
  title: string
  category: string
  content: string
  filePath?: string
  fileType?: string
  createdAt: Date
  updatedAt: Date
}

export interface SearchResult {
  id: string
  title: string
  category: string
  content: string
  similarity: number
}

export interface ChatWithSOPContext extends Message {
  sourceDocuments?: SearchResult[]
}

export interface UploadSopDocumentRequest {
  title: string
  category: string
  file: File
}

export interface SopCategory {
  name: string
  count: number
}
