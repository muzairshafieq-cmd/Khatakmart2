import Link from 'next/link';

export default function Hero() {
    return (
        <div style={{
            position: 'relative',
            height: '500px',
            width: '100%',
            backgroundImage: 'url(/hero-grocery.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: 'white'
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)' // Dark overlay
            }}></div>

            <div style={{ position: 'relative', zIndex: 1, padding: '1rem', maxWidth: '800px' }}>
                <h1 style={{
                    fontSize: '3.5rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                    Khattak MART
                </h1>
                <p style={{
                    fontSize: '1.5rem',
                    marginBottom: '2rem',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}>
                    Online Grocery Store – DHA Phase 2, Islamabad
                </p>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '2rem',
                    marginBottom: '3rem',
                    flexWrap: 'wrap'
                }}>
                    <Badge text="No Delivery Charges" />
                    <Badge text="Cash on Delivery" />
                    <Badge text="Easypaisa Supported" />
                </div>

                <Link
                    href="#products"
                    style={{
                        padding: '1rem 2.5rem',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        background: 'var(--primary)',
                        color: 'white',
                        borderRadius: '99px',
                        textDecoration: 'none',
                        transition: 'transform 0.2s',
                        border: '2px solid transparent'
                    }}
                >
                    Shop Now
                </Link>
            </div>
        </div>
    );
}

function Badge({ text }: { text: string }) {
    return (
        <div style={{
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(5px)',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '0.9rem'
        }}>
            {text}
        </div>
    );
}
