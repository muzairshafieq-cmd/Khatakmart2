import { adminClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { updateOrderStatus, verifyPayment, updateWhatsAppRef } from '../actions';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const { data: order } = await adminClient
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

    if (!order) return notFound();

    // Fetch Items
    const { data: items } = await adminClient
        .from('order_items')
        .select('*, products(name, image_url)')
        .eq('order_id', id);

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Order #{order.id.slice(0, 8)}</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <span style={{
                        padding: '0.5rem 1rem',
                        background: order.status === 'completed' ? '#dcfce7' : '#f3f4f6',
                        borderRadius: '8px',
                        fontWeight: 'bold'
                    }}>
                        Status: {order.status.toUpperCase()}
                    </span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                {/* Left Col: Items & Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Items */}
                    <div style={cardStyle}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Ordered Items</h2>
                        {items?.map((item: any) => (
                            <div key={item.id} style={{ display: 'flex', gap: '1rem', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                                <div style={{ width: '50px', height: '50px', background: '#f3f4f6' }}>
                                    {/* Tiny Thumb */}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'bold' }}>{item.products?.name}</div>
                                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Pkg: {item.quantity} x {item.price}</div>
                                </div>
                                <div>
                                    PKR {item.quantity * item.price}
                                </div>
                            </div>
                        ))}
                        <div style={{ textAlign: 'right', marginTop: '1rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            Total: PKR {order.total}
                        </div>
                    </div>

                    {/* Payment Proof */}
                    {order.payment_method === 'easypaisa' && (
                        <div style={cardStyle}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Payment Proof</h2>
                            {order.payment_proof_url ? (
                                <a href={order.payment_proof_url} target="_blank" rel="noopener noreferrer">
                                    <img
                                        src={order.payment_proof_url}
                                        alt="Payment Proof"
                                        style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '4px', border: '1px solid #ddd' }}
                                    />
                                </a>
                            ) : (
                                <p style={{ color: 'orange' }}>No proof uploaded yet.</p>
                            )}

                            {/* Controls */}
                            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                                {order.payment_status !== 'verified' && (
                                    <form action={async (formData) => {
                                        'use server'
                                        await verifyPayment(formData)
                                    }}>
                                        <input type="hidden" name="id" value={order.id} />
                                        <button type="submit" style={btnPrimary}>Verify Payment</button>
                                    </form>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Col: Customer & Status */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={cardStyle}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Customer Details</h2>
                        <p><strong>Name:</strong> {order.customer_name}</p>
                        <p><strong>Phone:</strong> {order.customer_phone}</p>
                        <p><strong>City:</strong> {order.customer_city}</p>
                        <p><strong>Address:</strong><br />{order.customer_address}</p>
                    </div>

                    <div style={cardStyle}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>WhatsApp Reference</h2>
                        <form action={async (formData) => {
                            'use server'
                            await updateWhatsAppRef(formData)
                        }} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input type="hidden" name="id" value={order.id} />
                            <input
                                name="whatsapp_ref"
                                defaultValue={order.whatsapp_ref || ''}
                                placeholder="e.g. Chat #123"
                                style={{ flex: 1, padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '4px' }}
                            />
                            <button type="submit" style={btnSecondary}>Save</button>
                        </form>
                    </div>

                    <div style={cardStyle}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Update Status</h2>
                        <form action={async (formData) => {
                            'use server'
                            await updateOrderStatus(formData)
                        }} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <input type="hidden" name="id" value={order.id} />
                            <select name="status" defaultValue={order.status} style={{ padding: '0.5rem' }}>
                                <option value="pending">Pending</option>
                                <option value="processing">Confirmed (Processing)</option>
                                <option value="completed">Delivered (Completed)</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <button type="submit" style={btnSecondary}>Update Status</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

const cardStyle = { background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)' };
const btnPrimary = { padding: '0.75rem 1rem', background: '#166534', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const btnSecondary = { padding: '0.5rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
