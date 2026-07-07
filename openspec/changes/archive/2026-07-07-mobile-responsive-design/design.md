## Context

The current user interface scales well on desktops and tablets, but fails to maintain standard usability on mobile phones (under 768px width). The admin CRUD panel uses rigid side-by-side sidebars and wide data tables, and the staff board displays four columns side-by-side, which becomes completely compressed and unreadable on small screens.

## Goals / Non-Goals

**Goals:**
- Make the administrator panel (`MenuCategoryCRUD.tsx`) fully usable on mobile screens, converting the side-by-side layout into a stack layout, and rendering table rows as flex cards on mobile.
- Make the staff order board (`StaffOrderBoard.tsx`) responsive by adding mobile status tabs, allowing the user to select which column's orders to display rather than squeezing 4 columns side-by-side.
- Ensure the customer menu (`DigitalMenu.tsx`) cards adjust size dynamically on narrow viewports.

**Non-Goals:**
- Completely rewriting the styling architecture or moving to an external UI library. All changes will be vanilla CSS/media queries and local state toggles.

## Decisions

### 1. Admin Sidebar & Grid Table Response (MenuCategoryCRUD)
- **Sidebar:** In `@media (max-width: 768px)`, change the category grid from `260px 1fr` to `1fr`. Render the `.cat-sidebar` as a horizontal scrollable row of badges instead of a vertical list.
- **Table:** In `@media (max-width: 768px)`, rewrite `.mrow` to stack elements vertically. Hide the table header row (`.mrow.hd`) on mobile. Customize cell sizing so detail text, action buttons, and price badges are centered or stacked cleanly, acting as individual cards.

### 2. Staff Board View Switcher (StaffOrderBoard)
- **Responsive Tabs:** Add a local React state variable `activeTab` to track the active status filter (e.g. `recibido`, `preparacion`, `listo`, `entregado`).
- **Conditional Layout:** 
  - On screens wider than 768px, render all 4 columns side-by-side.
  - On screens narrower than 768px, display a tab header row (e.g. `[ Recibidos ]  [ Cocina ]  [ Listos ]  [ Entregados ]`) and render *only* the single column selected.

### 3. Customer Menu Grid Scaling (DigitalMenu)
- Change grid layouts for dish cards to use CSS Auto-Fit:
  ```css
  @media (max-width: 480px) {
    .cwrap .grid {
      grid-template-columns: 1fr; /* Single column layout for very small phones */
    }
  }
  ```

## Risks / Trade-offs

- **Risk:** Too many media queries might conflict with existing layout styling.
  - **Mitigation:** Wrap new styles cleanly in a `@media (max-width: 768px)` media block at the end of `app/globals.css`, or inject styles inline via dynamic React breakpoints where necessary.
