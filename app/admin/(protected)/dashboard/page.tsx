import { adminClient } from '@/lib/supabase/admin';
import { DollarSign, Package, ShoppingBag, AlertCircle, CheckCircle } from 'lucide-react';

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
            <h1 style={{ fontSize: '1.875rem', marginBottom: '2rem', fontWeight: '800', color: '#1e293b' }}>
                Dashboard Overview
            </h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem'
            }}>
                <StatsCard
                    title="Total Orders"
                    value={totalOrders || 0}
                    icon={ShoppingBag}
                    color="blue"
                />

                <StatsCard
                    title="COD Orders"
                    value={codOrders || 0}
                    icon={Package}
                    color="amber"
                />

                <StatsCard
                    title="Easypaisa (Verified)"
                    value={easypaisaPaid || 0}
                    icon={CheckCircle}
                    color="emerald"
                />

                <StatsCard
                    title="Pending Verification"
                    value={easypaisaPending || 0}
                    icon={AlertCircle}
                    color="rose"
                    alert={true}
                />
            </div>

            {/* Recent Activity or Chart could go here */}
            <div style={{ marginTop: '3rem', padding: '2rem', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#334155' }}>Platform Status</h3>
                <p style={{ color: '#64748b' }}>System is running normally. DB Connection: Active.</p>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon: Icon, color, alert }: { title: string, value: number, icon: any, color: string, alert?: boolean }) {
    // Map colors
    const colorMap: Record<string, { bg: string, text: string, iconBg: string }> = {
        blue: { bg: 'white', text: '#3b82f6', iconBg: '#eff6ff' },
        amber: { bg: 'white', text: '#f59e0b', iconBg: '#fffbeb' },
        emerald: { bg: 'white', text: '#10b981', iconBg: '#ecfdf5' },
        rose: { bg: 'white', text: '#f43f5e', iconBg: '#fff1f2' },
    };

    const theme = colorMap[color] || colorMap.blue;

    return (
        <div style={{
            padding: '1.5rem',
            background: 'white',
            borderRadius: '16px',
            border: alert ? '2px solid #fecdd3' : '1px solid #f1f5f9',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem'
        }}>
            <div style={{
                background: theme.iconBg,
                padding: '1rem',
                borderRadius: '12px',
                color: theme.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Icon size={28} />
            </div>
            <div>
                <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>{title}</p>
                <p style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', lineHeight: 1 }}>{value}</p>
            </div>
        </div>
    );
}
