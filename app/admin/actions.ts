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

    // 2. Verify Admin Status
    const userId = data.user.id;
    const userEmail = data.user.email;

    // EMERGENCY BYPASS & SELF-HEALING for Main Admin
    // If this is the main admin, we Force-Allow and ensure they are in the DB.
    if (userEmail === 'admin@khattakmart.com') {
        // Attempt to fix the DB record if it's missing (Self-Healing)
        await adminClient
            .from('admins')
            .upsert({ user_id: userId }, { onConflict: 'user_id' });

        // Proceed to dashboard immediately
        redirect('/admin/dashboard');
    }

    // Standard Check for other staff
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
