'use client';

import { useState } from 'react';
import { createProduct } from '@/app/admin/products/actions';

export default function ProductForm() {
    const [loading, setLoading] = useState(false);

    // CATEGORY RULES: EXACT MATCH
    const CATEGORIES = [
        'Dry groceries',
        'Frozen foods',
        'Packaged milk'
    ];

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        // We rely on the server action redirect
        const result = await createProduct(formData);
        if (result?.error) {
            alert(result.error);
            setLoading(false);
        }
    }

    return (
        <form action={handleSubmit} style={{ display: 'grid', gap: '1rem', maxWidth: '600px' }}>

            {/* Name */}
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Product Name</label>
                <input name="name" required style={inputStyle} />
            </div>

            {/* Category (Strict Dropdown) */}
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Category</label>
                <select name="category_name" required style={inputStyle}>
                    <option value="">Select Category</option>
                    {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <small style={{ color: '#666' }}>Only allowed categories are listed.</small>
            </div>

            {/* Description */}
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                <textarea name="description" rows={3} style={inputStyle} />
            </div>

            {/* Price & Stock */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Price (PKR)</label>
                    <input name="price" type="number" min="0" step="0.01" required style={inputStyle} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Stock</label>
                    <input name="stock" type="number" min="0" required style={inputStyle} />
                </div>
            </div>

            {/* Dates */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Manufacturing Date</label>
                    <input name="manufacturing_date" type="date" style={inputStyle} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Expiry Date</label>
                    <input name="expiry_date" type="date" style={inputStyle} />
                </div>
            </div>

            {/* Image */}
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Product Image</label>
                <input name="image" type="file" accept="image/*" style={inputStyle} />
            </div>

            <button
                type="submit"
                disabled={loading}
                style={{
                    padding: '0.75rem',
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? 'Creating...' : 'Create Product'}
            </button>

        </form>
    );
}

const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    background: 'var(--input)'
};
