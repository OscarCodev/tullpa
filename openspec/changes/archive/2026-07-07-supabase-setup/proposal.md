## Why

We need to transition from the static prototype of the "Tullpa" restaurant software to a dynamic web application. This change sets up Supabase as the backend to manage database persistence, seed initial Peruvian dishes, and support staff authentication (login, logout, and `/admin` route protection).

## What Changes

- Configured Supabase SSR client utilities (client, server, middleware, and route handler actions).
- SQL migration scripts to define the tables `categories`, `dishes`, `orders`, and `order_items`.
- Seed data scripts populated with categories and Peruvian dishes defined in `/design/prototipo.html`.
- Implementation of staff authentication with email and password, including login/logout actions and protection for the `/admin` routing area.

## Capabilities

### New Capabilities
- `supabase-client`: Client config and server-side utilities to communicate with Supabase.
- `database-schema`: Table structures (`categories`, `dishes`, `orders`, `order_items`), foreign keys, constraints, and seed data.
- `staff-auth`: Authentication for restaurant personnel, including login, logout, and access protection for the `/admin` route.

### Modified Capabilities

## Impact

- **New files**: Supabase client utilities in the codebase.
- **Database**: Migration files containing table definitions and initial seed data.
- **Routing & Pages**: New routes for login, admin panel landing, and middleware for auth protection.
- **Configuration**: Environment variables reference and local setup instructions.
