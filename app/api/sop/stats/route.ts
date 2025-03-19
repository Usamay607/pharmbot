import { auth } from '@/auth'
import { SopCategory } from '@/lib/types'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

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
    // Get total documents count
    const { count: totalDocuments, error: countError } = await supabase
      .from('sop_documents')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
    
    if (countError) {
      console.error('Error counting documents:', countError)
      return NextResponse.json(
        { error: 'Failed to fetch statistics' },
        { status: 500 }
      )
    }

    // Get document categories with counts
    const { data: categoryData, error: categoryError } = await supabase
      .from('sop_documents')
      .select('category')
      .eq('user_id', session.user.id)
    
    if (categoryError) {
      console.error('Error fetching categories:', categoryError)
      return NextResponse.json(
        { error: 'Failed to fetch statistics' },
        { status: 500 }
      )
    }

    // Process categories to get counts
    const categoryMap = new Map<string, number>()
    categoryData.forEach(doc => {
      const category = doc.category
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1)
    })

    const categories: SopCategory[] = Array.from(categoryMap.entries()).map(
      ([name, count]) => ({ name, count })
    ).sort((a, b) => b.count - a.count)

    return NextResponse.json({
      data: {
        totalDocuments,
        categories
      }
    }, { status: 200 })
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
} 