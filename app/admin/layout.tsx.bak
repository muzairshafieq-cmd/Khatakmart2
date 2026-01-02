import { type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { adminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const supabase = await createClient();

    // 1. Check Auth Session
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect('/admin/login');
    }

    // 2. Check Admin Table Authorization
    // We utilize the adminClient here to safely check the strictly managed admins table.
    const { data: adminRecord } = await adminClient
        .from('admins')
        .select('user_id')
        .eq('user_id', user.id)
        .single();

    if (!adminRecord) {
        // If authenticated but not authorized (not an admin)
        redirect('/admin/login');
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <aside style={{
                width: '250px',
                background: 'var(--secondary)',
                padding: '1rem',
                borderRight: '1px solid var(--border)'
            }}>
                <h2 style={{ marginBottom: '2rem', fontWeight: 'bold' }}>Admin Panel</h2>
                <nav>
                    <ul style={{ listStyle: 'none' }}>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <a href="/admin/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>Dashboard</a>
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <a href="/admin/products" style={{ textDecoration: 'none', color: 'inherit' }}>Products</a>
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <a href="/admin/orders" style={{ textDecoration: 'none', color: 'inherit' }}>Orders</a>
                        </li>
                    </ul>
                </nav>
                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <form action="/api/auth/signout" method="post">
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}>Logout</button>
                    </form>
                </div>
            </aside>
            <main style={{ flex: 1, padding: '2rem' }}>
                {children}
            </main>
        </div>
    );
}
