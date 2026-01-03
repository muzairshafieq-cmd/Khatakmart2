import Link from 'next/link';
import { MapPin, Phone, Shield } from 'lucide-react';

export default function Footer() {
    return (
        <footer style={{
            background: '#1e293b', // Slate 800 - Dark Premium
            color: '#f8fafc', // Slate 50
            padding: '4rem 0 2rem',
            marginTop: 'auto',
            borderTop: '4px solid var(--accent)'
        }}>
            <div className="container" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '3rem',
                marginBottom: '3rem'
            }}>
                {/* Brand Column */}
                <div>
                    <h3 style={{
                        fontSize: '1.5rem',
                        fontWeight: '800',
                        marginBottom: '1rem',
                        color: 'white',
                        letterSpacing: '-0.025em'
                    }}>
                        Sk Khattak <span style={{ color: 'var(--primary-light)' }}>Mart</span>
                    </h3>
                    <p style={{ color: '#94a3b8', lineHeight: '1.6', maxWidth: '300px' }}>
                        Premium grocery delivery service in Islamabad.
                        Freshness guaranteed at your doorstep.
                    </p>
                </div>

                {/* Location Column */}
                <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1.25rem', color: 'white' }}>
                        Shop Location
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', color: '#cbd5e1' }}>
                            <MapPin size={20} color="var(--accent)" style={{ flexShrink: 0 }} />
                            <span>
                                DHA Phase 2,<br />
                                Islamabad, Pakistan
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', color: '#cbd5e1' }}>
                            <Phone size={20} color="var(--accent)" style={{ flexShrink: 0 }} />
                            <span>0315-5770026</span>
                        </div>
                    </div>
                </div>

                {/* Admin / Links Column */}
                <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1.25rem', color: 'white' }}>
                        Quick Links
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <Link href="/products" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }}>
                            Browse Products
                        </Link>

                        <div style={{ marginTop: '1rem' }}>
                            <Link href="/admin/login" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '0.875rem',
                                textDecoration: 'none',
                                transition: 'all 0.2s'
                            }}>
                                <Shield size={16} />
                                Admin Panel
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Strip */}
            <div style={{
                borderTop: '1px solid #334155',
                paddingTop: '2rem',
                textAlign: 'center',
                fontSize: '0.875rem',
                color: '#64748b'
            }}>
                <p>&copy; {new Date().getFullYear()} Khattak MART. All rights reserved.</p>
            </div>
        </footer>
    );
}
