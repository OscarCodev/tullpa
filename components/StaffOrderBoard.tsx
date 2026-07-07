'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../utils/supabase/client'

interface OrderItem {
  id: string
  name: string
  qty: number
  price: number
}

interface Order {
  id: string
  code: string
  table_number: number
  customer_name: string
  note: string | null
  status: 'recibido' | 'preparacion' | 'listo' | 'entregado'
  total: number
  created_at: string
  order_items: OrderItem[]
}

const COLUMNS = [
  { status: 'recibido', label: 'Recibido', color: '#E0A02E', icon: '📥' },
  { status: 'preparacion', label: 'En preparación', color: '#C0492B', icon: '🔥' },
  { status: 'listo', label: 'Listo', color: '#4F7A4C', icon: '✅' },
  { status: 'entregado', label: 'Entregado', color: '#7C6552', icon: '🍽️' },
] as const

export default function StaffOrderBoard() {
  const supabase = createClient()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: true })

      if (error) throw error
      setOrders(
        (data || []).map((o: any) => ({
          ...o,
          total: Number(o.total)
        }))
      )
    } catch (err: any) {
      console.error('Error fetching orders:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()

    // Realtime channel to listen to any updates/inserts/deletes on public.orders table
    const channel = supabase
      .channel('staff-orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchOrders()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  async function advanceStatus(orderId: string, currentStatus: Order['status']) {
    let nextStatus: Order['status'] | '' = ''
    if (currentStatus === 'recibido') nextStatus = 'preparacion'
    else if (currentStatus === 'preparacion') nextStatus = 'listo'
    else if (currentStatus === 'listo') nextStatus = 'entregado'

    if (!nextStatus) return

    try {
      // Optimistic state update for instant client response
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus as Order['status'] } : o))
      )

      const { error } = await supabase
        .from('orders')
        .update({ status: nextStatus })
        .eq('id', orderId)

      if (error) throw error
    } catch (err: any) {
      console.error('Failed to advance order status:', err)
      fetchOrders() // revert on error
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-[var(--night-soft)] font-mono text-[14px]">
        Cargando comandas en tiempo real...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 col text-center" style={{ borderColor: 'var(--ember)' }}>
        <span className="text-[26px] block mb-2">⚠️</span>
        <h3 className="font-semibold text-white">Error cargando comandas</h3>
        <p className="text-[var(--night-soft)] text-[13px] mt-1">{error}</p>
      </div>
    )
  }

  return (
    <div className="board">
      {COLUMNS.map((col) => {
        const colOrders = orders.filter((o) => o.status === col.status)

        return (
          <div key={col.status} className="col">
            <div className="col-head">
              <span className="k" style={{ backgroundColor: col.color }} />
              <h3 style={{ color: 'var(--night-ink)' }}>{col.label}</h3>
              <span className="n">{colOrders.length}</span>
            </div>

            <div className="col-body" style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
              {colOrders.length === 0 ? (
                <div className="col-empty">
                  <span className="em">{col.status === 'recibido' ? '📭' : '✨'}</span>
                  Sin pedidos
                </div>
              ) : (
                colOrders.map((order) => {
                  const timeStr = order.created_at
                    ? new Date(order.created_at).toLocaleTimeString('es-PE', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : ''

                  return (
                    <div key={order.id} className="ticket">
                      <div className="tk-head">
                        <span className="tk-code">{order.code}</span>
                        <span className="tk-table">Mesa {order.table_number}</span>
                      </div>

                      <div className="tk-cust">
                        👤 <span>{order.customer_name}</span>
                      </div>

                      {order.note && (
                        <div
                          className="tk-cust"
                          style={{
                            fontSize: '11px',
                            color: 'var(--gold)',
                            background: 'var(--night-2)',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            marginBottom: '9px',
                            lineHeight: '1.2',
                          }}
                        >
                          📝 <span>{order.note}</span>
                        </div>
                      )}

                      <ul className="tk-items">
                        {order.order_items?.map((item) => (
                          <li key={item.id}>
                            <span className="q">{item.qty}×</span>
                            <span className="nm truncate">{item.name}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="tk-foot">
                        <span className="tk-time">{timeStr}</span>
                        <span className="tk-tot" style={{ color: 'var(--night-ink)' }}>
                          S/ {order.total.toFixed(2)}
                        </span>
                      </div>

                      {col.status !== 'entregado' && (
                        <button
                          className={`tk-act ${col.status === 'listo' ? 'done' : 'next'}`}
                          onClick={() => advanceStatus(order.id, order.status)}
                        >
                          {col.status === 'recibido' && '🔥 Preparar'}
                          {col.status === 'preparacion' && '✅ Listo'}
                          {col.status === 'listo' && '🍽️ Entregar'}
                        </button>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
