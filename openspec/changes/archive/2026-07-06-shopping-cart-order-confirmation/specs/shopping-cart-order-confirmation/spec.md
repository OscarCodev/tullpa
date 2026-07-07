## ADDED Requirements

### Requirement: Shopping Cart Management
The system SHALL allow the customer to add available dishes to a cart with a selected quantity, increment or decrement the quantity of any item in the cart, and completely remove an item from the cart if its quantity is reduced to zero.

#### Scenario: Add dish to cart with custom quantity
- **WHEN** the customer selects a dish, sets the quantity to 3, and clicks the add button
- **THEN** the system adds the dish with quantity 3 to the cart, updating the total cost and count

#### Scenario: Modify item quantity in the cart
- **WHEN** the customer clicks the increment or decrement buttons next to an item in the cart view
- **THEN** the quantity updates accordingly, along with the item subtotal and cart total

#### Scenario: Remove item from the cart
- **WHEN** the customer clicks the decrement button on an item that has a quantity of 1
- **THEN** the item is removed from the cart, and if the cart becomes empty, an empty cart message is displayed

### Requirement: Floating Cart Button (FAB)
The system SHALL display a persistent floating action button (FAB) at the bottom of the menu screen whenever the cart contains one or more items. The FAB MUST show the total quantity of items and the grand total price, and clicking it MUST navigate the customer to the cart screen.

#### Scenario: FAB interaction and navigation
- **WHEN** there are items in the cart and the customer clicks the floating action button
- **THEN** the system navigates the customer from the menu view to the shopping cart view

### Requirement: Order Details Form
The system SHALL provide fields in the cart view to configure the order details, including a table selector for numbers 5 to 12, a text field for an optional customer name, and a text area for optional kitchen notes.

#### Scenario: Select table and input name
- **WHEN** the customer picks table 9 and inputs "Elena" as their name
- **THEN** the form updates to save table 9 and name "Elena" for the order submission

### Requirement: Order Confirmation in Supabase
The system SHALL save the order and its items to Supabase tables `orders` and `order_items` when the customer clicks the confirm button. The order MUST be created with: a random 4-digit code (e.g. #7890), the selected table, the customer name (defaulting to "Cliente" if empty), the notes (if any), initial status 'recibido', and the total cost. After successful database insertion, the cart MUST be cleared.

#### Scenario: Submit order successfully
- **WHEN** the customer clicks the "Confirmar y enviar pedido" button with valid cart items and details
- **THEN** the system inserts the order and its items into Supabase, clears the cart, and redirects the customer to the tracking screen

### Requirement: Live Order Tracking
The system SHALL display an order tracking view showing the progress of the order through the statuses `recibido` -> `preparacion` -> `listo` -> `entregado` in real time, listening to database status updates for the created order.

#### Scenario: Real-time status update to preparation
- **WHEN** the order status changes to 'preparacion' in Supabase
- **THEN** the tracking view updates the stepper to display the active state for "En preparación" with a pulse animation and the exact update time
