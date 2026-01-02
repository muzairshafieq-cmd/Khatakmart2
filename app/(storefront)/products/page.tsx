import ProductGrid from '@/components/ProductGrid';
import ProductCard from '@/components/ProductCard';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>;
}) {
    const params = await searchParams;
    const category = params.category;

    const supabase = await createClient();

    let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (category) {
        query = query.eq('category_name', category);
    }

    const { data: products } = await query;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                {category ? `${category}` : 'All Products'}
            </h1>

            {/* Category Filter Links */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <FilterLink text="All" href="/products" active={!category} />
                <FilterLink text="Dry groceries" href="/products?category=Dry groceries" active={category === 'Dry groceries'} />
                <FilterLink text="Frozen foods" href="/products?category=Frozen foods" active={category === 'Frozen foods'} />
                <FilterLink text="Packaged milk" href="/products?category=Packaged milk" active={category === 'Packaged milk'} />
            </div>

            {products && products.length > 0 ? (
                <ProductGrid>
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </ProductGrid>
            ) : (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
                    No products found.
                </div>
            )}
        </div>
    );
}

function FilterLink({ text, href, active }: { text: string, href: string, active: boolean }) {
    return (
        <a
            href={href}
            style={{
                padding: '0.5rem 1rem',
                borderRadius: '99px',
                border: active ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: active ? 'var(--primary)' : 'transparent',
                color: active ? 'white' : 'inherit',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '0.9rem'
            }}
        >
            {text}
        </a>
    );
}
