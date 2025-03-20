'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'react-hot-toast'
import { IconSpinner } from '@/components/ui/icons'

export function UploadSopForm() {
  const [isUploading, setIsUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !category || !file) {
      toast.error('Please fill in all fields')
      return
    }
    
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('category', category)
      formData.append('file', file)
      
      const response = await fetch('/api/sop', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to upload document')
      }
      
      toast.success('Document uploaded successfully')
      setTitle('')
      setCategory('')
      setFile(null)
      
      // Reset the file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
      }
    } catch (error) {
      console.error('Error uploading document:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload document')
    } finally {
      setIsUploading(false)
    }
  }
  
  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Document Title</Label>
          <Input
            id="title"
            placeholder="Enter document title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            placeholder="Enter document category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="file-upload">Document File (PDF or TXT)</Label>
          <Input
            id="file-upload"
            type="file"
            accept=".pdf,.txt,application/pdf,text/plain"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            required
          />
        </div>
        
        <Button type="submit" disabled={isUploading}>
          {isUploading && <IconSpinner className="mr-2 animate-spin" />}
          Upload Document
        </Button>
      </form>
    </div>
  )
} 