'use client';

import { useCart } from '@/context/CartContext';
import { placeOrder } from './actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    if (items.length === 0) {
        return <div style={{ padding: '2rem' }}>Cart is empty</div>;
    }

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const result = await placeOrder(formData, items);
        if (result?.error) {
            alert(result.error);
            setLoading(false);
        } else {
            clearCart();
            // The server action redirects, but if we clear cart here, it's good UX.
            // Wait for redirect...
        }
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Checkout</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                {/* Form */}
                <form action={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>

                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <h2 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Shipping Details</h2>

                        <label style={labelStyle}>Full Name</label>
                        <input name="name" required style={inputStyle} />

                        <label style={labelStyle}>Phone Number</label>
                        <input name="phone" required style={inputStyle} />

                        <label style={labelStyle}>Address</label>
                        <textarea name="address" required rows={2} style={inputStyle} />

                        <label style={labelStyle}>City</label>
                        <select name="city" style={inputStyle}>
                            <option>Islamabad (DHA Phase 2)</option>
                            <option>Islamabad (Other)</option>
                            <option>Rawalpindi</option>
                        </select>
                    </div>

                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <h2 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Payment Method</h2>

                        <div style={{ marginBottom: '0.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input type="radio" name="payment_method" value="cod" defaultChecked />
                                <span>Cash on Delivery (COD)</span>
                            </label>
                        </div>

                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input type="radio" name="payment_method" value="easypaisa" />
                                <span>Easypaisa</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '1rem',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Placing Order...' : `Place Order (PKR ${total})`}
                    </button>
                </form>

                {/* Summary */}
                <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', height: 'min-content' }}>
                    <h3 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Order Summary</h3>
                    {items.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            <span>{item.quantity}x {item.name}</span>
                            <span>PKR {item.price * item.quantity}</span>
                        </div>
                    ))}
                    <div style={{ borderTop: '1px solid var(--border)', marginTop: '1rem', paddingTop: '1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Total</span>
                        <span>PKR {total}</span>
                    </div>
                </div>

            </div>
        </div>
    );
}

const labelStyle = { display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' };
const inputStyle = { width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid var(--border)', borderRadius: '4px' };
