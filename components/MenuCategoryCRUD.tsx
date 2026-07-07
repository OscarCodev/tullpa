'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../utils/supabase/client'

interface Category {
  id: string
  name: string
  emoji: string
  created_at: string
}

interface Dish {
  id: string
  name: string
  desc: string
  price: number
  category_id: string
  available: boolean
  emoji: string
  tone: number
  created_at: string
}

export default function MenuCategoryCRUD() {
  const supabase = createClient()

  const [activeTab, setActiveTab] = useState<'dishes' | 'categories'>('dishes')
  const [categories, setCategories] = useState<Category[]>([])
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modals state
  const [categoryModal, setCategoryModal] = useState<{
    open: boolean
    mode: 'create' | 'edit'
    id?: string
    name: string
    emoji: string
  }>({ open: false, mode: 'create', name: '', emoji: '' })

  const [dishModal, setDishModal] = useState<{
    open: boolean
    mode: 'create' | 'edit'
    id?: string
    name: string
    desc: string
    price: string
    category_id: string
    available: boolean
    emoji: string
    tone: number
  }>({
    open: false,
    mode: 'create',
    name: '',
    desc: '',
    price: '',
    category_id: '',
    available: true,
    emoji: '🍲',
    tone: 30,
  })

  async function fetchData() {
    try {
      setLoading(true)
      const { data: cats, error: catsErr } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

      if (catsErr) throw catsErr

      const { data: dshs, error: dshsErr } = await supabase
        .from('dishes')
        .select('*')
        .order('name', { ascending: true })

      if (dshsErr) throw dshsErr

      setCategories(cats || [])
      setDishes(
        (dshs || []).map((d: any) => ({
          ...d,
          price: Number(d.price),
        }))
      )
    } catch (err: any) {
      console.error('Error fetching menu data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Categories CRUD Handlers
  async function handleSaveCategory(e: React.FormEvent) {
    e.preventDefault()
    if (!categoryModal.name || !categoryModal.emoji) return

    try {
      if (categoryModal.mode === 'create') {
        const { error } = await supabase
          .from('categories')
          .insert({
            name: categoryModal.name,
            emoji: categoryModal.emoji,
          })
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('categories')
          .update({
            name: categoryModal.name,
            emoji: categoryModal.emoji,
          })
          .eq('id', categoryModal.id!)
        if (error) throw error
      }
      setCategoryModal({ open: false, mode: 'create', name: '', emoji: '' })
      fetchData()
    } catch (err: any) {
      alert(`Error al guardar categoría: ${err.message}`)
    }
  }

  async function handleDeleteCategory(catId: string) {
    const linkedDishes = dishes.filter((d) => d.category_id === catId)
    if (linkedDishes.length > 0) {
      alert(
        `No se puede eliminar la categoría porque tiene platos asociados (${linkedDishes.length} platos).`
      )
      return
    }

    if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return

    try {
      const { error } = await supabase.from('categories').delete().eq('id', catId)
      if (error) throw error
      fetchData()
    } catch (err: any) {
      alert(`Error al eliminar categoría: ${err.message}`)
    }
  }

  // Dishes CRUD Handlers
  async function handleSaveDish(e: React.FormEvent) {
    e.preventDefault()
    const { name, desc, price, category_id, available, emoji, tone, id, mode } = dishModal
    if (!name || !price || !category_id || !emoji) {
      alert('Por favor completa los campos requeridos.')
      return
    }

    try {
      const payload = {
        name,
        desc,
        price: Number(price),
        category_id,
        available,
        emoji,
        tone,
      }

      if (mode === 'create') {
        const { error } = await supabase.from('dishes').insert(payload)
        if (error) throw error
      } else {
        const { error } = await supabase.from('dishes').update(payload).eq('id', id!)
        if (error) throw error
      }

      setDishModal({
        open: false,
        mode: 'create',
        name: '',
        desc: '',
        price: '',
        category_id: '',
        available: true,
        emoji: '🍲',
        tone: 30,
      })
      fetchData()
    } catch (err: any) {
      alert(`Error al guardar plato: ${err.message}`)
    }
  }

  async function handleDeleteDish(dishId: string) {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este plato?')) return

    try {
      const { error } = await supabase.from('dishes').delete().eq('id', dishId)
      if (error) throw error
      fetchData()
    } catch (err: any) {
      alert(`Error al eliminar plato: ${err.message}`)
    }
  }

  async function toggleDishAvailability(dish: Dish) {
    const nextVal = !dish.available
    try {
      // Optimistic update
      setDishes((prev) =>
        prev.map((d) => (d.id === dish.id ? { ...d, available: nextVal } : d))
      )

      const { error } = await supabase
        .from('dishes')
        .update({ available: nextVal })
        .eq('id', dish.id)

      if (error) throw error
    } catch (err: any) {
      alert(`Error al actualizar disponibilidad: ${err.message}`)
      fetchData()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-[var(--night-soft)] font-mono text-[14px]">
        Cargando configuración de la carta...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 col text-center" style={{ borderColor: 'var(--ember)' }}>
        <span className="text-[26px] block mb-2">⚠️</span>
        <h3 className="font-semibold text-white">Error cargando carta</h3>
        <p className="text-[var(--night-soft)] text-[13px] mt-1">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex gap-4 border-b border-[var(--night-line)] pb-4">
        <button
          onClick={() => setActiveTab('dishes')}
          className={`dbtn ${activeTab === 'dishes' ? 'gold' : 'ghost'}`}
        >
          🍛 Platos
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`dbtn ${activeTab === 'categories' ? 'gold' : 'ghost'}`}
        >
          📂 Categorías
        </button>
      </div>

      {activeTab === 'dishes' && (
        <div>
          <div className="toolbar justify-between">
            <h2 className="font-[var(--disp)] text-[20px] font-semibold text-white">Listado de Platos</h2>
            <button
              onClick={() => {
                if (categories.length === 0) {
                  alert('Crea al menos una categoría antes de agregar platos.')
                  return
                }
                setDishModal({
                  open: true,
                  mode: 'create',
                  name: '',
                  desc: '',
                  price: '',
                  category_id: categories[0].id,
                  available: true,
                  emoji: '🍲',
                  tone: 30,
                })
              }}
              className="dbtn gold"
            >
              ➕ Nuevo Plato
            </button>
          </div>

          <div className="mtable">
            <div className="mrow hd">
              <div>Icono</div>
              <div>Detalles del Plato</div>
              <div>Categoría</div>
              <div>Precio</div>
              <div style={{ textAlign: 'right' }}>Acciones</div>
            </div>

            {dishes.length === 0 ? (
              <div className="col-empty text-[var(--night-faint)] text-center p-8">
                No hay platos registrados. ¡Crea el primero!
              </div>
            ) : (
              dishes.map((dish) => {
                const cat = categories.find((c) => c.id === dish.category_id)
                return (
                  <div key={dish.id} className="mrow">
                    <div className="mth" style={{ filter: `hue-rotate(${dish.tone}deg)` }}>
                      {dish.emoji}
                    </div>
                    <div>
                      <div className="mn">{dish.name}</div>
                      <div className="mc truncate max-w-[280px]" title={dish.desc}>
                        {dish.desc || 'Sin descripción'}
                      </div>
                    </div>
                    <div className="text-[13px] text-[var(--night-soft)]">
                      {cat ? cat.name : 'Sin categoría'}
                    </div>
                    <div className="mp">S/ {dish.price.toFixed(2)}</div>
                    <div className="mactions">
                      <button
                        onClick={() => toggleDishAvailability(dish)}
                        className={`pill ${dish.available ? 'ok' : 'off'}`}
                        title="Click para cambiar disponibilidad"
                      >
                        {dish.available ? 'Disponible' : 'Agotado'}
                      </button>
                      <button
                        onClick={() =>
                          setDishModal({
                            open: true,
                            mode: 'edit',
                            id: dish.id,
                            name: dish.name,
                            desc: dish.desc || '',
                            price: String(dish.price),
                            category_id: dish.category_id,
                            available: dish.available,
                            emoji: dish.emoji,
                            tone: dish.tone,
                          })
                        }
                        className="iconbtn"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteDish(dish.id)}
                        className="iconbtn del"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div>
          <div className="toolbar justify-between">
            <h2 className="font-[var(--disp)] text-[20px] font-semibold text-white">Categorías de la Carta</h2>
            <button
              onClick={() =>
                setCategoryModal({
                  open: true,
                  mode: 'create',
                  name: '',
                  emoji: '📂',
                })
              }
              className="dbtn gold"
            >
              ➕ Nueva Categoría
            </button>
          </div>

          {categories.length === 0 ? (
            <div className="col-empty text-[var(--night-faint)] text-center p-8">
              No hay categorías registradas. ¡Crea la primera!
            </div>
          ) : (
            <div className="catgrid">
              {categories.map((cat) => {
                const count = dishes.filter((d) => d.category_id === cat.id).length
                return (
                  <div key={cat.id} className="catmcard">
                    <div className="top">
                      <span className="cem">{cat.emoji}</span>
                      <div>
                        <h4>{cat.name}</h4>
                        <div className="cd">
                          {count} {count === 1 ? 'plato' : 'platos'}
                        </div>
                      </div>
                    </div>
                    <div className="actions">
                      <button
                        onClick={() =>
                          setCategoryModal({
                            open: true,
                            mode: 'edit',
                            id: cat.id,
                            name: cat.name,
                            emoji: cat.emoji,
                          })
                        }
                        className="dbtn ghost"
                        style={{ flex: 1, justifyContent: 'center' }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="iconbtn del"
                        title="Eliminar"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '15px', height: '15px' }}>
                          <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Category Modal Overlay */}
      {categoryModal.open && (
        <div className="smodal on">
          <form onSubmit={handleSaveCategory} className="smodal-card">
            <h3>
              {categoryModal.mode === 'create' ? '➕ Nueva categoría' : '✏️ Editar categoría'}
            </h3>

            <div className="dfield">
              <label>Nombre de la Categoría</label>
              <input
                type="text"
                required
                value={categoryModal.name}
                onChange={(e) => setCategoryModal((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ej. Parrillas"
              />
            </div>

            <div className="dfield">
              <label>Emoji / Icono</label>
              <input
                type="text"
                required
                value={categoryModal.emoji}
                onChange={(e) => setCategoryModal((prev) => ({ ...prev, emoji: e.target.value }))}
                placeholder="Ej. 🥗"
              />
            </div>

            <div className="smodal-actions">
              <button
                type="button"
                onClick={() => setCategoryModal((prev) => ({ ...prev, open: false }))}
                className="btn btn-ghost"
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Dish Modal Overlay */}
      {dishModal.open && (
        <div className="smodal on">
          <form onSubmit={handleSaveDish} className="smodal-card">
            <h3>
              {dishModal.mode === 'create' ? '➕ Nuevo plato' : '✏️ Editar plato'}
            </h3>

            <div className="dfield">
              <label>Nombre del Plato</label>
              <input
                type="text"
                required
                value={dishModal.name}
                onChange={(e) => setDishModal((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ej. Lomo Saltado"
              />
            </div>

            <div className="dfield">
              <label>Descripción / Detalles</label>
              <textarea
                value={dishModal.desc}
                onChange={(e) => setDishModal((prev) => ({ ...prev, desc: e.target.value }))}
                placeholder="Ej. Trozos de carne flameados con cebolla y tomate..."
                rows={2}
                style={{ resize: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="dfield">
                <label>Precio (S/)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={dishModal.price}
                  onChange={(e) => setDishModal((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="25.00"
                />
              </div>

              <div className="dfield">
                <label>Categoría</label>
                <select
                  required
                  value={dishModal.category_id}
                  onChange={(e) =>
                    setDishModal((prev) => ({ ...prev, category_id: e.target.value }))
                  }
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} style={{ background: 'var(--night-3)' }}>
                      {c.emoji} {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="dfield">
                <label>Emoji / Icono</label>
                <input
                  type="text"
                  required
                  value={dishModal.emoji}
                  onChange={(e) => setDishModal((prev) => ({ ...prev, emoji: e.target.value }))}
                  placeholder="🍲"
                />
              </div>

              <div className="dfield">
                <label>Tono Rotación HSL ({dishModal.tone}°)</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={dishModal.tone}
                  onChange={(e) =>
                    setDishModal((prev) => ({ ...prev, tone: Number(e.target.value) }))
                  }
                  style={{
                    marginTop: '8px',
                    accentColor: 'var(--gold)',
                  }}
                />
              </div>
            </div>

            <div className="dcheck">
              <input
                type="checkbox"
                id="available"
                checked={dishModal.available}
                onChange={(e) => setDishModal((prev) => ({ ...prev, available: e.target.checked }))}
              />
              <span>
                ¿Plato disponible para la venta?
              </span>
            </div>

            <div className="smodal-actions">
              <button
                type="button"
                onClick={() =>
                  setDishModal({
                    open: false,
                    mode: 'create',
                    name: '',
                    desc: '',
                    price: '',
                    category_id: '',
                    available: true,
                    emoji: '🍲',
                    tone: 30,
                  })
                }
                className="btn btn-ghost"
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
