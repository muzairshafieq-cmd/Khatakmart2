import Link from 'next/link';

export default function Hero() {
    return (
        <section style={{
            position: 'relative',
            marginTop: '2rem',
            marginBottom: '4rem',
            borderRadius: '24px',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', // Soft green gradient
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #bbf7d0'
        }}>
            {/* Content Side */}
            <div style={{
                padding: '4rem 3rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                zIndex: 10
            }}>
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

                <h1 style={{
                    fontSize: '3.5rem',
                    lineHeight: '1.1',
                    fontWeight: '900',
                    color: '#064e3b',
                    marginBottom: '1.5rem',
                    letterSpacing: '-0.025em'
                }}>
                    Groceries at your <br />
                    <span style={{ color: '#059669', textDecoration: 'underline', textDecorationColor: '#86efac' }}>Doorstep</span>
                </h1>

                <p style={{
                    fontSize: '1.25rem',
                    lineHeight: '1.6',
                    color: '#374151',
                    marginBottom: '2.5rem',
                    maxWidth: '500px'
                }}>
                    Khattak MART brings DHA Phase 2's freshest produce and daily essentials directly to you. Order now for <span style={{ fontWeight: 'bold' }}>30-minute delivery</span>.
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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
                clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0% 100%)' // Angled cut
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to right, rgba(220, 252, 231, 0.8), transparent 50%)' // Fade in from left
                }}></div>
            </div>
        </section>
    );
}
