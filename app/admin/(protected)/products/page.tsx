import { adminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import { deleteProduct, toggleProductStatus } from './actions';
import { Plus } from 'lucide-react';
import DeleteProductButton from '@/components/DeleteProductButton';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
    const { data: products } = await adminClient
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: '#1e293b' }}>Products</h1>
                <Link
                    href="/admin/products/new"
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: '#059669',
                        color: 'white',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.2)'
                    }}
                >
                    <Plus size={18} /> Add New
                </Link>
            </div>

            <div style={{
                overflowX: 'auto',
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>Category</th>
                            <th style={thStyle}>Price (PKR)</th>
                            <th style={thStyle}>Stock</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(products || []).map((product) => (
                            <tr key={product.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.1s' }} className="hover:bg-slate-50">
                                <td style={tdStyle}>
                                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{product.name}</div>
                                    {product.expiry_date && (
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Exp: {product.expiry_date}</div>
                                    )}
                                </td>
                                <td style={tdStyle}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '99px',
                                        background: '#f1f5f9',
                                        color: '#475569',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        {product.category_name}
                                    </span>
                                </td>
                                <td style={{ ...tdStyle, fontWeight: 'bold' }}>{product.price}</td>
                                <td style={{ ...tdStyle, color: product.stock < 5 ? '#ef4444' : 'inherit' }}>{product.stock}</td>
                                <td style={tdStyle}>
                                    <form action={async (formData) => {
                                        'use server'
                                        await toggleProductStatus(formData)
                                    }}>
                                        <input type="hidden" name="id" value={product.id} />
                                        <input type="hidden" name="currentStatus" value={String(product.is_active)} />
                                        <button
                                            type="submit"
                                            style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '99px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                background: product.is_active ? '#dcfce7' : '#fee2e2',
                                                color: product.is_active ? '#15803d' : '#991b1b',
                                                fontWeight: '600',
                                                fontSize: '0.75rem',
                                                transition: 'opacity 0.2s'
                                            }}
                                        >
                                            {product.is_active ? 'Active' : 'Inactive'}
                                        </button>
                                    </form>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <DeleteProductButton id={product.id} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!products || products.length === 0) && (
                            <tr>
                                <td colSpan={6} style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
                                    <div style={{ marginBottom: '1rem' }}>📦</div>
                                    No products found in the database.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const thStyle = {
    padding: '1rem 1.5rem',
    textAlign: 'left' as const,
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em'
};

const tdStyle = {
    padding: '1rem 1.5rem',
    fontSize: '0.9rem',
    color: '#334155'
};
