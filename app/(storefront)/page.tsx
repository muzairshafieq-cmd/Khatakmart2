import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import ProductCard from '@/components/ProductCard';
import { createClient } from '@/lib/supabase/client';
import { createClient as createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function Home() {
    const supabase = await createServerClient();

    // Fetch only active products
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    return (
        <div>
            <Hero />

            <div id="products" style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1rem' }}>
                <h2 style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '2rem',
                    borderLeft: '5px solid var(--primary)',
                    paddingLeft: '1rem',
                    color: '#1f2937'
                }}>
                    Featured Products
                </h2>

                {products && products.length > 0 ? (
                    <ProductGrid>
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </ProductGrid>
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
                        <p>No products available right now. Check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
