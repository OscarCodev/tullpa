## MODIFIED Requirements

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
