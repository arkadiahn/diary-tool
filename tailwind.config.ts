import path from "node:path";
import { heroui } from "@heroui/react";
import scrollbar from "tailwind-scrollbar";
import type { Config } from "tailwindcss";

export default {
    content: [
        // Components
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        // App
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        // @heroui
        path.join(require.resolve("@heroui/theme"), "../../dist/**/*.{js,ts,jsx,tsx}"),
    ],
    theme: {
        extend: {
            animation: {
                wiggle: "wiggle 1.5s ease-in-out",
                cursor: "blink 1s step-end infinite",
                flip: "flip 4s ease-in-out",
            },
            keyframes: {
                wiggle: {
                    "0%, 100%": { transform: "rotate(-3deg)" },
                    "50%": { transform: "rotate(3deg)" },
                },
                blink: {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0" },
                },
                flip: {
                    "0%, 100%": { transform: "rotateY(0deg)" },
                    "50%": { transform: "rotateY(180deg)" },
                },
            },
        },
    },
    darkMode: ["class"],
    plugins: [
        heroui({
            prefix: "ui",
            themes: {
                dark: {
                    colors: {
                        background: "#121212",
                    },
                },
            },
            layout: {
                radius: {
                    small: "0.20rem",
                    medium: "0.35rem",
                    large: "0.55rem",
                },
            },
        }),
        scrollbar({}),
    ],
} satisfies Config;
