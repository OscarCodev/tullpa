import { createClient } from '@/utils/supabase/server'
import StaffOrderBoard from '@/components/StaffOrderBoard'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="space-y-6">
      <div className="smain-head">
        <div>
          <h1>Panel de Control</h1>
          <p>Bienvenido de vuelta, {user?.email || 'Rosa'}</p>
        </div>
        <div className="clock">
          Tiempo Real
          <b className="font-sans font-bold">Activo</b>
        </div>
      </div>

      <StaffOrderBoard />
    </div>
  )
}
