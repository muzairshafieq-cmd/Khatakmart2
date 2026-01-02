'use server';

import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateAdminCredentials(formData: FormData) {
    const supabase = await createClient();

    // 1. Authenticate Request
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: 'Unauthorized' };
    }

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Email and password are required' };
    }

    // 2. Update via Admin Client (Bypasses verification requirement)
    // allowing the owner to switch emails instantly.
    const { error } = await adminClient.auth.admin.updateUserById(
        user.id,
        {
            email: email,
            password: password,
            email_confirm: true // Auto-confirm the new email
        }
    );

    if (error) {
        console.error('Update Error:', error);
        return { error: error.message };
    }

    // 3. Update the 'admins' table record just in case we rely on it elsewhere
    // (Though auth.users is the source of truth for login)
    // We strictly map user_id, so no email column usually in 'admins' unless added.
    // But we should ensure the session is refreshed.

    return { success: 'Credentials updated successfully. Please login with new details.' };
}
