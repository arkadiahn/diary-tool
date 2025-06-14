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
    reactStrictMode: true,
    devIndicators: {
        buildActivityPosition: "top-right",
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
};

export default nextConfig;
