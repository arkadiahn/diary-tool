"use client";

import { signOut } from "@/auth/client";
import type { Session } from "@/auth/models";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User } from "@heroui/react";

import CustomIcon from "@/components/CustomIcon";
import icRoundLogout from "@iconify/icons-ic/round-logout";
import solarLaptopLinear from "@iconify/icons-solar/laptop-linear";
/* ---------------------------------- Icons --------------------------------- */
import solarSettingsOutline from "@iconify/icons-solar/settings-outline";
import solarCalendarOutline from "@iconify/icons-solar/calendar-outline";
import solarUserOutline from "@iconify/icons-solar/user-outline";
import { useTheme } from "next-themes";

interface ProfileButtonProps {
    session: Session;
}
export default function ProfileButton({ session }: ProfileButtonProps) {
    const { theme, setTheme } = useTheme();

    return (
        <Dropdown placement="bottom-end">
            <DropdownTrigger className="p-2 px-3 hover:bg-default-100 rounded-medium">
				<User
					as="button"
					avatarProps={{
						src: session.user.picture,
						alt: session.user.name,
						isBordered: true,
						size: "sm",
					}}
					classNames={{
						description: "hidden sm:block",
						name: "hidden sm:block",
						base: "gap-0 sm:gap-2",
					}}
					isFocusable={true}
					description={session.user.email}
					name={session.user.name}
					className="transition-transform"
				/>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions" disabledKeys={["settings"]}>
				{
					session.user.scopes.includes("mission.admin") ? (
						<>
							<DropdownItem key="missions" startContent={<CustomIcon icon={solarCalendarOutline} width={19} />} href="/admin/missions">
								Admin - Missions
							</DropdownItem>
							<DropdownItem key="accounts" showDivider={true} startContent={<CustomIcon icon={solarUserOutline} width={19} />} href="/admin/accounts">
								Admin - Accounts
							</DropdownItem>
						</>
					) : null
				}
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