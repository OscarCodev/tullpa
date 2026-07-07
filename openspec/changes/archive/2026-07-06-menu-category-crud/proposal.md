## Why

Currently, the menu categories and dishes are managed directly in the database without any staff-facing user interface. To enable dynamic restaurant management, we need to build a comprehensive CRUD (Create, Read, Update, Delete) panel inside the staff dashboard that allows staff to manage categories and dishes, including toggling dish availability in real time.

## What Changes

- **Staff Menu Management Dashboard**: Add a new tab or view in the staff dashboard to manage the categories and dishes list.
- **Category CRUD Forms**: Allow staff to create new categories, edit category name/emoji, and delete existing categories (validating dependencies).
- **Dish CRUD Forms**: Allow staff to create new dishes (selecting category, name, emoji, price, description, tone), edit existing dish details, toggle availability (active/inactive), and delete dishes.
- **Supabase Syncing**: Bind all inputs to the `dishes` and `categories` tables, verifying immediate persistence and error handling.

## Capabilities

### New Capabilities
- `menu-category-management`: Covers the category and dish management views, creation/editing forms, availability toggle controls, and database synchronizations.

### Modified Capabilities
<!-- None -->

## Impact

- **UI Routing**:
  - Integrate a "Carta/Menú" management sub-view inside the admin area at `/admin` (or `/admin/menu`).
- **Database/RLS Rules**:
  - Authenticated staff members have default full access (`FOR ALL`) on both `categories` and `dishes` tables, so no new RLS migrations are required.
