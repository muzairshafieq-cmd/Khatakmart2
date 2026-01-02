import Link from 'next/link';

export default function Footer() {
    return (
        <footer style={{
            background: 'var(--secondary)',
            padding: '2rem',
            marginTop: 'auto',
            borderTop: '1px solid var(--border)'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap'
            }}>
                <div>
                    <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Khattak MART</h3>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>&copy; {new Date().getFullYear()} All rights reserved.</p>
                </div>

                <div>
                    {/* Public Links could go here */}
                </div>

                <div>
                    <Link href="/admin/login" style={{
                        fontSize: '0.8rem',
                        color: '#9ca3af',
                        textDecoration: 'none'
                    }}>
                        Admin Login
                    </Link>
                </div>
            </div>
        </footer>
    );
}
