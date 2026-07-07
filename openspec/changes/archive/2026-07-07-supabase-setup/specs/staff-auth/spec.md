## ADDED Requirements

### Requirement: Staff Login
The system SHALL allow staff members to authenticate using an email and password via Supabase Auth.

#### Scenario: Successful login
- **WHEN** a user enters valid email and password on the login page and submits
- **THEN** the system authenticates the user, sets auth session cookies, and redirects to `/admin`

#### Scenario: Failed login
- **WHEN** a user enters invalid credentials and submits
- **THEN** the system displays an authentication error message and keeps the user on the login page

### Requirement: Staff Logout
The system SHALL allow authenticated staff members to log out, clearing their auth session.

#### Scenario: Logout trigger
- **WHEN** a logged-in user clicks the logout button
- **THEN** the system invalidates the auth session, clears cookies, and redirects to the login page

### Requirement: Admin Route Protection
The system SHALL restrict access to the `/admin` path and its subpaths to authenticated users only.

#### Scenario: Unauthorized access to admin
- **WHEN** an unauthenticated visitor attempts to access `/admin`
- **THEN** the system redirects them to the login page

#### Scenario: Authorized access to admin
- **WHEN** an authenticated user attempts to access `/admin`
- **THEN** the system displays the admin dashboard view
