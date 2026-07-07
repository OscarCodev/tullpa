## Context

The application currently loads categories and dishes from Supabase and displays them statically in the `DigitalMenu.tsx` client component. Currently, clicking a card opens a modal, and clicking "Agregar" or quick add only increments a counter state, but does not track the actual items. We need to implement a full shopping cart system, checkout/confirmation form, and database sync with Supabase (initial status 'recibido') followed by a real-time order tracking screen.

## Goals / Non-Goals

**Goals:**
- Implement state tracking for cart items (dish references and quantities).
- Design and build the Cart view showing selected items, individual prices, subtotals, quantity adjustments, and removal.
- Create the Order Details form containing a table number selector (5–12), name field (optional), and note field (optional).
- Connect the checkout action to Supabase to insert an order record in `orders` and corresponding detail rows in `order_items`.
- Implement a real-time tracking screen that subscribes to status updates of the newly created order in Supabase and displays a step-by-step progress indicator.
- Maintain consistency with the color palette, fonts, micro-animations, and overall visual design of the prototype (`/design/prototipo.html`).

**Non-Goals:**
- Building the staff login or administration CRUD in this change (this change focuses on the customer self-service order flow).
- Multi-restaurant support or payment gateway integration.

## Decisions

### 1. Client-side Cart State Management
We will manage the cart state within the `DigitalMenu` client component using a standard React state object: `Record<string, number>` mapping `dishId` to `quantity`.
- *Rationale*: A simple dictionary state is fast to update, makes quantity calculations straightforward, and easily integrates into the single-page layout structure of `DigitalMenu.tsx`.

### 2. Database Insertion Sequence
Order creation requires two sequential table inserts:
1. Insert the parent order record into `orders`.
2. Retrieve the returned `order.id` (UUID).
3. Insert the child items into `order_items`, referencing the `order_id`.
- *Transactionality*: Both inserts will be executed client-side. In the event of a failure on the second step (items insert), we will alert the user. Under the hood, RLS policies are already configured to allow anonymous inserts on both tables.

### 3. Order Code Generation
We will generate a random 4-digit code prefixed with `#` (e.g. `#5821`) on the client side at the time of order placement.
- *Rationale*: This matches the prototype user flow and database schema where `code` is a required non-nullable text field.

### 4. Real-time Order Tracking (HU-05)
Upon successful order creation, the component will subscribe to a Supabase real-time channel targeting the `orders` table filtered by the created `order.id`.
- *Alternative*: Polling the order status via a `setInterval`.
- *Choice*: Supabase Realtime subscription is preferred as it is efficient, responds instantly to state changes made by the restaurant staff, and aligns with the tech stack goals. A fallback polling mechanism will be implemented in case real-time subscriptions fail or are disabled in the environment.

## Risks / Trade-offs

- **[Risk] Supabase Insert Fails Mid-way** (e.g. order inserts, but order items insert fails).
  - *Mitigation*: We will use a try-catch block for the database operations. If any insert fails, we display a toast warning to the user and keep the cart intact so they can retry without losing their selection. We will wrap the insertions in a single transaction if possible, or execute them sequentially and handle errors.
- **[Risk] Realtime Channel Drops or RLS Restricts Read**
  - *Mitigation*: Ensure `orders` table has public read access enabled (already verified in policies: `Allow public read access to orders FOR SELECT USING (true)`). We will also run a fallback status check on page focus or periodically to ensure the client stays updated.
