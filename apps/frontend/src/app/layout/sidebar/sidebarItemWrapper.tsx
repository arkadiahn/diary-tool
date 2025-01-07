import { cn } from "@nextui-org/react";
import React from "react";


interface SidebarItemWrapperProps {
	leading: React.ReactNode;
	trailing: React.ReactNode;
	forceBreakpoint?: boolean;
	centered?: boolean;
	onClick?: () => void;
	selected?: boolean;
	href?: string;
}
export default function SidebarItemWrapper({ leading, trailing, forceBreakpoint, centered, onClick, selected, href }: SidebarItemWrapperProps) {
	const Component = href ? "a" : (onClick ? "button" : "div");
	const button = Component === "button" || Component === "a";
	// @todo implement nextjs link or router idk

	return (
		<Component
			className={cn(
				"font-normal text-small overflow-hidden w-full flex justify-center",
				centered ? "lg:justify-center" : "lg:justify-start",
				"lg:gap-2",
				{ "rounded-medium transition-transform-colors-opacity hover:bg-default/40 cursor-pointer p-2" : button },
				{ "text-default-500 hover:text-foreground" : button },
				forceBreakpoint && (centered ? "justify-center" : "justify-start"),
				forceBreakpoint && "gap-2",
				{ "h-10" : button },
				{ "bg-default/40 text-foreground/80" : selected }
			)}
			onClick={onClick}
			href={href}
		>
			<div className="pointer-events-none">
				{leading}
			</div>
			<div className={cn(
				`max-w-0 opacity-0 lg:max-w-full lg:opacity-100 overflow-hidden items-center transition-opacity duration-300`,
				"flex justify-center pointer-events-none",
				{ "max-w-full opacity-100" : forceBreakpoint }
			)}>
				{trailing}
			</div>
		</Component>
	)
}
