## Why

When an administrator attempts to create or update a dish, the application throws an error: "Could not find the 'description' column of 'dishes' in the schema cache". This is because the database schema for the `dishes` table uses the column name `"desc"`, whereas `MenuCategoryCRUD.tsx` tries to query and save to a column named `"description"`.

## What Changes

- Update `components/MenuCategoryCRUD.tsx` to use the database column name `"desc"` instead of `"description"`.
- Update the local `Dish` interface in `components/MenuCategoryCRUD.tsx` to use `desc` (aligning with `types/index.ts`).
- Update `__tests__/MenuCategoryCRUD.test.tsx` mock data and test expectations to use `desc` instead of `description`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `menu-category-management`: Align dish creation/edit description mapping to the database schema using `desc`.

## Impact

- `components/MenuCategoryCRUD.tsx`: Local state, interfaces, and Supabase interaction.
- `__tests__/MenuCategoryCRUD.test.tsx`: Mock data definitions and UI test assertions.
