import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Note: SUPABASE_SERVICE_ROLE_KEY should only be used in server-side contexts.
// Never expose this key to the client.

let client: SupabaseClient | undefined;

// Use a Proxy to lazy-initialize the client.
// This prevents Next.js build from crashing because process.env vars might be missing during static generation import.
export const adminClient = new Proxy({} as SupabaseClient, {
    get: (_target, prop) => {
        if (!client) {
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

            if (!url || !key) {
                // Return a dummy object or throw, but better to throw meaningfully if used.
                // During build, if not used, this won't be hit.
                throw new Error('Supabase URL or Service Role Key is missing!');
            }

            client = createClient(url, key, {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            });
        }
        return Reflect.get(client, prop);
    }
});
