## ADDED Requirements

### Requirement: Menu Categories CRUD
The system SHALL allow staff members to view all categories and perform creation, update, and deletion operations on them in Supabase. Category deletion SHALL be blocked if there are dishes currently associated with that category.

#### Scenario: Create category successfully
- **WHEN** the staff member inputs a name "Postres", emoji "🍰", and submits
- **THEN** the system inserts the record into Supabase and updates the category list

#### Scenario: Edit category successfully
- **WHEN** the staff member modifies the name of an existing category to "Entradas Especiales" and saves
- **THEN** the system updates the record in Supabase and updates the display

#### Scenario: Delete category successfully
- **WHEN** the staff member clicks delete on an empty category (no associated dishes)
- **THEN** the system deletes the category in Supabase and removes it from the dashboard view

### Requirement: Menu Dishes CRUD
The system SHALL allow staff members to view all dishes and perform creation, details editing, availability toggling, and deletion operations in Supabase.

#### Scenario: Create dish successfully
- **WHEN** the staff member selects a category, inputs a name "Tequeños de Queso", emoji "🥖", price 15.00, description "Con salsa huancaína", tone 30, and submits
- **THEN** the system inserts the dish into Supabase with availability defaulting to `true` and refreshes the dishes list

#### Scenario: Edit dish details successfully
- **WHEN** the staff member modifies the price of a dish to 20.00 and saves
- **THEN** the system updates the price in Supabase and displays the new price on the dashboard

#### Scenario: Toggle dish availability
- **WHEN** the staff member switches a dish's availability toggle from active to inactive
- **THEN** the system updates the `available` field to `false` in Supabase, which instantly hides it from the customer public menu

#### Scenario: Delete dish successfully
- **WHEN** the staff member clicks delete on a dish and confirms
- **THEN** the system deletes the record in Supabase and removes it from the list
