'use client';

import { useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';

export default function AutoRedirect({ url }: { url: string }) {
    const { clearCart } = useCart();
    const hasClearedRef = useRef(false);

    useEffect(() => {
        // Clear cart immediately upon successful landing, but only once
        if (!hasClearedRef.current) {
            clearCart();
            hasClearedRef.current = true;
        }

        // Wait a brief moment to show success UI, then redirect
        const timer = setTimeout(() => {
            window.location.href = url;
        }, 1500);

        return () => clearTimeout(timer);
    }, [url, clearCart]);

    return (
        <div style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
            <p>Redirecting to WhatsApp in a moment...</p>
        </div>
    );
}
