'use server';

import { adminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(formData: FormData) {
    const id = formData.get('id') as string;
    const status = formData.get('status') as string;

    const { error } = await adminClient
        .from('orders')
        .update({ status })
        .eq('id', id);

    if (error) {
        console.error('Status Update Error:', error);
        return { error: 'Failed to update status' };
    }

    revalidatePath(`/admin/orders/${id}`);
}

export async function updateWhatsAppRef(formData: FormData) {
    const id = formData.get('id') as string;
    const whatsapp_ref = formData.get('whatsapp_ref') as string;

    const { error } = await adminClient
        .from('orders')
        .update({ whatsapp_ref })
        .eq('id', id);

    if (error) {
        console.error('WhatsApp Ref Update Error:', error);
        return { error: 'Failed to update reference' };
    }

    revalidatePath(`/admin/orders/${id}`);
}

export async function verifyPayment(formData: FormData) {
    const id = formData.get('id') as string;

    const { error } = await adminClient
        .from('orders')
        .update({
            payment_status: 'verified',
            status: 'processing' // Auto-move to processing if paid
        })
        .eq('id', id);

    if (error) {
        console.error('Payment Verification Error:', error);
        return { error: 'Failed to verify payment' };
    }

    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${id}`);
}
