## 1. Database Schema and Security RLS Policy

- [x] 1.1 Create the migration file `supabase/migrations/20260707000002_add_user_id_to_orders.sql` adding `user_id` to `orders` and modifying SELECT/INSERT RLS policies for `orders` and `order_items`.
- [x] 1.2 Apply migrations to the database and verify that security constraints deny unauthorized reads on orders.

## 2. Supabase Anonymous Authentication

- [x] 2.1 Add client-side anonymous session creation using `supabase.auth.signInAnonymously()` in a `useEffect` on mount inside `components/DigitalMenu.tsx`.

## 3. Client Tracking Persistence and Recovery

- [x] 3.1 Save the successfully placed order ID in browser `localStorage` under `tullpa_active_order_id` in the `placeOrder` function.
- [x] 3.2 Implement recovery logic in a `useEffect` on mount inside `components/DigitalMenu.tsx`: retrieve `tullpa_active_order_id`, fetch its details (status, total, items, code) from Supabase, and redirect the user directly to the track screen if active.
- [x] 3.3 Clear `tullpa_active_order_id` from `localStorage` once the order status is set to `'entregado'` (completed).

## 4. Verification and Testing

- [x] 4.1 Update `__tests__/DigitalMenu.test.tsx` to mock `supabase.auth.signInAnonymously` and test the localStorage recovery logic on component mount.
- [x] 4.2 Run `npx vitest run` to ensure all tests compile and pass.
