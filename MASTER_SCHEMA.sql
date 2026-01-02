-- MASTER SETUP SCRIPT FOR KHATTAK MART
-- Run this entire file in the Supabase SQL Editor to setup your database.

-- ==========================================
-- 1. CLEANUP (Optional - Be Careful!)
-- Uncomment the next lines if you want to perform a full reset (Wipes Data!)
-- DROP TABLE IF EXISTS public.products CASCADE;
-- DROP TABLE IF EXISTS public.orders CASCADE;
-- DROP TABLE IF EXISTS public.admins CASCADE;
-- ==========================================

-- ==========================================
-- 2. CREATE TABLES
-- ==========================================

-- 2.1 PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    stock INTEGER DEFAULT 0 NOT NULL,
    category_name TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    manufacturing_date DATE, -- Kept for compatibility if needed later
    expiry_date DATE         -- Kept for compatibility if needed later
);

-- 2.2 ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users, -- Nullable for Guest Checkout
    status TEXT DEFAULT 'pending',
    total NUMERIC NOT NULL,
    items JSONB, -- Stores content of the cart
    
    -- Customer Details
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    customer_address TEXT,
    customer_city TEXT,
    
    -- Payment Details
    payment_method TEXT, -- 'cod' or 'easypaisa'
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'failed'
    payment_proof_url TEXT, -- For Easypaisa screenshot
    whatsapp_ref TEXT -- For WhatsApp coordination
);

-- 2.3 ADMINS
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 4. CREATE RLS POLICIES
-- ==========================================

-- 4.1 PRODUCTS POLICIES
-- Everyone can view products
CREATE POLICY "Public products are viewable by everyone" 
ON public.products FOR SELECT 
USING (true);

-- Only Admins can create/edit/delete
-- (We use separate policies for clarity, though they could be combined)
CREATE POLICY "Admins can insert products" 
ON public.products FOR INSERT 
WITH CHECK (exists (select 1 from public.admins where user_id = auth.uid()));

CREATE POLICY "Admins can update products" 
ON public.products FOR UPDATE 
USING (exists (select 1 from public.admins where user_id = auth.uid()));

CREATE POLICY "Admins can delete products" 
ON public.products FOR DELETE 
USING (exists (select 1 from public.admins where user_id = auth.uid()));


-- 4.2 ORDERS POLICIES
-- Users (Authenticated) can view their own orders
CREATE POLICY "Users can view own orders" 
ON public.orders FOR SELECT 
USING (auth.uid() = user_id);

-- Admins can view ALL orders
CREATE POLICY "Admins can view all orders" 
ON public.orders FOR SELECT 
USING (exists (select 1 from public.admins where user_id = auth.uid()));

-- Anyone (Guests) can create orders
CREATE POLICY "Public/Guests can create orders" 
ON public.orders FOR INSERT 
WITH CHECK (true);

-- Admins can update orders (e.g. change status)
CREATE POLICY "Admins can update orders" 
ON public.orders FOR UPDATE 
USING (exists (select 1 from public.admins where user_id = auth.uid()));


-- 4.3 ADMINS POLICIES
-- Only Admins can see the admin list (Security)
CREATE POLICY "Admins are viewable by admins" 
ON public.admins FOR SELECT 
USING (exists (select 1 from public.admins where user_id = auth.uid()));

-- Exception: You can add yourself if you are the owner (Handled via API usually, but good to have)
CREATE POLICY "Admins can insert themselves" 
ON public.admins FOR INSERT 
WITH CHECK (auth.uid() = user_id);


-- ==========================================
-- 5. STORAGE BUCKET SETUP
-- ==========================================
-- Note: This might fail if you aren't a superuser, but it's worth trying in SQL Editor.
-- If it fails, use the dashboard to create buckets named 'product-images' and 'payment-proofs'.

INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Allow Public to View Images
CREATE POLICY "Public Access Product Images" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'product-images' );

CREATE POLICY "Public Access Payment Proofs" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'payment-proofs' );

-- Allow Authenticated Users (Admins usually) to Upload
CREATE POLICY "Authenticated Upload" 
ON storage.objects FOR INSERT 
WITH CHECK ( auth.role() = 'authenticated' );

-- ==========================================
-- 6. INDEXES (Performance)
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_name);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- ==========================================
-- END OF SCRIPT
-- ==========================================
