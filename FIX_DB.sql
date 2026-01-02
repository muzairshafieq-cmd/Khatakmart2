-- RUN THIS IN SUPABASE QUERY EDITOR TO FIX "TABLE NOT FOUND" ERRORS

-- 1. Create Products Table
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  price numeric not null,
  stock integer default 0 not null,
  category_name text,
  image_url text,
  is_active boolean default true,
  manufacturing_date date,
  expiry_date date
);

-- 2. Create Orders Table
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users, -- can be null for guest checkout
  status text default 'pending',
  total numeric not null,
  items jsonb,
  customer_name text,
  customer_email text,
  customer_phone text,
  customer_address text,
  customer_city text,
  payment_method text,
  payment_status text default 'pending',
  payment_proof_url text,
  whatsapp_ref text
);

-- 3. Create Admins Table
create table if not exists public.admins (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable RLS (Security)
alter table products enable row level security;
alter table orders enable row level security;
alter table admins enable row level security;

-- 5. Create Policies (Access Rules)

-- Products: Everyone can view, Admins can edit
create policy "Public products are viewable by everyone." on products for select using (true);
create policy "Admins can insert products" on products for insert with check (exists (select 1 from admins where user_id = auth.uid()));
create policy "Admins can update products" on products for update using (exists (select 1 from admins where user_id = auth.uid()));
create policy "Admins can delete products" on products for delete using (exists (select 1 from admins where user_id = auth.uid()));

-- Orders: Users see own, Admins see all
create policy "Users can view own orders" on orders for select using (auth.uid() = user_id);
create policy "Admins can view all orders" on orders for select using (exists (select 1 from admins where user_id = auth.uid()));
create policy "Public/Guests can create orders" on orders for insert with check (true);
create policy "Admins can update orders" on orders for update using (exists (select 1 from admins where user_id = auth.uid()));

-- Admins: Only readable by themselves
create policy "Admins are viewable by admins" on admins for select using (exists (select 1 from admins where user_id = auth.uid()));
create policy "Admins can insert themselves" on admins for insert with check (auth.uid() = user_id);

-- 6. Storage Policies (Images)
insert into storage.buckets (id, name, public) 
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public) 
values ('payment-proofs', 'payment-proofs', true)
on conflict (id) do nothing;

create policy "Public Access" on storage.objects for select using ( bucket_id in ('product-images', 'payment-proofs') );
create policy "Admin Upload" on storage.objects for insert with check ( bucket_id in ('product-images', 'payment-proofs') );
