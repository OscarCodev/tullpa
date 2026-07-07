// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react'
import DigitalMenu from '../components/DigitalMenu'
import React from 'react'

afterEach(cleanup)

// Mock search params
vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(() => ({
    get: vi.fn((key) => {
      if (key === 'table' || key === 'mesa') return '5'
      return null
    }),
  })),
}))

// Mock Supabase client
const mockInsertSelect = vi.fn(() => ({
  single: vi.fn(() => Promise.resolve({ data: { id: 'o-100', code: '#9999' }, error: null }))
}))

const mockInsertOrderItems = vi.fn(() => Promise.resolve({ error: null }))

vi.mock('../utils/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
      signInAnonymously: vi.fn(() => Promise.resolve({ data: { user: { id: 'u-100' } }, error: null })),
    },
    from: vi.fn((table) => {
      if (table === 'orders') {
        return {
          insert: vi.fn(() => ({
            select: mockInsertSelect
          }))
        }
      }
      if (table === 'order_items') {
        return {
          insert: mockInsertOrderItems
        }
      }
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
      }
    }),
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
    })),
    removeChannel: vi.fn(),
  }))
}))

const testCategories = [{ id: 'cat-1', name: 'Bebidas', emoji: '🥤' }]
const testDishes = [
  {
    id: 'd-abc',
    category_id: 'cat-1',
    name: 'Chicha Morada',
    emoji: '🥤',
    price: 8.50,
    tone: 280,
    available: true,
    desc: 'Bebida típica peruana'
  }
]

describe('Shopping Cart & Order Checkout Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('calculates shopping cart totals on addition, increment, decrement, and deletion', async () => {
    render(<DigitalMenu initialCategories={testCategories} initialDishes={testDishes} />)

    // 1. Add dish to cart
    const addBtn = screen.getByLabelText('Agregar Chicha Morada')
    fireEvent.click(addBtn)

    // Subtotal total check (S/ 8.50)
    expect(screen.getByText('Ver mi pedido')).toBeDefined()
    expect(screen.getAllByText('S/ 8.50').length).toBeGreaterThanOrEqual(1)

    // 2. Open cart view
    const viewCartBtn = screen.getByLabelText('Ver carrito')
    fireEvent.click(viewCartBtn)

    expect(screen.getByText('Mi pedido')).toBeDefined()
    expect(screen.getByText('Chicha Morada')).toBeDefined()
    expect(screen.getByText('1')).toBeDefined()

    // 3. Increment quantity
    const plusBtns = screen.getAllByText('+')
    const cartIncrementBtn = plusBtns[plusBtns.length - 1]
    fireEvent.click(cartIncrementBtn)

    // Check quantity updates to 2, subtotal S/ 17.00
    expect(screen.getByText('2')).toBeDefined()
    expect(screen.getAllByText('S/ 17.00').length).toBeGreaterThanOrEqual(1)

    // 4. Decrement quantity
    const minusBtns = screen.getAllByText('−')
    const cartDecrementBtn = minusBtns[minusBtns.length - 1]
    fireEvent.click(cartDecrementBtn)

    // Check quantity updates back to 1
    expect(screen.getByText('1')).toBeDefined()
    expect(screen.getAllByText('S/ 8.50').length).toBeGreaterThanOrEqual(1)

    // 5. Decrement quantity to 0 (which removes item from cart)
    fireEvent.click(cartDecrementBtn)

    // Cart is empty, should redirect or show empty state
    expect(screen.queryByText('Chicha Morada')).toBeNull()
  })

  it('validates checkout form submission and format values', async () => {
    render(<DigitalMenu initialCategories={testCategories} initialDishes={testDishes} />)

    // Add item and navigate to cart
    fireEvent.click(screen.getByLabelText('Agregar Chicha Morada'))
    fireEvent.click(screen.getByLabelText('Ver carrito'))

    // Fill customer checkout details
    const nameInput = screen.getByPlaceholderText('Ej. Oscar')
    fireEvent.change(nameInput, { target: { value: 'Oscar' } })

    const notesTextarea = screen.getByPlaceholderText('Ej. Sin ají, poco arroz…')
    fireEvent.change(notesTextarea, { target: { value: 'Hielo en cubos' } })

    // Click confirm order
    const submitBtn = screen.getByText('Confirmar y enviar pedido')
    fireEvent.click(submitBtn)

    await waitFor(() => {
      // Check that mockInsertSelect was called once on orders table
      expect(mockInsertSelect).toHaveBeenCalled()
      // Check order items insert mapping
      expect(mockInsertOrderItems).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Chicha Morada',
            qty: 1,
            price: 8.50
          })
        ])
      )
    })
  })
})
