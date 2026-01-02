'use server';

import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createProduct(formData: FormData) {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: 'Unauthorized' };
    }

    // Extract Data
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const stock = parseInt(formData.get('stock') as string);
    const category_name = formData.get('category_name') as string;
    const manufacturing_date = formData.get('manufacturing_date') as string;
    const expiry_date = formData.get('expiry_date') as string;
    const imageFile = formData.get('image') as File;

    let image_url = null;

    // Handle Image Upload
    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`; // Ensure folder structure support if needed, or just filename

        // Use adminClient for storage upload to ensure permission if RLS is tricky (though we set policies)
        const { error: uploadError } = await adminClient
            .storage
            .from('product-images')
            .upload(fileName, imageFile);

        if (uploadError) {
            console.error('Upload Error:', uploadError);
            return { error: 'Image upload failed' };
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
            manufacturing_date: manufacturing_date || null,
            expiry_date: expiry_date || null,
            image_url,
            is_active: true
        });

    if (insertError) {
        console.error('Insert Error:', insertError);
        return { error: 'Failed to create product' };
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
