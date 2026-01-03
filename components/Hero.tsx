import Link from 'next/link';

export default function Hero() {
    return (
        <section className="hero-section">
            {/* Content Side */}
            <div className="hero-content">
                <span style={{
                    display: 'inline-block',
                    alignSelf: 'flex-start',
                    background: '#166534',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '99px',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    marginBottom: '1.5rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                }}>
                    Fastest Delivery in Islamabad
                </span>

                <h1 className="hero-title">
                    Groceries at your <br />
                    <span style={{ color: '#059669', textDecoration: 'underline', textDecorationColor: '#86efac' }}>Doorstep</span>
                </h1>

                <p className="hero-desc">
                    Khattak MART brings DHA Phase 2's freshest produce and daily essentials directly to you. Order now for <span style={{ fontWeight: 'bold' }}>30-minute delivery</span>.
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Link href="/products" style={{
                        background: '#059669',
                        color: 'white',
                        padding: '1rem 2.5rem',
                        borderRadius: '99px',
                        fontWeight: 'bold',
                        fontSize: '1.125rem',
                        textDecoration: 'none',
                        boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.3)',
                        transition: 'transform 0.2s',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        Start Shopping <span>→</span>
                    </Link>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#064e3b',
                        fontWeight: 'bold',
                        padding: '1rem'
                    }}>
                        <span style={{ fontSize: '1.5rem' }}>📞</span> 0315-5770026
                    </div>
                </div>
            </div>

            {/* Image Side */}
            <div style={{
                position: 'relative',
                minHeight: '400px',
                backgroundImage: 'url(/hero-grocery.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                // clipPath removed for better mobile stacking, or handled via CSS if needed
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to right, rgba(220, 252, 231, 0.8), transparent 50%)'
                }}></div>
            </div>
        </section>
    );
}
