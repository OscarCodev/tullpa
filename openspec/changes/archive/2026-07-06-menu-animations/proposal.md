## Why

The current `DigitalMenu` client component has placeholder CSS animation classes (`animate-fadeIn`, `animate-slideUp`) that approximate the prototype's interaction design but do not match the exact durations, easing curves, transforms, and layered motion effects specified in `/design/prototipo.html`. This creates a perceptible quality gap between the design reference and the shipping product.

This change aligns every micro-interaction — card hover, category chip state, modal sheet entry, FAB lifecycle, cart badge counter pop, toast notifications, and the brand ember glow — to the exact specifications in the prototype, including a `prefers-reduced-motion` fallback.

## What Changes

- **Card hover**: `translateY(-4px)` + shadow upgrade from `--shadow-sm` → `--shadow` in `0.22s cubic-bezier(.2,.8,.2,1)`.
- **Add "+" button**: `rotate(90deg)` + background → `--gold-deep` in `0.18s`.
- **Category chips**: `0.18s` smooth background/color transition.
- **Modal sheet**: enters with `translateY(30px)→0` at `0.32s cubic-bezier(.2,.85,.25,1)`; scrim fades at `0.3s`; on desktop enters with `scale(.98)→1`.
- **FAB**: shows/hides with `translateY(120px)→0` + opacity at `0.25s`; bumps `scale(1.05)` for 180ms on item add.
- **Cart badge**: count changes trigger a `pop` keyframe (`scale(0)→1.2→1`).
- **Toast**: slides from `translateX(120%)→0` at `0.4s cubic-bezier(.2,.9,.3,1)`, auto-hides after `2600ms`.
- **Ember dot**: `opacity/.94→1 + scale/.94→1.06` loop at `2.6s ease-in-out infinite`.
- **Reduced motion**: all transitions/animations suppressed or replaced with instant opacity crossfades when `prefers-reduced-motion: reduce` is active.
- **No data/logic changes** — strictly CSS, keyframes, Tailwind inline styles, and React state for FAB/toast/badge orchestration.

## Capabilities

### New Capabilities
- `menu-motion-system`: Micro-interaction motion system that aligns the customer menu to the prototype specification with `prefers-reduced-motion` support.

### Modified Capabilities
- `digital-menu`: Menu view gains FAB floating cart button, toast notifications, and cart badge counter (new UI elements required to deliver the full motion spec).

## Impact

- **Styling**: `app/globals.css` — new/replaced keyframes and utility classes.
- **Component**: `components/DigitalMenu.tsx` — FAB, toast, badge state, bump trigger.
- **Scope boundary**: No database queries, no routing, no schema changes.
