import Image from 'next/image';

interface Product {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    stock: number;
}

export default function ProductCard({ product }: { product: Product }) {
    return (
        <div style={{
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            overflow: 'hidden',
            transition: 'box-shadow 0.2s',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ position: 'relative', height: '200px', width: '100%', background: '#f3f4f6' }}>
                {product.image_url ? (
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#9ca3af'
                    }}>
                        No Image
                    </div>
                )}
            </div>

            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{product.name}</h3>
                <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem' }}>
                    PKR {product.price}
                </p>

                <div style={{ marginTop: 'auto' }}>
                    {product.stock > 0 ? (
                        <button
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Add to Cart
                        </button>
                    ) : (
                        <button
                            disabled
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: '#e5e7eb',
                                color: '#9ca3af',
                                border: 'none',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                                cursor: 'not-allowed'
                            }}
                        >
                            Out of Stock
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
