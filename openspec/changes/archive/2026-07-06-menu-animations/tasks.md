## 1. CSS Motion Tokens

- [x] 1.1 Replace `@keyframes fadeIn / slideUp` in `app/globals.css` with the exact prototype keyframes: `emb` (ember pulse), `pop` (badge), `slideUpSheet` (sheet), and `toastIn`
- [x] 1.2 Add `.scrim`, `.scrim.on`, `.sheet`, `.scrim.on .sheet` classes matching prototype transition values
- [x] 1.3 Add `.toast`, `.toast.show`, `.toast-wrap` classes with `translateX(120%) → 0` at `0.4s cubic-bezier(.2,.9,.3,1)`
- [x] 1.4 Add `.fab`, `.fab.hide` classes with `translateX(-50%) translateY(120px) opacity:0` transition at `0.25s`
- [x] 1.5 Add `.ember-dot` class with `animation: emb 2.6s ease-in-out infinite`
- [x] 1.6 Add `@media (prefers-reduced-motion: reduce)` block nullifying all transitions and animations

## 2. Card and Chip Transitions

- [x] 2.1 Update dish card hover in `DigitalMenu.tsx` to use exact `transition: transform .22s cubic-bezier(.2,.8,.2,1), box-shadow .22s` and `hover:translateY(-4px) hover:shadow-[var(--shadow)]`
- [x] 2.2 Update "+" button to use `transition:.18s` and `hover:rotate-90 hover:bg-[var(--gold-deep)]`
- [x] 2.3 Update category chip buttons to use `transition:.18s` for background and color

## 3. Modal Sheet Entry

- [x] 3.1 Rewrite the modal overlay in `DigitalMenu.tsx` to use `.scrim` / `.scrim.on` classes (replace `animate-fadeIn`)
- [x] 3.2 Rewrite the sheet inner div to use `.sheet` class (replace `animate-slideUp`) and apply the desktop `≥620px` scale entry variant via CSS

## 4. FAB Floating Cart Button

- [x] 4.1 Add `cartCount` and `fabBump` state to `DigitalMenu.tsx`
- [x] 4.2 Render the FAB element using `.fab` / `.fab.hide` toggle, matching the prototype markup
- [x] 4.3 Wire the "+" button `onClick` to increment `cartCount` and trigger the 180ms bump scale via inline style + `setTimeout`
- [x] 4.4 Render the cart badge with the `.cbadge` pop animation on count change using a React key re-mount trick

## 5. Toast Notifications

- [x] 5.1 Add `toasts` state (`{id, msg, emoji}[]`) and `showToast(msg, emoji)` helper to `DigitalMenu.tsx`
- [x] 5.2 Render `.toast-wrap` container and individual `.toast` / `.toast.show` elements
- [x] 5.3 Wire `showToast` to fire after item add via the "+" button

## 6. Ember Brand Dot

- [x] 6.1 Add `.ember-dot` element to the hero header in `DigitalMenu.tsx`

## 7. Validation

- [x] 7.1 Open `http://localhost:3000` and `/design/prototipo.html` side-by-side; compare card hover, sheet entry, FAB slide, toast, and ember pulse
- [x] 7.2 Record a browser session showing all interactions and attach to walkthrough
- [x] 7.3 Verify `prefers-reduced-motion` suppression by toggling the OS setting
