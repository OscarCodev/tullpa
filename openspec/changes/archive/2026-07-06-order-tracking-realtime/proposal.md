## Why

The current digital menu implementation utilizes a broad, public SELECT policy that allows any visitor to read all order data. To protect customer privacy, we need to secure this access and restrict SELECT queries on `orders` and `order_items` so that clients can only retrieve their own orders, while ensuring that the real-time status tracking continues to function correctly without page reload.

## What Changes

- **Restricted SELECT Security Policies**: Replace the open SELECT policies with restricted Row Level Security (RLS) policies for `orders` and `order_items` that allow clients to view only their own orders.
- **Client-side Order ID Persistence**: Save the placed order ID in browser local storage or cookie, enabling the client to securely retrieve and track their order status even after page reloads.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `shopping-cart-order-confirmation`: Modify the requirements for order query access to enforce secure client-specific SELECT queries on the `orders` and `order_items` tables.

## Impact

- **Database Policies**:
  - Modify SELECT policies on the `orders` and `order_items` tables in Supabase (e.g. by tracking order IDs locally, or verifying client ownership if applicable).
- **Client Component**:
  - `components/DigitalMenu.tsx`: Add check to retrieve active order IDs from browser storage on mount and maintain a secure real-time tracking session.
