-- RUN THIS IN SUPABASE SQL EDITOR
-- This adds the "is_featured" column to your products table.

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Update existing products to be featured (optional, so you see something initially)
UPDATE public.products SET is_featured = true WHERE is_featured IS NULL;
