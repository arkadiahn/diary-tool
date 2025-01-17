import { Divider, ScrollShadow, cn } from "@nextui-org/react";
import { IconifyIcon } from "@/components/CustomIcon";
import CustomIcon from "@/components/CustomIcon";
import AccountHandler from "./accountHandler";
import { Session } from "@arkadia/cnauth";
import SidebarItem from "./sidebarItem";
import Footer from "../footer";

/* ---------------------------------- Icons --------------------------------- */
import solarSidebarMinimalistic from "@iconify/icons-solar/sidebar-minimalistic-linear";


export type SidebarItemProps = {
	icon: IconifyIcon;
	label: string;
	href: string;
}
interface SidebarProps {
	items: SidebarItemProps[];
	adminItems: SidebarItemProps[];
	logoItem: React.ReactNode;
	session: Session | null;
	children: React.ReactNode;
}
export default function Sidebar({ items, adminItems, logoItem, session, children }: SidebarProps) {
	const admin = session?.user.scopes.includes("admin") || false;

	return (
		<div className="h-dvh max-w-dvw flex flex-col sm:flex-row">

			{/* Header */}
			<header className="sticky top-0 h-[60px] flex items-center justify-between px-4 py-1 bg-background shadow-md sm:hidden" role="banner">
				<label
					htmlFor="sidebar-toggle"
					className="cursor-pointer active:text-foreground/80 active:scale-95 transition-transform duration-100"
					aria-label="Toggle sidebar"
				>
					<CustomIcon className="w-[26px]" icon={solarSidebarMinimalistic} width={26} />
				</label>
				{logoItem}
			</header>

			{/* Sidebar Wrapper */}
			<aside
				style={{
					"--sidebar-item-width-expanded": "220px",
					"--spacing": "8px"
				} as React.CSSProperties}
				className={cn(
					"fixed sm:sticky z-[100] top-[60px] sm:top-0 h-[calc(100dvh-60px)] sm:h-dvh w-fit"
				)}
				role="navigation"
			>
				<input 
					type="checkbox" 
					id="sidebar-toggle"
					className="peer hidden" 
					aria-hidden="true" 
				/>

				{/* Backdrop */}
				<div 
					className="absolute inset-0 w-dvw bg-black/0 peer-checked:bg-black/15 pointer-events-none peer-checked:pointer-events-auto sm:hidden transition-colors duration-300"
					aria-hidden="true"
				/>

				{/* Sidebar */}
				<nav className="h-full p-[var(--spacing)] -translate-x-full sm:translate-x-0 peer-checked:translate-x-0 transition-transform duration-300">

					{/* Sidebar Content */}
					<div className="h-full rounded-xl bg-background shadow-small flex flex-col items-center gap-[var(--spacing)] p-[var(--spacing)]">

						<div className="hidden sm:flex justify-center items-center">
							{logoItem}
						</div>

						<Divider className="hidden sm:block" />

						<ScrollShadow className="flex-1 space-y-1" hideScrollBar>
							{items.map((item) => (
								<SidebarItem
									key={item.href}
									href={item.href}
									leading={<CustomIcon className="w-[22px]" icon={item.icon} width={22} />}
									label={item.label}
								/>
							))}
							{admin && adminItems.length > 0 && (
								<>
									<div className=""/>
									<div className="w-full flex items-center gap-2 px-2 sm:px-0 lg:px-2">
										<Divider className="flex-1" />
										<span className="text-sm sm:text-xs lg:text-sm font-bold">Admin</span>
										<Divider className="flex-1" />
									</div>
								</>
							)}
							{admin && adminItems.map((item) => (
								<SidebarItem
									key={item.href}
									href={item.href}
									leading={<CustomIcon className="w-[22px]" icon={item.icon} width={22} />}
									label={item.label}
									admin
								/>
							))}
						</ScrollShadow>

						<Divider />

						<div className="w-full">
							<AccountHandler
								session={session}
							/>
						</div>

					</div>

				</nav>

			</aside>

			<div className="h-[calc(100dvh-60px)] sm:h-dvh flex-1 flex flex-col">
				<main className="flex-1 overflow-hidden" role="main">
					{children}
				</main>
				<Footer />
			</div>
		</div>
	)
}
