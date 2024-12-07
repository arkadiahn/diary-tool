import { nextui } from "@nextui-org/react";
import scrollbar from "tailwind-scrollbar";
import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
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
    darkMode: "class",
    plugins: [nextui(), scrollbar({})],
} satisfies Config;
