## Context

The database table `dishes` has a column named `"desc"` of type `TEXT` that represents the description of a dish. However, in `MenuCategoryCRUD.tsx`, the local state management and API calls to Supabase refer to the property name `description`. This leads to a database schema mismatch error on insert and update operations, where Supabase complains that `description` cannot be found in the schema cache of `dishes`.

Additionally, the global `Dish` type in `types/index.ts` uses `desc: string`, which matches the database. Other read-only components (such as `DigitalMenu.tsx`) use the global `Dish` type and reference `d.desc`.

## Goals / Non-Goals

**Goals:**
- Resolve the database schema error by aligning the CRUD handlers in `MenuCategoryCRUD.tsx` to save and read the dish description using the correct column/property name `desc`.
- Standardize the terminology to `desc` across types, CRUD component, and Vitest tests.

**Non-Goals:**
- Redesigning the dishes database table.
- Changing other fields or logic in the menu management.

## Decisions

### Align frontend state and database property to `desc`
- We will modify `MenuCategoryCRUD.tsx` to use `desc` instead of `description` in its local `Dish` interface and state objects.
- *Alternative considered:* Mapping `desc` to `description` only in the Supabase payload.
  - *Why not:* This introduces inconsistency in the codebase where some files use `desc` and others use `description`. Aligning everything to `desc` matches `types/index.ts` and the database schema directly.
- We will update the mock data and query assertions in `__tests__/MenuCategoryCRUD.test.tsx` to use `desc` instead of `description`.

## Risks / Trade-offs

- **Risk:** Renaming the property in tests could break existing assertions if they aren't fully updated.
  - **Mitigation:** Run the Vitest test suite (`npm run test`) to ensure all tests pass after renaming `description` to `desc`.
