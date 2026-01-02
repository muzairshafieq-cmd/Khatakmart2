import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !supabaseServiceKey) {
        return NextResponse.json({ error: 'Missing Environment Variables' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    const email = 'admin@khattakmart.com';
    const password = 'admin123';

    try {
        // 1. Create User in Auth
        // We use admin.createUser to auto-confirm the email
        const { data: userData, error: userError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true
        });

        if (userError) {
            console.log('User creation warning (likely exists):', userError.message);
        }

        // Get the user ID (either from creation or fetching)
        let userId = userData.user?.id;

        if (!userId) {
            // Fetch existing if create failed
            const { data: listUsers } = await supabase.auth.admin.listUsers();
            const found = listUsers.users.find(u => u.email === email);
            if (found) userId = found.id;
        }

        if (!userId) {
            return NextResponse.json({ error: 'Could not find or create user. Auth list failed.' }, { status: 500 });
        }

        console.log('Target User ID:', userId);

        // 2. Add to Admins table
        const { error: adminError } = await supabase
            .from('admins')
            .upsert({ user_id: userId, email }, { onConflict: 'user_id' });

        if (adminError) {
            console.error('Admin Insert Error:', adminError);
            return NextResponse.json({
                error: 'DB Error inserting into admins table. Does the table exist? Details: ' + adminError.message
            }, { status: 500 });
        }

        return NextResponse.json({ success: true, userId, message: 'Admin setup complete' });

    } catch (e: any) {
        console.error('Unexpected Setup Error:', e);
        return NextResponse.json({ error: 'Unexpected Error: ' + e.message }, { status: 500 });
    }
}
