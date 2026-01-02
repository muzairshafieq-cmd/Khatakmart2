-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- RESET (Caution: Running this clears everything)
-- drop table if exists order_items;
-- drop table if exists orders;
-- drop table if exists products;
-- drop table if exists categories;
-- drop table if exists admins;
-- drop table if exists profiles;

-- 1. CATEGORIES (Strict Business Rules)
-- Defines exactly what is allowed. Admin cannot bypass this without changing schema.
create table categories (
  name text primary key,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint allowed_categories check (
    name in ('Dry groceries', 'Frozen foods', 'Packaged milk')
  )
);

-- Seed allowed categories
insert into categories (name, description) values
  ('Dry groceries', 'Pulses, Rice, Spices, etc.'),
  ('Frozen foods', 'Frozen meat, vegetables, ready-to-cook.'),
  ('Packaged milk', 'UHT and pasteurized packaged milk only.');

alter table categories enable row level security;
create policy "Public can view categories" on categories for select using (true);
create policy "Admins can manage categories" on categories for all using (
  exists (select 1 from admins where user_id = auth.uid())
);

-- 2. ADMINS
-- Explicit table for admin authorization
create table admins (
  user_id uuid references auth.users on delete cascade primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table admins enable row level security;
-- Only actual admins can view the admin list (security by obscurity + RLS)
create policy "Admins can view admins" on admins for select using (
  exists (select 1 from admins a where a.user_id = auth.uid())
);

-- 3. PROFILES (Standard User Data)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- 4. PRODUCTS
create table products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price numeric not null check (price >= 0),
  stock integer default 0 check (stock >= 0),
  image_url text,
  category_name text references categories(name) not null, -- Enforces category existence
  manufacturing_date date,
  expiry_date date,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table products enable row level security;

-- RLS: Public Read, Admin Write
create policy "Public can view products" on products for select using (true);
create policy "Admins can manage products" on products for all using (
  exists (select 1 from admins where user_id = auth.uid())
);

-- 5. ORDERS
create table orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users, -- Made Nullable for Guest Checkout
  customer_name text,
  customer_email text,
  customer_phone text,
  customer_address text,
  customer_city text,
  payment_proof_url text, -- For Easypaisa screenshots
  whatsapp_ref text, -- WhatsApp chat reference
  status text default 'pending' check (status in ('pending', 'processing', 'completed', 'cancelled')),
  total numeric not null default 0,
  payment_method text default 'cod' check (payment_method in ('cod', 'easypaisa')),
  payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'verified')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table orders enable row level security;

-- RLS: Users own orders, Admins all orders
create policy "Users can view own orders" on orders for select using (auth.uid() = user_id);
create policy "Users can create orders" on orders for insert with check (auth.uid() = user_id);
create policy "Admins can view all orders" on orders for select using (
  exists (select 1 from admins where user_id = auth.uid())
);
create policy "Admins can update orders" on orders for update using (
  exists (select 1 from admins where user_id = auth.uid())
);

-- 6. ORDER ITEMS
create table order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders on delete cascade not null,
  product_id uuid references products not null,
  quantity integer default 1 check (quantity > 0),
  price_at_purchase numeric not null
);

alter table order_items enable row level security;

-- RLS: Inherit from Order access
create policy "Users can view own order items" on order_items for select using (
  exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);
create policy "Users can create order items" on order_items for insert with check (
  exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);
create policy "Admins can view all order items" on order_items for select using (
  exists (select 1 from admins where user_id = auth.uid())
);

-- STORAGE
insert into storage.buckets (id, name, public) 
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public can view product images" on storage.objects for select using ( bucket_id = 'product-images' );
create policy "Admins can upload product images" on storage.objects for insert with check (
    bucket_id = 'product-images' and
    exists (select 1 from admins where user_id = auth.uid())
);

-- TRIGGERS

-- Handle New User -> Profile
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Recreate trigger if exists
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- HELPER FUNCTIONS
-- Function to make someone an admin (run via SQL Editor)
create or replace function make_admin(admin_email text)
returns void as $$
begin
  insert into admins (user_id)
  select id from auth.users where email = admin_email
  on conflict (user_id) do nothing;
end;
$$ language plpgsql security definer;
