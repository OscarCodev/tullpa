## Context

Multiple client-facing and admin-facing screens display unstyled elements because several CSS layout rules from the prototype mockups (such as cart lists, form cards, and category cards) are missing in the global stylesheet.

## Goals / Non-Goals

**Goals:**
- Append missing customer cart and stepper CSS rules to `app/globals.css`.
- Append missing admin modal overlays (`.smodal`, `.smodal-card`) and category card lists (`.catgrid`, `.catmcard`) CSS rules to `app/globals.css`.
- Refactor the shopping cart layout inside `components/DigitalMenu.tsx` to bind correct class selectors.
- Refactor category lists inside `components/MenuCategoryCRUD.tsx` to display cards grid instead of tables, and use `.smodal` tags for overlays.

**Non-Goals:**
- Modifying routing paths or database tables structure.

## Decisions

### 1. Unified CSS Rules Append
We will append all missing cart screen, category cards grid, and staff modal CSS rules from `prototipo.html` to `app/globals.css`.
- *Rationale*: Declaring these classes globally guarantees complete visual alignment with the design system and ensures that all cards, inputs, buttons, and animations scale properly.

### 2. Category Cards Grid Transition
We will rewrite the category display loop in `components/MenuCategoryCRUD.tsx` to render:
```html
<div className="catgrid">
  {categories.map(cat => (
    <div className="catmcard" ...>
      <div className="top">
        <span className="cem">{cat.emoji}</span>
        ...
```
- *Rationale*: Renders categories as grid blocks displaying dish metrics, matching the exact visual representation of the prototype instead of using basic text tables.

### 3. Modal Popup Overlay Refactoring
We will update modal overlays in `components/MenuCategoryCRUD.tsx` to bind `className={`smodal ${modalOpen ? 'on' : ''}`}`:
- *Rationale*: Using native CSS transitions on `.smodal` class results in smoother popup transitions, blur effects, and maintains component layout cleanliness.

## Risks / Trade-offs

- **[Risk] Test breakage on class mutations**: Changing layout class bindings could break existing Testing Library queries.
  - *Mitigation*: Ensure standard text content queries (`screen.getByText`) are used, which are independent of CSS class names and layout tags.
