## ADDED Requirements

### Requirement: Schema Migrations
The system SHALL define the PostgreSQL tables `categories`, `dishes`, `orders`, and `order_items` with appropriate types, primary keys, constraints, and relationships.

#### Scenario: Run SQL migrations
- **WHEN** migration scripts are applied to the database
- **THEN** the tables categories, dishes, orders, and order_items are created with foreign keys and cascade rules

### Requirement: Seed Data Insertion
The system SHALL insert the Peruvian dishes and categories from `/design/prototipo.html` into the database as seed data.

#### Scenario: Seed execution
- **WHEN** seed SQL commands are executed on the database
- **THEN** 5 categories and 15 dishes are populated in the database with their respective details
