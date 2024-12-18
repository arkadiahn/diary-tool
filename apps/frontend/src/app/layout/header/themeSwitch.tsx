"use client";

import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */
export default function ThemeSwitch() {
    const { theme, setTheme } = useTheme();

    const icons = {
        light: "ic:round-wb-sunny",
        dark: "ic:round-mode-night",
        system: "ic:twotone-computer",
    };

    return (
        <button
            type="button"
            className="hover:opacity-80 transition-opacity"
            onClick={() => {
                if (theme === "light") setTheme("dark");
                else if (theme === "dark") setTheme("system");
                else setTheme("light");
            }}
        >
            <Icon
                icon={icons[theme as keyof typeof icons]}
                className="size-7"
            />
        </button>
    );
}
