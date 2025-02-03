"use client";

import { useEffect, useState } from "react";
import CustomIcon from "@/components/CustomIcon";
import SidebarItem from "../sidebarItem";
import { useTheme } from "next-themes";

/* ---------------------------------- Icons --------------------------------- */
import solarMoonLinear from "@iconify/icons-solar/moon-linear";
import solarSunLinear from "@iconify/icons-solar/sun-linear";


export default function ThemeSwitch() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleThemeChange = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	if (!mounted) {
		return null;
	}

	return (
		<SidebarItem
			onClick={handleThemeChange}
			leading={
				<CustomIcon 
					className="w-[22px]" 
					icon={theme === "light" ? solarMoonLinear : solarSunLinear} 
					width={22}
				/>
			}
			label={theme === "light" ? "Dark" : "Light"}
		/>
	);
}
