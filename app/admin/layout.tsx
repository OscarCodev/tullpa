import { createClient } from '@/utils/supabase/server'
import { logout } from '../login/actions'
import AdminNav from '@/components/AdminNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const email = user?.email || 'rosa@tullpa.com'
  const initials = email.split('@')[0].substring(0, 2).toUpperCase()

  return (
    <div className="staff" style={{ fontFamily: 'var(--body)' }}>
      <div className="sapp">
        {/* Sidebar */}
        <aside className="sidebar">
          <div>
            <div className="sb-brand">
              <div className="em">🥘</div>
              <div>
                <b>Tullpa</b>
                <span>Panel Admin</span>
              </div>
            </div>

            <AdminNav />
          </div>

          <div className="sb-foot">
            <div className="sb-user">
              <div className="sb-avatar">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="un truncate">{email.split('@')[0]}</div>
                <div className="ur truncate" style={{ fontSize: '11px', opacity: 0.5 }}>{email}</div>
              </div>
            </div>

            <form action={logout} style={{ marginTop: '8px' }}>
              <button
                type="submit"
                className="logout cursor-pointer"
              >
                Cerrar Sesión
              </button>
            </form>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="smain">
          {children}
        </main>
      </div>
    </div>
  )
}
