import { adminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
    // 1. Create Categories if not exist (handled by check constraints, but ensure consistency)
    // Actually schema has fixed categories.

    // 2. Insert Products
    const products = [
        {
            name: 'Daal Masoor (1kg)',
            description: 'Premium quality washed lentil. High in protein.',
            price: 320,
            stock: 50,
            category: 'Dry groceries',
            image_url: 'https://images.unsplash.com/photo-1585996659613-7227d819e99c?q=80&w=600&auto=format&fit=crop', // Placeholder
            unit: 'kg',
            is_active: true
        },
        {
            name: 'Super Basmati Rice (5kg)',
            description: 'Aged aromatic basmati rice from Punjab.',
            price: 1800,
            stock: 20,
            category: 'Dry groceries',
            image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop',
            unit: '5kg',
            is_active: true
        },
        {
            name: 'K&Ns Burger Patties',
            description: 'Frozen chicken burger patties. 12 pcs.',
            price: 890,
            stock: 15,
            category: 'Frozen foods',
            image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop',
            unit: 'pack',
            is_active: true
        },
        {
            name: 'Olpers Milk (1L)',
            description: 'Full cream box milk.',
            price: 280,
            stock: 100,
            category: 'Packaged milk',
            image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=600&auto=format&fit=crop',
            unit: 'liter',
            is_active: true
        }
    ];

    const { data, error } = await adminClient
        .from('products')
        .upsert(products, { onConflict: 'name' }) // simplistic
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: data.length });
}
