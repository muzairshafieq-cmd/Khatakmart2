'use client';

import { useCart } from '@/context/CartContext';

export default function AddToCartButton({ product }: { product: any }) {
    const { addToCart } = useCart();

    return (
        <button
            onClick={() => {
                addToCart(product);
                alert('Added to cart!');
            }}
            style={{
                width: '100%',
                padding: '0.75rem',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1rem'
            }}
        >
            Add to Cart
        </button>
    );
}
