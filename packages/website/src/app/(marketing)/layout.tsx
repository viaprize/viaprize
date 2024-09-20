import type React from 'react'

import Footer from '@/components/layout/marketing/footer'
import Header from '@/components/layout/marketing/header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3">
      <Header />
      {children}
      <Footer />
    </div>
  )
}
