import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UploadSopForm } from '@/components/sop/upload-form'
import { DocumentList } from '@/components/sop/document-list'
import { SopDashboard } from '@/components/sop/dashboard'

export default function SopPage() {
  return (
    <div className="flex flex-col items-center justify-between p-4 md:p-8">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="mb-6 text-2xl font-bold">SOP Document Management</h1>
        
        <div className="mb-8">
          <SopDashboard />
        </div>
        
        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="documents">All Documents</TabsTrigger>
            <TabsTrigger value="upload">Upload Document</TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents" className="mt-4">
            <DocumentList />
          </TabsContent>
          
          <TabsContent value="upload" className="mt-4">
            <div className="flex w-full justify-center">
              <UploadSopForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 