## 1. Setup & Package Configurations

- [x] 1.1 Add `@vitest/coverage-v8` to `devDependencies` in `package.json` and install dependencies.
- [x] 1.2 Create `vitest.config.ts` configuring path alias resolution mapping `@/*` to `./*` and coverage exclusions.
- [x] 1.3 Add scripts `"test": "vitest"` and `"test:coverage": "vitest run --coverage"` inside `package.json`.

## 2. Cart Actions Validation Tests

- [x] 2.1 Write test suite `__tests__/CartAndCheckout.test.tsx` verifying client-side cart actions (adding items, increasing/decreasing quantities, checking totals, and removing items).

## 3. Order Checkout Persistence Tests

- [x] 3.1 Extend `__tests__/CartAndCheckout.test.tsx` verifying guest checkout form validation, anonymous auth session lookups, and checked mocked Supabase payload insertions.

## 4. Run & Verify Coverage

- [x] 4.1 Execute `npm run test:coverage` to confirm that the test suite runs successfully and generates the coverage report inside the `coverage/` directory.
