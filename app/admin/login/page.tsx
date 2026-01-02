'use client';

import { login } from '../actions';
import { useState } from 'react';

export default function AdminLoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);
        try {
            const result = await login(formData);
            if (result?.error) {
                setError(result.error);
                setLoading(false);
            }
        } catch (e) {
            setError('Something went wrong.');
            setLoading(false);
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2574&ixlib=rb-4.0.3") center/cover no-repeat', // Grocery background
            padding: '1rem',
            position: 'relative'
        }}>
            {/* Dark Overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} />

            <div style={{
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '3rem 2.5rem',
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                width: '100%',
                maxWidth: '420px',
                border: '1px solid rgba(255,255,255,0.2)'
            }}>
                <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: '#059669',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem auto',
                        fontSize: '2rem',
                        boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.3)'
                    }}>
                        🛍️
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.025em' }}>Khattak MART</h1>
                    <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '1rem' }}>Admin Dashboard Access</p>
                </div>

                {error && (
                    <div style={{
                        background: '#fef2f2',
                        borderLeft: '4px solid #ef4444',
                        color: '#991b1b',
                        padding: '1rem',
                        marginBottom: '2rem',
                        fontSize: '0.875rem',
                        borderRadius: '4px'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
                        <input
                            name="email"
                            type="email"
                            required
                            style={{
                                width: '100%',
                                padding: '1rem',
                                border: '2px solid #e5e7eb',
                                borderRadius: '12px',
                                outline: 'none',
                                transition: 'all 0.2s',
                                fontSize: '1rem',
                                background: '#f9fafb'
                            }}
                            onFocus={(e) => { e.target.style.borderColor = '#059669'; e.target.style.background = 'white'; }}
                            onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#f9fafb'; }}
                            placeholder="admin@khattakmart.com"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            style={{
                                width: '100%',
                                padding: '1rem',
                                border: '2px solid #e5e7eb',
                                borderRadius: '12px',
                                outline: 'none',
                                transition: 'all 0.2s',
                                fontSize: '1rem',
                                background: '#f9fafb'
                            }}
                            onFocus={(e) => { e.target.style.borderColor = '#059669'; e.target.style.background = 'white'; }}
                            onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#f9fafb'; }}
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            background: 'linear-gradient(to right, #059669, #047857)',
                            color: 'white',
                            padding: '1rem',
                            borderRadius: '12px',
                            border: 'none',
                            fontWeight: '700',
                            fontSize: '1.1rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.8 : 1,
                            marginTop: '1rem',
                            boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.2)',
                            transform: loading ? 'none' : 'translateY(0)',
                            transition: 'transform 0.1s, box-shadow 0.1s'
                        }}
                        onMouseDown={(e) => !loading && (e.currentTarget.style.transform = 'translateY(2px)')}
                        onMouseUp={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                        {loading ? 'Authenticating...' : 'Sign In to Dashboard →'}
                    </button>
                </form>
            </div>
        </div>
    );
}
