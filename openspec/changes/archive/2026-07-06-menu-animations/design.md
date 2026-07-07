## Context

The `DigitalMenu` component in `components/DigitalMenu.tsx` currently uses generic Tailwind utility classes and basic CSS keyframes from `app/globals.css` that do not match the prototype. The prototype (`/design/prototipo.html`) defines a complete motion system using vanilla CSS transitions, `@keyframes`, and a small JavaScript orchestrator for FAB bumps and toasts.

The exact values extracted from the prototype are:
- **Card hover**: `transform .22s cubic-bezier(.2,.8,.2,1), box-shadow .22s cubic-bezier(.2,.8,.2,1)` · `translateY(-4px)` · shadow from `--shadow-sm` → `--shadow`
- **Add button**: `transition: .18s` · hover: `background:var(--gold-deep); transform:rotate(90deg)`
- **Chip**: `transition: .18s`
- **Scrim**: `transition: opacity .3s`
- **Sheet mobile**: `transition: transform .32s cubic-bezier(.2,.85,.25,1)` · `translateY(30px) → 0`
- **Sheet desktop (≥620px)**: additionally `scale(.98) → scale(1)`
- **FAB hide class**: `translateX(-50%) translateY(120px); opacity:0` · `transition: .25s`
- **FAB bump**: `scale(1.05)` for 180ms via `setTimeout`
- **Badge pop**: `@keyframes pop { 0%{transform:scale(0)} 100%{transform:scale(1)} }` · `0.5s cubic-bezier(.2,1.4,.4,1)`
- **Toast enter**: `transform: translateX(120%) → translateX(0)` · `transition: .4s cubic-bezier(.2,.9,.3,1)` · auto-hide after `2600ms`
- **Ember dot**: `@keyframes emb { 0%,100%{opacity:.85;transform:scale(.94)} 50%{opacity:1;transform:scale(1.06)} }` · `2.6s ease-in-out infinite`

## Goals / Non-Goals

**Goals:**
- Replace all placeholder animation classes with the exact prototype values.
- Add FAB floating cart button, cart badge, and toast notification system to `DigitalMenu.tsx`.
- Implement a `prefers-reduced-motion` media-query override in `globals.css`.
- Validate against both the live dev server and the prototype side-by-side in the browser.

**Non-Goals:**
- Full cart ordering flow (backend, order submission).
- Changes to data-fetching, routing, or RLS policies.

## Decisions

### 1. CSS-first for Transitions, JS only for Orchestration
All transition curves and durations live in `globals.css` utility classes (e.g., `.card-hover`, `.sheet`, `.toast`, `.fab`). React state in `DigitalMenu.tsx` controls class presence (`isOpen`, `fabVisible`, `toastList`). This keeps animation values in one place and avoids style-in-JS complexity.

### 2. FAB and Toast as Client-Side State
The FAB visibility and cart item count require React state `cartCount`. The bump uses a `useRef` timeout to clear after 180ms. Toasts use a `useState<{id,msg,emoji}[]>` array with `setTimeout` cleanup after 2600ms.

### 3. Sheet Scrim as CSS Class Toggle
`scrim.on` → `opacity:1 pointer-events:auto`. The sheet child gets `translateY(0)` via `.scrim.on .sheet`. This matches the prototype's exact implementation pattern.

### 4. Reduced Motion via CSS `@media`
One `@media (prefers-reduced-motion: reduce)` block at the bottom of `globals.css` sets `transition-duration: 0.01ms !important` on all motion-bearing selectors and turns off `animation` for `.ember-dot` and `.livedot`.

## Risks / Trade-offs

- **[Risk] FAB state not connected to real cart** → For this change, `cartCount` is a demo counter incremented by the "+" button. Real cart integration is a separate future change.
  *Mitigation*: The spec explicitly scopes this to UI motion only.
- **[Risk] CSS specificity conflicts with Tailwind** → Tailwind utility classes on the same element may override globals.css utility classes.
  *Mitigation*: Prototype-matched classes (`.card`, `.fab`, etc.) are defined in `globals.css` which is imported before Tailwind; use `@layer utilities` or explicit class names to ensure specificity.
