// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react'
import DigitalMenu from '../components/DigitalMenu'
import React from 'react'

afterEach(cleanup)

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(() => ({
    get: vi.fn((key) => {
      if (key === 'table' || key === 'mesa') return '7'
      return null
    }),
  })),
}))

// Mock supabase client
vi.mock('../utils/supabase/client', () => {
  const mockFrom = vi.fn((table) => {
    if (table === 'orders') {
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: { id: 'mock-active-order-id', code: '#5678', table_number: 9, customer_name: 'Elena', note: 'Sin picante', status: 'preparacion', total: 32, created_at: new Date().toISOString() },
              error: null
            }))
          }))
        })),
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: { id: 'mock-order-id', code: '#1234' }, error: null }))
          }))
        })),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      }
    }
    if (table === 'order_items') {
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({
            data: [{ id: 'item-1', name: 'Causa Limeña', emoji: '🥙', qty: 2, price: 16 }],
            error: null
          }))
        })),
        insert: vi.fn(() => Promise.resolve({ error: null })),
      }
    }
    return {
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
    }
  })

  return {
    createClient: vi.fn(() => ({
      auth: {
        getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
        signInAnonymously: vi.fn(() => Promise.resolve({ data: { user: { id: 'mock-user-id' } }, error: null })),
      },
      from: mockFrom,
      channel: vi.fn(() => ({
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockReturnThis(),
      })),
      removeChannel: vi.fn(),
    })),
  }
})

const mockCategories = [
  { id: 'c1', name: 'Entradas', emoji: '🥗' },
]

const mockDishes = [
  {
    id: 'd1',
    category_id: 'c1',
    name: 'Causa Limeña',
    emoji: '🥙',
    price: 16,
    tone: 44,
    available: true,
    desc: 'Masa de papa amarilla al limón rellena de pollo.',
  },
]

describe('DigitalMenu Component', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders menu and opens/closes modal detail sheet', async () => {
    render(<DigitalMenu initialCategories={mockCategories} initialDishes={mockDishes} />)

    // Verify initial render
    expect(screen.getByText('🥗 Entradas')).toBeDefined()
    expect(screen.getAllByText('Causa Limeña')[0]).toBeDefined()

    // Click available card to open modal
    const availableCard = screen.getAllByText('Causa Limeña')[0].closest('div.card')!
    fireEvent.click(availableCard)

    // Verify modal content is rendered (index 1 contains the modal text)
    expect(screen.getByText('HU-02')).toBeDefined()
    expect(screen.getAllByText('Causa Limeña')[1]).toBeDefined()
    expect(screen.getAllByText('Masa de papa amarilla al limón rellena de pollo.')[1]).toBeDefined()

    // Close modal
    const closeBtn = screen.getByText('×')
    fireEvent.click(closeBtn)

    // Wait for modal to be removed from DOM
    await waitFor(() => {
      expect(screen.queryByText('HU-02')).toBeNull()
    }, { timeout: 600 })
  })

  it('handles cart operations and order placement transition', async () => {
    render(<DigitalMenu initialCategories={mockCategories} initialDishes={mockDishes} />)

    // 1. Add item to cart via quickAdd (+) button
    const quickAddBtn = screen.getByLabelText('Agregar Causa Limeña')
    fireEvent.click(quickAddBtn)

    // Verify FAB becomes visible and shows total
    expect(screen.getByText('Ver mi pedido')).toBeDefined()
    expect(screen.getAllByText('S/ 16.00').length).toBeGreaterThanOrEqual(2)

    // 2. Click FAB to navigate to cart view
    const fabButton = screen.getByLabelText('Ver carrito')
    fireEvent.click(fabButton)

    // Verify we are on the cart view
    expect(screen.getByText('Mi pedido')).toBeDefined()
    expect(screen.getByText('Paso 1 de 2')).toBeDefined()
    expect(screen.getByText('Detalles del pedido')).toBeDefined()

    // 3. Test quantity change: click increment (+) in cart
    // Since there are multiple '+' buttons (quick add inside modal/menu and cart), we select the one inside the cart items list
    const plusButtons = screen.getAllByText('+')
    const cartIncrementBtn = plusButtons[plusButtons.length - 1] // last one is the confirm form / increment button
    fireEvent.click(cartIncrementBtn)

    // Verify quantity and subtotal updated
    expect(screen.getByText('2')).toBeDefined()
    expect(screen.getAllByText('S/ 32.00').length).toBeGreaterThan(0)

    // 4. Input name and note
    const nameInput = screen.getByPlaceholderText('Ej. Oscar')
    fireEvent.change(nameInput, { target: { value: 'Oscar' } })
    
    const notesTextarea = screen.getByPlaceholderText('Ej. Sin ají, poco arroz…')
    fireEvent.change(notesTextarea, { target: { value: 'Sin cebolla' } })

    // 5. Confirm and send order
    const confirmBtn = screen.getByText('Confirmar y enviar pedido')
    fireEvent.click(confirmBtn)

    // Verify transition to tracking view
    await waitFor(() => {
      expect(screen.getByText('Estado de tu comanda')).toBeDefined()
      expect(screen.getByText('Paso 2 de 2')).toBeDefined()
      expect(screen.getByText('Actualización en vivo, sin recargar')).toBeDefined()
      expect(screen.getByText('Total')).toBeDefined()
    })
  })

  it('restores active order tracking on mount if stored in localStorage', async () => {
    // Set active order ID in localStorage
    localStorage.setItem('tullpa_active_order_id', 'mock-active-order-id')

    render(<DigitalMenu initialCategories={mockCategories} initialDishes={mockDishes} />)

    // Verify it automatically displays the tracking screen and correct restored fields
    await waitFor(() => {
      expect(screen.getByText('Estado de tu comanda')).toBeDefined()
      expect(screen.getByText('Paso 2 de 2')).toBeDefined()
      expect(screen.getByText(/Pedido/)).toBeDefined()
      expect(screen.getByText(/5678/)).toBeDefined()
      expect(screen.getByText(/Mesa/)).toBeDefined()
      expect(screen.getByText(/Causa/)).toBeDefined()
      expect(screen.getByText('Total')).toBeDefined()
    })

    // Clean up
    localStorage.removeItem('tullpa_active_order_id')
  })
})
