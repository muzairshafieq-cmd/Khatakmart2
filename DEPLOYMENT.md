# Deployment Guide - Khattak MART

Run this project on **Netlify** for free hosting with Serverless Functions support (Next.js).

## 1. Prerequisites
- [GitHub Account](https://github.com)
- [Netlify Account](https://netlify.com)
- [Supabase Project](https://supabase.com)

## 2. Push to GitHub
If you haven't already:
1. Initialize Git: `git init`
2. Add files: `git add .`
3. Commit: `git commit -m "Initial commit"`
4. Push to a new GitHub repository.

## 3. Deploy to Netlify
1. Log in to Netlify.
2. Click **"Add new site"** > **"Import from existing project"**.
3. Select **GitHub** and choose your `khattak-mart` repository.
4. **Build Settings**:
   - **Base directory**: `(leave empty)`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next` (Netlify auto-detects Next.js)
5. **Environment Variables**:
   Click "Add environment variables" and add:
   
   | Key | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase Service Role Key (Keep Secret!) |

   *Find these in Supabase Dashboard > Settings > API.*

6. Click **Deploy**.

## 4. Supabase Configuration
Ensure your database is production-ready:

1. **Run Schema**: Go to Supabase SQL Editor and run the contents of `supabase/schema.sql`.
2. **Storage**: Ensure `product-images` and `payment-proofs` buckets exist (schema script does this).
3. **Auth**: Go to Authentication > Providers. Ensure "Email" is enabled.

## 5. Domain Configuration (Optional)
1. Go to Netlify Site Settings > Domain Management.
2. Add your custom domain (e.g. `khattakmart.com`).
3. Updates DNS records as instructed by Netlify.

## Troubleshooting
- **Build Failures**: Check "Build logs" in Netlify.
- **Database Errors**: Check Browser Console or Netlify Function logs. Ensure RLS policies in `schema.sql` are applied.
