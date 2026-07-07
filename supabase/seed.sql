-- Seed categories
INSERT INTO categories (id, name, emoji) VALUES
('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'Entradas', '🥗'),
('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'Sopas', '🍲'),
('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Fondos', '🍛'),
('d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'Bebidas', '🥤'),
('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'Postres', '🍮')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  emoji = EXCLUDED.emoji;

-- Seed dishes
INSERT INTO dishes (id, category_id, name, emoji, price, tone, available, "desc") VALUES
('11111111-1111-1111-1111-111111111111', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'Papa a la huancaína', '🥔', 14.00, 210, true, 'Rodajas de papa amarilla bañadas en cremosa salsa de ají amarillo y queso fresco.'),
('22222222-2222-2222-2222-222222222222', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'Causa limeña', '🥙', 16.00, 44, true, 'Masa de papa amarilla al limón rellena de pollo deshilachado y palta.'),
('33333333-3333-3333-3333-333333333333', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'Anticuchos de corazón', '🍢', 18.00, 14, true, 'Brochetas marinadas en ají panca a la parrilla, con papa dorada y choclo.'),
('44444444-4444-4444-4444-444444444444', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'Caldo de gallina', '🍜', 15.00, 40, true, 'Caldo reconfortante con presa de gallina, fideos, huevo y hierbabuena.'),
('55555555-5555-5555-5555-555555555555', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'Chupe de camarones', '🦐', 28.00, 8, false, 'Sopa espesa de camarones con leche, arroz, huevo y un toque de ají.'),
('66666666-6666-6666-6666-666666666666', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Lomo saltado', '🥘', 32.00, 24, true, 'Tiras de lomo salteadas al wok con cebolla, tomate y papas fritas. Arroz aparte.'),
('77777777-7777-7777-7777-777777777777', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Ají de gallina', '🍛', 26.00, 48, true, 'Gallina deshilachada en crema de ají amarillo y pan, con papa y aceituna.'),
('88888888-8888-8888-8888-888888888888', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Seco de cordero', '🍖', 34.00, 18, true, 'Cordero cocido lentamente en culantro y chicha, con frejoles y arroz.'),
('99999999-9999-9999-9999-999999999999', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Tallarín saltado', '🍝', 24.00, 30, true, 'Fideos salteados al wok con verduras crujientes y trozos de pollo.'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'Chicha morada', '🟣', 8.00, 280, true, 'Refresco de maíz morado hervido con piña, canela y clavo. Jarra 1L.'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'Limonada frozen', '🍋', 9.00, 80, true, 'Limón peruano batido con hielo, refrescante y ácida en su punto.'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'Inca Kola', '🥤', 6.00, 52, true, 'La bebida de sabor nacional, bien helada. 500 ml.'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'Mazamorra morada', '🍇', 10.00, 290, true, 'Postre de maíz morado espesado con frutas y un toque de canela.'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'Arroz con leche', '🍚', 9.00, 36, true, 'Cremoso arroz cocido en leche, canela y cáscara de naranja.'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'Picarones', '🍩', 12.00, 26, true, 'Buñuelos de zapallo y camote bañados en miel de chancaca. Media docena.')
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name = EXCLUDED.name,
  emoji = EXCLUDED.emoji,
  price = EXCLUDED.price,
  tone = EXCLUDED.tone,
  available = EXCLUDED.available,
  "desc" = EXCLUDED.desc;
