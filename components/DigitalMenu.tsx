'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Category, Dish } from '../types'

import { createClient } from '../utils/supabase/client'

interface DigitalMenuProps {
  initialCategories: Category[]
  initialDishes: Dish[]
}

interface Toast {
  id: number
  msg: string
  emoji: string
  visible: boolean
}

const STATUS_ORDER = ['recibido', 'preparacion', 'listo', 'entregado'] as const

const STATUS_DETAILS: Record<typeof STATUS_ORDER[number], { label: string; emoji: string; copy: string }> = {
  recibido: { label: 'Recibido', emoji: '📥', copy: 'El restaurante recibió tu pedido.' },
  preparacion: { label: 'En preparación', emoji: '🔥', copy: 'La cocina está preparando tus platos.' },
  listo: { label: 'Listo', emoji: '✅', copy: '¡Tu pedido está listo! En camino a tu mesa.' },
  entregado: { label: 'Entregado', emoji: '🍽️', copy: 'Entregado en tu mesa. ¡Buen provecho!' },
}

let toastIdCounter = 0

export default function DigitalMenu({ initialCategories, initialDishes }: DigitalMenuProps) {
  const searchParams = useSearchParams()
  const tableNumber = searchParams.get('table') || searchParams.get('mesa') || '7'
  const supabase = createClient()

  // ── Modal state ──────────────────────────────────────────────────────────
  const [selectedDishId, setSelectedDishId] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetQty, setSheetQty] = useState(1)

  // Open sheet: set dish first, reset qty to 1, then add .on class next frame for CSS transition
  function openDish(id: string) {
    setSelectedDishId(id)
    setSheetQty(1)
    requestAnimationFrame(() => setSheetOpen(true))
  }

  function closeDish() {
    setSheetOpen(false)
    // Wait for transition before unmounting
    setTimeout(() => setSelectedDishId(null), 350)
  }

  const selectedDish = initialDishes.find((d) => d.id === selectedDishId)

  // ── Cart / View state ─────────────────────────────────────────────────────
  const [cart, setCart] = useState<Record<string, number>>({})
  const [view, setView] = useState<'menu' | 'cart' | 'track'>('menu')
  const [myOrderId, setMyOrderId] = useState<string | null>(null)
  const [currentOrder, setCurrentOrder] = useState<any | null>(null)

  // ── Checkout Form state ───────────────────────────────────────────────────
  const [selectedTable, setSelectedTable] = useState<number>(parseInt(tableNumber) || 7)
  const [customerName, setCustomerName] = useState('')
  const [kitchenNote, setKitchenNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0)
  const cartTotal = Object.entries(cart).reduce((sum, [dishId, qty]) => {
    const dish = initialDishes.find((d) => d.id === dishId)
    return sum + (dish ? dish.price * qty : 0)
  }, 0)

  const [fabBumping, setFabBumping] = useState(false)
  const bumpTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Badge key forces re-mount → re-triggers pop animation
  const [badgeKey, setBadgeKey] = useState(0)

  function bumpFab() {
    setFabBumping(true)
    if (bumpTimer.current) clearTimeout(bumpTimer.current)
    bumpTimer.current = setTimeout(() => setFabBumping(false), 180)
  }

  function addToCart(dish: Dish, qty: number) {
    setCart((prev) => {
      const currentQty = prev[dish.id] || 0
      return { ...prev, [dish.id]: currentQty + qty }
    })
    setBadgeKey((k) => k + 1)
    bumpFab()
    showToast(`${dish.name} agregado`, '🛒')
  }

  function setQty(dishId: string, qty: number) {
    setCart((prev) => {
      const next = { ...prev }
      if (qty <= 0) {
        delete next[dishId]
      } else {
        next[dishId] = qty
      }
      return next
    })
  }

  async function placeOrder() {
    if (Object.keys(cart).length === 0) return
    setIsSubmitting(true)
    try {
      // 1. Generate random 4-digit code (e.g. #4821)
      const randomCode = '#' + Math.floor(1000 + Math.random() * 9000).toString()

      // 2. Insert order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          code: randomCode,
          table_number: selectedTable,
          customer_name: customerName.trim() || 'Cliente',
          note: kitchenNote.trim() || null,
          status: 'recibido',
          total: cartTotal,
        })
        .select()
        .single()

      if (orderError) {
        throw new Error(orderError.message)
      }

      if (!orderData) {
        throw new Error('No se pudo crear el pedido.')
      }

      // 3. Prepare order items
      const itemsToInsert = Object.entries(cart).map(([dishId, qty]) => {
        const dish = initialDishes.find((d) => d.id === dishId)
        if (!dish) throw new Error(`Plato no encontrado: ${dishId}`)
        return {
          order_id: orderData.id,
          dish_id: dishId,
          name: dish.name,
          emoji: dish.emoji,
          qty: qty,
          price: dish.price,
        }
      })

      // 4. Insert order items
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert)

      if (itemsError) {
        // Rollback by deleting the parent order if items insertion fails
        await supabase.from('orders').delete().eq('id', orderData.id)
        throw new Error(itemsError.message)
      }

      // 5. Success - Clear cart and redirect
      setCurrentOrder({
        id: orderData.id,
        code: randomCode,
        table_number: selectedTable,
        customer_name: customerName.trim() || 'Cliente',
        note: kitchenNote.trim() || null,
        status: 'recibido',
        total: cartTotal,
        items: itemsToInsert,
        history: {
          recibido: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }
      })
      localStorage.setItem('tullpa_active_order_id', orderData.id)
      setMyOrderId(orderData.id)
      setCart({})
      showToast(`Pedido ${randomCode} enviado a cocina`, '✅')
      setView('track')
    } catch (err: any) {
      console.error('Error placing order:', err)
      showToast(err.message || 'Error al procesar el pedido', '⚠️')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Toast state ──────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((msg: string, emoji = '🔔') => {
    const id = ++toastIdCounter
    // Mount as invisible, then make visible next frame for CSS transition
    setToasts((prev) => [...prev, { id, msg, emoji, visible: false }])
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, visible: true } : t))
        )
      })
    })
    // Auto-dismiss after 2600ms
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
      )
      // Remove from DOM after exit transition
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 420)
    }, 2600)
  }, [])

  // Cleanup bump timer on unmount
  useEffect(() => {
    return () => {
      if (bumpTimer.current) clearTimeout(bumpTimer.current)
    }
  }, [])

  // ── Anonymous Sign-In on mount ───────────────────────────────────────────
  useEffect(() => {
    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          await supabase.auth.signInAnonymously()
        }
      } catch (err) {
        console.error('Anonymous sign-in error:', err)
      }
    }
    initAuth()
  }, [supabase])

  // ── Restore active order tracking on mount ───────────────────────────────
  useEffect(() => {
    async function restoreOrder() {
      const activeOrderId = localStorage.getItem('tullpa_active_order_id')
      if (!activeOrderId) return

      try {
        // Fetch order details
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', activeOrderId)
          .single()

        if (orderError) throw orderError
        if (!orderData) {
          localStorage.removeItem('tullpa_active_order_id')
          return
        }

        // If order is completed (entregado), don't show tracking page anymore
        if (orderData.status === 'entregado') {
          localStorage.removeItem('tullpa_active_order_id')
          return
        }

        // Fetch order items to populate tracking recap
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', activeOrderId)

        if (itemsError) throw itemsError

        // Restore state
        setCurrentOrder({
          id: orderData.id,
          code: orderData.code,
          table_number: orderData.table_number,
          customer_name: orderData.customer_name,
          note: orderData.note,
          status: orderData.status,
          total: Number(orderData.total),
          items: itemsData || [],
          history: {
            recibido: orderData.created_at
              ? new Date(orderData.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
              : ''
          }
        })
        setMyOrderId(orderData.id)
        setView('track')
      } catch (err) {
        console.error('Failed to restore active order:', err)
        localStorage.removeItem('tullpa_active_order_id')
      }
    }
    restoreOrder()
  }, [supabase])

  // ── Live Order Tracking realtime subscription & polling fallback ──────────
  useEffect(() => {
    if (!myOrderId) return

    // Realtime subscription
    const channel = supabase
      .channel(`order-status-${myOrderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${myOrderId}`,
        },
        (payload) => {
          const newStatus = payload.new.status
          if (newStatus === 'entregado') {
            localStorage.removeItem('tullpa_active_order_id')
          }
          const nowStr = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          setCurrentOrder((prev: any) => {
            if (!prev) return null
            if (prev.status === newStatus) return prev
            return {
              ...prev,
              status: newStatus,
              history: {
                ...prev.history,
                [newStatus]: nowStr
              }
            }
          })
          showToast(`Pedido actualizado: ${newStatus}`, '🔔')
        }
      )
      .subscribe()

    // Fallback polling (every 5 seconds)
    const interval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('status')
          .eq('id', myOrderId)
          .single()

        if (error) throw error
        if (data) {
          const newStatus = data.status
          if (newStatus === 'entregado') {
            localStorage.removeItem('tullpa_active_order_id')
          }
          setCurrentOrder((prev: any) => {
            if (!prev) return null
            if (prev.status === newStatus) return prev
            const nowStr = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            return {
              ...prev,
              status: newStatus,
              history: {
                ...prev.history,
                [newStatus]: nowStr
              }
            }
          })
        }
      } catch (err) {
        console.error('Polling error:', err)
      }
    }, 5000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
    }
  }, [myOrderId, supabase])

  // ── Helpers ───────────────────────────────────────────────────────────────
  function getToneBg(t: number) {
    return `linear-gradient(140deg, hsl(${t} 62% 88%), hsl(${(t + 20) % 360} 55% 78%))`
  }

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(initialCategories[0]?.id || null)

  function scrollToCategory(catId: string) {
    setActiveCategoryId(catId)
    const el = document.getElementById(`sec-${catId}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const fabStyle: React.CSSProperties = fabBumping
    ? { transform: 'translateX(-50%) scale(1.05)' }
    : {}

  return (
    <div className="cust" style={{ fontFamily: 'var(--body)' }}>
      {/* MENU VIEW */}
      {view === 'menu' && (
        <div id="custMenu">
          {/* Hero Header */}
          <div className="chero">
            <div className="chero-in">
              <div className="eyebrow">Ayacucho · Perú</div>
              <h1>La sazón de <em>Tullpa</em>,<br />servida al instante</h1>
              <p>Explora la carta, arma tu pedido desde la mesa y sigue en vivo cómo se prepara. Del fogón directo a ti.</p>
              <div className="chero-meta">
                <span>🕑 Abierto <b>· 11:00 – 22:00</b></span>
                <span>📍 Mesa <b>{tableNumber}</b></span>
                <span>⭐ <b>4.8</b> · 320 reseñas</span>
              </div>
            </div>
          </div>

          {/* Content Wrapper */}
          <div className="cwrap">
            {/* Sticky Category Rail */}
            <nav className="catrail">
              <div className="catrail-in">
                {initialCategories.map((c) => {
                  const count = initialDishes.filter((d) => d.category_id === c.id).length
                  const isActive = activeCategoryId === c.id
                  return (
                    <button
                      key={c.id}
                      onClick={() => scrollToCategory(c.id)}
                      className={`catchip${isActive ? ' on' : ''}`}
                    >
                      <span className="em">{c.emoji}</span>
                      {c.name}
                      <span className="ct">{count}</span>
                    </button>
                  )
                })}
              </div>
            </nav>

            {/* Menu Sections */}
            <div id="menuSections">
              {initialCategories.map((c) => {
                const dishes = initialDishes.filter((d) => d.category_id === c.id)
                if (dishes.length === 0) return null

                return (
                  <section key={c.id} id={`sec-${c.id}`} className="catsec">
                    <div className="catsec-head">
                      <h2>{c.emoji} {c.name}</h2>
                      <div className="rule" />
                      <span className="cnt">{dishes.length} platos</span>
                    </div>

                    <div className="grid">
                      {dishes.map((d) => (
                        <div
                          key={d.id}
                          className={`card${d.available ? '' : ' out'}`}
                          onClick={() => d.available && openDish(d.id)}
                        >
                          <div
                            className="thumb"
                            style={{ background: getToneBg(d.tone) }}
                          >
                            {d.emoji}
                            {!d.available && (
                              <div className="soldout">
                                Agotado
                              </div>
                            )}
                          </div>

                          <div className="card-body">
                            <h3>{d.name}</h3>
                            <div className="desc">{d.desc}</div>
                            <div className="card-foot">
                              <div className="price">S/ {d.price.toFixed(2)}</div>
                              {d.available && (
                                <button
                                  className="addmini"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    addToCart(d, 1)
                                  }}
                                  aria-label={`Agregar ${d.name}`}
                                >
                                  +
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Floating FAB Cart Button */}
      {view === 'menu' && (
        <button
          className={`fab${cartCount === 0 ? ' hide' : ''}`}
          style={fabStyle}
          onClick={() => setView('cart')}
          aria-label="Ver carrito"
        >
          <span className="cico">
            🛒
            {cartCount > 0 && (
              <span key={badgeKey} className="cbadge">{cartCount}</span>
            )}
          </span>
          <span className="flabel">
            <b>Ver mi pedido</b>
            <span>{cartCount} {cartCount === 1 ? 'plato' : 'platos'}</span>
          </span>
          <span className="ftot">S/ {cartTotal.toFixed(2)}</span>
        </button>
      )}

      {/* CART VIEW */}
      {view === 'cart' && (
        <div id="custCart">
          <div className="subhead">
            <button className="back" onClick={() => setView('menu')}>←</button>
            <h2>Mi pedido</h2>
            <span className="step">Paso 1 de 2</span>
          </div>

          <div className="cartlist">
            {Object.keys(cart).length === 0 ? (
              <div className="empty">
                <div className="em">🍽️</div>
                <h3>Tu pedido está vacío</h3>
                <p>Vuelve a la carta y elige tus platos favoritos.</p>
                <button
                  className="btn btn-dark"
                  style={{ marginTop: '18px', display: 'inline-flex' }}
                  onClick={() => setView('menu')}
                >
                  Ver la carta
                </button>
              </div>
            ) : (
              <>
                {/* List items */}
                {Object.entries(cart).map(([dishId, qty]) => {
                  const dish = initialDishes.find((d) => d.id === dishId)
                  if (!dish) return null
                  return (
                    <div key={dishId} className="citem">
                      <div className="cthumb" style={{ background: getToneBg(dish.tone) }}>
                        {dish.emoji}
                      </div>
                      <div className="cinfo">
                        <h4>{dish.name}</h4>
                        <div className="u">S/ {dish.price.toFixed(2)} c/u</div>
                      </div>
                      <div className="cright">
                        <div className="qmini">
                          <button onClick={() => setQty(dishId, qty - 1)}>−</button>
                          <span className="v">{qty}</span>
                          <button onClick={() => setQty(dishId, qty + 1)}>+</button>
                        </div>
                        <span className="sub">S/ {(dish.price * qty).toFixed(2)}</span>
                      </div>
                    </div>
                  )
                })}

                {/* Details Form Card */}
                <div className="formcard">
                  <h3>Detalles del pedido <span className="hu">HU-04</span></h3>
                  <div className="field">
                    <label>Mesa</label>
                    <div className="tablepick" id="tablePick">
                      {[5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                        <button
                          key={n}
                          className={n === selectedTable ? 'on' : ''}
                          onClick={() => setSelectedTable(n)}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="field">
                    <label>Tu nombre (opcional)</label>
                    <input
                      type="text"
                      placeholder="Ej. Oscar"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label>Nota para la cocina (opcional)</label>
                    <textarea
                      rows={2}
                      placeholder="Ej. Sin ají, poco arroz…"
                      value={kitchenNote}
                      onChange={(e) => setKitchenNote(e.target.value)}
                    />
                  </div>
                </div>

                {/* Totals Summary */}
                <div className="formcard">
                  <div className="totrow">
                    <span>Subtotal ({cartCount} {cartCount === 1 ? 'plato' : 'platos'})</span>
                    <span className="m">S/ {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="totrow">
                    <span>Servicio</span>
                    <span className="m">Incluido</span>
                  </div>
                  <div className="totrow grand">
                    <span>Total</span>
                    <span className="m">S/ {cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Place Order button */}
                <button
                  className="btn btn-primary btn-block"
                  style={{ marginTop: '18px' }}
                  onClick={placeOrder}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Confirmar y enviar pedido'}
                </button>

                <button
                  className="btn btn-ghost btn-block"
                  style={{ marginTop: '10px' }}
                  onClick={() => setView('menu')}
                >
                  Seguir pidiendo
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* TRACKING VIEW */}
      {view === 'track' && (
        <div id="custTrack">
          <div className="subhead">
            <button className="back" onClick={() => setView('menu')}>←</button>
            <h2>Estado de tu comanda</h2>
            <span className="step">Paso 2 de 2</span>
          </div>

          <div className="track">
            {!currentOrder ? (
              <div className="empty">
                <div className="em">📭</div>
                <h3>Aún no hay pedidos</h3>
                <p>Haz tu primer pedido para verlo aquí.</p>
              </div>
            ) : (
              <>
                <div className="track-badge">
                  <span className="em">{currentOrder.status === 'entregado' ? '🍽️' : '👨‍🍳'}</span>
                </div>
                <h2>{currentOrder.status === 'entregado' ? '¡Buen provecho!' : 'Preparando tu pedido'}</h2>
                <div className="code">
                  Pedido {currentOrder.code} · Mesa {currentOrder.table_number} <span className="hu">HU-05</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span className="livechip">
                    <span className="livedot" />
                    Actualización en vivo, sin recargar
                  </span>
                </div>

                <div className="stepper">
                  {STATUS_ORDER.map((s, i) => {
                    const currentIdx = STATUS_ORDER.indexOf(currentOrder.status as any)
                    const isDone = i < currentIdx
                    const isActive = i === currentIdx
                    const stateClass = isDone ? 'done' : isActive ? 'active' : ''
                    const time = currentOrder.history?.[s] || ''

                    return (
                      <div key={s} className={`tstep ${stateClass}`}>
                        <div className="rail" />
                        <div className="tdot">{STATUS_DETAILS[s].emoji}</div>
                        <div className="tinfo">
                          <h4>{STATUS_DETAILS[s].label}</h4>
                          <p>{STATUS_DETAILS[s].copy}</p>
                          {time && <div className="time">{time}</div>}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="order-recap">
                  <h4>Resumen del pedido</h4>
                  {currentOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="recap-item">
                      <span>{item.emoji} {item.qty}× {item.name}</span>
                      <span className="m">S/ {(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                  <div
                    className="recap-item"
                    style={{ borderTop: '1px dashed var(--line)', marginTop: '6px', paddingTop: '10px', fontWeight: 700, color: 'var(--ink)' }}
                  >
                    <span>Total</span>
                    <span className="m">S/ {currentOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  className="btn btn-ghost btn-block"
                  style={{ marginTop: '18px' }}
                  onClick={() => setView('menu')}
                >
                  Volver a la carta
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Toast notifications container */}
      <div className="toast-wrap" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast${t.visible ? ' show' : ''}`}>
            <span className="tem">{t.emoji}</span>
            {t.msg}
          </div>
        ))}
      </div>

      {/* Detail Sheet Modal */}
      {selectedDishId && selectedDish && (
        <div
          className={`scrim${sheetOpen ? ' on' : ''}`}
          onClick={closeDish}
        >
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            {/* Sheet hero */}
            <div
              className="sheet-hero"
              style={{ background: getToneBg(selectedDish.tone) }}
            >
              {selectedDish.emoji}
              <button className="sheet-close" onClick={closeDish}>×</button>
            </div>

            {/* Sheet body */}
            <div className="sheet-body">
              <div className="cat-lbl">
                {initialCategories.find((c) => c.id === selectedDish.category_id)?.emoji}{' '}
                {initialCategories.find((c) => c.id === selectedDish.category_id)?.name}{' '}
                <span className="hu">HU-02</span>
              </div>
              <h2>{selectedDish.name}</h2>
              <p className="long">{selectedDish.desc}</p>
              <div className="sheet-price">S/ {selectedDish.price.toFixed(2)}</div>

              <div className="qtyrow">
                <div className="qty">
                  <button onClick={() => setSheetQty((q) => Math.max(1, q - 1))}>−</button>
                  <span className="val">{sheetQty}</span>
                  <button onClick={() => setSheetQty((q) => q + 1)}>+</button>
                </div>
                <span style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>Cantidad</span>
              </div>

              <button
                className="btn btn-primary btn-block"
                onClick={() => {
                  addToCart(selectedDish, sheetQty)
                  closeDish()
                }}
              >
                Agregar al pedido · <span>S/ {(selectedDish.price * sheetQty).toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
