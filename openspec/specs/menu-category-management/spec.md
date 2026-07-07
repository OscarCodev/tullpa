# menu-category-management Specification

## Purpose
This capability covers the menu category and dish CRUD dashboards, creation/editing overlays, availability switch states, and category deletion dependencies.
## Requirements
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

### Requirement: Category Sidebar Selection (HU-03)
The system SHALL display categories in a vertical left sidebar on desktop resolutions, and adapt to a horizontal tab row or responsive selector on mobile screens.

#### Scenario: Select category
- **WHEN** the staff member clicks on 'Fondos' in the sidebar or responsive tab selector
- **THEN** the active tab updates and lists the dishes belonging to 'Fondos'

