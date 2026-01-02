import { ReactNode } from 'react';

export default function ProductGrid({ children }: { children: ReactNode }) {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '2rem',
            padding: '2rem 0'
        }}>
            {children}
        </div>
    );
}
