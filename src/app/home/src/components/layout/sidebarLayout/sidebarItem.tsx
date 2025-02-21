"use client";

import { Button, cn } from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";

interface SidebarItemProps {
    leading: React.ReactNode;
    label?: string;
    href?: string;
    trailing?: React.ReactNode;
    selected?: boolean;
    onPress?: () => void;
    className?: string;
    admin?: boolean;
}

const SidebarItem = ({
    leading,
    label,
    href,
    trailing,
    selected: selectedProp,
    onPress,
    className,
    admin,
    ...props
}: SidebarItemProps) => {
    const pathname = usePathname();

    const Component = href || onPress ? Button : "div";
    const selected =
        selectedProp || (href !== undefined && (href.length !== 1 ? pathname.startsWith(href) : pathname === href));

    return (
        <Component
            as={href ? Link : undefined}
            href={href}
            className={cn(
                "flex items-center subpixel-antialiased",
                "h-fit min-w-0 flex-row sm:flex-col lg:flex-row justify-start sm:justify-center lg:justify-start w-[var(--sidebar-item-width-expanded)] sm:w-full lg:w-[var(--sidebar-item-width-expanded)]",
                className,
                { "gap-2 sm:gap-1 lg:gap-2 p-2 text-default-500 hover:text-foreground": Component === Button }, // if button
                { "bg-default/40 text-foreground/80": selected }, // if selected
                { "px-1 py-1": Component === "div" }, // if div
            )}
            variant="light"
            {...props}
            {...(Component !== Button && { onClick: onPress })}
            {...(Component === Button && { disableRipple: true, onPress: onPress })}
        >
            {leading}
            {label && <p className="truncate font-medium text-sm sm:text-[12px] lg:text-sm">{label}</p>}
            {trailing && <div className="items-center justify-center flex sm:hidden lg:flex">{trailing}</div>}
        </Component>
    );
};

export default SidebarItem;
