import { createClient } from '@/utils/supabase/server'
import MenuCategoryCRUD from '@/components/MenuCategoryCRUD'

export default async function AdminMenuPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="space-y-6">
      <div className="smain-head">
        <div>
          <h1>Gestión de la Carta</h1>
          <p>Edita las categorías y platos de tu menú</p>
        </div>
        <div className="clock">
          Tiempo Real
          <b className="font-sans font-bold">Activo</b>
        </div>
      </div>

      <MenuCategoryCRUD />
    </div>
  )
}
