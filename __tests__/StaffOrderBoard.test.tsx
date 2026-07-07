// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react'
import StaffOrderBoard from '../components/StaffOrderBoard'
import React from 'react'

afterEach(cleanup)

// Mock orders data
const mockOrders = [
  {
    id: 'o1',
    code: '#1234',
    table_number: 5,
    customer_name: 'Elena',
    note: 'Sin ají',
    status: 'recibido',
    total: 28.50,
    created_at: new Date().toISOString(),
    order_items: [
      { id: 'oi1', name: 'Ceviche Clásico', qty: 1, price: 28.50 }
    ]
  },
  {
    id: 'o2',
    code: '#5678',
    table_number: 8,
    customer_name: 'Oscar',
    note: null,
    status: 'preparacion',
    total: 32.00,
    created_at: new Date().toISOString(),
    order_items: [
      { id: 'oi2', name: 'Causa Limeña', qty: 2, price: 16.00 }
    ]
  },
  {
    id: 'o3',
    code: '#9012',
    table_number: 12,
    customer_name: 'Rosa',
    note: 'Poco arroz',
    status: 'listo',
    total: 36.00,
    created_at: new Date().toISOString(),
    order_items: [
      { id: 'oi3', name: 'Lomo Saltado', qty: 1, price: 36.00 }
    ]
  }
]

// Mock update handler
const mockUpdate = vi.fn(() => ({
  eq: vi.fn(() => Promise.resolve({ error: null }))
}))

// Mock supabase client
vi.mock('../utils/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn((table) => {
      if (table === 'orders') {
        return {
          select: vi.fn(() => ({
            order: vi.fn(() => Promise.resolve({ data: mockOrders, error: null }))
          })),
          update: mockUpdate
        }
      }
      return {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis()
      }
    }),
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis()
    })),
    removeChannel: vi.fn()
  }))
}))

describe('StaffOrderBoard Component', () => {
  it('renders columns and active order cards correctly', async () => {
    render(<StaffOrderBoard />)

    // Verify all four columns are rendered
    await waitFor(() => {
      expect(screen.getByText('Recibido')).toBeDefined()
      expect(screen.getByText('En preparación')).toBeDefined()
      expect(screen.getByText('Listo')).toBeDefined()
      expect(screen.getByText('Entregado')).toBeDefined()
    })

    // Verify correct counts in badges
    expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(3)

    // Verify order cards content
    expect(screen.getByText('#1234')).toBeDefined()
    expect(screen.getByText('Mesa 5')).toBeDefined()
    expect(screen.getByText('Elena')).toBeDefined()
    expect(screen.getByText('Sin ají')).toBeDefined()
    expect(screen.getByText('Ceviche Clásico')).toBeDefined()

    expect(screen.getByText('#5678')).toBeDefined()
    expect(screen.getByText('Mesa 8')).toBeDefined()
    expect(screen.getByText('Oscar')).toBeDefined()
    expect(screen.getByText('Causa Limeña')).toBeDefined()

    expect(screen.getByText('#9012')).toBeDefined()
    expect(screen.getByText('Mesa 12')).toBeDefined()
    expect(screen.getByText('Rosa')).toBeDefined()
    expect(screen.getByText('Poco arroz')).toBeDefined()
    expect(screen.getByText('Lomo Saltado')).toBeDefined()
  })

  it('triggers order status advancement update on button click', async () => {
    render(<StaffOrderBoard />)

    await waitFor(() => {
      expect(screen.getByText('🔥 Preparar')).toBeDefined()
    })

    const prepareBtn = screen.getByText('🔥 Preparar')
    fireEvent.click(prepareBtn)

    // Check if it updates orders table status for the correct order UUID
    expect(mockUpdate).toHaveBeenCalledWith({ status: 'preparacion' })
  })
})
