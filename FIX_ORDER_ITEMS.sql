-- FIX: CREATE MISSING ORDER_ITEMS TABLE

create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders not null,
  product_id uuid references public.products not null,
  quantity integer not null,
  price numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Security
alter table public.order_items enable row level security;

-- Policies
-- 1. Public can insert items (guest checkout)
create policy "Public can insert order items" on order_items for insert with check (true);

-- 2. Users can view their own items (via order ownership)
create policy "Users view own order items" on order_items for select using (
  exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);

-- 3. Admins can view all items
create policy "Admins view all order items" on order_items for select using (
  exists (select 1 from admins where user_id = auth.uid())
);
