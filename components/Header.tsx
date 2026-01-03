'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Search, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
    const { items } = useCart();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const count = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

    return (
        <header style={{
            background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'white',
            backdropFilter: 'blur(10px)',
            borderBottom: scrolled ? '1px solid #e5e7eb' : '1px solid transparent',
            padding: '1rem 0', // Reduced vertical padding, horizontal handled by container
            position: 'sticky',
            top: 0,
            zIndex: 100,
            transition: 'all 0.3s ease',
            boxShadow: scrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : 'none'
        }}>
            <div className="header-container" style={{ padding: '0 1rem' }}> {/* Ensure internal padding matches global container */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                    <div style={{ position: 'relative', width: '40px', height: '40px' }}>
                        <Image src="/logo.png?v=2" alt="Khattak MART" fill style={{ objectFit: 'contain' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#111827', lineHeight: 1 }}>Khattak</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#059669', letterSpacing: '0.15em' }}>MART</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link href="/products" className="hide-on-mobile" style={{
                        textDecoration: 'none',
                        color: '#374151',
                        fontWeight: '600',
                        fontSize: '1rem',
                        transition: 'color 0.2s',
                        marginRight: '0.5rem'
                    }}>
                        Products
                    </Link>

                    <Link href="/cart" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        textDecoration: 'none',
                        color: 'white',
                        background: '#059669',
                        padding: '0.5rem 1rem',
                        borderRadius: '99px',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        boxShadow: '0 2px 4px rgba(5, 150, 105, 0.2)'
                    }}>
                        <ShoppingCart size={18} />
                        <span>{count > 0 ? `${count}` : 'Cart'}</span> {/* Shortened text for mobile */}
                    </Link>
                </nav>
            </div>
        </header>
    );
}
