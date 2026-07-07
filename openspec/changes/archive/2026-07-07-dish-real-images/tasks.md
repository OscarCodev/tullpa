## 1. Database and Storage Configuration

- [x] 1.1 Create SQL migration `supabase/migrations/20260707000001_add_dish_image_url.sql` to add `image_url` column to `dishes` table, set up `dish-images` bucket, and define RLS policies for storage objects.

## 2. Shared Types and Interface Updates

- [x] 2.1 Update the `Dish` interface in `types/index.ts` to include `image_url?: string | null`.
- [x] 2.2 Update the local `Dish` interface in `components/MenuCategoryCRUD.tsx` to include `image_url: string | null`.

## 3. Administrator CRUD Image Upload Implementation

- [x] 3.1 Update the `dishModal` state shape in `components/MenuCategoryCRUD.tsx` to include `image_url: string` and `imageFile: File | null`.
- [x] 3.2 Add a file input element for image upload to the dish form modal inside `components/MenuCategoryCRUD.tsx`.
- [x] 3.3 Implement storage upload logic inside `handleSaveDish` in `components/MenuCategoryCRUD.tsx` to upload selected file to `dish-images` bucket.
- [x] 3.4 Append the `image_url` property to the insert/update payload sent to Supabase in `handleSaveDish`.
- [x] 3.5 Update the admin dishes list item renderer to display the dish image thumbnail instead of or as a priority over the emoji.

## 4. Customer Digital Menu Image Display

- [x] 4.1 Update `components/DigitalMenu.tsx` to render the real image in the dish card layout when `image_url` is present, falling back to HSL background and emoji.
- [x] 4.2 Update `components/DigitalMenu.tsx` to render the real image in the slide-up detail modal bottom sheet if `image_url` is present, with emoji fallback.

## 5. Test suite alignment

- [x] 5.1 Update mock data in `__tests__/MenuCategoryCRUD.test.tsx` and `__tests__/DigitalMenu.test.tsx` to include mock `image_url`.
- [x] 5.2 Add storage upload mock to the Supabase client mock inside unit tests to allow tests to run cleanly.
