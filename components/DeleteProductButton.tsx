'use client';

import { Trash2 } from 'lucide-react';
import { deleteProduct } from '@/app/admin/(protected)/products/actions';

export default function DeleteProductButton({ id }: { id: string }) {

    async function handleSubmit() {
        if (!confirm('Are you sure? This cannot be undone.')) {
            return;
        }

        // formData is created automatically if we use form action, but here we can just call the server action
        // However, standard way with forms:
        const formData = new FormData();
        formData.append('id', id);

        await deleteProduct(formData);
    }

    return (
        <button
            onClick={handleSubmit} // Using onClick is fine in Client Component
            title="Delete Product"
            style={{
                color: '#ef4444',
                background: '#fef2f2',
                border: '1px solid #fee2e2',
                borderRadius: '6px',
                padding: '0.4rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Trash2 size={16} />
        </button>
    );
}
