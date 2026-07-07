import { describe, it, expect, vi } from 'vitest'

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key'

// Mock @supabase/ssr
vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn((url, key) => ({ url, key, type: 'browser' })),
  createServerClient: vi.fn((url, key, options) => ({ url, key, options, type: 'server' })),
}))

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({
    getAll: vi.fn(() => []),
    set: vi.fn(),
  })),
}))

import { createClient as createBrowserClient } from '../utils/supabase/client'
import { createClient as createServerClient } from '../utils/supabase/server'

describe('Supabase Client Factories', () => {
  it('should initialize browser client with env vars', () => {
    const client = createBrowserClient()
    expect(client).toBeDefined()
    expect((client as any).url).toBe('https://example.supabase.co')
    expect((client as any).key).toBe('mock-anon-key')
  })

  it('should initialize server client with cookies option', async () => {
    const client = await createServerClient()
    expect(client).toBeDefined()
    expect((client as any).url).toBe('https://example.supabase.co')
    expect((client as any).key).toBe('mock-anon-key')
    expect((client as any).options.cookies).toBeDefined()
  })
})
