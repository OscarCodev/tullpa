## ADDED Requirements

### Requirement: Code Coverage Report
The testing framework SHALL compile and generate code coverage reports for the application codebase. The report SHALL detail statement, branch, function, and line coverage metrics.

#### Scenario: Generate coverage metrics report
- **WHEN** the test script with coverage flag is executed
- **THEN** the system runs the Vitest test runner with coverage collections enabled and outputs a report in the console and inside a `coverage/` directory

### Requirement: Cart Actions Validation
The test suite SHALL validate client-side shopping cart modifications, quantity adjustments, and total summation math.

#### Scenario: Verify cart mutations
- **WHEN** unit tests simulate adding a dish to the cart, modifying its quantity, and removing it
- **THEN** the test suite asserts that the cart state is correctly mutated and totals match the expectation

### Requirement: Order Submission Validation
The test suite SHALL validate checkout form submissions and order creation requests.

#### Scenario: Verify order creation insert payload
- **WHEN** the checkout form is submitted in a mock context
- **THEN** the test suite asserts that the Supabase client is triggered with the correct order details payload
