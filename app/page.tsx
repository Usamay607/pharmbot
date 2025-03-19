import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { auth } from '@/auth'
import { cookies } from 'next/headers'

export const runtime = 'edge'

export default async function IndexPage() {
  const id = nanoid()
  const cookieStore = cookies()
  const session = await auth({ cookieStore })
  
  return (
    <div className="flex flex-col items-center">
      {!session?.user && (
        <div className="max-w-2xl mx-auto py-10 px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
            Welcome to Pharmbot
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your AI assistant for pharmaceutical Standard Operating Procedures. Easily upload, 
            manage, and search through SOP documents, and get instant answers from your chatbot 
            with references to specific SOP documentation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/sign-up">Create Account</Link>
            </Button>
          </div>
        </div>
      )}
      
      <Chat id={id} />
    </div>
  )
}
