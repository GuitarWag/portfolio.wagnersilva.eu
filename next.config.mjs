/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        unoptimized: true,
    },
    turbopack: {},
    // External packages for serverless/edge runtime compatibility
    serverExternalPackages: ['onnxruntime-node', 'sharp'],
    // Optimize bundle size by excluding unnecessary ONNX binaries
    outputFileTracingExcludes: {
        '/api/generate-voice': [
            // Keep only Linux x64 binaries for production, exclude Windows/macOS
            'node_modules/onnxruntime-node/bin/napi-v3/darwin/**',
            'node_modules/onnxruntime-node/bin/napi-v3/win32/**',
        ],
    },
    webpack: (config) => {
        config.resolve.fallback = { fs: false, path: false };
        return config;
    },
}

export default nextConfig
