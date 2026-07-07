## Why

Currently, while we have implemented the digital menu cart checkouts, tracking updates, and staff order boards, we lack structured validation testing for the cart math, order creations, and real-time state changes, and we do not track coverage reports. Adding testing integration ensures code stability, protects against regressions, and highlights untested paths.

## What Changes

- **Coverage Configuration**: Configure Vitest to collect test coverage metrics and generate coverage reports (using packages like `@vitest/coverage-v8`).
- **Cart Actions Tests**: Add unit tests for client-side cart addition, quantity updates, total calculation, and removal helper logic.
- **Order Creation Integration Tests**: Mock Supabase insert steps to verify correct payload shape and success callbacks.
- **Order Status Transitions Tests**: Add tests verifying order status stepper views update appropriately on state adjustments.

## Capabilities

### New Capabilities
- `cart-order-testing`: Covers Vitest unit/integration testing suites for shopping cart operations, order submissions, and status progression steppers, as well as code coverage report collection.

### Modified Capabilities
<!-- None -->

## Impact

- **Testing Configuration**:
  - Configure coverage reporting options in `vite.config.ts` or `vitest.config.ts`.
- **Scripts**:
  - Add a script in `package.json` to run tests with coverage: `"test:coverage": "vitest run --coverage"`.
