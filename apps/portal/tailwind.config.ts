import { nextui } from "@nextui-org/theme";
import type { Config } from "tailwindcss";
import path from "node:path";


export default {
    content: [
        // Components
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        // App
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        // @nextui-org
        path.join(
            require.resolve("@nextui-org/theme"),
            "../../dist/**/*.{js,ts,jsx,tsx}",
        ),
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
        },
    },
    darkMode: ["class"],
    plugins: [nextui()],
} satisfies Config;
