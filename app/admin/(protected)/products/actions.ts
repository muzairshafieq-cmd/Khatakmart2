'use server';

import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createProduct(formData: FormData) {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Create Product Action - User:', user?.id);

    if (!user) {
        console.log('Unauthorized access attempt');
        return { error: 'Unauthorized' };
    }

    // Extract Data
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const stock = parseInt(formData.get('stock') as string);
    const category_name = formData.get('category_name') as string;
    const imageFile = formData.get('image') as File;

    let image_url = null;

    // Handle Image Upload
    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

        // Use adminClient for storage upload
        const { error: uploadError } = await adminClient
            .storage
            .from('product-images')
            .upload(fileName, imageFile, {
                contentType: imageFile.type,
                upsert: false
            });

        if (uploadError) {
            console.error('Upload Error:', uploadError);
            return { error: `Image upload failed: ${uploadError.message}` };
        }

        // Get Public URL
        const { data: { publicUrl } } = adminClient
            .storage
            .from('product-images')
            .getPublicUrl(fileName);

        image_url = publicUrl;
    }

    // Insert to DB
    const { error: insertError } = await adminClient
        .from('products')
        .insert({
            name,
            description,
            price,
            stock,
            category_name,
            image_url,
            is_active: true,
            is_featured: formData.get('is_featured') === 'on'
        });

    if (insertError) {
        console.error('Insert Error:', insertError);
        return { error: `Failed to create product: ${insertError.message}` };
    }

    revalidatePath('/admin/products');
    redirect('/admin/products');
}

export async function deleteProduct(formData: FormData) {
    const id = formData.get('id') as string;

    const { error } = await adminClient
        .from('products')
        .delete()
        .eq('id', id);

    if (error) {
        return { error: 'Failed to delete' };
    }

    revalidatePath('/admin/products');
}

export async function toggleProductStatus(formData: FormData) {
    const id = formData.get('id') as string;
    const currentStatus = formData.get('currentStatus') === 'true';

    const { error } = await adminClient
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', id);

    if (error) {
        return { error: 'Update failed' };
    }

    revalidatePath('/admin/products');
}
