## Why

Customers of "Tullpa" need to view the restaurant's menu digitally from their mobile devices. This change introduces a public, mobile-first digital menu loaded dynamically from Supabase, replicating the exact design and user flow of `/design/prototipo.html` without hardcoded data.

## What Changes

- Create a public landing page (`/`) listing dishes grouped by category.
- Read categories and dishes dynamically from the `categories` and `dishes` tables in Supabase (respecting RLS read policies).
- Implement a sticky category bar for smooth jump navigation between menu sections.
- Build responsive dish cards displaying the emoji icon, name, brief description, and price (HU-01).
- Implement a modal detail drawer sheet displaying full descriptions, emojis, and prices (HU-02).
- Ensure unavailable dishes (`available=false`) are displayed as "Agotado", styled visually, and prevented from being selected.

## Capabilities

### New Capabilities
- `digital-menu`: Read-only public digital menu displaying categorized dishes, navigation shortcuts, and detailed descriptions from Supabase.

### Modified Capabilities

## Impact

- **Routing & Views**: Implementation of the root route (`app/page.tsx`) and menu components.
- **Database Fetching**: Server-side query integration with the `categories` and `dishes` tables.
- **Styling**: Application of custom color tokens, layouts, and drawer animations based on `/design/prototipo.html`.
