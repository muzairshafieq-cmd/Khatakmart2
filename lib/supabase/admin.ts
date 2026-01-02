import { createClient } from '@supabase/supabase-js'

// Note: SUPABASE_SERVICE_ROLE_KEY should only be used in server-side contexts.
// Never expose this key to the client.
export const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
)
