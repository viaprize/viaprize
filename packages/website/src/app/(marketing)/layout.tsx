import type React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="px-3">{children}</div>
}
