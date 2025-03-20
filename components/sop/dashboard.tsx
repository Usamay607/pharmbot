'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SopCategory } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'

export function SopDashboard() {
  const [categories, setCategories] = useState<SopCategory[]>([])
  const [totalDocuments, setTotalDocuments] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/sop/stats')
        
        if (!response.ok) {
          throw new Error('Failed to fetch statistics')
        }
        
        const { data } = await response.json()
        setCategories(data.categories || [])
        setTotalDocuments(data.totalDocuments || 0)
      } catch (error) {
        console.error('Error fetching statistics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <div className="text-2xl font-bold">{totalDocuments}</div>
          )}
          <p className="text-xs text-muted-foreground">
            Total SOP documents in the system
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <div className="text-2xl font-bold">{categories.length}</div>
          )}
          <p className="text-xs text-muted-foreground">
            Unique document categories
          </p>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : (
            <div className="space-y-2">
              {categories.length > 0 ? (
                categories.slice(0, 5).map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="text-sm">{category.name}</div>
                    <div className="text-sm font-medium">{category.count} docs</div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No categories yet</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 