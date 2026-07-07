## Why

Currently, several pages in the application (specifically the administrator category/dish CRUD management panel and the staff order management board) are optimized primarily for desktop resolutions. On smaller mobile phone screens, table columns, action buttons, columns in the staff board, and form inputs become squeezed and unusable. To enable managers and restaurant staff to run the app entirely on their mobile devices, we need to achieve full mobile responsive design across all screens.

## What Changes

- Update `components/MenuCategoryCRUD.tsx` styling and layout to adapt grid tables into stacked flex-card layouts, shrink sidebar navigation or transform it into a responsive tab selection on mobile, and ensure form dialog inputs adapt cleanly on narrow widths.
- Update `components/StaffOrderBoard.tsx` to stack the columns (preparacion, listo, entregado) vertically or present them in swipeable tabs on small mobile screens.
- Refine `components/DigitalMenu.tsx` layouts (like the order overview drawers, bottom checkout buttons, and header elements) to prevent text clipping and ensure touch targets are comfortable on small phones.
- Add CSS media queries to `app/globals.css` or component-specific styles to adjust grid column counts, paddings, and font sizes dynamically.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `digital-menu`: Adjust elements to look and operate flawlessly on narrow screens.
- `menu-category-management`: Redesign grid tables and layouts to stack or scroll elegantly on mobile.
- `staff-order-management`: Redesign the column layout to fit phone screens (e.g. via stack or tabs).

## Impact

- CSS styles: `app/globals.css`, component layouts.
- Component layouts: `components/DigitalMenu.tsx`, `components/MenuCategoryCRUD.tsx`, `components/StaffOrderBoard.tsx`.
