## MODIFIED Requirements

### Requirement: Menu Dishes CRUD
The system SHALL allow staff members to view all dishes and perform creation (with file upload or real image URL input), details editing, availability toggling, and deletion operations in Supabase.

#### Scenario: Create dish successfully
- **WHEN** the staff member selects a category, inputs a name "Tequeños de Queso", uploads a real image or sets an image URL, price 15.00, desc "Con salsa huancaína", tone 30, and submits
- **THEN** the system uploads the image if necessary, inserts the dish into Supabase with availability defaulting to `true` and the image URL set, and refreshes the dishes list

#### Scenario: Edit dish details successfully
- **WHEN** the staff member modifies the price of a dish to 20.00 or updates its image and saves
- **THEN** the system updates the record in Supabase and displays the new details on the dashboard

#### Scenario: Toggle dish availability
- **WHEN** the staff member switches a dish's availability toggle from active to inactive
- **THEN** the system updates the `available` field to `false` in Supabase, which instantly hides it from the customer public menu

#### Scenario: Delete dish successfully
- **WHEN** the staff member clicks delete on a dish and confirms
- **THEN** the system deletes the record in Supabase and removes it from the list
