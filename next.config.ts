import type { NextConfig } from 'next';

import packageJson from './package.json' with { type: 'json' };

const nextConfig: NextConfig = {
    reactStrictMode: true,
    pageExtensions: ['ts', 'tsx'],
    logging: {
        fetches: {
            fullUrl: true
        }
    },
    typedRoutes: true,
    typescript: {
        ignoreBuildErrors: true
    },
    output: 'standalone',
    images: {
        formats: ['image/avif', 'image/webp'],
        dangerouslyAllowSVG: true,
        unoptimized: process.env.NODE_ENV === 'development', // dev=fast, prod=optimized
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        remotePatterns: [
            { protocol: 'http', hostname: 'localhost', port: '9000' },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '3000',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: '**'
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '9000',
                pathname: '/**'
            }
        ]
    },
    env: {
        NEXT_PUBLIC_VERSION: packageJson.version
    },

    productionBrowserSourceMaps: true,
    reactCompiler: true,
    cacheComponents: true,

    experimental: {
        serverComponentsHmrCache: true,
        inlineCss: true,

        turbopackFileSystemCacheForDev: true,
        turbopackFileSystemCacheForBuild: true,
        staleTimes: {
            dynamic: 30, // 30 seconds for dynamic pages
            static: 300 // 5 minutes for static pages
        },
        optimizePackageImports: ['sonner', 'recharts', 'framer-motion', 'react-icons', 'date-fns', 'lucide-react']
    },
    turbopack: {
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js'
            }
        },
        resolveAlias: {
            underscore: 'lodash'
        },
        resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json']
    },
    allowedDevOrigins: ['192.168.137.2'],
    headers: async () => {
        return [
            {
                source: '/imgs/(.*)',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*'
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET, OPTIONS'
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'Content-Type, Authorization'
                    }
                ]
            }
        ];
    }
};

export default nextConfig;
