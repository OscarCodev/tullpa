## 1. Global CSS Layout Fixes

- [x] 1.1 Add mobile media queries in `app/globals.css` to adjust body font sizes, navigation wrappers, container margins, and default paddings.
- [x] 1.2 Update the grid systems for dishes lists in `components/DigitalMenu.tsx` so cards scale dynamically to full width or single columns on extra small viewport dimensions.

## 2. Administrator Category/Dish CRUD Panel Responsiveness

- [x] 2.1 Refactor the layout grid inside `components/MenuCategoryCRUD.tsx` to stack sidebar and main table column vertically on viewports narrower than 768px.
- [x] 2.2 Transform the category sidebar into a horizontal, scrollable navigation list of inline badges when in mobile view mode.
- [x] 2.3 Add CSS styles to format table rows (`.mrow`) in `components/MenuCategoryCRUD.tsx` to act as stackable card items rather than side-by-side columns on mobile, hiding the table header.
- [x] 2.4 Align the crud modal dialog and form input grid elements to match full screen or comfortable touch widths on mobile viewports.

## 3. Staff Kanban Order Board Mobile Optimization

- [x] 3.1 Introduce local state filter variables in `components/StaffOrderBoard.tsx` to handle selected preparation status view switches.
- [x] 3.2 Add a responsive tab header selection bar (Recibido, Cocina, Listo, Entregado) at the top of the staff order dashboard, visible only on screens narrower than 768px.
- [x] 3.3 Modify the board's columns container grid inside `components/StaffOrderBoard.tsx` to hide multi-column layouts and render only the currently selected status tab column on mobile screens.
- [x] 3.4 Adjust the style of preparation transition action buttons on order cards to prevent text clipping and ensure large, touch-friendly tap targets on mobile viewports.

## 4. Verification and Testing

- [x] 4.1 Execute existing Vitest unit tests to confirm that responsiveness modifications have not broken page loads, state changes, or database queries.
