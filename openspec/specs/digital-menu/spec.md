# digital-menu Specification

## Purpose
TBD - created by archiving change customer-digital-menu. Update Purpose after archive.
## Requirements
### Requirement: Database-driven Categorized Dishes
The system SHALL retrieve categories and available dishes from the database (via tables `categories` and `dishes`) and render them grouped by category, without hardcoding menu data.

#### Scenario: Display dynamically loaded menu
- **WHEN** the customer opens the digital menu landing page
- **THEN** the system queries categories and dishes from Supabase and lists them grouped under their corresponding category headers

### Requirement: Public Access and RLS Compatibility
The system SHALL query data from Supabase without requiring user authentication, relying on public RLS policies.

#### Scenario: Query menu without login
- **WHEN** an unauthenticated visitor accesses the landing route `/`
- **THEN** the system successfully reads categories and dishes from Supabase and presents the menu without auth barriers

### Requirement: Category Navigation Rail
The system SHALL render a sticky, horizontal category bar containing category chips. Clicking a category chip SHALL smoothly scroll the page to the selected category header.

#### Scenario: Smooth scrolling navigation
- **WHEN** the customer clicks on a category chip in the sticky rail
- **THEN** the browser smoothly scrolls the view to show the header of that category section

### Requirement: Responsive Dish Cards with Status Indicators (HU-01)
The system SHALL display dishes as cards in a responsive layout. Each card MUST display its emoji, name, short description, and price in Peruvian Soles (S/).

#### Scenario: Card rendering
- **WHEN** a dish is listed on the menu
- **THEN** the card renders a warm HSL gradient block, a centered emoji, name, short description, and price (e.g., S/ 32.00)

### Requirement: Sold Out Dish Overlay
Dishes where `available` is false SHALL display an "Agotado hoy" visual overlay and disable card clicking.

#### Scenario: Click unavailable dish
- **WHEN** the customer clicks on a dish card that is marked as sold out
- **THEN** the click interaction is ignored, and the detail sheet modal does not open

### Requirement: Modal Dish Details Bottom Sheet (HU-02)
The system SHALL show a slide-up drawer modal when an available dish card is clicked, presenting the dish emoji, name, full description, and price.

#### Scenario: Open dish detail drawer
- **WHEN** the customer clicks on an available dish card
- **THEN** the bottom sheet modal slides into view from the screen bottom displaying the detailed view, along with a close button

