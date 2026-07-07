// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react'
import MenuCategoryCRUD from '../components/MenuCategoryCRUD'
import React from 'react'

afterEach(cleanup)

// Mock data
const mockCategories = [
  { id: 'c1', name: 'Entradas', emoji: '🥗', created_at: new Date().toISOString() },
  { id: 'c2', name: 'Fondos', emoji: '🍛', created_at: new Date().toISOString() }
]

const mockDishes = [
  {
    id: 'd1',
    name: 'Ceviche Clásico',
    description: 'Pescado fresco marinado en limón',
    price: 30.00,
    category_id: 'c1',
    available: true,
    emoji: '🐟',
    tone: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 'd2',
    name: 'Lomo Saltado',
    description: 'Lomo con cebolla y tomate',
    price: 40.00,
    category_id: 'c2',
    available: false,
    emoji: '🥩',
    tone: 30,
    created_at: new Date().toISOString()
  }
]

// Mock alert and confirm
const mockAlert = vi.fn()
const mockConfirm = vi.fn(() => true)
vi.stubGlobal('alert', mockAlert)
vi.stubGlobal('confirm', mockConfirm)

// Mock queries
const mockInsert = vi.fn(() => Promise.resolve({ error: null }))
const mockUpdate = vi.fn(() => ({
  eq: vi.fn(() => Promise.resolve({ error: null }))
}))
const mockDelete = vi.fn(() => ({
  eq: vi.fn(() => Promise.resolve({ error: null }))
}))

vi.mock('../utils/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn((table) => {
      if (table === 'categories') {
        return {
          select: vi.fn(() => ({
            order: vi.fn(() => Promise.resolve({ data: mockCategories, error: null }))
          })),
          insert: mockInsert,
          update: mockUpdate,
          delete: mockDelete
        }
      }
      if (table === 'dishes') {
        return {
          select: vi.fn(() => ({
            order: vi.fn(() => Promise.resolve({ data: mockDishes, error: null }))
          })),
          insert: mockInsert,
          update: mockUpdate,
          delete: mockDelete
        }
      }
      return {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis()
      }
    })
  }))
}))

describe('MenuCategoryCRUD Component', () => {
  it('renders dishes list by default', async () => {
    render(<MenuCategoryCRUD />)

    // Wait for load
    await waitFor(() => {
      expect(screen.getByText('Listado de Platos')).toBeDefined()
    })

    // Assert dishes render
    expect(screen.getByText('Ceviche Clásico')).toBeDefined()
    expect(screen.getByText('Pescado fresco marinado en limón')).toBeDefined()
    expect(screen.getByText('S/ 30.00')).toBeDefined()
    expect(screen.getByText('Disponible')).toBeDefined()

    expect(screen.getByText('Lomo Saltado')).toBeDefined()
    expect(screen.getByText('Lomo con cebolla y tomate')).toBeDefined()
    expect(screen.getByText('S/ 40.00')).toBeDefined()
    expect(screen.getByText('Agotado')).toBeDefined()
  })

  it('switches tabs and displays categories list', async () => {
    render(<MenuCategoryCRUD />)

    await waitFor(() => {
      expect(screen.getByText('📂 Categorías')).toBeDefined()
    })

    const catTabBtn = screen.getByText('📂 Categorías')
    fireEvent.click(catTabBtn)

    // Assert categories view elements
    expect(screen.getByText('Categorías de la Carta')).toBeDefined()
    expect(screen.getByText('Entradas')).toBeDefined()
    expect(screen.getByText('Fondos')).toBeDefined()
    expect(screen.getAllByText((_, el) => el?.className === 'cd' && /1\s+plato/.test(el?.textContent || '')).length).toBe(2)
  })

  it('toggles availability on pill click', async () => {
    render(<MenuCategoryCRUD />)

    await waitFor(() => {
      expect(screen.getByText('Disponible')).toBeDefined()
    })

    const toggleBtn = screen.getByText('Disponible')
    fireEvent.click(toggleBtn)

    expect(mockUpdate).toHaveBeenCalled()
  })

  it('validates delete category with active dishes link', async () => {
    render(<MenuCategoryCRUD />)

    await waitFor(() => {
      expect(screen.getByText('📂 Categorías')).toBeDefined()
    })

    // Switch to categories tab
    fireEvent.click(screen.getByText('📂 Categorías'))

    const deleteBtns = screen.getAllByTitle('Eliminar')
    // Click delete on Entradas category (has 1 dish)
    fireEvent.click(deleteBtns[0])

    expect(mockAlert).toHaveBeenCalledWith(
      expect.stringContaining('No se puede eliminar la categoría porque tiene platos asociados')
    )
    expect(mockDelete).not.toHaveBeenCalled()
  })
})
