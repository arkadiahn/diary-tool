import type { NextConfig } from "next";
import envSchema from "./envSchema";

/* -------------------------------------------------------------------------- */
/*                                 Check ENVs                                 */
/* -------------------------------------------------------------------------- */
try {
    envSchema.parse(process.env);
} catch (error) {
    console.error("Missing required environment variables:", error);
    process.exit(1);
}

/* -------------------------------------------------------------------------- */
/*                                 Next Config                                */
/* -------------------------------------------------------------------------- */
const nextConfig: NextConfig = {
    output: "standalone",
    devIndicators: {
        buildActivityPosition: "top-right",
    },
    async rewrites() {
        if (process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && process.env.NEXT_PUBLIC_UMAMI_URL) {
            return [
                {
                    source: "/script.js",
                    destination: `${process.env.NEXT_PUBLIC_UMAMI_URL}/script.js`,
                },
                {
                    source: "/api/send",
                    destination: `${process.env.NEXT_PUBLIC_UMAMI_URL}/api/send`,
                },
            ];
        }
        return [];
    },
    productionBrowserSourceMaps: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "picsum.photos",
            },
        ],
    },
	experimental: {
		serverComponentsHmrCache: false,
	},
};

export default nextConfig;
