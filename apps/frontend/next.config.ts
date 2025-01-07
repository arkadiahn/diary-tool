import type { NextConfig } from "next";
import path from "node:path";
import fs from "node:fs";

const nextConfig: NextConfig = {
    env: {
        /* ------------------------------- i18n setup ------------------------------- */
        NEXT_PUBLIC_LOCALES: (() => {
            const translationsPath = path.join(__dirname, "src/translations");
            if (fs.existsSync(translationsPath)) {
                return fs
                    .readdirSync(translationsPath)
                    .filter((file) => file.endsWith(".ts"))
                    .map((file) => path.basename(file, ".ts"))
                    .join(",");
            }
            return "";
        })(),
        NEXT_DEFAULT_LOCALE: "de-DE",
    },
	devIndicators: {
		buildActivityPosition: "top-right"
	},
	// images: {
	// 	remotePatterns: [
	// 		{
	// 			protocol: "https",
	// 			hostname: "avatars.githubusercontent.com"
	// 		}
	// 	]
	// }
};

export default nextConfig;
