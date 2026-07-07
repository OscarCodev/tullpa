## Context

Currently, the application displays dish items using emojis on a stylized color gradient background. While this serves as a good prototype, a production-grade restaurant menu requires real food photographs. To achieve this, we need to extend the database schema, configure Supabase Storage, and update the UI in both the admin management console and the customer-facing menu.

## Goals / Non-Goals

**Goals:**
- Add an `image_url` field to dishes.
- Enable file uploads in the administrator panel to store images in Supabase Storage.
- Update the customer digital menu to show dish photographs, falling back gracefully to the HSL gradient + emoji if no image is uploaded.

**Non-Goals:**
- Removing the emoji entirely from the database (it will serve as the fallback icon).
- Creating a complex image editor (cropping, filters) in the admin console.

## Decisions

### 1. Database Schema and Storage Bucket Setup
- **Decision:** Create a SQL migration to add the `image_url` column to the `dishes` table. The migration will also register the `dish-images` bucket in Supabase storage and define RLS policies allowing public read access but restricting write/delete permissions to authenticated users.
- **SQL Migration Details:**
  ```sql
  ALTER TABLE dishes ADD COLUMN image_url TEXT;

  INSERT INTO storage.buckets (id, name, public) 
  VALUES ('dish-images', 'dish-images', true) 
  ON CONFLICT (id) DO NOTHING;

  -- RLS policies for storage bucket
  CREATE POLICY "Allow public read access" ON storage.objects FOR SELECT USING (bucket_id = 'dish-images');
  CREATE POLICY "Allow admin write/update access" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'dish-images');
  ```

### 2. Administrator Panel Image Uploads
- **Decision:** Modify `components/MenuCategoryCRUD.tsx` to handle file selection.
  - In `dishModal` state, track `image_url: string` and a local `imageFile: File | null`.
  - Add a file selector `<input type="file" accept="image/*" />` to the modal.
  - When saving, if a file is selected, upload it asynchronously to Supabase Storage:
    ```typescript
    const fileName = `${Date.now()}-${imageFile.name}`;
    const { data, error } = await supabase.storage.from('dish-images').upload(fileName, imageFile);
    const { data: { publicUrl } } = supabase.storage.from('dish-images').getPublicUrl(data.path);
    ```
  - Use the resulting `publicUrl` in the save payload.

### 3. Customer UI Image Display with Graceful Fallback
- **Decision:** In `components/DigitalMenu.tsx`, modify the `.thumb` container of the card:
  - If `d.image_url` is present, render `<img src={d.image_url} alt={d.name} className="image-cover" />`.
  - Otherwise, fall back to the existing gradient and emoji representation.
  - Apply the same logic to the slide-up detail bottom drawer.

## Risks / Trade-offs

- **Risk:** Large image files could slow down the page load and consume excess bandwidth.
  - **Mitigation:** Instruct the UI or admin file input to restrict file size (e.g. limit uploads to <2MB) and advise uploading compressed images.
