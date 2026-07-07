## Why

Currently, when an administrator edits or adds dishes or categories, customers on the landing page do not see these updates until they manually reload the page. Implementing real-time updates for dishes and categories ensures customers immediately see updated availability ("Agotado hoy"), modified prices, new names, or newly added items without needing a manual page refresh.

## What Changes

- Enable real-time replication on the `categories` and `dishes` tables in the database.
- Convert categories and dishes in `components/DigitalMenu.tsx` from static props to React states (`useState`).
- Set up a Supabase Realtime channel subscription in `components/DigitalMenu.tsx` to listen for database changes (`INSERT`, `UPDATE`, `DELETE`) on the `categories` and `dishes` tables and apply those changes to the state.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `digital-menu`: Enable real-time synchronization of dishes and categories on the customer digital menu landing page.

## Impact

- `components/DigitalMenu.tsx`: Convert static props to React state and establish real-time subscription.
- `supabase/migrations/`: Add a SQL migration to enable real-time replication for `categories` and `dishes` tables.
