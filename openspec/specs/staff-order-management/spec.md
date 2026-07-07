# staff-order-management Specification

## Purpose
This capability covers the staff dashboard layout, columns categorizing orders by status, card details display, and order status transition triggers.

## Requirements

### Requirement: Staff Dashboard Layout
The system SHALL provide a staff dashboard view organizing active orders into columns matching their current statuses: Recibido, En preparación, Listo, and Entregado. Each card representing an order SHALL show the table number, customer name, order code, total value, and the list of items ordered.

#### Scenario: View active orders in columns
- **WHEN** the staff member opens the dashboard and there are active orders
- **THEN** the system displays each order card in its respective status column, with itemized quantities, notes, and totals

### Requirement: Real-time Order Updates
The system SHALL subscribe to updates on the `orders` and `order_items` tables using Supabase Realtime, immediately updating the card listings on the columns when a customer places a new order or updates its state without requiring a manual page refresh.

#### Scenario: Receive new order card in real time
- **WHEN** a customer submits a new order from the digital menu
- **THEN** the staff dashboard automatically appends the new order card to the "Recibido" column in real time

### Requirement: Order State Progression
The system SHALL display action buttons on each order card to advance the order to the next stage (e.g. from "Recibido" to "En preparación", and so on). Clicking the button SHALL update the order's status in Supabase, which triggers updates for both the staff board and the customer tracking view.

#### Scenario: Advance order status to preparation
- **WHEN** the staff member clicks "Preparar" on a card in the "Recibido" column
- **THEN** the system updates the order's status in Supabase to `preparacion` and moves the card to the "En preparación" column
