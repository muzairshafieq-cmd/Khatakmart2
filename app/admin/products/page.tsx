import { adminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import { deleteProduct, toggleProductStatus } from './actions';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
    const { data: products } = await adminClient
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Products</h1>
                <Link
                    href="/admin/products/new"
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'var(--primary)',
                        color: 'white',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontWeight: 'bold'
                    }}
                >
                    Add New Product
                </Link>
            </div>

            <div style={{ overflowX: 'auto', background: 'white', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead>
                        <tr style={{ background: 'var(--secondary)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Name</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Category</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Price</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Stock</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Status</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(products || []).map((product) => (
                            <tr key={product.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 'bold' }}>{product.name}</div>
                                    {product.expiry_date && (
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>Exp: {product.expiry_date}</div>
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '99px',
                                        background: '#e5e7eb',
                                        fontSize: '0.8rem'
                                    }}>
                                        {product.category_name}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>PKR {product.price}</td>
                                <td style={{ padding: '1rem' }}>{product.stock}</td>
                                <td style={{ padding: '1rem' }}>
                                    <form action={async (formData) => {
                                        'use server'
                                        await toggleProductStatus(formData)
                                    }}>
                                        <input type="hidden" name="id" value={product.id} />
                                        <input type="hidden" name="currentStatus" value={String(product.is_active)} />
                                        <button
                                            type="submit"
                                            style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                background: product.is_active ? '#dcfce7' : '#fee2e2',
                                                color: product.is_active ? '#166534' : '#991b1b',
                                                fontWeight: 'bold',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            {product.is_active ? 'Active' : 'Inactive'}
                                        </button>
                                    </form>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <form action={async (formData) => {
                                            'use server'
                                            await deleteProduct(formData)
                                        }} onSubmit={(e) => { if (!confirm('Are you sure?')) e.preventDefault() }}>
                                            <input type="hidden" name="id" value={product.id} />
                                            <button
                                                type="submit"
                                                style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                Delete
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!products || products.length === 0) && (
                            <tr>
                                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
