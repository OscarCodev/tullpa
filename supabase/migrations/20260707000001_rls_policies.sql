-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Categories Policies
CREATE POLICY "Allow public read access to categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated staff to manage categories" ON categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Dishes Policies
CREATE POLICY "Allow public read access to dishes" ON dishes
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated staff to manage dishes" ON dishes
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Orders Policies
CREATE POLICY "Allow public read access to orders" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access for orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated staff to manage orders" ON orders
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Order Items Policies
CREATE POLICY "Allow public read access to order items" ON order_items
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access for order items" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated staff to manage order items" ON order_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
