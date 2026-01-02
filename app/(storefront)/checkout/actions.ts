'use server';

import { adminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';

export async function placeOrder(formData: FormData, cartItems: any[]) {
    const customer_name = formData.get('name') as string;
    const customer_phone = formData.get('phone') as string;
    const customer_address = formData.get('address') as string;
    const customer_city = formData.get('city') as string;
    const payment_method = formData.get('payment_method') as string;
    const payment_proof_file = formData.get('payment_proof') as File;

    if (!cartItems || cartItems.length === 0) {
        return { error: 'Cart is empty' };
    }

    let payment_proof_url = null;

    // Handle Payment Proof Upload (if Easypaisa)
    if (payment_method === 'easypaisa' && payment_proof_file && payment_proof_file.size > 0) {
        const fileExt = payment_proof_file.name.split('.').pop();
        const fileName = `proof_${Date.now()}.${fileExt}`;

        // Upload using adminClient to allow public insert/access if needed or bypass RLS for guest
        const { error: uploadError } = await adminClient
            .storage
            .from('payment-proofs')
            .upload(fileName, payment_proof_file);

        if (uploadError) {
            console.error('Proof Upload Error:', uploadError);
            return { error: 'Failed to upload payment proof' };
        }

        const { data: { publicUrl } } = adminClient
            .storage
            .from('payment-proofs')
            .getPublicUrl(fileName);

        payment_proof_url = publicUrl;
    }

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // 1. Create Order
    const { data: order, error: orderError } = await adminClient
        .from('orders')
        .insert({
            customer_name,
            customer_phone,
            customer_address,
            customer_city,
            payment_method,
            payment_proof_url,
            total,
            status: 'pending',
            payment_status: payment_proof_url ? 'pending' : 'pending' // Still pending until verified
            // user_id is null for guest
        })
        .select()
        .single();

    if (orderError) {
        console.error('Order creation failed:', orderError);
        return { error: 'Failed to place order' };
    }

    // 2. Create Order Items
    const orderItemsData = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
    }));

    const { error: itemsError } = await adminClient
        .from('order_items')
        .insert(orderItemsData);

    if (itemsError) {
        console.error('Order items failed:', itemsError);
        // Ideal: rollback order. For now: just log.
        return { error: 'Failed to create order items' };
    }

    redirect(`/checkout/success?id=${order.id}`);
}
