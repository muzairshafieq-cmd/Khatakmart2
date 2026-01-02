import { createClient } from '@/lib/supabase/server';
import AddToCartButton from '@/components/AddToCartButton';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: product } = await supabase.from('products').select('name').eq('id', id).single();
    return { title: product?.name || 'Product Not Found' };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (!product) return notFound();

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                {/* Image */}
                <div style={{ position: 'relative', height: '400px', background: '#f9fafb', borderRadius: '8px', overflow: 'hidden' }}>
                    {product.image_url ? (
                        <Image src={product.image_url} alt={product.name} fill style={{ objectFit: 'contain' }} />
                    ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Image</div>
                    )}
                </div>

                {/* Info */}
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>{product.name}</h1>
                    <p style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                        PKR {product.price}
                    </p>

                    <div style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
                        <p style={{ marginBottom: '0.5rem' }}><strong>Category:</strong> {product.category_name}</p>
                        {product.manufacturing_date && <p style={{ marginBottom: '0.5rem' }}><strong>Mfg:</strong> {product.manufacturing_date}</p>}
                        {product.expiry_date && <p style={{ marginBottom: '0.5rem' }}><strong>Exp:</strong> {product.expiry_date}</p>}
                        <p><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} units` : 'Out of stock'}</p>
                    </div>

                    <p style={{ lineHeight: '1.6', marginBottom: '2rem', color: '#4b5563' }}>
                        {product.description || 'No description available.'}
                    </p>

                    {product.stock > 0 ? (
                        <AddToCartButton product={product} />
                    ) : (
                        <button disabled style={{ width: '100%', padding: '0.75rem', background: '#ccc', border: 'none', cursor: 'not-allowed' }}>
                            Out of Stock
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
