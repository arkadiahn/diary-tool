import fs from "fs";
import path from "path";
import type { NextConfig } from "next";

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
        NEXT_DEFAULT_LOCALE: "en-US",
    },
};

export default nextConfig;
