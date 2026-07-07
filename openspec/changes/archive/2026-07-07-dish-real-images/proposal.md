## Why

Currently, all dishes on the digital menu use emojis as their thumbnail on a colored background. To make the menu feel premium and professional, we want to allow administrators to upload or specify real images for each dish, replacing the emoji-based rendering in both the client digital menu and the administrator CRUD panel.

## What Changes

- Add an `image_url` column to the `dishes` database table in Supabase.
- Update `types/index.ts` and component `Dish` interfaces to include `image_url`.
- Modify `components/DigitalMenu.tsx` to render a real image in the dish card thumbnails and detail modal bottom sheets, with a graceful fallback.
- Modify `components/MenuCategoryCRUD.tsx` to allow administrators to upload files to Supabase Storage (in a new public bucket `dish-images`) or specify a URL, saving the image link to the database.
- Update the mock data and tests in `__tests__/MenuCategoryCRUD.test.tsx`, `__tests__/DigitalMenu.test.tsx`, etc., to incorporate `image_url`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `digital-menu`: Render real images on dish cards instead of emojis.
- `menu-category-management`: Support uploading or saving real dish images in the admin CRUD dashboard.

## Impact

- Database schema: `dishes` table.
- Storage: Supabase Storage bucket for public file uploads.
- Front-end files: `components/DigitalMenu.tsx`, `components/MenuCategoryCRUD.tsx`, `types/index.ts`.
- Tests: Vitest mock suites.
