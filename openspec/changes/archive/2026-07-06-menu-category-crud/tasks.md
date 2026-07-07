## 1. CSS & Layout Nav Modifications

- [x] 1.1 Append missing toolbar, buttons, and table classes (`.toolbar`, `.dbtn`, `.mtable`, `.mrow`, `.mth`, `.mn`, `.mc`, `.mp`, `.pill`, `.mactions`, `.iconbtn`) to `app/globals.css`.
- [x] 1.2 Modify `app/admin/layout.tsx` to add a navigation link to "🥘 Carta/Menú" pointing to `/admin/menu`.

## 2. Menu Category CRUD Dashboard

- [x] 2.1 Create the Client Component `components/MenuCategoryCRUD.tsx` implementing tabs to switch between dishes/categories listings, creation/editing modals, availability toggles, and deletion safety checks.
- [x] 2.2 Create `app/admin/menu/page.tsx` that imports and renders `<MenuCategoryCRUD />` under `/admin/menu`.

## 3. Verification & Testing

- [x] 3.1 Create test suite `__tests__/MenuCategoryCRUD.test.tsx` checking correct listing, form loading, and mocked save/toggle calls to Supabase.
- [x] 3.2 Run `npx vitest run` to ensure all tests pass successfully.
