import ProductForm from '@/components/ProductForm';

export default function NewProductPage() {
    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Add New Product</h1>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <ProductForm />
            </div>
        </div>
    );
}
