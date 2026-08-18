import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ALVB | 상업공간 인테리어',
  description: '상업공간 인테리어 레퍼런스와 온라인 견적 상담을 제공하는 ALVB 웹사이트',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" data-theme="analog-atelier">
      <body>{children}</body>
    </html>
  )
}
