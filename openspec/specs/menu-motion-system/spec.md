# menu-motion-system

This specification defines the high-fidelity motion system, keyframes, transitions, and accessibility behavior for the digital menu user interface.

## Purpose
Ensure a premium, responsive look-and-feel that matches the designer's prototype exact curves, duration, overlays, and responsiveness specs.

## Requirements

### Requirement: Card Hover Lift and Shadow Upgrade
When a customer hovers over an available dish card the card SHALL translate up by 4px and upgrade its box-shadow from the soft value to the full card shadow, using a `0.22s cubic-bezier(.2,.8,.2,1)` transition on both `transform` and `box-shadow`.

#### Scenario: Hover lifts card
- **WHEN** the pointer enters an available dish card
- **THEN** the card animates upward 4px and the shadow deepens within 220ms

#### Scenario: Sold-out cards do not lift
- **WHEN** the pointer enters a sold-out dish card
- **THEN** the transform and shadow remain unchanged

---

### Requirement: Add Button Rotation and Color on Hover
The "+" button on each dish card SHALL rotate 90° and change background color to `--gold-deep` on hover, using a `0.18s` transition.

#### Scenario: Button rotates on hover
- **WHEN** the pointer enters the "+" button
- **THEN** the button rotates to 90° and background darkens to `--gold-deep` within 180ms

---

### Requirement: Category Chip Smooth State Transition
Category chips SHALL transition background color and text color changes smoothly in `0.18s` (no timing function constraint).

#### Scenario: Chip active state animates
- **WHEN** a category chip becomes active or inactive
- **THEN** the color change is visually interpolated over 180ms

---

### Requirement: Modal Sheet Bottom-Up Entry with Desktop Scale
The detail sheet modal SHALL enter the screen by translating from `translateY(30px)` to `translateY(0)` at `0.32s cubic-bezier(.2,.85,.25,1)`. The background scrim SHALL fade from opacity 0 to 1 in `0.3s`. On viewports ≥ 620px the sheet SHALL also animate from `scale(0.98)` to `scale(1)`.

#### Scenario: Sheet enters from bottom on mobile
- **WHEN** the customer clicks an available dish card
- **THEN** the scrim fades in and the sheet translates up from 30px below in 320ms

#### Scenario: Sheet enters with scale on desktop
- **WHEN** viewport width is ≥ 620px and customer opens a dish detail
- **THEN** the sheet additionally scales from 0.98 to 1 as it appears

---

### Requirement: FAB Show/Hide Slide with Bump on Add
The floating cart action button (FAB) SHALL:
1. Enter by transitioning from `translateY(120px) opacity:0` to default position + `opacity:1` in `0.25s`.
2. Exit by reversing to `translateY(120px) opacity:0`.
3. Perform a "bump" animation — briefly scaling to `1.05` for 180ms — every time a dish is added to the cart.

#### Scenario: FAB appears when cart is non-empty
- **WHEN** the first item is added to the cart
- **THEN** the FAB slides in from below with a fade-in in 250ms

#### Scenario: FAB bumps on subsequent item add
- **WHEN** any dish is added to the cart while FAB is visible
- **THEN** the FAB scales to 1.05 and returns to 1 within 180ms

#### Scenario: FAB hides when cart is emptied
- **WHEN** the cart becomes empty
- **THEN** the FAB slides back below the screen

---

### Requirement: Cart Badge Pop on Count Change
The cart item-count badge on the FAB SHALL play a `pop` animation (scale from 0 to 1) whenever its numeric count changes.

#### Scenario: Badge animates on count increment
- **WHEN** a dish is added and the badge count increments
- **THEN** the badge briefly scales from 0 to full size using a springy keyframe

---

### Requirement: Toast Notifications Slide-In and Auto-Dismiss
Toast notifications SHALL enter from the right side of the screen with `translateX(120%)→translateX(0)` at `0.4s cubic-bezier(.2,.9,.3,1)` and auto-hide after `2600ms`.

#### Scenario: Toast slides in from right
- **WHEN** a user action triggers a confirmation toast
- **THEN** the toast enters from the right edge of the viewport

#### Scenario: Toast auto-dismisses
- **WHEN** a toast has been visible for 2600ms
- **THEN** it slides back out and is removed from the DOM

---

### Requirement: Ember Brand Dot Pulse Loop
The brand ember dot SHALL pulse indefinitely using `opacity` and `scale` — from `opacity:.85 scale:.94` to `opacity:1 scale:1.06` — cycling at `2.6s ease-in-out infinite`.

#### Scenario: Ember dot pulses continuously
- **WHEN** the page is loaded
- **THEN** the ember dot visibly breathes at a 2.6-second interval

---

### Requirement: Reduced Motion Accessibility Fallback
When the user has enabled `prefers-reduced-motion: reduce` in their OS, ALL transitions and animations defined in this system SHALL be suppressed or replaced with instant opacity-only crossfades (no transform, no movement).

#### Scenario: No movement on reduced-motion preference
- **WHEN** `prefers-reduced-motion: reduce` is active
- **THEN** cards do not translate on hover, the sheet appears without translateY, the FAB appears without slide, toasts appear/disappear without translateX, and the ember pulse stops
