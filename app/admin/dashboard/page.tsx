import { adminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    // Fetch Metrics safely

    // 1. Total Orders
    const { count: totalOrders } = await adminClient
        .from('orders')
        .select('*', { count: 'exact', head: true });

    // 2. COD Orders
    const { count: codOrders } = await adminClient
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('payment_method', 'cod');

    // 3. Easypaisa Paid & Verified
    const { count: easypaisaPaid } = await adminClient
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('payment_method', 'easypaisa')
        .eq('payment_status', 'verified');

    // 4. Easypaisa Pending Verification
    const { count: easypaisaPending } = await adminClient
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('payment_method', 'easypaisa')
        .eq('payment_status', 'pending');

    return (
        <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 'bold' }}>Dashboard Overview</h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem'
            }}>
                {/* Total Orders Card */}
                <div style={{
                    padding: '1.5rem',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    background: 'white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Orders</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                        {totalOrders || 0}
                    </p>
                </div>

                {/* COD Orders Card */}
                <div style={{
                    padding: '1.5rem',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    background: 'white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>COD Orders</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
                        {codOrders || 0}
                    </p>
                </div>

                {/* Easypaisa Paid Card */}
                <div style={{
                    padding: '1.5rem',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    background: 'white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Easypaisa (Paid)</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>
                        {easypaisaPaid || 0}
                    </p>
                </div>

                {/* Easypaisa Pending Card */}
                <div style={{
                    padding: '1.5rem',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    background: 'white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Easypaisa (Pending)</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ef4444' }}>
                        {easypaisaPending || 0}
                    </p>
                </div>
            </div>
        </div>
    );
}
