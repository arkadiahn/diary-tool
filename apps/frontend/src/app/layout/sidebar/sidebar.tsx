"use client";

import { IconifyIcon } from "@/app/components/common/CustomIcon";
import { Divider, ScrollShadow, cn } from "@nextui-org/react";
import CustomIcon from "@/app/components/common/CustomIcon";
import SidebarItemWrapper from "./sidebarItemWrapper";
import { Session } from "@arkadia/cnauth";
import React, { useState } from "react";

import { AcmeIcon } from "./acme";

import icRoundChevronRight from "@iconify/icons-ic/round-chevron-right";
import AccountHandler from "./accountHandler";
import { usePathname, useRouter } from "next/navigation";


interface SidebarProps {
	items: {
		icon: IconifyIcon;
		label: string;
		href: string;
    }[];
	session: Session | null;
}
export default function Sidebar({ items, session }: SidebarProps) {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();
	const router = useRouter();

	return (
		<aside className="h-full w-20 lg:w-[248px] p-1 z-[100] isolate">
			<div className={cn(
				"h-full border shadow-small rounded-xl flex gap-3 flex-col items-center px-2 py-4 bg-background transition-all duration-1000 ease-in-out",
				{"w-60" : isOpen, "w-full" : !isOpen}
			)}>
				{/* Logo/Name */}
				<div className="relative w-full flex justify-center items-center">
					<SidebarItemWrapper
						forceBreakpoint={isOpen}
						leading={<AcmeIcon size={38} />}
						trailing={<h1 className="text-xl font-bold">OpenSpace</h1>}
					/>
					<div
						className={cn(
							`absolute bg-background rounded-full shadow-sm border top-1/2 -translate-y-1/2 -right-5 cursor-pointer hover:bg-foreground/10 transition-all duration-300 ease-in-out lg:hidden`,
							{ "rotate-180" : isOpen }
						)}
						onClick={() => setIsOpen(!isOpen)}
					>
						<CustomIcon
							className="text-default-500 w-6"
							icon={icRoundChevronRight}
							width={32}
						/>
					</div>
				</div>

				<Divider />

				{/* Items */}
				<div className="flex-1 w-full">
					<ScrollShadow className="h-full w-full flex flex-col items-center gap-1">
						{items.map((item) => (
							<SidebarItemWrapper
								key={item.href}
								onClick={() => router.push(item.href)}
								leading={<CustomIcon className="w-[22px]" icon={item.icon} width={22} />}
								trailing={<h1 className="font-bold">{item.label}</h1>}
								forceBreakpoint={isOpen}
								selected={item.href.length !== 1 ? pathname.startsWith(item.href) : pathname === item.href}
							/>
						))}
					</ScrollShadow>
				</div>

				<Divider />

				{/* Account */}
				<div className="w-full">
					<AccountHandler isOpen={isOpen} session={session}/>
				</div>
			</div>
		</aside>
	)
}
