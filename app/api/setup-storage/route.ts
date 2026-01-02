import { NextResponse } from 'next/server';
import { adminClient } from '@/lib/supabase/admin';

export async function GET() {
    try {
        const buckets = ['product-images', 'payment-proofs'];
        const results = [];

        for (const bucket of buckets) {
            // 1. Try to get the bucket to see if it exists
            const { data: existing, error: getError } = await adminClient
                .storage
                .getBucket(bucket);

            if (existing) {
                results.push(`Bucket '${bucket}' already exists.`);
                continue;
            }

            // 2. Create if not exists
            const { data, error } = await adminClient
                .storage
                .createBucket(bucket, {
                    public: true,
                    fileSizeLimit: 5242880, // 5MB
                    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/jpg']
                });

            if (error) {
                console.error(`Error creating bucket ${bucket}:`, error);
                results.push(`Failed to create '${bucket}': ${error.message}`);
            } else {
                results.push(`Successfully created bucket '${bucket}'.`);
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Storage setup completed',
            details: results
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
