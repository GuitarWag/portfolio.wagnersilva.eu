/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
    },
    turbopack: {},
    webpack: (config) => {
        config.resolve.fallback = { fs: false, path: false };
        return config;
    },
}

export default nextConfig
