import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import ProductCard from '@/components/ProductCard';
import { adminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import { ArrowRight, Clock, ShieldCheck, Truck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home() {
    // Fetch only active products using adminClient (Bypasses RLS)
    const { data: products } = await adminClient
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    return (
        <div style={{ paddingBottom: '4rem' }}>
            <div className="container">
                <Hero />
            </div>

            {/* Features Section */}
            <section className="section-responsive" style={{ background: '#f0fdf4' }}>
                <div className="container">
                    <div className="features-grid">
                        <FeatureCard
                            icon={<Clock size={32} color="var(--primary)" />}
                            title="30-Min Delivery"
                            desc="Get your groceries delivered to your door in DHA Phase 2 within minutes."
                        />
                        <FeatureCard
                            icon={<ShieldCheck size={32} color="var(--primary)" />}
                            title="Freshness Guarantee"
                            desc="We hand-pick the freshest produce. If you're not satisfied, we refund it."
                        />
                        <FeatureCard
                            icon={<Truck size={32} color="var(--primary)" />}
                            title="Free Shipping"
                            desc="Free delivery on all orders above PKR 2000. No hidden charges."
                        />
                    </div>
                </div>
            </section>

            <div className="container" id="products">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <h2 className="section-title" style={{ margin: 0, textAlign: 'left' }}>
                        Featured Products
                    </h2>
                    <Link href="/products" style={{
                        color: 'var(--primary)',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        View All <ArrowRight size={20} />
                    </Link>
                </div>

                {products && products.length > 0 ? (
                    <ProductGrid>
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </ProductGrid>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '6rem 2rem',
                        color: 'var(--muted)',
                        background: 'var(--secondary)',
                        borderRadius: 'var(--radius)'
                    }}>
                        <p style={{ fontSize: '1.2rem' }}>No products available right now. We are restocking!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            transition: 'transform 0.2s',
        }}>
            <div style={{
                background: '#dcfce7',
                padding: '1rem',
                borderRadius: '50%',
                marginBottom: '1rem'
            }}>
                {icon}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--foreground)' }}>
                {title}
            </h3>
            <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>
                {desc}
            </p>
        </div>
    );
}
