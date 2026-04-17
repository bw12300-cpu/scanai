import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ScanAI — 네트워크 보안 자산 관리',
  description: 'AI 기반 네트워크 자산 관리 및 보안 점검 솔루션',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
