## 1. CSS Styles Additions

- [x] 1.1 Append the missing `.ticket`, `. fresh`, `.tk-head`, `.tk-code`, `.tk-table`, `.tk-cust`, `.tk-items`, `.tk-foot`, `.tk-tot`, `.tk-time`, `.tk-act`, and `.col-empty` classes to `app/globals.css`.

## 2. Staff Order Board Component

- [x] 2.1 Create the Client Component `components/StaffOrderBoard.tsx` that fetches orders with their items, groups them by status into columns, subscribes to Supabase Realtime changes, and displays buttons to progress orders.

## 3. Dashboard Page Integration

- [x] 3.1 Modify `app/admin/page.tsx` to import and render the new `<StaffOrderBoard />` client component on the staff dashboard.

## 4. Verification and Testing

- [x] 4.1 Create `__tests__/StaffOrderBoard.test.tsx` to verify the order columns display correctly, and state transitions trigger updates.
- [x] 4.2 Run `npx vitest run` to ensure all tests compile and pass successfully.
