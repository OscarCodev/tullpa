## Context

We are implementing the customer-facing landing page of the "Tullpa" restaurant software. We need to fetch and render the categories and dishes dynamically from Supabase while maintaining the high-fidelity premium design specified in `/design/prototipo.html`.

## Goals / Non-Goals

**Goals:**
- Implement the route `/` using Next.js App Router.
- Fetch categories and dishes from the Supabase PostgreSQL database.
- Build a sticky category rail navigation with smooth scrolling.
- Build a responsive grid of dish cards showing emojis, prices, tones, descriptions, and "Agotado" state.
- Implement a modal sheet for the detailed view of a selected dish.
- Match the visual look and feel (warm colors, gradients, custom typography) of `/design/prototipo.html`.

**Non-Goals:**
- Add to cart and shopping cart views (this will be implemented in subsequent changes/phases).
- Placing orders or checkout forms.
- Admin menu editing in this view (readonly view).

## Decisions

### 1. Hybrid Server-Client Architecture
We will split the view into:
- **Server Component (`app/page.tsx`)**: Fetches categories and dishes in parallel directly from Supabase via `utils/supabase/server.ts`. This provides good SEO, fast initial load, and secure DB calls.
- **Client Component (`components/DigitalMenu.tsx`)**: Receives the fetched categories and dishes as props and handles client-side state:
  - Tracking current category and triggering `scrollIntoView()` smooth scrolling when a category chip is clicked.
  - Tracking the currently selected dish in the details modal sheet (`selectedDishId`).
  - Tone-based background generation using the `tone` field.

### 2. UI Layout & Tailored Styling
We will structure the markup matching the prototype's CSS rules exactly, utilizing Tailwind CSS utility classes:
- **App Shell**: A full-viewport flex layout (`h-screen overflow-hidden`) with a scrollable client panel (`flex-1 overflow-y-auto`).
- **Hero Header**: Styled with custom gradients overlaying the dark paper theme.
- **Category Rail**: Sticky horizontal bar (`sticky top-0 z-30`) with a blur filter backdrop (`backdrop-filter backdrop-blur-md`) and custom `.catchip` buttons.
- **Dish Grid**: CSS grid using Tailwind's `grid-cols-[repeat(auto-fill,minmax(210px,1fr))]` for automatic item wrapping.
- **Tone Gradients**: A helper function to generate HSL warm gradient backgrounds dynamically for dish thumbnails based on their `tone` value:
  `background: linear-gradient(140deg, hsl(tone 62% 88%), hsl((tone+20)%360 55% 78%))`

### 3. Bottom Sheet Modal Dialog
The dish detail view will be implemented as a bottom drawer overlay sheet. It will be triggered when clicking a dish card and can be closed using an "×" close button or by clicking on the background scrim overlay.

## Risks / Trade-offs

- **[Risk] Layout shifts during category scroll** → Using standard anchor tags or `scrollIntoView` might cause jumpy jumps on mobile viewport heights.
  *Mitigation*: We will use native JS `element.scrollIntoView({ behavior: 'smooth', block: 'start' })` which is widely supported and yields smooth transitions.
- **[Risk] DB query performance** → Calling Supabase on every load could be slow if database connection latency is high.
  *Mitigation*: We will execute the queries in parallel using `Promise.all` in the Server Component.
