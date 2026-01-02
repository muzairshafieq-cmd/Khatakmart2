import Link from 'next/link';
import { adminClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ id?: string }>;
}) {
    const params = await searchParams;
    const id = params.id;

    if (!id) return notFound();

    // Fetch Order
    const { data: order } = await adminClient
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

    if (!order) return notFound();

    // Fetch Items mainly for the message
    const { data: items } = await adminClient
        .from('order_items')
        .select('quantity, price, products(name)')
        .eq('order_id', id);

    // Construct WhatsApp Message
    const itemsList = items?.map((item: any) =>
        `- ${item.products?.name} (x${item.quantity})`
    ).join('%0A'); // %0A is newline

    const message = `*New Order: ${id?.slice(0, 8)}*${'%0A'}
*Customer:* ${order.customer_name}
*Phone:* ${order.customer_phone}
*Address:* ${order.customer_address}, ${order.customer_city}${'%0A'}
*Items:*
${itemsList}${'%0A'}
*Total:* PKR ${order.total}
*Payment:* ${order.payment_method.toUpperCase()} (${order.payment_status})${'%0A'}
Please confirm my order.`;

    const whatsappUrl = `https://wa.me/923155770026?text=${message}`;

    return (
        <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '2rem' }}>

            <div style={{
                width: '80px',
                height: '80px',
                background: '#dcfce7',
                color: '#166534',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                margin: '0 auto 2rem auto'
            }}>
                ✓
            </div>

            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Order Placed!</h1>

            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
                Thank you, <strong>{order.customer_name}</strong>. Your order ID is <strong>{order.id.slice(0, 8)}</strong>.
            </p>

            <div style={{
                background: '#fff',
                border: '2px solid #25D366',
                padding: '2rem',
                borderRadius: '12px',
                marginBottom: '2rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
                    Final Step: Confirm on WhatsApp
                </h3>
                <p style={{ marginBottom: '2rem', color: '#4b5563' }}>
                    Please send your order details to our WhatsApp to finalize processing and speed up delivery.
                </p>

                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '1rem 2rem',
                        background: '#25D366',
                        color: 'white',
                        borderRadius: '99px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        transition: 'transform 0.2s'
                    }}
                >
                    <span>Send to WhatsApp</span>
                    <span>→</span>
                </a>
            </div>

            <Link href="/" style={{ textDecoration: 'underline', color: 'var(--primary)', fontWeight: 'bold' }}>
                Return to Home
            </Link>
        </div>
    );
}
