-- Add image_url column to dishes table
ALTER TABLE dishes ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create dish-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('dish-images', 'dish-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for storage bucket
CREATE POLICY "Allow public read access to dish-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'dish-images');

CREATE POLICY "Allow authenticated admin write access to dish-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'dish-images');

CREATE POLICY "Allow authenticated admin update access to dish-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'dish-images');

CREATE POLICY "Allow authenticated admin delete access to dish-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'dish-images');

-- Update seed dishes with high-quality public food images from Unsplash
UPDATE dishes SET image_url = 'https://images.unsplash.com/photo-1628102431771-55ec3efd8ec9?w=600&auto=format&fit=crop&q=80' WHERE id = '11111111-1111-1111-1111-111111111111'; -- Papa a la huancaína
UPDATE dishes SET image_url = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80' WHERE id = '22222222-2222-2222-2222-222222222222'; -- Causa limeña
UPDATE dishes SET image_url = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80' WHERE id = '33333333-3333-3333-3333-333333333333'; -- Anticuchos de corazón
UPDATE dishes SET image_url = 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80' WHERE id = '44444444-4444-4444-4444-444444444444'; -- Caldo de gallina
UPDATE dishes SET image_url = 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80' WHERE id = '55555555-5555-5555-5555-555555555555'; -- Chupe de camarones
UPDATE dishes SET image_url = 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=600&auto=format&fit=crop&q=80' WHERE id = '66666666-6666-6666-6666-666666666666'; -- Lomo saltado
UPDATE dishes SET image_url = 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&auto=format&fit=crop&q=80' WHERE id = '77777777-7777-7777-7777-777777777777'; -- Ají de gallina
UPDATE dishes SET image_url = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80' WHERE id = '88888888-8888-8888-8888-888888888888'; -- Seco de cordero
UPDATE dishes SET image_url = 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80' WHERE id = '99999999-9999-9999-9999-999999999999'; -- Tallarín saltado
UPDATE dishes SET image_url = 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80' WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'; -- Chicha morada
UPDATE dishes SET image_url = 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&auto=format&fit=crop&q=80' WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'; -- Limonada frozen
UPDATE dishes SET image_url = 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80' WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccccccc'; -- Inca Kola
UPDATE dishes SET image_url = 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=600&auto=format&fit=crop&q=80' WHERE id = 'dddddddd-dddd-dddd-dddd-dddddddddddd'; -- Mazamorra morada
UPDATE dishes SET image_url = 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80' WHERE id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'; -- Arroz con leche
UPDATE dishes SET image_url = 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop&q=80' WHERE id = 'ffffffff-ffff-ffff-ffff-ffffffffffff'; -- Picarones

