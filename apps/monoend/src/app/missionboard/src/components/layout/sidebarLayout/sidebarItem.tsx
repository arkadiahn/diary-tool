"use client";

import { Button, cn } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import Link from "next/link";


interface SidebarItemProps {
	leading: React.ReactNode;
	label?: string;
	href?: string;
	trailing?: React.ReactNode;
	selected?: boolean;
	onClick?: () => void;
	className?: string;
	admin?: boolean;
}
export default function SidebarItem({ leading, label, href, trailing, selected: selectedProp, onClick, className, admin }: SidebarItemProps) {
	const pathname = usePathname();
	
	const Component = href || onClick ? Button : "div";
	const selected = selectedProp || (href != undefined && (
		href.length !== 1 ? pathname.startsWith(href) : pathname === href
	));

	return (
		<Component
			as={href ? Link : undefined}
			href={href}
			className={cn(
				"flex items-center",
				"h-fit min-w-0 flex-row sm:flex-col lg:flex-row justify-start sm:justify-center lg:justify-start w-[var(--sidebar-item-width-expanded)] sm:w-full lg:w-[var(--sidebar-item-width-expanded)]",
				className,
				{ "gap-2 sm:gap-1 lg:gap-2 p-2 text-default-500 hover:text-foreground" : Component === Button }, // if button
				{ "bg-default/40 text-foreground/80" : selected }, // if selected
				{ "px-1 py-1" : Component === "div" }, // if div
				{ "text-orange-500 hover:text-orange-500" : admin } // if admin
			)}
			variant="light"
			{...(Component !== Button && { onClick: onClick })}
			{...(Component === Button && { disableRipple: true, onPress: onClick })}
		>
			{leading}
			<p className="truncate font-bold text-sm sm:text-[12px] lg:text-sm">{label}</p>
			<div className="items-center justify-center flex sm:hidden lg:flex">
				{trailing}
			</div>
		</Component>
	)
}
