/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
        // Allow unoptimized images if quotas are hit
        unoptimized: true,
    },
};

module.exports = nextConfig;
