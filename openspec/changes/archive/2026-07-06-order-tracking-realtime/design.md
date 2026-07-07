## Context

Currently, the `orders` table is readable by the public via a wide-open `Allow public read access to orders FOR SELECT USING (true)` RLS policy. Anyone can fetch all orders, violating privacy. We need to secure this so clients can only select and read their own orders.

## Goals / Non-Goals

**Goals:**
- Implement client-only SELECT RLS policies on the `orders` and `order_items` tables.
- Allow authenticated staff members (role `'authenticated'`) to continue reading all orders.
- Integrate Supabase Anonymous Sign-Ins on the client menu so that anonymous visitors automatically get a unique `auth.uid()` session.
- Persist the active order ID in browser `localStorage` to allow tracking page recovery on page refresh.

**Non-Goals:**
- Full customer sign-up or profile screens (we only need anonymous sessions).
- Restricting public read access on `categories` or `dishes`.

## Decisions

### 1. Supabase Anonymous Authentication
We will call `supabase.auth.signInAnonymously()` in a `useEffect` hook in `DigitalMenu.tsx` on mount if no active session is found.
- *Rationale*: Anonymous Sign-In is a native Supabase feature. It creates a temporary user record in `auth.users` and assigns a unique UUID accessible via `auth.uid()`. This allows us to use standard RLS checks (`auth.uid() = user_id`) without requiring the customer to create an account or input a password.

### 2. Database Schema and RLS Migration
We will create a new database migration file `supabase/migrations/20260707000002_add_user_id_to_orders.sql` to:
1. Add a `user_id` column to `orders` referencing `auth.users(id)` with a default value of `auth.uid()`.
2. Drop the existing public SELECT policy on `orders`.
3. Create a restricted SELECT policy: `auth.uid() = user_id OR auth.role() = 'authenticated'`. (The latter allows staff members to view all orders).
4. Update the INSERT policy to ensure clients can only insert orders with their own `user_id`: `WITH CHECK (auth.uid() = user_id OR auth.role() = 'authenticated')`.
5. Keep the SELECT policy on `order_items` tied to the parent order read permission: `FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id))`.

### 3. Browser Storage Order ID Persistence
We will store the placed order ID in `localStorage` under the key `tullpa_active_order_id` when the order is successfully submitted. On mount:
1. Read the `tullpa_active_order_id` from `localStorage`.
2. If found, query Supabase for that specific order.
3. If the order is found and is not yet in `'entregado'` state, set `myOrderId` and go straight to the `'track'` view.
4. If it doesn't exist or is `'entregado'`, clear the key from `localStorage`.

## Risks / Trade-offs

- **[Risk] Anonymous Session Expiration**: If the anonymous session expires or is cleared, the user won't be able to query the order.
  - *Mitigation*: The session is persisted in local storage automatically by Supabase client. If it is somehow lost, the user can place a new order. For current in-progress orders, this is a minor risk.
