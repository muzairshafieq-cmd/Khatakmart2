'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, LogOut, User, Settings, Menu } from 'lucide-react';
import { useState } from 'react';

export default function AdminSidebar() {
    const pathname = usePathname();

    const links = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/products', label: 'Products', icon: Package },
        { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
    ];

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Toggle (FAB) */}
            <button
                className="admin-mobile-toggle"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Menu size={24} />
            </button>

            {/* Backdrop */}
            <div
                className={`admin-backdrop ${isOpen ? 'visible' : ''}`}
                onClick={() => setIsOpen(false)}
            />

            <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
                {/* Header */}
                <div style={{ padding: '2rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#10b981' }}>Khattak</span> Admin
                    </h2>
                    {/* Mobile Close Button */}
                    <button
                        className="md:hidden"
                        onClick={() => setIsOpen(false)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: isOpen ? 'block' : 'none' }}
                    >
                        ✕
                    </button>
                </div>

                {/* Navigation */}
                <nav style={{ padding: '1.5rem', flex: 1 }}>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {links.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname.startsWith(link.href);

                            return (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)} // Close on navigate
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '8px',
                                            textDecoration: 'none',
                                            color: isActive ? 'white' : '#94a3b8',
                                            background: isActive ? '#0f766e' : 'transparent',
                                            fontWeight: isActive ? '600' : '400',
                                            transition: 'all 0.2s',
                                            borderLeft: isActive ? '4px solid #34d399' : '4px solid transparent'
                                        }}
                                    >
                                        <Icon size={20} />
                                        {link.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer / Logout */}
                <div style={{ padding: '1.5rem', borderTop: '1px solid #334155' }}>
                    <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#cbd5e1' }}>
                        <div style={{ background: '#334155', padding: '0.5rem', borderRadius: '50%' }}>
                            <User size={20} />
                        </div>
                        <div style={{ fontSize: '0.9rem' }}>
                            <div style={{ fontWeight: 'bold' }}>Administrator</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Owner</div>
                        </div>
                    </div>

                    <form action="/api/auth/signout" method="post">
                        <button
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                background: '#2f3847',
                                border: '1px solid #475569',
                                cursor: 'pointer',
                                color: '#ef4444',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                fontWeight: '600',
                                transition: 'background 0.2s'
                            }}
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </form>
                </div>
            </aside>
        </>
    );
}
