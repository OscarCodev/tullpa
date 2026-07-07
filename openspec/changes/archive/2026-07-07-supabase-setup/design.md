## Context

We are building the Tullpa restaurant management system (MVP). Currently, we have a static prototype (`design/prototipo.html`). We need to transition the system to a dynamic web application. This document details the technical design for configuring the Supabase backend client, setting up database tables, importing seed data, and implementing email/password staff authentication.

## Goals / Non-Goals

**Goals:**
- Set up a robust, type-safe Supabase client integrated with Next.js App Router (both Client and Server context).
- Create a migration structure for tables `categories`, `dishes`, `orders`, and `order_items`.
- Seed the database with the 5 categories and 15 dishes from the prototype.
- Implement authentication for staff using email/password.
- Secure the `/admin` routes so that only authenticated staff can access them.

**Non-Goals:**
- Real-time order synchronization (this will be implemented in a subsequent phase).
- Implementing full UI for customers or staff dashboards (only auth flow, pages skeleton, and database connections are in scope).
- Social login (Google, Facebook, etc.).

## Decisions

### 1. Supabase SSR Client setup
We will use `@supabase/ssr` to configure client and server-side utilities.
- **Client Client**: Instantiated using `createBrowserClient` from `@supabase/ssr` inside a helper `utils/supabase/client.ts`.
- **Server Client**: Instantiated using `createServerClient` from `@supabase/ssr` in `utils/supabase/server.ts`, managing cookies dynamically to preserve login session across Server Components, Server Actions, and Route Handlers.
- **Middleware**: A middleware helper `utils/supabase/middleware.ts` will refresh the auth session on each request.

### 2. Database Schema and Types
We will define four tables:
- **`categories`**:
  - `id`: UUID (Primary Key, default `gen_random_uuid()`)
  - `name`: TEXT (Not Null)
  - `emoji`: TEXT (Not Null)
  - `created_at`: TIMESTAMPTZ (Default `now()`)
- **`dishes`**:
  - `id`: UUID (Primary Key, default `gen_random_uuid()`)
  - `category_id`: UUID (Foreign Key to `categories.id` ON DELETE RESTRICT)
  - `name`: TEXT (Not Null)
  - `emoji`: TEXT (Not Null)
  - `price`: NUMERIC(10, 2) (Not Null)
  - `tone`: INTEGER (Not Null, representing color hue)
  - `available`: BOOLEAN (Not Null, default true)
  - `desc`: TEXT (Not Null)
  - `created_at`: TIMESTAMPTZ (Default `now()`)
- **`orders`**:
  - `id`: UUID (Primary Key, default `gen_random_uuid()`)
  - `code`: TEXT (Not Null)
  - `table_number`: INTEGER (Not Null)
  - `customer_name`: TEXT (Not Null, default 'Cliente')
  - `note`: TEXT (Nullable)
  - `status`: TEXT (Not Null, constraint: IN (`recibido`, `preparacion`, `listo`, `entregado`))
  - `total`: NUMERIC(10, 2) (Not Null)
  - `created_at`: TIMESTAMPTZ (Default `now()`)
- **`order_items`**:
  - `id`: UUID (Primary Key, default `gen_random_uuid()`)
  - `order_id`: UUID (Foreign Key to `orders.id` ON DELETE CASCADE)
  - `dish_id`: UUID (Foreign Key to `dishes.id` ON DELETE SET NULL)
  - `name`: TEXT (Not Null, snapshot of dish name)
  - `emoji`: TEXT (Not Null, snapshot of dish emoji)
  - `qty`: INTEGER (Not Null, greater than 0)
  - `price`: NUMERIC(10, 2) (Not Null, snapshot of dish price)

*Rationale for Snapshotting in `order_items`:*
Dishes prices and names may change or be deleted. Storing the name, emoji, and price directly on the order line preserves the historical integrity of receipts.

### 3. Seed Data
We will create a SQL migration file containing seed statements inserting the 5 categories and 15 dishes from the prototype into `categories` and `dishes`. We will assign static UUIDs to categories to link them correctly to the dishes.

### 4. Authentication and Route Protection
- **Login Route**: A page at `/login` will display the login form. Upon submission, a Server Action or Route Handler will authenticate the credentials via `supabase.auth.signInWithPassword`.
- **Admin Area**: Page `/admin` (and any subpaths like `/admin/menu`) will represent the protected dashboard.
- **Middleware**: A Next.js middleware file `middleware.ts` will call the Supabase session refresher. If no authenticated user is found in the session, and the requested path starts with `/admin`, it will redirect the user to `/login`.

## Risks / Trade-offs

- **[Risk] Cookie size limits** → Next.js headers size might exceed limits if Supabase session cookies grow too large.
  *Mitigation*: We will follow Supabase SSR recommended practices to clean up chunked cookies properly.
- **[Risk] Sync of static IDs in seed** → Hardcoding UUIDs in seed scripts can cause collisions if not handled cleanly.
  *Mitigation*: We will use explicit namespaces or UUIDv4 generated values for seed files and insert them with `ON CONFLICT DO NOTHING` guards where appropriate.
- **[Risk] Realtime requirements** → While real-time is a non-goal for this phase, the schema must be ready to support PostgreSQL Replication (Supabase Realtime) later.
  *Mitigation*: Ensure all tables have Primary Keys and Row Level Security (RLS) is configured.
