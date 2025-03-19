'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'react-hot-toast'
import { SopDocument } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { IconTrash } from '@/components/ui/icons'

export function DocumentList() {
  const [documents, setDocuments] = useState<SopDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/sop')
      
      if (!response.ok) {
        throw new Error('Failed to fetch documents')
      }
      
      const { data } = await response.json()
      setDocuments(data)
    } catch (error) {
      console.error('Error fetching documents:', error)
      toast.error('Failed to load documents')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/sop/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete document')
      }
      
      // Update the list
      setDocuments(prev => prev.filter(doc => doc.id !== id))
      toast.success('Document deleted successfully')
    } catch (error) {
      console.error('Error deleting document:', error)
      toast.error('Failed to delete document')
    }
  }

  if (isLoading) {
    return (
      <div className="w-full text-center py-8">
        <p>Loading documents...</p>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="w-full text-center py-8">
        <p>No documents found. Upload your first SOP document to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {documents.map(doc => (
        <Card key={doc.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{doc.title}</CardTitle>
            <CardDescription>
              Category: {doc.category}
              <br />
              Added: {new Date(doc.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end">
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleDelete(doc.id)}
              >
                <IconTrash className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 