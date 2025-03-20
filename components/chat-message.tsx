import { Message } from 'ai'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import React from 'react'
import { useInView } from 'react-intersection-observer'

import { cn } from '@/lib/utils'
import { CodeBlock } from '@/components/ui/codeblock'
import { MemoizedReactMarkdown } from '@/components/markdown'
import { IconOpenAI, IconUser } from '@/components/ui/icons'
import { ChatMessageActions } from '@/components/chat-message-actions'
import { ChatWithSOPContext, SearchResult } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'

export interface ChatMessageProps {
  message: Message
}

export function ChatMessage({
  message,
  showCopy = true,
}: {
  message: ChatWithSOPContext
  showCopy?: boolean
}) {
  const { ready } = useInView({
    rootMargin: '0px 0px -50px 0px',
    triggerOnce: true
  })

  const [code, setCode] = React.useState(message.sourceDocuments || [])

  return (
    <div
      className={cn('group relative mb-4 flex items-start md:-ml-12')}
    >
      <div
        className={cn(
          'flex size-8 shrink-0 select-none items-center justify-center rounded-md border shadow',
          message.role === 'user'
            ? 'bg-background'
            : 'bg-primary text-primary-foreground'
        )}
      >
        {message.role === 'user' ? <IconUser /> : <IconOpenAI />}
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <MemoizedReactMarkdown
          className={cn(
            'prose prose-slate break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0',
            'prose-code:bg-muted prose-code:font-normal prose-hr:my-4',
            'prose-a:text-primary prose-a:underline',
            'prose-hr:border-border'
          )}
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },
            code({ node, inline, className, children, ...props }) {
              if (children.length) {
                if (children[0] == '▍') {
                  return (
                    <span className="mt-1 animate-pulse cursor-default">▍</span>
                  )
                }

                children[0] = (children[0] as string).replace('`▍`', '▍')
              }

              const match = /language-(\w+)/.exec(className || '')

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ''}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              )
            }
          }}
        >
          {message.content}
        </MemoizedReactMarkdown>
        
        {/* Display SOP document references if available */}
        {message.sourceDocuments && message.sourceDocuments.length > 0 && (
          <div className="mt-4">
            <h4 className="mb-2 text-sm font-medium">Referenced SOP Documents:</h4>
            <div className="space-y-2">
              {message.sourceDocuments.map((doc: SearchResult, index: number) => (
                <Card key={doc.id} className="overflow-hidden bg-muted/50">
                  <CardContent className="p-3">
                    <div className="text-sm">
                      <span className="font-medium">{index + 1}. {doc.title}</span> 
                      <span className="ml-2 text-xs text-muted-foreground">
                        (Category: {doc.category})
                      </span>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {doc.content.length > 150 
                          ? `${doc.content.substring(0, 150)}...` 
                          : doc.content}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <ChatMessageActions message={message} showCopy={showCopy} />
      </div>
    </div>
  )
}
