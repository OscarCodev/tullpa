## Context

Currently, the customer-facing digital menu (`DigitalMenu.tsx`) renders the categories and dishes statically based on the server-rendered initial props. This means any changes made by an administrator to the menu (e.g. updating availability, names, prices, or adding/deleting categories and dishes) are not visible to the client until they reload.

To improve customer experience, we will leverage Supabase Realtime features to broadcast and apply updates to the client interface automatically.

## Goals / Non-Goals

**Goals:**
- Enable Supabase Realtime for the `categories` and `dishes` tables.
- Update `DigitalMenu.tsx` to listen to realtime database updates and refresh categories and dishes lists dynamically in the customer UI.

**Non-Goals:**
- Altering the admin CRUD panel's sync strategy (it already refetches data manually on save/delete operations).
- Redesigning the landing page layout or navigation rail.

## Decisions

### 1. Enable Realtime at the Database Level
- **Decision:** Create a database migration SQL file that adds `categories` and `dishes` to the `supabase_realtime` publication.
- **Query:**
  ```sql
  alter publication supabase_realtime add table categories;
  alter publication supabase_realtime add table dishes;
  ```

### 2. State-Based List Rendering in DigitalMenu
- **Decision:** Store the category and dish lists in local React state variables inside `components/DigitalMenu.tsx`, initializing them with the SSR props:
  ```typescript
  const [categories, setCategories] = useState(initialCategories)
  const [dishes, setDishes] = useState(initialDishes)
  ```
- **Rationale:** React can only trigger a re-render when state changes. Modifying props directly is not possible.

### 3. Setup Postgres Changes Subscriptions
- **Decision:** Use a single `useEffect` hook in `DigitalMenu.tsx` to subscribe to the `postgres_changes` events on the two tables:
  - `INSERT`: Append the new item.
  - `UPDATE`: Update the matching item in state.
  - `DELETE`: Filter out the deleted item from state.
- **Rationale:** Keeping the subscription in one hook ensures clean subscription cleanup on component unmount.

## Risks / Trade-offs

- **Risk:** Rapid concurrent updates could cause race conditions in state updates.
  - **Mitigation:** Use functional state updates (`setDishes(prev => ...)`) to guarantee that updates are computed using the latest state values.
