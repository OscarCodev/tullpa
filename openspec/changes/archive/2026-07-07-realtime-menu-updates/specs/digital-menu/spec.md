## MODIFIED Requirements

### Requirement: Database-driven Categorized Dishes
The system SHALL retrieve categories and available dishes from the database (via tables `categories` and `dishes`) and render them grouped by category, without hardcoding menu data.

#### Scenario: Display dynamically loaded menu
- **WHEN** the customer opens the digital menu landing page
- **THEN** the system queries categories and dishes from Supabase and lists them grouped under their corresponding category headers

#### Scenario: Real-time menu updates
- **WHEN** an administrator creates, updates, or deletes a category or dish in the database
- **THEN** the customer's digital menu landing page immediately updates the categories or dishes list without requiring a page reload
