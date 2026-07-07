## Why

The current digital menu allows customers to browse dishes and open details, but lacks the ability to add dishes to a cart, customize quantities, and confirm a checkout. Introducing a shopping cart and order confirmation flow enables self-service ordering directly from tables, reducing staff workload and improving customer ordering experience.

## What Changes

- **Shopping Cart Screen**: A new interactive screen where users can view selected dishes, modify their quantities (increase, decrease, or remove by setting quantity to 0), and see the calculated subtotal and total prices.
- **Floating Cart Button (FAB)**: A persistent button showing the total item count and total cost, which opens the shopping cart when clicked.
- **Order Confirmation Form**: Within the cart view, an embedded form to select a table number (5 to 12), enter an optional name, and write optional kitchen notes.
- **Order and Order Items Supabase Integration**: When an order is confirmed, the app creates records in the `orders` and `order_items` tables in Supabase with an initial state of `recibido` and a randomly generated four-digit code.
- **Real-Time Order Tracking Screen**: An interface tracking the status (`recibido` -> `preparacion` -> `listo` -> `entregado`) in real time by subscribing to Supabase realtime events or polling.

## Capabilities

### New Capabilities
- `shopping-cart-order-confirmation`: Covers client-side cart management, table selection, and notes, Supabase integration for order/item creation, and real-time status tracking.

### Modified Capabilities
<!-- None -->

## Impact

- **Affected Components**:
  - `components/DigitalMenu.tsx`: Will be updated to manage cart state, checkout form inputs, order creation logic via Supabase, and rendering the cart and tracking screens.
- **Database Tables**:
  - `orders` and `order_items`: Will receive insert operations from the client side.
- **Dependencies**:
  - Requires `@supabase/supabase-js` or the configured client-side client to perform inserts and handle realtime subscriptions.
