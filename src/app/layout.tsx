import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pharmbot - Pharmaceutical AI Assistant',
  description: 'An AI-powered chatbot for pharmaceutical Standard Operating Procedures.'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
} 