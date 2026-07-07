## 1. Cart State and Core UI Screens

- [x] 1.1 Add state variables in `DigitalMenu.tsx` to hold the cart (`cart` as `Record<string, number>`), the current active screen (`'menu' | 'cart' | 'track'`), and the placed order ID (`myOrderId`).
- [x] 1.2 Refactor `addToCart` and write a new `setQty` helper to handle adding, incrementing, decrementing, and removing items from the cart.
- [x] 1.3 Wire up the Floating Action Button (FAB) click event to transition the view from the menu to the cart screen.

## 2. Cart Screen and Checkout Form

- [x] 2.1 Implement the cart screen layout in `DigitalMenu.tsx` showing the itemized breakdown (emoji, name, unit price, quantity controls, total).
- [x] 2.2 Implement the Checkout details form card with table picker buttons (numbers 5–12), a name input field, and a kitchen notes textarea.
- [x] 2.3 Add total summary calculations (Subtotal, Total) and visual controls for navigation back to the menu.

## 3. Supabase Integration

- [x] 3.1 Initialize the browser Supabase client inside `DigitalMenu.tsx` using `createClient()` from `@/utils/supabase/client`.
- [x] 3.2 Implement order placement handler: generate a random 4-digit code, insert the record in the `orders` table, and retrieve the returned UUID.
- [x] 3.3 Insert corresponding items into the `order_items` table under the order's UUID.
- [x] 3.4 Clear local cart state upon successful insertion, display a success toast, and navigate to the tracking view.

## 4. Live Tracking Screen

- [x] 4.1 Build the tracking view layout displaying the stepper statuses (Recibido, En preparación, Listo, Entregado) with appropriate icons and description text.
- [x] 4.2 Establish a Supabase realtime subscription for changes in the `orders` table matching the active order ID, updating the tracking screen status.
- [x] 4.3 Implement a fallback polling mechanism that checks the order status if realtime connection is offline or drops.

## 5. Verification

- [x] 5.1 Perform manual verification of adding items to cart, altering quantities, checking out with notes/table numbers, and verifying database records.
- [x] 5.2 Validate that the tracking screen reacts instantly to status updates in Supabase database.
