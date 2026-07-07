## Context

Currently, the menu's dishes and categories cannot be managed from the staff dashboard. Authorized staff members need a CRUD control panel inside `/admin/menu` to keep the menu updated.

## Goals / Non-Goals

**Goals:**
- Implement a CRUD interface at `/admin/menu` to manage categories and dishes.
- Enable creating new dishes and categories, modifying details (price, description, name, emoji), toggling availability, and deleting items.
- Block category deletion if there are active dishes linked to it to prevent orphaned records in the database.
- Append missing prototype styles (`.mtable`, `.mrow`, etc.) to `app/globals.css`.

**Non-Goals:**
- Implementing multi-language fields or multi-currency options.
- Uploading image binaries (the system uses native emojis).

## Decisions

### 1. Page Routing and Tabs
We will create a sub-route `app/admin/menu/page.tsx` rendering a Client Component `<MenuCategoryCRUD />`.
- *Rationale*: This page will display a header and a Tab switcher ("Platos" and "Categorías") enabling the staff to manage either entity side by side seamlessly on one page.

### 2. Styling System Extension
We will append the missing `.toolbar`, `.dbtn`, `.mtable`, `.mrow`, `.mth`, `.mn`, `.mc`, `.mp`, `.pill`, `.mactions`, and `.iconbtn` classes from the prototype HTML into `app/globals.css`.
- *Rationale*: Reusing these precise classes ensures the menu management tables look extremely premium and match the dark wood/gold design language of the prototype.

### 3. Modal Forms & DB Interaction
Creating or editing an item (category or dish) will open a modal overlay form.
- **Save Operations**: Perform direct INSERT or UPDATE queries via Supabase client, immediately refetching the list.
- **Availability Toggle**: A toggle switch on each dish row will immediately execute an UPDATE call setting `available = !available` for quick out-of-stock management.
- **Delete Checks**: Before deleting a category, we will query `dishes` to check if any row has `category_id` matching the category. If yes, display a warning toast/error and abort the deletion.

## Risks / Trade-offs

- **[Risk] Orphaned Dishes**: Deleting a category with active dishes could lead to foreign key constraint failures or orphaned rows.
  - *Mitigation*: The dashboard will check for linked dishes programmatically and block deletion. Supabase FK constraint on `dishes.category_id` will also enforce this integrity.
