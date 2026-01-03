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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const count = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

    return (
        <header style={{
            background: scrolled || isMenuOpen ? 'white' : 'rgba(255, 255, 255, 0.95)', // Solid background when menu open
            backdropFilter: 'blur(10px)',
            borderBottom: scrolled || isMenuOpen ? '1px solid #e5e7eb' : '1px solid transparent',
            padding: '1rem 0',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            transition: 'all 0.3s ease',
            boxShadow: scrolled || isMenuOpen ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : 'none'
        }}>
            <div className="header-container" style={{ padding: '0 1rem' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    <div style={{ position: 'relative', width: '70px', height: '70px' }}>
                        <Image src="/logo.png?v=2" alt="Khattak MART" fill style={{ objectFit: 'contain' }} />
                    </div>
                </Link>

                {/* Nav Actions */}
                <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
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
                        <span>{count > 0 ? `${count}` : 'Cart'}</span>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <Menu size={24} />
                    </button>
                </nav>
            </div>

            {/* Mobile Dropdown */}
            {isMenuOpen && (
                <div className="mobile-nav-dropdown">
                    <Link href="/" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                        Home
                    </Link>
                    <Link href="/products" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                        All Products
                    </Link>
                    {/* Add other links if needed */}
                </div>
            )}
        </header>
    );
}
