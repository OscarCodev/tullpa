-- Fix: Allow anonymous (non-authenticated) customers to insert orders
-- Rationale: This is a restaurant ordering system where customers at a table
-- should be able to place orders without needing an account.
-- The previous policy required auth.uid() = user_id which fails for anonymous sessions.

-- Drop the restrictive policies
DROP POLICY IF EXISTS "Allow users to insert their own orders" ON orders;
DROP POLICY IF EXISTS "Allow users to insert their own order items" ON order_items;

-- Restore open insert policy for orders (any visitor can place an order)
CREATE POLICY "Allow public insert access for orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Restore open insert policy for order_items
CREATE POLICY "Allow public insert access for order_items" ON order_items
  FOR INSERT WITH CHECK (true);

-- Also restore public SELECT so customers can track their own order status
-- (The previous migration removed the public SELECT policy)
DROP POLICY IF EXISTS "Allow users to read their own orders" ON orders;
DROP POLICY IF EXISTS "Allow users to read their own order items" ON order_items;

-- Allow any visitor to read orders (needed for tracking screen)
CREATE POLICY "Allow public read access to orders" ON orders
  FOR SELECT USING (true);

-- Allow any visitor to read order items
CREATE POLICY "Allow public read access to order items" ON order_items
  FOR SELECT USING (true);
