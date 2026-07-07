## MODIFIED Requirements

### Requirement: Staff Dashboard Layout
The system SHALL provide a staff dashboard view organizing active orders into columns matching their current statuses: Recibido, En preparación, Listo, and Entregado. Each card representing an order SHALL show the table number, customer name, order code, total value, and the list of items ordered. The columns MUST render in a grid layout on desktop/tablet, and adapt dynamically (e.g. stack vertically or present tab-based view switching) on small mobile screens.

#### Scenario: View active orders in columns
- **WHEN** the staff member opens the dashboard and there are active orders
- **THEN** the system displays each order card in its respective status column, with itemized quantities, notes, and totals, adapting the layout cleanly depending on screen width
