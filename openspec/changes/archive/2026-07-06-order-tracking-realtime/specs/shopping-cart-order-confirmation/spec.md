## ADDED Requirements

### Requirement: Client-only SELECT Security Policy
The database SHALL restrict SELECT queries on `orders` and `order_items` tables using Row Level Security (RLS) policies, so that unauthenticated clients can only select and read their own order records. Staff members (authenticated users) SHALL retain read and write permissions on all orders.

#### Scenario: Retrieve own order
- **WHEN** an unauthenticated client requests their own order ID from the database
- **THEN** the database allows SELECT access and returns the order details

#### Scenario: Prevent retrieving another customer's order
- **WHEN** an unauthenticated client attempts to SELECT an order ID that they did not place
- **THEN** the database blocks access and returns no records

### Requirement: Client Order Tracking Persistence
The system SHALL persist the active order ID in the client's browser storage (such as localStorage) upon successful order creation. On page load, the system SHALL check browser storage and, if an active order exists, automatically query and display the real-time tracking view.

#### Scenario: Resume tracking on page refresh
- **WHEN** the customer refreshes the browser page while their order is active
- **THEN** the system retrieves the order ID from browser storage, queries its status, and opens the live tracking view
