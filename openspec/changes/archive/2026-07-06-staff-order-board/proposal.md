## Why

Currently, restaurant staff members do not have a dedicated, real-time dashboard to monitor incoming orders and update their statuses. A real-time kanban-style order board is required so that the kitchen and service staff can instantly view incoming orders, update their preparation states, and push live status changes back to the customer tracking view.

## What Changes

- **Staff Dashboard Page**: Create a responsive dashboard view for staff displaying active orders grouped into four columns by status: Recibido, En preparación, Listo, and Entregado.
- **Real-time Synchronization**: Use Supabase Realtime to update the columns instantly when new orders are placed or updated by other users.
- **Order Advancement Actions**: Provide action buttons on each order card to transition its status to the next logical state (`recibido` → `preparacion` → `listo` → `entregado`), writing the updates back to Supabase.
- **Detail Recap expansion**: Clicking on an order card displays the full list of ordered dishes, quantities, and customer notes.

## Capabilities

### New Capabilities
- `staff-order-management`: Covers the design and behavior of the staff dashboard, real-time status-based order columns, card details display, and order status transition triggers.

### Modified Capabilities
<!-- None -->

## Impact

- **UI Components**:
  - Add a staff order management dashboard at `/staff/dashboard` (or integrated into the main application navigation).
- **Security Policies**:
  - Ensure that database update policies permit authenticated staff to transition the `status` column of `orders`.
