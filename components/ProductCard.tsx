import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';

interface Product {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    stock: number;
    category: string;
    unit: string;
}

export default function ProductCard({ product }: { product: Product }) {
    return (
        <div style={{
            background: 'white',
            border: '1px solid #f3f4f6',
            borderRadius: '16px',
            overflow: 'hidden',
            transition: 'transform 0.2s, box-shadow 0.2s',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
            <Link href={`/products/${product.id}`} style={{ display: 'block', position: 'relative', paddingTop: '75%' /* 4:3 Aspect Ratio */ }}>
                <Image
                    src={product.image_url || '/placeholder.png'}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                />
                {product.stock <= 0 ? (
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: '#ef4444',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '99px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        Out of Stock
                    </div>
                ) : product.stock <= 5 ? (
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: '#f59e0b',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '99px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        Low Stock: {product.stock}
                    </div>
                ) : (
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: '#10b981',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '99px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        In Stock ({product.stock})
                    </div>
                )}
            </Link>

            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                    fontSize: '0.75rem',
                    color: '#059669',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                    letterSpacing: '0.05em'
                }}>
                    {product.category || 'Grocery'}
                </div>

                <Link href={`/products/${product.id}`} style={{
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '0.5rem',
                    textDecoration: 'none',
                    flex: 1
                }}>
                    {product.name}
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>
                            PKR {product.price}
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            per {product.unit || 'unit'}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: product.stock > 0 ? '#059669' : '#dc2626', fontWeight: '500', marginTop: '0.25rem' }}>
                            {product.stock > 0 ? `${product.stock} items left` : 'Unavailable'}
                        </span>
                    </div>

                    <AddToCartButton product={product} />
                </div>
            </div>
        </div>
    );
}
