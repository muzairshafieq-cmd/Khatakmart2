'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, total } = useCart();

    if (items.length === 0) {
        return (
            <div style={{ maxWidth: '800px', margin: '4rem auto', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Your Cart is Empty</h1>
                <Link href="/products" style={{ textDecoration: 'underline', color: 'var(--primary)' }}>Start Shopping</Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Shopping Cart</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Items */}
                <div>
                    {items.map(item => (
                        <div key={item.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ width: '80px', height: '80px', background: '#f3f4f6', flexShrink: 0 }}>
                                {/* Placeholder for small image if needed */}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{item.name}</h3>
                                <p style={{ color: '#666' }}>PKR {item.price}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <button
                                    onClick={() => updateQuantity(item.id, -1)}
                                    style={qtyBtnStyle}
                                >-</button>
                                <span>{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, 1)}
                                    style={qtyBtnStyle}
                                >+</button>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.id)}
                                style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', marginLeft: '1rem' }}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: '8px', height: 'min-content' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Order Summary</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Subtotal</span>
                        <span>PKR {total}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'green' }}>
                        <span>Delivery</span>
                        <span>Free</span>
                    </div>
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem', fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Total</span>
                        <span>PKR {total}</span>
                    </div>

                    <Link
                        href="/checkout"
                        style={{
                            display: 'block',
                            width: '100%',
                            padding: '1rem',
                            background: 'var(--primary)',
                            color: 'white',
                            textAlign: 'center',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            marginTop: '1.5rem'
                        }}
                    >
                        Proceed to Checkout
                    </Link>
                </div>
            </div>
        </div>
    );
}

const qtyBtnStyle = {
    width: '30px',
    height: '30px',
    borderRadius: '4px',
    border: '1px solid var(--border)',
    background: 'white',
    cursor: 'pointer'
};
