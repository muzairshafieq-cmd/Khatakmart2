-- CRITICAL FIX FOR FRONTEND VISIBILITY
-- The frontend wasn't showing products because "Public" users (non-admins) didn't have permission to READ the products.

-- 1. Ensure the Policy Exists
DROP POLICY IF EXISTS "Public products are viewable by everyone" ON public.products;
CREATE POLICY "Public products are viewable by everyone" 
ON public.products FOR SELECT 
USING (true);

-- 2. Grant permissions just in case
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.products TO authenticated;

-- 3. Ensure is_featured column exists (if not added yet)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- 4. Mark your recent products as Featured so they show up!
UPDATE public.products SET is_featured = true;
