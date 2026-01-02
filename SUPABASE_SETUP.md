# Supabase Setup Guide

## 1. Environment Variables

You need to configure the following environment variables in your `.env.local` file for local development and in Netlify for production.

**Keys required:**
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon (Public) Key.
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role (Secret) Key. **Do not expose this in public files.**

### In Netlify:
1. Go to **Site Settings** > **Environment variables**.
2. Add the three keys above.

## 2. Database Schema (Strict Rules)

I have updated `supabase/schema.sql` to enforce strict business rules.

**Key Constraints:**
- **Categories**: Only 'Dry groceries', 'Frozen foods', and 'Packaged milk' are allowed.
- **Orders**: Added `customer_name`, `customer_phone`, `customer_address`, etc. Made `user_id` nullable. Added `payment_proof_url` and `whatsapp_ref`.
- **Products**: Added `manufacturing_date`, `expiry_date`, `is_active`.
- **Admins**: Admin privileges are now managed via a dedicated `admins` table.

**To Apply:**
1. Go to **Supabase Dashboard** > **SQL Editor**.
2. Run the content of `supabase/schema.sql`.

## 3. Managing Admins

To make a user an admin, use the helper function included in the schema:

1. Sign up the user (e.g., `admin@khattakmart.com`).
2. Go to SQL Editor.
3. Run: `select make_admin('admin@khattakmart.com');`
