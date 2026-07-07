-- Add user_id column to orders table referencing auth.users(id)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- Orders Policies update
DROP POLICY IF EXISTS "Allow public read access to orders" ON orders;
DROP POLICY IF EXISTS "Allow public insert access for orders" ON orders;

-- Restricted SELECT: Users can only read their own orders (anon users match user_id), staff can read all (authenticated role)
CREATE POLICY "Allow users to read their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'authenticated');

-- Restricted INSERT: Users can only insert orders with their own auth.uid() as user_id, staff can insert any
CREATE POLICY "Allow users to insert their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.role() = 'authenticated');


-- Order Items Policies update
DROP POLICY IF EXISTS "Allow public read access to order items" ON order_items;
DROP POLICY IF EXISTS "Allow public insert access for order items" ON order_items;

-- Restricted SELECT: Users can read items only if they can read the parent order
CREATE POLICY "Allow users to read their own order items" ON order_items
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id
  ));

-- Restricted INSERT: Users can insert items only if they own the parent order
CREATE POLICY "Allow users to insert their own order items" ON order_items
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR auth.role() = 'authenticated')
  ));
