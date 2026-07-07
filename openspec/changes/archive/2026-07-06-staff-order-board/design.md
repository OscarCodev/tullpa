## Context

Currently, the admin panel in `app/admin/page.tsx` displays placeholder cards. We need to implement a real-time order board here that organizes orders by status and lets staff members advance orders from Recibido to Entregado, which immediately synchronizes with the customer-side order tracker.

## Goals / Non-Goals

**Goals:**
- Replace the static dashboard page with a real-time Kanban-style order board.
- Divide orders into four columns based on their `status`: Recibido (`recibido`), En preparación (`preparacion`), Listo (`listo`), and Entregado (`entregado`).
- Fetch orders alongside their ordered items using the joined query `.select('*, order_items(*)')`.
- Subscribe to Supabase Realtime update events on the `orders` table to keep the dashboard synced automatically.
- Provide a button on each order card to advance its state to the next step.

**Non-Goals:**
- Allowing customers to modify orders once placed (strictly staff-only updates).
- Historical reports or charts of orders (out of scope for this change).

## Decisions

### 1. Dashboard UI Component Architecture
We will create a Client Component `components/StaffOrderBoard.tsx` and render it in `app/admin/page.tsx` (which is a Next.js Server Component).
- *Rationale*: The dashboard page requires database fetching on the server to get the current user, but the board itself needs interactive state, browser hooks, and real-time subscription channels, which require a Client Component.

### 2. State & Real-time Subscriptions
The `StaffOrderBoard` component will manage `orders` in its local state. On mount:
1. Fetch all active orders (filtering out or displaying all orders).
   - *Detail*: We will fetch all orders that are active, sorting them by `created_at` ascending so the oldest orders in each column appear first.
2. Establish a Supabase Realtime channel subscription listening to `postgres_changes` on the `orders` table:
   ```typescript
   supabase.channel('staff-order-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => { fetchOrders() }).subscribe()
   ```
   - *Rationale*: Refetching all orders whenever a database change event triggers is a simple, robust, and highly reliable way to ensure the dashboard remains perfectly consistent without manually implementing complex state merging logic.

### 3. Action Buttons and Stepper Progression
Each card displays an action button based on its column:
- `recibido` column → Button "Preparar" (updates status to `'preparacion'`).
- `preparacion` column → Button "Listo" (updates status to `'listo'`).
- `listo` column → Button "Entregar" (updates status to `'entregado'`).
- `entregado` column → No button (completed status).

Clicking the button sends an update to Supabase:
```typescript
await supabase.from('orders').update({ status: nextStatus }).eq('id', orderId)
```

## Risks / Trade-offs

- **[Risk] High volume database queries**: If there are many updates, refetching all orders frequently could hit the database hard.
  - *Mitigation*: The app operates locally or for a single restaurant (low concurrent traffic), so simple refetching is acceptable. In a higher scale scenario, we could parse the payload new/old states and merge them locally.
