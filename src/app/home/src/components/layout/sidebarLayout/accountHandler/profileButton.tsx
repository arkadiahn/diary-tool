"use client";

import { signOut } from "@/auth/client";
import type { Session } from "@/auth/models";
import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import SidebarItem from "../sidebarItem";

import CustomIcon from "@/components/CustomIcon";
import icRoundLogout from "@iconify/icons-ic/round-logout";
import solarLaptopLinear from "@iconify/icons-solar/laptop-linear";
/* ---------------------------------- Icons --------------------------------- */
import solarSettingsOutline from "@iconify/icons-solar/settings-outline";
import solarUserOutline from "@iconify/icons-solar/user-outline";
import { useTheme } from "next-themes";

interface ProfileButtonProps {
    className?: string;
    session: Session;
    forceSmall?: boolean;
}
export default function ProfileButton({ session, className, forceSmall }: ProfileButtonProps) {
    const { theme, setTheme } = useTheme();
    const _router = useRouter();

    return (
        <Dropdown placement={forceSmall ? "bottom-end" : "right-end"}>
            <DropdownTrigger>
                <SidebarItem
                    onPress={() => {}}
                    className={clsx("!p-2", className)}
                    leading={<Avatar size="sm" isBordered={true} src={session.user.picture} alt={session.user.name} />}
                    trailing={
                        !forceSmall && (
                            <div className="inline-flex flex-col items-start ml-1 subpixel-antialiased">
                                <span className="text-small text-inherit">{session.user.name}</span>
                                <span className="text-tiny text-foreground-400">{session.user.email}</span>
                            </div>
                        )
                    }
                />
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
                <DropdownItem
                    key="account"
                    onPress={() => window.open(`${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/account`, "_blank")}
                    startContent={<CustomIcon icon={solarUserOutline} width={19} />}
                >
                    Account
                </DropdownItem>
                <DropdownItem key="settings" startContent={<CustomIcon icon={solarSettingsOutline} width={19} />}>
                    Settings
                </DropdownItem>
                <DropdownItem
                    key="theme"
                    isReadOnly={true}
                    showDivider={true}
                    className="cursor-default h-8"
                    startContent={<CustomIcon icon={solarLaptopLinear} width={19} />}
                    endContent={
                        <select
                            className="z-10 outline-none w-16 py-0.5 rounded-medium text-tiny group-data-[hover=true]:border-default-500 border-small border-default-300 dark:border-default-200 bg-transparent text-default-500"
                            id="theme"
                            name="theme"
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                        >
                            <option value="system">System</option>
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                        </select>
                    }
                >
                    Theme
                </DropdownItem>
                <DropdownItem
                    key="logout"
                    onPress={() => signOut()}
                    className="text-red-500 hover:text-red-500"
                    startContent={<CustomIcon icon={icRoundLogout} width={19} />}
                >
                    Logout
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}
