## Context

While Vitest runs in zero-config mode, it lacks coverage collection settings, script triggers in `package.json`, and alias resolver configurations. Additionally, we need unit/integration tests validating shopping cart logic and checkouts.

## Goals / Non-Goals

**Goals:**
- Create `vitest.config.ts` to support `@/` path alias resolution (matching `tsconfig.json`) and configure coverage report filters.
- Add test and test coverage scripts to `package.json`.
- Install `@vitest/coverage-v8` to enable non-interactive coverage collection.
- Write unit/integration tests for:
  - Client-side cart item addition, modification, price calculations, and item deletion.
  - Checkout form submission payload formatting and mock Supabase executions.

**Non-Goals:**
- Testing database migrations or remote Supabase network interactions (strictly mocked clients).

## Decisions

### 1. Vitest Configuration File
We will create `vitest.config.ts` in the workspace root:
- **Alias**: Configure path resolver `path.resolve(__dirname, './')` to map `@/` to root directory.
- **Coverage**: Enable `v8` provider and configure exclusions to skip non-source directories (e.g. `node_modules`, `.next`, `supabase`, `__tests__`).

### 2. Testing Coverage Scripts & DevDependencies
We will update `package.json` to include:
- DevDependency: `@vitest/coverage-v8` and `@testing-library/jest-dom`.
- Scripts:
  - `"test": "vitest"`
  - `"test:coverage": "vitest run --coverage"`

### 3. Shopping Cart & Order Checkout Unit Tests
We will add `__tests__/CartAndCheckout.test.tsx` (or update existing files) focusing on:
- Validating the cart state reducer/actions (adding items, increasing quantities, checking totals).
- Mocking anonymous sign-in and verifying order checkout inserts (checking table and item payloads are correctly mapped).

## Risks / Trade-offs

- **[Risk] Test compilation speed**: Coverage analysis adds overhead to test runs.
  - *Mitigation*: Run coverage selectively (`npm run test:coverage`) in CI/CD or local reviews, keeping `npm test` fast for development.
