## MODIFIED Requirements

### Requirement: Responsive Dish Cards with Status Indicators (HU-01)
The system SHALL display dishes as cards in a responsive layout. Each card MUST display its name, short description, and price in Peruvian Soles (S/), along with a real image if available (falling back to a default visual representation or emoji otherwise).

#### Scenario: Card rendering
- **WHEN** a dish is listed on the menu
- **THEN** the card renders the dish's real image (or fallback visual representation), name, short description, and price (e.g., S/ 32.00)

### Requirement: Modal Dish Details Bottom Sheet (HU-02)
The system SHALL show a slide-up drawer modal when an available dish card is clicked, presenting the dish real image (or fallback representation), name, full description, and price.

#### Scenario: Open dish detail drawer
- **WHEN** the customer clicks on an available dish card
- **THEN** the bottom sheet modal slides into view from the screen bottom displaying the detailed view with the real image, along with a close button
