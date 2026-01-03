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
            background: scrolled || isMenuOpen ? 'white' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: isMenuOpen ? 'none' : 'blur(10px)', // Remove blur when menu open to fix fixed positioning context
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
                    <div style={{ position: 'relative', width: '180px', height: '60px' }}>
                        <Image
                            src="/logo.png?v=6"
                            alt="Sk Khattak Mart"
                            fill
                            style={{
                                objectFit: 'contain',
                                objectPosition: 'left',
                                mixBlendMode: 'multiply'
                            }}
                        />
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

            {/* Mobile Drawer */}
            {isMenuOpen && (
                <>
                    <div className="drawer-backdrop" onClick={() => setIsMenuOpen(false)} />
                    <div className="mobile-drawer">
                        <div className="drawer-header">
                            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#064e3b' }}>Menu</span>
                            <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                ✕
                            </button>
                        </div>

                        <Link href="/" className="drawer-link" onClick={() => setIsMenuOpen(false)}>
                            Home <span>→</span>
                        </Link>
                        <Link href="/products" className="drawer-link" onClick={() => setIsMenuOpen(false)}>
                            All Products <span>→</span>
                        </Link>
                        <Link href="/cart" className="drawer-link" onClick={() => setIsMenuOpen(false)}>
                            My Cart ({count}) <span>→</span>
                        </Link>
                    </div>
                </>
            )}
        </header>
    );
}
