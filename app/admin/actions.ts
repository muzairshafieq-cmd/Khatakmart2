'use server';

import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = await createClient();

    // 1. Authenticate User
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: 'Invalid credentials' };
    }

    // 2. Verify Admin Status (Security Step)
    // We check if this user exists in the `admins` table.
    // Using adminClient to bypass RLS for this specific check if needed, 
    // but since we are logged in, we can also query rpc or table if policies allow.
    // Ideally, RLS allows admins to view admins, so standard client might work,
    // but to be absolutely sure we don't let a normal user in, we check the admin table.

    const userId = data.user.id;
    const { data: adminRecord, error: adminError } = await adminClient
        .from('admins')
        .select('user_id')
        .eq('user_id', userId)
        .single();

    if (adminError || !adminRecord) {
        // Not an admin!
        await supabase.auth.signOut();
        return { error: 'Access denied. You are not an administrator.' };
    }

    redirect('/admin/dashboard');
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/admin/login');
}
