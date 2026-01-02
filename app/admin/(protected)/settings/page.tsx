'use client';

import { useState } from 'react';
import { updateAdminCredentials } from './actions';
import { AlertCircle, CheckCircle, Lock, Mail } from 'lucide-react';

export default function SettingsPage() {
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setMessage(null);

        const result = await updateAdminCredentials(formData);

        if (result?.error) {
            setMessage({ type: 'error', text: result.error });
        } else if (result?.success) {
            setMessage({ type: 'success', text: result.success });
            // Optional: Logout user
        }
        setLoading(false);
    }

    return (
        <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: '#1e293b', marginBottom: '2rem' }}>
                Account Settings
            </h1>

            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Lock size={20} color="var(--primary)" />
                    Update Credentials
                </h2>

                <div style={{
                    background: '#fffbeb',
                    border: '1px solid #fcd34d',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    gap: '0.75rem',
                    color: '#92400e',
                    fontSize: '0.9rem'
                }}>
                    <AlertCircle size={20} style={{ flexShrink: 0 }} />
                    <p>
                        <strong>Warning:</strong> Changing your email or password will update your login credentials immediately.
                        Make sure to remember the new password.
                    </p>
                </div>

                <form action={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>

                    {/* Email Input */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569' }}>
                            New Email Address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="client@khattakmart.com"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    paddingLeft: '2.5rem',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '8px',
                                    outline: 'none',
                                    fontSize: '0.95rem'
                                }}
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569' }}>
                            New Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                            <input
                                name="password"
                                type="text"
                                minLength={6}
                                required
                                placeholder="Minimum 6 characters"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    paddingLeft: '2.5rem',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '8px',
                                    outline: 'none',
                                    fontSize: '0.95rem'
                                }}
                            />
                        </div>
                    </div>

                    {message && (
                        <div style={{
                            padding: '1rem',
                            borderRadius: '8px',
                            background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                            color: message.type === 'success' ? '#166534' : '#991b1b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: '600',
                            fontSize: '0.9rem'
                        }}>
                            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '0.875rem',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            transition: 'background 0.2s',
                            fontSize: '1rem'
                        }}
                    >
                        {loading ? 'Updating Credentials...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}
