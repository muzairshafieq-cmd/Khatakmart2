import { adminClient } from '@/lib/supabase/admin';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
    const { data: orders } = await adminClient
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Orders</h1>

            <div style={{ overflowX: 'auto', background: 'white', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead>
                        <tr style={{ background: 'var(--secondary)', textAlign: 'left' }}>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Customer</th>
                            <th style={thStyle}>Total</th>
                            <th style={thStyle}>Method</th>
                            <th style={thStyle}>Payment</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(orders || []).map((order) => (
                            <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem', fontFamily: 'monospace' }}>
                                    {order.id.slice(0, 8)}...
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {order.customer_name}<br />
                                    <small style={{ color: '#666' }}>{order.customer_phone}</small>
                                </td>
                                <td style={{ padding: '1rem' }}>PKR {order.total}</td>
                                <td style={{ padding: '1rem' }}>
                                    {order.payment_method === 'easypaisa' ? (
                                        <span style={{ color: '#166534', fontWeight: 'bold' }}>Easypaisa</span>
                                    ) : 'COD'}
                                    {order.payment_method === 'easypaisa' && order.payment_status === 'pending' && (
                                        <span style={{ display: 'block', fontSize: '0.7rem', color: 'orange' }}>Proof Pending</span>
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        background: order.payment_status === 'verified' ? '#dcfce7' : '#fee2e2',
                                        color: order.payment_status === 'verified' ? '#166534' : '#991b1b',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold'
                                    }}>
                                        {order.payment_status.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ fontWeight: 'bold' }}>{order.status.toUpperCase()}</span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <Link
                                        href={`/admin/orders/${order.id}`}
                                        style={{ textDecoration: 'underline', color: 'var(--primary)' }}
                                    >
                                        View Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {(!orders || orders.length === 0) && (
                            <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center' }}>No orders found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const thStyle = { padding: '1rem', borderBottom: '1px solid var(--border)' };
