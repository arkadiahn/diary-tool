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
	devIndicators: {
		buildActivityPosition: "top-right"
	},
};

export default nextConfig;
