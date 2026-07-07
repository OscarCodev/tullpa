'use client'

import { usePathname } from 'next/navigation'

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      <a
        href="/admin"
        className={`navbtn ${pathname === '/admin' ? 'on' : ''}`}
      >
        📊 Dashboard
      </a>
      <a
        href="/admin/menu"
        className={`navbtn ${pathname === '/admin/menu' ? 'on' : ''}`}
      >
        🥘 Carta/Menú
      </a>
    </nav>
  )
}
