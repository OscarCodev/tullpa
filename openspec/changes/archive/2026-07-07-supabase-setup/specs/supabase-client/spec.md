## ADDED Requirements

### Requirement: Client-Side Supabase Client
The system SHALL provide a utility to initialize the Supabase client for Client Components using environment variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

#### Scenario: Instantiate client in browser
- **WHEN** a client component requests a Supabase client instance
- **THEN** the system returns a browser-safe Supabase client configured with the public URL and anon key

### Requirement: Server-Side Supabase Client
The system SHALL provide a utility to create a Supabase client for Server Components, Server Actions, and Route Handlers using cookie helpers to persist auth state.

#### Scenario: Instantiate client on server
- **WHEN** a server-side component or action calls the server client creator
- **THEN** the system returns a Supabase server client that reads and writes authentication cookies
