## 1. Supabase Client Integration

- [x] 1.1 Create Supabase browser client utility in `utils/supabase/client.ts` using `@supabase/ssr`
- [x] 1.2 Create Supabase server client utility in `utils/supabase/server.ts` to manage server component and route handler context
- [x] 1.3 Create Supabase middleware client utility in `utils/supabase/middleware.ts` to refresh tokens dynamically
- [x] 1.4 Integrate Supabase cookie refresher in the main Next.js `middleware.ts` file

## 2. Database Schema & Seed Data

- [x] 2.1 Create SQL migration script `supabase/migrations/20260707000000_create_tables.sql` to define `categories`, `dishes`, `orders`, and `order_items` tables
- [x] 2.2 Create SQL seed file `supabase/seed.sql` to insert the 5 categories and 15 Peruvian dishes with their emojis, prices, tones, availability, and descriptions
- [x] 2.3 Set up Row Level Security (RLS) policies on all tables so that dishes and categories are public-read and orders can be created by clients

## 3. Staff Authentication & Admin Area

- [x] 3.1 Create `/login` page with an email and password login form
- [x] 3.2 Implement a Server Action in `app/login/actions.ts` to handle staff authentication via Supabase Auth `signInWithPassword`
- [x] 3.3 Configure Middleware route protection to check for active sessions and redirect unauthenticated requests under `/admin` to `/login`
- [x] 3.4 Create a protected layout and page under `/admin` containing a simple logout button triggering a session termination Server Action

## 4. Verification

- [x] 4.1 Write Vitest test suite for testing the Supabase server/client instantiation functions
- [x] 4.2 Verify manually that unauthenticated users are redirected from `/admin` to `/login`
- [x] 4.3 Verify manually that valid staff logins successfully load `/admin` and can trigger a logout
