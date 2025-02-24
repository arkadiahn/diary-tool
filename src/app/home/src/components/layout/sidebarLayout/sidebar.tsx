import type { Session } from "@/auth/models";
import type { IconifyIcon } from "@/components/CustomIcon";
import CustomIcon from "@/components/CustomIcon";
import { Divider, ScrollShadow, cn } from "@heroui/react";
import Footer from "../footer";
import AccountHandler from "./accountHandler";
import SidebarItem from "./sidebarItem";

/* ---------------------------------- Icons --------------------------------- */
import solarSidebarMinimalistic from "@iconify/icons-solar/sidebar-minimalistic-linear";

export type SidebarItemProps = {
    icon: IconifyIcon;
    label: string;
    href: string;
};
interface SidebarProps {
    items: SidebarItemProps[];
    adminItems: SidebarItemProps[];
    sidebarLogo: React.ReactNode;
    headerLogo: React.ReactNode;
    session: Session | null;
    children: React.ReactNode;
}
export default function Sidebar({ items, adminItems, sidebarLogo, headerLogo, session, children }: SidebarProps) {
    const admin = session?.user.scopes.includes("mission.admin") || false;

    return (
        <div className="h-dvh max-w-dvw flex flex-col sm:flex-row">
            {/* Header */}
            <header className="sticky top-0 h-[60px] flex items-center gap-3 px-4 py-1 backdrop-blur-lg shadow-md sm:hidden dark:border-b-1 dark:border-white/5">
                <label
                    htmlFor="sidebar-toggle"
                    className="cursor-pointer active:text-foreground/80 active:scale-95 transition-transform duration-100"
                    aria-label="Toggle sidebar"
                >
                    <CustomIcon className="w-[26px]" icon={solarSidebarMinimalistic} width={26} />
                </label>
                {headerLogo}
                <AccountHandler className="ml-auto" forceSmall={true} />
            </header>

            {/* Sidebar Wrapper */}
            <aside
                style={
                    {
                        "--sidebar-item-width-expanded": "220px",
                        "--spacing": "8px",
                    } as React.CSSProperties
                }
                className={cn(
                    "fixed sm:sticky z-[50] top-[60px] sm:top-0 h-[calc(100dvh-60px)] sm:h-dvh w-fit pointer-events-none",
                )}
                // role="navigation"
            >
                <input type="checkbox" id="sidebar-toggle" className="peer hidden" />

                {/* Backdrop */}
                <div
                    className="absolute inset-0 w-dvw bg-black/0 peer-checked:bg-black/15 pointer-events-none sm:hidden transition-colors duration-300"
                    aria-hidden="true"
                />

                {/* Sidebar */}
                <nav className="h-full p-[var(--spacing)] -translate-x-full sm:translate-x-0 peer-checked:translate-x-0 transition-transform duration-300 peer-checked:pointer-events-auto sm:pointer-events-auto">
                    {/* Sidebar Content */}
                    <div className="h-full rounded-large bg-background dark:bg-content1 shadow-small flex flex-col items-center">
                        <div className="hidden sm:flex justify-center items-center p-[var(--spacing)]">
                            {sidebarLogo}
                        </div>

                        <div className="w-full px-[var(--spacing)]">
                            <Divider className="hidden sm:block" />
                        </div>

                        <ScrollShadow className="flex-1 space-y-1 p-[var(--spacing)]" hideScrollBar={true}>
                            {items.map((item) => (
                                <SidebarItem
                                    key={item.href}
                                    href={item.href}
                                    leading={<CustomIcon className="w-[19px]" icon={item.icon} width={19} />}
                                    label={item.label}
                                />
                            ))}
                            {admin && adminItems.length > 0 && (
                                <>
                                    <div className="" />
                                    <div className="w-full flex items-center gap-2 px-2 sm:px-0 lg:px-2">
                                        <Divider className="flex-1" />
                                        <span className="text-sm sm:text-xs lg:text-sm font-medium">Admin</span>
                                        <Divider className="flex-1" />
                                    </div>
                                </>
                            )}
                            {admin &&
                                adminItems.map((item) => (
                                    <SidebarItem
                                        key={item.href}
                                        href={item.href}
                                        leading={<CustomIcon className="w-[19px]" icon={item.icon} width={19} />}
                                        label={item.label}
                                        admin={true}
                                    />
                                ))}
                        </ScrollShadow>

                        <div className="w-full px-[var(--spacing)]">
                            <Divider className="hidden sm:block" />
                        </div>

                        <div className="w-full p-[var(--spacing)] hidden sm:block">
                            <AccountHandler />
                        </div>
                    </div>
                </nav>
            </aside>

            <div className="h-[calc(100dvh-60px)] sm:h-dvh flex-1 flex flex-col">
                <main className="flex-1 overflow-hidden">{children}</main>
                {/* <Footer /> */}
            </div>
        </div>
    );
}
