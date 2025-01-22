"use client";

import { usePathname, useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import CustomIcon from "@/components/CustomIcon";
import { Avatar } from "@heroui/react";
import SidebarItem from "./sidebarItem";
import { Session } from "next-auth";

/* ---------------------------------- Icons --------------------------------- */
import icRoundLogout from "@iconify/icons-ic/round-logout";
import icRoundLogin from "@iconify/icons-ic/round-login";


interface AccountHandlerProps {
	session: Session | null;
}
export default function AccountHandler({ session }: AccountHandlerProps) {
	const pathname = usePathname();
	const router = useRouter();

	return (
		<>
			{session && (
				<SidebarItem
					leading={<Avatar size="sm" src={session.user?.image ?? ""} alt={session.user?.name ?? ""} />}
					trailing={<>
						<p className="ml-3 text-small font-medium text-default-700">
							{session.user?.name ?? ""}
						</p>
					</>}
				/>
            )}
			{session && (
				<SidebarItem
					onClick={() => signOut()} // @todo is this correct redirect?
					leading={<CustomIcon className="w-[22px]" icon={icRoundLogout} width={22} />}
					trailing={<h1 className="font-bold">Logout</h1>}
				/>
			)}
			{!session && (
				<SidebarItem
					// @todo fix library to push to auth url
					onClick={() => signIn("keycloak")}
					leading={<CustomIcon className="w-[22px]" icon={icRoundLogin} width={22} />}
					trailing={<h1 className="font-bold">Login</h1>}
				/>
			)}
		</>
    );
}
