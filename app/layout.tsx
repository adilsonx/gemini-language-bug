import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'Gemini PDF Language Bug Reproduction',
  description: 'Test case for PDF language preservation issue with Gemini API',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}