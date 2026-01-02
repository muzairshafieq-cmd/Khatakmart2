import { type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { adminClient } from '@/lib/supabase/admin';
import AdminSidebar from '@/components/AdminSidebar';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const supabase = await createClient();

    // 1. Check Auth Session
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect('/admin/login');
    }

    // 2. Check Admin Table Authorization
    const userEmail = user.email;

    // EMERGENCY BYPASS: Allow Main Admin even if DB record is missing
    if (userEmail === 'admin@khattakmart.com') {
        // Self-heal: Ensure record exists so future checks pass naturally
        const { data: existing } = await adminClient.from('admins').select('user_id').eq('user_id', user.id).single();
        if (!existing) {
            await adminClient.from('admins').upsert({ user_id: user.id }, { onConflict: 'user_id' });
        }
    } else {
        // Strict check for everyone else
        const { data: adminRecord } = await adminClient
            .from('admins')
            .select('user_id')
            .eq('user_id', user.id)
            .single();

        if (!adminRecord) {
            redirect('/admin/login');
        }
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
            <AdminSidebar />
            <main style={{ flex: 1, padding: '2rem', height: '100vh', overflowY: 'auto' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
