# visual-styling-refinement Specification

## Purpose
This capability covers the CSS styling requirements for the customer shopping cart screen, the admin category cards grid layout, and the admin modal form overlays, ensuring all views match the Tullpa prototype design system.

## Requirements

### Requirement: Shopping Cart Screen Styling
The system SHALL apply custom styling matching the prototype mockup for the customer cart screen, including sticky navigation header bars, mini quantity selectors, totals alignment, and input field styling.

#### Scenario: View customer shopping cart
- **WHEN** the customer opens the shopping cart sheet
- **THEN** the system displays the items and inputs using `.subhead`, `.cartlist`, `.citem`, `.qmini`, and `.formcard` CSS selectors

### Requirement: Category Cards Grid Layout
The staff menu dashboard SHALL display the category listings organized in a responsive cards grid layout.

#### Scenario: View category management grid
- **WHEN** the staff member selects the "Categorías" tab
- **THEN** the system renders the categories using `.catgrid` containing `.catmcard` panels displaying the emoji icon, category name, associated dishes count, and action buttons

### Requirement: Admin Modal Forms Overlay Styles
The admin modal forms SHALL be rendered using a full-screen blurred backdrop overlay centering the edit card container.

#### Scenario: Open category edit modal
- **WHEN** the staff member opens the modal to create or edit a category
- **THEN** the system displays the popup using `.smodal` and `.smodal-card` selectors, rendering inputs styled under `.dfield` blocks
