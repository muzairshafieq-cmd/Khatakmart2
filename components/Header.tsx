'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
    const { items } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const count = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

    return (
        <header style={{
            background: 'white',
            borderBottom: '1px solid var(--border)',
            padding: '1rem',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: 'var(--foreground)' }}>
                    Khattak MART
                </Link>

                <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link href="/products" style={{ textDecoration: 'none', color: 'inherit', fontWeight: '500' }}>Shop</Link>
                    <Link href="/cart" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
                        <ShoppingCart size={20} />
                        <span>Cart ({count})</span>
                    </Link>
                </nav>
            </div>
        </header>
    );
}
