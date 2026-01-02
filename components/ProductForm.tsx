'use client';

import { useState } from 'react';
import { createProduct } from '@/app/admin/(protected)/products/actions';

export default function ProductForm() {
    const [loading, setLoading] = useState(false);

    // CATEGORY RULES: EXACT MATCH
    const CATEGORIES = [
        'Dry groceries',
        'Frozen foods',
        'Packaged milk',
        'Smoking Items'
    ];

    async function handleSubmit(formData: FormData) {
        console.log('Form submitting...');
        setLoading(true);
        try {
            const result = await createProduct(formData);
            console.log('Result:', result);
            if (result?.error) {
                alert(result.error);
                setLoading(false);
            }
        } catch (e) {
            console.error('Submission error:', e);
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

            {/* Featured Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                <input
                    type="checkbox"
                    name="is_featured"
                    id="is_featured"
                    style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                />
                <label htmlFor="is_featured" style={{ cursor: 'pointer', fontWeight: 'bold', color: '#334155' }}>
                    Mark as Featured Product
                </label>
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
